[//]: # (title: Java 和 Kotlin 中的集合)

<web-summary>了解如何从 Java 集合迁移到 Kotlin 集合。本指南涵盖 Kotlin 和 Java 中的 List、ArrayList、Map、Set 等数据结构。</web-summary>

_集合_是由可变数量（可能为零）的项组成的组，这些项对解决问题很重要，并且经常对其进行操作。本指南解释并比较了 Java 和 Kotlin 中的集合概念和操作。它将帮助你从 Java 迁移到 Kotlin，并以地道的 Kotlin 方式编写代码。

本指南的第一部分包含 Java 和 Kotlin 中相同集合操作的快速术语表。它分为[Java 和 Kotlin 中相同的操作](#operations-that-are-the-same-in-java-and-kotlin)和[仅存在于 Kotlin 标准库中的操作](#operations-that-don-t-exist-in-java-s-standard-library)。指南的第二部分从[可变性](#mutability)开始，通过具体案例解释了一些差异。

关于集合的介绍，请参见[集合概述](collections-overview.md)或观看 Kotlin 开发者布道师 Sebastian Aigner 的此[视频](https://www.youtube.com/watch?v=F8jj7e-_jFA)。

> 以下所有示例仅使用 Java 和 Kotlin 标准库 API。
>
{style="note"}

## Java 和 Kotlin 中相同的操作

在 Kotlin 中，集合上有很多操作与 Java 中的对应操作看起来完全相同。

### List、Set、Queue 和 Deque 上的操作

| 描述 | 常用操作 | 更多 Kotlin 替代方案 |
|-------------|-----------|---------------------|
| 添加一个或多个元素 | `add()`, `addAll()` | 使用[`plusAssign`(`+=`) 操作符](collection-plus-minus.md)：`collection += element`，`collection += anotherCollection`。 |
| 检测集合是否包含一个或多个元素 | `contains()`, `containsAll()` | 使用[`in` 关键字](collection-elements.md#check-element-existence)以操作符形式调用 `contains()`：`element in collection`。 |
| 检测集合是否为空 | `isEmpty()` | 使用[`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html) 检测集合是否不为空。 |
| 在特定条件下移除 | `removeIf()` | |
| 只保留选定元素 | `retainAll()` | |
| 从集合中移除所有元素 | `clear()` | |
| 从集合中获取流 | `stream()` | Kotlin 有自己的流处理方式：[序列](#sequences)以及像 [`map()`](collection-filtering.md) 和 [`filter()`](#filter-elements) 这样的方法。 |
| 从集合中获取迭代器 | `iterator()` | |

### Map 上的操作

| 描述 | 常用操作 | 更多 Kotlin 替代方案 |
|-------------|-----------|---------------------|
| 添加一个或多个元素 | `put()`, `putAll()`, `putIfAbsent()`| 在 Kotlin 中，赋值 `map[key] = value` 的行为与 `put(key, value)` 相同。此外，你可以使用[`plusAssign`(`+=`) 操作符](collection-plus-minus.md)：`map += Pair(key, value)` 或 `map += anotherMap`。 |
| 替换一个或多个元素 | `put()`, `replace()`, `replaceAll()` | 使用索引操作符 `map[key] = value` 代替 `put()` 和 `replace()`。 |
| 获取元素 | `get()` | 使用索引操作符获取元素：`map[index]`。 |
| 检测 map 是否包含一个或多个元素 | `containsKey()`, `containsValue()` | 使用[`in` 关键字](collection-elements.md#check-element-existence)以操作符形式调用 `contains()`：`element in map`。 |
| 检测 map 是否为空 |  `isEmpty()` | 使用[`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html) 检测 map 是否不为空。 |
| 移除元素 | `remove(key)`, `remove(key, value)` | 使用[`minusAssign`(`-=`) 操作符](collection-plus-minus.md)：`map -= key`。 |
| 从 map 中移除所有元素 | `clear()` | |
| 从 map 中获取流 | `stream()` on entries, keys, or values | |

### 仅存在于 List 的操作

| 描述 | 常用操作 | 更多 Kotlin 替代方案 |
|-------------|-----------|---------------------|
| 获取元素的索引 | `indexOf()` | |
| 获取元素的最后一个索引 | `lastIndexOf()` | |
| 获取元素 | `get()` | 使用索引操作符获取元素：`list[index]`。 |
| 获取子 list | `subList()` | |
| 替换一个或多个元素 | `set()`,  `replaceAll()` | 使用索引操作符代替 `set()`：`list[index] = value`。 |

## 略有不同的操作

### 任何集合类型上的操作

| 描述 | Java | Kotlin |
|-------------|------|--------|
| 获取集合大小 | `size()` | `count()`, `size` |
| 扁平化访问嵌套集合元素 | `collectionOfCollections.forEach(flatCollection::addAll)` or `collectionOfCollections.stream().flatMap().collect()` | [`flatten()`](collection-transformations.md#flatten) or [`flatMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flat-map.html) |
| 将给定函数应用于每个元素 | `stream().map().collect()` | [`map()`](collection-filtering.md) |
| 将提供的操作按序应用于集合元素并返回累积结果 | `stream().reduce()` | [`reduce()`, `fold()`](collection-aggregate.md#fold-and-reduce) |
| 按分类器分组元素并计数 | `stream().collect(Collectors.groupingBy(classifier, counting()))` | [`eachCount()`](collection-grouping.md) |
| 按条件过滤 | `stream().filter().collect()` | [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) |
| 检测集合元素是否满足条件 | `stream().noneMatch()`, `stream().anyMatch()`, `stream().allMatch()` | [`none()`, `any()`, `all()`](collection-filtering.md) |
| 排序元素 | `stream().sorted().collect()` | [`sorted()`](collection-ordering.md#natural-order) |
| 取前 N 个元素 | `stream().limit(N).collect()` | [`take(N)`](collection-parts.md#take-and-drop) |
| 按谓词取元素 | `stream().takeWhile().collect()` | [`takeWhile()`](collection-parts.md#take-and-drop) |
| 跳过前 N 个元素 | `stream().skip(N).collect()` | [`drop(N)`](collection-parts.md#take-and-drop) |
| 按谓词跳过元素 | `stream().dropWhile().collect()` | [`dropWhile()`](collection-parts.md#take-and-drop) |
| 从集合元素及其关联的特定值构建 map | `stream().collect(toMap(keyMapper, valueMapper))` | [`associate()`](collection-transformations.md#associate) |

要在 map 上执行上述所有操作，你需要首先获取 map 的 `entrySet`。

### List 上的操作

| 描述 | Java | Kotlin |
|-------------|------|--------|
| 按自然顺序排序 list | `sort(null)` | `sort()` |
| 按降序排序 list | `sort(comparator)` | `sortDescending()` |
| 从 list 中移除元素 | `remove(index)`, `remove(element)`| `removeAt(index)`, `remove(element)` or [`collection -= element`](collection-plus-minus.md) |
| 用特定值填充 list 的所有元素 | `Collections.fill()` | [`fill()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fill.html) |
| 从 list 中获取唯一元素 | `stream().distinct().toList()` | [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) |

## Java 标准库中不存在的操作

* [`zip()`, `unzip()`](collection-transformations.md) – 转换集合。
* [`aggregate()`](collection-grouping.md) – 按条件分组。
* [`takeLast()`, `takeLastWhile()`, `dropLast()`, `dropLastWhile()`](collection-parts.md#take-and-drop) – 按谓词取用或舍弃元素。
* [`slice()`, `chunked()`, `windowed()`](collection-parts.md) – 检索集合部分。
* [加 (`+`) 和减 (`-`) 操作符](collection-plus-minus.md) – 添加或移除元素。

如果你想深入了解 `zip()`、`chunked()`、`windowed()` 和其他一些操作，请观看 Sebastian Aigner 讲解 Kotlin 中高级集合操作的此视频：

<video src="https://www.youtube.com/v/N4CpLxGJlq0" title="Advanced Collection Operations"/>

## 可变性

在 Java 中，存在可变集合：

```java
// Java
// 这个 list 是可变的！
public List<Customer> getCustomers() { ... }
```
{id="mutability-java"}

部分可变的：

```java
// Java
List<String> numbers = Arrays.asList("one", "two", "three", "four");
numbers.add("five"); // Fails in runtime with `UnsupportedOperationException`
```
{id="mutability-partly-java"}

以及不可变的：

```java
// Java
List<String> numbers = new LinkedList<>();
// 这个 list 是不可变的！
List<String> immutableCollection = Collections.unmodifiableList(numbers);
immutableCollection.add("five"); // Fails in runtime with `UnsupportedOperationException`
```
{id="immutable-java"}

如果你在 IntelliJ IDEA 中编写最后两段代码，IDE 将警告你正在尝试修改一个不可变对象。这段代码会编译通过，但在运行时会因为 `UnsupportedOperationException` 而失败。你无法通过查看集合的类型来判断它是否可变。

与 Java 不同，在 Kotlin 中，你可以根据需要显式声明可变或只读集合。如果你尝试修改一个只读集合，代码将无法编译：

```kotlin
// Kotlin
val numbers = mutableListOf("one", "two", "three", "four")
numbers.add("five")            // 这没问题
val immutableNumbers = listOf("one", "two")
//immutableNumbers.add("five") // 编译错误 - 无法解析的引用：add
```
{id="mutability-kotlin"}

关于不可变性，请参阅[Kotlin 编码约定](coding-conventions.md#immutability)页面。

## 协变

在 Java 中，你不能将一个带有子孙类型的集合传递给一个接受祖先类型集合的函数。例如，如果 `Rectangle` 扩展了 `Shape`，你不能将 `Rectangle` 元素的集合传递给一个接受 `Shape` 元素集合的函数。为了使代码可编译，请使用 `? extends Shape` 类型，这样函数就可以接受 `Shape` 的任何继承者的集合：

```java
// Java
class Shape {}

class Rectangle extends Shape {}

public void doSthWithShapes(List<? extends Shape> shapes) {
/* 如果仅使用 List<Shape>，在以下面 List<Rectangle> 作为实参调用此函数时，代码将无法编译 */
}

public void main() {
    var rectangles = List.of(new Rectangle(), new Rectangle());
    doSthWithShapes(rectangles);
}
```
{id="covariance-java"}

在 Kotlin 中，只读集合类型是[协变的](generics.md#variance)。这意味着如果 `Rectangle` 类继承自 `Shape` 类，你可以在任何需要 `List<Shape>` 类型的地方使用 `List<Rectangle>` 类型。换句话说，集合类型与其元素类型具有相同的子类型关系。map 在值类型上是协变的，但在键类型上不是。可变集合不是协变的 —— 这将导致运行时失败。

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

在此处阅读更多关于[集合类型](collections-overview.md#collection-types)的信息。

## 区间和数列

在 Kotlin 中，你可以使用[区间](ranges.md)创建间隔。例如，`Version(1, 11)..Version(1, 30)` 包含从 `1.11` 到 `1.30` 的所有版本。你可以使用 `in` 操作符来检测你的版本是否在区间内：`Version(0, 9) in versionRange`。

在 Java 中，你需要手动检测 `Version` 是否符合两个边界：

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

在 Kotlin 中，你可以将区间作为一个整体对象来操作。你不需要创建两个变量并用它们来比较 `Version`：

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

一旦你需要排除其中一个边界，例如检测版本是否大于或等于 (`>=`) 最小版本且小于 (`<`) 最大版本时，这些包含边界的区间将无济于事。

## 多条件比较

在 Java 中，要根据多个条件比较对象，可以使用 [`Comparator`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html) 接口中的 [`comparing()`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html#comparing-java.util.function.Function-) 和 [`thenComparingX()`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html#thenComparing-java.util.Comparator-) 函数。例如，根据姓名和年龄比较人员：

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

在 Kotlin 中，你只需枚举要比较的字段：

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

在 Java 中，你可以这样生成一个数字序列：

```java
// Java
int sum = IntStream.iterate(1, e -> e + 3)
    .limit(10).sum();
System.out.println(sum); // Prints 145
```
{id="sequences-java"}

在 Kotlin 中，使用 _[序列](sequences.md)_。序列的多步处理在可能的情况下会惰性执行 —— 实际计算只在请求整个处理链的结果时发生。

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

序列可以减少执行某些过滤操作所需的步骤数。请参见[序列处理示例](sequences.md#sequence-processing-example)，它展示了 `Iterable` 和 `Sequence` 之间的区别。

## 从 List 中移除元素

在 Java 中，[`remove()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/List.html#remove(int)) 函数接受要移除元素的索引。

当移除整数元素时，使用 `Integer.valueOf()` 函数作为 `remove()` 函数的实参：

```java
// Java
public void remove() {
    var numbers = new ArrayList<>();
    numbers.add(1);
    numbers.add(2);
    numbers.add(3);
    numbers.add(1);
    numbers.remove(1); // 这是按索引移除
    System.out.println(numbers); // [1, 3, 1]
    numbers.remove(Integer.valueOf(1));
    System.out.println(numbers); // [3, 1]
}
```
{id="remove-elements-java"}

在 Kotlin 中，元素移除有两种类型：按索引使用 [`removeAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove-at.html)，按值使用 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove.html)。

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

## 遍历 Map

在 Java 中，你可以通过 [`forEach`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Map.html#forEach(java.util.function.BiConsumer)) 遍历 map：

```java
// Java
numbers.forEach((k,v) -> System.out.println("Key = " + k + ", Value = " + v));
```
{id="traverse-map-java"}

在 Kotlin 中，使用 `for` 循环或 `forEach`（类似于 Java 的 `forEach`）来遍历 map：

```kotlin
// Kotlin
for ((k, v) in numbers) {
    println("Key = $k, Value = $v")
}
// Or
numbers.forEach { (k, v) -> println("Key = $k, Value = $v") }
```
{id="traverse-map-kotlin"}

## 获取可能为空的集合的第一个和最后一个项

在 Java 中，你可以通过检测集合大小和使用索引来安全地获取第一个和最后一个项：

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

你还可以对 [`Deque`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html) 及其继承者使用 [`getFirst()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html#getFirst()) 和 [`getLast()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html#getLast()) 函数：

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

在 Kotlin 中，有特殊的函数 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html) 和 [`lastOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-or-null.html)。使用[`Elvis 操作符`](null-safety.md#elvis-operator)，你可以根据函数的结果立即执行进一步的操作。例如，`firstOrNull()`：

```kotlin
// Kotlin
val emails = listOf<String>() // Might be empty
val theOldestEmail = emails.firstOrNull() ?: ""
val theFreshestEmail = emails.lastOrNull() ?: ""
```
{id="get-first-last-kotlin"}

## 从 List 创建 Set

在 Java 中，要从 [`List`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/List.html) 创建 [`Set`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Set.html)，你可以使用 [`Set.copyOf`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Set.html#copyOf(java.util.Collection)) 函数：

```java
// Java
public void listToSet() {
    var sourceList = List.of(1, 2, 3, 1);
    var copySet = Set.copyOf(sourceList);
    System.out.println(copySet);
}
```
{id="list-to-set-java"}

在 Kotlin 中，使用函数 `toSet()`：

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

## 分组元素

在 Java 中，你可以使用 [Collectors](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Collectors.html) 函数 `groupingBy()` 对元素进行分组：

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

在 Kotlin 中，使用函数 [`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html)：

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

## 过滤元素

在 Java 中，要从集合中过滤元素，你需要使用 [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)。Stream API 具有 `intermediate`（中间）和 `terminal`（末端）操作。`filter()` 是一个 `intermediate`（中间）操作，它返回一个流。要接收一个集合作为输出，你需要使用一个 `terminal`（末端）操作，例如 `collect()`。例如，只保留键以 `1` 结尾且值大于 `10` 的那些对：

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

在 Kotlin 中，过滤功能内置于集合中，并且 `filter()` 返回与被过滤集合相同的类型。因此，你只需编写 `filter()` 及其谓词：

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

在此处了解更多关于[过滤 map](map-operations.md#filter) 的信息。

### 按类型过滤元素

在 Java 中，要按类型过滤元素并对其执行操作，你需要使用 [`instanceof`](https://docs.oracle.com/en/java/javase/17/language/pattern-matching-instanceof-operator.html) 操作符检测它们的类型，然后进行类型转换：

```java
// Java
public void objectIsInstance() {
    var numbers = new ArrayList<>();
    numbers.add(null);
    numbers.add(1);
    numbers.add("two");
    numbers.add(3.0);
    numbers.add("four");
    System.out.println("所有 String 元素大写：");
    numbers.stream().filter(it -> it instanceof String)
        .forEach( it -> System.out.println(((String) it).toUpperCase()));
}
```
{id="filter-by-type-java"}

在 Kotlin 中，你只需在集合上调用 [`filterIsInstance<NEEDED_TYPE>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-is-instance.html)，类型转换则由[智能转换](typecasts.md#smart-casts)完成：

```kotlin
// Kotlin
fun main() {
//sampleStart
    // Kotlin
    val numbers = listOf(null, 1, "two", 3.0, "four")
    println("所有 String 元素大写：")
    numbers.filterIsInstance<String>().forEach {
        println(it.uppercase())
    }
//sampleEnd
}
```
{kotlin-runnable="true" id="filter-by-type-kotlin"}

### 测试谓词

有些任务要求你检测所有、无或任意元素是否满足条件。在 Java 中，你可以通过 [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html) 函数 [`allMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#allMatch(java.util.function.Predicate))、[`noneMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#noneMatch(java.util.function.Predicate)) 和 [`anyMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#anyMatch(java.util.function.Predicate)) 来执行所有这些检测：

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

在 Kotlin 中，[扩展函数](extensions.md) `none()`、`any()` 和 `all()` 可用于每个 [Iterable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/#kotlin.collections.Iterable) 对象：

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

了解更多关于[测试谓词](collection-filtering.md#test-predicates)的信息。

## 集合转换操作

### Zip 元素

在 Java 中，你可以通过同时遍历两个集合来从相同位置的元素创建对：

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

如果你想做比简单地将元素对打印到输出更复杂的事情，可以使用 [Records](https://blogs.oracle.com/javamagazine/post/records-come-to-java)。在上面的示例中，record 将是 `record AnimalDescription(String animal, String color) {}`。

在 Kotlin 中，使用 [`zip()`](collection-transformations.md#zip) 函数来做同样的事情：

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

`zip()` 返回 [Pair](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/) 对象的 List。

> 如果集合大小不同，`zip()` 的结果将是较小的大小。较大集合的最后几个元素不包含在结果中。
>
{style="note"}

### 关联元素

在 Java 中，你可以使用 [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html) 将元素与特性关联起来：

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

在 Kotlin 中，使用 [`associate()`](collection-transformations.md#associate) 函数：

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

## 接下来是什么？

* 访问 [Kotlin 心印](koans.md) – 完成练习以学习 Kotlin 语法。每个练习都创建为一个失败的单元测试，你的任务是使其通过。
* 浏览其他 [Kotlin 惯用法](idioms.md)。
* 了解如何使用 [Java 到 Kotlin 转换器](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k) 将现有 Java 代码转换为 Kotlin。
* 探索 [Kotlin 中的集合](collections-overview.md)。

如果你有喜欢的惯用法，我们邀请你通过发送拉取请求来分享。