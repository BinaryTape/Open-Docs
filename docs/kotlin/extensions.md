[//]: # (title: 扩展)

Kotlin 提供了为类或接口扩展新功能的能力，而无需继承类或使用例如 _装饰器_ 等设计模式。这是通过称为 _扩展_ 的特殊声明来完成的。

例如，你可以为无法修改的第三方库中的类或接口编写新函数。这些函数可以像原始类的方法一样以常规方式调用。这种机制称为 _扩展函数_。还有 _扩展属性_，允许你为现有类定义新属性。

## 扩展函数

要声明一个扩展函数，在其名称前加上 _接收者类型_，它指的是被扩展的类型。下面为 `MutableList<Int>` 添加了一个 `swap` 函数：

```kotlin
fun MutableList<Int>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this' corresponds to the list
    this[index1] = this[index2]
    this[index2] = tmp
}
```

扩展函数内的 `this` 关键字对应于接收者对象（点号前传入的对象）。现在，你可以在任何 `MutableList<Int>` 上调用此类函数：

```kotlin
val list = mutableListOf(1, 2, 3)
list.swap(0, 2) // 'this' inside 'swap()' will hold the value of 'list'
```

这个函数对任何 `MutableList<T>` 都有意义，你可以使其泛型化：

```kotlin
fun <T> MutableList<T>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this' corresponds to the list
    this[index1] = this[index2]
    this[index2] = tmp
}
```

你需要在函数名称前声明泛型类型参数，以便在接收者类型表达式中使用它。有关泛型的更多信息，请参阅 [泛型函数](generics.md)。

## 扩展是 _静态_ 解析的

扩展实际上不会修改它们所扩展的类。通过定义扩展，你并非向类中插入新成员，而只是使新函数能够通过点语法在此类型的变量上调用。

扩展函数是 _静态地_ 分派的。因此，哪个扩展函数被调用在编译时就已根据接收者类型确定。例如：

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

这个例子打印 _Shape_，因为被调用的扩展函数仅取决于参数 `s` 的声明类型，即 `Shape` 类。

如果一个类有一个成员函数，并且定义了一个具有相同接收者类型、相同名称且适用于给定参数的扩展函数，那么 _成员始终优先_。例如：

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

此代码打印 _Class method_。

然而，扩展函数完全可以重载与成员函数同名但签名不同的函数：

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

## 可空接收者

请注意，扩展可以定义为可空接收者类型。即使其值为 `null`，这些扩展也可以在对象变量上调用。如果接收者是 `null`，那么 `this` 也是 `null`。因此，在定义可空接收者类型的扩展时，我们建议在函数体内部执行 `this == null` 检查，以避免编译器错误。

在 Kotlin 中，你可以无需检查 `null` 而直接调用 `toString()`，因为该检查已在扩展函数内部发生：

```kotlin
fun Any?.toString(): String {
    if (this == null) return "null"
    // After the null check, 'this' is autocast to a non-nullable type, so the toString() below
    // resolves to the member function of the Any class
    return toString()
}
```

## 扩展属性

Kotlin 支持扩展属性，就像支持函数一样：

```kotlin
val <T> List<T>.lastIndex: Int
    get() = size - 1
```

> 由于扩展实际上并未向类中插入成员，因此扩展属性无法有效拥有 [幕后字段](properties.md#backing-fields)。这就是为什么 _扩展属性不允许有初始化器_。它们的行为只能通过显式提供 getter/setter 来定义。
>
{style="note"}

示例：

```kotlin
val House.number = 1 // error: initializers are not allowed for extension properties
```

## 伴生对象扩展

如果一个类定义了 [伴生对象](object-declarations.md#companion-objects)，你也可以为该伴生对象定义扩展函数和属性。就像伴生对象的常规成员一样，它们可以仅使用类名作为限定符来调用：

```kotlin
class MyClass {
    companion object { }  // will be called "Companion"
}

fun MyClass.Companion.printCompanion() { println("companion") }

fun main() {
    MyClass.printCompanion()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 扩展的作用域

在大多数情况下，你会在顶层定义扩展，直接在包下：

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

有关更多信息，请参阅 [导入](packages.md#imports)。

## 将扩展声明为成员

你可以在另一个类中为一个类声明扩展。在这样的扩展内部，存在多个 _隐式接收者_ —— 可以在不使用限定符的情况下访问其成员的对象。声明扩展的类的实例称为 _分发接收者_ (dispatch receiver)，而扩展方法接收者类型的实例称为 _扩展接收者_ (extension receiver)。

```kotlin
class Host(val hostname: String) {
    fun printHostname() { print(hostname) }
}

class Connection(val host: Host, val port: Int) {
    fun printPort() { print(port) }

    fun Host.printConnectionString() {
        printHostname()   // calls Host.printHostname()
        print(":")
        printPort()   // calls Connection.printPort()
    }

    fun connect() {
        /*...*/
        host.printConnectionString()   // calls the extension function
    }
}

fun main() {
    Connection(Host("kotl.in"), 443).connect()
    //Host("kotl.in").printConnectionString()  // error, the extension function is unavailable outside Connection
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

如果分发接收者和扩展接收者的成员之间存在名称冲突，扩展接收者优先。要引用分发接收者的成员，你可以使用 [限定 `this` 语法](this-expressions.md#qualified-this)。

```kotlin
class Connection {
    fun Host.getConnectionString() {
        toString()         // calls Host.toString()
        this@Connection.toString()  // calls Connection.toString()
    }
}
```

声明为成员的扩展可以声明为 `open` 并在子类中重写。这意味着此类函数的调度对于分发接收者类型是虚拟的，但对于扩展接收者类型是静态的。

```kotlin
open class Base { }

class Derived : Base() { }

open class BaseCaller {
    open fun Base.printFunctionInfo() {
        println("Base extension function in BaseCaller")
    }

    open fun Derived.printFunctionInfo() {
        println("Derived extension function in BaseCaller")
    }

    fun call(b: Base) {
        b.printFunctionInfo()   // call the extension function
    }
}

class DerivedCaller: BaseCaller() {
    override fun Base.printFunctionInfo() {
        println("Base extension function in DerivedCaller")
    }

    override fun Derived.printFunctionInfo() {
        println("Derived extension function in DerivedCaller")
    }
}

fun main() {
    BaseCaller().call(Base())   // "Base extension function in BaseCaller"
    DerivedCaller().call(Base())  // "Base extension function in DerivedCaller" - dispatch receiver is resolved virtually
    DerivedCaller().call(Derived())  // "Base extension function in DerivedCaller" - extension receiver is resolved statically
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 关于可见性的注意事项

扩展使用与在相同作用域中声明的常规函数相同的 [可见性修饰符](visibility-modifiers.md)。例如：

*   在文件顶层声明的扩展可以访问同一文件中的其他 `private` 顶层声明。
*   如果扩展在其接收者类型之外声明，则无法访问接收者的 `private` 或 `protected` 成员。