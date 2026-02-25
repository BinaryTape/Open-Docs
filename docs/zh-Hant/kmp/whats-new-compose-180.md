[//]: # (title: Compose Multiplatform 1.8.2 新功能)

以下是此功能版本的主要亮點：

* [可變字型](#variable-fonts)
* [iOS 上的拖放功能](#drag-and-drop)
* [iOS 上的深層連結](#deep-linking)
* [改進 iOS 上的無障礙功能](#accessibility-support-improvements)
* [針對 Web 目標預先載入資源](#preloading-of-resources)
* [與瀏覽器導覽控制項整合](#browser-controls-supported-in-the-navigation-library)

請參閱 [GitHub 上](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.8.0)此版本的完整變更清單。

## 相依性

* Gradle 外掛程式 `org.jetbrains.compose` 版本 1.8.2。基於 Jetpack Compose 庫：
    * [Runtime 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.8.2)
    * [UI 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.8.2)
    * [Foundation 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.8.2)
    * [Material 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-material#1.8.2)
    * [Material3 1.3.2](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.3.2)
* Lifecycle 庫 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.9.0`。基於 [Jetpack Lifecycle 2.9.0](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.9.0)
* Navigation 庫 `org.jetbrains.androidx.navigation:navigation-*:2.9.0-beta03`。基於 [Jetpack Navigation 2.9.0](https://developer.android.com/jetpack/androidx/releases/navigation#2.9.0)
* Material3 Adaptive 庫 `org.jetbrains.compose.material3.adaptive:adaptive*:1.2.0-alpha03`。基於 [Jetpack Material3 Adaptive 1.1.0](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.1.0)
* Savedstate 庫 `org.jetbrains.androidx.savedstate:savedstate:1.3.1`。基於 [Jetpack Savedstate 1.3.0](https://developer.android.com/jetpack/androidx/releases/savedstate#1.3.0)
* WindowManager Core 庫 `org.jetbrains.androidx.window:window-core:1.4.0-alpha07`。基於 [Jetpack WindowManager 1.4.0-alpha04](https://developer.android.com/jetpack/androidx/releases/window#1.4.0-alpha04)

## 破壞性變更

### Compose Multiplatform 全面遷移至 K2 編譯器

在此版本中，Compose Multiplatform 程式碼庫已全面遷移至 K2 編譯器。
從 1.8.0 開始，
由依賴於 Compose Multiplatform 的專案所產生的原生與 Web klib，
僅能在使用 Kotlin 2.1.0 或更新版本時才能被取用。

除了 Compose 編譯器 Gradle 外掛程式的底層變更外，這對您的專案還意味著：

* 對於使用依賴 Compose Multiplatform 庫的應用程式：
  建議將您的專案更新至 Kotlin 2.1.20，
  並將相依性更新為針對 Compose Multiplatform 1.8.0 和 Kotlin 2.1.x 編譯的版本。
* 對於依賴 Compose Multiplatform 的程式庫：
    您需要將專案更新至 Kotlin 2.1.x 和 Compose 1.8.0，
    然後重新編譯程式庫並發佈新版本。

如果您在升級到 Compose Multiplatform 1.8.0 時遇到任何相容性問題，
請透過在 [YouTrack](https://youtrack.jetbrains.com/newIssue?project=CMP) 提交問題來告知我們。

### 移除了對 `material-icons-core` 的隱含相依性

Compose Multiplatform 1.8.2 納入了 [Material 中所做的一項變更](https://android.googlesource.com/platform/frameworks/support/+/1d1abef790da93325a83fe19b50ccdec06be6956)：
不再存在對 `material-icons-core` 的遞移相依性。
這與 [捨棄使用 K1 建置的相依性](#full-migration-of-compose-multiplatform-to-the-k2-compiler) 保持一致。

如果您需要在專案中繼續使用 `material-icons-core` 庫，
請在您的 `build.gradle.kts` 中明確加入該相依性，例如：

```kotlin
implementation("org.jetbrains.compose.material:material-icons-core:1.7.3")
```

您也可以[使用來自 Material Symbols 庫的向量 Android XML 圖示](compose-multiplatform-resources-usage.md#icons)。

### Navigation 中從 Bundle 遷移至 SavedState

Compose Multiplatform 1.8.2 中的 Navigation，
以及 Android Navigation 組件，正在轉型為使用 `SavedState` 類別來存儲 UI 狀態。
這會破壞您在導覽圖中宣告目的地時存取狀態資料的模式。
當升級到 2.9.* 版本的 [Navigation 庫](compose-navigation-routing.md)時，
請確保更新此類程式碼以使用 `SavedState` 的存取子。

> 為了獲得更穩健的架構，
> 請使用[型別安全的方法進行導覽](https://developer.android.com/guide/navigation/design/type-safety)，
> 避免使用字串路由（route）。
>
{style="note"}

之前：

```kotlin
composable(Destinations.Followers.route) { navBackStackEntry ->
    val uId = navBackStackEntry.arguments?.getString("userid")
    val page = navBackStackEntry.arguments?.getString("page")
    if (uId != null && page != null) {
        FollowersMainComposable(navController, accountId = uId, page = page)
    }
}
```

從 Compose Multiplatform 1.8.2 開始：

```kotlin
composable(Destinations.Followers.route) { navBackStackEntry ->
    val uId = navBackStackEntry.arguments?.read { getStringOrNull("userid") }
    val page = navBackStackEntry.arguments?.read { getStringOrNull("page") }
    if (uId != null && page != null) {
        FollowersMainComposable(navController, accountId = uId, page = page)
    }
}
```

### iOS 上已棄用的 `ComposeUIViewControllerDelegate`

`ComposeUIViewControllerDelegate` API 已被棄用，取而代之的是父視圖控制器（parent view controller）。 
如果您在 Compose Multiplatform 1.8.2 中使用已棄用的 API，您將會遇到棄用錯誤，指出 
您應該透過父視圖控制器覆寫 `UIViewController` 類別方法。

在 Apple 開發者 [文件](https://developer.apple.com/documentation/uikit/uiviewcontroller) 中進一步了解子父視圖控制器關係。

### 移除了 iOS 上過時的 `platformLayers` 選項

`platformLayers`
實驗性選項 [是在 1.6.0 中引入的](whats-new-compose-160.md#separate-platform-views-for-popups-dialogs-and-dropdowns-ios-desktop)，
用以允許啟用替代的分層模式，並在父容器的邊界之外繪製彈出視窗和對話方塊。

此模式現在是 iOS 上的預設行為，啟用它的選項已被視為過時並移除。

### 測試中的破壞性變更

#### 測試中協同程式延遲的新處理方式

以前，Compose Multiplatform 測試不會將帶有 `delay()` 呼叫的副作用視為空閒（idle）。
因此，例如以下測試會無限期地掛起：

```kotlin
@Test
fun loopInLaunchedEffectTest() = runComposeUiTest {
    setContent {
        LaunchedEffect(Unit) {
            while (true) {
                delay(1000)
                println("Tick")
            }
        }
    }
}
```

當協同程式在組合（composition）作用域中啟動並呼叫 `delay()` 函式後，`waitForIdle()`、`awaitIdle()` 
及 `runOnIdle()` 函式現在會將 Compose 視為空閒。
此變更修復了上述掛起的測試，但會破壞依賴 `waitForIdle()`、`awaitIdle()` 和 `runOnIdle()` 
來執行帶有 `delay()` 的協同程式的測試。

若要在這些情況下產生相同的結果，請人工推進時間：

```kotlin
var updateText by mutableStateOf(false)
var text by mutableStateOf("0")
setContent {
    LaunchedEffect(updateText) {
        if (updateText) {
            delay(1000)
            text = "1"
        }
    }
}
updateText = true
waitForIdle()
// 由於 waitForIdle() 不再等待延遲的 LaunchedEffect() 完成，
// 測試需要推進時間以使以下斷言正確：
mainClock.advanceTimeBy(1001)

assertEquals("1", text)
```

已經使用 `mainClock.advanceTimeBy()` 呼叫來推進測試時鐘的測試，在重新組合、佈局、繪圖和效果方面的行為可能會有所不同。

#### `runOnIdle()` 的實作與 Android 保持一致

為了使 `runOnIdle()` 測試函式的 Compose Multiplatform 實作與 Android 的行為一致，
我們引入了以下變更：

* `runOnIdle()` 現在在其 UI 執行緒上執行其 `action`。
* `runOnIdle()` 在執行 `action` 後不再呼叫 `waitForIdle()`。

如果您的測試依賴於 `runOnIdle()` 操作之後的額外 `waitForIdle()` 呼叫，
請在為 Compose Multiplatform 1.8.2 更新測試時，根據需要加入該呼叫。

#### 測試中的時間推進與渲染解耦

在 Compose Multiplatform 1.8.2 中，如果時間沒有推進超過下一個幀渲染點（虛擬測試幀每 16 毫秒渲染一次），
`mainClock.advanceTimeBy()` 函式將不再導致重新組合、佈局或繪圖。

這可能會破壞依賴於每次 `mainClock.advanceTimeBy()` 呼叫觸發渲染的測試。
詳情請參閱 [PR 說明](https://github.com/JetBrains/compose-multiplatform-core/pull/1618)。

## 跨平台

### 可變字型

Compose Multiplatform 1.8.2 在所有平台支援可變字型（variable font）。
透過可變字型，您可以保留單一字型檔案，其中包含所有樣式偏好，例如粗細、
寬度、傾斜、斜體、自訂軸、具有排版色彩的視覺粗細，
以及對特定文字大小的適應。

詳情請參閱 [Jetpack Compose 文件](https://developer.android.com/develop/ui/compose/text/fonts#variable-fonts)。

### Skia 更新至 Milestone 132

Compose Multiplatform 透過 Skiko 使用的 Skia 版本已更新至 Milestone 132。

先前使用的 Skia 版本是 Milestone 126。您可以在 [版本說明](https://skia.googlesource.com/skia/+/main/RELEASE_NOTES.md#milestone-132) 中查看這些版本之間的變更。

### 新的 Clipboard 介面

Compose Multiplatform 已採用 Jetpack Compose 的新 `Clipboard` 介面。

先前使用的 `ClipboardManager` 介面由於 [Web 上的 Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) 的非同步特性而無法在 Web 目標上存取，
現已被棄用並由 `Clipboard` 取代。新介面支援 `suspend` 函式，並與所有目標相容，
包括 Web。

來自共同（common）程式碼的剪貼簿互動目前受到 API 設計的限制。
更多詳情請參閱 [CMP-7624](https://youtrack.jetbrains.com/issue/CMP-7624)。

### 行高對齊

先前僅由 Android 上的 Compose Multiplatform 支援的行高對齊共同 API，現在已在所有平台上得到支援。
使用 `LineHeightStyle.Alignment`，您可以配置文字行如何在行高提供的空間內對齊。
文字行可以對齊到預留空間的底部、中心或頂部，
或根據其上升（ascent）和下降（descent）值比例進行調整。

<img src="compose-180-LineHeightStyle.png" alt="行高對齊" width="508"/>

請注意，在 Material3 中，行高對齊的預設值為 `Center`，
這意味著除非另有指定，否則中心對齊將套用於所有平台上 Material3 組件中具有 `lineHeight` 的文字。

## iOS

### 深層連結

透過將 Compose Multiplatform 1.8.2 與 [org.jetbrains.androidx.navigation.navigation-compose](compose-navigation-routing.md)
%org.jetbrains.androidx.navigation% 搭配使用，
您可以按通常的 Compose 方式在 iOS 上實作深層連結（deep linking）：
為目的地分配深層連結，並使用 `NavController` 導覽至這些目的地。

有關將深層連結引入共同程式碼的指南，請參閱 [深層連結](compose-navigation-deep-links.md)。

### XCFrameworks 中的 Compose 資源

Compose Multiplatform 現在直接在產生的 XCFrameworks 中內嵌資源。 
您可以建置並使用帶有資源的 Compose 庫作為標準 XCFrameworks。 

此功能需要 Kotlin Gradle 外掛程式版本 2.2 或更高版本。

### 改進無障礙功能支援

#### 支援從右到左的語言

Compose Multiplatform 1.8.2 引入了對從右到左（RTL）語言的無障礙功能支援，
包括手勢的正確文字方向處理。

進一步了解 RTL 支援，請參閱 [從右到左語言](compose-rtl.md)。

#### 可捲動清單的無障礙功能

此版本改進了捲動邊界和元素位置計算的效能與準確性。
透過考量安全區域（例如瀏海屏和螢幕邊緣），
我們確保了在間隙和邊界附近捲動時精確的無障礙屬性。

我們還引入了對捲動狀態宣告（announcement）的支援。
在啟用 VoiceOver 的情況下，執行三指捲動手勢時，您將聽到清單狀態更新。
宣告內容包括：

* 位於清單頂部時提示 "First page"。
* 向前捲動時提示 "Next page"。
* 向後捲動時提示 "Previous page"。
* 到達結尾時提示 "Last page"。

還提供了這些宣告的在地化版本，讓 VoiceOver 可以使用您選擇的語言讀取它們。

#### 容器視圖的無障礙功能

從 Compose Multiplatform 1.8.2 開始，
您可以為容器定義遍歷語義屬性（traversal semantic properties），
以確保在捲動和滑動瀏覽複雜視圖時具有正確的讀取順序。

除了為螢幕閱讀器正確排序元素外，
對遍歷屬性的支援還啟用了透過向上滑動或向下滑動無障礙手勢在不同遍歷組之間進行導覽。
若要切換到容器的無障礙導覽模式，請在 VoiceOver 啟用時在螢幕上旋轉兩指。

在 [無障礙功能](compose-accessibility.md#traversal-order) 章節中進一步了解遍歷語義屬性。

#### 無障礙文字輸入

在 Compose Multiplatform 1.8.2 中，我們引入了對文字欄位無障礙特性（accessibility traits）的支援。
當文字輸入欄位獲得焦點時，它現在會被標記為可編輯，
確保無障礙狀態的正確呈現。

您現在也可以在 UI 測試中使用無障礙文字輸入。

#### 支援透過觸控板和鍵盤控制

Compose Multiplatform for iOS 現在支援兩種額外的輸入方式來控制您的裝置。除了依賴觸控螢幕， 
您還可以啟用 AssistiveTouch 以使用滑鼠或觸控板，或啟用全面鍵盤控制（Full Keyboard Access）以使用鍵盤：

* AssistiveTouch（**設定** | **無障礙功能** | **觸控** | **AssistiveTouch**）允許您透過連接的滑鼠或觸控板的指標來控制您的 iPhone 或 
 iPad。您可以使用指標點擊螢幕上的圖示、 
 瀏覽 AssistiveTouch 選單或使用螢幕鍵盤打字。
* 全面鍵盤控制（**設定** | **無障礙功能** | **鍵盤** | **全面鍵盤控制**）可讓您使用連接的鍵盤控制裝置。 
 您可以使用 **Tab** 等按鍵進行導覽，並使用 **空白鍵** 啟用項目。

#### 按需載入無障礙樹

現在您可以依賴 Compose Multiplatform 以延遲加載的方式處理此過程，
而不是設定特定的 Compose 語義樹與 iOS 無障礙樹的同步模式。
該樹在 iOS 無障礙引擎發出第一次請求後完全加載，
並在螢幕閱讀器停止與其互動時釋放。

這可完全支援 iOS 語音控制（Voice Control）、VoiceOver 
以及其他依賴於無障礙樹的無障礙工具。

先前 [用於配置無障礙樹同步](compose-ios-accessibility.md#choose-the-tree-synchronization-option) 的 `AccessibilitySyncOptions` 類別已被移除，因為不再需要。

#### 改進無障礙屬性計算的準確性

我們更新了 Compose Multiplatform 組件的無障礙屬性，
以匹配 UIKit 組件的預期行為。
UI 元素現在提供詳盡的無障礙數據，
且任何 Alpha 值為 0 的透明組件將不再提供無障礙語義。

語義對齊也讓我們 
修復了數個與無障礙屬性計算錯誤相關的問題，
例如 `DropDown` 元素遺漏點擊區域、
可見文字與無障礙標籤不匹配，以及錯誤的單選按鈕狀態。

### iOS 記錄的穩定 API

在 iOS 上啟用作業系統記錄（logging）的 API 現已穩定。`enableTraceOSLog()` 函式不再需要 
實驗性加入，現在與 Android 風格的記錄保持一致。此記錄提供的追蹤資訊可以使用 
Xcode Instruments 進行分析，以進行偵錯與效能分析。

### 拖放
<primary-label ref="Experimental"/>

Compose Multiplatform for iOS 引入了對拖放（drag-and-drop）功能的支援，
允許您將內容拖入或拖出 Compose 應用程式
（請參閱拉取請求 [1690](https://github.com/JetBrains/compose-multiplatform-core/pull/1690) 以觀看演示影片）。
若要定義可拖動內容和放置目標，請使用 `dragAndDropSource` 和 `dragAndDropTarget` 修飾符。

在 iOS 上，拖放會話資料由 [`UIDragItem`](https://developer.apple.com/documentation/uikit/uidragitem) 表示。
此物件包含有關跨程序資料傳輸的資訊，以及一個用於應用程式內使用的選擇性本機物件。
例如，您可以使用 `DragAndDropTransferData(listOf(UIDragItem.fromString(text)))` 來拖動文字，
其中 `UIDragItem.fromString(text)` 會將文字編碼為適合拖放操作的格式。
目前僅支援 `String` 與 `NSObject` 型別。

有關常見用法，
請參閱 Jetpack Compose 文件中的 [專題文章](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop)。

### 改進捲動互通視圖的觸控處理

在此版本中：

* 以強制回應（modal）`UIViewController` 呈現且內容不可捲動的 Compose 視圖，可以透過向下滑動手勢關閉。
* 巢狀捲動視圖在通用 [互通觸控框架](compose-ios-touch.md) 中可正常工作：
  當在可捲動的 Compose 視圖中捲動原生內容，或在可捲動的原生視圖中捲動 Compose 內容時，
  UI 會緊密遵循 iOS 邏輯以解析模糊的觸控序列。

### 選擇性加入並發渲染
<primary-label ref="Experimental"/>

Compose Multiplatform for iOS 現在支援將渲染任務卸載到專用的渲染執行緒。
並發渲染可以在沒有 UIKit 互通性的場景下改進效能。

透過啟用 `ComposeUIViewControllerConfiguration` 類別的 `useSeparateRenderThreadWhenPossible` 
標記，或直接在 `ComposeUIViewController` 配置區塊中啟用 `parallelRendering` 
屬性，來選擇在單獨的渲染執行緒上對渲染指令進行編碼：

```kotlin
@OptIn(ExperimentalComposeUiApi::class)
fun main(vararg args: String) {
    UIKitMain {
        ComposeUIViewController(configure = { parallelRendering = true }) {
            // ...
        }
    }
}
```

## Web

### Navigation 庫支援瀏覽器控制項

在以 Compose Multiplatform 建置的 Kotlin/Wasm 和 Kotlin/JS 應用程式中，
導覽現在可以與基本瀏覽器控制項正常配合工作。
若要啟用此功能，請使用 `window.bindToNavigation()` 方法將瀏覽器視窗連結到主導覽圖。
完成此操作後，Web 應用程式將能正確回應使用 **後退** 和 **前進** 按鈕在瀏覽器歷程記錄中移動
（請參閱拉取請求 [1621](https://github.com/JetBrains/compose-multiplatform-core/pull/1621) 以觀看演示影片）。

Web 應用程式還會操縱瀏覽器網址列以反映當前的目的地路由，
並在使用者貼上帶有正確路由編碼的 URL 時直接導覽至目的地
（請參閱拉取請求 [1640](https://github.com/JetBrains/compose-multiplatform-core/pull/1640) 以觀看演示影片）。
`window.bindToNavigation()` 方法具有選用的 `getBackStackEntryPath` 參數，
可讓您自訂將路由字串轉換為 URL 片段的方式。

### 設定瀏覽器游標
<primary-label ref="Experimental"/>

我們引入了實驗性的 `PointerIcon.Companion.fromKeyword()` 函式，用於管理可用作瀏覽器頁面上滑鼠 
指標的圖示。透過傳遞關鍵字作為參數，您可以根據內容指定要顯示的游標類型。 
例如，您可以分配不同的指標圖示來選取文字、開啟操作功能表或指示載入程序。

查看可用 [關鍵字](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor) 的完整清單。

### 預先載入資源
<primary-label ref="Experimental"/>

Compose Multiplatform 1.8.2 為 Web 目標引入了新的實驗性 API，
用於預先載入字型和圖片。
預先載入有助於 
防止視覺問題，例如未樣式文字快閃（FOUT）或圖片和圖示的閃爍。

以下函式現在可用於載入和快取資源：

* `preloadFont()`，預先載入字型。
* `preloadImageBitmap()`，預先載入位圖圖片。
* `preloadImageVector()`，預先載入向量圖片。

詳情請參閱 [文件](compose-web-resources.md#preload-resources-using-the-compose-multiplatform-preload-api)。

## 桌面

### Windows 上的軟體渲染改進

在 Windows 上為 Skia 切換到推薦的 clang 編譯器，加快了依賴 CPU 的渲染。
這主要影響純軟體渲染，因為渲染通常依賴 GPU，只有部分計算在 CPU 上完成。
因此，在某些虛擬機 
以及少數 [不被 Skia 支援](https://github.com/JetBrains/skiko/blob/30df516c1a1a25237880f3e0fe83e44a13821292/skiko/src/jvmMain/kotlin/org/jetbrains/skiko/GraphicsApi.jvm.kt#L13) 的舊顯示卡上，改進非常明顯：
由 Compose Multiplatform 產生的 Windows 應用程式在這些環境中的速度現在比 Compose Multiplatform 1.7.3 快 6 倍。

這項改進加上 Windows for ARM64 的支援，使得 macOS 虛擬 Windows 系統下的 Compose Multiplatform UI 
效能顯著提升。

### 支援 Windows for ARM64

Compose Multiplatform 1.8.2 引入了對 JVM 上 Windows for ARM64 的支援，
提升了在 ARM 架構 Windows 裝置上建置與執行應用程式的整體體驗。

## Gradle 外掛程式

### 變更產生的 Res 類別名稱之選項

您現在可以自訂產生的資源類別名稱，該類別提供對應用程式中資源的存取。
自訂命名對於區分多模組專案中的資源特別有用，並有助於 
與專案的命名慣例保持一致。

若要定義自訂名稱，請將以下行加入到 `build.gradle.kts` 檔案中的 `compose.resources` 區塊：

```kotlin
compose.resources {
    nameOfResClass = "MyRes"
}
```

更多詳情請參閱 [拉取請求](https://github.com/JetBrains/compose-multiplatform/pull/5296)。

### 在 `androidLibrary` 目標中支援多平台資源
<primary-label ref="Experimental"/>

從 Android Gradle 外掛程式版本 8.8.0 開始，您可以在新的 `androidLibrary` 目標中使用產生的資產（asset）。 
為了讓 Compose Multiplatform 與這些變更保持一致，我們引入了對新目標組態的支援，以處理 
打包到 Android 資產中的多平台資源。

如果您正在使用 `androidLibrary` 目標，請在您的組態中啟用資源：

```
kotlin {
    androidLibrary {
        androidResources.enable = true
    }
}
```

否則，您將會遇到以下異常：`org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: …`。