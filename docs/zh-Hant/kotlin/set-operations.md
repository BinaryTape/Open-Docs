[//]: # (title: 集合特定操作)

Kotlin 集合套件包含用於集合上常用操作的擴充函數：尋找交集、合併或從彼此中減去集合。

若要將兩個集合合併為一個，請使用 [`union()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/union.html) 函數。它可以用中綴形式 `a union b` 使用。
請注意，對於有序集合，運算元 (Operands) 的順序很重要。在結果集合中，第一個運算元的元素會排在第二個運算元的元素之前：

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

若要尋找兩個集合之間的交集（兩者都存在的元素），請使用 [`intersect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/intersect.html) 函數。
若要尋找不存在於另一個集合中的集合元素，請使用 [`subtract()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/subtract.html) 函數。
這兩個函數也可以用中綴形式呼叫，例如 `a intersect b`：

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

若要尋找存在於兩個集合中的任何一個但不在其交集中的元素，您也可以使用 `union()` 函數。
對於此操作（稱為對稱差 (Symmetric Difference)），請計算兩個集合之間的差異並合併結果：

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

您也可以將 `union()`、`intersect()` 和 `subtract()` 函數應用於列表。
然而，它們的結果**總是**一個 `Set`。在此結果中，所有重複的元素會合併為一個，並且索引存取不可用：

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