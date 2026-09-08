[//]: # (title: 系統匣與通知)
<web-summary>了解如何在 Compose Multiplatform for desktop 中將應用程式圖示新增至系統匣，並傳送系統通知。</web-summary>

在 Compose Multiplatform for desktop 中，您可以將應用程式圖示新增至系統匣，並透過其傳送系統通知。

undefined

## 系統匣 {id="system-tray"}

使用 `Tray()` composable 將應用程式圖示新增至系統匣。`Tray()` 可在 `application()` 函式的作用域（scope）內使用，因此可以與應用程式視窗一起呼叫，或是單獨呼叫。

`Tray()` composable 具有以下參數：

* `icon` – 繪製系統匣圖示的 `Painter`。
* `menu` – 系統匣功能表的內容。在 Windows 上透過按一下右鍵開啟功能表，在 macOS 上則透過按一下左鍵開啟。若未新增任何項目，則不會顯示功能表。
* `state` – 用於傳送通知的 `TrayState`。
* `tooltip` – 當使用者將游標停留在圖示上時顯示的提示。
* `onAction` – 點擊圖示時觸發的操作：在 Windows 上為按兩下，在 macOS 上為按一下右鍵。

以下範例在系統匣中建立了一個具有三個功能表項目的應用程式圖示： 
* **Increment value**（遞增值）會更改視窗中顯示的狀態。
* **Send notification**（傳送通知）會傳送一個系統通知。
* **Exit**（結束）會關閉應用程式。

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
            // 視窗內容：
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

並非每個桌面環境都有系統匣。如果平台不支援，`Tray()` 會將錯誤輸出到標準錯誤流（standard error stream），而不是擲回例外狀況（exception）。在應用程式中顯示與系統匣相關的選項之前，請檢查 `isTraySupported` 屬性。

### 無視窗的系統匣 {id="tray-without-a-window"}

應用程式不需要視窗也能擁有系統匣圖示。如果僅呼叫 `Tray()` 函式，應用程式將完全在系統匣中執行：

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

因為沒有可關閉的視窗，所以應從功能表項目中呼叫 `exitApplication()`。

## 通知 {id="notifications"}

若要傳送系統通知，請使用 `rememberNotification()` 建立通知，並將其傳遞給 `TrayState.sendNotification()`，如[系統匣範例](#system-tray)所示。通知是透過傳遞給 `Tray()` composable 的 `TrayState` 進行傳送的。如果該狀態未附加到系統匣，通知將會遺失。

通知包含標題、訊息和類型，類型定義了通知的圖示和聲音。可用的類型有 `None`（預設選項）、`Info`、`Warning` 和 `Error`。

用於圖示和聲音的具體資源取決於平台。

> 若要在 macOS 上測試通知，必須將應用程式封裝。否則，將不會顯示通知。
>
{style="note"}

## 接下來 {id="what-s-next"}

* 了解如何為視窗新增 [功能表列](compose-desktop-menu-bar.md)。
* 探索關於 [其他桌面組建](compose-desktop-components.md) 的教學。