# 管理區域格式

文字欄位和相關元件，例如日期與時間選擇器，會自動套用語言環境特定的格式模式。這些模式包括數字、日期、時間和貨幣的格式設定。這些模式由系統的語言環境或您應用程式中設定的自訂語言環境決定，確保跨平台資料顯示一致。

## 語言環境格式模式

Compose Multiplatform 中的格式設定遵循平台特定的語言環境慣例，適用於：

 * 數字分隔符號。千位數可以使用逗號或句點分隔：在 `en-US` 中為 `1,234.56`，在 `de-DE` 中為 `1.234,56`。
 * 日期/時間模式。12月1日的日期在 `en-US` 中顯示為 `12/1/20`，而同一日期在 `fr-CA` 中顯示為 `2020-12-01`。
 * 貨幣符號與位置。當地貨幣符號可以放置在數字之前或之後：在 `en-US` 中為 `$5,001`，在 `fr-FR` 中為 `5.001,00 €`。

這些區域格式對於系統語言環境和應用程式中定義的自訂語言環境覆寫都開箱即用。

格式設定目前在 iOS 上是使用 `kotlinx-datetime` 函式庫實作的，在 Android 和桌上型電腦上則是使用 JDK API。以下是在 iOS 原始碼集 (source set) 中管理本地化日期和貨幣值的範例：

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

## 確保格式一致性

雖然沒有通用的 API 用於統一的多平台解決方案，但格式設定行為在大多數情況下仍然一致。為確保所有支援區域的格式設定正確：

* 測試邊緣案例，例如大數字、負值或零。
* 在所有目標平台上驗證所有支援語言環境的格式設定。

## 下一步

了解如何管理應用程式的[資源環境](compose-resource-environment.md)，例如應用程式內的主題和語言。