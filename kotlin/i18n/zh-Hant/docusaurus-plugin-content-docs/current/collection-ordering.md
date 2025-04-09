---
title: "排序 (Ordering)"
---
元素的順序是某些集合類型的一個重要方面。
例如，如果兩個具有相同元素的列表，其元素順序不同，則它們不相等。

在 Kotlin 中，對象的順序可以通過幾種方式定義。

首先，存在_自然_順序（_natural_ order）。它為 [`Comparable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html)
介面的實作定義。當未指定其他順序時，自然順序用於對它們進行排序。

大多數內建類型都是可比較的：

* 數值類型使用傳統的數值順序：`1` 大於 `0`；`-3.4f` 大於 `-5f`，依此類推。
* `Char` 和 `String` 使用[詞典順序](https://en.wikipedia.org/wiki/Lexicographical_order)：`b` 大於
   `a`；`world` 大於 `hello`。

若要為使用者定義的類型定義自然順序，請使該類型實作 `Comparable`。
這需要實作 `compareTo()` 函式。`compareTo()` 必須採用相同類型的另一個物件作為引數，
並傳回一個整數值，顯示哪個物件更大：

* 正值表示接收器物件更大。
* 負值表示它小於引數。
* 零表示物件相等。

以下是一個用於排序版本的類別，該版本由主要部分和次要部分組成。

```kotlin
class Version(val major: Int, val minor: Int): Comparable<Version> {
    override fun compareTo(other: Version): Int = when {
        this.major != other.major `->` this.major compareTo other.major // compareTo() in the infix form 
        this.minor != other.minor `->` this.minor compareTo other.minor
        else `->` 0
    }
}

fun main() {    
    println(Version(1, 2) > Version(1, 3))
    println(Version(2, 0) > Version(1, 5))
}
```

_自訂_順序（_Custom_ order）可讓您以您喜歡的方式對任何類型的實例進行排序。
特別是，您可以為不可比較的物件定義順序，或為可比較的類型定義與自然順序不同的順序。
若要為類型定義自訂順序，請為其建立一個 [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/index.html)。
`Comparator` 包含 `compare()` 函式：它採用一個類別的兩個實例，並傳回它們之間比較的整數結果。
結果的解譯方式與上面描述的 `compareTo()` 的結果相同。

```kotlin
fun main() {

    val lengthComparator = Comparator { str1: String, str2: String `->` str1.length - str2.length }
    println(listOf("aaa", "bb", "c").sortedWith(lengthComparator))

}
```

有了 `lengthComparator`，您就可以按字串的長度而不是預設的詞典順序來排列字串。

定義 `Comparator` 的一種較短方法是標準函式庫中的 [`compareBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/compare-by.html)
函式。`compareBy()` 採用一個 lambda 函式，該函式從實例產生一個 `Comparable` 值，
並將自訂順序定義為所產生值的自然順序。

使用 `compareBy()`，上面範例中的長度比較器如下所示：

```kotlin
fun main() {

    println(listOf("aaa", "bb", "c").sortedWith(compareBy { it.length }))

}
```

您還可以根據多個條件定義順序。
例如，若要在長度相等時按長度和字母順序對字串進行排序，您可以編寫：

```kotlin
fun main() {

    val sortedStrings = listOf("aaa", "bb", "c", "b", "a", "aa", "ccc")
        .sortedWith { a, b `->` 
           when (val compareLengths = a.length.compareTo(b.length)) {
             0 `->` a.compareTo(b)
             else `->` compareLengths
           }
         }

    println(sortedStrings)
    // [a, b, c, aa, bb, aaa, ccc]

}
```

由於按多個條件排序是一種常見的場景，因此 Kotlin 標準函式庫提供了 [`thenBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.comparisons/then-by.html) 函式，您可以使用它來新增次要排序規則。

例如，您可以將 `compareBy()` 與 `thenBy()` 結合使用，以首先按長度，然後按字母順序對字串進行排序，就像上一個範例中一樣：

```kotlin
fun main() {

    val sortedStrings = listOf("aaa", "bb", "c", "b", "a", "aa", "ccc")
        .sortedWith(compareBy<String> { it.length }.thenBy { it })

    println(sortedStrings)
    // [a, b, c, aa, bb, aaa, ccc]

}
```

Kotlin 集合套件提供了用於按自然順序、自訂順序甚至隨機順序對集合進行排序的函式。
在本頁中，我們將描述適用於[唯讀](collections-overview#collection-types)集合的排序函式。
這些函式將其結果作為一個新集合傳回，該集合包含原始集合的元素，並以請求的順序排列。
若要了解有關就地排序[可變](collections-overview#collection-types)集合的函式，請參閱[特定於列表的操作](list-operations#sort)。

## 自然順序

基本函式 [`sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html) 和 [`sortedDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-descending.html)
傳回集合的元素，這些元素根據其自然順序排序為升序和降序序列。
這些函式適用於 `Comparable` 元素的集合。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")

    println("Sorted ascending: ${numbers.sorted()}")
    println("Sorted descending: ${numbers.sortedDescending()}")

}
```

## 自訂順序
 
若要按自訂順序排序或對不可比較的物件進行排序，可以使用函式 [`sortedBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by.html) 和 [`sortedByDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by-descending.html)。
它們採用一個選擇器函式，該函式將集合元素對應到 `Comparable` 值，並按該值的自然順序對集合進行排序。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")

    val sortedNumbers = numbers.sortedBy { it.length }
    println("Sorted by length ascending: $sortedNumbers")
    val sortedByLast = numbers.sortedByDescending { it.last() }
    println("Sorted by the last letter descending: $sortedByLast")

}
```

若要為集合排序定義自訂順序，您可以提供您自己的 `Comparator`。
為此，請呼叫 [`sortedWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-with.html) 函式，並傳入您的 `Comparator`。
使用此函式，按字串長度排序如下所示：

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")
    println("Sorted by length ascending: ${numbers.sortedWith(compareBy { it.length })}")

}
```

## 反向順序

您可以使用 [`reversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reversed.html) 函式以反向順序檢索集合。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")
    println(numbers.reversed())

}
```

`reversed()` 傳回一個包含元素副本的新集合。
因此，如果您稍後變更原始集合，這不會影響先前取得的 `reversed()` 結果。

另一個反轉函式 - [`asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html)
- 傳回相同集合實例的反向檢視，因此如果原始列表不會變更，它可能更輕量級並且比 `reversed()` 更可取。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")
    val reversedNumbers = numbers.asReversed()
    println(reversedNumbers)

}
```

如果原始列表是可變的，則其所有變更都會反映在其反向檢視中，反之亦然。

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three", "four")
    val reversedNumbers = numbers.asReversed()
    println(reversedNumbers)
    numbers.add("five")
    println(reversedNumbers)

}
```

但是，如果列表的可變性未知或來源根本不是列表，則 `reversed()` 更可取，
因為它的結果是一個副本，將來不會變更。

## 隨機順序

最後，有一個函式會傳回一個新的 `List`，其中包含隨機順序的集合元素 - [`shuffled()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffled.html)。
您可以在不帶引數或帶有 [`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html) 物件的情況下呼叫它。

```kotlin
fun main() {

     val numbers = listOf("one", "two", "three", "four")
     println(numbers.shuffled())

}
```