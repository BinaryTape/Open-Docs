[//]: # (title: 深度連結)

深度連結是一種導航機制，它允許作業系統透過將使用者帶到對應應用程式中的特定目的地來處理自訂連結。

深度連結是應用程式連結（Android 上的稱謂）或通用連結（iOS 術語）的更一般情況：這些是應用程式與特定網頁位址的已驗證連線。若要具體了解它們，請參閱 [Android 應用程式連結](https://developer.android.com/training/app-links)和 [iOS 通用連結](https://developer.apple.com/documentation/xcode/allowing-apps-and-websites-to-link-to-your-content/)的相關文件。

深度連結對於將外部輸入帶入應用程式也很有用，例如，在 OAuth 授權的情況下：您可以解析深度連結並取得 OAuth 權杖，而無需視覺導航使用者。

> 由於外部輸入可能具有惡意，請務必遵循[安全指南](https://developer.android.com/privacy-and-security/risks/unsafe-use-of-deeplinks)以適當降低處理原始深度連結 URI 所帶來的風險。
>
{style="warning"}

要在 Compose Multiplatform 中實作深度連結：

1.  [在應用程式組態中註冊您的深度連結綱要](#register-deep-links-schemas-in-the-operating-system)
2.  [將特定深度連結指派給導航圖中的目的地](#assign-deep-links-to-destinations)
3.  [處理應用程式接收到的深度連結](#handle-received-deep-links)

## 設定

若要將深度連結與 Compose Multiplatform 搭配使用，請按如下方式設定相依性。

在您的 Gradle 目錄中列出這些版本、程式庫和外掛程式：

```ini
[versions]
compose-multiplatform = "%org.jetbrains.compose%"
agp = "8.9.0"

# The multiplatform Navigation library version with deep link support 
androidx-navigation = "%org.jetbrains.androidx.navigation%"

# Minimum Kotlin version to use with Compose Multiplatform 1.8.0
kotlin = "2.1.0"

# Serialization library necessary to implement type-safe routes
kotlinx-serialization = "1.7.3"

[libraries]
navigation-compose = { module = "org.jetbrains.androidx.navigation:navigation-compose", version.ref = "androidx-navigation" }
kotlinx-serialization-json = { module = "org.jetbrains.kotlinx:kotlinx-serialization-json", version.ref = "kotlinx-serialization" }

[plugins]
multiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
compose-compiler = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
compose = { id = "org.jetbrains.compose", version.ref = "compose-multiplatform" }
kotlinx-serialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlin" }
android-application = { id = "com.android.application", version.ref = "agp" }
```

將額外相依性新增到共享模組的 `build.gradle.kts`：

```kotlin
plugins {
    // ...
    alias(libs.plugins.kotlinx.serialization)
}

// ...

kotlin {
    // ...
    sourceSets {
        commonMain.dependencies {
            // ...
            implementation(libs.androidx.navigation.compose)
            implementation(libs.kotlinx.serialization.json)
        }
    }
}
```

## 在作業系統中註冊深度連結綱要

每個作業系統都有其處理深度連結的方式。更可靠的做法是參考特定目標的文件：

*   對於 Android 應用程式，深度連結綱要會在 `AndroidManifest.xml` 檔案中宣告為意圖過濾器。請參閱 [Android 文件](https://developer.android.com/training/app-links/deep-linking?hl=en#adding-filters)以了解如何正確設定意圖過濾器。
*   對於 iOS 和 macOS 應用程式，深度連結綱要會在 `Info.plist` 檔案中宣告，位於 [`CFBundleURLTypes`](https://developer.apple.com/documentation/bundleresources/information-property-list/cfbundleurltypes) 鍵下。

    > Compose Multiplatform [提供 Gradle DSL](compose-native-distribution.md#information-property-list-on-macos) 來為 macOS 應用程式的 `Info.plist` 新增值。對於 iOS，您可以在 KMP 專案中直接編輯檔案，或[使用 Xcode GUI 註冊綱要](https://developer.apple.com/documentation/xcode/defining-a-custom-url-scheme-for-your-app#Register-your-URL-scheme)。
    >
    {style="note"}
*   對於 Windows 應用程式，深度連結綱要可以透過新增[具有必要資訊的金鑰到 Windows 登錄](https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/aa767914(v=vs.85))（適用於 Windows 8 及更早版本）或透過在[套件資訊清單中指定擴展](https://learn.microsoft.com/en-us/windows/apps/develop/launch/handle-uri-activation)（適用於 Windows 10 和 11）來宣告。這可以透過安裝腳本或第三方發行套件產生器（例如 [Hydraulic Conveyor](https://conveyor.hydraulic.dev/)）完成。Compose Multiplatform 不支援在專案本身內進行此設定。

    > 確保您沒有使用[ Windows 保留的綱要](https://learn.microsoft.com/en-us/windows/apps/develop/launch/reserved-uri-scheme-names#reserved-uri-scheme-names)之一。
    >
    {style="tip"}
*   對於 Linux，深度連結綱要可以在分發中包含的 `.desktop` 檔案中註冊。

## 將深度連結指派給目的地

宣告為導航圖一部分的目的地具有一個可選的 `deepLinks` 參數，該參數可以容納對應的 `NavDeepLink` 物件列表。每個 `NavDeepLink` 都描述了一個應與目的地匹配的 URI 模式 – 您可以定義多個 URI 模式，這些模式應導向相同的螢幕。

您可以為一個路由定義的深度連結數量沒有限制。

### 深度連結的一般 URI 模式

一般 URI 模式應比對整個 URI。您可以使用參數的預留位置，從目的地內接收到的 URI 中擷取它們。

一般 URI 模式的規則：

*   沒有綱要的 URI 假定以 `http://` 或 `https://` 開頭。因此 `uriPattern = "example.com"` 比對 `http://example.com` 和 `https://example.com`。
*   `{placeholder}` 比對一個或多個字元（`example.com/name={name}` 比對 `https://example.com/name=Bob`）。若要比對零個或多個字元，請使用 `.*` 萬用字元（`example.com/name={.*}` 比對 `https://example.com/name=` 以及 `name` 的任何值）。
*   路徑預留位置的參數是必需的，而查詢預留位置的比對是可選的。例如，模式 `example.com/users/{id}?arg1={arg1}&arg2={arg2}`：
    *   不比對 `http://www.example.com/users?arg1=one&arg2=two`，因為路徑中必需的部分（`id`）缺失。
    *   比對 `http://www.example.com/users/4?arg2=two` 和 `http://www.example.com/users/4?arg1=one`。
    *   也比對 `http://www.example.com/users/4?other=random`，因為多餘的查詢參數不影響比對。
*   如果有多個可組合項目具有與接收到的 URI 匹配的 `navDeepLink`，則行為是不確定的。請確保您的深度連結模式沒有交集。如果您需要多個可組合項目處理相同的深度連結模式，請考慮新增路徑或查詢參數，或使用中間目的地來可預測地路由使用者。

### 路由型別的生成 URI 模式

您可以避免完全寫出 URI 模式：導航程式庫可以根據路由的參數自動生成 URI 模式。

若要使用此方法，請如下定義深度連結：

```kotlin
composable<PlantDetail>(
    deepLinks = listOf(
        navDeepLink<PlantDetail>(basePath = "demo://example.com/plant")
    )
) { ... }
```

這裡的 `PlantDetail` 是您用於目的地的路由型別，而 `basePath` 中的「plant」是 `PlantDetail` 資料類別的序列名稱。

URI 模式的其餘部分將按以下方式生成：

*   必需參數作為路徑參數附加（例如：`/{id}`）
*   帶有預設值（可選參數）的參數作為查詢參數附加（例如：`?name={name}`）
*   集合作為查詢參數附加（例如：`?items={value1}&items={value2}`）
*   參數順序符合路由定義中欄位的順序。

因此，例如，此路由型別：

```kotlin
@Serializable data class PlantDetail(
  val id: String,
  val name: String,
  val colors: List<String>,
  val latinName: String? = null,
)
```

由程式庫生成以下 URI 模式：

```none
<basePath>/{id}/{name}/?colors={color1}&colors={color2}&latinName={latinName}
```

### 將深度連結新增到目的地的範例

在此範例中，我們為一個目的地指派多個深度連結，然後從接收到的 URI 中擷取參數值：

```kotlin
@Serializable @SerialName("dlscreen") data class DeepLinkScreen(val name: String)

// ...

val firstBasePath = "demo://example1.org"

NavHost(
    navController = navController,
    startDestination = FirstScreen
) {
    // ...
    
    composable<DeepLinkScreen>(
        deepLinks = listOf(
            // This composable should handle links both for demo://example1.org and demo://example2.org
            navDeepLink { uriPattern = "$firstBasePath?name={name}" },
            navDeepLink { uriPattern = "demo://example2.org/name={name}" },
            // The generated pattern only handles the parameters,
            // so we add the serial name for the route type
            navDeepLink<Screen3>(basePath = "$firstBasePath/dlscreen"),
        )
    ) {
        // If the app receives the URI `demo://example1.org/dlscreen/Jane/`,
        // it matches the generated URI pattern (name is a required parameter and is given in the path),
        // and you can map it to the route type automatically
        val deeplink: DeepLinkScreen = backStackEntry.toRoute()
        val nameGenerated = deeplink.name
        
        // If the app receives a URI matching only a general pattern,
        // like `demo://example1.com/?name=Jane`
        // you need to parse the URI directly
        val nameGeneral = backStackEntry.arguments?.read { getStringOrNull("name") }
        
        // Composable content
    }
}
```

對於網頁，深度連結的工作方式略有不同：由於 Compose Multiplatform for Web 製作單頁應用程式，您需要將深度連結 URI 模式的所有參數放入 URL 片段（在 `#` 字元之後），並確保所有參數都經過 URL 編碼。

如果 URL 片段符合 URI 模式規則，您仍然可以使用 `backStackEntry.toRoute()` 方法來解析參數。有關在網頁應用程式中存取和解析 URL 的詳細資訊，以及瀏覽器導航的具體情況，請參閱 [](compose-navigation-routing.md#support-for-browser-navigation-in-web-apps)。

```kotlin
composable<DeepLinkScreen>(
        deepLinks = listOf(
            // For the default Compose Multiplatform setup, localhost:8080
            // is the local dev endpoint that runs with the wasmJsBrowserDevelopmentRun Gradle task
            navDeepLink { uriPattern = "localhost:8080/#dlscreen%2F{name}" },
        )
    ) { ... }
```

> 就像任何其他單頁網頁應用程式一樣，您可以避免在網頁上使用 URL 片段。為此，您必須設定您的網頁伺服器以將適當的請求重定向到應用程式，並重寫[導航路由到瀏覽器位址的預設映射](compose-navigation-routing.md#full-url-customization)。
>
{style="tip"}

## 處理接收到的深度連結

在 Android 上，發送到應用程式的深度連結 URI 作為觸發深度連結的 `Intent` 的一部分提供。跨平台實作需要一種通用的方式來監聽深度連結。

讓我們建立一個基本的實作：

1.  在共通程式碼中宣告一個單例物件，用於儲存和快取帶有外部 URI 監聽器的 URI。
2.  在必要時，實作將從作業系統接收到的 URI 發送出去的特定平台呼叫。
3.  在主要可組合項目中設定新深度連結的監聽器。

### 宣告帶有 URI 監聽器的單例物件

在 `commonMain` 中，在頂層宣告單例物件：

```kotlin
object ExternalUriHandler {
    // Storage for when a URI arrives before the listener is set up
    private var cached: String? = null
    
    var listener: ((uri: String) -> Unit)? = null
        set(value) {
            field = value
            if (value != null) {
                // When a listener is set and `cached` is not empty,
                // immediately invoke the listener with the cached URI
                cached?.let { value.invoke(it) }
                cached = null
            }
        }

    // When a new URI arrives, cache it.
    // If the listener is already set, invoke it and clear the cache immediately.
    fun onNewUri(uri: String) {
        cached = uri
        listener?.let {
            it.invoke(uri)
            cached = null
        }
    }
}
```

### 實作對單例物件的特定平台呼叫

對於桌面 JVM 和 iOS，您都需要明確傳遞從系統接收到的 URI。

在 `jvmMain/.../main.kt` 中，解析每個必要作業系統的命令列參數，並將接收到的 URI 傳遞給單例物件：

```kotlin
// Import the singleton
import org.company.app.ExternalUriHandler

fun main() {
    if(System.getProperty("os.name").indexOf("Mac") > -1) {
        Desktop.getDesktop().setOpenURIHandler { uri ->
            ExternalUriHandler.onNewUri(uri.uri.toString())
        }
    }
    else {
        ExternalUriHandler.onNewUri(args.getOrNull(0).toString())
    }

    application {
         // ...
    }
}
```

對於 iOS，在 Swift 程式碼中新增一個處理傳入 URI 的 `application()` 變體：

```swift
// Imports the KMP module to access the singleton
import ComposeApp

func application(
    _ application: UIApplication,
    open uri: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
) -> Bool {
    // Sends the full URI on to the singleton
    ExternalUriHandler.shared.onNewUri(uri: uri.absoluteString)    
        return true
    }
```

> 有關從 Swift 存取單例物件的命名慣例，請參閱 [Kotlin/Native 文件](https://kotlinlang.org/docs/native-objc-interop.html#kotlin-singletons)。
>
{style="tip"}

### 設定監聽器

您可以使用 `DisposableEffect(Unit)` 來設定監聽器並在可組合項目不再活躍後清理它。例如：

```kotlin
internal fun App(navController: NavHostController = rememberNavController()) = AppTheme {

    // The effect is produced only once, as `Unit` never changes
    DisposableEffect(Unit) {
        // Sets up the listener to call `NavController.navigate()`
        // for the composable that has a matching `navDeepLink` listed
        ExternalUriHandler.listener = { uri ->
            navController.navigate(NavUri(uri))
        }
        // Removes the listener when the composable is no longer active
        onDispose {
            ExternalUriHandler.listener = null
        }
    }

    // Reusing the example from earlier in this article
    NavHost(
        navController = navController,
        startDestination = FirstScreen
    ) {
        // ...

        composable<DeepLinkScreen>(
            deepLinks = listOf(
                navDeepLink { uriPattern = "$firstBasePath?name={name}" },
                navDeepLink { uriPattern = "demo://example2.com/name={name}" },
            )
        ) {
            // Composable content
        }
    }
}
```

## 結果

現在您可以看到完整的工作流程：當使用者打開 `demo://` URI 時，作業系統會將其與註冊的綱要匹配。然後：
  * 如果處理深度連結的應用程式已關閉，單例物件會接收 URI 並將其快取。當主要可組合函式啟動時，它會呼叫單例物件並導航到與快取 URI 匹配的深度連結。
  * 如果處理深度連結的應用程式已開啟，監聽器已經設定好，因此當單例物件接收到 URI 時，應用程式會立即導航到它。