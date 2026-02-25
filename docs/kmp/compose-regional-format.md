# 管理区域格式

文本字段和相关组件（如日期和时间选择器）会自动应用区域性特定的格式设置模式。
这些模式包括数字、日期、时间和货币的格式设置。
这些模式由系统的区域设置或在应用程序中设置的自定义区域设置决定，确保了跨平台数据展示的一致性。

## 区域设置格式设置模式

Compose Multiplatform 中的格式设置遵循针对以下内容的平台特定区域设置约定：

 * 数字分隔符。千位可以使用逗号或句点分隔：`en-US` 中为 `1,234.56`，而 `de-DE` 中为 `1.234,56`。
 * 日期/时间模式。12 月 1 日的日期在 `en-US` 中显示为 `12/1/20`，而在 `fr-CA` 中显示为 `2020-12-01`。
 * 货币符号和位置。本地货币符号可以放置在数字之前或之后：`en-US` 中为 `$5,001`，而 `fr-FR` 中为 `5.001,00 €`。

这些区域格式对于系统区域设置和应用程序中定义的自定义区域设置覆盖均可开箱即用。

格式设置目前在 iOS 上使用 `kotlinx-datetime` 库实现，而在 Android 和桌面端使用 JDK API 实现。
以下是在 iOS 源集中管理本地化日期和货币值的示例：

```kotlin
import androidx.compose.foundation.layout.Column
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import kotlinx.datetime.Clock
import kotlinx.datetime.TimeZone
import kotlinx.datetime.todayIn
import platform.Foundation.NSNumber
import platform.Foundation.NSNumberFormatter
import platform.Foundation.NSNumberFormatterCurrencyStyle
import platform.Foundation.NSLocale
import platform.Foundation.currentLocale

@Composable
fun RegionalFormatExample() {
    val currentLocale = NSLocale.current
    val languageCode = currentLocale.languageCode 
    val countryCode = currentLocale.countryCode 

    // 要格式化为货币的示例值
    val amount = 1234.56

    // 在 iOS 上使用 NSNumberFormatter 进行货币格式设置
    val currencyFormatter = NSNumberFormatter().apply { 
        numberStyle = NSNumberFormatterCurrencyStyle
        locale = currentLocale
    }
    val formattedCurrency = currencyFormatter.stringFromNumber(NSNumber(amount)) 

    // 使用 `kotlinx-datetime` 获取当前日期
    val today = Clock.System.todayIn(TimeZone.currentSystemDefault())
    val formattedDate = today.toString()

    Column {
        Text("Current language: $languageCode")
        Text("Current country: $countryCode")
        Text("Amount: $amount")
        Text("Formatted currency: $formattedCurrency")
        Text("Today's date: $formattedDate")
    }
}
```

## 确保一致的格式设置

虽然目前还没有针对统一多平台解决方案的通用 API，但在大多数情况下格式设置行为仍保持一致。
为确保所有支持的区域都能正确格式化：

* 测试边缘情况，如大数字、负值或零。
* 验证所有目标平台上所有受支持区域设置的格式设置。

## 后续步骤

详细了解如何管理应用程序的[资源环境](compose-resource-environment.md)，例如应用内主题和语言。