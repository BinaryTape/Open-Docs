---
title: "檢索集合元件 (Retrieve collection parts)"
---
Kotlin 標準函式庫包含用於檢索集合部分的擴展函式 (extension functions)。
這些函式提供多種方式來選擇結果集合的元素：明確列出它們的位置、
指定結果大小等等。

## Slice

[`slice()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/slice.html) 傳回具有指定索引的集合元素的列表 (list)。索引可以作為[範圍](ranges)或整數值的集合傳遞。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five", "six")    
    println(numbers.slice(1..3))
    println(numbers.slice(0..4 step 2))
    println(numbers.slice(setOf(3, 5, 0)))    

}
```

## Take and drop

要取得從第一個元素開始的指定數量的元素，請使用 [`take()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take.html) 函數。
要取得最後的元素，請使用 [`takeLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last.html)。
當使用大於集合大小的數字呼叫時，這兩個函數都會傳回整個集合。

要取得除了給定數量的第一個或最後一個元素之外的所有元素，請分別呼叫 [`drop()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop.html)
和 [`dropLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last.html) 函數。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.take(3))
    println(numbers.takeLast(3))
    println(numbers.drop(1))
    println(numbers.dropLast(5))

}
```

您也可以使用謂詞 (predicate) 來定義要取得或捨棄的元素數量。
有四個與上述描述的函數類似的函數：

* [`takeWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-while.html) 是帶有謂詞的 `take()`：它取得元素，直到但不包括第一個不符合謂詞的元素。如果第一個集合元素不符合謂詞，則結果為空。
* [`takeLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last-while.html) 類似於 `takeLast()`：它從集合的末尾取得符合謂詞的元素範圍。該範圍的第一個元素是不符合謂詞的最後一個元素之後的元素。如果最後一個集合元素不符合謂詞，則結果為空；
* [`dropWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-while.html) 與帶有相同謂詞的 `takeWhile()` 相反：它傳回從第一個不符合謂詞的元素到結尾的元素。
* [`dropLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last-while.html) 與帶有相同謂詞的 `takeLastWhile()` 相反：它傳回從開頭到最後一個不符合謂詞的元素。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.takeWhile { !it.startsWith('f') })
    println(numbers.takeLastWhile { it != "three" })
    println(numbers.dropWhile { it.length == 3 })
    println(numbers.dropLastWhile { it.contains('i') })

}
```

## Chunked

要將集合分成給定大小的部分，請使用 [`chunked()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/chunked.html) 函數。
`chunked()` 採用單個參數 – 區塊 (chunk) 的大小 – 並傳回給定大小的 `List` 的 `List`。
第一個區塊從第一個元素開始，包含 `size` 個元素，第二個區塊包含下一個 `size` 個元素，
依此類推。最後一個區塊可能具有較小的大小。

```kotlin

fun main() {

    val numbers = (0..13).toList()
    println(numbers.chunked(3))

}
```

您也可以立即對傳回的區塊應用轉換 (transformation)。
為此，在呼叫 `chunked()` 時提供轉換作為 lambda 函數。
lambda 參數是集合的一個區塊。當使用轉換呼叫 `chunked()` 時，
這些區塊是短暫的 `List`，應在該 lambda 中立即使用。

```kotlin

fun main() {

    val numbers = (0..13).toList() 
    println(numbers.chunked(3) { it.sum() })  // `it` is a chunk of the original collection

}
```

## Windowed

您可以檢索給定大小的集合元素的所有可能範圍。
用於取得它們的函數稱為 [`windowed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/windowed.html)：
它傳回元素範圍的列表，如果您透過給定大小的滑動視窗查看集合，您將看到這些元素範圍。
與 `chunked()` 不同，`windowed()` 傳回從 *每個* 集合元素開始的元素範圍（_視窗_）。
所有視窗都作為單個 `List` 的元素傳回。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five")    
    println(numbers.windowed(3))

}
```

`windowed()` 透過可選參數提供更大的靈活性：

* `step` 定義兩個相鄰視窗的第一個元素之間的距離。預設值為 1，因此結果包含從所有元素開始的視窗。如果將步長增加到 2，您將只收到從奇數元素開始的視窗：第一個、第三個，依此類推。
* `partialWindows` 包括從集合末尾的元素開始的較小尺寸的視窗。例如，如果您請求三個元素的視窗，則無法為最後兩個元素建立它們。在這種情況下，啟用 `partialWindows` 會再包含兩個大小為 2 和 1 的列表。

最後，您可以立即對傳回的範圍應用轉換。
為此，在呼叫 `windowed()` 時提供轉換作為 lambda 函數。

```kotlin

fun main() {

    val numbers = (1..10).toList()
    println(numbers.windowed(3, step = 2, partialWindows = true))
    println(numbers.windowed(3) { it.sum() })

}
```

要建立雙元素視窗，有一個單獨的函數 - [`zipWithNext()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip-with-next.html)。
它建立接收器集合的相鄰元素對。
請注意，`zipWithNext()` 不會將集合分成對；它為除最後一個元素之外的_每個_元素建立一個 `Pair`，
因此它在 `[1, 2, 3, 4]` 上的結果是 `[[1, 2], [2, 3], [3, 4]]`，而不是 `[[1, 2`], `[3, 4]]`。
`zipWithNext()` 也可以使用轉換函數呼叫；它應該將接收器集合的兩個元素作為參數。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five")    
    println(numbers.zipWithNext())
    println(numbers.zipWithNext() { s1, s2 `->` s1.length > s2.length})

}
```