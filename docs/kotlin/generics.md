[//]: # (title: 泛型：in、out、where)

Kotlin 中的类可以拥有类型参数，与 Java 类似：

```kotlin
class Box<T>(t: T) {
    var value = t
}
```

要创建此类实例，只需提供类型实参：

```kotlin
val box: Box<Int> = Box<Int>(1)
```

但如果参数可以被推断，例如从构造函数实参中推断，则可以省略类型实参：

```kotlin
val box = Box(1) // 1 的类型是 Int，因此编译器会推断出它是 Box<Int>
```

## 变型 (Variance)

Java 类型系统中最棘手的方面之一是通配符类型（参见 [Java Generics FAQ](http://www.angelikalanger.com/GenericsFAQ/JavaGenericsFAQ.html)）。Kotlin 没有这些。相反，Kotlin 拥有声明处变型 (declaration-site variance) 和类型投影 (type projections)。

### Java 中的变型和通配符

让我们思考一下为什么 Java 需要这些神秘的通配符。首先，Java 中的泛型类型是_不变的 (invariant)_，这意味着 `List<String>` _不是_ `List<Object>` 的子类型。如果 `List` _不是不变的_，那么它与 Java 的数组就没有区别了，因为以下代码将能编译通过，但在运行时会导致异常：

```java
// Java
List<String> strs = new ArrayList<String>();

// Java 在编译时会在此处报告类型不匹配。
List<Object> objs = strs;

// 如果它不报告呢？
// 我们就可以将一个 Integer 放入 String 列表中。
objs.add(1);

// 然后在运行时，Java 会抛出
// ClassCastException: Integer 无法转换为 String
String s = strs.get(0); 
```

Java 禁止此类操作以保证运行时安全。但这会带来一些影响。例如，考虑 `Collection` 接口中的 `addAll()` 方法。该方法的签名是什么？直观上，你会这样写：

```java
// Java
interface Collection<E> ... {
    void addAll(Collection<E> items);
}
```

但这样一来，你就无法执行以下操作（这是完全安全的）：

```java
// Java

// 以下代码将无法使用 addAll 的朴素声明进行编译：
// Collection<String> 不是 Collection<Object> 的子类型
void copyAll(Collection<Object> to, Collection<String> from) {
    to.addAll(from);
}
```

这就是为什么 `addAll()` 的实际签名是这样的：

```java
// Java
interface Collection<E> ... {
    void addAll(Collection<? extends E> items);
}
```

_通配符类型实参 (wildcard type argument)_ `? extends E` 表示此方法接受类型为 `E` _或其子类型_ 的对象集合，而不仅仅是 `E` 本身。这意味着你可以安全地从 `items` 中_读取_ `E` 类型（此集合的元素是 `E` 的子类的实例），但_无法写入_其中，因为你不知道哪些对象符合该未知的 `E` 的子类型。作为这种限制的交换，你获得了期望的行为：`Collection<String>` _是_ `Collection<? extends Object>` 的子类型。换句话说，带有 `extends` 边界（_上界 (upper bound)_）的通配符使类型成为_协变的 (covariant)_。

理解其工作原理的关键相当简单：如果你只能从集合中_取出_元素，那么使用 `String` 集合并从中读取 `Object` 类型是没问题的。反之，如果你只能将元素_放入_集合，那么取出 `Object` 集合并将 `String` 放入其中也是可以的：在 Java 中有 `List<? super String>`，它接受 `String` 或其任何父类型。

后者称为_逆变 (contravariance)_，你只能在 `List<? super String>` 上调用以 `String` 作为参数的方法（例如，你可以调用 `add(String)` 或 `set(int, String)`）。如果你在 `List<T>` 中调用返回 `T` 的方法，你不会得到 `String`，而是 `Object`。

Joshua Bloch 在其著作 [Effective Java, 3rd Edition](http://www.oracle.com/technetwork/java/effectivejava-136174.html) 中很好地解释了这个问题（第 31 条：“使用有限通配符增加 API 灵活性”）。他将你只从中_读取_的对象命名为_生产者 (Producers)_，将你只向其_写入_的对象命名为_消费者 (Consumers)_。他建议道：

>"为了最大限度的灵活性，在表示生产者或消费者的输入参数上使用通配符类型。"

然后他提出了以下助记符：_PECS_ 代表 _Producer-Extends, Consumer-Super_（生产者-协变，消费者-逆变）。

> 如果你使用生产者对象，例如 `List<? extends Foo>`，则不允许在此对象上调用 `add()` 或 `set()`，但这并不意味着它是_不可变的 (immutable)_：例如，没有任何东西能阻止你调用 `clear()` 来删除列表中的所有元素，因为 `clear()` 根本不带任何参数。
>
> 通配符（或其他类型的变型）唯一保证的是_类型安全_。不变性 (Immutability) 则是一个完全不同的概念。
>
{style="note"}

### 声明处变型 (Declaration-site variance)

假设有一个泛型接口 `Source<T>`，它没有任何以 `T` 为参数的方法，只有返回 `T` 的方法：

```java
// Java
interface Source<T> {
    T nextT();
}
```

那么，将 `Source<String>` 实例的引用存储在 `Source<Object>` 类型的变量中是完全安全的——因为没有要调用的消费者方法。但 Java 不知道这一点，仍然禁止这样做：

```java
// Java
void demo(Source<String> strs) {
    Source<Object> objects = strs; // !!! 在 Java 中不允许
    // ...
}
```

要解决这个问题，你应该声明 `Source<? extends Object>` 类型的对象。这样做毫无意义，因为你仍然可以像以前一样在该变量上调用所有相同的方法，所以更复杂的类型并没有增加任何价值。但编译器不知道这一点。

在 Kotlin 中，有一种方法可以向编译器解释这种事情。这被称为_声明处变型 (declaration-site variance)_：你可以通过注解 `Source` 的_类型参数_ `T`，以确保它仅从 `Source<T>` 的成员中_返回_（生产），而从不被消费。为此，请使用 `out` 修饰符：

```kotlin
interface Source<out T> {
    fun nextT(): T
}

fun demo(strs: Source<String>) {
    val objects: Source<Any> = strs // 这是可以的，因为 T 是一个 out-参数
    // ...
}
```

一般规则是：当类 `C` 的类型参数 `T` 被声明为 `out` 时，它只能出现在 `C` 成员的_out_-位置，但作为回报，`C<Base>` 可以安全地成为 `C<Derived>` 的超类型。

换句话说，你可以说类 `C` 在参数 `T` 上是_协变的 (covariant)_，或者 `T` 是一个_协变_类型参数。你可以将 `C` 视为 `T` 的_生产者_，而不是 `T` 的_消费者_。

`out` 修饰符被称为_变型注解 (variance annotation)_，由于它在类型参数声明处提供，因此它提供了_声明处变型_。这与 Java 的_使用处变型 (use-site variance)_ 形成对比，Java 中是类型使用处的通配符使类型协变。

除了 `out` 之外，Kotlin 还提供了一个互补的变型注解：`in`。它使类型参数_逆变 (contravariant)_，这意味着它只能被消费而不能被生产。`Comparable` 是一个很好的逆变类型示例：

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

词语 _in_ 和 _out_ 似乎是自解释的（因为它们在 C# 中已经成功使用了相当长的时间），所以上面提到的助记符并不是真正必需的。事实上，它可以从更高层次的抽象重新表述：

**存在主义转换：消费者 in，生产者 out！** :-)

## 类型投影 (Type projections)

### 使用处变型：类型投影

将类型参数 `T` 声明为 `out` 并在使用处避免子类型问题非常容易，但有些类实际上_无法_被限制为只返回 `T` 类型！一个很好的例子是 `Array`：

```kotlin
class Array<T>(val size: Int) {
    operator fun get(index: Int): T { ... }
    operator fun set(index: Int, value: T) { ... }
}
```

这个类在 `T` 上既不能是协变的，也不能是逆变的。这带来了一定的不灵活性。考虑以下函数：

```kotlin
fun copy(from: Array<Any>, to: Array<Any>) {
    assert(from.size == to.size)
    for (i in from.indices)
        to[i] = from[i]
}
```

此函数旨在将元素从一个数组复制到另一个数组。让我们尝试在实践中应用它：

```kotlin
val ints: Array<Int> = arrayOf(1, 2, 3)
val any = Array<Any>(3) { "" } 
copy(ints, any)
//   ^ 类型是 Array<Int> 但期望是 Array<Any>
```

在这里，你遇到了同样熟悉的问题：`Array<T>` 在 `T` 上是_不变的 (invariant)_，因此 `Array<Int>` 和 `Array<Any>` 都不是彼此的子类型。为什么不行？同样，这是因为 `copy` 可能会有意外行为，例如，它可能尝试向 `from` 写入一个 `String`，而如果你实际传入一个 `Int` 数组，则稍后会抛出 `ClassCastException`。

为了禁止 `copy` 函数向 `from` _写入_，你可以这样做：

```kotlin
fun copy(from: Array<out Any>, to: Array<Any>) { ... }
```

这就是_类型投影 (type projection)_，这意味着 `from` 不是一个简单的数组，而是一个受限的（_投影_的）数组。你只能调用返回类型参数 `T` 的方法，在这种情况下意味着你只能调用 `get()`。这是我们处理_使用处变型 (use-site variance)_ 的方法，它对应于 Java 的 `Array<? extends Object>`，同时略微简单。

你也可以使用 `in` 投影类型：

```kotlin
fun fill(dest: Array<in String>, value: String) { ... }
```

`Array<in String>` 对应于 Java 的 `Array<? super String>`。这意味着你可以将 `String`、`CharSequence` 或 `Object` 数组传递给 `fill()` 函数。

### 星投影 (Star-projections)

有时你希望表示对类型实参一无所知，但仍然希望以安全的方式使用它。这里安全的方式是定义泛型类型的这样一种投影，使得该泛型类型的每个具体实例化都将是该投影的子类型。

Kotlin 为此提供了所谓的_星投影 (star-projection)_ 语法：

- 对于 `Foo<out T : TUpper>`，其中 `T` 是一个协变类型参数，上界为 `TUpper`，`Foo<*>` 等同于 `Foo<out TUpper>`。这意味着当 `T` 未知时，你可以安全地从 `Foo<*>` 中_读取_ `TUpper` 类型的值。
- 对于 `Foo<in T>`，其中 `T` 是一个逆变类型参数，`Foo<*>` 等同于 `Foo<in Nothing>`。这意味着当 `T` 未知时，你无法安全地向 `Foo<*>` _写入_任何内容。
- 对于 `Foo<T : TUpper>`，其中 `T` 是一个不变型类型参数，上界为 `TUpper`，`Foo<*>` 对于读取值等同于 `Foo<out TUpper>`，对于写入值等同于 `Foo<in Nothing>`。

如果一个泛型类型有多个类型参数，每个参数都可以独立地进行投影。例如，如果类型被声明为 `interface Function<in T, out U>`，你可以使用以下星投影：

* `Function<*, String>` means `Function<in Nothing, String>`.
* `Function<Int, *>` means `Function<Int, out Any?>`.
* `Function<*, *>` means `Function<in Nothing, out Any?>`.

> 星投影与 Java 的原始类型 (raw types) 非常相似，但更安全。
>
{style="note"}

## 泛型函数

类不是唯一可以拥有类型参数的声明。函数也可以。类型参数放置在函数名_之前_：

```kotlin
fun <T> singletonList(item: T): List<T> {
    // ...
}

fun <T> T.basicToString(): String { // 扩展函数
    // ...
}
```

要调用泛型函数，请在调用处函数名_之后_指定类型实参：

```kotlin
val l = singletonList<Int>(1)
```

如果类型实参可以从上下文中推断出来，则可以省略，所以以下示例也适用：

```kotlin
val l = singletonList(1)
```

## 泛型约束

可以替代给定类型参数的所有可能类型的集合可以由_泛型约束 (generic constraints)_ 来限制。

### 上界

最常见的约束类型是_上界 (upper bound)_，它对应于 Java 的 `extends` 关键字：

```kotlin
fun <T : Comparable<T>> sort(list: List<T>) {  ... }
```

冒号后面指定的类型是_上界 (upper bound)_，表示只有 `Comparable<T>` 的子类型才能替换 `T`。例如：

```kotlin
sort(listOf(1, 2, 3)) // OK。Int 是 Comparable<Int> 的子类型
sort(listOf(HashMap<Int, String>())) // 错误：HashMap<Int, String> 不是 Comparable<HashMap<Int, String>> 的子类型
```

默认的上界（如果没有指定）是 `Any?`。在尖括号内只能指定一个上界。如果同一个类型参数需要多个上界，你需要一个单独的 `where` 子句：

```kotlin
fun <T> copyWhenGreater(list: List<T>, threshold: T): List<String>
    where T : CharSequence,
          T : Comparable<T> {
    return list.filter { it > threshold }.map { it.toString() }
}
```

传入的类型必须同时满足 `where` 子句的所有条件。在上面的例子中，`T` 类型必须同时实现 `CharSequence` 和 `Comparable`。

## 确定非空类型 (Definitely non-nullable types)

为了更轻松地与泛型 Java 类和接口进行互操作，Kotlin 支持将泛型类型参数声明为**确定非空 (definitely non-nullable)** 类型。

要将泛型类型 `T` 声明为确定非空，请使用 `& Any` 声明该类型。例如：`T & Any`。

确定非空类型必须具有可空的 [上界](#upper-bounds)。

声明确定非空类型最常见的用例是当你想要重写一个包含 `@NotNull` 作为参数的 Java 方法时。例如，考虑 `load()` 方法：

```java
import org.jetbrains.annotations.*;

public interface Game<T> {
    public T save(T x) {}
    @NotNull
    public T load(@NotNull T x) {}
}
```

要在 Kotlin 中成功重写 `load()` 方法，你需要将 `T1` 声明为确定非空：

```kotlin
interface ArcadeGame<T1> : Game<T1> {
    override fun save(x: T1): T1
    // T1 是确定非空类型
    override fun load(x: T1 & Any): T1 & Any
}
```

只使用 Kotlin 时，你不太可能需要显式声明确定非空类型，因为 Kotlin 的类型推断会为你处理这些。

## 类型擦除 (Type erasure)

Kotlin 对泛型声明使用执行的类型安全检查是在编译时完成的。在运行时，泛型类型的实例不包含任何关于其实际类型实参的信息。类型信息被称之为_擦除 (erased)_。例如，`Foo<Bar>` 和 `Foo<Baz?>` 的实例被擦除为 `Foo<*>`。

### 泛型类型检查和类型转换

由于类型擦除，在运行时无法普遍地检查泛型类型的实例是否使用特定的类型实参创建，编译器禁止诸如 `ints is List<Int>` 或 `list is T`（类型参数）这样的 `is`-检查。但是，你可以针对星投影类型检查实例：

```kotlin
if (something is List<*>) {
    something.forEach { println(it) } // 元素的类型为 `Any?`
}
```

同样，当你已经在静态（编译时）检查了实例的类型实参时，你可以进行涉及类型非泛型部分的 `is`-检查或类型转换。请注意，在这种情况下省略了尖括号：

```kotlin
fun handleStrings(list: MutableList<String>) {
    if (list is ArrayList) {
        // `list` 被智能转换为 `ArrayList<String>`
    }
}
```

相同的语法，但省略了类型实参，可用于不考虑类型实参的类型转换：`list as ArrayList`。

泛型函数调用的类型实参也只在编译时检查。在函数体内部，类型参数不能用于类型检查，并且向类型参数的类型转换（`foo as T`）是未检查的。唯一的例外是带有[具体化类型参数 (reified type parameters)](inline-functions.md#reified-type-parameters) 的内联函数，它们的实际类型实参会在每个调用点内联。这使得类型参数的类型检查和类型转换成为可能。然而，上述限制仍然适用于在检查或类型转换中使用的泛型类型实例。例如，在类型检查 `arg is T` 中，如果 `arg` 本身是泛型类型的一个实例，其类型实参仍然会被擦除。

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
val stringToStringList = somePair.asPairOf<String, List<String>>() // Compiles but breaks type safety!
// 展开示例查看更多细节

//sampleEnd

fun main() {
    println("stringToSomething = " + stringToSomething)
    println("stringToInt = " + stringToInt)
    println("stringToList = " + stringToList)
    println("stringToStringList = " + stringToStringList)
    //println(stringToStringList?.second?.forEach() {it.length}) // 这会抛出 ClassCastException，因为列表项不是 String
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

### 未检查的类型转换 (Unchecked casts)

向具有具体类型实参的泛型类型进行类型转换，例如 `foo as List<String>`，无法在运行时检查。当高层程序逻辑暗示类型安全但编译器无法直接推断时，可以使用这些未检查的类型转换。请看下面的例子。

```kotlin
fun readDictionary(file: File): Map<String, *> = file.inputStream().use { 
    TODO("Read a mapping of strings to arbitrary elements.")
}

// 我们已将一个包含 `Int` 类型的映射保存到此文件中
val intsFile = File("ints.dictionary")

// 警告：未检查的类型转换：`Map<String, *>` 到 `Map<String, Int>`
val intsDictionary: Map<String, Int> = readDictionary(intsFile) as Map<String, Int>
```
最后一行中的类型转换会显示警告。编译器无法在运行时完全检查它，并且无法保证映射中的值是 `Int` 类型。

为避免未检查的类型转换，你可以重新设计程序结构。在上面的例子中，你可以使用 `DictionaryReader<T>` 和 `DictionaryWriter<T>` 接口，并为不同的类型提供类型安全的实现。你可以引入合理的抽象，将未检查的类型转换从调用处移到实现细节中。正确使用[泛型变型](#variance) 也能有所帮助。

对于泛型函数，使用[具体化类型参数](inline-functions.md#reified-type-parameters) 可以使 `arg as T` 这样的类型转换得到检查，除非 `arg` 的类型有*自己的*类型实参被擦除。

未检查的类型转换警告可以通过使用 `@Suppress("UNCHECKED_CAST")` 注解[注释](annotations.md) 发生警告的语句或声明来抑制：

```kotlin
inline fun <reified T> List<*>.asListOfType(): List<T>? =
    if (all { it is T })
        @Suppress("UNCHECKED_CAST")
        this as List<T> else
        null
```

> **在 JVM 上**：[数组类型](arrays.md) (`Array<Foo>`) 保留了关于其元素擦除类型的信息，并且向数组类型的类型转换会进行部分检查：元素类型的可空性和实际类型实参仍然被擦除。例如，如果 `foo` 是一个持有任何 `List<*>` 的数组，无论其是否可空，类型转换 `foo as Array<List<String>?>` 都会成功。
>
{style="note"}

## 类型实参的下划线运算符

下划线运算符 `_` 可以用于类型实参。当其他类型被显式指定时，可以使用它来自动推断参数的类型：

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