---
title: 列表專用操作
---
[`List`](collections-overview#list)是 Kotlin 中最常用的內建集合類型。透過索引存取列表中的元素，為列表提供了一組強大的操作。

## 依索引檢索元素

列表支援所有常見的元素檢索操作：`elementAt()`、`first()`、`last()`，以及[檢索單個元素](collection-elements)中列出的其他操作。列表的特殊之處在於可以依索引存取元素，因此讀取元素最簡單的方式是透過索引檢索。這可以透過 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) 函數來完成，
將索引作為參數傳入，或是使用簡寫 `[index]` 語法。

如果列表大小小於指定的索引，則會拋出例外。
還有兩個其他函數可以幫助你避免此類例外：

* [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html) 允許你提供一個函數來計算預設值，以便在集合中不存在索引時傳回。
* [`getOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-null.html) 傳回 `null` 作為預設值。

```kotlin

fun main() {

    val numbers = listOf(1, 2, 3, 4)
    println(numbers.get(0))
    println(numbers[0])
    //numbers.get(5)                         // exception!
    println(numbers.getOrNull(5))             // null
    println(numbers.getOrElse(5, {it}))        // 5

}
```

## 檢索列表部分

除了[檢索集合部分](collection-parts)的常見操作之外，列表還提供 [`subList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/sub-list.html)
函數，該函數傳回作為列表的指定元素範圍的檢視 (view)。
因此，如果原始集合的元素發生變更，則先前建立的子列表也會發生變更，反之亦然。

```kotlin

fun main() {

    val numbers = (0..13).toList()
    println(numbers.subList(3, 6))

}
```

## 尋找元素位置

### 線性搜尋

在任何列表中，你都可以使用函數 [`indexOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of.html) 和 [`lastIndexOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-index-of.html) 尋找元素的位置。
它們傳回列表中等於給定參數的元素的第一個和最後一個位置。
如果沒有這樣的元素，則兩個函數都傳回 `-1`。

```kotlin

fun main() {

    val numbers = listOf(1, 2, 3, 4, 2, 5)
    println(numbers.indexOf(2))
    println(numbers.lastIndexOf(2))

}
```

還有一對函數接受述詞 (predicate) 並搜尋與其匹配的元素：

* [`indexOfFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-first.html) 傳回與述詞匹配的*第一個元素的索引*，如果沒有此類元素，則傳回 `-1`。
* [`indexOfLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-last.html) 傳回與述詞匹配的*最後一個元素的索引*，如果沒有此類元素，則傳回 `-1`。

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 3, 4)
    println(numbers.indexOfFirst { it > 2})
    println(numbers.indexOfLast { it % 2 == 1})

}
```

### 在排序列表中進行二元搜尋

還有一種在列表中搜尋元素的方法——[二元搜尋](https://en.wikipedia.org/wiki/Binary_search_algorithm)。
它的速度比其他內建搜尋函數快得多，但*要求列表根據某種排序（自然排序或函數參數中提供的另一種排序）以遞增順序[排序](collection-ordering)*。
否則，結果未定義。

若要在排序列表中搜尋元素，請呼叫 [`binarySearch()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/binary-search.html)
函數，並將值作為引數傳遞。
如果存在此類元素，則該函數傳回其索引；否則，它傳回 `(-insertionPoint - 1)`，其中 `insertionPoint`
是應插入此元素的索引，以便列表保持排序狀態。
如果有多個具有給定值的元素，則搜尋可以傳回它們中的任何一個索引。

你還可以指定要搜尋的索引範圍：在這種情況下，該函數僅在兩個提供的索引之間搜尋。

```kotlin

fun main() {

    val numbers = mutableListOf("one", "two", "three", "four")
    numbers.sort()
    println(numbers)
    println(numbers.binarySearch("two"))  // 3
    println(numbers.binarySearch("z")) // -5
    println(numbers.binarySearch("two", 0, 2))  // -3

}
```

#### 比較器二元搜尋

當列表元素不是 `Comparable` 時，你應該提供一個 [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator.html) 以在二元搜尋中使用。
該列表必須根據此 `Comparator` 以遞增順序排序。讓我們看一個範例：

```kotlin

data class Product(val name: String, val price: Double)

fun main() {

    val productList = listOf(
        Product("WebStorm", 49.0),
        Product("AppCode", 99.0),
        Product("DotTrace", 129.0),
        Product("ReSharper", 149.0))

    println(productList.binarySearch(Product("AppCode", 99.0), compareBy<Product> { it.price }.thenBy { it.name }))

}
```

