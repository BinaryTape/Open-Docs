[//]: # (title: Swing 互通性)

在這裡，您將了解如何在 Compose Multiplatform 應用程式中使用 Swing 組建，反之亦然，包括這種互通性的限制與優點，以及何時應該或不應該使用此方法。

Compose Multiplatform 與 Swing 之間的互通性旨在幫助您：
* 簡化並平滑將 Swing 應用程式遷移至 Compose Multiplatform 的過程。
* 在沒有 Compose 對應項可用時，使用 Swing 組建來增強 Compose Multiplatform 應用程式。

在許多情況下，直接在 Compose Multiplatform 中實作缺失的組建（並將其貢獻給社群），會比在 Compose Multiplatform 應用程式中使用 Swing 組建更有效率。

## Swing 互通性使用案例與限制

### 在 Swing 應用程式中使用 Compose Multiplatform 組建

第一個使用案例涉及將 Compose Multiplatform 組建新增至 Swing 應用程式中。您可以透過 `ComposePanel` 這個 Swing 組建來渲染應用程式中的 Compose Multiplatform 部分。從 Swing 的角度來看，`ComposePanel` 只是另一個 Swing 組建，並會對其進行相應處理。

請注意，所有 Compose Multiplatform 組建，包括快顯視窗、工具提示和操作功能表，都會在 Swing 的 `ComposePanel` 內渲染，並在其中進行定位與調整大小。因此，請考慮將這些組建替換為基於 Swing 的實作，或者嘗試以下兩種新的實驗性功能：

[離屏渲染 (Off-screen rendering)](#experimental-off-screen-rendering) 
: 允許直接在 Swing 組建上渲染 Compose 面板。

[針對快顯視窗、對話方塊和下拉式選單的獨立平台視圖](#experimental-separate-views-for-popups)
: 快顯視窗不再受初始可組合畫布或應用程式視窗的限制。

以下是使用 `ComposePanel` 的幾個案例：
* 在應用程式中嵌入動畫物件或整個動畫物件面板（例如：表情符號選擇器或具有事件動畫反應的工具列）。
* 在應用程式中實作互動式渲染區域，例如圖形或資訊圖表，這使用 Compose Multiplatform 實作會更容易且更方便。
* 在應用程式中整合複雜的渲染區域（甚至可能是動畫），這在 Compose Multiplatform 中更為簡單。
* 替換基於 Swing 應用程式中複雜的使用者介面部分，因為 Compose Multiplatform 提供方便的組建配置系統，以及豐富的內建組建和選項，可快速建立自訂組建。

### 在 Compose Multiplatform 應用程式中使用 Swing 組建

另一個使用案例是當您需要使用存在於 Swing 但在 Compose Multiplatform 中沒有對應項的組建時。如果從頭開始建立新實作太耗時，請嘗試 `SwingPanel`。`SwingPanel` 函式作為一個包裝函式，負責管理放置在 Compose Multiplatform 組建之上的 Swing 組建的大小、位置和渲染。

請注意，`SwingPanel` 內的 Swing 組建將始終分層在 Compose Multiplatform 組建之上，因此任何位於 `SwingPanel` 下方的內容都會被 Swing 組建裁切。為了避免裁切和重疊問題，請嘗試 [實驗性的互通性混合 (Interop blending)](#experimental-interop-blending)。如果仍有渲染錯誤的風險，您可以相應地重新設計 UI，或者避免使用 `SwingPanel` 並嘗試實作缺失的組建，為技術發展做出貢獻。

以下是使用 `SwingPanel` 的案例：
* 您的應用程式不需要快顯視窗、工具提示或操作功能表，或者至少它們不在 `SwingPanel` 內部。
* `SwingPanel` 保持在固定位置。在這種情況下，您可以降低當 Swing 組建位置變更時出現異常與殘影的風險。然而，這並非強制性條件，應針對每個具體案例進行測試。
  
Compose Multiplatform 和 Swing 可以雙向結合，實現靈活的 UI 設計。您可以將 `SwingPanel` 放置在 `ComposePanel` 內，而後者也可以位於另一個 `SwingPanel` 內。但在使用此類巢狀組合之前，請考慮潛在的渲染異常。請參閱 [使用巢狀 SwingPanel 和 ComposePanel 的配置](#layout-with-nested-swing-and-compose-multiplatform-components) 以獲取程式碼範例。

## 在 Swing 應用程式中使用 Compose Multiplatform

`ComposePanel` 允許您在基於 Swing 的應用程式中，使用 Compose Multiplatform 建立 UI。將 `ComposePanel` 的執行個體新增到您的 Swing 配置中，並在 `setContent` 中定義組合（Composition）：

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

    // 將 ComposePanel 新增至 JFrame
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

<img src="compose-desktop-swing-composepanel.animated.gif" alt="與 Swing 整合" preview-src="compose-desktop-swing-composepanel.png" width="799"/>

### 實驗性的離屏渲染

實驗性模式允許直接在 Swing 組建上渲染 `ComposePanel`。這可以防止在顯示、隱藏或調整 `ComposePanel` 大小時出現過渡性的渲染問題。它還能在組合 Swing 組建和 Compose 面板時實現正確的分層：Swing 組建可以顯示在 `ComposePanel` 之上或之下。然而，與預設的 Skia 渲染相比，這可能會導致效能下降，且效能損耗會隨面板大小增加。

此模式僅影響 `ComposePanel` 組建。目前，`ComposeWindow` 或 `ComposeDialog` 尚無相應設定。

> 離屏渲染處於 [實驗性](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels) 階段，您應僅將其用於評估目的。
>
{style="warning"}

若要為特定的 `ComposePanel` 啟用離屏渲染，請在建立時傳遞 `RenderSettings.SwingGraphics` 值：

```kotlin
val composePanel = ComposePanel(renderSettings = RenderSettings.SwingGraphics)
```

若要為專案中的每個 `ComposePanel` 預設啟用離屏渲染，請使用 `compose.swing.render.on.graphics` 功能旗標：

* 在啟動時將該旗標指定為命令列 JVM 引數：

    ```shell
    -Dcompose.swing.render.on.graphics=true
    ```
* 或在入口點將該旗標作為引數傳遞給 `System.setProperty()` 函式：

    ```kotlin
    fun main() {
        System.setProperty("compose.swing.render.on.graphics", "true")
        ...
    }
    ```

### 實驗性的快顯視窗獨立視圖

工具提示和下拉式功能表等快顯視窗元素不受初始可組合畫布或應用程式視窗的限制，這一點非常重要。例如，當可組合視圖未佔滿全螢幕但需要產生警示對話方塊時。

> 為快顯視窗建立獨立視圖或視窗目前處於 [實驗性](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels) 階段。需要選擇加入（Opt-in）（詳見下文），且您應僅將其用於評估目的。
>
{style="warning"}

若要在桌面上為快顯視窗建立獨立視圖或視窗，請設定 `compose.layers.type` 系統屬性。支援的值：
* `WINDOW` 將 `Popup` 和 `Dialog` 組建建立為獨立的無裝飾視窗。
* `COMPONENT` 在同一視窗中將 `Popup` 或 `Dialog` 建立為獨立的 Swing 組建。請注意，此設定需要啟用離屏渲染（請參閱 [實驗性的離屏渲染](#experimental-off-screen-rendering) 部分），且離屏渲染僅適用於 `ComposePanel` 組建，而不適用於全視窗應用程式。

請注意，快顯視窗和對話方塊仍無法在其自身邊界之外繪製任何內容（例如，最頂層容器的陰影）。

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
    
    // 將整個視窗用於對話方塊
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

`SwingPanel` 允許您在 Compose Multiplatform 應用程式中，使用 Swing 建立 UI。使用 `SwingPanel` 的 `factory` 參數來建立 Swing `JPanel`：

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

### 在 Compose 狀態變更時更新 Swing 組建

若要讓 Swing 組建保持最新，請提供一個 `update: (T) -> Unit` 回呼，每當可組合狀態變更或配置充氣（Inflated）時，都會叫用該回呼。
以下程式碼範例示範如何在可組合狀態變更時，更新 `SwingPanel` 內的 Swing 組建：

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

### 實驗性的互通性混合 (Interop blending)

預設情況下，使用 `SwingPanel` 包裝函式實作的互通性視圖是矩形的，且位於前景，置於任何 Compose Multiplatform 組建之上。為了使快顯元素更易於使用，我們引入了互通性混合的實驗性支援。

> 互通性混合目前處於 [實驗性](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels) 階段，您應僅將其用於評估目的。
>
{style="warning"}

若要啟用此實驗性功能，請將 `compose.interop.blending` 系統屬性設定為 `true`。此屬性必須在應用程式執行任何 Compose 程式碼之前啟用，因此請透過 `-Dcompose.interop.blending=true` 命令列 JVM 引數進行設定，或在入口點使用 `System.setProperty()`：

```kotlin
fun main() {
    System.setProperty("compose.interop.blending", "true")
    ...
}
```

啟用互通性混合後，您可以在以下案例中依賴 Swing：

* **裁切 (Clipping)**。您不再受矩形形狀限制：`clip` 和 `shadow` 修飾符在 `SwingPanel` 上可以正常運作。
* **重疊 (Overlapping)**。可以在 `SwingPanel` 之上繪製任何 Compose Multiplatform 內容，並像往常一樣與其進行互動。

有關詳細資訊和已知限制，請參閱 [GitHub 上的說明](https://github.com/JetBrains/compose-multiplatform-core/pull/915)。

## 使用巢狀 Swing 與 Compose Multiplatform 組建的配置

透過互通性，您可以雙向結合 Swing 和 Compose Multiplatform：將 Swing 組建新增至 Compose Multiplatform 應用程式，以及將 Compose Multiplatform 組建新增至 Swing 應用程式。如果您想巢狀多個組建並自由組合這些方法，此案例也受支援。

以下程式碼範例示範如何將 `SwingPanel` 新增到 `ComposePanel` 中，而後者本身已在另一個 `SwingPanel` 內，從而建立一個 Swing-Compose Multiplatform-Swing 的結構：

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

<img src="compose-desktop-swing-layout.animated.gif" alt="Swing 配置" preview-src="compose-desktop-swing-layout.png" width="600"/>

## 下一步？

探索關於 [其他桌面特定組建](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop) 的教學。