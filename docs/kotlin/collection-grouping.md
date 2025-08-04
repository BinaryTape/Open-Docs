[//]: # (title: 分组)

Kotlin 标准库提供了用于对集合元素进行分组的扩展函数。基本函数 [`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html) 接受一个 lambda 表达式并返回一个 `Map`。在此 map 中，每个键是 lambda 结果，对应的值是返回该结果的元素 `List`。例如，此函数可用于根据 `String` 的首字母对 `List` 进行分组。

你也可以用第二个 lambda 实参调用 `groupBy()`，即一个值转换函数。在带有两个 lambda 的 `groupBy()` 结果 map 中，由 `keySelector` 函数生成的键将映射到值转换函数的结果，而不是原始元素。

此示例演示了如何使用 `groupBy()` 函数根据字符串的首字母对其进行分组，使用 `for` 操作符遍历结果 `Map` 上的分组，然后使用 `valueTransform` 函数将值转换为大写：

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

如果你想对元素进行分组，然后一次性对所有分组应用操作，请使用函数 [`groupingBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/grouping-by.html)。它返回一个 [`Grouping`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-grouping/index.html) 类型的实例。`Grouping` 实例允许你惰性地对所有分组应用操作：分组实际上是在操作执行前才构建的。

具体而言，`Grouping` 支持以下操作：

*   [`eachCount()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/each-count.html) 计算每个分组中的元素数量。
*   [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) 和 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) 将每个分组视为单独的集合，并对其执行 [折叠和规约](collection-aggregate.md#fold-and-reduce) 操作，然后返回结果。
*   [`aggregate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/aggregate.html) 随后对每个分组中的所有元素应用给定操作，并返回结果。这是在 `Grouping` 上执行任何操作的通用方式。当折叠或规约不足以满足需求时，可使用它来实现自定义操作。

你可以使用 `for` 操作符遍历由 `groupingBy()` 函数创建的结果 `Map` 上的分组。这允许你访问每个键以及与该键关联的元素数量。

以下示例演示了如何使用 `groupingBy()` 函数根据字符串的首字母对字符串进行分组，计算每个分组中的元素数量，然后遍历每个分组以打印键和元素数量：

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