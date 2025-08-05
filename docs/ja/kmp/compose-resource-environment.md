# ローカルリソース環境を管理する

ユーザーが言語やテーマの変更など、アプリ内でのエクスペリエンスをカスタマイズできるように、アプリ内設定を管理する必要があるかもしれません。
アプリケーションのリソース環境を動的に更新するには、アプリケーションで使用される以下のリソース関連設定を構成できます。

*   [ロケール（言語と地域）](#locale)
*   [テーマ](#theme)
*   [解像度密度](#density)

## ロケール

各プラットフォームは、言語や地域などのロケール設定を異なる方法で処理します。共通のパブリックAPIが実装されるまでの一時的な回避策として、共通コードで共通のエントリーポイントを定義する必要があります。その後、プラットフォーム固有のAPIを使用して、各プラットフォームに対応する宣言を提供します。

*   **Android**: [`context.resources.configuration.locale`](https://developer.android.com/reference/android/content/res/Configuration#setLocale(java.util.Locale))
*   **iOS**: [`NSLocale.preferredLanguages`](https://developer.apple.com/documentation/foundation/nslocale/preferredlanguages)
*   **デスクトップ**: [`Locale.getDefault()`](https://developer.android.com/reference/java/util/Locale#getDefault(java.util.Locale.Category))
*   **Web**: [`window.navigator.languages`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/languages)

1.  共通ソースセットで、`expect`キーワードを使用して予期される`LocalAppLocale`オブジェクトを定義します。

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

2.  Androidソースセットで、`context.resources.configuration.locale`を使用する`actual`実装を追加します。

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

3.  iOSソースセットで、`NSLocale.preferredLanguages`を変更する`actual`実装を追加します。

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

4.  デスクトップソースセットで、`Locale.getDefault()`を使用してJVMのデフォルトロケールを更新する`actual`実装を追加します。

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

5.  Webプラットフォームでは、`window.navigator.languages`プロパティの読み取り専用制限を回避して、カスタムロケールロジックを導入します。

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

    その後、ブラウザの`index.html`で、アプリケーションスクリプトをロードする前に以下のコードを配置します。

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

## テーマ

Compose Multiplatformは、`isSystemInDarkTheme()`を介して現在のテーマを定義します。
テーマはプラットフォームによって異なる方法で処理されます。

*   Androidは、以下のビット演算によってテーマを定義します。
    ```kotlin
        Resources.getConfiguration().uiMode and Configuration.UI_MODE_NIGHT_MASK
    ```
*   iOS、デスクトップ、およびWebプラットフォームは`LocalSystemTheme.current`を使用します。

共通のパブリックAPIが実装されるまでの一時的な回避策として、`expect-actual`メカニズムを使用して、プラットフォーム固有のテーマのカスタマイズを管理することで、この違いに対処できます。

1.  共通コードで、`expect`キーワードを使用して予期される`LocalAppTheme`オブジェクトを定義します。

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

2.  Androidコードで、`LocalConfiguration` APIを使用する`actual`実装を追加します。

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

3.  iOS、デスクトップ、およびWebプラットフォームでは、`LocalSystemTheme`を直接変更できます。

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

## 密度

アプリケーションの解像度`Density`を変更するには、すべてのプラットフォームでサポートされている共通の`LocalDensity` APIを使用できます。

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

## 次のステップ

*   [リソース修飾子](compose-multiplatform-resources-setup.md#qualifiers)の詳細を確認する。
*   [リソースをローカライズ](compose-localize-strings.md)する方法を学ぶ。