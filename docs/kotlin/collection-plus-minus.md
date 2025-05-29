[//]: # (title: 加号和减号运算符)

在 Kotlin 中，集合定义了 [`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) 和 [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html) (`-`) 运算符。它们将集合作为第一个操作数；第二个操作数可以是元素，也可以是另一个集合。返回值是一个新的只读集合：

*   `plus` 的结果包含原始集合_以及_第二个操作数中的元素。
*   `minus` 的结果包含原始集合中的元素，_但排除_来自第二个操作数的元素。如果第二个操作数是元素，`minus` 会移除它的_第一次_出现；如果它是集合，则移除其元素的所有出现。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    val plusList = numbers + "five"
    val minusList = numbers - listOf("three", "four")
    println(plusList)
    println(minusList)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

有关映射的 `plus` 和 `minus` 运算符的详细信息，请参阅[映射特定操作](map-operations.md)。集合也定义了[复合赋值运算符](operator-overloading.md#augmented-assignments) [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 和 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`)。然而，对于只读集合，它们实际上是使用 `plus` 或 `minus` 运算符，并尝试将结果赋值给同一个变量。因此，它们仅适用于 `var` 只读集合。对于可变集合，如果集合是 `val`，它们会修改集合。有关更多详细信息，请参阅[集合写入操作](collection-write.md)。