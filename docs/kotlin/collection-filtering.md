[//]: # (title: 过滤集合)

过滤是集合处理中最常见的任务之一。
在 Kotlin 中，过滤条件由_谓词 (predicates)_ 定义——它们是接受一个集合元素并返回布尔值的 lambda 函数：`true` 意味着给定元素符合谓词，`false` 则表示不符合。

标准库包含一组扩展函数，可让你通过单次调用来过滤集合。
这些函数不会更改原始集合，因此它们适用于[可变和只读](collections-overview.md#collection-types)集合。要操作过滤结果，你应该将其赋值给一个变量，或者在过滤后链式调用函数。

## 按谓词过滤

基本的过滤函数是 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)。
当使用谓词调用时，`filter()` 会返回符合该谓词的集合元素。
对于 `List` 和 `Set`，结果集合都是 `List`；对于 `Map`，结果集合也是 `Map`。

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

`filter()` 中的谓词只能检查元素的值。
如果你想在过滤时使用元素的位置，请使用 [`filterIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-indexed.html)。
它接受一个带有两个参数的谓词：元素的索引和值。

要根据反向条件过滤集合，请使用 [`filterNot()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-not.html)。
它返回谓词结果为 `false` 的元素列表。

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

*   [`filterIsInstance()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-is-instance.html) 返回
    给定类型的集合元素。当在 `List<Any>` 上调用时，`filterIsInstance<T>()` 返回一个 `List<T>`，从而允许你对其项调用 `T` 类型的方法。

    ```kotlin
    fun main() {
    //sampleStart
        val numbers = listOf(null, 1, "two", 3.0, "four")
        println("All String elements in upper case:")
        numbers.filterIsInstance<String>().forEach {
            println(it.uppercase())
        }
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

*   [`filterNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-not-null.html) 返回所有
    非空元素。当在 `List<T?>` 上调用时，`filterNotNull()` 返回一个 `List<T: Any>`，从而允许你将元素视为非空对象。

    ```kotlin
    fun main() {
    //sampleStart
        val numbers = listOf(null, "one", "two", null)
        numbers.filterNotNull().forEach {
            println(it.length)   // length is unavailable for nullable Strings
        }
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 分区

另一个过滤函数——[`partition()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/partition.html)
——根据谓词过滤集合，并将不匹配的元素保留在单独的列表中。
因此，你将得到一个 `Pair` 类型的 `List` 作为返回值：第一个列表包含符合谓词的元素，第二个列表包含原始集合中的所有其他元素。

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

最后，还有一些函数简单地根据集合元素测试谓词：

*   [`any()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/any.html) 如果至少有一个元素符合给定谓词，则返回 `true`。
*   [`none()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/none.html) 如果所有元素都不符合给定谓词，则返回 `true`。
*   [`all()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/all.html) 如果所有元素都符合给定谓词，则返回 `true`。
    请注意，当对空集合调用 `all()` 并传入任何有效谓词时，它会返回 `true`。这种行为在逻辑学中被称为 _[空泛真理 (vacuous truth)](https://en.wikipedia.org/wiki/Vacuous_truth)_。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    println(numbers.any { it.endsWith("e") })
    println(numbers.none { it.endsWith("a") })
    println(numbers.all { it.endsWith("e") })

    println(emptyList<Int>().all { it > 5 })   // vacuous truth
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`any()` 和 `none()` 也可以在没有谓词的情况下使用：在这种情况下，它们仅检查集合是否为空。
`any()` 在存在元素时返回 `true`，否则返回 `false`；`none()` 则相反。

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