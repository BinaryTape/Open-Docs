---
title: Equality
---
Kotlinでは、等価性には2つの種類があります。

* _構造的な_ 等価性 (`==`) - `equals()`関数のチェック
* _参照的な_ 等価性 (`===`) - 2つの参照が同じオブジェクトを指しているかのチェック

## 構造的な等価性

構造的な等価性とは、2つのオブジェクトが同じ内容または構造を持っているかどうかを検証するものです。構造的な等価性は、`==` 演算子とその否定である `!=` によってチェックされます。
慣例として、`a == b` のような式は次のように変換されます。

```kotlin
a?.equals(b) ?: (b === null)
```

`a` が `null` でない場合は、`equals(Any?)` 関数を呼び出します。そうでない場合 (`a` が `null` の場合) は、`b` が参照的に `null` と等しいかどうかをチェックします。

```kotlin
fun main() {
    var a = "hello"
    var b = "hello"
    var c = null
    var d = null
    var e = d

    println(a == b)
    // true
    println(a == c)
    // false
    println(c == e)
    // true
}
```

`null` との比較で明示的にコードを最適化しても意味がないことに注意してください。
`a == null` は自動的に `a === null` に変換されます。

Kotlinでは、`equals()` 関数はすべてのクラスによって `Any` クラスから継承されます。デフォルトでは、`equals()` 関数は[参照的な等価性](#referential-equality)を実装しています。ただし、Kotlinのクラスは、`equals()` 関数をオーバーライドして、カスタムの等価性ロジックを提供し、それによって構造的な等価性を実装できます。

値クラスとデータクラスは、`equals()` 関数を自動的にオーバーライドする2つの特定のKotlin型です。
そのため、デフォルトで構造的な等価性を実装します。

ただし、データクラスの場合、`equals()` 関数が親クラスで `final` としてマークされている場合、その動作は変更されません。

明確に、非データクラス（`data` 修飾子で宣言されていないもの）は、デフォルトで `equals()` 関数をオーバーライドしません。代わりに、非データクラスは、`Any` クラスから継承された参照的な等価性の動作を実装します。
構造的な等価性を実装するには、非データクラスは、`equals()` 関数をオーバーライドするためのカスタム等価性ロジックが必要です。

カスタムの等価性チェックの実装を提供するには、
[`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html) 関数をオーバーライドします。

```kotlin
class Point(val x: Int, val y: Int) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Point) return false

        // Compares properties for structural equality
        return this.x == other.x && this.y == other.y
    }
}
``` 
:::note
equals()関数をオーバーライドするときは、[hashCode()関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/hash-code.html)もオーバーライドして、等価性とハッシュ処理の一貫性を保ち、これらの関数の適切な動作を保証する必要があります。

:::

同じ名前で異なるシグネチャを持つ関数 (例: `equals(other: Foo)`) は、演算子 `==` および `!=` による等価性チェックには影響しません。

構造的な等価性は、`Comparable<...>` インターフェースによって定義された比較とは関係がないため、カスタムの `equals(Any?)` の実装のみが演算子の動作に影響を与える可能性があります。

## 参照的な等価性

参照的な等価性とは、2つのオブジェクトのメモリアドレスを検証して、それらが同じインスタンスであるかどうかを判断するものです。

参照的な等価性は、`===` 演算子とその否定である `!==` によってチェックされます。`a === b` は、`a` と `b` が同じオブジェクトを指している場合にのみtrueと評価されます。

```kotlin
fun main() {
    var a = "Hello"
    var b = a
    var c = "world"
    var d = "world"

    println(a === b)
    // true
    println(a === c)
    // false
    println(c === d)
    // true

}
```

実行時にプリミティブ型で表現される値
(たとえば、`Int`) の場合、`===` 等価性チェックは `==` チェックと同等です。

:::tip
参照的な等価性はKotlin/JSでは異なる方法で実装されています。等価性の詳細については、[Kotlin/JS](js-interop#equality)のドキュメントを参照してください。

:::

## 浮動小数点数の等価性

等価性チェックのオペランドが、静的に `Float` または `Double` (nullable かどうかに関わらず) であることがわかっている場合、チェックは [IEEE 754 浮動小数点演算標準](https://en.wikipedia.org/wiki/IEEE_754) に従います。

オペランドが浮動小数点数として静的に型付けされていない場合、動作は異なります。これらの場合、
構造的な等価性が実装されます。その結果、浮動小数点数として静的に型付けされていないオペランドによるチェックは、
IEEE 標準とは異なります。このシナリオでは、次のようになります。

* `NaN` はそれ自身と等しい
* `NaN` は他のどの要素よりも大きい (`POSITIVE_INFINITY` を含む)
* `-0.0` は `0.0` と等しくない

詳細については、[浮動小数点数の比較](numbers#floating-point-numbers-comparison) を参照してください。

## 配列の等価性

2つの配列が同じ要素を同じ順序で持っているかどうかを比較するには、[`contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html) を使用します。

詳細については、[配列の比較](arrays#compare-arrays) を参照してください。