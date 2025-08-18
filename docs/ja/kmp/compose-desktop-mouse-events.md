[//]: # (title: マウスイベントリスナー)

デスクトッププロジェクトでは、クリック、移動、スクロール、入力領域への出入りなど、さまざまなマウスイベントをリッスンできます。

## クリックリスナー

クリックリスナーはCompose Multiplatform for AndroidとCompose Multiplatform for Desktopの両方で利用できるため、コードは両方のプラットフォームで動作します。
例えば、`onClick`、`onDoubleClick`、`onLongClick`モディファイアを使用してシンプルなクリックリスナーを設定する方法は次のとおりです。

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

`combinedClickable`モディファイアは、プライマリボタン（左マウスボタン）とタッチイベントのみをサポートします。ボタンを異なる方法で処理する必要がある場合は、[`Modifier.onClick`](#experimental-onclick-handlers)セクションを参照してください。

## 移動リスナー

> `onPointerEvent`モディファイアは[実験的](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)です。オプトインが必要です（詳細は下記参照）。
> 評価目的でのみ使用してください。
> [安定版](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)APIについては、[`Modifier.pointerInput`](#listening-for-raw-events-in-common-code-via-pointerinput)を参照してください。
>
{style="warning"}

マウスポインターの位置に応じてウィンドウの背景色を変更するポインター移動リスナーを作成するには、次のコードを追加します。

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

## 入力領域への出入りリスナー

> `onPointerEvent`モディファイアは[実験的](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)です。オプトインが必要です（詳細は下記参照）。
> 評価目的でのみ使用してください。
> [安定版](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)APIについては、[`Modifier.pointerInput`](#listening-for-raw-events-in-common-code-via-pointerinput)を参照してください。
>
{style="warning"}

Compose Multiplatform for Desktopは、ポインターが入力領域に出入りする際のハンドラーをサポートしています。例えば、次のコードはホバー時に行のフォントスタイルを変更します。

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

## スクロールリスナー

> `onPointerEvent`モディファイアは[実験的](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)です。オプトインが必要です（詳細は下記参照）。
> 評価目的でのみ使用してください。
> [安定版](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)APIについては、[`Modifier.pointerInput`](#listening-for-raw-events-in-common-code-via-pointerinput)を参照してください。
>
{style="warning"}

次のコードサンプルは、マウスのスクロール方向に応じて表示される数値を増減させる方法を示しています。

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

## 実験的なonClickハンドラー

> `onClick`モディファイアは[実験的](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)であり、デスクトッププロジェクトでのみサポートされています。オプトインが必要です（詳細は下記参照）。
> 評価目的でのみ使用してください。
>
{style="warning"}

`Modifier.onClick`は、クリック、ダブルクリック、ロングクリックに対して独立したコールバックを提供します。ポインターイベントに起因するクリックのみを処理し、そのままではアクセシビリティの`click`イベントを処理しません。

`matcher: PointerMatcher`と`keyboardModifiers: PointerKeyboardModifiers.() -> Boolean`を使用して、各`onClick`が特定のポインターイベントをターゲットにするように設定できます。
* `matcher`を使用すると、どのマウスボタンがクリックイベントをトリガーするかを選択できます。
* `keyboardModifiers`を使用すると、指定されたキーが押されているポインターイベントをフィルターできます。

複数の`onClick`モディファイアのチェーンを作成して、マッチャーとキーボード修飾子の異なる条件で異なるクリックを処理することもできます。
`clickable`とは異なり、`onClick`はデフォルトの`Modifier.indication`および`Modifier.semantics`を持たず、<shortcut>Enter</shortcut>を押してもクリックイベントをトリガーしません。必要に応じて、これらのモディファイアを個別に追加してください。
イベントの正しい伝播を保証するために、最も汎用的な（条件が最も少ない）`onClick`ハンドラーを他のハンドラーの前に宣言するべきです。

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

## 実験的なonDragモディファイア

> `onDrag`モディファイアは[実験的](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)であり、デスクトッププロジェクトでのみサポートされています。オプトインが必要です（詳細は下記参照）。
> 評価目的でのみ使用してください。
>
{style="warning"}

`Modifier.onDrag`を使用すると、`matcher: PointerMatcher`を介してドラッグをトリガーするポインターを指定できます。
`onClick`と同様に、多くの`onDrag`モディファイアを連結できます。

キーがドラッグの動作を変更できる場合のために、`LocalWindowInfo.current.keyboardModifier`を介してキーボード修飾子の状態を確認することもできます。
例えば、シンプルなドラッグでアイテムを移動し、<shortcut>Ctrl</shortcut>が押されている間にドラッグでアイテムをコピー/貼り付けする場合などです。

次のコードサンプルは、左右のマウスボタンによってトリガーされるドラッグイベント、およびキーボードが関与する場合のドラッグイベントを処理する方法を示しています。

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

`suspend fun PointerInputScope.detectDragGestures`を使用してドラッグを処理するモディファイアを使用しない方法もあります。

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

## Swingとの相互運用による生のAWTイベントへのアクセス

> `onPointerEvent`モディファイアは[実験的](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)です。オプトインが必要です（詳細は下記参照）。
> 評価目的でのみ使用してください。
> [安定版](supported-platforms.md#compose-multiplatform-ui-framework-stability-levels)APIについては、[`Modifier.pointerInput`](#listening-for-raw-events-in-common-code-via-pointerinput)を参照してください。
>
{style="warning"}

Compose Multiplatform for Desktopは内部的にSwingを使用しており、生のAWTイベントにアクセスできます。

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

## `pointerInput`を介した共通コードでの生のイベントのリッスン

上記のスニペットでは、`Modifier.onPointerEvent`関数を使用しています。これは、ある種のポインターイベントを購読するヘルパー関数です。これは`Modifier.pointerInput`関数の新しい簡潔なバリアントです。
現在、実験的でデスクトップ専用であるため、共通コードでは使用できません。

共通コードでイベントを購読する必要がある場合、または安定版APIが必要な場合は、`Modifier.pointerInput`関数を使用できます。

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

<img src="compose-raw-events.animated.gif" alt="Raw events via Modifier.pointerInput" width="600" preview-src="compose-raw-events.png"/>

## 次のステップ

[他のデスクトップコンポーネント](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop)に関するチュートリアルを参照してください。