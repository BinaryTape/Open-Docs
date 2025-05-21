---
title: "群組 (Grouping)"
---
Kotlin 標準函式庫提供了用於分組集合元素的擴充函式（extension functions）。
基本的函式 [`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html) 接受一個 lambda 函式並返回一個 `Map`（映射）。在這個映射中，每個鍵（key）是 lambda 的結果，而對應的值（value）是返回此結果的元素 `List`（列表）。例如，此函式可用於依據 `String`（字串）的第一個字母對字串列表進行分組。

您還可以呼叫帶有第二個 lambda 參數的 `groupBy()` - 一個值轉換函式（value transformation function）。
在具有兩個 lambda 的 `groupBy()` 的結果映射中，由 `keySelector` 函式產生的鍵會映射到值轉換函式的結果，而不是原始元素。

此範例說明了如何使用 `groupBy()` 函式依據字串的第一個字母對字串進行分組，使用 `for` 運算子（operator）在產生的 `Map`（映射）上迭代群組，然後使用 `keySelector` 函式將值轉換為大寫：

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

如果您想要對元素進行分組，然後一次性地將操作應用於所有群組，請使用函式 [`groupingBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/grouping-by.html)。
它返回 [`Grouping`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-grouping/index.html) 類型的實例。`Grouping` 實例允許您以延遲（lazy）的方式將操作應用於所有群組：這些群組實際上是在操作執行之前建立的。

具體來說，`Grouping` 支援以下操作：

* [`eachCount()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/each-count.html) 計算每個群組中的元素。
* [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) 和 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html)
  對每個群組作為單獨的集合執行 [fold 和 reduce](collection-aggregate#fold-and-reduce) 操作，並返回結果。
* [`aggregate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/aggregate.html) 將給定的操作後續地應用於每個群組中的所有元素，並返回結果。
  這是對 `Grouping` 執行任何操作的通用方法。當 fold 或 reduce 不夠用時，可以使用它來實現自定義操作。

您可以使用 `for` 運算子在產生的 `Map`（映射）上迭代 `groupingBy()` 函式建立的群組。
這允許您訪問每個鍵以及與該鍵關聯的元素計數。

以下範例示範了如何使用 `groupingBy()` 函式依據字串的第一個字母對字串進行分組，計算每個群組中的元素，然後迭代每個群組以列印鍵和元素計數：

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