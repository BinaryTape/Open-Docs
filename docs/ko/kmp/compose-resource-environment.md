# 로컬 리소스 환경 관리

사용자가 언어나 테마 변경과 같이 경험을 커스터마이즈할 수 있도록 앱 내 설정을 관리해야 할 수 있습니다.
애플리케이션의 리소스 환경을 동적으로 업데이트하려면, 애플리케이션에서 사용하는 다음과 같은 리소스 관련 설정을 구성할 수 있습니다:

* [로케일 (언어 및 지역)](#locale)
* [테마](#theme)
* [해상도 밀도](#density)

## 로케일

각 플랫폼은 언어 및 지역과 같은 로케일 설정을 다르게 처리합니다. 공통 공개 API가 구현될 때까지 임시적인 해결책으로, 공유 코드에 공통 진입점을 정의해야 합니다. 그런 다음, 플랫폼별 API를 사용하여 각 플랫폼에 해당하는 선언을 제공합니다:

* **Android**: [`context.resources.configuration.locale`](https://developer.android.com/reference/android/content/res/Configuration#setLocale(java.util.Locale))
* **iOS**: [`NSLocale.preferredLanguages`](https://developer.apple.com/documentation/foundation/nslocale/preferredlanguages)
* **데스크톱**: [`Locale.getDefault()`](https://developer.android.com/reference/java/util/Locale#getDefault(java.util.Locale.Category))
* **웹**: [`window.navigator.languages`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/languages)

1.  공통 소스 세트에서 `expect` 키워드를 사용하여 예상되는 `LocalAppLocale` 객체를 정의합니다:

    ```kotlin
    var customAppLocale by mutableStateOf<String?>(null)
    expect object LocalAppLocale {
        val current: String @Composable get
        @Composable infix fun provides(value: String?): ProvidedValue<*>
    }
    
    @Composable
    fun AppEnvironment(content: @Composable () -> Unit) {
        CompositionLocalProvider(
            LocalAppLocale provides customAppLocale,
        ) {
            key(customAppLocale) {
                content()
            }
        }
    }
    ```

2.  Android 소스 세트에서 `context.resources.configuration.locale`을 사용하는 `actual` 구현을 추가합니다:

    ```kotlin
    actual object LocalAppLocale {
        private var default: Locale? = null
        actual val current: String
            @Composable get() = Locale.getDefault().toString()
    
        @Composable
        actual infix fun provides(value: String?): ProvidedValue<*> {
            val configuration = LocalConfiguration.current
    
            if (default == null) {
                default = Locale.getDefault()
            }
    
            val new = when(value) {
                null -> default!!
                else -> Locale(value)
            }
            Locale.setDefault(new)
            configuration.setLocale(new)
            val resources = LocalContext.current.resources
    
            resources.updateConfiguration(configuration, resources.displayMetrics)
            return LocalConfiguration.provides(configuration)
        }
    }
    ```

3.  iOS 소스 세트에서 `NSLocale.preferredLanguages`를 수정하는 `actual` 구현을 추가합니다:

    ```kotlin
    @OptIn(InternalComposeUiApi::class)
    actual object LocalAppLocale {
        private const val LANG_KEY = "AppleLanguages"
        private val default = NSLocale.preferredLanguages.first() as String
        private val LocalAppLocale = staticCompositionLocalOf { default }
        actual val current: String
            @Composable get() = LocalAppLocale.current
    
        @Composable
        actual infix fun provides(value: String?): ProvidedValue<*> {
            val new = value ?: default
            if (value == null) {
                NSUserDefaults.standardUserDefaults.removeObjectForKey(LANG_KEY)
            } else {
                NSUserDefaults.standardUserDefaults.setObject(arrayListOf(new), LANG_KEY)
            }
            return LocalAppLocale.provides(new)
        }
    }
    ```

4.  데스크톱 소스 세트에서 `Locale.getDefault()`을 사용하여 JVM의 기본 로케일을 업데이트하는 `actual` 구현을 추가합니다:

    ```kotlin
    actual object LocalAppLocale {
        private var default: Locale? = null
        private val LocalAppLocale = staticCompositionLocalOf { Locale.getDefault().toString() }
        actual val current: String
            @Composable get() = LocalAppLocale.current
    
        @Composable
        actual infix fun provides(value: String?): ProvidedValue<*> {
            if (default == null) {
                default = Locale.getDefault()
            }
            val new = when(value) {
                null -> default!!
                else -> Locale(value)
            }
            Locale.setDefault(new)
            return LocalAppLocale.provides(new.toString())
        }
    }
    ```

5.  웹 플랫폼의 경우, `window.navigator.languages` 속성의 읽기 전용 제한을 우회하여 사용자 지정 로케일 로직을 도입합니다:

    ```kotlin
    external object window {
        var __customLocale: String?
    }
    
    actual object LocalAppLocale {
        private val LocalAppLocale = staticCompositionLocalOf { Locale.current }
        actual val current: String
            @Composable get() = LocalAppLocale.current.toString()
    
        @Composable
        actual infix fun provides(value: String?): ProvidedValue<*> {
            window.__customLocale = value?.replace('_', '-')
            return LocalAppLocale.provides(Locale.current)
        }
    }
    ```

    그런 다음, 브라우저의 `index.html`에서 애플리케이션 스크립트를 로드하기 전에 다음 코드를 넣으세요:

    ```html    
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            ...
            <script>
                var currentLanguagesImplementation = Object.getOwnPropertyDescriptor(Navigator.prototype, "languages");
                var newLanguagesImplementation = Object.assign({}, currentLanguagesImplementation, {
                    get: function () {
                        if (window.__customLocale) {
                            return [window.__customLocale];
                        } else {
                            return currentLanguagesImplementation.get.apply(this);
                        }
                    }
                });
        
                Object.defineProperty(Navigator.prototype, "languages", newLanguagesImplementation)
            </script>
            <script src="skiko.js"></script>
            ...
        </head>
        <body></body>
        <script src="composeApp.js"></script>
    </html>
    ```  

## 테마 

Compose Multiplatform은 `isSystemInDarkTheme()`을 통해 현재 테마를 정의합니다. 
테마는 플랫폼마다 다르게 처리됩니다:

* Android는 다음 비트 연산을 통해 테마를 정의합니다: 
    ```kotlin
        Resources.getConfiguration().uiMode and Configuration.UI_MODE_NIGHT_MASK
    ```
* iOS, 데스크톱, 웹 플랫폼은 `LocalSystemTheme.current`를 사용합니다.

공통 공개 API가 구현될 때까지 임시적인 해결책으로, `expect-actual` 메커니즘을 사용하여 플랫폼별 테마 커스터마이징을 관리할 수 있습니다:

1.  공통 코드에서 `expect` 키워드를 사용하여 예상되는 `LocalAppTheme` 객체를 정의합니다:
 
    ```kotlin
    var customAppThemeIsDark by mutableStateOf<Boolean?>(null)
    expect object LocalAppTheme {
        val current: Boolean @Composable get
        @Composable infix fun provides(value: Boolean?): ProvidedValue<*>
    }
    
    @Composable
    fun AppEnvironment(content: @Composable () -> Unit) {
        CompositionLocalProvider(
            LocalAppTheme provides customAppThemeIsDark,
        ) {
            key(customAppThemeIsDark) {
                content()
            }
        }
    }
    ```

2.  Android 코드에서 `LocalConfiguration` API를 사용하는 실제 구현을 추가합니다:

   ```kotlin
    actual object LocalAppTheme {
        actual val current: Boolean
            @Composable get() = (LocalConfiguration.current.uiMode and UI_MODE_NIGHT_MASK) == UI_MODE_NIGHT_YES
    
        @Composable
        actual infix fun provides(value: Boolean?): ProvidedValue<*> {
            val new = if (value == null) {
                LocalConfiguration.current
            } else {
                Configuration(LocalConfiguration.current).apply {
                    uiMode = when (value) {
                        true -> (uiMode and UI_MODE_NIGHT_MASK.inv()) or UI_MODE_NIGHT_YES
                        false -> (uiMode and UI_MODE_NIGHT_MASK.inv()) or UI_MODE_NIGHT_NO
                    }
                }
            }
            return LocalConfiguration.provides(new)
        }
    }
    ```

3.  iOS, 데스크톱, 웹 플랫폼에서는 `LocalSystemTheme`을 직접 변경할 수 있습니다:

    ```kotlin
    @OptIn(InternalComposeUiApi::class)
    actual object LocalAppTheme {
        actual val current: Boolean
            @Composable get() = LocalSystemTheme.current == SystemTheme.Dark
    
        @Composable
        actual infix fun provides(value: Boolean?): ProvidedValue<*> {
            val new = when(value) {
                true -> SystemTheme.Dark
                false -> SystemTheme.Light
                null -> LocalSystemTheme.current
            }
    
            return LocalSystemTheme.provides(new)
        }
    }
    ```

## 밀도

애플리케이션의 해상도 `Density`를 변경하려면, 모든 플랫폼에서 지원되는 공통 `LocalDensity` API를 사용할 수 있습니다:

```kotlin
var customAppDensity by mutableStateOf<Density?>(null)
object LocalAppDensity {
    val current: Density
        @Composable get() = LocalDensity.current

    @Composable
    infix fun provides(value: Density?): ProvidedValue<*> {
        val new = value ?: LocalDensity.current
        return LocalDensity.provides(new)
    }
}

@Composable
fun AppEnvironment(content: @Composable () -> Unit) {
    CompositionLocalProvider(
        LocalAppDensity provides customAppDensity,
    ) {
        key(customAppDensity) {
            content()
        }
    }
}
```

## 다음 단계는?

* [리소스 한정자](compose-multiplatform-resources-setup.md#qualifiers)에 대한 자세한 내용을 확인하세요.
* [리소스 지역화](compose-localize-strings.md) 방법을 알아보세요.