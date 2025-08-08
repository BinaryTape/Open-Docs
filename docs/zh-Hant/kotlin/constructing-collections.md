[//]: # (title: 建構集合)

## 從元素建構

建立集合最常見的方式是使用標準函式庫函式 [`listOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html)、
[`setOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/set-of.html)、
[`mutableListOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html)、
[`mutableSetOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-set-of.html)。
如果您提供以逗號分隔的集合元素列表作為引數，編譯器會自動偵測元素類型。在建立空集合時，請明確指定類型。

```kotlin
val numbersSet = setOf("one", "two", "three", "four")
val emptySet = mutableSetOf<String>()
```

函式 [`mapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-of.html)
和 [`mutableMapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-map-of.html) 也適用於對應表 (maps)。
對應表的鍵 (keys) 和值 (values) 會以 `Pair` 物件的形式傳遞 (通常使用 `to` 中綴函式建立)。

```kotlin
val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
```

請注意，`to` 標記會建立一個短生命週期的 `Pair` 物件，因此建議您僅在效能不關鍵時才使用它。
為避免過度記憶體使用，請使用其他方式。例如，您可以建立一個可變的對應表，並使用寫入操作填充它。
[`apply()`](scope-functions.md#apply) 函式可以在此處幫助保持初始化的流暢性。

```kotlin
val numbersMap = mutableMapOf<String, String>().apply { this["one"] = "1"; this["two"] = "2" }
```

## 使用集合建構器函式建立

建立集合的另一種方式是呼叫建構器函式 –
[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html)、[`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html)
或 [`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html)。它們會建立一個對應類型的新可變集合，
使用[寫入操作](collection-write.md)填充它，並回傳一個具有相同元素的唯讀集合：

```kotlin
val map = buildMap { // 這是 MutableMap<String, Int>，鍵和值的類型是從下面的 put() 呼叫推斷的
    put("a", 1)
    put("b", 0)
    put("c", 4)
}

println(map) // {a=1, b=0, c=4}
```

## 空集合

還有一些函式用於建立不含任何元素的集合：[`emptyList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-list.html)、
[`emptySet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-set.html) 和
[`emptyMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-map.html)。
在建立空集合時，您應該指定集合將包含的元素類型。

```kotlin
val empty = emptyList<String>()
```

## 列表的初始化函式

對於列表，有一個類似於建構子的函式，它接受列表大小以及一個初始化函式，該函式根據其索引定義元素值。

```kotlin
fun main() {
//sampleStart
    val doubled = List(3, { it * 2 })  // 或者 MutableList，如果您稍後想更改其內容
    println(doubled)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 具體類型建構子

要建立一個具體類型的集合，例如 `ArrayList` 或 `LinkedList`，您可以使用這些類型可用的建構子。
類似的建構子也適用於 `Set` 和 `Map` 的實作。

```kotlin
val linkedList = LinkedList<String>(listOf("one", "two", "three"))
val presizedSet = HashSet<Int>(32)
```

## 複製

要建立一個與現有集合具有相同元素的集合，您可以使用複製函式。標準函式庫中的集合複製函式會建立_淺層_複製集合，
這些集合參照相同的元素。因此，對集合元素的更改會反映在其所有副本中。

集合複製函式，例如 [`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html)、
[`toMutableList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-mutable-list.html)、
[`toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html) 等，會在特定時刻建立集合的快照。
它們的結果是具有相同元素的新集合。如果您從原始集合中新增或移除元素，這不會影響副本。副本也可以獨立於來源進行更改。

```kotlin
class Person(var name: String)
fun main() {
//sampleStart
    val alice = Person("Alice")
    val sourceList = mutableListOf(alice, Person("Bob"))
    val copyList = sourceList.toList()
    sourceList.add(Person("Charles"))
    alice.name = "Alicia"
    println("第一個項目的名稱：在來源中是 ${sourceList[0].name}，在副本中是 ${copyList[0].name}")
    println("列表大小：在來源中是 ${sourceList.size}，在副本中是 ${copyList.size}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

這些函式也可以用於將集合轉換為其他類型，例如，從列表中建立集合，反之亦然。

```kotlin
fun main() {
//sampleStart
    val sourceList = mutableListOf(1, 2, 3)    
    val copySet = sourceList.toMutableSet()
    copySet.add(3)
    copySet.add(4)    
    println(copySet)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

或者，您可以建立對相同集合實例的新參照。當您使用現有集合初始化集合變數時，會建立新的參照。
因此，當集合實例透過參照被更改時，這些更改會反映在其所有參照中。

```kotlin
fun main() {
//sampleStart
    val sourceList = mutableListOf(1, 2, 3)
    val referenceList = sourceList
    referenceList.add(4)
    println("來源大小：${sourceList.size}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

集合初始化可用於限制可變性。例如，如果您建立一個 `List` 參照指向一個 `MutableList`，
如果您嘗試透過此參照修改集合，編譯器將會產生錯誤。

```kotlin
fun main() {
//sampleStart 
    val sourceList = mutableListOf(1, 2, 3)
    val referenceList: List<Int> = sourceList
    //referenceList.add(4)            //編譯錯誤
    sourceList.add(4)
    println(referenceList) // 顯示 sourceList 的當前狀態
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 在其他集合上呼叫函式

集合可以作為對其他集合進行各種操作的結果而建立。例如，[過濾](collection-filtering.md)一個列表會建立一個符合篩選條件的新元素列表：

```kotlin
fun main() {
//sampleStart 
    val numbers = listOf("one", "two", "three", "four")  
    val longerThan3 = numbers.filter { it.length > 3 }
    println(longerThan3)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[映射](collection-transformations.md#map)會從轉換結果中產生一個列表：

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

[關聯](collection-transformations.md#associate)會產生對應表：

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

有關 Kotlin 中集合操作的更多資訊，請參閱[集合操作概述](collection-operations.md)。