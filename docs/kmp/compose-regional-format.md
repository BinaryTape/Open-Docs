# 管理区域格式

文本字段及日期和时间选择器等相关组件，会自动应用区域设置特有的格式化模式。这些模式包括数字、日期、时间及货币的格式化。模式由系统区域设置或在应用程序中设置的自定义区域设置决定，确保数据在不同平台上的显示一致。

## 区域设置格式化模式

Compose Multiplatform 中的格式化遵循平台特有的区域设置惯例，适用于：

*   数字分隔符。千位可由逗号或句点分隔：`en-US` 为 `1,234.56`，`de-DE` 为 `1.234,56`。
*   日期/时间模式。12 月 1 日的日期在 `en-US` 中显示为 `12/1/20`，而在 `fr-CA` 中则显示为 `2020-12-01`。
*   货币符号和位置。本地货币符号可以放在数字之前或之后：`en-US` 为 `$5,001`，`fr-FR` 为 `5.001,00 €`。

这些区域格式对系统区域设置以及在应用中定义的自定义区域设置覆盖都是开箱即用的。

目前，格式化在 iOS 上使用 `kotlinx-datetime` 库实现，在 Android 和桌面平台使用 JDK API 实现。
以下是在 iOS 源代码集中管理本地化日期和货币值的示例：

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

    // 格式化为货币的示例值
    val amount = 1234.56

    // 在 iOS 上使用 NSNumberFormatter 进行货币格式化
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

## 确保格式一致性

尽管目前没有统一的多平台解决方案的公共 API，但在大多数情况下，格式化行为仍然是一致的。
为确保在所有支持区域的格式化正确无误：

*   测试边缘情况，例如大数、负值或零值。
*   在所有目标平台上验证所有支持的区域设置的格式化。

## 接下来

了解如何管理应用程序的[资源环境](compose-resource-environment.md)，例如应用内主题和语言。