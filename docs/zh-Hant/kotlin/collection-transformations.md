[//]: # (title: 集合轉換操作)

Kotlin 標準函式庫提供了一組用於集合**轉換**的擴充函數。
這些函數根據提供的轉換規則，從現有集合建立新的集合。
在本頁中，我們將概述可用的集合轉換函數。

## Map

_映射_轉換是從另一個集合的元素經由函數處理後產生結果，並以此建立一個新的集合。
基本的映射函數是 [`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html)。
它將給定的 lambda 函數應用於每個元素，並返回 lambda 運算結果的列表。
結果的順序與原始元素的順序相同。
若要應用額外使用元素索引作為參數的轉換，請使用 [`mapIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-indexed.html)。

```kotlin

fun main() {
//sampleStart
    val numbers = setOf(1, 2, 3)
    println(numbers.map { it * 3 })
    println(numbers.mapIndexed { idx, value -> value * idx })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果轉換在某些元素上產生 `null`，你可以透過呼叫 [`mapNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-not-null.html) 函數而不是 `map()`，或者 [`mapIndexedNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-indexed-not-null.html) 而不是 `mapIndexed()`，從結果集合中過濾掉這些 `null` 值。

```kotlin

fun main() {
//sampleStart
    val numbers = setOf(1, 2, 3)
    println(numbers.mapNotNull { if ( it == 2) null else it * 3 })
    println(numbers.mapIndexedNotNull { idx, value -> if (idx == 0) null else value * idx })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

轉換映射 (Maps) 時，你有兩個選項：轉換鍵而保持值不變，反之亦然。
若要將給定的轉換應用於鍵，請使用 [`mapKeys()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-keys.html)；相應地，[`mapValues()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-values.html) 則轉換值。
這兩個函數都使用將映射條目作為參數的轉換，因此你可以同時操作其鍵和值。

```kotlin

fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    println(numbersMap.mapKeys { it.key.uppercase() })
    println(numbersMap.mapValues { it.value + it.key.length })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Zip

_壓縮 (Zipping)_ 轉換是從兩個集合中相同位置的元素建立配對。
在 Kotlin 標準函式庫中，這透過 [`zip()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip.html) 擴充函數來實現。

當在集合或陣列上呼叫並將另一個集合（或陣列）作為參數時，`zip()` 會返回 `Pair` 物件的 `List`。接收器集合的元素是這些配對中的第一個元素。

如果集合大小不同，`zip()` 的結果將以較小集合的大小為準；較大集合的最後幾個元素將不包含在結果中。

`zip()` 也可以以中綴形式 `a zip b` 呼叫。

```kotlin

fun main() {
//sampleStart
    val colors = listOf("red", "brown", "grey")
    val animals = listOf("fox", "bear", "wolf")
    println(colors zip animals)

    val twoAnimals = listOf("fox", "bear")
    println(colors.zip(twoAnimals))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

你也可以使用一個接受兩個參數的轉換函數來呼叫 `zip()`：即接收器元素和參數元素。在這種情況下，結果 `List` 包含轉換函數在具有相同位置的接收器和參數元素配對上呼叫後的返回值。

```kotlin

fun main() {
//sampleStart
    val colors = listOf("red", "brown", "grey")
    val animals = listOf("fox", "bear", "wolf")
    
    println(colors.zip(animals) { color, animal -> "The ${animal.replaceFirstChar { it.uppercase() }} is $color"})
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

當你擁有一個 `Pair` 列表時，你可以執行反向轉換——_解壓縮 (unzipping)_，它從這些配對中建立兩個列表：

*   第一個列表包含原始列表中每個 `Pair` 的第一個元素。
*   第二個列表包含第二個元素。

若要解壓縮配對列表，請呼叫 [`unzip()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/unzip.html)。

```kotlin

fun main() {
//sampleStart
    val numberPairs = listOf("one" to 1, "two" to 2, "three" to 3, "four" to 4)
    println(numberPairs.unzip())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## Associate

_關聯 (Association)_ 轉換允許從集合元素及其相關聯的某些值建立映射 (maps)。
在不同的關聯類型中，元素可以是關聯映射中的鍵或值。

基本的關聯函數 [`associateWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-with.html) 會建立一個 `Map`，其中原始集合的元素作為鍵，而值則由給定的轉換函數從這些元素產生。如果兩個元素相等，則只有最後一個會保留在映射中。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

對於建立以集合元素作為值的映射，可以使用函數 [`associateBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-by.html)。
它接受一個函數，該函數根據元素的值返回一個鍵。如果兩個元素的鍵相等，則只有最後一個會保留在映射中。

`associateBy()` 也可以與值轉換函數一起呼叫。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")

    println(numbers.associateBy { it.first().uppercaseChar() })
    println(numbers.associateBy(keySelector = { it.first().uppercaseChar() }, valueTransform = { it.length }))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

另一種建立映射的方式是使用函數 [`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html)，其中鍵和值都以某種方式從集合元素產生。
它接受一個 lambda 函數，該函數返回一個 `Pair`：即對應映射條目的鍵和值。

請注意，`associate()` 會產生短暫的 `Pair` 物件，這可能會影響效能。
因此，`associate()` 應在效能不是關鍵或比其他選項更受青睞時使用。

後者的一個例子是，當鍵和對應的值是從一個元素中一起產生時。

```kotlin

fun main() {
data class FullName (val firstName: String, val lastName: String)

fun parseFullName(fullName: String): FullName {
    val nameParts = fullName.split(" ")
    if (nameParts.size == 2) {
        return FullName(nameParts[0], nameParts[1])
    } else throw Exception("Wrong name format")
}

//sampleStart
    val names = listOf("Alice Adams", "Brian Brown", "Clara Campbell")
    println(names.associate { name -> parseFullName(name).let { it.lastName to it.firstName } })  
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

在這裡，我們首先在一個元素上呼叫轉換函數，然後從該函數結果的屬性建立一個配對。

## Flatten

如果你操作巢狀集合，你可能會發現標準函式庫中提供對巢狀集合元素進行平坦存取的函數很有用。

第一個函數是 [`flatten()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flatten.html)。
你可以在集合的集合上呼叫它，例如，一個 `Set` 的 `List`。
該函數返回一個包含巢狀集合所有元素的單一 `List`。

```kotlin

fun main() {
//sampleStart
    val numberSets = listOf(setOf(1, 2, 3), setOf(4, 5, 6), setOf(1, 2))
    println(numberSets.flatten())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

另一個函數 [`flatMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flat-map.html) 提供了一種處理巢狀集合的靈活方式。它接受一個將集合元素映射到另一個集合的函數。
結果，`flatMap()` 會返回所有元素上其返回值的單一列表。
因此，`flatMap()` 的行為等同於先呼叫 `map()`（以集合作為映射結果），然後再呼叫 `flatten()`。

```kotlin

data class StringContainer(val values: List<String>)

fun main() {
//sampleStart
    val containers = listOf(
        StringContainer(listOf("one", "two", "three")),
        StringContainer(listOf("four", "five", "six")),
        StringContainer(listOf("seven", "eight"))
    )
    println(containers.flatMap { it.values })
//sampleEnd
}

```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## String representation

如果你需要以可讀格式檢索集合內容，請使用將集合轉換為字串的函數：[`joinToString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 和 [`joinTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to.html)。

`joinToString()` 根據提供的參數，從集合元素建立一個單一 `String`。
`joinTo()` 作用相同，但會將結果附加到給定的 [`Appendable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-appendable/index.html) 物件。

當使用預設參數呼叫時，這些函數返回的結果類似於在集合上呼叫 `toString()`：一個由逗號和空格分隔的元素字串表示組成的 `String`。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    
    println(numbers)         
    println(numbers.joinToString())
    
    val listString = StringBuffer("The list of numbers: ")
    numbers.joinTo(listString)
    println(listString)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

若要建立自訂字串表示，你可以在函數參數 `separator`、`prefix` 和 `postfix` 中指定其參數。
結果字串將以 `prefix` 開頭，以 `postfix` 結尾。`separator` 將出現在除最後一個元素之外的每個元素之後。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")    
    println(numbers.joinToString(separator = " | ", prefix = "start: ", postfix = ": end"))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

對於較大的集合，你可能希望指定 `limit`——將包含在結果中的元素數量。
如果集合大小超過 `limit`，所有其他元素將被 `truncated` 參數的單一值取代。

```kotlin

fun main() {
//sampleStart
    val numbers = (1..100).toList()
    println(numbers.joinToString(limit = 10, truncated = "<...>"))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

最後，若要自訂元素本身的表示，請提供 `transform` 函數。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.joinToString { "Element: ${it.uppercase()}"})
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}