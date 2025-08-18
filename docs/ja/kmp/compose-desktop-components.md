[//]: # (title: デスクトップ専用API)

Compose Multiplatformを使用すると、macOS、Linux、Windowsのデスクトップアプリケーションを作成できます。このページでは、デスクトップ固有のコンポーネントとイベントの概要を簡単に説明します。各セクションには、詳細なチュートリアルへのリンクが含まれています。

## コンポーネント

*   [ウィンドウとダイアログ](compose-desktop-top-level-windows-management.md)
*   [コンテキストメニュー](compose-desktop-context-menus.md)
*   [システムトレイ](#the-system-tray)
*   [メニューバー](#menu-bar)
*   [スクロールバー](compose-desktop-scrollbars.md)
*   [ツールチップ](compose-desktop-tooltips.md)

### システムトレイ

`Tray`コンポーザブルを使用して、システムトレイにユーザーへの通知を送信できます。

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
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.window.Tray
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application
import androidx.compose.ui.window.rememberNotification
import androidx.compose.ui.window.rememberTrayState

fun main() = application {
    var count by remember { mutableStateOf(0) }
    var isOpen by remember { mutableStateOf(true) }

    if (isOpen) {
        val trayState = rememberTrayState()
        val notification = rememberNotification("Notification", "Message from MyApp!")

        Tray(
            state = trayState,
            icon = TrayIcon,
            menu = {
                Item(
                    "Increment value",
                    onClick = {
                        count++
                    }
                )
                Item(
                    "Send notification",
                    onClick = {
                        trayState.sendNotification(notification)
                    }
                )
                Item(
                    "Exit",
                    onClick = {
                        isOpen = false
                    }
                )
            }
        )

        Window(
            onCloseRequest = {
                isOpen = false
            },
            icon = MyAppIcon
        ) {
            // Content:
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                Text(text = "Value: $count")
            }
        }
    }
}

object MyAppIcon : Painter() {
    override val intrinsicSize = Size(256f, 256f)

    override fun DrawScope.onDraw() {
        drawOval(Color.Green, Offset(size.width / 4, 0f), Size(size.width / 2f, size.height))
        drawOval(Color.Blue, Offset(0f, size.height / 4), Size(size.width, size.height / 2f))
        drawOval(Color.Red, Offset(size.width / 4, size.height / 4), Size(size.width / 2f, size.height / 2f))
    }
}

object TrayIcon : Painter() {
    override val intrinsicSize = Size(256f, 256f)

    override fun DrawScope.onDraw() {
        drawOval(Color(0xFFFFA500))
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Tray(state = trayState, icon = TrayIcon, menu = { Item( "}

通知には3つの種類があります。

*   `notify`: シンプルな通知。
*   `warn`: 警告通知。
*   `error`: エラー通知。

アプリケーションアイコンをシステムトレイに追加することもできます。

詳細については、[メニュー、トレイ、および通知](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Tray_Notifications_MenuBar_new#tray)チュートリアルを参照してください。

### メニューバー

`MenuBar`コンポーザブルを使用して、特定のウィンドウのメニューバーを作成およびカスタマイズできます。

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
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.KeyShortcut
import androidx.compose.ui.window.MenuBar
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.application

@OptIn(ExperimentalComposeUiApi::class)
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

詳細については、[メニュー、トレイ、および通知](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Tray_Notifications_MenuBar_new#menubar)チュートリアルを参照してください。

## イベント

*   [マウスイベント](compose-desktop-mouse-events.md)
*   [キーボードイベント](compose-desktop-keyboard.md)
*   [コンポーネント間のタブナビゲーション](#tabbing-navigation-between-components)

### コンポーネント間のタブナビゲーション

<shortcut>Tab</shortcut>キーボードショートカットで次のコンポーネントへ、<shortcut>⇧ + Tab</shortcut>で前のコンポーネントへのナビゲーションを設定できます。

デフォルトでは、タブナビゲーションは、フォーカス可能なコンポーネント間を、それらの表示順に移動できます。フォーカス可能なコンポーネントには、`TextField`、`OutlinedTextField`、および`BasicTextField`コンポーザブルのほか、`Button`、`IconButton`、`MenuItem`など、`Modifier.clickable`を使用するコンポーネントが含まれます。

たとえば、ユーザーが標準のショートカットを使用して5つのテキストフィールド間を移動できるウィンドウを次に示します。

```kotlin
import androidx.compose.ui.window.application
import androidx.compose.ui.window.Window
import androidx.compose.ui.window.WindowState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.Spacer
import androidx.compose.material.OutlinedTextField
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.DpSize
import androidx.compose.ui.unit.dp

fun main() = application {
    Window(
        state = WindowState(size = DpSize(350.dp, 500.dp)),
        onCloseRequest = ::exitApplication
    ) {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Column(
                modifier = Modifier.padding(50.dp)
            ) {
                for (x in 1..5) {
                    val text = remember { mutableStateOf("") }
                    OutlinedTextField(
                        value = text.value,
                        singleLine = true,
                        onValueChange = { text.value = it }
                    )
                    Spacer(modifier = Modifier.height(20.dp))
                }
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Column() { for (x in 1..5) { OutlinedTextField("}

また、フォーカスできないコンポーネントをフォーカス可能にしたり、タブナビゲーションの順序をカスタマイズしたり、コンポーネントにフォーカスを当てたりすることもできます。

詳細については、[タブナビゲーションとキーボードフォーカス](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Tab_Navigation)チュートリアルを参照してください。

## 次のステップ

*   [Compose Multiplatformデスクトップアプリケーション](https://github.com/JetBrains/compose-multiplatform-desktop-template#readme)チュートリアルを完了します。
*   [Compose Multiplatformデスクトッププロジェクトのユニットテストを作成する方法](compose-desktop-ui-testing.md)を学習します。
*   [デスクトッププラットフォーム用のネイティブディストリビューション、インストーラー、およびパッケージを作成する方法](compose-native-distribution.md)を学習します。
*   [Swingとの相互運用を設定し、SwingアプリケーションをCompose Multiplatformに移行します](compose-desktop-swing-interoperability.md)。
*   [さまざまなプラットフォームでのアクセシビリティサポート](compose-desktop-accessibility.md)について学習します。