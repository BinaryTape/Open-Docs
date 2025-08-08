[//]: # (title: 桌面專屬 API)

您可以使用 Compose Multiplatform 建立 macOS、Linux 和 Windows 桌面應用程式。本頁簡要概述了桌面專屬的元件與事件。每個章節都包含一個連結，指向詳細的教學。

## 元件

<!-- * [Images and icons](#images-and-icons) -->
* [視窗與對話框](compose-desktop-top-level-windows-management.md)
* [環境選單](compose-desktop-context-menus.md)
* [系統匣](#the-system-tray)
* [選單列](#menu-bar)
* [捲軸](compose-desktop-scrollbars.md)
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
* For more information on using resources in common code in Compose Multiplatform projects, see [Images and resources](compose-multiplatform-resources.md)。 -->

### 系統匣

您可以使用 `Tray` 可組合項向系統匣中的使用者傳送通知：

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

有三種類型的通知：

* `notify`，一個簡單的通知。
* `warn`，一個警告通知。
* `error`，一個錯誤通知。

您也可以將應用程式圖示新增至系統匣。

如需更多資訊，請參閱 [選單、系統匣與通知](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Tray_Notifications_MenuBar_new#tray) 教學。

### 選單列

您可以使用 `MenuBar` 可組合項為特定視窗建立及自訂選單列：

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

如需更多資訊，請參閱 [選單、系統匣與通知](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Tray_Notifications_MenuBar_new#menubar) 教學。

## 事件

* [滑鼠事件](compose-desktop-mouse-events.md)
* [鍵盤事件](compose-desktop-keyboard.md)
* [元件間的 Tab 鍵導覽](#tabbing-navigation-between-components)

### 元件間的 Tab 鍵導覽

您可以使用 <shortcut>Tab</shortcut> 鍵盤快速鍵來設定元件間的導覽，<shortcut>Tab</shortcut> 鍵用於下一個元件，而 <shortcut>⇧ + Tab</shortcut> 鍵則用於上一個元件。

依預設，Tab 鍵導覽可讓您依其出現順序在可獲取焦點的元件之間移動。可獲取焦點的元件包括 `TextField`、`OutlinedTextField` 和 `BasicTextField` 可組合項，以及使用 `Modifier.clickable` 的元件，例如 `Button`、`IconButton` 和 `MenuItem`。

例如，這是一個視窗，使用者可以使用標準快速鍵在五個文字欄位之間導覽：

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

您還可以讓不可獲取焦點的元件變為可獲取焦點，自訂 Tab 鍵導覽的順序，並將元件設定為焦點。

如需更多資訊，請參閱 [Tab 鍵導覽與鍵盤焦點](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Tab_Navigation) 教學。

## 接下來

* 完成 [Compose Multiplatform 桌面應用程式](https://github.com/JetBrains/compose-multiplatform-desktop-template#readme) 教學。
* 了解如何為 [Compose Multiplatform 桌面專案建立單元測試](compose-desktop-ui-testing.md)。
* 了解如何為 [桌面平台建立原生發行版、安裝程式和套件](compose-native-distribution.md)。
* 設定與 [Swing 的互通性，並將您的 Swing 應用程式遷移至 Compose Multiplatform](compose-desktop-swing-interoperability.md)。
* 了解 [不同平台上的輔助使用功能支援](compose-desktop-accessibility.md)。