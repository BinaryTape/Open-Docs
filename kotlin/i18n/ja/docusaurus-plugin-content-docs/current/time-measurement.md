---
title: 時間計測
---
Kotlin標準ライブラリには、異なる単位で時間を計算および測定するためのツールが用意されています。
正確な時間測定は、次のようなアクティビティで重要です。
  * スレッドまたはプロセスの管理
  * 統計の収集
  * タイムアウトの検出
  * デバッグ

デフォルトでは、時間は単調なタイムソースを使用して測定されますが、他のタイムソースも構成できます。
詳細については、[タイムソースの作成](#create-time-source)を参照してください。

## Duration (期間) の計算

時間の長さを表すために、標準ライブラリには[`Duration`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/)
クラスがあります。`Duration`は、[`DurationUnit`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration-unit/)
enumクラスの次の単位で表すことができます。
  * `NANOSECONDS`
  * `MICROSECONDS`
  * `MILLISECONDS`
  * `SECONDS`
  * `MINUTES`
  * `HOURS`
  * `DAYS`

`Duration`は、正、負、ゼロ、正の無限大、または負の無限大にすることができます。

### Duration (期間) の作成

`Duration`を作成するには、`Int`、`Long`、および`Double`型で使用できる[拡張プロパティ](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/#companion-object-properties)を使用します。
`nanoseconds`、`microseconds`、`milliseconds`、`seconds`、`minutes`、`hours`、および`days`。

> 日は24時間の期間を指します。カレンダーの日付ではありません。
> 

例：

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

`Duration`オブジェクトで基本的な算術演算を実行することもできます。

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

### 文字列表現の取得

`Duration`の文字列表現があると、印刷、シリアル化、転送、または保存できるため便利です。

文字列表現を取得するには、`.toString()`関数を使用します。デフォルトでは、時間は存在する各単位を使用して報告されます。
たとえば、`1h 0m 45.677s`または`-(6d 5h 5m 28.284s)`。

出力を構成するには、目的の`DurationUnit`と小数点以下の桁数を関数パラメータとして指定して、`.toString()`関数を使用します。

```kotlin
import kotlin.time.Duration
import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.DurationUnit

fun main() {

    // 秒単位で小数点以下2桁で出力
    println(5887.milliseconds.toString(DurationUnit.SECONDS, 2))
    // 5.89s

}
```

[ISO-8601互換](https://en.wikipedia.org/wiki/ISO_8601)の文字列を取得するには、[`toIsoString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-iso-string.html)
関数を使用します。

```kotlin
import kotlin.time.Duration.Companion.seconds

fun main() {

    println(86420.seconds.toIsoString()) // PT24H0M20S

}
```

### Duration (期間) の変換

`Duration`を異なる`DurationUnit`に変換するには、次のプロパティを使用します。
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

    val thirtyMinutes: Duration = 30.minutes
    println(thirtyMinutes.inWholeSeconds)
    // 1800

}
```

または、次の拡張関数で、目的の`DurationUnit`を関数パラメータとして使用できます。
* `.toInt()`
* `.toDouble()`
* `.toLong()`

例：

```kotlin
import kotlin.time.Duration.Companion.seconds
import kotlin.time.DurationUnit

fun main() {

    println(270.seconds.toDouble(DurationUnit.MINUTES))
    // 4.5

}
```

### Duration (期間) の比較

`Duration`オブジェクトが等しいかどうかを確認するには、等価演算子（`==`）を使用します。

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

`Duration`オブジェクトを比較するには、比較演算子（`<`、`>`）を使用します。

```kotlin
import kotlin.time.Duration.Companion.microseconds
import kotlin.time.Duration.Companion.nanoseconds

fun main() {

    println(3000.microseconds < 25000.nanoseconds)
    // false

}
```

### Duration (期間) を構成要素に分割する

`Duration`を時間の構成要素に分割し、さらにアクションを実行するには、
[`toComponents()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-duration/to-components.html)関数のオーバーロードを使用します。
目的のアクションを関数パラメータとして関数またはラムダ式として追加します。

例：

```kotlin
import kotlin.time.Duration
import kotlin.time.Duration.Companion.minutes

fun main() {

    val thirtyMinutes: Duration = 30.minutes
    println(thirtyMinutes.toComponents { hours, minutes, _, _ `->` "${hours}h:${minutes}m" })
    // 0h:30m

}
```

この例では、ラムダ式には`hours`と`minutes`が関数パラメータとしてあり、未使用の`seconds`と`nanoseconds`パラメータにはアンダースコア（`_`）があります。
この式は、[文字列テンプレート](strings#string-templates)を使用して連結された文字列を返し、`hours`と`minutes`の目的の出力形式を取得します。

## 時間の測定

時間の経過を追跡するために、標準ライブラリは、次のことを簡単に行えるようにツールを提供します。
* 目的の時間単位で、コードの実行にかかる時間を測定します。
* 時間の瞬間をマークします。
* 2つの時間の瞬間を比較および減算します。
* 特定の時間の瞬間からの経過時間を確認します。
* 現在の時間が特定の時間の瞬間を過ぎたかどうかを確認します。

### コードの実行時間を測定する

コードブロックの実行にかかる時間を測定するには、[`measureTime`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html)
インライン関数を使用します。

```kotlin
import kotlin.time.measureTime

fun main() {

    val timeTaken = measureTime {
        Thread.sleep(100)
    }
    println(timeTaken) // 例：103 ms

}
```

コードブロックの実行にかかる時間を測定**し**、コードブロックの値を返すには、インライン関数[`measureTimedValue`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-time.html)を使用します。

例：

```kotlin
import kotlin.time.measureTimedValue

fun main() {

    val (value, timeTaken) = measureTimedValue {
        Thread.sleep(100)
        42
    }
    println(value)     // 42
    println(timeTaken) // 例：103 ms

}
```

デフォルトでは、両方の関数は単調なタイムソースを使用します。

### 時間の瞬間をマークする

特定の時間の瞬間をマークするには、[`TimeSource`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/)
インターフェースと[`markNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-source/mark-now.html)関数を使用して
[`TimeMark`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/)を作成します。

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

例：

```kotlin
import kotlin.time.*

fun main() {

   val timeSource = TimeSource.Monotonic
   val mark1 = timeSource.markNow()
   Thread.sleep(500) // 0.5秒スリープします。
   val mark2 = timeSource.markNow()

   repeat(4) { n `->`
       val mark3 = timeSource.markNow()
       val elapsed1 = mark3 - mark1
       val elapsed2 = mark3 - mark2

       println("Measurement 1.${n + 1}: elapsed1=$elapsed1, elapsed2=$elapsed2, diff=${elapsed1 - elapsed2}")
   }
   
   println(mark2 > mark1) // これは、mark2がmark1よりも後にキャプチャされたため、trueです。
   // true

}
```

期限が切れたか、タイムアウトに達したかを確認するには、[`hasPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-passed-now.html)
および[`hasNotPassedNow()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/-time-mark/has-not-passed-now.html)
拡張関数を使用します。

```kotlin
import kotlin.time.*
import kotlin.time.Duration.Companion.seconds

fun main() {

   val timeSource = TimeSource.Monotonic
   val mark1 = timeSource.markNow()
   val fiveSeconds: Duration = 5.seconds
   val mark2 = mark1 + fiveSeconds

   // まだ5秒経っていません
   println(mark2.hasPassedNow())
   // false
  
   // 6秒待ちます
   Thread.sleep(6000)
   println(mark2.hasPassedNow())
   // true

}
```

## タイムソース

デフォルトでは、時間は単調なタイムソースを使用して測定されます。単調なタイムソースは前進するだけで、タイムゾーンなどの変動の影響を受けません。
単調な時間の代替手段は、経過実時間です。これは、ウォールクロック時間とも呼ばれます。経過実時間は、別の時点を基準に測定されます。

### プラットフォームごとのデフォルトのタイムソース

次の表は、各プラットフォームの単調な時間のデフォルトのソースを示しています。

| Platform            | Source |
|---------------------|---|
| Kotlin/JVM          | `System.nanoTime()`|
| Kotlin/JS (Node.js) | `process.hrtime()`|
| Kotlin/JS (browser) | `window.performance.now()` or `Date.now()`|
| Kotlin/Native       | `std::chrono::high_resolution_clock` or `std::chrono::steady_clock`|

### タイムソースの作成

異なるタイムソースを使用したい場合があるかもしれません。たとえば、Androidでは、`System.nanoTime()`はデバイスがアクティブな間のみ時間をカウントします。
デバイスがディープスリープに入ると、時間の追跡を失います。デバイスがディープスリープ状態にある間に時間を追跡するには、[`SystemClock.elapsedRealtimeNanos()`](https://developer.android.com/reference/android/os/SystemClock#elapsedRealtimeNanos())を使用するタイムソースを作成できます。

```kotlin
object RealtimeMonotonicTimeSource : AbstractLongTimeSource(DurationUnit.NANOSECONDS) {
    override fun read(): Long = SystemClock.elapsedRealtimeNanos()
}
```

次に、タイムソースを使用して時間測定を行うことができます。

```kotlin
fun main() {
    val elapsed: Duration = RealtimeMonotonicTimeSource.measureTime {
        Thread.sleep(100)
    }
    println(elapsed) // 例：103 ms
}
```

`kotlin.time`パッケージの詳細については、[標準ライブラリAPIリファレンス](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/)を参照してください。