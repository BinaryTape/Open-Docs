[//]: # (title: 檢索集合部分)

Kotlin 標準函式庫包含延伸函式，用於檢索集合的部分。
這些函式提供多種方式來選擇結果集合的元素：明確列出其位置、指定結果大小等。

## Slice

[`slice()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/slice.html) 函式會回傳具有指定索引的集合元素列表。索引可以作為 [範圍](ranges.md) 或整數值集合傳遞。

```kotlin

fun main() {
//sampleStart    
    val numbers = listOf("one", "two", "three", "four", "five", "six")    
    println(numbers.slice(1..3))
    println(numbers.slice(0..4 step 2))
    println(numbers.slice(setOf(3, 5, 0)))    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 擷取與捨棄

若要從第一個元素開始取得指定數量的元素，請使用 [`take()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take.html) 函式。
若要取得最後幾個元素，請使用 [`takeLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last.html)。
當呼叫時傳入的數字大於集合大小，這兩個函式都會回傳整個集合。

若要取得除了指定數量的前面或後面元素之外的所有元素，請分別呼叫 [`drop()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop.html) 和 [`dropLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last.html) 函式。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.take(3))
    println(numbers.takeLast(3))
    println(numbers.drop(1))
    println(numbers.dropLast(5))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

您也可以使用述詞 (predicate) 來定義要擷取或捨棄的元素數量。
有四個函式與上述函式類似：

*   [`takeWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-while.html) 是帶有述詞的 `take()` 函式：它會擷取元素，直到但不包括第一個不符合述詞的元素為止。如果集合的第一個元素不符合述詞，結果將為空。
*   [`takeLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last-while.html) 與 `takeLast()` 類似：它會從集合末端擷取符合述詞的元素範圍。該範圍的第一個元素是最後一個不符合述詞的元素旁邊的元素。如果集合的最後一個元素不符合述詞，結果將為空；
*   [`dropWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-while.html) 與帶有相同述詞的 `takeWhile()` 相反：它會從第一個不符合述詞的元素開始，回傳直到集合末端的所有元素。
*   [`dropLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last-while.html) 與帶有相同述詞的 `takeLastWhile()` 相反：它會從頭開始回傳元素，直到但不包括最後一個不符合述詞的元素為止。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.takeWhile { !it.startsWith('f') })
    println(numbers.takeLastWhile { it != "three" })
    println(numbers.dropWhile { it.length == 3 })
    println(numbers.dropLastWhile { it.contains('i') })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 分塊

若要將集合分解成給定大小的部分，請使用 [`chunked()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/chunked.html) 函式。
`chunked()` 函式接受一個單一參數 — 塊 (chunk) 的大小 — 並回傳一個包含給定大小列表的列表。
第一個塊從第一個元素開始，包含 `size` 個元素；第二個塊包含接下來的 `size` 個元素，依此類推。最後一個塊的大小可能較小。

```kotlin

fun main() {
//sampleStart
    val numbers = (0..13).toList()
    println(numbers.chunked(3))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

您也可以立即對回傳的塊應用轉換。
為此，在呼叫 `chunked()` 時將轉換作為 lambda 函式提供。
lambda 引數是集合的一個塊。當 `chunked()` 函式被呼叫並帶有轉換時，這些塊是短暫存在的 `List`，應該在該 lambda 函式中立即使用。

```kotlin

fun main() {
//sampleStart
    val numbers = (0..13).toList() 
    println(numbers.chunked(3) { it.sum() })  // `it` is a chunk of the original collection
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 視窗化

您可以檢索給定大小的集合元素的所有可能範圍。
取得這些範圍的函式稱為 [`windowed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/windowed.html)：它會回傳一個元素範圍的列表，這些範圍就像您透過給定大小的滑動視窗 (sliding window) 查看集合時所看到的。
與 `chunked()` 不同，`windowed()` 會回傳從集合中**每個**元素開始的元素範圍 (即視窗)。所有視窗都會作為單一 `List` 的元素回傳。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")    
    println(numbers.windowed(3))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`windowed()` 提供更多彈性，並帶有可選參數：

*   `step` 定義兩個相鄰視窗的第一個元素之間的距離。預設值為 1，因此結果包含從所有元素開始的視窗。如果您將 `step` 增加到 2，則只會收到從奇數元素開始的視窗：第一個、第三個，依此類推。
*   `partialWindows` 包含從集合末端元素開始的較小尺寸視窗。例如，如果您請求三個元素的視窗，則無法為最後兩個元素建立它們。在這種情況下啟用 `partialWindows` 將包含兩個更多大小為 2 和 1 的列表。

最後，您可以立即對回傳的範圍應用轉換。
為此，在呼叫 `windowed()` 時將轉換作為 lambda 函式提供。

```kotlin

fun main() {
//sampleStart
    val numbers = (1..10).toList()
    println(numbers.windowed(3, step = 2, partialWindows = true))
    println(numbers.windowed(3) { it.sum() })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

若要建立兩個元素的視窗，有一個單獨的函式 — [`zipWithNext()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip-with-next.html)。
它會為接收集合的相鄰元素建立對。
請注意，`zipWithNext()` 不會將集合分成對；它會為**每個**元素（除了最後一個）建立一個 `Pair`，因此它在 `[1, 2, 3, 4]` 上的結果是 `[[1, 2], [2, 3], [3, 4]]`，而不是 `[[1, 2], [3, 4]]`。
`zipWithNext()` 也可以與轉換函式一起呼叫；它應該將接收集合的兩個元素作為引數。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")    
    println(numbers.zipWithNext())
    println(numbers.zipWithNext() { s1, s2 -> s1.length > s2.length})
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}