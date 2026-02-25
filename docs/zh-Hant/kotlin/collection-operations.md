[//]: # (title: 集合操作概覽)

Kotlin 標準函式庫提供了多種用於對集合執行操作的函式。這包括簡單的操作，例如獲取或新增元素，以及更複雜的操作，包括搜尋、排序、篩選、轉換等。

## 成員函數與擴充方法

集合操作在標準函式庫中透過兩種方式宣告：集合介面的[成員函數](classes.md)與[擴充方法](extensions.md#extension-functions)。

成員函數定義了對於集合型別至關重要的操作。例如，[`Collection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html) 包含用於檢查是否為空的 [`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/is-empty.html) 函式；[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html) 包含用於透過索引存取元素的 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) 等。

當你建立自己的集合介面實作時，必須實作它們的成員函數。為了讓建立新實作更加容易，請使用標準函式庫中集合介面的骨架實作：[`AbstractCollection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-collection/index.html)、[`AbstractList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-list/index.html)、[`AbstractSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-set/index.html)、[`AbstractMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-map/index.html) 及其可變對應版本。

其他集合操作則宣告為擴充方法。這些包括篩選、轉換、排序以及其他集合處理函式。

## 通用操作

通用操作可用於[唯讀與可變集合](collections-overview.md#collection-types)。通用操作分為以下幾組：

* [轉換](collection-transformations.md)
* [篩選](collection-filtering.md)
* [`plus` 與 `minus` 運算子](collection-plus-minus.md)
* [分組](collection-grouping.md)
* [獲取集合部分內容](collection-parts.md)
* [獲取單個元素](collection-elements.md)
* [排序](collection-ordering.md)
* [聚合操作](collection-aggregate.md)

這些頁面中描述的操作會傳回其結果，而不會影響原始集合。例如，篩選操作會產生一個「新集合」，其中包含所有符合篩選謂詞的元素。此類操作的結果應儲存在變數中，或以其他方式使用，例如傳遞給其他函式。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")  
    numbers.filter { it.length > 3 }  // numbers 沒有發生任何變化，結果遺失了
    println("numbers are still $numbers")
    val longerThan3 = numbers.filter { it.length > 3 } // 結果儲存在 longerThan3 中
    println("numbers longer than 3 chars are $longerThan3")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

對於某些集合操作，可以選擇指定「目標 (destination)」物件。目標是一個可變集合，函式會將其結果項目附加到該集合中，而不是在一個新物件中傳回。為了執行帶有目標的操作，有專門在名稱中帶有 `To` 後綴的函式，例如使用 [`filterTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-to.html) 而不是 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)，或使用 [`associateTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-to.html) 而不是 [`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html)。這些函式將目標集合（destination collection）作為額外參數。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val filterResults = mutableListOf<String>()  // 目標物件
    numbers.filterTo(filterResults) { it.length > 3 }
    numbers.filterIndexedTo(filterResults) { index, _ -> index == 0 }
    println(filterResults) // 包含兩次操作的結果
//sampleEnd
}

```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

為了方便起見，這些函式會將目標集合傳回，因此你可以在函式呼叫的對應引數中直接建立它：

```kotlin

fun main() {
    val numbers = listOf("one", "two", "three", "four")
//sampleStart
    // 直接將 numbers 篩選到一個新的 hash set 中，
    // 從而消除結果中的重複項
    val result = numbers.mapTo(HashSet()) { it.length }
    println("distinct item lengths are $result")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

帶有目標的函式可用於篩選、關聯、分組、扁平化和其他操作。有關目標操作的完整列表，請參閱 [Kotlin 集合參考文件](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html)。

## 寫入操作

對於可變集合，還有會更改集合狀態的「寫入操作」。此類操作包括新增、移除和更新元素。寫入操作列在[寫入操作](collection-write.md)以及[清單特定操作](list-operations.md#list-write-operations)和[映射特定操作](map-operations.md#map-write-operations)的對應章節中。

對於某些操作，存在成對的函式用於執行相同的操作：一個是在原地（in-place）套用操作，另一個則將結果作為獨立集合傳回。例如，[`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html) 會原地對可變集合進行排序，因此其狀態會發生變化；而 [`sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html) 會建立一個包含相同元素但按排序順序排列的新集合。

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