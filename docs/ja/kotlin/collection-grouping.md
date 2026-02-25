[//]: # (title: グルーピング)

Kotlin標準ライブラリは、コレクションの要素をグルーピングするための拡張関数を提供しています。
基本的な関数である [`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html) は、ラムダ関数を引数に取り、`Map` を返します。このマップでは、各キーはラムダの結果であり、対応する値はその結果が返された要素の `List` です。この関数は、例えば、`String` のリストを最初の文字でグルーピングするために使用できます。

`groupBy()` を2番目のラムダ引数（値変換関数）とともに呼び出すこともできます。
2つのラムダを持つ `groupBy()` の結果マップでは、`keySelector` 関数によって生成されたキーは、元の要素ではなく値変換関数の結果にマッピングされます。

この例では、`groupBy()` 関数を使用して文字列を最初の文字でグルーピングし、結果の `Map` を `for` 演算子で反復処理してグループを確認し、さらに `valueTransform` 関数を使用して値を大文字に変換する方法を示します。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")

    // groupBy() を使用して、文字列を最初の文字でグルーピングします
    val groupedByFirstLetter = numbers.groupBy { it.first().uppercase() }
    println(groupedByFirstLetter)
    // {O=[one], T=[two, three], F=[four, five]}

    // 各グループを反復処理し、キーとそれに関連付けられた値をプリントします
    for ((key, value) in groupedByFirstLetter) {
        println("Key: $key, Values: $value")
    }
    // Key: O, Values: [one]
    // Key: T, Values: [two, three]
    // Key: F, Values: [four, five]

    // 文字列を最初の文字でグルーピングし、値を大文字に変換します
    val groupedAndTransformed = numbers.groupBy(keySelector = { it.first() }, valueTransform = { it.uppercase() })
    println(groupedAndTransformed)
    // {o=[ONE], t=[TWO, THREE], f=[FOUR, FIVE]}
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要素をグルーピングしてから、すべてのグループに対して一度に操作を適用したい場合は、関数 [`groupingBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/grouping-by.html) を使用します。
これは [`Grouping`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-grouping/index.html) 型のインスタンスを返します。`Grouping` インスタンスを使用すると、すべてのグループに対して遅延（lazy）方式で操作を適用できます。グループは、実際に操作が実行される直前に構築されます。

具体的には、`Grouping` は以下の操作をサポートしています。

* [`eachCount()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/each-count.html) は、各グループ内の要素をカウントします。
* [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) および [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) は、各グループを個別のコレクションとして [fold および reduce](collection-aggregate.md#fold-and-reduce) 操作を実行し、その結果を返します。
* [`aggregate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/aggregate.html) は、指定された操作を各グループのすべての要素に順次適用し、その結果を返します。
  これは `Grouping` に対して任意の操作を行うための汎用的な方法です。fold や reduce では不十分な場合に、カスタム操作を実装するために使用します。

結果の `Map` に対して `for` 演算子を使用することで、`groupingBy()` 関数によって作成されたグループを反復処理できます。これにより、各キーと、そのキーに関連付けられた要素のカウントにアクセスできます。

次の例では、`groupingBy()` 関数を使用して文字列を最初の文字でグルーピングし、各グループの要素をカウントして、各グループを反復処理してキーと要素のカウントをプリントする方法を示します。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")

    // groupingBy() を使用して文字列を最初の文字でグルーピングし、各グループの要素をカウントします
    val grouped = numbers.groupingBy { it.first() }.eachCount()

    // 各グループを反復処理し、キーとそれに関連付けられた値をプリントします
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