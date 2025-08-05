[//]: # (title: 鍵盤事件)

在 Compose Multiplatform 桌面版中，您可以透過在兩種不同的範圍內設定事件處理器來管理鍵盤事件：

* 基於聚焦元素的事件處理器。
* 視窗範圍內的事件處理器。

## 聚焦元件中的事件

此方法表示，在鍵盤上按下按鍵會觸發目前聚焦元件的事件處理器。

一個典型的場景是為像 `TextField` 這樣的活動控制項定義鍵盤處理器。要在鍵盤事件觸發預設動作之前攔截它，您可以使用 `onKeyEvent` 和 `onPreviewKeyEvent` 這兩個修飾符。使用 `onKeyEvent` 修飾符，您可以處理單個按鍵操作，而 `onPreviewKeyEvent` 更適合定義快捷鍵。

以下範例展示了 `TextField` 互動，其動作根據您按住 <shortcut>Ctrl</shortcut> 時按下的鍵而異：

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

<img src="compose-desktop-key-focus.animated.gif" alt="聚焦元件中的鍵盤事件" width="600" preview-src="compose-desktop-key-focus.png"/>

## 視窗範圍中的事件

要在當前視窗內定義始終處於活動狀態的鍵盤事件處理器，請使用 `onPreviewKeyEvent` 和 `onKeyEvent` 參數，這些參數適用於 `Window`、`singleWindowApplication` 和 `Dialog` 函數。它們的區別在於事件未被消耗時的分派方式：`onPreviewKeyEvent` 將事件分派給其第一個子項，而 `onKeyEvent` 則將事件分派給組合式函數的父項。通常，`onPreviewKeyEvent` 更適合攔截事件，因為它甚至可以實現全螢幕的鍵盤快捷鍵。

以下範例展示了視窗互動，例如透過按下 `Escape` 鍵關閉彈出式對話框，以及透過按下 <shortcut>Ctrl+Shift+C</shortcut> 快捷鍵變更視窗內容：

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

<img src="compose-desktop-key-window.animated.gif" alt="視窗範圍中的鍵盤事件" width="600" preview-src="compose-desktop-key-window.png"/>

## 接下來呢？

* 請參閱 [API 參考文件](https://developer.android.com/reference/kotlin/androidx/compose/ui/input/key/package-summary#keyinputfilter) 以了解詳情。
* 探索關於 [其他桌面元件](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop) 的教學課程。