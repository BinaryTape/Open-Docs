[//]: # (title: 集合轉換操作)

Kotlin 標準函式庫提供了一組用於集合*轉換 (transformations)* 的擴充函式。
這些函式根據提供的轉換規則，從現有集合中組建新的集合。
在本頁中，我們將概述可用的集合轉換函式。

## 映射 (Map)

*映射 (mapping)* 轉換會從另一個集合的元素上執行函式的結果來建立一個集合。
基本的映射函式是 [`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html)。
它將指定的 Lambda 函式套用於每個後續元素，並傳回 Lambda 結果的清單。
結果的順序與元素的原始順序相同。
若要套用額外使用元素索引作為引數的轉換，請使用 [`mapIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-indexed.html)。

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

如果轉換在某些元素上產生 `null`，你可以透過呼叫 [`mapNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-not-null.html) 函式（而非 `map()`）或 [`mapIndexedNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-indexed-not-null.html)（而非 `mapIndexed()`）來從結果集合中篩選掉 `null`。

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

轉換 Map 時，你有兩個選項：轉換鍵 (keys) 並保持值 (values) 不變，反之亦然。
若要將指定的轉換套用於鍵，請使用 [`mapKeys()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-keys.html)；
相應地，[`mapValues()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-values.html) 則轉換值。
這兩個函式都使用以 Map 項目 (entry) 作為引數的轉換，因此你可以同時操作其鍵和值。

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

*Zip* 轉換是指從兩個集合中相同位置的元素組建配對 (pairs)。
在 Kotlin 標準函式庫中，這是透過 [`zip()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip.html) 擴充函式完成的。

當在一個集合或陣列上呼叫並以另一個集合（或陣列）作為引數時，`zip()` 會傳回 `Pair` 物件的 `List`。接收者集合的元素是這些配對中的第一個元素。

如果集合的大小不同，`zip()` 的結果將以較小的大小為準；較大集合的最後幾個元素將不包含在結果中。

`zip()` 也可以使用中置形式 `a zip b` 來呼叫。

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

你也可以使用帶有轉換函式的 `zip()`，該函式接受兩個參數：接收者元素和引數元素。在這種情況下，結果 `List` 包含在接收者和引數中相同位置的元素對上呼叫轉換函式的傳回值。

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

當你擁有一個 `Pair` 的 `List` 時，你可以進行反向轉換 – *unzipping* – 從這些配對中組建兩個清單：

* 第一個清單包含原始清單中每個 `Pair` 的第一個元素。 
* 第二個清單包含第二個元素。

若要對配對清單進行 unzip，請呼叫 [`unzip()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/unzip.html)。

```kotlin

fun main() {
//sampleStart
    val numberPairs = listOf("one" to 1, "two" to 2, "three" to 3, "four" to 4)
    println(numberPairs.unzip())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 關聯 (Associate)

*關聯 (Association)* 轉換允許從集合元素以及與其關聯的特定值組建 Map。
在不同的關聯類型中，元素可以是關聯 Map 中的鍵或值。

基本的關聯函式 [`associateWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-with.html) 會建立一個 `Map`，其中原始集合的元素是鍵，而值則是透過指定的轉換函式從這些元素產生的。如果兩個元素相等，則只有最後一個會留在 Map 中。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

對於以集合元素作為值來組建 Map，可以使用函式 [`associateBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-by.html)。
它接受一個根據元素值傳回鍵的函式。如果兩個元素的鍵相等，則只有最後一個會留在 Map 中。

`associateBy()` 也可以使用值轉換函式來呼叫。

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

另一種組建鍵和值都以某種方式從集合元素產生的 Map 的方法是函式 [`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html)。
它接受一個傳回 `Pair` 的 Lambda 函式：該配對即為對應 Map 項目的鍵和值。

請注意，`associate()` 會產生生命週期較短的 `Pair` 物件，這可能會影響效能。
因此，當效能並非關鍵或它比其他選項更合適時，應使用 `associate()`。

後者的範例是當鍵和對應的值是從一個元素一起產生時。

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

在這裡，我們首先在元素上呼叫轉換函式，然後從該函式結果的屬性中組建配對。

## 扁平化 (Flatten)

如果你操作巢狀集合 (nested collections)，你可能會發現提供對巢狀集合元素進行平坦存取的標準函式庫函式非常有用。

第一個函式是 [`flatten()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flatten.html)。
你可以在集合的集合上呼叫它，例如 `Set` 的 `List`。
該函式傳回一個包含巢狀集合所有元素的單一 `List`。

```kotlin

fun main() {
//sampleStart
    val numberSets = listOf(setOf(1, 2, 3), setOf(4, 5, 6), setOf(1, 2))
    println(numberSets.flatten())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

另一個函式 – [`flatMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flat-map.html) 提供了一種靈活處理巢狀集合的方法。它接受一個將集合元素映射到另一個集合的函式。
因此，`flatMap()` 會傳回一個包含所有元素上傳回值的單一清單。
所以，`flatMap()` 的行為等同於先呼叫 `map()`（以集合作為映射結果），接著再呼叫 `flatten()`。

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

## 字串表示形式

如果你需要以可讀格式獲取集合內容，請使用將集合轉換為字串的函式：[`joinToString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 和
[`joinTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to.html)。

`joinToString()` 根據提供的引數從集合元素組建單一 `String`。
`joinTo()` 執行相同的操作，但將結果附加到指定的 [`Appendable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-appendable/index.html) 物件。

當使用參數的預設值呼叫時，這些函式傳回的結果類似於在集合上呼叫 `toString()`：
由逗號和空格分隔的元素字串表示形式的 `String`。

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

若要組建自訂字串表示形式，你可以在函式引數 `separator`、`prefix` 和 `postfix` 中指定其參數。結果字串將以 `prefix` 開頭並以 `postfix` 結尾。`separator` 將出現在除最後一個元素之外的每個元素之後。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")    
    println(numbers.joinToString(separator = " | ", prefix = "start: ", postfix = ": end"))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

對於較大的集合，你可能想要指定 `limit` – 包含在結果中的元素數量。
如果集合大小超過 `limit`，則所有其他元素將替換為 `truncated` 引數的單一值。

```kotlin

fun main() {
//sampleStart
    val numbers = (1..100).toList()
    println(numbers.joinToString(limit = 10, truncated = "<...>"))
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

最後，若要自訂元素本身的表示形式，請提供 `transform` 函式。

```kotlin

fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.joinToString { "Element: ${it.uppercase()}"})
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}