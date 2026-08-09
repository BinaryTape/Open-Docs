[//]: # (title: 顶层窗口管理)

<web-summary>了解如何在 Compose Multiplatform 桌面端管理顶层窗口：创建和自定义窗口、隐藏到系统托盘以及使用对话框。</web-summary>

Compose Multiplatform 桌面端提供了多种用于管理窗口的功能。您可以将窗口隐藏到系统托盘、使其可拖动、自适应尺寸、更改位置等。

另请参阅新的实验性 [窗口与对话框 API v2](#window-and-dialog-api-v2)。

## 打开和关闭窗口

您可以使用 `Window()` 函数来创建一个常规窗口。要将其置于可组合作用域中，请在 `application` 入口点中使用 `Window()`：

```kotlin
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application

fun main() = application {
    Window(onCloseRequest = ::exitApplication) {
        // 窗口内容
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="application { Window(onCloseRequest = ::exitApplication)"}

作为可组合函数，`Window()` 允许您以声明方式更改其属性。例如，您可以打开一个带有标题的窗口，并在随后更改该标题：

```kotlin
import androidx.compose.material.Button
import androidx.compose.material.Text
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application

fun main() = application {
    var fileName by remember { mutableStateOf("Untitled") }

    Window(onCloseRequest = ::exitApplication, title = "$fileName - Editor") {
        Button(onClick = { fileName = "note.txt" }) {
            Text("Save")
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Window(onCloseRequest = ::exitApplication, title = "}

<img src="compose-window-properties.animated.gif" alt="Window properties: change title" preview-src="compose-window-properties.png" width="600"/>

### 添加条件

您还可以使用简单的 `if` 条件来打开和关闭窗口。在以下代码示例中，应用窗口在完成任务后会自动关闭：

```kotlin
import androidx.compose.material.Text
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import kotlinx.coroutines.delay

fun main() = application {
    var isPerformingTask by remember { mutableStateOf(true) }

    LaunchedEffect(Unit) {
        // 执行一些繁重任务
        delay(2000) 
        isPerformingTask = false
    }
    if (isPerformingTask) {
        Window(
            onCloseRequest = ::exitApplication,
            title = "Window 1"
        )
        {
            Text("Performing some tasks. Please wait!")
        }
    } else {
        Window(
            onCloseRequest = ::exitApplication,
            title = "Window 2"
        ) {
            Text("Hello, World!")
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="if (isPerformingTask) { Window(onCloseRequest = ::exitApplication,"}

<img src="compose-window-condition.animated.gif" alt="Windows with conditions" preview-src="compose-window-condition.png" width="600"/>

### 在关闭时请求确认

如果您想在应用退出时使用自定义逻辑（例如显示对话框），可以使用 `onCloseRequest` 回调重写关闭操作。
在以下代码示例中，我们不再使用命令式方法（`window.close()`），而是使用声明式方法，并响应状态更改（`isOpen = false`）来关闭窗口。

```kotlin
import androidx.compose.material.Button
import androidx.compose.material.Text
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.window.DialogWindow
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application

fun main() = application {
    var isOpen by remember { mutableStateOf(true) }
    var isAskingToClose by remember { mutableStateOf(false) }

    if (isOpen) {
        Window(
            onCloseRequest = { isAskingToClose = true },
            title = "Important document"
        ) {
            if (isAskingToClose) {
                DialogWindow(
                    onCloseRequest = { isAskingToClose = false },
                    title = "Close without saving?"
                ) {
                    Button(
                        onClick = { isOpen = false }
                    ) {
                        Text("Yes")
                    }
                }
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Window(onCloseRequest = { isAskingToClose = true }"}

<img src="compose-window-ask-to-close.animated.gif" alt="Close with confirmation" preview-src="compose-window-ask-to-close.png" width="600"/>

## 创建单窗口应用

对于只有一个顶层窗口的简单应用程序，您不需要包含 `Window()` 可组合项的完整 `application` 入口点 —— `singleWindowApplication()` 函数将两者包装在单次调用中：

```kotlin
import androidx.compose.ui.window.singleWindowApplication

fun main() = singleWindowApplication {
    // 窗口内容
}
```

如果需要多个顶层窗口、自定义关闭逻辑或在运行时更改窗口属性，请在 `application` 入口点中使用 [`Window()` 可组合项](#open-and-close-windows)。

## 管理窗口状态

`WindowState` 类持有窗口放置、当前位置和尺寸。
placement 属性允许您指定窗口在屏幕上的放置方式：浮动、最大化/最小化或全屏。
状态的任何更改都会触发自动重组。要更改窗口状态，请使用回调或在可组合项中对其进行观察：

```kotlin
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.material.Checkbox
import androidx.compose.material.Text
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.WindowPlacement
import androidx.compose.ui.window.WindowPosition
import androidx.compose.ui.window.application
import androidx.compose.ui.window.rememberWindowState

fun main() = application {
    val state = rememberWindowState(placement = WindowPlacement.Maximized)

    Window(onCloseRequest = ::exitApplication, state, title = "Window state") {
        Column {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Checkbox(
                    state.placement == WindowPlacement.Fullscreen,
                    {
                        state.placement = if (it) {
                            WindowPlacement.Fullscreen
                        } else {
                            WindowPlacement.Floating
                        }
                    }
                )
                Text("isFullscreen")
            }

            Row(verticalAlignment = Alignment.CenterVertically) {
                Checkbox(
                    state.placement == WindowPlacement.Maximized,
                    {
                        state.placement = if (it) {
                            WindowPlacement.Maximized
                        } else {
                            WindowPlacement.Floating
                        }
                    }
                )
                Text("isMaximized")
            }

            Row(verticalAlignment = Alignment.CenterVertically) {
                Checkbox(state.isMinimized, { state.isMinimized = !state.isMinimized })
                Text("isMinimized")
            }

            Text(
                "Position ${state.position}",
                Modifier.clickable {
                    val position = state.position
                    if (position is WindowPosition.Absolute) {
                        state.position = position.copy(x = state.position.x + 10.dp)
                    }
                }
            )

            Text(
                "Size ${state.size}",
                Modifier.clickable {
                    state.size = state.size.copy(width = state.size.width + 10.dp)
                }
            )
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="val state = rememberWindowState(placement = WindowPlacement.Maximized)"}

<img src="compose-window-minimize.animated.gif" alt="Changing the state" preview-src="compose-window-minimize.png" width="600"/>

### 自适应窗口内容尺寸

要在不提前提供维度的情况下根据内容确定窗口大小，请将窗口的一个或两个维度设置为 `Dp.Unspecified`。
Compose Multiplatform 会自动调整初始窗口大小以适应您的内容：

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material.Text
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import androidx.compose.ui.window.rememberWindowState

fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        state = rememberWindowState(width = Dp.Unspecified, height = Dp.Unspecified),
        title = "Adaptive size",
        resizable = false
    ) {
        Column(Modifier.background(Color(0xFFEEEEEE))) {
            Row {
                Text("label 1", Modifier.size(100.dp, 100.dp).padding(10.dp).background(Color.White))
                Text("label 2", Modifier.size(150.dp, 200.dp).padding(5.dp).background(Color.White))
                Text("label 3", Modifier.size(200.dp, 300.dp).padding(25.dp).background(Color.White))
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="state = rememberWindowState(width = Dp.Unspecified, height = Dp.Unspecified)"}

<img src="compose-window-adaptive-size.png" alt="Adaptive window size" width="451"/>

### 监听状态更改

如果您需要对状态更改做出反应并将值发送到应用程序的非组合部分（例如写入数据库），可以使用 `snapshotFlow()` 函数。
该函数会捕获可组合项状态的当前值。

```kotlin
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.WindowPosition
import androidx.compose.ui.window.application
import androidx.compose.ui.window.rememberWindowState
import kotlinx.coroutines.flow.filter
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach

fun main() = application {
    val state = rememberWindowState()

    Window(onCloseRequest = ::exitApplication, state) {
        LaunchedEffect(state) {
            snapshotFlow { state.size }
                .onEach(::onWindowResize)
                .launchIn(this)

            snapshotFlow { state.position }
                .filter { it.isSpecified }
                .onEach(::onWindowRelocate)
                .launchIn(this)
        }
    }
}

private fun onWindowResize(size: DpSize) {
    println("onWindowResize $size")
}

private fun onWindowRelocate(position: WindowPosition) {
    println("onWindowRelocate $position")
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="LaunchedEffect(state) { snapshotFlow { state.size } .onEach(::onWindowResize)"}

## 管理多个窗口

要管理多个窗口，您可以为应用程序状态创建一个单独的类，并响应 `mutableStateListOf` 的更改来打开或关闭窗口：

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.remember
import androidx.compose.ui.window.MenuBar
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application

fun main() = application {
    val applicationState = remember { MyApplicationState() }

    for (window in applicationState.windows) {
        key(window) {
            MyWindow(window)
        }
    }
}

@Composable
private fun MyWindow(
    state: MyWindowState
) = Window(onCloseRequest = state::close, title = state.title) {
    MenuBar {
        Menu("File") {
            Item("New window", onClick = state.openNewWindow)
            Item("Exit", onClick = state.exit)
        }
    }
}

private class MyApplicationState {
    val windows = mutableStateListOf<MyWindowState>()

    init {
        windows += MyWindowState("Initial window")
    }

    fun openNewWindow() {
        windows += MyWindowState("Window ${windows.size}")
    }

    fun exit() {
        windows.clear()
    }

    private fun MyWindowState(
        title: String
    ) = MyWindowState(
        title,
        openNewWindow = ::openNewWindow,
        exit = ::exit,
        windows::remove
    )
}

private class MyWindowState(
    val title: String,
    val openNewWindow: () -> Unit,
    val exit: () -> Unit,
    private val close: (MyWindowState) -> Unit
) {
    fun close() = close(this)
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="MyApplicationState { val windows = mutableStateListOf<MyWindowState>()"}

<img src="compose-multiple-windows.animated.gif" alt="Multiple windows" preview-src="compose-multiple-windows.png" width="600"/>

有关更复杂的示例，请参阅 [Code Viewer](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/codeviewer) 示例。

## 显示对话框

您可以使用 `DialogWindow()` 可组合项来显示一个带有自己标题栏的独立操作系统级窗口。
这对于确认、文件选择器或用户在继续操作前必须完成的任何交互都非常有用。

您可以使用实验性的 `modalityType` 参数来控制对话框是否阻止与其他窗口的交互。
将其设置为 `DialogModalityType` 值之一：

* `Modeless` 不会阻止任何其他窗口。
* `DocumentModal` 会阻止父级顶层窗口及与其关联的任何其他窗口，对话框自身的子孙窗口除外。
* `ApplicationModal` 会阻止同一应用程序中的所有其他窗口。

> 对于保留在当前窗口内部的叠加层 UI（下拉菜单、工具提示和自定义叠加层），请使用多平台 [Popup()](compose-popups.md) 可组合项。
>
{style="tip"}

以下代码示例结合了一个常规窗口和一个 `ApplicationModal` 对话框：

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material.Button
import androidx.compose.material.Text
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.window.DialogWindow
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.WindowPosition
import androidx.compose.ui.window.application
import androidx.compose.ui.window.rememberDialogState
import androidx.compose.ui.window.DialogModalityType
import androidx.compose.ui.ExperimentalComposeUiApi

// 启用实验性 modalityType
@OptIn(ExperimentalComposeUiApi::class)
fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        title = "Main window"
    ) {
        var isDialogOpen by remember { mutableStateOf(false) }

        Button(onClick = { isDialogOpen = true }) {
            Text(text = "Open dialog")
        }

        if (isDialogOpen) {
            DialogWindow(
                onCloseRequest = { isDialogOpen = false },
                state = rememberDialogState(position = WindowPosition(Alignment.Center)),
                title = "Dialog",
                modalityType = DialogModalityType.ApplicationModal
            ) {
                Box(contentAlignment = Alignment.Center, modifier = Modifier.fillMaxSize()) {
                    Text("This is a dialog")
                }
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="if (isDialogOpen) { DialogWindow( ... ) }"}

## 将窗口隐藏到系统托盘

默认情况下，关闭窗口会退出应用程序。要改为将窗口隐藏到系统托盘或菜单栏，您可以拦截 `onCloseRequest` 以更改窗口的可视性状态。

在以下示例中，关闭窗口会将 `isVisible` 设置为 `false`，从而隐藏窗口并显示系统托盘图标。
点击托盘图标即可恢复窗口。

```kotlin
import androidx.compose.material.Text
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.window.Tray
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import kotlinx.coroutines.delay

fun main() = application {
    var isVisible by remember { mutableStateOf(true) }

    Window(
        // 隐藏窗口而不是关闭应用
        onCloseRequest = { isVisible = false },
        visible = isVisible,
        title = "Counter",
    ) {
        var counter by remember { mutableStateOf(0) }
        LaunchedEffect(Unit) {
            while (true) {
                counter++
                delay(1000)
            }
        }
        Text(counter.toString())
    }

    if (!isVisible) {
        Tray(
            TrayIcon,
            tooltip = "Counter",
            onAction = { isVisible = true },
            menu = {
                Item("Exit", onClick = ::exitApplication)
            },
        )
    }
}

object TrayIcon : Painter() {
    override val intrinsicSize = Size(256f, 256f)

    override fun DrawScope.onDraw() {
        drawOval(Color(0xFFFFA500))
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Window(onCloseRequest = { isVisible = false },"}

<img src="compose-window-hide-tray.animated.gif" alt="Hide instead of closing" preview-src="compose-window-hide-tray.png" width="600"/>

## 使窗口区域可拖动

要为无装饰窗口添加自定义可拖动标题栏或使整个窗口可拖动，可以使用 `WindowDraggableArea()` 可组合项：

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.window.WindowDraggableArea
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application

fun main() = application {
    Window(onCloseRequest = ::exitApplication, undecorated = true) {
        WindowDraggableArea {
            Box(Modifier.fillMaxWidth().height(48.dp).background(Color.DarkGray))
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="WindowDraggableArea { Box(Modifier.fillMaxWidth().height(48.dp).background(Color.DarkGray))}"}

`WindowDraggableArea()` 仅能在 `singleWindowApplication()`、`Window()` 和 `DialogWindow()` 可组合项内部使用。要在另一个可组合函数中调用它，请使用 `WindowScope` 作为接收者作用域：

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.window.WindowDraggableArea
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.WindowScope
import androidx.compose.ui.window.application

fun main() = application {
    Window(onCloseRequest = ::exitApplication, undecorated = true) {
        AppWindowTitleBar()
    }
}

@Composable
private fun WindowScope.AppWindowTitleBar() = WindowDraggableArea {
    Box(Modifier.fillMaxWidth().height(48.dp).background(Color.DarkGray))
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="private fun WindowScope.AppWindowTitleBar() = WindowDraggableArea {"}

<img src="compose-window-draggable-area.animated.gif" alt="Draggable area" preview-src="compose-window-draggable-area.png" width="600"/>

## 创建透明窗口

要创建透明窗口，请向 `Window()` 函数传递两个参数：`transparent=true` 和 `undecorated=true`。
窗口必须是无装饰的，因为无法对透明窗口进行装饰。

以下代码示例演示了如何结合使用可组合项来创建一个带有圆角的透明窗口：

```kotlin
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.Surface
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import androidx.compose.material.Text
import androidx.compose.runtime.*

fun main() = application {
    var isOpen by remember { mutableStateOf(true) }
    if (isOpen) {
        Window(
            onCloseRequest = { isOpen = false },
            title = "Transparent Window Example",
            transparent = true, 
            // 透明窗口必须是无装饰的
            undecorated = true, 
        ) {
            Surface(
                modifier = Modifier.fillMaxSize().padding(5.dp).shadow(3.dp, RoundedCornerShape(20.dp)), 
                color = Color.Transparent,
                // 带有圆角的窗口
                shape = RoundedCornerShape(20.dp) 
            ) {
                Text("Hello World!", color = Color.White)
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Modifier.fillMaxSize().padding(5.dp).shadow(3.dp, RoundedCornerShape(20.dp))"}

## 使用 Swing 组件

Compose Multiplatform 桌面端在底层使用 Swing，因此您可以直接使用 Swing 创建窗口：

```kotlin
import androidx.compose.ui.awt.ComposeWindow
import java.awt.Dimension
import javax.swing.JFrame
import javax.swing.SwingUtilities

fun main() = SwingUtilities.invokeLater {
    ComposeWindow().apply {
        size = Dimension(300, 300)
        defaultCloseOperation = JFrame.DISPOSE_ON_CLOSE
        setContent {
            // 窗口内容
        }
        isVisible = true
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="SwingUtilities.invokeLater { ComposeWindow().apply {"}

您还可以使用 `Window()` 可组合项的作用域。在以下代码示例中，`window` 是在 `Window()` 内部创建的 `ComposeWindow`：

```kotlin
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.window.singleWindowApplication
import java.awt.datatransfer.DataFlavor
import java.awt.dnd.DnDConstants
import java.awt.dnd.DropTarget
import java.awt.dnd.DropTargetAdapter
import java.awt.dnd.DropTargetDropEvent

fun main() = singleWindowApplication {
    LaunchedEffect(Unit) {
        window.dropTarget = DropTarget().apply {
            addDropTargetListener(object : DropTargetAdapter() {
                override fun drop(event: DropTargetDropEvent) {
                    event.acceptDrop(DnDConstants.ACTION_COPY)
                    val fileName = event.transferable.getTransferData(DataFlavor.javaFileListFlavor)
                    println(fileName)
                }
            })
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="LaunchedEffect(Unit) { window.dropTarget = DropTarget().apply"}

如果您需要使用由 Swing 实现的对话框，可以将其包装到可组合函数中：

```kotlin
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.window.AwtWindow
import androidx.compose.ui.window.application
import java.awt.FileDialog
import java.awt.Frame

fun main() = application {
    var isOpen by remember { mutableStateOf(true) }

    if (isOpen) {
        FileDialog(
            onCloseRequest = {
                isOpen = false
                println("Result $it")
            }
        )
    }
}

@Composable
private fun FileDialog(
    parent: Frame? = null,
    onCloseRequest: (result: String?) -> Unit
) = AwtWindow(
    create = {
        object : FileDialog(parent, "Choose a file", LOAD) {
            override fun setVisible(value: Boolean) {
                super.setVisible(value)
                if (value) {
                    onCloseRequest(file)
                }
            }
        }
    },
    dispose = FileDialog::dispose
)
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="@Composable private fun FileDialog( parent: Frame? = null, "}

## 窗口与对话框 API v2
<primary-label ref="Experimental"/>

[//]: # (TODO update version for stable release)

从 Compose Multiplatform 1.12.0-beta02 开始，重新设计的 `WindowState` 和 `DialogState` 类可在 `androidx.compose.ui.window.v2` 子包中使用。

v2 窗口和对话框 API 将请求状态与观察窗口管理器实际应用的状态分离开来。
它还解锁了以前无法实现的场景，例如根据内容的首选尺寸设置窗口大小，同时在窗口变大时仍允许内容扩展（通过 `fillMaxSize()` 等修饰符）。
有关详细信息，请参阅[指定尺寸](#specify-size)。

v2 API 与本页其余部分描述的现有 API 并存，因此您可以按照自己的节奏迁移各个窗口。

### 指定并观察状态

v2 API 显式地将指定所需状态与观察实际状态分离开来。

要指定窗口的初始状态，请将 provider 传递给 `rememberWindowState()`：

```kotlin
import androidx.compose.material.Text
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.application
import androidx.compose.ui.window.v2.Window
import androidx.compose.ui.window.v2.WindowBoundsProvider
import androidx.compose.ui.window.v2.WindowPositionProvider
import androidx.compose.ui.window.v2.WindowSizeProvider
import androidx.compose.ui.window.v2.rememberWindowState

@OptIn(ExperimentalComposeUiApi::class)
fun main() = application {
    val windowState = rememberWindowState(
        initialBoundsProvider = WindowBoundsProvider(
            positionProvider = WindowPositionProvider.CenteredOnScreen,
            sizeProvider = WindowSizeProvider.Fixed(DpSize(400.dp, 200.dp))
        )
    )

    Window(
        onCloseRequest = ::exitApplication,
        state = windowState,
    ) {
        Text("Hello, World!", fontSize = 48.sp)
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="val windowState = rememberWindowState(initialBoundsProvider = WindowBoundsProvider("}

要在创建窗口后请求状态更改，请调用 `WindowState` 上的相应方法。
您可以直接指定确切的尺寸和位置：

```kotlin
windowState.requestScreen { defaultScreen }
windowState.requestSize(DpSize(1024.dp, 768.dp))
windowState.requestPosition(DpOffset(100.dp, 100.dp))
```

对于相对定位或动态计算维度，请使用 provider：

```kotlin
windowState.requestBounds(
    WindowBoundsProvider(
        positionProvider = WindowPositionProvider.CenteredOnScreen,
        sizeProvider = WindowSizeProvider.Fixed(DpSize(1024.dp, 768.dp))
    )
)
```

应用请求是异步的。窗口系统可能会调整请求的状态，且实际状态稍后可能会更改，例如在您移动窗口或调整窗口大小时。
通过 `WindowState.screenId` 和 `WindowState.bounds` 观察窗口的实际状态：

```kotlin
if (windowState.isInitialized) {
    Text("Current screen: ${windowState.screenId}")
    Text("Current bounds: ${windowState.bounds}")
}
```

同样的异步模型也可通过 `DialogState` 和 `rememberDialogState()` 用于对话框。

### 选择屏幕

您可以通过向 `rememberWindowState()` 传递 `initialScreenProvider` 或稍后调用 `WindowState.requestScreen()` 来请求窗口应出现的屏幕。
窗口实际放置的屏幕可以通过 `WindowState.screenId` 观察。

例如，您可以请求将窗口放置在可用宽度至少为 `1024.dp` 的屏幕上，否则回退到默认屏幕：

```kotlin
windowState.requestScreen {
    screens.firstOrNull { it.availableBounds.width >= 1024.dp }
        ?: defaultScreen
}
```

### 指定位置

要更改窗口位置，请向 `rememberWindowState()` 传递 `initialBoundsProvider` 或稍后调用 `WindowState.requestBounds()`。
窗口的实际边界可以通过 `WindowState.bounds` 观察。

v2 API 使用 `WindowPositionProvider` 获取有关屏幕和父窗口几何形状的信息。

对于标准放置，您可以使用内置属性：

* `Default` 应用操作系统的标准层叠行为。
* `Current` 保持窗口的当前位置。
* `CenteredOnScreen` 使窗口在屏幕内居中。
* `CenteredInParentWindow` 使窗口在父窗口内居中。

为了获得更多控制，请使用位置 provider 函数：

* `Absolute()` 将窗口起始角放置在指定的 `x` 和 `y` 坐标处。
* `AlignedToScreen()` 相对于屏幕对齐窗口，并包含可选的偏移量参数。
    ```kotlin
    WindowPositionProvider.AlignedToScreen(
        alignment = Alignment.Center,
        offset = DpOffset(x = 16.dp, y = 16.dp)
    )
    ```
* `AlignedToParentWindow()` 将窗口锚定到父窗口，通常对对话框很有用。
    ```kotlin
    WindowPositionProvider.AlignedToParentWindow(
        // 锚定到父窗口的起始角
        anchor = Alignment.TopStart,
        // 应用相对于锚点的对齐方式
        alignment = Alignment.Center
    )
    ```

### 指定尺寸

尺寸也是窗口边界的一部分，因此它通过相同的 `initialBoundsProvider`/`WindowState.requestBounds()` 机制进行配置。

v2 API 使用 `WindowSizeProvider` 获取有关屏幕和父窗口大小的信息，以及查询窗口内容以获取其固有尺寸。

常见的内置选项包括用于特定窗口大小的 `Fixed()` 和用于标准 800×600 dp 大小的 `Default`。

对于自定义大小，`WindowSizeProvider()` lambda 可以访问屏幕指标，对于对话框，还可以访问父窗口指标：

```kotlin
WindowSizeProvider {
    val height = parentWindowMetrics!!.bounds.height
    DpSize(300.dp, height)
}
```

v2 API 实现了一个常见的需求场景：
根据内容的首选尺寸设置窗口大小，同时在用户将窗口调大时仍允许内容填充窗口。
`WindowSizeProvider.Unconstrained` 会计算内容的尺寸，加上窗口边距 (insets)，并将结果限制在可用屏幕尺寸内。
由于尺寸设置与布局是解耦的，如果用户调整窗口大小，使用 `fillMaxSize()` 的内容仍会扩展以填充窗口。

```kotlin
WindowBoundsProvider(
    positionProvider = WindowPositionProvider.CenteredOnScreen,
    sizeProvider = WindowSizeProvider.Unconstrained
)
```

v2 版本的 `Window()` 和 `DialogWindow()` 可组合项接受 `minSize` 和 `maxSize` 参数。
在底层窗口管理器支持的情况下，用户将无法调整窗口大小超出这些边界：

```kotlin
DialogWindow(
    onCloseRequest = { showDialog = false },
    state = dialogState,
    minSize = DpSize(250.dp, 250.dp),
    maxSize = DpSize(500.dp, 500.dp)
) {
    // ...
}
```

## 下一步

探索关于[其他桌面组件](compose-desktop-components.md)的教程。