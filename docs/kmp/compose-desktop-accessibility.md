[//]: # (title: 对桌面无障碍功能的支持)

Compose Multiplatform 基于 [Jetpack Compose](https://developer.android.com/jetpack/compose) 构建，使得大多数无障碍特性可以在所有平台的通用代码中可用。桌面平台无障碍功能支持的当前状态如下：

| 平台 | 无障碍功能状态 |
|----------|------------------|
| macOS | 完全支持 |
| Windows | 通过 Java Access Bridge 支持 |
| Linux | 不支持 |

## 在 Windows 上启用无障碍功能

Windows 上的无障碍功能通过 Java Access Bridge 提供，该功能默认处于禁用状态。
要在 Windows 上开发无障碍特性，请使用以下命令启用 Java Access Bridge：

```Console
%\JAVA_HOME%\bin\jabswitch.exe /enable
```

[//]: # (TODO remove this workaround when CMP-373 is fixed)

要创建包含无障碍特性的原生分发，请使用 `modules` DSL 方法添加 `jdk.accessibility` 模块：

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            modules("jdk.accessibility")
        }
    }
}
```

## 示例：带有语义规则的自定义按钮

让我们创建一个带有自定义按钮的简单应用，并为屏幕阅读器工具指定解释性文本。
启用屏幕阅读器后，你将听到按钮描述中的“Click to increment value”文本：

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
            // Uses text from the content  
            .semantics(mergeDescendants = true) {
                // Assigns the type of UI element
                role = Role.Button
                // Adds some help text to button
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

要在 macOS 上测试应用程序中元素的无障碍信息，可以使用 [Accessibility Inspector](https://developer.apple.com/documentation/accessibility/accessibility-inspector) (**Xcode** | **Open Developer Tool** | **Accessibility Inspector**)：

<img src="compose-desktop-accessibility-macos.png" alt="macOS 上的无障碍检查器" width="700"/>

在 Windows 上，你可以使用 [JAWS](https://www.freedomscientific.com/Products/Blindness/JAWS) 中的 **Show Speech History** 特性或 [NVDA](https://www.nvaccess.org/) 中的 **Speech Viewer**：

<img src="compose-desktop-accessibility.png" alt="Windows 上的无障碍功能" width="600"/>

有关更多示例，请参考 [Jetpack Compose 中的无障碍功能](https://developer.android.com/develop/ui/compose/accessibility) 指南。

## 接下来？

探索关于 [其他桌面组件](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop) 的教程。