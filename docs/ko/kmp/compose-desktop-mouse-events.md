[//]: # (title: 마우스 이벤트 리스너)

데스크톱 프로젝트에서 클릭, 이동, 스크롤 또는 입력 영역 진입 및 이탈과 같은 다양한 마우스 이벤트를 수신할 수 있습니다.

## 클릭 리스너

클릭 리스너는 Android용 Compose Multiplatform과 데스크톱용 Compose Multiplatform 모두에서 사용할 수 있으므로, 코드가 두 플랫폼 모두에서 작동합니다.
예를 들어, `onClick`, `onDoubleClick`, `onLongClick` 수정자를 사용하여 간단한 클릭 리스너를 설정하는 방법은 다음과 같습니다.

```kotlin
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material.Text
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.singleWindowApplication

fun main() = singleWindowApplication(title = "Mouse clicks") {
    var count by remember { mutableIntStateOf(0) }
    Box(contentAlignment = Alignment.Center, modifier = Modifier.fillMaxWidth()) {
        var text by remember { mutableStateOf("Click magenta box!") }
        Column {
            @OptIn(ExperimentalFoundationApi::class)
            Box(modifier = Modifier
                .background(Color.Magenta)
                .fillMaxWidth(0.7f)
                .fillMaxHeight(0.7f)
                .combinedClickable(
                    onClick = {
                        text = "Click! ${count++}"
                    },
                    onDoubleClick = {
                        text = "Double click! ${count++}"
                    },
                    onLongClick = {
                        text = "Long click! ${count++}"
                    }
                )
            )
            Text(text = text, fontSize = 40.sp)
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Box(modifier = Modifier.combinedClickable(onClick = { text ="}

<img src="compose-mouse-click-listeners.animated.gif" alt="마우스 클릭 리스너" width="600" preview-src="compose-mouse-click-listeners.png"/>

`combinedClickable` 수정자는 기본 버튼(왼쪽 마우스 버튼)과 터치 이벤트만 지원합니다.
버튼을 다르게 처리해야 한다면 [`Modifier.onClick`](#experimental-onclick-handlers) 섹션을 참조하세요.

## 이동 리스너

> `onPointerEvent` 수정자는 [실험적](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)입니다. 옵트인이 필요하며(아래 세부 정보 참조),
> 평가 목적으로만 사용해야 합니다.
> [안정적인](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels) API를 사용하려면 [`Modifier.pointerInput`](#listening-for-raw-events-in-common-code-via-pointerinput)을 참조하세요.
>
{style="warning"}

마우스 포인터 위치에 따라 창의 배경색을 변경하는 포인터 이동 리스너를 생성하려면 다음 코드를 추가하세요.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.wrapContentSize
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.PointerEventType
import androidx.compose.ui.input.pointer.onPointerEvent
import androidx.compose.ui.window.singleWindowApplication

@OptIn(ExperimentalComposeUiApi::class)
fun main() = singleWindowApplication(title = "Mouse move listeners") {
    var color by remember { mutableStateOf(Color(0, 0, 0)) }
    Box(modifier = Modifier
        .wrapContentSize(Alignment.Center)
        .fillMaxSize()
        .background(color = color)
        .onPointerEvent(PointerEventType.Move) {
            val position = it.changes.first().position
            color = Color(position.x.toInt() % 256, position.y.toInt() % 256, 0)
        }
    )
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Box(modifier = Modifier.onPointerEvent(PointerEventType.Move) { color ="}

<img src="compose-mouse-move-listeners.animated.gif" alt="마우스 이동 리스너" width="600" preview-src="compose-mouse-move-listeners.png"/>

## 진입 리스너

> `onPointerEvent` 수정자는 [실험적](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)입니다. 옵트인이 필요하며(아래 세부 정보 참조),
> 평가 목적으로만 사용해야 합니다.
> [안정적인](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels) API를 사용하려면 [`Modifier.pointerInput`](#listening-for-raw-events-in-common-code-via-pointerinput)을 참조하세요.
>
{style="warning"}

데스크톱용 Compose Multiplatform은 포인터의 입력 영역 진입 및 이탈 핸들러를 지원합니다. 예를 들어, 다음 코드는 호버 시 줄의 글꼴 스타일을 변경합니다.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material.Text
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.PointerEventType
import androidx.compose.ui.input.pointer.onPointerEvent
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.singleWindowApplication

@OptIn(ExperimentalComposeUiApi::class)
fun main() = singleWindowApplication(title = "Mouse enter listeners") {
    Column(
        Modifier.background(Color.White),
        verticalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        repeat(10) { index ->
            var active by remember { mutableStateOf(false) }
            Text(modifier = Modifier
                .fillMaxWidth()
                .background(color = if (active) Color.Green else Color.White)
                .onPointerEvent(PointerEventType.Enter) { active = true }
                .onPointerEvent(PointerEventType.Exit) { active = false },
                fontSize = 30.sp,
                fontStyle = if (active) FontStyle.Italic else FontStyle.Normal,
                text = "Item $index",
                textAlign = TextAlign.Center
            )
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Text(modifier = Modifier.onPointerEvent(PointerEventType.Enter) { active ="}

<img src="compose-mouse-enter-listeners.animated.gif" alt="마우스 진입 리스너" width="600" preview-src="compose-mouse-enter-listeners.png"/>

## 스크롤 리스너

> `onPointerEvent` 수정자는 [실험적](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)입니다. 옵트인이 필요하며(아래 세부 정보 참조),
> 평가 목적으로만 사용해야 합니다.
> [안정적인](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels) API를 사용하려면 [`Modifier.pointerInput`](#listening-for-raw-events-in-common-code-via-pointerinput)을 참조하세요.
>
{style="warning"}

다음 코드 샘플은 마우스 스크롤 방향에 따라 표시되는 숫자를 증가시키거나 감소시키는 방법을 보여줍니다.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material.Text
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.pointer.PointerEventType
import androidx.compose.ui.input.pointer.onPointerEvent
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.singleWindowApplication

@OptIn(ExperimentalComposeUiApi::class)
fun main() = singleWindowApplication(title = "Mouse scroll listeners") {
    var number by remember { mutableFloatStateOf(0f) }
    Box(
        Modifier
            .fillMaxSize()
            .onPointerEvent(PointerEventType.Scroll) {
                number += it.changes.first().scrollDelta.y
            },
        contentAlignment = Alignment.Center
    ) {
        Text("Scroll to change the number: $number", fontSize = 30.sp)
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Box(Modifier.onPointerEvent(PointerEventType.Scroll) { number +="}

<img src="compose-mouse-scroll-listeners.animated.gif" alt="마우스 스크롤 리스너" width="600" preview-src="compose-mouse-scroll-listeners.png"/>

## 실험적 onClick 핸들러

> `onClick` 수정자는 [실험적](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)이며 데스크톱 프로젝트에서만 지원됩니다. 옵트인이 필요하며(아래 세부 정보 참조),
> 평가 목적으로만 사용해야 합니다.
>
{style="warning"}

`Modifier.onClick`는 클릭, 더블 클릭, 롱 클릭에 대한 독립적인 콜백을 제공합니다. 이는 포인터 이벤트에서 시작된 클릭만 처리하며, 별도로 접근성 `click` 이벤트를 처리하지 않습니다.

`matcher: PointerMatcher` 및 `keyboardModifiers: PointerKeyboardModifiers.() -> Boolean`를 사용하여 각 `onClick`이 특정 포인터 이벤트를 타겟팅하도록 구성할 수 있습니다.
* `matcher`를 사용하여 어떤 마우스 버튼이 클릭 이벤트를 트리거해야 하는지 선택할 수 있습니다.
* `keyboardModifiers`를 사용하면 지정된 키가 눌린 포인터 이벤트를 필터링할 수 있습니다.

또한 `matcher` 및 `keyboardModifiers`의 다른 조건을 사용하여 다른 클릭을 처리하기 위해 여러 `onClick` 수정자의 체인을 만들 수도 있습니다.
`clickable`과 달리 `onClick`에는 기본 `Modifier.indication` 및 `Modifier.semantics`가 없으며, <shortcut>Enter</shortcut>를 눌러도 클릭 이벤트를 트리거하지 않습니다. 필요한 경우 이러한 수정자들을 별도로 추가하세요.
이벤트의 올바른 전파를 보장하려면 가장 일반적인(`조건 수가 가장 적은`) `onClick` 핸들러를 다른 핸들러보다 먼저 선언해야 합니다.

```kotlin
import androidx.compose.animation.AnimatedContent
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.LocalIndication
import androidx.compose.foundation.PointerMatcher
import androidx.compose.foundation.background
import androidx.compose.foundation.indication
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.onClick
import androidx.compose.material.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.PointerButton
import androidx.compose.ui.input.pointer.isAltPressed
import androidx.compose.ui.input.pointer.isShiftPressed
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.singleWindowApplication

@OptIn(ExperimentalFoundationApi::class)
fun main() = singleWindowApplication(title = "Mouse clicks") {
    Column {
        var topBoxText by remember { mutableStateOf("Click me
using LMB or LMB + Shift") }
        var topBoxCount by remember { mutableIntStateOf(0) }
        // No indication on interaction
        Box(modifier = Modifier
            .size(300.dp, 200.dp)
            .background(Color.LightGray)
            // The most generic click handler (without extra conditions) should be the first one
            .onClick {
                // Receives all left mouse button clicks except for when Shift is pressed
                println("Click with primary button")
                topBoxText = "LMB ${topBoxCount++}"
            }.onClick(
                keyboardModifiers = { isShiftPressed } // Accepts clicks only when Shift is pressed
            ) {
                // Receives all left mouse button clicks when Shift is pressed
                println("Click with primary button and shift pressed")
                topBoxCount++
                topBoxText = "LMB + Shift ${topBoxCount++}"
            }
        ) {
            AnimatedContent(
                targetState = topBoxText,
                modifier = Modifier.align(Alignment.Center)
            ) {
                Text(text = it, textAlign = TextAlign.Center)
            }
        }

        var bottomBoxText by remember { mutableStateOf("Click me
using LMB or
RMB + Alt") }
        var bottomBoxCount by remember { mutableStateOf(0) }
        val interactionSource = remember { MutableInteractionSource() }
        // With indication on interaction
        Box(modifier = Modifier
            .size(300.dp, 200.dp)
            .background(Color.Yellow)
            .onClick(
                enabled = true,
                interactionSource = interactionSource,
                matcher = PointerMatcher.mouse(PointerButton.Secondary), // Right mouse button
                keyboardModifiers = { isAltPressed }, // Accepts clicks only when Alt is pressed
                onLongClick = { // Optional
                    bottomBoxText = "RMB Long Click + Alt ${bottomBoxCount++}"
                    println("Long Click with secondary button and Alt pressed")
                },
                onDoubleClick = { // Optional
                    bottomBoxText = "RMB Double Click + Alt ${bottomBoxCount++}"
                    println("Double Click with secondary button and Alt pressed")
                },
                onClick = {
                    bottomBoxText = "RMB Click + Alt ${bottomBoxCount++}"
                    println("Click with secondary button and Alt pressed")
                }
            )
            .onClick(interactionSource = interactionSource) { // Uses default parameters
                bottomBoxText = "LMB Click ${bottomBoxCount++}"
                println("Click with primary button (mouse left button)")
            }
            .indication(interactionSource, LocalIndication.current)
        ) {
            AnimatedContent(
                targetState = bottomBoxText,
                modifier = Modifier.align(Alignment.Center)
            ) {
                Text(text = it, textAlign = TextAlign.Center)
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Box(modifier = Modifier.onClick {"}

<img src="compose-onclick-modifier.animated.gif" alt="Modifier.onClick" width="600" preview-src="compose-onclick-modifier.png"/>

## 실험적 onDrag 수정자

> `onDrag` 수정자는 [실험적](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)이며 데스크톱 프로젝트에서만 지원됩니다. 옵트인이 필요하며(아래 세부 정보 참조),
> 평가 목적으로만 사용해야 합니다.
>
{style="warning"}

`Modifier.onDrag`를 사용하면 `matcher: PointerMatcher`를 통해 드래그를 트리거할 포인터를 지정할 수 있습니다.
`onClick`과 유사하게, 여러 `onDrag` 수정자를 함께 체인할 수 있습니다.

또한 키가 드래그 동작을 변경할 수 있는 경우 `LocalWindowInfo.current.keyboardModifier`를 통해 키보드 수정자 상태를 확인할 수 있습니다.
예를 들어, 간단한 드래그로 항목을 이동하고 <shortcut>Ctrl</shortcut>이 눌린 상태에서 드래그하여 항목을 복사/붙여넣기할 수 있습니다.

다음 코드 샘플은 왼쪽 및 오른쪽 마우스 버튼으로 트리거되는 드래그 이벤트를 처리하고 키보드가 관련된 경우를 보여줍니다.

```kotlin
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.PointerMatcher
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.onDrag
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.material.Text
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.PointerButton
import androidx.compose.ui.input.pointer.isCtrlPressed
import androidx.compose.ui.platform.LocalWindowInfo
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.singleWindowApplication

@OptIn(ExperimentalFoundationApi::class)
fun main() = singleWindowApplication(title = "Drag") {
    val windowInfo = LocalWindowInfo.current

    Column {
        var topBoxOffset by remember { mutableStateOf(Offset(0f, 0f)) }

        Box(modifier = Modifier
            .offset {
                IntOffset(topBoxOffset.x.toInt(), topBoxOffset.y.toInt())
            }
            .size(200.dp)
            .background(Color.Green)
            .onDrag { // By default: enabled = true, matcher = PointerMatcher.Primary (left mouse button)
                topBoxOffset += it
            }
        ) {
            Text(text = "Drag with LMB", modifier = Modifier.align(Alignment.Center))
        }

        var bottomBoxOffset by remember { mutableStateOf(Offset(0f, 0f)) }

        Box(modifier = Modifier
            .offset {
                IntOffset(bottomBoxOffset.x.toInt(), bottomBoxOffset.y.toInt())
            }
            .size(200.dp)
            .background(Color.LightGray)
            .onDrag(
                matcher = PointerMatcher.mouse(PointerButton.Secondary), // Right mouse button
                onDragStart = {
                    println("Gray Box: drag start")
                },
                onDragEnd = {
                    println("Gray Box: drag end")
                }
            ) {
                val keyboardModifiers = windowInfo.keyboardModifiers
                bottomBoxOffset += if (keyboardModifiers.isCtrlPressed) it * 2f else it
            }
        ) {
            Text(
                text = "Drag with RMB,
try with CTRL",
                modifier = Modifier.align(Alignment.Center)
            )
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Box(modifier = Modifier.onDrag {"}

<img src="compose-ondrag-modifier.animated.gif" alt="Modifier.onDrag" width="600" preview-src="compose-ondrag-modifier.png"/>

또한 `suspend fun PointerInputScope.detectDragGestures`를 사용하여 드래그를 처리하는 수정자 방식이 아닌 방법도 있습니다.

```kotlin
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.PointerMatcher
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.material.Text
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.singleWindowApplication

@OptIn(ExperimentalFoundationApi::class)
fun main() = singleWindowApplication(title = "Drag") {
    var topBoxOffset by remember { mutableStateOf(Offset(0f, 0f)) }

    Box(modifier = Modifier
        .offset {
            IntOffset(topBoxOffset.x.toInt(), topBoxOffset.y.toInt())
        }
        .size(200.dp)
        .background(Color.Green)
        .pointerInput(Unit) {
            detectDragGestures(
                matcher = PointerMatcher.Primary
            ) {
                topBoxOffset += it
            }
        }
    ) {
        Text(text = "Drag with LMB", modifier = Modifier.align(Alignment.Center))
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Modifier.pointerInput(Unit) { detectDragGestures(matcher = PointerMatcher.Primary)"}

## Swing 상호 운용성을 사용하여 원시 AWT 이벤트 액세스

> `onPointerEvent` 수정자는 [실험적](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)입니다. 옵트인이 필요하며(아래 세부 정보 참조),
> 평가 목적으로만 사용해야 합니다.
> [안정적인](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels) API를 사용하려면 [`Modifier.pointerInput`](#listening-for-raw-events-in-common-code-via-pointerinput)을 참조하세요.
>
{style="warning"}

데스크톱용 Compose Multiplatform은 내부적으로 Swing을 사용하며 원시 AWT 이벤트에 액세스할 수 있습니다.

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material.Text
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.Modifier
import androidx.compose.ui.awt.awtEventOrNull
import androidx.compose.ui.input.pointer.PointerEventType
import androidx.compose.ui.input.pointer.onPointerEvent
import androidx.compose.ui.window.singleWindowApplication

@OptIn(ExperimentalComposeUiApi::class)
fun main() = singleWindowApplication(title = "Raw AWT events") {
    var text by remember { mutableStateOf("") }

    Box(
        Modifier
            .fillMaxSize()
            .onPointerEvent(PointerEventType.Press) {
                text = it.awtEventOrNull?.locationOnScreen?.toString().orEmpty()
            },
        contentAlignment = Alignment.Center
    ) {
        Text(text)
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Box(Modifier.onPointerEvent(PointerEventType.Press) { text ="}

<img src="compose-raw-awt-events.animated.gif" alt="Swing 상호 운용성" width="600" preview-src="compose-raw-awt-events.png"/>

## `pointerInput`을 통해 공통 코드에서 원시 이벤트 수신

위의 스니펫에서 우리는 특정 유형의 포인터 이벤트를 구독하는 헬퍼 함수인 `Modifier.onPointerEvent` 함수를 사용합니다. 이는 `Modifier.pointerInput` 함수의 새롭고 짧은 변형입니다.
현재 실험적이며 데스크톱 전용이므로 공통 코드에서는 사용할 수 없습니다.

공통 코드에서 이벤트를 구독해야 하거나 안정적인 API가 필요한 경우 `Modifier.pointerInput` 함수를 사용할 수 있습니다.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material.Text
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.pointer.PointerEventType
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.window.singleWindowApplication

fun main() = singleWindowApplication(title = "Raw events via Modifier.pointerInput") {
    val list = remember { mutableStateListOf<String>() }

    Column(
        Modifier
            .fillMaxSize()
            .pointerInput(Unit) {
                awaitPointerEventScope {
                    while (true) {
                        val event = awaitPointerEvent()
                        val position = event.changes.first().position
                        // On each relayout, Compose will send a synthetic Move event,
                        // so we skip it to avoid event spam
                        if (event.type != PointerEventType.Move) {
                            list.add(0, "${event.type} $position")
                        }
                    }
                }
            },
    ) {
        for (item in list.take(20)) {
            Text(item)
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Column(Modifier.pointerInput(Unit) { awaitPointerEventScope {"}

<img src="compose-raw-events.animated.gif" alt="Modifier.pointerInput를 통한 원시 이벤트" width="600" preview-src="compose-raw-events.png"/>

## 다음 단계

[다른 데스크톱 컴포넌트](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop)에 대한 튜토리얼을 살펴보세요.