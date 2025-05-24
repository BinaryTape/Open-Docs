---
title: "Java 和 Kotlin 中的集合"
description: "学习如何从 Java 集合迁移到 Kotlin 集合。本指南涵盖了 Kotlin 和 Java 中的 List（列表）、ArrayList（动态数组）、Map（映射）、Set（集合）等数据结构。"
---
_集合(Collections)_ 是指一组可变数量的条目（可能为零），这些条目对于要解决的问题非常重要，并且通常会对它们进行操作。
本指南解释和比较了 Java 和 Kotlin 中的集合概念和操作。
它将帮助你从 Java 迁移到 Kotlin，并以地道的 Kotlin 方式编写代码。

本指南的第一部分包含 Java 和 Kotlin 中相同集合上操作的快速词汇表。
它分为[相同的操作](#operations-that-are-the-same-in-java-and-kotlin)和[仅在 Kotlin 中存在的操作](#operations-that-don-t-exist-in-java-s-standard-library)两个部分。
本指南的第二部分，从 [可变性(Mutability)](#mutability)开始，通过查看具体案例来解释一些差异。

有关集合的介绍，请参阅 [集合概述](collections-overview) 或观看 Kotlin 开发倡导者 Sebastian Aigner 的 [视频](https://www.youtube.com/watch?v=F8jj7e-_jFA)。

:::note
以下所有示例仅使用 Java 和 Kotlin 标准库 API。

:::

## Java 和 Kotlin 中相同的操作

在 Kotlin 中，有许多集合上的操作看起来与 Java 中的对应操作完全相同。

### 列表、集合、队列和双端队列上的操作

| 描述 | 常用操作 | 更多 Kotlin 替代方案 |
|-------------|-----------|---------------------|
| 添加一个或多个元素 | `add()`, `addAll()` | 使用 [`plusAssign`(`+=`) 运算符](collection-plus-minus)：`collection += element`, `collection += anotherCollection`。 |
| 检查集合是否包含一个或多个元素 | `contains()`, `containsAll()` | 使用 [`in` 关键字](collection-elements#check-element-existence) 以运算符形式调用 `contains()`：`element in collection`。 |
| 检查集合是否为空 | `isEmpty()` | 使用 [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html) 检查集合是否不为空。 |
| 在特定条件下移除 | `removeIf()` | |
| 仅保留选定的元素 | `retainAll()` | |
| 从集合中移除所有元素 | `clear()` | |
| 从集合中获取流 | `stream()` | Kotlin 有自己的处理流的方式：[序列](#sequences)和诸如 [`map()`](collection-filtering) 和 [`filter()`](#filter-elements) 之类的方法。 |
| 从集合中获取迭代器 | `iterator()` | |

### 映射上的操作

| 描述 | 常用操作 | 更多 Kotlin 替代方案 |
|-------------|-----------|---------------------|
| 添加一个或多个元素 | `put()`, `putAll()`, `putIfAbsent()`| 在 Kotlin 中，赋值 `map[key] = value` 的行为与 `put(key, value)` 相同。此外，你可以使用 [`plusAssign`(`+=`) 运算符](collection-plus-minus)：`map += Pair(key, value)` 或 `map += anotherMap`。 |
| 替换一个或多个元素 | `put()`, `replace()`, `replaceAll()` | 使用索引运算符 `map[key] = value` 而不是 `put()` 和 `replace()`。 |
| 获取一个元素 | `get()` | 使用索引运算符来获取元素：`map[index]`。 |
| 检查映射是否包含一个或多个元素 | `containsKey()`, `containsValue()` | 使用 [`in` 关键字](collection-elements#check-element-existence) 以运算符形式调用 `contains()`：`element in map`。 |
| 检查映射是否为空 |  `isEmpty()` | 使用 [`isNotEmpty()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/is-not-empty.html) 检查映射是否不为空。 |
| 移除一个元素 | `remove(key)`, `remove(key, value)` | 使用 [`minusAssign`(`-=`) 运算符](collection-plus-minus)：`map -= key`。 |
| 从映射中移除所有元素 | `clear()` | |
| 从映射中获取流 | 在条目、键或值上使用 `stream()` | |

### 仅对列表存在的操作

| 描述 | 常用操作 | 更多 Kotlin 替代方案 |
|-------------|-----------|---------------------|
| 获取元素的索引 | `indexOf()` | |
| 获取元素的最后一个索引 | `lastIndexOf()` | |
| 获取一个元素 | `get()` | 使用索引运算符来获取元素：`list[index]`。 |
| 获取子列表 | `subList()` | |
| 替换一个或多个元素 | `set()`,  `replaceAll()` | 使用索引运算符而不是 `set()`：`list[index] = value`。 |

## 略有不同的操作

### 任何集合类型的操作

| 描述 | Java | Kotlin |
|-------------|------|--------|
| 获取集合的大小 | `size()` | `count()`, `size` |
| 获取对嵌套集合元素的扁平访问 | `collectionOfCollections.forEach(flatCollection::addAll)` 或 `collectionOfCollections.stream().flatMap().collect()` | [`flatten()`](collection-transformations#flatten) 或 [`flatMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/flat-map.html) |
| 将给定的函数应用于每个元素 | `stream().map().collect()` | [`map()`](collection-filtering) |
| 将提供的操作顺序应用于集合元素，并返回累积的结果 | `stream().reduce()` | [`reduce()`, `fold()`](collection-aggregate#fold-and-reduce) |
| 按分类器对元素进行分组并计数 | `stream().collect(Collectors.groupingBy(classifier, counting()))` | [`eachCount()`](collection-grouping) |
| 按条件过滤 | `stream().filter().collect()` | [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) |
| 检查集合元素是否满足条件 | `stream().noneMatch()`, `stream().anyMatch()`, `stream().allMatch()` | [`none()`, `any()`, `all()`](collection-filtering) |
| 排序元素 | `stream().sorted().collect()` | [`sorted()`](collection-ordering#natural-order) |
| 获取前 N 个元素 | `stream().limit(N).collect()` | [`take(N)`](collection-parts#take-and-drop) |
| 获取带有谓词的元素 | `stream().takeWhile().collect()` | [`takeWhile()`](collection-parts#take-and-drop) |
| 跳过前 N 个元素 | `stream().skip(N).collect()` | [`drop(N)`](collection-parts#take-and-drop) |
| 跳过带有谓词的元素 | `stream().dropWhile().collect()` | [`dropWhile()`](collection-parts#take-and-drop) |
| 从集合元素和与其关联的某些值构建映射 | `stream().collect(toMap(keyMapper, valueMapper))` | [`associate()`](collection-transformations#associate) |

要在映射上执行上面列出的所有操作，首先需要获取映射的 `entrySet`。

### 列表上的操作

| 描述 | Java | Kotlin |
|-------------|------|--------|
| 将列表排序为自然顺序 | `sort(null)` | `sort()` |
| 将列表排序为降序 | `sort(comparator)` | `sortDescending()` |
| 从列表中移除一个元素 | `remove(index)`, `remove(element)`| `removeAt(index)`, `remove(element)` or [`collection -= element`](collection-plus-minus) |
| 使用某个值填充列表的所有元素 | `Collections.fill()` | [`fill()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fill.html) |
| 从列表中获取唯一元素 | `stream().distinct().toList()` | [`distinct()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/distinct.html) |

## Java 标准库中不存在的操作

* [`zip()`, `unzip()`](collection-transformations) – 转换集合。
* [`aggregate()`](collection-grouping) – 按条件分组。
* [`takeLast()`, `takeLastWhile()`, `dropLast()`, `dropLastWhile()`](collection-parts#take-and-drop) – 按谓词获取或删除元素。
* [`slice()`, `chunked()`, `windowed()`](collection-parts) – 检索集合部分。
* [加号 (`+`) 和减号 (`-`) 运算符](collection-plus-minus) – 添加或移除元素。

如果你想深入了解 `zip()`、`chunked()`、`windowed()` 和其他一些操作，请观看 Sebastian Aigner 关于 Kotlin 中高级集合操作的视频：

<video src="https://www.youtube.com/v/N4CpLxGJlq0" title="Advanced Collection Operations"/>

## 可变性(Mutability)

在 Java 中，有可变集合：

```java
// Java
// 此列表是可变的！
public List<Customer> getCustomers() { ... }
```

部分可变的集合：

```java
// Java
List<String> numbers = Arrays.asList("one", "two", "three", "four");
numbers.add("five"); // 在运行时因 `UnsupportedOperationException` 而失败
```

以及不可变的集合：

```java
// Java
List<String> numbers = new LinkedList<>();
// 此列表是不可变的！
List<String> immutableCollection = Collections.unmodifiableList(numbers);
immutableCollection.add("five"); // 在运行时因 `UnsupportedOperationException` 而失败
```

如果在 IntelliJ IDEA 中编写最后两段代码，IDE 会警告你正在尝试修改不可变对象。
此代码将编译，但在运行时因 `UnsupportedOperationException` 而失败。你无法通过查看其类型来判断集合是否可变。

与 Java 不同，在 Kotlin 中，你可以根据需要显式声明可变或只读集合。
如果你尝试修改只读集合，则代码将无法编译：

```kotlin
// Kotlin
val numbers = mutableListOf("one", "two", "three", "four")
numbers.add("five")            // 这是可以的
val immutableNumbers = listOf("one", "two")
//immutableNumbers.add("five") // 编译错误 - 找不到引用：add
```

在 [Kotlin 编码规范](coding-conventions#immutability) 页面上阅读有关不变性的更多信息。

## 协变(Covariance)

在 Java 中，你无法将具有派生类型的集合传递给接受祖先类型集合的函数。
例如，如果 `Rectangle` 继承自 `Shape`，则你无法将 `Rectangle` 元素集合传递给接受 `Shape` 元素集合的函数。
为了使代码可编译，请使用 `? extends Shape` 类型，以便该函数可以接受任何 `Shape` 继承者的集合：

```java
// Java
class Shape {}

class Rectangle extends Shape {}

public void doSthWithShapes(List<? extends Shape> shapes) {
/* 如果仅使用 List<Shape>，则在使用 List<Rectangle> 作为参数调用此函数时，代码将无法编译，如下所示 */
}

public void main() {
    var rectangles = List.of(new Rectangle(), new Rectangle());
    doSthWithShapes(rectangles);
}
```

在 Kotlin 中，只读集合类型是[协变的](generics#variance)。这意味着如果 `Rectangle` 类继承自 `Shape` 类，
则可以在任何需要 `List<Shape>` 类型的地方使用 `List<Rectangle>` 类型。
换句话说，集合类型与元素类型具有相同的子类型关系。映射在值类型上是协变的，但在键类型上不是。
可变集合不是协变的 – 这将导致运行时失败。

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

在此处阅读有关[集合类型](collections-overview#collection-types)的更多信息。

## 范围(Ranges)和数列(progressions)

在 Kotlin 中，你可以使用[范围](ranges)创建间隔。例如，`Version(1, 11)..Version(1, 30)` 包括从 `1.11` 到 `1.30` 的所有版本。
你可以使用 `in` 运算符检查你的版本是否在范围内：`Version(0, 9) in versionRange`。

在 Java 中，你需要手动检查 `Version` 是否适合两个边界：

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

在 Kotlin 中，你可以将范围作为一个整体对象进行操作。你不需要创建两个变量并将 `Version` 与它们进行比较：

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

一旦你需要排除其中一个边界，例如检查版本是否大于或等于 (`>=`) 最小版本且小于 (`<`) 最大版本，这些包含性范围将无济于事。

## 按多个条件比较

在 Java 中，要按多个条件比较对象，可以使用 [`comparing()`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html#comparing-java.util.function.Function-)
和 [`thenComparingX()`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html#thenComparing-java.util.Comparator-)
来自 [`Comparator`](https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html) 接口的函数。
例如，要按姓名和年龄比较人：

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

## 序列(Sequences)

在 Java 中，你可以通过以下方式生成数字序列：

```java
// Java
int sum = IntStream.iterate(1, e `->` e + 3)
    .limit(10).sum();
System.out.println(sum); // 打印 145
```

在 Kotlin 中，使用_[序列](sequences)_。序列的多步骤处理在可能的情况下会延迟执行——
只有在请求整个处理链的结果时才会发生实际计算。

```kotlin
fun main() {

    // Kotlin
    val sum = generateSequence(1) {
        it + 3
    }.take(10).sum()
    println(sum) // 打印 145

}
```

序列可以减少执行某些过滤操作所需的步骤数。
请参阅[序列处理示例](sequences#sequence-processing-example)，其中显示了 `Iterable` 和 `Sequence` 之间的差异。

## 从列表中移除元素

在 Java 中，[`remove()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/List.html#remove(int))
函数接受要移除的元素的索引。

当移除整数元素时，使用 `Integer.valueOf()` 函数作为 `remove()` 函数的参数：

```java
// Java
public void remove() {
    var numbers = new ArrayList<>();
    numbers.add(1);
    numbers.add(2);
    numbers.add(3);
    numbers.add(1);
    numbers.remove(1); // 这会按索引移除
    System.out.println(numbers); // [1, 3, 1]
    numbers.remove(Integer.valueOf(1));
    System.out.println(numbers); // [3, 1]
}
```

在 Kotlin 中，有两种类型的元素移除：
通过索引使用 [`removeAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove-at.html)，
以及通过值使用 [`remove()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-mutable-list/remove.html)。

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

## 遍历映射

在 Java 中，你可以通过 [`forEach`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Map.html#forEach(java.util.function.BiConsumer)) 遍历映射：

```java
// Java
numbers.forEach((k,v) `->` System.out.println("Key = " + k + ", Value = " + v));
```

在 Kotlin 中，使用 `for` 循环或 `forEach`（类似于 Java 的 `forEach`）来遍历映射：

```kotlin
// Kotlin
for ((k, v) in numbers) {
    println("Key = $k, Value = $v")
}
// Or
numbers.forEach { (k, v) `->` println("Key = $k, Value = $v") }
```

## 获取可能为空的集合的第一个和最后一个条目

在 Java 中，你可以通过检查集合的大小并使用索引来安全地获取第一个和最后一个条目：

```java
// Java
var list = new ArrayList<>();
//...
if (list.size() > 0) {
    System.out.println(list.get(0));
    System.out.println(list.get(list.size() - 1));
}
```

你还可以对 [`Deque`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html) 及其继承者使用 [`getFirst()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html#getFirst())
和 [`getLast()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Deque.html#getLast()) 函数：

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
函数 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html)
和 [`lastOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last-or-null.html)。
使用 [`Elvis 运算符`](null-safety#elvis-operator)，你可以根据函数的结果立即执行进一步的操作。例如，`firstOrNull()`：

```kotlin
// Kotlin
val emails = listOf<String>() // 可能为空
val theOldestEmail = emails.firstOrNull() ?: ""
val theFreshestEmail = emails.lastOrNull() ?: ""
```

## 从列表中创建集合

在 Java 中，要从
[`List`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/List.html) 创建 [`Set`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Set.html)，你可以使用
[`Set.copyOf`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/Set.html#copyOf(java.util.Collection)) 函数：

```java
// Java
public void listToSet() {
    var sourceList = List.of(1, 2, 3, 1);
    var copySet = Set.copyOf(sourceList);
    System.out.println(copySet);
}
```

在 Kotlin 中，使用函数 `toSet()`：

```kotlin
fun main() {

    // Kotlin
    val sourceList = listOf(1, 2, 3, 1)
    val copySet = sourceList.toSet()
    println(copySet)

}
```

## 对元素进行分组

在 Java 中，你可以使用 [Collectors](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Collectors.html)
函数 `groupingBy()` 对元素进行分组：

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

在 Kotlin 中，使用函数 [`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html)：

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

## 筛选元素

在 Java 中，要从集合中筛选元素，你需要使用 [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)。
Stream API 具有 `intermediate` 和 `terminal` 操作。`filter()` 是一种中间操作，它返回一个流。
要接收作为输出的集合，你需要使用终端操作，如 `collect()`。
例如，仅保留那些键以 `1` 结尾且值大于 `10` 的对：

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

在 Kotlin 中，筛选内置于集合中，并且 `filter()` 返回与筛选的集合类型相同的集合类型。
因此，你需要编写的只是 `filter()` 及其谓词：

```kotlin
fun main() {

    // Kotlin
    val numbers = mapOf("key1" to 1, "key2" to 2, "key3" to 3, "key11" to 11)
    val filteredNumbers = numbers.filter { (key, value) `->` key.endsWith("1") && value > 10 }
    println(filteredNumbers)

}
```

在此处了解有关 [筛选映射](map-operations#filter) 的更多信息。

### 按类型筛选元素

在 Java 中，要按类型筛选元素并对其执行操作，你需要使用
[`instanceof`](https://docs.oracle.com/en/java/javase/17/language/pattern-matching-instanceof-operator.html) 运算符检查它们的类型，然后进行类型转换：

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

在 Kotlin 中，你只需在集合上调用 [`filterIsInstance<NEEDED_TYPE>()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter-is-instance.html)，
并且类型转换由 [智能转换](typecasts#smart-casts) 完成：

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

### 测试谓词

某些任务要求你检查是否所有、没有或任何元素满足条件。
在 Java 中，你可以通过 [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)
函数 [`allMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#allMatch(java.util.function.Predicate))、
[`noneMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#noneMatch(java.util.function.Predicate)) 和
[`anyMatch()`](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/Stream.html#anyMatch(java.util.function.Predicate)) 完成所有这些检查：

```java
// Java
public void testPredicates() {
    var numbers = List.of("one", "two", "three", "four");
    System.out.println(numbers.stream().noneMatch(it `->` it.endsWith("e"))); // false
    System.out.println(numbers.stream().anyMatch(it `->` it.endsWith("e"))); // true
    System.out.println(numbers.stream().allMatch(it `->` it.endsWith("e"))); // false
}
```

在 Kotlin 中，[扩展函数](extensions) `none()`、`any()` 和 `all()`
可用于每个 [Iterable](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/-iterable/#kotlin.collections.Iterable) 对象：

```kotlin
fun main() {

// Kotlin
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.none { it.endsWith("e") })
    println(numbers.any { it.endsWith("e") })
    println(numbers.all { it.endsWith("e") })

}
```

了解有关 [测试谓词](collection-filtering#test-predicates)的更多信息。

## 集合转换操作

### 压缩元素

在 Java 中，你可以通过同时迭代两个集合来使用两个集合中相同位置的元素创建对：

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

如果你想做一些比仅仅将元素对打印到输出中更复杂的事情，
你可以使用 [Records](https://blogs.oracle.com/javamagazine/post/records-come-to-java)。
在上面的示例中，记录将是 `record AnimalDescription(String animal, String color) {}`。

在 Kotlin 中，使用 [`zip()`](collection-transformations#zip) 函数来执行相同的操作：

```kotlin
fun main() {

    // Kotlin
    val colors = listOf("red", "brown")
    val animals = listOf("fox", "bear", "wolf")

    println(colors.zip(animals) { color, animal `->` 
        "The ${animal.replaceFirstChar { it.uppercase() }} is $color" })

}
```

`zip()` 返回 [Pair](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-pair/) 对象的列表。

:::note
如果集合具有不同的大小，则 `zip()` 的结果是较小的大小。较大集合的最后一个元素不包含在结果中。

:::

### 关联元素

在 Java 中，你可以使用 [Stream API](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/stream/package-summary.html)
将元素与特征相关联：

```java
// Java
public void associate() {
    var numbers = List.of("one", "two", "three", "four");
    var wordAndLength = numbers.stream()
        .collect(toMap(number `->` number, String::length));
    System.out.println(wordAndLength);
}
```

在 Kotlin 中，使用 [`associate()`](collection-transformations#associate) 函数：

```kotlin
fun main() {

    // Kotlin
    val numbers = listOf("one", "two", "three", "four")
    println(numbers.associateWith { it.length })

}
```

## 接下来做什么？

* 访问 [Kotlin Koans](koans) – 完成练习以学习 Kotlin 语法。每个练习都创建为一个失败的单元测试，你的工作是使其通过。
* 查看其他 [Kotlin 惯用语法](idioms)。
* 了解如何使用 [Java 到 Kotlin 转换器](mixing-java-kotlin-intellij#converting-an-existing-java-file-to-kotlin-with-j2k) 将现有的 Java 代码转换为 Kotlin。
* 探索 [Kotlin 中的集合](collections-overview)。

如果你有喜欢的惯用语法，我们邀请你通过发送拉取请求来分享它。