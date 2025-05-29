[//]: # (title: レンジとプログレッション)

Kotlinのレンジとプログレッションは値のシーケンスを定義し、範囲演算子、イテレーション、カスタムのステップ値、等差数列をサポートします。

## レンジ {id="range"}

Kotlinでは、`kotlin.ranges` パッケージの[`.rangeTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-to.html) および [`.rangeUntil()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-until.html) 関数を使用して、値のレンジを簡単に作成できます。

レンジは、定義された開始値と終了値を持つ順序付けられた値のセットを表します。デフォルトでは、各ステップで1ずつ増分します。例えば、`1..4` は数値の1、2、3、4を表します。

作成するには：

*   閉区間レンジを作成するには、`..` 演算子を使用して `.rangeTo()` 関数を呼び出します。これは開始値と終了値の両方を含みます。
*   開区間レンジを作成するには、`..<` 演算子を使用して `.rangeUntil()` 関数を呼び出します。これは開始値を含み、終了値を除外します。

例：

```kotlin
fun main() {
//sampleStart
    // 閉区間レンジ: 1と4の両方を含む
    println(4 in 1..4)
    // true
    
    // 開区間レンジ: 1を含み、4を除外する
    println(4 in 1..<4)
    // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-rangeto-rangeuntil"}

レンジは `for` ループで反復処理を行う際に特に便利です。

```kotlin
fun main() {
//sampleStart
    for (i in 1..4) print(i)
    // 1234
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-for-loop"}

数値を逆順に反復処理するには、`..` の代わりに [`downTo`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/down-to.html) 関数を使用します。

```kotlin
fun main() {
//sampleStart
    for (i in 4 downTo 1) print(i)
    // 4321
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-downto"}

デフォルトの1ずつ増分する代わりに、[`step()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/step.html) 関数を使用してカスタムのステップで数値を反復処理することもできます。

```kotlin
fun main() {
//sampleStart
    for (i in 0..8 step 2) print(i)
    println()
    // 02468
    for (i in 0..<8 step 2) print(i)
    println()
    // 0246
    for (i in 8 downTo 0 step 2) print(i)
    // 86420
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-step"}

## プログレッション

`Int`、`Long`、`Char`などの整数型（integral types）のレンジは、[等差数列（arithmetic progressions）](https://en.wikipedia.org/wiki/Arithmetic_progression)として扱えます。Kotlinでは、これらのプログレッションは特別な型によって定義されます：[`IntProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-int-progression/index.html)、[`LongProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-long-progression/index.html)、および [`CharProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-char-progression/index.html)。

プログレッションには3つの重要なプロパティがあります：`first` 要素、`last` 要素、そしてゼロではない `step` です。最初の要素は `first` であり、後続の要素は前の要素に `step` を加えたものです。正のステップを持つプログレッションの反復処理は、Java/JavaScriptにおけるインデックス付き `for` ループに相当します。

```java
for (int i = first; i <= last; i += step) {
  // ...
}
```

レンジを反復処理することでプログレッションを暗黙的に作成すると、このプログレッションの `first` 要素と `last` 要素はレンジの終点となり、`step` は1になります。

```kotlin
fun main() {
//sampleStart
    for (i in 1..10) print(i)
    // 12345678910
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions"}

カスタムのプログレッションステップを定義するには、レンジで `step` 関数を使用します。

```kotlin

fun main() {
//sampleStart
    for (i in 1..8 step 2) print(i)
    // 1357
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-step"}

プログレッションの `last` 要素は次のように計算されます：
*   正のステップの場合：`(last - first) % step == 0` を満たし、かつ終了値を超えない最大値です。
*   負のステップの場合：`(last - first) % step == 0` を満たし、かつ終了値を下回らない最小値です。

したがって、`last` 要素は常に指定された終了値と同じであるとは限りません。

```kotlin

fun main() {
//sampleStart
    for (i in 1..9 step 3) print(i) // 最後の要素は7です
    // 147
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-last"}

プログレッションは `Iterable<N>` を実装しており、ここで `N` はそれぞれ `Int`、`Long`、`Char` です。そのため、`map` や `filter` などの様々な[コレクション関数](collection-operations.md)で使用できます。

```kotlin

fun main() {
//sampleStart
    println((1..10).filter { it % 2 == 0 })
    // [2, 4, 6, 8, 10]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-filter"}