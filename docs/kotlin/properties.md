[//]: # (title: 属性)

在 Kotlin 中，属性允许您存储和管理数据，而无需编写用于访问或修改数据的函数。
您可以在 [类](classes.md)、[接口](interfaces.md)、[对象](object-declarations.md)、[伴生对象](object-declarations.md#companion-objects) 中使用属性，甚至可以在这些结构之外将其作为顶层属性使用。

每个属性都有一个名称、一个类型，以及一个自动生成的名为 getter 的 `get()` 函数。您可以使用 getter 来读取属性的值。如果属性是可变的，它还有一个名为 setter 的 `set()` 函数，允许您修改属性的值。

> Getter 和 setter 被称为 *访问器*。
> 
{style="tip"}

## 声明属性

属性可以是可变的 (`var`) 或只读的 (`val`)。
您可以将它们作为顶层属性在 `.kt` 文件中声明。可以将顶层属性视为属于某个软件包的全局变量：

```kotlin
// 文件：Constants.kt
package my.app

val pi = 3.14159
var counter = 0
```

您还可以在类、接口或对象内部声明属性：

```kotlin
// 带有属性的类
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
}

// 带有属性的接口
interface ContactInfo {
    val email: String
}

// 带有属性的对象
object Company {
    var name: String = "Detective Inc."
    val country: String = "UK"
}

// 实现接口的类
class PersonContact : ContactInfo {
    override val email: String = "sherlock@example.com"
}
```

要使用属性，请通过其名称进行引用：

```kotlin
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
}

interface ContactInfo {
    val email: String
}

object Company {
    var name: String = "Detective Inc."
    val country: String = "UK"
}

class PersonContact : ContactInfo {
    override val email: String = "sherlock@example.com"
}

//sampleStart
fun copyAddress(address: Address): Address {
    val result = Address()
    // 访问 result 实例中的属性
    result.name = address.name
    result.street = address.street
    result.city = address.city
    return result
}

fun main() {
    val sherlockAddress = Address()
    val copy = copyAddress(sherlockAddress)
    // 访问 copy 实例中的属性
    println("Copied address: ${copy.name}, ${copy.street}, ${copy.city}")
    // Copied address: Holmes, Sherlock, Baker, London

    // 访问 Company 对象中的属性
    println("Company: ${Company.name} in ${Company.country}")
    // Company: Detective Inc. in UK
    
    val contact = PersonContact()
    // 访问 contact 实例中的属性
    println("Email: ${contact.email}")
    // Email: sherlock@email.com
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-access-properties"}

在 Kotlin 中，我们建议在声明属性时对其进行初始化，以保持代码安全且易于阅读。不过，在特殊情况下，您可以 [稍后初始化它们](#延迟初始化属性和变量)。

如果编译器可以从初始值设定项或 getter 的返回值类型中推断出属性类型，则可以省略类型声明：

```kotlin
var initialized = 1 // 推断类型为 Int
var allByDefault    // 错误：属性必须初始化
```
{validate="false"}

## 自定义 getter 和 setter

默认情况下，Kotlin 会自动生成 getter 和 setter。当您需要额外的逻辑（例如验证、格式设置或基于其他属性的计算）时，可以定义自己的自定义访问器。

每次访问属性时都会运行自定义 getter：

```kotlin
//sampleStart
class Rectangle(val width: Int, val height: Int) {
    val area: Int
        get() = this.width * this.height
}
//sampleEnd
fun main() {
    val rectangle = Rectangle(3, 4)
    println("Width=${rectangle.width}, height=${rectangle.height}, area=${rectangle.area}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-custom-getter"}

如果编译器可以从 getter 中推断出类型，则可以省略类型：

```kotlin
val area get() = this.width * this.height
```

除了初始化期间外，每次为您向属性赋值时，自定义 setter 都会运行。按照约定，setter 形参的名称是 `value`，但您可以选择不同的名称：

```kotlin
class Point(var x: Int, var y: Int) {
    var coordinates: String
        get() = "$x,$y"
        set(value) {
            val parts = value.split(",")
            x = parts[0].toInt()
            y = parts[1].toInt()
        }
}

fun main() {
    val location = Point(1, 2)
    println(location.coordinates) 
    // 1,2

    location.coordinates = "10,20"
    println("${location.x}, ${location.y}") 
    // 10, 20
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-custom-setter"}

### 更改可见性或添加注解

在 Kotlin 中，您可以更改访问器的可见性或添加 [注解](annotations.md)，而无需替换默认实现。您不必在主体 `{}` 内进行这些更改。

要更改访问器的可见性，请在 `get` 或 `set` 关键字之前使用修饰符：

```kotlin
class BankAccount(initialBalance: Int) {
    var balance: Int = initialBalance
        // 只有类本身可以修改余额
        private set 

    fun deposit(amount: Int) {
        if (amount > 0) balance += amount
    }

    fun withdraw(amount: Int) {
        if (amount > 0 && amount <= balance) balance -= amount
    }
}

fun main() {
    val account = BankAccount(100)
    println("Initial balance: ${account.balance}") 
    // 100

    account.deposit(50)
    println("After deposit: ${account.balance}") 
    // 150

    account.withdraw(70)
    println("After withdrawal: ${account.balance}") 
    // 80

    // account.balance = 1000  
    // 错误：由于 setter 是私有的，无法赋值
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-private-setter"}

要为访问器添加注解，请在 `get` 或 `set` 关键字之前使用注解：

```kotlin
// 定义一个可以应用于 getter 的注解
@Target(AnnotationTarget.PROPERTY_GETTER)
annotation class Inject

class Service {
    var dependency: String = "Default Service"
        // 为 getter 添加注解
        @Inject get 
}

fun main() {
    val service = Service()
    println(service.dependency)
    // Default service
    println(service::dependency.getter.annotations)
    // [@Inject()]
    println(service::dependency.setter.annotations)
    // []
}
```
{validate="false"}

此示例使用 [反射](reflection.md) 来显示 getter 和 setter 上存在哪些注解。

## 支持字段

当需要将值存储在内存中时，编译器会自动为属性生成支持字段。

例如，当您使用默认的 `get()` 和 `set()` 函数时，编译器会创建一个支持字段，因为它们需要读取和写入存储的值：

```kotlin
var count = 0
```

您可以在 [自定义 `get()` 或 `set()` 函数](#自定义-getter-和-setter) 中使用 `field` 关键字来访问支持字段。例如，您可以为 getter 或 setter 添加额外的逻辑，或者在属性更改时触发额外的操作。

在此示例中，`score` 属性在 `set()` 函数内部使用了支持字段，以便在更新值时触发日志记录事件：

```kotlin
class Scoreboard {
    var score: Int = 0
        set(value) {
            field = value
            // 更新值时添加日志记录
            println("Score updated to $field")
        }
}

fun main() {
    val board = Scoreboard()
    board.score = 10  
    // Score updated to 10
    board.score = 20  
    // Score updated to 20
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-backing-field"}

并非所有属性都会默认创建支持字段，因为有些属性可能不需要它们。例如，`isEmpty` 属性没有支持字段，因为每次访问它时，它的值都是根据 `size` 属性计算得出的：

```kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

### 显式支持字段

有时您可能需要更高的灵活性。例如，如果您有一个 API，希望能在内部修改属性但在外部不可修改。在这种情况下，您可以使用 *显式支持字段*。

在以下示例中，`ShoppingCart` 类具有一个 `items` 属性，代表购物车中的所有商品。该类将 `items` 属性作为只读字符串列表公开，但在内部，它使用显式支持字段将数据存储在可变列表中：

```kotlin
class ShoppingCart {
    // 带有显式支持字段的公共只读视图
    val items: List<String>
        field = mutableListOf()
    
    fun addItem(item: String) {
        items.add(item)
    }

    fun removeItem(item: String) {
        items.remove(item)
    }
}

fun main() {
    val cart = ShoppingCart()
    cart.addItem("Apple")
    cart.addItem("Banana")

    println(cart.items) 
    // [Apple, Banana]
    
    cart.removeItem("Apple")
    println(cart.items) 
    // [Banana]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.4" id="kotlin-explicit-backing-field"}

在此示例中，编译器从 `mutableListOf()` 调用中推断出支持字段的类型：`MutableList<String>`。您也可以显式声明支持字段的类型：

```kotlin
val items: List<String>
    // 带有显式类型的显式支持字段
    field: MutableList<String> = mutableListOf()
```
{validate="false"}

在 `ShoppingCart` 类的示例中，编译器将 `items` 属性智能转换为 `MutableList<String>` 类型，因此该类可以通过 `add()` 和 `remove()` 函数在购物车中添加和移除商品。在类外部，编译器使用公共属性类型 `List<String>`，因此 API 用户只能读取 `items` 列表中的内容。

#### 限制

要使用显式支持字段，其属性和支持字段本身必须遵循某些规则。属性仅在满足以下条件时才能拥有显式支持字段：

* 没有自定义 getter。
* 是只读的 (`val`)。
* 不是 `open`。
* 不是 [委托属性](delegated-properties.md)。
* 不是 [编译时常量](#编译时常量)。

此外，支持字段的类型必须是属性类型的子类型，并具有 [`private` 可见性](visibility-modifiers.md)。

如果显式支持字段不符合您的要求，您可以使用幕后属性作为替代方案。

### 幕后属性

如果显式支持字段不适合您的用例，您可以尝试使用一种称为 *幕后属性* 的编码模式。

例如，如果您的属性需要自定义 getter：

```kotlin
class UserDirectory {
    private val _users = mutableListOf(
        "sarah",
        "mike",
        "emma"
    )

    val users: List<String>
        get() = _users.sorted()

    fun addUser(username: String) {
        _users.add(username)
    }
}

fun main() {
    val directory = UserDirectory()

    directory.addUser("alex")
    println(directory.users)
    // [alex, emma, mike, sarah]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-backing-property-custom-getter"}

> 在为幕后属性命名时，请使用前导下划线，以符合 Kotlin [编码约定](coding-conventions.md#names-for-backing-properties)。
>
{style="tip"}

在此示例中，`UserDirectory` 类具有一个只读的 `users` 属性，用于列出目录中的每个用户。`_users` 变量是包含真实列表的私有幕后属性。公共 `users` 属性的 getter 在返回条目之前会对其进行排序。

## 编译时常量

如果只读属性的值在编译时就已知，请使用 `const` 修饰符将其标记为 *编译时常量*。编译时常量会在编译时内联，因此每个引用都会被替换为其具体值。访问它们更高效，因为不会调用 getter：

```kotlin
// 文件：AppConfig.kt
package com.example

// 编译时常量
const val MAX_LOGIN_ATTEMPTS = 3
```

编译时常量必须满足以下要求：

* 它们必须是顶层属性，或者是 [`object` 声明](object-declarations.md#object-declarations-overview) 或 [伴生对象](object-declarations.md#companion-objects) 的成员。
* 它们必须使用 `String` 类型或 [基本类型](types-overview.md) 的值进行初始化。
* 它们不能有自定义 getter。

编译时常量仍然具有支持字段，因此您可以通过 [反射](reflection.md) 与其交互。

您还可以在注解中使用这些属性：

```kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTEM_DEPRECATED) fun processLegacyOrders() { ... }
```

## 延迟初始化属性和变量

通常，您必须在构造函数中初始化属性。然而，这并不总是很方便。例如，您可能通过依赖注入或在单元测试的设置方法中初始化属性。

为了处理这些情况，请使用 `lateinit` 修饰符标记属性：

```kotlin
public class OrderServiceTest {
    lateinit var orderService: OrderService

    @SetUp fun setup() {
        orderService = OrderService()
    }

    @Test fun processesOrderSuccessfully() {
        // 直接调用 orderService，无需检查 null 或初始化
        orderService.processOrder()  
    }
}
```

您可以在声明为以下形式的 `var` 属性上使用 `lateinit` 修饰符：

* 顶层属性。
* 局部变量。
* 类主体内部的属性。

对于类属性：

* 您不能在主构造函数中声明它们。
* 它们不得具有自定义 getter 或 setter。

在所有情况下，属性或变量必须是非空的，且不得是 [基本类型](types-overview.md)。

如果您在初始化之前访问 `lateinit` 属性，Kotlin 会抛出一个特定的异常，该异常会指明正在访问的未初始化属性：

```kotlin
class ReportGenerator {
    lateinit var report: String

    fun printReport() {
        // 由于在初始化之前访问，会抛出异常
        println(report)
    }
}

fun main() {
    val generator = ReportGenerator()
    generator.printReport()
    // Exception in thread "main" kotlin.UninitializedPropertyAccessException: lateinit property report has not been initialized
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-lateinit-property" validate="false"}

要检查 `lateinit var` 是否已初始化，请在该 [属性的引用](reflection.md#property-references) 上使用 [`isInitialized`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/is-initialized.html) 属性：

```kotlin
class WeatherStation {
    lateinit var latestReading: String

    fun printReading() {
        // 检查属性是否已初始化
        if (this::latestReading.isInitialized) {
            println("Latest reading: $latestReading")
        } else {
            println("No reading available")
        }
    }
}

fun main() {
    val station = WeatherStation()

    station.printReading()
    // No reading available
    station.latestReading = "22°C, sunny"
    station.printReading()
    // Latest reading: 22°C, sunny
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-lateinit-property-check-initialization"}

只有当您可以在代码中访问该属性时，才能对该属性使用 `isInitialized`。该属性必须在同一个类中、在外层类中或作为同一个文件中的顶层属性声明。

## 重写属性

请参阅 [重写属性](inheritance.md#overriding-properties)。

## 委托属性

为了重用逻辑并减少代码重复，您可以将获取和设置属性的职责委托给一个单独的对象。

委托访问器行为可以使属性的访问器逻辑保持集中，从而更容易重用。这种方法在实现如下行为时非常有用：

* 延迟计算值。
* 通过给定的键从映射中读取。
* 访问数据库。
* 在访问属性时通知侦听器。

您可以自己在库中实现这些通用行为，也可以使用外部库提供的现有委托。更多信息请参阅 [委托属性](delegated-properties.md)。