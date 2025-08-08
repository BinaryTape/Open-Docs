[//]: # (title: Set 特有操作)

Kotlin 集合包包含了针对 Set 的常用操作的扩展函数：查找交集、合并或互相减去集合。

要将两个集合合并为一个，请使用 [`union()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/union.html) 函数。它可以用 `a union b` 这样的中缀形式调用。
请注意，对于有序集合，操作数的顺序很重要。在结果集合中，第一个操作数的元素位于第二个操作数的元素之前：

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")

    // output according to the order
    println(numbers union setOf("four", "five"))
    // [one, two, three, four, five]
    println(setOf("four", "five") union numbers)
    // [four, five, one, two, three]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要查找两个集合之间的交集（同时存在于两者中的元素），请使用 [`intersect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/intersect.html) 函数。
要查找不存在于另一个集合中的集合元素，请使用 [`subtract()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/subtract.html) 函数。
这两个函数也可以用中缀形式调用，例如 `a intersect b`：

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")

    // same output
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

要查找存在于两个集合中任一个但不同时存在于两者交集中的元素，你也可以使用 `union()` 函数。
对于此操作（称为对称差），请计算两个集合之间的差异并合并结果：

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")
    val numbers2 = setOf("three", "four")

    // merge differences 
    println((numbers - numbers2) union (numbers2 - numbers))
    // [one, two, four]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你也可以将 `union()`、`intersect()` 和 `subtract()` 函数应用于 `List`。
然而，它们的结果_总是_一个 `Set`。在此结果中，所有重复元素都合并为一个，并且索引访问不可用：

```kotlin
fun main() {
//sampleStart
    val list1 = listOf(1, 1, 2, 3, 5, 8, -1)
    val list2 = listOf(1, 1, 2, 2, 3, 5)

    // result of intersecting two lists is a Set
    println(list1 intersect list2)
    // [1, 2, 3, 5]

    // equal elements are merged into one
    println(list1 union list2)
    // [1, 2, 3, 5, 8, -1]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}