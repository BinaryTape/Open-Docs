[//]: # (title: List 特有操作)

[`List`](collections-overview.md#list) 是 Kotlin 中最常用的内置集合类型。通过索引访问列表元素为列表提供了一套强大的操作。

## 通过索引检索元素

List 支持所有常见的元素检索操作：`elementAt()`、`first()`、`last()` 以及 [检索单个元素](collection-elements.md) 中列出的其他操作。
List 的特性在于可以通过索引访问元素，因此读取元素最简单的方法是通过索引检索它。
这可以通过 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) 函数（将索引作为实参传递）或简写的 `[index]` 语法来完成。

如果列表大小小于指定的索引，则会抛出异常。
还有另外两个函数可以帮助您避免此类异常：

* [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html) 允许您提供一个函数，用于在集合中不存在该索引时计算要返回的默认值。
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

除了 [检索集合部分](collection-parts.md) 的常用操作外，列表还提供了 [`subList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/sub-list.html) 函数，该函数以列表形式返回指定元素范围的视图。
因此，如果原始集合的元素发生变化，之前创建的子列表中的元素也会随之变化，反之亦然。

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

在任何列表中，您都可以使用 [`indexOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of.html) 和 [`lastIndexOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-index-of.html) 函数查找元素的位置。
它们返回列表中与给定实参相等的元素的第一个和最后一个位置。
如果没有这样的元素，这两个函数都会返回 `-1`。

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

还有一对接收谓词并搜索与之匹配的元素的函数：

* [`indexOfFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-first.html) 返回与谓词匹配的 *第一个元素* 的索引，如果没有这样的元素则返回 `-1`。
* [`indexOfLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-last.html) 返回与谓词匹配的 *最后一个元素* 的索引，如果没有这样的元素则返回 `-1`。

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

### 在已排序列表中进行二分搜索

还有一种在列表中搜索元素的方法——[二分搜索](https://en.wikipedia.org/wiki/Binary_search_algorithm)。
它的运行速度明显快于其他内置搜索函数，但 *要求列表按照某种顺序（自然顺序或函数参数中提供的另一种顺序）升序 [排序](collection-ordering.md)*。
否则，结果将是未定义的。

要在已排序列表中搜索元素，请调用 [`binarySearch()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/binary-search.html) 函数，并将值作为实参传递。
如果该元素存在，函数返回其索引；否则，它返回 `(-insertionPoint - 1)`，其中 `insertionPoint` 是为了保持列表有序而应插入该元素的索引。
如果有多个元素具有给定值，则搜索可以返回其中任何一个元素的索引。

您还可以指定要搜索的索引范围：在这种情况下，函数仅在提供的两个索引之间进行搜索。

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

#### 使用 Comparator 进行二分搜索

当列表元素不是 `Comparable` 时，您应该提供一个在二分搜索中使用的 [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/)。
列表必须根据此 `Comparator` 按升序排序。让我们看一个例子：

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

这里有一个 `Product` 实例列表（它们不是 `Comparable`）和一个定义顺序的 `Comparator`：如果产品 `p1` 的价格低于产品 `p2` 的价格，则 `p1` 排在 `p2` 之前。
因此，在拥有一个根据此顺序升序排序的列表后，我们使用 `binarySearch()` 来查找指定 `Product` 的索引。

当列表使用与自然顺序不同的顺序时（例如，`String` 元素的忽略大小写顺序），自定义比较器也非常方便。

```kotlin

fun main() {
//sampleStart
    val colors = listOf("Blue", "green", "ORANGE", "Red", "yellow")
    println(colors.binarySearch("RED", String.CASE_INSENSITIVE_ORDER)) // 3
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

#### 使用比较函数进行二分搜索

使用 *比较* 函数的二分搜索允许您在不提供显式搜索值的情况下查找元素。
相反，它接收一个将元素映射到 `Int` 值的比较函数，并搜索函数返回零的元素。
列表必须根据提供的函数按升序排序；换句话说，比较的返回值必须从列表的一个元素到下一个元素递增。

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

基于比较器和比较函数的二分搜索也可以针对列表范围执行。

## List 写入操作

除了 [集合写入操作](collection-write.md) 中描述的集合修改操作外，[可变](collections-overview.md#collection-types) 列表还支持特定的写入操作。
此类操作使用索引访问元素，从而扩展了列表修改功能。

### 添加

要将元素添加到列表中的特定位置，请使用 [`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) 和 [`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html)，并将元素插入位置作为额外实参提供。
该位置之后的所有元素都会向右移动。

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

列表还提供了一个函数来替换给定位置的元素 - [`set()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/set.html) 及其运算符形式 `[]`。`set()` 不会改变其他元素的索引。

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

[`fill()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fill.html) 简单地将所有集合元素替换为指定的值。

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

### 删除

要从列表中的特定位置删除元素，请使用 [`removeAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove-at.html) 函数，并将位置作为实参提供。
被删除元素之后的所有元素的索引都将减 1。

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
对于可变列表，标准库提供了类似的扩展函数，可以在原地执行相同的排序操作。
当您对列表实例应用此类操作时，它会改变该特定实例中的元素顺序。

原地排序函数的名称与适用于只读列表的函数名称类似，但没有 `ed/d` 后缀：

* 所有排序函数名称中的 `sort*` 而不是 `sorted*`：[`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html)、[`sortDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-descending.html)、[`sortBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-by.html) 等。
* [`shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html) 而不是 `shuffled()`。
* [`reverse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reverse.html) 而不是 `reversed()`。

对可变列表调用的 [`asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html) 返回另一个可变列表，该列表是原始列表的反转视图。该视图中的更改会反映在原始列表中。
以下示例显示了可变列表的排序函数：

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