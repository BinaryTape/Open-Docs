[//]: # (title: キーボードイベント)

Compose Multiplatform for desktop では、2つの異なるスコープでイベントハンドラーを設定することにより、キーボードイベントを管理できます。

*   フォーカスされた要素に基づくイベントハンドラー。
*   ウィンドウスコープでのイベントハンドラー。

## フォーカスされたコンポーネントでのイベント

このアプローチは、キーボードでキーを押すと、現在フォーカスされているコンポーネントのイベントハンドラーがトリガーされることを意味します。

一般的なシナリオは、`TextField` のようなアクティブなコントロールに対してキーボードハンドラーを定義することです。キーイベントがデフォルトのアクションをトリガーする前にそれをインターセプトするには、`onKeyEvent` と `onPreviewKeyEvent` の両方のモディファイアを使用できます。
`onKeyEvent` モディファイアを使用すると、個々のキーストロークを処理でき、`onPreviewKeyEvent` はショートカットの定義に適しています。

以下のサンプルは、<shortcut>Ctrl</shortcut> を押しながらどのキーが押されたかによって異なるアクションを伴う `TextField` のインタラクションを示しています。

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

## ウィンドウスコープでのイベント

現在のウィンドウ内で常にアクティブなキーボードイベントハンドラーを定義するには、`Window`、`singleWindowApplication`、および `Dialog` 関数で利用可能な `onPreviewKeyEvent` と `onKeyEvent` パラメーターを使用します。
これらは、イベントが消費されなかった場合のディスパッチ方法が異なります。`onPreviewKeyEvent` はイベントを最初のチャイルドにディスパッチし、`onKeyEvent` はイベントをコンポーザブルの親にディスパッチします。通常、`onPreviewKeyEvent` はイベントのインターセプトに適しており、画面全体のキーボードショートカットの実装も可能です。

以下のサンプルは、`Escape` を押してポップアップダイアログを閉じたり、<shortcut>Ctrl+Shift+C</shortcut> ショートカットを押してウィンドウコンテンツを変更したりするような、ウィンドウのインタラクションを示しています。

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

## 次にすること

*   詳細については、[APIリファレンス](https://developer.android.com/reference/kotlin/androidx/compose/ui/input/key/package-summary#keyinputfilter)を参照してください。
*   [他のデスクトップコンポーネント](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop)に関するチュートリアルを探索してください。