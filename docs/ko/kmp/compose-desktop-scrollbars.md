[//]: # (title: 스크롤바)

스크롤 가능한 컴포넌트에 스크롤바를 적용할 수 있습니다. 스크롤바와 스크롤 가능한 컴포넌트는 서로 동기화하기 위해 공통 상태를 공유합니다.

## 스크롤 수정자

`verticalScroll` 및 `horizontalScroll` 수정자는 내용의 경계가 최대 크기 제약보다 클 때 사용자가 요소를 스크롤할 수 있도록 하는 가장 간단한 방법을 제공합니다.
`verticalScroll` 수정자가 적용된 스크롤 가능한 컴포넌트에는 `VerticalScrollbar` 컴포저블을, `horizontalScroll` 수정자가 적용된 스크롤 가능한 컴포넌트에는 `HorizontalScrollbar` 컴포저블을 연결할 수 있습니다.

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

스크롤바는 바를 드래그하거나 마우스 휠 또는 터치패드를 사용하여 이동할 수 있습니다. 마우스로 가로 스크롤바를 이동하려면 휠을 옆으로 클릭하거나 <shortcut>Shift</shortcut> 키를 누릅니다.

<img src="compose-desktop-scrollbar.animated.gif" alt="Scrollbar" width="289" preview-src="compose-desktop-scrollbar.png"/>

## 레이지 스크롤 가능한 컴포넌트

`LazyColumn` 및 `LazyRow`와 같은 레이지 스크롤 가능한 컴포넌트에서도 스크롤바를 사용할 수 있습니다.
레이지 컴포넌트는 필요한 경우에만 항목을 구성하기 때문에 목록에 많은 항목이 있을 것으로 예상할 때 훨씬 더 효율적입니다.

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

## 알려진 제한 사항

현재 터치스크린, 터치패드, 트랙패드를 사용한 스크롤링은 마우스 이벤트로 처리되며, 이로 인해 결함 및 핀치 투 줌(pinch-to-zoom) 기능의 부재와 같은 제한 사항이 발생할 수 있습니다. 당사는 입력 및 제스처 처리를 지속적으로 개선하고 있으며, 이러한 입력 장치에 대한 기본 지원을 도입할 계획입니다.

*   터치스크린 기본 지원 ([CMP-1609](https://youtrack.jetbrains.com/issue/CMP-1609/))
*   터치패드 및 트랙패드 기본 지원 ([CMP-1610](https://youtrack.jetbrains.com/issue/CMP-1610/))

## 다음 단계는?

[다른 데스크톱 컴포넌트](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop)에 대한 튜토리얼을 살펴보세요.