---
title: 檢索單個元素
---
Kotlin 集合提供了一組從集合中檢索單個元素 (single elements) 的函式。
此頁面描述的函式適用於列表 (lists) 和集合 (sets)。

正如[列表的定義](collections-overview)所說，列表是一個有序的集合。
因此，列表的每個元素都有其位置，你可以使用該位置進行引用。
除了此頁面描述的函式之外，列表還提供了更廣泛的方法，可以通過索引 (indices) 檢索和搜尋元素。
有關更多詳細資訊，請參閱[特定於列表的操作](list-operations)。

反過來說，根據[定義](collections-overview)，集合不是一個有序的集合。
但是，Kotlin 的 `Set` 以特定順序儲存元素。
這些可以是插入的順序（在 `LinkedHashSet` 中）、自然排序順序（在 `SortedSet` 中）或其他順序。
一組元素的順序也可能是未知的。
在這種情況下，元素仍然以某種方式排序，因此依賴於元素位置的函式仍然會傳回其結果。
但是，除非呼叫者知道所使用的 `Set` 的特定實現，否則這些結果對於呼叫者來說是不可預測的。

## 按位置檢索 (Retrieve by position)

對於檢索特定位置的元素，可以使用函式 [`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html)。
使用整數作為參數呼叫它，你將收到集合中給定位置的元素。
第一個元素的位置為 `0`，最後一個元素的位置為 `(size - 1)`。
 
`elementAt()` 適用於不提供索引訪問 (indexed access) 或靜態上已知不提供索引訪問的集合。
對於 `List`，使用[索引訪問運算符](list-operations#retrieve-elements-by-index) (`get()` 或 `[]`) 更符合習慣用法。

```kotlin

fun main() {

    val numbers = linkedSetOf("one", "two", "three", "four", "five")
    println(numbers.elementAt(3))    

    val numbersSortedSet = sortedSetOf("one", "two", "three", "four")
    println(numbersSortedSet.elementAt(0)) // elements are stored in the ascending order

}
```

還有一些有用的別名 (aliases) 用於檢索集合的第一個和最後一個元素：[`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)
和 [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five")
    println(numbers.first())    
    println(numbers.last())    

}
```

為了避免在檢索具有不存在位置的元素時出現例外 (exceptions)，請使用 `elementAt()` 的安全變體 (safe variations)：

* [`elementAtOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-null.html) 在指定位置超出集合範圍時傳回 null。
* [`elementAtOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-else.html) 另外接受一個 lambda 函式，該函式將 `Int` 參數映射到集合元素類型的實例。
   當使用超出範圍的位置呼叫時，`elementAtOrElse()` 會傳回給定值上 lambda 的結果。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five")
    println(numbers.elementAtOrNull(5))
    println(numbers.elementAtOrElse(5) { index `->` "The value for index $index is undefined"})

}
```

## 按條件檢索 (Retrieve by condition)

函式 [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 和 [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)
還允許你搜尋集合中與給定謂詞 (predicate) 匹配的元素。當你使用測試集合元素的謂詞呼叫 `first()` 時，你將收到謂詞產生 `true` 的第一個元素。
反過來說，帶有謂詞的 `last()` 會傳回與之匹配的最後一個元素。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.first { it.length > 3 })
    println(numbers.last { it.startsWith("f") })

}
```

如果沒有元素與謂詞匹配，則這兩個函式都會引發例外。
為了避免它們，請改用 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html)
和 [`lastOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-or-null.html)：
如果找不到匹配的元素，它們會傳回 `null`。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.firstOrNull { it.length > 6 })

}
```

如果別名的名稱更適合你的情況，請使用它們：

* [`find()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find.html) 而不是 `firstOrNull()`
* [`findLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find-last.html) 而不是 `lastOrNull()`

```kotlin

fun main() {

    val numbers = listOf(1, 2, 3, 4)
    println(numbers.find { it % 2 == 0 })
    println(numbers.findLast { it % 2 == 0 })

}
```

## 使用選擇器檢索 (Retrieve with selector)

如果你需要在檢索元素之前映射 (map) 集合，則可以使用函式 [`firstNotNullOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of.html)。
它結合了 2 個動作：
- 使用選擇器函式映射集合
- 傳回結果中的第一個非 null 值

如果結果集合沒有非可為 null 的元素 (non-nullable element)，`firstNotNullOf()` 會拋出 `NoSuchElementException`。
在這種情況下，使用對應的 [`firstNotNullOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of-or-null.html)
以傳回 null。

```kotlin
fun main() {

    val list = listOf<Any>(0, "true", false)
    // Converts each element to string and returns the first one that has required length
    val longEnough = list.firstNotNullOf { item `->` item.toString().takeIf { it.length >= 4 } }
    println(longEnough)

}
```

## 隨機元素 (Random element)

如果你需要檢索集合的任意元素 (arbitrary element)，請呼叫 [`random()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random.html) 函式。
你可以不帶參數或帶有 [`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html)
物件作為隨機性 (randomness) 的來源呼叫它。

```kotlin

fun main() {

    val numbers = listOf(1, 2, 3, 4)
    println(numbers.random())

}
```

在空集合上，`random()` 會拋出例外。要接收 `null` 作為替代，請使用 [`randomOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random-or-null.html)

## 檢查元素是否存在 (Check element existence)

要檢查集合中是否存在元素，請使用 [`contains()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains.html) 函式。
如果存在一個集合元素 `equals()` 該函式參數，則它會傳回 `true`。
你可以使用 `in` 關鍵字以運算符形式 (operator form) 呼叫 `contains()`。

要一次檢查多個實例 (multiple instances) 是否同時存在，請使用這些實例的集合作為參數呼叫 [`containsAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-all.html)。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.contains("four"))
    println("zero" in numbers)
    
    println(numbers.containsAll(listOf("four", "two")))
    println(numbers.containsAll(listOf("one", "zero")))

}
```

此外，你可以通過呼叫 [`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-empty.html)
或 [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html) 來檢查集合是否包含任何元素。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.isEmpty())
    println(numbers.isNotEmpty())
    
    val empty = emptyList<String>()
    println(empty.isEmpty())
    println(empty.isNotEmpty())

}
```