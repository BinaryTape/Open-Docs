[//]: # (title: 篩選集合)

篩選是集合處理中最常見的任務之一。
在 Kotlin 中，篩選條件由_謂詞_定義 – 謂詞是接受集合元素並回傳布林值 (boolean value) 的 Lambda 函式：`true` 表示給定元素符合該謂詞，`false` 表示相反。

標準函式庫包含一組擴充函式，讓您可以單次呼叫即可篩選集合。
這些函式不會改變原始集合，因此它們適用於[可變與唯讀](collections-overview.md#collection-types)集合。若要操作篩選結果，您應該將其賦值給變數或在篩選後鏈接函式。

## 按謂詞篩選

基本篩選函式是 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)。
當使用謂詞呼叫時，`filter()` 會回傳符合該謂詞的集合元素。
對於 `List` 和 `Set`，結果集合是 `List`；對於 `Map`，它也是 `Map`。

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

`filter()` 中的謂詞只能檢查元素的數值。
如果您想在篩選中使用元素位置，請使用 [`filterIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-indexed.html)。
它接受一個具有兩個引數的謂詞：元素的索引和值。

若要按負面條件篩選集合，請使用 [`filterNot()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-not.html)。
它會回傳謂詞結果為 `false` 的元素列表。

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

還有一些函式透過篩選給定型別的元素來縮小元素型別：

* [`filterIsInstance()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-is-instance.html) 會回傳給定型別的集合元素。在 `List<Any>` 上呼叫時，`filterIsInstance<T>()` 會回傳 `List<T>`，因此允許您在其項目上呼叫 `T` 型別的函式。

    ```kotlin
    fun main() {
    //sampleStart
        val numbers = listOf(null, 1, "two", 3.0, "four")
        println("所有 String 元素均為大寫：")
        numbers.filterIsInstance<String>().forEach {
            println(it.uppercase())
        }
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

* [`filterNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-not-null.html) 會回傳所有非空元素。在 `List<T?>` 上呼叫時，`filterNotNull()` 會回傳 `List<T: Any>`，因此允許您將這些元素視為非空物件。

    ```kotlin
    fun main() {
    //sampleStart
        val numbers = listOf(null, "one", "two", null)
        numbers.filterNotNull().forEach {
            println(it.length)   // length 對於可空 Strings 不可用
        }
    //sampleEnd
    }
    ```
    {kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 分區

另一個篩選函式 – [`partition()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/partition.html) – 會按謂詞篩選集合，並將不符合該謂詞的元素保留在單獨的列表中。
因此，您會得到一個 `List` 型別的 `Pair` 作為回傳值：第一個列表包含符合謂詞的元素，第二個列表包含來自原始集合的所有其他元素。

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

最後，還有一些函式只是針對集合元素測試謂詞：

* [`any()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/any.html) 如果至少一個元素符合給定謂詞，則回傳 `true`。
* [`none()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/none.html) 如果沒有元素符合給定謂詞，則回傳 `true`。
* [`all()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/all.html) 如果所有元素都符合給定謂詞，則回傳 `true`。
    請注意，`all()` 在空集合上使用任何有效謂詞呼叫時都會回傳 `true`。這種行為在邏輯中被稱為_[空泛真理](https://en.wikipedia.org/wiki/Vacuous_truth)_。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    println(numbers.any { it.endsWith("e") })
    println(numbers.none { it.endsWith("a") })
    println(numbers.all { it.endsWith("e") })

    println(emptyList<Int>().all { it > 5 })   // 空泛真理
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`any()` 和 `none()` 也可以在沒有謂詞的情況下使用：在這種情況下，它們僅檢查集合是否為空。
`any()` 如果存在元素則回傳 `true`，否則回傳 `false`；`none()` 則執行相反操作。

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