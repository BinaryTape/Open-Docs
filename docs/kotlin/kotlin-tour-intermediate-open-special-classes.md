[//]: # (title: 中级: 开放类和特殊类)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="第一步" /> <a href="kotlin-tour-intermediate-extension-functions.md">扩展函数</a><br />
        <img src="icon-2-done.svg" width="20" alt="第二步" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函数</a><br />
        <img src="icon-3-done.svg" width="20" alt="第三步" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">带接收者的 Lambda 表达式</a><br />
        <img src="icon-4-done.svg" width="20" alt="第四步" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">类和接口</a><br />
        <img src="icon-5-done.svg" width="20" alt="第五步" /> <a href="kotlin-tour-intermediate-objects.md">对象</a><br />
        <img src="icon-6.svg" width="20" alt="第六步" /> <strong>开放类和特殊类</strong><br />
        <img src="icon-7-todo.svg" width="20" alt="第七步" /> <a href="kotlin-tour-intermediate-properties.md">属性</a><br />
        <img src="icon-8-todo.svg" width="20" alt="第八步" /> <a href="kotlin-tour-intermediate-null-safety.md">空安全</a><br />
        <img src="icon-9-todo.svg" width="20" alt="第九步" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">库和 API</a></p>
</tldr>

本章中，你将学习开放类、它们如何与接口协同工作以及 Kotlin 中可用的其他特殊类型的类。

## 开放类

如果你无法使用接口或抽象类，可以通过将类声明为 **open** 来显式地使其可继承。
为此，请在类声明前使用 `open` 关键字：

```kotlin
open class Vehicle
```

要创建一个继承自另一个类的类，请在类头后添加一个冒号，然后调用你希望继承的父类的构造函数：

```kotlin
class Car : Vehicle
```
{validate="false"}

在此示例中，`Car` 类继承自 `Vehicle` 类：

```kotlin
open class Vehicle(val make: String, val model: String)

class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model)

fun main() {
    // Creates an instance of the Car class
    val car = Car("Toyota", "Corolla", 4)

    // Prints the details of the car
    println("Car Info: Make - ${car.make}, Model - ${car.model}, Number of doors - ${car.numberOfDoors}")
    // Car Info: Make - Toyota, Model - Corolla, Number of doors - 4
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-open-class"}

就像创建普通类实例一样，如果你的类继承自父类，那么它必须初始化在父类头中声明的所有参数。因此在此示例中，`Car` 类的 `car` 实例初始化了父类参数：`make` 和 `model`。

### 覆盖继承行为

如果你希望从一个类继承但需要改变其某些行为，可以覆盖（override）继承的行为。

默认情况下，无法覆盖父类的成员函数或属性。就像抽象类一样，你需要添加特殊关键字。

#### 成员函数

为了允许父类中的函数被覆盖，请在其在父类中的声明前使用 `open` 关键字：

```kotlin
open fun displayInfo() {}
```
{validate="false"}

要覆盖继承的成员函数，请在子类中的函数声明前使用 `override` 关键字：

```kotlin
override fun displayInfo() {}
```
{validate="false"}

例如：

```kotlin
open class Vehicle(val make: String, val model: String) {
    open fun displayInfo() {
        println("Vehicle Info: Make - $make, Model - $model")
    }
}

class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model) {
    override fun displayInfo() {
        println("Car Info: Make - $make, Model - $model, Number of Doors - $numberOfDoors")
    }
}

