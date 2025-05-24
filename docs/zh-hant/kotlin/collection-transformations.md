---
title: "集合轉換操作 (Collection transformation operations)"
---
Kotlin 標準函式庫為集合（collection）的_轉換（transformations）_提供了一組擴充函式（extension functions）。
這些函式根據提供的轉換規則，從現有的集合建立新的集合。
在本頁面中，我們將概述可用的集合轉換函式。

## Map（映射）

_映射（mapping）_轉換會從另一個集合的元素上執行函式的結果建立一個集合。
基本的映射函式是 [`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html)。
它將給定的 Lambda 函式應用於每個後續元素，並傳回 Lambda 結果的列表（List）。
結果的順序與元素的原始順序相同。
要應用一個額外使用元素索引作為參數的轉換，請使用 [`mapIndexed()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-indexed.html)。

```kotlin

fun main() {

    val numbers = setOf(1, 2, 3)
    println(numbers.map { it * 3 })
    println(numbers.mapIndexed { idx, value `->` value * idx })

}
```

如果轉換在某些元素上產生 `null`，您可以透過呼叫 [`mapNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-not-null.html) 函式，從結果集合中篩選掉 `null`，而不是 `map()`，或者使用 [`mapIndexedNotNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-indexed-not-null.html) 而不是 `mapIndexed()`。

```kotlin

fun main() {

    val numbers = setOf(1, 2, 3)
    println(numbers.mapNotNull { if ( it == 2) null else it * 3 })
    println(numbers.mapIndexedNotNull { idx, value `->` if (idx == 0) null else value * idx })

}
```

當轉換 Map（映射）時，您有兩個選項：轉換鍵（key）而保持值（value）不變，反之亦然。
若要將給定的轉換應用於鍵，請使用 [`mapKeys()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-keys.html)；
反過來，[`mapValues()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-values.html) 會轉換值。
這兩個函式都使用將 Map 條目作為引數的轉換，因此您可以同時操作其鍵和值。

```kotlin

fun main() {

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    println(numbersMap.mapKeys { it.key.uppercase() })
    println(numbersMap.mapValues { it.value + it.key.length })

}
```

## Zip（壓縮）

_壓縮（zipping）_轉換是從兩個集合中相同位置的元素建立 Pair（配對）。
在 Kotlin 標準函式庫中，這是由 [`zip()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/zip.html) 擴充函式完成的。

當在集合或陣列上呼叫 `zip()`，並以另一個集合（或陣列）作為引數時，`zip()` 會傳回 `Pair` 物件的 `List`。接收器集合的元素是這些 Pair 中的第一個元素。

如果集合的大小不同，則 `zip()` 的結果是較小的大小；較大集合的最後元素不包含在結果中。

`zip()` 也可以用中綴（infix）形式 `a zip b` 呼叫。

```kotlin

fun main() {

    val colors = listOf("red", "brown", "grey")
    val animals = listOf("fox", "bear", "wolf")
    println(colors zip animals)

    val twoAnimals = listOf("fox", "bear")
    println(colors.zip(twoAnimals))

}
```

您也可以使用轉換函式呼叫 `zip()`，該函式接受兩個參數：接收器元素和引數元素。
在這種情況下，結果 `List` 包含對接收器和具有相同位置的引數元素 Pair 呼叫的轉換函式的傳回值。

```kotlin

fun main() {

    val colors = listOf("red", "brown", "grey")
    val animals = listOf("fox", "bear", "wolf")
    
    println(colors.zip(animals) { color, animal `->` "The ${animal.replaceFirstChar { it.uppercase() }} is $color"})

}
```

當您有一個 `Pair` 的 `List` 時，您可以進行反向轉換 - _解壓縮（unzipping）_ - 從這些 Pair 建立兩個列表：

* 第一個列表包含原始列表中每個 `Pair` 的第一個元素。
* 第二個列表包含第二個元素。

要解壓縮 Pair 的列表，請呼叫 [`unzip()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/unzip.html)。

```kotlin

fun main() {

    val numberPairs = listOf("one" to 1, "two" to 2, "three" to 3, "four" to 4)
    println(numberPairs.unzip())

}
```

## Associate（關聯）

_關聯（association）_轉換允許從集合元素和與之關聯的某些值建立 Map。
在不同的關聯類型中，元素可以是關聯 Map 中的鍵或值。

