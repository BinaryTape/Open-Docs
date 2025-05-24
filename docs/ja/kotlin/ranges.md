---
title: "範囲と progression"
---
範囲とプログレッションは、Kotlinにおける値のシーケンスを定義するもので、範囲演算子、イテレーション、カスタムステップ値、および算術プログレッションをサポートします。

## 範囲 ([Ranges])

Kotlinでは、`kotlin.ranges`パッケージの[`.rangeTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-to.html)
関数と[`.rangeUntil()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/range-until.html)関数を使用して、値の範囲を簡単に作成できます。

範囲は、定義された開始と終了を持つ順序付けられた値のセットを表します。デフォルトでは、各ステップで1ずつ増加します。
たとえば、`1..4`は、1、2、3、および4の数値を表します。

作成するには:

*   終端を含む範囲を作成するには、`..`演算子を使用して`.rangeTo()`関数を呼び出します。これは、開始値と終了値の両方を含みます。
*   終端を含まない範囲を作成するには、`..<`演算子を使用して`.rangeUntil()`関数を呼び出します。これは、開始値を含みますが、終了値を除外します。

例：

```kotlin
fun main() {

    // 終端を含む範囲：1と4の両方を含む
    println(4 in 1..4)
    // true
    
    // 終端を含まない範囲：1を含む、4は含まない
    println(4 in 1..&lt;4)
    // false

}
```

範囲は、`for`ループを反復処理する場合に特に役立ちます。

```kotlin
fun main() {

    for (i in 1..4) print(i)
    // 1234

}
```

数値を逆順に反復処理するには、`..`の代わりに[`downTo`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/down-to.html)
関数を使用します。

```kotlin
fun main() {

    for (i in 4 downTo 1) print(i)
    // 4321

}
```

また、デフォルトの増分1の代わりに、
[`step()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/step.html)関数を使用して、カスタムステップで数値を反復処理することもできます。

```kotlin
fun main() {

    for (i in 0..8 step 2) print(i)
    println()
    // 02468
    for (i in 0..&lt;8 step 2) print(i)
    println()
    // 0246
    for (i in 8 downTo 0 step 2) print(i)
    // 86420

}
```

## プログレッション ([Progression])

`Int`、`Long`、`Char`などの整数型の範囲は、
[等差数列](https://en.wikipedia.org/wiki/Arithmetic_progression)として扱うことができます。
Kotlinでは、これらのプログレッションは、[`IntProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-int-progression/index.html)、
[`LongProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-long-progression/index.html)、
および[`CharProgression`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/-char-progression/index.html)という特殊な型で定義されています。

プログレッションには、`first`要素、`last`要素、およびゼロ以外の`step`という3つの重要なプロパティがあります。
最初の要素は`first`で、後続の要素は前の要素に`step`を加えたものです。
正のステップでのプログレッションの反復は、Java/JavaScriptのインデックス付き`for`ループと同等です。

```java
for (int i = first; i <= last; i += step) {
  // ...
}
```

範囲を反復処理してプログレッションを暗黙的に作成すると、このプログレッションの`first`要素と`last`要素は、
範囲の端点となり、`step`は1になります。

```kotlin
fun main() {

    for (i in 1..10) print(i)
    // 12345678910

}
```

カスタムのプログレッションステップを定義するには、範囲に対して`step`関数を使用します。

```kotlin

fun main() {

    for (i in 1..8 step 2) print(i)
    // 1357

}
```

プログレッションの`last`要素は、次のように計算されます。
* 正のステップの場合: `(last - first) % step == 0`となる、終了値以下の最大値。
* 負のステップの場合: `(last - first) % step == 0`となる、終了値以上の最小値。

したがって、`last`要素は、指定された終了値と同じとは限りません。

```kotlin

fun main() {

    for (i in 1..9 step 3) print(i) // 最後の要素は7
    // 147

}
```

プログレッションは`Iterable<N>`を実装します。ここで、`N`はそれぞれ`Int`、`Long`、または`Char`です。そのため、`map`、`filter`などのさまざまな
[コレクション関数](collection-operations)で使用できます。

```kotlin

fun main() {

    println((1..10).filter { it % 2 == 0 })
    // [2, 4, 6, 8, 10]

}
```