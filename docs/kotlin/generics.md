[//]: # (title: 泛型：in、out、where)

Kotlin 中的类可以拥有类型形参，就像 Java 中一样：

```kotlin
class Box<T>(t: T) {
    var value = t
}
```

要创建此类实例，只需提供类型实参：

```kotlin
val box: Box<Int> = Box<Int>(1)
```

但如果形参可以从上下文（例如构造函数实参）中推断出来，则可以省略类型实参：

```kotlin
val box = Box(1) // 1 的类型为 Int，因此编译器推断其为 Box<Int>
```

## 型变

Java 类型系统中最棘手的方面之一是通配符类型（请参阅 [Java 泛型 FAQ](http://www.angelikalanger.com/GenericsFAQ/JavaGenericsFAQ.html)）。Kotlin 没有这些。相反，Kotlin 拥有声明处型变和类型投影。

### Java 中的型变与通配符

我们来思考一下为什么 Java 需要这些神秘的通配符。首先，Java 中的泛型类型是*不型变*的，这意味着 `List<String>` *不是* `List<Object>` 的子类型。如果 `List` 不是*不型变*的，那么它将不会比 Java 的数组好到哪里去，因为下面的代码会编译通过，但在运行时导致异常：

```java
// Java
List<String> strs = new ArrayList<String>();

// Java 在编译期报告此处存在类型不匹配。
List<Object> objs = strs;

// 如果没有（编译器报错），会发生什么？
// 我们将能够把一个 Integer 放入字符串列表中。
objs.add(1);

// 然后在运行时，Java 将抛出
// ClassCastException: Integer cannot be cast to String
String s = strs.get(0); 
```

Java 禁止此类行为以保证运行时安全。但这会带来一些影响。例如，考虑 `Collection` 接口中的 `addAll()` 方法。这个方法的签名是什么？直观地看，你会这样写：

```java
// Java
interface Collection<E> ... {
    void addAll(Collection<E> items);
}
```

但这样的话，你就无法执行以下操作（这实际上是完全安全的）：

```java
// Java

// 下面代码在 addAll 的朴素声明下无法编译：
// Collection<String> 不是 Collection<Object> 的子类型
void copyAll(Collection<Object> to, Collection<String> from) {
    to.addAll(from);
}
```

这就是 `addAll()` 的实际签名如下的原因：

```java
// Java
interface Collection<E> ... {
    void addAll(Collection<? extends E> items);
}
```

通配符类型实参 `? extends E` 表明此方法接受一个 `E` 类型对象或 `E` 的*子类型*对象的集合，而不仅仅是 `E` 本身。这意味着你可以安全地从 `items` 中*读取* `E` 类型的值（此集合的元素是 `E` 子类的实例），但*不能写入*它，因为你不知道哪些对象符合 `E` 的该未知子类型。作为此限制的交换，你获得了所需的行为：`Collection<String>` *是* `Collection<? extends Object>` 的子类型。换句话说，带有 `extends` 界限（*上界*）的通配符使类型*协变*。

理解其工作原理的关键相当简单：如果你只能从集合中*取出*项，那么使用 `String` 集合并从中读取 `Object` 类型的值是没问题的。反之，如果你只能将项*放入*集合，那么取一个 `Object` 集合并将 `String` 放入其中也是可以的：在 Java 中有 `List<? super String>`，它接受 `String` 或其任何超类型。

后者称为*逆变*，你只能对 `List<? super String>` 调用接受 `String` 作为实参的方法（例如，你可以调用 `add(String)` 或 `set(int, String)`）。如果你调用 `List<T>` 中返回 `T` 的方法，你将不会得到 `String`，而是 `Object`。

Joshua Bloch 在他的著作《[Effective Java，第 3 版](http://www.oracle.com/technetwork/java/effectivejava-136174.html)》中很好地解释了这个问题（第 31 条：“使用有界通配符以增加 API 灵活性”）。他将你只*读取*的对象称为*生产者*，将你只*写入*的对象称为*消费者*。他建议：

> “为实现最大灵活性，请在表示生产者或消费者的输入形参上使用通配符类型。”

然后他提出了以下助记符：PECS 代表*生产者-`Extends`、消费者-`Super`*。

> 如果你使用生产者对象，例如 `List<? extends Foo>`，则不允许对此对象调用 `add()` 或 `set()`，但这并不意味着它是*不可变*的：例如，没有任何东西能阻止你调用 `clear()` 以从列表中删除所有项，因为 `clear()` 根本不接受任何形参。
>
> 通配符（或其他型变类型）唯一保证的是*类型安全*。不变性是一个完全不同的概念。
>
{style="note"}

### 声明处型变

假设有一个泛型接口 `Source<T>`，它没有任何方法接受 `T` 作为形参，只有返回 `T` 的方法：

```java
// Java
interface Source<T> {
    T nextT();
}
```

那么，将 `Source<String>` 实例的引用存储在 `Source<Object>` 类型的变量中将是完全安全的——没有消费者方法可以调用。但 Java 不知道这一点，仍然禁止它：

```java
// Java
void demo(Source<String> strs) {
    Source<Object> objects = strs; // !!! Java 中不允许
    // ...
}
```

为了解决这个问题，你应该声明 `Source<? extends Object>` 类型的对象。这样做毫无意义，因为你可以在这样的变量上调用与以前相同的所有方法，因此更复杂的类型并没有增加任何价值。但编译器不知道这一点。

在 Kotlin 中，有一种方法可以向编译器解释这类事情。这称为*声明处型变*：你可以注解 `Source` 的*类型形参* `T`，以确保它只从 `Source<T>` 的成员中*返回*（生产），而从不消费。
为此，请使用 `out` 修饰符：

```kotlin
interface Source<out T> {
    fun nextT(): T
}

fun demo(strs: Source<String>) {
    val objects: Source<Any> = strs // 这样是 OK 的，因为 T 是一个 out 形参
    // ...
}
```

一般规则是：当一个类 `C` 的类型形参 `T` 被声明为 `out` 时，它只能出现在 `C` 成员的 *out* 位置，作为回报，`C<Base>` 可以安全地成为 `C<Derived>` 的超类型。

换句话说，你可以说类 `C` 在形参 `T` 上是*协变*的，或者说 `T` 是一个*协变*类型形参。你可以将 `C` 视为 `T` 的*生产者*，而不是 `T` 的*消费者*。

`out` 修饰符称为*型变注解*，因为它是在类型形参声明处提供的，所以它提供了*声明处型变*。这与 Java 的*使用处型变*形成对比，Java 中是类型使用处的通配符使类型协变。

除了 `out`，Kotlin 还提供了一个互补的型变注解：`in`。它使类型形参*逆变*，这意味着它只能被消费而不能被生产。一个很好的逆变类型示例是 `Comparable`：

```kotlin
interface Comparable<in T> {
    operator fun compareTo(other: T): Int
}

fun demo(x: Comparable<Number>) {
    x.compareTo(1.0) // 1.0 的类型为 Double，它是 Number 的子类型
    // 因此，你可以将 x 赋值给 Comparable<Double> 类型的变量
    val y: Comparable<Double> = x // OK！
}
```

`in` 和 `out` 这些词似乎不言自明（因为它们在 C# 中已经成功使用了很长时间），因此上面提到的助记符实际上并不需要。事实上，它可以在更高的抽象层面重新表述：

**[存在主义](https://zh.wikipedia.org/wiki/%E5%AD%98%E5%9C%A8%E4%B8%BB%E4%B9%89)转化：消费者 `in`，生产者 `out`！** :-)

## 类型投影

### 使用处型变：类型投影

将类型形参 `T` 声明为 `out` 并避免使用处子类型问题非常容易，但有些类实际上*不能*仅限于返回 `T` 类型的值！一个很好的例子是 `Array`：

```kotlin
class Array<T>(val size: Int) {
    operator fun get(index: Int): T { ... }
    operator fun set(index: Int, value: T) { ... }
}
```

此类在 `T` 上既不能协变也不能逆变。这会带来某些不灵活性。考虑以下函数：

```kotlin
fun copy(from: Array<Any>, to: Array<Any>) {
    assert(from.size == to.size)
    for (i in from.indices)
        to[i] = from[i]
}
```

此函数旨在将项从一个数组复制到另一个数组。让我们尝试在实践中应用它：

```kotlin
val ints: Array<Int> = arrayOf(1, 2, 3)
val any = Array<Any>(3) { "" } 
copy(ints, any)
//   ^ 类型是 Array<Int> 但期望 Array<Any>
```

这里你遇到了同样熟悉的问题：`Array<T>` 在 `T` 上是*不型变*的，因此 `Array<Int>` 和 `Array<Any>` 都不是彼此的子类型。为什么不呢？同样，这是因为 `copy` 可能存在意外行为，例如，它可能尝试向 `from` 写入 `String`，如果你实际传入一个 `Int` 数组，则稍后会抛出 `ClassCastException`。

为了禁止 `copy` 函数向 `from` *写入*，你可以这样做：

```kotlin
fun copy(from: Array<out Any>, to: Array<Any>) { ... }
```

这就是*类型投影*，这意味着 `from` 不是一个简单的数组，而是一个受限（投影）的数组。你只能调用返回类型形参 `T` 的方法，在这种情况下，这意味着你只能调用 `get()`。这是我们处理*使用处型变*的方法，它对应于 Java 的 `Array<? extends Object>`，同时稍微更简单。

你也可以使用 `in` 投影类型：

```kotlin
fun fill(dest: Array<in String>, value: String) { ... }
```

`Array<in String>` 对应于 Java 的 `Array<? super String>`。这意味着你可以将 `String`、`CharSequence` 或 `Object` 数组传递给 `fill()` 函数。

### 星投影

有时你希望表示你对类型实参一无所知，但你仍然希望以安全的方式使用它。这里的安全方式是定义泛型类型的这种投影，使得该泛型类型的每个具体实例化都将是该投影的子类型。

Kotlin 为此提供了所谓的*星投影*语法：

- 对于 `Foo<out T : TUpper>`，其中 `T` 是一个具有上界 `TUpper` 的协变类型形参，`Foo<*>` 等同于 `Foo<out TUpper>`。这意味着当 `T` 未知时，你可以安全地从 `Foo<*>` 中*读取* `TUpper` 类型的值。
- 对于 `Foo<in T>`，其中 `T` 是一个逆变类型形参，`Foo<*>` 等同于 `Foo<in Nothing>`。这意味着当 `T` 未知时，你无法安全地*写入* `Foo<*>` 任何值。
- 对于 `Foo<T : TUpper>`，其中 `T` 是一个具有上界 `TUpper` 的不型变类型形参，`Foo<*>` 等同于用于读取值的 `Foo<out TUpper>` 和用于写入值的 `Foo<in Nothing>`。

如果一个泛型类型有多个类型形参，每个形参都可以独立投影。例如，如果类型声明为 `interface Function<in T, out U>`，你可以使用以下星投影：

*   `Function<*, String>` 表示 `Function<in Nothing, String>`。
*   `Function<Int, *>` 表示 `Function<Int, out Any?>`。
*   `Function<*, *>` 表示 `Function<in Nothing, out Any?>`。

> 星投影与 Java 的原始类型非常相似，但更安全。
>
{style="note"}

## 泛型函数

类不是唯一可以拥有类型形参的声明。函数也可以。类型形参放置在函数名称*之前*：

```kotlin
fun <T> singletonList(item: T): List<T> {
    // ...
}

fun <T> T.basicToString(): String { // 扩展函数
    // ...
}
```

要调用泛型函数，请在函数名称*之后*的调用点指定类型实参：

```kotlin
val l = singletonList<Int>(1)
```

如果类型实参可以从上下文中推断出来，则可以省略它们，因此以下示例也有效：

```kotlin
val l = singletonList(1)
```

## 泛型约束

可以替换给定类型形参的所有可能类型的集合可以通过*泛型约束*来限制。

### 上界

最常见的约束类型是*上界*，它对应于 Java 的 `extends` 关键字：

```kotlin
fun <T : Comparable<T>> sort(list: List<T>) {  ... }
```

冒号后指定的类型是*上界*，表示只有 `Comparable<T>` 的子类型才能替换 `T`。例如：

```kotlin
sort(listOf(1, 2, 3)) // OK。Int 是 Comparable<Int> 的子类型
sort(listOf(HashMap<Int, String>())) // 错误：HashMap<Int, String> 不是 Comparable<HashMap<Int, String>> 的子类型
```

默认上界（如果没有指定）是 `Any?`。尖括号内只能指定一个上界。如果同一类型形参需要多个上界，则需要一个单独的 `where` 子句：

```kotlin
fun <T> copyWhenGreater(list: List<T>, threshold: T): List<String>
    where T : CharSequence,
          T : Comparable<T> {
    return list.filter { it > threshold }.map { it.toString() }
}
```

传入的类型必须同时满足 `where` 子句的所有条件。在上面的示例中，`T` 类型必须同时实现 `CharSequence` 和 `Comparable`。

## 确定非空类型

为了使与泛型 Java 类和接口的互操作性更容易，Kotlin 支持将泛型类型形参声明为**确定非空**。

要将泛型类型 `T` 声明为确定非空，请使用 `& Any` 声明类型。例如：`T & Any`。

确定非空类型必须具有可空的[上界](#upper-bounds)。

声明确定非空类型最常见的用例是当你想覆盖一个包含 `@NotNull` 作为实参的 Java 方法时。例如，考虑 `load()` 方法：

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
    public T save(T x) {}
    @NotNull
    public T load(@NotNull T x) {}
}
```

要在 Kotlin 中成功覆盖 `load()` 方法，你需要将 `T1` 声明为确定非空：

```kotlin
interface ArcadeGame<T1> : Game<T1> {
    override fun save(x: T1): T1
    // T1 是确定非空的
    override fun load(x: T1 & Any): T1 & Any
}
```

当只使用 Kotlin 时，你不太可能需要显式声明确定非空类型，因为 Kotlin 的类型推断会为你处理。

## 类型擦除

Kotlin 对泛型声明使用执行的类型安全检测是在编译期完成的。在运行时，泛型类型的实例不包含任何关于其实际类型实参的信息。类型信息被认为是*擦除*的。例如，`Foo<Bar>` 和 `Foo<Baz?>` 的实例都被擦除为 `Foo<*>`。

### 泛型类型检测与转换

由于类型擦除，在运行时无法普遍检测泛型类型的实例是否使用某些类型实参创建，编译器禁止诸如 `ints is List<Int>` 或 `list is T`（类型形参）之类的 `is` 检测。但是，你可以针对一个星投影类型检测实例：

```kotlin
if (something is List<*>) {
    something.forEach { println(it) } // 项的类型为 `Any?`
}
```

同样，当你已经在编译期静态检测了实例的类型实参时，你可以进行涉及类型非泛型部分的 `is` 检测或转换。请注意，在这种情况下，尖括号被省略：

```kotlin
fun handleStrings(list: MutableList<String>) {
    if (list is ArrayList) {
        // `list` 被智能转换为 `ArrayList<String>`
    }
}
```

相同的语法但省略类型实参可用于不考虑类型实参的转换：`list as ArrayList`。

泛型函数调用的类型实参也仅在编译期进行检测。在函数体内部，类型形参不能用于类型检测，并且转换为类型形参 (`foo as T`) 的类型转换是未经检查的。唯一的例外是带有[具体化类型形参](inline-functions.md#reified-type-parameters)的内联函数，它们的实际类型实参在每个调用点都被内联。这使得对类型形参进行类型检测和转换成为可能。然而，上述限制仍然适用于用于检测或转换的泛型类型实例。例如，在类型检测 `arg is T` 中，如果 `arg` 本身是泛型类型的实例，则其类型实参仍会被擦除。

```kotlin
//sampleStart
inline fun <reified A, reified B> Pair<*, *>.asPairOf(): Pair<A, B>? {
    if (first !is A || second !is B) return null
    return first as A to second as B
}

val somePair: Pair<Any?, Any?> = "items" to listOf(1, 2, 3)

val stringToSomething = somePair.asPairOf<String, Any>()
val stringToInt = somePair.asPairOf<String, Int>()
val stringToList = somePair.asPairOf<String, List<*>>()
val stringToStringList = somePair.asPairOf<String, List<String>>() // 编译通过但破坏了类型安全！
// 展开示例以获取更多详情

//sampleEnd

fun main() {
    println("stringToSomething = " + stringToSomething)
    println("stringToInt = " + stringToInt)
    println("stringToList = " + stringToList)
    println("stringToStringList = " + stringToStringList)
    //println(stringToStringList?.second?.forEach() {it.length}) // 这将抛出 ClassCastException，因为列表项不是 String
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 未经检查的转换

对带有具体类型实参的泛型类型进行类型转换，例如 `foo as List<String>`，无法在运行时进行检测。当高层程序逻辑暗示类型安全但编译器无法直接推断时，可以使用这些未经检查的转换。请参阅下面的示例。

```kotlin
fun readDictionary(file: File): Map<String, *> = file.inputStream().use { 
    TODO("Read a mapping of strings to arbitrary elements.")
}

// 我们将一个带有 Ints 的 map 保存到此文件中
val intsFile = File("ints.dictionary")

// 警告：未经检查的转换：`Map<String, *>` 转换为 `Map<String, Int>`
val intsDictionary: Map<String, Int> = readDictionary(intsFile) as Map<String, Int>
```
最后一行中的转换会出现警告。编译器无法在运行时完全检测它，并且不保证 map 中的值是 `Int`。

为了避免未经检查的转换，你可以重新设计程序结构。在上面的示例中，你可以使用 `DictionaryReader<T>` 和 `DictionaryWriter<T>` 接口，并为不同类型提供类型安全的实现。你可以引入合理的抽象，将未经检查的转换从调用点转移到实现细节中。正确使用[泛型型变](#variance)也可以有所帮助。

对于泛型函数，使用[具体化类型形参](inline-functions.md#reified-type-parameters)可以使诸如 `arg as T` 的转换得到检测，除非 `arg` 的类型有其*自己的*类型实参被擦除。

未经检查的转换警告可以通过使用 `@Suppress("UNCHECKED_CAST")` 注解发生警告的语句或声明来抑制：

```kotlin
inline fun <reified T> List<*>.asListOfType(): List<T>? =
    if (all { it is T })
        @Suppress("UNCHECKED_CAST")
        this as List<T> else
        null
```

>**在 JVM 上**：[数组类型](arrays.md) (`Array<Foo>`) 保留其元素擦除类型的信息，并且对数组类型的类型转换会部分检测：元素类型的可空性和实际类型实参仍然被擦除。例如，如果 `foo` 是一个持有任何 `List<*>` 的数组，无论是可空的还是非空的，转换 `foo as Array<List<String>?>` 都会成功。
>
{style="note"}

## 类型实参的下划线操作符

下划线操作符 `_` 可用于类型实参。当其他类型被显式指定时，使用它来自动推断实参的类型：

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