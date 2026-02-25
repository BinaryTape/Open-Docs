[//]: # (title: キーボードイベント)

Compose Multiplatform for desktop では、以下の 2 つの異なるスコープでイベントハンドラーを設定することで、キーボードイベントを管理できます。

* フォーカスされている要素に基づいたイベントハンドラー。
* ウィンドウスコープのイベントハンドラー。

## フォーカスされたコンポーネントにおけるイベント

このアプローチでは、キーボードのキーを押すと、現在フォーカスされているコンポーネントのイベントハンドラーがトリガーされます。

一般的なシナリオは、`TextField` のようなアクティブなコントロールに対してキーボードハンドラーを定義することです。キーイベントがデフォルトのアクションをトリガーする前にインターセプトするには、`onKeyEvent` と `onPreviewKeyEvent` の両方のモディファイアを使用できます。
`onKeyEvent` モディファイアでは個々のキーストロークを処理でき、`onPreviewKeyEvent` はショートカットの定義に適しています。

次の例は、<shortcut>Ctrl</shortcut> を押しながら押されたキーに応じて、異なるアクションを実行する `TextField` のインタラクションを示しています。
このコードを `composeApp/src/jvmMain/kotlin` の `main.kt` ファイルに追加してください。

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

## ウィンドウスコープにおけるイベント

現在のウィンドウ内で常にアクティブなキーボードイベントハンドラーを定義するには、`Window`、`singleWindowApplication`、および `Dialog` 関数で使用可能な `onPreviewKeyEvent` および `onKeyEvent` パラメーターを使用します。
これらは、イベントが消費されなかった場合のディスパッチ方法が異なります。`onPreviewKeyEvent` はイベントを最初の子要素にディスパッチし、`onKeyEvent` はコンポーザブルの親にディスパッチします。通常、画面全体のキーボードショートカットも実装できるため、イベントをインターセプトするには `onPreviewKeyEvent` が好まれます。

次のサンプルは、`Escape` を押してポップアップダイアログを閉じる操作や、<shortcut>Ctrl+Shift+C</shortcut> ショートカットを押してウィンドウの内容を変更するなどのウィンドウインタラクションを示しています。
このコードを `composeApp/src/jvmMain/kotlin` の `main.kt` ファイルに追加してください。

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

## 次のステップ

* 詳細は [API リファレンス](https://developer.android.com/reference/kotlin/androidx/compose/ui/input/key/package-summary#keyinputfilter)を参照してください。
* [その他のデスクトップコンポーネント](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop)に関するチュートリアルを確認してください。