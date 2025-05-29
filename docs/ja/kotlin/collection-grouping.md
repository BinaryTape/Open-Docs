[//]: # (title: グループ化)

Kotlin標準ライブラリは、コレクション要素をグループ化するための拡張関数を提供します。
基本的な関数[`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html)はラムダ関数を受け取り、`Map`を返します。
このマップでは、各キーはラムダの結果であり、対応する値はその結果が返される要素の`List`です。
この関数は、例えば`String`のリストをその最初の文字でグループ化するために使用できます。

`groupBy()`は、2番目のラムダ引数（値変換関数）とともに呼び出すこともできます。
2つのラムダを持つ`groupBy()`の結果マップでは、`keySelector`関数によって生成されたキーは、元の要素ではなく値変換関数の結果にマップされます。

この例では、`groupBy()`関数を使用して文字列を最初の文字でグループ化し、結果の`Map`上のグループを`for`演算子で反復処理し、`valueTransform`関数を使用して値を大文字に変換する方法を示します。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")

    // Groups the strings by their first letter using groupBy()
    val groupedByFirstLetter = numbers.groupBy { it.first().uppercase() }
    println(groupedByFirstLetter)
    // {O=[one], T=[two, three], F=[four, five]}

    // Iterates through each group and prints the key and its associated values
    for ((key, value) in groupedByFirstLetter) {
        println("Key: $key, Values: $value")
    }
    // Key: O, Values: [one]
    // Key: T, Values: [two, three]
    // Key: F, Values: [four, five]

    // Groups the strings by their first letter and transforms the values to uppercase
    val groupedAndTransformed = numbers.groupBy(keySelector = { it.first() }, valueTransform = { it.uppercase() })
    println(groupedAndTransformed)
    // {o=[ONE], t=[TWO, THREE], f=[FOUR, FIVE]}
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要素をグループ化し、そのすべてのグループに一度に操作を適用したい場合は、関数[`groupingBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/grouping-by.html)を使用します。
これは[`Grouping`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-grouping/index.html)型のインスタンスを返します。
`Grouping`インスタンスを使用すると、すべてのグループに遅延的に操作を適用できます。グループは、操作の実行直前に実際に構築されます。

具体的には、`Grouping`は以下の操作をサポートしています。

*   [`eachCount()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/each-count.html)は各グループ内の要素をカウントします。
*   [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html)と[`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html)は、各グループに対して個別のコレクションとして[foldおよびreduce](collection-aggregate.md#fold-and-reduce)操作を実行し、結果を返します。
*   [`aggregate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/aggregate.html)は、与えられた操作を各グループのすべての要素に連続して適用し、結果を返します。
    これは`Grouping`に対して任意の操作を実行するための一般的な方法です。foldやreduceで十分でない場合に、カスタム操作を実装するために使用します。

`groupingBy()`関数によって作成されたグループを反復処理するには、結果の`Map`上で`for`演算子を使用できます。
これにより、各キーと、そのキーに関連付けられた要素のカウントにアクセスできます。

次の例は、`groupingBy()`関数を使用して文字列を最初の文字でグループ化し、各グループの要素をカウントし、その後各グループを反復処理してキーと要素のカウントを出力する方法を示しています。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")

    // Groups the strings by their first letter using groupingBy() and counts the elements in each group
    val grouped = numbers.groupingBy { it.first() }.eachCount()

    // Iterates through each group and prints the key and its associated values
    for ((key, count) in grouped) {
        println("Key: $key, Count: $count")
        // Key: o, Count: 1
        // Key: t, Count: 2
        // Key: f, Count: 2
    }
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}