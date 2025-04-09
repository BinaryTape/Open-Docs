---
title: プラスとマイナスの演算子
---
Kotlin では、[`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) と [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html) (`-`) 演算子はコレクションに対して定義されています。
これらの演算子は、最初のオペランドとしてコレクションを取り、2 番目のオペランドには要素または別のコレクションを指定できます。
戻り値は、新しい読み取り専用コレクションです。

* `plus` の結果には、元のコレクションの要素 _と_ 2 番目のオペランドの要素が含まれます。
* `minus` の結果には、元のコレクションの要素のうち、2 番目のオペランドの要素 _以外の_ 要素が含まれます。
   要素の場合、`minus` は最初に現れた要素を削除します。コレクションの場合、その要素の _すべての_ 出現が削除されます。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")

    val plusList = numbers + "five"
    val minusList = numbers - listOf("three", "four")
    println(plusList)
    println(minusList)

}
```

マップに対する `plus` および `minus` 演算子の詳細については、[Map specific operations](map-operations) を参照してください。
[拡張代入演算子](operator-overloading#augmented-assignments) [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) と [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) もコレクションに対して定義されています。
ただし、読み取り専用コレクションの場合、実際には `plus` または `minus` 演算子を使用し、結果を同じ変数に代入しようとします。
したがって、これらは `var` の読み取り専用コレクションでのみ使用できます。
ミュータブルなコレクションの場合、`val` であればコレクションが変更されます。詳細については、[Collection write operations](collection-write) を参照してください。