fun main() {
    val car1 = Car("Toyota", "Corolla", 4)
    val car2 = Car("Honda", "Civic", 2)

    // Uses the overridden displayInfo() function
    car1.displayInfo()
    // Car Info: Make - Toyota, Model - Corolla, Number of Doors - 4
    car2.displayInfo()
    // Car Info: Make - Honda, Model - Civic, Number of Doors - 2
}
```
{kotlin-runnable="true" id="kotlin-tour-class-override-function"}

此示例：

*   创建了两个继承自 `Vehicle` 类的 `Car` 类实例：`car1` 和 `car2`。
*   覆盖了 `Car` 类中的 `displayInfo()` 函数，使其也打印车门数量。
*   调用 `car1` 和 `car2` 实例上的被覆盖的 `displayInfo()` 函数。

#### 属性

在 Kotlin 中，通过使用 `open` 关键字使属性可继承并在之后覆盖它，这并非常见做法。大多数情况下，你会使用抽象类或接口，其中属性默认是可继承的。

开放类内部的属性可被其子类访问。通常，最好直接访问它们，而不是用新属性来覆盖它们。

例如，假设你有一个名为 `transmissionType` 的属性，你希望稍后覆盖它。覆盖属性的语法与覆盖成员函数的语法完全相同。你可以这样做：

```kotlin
open class Vehicle(val make: String, val model: String) {
    open val transmissionType: String = "Manual"
}

class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model) {
    override val transmissionType: String = "Automatic"
}
```

然而，这不是一个好的实践。相反，你可以将该属性添加到你的可继承类的构造函数中，并在创建 `Car` 子类时声明其值：

```kotlin
open class Vehicle(val make: String, val model: String, val transmissionType: String = "Manual")

class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model, "Automatic")
```

直接访问属性而不是覆盖它们，可以使代码更简洁、更易读。通过在父类中一次性声明属性并通过构造函数传递它们的值，你消除了子类中不必要的覆盖。

有关类继承和覆盖类行为的更多信息，请参阅[继承](inheritance.md)。

### 开放类和接口

你可以创建一个既继承了类**又**实现了多个接口的类。在这种情况下，你必须先在冒号后声明父类，然后列出接口：

```kotlin
// 定义接口
interface EcoFriendly {
    val emissionLevel: String
}

interface ElectricVehicle {
    val batteryCapacity: Double
}

// 父类
open class Vehicle(val make: String, val model: String)

// 子类
open class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model)

// 继承自 Car 并实现两个接口的新类
class ElectricCar(
    make: String,
    model: String,
    numberOfDoors: Int,
    val capacity: Double,
    val emission: String
) : Car(make, model, numberOfDoors), EcoFriendly, ElectricVehicle {
    override val batteryCapacity: Double = capacity
    override val emissionLevel: String = emission
}
```

## 特殊类

除了抽象类、开放类和数据类，Kotlin 还提供了特殊类型的类，用于各种目的，例如限制特定行为或减少创建小型对象的性能影响。

### 密封类

有时你可能希望限制继承。你可以使用密封类（sealed classes）来做到这一点。密封类是一种特殊的[抽象类](kotlin-tour-intermediate-classes-interfaces.md#abstract-classes)。一旦你声明一个类是密封的，你只能在同一个包中创建它的子类。在此范围之外无法从密封类继承。

> 包是相关类和函数的代码集合，通常位于一个目录中。要了解有关 Kotlin 中包的更多信息，请参阅[包和导入](packages.md)。
> 
{style="tip"}

要创建密封类，请使用 `sealed` 关键字：

```kotlin
sealed class Mammal
```

密封类与 `when` 表达式结合使用时特别有用。通过使用 `when` 表达式，你可以为所有可能的子类定义行为。例如：

```kotlin
sealed class Mammal(val name: String)

class Cat(val catName: String) : Mammal(catName)
class Human(val humanName: String, val job: String) : Mammal(humanName)

fun greetMammal(mammal: Mammal): String {
    when (mammal) {
        is Human -> return "Hello ${mammal.name}; You're working as a ${mammal.job}"
        is Cat -> return "Hello ${mammal.name}"   
    }
}

