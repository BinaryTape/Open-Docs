---
title: 列表特定操作
---
[`List`](collections-overview#list) 是 Kotlin 中最流行的内置集合类型。通过索引访问列表元素为列表提供了一组强大的操作。

## 通过索引检索元素

列表支持所有常用的元素检索操作：`elementAt()`、`first()`、`last()` 以及 [检索单个元素](collection-elements) 中列出的其他操作。列表的特殊之处在于可以通过索引访问元素，因此读取元素最简单的方法是通过索引检索。这可以通过 [`get()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/get.html) 函数来实现，该函数将索引作为参数传入，或者使用简写 `[index]` 语法。

如果列表大小小于指定的索引，则会抛出异常。以下两个函数可以帮助你避免此类异常：

* [`getOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-else.html) 允许你提供一个函数来计算默认返回值，如果集合中不存在该索引。
* [`getOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-null.html) 返回 `null` 作为默认值。

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

## 检索列表片段

除了 [检索集合片段](collection-parts) 的常用操作外，列表还提供了 [`subList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/sub-list.html) 函数，该函数将指定元素范围的视图作为列表返回。因此，如果原始集合的元素发生更改，则先前创建的子列表中的元素也会更改，反之亦然。

```kotlin

fun main() {

    val numbers = (0..13).toList()
    println(numbers.subList(3, 6))

}
```

## 查找元素位置

### 线性搜索

在任何列表中，你都可以使用函数 [`indexOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of.html) 和 [`lastIndexOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-index-of.html) 查找元素的位置。它们返回列表中等于给定参数的元素的第一个和最后一个位置。如果不存在此类元素，则两个函数都返回 `-1`。

```kotlin

fun main() {

    val numbers = listOf(1, 2, 3, 4, 2, 5)
    println(numbers.indexOf(2))
    println(numbers.lastIndexOf(2))

}
```

还有一对函数接受一个谓词并搜索匹配的元素：

* [`indexOfFirst()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-first.html) 返回 *第一个* 匹配谓词的元素的索引，如果不存在此类元素，则返回 `-1`。
* [`indexOfLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index-of-last.html) 返回 *最后一个* 匹配谓词的元素的索引，如果不存在此类元素，则返回 `-1`。

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 3, 4)
    println(numbers.indexOfFirst { it > 2})
    println(numbers.indexOfLast { it % 2 == 1})

}
```

### 在排序列表中进行二分查找

还有一种在列表中搜索元素的方法——[二分查找](https://en.wikipedia.org/wiki/Binary_search_algorithm)。它比其他内置搜索函数快得多，但 *要求列表根据特定排序[排序](collection-ordering)*，升序排列：自然排序或函数参数中提供的另一种排序。否则，结果是未定义的。

要在排序列表中搜索元素，请调用 [`binarySearch()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/binary-search.html) 函数，并将该值作为参数传递。如果存在这样的元素，该函数将返回其索引；否则，它将返回 `(-insertionPoint - 1)`，其中 `insertionPoint` 是应插入此元素的索引，以便列表保持排序。如果存在多个具有给定值的元素，则搜索可以返回它们的任何索引。

你还可以指定要搜索的索引范围：在这种情况下，该函数仅在两个提供的索引之间搜索。

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

#### 比较器二分查找

当列表元素不是 `Comparable` 时，你应该提供一个 [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator.html) 以在二分查找中使用。必须根据此 `Comparator` 以升序对列表进行排序。让我们看一个例子：

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

这是一个 `Product` 实例的列表，它们不是 `Comparable`，并且 `Comparator` 定义了顺序：如果 `p1` 的价格低于 `p2` 的价格，则产品 `p1` 在产品 `p2` 之前。因此，有一个根据此顺序升序排序的列表，我们使用 `binarySearch()` 查找指定 `Product` 的索引。

当列表使用与自然顺序不同的顺序时，自定义比较器也很方便，例如，`String` 元素的不区分大小写的顺序。

```kotlin

fun main() {

    val colors = listOf("Blue", "green", "ORANGE", "Red", "yellow")
    println(colors.binarySearch("RED", String.CASE_INSENSITIVE_ORDER)) // 3

}
```

#### 比较二分查找

带有 *比较* 函数的二分查找允许你查找元素而无需提供显式搜索值。相反，它采用一个比较函数，将元素映射到 `Int` 值，并搜索函数返回零的元素。列表必须根据提供的函数按升序排序；换句话说，比较的返回值必须从一个列表元素增长到下一个列表元素。

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

比较器二分查找和比较二分查找都可以针对列表范围执行。

## 列表写入操作

除了 [集合写入操作](collection-write) 中描述的集合修改操作之外，[可变](collections-overview#collection-types) 列表还支持特定的写入操作。这些操作使用索引来访问元素，以扩展列表修改功能。

### 添加

要在列表中的特定位置添加元素，请使用 [`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) 和 [`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html)，并提供元素插入的位置作为附加参数。位置之后的所有元素都向右移动。

```kotlin

fun main() {

    val numbers = mutableListOf("one", "five", "six")
    numbers.add(1, "two")
    numbers.addAll(2, listOf("three", "four"))
    println(numbers)

}
```

### 更新

列表还提供了一个函数来替换给定位置的元素 - [`set()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/set.html) 及其运算符形式 `[]`。`set()` 不会更改其他元素的索引。

```kotlin

fun main() {

    val numbers = mutableListOf("one", "five", "three")
    numbers[1] =  "two"
    println(numbers)

}
```

[`fill()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fill.html) 只是将所有集合元素替换为指定的值。

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.fill(3)
    println(numbers)

}
```

### 移除

要从列表中的特定位置移除元素，请使用 [`removeAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove-at.html) 函数，并将该位置作为参数提供。移除元素后，所有元素的索引都将减一。

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 3, 4, 3)    
    numbers.removeAt(1)
    println(numbers)

}
```

### 排序

在 [集合排序](collection-ordering) 中，我们描述了以特定顺序检索集合元素的操作。对于可变列表，标准库提供了类似的扩展函数，这些函数可以就地执行相同的排序操作。当你将此类操作应用于列表实例时，它会更改该实例中元素的顺序。

就地排序函数的名称与应用于只读列表的函数名称相似，但没有 `ed/d` 后缀：

* 在所有排序函数的名称中，`sort*` 代替 `sorted*`：[`sort()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort.html)、[`sortDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-descending.html)、[`sortBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sort-by.html) 等。
* [`shuffle()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffle.html) 代替 `shuffled()`。
* [`reverse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reverse.html) 代替 `reversed()`。

在可变列表上调用的 [`asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html) 返回另一个可变列表，该列表是原始列表的反向视图。该视图中的更改会反映在原始列表中。以下示例显示了可变列表的排序函数：

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