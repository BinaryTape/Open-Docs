[//]: # (title: 对桌面无障碍功能的支持)

Compose Multiplatform 基于 [Jetpack Compose](https://developer.android.com/jetpack/compose) 构建，使大多数无障碍功能在所有平台的通用代码中可用。目前桌面端的无障碍支持状态如下：

| 平台 | 无障碍状态 |
|----------|----------------------------------|
| MacOS    | 完全支持 |
| Windows  | 通过 Java Access Bridge 支持 |
| Linux    | 不支持 | 

## 在 Windows 上启用无障碍功能

Windows 上的无障碍功能是通过 Java Access Bridge 提供的，该功能默认情况下处于禁用状态。
要在 Windows 上开发无障碍功能，请使用以下命令启用 Java Access Bridge：

```Console
%\JAVA_HOME%\bin\jabswitch.exe /enable
```

[//]: # (TODO remove this workaround when CMP-373 is fixed)

要创建一个包含无障碍功能的本地分发版，请使用 `modules` DSL 方法添加 `jdk.accessibility` 模块：

```kotlin
compose.desktop {
    application {
        nativeDistributions {
            modules("jdk.accessibility")
        }
    }
}
```

## 示例：具有语义规则的自定义按钮

让我们创建一个带有自定义按钮的简单应用，并为屏幕阅读器工具指定说明性文本。
在启用屏幕阅读器的情况下，你将听到来自按钮说明的 “Click to increment value” 文本：

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
            // 使用来自内容的内容
            .semantics(mergeDescendants = true) {
                // 分配 UI 元素的类型
                role = Role.Button
                // 向按钮添加一些帮助文本
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

要在 macOS 上测试应用程序中元素的无障碍信息，你可以使用 [Accessibility Inspector](https://developer.apple.com/documentation/accessibility/accessibility-inspector)
（**Xcode** | **Open Developer Tool** | **Accessibility Inspector**）：

<img src="compose-desktop-accessibility-macos.png" alt="Accessibility inspector on mcOS" width="700"/>

在 Windows 上，你可以使用 [JAWS](https://www.freedomscientific.com/Products/Blindness/JAWS) 中的 **Show Speech History** 功能，或 [NVDA](https://www.nvaccess.org/) 中的 **Speech Viewer**：

<img src="compose-desktop-accessibility.png" alt="Accessibility on Windows" width="600"/>

有关更多示例，请参阅 [Jetpack Compose 中的无障碍](https://developer.android.com/develop/ui/compose/accessibility) 指南。

## 下一步？

浏览有关 [其他桌面组件](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop) 的教程。