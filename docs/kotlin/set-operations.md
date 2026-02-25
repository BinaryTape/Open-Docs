[//]: # (title: 集合专用操作)

Kotlin 集合包包含了针对集合常用操作的扩展函数：寻找交集、合并或相互减去集合。

要将两个集合合并为一个，请使用 [`union()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/union.html) 函数。它也可以以中缀形式 `a union b` 使用。
请注意，对于有序集合，操作数的顺序很重要。在结果集合中，第一个操作数的元素位于第二个操作数的元素之前：

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")

    // 按顺序输出
    println(numbers union setOf("four", "five"))
    // [one, two, three, four, five]
    println(setOf("four", "five") union numbers)
    // [four, five, one, two, three]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要查找两个集合之间的交集（两个集合中都存在的元素），请使用 [`intersect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/intersect.html) 函数。
要查找不在另一个集合中存在的集合元素，请使用 [`subtract()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/subtract.html) 函数。
这两个函数也可以通过中缀形式调用，例如 `a intersect b`：

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")

    // 相同的输出
    println(numbers intersect setOf("two", "one"))
    // [one, two]
    println(numbers subtract setOf("three", "four"))
    // [one, two]
    println(numbers subtract setOf("four", "three"))
    // [one, two]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要查找存在于两个集合中的任意一个、但不存在于它们交集中的元素，你也可以使用 `union()` 函数。
对于此操作（称为对称差），可以计算两个集合之间的差集并合并结果：

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")
    val numbers2 = setOf("three", "four")

    // 合并差集 
    println((numbers - numbers2) union (numbers2 - numbers))
    // [one, two, four]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你也可以将 `union()`、`intersect()` 和 `subtract()` 函数应用于列表。
然而，它们的结果*始终*是一个 `Set`。在结果中，所有重复元素都会被合并为一个，并且无法使用索引访问：

```kotlin
fun main() {
//sampleStart
    val list1 = listOf(1, 1, 2, 3, 5, 8, -1)
    val list2 = listOf(1, 1, 2, 2, 3, 5)

    // 两个列表取交集的结果是一个 Set
    println(list1 intersect list2)
    // [1, 2, 3, 5]

    // 相等的元素被合并为一个
    println(list1 union list2)
    // [1, 2, 3, 5, 8, -1]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}