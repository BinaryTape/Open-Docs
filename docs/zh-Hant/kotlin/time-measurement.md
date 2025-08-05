[//]: # (title: 時間測量)

Kotlin 標準函式庫提供您以不同單位計算和測量時間的工具。
精確的時間測量對於以下活動很重要：
  * 管理執行緒或處理程序
  * 收集統計資料
  * 偵測逾時
  * 除錯

依預設，時間是使用單調時間源 (monotonic time source) 進行測量，但也可以配置其他時間源。
有關更多資訊，請參閱 [建立時間源](#create-time-source)。

## 計算 Duration

為表示一段時間量，標準函式庫具有 [`Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 類別。一個 `Duration` 可以用來自 [`DurationUnit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration-unit/) 列舉類別的以下單位來表示：
  * `NANOSECONDS`
  * `MICROSECONDS`
  * `MILLISECONDS`
  * `SECONDS`
  * `MINUTES`
  * `HOURS`
  * `DAYS`

一個 `Duration` 可以是正數、負數、零、正無限大或負無限大。

### 建立 Duration

要建立一個 `Duration`，請使用適用於 `Int`、`Long` 和 `Double` 類型的[延伸屬性 (extension properties)](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/#companion-object-properties)：`nanoseconds`、`microseconds`、`milliseconds`、`seconds`、`minutes`、`hours` 和 `days`。

> 天數指的是 24 小時的時段。它們並非日曆天數。
>
{style="tip"}

例如：

```kotlin
import kotlin.time.*
import kotlin.time.Duration.Companion.nanoseconds
import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.Duration.Companion.seconds
import kotlin.time.Duration.Companion.minutes
import kotlin.time.Duration.Companion.days

fun main() {
//sampleStart
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
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-create-duration"}

您也可以對 `Duration` 物件執行基本算術運算：

```kotlin
import kotlin.time.*
import kotlin.time.Duration.Companion.seconds

fun main() {
//sampleStart
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
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-create-duration-arithmetic"}

### 取得字串表示形式

擁有 `Duration` 的字串表示形式可能很有用，以便您可以列印、序列化、傳輸或儲存它。

要取得字串表示形式，請使用 `.toString()` 函式。依預設，時間會使用每個存在的單位進行報告。例如：`1h 0m 45.677s` 或 `-(6d 5h 5m 28.284s)`

要配置輸出，請將您所需的 `DurationUnit` 和小數位數作為函式參數，與 `.toString()` 函式一起使用：

```kotlin
import kotlin.time.Duration
import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.DurationUnit

fun main() {
//sampleStart
    // Print in seconds with 2 decimal places
    println(5887.milliseconds.toString(DurationUnit.SECONDS, 2))
    // 5.89s
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-string-representation"}

要取得 [ISO-8601 相容](https://en.wikipedia.org/wiki/ISO_8601)的字串，請使用 [`toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html) 函式：

```kotlin
import kotlin.time.Duration.Companion.seconds

fun main() {
//sampleStart
    println(86420.seconds.toIsoString()) // PT24H0M20S
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-iso-string-representation"}

### 轉換 Duration

要將您的 `Duration` 轉換為不同的 `DurationUnit`，請使用以下屬性：
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
//sampleStart
    val thirtyMinutes: Duration = 30.minutes
    println(thirtyMinutes.inWholeSeconds)
    // 1800
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-convert-duration"}

或者，您可以將您所需的 `DurationUnit` 作為函式參數，用於以下延伸函式中：
* `.toInt()`
* `.toDouble()`
* `.toLong()`

例如：

```kotlin
import kotlin.time.Duration.Companion.seconds
import kotlin.time.DurationUnit

fun main() {
//sampleStart
    println(270.seconds.toDouble(DurationUnit.MINUTES))
    // 4.5
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-convert-duration-extension"}

### 比較 Duration

要檢查 `Duration` 物件是否相等，請使用相等運算子 (`==`)：

```kotlin
import kotlin.time.Duration
import kotlin.time.Duration.Companion.hours
import kotlin.time.Duration.Companion.minutes

fun main() {
//sampleStart
    val thirtyMinutes: Duration = 30.minutes
    val halfHour: Duration = 0.5.hours
    println(thirtyMinutes == halfHour)
    // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-equality-duration"}

要比較 `Duration` 物件，請使用比較運算子 (`<`、`>`)：

```kotlin
import kotlin.time.Duration.Companion.microseconds
import kotlin.time.Duration.Companion.nanoseconds

fun main() {
//sampleStart
    println(3000.microseconds < 25000.nanoseconds)
    // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-compare-duration"}

### 將 Duration 分解為組成部分

要將 `Duration` 分解為其時間組成部分並執行進一步操作，請使用 [`toComponents()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-components.html) 函式的多載版本。將您所需的動作作為函式或 lambda 運算式，作為函式參數新增。

例如：

```kotlin
import kotlin.time.Duration
import kotlin.time.Duration.Companion.minutes

fun main() {
//sampleStart
    val thirtyMinutes: Duration = 30.minutes
    println(thirtyMinutes.toComponents { hours, minutes, _, _ -> "${hours}h:${minutes}m" })
    // 0h:30m
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-duration-components"}

在此範例中，lambda 運算式將 `hours` 和 `minutes` 作為函式參數，並使用底線 (`_`) 表示未使用的 `seconds` 和 `nanoseconds` 參數。該運算式使用[字串範本 (string templates)](strings.md#string-templates) 返回一個串聯字串，以取得 `hours` 和 `minutes` 的所需輸出格式。

## 測量時間

為追蹤時間的流逝，標準函式庫提供了工具，讓您可以輕鬆地：
* 以您所需的時間單位測量執行某些程式碼所花費的時間。
* 標記時間中的一個時刻。
* 比較和減去時間中的兩個時刻。
* 檢查自時間中特定時刻以來經過了多少時間。
* 檢查當前時間是否已超過時間中特定時刻。

### 測量程式碼執行時間

要測量執行一個程式碼區塊所花費的時間，請使用 [`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html) 內聯函式：

```kotlin
import kotlin.time.measureTime

fun main() {
//sampleStart
    val timeTaken = measureTime {
        Thread.sleep(100)
    }
    println(timeTaken) // e.g. 103 ms
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-measure-time"}

要測量執行程式碼區塊所花費的時間**並**返回該程式碼區塊的值，請使用內聯函式 [`measureTimedValue`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html)。

例如：

```kotlin
import kotlin.time.measureTimedValue

fun main() {
//sampleStart
    val (value, timeTaken) = measureTimedValue {
        Thread.sleep(100)
        42
    }
    println(value)     // 42
    println(timeTaken) // e.g. 103 ms
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-measure-timed-value"}

依預設，這兩個函式都使用單調時間源。

### 標記時間中的時刻

要標記時間中的特定時刻，請使用 [`TimeSource`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/) 介面和 [`markNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/mark-now.html) 函式來建立一個 [`TimeMark`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/)：

```kotlin
import kotlin.time.*

fun main() {
   val timeSource = TimeSource.Monotonic
   val mark = timeSource.markNow()
}
```

### 測量時間差異

要測量來自相同時間源的 `TimeMark` 物件之間的差異，請使用減法運算子 (`-`)。

要比較來自相同時間源的 `TimeMark` 物件，請使用比較運算子 (`<`、`>`)。

例如：

```kotlin
import kotlin.time.*

fun main() {
//sampleStart
   val timeSource = TimeSource.Monotonic
   val mark1 = timeSource.markNow()
   Thread.sleep(500) // Sleep 0.5 seconds.
   val mark2 = timeSource.markNow()

   repeat(4) { n ->
       val mark3 = timeSource.markNow()
       val elapsed1 = mark3 - mark1
       val elapsed2 = mark3 - mark2

       println("Measurement 1.${n + 1}: elapsed1=$elapsed1, elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
   }
   
   println(mark2 > mark1) // 這是 true，因為 mark2 是在 mark1 之後捕獲的。
   // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-measure-difference"}

要檢查截止日期是否已過或是否已達到逾時，請使用 [`hasPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-passed-now.html) 和 [`hasNotPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-not-passed-now.html) 延伸函式：

```kotlin
import kotlin.time.*
import kotlin.time.Duration.Companion.seconds

fun main() {
//sampleStart
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

//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-deadline=passed"}

## 時間源

依預設，時間是使用單調時間源進行測量。單調時間源只會向前推進，並且不受時區等變化的影響。單調時間的替代方案是經過的即時時間 (elapsed real time)，也稱為掛鐘時間 (wall-clock time)。經過的即時時間是相對於時間中的另一個點進行測量。

### 各平台預設的時間源

此表格解釋了每個平台單調時間的預設來源：

| Platform            | Source |
|---------------------|---|
| Kotlin/JVM          | `System.nanoTime()`|
| Kotlin/JS (Node.js) | `process.hrtime()`|
| Kotlin/JS (browser) | `window.performance.now()` or `Date.now()`|
| Kotlin/Native       | `std::chrono::high_resolution_clock` or `std::chrono::steady_clock`|

### 建立時間源

在某些情況下，您可能希望使用不同的時間源。例如，在 Android 中，`System.nanoTime()` 只在裝置啟用時計算時間。當裝置進入深度睡眠時，它會失去時間追蹤。為在裝置深度睡眠時保持時間追蹤，您可以建立一個使用 [`SystemClock.elapsedRealtimeNanos()`](https://developer.android.com/reference/android/os/SystemClock#elapsedRealtimeNanos()) 的時間源：

```kotlin
object RealtimeMonotonicTimeSource : AbstractLongTimeSource(DurationUnit.NANOSECONDS) {
    override fun read(): Long = SystemClock.elapsedRealtimeNanos()
}
```

然後您可以使用您的時間源來進行時間測量：

```kotlin
fun main() {
    val elapsed: Duration = RealtimeMonotonicTimeSource.measureTime {
        Thread.sleep(100)
    }
    println(elapsed) // e.g. 103 ms
}
```
{validate="false"}

有關 `kotlin.time` 套件的更多資訊，請參閱我們的[標準函式庫 API 參考](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/)。