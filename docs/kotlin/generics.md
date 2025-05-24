---
title: 泛型：in、out、where
---
Kotlin 中的类可以像 Java 中一样具有类型参数：

```kotlin
class Box<T>(t: T) {
    var value = t
}
```

要创建此类的一个实例，只需提供类型实参：

```kotlin
val box: Box<Int> = Box<Int>(1)
```

但是，如果可以推断出这些参数，例如，从构造器实参中推断，则可以省略类型实参：

```kotlin
val box = Box(1) // 1 的类型是 Int，所以编译器会推断出它是 Box<Int>
```

## 型变 (Variance)

Java 类型系统中最棘手的方面之一是通配符类型 (wildcard types)（参见 [Java 泛型常见问题解答](http://www.angelikalanger.com/GenericsFAQ/JavaGenericsFAQ.html)）。 Kotlin 没有这些。 Kotlin 具有声明点型变 (declaration-site variance) 和类型投影 (type projections)。

### Java 中的型变和通配符

让我们考虑一下为什么 Java 需要这些神秘的通配符。 首先，Java 中的泛型类型是 *不变的 (invariant)*，这意味着 `List<String>` *不是* `List<Object>` 的子类型。 如果 `List` 不是 *不变的*，它不会比 Java 的数组好，因为以下代码可以编译，但会在运行时导致异常：

```java
// Java
List<String> strs = new ArrayList<String>();

// Java 在编译时报告这里类型不匹配。
List<Object> objs = strs;

// 如果不是这样会怎样？
// 我们就可以把一个 Integer 放入一个 String 的列表中。
objs.add(1);

// 然后在运行时，Java 会抛出
// 一个 ClassCastException：Integer 无法转换为 String
String s = strs.get(0); 
```

Java 禁止这样的事情来保证运行时安全。 但这有其影响。 例如，考虑 `Collection` 接口中的 `addAll()` 方法。 这个方法的签名是什么？ 直观地说，你会这样写：

```java
// Java
interface Collection<E> ... {
    void addAll(Collection<E> items);
}
```

但是这样，你将无法执行以下操作（这是完全安全的）：

```java
// Java

// 对于 addAll 的简单声明，以下代码将无法编译：
// Collection<String> 不是 Collection<Object> 的子类型
void copyAll(Collection<Object> to, Collection<String> from) {
    to.addAll(from);
}
```

这就是为什么 `addAll()` 的实际签名如下：

```java
// Java
interface Collection<E> ... {
    void addAll(Collection<? extends E> items);
}
```

*通配符类型实参* `? extends E` 表示此方法接受 `E` *或 `E` 的子类型* 的对象集合，而不仅仅是 `E` 本身。 这意味着你可以安全地从 items 中 *读取* `E` (这个集合的元素是 E 的子类的实例)，但是 *不能写入*，因为你不知道哪些对象符合 `E` 的未知子类型。 作为这种限制的回报，你获得了所需的行为：`Collection<String>` *是* `Collection<? extends Object>` 的子类型。 换句话说，具有 *extends*-界限 (即 *上* 界) 的通配符使该类型是 *协变的 (covariant)*。

理解为什么这种方法奏效的关键很简单：如果你只能从集合中 *获取* 项，那么使用 `String` 的集合并从中读取 `Object` 是可以的。 相反，如果你只能将项目 *放入* 集合中，那么获取一个 `Object` 集合并将 `String` 放入其中是可以的：在 Java 中，有 `List<? super String>`，它接受 `String` 或其任何超类型。

后者称为 *逆变 (contravariance)*，并且你只能在 `List<? super String>` 上调用将 `String` 作为参数的方法（例如，你可以调用 `add(String)` 或 `set(int, String)`）。 如果你调用在 `List<T>` 中返回 `T` 的内容，则你不会得到 `String`，而是得到 `Object`。

Joshua Bloch 在他的书 [Effective Java, 3rd Edition](http://www.oracle.com/technetwork/java/effectivejava-136174.html) 中很好地解释了这个问题
（第 31 项：“使用限定通配符来提高 API 的灵活性”）。 他将你仅从中 *读取* 的对象命名为 *生产者 (Producers)*，而将你仅 *写入* 的对象命名为 *消费者 (Consumers)*。 他建议：

:::note
“为了获得最大的灵活性，请在表示生产者或消费者的输入参数上使用通配符类型。”

然后，他提出了以下助记符：*PECS* 代表 *Producer-Extends, Consumer-Super*。

如果你使用生产者对象，例如 `List<? extends Foo>`，则不允许在此对象上调用 `add()` 或 `set()`，但这并不意味着它是 *不可变的 (immutable)*：例如，没有任何东西可以阻止你调用 `clear()` 从列表中删除所有项，因为 `clear()` 根本不接受任何参数。

通配符（或其他类型的型变）保证的唯一事情是 *类型安全 (type safety)*。 不可变性 (Immutability) 是一个完全不同的故事。

:::

### 声明点型变

假设存在一个泛型接口 `Source<T>`，该接口没有任何将 `T` 作为参数的方法，只有返回 `T` 的方法：

```java
// Java
interface Source<T> {
    T nextT();
}
```

那么，在 `Source<Object>` 类型的变量中存储对 `Source<String>` 实例的引用是完全安全的 - 没有消费者方法可以调用。 但是 Java 不知道这一点，仍然禁止它：

```java
// Java
void demo(Source<String> strs) {
    Source<Object> objects = strs; // !!! Java 中不允许
    // ...
}
```

为了解决这个问题，你应该声明 `Source<? extends Object>` 类型的对象。 这样做是没有意义的，因为你可以像以前一样在此类变量上调用所有相同的方法，因此更复杂的类型没有增加任何价值。
但是编译器不知道这一点。

在 Kotlin 中，有一种方法可以向编译器解释此类情况。 这称为 *声明点型变*：你可以注解 `Source` 的 *类型参数* `T`，以确保它仅从 `Source<T>` 的成员 *返回*（生成），而从不被使用。
为此，请使用 `out` 修饰符：

```kotlin
interface Source<out T> {
    fun nextT(): T
}

fun demo(strs: Source<String>) {
    val objects: Source<Any> = strs // 这是可以的，因为 T 是一个 out-参数
    // ...
}
```

一般规则是：当类 `C` 的类型参数 `T` 被声明为 `out` 时，它可能只出现在 `C` 的成员的 *out*-位置，但作为回报，`C<Base>` 可以安全地成为 `C<Derived>` 的超类型。

换句话说，你可以说类 `C` 在参数 `T` 中是 *协变的 (covariant)*，或者说 `T` 是 *协变的 (covariant)* 类型参数。
你可以将 `C` 视为 `T` 的 *生产者 (producer)*，而不是 `T` 的 *消费者 (consumer)*。

`out` 修饰符称为 *型变注解 (variance annotation)*，由于它是在类型参数声明处提供的，因此它提供了 *声明点型变 (declaration-site variance)*。
这与 Java 的 *使用点型变 (use-site variance)* 形成对比，后者是类型使用中的通配符使类型协变。

除了 `out` 之外，Kotlin 还提供了一个互补的型变注解：`in`。 它使类型参数 *逆变 (contravariant)*，这意味着它只能被使用而不能被生成。 逆变类型的一个很好的例子是 `Comparable`：

```kotlin
interface Comparable<in T> {
    operator fun compareTo(other: T): Int
}

fun demo(x: Comparable<Number>) {
    x.compareTo(1.0) // 1.0 的类型是 Double，它是 Number 的子类型
    // 因此，你可以将 x 赋值给 Comparable<Double> 类型的变量
    val y: Comparable<Double> = x // OK!
}
```

单词 *in* 和 *out* 似乎是不言自明的（因为它们已经在 C# 中成功使用了很长时间），因此实际上不需要上面提到的助记符。 事实上，它可以被重新措辞到一个更高的抽象层次：

**[存在主义](https://en.wikipedia.org/wiki/Existentialism) 转换：消费者 in，生产者 out！** :-)

## 类型投影

### 使用点型变：类型投影

将类型参数 `T` 声明为 `out` 并避免在使用点上的子类型化问题非常容易，但是某些类实际上 *不能* 限制为仅返回 `T`！
`Array` 是一个很好的例子：

```kotlin
class Array<T>(val size: Int) {
    operator fun get(index: Int): T { ... }
    operator fun set(index: Int, value: T) { ... }
}
```

这个类在 `T` 中既不能是协变的，也不能是逆变的。 这带来了一些不灵活性。 考虑以下函数：

```kotlin
fun copy(from: Array<Any>, to: Array<Any>) {
    assert(from.size == to.size)
    for (i in from.indices)
        to[i] = from[i]
}
```

此函数旨在将项从一个数组复制到另一个数组。 让我们尝试在实践中应用它：

```kotlin
val ints: Array<Int> = arrayOf(1, 2, 3)
val any = Array<Any>(3) { "" } 
copy(ints, any)
//   ^ 类型是 Array<Int>，但期望的是 Array<Any>
```

在这里，你遇到了同样熟悉的问题：`Array<T>` 在 `T` 中是 *不变的 (invariant)*，因此 `Array<Int>` 和 `Array<Any>` 都不是另一个的子类型。 为什么不呢？ 同样，这是因为 `copy` 可能具有意外的行为，例如，它可能尝试将 `String` 写入 `from`，并且如果你实际传递一个 `Int` 数组，则稍后将抛出 `ClassCastException`。

要禁止 `copy` 函数 *写入* `from`，你可以执行以下操作：

```kotlin
fun copy(from: Array<out Any>, to: Array<Any>) { ... }
```

这是 *类型投影 (type projection)*，这意味着 `from` 不是一个简单的数组，而是一个受限制的（*投影的*）数组。
你只能调用返回类型参数 `T` 的方法，在这种情况下，这意味着你只能调用 `get()`。
这是我们处理 *使用点型变 (use-site variance)* 的方法，它对应于 Java 的 `Array<? extends Object>`，同时又稍微简单一些。

你也可以使用 `in` 投影类型：

```kotlin
fun fill(dest: Array<in String>, value: String) { ... }
```

`Array<in String>` 对应于 Java 的 `Array<? super String>`。 这意味着你可以将 `String`、`CharSequence` 或 `Object` 数组传递给 `fill()` 函数。

### 星号投影 (Star-projections)

有时你想说你对类型参数一无所知，但你仍然想以安全的方式使用它。
这里的安全方法是定义泛型类型的这种投影，该泛型类型的每个具体实例化都将是该投影的子类型。

Kotlin 为此提供了所谓的 *星号投影* 语法：

- 对于 `Foo<out T : TUpper>`，其中 `T` 是具有上界 `TUpper` 的协变类型参数，`Foo<*>` 等效于 `Foo<out TUpper>`。 这意味着当 `T` 未知时，你可以安全地从 `Foo<*>` 中 *读取* `TUpper` 的值。
- 对于 `Foo<in T>`，其中 `T` 是逆变类型参数，`Foo<*>` 等效于 `Foo<in Nothing>`。 这意味着当 `T` 未知时，没有什么可以安全地 *写入* 到 `Foo<*>`。
- 对于 `Foo<T : TUpper>`，其中 `T` 是具有上界 `TUpper` 的不变类型参数，`Foo<*>` 等效于 `Foo<out TUpper>`（用于读取值）和 `Foo<in Nothing>`（用于写入值）。

如果泛型类型具有多个类型参数，则可以独立地投影每个类型参数。
例如，如果类型声明为 `interface Function<in T, out U>`，则可以使用以下星号投影：

* `Function<*, String>` 表示 `Function<in Nothing, String>`。
* `Function<Int, *>` 表示 `Function<Int, out Any?>`。
* `Function<*, *>` 表示 `Function<in Nothing, out Any?>`。

:::note
星号投影与 Java 的原始类型非常相似，但更安全。

:::

## 泛型函数

类并不是唯一可以具有类型参数的声明。 函数也可以。 类型参数位于函数名称 *之前*：

```kotlin
fun <T> singletonList(item: T): List<T> {
    // ...
}

fun <T> T.basicToString(): String { // 扩展函数
    // ...
}
```

要调用泛型函数，请在函数名称 *之后* 的调用点指定类型实参：

```kotlin
val l = singletonList<Int>(1)
```

如果可以从上下文中推断出类型实参，则可以省略它们，因此以下示例也有效：

```kotlin
val l = singletonList(1)
```

## 泛型约束

可以替代给定类型参数的所有可能类型的集合可以通过 *泛型约束 (generic constraints)* 来限制。

### 上界

最常见的约束类型是 *上界 (upper bound)*，它对应于 Java 的 `extends` 关键字：

```kotlin
fun <T : Comparable<T>> sort(list: List<T>) {  ... }
```

冒号后指定的类型是 *上界 (upper bound)*，表示只有 `Comparable<T>` 的子类型才能替代 `T`。 例如：

```kotlin
sort(listOf(1, 2, 3)) // OK。 Int 是 Comparable<Int> 的子类型
sort(listOf(HashMap<Int, String>())) // 错误：HashMap<Int, String> 不是 Comparable<HashMap<Int, String>> 的子类型
```

默认上界（如果没有指定）是 `Any?`。 在尖括号内只能指定一个上界。
如果同一个类型参数需要多个上界，则你需要一个单独的 _where_-子句：

```kotlin
fun <T> copyWhenGreater(list: List<T>, threshold: T): List<String>
    where T : CharSequence,
          T : Comparable<T> {
    return list.filter { it > threshold }.map { it.toString() }
}
```

传递的类型必须同时满足 `where` 子句的所有条件。 在上面的示例中，`T` 类型必须 *同时* 实现 `CharSequence` 和 `Comparable`。

## 明确的非空类型

为了更容易地与泛型 Java 类和接口进行互操作，Kotlin 支持将泛型类型参数声明为 **明确的非空类型**。

要将泛型类型 `T` 声明为明确的非空类型，请使用 `& Any` 声明该类型。 例如：`T & Any`。

明确的非空类型必须具有可空的 [上界](#upper-bounds)。

声明明确的非空类型最常见的用例是当你想要覆盖包含 `@NotNull` 作为参数的 Java 方法时。 例如，考虑 `load()` 方法：

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
    public T save(T x) {}
    @NotNull
    public T load(@NotNull T x) {}
}
```

要在 Kotlin 中成功覆盖 `load()` 方法，你需要将 `T1` 声明为明确的非空类型：

```kotlin
interface ArcadeGame<T1> : Game<T1> {
    override fun save(x: T1): T1
    // T1 是明确的非空类型
    override fun load(x: T1 & Any): T1 & Any
}
```

当只使用 Kotlin 时，你不太可能需要显式声明明确的非空类型，因为 Kotlin 的类型推断会为你处理这个问题。

## 类型擦除 (Type erasure)

Kotlin 对泛型声明用法执行的类型安全检查是在编译时完成的。
在运行时，泛型类型的实例不保留有关其实际类型实参的任何信息。
类型信息被称为被 *擦除 (erased)*。 例如，`Foo<Bar>` 和 `Foo<Baz?>` 的实例被擦除为 `Foo<*>`。

### 泛型类型检查和转换

由于类型擦除，没有通用的方法来检查泛型类型的实例是否是在运行时使用某些类型实参创建的，并且编译器禁止诸如 `ints is List<Int>` 或 `list is T`（类型参数）之类的 `is`-检查。 但是，你可以对照星号投影类型检查一个实例：

```kotlin
if (something is List<*>) {
    something.forEach { println(it) } // 这些项被类型化为 `Any?`
}
```

类似地，当你已经静态地（在编译时）检查了实例的类型实参时，你可以进行涉及类型非泛型部分的 `is`-检查或转换。 请注意，在这种情况下，省略了尖括号：

```kotlin
fun handleStrings(list: MutableList<String>) {
    if (list is ArrayList) {
        // `list` 被智能转换为 `ArrayList<String>`
    }
}
```

相同的语法，但省略了类型实参，可用于不考虑类型实参的转换：`list as ArrayList`。

泛型函数调用的类型实参也仅在编译时检查。 在函数体内部，类型参数不能用于类型检查，并且到类型参数的类型转换（`foo as T`）是未经检查的。
唯一的例外是具有 [具体化类型参数](inline-functions#reified-type-parameters) 的内联函数，
它们在每个调用点都内联了它们的实际类型实参。 这使得可以对类型参数进行类型检查和转换。
但是，上述限制仍然适用于在检查或转换中使用的泛型类型的实例。
例如，在类型检查 `arg is T` 中，如果 `arg` 本身是泛型类型的实例，则其类型实参仍然会被擦除。

```kotlin

inline fun <reified A, reified B> Pair<*, *>.asPairOf(): Pair<A, B>? {
    if (first !is A || second !is B) return null
    return first as A to second as B
}

val somePair: Pair<Any?, Any?> = "items" to listOf(1, 2, 3)

val stringToSomething = somePair.asPairOf<String, Any>()
val stringToInt = somePair.asPairOf<String, Int>()
val stringToList = somePair.asPairOf<String, List<*>>()
val stringToStringList = somePair.asPairOf<String, List<String>>() // 编译通过但破坏了类型安全！
// 展开示例以获取更多详细信息

fun main() {
    println("stringToSomething = " + stringToSomething)
    println("stringToInt = " + stringToInt)
    println("stringToList = " + stringToList)
    println("stringToStringList = " + stringToStringList)
    //println(stringToStringList?.second?.forEach() {it.length}) // 这将抛出 ClassCastException，因为列表项不是 String
}
```

### 未经检查的转换 (Unchecked casts)

到具有具体类型实参的泛型类型的类型转换（例如 `foo as List<String>`）无法在运行时进行检查。
当类型安全由高级程序逻辑暗示但编译器无法直接推断时，可以使用这些未经检查的转换。 请参见下面的示例。

```kotlin
fun readDictionary(file: File): Map<String, *> = file.inputStream().use { 
    TODO("Read a mapping of strings to arbitrary elements.")
}

// 我们将一个带有 `Int` 的 map 保存到此文件中
val intsFile = File("ints.dictionary")

// 警告：未经检查的转换：`Map<String, *>` 到 `Map<String, Int>`
val intsDictionary: Map<String, Int> = readDictionary(intsFile) as Map<String, Int>
```

在最后一行的转换中出现一个警告。 编译器无法在运行时完全检查它，并且不保证 map 中的值是 `Int`。

要避免未经检查的转换，你可以重新设计程序结构。 在上面的示例中，你可以使用具有针对不同类型的类型安全实现的 `DictionaryReader<T>` 和 `DictionaryWriter<T>` 接口。
你可以引入合理的抽象，将未经检查的转换从调用点移到实现细节。
正确使用 [泛型型变](#variance) 也有帮助。

对于泛型函数，使用 [具体化类型参数](inline-functions#reified-type-parameters) 使像 `arg as T` 这样的转换被检查，除非 `arg` 的类型有 *自己的* 被擦除的类型实参。

可以使用 `@Suppress("UNCHECKED_CAST")` [注解](annotations) 语句或发生声明以禁止显示未经检查的转换警告：

```kotlin
inline fun <reified T> List<*>.asListOfType(): List<T>? =
    if (all { it is T })
        @Suppress("UNCHECKED_CAST")
        this as List<T> else
        null
```

:::note
**在 JVM 上**：[数组类型](arrays) (`Array<Foo>`) 保留有关其元素擦除类型的信息，并且对数组类型的类型转换会进行部分检查：元素类型的可空性和实际类型实参仍会被擦除。
例如，如果 `foo` 是一个包含任何 `List<*>` 的数组，无论是否可空，则转换 `foo as Array<List<String>?>` 都将成功。

:::

## 类型实参的下划线运算符

下划线运算符 `_` 可用于类型实参。 当其他类型被显式指定时，可以使用它来自动推断实参的类型：

```kotlin
abstract class SomeClass<T> {
    abstract fun execute() : T
}

class SomeImplementation : SomeClass<String>() {
    override fun execute(): String = "Test"
}

class OtherImplementation : SomeClass<Int>() {
    override fun execute(): Int = 42
}

object Runner {
    inline fun <reified S: SomeClass<T>, T> run() : T {
        return S::class.java.getDeclaredConstructor().newInstance().execute()
    }
}

fun main() {
    // T 被推断为 String，因为 SomeImplementation 派生自 SomeClass<String>
    val s = Runner.run<SomeImplementation, _>()
    assert(s == "Test")

    // T 被推断为 Int，因为 OtherImplementation 派生自 SomeClass<Int>
    val n = Runner.run<OtherImplementation, _>()
    assert(n == 42)
}
```