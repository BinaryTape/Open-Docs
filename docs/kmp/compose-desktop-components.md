[//]: # (title: 桌面平台特有 API)

你可以使用 Compose Multiplatform 来创建 macOS、Linux 和 Windows 桌面应用程序。本页面简要概述了桌面平台特有的组件和事件。每个章节都包含指向详细教程的链接。

## 组件

<!-- * [图像和图标](#图像和图标) -->
* [窗口和对话框](compose-desktop-top-level-windows-management.md)
* [上下文菜单](compose-desktop-context-menus.md)
* [系统托盘](#the-system-tray)
* [菜单栏](#menu-bar)
* [滚动条](compose-desktop-scrollbars.md)
* [工具提示](compose-desktop-tooltips.md)

<!-- ### 图像和图标

你可以使用 `Image` 可组合项和 `painterResource()` 函数来显示存储在应用程序资源中的图像：

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

`painterResource()` 支持光栅图像格式（例如 `.png`、`.jpg`、`.bmp`、`.webp`）和 Android XML 矢量可绘制格式。你还可以使用存储在设备内存中的图像、从网络加载图像，或使用 `Canvas()` 在你的项目中创建它们。

通过 Compose Multiplatform，你还可以设置应用程序窗口图标和应用程序托盘图标。

* 有关在桌面项目中通过 Compose Multiplatform 处理图像的更多信息，请参阅[图像和应用内图标操作](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Image_And_Icons_Manipulations)教程。
* 有关在 Compose Multiplatform 项目中公共代码中使用资源的更多信息，请参阅[图像和资源](compose-multiplatform-resources.md)。 -->

### 系统托盘

你可以使用 `Tray` 可组合项向系统托盘中的用户发送通知：

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

通知有三种类型：

*   `notify`，一种简单通知。
*   `warn`，一种警告通知。
*   `error`，一种错误通知。

你还可以将应用程序图标添加到系统托盘。

有关更多信息，请参阅[菜单、托盘和通知](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Tray_Notifications_MenuBar_new#tray)教程。

### 菜单栏

你可以使用 `MenuBar` 可组合项为特定窗口创建和自定义菜单栏：

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

有关更多信息，请参阅[菜单、托盘和通知](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Tray_Notifications_MenuBar_new#menubar)教程。

## 事件

* [鼠标事件](compose-desktop-mouse-events.md)
* [键盘事件](compose-desktop-keyboard.md)
* [组件间的 Tab 键导航](#tabbing-navigation-between-components)

### 组件间的 Tab 键导航

你可以使用 <shortcut>Tab</shortcut> 键盘快捷方式导航到下一个组件，使用 <shortcut>⇧ + Tab</shortcut> 导航到上一个组件。

默认情况下，Tab 键导航允许你按照组件的出现顺序在可聚焦组件之间移动。可聚焦组件包括 `TextField`、`OutlinedTextField` 和 `BasicTextField` 可组合项，以及使用 `Modifier.clickable` 的组件，例如 `Button`、`IconButton` 和 `MenuItem`。

例如，这是一个窗口，用户可以使用标准快捷方式在五个文本字段之间导航：

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

你还可以将不可聚焦的组件设置为可聚焦，自定义 Tab 键导航的顺序，并将组件设置为焦点。

有关更多信息，请参阅[Tab 键导航和键盘焦点](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Tab_Navigation)教程。

## 后续步骤

*   完成 [Compose Multiplatform 桌面应用程序](https://github.com/JetBrains/compose-multiplatform-desktop-template#readme)教程。
*   了解如何为你的 Compose Multiplatform 桌面项目[创建单元测试](compose-desktop-ui-testing.md)。
*   了解如何为桌面平台[创建原生分发包、安装程序和软件包](compose-native-distribution.md)。
*   设置与 Swing 的[互操作性](compose-desktop-swing-interoperability.md)，并将你的 Swing 应用程序迁移到 Compose Multiplatform。
*   了解[不同平台上的可访问性支持](compose-desktop-accessibility.md)。