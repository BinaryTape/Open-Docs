# 지역 형식 관리

텍스트 필드와 날짜 및 시간 선택기 같은 관련 컴포넌트는 로케일별 서식 패턴을 자동으로 적용합니다. 여기에는 숫자, 날짜, 시간 및 통화의 서식이 포함됩니다. 이러한 패턴은 시스템의 로케일 또는 애플리케이션 내에서 설정된 사용자 정의 로케일에 의해 결정되며, 플랫폼 전반에 걸쳐 일관된 데이터 표시를 보장합니다.

## 로케일 서식 패턴

Compose Multiplatform의 서식 지정은 다음과 같은 플랫폼별 로케일 규칙을 준수합니다.

 *  **숫자 구분 기호.** 천 단위는 쉼표나 마침표로 구분될 수 있습니다. `en-US`에서는 `1,234.56`이고 `de-DE`에서는 `1.234,56`입니다.
 *  **날짜/시간 패턴.** 12월 1일 날짜는 `en-US`에서 `12/1/20`처럼 보이고, `fr-CA`에서는 `2020-12-01`처럼 보입니다.
 *  **통화 기호 및 배치.** 현지 통화 기호는 숫자 앞이나 뒤에 배치될 수 있습니다. `en-US`에서는 `$5,001`이고 `fr-FR`에서는 `5.001,00 €`입니다.

이러한 지역 형식은 시스템 로케일과 앱에 정의된 사용자 정의 로케일 재정의 모두에서 즉시 작동합니다.

현재 서식 지정은 iOS에서는 `kotlinx-datetime` 라이브러리를 사용하고, Android 및 데스크톱에서는 JDK API를 사용하여 구현됩니다. 다음은 iOS 소스 세트에서 지역화된 날짜 및 통화 값을 관리하는 예시입니다.

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

## 일관된 서식 보장

통합 멀티플랫폼 솔루션을 위한 공통 API는 없지만, 대부분의 경우 서식 지정 동작은 여전히 일관적입니다. 모든 지원 지역에서 서식 지정이 올바른지 확인하려면 다음을 수행하세요.

*   큰 숫자, 음수 값 또는 0과 같은 엣지 케이스를 테스트합니다.
*   모든 대상 플랫폼에서 지원되는 모든 로케일에 대한 서식 지정을 확인합니다.

## 다음 단계

애플리케이션의 인앱 테마 및 언어와 같은 [리소스 환경](compose-resource-environment.md)을 관리하는 방법을 알아보세요.