fun main() {
    println(greetMammal(Cat("Snowy")))
    // Hello Snowy
}
```
{kotlin-runnable="true" id="kotlin-tour-sealed-classes"}

在此示例中：

*   有一个名为 `Mammal` 的密封类，其构造函数中包含 `name` 参数。
*   `Cat` 类继承自 `Mammal` 密封类，并使用 `Mammal` 类中的 `name` 参数作为其自身构造函数中的 `catName` 参数。
*   `Human` 类继承自 `Mammal` 密封类，并使用 `Mammal` 类中的 `name` 参数作为其自身构造函数中的 `humanName` 参数。它在其构造函数中也包含 `job` 参数。
*   `greetMammal()` 函数接受 `Mammal` 类型的参数并返回一个字符串。
*   在 `greetMammal()` 函数体内，有一个 `when` 表达式，它使用 [`is` 运算符](typecasts.md#is-and-is-operators)来检查 `mammal` 的类型并决定执行哪个操作。
*   `main()` 函数使用 `Cat` 类的一个实例和名为 `Snowy` 的 `name` 参数调用 `greetMammal()` 函数。

> 本教程在[空安全](kotlin-tour-intermediate-null-safety.md)章节中更详细地讨论了 `is` 运算符。
> 
{style ="tip"}

有关密封类及其推荐用例的更多信息，请参阅[密封类和接口](sealed-classes.md)。

### 枚举类

当你希望在一个类中表示有限的离散值集时，枚举类（Enum classes）非常有用。枚举类包含枚举常量，这些常量本身就是枚举类的实例。

要创建枚举类，请使用 `enum` 关键字：

```kotlin
enum class State
```

假设你希望创建一个包含不同过程状态的枚举类。每个枚举常量必须用逗号 `,` 分隔：

```kotlin
enum class State {
    IDLE, RUNNING, FINISHED
}
```

`State` 枚举类包含枚举常量：`IDLE`、`RUNNING` 和 `FINISHED`。要访问枚举常量，请使用类名后跟 `.` 和枚举常量的名称：

```kotlin
val state = State.RUNNING
```

你可以使用此枚举类与 `when` 表达式结合，根据枚举常量的值定义要执行的操作：

```kotlin
enum class State {
    IDLE, RUNNING, FINISHED
}

fun main() {
    val state = State.RUNNING
    val message = when (state) {
        State.IDLE -> "It's idle"
        State.RUNNING -> "It's running"
        State.FINISHED -> "It's finished"
    }
    println(message)
    // It's running
}
```
{kotlin-runnable="true" id="kotlin-tour-enum-classes"}

枚举类可以像普通类一样拥有属性和成员函数。 

例如，假设你正在处理 HTML 并希望创建一个包含一些颜色的枚举类。
你希望每种颜色都有一个属性，我们称之为 `rgb`，其中包含其十六进制的 RGB 值。
创建枚举常量时，你必须用此属性来初始化它：

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF),
    YELLOW(0xFFFF00)
}
```

> Kotlin 将十六进制数存储为整数，因此 `rgb` 属性的类型为 `Int`，而不是 `String`。
>
{style="note"}

要向此类添加成员函数，请使用分号 `;` 将其与枚举常量分隔开：

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF),
    YELLOW(0xFFFF00);

    fun containsRed() = (this.rgb and 0xFF0000 != 0)
}

fun main() {
    val red = Color.RED
    
    // 在枚举常量上调用 containsRed() 函数
    println(red.containsRed())
    // true

    // 通过类名在枚举常量上调用 containsRed() 函数
    println(Color.BLUE.containsRed())
    // false
  
    println(Color.YELLOW.containsRed())
    // true
}
```
{kotlin-runnable="true" id="kotlin-tour-interface-enum-classes-members"}

在此示例中，`containsRed()` 成员函数使用 `this` 关键字访问枚举常量的 `rgb` 属性值，并检查十六进制值是否包含 `FF` 作为其最高位，以返回布尔值。

有关更多信息，请参阅[枚举类](enum-classes.md)。

### 内联值类

有时在你的代码中，你可能希望从类中创建小型对象并短暂使用它们。这种方法可能会对性能产生影响。内联值类（Inline value classes）是一种特殊类型的类，可以避免这种性能影响。然而，它们只能包含值。

要创建内联值类，请使用 `value` 关键字和 `@JvmInline` 注解：

```kotlin
@JvmInline
value class Email
```

> `@JvmInline` 注解指示 Kotlin 在编译时优化代码。要了解更多信息，请参阅[注解](annotations.md)。
> 
{style="tip"}

内联值类**必须**在类头中初始化一个单一属性。

假设你希望创建一个收集电子邮件地址的类：

```kotlin
// address 属性在类头中初始化。
@JvmInline
value class Email(val address: String)

