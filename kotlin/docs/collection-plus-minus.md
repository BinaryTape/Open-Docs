---
title: 加号和减号运算符
---
在 Kotlin 中，为集合定义了 [`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) 和 [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html) (`-`) 操作符。它们将一个集合作为第一个操作数；第二个操作数可以是一个元素或另一个集合。返回值是一个新的只读集合：

* `plus` 的结果包含原始集合中的元素_以及_第二个操作数中的元素。
* `minus` 的结果包含原始集合中的元素_除了_第二个操作数中的元素。如果它是一个元素，`minus` 移除它的_第一次_出现；如果它是一个集合，则移除它的元素的所有出现。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")

    val plusList = numbers + "five"
    val minusList = numbers - listOf("three", "four")
    println(plusList)
    println(minusList)

}
```

有关 map 的 `plus` 和 `minus` 操作符的详细信息，请参见 [Map specific operations](map-operations)。[增广赋值操作符](operator-overloading#augmented-assignments) [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 和 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 也为集合定义。但是，对于只读集合，它们实际上使用 `plus` 或 `minus` 操作符，并尝试将结果分配给同一个变量。因此，它们仅在 `var` 只读集合上可用。对于可变集合，如果它是 `val`，它们会修改集合。有关更多详细信息，请参见 [Collection write operations](collection-write)。