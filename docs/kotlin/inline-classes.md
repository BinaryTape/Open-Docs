[//]: # (title: 内联值类)

有时将值包装在一个类中以创建更具领域特定 (domain-specific) 的类型会很有用。然而，这会因为额外的堆分配而引入运行时开销。此外，如果被包装的类型是原始类型，性能损失会很显著，因为原始类型通常由运行时进行大量优化，而它们的包装器则得不到任何特殊处理。

为了解决这些问题，Kotlin 引入了一种特殊的类，称为 _内联类_ (inline class)。内联类是 [基于值的类](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md) 的一个子集。它们没有标识 (identity)，并且只能持有值。

要声明一个内联类，请在类名前使用 `value` 修饰符：

```kotlin
value class Password(private val s: String)
```

对于 JVM 后端，要在类声明前使用 `value` 修饰符以及 `@JvmInline` 注解来声明一个内联类：

```kotlin
// For JVM backends
@JvmInline
value class Password(private val s: String)
```

内联类必须在主构造函数中初始化一个单一属性。在运行时，内联类的实例将使用这个单一属性来表示（详见 [下文](#representation) 关于运行时表示的说明）：

```kotlin
// No actual instantiation of class 'Password' happens
// At runtime 'securePassword' contains just 'String'
val securePassword = Password("Don't try this in production") 
```

这是内联类的主要特性，也是 *inline* (内联) 这个名字的由来：类的数据被 *内联* 到其使用处（类似于 [内联函数](inline-functions.md) 的内容被内联到调用站点）。

## 成员

内联类支持常规类的一些功能。具体而言，它们可以声明属性和函数，拥有 `init` 块和 [次构造函数](classes.md#secondary-constructors)：

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

内联类属性不能有 [幕后字段](properties.md#backing-fields)。它们只能拥有简单的可计算属性（没有 `lateinit`/委托属性）。

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

在生成的代码中，Kotlin 编译器为每个内联类保留一个 *包装器* (wrapper)。内联类实例在运行时可以表示为包装器，也可以表示为底层类型。这类似于 `Int` 如何 [表示](numbers.md#boxing-and-caching-numbers-on-the-java-virtual-machine) 为原始的 `int` 或包装器 `Integer`。

Kotlin 编译器会优先使用底层类型而不是包装器，以生成性能最佳和最优化的代码。然而，有时有必要保留包装器。根据经验法则，内联类在作为另一种类型使用时会被装箱 (boxed)。

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

由于内联类既可以表示为底层值，也可以表示为包装器，因此对它们而言，[引用相等](equality.md#referential-equality) 是没有意义的，因此是被禁止的。

内联类也可以将泛型类型参数作为底层类型。在这种情况下，编译器会将其映射到 `Any?`，或者通常映射到类型参数的上限。

```kotlin
@JvmInline
value class UserId<T>(val value: T)

fun compute(s: UserId<String>) {} // compiler generates fun compute-<hashcode>(s: Any?)
```

### 混淆

由于内联类被编译为它们的底层类型，这可能导致各种模糊的错误，例如意外的平台签名冲突：

```kotlin
@JvmInline
value class UInt(val x: Int)

// Represented as 'public final void compute(int x)' on the JVM
fun compute(x: Int) { }

// Also represented as 'public final void compute(int x)' on the JVM!
fun compute(x: UInt) { }
```

为了缓解此类问题，使用内联类的函数会通过在函数名称中添加一些稳定的哈希码来 _混淆_ (mangle)。因此，`fun compute(x: UInt)` 将被表示为 `public final void compute-<hashcode>(int x)`，这解决了冲突问题。

### 从 Java 代码调用

您可以从 Java 代码中调用接受内联类的函数。为此，您应该手动禁用混淆 (mangling)：在函数声明前添加 `@JvmName` 注解：

```kotlin
@JvmInline
value class UInt(val x: Int)

fun compute(x: Int) { }

@JvmName("computeUInt")
fun compute(x: UInt) { }
```

## 内联类与类型别名对比

乍一看，内联类与 [类型别名](type-aliases.md) 似乎非常相似。事实上，两者似乎都引入了一种新类型，并且在运行时都将表示为底层类型。

然而，关键区别在于类型别名与其底层类型（以及与其他具有相同底层类型的类型别名）是 *赋值兼容* 的，而内联类则不是。

换句话说，内联类引入了一种真正的 _新_ 类型，这与类型别名不同，类型别名仅为现有类型引入了一个替代名称（别名）：

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

    acceptString(nameAlias) // OK: pass alias instead of underlying type
    acceptString(nameInlineClass) // Not OK: can't pass inline class instead of underlying type

    // And vice versa:
    acceptNameTypeAlias(string) // OK: pass underlying type instead of alias
    acceptNameInlineClass(string) // Not OK: can't pass underlying type instead of inline class
}
```

## 内联类与委托

内联类中通过委托给内联值来实现接口是允许的：

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
```