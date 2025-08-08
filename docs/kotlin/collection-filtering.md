[//]: # (title: 过滤集合)

过滤是集合处理中最常见的任务之一。
在 Kotlin 中，过滤条件由 _谓词_ 定义——即 lambda 表达式，它接收一个集合元素并返回一个布尔值：`true` 表示给定元素符合谓词，`false` 则表示不符合。

标准库包含一组扩展函数，让你能够通过一次调用来过滤集合。
这些函数不会改变原始集合，因此它们可用于[可变集合和只读集合](collections-overview.md#collection-types)。要操作过滤结果，你应该将其赋值给一个变量，或者在过滤后链式调用其他函数。

## 按谓词过滤

基本的过滤函数是 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)。
当使用谓词调用时，`filter()` 会返回符合该谓词的集合元素。
对于 `List` 和 `Set`，结果集合是 `List`；对于 `Map`，结果也是一个 `Map`。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")  
    val longerThan3 = numbers.filter { it.length > 3 }
    println(longerThan3)

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredMap = numbersMap.filter { (key, value) -> key.endsWith("1") && value > 10}
    println(filteredMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`filter()` 中的谓词只能检测元素的值。
如果你想在过滤中使用元素位置，请使用 [`filterIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-indexed.html)。
它接收一个带有两个实参的谓词：索引和元素的值。

要按负面条件过滤集合，请使用 [`filterNot()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-not.html)。
它会返回一个列表，其中包含谓词结果为 `false` 的元素。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    
    val filteredIdx = numbers.filterIndexed { index, s -> (index != 0) && (s.length < 5)  }
    val filteredNot = numbers.filterNot { it.length <= 3 }

    println(filteredIdx)
    println(filteredNot)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

还有一些函数通过过滤给定类型的元素来缩小元素类型：

*   [`filterIsInstance()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-is-instance.html) 返回给定类型的集合元素。当对 `List<Any>` 调用时，`filterIsInstance<T>()` 返回一个 `List<T>`，从而允许你对其中的项调用 `T` 类型的功能。

    ```kotlin
    fun main() {
    //sampleStart
        val numbers = listOf(null, 1, "two", 3.0, "four")
        println("所有 String 元素均大写：")
        numbers.filterIsInstance<String>().forEach {
            println(it.uppercase())
        }
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

*   [`filterNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-not-null.html) 返回所有非空的元素。当对 `List<T?>` 调用时，`filterNotNull()` 返回一个 `List<T: Any>`，从而允许你将元素视为非空对象。

    ```kotlin
    fun main() {
    //sampleStart
        val numbers = listOf(null, "one", "two", null)
        numbers.filterNotNull().forEach {
            println(it.length)   // 可空 String 不提供 length
        }
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 分区

另一个过滤函数——[`partition()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/partition.html)——通过谓词过滤集合，并将不符合该谓词的元素保留在单独的列表中。
因此，你将得到一个 `List` 的 `Pair` 作为返回值：第一个 `List` 包含符合谓词的元素，第二个 `List` 包含原始集合中所有其他元素。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val (match, rest) = numbers.partition { it.length > 3 }

    println(match)
    println(rest)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 测试谓词

最后，还有一些函数可以简单地针对集合元素测试谓词：

*   [`any()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/any.html) 在至少一个元素符合给定谓词时返回 `true`。
*   [`none()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/none.html) 在没有元素符合给定谓词时返回 `true`。
*   [`all()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/all.html) 在所有元素都符合给定谓词时返回 `true`。
    请注意，当对空集合使用任何有效谓词调用 `all()` 时，它会返回 `true`。这种行为在逻辑中被称为 _[空泛真理](https://en.wikipedia.org/wiki/Vacuous_truth)_。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    println(numbers.any { it.endsWith("e") })
    println(numbers.none { it.endsWith("a") })
    println(numbers.all { it.endsWith("e") })

    println(emptyList<Int>().all { it > 5 })   // 空泛真理
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`any()` 和 `none()` 也可以在没有谓词的情况下使用：在这种情况下，它们只是检测集合是否为空。
`any()` 在有元素时返回 `true`，否则返回 `false`；`none()` 则相反。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val empty = emptyList<String>()

    println(numbers.any())
    println(empty.any())
    
    println(numbers.none())
    println(empty.none())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}