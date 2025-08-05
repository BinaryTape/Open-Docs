[//]: # (title: 扩展)

Kotlin 提供了在不继承类或不使用诸如 _Decorator_ 之类的设计模式的情况下，扩展类或接口以增加新功能的能力。这是通过称作 _扩展_ 的特殊声明来完成的。

例如，你可以为你无法修改的第三方库中的类或接口编写新函数。这些函数可以像调用原类的方法一样正常调用。这种机制被称为 _扩展函数_。还有 _扩展属性_，允许你为现有类定义新属性。

## 扩展函数

要声明一个扩展函数，请在其名称前加上一个 _接收者类型_，它指被扩展的类型。以下为 `MutableList<Int>` 添加了一个 `swap` 函数：

```kotlin
fun MutableList<Int>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this' 对应于该 list
    this[index1] = this[index2]
    this[index2] = tmp
}
```

扩展函数内部的 `this` 关键字对应于接收者对象（点号前传递的对象）。现在，你可以在任何 `MutableList<Int>` 上调用此类函数：

```kotlin
val list = mutableListOf(1, 2, 3)
list.swap(0, 2) // `swap()` 内部的 `this` 将持有 `list` 的值
```

这个函数适用于任何 `MutableList<T>`，你可以将其泛型化：

```kotlin
fun <T> MutableList<T>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this' 对应于该 list
    this[index1] = this[index2]
    this[index2] = tmp
}
```

你需要将泛型类型形参声明在函数名称之前，以便在接收者类型表达式中使用它。关于泛型的更多信息，请参见 [泛型函数](generics.md)。

## 扩展是 _静态_ 解析的

扩展实际上并不修改它们所扩展的类。通过定义扩展，你不是将新成员插入到类中，而只是让这类类型的变量可以通过点符号调用新函数。

扩展函数是 _静态_ 分派的。因此，在编译期，基于接收者类型，就能知道哪个扩展函数将被调用。例如：

```kotlin
fun main() {
//sampleStart
    open class Shape
    class Rectangle: Shape()
    
    fun Shape.getName() = "Shape"
    fun Rectangle.getName() = "Rectangle"
    
    fun printClassName(s: Shape) {
        println(s.getName())
    }
    
    printClassName(Rectangle())
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

此示例打印 _Shape_，因为被调用的扩展函数仅取决于形参 `s` 的声明类型，即 `Shape` 类。

如果一个类具有成员函数，并且定义了一个具有相同接收者类型、相同名称且适用于给定实参的扩展函数，则 _成员函数总是优先_。例如：

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Class method") }
    }
    
    fun Example.printFunctionType() { println("Extension function") }
    
    Example().printFunctionType()
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

这段代码打印 _Class method_。

然而，扩展函数重载（overload）具有相同名称但不同签名的成员函数是完全允许的：

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Class method") }
    }
    
    fun Example.printFunctionType(i: Int) { println("Extension function #$i") }
    
    Example().printFunctionType(1)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 可空的接收者

请注意，扩展可以定义为可空的接收者类型。即使对象变量的值为 `null`，也可以在其上调用这些扩展。如果接收者是 `null`，那么 `this` 也将是 `null`。因此，在定义一个可空接收者类型的扩展时，我们建议在函数体内部执行 `this == null` 检测，以避免编译期错误。

你可以在 Kotlin 中调用 `toString()` 而无需检测 `null`，因为该检测已在扩展函数内部发生：

```kotlin
fun Any?.toString(): String {
    if (this == null) return "null"
    // 在 `null` 检测后，`this` 会自动转型为非空类型，因此下面的 `toString()` 会解析为 `Any` 类的成员函数。
    return toString()
}
```

## 扩展属性

Kotlin 支持扩展属性，就像它支持函数一样：

```kotlin
val <T> List<T>.lastIndex: Int
    get() = size - 1
```

> 由于扩展实际上并未将成员插入到类中，因此扩展属性无法高效地拥有 [幕后字段](properties.md#backing-fields)。这就是为什么 _扩展属性不允许有初始化器_。它们的行为只能通过显式提供 getter/setter 来定义。
>
{style="note"}

例如：

```kotlin
val House.number = 1 // 错误：扩展属性不允许有初始化器
```

## 伴生对象扩展

如果一个类定义了 [伴生对象](object-declarations.md#companion-objects)，你也可以为该伴生对象定义扩展函数和属性。就像伴生对象的常规成员一样，它们只需使用类名作为限定符即可调用：

```kotlin
class MyClass {
    companion object { }  // 将被称作 “Companion”
}

fun MyClass.Companion.printCompanion() { println("companion") }

fun main() {
    MyClass.printCompanion()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 扩展的作用域

在大多数情况下，你会在顶层，即包之下直接定义扩展：

```kotlin
package org.example.declarations

fun List<String>.getLongestString() { /*...*/}
```

要在其声明包之外使用扩展，请在调用处导入它：

```kotlin
package org.example.usage

import org.example.declarations.getLongestString

fun main() {
    val list = listOf("red", "green", "blue")
    list.getLongestString()
}
```

关于 [导入](packages.md#imports) 的更多信息，请参见。

## 将扩展声明为成员

你可以在一个类内部声明另一个类的扩展。在此类扩展中，存在多个 _隐式接收者_ —— 它们的成员无需限定符即可访问的对象。声明扩展的类的实例被称为 _分派接收者_，而扩展方法接收者类型的实例则被称为 _扩展接收者_。

```kotlin
class Host(val hostname: String) {
    fun printHostname() { print(hostname) }
}

class Connection(val host: Host, val port: Int) {
    fun printPort() { print(port) }

    fun Host.printConnectionString() {
        printHostname()   // 调用 Host.printHostname()
        print(":")
        printPort()   // 调用 Connection.printPort()
    }

    fun connect() {
        /*...*/
        host.printConnectionString()   // 调用该扩展函数
    }
}

fun main() {
    Connection(Host("kotl.in"), 443).connect()
    //Host("kotl.in").printConnectionString()  // 错误，该扩展函数在 Connection 外部不可用
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

当分派接收者和扩展接收者的成员之间发生名称冲突时，扩展接收者优先。要引用分派接收者的成员，你可以使用 [限定的 `this` 语法](this-expressions.md#qualified-this)。

```kotlin
class Connection {
    fun Host.getConnectionString() {
        toString()         // 调用 Host.toString()
        this@Connection.toString()  // 调用 Connection.toString()
    }
}
```

声明为成员的扩展可以声明为 `open` 并在子类中覆盖。这意味着此类函数的分派（dispatch）对于分派接收者类型是虚拟的，但对于扩展接收者类型是静态的。

```kotlin
open class Base { }

class Derived : Base() { }

open class BaseCaller {
    open fun Base.printFunctionInfo() {
        println("BaseCaller 中的 Base 扩展函数")
    }

    open fun Derived.printFunctionInfo() {
        println("BaseCaller 中的 Derived 扩展函数")
    }

    fun call(b: Base) {
        b.printFunctionInfo()   // 调用扩展函数
    }
}

class DerivedCaller: BaseCaller() {
    override fun Base.printFunctionInfo() {
        println("DerivedCaller 中的 Base 扩展函数")
    }

    override fun Derived.printFunctionInfo() {
        println("DerivedCaller 中的 Derived 扩展函数")
    }
}

fun main() {
    BaseCaller().call(Base())   // "BaseCaller 中的 Base 扩展函数"
    DerivedCaller().call(Base())  // "DerivedCaller 中的 Base 扩展函数" - 分派接收者是虚拟解析的
    DerivedCaller().call(Derived())  // "DerivedCaller 中的 Base 扩展函数" - 扩展接收者是静态解析的
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 可见性说明

扩展利用与在相同作用域中声明的常规函数相同的 [可见性修饰符](visibility-modifiers.md)。例如：

*   在一个文件的顶层声明的扩展可以访问同一文件中其他 `private` 顶层声明。
*   如果扩展在其接收者类型之外声明，它无法访问接收者的 `private` 或 `protected` 成员。