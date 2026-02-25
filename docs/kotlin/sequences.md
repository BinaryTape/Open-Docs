[//]: # (title: 序列)

除了集合之外，Kotlin 标准库还包含另一种类型 —— *序列* ([`Sequence<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence/index.html))。
与集合不同，序列不包含元素，它们在迭代时产生元素。
序列提供与 [`Iterable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html) 相同的函数，但实现了另一种多步集合处理方法。

当 `Iterable` 的处理包含多个步骤时，它们会及早执行：每个处理步骤完成并返回其结果 —— 一个中间集合。后续步骤在此集合上执行。相比之下，序列的多步处理在可能的情况下会延迟执行：只有在请求整个处理链的结果时才会进行实际计算。

操作执行的顺序也不同：`Sequence` 对每个单独的元素逐个执行所有处理步骤。而 `Iterable` 则完成整个集合的每个步骤，然后再继续下一步。

因此，序列可以让你避免构建中间步骤的结果，从而提高整个集合处理链的性能。然而，序列的延迟性质会增加一些开销，在处理较小的集合或进行较简单的计算时，这些开销可能会很显著。因此，你应该同时考虑 `Sequence` 和 `Iterable`，并决定哪一个更适合你的情况。

## 构造

### 从元素构造

要创建一个序列，请调用 [`sequenceOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence-of.html) 函数，并将元素列为其参数。

```kotlin
val numbersSequence = sequenceOf("four", "three", "two", "one")
```

### 从 Iterable 构造

如果你已经有一个 `Iterable` 对象（如 `List` 或 `Set`），你可以通过调用 [`asSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-sequence.html) 从中创建一个序列。

```kotlin
val numbers = listOf("one", "two", "three", "four")
val numbersSequence = numbers.asSequence()

```

### 从函数构造

创建序列的另一种方法是通过计算其元素的函数来构建它。
要基于函数构建序列，请调用 [`generateSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/generate-sequence.html)，并将此函数作为参数。或者，你可以将第一个元素指定为显式值或函数调用的结果。
当提供的函数返回 `null` 时，序列生成停止。因此，下面示例中的序列是无限的。

```kotlin

fun main() {
//sampleStart
    val oddNumbers = generateSequence(1) { it + 2 } // `it` 是上一个元素
    println(oddNumbers.take(5).toList())
    //println(oddNumbers.count())     // 错误：序列是无限的
//End
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要使用 `generateSequence()` 创建有限序列，请提供一个在所需最后一个元素之后返回 `null` 的函数。

```kotlin

fun main() {
//sampleStart
    val oddNumbersLessThan10 = generateSequence(1) { if (it < 8) it + 2 else null }
    println(oddNumbersLessThan10.count())
//End
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 从分块构造

最后，还有一个函数可以让你逐个或按任意大小的分块产生序列元素 —— 即 [`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html) 函数。
该函数接受一个包含 [`yield()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence-scope/yield.html) 和 [`yieldAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence-scope/yield-all.html) 函数调用的 lambda 表达式。
它们向序列使用者返回一个元素，并挂起 `sequence()` 的执行，直到使用者请求下一个元素。`yield()` 接受单个元素作为参数；`yieldAll()` 可以接受 `Iterable` 对象、`Iterator` 或另一个 `Sequence`。`yieldAll()` 的 `Sequence` 参数可以是无限的。但是，此类调用必须是最后一个：所有后续调用将永远不会执行。

```kotlin

fun main() {
//sampleStart
    val oddNumbers = sequence {
        yield(1)
        yieldAll(listOf(3, 5))
        yieldAll(generateSequence(7) { it + 2 })
    }
    println(oddNumbers.take(5).toList())
//End
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 序列操作

序列操作根据其状态要求可以分为以下几组：

* *无状态* 操作不需要状态并独立处理每个元素，例如 [`map()`](collection-transformations.md#map) 或 [`filter()`](collection-filtering.md)。无状态操作也可能需要少量固定量的状态来处理一个元素，例如 [`take()` 或 `drop()`](collection-parts.md)。
* *有状态* 操作需要大量状态，通常与序列中的元素数量成正比。

如果序列操作返回另一个延迟产生的序列，则称其为 *中间* 操作。
否则，该操作即为 *终端* 操作。终端操作的示例包括 [`toList()`](constructing-collections.md#copy) 或 [`sum()`](collection-aggregate.md)。序列元素只能通过终端操作检索。

序列可以多次迭代；但是，某些序列实现可能会限制自己只能迭代一次。这在它们的文档中会特别提到。

## 序列处理示例

让我们通过一个例子来看看 `Iterable` 和 `Sequence` 之间的区别。

### Iterable

假设你有一个单词列表。下面的代码过滤长度超过三个字符的单词，并打印前四个此类单词的长度。

```kotlin

fun main() {    
//sampleStart
    val words = "The quick brown fox jumps over the lazy dog".split(" ")
    val lengthsList = words.filter { println("filter: $it"); it.length > 3 }
        .map { println("length: ${it.length}"); it.length }
        .take(4)

    println("Lengths of first 4 words longer than 3 chars:")
    println(lengthsList)
//End
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

运行此代码时，你会看到 `filter()` 和 `map()` 函数的执行顺序与它们在代码中出现的顺序相同。首先，你会看到所有元素的 `filter:`，然后是过滤后剩余元素的 `length:`，最后是最后两行的输出。

列表处理过程如下：

![列表处理](list-processing.svg)

### 序列

现在让我们用序列编写相同的内容：

```kotlin

fun main() {
//sampleStart
    val words = "The quick brown fox jumps over the lazy dog".split(" ")
    // 将列表转换为序列
    val wordsSequence = words.asSequence()

    val lengthsSequence = wordsSequence.filter { println("filter: $it"); it.length > 3 }
        .map { println("length: ${it.length}"); it.length }
        .take(4)

    println("Lengths of first 4 words longer than 3 chars")
    // 终端操作：将结果获取为列表
    println(lengthsSequence.toList())
//End
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

此代码的输出显示，只有在构建结果列表时才会调用 `filter()` 和 `map()` 函数。因此，你首先看到文本行 `"Lengths of.."`，然后序列处理才开始。
注意，对于过滤后剩下的元素，在过滤下一个元素之前执行 map。
当结果大小达到 4 时，处理停止，因为这是 `take(4)` 可以返回的最大可能大小。

序列处理过程如下：

![序列处理](sequence-processing.svg) {width="700"}

在这个例子中，元素的延迟处理以及在找到四个项目后停止，与使用列表方法相比减少了操作次数。