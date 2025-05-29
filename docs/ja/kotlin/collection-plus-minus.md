[//]: # (title: plusとminus演算子)

Kotlinでは、コレクションに対して[`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) および [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html) (`-`) 演算子が定義されています。これらはコレクションを最初のオペランドとして取り、2番目のオペランドは要素または別のコレクションのいずれかになります。戻り値は新しい読み取り専用コレクションです。

*   `plus` の結果は、元のコレクションの要素と2番目のオペランドの要素を**両方**含みます。
*   `minus` の結果は、2番目のオペランドの要素を**除いた**元のコレクションの要素を含みます。2番目のオペランドが要素の場合、`minus` はその**最初の**出現を削除します。コレクションの場合、その要素の**すべて**の出現が削除されます。

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

マップに対する `plus` および `minus` 演算子の詳細については、[マップ固有の操作](map-operations.md)を参照してください。
[複合代入演算子](operator-overloading.md#augmented-assignments)である[`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) および [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) もコレクションに対して定義されています。ただし、読み取り専用コレクションの場合、これらは実際には `plus` または `minus` 演算子を使用し、その結果を同じ変数に代入しようとします。したがって、これらは `var` の読み取り専用コレクションでのみ利用可能です。可変コレクションの場合、`val` であってもコレクションを変更します。詳細については、[コレクションの書き込み操作](collection-write.md)を参照してください。