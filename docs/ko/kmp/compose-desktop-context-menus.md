[//]: # (title: 컨텍스트 메뉴)

데스크톱용 Compose Multiplatform은 텍스트 컨텍스트 메뉴를 기본적으로 지원하며, 더 많은 항목을 추가하고, 테마를 설정하고, 텍스트를 사용자 지정하여 모든 컨텍스트 메뉴를 편리하게 조정할 수 있도록 합니다.

## 사용자 지정 영역의 컨텍스트 메뉴

애플리케이션의 임의 영역에 컨텍스트 메뉴를 생성할 수 있습니다. `ContextMenuArea`를 사용하여 마우스 오른쪽 클릭 시 컨텍스트 메뉴가 나타나도록 하는 컨테이너를 정의하세요.

```kotlin
import androidx.compose.foundation.ContextMenuArea
import androidx.compose.foundation.ContextMenuItem
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.singleWindowApplication

fun main() = singleWindowApplication(title = "Context menu") {
    ContextMenuArea(items = {
        listOf(
            ContextMenuItem("User-defined action") {
                // 사용자 지정 액션
            },
            ContextMenuItem("Another user-defined action") {
                // 또 다른 사용자 지정 액션
            }
        )
    }) {
        // 컨텍스트 메뉴를 사용할 수 있는 파란색 상자
        Box(modifier = Modifier.background(Color.Blue).height(100.dp).width(100.dp))
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="ContextMenuArea(items = { listOf( ContextMenuItem( "}

<img src="compose-desktop-context-menu-custom-area.png" alt="Context menu: ContextMenuArea" width="500"/>

## 테마 설정

시스템 설정과 일치하는 반응형 UI를 만들고 애플리케이션 간 전환 시 급격한 대비 변화를 피하기 위해 컨텍스트 메뉴 색상을 사용자 지정할 수 있습니다. 기본 밝은 테마와 어두운 테마에는 두 가지 내장 구현이 있습니다: `LightDefaultContextMenuRepresentation` 및 `DarkDefaultContextMenuRepresentation`.
이들은 컨텍스트 메뉴 색상에 자동으로 적용되지 않으므로, `LocalContextMenuRepresentation`을 통해 적절한 테마를 설정해야 합니다.

```kotlin
import androidx.compose.foundation.DarkDefaultContextMenuRepresentation
import androidx.compose.foundation.LightDefaultContextMenuRepresentation
import androidx.compose.foundation.LocalContextMenuRepresentation
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Surface
import androidx.compose.material.TextField
import androidx.compose.material.darkColors
import androidx.compose.material.lightColors
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.window.singleWindowApplication

fun main() = singleWindowApplication(title = "Dark theme") {
    MaterialTheme(
        colors = if (isSystemInDarkTheme()) darkColors() else lightColors()
    ) {
        val contextMenuRepresentation = if (isSystemInDarkTheme()) {
            DarkDefaultContextMenuRepresentation
        } else {
            LightDefaultContextMenuRepresentation
        }
        CompositionLocalProvider(LocalContextMenuRepresentation provides contextMenuRepresentation) {
            Surface(Modifier.fillMaxSize()) {
                Box {
                    var value by remember { mutableStateOf("") }
                    TextField(value, { value = it })
                }
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="MaterialTheme( colors = if (isSystemInDarkTheme()) darkColors() else "}

<img src="compose-desktop-context-menu-dark-mode.png" alt="Context menu: Dark theme" width="500"/>

## 메뉴 항목 지역화

기본적으로 컨텍스트 메뉴는 시스템 설정의 기본 언어로 나타납니다.

<img src="compose-desktop-context-menu-localization.png" alt="Context menu: Localization" width="500"/>

특정 언어를 사용하려면 애플리케이션을 실행하기 전에 명시적으로 기본 언어로 지정하세요.

```Console
java.util.Locale.setDefault(java.util.Locale("en"))
```

## 텍스트 컨텍스트 메뉴

### 기본 텍스트 컨텍스트 메뉴

데스크톱용 Compose Multiplatform은 `TextField` 및 선택 가능한 `Text`를 위한 내장 컨텍스트 메뉴를 제공합니다.

텍스트 필드의 기본 컨텍스트 메뉴에는 커서 위치와 선택 범위에 따라 복사, 잘라내기, 붙여넣기, 모두 선택과 같은 액션이 포함됩니다.
이 표준 컨텍스트 메뉴는 Material `TextField`(`androidx.compose.material.TextField` 또는 `androidx.compose.material3.TextField`) 및 Foundation `BasicTextField`(`androidx.compose.foundation.text.BasicTextField`)에서 기본적으로 사용 가능합니다.

```kotlin
import androidx.compose.material.Text
import androidx.compose.material.TextField
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.window.singleWindowApplication

fun main() = singleWindowApplication(title = "Context menu") {
    val text = remember { mutableStateOf("Hello!") }
    TextField(
        value = text.value,
        onValueChange = { text.value = it },
        label = { Text(text = "Input") }
    )
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="TextField( value = text.value, onValueChange ="}

<img src="compose-desktop-context-menu-textfield.png" alt="Default context menu for TextField" width="500"/>

자세한 내용은 [API 레퍼런스](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-text-field.html)를 참조하세요.

간단한 텍스트 요소의 기본 컨텍스트 메뉴에는 복사 액션만 포함됩니다.
`Text` 컴포넌트의 컨텍스트 메뉴를 활성화하려면, 텍스트를 `SelectionContainer`로 감싸서 선택 가능하게 만드세요.

```kotlin
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.material.Text
import androidx.compose.ui.window.singleWindowApplication

fun main() = singleWindowApplication(title = "Context menu") {
    SelectionContainer {
        Text("Hello World!")
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="SelectionContainer { Text( "}

<img src="compose-desktop-context-menu-text.png" alt="Default context menu for Text" width="500"/>

### 사용자 지정 항목 추가

`TextField` 및 `Text` 컴포넌트에 사용자 지정 컨텍스트 메뉴 액션을 추가하려면, `ContextMenuItem`을 통해 새 항목을 지정하고 `ContextMenuDataProvider`를 통해 컨텍스트 메뉴 항목 계층에 추가하세요. 예를 들어, 다음 코드 샘플은 텍스트 필드와 간단한 선택 가능한 텍스트 요소의 기본 컨텍스트 메뉴에 두 개의 새로운 사용자 지정 액션을 추가하는 방법을 보여줍니다.

```kotlin
import androidx.compose.foundation.ContextMenuDataProvider
import androidx.compose.foundation.ContextMenuItem
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.material.Text
import androidx.compose.material.TextField
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.singleWindowApplication

fun main() = singleWindowApplication(title = "Context menu") {
    val text = remember { mutableStateOf("Hello!") }
    Column {
        ContextMenuDataProvider(
            items = {
                listOf(
                    ContextMenuItem("User-defined action") {
                        // 사용자 지정 액션
                    },
                    ContextMenuItem("Another user-defined action") {
                        // 또 다른 사용자 지정 액션
                    }
                )
            }
        ) {
            TextField(
                value = text.value,
                onValueChange = { text.value = it },
                label = { Text(text = "Input") }
            )

            Spacer(Modifier.height(16.dp))

            SelectionContainer {
                Text("Hello World!")
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="ContextMenuDataProvider( items = { listOf( ContextMenuItem( "}

<img src="compose-desktop-context-menu-custom-actions.png" alt="Context menu with custom actions" width="500"/>

### 기본 텍스트 컨텍스트 메뉴 재정의

텍스트 필드 및 선택 가능한 텍스트 요소의 기본 컨텍스트 메뉴를 재정의하려면 `TextContextMenu` 인터페이스를 재정의하세요.
다음 코드 샘플에서는 원본 `TextContextMenu`를 재사용하되, 목록 하단에 하나의 추가 항목을 추가합니다. 새 항목은 텍스트 선택에 맞춰 조정됩니다.

```kotlin
import androidx.compose.foundation.ContextMenuDataProvider
import androidx.compose.foundation.ContextMenuItem
import androidx.compose.foundation.ContextMenuState
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.text.LocalTextContextMenu
import androidx.compose.foundation.text.TextContextMenu
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.material.Text
import androidx.compose.material.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.window.singleWindowApplication
import java.net.URLEncoder
import java.nio.charset.Charset

fun main() = singleWindowApplication(title = "Context menu") {
    CustomTextMenuProvider {
        Column {
            SelectionContainer {
                Text("Hello, Compose!")
            }
            var text by remember { mutableStateOf("") }
            TextField(text, { text = it })
        }
    }
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun CustomTextMenuProvider(content: @Composable () -> Unit) {
    val textMenu = LocalTextContextMenu.current
    val uriHandler = LocalUriHandler.current
    CompositionLocalProvider(
        LocalTextContextMenu provides object : TextContextMenu {
            @Composable
            override fun Area(
                textManager: TextContextMenu.TextManager,
                state: ContextMenuState,
                content: @Composable () -> Unit
            ) {
                // 원본 TextContextMenu를 재사용하고 새 항목을 추가
                ContextMenuDataProvider({
                    val shortText = textManager.selectedText.crop()
                    if (shortText.isNotEmpty()) {
                        val encoded = URLEncoder.encode(shortText, Charset.defaultCharset())
                        listOf(ContextMenuItem("Search $shortText") {
                            uriHandler.openUri("https://google.com/search?q=$encoded")
                        })
                    } else {
                        emptyList()
                    }
                }) {
                    textMenu.Area(textManager, state, content = content)
                }
            }
        },
        content = content
    )
}

private fun AnnotatedString.crop() = if (length <= 5) toString() else "${take(5)}..."
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="CompositionLocalProvider( LocalTextContextMenu provides object : TextContextMenu { "}

<img src="compose-desktop-context-menu-custom-text.png" alt="Context menu: LocalTextContextMenu" width="500"/>

### Swing 상호 운용성

기존 Swing 애플리케이션에 Compose 코드를 임베딩하고 컨텍스트 메뉴가 애플리케이션의 다른 부분의 모양과 동작과 일치해야 하는 경우 `JPopupTextMenu` 클래스를 사용할 수 있습니다. 이 클래스에서 `LocalTextContextMenu`는 Compose 컴포넌트의 컨텍스트 메뉴에 Swing의 `JPopupMenu`를 사용합니다.

```kotlin
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.text.JPopupTextMenu
import androidx.compose.foundation.text.LocalTextContextMenu
import androidx.compose.foundation.text.selection.SelectionContainer
import androidx.compose.material.Text
import androidx.compose.material.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.awt.ComposePanel
import androidx.compose.ui.platform.LocalLocalization
import java.awt.Color
import java.awt.Component
import java.awt.Dimension
import java.awt.Graphics
import java.awt.event.KeyEvent
import java.awt.event.KeyEvent.CTRL_DOWN_MASK
import java.awt.event.KeyEvent.META_DOWN_MASK
import javax.swing.Icon
import javax.swing.JFrame
import javax.swing.JMenuItem
import javax.swing.JPopupMenu
import javax.swing.KeyStroke.getKeyStroke
import javax.swing.SwingUtilities
import org.jetbrains.skiko.hostOs

fun main() = SwingUtilities.invokeLater {
    val panel = ComposePanel()
    panel.setContent {
        JPopupTextMenuProvider(panel) {
            Column {
                SelectionContainer {
                    Text("Hello, World!")
                }

                var text by remember { mutableStateOf("") }

                TextField(text, { text = it })
            }
        }
    }

    val window = JFrame()
    window.contentPane.add(panel)
    window.size = Dimension(800, 600)
    window.isVisible = true
    window.title = "Swing interop"
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun JPopupTextMenuProvider(owner: Component, content: @Composable () -> Unit) {
    val localization = LocalLocalization.current
    CompositionLocalProvider(
        LocalTextContextMenu provides JPopupTextMenu(owner) { textManager, items ->
            JPopupMenu().apply {
                textManager.cut?.also {
                    add(
                        swingItem(localization.cut, Color.RED, KeyEvent.VK_X, it)
                    )
                }
                textManager.copy?.also {
                    add(
                        swingItem(localization.copy, Color.GREEN, KeyEvent.VK_C, it)
                    )
                }
                textManager.paste?.also {
                    add(
                        swingItem(localization.paste, Color.BLUE, KeyEvent.VK_V, it)
                    )
                }
                textManager.selectAll?.also {
                    add(JPopupMenu.Separator())
                    add(
                        swingItem(localization.selectAll, Color.BLACK, KeyEvent.VK_A, it)
                    )
                }

                // 애플리케이션의 다른 부분에서 ContextMenuDataProvider를 통해 정의할 수 있는 항목을 추가합니다.
                for (item in items) {
                    add(
                        JMenuItem(item.label).apply {
                            addActionListener { item.onClick() }
                        }
                    )
                }
            }
        },
        content = content
    )
}

private fun swingItem(
    label: String,
    color: Color,
    key: Int,
    onClick: () -> Unit
) = JMenuItem(label).apply {
    icon = circleIcon(color)
    accelerator = getKeyStroke(key, if (hostOs.isMacOS) META_DOWN_MASK else CTRL_DOWN_MASK)
    addActionListener { onClick() }
}

private fun circleIcon(color: Color) = object : Icon {
    override fun paintIcon(c: Component?, g: Graphics, x: Int, y: Int) {
        g.create().apply {
            this.color = color
            translate(8, 2)
            fillOval(0, 0, 16, 16)
        }
    }

    override fun getIconWidth() = 16

    override fun getIconHeight() = 16
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="fun JPopupTextMenuProvider(owner: Component, content: @Composable () -> Unit) "}

<img src="compose-desktop-context-menu-swing.png" alt="Context menu: Swing interoperability" width="500"/>

## 다음 단계

[다른 데스크톱 컴포넌트](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop)에 대한 튜토리얼을 살펴보세요.