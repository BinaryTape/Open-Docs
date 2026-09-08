[//]: # (title: 菜单栏)
<web-summary>了解如何使用 Compose Multiplatform 桌面端为特定窗口创建菜单栏。</web-summary>

你可以使用 `MenuBar()` 可组合项为特定窗口创建菜单栏。`MenuBar()` 可用于 `Window()` 可组合项的作用域内，因此每个窗口都可以拥有自己的菜单栏。

undefined

你可以在 `MenuBar()` 中使用以下组件：

* `Menu()` – 菜单或子菜单
* `Item()` – 可点击的菜单项
* `CheckboxItem()` – 带有复选框的项目
* `RadioButtonItem()` – 带有单选按钮的项目
* `Separator()` – 分隔项目组的水平线

项目和菜单接受 `mnemonic` 参数，即与 <shortcut>Alt</shortcut> 键配合按下时可打开菜单或触发该项的字符。如果该字符出现在文本中，其首次出现的位置会带有下划线。项目还接受 `shortcut` 参数 – 这是一个 `KeyShortcut`，无需导航菜单即可触发操作。

> 在 `KeyShortcut` 中设置 `ctrl = true` 始终映射到 <shortcut>Ctrl</shortcut> 键，包括在 macOS 上。要在标准 macOS 快捷键中使用 <shortcut>⌘</shortcut>，请改为设置 `meta = true`。
>
{style="tip"}

菜单内容是可组合的，因此你可以在 `MenuBar()` 内部使用条件和循环来决定存在哪些项目。当它们读取的状态发生变化时，菜单也会随之更新。在以下示例中，仅当选中 **Advanced settings** 复选框时，**Settings** 子菜单才会存在：

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

在 Windows 和 Linux 上，菜单栏是窗口的一部分。在 macOS 上，当窗口处于活动状态时，它会显示在屏幕顶部的系统菜单栏中。

## 后续步骤 {id="what-s-next"}

* 了解如何将应用程序图标和菜单添加到[系统托盘](compose-desktop-tray.md)。
* 探索有关[其他桌面组件](compose-desktop-components.md)的教程。