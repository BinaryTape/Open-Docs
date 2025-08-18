# 管理区域格式

文本字段以及日期和时间选择器等相关组件，会自动应用区域设置特有的格式模式。这包括数字、日期、时间及货币的格式化。这些模式由系统的区域设置或应用程序中设置的自定义区域设置决定，确保了跨平台数据展示的一致性。

## 区域设置格式模式

Compose Multiplatform 中的格式化遵循平台特有的区域设置惯例，适用于：

 * 数字分隔符。千位分隔符可以是逗号或句点：`en-US` 中为 `1,234.56`，而 `de-DE` 中为 `1.234,56`。
 * 日期/时间模式。12月1日的日期在 `en-US` 中显示为 `12/1/20`，而相同的日期在 `fr-CA` 中显示为 `2020-12-01`。
 * 货币符号及位置。本地货币符号可以放置在数字之前或之后：`en-US` 中为 `$5,001`，而 `fr-FR` 中为 `5.001,00 €`。

这些区域格式对于系统区域设置和应用程序中定义的自定义区域设置覆盖都开箱即用。

目前，iOS 上的格式化是使用 `kotlinx-datetime` 库实现的，而 Android 和桌面平台则是使用 JDK API 实现的。以下是管理 iOS 源代码集中本地化日期和货币值的示例：

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

    // Sample value to format as currency
    val amount = 1234.56

    // Uses NSNumberFormatter for currency formatting on iOS
    val currencyFormatter = NSNumberFormatter().apply { 
        numberStyle = NSNumberFormatterCurrencyStyle
        locale = currentLocale
    }
    val formattedCurrency = currencyFormatter.stringFromNumber(NSNumber(amount)) 

    // Gets current date using `kotlinx-datetime`
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

## 确保格式化一致性

尽管目前没有用于统一多平台解决方案的通用 API，但在大多数情况下，格式化行为仍然是一致的。为确保所有支持区域的格式化正确：

* 测试边界情况，例如大数字、负值或零。
* 在所有目标平台上验证所有支持区域设置的格式化。

## 下一步

了解如何管理应用程序的[资源环境](compose-resource-environment.md)，例如应用内主题和语言。