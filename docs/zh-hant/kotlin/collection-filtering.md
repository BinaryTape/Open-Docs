---
title: "篩選集合 (Filtering collections)"
---
過濾 (Filtering) 是集合處理中最常見的任務之一。
在 Kotlin 中，過濾條件由 _謂詞_ (predicates) 定義 – 也就是接受一個集合元素並返回布林值 (`boolean value`) 的 Lambda 函數：`true` 表示給定的元素符合謂詞，`false` 則表示相反。

標準函式庫包含一組擴充函式，可讓您透過單次呼叫來過濾集合。
這些函式不會更改原始集合，因此它們適用於[可變和唯讀](collections-overview#collection-types)集合。若要操作過濾結果，您應該將其分配給變數，或在過濾後鏈接這些函式。

## 依據謂詞過濾 (Filter by predicate)

基本的過濾函式是 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)。
當使用謂詞呼叫時，`filter()` 會返回符合它的集合元素。
對於 `List` 和 `Set`，產生的集合都是 `List`，對於 `Map`，它也是 `Map`。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")  
    val longerThan3 = numbers.filter { it.length > 3 }
    println(longerThan3)

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredMap = numbersMap.filter { (key, value) `->` key.endsWith("1") && value > 10}
    println(filteredMap)

}
```

`filter()` 中的謂詞只能檢查元素的值。
如果要在過濾器中使用元素位置，請使用 [`filterIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-indexed.html)。
它採用一個具有兩個參數的謂詞：索引和元素的值。

要通過否定條件過濾集合，請使用[`filterNot()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-not.html)。
它返回一個元素列表，其中謂詞產生 `false`。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")
    
    val filteredIdx = numbers.filterIndexed { index, s `->` (index != 0) && (s.length < 5)  }
    val filteredNot = numbers.filterNot { it.length <= 3 }

    println(filteredIdx)
    println(filteredNot)

}
```

還有一些函式可以通過過濾給定類型的元素來縮小元素類型：

* [`filterIsInstance()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-is-instance.html) 返回
    給定類型的集合元素。 在 `List<Any>` 上呼叫時，`filterIsInstance<T>()` 會返回一個 `List<T>`，因此
    允許您在其項目上呼叫 `T` 類型的函式。

    ```kotlin
    fun main() {

        val numbers = listOf(null, 1, "two", 3.0, "four")
        println("All String elements in upper case:")
        numbers.filterIsInstance<String>().forEach {
            println(it.uppercase())
        }

    }
    ```
    

* [`filterNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-not-null.html) 返回所有
    不可為空的元素。 在 `List<T?>` 上呼叫時，`filterNotNull()` 會返回一個 `List<T: Any>`，因此允許您將
    這些元素視為不可為空的物件。

    ```kotlin
    fun main() {

        val numbers = listOf(null, "one", "two", null)
        numbers.filterNotNull().forEach {
            println(it.length)   // length is unavailable for nullable Strings
        }

    }
    ```
    

## 分區 (Partition)

另一個過濾函式 – [`partition()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/partition.html)
– 依據謂詞過濾集合，並將不符合謂詞的元素保存在單獨的列表中。
因此，您會得到一個 `Pair` 的 `List` 作為返回值：第一個列表包含符合謂詞的元素，
第二個列表包含原始集合中的所有其他內容。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")
    val (match, rest) = numbers.partition { it.length > 3 }

    println(match)
    println(rest)

}
```

## 測試謂詞 (Test predicates)

最後，有一些函式可以簡單地針對集合元素測試謂詞：

* 如果至少有一個元素符合給定的謂詞，[`any()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/any.html) 會返回 `true`。
* 如果沒有任何元素符合給定的謂詞，[`none()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/none.html) 會返回 `true`。
* 如果所有元素都符合給定的謂詞，[`all()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/all.html) 會返回 `true`。
    請注意，當對空集合使用任何有效的謂詞呼叫 `all()` 時，它會返回 `true`。 這種行為在邏輯上被稱為_[空真](https://en.wikipedia.org/wiki/Vacuous_truth)_。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")

    println(numbers.any { it.endsWith("e") })
    println(numbers.none { it.endsWith("a") })
    println(numbers.all { it.endsWith("e") })

    println(emptyList<Int>().all { it > 5 })   // vacuous truth

}
```

`any()` 和 `none()` 也可以在不使用謂詞的情況下使用：在這種情況下，它們只檢查集合是否為空。
如果存在元素，`any()` 返回 `true`，如果不存在元素，則返回 `false`； `none()` 則相反。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")
    val empty = emptyList<String>()

    println(numbers.any())
    println(empty.any())
    
    println(numbers.none())
    println(empty.none())

}
```