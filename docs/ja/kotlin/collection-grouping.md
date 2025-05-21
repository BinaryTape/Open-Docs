---
title: グルーピング
---
Kotlin標準ライブラリは、コレクションの要素をグループ化するための拡張関数を提供します。
基本的な関数[`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html)は、
ラムダ関数を受け取り、`Map`を返します。このマップでは、各キーはラムダの結果であり、対応する値は、この結果が返された要素の`List`です。この関数は、たとえば、`String`のリストを最初の文字でグループ化するために使用できます。

2番目のラムダ引数（値変換関数）を指定して`groupBy()`を呼び出すこともできます。
2つのラムダを持つ`groupBy()`の結果マップでは、`keySelector`関数によって生成されたキーは、元の要素の代わりに値変換関数の結果にマップされます。

この例では、`groupBy()`関数を使用して文字列を最初の文字でグループ化し、結果の`Map`で`for`演算子を使用してグループを反復処理し、`keySelector`関数を使用して値を大文字に変換する方法を示します。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four", "five")

    // groupBy()を使用して文字列を最初の文字でグループ化します
    val groupedByFirstLetter = numbers.groupBy { it.first().uppercase() }
    println(groupedByFirstLetter)
    // {O=[one], T=[two, three], F=[four, five]}

    // 各グループを反復処理し、キーとそれに関連付けられた値を出力します
    for ((key, value) in groupedByFirstLetter) {
        println("Key: $key, Values: $value")
    }
    // Key: O, Values: [one]
    // Key: T, Values: [two, three]
    // Key: F, Values: [four, five]

    // 文字列を最初の文字でグループ化し、値を大文字に変換します
    val groupedAndTransformed = numbers.groupBy(keySelector = { it.first() }, valueTransform = { it.uppercase() })
    println(groupedAndTransformed)
    // {o=[ONE], t=[TWO, THREE], f=[FOUR, FIVE]}

}
```

要素をグループ化してから、すべてのグループに対して一度に操作を適用する場合は、関数[`groupingBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/grouping-by.html)を使用します。
これは、[`Grouping`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-grouping/index.html)型のインスタンスを返します。`Grouping`インスタンスを使用すると、すべてのグループに対して遅延的に操作を適用できます。グループは、操作の実行直前に実際に構築されます。

具体的には、`Grouping`は次の操作をサポートします。

* [`eachCount()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/each-count.html) は、各グループ内の要素をカウントします。
* [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) および [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) は、
  各グループで[fold and reduce](collection-aggregate#fold-and-reduce)操作を個別のコレクションとして実行し、結果を返します。
* [`aggregate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/aggregate.html) は、指定された操作を
  各グループ内のすべての要素に順番に適用し、結果を返します。
  これは、`Grouping`で任意の操作を実行するための一般的な方法です。 foldまたはreduceでは不十分な場合に、カスタム操作を実装するために使用します。

結果の`Map`で`for`演算子を使用すると、`groupingBy()`関数によって作成されたグループを反復処理できます。
これにより、各キーと、そのキーに関連付けられた要素の数にアクセスできます。

次の例は、`groupingBy()`関数を使用して文字列を最初の文字でグループ化し、
各グループ内の要素をカウントし、各グループを反復処理してキーと要素の数を出力する方法を示しています。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four", "five")

    // groupingBy()を使用して文字列を最初の文字でグループ化し、各グループの要素をカウントします
    val grouped = numbers.groupingBy { it.first() }.eachCount()

    // 各グループを反復処理し、キーとそれに関連付けられた値を出力します
    for ((key, count) in grouped) {
        println("Key: $key, Count: $count")
        // Key: o, Count: 1
        // Key: t, Count: 2
        // Key: f, Count: 2
    }

}
```