[//]: # (title: 集合概覽)

Kotlin 標準函式庫提供了一套全面的工具，用於管理「集合 (collections)」—— 數量可變（可能為零）的項目群組，這些項目對於要解決的問題很重要且通常會被操作。

集合是大多數程式語言的常見概念，因此如果您熟悉例如 Java 或 Python 的集合，您可以跳過此介紹，直接進入詳細章節。

一個集合通常包含相同類型（及其子類型）的多個物件。集合中的物件稱為「元素 (elements)」或「項目 (items)」。例如，一個系內的所有學生組成一個集合，可以用來計算他們的平均年齡。

以下集合類型與 Kotlin 相關：

*   「清單 (List)」是一種有序集合，可透過索引（反映其位置的整數數字）存取元素。元素可以在清單中出現多次。電話號碼就是清單的一個範例：它是一組數字，順序很重要，並且數字可以重複。
*   「集合 (Set)」是唯一元素的集合。它反映了數學上集合的抽象概念：一組沒有重複的物件。通常，集合元素的順序沒有意義。例如，樂透彩票上的數字構成一個集合：它們是唯一的，並且順序不重要。
*   「映射 (Map)」(或「字典 (dictionary)」) 是一組鍵值對。鍵是唯一的，每個鍵都對應到一個值。值可以重複。映射對於儲存物件之間的邏輯連接很有用，例如員工的 ID 及其職位。

Kotlin 允許您獨立於其中儲存物件的確切類型來操作集合。換句話說，將 `String` 新增到 `String` 清單中的方式與新增 `Int` 或使用者定義類別的方式相同。因此，Kotlin 標準函式庫提供了泛型介面、類別和函數，用於建立、填充和管理任何類型的集合。

集合介面和相關函數位於 `kotlin.collections` 套件中。讓我們概覽一下其內容。

> 陣列不是一種集合類型。有關更多資訊，請參閱[陣列 (Arrays)](arrays.md)。
>
{style="note"}

## 集合類型

Kotlin 標準函式庫提供了基本集合類型的實作：集合 (sets)、清單 (lists) 和映射 (maps)。每種集合類型都由一對介面表示：

*   一個「唯讀 (read-only)」介面，提供存取集合元素的操作。
*   一個「可變 (mutable)」介面，透過寫入操作（新增、移除和更新其元素）擴展了對應的唯讀介面。

請注意，可變集合不必被賦值給 `var`。即使將可變集合賦值給 `val`，寫入操作仍然可行。將可變集合賦值給 `val` 的好處是，您可以保護對可變集合的參照不被修改。隨著時間的推移，當您的程式碼變得越來越複雜時，防止意外修改參照變得更加重要。盡可能多使用 `val` 以獲得更安全和更穩固的程式碼。如果您嘗試重新賦值一個 `val` 集合，您會收到一個編譯錯誤：

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

唯讀集合類型是[協變 (covariant)](generics.md#variance) 的。這意味著，如果 `Rectangle` 類別繼承自 `Shape`，則您可以在任何需要 `List<Shape>` 的地方使用 `List<Rectangle>`。換句話說，集合類型具有與元素類型相同的子類型關係。映射在值類型上是協變的，但在鍵類型上不是協變的。

反過來，可變集合不是協變的；否則，這將導致執行時失敗。如果 `MutableList<Rectangle>` 是 `MutableList<Shape>` 的子類型，您就可以向其中插入其他 `Shape` 繼承者（例如 `Circle`），從而違反其 `Rectangle` 類型參數。

以下是 Kotlin 集合介面的圖表：

![集合介面層次結構](collections-diagram.png){width="500"}

讓我們深入了解這些介面及其實作。要了解 `Collection`，請閱讀下面的章節。要了解 `List`、`Set` 和 `Map`，您可以閱讀對應的章節，或觀看 Kotlin 開發者倡導者 Sebastian Aigner 的影片：

<video src="https://www.youtube.com/v/F8jj7e-_jFA" title="Kotlin 集合概覽"/>

### Collection

[`Collection<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-collection/index.html) 是集合層次結構的根。此介面表示唯讀集合的共同行為：取得大小、檢查項目成員資格等等。`Collection` 繼承自 `Iterable<T>` 介面，該介面定義了迭代元素的操作。您可以將 `Collection` 作為適用於不同集合類型的函數參數。對於更具體的情況，請使用 `Collection` 的繼承者：[`List`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html) 和 [`Set`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html)。

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

[`MutableCollection<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-collection/index.html) 是一個具有寫入操作（例如 `add` 和 `remove`）的 `Collection`。

```kotlin
fun List<String>.getShortWordsTo(shortWords: MutableList<String>, maxLength: Int) {
    this.filterTo(shortWords) { it.length <= maxLength }
    // 移除冠詞
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

[`List<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-list/index.html) 按照指定順序儲存元素並提供索引存取。索引從零開始——即第一個元素的索引——並延伸到 `lastIndex`，即 `(list.size - 1)`。

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

清單元素（包括 null）可以重複：一個清單可以包含任意數量的相等物件或單一物件的出現次數。如果兩個清單具有相同的大小並且在相同位置具有[結構上相等](equality.md#structural-equality)的元素，則認為它們相等。

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

[`MutableList<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/index.html) 是一個具有清單特有寫入操作的 `List`，例如，在特定位置新增或移除元素。

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

如您所見，在某些方面，清單與陣列非常相似。然而，有一個重要的區別：陣列的大小在初始化時定義且永不改變；而清單沒有預定義的大小；清單的大小可以因寫入操作（新增、更新或移除元素）而改變。

在 Kotlin 中，`MutableList` 的預設實作是 [`ArrayList`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-list/index.html)，您可以將其視為一個可調整大小的陣列。

### Set

[`Set<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-set/index.html) 儲存唯一元素；它們的順序通常是未定義的。`null` 元素也是唯一的：一個 `Set` 只能包含一個 `null`。如果兩個集合具有相同的大小，並且對於一個集合中的每個元素，另一個集合中都有一個相等的元素，則認為它們相等。

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

[`MutableSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-set/index.html) 是一個具有 `MutableCollection` 寫入操作的 `Set`。

`MutableSet` 的預設實作 – [`LinkedHashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-set/index.html) – 保留了元素插入的順序。因此，依賴順序的函數，例如 `first()` 或 `last()`，在此類集合上會返回可預測的結果。

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

另一種實作 – [`HashSet`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-set/index.html) – 不保證元素的順序，因此在其上呼叫此類函數會返回不可預測的結果。然而，`HashSet` 需要更少的記憶體來儲存相同數量的元素。

### Map

[`Map<K, V>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-map/index.html) 不是 `Collection` 介面的繼承者；然而，它也是一種 Kotlin 集合類型。`Map` 儲存「鍵值 (key-value)」對（或「條目 (entries)」）；鍵是唯一的，但不同的鍵可以與相等的值配對。`Map` 介面提供了特定函數，例如透過鍵存取值、搜尋鍵和值等等。

```kotlin
fun main() {
//sampleStart
    val numbersMap = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key4" to 1)
    
    println("All keys: ${numbersMap.keys}")
    println("All values: ${numbersMap.values}")
    if ("key2" in numbersMap) println("Value by key \"key2\": ${numbersMap["key2"]}")    
    if (1 in numbersMap.values) println("The value 1 is in the map")
    if (numbersMap.containsValue(1)) println("The value 1 is in the map") // 與前一行相同
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

包含相同鍵值對的兩個映射，無論鍵值對的順序如何，都被視為相等。

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

[`MutableMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-map/index.html) 是一個具有映射寫入操作的 `Map`，例如，您可以新增新的鍵值對或更新與給定鍵關聯的值。

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

`MutableMap` 的預設實作 – [`LinkedHashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-linked-hash-map/index.html) – 在迭代映射時保留了元素插入的順序。反過來，另一種實作 – [`HashMap`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-hash-map/index.html) – 不保證元素的順序。

### ArrayDeque

[`ArrayDeque<T>`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-array-deque/) 是雙端佇列的實作，它允許您在佇列的開頭或結尾新增或移除元素。因此，`ArrayDeque` 在 Kotlin 中同時扮演了堆疊 (Stack) 和佇列 (Queue) 資料結構的角色。在底層，`ArrayDeque` 是透過一個可調整大小的陣列實現的，該陣列在需要時會自動調整大小：

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