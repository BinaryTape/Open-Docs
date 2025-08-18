[//]: # (title: 滑鼠事件監聽器)

在您的桌面專案中，您可以監聽各種滑鼠事件，例如點擊、移動、捲動、或進入和離開輸入區域。

## 點擊監聽器

點擊監聽器在 Compose Multiplatform 適用於 Android 和 Compose Multiplatform 適用於桌面均可使用，因此您的程式碼將在兩個平台上運行。
例如，以下是使用 `onClick`、`onDoubleClick` 和 `onLongClick` 修飾符設定簡單點擊監聽器的方法：

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

<img src="compose-mouse-click-listeners.animated.gif" alt="Mouse click listeners" width="600" preview-src="compose-mouse-click-listeners.png"/>

`combinedClickable` 修飾符僅支援主要按鈕（滑鼠左鍵）和觸控事件。如果您需要以不同方式處理按鈕，請參閱 [`Modifier.onClick`](#experimental-onclick-handlers) 章節。

## 移動監聽器

> `onPointerEvent` 修飾符是 [實驗性 (Experimental)](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels) 功能。需要選擇啟用（詳情請參閱下方），且您應僅將其用於評估目的。
> 對於 [穩定版 (Stable)](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels) API，請參閱 [`Modifier.pointerInput`](#listening-for-raw-events-in-common-code-via-pointerinput)。
>
{style="warning"}

若要建立一個依據滑鼠指標位置改變視窗背景顏色的指標移動監聽器，請新增以下程式碼：

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

<img src="compose-mouse-move-listeners.animated.gif" alt="Mouse move listeners" width="600" preview-src="compose-mouse-move-listeners.png"/>

## 進入監聽器

> `onPointerEvent` 修飾符是 [實驗性 (Experimental)](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels) 功能。需要選擇啟用（詳情請參閱下方），且您應僅將其用於評估目的。
> 對於 [穩定版 (Stable)](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels) API，請參閱 [`Modifier.pointerInput`](#listening-for-raw-events-in-common-code-via-pointerinput)。
>
{style="warning"}

Compose Multiplatform 適用於桌面支援指標進入和離開輸入區域的處理器。例如，以下程式碼將在懸停時改變某行的字體樣式：

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

<img src="compose-mouse-enter-listeners.animated.gif" alt="Mouse enter listeners" width="600" preview-src="compose-mouse-enter-listeners.png"/>

## 捲動監聽器

> `onPointerEvent` 修飾符是 [實驗性 (Experimental)](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels) 功能。需要選擇啟用（詳情請參閱下方），且您應僅將其用於評估目的。
> 對於 [穩定版 (Stable)](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels) API，請參閱 [`Modifier.pointerInput`](#listening-for-raw-events-in-common-code-via-pointerinput)。
>
{style="warning"}

以下程式碼範例展示了如何根據滑鼠捲動方向增加或減少顯示的數字：

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

<img src="compose-mouse-scroll-listeners.animated.gif" alt="Mouse scroll listeners" width="600" preview-src="compose-mouse-scroll-listeners.png"/>

## 實驗性 onClick 處理器

> `onClick` 修飾符是 [實驗性 (Experimental)](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels) 功能，僅在桌面專案中支援。需要選擇啟用（詳情請參閱下方），且您應僅將其用於評估目的。
>
{style="warning"}

`Modifier.onClick` 為點擊、雙擊和長按提供獨立的回呼。它僅處理源自指標事件的點擊，不處理開箱即用的無障礙 `click` 事件。

您可以設定每個 `onClick` 以使用 `matcher: PointerMatcher` 和 `keyboardModifiers: PointerKeyboardModifiers.() -> Boolean` 鎖定特定指標事件：
* `matcher` 讓您可以選擇哪個滑鼠按鈕應該觸發點擊事件。
* `keyboardModifiers` 讓您可以篩選出有指定按鍵按下的指標事件。

您還可以建立多個 `onClick` 修飾符的鏈條，以處理具有不同匹配器和鍵盤修飾符條件的點擊。
與 `clickable` 不同，`onClick` 沒有預設的 `Modifier.indication` 和 `Modifier.semantics`，並且在您按下 <shortcut>Enter</shortcut> 時不會觸發點擊事件。如果需要，請單獨新增這些修飾符。
您應該將最通用（條件最少）的 `onClick` 處理器宣告在其他處理器之前，以確保事件的正確傳播。

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

## 實驗性 onDrag 修飾符

> `onDrag` 修飾符是 [實驗性 (Experimental)](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels) 功能，僅在桌面專案中支援。需要選擇啟用（詳情請參閱下方），且您應僅將其用於評估目的。
>
{style="warning"}

透過 `Modifier.onDrag`，您可以透過 `matcher: PointerMatcher` 指定應觸發拖曳的指標。
類似於 `onClick`，您可以將許多 `onDrag` 修飾符串聯起來。

您還可以透過 `LocalWindowInfo.current.keyboardModifier` 檢查鍵盤修飾符的狀態，以應對按鍵可能改變拖曳行為的情況。
例如，透過簡單拖曳移動項目，並在按下 <shortcut>Ctrl</shortcut> 時拖曳以複製/貼上項目。

以下程式碼範例展示了如何處理由滑鼠左鍵和右鍵以及鍵盤參與觸發的拖曳事件：

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

還有一種非修飾符的方式，可以使用 `suspend fun PointerInputScope.detectDragGestures` 處理拖曳：

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

## 透過 Swing 互通性存取原始 AWT 事件

> `onPointerEvent` 修飾符是 [實驗性 (Experimental)](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels) 功能。需要選擇啟用（詳情請參閱下方），且您應僅將其用於評估目的。
> 對於 [穩定版 (Stable)](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels) API，請參閱 [`Modifier.pointerInput`](#listening-for-raw-events-in-common-code-via-pointerinput)。
>
{style="warning"}

Compose Multiplatform 適用於桌面在底層使用 Swing，並允許存取原始 AWT 事件：

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

<img src="compose-raw-awt-events.animated.gif" alt="Swing interoperability" width="600" preview-src="compose-raw-awt-events.png"/>

## 透過 pointerInput 在共用程式碼中監聽原始事件

在上述程式碼片段中，我們使用了 `Modifier.onPointerEvent` 函數，這是一個輔助函數，用於訂閱某種類型的指標事件。它是 `Modifier.pointerInput` 函數的一個新的、簡短的變體。
它目前是實驗性功能，且僅適用於桌面，因此您無法在共用程式碼中使用它。

如果您需要在共用程式碼中訂閱事件，或者如果您需要一個穩定版 API，您可以使用 `Modifier.pointerInput` 函數：

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material.Text
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
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

<img src="compose-raw-events.animated.gif" alt="Raw events via Modifier.pointerInput" width="600" preview-src="compose-raw-events.png"/>

## 接下來是什麼

探索有關 [其他桌面組件](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop) 的教學課程。