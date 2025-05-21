---
title: 时间测量
---
Kotlin 标准库提供了以不同单位计算和测量时间的工具。
精确的时间测量对于以下活动非常重要：
  * 管理线程或进程
  * 收集统计信息
  * 检测超时
  * 调试

默认情况下，时间是使用单调时间源（monotonic time source）进行测量的，但可以配置其他时间源。
有关更多信息，请参阅[创建时间源](#create-time-source)。

## 计算时长（duration）

为了表示一段时间，标准库提供了 [`Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) 类。 `Duration` 可以用 [`DurationUnit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration-unit/) 枚举类中的以下单位表示：
  * `NANOSECONDS`（纳秒）
  * `MICROSECONDS`（微秒）
  * `MILLISECONDS`（毫秒）
  * `SECONDS`（秒）
  * `MINUTES`（分钟）
  * `HOURS`（小时）
  * `DAYS`（天）

`Duration` 可以是正数、负数、零、正无穷大或负无穷大。

### 创建时长（duration）

要创建一个 `Duration`，请使用 `Int`、`Long` 和 `Double` 类型的[扩展属性](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/#companion-object-properties)：`nanoseconds`、`microseconds`、`milliseconds`、`seconds`、`minutes`、`hours` 和 `days`。

> 天数指的是 24 小时的时间段。它们不是日历天数。
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

你还可以使用 `Duration` 对象执行基本算术运算：

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

### 获取字符串表示形式

拥有 `Duration` 的字符串表示形式可能很有用，这样你就可以打印、序列化、传输或存储它。

要获取字符串表示形式，请使用 `.toString()` 函数。 默认情况下，时间是使用存在的每个单位报告的。 例如：`1h 0m 45.677s` 或 `-(6d 5h 5m 28.284s)`

要配置输出，请使用带有所需 `DurationUnit` 和小数位数的 `.toString()` 函数作为函数参数：

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

要获得 [ISO-8601 兼容](https://en.wikipedia.org/wiki/ISO_8601) 的字符串，请使用 [`toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html) 函数：

```kotlin
import kotlin.time.Duration.Companion.seconds

fun main() {

    println(86420.seconds.toIsoString()) // PT24H0M20S

}
```

### 转换时长（duration）

要将你的 `Duration` 转换为不同的 `DurationUnit`，请使用以下属性：
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

或者，你可以在以下扩展函数中使用所需的 `DurationUnit` 作为函数参数：
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

### 比较时长（duration）

要检查 `Duration` 对象是否相等，请使用相等运算符 (`==`)：

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

要比较 `Duration` 对象，请使用比较运算符 (`<`、`>`)：

```kotlin
import kotlin.time.Duration.Companion.microseconds
import kotlin.time.Duration.Companion.nanoseconds

fun main() {

    println(3000.microseconds < 25000.nanoseconds)
    // false

}
```

### 将时长（duration）分解为组件

要将 `Duration` 分解为其时间组件并执行进一步的操作，请使用 [`toComponents()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-components.html) 函数的重载。 将你所需的操作添加为函数或 lambda 表达式作为函数参数。

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

在此示例中，lambda 表达式具有 `hours` 和 `minutes` 作为函数参数，未使用下划线 (`_`) 作为未使用的 `seconds` 和 `nanoseconds` 参数。 该表达式使用[字符串模板](strings#string-templates)返回一个连接的字符串，以获得所需的 `hours` 和 `minutes` 输出格式。

## 测量时间

为了跟踪时间的流逝，标准库提供了工具，以便你可以轻松地：
* 测量执行某些代码所花费的时间，并使用你所需的时间单位。
* 标记时间上的一个时刻。
* 比较和减去时间上的两个时刻。
* 检查自特定时间点以来经过了多少时间。
* 检查当前时间是否已经过了某个特定的时间点。

### 测量代码执行时间

要测量执行代码块所花费的时间，请使用 [`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html) 内联函数：

```kotlin
import kotlin.time.measureTime

fun main() {

    val timeTaken = measureTime {
        Thread.sleep(100)
    }
    println(timeTaken) // e.g. 103 ms

}
```

要测量执行代码块所花费的时间 **并** 返回代码块的值，请使用内联函数 [`measureTimedValue`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html)。

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

默认情况下，这两个函数都使用单调时间源。

### 标记时间上的时刻

要标记时间上的特定时刻，请使用 [`TimeSource`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/) 接口和 [`markNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/mark-now.html) 函数来创建一个 [`TimeMark`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/)：

```kotlin
import kotlin.time.*

fun main() {
   val timeSource = TimeSource.Monotonic
   val mark = timeSource.markNow()
}
```

### 测量时间差

要测量来自同一时间源的 `TimeMark` 对象之间的时间差，请使用减法运算符 (`-`)。

要比较来自同一时间源的 `TimeMark` 对象，请使用比较运算符 (`<`、`>`)。

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

要检查是否已过截止日期或已达到超时时间，请使用 [`hasPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-passed-now.html) 和 [`hasNotPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-not-passed-now.html) 扩展函数：

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

## 时间源

默认情况下，时间是使用单调时间源测量的。单调时间源仅向前移动，不受时区等变化的影响。单调时间的替代方法是经过的实际时间（elapsed real time），也称为挂钟时间（wall-clock time）。经过的实际时间是相对于另一个时间点测量的。

### 每个平台的默认时间源

下表解释了每个平台的单调时间的默认源：

| 平台            | 源 |
|---------------------|---|
| Kotlin/JVM          | `System.nanoTime()`|
| Kotlin/JS (Node.js) | `process.hrtime()`|
| Kotlin/JS (browser) | `window.performance.now()` 或 `Date.now()`|
| Kotlin/Native       | `std::chrono::high_resolution_clock` 或 `std::chrono::steady_clock`|

### 创建时间源

在某些情况下，你可能想要使用不同的时间源。例如，在 Android 中，`System.nanoTime()` 仅在设备处于活动状态时才计算时间。当设备进入深度睡眠时，它会失去对时间的跟踪。为了在设备处于深度睡眠状态时跟踪时间，你可以创建一个使用 [`SystemClock.elapsedRealtimeNanos()`](https://developer.android.com/reference/android/os/SystemClock#elapsedRealtimeNanos()) 的时间源：

```kotlin
object RealtimeMonotonicTimeSource : AbstractLongTimeSource(DurationUnit.NANOSECONDS) {
    override fun read(): Long = SystemClock.elapsedRealtimeNanos()
}
```

然后，你可以使用你的时间源来进行时间测量：

```kotlin
fun main() {
    val elapsed: Duration = RealtimeMonotonicTimeSource.measureTime {
        Thread.sleep(100)
    }
    println(elapsed) // e.g. 103 ms
}
```

有关 `kotlin.time` 包的更多信息，请参阅我们的[标准库 API 参考](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/)。