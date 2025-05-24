---
title: "시간 측정"
---
Kotlin 표준 라이브러리는 다양한 단위로 시간을 계산하고 측정할 수 있는 도구를 제공합니다.
정확한 시간 측정은 다음과 같은 활동에 중요합니다.
  * 스레드 또는 프로세스 관리
  * 통계 수집
  * 시간 초과 감지
  * 디버깅

기본적으로 시간은 단조 시간 소스를 사용하여 측정되지만 다른 시간 소스를 구성할 수 있습니다.
자세한 내용은 [시간 소스 생성](#create-time-source)을 참조하세요.

## 기간 계산

시간의 양을 나타내기 위해 표준 라이브러리에는 [`Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/)
클래스가 있습니다. `Duration`은 [`DurationUnit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration-unit/)
enum 클래스의 다음 단위로 표현할 수 있습니다.
  * `NANOSECONDS`
  * `MICROSECONDS`
  * `MILLISECONDS`
  * `SECONDS`
  * `MINUTES`
  * `HOURS`
  * `DAYS`

`Duration`은 양수, 음수, 0, 양의 무한대 또는 음의 무한대일 수 있습니다.

### 기간 생성

`Duration`을 생성하려면 `Int`, `Long` 및 `Double` 유형에 사용할 수 있는 [extension properties](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/#companion-object-properties)를 사용하세요. `nanoseconds`, `microseconds`, `milliseconds`, `seconds`, `minutes`,
`hours`, and `days`.

> Days는 24시간의 기간을 나타냅니다. 달력 날짜가 아닙니다.
> 

예를 들어:

```kotlin
import kotlin.time.*
import kotlin.time.Duration.Companion.nanoseconds
import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.Duration.Companion.seconds
import kotlin.time.Duration.Companion.minutes
import kotlin.time.Duration.Companion.days

fun main() {

    val fiveHundredMilliseconds: Duration = 500.milliseconds
    val zeroSeconds: Duration = 0.seconds
    val tenMinutes: Duration = 10.minutes
    val negativeNanosecond: Duration = (-1).nanoseconds
    val infiniteDays: Duration = Double.POSITIVE_INFINITY.days
    val negativeInfiniteDays: Duration = Double.NEGATIVE_INFINITY.days

    println(fiveHundredMilliseconds) // 500ms
    println(zeroSeconds)             // 0s
    println(tenMinutes)              // 10m
    println(negativeNanosecond)      // -1ns
    println(infiniteDays)            // Infinity
    println(negativeInfiniteDays)    // -Infinity

}
```

`Duration` 객체로 기본적인 산술 연산을 수행할 수도 있습니다.

```kotlin
import kotlin.time.*
import kotlin.time.Duration.Companion.seconds

fun main() {

    val fiveSeconds: Duration = 5.seconds
    val thirtySeconds: Duration = 30.seconds

    println(fiveSeconds + thirtySeconds)
    // 35s
    println(thirtySeconds - fiveSeconds)
    // 25s
    println(fiveSeconds * 2)
    // 10s
    println(thirtySeconds / 2)
    // 15s
    println(thirtySeconds / fiveSeconds)
    // 6.0
    println(-thirtySeconds)
    // -30s
    println((-thirtySeconds).absoluteValue)
    // 30s

}
```

### 문자열 표현 가져오기

`Duration`의 문자열 표현을 갖는 것은 인쇄, 직렬화, 전송 또는 저장하는 데 유용할 수 있습니다.

문자열 표현을 얻으려면 `.toString()` 함수를 사용합니다. 기본적으로 시간은 존재하는 각 단위를 사용하여 보고됩니다. 예를 들어: `1h 0m 45.677s` 또는 `-(6d 5h 5m 28.284s)`

출력을 구성하려면 원하는 `DurationUnit` 및 소수 자릿수와 함께 `.toString()` 함수를 함수 매개변수로 사용합니다.

```kotlin
import kotlin.time.Duration
import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.DurationUnit

fun main() {

    // 소수점 2자리로 초 단위로 인쇄
    println(5887.milliseconds.toString(DurationUnit.SECONDS, 2))
    // 5.89s

}
```

[ISO-8601 호환](https://en.wikipedia.org/wiki/ISO_8601) 문자열을 얻으려면 [`toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html)
함수를 사용합니다.

```kotlin
import kotlin.time.Duration.Companion.seconds

fun main() {

    println(86420.seconds.toIsoString()) // PT24H0M20S

}
```

### 기간 변환

`Duration`을 다른 `DurationUnit`으로 변환하려면 다음 속성을 사용합니다.
* `inWholeNanoseconds`
* `inWholeMicroseconds`
* `inWholeSeconds`
* `inWholeMinutes`
* `inWholeHours`
* `inWholeDays`

예를 들어:

```kotlin
import kotlin.time.Duration
import kotlin.time.Duration.Companion.minutes

fun main() {

    val thirtyMinutes: Duration = 30.minutes
    println(thirtyMinutes.inWholeSeconds)
    // 1800

}
```

또는 다음 확장 함수에서 원하는 `DurationUnit`을 함수 매개변수로 사용할 수 있습니다.
* `.toInt()`
* `.toDouble()`
* `.toLong()`

예를 들어:

```kotlin
import kotlin.time.Duration.Companion.seconds
import kotlin.time.DurationUnit

fun main() {

    println(270.seconds.toDouble(DurationUnit.MINUTES))
    // 4.5

}
```

### 기간 비교

`Duration` 객체가 같은지 확인하려면 같음 연산자 (`==`)를 사용합니다.

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

`Duration` 객체를 비교하려면 비교 연산자 (`<`, `>`)를 사용합니다.

```kotlin
import kotlin.time.Duration.Companion.microseconds
import kotlin.time.Duration.Companion.nanoseconds

fun main() {

    println(3000.microseconds < 25000.nanoseconds)
    // false

}
```

### 기간을 구성 요소로 분할

`Duration`을 시간 구성 요소로 분할하고 추가 작업을 수행하려면 
[`toComponents()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-components.html) 함수의 오버로드를 사용합니다.
원하는 작업을 함수 매개변수로 함수 또는 람다 표현식으로 추가합니다.

예를 들어:

```kotlin
import kotlin.time.Duration
import kotlin.time.Duration.Companion.minutes

fun main() {

    val thirtyMinutes: Duration = 30.minutes
    println(thirtyMinutes.toComponents { hours, minutes, _, _ `->` "${hours}h:${minutes}m" })
    // 0h:30m

}
```

이 예제에서 람다 표현식은 함수 매개변수로 `hours` 및 `minutes`를 사용하고 사용되지 않는 `seconds` 및 `nanoseconds` 매개변수에는 밑줄(`_`)을 사용합니다. 이 표현식은 [문자열 템플릿](strings#string-templates)을 사용하여 연결된 문자열을 반환하여 `hours` 및 `minutes`의 원하는 출력 형식을 얻습니다.

## 시간 측정

시간 경과를 추적하기 위해 표준 라이브러리는 다음과 같은 작업을 쉽게 수행할 수 있도록 도구를 제공합니다.
* 원하는 시간 단위로 일부 코드를 실행하는 데 걸리는 시간을 측정합니다.
* 특정 시점을 표시합니다.
* 두 시점의 시간을 비교하고 뺍니다.
* 특정 시점 이후로 얼마나 많은 시간이 경과했는지 확인합니다.
* 현재 시간이 특정 시점을 지났는지 확인합니다.

### 코드 실행 시간 측정

코드 블록을 실행하는 데 걸리는 시간을 측정하려면 [`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html)
inline 함수를 사용합니다.

```kotlin
import kotlin.time.measureTime

fun main() {

    val timeTaken = measureTime {
        Thread.sleep(100)
    }
    println(timeTaken) // 예: 103 ms

}
```

코드 블록을 실행하는 데 걸리는 시간을 측정 **하고** 코드 블록의 값을 반환하려면 inline 함수 [`measureTimedValue`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html)를 사용합니다.

예를 들어:

```kotlin
import kotlin.time.measureTimedValue

fun main() {

    val (value, timeTaken) = measureTimedValue {
        Thread.sleep(100)
        42
    }
    println(value)     // 42
    println(timeTaken) // 예: 103 ms

}
```

기본적으로 두 함수 모두 단조 시간 소스를 사용합니다.

### 시간 표시

특정 시점을 표시하려면 [`TimeSource`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/)
인터페이스와 [`markNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/mark-now.html) 함수를 사용하여
[`TimeMark`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/)를 만듭니다.

```kotlin
import kotlin.time.*

fun main() {
   val timeSource = TimeSource.Monotonic
   val mark = timeSource.markNow()
}
```

### 시간 차이 측정

동일한 시간 소스의 `TimeMark` 객체 간의 차이를 측정하려면 빼기 연산자 (`-`)를 사용합니다.

동일한 시간 소스의 `TimeMark` 객체를 비교하려면 비교 연산자 (`<`, `>`)를 사용합니다.

예를 들어:

```kotlin
import kotlin.time.*

fun main() {

   val timeSource = TimeSource.Monotonic
   val mark1 = timeSource.markNow()
   Thread.sleep(500) // 0.5초 동안 대기합니다.
   val mark2 = timeSource.markNow()

   repeat(4) { n `->`
       val mark3 = timeSource.markNow()
       val elapsed1 = mark3 - mark1
       val elapsed2 = mark3 - mark2

       println("Measurement 1.${n + 1}: elapsed1=$elapsed1, elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
   }
   
   println(mark2 > mark1) // mark2가 mark1보다 늦게 캡처되었으므로 이는 참입니다.
   // true

}
```

마감일이 지났는지 또는 시간 초과가 발생했는지 확인하려면 [`hasPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-passed-now.html)
및 [`hasNotPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-not-passed-now.html)
확장 함수를 사용합니다.

```kotlin
import kotlin.time.*
import kotlin.time.Duration.Companion.seconds

fun main() {

   val timeSource = TimeSource.Monotonic
   val mark1 = timeSource.markNow()
   val fiveSeconds: Duration = 5.seconds
   val mark2 = mark1 + fiveSeconds

   // 아직 5초가 지나지 않았습니다.
   println(mark2.hasPassedNow())
   // false
  
   // 6초 동안 대기합니다.
   Thread.sleep(6000)
   println(mark2.hasPassedNow())
   // true

}
```

## 시간 소스

기본적으로 시간은 단조 시간 소스를 사용하여 측정됩니다. 단조 시간 소스는 앞으로만 이동하며 시간대와 같은 변동의 영향을 받지 않습니다. 단조 시간의 대안은 벽시계 시간이라고도 하는 경과된 실제 시간입니다.
경과된 실제 시간은 다른 시점을 기준으로 측정됩니다.

### 플랫폼별 기본 시간 소스

이 표는 각 플랫폼에 대한 단조 시간의 기본 소스를 설명합니다.

| Platform            | Source |
|---------------------|---|
| Kotlin/JVM          | `System.nanoTime()`|
| Kotlin/JS (Node.js) | `process.hrtime()`|
| Kotlin/JS (browser) | `window.performance.now()` or `Date.now()`|
| Kotlin/Native       | `std::chrono::high_resolution_clock` or `std::chrono::steady_clock`|

### 시간 소스 생성

다른 시간 소스를 사용하려는 경우가 있을 수 있습니다. 예를 들어 Android에서 `System.nanoTime()`은 장치가 활성 상태인 동안에만 시간을 계산합니다. 장치가 절전 모드로 들어가면 시간 추적을 중단합니다. 장치가 절전 모드에 있는 동안 시간을 추적하려면 [`SystemClock.elapsedRealtimeNanos()`](https://developer.android.com/reference/android/os/SystemClock#elapsedRealtimeNanos())를 사용하는 시간 소스를 만들 수 있습니다.

```kotlin
object RealtimeMonotonicTimeSource : AbstractLongTimeSource(DurationUnit.NANOSECONDS) {
    override fun read(): Long = SystemClock.elapsedRealtimeNanos()
}
```

그런 다음 시간 소스를 사용하여 시간 측정을 할 수 있습니다.

```kotlin
fun main() {
    val elapsed: Duration = RealtimeMonotonicTimeSource.measureTime {
        Thread.sleep(100)
    }
    println(elapsed) // 예: 103 ms
}
```

`kotlin.time` 패키지에 대한 자세한 내용은 [표준 라이브러리 API 참조](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/)를 참조하세요.