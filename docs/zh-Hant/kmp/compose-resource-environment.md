# 管理本地資源環境

您可能需要管理應用程式內設定，以允許使用者客製化其體驗，例如變更語言或主題。
為了動態更新應用程式的資源環境，您可以配置應用程式使用的以下資源相關設定：

*   [語系 (語言與地區)](#locale)
*   [主題](#theme)
*   [解析度密度](#density)

## 語系

每個平台處理語系設定 (例如語言和地區) 的方式都不同。作為一個暫時性解決方案，在通用公共 API 實作之前，您需要在共享程式碼中定義一個共同進入點。然後，針對每個平台使用平台特定 API 提供對應的宣告：

*   **Android**: [`context.resources.configuration.locale`](https://developer.android.com/reference/android/content/res/Configuration#setLocale(java.util.Locale))
*   **iOS**: [`NSLocale.preferredLanguages`](https://developer.apple.com/documentation/foundation/nslocale/preferredlanguages)
*   **desktop**: [`Locale.getDefault()`](https://developer.android.com/reference/java/util/Locale#getDefault(java.util.Locale.Category))
*   **web**: [`window.navigator.languages`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/languages)

1.  在共同來源集中，使用 `expect` 關鍵字定義預期的 `LocalAppLocale` 物件：

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

2.  在 Android 來源集中，新增使用 `context.resources.configuration.locale` 的 `actual` 實作：

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

3.  在 iOS 來源集中，新增修改 `NSLocale.preferredLanguages` 的 `actual` 實作：

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

4.  在桌面來源集中，新增使用 `Locale.getDefault()` 更新 JVM 預設語系的 `actual` 實作：

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

5.  對於 Web 平台，繞過 `window.navigator.languages` 屬性的唯讀限制，以引入自訂語系邏輯：

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

    然後，在瀏覽器的 `index.html` 中，將以下程式碼放在載入應用程式腳本之前：

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

## 主題 

Compose Multiplatform 透過 `isSystemInDarkTheme()` 定義目前主題。
主題在不同平台上的處理方式不同：

*   Android 透過以下位元運算定義主題：
    ```kotlin
        Resources.getConfiguration().uiMode and Configuration.UI_MODE_NIGHT_MASK
    ```
*   iOS、桌面和 Web 平台使用 `LocalSystemTheme.current`。

作為一個暫時性解決方案，在通用公共 API 實作之前，您可以利用 `expect-actual` 機制來處理這種差異，以管理平台特定主題客製化：

1.  在共同程式碼中，使用 `expect` 關鍵字定義預期的 `LocalAppTheme` 物件：

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

2.  在 Android 程式碼中，新增使用 `LocalConfiguration` API 的 `actual` 實作：

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

3.  在 iOS、桌面和 Web 平台上，您可以直接變更 `LocalSystemTheme`：

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

## 解析度密度

要變更應用程式的解析度 `Density`，您可以使用共同的 `LocalDensity` API，所有平台均支援：

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

## 接下來是什麼？

*   取得更多關於[資源限定符](compose-multiplatform-resources-setup.md#qualifiers)的詳細資訊。
*   了解如何[本地化資源](compose-localize-strings.md)。