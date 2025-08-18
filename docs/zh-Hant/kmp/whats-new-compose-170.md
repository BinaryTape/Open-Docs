[//]: # (title: Compose Multiplatform 1.7.3 有何新功能)

以下是此功能版本的主要亮點：

* [型別安全的導航](#type-safe-navigation)
* [共享元素轉場](#shared-element-transitions)
* [打包至 Android assets 的多平台資源](#resources-packed-into-android-assets)
* [自訂資源目錄](#custom-resource-directories)
* [支援多平台測試資源](#support-for-multiplatform-test-resources)
* [改善 iOS 上的觸控互通性](#new-default-behavior-for-processing-touch-in-ios-native-elements)
* [Material3 `adaptive` 和 `material3-window-size-class` 現已在通用程式碼中提供](#material3-adaptive-adaptive)
* [桌面版已實作拖放功能](#drag-and-drop)
* [`BasicTextField` 已在桌面版採用 (由 BasicTextField2 更名)](#basictextfield-renamed-from-basictextfield2-adopted-on-desktop)

請參閱此版本的完整變更列表 [在 GitHub 上](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md#170-october-2024)。

## 相依性

* Gradle 外掛程式 `org.jetbrains.compose`，版本 1.7.3。基於 Jetpack Compose 函式庫：
  * [Runtime 1.7.5](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.7.5)
  * [UI 1.7.5](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.7.5)
  * [Foundation 1.7.5](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.7.5)
  * [Material 1.7.5](https://developer.android.com/jetpack/androidx/releases/compose-material#1.7.5)
  * [Material3 1.3.1](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.3.1)
* Lifecycle 函式庫 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.8.3`。基於 [Jetpack Lifecycle 2.8.5](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.8.5)。
* Navigation 函式庫 `org.jetbrains.androidx.navigation:navigation-*:2.8.0-alpha10`。基於 [Jetpack Navigation 2.8.0](https://developer.android.com/jetpack/androidx/releases/navigation#2.8.0)。
* Material3 Adaptive 函式庫 `org.jetbrains.compose.material3.adaptive:adaptive-*:1.0.0`。基於 [Jetpack Material3 Adaptive 1.0.0](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.0.0)

## 破壞性變更

### 最低 AGP 版本提升至 8.1.0

Jetpack Compose 1.7.0 和 Lifecycle 2.8.0（兩者都由 Compose Multiplatform 1.7.0 使用）皆不支援 AGP 7。
因此，當您更新至 Compose Multiplatform 1.7.3 時，您可能也必須升級您的 AGP 相依性。

> Android Studio 中新實作的 Android composables 預覽功能 [需要最新的 AGP 版本之一](#resources-packed-into-android-assets)。
>
{style="note"}

### Java 資源 API 已棄用，改用多平台資源庫

<!-- TODO additional copy editing -->

在此版本中，我們明確棄用了 `compose.ui` 軟體包中可用的 Java 資源 API：`painterResource()`、`loadImageBitmap()`、`loadSvgPainter()` 和 `loadXmlImageVector()` 函數，以及 `ClassLoaderResourceLoader` 類別和依賴於它的函數。

請考慮轉移至 [多平台資源庫](compose-multiplatform-resources.md)。
雖然您可以在 Compose Multiplatform 中使用 Java 資源，但它們無法受益於框架提供的擴充功能：生成式存取器、多模組支援、本地化等等。

如果您仍然需要存取 Java 資源，可以複製 [pull request 中建議的實作](https://github.com/JetBrains/compose-multiplatform-core/pull/1457)，
以確保即使在您升級到 Compose Multiplatform 1.7.3 並在可能的情況下切換到多平台資源後，您的程式碼仍然可以運作。

### iOS 原生元素中處理觸控的新預設行為

在 1.7.3 之前，Compose Multiplatform 無法回應落在互通 UI 視圖中的觸控事件，因此
互通視圖會完全處理這些觸控序列。

Compose Multiplatform 1.7.3 實作了更精密的邏輯來處理互通觸控序列。
預設情況下，現在在初始觸控後會有一段延遲，這有助於父層 composable 判斷觸控序列是否旨在與原生視圖互動並做出相應反應。

更多資訊請參閱 [此頁面的 iOS 部分](#ios-touch-interop) 中的解釋，
或閱讀 [此功能的說明文件](compose-ios-touch.md)。

### iOS 上強制禁用最低影格持續時間

開發者經常未能注意到有關高更新率顯示器列印出的警告，
導致用戶在他們的 120Hz 啟用設備上無法享受流暢的動畫。
我們現在嚴格執行此檢查。如果 `Info.plist` 檔案中缺少 `CADisableMinimumFrameDurationOnPhone` 屬性或將其設定為 `false`，則使用 Compose Multiplatform 建置的應用程式現在將會當機。

您可以透過將 `ComposeUIViewControllerConfiguration.enforceStrictPlistSanityCheck` 屬性設定為 `false` 來禁用此行為。

### 桌面版 Modifier.onExternalDrag 已棄用

<!-- TODO additional copy editing -->

實驗性的 `Modifier.onExternalDrag` 和相關 API 已棄用，改用新的 `Modifier.dragAndDropTarget`。
`DragData` 介面已移至 `compose.ui.draganddrop` 軟體包。

如果您在 Compose Multiplatform 1.7.0 中使用已棄用的 API，您將會遇到棄用錯誤。
在 1.8.0 中，`onExternalDrag` 修飾符將會被完全移除。

## 跨平台

### 共享元素轉場

Compose Multiplatform 現在提供一個 API，用於在共享一致元素的 composables 之間進行無縫轉場。
這些轉場在導航中通常很有用，可幫助使用者追蹤 UI 中變化的軌跡。

要深入探討此 API，請參閱 [Jetpack Compose 說明文件](https://developer.android.com/develop/ui/compose/animation/shared-elements)。

### 型別安全的導航

Compose Multiplatform 已採用 Jetpack Compose 的型別安全方法來沿著導航路徑傳遞物件。
Navigation 2.8.0 中的新 API 允許 Compose 為您的導航圖提供編譯時期的安全性。
這些 API 達到了與基於 XML 的導航的 [Safe Args](https://developer.android.com/guide/navigation/use-graph/pass-data#Safe-args) 外掛程式相同的效果。

有關詳細資訊，請參閱 [Google 關於 Navigation Compose 中型別安全性的文件](https://developer.android.com/guide/navigation/design/type-safety)。

### 多平台資源

#### 資源打包至 Android assets

所有多平台資源現在都打包到 Android assets 中。這允許 Android Studio 在 Android 來源集中為 Compose Multiplatform composables 生成預覽。

> Android Studio 預覽功能僅適用於 Android 來源集中的 composables。
> 它們還需要最新的 AGP 版本之一：8.5.2、8.6.0-rc01 或 8.7.0-alpha04。
>
{style="note"}

這也提供了從 Android 上的 WebViews 和媒體播放器組件直接存取多平台資源的功能，
因為資源可以透過簡單的路徑存取，例如 `Res.getUri(“files/index.html”)`。

這是一個 Android composable 的範例，它顯示一個資源 HTML 頁面，其中包含指向資源圖片的連結：

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

此範例適用於這個簡單的 HTML 檔案：

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

此範例中的兩個資源檔案都位於 `commonMain` 來源集中：

![File structure of the composeResources directory](compose-resources-android-webview.png){width="230"}

#### 自訂資源目錄

透過配置 DSL 中的新 `customDirectory` 設定，您可以 [將自訂目錄](compose-multiplatform-resources-setup.md#custom-resource-directories) 與特定來源集關聯。這使得例如可以使用下載的檔案作為資源。

#### 多平台字型快取

Compose Multiplatform 將 Android 的字型快取功能帶到其他平台，
消除了對 `Font` 資源過度的位元組讀取。

#### 支援多平台測試資源

資源庫現在支援在您的專案中使用測試資源，這意味著您可以：

* 將資源新增至測試來源集。
* 使用僅在對應來源集中可用的生成式存取器。
* 僅在測試執行時將測試資源打包到應用程式中。

#### 資源映射至字串 ID 以便輕鬆存取

每種類型的資源都與其檔案名稱映射。例如，您可以使用 `Res.allDrawableResources` 屬性
來取得所有 `drawable` 資源的映射，並透過傳遞其字串 ID 來存取所需資源：

```kotlin
Image(painterResource(Res.allDrawableResources["compose_multiplatform"]!!), null)
```

#### 將位元組陣列轉換為 ImageBitmap 或 ImageVector 的函數

有一些新函數可將 `ByteArray` 轉換為圖像資源：

* `decodeToImageBitmap()` 將 JPEG、PNG、BMP 或 WEBP 檔案轉換為 `ImageBitmap` 物件。
* `decodeToImageVector()` 將 XML 向量檔案轉換為 `ImageVector` 物件。
* `decodeToSvgPainter()` 將 SVG 檔案轉換為 `Painter` 物件。此函數在 Android 上不可用。

有關詳細資訊，請參閱 [說明文件](compose-multiplatform-resources-usage.md#convert-byte-arrays-into-images)。

### 新的通用模組

#### material3.adaptive:adaptive*

Material3 adaptive 模組現在透過 Compose Multiplatform 在通用程式碼中可用。
要使用它們，請在模組的 `build.gradle.kts` 檔案中明確將相應的相依性新增到通用來源集：

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.compose.material3.adaptive:adaptive:1.0.0-alpha03")
    implementation("org.jetbrains.compose.material3.adaptive:adaptive-layout:1.0.0-alpha03")
    implementation("org.jetbrains.compose.material3.adaptive:adaptive-navigation:1.0.0-alpha03")
}
```

#### material3.material3-adaptive-navigation-suite

Material3 adaptive navigation suite（對於使用 Compose [建構適應性導航](https://developer.android.com/develop/ui/compose/layouts/adaptive/build-adaptive-navigation) 很重要）可透過 Compose Multiplatform 在通用程式碼中提供。
要使用它，請在模組的 `build.gradle.kts` 檔案中明確將相依性新增到通用來源集：

```kotlin
commonMain.dependencies {
    implementation(compose.material3AdaptiveNavigationSuite)
}
```

#### material3:material3-window-size-class

要使用 [`WindowSizeClass`](https://developer.android.com/reference/kotlin/androidx/compose/material3/windowsizeclass/package-summary) 類別，請在模組的 `build.gradle.kts` 檔案中明確將 `material3-window-size-class` 相依性新增到通用來源集：

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.compose.material3:material3-window-size-class:1.7.3")
}
```

`calculateWindowSizeClass()` 函數尚未在通用程式碼中提供。
但是，您可以在平台特定程式碼中匯入並呼叫它，例如：

```kotlin
// desktopMain/kotlin/main.kt
import androidx.compose.material3.windowsizeclass.calculateWindowSizeClass

// ...

val size = calculateWindowSizeClass()
```

#### material-navigation

除了 Compose Multiplatform Navigation 之外，`material-navigation` 函式庫在通用程式碼中也可用。
要使用它，請在模組的 `build.gradle.kts` 檔案中將以下明確相依性新增到通用來源集：

```kotlin
commonMain.dependencies {
    implementation("org.jetbrains.androidx.navigation:navigation-compose:2.8.0-alpha10")
    implementation("org.jetbrains.compose.material:material-navigation:1.7.0-beta02")
}
```

### Skia 更新至 Milestone 126

Compose Multiplatform 透過 [Skiko](https://github.com/JetBrains/skiko) 使用的 Skia 版本已更新至 Milestone 126。

之前使用的 Skia 版本是 Milestone 116。您可以在 [發行說明](https://skia.googlesource.com/skia/+/refs/heads/main/RELEASE_NOTES.md#milestone-126) 中查看這些版本之間所做的變更。

### GraphicsLayer – 新的繪圖 API

Jetpack Compose 1.7.0 中新增的繪圖層現在在 Compose Multiplatform 中可用。

與 `Modifier.graphicsLayer` 不同，新的 `GraphicsLayer` 類別允許您在任何地方渲染 Composable 內容。
這在預期動畫內容在不同場景中渲染的情況下很有用。

有關更詳細的描述和範例，請參閱 [參考說明文件](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/layer/GraphicsLayer)。

### LocalLifecycleOwner 已從 Compose UI 移出

`LocalLifecycleOwner` 類別已從 Compose UI 軟體包移至 Lifecycle 軟體包。

此變更允許您獨立於 Compose UI 存取該類別並呼叫其基於 Compose 的輔助 API。
但是，請記住，如果沒有 Compose UI 綁定，`LocalLifecycleOwner` 實例將沒有平台整合，因此也沒有平台特定事件可供監聽。

## iOS

### 改善 Compose Multiplatform 與 iOS 原生觸控的互通性 {id="ios-touch-interop"}

此版本改善了 iOS 互通視圖的觸控處理。
Compose Multiplatform 現在會嘗試偵測觸控是否用於互通視圖，或者是否應由 Compose 處理。
這使得處理發生在您的 Compose Multiplatform 應用程式中 UIKit 或 SwiftUI 區域內的觸控事件成為可能。

預設情況下，Compose Multiplatform 將延遲 150 毫秒將觸控事件傳輸到互通視圖：

* 如果在此時間範圍內發生超出距離閾值的移動，
    父層 composable 將會攔截觸控序列，並且它將不會轉發到互通視圖。
* 如果沒有明顯移動，Compose 將不處理其餘觸控序列，
    而是僅由互通視圖處理。

此行為與原生 [`UIScrollView`](https://developer.apple.com/documentation/uikit/uiscrollview) 的運作方式一致。
它有助於防止觸控序列在互通視圖中開始，但在 Compose Multiplatform 未感知到的情況下被攔截的情形。這可能導致令人沮喪的使用者體驗。
例如，想像一個在可捲動環境（如懶惰列表）中使用的大型互通視訊播放器。
當螢幕大部分被視訊佔據並攔截所有觸控而 Compose Multiplatform 無法感知到它們時，捲動列表會變得棘手。

### 原生效能改進

<!-- TODO additional copy editing -->

透過 Kotlin 2.0.20，Kotlin/Native 團隊在使 iOS 上的 Compose 應用程式執行更快、更流暢方面取得了長足進步。
Compose Multiplatform 1.7.3 版本利用了這些最佳化，並帶來了 Jetpack Compose 1.7.0 的效能改進。

當比較 Compose Multiplatform 1.6.11 搭配 Kotlin 2.0.0 和 Compose Multiplatform 1.7.3 搭配 Kotlin 2.0.20 時，我們看到全面性的更好結果：

* `LazyGrid` 基準測試模擬 `LazyVerticalGrid` 捲動，這最接近實際使用情境，平均執行速度快約 **9%**。
    它還顯示錯過影格的數量顯著減少，這通常會讓使用者感覺 UI 反應較不靈敏。
    親自試試看：使用 Compose Multiplatform 為 iOS 建置的應用程式應該會感覺流暢許多。
* `VisualEffects` 基準測試渲染大量隨機放置的元件，執行速度快 **3.6** 倍：
    每 1000 影格的平均 CPU 時間從 8.8 秒減少到 2.4 秒。
* `AnimatedVisibility` composable 動畫顯示和隱藏圖像，呈現約 **6%** 更快的渲染速度。

最重要的是，Kotlin 2.0.20 在垃圾回收器中引入了實驗性的 [並行標記支援](https://kotlinlang.org/docs/whatsnew2020.html#concurrent-marking-in-garbage-collector)。啟用並行標記可以縮短垃圾回收器暫停時間，並為所有基準測試帶來更大的改進。

您可以在 Compose Multiplatform 儲存庫中查看這些 Compose 特定基準測試的程式碼：

* [Kotlin/Native 效能基準測試](https://github.com/JetBrains/compose-multiplatform/tree/master/benchmarks/kn-performance)
* [Kotlin/JVM 與 Kotlin/Native 基準測試](https://github.com/JetBrains/compose-multiplatform/tree/master/benchmarks/ios/jvm-vs-kotlin-native)

## 桌面版

### 拖放

拖放機制已在 Compose Multiplatform 桌面版中實作，該機制允許使用者將內容拖入或拖出您的 Compose 應用程式。
要指定拖放的潛在來源和目的地，請使用 `dragAndDropSource` 和 `dragAndDropTarget` 修飾符。

> 雖然這些修飾符在通用程式碼中可用，但它們目前僅適用於桌面和 Android 來源集。
> 請繼續關注未來的版本。
> 
{style="note"}

對於常見使用情境，請參閱 Jetpack Compose 說明文件中的 [專門文章](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop)。

### BasicTextField (由 BasicTextField2 更名) 已在桌面版採用

Jetpack Compose 已使 `BasicTextField2` 元件穩定並將其更名為 `BasicTextField`。
在此版本中，Compose Multiplatform 已為桌面目標採用此變更，並計劃在穩定的 1.7.0 版本中也涵蓋 iOS。

新的 `BasicTextField`：

* 允許您更可靠地管理狀態。
* 提供新的 `TextFieldBuffer` API，用於對文字欄位內容進行程式化的變更。
* 包含多個新的 API，用於視覺轉換和樣式設定。
* 提供對 `UndoState` 的存取，並能夠返回欄位的先前狀態。

### ComposePanel 的渲染設定

透過在 `ComposePanel` 建構函式中指定新的 `RenderSettings.isVsyncEnabled` 參數，您可以提示後端渲染實作禁用垂直同步。
這可以減少輸入和 UI 變更之間的視覺延遲，但也可能導致畫面撕裂。

預設行為保持不變：`ComposePanel` 會嘗試將可繪製的呈現與 VSync 同步。

## 網路版

### skiko.js 對於 Kotlin/Wasm 應用程式來說是多餘的

<!-- TODO additional copy editing -->

`skiko.js` 檔案現在對於使用 Compose Multiplatform 建置的 Kotlin/Wasm 應用程式來說是多餘的。
您可以將其從 `index.html` 檔案中移除，並改善應用程式的載入時間。
`skiko.js` 將在未來版本中從 Kotlin/Wasm 發行版中完全移除。

> `skiko.js` 檔案對於 Kotlin/JS 應用程式來說仍然必要。
> 
{style="note"}