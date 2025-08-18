[//]: # (title: 取得單一元素)

Kotlin 集合提供一系列函數，用於從集合中取得單一元素。本頁描述的函數適用於列表和集合。

正如[列表的定義](collections-overview.md)所說，列表是一個有序集合。因此，列表中的每個元素都有其位置，您可以用於引用。除了本頁描述的函數之外，列表還提供更廣泛的方式來按索引取得和搜尋元素。欲了解更多詳細資訊，請參閱[列表特定操作](list-operations.md)。

相反地，集合根據[定義](collections-overview.md)不是有序集合。然而，Kotlin 的 `Set` 會以特定順序儲存元素。這些可以是插入順序（在 `LinkedHashSet` 中）、自然排序順序（在 `SortedSet` 中）或其他順序。集合中元素的順序也可能是未知的。在這種情況下，元素仍然以某種方式排序，因此，依賴元素位置的函數仍然會返回其結果。然而，除非呼叫者知道所使用的 `Set` 的具體實作，否則這些結果對於呼叫者來說是不可預測的。

## 按位置取得

為了取得特定位置的元素，有 [`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html) 函數。以整數作為參數呼叫它，您將會收到在指定位置的集合元素。第一個元素的位置是 `0`，最後一個元素的位置是 `(size - 1)`。

`elementAt()` 對於不提供索引存取，或靜態上不確定是否提供索引存取的集合很有用。對於 `List` 而言，使用[索引存取操作符](list-operations.md#retrieve-elements-by-index)（`get()` 或 `[]`）會更為慣用。

```kotlin

fun main() {
//sampleStart
    val numbers = linkedSetOf("one", "two", "three", "four", "five")
    println(numbers.elementAt(3))    

    val numbersSortedSet = sortedSetOf("one", "two", "three", "four")
    println(numbersSortedSet.elementAt(0)) // elements are stored in the ascending order
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

還有一些實用的別名，用於取得集合的第一個和最後一個元素：[`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 和 [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")
    println(numbers.first())    
    println(numbers.last())    
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

為了避免在取得不存在位置的元素時發生例外，請使用 `elementAt()` 的安全變體：

*   [`elementAtOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-null.html) 在指定位置超出集合範圍時返回 `null`。
*   [`elementAtOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-else.html) 還會接收一個 lambda 函數，該函數將 `Int` 參數映射到集合元素類型的實例。當以超出範圍的位置呼叫時，`elementAtOrElse()` 會返回 lambda 在給定值上的結果。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five")
    println(numbers.elementAtOrNull(5))
    println(numbers.elementAtOrElse(5) { index -> "The value for index $index is undefined"})
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 按條件取得

函數 [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 和 [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html) 也允許您在集合中搜尋符合給定謂詞的元素。當您呼叫帶有測試集合元素的謂詞的 `first()` 時，您將會收到謂詞返回 `true` 的第一個元素。相反地，帶有謂詞的 `last()` 會返回符合該謂詞的最後一個元素。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.first { it.length > 3 })
    println(numbers.last { it.startsWith("f") })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果沒有元素符合謂詞，這兩個函數都會拋出例外。為了避免它們，請改用 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html) 和 [`lastOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-or-null.html)：如果找不到符合的元素，它們會返回 `null`。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.firstOrNull { it.length > 6 })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果別名更適合您的情況，請使用它們：

*   [`find()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find.html) 代替 `firstOrNull()`
*   [`findLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find-last.html) 代替 `lastOrNull()`

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.find { it % 2 == 0 })
    println(numbers.findLast { it % 2 == 0 })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 透過選擇器取得

如果您需要在取得元素之前對集合進行映射，有一個函數 [`firstNotNullOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of.html)。它結合了 2 個動作：
- 使用選擇器函數映射集合
- 返回結果中第一個非 `null` 值

如果結果集合不包含非 `null` 元素，`firstNotNullOf()` 會拋出 `NoSuchElementException`。在這種情況下，請使用對應的 [`firstNotNullOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of-or-null.html) 來返回 `null`。

```kotlin
fun main() {
//sampleStart
    val list = listOf<Any>(0, "true", false)
    // Converts each element to string and returns the first one that has required length
    val longEnough = list.firstNotNullOf { item -> item.toString().takeIf { it.length >= 4 } }
    println(longEnough)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

## 隨機元素

如果您需要取得集合中的任意元素，請呼叫 [`random()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random.html) 函數。您可以在不帶參數的情況下呼叫它，或將 [`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html) 物件作為隨機性來源。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.random())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

在空集合上，`random()` 會拋出例外。為了返回 `null` 而不是例外，請使用 [`randomOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random-or-null.html)。

## 檢查元素存在性

為了檢查集合中是否存在元素，請使用 [`contains()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains.html) 函數。如果存在與函數參數 `equals()` 的集合元素，它將返回 `true`。您可以使用 `in` 關鍵字以操作符形式呼叫 `contains()`。

為了同時檢查多個實例是否存在，請呼叫 [`containsAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-all.html) 並將這些實例的集合作為參數。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.contains("four"))
    println("zero" in numbers)
    
    println(numbers.containsAll(listOf("four", "two")))
    println(numbers.containsAll(listOf("one", "zero")))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

此外，您可以透過呼叫 [`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-empty.html) 或 [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html) 來檢查集合是否包含任何元素。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.isEmpty())
    println(numbers.isNotEmpty())
    
    val empty = emptyList<String>()
    println(empty.isEmpty())
    println(empty.isNotEmpty())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}