[//]: # (title: Compose Multiplatform 1.8.2 的新功能)
以下是此功能發佈的重點內容：

*   [可變字型](#variable-fonts)
*   [iOS 上的拖放](#drag-and-drop)
*   [iOS 上的深層連結](#deep-linking)
*   [iOS 上改進的輔助功能](#accessibility-support-improvements)
*   [網頁目標的資源預載入](#preloading-of-resources)
*   [與瀏覽器導覽控制整合](#browser-controls-supported-in-the-navigation-library)

有關此版本的完整變更列表，請參閱 [GitHub](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.8.0) 上的內容。

## Dependencies

*   Gradle Plugin `org.jetbrains.compose`，版本 1.8.2。基於 Jetpack Compose 函式庫：
    *   [Runtime 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.8.2)
    *   [UI 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.8.2)
    *   [Foundation 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.8.2)
    *   [Material 1.8.2](https://developer.android.com/jetpack/androidx/releases/compose-material#1.8.2)
    *   [Material3 1.3.2](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.3.2)
*   Lifecycle 函式庫 `org.jetbrains.androidx.lifecycle:lifecycle-*:2.9.0`。基於 [Jetpack Lifecycle 2.9.0](https://developer.android.com/jetpack/androidx/releases/lifecycle#2.9.0)
*   Navigation 函式庫 `org.jetbrains.androidx.navigation:navigation-*:2.9.0-beta03`。基於 [Jetpack Navigation 2.9.0](https://developer.android.com/jetpack/androidx/releases/navigation#2.9.0)
*   Material3 Adaptive 函式庫 `org.jetbrains.compose.material3.adaptive:adaptive*:1.2.0-alpha03`。基於 [Jetpack Material3 Adaptive 1.1.0](https://developer.android.com/jetpack/androidx/releases/compose-material3-adaptive#1.1.0)
*   Savedstate 函式庫 `org.jetbrains.androidx.savedstate:savedstate:1.3.1`。基於 [Jetpack Savedstate 1.3.0](https://developer.android.com/jetpack/androidx/releases/savedstate#1.3.0)
*   WindowManager Core 函式庫 `org.jetbrains.androidx.window:window-core:1.4.0-alpha07`。基於 [Jetpack WindowManager 1.4.0-alpha04](https://developer.android.com/jetpack/androidx/releases/window#1.4.0-alpha04)

## Breaking changes

### 將 Compose Multiplatform 完整遷移到 K2 編譯器

此版本中，Compose Multiplatform 程式碼庫已完整遷移到 K2 編譯器。
從 1.8.0 開始，依賴 Compose Multiplatform 的專案所產生的原生和網頁 klibs 只能在搭配使用 Kotlin 2.1.0 或更新版本時才能使用。

除了 Compose 編譯器 Gradle 外掛程式的底層變更外，這對您的專案意味著什麼：

*   對於使用依賴 Compose Multiplatform 的函式庫的應用程式：建議將您的專案更新到 Kotlin 2.1.20，並將相依性更新到針對 Compose Multiplatform 1.8.0 和 Kotlin 2.1.x 編譯的版本。
*   對於依賴 Compose Multiplatform 的函式庫：您需要將專案更新到 Kotlin 2.1.x 和 Compose 1.8.0，然後重新編譯函式庫並發佈新版本。

如果您在升級到 Compose Multiplatform 1.8.0 時遇到任何相容性問題，請透過在 [YouTrack](https://youtrack.jetbrains.com/newIssue?project=CMP) 中提出問題來告知我們。

### 已移除對 `material-icons-core` 的隱式相依性

Compose Multiplatform 1.8.2 整合了 [Material 中的變更](https://android.googlesource.com/platform/frameworks/support/+/1d1abef790da93325a83fe19b50ccdec06be6956)：不再有對 `material-icons-core` 的遞移相依性。
這與[擺脫使用 K1 建置的相依性](#full-migration-of-compose-multiplatform-to-the-k2-compiler)一致。

如果您需要在專案中繼續使用 `material-icons-core` 函式庫，請明確地將此相依性新增到您的 `build.gradle.kts` 中，例如：

```kotlin
implementation("org.jetbrains.compose.material:material-icons-core:1.7.3")
```

### 導覽中從 Bundle 遷移到 SavedState

Compose Multiplatform 1.8.2 中的導覽，搭配 Android Navigation 元件，正在過渡到使用 `SavedState` 類別來儲存 UI 狀態。
這打破了在導覽圖中宣告目的地時存取狀態資料的模式。
當升級到 [Navigation 函式庫](compose-navigation-routing.md) 的 2.9.* 版本時，請務必更新此類程式碼以使用 `SavedState` 的存取器。

> 為了更穩健的架構，請使用[導覽的型別安全方法](https://developer.android.com/guide/navigation/design/type-safety)，避免字串路由。
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

`ComposeUIViewControllerDelegate` API 已棄用，取而代之的是父視圖控制器。
如果您在 Compose Multiplatform 1.8.2 中使用已棄用的 API，您將遇到棄用錯誤，指示您應該透過父視圖控制器覆寫 `UIViewController` 類別方法。

閱讀更多關於 Apple 開發人員[文件](https://developer.apple.com/documentation/uikit/uiviewcontroller) 中子-父視圖控制器關係的內容。

### 已移除 iOS 上過時的 `platformLayers` 選項

`platformLayers` 實驗性選項 [在 1.6.0 中引入](whats-new-compose-160.md#separate-platform-views-for-popups-dialogs-and-dropdowns-ios-desktop)，以允許啟用替代分層模式並在父容器的範圍之外繪製彈出視窗和對話方塊。

此模式現在是 iOS 上的預設行為，並且啟用它的選項已因過時而被移除。

### 測試中的破壞性變更

#### 測試中協程延遲的新處理方式

之前，Compose Multiplatform 測試不會將帶有 `delay()` 呼叫的副作用視為閒置。
因此，例如以下測試將會無限期掛起：

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

當協程在組合作用域中啟動後呼叫 `delay()` 函式時，`waitForIdle()`、`awaitIdle()` 和 `runOnIdle()` 函式現在會將 Compose 視為閒置。
此變更修復了上述掛起的測試，但會破壞依賴 `waitForIdle()`、`awaitIdle()` 和 `runOnIdle()` 來執行帶有 `delay()` 的協程的測試。

要在這些情況下產生相同的結果，請人工推進時間：

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
// Since waitForIdle() no longer waits for the delayed LaunchedEffect() to complete,
// the test needs to advance time to make the following assertion correct:
mainClock.advanceTimeBy(1001)

assertEquals("1", text)
```

已經使用 `mainClock.advanceTimeBy()` 呼叫來推進測試時鐘的測試，可能會在重新組合、佈局、繪製和效果方面表現出不同的行為。

#### `runOnIdle()` 的實作與 Android 對齊

為使 Compose Multiplatform 中 `runOnIdle()` 測試函式的實作與 Android 行為保持一致，我們引入了以下變更：

*   `runOnIdle()` 現在會在 UI 執行緒上執行其 `action`。
*   `runOnIdle()` 在執行 `action` 後不再呼叫 `waitForIdle()`。

如果您的測試依賴 `runOnIdle()` 動作之後的那個額外 `waitForIdle()` 呼叫，則在為 Compose Multiplatform 1.8.2 更新測試時，請根據需要將該呼叫新增到您的測試中。

#### 測試中時間的推進與渲染分離

在 Compose Multiplatform 1.8.2 中，如果時間沒有推進到渲染下一幀的點（虛擬測試幀每 16 毫秒渲染一次），則 `mainClock.advanceTimeBy()` 函式不再導致重新組合、佈局或繪製。

這可能會破壞依賴每次 `mainClock.advanceTimeBy()` 呼叫觸發渲染的測試。
有關詳細資訊，請參閱 [PR 說明](https://github.com/JetBrains/compose-multiplatform-core/pull/1618)。

## Across platforms

### 可變字型

Compose Multiplatform 1.8.2 支援所有平台上的可變字型。
使用可變字型，您可以保留一個字型檔，其中包含所有樣式偏好設定，例如字重、寬度、傾斜、斜體、自訂軸、帶有排版顏色的視覺字重以及對特定文字大小的適應。

有關詳細資訊，請參閱 [Jetpack Compose 文件](https://developer.android.com/develop/ui/compose/text/fonts#variable-fonts)。

### Skia 已更新至 Milestone 132

Compose Multiplatform 透過 Skiko 使用的 Skia 版本已更新至 Milestone 132。

之前使用的 Skia 版本是 Milestone 126。您可以在[發行說明](https://skia.googlesource.com/skia/+/main/RELEASE_NOTES.md#milestone-132)中查看這些版本之間的變更。

### 新的剪貼簿介面

Compose Multiplatform 已採用 Jetpack Compose 的新 `Clipboard` 介面。

之前使用的 `ClipboardManager` 介面，由於網頁上 [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) 的非同步性質而在網頁目標上無法存取，已棄用並由 `Clipboard` 取代。新介面支援 `suspend` 函式並與所有目標（包括網頁）相容。

來自通用程式碼的剪貼簿互動目前受到 API 設計的限制。
有關詳細資訊，請參閱 [CMP-7624](https://youtrack.jetbrains.com/issue/CMP-7624)。

### 行高對齊

行高對齊的通用 API，以前僅由 Compose Multiplatform 在 Android 上支援，現在在所有平台上都支援。
使用 `LineHeightStyle.Alignment`，您可以配置文字行如何在行高提供的空間內對齊。
文字行可以對齊到預留空間的底部、中心或頂部，或根據其上升和下降值按比例調整。

<img src="compose-180-LineHeightStyle.png" alt="Line-height alignment" width="508"/>

請注意，在 Material3 中，行高對齊的預設值為 `Center`，這意味著除非另有指定，否則 Material3 元件中帶有 `lineHeight` 的文字將在所有平台上套用中央對齊。

## iOS

### 深層連結

透過使用 Compose Multiplatform 1.8.2 搭配 [org.jetbrains.androidx.navigation.navigation-compose](compose-navigation-routing.md) %org.jetbrains.androidx.navigation%，您可以以常見的 Compose 方式在 iOS 上實作深層連結：將深層連結分配給目的地，並使用 `NavController` 導覽至它們。

有關將深層連結引入通用程式碼的指南，請參閱 [](compose-navigation-deep-links.md)。

### XCFramework 中的 Compose 資源

Compose Multiplatform 現在將資源直接嵌入到生成的 XCFrameworks 中。
您可以將帶有資源的 Compose 函式庫建置並用作標準 XCFrameworks。

此功能需要 Kotlin Gradle 外掛程式版本 2.2 或更高版本。

### 輔助功能支援改進

#### 對從右到左語言的支援

Compose Multiplatform 1.8.2 引入了對從右到左語言的輔助功能支援，包括對手勢的正確文字方向處理。

要了解有關 RTL 支援的更多資訊，請參考 [從右到左語言](compose-rtl.md)。

#### 可捲動列表的輔助功能

此版本改進了捲動邊界和元素位置計算的效能和準確性。
透過考慮安全區域，例如劉海和螢幕邊緣，我們確保在間隙和邊緣附近捲動時的精確輔助功能屬性。

我們還引入了對捲動狀態公告的支援。
啟用 VoiceOver 後，執行三指捲動手勢時，您將聽到列表狀態更新。
公告包括：

*   位於列表頂部時為「`第一頁`」。
*   向前捲動時為「`下一頁`」。
*   向後捲動時為「`上一頁`」。
*   到達末尾時為「`最後一頁`」。

還提供了這些公告的本地化版本，允許 VoiceOver 以您選擇的語言閱讀它們。

#### 容器視圖的輔助功能

從 Compose Multiplatform 1.8.2 開始，您可以為容器定義遍歷語義屬性，以確保在捲動和滑動複雜視圖時的正確閱讀順序。

除了為螢幕閱讀器正確排序元素外，對遍歷屬性的支援允許使用向上滑動或向下滑動輔助功能手勢在不同的遍歷組之間導覽。
要切換到容器的可存取導覽模式，請在 VoiceOver 啟用時在螢幕上旋轉兩指。

在[輔助功能](compose-accessibility.md#traversal-order)部分了解有關遍歷語義屬性的更多資訊。

#### 可存取文字輸入

在 Compose Multiplatform 1.8.2 中，我們引入了對文字欄位輔助功能特性的支援。
當文字輸入欄位獲得焦點時，它現在會被標記為可編輯，確保正確的輔助功能狀態表示。

您現在也可以在 UI 測試中使用可存取文字輸入。

#### 支援透過觸控板和鍵盤控制

Compose Multiplatform for iOS 現在支援兩種額外的輸入方法來控制您的裝置。無須依賴觸控螢幕，您可以啟用 AssistiveTouch 來使用滑鼠或觸控板，或啟用完全鍵盤取用來使用鍵盤：

*   `AssistiveTouch`（**設定** | **輔助使用** | **觸控** | **AssistiveTouch**）允許您使用連接的滑鼠或觸控板的指標來控制您的 iPhone 或 iPad。您可以使用指標點擊螢幕上的圖示、瀏覽 AssistiveTouch 選單或使用螢幕鍵盤輸入。
*   `完全鍵盤取用`（**設定** | **輔助使用** | **鍵盤** | **完全鍵盤取用**）啟用透過連接的鍵盤控制裝置。您可以使用 **Tab** 等按鍵導覽並使用 **Space** 啟用項目。

#### 按需載入輔助功能樹

無須設定將 Compose 語義樹與 iOS 輔助功能樹同步的特定模式，您現在可以依賴 Compose Multiplatform 懶惰地處理此過程。
該樹在 iOS 輔助功能引擎發出第一個請求後完全載入，並在螢幕閱讀器停止與其互動時被處置。

這完全支援依賴輔助功能樹的 iOS 語音控制、VoiceOver 和其他輔助功能工具。

`AccessibilitySyncOptions` 類別，該類別[曾用於配置輔助功能樹同步](compose-ios-accessibility.md#choose-the-tree-synchronization-option)，已因不再需要而被移除。

#### 輔助功能屬性計算的準確性改進

我們已更新 Compose Multiplatform 元件的輔助功能屬性，以符合 UIKit 元件的預期行為。
UI 元素現在提供廣泛的輔助功能資料，並且任何 alpha 值為 0 的透明元件不再提供輔助功能語義。

對齊語義也使我們能夠修復與輔助功能屬性計算不正確相關的幾個問題，例如 `DropDown` 元素缺少點擊區域、可見文字和輔助功能標籤之間的不匹配，以及錯誤的單選按鈕狀態。

### iOS 記錄的穩定 API

在 iOS 上啟用作業系統記錄的 API 現在已穩定。`enableTraceOSLog()` 函式不再需要實驗性選擇加入，並且現在與 Android 風格的記錄對齊。此記錄提供可以使用 Xcode Instruments 進行偵錯和效能分析的追蹤資訊。

### 拖放
<secondary-label ref="Experimental"/>

Compose Multiplatform for iOS 引入了對拖放功能的支援，允許您將內容拖曳到 Compose 應用程式中或從中拖曳內容（有關示範影片，請參閱拉取請求 [1690](https://github.com/JetBrains/compose-multiplatform-core/pull/1690)）。
要定義可拖曳內容和拖放目標，請使用 `dragAndDropSource` 和 `dragAndDropTarget` 修飾符。

在 iOS 上，拖放會話資料由 [`UIDragItem`](https://developer.apple.com/documentation/uikit/uidragitem) 表示。
此物件包含有關跨程序資料傳輸的資訊以及用於應用程式內使用的可選本地物件。
例如，您可以使用 `DragAndDropTransferData(listOf(UIDragItem.fromString(text)))` 來拖曳文字，其中 `UIDragItem.fromString(text)` 將文字編碼為適合拖放操作的格式。
目前僅支援 `String` 和 `NSObject` 類型。

對於常見用例，請參閱 Jetpack Compose 文件中的[專門文章](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop)。

### 改進了捲動互操作視圖的觸控處理

在此版本中：

*   帶有不可捲動內容並作為模態 `UIViewController` 呈現的 Compose 視圖可以透過向下滑動手勢關閉。
*   巢狀可捲動視圖在通用[互操作觸控框架](compose-ios-touch.md)內正常工作：當在可捲動的 Compose 視圖中捲動原生內容，或在可捲動的原生視圖中捲動 Compose 內容時，UI 緊密遵循 iOS 邏輯來解決模糊的觸控序列。

### 選擇啟用並行渲染
<secondary-label ref="Experimental"/>

Compose Multiplatform for iOS 現在支援將渲染任務卸載到專用的渲染執行緒。
並行渲染可能會在沒有 UIKit 互操作的場景中提高效能。

透過啟用 `ComposeUIViewControllerConfiguration` 類別的 `useSeparateRenderThreadWhenPossible` 旗標，或直接在 `ComposeUIViewController` 配置區塊中啟用 `parallelRendering` 屬性，選擇在單獨的渲染執行緒上編碼渲染命令：

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

### 導覽函式庫支援瀏覽器控制

在搭配 Compose Multiplatform 建置的 Kotlin/Wasm 和 Kotlin/JS 應用程式中，導覽現在可以正確地與基本瀏覽器控制配合使用。
要啟用此功能，請使用 `window.bindToNavigation()` 方法將瀏覽器視窗連結到主導覽圖。
一旦您這樣做，網路應用程式將正確響應使用瀏覽器中的 **返回** 和 **前進** 按鈕來瀏覽歷史記錄（有關示範影片，請參閱拉取請求 [1621](https://github.com/JetBrains/compose-multiplatform-core/pull/1621)）。

網路應用程式還將操作瀏覽器網址列以反映當前目的地路由，並在使用者貼上包含正確編碼路由的 URL 時直接導航到目的地（有關示範影片，請參閱拉取請求 [1640](https://github.com/JetBrains/compose-multiplatform-core/pull/1640)）。
`window.bindToNavigation()` 方法具有可選的 `getBackStackEntryPath` 參數，它允許您自定義路由字串到 URL 片段的翻譯。

### 設定瀏覽器游標
<secondary-label ref="Experimental"/>

我們引入了一個實驗性的 `PointerIcon.Companion.fromKeyword()` 函式來管理可用作瀏覽器頁面上滑鼠指標的圖示。
透過傳遞關鍵字作為參數，您可以根據上下文指定要顯示的游標類型。
例如，您可以分配不同的指標圖示來選取文字、開啟上下文選單或指示載入過程。

查看可用[關鍵字](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)的完整列表。

### 資源預載入
<secondary-label ref="Experimental"/>

Compose Multiplatform 1.8.2 為網頁目標引入了一個新的實驗性 API，用於預載入字型和圖像。
預載入有助於防止視覺問題，例如未經樣式處理的文字閃爍 (FOUT) 或圖像和圖示的閃爍。

以下函式現在可用於載入和快取資源：

*   `preloadFont()`，用於預載入字型。
*   `preloadImageBitmap()`，用於預載入點陣圖圖像。
*   `preloadImageVector()`，用於預載入向量圖像。

有關詳細資訊，請參閱[文件](compose-multiplatform-resources-usage.md#preload-resources-using-the-compose-multiplatform-preload-api)。

## Desktop

### Windows 上的軟體渲染改進

切換到 Windows 上 Skia 推薦的 clang 編譯器加快了依賴 CPU 的渲染速度。
這主要影響純軟體渲染，因為渲染通常依賴 GPU，只有一些計算在 CPU 上完成。
因此，在某些虛擬機器上以及一些 [Skia 不支援](https://github.com/JetBrains/skiko/blob/30df516c1a1a25237880f3e0fe83e44a13821292/skiko/src/jvmMain/kotlin/org/jetbrains/skiko/GraphicsApi.jvm.kt#L13) 的舊顯示卡上，改進非常明顯：Compose Multiplatform 產生的 Windows 應用程式在這些環境中的速度比 Compose Multiplatform 1.7.3 快 6 倍。

除了對 Windows for ARM64 的支援外，這項改進使 macOS 下虛擬 Windows 系統上的 Compose Multiplatform UI 的效能顯著提高。

### 支援 Windows for ARM64

Compose Multiplatform 1.8.2 引入了對 JVM 上 Windows for ARM64 的支援，改進了在基於 ARM 的 Windows 裝置上建置和執行應用程式的整體體驗。

## Gradle plugin

### 變更生成的 Res 類別名稱的選項

您現在可以自訂生成的資源類別的名稱，該類別提供對應用程式中資源的存取。
自訂命名對於區分多模組專案中的資源特別有用，並有助於保持與專案命名約定的相容性。

要定義自訂名稱，請將以下行新增到您的 `build.gradle.kts` 檔案中的 `compose.resources` 區塊：

```kotlin
compose.resources {
    nameOfResClass = "MyRes"
}
```

有關詳細資訊，請參閱[拉取請求](https://github.com/JetBrains/compose-multiplatform/pull/5296)。

### `androidLibrary` 目標中對多平台資源的支援
<secondary-label ref="Experimental"/>

從 Android Gradle 外掛程式版本 8.8.0 開始，您可以在新的 `androidLibrary` 目標中使用生成的資產。
為了使 Compose Multiplatform 與這些變更保持一致，我們引入了對新目標配置的支援，以處理打包到 Android 資產中的多平台資源。

如果您使用 `androidLibrary` 目標，請在您的配置中啟用資源：

```
kotlin {
    androidLibrary {
        androidResources.enable = true
    }
}
```

否則，您將遇到以下例外：`org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: …`。