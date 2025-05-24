---
title: "建構集合 (Constructing collections)"
---
## 從元素建構

建立集合最常見的方式是使用標準函式庫函式 [`listOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html)、
[`setOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/set-of.html)、
[`mutableListOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html)、
[`mutableSetOf<T>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-set-of.html)。
如果以引數形式提供逗號分隔的集合元素清單，則編譯器會自動偵測元素類型。建立空集合時，請明確指定類型。

```kotlin
val numbersSet = setOf("one", "two", "three", "four")
val emptySet = mutableSetOf<String>()
```

對於映射 (map) 來說，可以使用函式 [`mapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map-of.html)
和 [`mutableMapOf()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-map-of.html)。映射的鍵 (key) 和值 (value) 會作為 `Pair` 物件傳遞（通常使用 `to` 中綴函式建立）。

```kotlin
val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
```

請注意，`to` 符號會建立一個短暫的 `Pair` 物件，因此建議僅在效能不重要的情況下使用。為了避免過多的記憶體使用，請使用其他方法。例如，您可以建立一個可變映射並使用寫入操作來填充它。[`apply()`](scope-functions#apply) 函式可以幫助保持此處的初始化流暢。

```kotlin
val numbersMap = mutableMapOf<String, String>().apply { this["one"] = "1"; this["two"] = "2" }
```

## 使用集合建構器函式建立

建立集合的另一種方法是呼叫建構器函式 –
[`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html)、 [`buildSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-set.html)
或 [`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html)。 它們會建立一個新的、對應類型的可變集合，使用[寫入操作](collection-write)填充它，
並傳回一個具有相同元素的唯讀集合：

```kotlin
val map = buildMap { // this is MutableMap<String, Int>, types of key and value are inferred from the `put()` calls below
    put("a", 1)
    put("b", 0)
    put("c", 4)
}

println(map) // {a=1, b=0, c=4}
```

## 空集合

還有一些函式可以用於建立不包含任何元素的集合：[`emptyList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-list.html)、
[`emptySet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-set.html) 和
[`emptyMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/empty-map.html)。
建立空集合時，應指定集合將保存的元素類型。

```kotlin
val empty = emptyList<String>()
```

## List 的初始化器函式

對於 List 來說，有一個類似建構子的函式，它接受 List 的大小和初始化器函式，該函式根據元素的索引定義元素值。

```kotlin
fun main() {

    val doubled = List(3, { it * 2 })  // or MutableList if you want to change its content later
    println(doubled)

}
```

## 具體類型建構子

要創建一個具體類型集合，例如 `ArrayList` 或 `LinkedList`，您可以使用這些類型的可用建構子。 類似的建構子可用於 `Set` 和 `Map` 的實現。

```kotlin
val linkedList = LinkedList<String>(listOf("one", "two", "three"))
val presizedSet = HashSet<Int>(32)
```

## 複製

要創建一個與現有集合具有相同元素的集合，可以使用複製函式。 標準函式庫中的集合複製函式會建立 _淺_ 複製集合，其中包含對相同元素的參考。 因此，對集合元素所做的更改會反映在其所有副本中。

集合複製函式，例如 [`toList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-list.html)、
[`toMutableList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-mutable-list.html)、
[`toSet()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/to-set.html) 等，會建立特定時刻的集合快照。 它們的結果是一個具有相同元素的新集合。 如果您從原始集合中添加或刪除元素，這不會影響副本。 副本也可以獨立於來源進行更改。

```kotlin
class Person(var name: String)
fun main() {

    val alice = Person("Alice")
    val sourceList = mutableListOf(alice, Person("Bob"))
    val copyList = sourceList.toList()
    sourceList.add(Person("Charles"))
    alice.name = "Alicia"
    println("First item's name is: ${sourceList[0].name} in source and ${copyList[0].name} in copy")
    println("List size is: ${sourceList.size} in source and ${copyList.size} in copy")

}
```

這些函式還可以用於將集合轉換為其他類型，例如，從 List 建立 Set，反之亦然。

```kotlin
fun main() {

    val sourceList = mutableListOf(1, 2, 3)    
    val copySet = sourceList.toMutableSet()
    copySet.add(3)
    copySet.add(4)    
    println(copySet)

}
```

或者，您可以創建對同一集合實例的新參考。 當您使用現有集合初始化集合變數時，會建立新的參考。 因此，當透過參考更改集合實例時，更改會反映在其所有參考中。

```kotlin
fun main() {

    val sourceList = mutableListOf(1, 2, 3)
    val referenceList = sourceList
    referenceList.add(4)
    println("Source size: ${sourceList.size}")

}
```

集合初始化可用於限制可變性。 例如，如果您創建一個對 `MutableList` 的 `List` 參考，如果您嘗試透過此參考修改集合，編譯器將產生錯誤。

```kotlin
fun main() {

    val sourceList = mutableListOf(1, 2, 3)
    val referenceList: List<Int> = sourceList
    //referenceList.add(4)            //compilation error
    sourceList.add(4)
    println(referenceList) // shows the current state of sourceList

}
```

## 在其他集合上調用函式

集合可以作為其他集合上各種操作的結果而創建。 例如，[過濾](collection-filtering)一個 List 會建立一個新的 List，其中包含與過濾器匹配的元素：

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")  
    val longerThan3 = numbers.filter { it.length > 3 }
    println(longerThan3)

}
```

[映射](collection-transformations#map)從轉換的結果產生一個 List：

```kotlin
fun main() {

    val numbers = setOf(1, 2, 3)
    println(numbers.map { it * 3 })
    println(numbers.mapIndexed { idx, value `->` value * idx })

}
```

[關聯](collection-transformations#associate)產生映射：

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })

}
```

有關 Kotlin 中集合操作的更多訊息，請參閱 [集合操作概述](collection-operations)。