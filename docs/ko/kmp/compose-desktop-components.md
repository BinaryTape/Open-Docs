[//]: # (title: 데스크톱 전용 API)

Compose Multiplatform을 사용하여 macOS, Linux, Windows 데스크톱 애플리케이션을 만들 수 있습니다. 이 페이지에서는 데스크톱 전용 컴포넌트와 이벤트에 대한 간략한 개요를 제공합니다. 각 섹션에는 상세 튜토리얼 링크가 포함되어 있습니다.

## 컴포넌트

<!-- * [Images and icons](#images-and-icons) -->
* [창 및 대화 상자](compose-desktop-top-level-windows-management.md)
* [컨텍스트 메뉴](compose-desktop-context-menus.md)
* [시스템 트레이](#the-system-tray)
* [메뉴 바](#menu-bar)
* [스크롤 바](compose-desktop-scrollbars.md)
* [툴팁](compose-desktop-tooltips.md)

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

### 시스템 트레이

`Tray` 컴포저블을 사용하여 시스템 트레이에서 사용자에게 알림을 보낼 수 있습니다:

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

알림에는 세 가지 유형이 있습니다:

*   `notify`, 일반 알림.
*   `warn`, 경고 알림.
*   `error`, 오류 알림.

시스템 트레이에 애플리케이션 아이콘을 추가할 수도 있습니다.

자세한 내용은 [메뉴, 트레이, 알림](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Tray_Notifications_MenuBar_new#tray) 튜토리얼을 참조하세요.

### 메뉴 바

`MenuBar` 컴포저블을 사용하여 특정 창의 메뉴 바를 생성하고 사용자 지정할 수 있습니다:

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

자세한 내용은 [메뉴, 트레이, 알림](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Tray_Notifications_MenuBar_new#menubar) 튜토리얼을 참조하세요.

## 이벤트

*   [마우스 이벤트](compose-desktop-mouse-events.md)
*   [키보드 이벤트](compose-desktop-keyboard.md)
*   [컴포넌트 간 탭 탐색](#tabbing-navigation-between-components)

### 컴포넌트 간 탭 탐색

<shortcut>Tab</shortcut> 키보드 단축키로 다음 컴포넌트로 이동하고 <shortcut>⇧ + Tab</shortcut> 키보드 단축키로 이전 컴포넌트로 이동하여 컴포넌트 간 탐색을 설정할 수 있습니다.

기본적으로 탭 탐색은 나타나는 순서대로 포커스 가능한 컴포넌트 사이를 이동할 수 있게 해줍니다. 포커스 가능한 컴포넌트에는 `TextField`, `OutlinedTextField`, `BasicTextField` 컴포저블뿐만 아니라 `Button`, `IconButton`, `MenuItem`과 같이 `Modifier.clickable`을 사용하는 컴포넌트가 포함됩니다.

예를 들어, 다음은 사용자가 표준 단축키를 사용하여 다섯 개의 텍스트 필드 사이를 탐색할 수 있는 창입니다:

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

또한, 포커스 불가능한 컴포넌트를 포커스 가능하게 만들고, 탭 탐색 순서를 사용자 지정하고, 컴포넌트에 포커스를 둘 수 있습니다.

자세한 내용은 [탭 탐색 및 키보드 포커스](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Tab_Navigation) 튜토리얼을 참조하세요.

## 다음 단계

*   [Compose Multiplatform 데스크톱 애플리케이션](https://github.com/JetBrains/compose-multiplatform-desktop-template#readme) 튜토리얼을 완료하세요.
*   [Compose Multiplatform 데스크톱 프로젝트의 단위 테스트를 생성하는 방법](compose-desktop-ui-testing.md)을 배우세요.
*   [데스크톱 플랫폼을 위한 네이티브 배포판, 설치 프로그램, 패키지를 생성하는 방법](compose-native-distribution.md)을 배우세요.
*   [Swing과의 상호 운용성을 설정하고 Swing 애플리케이션을 Compose Multiplatform으로 마이그레이션하세요](compose-desktop-swing-interoperability.md).
*   [다양한 플랫폼에서의 접근성 지원](compose-desktop-accessibility.md)에 대해 알아보세요.