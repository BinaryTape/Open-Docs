[//]: # (title: Compose Multiplatform 1.6.0 新功能)

以下是 Compose Multiplatform 1.6.0 版本的主要亮點：

*   [破壞性變更](#breaking-changes)
*   [全新且改進的資源 API](#improved-resources-api-all-platforms)
*   [iOS 無障礙功能的基本支援](#accessibility-support)
*   [適用於所有平台的 UI 測試 API](#ui-testing-api-experimental-all-platforms)
*   [彈出式視窗、對話框和下拉選單的獨立平台視圖](#separate-platform-views-for-popups-dialogs-and-dropdowns-ios-desktop)。
*   [來自 Jetpack Compose 和 Material 3 的合併變更](#changes-from-jetpack-compose-and-material-3-all-platforms)
*   [穩定版框架中提供 Kotlin/Wasm artifacts](#kotlin-wasm-artifacts-available-in-stable-versions-of-the-framework)
*   [已知問題：缺少依賴項](#known-issues-missing-dependencies)

## 依賴項

此版本的 Compose Multiplatform 基於以下 Jetpack Compose 函式庫：

*   [Compiler 1.5.8](https://developer.android.com/jetpack/androidx/releases/compose-compiler#1.5.8)
*   [Runtime 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-runtime#1.6.1)
*   [UI 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-ui#1.6.1)
*   [Foundation 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-foundation#1.6.1)
*   [Material 1.6.1](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.1)
*   [Material3 1.2.0](https://developer.android.com/jetpack/androidx/releases/compose-material3#1.2.0)

## 破壞性變更

### 設定 lineHeight 的文字預設會裁剪內邊距

隨著對 [LineHeightStyle.Trim](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/style/LineHeightStyle.Trim) 的支援，
Compose Multiplatform 在文字內邊距裁剪方式上與 Android 保持一致。
詳情請參閱 [pull request](https://github.com/JetBrains/compose-multiplatform-core/pull/897)。

這與 `compose.material` 在 [1.6.0-alpha01 版本](https://developer.android.com/jetpack/androidx/releases/compose-material#1.6.0-alpha01) 中的變更保持一致：
*   在 Android 上，`includeFontPadding` 參數預設變為 `false`。
    要深入了解此變更，請參閱 [關於不在 Compose Multiplatform 中實作此旗標的討論](https://github.com/JetBrains/compose-multiplatform/issues/2477#issuecomment-1825716543)。
*   預設行高樣式已更改為 `Trim.None` 和 `Alignment.Center`。Compose Multiplatform 現在支援
    `LineHeightStyle.Trim` 並將 `Trim.None` 作為預設值實作。
*   已將明確的 `lineHeight` 新增到 `Typography` 的 `TextStyle` 中，這導致了 [下一個破壞性變更](#using-fontsize-in-materialtheme-requires-lineheight)。

### 在 MaterialTheme 中使用 fontSize 需要 lineHeight

> 這僅影響 `material` 元件。`material3` 已有此限制。
>
{style="note"}

如果您在 `MaterialTheme` 中為 `Text` 元件設定了 `fontSize` 屬性但未包含 `lineHeight`，則實際行高將不會修改以符合字體。現在，您每次設定相應的 `fontSize` 時，都必須明確指定 `lineHeight` 屬性。

Jetpack Compose 現在[建議](https://issuetracker.google.com/issues/321872412)不要直接設定字體大小：

> 為支援非標準文字大小，我們鼓勵使用者遵循 Material design 系統並使用不同的 [type scale](https://m2.material.io/design/typography/the-type-system.html#type-scale)
> 而不是直接更改字體大小。或者，使用者可以像這樣覆寫行高：
> `style = LocalTextStyle.current.copy(lineHeight = TextUnit.Unspecified)`，或者完全建立一個自訂的 `Typography`。
>
{style="tip"}

### 資源組織的新方法

如果您在 Compose Multiplatform 1.6.0 的預覽版本中使用了資源 API，請熟悉[當前版本的說明文件](compose-multiplatform-resources.md)：1.6.0-beta01 更改了資源檔案在專案資料夾中的儲存方式，以便專案程式碼可以存取它們。

## 跨平台

### 改進的資源 API (所有平台)

新的實驗性 API 新增了對字串和字型的支援，並允許您更舒適地在 common Kotlin 中共享和存取資源：

*   資源可以根據其設計的特定設定或限制進行組織，支援：
    *   區域設定 (Locales)
    *   影像解析度
    *   深色和淺色主題
*   Compose Multiplatform 現在為每個專案產生一個 `Res` 物件，以提供直接的資源存取。

要更仔細地了解資源限定詞，以及新資源 API 的更深入概述，
請參閱 [影像和資源](compose-multiplatform-resources.md)。

### UI 測試 API (實驗性，所有平台)

適用於 Compose Multiplatform 的 UI 測試實驗性 API，先前已適用於桌面和 Android，
現在支援所有平台。您可以編寫並執行通用測試，以驗證應用程式 UI 在框架支援的平台上的行為。此 API 使用與 Jetpack Compose 相同的尋找器、斷言、動作和匹配器。

> 基於 JUnit 的測試僅在桌面專案中支援。
>
{style="note"}

有關設定說明和測試範例，請參閱 [測試 Compose Multiplatform UI](compose-test.md)。

### 來自 Jetpack Compose 和 Material 3 的變更 (所有平台)

#### Jetpack Compose 1.6.1

合併最新版本的 Jetpack Compose 對所有平台上的效能產生了正面影響。詳情請參閱
[Android Developers Blog 上的公告](https://android-developers.googleblog.com/2024/01/whats-new-in-jetpack-compose-january-24-release.html)。

此版本的其他值得注意的功能：
*   預設字體內邊距的變更僅對 Android 目標生效。但是，請務必考慮此變更的[副作用](#using-fontsize-in-materialtheme-requires-lineheight)。
*   滑鼠選取已在 Compose Multiplatform 中為其他目標支援。透過 1.6.0，這也包括 Android。

尚未移植到 Compose Multiplatform 的 Jetpack Compose 功能：
*   [BasicTextField2](https://github.com/JetBrains/compose-multiplatform/issues/4218)
*   [支援非線性字體縮放](https://github.com/JetBrains/compose-multiplatform/issues/4305)
*   [MultiParagraph.fillBoundingBoxes](https://github.com/JetBrains/compose-multiplatform/issues/4236)
*   [跨平台拖放](https://github.com/JetBrains/compose-multiplatform/issues/4235)。目前僅在 Android 上有效。
    在桌面上，您可以使用現有的 API `Modifier.onExternalDrag`。

JetBrains 團隊正在努力在未來的 Compose Multiplatform 版本中採用這些功能。

#### Compose Material 3 1.2.0

版本亮點：
*   一個新的實驗性元件 `Segmented Button`，具有單選和多選功能。
*   擴展的顏色集，具有更多表面選項，使您更容易在 UI 中強調資訊。
    *   實作說明：`ColorScheme` 物件現在是不可變的。如果您目前的程式碼直接修改 `ColorScheme` 中的顏色，
        您現在需要使用 [copy](https://developer.android.com/reference/kotlin/androidx/compose/material3/ColorScheme#copy(androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color)) 方法來更改顏色。
    *   現在不是單一的表面值，而是有幾個表面顏色和表面容器選項，用於更
        靈活的顏色管理。

有關 Material 3 中變更的更多詳細資訊，請參閱 [Material Design Blog 上的版本發布文章](https://material.io/blog/material-3-compose-1-2)。

### 彈出式視窗、對話框和下拉選單的獨立平台視圖 (iOS, 桌面)

有時，彈出式元素（例如，工具提示和下拉選單）不受初始可組合畫布或應用程式視窗限制是很重要的。如果可組合視圖未佔據整個螢幕但需要產生警示對話框，這就變得尤為重要。在 1.6.0 中，有一種可靠的方法可以實現這一點。

請注意，彈出式視窗和對話框仍然無法在其自身邊界之外繪製任何內容（例如，最頂層容器的陰影）。

#### iOS (穩定版)

在 iOS 上，此功能預設為啟用。
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
*   `WINDOW`，用於將 `Popup` 和 `Dialog` 元件建立為獨立的無裝飾視窗。
*   `COMPONENT`，用於將 `Popup` 或 `Dialog` 建立為同一視窗中的獨立 Swing 元件。它僅在離屏
    渲染下工作，並將 `compose.swing.render.on.graphics` 設定為 `true`（請參閱 1.5.0 Compose Multiplatform 版本說明中的[增強 Swing 互通性](https://blog.jetbrains.com/kotlin/2023/08/compose-multiplatform-1-5-0-release/#enhanced-swing-interop)部分）。請注意，離屏渲染僅適用於 `ComposePanel`
    元件，不適用於全視窗應用程式。

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

`Dialog` (黃色) 會完整繪製，無論父 `ComposePanel` (綠色) 的邊界如何：

![Dialog outside the bounds of the parent panel](compose-desktop-separate-dialog.png){width=700}

### 支援文字裝飾線條樣式 (iOS, 桌面, 網頁)

Compose Multiplatform 現在允許使用 `PlatformTextStyle` 類別設定文字的底線樣式。

> 此類別在通用原始碼集中不可用，需要在特定平台的程式碼中使用。
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

您可以使用實線、雙寬實線、點狀、虛線和波浪線條樣式。請參閱 [source code](https://github.com/JetBrains/compose-multiplatform-core/blob/jb-main/compose/ui/ui-text/src/skikoMain/kotlin/androidx/compose/ui/text/TextDecorationLineStyle.kt#L21) 中所有可用的選項。

### 存取系統上安裝的字型 (iOS, 桌面, 網頁)

您現在可以從 Compose Multiplatform 應用程式存取系統上安裝的字型：使用 `SystemFont` 類別載入具有適當字體樣式和字體粗細的字型：

```kotlin
import androidx.compose.ui.text.platform.SystemFont

FontFamily(SystemFont("Menlo", weight = 700))
FontFamily(SystemFont("Times New Roman", FontWeight.Bold))
FontFamily(SystemFont("Webdings"))
```

在桌面上，您可以使用 `FontFamily` 函式透過僅指定字體系列名稱來載入所有可能的字體樣式
（有關詳細範例，請參閱[程式碼範例](https://github.com/JetBrains/compose-multiplatform-core/blob/release/1.6.0/compose/desktop/desktop/samples/src/jvmMain/kotlin/androidx/compose/desktop/examples/fonts/Fonts.jvm.kt)）：

```kotlin
FontFamily("Menlo")
```

## iOS

### 無障礙支援

Compose Multiplatform for iOS 現在允許身心障礙人士以與原生 iOS UI 相同的舒適度與 Compose UI 互動：

*   螢幕閱讀器和 VoiceOver 可以存取 Compose UI 的內容。
*   Compose UI 支援與原生 UI 相同的導航和互動手勢。

這也意味著您可以將 Compose Multiplatform 語義資料提供給 Accessibility Services 和 XCTest 框架。

有關實作和自訂 API 的詳細資訊，請參閱 [iOS 無障礙功能的支援](compose-ios-accessibility.md)。

### 變更可組合視圖的不透明度

`ComposeUIViewController` 類別現在有一個額外的設定選項，可將視圖背景的不透明度更改為透明。

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

先前，Compose Multiplatform for iOS 僅允許使用者在文字輸入欄位中透過多次點擊選取文字。
現在，雙擊和三擊手勢也適用於在 `SelectionContainer` 內的 `Text` 元件中顯示的文字。

### 與 UIViewController 的互通性

一些未實作為 `UIView` 的原生 API，例如 `UITabBarController` 或 `UINavigationController`，無法使用[現有的互通機制](compose-uikit-integration.md)嵌入到 Compose Multiplatform UI 中。

現在，Compose Multiplatform 實作了 `UIKitViewController` 函式，允許您將原生 iOS 視圖控制器嵌入到您的 Compose UI 中。

### 文字欄位中長按/單擊的類似原生插入點行為

Compose Multiplatform 現在更接近原生 iOS 在文字欄位中插入點的行為：
*   單擊文字欄位後，插入點的位置判斷更精確。
*   長按並拖動文字欄位會導致移動游標，而不是像 Android 上那樣進入選取模式。

## 桌面

### 改進互通性混合的實驗性支援

過去，使用 `SwingPanel` 封裝器實作的互通視圖總是矩形的，並且總是
在前景，位於任何 Compose Multiplatform 元件之上。這使得任何彈出式元素
（下拉選單、Toast 通知）難以使用。透過新的實作，此問題已解決，
您現在可以依賴 Swing 處理以下使用案例：

*   裁剪。您不受矩形形狀的限制：`clip` 和 `shadow` 修飾符現在可以正確地與 SwingPanel 一起使用。

    ```kotlin
    // Flag necessary to enable the experimental blending 
    System.setProperty("compose.interop.blending", "true")
  
    SwingPanel(
        modifier = Modifier.clip(RoundedCornerShape(6.dp))
        //...
    )
    ```
  
    您可以看到 `JButton` 在沒有此功能時的裁剪方式（左側），以及實驗性混合效果（右側）：

    ![Correct clipping with SwingPanel](compose-swingpanel-clipping.png)
*   重疊。可以在 `SwingPanel` 上方繪製任何 Compose Multiplatform 內容，並像往常一樣與之互動。
    這裡，「Snackbar」位於 Swing 面板上方，帶有一個可點擊的 **OK** 按鈕：

    ![Correct overlapping with SwingPanel](compose-swingpanel-overlapping.png)

有關已知限制和更多詳細資訊，請參閱 [pull request 的描述](https://github.com/JetBrains/compose-multiplatform-core/pull/915)。

## 網頁

### 穩定版框架中提供 Kotlin/Wasm artifacts

Compose Multiplatform 的穩定版本現在支援 Kotlin/Wasm 目標。切換到 1.6.0 後，您無需在依賴項列表中指定特定 `dev-wasm` 版本的 `compose-ui` 函式庫。

> 要建置具有 Wasm 目標的 Compose Multiplatform 專案，您需要 Kotlin 1.9.22 或更高版本。
>
{style="warning"}

## 已知問題：缺少依賴項

在預設專案設定下，可能會缺少一些函式庫：

*   `org.jetbrains.compose.annotation-internal:annotation` 或 `org.jetbrains.compose.collection-internal:collection`

    如果某個函式庫依賴於 Compose Multiplatform 1.6.0-beta02，而該版本與 1.6.0 不相容，則可能會缺少它們。
    要找出是哪個函式庫，請執行此命令（將 `shared` 替換為您的主模組名稱）：

    ```shell
    ./gradlew shared:dependencies
    ```

    將該函式庫降級到依賴於 Compose Multiplatform 1.5.12 的版本，或者要求函式庫作者將其升級到 Compose Multiplatform 1.6.0。

*   `androidx.annotation:annotation:...` 或 `androidx.collection:collection:...`

    Compose Multiplatform 1.6.0 依賴於 [collection](https://developer.android.com/jetpack/androidx/releases/collection)
    和 [annotation](https://developer.android.com/jetpack/androidx/releases/annotation) 函式庫，這些函式庫僅在 Google Maven 儲存庫中可用。

    要使此儲存庫可用於您的專案，請將以下行新增到模組的 `build.gradle.kts` 檔案中：

    ```kotlin
    repositories {
        //...
        google()
    }