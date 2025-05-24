---
title: 時間測量
---
Kotlin 標準函式庫提供您以不同單位計算和測量時間的工具。
精確的時間測量對於以下活動非常重要：
  * 管理執行緒或程序
  * 收集統計資料
  * 偵測逾時
  * 除錯

預設情況下，時間是使用單調時間源（monotonic time source）進行測量的，但可以配置其他時間源。
如需更多資訊，請參閱[建立時間源](#create-time-source)。

## 計算持續時間 (Duration)

為了表示一段時間，標準函式庫提供了 [`Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 類別。`Duration` 可以用 [`DurationUnit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration-unit/) 列舉類別中的下列單位表示：
  * `NANOSECONDS`
  * `MICROSECONDS`
  * `MILLISECONDS`
  * `SECONDS`
  * `MINUTES`
  * `HOURS`
  * `DAYS`

`Duration` 可以是正數、負數、零、正無窮大或負無窮大。

### 建立持續時間 (Duration)

若要建立 `Duration`，請使用 `Int`、`Long` 和 `Double` 類型可用的[擴充屬性](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/#companion-object-properties)：`nanoseconds`、`microseconds`、`milliseconds`、`seconds`、`minutes`、`hours` 和 `days`。

> 天數指的是 24 小時的週期。它們不是日曆天數。
>

例如：

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

您也可以使用 `Duration` 物件執行基本算術：

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

### 取得字串表示形式

擁有 `Duration` 的字串表示形式會很有用，以便您可以列印、序列化、傳輸或儲存它。

若要取得字串表示形式，請使用 `.toString()` 函式。預設情況下，時間是使用存在的每個單位來報告的。例如：`1h 0m 45.677s` 或 `-(6d 5h 5m 28.284s)`

若要設定輸出，請使用 `.toString()` 函式，並將您想要的 `DurationUnit` 和小數位數作為函式參數：

```kotlin
import kotlin.time.Duration
import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.DurationUnit

fun main() {

    // Print in seconds with 2 decimal places
    println(5887.milliseconds.toString(DurationUnit.SECONDS, 2))
    // 5.89s

}
```

若要取得 [ISO-8601 相容](https://en.wikipedia.org/wiki/ISO_8601)的字串，請使用 [`toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html) 函式：

```kotlin
import kotlin.time.Duration.Companion.seconds

fun main() {

    println(86420.seconds.toIsoString()) // PT24H0M20S

}
```

### 轉換持續時間 (Duration)

若要將您的 `Duration` 轉換為不同的 `DurationUnit`，請使用下列屬性：
* `inWholeNanoseconds`
* `inWholeMicroseconds`
* `inWholeSeconds`
* `inWholeMinutes`
* `inWholeHours`
* `inWholeDays`

例如：

```kotlin
import kotlin.time.Duration
import kotlin.time.Duration.Companion.minutes

fun main() {

    val thirtyMinutes: Duration = 30.minutes
    println(thirtyMinutes.inWholeSeconds)
    // 1800

}
```

或者，您可以使用您想要的 `DurationUnit` 作為下列擴充函式中的函式參數：
* `.toInt()`
* `.toDouble()`
* `.toLong()`

例如：

```kotlin
import kotlin.time.Duration.Companion.seconds
import kotlin.time.DurationUnit

fun main() {

    println(270.seconds.toDouble(DurationUnit.MINUTES))
    // 4.5

}
```

### 比較持續時間 (Duration)

若要檢查 `Duration` 物件是否相等，請使用相等運算子 (`==`)：

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

若要比較 `Duration` 物件，請使用比較運算子 (`<`、`>`)：

```kotlin
import kotlin.time.Duration.Companion.microseconds
import kotlin.time.Duration.Companion.nanoseconds

fun main() {

    println(3000.microseconds < 25000.nanoseconds)
    // false

}
```

### 將持續時間 (Duration) 分解為元件

若要將 `Duration` 分解為其時間元件並執行進一步的動作，請使用 [`toComponents()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-components.html) 函式的重載。將您想要的動作新增為函式或 Lambda 運算式作為函式參數。

例如：

```kotlin
import kotlin.time.Duration
import kotlin.time.Duration.Companion.minutes

fun main() {

    val thirtyMinutes: Duration = 30.minutes
    println(thirtyMinutes.toComponents { hours, minutes, _, _ `->` "${hours}h:${minutes}m" })
    // 0h:30m

}
```

在此範例中，Lambda 運算式具有 `hours` 和 `minutes` 作為函式參數，未使用底線 (`_`) 作為未使用的 `seconds` 和 `nanoseconds` 參數。該運算式會使用[字串樣板](strings#string-templates)傳回串連的字串，以取得所需的 `hours` 和 `minutes` 輸出格式。

## 測量時間

若要追蹤時間的流逝，標準函式庫提供了工具，讓您可以輕鬆地：
* 測量執行某些程式碼所花費的時間，並使用您想要的時間單位。
* 標記時間點。
* 比較和減去兩個時間點。
* 檢查自特定時間點以來經過了多少時間。
* 檢查目前時間是否已超過特定時間點。

### 測量程式碼執行時間

若要測量執行程式碼區塊所花費的時間，請使用 [`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html) 內聯函式：

```kotlin
import kotlin.time.measureTime

fun main() {

    val timeTaken = measureTime {
        Thread.sleep(100)
    }
    println(timeTaken) // e.g. 103 ms

}
```

若要測量執行程式碼區塊所花費的時間 **並** 傳回程式碼區塊的值，請使用內聯函式 [`measureTimedValue`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html)。

例如：

```kotlin
import kotlin.time.measureTimedValue

fun main() {

    val (value, timeTaken) = measureTimedValue {
        Thread.sleep(100)
        42
    }
    println(value)     // 42
    println(timeTaken) // e.g. 103 ms

}
```

預設情況下，這兩個函式都使用單調時間源（monotonic time source）。

### 標記時間點

若要標記特定時間點，請使用 [`TimeSource`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/) 介面和 [`markNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/mark-now.html) 函式建立 [`TimeMark`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/)：

```kotlin
import kotlin.time.*

fun main() {
   val timeSource = TimeSource.Monotonic
   val mark = timeSource.markNow()
}
```

### 測量時間差異

若要測量來自相同時間源的 `TimeMark` 物件之間的時間差異，請使用減法運算子 (`-`)。

若要比較來自相同時間源的 `TimeMark` 物件，請使用比較運算子 (`<`、`>`)。

例如：

```kotlin
import kotlin.time.*

fun main() {

   val timeSource = TimeSource.Monotonic
   val mark1 = timeSource.markNow()
   Thread.sleep(500) // Sleep 0.5 seconds.
   val mark2 = timeSource.markNow()

   repeat(4) { n `->`
       val mark3 = timeSource.markNow()
       val elapsed1 = mark3 - mark1
       val elapsed2 = mark3 - mark2

       println("Measurement 1.${n + 1}: elapsed1=$elapsed1, elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
   }
   
   println(mark2 > mark1) // This is true, as mark2 was captured later than mark1.
   // true

}
```

若要檢查是否已過期或已達到逾時，請使用 [`hasPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-passed-now.html) 和 [`hasNotPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-not-passed-now.html) 擴充函式：

```kotlin
import kotlin.time.*
import kotlin.time.Duration.Companion.seconds

fun main() {

   val timeSource = TimeSource.Monotonic
   val mark1 = timeSource.markNow()
   val fiveSeconds: Duration = 5.seconds
   val mark2 = mark1 + fiveSeconds

   // It hasn't been 5 seconds yet
   println(mark2.hasPassedNow())
   // false
  
   // Wait six seconds
   Thread.sleep(6000)
   println(mark2.hasPassedNow())
   // true

}
```

## 時間源 (Time sources)

預設情況下，時間是使用單調時間源 (monotonic time source) 進行測量的。單調時間源只會向前移動，不受時區等變化的影響。單調時間的替代方案是經過的實際時間，也稱為掛鐘時間 (wall-clock time)。經過的實際時間是相對於另一個時間點來測量的。

### 每個平台的預設時間源

下表說明了每個平台的預設單調時間源：

| 平台            | 來源 |
|---------------------|---|
| Kotlin/JVM          | `System.nanoTime()`|
| Kotlin/JS (Node.js) | `process.hrtime()`|
| Kotlin/JS (browser) | `window.performance.now()` 或 `Date.now()`|
| Kotlin/Native       | `std::chrono::high_resolution_clock` 或 `std::chrono::steady_clock`|

### 建立時間源

在某些情況下，您可能想要使用不同的時間源。例如，在 Android 中，`System.nanoTime()` 僅在裝置處於活動狀態時才計算時間。當裝置進入深度睡眠時，它會失去時間追蹤。若要在裝置處於深度睡眠狀態時追蹤時間，您可以建立一個時間源，該時間源使用 [`SystemClock.elapsedRealtimeNanos()`](https://developer.android.com/reference/android/os/SystemClock#elapsedRealtimeNanos())：

```kotlin
object RealtimeMonotonicTimeSource : AbstractLongTimeSource(DurationUnit.NANOSECONDS) {
    override fun read(): Long = SystemClock.elapsedRealtimeNanos()
}
```

然後，您可以使用您的時間源進行時間測量：

```kotlin
fun main() {
    val elapsed: Duration = RealtimeMonotonicTimeSource.measureTime {
        Thread.sleep(100)
    }
    println(elapsed) // e.g. 103 ms
}
```

如需有關 `kotlin.time` 套件的更多資訊，請參閱我們的[標準函式庫 API 參考](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/)。