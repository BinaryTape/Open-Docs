[//]: # (title: 加號和減號運算子)

在 Kotlin 中，針對集合定義了 [`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) 和 [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html) (`-`) 運算子。
它們將集合作為第一個運算元；第二個運算元可以是元素或另一個集合。
回傳值是一個新的唯讀集合：

* `plus` 的結果包含來自原始集合 _以及_ 第二個運算元的元素。
* `minus` 的結果包含來自原始集合的元素，_但不包含_ 來自第二個運算元的元素。
   如果它是單一元素，`minus` 會移除其 _首次_ 出現；如果它是一個集合，則會移除其所有元素的 _所有_ 出現。

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

關於映射的 `plus` 和 `minus` 運算子詳細資訊，請參閱 [映射特定操作](map-operations.md)。
針對集合也定義了 [複合指定運算子](operator-overloading.md#augmented-assignments) [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html) (`+=`) 和 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`)。然而，對於唯讀集合，它們實際上會使用 `plus` 或 `minus` 運算子，並嘗試將結果指定給同一個變數。因此，它們僅適用於 `var` 唯讀集合。
對於可變集合，如果它是 `val`，它們會修改該集合。有關更多詳細資訊，請參閱 [集合寫入操作](collection-write.md)。