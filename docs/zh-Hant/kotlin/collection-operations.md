[//]: # (title: 集合操作概覽)

Kotlin 標準函式庫提供了多種多樣的函式，用於對集合執行操作。這包括簡單的操作，例如取得或新增元素，以及更複雜的操作，包括搜尋、排序、過濾、轉換等等。

## 擴充函式和成員函式

集合操作在標準函式庫中以兩種方式宣告：集合介面的[成員函式](classes.md#class-members)和[擴充函式](extensions.md#extension-functions)。

成員函式定義了對集合類型至關重要的操作。例如，[`Collection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html) 包含了用於檢查其是否為空的 [`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/is-empty.html) 函式；[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html) 包含了用於索引存取元素的 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) 函式等等。

當您建立自己的集合介面實作時，您必須實作其成員函式。為了讓建立新的實作更容易，請使用標準函式庫中集合介面的骨架實作：[`AbstractCollection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-collection/index.html)、[`AbstractList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-list/index.html)、[`AbstractSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-set/index.html)、[`AbstractMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-map/index.html)，以及它們對應的可變版本。

其他集合操作則宣告為擴充函式。這些是過濾、轉換、排序以及其他集合處理函式。

## 常見操作

常見操作同時適用於[唯讀集合和可變集合](collections-overview.md#collection-types)。常見操作分為以下幾類：

*   [轉換](collection-transformations.md)
*   [過濾](collection-filtering.md)
*   [`plus` 和 `minus` 運算子](collection-plus-minus.md)
*   [分組](collection-grouping.md)
*   [擷取集合部分](collection-parts.md)
*   [擷取單一元素](collection-elements.md)
*   [排序](collection-ordering.md)
*   [聚合操作](collection-aggregate.md)

這些頁面描述的操作會返回其結果，而不會影響原始集合。例如，過濾操作會產生一個_新集合_，其中包含所有符合過濾條件的元素。此類操作的結果應該儲存在變數中，或以其他方式使用，例如作為參數傳遞給其他函式。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")  
    numbers.filter { it.length > 3 }  // nothing happens with `numbers`, result is lost
    println("numbers are still $numbers")
    val longerThan3 = numbers.filter { it.length > 3 } // result is stored in `longerThan3`
    println("numbers longer than 3 chars are $longerThan3")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

對於某些集合操作，有一個選項可以指定_目標_物件。目標是一個可變集合，函式會將其結果項目附加到其中，而不是在新的物件中返回它們。為了執行帶有目標的操作，有獨立的函式，其名稱帶有 `To` 後綴，例如 [`filterTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-to.html) 而不是 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)，或 [`associateTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-to.html) 而不是 [`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html)。這些函式將目標集合作為一個額外參數。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val filterResults = mutableListOf<String>()  //destination object
    numbers.filterTo(filterResults) { it.length > 3 }
    numbers.filterIndexedTo(filterResults) { index, _ -> index == 0 }
    println(filterResults) // contains results of both operations
//sampleEnd
}

```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

為了方便起見，這些函式會返回目標集合，這樣您就可以在函式呼叫的相應參數中直接建立它：

```kotlin

fun main() {
    val numbers = listOf("one", "two", "three", "four")
//sampleStart
    // filter numbers right into a new hash set, 
    // thus eliminating duplicates in the result
    val result = numbers.mapTo(HashSet()) { it.length }
    println("distinct item lengths are $result")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

帶有目標的函式可用於過濾、關聯、分組、平坦化以及其他操作。如需目標操作的完整列表，請參閱 [Kotlin 集合參考資料](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html)。

## 寫入操作

對於可變集合，也有會改變集合狀態的_寫入操作_。此類操作包括新增、移除和更新元素。寫入操作列在 [寫入操作](collection-write.md) 以及 [列表特定操作](list-operations.md#list-write-operations) 和 [映射特定操作](map-operations.md#map-write-operations) 的相應部分中。

對於某些操作，有成對的函式用於執行相同的操作：其中一個原地應用操作，而另一個則將結果作為一個獨立的集合返回。例如，[`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html) 原地排序一個可變集合，因此其狀態會改變；[`sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html) 建立一個新集合，其中包含相同元素，但已按排序順序排列。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    val sortedNumbers = numbers.sorted()
    println(numbers == sortedNumbers)  // false
    numbers.sort()
    println(numbers == sortedNumbers)  // true
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}