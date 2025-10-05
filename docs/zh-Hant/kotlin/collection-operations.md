[//]: # (title: 集合操作概覽)

Kotlin 標準函式庫提供了多種函式，用於對集合執行操作。這包括簡單的操作，例如取得或新增元素，以及更複雜的操作，包括搜尋、排序、篩選、轉換等等。

## 擴充函式與成員函式

集合操作在標準函式庫中有兩種宣告方式：集合介面的[成員函式](classes.md)和[擴充函式](extensions.md#extension-functions)。

成員函式定義了集合類型所必需的操作。例如，[`Collection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html) 包含了用於檢查其是否為空的函式 [`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/is-empty.html)；[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html) 包含了用於透過索引存取元素的 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) 等等。

當您建立自己的集合介面實作時，必須實作成員函式。為了更輕鬆地建立新的實作，請使用標準函式庫中集合介面的骨架實作：[`AbstractCollection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-collection/index.html)、[`AbstractList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-list/index.html)、[`AbstractSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-set/index.html)、[`AbstractMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-map/index.html)，以及它們的可變動版本。

其他集合操作則宣告為擴充函式。這些是篩選、轉換、排序以及其他集合處理函式。

## 常見操作

常見操作適用於[唯讀集合和可變動集合](collections-overview.md#collection-types)。常見操作分為以下幾組：

*   [轉換](collection-transformations.md)
*   [篩選](collection-filtering.md)
*   [`plus` 與 `minus` 運算子](collection-plus-minus.md)
*   [分組](collection-grouping.md)
*   [擷取集合部分](collection-parts.md)
*   [擷取單一元素](collection-elements.md)
*   [排序](collection-ordering.md)
*   [聚合操作](collection-aggregate.md)

這些頁面上描述的操作會回傳其結果，而不會影響原始集合。例如，篩選操作會產生一個包含所有符合篩選謂詞的元素之_新集合_。此類操作的結果應儲存在變數中，或以其他方式使用，例如傳遞給其他函式。

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

對於某些集合操作，可以選擇指定_目的地_物件。目的地是一個可變動集合，函式會將其結果項目附加到該集合，而不是在新物件中回傳它們。為了執行帶有目的地的操作，有獨立的函式在其名稱中帶有 `To` 字尾，例如 [`filterTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-to.html) 而不是 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)，或者 [`associateTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-to.html) 而不是 [`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html)。這些函式會將目的地集合作為額外參數。

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

為了方便，這些函式會回傳目的地集合，因此您可以直接在函式呼叫的對應引數中建立它：

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

帶有目的地的函式可用於篩選、關聯、分組、扁平化以及其他操作。有關目的地操作的完整列表，請參閱 [Kotlin 集合參考](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html)。

## 寫入操作

對於可變動集合，也有會改變集合狀態的_寫入操作_。此類操作包括新增、移除和更新元素。寫入操作列於[寫入操作](collection-write.md)以及[列表特有操作](list-operations.md#list-write-operations)和[映射特有操作](map-operations.md#map-write-operations)的對應章節中。

對於某些操作，有成對的函式用於執行相同的操作：一個原地應用操作，另一個則以獨立的集合回傳結果。例如，[`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html) 會原地排序可變動集合，因此其狀態會改變；而 [`sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html) 會建立一個包含相同元素且已排序的新集合。

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