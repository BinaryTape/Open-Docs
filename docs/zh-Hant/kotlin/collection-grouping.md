[//]: # (title: 分組)

Kotlin 標準函式庫提供了用於分組集合元素的擴充函式。
基本函式 [`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html) 接受一個 Lambda 函式並傳回一個 `Map`。在此 Map 中，每個鍵是 Lambda 的結果，而對應的值是傳回該結果之元素的 `List`。例如，可以使用此函式依首字母對 `String` 清單進行分組。

你也可以呼叫帶有第二個 Lambda 引數（即值轉換函式）的 `groupBy()`。
在使用兩個 Lambda 的 `groupBy()` 結果 Map 中，由 `keySelector` 函式產生的鍵會對應到值轉換函式的結果，而不是原始元素。

此範例說明了如何使用 `groupBy()` 函式依首字母對字串進行分組，使用 `for` 運算子遍歷結果 `Map` 中的群組，然後使用 `valueTransform` 函式將值轉換為大寫：

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")

    // 使用 groupBy() 依首字母對字串進行分組
    val groupedByFirstLetter = numbers.groupBy { it.first().uppercase() }
    println(groupedByFirstLetter)
    // {O=[one], T=[two, three], F=[four, five]}

    // 遍歷每個群組並列印鍵及其關聯的值
    for ((key, value) in groupedByFirstLetter) {
        println("Key: $key, Values: $value")
    }
    // Key: O, Values: [one]
    // Key: T, Values: [two, three]
    // Key: F, Values: [four, five]

    // 依首字母對字串進行分組，並將值轉換為大寫
    val groupedAndTransformed = numbers.groupBy(keySelector = { it.first() }, valueTransform = { it.uppercase() })
    println(groupedAndTransformed)
    // {o=[ONE], t=[TWO, THREE], f=[FOUR, FIVE]}
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果你想對元素進行分組，然後一次對所有群組套用操作，請使用函式 [`groupingBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/grouping-by.html)。
它會傳回 [`Grouping`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-grouping/index.html) 型別的執行個體。`Grouping` 執行個體讓你能夠以延遲方式對所有群組套用操作：群組實際上是在操作執行前才建立的。

具體來說，`Grouping` 支援以下操作：

* [`eachCount()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/each-count.html) 計算每個群組中的元素數量。
* [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) 與 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) 在每個群組上作為獨立集合執行 [fold 與 reduce](collection-aggregate.md#fold-and-reduce) 操作，並傳回結果。
* [`aggregate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/aggregate.html) 將指定操作隨後套用到每個群組中的所有元素並傳回結果。
  這是對 `Grouping` 執行任何操作的通用方式。當 fold 或 reduce 不足以滿足需求時，可使用它來實作自訂操作。

你可以在結果 `Map` 上使用 `for` 運算子遍歷由 `groupingBy()` 函式建立的群組。這讓你能夠存取每個鍵以及與該鍵關聯的元素數量。

以下範例示範如何使用 `groupingBy()` 函式依首字母對字串進行分組、計算每個群組中的元素數量，然後遍歷每個群組以列印鍵和元素數量：

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")

    // 使用 groupingBy() 依首字母對字串進行分組，並計算每個群組中的元素數量
    val grouped = numbers.groupingBy { it.first() }.eachCount()

    // 遍歷每個群組並列印鍵及其關聯的值
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