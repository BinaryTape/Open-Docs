[//]: # (title: 清單特定操作)

[`List`](collections-overview.md#list) 是 Kotlin 中最受歡迎的內建集合類型。清單元素的索引存取為清單提供了一組強大的操作。

## 依索引擷取元素

清單支援所有常見的元素擷取操作：`elementAt()`、`first()`、`last()` 以及[擷取單一元素](collection-elements.md)中列出的其他操作。
清單特有的功能是元素的索引存取，因此讀取元素最簡單的方式是依索引擷取。這可以透過將索引作為引數傳入的 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) 函數，或使用簡寫 `[index]` 語法來完成。

如果清單大小小於指定索引，將會拋出例外。
有另外兩個函數可以幫助您避免此類例外：

*   [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html) 讓您提供計算預設值的函數，以便在索引不在集合中時傳回。
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

除了[擷取集合部分](collection-parts.md)的常見操作外，清單還提供 [`subList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/sub-list.html) 函數，該函數傳回指定元素範圍的視圖作為清單。
因此，如果原始集合的元素發生變化，它也會在先前建立的子清單中發生變化，反之亦然。

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

在任何清單中，您可以使用 [`indexOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of.html) 和 [`lastIndexOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-index-of.html) 函數來尋找元素的位置。
它們傳回清單中與給定引數相等的元素的第一個和最後一個位置。
如果沒有此類元素，兩個函數都傳回 `-1`。

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

還有一對函數接受一個述詞並搜尋匹配的元素：

*   [`indexOfFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-first.html) 傳回匹配述詞的**第一個**元素的索引，如果沒有此類元素則為 `-1`。
*   [`indexOfLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-last.html) 傳回匹配述詞的**最後一個**元素的索引，如果沒有此類元素則為 `-1`。

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

### 已排序清單中的二分搜尋

還有一種在清單中搜尋元素的方法——[二分搜尋](https://en.wikipedia.org/wiki/Binary_search_algorithm)。
它比其他內建搜尋函數快得多，但**要求清單按照某種排序（自然排序或函數參數中提供的另一種排序）以[升序](collection-ordering.md)排列**。
否則，結果是未定義的。

要在已排序清單中搜尋元素，請呼叫 [`binarySearch()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/binary-search.html) 函數並將值作為引數傳入。
如果存在此類元素，函數將傳回其索引；否則，它會傳回 `(-insertionPoint - 1)`，其中 `insertionPoint` 是此元素應插入以使清單保持排序的索引。
如果有多個具有給定值的元素，搜尋可以傳回其中任何一個的索引。

您還可以指定要搜尋的索引範圍：在這種情況下，函數只會在兩個提供的索引之間搜尋。

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

當清單元素不可 [`Comparable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator.html) 時，您應該提供一個 `Comparator` 以用於二分搜尋。
清單必須根據此 `Comparator` 以升序排序。我們來看一個範例：

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

這裡是一個 `Product` 實例的清單，它們不可 `Comparable`，以及一個定義順序的 `Comparator`：如果 `p1` 的價格小於 `p2` 的價格，則 product `p1` 優先於 product `p2`。
因此，在根據此順序升序排序的清單中，我們使用 `binarySearch()` 來尋找指定 `Product` 的索引。

當清單使用不同於自然排序的順序時，自訂比較器也很方便，例如，字串元素的不區分大小寫排序。

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

使用_比較_函數的二分搜尋讓您無需提供明確的搜尋值即可尋找元素。
相反，它接受一個將元素映射到 `Int` 值的比較函數，並搜尋函數傳回零的元素。
清單必須根據提供的函數以升序排序；換句話說，比較的傳回值必須從一個清單元素增長到下一個。

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

比較器二分搜尋和比較二分搜尋都可以對清單範圍執行。

## 清單寫入操作

除了[集合寫入操作](collection-write.md)中描述的集合修改操作外，[可變的](collections-overview.md#collection-types)清單還支援特定的寫入操作。
此類操作使用索引來存取元素，以擴展清單修改能力。

### 新增

要在清單中的特定位置新增元素，請使用 [`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) 和 [`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html) 並將元素插入位置作為附加引數提供。
位置之後的所有元素都向右移動。

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

清單也提供一個函數來替換給定位置的元素 - [`set()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/set.html) 及其運算子形式 `[]`。`set()` 不會改變其他元素的索引。

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

[`fill()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fill.html) 簡單地用指定值替換所有集合元素。

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

要從清單中的特定位置移除元素，請使用 [`removeAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove-at.html) 函數並將位置作為引數提供。
被移除元素之後的所有元素的索引都將減一。

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

在 [集合排序](collection-ordering.md)中，我們描述了以特定順序擷取集合元素的操作。
對於可變清單，標準函式庫提供類似的擴展函數，這些函數執行相同的原地排序操作。
當您將此類操作應用於清單實例時，它會更改該確切實例中元素的順序。

原地排序函數的名稱與適用於唯讀清單的函數名稱相似，但沒有 `ed/d` 後綴：

*   `sort*` 而非所有排序函數名稱中的 `sorted*`：[`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html)、[`sortDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-descending.html)、[`sortBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-by.html) 等等。
*   [`shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html) 而非 `shuffled()`。
*   [`reverse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reverse.html) 而非 `reversed()`。

在可變清單上呼叫的 [`asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html) 傳回另一個可變清單，它是原始清單的反向視圖。該視圖中的更改會反映在原始清單中。
以下範例顯示可變清單的排序函數：

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")

    numbers.sort()
    println("升序排序: $numbers")
    numbers.sortDescending()
    println("降序排序: $numbers")

    numbers.sortBy { it.length }
    println("依長度升序排序: $numbers")
    numbers.sortByDescending { it.last() }
    println("依最後一個字母降序排序: $numbers")
    
    numbers.sortWith(compareBy<String> { it.length }.thenBy { it })
    println("依比較器排序: $numbers")

    numbers.shuffle()
    println("打亂: $numbers")

    numbers.reverse()
    println("反轉: $numbers")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}