---
title: 集合写操作
---
[可变集合](collections-overview#collection-types) 支持更改集合内容的操作，例如，添加或删除元素。
在此页面上，我们将介绍所有 `MutableCollection` 实现可用的写入操作。
有关 `List` 和 `Map` 的更具体操作，请分别参见 [List-specific Operations](list-operations) 和 [Map Specific Operations](map-operations)。

## 添加元素

要向列表或集合添加单个元素，请使用 [`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) 函数。指定的对象将追加到集合的末尾。

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.add(5)
    println(numbers)

}
```

[`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html) 将参数对象中的每个元素添加到列表或集合中。该参数可以是 `Iterable`、`Sequence` 或 `Array`。
接收者和参数的类型可能不同，例如，你可以将 `Set` 中的所有条目添加到 `List` 中。

当在列表上调用时，`addAll()` 按照元素在参数中出现的顺序添加新元素。
你还可以调用 `addAll()`，将元素位置指定为第一个参数。
参数集合的第一个元素将插入到该位置。
参数集合的其他元素将跟随其后，将接收者元素移到末尾。

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 5, 6)
    numbers.addAll(arrayOf(7, 8))
    println(numbers)
    numbers.addAll(2, setOf(3, 4))
    println(numbers)

}
```

你还可以使用 [`plus` 运算符](collection-plus-minus) 的原地版本（`in-place version`）[`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 添加元素。
当应用于可变集合时，`+=` 将第二个操作数（一个元素或另一个集合）追加到集合的末尾。

```kotlin

fun main() {

    val numbers = mutableListOf("one", "two")
    numbers += "three"
    println(numbers)
    numbers += listOf("four", "five")    
    println(numbers)

}
```

## 移除元素

要从可变集合中移除元素，请使用 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 函数。
`remove()` 接受元素值并移除该值的第一次出现。

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 3, 4, 3)
    numbers.remove(3)                    // removes the first `3`
    println(numbers)
    numbers.remove(5)                    // removes nothing
    println(numbers)

}
```

要一次移除多个元素，可以使用以下函数：

* [`removeAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove-all.html) 移除参数集合中存在的所有元素。
   或者，你可以使用谓词作为参数来调用它；在这种情况下，该函数移除谓词产生 `true` 的所有元素。
* [`retainAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/retain-all.html) 与 `removeAll()` 相反：它移除除参数集合中的元素之外的所有元素。
   当与谓词一起使用时，它仅保留与其匹配的元素。
* [`clear()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/clear.html) 移除列表中的所有元素并使其为空。

```kotlin

fun main() {

    val numbers = mutableListOf(1, 2, 3, 4)
    println(numbers)
    numbers.retainAll { it >= 3 }
    println(numbers)
    numbers.clear()
    println(numbers)

    val numbersSet = mutableSetOf("one", "two", "three", "four")
    numbersSet.removeAll(setOf("one", "two"))
    println(numbersSet)

}
```

从集合中移除元素的另一种方法是使用 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 运算符 – [`minus`](collection-plus-minus) 的原地版本。
第二个参数可以是元素类型的单个实例或另一个集合。
如果右侧是单个元素，则 `-=` 移除它的_第一次_出现。
反过来，如果它是一个集合，则会移除其元素的_所有_出现。
例如，如果列表包含重复的元素，则会立即移除它们。
第二个操作数可以包含集合中不存在的元素。此类元素不影响操作执行。

```kotlin

fun main() {

    val numbers = mutableListOf("one", "two", "three", "three", "four")
    numbers -= "three"
    println(numbers)
    numbers -= listOf("four", "five")    
    //numbers -= listOf("four")    // does the same as above
    println(numbers)    

}
```

## 更新元素

列表和映射还提供了用于更新元素的操作。
它们在 [List-specific Operations](list-operations) 和 [Map Specific Operations](map-operations) 中进行了描述。
对于集合，更新没有意义，因为它实际上是移除一个元素并添加另一个元素。