[//]: # (title: 捲軸)

您可以將捲軸套用到可捲動的組建。捲軸與可捲動組建共用同一個狀態，以便彼此同步。

> 提供的每個程式碼片段都是一個可執行的桌面應用程式。若要嘗試：
> 1. 使用 [Kotlin Multiplatform IDE 外掛程式](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform) 或 [線上精靈](https://kmp.jetbrains.com/?android=true&desktop=true&includeTests=false) 建立一個 Compose Multiplatform 專案。
> 2. 開啟桌面進入點檔案。例如：`desktopApp/src/main/kotlin/com/example/my_desktop_app/main.kt`。
> 3. 將其內容替換為下方的程式碼片段。
>
{style="note" id="desktop-snippets-intro"}

## 捲動修飾符

`verticalScroll` 與 `horizontalScroll` 修飾符提供了最簡單的方法，讓使用者可以在內容邊界大於其最大尺寸限制時捲動元素。
您可以將 `VerticalScrollbar` 可組合項附加到具有 `verticalScroll` 修飾符的可捲動組建，並將 `HorizontalScrollbar` 可組合項附加到具有 `horizontalScroll` 修飾符的可捲動組建：

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

您可以透過拖曳捲軸列並使用滑鼠滾輪或觸控板來移動捲軸。若要使用滑鼠移動水平捲軸，請側向點擊滾輪或按住 <shortcut>Shift 鍵</shortcut>。

<img src="compose-desktop-scrollbar.animated.gif" alt="Scrollbar" width="289" preview-src="compose-desktop-scrollbar.png"/>

## Lazy 可捲動組建

您也可以在 `LazyColumn` 與 `LazyRow` 等 Lazy 可捲動組建中使用捲軸。當您預期清單中有很多項目時，Lazy 組建會更有效率，因為它們僅在需要時才組成項目。

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

目前，使用觸控螢幕、觸控板和追蹤板進行捲動會被視為滑鼠事件，這可能會導致故障以及缺乏兩指撥動縮放 (pinch-to-zoom) 等限制。我們正在持續改進輸入與手勢處理，並計劃為這些輸入裝置引進原生支援：

* 原生支援觸控螢幕 ([CMP-1609](https://youtrack.jetbrains.com/issue/CMP-1609/))
* 原生支援觸控板與追蹤板 ([CMP-1610](https://youtrack.jetbrains.com/issue/CMP-1610/))

## 下一步？

探索關於 [其他桌面組建](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop) 的教學。