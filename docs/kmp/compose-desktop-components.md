[//]: # (title: 桌面专用 API)

您可以使用 Compose Multiplatform 创建 macOS、Linux 和 Windows 桌面应用程序。本页简要概述了桌面特有的组件和事件。每个部分都包含一个指向详细教程的链接。

## 组件

<!-- * [Images and icons](#images-and-icons) -->
* [窗口和对话框](compose-desktop-top-level-windows-management.md)
* [上下文菜单](compose-desktop-context-menus.md)
* [系统托盘](#the-system-tray)
* [菜单栏](#menu-bar)
* [滚动条](compose-desktop-scrollbars.md)
* [工具提示](compose-desktop-tooltips.md)

<!-- ### Images and icons

You can use the `Image` composable and the `painterResource()` function to display images stored as resources in your
application:

```kotlin
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.window.singleWindowApplication

fun main() = singleWindowApplication {
    Image(
        painter = painterResource("sample.png"),
        contentDescription = "Sample",
        modifier = Modifier.fillMaxSize()
    )
}
```

`painterResource()` supports rasterized image formats, such as `.png`, `.jpg`, `.bmp`, `.webp`, and the Android XML vector
drawable format. You can also use images stored in the device memory, load images from the network,
or create them in your project using `Canvas()`.

With Compose Multiplatform, you can set the application window icon and the application tray icon as well.

* For more information on working with images using Compose Multiplatform in desktop projects, see
  the [Image and in-app icon manipulations](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Image_And_Icons_Manipulations)
  tutorial.
* For more information on using resources in common code in Compose Multiplatform projects, see [Images and resources](compose-multiplatform-resources.md). -->

### 系统托盘

您可以使用 `Tray` composable 在系统托盘中向用户发送通知：

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

通知有以下三种类型：

*   `notify`：一个简单通知。
*   `warn`：一个警告通知。
*   `error`：一个错误通知。

您还可以将应用程序图标添加到系统托盘。

更多信息请参见 [菜单、托盘和通知](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Tray_Notifications_MenuBar_new#tray) 教程。

### 菜单栏

您可以使用 `MenuBar` composable 创建和自定义特定窗口的菜单栏：

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

更多信息请参见 [菜单、托盘和通知](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Tray_Notifications_MenuBar_new#menubar) 教程。

## 事件

* [鼠标事件](compose-desktop-mouse-events.md)
* [键盘事件](compose-desktop-keyboard.md)
* [Tab 键导航](#tabbing-navigation-between-components)

### 组件之间的 Tab 键导航

您可以使用 <shortcut>Tab</shortcut> 键盘快捷键设置组件之间的导航，用于切换到下一个组件，使用 <shortcut>⇧ + Tab</shortcut> 切换到上一个组件。

默认情况下，Tab 键导航允许您按照组件出现的顺序在可聚焦组件之间移动。可聚焦组件包括 `TextField`、`OutlinedTextField` 和 `BasicTextField` composable，以及使用 `Modifier.clickable` 的组件，例如 `Button`、`IconButton` 和 `MenuItem`。

例如，以下是一个窗口示例，用户可以使用标准快捷键在五个文本字段之间导航：

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

您还可以将不可聚焦组件变为可聚焦组件，自定义 Tab 键导航的顺序，并将组件置于焦点。

更多信息请参见 [Tab 键导航和键盘焦点](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Tab_Navigation) 教程。

## 后续步骤

*   了解如何 [为您的 Compose Multiplatform 桌面项目创建单元测试](compose-desktop-ui-testing.md)。
*   了解如何 [为桌面平台创建原生分发、安装程序和软件包](compose-native-distribution.md)。
*   设置 [与 Swing 的互操作性并将您的 Swing 应用程序迁移到 Compose Multiplatform](compose-desktop-swing-interoperability.md)。
*   了解 [不同平台上的无障碍功能支持](compose-desktop-accessibility.md)。