---
title: 序列
---
Kotlin 标准库除了集合（collections）之外，还包含另一种类型——序列（sequences）([`Sequence<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence/index.html))。
与集合不同，序列不包含元素，而是在迭代时生成元素。
序列提供与 [`Iterable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html) 相同的功能，
但实现了另一种多步骤集合处理方法。

当 `Iterable` 的处理包括多个步骤时，它们会被**立即执行 (eagerly)**：每个处理步骤都会完成，并返回其结果——一个中间集合。下一步骤在这个集合上执行。 相比之下，序列的多步骤处理在可能的情况下会被**延迟执行 (lazily)**：实际计算仅在请求整个处理链的结果时才会发生。

操作的执行顺序也不同：`Sequence` 对每个元素逐个执行所有处理步骤。 而 `Iterable` 则完成整个集合的每个步骤，然后进行下一步。

因此，序列允许你避免构建中间步骤的结果，从而提高整个集合处理链的性能。 但是，序列的惰性本质会增加一些开销，这在处理较小的集合或进行更简单的计算时可能很重要。 因此，你应该同时考虑 `Sequence` 和 `Iterable`，并确定哪一个更适合你的情况。

## 构造

### 从元素创建

要创建一个序列，可以调用 [`sequenceOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence-of.html) 函数，并将元素作为其参数列出。

```kotlin
val numbersSequence = sequenceOf("four", "three", "two", "one")
```

### 从 Iterable 创建

如果已经有一个 `Iterable` 对象（例如 `List` 或 `Set`），则可以通过调用 [`asSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-sequence.html) 从它创建一个序列。

```kotlin
val numbers = listOf("one", "two", "three", "four")
val numbersSequence = numbers.asSequence()
```

### 从函数创建

创建序列的另一种方法是使用一个计算其元素的函数来构建它。
要基于函数构建序列，请使用此函数作为参数调用 [`generateSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/generate-sequence.html)。
可以选择将第一个元素指定为显式值或函数调用的结果。
当提供的函数返回 `null` 时，序列生成停止。因此，以下示例中的序列是无限的。

```kotlin
fun main() {
    val oddNumbers = generateSequence(1) { it + 2 } // `it` 是前一个元素
    println(oddNumbers.take(5).toList())
    //println(oddNumbers.count())     // error: the sequence is infinite
}
```

要使用 `generateSequence()` 创建一个有限序列，请提供一个在需要的最后一个元素之后返回 `null` 的函数。

```kotlin
fun main() {
    val oddNumbersLessThan10 = generateSequence(1) { if (it < 8) it + 2 else null }
    println(oddNumbersLessThan10.count())
}
```

### 从块创建

最后，有一个函数允许你逐个或按任意大小的块生成序列元素——[`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html) 函数。
此函数接受一个 lambda 表达式，其中包含对 [`yield()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence-scope/yield.html)
和 [`yieldAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence-scope/yield-all.html) 函数的调用。
它们将一个元素返回给序列消费者，并暂停 `sequence()` 的执行，直到消费者请求下一个元素。
`yield()` 接受单个元素作为参数；`yieldAll()` 可以接受 `Iterable` 对象、`Iterator` 或另一个 `Sequence`。
`yieldAll()` 的 `Sequence` 参数可以是无限的。但是，这样的调用必须是最后一个：所有后续调用将永远不会被执行。

```kotlin
fun main() {
    val oddNumbers = sequence {
        yield(1)
        yieldAll(listOf(3, 5))
        yieldAll(generateSequence(7) { it + 2 })
    }
    println(oddNumbers.take(5).toList())
}
```

## 序列操作

序列操作可以根据其状态要求分为以下几组：

* _无状态 (Stateless)_ 操作不需要状态，并且独立处理每个元素，例如，[`map()`](collection-transformations#map) 或 [`filter()`](collection-filtering)。
   无状态操作也可能需要少量的恒定状态来处理元素，例如，[`take()` 或 `drop()`](collection-parts)。
* _有状态 (Stateful)_ 操作需要大量的状态，通常与序列中的元素数量成正比。

如果序列操作返回另一个序列（该序列是延迟生成的），则称为 _中间 (intermediate)_ 操作。
否则，该操作是 _末端 (terminal)_ 操作。末端操作的示例包括 [`toList()`](constructing-collections#copy)
或 [`sum()`](collection-aggregate)。序列元素只能通过末端操作检索。

序列可以迭代多次；但是，某些序列实现可能会将自身限制为仅迭代一次。这会在其文档中专门提及。

## 序列处理示例

让我们通过一个示例来了解 `Iterable` 和 `Sequence` 之间的区别。

### Iterable

假设你有一个单词列表。下面的代码过滤掉长度超过三个字符的单词，并打印前四个此类单词的长度。

```kotlin
fun main() {    
    val words = "The quick brown fox jumps over the lazy dog".split(" ")
    val lengthsList = words.filter { println("filter: $it"); it.length > 3 }
        .map { println("length: ${it.length}"); it.length }
        .take(4)

    println("Lengths of first 4 words longer than 3 chars:")
    println(lengthsList)
}
```

运行此代码时，你将看到 `filter()` 和 `map()` 函数的执行顺序与它们在代码中出现的顺序相同。首先，你将看到所有元素的 `filter:`，然后是过滤后剩余元素的 `length:`，然后是最后两行的输出。

这是列表处理的方式：

<img src="/img/list-processing.svg" alt="List processing" style={{verticalAlign: 'middle'}}/>

### Sequence

现在，让我们用序列编写相同的代码：

```kotlin
fun main() {
    val words = "The quick brown fox jumps over the lazy dog".split(" ")
    //convert the List to a Sequence
    val wordsSequence = words.asSequence()

    val lengthsSequence = wordsSequence.filter { println("filter: $it"); it.length > 3 }
        .map { println("length: ${it.length}"); it.length }
        .take(4)

    println("Lengths of first 4 words longer than 3 chars")
    // terminal operation: obtaining the result as a List
    println(lengthsSequence.toList())
}
```

此代码的输出表明，仅在构建结果列表时才调用 `filter()` 和 `map()` 函数。
因此，你首先看到文本行 `"Lengths of.."`，然后序列处理开始。
请注意，对于过滤后剩余的元素，map 在过滤下一个元素之前执行。
当结果大小达到 4 时，处理停止，因为这是 `take(4)` 可以返回的最大可能大小。

序列处理如下所示：

<img src="/img/sequence-processing.svg" alt="Sequences processing" style={{verticalAlign: 'middle'}} width="700"/>

在此示例中，与使用列表方法相比，元素的惰性处理和在找到四个项目后停止减少了操作次数。