---
title: 集合運算概觀
---
Kotlin 標準函式庫提供了多種函式，用於對集合執行操作。 這包括簡單的操作（例如取得或新增元素），以及更複雜的操作（包括搜尋、排序、篩選、轉換等等）。

## 擴充函式和成員函式

集合操作在標準函式庫中以兩種方式宣告：集合介面的[成員函式](classes#class-members)和[擴充函式](extensions#extension-functions)。

成員函式定義了集合類型必備的操作。 例如，[`Collection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html) 包含用於檢查其是否為空的函式 [`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/is-empty.html)；[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html) 包含用於索引存取元素的 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html)，等等。

當您建立自己的集合介面實作時，您必須實作其成員函式。 為了更輕鬆地建立新的實作，請使用標準函式庫中集合介面的骨架實作：[`AbstractCollection`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-collection/index.html)、[`AbstractList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-list/index.html)、[`AbstractSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-set/index.html)、[`AbstractMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-abstract-map/index.html) 及其可變對應項。

其他集合操作宣告為擴充函式。 這些是篩選、轉換、排序和其他集合處理函式。

## 常用操作

常用操作適用於[唯讀和可變集合](collections-overview#collection-types)。 常用操作分為以下幾組：

* [轉換](collection-transformations)
* [篩選](collection-filtering)
* [`plus` 和 `minus` 運算符](collection-plus-minus)
* [分組](collection-grouping)
* [檢索集合部分](collection-parts)
* [檢索單個元素](collection-elements)
* [排序](collection-ordering)
* [聚合操作](collection-aggregate)

這些頁面上描述的操作會傳回其結果，而不會影響原始集合。 例如，篩選操作會產生一個_新集合_，其中包含所有符合篩選條件的元素。 此類操作的結果應儲存在變數中，或以其他方式使用，例如，傳遞到其他函式中。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")  
    numbers.filter { it.length > 3 }  // nothing happens with `numbers`, result is lost
    println("numbers are still $numbers")
    val longerThan3 = numbers.filter { it.length > 3 } // result is stored in `longerThan3`
    println("numbers longer than 3 chars are $longerThan3")

}
```

對於某些集合操作，您可以選擇指定_目標_物件。 目標是一個可變集合，函式會將其結果項目附加到該集合，而不是在新物件中傳回它們。 為了執行帶有目標的操作，有一些名稱中帶有 `To` 後綴的單獨函式，例如，[`filterTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-to.html) 而不是 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 或 [`associateTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-to.html) 而不是 [`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html)。 這些函式將目標集合作為額外參數。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")
    val filterResults = mutableListOf<String>()  //destination object
    numbers.filterTo(filterResults) { it.length > 3 }
    numbers.filterIndexedTo(filterResults) { index, _ `->` index == 0 }
    println(filterResults) // contains results of both operations

}

```

為了方便起見，這些函式會將目標集合傳回，因此您可以在函式呼叫的相應參數中直接建立它：

```kotlin

fun main() {
    val numbers = listOf("one", "two", "three", "four")

    // filter numbers right into a new hash set, 
    // thus eliminating duplicates in the result
    val result = numbers.mapTo(HashSet()) { it.length }
    println("distinct item lengths are $result")

}
```

具有目標的函式可用於篩選、關聯、分組、扁平化和其他操作。 有關目標操作的完整列表，請參閱 [Kotlin 集合參考](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html)。

## 寫入操作

對於可變集合，還有一些_寫入操作_會更改集合狀態。 此類操作包括新增、移除和更新元素。 寫入操作列在 [寫入操作](collection-write) 以及 [列表特定操作](list-operations#list-write-operations) 和 [Map 特定操作](map-operations#map-write-operations) 的相應章節中。

對於某些操作，有成對的函式用於執行相同的操作：一個函式就地應用該操作，另一個函式將結果作為單獨的集合傳回。 例如，[`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html) 就地對可變集合進行排序，因此其狀態會更改；[`sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html) 建立一個新集合，其中包含排序順序相同的元素。

```kotlin

fun main() {

    val numbers = mutableListOf("one", "two", "three", "four")
    val sortedNumbers = numbers.sorted()
    println(numbers == sortedNumbers)  // false
    numbers.sort()
    println(numbers == sortedNumbers)  // true

}
```