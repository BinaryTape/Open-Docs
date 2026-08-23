[//]: # (title: トレイと通知)
<web-summary>Compose Multiplatform for desktop において、システムトレイにアプリケーションアイコンを追加し、システム通知を送信する方法について学びます。</web-summary>

Compose Multiplatform for desktop では、システムトレイにアプリケーションアイコンを追加し、そこからシステム通知を送信することができます。

undefined

## システムトレイ

システムトレイにアプリケーションアイコンを追加するには、`Tray()` コンポーザブルを使用します。`Tray()` は `application()` 関数のスコープ内で利用可能なため、アプリケーションウィンドウと並行して、あるいは単独で呼び出すことができます。

`Tray()` コンポーザブルには、以下のパラメータがあります。

* `icon` – トレイアイコンを描画する `Painter` です。
* `menu` – トレイメニューの内容です。Windows では右クリック、macOS では左クリックでメニューが開きます。項目を追加しない場合、メニューは表示されません。
* `state` – 通知の送信に使用される `TrayState` です。
* `tooltip` – ユーザーがアイコンの上にマウスを置いた（ホバーした）ときに表示されるヒントです。
* `onAction` – アイコンをクリックしたときにトリガーされるアクションです。Windows ではダブルクリック、macOS では右クリックとなります。

以下の例では、3 つのメニュー項目を持つアプリケーションアイコンをトレイに作成します。
* **Increment value**：ウィンドウに表示されている状態（値）を変更します。
* **Send notification**：システム通知を送信します。
* **Exit**：アプリケーションを終了します。

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
            // Window content:
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

<img src="compose-desktop-tray.animated.gif" alt="Tray menu and notification" width="600" preview-src="compose-desktop-tray.png"/>

すべてのデスクトップ環境にシステムトレイがあるわけではありません。プラットフォームがサポートしていない場合、`Tray()` は例外をスローする代わりに、標準エラー出力にエラーを出力します。アプリケーションでトレイ関連のオプションを表示する前に、`isTraySupported` プロパティを確認してください。

### ウィンドウなしのトレイ

アプリケーションにトレイアイコンを表示させるために、必ずしもウィンドウが必要なわけではありません。`Tray()` 関数のみが呼び出された場合、アプリケーションは完全にシステムトレイ内のみで実行されます。

```kotlin
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.window.Tray
import androidx.compose.ui.window.application

fun main() = application {
    Tray(
        icon = TrayIcon,
        menu = {
            Item(
                "Exit",
                onClick = ::exitApplication
            )
        }
    )
}

object TrayIcon : Painter() {
    override val intrinsicSize = Size(256f, 256f)

    override fun DrawScope.onDraw() {
        drawOval(Color(0xFFFFA500))
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Tray(icon = TrayIcon, menu = { Item( "}

閉じるためのウィンドウが存在しないため、メニュー項目から `exitApplication()` を呼び出す必要があります。

## 通知

システム通知を送信するには、[システムトレイの例](#system-tray)のように `rememberNotification()` で通知を作成し、それを `TrayState.sendNotification()` に渡します。通知は、`Tray()` コンポーザブルに渡された `TrayState` を通じて配信されます。ステートがトレイに関連付けられていない場合、通知は失われます。

通知は、タイトル、メッセージ、および通知のアイコンと音を定義するタイプ（Type）で構成されます。利用可能なタイプは、`None`（デフォルト）、`Info`、`Warning`、`Error` です。

アイコンや音に使用される具体的なアセットは、プラットフォームによって異なります。

> macOS で通知をテストするには、アプリがパッケージ化（packaged）されている必要があります。そうでない場合、通知は表示されません。
>
{style="note"}

## 次のステップ

* ウィンドウに [メニューバー](compose-desktop-menu-bar.md) を追加する方法を学ぶ。
* [その他のデスクトップコンポーネント](compose-desktop-components.md) に関するチュートリアルを確認する。