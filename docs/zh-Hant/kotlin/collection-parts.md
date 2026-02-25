[//]: # (title: 獲取集合的部分內容)

Kotlin 標準函式庫包含用於獲取集合部分內容的擴充函式。這些函式提供了多種方式來選擇結果集合的元素：明確列出它們的位置、指定結果大小等。

## Slice

[`slice()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/slice.html) 會傳回具有指定索引的集合元素列表。索引可以作為 [範圍 (range)](ranges.md) 或整數值的集合傳遞。

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

## Take 與 drop

若要從第一個元素開始獲取指定數量的元素，請使用 [`take()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take.html) 函式。若要獲取最後幾個元素，請使用 [`takeLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last.html)。當呼叫時傳入的數字大於集合大小時，這兩個函式都會傳回整個集合。

若要獲取除指定數量的開頭或末尾元素之外的所有元素，請分別呼叫 [`drop()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop.html) 和 [`dropLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last.html) 函式。

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

您還可以使用述詞 (predicate) 來定義要獲取或捨棄的元素數量。有四個與上述描述類似的函式：

* [`takeWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-while.html) 是帶有述詞的 `take()`：它會獲取元素，直到但不包括第一個不符合述詞的元素。如果第一個集合元素就不符合述詞，則結果為空。
* [`takeLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/take-last-while.html) 與 `takeLast()` 類似：它從集合末尾開始獲取符合述詞的元素範圍。該範圍的第一個元素是緊鄰最後一個不符合述詞元素之後的元素。如果最後一個集合元素不符合述詞，則結果為空。
* [`dropWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-while.html) 與使用相同述詞的 `takeWhile()` 相反：它傳回從第一個不符合述詞的元素到末尾的所有元素。
* [`dropLastWhile()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/drop-last-while.html) 與使用相同述詞的 `takeLastWhile()` 相反：它傳回從開頭到最後一個不符合述詞的元素之間的所有元素。

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

若要將集合拆分為給定大小的部分，請使用 [`chunked()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/chunked.html) 函式。`chunked()` 接受單個引數——區塊 (chunk) 的大小——並傳回一個由該大小的 `List` 組成的 `List`。第一個區塊從第一個元素開始並包含 `size` 個元素，第二個區塊包含接下來的 `size` 個元素，依此類推。最後一個區塊的大小可能較小。

```kotlin

fun main() {
//sampleStart
    val numbers = (0..13).toList()
    println(numbers.chunked(3))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

您還可以立即對傳回的區塊套用轉換。為此，請在呼叫 `chunked()` 時以 Lambda 函式提供轉換。Lambda 引數是集合的一個區塊。當使用轉換呼叫 `chunked()` 時，這些區塊是短期的 `List`，應直接在該 Lambda 中被取用。

```kotlin

fun main() {
//sampleStart
    val numbers = (0..13).toList() 
    println(numbers.chunked(3) { it.sum() })  // `it` 是原始集合的一個區塊
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Windowed

您可以獲取集合元素中所有給定大小的可能範圍。獲取它們的函式稱為 [`windowed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/windowed.html)：它會傳回一個元素範圍列表，就像您透過給定大小的滑動視窗觀察集合時所看到的那樣。與 `chunked()` 不同，`windowed()` 傳回從*每個*集合元素開始的元素範圍（視窗）。所有的視窗都作為單個 `List` 的元素傳回。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")    
    println(numbers.windowed(3))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`windowed()` 透過具備預設值的參數提供更多靈活性：

* `step` 定義了兩個相鄰視窗的第一個元素之間的距離。預設值為 1，因此結果包含從所有元素開始的視窗。如果您將步長 (step) 增加到 2，則只會收到從奇數元素開始的視窗：第一、第三，依此類推。
* `partialWindows` 包含從集合末尾元素開始的大小較小的視窗。例如，如果您請求三個元素的視窗，則無法為最後兩個元素建置完整的視窗。在這種情況下啟用 `partialWindows` 會額外包含兩個大小分別為 2 和 1 的列表。

最後，您可以立即對傳回的範圍套用轉換。為此，請在呼叫 `windowed()` 時以 Lambda 函式提供轉換。

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

若要建置兩個元素的視窗，有一個單獨的函式 - [`zipWithNext()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip-with-next.html)。它會建立接收者集合中相鄰元素的配對。注意 `zipWithNext()` 不會將集合拆分為成對；它會為除最後一個元素外的*每個*元素建立一個 `Pair`，因此它對 `[1, 2, 3, 4]` 的結果是 `[[1, 2], [2, 3], [3, 4]]`，而不是 `[[1, 2], [3, 4]]`。`zipWithNext()` 也可以使用轉換函式來呼叫；該函式應接受接收者集合的兩個元素作為引數。

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