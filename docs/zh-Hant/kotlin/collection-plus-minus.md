[//]: # (title: 加減運算子)

在 Kotlin 中，[`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) 和 [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html) (`-`) 運算子為集合定義。
它們以集合作為第一個運算元；第二個運算元可以是元素，也可以是另一個集合。
回傳值是一個新的唯讀集合：

*   `plus` 的結果包含原始集合*和*第二個運算元中的元素。
*   `minus` 的結果包含原始集合中*除了*第二個運算元中的元素。
    如果是元素，`minus` 會移除其*第一個*出現的實例；如果是集合，則會移除其元素的*所有*出現實例。

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

有關 map 的 `plus` 和 `minus` 運算子的詳細資訊，請參閱 [Map 專屬運算](map-operations.md)。
複合指派運算子 (augmented assignment operators) [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 和 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 也為集合定義。然而，對於唯讀集合，它們實際上使用 `plus` 或 `minus` 運算子，並嘗試將結果指派給同一個變數。因此，它們僅適用於 `var` 唯讀集合。對於可變集合，如果它是 `val`，它們會修改該集合。有關更多詳細資訊，請參閱 [集合寫入運算](collection-write.md)。