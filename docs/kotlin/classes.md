---
title: "类 (Classes)"
---
Kotlin 中的类使用关键字 `class` 声明：

```kotlin
class Person { /*...*/ }
```

类的声明包含类名、类头（指定其类型参数、主构造函数以及其他内容）和用大括号括起来的类体。类头和类体都是可选的；如果类没有类体，则可以省略大括号。

```kotlin
class Empty
```

## 构造函数 (Constructors)

Kotlin 中的类有一个_主构造函数 (primary constructor)_，并且可能有一个或多个_二级构造函数 (secondary constructor)_。主构造函数在类头中声明，它位于类名和可选类型参数之后。

```kotlin
class Person constructor(firstName: String) { /*...*/ }
```

如果主构造函数没有任何注解或可见性修饰符，则可以省略 `constructor` 关键字：

```kotlin
class Person(firstName: String) { /*...*/ }
```

主构造函数初始化类实例及其属性。类头不能包含任何可运行的代码。如果要在对象创建期间运行一些代码，请在类体中使用_初始化块 (initializer blocks)_。初始化块使用 `init` 关键字声明，后跟大括号。将要运行的任何代码写入大括号内。

在初始化实例期间，初始化块按照它们在类体中出现的顺序执行，与属性初始化器交错执行：

```kotlin

class InitOrderDemo(name: String) {
    val firstProperty = "First property: $name".also(::println)
    
    init {
        println("First initializer block that prints $name")
    }
    
    val secondProperty = "Second property: ${name.length}".also(::println)
    
    init {
        println("Second initializer block that prints ${name.length}")
    }
}

fun main() {
    InitOrderDemo("hello")
}
```

主构造函数参数可以在初始化块中使用。它们也可以在类体中声明的属性初始化器中使用：

```kotlin
class Customer(name: String) {
    val customerKey = name.uppercase()
}
```

Kotlin 提供了一种简洁的语法，用于声明属性并从主构造函数初始化它们：

```kotlin
class Person(val firstName: String, val lastName: String, var age: Int)
```

此类声明还可以包括类属性的默认值：

```kotlin
class Person(val firstName: String, val lastName: String, var isEmployed: Boolean = true)
```

在声明类属性时，可以使用[尾随逗号](coding-conventions#trailing-commas)：

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    var age: Int, // 尾随逗号 (trailing comma)
) { /*...*/ }
```

与常规属性非常相似，在主构造函数中声明的属性可以是可变的 (`var`) 或只读的 (`val`)。

如果构造函数具有注解或可见性修饰符，则需要 `constructor` 关键字，并且修饰符位于其前面：

```kotlin
class Customer public @Inject constructor(name: String) { /*...*/ }
```

了解更多关于[可见性修饰符](visibility-modifiers#constructors)的信息。

### 二级构造函数 (Secondary constructors)

类还可以声明_二级构造函数 (secondary constructors)_，这些构造函数以 `constructor` 为前缀：

```kotlin
class Person(val pets: MutableList<Pet> = mutableListOf())

class Pet {
    constructor(owner: Person) {
        owner.pets.add(this) // 将此宠物添加到其所有者的宠物列表中
    }
}
```

如果该类有一个主构造函数，则每个二级构造函数都需要委托给主构造函数，可以直接委托，也可以通过另一个或多个二级构造函数间接委托。委托给同一类的另一个构造函数使用 `this` 关键字完成：

```kotlin
class Person(val name: String) {
    val children: MutableList<Person> = mutableListOf()
    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }
}
```

初始化块中的代码实际上成为主构造函数的一部分。对主构造函数的委托发生在访问二级构造函数的第一个语句的时刻，因此在二级构造函数的正文之前执行所有初始化块和属性初始化器中的代码。

即使类没有主构造函数，委托仍然隐式发生，并且初始化块仍然执行：

```kotlin

class Constructors {
    init {
        println("Init block")
    }

    constructor(i: Int) {
        println("Constructor $i")
    }
}

fun main() {
    Constructors(1)
}
```

如果一个非抽象类没有声明任何构造函数（主构造函数或二级构造函数），它将生成一个没有参数的主构造函数。构造函数的可见性将是 public。

如果您不希望您的类具有公共构造函数，请声明一个具有非默认可见性的空主构造函数：

```kotlin
class DontCreateMe private constructor() { /*...*/ }
```

:::note
在 JVM 上，如果所有主构造函数参数都具有默认值，则编译器将生成一个额外的无参数构造函数，该构造函数将使用默认值。这使得将 Kotlin 与 Jackson 或 JPA 等通过无参数构造函数创建类实例的库一起使用更容易。

```kotlin
class Customer(val customerName: String = "")
```

:::

## 创建类实例 (Creating instances of classes)

要创建类的实例，请像调用常规函数一样调用构造函数。您可以将创建的实例分配给[变量](basic-syntax#variables)：

```kotlin
val invoice = Invoice()

val customer = Customer("Joe Smith")
```

:::note
Kotlin 没有 `new` 关键字。

:::

创建嵌套类、内部类和匿名内部类的过程在[嵌套类](nested-classes)中描述。

## 类成员 (Class members)

类可以包含：

* [构造函数和初始化块](classes#constructors)
* [函数](functions)
* [属性](properties)
* [嵌套类和内部类](nested-classes)
* [对象声明](object-declarations)

## 继承 (Inheritance)

类可以从彼此派生并形成继承层次结构。
[了解更多关于 Kotlin 中的继承](inheritance)。

## 抽象类 (Abstract classes)

一个类可以被声明为 `abstract`，以及它的一些或所有成员。
抽象成员在其类中没有实现。
您不需要使用 `open` 注解抽象类或函数。

```kotlin
abstract class Polygon {
    abstract fun draw()
}

class Rectangle : Polygon() {
    override fun draw() {
        // 绘制矩形
    }
}
```

你可以使用一个抽象成员来覆盖一个非抽象的 `open` 成员。

```kotlin
open class Polygon {
    open fun draw() {
        // 一些默认的多边形绘制方法
    }
}

abstract class WildShape : Polygon() {
    // 继承 WildShape 的类需要提供他们自己的
    // draw 方法，而不是使用 Polygon 上的默认方法
    abstract override fun draw()
}
```

## 伴生对象 (Companion objects)

如果您需要编写一个可以不用类实例就能调用的函数，但又需要访问类的内部结构（例如工厂方法），您可以将其编写为该类内部[对象声明](object-declarations)的成员。

更具体地说，如果在您的类中声明一个[伴生对象](object-declarations#companion-objects)，您可以使用类名作为限定符来访问其成员。