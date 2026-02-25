[//]: # (title: Sequence)

除了 `collection` 外，Kotlin 標準函式庫還包含另一種型別 — `Sequence` ([`Sequence<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence/index.html))。
與 `collection` 不同，`Sequence` 不包含元素，而是在疊代時產生元素。
`Sequence` 提供與 [`Iterable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/index.html) 相同的函式，但對多步驟 `collection` 處理採用了另一種方法。

當 `Iterable` 的處理包含多個步驟時，它們會立即執行：每個處理步驟都會完成並傳回其結果 — 一個中間 `collection`。下一步驟在此 `collection` 上執行。相對地，`Sequence` 的多步驟處理在可能的情況下會延遲執行：只有在要求整個處理鏈的結果時，才會進行實際計算。

操作執行順序也不同：`Sequence` 會針對每個單一元素逐一執行所有處理步驟。而 `Iterable` 則會先完成整個 `collection` 的每個步驟，然後才進入下一步。

因此，`Sequence` 可讓您避免建置中間步驟的結果，進而提高整個 `collection` 處理鏈的效能。然而，`Sequence` 的延遲特性會增加一些開銷，這在處理較小的 `collection` 或進行較簡單的計算時可能很顯著。因此，您應該同時考慮 `Sequence` 與 `Iterable` 並決定哪一個更適合您的情況。

## 建置 (Construct)

### 來自元素

要建立 `Sequence`，請呼叫 [`sequenceOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence-of.html) 函式，並將元素列為其引數。

```kotlin
val numbersSequence = sequenceOf("four", "three", "two", "one")
```

### 來自 Iterable

如果您已經有一個 `Iterable` 物件（例如 `List` 或 `Set`），您可以透過呼叫 [`asSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-sequence.html) 來為其建立 `Sequence`。

```kotlin
val numbers = listOf("one", "two", "three", "four")
val numbersSequence = numbers.asSequence()

```

### 來自函式

建立 `Sequence` 的另一種方法是使用計算其元素的函式來建構。
要基於函式建構 `Sequence`，請呼叫 [`generateSequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/generate-sequence.html)，並將此函式作為引數。您可以選擇性地將第一個元素指定為明確的值或函式呼叫的結果。
當提供的函式傳回 `null` 時，`Sequence` 產生就會停止。因此，下面範例中的 `Sequence` 是無限的。

```kotlin

fun main() {
//sampleStart
    val oddNumbers = generateSequence(1) { it + 2 } // `it` 是前一個元素
    println(oddNumbers.take(5).toList())
    //println(oddNumbers.count())     // 錯誤：Sequence 是無限的
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要使用 `generateSequence()` 建立有限 `Sequence`，請提供一個在您需要的最後一個元素之後傳回 `null` 的函式。

```kotlin

fun main() {
//sampleStart
    val oddNumbersLessThan10 = generateSequence(1) { if (it < 8) it + 2 else null }
    println(oddNumbersLessThan10.count())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 來自區塊 (chunks)

最後，還有一個函式可以讓您逐個或按任意大小的區塊產生 `Sequence` 元素 — 即 [`sequence()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/sequence.html) 函式。
此函式接受一個 Lambda 運算式，其中包含對 [`yield()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence-scope/yield.html) 和 [`yieldAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/-sequence-scope/yield-all.html) 函式的呼叫。
它們會將一個元素傳回給 `Sequence` 取用者，並掛起 `sequence()` 的執行，直到取用者請求下一個元素。`yield()` 接受單一元素作為引數；`yieldAll()` 可以接受 `Iterable` 物件、`Iterator` 或另一個 `Sequence`。`yieldAll()` 的 `Sequence` 引數可以是無限的。但是，此類呼叫必須是最後一個：所有後續呼叫將永遠不會被執行。

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

## Sequence 操作

`Sequence` 操作根據其狀態需求可分為以下幾組：

* **無狀態 (Stateless)** 操作不需要狀態並獨立處理每個元素，例如 [`map()`](collection-transformations.md#map) 或 [`filter()`](collection-filtering.md)。無狀態操作也可能需要少量常數狀態來處理元素，例如 [`take()` 或 `drop()`](collection-parts.md)。
* **有狀態 (Stateful)** 操作需要大量狀態，通常與 `Sequence` 中的元素數量成正比。

如果 `Sequence` 操作傳回另一個延遲產生的 `Sequence`，則稱為**中間操作 (intermediate)**。否則，該操作即為**終端操作 (terminal)**。終端操作的範例包括 [`toList()`](constructing-collections.md#copy) 或 [`sum()`](collection-aggregate.md)。`Sequence` 元素只能透過終端操作擷取。

`Sequence` 可以多次疊代；但是，某些 `Sequence` 實作可能會限制自己只能疊代一次。這在它們的文件中會特別註明。

## Sequence 處理範例

讓我們透過一個範例來看看 `Iterable` 與 `Sequence` 之間的區別。

### Iterable

假設您有一個單字清單。下面的程式碼會篩選長度超過三個字元的單字，並印出前四個此類單字的長度。

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

當您執行此程式碼時，您會看到 `filter()` 和 `map()` 函式的執行順序與它們在程式碼中出現的順序相同。首先，您會看到所有元素的 `filter:`，然後是篩選後剩餘元素的 `length:`，最後是最後兩行的輸出。

這是清單處理的過程：

![清單處理](list-processing.svg)

### Sequence

現在讓我們用 `Sequence` 編寫相同的內容：

```kotlin

fun main() {
//sampleStart
    val words = "The quick brown fox jumps over the lazy dog".split(" ")
    // 將 List 轉換為 Sequence
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

此程式碼的輸出顯示，只有在建置結果清單時才會呼叫 `filter()` 和 `map()` 函式。因此，您會先看到文字行 `"Lengths of.."`，然後才開始 `Sequence` 處理。請注意，對於篩選後留下的元素，map 會在篩選下一個元素之前執行。當結果大小達到 4 時，處理就會停止，因為這是 `take(4)` 能夠傳回的最大可能大小。

`Sequence` 處理過程如下：

![Sequence 處理](sequence-processing.svg) {width="700"}

在此範例中，與使用清單的方法相比，元素的延遲處理以及在找到四個項目後停止的做法減少了操作次數。