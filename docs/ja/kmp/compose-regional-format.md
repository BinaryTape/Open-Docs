# 地域別フォーマットの管理

テキストフィールドや日付と時刻のピッカーなどの関連コンポーネントは、ロケール固有の書式設定パターンを自動的に適用します。これには、数値、日付、時刻、通貨の書式設定が含まれます。これらのパターンは、システムのロケールまたはアプリケーション内で設定されたカスタムロケールによって決定され、プラットフォーム間での一貫したデータ表示を保証します。

## ロケールの書式設定パターン

Compose Multiplatform での書式設定は、以下のプラットフォーム固有のロケール規則を尊重します。

*   数値区切り文字。千の位はコンマまたはピリオドで区切られます。例: `en-US` では `1,234.56`、`de-DE` では `1.234,56`。
*   日付/時刻パターン。12月1日の日付は `en-US` では `12/1/20` のように見えますが、`fr-CA` では同じ日付は `2020-12-01` のように見えます。
*   通貨記号と配置。ローカル通貨記号は数字の前または後に配置できます。例: `en-US` では `$5,001`、`fr-FR` では `5.001,00 €`。

これらの地域別フォーマットは、システムロケールと、アプリで定義されたカスタムロケールの上書きの両方で、そのまま機能します。

書式設定は現在、iOS では `kotlinx-datetime` ライブラリ、Android およびデスクトップでは JDK API を使用して実装されています。iOS ソースセットでローカライズされた日付と通貨の値を管理する例を次に示します。

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

## 一貫した書式設定の確保

統一されたマルチプラットフォームソリューションのための共通 API はありませんが、ほとんどの場合、書式設定の動作は一貫しています。サポートされているすべての地域で書式設定が正しいことを確認するには:

*   大きな数値、負の値、ゼロなどのエッジケースをテストします。
*   すべてのターゲットプラットフォームで、サポートされているすべてのロケールについて書式設定を検証します。

## 次のステップ

アプリ内テーマや言語など、アプリケーションの[リソース環境](compose-resource-environment.md)を管理する方法を学びます。