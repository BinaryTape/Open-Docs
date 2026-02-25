[//]: # (title: 範囲と進行)

Kotlinにおける範囲（Range）と進行（Progression）は、値のシーケンスを定義します。これらは範囲演算子、イテレーション（反復処理）、カスタムステップ値、および等差数列をサポートしています。

## 範囲（Range） {id="range"}

Kotlinでは、`kotlin.ranges`パッケージの[`.rangeTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-to.html)関数および[`.rangeUntil()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-until.html)関数を使用して、値の範囲を簡単に作成できます。 

範囲は、定義された開始点と終了点を持つ値の順序集合を表します。デフォルトでは、各ステップで1ずつ増加します。
例えば、`1..4`は数値の1、2、3、4を表します。

作成方法：

*   **閉じた範囲（closed-ended range）**を作成するには、`..`演算子で`.rangeTo()`関数を呼び出します。これには開始値と終了値の両方が含まれます。
*   **半開範囲（open-ended range）**を作成するには、`..<`演算子で`.rangeUntil()`関数を呼び出します。これには開始値が含まれますが、終了値は除外されます。

例えば：

```kotlin
fun main() {
//sampleStart
    // 閉じた範囲：1と4の両方を含む
    println(4 in 1..4)
    // true
    
    // 半開範囲：1を含み、4を除外する
    println(4 in 1..<4)
    // false
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-rangeto-rangeuntil"}

範囲は、特に`for`ループでのイテレーションに便利です。

```kotlin
fun main() {
//sampleStart
    for (i in 1..4) print(i)
    // 1234
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-for-loop"}

数値を逆順でイテレートするには、`..`の代わりに[`downTo`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/down-to.html)関数を使用します。

```kotlin
fun main() {
//sampleStart
    for (i in 4 downTo 1) print(i)
    // 4321
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-downto"}

また、デフォルトの増分である1の代わりに、[`step()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/step.html)関数を使用して、カスタムステップで数値をイテレートすることもできます。

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

## 進行（Progression）

`Int`、`Long`、`Char`などの整数型の範囲は、[等差数列（arithmetic progressions）](https://en.wikipedia.org/wiki/Arithmetic_progression)として扱うことができます。
Kotlinでは、これらの進行は特別な型、すなわち[`IntProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-int-progression/index.html)、[`LongProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-long-progression/index.html)、および[`CharProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-char-progression/index.html)によって定義されます。

進行には、`first`（最初の要素）、`last`（最後の要素）、およびゼロ以外の`step`（ステップ）という3つの不可欠なプロパティがあります。
最初の要素は`first`で、それ以降の要素は前の要素に`step`を加えたものになります。 
正のステップを持つ進行のイテレーションは、Java/JavaScriptにおけるインデックス付きの`for`ループと同等です。

```java
for (int i = first; i <= last; i += step) {
  // ...
}
```

範囲をイテレートすることによって暗黙的に進行を作成する場合、その進行の`first`および`last`要素は範囲の終点となり、`step`は1になります。

```kotlin
fun main() {
//sampleStart
    for (i in 1..10) print(i)
    // 12345678910
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions"}

カスタムの進行ステップを定義するには、範囲に対して`step`関数を使用します。

```kotlin

fun main() {
//sampleStart
    for (i in 1..8 step 2) print(i)
    // 1357
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-step"}

進行の`last`要素は次のように計算されます：
*   正のステップの場合：`(last - first) % step == 0`を満たし、かつ終了値を超えない最大の値。
*   負のステップの場合：`(last - first) % step == 0`を満たし、かつ終了値を下回らない最小の値。

したがって、`last`要素は必ずしも指定された終了値と同じになるとは限りません。

```kotlin

fun main() {
//sampleStart
    for (i in 1..9 step 3) print(i) // 最後の要素は7
    // 147
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-last"}

進行は`Iterable<N>`（`N`はそれぞれ`Int`、`Long`、または`Char`）を実装しているため、`map`や`filter`などのさまざまな[コレクション関数](collection-operations.md)で使用できます。

```kotlin

fun main() {
//sampleStart
    println((1..10).filter { it % 2 == 0 })
    // [2, 4, 6, 8, 10]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-ranges-progressions-filter"}