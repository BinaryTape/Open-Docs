[//]: # (title: 擷取單一元素)

Kotlin 集合提供了一組用於從集合中擷取單一元素的函式。
本頁面描述的函式適用於 list 與 set。

如 [list 的定義](collections-overview.md)所述，list 是一個有序集合。
因此，list 的每個元素都有其位置，你可以用來引用。
除了本頁面描述的函式外，list 還提供了更多透過索引擷取和搜尋元素的方法。
詳情請參閱 [List 專屬操作](list-operations.md)。

相較之下，根據[定義](collections-overview.md)，set 不是有序集合。
然而，Kotlin 的 `Set` 會依據特定順序儲存元素。
這些順序可以是插入順序（在 `LinkedHashSet` 中）、自然排序順序（在 `SortedSet` 中）或其他順序。
一組元素的順序也可能是未知的。
在這種情況下，元素仍然會以某種方式排序，因此依賴元素位置的函式仍然會傳回結果。
然而，除非呼叫者知道所使用的 `Set` 具體實作，否則這類結果對呼叫者而言是不可預測的。

## 依位置擷取

若要擷取特定位置的元素，可以使用 [`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html) 函式。
呼叫它並傳入一個整數作為引數，你將會收到該位置的集合元素。
第一個元素的位置為 `0`，最後一個則為 `(size - 1)`。
 
`elementAt()` 對於不提供索引存取或靜態未知是否提供索引存取的集合非常有用。
對於 `List`，使用[索引存取運算子](list-operations.md#retrieve-elements-by-index)（`get()` 或 `[]`）更符合慣用寫法。

```kotlin

fun main() {
//sampleStart
    val numbers = linkedSetOf("one", "two", "three", "four", "five")
    println(numbers.elementAt(3))    

    val numbersSortedSet = sortedSetOf("one", "two", "three", "four")
    println(numbersSortedSet.elementAt(0)) // 元素以升序儲存
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

擷取集合中第一個和最後一個元素也有方便的別名：[`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)
與 [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)。

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

為了避免在擷取不存在的位置時產生例外，請使用 `elementAt()` 的安全變體：

* [`elementAtOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-null.html) 在指定位置超出集合範圍時傳回 null。
* [`elementAtOrElse()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at-or-else.html) 額外接受一個 Lambda 函式，該函式將 `Int` 引數對應到集合元素型別的執行個體。當呼叫位置超出範圍時，`elementAtOrElse()` 會傳回該值在 Lambda 上的執行結果。

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

函式 [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 與 [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)
也讓你可以在集合中搜尋符合特定謂詞（predicate）的元素。當你呼叫 `first()` 並傳入測試集合元素的謂詞時，你將會收到謂詞產生 `true` 的第一個元素。
相對地，帶有謂詞的 `last()` 會傳回最後一個符合條件的元素。

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

如果沒有元素符合謂詞，這兩個函式都會拋出例外。
若要避免例外，請改用 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html)
與 [`lastOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-or-null.html)：
如果找不到符合的元素，它們會傳回 `null`。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four", "five", "six")
    println(numbers.firstOrNull { it.length > 6 })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果別名的名稱更符合你的情境，請使用它們：

* 用 [`find()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find.html) 取代 `firstOrNull()`
* 用 [`findLast()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/find-last.html) 取代 `lastOrNull()`

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

## 使用選擇器擷取

如果你在擷取元素前需要先對集合進行對應，可以使用函式 [`firstNotNullOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of.html)。
它結合了 2 個動作：
- 使用選擇器函式對集合進行對應
- 傳回結果中第一個非 null 的值

如果產生的集合沒有非 null 元素，`firstNotNullOf()` 會拋出 `NoSuchElementException`。
在這種情況下，請使用對應的 [`firstNotNullOfOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-not-null-of-or-null.html) 來傳回 null。

```kotlin
fun main() {
//sampleStart
    val list = listOf<Any>(0, "true", false)
    // 將每個元素轉換為字串，並傳回第一個長度符合要求的元素
    val longEnough = list.firstNotNullOf { item -> item.toString().takeIf { it.length >= 4 } }
    println(longEnough)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

## 隨機元素

如果你需要擷取集合中的任意元素，請呼叫 [`random()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random.html) 函式。
你可以不帶引數呼叫它，或傳入一個 [`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html) 物件作為隨機來源。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.random())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

在空集合上，`random()` 會拋出例外。若要改為接收 `null`，請使用 [`randomOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random-or-null.html)

## 檢查元素是否存在

若要檢查集合中是否存在某個元素，請使用 [`contains()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains.html) 函式。
如果集合中存在一個與函式引數 `equals()` 相等的元素，它會傳回 `true`。
你可以使用 `in` 關鍵字的運算子形式來呼叫 `contains()`。

若要同時檢查多個執行個體是否存在，請呼叫 [`containsAll()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/contains-all.html) 並傳入包含這些執行個體的集合。

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

此外，你可以透過呼叫 [`isEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-empty.html) 或 [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html) 來檢查集合是否包含任何元素。

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