[//]: # (title: Java 與 Kotlin 中的集合)
[//]: # (description: 了解如何從 Java 集合遷移到 Kotlin 集合。本指南涵蓋 Kotlin 和 Java 的 List、ArrayList、Map、Set 等資料結構。)

_集合_ (Collections) 是包含可變數量項目（可能為零）的群組，這些項目對於要解決的問題很重要且通常會被操作。
本指南解釋並比較 Java 和 Kotlin 中的集合概念與操作。
它將幫助您從 Java 遷移到 Kotlin，並以純正的 Kotlin 方式編寫程式碼。

本指南的第一部分包含 Java 和 Kotlin 中相同集合操作的快速詞彙表。
它分為 [Java 和 Kotlin 中相同的操作](#operations-that-are-the-same-in-java-and-kotlin)
和 [僅存在於 Kotlin 中的操作](#operations-that-don-t-exist-in-java-s-standard-library)。
本指南的第二部分，從 [可變性](#mutability) 開始，透過觀察特定案例來解釋一些差異。

有關集合的介紹，請參閱 [集合概述](collections-overview.md) 或觀看
Kotlin 開發者倡導者 Sebastian Aigner 的此 [影片](https://www.youtube.com/watch?v=F8jj7e-_jFA)。

> 以下所有範例僅使用 Java 和 Kotlin 標準函式庫 API。
>
{style="note"}

## Java 和 Kotlin 中相同的操作

在 Kotlin 中，許多集合操作與 Java 中對應的操作看起來完全相同。

### 對列表、集合 (Set)、佇列 (Queue) 和雙向佇列 (Deque) 的操作

| 描述 | 常用操作 | 更多 Kotlin 替代方案 |
|-------------|-----------|---------------------|
| 新增一個或多個元素 | `add()`, `addAll()` | 使用 [`plusAssign`(`+=`) 運算子](collection-plus-minus.md)：`collection += element`，`collection += anotherCollection`。 |
| 檢查集合是否包含一個或多個元素 | `contains()`, `containsAll()` | 使用 [`in` 關鍵字](collection-elements.md#check-element-existence) 以運算子形式呼叫 `contains()`：`element in collection`。 |
| 檢查集合是否為空 | `isEmpty()` | 使用 [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html) 來檢查集合是否不為空。 |
| 在特定條件下移除 | `removeIf()` | |
| 只保留選定的元素 | `retainAll()` | |
| 從集合中移除所有元素 | `clear()` | |
| 從集合中獲取串流 | `stream()` | Kotlin 有自己處理串流的方式：[序列](#sequences) 以及像 [`map()`](collection-filtering.md) 和 [`filter()`](#filter-elements) 這樣的方法。 |
| 從集合中獲取迭代器 | `iterator()` | |

### 對映射 (Map) 的操作

| 描述 | 常用操作 | 更多 Kotlin 替代方案 |
|-------------|-----------|---------------------|
| 新增一個或多個元素 | `put()`, `putAll()`, `putIfAbsent()`| 在 Kotlin 中，賦值 `map[key] = value` 的行為與 `put(key, value)` 相同。此外，您可以使用 [`plusAssign`(`+=`) 運算子](collection-plus-minus.md)：`map += Pair(key, value)` 或 `map += anotherMap`。 |
| 取代一個或多個元素 | `put()`, `replace()`, `replaceAll()` | 使用索引運算子 `map[key] = value` 代替 `put()` 和 `replace()`。 |
| 獲取元素 | `get()` | 使用索引運算子獲取元素：`map[index]`。 |
| 檢查 Map 是否包含一個或多個元素 | `containsKey()`, `containsValue()` | 使用 [`in` 關鍵字](collection-elements.md#check-element-existence) 以運算子形式呼叫 `contains()`：`element in map`。 |
| 檢查 Map 是否為空 | `isEmpty()` | 使用 [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html) 來檢查 Map 是否不為空。 |
| 移除元素 | `remove(key)`, `remove(key, value)` | 使用 [`minusAssign`(`-=`) 運算子](collection-plus-minus.md)：`map -= key`。 |
| 從 Map 中移除所有元素 | `clear()` | |
| 從 Map 中獲取串流 | `stream()` 於 entry、key 或 value 上 | |

### 僅存在於列表的操作

| 描述 | 常用操作 | 更多 Kotlin 替代方案 |
|-------------|-----------|---------------------|
| 獲取元素的索引 | `indexOf()` | |
| 獲取元素的最後一個索引 | `lastIndexOf()` | |
| 獲取元素 | `get()` | 使用索引運算子獲取元素：`list[index]`。 |
| 取得子列表 | `subList()` | |
| 取代一個或多個元素 | `set()`, `replaceAll()` | 使用索引運算子代替 `set()`：`list[index] = value`。 |

## 略有差異的操作

### 對任何集合類型的操作

| 描述 | Java | Kotlin |
|-------------|------|--------|
| 獲取集合大小 | `size()` | `count()`, `size` |
| 對巢狀集合元素進行扁平化存取 | `collectionOfCollections.forEach(flatCollection::addAll)` 或 `collectionOfCollections.stream().flatMap().collect()` | [`flatten()`](collection-transformations.md#flatten) 或 [`flatMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flat-map.html) |
| 對每個元素應用給定的函數 | `stream().map().collect()` | [`map()`](collection-filtering.md) |
| 依序將提供的操作應用於集合元素並返回累積結果 | `stream().reduce()` | [`reduce()`, `fold()`](collection-aggregate.md#fold-and-reduce) |
| 根據分類器分組元素並計數 | `stream().collect(Collectors.groupingBy(classifier, counting()))` | [`eachCount()`](collection-grouping.md) |
| 按條件過濾 | `stream().filter().collect()` | [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) |
| 檢查集合元素是否滿足條件 | `stream().noneMatch()`, `stream().anyMatch()`, `stream().allMatch()` | [`none()`, `any()`, `all()`](collection-filtering.md) |
| 排序元素 | `stream().sorted().collect()` | [`sorted()`](collection-ordering.md#natural-order) |
| 取得前 N 個元素 | `stream().limit(N).collect()` | [`take(N)`](collection-parts.md#take-and-drop) |
| 依謂詞取得元素 | `stream().takeWhile().collect()` | [`takeWhile()`](collection-parts.md#take-and-drop) |
| 跳過前 N 個元素 | `stream().skip(N).collect()` | [`drop(N)`](collection-parts.md#take-and-drop) |
| 依謂詞跳過元素 | `stream().dropWhile().collect()` | [`dropWhile()`](collection-parts.md#take-and-drop) |
| 從集合元素及其相關值建構 Map | `stream().collect(toMap(keyMapper, valueMapper))` | [`associate()`](collection-transformations.md#associate) |

若要對 Map 執行上述所有操作，您首先需要取得該 Map 的 `entrySet`。

### 對列表的操作

| 描述 | Java | Kotlin |
|-------------|------|--------|
| 依自然順序排序列表 | `sort(null)` | `sort()` |
| 依降序排序列表 | `sort(comparator)` | `sortDescending()` |
| 從列表中移除元素 | `remove(index)`, `remove(element)`| `removeAt(index)`, `remove(element)` 或 [`collection -= element`](collection-plus-minus.md) |
| 用特定值填充列表的所有元素 | `Collections.fill()` | [`fill()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fill.html) |
| 從列表中獲取唯一元素 | `stream().distinct().toList()` | [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) |

## Java 標準函式庫中不存在的操作

* [`zip()`, `unzip()`](collection-transformations.md) – 轉換集合。
* [`aggregate()`](collection-grouping.md) – 根據條件分組。
* [`takeLast()`, `takeLastWhile()`, `dropLast()`, `dropLastWhile()`](collection-parts.md#take-and-drop) – 依謂詞取得或捨棄元素。
* [`slice()`, `chunked()`, `windowed()`](collection-parts.md) – 檢索集合部分。
* [加號 (`+`) 和減號 (`-`) 運算子](collection-plus-minus.md) – 新增或移除元素。

如果您想深入了解 `zip()`、`chunked()`、`windowed()` 和其他一些操作，請觀看 Sebastian Aigner 關於 Kotlin 中進階集合操作的此影片：

<video src="https://www.youtube.com/v/N4CpLxGJlq0" title="Advanced Collection Operations"/>

## 可變性

在 Java 中，存在可變集合：

```java
// Java
// This list is mutable!
public List<Customer> getCustomers() { ... }
```
{id="mutability-java"}

部分可變的：

```java
// Java
List<String> numbers = Arrays.asList("one", "two", "three", "four");
numbers.add("five"); // Fails in runtime with `UnsupportedOperationException`
```
{id="mutability-partly-java"}

以及不可變的：

```java
// Java
List<String> numbers = new LinkedList<>();
// This list is immutable!
List<String> immutableCollection = Collections.unmodifiableList(numbers);
immutableCollection.add("five"); // Fails in runtime with `UnsupportedOperationException`
```
{id="immutable-java"}

如果您在 IntelliJ IDEA 中編寫最後兩段程式碼，IDE 將會警告您正在嘗試修改一個不可變的物件。
這段程式碼將會編譯成功，但在執行時會因為 `UnsupportedOperationException` 而失敗。您無法透過查看集合的類型來判斷其是否可變。

與 Java 不同，在 Kotlin 中，您可以根據需要明確宣告可變或唯讀的集合。
如果您嘗試修改唯讀集合，程式碼將不會編譯成功：

```kotlin
// Kotlin
val numbers = mutableListOf("one", "two", "three", "four")
numbers.add("five")            // This is OK
val immutableNumbers = listOf("one", "two")
//immutableNumbers.add("five") // Compilation error - Unresolved reference: add
```
{id="mutability-kotlin"}

請在 [Kotlin 程式碼慣例](coding-conventions.md#immutability) 頁面閱讀更多關於不可變性的內容。

## 共變性

在 Java 中，您不能將具有子類型 (descendant type) 的集合傳遞給接受祖先類型 (ancestor type) 集合的函數。
例如，如果 `Rectangle` 繼承自 `Shape`，您不能將 `Rectangle` 元素的集合傳遞給接受 `Shape` 元素集合的函數。
為了使程式碼可編譯，請使用 `? extends Shape` 類型，這樣函數就可以接受 `Shape` 的任何繼承者的集合：

```java
// Java
class Shape {}

class Rectangle extends Shape {}

public void doSthWithShapes(List<? extends Shape> shapes) {
/* If using just List<Shape>, the code won't compile when calling
this function with the List<Rectangle> as the argument as below */
}

public void main() {
    var rectangles = List.of(new Rectangle(), new Rectangle());
    doSthWithShapes(rectangles);
}
```
{id="covariance-java"}

在 Kotlin 中，唯讀集合類型是 [共變的](generics.md#variance)。這表示如果 `Rectangle` 類別繼承自 `Shape` 類別，
您可以在任何需要 `List<Shape>` 類型的地方使用 `List<Rectangle>` 類型。
換句話說，集合類型具有與元素類型相同的子類型關係。Map 在值類型上是共變的，但在鍵類型上不是。
可變集合不是共變的 – 這將導致執行時失敗。

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
{kotlin-runnable="true" id="covariance-kotlin"}

在此閱讀更多關於 [集合類型](collections-overview.md#collection-types) 的內容。

## 範圍與進程

在 Kotlin 中，您可以使用 [範圍](ranges.md) 來建立區間。例如，`Version(1, 11)..Version(1, 30)` 包含從 `1.11` 到 `1.30` 的所有版本。
您可以使用 `in` 運算子來檢查您的版本是否在範圍內：`Version(0, 9) in versionRange`。

在 Java 中，您需要手動檢查 `Version` 是否符合兩個邊界：

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
{id="ranges-java"}

在 Kotlin 中，您將範圍作為一個整體物件來操作。您無需創建兩個變數並將 `Version` 與它們進行比較：

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
{kotlin-runnable="true" id="ranges-kotlin"}

一旦您需要排除其中一個邊界，例如檢查版本是否大於或等於 (`>=`) 最小版本且小於 (`<`) 最大版本，這些包含性的範圍就無法派上用場。

## 多重條件比較

在 Java 中，若要根據多重條件比較物件，您可以使用 [`Comparator`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html) 介面中的 [`comparing()`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html#comparing-java.util.function.Function-) 和 [`thenComparingX()`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html#thenComparing-java.util.Comparator-) 函數。
例如，根據姓名和年齡比較人物：

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
{id="comparison-java"}

在 Kotlin 中，您只需列舉要比較的欄位：

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
{kotlin-runnable="true" id="comparison-kotlin"}

## 序列

在 Java 中，您可以這樣產生一連串數字：

```java
// Java
int sum = IntStream.iterate(1, e -> e + 3)
    .limit(10).sum();
System.out.println(sum); // Prints 145
```
{id="sequences-java"}

在 Kotlin 中，使用 _[序列](sequences.md)_。序列的多步驟處理在可能的情況下會延遲執行 –
實際的計算只會在請求整個處理鏈的結果時發生。

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val sum = generateSequence(1) {
        it + 3
    }.take(10).sum()
    println(sum) // Prints 145
//sampleEnd
}
```
{kotlin-runnable="true" id="sequences-kotlin"}

序列可以減少執行某些過濾操作所需的步驟數量。
請參閱 [序列處理範例](sequences.md#sequence-processing-example)，其中顯示了 `Iterable` 和 `Sequence` 之間的差異。

## 從列表中移除元素

在 Java 中，[`remove()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/List.html#remove(int)) 函數接受要移除元素的索引。

當移除一個整數元素時，請使用 `Integer.valueOf()` 函數作為 `remove()` 函數的參數：

```java
// Java
public void remove() {
    var numbers = new ArrayList<>();
    numbers.add(1);
    numbers.add(2);
    numbers.add(3);
    numbers.add(1);
    numbers.remove(1); // This removes by index
    System.out.println(numbers); // [1, 3, 1]
    numbers.remove(Integer.valueOf(1));
    System.out.println(numbers); // [3, 1]
}
```
{id="remove-elements-java"}

在 Kotlin 中，有兩種元素移除類型：透過 [`removeAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove-at.html) 根據索引移除，以及透過 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove.html) 根據值移除。

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val numbers = mutableListOf(1, 2, 3, 1)
    numbers.removeAt(0)
    println(numbers) // [2, 3, 1]
    numbers.remove(1)
    println(numbers) // [2, 3]
//sampleEnd
}
```
{kotlin-runnable="true" id="remove-elements-kotlin"}

## 遍歷 Map

在 Java 中，您可以透過 [`forEach`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Map.html#forEach(java.util.function.BiConsumer)) 遍歷 Map：

```java
// Java
numbers.forEach((k,v) -> System.out.println("Key = " + k + ", Value = " + v));
```
{id="traverse-map-java"}

在 Kotlin 中，使用 `for` 迴圈或 `forEach`（類似於 Java 的 `forEach`）來遍歷 Map：

```kotlin
// Kotlin
for ((k, v) in numbers) {
    println("Key = $k, Value = $v")
}
// Or
numbers.forEach { (k, v) -> println("Key = $k, Value = $v") }
```
{id="traverse-map-kotlin"}

## 取得可能為空的集合中的第一個和最後一個項目

在 Java 中，您可以透過檢查集合的大小並使用索引來安全地取得第一個和最後一個項目：

```java
// Java
var list = new ArrayList<>();
//...
if (list.size() > 0) {
    System.out.println(list.get(0));
    System.out.println(list.get(list.size() - 1));
}
```
{id="list-get-first-last-java"}

您也可以對 [`Deque`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html) 及其繼承者使用 [`getFirst()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html#getFirst()) 和 [`getLast()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html#getLast()) 函數：

```java
// Java
var deque = new ArrayDeque<>();
//...
if (deque.size() > 0) {
    System.out.println(deque.getFirst());
    System.out.println(deque.getLast());
}
```
{id="deque-get-first-last-java"}

在 Kotlin 中，有特殊的函數 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html)
和 [`lastOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-or-null.html)。
使用 [`Elvis 運算子`](null-safety.md#elvis-operator)，您可以根據函數的結果立即執行進一步的操作。
例如，`firstOrNull()`：

```kotlin
// Kotlin
val emails = listOf<String>() // Might be empty
val theOldestEmail = emails.firstOrNull() ?: ""
val theFreshestEmail = emails.lastOrNull() ?: ""
```
{id="get-first-last-kotlin"}

## 從列表中建立集合 (Set)

在 Java 中，若要從 [`List`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/List.html) 建立 [`Set`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Set.html)，您可以使用 [`Set.copyOf`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Set.html#copyOf(java.util.Collection)) 函數：

```java
// Java
public void listToSet() {
    var sourceList = List.of(1, 2, 3, 1);
    var copySet = Set.copyOf(sourceList);
    System.out.println(copySet);
}
```
{id="list-to-set-java"}

在 Kotlin 中，使用函數 `toSet()`：

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val sourceList = listOf(1, 2, 3, 1)
    val copySet = sourceList.toSet()
    println(copySet)
//sampleEnd
}
```
{kotlin-runnable="true" id="list-to-set-kotlin"}

## 分組元素

在 Java 中，您可以使用 [Collectors](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Collectors.html) 函數 `groupingBy()` 來分組元素：

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
{id="group-elements-java"}

在 Kotlin 中，使用函數 [`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html)：

```kotlin
data class Request(
    val url: String,
    val responseCode: Int
)

fun main() {
//sampleStart
    // Kotlin
    val requests = listOf(
        Request("https://kotlinlang.org/docs/home.html", 200),
        Request("https://kotlinlang.org/docs/home.html", 400),
        Request("https://kotlinlang.org/docs/comparison-to-java.html", 200)
    )
    println(requests.groupBy(Request::url))
//sampleEnd
}
```
{kotlin-runnable="true" id="group-elements-kotlin"}

## 過濾元素

在 Java 中，若要從集合中過濾元素，您需要使用 [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)。
Stream API 具有 `中間操作` (intermediate operation) 和 `終端操作` (terminal operation)。`filter()` 是一個中間操作，它返回一個串流。
若要接收集合作為輸出，您需要使用終端操作，例如 `collect()`。
例如，只保留鍵以 `1` 結尾且值大於 `10` 的那些鍵值對：

```java
// Java
public void filterEndsWith() {
    var numbers = Map.of("key1", 1, "key2", 2, "key3", 3, "key11", 11);
    var filteredNumbers = numbers.entrySet().stream()
        .filter(entry -> entry.getKey().endsWith("1") && entry.getValue() > 10)
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    System.out.println(filteredNumbers);
}
```
{id="filter-elements-java"}

在 Kotlin 中，過濾是內建在集合中的，並且 `filter()` 返回與被過濾的集合相同的集合類型。
因此，您只需編寫 `filter()` 及其謂詞 (predicate)：

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val numbers = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredNumbers = numbers.filter { (key, value) -> key.endsWith("1") && value > 10 }
    println(filteredNumbers)
//sampleEnd
}
```
{kotlin-runnable="true" id="filter-elements-kotlin"}

在此深入了解 [過濾 Map](map-operations.md#filter) 的內容。

### 按類型過濾元素

在 Java 中，若要按類型過濾元素並對其執行操作，您需要使用 [`instanceof`](https://docs.oracle.com/en/java/javase/17/language/pattern-matching-instanceof-operator.html) 運算子檢查其類型，然後進行類型轉換：

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
    numbers.stream().filter(it -> it instanceof String)
        .forEach( it -> System.out.println(((String) it).toUpperCase()));
}
```
{id="filter-by-type-java"}

在 Kotlin 中，您只需在集合上呼叫 [`filterIsInstance<NEEDED_TYPE>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-is-instance.html)，並且類型轉換會透過 [智慧型轉換](typecasts.md#smart-casts) 完成：

```kotlin
// Kotlin
fun main() {
//sampleStart
    // Kotlin
    val numbers = listOf(null, 1, "two", 3.0, "four")
    println("All String elements in upper case:")
    numbers.filterIsInstance<String>().forEach {
        println(it.uppercase())
    }
//sampleEnd
}
```
{kotlin-runnable="true" id="filter-by-type-kotlin"}

### 測試謂詞

有些任務要求您檢查所有、沒有或任何元素是否滿足特定條件。
在 Java 中，您可以透過 [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html) 函數 [`allMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#allMatch(java.util.function.Predicate))、[`noneMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#noneMatch(java.util.function.Predicate)) 和 [`anyMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#anyMatch(java.util.function.Predicate)) 進行所有這些檢查：

```java
// Java
public void testPredicates() {
    var numbers = List.of("one", "two", "three", "four");
    System.out.println(numbers.stream().noneMatch(it -> it.endsWith("e"))); // false
    System.out.println(numbers.stream().anyMatch(it -> it.endsWith("e"))); // true
    System.out.println(numbers.stream().allMatch(it -> it.endsWith("e"))); // false
}
```
{id="test-predicates-java"}

在 Kotlin 中，[擴充函數](extensions.md) `none()`、`any()` 和 `all()` 可用於每個 [Iterable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/#kotlin.collections.Iterable) 物件：

```kotlin
fun main() {
//sampleStart
// Kotlin
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.none { it.endsWith("e") })
    println(numbers.any { it.endsWith("e") })
    println(numbers.all { it.endsWith("e") })
//sampleEnd
}
```
{kotlin-runnable="true" id="test-predicates-kotlin"}

在此深入了解 [測試謂詞](collection-filtering.md#test-predicates)。

## 集合轉換操作

### 壓縮元素

在 Java 中，您可以透過同時迭代兩個集合來從相同位置的元素建立配對：

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
{id="zip-elements-java"}

如果您想做比單純將元素配對列印到輸出更複雜的事情，可以使用 [Records](https://blogs.oracle.com/javamagazine/post/records-come-to-java)。
在上面的範例中，record 將會是 `record AnimalDescription(String animal, String color) {}`。

在 Kotlin 中，使用 [`zip()`](collection-transformations.md#zip) 函數來做相同的事情：

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val colors = listOf("red", "brown")
    val animals = listOf("fox", "bear", "wolf")

    println(colors.zip(animals) { color, animal ->
        "The ${animal.replaceFirstChar { it.uppercase() }} is $color" })
//sampleEnd
}
```
{kotlin-runnable="true" id="zip-elements-kotlin"}

`zip()` 返回 [Pair](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/) 物件的 List。

> 如果集合的大小不同，`zip()` 的結果將以較小的大小為準。較大集合中的最後幾個元素將不會包含在結果中。
>
{style="note"}

### 關聯元素

在 Java 中，您可以使用 [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html) 將元素與特性關聯起來：

```java
// Java
public void associate() {
    var numbers = List.of("one", "two", "three", "four");
    var wordAndLength = numbers.stream()
        .collect(toMap(number -> number, String::length));
    System.out.println(wordAndLength);
}
```
{id="associate-elements-java"}

在 Kotlin 中，使用 [`associate()`](collection-transformations.md#associate) 函數：

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })
//sampleEnd
}
```
{kotlin-runnable="true" id="associate-elements-kotlin"}

## 下一步是什麼？

* 造訪 [Kotlin Koans](koans.md) – 完成練習以學習 Kotlin 語法。每個練習都建立為一個失敗的單元測試，您的任務是使其通過。
* 瀏覽其他 [Kotlin 慣用法](idioms.md)。
* 了解如何使用 [Java 到 Kotlin 轉換器](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k) 將現有的 Java 程式碼轉換為 Kotlin。
* 探索 [Kotlin 中的集合](collections-overview.md)。

如果您有喜歡的慣用法，我們邀請您透過發送 Pull Request 來分享它。