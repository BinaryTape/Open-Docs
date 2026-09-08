[//]: # (title: トップレベルウィンドウの管理)

<web-summary>Compose Multiplatform for desktop でトップレベルウィンドウを管理する方法を学びます。ウィンドウの作成とカスタマイズ、システムトレイへの格納、ダイアログの使用について説明します。</web-summary>

Compose Multiplatform for desktop は、ウィンドウを管理するためのさまざまな機能を提供します。ウィンドウをシステムトレイに格納したり、ドラッグ可能にしたり、サイズの調整、位置の変更などを行うことができます。

新しく実験的な [ウィンドウとダイアログ API v2](#ウィンドウとダイアログ-api-v2) も参照してください。

undefined

## ウィンドウを開く・閉じる {id="open-and-close-windows"}

`Window()` 関数を使用して、通常のウィンドウを作成できます。コンポーザブルなスコープに配置するには、`application` エントリーポイント内で `Window()` を使用します。

```kotlin
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application

fun main() = application {
    Window(onCloseRequest = ::exitApplication) {
        // ウィンドウのコンテンツ
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="application { Window(onCloseRequest = ::exitApplication)"}

コンポーザブル関数として、`Window()` はそのプロパティを宣言的に変更できます。たとえば、あるタイトルでウィンドウを開き、後でそのタイトルを変更することができます。

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

### 条件の追加 {id="add-conditions"}

単純な `if` 条件を使用してウィンドウを開いたり閉じたりすることもできます。次のコードサンプルでは、タスクの完了後にアプリケーションウィンドウが自動的に閉じられます。

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
        // 重い処理を実行する
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

### 終了時の確認の追加 {id="ask-for-confirmation-on-close"}

アプリケーションの終了時にダイアログを表示するなど、カスタムロジックを使用したい場合は、`onCloseRequest` コールバックを使用して終了アクションをオーバーライドできます。
次のコードサンプルでは、命令的なアプローチ (`window.close()`) の代わりに宣言的なアプローチを使用し、状態の変化 (`isOpen = false`) に応じてウィンドウを閉じています。

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

## シングルウィンドウアプリケーションの作成 {id="create-a-single-window-application"}

1 つのトップレベルウィンドウを持つシンプルなアプリケーションの場合、`Window()` コンポーザブルを含む完全な `application` エントリーポイントは必要ありません。`singleWindowApplication()` 関数がそれら両方を 1 つの呼び出しにラップします。

```kotlin
import androidx.compose.ui.window.singleWindowApplication

fun main() = singleWindowApplication {
    // ウィンドウのコンテンツ
}
```

2 つ以上のトップレベルウィンドウ、カスタムの終了ロジック、または実行時におけるウィンドウ属性の変更が必要な場合は、`application` エントリーポイント内で [`Window()` コンポーザブル](#ウィンドウを開く・閉じる) を使用してください。

## ウィンドウの状態の管理 {id="manage-window-state"}

`WindowState` クラスは、ウィンドウの配置（placement）、現在の位置、およびサイズを保持します。
配置（placement）属性を使用すると、ウィンドウを画面上でどのように配置するかを指定できます（フローティング、最大化/最小化、またはフルスクリーン）。
状態が変更されると、自動的に再コンポジション（recomposition）がトリガーされます。ウィンドウの状態を変更するには、コールバックを使用するか、コンポーザブル内でそれを監視します。

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

### コンテンツに応じたウィンドウサイズ {id="adapt-window-size-to-its-content"}

事前に寸法を指定せずにコンテンツに基づいてウィンドウのサイズを決定するには、ウィンドウの寸法の片方または両方を `Dp.Unspecified` に設定します。
Compose Multiplatform は、コンテンツに合わせてウィンドウの初期サイズを自動的に調整します。

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

### 状態の変化をリッスンする {id="listen-to-state-changes"}

状態の変化に反応して、その値を（例えばデータベースに書き込むなど）非コンポーザブルなアプリケーション層に送る必要がある場合は、`snapshotFlow()` 関数を使用できます。この関数は、コンポーザブルの状態の現在の値をキャプチャします。

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

## 複数のウィンドウを扱う {id="manage-multiple-windows"}

複数のウィンドウを管理するには、アプリケーションの状態用に別のクラスを作成し、`mutableStateListOf` の変更に応じてウィンドウを開いたり閉じたりすることができます。

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

より複雑な例については、[Code Viewer](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/codeviewer) サンプルを参照してください。

## ダイアログの表示 {id="show-dialogs"}

`DialogWindow()` コンポーザブルを使用して、独自のタイトルバーを持つ別の OS レベルのウィンドウを表示できます。これは、確認、ファイルピッカー、またはユーザーが続行する前に完了しなければならない操作に役立ちます。

実験的な `modalityType` パラメータを使用して、ダイアログが他のウィンドウとの対話をブロックするかどうかを制御できます。`DialogModalityType` のいずれかの値を設定します。

* `Modeless`: 他のどのウィンドウもブロックしません。
* `DocumentModal`: 親のトップレベルウィンドウと、そのダイアログ自身の子孫を除く、それに付随する他のウィンドウをブロックします。
* `ApplicationModal`: 同じアプリケーション内の他のすべてのウィンドウをブロックします。

> 現在のウィンドウ内に留まるオーバーレイ UI（ドロップダウン、ツールチップ、カスタムオーバーレイ）には、マルチプラットフォームの [Popup()](compose-popups.md) コンポーザブルを使用してください。
>
{style="tip"}

次のコードサンプルは、通常のウィンドウと `ApplicationModal` ダイアログを組み合わせています。

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

// 実験的な modalityType を有効にする
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

## ウィンドウをシステムトレイに格納する {id="hide-windows-to-the-system-tray"}

デフォルトでは、ウィンドウを閉じるとアプリケーションが終了します。代わりにウィンドウをシステムトレイやメニューバーに隠すには、`onCloseRequest` をインターセプトしてウィンドウの可視性（visibility）状態を変更します。

次の例では、ウィンドウを閉じると `isVisible` が `false` に設定され、ウィンドウが非表示になり、システムトレイアイコンが表示されます。トレイアイコンをクリックすると、ウィンドウが復元されます。

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
        // アプリを終了する代わりにウィンドウを非表示にする
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

## ドラッグ可能なウィンドウ領域 {id="make-window-areas-draggable"}

装飾なし（undecorated）のウィンドウにカスタムのドラッグ可能なタイトルバーを追加したり、ウィンドウ全体をドラッグ可能にしたりするには、`WindowDraggableArea()` コンポーザブルを使用できます。

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

`WindowDraggableArea()` は、`singleWindowApplication()`、`Window()`、および `DialogWindow()` コンポーザブル内でのみ使用できます。別のコンポーザブル関数で呼び出すには、レシーバースコープとして `WindowScope` を使用します。

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

## 透明なウィンドウの作成 {id="create-transparent-windows"}

透明なウィンドウを作成するには、`Window()` 関数に `transparent=true` と `undecorated=true` の 2 つのパラメータを渡します。透明なウィンドウを装飾することはできないため、ウィンドウは `undecorated`（装飾なし）である必要があります。

次のコードサンプルは、コンポーザブルを組み合わせて角の丸い透明なウィンドウを作成する方法を示しています。

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
            // 透明なウィンドウは装飾なしである必要があります
            undecorated = true, 
        ) {
            Surface(
                modifier = Modifier.fillMaxSize().padding(5.dp).shadow(3.dp, RoundedCornerShape(20.dp)), 
                color = Color.Transparent,
                // 角の丸いウィンドウ
                shape = RoundedCornerShape(20.dp) 
            ) {
                Text("Hello World!", color = Color.White)
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Modifier.fillMaxSize().padding(5.dp).shadow(3.dp, RoundedCornerShape(20.dp))"}

## Swing コンポーネントの使用 {id="use-swing-components"}

Compose Multiplatform for desktop は内部で Swing を使用しているため、Swing を直接使用してウィンドウを作成することもできます。

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
            // ウィンドウのコンテンツ
        }
        isVisible = true
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="SwingUtilities.invokeLater { ComposeWindow().apply {"}

また、`Window()` コンポーザブルのスコープを使用することもできます。次のコードサンプルにおいて、`window` は `Window()` 内で作成された `ComposeWindow` です。

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

Swing で実装されたダイアログを使用する必要がある場合は、それをコンポーザブル関数にラップできます。

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

## ウィンドウとダイアログ API v2 {id="window-and-dialog-api-v2"}
<primary-label ref="Experimental"/>

Compose Multiplatform 1.12.0 から、再設計された `WindowState` および `DialogState` クラスが `androidx.compose.ui.window.v2` サブパッケージで利用可能になりました。

v2 ウィンドウおよびダイアログ API は、状態のリクエストと、ウィンドウマネージャーによって実際に適用された状態の監視を分離します。また、以前は不可能だったシナリオ、たとえばウィンドウをコンテンツの優先サイズに合わせつつ、ウィンドウがより大きい場合にはコンテンツを（`fillMaxSize()` などの修飾子を介して）拡張させる、といったことが可能になります。詳細は [サイズの指定](#サイズの指定) を参照してください。

v2 API は、このページの残りの部分で説明されている既存の API と併用できるため、独自のペースで個々のウィンドウを移行できます。

### 状態の指定と監視 {id="specify-and-observe-state"}

v2 API は、望ましい状態の指定と、実際の状態の監視を明示的に分離します。

ウィンドウの初期状態を指定するには、`rememberWindowState()` にプロバイダーを渡します。

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

ウィンドウ作成後に状態の変更をリクエストするには、`WindowState` の対応するメソッドを呼び出します。正確なサイズと位置を直接指定できます。

```kotlin
windowState.requestScreen { defaultScreen }
windowState.requestSize(DpSize(1024.dp, 768.dp))
windowState.requestPosition(DpOffset(100.dp, 100.dp))
```

相対的な配置や寸法の動的な計算には、プロバイダーを使用します。

```kotlin
windowState.requestBounds(
    WindowBoundsProvider(
        positionProvider = WindowPositionProvider.CenteredOnScreen,
        sizeProvider = WindowSizeProvider.Fixed(DpSize(1024.dp, 768.dp))
    )
)
```

リクエストの適用は非同期です。ウィンドウシステムがリクエストされた状態を調整する場合があり、実際の状態は、たとえばウィンドウを移動またはリサイズしたときなどに後で変更される可能性があります。
ウィンドウの実際の状態は、`WindowState.screenId` および `WindowState.bounds` を介して監視してください。

```kotlin
if (windowState.isInitialized) {
    Text("Current screen: ${windowState.screenId}")
    Text("Current bounds: ${windowState.bounds}")
}
```

同様の非同期モデルは、`DialogState` および `rememberDialogState()` を介してダイアログでも利用可能です。

### 画面の選択 {id="choose-a-screen"}

ウィンドウが表示されるべき画面のリクエストは、`rememberWindowState()` に `initialScreenProvider` を渡すか、後で `WindowState.requestScreen()` を呼び出すことで行えます。
ウィンドウが実際に配置されている画面は、`WindowState.screenId` を介して監視可能です。

たとえば、利用可能な幅が少なくとも `1024.dp` ある画面にウィンドウを配置するようにリクエストし、見つからない場合はデフォルトの画面を使用するようにできます。

```kotlin
windowState.requestScreen {
    screens.firstOrNull { it.availableBounds.width >= 1024.dp }
        ?: defaultScreen
}
```

### 位置の指定 {id="specify-position"}

ウィンドウの位置を変更するには、`rememberWindowState()` に `initialBoundsProvider` を渡すか、後で `WindowState.requestBounds()` を呼び出します。
ウィンドウの実際の境界（bounds）は `WindowState.bounds` を介して監視可能です。

v2 API は `WindowPositionProvider` を使用して、画面および親ウィンドウのジオメトリに関する情報を取得します。

標準的な配置には、組み込みのプロパティを使用できます。

* `Default`: オペレーティングシステムの標準的なカスケード動作を適用します。
* `Current`: ウィンドウの現在の位置を維持します。
* `CenteredOnScreen`: 画面内の中央にウィンドウを配置します。
* `CenteredInParentWindow`: 親ウィンドウ内の中央にウィンドウを配置します。

より詳細な制御には、位置プロバイダー関数を使用します。

* `Absolute()`: 指定された `x` および `y` 座標にウィンドウの開始角を配置します。
* `AlignedToScreen()`: 画面に対してウィンドウを整列させ、オプションのオフセットパラメータを含めることができます。
    ```kotlin
    WindowPositionProvider.AlignedToScreen(
        alignment = Alignment.Center,
        offset = DpOffset(x = 16.dp, y = 16.dp)
    )
    ```
* `AlignedToParentWindow()`: ウィンドウを親ウィンドウに固定します。これは通常ダイアログに役立ちます。
    ```kotlin
    WindowPositionProvider.AlignedToParentWindow(
        // 親ウィンドウの開始角に固定
        anchor = Alignment.TopStart,
        // アンカーポイントに対するアライメントを適用
        alignment = Alignment.Center
    )
    ```

### サイズの指定 {id="specify-size"}

サイズの指定もウィンドウ境界（bounds）の一部であるため、同じ `initialBoundsProvider`/`WindowState.requestBounds()` の仕組みを通じて構成されます。

v2 API は `WindowSizeProvider` を使用して画面および親ウィンドウのサイズに関する情報を取得するほか、ウィンドウのコンテンツに対してその固有のサイズを照会します。

一般的な組み込みオプションには、特定のウィンドウサイズを指定する `Fixed()` や、標準の 800×600 dp サイズを指定する `Default` が含まれます。

カスタムサイズの場合、`WindowSizeProvider()` ラムダは画面メトリクスにアクセスでき、ダイアログの場合は親ウィンドウのメトリクスにもアクセスできます。

```kotlin
WindowSizeProvider {
    val height = parentWindowMetrics!!.bounds.height
    DpSize(300.dp, height)
}
```

v2 API は、よくリクエストされるシナリオを可能にします。
それは、ウィンドウのサイズをコンテンツの優先サイズに合わせつつ、ユーザーがウィンドウを大きくしたときにはコンテンツがウィンドウいっぱいに広がるように設定することです。
`WindowSizeProvider.Unconstrained` は、コンテンツのサイズを計算し、ウィンドウのインセットを追加し、その結果を利用可能な画面サイズで制限します。
サイズ指定はレイアウトから切り離されているため、`fillMaxSize()` を使用するコンテンツは、ユーザーがウィンドウをリサイズした場合でも、ウィンドウいっぱいに広がるように拡張されます。

```kotlin
WindowBoundsProvider(
    positionProvider = WindowPositionProvider.CenteredOnScreen,
    sizeProvider = WindowSizeProvider.Unconstrained
)
```

v2 バージョンの `Window()` および `DialogWindow()` コンポーザブルは、`minSize` および `maxSize` パラメータを受け取ります。
基盤となるウィンドウマネージャーがサポートしている場合、ユーザーはこれらの境界を超えてウィンドウをリサイズすることができなくなります。

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

## 次のステップ {id="what-s-next"}

[その他のデスクトップコンポーネント](compose-desktop-components.md) に関するチュートリアルをご覧ください。