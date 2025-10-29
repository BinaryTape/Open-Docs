[//]: # (title: 工具提示)

您可以使用 `TooltipArea` 可组合项为任何组件添加工具提示。`TooltipArea` 类似于 `Box` 组件，可以显示工具提示。

`TooltipArea` 可组合项具有以下主要参数：

*   `tooltip`，工具提示的可组合内容。
*   `tooltipPlacement`，定义工具提示的位置。您可以指定一个锚点（鼠标光标或组件）、一个偏移量和一个对齐方式。
*   `delayMillis`，工具提示显示前的毫秒时间。默认值为 500 毫秒。

以下示例展示了如何创建一个简单的窗口，该窗口包含一个按钮列表，每个按钮都包裹在 `TooltipArea` 中。当您将鼠标悬停在按钮上时，将显示带有按钮名称的工具提示。将此代码添加到 `composeApp/src/jvmMain/kotlin` 目录下的 `main.kt` 文件中：

```kotlin
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.TooltipArea
import androidx.compose.foundation.TooltipPlacement
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.Button
import androidx.compose.material.Surface
import androidx.compose.material.Text
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.DpOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.WindowState
import androidx.compose.ui.window.singleWindowApplication

@OptIn(ExperimentalFoundationApi::class)
fun main() = singleWindowApplication(
    WindowState(width = 300.dp, height = 350.dp),
    title = "Tooltip Example"
) {
    val buttons = listOf("Button A", "Button B", "Button C", "Button D", "Button E", "Button F")
    Column(Modifier.fillMaxSize(), Arrangement.spacedBy(5.dp)) {
        buttons.forEachIndexed { index, name ->
            // Wrap the button in TooltipArea
            TooltipArea(
                tooltip = {
                    // Composable tooltip content:
                    Surface(
                        modifier = Modifier.shadow(4.dp),
                        color = Color(255, 255, 210),
                        shape = RoundedCornerShape(4.dp)
                    ) {
                        Text(
                            text = "Tooltip for $name",
                            modifier = Modifier.padding(10.dp)
                        )
                    }
                },
                modifier = Modifier.padding(start = 40.dp),
                delayMillis = 600, // In milliseconds
                tooltipPlacement = TooltipPlacement.CursorPoint(
                    alignment = Alignment.BottomEnd,
                    offset = if (index % 2 == 0) DpOffset(
                        (-16).dp,
                        0.dp
                    ) else DpOffset.Zero // Tooltip offset
                )
            ) {
                Button(onClick = {}) { Text(text = name) }
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="TooltipArea(tooltip = { Surface( "}

<img src="compose-desktop-tooltips.animated.gif" alt="工具提示" width="288" preview-src="compose-desktop-tooltips.png"/>

## 下一步？

探索关于 [其他桌面组件](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop) 的教程。