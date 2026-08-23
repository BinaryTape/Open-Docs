[//]: # (title: 僅限桌面版 API)

您可以透過 Compose Multiplatform 來建立 macOS、Linux 與 Windows 桌面應用程式。本頁面簡要概述了桌面特定的組件與事件。每個章節都包含指向詳細教學的連結。

## 組件

<!-- * [Images and icons](#images-and-icons) -->
* [視窗與對話方塊](compose-desktop-top-level-windows-management.md)
* [操作功能表](compose-desktop-context-menus.md)
* [系統匣與通知](compose-desktop-tray.md)
* [功能表列](compose-desktop-menu-bar.md)
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
* For more information on using resources in common code in Compose Multiplatform projects, see [Images and resources](compose-multiplatform-resources.md). -->

## 事件

* [滑鼠事件](compose-desktop-mouse-events.md)
* [鍵盤事件](compose-desktop-keyboard.md)
* [Tab 鍵導覽](#tabbing-navigation-between-components)

### 組件之間的 Tab 鍵導覽

您可以設定組件之間的導覽，使用 <shortcut>Tab</shortcut> 鍵跳轉至下一個組件，使用 <shortcut>⇧ + Tab</shortcut> 跳轉至上一個組件。

預設情況下，Tab 鍵導覽允許您依照組件出現的順序，在可取得焦點的組件之間移動。可取得焦點的組件包括 `TextField`、`OutlinedTextField` 與 `BasicTextField` 可組合項，以及使用 `Modifier.clickable` 的組件（例如 `Button`、`IconButton` 與 `MenuItem`）。

例如，以下是一個使用者可以使用標準快速鍵在五個文字欄位之間進行導覽的視窗：

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

您也可以將不可取得焦點的組件設定為可取得焦點、自訂 Tab 鍵導覽順序，以及將組件設為焦點。

若要了解更多，請參閱 [Tabbing navigation and keyboard focus](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials/Tab_Navigation) 教學。

## 下一步

* 了解如何[為您的 Compose Multiplatform 桌面專案建立單元測試](compose-desktop-ui-testing.md)。
* 了解如何[為桌面平台建立原生發行版本、安裝程式與套件](compose-native-distribution.md)。
* 設定[與 Swing 的互通性，並將您的 Swing 應用程式遷移至 Compose Multiplatform](compose-desktop-swing-interoperability.md)。
* 了解[不同平台上的無障礙支援](compose-desktop-accessibility.md)。