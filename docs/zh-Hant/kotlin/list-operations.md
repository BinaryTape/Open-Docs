[//]: # (title: List 專屬操作)

[`List`](collections-overview.md#list) 是 Kotlin 中最受歡迎的內建集合類型。透過索引存取 List 中的元素，為 List 提供了強大的操作功能。

## 透過索引檢索元素

List 支援所有常見的元素檢索操作：`elementAt()`、`first()`、`last()` 以及[檢索單一元素](collection-elements.md)中列出的其他操作。
對於 List 來說，其特點在於對元素的索引存取，因此讀取元素最簡單的方法是透過索引檢索。
這可以透過 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) 函式（將索引作為引數傳遞）或簡寫的 `[index]` 語法（使用方括號）來完成。

如果 List 大小小於指定的索引，將會拋出例外。
還有另外兩個函式可以幫助您避免此類例外：

* [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html) 讓您提供一個函式，用於在集合中不存在該索引時計算並傳回預設值。
* [`getOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-null.html) 傳回 `null` 作為預設值。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.get(0))
    println(numbers[0])
    //numbers.get(5)                         // 例外！
    println(numbers.getOrNull(5))             // null
    println(numbers.getOrElse(5, {it}))        // 5
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 檢索 List 部分內容

除了[檢索集合部分](collection-parts.md)的常見操作外，List 還提供了 [`subList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/sub-list.html)
函式，該函式會將指定元素範圍以 List 形式傳回一個檢視。
因此，如果原始集合的元素發生變化，先前建立的 sublist 也會隨之改變，反之亦然。

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

在任何 List 中，您都可以使用 [`indexOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of.html) 和 [`lastIndexOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-index-of.html) 函式來尋找元素的位置。
它們會傳回 List 中與給定引數相等之元素的第一個和最後一個位置。
如果不存在此類元素，這兩個函式都會傳回 `-1`。

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

還有一對函式接受一個述句（predicate）並搜尋符合該述句的元素：

* [`indexOfFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-first.html) 傳回符合述句的*第一個元素的索引*，如果不存在此類元素則傳回 `-1`。
* [`indexOfLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-last.html) 傳回符合述句的*最後一個元素的索引*，如果不存在此類元素則傳回 `-1`。

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

### 已排序 List 中的二分搜尋

在 List 中搜尋元素還有另一種方法 —— [二分搜尋](https://en.wikipedia.org/wiki/Binary_search_algorithm)。
它的執行速度顯著快於其他內建搜尋函式，但*要求 List 必須根據某種排序（自然排序或函式參數中提供的其他排序）以遞增順序[排序](collection-ordering.md)*。
否則，結果是未定義的。

要在已排序的 List 中搜尋元素，請呼叫 [`binarySearch()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/binary-search.html)
函式並將值作為引數傳遞。
如果該元素存在，函式會傳回其索引；否則，它會傳回 `(-insertionPoint - 1)`，其中 `insertionPoint`
是為了保持 List 排序而應插入該元素的索引。
如果存在多個具有指定值的元素，搜尋可能會傳回其中任何一個的索引。

您也可以指定要搜尋的索引範圍：在這種情況下，函式僅在提供的兩個索引之間進行搜尋。

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

#### Comparator 二分搜尋

當 List 元素不具備 `Comparable` 特性時，您應該提供一個 [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/) 用於二分搜尋。
List 必須根據此 `Comparator` 以遞增順序排序。讓我們看一個範例：

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

這是一個不具備 `Comparable` 特性的 `Product` 執行個體列表，以及一個定義順序的 `Comparator`：如果產品 `p1`
的價格低於 `p2` 的價格，則 `p1` 先於 `p2`。
因此，在擁有一個根據此順序遞增排序的 List 後，我們使用 `binarySearch()` 來尋找指定 `Product` 的索引。

當 List 使用與自然排序不同的順序時，自訂 Comparator 也非常方便，例如 `String` 元素的不區分大小寫排序。

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

透過 *比較 (comparison)* 函式進行二分搜尋，讓您無需提供明確的搜尋值即可尋找元素。
相反地，它接受一個將元素對應到 `Int` 值的比較函式，並搜尋該函式傳回零的元素。
List 必須根據提供的函式以遞增順序排序；換句話說，比較的傳回值必須隨著 List 元素的增加而成長。

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

Comparator 和比較二分搜尋也都可以針對 List 範圍執行。

## List 寫入操作

除了[集合寫入操作](collection-write.md)中描述的集合修改操作外，[可變](collections-overview.md#collection-types) List 還支援特定的寫入操作。
此類操作使用索引存取元素，以擴充 List 的修改能力。

### 新增

要將元素新增到 List 中的特定位置，請使用 [`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html)
和 [`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html)，並提供元素插入的位置作為額外引數。
該位置之後的所有元素都會向右移動。

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

List 還提供了一個用於取代給定位置元素的函式 —— [`set()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/set.html)
及其運算子形式 `[]`。`set()` 不會改變其他元素的索引。

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

[`fill()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fill.html) 只是將集合中的所有元素替換為指定的值。

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

要從 List 中移除特定位置的元素，請使用 [`removeAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove-at.html)
函式並將位置作為引數傳遞。
被移除元素之後的所有元素索引都將減 1。

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

在[集合排序](collection-ordering.md)中，我們描述了以特定順序檢索集合元素的作業。
對於可變 List，標準函式庫提供了類似的擴充函式，可以原地（in-place）執行相同的排序操作。
當您對 List 執行個體套用此類操作時，它會更改該執行個體中的元素順序。

原地排序函式的名稱與適用於唯讀 List 的函式名稱相似，但沒有 `ed/d` 字尾：

* 所有排序函式名稱中均為 `sort*` 而非 `sorted*`：[`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html)、[`sortDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-descending.html)、[`sortBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-by.html) 等。
* [`shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html) 而非 `shuffled()`。
* [`reverse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reverse.html) 而非 `reversed()`。

在可變 List 上呼叫 [`asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html) 會傳回另一個可變 List，它是原始 List 的反轉檢視。該檢視中的更改會反映在原始 List 中。
以下範例顯示了可變 List 的排序函式：

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