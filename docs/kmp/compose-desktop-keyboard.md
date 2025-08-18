[//]: # (title: 键盘事件)

在桌面版 Compose Multiplatform 中，你可以通过在两个不同的作用域中设置事件处理程序来管理键盘事件：

*   基于焦点元素的事件处理程序。
*   窗口作用域中的事件处理程序。

## 焦点组件中的事件

这种方法意味着，按下键盘上的按键会触发当前焦点组件的事件处理程序。

典型的场景是为 `TextField` 等活动控件定义键盘处理程序。为了在按键事件触发默认操作之前进行拦截，你可以同时使用 `onKeyEvent` 和 `onPreviewKeyEvent` 修饰符。使用 `onKeyEvent` 修饰符可以处理单个按键操作，而 `onPreviewKeyEvent` 更适合定义快捷方式。

以下示例演示了 `TextField` 的交互，其行为取决于在你按住 <shortcut>Ctrl</shortcut> 时按下了哪个键：

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

<img src="compose-desktop-key-focus.animated.gif" alt="焦点组件中的键盘事件" width="600" preview-src="compose-desktop-key-focus.png"/>

## 窗口作用域中的事件

要定义在当前窗口中始终处于活动状态的键盘事件处理程序，请使用 `Window`、`singleWindowApplication` 和 `Dialog` 函数可用的 `onPreviewKeyEvent` 和 `onKeyEvent` 参数。它们的区别在于事件未被消费时如何分派：`onPreviewKeyEvent` 将事件分派给其第一个子级，而 `onKeyEvent` 将事件分派给可组合项的父级。通常，`onPreviewKeyEvent` 更适合拦截事件，因为它允许实现甚至全屏范围的键盘快捷方式。

以下示例演示了窗口交互，例如通过按 `Escape` 键关闭弹出对话框，以及通过按 <shortcut>Ctrl+Shift+C</shortcut> 快捷方式更改窗口内容：

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

<img src="compose-desktop-key-window.animated.gif" alt="窗口作用域中的键盘事件" width="600" preview-src="compose-desktop-key-window.png"/>

## 接下来是什么？

*   有关详情，请参阅 [API 参考](https://developer.android.com/reference/kotlin/androidx/compose/ui/input/key/package-summary#keyinputfilter)。
*   探索有关 [其他桌面组件](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop) 的教程。