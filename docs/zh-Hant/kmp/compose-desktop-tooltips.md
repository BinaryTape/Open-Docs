[//]: # (title: 工具提示)

您可以使用 `TooltipArea` 可組合項將工具提示新增至任何組件。`TooltipArea` 類似於 `Box` 組件，且可以顯示工具提示。

`TooltipArea` 可組合項具有以下主要參數：

* `tooltip`：工具提示的可組合內容。
* `tooltipPlacement`：定義工具提示的位置。您可以指定錨點（滑鼠游標或組件）、偏移量以及對齊方式。
* `delayMillis`：顯示工具提示前的延遲時間（以毫秒為單位）。預設值為 500 ms。

以下範例展示如何建立一個包含按鈕清單的簡單視窗，每個按鈕都封裝在 `TooltipArea` 中。當您將游標暫留於按鈕上時，會出現顯示按鈕名稱的工具提示。將此程式碼新增至 `jvmMain/kotlin` 中的 `main.kt` 檔案：

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
            // 將按鈕封裝在 TooltipArea 中
            TooltipArea(
                tooltip = {
                    // 可組合的工具提示內容：
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
                delayMillis = 600, // 以毫秒為單位
                tooltipPlacement = TooltipPlacement.CursorPoint(
                    alignment = Alignment.BottomEnd,
                    offset = if (index % 2 == 0) DpOffset(
                        (-16).dp,
                        0.dp
                    ) else DpOffset.Zero // 工具提示偏移量
                )
            ) {
                Button(onClick = {}) { Text(text = name) }
            }
        }
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="TooltipArea(tooltip = { Surface( "}

<img src="compose-desktop-tooltips.animated.gif" alt="Tooltips" width="288" preview-src="compose-desktop-tooltips.png"/>

## 接下來要做什麼？

探索關於 [其他桌面組件](https://github.com/JetBrains/compose-multiplatform/tree/master/tutorials#desktop) 的教學。