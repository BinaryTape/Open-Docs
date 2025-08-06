[//]: # (title: グルーピング)

Kotlin標準ライブラリは、コレクションの要素をグルーピングするための拡張関数を提供します。
基本的な関数である[`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html)は、ラムダ関数を受け取り、`Map`を返します。このマップでは、各キーがラムダの結果であり、対応する値は、その結果が返された要素の`List`です。この関数は、例えば、`String`のリストを最初の文字でグルーピングするために使用できます。

`groupBy()`は、2つ目のラムダ引数である値変換関数を指定して呼び出すこともできます。
2つのラムダを持つ`groupBy()`の結果マップでは、`keySelector`関数によって生成されたキーが、元の要素の代わりに値変換関数の結果にマップされます。

この例は、`groupBy()`関数を使用して文字列を最初の文字でグルーピングし、結果の`Map`上のグループを`for`演算子でイテレートし、さらに`valueTransform`関数を使用して値を大文字に変換する方法を示しています。

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

要素をグループ化し、一度にすべてのグループに操作を適用したい場合は、関数[`groupingBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/grouping-by.html)を使用します。
これは[`Grouping`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-grouping/index.html)型のインスタンスを返します。
`Grouping`インスタンスを使用すると、すべてのグループに遅延的に操作を適用できます。グループは、操作の実行直前に実際に構築されます。

具体的には、`Grouping`は以下の操作をサポートしています。

*   [`eachCount()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/each-count.html)は、各グループの要素数をカウントします。
*   [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html)と[`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html)は、各グループに対して個別のコレクションとして[foldおよびreduce](collection-aggregate.md#fold-and-reduce)操作を実行し、結果を返します。
*   [`aggregate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/aggregate.html)は、各グループのすべての要素に与えられた操作を順次適用し、結果を返します。
    これは`Grouping`に対して任意の操作を実行する汎用的な方法です。foldやreduceでは不十分な場合に、これを使用してカスタム操作を実装します。

`groupingBy()`関数によって作成されたグループをイテレートするには、結果の`Map`上で`for`演算子を使用できます。
これにより、各キーと、そのキーに関連付けられた要素のカウントにアクセスできます。

次の例は、`groupingBy()`関数を使用して文字列を最初の文字でグルーピングし、各グループの要素をカウントし、次に各グループをイテレートしてキーと要素のカウントを出力する方法を示しています。

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