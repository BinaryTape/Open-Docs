[//]: # (title: 上下文選單)

Compose Multiplatform 桌面版提供開箱即用的文字上下文選單支援，並允許您透過新增更多項目、設定主題和自訂文字來方便地調整任何上下文選單。

## 自訂區域中的上下文選單

您可以為應用程式的任何任意區域建立上下文選單。使用 `ContextMenuArea` 來定義一個容器，當滑鼠右鍵點擊時，將觸發上下文選單的出現：

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
                // Custom action
            },
            ContextMenuItem("Another user-defined action") {
                // Another custom action
            }
        )
    }) {
        // Blue box where context menu will be available
        Box(modifier = Modifier.background(Color.Blue).height(100.dp).width(100.dp))
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="ContextMenuArea(items = { listOf( ContextMenuItem( "}

<img src="compose-desktop-context-menu-custom-area.png" alt="上下文選單：ContextMenuArea" width="500"/>

## 設定主題

您可以自訂上下文選單的顏色，以建立響應式 UI，使其與系統設定相符，並避免在應用程式之間切換時出現劇烈的對比度變化。對於預設的亮色和深色主題，有兩種內建實作：`LightDefaultContextMenuRepresentation` 和 `DarkDefaultContextMenuRepresentation`。它們不會自動應用於上下文選單的顏色，因此您需要透過 `LocalContextMenuRepresentation` 設定一個合適的主題：

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

<img src="compose-desktop-context-menu-dark-mode.png" alt="上下文選單：深色主題" width="500"/>

## 本地化選單項目

依預設，上下文選單將以您系統設定中的偏好語言顯示：

<img src="compose-desktop-context-menu-localization.png" alt="上下文選單：本地化" width="500"/>

如果您想使用特定語言，請在執行應用程式之前明確地將其指定為預設語言：

```Console
java.util.Locale.setDefault(java.util.Locale("en"))
```

## 文字上下文選單

### 預設文字上下文選單

Compose Multiplatform 桌面版為 `TextField` 和可選取的 `Text` 提供內建的上下文選單。

文字欄位的預設上下文選單包含以下動作，具體取決於游標位置和選取範圍：複製、剪下、貼上和全選。這個標準上下文選單預設在 Material `TextField`（`androidx.compose.material.TextField` 或 `androidx.compose.material3.TextField`）和 Foundation `BasicTextField`（`androidx.compose.foundation.text.BasicTextField`）中可用。

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

<img src="compose-desktop-context-menu-textfield.png" alt="TextField 的預設上下文選單" width="500"/>

有關詳細資訊，請參閱 [API 參考](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-text-field.html)。

簡單文字元素的預設上下文選單僅包含複製動作。若要為 `Text` 元件啟用上下文選單，請將文字包裹在 `SelectionContainer` 中以使其可選取：

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

<img src="compose-desktop-context-menu-text.png" alt="Text 的預設上下文選單" width="500"/>

### 新增自訂項目

若要為 `TextField` 和 `Text` 元件新增自訂上下文選單動作，請透過 `ContextMenuItem` 指定新項目，並透過 `ContextMenuDataProvider` 將它們新增到上下文選單項目的階層中。例如，以下程式碼範例展示了如何為文字欄位和簡單可選取文字元素的預設上下文選單新增兩個新的自訂動作：

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
                        // Custom action
                    },
                    ContextMenuItem("Another user-defined action") {
                        // Another custom action
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

<img src="compose-desktop-context-menu-custom-actions.png" alt="帶有自訂動作的上下文選單" width="500"/>

### 覆寫預設文字上下文選單

若要覆寫文字欄位和可選取文字元素的預設上下文選單，請覆寫 `TextContextMenu` 介面。在以下程式碼範例中，我們重用了原始的 `TextContextMenu`，但在列表底部新增了一個額外項目。新項目會根據文字選取進行調整：

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
                // Reuses original TextContextMenu and adds a new item
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

<img src="compose-desktop-context-menu-custom-text.png" alt="上下文選單：LocalTextContextMenu" width="500"/>

### Swing 互通性

如果您將 Compose 程式碼嵌入到現有的 Swing 應用程式中，並需要上下文選單與應用程式的其他部分外觀和行為保持一致，您可以使用 `JPopupTextMenu` 類別。在此類別中，`LocalTextContextMenu` 使用 Swing 的 `JPopupMenu` 來處理 Compose 元件中的上下文選單。

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

                // Adds items that can be defined via ContextMenuDataProvider in other parts of the application 
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

<img src="compose-desktop-context-menu-swing.png" alt="上下文選單：Swing 互通性" width="500"/>

## 下一步

探索有關 [其他桌面元件](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop) 的教學。