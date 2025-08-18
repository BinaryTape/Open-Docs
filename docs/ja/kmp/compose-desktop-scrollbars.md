[//]: # (title: スクロールバー)

スクロール可能なコンポーネントにスクロールバーを適用できます。スクロールバーとスクロール可能なコンポーネントは、互いに同期するために共通のステートを共有します。

## スクロール修飾子

`verticalScroll` および `horizontalScroll` 修飾子は、コンテンツの境界が最大サイズ制約よりも大きい場合に、ユーザーが要素をスクロールできるようにする最も簡単な方法を提供します。
`verticalScroll` 修飾子を持つスクロール可能なコンポーネントには `VerticalScrollbar` コンポーザブルを、`horizontalScroll` 修飾子を持つスクロール可能なコンポーネントには `HorizontalScrollbar` コンポーザブルをアタッチできます。

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

スクロールバーは、バーをドラッグしたり、マウスホイールやタッチパッドを使用したりして移動できます。マウスで水平スクロールバーを移動するには、ホイールをサイドクリックするか、<shortcut>Shift</shortcut> キーを押したままにします。

<img src="compose-desktop-scrollbar.animated.gif" alt="スクロールバー" width="289" preview-src="compose-desktop-scrollbar.png"/>

## Lazyスクロール可能なコンポーネント

`LazyColumn` や `LazyRow` のようなLazyスクロール可能なコンポーネントでもスクロールバーを使用できます。
Lazyコンポーネントは、リストに多数のアイテムが予想される場合に、必要に応じてのみアイテムをコンポーズするため、はるかに効率的です。

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

<img src="compose-desktop-lazy-scrollbar.animated.gif" alt="Lazyスクロールバー" width="289" preview-src="compose-desktop-lazy-scrollbar.png"/>

## 既知の制限事項

現在、タッチスクリーン、タッチパッド、トラックパッドを使用したスクロールはマウスイベントとして扱われるため、グリッチやピンチイン・ピンチアウトの欠如などの制限が発生する可能性があります。弊社では入力とジェスチャーのハンドリングを継続的に改善しており、これらの入力デバイスのネイティブサポートを導入する予定です。

*   タッチスクリーンをネイティブでサポートする ([CMP-1609](https://youtrack.jetbrains.com/issue/CMP-1609/))
*   タッチパッドとトラックパッドをネイティブでサポートする ([CMP-1610](https://youtrack.jetbrains.com/issue/CMP-1610/))

## 次のステップ

[他のデスクトップコンポーネントに関するチュートリアル] (https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop) を探索してください。