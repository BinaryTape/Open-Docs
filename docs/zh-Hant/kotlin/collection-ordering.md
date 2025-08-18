[//]: # (title: 排序)

元素的順序是某些集合類型的重要方面。例如，兩個包含相同元素的列表，如果其元素順序不同，則不相等。

在 Kotlin 中，物件的順序可以透過幾種方式定義。

首先是*自然*順序。它定義於 [`Comparable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html) 介面的實作中。當未指定其他順序時，自然順序用於對其進行排序。

大多數內建類型都是可比較的：

*   數值類型使用傳統的數字順序：`1` 大於 `0`；`-3.4f` 大於 `-5f`，以此類推。
*   `Char` 和 `String` 使用 [詞典順序](https://en.wikipedia.org/wiki/Lexicographical_order)：`b` 大於 `a`；`world` 大於 `hello`。

要為使用者定義類型定義自然順序，請使該類型實作 `Comparable` 介面。這需要實作 `compareTo()` 函式。`compareTo()` 必須將相同類型的另一個物件作為引數，並返回一個整數值，顯示哪個物件較大：

*   正值表示接收者物件較大。
*   負值表示它小於引數。
*   零表示物件相等。

下面是一個用於排序版本（包含主要和次要部分）的類別。

```kotlin
class Version(val major: Int, val minor: Int): Comparable<Version> {
    override fun compareTo(other: Version): Int = when {
        this.major != other.major -> this.major compareTo other.major // 以中綴形式的 compareTo()
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

*自訂*順序讓您可以以喜歡的方式對任何類型的實例進行排序。特別是，您可以為不可比較的物件定義順序，或為可比較類型定義自然順序以外的順序。要為類型定義自訂順序，請為其建立一個 [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/index.html)。`Comparator` 包含 `compare()` 函式：它接受兩個類別實例並返回它們之間比較結果的整數值。結果的解釋方式與上述 `compareTo()` 的結果相同。

```kotlin
fun main() {
//sampleStart
    val lengthComparator = Comparator { str1: String, str2: String -> str1.length - str2.length }
    println(listOf("aaa", "bb", "c").sortedWith(lengthComparator))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

有了 `lengthComparator`，您就可以根據字串的長度而不是預設的詞典順序來排列字串。

定義 `Comparator` 的更簡潔方式是使用標準函式庫中的 [`compareBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/compare-by.html) 函式。`compareBy()` 接受一個 Lambda 函式，該函式從一個實例產生一個 `Comparable` 值，並將自訂順序定義為產生值的自然順序。

使用 `compareBy()`，上面範例中的長度比較器看起來像這樣：

```kotlin
fun main() {
//sampleStart    
    println(listOf("aaa", "bb", "c").sortedWith(compareBy { it.length }))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

您還可以根據多個條件定義順序。例如，要按字串長度排序，並在長度相等時按字母順序排序，您可以這樣寫：

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

由於多條件排序是一種常見情境，Kotlin 標準函式庫提供了 [`thenBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.comparisons/then-by.html) 函式，您可以用它來新增次要排序規則。

例如，您可以將 `compareBy()` 與 `thenBy()` 結合使用，以首先按字串長度排序，然後按字母順序排序，就像上一個範例一樣：

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

Kotlin 集合套件提供了用於自然順序、自訂順序甚至隨機順序排序集合的函式。在此頁面上，我們將描述適用於 [唯讀](collections-overview.md#collection-types) 集合的排序函式。這些函式將其結果作為一個新集合返回，該集合包含原始集合中以所需順序排列的元素。要了解用於[可變](collections-overview.md#collection-types)集合就地排序的函式，請參閱 [List 特有操作](list-operations.md#sort)。

## 自然順序

基本函式 [`sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html) 和 [`sortedDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-descending.html) 根據其自然順序將集合的元素按遞增和遞減順序排序返回。這些函式適用於 `Comparable` 元素的集合。

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
 
對於自訂順序排序或不可比較物件的排序，有 [`sortedBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by.html) 和 [`sortedByDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by-descending.html) 函式。它們接受一個選擇器函式，該函式將集合元素映射到 `Comparable` 值，並按這些值的自然順序排序集合。

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

要為集合排序定義自訂順序，您可以提供自己的 `Comparator`。為此，請呼叫 [`sortedWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-with.html) 函式並傳入您的 `Comparator`。使用此函式，按字串長度排序看起來像這樣：

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

您可以使用 [`reversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reversed.html) 函式以反轉順序檢索集合。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.reversed())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`reversed()` 返回一個包含元素副本的新集合。因此，如果您稍後更改原始集合，這不會影響先前獲得的 `reversed()` 結果。

另一個反轉函式 - [`asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html) - 返回同一集合實例的反轉檢視，因此如果原始列表不會更改，它可能比 `reversed()` 更輕量且更佳。

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

如果原始列表是可變的，其所有更改都會反映在其反轉檢視中，反之亦然。

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

但是，如果列表的可變性未知或來源根本不是列表，`reversed()` 更受青睞，因為其結果是一個不會在將來改變的副本。

## 隨機順序

最後，有一個函式返回一個包含集合元素隨機順序的新 `List` - [`shuffled()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffled.html)。您可以不帶引數或帶一個 [`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html) 物件呼叫它。

```kotlin
fun main() {
//sampleStart
     val numbers = listOf("one", "two", "three", "four")
     println(numbers.shuffled())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}