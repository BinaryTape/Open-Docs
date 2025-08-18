[//]: # (title: 桌面辅助功能支持)

Compose Multiplatform 构建于 [Jetpack Compose](https://developer.android.com/jetpack/compose) 之上，使大多数辅助功能在所有平台的公共代码中可用。桌面端辅助功能支持的当前状态如下：

| 平台    | 辅助功能状态             |
| ------- | ------------------------ |
| macOS   | 完全支持                 |
| Windows | 通过 Java Access Bridge 支持 |
| Linux   | 不支持                   |

## 在 Windows 上启用辅助功能

Windows 上的辅助功能通过 Java Access Bridge 提供，默认情况下处于禁用状态。要在 Windows 上开发辅助功能，请使用以下命令启用 Java Access Bridge：

```Console
%\JAVA_HOME%\bin\jabswitch.exe /enable
```

[//]: # (TODO remove this workaround when CMP-373 is fixed)

要创建包含辅助功能的原生分发包，请使用 `modules` DSL 方法添加 `jdk.accessibility` 模块：

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            modules("jdk.accessibility")
        }
    }
}
```

## 示例：带语义规则的自定义按钮

让我们创建一个带有自定义按钮的简单应用，并为屏幕阅读器工具指定解释性文本。启用屏幕阅读器后，你将听到按钮描述中的“Click to increment value”文本：

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
            // 使用内容中的文本
            .semantics(mergeDescendants = true) {
                // 分配 UI 元素的类型
                role = Role.Button
                // 为按钮添加帮助文本
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

要在 macOS 上测试应用中元素的辅助功能信息，你可以使用 [Accessibility Inspector](https://developer.apple.com/documentation/accessibility/accessibility-inspector) (**Xcode** | **打开开发者工具** | **Accessibility Inspector**)：

<img src="compose-desktop-accessibility-macos.png" alt="macOS 上的 Accessibility Inspector" width="700"/>

在 Windows 上，你可以使用 [JAWS](https://www.freedomscientific.com/Products/Blindness/JAWS) 中的 **显示语音历史** 功能或 [NVDA](https://www.nvaccess.org/) 中的 **语音查看器**：

<img src="compose-desktop-accessibility.png" alt="Windows 上的辅助功能" width="600"/>

更多示例，请参考 [Jetpack Compose 中的辅助功能](https://developer.android.com/develop/ui/compose/accessibility) 指南。

## 下一步？

探索关于 [其他桌面组件](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop) 的教程。