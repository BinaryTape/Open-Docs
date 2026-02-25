[//]: # (title: 篩選集合)

篩選是集合處理中最常見的任務之一。
在 Kotlin 中，篩選條件是由 _謂詞 (predicate)_ 定義的 —— 這些 Lambda 函式接收一個集合元素並傳回一個布林值：`true` 表示該元素符合謂詞，`false` 則表示相反。

標準函式庫包含一組擴充方法，讓您透過單次呼叫即可篩選集合。這些函式不會更改原始集合，因此可用於[可變和唯讀](collections-overview.md#collection-types)集合。若要操作篩選結果，您應該將其指派給變數，或在篩選後使用鏈式呼叫。

## 按謂詞篩選

基本的篩選函式是 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)。
呼叫 `filter()` 並傳入謂詞時，它會傳回符合該條件的集合元素。對於 `List` 和 `Set`，產生的集合都是 `List`；對於 `Map`，產生的也是 `Map`。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")  
    val longerThan3 = numbers.filter { it.length > 3 }
    println(longerThan3)

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredMap = numbersMap.filter { (key, value) -> key.endsWith("1") && value > 10}
    println(filteredMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`filter()` 中的謂詞只能檢查元素的值。如果您想在篩選時使用元素的位置，請使用 [`filterIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-indexed.html)。它接收一個具有兩個引數的謂詞：索引和元素的值。

若要依據否定條件篩選集合，請使用 [`filterNot()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-not.html)。它會傳回謂詞結果為 `false` 的元素列表。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    
    val filteredIdx = numbers.filterIndexed { index, s -> (index != 0) && (s.length < 5)  }
    val filteredNot = numbers.filterNot { it.length <= 3 }

    println(filteredIdx)
    println(filteredNot)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

還有一些函式可透過篩選指定型別的元素來縮小元素型別：

* [`filterIsInstance()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-is-instance.html) 傳回指定型別的集合元素。在 `List<Any>` 上呼叫時，`filterIsInstance<T>()` 會傳回 `List<T>`，從而允許您對其中的項目呼叫 `T` 型別的函式。

    ```kotlin
    fun main() {
    //sampleStart
        val numbers = listOf(null, 1, "two", 3.0, "four")
        println("All String elements in upper case:")
        numbers.filterIsInstance<String>().forEach {
            println(it.uppercase())
        }
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

* [`filterNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-not-null.html) 傳回所有非 null 元素。在 `List<T?>` 上呼叫時，`filterNotNull()` 會傳回 `List<T: Any>`，從而讓您可以將這些元素視為非 null 物件。

    ```kotlin
    fun main() {
    //sampleStart
        val numbers = listOf(null, "one", "two", null)
        numbers.filterNotNull().forEach {
            println(it.length)   // 對於可 null 的 String，length 是不可用的
        }
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 分割

另一個篩選函式 —— [`partition()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/partition.html) —— 會依據謂詞篩選集合，並將不符合條件的元素保留在另一個單獨的列表中。因此，您會得到一個 `List` 的 `Pair` 作為傳回值：第一個列表包含符合謂詞的元素，第二個列表則包含原始集合中的其餘所有內容。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val (match, rest) = numbers.partition { it.length > 3 }

    println(match)
    println(rest)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 測試謂詞

最後，還有一些函式僅用於針對集合元素測試謂詞：

* [`any()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/any.html)：如果至少有一個元素符合給定謂詞，則傳回 `true`。
* [`none()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/none.html)：如果沒有元素符合給定謂詞，則傳回 `true`。
* [`all()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/all.html)：如果所有元素都符合給定謂詞，則傳回 `true`。請注意，在空集合上使用任何有效謂詞呼叫 `all()` 時都會傳回 `true`。這種行為在邏輯學中被稱為 _[空真 (vacuous truth)](https://en.wikipedia.org/wiki/Vacuous_truth)_。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    println(numbers.any { it.endsWith("e") })
    println(numbers.none { it.endsWith("a") })
    println(numbers.all { it.endsWith("e") })

    println(emptyList<Int>().all { it > 5 })   // 空真
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`any()` 和 `none()` 也可以在不帶謂詞的情況下使用：在這種情況下，它們僅檢查集合是否為空。如果存在元素，`any()` 傳回 `true`，否則傳回 `false`；`none()` 則相反。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val empty = emptyList<String>()

    println(numbers.any())
    println(empty.any())
    
    println(numbers.none())
    println(empty.none())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}