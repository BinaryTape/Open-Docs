---
title: 集合總覽
---
Kotlin 標準函式庫提供了一套全面的工具，用於管理 _集合（collections）_ – 數量可變的項目群組（可能為零），這些項目對於要解決的問題至關重要，並且通常會對其進行操作。

集合是大多數程式語言的常見概念，因此，如果您熟悉 Java 或 Python 的集合，則可以跳過此介紹，直接進入詳細章節。

集合通常包含多個相同類型（及其子類型）的物件。集合中的物件稱為 _元素（elements）_ 或 _項目（items）_。例如，一個系中的所有學生形成一個集合，可用於計算他們的平均年齡。

以下集合類型與 Kotlin 相關：

* _List（列表）_ 是一個有序集合，可以通過索引（indices）訪問元素 – 索引是反映元素位置的整數。列表中可以多次出現相同的元素。電話號碼就是列表的一個例子：它是一組數字，它們的順序很重要，並且可以重複。
* _Set（集合）_ 是一個包含唯一元素的集合。它反映了集合的數學抽象：一組沒有重複的物件。通常，集合元素的順序並不重要。例如，彩票上的號碼形成一個集合：它們是唯一的，並且它們的順序並不重要。
* _Map（映射）_（或 _dictionary（字典）_）是一組鍵值對（key-value pairs）。鍵（keys）是唯一的，並且每個鍵都映射到一個值（value）。值可以重複。映射對於儲存物件之間的邏輯連接非常有用，例如，員工的 ID 及其職位。

Kotlin 允許您獨立於儲存在集合中的物件的確切類型來操作集合。換句話說，您可以將 `String` 添加到 `String` 的列表中，就像對 `Int` 或使用者定義的類別執行相同操作一樣。因此，Kotlin 標準函式庫提供了泛型介面（generic interfaces）、類別（classes）和函式（functions），用於建立、填充和管理任何類型的集合。

集合介面和相關函式位於 `kotlin.collections` 套件（package）中。讓我們概述一下其內容。

:::note
陣列（Arrays）不是集合的一種。有關更多資訊，請參閱 [陣列（Arrays）](arrays)。

:::

## 集合類型（Collection types）

Kotlin 標準函式庫為基本的集合類型（sets、lists 和 maps）提供了實現。一對介面表示每個集合類型：

* 一個 _唯讀（read-only）_ 介面，提供用於訪問集合元素的操作。
* 一個 _可變（mutable）_ 介面，它擴展了相應的唯讀介面，並提供了寫入操作：添加、移除和更新其元素。

