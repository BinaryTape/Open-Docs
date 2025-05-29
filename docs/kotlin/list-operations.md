[//]: # (title: 列表特有操作)

[`List`](collections-overview.md#list) 是 Kotlin 中最流行的内置集合类型。对列表元素进行索引访问，为列表提供了一套强大的操作。

## 通过索引检索元素

列表支持所有常见的元素检索操作：`elementAt()`、`first()`、`last()` 以及 [检索单个元素](collection-elements.md) 中列出的其他操作。
列表的特有之处在于可以通过索引访问元素，因此读取元素最简单的方法就是通过索引检索。
这可以通过传入索引作为参数的 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) 函数或者简写 `[index]` 语法来实现。

如果列表大小小于指定的索引，则会抛出异常。
还有另外两个函数可以帮助你避免此类异常：

* [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html) 允许你提供一个函数来计算默认值，如果集合中不存在该索引，则返回该默认值。
* [`getOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-null.html) 返回 `null` 作为默认值。

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

## 检索列表部分

除了 [检索集合部分](collection-parts.md) 的常见操作之外，列表还提供了 [`subList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/sub-list.html)
函数，该函数返回指定元素范围的视图作为列表。
因此，如果原始集合的某个元素发生更改，它也会在先前创建的子列表中更改，反之亦然。

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

在任何列表中，你都可以使用 [`indexOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of.html) 和 [`lastIndexOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-index-of.html) 函数来查找元素的位置。
它们返回列表中等于给定参数的元素的第一个和最后一个位置。
如果不存在此类元素，两个函数都返回 `-1`。

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

还有一对函数接受谓词并搜索匹配谓词的元素：

* [`indexOfFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-first.html) 返回匹配谓词的*第一个*元素的索引，如果没有此类元素则返回 `-1`。
* [`indexOfLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-last.html) 返回匹配谓词的*最后一个*元素的索引，如果没有此类元素则返回 `-1`。

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

### 有序列表中的二分查找

还有一种在列表中搜索元素的方法——[二分查找](https://en.wikipedia.org/wiki/Binary_search_algorithm)。
它比其他内置搜索函数快得多，但*要求列表根据特定顺序（自然顺序或函数参数中提供的其他顺序）进行 [排序](collection-ordering.md)*
。
否则，结果是未定义的。

要在有序列表中搜索元素，请调用 [`binarySearch()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/binary-search.html)
函数并将值作为参数传入。
如果存在此类元素，函数返回其索引；否则，它返回 `(-insertionPoint - 1)`，其中 `insertionPoint`
是应插入此元素的索引，以便列表保持排序。
如果存在多个具有给定值的元素，则搜索可以返回它们的任何一个索引。

你还可以指定要搜索的索引范围：在这种情况下，函数仅在两个提供的索引之间搜索。

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

#### 比较器二分查找

当列表元素不是 [`Comparable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator.html) 时，你应提供一个比较器用于二分查找。
列表必须根据此 `Comparator` 以升序排序。让我们看一个例子：

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

这里是一个 `Product` 实例列表，它们不是 `Comparable`，并且有一个 `Comparator` 定义了顺序：如果 `p1` 的价格小于 `p2` 的价格，则产品 `p1`
排在产品 `p2` 之前。
因此，在一个根据此顺序升序排序的列表上，我们使用 `binarySearch()` 来查找指定 `Product` 的索引。

当列表使用的顺序与自然顺序不同时，自定义比较器也很方便，例如，`String` 元素的忽略大小写顺序。

```kotlin

fun main() {
//sampleStart
    val colors = listOf("Blue", "green", "ORANGE", "Red", "yellow")
    println(colors.binarySearch("RED", String.CASE_INSENSITIVE_ORDER)) // 3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### 比较函数二分查找

使用*比较*函数进行二分查找，允许你无需提供显式搜索值即可查找元素。
相反，它接受一个将元素映射到 `Int` 值的比较函数，并搜索该函数返回零的元素。
列表必须根据所提供的函数按升序排序；换句话说，比较的返回值必须从一个列表元素到下一个元素递增。

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

比较器二分查找和比较函数二分查找都可以对列表范围执行。

## 列表写入操作

除了 [集合写入操作](collection-write.md) 中描述的集合修改操作之外，[可变](collections-overview.md#collection-types) 列表还支持特定的写入操作。
此类操作使用索引来访问元素，以扩展列表的修改能力。

### 添加

要将元素添加到列表中的特定位置，请使用 [`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html)
和 [`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html)，并提供元素插入位置作为附加参数。
所有位于该位置之后的元素都向右移动。

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

列表还提供了一个函数来替换给定位置的元素 - [`set()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/set.html)
及其运算符形式 `[]`。`set()` 不会改变其他元素的索引。

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

[`fill()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fill.html) 简单地用指定的值替换所有集合元素。

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

要从列表中特定位置移除元素，请使用 [`removeAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove-at.html)
函数，提供位置作为参数。
位于被移除元素之后的所有元素的索引将减一。

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

在 [集合排序](collection-ordering.md) 中，我们描述了以特定顺序检索集合元素的操作。
对于可变列表，标准库提供了类似的扩展函数，它们执行相同的就地排序操作。
当你将此类操作应用于列表实例时，它会更改该实例中元素的顺序。

就地排序函数的名称与应用于只读列表的函数名称相似，但没有 `ed/d` 后缀：

* 所有排序函数名称中的 `sort*` 而不是 `sorted*`：[`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html)、[`sortDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-descending.html)、[`sortBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-by.html) 等。
* [`shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html) 而不是 `shuffled()`。
* [`reverse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reverse.html) 而不是 `reversed()`。

对可变列表调用 [`asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html)
会返回另一个可变列表，它是原始列表的反向视图。该视图中的更改会反映在原始列表中。
以下示例展示了可变列表的排序函数：

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