[//]: # (title: 중급: 라이브러리 및 API)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">확장 함수</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">스코프 함수</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">리시버가 있는 람다 표현식</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">클래스 및 인터페이스</a><br />
        <img src="icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">객체</a><br />
        <img src="icon-6-done.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">열린 클래스 및 특수 클래스</a><br />
        <img src="icon-7-done.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">프로퍼티</a><br />
        <img src="icon-8-done.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">널 안전성</a><br />
        <img src="icon-9.svg" width="20" alt="Ninth step" /> <strong>라이브러리 및 API</strong><br /></p>
</tldr>

Kotlin을 최대한 활용하려면 기존 라이브러리와 API를 사용하여 코딩에 더 많은 시간을 할애하고 불필요한 재발명에 시간을 덜 쓸 수 있습니다.

라이브러리는 일반적인 작업을 단순화하는 재사용 가능한 코드를 배포합니다. 라이브러리 내에는 관련 클래스, 함수 및 유틸리티를 그룹화하는 패키지와 객체가 있습니다. 라이브러리는 개발자가 코드에서 사용할 수 있는 함수, 클래스 또는 프로퍼티 집합으로 API(애플리케이션 프로그래밍 인터페이스)를 노출합니다.

![Kotlin libraries and APIs](kotlin-library-diagram.svg){width=600}

Kotlin으로 무엇을 할 수 있는지 살펴보겠습니다.

## 표준 라이브러리

Kotlin은 코드를 간결하고 표현력 있게 만드는 데 필요한 필수 타입, 함수, 컬렉션 및 유틸리티를 제공하는 표준 라이브러리를 가지고 있습니다. 표준 라이브러리의 대부분( [`kotlin` 패키지](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/) 내의 모든 것)은 명시적으로 가져올 필요 없이 모든 Kotlin 파일에서 즉시 사용할 수 있습니다.

```kotlin
fun main() {
    val text = "emosewa si niltoK"
    
   // 표준 라이브러리의 reversed() 함수 사용
    val reversedText = text.reversed()

    // 표준 라이브러리의 print() 함수 사용
    print(reversedText)
    // Kotlin is awesome
}
```
{kotlin-runnable="true" id="kotlin-tour-libraries-stdlib"}

하지만 표준 라이브러리의 일부는 코드에서 사용하기 전에 가져오기(import)가 필요합니다. 예를 들어, 표준 라이브러리의 시간 측정 기능을 사용하려면 [`kotlin.time` 패키지](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/)를 가져와야 합니다.

파일 상단에 필요한 패키지 뒤에 `import` 키워드를 추가합니다.

```kotlin
import kotlin.time.*
```

별표 `*`는 Kotlin에게 해당 패키지 내의 모든 것을 가져오도록 지시하는 와일드카드 가져오기(wildcard import)입니다. 별표 `*`는 컴패니언 객체와 함께 사용할 수 없습니다. 대신 사용하려는 컴패니언 객체의 멤버를 명시적으로 선언해야 합니다.

예를 들면 다음과 같습니다:

```kotlin
import kotlin.time.Duration
import kotlin.time.Duration.Companion.hours
import kotlin.time.Duration.Companion.minutes

fun main() {
    val thirtyMinutes: Duration = 30.minutes
    val halfHour: Duration = 0.5.hours
    println(thirtyMinutes == halfHour)
    // true
}
```
{kotlin-runnable="true" id="kotlin-tour-libraries-time"}

이 예시는 다음을 보여줍니다:

* `Duration` 클래스와 해당 컴패니언 객체의 `hours` 및 `minutes` 확장 프로퍼티를 가져옵니다.
* `minutes` 프로퍼티를 사용하여 `30`을 30분 `Duration`으로 변환합니다.
* `hours` 프로퍼티를 사용하여 `0.5`를 30분 `Duration`으로 변환합니다.
* 두 `Duration`이 동일한지 확인하고 결과를 출력합니다.

### 빌드하기 전에 검색하기

직접 코드를 작성하기로 결정하기 전에, 표준 라이브러리에 찾고 있는 것이 이미 존재하는지 확인하세요. 다음은 표준 라이브러리가 이미 다양한 클래스, 함수 및 프로퍼티를 제공하는 영역 목록입니다.

* [컬렉션](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/)
* [시퀀스](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.sequences/)
* [문자열 조작](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/)
* [시간 관리](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/)

표준 라이브러리에 무엇이 더 있는지 자세히 알아보려면 [API 레퍼런스](https://kotlinlang.org/api/core/kotlin-stdlib/)를 살펴보세요.

## Kotlin 라이브러리

표준 라이브러리는 많은 일반적인 사용 사례를 다루지만, 다루지 않는 일부도 있습니다. 다행히도 Kotlin 팀과 커뮤니티는 표준 라이브러리를 보완하기 위해 광범위한 라이브러리를 개발했습니다. 예를 들어, [`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/)은 여러 플랫폼에서 시간을 관리하는 데 도움이 됩니다.

유용한 라이브러리는 [검색 플랫폼](https://klibs.io/)에서 찾을 수 있습니다. 이러한 라이브러리를 사용하려면 의존성(dependency)을 추가하거나 플러그인을 설치하는 등의 추가 단계가 필요합니다. 각 라이브러리에는 Kotlin 프로젝트에 포함하는 방법에 대한 지침이 있는 GitHub 저장소가 있습니다.

라이브러리를 추가하면 그 안에 있는 모든 패키지를 가져올 수 있습니다. 다음은 뉴욕의 현재 시간을 찾기 위해 `kotlinx-datetime` 패키지를 가져오는 방법의 예시입니다:

```kotlin
import kotlinx.datetime.*

fun main() {
    val now = Clock.System.now() // 현재 Instant 가져오기
    println("Current instant: $now")

    val zone = TimeZone.of("America/New_York")
    val localDateTime = now.toLocalDateTime(zone)
    println("Local date-time in NY: $localDateTime")
}
```
{kotlin-runnable="true" id="kotlin-tour-libraries-datetime"}

이 예시는 다음을 보여줍니다:

* `kotlinx.datetime` 패키지를 가져옵니다.
* `Clock.System.now()` 함수를 사용하여 현재 시간을 포함하는 `Instant` 클래스의 인스턴스를 생성하고 그 결과를 `now` 변수에 할당합니다.
* 현재 시간을 출력합니다.
* `TimeZone.of()` 함수를 사용하여 뉴욕의 시간대를 찾고 그 결과를 `zone` 변수에 할당합니다.
* 현재 시간을 포함하는 인스턴스에서 뉴욕 시간대를 인수로 사용하여 `.toLocalDateTime()` 함수를 호출합니다.
* 그 결과를 `localDateTime` 변수에 할당합니다.
* 뉴욕 시간대에 맞춰 조정된 시간을 출력합니다.

> 이 예시에서 사용된 함수와 클래스를 더 자세히 살펴보려면 [API 레퍼런스](https://kotlinlang.org/api/kotlinx-datetime/kotlinx-datetime/kotlinx.datetime/)를 참조하세요.
>
{style="tip"}

## API 옵트인

라이브러리 작성자는 코드에서 사용하기 전에 특정 API에 옵트인(opt-in)이 필요하다고 표시할 수 있습니다. 이것은 일반적으로 API가 아직 개발 중이며 향후 변경될 수 있을 때 이루어집니다. 옵트인하지 않으면 다음과 같은 경고나 오류가 발생합니다.

```text
This declaration needs opt-in. Its usage should be marked with '@...' or '@OptIn(...)'
```

옵트인하려면 `@OptIn` 뒤에 API를 분류하는 클래스 이름과 두 개의 콜론 `::`, 그리고 `class`를 괄호 안에 포함하여 작성합니다.

예를 들어, 표준 라이브러리의 `uintArrayOf()` 함수는 [API 레퍼런스](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/to-u-int-array.html)에 표시된 대로 `@ExperimentalUnsignedTypes`에 속합니다.

```kotlin
@ExperimentalUnsignedTypes
inline fun uintArrayOf(vararg elements: UInt): UIntArray
```

코드에서 옵트인은 다음과 같습니다:

```kotlin
@OptIn(ExperimentalUnsignedTypes::class)
```

다음은 `uintArrayOf()` 함수를 사용하여 부호 없는 정수 배열을 생성하고 그 요소 중 하나를 수정하기 위해 옵트인하는 예시입니다:

```kotlin
@OptIn(ExperimentalUnsignedTypes::class)
fun main() {
    // 부호 없는 정수 배열 생성
    val unsignedArray: UIntArray = uintArrayOf(1u, 2u, 3u, 4u, 5u)

    // 요소 수정
    unsignedArray[2] = 42u
    println("Updated array: ${unsignedArray.joinToString()}")
    // Updated array: 1, 2, 42, 4, 5
}
```
{kotlin-runnable="true" id="kotlin-tour-libraries-apis"}

이것은 가장 쉬운 옵트인 방법이지만, 다른 방법도 있습니다. 더 자세히 알아보려면 [옵트인 요구 사항](opt-in-requirements.md)을 참조하세요.

## 연습

### 연습 1 {initial-collapse-state="collapsed" collapsible="true" id="libraries-exercise-1"}

사용자가 투자 자산의 미래 가치를 계산하는 데 도움을 주는 금융 애플리케이션을 개발하고 있습니다. 복리 이자를 계산하는 공식은 다음과 같습니다.

<math>A = P \times (1 + \displaystyle\frac{r}{n})^{nt}</math>

여기서:

* `A`는 이자 후 누적된 금액(원금 + 이자)입니다.
* `P`는 원금(초기 투자액)입니다.
* `r`는 연간 이자율(소수점)입니다.
* `n`은 연간 이자가 복리 계산되는 횟수입니다.
* `t`는 자금이 투자된 기간(년 단위)입니다.

코드를 다음으로 업데이트하세요:

1. [`kotlin.math` 패키지](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.math/)에서 필요한 함수를 가져옵니다.
2. 복리 이자를 적용한 후의 최종 금액을 계산하는 `calculateCompoundInterest()` 함수에 본문을 추가합니다.

|--|--|

```kotlin
// 여기에 코드를 작성하세요

fun calculateCompoundInterest(P: Double, r: Double, n: Int, t: Int): Double {
    // 여기에 코드를 작성하세요
}

fun main() {
    val principal = 1000.0
    val rate = 0.05
    val timesCompounded = 4
    val years = 5
    val amount = calculateCompoundInterest(principal, rate, timesCompounded, years)
    println("The accumulated amount is: $amount")
    // The accumulated amount is: 1282.0372317085844
}

```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-libraries-exercise-1"}

|---|---|
```kotlin
import kotlin.math.*

fun calculateCompoundInterest(P: Double, r: Double, n: Int, t: Int): Double {
    return P * (1 + r / n).pow(n * t)
}

fun main() {
    val principal = 1000.0
    val rate = 0.05
    val timesCompounded = 4
    val years = 5
    val amount = calculateCompoundInterest(principal, rate, timesCompounded, years)
    println("The accumulated amount is: $amount")
    // The accumulated amount is: 1282.0372317085844
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-libraries-solution-1"}

### 연습 2 {initial-collapse-state="collapsed" collapsible="true" id="libraries-exercise-2"}

프로그램에서 여러 데이터 처리 작업을 수행하는 데 걸리는 시간을 측정하고자 합니다. 코드를 업데이트하여 [`kotlin.time`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.time/) 패키지에서 올바른 import 문과 함수를 추가하세요.

|---|---|

```kotlin
// 여기에 코드를 작성하세요

fun main() {
    val timeTaken = /* 여기에 코드를 작성하세요 */ {
        // 데이터 처리 시뮬레이션
        val data = List(1000) { it * 2 }
        val filteredData = data.filter { it % 3 == 0 }

        // 필터링된 데이터 처리 시뮬레이션
        val processedData = filteredData.map { it / 2 }
        println("Processed data")
    }

    println("Time taken: $timeTaken") // e.g. 16 ms
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-libraries-exercise-2"}

|---|---|
```kotlin
import kotlin.time.measureTime

fun main() {
    val timeTaken = measureTime {
        // 데이터 처리 시뮬레이션
        val data = List(1000) { it * 2 }
        val filteredData = data.filter { it % 3 == 0 }

        // 필터링된 데이터 처리 시뮬레이션
        val processedData = filteredData.map { it / 2 }
        println("Processed data")
    }

    println("Time taken: $timeTaken") // e.g. 16 ms
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-libraries-solution-2"}

### 연습 3 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-3"}

최신 Kotlin 릴리스에 표준 라이브러리의 새로운 기능이 있습니다. 이 기능을 사용해보고 싶지만, 옵트인이 필요합니다. 이 기능은 [`@ExperimentalStdlibApi`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-experimental-stdlib-api/)에 속합니다. 코드에서 옵트인은 어떤 모습이어야 할까요?

|---|---|
```kotlin
@OptIn(ExperimentalStdlibApi::class)
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="예시 솔루션" id="kotlin-tour-libraries-solution-3"}

## 다음 단계는?

축하합니다! 중급 투어를 완료했습니다! 다음 단계로, 인기 있는 Kotlin 애플리케이션 튜토리얼을 확인해 보세요:

* [Spring Boot와 Kotlin으로 백엔드 애플리케이션 만들기](jvm-create-project-with-spring-boot.md)
* Android 및 iOS용 크로스 플랫폼 애플리케이션을 처음부터 만들고:
    * [UI는 네이티브로 유지하면서 비즈니스 로직 공유하기](https://kotlinlang.org/docs/multiplatform/multiplatform-create-first-app.html)
    * [비즈니스 로직과 UI 공유하기](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-create-first-app.html)