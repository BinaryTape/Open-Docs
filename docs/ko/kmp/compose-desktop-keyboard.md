[//]: # (title: 키보드 이벤트)

데스크톱용 Compose Multiplatform에서는 두 가지 다른 범위에서 이벤트 핸들러를 설정하여 키보드 이벤트를 관리할 수 있습니다:

* 포커스된 요소 기반 이벤트 핸들러
* 창 범위 이벤트 핸들러

## 포커스된 컴포넌트의 이벤트

이 접근 방식은 키보드의 키를 누르면 현재 포커스된 컴포넌트의 이벤트 핸들러가 트리거됨을 의미합니다.

일반적인 시나리오는 `TextField`와 같은 활성 컨트롤에 대해 키보드 핸들러를 정의하는 것입니다. 기본 작업을 트리거하기 전에 키 이벤트를 가로채려면 `onKeyEvent` 및 `onPreviewKeyEvent` 수식어를 모두 사용할 수 있습니다.
`onKeyEvent` 수식어를 사용하면 개별 키 입력을 처리할 수 있으며, `onPreviewKeyEvent`는 단축키를 정의하는 데 더 적합합니다.

다음 샘플은 <shortcut>Ctrl</shortcut>을 누른 상태에서 어떤 키가 눌리는지에 따라 다른 작업을 수행하는 `TextField` 상호 작용을 보여줍니다:

```kotlin
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Text
import androidx.compose.material.TextField
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.isCtrlPressed
import androidx.compose.ui.input.key.key
import androidx.compose.ui.input.key.onPreviewKeyEvent
import androidx.compose.ui.input.key.type
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.window.singleWindowApplication

fun main() = singleWindowApplication (title = "Key events") {
    MaterialTheme {
        var consumedText by remember { mutableStateOf(0) }
        var text by remember { mutableStateOf("") }
        Column(Modifier.fillMaxSize(), Arrangement.spacedBy(5.dp)) {
            Text("Consumed text: $consumedText")
            TextField(
                value = text,
                onValueChange = { text = it },
                modifier = Modifier.onPreviewKeyEvent {
                    when {
                        (it.isCtrlPressed && it.key == Key.Minus && it.type == KeyEventType.KeyUp) -> {
                            consumedText -= text.length
                            text = ""
                            true
                        }
                        (it.isCtrlPressed && it.key == Key.Equals && it.type == KeyEventType.KeyUp) -> {
                            consumedText += text.length
                            text = ""
                            true
                        }
                        else -> false
                    }
                }
            )
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="modifier = Modifier.onPreviewKeyEvent { when"}

<img src="compose-desktop-key-focus.animated.gif" alt="포커스된 컴포넌트의 키보드 이벤트" width="600" preview-src="compose-desktop-key-focus.png"/>

## 창 범위의 이벤트

현재 창 내에서 항상 활성화되는 키보드 이벤트 핸들러를 정의하려면 `Window`, `singleWindowApplication`, `Dialog` 함수에서 사용할 수 있는 `onPreviewKeyEvent` 및 `onKeyEvent` 매개변수를 사용하세요.
이들은 이벤트가 소비되지 않았을 때 디스패치되는 방식이 다릅니다: `onPreviewKeyEvent`는 이벤트를 첫 번째 자식에게 디스패치하고, `onKeyEvent`는 이벤트를 컴포저블의 부모에게 디스패치합니다. 일반적으로 `onPreviewKeyEvent`는 화면 전체 키보드 단축키까지 구현할 수 있으므로 이벤트를 가로채는 데 선호됩니다.

다음 샘플은 `Escape` 키를 눌러 팝업 대화 상자를 닫거나 <shortcut>Ctrl+Shift+C</shortcut> 단축키를 눌러 창 내용을 변경하는 등의 창 상호 작용을 보여줍니다:

```kotlin
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.Button
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.KeyEventType
import androidx.compose.ui.input.key.isCtrlPressed
import androidx.compose.ui.input.key.isShiftPressed
import androidx.compose.ui.input.key.key
import androidx.compose.ui.input.key.type
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.DialogWindow
import androidx.compose.ui.window.singleWindowApplication

private var cleared by mutableStateOf(false)

fun main() = singleWindowApplication(
    title = "Keyboard events",
    onKeyEvent = {
        if (
            it.isCtrlPressed &&
            it.isShiftPressed &&
            it.key == Key.C &&
            it.type == KeyEventType.KeyDown
        ) {
            cleared = true
            true
        } else {
            false
        }
    }
) {
    MaterialTheme {
        if (cleared) {
            Text("The App was cleared!")
        } else {
            App()
        }
    }
}

@Composable
fun App() {
    var isDialogOpen by remember { mutableStateOf(false) }

    if (isDialogOpen) {
        DialogWindow(onCloseRequest = { isDialogOpen = false },
            title = "Dialog",
            onPreviewKeyEvent = {
                if (it.key == Key.Escape && it.type == KeyEventType.KeyDown) {
                    isDialogOpen = false
                    true
                } else {
                    false
                }
            }) {
            Text("Hello!")
        }
    }

    Column(Modifier.fillMaxSize(), Arrangement.spacedBy(5.dp)) {
        Button(
            modifier = Modifier.padding(4.dp),
            onClick = { isDialogOpen = true }
        ) {
            Text("Open dialog")
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="if (it.isCtrlPressed && it.isShiftPressed && it.key == Key.C && "}

<img src="compose-desktop-key-window.animated.gif" alt="창 범위의 키보드 이벤트" width="600" preview-src="compose-desktop-key-window.png"/>

## 다음은 무엇인가요?

* 자세한 내용은 [API 참조](https://developer.android.com/reference/kotlin/androidx/compose/ui/input/key/package-summary#keyinputfilter)를 참조하세요.
* [다른 데스크톱 컴포넌트](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop)에 대한 튜토리얼을 살펴보세요.