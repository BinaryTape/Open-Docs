[//]: # (title: 集合写入操作)

[可变集合](collections-overview.md#collection-types)支持改变集合内容的操作，例如添加或移除元素。
在此页面上，我们将介绍 `MutableCollection` 所有实现可用的写入操作。
关于 `List` 和 `Map` 更具体的操作，请参见 [List 特有的操作](list-operations.md) 和 [Map 特有的操作](map-operations.md)。

## 添加元素

要向 `List` 或 `Set` 添加单个元素，请使用 [`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) 函数。指定对象会追加到集合的末尾。

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

[`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html) 将实参对象的所有元素添加到 `List` 或 `Set`。该实参可以是 `Iterable`、`Sequence` 或 `Array`。
接收者和实参的类型可能不同，例如，你可以将 `Set` 中的所有项添加到 `List` 中。

当在 `List` 上调用时，`addAll()` 会按照实参中元素的顺序添加新元素。
你也可以通过将元素位置指定为第一个实参来调用 `addAll()`。
实参集合的第一个元素将插入到此位置。
实参集合的其他元素将跟随其后，将接收者元素向后移。

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

你还可以使用 [`plus` 操作符](collection-plus-minus.md) 的原地版本 [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 来添加元素。
当应用于可变集合时，`+=` 将第二个操作数（一个元素或另一个集合）追加到集合的末尾。

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

要从可变集合中移除元素，请使用 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 函数。
`remove()` 接受元素值并移除该值的一个匹配项。

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

要一次移除多个元素，有以下函数：

*   [`removeAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove-all.html) 移除实参集合中存在的所有元素。
    或者，你可以使用谓词作为实参来调用它；在这种情况下，该函数会移除谓词求值为 `true` 的所有元素。
*   [`retainAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/retain-all.html) 与 `removeAll()` 相反：它移除除实参集合中的元素以外的所有元素。
    当与谓词一起使用时，它只保留匹配的元素。
*   [`clear()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/clear.html) 移除 `List` 中的所有元素并使其变为空。

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

另一种从集合中移除元素的方法是使用 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 操作符 —— [`minus`](collection-plus-minus.md) 的原地版本。
第二个实参可以是元素类型的单个实例或另一个集合。
当右侧是单个元素时，`-=` 会移除该元素的**第一个**匹配项。
反之，如果它是一个集合，则会移除其元素的**所有**匹配项。
例如，如果 `List` 包含重复元素，它们会一次性被移除。
第二个操作数可以包含集合中不存在的元素。这些元素不影响操作执行。

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

`List` 和 `Map` 也提供了更新元素的操作。
它们在 [List 特有的操作](list-operations.md) 和 [Map 特有的操作](map-operations.md) 中进行了描述。
对于 `Set` 而言，更新没有意义，因为它实际上是移除一个元素并添加另一个。