[//]: # (title: 深度連結)

深度連結是一種導航機制，它允許作業系統處理自訂連結，將使用者引導至對應應用程式中的特定目的地。

深度連結是應用程式連結（Android 上的稱謂）或通用連結（iOS 術語）的一個更為通用的概念：它們是應用程式與特定網址之間的已驗證連接。若要了解更多詳情，請參閱 [Android 應用程式連結](https://developer.android.com/training/app-links) 和 [iOS 通用連結](https://developer.apple.com/documentation/xcode/allowing-apps-and-websites-to-link-to-your-content/) 的文件。

深度連結對於將外部輸入帶入應用程式也很有用，例如在 OAuth 授權的情況下：您可以解析深度連結並獲取 OAuth 權杖 (token)，而無需讓使用者進行視覺導航。

> 由於外部輸入可能具有惡意，請務必遵循 [安全指南](https://developer.android.com/privacy-and-security/risks/unsafe-use-of-deeplinks)，以妥善降低處理原始深度連結 URI 所帶來的風險。
> 
{style="warning"}

要在 Compose Multiplatform 中實作深度連結：

1. [在應用程式設定中註冊您的深度連結方案](#register-deep-links-schemas-in-the-operating-system)
2. [將特定深度連結分配給導航圖中的目的地](#assign-deep-links-to-destinations)
3. [處理應用程式接收到的深度連結](#handle-received-deep-links)

## 設定

若要在 Compose Multiplatform 中使用深度連結，請依以下方式設定依賴項。

請在您的 Gradle 目錄中列出以下版本、函式庫和外掛程式：

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

將額外的依賴項新增至共用模組的 `build.gradle.kts`：

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

## 在作業系統中註冊深度連結方案

每個作業系統都有其處理深度連結的方式。參考您特定目標的文件會更可靠：

* 對於 Android 應用程式，深度連結方案是在 `AndroidManifest.xml` 檔案中宣告為 Intent 過濾器。請參閱 [Android 文件](https://developer.android.com/training/app-links/deep-linking?hl=en#adding-filters) 以了解如何正確設定 Intent 過濾器。
* 對於 iOS 和 macOS 應用程式，深度連結方案是在 `Info.plist` 檔案的 [CFBundleURLTypes](https://developer.apple.com/documentation/bundleresources/information-property-list/cfbundleurltypes) 鍵中宣告。

    > Compose Multiplatform [提供 Gradle DSL](compose-native-distribution.md#information-property-list-on-macos) 來為 macOS 應用程式的 `Info.plist` 新增值。對於 iOS，您可以在 KMP 專案中直接編輯檔案，或 [使用 Xcode GUI 註冊方案](https://developer.apple.com/documentation/xcode/defining-a-custom-url-scheme-for-your-app#Register-your-URL-scheme)。
    >
    {style="note"}
* 對於 Windows 應用程式，可以透過將[必要資訊的鍵新增至 Windows 登錄檔](https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/aa767914(v=vs.85))（適用於 Windows 8 及更早版本）或透過在[套件清單](https://learn.microsoft.com/en-us/windows/apps/develop/launch/handle-uri-activation)中指定擴充功能（適用於 Windows 10 和 11）來宣告深度連結方案。這可以透過安裝腳本或第三方發行套件產生器（例如 [Hydraulic Conveyor](https://conveyor.hydraulic.dev/)）來完成。Compose Multiplatform 不支援在專案本身內進行此設定。
    
    > 請確保您沒有使用 [Windows 保留的方案](https://learn.microsoft.com/en-us/windows/apps/develop/launch/reserved-uri-scheme-names#reserved-uri-scheme-names)之一。
    >
    {style="tip"}
* 對於 Linux，深度連結方案可以在發行版中包含的 `.desktop` 檔案中註冊。

## 將深度連結分配給目的地

在導航圖中宣告的目的地具有一個可選的 `deepLinks` 參數，該參數可以儲存對應的 `NavDeepLink` 物件列表。每個 `NavDeepLink` 描述了一個應與目的地匹配的 URI 模式 – 您可以定義多個 URI 模式，這些模式都應引導至同一個螢幕。

您可以為一個路由定義的深度連結數量沒有限制。

### 深度連結的一般 URI 模式

一般 URI 模式應匹配整個 URI。您可以使用參數的佔位符，以便從目的地內接收到的 URI 中提取它們。

一般 URI 模式的規則：

* 沒有方案 (scheme) 的 URI 會被假定為以 `http://` 或 `https://` 開頭。因此 `uriPattern = "example.com"` 會匹配 `http://example.com` 和 `https://example.com`。
* `{placeholder}` 匹配一個或多個字元（`example.com/name={name}` 匹配 `https://example.com/name=Bob`）。若要匹配零個或多個字元，請使用 `.*` 萬用字元（`example.com/name={.*}` 匹配 `https://example.com/name=` 以及 `name` 的任何值）。
* 路徑佔位符的參數是必需的，而匹配查詢佔位符是可選的。例如，模式 `example.com/users/{id}?arg1={arg1}&arg2={arg2}`：
    * 不匹配 `http://www.example.com/users?arg1=one&arg2=two`，因為路徑中必需的部分 (`id`) 缺失。
    * 匹配 `http://www.example.com/users/4?arg2=two` 和 `http://www.example.com/users/4?arg1=one`。
    * 也匹配 `http://www.example.com/users/4?other=random`，因為多餘的查詢參數不影響匹配。
* 如果多個 composable 具有與接收到的 URI 匹配的 `navDeepLink`，則行為是不確定的。請確保您的深度連結模式沒有交集。如果您需要多個 composable 來處理相同的深度連結模式，請考慮新增路徑或查詢參數，或使用中間目的地來可預測地路由使用者。

### 路由類型的生成 URI 模式

您可以避免完整寫出 URI 模式：導航函式庫可以根據路由的參數自動生成 URI 模式。

若要使用此方法，請像這樣定義一個深度連結：

```kotlin
composable<PlantDetail>(
    deepLinks = listOf(
        navDeepLink<PlantDetail>(basePath = "demo://example.com/plant")
    )
) { ... }
```

此處的 `PlantDetail` 是您用於目的地的路由類型，而 `basePath` 中的「plant」是 `PlantDetail` 資料類別的序列名稱。

URI 模式的其餘部分將按以下方式生成：

* 必需的參數將作為路徑參數附加（例如：`/{id}`）
* 帶有預設值（可選參數）的參數將作為查詢參數附加（例如：`?name={name}`）
* 集合將作為查詢參數附加（例如：`?items={value1}&items={value2}`）
* 參數的順序與路由定義中欄位的順序匹配。

因此，例如，此路由類型：

```kotlin
@Serializable data class PlantDetail(
  val id: String,
  val name: String,
  val colors: List<String>,
  val latinName: String? = null,
)
```

具有函式庫生成的以下 URI 模式：

```none
<basePath>/{id}/{name}/?colors={color1}&colors={color2}&latinName={latinName}
```

### 將深度連結新增至目的地的範例

在此範例中，我們將多個深度連結分配給一個目的地，然後從接收到的 URI 中提取參數值：

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
            // 此 composable 應處理 demo://example1.org 和 demo://example2.org 的連結
            navDeepLink { uriPattern = "$firstBasePath?name={name}" },
            navDeepLink { uriPattern = "demo://example2.org/name={name}" },
            // 生成的模式只處理參數，
            // 因此我們為路由類型新增序列名稱
            navDeepLink<Screen3>(basePath = "$firstBasePath/dlscreen"),
        )
    ) {
        // 如果應用程式接收到 URI `demo://example1.org/dlscreen/Jane/`，
        // 它會匹配生成的 URI 模式（name 是一個必需參數並在路徑中給定），
        // 您可以自動將其映射到路由類型
        val deeplink: DeepLinkScreen = backStackEntry.toRoute()
        val nameGenerated = deeplink.name
        
        // 如果應用程式接收到僅匹配一般模式的 URI，
        // 例如 `demo://example1.com/?name=Jane` 
        // 您需要直接解析 URI
        val nameGeneral = backStackEntry.arguments?.read { getStringOrNull("name") }
        
        // Composable 內容
    }
}
```

對於網頁，深度連結的工作方式略有不同：由於 Compose Multiplatform for Web 建立單頁應用程式，您需要將深度連結 URI 模式的所有參數放入 URL 片段（在 `#` 字元之後），並確保所有參數都經過 URL 編碼。

如果 URL 片段符合 URI 模式規則，您仍然可以使用 `backStackEntry.toRoute()` 方法來解析參數。有關在網頁應用程式中存取和解析 URL 的詳細資訊，以及瀏覽器導航的具體情況，請參閱 [undefined](compose-navigation-routing.md#support-for-browser-navigation-in-web-apps)。

```kotlin
composable<DeepLinkScreen>(
        deepLinks = listOf(
            // 對於預設的 Compose Multiplatform 設定，localhost:8080
            // 是與 wasmJsBrowserDevelopmentRun Gradle 任務一起執行的本地開發端點
            navDeepLink { uriPattern = "localhost:8080/#dlscreen%2F{name}" },
        )
    ) { ... }
```

> 如同任何其他單頁網頁應用程式，您可以避免在網頁上使用 URL 片段。為此，您必須配置您的網路伺服器以將適當的請求重新導向到應用程式，並重寫[導航路由到瀏覽器地址的預設映射](compose-navigation-routing.md#full-url-customization)。
>
{style="tip"}

## 處理接收到的深度連結

在 Android 上，發送到應用程式的深度連結 URI 作為觸發深度連結的 `Intent` 的一部分可用。跨平台實作需要一種通用的方式來監聽深度連結。

讓我們建立一個最基本的實作：

1. 在共用程式碼中宣告一個單例物件，用於儲存和快取帶有外部 URI 監聽器的 URI。
2. 必要時，實作平台特定的呼叫，發送從作業系統接收到的 URI。
3. 在主 composable 中設定新深度連結的監聽器。

### 宣告帶有 URI 監聽器的單例物件

在 `commonMain` 中，在頂層宣告單例物件：

```kotlin
object ExternalUriHandler {
    // 用於在監聽器設定前 URI 到達時的儲存
    private var cached: String? = null
    
    var listener: ((uri: String) -> Unit)? = null
        set(value) {
            field = value
            if (value != null) {
                // 當監聽器已設定且 `cached` 不為空時，
                // 立即使用快取的 URI 調用監聽器
                cached?.let { value.invoke(it) }
                cached = null
            }
        }

    // 當新 URI 到達時，將其快取。
    // 如果監聽器已設定，則立即調用它並清除快取。
    fun onNewUri(uri: String) {
        cached = uri
        listener?.let {
            it.invoke(uri)
            cached = null
        }
    }
}
```

### 實作對單例物件的平台特定呼叫

對於桌面 JVM 和 iOS，您都需要明確傳遞從系統接收到的 URI。

在 `jvmMain/.../main.kt` 中，解析每個必要作業系統的命令列參數，並將接收到的 URI 傳遞給單例物件：

```kotlin
// 匯入單例物件
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
// 匯入 KMP 模組以存取單例物件
import ComposeApp

func application(
    _ application: UIApplication,
    open uri: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
) -> Bool {
    // 將完整 URI 發送給單例物件
    ExternalUriHandler.shared.onNewUri(uri: uri.absoluteString)    
        return true
    }
```

> 有關從 Swift 存取單例物件的命名慣例，請參閱 [Kotlin/Native 文件](https://kotlinlang.org/docs/native-objc-interop.html#kotlin-singletons)。
> 
{style="tip"}

### 設定監聽器

您可以使用 `DisposableEffect(Unit)` 來設定監聽器，並在 composable 不再活躍後進行清理。例如：

```kotlin
internal fun App(navController: NavHostController = rememberNavController()) = AppTheme {

    // 此 effect 只會產生一次，因為 `Unit` 永不改變
    DisposableEffect(Unit) {
        // 設定監聽器以調用 `NavController.navigate()`，
        // 對於列表中具有匹配 `navDeepLink` 的 composable
        ExternalUriHandler.listener = { uri ->
            navController.navigate(NavUri(uri))
        }
        // 當 composable 不再活躍時移除監聽器
        onDispose {
            ExternalUriHandler.listener = null
        }
    }

    // 重複使用本文前面部分的範例
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
            // Composable 內容
        }
    }
}
```

## 結果

現在您可以看到完整的工作流程：當使用者打開 `demo://` URI 時，作業系統會將其與已註冊的方案匹配。然後：
  * 如果處理深度連結的應用程式已關閉，單例物件會接收並快取 URI。當主 composable 函式啟動時，它會呼叫單例物件並導航到與快取 URI 匹配的深度連結。
  * 如果處理深度連結的應用程式已開啟，監聽器已設定，因此當單例物件接收到 URI 時，應用程式會立即導航到該 URI。