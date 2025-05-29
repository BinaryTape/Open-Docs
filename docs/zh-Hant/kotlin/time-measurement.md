[//]: # (title: 時間測量)

Kotlin 標準函式庫提供您用於計算和測量不同時間單位的功能。
精確的時間測量對於以下活動很重要：
  * 管理執行緒或處理程序
  * 收集統計資料
  * 偵測逾時
  * 偵錯

依預設，時間是使用單調時間來源測量的，但也可以設定其他時間來源。
有關更多資訊，請參閱[建立時間來源](#create-time-source)。

## 計算時長

為了表示一段時間，標準函式庫提供了 [`Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 類別。`Duration` 可以用來自 [`DurationUnit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration-unit/) 列舉類別的以下單位來表示：
  * `NANOSECONDS` (奈秒)
  * `MICROSECONDS` (微秒)
  * `MILLISECONDS` (毫秒)
  * `SECONDS` (秒)
  * `MINUTES` (分)
  * `HOURS` (小時)
  * `DAYS` (天)

`Duration` 可以是正數、負數、零、正無限大或負無限大。

### 建立時長

若要建立 `Duration`，請使用適用於 `Int`、`Long` 和 `Double` 類型的[擴充屬性](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/#companion-object-properties)：`nanoseconds`、`microseconds`、`milliseconds`、`seconds`、`minutes`、`hours` 和 `days`。

> 天數指的是 24 小時的期間。它們不是日曆上的日期。
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

您還可以對 `Duration` 物件執行基本算術運算：

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

### 取得字串表示

擁有 `Duration` 的字串表示形式會很有用，這樣您就可以列印、序列化、傳輸或儲存它。

若要取得字串表示，請使用 `.toString()` 函數。依預設，時間會使用每個存在的單位來報告。例如：`1h 0m 45.677s` 或 `-(6d 5h 5m 28.284s)`

若要配置輸出，請使用 `.toString()` 函數，並將所需的 `DurationUnit` 和小數位數作為函數參數：

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

若要取得 [ISO-8601 相容](https://en.wikipedia.org/wiki/ISO_8601)的字串，請使用 [`toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html) 函數：

```kotlin
import kotlin.time.Duration.Companion.seconds

fun main() {
//sampleStart
    println(86420.seconds.toIsoString()) // PT24H0M20S
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-iso-string-representation"}

### 轉換時長

若要將 `Duration` 轉換為不同的 `DurationUnit`，請使用以下屬性：
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

或者，您可以將所需的 `DurationUnit` 作為函數參數，用於以下擴充函數：
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

### 比較時長

若要檢查 `Duration` 物件是否相等，請使用相等運算子 (`==`)：

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

若要比較 `Duration` 物件，請使用比較運算子 (`<`, `>`):

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

### 將時長分解為元件

若要將 `Duration` 分解為其時間元件並執行進一步操作，請使用 [`toComponents()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-components.html) 函數的重載版本。將您想要的操作作為函數或 Lambda 表達式添加到函數參數中。

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

在此範例中，Lambda 表達式將 `hours` 和 `minutes` 作為函數參數，並使用底線 (`_`) 表示未使用的 `seconds` 和 `nanoseconds` 參數。該表達式使用[字串模板](strings.md#string-templates)返回一個串聯的字串，以獲取 `hours` 和 `minutes` 的所需輸出格式。

## 測量時間

為了追蹤時間的流逝，標準函式庫提供了工具，讓您可以輕鬆地：
* 使用所需的時間單位測量執行某些程式碼所需的時間。
* 標記時間中的一個時刻。
* 比較和減去時間中的兩個時刻。
* 檢查自特定時刻以來過了多少時間。
* 檢查當前時間是否已超過特定時刻。

### 測量程式碼執行時間

若要測量執行程式碼區塊所需的時間，請使用 [`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html) 內聯函數：

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

若要測量執行程式碼區塊所需的時間**並**返回該程式碼區塊的值，請使用內聯函數 [`measureTimedValue`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html)。

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

依預設，這兩個函數都使用單調時間來源。

### 標記時間中的時刻

若要標記時間中的特定時刻，請使用 [`TimeSource`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/) 介面和 [`markNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/mark-now.html) 函數來建立一個 [`TimeMark`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/)：

```kotlin
import kotlin.time.*

fun main() {
   val timeSource = TimeSource.Monotonic
   val mark = timeSource.markNow()
}
```

### 測量時間差異

若要測量來自同一時間來源的 `TimeMark` 物件之間的差異，請使用減法運算子 (`-`)。

若要比較來自同一時間來源的 `TimeMark` 物件，請使用比較運算子 (`<`、`>`)。

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

   println(mark2 > mark1) // This is true, as mark2 was captured later than mark1.
   // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-measure-difference"}

若要檢查截止日期是否已過或是否已達到逾時，請使用 [`hasPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-passed-now.html) 和 [`hasNotPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-not-passed-now.html) 擴充函數：

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

## 時間來源

依預設，時間是使用單調時間來源測量的。單調時間來源只會向前移動，不受時區等變化影響。單調時間的替代方案是實際經過時間 (elapsed real time)，也稱為牆上時鐘時間 (wall-clock time)。實際經過時間是相對於時間中的另一個點來測量的。

### 每個平台的預設時間來源

下表說明每個平台的預設單調時間來源：

| 平台                | 來源 |
|---------------------|---|
| Kotlin/JVM          | `System.nanoTime()`|
| Kotlin/JS (Node.js) | `process.hrtime()`|
| Kotlin/JS (browser) | `window.performance.now()` or `Date.now()`|
| Kotlin/Native       | `std::chrono::high_resolution_clock` or `std::chrono::steady_clock`|

### 建立時間來源

在某些情況下，您可能想要使用不同的時間來源。例如，在 Android 中，`System.nanoTime()` 只計算裝置處於活動狀態時的時間。當裝置進入深度睡眠時，它會失去對時間的追蹤。為了在裝置處於深度睡眠時仍能追蹤時間，您可以建立一個使用 [`SystemClock.elapsedRealtimeNanos()`](https://developer.android.com/reference/android/os/SystemClock#elapsedRealtimeNanos/) 的時間來源：

```kotlin
object RealtimeMonotonicTimeSource : AbstractLongTimeSource(DurationUnit.NANOSECONDS) {
    override fun read(): Long = SystemClock.elapsedRealtimeNanos()
}
```

然後您可以使用您的時間來源進行時間測量：

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