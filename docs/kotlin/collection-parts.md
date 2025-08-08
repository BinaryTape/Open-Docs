[//]: # (title: 获取集合部分)

Kotlin 标准库包含了用于获取集合部分内容的扩展函数。这些函数提供了多种方法来为结果集合选择元素：显式列出它们的位置、指定结果大小等等。

## Slice

[`slice()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/slice.html) 返回给定索引的集合元素 List。索引可以作为 [区间](ranges.md) 传递，也可以作为整数值集合传递。

```kotlin

fun main() {
//sampleStart    
    val numbers = listOf("one", "two", "three", "four", "five", "six")    
    println(numbers.slice(1..3))
    println(numbers.slice(0..4 step 2))
    println(numbers.slice(setOf(3, 5, 0)))    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Take and drop

要获取从第一个元素开始的指定数量的元素，请使用 [`take()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take.html) 函数。要获取最后几个元素，请使用 [`takeLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last.html)。当使用大于集合大小的数字调用时，这两个函数都返回整个集合。

要获取除给定数量的首批或末批元素之外的所有元素，请分别调用 [`drop()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop.html) 和 [`dropLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last.html) 函数。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.take(3))
    println(numbers.takeLast(3))
    println(numbers.drop(1))
    println(numbers.dropLast(5))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你也可以使用谓词来定义要选取或丢弃的元素数量。有四个函数与上述函数类似：

* [`takeWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-while.html) 是带谓词的 `take()`：它选取匹配谓词的元素，直到但不包括第一个不匹配谓词的元素。如果第一个集合元素不匹配谓词，则结果为空。
* [`takeLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last-while.html) 类似于 `takeLast()`：它从集合末尾选取匹配谓词的元素区间。该区间中的第一个元素是紧邻最后一个不匹配谓词的元素。如果最后一个集合元素不匹配谓词，则结果为空；
* [`dropWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-while.html) 与使用相同谓词的 `takeWhile()` 函数相反：它返回从第一个不匹配谓词的元素到末尾的所有元素。
* [`dropLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last-while.html) 与使用相同谓词的 `takeLastWhile()` 函数相反：它返回从开头到最后一个不匹配谓词的元素之间的所有元素。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.takeWhile { !it.startsWith('f') })
    println(numbers.takeLastWhile { it != "three" })
    println(numbers.dropWhile { it.length == 3 })
    println(numbers.dropLastWhile { it.contains('i') })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Chunked

要将集合分成给定大小的部分，请使用 [`chunked()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/chunked.html) 函数。`chunked()` 接受一个实参——块的大小——并返回一个给定大小的 `List` 的 `List`。第一个块从第一个元素开始，包含 `size` 个元素；第二个块包含接下来的 `size` 个元素，依此类推。最后一个块的大小可能更小。

```kotlin

fun main() {
//sampleStart
    val numbers = (0..13).toList()
    println(numbers.chunked(3))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你也可以立即对返回的块应用转换。为此，在调用 `chunked()` 时将转换作为 lambda 表达式提供。lambda 实参是集合的一个块。当 `chunked()` 带着转换函数被调用时，这些块是短暂的 `List`，应立即在该 lambda 表达式中消费。

```kotlin

fun main() {
//sampleStart
    val numbers = (0..13).toList() 
    println(numbers.chunked(3) { it.sum() })  // `it` is a chunk of the original collection
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Windowed

你可以获取给定大小的集合元素的所有可能区间。获取它们的函数称为 [`windowed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/windowed.html)：它返回一个元素区间 List，就像你通过给定大小的滑动窗口查看集合时所看到的那样。与 `chunked()` 不同，`windowed()` 返回从 *每个* 集合元素开始的元素区间（*窗口*）。所有窗口都作为单个 `List` 的元素返回。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")    
    println(numbers.windowed(3))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`windowed()` 在带默认值的形参方面提供了更大的灵活性：

* `step` 定义了两个相邻窗口的第一个元素之间的距离。默认值为 1，因此结果包含从所有元素开始的窗口。如果你将步长增加到 2，你将只收到从奇数元素开始的窗口：第一个、第三个，依此类推。
* `partialWindows` 包含从集合末尾元素开始的较小大小的窗口。例如，如果你请求三个元素的窗口，你无法为最后两个元素构建它们。在这种情况下，启用 `partialWindows` 会包含另外两个大小分别为 2 和 1 的 List。

最后，你可以立即对返回的区间应用转换。为此，在调用 `windowed()` 时将转换作为 lambda 表达式提供。

```kotlin

fun main() {
//sampleStart
    val numbers = (1..10).toList()
    println(numbers.windowed(3, step = 2, partialWindows = true))
    println(numbers.windowed(3) { it.sum() })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要构建两个元素的窗口，有一个单独的函数——[`zipWithNext()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip-with-next.html)。它创建接收者集合中相邻元素的对。请注意，`zipWithNext()` 不会将集合分成对；它为除最后一个元素之外的 *每个* 元素创建 `Pair`，因此它在 `[1, 2, 3, 4]` 上的结果是 `[[1, 2], [2, 3], [3, 4]]`，而不是 `[[1, 2], [3, 4]]`。`zipWithNext()` 也可以与转换函数一起调用；它应该将接收者集合的两个元素作为实参。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")    
    println(numbers.zipWithNext())
    println(numbers.zipWithNext() { s1, s2 -> s1.length > s2.length})
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}