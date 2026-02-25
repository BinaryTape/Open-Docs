[//]: # (title: 時間の計測)

Kotlin標準ライブラリには、さまざまな単位で時間を計算および計測するためのツールが用意されています。
正確な時間計測は、次のようなアクティビティにおいて重要です：
  * スレッドやプロセスの管理
  * 統計の収集
  * タイムアウトの検出
  * デバッグ

デフォルトでは、時間はモノトニック（単調増加）時間ソースを使用して計測されますが、他の時間ソースを設定することも可能です。
詳細については、[時間ソースの作成](#create-time-source)を参照してください。

## 期間の計算

時間の量を表すために、標準ライブラリには [`Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/) クラスがあります。`Duration` は、[`DurationUnit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration-unit/) enumクラスの以下の単位で表現できます：
  * `NANOSECONDS`（ナノ秒）
  * `MICROSECONDS`（マイクロ秒）
  * `MILLISECONDS`（ミリ秒）
  * `SECONDS`（秒）
  * `MINUTES`（分）
  * `HOURS`（時間）
  * `DAYS`（日）

`Duration` は、正、負、ゼロ、正の無限大、または負の無限大の値をとることができます。

### 期間の作成

`Duration` を作成するには、`Int`、`Long`、および `Double` 型で利用可能な[拡張プロパティ](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/#companion-object-properties)である `nanoseconds`、`microseconds`、`milliseconds`、`seconds`、`minutes`、`hours`、`days` を使用します。

> 「日（Days）」は24時間の期間を指します。カレンダー上の日付ではありません。
>
{style="tip"}

例：

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

また、`Duration` オブジェクトに対して基本的な算術演算を行うこともできます：

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

`Duration` を出力、シリアル化、転送、または保存するために、文字列表現を取得できると便利です。

文字列表現を取得するには、`.toString()` 関数を使用します。デフォルトでは、存在する各単位を使用して時間が報告されます。例：`1h 0m 45.677s` や `-(6d 5h 5m 28.284s)`

出力を構成するには、目的の `DurationUnit` と小数点以下の桁数を関数のパラメータとして指定して `.toString()` 関数を使用します：

```kotlin
import kotlin.time.Duration
import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.DurationUnit

fun main() {
//sampleStart
    // 小数点以下2桁の秒単位で出力
    println(5887.milliseconds.toString(DurationUnit.SECONDS, 2))
    // 5.89s
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-string-representation"}

[ISO-8601互換](https://en.wikipedia.org/wiki/ISO_8601)の文字列を取得するには、[`toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html) 関数を使用します：

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

`Duration` を別の `DurationUnit` に変換するには、以下のプロパティを使用します：
* `inWholeNanoseconds`
* `inWholeMicroseconds`
* `inWholeSeconds`
* `inWholeMinutes`
* `inWholeHours`
* `inWholeDays`

例：

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

あるいは、以下の拡張関数のパラメータに目的の `DurationUnit` を指定することもできます：
* `.toInt()`
* `.toDouble()`
* `.toLong()`

例：

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

`Duration` オブジェクトが等しいかどうかを確認するには、等価演算子（`==`）を使用します：

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

`Duration` オブジェクトを比較するには、比較演算子（`<`、`>`）を使用します：

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

`Duration` を時間の構成要素に分解してさらにアクションを実行するには、[`toComponents()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-components.html) 関数のオーバーロードを使用します。目的のアクションを関数またはラムダ式として関数のパラメータに追加します。

例：

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

この例では、ラムダ式に `hours` と `minutes` を関数パラメータとして持ち、使用しない `seconds` と `nanoseconds` パラメータにはアンダースコア（`_`）を使用しています。この式は、[文字列テンプレート](strings.md#string-templates)を使用して `hours` と `minutes` の目的の出力形式を取得し、連結された文字列を返します。

## 時間の計測

時間の経過を追跡するために、標準ライブラリは以下のことを簡単に行えるツールを提供しています：
* 目的の時間単位でコードの実行時間を計測する。
* 時間の特定の瞬間をマークする。
* 2つの瞬間を比較および減算する。
* 特定の瞬間からどれくらい時間が経過したかを確認する。
* 現在時刻が特定の瞬間を過ぎたかどうかを確認する。

### コードの実行時間の計測

コードブロックの実行にかかった時間を計測するには、[`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html) インライン関数を使用します：

```kotlin
import kotlin.time.measureTime

fun main() {
//sampleStart
    val timeTaken = measureTime {
        Thread.sleep(100)
    }
    println(timeTaken) // 例：103 ms
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-measure-time"}

コードブロックの実行にかかった時間を計測**し**、そのコードブロックの値を返すには、インライン関数 [`measureTimedValue`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html) を使用します。

例：

```kotlin
import kotlin.time.measureTimedValue

fun main() {
//sampleStart
    val (value, timeTaken) = measureTimedValue {
        Thread.sleep(100)
        42
    }
    println(value)     // 42
    println(timeTaken) // 例：103 ms
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-measure-timed-value"}

デフォルトでは、両方の関数がモノトニック時間ソースを使用します。

### 時間の特定の瞬間をマークする

時間の特定の瞬間をマークするには、[`TimeSource`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/) インターフェースと [`markNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/mark-now.html) 関数を使用して [`TimeMark`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/) を作成します：

```kotlin
import kotlin.time.*

fun main() {
   val timeSource = TimeSource.Monotonic
   val mark = timeSource.markNow()
}
```

### 時間の差を計測する

同じ時間ソースからの `TimeMark` オブジェクト間の差を計測するには、減算演算子（`-`）を使用します。

同じ時間ソースからの `TimeMark` オブジェクトを比較するには、比較演算子（`<`、`>`）を使用します。

例：

```kotlin
import kotlin.time.*

fun main() {
//sampleStart
   val timeSource = TimeSource.Monotonic
   val mark1 = timeSource.markNow()
   Thread.sleep(500) // 0.5秒スリープ
   val mark2 = timeSource.markNow()

   repeat(4) { n ->
       val mark3 = timeSource.markNow()
       val elapsed1 = mark3 - mark1
       val elapsed2 = mark3 - mark2

       println("計測 1.${n + 1}: elapsed1=$elapsed1, elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
   }
   
   println(mark2 > mark1) // mark2はmark1よりも後にキャプチャされたため、これはtrueになります。
   // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-measure-difference"}

期限が過ぎたか、またはタイムアウトに達したかを確認するには、[`hasPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-passed-now.html) および [`hasNotPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-not-passed-now.html) 拡張関数を使用します：

```kotlin
import kotlin.time.*
import kotlin.time.Duration.Companion.seconds

fun main() {
//sampleStart
   val timeSource = TimeSource.Monotonic
   val mark1 = timeSource.markNow()
   val fiveSeconds: Duration = 5.seconds
   val mark2 = mark1 + fiveSeconds

   // まだ5秒経過していません
   println(mark2.hasPassedNow())
   // false
  
   // 6秒待機
   Thread.sleep(6000)
   println(mark2.hasPassedNow())
   // true

//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-time-deadline=passed"}

## 時間ソース

デフォルトでは、時間はモノトニック時間ソースを使用して計測されます。モノトニック時間ソースは前進するのみで、タイムゾーンなどの変化による影響を受けません。モノトニック時間の代替となるのが経過実時間であり、これは「ウォールクロック時刻（実時刻）」としても知られています。経過実時間は、別の時点からの相対的な時間として計測されます。

### プラットフォームごとのデフォルトの時間ソース

以下の表は、各プラットフォームにおけるモノトニック時間のデフォルトソースを説明したものです：

| プラットフォーム            | ソース |
|---------------------|---|
| Kotlin/JVM          | `System.nanoTime()`|
| Kotlin/JS (Node.js) | `process.hrtime()`|
| Kotlin/JS (ブラウザ) | `window.performance.now()` または `Date.now()`|
| Kotlin/Native       | `std::chrono::high_resolution_clock` または `std::chrono::steady_clock`|

### 時間ソースの作成

異なる時間ソースを使用した方がよい場合もあります。例えばAndroidでは、`System.nanoTime()` はデバイスがアクティブな間のみ時間をカウントします。デバイスがディープスリープに入ると、時間の追跡ができなくなります。デバイスがディープスリープ中も時間を追跡し続けるには、[`SystemClock.elapsedRealtimeNanos()`](https://developer.android.com/reference/android/os/SystemClock#elapsedRealtimeNanos()) を使用する時間ソースを作成します：

```kotlin
object RealtimeMonotonicTimeSource : AbstractLongTimeSource(DurationUnit.NANOSECONDS) {
    override fun read(): Long = SystemClock.elapsedRealtimeNanos()
}
```

その後、作成した時間ソースを使用して時間計測を行うことができます：

```kotlin
fun main() {
    val elapsed: Duration = RealtimeMonotonicTimeSource.measureTime {
        Thread.sleep(100)
    }
    println(elapsed) // 例：103 ms
}
```
{validate="false"}

`kotlin.time` パッケージの詳細については、[標準ライブラリ API リファレンス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/)を参照してください。