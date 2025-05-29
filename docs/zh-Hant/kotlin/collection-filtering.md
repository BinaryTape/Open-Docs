[//]: # (title: 過濾集合)

過濾是集合處理中最常見的任務之一。在 Kotlin 中，過濾條件是透過 _判斷式 (predicates)_ 定義的，判斷式是 Lambda 函式，它接受一個集合元素並回傳一個布林值：`true` 表示給定的元素符合判斷式，`false` 表示不符合。

標準函式庫 (standard library) 包含一組擴充函式 (extension functions)，讓您只需一個呼叫即可過濾集合。這些函式不會改變原始集合，因此它們適用於[可變動 (mutable) 和唯讀 (read-only)](collections-overview.md#collection-types) 集合。若要操作過濾結果，您應該將其賦值給一個變數，或在過濾後鏈接 (chain) 其他函式。

## 依判斷式過濾

基本的過濾函式是 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)。當呼叫 `filter()` 並帶有判斷式時，它會回傳符合判斷式的集合元素。對於 `List` 和 `Set`，結果集合都是 `List`；對於 `Map`，結果仍是 `Map`。

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

`filter()` 中的判斷式只能檢查元素的值。如果您想在過濾時使用元素位置，請使用 [`filterIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-indexed.html)。它接受一個帶有兩個引數的判斷式：元素的索引 (index) 和值 (value)。

若要根據否定條件過濾集合，請使用 [`filterNot()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-not.html)。它回傳判斷式產生 `false` 的元素列表。

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

還有一些函式透過過濾給定型別的元素來縮小元素型別：

*   [`filterIsInstance()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-is-instance.html) 回傳給定型別的集合元素。當對 `List<Any>` 呼叫 `filterIsInstance<T>()` 時，它會回傳一個 `List<T>`，從而允許您對其項目呼叫 `T` 型別的函式。

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

*   [`filterNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-not-null.html) 回傳所有非空 (non-nullable) 元素。當對 `List<T?>` 呼叫 `filterNotNull()` 時，它會回傳一個 `List<T: Any>`，從而允許您將這些元素視為非空物件。

    ```kotlin
    fun main() {
    //sampleStart
        val numbers = listOf(null, "one", "two", null)
        numbers.filterNotNull().forEach {
            println(it.length)   // length is unavailable for nullable Strings
        }
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 分割 (Partition)

另一個過濾函式 – [`partition()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/partition.html) – 會根據判斷式過濾集合，並將不符合的元素保留在另一個獨立的列表中。因此，您將會得到一個 `List` 的 `Pair` 作為回傳值：第一個列表包含符合判斷式的元素，第二個列表包含原始集合中所有其他元素。

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

## 測試判斷式

最後，有一些函式只用於測試判斷式對集合元素的作用：

*   [`any()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/any.html) 如果至少有一個元素符合給定的判斷式，則回傳 `true`。
*   [`none()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/none.html) 如果沒有任何元素符合給定的判斷式，則回傳 `true`。
*   [`all()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/all.html) 如果所有元素都符合給定的判斷式，則回傳 `true`。請注意，當對空集合呼叫 `all()` 並帶有任何有效判斷式時，它會回傳 `true`。這種行為在邏輯上被稱為 _[空泛真理 (vacuous truth)](https://en.wikipedia.org/wiki/Vacuous_truth)_。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    println(numbers.any { it.endsWith("e") })
    println(numbers.none { it.endsWith("a") })
    println(numbers.all { it.endsWith("e") })

    println(emptyList<Int>().all { it > 5 })   // vacuous truth
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`any()` 和 `none()` 也可以在不帶判斷式的情況下使用：在這種情況下，它們僅檢查集合是否為空。`any()` 如果存在元素則回傳 `true`，如果不存在則回傳 `false`；`none()` 則相反。

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