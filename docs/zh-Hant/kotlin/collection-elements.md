[//]: # (title: 取得單一元素)

Kotlin 集合提供一組函數，用於從集合中擷取單一元素。本頁描述的函數適用於列表（List）和集合（Set）。

正如[列表的定義](collections-overview.md)所述，列表是一個有序的集合。因此，列表中的每個元素都有其位置，您可以藉此進行參考。除了本頁描述的函數之外，列表還提供了更廣泛的方式，透過索引來擷取和搜尋元素。更多詳細資訊，請參閱[列表特定操作](list-operations.md)。

反之，根據[定義](collections-overview.md)，集合並非一個有序的集合。然而，Kotlin 的 `Set` 會以特定順序儲存元素。這些順序可以是插入順序（在 `LinkedHashSet` 中）、自然排序順序（在 `SortedSet` 中），或另一種順序。集合元素的順序也可能是未知的。在這種情況下，元素仍然會以某種方式排序，因此依賴於元素位置的函數仍然會傳回其結果。然而，除非呼叫者知道所使用的 `Set` 特定實作，否則這些結果是不可預測的。

## 依位置擷取

為了擷取特定位置的元素，可以使用函數 [`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html)。呼叫時以整數作為引數，您將會收到給定位置的集合元素。第一個元素的位置是 `0`，最後一個是 `(size - 1)`。

`elementAt()` 對於那些不提供索引存取，或無法靜態地確定是否提供索引存取的集合很有用。對於 `List` 而言，更慣用的做法是使用[索引存取運算子](list-operations.md#retrieve-elements-by-index)（`get()` 或 `[]`）。

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

還有一些有用的別名，用於擷取集合的第一個和最後一個元素：[`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 和 [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)。

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

為了避免在擷取不存在位置的元素時產生例外，請使用 `elementAt()` 的安全變體：

* [`elementAtOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-null.html) 當指定位置超出集合範圍時傳回 null。
* [`elementAtOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-else.html) 額外接收一個 lambda 函數，該函數將 `Int` 引數映射到集合元素類型的一個實例。當呼叫時給定一個超出範圍的位置，`elementAtOrElse()` 會傳回 lambda 函數作用於給定值後的結果。

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

## 依條件擷取

函數 [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 和 [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html) 也讓您可以搜尋集合，以尋找符合給定謂詞的元素。當您呼叫 `first()` 並帶有測試集合元素的謂詞時，您將會收到謂詞傳回 `true` 的第一個元素。反之，帶有謂詞的 `last()` 則傳回符合該謂詞的最後一個元素。

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

如果沒有元素符合謂詞，這兩個函數都會拋出例外。為了避免這些例外，請改用 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html) 和 [`lastOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-or-null.html)：如果沒有找到符合的元素，它們會傳回 `null`。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.firstOrNull { it.length > 6 })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果它們的名稱更符合您的情況，請使用這些別名：

* [`find()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find.html) 取代 `firstOrNull()`
* [`findLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find-last.html) 取代 `lastOrNull()`

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

## 依選擇器擷取

如果您需要在擷取元素之前對集合進行映射，可以使用函數 [`firstNotNullOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of.html)。它結合了兩個動作：
- 使用選擇器函數映射集合
- 傳回結果中的第一個非 null 值

`firstNotNullOf()` 如果結果集合中沒有非 null 元素，則會拋出 `NoSuchElementException`。請使用對應的函數 [`firstNotNullOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of-or-null.html)，以便在此情況下傳回 null。

```kotlin
fun main() {
//sampleStart
    val list = listOf<Any>(0, "true", false)
    // 將每個元素轉換為字串，並傳回第一個具有所需長度的元素
    val longEnough = list.firstNotNullOf { item -> item.toString().takeIf { it.length >= 4 } }
    println(longEnough)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

## 隨機元素

如果您需要擷取集合中的任意元素，請呼叫 [`random()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random.html) 函數。您可以不帶引數呼叫它，或者帶有一個 [`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html) 物件作為隨機性來源。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.random())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

對於空集合，`random()` 會拋出例外。為了改為接收 `null`，請使用 [`randomOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random-or-null.html)。

## 檢查元素是否存在

為了檢查集合中是否存在某個元素，請使用 [`contains()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains.html) 函數。如果集合中存在一個元素與函數引數 `equals()` (相等)，則它會傳回 `true`。您可以以運算子形式呼叫 `contains()`，並使用 `in` 關鍵字。

為了同時檢查多個實例是否存在，請呼叫 [`containsAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-all.html) 並將這些實例的集合作為引數。

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