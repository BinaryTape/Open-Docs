[//]: # (title: 排序)

元素順序是某些集合類型的重要面向。
例如，如果兩個包含相同元素的列表其元素順序不同，則這兩個列表是不相等的。

在 Kotlin 中，可以透過幾種方式定義物件的順序。

第一種是 **自然順序 (natural order)**。它是為 [`Comparable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparable/index.html) 介面的實作者所定義的。當沒有指定其他順序時，自然順序會用於對它們進行排序。

大多數內建型別都是可比較的：

*   數值型別使用傳統的數值順序：`1` 大於 `0`；`-3.4f` 大於 `-5f`，依此類推。
*   `Char` 和 `String` 使用 [字典序 (lexicographical order)](https://en.wikipedia.org/wiki/Lexicographical_order)：`b` 大於 `a`；`world` 大於 `hello`。

要為使用者定義型別定義自然順序，請讓該型別實作 `Comparable`。
這需要實作 `compareTo()` 函式。`compareTo()` 必須接收另一個相同型別的物件作為引數，並傳回一個整數值來顯示哪個物件較大：

*   正值表示接收者物件較大。
*   負值表示它小於引數。
*   零表示物件相等。

以下是一個用於對版本進行排序的類別，版本由主版本 (major) 和次版本 (minor) 部分組成。

```kotlin
class Version(val major: Int, val minor: Int): Comparable<Version> {
    override fun compareTo(other: Version): Int = when {
        this.major != other.major -> this.major compareTo other.major // 中綴形式的 compareTo() 
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

**自訂順序 (Custom orders)** 讓你可以依照自己喜歡的方式對任何型別的執行個體進行排序。
特別是，你可以為不可比較的物件定義順序，或者為可比較型別定義自然順序以外的順序。
要為某個型別定義自訂順序，請為其建立一個 [`Comparator`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-comparator/index.html)。
`Comparator` 包含 `compare()` 函式：它接收一個類別的兩個執行個體，並傳回兩者之間比較的整數結果。
該結果的解讀方式與上述 `compareTo()` 的結果相同。

```kotlin
fun main() {
//sampleStart
    val lengthComparator = Comparator { str1: String, str2: String -> str1.length - str2.length }
    println(listOf("aaa", "bb", "c").sortedWith(lengthComparator))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

有了 `lengthComparator`，你就能夠依據字串的長度而不是預設的字典序來排列字串。

定義 `Comparator` 的一種更簡短方式是使用標準函式庫中的 [`compareBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/compare-by.html) 函式。`compareBy()` 接收一個 Lambda 函式，該函式從執行個體產生一個 `Comparable` 值，並將自訂順序定義為所產生值的自然順序。

使用 `compareBy()`，上述範例中的長度比較器如下所示：

```kotlin
fun main() {
//sampleStart    
    println(listOf("aaa", "bb", "c").sortedWith(compareBy { it.length }))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你也可以根據多個標準定義順序。
例如，要按長度排序字串，並在長度相等時按字母順序排序，你可以寫成：

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

由於按多個標準排序是常見的情境，Kotlin 標準函式庫提供了 [`.thenBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.comparisons/then-by.html) 函式，你可以用它來增加次要排序規則。

例如，你可以將 `compareBy()` 與 `.thenBy()` 結合使用，先按長度排序字串，再按字母順序排序，就像前面的範例一樣：

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

Kotlin 集合套件提供了以自然、自訂甚至隨機順序對集合進行排序的函式。
在此頁面中，我們將介紹適用於 [唯讀](collections-overview.md#collection-types) 集合的排序函式。
這些函式將其結果作為一個新集合傳回，該集合包含原集合中按要求順序排列的元素。
若要了解如何對 [可變](collections-overview.md#collection-types) 集合進行就地 (in place) 排序的函式，請參閱 [List 專屬操作](list-operations.md#sort)。

## 自然順序

基本函式 [`.sorted()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted.html) 和 [`.sortedDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-descending.html) 傳回集合元素，並根據其自然順序按升序和降序排列。
這些函式適用於 `Comparable` 元素的集合。

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
 
對於以自訂順序排序或對不可比較物件進行排序，可以使用函式 [`.sortedBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by.html) 和 [`.sortedByDescending()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-by-descending.html)。
它們接收一個選擇器函式，該函式將集合元素對應到 `Comparable` 值，並按這些值的自然順序對集合進行排序。

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

要為集合排序定義自訂順序，你可以提供自己的 `Comparator`。
為此，請呼叫 [`.sortedWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/sorted-with.html) 擴充方法並傳入你的 `Comparator`。
使用此函式，按長度排序字串如下所示：

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println("Sorted by length ascending: ${numbers.sortedWith(compareBy { it.length })}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 檢查排序順序

你可以使用以下擴充方法來檢查元素是否已經遵循指定的順序：

* `.isSorted()`
* `.isSortedDescending()`
* `.isSortedWith(comparator)`
* `.isSortedBy(selector)`
* `.isSortedByDescending(selector)`

如果元素處於指定順序或元素少於兩個，這些擴充方法會傳回 `true`。一旦發現順序錯誤的配對，它們就會傳回 `false` 並停止檢查。

對於不保證反覆運算順序的集合（例如 `HashSet`），不同呼叫之間的結果可能會有所不同。這同樣適用於不以一致順序產生元素的序列。為了在多次呼叫中獲得相同的結果，請僅在具有保證反覆運算順序的集合（如 `List`）上使用這些函式。

在檢查 `Double` 和 `Float` 值時，這些函式將 `NaN` 視為大於任何其他值，並將 `-0.0` 視為小於 `0.0`。此外，`.isSortedBy()` 和 `.isSortedByDescending()` 函式將 `null` 選擇器結果視為小於任何非 null 值。

當你在序列上呼叫這些函式時，該操作為終端 (terminal)。它會消耗序列以產生 `Boolean` 值，而不是傳回另一條序列。

> 這些排序順序函式也適用於陣列、原生型別陣列和無符號陣列。
> 無符號陣列及其操作是 [實驗性](components-stability.md#stability-levels-explained) 的，需要使用 `@ExperimentalUnsignedTypes` 註解進行選擇性使用 (opt-in)。
> 
{style="note"}

以下是使用 `.isSorted()` 和 `.isSortedBy()` 函式檢查排序順序的範例：

```kotlin
data class User(val name: String, val age: Int)

fun main() {
//sampleStart
    val numbers = listOf(1, 2, 3, 4)
    println(numbers.isSorted())
    // true

    val users = listOf(
        User("Alice", 24),
        User("Bob", 31),
        User("Charlie", 29),
    )
    println(users.isSortedBy(User::age))
    // false

    val descending = listOf(4, 3, 2, 1)
    println(descending.isSortedDescending())
    // true
   
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4"}

## 反轉順序

你可以使用 [`.reversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reversed.html) 函式以反轉的順序檢索集合。 

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.reversed())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`.reversed()` 擴充方法傳回一個包含元素副本的新集合。
因此，如果你稍後更改原始集合，這不會影響先前獲得的 `.reversed()` 結果。

另一個反轉函式 —— [`.asReversed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/as-reversed.html)
—— 傳回相同集合執行個體的反轉檢視，因此如果原始列表不打算更改，它可能比 `.reversed()` 更輕量且更值得推薦。 

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

如果原始列表是可變的，其所有變更都會反映在其反轉檢視中，反之亦然。

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

然而，如果列表的可變性未知，或者來源根本不是列表，則 `.reversed()` 更值得推薦，因為其結果是一個副本，未來不會改變。

## 隨機順序

最後，有一個函式可以傳回包含隨機順序集合元素的新 `List` —— [`.shuffled()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/shuffled.html)。
你可以不帶引數呼叫它，也可以傳入一個 [`Random`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/index.html) 物件。

```kotlin
fun main() {
//sampleStart
     val numbers = listOf("one", "two", "three", "four")
     println(numbers.shuffled())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}