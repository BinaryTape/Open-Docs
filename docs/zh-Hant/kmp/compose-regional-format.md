# 管理區域格式

文字欄位和相關元件，例如日期和時間選擇器，會自動套用區域設定專屬的格式模式。這些模式包括數字、日期、時間和貨幣的格式化。模式由系統的區域設定或應用程式中設定的自訂區域設定決定，確保跨平台資料顯示的一致性。

## 區域設定格式模式

Compose Multiplatform 中的格式化遵循平台特定的區域設定慣例：

*   數字分隔符。千位數可以使用逗號或句號分隔：在 `en-US` 中是 `1,234.56`，在 `de-DE` 中是 `1.234,56`。
*   日期/時間模式。12 月 1 日的日期在 `en-US` 中看起來像 `12/1/20`，而相同的日期在 `fr-CA` 中看起來像 `2020-12-01`。
*   貨幣符號和位置。當地貨幣符號可以放置在數字之前或之後：在 `en-US` 中是 `$5,001`，在 `fr-FR` 中是 `5.001,00 €`。

這些區域格式對於系統區域設定和應用程式中定義的自訂區域設定覆寫都可以開箱即用。

目前，iOS 上的格式化是使用 `kotlinx-datetime` 函式庫實作的，而 Android 和桌面平台則是使用 JDK API。以下是在 iOS 原始碼集中管理本地化日期和貨幣值的範例：

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

## 確保格式一致

儘管沒有用於統一多平台解決方案的通用 API，但在大多數情況下，格式化行為仍然是一致的。為了確保所有支援區域的格式正確無誤：

*   測試邊緣案例，例如大數字、負值或零。
*   驗證所有目標平台上所有支援的區域設定的格式。

## 下一步

了解如何管理應用程式的[資源環境](compose-resource-environment.md)，例如應用程式內主題和語言。