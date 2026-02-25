[//]: # (title: plus および minus 演算子)

Kotlinでは、コレクションに対して [`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) および [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html) (`-`) 演算子が定義されています。
これらは第1オペランドとしてコレクションを取り、第2オペランドには要素または別のコレクションのいずれかを取ることができます。
戻り値は、新しい読み取り専用（read-only）コレクションです。

* `plus` の結果には、元のコレクションの要素*と*第2オペランドの要素が含まれます。
* `minus` の結果には、第2オペランドの要素を*除いた*元のコレクションの要素が含まれます。
  第2オペランドが要素の場合、`minus` はその*最初*に出現するものを削除します。コレクションの場合、その要素の*すべて*の出現が削除されます。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    val plusList = numbers + "five"
    val minusList = numbers - listOf("three", "four")
    println(plusList)
    println(minusList)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Mapに対する `plus` および `minus` 演算子の詳細については、[Map固有の操作](map-operations.md)を参照してください。
[累算代入演算子](operator-overloading.md#augmented-assignments)である [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) および [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) も、コレクションに対して定義されています。しかし、読み取り専用コレクションの場合、実際には `plus` または `minus` 演算子を使用し、その結果を同じ変数に代入しようとします。したがって、これらは `var` で宣言された読み取り専用コレクションに対してのみ利用可能です。
可変（mutable）コレクションの場合、それらが `val` であっても、これらの演算子はコレクション自体を修正します。詳細については、[コレクションの書き込み操作](collection-write.md)を参照してください。