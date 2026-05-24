[//]: # (title: 鍵盤事件)

在電腦版的 Compose Multiplatform 中，您可以透過在兩種不同作用域中設定處理常式來管理鍵盤事件：

* 基於受焦點元件的處理常式。
* 視窗作用域中的處理常式。

undefined

## 受焦點元件中的事件

此方法代表按下鍵盤上的按鍵會觸發目前受焦點元件的處理常式。

典型的場景是為 `TextField` 等活動控制項定義鍵盤處理常式。若要在觸發預設操作之前攔截按鍵事件，您可以使用 `onKeyEvent` 與 `onPreviewKeyEvent` 修飾符。
使用 `onKeyEvent` 修飾符可以處理單個按鍵動作，而 `onPreviewKeyEvent` 則更適合用於定義快速鍵。

以下範例示範了 `TextField` 的互動，根據按住 <shortcut>Ctrl</shortcut> 鍵時按下的按鍵而執行不同的操作。
將此程式碼新增至 `sharedUI/src/jvmMain/kotlin` 中的 `main.kt` 檔案：

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

<img src="compose-desktop-key-focus.animated.gif" alt="受焦點元件中的鍵盤事件" width="600" preview-src="compose-desktop-key-focus.png"/>

## 視窗作用域中的事件

若要定義在目前視窗中始終有效的鍵盤事件處理常式，請使用 `Window`、`singleWindowApplication` 與 `Dialog` 函式中提供的 `onPreviewKeyEvent` 和 `onKeyEvent` 參數。
它們的區別在於事件未被消耗時的派送方式：`onPreviewKeyEvent` 將事件派送給其第一個子元件，而 `onKeyEvent` 則將事件派送給該可組合項的父元件。通常，攔截事件時偏好使用 `onPreviewKeyEvent`，因為它甚至可以實作全視窗範圍的鍵盤快速鍵。

以下範例示範了視窗互動，例如透過按下 `Escape` 鍵關閉彈出對話方塊，以及透過按下 <shortcut>Ctrl+Shift+C</shortcut> 快速鍵更改視窗內容。
將此程式碼新增至 `sharedUI/src/jvmMain/kotlin` 中的 `main.kt` 檔案：

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

<img src="compose-desktop-key-window.animated.gif" alt="視窗作用域中的鍵盤事件" width="600" preview-src="compose-desktop-key-window.png"/>

## 接續內容

* 參閱 [API 參考](https://developer.android.com/reference/kotlin/androidx/compose/ui/input/key/package-summary#keyinputfilter) 以了解詳細資訊。
* 探索關於 [其他電腦版元件](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop) 的教學。