fun sendEmail(email: Email) {
    println("Sending email to ${email.address}")
}

fun main() {
    val myEmail = Email("example@example.com")
    sendEmail(myEmail)
    // Sending email to example@example.com
}
```
{kotlin-runnable="true" id="kotlin-tour-inline-value-class"}

在此示例中：

*   `Email` 是一个内联值类，其类头中包含一个属性：`address`。
*   `sendEmail()` 函数接受 `Email` 类型的对象，并将字符串打印到标准输出。
*   `main()` 函数：
    *   创建一个名为 `email` 的 `Email` 类实例。
    *   在 `email` 对象上调用 `sendEmail()` 函数。

通过使用内联值类，你可以使该类内联化，并可以直接在代码中使用它而无需创建对象。这可以显著减少内存占用并提高代码的运行时性能。

有关内联值类的更多信息，请参阅[内联值类](inline-classes.md)。

## 实践

### 练习 1 {initial-collapse-state="collapsed" collapsible="true" id="special-classes-exercise-1"}

你管理着一个配送服务，需要一种方法来跟踪包裹的状态。创建一个名为 `DeliveryStatus` 的密封类，其中包含数据类来表示以下状态：`Pending`（待处理）、`InTransit`（运输中）、`Delivered`（已送达）、`Canceled`（已取消）。完善 `DeliveryStatus` 类声明，使 `main()` 函数中的代码能够成功运行：

|---|---|

```kotlin
sealed class // Write your code here

fun printDeliveryStatus(status: DeliveryStatus) {
    when (status) {
        is DeliveryStatus.Pending -> {
            println("The package is pending pickup from ${status.sender}.")
        }
        is DeliveryStatus.InTransit -> {
            println("The package is in transit and expected to arrive by ${status.estimatedDeliveryDate}.")
        }
        is DeliveryStatus.Delivered -> {
            println("The package was delivered to ${status.recipient} on ${status.deliveryDate}.")
        }
        is DeliveryStatus.Canceled -> {
            println("The delivery was canceled due to: ${status.reason}.")
        }
    }
}

