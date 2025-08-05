[//]: # (title: plus および minus 演算子)

Kotlinでは、[`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) および [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html) (`-`) 演算子がコレクションに対して定義されています。これらは最初のオペランドとしてコレクションを取り、2番目のオペランドは要素または別のコレクションのいずれかになります。返される値は新しい読み取り専用コレクションです。

*   `plus` の結果には、元のコレクションの要素 _と_ 2番目のオペランドの要素が含まれます。
*   `minus` の結果には、元のコレクションの要素のうち、2番目のオペランドの要素 _を除いたもの_ が含まれます。それが要素の場合、`minus` はその _最初の_ 出現箇所を削除します。それがコレクションの場合、その要素の _すべての_ 出現箇所が削除されます。

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

マップに対する `plus` および `minus` 演算子の詳細については、[マップ固有の操作](map-operations.md)を参照してください。[複合代入演算子](operator-overloading.md#augmented-assignments)である[`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) および [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) もコレクションに対して定義されています。しかし、読み取り専用コレクションの場合、これらは実際には `plus` または `minus` 演算子を使用し、その結果を同じ変数に代入しようとします。したがって、これらは `var` 読み取り専用コレクションでのみ利用可能です。可変コレクションの場合、それが `val` であればコレクションを変更します。詳細については、[コレクションの書き込み操作](collection-write.md)を参照してください。