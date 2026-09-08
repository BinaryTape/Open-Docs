[//]: # (title: 메뉴 바)
<web-summary>Compose Multiplatform for desktop을 사용하여 특정 윈도우에 메뉴 바를 만드는 방법을 알아봅니다.</web-summary>

`MenuBar()` 컴포저블을 사용하여 특정 윈도우의 메뉴 바를 생성할 수 있습니다. `MenuBar()`는 `Window()` 컴포저블의 스코프 내에서 사용할 수 있으므로, 각 윈도우마다 별도의 메뉴 바를 가질 수 있습니다.

undefined

`MenuBar()`에서는 다음과 같은 컴포넌트들을 사용할 수 있습니다:

* `Menu()` – 메뉴 또는 하위 메뉴
* `Item()` – 클릭 가능한 메뉴 항목
* `CheckboxItem()` – 체크박스가 있는 항목
* `RadioButtonItem()` – 라디오 버튼이 있는 항목
* `Separator()` – 항목 그룹을 구분하는 가로선

항목과 메뉴는 `mnemonic` 파라미터를 받습니다. 이는 <shortcut>Alt</shortcut>와 함께 눌렀을 때 메뉴를 열거나 항목을 실행하는 문자입니다. 해당 문자가 텍스트에 포함되어 있으면 첫 번째 문자에 밑줄이 표시됩니다.
항목은 메뉴를 거치지 않고 동작을 실행하는 `KeyShortcut`인 `shortcut` 파라미터도 받습니다.

> `KeyShortcut`에서 `ctrl = true`로 설정하면 macOS를 포함한 모든 환경에서 항상 <shortcut>Ctrl</shortcut>에 매핑됩니다. 
> 표준 macOS 단축키를 위해 <shortcut>⌘</shortcut>를 사용하려면 대신 `meta = true`로 설정하세요.
>
{style="tip"}

메뉴 콘텐츠는 컴포저블이므로, `MenuBar()` 내부에서 조건문과 반복문을 사용하여 어떤 항목이 존재할지 결정할 수 있습니다. 읽어오는 상태(state)가 변경되면 메뉴가 업데이트됩니다. 다음 예제에서 **Settings** 하위 메뉴는 **Advanced settings** 체크박스가 선택된 동안에만 존재합니다:

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

Windows와 Linux에서 메뉴 바는 윈도우의 일부로 표시됩니다. macOS에서는 윈도우가 활성화되어 있을 때 화면 상단의 시스템 메뉴 바에 표시됩니다.

## 다음 단계 {id="what-s-next"}

* [시스템 트레이](compose-desktop-tray.md)에 애플리케이션 아이콘과 메뉴를 추가하는 방법을 알아보세요.
* [다른 데스크톱 컴포넌트](compose-desktop-components.md)에 관한 튜토리얼을 살펴보세요.