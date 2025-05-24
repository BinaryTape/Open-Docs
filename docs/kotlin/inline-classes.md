---
title: "内联值类 (Inline value classes)"
---
有时，将一个值包装在一个类中以创建一个更具领域特定性的类型是很有用的。然而，由于额外的堆分配，这会引入运行时开销。此外，如果被包装的类型是原始类型，性能损失会很显著，因为原始类型通常会被运行时大量优化，而它们的包装器则不会得到任何特殊处理。

为了解决这些问题，Kotlin 引入了一种特殊的类，称为 _内联类_ (inline class)。内联类是 [基于值的类](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes) 的一个子集。它们没有标识，只能保存值。

要声明一个内联类，请在类名之前使用 `value` 修饰符：

```kotlin
value class Password(private val s: String)
```

要为 JVM 后端声明一个内联类，请在类声明之前使用 `value` 修饰符以及 `@JvmInline` 注解：

```kotlin
// For JVM backends
@JvmInline
value class Password(private val s: String)
```

一个内联类必须在主构造函数中初始化一个单独的属性。在运行时，内联类的实例将使用这个单独的属性来表示（请参阅[下面](#representation)关于运行时表示的详细信息）：

```kotlin
// 没有发生 'Password' 类的实际实例化
// 在运行时，'securePassword' 只包含 'String'
val securePassword = Password("Don't try this in production") 
```

这是内联类的主要特性，这也启发了 *inline* 这个名字：类的数据被 *内联* 到它的用法中（类似于 [内联函数](inline-functions) 的内容如何内联到调用站点）。

## 成员

内联类支持常规类的某些功能。特别是，它们允许声明属性和函数，拥有一个 `init` 块和[二级构造函数](classes#secondary-constructors)：

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
    name1.greet() // `greet()` 函数作为静态方法被调用
    println(name2.length) // 属性 getter 作为静态方法被调用
}
```

内联类属性不能有 [backing fields](properties#backing-fields)（幕后字段）。它们只能有简单的可计算属性（没有 `lateinit`/委托属性）。

## 继承

内联类允许从接口继承：

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
    println(name.prettyPrint()) // 仍然作为静态方法被调用
}
```

禁止内联类参与类层次结构。这意味着内联类不能扩展其他类，并且始终是 `final` 的。

## 表示

在生成的代码中，Kotlin 编译器为每个内联类保留一个 *包装器* (wrapper)。内联类实例可以在运行时表示为包装器或底层类型。这类似于 `Int` 如何 [表示](numbers#boxing-and-caching-numbers-on-the-java-virtual-machine) 为原始类型 `int` 或包装器 `Integer`。

Kotlin 编译器将优先使用底层类型而不是包装器，以生成性能最高和优化过的代码。但是，有时有必要保留包装器。根据经验，每当内联类用作另一种类型时，它们都会被装箱 (boxed)。

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
    
    asInline(f)    // 未装箱：用作 Foo 本身
    asGeneric(f)   // 已装箱：用作泛型类型 T
    asInterface(f) // 已装箱：用作类型 I
    asNullable(f)  // 已装箱：用作 Foo?，这与 Foo 不同
    
    // 下面，'f' 首先被装箱（当传递给 'id' 时），然后被拆箱（当从 'id' 返回时）
    // 最后，'c' 包含未装箱的表示形式（只有 '42'），就像 'f' 一样
    val c = id(f)  
}
```

因为内联类可以表示为底层值和包装器，所以 [引用相等](equality#referential-equality) 对它们来说是毫无意义的，因此是被禁止的。

内联类还可以有一个泛型类型参数作为底层类型。在这种情况下，编译器将其映射到 `Any?`，或者通常映射到类型参数的上界。

```kotlin
@JvmInline
value class UserId<T>(val value: T)

fun compute(s: UserId<String>) {} // 编译器生成 fun compute-<hashcode>(s: Any?)
```

### Mangling（名称修饰）

由于内联类被编译为其底层类型，因此可能会导致各种模糊的错误，例如意外的平台签名冲突：

```kotlin
@JvmInline
value class UInt(val x: Int)

// 在 JVM 上表示为 'public final void compute(int x)'
fun compute(x: Int) { }

// 也在 JVM 上表示为 'public final void compute(int x)'!
fun compute(x: UInt) { }
```

为了缓解这些问题，使用内联类的函数会通过在函数名称中添加一些稳定的哈希码来进行 _名称修饰_ (mangled)。因此，`fun compute(x: UInt)` 将表示为 `public final void compute-<hashcode>(int x)`，这解决了冲突问题。

### 从 Java 代码调用

你可以从 Java 代码调用接受内联类的函数。为此，你应该手动禁用名称修饰：在函数声明之前添加 `@JvmName` 注解：

```kotlin
@JvmInline
value class UInt(val x: Int)

fun compute(x: Int) { }

@JvmName("computeUInt")
fun compute(x: UInt) { }
```

## 内联类 vs 类型别名

乍一看，内联类似乎与[类型别名](type-aliases)非常相似。 事实上，两者似乎都引入了一个新类型，并且在运行时都将表示为底层类型。

然而，关键的区别在于类型别名与其底层类型（以及具有相同底层类型的其他类型别名）是 *赋值兼容的* (assignment-compatible)，而内联类则不是。

换句话说，内联类引入了一个真正 *新的* 类型，与类型别名相反，类型别名仅为现有类型引入一个替代名称（别名）：

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

    acceptString(nameAlias) // OK：传递别名而不是底层类型
    acceptString(nameInlineClass) // Not OK：不能传递内联类而不是底层类型

    // 反之亦然：
    acceptNameTypeAlias(string) // OK：传递底层类型而不是别名
    acceptNameInlineClass(string) // Not OK：不能传递底层类型而不是内联类
}
```

## 内联类和委托

允许通过委托给内联类的内联值来实现接口：

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