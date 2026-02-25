# 管理地區格式

文字欄位與相關組建（如日期和時間選擇器）會自動套用特定地區設定的格式化模式。
這些包括數字、日期、時間和貨幣的格式化。
這些模式由系統的地區設定或在應用程式中設定的自訂地區設定決定，確保跨平台資料顯示的一致性。

## 地區格式化模式

Compose Multiplatform 中的格式化遵循特定平台的地區設定慣例：

 * **數字分隔符號**。千分位可以用逗號或句點分隔：`en-US` 中為 `1,234.56`，而 `de-DE` 中為 `1.234,56`。
 * **日期／時間模式**。12 月 1 日在 `en-US` 中顯示為 `12/1/20`，而同樣的日期在 `fr-CA` 中則顯示為 `2020-12-01`。
 * **貨幣符號與位置**。本地貨幣符號可以放在數字之前或之後：`en-US` 中為 `$5,001`，而 `fr-FR` 中為 `5.001,00 €`。

這些地區格式對於系統地區設定與應用程式中定義的自訂地區設定覆蓋，皆能開箱即用。

格式化目前在 iOS 上使用 `kotlinx-datetime` 程式庫實作，在 Android 和桌面端則使用 JDK API。
以下是在 iOS 原始碼集管理在地化日期與貨幣值的範例：

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

    // 要格式化為貨幣的範例值
    val amount = 1234.56

    // 在 iOS 上使用 NSNumberFormatter 進行貨幣格式化
    val currencyFormatter = NSNumberFormatter().apply { 
        numberStyle = NSNumberFormatterCurrencyStyle
        locale = currentLocale
    }
    val formattedCurrency = currencyFormatter.stringFromNumber(NSNumber(amount)) 

    // 使用 `kotlinx-datetime` 獲取目前日期
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

雖然目前沒有用於統一多平台解決方案的通用 API，但在大多數情況下格式化行為仍然是一致的。
若要確保所有支援地區的格式化皆正確：

* 測試邊緣情況，例如大數值、負值或零。
* 在所有目標平台上驗證所有支援地區設定的格式化。

## 下一步

進一步了解如何管理應用程式的 [資源環境](compose-resource-environment.md)，例如應用程式內的佈景主題和語言。