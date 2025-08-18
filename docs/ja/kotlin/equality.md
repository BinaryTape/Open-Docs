[//]: # (title: 等価性)

Kotlinには、2種類の等価性があります:

*   _構造的_等価性 (`==`) - `equals()`関数のチェック
*   _参照_等価性 (`===`) - 2つの参照が同じオブジェクトを指しているかどうかのチェック

## 構造的等価性

構造的等価性は、2つのオブジェクトが同じ内容または構造を持っているかどうかを検証します。構造的等価性は、`==`演算子とその否定の`!=`によってチェックされます。
慣例として、`a == b`のような式は次のように翻訳されます:

```kotlin
a?.equals(b) ?: (b === null)
```

`a`が`null`でない場合、`equals(Any?)`関数を呼び出します。それ以外の場合（`a`が`null`の場合）は、`b`が参照的に`null`と等しいかどうかをチェックします:

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

`null`と比較する場合、コードを明示的に最適化する意味がないことに注意してください:
`a == null`は自動的に`a === null`に変換されます。

Kotlinでは、`equals()`関数はすべてのクラスが`Any`クラスから継承します。デフォルトでは、`equals()`関数は[参照等価性](#referential-equality)を実装します。しかし、Kotlinのクラスは`equals()`関数をオーバーライドしてカスタムの等価性ロジックを提供し、このようにして構造的等価性を実装できます。

値クラス (Value classes) とデータクラス (data classes) は、`equals()`関数を自動的にオーバーライドする2つの特定のKotlin型です。そのため、デフォルトで構造的等価性を実装します。

ただし、データクラスの場合、親クラスで`equals()`関数が`final`とマークされている場合、その動作は変更されません。

明確に、非データクラス（`data`修飾子で宣言されていないクラス）は、デフォルトでは`equals()`関数をオーバーライドしません。代わりに、非データクラスは`Any`クラスから継承された参照等価性の動作を実装します。構造的等価性を実装するには、非データクラスは`equals()`関数をオーバーライドするためのカスタム等価性ロジックを必要とします。

カスタムの等価性チェック実装を提供するには、[`equals(other: Any?): Boolean`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/equals.html)関数をオーバーライドします:

```kotlin
class Point(val x: Int, val y: Int) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is Point) return false

        // 構造的等価性のためにプロパティを比較
        return this.x == other.x && this.y == other.y
    }
}
```
> `equals()`関数をオーバーライドする際は、等価性とハッシュ化の整合性を保ち、これらの関数の適切な動作を保証するために、[hashCode()関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-any/hash-code.html)もオーバーライドする必要があります。
>
{style="note"}

同じ名前で異なるシグネチャ（例: `equals(other: Foo)`) を持つ関数は、`==`および`!=`演算子による等価性チェックには影響しません。

構造的等価性は、`Comparable<...>`インターフェースによって定義される比較とは関係ないため、カスタムの`equals(Any?)`実装のみが演算子の動作に影響を与える可能性があります。

## 参照等価性

参照等価性は、2つのオブジェクトのメモリ上のアドレスを検証し、それらが同じインスタンスであるかどうかを判断します。

参照等価性は、`===`演算子とその否定の`!==`によってチェックされます。`a === b`は、`a`と`b`が同じオブジェクトを指している場合にのみtrueと評価されます:

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

ランタイムでプリミティブ型（例: `Int`）によって表現される値の場合、`===`等価性チェックは`==`チェックと同等です。

> Kotlin/JSでは、参照等価性の実装が異なります。等価性に関する詳細については、[Kotlin/JS](js-interop.md#equality)ドキュメントを参照してください。
>
{style="tip"}

## 浮動小数点数の等価性

等価性チェックのオペランドが静的に`Float`または`Double`（null許容かどうかにかかわらず）であることが判明している場合、そのチェックは[IEEE 754 浮動小数点算術標準](https://en.wikipedia.org/wiki/IEEE_754)に従います。

オペランドが静的に浮動小数点数として型付けされていない場合、動作は異なります。これらのケースでは、構造的等価性が実装されます。結果として、静的に浮動小数点数として型付けされていないオペランドでのチェックは、IEEE標準とは異なります。このシナリオでは:

*   `NaN`はそれ自身と等しい
*   `NaN`は他のどの要素（`POSITIVE_INFINITY`を含む）よりも大きい
*   `-0.0`は`0.0`と等しくない

詳細については、[浮動小数点数の比較](numbers.md#floating-point-numbers-comparison)を参照してください。

## 配列の等価性

2つの配列が同じ要素を同じ順序で持っているかどうかを比較するには、[`contentEquals()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/content-equals.html)を使用します。

詳細については、[配列の比較](arrays.md#compare-arrays)を参照してください。