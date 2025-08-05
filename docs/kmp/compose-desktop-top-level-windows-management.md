[//]: # (title: 顶层窗口管理)

Compose Multiplatform for desktop 提供了各种特性来管理窗口。你可以将窗口隐藏到托盘、使它们可拖拽、调整大小、改变位置等等。

## 打开和关闭窗口

你可以使用 `Window()` 函数来创建一个常规窗口。要将其放入可组合作用域中，请在 `application` 入口点中使用 `Window()`：

```kotlin
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application

fun main() = application {
    Window(onCloseRequest = ::exitApplication) {
        // Content of the window
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="application { Window(onCloseRequest = ::exitApplication)"}

作为一个可组合函数，`Window()` 允许你以声明式方式改变其属性。例如，你可以打开一个带标题的窗口，并稍后更改标题：

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

你也可以使用简单的 `if` 条件来打开和关闭窗口。在下面的代码示例中，应用程序窗口在完成一个任务后会自动关闭：

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
        // Do some heavy lifting
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

如果你想在应用程序退出时使用自定义逻辑，例如显示一个对话框，你可以使用 `onCloseRequest` 回调来覆盖关闭操作。
在下面的代码示例中，我们使用声明式方法而不是命令式方法（`window.close()`），并响应状态变化（`isOpen = false`）来关闭窗口。

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

## 处理多个窗口

如果一个应用程序有多个窗口，你可以为应用程序状态创建一个单独的类，并响应 `mutableStateListOf` 的变化来打开或关闭窗口：

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

关于更复杂的示例，请参见 [notepad](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/notepad) 示例。

## 将窗口最小化到系统托盘

要隐藏窗口而不是关闭它，你可以更改 `windowState.isVisible` 状态：

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

## singleWindowApplication() 函数

你可以通过调用 `singleWindowApplication()` 函数来创建一个单窗口应用程序。

`singleWindowApplication()` 函数更易于使用，但有以下限制：
* 应用程序只能有一个窗口。
* 你无法添加自定义关闭逻辑。
* 你无法在运行时更改窗口的属性。

```kotlin
import androidx.compose.ui.window.singleWindowApplication

fun main() = singleWindowApplication {
    // Content of the window
}
```

作为替代方案，你可以在 `application` 入口点中使用 [`Window()` 可组合项](#open-and-close-windows)。

## 自适应窗口大小

当你不知道预期内容的大小并且无法提前指定最佳窗口尺寸时，你可以将 `WindowSize` 的一个或两个维度设置为 `Dp.Unspecified`。Compose Multiplatform for desktop 将自动调整窗口的初始大小以适应内容：

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

## 更改窗口状态

`WindowState` 是一个单独的 API 类，用于窗口放置、当前位置和大小。`placement` 属性允许你指定窗口在屏幕上的放置方式：浮动、最大化/最小化或全屏。
状态的任何更改都会触发自动重组。要更改窗口状态，请使用回调或在可组合项中观察它：

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

## 监听窗口状态

如果你需要响应状态变化并将值发送到另一个非可组合的应用程序层，例如将其写入数据库，你可以使用 `snapshotFlow()` 函数。此函数会捕获可组合项状态的当前值。

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

## 对话框

你可以使用 `Window()` 可组合项来创建常规窗口，使用 `DialogWindow()` 可组合项来创建模态窗口，它会锁定其父级直到用户关闭模态窗口。

下面的代码示例演示了如何使用这些可组合项来组合常规窗口和模态窗口：

```kotlin
import androidx.compose.material.Button
import androidx.compose.material.Text
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.window.DialogWindow
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.WindowPosition
import androidx.compose.ui.window.application
import androidx.compose.ui.window.rememberDialogState

fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
    ) {
        var isDialogOpen by remember { mutableStateOf(false) }

        Button(onClick = { isDialogOpen = true }) {
            Text(text = "Open dialog")
        }

        if (isDialogOpen) {
            DialogWindow(
                onCloseRequest = { isDialogOpen = false },
                state = rememberDialogState(position = WindowPosition(Alignment.Center))
            ) {
                // Content of the window
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="if (isDialogOpen) { DialogWindow(onCloseRequest = { isDialogOpen = false },"}

## 可拖拽窗口区域

要为无装饰窗口添加自定义可拖拽标题栏或使整个窗口可拖拽，你可以使用 `WindowDraggableArea()` 可组合项：

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

`WindowDraggableArea()` 只能在 `singleWindowApplication()`、`Window()` 和 `DialogWindow()` 可组合项内部使用。要在另一个可组合函数中调用它，请使用 `WindowScope` 作为接收者作用域：

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

## 透明窗口及其他自定义

要创建透明窗口，请向 `Window()` 函数传递两个参数：`transparent=true` 和 `undecorated=true`。
窗口必须是无装饰的，因为无法装饰透明窗口。

下面的代码示例演示了如何组合可组合项来创建一个带圆角的透明窗口：

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
            // Transparent window must be undecorated
            undecorated = true, 
        ) {
            Surface(
                modifier = Modifier.fillMaxSize().padding(5.dp).shadow(3.dp, RoundedCornerShape(20.dp)), 
                color = Color.Transparent,
                // Window with rounded corners
                shape = RoundedCornerShape(20.dp) 
            ) {
                Text("Hello World!", color = Color.White)
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Modifier.fillMaxSize().padding(5.dp).shadow(3.dp, RoundedCornerShape(20.dp))"}

## Swing 互操作性

Compose Multiplatform for desktop 底层使用 Swing，因此你可以直接使用 Swing 创建窗口：

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
            // Content of the window
        }
        isVisible = true
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="SwingUtilities.invokeLater { ComposeWindow().apply {"}

你也可以使用 `Window()` 可组合项的作用域。在下面的代码示例中，`window` 是在 `Window()` 内部创建的一个 `ComposeWindow`：

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

如果你需要使用在 Swing 中实现的对话框，你可以将其包装到一个可组合函数中：

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

## 接下来

浏览关于 [其他桌面组件](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop) 的教程。