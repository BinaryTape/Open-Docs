[//]: # (title: Swing 互通性)

在這裡，您將學習如何在 Compose Multiplatform 應用程式中使用 Swing 元件，反之亦然，並了解這種互通性的限制與優勢，以及何時應該或不應該採用此方法。

Compose Multiplatform 和 Swing 之間的互通性旨在幫助您：
*   簡化並順暢地將 Swing 應用程式遷移至 Compose Multiplatform 的過程。
*   在沒有 Compose 對應物時，使用 Swing 元件來增強 Compose Multiplatform 應用程式。

在許多情況下，直接在 Compose Multiplatform 中實作一個缺失的元件（並貢獻給社群）會比在 Compose Multiplatform 應用程式中使用 Swing 元件更有效。

## Swing 互通性的使用案例與限制

### Swing 應用程式中的 Compose Multiplatform 元件

第一個使用案例是將 Compose Multiplatform 元件加入到 Swing 應用程式中。您可以透過使用 `ComposePanel` Swing 元件來實現，以渲染應用程式的 Compose Multiplatform 部分。從 Swing 的角度來看，`ComposePanel` 是另一個 Swing 元件，並會據此進行處理。

請注意，所有 Compose Multiplatform 元件，包括彈出視窗 (popups)、工具提示 (tooltips) 和上下文選單 (context menus)，都將在 Swing 的 `ComposePanel` 內部進行渲染，並在其中定位與調整大小。因此，請考慮將這些元件替換為基於 Swing 的實作，或嘗試兩項新的實驗性功能：

[離屏渲染](#experimental-off-screen-rendering)
: 允許直接在 Swing 元件上渲染 Compose 面板。

[用於彈出視窗、對話框和下拉式選單的獨立平台視圖](#experimental-separate-views-for-popups)
: 彈出視窗不再受限於初始可組合畫布或應用程式視窗。

以下是使用 `ComposePanel` 的幾種情境：
*   在您的應用程式中嵌入動畫物件或整個動畫物件面板（例如，表情符號的選擇或帶有事件動畫反應的工具列）。
*   在您的應用程式中實作互動式渲染區域，例如圖形或資訊圖表，這使用 Compose Multiplatform 更容易、更方便實現。
*   將複雜的渲染區域（可能甚至包含動畫）整合到您的應用程式中，這使用 Compose Multiplatform 更簡單。
*   替換 Swing 應用程式中複雜的使用者介面部分，因為 Compose Multiplatform 提供便捷的元件佈局系統，以及廣泛的內建元件和用於快速建立自定義元件的選項。

### Compose Multiplatform 應用程式中的 Swing 元件

另一個使用案例是當您需要使用一個存在於 Swing 中但在 Compose Multiplatform 中沒有對應物的元件時。如果從頭開始建立新的實作過於耗時，請嘗試使用 `SwingPanel`。`SwingPanel` 函數充當一個包裝器，用於管理放置在 Compose Multiplatform 元件頂部的 Swing 元件的大小、位置和渲染。

請注意，`SwingPanel` 中的 Swing 元件將始終堆疊在 Compose Multiplatform 元件之上，因此任何放置在 `SwingPanel` 下方的內容都將被 Swing 元件裁剪。為避免裁剪和重疊問題，請嘗試[實驗性互通混和](#experimental-interop-blending)。如果仍然存在不正確渲染的風險，您可以相應地重新設計 UI，或者避免使用 `SwingPanel` 並嘗試實作缺失的元件，為技術發展做出貢獻。

以下是使用 `SwingPanel` 的情境：
*   您的應用程式不需要彈出視窗、工具提示或上下文選單，或者至少它們不在您的 `SwingPanel` 內部。
*   `SwingPanel` 保持固定位置。在這種情況下，當 Swing 元件的位置發生變化時，您可以減少出現顯示異常和偽影的風險。然而，這個條件並非強制性，應針對每個特定案例進行測試。

Compose Multiplatform 和 Swing 可以雙向結合，實現靈活的 UI 設計。您可以將 `SwingPanel` 放置在 `ComposePanel` 內部，而 `ComposePanel` 也可以放置在另一個 `SwingPanel` 內部。然而，在使用此類巢狀組合之前，請考慮潛在的渲染顯示異常。請參閱[帶有巢狀 `SwingPanel` 和 `ComposePanel` 的佈局](#layout-with-nested-swing-and-compose-multiplatform-components)以獲取代碼範例。

## 在 Swing 應用程式中使用 Compose Multiplatform

`ComposePanel` 允許您在基於 Swing 的應用程式中建立帶有 Compose Multiplatform 的 UI。將 `ComposePanel` 的實例添加到您的 Swing 佈局中，並在 `setContent` 內部定義組合：

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.Button
import androidx.compose.material.Surface
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.awt.ComposePanel
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import java.awt.BorderLayout
import java.awt.Dimension
import javax.swing.JButton
import javax.swing.JFrame
import javax.swing.SwingUtilities
import javax.swing.WindowConstants

val northClicks = mutableStateOf(0)
val westClicks = mutableStateOf(0)
val eastClicks = mutableStateOf(0)

fun main() = SwingUtilities.invokeLater {
    val window = JFrame()

    // 建立 ComposePanel
    val composePanel = ComposePanel()
    window.defaultCloseOperation = WindowConstants.EXIT_ON_CLOSE
    window.title = "SwingComposeWindow"

    window.contentPane.add(actionButton("NORTH", action = { northClicks.value++ }), BorderLayout.NORTH)
    window.contentPane.add(actionButton("WEST", action = { westClicks.value++ }), BorderLayout.WEST)
    window.contentPane.add(actionButton("EAST", action = { eastClicks.value++ }), BorderLayout.EAST)
    window.contentPane.add(
        actionButton(
            text = "SOUTH/REMOVE COMPOSE",
            action = {
                window.contentPane.remove(composePanel)
            }
        ),
        BorderLayout.SOUTH
    )

    // 將 ComposePanel 加入 JFrame
    window.contentPane.add(composePanel, BorderLayout.CENTER)

    // 設定內容
    composePanel.setContent {
        ComposeContent()
    }

    window.setSize(800, 600)
    window.isVisible = true
}

fun actionButton(text: String, action: () -> Unit): JButton {
    val button = JButton(text)
    button.toolTipText = "Tooltip for $text button."
    button.preferredSize = Dimension(100, 100)
    button.addActionListener { action() }
    return button
}

@Composable
fun ComposeContent() {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Row {
            Counter("West", westClicks)
            Spacer(modifier = Modifier.width(25.dp))
            Counter("North", northClicks)
            Spacer(modifier = Modifier.width(25.dp))
            Counter("East", eastClicks)
        }
    }
}

@Composable
fun Counter(text: String, counter: MutableState<Int>) {
    Surface(
        modifier = Modifier.size(130.dp, 130.dp),
        color = Color(180, 180, 180),
        shape = RoundedCornerShape(4.dp)
    ) {
        Column {
            Box(
                modifier = Modifier.height(30.dp).fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                Text(text = "${text}Clicks: ${counter.value}")
            }
            Spacer(modifier = Modifier.height(25.dp))
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Button(onClick = { counter.value++ }) {
                    Text(text = text, color = Color.White)
                }
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="composePanel.setContent { ComposeContent() }"}

<img src="compose-desktop-swing-composepanel.animated.gif" alt="IntegrationWithSwing" preview-src="compose-desktop-swing-composepanel.png" width="799"/>

### 實驗性離屏渲染

一種實驗模式允許直接在 Swing 元件上渲染 Compose 面板。這可以防止面板顯示、隱藏或調整大小時出現過渡性的渲染問題。它還能在結合 Swing 元件和 Compose 面板時實現正確的分層：一個 Swing 元件可以顯示在 `ComposePanel` 的上方或下方。

> 離屏渲染是[實驗性功能](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)，
> 您應僅用於評估目的。
> {style="warning"}

要啟用離屏渲染，請使用 `compose.swing.render.on.graphics` 系統屬性。此屬性必須在應用程式中執行任何 Compose 程式碼之前設定，因此建議在啟動時使用 `-D` 命令列 JVM 引數來啟用它：

```Console
-Dcompose.swing.render.on.graphics=true
```

或者，在入口點使用 `System.setProperty()`：

```kotlin
fun main() {
    System.setProperty("compose.swing.render.on.graphics", "true")
    ...
}
```

### 實驗性彈出視窗獨立視圖

重要的是，彈出元素（如工具提示和下拉式選單）不受初始可組合畫布或應用程式視窗的限制。例如，當可組合視圖未佔滿全螢幕但需要彈出警告對話框時。

> 為彈出視窗建立獨立視圖或視窗是[實驗性功能](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)。需要選擇加入（詳情請見下文），
> 您應僅用於評估目的。
> {style="warning"}

要在桌面端為彈出視窗建立獨立視圖或視窗，請設定 `compose.layers.type` 系統屬性。支援的值：
*   `WINDOW` 會將 `Popup` 和 `Dialog` 元件建立為獨立的無裝飾視窗。
*   `COMPONENT` 會將 `Popup` 或 `Dialog` 建立為同一視窗中的獨立 Swing 元件。請注意，此設定需要啟用離屏渲染（參閱[實驗性離屏渲染](#experimental-off-screen-rendering)章節），且離屏渲染僅適用於 `ComposePanel` 元件，不適用於全視窗應用程式。

請注意，彈出視窗和對話框仍然無法在其自身邊界之外繪製任何內容（例如，最頂層容器的陰影）。

以下是使用 `COMPONENT` 屬性的程式碼範例：

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.Modifier
import androidx.compose.ui.awt.ComposePanel
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import javax.swing.JFrame
import javax.swing.JLayeredPane
import javax.swing.SwingUtilities
import javax.swing.WindowConstants

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
    
    // 將整個視窗用於對話框
    composePanel.windowContainer = contentPane
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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="@OptIn(ExperimentalComposeUiApi::class) fun main()"}

## 在 Compose Multiplatform 應用程式中使用 Swing

`SwingPanel` 允許您在 Compose Multiplatform 應用程式中建立帶有 Swing 的 UI。使用 `SwingPanel` 的 `factory` 參數來建立一個 Swing `JPanel`：

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.size
import androidx.compose.material.Button
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.awt.SwingPanel
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.singleWindowApplication
import java.awt.Component
import javax.swing.BoxLayout
import javax.swing.JButton
import javax.swing.JPanel

fun main() = singleWindowApplication(title = "SwingPanel") {
    val counter = remember { mutableStateOf(0) }

    val inc: () -> Unit = { counter.value++ }
    val dec: () -> Unit = { counter.value-- }

    Box(
        modifier = Modifier.fillMaxWidth().height(60.dp).padding(top = 20.dp),
        contentAlignment = Alignment.Center
    ) {
        Text("Counter: ${counter.value}")
    }

    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier.padding(top = 80.dp, bottom = 20.dp)
        ) {
            Button("1. Compose Button: increment", inc)
            Spacer(modifier = Modifier.height(20.dp))

            SwingPanel(
                background = Color.LightGray,
                modifier = Modifier.size(270.dp, 90.dp),
                factory = {
                    JPanel().apply {
                        layout = BoxLayout(this, BoxLayout.Y_AXIS)
                        add(actionButton("1. Swing Button: decrement", dec))
                        add(actionButton("2. Swing Button: decrement", dec))
                        add(actionButton("3. Swing Button: decrement", dec))
                    }
                }
            )

            Spacer(modifier = Modifier.height(20.dp))
            Button("2. Compose Button: increment", inc)
        }
    }
}

@Composable
fun Button(text: String = "", action: (() -> Unit)? = null) {
    Button(
        modifier = Modifier.size(270.dp, 30.dp),
        onClick = { action?.invoke() }
    ) {
        Text(text)
    }
}

fun actionButton(
    text: String,
    action: () -> Unit
): JButton {
    val button = JButton(text)
    button.alignmentX = Component.CENTER_ALIGNMENT
    button.addActionListener { action() }

    return button
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="factory = { JPanel().apply { layout = BoxLayout(this, BoxLayout.Y_AXIS)"}

<img src="compose-desktop-swingpanel.animated.gif" alt="SwingPanel" preview-src="compose-desktop-swingpanel.png" width="600"/>

### 當 Compose 狀態變更時更新 Swing 元件

為了保持 Swing 元件的最新狀態，請提供一個 `update: (T) -> Unit` 回呼函數，該函數會在可組合狀態變更或佈局載入時被調用。以下程式碼範例演示了如何在可組合狀態變更時，更新 `SwingPanel` 內的 Swing 元件：

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.width
import androidx.compose.material.Button
import androidx.compose.material.Text
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.awt.SwingPanel
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.application
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.rememberWindowState
import java.awt.BorderLayout
import javax.swing.JPanel
import javax.swing.JLabel

val swingLabel = JLabel()

fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        state = rememberWindowState(width = 400.dp, height = 200.dp),
        title = "SwingLabel"
    ) {
        val clicks = remember { mutableStateOf(0) }
        Column(
            modifier = Modifier.fillMaxSize().padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            SwingPanel(
                modifier = Modifier.fillMaxWidth().height(40.dp),
                factory = {
                    JPanel().apply {
                        add(swingLabel, BorderLayout.CENTER)
                    }
                },
                update = {
                    swingLabel.text = "SwingLabel clicks: ${clicks.value}"
                }
            )
            Spacer(modifier = Modifier.height(40.dp))
            Row (
                modifier = Modifier.height(40.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Button(onClick = { clicks.value++ }) {
                    Text(text = "Increment")
                }
                Spacer(modifier = Modifier.width(20.dp))
                Button(onClick = { clicks.value-- }) {
                    Text(text = "Decrement")
                }
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="factory = { JPanel().apply { add(swingLabel, BorderLayout.CENTER)} }, update = {"}

<img src="compose-desktop-swinglabel.animated.gif" alt="SwingLabel" preview-src="compose-desktop-swinglabel.png" width="600"/>

### 實驗性互通混和

預設情況下，使用 `SwingPanel` 包裝器實作的互通視圖是矩形的，並位於前景，在任何 Compose Multiplatform 元件之上。為了使彈出元素更容易使用，我們引入了互通混和的實驗性支援。

> 互通混和是[實驗性功能](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)，
> 您應僅用於評估目的。
> {style="warning"}

要啟用此實驗性功能，請將 `compose.interop.blending` 系統屬性設定為 `true`。此屬性必須在應用程式中執行任何 Compose 程式碼之前啟用，因此請透過 `-Dcompose.interop.blending=true` 命令列 JVM 引數或在入口點使用 `System.setProperty()` 來設定它：

```kotlin
fun main() {
    System.setProperty("compose.interop.blending", "true")
    ...
}
```

啟用互通混和後，您可以在以下使用案例中依賴 Swing：

*   **裁剪 (Clipping)**。您不再受矩形形狀的限制：`clip` 和 `shadow` 修飾符可以與 `SwingPanel` 正確配合使用。
*   **重疊 (Overlapping)**。可以在 `SwingPanel` 上方繪製任何 Compose Multiplatform 內容，並像往常一樣與其互動。

有關詳細資訊和已知限制，請參閱 [GitHub 上的描述](https://github.com/JetBrains/compose-multiplatform-core/pull/915)。

## 帶有巢狀 Swing 和 Compose Multiplatform 元件的佈局

透過互通性，您可以雙向結合 Swing 和 Compose Multiplatform：將 Swing 元件加入 Compose Multiplatform 應用程式，以及將 Compose Multiplatform 元件加入 Swing 應用程式。如果您希望巢狀化多個元件並自由組合方法，這種情境也受到支援。

以下程式碼範例演示了如何將 `SwingPanel` 加入到一個 `ComposePanel` 中，而該 `ComposePanel` 又已在另一個 `SwingPanel` 內部，從而建立一個 Swing-Compose Multiplatform-Swing 結構：

```kotlin
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.runtime.*
import androidx.compose.ui.awt.*
import androidx.compose.ui.*
import androidx.compose.ui.draw.*
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.window.*
import androidx.compose.ui.unit.*
import java.awt.BorderLayout
import java.awt.Dimension
import java.awt.Insets
import javax.swing.*
import javax.swing.border.EmptyBorder

val Gray = java.awt.Color(64, 64, 64)
val DarkGray = java.awt.Color(32, 32, 32)
val LightGray = java.awt.Color(210, 210, 210)

data class Item(
    val text: String,
    val icon: ImageVector,
    val color: Color,
    val state: MutableState<Boolean> = mutableStateOf(false)
)
val panelItemsList = listOf(
    Item(text = "Person", icon = Icons.Filled.Person, color = Color(10, 232, 162)),
    Item(text = "Favorite", icon = Icons.Filled.Favorite, color = Color(150, 232, 150)),
    Item(text = "Search", icon = Icons.Filled.Search, color = Color(232, 10, 162)),
    Item(text = "Settings", icon = Icons.Filled.Settings, color = Color(232, 162, 10)),
    Item(text = "Close", icon = Icons.Filled.Close, color = Color(232, 100, 100))
)
val itemSize = 50.dp

fun java.awt.Color.toCompose(): Color {
    return Color(red, green, blue)
}

fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        state = rememberWindowState(width = 500.dp, height = 500.dp),
        title = "Layout"
    ) {
        Column(
            modifier = Modifier.fillMaxSize().background(color = Gray.toCompose()).padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(text = "Compose Area", color = LightGray.toCompose())
            Spacer(modifier = Modifier.height(40.dp))
            SwingPanel(
                background = DarkGray.toCompose(),
                modifier = Modifier.fillMaxSize(),
                factory = {
                    ComposePanel().apply {
                        setContent {
                            Box {
                                SwingPanel(
                                    modifier = Modifier.fillMaxSize(),
                                    factory = { SwingComponent() }
                                )
                                Box (
                                    modifier = Modifier.align(Alignment.TopStart)
                                        .padding(start = 20.dp, top = 80.dp)
                                        .background(color = DarkGray.toCompose())
                                ) {
                                    SwingPanel(
                                        modifier = Modifier.size(itemSize * panelItemsList.size, itemSize),
                                        factory = {
                                            ComposePanel().apply {
                                                setContent {
                                                    ComposeOverlay()
                                                }
                                            }
                                        }
                                    )
                                }
                            }
                        }
                    }
                }
            )
        }
    }
}

fun SwingComponent() : JPanel {
    return JPanel().apply {
        background = DarkGray
        border = EmptyBorder(20, 20, 20, 20)
        layout = BorderLayout()
        add(
            JLabel("TextArea Swing Component").apply {
                foreground = LightGray
                verticalAlignment = SwingConstants.NORTH
                horizontalAlignment = SwingConstants.CENTER
                preferredSize = Dimension(40, 160)
            },
            BorderLayout.NORTH
        )
        add(
            JTextArea().apply {
                background = LightGray
                lineWrap = true
                wrapStyleWord = true
                margin = Insets(10, 10, 10, 10)
                text = "The five boxing wizards jump quickly. " +
                "Crazy Fredrick bought many very exquisite opal jewels. " +
                "Pack my box with five dozen liquor jugs.
" +
                "Cozy sphinx waves quart jug of bad milk. " +
                "The jay, pig, fox, zebra and my wolves quack!"
            },
            BorderLayout.CENTER
        )
    }
}

@Composable
fun ComposeOverlay() {
    Box(
        modifier = Modifier.fillMaxSize().
            background(color = DarkGray.toCompose()),
        contentAlignment = Alignment.Center
    ) {
        Row(
            modifier = Modifier.background(
                shape = RoundedCornerShape(4.dp),
                color = Color.DarkGray.copy(alpha = 0.5f)
            )
        ) {
            for (item in panelItemsList) {
                SelectableItem(
                    text = item.text,
                    icon = item.icon,
                    color = item.color,
                    selected = item.state
                )
            }
        }
    }
}

@Composable
fun SelectableItem(
    text: String,
    icon: ImageVector,
    color: Color,
    selected: MutableState<Boolean>
) {
    Box(
        modifier = Modifier.size(itemSize)
            .clickable { selected.value = !selected.value },
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier.alpha(if (selected.value) 1.0f else 0.5f),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(modifier = Modifier.size(32.dp), imageVector = icon, contentDescription = null, tint = color)
            Text(text = text, color = Color.White, fontSize = 10.sp)
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="fun SwingComponent() : JPanel { return JPanel().apply {"}

<img src="compose-desktop-swing-layout.animated.gif" alt="Swing layout" preview-src="compose-desktop-swing-layout.png" width="600"/>

## 接下來是什麼？

探索有關[其他桌面專用元件](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop)的教學。