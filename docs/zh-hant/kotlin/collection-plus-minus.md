---
title: 加號和減號運算符
---
在 Kotlin 中，[`plus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus.html) (`+`) 和 [`minus`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus.html) (`-`) 運算符是為集合 (collection) 定義的。
它們將一個集合作為第一個運算元 (operand)；第二個運算元可以是一個元素 (element) 或另一個集合。
返回值是一個新的唯讀集合：

* `plus` 的結果包含原始集合中的元素 _以及_ 第二個運算元中的元素。
* `minus` 的結果包含原始集合中的元素 _除了_ 第二個運算元中的元素。
   如果第二個運算元是一個元素，`minus` 會移除它的 _第一次_ 出現；如果它是一個集合，則會移除其元素的所有出現。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")

    val plusList = numbers + "five"
    val minusList = numbers - listOf("three", "four")
    println(plusList)
    println(minusList)

}
```

有關 `plus` 和 `minus` 運算符對於映射 (map) 的詳細資訊，請參閱 [Map specific operations](map-operations)。
增強賦值運算符 [augmented assignment operators](operator-overloading#augmented-assignments) [`plusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/plus-assign.html)
(`+=`) 和 [`minusAssign`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/minus-assign.html) (`-=`) 也是
為集合定義的。但是，對於唯讀集合，它們實際上使用 `plus` 或 `minus` 運算符，並
嘗試將結果賦值給同一個變數。因此，它們僅在 `var` 唯讀集合上可用。
對於可變集合，如果它是 `val`，它們會修改該集合。 詳情請參閱 [Collection write operations](collection-write)。