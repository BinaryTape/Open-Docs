[//]: # (title: List 特有的操作)

[`List`](collections-overview.md#list) 是 Kotlin 内置集合中最常用的类型。通过索引访问 list 元素为 list 提供了强大的操作集合。

## 按索引检索元素

List 支持所有常见的元素检索操作：`elementAt()`、`first()`、`last()` 以及 [检索单个元素](collection-elements.md) 中列出的其他操作。List 的特有之处在于通过索引访问元素，因此读取元素最简单的方式是按索引检索。这通过传入索引作为实参的 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) 函数或简写 `[index]` 语法来完成。

如果 list 大小小于指定索引，则会抛出异常。还有两个函数可以帮助你避免此类异常：

*   [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html) 允许你提供一个函数来计算默认值，以便在集合中不存在该索引时返回。
*   [`getOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-null.html) 返回 `null` 作为默认值。

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

## 检索 list 部分

除了 [检索集合部分](collection-parts.md) 的常见操作之外，list 还提供了 [`subList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/sub-list.html) 函数，该函数以 list 的形式返回指定元素区间的一个视图。因此，如果原始集合的一个元素发生更改，它也会在之前创建的子 list 中更改，反之亦然。

```kotlin

fun main() {
//sampleStart
    val numbers = (0..13).toList()
    println(numbers.subList(3, 6))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 查找元素位置

### 线性搜索

在任何 list 中，你都可以使用 `indexOf()` 和 `lastIndexOf()` 函数查找元素的位置。它们返回 list 中等于给定实参的元素的第一个和最后一个位置。如果没有此类元素，两个函数都返回 `-1`。

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

还有一对函数接受一个谓词并搜索与之匹配的元素：

*   [`indexOfFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-first.html) 返回与谓词匹配的*第一个*元素的索引，如果没有此类元素则返回 `-1`。
*   [`indexOfLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-last.html) 返回与谓词匹配的*最后一个*元素的索引，如果没有此类元素则返回 `-1`。

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

### 在已排序 list 中进行二分搜索

还有一种在 list 中搜索元素的方法 – [二分搜索](https://en.wikipedia.org/wiki/Binary_search_algorithm)。它比其他内置搜索函数快得多，但*要求 list 按某种顺序（自然顺序或函数形参中提供的其他顺序）升序 [排序](collection-ordering.md)*。否则，结果是未定义的。

要在已排序 list 中搜索元素，请调用 `binarySearch()` 函数，并将值作为实参传入。如果存在此类元素，该函数将返回其索引；否则，它返回 `(-insertionPoint - 1)`，其中 `insertionPoint` 是应插入此元素的索引，以便 list 保持排序状态。如果存在多个具有给定值的元素，则搜索可以返回其中任何一个的索引。

你还可以指定要搜索的索引区间：在这种情况下，该函数仅在两个提供的索引之间进行搜索。

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

#### Comparator 二分搜索

当 list 元素不是 `Comparable` 时，你应提供一个 `Comparator` 以用于二分搜索。list 必须按照此 `Comparator` 升序排序。让我们看一个示例：

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

这是一个 `Product` 实例的 list，它们不是 `Comparable`，以及一个定义了顺序的 `Comparator`：如果 `p1` 的价格低于 `p2` 的价格，则产品 `p1` 先于产品 `p2`。因此，在 list 按照此顺序升序排序的情况下，我们使用 `binarySearch()` 来查找指定 `Product` 的索引。

当 list 使用与自然顺序不同的顺序时，例如 `String` 元素的忽略大小写顺序时，自定义 comparator 也很有用。

```kotlin

fun main() {
//sampleStart
    val colors = listOf("Blue", "green", "ORANGE", "Red", "yellow")
    println(colors.binarySearch("RED", String.CASE_INSENSITIVE_ORDER)) // 3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### 比较函数二分搜索

带有*比较*函数的二分搜索允许你查找元素，而无需提供显式搜索值。相反，它接受一个将元素映射到 `Int` 值的比较函数，并搜索该函数返回零的元素。list 必须按照提供的函数升序排序；换句话说，比较的返回值必须从一个 list 元素到下一个元素逐渐增大。

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

Comparator 和比较函数二分搜索都可以在 list 区间上执行。

## List 写入操作

除了 [集合写入操作](collection-write.md) 中描述的集合修改操作之外，[可变](collections-overview.md#collection-types) list 还支持特定的写入操作。此类操作使用索引访问元素，以拓宽 list 修改功能。

### 添加

要将元素添加到 list 中的特定位置，请使用 `add()` 和 `addAll()`，并将元素插入位置作为额外实参提供。位置之后的所有元素都会向右移动。

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

List 还提供了一个函数来替换给定位置的元素 - `set()` 及其操作符形式 `[]`。`set()` 不会改变其他元素的索引。

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

[`fill()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fill.html) 简单地用指定值替换所有集合元素。

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

要从 list 中移除特定位置的元素，请使用 `removeAt()` 函数，并将位置作为实参提供。被移除元素之后的所有元素的索引将减少一。

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

在 [集合排序](collection-ordering.md) 中，我们描述了按特定顺序检索集合元素的操作。对于可变 list，标准库提供了类似的扩展函数，它们执行相同的就地排序操作。当你将此类操作应用于 list 实例时，它会更改该实例中元素的顺序。

就地排序函数的名称与应用于只读 list 的函数相似，但没有 `ed/d` 后缀：

*   所有排序函数名称中都使用 `sort*` 而不是 `sorted*`：[`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html)、[`sortDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-descending.html)、[`sortBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-by.html) 等等。
*   [`shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html) 而不是 `shuffled()`。
*   [`reverse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reverse.html) 而不是 `reversed()`。

在可变 list 上调用的 [`asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html) 返回另一个可变 list，它是原始 list 的反向视图。该视图中的更改会反映在原始 list 中。以下示例展示了可变 list 的排序函数：

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