fun main() {
    val status1: DeliveryStatus = DeliveryStatus.Pending("Alice")
    val status2: DeliveryStatus = DeliveryStatus.InTransit("2024-11-20")
    val status3: DeliveryStatus = DeliveryStatus.Delivered("2024-11-18", "Bob")
    val status4: DeliveryStatus = DeliveryStatus.Canceled("Address not found")

    printDeliveryStatus(status1)
    // The package is pending pickup from Alice.
    printDeliveryStatus(status2)
    // The package is in transit and expected to arrive by 2024-11-20.
    printDeliveryStatus(status3)
    // The package was delivered to Bob on 2024-11-18.
    printDeliveryStatus(status4)
    // The delivery was canceled due to: Address not found.
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-special-classes-exercise-1"}

|---|---|
```kotlin
sealed class DeliveryStatus {
    data class Pending(val sender: String) : DeliveryStatus()
    data class InTransit(val estimatedDeliveryDate: String) : DeliveryStatus()
    data class Delivered(val deliveryDate: String, val recipient: String) : DeliveryStatus()
    data class Canceled(val reason: String) : DeliveryStatus()
}

fun printDeliveryStatus(status: DeliveryStatus) {
    when (status) {
        is DeliveryStatus.Pending -> {
            println("The package is pending pickup from ${status.sender}.")
        }
        is DeliveryStatus.InTransit -> {
            println("The package is in transit and expected to arrive by ${status.estimatedDeliveryDate}.")
        }
        is DeliveryStatus.Delivered -> {
            println("The package was delivered to ${status.recipient} on ${status.deliveryDate}.")
        }
        is DeliveryStatus.Canceled -> {
            println("The delivery was canceled due to: ${status.reason}.")
        }
    }
}

fun main() {
    val status1: DeliveryStatus = DeliveryStatus.Pending("Alice")
    val status2: DeliveryStatus = DeliveryStatus.InTransit("2024-11-20")
    val status3: DeliveryStatus = DeliveryStatus.Delivered("2024-11-18", "Bob")
    val status4: DeliveryStatus = DeliveryStatus.Canceled("Address not found")

    printDeliveryStatus(status1)
    // The package is pending pickup from Alice.
    printDeliveryStatus(status2)
    // The package is in transit and expected to arrive by 2024-11-20.
    printDeliveryStatus(status3)
    // The package was delivered to Bob on 2024-11-18.
    printDeliveryStatus(status4)
    // The delivery was canceled due to: Address not found.
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-special-classes-solution-1"}

### 练习 2 {initial-collapse-state="collapsed" collapsible="true" id="special-classes-exercise-2"}

在你的程序中，你希望能够处理不同状态和类型的错误。你有一个密封类来捕获不同状态，这些状态在数据类或对象中声明。通过创建一个名为 `Problem` 的枚举类来表示不同问题类型：`NETWORK`（网络）、`TIMEOUT`（超时）和 `UNKNOWN`（未知），从而完善以下代码。

|---|---|

```kotlin
sealed class Status {
    data object Loading : Status()
    data class Error(val problem: Problem) : Status() {
        // Write your code here
    }

    data class OK(val data: List<String>) : Status()
}

fun handleStatus(status: Status) {
    when (status) {
        is Status.Loading -> println("Loading...")
        is Status.OK -> println("Data received: ${status.data}")
        is Status.Error -> when (status.problem) {
            Status.Error.Problem.NETWORK -> println("Network issue")
            Status.Error.Problem.TIMEOUT -> println("Request timed out")
            Status.Error.Problem.UNKNOWN -> println("Unknown error occurred")
        }
    }
}

fun main() {
    val status1: Status = Status.Error(Status.Error.Problem.NETWORK)
    val status2: Status = Status.OK(listOf("Data1", "Data2"))

    handleStatus(status1)
    // Network issue
    handleStatus(status2)
    // Data received: [Data1, Data2]
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-special-classes-exercise-2"}

|---|---|
```kotlin
sealed class Status {
    data object Loading : Status()
    data class Error(val problem: Problem) : Status() {
        enum class Problem {
            NETWORK,
            TIMEOUT,
            UNKNOWN
        }
    }

    data class OK(val data: List<String>) : Status()
}

fun handleStatus(status: Status) {
    when (status) {
        is Status.Loading -> println("Loading...")
        is Status.OK -> println("Data received: ${status.data}")
        is Status.Error -> when (status.problem) {
            Status.Error.Problem.NETWORK -> println("Network issue")
            Status.Error.Problem.TIMEOUT -> println("Request timed out")
            Status.Error.Problem.UNKNOWN -> println("Unknown error occurred")
        }
    }
}

fun main() {
    val status1: Status = Status.Error(Status.Error.Problem.NETWORK)
    val status2: Status = Status.OK(listOf("Data1", "Data2"))

    handleStatus(status1)
    // Network issue
    handleStatus(status2)
    // Data received: [Data1, Data2]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-special-classes-solution-2"}

## 下一步

[中级：属性](kotlin-tour-intermediate-properties.md)