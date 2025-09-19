[//]: # (title: 中级：对象)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">扩展函数</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函数</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">带接收者的 lambda 表达式</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">类和接口</a><br />
        <img src="icon-5.svg" width="20" alt="Fourth step" /> <strong>对象</strong><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">开放类与特殊类</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">属性</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">空安全</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">库和 API</a></p>
</tldr>

在本章节中，你将通过探索对象声明来扩展对类的理解。这些知识将帮助你高效管理项目中的行为。

## 对象声明

在 Kotlin 中，你可以使用 **对象声明** 来声明一个只包含单个实例的类。从某种意义上说，你是在_同时_声明类并创建该单个实例。当你想创建一个类作为程序的单一引用点或协调整个系统的行为时，对象声明非常有用。

> 只包含一个且易于访问的实例的类称为**单例**。
>
{style="tip"}

Kotlin 中的对象是**惰性**的，这意味着它们只在被访问时创建。Kotlin 还确保所有对象都以线程安全的方式创建，因此你无需手动检测此项。

要创建对象声明，请使用 `object` 关键字：

```kotlin
object DoAuth {}
```

在你的 `object` 名称后面，在由花括号 `{}` 定义的对象体中添加任何属性或成员函数。

> 对象不能有构造函数，因此它们不像类那样有头部。
>
{style="note"}

例如，假设你想创建一个名为 `DoAuth` 的对象，它负责身份验证：

```kotlin
object DoAuth {
    fun takeParams(username: String, password: String) {
        println("input Auth parameters = $username:$password")
    }
}

fun main(){
    // 对象在 takeParams() 函数首次调用时创建
    DoAuth.takeParams("coding_ninja", "N1njaC0ding!")
    // input Auth parameters = coding_ninja:N1njaC0ding!
}
```
{kotlin-runnable="true" id="kotlin-tour-object-declarations"}

该对象有一个名为 `takeParams` 的成员函数，它接受 `username` 和 `password` 变量作为参数，并向控制台输出一个字符串。`DoAuth` 对象仅在函数首次调用时创建。

> 对象可以继承自类和接口。例如：
>
> ```kotlin
> interface Auth {
>     fun takeParams(username: String, password: String)
> }
>
> object DoAuth : Auth {
>     override fun takeParams(username: String, password: String) {
>         println("input Auth parameters = $username:$password")
>     }
> }
> ```
>
{style="note"}

#### 数据对象

为了更方便地打印对象声明的内容，Kotlin 提供了 **数据对象**。与你在初级教程中了解到的数据类类似，数据对象会自动附带额外的成员函数：`toString()` 和 `equals()`。

> 与数据类不同，数据对象不会自动附带 `copy()` 成员函数，因为它们只包含一个无法被复制的实例。
>
{type ="note"}

要创建数据对象，使用与对象声明相同的语法，但在其前面加上 `data` 关键字：

```kotlin
data object AppConfig {}
```

例如：

```kotlin
data object AppConfig {
    var appName: String = "My Application"
    var version: String = "1.0.0"
}

fun main() {
    println(AppConfig)
    // AppConfig

    println(AppConfig.appName)
    // My Application
}
```
{kotlin-runnable="true" id="kotlin-tour-data-objects"}

关于数据对象的更多信息，请参见 [](object-declarations.md#data-objects)。

#### 伴生对象

在 Kotlin 中，一个类可以拥有一个对象：一个**伴生对象**。每个类只能有**一个**伴生对象。伴生对象仅在它的类首次被引用时创建。

在伴生对象内部声明的任何属性或函数都在所有类实例之间共享。

要在类中创建伴生对象，使用与对象声明相同的语法，但在其前面加上 `companion` 关键字：

```kotlin
companion object Bonger {}
```

> 伴生对象不必有名称。如果你不定义名称，默认值为 `Companion`。
>
{style="note"}

要访问伴生对象的任何属性或函数，请引用类名。例如：

```kotlin
class BigBen {
    companion object Bonger {
        fun getBongs(nTimes: Int) {
            repeat(nTimes) { print("BONG ") }
            }
        }
    }

fun main() {
    // 伴生对象在类首次被引用时创建。
    BigBen.getBongs(12)
    // BONG BONG BONG BONG BONG BONG BONG BONG BONG BONG BONG BONG
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-companion-object"}

此示例创建了一个名为 `BigBen` 的类，其中包含一个名为 `Bonger` 的伴生对象。该伴生对象有一个名为 `getBongs()` 的成员函数，它接受一个整数，并向控制台输出 `"BONG"` 与该整数相同的次数。

在 `main()` 函数中，通过引用类名来调用 `getBongs()` 函数。伴生对象在此时创建。`getBongs()` 函数传入实参 `12`。

关于更多信息，请参见 [](object-declarations.md#companion-objects)。

## 练习

### 练习 1 {initial-collapse-state="collapsed" collapsible="true" id="objects-exercise-1"}

你经营一家咖啡店，并拥有一个客户订单追踪系统。请看下面的代码，并完成第二个数据对象的声明，以便 `main()` 函数中的以下代码成功运行：

|---|---|

```kotlin
interface Order {
    val orderId: String
    val customerName: String
    val orderTotal: Double
}

data object OrderOne: Order {
    override val orderId = "001"
    override val customerName = "Alice"
    override val orderTotal = 15.50
}

data object // 请在此处编写你的代码

fun main() {
    // 打印每个数据对象的名称
    println("Order name: $OrderOne")
    // Order name: OrderOne
    println("Order name: $OrderTwo")
    // Order name: OrderTwo

    // 检测订单是否相同
    println("Are the two orders identical? ${OrderOne == OrderTwo}")
    // Are the two orders identical? false

    if (OrderOne == OrderTwo) {
        println("The orders are identical.")
    } else {
        println("The orders are unique.")
        // The orders are unique.
    }

    println("Do the orders have the same customer name? ${OrderOne.customerName == OrderTwo.customerName}")
    // Do the orders have the same customer name? false
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-objects-exercise-1"}

|---|---|
```kotlin
interface Order {
    val orderId: String
    val customerName: String
    val orderTotal: Double
}

data object OrderOne: Order {
    override val orderId = "001"
    override val customerName = "Alice"
    override val orderTotal = 15.50
}

data object OrderTwo: Order {
    override val orderId = "002"
    override val customerName = "Bob"
    override val orderTotal = 12.75
}

fun main() {
    // 打印每个数据对象的名称
    println("Order name: $OrderOne")
    // Order name: OrderOne
    println("Order name: $OrderTwo")
    // Order name: OrderTwo

    // 检测订单是否相同
    println("Are the two orders identical? ${OrderOne == OrderTwo}")
    // Are the two orders identical? false

    if (OrderOne == OrderTwo) {
        println("The orders are identical.")
    } else {
        println("The orders are unique.")
        // The orders are unique.
    }

    println("Do the orders have the same customer name? ${OrderOne.customerName == OrderTwo.customerName}")
    // Do the orders have the same customer name? false
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例方案" id="kotlin-tour-objects-solution-1"}

### 练习 2 {initial-collapse-state="collapsed" collapsible="true" id="objects-exercise-2"}

创建一个对象声明，它继承自 `Vehicle` 接口，以创建独特的载具类型：`FlyingSkateboard`。在你的对象中实现 `name` 属性和 `move()` 函数，以便 `main()` 函数中的以下代码成功运行：

|---|---|

```kotlin
interface Vehicle {
    val name: String
    fun move(): String
}

object // 请在此处编写你的代码

fun main() {
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.move()}")
    // Flying Skateboard: Glides through the air with a hover engine
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.fly()}")
    // Flying Skateboard: Woooooooo
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-objects-exercise-2"}

|---|---|
```kotlin
interface Vehicle {
    val name: String
    fun move(): String
}

object FlyingSkateboard : Vehicle {
    override val name = "Flying Skateboard"
    override fun move() = "Glides through the air with a hover engine"

   fun fly(): String = "Woooooooo"
}

fun main() {
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.move()}")
    // Flying Skateboard: Glides through the air with a hover engine
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.fly()}")
    // Flying Skateboard: Woooooooo
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例方案" id="kotlin-tour-objects-solution-2"}

### 练习 3 {initial-collapse-state="collapsed" collapsible="true" id="objects-exercise-3"}

你有一个应用，想记录温度。类本身以摄氏度存储信息，但你希望提供一种简便的方式来创建华氏度实例。完成数据类，以便 `main()` 函数中的以下代码成功运行：

<deflist collapsible="true">
    <def title="提示">
        使用伴生对象。
    </def>
</deflist>

|---|---|
```kotlin
data class Temperature(val celsius: Double) {
    val fahrenheit: Double = celsius * 9 / 5 + 32

    // 请在此处编写你的代码
}

fun main() {
    val fahrenheit = 90.0
    val temp = Temperature.fromFahrenheit(fahrenheit)
    println("${temp.celsius}°C is $fahrenheit °F")
    // 32.22222222222222°C is 90.0 °F
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-objects-exercise-3"}

|---|---|
```kotlin
data class Temperature(val celsius: Double) {
    val fahrenheit: Double = celsius * 9 / 5 + 32

    companion object {
        fun fromFahrenheit(fahrenheit: Double): Temperature = Temperature((fahrenheit - 32) * 5 / 9)
    }
}

fun main() {
    val fahrenheit = 90.0
    val temp = Temperature.fromFahrenheit(fahrenheit)
    println("${temp.celsius}°C is $fahrenheit °F")
    // 32.22222222222222°C is 90.0 °F
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例方案" id="kotlin-tour-objects-solution-3"}

## 下一步

[中级：开放类与特殊类](kotlin-tour-intermediate-open-special-classes.md)