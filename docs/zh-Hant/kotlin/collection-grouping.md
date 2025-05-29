[//]: # (title: 分組)

Kotlin 標準函式庫提供了用於分組集合元素的擴充函式。
基本函式 [`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html) 接受一個 lambda 函式並回傳一個 `Map`。在此 Map 中，每個鍵都是 lambda 的結果，而對應的值則是回傳該結果的元素的 `List`。此函式可用於例如將字串 (String) 清單依據其第一個字母進行分組。

您也可以呼叫 `groupBy()` 時帶上第二個 lambda 引數 – 一個值轉換函式。
在帶有兩個 lambda 的 `groupBy()` 結果 Map 中，由 `keySelector` 函式產生的鍵會被映射到值轉換函式的結果，而不是原始元素。

此範例說明如何使用 `groupBy()` 函式將字串依據其第一個字母分組，使用 `for` 運算子遍歷結果 `Map` 上的群組，然後使用 `valueTransform` 函式將值轉換為大寫：

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

如果您想對元素進行分組，然後一次性地對所有分組應用一個操作，請使用函式 [`groupingBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/grouping-by.html)。
它會回傳一個 [`Grouping`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-grouping/index.html) 類型的實例。
`Grouping` 實例允許您以惰性方式對所有分組應用操作：這些分組實際上是在操作執行前才建立的。

具體來說，`Grouping` 支援以下操作：

*   [`eachCount()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/each-count.html) 計算每個群組中的元素數量。
*   [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) 和 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html)
    對每個群組作為一個獨立的集合執行 [fold 和 reduce](collection-aggregate.md#fold-and-reduce) 操作並回傳結果。
*   [`aggregate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/aggregate.html) 將給定操作依序應用於每個群組中的所有元素並回傳結果。
    這是對 `Grouping` 執行任何操作的通用方式。當 fold 或 reduce 不足以滿足需求時，可以使用它來實作自訂操作。

您可以使用 `for` 運算子在產生的 `Map` 上遍歷由 `groupingBy()` 函式建立的分組。
這讓您可以存取每個鍵以及與該鍵關聯的元素數量。

以下範例演示如何使用 `groupingBy()` 函式將字串依據其第一個字母分組，計算每個群組中的元素數量，然後遍歷每個群組以列印鍵和元素數量：

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