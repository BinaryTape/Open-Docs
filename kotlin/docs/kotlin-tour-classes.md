---
title: 类
---
<no-index/>
:::info
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world">Hello world</a><br />
        <img src="/img/icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types">Basic types</a><br />
        <img src="/img/icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections">Collections</a><br />
        <img src="/img/icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow">Control flow</a><br />
        <img src="/img/icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions">Functions</a><br />
        <img src="/img/icon-6.svg" width="20" alt="Sixth step" /> <strong>类 (Classes)</strong><br />
        <img src="/img/icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety">Null safety</a>
</p>

:::

Kotlin 支持使用类和对象进行面向对象编程。对象对于在程序中存储数据很有用。
类允许你声明对象的特性集合。当你从类创建对象时，可以节省时间和精力，因为不必每次都声明这些特性。

要声明一个类，请使用 `class` 关键字：

```kotlin
class Customer
```

## 属性 (Properties)

类的对象的特性可以在属性中声明。你可以为类声明属性：

* 在类名后面的括号 `()` 内。
```kotlin
class Contact(val id: Int, var email: String)
```

* 在由花括号 `{}` 定义的类主体中。
```kotlin
class Contact(val id: Int, var email: String) {
    val category: String = ""
}
```

我们建议你将属性声明为只读 (`val`)，除非在创建类的实例后需要更改它们。

你可以在括号内声明不带 `val` 或 `var` 的属性，但在创建实例后，这些属性不可访问。

