[//]: # (title: 类)

Kotlin 中的类使用 `class` 关键字声明：

```kotlin
class Person { /*...*/ }
```

类声明由类名、类头（指定其类型参数、主构造函数以及其他一些内容）和由花括号包围的类体组成。类头和类体都是可选的；如果类没有类体，则可以省略花括号。

```kotlin
class Empty
```

## 构造函数

Kotlin 中的类有一个_主构造函数_，并且可能有一个或多个_次构造函数_。主构造函数在类头中声明，位于类名和可选的类型参数之后。

```kotlin
class Person constructor(firstName: String) { /*...*/ }
```

如果主构造函数没有任何注解或可见性修饰符，则可以省略 `constructor` 关键字：

```kotlin
class Person(firstName: String) { /*...*/ }
```

主构造函数在类头中初始化类实例及其属性。类头不能包含任何可运行的代码。如果要在对象创建期间运行某些代码，请使用类体内的_初始化块_。初始化块使用 `init` 关键字后跟花括号声明。将要运行的任何代码写入花括号内。

在实例初始化期间，初始化块按照它们在类体中出现的顺序执行，并与属性初始化器交错执行：

```kotlin
//sampleStart
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
//sampleEnd

fun main() {
    InitOrderDemo("hello")
}
```
{kotlin-runnable="true"}

主构造函数参数可以在初始化块中使用。它们也可以在类体中声明的属性初始化器中使用：

```kotlin
class Customer(name: String) {
    val customerKey = name.uppercase()
}
```

Kotlin 提供了一种简洁的语法，用于声明属性并从主构造函数中初始化它们：

```kotlin
class Person(val firstName: String, val lastName: String, var age: Int)
```

此类声明也可以包含类属性的默认值：

```kotlin
class Person(val firstName: String, val lastName: String, var isEmployed: Boolean = true)
```

在声明类属性时，可以使用[尾随逗号](coding-conventions.md#trailing-commas)：

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    var age: Int, // trailing comma
) { /*...*/ }
```

与常规属性非常相似，在主构造函数中声明的属性可以是可变 (`var`) 或只读 (`val`) 的。

如果构造函数有注解或可见性修饰符，则 `constructor` 关键字是必需的，并且修饰符位于它之前：

```kotlin
class Customer public @Inject constructor(name: String) { /*...*/ }
```

了解更多关于[可见性修饰符](visibility-modifiers.md#constructors)的信息。

### 次构造函数

类还可以声明_次构造函数_，它们以 `constructor` 为前缀：

```kotlin
class Person(val pets: MutableList<Pet> = mutableListOf())

class Pet {
    constructor(owner: Person) {
        owner.pets.add(this) // adds this pet to the list of its owner's pets
    }
}
```

如果类有一个主构造函数，则每个次构造函数都需要委托给主构造函数，可以直接委托，也可以通过其他次构造函数间接委托。委托给同一个类的另一个构造函数是使用 `this` 关键字完成的：

```kotlin
class Person(val name: String) {
    val children: MutableList<Person> = mutableListOf()
    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }
}
```

初始化块中的代码实际上成为主构造函数的一部分。对主构造函数的委托发生在访问次构造函数第一个语句时，因此所有初始化块和属性初始化器中的代码都在次构造函数体之前执行。

即使类没有主构造函数，委托仍然隐式发生，并且初始化块仍然执行：

```kotlin
//sampleStart
class Constructors {
    init {
        println("Init block")
    }

    constructor(i: Int) {
        println("Constructor $i")
    }
}
//sampleEnd

fun main() {
    Constructors(1)
}
```
{kotlin-runnable="true"}

如果一个非抽象类没有声明任何构造函数（主构造函数或次构造函数），它将有一个生成的无参数主构造函数。该构造函数的可见性将是 `public`。

如果你不希望你的类拥有公共构造函数，可以声明一个具有非默认可见性的空主构造函数：

```kotlin
class DontCreateMe private constructor() { /*...*/ }
```

> 在 JVM 上，如果所有主构造函数参数都具有默认值，编译器将生成一个额外的无参数构造函数，该构造函数将使用默认值。这使得 Kotlin 更容易与 Jackson 或 JPA 等通过无参数构造函数创建类实例的库一起使用。
>
> ```kotlin
> class Customer(val customerName: String = "")
> ```
>
{style="note"}

## 创建类实例

要创建类实例，请像调用常规函数一样调用构造函数。你可以将创建的实例赋值给一个[变量](basic-syntax.md#variables)：

```kotlin
val invoice = Invoice()

val customer = Customer("Joe Smith")
```

> Kotlin 没有 `new` 关键字。
>
{style="note"}

嵌套类、内部类和匿名内部类的实例创建过程在[嵌套类](nested-classes.md)中描述。

## 类成员

类可以包含：

*   [构造函数和初始化块](#constructors)
*   [函数](functions.md)
*   [属性](properties.md)
*   [嵌套类和内部类](nested-classes.md)
*   [对象声明](object-declarations.md)

## 继承

类可以相互派生并形成继承层次结构。
[在 Kotlin 中了解更多关于继承的信息](inheritance.md)。

## 抽象类

类及其部分或所有成员可以声明为 `abstract`。
抽象成员在其类中没有实现。
你无需使用 `open` 注解抽象类或函数。

```kotlin
abstract class Polygon {
    abstract fun draw()
}

class Rectangle : Polygon() {
    override fun draw() {
        // draw the rectangle
    }
}
```

你可以使用抽象成员覆盖非抽象的 `open` 成员。

```kotlin
open class Polygon {
    open fun draw() {
        // some default polygon drawing method
    }
}

abstract class WildShape : Polygon() {
    // Classes that inherit WildShape need to provide their own
    // draw method instead of using the default on Polygon
    abstract override fun draw()
}
```

## 伴生对象

如果你需要编写一个可以在没有类实例的情况下调用的函数，但该函数需要访问类的内部（例如工厂方法），你可以将其作为该类内部的[对象声明](object-declarations.md)的成员来编写。

更具体地说，如果你在类中声明了[伴生对象](object-declarations.md#companion-objects)，你只需使用类名作为限定符即可访问其成员。