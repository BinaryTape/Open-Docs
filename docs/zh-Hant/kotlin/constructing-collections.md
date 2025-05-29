[//]: # (title: 建構集合)

## 從元素建構

建立集合最常見的方式是使用標準函式庫的函數 [`listOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html)、[`setOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/set-of.html)、[`mutableListOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html)、[`mutableSetOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-set-of.html)。如果您提供以逗號分隔的集合元素列表作為引數，編譯器會自動偵測元素類型。建立空集合時，請明確指定類型。

```kotlin
val numbersSet = setOf("one", "two", "three", "four")
val emptySet = mutableSetOf<String>()
```

對於映設 (map) 而言，也可使用 [`mapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-of.html) 和 [`mutableMapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-map-of.html) 函數。映設的鍵和值會以 `Pair` 物件的形式傳遞（通常使用 `to` 中綴函數建立）。

```kotlin
val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
```

請注意，`to` 標記會建立一個短暫存活的 `Pair` 物件，因此建議您僅在效能不關鍵時使用它。為避免過度記憶體使用，請使用替代方法。例如，您可以建立一個可變映設 (mutable map) 並使用寫入操作 (write operations) 填充它。[`apply()`](scope-functions.md#apply) 函數有助於在此處保持初始化過程的流暢性。

```kotlin
val numbersMap = mutableMapOf<String, String>().apply { this["one"] = "1"; this["two"] = "2" }
```

## 使用集合建構器函數建立

建立集合的另一種方式是呼叫建構器函數 (builder function) – [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html)、[`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html) 或 [`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html)。它們會建立一個新的、對應類型的可變集合 (mutable collection)，使用 [寫入操作](collection-write.md) 填充它，並返回一個具有相同元素的唯讀集合 (read-only collection)：

```kotlin
val map = buildMap { // 這是 MutableMap<String, Int>，鍵和值的類型是從下面的 `put()` 呼叫推斷的
    put("a", 1)
    put("b", 0)
    put("c", 4)
}

println(map) // {a=1, b=0, c=4}
```

## 空集合

還有一些函數用於建立不含任何元素的集合：[`emptyList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-list.html)、[`emptySet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-set.html) 和 [`emptyMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-map.html)。建立空集合時，您應該指定該集合將持有的元素類型。

```kotlin
val empty = emptyList<String>()
```

## 列表的初始化器函數

對於列表 (list) 而言，有一個類似建構子的函數，它接受列表大小和一個初始化器函數 (initializer function)，該函數根據元素的索引來定義其值。

```kotlin
fun main() {
//sampleStart
    val doubled = List(3, { it * 2 })  // 如果您稍後想改變其內容，也可以是 MutableList
    println(doubled)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 具體類型建構子

要建立一個具體類型集合 (concrete type collection)，例如 `ArrayList` 或 `LinkedList`，您可以使用這些類型可用的建構子 (constructor)。`Set` 和 `Map` 的實作 (implementation) 也提供類似的建構子。

```kotlin
val linkedList = LinkedList<String>(listOf("one", "two", "three"))
val presizedSet = HashSet<Int>(32)
```

## 複製

要建立一個與現有集合具有相同元素的集合，您可以使用複製函數 (copying function)。標準函式庫的集合複製函數會建立 _淺層 (shallow)_ 副本集合，其中包含對相同元素的參考。因此，對集合元素所做的更改會反映在其所有副本中。

集合複製函數，例如 [`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html)、[`toMutableList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-mutable-list.html)、[`toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html) 等，會在特定時刻建立集合的快照 (snapshot)。它們的結果是一個包含相同元素的新集合。如果您從原始集合中添加或移除元素，這不會影響副本。副本也可以獨立於來源進行更改。

```kotlin
class Person(var name: String)
fun main() {
//sampleStart
    val alice = Person("Alice")
    val sourceList = mutableListOf(alice, Person("Bob"))
    val copyList = sourceList.toList()
    sourceList.add(Person("Charles"))
    alice.name = "Alicia"
    println("第一個元素的名稱在來源中是：${sourceList[0].name}，在副本中是：${copyList[0].name}")
    println("列表大小在來源中是：${sourceList.size}，在副本中是：${copyList.size}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

這些函數也可以用於將集合轉換為其他類型，例如，從列表建構一個集合，反之亦然。

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

或者，您可以建立指向相同集合實例 (collection instance) 的新參考 (reference)。當您使用現有集合初始化集合變數時，會建立新的參考。因此，當集合實例透過參考被修改時，其變更會反映在其所有參考中。

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

集合初始化可用於限制可變性 (mutability)。例如，如果您建立一個指向 `MutableList` 的 `List` 參考，如果您嘗試透過此參考修改集合，編譯器將會產生錯誤。

```kotlin
fun main() {
//sampleStart 
    val sourceList = mutableListOf(1, 2, 3)
    val referenceList: List<Int> = sourceList
    //referenceList.add(4)            // 編譯錯誤
    sourceList.add(4)
    println(referenceList) // 顯示 sourceList 的目前狀態
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 在其他集合上呼叫函數

集合可以作為對其他集合進行各種操作 (operations) 的結果而建立。例如，[過濾](collection-filtering.md) 列表會建立一個符合篩選條件 (filter) 的新列表：

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

[映設 (Mapping)](collection-transformations.md#map) 會根據轉換 (transformation) 的結果產生一個列表：

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

[關聯 (Association)](collection-transformations.md#associate) 會產生映設：

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

有關 Kotlin 中集合操作 (collection operations) 的更多資訊，請參閱 [集合操作概覽](collection-operations.md)。