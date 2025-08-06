[//]: # (title: 序列)

除了集合，Kotlin 标准库还包含另一种类型——_序列_ ([`Sequence<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence/index.html))。
与集合不同，序列不包含元素，它们在迭代时生成元素。
序列提供与 [`Iterable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html) 相同的函数，
但对多步集合处理采用了另一种方法。

当 `Iterable` 的处理包含多个步骤时，它们会立即执行：每个处理步骤完成后，
会返回其结果——一个中间集合。接下来的步骤会在这个集合上执行。反之，序列的多步处理
尽可能惰性执行：实际计算只在请求整个处理链的结果时发生。

操作执行的顺序也不同：`Sequence` 会对每个元素逐个执行所有处理步骤。
而 `Iterable` 会为整个集合完成每个步骤，然后继续下一个步骤。

因此，序列让你避免构建中间步骤的结果，从而提高整个集合处理链的性能。
然而，序列的惰性特性会增加一些开销，在处理较小集合或进行简单计算时，这种开销可能很显著。
因此，你应该同时考虑 `Sequence` 和 `Iterable`，并决定哪一个更适合你的用例。

## 构造

### 从元素构造

要创建一个序列，调用 [`sequenceOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence-of.html) 函数，将元素作为其实参列出。

```kotlin
val numbersSequence = sequenceOf("four", "three", "two", "one")
```

### 从 Iterable 构造

如果你已经有一个 `Iterable` 对象（例如一个 `List` 或一个 `Set`），可以通过调用
[`asSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-sequence.html) 从中创建一个序列。

```kotlin
val numbers = listOf("one", "two", "three", "four")
val numbersSequence = numbers.asSequence()

```

### 从函数构造

创建序列的另一种方式是使用一个计算其元素的函数来构建它。
要基于函数构建序列，调用 [`generateSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/generate-sequence.html)
并将此函数作为实参。你可以选择将第一个元素指定为显式值或函数调用的结果。
当提供的函数返回 `null` 时，序列生成停止。因此，下面示例中的序列是无限的。

```kotlin

fun main() {
//sampleStart
    val oddNumbers = generateSequence(1) { it + 2 } // `it` is the previous element
    println(oddNumbers.take(5).toList())
    //println(oddNumbers.count())     // 错误：该序列是无限的
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要使用 `generateSequence()` 创建有限序列，请提供一个函数，该函数在你需要的最后一个元素之后返回 `null`。

```kotlin

fun main() {
//sampleStart
    val oddNumbersLessThan10 = generateSequence(1) { if (it < 8) it + 2 else null }
    println(oddNumbersLessThan10.count())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 从块构造

最后，还有一个函数允许你逐个或以任意大小的块来生成序列元素——即
[`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html) 函数。
此函数接受一个 lambda 表达式，其中包含对 [`yield()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence-scope/yield.html)
和 [`yieldAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence-scope/yield-all.html) 函数的调用。
它们将一个元素返回给序列消费者，并挂起 `sequence()` 的执行，直到消费者请求下一个元素。
`yield()` 接受一个单个元素作为实参；`yieldAll()` 可以接受一个 `Iterable` 对象、一个 `Iterator` 或另一个 `Sequence`。
`yieldAll()` 的 `Sequence` 实参可以是无限的。但是，这样的调用必须是最后一个：所有后续调用将永远不会被执行。

```kotlin

fun main() {
//sampleStart
    val oddNumbers = sequence {
        yield(1)
        yieldAll(listOf(3, 5))
        yieldAll(generateSequence(7) { it + 2 })
    }
    println(oddNumbers.take(5).toList())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 序列操作

序列操作根据其状态要求可分为以下几组：

* _无状态_ 操作不需要状态，并独立处理每个元素，例如 [`map()`](collection-transformations.md#map) 或 [`filter()`](collection-filtering.md)。
  无状态操作也可以需要少量固定状态来处理元素，例如 [`take()` 或 `drop()`](collection-parts.md)。
* _有状态_ 操作需要大量状态，通常与序列中的元素数量成比例。

如果序列操作返回另一个惰性生成的序列，则称之为 _中间操作_。
否则，该操作是 _末端操作_。末端操作的示例包括 [`toList()`](constructing-collections.md#copy)
或 [`sum()`](collection-aggregate.md)。序列元素只能通过末端操作检索。

序列可以多次迭代；然而，一些序列实现可能会限制自己只迭代一次。
这会在它们的文档中特别提及。

## 序列处理示例

让我们通过一个示例来看看 `Iterable` 和 `Sequence` 之间的区别。

### Iterable

假设你有一个单词 list。下面的代码会过滤出长度超过三个字符的单词，并打印前四个此类单词的长度。

```kotlin

fun main() {    
//sampleStart
    val words = "The quick brown fox jumps over the lazy dog".split(" ")
    val lengthsList = words.filter { println("filter: $it"); it.length > 3 }
        .map { println("length: ${it.length}"); it.length }
        .take(4)

    println("Lengths of first 4 words longer than 3 chars:")
    println(lengthsList)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

当你运行此代码时，你会看到 `filter()` 和 `map()` 函数按照它们在代码中出现的顺序执行。
首先，你会看到所有元素的 `filter:` 输出，然后是过滤后剩余元素的 `length:` 输出，
最后是最后两行的输出。

列表处理流程如下：

![List processing](list-processing.svg)

### Sequence

现在让我们用序列来编写相同的代码：

```kotlin

fun main() {
//sampleStart
    val words = "The quick brown fox jumps over the lazy dog".split(" ")
    //将 List 转换为 Sequence
    val wordsSequence = words.asSequence()

    val lengthsSequence = wordsSequence.filter { println("filter: $it"); it.length > 3 }
        .map { println("length: ${it.length}"); it.length }
        .take(4)

    println("Lengths of first 4 words longer than 3 chars")
    // 末端操作：将结果作为 List 获取
    println(lengthsSequence.toList())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

此代码的输出显示 `filter()` 和 `map()` 函数仅在构建结果 list 时被调用。
因此，你首先看到文本行 `"Lengths of.."`，然后序列处理开始。
请注意，对于过滤后剩余的元素，`map` 会在过滤下一个元素之前执行。
当结果大小达到 4 时，处理停止，因为这是 `take(4)` 可以返回的最大可能大小。

序列处理流程如下：

![Sequences processing](sequence-processing.svg) {width="700"}

在此示例中，元素的惰性处理以及在找到四个项后停止，减少了与使用 list 方法相比的操作数量。