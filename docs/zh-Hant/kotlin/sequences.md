[//]: # (title: 序列)

除了集合之外，Kotlin 標準函式庫還包含另一種類型 – _序列_ ([`Sequence<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence/index.html))。與集合不同，序列不包含元素，它們在迭代時產生元素。序列提供與 [`Iterable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html) 相同的函式，但對於多步驟集合處理採用了另一種方法。

當 `Iterable` 的處理包含多個步驟時，這些步驟會被積極地執行：每個處理步驟都會完成並返回其結果 – 一個中間集合。下一個步驟會在此集合上執行。相對地，序列的多步驟處理則在可能的情況下延遲執行：實際的計算只會在請求整個處理鏈的結果時才發生。

操作執行的順序也不同：`Sequence` 會對每個單一元素逐一執行所有處理步驟。相對地，`Iterable` 會為整個集合完成每個步驟，然後才進入下一個步驟。

因此，序列讓您避免建立中間步驟的結果，從而提高了整個集合處理鏈的效能。然而，序列的延遲特性會增加一些開銷，這在處理較小的集合或執行較簡單的計算時可能會很顯著。因此，您應該同時考慮 `Sequence` 和 `Iterable`，並決定哪一個更適合您的情況。

## 建構

### 從元素建構

要建立序列，請呼叫 [`sequenceOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence-of.html) 函式，將元素列為其引數。

```kotlin
val numbersSequence = sequenceOf("four", "three", "two", "one")
```

### 從可迭代物件建構

如果您已經有一個 `Iterable` 物件（例如 `List` 或 `Set`），您可以透過呼叫 [`asSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-sequence.html) 從中建立序列。

```kotlin
val numbers = listOf("one", "two", "three", "four")
val numbersSequence = numbers.asSequence()

```

### 從函式建構

建立序列的另一種方式是使用計算其元素的函式來建構。若要根據函式建構序列，請呼叫 [`generateSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/generate-sequence.html)，並將此函式作為引數。您可以選擇將第一個元素指定為明確值或函式呼叫的結果。當提供的函式返回 `null` 時，序列生成會停止。因此，以下範例中的序列是無限的。

```kotlin

fun main() {
//sampleStart
    val oddNumbers = generateSequence(1) { it + 2 } // `it` 是前一個元素
    println(oddNumbers.take(5).toList())
    //println(oddNumbers.count())     // 錯誤：序列是無限的
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

若要使用 `generateSequence()` 建立有限序列，請提供一個函式，該函式在您需要的最後一個元素之後返回 `null`。

```kotlin

fun main() {
//sampleStart
    val oddNumbersLessThan10 = generateSequence(1) { if (it < 8) it + 2 else null }
    println(oddNumbersLessThan10.count())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 從區塊建構

最後，有一個函式允許您逐一或以任意大小的區塊產生序列元素 – 即 [`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html) 函式。此函式接受一個 lambda 表達式，其中包含 [`yield()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence-scope/yield.html) 和 [`yieldAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence-scope/yield-all.html) 函式的呼叫。它們將元素返回給序列消費者，並暫停 `sequence()` 的執行，直到消費者請求下一個元素。`yield()` 接受單一元素作為引數；`yieldAll()` 可以接受 `Iterable` 物件、`Iterator` 或另一個 `Sequence`。`yieldAll()` 的 `Sequence` 引數可以是無限的。然而，這樣的呼叫必須是最後一個：所有後續的呼叫將永遠不會被執行。

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

序列操作根據其狀態要求可分為以下幾組：

*   _無狀態_ 操作不需要狀態，並獨立處理每個元素，例如 [`map()`](collection-transformations.md#map) 或 [`filter()`](collection-filtering.md)。無狀態操作也可能需要少量常數狀態來處理元素，例如 [`take()` 或 `drop()`](collection-parts.md)。
*   _有狀態_ 操作需要大量狀態，通常與序列中的元素數量成比例。

如果序列操作返回另一個以延遲方式產生的序列，則稱其為 _中間操作_。否則，該操作為 _終端操作_。終端操作的範例有 [`toList()`](constructing-collections.md#copy) 或 [`sum()`](collection-aggregate.md)。序列元素只能透過終端操作來擷取。

序列可以多次迭代；然而，某些序列實作可能會限制自己只能迭代一次。這在其文件中有明確說明。

## 序列處理範例

讓我們透過一個範例來看看 `Iterable` 和 `Sequence` 之間的差異。

### 可迭代物件

假設您有一個單字列表。下面的程式碼會過濾出長度超過三個字元的單字，並列印出前四個此類單字的長度。

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

當您執行此程式碼時，您會看到 `filter()` 和 `map()` 函式的執行順序與它們在程式碼中出現的順序相同。首先，您會看到所有元素的 `filter:` 輸出，然後是過濾後剩餘元素的 `length:` 輸出，接著是最後兩行的輸出。

列表處理過程如下：

![List processing](list-processing.svg)

### 序列

現在讓我們用序列來編寫相同的程式碼：

```kotlin

fun main() {
//sampleStart
    val words = "The quick brown fox jumps over the lazy dog".split(" ")
    //convert the List to a Sequence
    val wordsSequence = words.asSequence()

    val lengthsSequence = wordsSequence.filter { println("filter: $it"); it.length > 3 }
        .map { println("length: ${it.length}"); it.length }
        .take(4)

    println("Lengths of first 4 words longer than 3 chars")
    // terminal operation: obtaining the result as a List
    println(lengthsSequence.toList())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

此程式碼的輸出顯示，`filter()` 和 `map()` 函式僅在建立結果列表時被呼叫。因此，您會先看到文字行 `"Lengths of.."`，然後序列處理才開始。請注意，對於過濾後剩餘的元素，`map` 會在過濾下一個元素之前執行。當結果大小達到 4 時，處理會停止，因為這是 `take(4)` 可以返回的最大可能大小。

序列處理過程如下：

![Sequences processing](sequence-processing.svg) {width="700"}

在此範例中，元素的延遲處理以及在找到四個項目後停止，相比於使用列表方法，減少了操作次數。