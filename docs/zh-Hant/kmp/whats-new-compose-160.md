[//]: # (title: Compose Multiplatform 1.6.0 有什麼新功能)

以下是 Compose Multiplatform 1.6.0 版本的重點：

* [破壞性變更](#breaking-changes)
* [新增與改進的 Resources API](#improved-resources-api-all-platforms)
* [iOS 輔助功能的基本支援](#accessibility-support)
* [所有平台適用的 UI 測試 API](#ui-testing-api-experimental-all-platforms)
* [彈出視窗、對話框和下拉選單的分離平台視圖](#separate-platform-views-for-popups-dialogs-and-dropdowns-ios-desktop)。
* [來自 Jetpack Compose 和 Material 3 的合併變更](#changes-from-jetpack-compose-and-material-3-all-platforms)
* [穩定版本中可用的 Kotlin/Wasm 元件](#kotlin-wasm-artifacts-available-in-stable-versions-of-the-framework)
* [已知問題：遺失的依賴項](#known-issues-missing-dependencies)

## 依賴項

此版本的 Compose Multiplatform 基於以下 Jetpack Compose 函式庫：

* [Compiler 1.5.8](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.8)
* [Runtime 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.6.1)
* [UI 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.6.1)
* [Foundation 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.6.1)
* [Material 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.1)
* [Material3 1.2.0](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.2.0)

## 破壞性變更

### 預設情況下，設定 `lineHeight` 的文字會裁切填補

隨著對 [LineHeightStyle.Trim](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/style/LineHeightStyle.Trim) 的支援，
Compose Multiplatform 在文字填補裁切方式上與 Android 保持一致。
詳情請參閱 [拉取請求](https://github.com/JetBrains/compose-multiplatform-core/pull/897)。

這與 `compose.material` 來自 [1.6.0-alpha01 版本](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.0-alpha01) 的變更一致：
* `includeFontPadding` 參數在 Android 上預設為 `false`。
  有關此變更的更深入理解，請參閱 [關於在 Compose Multiplatform 中不實作此標誌的討論](https://github.com/JetBrains/compose-multiplatform/issues/2477#issuecomment-1825716543)。
* 預設的行高樣式已變更為 `Trim.None` 和 `Alignment.Center`。Compose Multiplatform 現在支援
  `LineHeightStyle.Trim` 並將 `Trim.None` 作為預設值實作。
* 已將明確的 `lineHeight` 添加到 `Typography` 的 `TextStyle` 中，這導致了 [下一個破壞性變更](#using-fontsize-in-materialtheme-requires-lineheight)。

### 在 MaterialTheme 中使用 `fontSize` 需要 `lineHeight`

> 這僅影響 `material` 元件。`material3` 已有此限制。
>
{style="note"}

如果您在 `MaterialTheme` 中為 `Text` 元件設定 `fontSize` 屬性但未包含 `lineHeight`，則實際行高將不會修改以符合字體。現在，您必須在每次設定相應 `fontSize` 時明確指定 `lineHeight` 屬性。

Jetpack Compose 現在[建議](https://issuetracker.google.com/issues/321872412)不要直接設定字體大小：

> 為了支援非標準文字大小，我們鼓勵用戶遵循 Material 設計系統並使用不同的 [排版比例](https://m2.material.io/design/typography/the-type-system.html#type-scale)，
> 而不是直接更改字體大小。或者，用戶可以像這樣覆蓋行高：
> `style = LocalTextStyle.current.copy(lineHeight = TextUnit.Unspecified)`，或者完全建立自訂的 `Typography`。
>
{style="tip"}

### 資源組織的新方法

如果您在 Compose Multiplatform 1.6.0 的預覽版本中使用了資源 API，請熟悉 [目前版本的說明文件](compose-multiplatform-resources.md)：1.6.0-beta01 更改了資源檔案在專案資料夾中的儲存方式，以便專案程式碼可以存取它們。

## 跨平台

### 改進的資源 API (所有平台)

新的實驗性 API 新增了對字串和字體的支援，並允許您更方便地在通用 Kotlin 中共用和存取資源：

* 資源可以根據它們設計的特定設定或約束進行組織，支援：
  * 語系
  * 圖像解析度
  * 深色和淺色主題
* Compose Multiplatform 現在為每個專案生成一個 `Res` 物件，以提供直接的資源存取。

如需更深入地了解資源限定符，以及對新資源 API 的更深入概述，
請參閱 [圖像和資源](compose-multiplatform-resources.md)。

### UI 測試 API (實驗性，所有平台)

Compose Multiplatform 的 UI 測試實驗性 API，先前已適用於桌面和 Android，
現在支援所有平台。您可以編寫和執行通用測試，以驗證應用程式 UI 在框架支援的平台上的行為。此 API 使用與 Jetpack Compose 相同的查找器、斷言、動作和匹配器。

> 僅桌面專案支援基於 JUnit 的測試。
>
{style="note"}

有關設定說明和測試範例，請參閱 [測試 Compose Multiplatform UI](compose-test.md)。

### 來自 Jetpack Compose 和 Material 3 的變更 (所有平台)

#### Jetpack Compose 1.6.1

合併最新版本的 Jetpack Compose 對所有平台的效能產生正面影響。有關詳細資訊，
請參閱 [Android 開發者部落格上的公告](https://android-developers.googleblog.com/2024/01/whats-new-in-jetpack-compose-january-24-release.html)。

此版本的其他值得注意的功能：
* 預設字體填補的變更僅對 Android 目標生效。但是，請務必考慮到此變更的[副作用](#using-fontsize-in-materialtheme-requires-lineheight)。
* 鼠標選擇已在 Compose Multiplatform 中支援其他目標。在 1.6.0 中，這也包括 Android。

Jetpack Compose 功能尚未移植到 Compose Multiplatform：
* [BasicTextField2](https://github.com/JetBrains/compose-multiplatform/issues/4218)
* [支援非線性字體縮放](https://github.com/JetBrains/compose-multiplatform/issues/4305)
* [MultiParagraph.fillBoundingBoxes](https://github.com/JetBrains/compose-multiplatform/issues/4236)
* [多平台拖放](https://github.com/JetBrains/compose-multiplatform/issues/4235)。目前僅在 Android 上有效。
  在桌面上，您可以使用現有的 API：`Modifier.onExternalDrag`。

JetBrains 團隊正在努力在即將推出的 Compose Multiplatform 版本中採用這些功能。

#### Compose Material 3 1.2.0

發行亮點：
* 一個新的實驗性元件 `Segmented Button`，具有單選和多選功能。
* 擴展的顏色集，提供更多表面選項，以便更輕鬆地強調 UI 中的資訊。
  * 實作說明：`ColorScheme` 物件現在是不可變的。如果您目前的程式碼直接修改 `ColorScheme` 中的顏色，
    您現在需要使用 [copy](https://developer.android.com/reference/kotlin/androidx/compose/material3/ColorScheme#copy(androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color)) 方法來更改顏色。
  * 現在有多個表面顏色和表面容器選項，而不是單一的表面值，以實現更靈活的色彩管理。

有關 Material 3 變更的更多詳細資訊，請參閱 [Material Design 部落格上的發行文章](https://material.io/blog/material-3-compose-1-2)。

### 彈出視窗、對話框和下拉選單的分離平台視圖 (iOS、桌面)

有時，彈出元素（例如，工具提示和下拉選單）不應受初始可組合畫布或應用程式視窗的限制，這很重要。如果可組合視圖未佔據整個螢幕但需要產生警示對話框，這就變得特別相關。在 1.6.0 中，有一種可靠的方法可以實現這一點。

請注意，彈出視窗和對話框仍無法在其自身邊界之外繪製任何東西（例如，最頂層容器的陰影）。

#### iOS (穩定版)

在 iOS 上，此功能預設啟用。
要切換回舊行為，請將 `platformLayers` 參數設定為 `false`：

```kotlin
ComposeUIViewController(
    configure = {
        platformLayers = false
    }
) {
    // your Compose code
}
```

#### 桌面 (實驗性)

要在桌面上使用此功能，請設定 `compose.layers.type`
系統屬性。支援的值：
* `WINDOW`，用於將 `Popup` 和 `Dialog` 元件建立為單獨的無裝飾視窗。
* `COMPONENT`，用於將 `Popup` 或 `Dialog` 建立為同一視窗中的獨立 Swing 元件。它僅適用於離屏渲染，
  且 `compose.swing.render.on.graphics` 設定為 `true`（請參閱 1.5.0 Compose Multiplatform 發行說明中的[增強型 Swing 互操作性](https://blog.jetbrains.com/kotlin/2023/08/compose-multiplatform-1-5-0-release/#enhanced-swing-interop)部分）。請注意，離屏渲染僅適用於 `ComposePanel` 元件，不適用於全視窗應用程式。

使用 `COMPONENT` 屬性的程式碼範例：

```kotlin
@OptIn(ExperimentalComposeUiApi::class)
fun main() = SwingUtilities.invokeLater {
    System.setProperty("compose.swing.render.on.graphics", "true")
    System.setProperty("compose.layers.type", "COMPONENT")

    val window = JFrame()
    window.defaultCloseOperation = WindowConstants.EXIT_ON_CLOSE

    val contentPane = JLayeredPane()
    contentPane.layout = null

    val composePanel = ComposePanel()
    composePanel.setBounds(200, 200, 200, 200)
    composePanel.setContent {
      ComposeContent()
    }
    composePanel.windowContainer = contentPane  // Use the full window for dialogs
    contentPane.add(composePanel)

    window.contentPane.add(contentPane)
    window.setSize(800, 600)
    window.isVisible = true
  }

@Composable
fun ComposeContent() {
    Box(Modifier.fillMaxSize().background(Color.Green)) {
        Dialog(onDismissRequest = {}) {
            Box(Modifier.size(100.dp).background(Color.Yellow))
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true"  collapsed-title="val window = JFrame()"}

`Dialog`（黃色）被完整繪製，無論父 `ComposePanel`（綠色）的邊界如何：

![Dialog outside the bounds of the parent panel](compose-desktop-separate-dialog.png){width=700}

### 支援文字裝飾線條樣式 (iOS、桌面、網頁)

Compose Multiplatform 現在允許使用 `PlatformTextStyle` 類別設定文字的底線樣式。

> 此類別在通用原始碼集中不可用，需要在平台特定程式碼中使用。
>
{style="warning"}

設定點狀底線樣式的範例：

```kotlin
Text(
  "Hello, Compose",
  style = TextStyle(
    textDecoration = TextDecoration.Underline,
    platformStyle = PlatformTextStyle (
      textDecorationLineStyle = TextDecorationLineStyle.Dotted
    )
  )
)
```

您可以使用實線、雙寬實線、點狀、虛線和波浪線樣式。請參閱 [原始碼](https://github.com/JetBrains/compose-multiplatform-core/blob/jb-main/compose/ui/ui-text/src/skikoMain/kotlin/androidx/compose/ui/text/TextDecorationLineStyle.kt#L21) 中所有可用的選項。

### 存取系統上安裝的字體 (iOS、桌面、網頁)

您現在可以從您的 Compose Multiplatform 應用程式存取系統上安裝的字體：使用 `SystemFont` 類別載入具有適當字體樣式和字體粗細的字體：

```kotlin
import androidx.compose.ui.text.platform.SystemFont

FontFamily(SystemFont("Menlo", weight = 700))
FontFamily(SystemFont("Times New Roman", FontWeight.Bold))
FontFamily(SystemFont("Webdings"))
```

在桌面上，您可以僅透過指定字體系列名稱來使用 `FontFamily` 函數載入所有可能的字體樣式（請參閱 [程式碼範例](https://github.com/JetBrains/compose-multiplatform-core/blob/release/1.6.0/compose/desktop/desktop/samples/src/jvmMain/kotlin/androidx/compose/desktop/examples/fonts/Fonts.jvm.kt) 以獲取詳盡的範例）：

```kotlin
FontFamily("Menlo")
```

## iOS

### 輔助功能支援

適用於 iOS 的 Compose Multiplatform 現在允許身心障礙人士以與原生 iOS UI 相同程度的便利性與 Compose UI 互動：

* 螢幕閱讀器和 VoiceOver 可以存取 Compose UI 的內容。
* Compose UI 支援與原生 UI 相同的導航和互動手勢。

這也意味著您可以將 Compose Multiplatform 語義資料提供給輔助功能服務和 XCTest 框架。

有關實作和自訂 API 的詳細資訊，請參閱 [iOS 輔助功能支援](compose-ios-accessibility.md)。

### 變更可組合視圖的不透明度

`ComposeUIViewController` 類別現在多了一個設定選項，可以將視圖背景的不透明度變更為透明。

> 透明背景會對效能產生負面影響，因為它會導致額外的混合步驟。
>
{style="note"}

```kotlin
val appController = ComposeUIViewController(configure = {
      this.opaque = false
}) {
    App()
}
```

透明背景可以幫助您實現的範例：

![Compose opaque = false demo](compose-opaque-property.png){width=700}

### 透過雙擊和三擊在 SelectionContainer 中選取文字

先前，適用於 iOS 的 Compose Multiplatform 僅允許使用者在文字輸入欄位中透過多點觸控來選取文字。
現在，雙擊和三擊手勢也適用於選取 `SelectionContainer` 中 `Text` 元件顯示的文字。

### 與 UIViewController 的互操作

一些未實作為 `UIView` 的原生 API，例如 `UITabBarController` 或 `UINavigationController`，
無法使用[現有的互操作機制](compose-uikit-integration.md)嵌入到 Compose Multiplatform UI 中。

現在，Compose Multiplatform 實作了 `UIKitViewController` 函數，允許您將原生 iOS 視圖控制器嵌入到您的 Compose UI 中。

### 文字欄位中透過長按/單擊實現原生游標行為

Compose Multiplatform 現在更接近原生 iOS 中文字欄位游標的行為：
* 單擊文字欄位後游標的位置將更精確地確定。
* 在文字欄位中長按並拖曳會移動游標，而不是像 Android 上那樣進入選取模式。

## 桌面

### 實驗性支援改進的互操作混合

過去，使用 `SwingPanel` 包裝器實作的互操作視圖始終是矩形的，並且始終
位於前景，在任何 Compose Multiplatform 元件之上。這使得任何彈出元素
（下拉選單、浮動通知）的使用都充滿挑戰。透過新的實作，此問題已解決，
您現在可以依賴 Swing 處理以下使用情境：

* 裁剪。您不再受矩形形狀的限制：裁剪和陰影修飾符現在可以正確地與 SwingPanel 一起使用。

    ```kotlin
    // Flag necessary to enable the experimental blending 
    System.setProperty("compose.interop.blending", "true")
  
    SwingPanel(
        modifier = Modifier.clip(RoundedCornerShape(6.dp))
        //...
    )
    ```
  
  您可以在左側看到在沒有此功能的情況下 `JButton` 被裁剪的方式，以及在右側看到實驗性混合：

  ![Correct clipping with SwingPanel](compose-swingpanel-clipping.png)
* 重疊。可以在 `SwingPanel` 之上繪製任何 Compose Multiplatform 內容並像往常一樣與其互動。
  在這裡，「Snackbar」位於帶有可點擊「**OK**」按鈕的 Swing 面板之上：

  ![Correct overlapping with SwingPanel](compose-swingpanel-overlapping.png)

請參閱 [拉取請求的說明](https://github.com/JetBrains/compose-multiplatform-core/pull/915) 中已知限制和更多詳細資訊。

## 網頁

### Kotlin/Wasm 元件在框架穩定版本中可用

Compose Multiplatform 的穩定版本現在支援 Kotlin/Wasm 目標。在您切換到 1.6.0 後，您不需要
在您的依賴項列表中指定特定的 `dev-wasm` 版本的 `compose-ui` 函式庫。

> 要建構一個帶有 Wasm 目標的 Compose Multiplatform 專案，您需要安裝 Kotlin 1.9.22 及更高版本。
>
{style="warning"}

## 已知問題：遺失的依賴項

在預設專案設定下可能會遺失幾個函式庫：

* `org.jetbrains.compose.annotation-internal:annotation` 或 `org.jetbrains.compose.collection-internal:collection`

  如果某個函式庫依賴於與 1.6.0 不二進位兼容的 Compose Multiplatform 1.6.0-beta02，則它們可能遺失。
  要找出是哪個函式庫，請執行以下命令（將 `shared` 替換為您的主模組名稱）：

  ```shell
  ./gradlew shared:dependencies
  ```

  將該函式庫降級到依賴 Compose Multiplatform 1.5.12 的版本，或者要求函式庫作者將其升級到 Compose Multiplatform 1.6.0。

* `androidx.annotation:annotation:...` 或 `androidx.collection:collection:...`

  Compose Multiplatform 1.6.0 依賴於僅在 Google Maven 儲存庫中可用的
  [collection](https://developer.android.com/jetpack/androidx/releases/collection) 和 [annotation](https://developer.android.com/jetpack/androidx/releases/annotation) 函式庫。

  要使此儲存庫可用於您的專案，請將以下行添加到模組的 `build.gradle.kts` 檔案中：

  ```kotlin
  repositories {
      //...
      google()
  }
  ```