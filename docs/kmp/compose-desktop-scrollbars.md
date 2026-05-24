[//]: # (title: 滚动条)

你可以将滚动条应用于可滚动组件。滚动条与可滚动组件共享公共状态，以实现相互同步。

> 每个提供的代码片段都是一个可运行的桌面应用。要试用它：
> 1. 使用 [Kotlin Multiplatform IDE 插件](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform) 或 [在线向导](https://kmp.jetbrains.com/?android=true&desktop=true&includeTests=false) 创建一个 Compose Multiplatform 项目。
> 2. 打开桌面入口文件。例如：`desktopApp/src/main/kotlin/com/example/my_desktop_app/main.kt`。
> 3. 将其内容替换为下面的代码片段。
>
{style="note" id="desktop-snippets-intro"}

## 滚动修饰符

`verticalScroll` 和 `horizontalScroll` 修饰符提供了最简单的方法，允许用户在元素内容边界大于其最大尺寸约束时进行滚动。
你可以将 `VerticalScrollbar` 可组合项附加到带有 `verticalScroll` 修饰符的可滚动组件，将 `HorizontalScrollbar` 可组合项附加到带有 `horizontalScroll` 修饰符的可滚动组件：

```kotlin
import androidx.compose.foundation.HorizontalScrollbar
import androidx.compose.foundation.VerticalScrollbar
import androidx.compose.foundation.background
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.rememberScrollbarAdapter
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.WindowState
import androidx.compose.ui.window.singleWindowApplication

fun main() = singleWindowApplication(
    title = "Scrollbars",
    state = WindowState(width = 300.dp, height = 310.dp)
) {
    Box(
        modifier = Modifier.fillMaxSize()
            .background(color = Color(180, 180, 180))
            .padding(10.dp)
    ) {
        val stateVertical = rememberScrollState(0)
        val stateHorizontal = rememberScrollState(0)

        Box(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(stateVertical)
                .padding(end = 12.dp, bottom = 12.dp)
                .horizontalScroll(stateHorizontal)
        ) {
            Column {
                for (item in 0..30) {
                    TextBox("Item #$item")
                    if (item < 30) {
                        Spacer(modifier = Modifier.height(5.dp))
                    }
                }
            }
        }
        VerticalScrollbar(
            modifier = Modifier.align(Alignment.CenterEnd)
                .fillMaxHeight(),
            adapter = rememberScrollbarAdapter(stateVertical)
        )
        HorizontalScrollbar(
            modifier = Modifier.align(Alignment.BottomStart)
                .fillMaxWidth()
                .padding(end = 12.dp),
            adapter = rememberScrollbarAdapter(stateHorizontal)
        )
    }
}

@Composable
fun TextBox(text: String = "Item") {
    Box(
        modifier = Modifier.height(32.dp)
            .width(400.dp)
            .background(color = Color(0, 0, 0, 20))
            .padding(start = 10.dp),
        contentAlignment = Alignment.CenterStart
    ) {
        Text(text = text)
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="VerticalScrollbar(modifier = Modifier.align(Alignment.CenterEnd) "}

你可以通过拖动滑块并使用鼠标滚轮或触控板来移动滚动条。若要使用鼠标移动水平滚动条，请侧击滚轮或按住 <shortcut>Shift 键</shortcut>。

<img src="compose-desktop-scrollbar.animated.gif" alt="Scrollbar" width="289" preview-src="compose-desktop-scrollbar.png"/>

## 延迟加载的可滚动组件

你也可以将滚动条与 `LazyColumn` 和 `LazyRow` 等延迟加载的可滚动组件配合使用。
当你预估列表中会有大量项目时，延迟加载组件会更加高效，因为它们仅在需要时才对项目进行组合。

```kotlin
import androidx.compose.foundation.VerticalScrollbar
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.rememberScrollbarAdapter
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import androidx.compose.ui.window.rememberWindowState

fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        title = "Scrollbars",
        state = rememberWindowState(width = 300.dp, height = 310.dp)
    ) {
        LazyScrollable()
    }
}

@Composable
fun LazyScrollable() {
    Box(
        modifier = Modifier.fillMaxSize()
            .background(color = Color(180, 180, 180))
            .padding(10.dp)
    ) {
        val state = rememberLazyListState()

        LazyColumn(Modifier.fillMaxSize().padding(end = 12.dp), state) {
            items(1000) { x ->
                TextBox("Item #$x")
                Spacer(modifier = Modifier.height(5.dp))
            }
        }
        VerticalScrollbar(
            modifier = Modifier.align(Alignment.CenterEnd).fillMaxHeight(),
            adapter = rememberScrollbarAdapter(
                scrollState = state
            )
        )
    }
}

@Composable
fun TextBox(text: String = "Item") {
    Box(
        modifier = Modifier.height(32.dp)
            .fillMaxWidth()
            .background(color = Color(0, 0, 0, 20))
            .padding(start = 10.dp),
        contentAlignment = Alignment.CenterStart
    ) {
        Text(text = text)
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="VerticalScrollbar(modifier = Modifier.align(Alignment.CenterEnd) "}

<img src="compose-desktop-lazy-scrollbar.animated.gif" alt="Lazy scrollbar" width="289" preview-src="compose-desktop-lazy-scrollbar.png"/>

## 已知限制

目前，使用触摸屏、触控板和轨迹板进行的滚动被视为鼠标事件，这可能会导致一些瑕疵和限制（例如缺乏捏合缩放功能）。我们正在不断改进输入和手势处理，并计划为这些输入设备引入原生支持：

* 原生支持触摸屏 ([CMP-1609](https://youtrack.jetbrains.com/issue/CMP-1609/))
* 原生支持触控板和轨迹板 ([CMP-1610](https://youtrack.jetbrains.com/issue/CMP-1610/))

## 下一步

探索关于 [其他桌面组件](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop) 的教程。