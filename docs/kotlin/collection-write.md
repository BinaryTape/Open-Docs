[//]: # (title: 集合写入操作)

[可变集合 (Mutable collections)](collections-overview.md#collection-types) 支持用于修改集合内容的操作，例如添加或移除元素。
在本页中，我们将描述 `MutableCollection` 所有实现可用的写入操作。
有关 `List` 和 `Map` 的更多特定操作，请分别参阅 [List 特有操作](list-operations.md) 和 [Map 特有操作](map-operations.md)。

## 添加元素

要向列表或 `Set` 添加单个元素，请使用 [`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) 函数。指定的对象会添加到集合的末尾。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.add(5)
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html) 将参数对象的每个元素添加到列表或 `Set` 中。参数可以是 `Iterable`、`Sequence` 或 `Array`。
接收者 (receiver) 和参数的类型可能不同，例如，你可以将 `Set` 中的所有项添加到 `List` 中。

当在列表上调用时，`addAll()` 以与参数中相同的顺序添加新元素。
你也可以调用 `addAll()`，将元素位置指定为第一个参数。
参数集合的第一个元素将插入到此位置。
参数集合的其他元素将紧随其后，并将接收者元素 (receiver elements) 移到末尾。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 5, 6)
    numbers.addAll(arrayOf(7, 8))
    println(numbers)
    numbers.addAll(2, setOf(3, 4))
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你还可以使用 [`plus` 运算符](collection-plus-minus.md) 的就地 (in-place) 版本 — [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 来添加元素。
当应用于可变集合时，`+=` 将第二个操作数（一个元素或另一个集合）附加到集合的末尾。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two")
    numbers += "three"
    println(numbers)
    numbers += listOf("four", "five")    
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 移除元素

要从可变集合中移除一个元素，请使用 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 函数。
`remove()` 接受元素值并移除该值的一次出现。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4, 3)
    numbers.remove(3)                    // removes the first `3`
    println(numbers)
    numbers.remove(5)                    // removes nothing
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要一次性移除多个元素，有以下函数：

*   [`removeAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove-all.html) 移除参数集合中存在的所有元素。
    或者，你可以传入一个谓词 (predicate) 作为参数调用它；在这种情况下，该函数会移除所有使谓词返回 `true` 的元素。
*   [`retainAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/retain-all.html) 与 `removeAll()` 相反：它会移除所有元素，只保留参数集合中的元素。
    当与谓词一起使用时，它只保留匹配的元素。
*   [`clear()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/clear.html) 从列表中移除所有元素，使其变为空。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    println(numbers)
    numbers.retainAll { it >= 3 }
    println(numbers)
    numbers.clear()
    println(numbers)

    val numbersSet = mutableSetOf("one", "two", "three", "four")
    numbersSet.removeAll(setOf("one", "two"))
    println(numbersSet)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

从集合中移除元素的另一种方式是使用 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 运算符 — 它是 [`minus`](collection-plus-minus.md) 的就地 (in-place) 版本。
第二个参数可以是元素类型的单个实例，也可以是另一个集合。
当右侧是一个单个元素时，`-=` 会移除该元素的_第一个_出现。
反之，如果它是一个集合，则会移除其元素的_所有_出现。
例如，如果一个列表包含重复元素，它们会一次性被移除。
第二个操作数可以包含集合中不存在的元素。这些元素不影响操作的执行。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "three", "four")
    numbers -= "three"
    println(numbers)
    numbers -= listOf("four", "five")    
    //numbers -= listOf("four")    // does the same as above
    println(numbers)    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 更新元素

列表和 `Map` 也提供了用于更新元素的操作。
这些操作在 [List 特有操作](list-operations.md) 和 [Map 特有操作](map-operations.md) 中进行了描述。
对于 `Set` 来说，更新没有意义，因为它实际上是移除一个元素并添加另一个元素。