---
title: 扩展
---
Kotlin 提供了使用新功能扩展类或接口的能力，而无需从类继承或使用诸如 _Decorator_ 这样的设计模式。这是通过称为 _扩展（extensions）_ 的特殊声明来完成的。

例如，你可以为一个你无法修改的第三方库中的类或接口编写新的函数。这些函数可以像原始类的方法一样以通常的方式调用。这种机制称为 _扩展函数（extension function）_。 还有 _扩展属性（extension properties）_， 允许你为现有类定义新的属性。

## 扩展函数

要声明一个扩展函数，在其名称前加上一个 _接收者类型（receiver type）_，它指的是被扩展的类型。
以下代码向 `MutableList<Int>` 添加了一个 `swap` 函数：

```kotlin
fun MutableList<Int>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this' 对应于列表
    this[index1] = this[index2]
    this[index2] = tmp
}
```

扩展函数中的 `this` 关键字对应于接收者对象（在点之前传递的对象）。
现在，你可以在任何 `MutableList<Int>` 上调用这样的函数：

```kotlin
val list = mutableListOf(1, 2, 3)
list.swap(0, 2) // 'swap()' 内部的 'this' 将保存 'list' 的值
```

这个函数对于任何 `MutableList<T>` 都有意义，你可以把它变成泛型：

```kotlin
fun <T> MutableList<T>.swap(index1: Int, index2: Int) {
    val tmp = this[index1] // 'this' 对应于列表
    this[index1] = this[index2]
    this[index2] = tmp
}
```

你需要在函数名称之前声明泛型类型参数，使其在接收者类型表达式中可用。
有关泛型的更多信息，请参见 [泛型函数](generics)。

## 扩展是 _静态_ 解析的

扩展实际上并没有修改它们扩展的类。通过定义一个扩展，你并没有向类中插入新的成员，只是让新的函数可以通过点符号在变量上调用。

扩展函数是 _静态_ 分发的。因此，调用哪个扩展函数在编译时就已经知道了，这是基于接收者类型的。例如：

```kotlin
fun main() {

    open class Shape
    class Rectangle: Shape()
    
    fun Shape.getName() = "Shape"
    fun Rectangle.getName() = "Rectangle"
    
    fun printClassName(s: Shape) {
        println(s.getName())
    }
    
    printClassName(Rectangle())

}
```

这个例子打印 _Shape_，因为调用的扩展函数只取决于参数 `s` 的声明类型，即 `Shape` 类。

如果一个类有一个成员函数，并且定义了一个具有相同接收者类型、相同名称并且适用于给定参数的扩展函数，那么 _成员总是胜出_。例如：

```kotlin
fun main() {

    class Example {
        fun printFunctionType() { println("Class method") }
    }
    
    fun Example.printFunctionType() { println("Extension function") }
    
    Example().printFunctionType()

}
```

这段代码打印 _Class method_。

但是，扩展函数重载具有相同名称但签名不同的成员函数是完全可以的：

```kotlin
fun main() {

    class Example {
        fun printFunctionType() { println("Class method") }
    }
    
    fun Example.printFunctionType(i: Int) { println("Extension function #$i") }
    
    Example().printFunctionType(1)

}
```

## 可空接收者 (Nullable receiver)

请注意，扩展可以使用可空接收者类型来定义。 这些扩展可以对对象变量调用，即使它的值为 null。 如果接收者为 `null`，则 `this` 也为 `null`。 因此，当定义具有可空接收者类型的扩展时，我们建议在函数体内部执行 `this == null` 检查，以避免编译器错误。

你可以在 Kotlin 中调用 `toString()` 而无需检查 `null`，因为该检查已经在扩展函数内部进行：

```kotlin
fun Any?.toString(): String {
    if (this == null) return "null"
    // 在 null 检查之后，'this' 会自动转换为非空类型，因此下面的 toString()
    // 解析为 Any 类的成员函数
    return toString()
}
```

## 扩展属性

Kotlin 支持扩展属性，就像它支持函数一样：

```kotlin
val <T> List<T>.lastIndex: Int
    get() = size - 1
```

:::note
由于扩展实际上并没有将成员插入到类中，因此扩展属性没有有效的方法来拥有一个 [幕后字段](properties#backing-fields)。 这就是为什么 _扩展属性不允许初始化器_。 它们的行为只能通过显式提供 getters/setters 来定义。

:::

示例：

```kotlin
val House.number = 1 // 错误：扩展属性不允许初始化器
```

## 伴生对象扩展

如果一个类定义了一个 [伴生对象](object-declarations#companion-objects)，你也可以为伴生对象定义扩展函数和属性。 与伴生对象的常规成员一样，它们只能使用类名作为限定符来调用：

```kotlin
class MyClass {
    companion object { }  // 将被称为 "Companion"
}

fun MyClass.Companion.printCompanion() { println("companion") }

fun main() {
    MyClass.printCompanion()
}
```

## 扩展的作用域

在大多数情况下，你在顶层（直接在包下）定义扩展：

```kotlin
package org.example.declarations

fun List<String>.getLongestString() { /*...*/}
```

要在其声明包之外使用扩展，请在调用位置导入它：

```kotlin
package org.example.usage

import org.example.declarations.getLongestString

fun main() {
    val list = listOf("red", "green", "blue")
    list.getLongestString()
}
```

有关更多信息，请参见 [导入](packages#imports)。

## 将扩展声明为成员

你可以在一个类中为另一个类声明扩展。 在这样的扩展中，存在多个 _隐式接收者（implicit receivers）_ - 可以访问其成员而无需限定符的对象。 在其中声明扩展的类的实例称为 _分发接收者（dispatch receiver）_，扩展方法的接收者类型的实例称为 _扩展接收者（extension receiver）_。

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
        host.printConnectionString()   // 调用扩展函数
    }
}

fun main() {
    Connection(Host("kotl.in"), 443).connect()
    //Host("kotl.in").printConnectionString()  // 错误，扩展函数在 Connection 外部不可用
}
```

如果在分发接收者和扩展接收者的成员之间存在名称冲突，则扩展接收者优先。 要引用分发接收者的成员，可以使用 [限定的 `this` 语法](this-expressions#qualified-this)。

```kotlin
class Connection {
    fun Host.getConnectionString() {
        toString()         // 调用 Host.toString()
        this@Connection.toString()  // 调用 Connection.toString()
    }
}
```

声明为成员的扩展可以声明为 `open` 并在子类中被覆盖。 这意味着对于分发接收者类型，此类函数的分配是虚拟的，但对于扩展接收者类型，它是静态的。

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
        b.printFunctionInfo()   // 调用扩展函数
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
    DerivedCaller().call(Base())  // "Base extension function in DerivedCaller" - 分发接收者是虚拟解析的
    DerivedCaller().call(Derived())  // "Base extension function in DerivedCaller" - 扩展接收者是静态解析的
}
```

## 关于可见性的说明

扩展使用与在相同作用域中声明的常规函数相同的 [可见性修饰符](visibility-modifiers)。
例如：

* 在文件的顶层声明的扩展可以访问同一文件中其他 `private` 顶层声明。
* 如果在接收者类型之外声明了扩展，则它无法访问接收者的 `private` 或 `protected` 成员。