[//]: # (title: plus 與 minus 運算子)

在 Kotlin 中，為集合定義了 [`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) 與 [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html) (`-`) 運算子。
它們將集合作為第一個運算元；第二個運算元可以是元素或另一個集合。
傳回值是一個新的唯讀集合：

* `plus` 的結果包含來自原始集合 *以及* 來自第二個運算元的元素。
* `minus` 的結果包含原始集合的元素，但 *排除* 來自第二個運算元的元素。
   如果是元素，`minus` 會移除其 *第一次* 出現；如果是集合，則會移除其元素的 *所有* 出現。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    val plusList = numbers + "five"
    val minusList = numbers - listOf("three", "four")
    println(plusList)
    println(minusList)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

有關 Map 的 `plus` 與 `minus` 運算子詳情，請參閱 [Map 特定操作](map-operations.md)。
集合也定義了 [複合指派運算子](operator-overloading.md#augmented-assignments) [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 與 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`)。然而，對於唯讀集合，它們實際上是使用 `plus` 或 `minus` 運算子，並嘗試將結果指派給同一個變數。因此，它們僅適用於 `var` 唯讀集合。
對於可變集合，如果其為 `val`，則會修改該集合。更多詳情請參閱 [集合寫入操作](collection-write.md)。