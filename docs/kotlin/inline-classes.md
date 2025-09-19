[//]: # (title: 内联值类)

有时，将一个值封装在类中以创建更具领域特定性的类型会很有用。然而，这会由于额外的堆分配而引入运行时开销。此外，如果被封装的类型是基本类型，性能损失会非常显著，因为基本类型通常会通过运行时进行大量优化，而它们的封装器则得不到任何特殊处理。

为了解决此类问题，Kotlin 引入了一种特殊类型的类，称为 _内联类_。内联类是 [值基类](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md) 的一个子集。它们没有标识，并且只能持有值。

要声明一个内联类，请在类名之前使用 `value` 修饰符：

```kotlin
value class Password(private val s: String)
```

要在 JVM 后端声明内联类，请在类声明之前使用 `value` 修饰符以及 `@JvmInline` 注解：

```kotlin
// For JVM backends
@JvmInline
value class Password(private val s: String)
```

内联类必须在主构造函数中初始化一个单一属性。在运行时，内联类的实例将使用此单一属性进行表示（有关运行时表示的详细信息请参见 [下方](#representation)）：

```kotlin
// No actual instantiation of class 'Password' happens
// At runtime 'securePassword' contains just 'String'
val securePassword = Password("Don't try this in production") 
```

这是内联类的主要特性，它启发了 *inline* 这个名称：类的数据被 *内联* 到其用法中（类似于 [内联函数](inline-functions.md) 的内容被内联到调用点）。

## 成员

内联类支持普通类的某些功能。特别是，它们允许声明属性和函数，拥有 `init` 代码块和 [次构造函数](classes.md#secondary-constructors)：

```kotlin
@JvmInline
value class Person(private val fullName: String) {
    init {
        require(fullName.isNotEmpty()) {
            "Full name shouldn't be empty"
        }
    }

    constructor(firstName: String, lastName: String) : this("$firstName $lastName") {
        require(lastName.isNotBlank()) {
            "Last name shouldn't be empty"
        }
    }

    val length: Int
        get() = fullName.length

    fun greet() {
        println("Hello, $fullName")
    }
}

fun main() {
    val name1 = Person("Kotlin", "Mascot")
    val name2 = Person("Kodee")
    name1.greet() // the `greet()` function is called as a static method
    println(name2.length) // property getter is called as a static method
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.9"}

内联类属性不能拥有 [幕后字段](properties.md#backing-fields)。它们只能拥有简单的可计算属性（没有 `lateinit`/委托属性）。

## 继承

内联类允许继承接口：

```kotlin
interface Printable {
    fun prettyPrint(): String
}

@JvmInline
value class Name(val s: String) : Printable {
    override fun prettyPrint(): String = "Let's $s!"
}

fun main() {
    val name = Name("Kotlin")
    println(name.prettyPrint()) // Still called as a static method
}
```

内联类禁止参与类层次结构。这意味着内联类不能扩展其他类，并且总是 `final` 的。

## 表示

在生成的代码中，Kotlin 编译器会为每个内联类保留一个 *封装器*。内联类实例在运行时可以表示为封装器或底层类型。这类似于 `Int` 如何被 [表示](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine) 为基本类型 `int` 或封装器 `Integer`。

Kotlin 编译器将优先使用底层类型而不是封装器，以生成性能最佳且最优化的代码。然而，有时需要保留封装器。根据经验法则，只要内联类被用作另一种类型，它们就会被装箱。

```kotlin
interface I

@JvmInline
value class Foo(val i: Int) : I

fun asInline(f: Foo) {}
fun <T> asGeneric(x: T) {}
fun asInterface(i: I) {}
fun asNullable(i: Foo?) {}

fun <T> id(x: T): T = x

fun main() {
    val f = Foo(42) 
    
    asInline(f)    // unboxed: used as Foo itself
    asGeneric(f)   // boxed: used as generic type T
    asInterface(f) // boxed: used as type I
    asNullable(f)  // boxed: used as Foo?, which is different from Foo
    
    // below, 'f' first is boxed (while being passed to 'id') and then unboxed (when returned from 'id') 
    // In the end, 'c' contains unboxed representation (just '42'), as 'f' 
    val c = id(f)  
}
```

因为内联类可以表示为底层值和封装器，所以 [引用相等性](equality.md#referential-equality) 对它们来说是毫无意义的，因此是被禁止的。

内联类还可以将泛型类型参数作为底层类型。在这种情况下，编译器将其映射到 `Any?` 或通常映射到类型参数的上界。

```kotlin
@JvmInline
value class UserId<T>(val value: T)

fun compute(s: UserId<String>) {} // compiler generates fun compute-<hashcode>(s: Any?)
```

### 名字修饰

由于内联类被编译为它们的底层类型，这可能导致各种模糊的错误，例如意外的平台签名冲突：

```kotlin
@JvmInline
value class UInt(val x: Int)

// Represented as 'public final void compute(int x)' on the JVM
fun compute(x: Int) { }

// Also represented as 'public final void compute(int x)' on the JVM!
fun compute(x: UInt) { }
```

为了缓解此类问题，使用内联类的函数会被 _名字修饰_，即在函数名称中添加一些稳定的哈希码。因此，`fun compute(x: UInt)` 将表示为 `public final void compute-<hashcode>(int x)`，这解决了冲突问题。

### 从 Java 代码调用

你可以从 Java 代码中调用接受内联类的函数。为此，你需要手动禁用名字修饰：在函数声明前添加 `@JvmName` 注解：

```kotlin
@JvmInline
value class UInt(val x: Int)

fun compute(x: Int) { }

@JvmName("computeUInt")
fun compute(x: UInt) { }
```

默认情况下，Kotlin 使用**未装箱的表示**编译内联类，这使得它们难以从 Java 访问。要了解如何将内联类编译为可从 Java 访问的**装箱表示**，请参见 [从 Java 调用 Kotlin](java-to-kotlin-interop.md#inline-value-classes) 指南。

## 内联类与类型别名

初看起来，内联类与 [类型别名](type-aliases.md) 非常相似。确实，两者似乎都引入了一个新类型，并且在运行时都将表示为底层类型。

然而，关键区别在于类型别名与其底层类型（以及具有相同底层类型的其他类型别名）是 *赋值兼容的*，而内联类则不是。

换句话说，内联类引入了一个真正 _新_ 的类型，这与类型别名只为现有类型引入一个替代名称（别名）不同：

```kotlin
typealias NameTypeAlias = String

@JvmInline
value class NameInlineClass(val s: String)

fun acceptString(s: String) {}
fun acceptNameTypeAlias(n: NameTypeAlias) {}
fun acceptNameInlineClass(p: NameInlineClass) {}

fun main() {
    val nameAlias: NameTypeAlias = ""
    val nameInlineClass: NameInlineClass = NameInlineClass("")
    val string: String = ""

    acceptString(nameAlias) // OK: 传递别名而非底层类型
    acceptString(nameInlineClass) // 不正常：无法传递内联类而非底层类型

    // 反之亦然：
    acceptNameTypeAlias(string) // OK: 传递底层类型而非别名
    acceptNameInlineClass(string) // 不正常：无法传递底层类型而非内联类
}
```

## 内联类与委托

允许通过将内联类的内联值委托给接口来实现：

```kotlin
interface MyInterface {
    fun bar()
    fun foo() = "foo"
}

@JvmInline
value class MyInterfaceWrapper(val myInterface: MyInterface) : MyInterface by myInterface

fun main() {
    val my = MyInterfaceWrapper(object : MyInterface {
        override fun bar() {
            // body
        }
    })
    println(my.foo()) // prints "foo"
}