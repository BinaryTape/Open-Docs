---
title: 获取集合的部分内容
---

Kotlin 标准库包含用于获取集合部分内容的扩展函数。
这些函数提供了多种方式来选择结果集合中的元素：明确列出它们的位置、
指定结果大小等等。

## 切片

[`slice()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/slice.html) 返回具有给定索引的集合
元素列表。索引可以作为[区间](ranges)传递，也可以作为整数值的集合传递。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five", "six")    
    println(numbers.slice(1..3))
    println(numbers.slice(0..4 step 2))
    println(numbers.slice(setOf(3, 5, 0)))    

}
```

## 取和舍

要获取从第一个元素开始的指定数量的元素，请使用 [`take()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take.html) 函数。
要获取最后的元素，请使用 [`takeLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last.html)。
当传入的数字大于集合大小时，这两个函数都会返回整个集合。

要获取除了给定数量的第一个或最后元素之外的所有元素，请分别调用 [`drop()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop.html)
和 [`dropLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last.html) 函数。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.take(3))
    println(numbers.takeLast(3))
    println(numbers.drop(1))
    println(numbers.dropLast(5))

}
```

你还可以使用谓词来定义要获取或舍弃的元素数量。
有四个函数类似于上面描述的函数：

* [`takeWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-while.html) 是带有谓词的 `take()`：它获取元素直到但不包括第一个不匹配谓词的元素。如果第一个集合元素不匹配谓词，则结果为空。
* [`takeLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last-while.html) 类似于 `takeLast()`：它从集合末尾获取匹配谓词的元素范围。该范围的第一个元素是最后一个不匹配谓词的元素的下一个元素。如果最后一个集合元素不匹配谓词，则结果为空。
* [`dropWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-while.html) 与具有相同谓词的 `takeWhile()` 相反：它返回从第一个不匹配谓词的元素到末尾的元素。
* [`dropLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last-while.html) 与具有相同谓词的 `takeLastWhile()` 相反：它返回从开头到最后一个不匹配谓词的元素的元素。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.takeWhile { !it.startsWith('f') })
    println(numbers.takeLastWhile { it != "three" })
    println(numbers.dropWhile { it.length == 3 })
    println(numbers.dropLastWhile { it.contains('i') })

}
```

## 分块

要将集合分成给定大小的部分，请使用 [`chunked()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/chunked.html) 函数。
`chunked()` 接受一个参数——块的大小——并返回给定大小的 `List` 的 `List`。
第一个块从第一个元素开始，包含 `size` 个元素，第二个块包含接下来的 `size` 个元素，
以此类推。最后一个块的大小可能较小。

```kotlin

fun main() {

    val numbers = (0..13).toList()
    println(numbers.chunked(3))

}
```

你还可以立即对返回的块应用转换。
为此，在调用 `chunked()` 时提供一个 lambda 函数作为转换。
lambda 参数是集合的一个块。当使用转换调用 `chunked()` 时，
这些块是短暂存在的 `List`，应该在该 lambda 中直接使用。

```kotlin

fun main() {

    val numbers = (0..13).toList() 
    println(numbers.chunked(3) { it.sum() })  // `it` 是原始集合的一个块

}
```

## 窗口化

你可以获取给定大小的所有可能的集合元素范围。
获取它们的函数称为 [`windowed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/windowed.html)：
它返回一个元素范围列表，就像你通过给定大小的滑动窗口查看集合一样。
与 `chunked()` 不同，`windowed()` 返回从*每个*集合元素开始的元素范围（_窗口_）。
所有窗口都作为单个 `List` 的元素返回。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five")    
    println(numbers.windowed(3))

}
```

`windowed()` 通过可选参数提供更大的灵活性：

* `step` 定义了两个相邻窗口第一个元素之间的距离。默认值为 1，因此结果包含从所有元素开始的窗口。如果将步长增加到 2，你将只收到从奇数元素开始的窗口：第一个、第三个等等。
* `partialWindows` 包括从集合末尾元素开始的较小大小的窗口。例如，如果你请求三个元素的窗口，你无法为最后两个元素构建它们。在这种情况下，启用 `partialWindows` 会额外包含两个大小分别为 2 和 1 的列表。

最后，你可以立即对返回的范围应用转换。
为此，在调用 `windowed()` 时提供一个 lambda 函数作为转换。

```kotlin

fun main() {

    val numbers = (1..10).toList()
    println(numbers.windowed(3, step = 2, partialWindows = true))
    println(numbers.windowed(3) { it.sum() })

}
```

要构建两个元素的窗口，有一个单独的函数 —— [`zipWithNext()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip-with-next.html)。
它创建接收者集合中相邻元素的对。
请注意，`zipWithNext()` 不会将集合分成对；它为除最后一个元素外的_每个_元素创建一个 `Pair`，
因此它在 `[1, 2, 3, 4]` 上的结果是 `[[1, 2], [2, 3], [3, 4]]`，而不是 `[[1, 2], [3, 4]]`。
`zipWithNext()` 也可以与转换函数一起调用；该函数应该接受接收者集合的两个元素作为参数。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five")    
    println(numbers.zipWithNext())
    println(numbers.zipWithNext() { s1, s2 -> s1.length > s2.length})

}
```