---
title: "Java 和 Kotlin 中的集合 (Collections)"
description: "了解如何從 Java 集合 (collections) 遷移到 Kotlin 集合。本指南涵蓋諸如 Kotlin 和 Java 列表 (Lists)、陣列列表 (ArrayLists)、映射 (Maps)、集合 (Sets) 等資料結構。"
---
_集合 (Collections)_ 是指數量可變 (可能為零) 的項目群組，這些項目對於要解決的問題而言非常重要，並且經常被操作。
本指南說明並比較 Java 和 Kotlin 中的集合概念和操作。
它將幫助你從 Java 遷移到 Kotlin，並以道地的 Kotlin 方式編寫程式碼。

本指南的第一部分包含 Java 和 Kotlin 中相同集合的操作快速詞彙表。
它分為[相同操作](#operations-that-are-the-same-in-java-and-kotlin)
和[僅存在於 Kotlin 中的操作](#operations-that-don-t-exist-in-java-s-standard-library)兩個部分。
本指南的第二部分從 [Mutability (可變性)](#mutability)開始，透過查看特定案例來說明一些差異。

如需集合的簡介，請參閱 [Collections overview (集合概述)](collections-overview) 或觀看
Sebastian Aigner (Kotlin 開發人員推廣者) 製作的這段 [video (影片)](https://www.youtube.com/watch?v=F8jj7e-_jFA)。

:::note
以下所有範例僅使用 Java 和 Kotlin 標準函式庫 API。

:::

## Operations that are the same in Java and Kotlin (Java 和 Kotlin 中相同的操作)

在 Kotlin 中，有許多集合上的操作看起來與 Java 中的對應操作完全相同。

### Operations on lists, sets, queues, and deques (Lists、Sets、Queues 和 Deques 上的操作)

| Description (描述) | Common operations (常見操作) | More Kotlin alternatives (更多 Kotlin 替代方案) |
|-------------|-----------|---------------------|
| Add an element or elements (新增一個或多個元素) | `add()`, `addAll()` | Use the [`plusAssign`(`+=`) operator](collection-plus-minus): `collection += element`, `collection += anotherCollection`. |
| Check whether a collection contains an element or elements (檢查集合是否包含一個或多個元素) | `contains()`, `containsAll()` | Use the [`in` keyword](collection-elements#check-element-existence) to call `contains()` in the operator form: `element in collection`. |
| Check whether a collection is empty (檢查集合是否為空) | `isEmpty()` | Use [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html) to check whether a collection is not empty. |
| Remove under a certain condition (在特定條件下移除) | `removeIf()` | |
| Leave only selected elements (僅保留選定的元素) | `retainAll()` | |
| Remove all elements from a collection (從集合中移除所有元素) | `clear()` | |
| Get a stream from a collection (從集合取得串流) | `stream()` | Kotlin has its own way to process streams: [sequences (序列)](#sequences) and methods like [`map()`](collection-filtering) and [`filter()`](#filter-elements). |
| Get an iterator from a collection (從集合取得迭代器) | `iterator()` | |

### Operations on maps (Maps 上的操作)

| Description (描述) | Common operations (常見操作) | More Kotlin alternatives (更多 Kotlin 替代方案) |
|-------------|-----------|---------------------|
| Add an element or elements (新增一個或多個元素) | `put()`, `putAll()`, `putIfAbsent()`| In Kotlin, the assignment `map[key] = value` behaves the same as `put(key, value)`. Also, you may use the [`plusAssign`(`+=`) operator](collection-plus-minus): `map += Pair(key, value)` or `map += anotherMap`. |
| Replace an element or elements (取代一個或多個元素) | `put()`, `replace()`, `replaceAll()` | Use the indexing operator `map[key] = value` instead of `put()` and `replace()`. |
| Get an element (取得元素) | `get()` | Use the indexing operator to get an element: `map[index]`. |
| Check whether a map contains an element or elements (檢查 Map 是否包含一個或多個元素) | `containsKey()`, `containsValue()` | Use the [`in` keyword](collection-elements#check-element-existence) to call `contains()` in the operator form: `element in map`. |
| Check whether a map is empty (檢查 Map 是否為空) |  `isEmpty()` | Use [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html) to check whether a map is not empty. |
| Remove an element (移除元素) | `remove(key)`, `remove(key, value)` | Use the [`minusAssign`(`-=`) operator](collection-plus-minus): `map -= key`. |
| Remove all elements from a map (從 Map 中移除所有元素) | `clear()` | |
| Get a stream from a map (從 Map 取得串流) | `stream()` on entries, keys, or values | |

### Operations that exist only for lists (僅適用於 Lists 的操作)

| Description (描述) | Common operations (常見操作) | More Kotlin alternatives (更多 Kotlin 替代方案) |
|-------------|-----------|---------------------|
| Get an index of an element (取得元素的索引) | `indexOf()` | |
| Get the last index of an element (取得元素的最後一個索引) | `lastIndexOf()` | |
| Get an element (取得元素) | `get()` | Use the indexing operator to get an element: `list[index]`. |
| Take a sublist (取得子列表) | `subList()` | |
| Replace an element or elements (取代一個或多個元素) | `set()`,  `replaceAll()` | Use the indexing operator instead of `set()`: `list[index] = value`. |

## Operations that differ a bit (略有不同的操作)

### Operations on any collection type (任何集合類型的操作)

| Description (描述) | Java | Kotlin |
|-------------|------|--------|
| Get a collection's size (取得集合的大小) | `size()` | `count()`, `size` |
| Get flat access to nested collection elements (取得巢狀集合元素的扁平化存取) | `collectionOfCollections.forEach(flatCollection::addAll)` or `collectionOfCollections.stream().flatMap().collect()` | [`flatten()`](collection-transformations#flatten) or [`flatMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flat-map.html) |
| Apply the given function to every element (將給定的函式套用至每個元素) | `stream().map().collect()` | [`map()`](collection-filtering) |
| Apply the provided operation to collection elements sequentially and return the accumulated result (依序將提供的操作套用至集合元素，並傳回累積的結果) | `stream().reduce()` | [`reduce()`, `fold()`](collection-aggregate#fold-and-reduce) |
| Group elements by a classifier and count them (依分類器對元素進行分組並計算它們) | `stream().collect(Collectors.groupingBy(classifier, counting()))` | [`eachCount()`](collection-grouping) |
| Filter by a condition (依條件篩選) | `stream().filter().collect()` | [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) |
| Check whether collection elements satisfy a condition (檢查集合元素是否滿足條件) | `stream().noneMatch()`, `stream().anyMatch()`, `stream().allMatch()` | [`none()`, `any()`, `all()`](collection-filtering) |
| Sort elements (排序元素) | `stream().sorted().collect()` | [`sorted()`](collection-ordering#natural-order) |
| Take the first N elements (取得前 N 個元素) | `stream().limit(N).collect()` | [`take(N)`](collection-parts#take-and-drop) |
| Take elements with a predicate (取得帶有述詞的元素) | `stream().takeWhile().collect()` | [`takeWhile()`](collection-parts#take-and-drop) |
| Skip the first N elements (跳過前 N 個元素) | `stream().skip(N).collect()` | [`drop(N)`](collection-parts#take-and-drop) |
| Skip elements with a predicate (跳過帶有述詞的元素) | `stream().dropWhile().collect()` | [`dropWhile()`](collection-parts#take-and-drop) |
| Build maps from collection elements and certain values associated with them (從集合元素和與它們相關的特定值建立 Map) | `stream().collect(toMap(keyMapper, valueMapper))` | [`associate()`](collection-transformations#associate) |

若要對 Map 執行上面列出的所有操作，你首先需要取得 Map 的 `entrySet`。

### Operations on lists (Lists 上的操作)

| Description (描述) | Java | Kotlin |
|-------------|------|--------|
| Sort a list into natural order (將 List 排序為自然順序) | `sort(null)` | `sort()` |
| Sort a list into descending order (將 List 排序為降序) | `sort(comparator)` | `sortDescending()` |
| Remove an element from a list (從 List 中移除元素) | `remove(index)`, `remove(element)`| `removeAt(index)`, `remove(element)` or [`collection -= element`](collection-plus-minus) |
| Fill all elements of a list with a certain value (用特定值填滿 List 的所有元素) | `Collections.fill()` | [`fill()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fill.html) |
| Get unique elements from a list (從 List 取得唯一元素) | `stream().distinct().toList()` | [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) |

## Operations that don't exist in Java's standard library (Java 標準函式庫中不存在的操作)

* [`zip()`, `unzip()`](collection-transformations) – transform a collection (轉換集合)。
* [`aggregate()`](collection-grouping) – group by a condition (依條件分組)。
* [`takeLast()`, `takeLastWhile()`, `dropLast()`, `dropLastWhile()`](collection-parts#take-and-drop) – take or drop elements by a predicate (依述詞取得或捨棄元素)。
* [`slice()`, `chunked()`, `windowed()`](collection-parts) – retrieve collection parts (擷取集合部分)。
* [Plus (`+`) and minus (`-`) operators](collection-plus-minus) – add or remove elements (新增或移除元素)。

如果你想深入了解 `zip()`、`chunked()`、`windowed()` 和其他一些操作，請觀看 Sebastian Aigner 製作的這段影片，
內容關於 Kotlin 中的進階集合操作：

<video src="https://www.youtube.com/v/N4CpLxGJlq0" title="Advanced Collection Operations"/>

## Mutability (可變性)

在 Java 中，有可變集合：

```java
// Java
// This list is mutable! (這個 List 是可變的！)
public List<Customer> getCustomers() { ... }
```

部分可變的集合：

```java
// Java
List<String> numbers = Arrays.asList("one", "two", "three", "four");
numbers.add("five"); // Fails in runtime with `UnsupportedOperationException` (在執行階段失敗，並出現 `UnsupportedOperationException`)
```

以及不可變的集合：

```java
// Java
List<String> numbers = new LinkedList<>();
// This list is immutable! (這個 List 是不可變的！)
List<String> immutableCollection = Collections.unmodifiableList(numbers);
immutableCollection.add("five"); // Fails in runtime with `UnsupportedOperationException` (在執行階段失敗，並出現 `UnsupportedOperationException`)
```

如果你在 IntelliJ IDEA 中編寫最後兩段程式碼，IDE 會警告你嘗試修改不可變物件。
這段程式碼將會編譯，但在執行階段失敗，並出現 `UnsupportedOperationException`。你無法透過
查看其類型來判斷集合是否可變。

與 Java 不同的是，在 Kotlin 中，你可以根據你的需求明確宣告可變或唯讀集合。
如果你嘗試修改唯讀集合，程式碼將無法編譯：

```kotlin
// Kotlin
val numbers = mutableListOf("one", "two", "three", "four")
numbers.add("five")            // This is OK (這是可以的)
val immutableNumbers = listOf("one", "two")
//immutableNumbers.add("five") // Compilation error - Unresolved reference: add (編譯錯誤 - 未解析的參照：add)
```

在 [Kotlin coding conventions (Kotlin 編碼慣例)](coding-conventions#immutability)頁面中閱讀更多關於不可變性的資訊。

## Covariance (共變性)

在 Java 中，你無法將具有子類型 (descendant type) 的集合傳遞給接受祖先類型 (ancestor type) 集合的函式。
例如，如果 `Rectangle` 擴展了 `Shape`，你無法將 `Rectangle` 元素集合傳遞給接受 `Shape` 元素集合的函式。
為了使程式碼可編譯，請使用 `? extends Shape` 類型，以便該函式可以接受具有 `Shape` 任何繼承者的集合：

```java
// Java
class Shape {}

class Rectangle extends Shape {}

public void doSthWithShapes(List<? extends Shape> shapes) {
/* If using just List<Shape>, the code won't compile when calling
this function with the List<Rectangle> as the argument as below (如果僅使用 List<Shape>，則在以 List<Rectangle> 作為參數呼叫此函式時，程式碼將無法編譯，如下所示) */
}

public void main() {
    var rectangles = List.of(new Rectangle(), new Rectangle());
    doSthWithShapes(rectangles);
}
```

在 Kotlin 中，唯讀集合類型是 [covariant (共變的)](generics#variance)。這表示如果 `Rectangle` 類別繼承自 `Shape` 類別，
你可以在需要 `List<Shape>` 類型的任何地方使用 `List<Rectangle>` 類型。
換句話說，集合類型與元素類型具有相同的子類型關係。Map 在值類型上是共變的，但在鍵類型上則不是。
可變集合不是共變的，這會導致執行階段失敗。

```kotlin
// Kotlin
open class Shape(val name: String)

class Rectangle(private val rectangleName: String) : Shape(rectangleName)

fun doSthWithShapes(shapes: List<Shape>) {
    println("The shapes are: ${shapes.joinToString { it.name }}")
}

fun main() {
    val rectangles = listOf(Rectangle("rhombus"), Rectangle("parallelepiped"))
    doSthWithShapes(rectangles)
}
```

在此處閱讀更多關於 [collection types (集合類型)](collections-overview#collection-types)的資訊。

## Ranges and progressions (範圍和進程)

在 Kotlin 中，你可以使用 [ranges (範圍)](ranges) 建立間隔。例如，`Version(1, 11)..Version(1, 30)` 包含從 `1.11` 到 `1.30` 的所有版本。
你可以使用 `in` 運算子檢查你的版本是否在範圍內：`Version(0, 9) in versionRange`。

在 Java 中，你需要手動檢查 `Version` 是否符合兩個邊界：

```java
// Java
class Version implements Comparable<Version> {

    int major;
    int minor;

    Version(int major, int minor) {
        this.major = major;
        this.minor = minor;
    }

    @Override
    public int compareTo(Version o) {
        if (this.major != o.major) {
            return this.major - o.major;
        }
        return this.minor - o.minor;
    }
}

public void compareVersions() {
    var minVersion = new Version(1, 11);
    var maxVersion = new Version(1, 31);

   System.out.println(
           versionIsInRange(new Version(0, 9), minVersion, maxVersion));
   System.out.println(
           versionIsInRange(new Version(1, 20), minVersion, maxVersion));
}

public Boolean versionIsInRange(Version versionToCheck, Version minVersion, 
                                Version maxVersion) {
    return versionToCheck.compareTo(minVersion) >= 0 
            && versionToCheck.compareTo(maxVersion) <= 0;
}
```

在 Kotlin 中，你可以將範圍作為一個整體物件進行操作。你不需要建立兩個變數並將 `Version` 與它們進行比較：

```kotlin
// Kotlin
class Version(val major: Int, val minor: Int): Comparable<Version> {
    override fun compareTo(other: Version): Int {
        if (this.major != other.major) {
            return this.major - other.major
        }
        return this.minor - other.minor
    }
}

fun main() {
    val versionRange = Version(1, 11)..Version(1, 30)

    println(Version(0, 9) in versionRange)
    println(Version(1, 20) in versionRange)
}
```

一旦你需要排除其中一個邊界，例如檢查版本是否大於或等於 (`>=`) 最小版本
且小於 (`<`) 最大版本，這些包含性的範圍將無濟於事。

## Comparison by several criteria (依多個條件進行比較)

在 Java 中，若要依多個條件比較物件，你可以使用 [`comparing()`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html#comparing-java.util.function.Function-)
和 [`thenComparingX()`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html#thenComparing-java.util.Comparator-)
函式，這些函式來自 [`Comparator`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html) 介面。
例如，依姓名和年齡比較人員：

```java
class Person implements Comparable<Person> {
    String name;
    int age;

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return this.name + " " + age;
    }
}

public void comparePersons() {
    var persons = List.of(new Person("Jack", 35), new Person("David", 30), 
            new Person("Jack", 25));
    System.out.println(persons.stream().sorted(Comparator
            .comparing(Person::getName)
            .thenComparingInt(Person::getAge)).collect(toList()));
}
```

在 Kotlin 中，你只需列舉要比較的欄位即可：

```kotlin
data class Person(
    val name: String,
    val age: Int
)

fun main() {
    val persons = listOf(Person("Jack", 35), Person("David", 30), 
        Person("Jack", 25))
    println(persons.sortedWith(compareBy(Person::name, Person::age)))
}
```

## Sequences (序列)

在 Java 中，你可以使用這種方式產生數字序列：

```java
// Java
int sum = IntStream.iterate(1, e `->` e + 3)
    .limit(10).sum();
System.out.println(sum); // Prints 145 (列印 145)
```

在 Kotlin 中，使用 _[sequences (序列)](sequences)_。對序列進行多步驟處理
會盡可能以延遲方式執行 –
只有在要求整個處理鏈的結果時，才會發生實際的計算。

```kotlin
fun main() {

    // Kotlin
    val sum = generateSequence(1) {
        it + 3
    }.take(10).sum()
    println(sum) // Prints 145 (列印 145)

}
```

序列可以減少執行某些篩選操作所需的步驟數。
請參閱 [sequence processing example (序列處理範例)](sequences#sequence-processing-example)，其中顯示了 `Iterable` 和 `Sequence` 之間的差異。

## Removal of elements from a list (從 List 中移除元素)

在 Java 中，[`remove()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/List.html#remove(int))
函式接受要移除的元素的索引。

移除整數元素時，請使用 `Integer.valueOf()` 函式作為 `remove()` 函式的引數：

```java
// Java
public void remove() {
    var numbers = new ArrayList<>();
    numbers.add(1);
    numbers.add(2);
    numbers.add(3);
    numbers.add(1);
    numbers.remove(1); // This removes by index (這會依索引移除)
    System.out.println(numbers); // [1, 3, 1]
    numbers.remove(Integer.valueOf(1));
    System.out.println(numbers); // [3, 1]
}
```

在 Kotlin 中，有兩種元素移除類型：
依索引使用 [`removeAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove-at.html)，
以及依值使用 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove.html)。

```kotlin
fun main() {

    // Kotlin
    val numbers = mutableListOf(1, 2, 3, 1)
    numbers.removeAt(0)
    println(numbers) // [2, 3, 1]
    numbers.remove(1)
    println(numbers) // [2, 3]

}
```

## Traverse a map (遍歷 Map)

在 Java 中，你可以透過 [`forEach`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Map.html#forEach(java.util.function.BiConsumer)) 遍歷 Map：

```java
// Java
numbers.forEach((k,v) `->` System.out.println("Key = " + k + ", Value = " + v));
```

在 Kotlin 中，使用 `for` 迴圈或 `forEach` (類似於 Java 的 `forEach`) 來遍歷 Map：

```kotlin
// Kotlin
for ((k, v) in numbers) {
    println("Key = $k, Value = $v")
}
// Or (或)
numbers.forEach { (k, v) `->` println("Key = $k, Value = $v") }
```

## Get the first and the last items of a possibly empty collection (取得可能為空集合的第一個和最後一個項目)

在 Java 中，你可以透過檢查集合的大小並使用索引來安全地取得第一個和最後一個項目：

```java
// Java
var list = new ArrayList<>();
//...
if (list.size() > 0) {
    System.out.println(list.get(0));
    System.out.println(list.get(list.size() - 1));
}
```

你也可以將 [`getFirst()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html#getFirst())
和 [`getLast()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html#getLast())
函式用於 [`Deque`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html)
及其繼承者：

```java
// Java
var deque = new ArrayDeque<>();
//...
if (deque.size() > 0) {
    System.out.println(deque.getFirst());
    System.out.println(deque.getLast());
}
```

在 Kotlin 中，有特殊的
函式 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html)
和 [`lastOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-or-null.html)。
使用 [`Elvis operator (Elvis 運算子)`](null-safety#elvis-operator)，你可以根據函式的結果立即執行進一步的動作。
例如，`firstOrNull()`：

```kotlin
// Kotlin
val emails = listOf<String>() // Might be empty (可能為空)
val theOldestEmail = emails.firstOrNull() ?: ""
val theFreshestEmail = emails.lastOrNull() ?: ""
```

## Create a set from a list (從 List 建立 Set)

在 Java 中，若要從
[`List`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/List.html) 建立 [`Set`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Set.html)，你可以使用
[`Set.copyOf`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Set.html#copyOf(java.util.Collection)) 函式：

```java
// Java
public void listToSet() {
    var sourceList = List.of(1, 2, 3, 1);
    var copySet = Set.copyOf(sourceList);
    System.out.println(copySet);
}
```

在 Kotlin 中，使用函式 `toSet()`：

```kotlin
fun main() {

    // Kotlin
    val sourceList = listOf(1, 2, 3, 1)
    val copySet = sourceList.toSet()
    println(copySet)

}
```

## Group elements (分組元素)

在 Java 中，你可以使用 [Collectors](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Collectors.html)
函式 `groupingBy()` 對元素進行分組：

```java
// Java
public void analyzeLogs() {
    var requests = List.of(
        new Request("https://kotlinlang.org/docs/home.html", 200),
        new Request("https://kotlinlang.org/docs/home.html", 400),
        new Request("https://kotlinlang.org/docs/comparison-to-java.html", 200)
    );
    var urlsAndRequests = requests.stream().collect(
            Collectors.groupingBy(Request::getUrl));
    System.out.println(urlsAndRequests);
}
```

在 Kotlin 中，使用函式 [`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html)：

```kotlin
data class Request(
    val url: String,
    val responseCode: Int
)

fun main() {

    // Kotlin
    val requests = listOf(
        Request("https://kotlinlang.org/docs/home.html", 200),
        Request("https://kotlinlang.org/docs/home.html", 400),
        Request("https://kotlinlang.org/docs/comparison-to-java.html", 200)
    )
    println(requests.groupBy(Request::url))

}
```

## Filter elements (篩選元素)

在 Java 中，若要從集合中篩選元素，你需要使用 [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)。
Stream API 具有 `intermediate (中繼)` 和 `terminal (終端)` 操作。`filter()` 是一個中繼操作，它會傳回一個串流。
若要接收作為輸出的集合，你需要使用終端操作，例如 `collect()`。
例如，僅留下那些鍵以 `1` 結尾且值大於 `10` 的配對：

```java
// Java
public void filterEndsWith() {
    var numbers = Map.of("key1", 1, "key2", 2, "key3", 3, "key11", 11);
    var filteredNumbers = numbers.entrySet().stream()
        .filter(entry `->` entry.getKey().endsWith("1") && entry.getValue() > 10)
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    System.out.println(filteredNumbers);
}
```

在 Kotlin 中，篩選已內建於集合中，而且 `filter()` 會傳回已篩選的相同集合類型。
因此，你需要編寫的只是 `filter()` 及其述詞：

```kotlin
fun main() {

    // Kotlin
    val numbers = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredNumbers = numbers.filter { (key, value) `->` key.endsWith("1") && value > 10 }
    println(filteredNumbers)

}
```

在此處了解更多關於 [filtering maps (篩選 Map)](map-operations#filter) 的資訊。

### Filter elements by type (依類型篩選元素)

在 Java 中，若要依類型篩選元素並對它們執行動作，你需要使用
[`instanceof`](https://docs.oracle.com/en/java/javase/17/language/pattern-matching-instanceof-operator.html) 運算子檢查它們的類型，然後進行類型轉換：

```java
// Java
public void objectIsInstance() {
    var numbers = new ArrayList<>();
    numbers.add(null);
    numbers.add(1);
    numbers.add("two");
    numbers.add(3.0);
    numbers.add("four");
    System.out.println("All String elements in upper case:");
    numbers.stream().filter(it `->` it instanceof String)
        .forEach( it `->` System.out.println(((String) it).toUpperCase()));
}
```

在 Kotlin 中，你只需在集合上呼叫 [`filterIsInstance<NEEDED_TYPE>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-is-instance.html)，
而類型轉換會由 [Smart casts (智慧轉換)](typecasts#smart-casts) 完成：

```kotlin
// Kotlin
fun main() {

    // Kotlin
    val numbers = listOf(null, 1, "two", 3.0, "four")
    println("All String elements in upper case:")
    numbers.filterIsInstance<String>().forEach {
        println(it.uppercase())
    }

}
```

### Test predicates (測試述詞)

某些任務要求你檢查是否所有、沒有或任何元素滿足條件。
在 Java 中，你可以透過 [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)
函式 [`allMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#allMatch(java.util.function.Predicate))、
[`noneMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#noneMatch(java.util.function.Predicate)) 和
[`anyMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#anyMatch(java.util.function.Predicate)) 執行所有這些檢查：

```java
// Java
public void testPredicates() {
    var numbers = List.of("one", "two", "three", "four");
    System.out.println(numbers.stream().noneMatch(it `->` it.endsWith("e"))); // false
    System.out.println(numbers.stream().anyMatch(it `->` it.endsWith("e"))); // true
    System.out.println(numbers.stream().allMatch(it `->` it.endsWith("e"))); // false
}
```

在 Kotlin 中，[extension functions (擴充函式)](extensions) `none()`、`any()` 和 `all()`
可用於每個 [Iterable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/#kotlin.collections.Iterable) 物件：

```kotlin
fun main() {

// Kotlin
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.none { it.endsWith("e") })
    println(numbers.any { it.endsWith("e") })
    println(numbers.all { it.endsWith("e") })

}
```

在此處了解更多關於 [test predicates (測試述詞)](collection-filtering#test-predicates)的資訊。

## Collection transformation operations (集合轉換操作)

### Zip elements (壓縮元素)

在 Java 中，你可以透過同時迭代兩個集合來從兩個集合中相同位置的元素建立配對：

```java
// Java
public void zip() {
    var colors = List.of("red", "brown");
    var animals = List.of("fox", "bear", "wolf");

    for (int i = 0; i < Math.min(colors.size(), animals.size()); i++) {
        String animal = animals.get(i);
        System.out.println("The " + animal.substring(0, 1).toUpperCase()
               + animal.substring(1) + " is " + colors.get(i));
   }
}
```

如果你想做一些比僅將元素配對列印到輸出中更複雜的事情，
你可以使用 [Records](https://blogs.oracle.com/javamagazine/post/records-come-to-java)。
在上面的範例中，記錄將是 `record AnimalDescription(String animal, String color) {}`。

在 Kotlin 中，使用 [`zip()`](collection-transformations#zip) 函式來執行相同的操作：

```kotlin
fun main() {

    // Kotlin
    val colors = listOf("red", "brown")
    val animals = listOf("fox", "bear", "wolf")

    println(colors.zip(animals) { color, animal `->` 
        "The ${animal.replaceFirstChar { it.uppercase() }} is $color" })

}
```

`zip()` 會傳回 [Pair](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/) 物件的 List。

:::note
如果集合具有不同的大小，則