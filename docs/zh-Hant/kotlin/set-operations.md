[//]: # (title: 集合專屬操作)

Kotlin 集合套件包含針對集合常見操作的擴充函數，例如尋找交集、合併，或從彼此中減去集合。

若要將兩個集合合併為一個，請使用 [`union()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/union.html) 函數。它可以用中綴形式 `a union b` 呼叫。
請注意，對於有序集合，運算元的順序很重要。在結果集合中，第一個運算元的元素會排在第二個運算元的元素之前：

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")

    // 依據順序輸出
    println(numbers union setOf("four", "five"))
    // [one, two, three, four, five]
    println(setOf("four", "five") union numbers)
    // [four, five, one, two, three]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

若要尋找兩個集合之間的交集（同時存在於兩者中的元素），請使用 [`intersect()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/intersect.html) 函數。
若要尋找不在另一個集合中的集合元素，請使用 [`subtract()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/subtract.html) 函數。
這兩個函數也可以中綴形式呼叫，例如 `a intersect b`：

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")

    // 相同輸出
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

若要尋找存在於兩個集合中任一個但不在其交集中的元素，您也可以使用 `union()` 函數。
對於此操作（稱為對稱差集），請計算兩個集合之間的差異並合併結果：

```kotlin
fun main() {
//sampleStart
    val numbers = setOf("one", "two", "three")
    val numbers2 = setOf("three", "four")

    // 合併差異
    println((numbers - numbers2) union (numbers2 - numbers))
    // [one, two, four]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

您也可以將 `union()`、`intersect()` 和 `subtract()` 函數應用於列表。
然而，其結果**總是**一個 `Set`。在此結果中，所有重複元素會合併為一個，且索引存取不可用：

```kotlin
fun main() {
//sampleStart
    val list1 = listOf(1, 1, 2, 3, 5, 8, -1)
    val list2 = listOf(1, 1, 2, 2, 3, 5)

    // 兩個列表交集的結果是一個 Set
    println(list1 intersect list2)
    // [1, 2, 3, 5]

    // 相同元素合併為一個
    println(list1 union list2)
    // [1, 2, 3, 5, 8, -1]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}