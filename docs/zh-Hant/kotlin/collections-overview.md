[//]: # (title: 集合概覽)

Kotlin 標準函式庫提供一套全面的工具，用於管理 _集合_ – 它們是數量可變 (可能為零) 的項目群組，對於所解決的問題具有重要意義且常被操作。

集合是大多數程式語言的常見概念，因此如果您熟悉例如 Java 或 Python 的集合，您可以跳過本介紹並直接前往詳細章節。

集合通常包含相同類型 (及其子類型) 的多個物件。集合中的物件稱為 _元素_ 或 _項目_。例如，某個系所有學生構成一個集合，可用於計算他們的平均年齡。

以下集合類型與 Kotlin 相關：

* _列表 (List)_ 是一個有序集合，可以透過索引（反映其位置的整數）存取元素。元素可以在列表中出現多次。列表的一個例子是電話號碼：它是一組數字，其順序很重要，並且可以重複。
* _集 (Set)_ 是一個包含唯一元素的集合。它反映了數學上集的抽象：一組不重複的物件。通常，集元素的順序沒有意義。例如，樂透彩票上的數字形成一個集：它們是唯一的，並且它們的順序不重要。
* _映射 (Map)_（或 _字典_）是一組鍵值對。鍵是唯一的，並且每個鍵都恰好映射到一個值。值可以重複。映射對於儲存物件之間的邏輯關聯很有用，例如，員工的 ID 及其職位。

Kotlin 允許您獨立於其中儲存物件的確切類型來操作集合。換句話說，您將 `String` 新增到 `String` 列表的方式，與您對 `Int` 或使用者定義類別的操作方式相同。因此，Kotlin 標準函式庫提供泛型介面、類別和函式，用於建立、填充和管理任何類型的集合。

集合介面和相關函式位於 `kotlin.collections` 套件中。讓我們來概覽其內容。

> 陣列不是一種集合。有關更多資訊，請參閱 [陣列](arrays.md)。
>
{style="note"}

## 集合類型

Kotlin 標準函式庫為基本集合類型提供了實作：集、列表和映射。
每種集合類型都由一對介面表示：

* 一個 _唯讀_ 介面，提供用於存取集合元素的操作。
* 一個 _可變_ 介面，透過寫入操作（新增、移除和更新其元素）擴展相應的唯讀介面。

請注意，可變集合不一定需要指派給 [`var`](basic-syntax.md#variables)。即使將其指派給 `val`，可變集合的寫入操作仍然可能。將可變集合指派給 `val` 的好處是，您可以保護對可變集合的引用免受修改。隨著時間的推移，當您的程式碼變得越來越複雜時，防止對引用的無意修改變得更加重要。盡可能使用 `val` 來編寫更安全、更強健的程式碼。如果您嘗試重新指派 `val` 集合，將會得到編譯錯誤：

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf("one", "two", "three", "four")
    numbers.add("five")   // this is OK
    println(numbers)
    //numbers = mutableListOf("six", "seven")      // compilation error
//sampleEnd

}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

唯讀集合類型是[共變](generics.md#variance)的。
這表示，如果 `Rectangle` 類別繼承自 `Shape`，則在需要 `List<Shape>` 的任何地方，您都可以使用 `List<Rectangle>`。
換句話說，集合類型與元素類型具有相同的子類型關係。映射在值類型上是共變的，但在鍵類型上則不是。

相對地，可變集合不是共變的；否則，這將導致執行時錯誤。如果 `MutableList<Rectangle>` 是 `MutableList<Shape>` 的子類型，您就可以向其中插入其他 `Shape` 繼承者（例如 `Circle`），從而違反其 `Rectangle` 類型參數。

下方是 Kotlin 集合介面的圖表：

![Collection interfaces hierarchy](collections-diagram.png){width="500"}

讓我們來詳細了解這些介面及其實作。要了解 `Collection`，請閱讀下面的部分。要了解 `List`、`Set` 和 `Map`，您可以閱讀相應的章節，或觀看 Kotlin 開發者倡導者 Sebastian Aigner 的影片：

<video src="https://www.youtube.com/v/F8jj7e-_jFA" title="Kotlin Collections Overview"/>

### Collection

[`Collection<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html) 是集合層次的根。此介面代表唯讀集合的共同行為：擷取大小、檢查項目成員資格等。
`Collection` 繼承自 `Iterable<T>` 介面，該介面定義了迭代元素的操作。您可以將 `Collection` 用作適用於不同集合類型的函式參數。對於更具體的情況，請使用 `Collection` 的繼承者：[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html) 和 [`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)。

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`MutableCollection<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-collection/index.html) 是具有寫入操作（例如 `add` 和 `remove`）的 `Collection`。

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### List

[`List<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html) 以指定順序儲存元素並提供索引存取。索引從零開始（第一個元素的索引），並延伸到 `lastIndex`，即 `(list.size - 1)`。

```kotlin
fun main() {
//sampleStart
    val numbers = listOf("one", "two", "three", "four")
    println("Number of elements: ${numbers.size}")
    println("Third element: ${numbers.get(2)}")
    println("Fourth element: ${numbers[3]}")
    println("Index of element \"two\" ${numbers.indexOf("two")}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

列表元素（包括 null）可以重複：一個列表可以包含任意數量的相等物件或單一物件的出現次數。當兩個列表具有相同的大小，並且在相同位置具有[結構上相等](equality.md#structural-equality)的元素時，它們被視為相等。

```kotlin
data class Person(var name: String, var age: Int)

fun main() {
//sampleStart
    val bob = Person("Bob", 31)
    val people = listOf(Person("Adam", 20), bob, bob)
    val people2 = listOf(Person("Adam", 20), Person("Bob", 31), bob)
    println(people == people2)
    bob.age = 32
    println(people == people2)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`MutableList<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html) 是一個 `List`，具有列表特定的寫入操作，例如在特定位置新增或移除元素。

```kotlin
fun main() {
//sampleStart
    val numbers = mutableListOf(1, 2, 3, 4)
    numbers.add(5)
    numbers.removeAt(1)
    numbers[0] = 0
    numbers.shuffle()
    println(numbers)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如您所見，在某些方面列表與陣列非常相似。然而，有一個重要的區別：陣列的大小在初始化時就已定義，並且從不改變；相對地，列表沒有預定義的大小；列表的大小可以因寫入操作（新增、更新或移除元素）而改變。

在 Kotlin 中，`MutableList` 的預設實作是 [`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/index.html)，您可以將其視為一個可調整大小的陣列。

### Set

[`Set<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html) 儲存唯一元素；它們的順序通常是未定義的。`null` 元素也是唯一的：一個 `Set` 只能包含一個 `null`。當兩個集具有相同的大小，並且對於一個集中的每個元素，在另一個集中都有一個相等的元素時，它們被視為相等。

```kotlin
fun main() {
//sampleStart
    val numbers = setOf(1, 2, 3, 4)
    println("Number of elements: ${numbers.size}")
    if (numbers.contains(1)) println("1 is in the set")

    val numbersBackwards = setOf(4, 3, 2, 1)
    println("The sets are equal: ${numbers == numbersBackwards}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`MutableSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/index.html) 是一個 `Set`，具有來自 `MutableCollection` 的寫入操作。

`MutableSet` 的預設實作 – [`LinkedHashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-set/index.html) – 保留了元素插入的順序。因此，依賴順序的函式，例如 `first()` 或 `last()`，在此類集上返回可預測的結果。

```kotlin
fun main() {
//sampleStart
    val numbers = setOf(1, 2, 3, 4)  // LinkedHashSet is the default implementation
    val numbersBackwards = setOf(4, 3, 2, 1)
    
    println(numbers.first() == numbersBackwards.first())
    println(numbers.first() == numbersBackwards.last())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

另一種實作 – [`HashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-set/index.html) – 對元素的順序沒有任何說明，因此在此類集上呼叫這些函式會返回不可預測的結果。然而，`HashSet` 需要更少的記憶體來儲存相同數量的元素。

### Map

[`Map<K, V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html) 不是 `Collection` 介面的繼承者；然而，它也是 Kotlin 的一種集合類型。`Map` 儲存 _鍵值對_（或 _條目_）；鍵是唯一的，但不同的鍵可以與相等的值配對。`Map` 介面提供了特定的函式，例如透過鍵存取值、搜尋鍵和值等等。

```kotlin
fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
    
    println("All keys: ${numbersMap.keys}")
    println("All values: ${numbersMap.values}")
    if ("key2" in numbersMap) println("Value by key \"key2\": ${numbersMap["key2"]}")    
    if (1 in numbersMap.values) println("The value 1 is in the map")
    if (numbersMap.containsValue(1)) println("The value 1 is in the map") // same as previous
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

兩個包含相等鍵值對的映射，無論鍵值對的順序如何，都被視為相等。

```kotlin
fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)    
    val anotherMap = mapOf("key2" to 2, "key1" to 1, "key4" to 1, "key3" to 3)
    
    println("The maps are equal: ${numbersMap == anotherMap}")
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

[`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/index.html) 是一個 `Map`，具有映射寫入操作，例如，您可以新增一個新的鍵值對或更新與給定鍵相關聯的值。

```kotlin
fun main() {
//sampleStart
    val numbersMap = mutableMapOf("one" to 1, "two" to 2)
    numbersMap.put("three", 3)
    numbersMap["one"] = 11

    println(numbersMap)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

`MutableMap` 的預設實作 – [`LinkedHashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-map/index.html) – 在迭代映射時保留了元素插入的順序。相對地，另一種實作 – [`HashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/index.html) – 對元素的順序沒有任何說明。

### ArrayDeque

[`ArrayDeque<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-deque/) 是雙端佇列的實作，它允許您在佇列的開頭或結尾新增或移除元素。因此，`ArrayDeque` 在 Kotlin 中也扮演了堆疊 (Stack) 和佇列 (Queue) 資料結構的角色。在底層，`ArrayDeque` 是透過一個可調整大小的陣列來實現的，該陣列在需要時會自動調整大小：

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.4"}