這是一個 `Product` 實例的列表，它們不是 `Comparable`，以及一個定義順序的 `Comparator`：如果 `p1` 的價格小於 `p2` 的價格，則產品 `p1`
在產品 `p2` 之前。
因此，有一個根據此順序以遞增方式排序的列表，我們使用 `binarySearch()` 尋找指定 `Product` 的索引。

當列表使用與自然順序不同的順序時，自訂比較器也很方便，例如，`String` 元素的不區分大小寫的順序。

```kotlin

fun main() {

    val colors = listOf("Blue", "green", "ORANGE", "Red", "yellow")
    println(colors.binarySearch("RED", String.CASE_INSENSITIVE_ORDER)) // 3

}
```

#### 比較二元搜尋

具有*比較*函數的二元搜尋允許你尋找元素，而無需提供明確的搜尋值。
相反，它採用一個比較函數，將元素對應到 `Int` 值，並搜尋函數傳回零的元素。
該列表必須根據提供的函數按遞增順序排序；換句話說，
比較的傳回值必須從一個列表元素成長到下一個列表元素。

```kotlin

import kotlin.math.sign

data class Product(val name: String, val price: Double)

fun priceComparison(product: Product, price: Double) = sign(product.price - price).toInt()

fun main() {
    val productList = listOf(
        Product("WebStorm", 49.0),
        Product("AppCode", 99.0),
        Product("DotTrace", 129.0),
        Product("ReSharper", 149.0))

    println(productList.binarySearch { priceComparison(it, 99.0) })
}

```

比較器和比較二元搜尋都可以針對列表範圍執行。

## 列表寫入操作

除了[集合寫入操作](collection-write)中描述的集合修改操作之外，
[可變](collections-overview#collection-types)列表還支援特定的寫入操作。
此類操作使用索引來存取元素，以擴展列表修改功能。

### 新增

若要將元素新增到列表中的特定位置，請使用 [`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html)
和 [`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html)，並提供位置作為
元素插入的額外引數。
位置之後的所有元素都會向右移動。

```kotlin

fun main() {

    val numbers = mutableListOf("one", "five", "six")
    numbers.add(1, "two")
    numbers.addAll(2, listOf("three", "four"))
    println(numbers)

}
```

### 更新

列表還提供了一個函數來取代給定位置的元素 - [`set()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/set.html)
及其運算子形式 `[]`。`set()` 不會變更其他元素的索引。

```kotlin

fun main() {

    val numbers = mutableListOf("one", "five", "three")
    numbers[1] =  "two"
    println(numbers)

}
```

[`fill()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fill.html) 只是將所有集合
元素取代為指定的值。

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.fill(3)
    println(numbers)

}
```

### 移除

若要從列表中移除特定位置的元素，請使用 [`removeAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove-at.html)
函數，並將位置作為引數提供。
移除的元素之後的所有元素的索引將減少 1。

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 3, 4, 3)    
    numbers.removeAt(1)
    println(numbers)

}
```

### 排序

在[集合排序](collection-ordering)中，我們描述了以特定順序檢索集合元素的操作。
對於可變列表，標準函式庫提供了類似的擴充函數，這些函數執行相同的就地排序操作。
當你將此類操作應用於列表實例時，它會變更該實例中元素的順序。

就地排序函數的名稱與應用於唯讀列表的函數的名稱相似，但沒有 `ed/d` 後綴：

*  在所有排序函數的名稱中，`sort*` 代替 `sorted*`：[`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html)、[`sortDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-descending.html)、[`sortBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-by.html) 等。
* [`shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html) 代替 `shuffled()`。
* [`reverse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reverse.html) 代替 `reversed()`。

在可變列表上呼叫的 [`asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html)
傳回另一個可變列表，它是原始列表的反向檢視 (reversed view)。該檢視中的變更會反映在原始列表中。
以下範例顯示了可變列表的排序函數：

```kotlin

fun main() {

    val numbers = mutableListOf("one", "two", "three", "four")

    numbers.sort()
    println("Sort into ascending: $numbers")
    numbers.sortDescending()
    println("Sort into descending: $numbers")

    numbers.sortBy { it.length }
    println("Sort into ascending by length: $numbers")
    numbers.sortByDescending { it.last() }
    println("Sort into descending by the last letter: $numbers")
    
    numbers.sortWith(compareBy<String> { it.length }.thenBy { it })
    println("Sort by Comparator: $numbers")

    numbers.shuffle()
    println("Shuffle: $numbers")

    numbers.reverse()
    println("Reverse: $numbers")

}
```