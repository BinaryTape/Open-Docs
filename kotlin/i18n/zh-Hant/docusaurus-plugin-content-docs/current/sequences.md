---
title: "序列 (Sequences)"
---
除了集合（collections）之外，Kotlin 標準函式庫還包含另一種類型 – _序列_（sequences）([`Sequence<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence/index.html))。
與集合不同，序列不包含元素，它們在迭代時產生元素。
序列提供與 [`Iterable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html) 相同的功能，
但針對多步驟集合處理實現了另一種方法。

當 `Iterable` 的處理包含多個步驟時，它們會被*立即*執行：每個處理步驟都會完成
並傳回其結果 – 一個中間集合。下一步驟在此集合上執行。反之，多步驟
序列的處理會在可能的情況下*延遲*執行：只有在請求整個
處理鏈的結果時，才會發生實際計算。

操作執行的順序也不同：`Sequence` 針對每個
單獨元素逐一執行所有處理步驟。反之，`Iterable` 完成整個集合的每個步驟，然後再進行下一步。

因此，序列可以避免建立中間步驟的結果，從而提高整個
集合處理鏈的效能。但是，序列的延遲特性會增加一些額外負荷，當
處理較小的集合或進行較簡單的計算時，這可能會很明顯。因此，您應該同時考慮 `Sequence` 和 `Iterable`
並決定哪一個更適合您的情況。

## 建構

### 從元素

要建立一個序列，請呼叫 [`sequenceOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence-of.html)
函數，並將元素列為其引數。

```kotlin
val numbersSequence = sequenceOf("four", "three", "two", "one")
```

### 從 Iterable

如果您已經有一個 `Iterable` 物件（例如 `List` 或 `Set`），您可以透過呼叫
[`asSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-sequence.html) 從它建立一個序列。

```kotlin
val numbers = listOf("one", "two", "three", "four")
val numbersSequence = numbers.asSequence()
```

### 從函數

建立序列的另一種方法是使用一個計算其元素的函數來建構它。
要基於函數建立序列，請呼叫 [`generateSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/generate-sequence.html)
並將此函數作為引數。您可以選擇性地將第一個元素指定為顯式值或函數呼叫的結果。
當提供的函數傳回 `null` 時，序列產生就會停止。因此，以下範例中的序列是無限的。

```kotlin
fun main() {
    val oddNumbers = generateSequence(1) { it + 2 } // `it` 是前一個元素
    println(oddNumbers.take(5).toList())
    //println(oddNumbers.count())     // 錯誤：序列是無限的
}
```

要使用 `generateSequence()` 建立一個有限序列，請提供一個在您需要的最後一個元素之後傳回 `null` 的函數。

```kotlin
fun main() {
    val oddNumbersLessThan10 = generateSequence(1) { if (it < 8) it + 2 else null }
    println(oddNumbersLessThan10.count())
}
```

### 從區塊

最後，有一個函數可以讓您逐一或以任意大小的區塊產生序列元素 –
[`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html) 函數。
此函數接受一個 lambda 表達式，其中包含對 [`yield()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence-scope/yield.html)
和 [`yieldAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence-scope/yield-all.html) 函數的呼叫。
它們會將一個元素傳回給序列的消費者，並暫停 `sequence()` 的執行，直到消費者請求下一個元素為止。
`yield()` 接受一個單一元素作為引數；`yieldAll()` 可以接受一個 `Iterable` 物件、
一個 `Iterator` 或另一個 `Sequence`。`yieldAll()` 的 `Sequence` 引數可以是無限的。但是，這樣的呼叫必須是
最後一個：所有後續呼叫都永遠不會執行。

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

序列操作可以根據其狀態要求分為以下幾類：

* _無狀態_（Stateless）操作不需要狀態，並且獨立處理每個元素，例如，[`map()`](collection-transformations#map) 或 [`filter()`](collection-filtering)。
   無狀態操作也可能需要少量的常數狀態來處理一個元素，例如，[`take()` 或 `drop()`](collection-parts)。
* _有狀態_（Stateful）操作需要大量的狀態，通常與序列中的元素數量成正比。

如果序列操作傳回另一個序列，該序列是延遲產生的，則稱為_中介_（intermediate）。
否則，該操作是_終端_（terminal）。終端操作的範例包括 [`toList()`](constructing-collections#copy)
或 [`sum()`](collection-aggregate)。序列元素只能透過終端操作來擷取。

序列可以被多次迭代；但是，某些序列實現可能會將自己限制為僅迭代
一次。這會在它們的文件中有特別說明。

## 序列處理範例

讓我們透過一個範例來看看 `Iterable` 和 `Sequence` 之間的差異。

### Iterable

假設您有一個單字列表。下面的程式碼過濾掉長度超過三個字元的單字，並印出
前四個此類單字的長度。

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

當您執行此程式碼時，您會看到 `filter()` 和 `map()` 函數的執行順序與它們在程式碼中出現的順序相同。
首先，您會看到所有元素的 `filter:`，然後是過濾後剩下的元素的 `length:`，然後是
最後兩行的輸出。

這就是列表處理的方式：

<img src="/img/list-processing.svg" alt="List processing" style={{verticalAlign: 'middle'}}/>

### Sequence

現在讓我們用序列編寫相同的程式碼：

```kotlin
fun main() {
    val words = "The quick brown fox jumps over the lazy dog".split(" ")
    //將 List 轉換為 Sequence
    val wordsSequence = words.asSequence()

    val lengthsSequence = wordsSequence.filter { println("filter: $it"); it.length > 3 }
        .map { println("length: ${it.length}"); it.length }
        .take(4)

    println("Lengths of first 4 words longer than 3 chars")
    // 終端操作：將結果取得為 List
    println(lengthsSequence.toList())
}
```

此程式碼的輸出顯示 `filter()` 和 `map()` 函數僅在建構結果列表時才被呼叫。
因此，您首先會看到文字行 `"Lengths of.."`，然後序列處理才會開始。
請注意，對於過濾後剩下的元素，map 會在過濾下一個元素之前執行。
當結果大小達到 4 時，處理就會停止，因為這是 `take(4)` 可以傳回的最大大小。

序列處理的方式如下：

<img src="/img/sequence-processing.svg" alt="Sequences processing" style={{verticalAlign: 'middle'}} width="700"/>

在此範例中，與使用列表方法相比，元素的延遲處理以及在找到四個項目後停止減少了操作次數。