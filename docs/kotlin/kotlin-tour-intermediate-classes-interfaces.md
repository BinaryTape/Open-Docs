[//]: # (title: 中级：类和接口)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">扩展函数</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函数</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">带接收者的 Lambda 表达式</a><br />
        <img src="icon-4.svg" width="20" alt="Fourth step" /> <strong>类和接口</strong><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">对象</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">开放类和特殊类</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">属性</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">空安全</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">库和 API</a></p>
</tldr>

在初级教程中，你学习了如何使用类和数据类来存储数据并维护一组可以在代码中共享的特性。最终，你将希望创建一个层次结构，以便在项目中高效地共享代码。本章解释了 Kotlin 提供的共享代码的选项，以及它们如何使你的代码更安全、更易于维护。

## 类继承

在之前的章节中，我们介绍了如何使用扩展函数来扩展类而无需修改原始源代码。但是，如果你正在处理一个复杂的问题，并且在类**之间**共享代码会很有用呢？在这种情况下，你可以使用类继承。

默认情况下，Kotlin 中的类不能被继承。Kotlin 这样设计是为了防止意外继承，并使你的类更易于维护。

Kotlin 类只支持**单一继承**，这意味着一次只能继承**一个类**。这个类被称为**父类**。

一个类的父类会继承自另一个类（祖父类），从而形成一个层次结构。在 Kotlin 的类层次结构的最顶层是共同的父类：`Any`。所有类最终都继承自 `Any` 类：

![Any 类型类层次结构的示例](any-type-class.png){width="200"}

`Any` 类会自动提供 `toString()` 函数作为成员函数。因此，你可以在你的任何类中使用这个继承的函数。例如：

```kotlin
class Car(val make: String, val model: String, val numberOfDoors: Int)

fun main() {
    //sampleStart
    val car1 = Car("Toyota", "Corolla", 4)

    // 使用字符串模板通过 .toString() 函数打印类属性
    println("Car1: make=${car1.make}, model=${car1.model}, numberOfDoors=${car1.numberOfDoors}")
    // Car1: make=Toyota, model=Corolla, numberOfDoors=4
    //sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-any-class"}

如果你想使用继承来在类之间共享一些代码，首先考虑使用抽象类。

### 抽象类

抽象类默认可以被继承。抽象类的目的是提供其他类可以继承或实现的成员。因此，它们有构造函数，但你不能从中创建实例。在子类中，你使用 `override` 关键字定义父类的属性和函数的行为。通过这种方式，你可以说子类“覆盖”了父类的成员。

> 当你定义继承的函数或属性的行为时，我们称之为**实现**。
>
{style="tip"}

抽象类可以包含**带有**实现的函数和属性，也可以包含**没有**实现的函数和属性，后者被称为抽象函数和属性。

要创建抽象类，请使用 `abstract` 关键字：

```kotlin
abstract class Animal
```

要声明**没有**实现的函数或属性，你也要使用 `abstract` 关键字：

```kotlin
abstract fun makeSound()
abstract val sound: String
```

例如，假设你想创建一个名为 `Product` 的抽象类，你可以从中创建子类来定义不同的产品类别：

```kotlin
abstract class Product(val name: String, var price: Double) {
    // 产品的抽象属性
    abstract val category: String

    // 所有产品都可以共享的函数
    fun productInfo(): String {
        return "Product: $name, Category: $category, Price: $price"
    }
}
```

在这个抽象类中：

*   构造函数有两个参数，分别用于产品的 `name` 和 `price`。
*   有一个抽象属性，包含产品类别作为字符串。
*   有一个函数，用于打印产品信息。

让我们为电子产品创建一个子类。在子类中定义 `category` 属性的实现之前，你必须使用 `override` 关键字：

```kotlin
class Electronic(name: String, price: Double, val warranty: Int) : Product(name, price) {
    override val category = "Electronic"
}
```

`Electronic` 类：

*   继承自 `Product` 抽象类。
*   构造函数中有一个额外的参数：`warranty`，这是电子产品特有的。
*   覆盖了 `category` 属性，使其包含字符串 `"Electronic"`。

现在，你可以这样使用这些类：

```kotlin
abstract class Product(val name: String, var price: Double) {
    // 产品的抽象属性
    abstract val category: String

    // 所有产品都可以共享的函数
    fun productInfo(): String {
        return "Product: $name, Category: $category, Price: $price"
    }
}

class Electronic(name: String, price: Double, val warranty: Int) : Product(name, price) {
    override val category = "Electronic"
}

//sampleStart
fun main() {
    // 创建 Electronic 类的实例
    val laptop = Electronic(name = "Laptop", price = 1000.0, warranty = 2)

    println(laptop.productInfo())
    // Product: Laptop, Category: Electronic, Price: 1000.0
}
//sampleEnd
```
{kotlin-runnable="true" id="kotlin-tour-abstract-class"}

尽管抽象类以这种方式共享代码非常有用，但它们受到限制，因为 Kotlin 中的类只支持单一继承。如果你需要从多个来源继承，请考虑使用接口。

## 接口

接口与类相似，但它们有一些不同之处：

*   你不能创建接口的实例。它们没有构造函数或头部。
*   它们的函数和属性默认是隐式可继承的。在 Kotlin 中，我们说它们是“开放的”。
*   如果你不给它们的函数实现，你不需要将它们标记为 `abstract`。

与抽象类类似，你使用接口来定义一组函数和属性，这些函数和属性可以在以后由类继承和实现。这种方法有助于你专注于接口所描述的抽象，而不是具体的实现细节。使用接口可以使你的代码：

*   更模块化，因为它隔离了不同的部分，允许它们独立演进。
*   通过将相关函数分组到一个内聚的集合中，更容易理解。
*   更易于测试，因为你可以快速用模拟对象替换实现进行测试。

要声明接口，请使用 `interface` 关键字：

```kotlin
interface PaymentMethod
```

### 接口实现

接口支持多重继承，因此一个类可以同时实现多个接口。首先，让我们考虑一个类实现**一个**接口的场景。

要创建一个实现接口的类，在类头部后添加冒号，然后是要实现的接口名称。你不需要在接口名称后面使用括号 `()`，因为接口没有构造函数：

```kotlin
class CreditCardPayment : PaymentMethod
```

例如：

```kotlin
interface PaymentMethod {
    // 函数默认可继承
    fun initiatePayment(amount: Double): String
}

class CreditCardPayment(val cardNumber: String, val cardHolderName: String, val expiryDate: String) : PaymentMethod {
    override fun initiatePayment(amount: Double): String {
        // 模拟使用信用卡处理支付
        return "Payment of $amount initiated using Credit Card ending in ${cardNumber.takeLast(4)}."
    }
}

fun main() {
    val paymentMethod = CreditCardPayment("1234 5678 9012 3456", "John Doe", "12/25")
    println(paymentMethod.initiatePayment(100.0))
    // Payment of $100.0 initiated using Credit Card ending in 3456.
}
```
{kotlin-runnable="true" id="kotlin-tour-interface-inheritance"}

在此示例中：

*   `PaymentMethod` 是一个接口，它有一个没有实现的 `initiatePayment()` 函数。
*   `CreditCardPayment` 是一个实现 `PaymentMethod` 接口的类。
*   `CreditCardPayment` 类覆盖了继承的 `initiatePayment()` 函数。
*   `paymentMethod` 是 `CreditCardPayment` 类的一个实例。
*   在 `paymentMethod` 实例上调用了被覆盖的 `initiatePayment()` 函数，参数为 `100.0`。

要创建一个实现**多个**接口的类，在类头部后添加冒号，然后是用逗号分隔的要实现的接口名称：

```kotlin
class CreditCardPayment : PaymentMethod, PaymentType
```

例如：

```kotlin
interface PaymentMethod {
    fun initiatePayment(amount: Double): String
}

interface PaymentType {
    val paymentType: String
}

class CreditCardPayment(val cardNumber: String, val cardHolderName: String, val expiryDate: String) : PaymentMethod,
    PaymentType {
    override fun initiatePayment(amount: Double): String {
        // 模拟使用信用卡处理支付
        return "Payment of $amount initiated using Credit Card ending in ${cardNumber.takeLast(4)}."
    }

    override val paymentType: String = "Credit Card"
}

fun main() {
    val paymentMethod = CreditCardPayment("1234 5678 9012 3456", "John Doe", "12/25")
    println(paymentMethod.initiatePayment(100.0))
    // Payment of $100.0 initiated using Credit Card ending in 3456.

    println("Payment is by ${paymentMethod.paymentType}")
    // Payment is by Credit Card
}
```
{kotlin-runnable="true" id="kotlin-tour-interface-multiple-inheritance"}

在此示例中：

*   `PaymentMethod` 是一个接口，它有一个没有实现的 `initiatePayment()` 函数。
*   `PaymentType` 是一个接口，它有一个未初始化的 `paymentType` 属性。
*   `CreditCardPayment` 是一个实现 `PaymentMethod` 和 `PaymentType` 接口的类。
*   `CreditCardPayment` 类覆盖了继承的 `initiatePayment()` 函数和 `paymentType` 属性。
*   `paymentMethod` 是 `CreditCardPayment` 类的一个实例。
*   在 `paymentMethod` 实例上调用了被覆盖的 `initiatePayment()` 函数，参数为 `100.0`。
*   在 `paymentMethod` 实例上访问了被覆盖的 `paymentType` 属性。

有关接口和接口继承的更多信息，请参阅[接口](interfaces.md)。

## 委托

接口很有用，但如果你的接口包含许多函数，子类最终可能会有很多样板代码。当你只想覆盖父类行为的一小部分时，你需要重复编写很多代码。

> 样板代码是软件项目中重复使用很少或没有修改的代码块。
>
{style="tip"}

例如，假设你有一个名为 `Drawable` 的接口，它包含许多函数和一个名为 `color` 的属性：

```kotlin
interface Drawable {
    fun draw()
    fun resize()
    val color: String?
}
```

你创建了一个名为 `Circle` 的类，它实现了 `Drawable` 接口并为其所有成员提供了实现：

```kotlin
class Circle : Drawable {
    override fun draw() {
        TODO("An example implementation")
    }

    override fun resize() {
        TODO("An example implementation")
    }
   override val color = null
}
```

如果你想创建一个 `Circle` 类的子类，它除了 `color` 属性的值外，具有相同的行为，你仍然需要为 `Circle` 类的每个成员函数添加实现：

```kotlin
class RedCircle(val circle: Circle) : Circle {

    // 样板代码开始
    override fun draw() {
        circle.draw()
    }

    override fun resize() {
        circle.resize()
    }

    // 样板代码结束
    override val color = "red"
}
```

你可以看到，如果 `Drawable` 接口中有大量成员函数，`RedCircle` 类中的样板代码量会非常大。然而，还有另一种选择。

在 Kotlin 中，你可以使用委托将接口实现委托给类的实例。例如，你可以创建 `Circle` 类的一个实例，并将 `Circle` 类的成员函数的实现委托给这个实例。为此，请使用 `by` 关键字。例如：

```kotlin
class RedCircle(param: Circle) : Drawable by param
```

在这里，`param` 是 `Circle` 类实例的名称，成员函数的实现被委托给了它。

现在你不需要在 `RedCircle` 类中为成员函数添加实现。编译器会自动从 `Circle` 类为你完成这项工作。这可以让你免于编写大量样板代码。相反，你只为你想要改变的子类行为添加代码。

例如，如果你想改变 `color` 属性的值：

```kotlin
class RedCircle(param : Circle) : Drawable by param {
    // 没有样板代码！
    override val color = "red"
}
```

如果你愿意，你也可以在 `RedCircle` 类中覆盖继承的成员函数的行为，但现在你不需要为每个继承的成员函数添加新行代码。

更多信息，请参见[委托](delegation.md)。

## 练习

### 练习 1 {initial-collapse-state="collapsed" collapsible="true" id="classes-interfaces-exercise-1"}

假设你正在开发一个智能家居系统。智能家居通常有不同类型的设备，它们都具有一些基本功能，但也有独特的行为。在下面的代码示例中，完成名为 `SmartDevice` 的 `abstract` 类，以便子类 `SmartLight` 能够成功编译。

然后，创建另一个名为 `SmartThermostat` 的子类，它继承自 `SmartDevice` 类并实现 `turnOn()` 和 `turnOff()` 函数，这些函数返回打印语句，描述哪个恒温器正在加热或已关闭。最后，添加另一个名为 `adjustTemperature()` 的函数，它接受一个温度测量作为输入并打印：`$name thermostat set to $temperature°C.`

<deflist collapsible="true">
    <def title="提示">
        在 <code>SmartDevice</code> 类中，添加 <code>turnOn()</code> 和 <code>turnOff()</code> 函数，以便稍后可以在 <code>SmartThermostat</code> 类中覆盖它们的行为。
    </def>
</deflist>

|--|--|

```kotlin
abstract class // Write your code here

class SmartLight(name: String) : SmartDevice(name) {
    override fun turnOn() {
        println("$name is now ON.")
    }

    override fun turnOff() {
        println("$name is now OFF.")
    }

   fun adjustBrightness(level: Int) {
        println("Adjusting $name brightness to $level%.")
    }
}

class SmartThermostat // Write your code here

fun main() {
    val livingRoomLight = SmartLight("Living Room Light")
    val bedroomThermostat = SmartThermostat("Bedroom Thermostat")

    livingRoomLight.turnOn()
    // Living Room Light is now ON.
    livingRoomLight.adjustBrightness(10)
    // Adjusting Living Room Light brightness to 10%.
    livingRoomLight.turnOff()
    // Living Room Light is now OFF.

    bedroomThermostat.turnOn()
    // Bedroom Thermostat thermostat is now heating.
    bedroomThermostat.adjustTemperature(5)
    // Bedroom Thermostat thermostat set to 5°C.
    bedroomThermostat.turnOff()
    // Bedroom Thermostat thermostat is now off.
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-interfaces-exercise-1"}

|---|---|
```kotlin
abstract class SmartDevice(val name: String) {
    abstract fun turnOn()
    abstract fun turnOff()
}

class SmartLight(name: String) : SmartDevice(name) {
    override fun turnOn() {
        println("$name is now ON.")
    }

    override fun turnOff() {
        println("$name is now OFF.")
    }

   fun adjustBrightness(level: Int) {
        println("Adjusting $name brightness to $level%.")
    }
}

class SmartThermostat(name: String) : SmartDevice(name) {
    override fun turnOn() {
        println("$name thermostat is now heating.")
    }

    override fun turnOff() {
        println("$name thermostat is now off.")
    }

   fun adjustTemperature(temperature: Int) {
        println("$name thermostat set to $temperature°C.")
    }
}

fun main() {
    val livingRoomLight = SmartLight("Living Room Light")
    val bedroomThermostat = SmartThermostat("Bedroom Thermostat")

    livingRoomLight.turnOn()
    // Living Room Light is now ON.
    livingRoomLight.adjustBrightness(10)
    // Adjusting Living Room Light brightness to 10%.
    livingRoomLight.turnOff()
    // Living Room Light is now OFF.

    bedroomThermostat.turnOn()
    // Bedroom Thermostat thermostat is now heating.
    bedroomThermostat.adjustTemperature(5)
    // Bedroom Thermostat thermostat set to 5°C.
    bedroomThermostat.turnOff()
    // Bedroom Thermostat thermostat is now off.
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-classes-interfaces-solution-1"}

### 练习 2 {initial-collapse-state="collapsed" collapsible="true" id="classes-interfaces-exercise-2"}

创建一个名为 `Media` 的接口，你可以用它来实现特定的媒体类，如 `Audio`、`Video` 或 `Podcast`。你的接口必须包含：

*   一个名为 `title` 的属性，用于表示媒体的标题。
*   一个名为 `play()` 的函数，用于播放媒体。

然后，创建一个名为 `Audio` 的类，实现 `Media` 接口。`Audio` 类必须在其构造函数中使用 `title` 属性，并额外拥有一个名为 `composer` 的 `String` 类型属性。在该类中，实现 `play()` 函数以打印以下内容：`"Playing audio: $title, composed by $composer"`。

<deflist collapsible="true">
    <def title="提示">
        你可以在类头中使用 <code>override</code> 关键字在构造函数中实现接口的属性。
    </def>
</deflist>

|---|---|
```kotlin
interface // Write your code here

class // Write your code here

fun main() {
    val audio = Audio("Symphony No. 5", "Beethoven")
    audio.play()
   // Playing audio: Symphony No. 5, composed by Beethoven
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-interfaces-exercise-2"}

|---|---|
```kotlin
interface Media {
    val title: String
    fun play()
}

class Audio(override val title: String, val composer: String) : Media {
    override fun play() {
        println("Playing audio: $title, composed by $composer")
    }
}

fun main() {
    val audio = Audio("Symphony No. 5", "Beethoven")
    audio.play()
   // Playing audio: Symphony No. 5, composed by Beethoven
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-classes-interfaces-solution-2"}

### 练习 3 {initial-collapse-state="collapsed" collapsible="true" id="classes-interfaces-exercise-3"}

你正在为电子商务应用程序构建一个支付处理系统。每种支付方式都需要能够授权支付并处理交易。某些支付还需要能够处理退款。

1.  在 `Refundable` 接口中，添加一个名为 `refund()` 的函数来处理退款。

2.  在 `PaymentMethod` 抽象类中：
    *   添加一个名为 `authorize()` 的函数，它接受一个金额并打印包含该金额的消息。
    *   添加一个名为 `processPayment()` 的抽象函数，它也接受一个金额。

3.  创建一个名为 `CreditCard` 的类，它实现 `Refundable` 接口和 `PaymentMethod` 抽象类。在该类中，为 `refund()` 和 `processPayment()` 函数添加实现，以便它们打印以下语句：
    *   `"Refunding $amount to the credit card."`
    *   `"Processing credit card payment of $amount."`

|---|---|
```kotlin
interface Refundable {
    // Write your code here
}

abstract class PaymentMethod(val name: String) {
    // Write your code here
}

class CreditCard // Write your code here

fun main() {
    val visa = CreditCard("Visa")

    visa.authorize(100.0)
    // Authorizing payment of $100.0.
    visa.processPayment(100.0)
    // Processing credit card payment of $100.0.
    visa.refund(50.0)
    // Refunding $50.0 to the credit card.
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-interfaces-exercise-3"}

|---|---|
```kotlin
interface Refundable {
    fun refund(amount: Double)
}

abstract class PaymentMethod(val name: String) {
    fun authorize(amount: Double) {
        println("Authorizing payment of $amount.")
    }

    abstract fun processPayment(amount: Double)
}

class CreditCard(name: String) : PaymentMethod(name), Refundable {
    override fun processPayment(amount: Double) {
        println("Processing credit card payment of $amount.")
    }

    override fun refund(amount: Double) {
        println("Refunding $amount to the credit card.")
    }
}

fun main() {
    val visa = CreditCard("Visa")

    visa.authorize(100.0)
    // Authorizing payment of $100.0.
    visa.processPayment(100.0)
    // Processing credit card payment of $100.0.
    visa.refund(50.0)
    // Refunding $50.0 to the credit card.
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-classes-interfaces-solution-3"}

### 练习 4 {initial-collapse-state="collapsed" collapsible="true" id="classes-interfaces-exercise-4"}

你有一个简单的消息应用程序，它有一些基本功能，但你希望为_智能_消息添加一些功能，而无需大量重复代码。

在下面的代码中，定义一个名为 `SmartMessenger` 的类，它继承自 `BasicMessenger` 类，但将实现委托给 `BasicMessenger` 类的一个实例。

在 `SmartMessenger` 类中，覆盖 `sendMessage()` 函数以发送智能消息。该函数必须接受一个 `message` 作为输入，并返回一个打印语句：`"Sending a smart message: $message"`。此外，调用 `BasicMessenger` 类中的 `sendMessage()` 函数，并在消息前加上 `[smart]`。

> 你不需要在 `SmartMessenger` 类中重写 `receiveMessage()` 函数。
>
{style="note"}

|--|--|

```kotlin
interface Messenger {
    fun sendMessage(message: String)
    fun receiveMessage(): String
}

class BasicMessenger : Messenger {
    override fun sendMessage(message: String) {
        println("Sending message: $message")
    }

    override fun receiveMessage(): String {
        return "You've got a new message!"
    }
}

class SmartMessenger // Write your code here

fun main() {
    val basicMessenger = BasicMessenger()
    val smartMessenger = SmartMessenger(basicMessenger)

    basicMessenger.sendMessage("Hello!")
    // Sending message: Hello!
    println(smartMessenger.receiveMessage())
    // You've got a new message!
    smartMessenger.sendMessage("Hello from SmartMessenger!")
    // Sending a smart message: Hello from SmartMessenger!
    // Sending message: [smart] Hello from SmartMessenger!
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-interfaces-exercise-4"}

|---|---|
```kotlin
interface Messenger {
    fun sendMessage(message: String)
    fun receiveMessage(): String
}

class BasicMessenger : Messenger {
    override fun sendMessage(message: String) {
        println("Sending message: $message")
    }

    override fun receiveMessage(): String {
        return "You've got a new message!"
    }
}

class SmartMessenger(val basicMessenger: BasicMessenger) : Messenger by basicMessenger {
    override fun sendMessage(message: String) {
        println("Sending a smart message: $message")
        basicMessenger.sendMessage("[smart] $message")
    }
}

fun main() {
    val basicMessenger = BasicMessenger()
    val smartMessenger = SmartMessenger(basicMessenger)

    basicMessenger.sendMessage("Hello!")
    // Sending message: Hello!
    println(smartMessenger.receiveMessage())
    // You've got a new message!
    smartMessenger.sendMessage("Hello from SmartMessenger!")
    // Sending a smart message: Hello from SmartMessenger!
    // Sending message: [smart] Hello from SmartMessenger!
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-classes-interfaces-solution-4"}

## 下一步

[中级：对象](kotlin-tour-intermediate-objects.md)