:::note
* 括号 `()` 中包含的内容称为**类头 (class header)**。
* 在声明类属性时，可以使用[尾随逗号 (trailing comma)](coding-conventions#trailing-commas)。

:::

与函数参数一样，类属性可以具有默认值：
```kotlin
class Contact(val id: Int, var email: String = "example@gmail.com") {
    val category: String = "work"
}
```

## 创建实例 (Create instance)

要从类创建一个对象，你需要使用**构造函数 (constructor)**声明一个类**实例 (instance)**。

默认情况下，Kotlin 会自动创建一个构造函数，其参数在类头中声明。

例如：
```kotlin
class Contact(val id: Int, var email: String)

fun main() {
    val contact = Contact(1, "mary@gmail.com")
}
```

在示例中：

* `Contact` 是一个类。
* `contact` 是 `Contact` 类的实例。
* `id` 和 `email` 是属性。
* `id` 和 `email` 与默认构造函数一起用于创建 `contact`。

Kotlin 类可以有多个构造函数，包括你自己定义的构造函数。要了解有关如何声明多个构造函数的更多信息，请参见[构造函数 (Constructors)](classes#constructors)。

## 访问属性 (Access properties)

要访问实例的属性，请在实例名称后写上属性名称，并附加一个句点 `.`：

```kotlin
class Contact(val id: Int, var email: String)

fun main() {
    val contact = Contact(1, "mary@gmail.com")
    
    // 打印属性的值：email
    println(contact.email)           
    // mary@gmail.com

    // 更新属性的值：email
    contact.email = "jane@gmail.com"
    
    // 打印属性的新值：email
    println(contact.email)           
    // jane@gmail.com
}
```

:::tip
要将属性的值连接为字符串的一部分，可以使用字符串模板 (`$`)。
例如：
```kotlin
println("Their email address is: ${contact.email}")
```

:::

## 成员函数 (Member functions)

除了将属性声明为对象特征的一部分之外，你还可以使用成员函数定义对象的行为。

在 Kotlin 中，成员函数必须在类主体中声明。要在实例上调用成员函数，请在实例名称后写上函数名称，并附加一个句点 `.`。例如：

```kotlin
class Contact(val id: Int, var email: String) {
    fun printId() {
        println(id)
    }
}

fun main() {
    val contact = Contact(1, "mary@gmail.com")
    // 调用成员函数 printId()
    contact.printId()           
    // 1
}
```

## 数据类 (Data classes)

Kotlin 有**数据类 (data classes)**，它们对于存储数据特别有用。数据类具有与类相同的功能，但是它们自动带有附加的成员函数。这些成员函数使你可以轻松地将实例打印到可读的输出，比较类的实例，复制实例等等。由于这些函数是自动可用的，因此你不必花费时间为每个类编写相同的样板代码。

要声明数据类，请使用关键字 `data`：

```kotlin
data class User(val name: String, val id: Int)
```

数据类最常用的预定义成员函数是：

| **函数 (Function)**       | **描述 (Description)**                                                                          |
|--------------------|------------------------------------------------------------------------------------------|
| `toString()`       | 打印类实例及其属性的可读字符串。                       |
| `equals()` or `==` | 比较类的实例。                                                           |
| `copy()`           | 通过复制另一个类实例来创建一个类实例，可能具有一些不同的属性。 |

请参见以下各节，以获取有关如何使用每个函数的示例：

* [打印为字符串 (Print as string)](#print-as-string)
* [比较实例 (Compare instances)](#compare-instances)
* [复制实例 (Copy instance)](#copy-instance)

### 打印为字符串 (Print as string)

要打印类实例的可读字符串，可以显式调用 `toString()` 函数，或者使用打印函数（`println()` 和 `print()`），这些函数会自动为你调用 `toString()`：

```kotlin
data class User(val name: String, val id: Int)

fun main() {

    val user = User("Alex", 1)
    
    // 自动使用 toString() 函数，以便输出易于阅读
    println(user)            
    // User(name=Alex, id=1)

}
```

这在调试或创建日志时特别有用。

### 比较实例 (Compare instances)

要比较数据类实例，请使用相等运算符 `==`：

```kotlin
data class User(val name: String, val id: Int)

fun main() {

    val user = User("Alex", 1)
    val secondUser = User("Alex", 1)
    val thirdUser = User("Max", 2)

    // 将 user 与 secondUser 进行比较
    println("user == secondUser: ${user == secondUser}") 
    // user == secondUser: true
    
    // 将 user 与 thirdUser 进行比较
    println("user == thirdUser: ${user == thirdUser}")   
    // user == thirdUser: false

}
```

### 复制实例 (Copy instance)

要创建数据类实例的精确副本，请在该实例上调用 `copy()` 函数。

要创建数据类实例的副本**并**更改某些属性，请在该实例上调用 `copy()` 函数**并**为属性添加替换值作为函数参数。

例如：

```kotlin
data class User(val name: String, val id: Int)

fun main() {

    val user = User("Alex", 1)

    // 创建 user 的精确副本
    println(user.copy())       
    // User(name=Alex, id=1)

    // 创建名称为 "Max" 的 user 副本
    println(user.copy("Max"))  
    // User(name=Max, id=1)

    // 创建 id 为 3 的 user 副本
    println(user.copy(id = 3)) 
    // User(name=Alex, id=3)

}
```

创建实例的副本比修改原始实例更安全，因为任何依赖原始实例的代码都不会受到副本以及你对它所做的操作的影响。

有关数据类的更多信息，请参见[数据类 (Data classes)](data-classes)。

本教程的最后一章是关于 Kotlin 的 [Null safety](kotlin-tour-null-safety)。

## 练习 (Practice)

### 练习 1

定义一个具有两个属性的数据类 `Employee`：一个用于名称，另一个用于薪水。确保薪水的属性是可变的，否则你将无法在年底获得加薪！ `main` 函数演示了如何使用此数据类。

|---|---|
```kotlin
// 在这里写你的代码

fun main() {
    val emp = Employee("Mary", 20)
    println(emp)
    emp.salary += 10
    println(emp)
}
```

|---|---|
```kotlin
data class Employee(val name: String, var salary: Int)

fun main() {
    val emp = Employee("Mary", 20)
    println(emp)
    emp.salary += 10
    println(emp)
}
```

### 练习 2

声明编译此代码所需的其他数据类。

|---|---|
```kotlin
data class Person(val name: Name, val address: Address, val ownsAPet: Boolean = true)
// 在这里写你的代码
// data class Name(...)

fun main() {
    val person = Person(
        Name("John", "Smith"),
        Address("123 Fake Street", City("Springfield", "US")),
        ownsAPet = false
    )
}
```

|---|---|
```kotlin
data class Person(val name: Name, val address: Address, val ownsAPet: Boolean = true)
data class Name(val first: String, val last: String)
data class Address(val street: String, val city: City)
data class City(val name: String, val countryCode: String)

fun main() {
    val person = Person(
        Name("John", "Smith"),
        Address("123 Fake Street", City("Springfield", "US")),
        ownsAPet = false
    )
}
```

### 练习 3

要测试你的代码，你需要一个可以创建随机员工的生成器。定义一个 `RandomEmployeeGenerator` 类，其中包含一个固定的潜在名称列表（在类主体内）。使用最小和最大薪水配置该类（在类头内）。在类主体中，定义 `generateEmployee()` 函数。同样，`main` 函数演示了如何使用此类。

> 在本练习中，你导入一个包，以便可以使用 [`Random.nextInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/next-int.html) 函数。
> 有关导入包的更多信息，请参见[包和导入 (Packages and imports)](packages)。
>

<h3>提示 1</h3>
        列表有一个名为 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random.html">`.random()`</a> 的扩展函数
        ，该函数返回列表中的一个随机项。
<h3>提示 2</h3>
        `Random.nextInt(from = ..., until = ...)` 为你提供指定限制范围内的随机 `Int` 数字。
    

|---|---|
```kotlin
import kotlin.random.Random

data class Employee(val name: String, var salary: Int)

// 在这里写你的代码

fun main() {
    val empGen = RandomEmployeeGenerator(10, 30)
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    empGen.minSalary = 50
    empGen.maxSalary = 100
    println(empGen.generateEmployee())
}
```

|---|---|
```kotlin
import kotlin.random.Random

data class Employee(val name: String, var salary: Int)

class RandomEmployeeGenerator(var minSalary: Int, var maxSalary: Int) {
    val names = listOf("John", "Mary", "Ann", "Paul", "Jack", "Elizabeth")
    fun generateEmployee() =
        Employee(names.random(),
            Random.nextInt(from = minSalary, until = maxSalary))
}

fun main() {
    val empGen = RandomEmployeeGenerator(10, 30)
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    empGen.minSalary = 50
    empGen.maxSalary = 100
    println(empGen.generateEmployee())
}
```

## 下一步 (Next step)

[Null safety](kotlin-tour-null-safety)