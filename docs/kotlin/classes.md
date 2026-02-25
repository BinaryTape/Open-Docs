[//]: # (title: 类)

> 在创建类之前，如果目的是存储数据，请考虑使用 [数据类](data-classes.md)。
> 或者，考虑使用 [扩展](extensions.md) 来扩展现有类，而不是从头开始创建一个新类。
>
{style="tip"}

与其他面向对象语言一样，Kotlin 使用 _类_ 来封装数据（属性）和行为（函数），从而实现可重用、结构化的代码。

类是对象的蓝图或模板，你可以通过 [构造函数](#constructors-and-initializer-blocks) 来创建对象。当你 [创建一个类的实例](#creating-instances) 时，你是在根据该蓝图创建一个具体的对象。

Kotlin 为声明类提供了简洁的语法。要声明一个类，请使用 `class` 关键字，后跟类名：

```kotlin
class Person { /*...*/ }
```

类声明由以下部分组成：
* **类头 (Class header)**，包括但不限于：
    * `class` 关键字
    * 类名
    * 类型参数（如果有）
    * [主构造函数](#primary-constructor)（可选）
* **类体 (Class body)**（可选），由花括号 `{}` 包围，包含 **类成员**，例如：
    * [次构造函数](#secondary-constructors)
    * [初始化块](#initializer-blocks)
    * [函数](functions.md)
    * [属性](properties.md)
    * [嵌套类与内部类](nested-classes.md)
    * [对象声明](object-declarations.md)

你可以将类头和类体保持在最简状态。如果类没有类体，可以省略花括号 `{}`：

```kotlin
// 带有主构造函数但没有类体的类
class Person(val name: String, var age: Int)
```

以下是一个声明带有类头和类体的类，并从中 [创建实例](#creating-instances) 的示例：

```kotlin
// 带有主构造函数的 Person 类
// 用于初始化 name 属性
class Person(val name: String) {
    // 带有 age 属性的类体
    var age: Int = 0
}

fun main() {
    // 通过调用构造函数创建 Person 类的实例
    val person = Person("Alice")

    // 访问实例的属性
    println(person.name)
    // Alice
    println(person.age)
    // 0
}
```
{kotlin-runnable="true" id="class-with-header-and-body"}

## 创建实例

当你将类作为蓝图来构建程序中可使用的真实对象时，就创建了一个实例。

要创建一个类的实例，请在类名后跟圆括号 `()`，类似于调用 [函数](functions.md)：

```kotlin
// 创建 Person 类的实例
val anonymousUser = Person()
```

在 Kotlin 中，你可以通过以下方式创建实例：

* **无实参** (`Person()`)：如果类中声明了默认值，则使用默认值创建实例。
* **带实参** (`Person(value)`)：通过传递特定值来创建实例。

你可以将创建的实例分配给可变 (`var`) 或只读 (`val`) [变量](basic-syntax.md#variables)：

```kotlin
// 使用默认值创建实例
// 并将其分配给可变变量
var anonymousUser = Person()

// 通过传递特定值创建实例
// 并将其分配给只读变量
val namedUser = Person("Joe")
```

你可以在任何需要的地方创建实例：在 [`main()` 函数](basic-syntax.md#program-entry-point) 内部、在其他函数内部或在另一个类内部。此外，你可以在另一个函数内部创建实例，并从 `main()` 调用该函数。

以下代码声明了一个带有存储姓名属性的 `Person` 类。它还演示了如何使用默认构造函数的值和特定值来创建实例：

```kotlin
// 带有主构造函数的类头
// 使用默认值初始化 name
class Person(val name: String = "Sebastian")

fun main() {
    // 使用默认构造函数的值创建实例
    val anonymousUser = Person()

    // 通过传递特定值创建实例
    val namedUser = Person("Joe")

    // 访问实例的 name 属性
    println(anonymousUser.name)
    // Sebastian
    println(namedUser.name)
    // Joe
}
```
{kotlin-runnable="true" id="create-instance-of-a-class"}

> 在 Kotlin 中，与其他面向对象编程语言不同，创建类实例时不需要 `new` 关键字。
>
{style="note"}

有关创建嵌套类、内部类和匿名内部类实例的信息，请参阅 [嵌套类](nested-classes.md) 章节。

## 构造函数与初始化块

当你创建一个类实例时，你会调用它的一个构造函数。Kotlin 中的一个类可以有一个 [_主构造函数_](#primary-constructor) 和一个或多个 [_次构造函数_](#secondary-constructors)。

主构造函数是初始化类的主要方式。你在类头中声明它。次构造函数提供额外的初始化逻辑。你在类体中声明它。

主构造函数和次构造函数都是可选的，但一个类必须至少有一个构造函数。

### 主构造函数

主构造函数在实例 [创建时](#creating-instances) 设置其初始状态。

要声明主构造函数，请将其放在类名后的类头中：

```kotlin
class Person constructor(name: String) { /*...*/ }
```

如果主构造函数没有任何 [注解](annotations.md) 或 [可见性修饰符](visibility-modifiers.md#constructors)，可以省略 `constructor` 关键字：

```kotlin
class Person(name: String) { /*...*/ }
```

主构造函数可以将形参声明为属性。在实参名前使用 `val` 关键字声明只读属性，使用 `var` 关键字声明可变属性：

```kotlin
class Person(val name: String, var age: Int) { /*...*/ }
```

这些构造函数形参属性作为实例的一部分存储，并可从类外部访问。

也可以声明不是属性的主构造函数形参。这些形参前面没有 `val` 或 `var`，因此它们不存储在实例中，仅在类体内部可用：

```kotlin
// 既是形参也是属性的主构造函数形参
class PersonWithProperty(val name: String) {
    fun greet() {
        println("Hello, $name")
    }
}

// 仅作为主构造函数形参（不作为属性存储）
class PersonWithAssignment(name: String) {
    // 必须分配给属性才能在以后使用
    val displayName: String = name
    
    fun greet() {
        println("Hello, $displayName")
    }
}
```

主构造函数中声明的属性可以被类的 [成员函数](functions.md) 访问：

```kotlin
// 带有声明属性的主构造函数的类
class Person(val name: String, var age: Int) {
    // 访问类属性的成员函数
    fun introduce(): String {
        return "Hi, I'm $name and I'm $age years old."
    }
}
```

你还可以在主构造函数中为属性分配默认值：

```kotlin
class Person(val name: String = "John", var age: Int = 30) { /*...*/ }
```

如果在 [实例创建](#creating-instances) 期间没有向构造函数传递任何值，则属性将使用其默认值：

```kotlin
// 带有主构造函数的类
// 包含 name 和 age 的默认值
class Person(val name: String = "John", var age: Int = 30)

fun main() {
    // 使用默认值创建实例
    val person = Person()
    println("Name: ${person.name}, Age: ${person.age}")
    // Name: John, Age: 30
}
```
{kotlin-runnable="true" id="class-with-primary-constructor"}

你可以使用主构造函数形参直接在类体中初始化额外的类属性：

```kotlin
// 带有主构造函数的类
// 包含 name 和 age 的默认值
class Person(
    val name: String = "John",
    var age: Int = 30
) {
    // 从主构造函数形参
    // 初始化 description 属性
    val description: String = "Name: $name, Age: $age"
}

fun main() {
    // 创建 Person 类的实例
    val person = Person()
    // 访问 description 属性
    println(person.description)
    // Name: John, Age: 30
}
```
{kotlin-runnable="true" id="class-with-default-values"}

与函数一样，你可以在构造函数声明中使用 [尾随逗号](coding-conventions.md#trailing-commas)：

```kotlin
class Person(
    val name: String,
    val lastName: String,
    var age: Int,
) { /*...*/ }
```

### 初始化块

主构造函数初始化类并设置其属性。在大多数情况下，你可以使用简单的代码来处理。

如果你需要在 [实例创建](#creating-instances) 期间执行更复杂的操作，请将该逻辑放入类体内的 _初始化块_ 中。这些块在主构造函数执行时运行。

使用 `init` 关键字后跟花括号 `{}` 声明初始化块。在花括号内编写你希望在初始化期间运行的任何代码：

```kotlin
// 带有初始化 name 和 age 的主构造函数的类
class Person(val name: String, var age: Int) {
    init {
        // 初始化块在实例创建时运行
        println("Person created: $name, age $age.")
    }
}

fun main() {
    // 创建 Person 类的实例
    Person("John", 30)
    // Person created: John, age 30.
}
```
{kotlin-runnable="true" id="class-with-initializer-block"}

可以根据需要添加多个初始化块 (`init {}`)。它们按照在类体中出现的顺序与属性初始化器一起运行：

```kotlin
//sampleStart
// 带有初始化 name 和 age 的主构造函数的类
class Person(val name: String, var age: Int) {
    // 第一个初始化块
    init {
        // 在实例创建时首先运行
        println("Person created: $name, age $age.")
    }

    // 第二个初始化块
    init {
        // 在第一个初始化块之后运行
        if (age < 18) {
            println("$name is a minor.")
        } else {
            println("$name is an adult.")
        }
    }
}

fun main() {
    // 创建 Person 类的实例
    Person("John", 30)
    // Person created: John, age 30.
    // John is an adult.
}
//sampleEnd
```
{kotlin-runnable="true" id="class-with-second-initializer-block"}

你可以在初始化块中使用主构造函数形参。例如，在上面的代码中，第一个和第二个初始化块使用了主构造函数中的 `name` 和 `age` 形参。

`init` 块的一个常见用例是数据验证。例如，通过调用 [`require` 函数](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/require.html)：

```kotlin
class Person(val age: Int) {
    init {
        require(age > 0) { "age must be positive" }
    }
}
```

### 次构造函数

在 Kotlin 中，次构造函数是类在主构造函数之外可以拥有的额外构造函数。当你需要多种方式来初始化类或为了 [Java 互操作性](java-to-kotlin-interop.md) 时，次构造函数非常有用。

要声明次构造函数，请在类体内部使用 `constructor` 关键字，并将构造函数参数放在圆括号 `()` 内。在花括号 `{}` 内添加构造函数逻辑：

```kotlin
// 带有初始化 name 和 age 的主构造函数的类头
class Person(val name: String, var age: Int) {

    // 次构造函数，接收 String 类型的 age
    // 并将其转换为 Int
    constructor(name: String, age: String) : this(name, age.toIntOrNull() ?: 0) {
        println("$name created with converted age: ${this.age}")
    }
}

fun main() {
    // 使用以 String 作为 age 的次构造函数
    Person("Bob", "8")
    // Bob created with converted age: 8
}
```
{kotlin-runnable="true" id="class-with-secondary-constructor"}

> 表达式 `age.toIntOrNull() ?: 0` 使用了 Elvis 运算符。欲了解更多信息，请参阅 [Null 安全](null-safety.md#elvis-operator)。
>
{style="tip"}

在上面的代码中，次构造函数通过 `this` 关键字委托给主构造函数，传递 `name` 和转换为整数的 `age` 值。

在 Kotlin 中，次构造函数必须委托给主构造函数。这种委托确保了在任何次构造函数逻辑运行之前，所有主构造函数初始化逻辑都已执行。

构造函数委托可以是：
* **直接委托**：次构造函数立即调用主构造函数。
* **间接委托**：一个次构造函数调用另一个次构造函数，而后者又委托给主构造函数。

以下是一个演示直接和间接委托如何工作的示例：

```kotlin
// 带有初始化 name 和 age 的主构造函数的类头
class Person(
    val name: String,
    var age: Int
) {
    // 直接委托给主构造函数的
    // 次构造函数
    constructor(name: String) : this(name, 0) {
        println("Person created with default age: $age and name: $name.")
    }

    // 间接委托的次构造函数：
    // this("Bob") -> constructor(name: String) -> 主构造函数
    constructor() : this("Bob") {
        println("New person created with default age: $age and name: $name.")
    }
}

fun main() {
    // 基于直接委托创建实例
    Person("Alice")
    // Person created with default age: 0 and name: Alice.

    // 基于间接委托创建实例
    Person()
    // Person created with default age: 0 and name: Bob.
    // New person created with default age: 0 and name: Bob.
}
```
{kotlin-runnable="true" id="class-delegation"}

在带有初始化块 (`init {}`) 的类中，这些块中的代码会成为主构造函数的一部分。鉴于次构造函数会首先委托给主构造函数，所有初始化块和属性初始化器都会在次构造函数体之前运行。即使类没有主构造函数，委托仍然会隐式发生：

```kotlin
// 没有主构造函数的类头
class Person {
    // 初始化块在实例创建时运行
    init {
        // 在次构造函数之前运行
        println("1. First initializer block runs")
    }

    // 接收一个整数参数的次构造函数
    constructor(i: Int) {
        // 在初始化块之后运行
        println("2. Person $i is created")
    }
}

fun main() {
    // 创建 Person 类的实例
    Person(1)
    // 1. First initializer block runs
    // 2. Person 1 created
}
```
{kotlin-runnable="true" id="class-delegation-sequence"}

### 不带构造函数的类

没有声明任何构造函数（主构造函数或次构造函数）的类具有一个隐式的无参主构造函数：

```kotlin
// 没有显式构造函数的类
class Person {
    // 未声明主构造函数或次构造函数
}

fun main() {
    // 使用隐式主构造函数
    // 创建 Person 类的实例
    val person = Person()
}
```

此隐式主构造函数的可见性为 `public`，这意味着它可以从任何地方访问。如果你不希望类拥有公共构造函数，请声明一个具有非默认可见性的空主构造函数：

```kotlin
class Person private constructor() { /*...*/ }
```

> 在 JVM 上，如果主构造函数的所有形参都有默认值，编译器会隐式提供一个使用这些默认值的无参构造函数。
>
> 这使得在 Kotlin 中使用诸如 [Jackson](https://github.com/FasterXML/jackson) 或 [Spring Data JPA](https://spring.io/projects/spring-data-jpa) 等通过无参构造函数创建类实例的库变得更加容易。
>
> 在以下示例中，Kotlin 隐式提供了一个使用默认值 `""` 的无参构造函数 `Person()`：
>
> ```kotlin
> class Person(val personName: String = "")
> ```
>
{style="note"}

## 继承

Kotlin 中的类继承允许你从现有类（基类）创建一个新类（派生类），继承其属性和函数，同时添加或修改行为。

有关继承层次结构以及如何使用 `open` 关键字的详细信息，请参阅 [继承](inheritance.md) 章节。

## 抽象类

在 Kotlin 中，抽象类是不能直接实例化的类。它们旨在被定义其实际行为的其他类继承。这种行为被称为 _实现_。

抽象类可以声明抽象属性和函数，这些必须由子类实现。

抽象类也可以有构造函数。这些构造函数初始化类属性并为子类强制执行所需的形参。使用 `abstract` 关键字声明抽象类：

```kotlin
abstract class Person(val name: String, val age: Int)
```

抽象类可以同时拥有抽象和非抽象成员（属性和函数）。要将成员声明为抽象，必须显式使用 `abstract` 关键字。

你不需要为抽象类或函数添加 `open` 关键字，因为它们默认就是隐式可继承的。有关 `open` 关键字的更多详细信息，请参阅 [继承](inheritance.md#open-keyword)。

抽象成员在抽象类中没有实现。你在子类或继承类中使用 `override` 函数或属性定义实现：

```kotlin
// 带有声明 name 和 age 的主构造函数的抽象类
abstract class Person(
    val name: String,
    val age: Int
) {
    // 抽象成员
    // 不提供实现，
    // 且必须由子类实现
    abstract fun introduce()

    // 非抽象成员（有实现）
    fun greet() {
        println("Hello, my name is $name.")
    }
}

// 为抽象成员提供实现的子类
class Student(
    name: String,
    age: Int,
    val school: String
) : Person(name, age) {
    override fun introduce() {
        println("I am $name, $age years old, and I study at $school.")
    }
}

fun main() {
    // 创建 Student 类的实例
    val student = Student("Alice", 20, "Engineering University")
    
    // 调用非抽象成员
    student.greet()
    // Hello, my name is Alice.
    
    // 调用重写的抽象成员
    student.introduce()
    // I am Alice, 20 years old, and I study at Engineering University.
}
```
{kotlin-runnable="true" id="abstract-class"}

## 伴生对象

在 Kotlin 中，每个类都可以有一个 [伴生对象](object-declarations.md#companion-objects)。伴生对象是一种对象声明，允许你使用类名访问其成员，而无需创建类实例。

假设你需要编写一个无需创建类实例即可调用，但在逻辑上仍与类相关联的函数（例如工厂函数）。在这种情况下，你可以将其声明在类内部的伴生 [对象声明](object-declarations.md) 中：

```kotlin
// 带有声明 name 属性的主构造函数的类
class Person(
    val name: String
) {
    // 带有伴生对象的类体
    companion object {
        fun createAnonymous() = Person("Anonymous")
    }
}

fun main() {
    // 无需创建类实例即可调用函数
    val anonymous = Person.createAnonymous()
    println(anonymous.name)
    // Anonymous
}
```
{kotlin-runnable="true" id="class-with-companion-object"}

如果你在类中声明了一个伴生对象，你可以仅使用类名作为限定符来访问其成员。

欲了解更多信息，请参阅 [伴生对象](object-declarations.md#companion-objects)。