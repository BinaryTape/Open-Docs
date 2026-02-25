[//]: # (title: 集合写操作)

[可变集合](collections-overview.md#collection-types)支持用于更改集合内容的操作，例如添加或删除元素。
在本页中，我们将介绍适用于所有 `MutableCollection` 实现的写操作。
关于 `List` 和 `Map` 提供的更具体的子类操作，请分别参阅 [List 特有操作](list-operations.md) 与 [Map 特有操作](map-operations.md)。

## 添加元素

要向列表或 Set 中添加单个元素，请使用 [`add()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/add.html) 函数。指定的对象将被追加到集合末尾。

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

[`addAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/add-all.html) 将实参对象中的每个元素添加到列表或 Set 中。实参可以是 `Iterable`、`Sequence` 或 `Array`。
接收者与实参的类型可以不同，例如，你可以将 `Set` 中的所有项添加到 `List` 中。

当在列表上调用时，`addAll()` 会按照实参中的元素顺序添加新元素。
你也可以在调用 `addAll()` 时指定一个元素位置作为第一个实参。
实参集合的第一个元素将插入到该位置。实参集合中的其他元素将紧随其后，将接收者中的原有元素移至末尾。

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

你还可以使用 [`plus` 运算符](collection-plus-minus.md)的原地版本 —— [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 来添加元素。
当应用于可变集合时，`+=` 会将第二个操作数（一个元素或另一个集合）追加到该集合的末尾。

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

## 删除元素

要从可变集合中删除一个元素，请使用 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove.html) 函数。
`remove()` 接受元素值并删除该值的一次出现。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4, 3)
    numbers.remove(3)                    // 删除第一个 3
    println(numbers)
    numbers.remove(5)                    // 什么都不删除
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

若要一次删除多个元素，可以使用以下函数：

* [`removeAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/remove-all.html) 删除实参集合中存在的所有元素。
   或者，你也可以使用谓词作为实参来调用它；在这种情况下，该函数将删除谓词结果为 `true` 的所有元素。
* [`retainAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/retain-all.html) 与 `removeAll()` 相反：它删除除实参集合中的元素以外的所有元素。
   当与谓词配合使用时，它只保留与之匹配的元素。
* [`clear()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/clear.html) 从列表中删除所有元素并使其为空。

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

从集合中删除元素的另一种方式是使用 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 运算符 —— [`minus`](collection-plus-minus.md) 的原地版本。
第二个实参可以是元素类型的单个实例或另一个集合。
当右侧为单个元素时，`-=` 会删除它的*第一次*出现。
相应地，如果右侧是一个集合，则会删除该集合中元素的所有出现。
例如，如果列表中包含重复元素，它们将被一并删除。
第二个操作数可以包含集合中不存在的元素。这些元素不会影响操作的执行。

```kotlin

fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "three", "four")
    numbers -= "three"
    println(numbers)
    numbers -= listOf("four", "five")    
    //numbers -= listOf("four")    // 与上述操作效果相同
    println(numbers)    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 更新元素

列表和 Map 还提供了用于更新元素的操作。
它们在 [List 特有操作](list-operations.md) 与 [Map 特有操作](map-operations.md) 中有所描述。
对于 Set 来说，更新没有意义，因为更新实际上是删除一个元素并添加另一个。