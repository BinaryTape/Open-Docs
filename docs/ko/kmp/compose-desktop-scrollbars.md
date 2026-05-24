[//]: # (title: 스크롤바(Scrollbars))

스크롤 가능한 컴포넌트에 스크롤바를 적용할 수 있습니다. 스크롤바와 스크롤 가능한 컴포넌트는 서로 동기화하기 위해 공통 상태(state)를 공유합니다.

> 제공된 각 코드 스니펫은 실행 가능한 데스크톱 앱입니다. 이를 시도해 보려면:
> 1. [Kotlin Multiplatform IDE 플러그인](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform) 또는 [온라인 마법사](https://kmp.jetbrains.com/?android=true&desktop=true&includeTests=false)를 사용하여 Compose Multiplatform 프로젝트를 생성하세요.
> 2. 데스크톱 진입점(entry-point) 파일을 엽니다. 예를 들어, `desktopApp/src/main/kotlin/com/example/my_desktop_app/main.kt`입니다.
> 3. 해당 파일의 내용을 아래의 스니펫으로 교체하세요.
>
{style="note" id="desktop-snippets-intro"}

## 스크롤 수정자(Scroll modifiers)

`verticalScroll` 및 `horizontalScroll` 수정자는 콘텐츠의 범위(bounds)가 최대 크기 제약 조건보다 클 때 사용자가 요소를 스크롤할 수 있게 하는 가장 간단한 방법을 제공합니다.
`verticalScroll` 수정자가 있는 스크롤 가능 컴포넌트에는 `VerticalScrollbar` 컴포저블을, `horizontalScroll` 수정자가 있는 스크롤 가능 컴포넌트에는 `HorizontalScrollbar` 컴포저블을 연결할 수 있습니다:

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

바를 드래그하거나 마우스 휠 또는 터치패드를 사용하여 스크롤바를 이동할 수 있습니다. 마우스로 가로 스크롤바를 이동하려면 휠을 측면 클릭하거나 <shortcut>Shift</shortcut> 키를 누른 상태로 조작하세요.

<img src="compose-desktop-scrollbar.animated.gif" alt="Scrollbar" width="289" preview-src="compose-desktop-scrollbar.png"/>

## Lazy 스크롤 가능 컴포넌트(Lazy scrollable components)

`LazyColumn` 및 `LazyRow`와 같은 Lazy 스크롤 가능 컴포넌트에서도 스크롤바를 사용할 수 있습니다.
Lazy 컴포넌트는 항목이 필요할 때만 구성(compose)하므로 목록에 많은 항목이 예상될 때 훨씬 더 효율적입니다.

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

## 알려진 제한 사항(Known limitations)

현재 터치스크린, 터치패드 및 트랙패드를 이용한 스크롤은 마우스 이벤트로 처리되어, 글리치(glitch)가 발생하거나 핀치 투 줌(pinch-to-zoom) 기능 부재와 같은 제한 사항이 있을 수 있습니다. 저희는 입력 및 제스처 처리를 지속적으로 개선하고 있으며, 이러한 입력 장치에 대한 네이티브 지원을 도입할 계획입니다:

* 터치스크린 네이티브 지원 ([CMP-1609](https://youtrack.jetbrains.com/issue/CMP-1609/))
* 터치패드 및 트랙패드 네이티브 지원 ([CMP-1610](https://youtrack.jetbrains.com/issue/CMP-1610/))

## 다음 단계

[다른 데스크톱 컴포넌트](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop)에 대한 튜토리얼을 살펴보세요.