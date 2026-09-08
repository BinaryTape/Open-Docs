[//]: # (title: メニューバー)
<web-summary>Compose Multiplatform for desktopを使用して、特定のウィンドウにメニューバーを作成する方法を学びます。</web-summary>

`MenuBar()` コンポーザブルを使用して、特定のウィンドウのメニューバーを作成できます。`MenuBar()` は `Window()` コンポーザブルのスコープ（scope）内で利用可能なため、各ウィンドウが独自のメニューバーを持つことができます。

undefined

`MenuBar()` では以下のコンポーネントを使用できます：

* `Menu()` – メニューまたはサブメニュー
* `Item()` – クリック可能なメニュー項目
* `CheckboxItem()` – チェックボックス付きの項目
* `RadioButtonItem()` – ラジオボタン付きの項目
* `Separator()` – 項目のグループを区切る水平線

項目とメニューは `mnemonic`（ニーモニック）パラメータを受け取ります。これは <shortcut>Alt</shortcut> と同時に押されたときに、メニューを開いたり項目を実行したりする文字です。その文字がテキスト内に含まれている場合、最初に出現する箇所に下線が表示されます。また、項目は `shortcut` パラメータも受け取ります。これは、メニューを辿ることなくアクションを実行する `KeyShortcut` です。

> `KeyShortcut` で `ctrl = true` を設定すると、macOS を含め常に <shortcut>Ctrl</shortcut> にマッピングされます。標準的な macOS のショートカットに <shortcut>⌘</shortcut> を使用するには、代わりに `meta = true` を設定してください。
>
{style="tip"}

メニューの内容はコンポーザブル（composable）であるため、`MenuBar()` 内で条件分岐やループを使用して、どの項目を表示するかを決定できます。読み取っている状態（state）が変化すると、メニューは更新されます。次の例では、**Advanced settings** チェックボックスが選択されている間だけ **Settings** サブメニューが表示されます。

```kotlin
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material.Text
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.KeyShortcut
import androidx.compose.ui.window.MenuBar
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application

fun main() = application {
    var action by remember { mutableStateOf("Last action: None") }
    var isOpen by remember { mutableStateOf(true) }

    if (isOpen) {
        var isSubmenuShowing by remember { mutableStateOf(false) }

        Window(onCloseRequest = { isOpen = false }) {
            MenuBar {
                Menu("File", mnemonic = 'F') {
                    Item("Copy", onClick = { action = "Last action: Copy" }, shortcut = KeyShortcut(Key.C, ctrl = true))
                    Item(
                        "Paste",
                        onClick = { action = "Last action: Paste" },
                        shortcut = KeyShortcut(Key.V, ctrl = true)
                    )
                }
                Menu("Actions", mnemonic = 'A') {
                    CheckboxItem(
                        "Advanced settings",
                        checked = isSubmenuShowing,
                        onCheckedChange = {
                            isSubmenuShowing = !isSubmenuShowing
                        }
                    )
                    if (isSubmenuShowing) {
                        Menu("Settings") {
                            Item("Setting 1", onClick = { action = "Last action: Setting 1" })
                            Item("Setting 2", onClick = { action = "Last action: Setting 2" })
                        }
                    }
                    Separator()
                    Item("About", icon = AboutIcon, onClick = { action = "Last action: About" })
                    Item("Exit", onClick = { isOpen = false }, shortcut = KeyShortcut(Key.Escape), mnemonic = 'E')
                }
            }

            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Text(text = action)
            }
        }
    }
}

object AboutIcon : Painter() {
    override val intrinsicSize = Size(256f, 256f)

    override fun DrawScope.onDraw() {
        drawOval(Color(0xFFFFA500))
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Window(MenuBar { Menu( "}

<img src="compose-desktop-menu-bar.animated.gif" alt="Desktop menu bar" width="600" preview-src="compose-desktop-menu-bar.png"/>

Windows および Linux では、メニューバーはウィンドウの一部として表示されます。macOS では、ウィンドウがアクティブなときに画面上部のシステムメニューバーに表示されます。

## 次のステップ {id="what-s-next"}

* アプリケーションアイコンとメニューを[システムトレイ](compose-desktop-tray.md)に追加する方法を学ぶ。
* [その他のデスクトップコンポーネント](compose-desktop-components.md)に関するチュートリアルを調べる。