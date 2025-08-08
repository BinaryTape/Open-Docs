[//]: # (title: Compose Multiplatform 1.7.3 的新功能)

本功能發佈版的主要亮點為：

*   [類型安全的導航](#type-safe-navigation)
*   [共享元素轉場](#shared-element-transitions)
*   [打包到 Android assets 中的多平台資源](#resources-packed-into-android-assets)
*   [自訂資源目錄](#custom-resource-directories)
*   [支援多平台測試資源](#support-for-multiplatform-test-resources)
*   [改進 iOS 上的觸控互操作性](#new-default-behavior-for-processing-touch-in-ios-native-elements)
*   [Material3 `adaptive` 與 `material3-window-size-class` 現已支援通用程式碼](#material3-adaptive-adaptive)
*   [桌面端已實作拖放功能](#drag-and-drop)
*   [`BasicTextField` 已在桌面端採用](#basictextfield-renamed-from-basictextfield2-adopted-on-desktop)

請在 [GitHub](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md#170-october-2024) 上查看此發佈版的完整變更列表。

## 依賴項

*   Gradle 外掛程式 `org.jetbrains.compose`，版本 1.7.3。基於 Jetpack Compose 函式庫：
    *   [Runtime 1.7.5](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.7.5)
    *   [UI 1.7.5](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.7.5)
    *   [Foundation 1.7.5](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.7.5)
    *   [Material 1.7.5](https://developer.android.com/jetpack/androidx/releases/compose-material#1.7.5)
    *   [Material3 1.3.1](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.3.1)
*   Lifecycle 函式庫 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.8.3`。基於 [Jetpack Lifecycle 2.8.5](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.8.5)。
*   Navigation 函式庫 `org.jetbrains.androidx.navigation:navigation-*:2.8.0-alpha10`。基於 [Jetpack Navigation 2.8.0](https://developer.android.com/jetpack/androidx/releases/navigation#2.8.0)。
*   Material3 Adaptive 函式庫 `org.jetbrains.compose.material3.adaptive:adaptive-*:1.0.0`。基於 [Jetpack Material3 Adaptive 1.0.0](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.0.0)

## 破壞性變更

### AGP 最低版本提高至 8.1.0

Jetpack Compose 1.7.0 和 Lifecycle 2.8.0（兩者均為 Compose Multiplatform 1.7.0 所使用）都不支援 AGP 7。因此，當您更新至 Compose Multiplatform 1.7.3 時，您可能也需要升級您的 AGP 依賴項。

> Android Studio 中針對 Android 可組合項 (composables) 新實作的預覽功能[需要最新 AGP 版本之一](#resources-packed-into-android-assets)。
>
{style="note"}

### Java 資源 API 已棄用，改用多平台資源函式庫

<!-- TODO additional copy editing -->

在此版本中，我們明確棄用了 `compose.ui` 套件中可用的 Java 資源 API：`painterResource()`、`loadImageBitmap()`、`loadSvgPainter()` 和 `loadXmlImageVector()` 函數，以及 `ClassLoaderResourceLoader` 類別和依賴於它的函數。

考慮轉移到[多平台資源函式庫](compose-multiplatform-resources.md)。雖然您可以在 Compose Multiplatform 中使用 Java 資源，但它們無法受益於框架提供的擴展功能：自動生成的存取器、多模組支援、本地化等等。

如果您仍然需要存取 Java 資源，您可以複製[拉取請求中建議的實作](https://github.com/JetBrains/compose-multiplatform-core/pull/1457)，以確保您的程式碼在升級到 Compose Multiplatform 1.7.3 並盡可能切換到多平台資源後仍能正常運作。

### 在 iOS 原生元素中處理觸控的新預設行為

在 1.7.3 之前，Compose Multiplatform 無法回應落在互操作性 UI 視圖中的觸控事件，因此這些觸控序列完全由互操作性視圖處理。

Compose Multiplatform 1.7.3 實作了更精密的邏輯來處理互操作性觸控序列。預設情況下，初始觸控後現在會有一段延遲，這有助於父級可組合項理解觸控序列是否意在與原生視圖互動並據此作出反應。

欲了解更多資訊，請參閱本頁面[iOS 部分](#ios-touch-interop)的說明，或閱讀[此功能的文件](compose-ios-touch.md)。

### 在 iOS 上禁用最小幀持續時間是強制性的

開發人員經常未能注意到關於高刷新率顯示器的列印警告，而用戶在支援 120 赫茲的設備上無法享受到流暢的動畫。我們現在嚴格執行此項檢查。如果 `Info.plist` 文件中的 `CADisableMinimumFrameDurationOnPhone` 屬性缺失或設置為 `false`，使用 Compose Multiplatform 構建的應用程式現在將會崩潰。

您可以透過將 `ComposeUIViewControllerConfiguration.enforceStrictPlistSanityCheck` 屬性設置為 `false` 來禁用此行為。

### 桌面端已棄用 Modifier.onExternalDrag

<!-- TODO additional copy editing -->

實驗性的 `Modifier.onExternalDrag` 及相關 API 已棄用，改為使用新的 `Modifier.dragAndDropTarget`。`DragData` 介面已移至 `compose.ui.draganddrop` 套件。

如果您在 Compose Multiplatform 1.7.0 中使用已棄用的 API，您將會遇到棄用錯誤。在 1.8.0 版本中，`onExternalDrag` 修飾符將會完全移除。

## 跨平台

### 共享元素轉場

Compose Multiplatform 現提供 API，用於在共享一致元素的可組合項之間實現無縫轉場。這些轉場在導航中通常很有用，可幫助用戶追蹤 UI 變化的軌跡。

要深入了解此 API，請參閱 [Jetpack Compose 文件](https://developer.android.com/develop/ui/compose/animation/shared-elements)。

### 類型安全的導航

Compose Multiplatform 已採用 Jetpack Compose 的類型安全方法來沿著導航路徑傳遞物件。Navigation 2.8.0 中的新 API 允許 Compose 為您的導航圖提供編譯時安全性。這些 API 與基於 XML 的導航的 [Safe Args](https://developer.android.com/guide/navigation/use-graph/pass-data#Safe-args) 外掛程式達到相同的效果。

有關詳細資訊，請參閱 [Google 關於 Navigation Compose 中類型安全的文件](https://developer.android.com/guide/navigation/design/type-safety)。

### 多平台資源

#### 打包到 Android assets 中的資源

所有多平台資源現已打包到 Android assets 中。這使得 Android Studio 能夠為 Android 原始碼集中的 Compose Multiplatform 可組合項生成預覽。

> Android Studio 預覽功能僅適用於 Android 原始碼集中的可組合項。它們還需要最新 AGP 版本之一：8.5.2、8.6.0-rc01 或 8.7.0-alpha04。
>
{style="note"}

這也提供了從 Android 上的 WebView 和媒體播放器元件直接存取多平台資源的功能，因為資源可以透過簡單的路徑存取，例如 `Res.getUri(“files/index.html”)`。

以下是一個 Android 可組合項的範例，它顯示了一個資源 HTML 頁面，其中包含指向資源圖片的連結：

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

該範例適用於這個簡單的 HTML 文件：

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
{initial-collapse-state="collapsed" collapsible="true"  collapsed-title="<title>貓咪資源</title>"}

此範例中的兩個資源文件都位於 `commonMain` 原始碼集中：

![File structure of the composeResources directory](compose-resources-android-webview.png){width="230"}

#### 自訂資源目錄

藉由配置 DSL 中的新 `customDirectory` 設定，您可以[將自訂目錄](compose-multiplatform-resources-setup.md#custom-resource-directories)與特定原始碼集關聯。例如，這使得使用下載文件作為資源成為可能。

#### 多平台字體快取

Compose Multiplatform 將 Android 的字體快取功能帶到其他平台，消除了對 `Font` 資源過度的位元組讀取。

#### 支援多平台測試資源

資源函式庫現在支援在您的專案中使用測試資源，這意味著您可以：

*   將資源新增到測試原始碼集。
*   使用僅在對應原始碼集中可用的自動生成存取器。
*   僅在測試運行時將測試資源打包到應用程式中。

#### 將資源映射到字串 ID 以便輕鬆存取

每種類型的資源都與其文件名進行映射。例如，您可以使用 `Res.allDrawableResources` 屬性獲取所有 `drawable` 資源的映射，並透過傳遞其字串 ID 來存取所需的資源：

```kotlin
Image(painterResource(Res.allDrawableResources["compose_multiplatform"]!!), null)
```

#### 將位元組陣列轉換為 ImageBitmap 或 ImageVector 的函數

有新的函數用於將 `ByteArray` 轉換為圖像資源：

*   `decodeToImageBitmap()` 將 JPEG、PNG、BMP 或 WEBP 文件轉換為 `ImageBitmap` 物件。
*   `decodeToImageVector()` 將 XML 向量文件轉換為 `ImageVector` 物件。
*   `decodeToSvgPainter()` 將 SVG 文件轉換為 `Painter` 物件。此函數在 Android 上不可用。

有關詳細資訊，請參閱[文件](compose-multiplatform-resources-usage.md#convert-byte-arrays-into-images)。

### 新的通用模組

#### material3.adaptive:adaptive*

Material3 adaptive 模組現已在 Compose Multiplatform 的通用程式碼中可用。要使用它們，請在模組的 `build.gradle.kts` 文件中明確將相應的依賴項添加到 `commonMain` 原始碼集：

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.compose.material3.adaptive:adaptive:1.0.0-alpha03")
    implementation("org.jetbrains.compose.material3.adaptive:adaptive-layout:1.0.0-alpha03")
    implementation("org.jetbrains.compose.material3.adaptive:adaptive-navigation:1.0.0-alpha03")
}
```

#### material3.material3-adaptive-navigation-suite

Material3 adaptive navigation suite，對於使用 Compose [構建自適應導航](https://developer.android.com/develop/ui/compose/layouts/adaptive/build-adaptive-navigation)是必要的，它在 Compose Multiplatform 的通用程式碼中可用。要使用它，請在模組的 `build.gradle.kts` 文件中明確添加依賴項到 `commonMain` 原始碼集：

```kotlin
commonMain.dependencies {
    implementation(compose.material3AdaptiveNavigationSuite)
}
```

#### material3:material3-window-size-class

要使用 `WindowSizeClass` 類別，請在模組的 `build.gradle.kts` 文件中明確將 `material3-window-size-class` 依賴項添加到 `commonMain` 原始碼集：

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.compose.material3:material3-window-size-class:1.7.3")
}
```

`calculateWindowSizeClass()` 函數尚未在通用程式碼中可用。然而，您可以在平台特定的程式碼中導入並呼叫它，例如：

```kotlin
// desktopMain/kotlin/main.kt
import androidx.compose.material3.windowsizeclass.calculateWindowSizeClass

// ...

val size = calculateWindowSizeClass()
```

#### material-navigation

`material-navigation` 函式庫除了 Compose Multiplatform Navigation 之外，也在通用程式碼中可用。要使用它，請在模組的 `build.gradle.kts` 文件中將以下明確依賴項添加到 `commonMain` 原始碼集：

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.androidx.navigation:navigation-compose:2.8.0-alpha10")
    implementation("org.jetbrains.compose.material:material-navigation:1.7.0-beta02")
}
```

### Skia 已更新至 Milestone 126

Compose Multiplatform 透過 [Skiko](https://github.com/JetBrains/skiko) 使用的 Skia 版本已更新至 Milestone 126。

先前使用的 Skia 版本是 Milestone 116。您可以在[發佈說明](https://skia.googlesource.com/skia/+/refs/heads/main/RELEASE_NOTES.md#milestone-126)中查看這些版本之間的變更。

### GraphicsLayer – 一種新的繪圖 API

Jetpack Compose 1.7.0 中新增的繪圖層現在已在 Compose Multiplatform 中可用。

與 `Modifier.graphicsLayer` 不同，新的 `GraphicsLayer` 類別允許您在任何地方渲染可組合內容。這在預期動畫內容在不同場景中渲染的情況下非常有用。

有關更詳細的描述和範例，請參閱[參考文件](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/layer/GraphicsLayer)。

### LocalLifecycleOwner 已移出 Compose UI

`LocalLifecycleOwner` 類別已從 Compose UI 套件移至 Lifecycle 套件。

此變更允許您獨立於 Compose UI 存取該類別並呼叫其基於 Compose 的輔助 API。然而，請記住，如果沒有 Compose UI 綁定，`LocalLifecycleOwner` 實例將沒有平台整合，因此也無法監聽平台特定事件。

## iOS

### 改進 Compose Multiplatform 與原生 iOS 之間的觸控互操作性 {id="ios-touch-interop"}

此版本改進了 iOS 互操作性視圖的觸控處理。Compose Multiplatform 現在會嘗試偵測觸控是針對互操作性視圖還是應由 Compose 處理。這使得處理發生在您的 Compose Multiplatform 應用程式內 UIKit 或 SwiftUI 區域的觸控事件成為可能。

預設情況下，Compose Multiplatform 將延遲 150 毫秒向互操作性視圖傳輸觸控事件：

*   如果在此時間範圍內，觸控移動超過距離閾值，父級可組合項將會攔截觸控序列，並且不會將其轉發到互操作性視圖。
*   如果沒有明顯移動，Compose 將不會處理觸控序列的其餘部分，而是完全由互操作性視圖處理。

此行為與原生 `UIScrollView` 的工作方式一致。這有助於防止觸控序列在互操作性視圖中開始後，在 Compose Multiplatform 有機會處理之前就被攔截的情況。這可能導致令人沮喪的使用者體驗。例如，想像一個在可滾動上下文（如懶加載列表）中使用的大型互操作性影片播放器。當螢幕大部分被一個攔截所有觸控而 Compose Multiplatform 無法察覺的影片佔據時，滾動列表就變得困難。

### 原生性能改進

<!-- TODO additional copy editing -->

隨著 Kotlin 2.0.20 的發佈，Kotlin/Native 團隊在使 iOS 上的 Compose 應用程式運行更快、更流暢方面取得了很大進展。Compose Multiplatform 1.7.3 版本利用了這些優化，並帶來了 Jetpack Compose 1.7.0 的性能改進。

當比較 Compose Multiplatform 1.6.11 搭配 Kotlin 2.0.0 和 Compose Multiplatform 1.7.3 搭配 Kotlin 2.0.20 時，我們看到全面性的更佳結果：

*   `LazyGrid` 基準測試模擬了 `LazyVerticalGrid` 滾動，這最接近實際用例，平均性能提高了約 9%。它還顯著減少了丟幀數量，這通常會讓使用者感覺 UI 反應遲鈍。您可以親自嘗試：使用 Compose Multiplatform 為 iOS 開發的應用程式應該會感覺流暢許多。
*   `VisualEffects` 基準測試渲染大量隨機放置的元件，其速度提高了 3.6 倍：每 1000 幀的平均 CPU 時間從 8.8 秒減少到 2.4 秒。
*   `AnimatedVisibility` 可組合項對圖像的顯示和隱藏進行動畫處理，並展示了約 6% 更快的渲染速度。

除此之外，Kotlin 2.0.20 在垃圾回收器中引入了實驗性的[並發標記支援](https://kotlinlang.org/docs/whatsnew2020.html#concurrent-marking-in-garbage-collector)。啟用並發標記可縮短垃圾回收器暫停時間，並為所有基準測試帶來更大的改進。

您可以在 Compose Multiplatform 儲存庫中查看這些 Compose 特定基準測試的程式碼：

*   [Kotlin/Native 性能基準測試](https://github.com/JetBrains/compose-multiplatform/tree/master/benchmarks/kn-performance)
*   [Kotlin/JVM 對比 Kotlin/Native 基準測試](https://github.com/JetBrains/compose-multiplatform/tree/master/benchmarks/ios/jvm-vs-kotlin-native)

## 桌面

### 拖放

拖放機制已在 Compose Multiplatform 桌面端實作，該機制使用戶能夠將內容拖入或拖出您的 Compose 應用程式。要指定拖放的潛在來源和目的地，請使用 `dragAndDropSource` 和 `dragAndDropTarget` 修飾符。

> 儘管這些修飾符在通用程式碼中可用，但它們目前僅在桌面和 Android 原始碼集中有效。請關注未來的發佈版本。
>
{style="note"}

對於常見用例，請參閱 Jetpack Compose 文件中的[專門文章](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop)。

### 桌面端已採用 BasicTextField (從 BasicTextField2 更名)

Jetpack Compose 已將 `BasicTextField2` 元件穩定化並更名為 `BasicTextField`。在此版本中，Compose Multiplatform 已針對桌面目標採用此變更，並計劃在穩定版 1.7.0 中也涵蓋 iOS。

新的 `BasicTextField`：

*   讓您更可靠地管理狀態。
*   提供新的 `TextFieldBuffer` API，用於程式化變更文字欄位內容。
*   包含多個用於視覺轉換和樣式設定的新 API。
*   提供對 `UndoState` 的存取，能夠返回欄位的先前狀態。

### ComposePanel 的渲染設定

透過在 `ComposePanel` 構造函數中指定新的 `RenderSettings.isVsyncEnabled` 參數，您可以提示後端渲染實作禁用垂直同步。這可以減少輸入和 UI 變更之間的視覺延遲，但也可能導致畫面撕裂。

預設行為保持不變：`ComposePanel` 會嘗試將可繪製的呈現與 VSync 同步。

## Web

### `skiko.js` 對於 Kotlin/Wasm 應用程式而言是多餘的

<!-- TODO additional copy editing -->

`skiko.js` 文件現在對於使用 Compose Multiplatform 構建的 Kotlin/Wasm 應用程式而言是多餘的。您可以將其從 `index.html` 文件中移除，並改善應用程式的載入時間。`skiko.js` 將在未來版本中從 Kotlin/Wasm 發佈版中完全移除。

> `skiko.js` 文件對於 Kotlin/JS 應用程式仍然是必要的。
>
{style="note"}