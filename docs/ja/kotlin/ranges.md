[//]: # (title: 範囲と進行)

Kotlinでは、範囲と進行により値のシーケンスを定義でき、範囲演算子、イテレーション、カスタムステップ値、等差数列をサポートします。

## 範囲 {id="range"}

Kotlinでは、`kotlin.ranges`パッケージの[`.rangeTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-to.html)と[`.rangeUntil()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-until.html)関数を使って値の範囲を簡単に作成できます。

範囲は、開始と終了が定義された値の順序付けられたセットを表します。デフォルトでは、各ステップで1ずつ増えます。例えば、`1..4`は1、2、3、4という数値を表します。

作成するには:

* 閉じた範囲を作成するには、`..`演算子で`.rangeTo()`関数を呼び出します。これには開始値と終了値の両方が含まれます。
* 開いた範囲を作成するには、`..<`演算子で`.rangeUntil()`関数を呼び出します。これには開始値は含まれますが、終了値は含まれません。

例:

```kotlin
fun main() {
//sampleStart
    // 閉じた範囲: 1と4の両方を含む
    println(4 in 1..4)
    // true
    
    // 開いた範囲: 1を含み、4を含まない
    println(4 in 1..<4)
    // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-rangeto-rangeuntil"}

範囲は、`for`ループでイテレーションを行う際に特に便利です:

```kotlin
fun main() {
//sampleStart
    for (i in 1..4) print(i)
    // 1234
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-for-loop"}

数値を逆順にイテレートするには、`..`の代わりに[`downTo`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/down-to.html)関数を使用します。

```kotlin
fun main() {
//sampleStart
    for (i in 4 downTo 1) print(i)
    // 4321
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-downto"}

デフォルトの1増分の代わりに、[`step()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/step.html)関数を使ってカスタムステップで数値をイテレートすることもできます:

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

## 進行

`Int`、`Long`、`Char`のような整数型の範囲は、[等差数列](https://en.wikipedia.org/wiki/Arithmetic_progression)として扱うことができます。Kotlinでは、これらの進行は[`IntProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-int-progression/index.html)、[`LongProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-long-progression/index.html)、[`CharProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-char-progression/index.html)といった特殊な型で定義されます。

進行には、`first`要素、`last`要素、0ではない`step`という3つの重要なプロパティがあります。最初の要素は`first`で、後続の要素は前の要素に`step`を加えたものです。正のステップを持つ進行のイテレーションは、Java/JavaScriptにおけるインデックス付き`for`ループと同等です。

```java
for (int i = first; i <= last; i += step) {
  // ...
}
```

範囲をイテレートすることによって暗黙的に進行を作成する場合、この進行の`first`要素と`last`要素は範囲の終点となり、`step`は1になります。

```kotlin
fun main() {
//sampleStart
    for (i in 1..10) print(i)
    // 12345678910
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions"}

カスタム進行ステップを定義するには、範囲に対して`step`関数を使用します。

```kotlin

fun main() {
//sampleStart
    for (i in 1..8 step 2) print(i)
    // 1357
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-step"}

進行の`last`要素は次のように計算されます:
* 正のステップの場合: 終了値を超えず、かつ`(last - first) % step == 0`となる最大値。
* 負のステップの場合: 終了値を下回らず、かつ`(last - first) % step == 0`となる最小値。

したがって、`last`要素は指定された終了値と常に同じであるとは限りません。

```kotlin

fun main() {
//sampleStart
    for (i in 1..9 step 3) print(i) // 最後の要素は7です
    // 147
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-last"}

進行は`Iterable<N>`を実装しており、ここで`N`はそれぞれ`Int`、`Long`、`Char`であるため、`map`、`filter`などのさまざまな[コレクション関数](collection-operations.md)で使用できます。

```kotlin

fun main() {
//sampleStart
    println((1..10).filter { it % 2 == 0 })
    // [2, 4, 6, 8, 10]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-filter"}