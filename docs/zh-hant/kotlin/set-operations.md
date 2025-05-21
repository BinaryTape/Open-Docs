---
title: "集合特定的操作 (Set-specific operations)"
---
Kotlin 集合（Collections）套件包含用於集合上常見操作的擴展函式：尋找交集、合併或從彼此減去集合。

要將兩個集合合併為一個，請使用 [`union()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/union.html) 函式。 它可以用於中綴形式 `a union b`。
請注意，對於有序集合，運算元的順序很重要。 在產生的集合中，第一個運算元的元素位於第二個運算元的元素之前：

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

要尋找兩個集合之間的交集（存在於兩者中的元素），請使用 [`intersect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/intersect.html) 函式。
要尋找另一個集合中不存在的集合元素，請使用 [`subtract()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/subtract.html) 函式。
這兩個函式也可以中綴形式呼叫，例如，`a intersect b`：

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

要尋找存在於兩個集合中的任一個中，但不存在於它們的交集中的元素，您也可以使用 `union()` 函式。
對於此操作（稱為對稱差 (symmetric difference)），請計算兩個集合之間的差異並合併結果：

```kotlin
fun main() {

    val numbers = setOf("one", "two", "three")
    val numbers2 = setOf("three", "four")

    // merge differences 
    println((numbers - numbers2) union (numbers2 - numbers))
    // [one, two, four]

}
```

您也可以將 `union()`、`intersect()` 和 `subtract()` 函式應用於列表（lists）。
但是，它們的結果_始終_是一個 `Set`。 在此結果中，所有重複的元素都將合併為一個，並且索引存取不可用：

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