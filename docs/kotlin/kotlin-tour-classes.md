[//]: # (title: 类)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types.md">基本类型</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections.md">集合</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow.md">控制流</a><br />
        <img src="icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions.md">函数</a><br />
        <img src="icon-6.svg" width="20" alt="Sixth step" /> <strong>类</strong><br />
        <img src="icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety.md">空安全</a></p>
</tldr>

Kotlin 支持使用类和对象进行面向对象编程。对象对于在程序中存储数据非常有用。
类允许你声明一组对象的特性。当你从类创建对象时，可以节省时间和精力，因为不必每次都声明这些特性。

要声明一个类，请使用 `class` 关键字：

```kotlin
class Customer
```

## 属性

类的对象的特性可以在属性中声明。你可以为类声明属性：

*   在类名后的圆括号 `()` 中。
```kotlin
class Contact(val id: Int, var email: String)
```

*   在由花括号 `{}` 定义的类体中。
```kotlin
class Contact(val id: Int, var email: String) {
    val category: String = ""
}
```

我们建议你将属性声明为只读 (`val`)，除非在类的实例创建后需要更改它们。

你可以在圆括号中声明没有 `val` 或 `var` 的属性，但这些属性在实例创建后无法访问。

> *   圆括号 `()` 中的内容称为**类头**。
> *   在声明类属性时，可以使用[尾部逗号](coding-conventions.md#trailing-commas)。
>
{style="note"}

就像函数形参一样，类属性可以有默认值：
```kotlin
class Contact(val id: Int, var email: String = "example@gmail.com") {
    val category: String = "work"
}
```

## 创建实例

要从类创建对象，需要使用**构造函数**声明一个类**实例**。

默认情况下，Kotlin 会自动创建一个带有在类头中声明的形参的构造函数。

例如：
```kotlin
class Contact(val id: Int, var email: String)

fun main() {
    val contact = Contact(1, "mary@gmail.com")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-class-create-instance"}

在此示例中：

*   `Contact` 是一个类。
*   `contact` 是 `Contact` 类的实例。
*   `id` 和 `email` 是属性。
*   `id` 和 `email` 与默认构造函数一起用于创建 `contact`。

Kotlin 类可以有许多构造函数，包括你自己定义的构造函数。关于如何声明多个构造函数，请参见[构造函数](classes.md#constructors)。

## 访问属性

要访问实例的属性，请在实例名后跟一个句点 `.`，然后写上属性名：

```kotlin
class Contact(val id: Int, var email: String)

fun main() {
    val contact = Contact(1, "mary@gmail.com")
    
    // 打印属性 email 的值
    println(contact.email)           
    // mary@gmail.com

    // 更新属性 email 的值
    contact.email = "jane@gmail.com"
    
    // 打印属性 email 的新值
    println(contact.email)           
    // jane@gmail.com
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-access-property"}

> 要将属性的值连接到字符串中，可以使用字符串模板（`$var` 或 `${var.member}`）。
> 例如：
> ```kotlin
> println("Their email address is: ${contact.email}")
> ```
>
{style="tip"}

## 成员函数

除了将属性声明为对象特性的一部分，还可以使用成员函数定义对象的行为。

在 Kotlin 中，成员函数必须在类体中声明。要在实例上调用成员函数，请在实例名后跟一个句点 `.`，然后写上函数名。例如：

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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-member-function"}

## 数据类

Kotlin 有**数据类**，它们特别适用于存储数据。数据类具有与类相同的功能性，但它们会自动带有额外的成员函数。这些成员函数使你能够轻松地将实例打印为可读输出、比较类的实例、复制实例等等。由于这些函数是自动可用的，因此你不必花费时间为每个类编写相同的样板代码。

要声明一个数据类，请使用 `data` 关键字：

```kotlin
data class User(val name: String, val id: Int)
```

数据类最有用的预定义成员函数是：

| **函数**   | **描述**                                                                  |
| ---------- | ------------------------------------------------------------------------- |
| `toString()` | 打印类的实例及其属性的可读字符串。                                      |
| `equals()` 或 `==` | 比较类的实例。                                                    |
| `copy()`   | 通过复制另一个实例来创建类的实例，可能会带有一些不同的属性。              |

关于如何使用每个函数，请参见以下章节的示例：

*   [打印为字符串](#print-as-string)
*   [比较实例](#compare-instances)
*   [复制实例](#copy-instance)

### 打印为字符串

要将类的实例打印为可读字符串，可以显式调用 `toString()` 函数，或者使用 `print()` 和 `println()` 等打印函数，它们会自动为你调用 `toString()`：

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    //sampleStart
    val user = User("Alex", 1)
    
    // 自动使用 toString() 函数，使输出易于阅读
    println(user)            
    // User(name=Alex, id=1)
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-data-classes-print-string"}

这在调试或创建日志时特别有用。

### 比较实例

要比较数据类实例，请使用相等操作符 `==`：

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    //sampleStart
    val user = User("Alex", 1)
    val secondUser = User("Alex", 1)
    val thirdUser = User("Max", 2)

    // 比较 user 与 secondUser
    println("user == secondUser: ${user == secondUser}") 
    // user == secondUser: true
    
    // 比较 user 与 thirdUser
    println("user == thirdUser: ${user == thirdUser}")   
    // user == thirdUser: false
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-data-classes-compare-instances"}

### 复制实例

要创建数据类实例的精确副本，请在该实例上调用 `copy()` 函数。

要创建数据类实例的副本**并**更改一些属性，请在该实例上调用 `copy()` 函数**并**将属性的替换值作为函数形参添加。

例如：

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    //sampleStart
    val user = User("Alex", 1)

    // 创建 user 的精确副本
    println(user.copy())       
    // User(name=Alex, id=1)

    // 创建 user 的副本，并将 name 设为 "Max"
    println(user.copy("Max"))  
    // User(name=Max, id=1)

    // 创建 user 的副本，并将 id 设为 3
    println(user.copy(id = 3)) 
    // User(name=Alex, id=3)
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-data-classes-copy-instance"}

创建实例的副本比修改原始实例更安全，因为任何依赖于原始实例的代码都不会受到副本及其操作的影响。

关于数据类的更多信息，请参见[数据类](data-classes.md)。

本教程的最后一章是关于 Kotlin 的[空安全](kotlin-tour-null-safety.md)。

## 练习

### 练习 1 {initial-collapse-state="collapsed" collapsible="true"}

定义一个数据类 `Employee`，它有两个属性：一个用于姓名，另一个用于薪资。确保薪资属性是可变的，否则你将无法在年底获得加薪！main 函数演示了如何使用这个数据类。

|---|---|
```kotlin
// 在此处编写你的代码

fun main() {
    val emp = Employee("Mary", 20)
    println(emp)
    emp.salary += 10
    println(emp)
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-exercise-1"}

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-classes-solution-1"}

### 练习 2 {initial-collapse-state="collapsed" collapsible="true"}

声明此代码编译所需的额外数据类。

|---|---|
```kotlin
data class Person(val name: Name, val address: Address, val ownsAPet: Boolean = true)
// 在此处编写你的代码
// data class Name(...)

fun main() {
    val person = Person(
        Name("John", "Smith"),
        Address("123 Fake Street", City("Springfield", "US")),
        ownsAPet = false
    )
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-exercise-2"}

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-classes-solution-2"}

### 练习 3 {initial-collapse-state="collapsed" collapsible="true"}

为了测试你的代码，你需要一个能够生成随机雇员的生成器。定义一个 `RandomEmployeeGenerator` 类，它带有一个固定的潜在姓名列表（在类体中）。配置类的最低和最高薪资（在类头中）。在类体中，定义 `generateEmployee()` 函数。main 函数再次演示了如何使用这个类。

> 在本练习中，你将导入一个包，以便可以使用 [`Random.nextInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/next-int.html) 函数。
> 关于导入包的更多信息，请参见[包与导入](packages.md)。
>
{style="tip"}

<deflist collapsible="true" id="kotlin-tour-classes-exercise-3-hint-1">
    <def title="提示 1">
        列表有一个名为 [`random()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random.html) 的扩展函数，它返回列表中的一个随机项。
    </def>
</deflist>

<deflist collapsible="true" id="kotlin-tour-classes-exercise-3-hint-2">
    <def title="提示 2">
        `Random.nextInt(from = ..., until = ...)` 会在指定限制内为你提供一个随机的 `Int` 类型数字。
    </def>
</deflist>

|---|---|
```kotlin
import kotlin.random.Random

data class Employee(val name: String, var salary: Int)

// 在此处编写你的代码

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
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-exercise-3"}

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-classes-solution-3"}

## 下一步

[空安全](kotlin-tour-null-safety.md)