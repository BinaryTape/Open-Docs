[//]: # (title: 序列)

除了集合（collections）之外，Kotlin 標準函式庫還包含另一種型別 – _序列_ ([`Sequence<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence/index.html))。
與集合不同，序列本身不包含元素，而是在疊代時產生元素。
序列提供與 [`Iterable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html) 相同的函式，但實作了另一種多步驟集合處理的方法。

當 `Iterable` 的處理包含多個步驟時，它們會即時執行：每個處理步驟完成並返回其結果 – 一個中間集合。下一個步驟則在此集合上執行。反之，序列的多步驟處理會盡可能惰性執行：實際的計算只在請求整個處理鏈的結果時發生。

操作執行的順序也不同：`Sequence` 對每個單一元素逐一執行所有處理步驟。反之，`Iterable` 為整個集合完成每個步驟，然後再進行下一個步驟。

因此，序列讓您避免建構中間步驟的結果，從而提高整個集合處理鏈的效能。然而，序列的惰性特性會增加一些額外負荷，這在處理較小的集合或執行較簡單的計算時可能會很顯著。因此，您應該同時考慮 `Sequence` 和 `Iterable`，並決定哪一個更適合您的情況。

## 建構

### 從元素建立

要建立序列，請呼叫 [`sequenceOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence-of.html) 函式，並將元素作為其參數列出。

```kotlin
val numbersSequence = sequenceOf("four", "three", "two", "one")
```

### 從 Iterable 建立

如果您已經有一個 `Iterable` 物件（例如 `List` 或 `Set`），您可以透過呼叫 [`asSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-sequence.html) 從中建立序列。

```kotlin
val numbers = listOf("one", "two", "three", "four")
val numbersSequence = numbers.asSequence()

```

### 從函式建立

另一種建立序列的方式是透過建構一個計算其元素的函式來完成。
要基於函式建立序列，請呼叫 [`generateSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/generate-sequence.html)，並將此函式作為參數。選擇性地，您可以將第一個元素指定為明確值或函式呼叫的結果。
當提供的函式返回 `null` 時，序列產生會停止。因此，以下範例中的序列是無限的。

```kotlin

fun main() {
//sampleStart
    val oddNumbers = generateSequence(1) { it + 2 } // `it` is the previous element
    println(oddNumbers.take(5).toList())
    //println(oddNumbers.count())     // error: the sequence is infinite
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要使用 `generateSequence()` 建立有限序列，請提供一個在您需要的最後一個元素之後返回 `null` 的函式。

```kotlin

fun main() {
//sampleStart
    val oddNumbersLessThan10 = generateSequence(1) { if (it < 8) it + 2 else null }
    println(oddNumbersLessThan10.count())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 從區塊建立

最後，有一個函式可以讓您逐一或以任意大小的區塊產生序列元素 – [`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html) 函式。
此函式接受一個 lambda 表達式，其中包含對 [`yield()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence-scope/yield.html) 和 [`yieldAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence-scope/yield-all.html) 函式的呼叫。
它們向序列消費者返回一個元素，並暫停 `sequence()` 的執行，直到消費者請求下一個元素。`yield()` 接受單一元素作為參數；`yieldAll()` 可以接受 `Iterable` 物件、`Iterator` 或另一個 `Sequence`。`yieldAll()` 的 `Sequence` 參數可以是無限的。然而，這樣的呼叫必須是最後一個：所有後續的呼叫將永遠不會被執行。

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

序列操作可以根據其狀態要求分為以下幾組：

*   _無狀態（Stateless）_ 操作不需要狀態，並獨立處理每個元素，例如 [`map()`](collection-transformations.md#map) 或 [`filter()`](collection-filtering.md)。無狀態操作也可能需要少量固定狀態來處理一個元素，例如 [`take()` 或 `drop()`](collection-parts.md)。
*   _有狀態（Stateful）_ 操作需要大量的狀態，通常與序列中的元素數量成比例。

如果一個序列操作返回另一個惰性產生的序列，則稱其為 _中間操作（intermediate）_。
否則，該操作是 _終端操作（terminal）_。終端操作的範例是 [`toList()`](constructing-collections.md#copy) 或 [`sum()`](collection-aggregate.md)。序列元素只能透過終端操作來擷取。

序列可以多次疊代；然而，某些序列實作可能會限制自己只能疊代一次。這在其文件中會特別提及。

## 序列處理範例

讓我們透過一個範例來看看 `Iterable` 和 `Sequence` 之間的差異。

### Iterable

假設您有一個單字列表。以下程式碼篩選出長度超過三個字元的單字，並印出前四個這類單字的長度。

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

當您執行這段程式碼時，您會看到 `filter()` 和 `map()` 函式按照它們在程式碼中出現的相同順序執行。首先，您會看到所有元素的 `filter:`，然後是篩選後剩餘元素的 `length:`，最後是最後兩行的輸出。

這就是列表處理的方式：

![List processing](list-processing.svg)

### 序列

現在讓我們用序列來寫相同的內容：

```kotlin

fun main() {
//sampleStart
    val words = "The quick brown fox jumps over the lazy dog".split(" ")
    //將 List 轉換為 Sequence
    val wordsSequence = words.asSequence()

    val lengthsSequence = wordsSequence.filter { println("filter: $it"); it.length > 3 }
        .map { println("length: ${it.length}"); it.length }
        .take(4)

    println("Lengths of first 4 words longer than 3 chars")
    // 終端操作：將結果作為 List 取得
    println(lengthsSequence.toList())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

這段程式碼的輸出顯示，`filter()` 和 `map()` 函式僅在建構結果列表時被呼叫。
所以，您會先看到文字行 `"Lengths of.."`，然後序列處理才開始。
請注意，對於篩選後剩餘的元素，`map` 在篩選下一個元素之前執行。
當結果大小達到 4 時，處理停止，因為這是 `take(4)` 可以返回的最大可能大小。

序列處理過程如下：

![Sequences processing](sequence-processing.svg) {width="700"}

在這個範例中，元素的惰性處理以及找到四個項目後停止，相較於使用列表方法，減少了操作數量。