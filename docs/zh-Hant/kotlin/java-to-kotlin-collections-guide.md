[//]: # (title: Java 與 Kotlin 中的集合)

<web-summary>了解如何從 Java 集合遷移到 Kotlin 集合。本指南涵蓋了 Kotlin 和 Java 的 Lists、ArrayLists、Maps、Sets 等資料結構。</web-summary>

_集合_ 是數量可變（可能為零）的項目群組，這些項目對於所要解決的問題具有重要意義，並且是常用的操作對象。
本指南解釋並比較了 Java 與 Kotlin 中的集合概念和操作。
它將幫助您從 Java 遷移到 Kotlin，並以純正的 Kotlin 方式編寫程式碼。

本指南的第一部分包含了 Java 與 Kotlin 中相同集合操作的快速詞彙表。
它分為[在 Java 和 Kotlin 中相同的操作](#operations-that-are-the-same-in-java-and-kotlin)和[僅存在於 Kotlin 的標準函式庫中的操作](#operations-that-don-t-exist-in-java-s-standard-library)。
本指南的第二部分從[可變性](#mutability)開始，透過具體案例解釋了一些差異。

有關集合的介紹，請參閱[集合概述](collections-overview.md)或觀看 Kotlin 開發者推廣者 Sebastian Aigner 的這段[影片](https://www.youtube.com/watch?v=F8jj7e-_jFA)。

> 以下所有範例僅使用 Java 和 Kotlin 標準函式庫的 API。
>
{style="note"}

## Java 與 Kotlin 中相同的操作

在 Kotlin 中，許多集合操作與 Java 中的對應操作看起來完全相同。

### 對 Lists、Sets、Queues 和 Deques 的操作

| 描述 | 常用操作 | 更多 Kotlin 替代方案 |
|-------------|-----------|---------------------|
| 添加元素 | `add()`, `addAll()` | 使用 [`plusAssign` (`+=`) 運算子](collection-plus-minus.md)：`collection += element`，`collection += anotherCollection`。 |
| 檢查集合是否包含一個或多個元素 | `contains()`, `containsAll()` | 使用 [`in` 關鍵字](collection-elements.md#check-element-existence)以運算子形式呼叫 `contains()`：`element in collection`。 |
| 檢查集合是否為空 | `isEmpty()` | 使用 [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html) 檢查集合是否不為空。 |
| 在特定條件下移除 | `removeIf()` | |
| 只保留選定的元素 | `retainAll()` | |
| 從集合中移除所有元素 | `clear()` | |
| 從集合中取得 stream | `stream()` | Kotlin 有自己的方式來處理 stream：[序列](#sequences)以及像 [`map()`](collection-filtering.md) 和 [`filter()`](#filter-elements) 這樣的方法。 |
| 從集合中取得 iterator | `iterator()` | |

### 對 Maps 的操作

| 描述 | 常用操作 | 更多 Kotlin 替代方案 |
|-------------|-----------|---------------------|
| 添加元素 | `put()`, `putAll()`, `putIfAbsent()`| 在 Kotlin 中，賦值操作 `map[key] = value` 的行為與 `put(key, value)` 相同。此外，您可以使用 [`plusAssign` (`+=`) 運算子](collection-plus-minus.md)：`map += Pair(key, value)` 或 `map += anotherMap`。 |
| 替換一個或多個元素 | `put()`, `replace()`, `replaceAll()` | 使用索引運算子 `map[key] = value` 而非 `put()` 和 `replace()`。 |
| 取得元素 | `get()` | 使用索引運算子來取得元素：`map[index]`。 |
| 檢查映射是否包含一個或多個元素 | `containsKey()`, `containsValue()` | 使用 [`in` 關鍵字](collection-elements.md#check-element-existence)以運算子形式呼叫 `contains()`：`element in map`。 |
| 檢查映射是否為空 |  `isEmpty()` | 使用 [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html) 檢查映射是否不為空。 |
| 移除元素 | `remove(key)`, `remove(key, value)` | 使用 [`minusAssign` (`-=`) 運算子](collection-plus-minus.md)：`map -= key`。 |
| 從映射中移除所有元素 | `clear()` | |
| 從映射中取得 stream | 對 entries、keys 或 values 的 `stream()` | |

### 僅適用於 Lists 的操作

| 描述 | 常用操作 | 更多 Kotlin 替代方案 |
|-------------|-----------|---------------------|
| 取得元素的索引 | `indexOf()` | |
| 取得元素的最後索引 | `lastIndexOf()` | |
| 取得元素 | `get()` | 使用索引運算子來取得元素：`list[index]`。 |
| 取得子列表 | `subList()` | |
| 替換一個或多個元素 | `set()`,  `replaceAll()` | 使用索引運算子而非 `set()`：`list[index] = value`。 |

## 稍有不同的操作

### 對任何集合類型的操作

| 描述 | Java | Kotlin |
|-------------|------|--------|
| 取得集合的大小 | `size()` | `count()`, `size` |
| 平面存取巢狀集合元素 | `collectionOfCollections.forEach(flatCollection::addAll)` 或 `collectionOfCollections.stream().flatMap().collect()` | [`flatten()`](collection-transformations.md#flatten) 或 [`flatMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flat-map.html) |
| 將給定的函數應用於每個元素 | `stream().map().collect()` | [`map()`](collection-filtering.md) |
| 依序對集合元素應用所提供的操作並回傳累計結果 | `stream().reduce()` | [`reduce()`, `fold()`](collection-aggregate.md#fold-and-reduce) |
| 依分類器分組元素並計數 | `stream().collect(Collectors.groupingBy(classifier, counting()))` | [`eachCount()`](collection-grouping.md) |
| 依條件篩選 | `stream().filter().collect()` | [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) |
| 檢查集合元素是否滿足條件 | `stream().noneMatch()`, `stream().anyMatch()`, `stream().allMatch()` | [`none()`, `any()`, `all()`](collection-filtering.md) |
| 排序元素 | `stream().sorted().collect()` | [`sorted()`](collection-ordering.md#natural-order) |
| 取前 N 個元素 | `stream().limit(N).collect()` | [`take(N)`](collection-parts.md#take-and-drop) |
| 依判斷式取元素 | `stream().takeWhile().collect()` | [`takeWhile()`](collection-parts.md#take-and-drop) |
| 跳過前 N 個元素 | `stream().skip(N).collect()` | [`drop(N)`](collection-parts.md#take-and-drop) |
| 依判斷式跳過元素 | `stream().dropWhile().collect()` | [`dropWhile()`](collection-parts.md#take-and-drop) |
| 從集合元素及與其關聯的特定值建立映射 | `stream().collect(toMap(keyMapper, valueMapper))` | [`associate()`](collection-transformations.md#associate) |

若要對映射執行上述所有操作，您首先需要取得映射的 `entrySet`。

### 對 Lists 的操作

| 描述 | Java | Kotlin |
|-------------|------|--------|
| 將列表按自然順序排序 | `sort(null)` | `sort()` |
| 將列表按降序排序 | `sort(comparator)` | `sortDescending()` |
| 從列表中移除元素 | `remove(index)`, `remove(element)`| `removeAt(index)`, `remove(element)` 或 [`collection -= element`](collection-plus-minus.md) |
| 以特定值填充列表的所有元素 | `Collections.fill()` | [`fill()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fill.html) |
| 從列表中取得唯一元素 | `stream().distinct().toList()` | [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) |

## Java 標準函式庫中不存在的操作

*   [`zip()`, `unzip()`](collection-transformations.md) – 轉換集合。
*   [`aggregate()`](collection-grouping.md) – 依條件分組。
*   [`takeLast()`, `takeLastWhile()`, `dropLast()`, `dropLastWhile()`](collection-parts.md#take-and-drop) – 依判斷式取用或捨棄元素。
*   [`slice()`, `chunked()`, `windowed()`](collection-parts.md) – 檢索集合部分。
*   [加 (`+`) 和減 (`-`) 運算子](collection-plus-minus.md) – 添加或移除元素。

如果您想深入了解 `zip()`、`chunked()`、`windowed()` 和其他一些操作，請觀看 Sebastian Aigner 關於 Kotlin 進階集合操作的這段影片：

<video src="https://www.youtube.com/v/N4CpLxGJlq0" title="進階集合操作"/>

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

如果您在 IntelliJ IDEA 中編寫最後兩段程式碼，IDE 會警告您正在嘗試修改一個不可變的物件。
此程式碼將會編譯並在執行期因 `UnsupportedOperationException` 失敗。您無法透過查看其類型來判斷集合是否可變。

與 Java 不同，在 Kotlin 中，您可以根據需求明確宣告可變或唯讀集合。
如果您嘗試修改唯讀集合，程式碼將無法編譯：

```kotlin
// Kotlin
val numbers = mutableListOf("one", "two", "three", "four")
numbers.add("five")            // 這是 OK 的
val immutableNumbers = listOf("one", "two")
//immutableNumbers.add("five") // 編譯錯誤 - 未解析的引用: add
```
{id="mutability-kotlin"}

在 [Kotlin 編碼慣例](coding-conventions.md#immutability)頁面閱讀更多關於不可變性的資訊。

## 協變性

在 Java 中，您無法將具有後代類型的集合傳遞給接受祖先類型集合的函數。
例如，如果 `Rectangle` 擴展 `Shape`，您不能將 `Rectangle` 元素的集合傳遞給接受 `Shape` 元素集合的函數。
為了使程式碼可編譯，請使用 `? extends Shape` 類型，這樣函數就可以接受 `Shape` 的任何繼承者的集合：

```java
// Java
class Shape {}

class Rectangle extends Shape {}

public void doSthWithShapes(List<? extends Shape> shapes) {
/* 如果只使用 List<Shape>，當以 List<Rectangle> 作為參數呼叫此函數時，程式碼將不會編譯 */
}

public void main() {
    var rectangles = List.of(new Rectangle(), new Rectangle());
    doSthWithShapes(rectangles);
}
```
{id="covariance-java"}

在 Kotlin 中，唯讀集合類型是[協變的](generics.md#variance)。這意味著如果 `Rectangle` 類別繼承自 `Shape` 類別，您可以在任何需要 `List<Shape>` 類型的地方使用 `List<Rectangle>` 類型。換句話說，集合類型與元素類型具有相同的子類型關係。映射在值類型上是協變的，但在鍵類型上不是。
可變集合不是協變的——這會導致執行期失敗。

```kotlin
// Kotlin
open class Shape(val name: String)

class Rectangle(private val rectangleName: String) : Shape(rectangleName)

fun doSthWithShapes(shapes: List<Shape>) {
    println("形狀為: ${shapes.joinToString { it.name }}")
}

fun main() {
    val rectangles = listOf(Rectangle("rhombus"), Rectangle("parallelepiped"))
    doSthWithShapes(rectangles)
}
```
{kotlin-runnable="true" id="covariance-kotlin"}

在此處閱讀更多關於[集合類型](collections-overview.md#collection-types)的資訊。

## 範圍和進度

在 Kotlin 中，您可以使用[範圍](ranges.md)創建區間。例如，`Version(1, 11)..Version(1, 30)` 包含從 `1.11` 到 `1.30` 的所有版本。
您可以使用 `in` 運算子檢查您的版本是否在範圍內：`Version(0, 9) in versionRange`。

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

在 Kotlin 中，您將範圍作為一個整體物件來操作。您不需要創建兩個變數並比較 `Version` 與它們：

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

一旦您需要排除其中一個邊界，例如檢查版本是否大於或等於 (`>=`) 最小版本且小於 (`<`) 最大版本時，這些包含範圍將無濟於事。

## 多準則比較

在 Java 中，若要依多個準則比較物件，您可以使用 [`Comparator`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html) 介面中的 [`comparing()`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html#comparing-java.util.function.Function-) 和 [`thenComparingX()`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html#thenComparing-java.util.Comparator-) 函數。
例如，依姓名和年齡比較人物：

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

在 Kotlin 中，您只需列舉您想要比較的欄位：

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

在 Java 中，您可以這樣產生數字序列：

```java
// Java
int sum = IntStream.iterate(1, e -> e + 3)
    .limit(10).sum();
System.out.println(sum); // 輸出 145
```
{id="sequences-java"}

在 Kotlin 中，請使用 _[序列](sequences.md)_。
序列的多步驟處理在可能的情況下會延遲執行——實際計算只在請求整個處理鏈的結果時發生。

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val sum = generateSequence(1) {
        it + 3
    }.take(10).sum()
    println(sum) // 輸出 145
//sampleEnd
}
```
{kotlin-runnable="true" id="sequences-kotlin"}

序列可以減少執行某些過濾操作所需的步驟數量。
請參閱[序列處理範例](sequences.md#sequence-processing-example)，其中顯示了 `Iterable` 和 `Sequence` 之間的差異。

## 從列表中移除元素

在 Java 中，[`remove()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/List.html#remove(int)) 函數接受要移除元素的索引。

當移除整數元素時，請使用 `Integer.valueOf()` 函數作為 `remove()` 函數的參數：

```java
// Java
public void remove() {
    var numbers = new ArrayList<>();
    numbers.add(1);
    numbers.add(2);
    numbers.add(3);
    numbers.add(1);
    numbers.remove(1); // 這是依索引移除
    System.out.println(numbers); // [1, 3, 1]
    numbers.remove(Integer.valueOf(1));
    System.out.println(numbers); // [3, 1]
}
```
{id="remove-elements-java"}

在 Kotlin 中，有兩種元素移除方式：依索引使用 [`removeAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove-at.html) 和依值使用 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove.html)。

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

## 遍歷映射

在 Java 中，您可以透過 [`forEach`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Map.html#forEach(java.util.function.BiConsumer)) 遍歷映射：

```java
// Java
numbers.forEach((k,v) -> System.out.println("Key = " + k + ", Value = " + v));
```
{id="traverse-map-java"}

在 Kotlin 中，使用 `for` 迴圈或 `forEach`（類似於 Java 的 `forEach`）來遍歷映射：

```kotlin
// Kotlin
for ((k, v) in numbers) {
    println("Key = $k, Value = $v")
}
// 或者
numbers.forEach { (k, v) -> println("Key = $k, Value = $v") }
```
{id="traverse-map-kotlin"}

## 取得可能為空集合的第一個和最後一個項目

在 Java 中，您可以透過檢查集合大小並使用索引來安全地取得第一個和最後一個項目：

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

您也可以將 [`getFirst()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html#getFirst()) 和 [`getLast()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html#getLast()) 函數用於 [`Deque`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html) 及其繼承者：

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

在 Kotlin 中，有特殊的函數 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html) 和 [`lastOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-or-null.html)。
使用[`Elvis 運算子`](null-safety.md#elvis-operator)，您可以根據函數的結果立即執行進一步的操作。例如，`firstOrNull()`：

```kotlin
// Kotlin
val emails = listOf<String>() // 可能為空
val theOldestEmail = emails.firstOrNull() ?: ""
val theFreshestEmail = emails.lastOrNull() ?: ""
```
{id="get-first-last-kotlin"}

## 從列表中建立集合

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

在 Kotlin 中，請使用 `toSet()` 函數：

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

在 Kotlin 中，請使用 [`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html) 函數：

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
Stream API 具有 `中間` (intermediate) 和 `終端` (terminal) 操作。`filter()` 是一個中間操作，它返回一個 stream。
若要接收集合作為輸出，您需要使用終端操作，例如 `collect()`。
例如，只保留那些鍵以 `1` 結尾且值大於 `10` 的配對：

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

在 Kotlin 中，過濾功能已內建於集合中，並且 `filter()` 返回被過濾的相同集合類型。
所以，您只需編寫 `filter()` 及其判斷式：

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

在此處了解更多關於[過濾映射](map-operations.md#filter)的資訊。

### 依類型篩選元素

在 Java 中，若要依類型篩選元素並對其執行操作，您需要使用 [`instanceof`](https://docs.oracle.com/en/java/javase/17/language/pattern-matching-instanceof-operator.html) 運算子檢查其類型，然後進行類型轉換：

```java
// Java
public void objectIsInstance() {
    var numbers = new ArrayList<>();
    numbers.add(null);
    numbers.add(1);
    numbers.add("two");
    numbers.add(3.0);
    numbers.add("four");
    System.out.println("所有 String 元素大寫：");
    numbers.stream().filter(it -> it instanceof String)
        .forEach( it -> System.out.println(((String) it).toUpperCase()));
}
```
{id="filter-by-type-java"}

在 Kotlin 中，您只需在集合上呼叫 [`filterIsInstance<NEEDED_TYPE>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-is-instance.html)，類型轉換則由[智慧型轉型](typecasts.md#smart-casts)完成：

```kotlin
// Kotlin
fun main() {
//sampleStart
    // Kotlin
    val numbers = listOf(null, 1, "two", 3.0, "four")
    println("所有 String 元素大寫：")
    numbers.filterIsInstance<String>().forEach {
        println(it.uppercase())
    }
//sampleEnd
}
```
{kotlin-runnable="true" id="filter-by-type-kotlin"}

### 測試判斷式

某些任務要求您檢查所有、沒有或任何元素是否滿足條件。
在 Java 中，您可以透過 [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html) 函數 [`allMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#allMatch(java.util.function.Predicate))、[`noneMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#noneMatch(java.util.function.Predicate)) 和 [`anyMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#anyMatch(java.util.function.Predicate)) 來執行所有這些檢查：

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

了解更多關於[測試判斷式](collection-filtering.md#test-predicates)的資訊。

## 集合轉換操作

### 配對元素

在 Java 中，您可以透過同時迭代兩個集合中相同位置的元素來建立配對：

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
在上面的範例中，record 會是 `record AnimalDescription(String animal, String color) {}`。

在 Kotlin 中，使用 [`zip()`](collection-transformations.md#zip) 函數執行相同的操作：

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

> 如果集合大小不同，`zip()` 的結果將以較小的大小為準。較大集合的最後幾個元素不會包含在結果中。
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

在 Kotlin 中，請使用 [`associate()`](collection-transformations.md#associate) 函數：

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

## 接下來？

*   造訪 [Kotlin Koans](koans.md) – 完成練習以學習 Kotlin 語法。每個練習都建立為一個失敗的單元測試，您的任務是使其通過。
*   瀏覽其他 [Kotlin 慣用寫法](idioms.md)。
*   了解如何使用 [Java 到 Kotlin 轉換器](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k)將現有的 Java 程式碼轉換為 Kotlin。
*   探索 [Kotlin 中的集合](collections-overview.md)。

如果您有喜歡的慣用寫法，歡迎透過發送 pull request 來分享。