請注意，可變集合不必賦值給 [`var`](basic-syntax#variables)。即使將可變集合賦值給 `val`，仍然可以進行寫入操作。將可變集合賦值給 `val` 的好處是，您可以保護對可變集合的引用免受修改。隨著時間的推移，隨著您的程式碼增長並變得更加複雜，防止對引用的意外修改變得更加重要。盡可能使用 `val` 來獲得更安全、更穩健的程式碼。如果您嘗試重新賦值 `val` 集合，您會收到編譯錯誤：

```kotlin
fun main() {

    val numbers = mutableListOf("one", "two", "three", "four")
    numbers.add("five")   // this is OK
    println(numbers)
    //numbers = mutableListOf("six", "seven")      // compilation error

}
```

唯讀集合類型是 [協變（covariant）](generics#variance) 的。這意味著，如果 `Rectangle` 類別繼承自 `Shape`，您可以在任何需要 `List<Shape>` 的地方使用 `List<Rectangle>`。換句話說，集合類型與元素類型具有相同的子類型關係。映射（Maps）在值類型（value type）上是協變的，但在鍵類型（key type）上不是協變的。

反過來，可變集合不是協變的；否則，這將導致運行時錯誤。如果 `MutableList<Rectangle>` 是 `MutableList<Shape>` 的子類型，您可以將其他 `Shape` 的繼承者（例如，`Circle`）插入其中，從而違反其 `Rectangle` 類型參數。

以下是 Kotlin 集合介面的圖表：

<img src="/img/collections-diagram.png" alt="Collection interfaces hierarchy" width="500" style={{verticalAlign: 'middle'}}/>

讓我們逐步了解這些介面及其實現。要了解 `Collection`，請閱讀下面的章節。要了解 `List`、`Set` 和 `Map`，您可以閱讀相應的章節，或觀看 Kotlin 開發者倡導者 Sebastian Aigner 的影片：

<video src="https://www.youtube.com/v/F8jj7e-_jFA" title="Kotlin Collections Overview"/>

### Collection

[`Collection<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html) 是集合層次結構的根。此介面表示唯讀集合的常見行為：檢索大小、檢查項目成員資格等等。`Collection` 繼承自 `Iterable<T>` 介面，該介面定義了用於迭代元素的操作。您可以將 `Collection` 用作適用於不同集合類型的函式的參數。對於更具體的情況，請使用 `Collection` 的繼承者：[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html) 和 [`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)。

```kotlin
fun printAll(strings: Collection<String>) {
    for(s in strings) print("$s ")
    println()
}
    
fun main() {
    val stringList = listOf("one", "two", "one")
    printAll(stringList)
    
    val stringSet = setOf("one", "two", "three")
    printAll(stringSet)
}
```

[`MutableCollection<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-collection/index.html) 是一個具有寫入操作（例如 `add` 和 `remove`）的 `Collection`。

```kotlin
fun List<String>.getShortWordsTo(shortWords: MutableList<String>, maxLength: Int) {
    this.filterTo(shortWords) { it.length <= maxLength }
    // throwing away the articles
    val articles = setOf("a", "A", "an", "An", "the", "The")
    shortWords -= articles
}

fun main() {
    val words = "A long time ago in a galaxy far far away".split(" ")
    val shortWords = mutableListOf<String>()
    words.getShortWordsTo(shortWords, 3)
    println(shortWords)
}
```

### List

[`List<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html) 以指定的順序儲存元素，並提供對它們的索引訪問。索引從零開始 – 第一個元素的索引 – 並到 `lastIndex`，它是 `(list.size - 1)`。

```kotlin
fun main() {

    val numbers = listOf("one", "two", "three", "four")
    println("Number of elements: ${numbers.size}")
    println("Third element: ${numbers.get(2)}")
    println("Fourth element: ${numbers[3]}")
    println("Index of element \"two\" ${numbers.indexOf("two")}")

}
```

列表元素（包括 null）可以重複：一個列表可以包含任意數量的相等物件或單個物件的出現。如果兩個列表具有相同的大小，並且在相同位置具有 [結構上相等（structurally equal）](equality#structural-equality) 的元素，則認為它們相等。

```kotlin
data class Person(var name: String, var age: Int)

fun main() {

    val bob = Person("Bob", 31)
    val people = listOf(Person("Adam", 20), bob, bob)
    val people2 = listOf(Person("Adam", 20), Person("Bob", 31), bob)
    println(people == people2)
    bob.age = 32
    println(people == people2)

}
```

[`MutableList<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html) 是一個具有列表特定寫入操作的 `List`，例如，在特定位置添加或移除元素。

```kotlin
fun main() {

    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.add(5)
    numbers.removeAt(1)
    numbers[0] = 0
    numbers.shuffle()
    println(numbers)

}
```

如您所見，在某些方面，列表與陣列非常相似。但是，有一個重要的區別：陣列的大小在初始化時定義，並且永遠不會更改；反過來，列表沒有預定義的大小；列表的大小可以因寫入操作而更改：添加、更新或移除元素。

在 Kotlin 中，`MutableList` 的預設實現是 [`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/index.html)，您可以將其視為可調整大小的陣列。

### Set

[`Set<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html) 儲存唯一元素；它們的順序通常是未定義的。`null` 元素也是唯一的：一個 `Set` 只能包含一個 `null`。如果兩個集合具有相同的大小，並且對於一個集合的每個元素，另一個集合中都有一個相等的元素，則這兩個集合相等。

```kotlin
fun main() {

    val numbers = setOf(1, 2, 3, 4)
    println("Number of elements: ${numbers.size}")
    if (numbers.contains(1)) println("1 is in the set")

    val numbersBackwards = setOf(4, 3, 2, 1)
    println("The sets are equal: ${numbers == numbersBackwards}")

}
```

[`MutableSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/index.html) 是一個具有來自 `MutableCollection` 的寫入操作的 `Set`。

`MutableSet` 的預設實現 – [`LinkedHashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-set/index.html) – 保留了元素插入的順序。因此，依賴於順序的函式（例如 `first()` 或 `last()`）在此類集合上返回可預測的結果。

```kotlin
fun main() {

    val numbers = setOf(1, 2, 3, 4)  // LinkedHashSet is the default implementation
    val numbersBackwards = setOf(4, 3, 2, 1)
    
    println(numbers.first() == numbersBackwards.first())
    println(numbers.first() == numbersBackwards.last())

}
```

另一種實現 – [`HashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-set/index.html) – 沒有說明元素的順序，因此在此類集合上呼叫這些函式會返回不可預測的結果。但是，`HashSet` 需要更少的記憶體來儲存相同數量的元素。

### Map

[`Map<K, V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html) 不是 `Collection` 介面的繼承者；但是，它也是 Kotlin 集合類型。`Map` 儲存 _鍵值對（key-value pairs）_（或 _條目（entries）_）；鍵（keys）是唯一的，但是不同的鍵可以與相等的值（values）配對。`Map` 介面提供了特定的函式，例如按鍵訪問值、搜索鍵和值等等。

```kotlin
fun main() {

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
    
    println("All keys: ${numbersMap.keys}")
    println("All values: ${numbersMap.values}")
    if ("key2" in numbersMap) println("Value by key \"key2\": ${numbersMap["key2"]}")    
    if (1 in numbersMap.values) println("The value 1 is in the map")
    if (numbersMap.containsValue(1)) println("The value 1 is in the map") // same as previous

}
```

包含相等對的兩個映射（maps）是相等的，無論對的順序如何。

```kotlin
fun main() {

    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)    
    val anotherMap = mapOf("key2" to 2, "key1" to 1, "key4" to 1, "key3" to 3)
    
    println("The maps are equal: ${numbersMap == anotherMap}")

}
```

[`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/index.html) 是一個具有映射寫入操作的 `Map`，例如，您可以添加新的鍵值對或更新與給定鍵相關聯的值。

```kotlin
fun main() {

    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap.put("three", 3)
    numbersMap["one"] = 11

    println(numbersMap)

}
```

`MutableMap` 的預設實現 – [`LinkedHashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-map/index.html) – 在迭代映射時保留元素插入的順序。反過來，另一種實現 – [`HashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/index.html) – 沒有說明元素的順序。

### ArrayDeque

[`ArrayDeque<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-deque/) 是一個雙端佇列的實現，允許您在佇列的開頭或結尾添加或移除元素。因此，`ArrayDeque` 在 Kotlin 中也扮演了堆疊（Stack）和佇列（Queue）資料結構的角色。在幕後，`ArrayDeque` 是使用可調整大小的陣列實現的，該陣列在需要時會自動調整大小：

```kotlin
fun main() {
    val deque = ArrayDeque(listOf(1, 2, 3))

    deque.addFirst(0)
    deque.addLast(4)
    println(deque) // [0, 1, 2, 3, 4]

    println(deque.first()) // 0
    println(deque.last()) // 4

    deque.removeFirst()
    deque.removeLast()
    println(deque) // [1, 2, 3]
}
```