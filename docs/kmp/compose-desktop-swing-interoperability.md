[//]: # (title: Swing 互操作性)

在这里，您将学习如何在 Compose Multiplatform 应用程序中使用 Swing 组件，反之亦然，了解这种互操作性的限制和优势，以及何时应该或不应该使用这种方法。

Compose Multiplatform 和 Swing 之间的互操作性旨在帮助您：
* 简化并平滑将 Swing 应用程序迁移到 Compose Multiplatform 的过程。
* 在没有可用的 Compose 类似物时，使用 Swing 组件增强 Compose Multiplatform 应用程序。

在许多情况下，直接在 Compose Multiplatform 中实现缺失的组件（并将其贡献给社区）比在 Compose Multiplatform 应用程序中使用 Swing 组件更有效。

undefined

## Swing 互操作用例与限制

### Swing 应用中的 Compose Multiplatform 组件

第一个用例涉及将 Compose Multiplatform 组件添加到 Swing 应用程序中。您可以通过使用 `ComposePanel` Swing 组件来渲染应用程序的 Compose Multiplatform 部分。从 Swing 的角度来看，`ComposePanel` 是另一个 Swing 组件，并会对其进行相应处理。

请注意，所有 Compose Multiplatform 组件（包括弹出窗口、工具提示和上下文菜单）都在 Swing 的 `ComposePanel` 内渲染，并在其内部定位和调整大小。因此，请考虑将这些组件替换为基于 Swing 的实现，或者尝试两个新的实验性功能：

[离屏渲染](#experimental-off-screen-rendering) 
: 允许直接在 Swing 组件上渲染 Compose 面板。

[弹出窗口、对话框和下拉菜单的独立平台视图](#experimental-separate-views-for-popups)
: 弹出窗口不再受初始可组合画布或应用窗口的限制。

以下是使用 `ComposePanel` 的几种场景：
* 在您的应用程序中嵌入动画对象或整个动画对象面板（例如，表情符号选择或带有事件动画反应的工具栏）。
* 在应用程序中实现交互式渲染区域（例如图形或信息图表），使用 Compose Multiplatform 实现这些功能更加简单方便。
* 在应用程序中集成复杂的渲染区域（甚至可能是动画效果），使用 Compose Multiplatform 会更简单。
* 替换基于 Swing 应用程序中复杂的界面部分，因为 Compose Multiplatform 提供了一个方便的组件布局系统，以及广泛的内置组件和用于快速创建自定义组件的选项。

### Compose Multiplatform 应用中的 Swing 组件

另一个用例是当您需要使用 Swing 中存在但 Compose Multiplatform 中没有类似物的组件时。如果从头开始创建新实现太耗时，请尝试使用 `SwingPanel`。`SwingPanel` 函数作为一个包装器，管理放置在 Compose Multiplatform 组件顶部的 Swing 组件的大小、位置和渲染。

请注意，`SwingPanel` 中的 Swing 组件将始终分层在 Compose Multiplatform 组件之上，因此位于 `SwingPanel` 下方的任何内容都将被 Swing 组件剪裁。要避免剪裁和重叠问题，请尝试 [实验性互操作混合](#experimental-interop-blending)。如果仍然存在渲染不正确的风险，您可以相应地重新设计 UI，或者避免使用 `SwingPanel` 并尝试实现缺失的组件，从而为技术开发做出贡献。

以下是使用 `SwingPanel` 的场景：
* 您的应用程序不需要弹出窗口、工具提示或上下文菜单，或者至少它们不在您的 `SwingPanel` 内部。
* `SwingPanel` 保持在固定位置。在这种情况下，您可以降低当 Swing 组件位置发生变化时出现故障和伪影的风险。然而，这种情况并非强制性的，应针对每个具体案例进行测试。
  
Compose Multiplatform 和 Swing 可以以两种方式结合，从而实现灵活的 UI 设计。您可以将 `SwingPanel` 放置在 `ComposePanel` 内部，而 `ComposePanel` 也可以在另一个 `SwingPanel` 内部。但在使用这种嵌套组合之前，请考虑潜在的渲染故障。有关代码示例，请参阅 [带有嵌套 SwingPanel 和 ComposePanel 的布局](#layout-with-nested-swing-and-compose-multiplatform-components)。

## 在 Swing 应用程序中使用 Compose Multiplatform

`ComposePanel` 允许您在基于 Swing 的应用程序中使用 Compose Multiplatform 创建 UI。将 `ComposePanel` 实例添加到 Swing 布局中，并在 `setContent` 中定义组合：

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

    // 创建 ComposePanel
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

    // 将 ComposePanel 添加到 JFrame
    window.contentPane.add(composePanel, BorderLayout.CENTER)

    // 设置内容
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

### 实验性离屏渲染

一种实验性模式允许直接在 Swing 组件上渲染 `ComposePanel`。这可以防止在显示、隐藏或调整 `ComposePanel` 大小时出现过渡渲染问题。它还可以在组合 Swing 组件和 Compose 面板时实现正确的层级：Swing 组件可以显示在 `ComposePanel` 之上或之下。然而，与默认的 Skia 渲染相比，这可能会导致性能损失，且损失随着面板尺寸的增加而增加。

此模式仅影响 `ComposePanel` 组件。目前，`ComposeWindow` 或 `ComposeDialog` 没有相应的设置。

> 离屏渲染处于 [实验性](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels) 阶段，您应仅将其用于评估目的。
>
{style="warning"}

要为特定的 `ComposePanel` 启用离屏渲染，请在创建它时传递 `RenderSettings.SwingGraphics` 值：

```kotlin
val composePanel = ComposePanel(renderSettings = RenderSettings.SwingGraphics)
```

要在项目中默认对每个 `ComposePanel` 启用离屏渲染，请使用 `compose.swing.render.on.graphics` 功能标志：

* 在启动时将该标志指定为命令行 JVM 参数：

    ```shell
    -Dcompose.swing.render.on.graphics=true
    ```
* 或者在入口点将该标志作为参数传递给 `System.setProperty()` 函数：

    ```kotlin
    fun main() {
        System.setProperty("compose.swing.render.on.graphics", "true")
        ...
    }
    ```

### 实验性弹出窗口独立视图

弹出元素（如工具提示和下拉菜单）不受初始可组合画布或应用窗口的限制，这一点可能非常重要。例如，当可组合视图未占据全屏但需要生成警告对话框时。

> 为弹出窗口创建独立的视图或窗口处于 [实验性](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels) 阶段。需要选择加入（详情见下文），且您应仅将其用于评估目的。
>
{style="warning"}

要在桌面上为弹出窗口创建独立的视图或窗口，请设置 `compose.layers.type` 系统属性。支持的值包括：
* `WINDOW` 将 `Popup` 和 `Dialog` 组件创建为独立的无边框窗口。
* `COMPONENT` 在同一窗口中将 `Popup` 或 `Dialog` 创建为独立的 Swing 组件。请注意，该设置需要启用离屏渲染（参见 [实验性离屏渲染](#experimental-off-screen-rendering) 部分），且离屏渲染仅适用于 `ComposePanel` 组件，而不适用于全窗口应用程序。

请注意，弹出窗口和对话框仍然无法在其自身边界之外绘制任何内容（例如，最顶层容器的阴影）。

以下是使用 `COMPONENT` 属性的代码示例：

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
    
    // 将整个窗口用于对话框
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

## 在 Compose Multiplatform 应用程序中使用 Swing

`SwingPanel` 允许您在 Compose Multiplatform 应用程序中使用 Swing 创建 UI。使用 `SwingPanel` 的 `factory` 参数来创建 Swing `JPanel`：

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

### 当 Compose 状态更改时更新 Swing 组件

为了使 Swing 组件保持最新状态，请提供一个 `update: (T) -> Unit` 回调，每当可组合状态更改或布局加载时，该回调都会被调用。以下代码示例演示了每当可组合状态更改时，如何更新 `SwingPanel` 中的 Swing 组件：

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

### 实验性互操作混合

默认情况下，使用 `SwingPanel` 包装器实现的互操作视图是矩形的，并位于前景，在任何 Compose Multiplatform 组件之上。为了使弹出元素更易于使用，我们引入了对互操作混合的实验性支持。

> 互操作混合处于 [实验性](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels) 阶段，您应仅将其用于评估目的。
>
{style="warning"}

要启用此实验性功能，请将 `compose.interop.blending` 系统属性设置为 `true`。该属性必须在执行应用程序中的任何 Compose 代码之前启用，因此请通过 `-Dcompose.interop.blending=true` 命令行 JVM 参数设置它，或者在入口点使用 `System.setProperty()`：

```kotlin
fun main() {
    System.setProperty("compose.interop.blending", "true")
    ...
}
```

启用互操作混合后，您可以在以下用例中依赖 Swing：

* **剪裁**。您不再受矩形形状的限制：`clip` 和 `shadow` 修饰符可以与 `SwingPanel` 配合使用。
* **重叠**。可以在 `SwingPanel` 之上绘制任何 Compose Multiplatform 内容，并像往常一样与其进行交互。

有关详情和已知限制，请参阅 [GitHub 上的说明](https://github.com/JetBrains/compose-multiplatform-core/pull/915)。

## 带有嵌套 Swing 和 Compose Multiplatform 组件的布局

通过互操作性，您可以以两种方式结合 Swing 和 Compose Multiplatform：将 Swing 组件添加到 Compose Multiplatform 应用程序中，以及将 Compose Multiplatform 组件添加到 Swing 应用程序中。如果您想嵌套多个组件并自由结合这些方法，此场景也是受支持的。

以下代码示例演示了如何将 `SwingPanel` 添加到 `ComposePanel` 中，而该 `ComposePanel` 已经位于另一个 `SwingPanel` 内部，从而创建 Swing-Compose Multiplatform-Swing 结构：

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

## 下一步

探索有关 [其他桌面特定组件](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop) 的教程。