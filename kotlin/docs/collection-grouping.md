---
title: 分组
---
Kotlin 标准库提供了用于对集合元素进行分组的扩展函数。
基本函数 [`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html) 接受一个 lambda 函数并返回一个 `Map`（映射）。 在这个映射中，每个键是 lambda 结果，对应的值是返回此结果的元素的 `List`（列表）。 例如，此函数可用于按首字母对 `String`（字符串）列表进行分组。

你还可以使用第二个 lambda 参数（一个值转换函数）调用 `groupBy()`。
在具有两个 lambda 的 `groupBy()` 的结果映射中，由 `keySelector` 函数生成的键被映射到值转换函数的结果，而不是原始元素。

此示例演示了如何使用 `groupBy()` 函数按首字母对字符串进行分组，使用 `for` 运算符遍历结果 `Map` 上的组，然后使用 `keySelector` 函数将值转换为大写：

```kotlin
fun main() {

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

}
```

如果想对元素进行分组，然后一次性对所有组应用操作，请使用函数 [`groupingBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/grouping-by.html)。
它返回 [`Grouping`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-grouping/index.html) 类型的实例。`Grouping` 实例允许你以惰性的方式将操作应用于所有组：这些组实际上是在操作执行之前构建的。

具体来说，`Grouping` 支持以下操作：

* [`eachCount()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/each-count.html) 计算每个组中的元素。
* [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) 和 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html)
  对每个组作为单独的集合执行 [fold 和 reduce](collection-aggregate#fold-and-reduce) 操作，并返回结果。
* [`aggregate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/aggregate.html) 将给定的操作
  连续应用于每个组中的所有元素，并返回结果。
  这是对 `Grouping` 执行任何操作的通用方法。 当 fold 或 reduce 不够用时，可以使用它来实现自定义操作。

你可以在生成的 `Map` 上使用 `for` 运算符来遍历由 `groupingBy()` 函数创建的组。
这允许你访问每个键和与该键关联的元素计数。

以下示例演示了如何使用 `groupingBy()` 函数按首字母对字符串进行分组，计算每个组中的元素，然后遍历每个组以打印键和元素计数：

```kotlin
fun main() {

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

}
```