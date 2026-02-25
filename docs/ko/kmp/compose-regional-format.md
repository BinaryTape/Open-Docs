# 지역 서식 관리

텍스트 필드와 날짜 및 시간 선택기(picker) 같은 관련 컴포넌트는 로케일(locale)별 서식 패턴을 자동으로 적용합니다.
여기에는 숫자, 날짜, 시간 및 통화 서식이 포함됩니다.
이러한 패턴은 시스템 로케일이나 애플리케이션 내에서 설정한 사용자 정의 로케일에 의해 결정되어, 여러 플랫폼에서 일관된 데이터 표시를 보장합니다.

## 로케일 서식 패턴

Compose Multiplatform의 서식 지정은 다음 항목에 대해 플랫폼별 로케일 관례를 준수합니다:

 * **숫자 구분 기호(Numeric separators):** 천 단위 구분 기호로 쉼표나 마침표를 사용할 수 있습니다. 예를 들어 `en-US`에서는 `1,234.56`이지만 `de-DE`에서는 `1.234,56`입니다.
 * **날짜/시간 패턴:** 12월 1일은 `en-US`에서 `12/1/20`으로 표시되는 반면, `fr-CA`에서는 `2020-12-01`로 표시됩니다.
 * **통화 기호 및 위치:** 지역 통화 기호는 숫자 앞이나 뒤에 올 수 있습니다. `en-US`에서는 `$5,001`이고 `fr-FR`에서는 `5.001,00 €`입니다.

이러한 지역 서식은 시스템 로케일과 앱에 정의된 사용자 정의 로케일 재정의(override) 모두에서 별도의 설정 없이도(out of the box) 작동합니다.

서식 지정은 현재 iOS에서는 `kotlinx-datetime` 라이브러리를 사용하고, Android 및 데스크톱에서는 JDK API를 사용하여 구현됩니다.
다음은 iOS 소스 세트에서 로컬라이즈된 날짜 및 통화 값을 관리하는 예제입니다:

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

    // 통화로 서식을 지정할 샘플 값
    val amount = 1234.56

    // iOS에서 통화 서식 지정을 위해 NSNumberFormatter를 사용합니다.
    val currencyFormatter = NSNumberFormatter().apply { 
        numberStyle = NSNumberFormatterCurrencyStyle
        locale = currentLocale
    }
    val formattedCurrency = currencyFormatter.stringFromNumber(NSNumber(amount)) 

    // `kotlinx-datetime`을 사용하여 현재 날짜를 가져옵니다.
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

## 일관된 서식 보장하기

통합된 멀티플랫폼 솔루션을 위한 공통 API는 없지만, 서식 지정 동작은 대부분의 경우 일관되게 유지됩니다.
지원되는 모든 지역에서 서식이 올바르게 지정되었는지 확인하려면 다음을 수행하세요:

* 큰 숫자, 음수 또는 0과 같은 에지 케이스(edge case)를 테스트하세요.
* 모든 대상 플랫폼에서 지원되는 모든 로케일에 대한 서식을 확인하세요.

## 다음 단계

앱 내 테마 및 언어와 같은 애플리케이션의 [리소스 환경(resource environment)](compose-resource-environment.md)을 관리하는 방법을 알아보세요.