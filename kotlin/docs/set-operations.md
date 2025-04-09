---
title: "Set-specific operations"
---
Kotlin 集合包中包含用于集合上常用操作的扩展函数：查找交集、合并或从彼此中减去集合。

要将两个集合合并为一个，请使用 [`union()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/union.html) 函数。它可以在中缀形式 `a union b` 中使用。
请注意，对于有序集合，操作数的顺序很重要。在结果集合中，第一个操作数的元素位于第二个操作数的元素之前：

```kotlin
fun main() {

    val numbers = setOf("one", "two", "three")

    // output according to the order
    println(numbers union setOf("four", "five"))
    // [one, two, three, four, five]
    println(setOf("four", "five") union numbers)
    // [four, five, one, two, three]

}
```

要查找两个集合之间的交集（两者中都存在的元素），请使用 [`intersect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/intersect.html) 函数。
要查找另一个集合中不存在的集合元素，请使用 [`subtract()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/subtract.html) 函数。
这两个函数也可以中缀形式调用，例如 `a intersect b`：

```kotlin
fun main() {

    val numbers = setOf("one", "two", "three")

    // same output
    println(numbers intersect setOf("two", "one"))
    // [one, two]
    println(numbers subtract setOf("three", "four"))
    // [one, two]
    println(numbers subtract setOf("four", "three"))
    // [one, two]

}
```

要查找存在于两个集合之一但不在其交集中的元素，您还可以使用 `union()` 函数。
对于此操作（称为对称差 (symmetric difference)），计算两个集合之间的差异并合并结果：

```kotlin
fun main() {

    val numbers = setOf("one", "two", "three")
    val numbers2 = setOf("three", "four")

    // merge differences 
    println((numbers - numbers2) union (numbers2 - numbers))
    // [one, two, four]

}
```

您还可以将 `union()`、`intersect()` 和 `subtract()` 函数应用于列表。
但是，它们的结果_始终_是 `Set`。在此结果中，所有重复的元素都将合并为一个，并且索引访问不可用：

```kotlin
fun main() {

    val list1 = listOf(1, 1, 2, 3, 5, 8, -1)
    val list2 = listOf(1, 1, 2, 2, 3, 5)

    // result of intersecting two lists is a Set
    println(list1 intersect list2)
    // [1, 2, 3, 5]

    // equal elements are merged into one
    println(list1 union list2)
    // [1, 2, 3, 5, 8, -1]

}
```