# 地域形式の管理

テキストフィールドや、日付・時刻ピッカーなどの関連コンポーネントは、ロケール固有のフォーマットパターンを自動的に適用します。
これらには、数値、日付、時刻、通貨のフォーマットが含まれます。
これらのパターンは、システムのロケール、またはアプリケーション内で設定されたカスタムロケールによって決定され、プラットフォーム間での一貫したデータ表示を保証します。

## ロケールのフォーマットパターン

Compose Multiplatform におけるフォーマットは、以下の項目についてプラットフォーム固有のロケール慣習を尊重します：

 * **数値の区切り記号。** 桁区切りはカンマまたはピリオドで行われます。例えば、`en-US` では `1,234.56`、`de-DE` では `1.234,56` となります。
 * **日付/時刻のパターン。** 12月1日の日付は、`en-US` では `12/1/20` のように表示されますが、`fr-CA` では同じ日付が `2020-12-01` となります。
 * **通貨記号と配置。** 通貨記号は、数字の前または後のいずれかに配置されます。`en-US` では `$5,001`、`fr-FR` では `5.001,00 €` となります。

これらの地域形式は、システムのロケールと、アプリで定義されたカスタムロケールのオーバーライドの両方で、設定なしですぐに機能します。

フォーマット機能は現在、iOS では `kotlinx-datetime` ライブラリを使用し、Android およびデスクトップでは JDK API を使用して実装されています。
以下は、iOS ソースセットでローカライズされた日付と通貨の値を管理する例です：

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

    // 通貨としてフォーマットするサンプル値
    val amount = 1234.56

    // iOS で通貨フォーマットに NSNumberFormatter を使用
    val currencyFormatter = NSNumberFormatter().apply { 
        numberStyle = NSNumberFormatterCurrencyStyle
        locale = currentLocale
    }
    val formattedCurrency = currencyFormatter.stringFromNumber(NSNumber(amount)) 

    // `kotlinx-datetime` を使用して現在の日付を取得
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

## フォーマットの一貫性の確保

統一されたマルチプラットフォーム・ソリューションのための共通 API はまだありませんが、ほとんどの場合、フォーマットの動作は一貫しています。
サポートされているすべての地域でフォーマットが正しく行われることを確実にするために、以下の点を確認してください：

* 大きな数値、負の値、ゼロなどのエッジケースをテストする。
* すべてのターゲットプラットフォームにおいて、サポートされているすべてのロケールでフォーマットを検証する。

## 次のステップ

アプリ内テーマや言語など、アプリケーションの [リソース環境](compose-resource-environment.md) を管理する方法を確認しましょう。