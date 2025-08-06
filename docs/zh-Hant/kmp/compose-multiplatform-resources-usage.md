[//]: # (title: 在您的應用程式中使用多平台資源)

<show-structure depth="2"/>

當您已[為專案設定資源](compose-multiplatform-resources-setup.md)後，
建置專案以生成特殊的 `Res` 類別，該類別提供對資源的存取。
若要重新生成 `Res` 類別和所有資源存取器，請再次建置專案或在 IDE 中重新匯入專案。

之後，您可以使用生成的類別從程式碼或外部函式庫存取配置的多平台資源。

## 匯入生成的類別

若要使用準備好的資源，請匯入生成的類別，例如：

```kotlin
import project.composeapp.generated.resources.Res
import project.composeapp.generated.resources.example_image
```

這裡：
* `project` 是您專案的名稱
* `composeapp` 是您放置資源目錄的模組
* `Res` 是生成類別的預設名稱
* `example_image` 是 `composeResources/drawable` 目錄中影像檔案的名稱（例如 `example_image.png`）。

## 自訂存取器類別生成

您可以使用 Gradle 設定自訂生成的 `Res` 類別以滿足您的需求。

在 `build.gradle.kts` 檔案的 `compose.resources {}` 區塊中，您可以指定多個設定，這些設定會影響
您的專案生成 `Res` 類別的方式。
範例配置如下所示：

```kotlin
compose.resources {
    publicResClass = false
    packageOfResClass = "me.sample.library.resources"
    generateResClass = auto
}
```

* `publicResClass` 設定為 `true` 會使生成的 `Res` 類別公開。預設情況下，生成的類別是 [internal](https://kotlinlang.org/docs/visibility-modifiers.html)。
* `packageOfResClass` 允許您將生成的 `Res` 類別指派給特定套件（以便在程式碼中存取，
    以及在最終產物中進行隔離）。預設情況下，Compose Multiplatform 會將
    `{group name}.{module name}.generated.resources` 套件指派給該類別。
* `generateResClass` 設定為 `always` 會使專案無條件生成 `Res` 類別。當資源函式庫僅以遞移方式可用時，
    這可能很有用。預設情況下，Compose Multiplatform 使用 `auto` 值
    僅當目前專案對資源函式庫具有明確的 `implementation` 或 `api` 依賴時才生成 `Res` 類別。

## 資源使用

### 影像

您可以將可繪製資源作為簡單影像、點陣圖影像或 XML 向量圖存取。
SVG 影像在所有平台（**除了** Android）上均受支援。

* 若要將可繪製資源作為 `Painter` 影像存取，請使用 `painterResource()` 函式：

  ```kotlin
  @Composable
  fun painterResource(resource: DrawableResource): Painter {...}
  ```

  `painterResource()` 函式接受資源路徑並返回 `Painter` 值。此函式在所有目標上同步工作，除了網頁目標。對於網頁目標，它會在第一次重組時返回一個空的 `Painter`，並在後續重組中替換為載入的影像。

  * `painterResource()` 載入點陣圖影像格式（例如 `.png`、`.jpg`、`.bmp`、`.webp`）的 `BitmapPainter`，
    或 Android XML 向量可繪製格式的 `VectorPainter`。
  * XML 向量可繪製與 [Android](https://developer.android.com/reference/android/graphics/drawable/VectorDrawable) 的格式相同，
    但它們不支援對 Android 資源的外部參考。

* 若要將可繪製資源作為 `ImageBitmap` 點陣圖影像存取，請使用 `imageResource()` 函式：

  ```kotlin
  @Composable
  fun imageResource(resource: DrawableResource): ImageBitmap {...}
  ```

* 若要將可繪製資源作為 `ImageVector` XML 向量圖存取，請使用 `vectorResource()` 函式：

  ```kotlin
  @Composable
  fun vectorResource(resource: DrawableResource): ImageVector {...}
  ```

以下是您如何在 Compose Multiplatform 程式碼中存取影像的範例：

```kotlin
Image(
    painter = painterResource(Res.drawable.my_icon),
    contentDescription = null
)
```

### 字串

將所有字串資源儲存在 `composeResources/values` 目錄中的 XML 檔案中。
每個檔案中的每個項目都會生成一個靜態存取器。

有關如何為不同地區設定字串本地化的更多資訊，請參閱
[字串本地化指南](compose-localize-strings.md)。

#### 簡單字串

若要儲存簡單字串，請將 `<string>` 元素新增到您的 XML 中：

```XML
<resources>
    <string name="app_name">My awesome app</string>
    <string name="title">Some title</string>
</resources>
```

若要將字串資源作為 `String` 取得，請使用以下程式碼：

<tabs>
<tab title= "從可組合程式碼中">

```kotlin
@Composable
fun stringResource(resource: StringResource): String {...}

@Composable
fun stringResource(resource: StringResource, vararg formatArgs: Any): String {...}
```

例如：

```kotlin
Text(stringResource(Res.string.app_name))
```

</tab>
<tab title= "從不可組合程式碼中">

```kotlin
suspend fun getString(resource: StringResource): String

suspend fun getString(resource: StringResource, vararg formatArgs: Any): String
```

例如：

```kotlin
coroutineScope.launch {
    val appName = getString(Res.string.app_name)
}
```

</tab>
</tabs>

您可以在字串資源中使用特殊符號：

* `
` – 表示換行符號
* `\t` – 表示 Tab 符號
* `\uXXXX` – 表示特定 Unicode 字元

您不需要像 [Android 字串](https://developer.android.com/guide/topics/resources/string-resource#escaping_quotes) 那樣逸出特殊的 XML 字元，例如 "@" 或 "?"。

#### 字串範本

目前，引數對字串資源有基本支援。
建立範本時，使用 `%<number>` 格式將引數放在字串中，並包含 `$d` 或 `$s` 尾碼，
以指示這是一個變數佔位符，而不是簡單的文字。
例如：

```XML
<resources>
    <string name="str_template">Hello, %2$s! You have %1$d new messages.</string>
</resources>
```

建立並匯入字串範本資源後，您可以參考它，同時
以正確的順序傳遞佔位符的引數：

```kotlin
Text(stringResource(Res.string.str_template, 100, "User_name"))
```

`$s` 和 `$d` 尾碼之間沒有區別，也不支援其他尾碼。
您可以將 `%1$s` 佔位符放入資源字串中，並用它來顯示小數，例如：

```kotlin
Text(stringResource(Res.string.str_template, "User_name", 100.1f))
```

#### 字串陣列

您可以將相關字串分組到陣列中，並自動將它們作為 `List<String>` 物件存取：

```XML
<resources>
    <string name="app_name">My awesome app</string>
    <string name="title">Some title</string>
    <string-array name="str_arr">
        <item>item \u2605</item>
        <item>item \u2318</item>
        <item>item \u00BD</item>
    </string-array>
</resources>
```

若要取得對應的列表，請使用以下程式碼：

<tabs>
<tab title= "從可組合程式碼中">

```kotlin
@Composable
fun stringArrayResource(resource: StringArrayResource): List<String> {...}
```

例如：

```kotlin
val arr = stringArrayResource(Res.array.str_arr)
if (arr.isNotEmpty()) Text(arr[0])
```

</tab>
<tab title= "從不可組合程式碼中">

```kotlin
suspend fun getStringArray(resource: StringArrayResource): List<String>
```

例如：

```kotlin
coroutineScope.launch {
    val appName = getStringArray(Res.array.str_arr)
}
```

</tab>
</tabs>

#### 複數

當您的 UI 顯示某物的數量時，您可能希望支援相同事物不同數量的文法一致性（一個 _書_，許多 _書_ 等），而無需以程式碼方式建立不相關的字串。

Compose Multiplatform 中的概念和基本實作與 Android 上的數量字串相同。
有關在專案中使用複數的最佳實踐和細微差別，請參閱 [Android 文件](https://developer.android.com/guide/topics/resources/string-resource#Plurals)。

* 支援的變體有 `zero`、`one`、`two`、`few`、`many` 和 `other`。請注意，並非所有語言都考慮所有變體：例如，對於英語，`zero` 被忽略，因為除了 1 之外，它與任何其他複數相同。請依賴語言專家來了解該語言實際堅持的區別。
* 通常可以透過使用數量中性表達方式（例如「書籍：1」）來避免數量字串。
  如果這不會惡化使用者體驗，則可考慮採用。

若要定義複數，請在 `composeResources/values` 目錄中的任何 `.xml` 檔案中新增 `<plurals>` 元素。
`plurals` 集合是一個簡單的資源，使用名稱屬性（而不是 XML 檔案的名稱）進行參考。
因此，您可以在一個 XML 檔案中將 `plurals` 資源與其他簡單資源組合在一個 `<resources>` 元素下：

```xml
<resources>
    <string name="app_name">My awesome app</string>
    <string name="title">Some title</string>
    <plurals name="new_message">
        <item quantity="one">%1$d new message</item>
        <item quantity="other">%1$d new messages</item>
    </plurals>
</resources>
```

若要將複數作為 `String` 存取，請使用以下程式碼：

<tabs>
<tab title= "從可組合程式碼中">

```kotlin
@Composable
fun pluralStringResource(resource: PluralStringResource, quantity: Int): String {...}

@Composable
fun pluralStringResource(resource: PluralStringResource, quantity: Int, vararg formatArgs: Any): String {...}
```

例如：

```kotlin
Text(pluralStringResource(Res.plurals.new_message, 1, 1))
```

</tab>
<tab title= "從不可組合程式碼中">

```kotlin
suspend fun getPluralString(resource: PluralStringResource, quantity: Int): String

suspend fun getPluralString(resource: PluralStringResource, quantity: Int, vararg formatArgs: Any): String
```

例如：

```kotlin
coroutineScope.launch {
    val appName = getPluralString(Res.plurals.new_message, 1, 1)
}
```

</tab>
</tabs>

### 字型

將自訂字型儲存在 `composeResources/font` 目錄中，作為 `*.ttf` 或 `*.otf` 檔案。

若要將字型載入為 `Font` 類型，請使用 `Font()` 可組合函式：

```kotlin
@Composable
fun Font(
    resource: FontResource,
    weight: FontWeight = FontWeight.Normal,
    style: FontStyle = FontStyle.Normal
): Font
```

例如：

```kotlin
@Composable
private fun InterTypography(): Typography {
    val interFont = FontFamily(
        Font(Res.font.Inter_24pt_Regular, FontWeight.Normal),
        Font(Res.font.Inter_24pt_SemiBold, FontWeight.Bold),
    )

    return with(MaterialTheme.typography) {
        copy(
            displayLarge = displayLarge.copy(fontFamily = interFont, fontWeight = FontWeight.Bold),
            displayMedium = displayMedium.copy(fontFamily = interFont, fontWeight = FontWeight.Bold),
            displaySmall = displaySmall.copy(fontFamily = interFont, fontWeight = FontWeight.Bold),
            headlineLarge = headlineLarge.copy(fontFamily = interFont, fontWeight = FontWeight.Bold),
            headlineMedium = headlineMedium.copy(fontFamily = interFont, fontWeight = FontWeight.Bold),
            headlineSmall = headlineSmall.copy(fontFamily = interFont, fontWeight = FontWeight.Bold),
            titleLarge = titleLarge.copy(fontFamily = interFont, fontWeight = FontWeight.Bold),
            titleMedium = titleMedium.copy(fontFamily = interFont, fontWeight = FontWeight.Bold),
            titleSmall = titleSmall.copy(fontFamily = interFont, fontWeight = FontWeight.Bold),
            labelLarge = labelLarge.copy(fontFamily = interFont, fontWeight = FontWeight.Normal),
            labelMedium = labelMedium.copy(fontFamily = interFont, fontWeight = FontWeight.Normal),
            labelSmall = labelSmall.copy(fontFamily = interFont, fontWeight = FontWeight.Normal),
            bodyLarge = bodyLarge.copy(fontFamily = interFont, fontWeight = FontWeight.Normal),
            bodyMedium = bodyMedium.copy(fontFamily = interFont, fontWeight = FontWeight.Normal),
            bodySmall = bodySmall.copy(fontFamily = interFont, fontWeight = FontWeight.Normal),
        )
    }
}
```

{initial-collapse-state="collapsed" collapsible="true" collapsed-title="@Composable private fun InterTypography(): Typography { val interFont = FontFamily("}

> 當 `Font` 是可組合項時，請確保其依賴的組件（例如 `TextStyle` 和 `Typography`）也是可組合項。
>
{style="note"}

若要在網頁目標中支援特殊字元（如表情符號或阿拉伯文字），您需要將相應的字型新增到資源中，並[使用 Compose Multiplatform 預載入 API 預載入備用字型](#preload-resources-using-the-compose-multiplatform-preload-api)。

### 原始檔案

若要將任何原始檔案載入為位元組陣列，請使用 `Res.readBytes(path)` 函式：

```kotlin
suspend fun readBytes(path: String): ByteArray
```

您可以將原始檔案放置在 `composeResources/files` 目錄中，並在其內部建立任何層級結構。

例如，若要存取原始檔案，請使用以下程式碼：

<tabs>
<tab title= "從可組合程式碼中">

```kotlin
var bytes by remember {
    mutableStateOf(ByteArray(0))
}
LaunchedEffect(Unit) {
    bytes = Res.readBytes("files/myDir/someFile.bin")
}
Text(bytes.decodeToString())
```

</tab>
<tab title= "從不可組合程式碼中">

```kotlin
coroutineScope.launch {
    val bytes = Res.readBytes("files/myDir/someFile.bin")
}
```

</tab>
</tabs>

#### 將位元組陣列轉換為影像

如果您讀取的檔案是位元圖（JPEG、PNG、BMP、WEBP）或 XML 向量圖影像，您可以使用以下函式
將它們轉換為適合 `Image()` 可組合項的 `ImageBitmap` 或 `ImageVector` 物件。

如[原始檔案](#raw-files)部分所示存取原始檔案，然後將結果傳遞給可組合項：

```kotlin
// bytes = Res.readBytes("files/example.png")
Image(bytes.decodeToImageBitmap(), null)

// bytes = Res.readBytes("files/example.xml")
Image(bytes.decodeToImageVector(LocalDensity.current), null)
```

除了 Android 之外的所有平台，您還可以將 SVG 檔案轉換為 `Painter` 物件：

```kotlin
// bytes = Res.readBytes("files/example.svg")
Image(bytes.decodeToSvgPainter(LocalDensity.current), null)
```

### 資源和字串 ID 的生成映射

為了方便存取，Compose Multiplatform 還將資源與字串 ID 進行映射。您可以使用
檔案名作為鍵來存取它們：

```kotlin
val Res.allDrawableResources: Map<String, DrawableResource>
val Res.allStringResources: Map<String, StringResource>
val Res.allStringArrayResources: Map<String, StringArrayResource>
val Res.allPluralStringResources: Map<String, PluralStringResource>
val Res.allFontResources: Map<String, FontResource>
```

將映射資源傳遞給可組合項的範例：

```kotlin
Image(painterResource(Res.allDrawableResources["compose_multiplatform"]!!), null)
```

### Compose Multiplatform 資源作為 Android 資產

從 Compose Multiplatform 1.7.0 開始，所有多平台資源都會打包到 Android 資產中。
這使得 Android Studio 能夠為 Android 原始碼集中的 Compose Multiplatform 可組合項生成預覽。

> Android Studio 預覽僅適用於 Android 原始碼集中的可組合項。
> 它們還需要最新版本的 AGP 之一：8.5.2、8.6.0-rc01 或 8.7.0-alpha04。
>
{style="warning"}

將多平台資源作為 Android 資產也使得從 WebViews 和媒體播放器組件在 Android 上直接存取成為可能，
因為資源可以透過簡單的路徑到達，例如 `Res.getUri("files/index.html")`。

一個 Android 可組合項的範例，顯示帶有指向資源影像連結的資源 HTML 頁面：

```kotlin
// androidMain/kotlin/com/example/webview/App.kt
@OptIn(ExperimentalResourceApi::class)
@Composable
@Preview
fun App() {
    MaterialTheme {
        val uri = Res.getUri("files/webview/index.html")

        // Adding a WebView inside AndroidView with layout as full screen.
        AndroidView(factory = {
            WebView(it).apply {
                layoutParams = ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.MATCH_PARENT
                )
            }
        }, update = {
            it.loadUrl(uri)
        })
    }
}
```
{initial-collapse-state="collapsed" collapsible="true"  collapsed-title="AndroidView(factory = { WebView(it).apply"}

該範例適用於這個簡單的 HTML 檔案：

```html
<html>
<header>
    <title>
        Cat Resource
    </title>
</header>
<body>
    <img src="cat.jpg">
</body>
</html>
```
{initial-collapse-state="collapsed" collapsible="true"  collapsed-title="<title>Cat Resource</title>"}

此範例中的兩個資源檔案都位於 `commonMain` 原始碼集中：

![File structure of the composeResources directory](compose-resources-android-webview.png){width="230"}

## 網頁目標的資源預載入

網頁資源（如字型和影像）使用 `fetch` API 非同步載入。在初始載入期間或網路連線較慢時，
資源獲取可能導致視覺異常，例如 [FOUT](https://fonts.google.com/knowledge/glossary/fout)
或顯示佔位符而非影像。

此問題的一個典型範例是當 `Text()` 組件包含自訂字型中的文字，但帶有必要字形的字型仍在載入中。
在這種情況下，使用者可能會暫時看到預設字型中的文字，甚至空白框或問號而不是字元。
同樣，對於影像或可繪製項，使用者可能會觀察到空白或黑框等佔位符，直到資源完全載入。

為防止視覺異常，您可以使用內建的瀏覽器功能進行資源預載入、
Compose Multiplatform 預載入 API，或兩者結合使用。

### 使用瀏覽器功能預載入資源

在現代瀏覽器中，您可以使用帶有 [`rel="preload"` 屬性](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload) 的 `<link>` 標籤預載入資源。
此屬性指示瀏覽器在應用程式啟動前優先下載和快取字型和影像等資源，
確保這些資源盡早可用。

例如，要在瀏覽器中啟用字型預載入：

1. 建置應用程式的網頁發行版：

```console
   ./gradlew :composeApp:wasmJsBrowserDistribution
```

2. 在生成的 `dist` 目錄中找到所需資源並儲存路徑。
3. 開啟 `wasmJsMain/resources/index.html` 檔案並在 `<head>` 元素內新增 `<link>` 標籤。
4. 將 `href` 屬性設定為資源路徑：

```html
<link rel="preload" href="./composeResources/username.composeapp.generated.resources/font/FiraMono-Regular.ttf" as="fetch" type="font/ttf" crossorigin/>
```

### 使用 Compose Multiplatform 預載入 API 預載入資源
<secondary-label ref="Experimental"/>

即使您已在瀏覽器中預載入資源，它們仍會以原始位元組的形式快取，仍然需要轉換為適合渲染的格式，
例如 `FontResource` 和 `DrawableResource`。當應用程式首次請求資源時，轉換是非同步完成的，
這可能會再次導致閃爍。為了進一步最佳化使用者體驗，
Compose Multiplatform 資源具有自己的內部快取，用於高階資源表示形式，也可以預載入。

Compose Multiplatform 1.8.0 引入了一個實驗性 API，用於在網頁目標上預載入字型和影像資源：
`preloadFont()`、`preloadImageBitmap()` 和 `preloadImageVector()`。

此外，如果您需要特殊字元（如表情符號），您可以設定不同於預設捆綁選項的備用字型。
若要指定備用字型，請使用 `FontFamily.Resolver.preload()` 方法。

以下範例演示了如何使用預載入和備用字型：

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalFontFamilyResolver
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.window.CanvasBasedWindow
import components.resources.demo.shared.generated.resources.*
import components.resources.demo.shared.generated.resources.NotoColorEmoji
import components.resources.demo.shared.generated.resources.Res
import components.resources.demo.shared.generated.resources.Workbench_Regular
import components.resources.demo.shared.generated.resources.font_awesome
import org.jetbrains.compose.resources.ExperimentalResourceApi
import org.jetbrains.compose.resources.configureWebResources
import org.jetbrains.compose.resources.demo.shared.UseResources
import org.jetbrains.compose.resources.preloadFont

@OptIn(ExperimentalComposeUiApi::class, ExperimentalResourceApi::class, InternalComposeUiApi::class)
fun main() {
    configureWebResources {
        // Overrides the resource location
        resourcePathMapping { path -> "./$path" }
    }
    CanvasBasedWindow("Resources + K/Wasm") {
        val font1 by preloadFont(Res.font.Workbench_Regular)
        val font2 by preloadFont(Res.font.font_awesome, FontWeight.Normal, FontStyle.Normal)
        val emojiFont = preloadFont(Res.font.NotoColorEmoji).value
        var fontsFallbackInitialized by remember { mutableStateOf(false) }

        // Uses the preloaded resource for the app's content
        UseResources()

        if (font1 != null && font2 != null && emojiFont != null && fontsFallbackInitialized) {
            println("Fonts are ready")
        } else {
            // Displays the progress indicator to address a FOUT or the app being temporarily non-functional during loading
            Box(modifier = Modifier.fillMaxSize().background(Color.White.copy(alpha = 0.8f)).clickable {  }) {
                CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
            }
            println("Fonts are not ready yet")
        }

        val fontFamilyResolver = LocalFontFamilyResolver.current
        LaunchedEffect(fontFamilyResolver, emojiFont) {
            if (emojiFont != null) {
                // Preloads a fallback font with emojis to render missing glyphs that are not supported by the bundled font
                fontFamilyResolver.preload(FontFamily(listOf(emojiFont)))
                fontsFallbackInitialized = true
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="fontFamilyResolver.preload(FontFamily(listOf(emojiFont)))"}

## 與其他函式庫和資源的互動

### 從外部函式庫存取多平台資源

如果您想使用專案中包含的其他函式庫來處理多平台資源，您可以將平台特定
檔案路徑傳遞給這些其他 API。
若要取得平台特定路徑，請呼叫 `Res.getUri()` 函式並傳入資源的專案路徑：

```kotlin
val uri = Res.getUri("files/my_video.mp4")
```

現在 `uri` 變數包含檔案的絕對路徑，任何外部函式庫都可以使用該路徑以適合其方式存取檔案。

對於 Android 特定用途，多平台資源也會[打包為 Android 資產](#compose-multiplatform-resources-as-android-assets)。

### 遠端檔案

在資源函式庫的上下文中，只有作為應用程式一部分的檔案才被視為資源。

您可以使用專用函式庫從網際網路載入遠端檔案，透過其 URL：

* [Compose ImageLoader](https://github.com/qdsfdhvh/compose-imageloader)
* [Kamel](https://github.com/Kamel-Media/Kamel)
* [Ktor client](https://ktor.io/)

### 使用 Java 資源

儘管您可以將 Java 資源與 Compose Multiplatform 結合使用，但它們無法受益於框架提供的
擴充功能：生成的存取器、多模組支援、本地化等等。
考慮完全過渡到多平台資源函式庫以釋放該潛力。

在 Compose Multiplatform 1.7.0 中，`compose.ui` 套件中可用的資源 API 已棄用。
如果您仍然需要使用 Java 資源，請將以下實作複製到您的專案中，以確保您的程式碼
在升級到 Compose Multiplatform 1.7.0 或更高版本後仍然有效：

```kotlin
@Composable
internal fun painterResource(
    resourcePath: String
): Painter = when (resourcePath.substringAfterLast(".")) {
    "svg" -> rememberSvgResource(resourcePath)
    "xml" -> rememberVectorXmlResource(resourcePath)
    else -> rememberBitmapResource(resourcePath)
}

@Composable
internal fun rememberBitmapResource(path: String): Painter {
    return remember(path) { BitmapPainter(readResourceBytes(path).decodeToImageBitmap()) }
}

@Composable
internal fun rememberVectorXmlResource(path: String): Painter {
    val density = LocalDensity.current
    val imageVector = remember(density, path) { readResourceBytes(path).decodeToImageVector(density) }
    return rememberVectorPainter(imageVector)
}

@Composable
internal fun rememberSvgResource(path: String): Painter {
    val density = LocalDensity.current
    return remember(density, path) { readResourceBytes(path).decodeToSvgPainter(density) }
}

private object ResourceLoader
private fun readResourceBytes(resourcePath: String) =
    ResourceLoader.javaClass.classLoader.getResourceAsStream(resourcePath).readAllBytes()
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="internal fun painterResource(resourcePath: String): Painter"}

## 接下來是什麼？

* 查看官方[示範專案](https://github.com/JetBrains/compose-multiplatform/tree/master/components/resources/demo)，
該專案展示了如何在目標為 iOS、Android 和桌面的 Compose Multiplatform 專案中處理資源。
* 了解如何管理應用程式的[資源環境](compose-resource-environment.md)，例如應用程式內主題和語言。