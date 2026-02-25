[//]: # (title: 等価性)

Kotlin には、次の 2 種類の等価性があります：

* 構造上の等価性（`==`） - `equals()` 関数のチェック
* 参照上の等価性（`===`） - 2 つの参照が同じオブジェクトを指しているかのチェック

## 構造上の等価性

構造上の等価性は、2 つのオブジェクトが同じ内容または構造を持っているかどうかを検証します。構造上の等価性は、`==` 演算子とその否定である `!=` によってチェックされます。
慣習として、`a == b` のような式は次のように変換されます：

```kotlin
a?.equals(b) ?: (b === null)
```

`a` が `null` でない場合、`equals(Any?)` 関数を呼び出します。そうでない場合（`a` が `null` の場合）、`b` が参照として `null` と等しいかどうかをチェックします：

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`null` と明示的に比較する場合、コードを最適化しても意味がないことに注意してください。`a == null` は自動的に `a === null` に変換されます。

Kotlin では、`equals()` 関数はすべてのクラスが `Any` クラスから継承します。デフォルトでは、`equals()` 関数は[参照上の等価性](#referential-equality)を実装しています。しかし、Kotlin のクラスは `equals()` 関数をオーバーライドしてカスタムの等価ロジックを提供し、それによって構造上の等価性を実装することができます。

バリュークラスとデータクラスは、`equals()` 関数を自動的にオーバーライドする 2 つの特定の Kotlin 型です。そのため、これらはデフォルトで構造上の等価性を実装しています。

ただし、データクラスの場合、親クラスで `equals()` 関数が `final` とマークされていると、その動作は変更されません。

一方、非データクラス（`data` 修飾子で宣言されていないクラス）は、デフォルトでは `equals()` 関数をオーバーライドしません。代わりに、非データクラスは `Any` クラスから継承された参照上の等価性の動作を実装します。構造上の等価性を実装するには、非データクラスで `equals()` 関数をオーバーライドするカスタムの等価ロジックが必要です。

カスタムの等価チェックの実装を提供するには、[`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html) 関数をオーバーライドします：

```kotlin
class Point(val x: Int, val y: Int) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Point) return false

        // 構造上の等価性のためにプロパティを比較する
        return this.x == other.x && this.y == other.y
    }
}
```
> `equals()` 関数をオーバーライドするときは、等価性とハッシュの整合性を保ち、これらの関数の適切な動作を保証するために、[hashCode() 関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/hash-code.html)もオーバーライドする必要があります。
>
{style="note"}

同じ名前で異なるシグネチャを持つ関数（`equals(other: Foo)` など）は、`==` および `!=` 演算子による等価性チェックには影響しません。

構造上の等価性は `Comparable<...>` インターフェースで定義された比較とは関係がないため、カスタムの `equals(Any?)` 実装のみが演算子の動作に影響を与える可能性があります。

## 参照上の等価性

参照上の等価性は、2 つのオブジェクトのメモリパスを検証して、それらが同じインスタンスであるかどうかを判断します。

参照上の等価性は、`===` 演算子とその否定である `!==` によってチェックされます。`a === b` は、`a` と `b` が同じオブジェクトを指している場合にのみ true と評価されます：

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

実行時にプリミティブ型で表される値（たとえば `Int`）の場合、`===` による等価性チェックは `==` チェックと同等です。

> Kotlin/JS では参照上の等価性の実装が異なります。等価性の詳細については、[Kotlin/JS](js-interop.md#equality) のドキュメントを参照してください。
>
{style="tip"}

## 浮動小数点数の等価性

等価性チェックのオペランドが（NULL 許容かどうかにかかわらず）静的に `Float` または `Double` であることがわかっている場合、チェックは [IEEE 754 浮動小数点算術標準](https://en.wikipedia.org/wiki/IEEE_754)に従います。

静的に浮動小数点数として型付けされていないオペランドの場合、動作が異なります。これらの場合、構造上の等価性が実装されます。その結果、静的に浮動小数点数として型付けされていないオペランドを使用したチェックは、IEEE 標準とは異なります。このシナリオでは：

* `NaN` はそれ自身と等しい
* `NaN` は他のどの要素（`POSITIVE_INFINITY` を含む）よりも大きい 
* `-0.0` は `0.0` と等しくない

詳細については、[浮動小数点数の比較](numbers.md#floating-point-numbers-comparison)を参照してください。

## 配列の等価性

2 つの配列が同じ要素を同じ順序で持っているかどうかを比較するには、[`contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html) を使用します。

詳細については、[配列の比較](arrays.md#compare-arrays)を参照してください。