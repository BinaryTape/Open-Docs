[//]: # (title: 分組)

Kotlin 標準函式庫提供了用於分組集合元素的擴充函式。
基本函式 [`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html) 接受一個 Lambda 函式並返回一個 `Map`。在此映射中，每個鍵都是 Lambda 的結果，而對應的值則是產生此結果的元素 `List`。例如，此函式可用於依照字串 `List` 的第一個字母進行分組。

您也可以呼叫 `groupBy()` 並帶入第二個 Lambda 引數——一個值轉換函式。
在使用兩個 Lambda 的 `groupBy()` 結果映射中，`keySelector` 函式所產生的鍵會被映射到值轉換函式的結果，而不是原始元素。

此範例說明了如何使用 `groupBy()` 函式依據字串的第一個字母進行分組，使用 `for` 運算子迭代結果 `Map` 上的分組，然後使用 `valueTransform` 函式將值轉換為大寫：

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

如果您想分組元素並一次性對所有分組套用操作，請使用 `groupingBy()` 函式。
它會返回一個 [`Grouping`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-grouping/index.html) 類型的實例。`Grouping` 實例讓您能以惰性方式對所有分組套用操作：分組實際上是在操作執行之前才建立的。

具體來說，`Grouping` 支援以下操作：

*   [`eachCount()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/each-count.html) 計算每個分組中的元素數量。
*   [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) 和 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) 對每個分組作為獨立集合執行 [摺疊與歸約](collection-aggregate.md#fold-and-reduce) 操作並返回結果。
*   [`aggregate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/aggregate.html) 依序對每個分組中的所有元素套用指定操作並返回結果。
    這是對 `Grouping` 執行任何操作的通用方式。當摺疊或歸約不足以滿足需求時，使用它來實作自訂操作。

您可以使用 `for` 運算子在結果 `Map` 上迭代由 `groupingBy()` 函式建立的分組。這讓您可以存取每個鍵以及與該鍵關聯的元素數量。

以下範例示範如何使用 `groupingBy()` 函式依據字串的第一個字母進行分組，計算每個分組中的元素數量，然後迭代每個分組以印出鍵和元素數量：

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