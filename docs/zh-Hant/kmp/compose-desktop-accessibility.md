[//]: # (title: 支援桌面協助工具功能)

Compose Multiplatform 建立在 [Jetpack Compose](https://developer.android.com/jetpack/compose) 之上，使大多數協助工具功能都能在所有平台的共通程式碼中使用。桌面端目前對協助工具支援的狀態如下：

| 平台 | 協助工具狀態 |
|----------|----------------------------------|
| macOS    | 完全支援 |
| Windows  | 透過 Java Access Bridge 支援 |
| Linux    | 不支援 | 

## 在 Windows 上啟用協助工具

Windows 上的協助工具是透過 Java Access Bridge 提供的，該功能預設為停用。
若要在 Windows 上開發協助工具功能，請使用以下指令啟用 Java Access Bridge：

```Console
%\JAVA_HOME%\bin\jabswitch.exe /enable
```

[//]: # (TODO remove this workaround when CMP-373 is fixed)

若要建立包含協助工具功能的原生發行版，請使用 `modules` DSL 方法新增 `jdk.accessibility` 模組：

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            modules("jdk.accessibility")
        }
    }
}
```

## 範例：具有語意規則的自訂按鈕

讓我們建立一個帶有自訂按鈕的簡單應用程式，並為螢幕閱讀器工具指定說明文字。
啟用螢幕閱讀器後，您將會聽到按鈕說明中的「Click to increment value」文字：

```kotlin
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.material.Text
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.*
import androidx.compose.ui.unit.*
import androidx.compose.ui.window.*

fun main() = singleWindowApplication(
    title = "Custom Button", state = WindowState(size = DpSize(300.dp, 200.dp))
) {
    var count by remember { mutableStateOf(0) }

    Box(modifier = Modifier.padding(50.dp)) {
        Box(modifier = Modifier
            .background(Color.LightGray)
            .fillMaxSize()
            .clickable { count += 1 }
            // 使用來自內容的文字
            .semantics(mergeDescendants = true) {
                // 指派 UI 元件的類型
                role = Role.Button
                // 為按鈕添加一些說明文字
                contentDescription = "Click to increment value"
            }
        ) {
            val text = when (count) {
                0 -> "Click Me!"
                1 -> "Clicked"
                else -> "Clicked $count times"
            }
            Text(text, modifier = Modifier.align(Alignment.Center), fontSize = 24.sp)
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title=".clickable { count += 1 } .semantics(mergeDescendants = true)"}

若要在 macOS 上測試應用程式中元件的協助工具資訊，您可以使用 [Accessibility Inspector](https://developer.apple.com/documentation/accessibility/accessibility-inspector)
（**Xcode** | **Open Developer Tool** | **Accessibility Inspector**）：

<img src="compose-desktop-accessibility-macos.png" alt="macOS 上的 Accessibility inspector" width="700"/>

在 Windows 上，您可以使用 [JAWS](https://www.freedomscientific.com/Products/Blindness/JAWS) 中的 **Show Speech History** 功能，或 [NVDA](https://www.nvaccess.org/) 中的 **Speech Viewer**：

<img src="compose-desktop-accessibility.png" alt="Windows 上的協助工具" width="600"/>

如需更多範例，請參閱 [Jetpack Compose 中的協助工具](https://developer.android.com/develop/ui/compose/accessibility) 指南。

## 接下來呢？

探索有關 [其他桌面元件](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop) 的教學。