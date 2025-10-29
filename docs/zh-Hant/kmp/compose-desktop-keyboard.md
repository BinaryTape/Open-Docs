[//]: # (title: 鍵盤事件)

在適用於桌面的 Compose Multiplatform 中，您可以透過在兩種不同範圍內設定事件處理器來管理鍵盤事件：

*   基於聚焦元素的事件處理器。
*   視窗範圍內的事件處理器。

## 聚焦組件中的事件

這種方法意味著按下鍵盤上的按鍵會觸發目前聚焦組件的事件處理器。

一個典型的場景是為 `TextField` 等活動控制項定義鍵盤處理器。若要在按鍵事件觸發預設動作之前攔截它，您可以使用 `onKeyEvent` 和 `onPreviewKeyEvent` 修飾符。
使用 `onKeyEvent` 修飾符，您可以處理單次按鍵輸入，而 `onPreviewKeyEvent` 更適合用於定義快捷鍵。

以下範例演示了 `TextField` 互動，其中根據按住 <shortcut>Ctrl</shortcut> 時所按下的按鍵，執行不同的動作。
將此程式碼新增至 `composeApp/src/jvmMain/kotlin` 資料夾中的 `main.kt` 檔案：

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

<img src="compose-desktop-key-focus.animated.gif" alt="Keyboard events in a focused component" width="600" preview-src="compose-desktop-key-focus.png"/>

## 視窗範圍中的事件

若要定義在目前視窗中始終處於活動狀態的鍵盤事件處理器，請使用 `Window`、`singleWindowApplication` 和 `Dialog` 函數可用的 `onPreviewKeyEvent` 和 `onKeyEvent` 參數。
它們的區別在於事件未被消耗時的分派方式：`onPreviewKeyEvent` 將事件分派給其第一個子項，而 `onKeyEvent` 將事件分派給可組合項的父項。通常，`onPreviewKeyEvent` 更適合用於攔截事件，因為它甚至允許實作全螢幕鍵盤快捷鍵。

以下範例演示了視窗互動，例如透過按下 `Escape` 鍵關閉彈出式對話框，以及透過按下 <shortcut>Ctrl+Shift+C</shortcut> 快捷鍵更改視窗內容。
將此程式碼新增至 `composeApp/src/jvmMain/kotlin` 資料夾中的 `main.kt` 檔案：

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

<img src="compose-desktop-key-window.animated.gif" alt="Keyboard events in a window scope" width="600" preview-src="compose-desktop-key-window.png"/>

## 接下來是什麼？

*   有關詳細資訊，請參閱 [API 參考](https://developer.android.com/reference/kotlin/androidx/compose/ui/input/key/package-summary#keyinputfilter)。
*   探索有關 [其他桌面組件](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop) 的教學。