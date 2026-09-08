[//]: # (title: 탭 내비게이션 및 키보드 포커스)
<web-summary>데스크톱용 Compose Multiplatform에서 Tab 키를 사용하여 컴포넌트 간을 탐색하는 방법을 알아봅니다.</web-summary>

데스크톱용 Compose Multiplatform에서는 다음 컴포넌트로 이동할 때는 <shortcut>Tab</shortcut> 단축키를, 이전 컴포넌트로 이동할 때는 <shortcut>Shift+Tab</shortcut> 단축키를 사용하여 컴포넌트 간 내비게이션을 설정할 수 있습니다.

undefined

## 기본 탭 내비게이션 {id="default-tab-navigation"}

기본적으로 탭 내비게이션을 사용하면 사용자가 포커스 가능한 컴포넌트가 나타나는 순서대로 이동할 수 있습니다. 이 기능은 기본적으로 활성화되어 있으며 추가 코드가 필요하지 않습니다.

포커스 가능한 컴포넌트에는 구현 시 `clickable()`, `selectable()`, `toggleable()` 또는 `focusable()` 수정자(modifier)를 사용하는 모든 항목이 포함됩니다. 예를 들어 텍스트 필드, 버튼, 슬라이더, 내비게이션 항목, null이 아닌 콜백이 있는 선택 컨트롤, `Card()`, `Surface()`, `ListItem()`의 `onClick` 오버로드 등이 있습니다.

다음은 사용자가 표준 단축키를 사용하여 5개의 텍스트 필드 사이를 이동할 수 있는 창의 예시입니다.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.input.TextFieldLineLimits
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.material3.TextField
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.WindowState
import androidx.compose.ui.window.application

fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        state = WindowState(size = DpSize(350.dp, 500.dp))
    ) {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Column(
                modifier = Modifier.padding(50.dp),
                verticalArrangement = Arrangement.spacedBy(20.dp)
            ) {
                repeat(5) {
                    TextField(
                        state = rememberTextFieldState(),
                        lineLimits = TextFieldLineLimits.SingleLine
                    )
                }
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Column() { repeat(5) { TextField(state = rememberTextFieldState()"}

<img src="compose-desktop-tab-navigation-default.animated.gif" alt="Default tab order" width="450" preview-src="compose-desktop-tab-navigation-default.png"/>

## 커스텀 포커스 가능 컴포넌트 {id="custom-focusable-components"}

기본적으로 포커스할 수 없는 컴포넌트를 탭 순서에 포함하려면 `focusable()` 수정자를 적용하세요.

컴포넌트가 포커스를 받았을 때 모양을 변경하려면 `focusable()` 수정자에 `MutableInteractionSource`를 전달하고, `collectIsFocusedAsState()`로 포커스 상태를 읽어온 뒤, 해당 상태를 사용하여 컴포넌트의 스타일(다른 배경색, 테두리 또는 기타 강조 효과)을 변경하세요. 컴포넌트가 키보드 입력에 반응하게 하려면 `onKeyEvent()` 수정자로 키 이벤트를 처리하세요.

다음 예제는 `Box()` 컴포저블을 버튼과 같은 컴포넌트로 만듭니다. 박스에 포커스가 맞춰지면 강조 표시되며, <shortcut>Enter</shortcut> 또는 <shortcut>Space</shortcut>를 누르면 관련 동작이 실행됩니다.

```kotlin
import androidx.compose.foundation.background
import androidx.compose.foundation.focusable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.ExperimentalComposeUiApi
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.input.key.key
import androidx.compose.ui.input.key.onKeyEvent
import androidx.compose.ui.input.key.type
import androidx.compose.ui.input.pointer.PointerEventType
import androidx.compose.ui.input.pointer.onPointerEvent
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.WindowState
import androidx.compose.ui.window.application

fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        state = WindowState(size = DpSize(350.dp, 450.dp))
    ) {
        MaterialTheme(
            colorScheme = MaterialTheme.colorScheme.copy(
                primary = Color(10, 132, 232),
                secondary = Color(150, 232, 150)
            )
        ) {
            var clicks by remember { mutableStateOf(0) }
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Column(
                    modifier = Modifier.padding(40.dp),
                    verticalArrangement = Arrangement.spacedBy(20.dp)
                ) {
                    Text(text = "Clicks: $clicks")
                    repeat(5) { index ->
                        FocusableBox("Button ${index + 1}", onClick = { clicks++ })
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalComposeUiApi::class)
@Composable
fun FocusableBox(
    text: String = "",
    onClick: () -> Unit = {},
    size: DpSize = DpSize(200.dp, 35.dp)
) {
    var isKeyPressed by remember { mutableStateOf(false) }
    val interactionSource = remember { MutableInteractionSource() }
    val isFocused by interactionSource.collectIsFocusedAsState()
    val backgroundColor = when {
        isFocused && isKeyPressed -> lerp(MaterialTheme.colorScheme.secondary, Color(64, 64, 64), 0.3f)
        isFocused -> MaterialTheme.colorScheme.secondary
        else -> MaterialTheme.colorScheme.primary
    }
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(4.dp))
            .background(backgroundColor)
            .size(size)
            .onPointerEvent(PointerEventType.Press) { onClick() }
            .onKeyEvent {
                if (it.key == Key.Enter || it.key == Key.Spacebar) {
                    when (it.type) {
                        KeyEventType.KeyDown -> isKeyPressed = true
                        KeyEventType.KeyUp -> {
                            isKeyPressed = false
                            onClick()
                        }
                    }
                }
                false
            }
            .focusable(interactionSource = interactionSource),
        contentAlignment = Alignment.Center
    ) {
        Text(text = text, color = Color.White)
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Box(modifier = Modifier.focusable(interactionSource = interactionSource)"}

<img src="compose-desktop-tab-navigation-custom-focusable.animated.gif" alt="A custom focusable component" width="450" preview-src="compose-desktop-tab-navigation-custom-focusable.png"/>

## 커스텀 탭 순서 {id="custom-tab-order"}

나타나는 순서가 아닌 다른 순서로 포커스를 이동하려면 두 가지 수정자를 조합합니다.

* `focusRequester()`는 포커스 가능한 컴포넌트에 `FocusRequester` 핸들을 연결합니다. 컴포넌트가 [기본적으로 포커스 가능하지 않은 경우](#커스텀-포커스-가능-컴포넌트), `focusRequester()` *뒤에* `focusable()` 수정자를 적용하세요.
* `focusProperties()`는 탭 순서에서 `next`(다음) 및 `previous`(이전) 요소를 설정합니다. <shortcut>Tab</shortcut> 또는 <shortcut>Shift+Tab</shortcut>을 눌러 포커스를 맞출 `FocusRequester` 핸들이 있는 컴포넌트를 지정합니다.

다음 예제는 5개의 텍스트 필드 각각에 대해 `FocusRequester`를 생성하고 기본 탭 순서를 역순으로 변경합니다.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.input.TextFieldLineLimits
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.material3.TextField
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusProperties
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.WindowState
import androidx.compose.ui.window.application

fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        state = WindowState(size = DpSize(350.dp, 500.dp))
    ) {
        val focusRequesters = remember { List(5) { FocusRequester() } }
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Column(
                modifier = Modifier.padding(50.dp),
                verticalArrangement = Arrangement.spacedBy(20.dp)
            ) {
                focusRequesters.forEachIndexed { index, focusRequester ->
                    TextField(
                        state = rememberTextFieldState(),
                        lineLimits = TextFieldLineLimits.SingleLine,
                        modifier = Modifier
                            .focusRequester(focusRequester)
                            .focusProperties {
                                // 기본 순서를 역순으로 변경:
                                next = focusRequesters[(index - 1 + focusRequesters.size) % focusRequesters.size]
                                previous = focusRequesters[(index + 1) % focusRequesters.size]
                            }
                    )
                }
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Modifier.focusRequester(focusRequester).focusProperties { next ="}

<img src="compose-desktop-tab-navigation-custom-order.animated.gif" alt="Custom tab order" width="450" preview-src="compose-desktop-tab-navigation-custom-order.png"/>

## 코드에서 포커스 이동하기 {id="moving-focus-from-code"}

사용자 상호작용 없이 컴포넌트에 포커스를 주려면, `focusRequester()` 수정자를 사용하여 포커스 가능한 컴포넌트에 `FocusRequester`를 연결하고 `FocusRequester.requestFocus()`를 호출하세요. 컴포넌트가 [기본적으로 포커스 가능하지 않은 경우](#커스텀-포커스-가능-컴포넌트), `focusable()` 수정자는 `focusRequester()` *뒤에* 적용되어야 합니다.

다음 예제에서 버튼은 포커스를 텍스트 필드로 이동시켰다가 다시 자신에게로 가져옵니다.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.input.TextFieldLineLimits
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.WindowState
import androidx.compose.ui.window.application

fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        state = WindowState(size = DpSize(350.dp, 450.dp))
    ) {
        val buttonFocusRequester = remember { FocusRequester() }
        val textFieldFocusRequester = remember { FocusRequester() }
        var isTextFieldFocused by remember { mutableStateOf(false) }
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Column(
                modifier = Modifier.padding(50.dp),
                verticalArrangement = Arrangement.spacedBy(20.dp)
            ) {
                Button(
                    onClick = {
                        isTextFieldFocused = !isTextFieldFocused
                        if (isTextFieldFocused) {
                            textFieldFocusRequester.requestFocus()
                        } else {
                            buttonFocusRequester.requestFocus()
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .focusRequester(buttonFocusRequester)
                ) {
                    Text(text = "Focus switcher")
                }
                TextField(
                    state = rememberTextFieldState(),
                    lineLimits = TextFieldLineLimits.SingleLine,
                    modifier = Modifier.focusRequester(textFieldFocusRequester)
                )
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Button(onClick = { textFieldFocusRequester.requestFocus()"}

<img src="compose-desktop-tab-navigation-move-focus-from-code.animated.gif" alt="Moving focus from code" width="450" preview-src="compose-desktop-tab-navigation-move-focus-from-code.png"/>

### 컴포넌트가 나타날 때 포커스 주기 {id="focusing-a-component-when-it-appears"}

폼(form)이나 다이얼로그에서는 사용자가 마우스를 잡지 않고도 바로 타이핑을 시작할 수 있도록 첫 번째 입력창에 즉시 포커스를 주는 경우가 많습니다. 이 경우, 컴포넌트가 컴포지션(composition)에 들어온 후 한 번 실행되는 `LaunchedEffect(Unit)` 블록에서 포커스를 요청하세요.

다음 예제에서는 창이 열리자마자 첫 번째 텍스트 필드에 포커스가 맞춰집니다.

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.input.TextFieldLineLimits
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.material3.TextField
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.WindowState
import androidx.compose.ui.window.application

fun main() = application {
    Window(
        onCloseRequest = ::exitApplication,
        state = WindowState(size = DpSize(350.dp, 300.dp))
    ) {
        val focusRequester = remember { FocusRequester() }
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Column(
                modifier = Modifier.padding(50.dp),
                verticalArrangement = Arrangement.spacedBy(20.dp)
            ) {
                TextField(
                    state = rememberTextFieldState(),
                    lineLimits = TextFieldLineLimits.SingleLine,
                    modifier = Modifier.focusRequester(focusRequester)
                )
                TextField(
                    state = rememberTextFieldState(),
                    lineLimits = TextFieldLineLimits.SingleLine
                )
            }
        }
        LaunchedEffect(Unit) {
            focusRequester.requestFocus()
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="LaunchedEffect(Unit) { focusRequester.requestFocus()"}

<img src="compose-desktop-tab-navigation-focus-on-appearance.animated.gif" alt="Focus text field on appearance" width="450" preview-src="compose-desktop-tab-navigation-focus-on-appearance.png"/>

## 다중 라인 텍스트 필드에서 포커스 이동하기 {id="moving-focus-from-multiline-text-fields"}

다중 라인(multiline) 텍스트 필드에서는 <shortcut>Tab</shortcut>을 누르면 다음 컴포넌트로 포커스를 이동하는 대신 탭 문자가 삽입됩니다.

```kotlin
Column {
    repeat(5) {
        TextField(
            state = rememberTextFieldState("Hello, World!"),
            // MultiLine은 lineLimits의 기본값입니다.
            lineLimits = TextFieldLineLimits.MultiLine(),
            modifier = Modifier.padding(8.dp)
        )
    }
}
```

이는 알려진 문제인 [CMP-5822](https://youtrack.jetbrains.com/issue/CMP-5822)입니다. 기본 동작인 두 줄 이상의 입력을 허용하는 모든 텍스트 필드에 영향을 미칩니다. 우회 방법으로, `onPreviewKeyEvent` 수정자를 사용하여 <shortcut>Tab</shortcut> 키를 가로채고 `LocalFocusManager`의 `FocusManager`를 사용하여 포커스를 이동시키세요.

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.input.TextFieldLineLimits
import androidx.compose.foundation.text.input.rememberTextFieldState
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusDirection
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.input.key.isShiftPressed
import androidx.compose.ui.input.key.key
import androidx.compose.ui.input.key.onPreviewKeyEvent
import androidx.compose.ui.input.key.type
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.singleWindowApplication

fun main() = singleWindowApplication(title = "Multiline text fields") {
    Column {
        repeat(5) {
            TextField(
                state = rememberTextFieldState("Hello, World!"),
                lineLimits = TextFieldLineLimits.MultiLine(),
                modifier = Modifier.padding(8.dp).moveFocusOnTab()
            )
        }
    }
}

@Composable
fun Modifier.moveFocusOnTab(): Modifier {
    val focusManager = LocalFocusManager.current
    return onPreviewKeyEvent {
        if (it.type == KeyEventType.KeyDown && it.key == Key.Tab) {
            focusManager.moveFocus(
                if (it.isShiftPressed) FocusDirection.Previous else FocusDirection.Next
            )
            true
        } else {
            false
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="fun Modifier.moveFocusOnTab() { focusManager.moveFocus("}

## 다음 단계 {id="what-s-next"}

* [키보드 이벤트](compose-desktop-keyboard.md) 처리에 대해 자세히 알아보세요.
* [다양한 플랫폼의 접근성 지원](compose-desktop-accessibility.md)에 대해 알아보세요.
* [기타 데스크톱 컴포넌트](compose-desktop-components.md)에 대한 튜토리얼을 살펴보세요.