[//]: # (title: 属性)

在 Kotlin 中，属性允许你存储和管理数据，而无需编写函数来访问或更改数据。你可以在[类](classes.md)、[接口](interfaces.md)、[对象](object-declarations.md)、[伴生对象](object-declarations.md#companion-objects)中使用属性，甚至可以在这些结构之外作为顶层属性使用。

每个属性都有一个名称、一个类型，以及一个自动生成的名为 `getter` 的 `get()` 函数。你可以使用 getter 读取属性的值。如果属性是可变的，它还有一个名为 `setter` 的 `set()` 函数，允许你更改属性的值。

> getter 和 setter 被称为 _访问器_。
>
{style="tip"}

## 声明属性

属性可以是可变的 (`var`) 或只读的 (`val`)。
你可以在 `.kt` 文件中将它们声明为顶层属性。可以将顶层属性视为属于某个包的全局变量：

```kotlin
// File: Constants.kt
package my.app

val pi = 3.14159
var counter = 0
```

你也可以在类、接口或对象中声明属性：

```kotlin
// Class with properties
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
}

// Interface with a property
interface ContactInfo {
    val email: String
}

// Object with properties
object Company {
    var name: String = "Detective Inc."
    val country: String = "UK"
}

// Class implementing the interface
class PersonContact : ContactInfo {
    override val email: String = "sherlock@example.com"
}
```

要使用属性，只需按其名称引用：

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

在 Kotlin 中，我们建议在声明属性时初始化它们，以确保代码安全且易于阅读。但是，在特殊情况下，你可以[稍后初始化它们](#late-initialized-properties-and-variables)。

如果编译器可以从初始化器或 getter 的返回类型中推断出来，则属性类型是可选的：

```kotlin
var initialized = 1 // 推断类型为 Int
var allByDefault    // 错误：属性必须初始化。
```
{validate="false"}

## 自定义 getter 和 setter

默认情况下，Kotlin 会自动生成 getter 和 setter。当你需要额外的逻辑时，例如验证、格式化或基于其他属性的计算，可以定义自己的自定义访问器。

每次访问属性时，都会运行自定义 getter：

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

如果编译器可以从 getter 中推断出类型，则可以省略它：

```kotlin
val area get() = this.width * this.height
```

每次你赋值给属性时，都会运行自定义 setter，除了其初始化期间。按照惯例，setter 形参的名称是 `value`，但如果你愿意，可以选择一个不同的名称：

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

在 Kotlin 中，你可以在不替换默认实现的情况下更改访问器可见性或添加[注解](annotations.md)。你无需在 `{}` 块中进行这些更改。

要更改访问器的可见性，请在 `get` 或 `set` 关键字之前使用修饰符：

```kotlin
class BankAccount(initialBalance: Int) {
    var balance: Int = initialBalance
        // 只有类可以修改 balance
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
    // 错误：无法赋值，因为 setter 是私有的
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-private-setter"}

要注解访问器，请在 `get` 或 `set` 关键字之前使用注解：

```kotlin
// 定义一个可以应用于 getter 的注解
@Target(AnnotationTarget.PROPERTY_GETTER)
annotation class Inject

class Service {
    var dependency: String = "Default Service"
        // 注解 getter
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

此示例使用[反射](reflection.md)来展示 getter 和 setter 上存在哪些注解。

### 幕后字段

在 Kotlin 中，访问器使用幕后字段在内存中存储属性的值。当你想要向 getter 或 setter 添加额外逻辑时，或者当你想要在属性更改时触发附加操作时，幕后字段会很有用。

你不能直接声明幕后字段。Kotlin 只在必要时生成它们。你可以使用 `field` 关键字在访问器中引用幕后字段。

如果属性使用至少一个访问器的默认实现，或者自定义访问器通过 `field` 标识符引用它，则会为该属性生成一个幕后字段。

例如，`isEmpty` 属性没有幕后字段，因为它使用了不带 `field` 关键字的自定义 getter：

```kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

在此示例中，`score` 属性有一个幕后字段，因为 setter 使用了 `field` 关键字：

```kotlin
class Scoreboard {
    var score: Int = 0
        set(value) {
            field = value
            // 在更新值时添加日志
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

### 幕后属性

有时你可能需要比使用[幕后字段](#backing-fields)所能提供的更强的灵活性。例如，如果你有一个 API，你希望能够在内部修改属性，但在外部不可修改。在这种情况下，你可以使用一种称为 _幕后属性_ 的编码范式。

在以下示例中，`ShoppingCart` 类有一个 `items` 属性，表示购物车中的所有物品。你希望 `items` 属性在类外部是只读的，但仍允许用户通过一种“批准”的方式直接修改 `items` 属性。为实现此目的，你可以定义一个名为 `_items` 的私有幕后属性，以及一个名为 `items` 的公共属性，该属性委托给幕后属性的值。

```kotlin
class ShoppingCart {
    // 幕后属性
    private val _items = mutableListOf<String>()

    // 公共只读视图
    val items: List<String>
        get() = _items

    fun addItem(item: String) {
        _items.add(item)
    }

    fun removeItem(item: String) {
        _items.remove(item)
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
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-backing-property"}

在此示例中，用户只能通过 `addItem()` 函数向购物车添加物品，但仍可以访问 `items` 属性来查看其中内容。

> 在命名幕后属性时使用前导下划线，以遵循 Kotlin [编码约定](coding-conventions.md#names-for-backing-properties)。
>
{style="tip"}

在 JVM 上，编译器会优化对具有默认访问器的私有属性的访问，以避免函数调用开销。

当你希望多个公共属性共享一个状态时，幕后属性也很有用。例如：

```kotlin
class Temperature {
    // 存储摄氏温度的幕后属性
    private var _celsius: Double = 0.0

    var celsius: Double
        get() = _celsius
        set(value) { _celsius = value }

    var fahrenheit: Double
        get() = _celsius * 9 / 5 + 32
        set(value) { _celsius = (value - 32) * 5 / 9 }
}

fun main() {
    val temp = Temperature()
    temp.celsius = 25.0
    println("${temp.celsius}°C = ${temp.fahrenheit}°F") 
    // 25.0°C = 77.0°F

    temp.fahrenheit = 212.0
    println("${temp.celsius}°C = ${temp.fahrenheit}°F") 
    // 100.0°C = 212.0°F
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-backing-property-multiple-properties"}

在此示例中，`_celsius` 幕后属性被 `celsius` 和 `fahrenheit` 属性共同访问。这种设置提供了一个单一的真相来源，并带有两个公共视图。

## 编译期常量

如果只读属性的值在编译期已知，请使用 `const` 修饰符将其标记为**编译期常量**。编译期常量在编译期内联，因此每个引用都会被其实际值替换。它们被更高效地访问，因为没有调用 getter：

```kotlin
// File: AppConfig.kt
package com.example

// 编译期常量
const val MAX_LOGIN_ATTEMPTS = 3
```

编译期常量必须满足以下要求：

*   必须是顶层属性，或者是 [`object` 声明](object-declarations.md#object-declarations-overview)或[伴生对象](object-declarations.md#companion-objects)的成员。
*   必须使用 `String` 类型或[原生类型](types-overview.md)的值进行初始化。
*   不能有自定义 getter。

编译期常量仍然有一个幕后字段，因此你可以使用[反射](reflection.md)与它们进行交互。

此类属性也可以用于注解：

```kotlin
const val SUBSYSTEM_DEPRECATED: String = "此子系统已弃用"

@Deprecated(SUBSYSTEM_DEPRECATED) fun processLegacyOrders() { ... }
```

## 延迟初始化属性和变量

通常，你必须在构造函数中初始化属性。然而，这样做通常并不方便。例如，属性可以通过依赖注入进行初始化，或者在单元测试的设置方法中进行初始化。

为了处理这些情况，你可以使用 `lateinit` 修饰符标记属性：

```kotlin
public class OrderServiceTest {
    lateinit var orderService: OrderService

    @SetUp fun setup() {
        orderService = OrderService()
    }

    @Test fun processesOrderSuccessfully() {
        // 直接调用 orderService，不检测 null
        // 或初始化
        orderService.processOrder()  
    }
}
```

你可以在以下声明的 `var` 属性上使用 `lateinit` 修饰符：

*   顶层属性。
*   局部变量。
*   类体内部的属性。

对于类属性：

*   你不能在主构造函数中声明它们。
*   它们不能有自定义 getter 或 setter。

在所有情况下，属性或变量必须是非空的，并且不能是[原生类型](types-overview.md)。

在 `lateinit` 属性初始化之前访问它，Kotlin 会抛出一个特殊异常，该异常清楚地标识了被访问的未初始化属性：

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

要检测 `lateinit var` 是否已初始化，请在[对该属性的引用](reflection.md#property-references)上使用 [`isInitialized`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/is-initialized.html) 属性：

```kotlin
class WeatherStation {
    lateinit var latestReading: String

    fun printReading() {
        // 检测属性是否已初始化
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

你只能在代码中已经可以访问该属性的情况下使用 `isInitialized`。该属性必须在相同类、外部类或相同文件的顶层声明。

## 覆盖属性

关于覆盖属性，请参见 [覆盖属性](inheritance.md#overriding-properties)。

## 委托属性

为了重用逻辑和减少代码重复，你可以将获取和设置属性的职责委托给一个单独的对象。

委托访问器行为使属性的访问器逻辑集中化，从而更易于重用。这种方法在实现以下行为时很有用：

*   惰性求值。
*   根据给定键从 Map 中读取。
*   访问数据库。
*   在属性访问时通知监听器。

你可以在库中自行实现这些常见行为，或使用外部库提供的现有委托。关于更多信息，请参见[委托属性](delegated-properties.md)。