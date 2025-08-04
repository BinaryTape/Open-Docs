[//]: # (title: 擷取集合部分)

Kotlin 標準函式庫包含用於擷取集合部分 (parts of a collection) 的擴充函式。這些函式提供多種方式來選擇結果集合的元素：明確列出它們的位置、指定結果大小，以及其他。

## Slice

[`slice()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/slice.html) 會回傳一個包含指定索引之集合元素的列表。這些索引可以作為一個 [範圍](ranges.md) 或作為一個整數值集合傳遞。

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

## Take and drop

若要從開頭取得指定數量的元素，請使用 [`take()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take.html) 函式。若要取得最後的元素，請使用 [`takeLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last.html)。當以大於集合大小的數字呼叫時，這兩個函式都會回傳整個集合。

若要取得除了指定數量開頭或結尾元素之外的所有元素，請分別呼叫 [`drop()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop.html) 和 [`dropLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last.html) 函式。

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

您也可以使用述詞 (predicates) 來定義要取用或捨棄的元素數量。有四個與上述函式類似的函式：

*   [`takeWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-while.html) 是帶有述詞的 `take()`：它會取得元素直到但不包含第一個不符合述詞的元素。如果集合的第一個元素不符合述詞，結果會是空的。
*   [`takeLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last-while.html) 與 `takeLast()` 類似：它會從集合的結尾取得符合述詞的元素範圍。該範圍的第一個元素是緊鄰在最後一個不符合述詞的元素之後的元素。如果集合的最後一個元素不符合述詞，結果會是空的；
*   [`dropWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-while.html) 與帶有相同述詞的 `takeWhile()` 相反：它會從第一個不符合述詞的元素開始回傳到結尾。
*   [`dropLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last-while.html) 與帶有相同述詞的 `takeLastWhile()` 相反：它會從開頭回傳到最後一個不符合述詞的元素。

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

## Chunked

若要將集合分解成指定大小的部分，請使用 [`chunked()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/chunked.html) 函式。`chunked()` 接受一個單一引數 — 區塊 (chunk) 的大小 — 並回傳指定大小的 `List` 的 `List`。第一個區塊從第一個元素開始，包含 `size` 個元素，第二個區塊包含接下來的 `size` 個元素，依此類推。最後一個區塊的大小可能會比較小。

```kotlin

fun main() {
//sampleStart
    val numbers = (0..13).toList()
    println(numbers.chunked(3))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

您也可以立即對回傳的區塊應用轉換。為此，在呼叫 `chunked()` 時，請將轉換作為 Lambda 函式提供。Lambda 引數是集合的一個區塊。當 `chunked()` 函式與轉換一起呼叫時，這些區塊是短期存在的 `List`，應直接在該 Lambda 中被消耗。

```kotlin

fun main() {
//sampleStart
    val numbers = (0..13).toList() 
    println(numbers.chunked(3) { it.sum() })  // `it` is a chunk of the original collection
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Windowed

您可以擷取指定大小的集合元素的所有可能範圍。取得這些範圍的函式稱為 [`windowed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/windowed.html)：它會回傳一個元素範圍的列表，這些範圍就像是您透過指定大小的滑動視窗 (sliding window) 觀察集合時所看到的。與 `chunked()` 不同，`windowed()` 會從集合中的*每個*元素開始回傳元素範圍（*視窗*）。所有視窗都作為單一 `List` 的元素回傳。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")    
    println(numbers.windowed(3))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`windowed()` 在具有預設值的參數方面提供更多彈性：

*   `step` 定義兩個相鄰視窗的第一個元素之間的距離。預設值為 1，因此結果包含從所有元素開始的視窗。如果您將步進 (step) 增加到 2，則只會收到從奇數元素開始的視窗：第一個、第三個，依此類推。
*   `partialWindows` 包含從集合末尾元素開始的較小尺寸視窗。例如，如果您請求包含三個元素的視窗，則無法為最後兩個元素建立。在這種情況下啟用 `partialWindows` 會包含另外兩個大小為 2 和 1 的列表。

最後，您可以立即對回傳的範圍應用轉換。為此，在呼叫 `windowed()` 時，請將轉換作為 Lambda 函式提供。

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

若要建立雙元素視窗，有一個單獨的函式 — [`zipWithNext()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip-with-next.html)。它會為接收者集合的相鄰元素建立配對。請注意，`zipWithNext()` 並不會將集合分解成多個配對；它會為除了最後一個元素之外的*每個*元素建立一個 `Pair`，因此它在 `[1, 2, 3, 4]` 上的結果是 `[[1, 2], [2, 3], [3, 4]]`，而不是 `[[1, 2], [3, 4]]`。`zipWithNext()` 也可以與轉換函式一起呼叫；該函式應將接收者集合的兩個元素作為引數。

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