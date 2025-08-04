[//]: # (title: 時間の測定)

Kotlin標準ライブラリには、さまざまな単位で時間を計算し測定するためのツールが用意されています。
正確な時間測定は、以下のようなアクティビティにとって重要です。
  * スレッドやプロセスの管理
  * 統計情報の収集
  * タイムアウトの検出
  * デバッグ

デフォルトでは、時間は単調増加するタイムソース（monotonic time source）を使用して測定されますが、他のタイムソースも設定可能です。
詳細は「[タイムソースの作成](#create-time-source)」を参照してください。

## 期間の計算

時間の量を表現するために、標準ライブラリには[`Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/)クラスがあります。`Duration`は、[`DurationUnit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration-unit/) enumクラスの以下の単位で表現できます。
  * `NANOSECONDS`
  * `MICROSECONDS`
  * `MILLISECONDS`
  * `SECONDS`
  * `MINUTES`
  * `HOURS`
  * `DAYS`

`Duration`は、正、負、ゼロ、正の無限大、負の無限大のいずれかになります。

### 期間の作成

`Duration`を作成するには、`Int`、`Long`、`Double`型で利用可能な[拡張プロパティ](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/#companion-object-properties)である`nanoseconds`、`microseconds`、`milliseconds`、`seconds`、`minutes`、`hours`、`days`を使用します。

> 日（Days）は24時間の期間を指します。カレンダー上の日付ではありません。
>
{style="tip"}

例:

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

`Duration`オブジェクトを使って基本的な算術演算を行うこともできます。

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

### 文字列表現の取得

`Duration`の文字列表現を持つことは、それを印刷、シリアライズ、転送、または保存できるため、有用です。

文字列表現を取得するには、`.toString()`関数を使用します。デフォルトでは、時間は存在する各単位を使用して報告されます。例: `1h 0m 45.677s` または `-(6d 5h 5m 28.284s)`

出力を設定するには、`.toString()`関数で目的の`DurationUnit`と小数点以下の桁数を関数パラメータとして使用します。

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

[ISO-8601互換](https://en.wikipedia.org/wiki/ISO_8601)の文字列を取得するには、[`toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html)関数を使用します。

```kotlin
import kotlin.time.Duration.Companion.seconds

fun main() {
//sampleStart
    println(86420.seconds.toIsoString()) // PT24H0M20S
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-iso-string-representation"}

### 期間の変換

`Duration`を異なる`DurationUnit`に変換するには、以下のプロパティを使用します。
* `inWholeNanoseconds`
* `inWholeMicroseconds`
* `inWholeSeconds`
* `inWholeMinutes`
* `inWholeHours`
* `inWholeDays`

例:

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

あるいは、目的の`DurationUnit`を以下の拡張関数の関数パラメータとして使用することもできます。
* `.toInt()`
* `.toDouble()`
* `.toLong()`

例:

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

### 期間の比較

`Duration`オブジェクトが等しいかどうかを確認するには、等価演算子（`==`）を使用します。

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

`Duration`オブジェクトを比較するには、比較演算子（`<`、`>`）を使用します。

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

### 期間をコンポーネントに分解する

`Duration`をその時間コンポーネントに分解し、さらにアクションを実行するには、[`toComponents()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-components.html)関数のオーバーロードを使用します。目的のアクションを関数またはラムダ式として関数パラメータに追加します。

例:

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

この例では、ラムダ式は、未使用の`seconds`と`nanoseconds`パラメータに対してアンダースコア（`_`）を使用して、`hours`と`minutes`を関数パラメータとして持ちます。この式は、[文字列テンプレート](strings.md#string-templates)を使用して連結された文字列を返し、`hours`と`minutes`の目的の出力形式を取得します。

## 時間の測定

時間の経過を追跡するために、標準ライブラリは以下のことを簡単に行えるツールを提供します。
* 目的のタイムユニットでコードの実行にかかる時間を測定します。
* ある時点をマークします。
* 2つの時点を比較および減算します。
* 特定の時点からどれくらいの時間が経過したかを確認します。
* 現在の時間が特定の時点を過ぎたかどうかを確認します。

### コード実行時間の測定

コードブロックの実行にかかる時間を測定するには、[`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html)インライン関数を使用します。

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

コードブロックの実行にかかる時間を測定**し**、そのコードブロックの値を返すには、インライン関数[`measureTimedValue`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html)を使用します。

例:

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

デフォルトでは、どちらの関数も単調増加するタイムソースを使用します。

### 時点をマークする

特定の時点をマークするには、[`TimeSource`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/)インターフェースと[`markNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/mark-now.html)関数を使用して[`TimeMark`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/)を作成します。

```kotlin
import kotlin.time.*

fun main() {
   val timeSource = TimeSource.Monotonic
   val mark = timeSource.markNow()
}
```

### 時間の差を測定する

同じタイムソースからの`TimeMark`オブジェクト間の差を測定するには、減算演算子（`-`）を使用します。

同じタイムソースからの`TimeMark`オブジェクトを比較するには、比較演算子（`<`、`>`）を使用します。

例:

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

期限が過ぎたか、タイムアウトに達したかを確認するには、[`hasPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-passed-now.html)と[`hasNotPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-not-passed-now.html)拡張関数を使用します。

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

## タイムソース

デフォルトでは、時間は単調増加するタイムソースを使用して測定されます。単調増加するタイムソースは、常に前方へ進み、タイムゾーンのような変動の影響を受けません。単調増加する時間（monotonic time）の代替として、経過実時間（elapsed real time）があり、これはウォールクロック時間（wall-clock time）とも呼ばれます。経過実時間は、別の時点を基準として測定されます。

### プラットフォームごとのデフォルトタイムソース

この表は、各プラットフォームにおける単調増加する時間のデフォルトソースについて説明しています。

| プラットフォーム            | ソース |
|---------------------|---|
| Kotlin/JVM          | `System.nanoTime()`|
| Kotlin/JS (Node.js) | `process.hrtime()`|
| Kotlin/JS (browser) | `window.performance.now()` or `Date.now()`|
| Kotlin/Native       | `std::chrono::high_resolution_clock` or `std::chrono::steady_clock`|

### タイムソースの作成

異なるタイムソースを使用したい場合もあるでしょう。例えばAndroidでは、`System.nanoTime()`はデバイスがアクティブな間のみ時間をカウントします。デバイスがディープスリープに入ると、時間の追跡ができなくなります。デバイスがディープスリープ中でも時間を追跡し続けるには、[`SystemClock.elapsedRealtimeNanos()`](https://developer.android.com/reference/android/os/SystemClock#elapsedRealtimeNanos())を使用するタイムソースを作成できます。

```kotlin
object RealtimeMonotonicTimeSource : AbstractLongTimeSource(DurationUnit.NANOSECONDS) {
    override fun read(): Long = SystemClock.elapsedRealtimeNanos()
}
```

次に、そのタイムソースを使用して時間測定を行うことができます。

```kotlin
fun main() {
    val elapsed: Duration = RealtimeMonotonicTimeSource.measureTime {
        Thread.sleep(100)
    }
    println(elapsed) // e.g. 103 ms
}
```
{validate="false"}

`kotlin.time`パッケージの詳細については、[標準ライブラリAPIリファレンス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/)を参照してください。