基本關聯函式 [`associateWith()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-with.html) 建立一個 `Map`，其中原始集合的元素是鍵，而值是由給定的轉換函式從它們產生的。如果兩個元素相等，則只有最後一個元素保留在 Map 中。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })

}
```

為了建立以集合元素作為值的 Map，有函式 [`associateBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate-by.html)。
它接受一個函式，該函式根據元素的值傳回一個鍵。如果兩個元素的鍵相等，則只有最後一個元素保留在 Map 中。

`associateBy()` 也可以使用值轉換函式呼叫。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")

    println(numbers.associateBy { it.first().uppercaseChar() })
    println(numbers.associateBy(keySelector = { it.first().uppercaseChar() }, valueTransform = { it.length }))

}
```

另一種建立 Map 的方法，其中鍵和值都以某種方式從集合元素產生，是函式 [`associate()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/associate.html)。
它接受一個 Lambda 函式，該函式傳回一個 `Pair`：相應 Map 條目的鍵和值。

請注意，`associate()` 產生短暫的 `Pair` 物件，這可能會影響效能。
因此，當效能不重要或它比其他選項更可取時，應使用 `associate()`。

後者的一個例子是當鍵和相應的值一起從元素產生時。

```kotlin

fun main() {
data class FullName (val firstName: String, val lastName: String)

fun parseFullName(fullName: String): FullName {
    val nameParts = fullName.split(" ")
    if (nameParts.size == 2) {
        return FullName(nameParts[0], nameParts[1])
    } else throw Exception("Wrong name format")
}

    val names = listOf("Alice Adams", "Brian Brown", "Clara Campbell")
    println(names.associate { name `->` parseFullName(name).let { it.lastName to it.firstName } })  

}
```

在這裡，我們首先在元素上呼叫一個轉換函式，然後從該函式結果的屬性建立一個 Pair。

## Flatten（扁平化）

如果您操作巢狀集合，您可能會發現標準函式庫提供的函式可以提供對巢狀集合元素的扁平存取，非常有用。

第一個函式是 [`flatten()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flatten.html)。
您可以在集合的集合上呼叫它，例如，`Set` 的 `List`。
該函式傳回一個包含巢狀集合的所有元素的單個 `List`。

```kotlin

fun main() {

    val numberSets = listOf(setOf(1, 2, 3), setOf(4, 5, 6), setOf(1, 2))
    println(numberSets.flatten())

}
```

另一個函式 - [`flatMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flat-map.html) 提供了一種靈活的方式來處理巢狀集合。它接受一個函式，該函式將集合元素映射到另一個集合。
因此，`flatMap()` 傳回一個包含所有元素傳回值的單個列表。
所以，`flatMap()` 的行為就像後續呼叫 `map()`（以集合作為映射結果）和 `flatten()`。

```kotlin

data class StringContainer(val values: List<String>)

fun main() {

    val containers = listOf(
        StringContainer(listOf("one", "two", "three")),
        StringContainer(listOf("four", "five", "six")),
        StringContainer(listOf("seven", "eight"))
    )
    println(containers.flatMap { it.values })

}

```

## String representation（字串表示）

如果您需要以可讀的格式檢索集合內容，請使用將集合轉換為字串的函式：[`joinToString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 和 [`joinTo()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to.html)。

`joinToString()` 根據提供的引數從集合元素建立單個 `String`。
`joinTo()` 做同樣的事情，但將結果附加到給定的 [`Appendable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-appendable/index.html) 物件。

當使用預設引數呼叫時，這些函式傳回的結果類似於在集合上呼叫 `toString()`：
一個由逗號和空格分隔的元素字串表示形式的 `String`。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")
    
    println(numbers)         
    println(numbers.joinToString())
    
    val listString = StringBuffer("The list of numbers: ")
    numbers.joinTo(listString)
    println(listString)

}
```

要建立自訂字串表示形式，您可以在函式引數 `separator`、`prefix` 和 `postfix` 中指定其參數。結果字串將以 `prefix` 開頭，以 `postfix` 結尾。`separator` 將在每個元素之後出現，除了最後一個。

```kotlin

fun main() \{

    val numbers = listOf("one", "two", "three", "four")    
    println(numbers.joinToString(separator = " | ", prefix = "start: ", postfix = ": end"))

\}
```

對於較大的集合，您可能需要指定 `limit` - 將包含在結果中的元素數量。
如果集合大小超過 `limit`，所有其他元素將被替換為 `truncated` 引數的單個值。

```kotlin

fun main() {

    val numbers = (1..100).toList()
    println(numbers.joinToString(limit = 10, truncated = "<...>"))

}
```

最後，要自訂元素本身的表示形式，請提供 `transform` 函式。

```kotlin

fun main() {

    val numbers = listOf("one", "two", "three", "four")
    println(numbers.joinToString { "Element: ${it.uppercase()}"})

}
```