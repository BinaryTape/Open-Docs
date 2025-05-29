[//]: # (title: 排序)

集合類型中元素的順序是一個重要方面。例如，兩個包含相同元素的列表，如果其元素順序不同，則不相等。

在 Kotlin 中，物件的順序可以透過多種方式定義。

首先是 _自然順序_。它為 [`Comparable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html) 介面的實作所定義。當未指定其他順序時，自然順序用於對它們進行排序。

大多數內建類型都是可比較的：

*   數值類型使用傳統數值順序：`1` 大於 `0`；`-3.4f` 大於 `-5f`，以此類推。
*   `Char` 和 `String` 使用 [字典順序](https://en.wikipedia.org/wiki/Lexicographical_order)：`b` 大於 `a`；`world` 大於 `hello`。

要為使用者定義類型定義自然順序，請使該類型成為 `Comparable` 的實作器。這需要實作 `compareTo()` 函數。`compareTo()` 必須接受一個相同類型的物件作為參數，並回傳一個整數值來指示哪個物件較大：

*   正值表示接收者物件較大。
*   負值表示它小於參數。
*   零表示物件相等。

以下是一個用於排序由主要版本和次要版本組成的版本的類別。

```kotlin
class Version(val major: Int, val minor: Int): Comparable<Version> {
    override fun compareTo(other: Version): Int = when {
        this.major != other.major -> this.major compareTo other.major // compareTo() in the infix form 
        this.minor != other.minor -> this.minor compareTo other.minor
        else -> 0
    }
}

fun main() {    
    println(Version(1, 2) > Version(1, 3))
    println(Version(2, 0) > Version(1, 5))
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.6"}

_自訂順序_ 讓您可以按照自己喜歡的方式排序任何類型的實例。特別是，您可以為不可比較的物件定義順序，或者為可比較的類型定義自然順序以外的順序。要為某種類型定義自訂順序，請為其建立一個 [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/index.html)。`Comparator` 包含 `compare()` 函數：它接受類別的兩個實例，並回傳它們之間比較結果的整數。結果的解釋方式與上述 `compareTo()` 的結果相同。

```kotlin
fun main() {
//sampleStart
    val lengthComparator = Comparator { str1: String, str2: String -> str1.length - str2.length }
    println(listOf("aaa", "bb", "c").sortedWith(lengthComparator))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

有了 `lengthComparator`，您就能夠根據字串的長度而不是預設的字典順序來排列字串。

定義 `Comparator` 的一種更短的方式是標準函式庫中的 [`compareBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/compare-by.html) 函數。`compareBy()` 接受一個 lambda 函數，該函數從實例產生一個 `Comparable` 值，並將自訂順序定義為所產生值的自然順序。

使用 `compareBy()`，上面範例中的長度比較器看起來像這樣：

```kotlin
fun main() {
//sampleStart    
    println(listOf("aaa", "bb", "c").sortedWith(compareBy { it.length }))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

您還可以根據多個條件定義順序。例如，當字串長度相等時，若要按長度排序，然後按字母順序排序，您可以這樣寫：

```kotlin
fun main() {
//sampleStart
    val sortedStrings = listOf("aaa", "bb", "c", "b", "a", "aa", "ccc")
        .sortedWith { a, b -> 
           when (val compareLengths = a.length.compareTo(b.length)) {
             0 -> a.compareTo(b)
             else -> compareLengths
           }
         }

    println(sortedStrings)
    // [a, b, c, aa, bb, aaa, ccc]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

由於根據多個條件進行排序是一種常見情境，Kotlin 標準函式庫提供了 [`thenBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.comparisons/then-by.html) 函數，您可以使用它來新增次要排序規則。

例如，您可以將 `compareBy()` 與 `thenBy()` 結合使用，先依長度排序字串，然後再按字母順序排序，就像上一個範例一樣：

```kotlin
fun main() {
//sampleStart
    val sortedStrings = listOf("aaa", "bb", "c", "b", "a", "aa", "ccc")
        .sortedWith(compareBy<String> { it.length }.thenBy { it })

    println(sortedStrings)
    // [a, b, c, aa, bb, aaa, ccc]
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

Kotlin 集合套件提供了用於以自然順序、自訂順序甚至隨機順序對集合進行排序的函數。在本頁中，我們將介紹適用於 [唯讀](collections-overview.md#collection-types) 集合的排序函數。這些函數以包含原始集合元素按所請求順序的新集合形式回傳其結果。要了解關於對 [可變](collections-overview.md#collection-types) 集合進行原地排序的函數，請參閱 [列表專屬操作](list-operations.md#sort)。

## 自然順序

基本函數 [`sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html) 和 [`sortedDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-descending.html) 會根據其自然順序，將集合的元素以升序和降序序列回傳。這些函數適用於 `Comparable` 元素的集合。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    println("Sorted ascending: ${numbers.sorted()}")
    println("Sorted descending: ${numbers.sortedDescending()}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 自訂順序
 
對於自訂順序排序或不可比較物件的排序，可以使用 [`sortedBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by.html) 和 [`sortedByDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by-descending.html) 函數。它們接受一個選擇器函數，該函數將集合元素映射到 `Comparable` 值，並按照這些值的自然順序對集合進行排序。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    val sortedNumbers = numbers.sortedBy { it.length }
    println("Sorted by length ascending: $sortedNumbers")
    val sortedByLast = numbers.sortedByDescending { it.last() }
    println("Sorted by the last letter descending: $sortedByLast")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

要為集合排序定義自訂順序，您可以提供自己的 `Comparator`。為此，請呼叫 [`sortedWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-with.html) 函數並傳入您的 `Comparator`。有了這個函數，根據字串長度排序看起來像這樣：

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println("Sorted by length ascending: ${numbers.sortedWith(compareBy { it.length })}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 反轉順序

您可以使用 [`reversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reversed.html) 函數以反轉順序檢索集合。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.reversed())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`reversed()` 會回傳一個包含元素副本的新集合。因此，如果您稍後更改原始集合，這不會影響之前透過 `reversed()` 獲得的結果。

另一個反轉函數 — [`asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html) — 回傳相同集合實例的反轉視圖，因此如果原始列表不會改變，它可能比 `reversed()` 更輕量且更受青睞。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    val reversedNumbers = numbers.asReversed()
    println(reversedNumbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果原始列表是可變的，其所有更改都會反映在其反轉視圖中，反之亦然。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    val reversedNumbers = numbers.asReversed()
    println(reversedNumbers)
    numbers.add("five")
    println(reversedNumbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

然而，如果列表的可變性未知，或者來源根本不是列表，那麼 `reversed()` 更受青睞，因為其結果是一個將來不會改變的副本。

## 隨機順序

最後，有一個函數會回傳一個包含集合元素按隨機順序排列的新 `List` — [`shuffled()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffled.html)。您可以不帶參數呼叫它，或帶有一個 [`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html) 物件呼叫它。

```kotlin
fun main() {
//sampleStart
     val numbers = listOf("one", "two", "three", "four")
     println(numbers.shuffled())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}