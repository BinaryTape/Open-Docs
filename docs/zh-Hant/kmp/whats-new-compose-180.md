[//]: # (title: Compose Multiplatform 1.8.2 的新功能)
以下是此功能版本的主要亮點：

*   [可變字體](#variable-fonts)
*   [iOS 上的拖放功能](#drag-and-drop)
*   [iOS 上的深層連結](#deep-linking)
*   [iOS 上改進的輔助功能](#accessibility-support-improvements)
*   [網頁目標的資源預載入](#preloading-of-resources)
*   [與瀏覽器導航控制的整合](#browser-controls-supported-in-the-navigation-library)

請參閱此版本的完整變更列表[在 GitHub 上](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.8.0)。

## Dependencies

*   Gradle 外掛 `org.jetbrains.compose`，版本 1.8.2。基於 Jetpack Compose 函式庫：
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

### Compose Multiplatform 完全遷移至 K2 編譯器

在此版本中，Compose Multiplatform 程式碼庫已完全遷移至 K2 編譯器。
從 1.8.0 開始，
依賴 Compose Multiplatform 的專案所產生的原生和 Web klibs 只能在 Kotlin 2.1.0 或更新版本中使用。

除了 Compose 編譯器 Gradle 外掛中的底層變更之外，這對您的專案意味著：

*   對於使用依賴 Compose Multiplatform 的函式庫的應用程式：
    建議您將專案更新至 Kotlin 2.1.20，
    並將依賴項更新為針對 Compose Multiplatform 1.8.0 和 Kotlin 2.1.x 編譯的版本。
*   對於依賴 Compose Multiplatform 的函式庫：
    您需要將專案更新至 Kotlin 2.1.x 和 Compose 1.8.0，
    然後重新編譯函式庫並發布新版本。

如果您在升級到 Compose Multiplatform 1.8.0 時遇到任何相容性問題，
請透過在 [YouTrack](https://youtrack.jetbrains.com/newIssue?project=CMP) 中提交問題告知我們。

### 移除了對 `material-icons-core` 的隱式依賴

Compose Multiplatform 1.8.2 納入了 [Material 中的一項變更](https://android.googlesource.com/platform/frameworks/support/+/1d1abef790da93325a83fe19b50ccdec06be6956)：
不再有對 `material-icons-core` 的傳遞依賴。
這與[逐步淘汰使用 K1 建置的依賴項](#full-migration-of-compose-multiplatform-to-the-k2-compiler)保持一致。

如果您需要繼續在專案中使用 `material-icons-core` 函式庫，
請明確地將依賴項新增至您的 `build.gradle.kts`，例如：

```kotlin
implementation("org.jetbrains.compose.material:material-icons-core:1.7.3")
```

### 導航中從 Bundle 遷移到 SavedState

Compose Multiplatform 1.8.2 中的導航，
與 Android 導航組件一起，正在過渡到使用 `SavedState` 類別來儲存 UI 狀態。
這打破了在導航圖中宣告目的地時訪問狀態資料的模式。
升級到 [Navigation 函式庫](compose-navigation-routing.md) 的 2.9.* 版本時，
請務必更新此類程式碼以使用 `SavedState` 的存取器。

> 為了更穩健的架構，
> 請使用[型別安全導航方法](https://developer.android.com/guide/navigation/design/type-safety)，
> 避免使用字串路由。
>
{style="note"}

Before:

```kotlin
composable(Destinations.Followers.route) { navBackStackEntry ->
    val uId = navBackStackEntry.arguments?.getString("userid")
    val page = navBackStackEntry.arguments?.getString("page")
    if (uId != null && page != null) {
        FollowersMainComposable(navController, accountId = uId, page = page)
    }
}
```

Starting with Compose Multiplatform 1.8.2:

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

`ComposeUIViewControllerDelegate` API 已棄用，改為支援父檢視控制器。
如果您在 Compose Multiplatform 1.8.2 中使用此棄用 API，您將會遇到一個棄用錯誤，指出
您應該透過父檢視控制器覆寫 `UIViewController` 類別方法。

有關子-父檢視控制器關係的更多資訊，請參閱 Apple 的開發者[文件](https://developer.apple.com/documentation/uikit/uiviewcontroller)。

### iOS 上移除了過時的 `platformLayers` 選項

`platformLayers`
實驗性選項[在 1.6.0 中被引入](whats-new-compose-160.md#separate-platform-views-for-popups-dialogs-and-dropdowns-ios-desktop)
以允許啟用替代分層模式，並在父容器邊界之外繪製彈出視窗和對話框。

此模式現在是 iOS 上的預設行為，並且啟用它的選項已移除為過時。

### 測試中的破壞性變更

#### 測試中協程延遲的新處理方式

以前，Compose Multiplatform 測試不會將帶有 `delay()` 呼叫的副作用視為閒置。
因此，以下測試（例如）將無限期掛起：

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

當協程在組合作用域中啟動後呼叫 `delay()` 函式時，`waitForIdle()`、`awaitIdle()`
和 `runOnIdle()` 函式現在將 Compose 視為閒置。
這項變更修復了上述掛起的測試，但會破壞依賴於 `waitForIdle()`、`awaitIdle()` 和 `runOnIdle()`
來執行帶有 `delay()` 的協程的測試。

為了在這些情況下產生相同的結果，請人為地推進時間：

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

已經使用 `mainClock.advanceTimeBy()` 呼叫來推進測試時鐘的測試可能會在重新組合、佈局、繪圖和效果方面表現不同。

#### `runOnIdle()` 的實作與 Android 對齊

為了使 Compose Multiplatform 中 `runOnIdle()` 測試函式的實作與 Android 行為保持一致，
我們引入了以下變更：

*   `runOnIdle()` 現在會在 UI 執行緒上執行其 `action`。
*   `runOnIdle()` 在執行 `action` 後不再呼叫 `waitForIdle()`。

如果您的測試依賴於 `runOnIdle()` action 後的額外 `waitForIdle()` 呼叫，
請在將測試更新至 Compose Multiplatform 1.8.2 時依需要將該呼叫新增至您的測試中。

#### 測試中時間的推進與渲染解耦

在 Compose Multiplatform 1.8.2 中，如果時間沒有推進到渲染下一幀的時間點（虛擬測試幀每 16 毫秒渲染一次），`mainClock.advanceTimeBy()` 函式將不再導致重新組合、佈局或繪圖。

這可能會破壞依賴於渲染由每次 `mainClock.advanceTimeBy()` 呼叫觸發的測試。
詳情請參閱 [PR 說明](https://github.com/JetBrains/compose-multiplatform-core/pull/1618)。

## Across platforms

### 可變字體

Compose Multiplatform 1.8.2 支援所有平台上的可變字體。
透過可變字體，您可以保留一個字體檔案，其中包含所有樣式偏好，例如粗細、
寬度、傾斜、斜體、自訂軸、帶有排版顏色的視覺粗細，
以及對特定文字大小的適應。

有關詳細資訊，
請參閱 [Jetpack Compose 文件](https://developer.android.com/develop/ui/compose/text/fonts#variable-fonts)。

### Skia 更新至 Milestone 132

Compose Multiplatform 透過 Skiko 使用的 Skia 版本已更新至 Milestone 132。

以前使用的 Skia 版本是 Milestone 126。您可以在[發行說明](https://skia.googlesource.com/skia/+/main/RELEASE_NOTES.md#milestone-132)中查看這些版本之間的變更。

### 新的 Clipboard 介面

Compose Multiplatform 已採用 Jetpack Compose 的新 `Clipboard` 介面。

先前使用的 `ClipboardManager` 介面已棄用，改為支援 `Clipboard`，因為該介面在網頁目標上無法存取，原因在於 [Web 上的 Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) 的非同步性質。新介面支援 `suspend` 函式，並與所有目標（包括 Web）相容。

通用程式碼的剪貼簿互動目前受到 API 設計的限制。
有關詳細資訊，請參閱 [CMP-7624](https://youtrack.jetbrains.com/issue/CMP-7624)。

### 行高對齊

先前僅由 Compose Multiplatform 在 Android 上支援的行高對齊通用 API，現在已在所有平台上支援。
使用 `LineHeightStyle.Alignment`，您可以配置文字行如何在行高提供的空間內對齊。
文字行可以對齊預留空間的底部、中心或頂部，
或根據其上升和下降值按比例調整。

<img src="compose-180-LineHeightStyle.png" alt="行高對齊" width="508"/>

請注意，在 Material3 中，行高對齊的預設值是 `Center`，
這意味著除非另有說明，中央對齊將應用於所有平台上的 Material3 組件中帶有 `lineHeight` 的文字。

## iOS

### 深層連結

透過搭配 [org.jetbrains.androidx.navigation.navigation-compose](compose-navigation-routing.md) %org.jetbrains.androidx.navigation% 使用 Compose Multiplatform 1.8.2，
您可以以通常的 Compose 方式在 iOS 上實作深層連結：將深層連結分配給目的地，並使用 `NavController` 導航到它們。

有關將深層連結引入通用程式碼的指南，請參閱[深層連結](compose-navigation-deep-links.md)。

### XCFrameworks 中的 Compose 資源

Compose Multiplatform 現在直接將資源嵌入到生成的 XCFrameworks 中。
您可以將帶有資源的 Compose 函式庫建置並用作標準 XCFrameworks。

此功能需要 Kotlin Gradle 外掛 2.2 或更高版本。

### 輔助功能支援改進

#### 對由右至左語言的支援

Compose Multiplatform 1.8.2 引入了對由右至左語言的輔助功能支援，
包括手勢的正確文字方向處理。

要了解有關 RTL 支援的更多資訊，請參閱[由右至左語言](compose-rtl.md)。

#### 可滾動列表的輔助功能

此版本提高了滾動邊界和元素位置計算的效能和準確性。
透過考慮安全區域（例如瀏海和螢幕邊緣），
我們確保了在間隙和邊緣附近滾動的精確輔助功能屬性。

我們還引入了對滾動狀態廣播的支援。
啟用 VoiceOver 後，在執行三指滾動手勢時，您將會聽到列表狀態更新。
廣播包括：

*   當在列表頂部時顯示「第一頁」。
*   向前滾動時顯示「下一頁」。
*   向後滾動時顯示「上一頁」。
*   到達末尾時顯示「最後一頁」。

這些廣播的本地化版本也已提供，允許 VoiceOver 以您所選語言讀取它們。

#### 容器視圖的輔助功能

從 Compose Multiplatform 1.8.2 開始，
您可以為容器定義遍歷語義屬性，
以確保在滾動和滑動複雜視圖時的正確閱讀順序。

除了為螢幕閱讀器正確排序元素之外，對遍歷屬性的支援還支援使用向上滑動或向下滑動的輔助功能手勢在不同的遍歷組之間導航。
要切換到容器的可存取導航模式，請在 VoiceOver 啟用時在螢幕上旋轉兩指。

在[輔助功能](compose-accessibility.md#traversal-order)部分了解更多關於遍歷語義屬性的資訊。

#### 可存取文字輸入

在 Compose Multiplatform 1.8.2 中，我們引入了對文字欄位輔助功能特性的支援。
當文字輸入欄位獲得焦點時，它現在會被標記為可編輯，
確保正確的輔助功能狀態表示。

您現在也可以在 UI 測試中使用可存取文字輸入。

#### 支援透過觸控板和鍵盤控制

Compose Multiplatform for iOS 現在支援兩種額外的輸入方法來控制您的裝置。您可以啟用 AssistiveTouch 來使用滑鼠或觸控板，或啟用完整鍵盤存取來使用鍵盤，而不是依賴觸控螢幕：

*   AssistiveTouch（**設定** | **輔助使用** | **觸控** | **AssistiveTouch**）允許您用連接的滑鼠或觸控板上的指標來控制您的 iPhone 或 iPad。您可以使用指標點擊螢幕上的圖示、瀏覽 AssistiveTouch 選單，或使用螢幕鍵盤打字。
*   完整鍵盤存取（**設定** | **輔助使用** | **鍵盤** | **完整鍵盤存取**）啟用使用連接鍵盤的裝置控制。您可以使用 **Tab** 等按鍵導航，並使用 **Space** 鍵啟用項目。

#### 按需載入輔助功能樹

您現在可以依賴 Compose Multiplatform 惰性處理此過程，而不是設定特定的同步模式來同步 Compose 語義樹與 iOS 輔助功能樹。
該樹在來自 iOS 輔助功能引擎的第一個請求後會完全載入，並在螢幕閱讀器停止與其互動時被釋放。

這完全支援 iOS 語音控制、VoiceOver 和其他依賴輔助功能樹的輔助功能工具。

用於[配置輔助功能樹同步](compose-ios-accessibility.md#choose-the-tree-synchronization-option)的 `AccessibilitySyncOptions` 類別已移除，因為不再需要。

#### 輔助功能屬性計算的準確性提高

我們已更新 Compose Multiplatform 組件的輔助功能屬性，以符合 UIKit 組件的預期行為。
UI 元素現在提供廣泛的輔助功能資料，
且任何透明度為 0 的組件不再提供輔助功能語義。

語義對齊也使我們能夠修復幾個與計算不正確相關的問題，
例如 DropDown 元素的命中框遺失、
可見文字與輔助功能標籤不匹配，以及不正確的單選按鈕狀態。

### iOS 日誌記錄的穩定 API

在 iOS 上啟用作業系統日誌記錄的 API 現在已穩定。`enableTraceOSLog()` 函式不再需要實驗性選擇加入，並且現在與 Android 風格的日誌記錄對齊。此日誌記錄提供追蹤資訊，可以使用 Xcode Instruments 進行除錯和效能分析。

### 拖放
<secondary-label ref="Experimental"/>

Compose Multiplatform for iOS 引入了對拖放功能的支援，
允許您將內容拖入或拖出 Compose 應用程式
（有關演示影片，請參閱 pull request [1690](https://github.com/JetBrains/compose-multiplatform-core/pull/1690)）。
要定義可拖動內容和拖放目標，請使用 `dragAndDropSource` 和 `dragAndDropTarget` 修飾符。

在 iOS 上，拖放會話資料由 [`UIDragItem`](https://developer.apple.com/documentation/uikit/uidragitem) 表示。
此物件包含有關跨行程資料傳輸的資訊以及用於應用程式內使用的可選本地物件。
例如，您可以使用 `DragAndDropTransferData(listOf(UIDragItem.fromString(text)))` 來拖動文字，
其中 `UIDragItem.fromString(text)` 將文字編碼為適合拖放操作的格式。
目前，僅支援 `String` 和 `NSObject` 型別。

有關常見用例，
請參閱 Jetpack Compose 文件中[專門文章](https://developer.android.com/develop/ui/compose/touch-input/user-interactions/drag-and-drop)。

### 改進滾動互操作視圖的觸控處理

在此版本中：

*   帶有不可滾動內容並以模態 `UIViewController` 呈現的 Compose 視圖可以透過向下滑動手勢關閉。
*   巢狀可滾動視圖在通用[互操作觸控框架](compose-ios-touch.md)內正常工作：
    當在可滾動的 Compose 視圖中滾動原生內容，或在可滾動的原生視圖中滾動 Compose 內容時，
    UI 會緊密遵循 iOS 邏輯來解決模糊的觸控序列。

### 選擇加入並發渲染
<secondary-label ref="Experimental"/>

Compose Multiplatform for iOS 現在支援將渲染任務卸載到專用的渲染執行緒。
並發渲染可以在沒有 UIKit 互操作的場景中提高效能。

透過啟用 `ComposeUIViewControllerConfiguration` 類別的 `useSeparateRenderThreadWhenPossible` 標誌，或直接在 `ComposeUIViewController` 配置區塊內啟用 `parallelRendering` 屬性，選擇加入以編碼渲染命令在單獨的渲染執行緒上：

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

### 導航函式庫支援瀏覽器控制

在透過 Compose Multiplatform 建置的 Kotlin/Wasm 和 Kotlin/JS 應用程式中，
導航現在可以正確地與基本瀏覽器控制協同工作。
要啟用此功能，請使用 `window.bindToNavigation()` 方法將瀏覽器視窗連結到主導航圖。
一旦完成，Web 應用程式將正確地對使用「返回」和「前進」按鈕在瀏覽器中瀏覽歷史記錄做出反應
（有關演示影片，請參閱 pull request [1621](https://github.com/JetBrains/compose-multiplatform-core/pull/1621)）。

Web 應用程式還會操作瀏覽器地址欄以反映當前的目的地路由，
並在使用者貼上一個編碼有正確路由的 URL 時直接導航到目的地
（有關演示影片，請參閱 pull request [1640](https://github.com/JetBrains/compose-multiplatform-core/pull/1640)）。
`window.bindToNavigation()` 方法具有可選的 `getBackStackEntryPath` 參數，
它允許您自訂路由字串到 URL 片段的轉換。

### 設定瀏覽器游標
<secondary-label ref="Experimental"/>

我們引入了一個實驗性 `PointerIcon.Companion.fromKeyword()` 函式，用於管理可用作瀏覽器頁面上滑鼠指標的圖示。透過傳遞一個關鍵字作為參數，您可以根據上下文指定要顯示的游標型別。例如，您可以分配不同的指標圖示來選擇文字、開啟上下文選單或指示載入過程。

查看可用[關鍵字](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)的完整列表。

### 資源預載入
<secondary-label ref="Experimental"/>

Compose Multiplatform 1.8.2 引入了一個新的實驗性 API，
用於網頁目標的字體和圖像預載入。
預載入有助於
防止視覺問題，例如未樣式文字閃爍 (FOUT) 或圖像和圖示的閃爍。

以下功能現在可用於載入和快取資源：

*   `preloadFont()`，用於預載入字體。
*   `preloadImageBitmap()`，用於預載入位圖圖像。
*   `preloadImageVector()`，用於預載入向量圖像。

詳情請參閱[文件](compose-multiplatform-resources-usage.md#preload-resources-using-the-compose-multiplatform-preload-api)。

## Desktop

### Windows 上的軟體渲染改進

切換到 Windows 上 Skia 推薦的 clang 編譯器加快了依賴 CPU 的渲染速度。
這主要影響純軟體渲染，因為渲染通常依賴 GPU，只有部分計算在 CPU 上完成。
因此，在某些虛擬機器和一些[不被 Skia 支援](https://github.com/JetBrains/skiko/blob/30df516c1a1a25237880f3e0fe83e44a13821292/skiko/src/jvmMain/kotlin/org/jetbrains/skiko/GraphicsApi.jvm.kt#L13)的舊顯示卡上，改進非常顯著：
Compose Multiplatform 產生的 Windows 應用程式在這些環境中比 Compose Multiplatform 1.7.3 快達 6 倍。

這項改進，除了對 Windows for ARM64 的支援之外，使 macOS 下虛擬 Windows 系統上的 Compose Multiplatform UI 顯著提高效能。

### 支援 Windows for ARM64

Compose Multiplatform 1.8.2 引入了對 JVM 上 Windows for ARM64 的支援，
改善在基於 ARM 的 Windows 裝置上建置和執行應用程式的整體體驗。

## Gradle plugin

### 更改生成的 Res 類別名稱的選項

您現在可以自訂生成的資源類別的名稱，該類別提供對應用程式中資源的存取。
自訂命名對於在多模組專案中區分資源特別有用，
並有助於保持與專案命名慣例的一致性。

要定義自訂名稱，請將以下行新增至 `build.gradle.kts` 檔案中的 `compose.resources` 區塊：

```kotlin
compose.resources {
    nameOfResClass = "MyRes"
}
```

有關詳細資訊，請參閱 [pull request](https://github.com/JetBrains/compose-multiplatform/pull/5296)。

### `androidLibrary` 目標中多平台資源的支援
<secondary-label ref="Experimental"/>

從 Android Gradle 外掛 8.8.0 版本開始，您可以在新的 `androidLibrary` 目標中使用生成的資產。
為了使 Compose Multiplatform 與這些變更保持一致，我們引入了對新目標配置的支援，以處理打包到 Android 資產中的多平台資源。

如果您正在使用 `androidLibrary` 目標，請在您的配置中啟用資源：

```
kotlin {
    androidLibrary {
        androidResources.enable = true
    }
}
```

否則，您將遇到以下例外狀況：`org.jetbrains.compose.resources.MissingResourceException: Missing resource with path: …`。