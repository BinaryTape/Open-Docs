[//]: # (title: 清單專屬操作)

[`List`](collections-overview.md#list) 是 Kotlin 中最常見的內建集合類型。透過索引存取清單中的元素，提供了一組強大的清單操作。

## 依索引擷取元素

清單支援所有常見的元素擷取操作：`elementAt()`、`first()`、`last()` 以及 [擷取單一元素](collection-elements.md) 中列出的其他操作。對於清單而言，特有的是對元素的索引存取，因此讀取元素最簡單的方式是透過索引擷取。這可以透過傳入索引作為引數的 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) 函數或簡寫 `[index]` 語法來完成。

如果清單大小小於指定索引，則會擲回例外。
有另外兩個函數可以幫助您避免此類例外：

*   [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html) 允許您提供函數，用於計算當索引不在集合中時要傳回的預設值。
*   [`getOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-null.html) 傳回 `null` 作為預設值。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.get(0))
    println(numbers[0])
    //numbers.get(5)                         // exception!
    println(numbers.getOrNull(5))             // null
    println(numbers.getOrElse(5, {it}))        // 5
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 擷取清單部分

除了 [擷取集合部分](collection-parts.md) 的常見操作外，清單還提供了 [`subList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/sub-list.html) 函數，該函數會傳回指定元素範圍的清單視圖。因此，如果原始集合的一個元素發生變更，它也會在先前建立的子清單中變更，反之亦然。

```kotlin

fun main() {
//sampleStart
    val numbers = (0..13).toList()
    println(numbers.subList(3, 6))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 尋找元素位置

### 線性搜尋

在任何清單中，您可以使用 [`indexOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of.html) 和 [`lastIndexOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-index-of.html) 函數來尋找元素的位置。它們會傳回清單中與給定引數相等的元素的第一個和最後一個位置。如果沒有此類元素，這兩個函數都傳回 `-1`。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4, 2, 5)
    println(numbers.indexOf(2))
    println(numbers.lastIndexOf(2))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

還有一對函數接受謂詞 (predicate) 並搜尋符合它的元素：

*   [`indexOfFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-first.html) 傳回符合謂詞的*第一個元素*的索引，如果沒有此類元素則傳回 `-1`。
*   [`indexOfLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-last.html) 傳回符合謂詞的*最後一個元素*的索引，如果沒有此類元素則傳回 `-1`。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    println(numbers.indexOfFirst { it > 2})
    println(numbers.indexOfLast { it % 2 == 1})
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 在已排序清單中進行二分搜尋

還有另一種在清單中搜尋元素的方法 – [二分搜尋](https://en.wikipedia.org/wiki/Binary_search_algorithm)。它的執行速度比其他內建搜尋函數快得多，但*要求清單必須根據某種排序（自然排序或函數參數中提供的其他排序）以[升序](collection-ordering.md)排列*。否則，結果將未定義。

要在已排序清單中搜尋元素，請呼叫 [`binarySearch()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/binary-search.html) 函數並將值作為引數傳入。如果此類元素存在，函數將傳回其索引；否則，它將傳回 `(-insertionPoint - 1)`，其中 `insertionPoint` 是該元素應該插入的索引，以便清單保持排序。如果存在多個具有給定值的元素，搜尋可以傳回它們中的任何一個索引。

您還可以指定要搜尋的索引範圍：在這種情況下，函數僅在兩個提供的索引之間搜尋。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    numbers.sort()
    println(numbers)
    println(numbers.binarySearch("two"))  // 3
    println(numbers.binarySearch("z")) // -5
    println(numbers.binarySearch("two", 0, 2))  // -3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### 比較器二分搜尋

當清單元素不是 `Comparable` 時，您應該提供一個 [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator.html) 以用於二分搜尋。清單必須根據此 `Comparator` 以升序排序。讓我們看一個範例：

```kotlin

data class Product(val name: String, val price: Double)

fun main() {
//sampleStart
    val productList = listOf(
        Product("WebStorm", 49.0),
        Product("AppCode", 99.0),
        Product("DotTrace", 129.0),
        Product("ReSharper", 149.0))

    println(productList.binarySearch(Product("AppCode", 99.0), compareBy<Product> { it.price }.thenBy { it.name }))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

這是一個 `Product` 實例的清單，它們不可比較，並且一個 `Comparator` 定義了排序：如果 `p1` 的價格小於 `p2` 的價格，則產品 `p1` 先於產品 `p2`。因此，在清單根據此順序升序排序的情況下，我們使用 `binarySearch()` 來尋找指定 `Product` 的索引。

自訂比較器在清單使用與自然排序不同的排序時也很有用，例如，`String` 元素的不區分大小寫排序。

```kotlin

fun main() {
//sampleStart
    val colors = listOf("Blue", "green", "ORANGE", "Red", "yellow")
    println(colors.binarySearch("RED", String.CASE_INSENSITIVE_ORDER)) // 3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### 比較二分搜尋

透過*比較*函數進行二分搜尋，無需提供明確的搜尋值即可尋找元素。它接受一個將元素映射到 `Int` 值的比較函數，並搜尋函數傳回零的元素。清單必須根據提供的函數以升序排序；換句話說，比較的傳回值必須從一個清單元素到下一個元素遞增。

```kotlin

import kotlin.math.sign
//sampleStart
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
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

比較器二分搜尋和比較二分搜尋都可以應用於清單範圍。

## 清單寫入操作

除了 [集合寫入操作](collection-write.md) 中描述的集合修改操作外，[可變清單](collections-overview.md#collection-types) 還支援特定的寫入操作。這些操作使用索引來存取元素，以擴展清單修改能力。

### 新增

要將元素新增到清單中的特定位置，請使用 [`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) 和 [`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html)，並提供元素插入的位置作為額外引數。該位置之後的所有元素都將向右移動。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "five", "six")
    numbers.add(1, "two")
    numbers.addAll(2, listOf("three", "four"))
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 更新

清單還提供了一個函數來替換給定位置的元素 - [`set()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/set.html) 及其運算子形式 `[]`。`set()` 不會改變其他元素的索引。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "five", "three")
    numbers[1] =  "two"
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`fill()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fill.html) 簡單地將所有集合元素替換為指定值。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.fill(3)
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 移除

要從清單的特定位置移除元素，請使用 [`removeAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove-at.html) 函數並提供位置作為引數。被移除元素之後的所有元素的索引都將減少一。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4, 3)    
    numbers.removeAt(1)
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 排序

在 [集合排序](collection-ordering.md) 中，我們描述了以特定順序擷取集合元素的操作。對於可變清單，標準函式庫提供類似的擴展函數，可在原地執行相同的排序操作。當您將此類操作應用於清單實例時，它會改變該確切實例中元素的順序。

原地排序函數的名稱與適用於只讀清單的函數名稱相似，但沒有 `ed/d` 字尾：

*   所有排序函數名稱中的 `sort*` 而非 `sorted*`：[`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html)、[`sortDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-descending.html)、[`sortBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-by.html) 等等。
*   [`shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html) 而非 `shuffled()`。
*   [`reverse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reverse.html) 而非 `reversed()`。

對可變清單呼叫 [`asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html) 會傳回另一個可變清單，該清單是原始清單的反向視圖。該視圖中的變更會反映在原始清單中。以下範例顯示了可變清單的排序函數：

```kotlin

fun main() {
//sampleStart
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
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}