[//]: # (title: 功能表列)
<web-summary>了解如何使用 Compose Multiplatform 桌面版為特定視窗建立功能表列。</web-summary>

您可以使用 `MenuBar()` composable 為特定視窗建立功能表列。`MenuBar()` 在 `Window()` composable 的作用域（scope）內可用，因此每個視窗都可以擁有自己的功能表列。

undefined

您可以在 `MenuBar()` 中使用以下組件：

* `Menu()` – 功能表或子功能表
* `Item()` – 可點擊的功能表項目
* `CheckboxItem()` – 帶有核取方塊的項目
* `RadioButtonItem()` – 帶有選項按鈕的項目
* `Separator()` – 分隔項目群組的水平線

項目和功能表接受 `mnemonic` 參數，這是一個助記鍵（mnemonic）字元，與 <shortcut>Alt</shortcut> 同時按下時可開啟功能表或觸發項目。如果該字元出現在文字中，則其首次出現處會加上底線。項目還接受 `shortcut` 參數 – 即在不瀏覽功能表的情況下即可觸發操作的 `KeyShortcut` 快速鍵。

> 在 `KeyShortcut` 中設定 `ctrl = true` 一律會對應到 <shortcut>Ctrl</shortcut>，包括在 macOS 上。若要在標準 macOS 快速鍵中使用 <shortcut>⌘</shortcut>，請改為設定 `meta = true`。
>
{style="tip"}

功能表內容是可組合的（composable），因此您可以在 `MenuBar()` 內使用條件判斷和迴圈來決定存在哪些項目。當它們讀取的狀態發生變化時，功能表也會隨之更新。在以下範例中，**Settings** 子功能表僅在勾選 **Advanced settings** 核取方塊時存在：

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

在 Windows 和 Linux 上，功能表列是視窗的一部分。在 macOS 上，當視窗處於活動狀態時，它會顯示在螢幕頂端的系統功能表列中。

## 後續步驟 {id="what-s-next"}

* 了解如何將應用程式圖示和功能表新增至 [系統匣](compose-desktop-tray.md)。
* 探索有關 [其他桌面組件](compose-desktop-components.md) 的教學。