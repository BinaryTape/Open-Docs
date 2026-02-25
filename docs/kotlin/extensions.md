[//]: # (title: 扩展)

Kotlin 的 *扩展* 允许你在不使用 继承 或 *装饰器 (Decorator)* 之类的设计模式的情况下，为一个类或一个接口扩展新功能。当处理你无法直接修改的第三方库时，这些功能非常有用。扩展一旦创建，你就可以像调用原始类或接口的成员一样调用它们。

最常见的扩展形式是 [扩展函数](#extension-functions) 和 [扩展属性](#extension-properties)。

重要的是，扩展并不会修改它们所扩展的类或接口。当你定义一个扩展时，你并没有添加新的成员。你只是让新的函数可以被调用，或者让新的属性可以使用相同的语法进行访问。

## 接收器

扩展总是在接收器上调用的。接收器的类型必须与被扩展的类或接口的类型相同。要使用扩展，请先写出接收器，后跟一个 `.`，再接上函数名或属性名。

例如，标准库中的 [`.appendLine()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/append-line.html) 扩展函数扩展了 `StringBuilder` 类。在这种情况下，接收器是一个 `StringBuilder` 实例，而 *接收器类型* 是 `StringBuilder`：

```kotlin
fun main() { 
//sampleStart
    // builder 是 StringBuilder 的一个实例
    val builder = StringBuilder()
        // 在 builder 上调用 .appendLine() 扩展函数
        .appendLine("Hello")
        .appendLine()
        .appendLine("World")
    println(builder.toString())
    // Hello
    //
    // World
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-stringbuilder"}

## 扩展函数

在创建你自己的扩展函数之前，请查看你所需的功能是否已经在 Kotlin [标准库](https://kotlinlang.org/api/core/kotlin-stdlib/) 中提供。标准库为以下操作提供了许多有用的扩展函数：

* 操作集合：[`.map()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/map.html)、[`.filter()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter.html)、[`.reduce()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/reduce.html)、[`.fold()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/fold.html)、[`.groupBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/group-by.html)。
* 转换为字符串：[`.joinToString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/join-to-string.html)。
* 处理 null 值：[`.filterNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter-not-null.html)。

要创建你自己的扩展函数，请在其名称前加上接收器类型，后跟一个 `.`。在这个例子中，`.truncate()` 函数扩展了 `String` 类，因此接收器类型是 `String`：

```kotlin
fun String.truncate(maxLength: Int): String {
    return if (this.length <= maxLength) this else take(maxLength - 3) + "..."
}

fun main() {
    val shortUsername = "KotlinFan42"
    val longUsername = "JetBrainsLoverForever"

    println("Short username: ${shortUsername.truncate(15)}") 
    // KotlinFan42
    println("Long username:  ${longUsername.truncate(15)}")
    // JetBrainsLov...
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-truncate"}

`.truncate()` 函数会将调用它的任何字符串截断为 `maxLength` 实参指定的长度，并添加省略号 `...`。如果字符串短于 `maxLength`，该函数将返回原始字符串。

在这个例子中，`.displayInfo()` 函数扩展了 `User` 接口：

```kotlin
interface User {
    val name: String
    val email: String
}

fun User.displayInfo(): String = "User(name=$name, email=$email)"

// 继承自 User 接口并实现其属性
class RegularUser(override val name: String, override val email: String) : User

fun main() {
    val user = RegularUser("Alice", "alice@example.com")
    println(user.displayInfo()) 
    // User(name=Alice, email=alice@example.com)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-interface"}

`.displayInfo()` 函数返回一个包含 `RegularUser` 实例的 `name` 和 `email` 的字符串。当你只想通过定义一次就能为实现某个接口的所有类型添加功能时，在这样的接口上定义扩展是非常有用的。

在这个例子中，`.mostVoted()` 函数扩展了 `Map<String, Int>` 类：

```kotlin
fun Map<String, Int>.mostVoted(): String? {
    return maxByOrNull { (key, value) -> value }?.key
}

fun main() {
    val poll = mapOf(
        "Cats" to 37,
        "Dogs" to 58,
        "Birds" to 22
    )

    println("Top choice: ${poll.mostVoted()}") 
    // Dogs
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-mostvoted"}

`.mostVoted()` 函数遍历调用它的 map 的键值对，并使用 [`maxByOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/max-by-or-null.html) 函数返回包含最大值的键值对的键。如果 map 为空，`maxByOrNull()` 函数将返回 `null`。`mostVoted()` 函数使用安全调用 `?.`，以便仅在 `maxByOrNull()` 函数返回非 null 值时才访问 `key` 属性。

### 泛型扩展函数

要创建泛型扩展函数，请在函数名之前声明泛型类型形参，以便在接收器类型表达式中使用它。在这个例子中，`.endpoints()` 函数扩展了 `List<T>`，其中 `T` 可以是任何类型：

```kotlin
fun <T> List<T>.endpoints(): Pair<T, T> {
    return first() to last()
}

fun main() {
    val cities = listOf("Paris", "London", "Berlin", "Prague")
    val temperatures = listOf(21.0, 19.5, 22.3)

    val cityEndpoints = cities.endpoints()
    val tempEndpoints = temperatures.endpoints()

    println("First and last cities: $cityEndpoints")
    // (Paris, Prague)
    println("First and last temperatures: $tempEndpoints") 
    // (21.0, 22.3)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-endpoints"}

`.endpoints()` 函数返回一个包含调用它的列表的第一个和最后一个元素的对 (pair)。在函数体内，它调用 `first()` 和 `last()` 函数，并使用 `to` 中缀函数将它们的返回值组合成一个 `Pair`。

有关泛型的更多信息，请参阅 [泛型函数](generics.md)。

### 可空接收器

你可以定义具有可空接收器类型的扩展函数，这允许你在变量上调用它们，即使其值为 null。当接收器为 `null` 时，`this` 也是 `null`。请确保在函数内部正确处理为 null 性。例如，在函数体内使用 `this == null` 检查、[安全调用 `?.`](null-safety.md#safe-call-operator) 或 [Elvis 运算符 `?:`](null-safety.md#elvis-operator)。

在这个例子中，你可以调用 `.toString()` 函数而无需检查 `null`，因为检查已经在扩展函数内部完成了：

```kotlin
fun main() {
    //sampleStart
    // 可空 Any 上的扩展函数
    fun Any?.toString(): String {
        if (this == null) return "null"
        // 进行 null 检查后，`this` 被智能转换（smart-cast）为非空 Any
        // 因此该调用会解析为常规的 toString() 函数
        return toString()
    }
    
    val number: Int? = 42
    val nothing: Any? = null
    
    println(number.toString())
    // 42
    println(nothing.toString()) 
    // null
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-nullable-receiver"}

### 扩展函数还是成员函数？

由于扩展函数和成员函数的调用具有相同的表示法，编译器如何知道使用哪一个？扩展函数是 *静态地* 分发的，这意味着编译器在编译时根据接收器类型决定调用哪个函数。例如：

```kotlin
fun main() {
//sampleStart
    open class Shape
    class Rectangle: Shape()
    
    fun Shape.getName() = "Shape"
    fun Rectangle.getName() = "Rectangle"
    
    fun printClassName(shape: Shape) {
        println(shape.getName())
    }
    
    printClassName(Rectangle())
    // Shape
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-shape"}

在这个例子中，编译器调用了 `Shape.getName()` 扩展函数，因为形参 `shape` 被声明为 `Shape` 类型。由于扩展函数是静态解析的，编译器根据声明的类型而不是实际的实例来选择函数。

因此，即使例子中传递了一个 `Rectangle` 实例，`.getName()` 函数也会解析为 `Shape.getName()`，因为该变量被声明为 `Shape` 类型。

如果一个类拥有一个成员函数，且存在一个具有相同接收器类型、相同名称和兼容实参的扩展函数，则成员函数优先。例如：

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Member function") }
    }
    
    fun Example.printFunctionType() { println("Extension function") }
    
    Example().printFunctionType()
    // Member function
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-member-function"}

然而，扩展函数可以重载具有相同名称但 *不同* 签名的成员函数：

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Member function") }
    }
    
    // 名称相同但签名不同
    fun Example.printFunctionType(index: Int) { println("Extension function #$index") }
    
    Example().printFunctionType(1)
    // Extension function #1
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-member-function-overload"}

在这个例子中，由于向 `.printFunctionType()` 函数传递了一个 `Int`，编译器选择了扩展函数，因为它与签名匹配。编译器忽略了不带实参的成员函数。

### 匿名扩展函数

你可以定义不带名称的扩展函数。当你想要避免污染全局命名空间，或者当你需要将某些扩展行为作为参数传递时，这非常有用。

例如，假设你想为一个数据类扩展一个一次性的函数来计算运费，而不给它命名：

```kotlin
fun main() {
    //sampleStart
    data class Order(val weight: Double)
    val calculateShipping = fun Order.(rate: Double): Double = this.weight * rate
    
    val order = Order(2.5)
    val cost = order.calculateShipping(3.0)
    println("Shipping cost: $cost") 
    // Shipping cost: 7.5
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-anonymous"}

要将扩展行为作为形参传递，请使用带有类型注解的 [lambda表达式](lambdas.md#lambda-expression-syntax)。例如，假设你想检查一个数字是否在某个范围内，而不定义一个命名函数：

```kotlin
fun main() {
    val isInRange: Int.(min: Int, max: Int) -> Boolean = { min, max -> this in min..max }

    println(5.isInRange(1, 10))
    // true
    println(20.isInRange(1, 10))
    // false
}
```
 {kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-anonymous-lambda"}

在这个例子中，`isInRange` 变量持有一个类型为 `Int.(min: Int, max: Int) -> Boolean` 的函数。该类型是 `Int` 类上的一个扩展函数，它接受 `min` 和 `max` 形参并返回一个 `Boolean`。

lambda 体 `{ min, max -> this in min..max }` 检查调用该函数的 `Int` 值是否落在 `min` 和 `max` 形参之间的范围内。如果检查成功，lambda 将返回 `true`。

欲了解更多信息，请参阅 [Lambda表达式与匿名函数](lambdas.md)。

## 扩展属性

Kotlin 支持扩展属性，这对于执行数据转换或创建 UI 显示辅助程序非常有用，且不会污染你正在处理的类。

要创建一个扩展属性，请写下你想要扩展的类的名称，后跟一个 `.` 和你的属性名称。

例如，假设你有一个代表用户的类，包含名字和姓氏，并且你想创建一个在访问时返回电子邮件样式的用户名的属性。你的代码可能如下所示：

```kotlin
data class User(val firstName: String, val lastName: String)

// 一个扩展属性，用于获取用户名样式的电子邮件前缀
val User.emailUsername: String
    get() = "${firstName.lowercase()}.${lastName.lowercase()}"

fun main() {
    val user = User("Mickey", "Mouse")
    // 调用扩展属性
    println("Generated email username: ${user.emailUsername}")
    // Generated email username: mickey.mouse
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-property"}

由于扩展实际上并没有向类添加成员，因此扩展属性没有有效的方法来拥有 [支持字段](properties.md#backing-fields)。这就是为什么扩展属性不允许有初始值设定项的原因。你只能通过显式提供 getter 和 setter 来定义它们的行为。例如：

```kotlin
data class House(val streetName: String)

// 无法编译，因为没有 getter 和 setter
// var House.number = 1
// 错误：扩展属性不允许有初始值设定项

// 编译成功
val houseNumbers = mutableMapOf<House, Int>()
var House.number: Int
    get() = houseNumbers[this] ?: 1
    set(value) {
        println("Setting house number for ${this.streetName} to $value")
        houseNumbers[this] = value
    }

fun main() {
    val house = House("Maple Street")

    // 显示默认值
    println("Default number: ${house.number} ${house.streetName}") 
    // Default number: 1 Maple Street
    
    house.number = 99
    // Setting house number for Maple Street to 99

    // 显示更新后的编号
    println("Updated number: ${house.number} ${house.streetName}") 
    // Updated number: 99 Maple Street
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-property-error"}

在这个例子中，getter 使用 [Elvis 运算符](null-safety.md#elvis-operator) 返回 `houseNumbers` map 中存在的门牌号，否则返回 `1`。要详细了解如何编写 getter 和 setter，请参阅 [自定义 getter 与 setter](properties.md#custom-getters-and-setters)。

## 伴生对象扩展

如果一个类定义了一个 [伴生对象](object-declarations.md#companion-objects)，你也可以为该伴生对象定义扩展函数和属性。就像伴生对象的常规成员一样，你可以仅使用类名作为限定符来调用它们。编译器默认将伴生对象命名为 `Companion`：

```kotlin
class Logger {
    companion object { }
}

fun Logger.Companion.logStartupMessage() {
    println("Application started.")
}

fun main() {
    Logger.logStartupMessage()
    // Application started.
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-companion-object"}

## 将扩展声明为成员

你可以在另一个类内部为一个类声明扩展。像这样的扩展拥有多个 *隐式接收器*。隐式接收器是指一个对象，你无需使用 [`this`](this-expressions.md#qualified-this) 进行限定即可访问其成员：

* 声明扩展的类被称为 *分发接收器*。
* 扩展函数的接收器类型被称为 *扩展接收器*。

参考这个例子，其中 `Connection` 类为 `Host` 类定义了一个名为 `printConnectionString()` 的扩展函数：

```kotlin
class Host(val hostname: String) {
    fun printHostname() { print(hostname) }
}

class Connection(val host: Host, val port: Int) {
    fun printPort() { print(port) }

    // Host 是扩展接收器
    fun Host.printConnectionString() {
        // 调用 Host.printHostname()
        printHostname() 
        print(":")
        // 调用 Connection.printPort()
        // Connection 是分发接收器
        printPort()
    }

    fun connect() {
        /*...*/
        // 调用扩展函数
        host.printConnectionString() 
    }
}

fun main() {
    Connection(Host("kotl.in"), 443).connect()
    // kotl.in:443
    
    // 触发错误，因为扩展函数在 Connection 之外不可用
    // Host("kotl.in").printConnectionString()
    // Unresolved reference 'printConnectionString'.
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-members"}

这个例子在 `Connection` 类内部声明了 `printConnectionString()` 函数，因此 `Connection` 类是分发接收器。扩展函数的接收器类型是 `Host` 类，因此 `Host` 类是扩展接收器。

如果分发接收器和扩展接收器拥有同名的成员，扩展接收器的成员优先。要显式访问分发接收器，请使用 [限定的 `this` 语法](this-expressions.md#qualified-this)：

```kotlin
class Connection {
    fun Host.getConnectionString() {
        // 调用 Host.toString()
        toString()
        // 调用 Connection.toString()
        this@Connection.toString()
    }
}
```

### 重写成员扩展

你可以将成员扩展声明为 `open` 并在子类中重写它们，这在你想要为每个子类自定义扩展行为时非常有用。编译器对每种接收器类型的处理方式不同：

| 接收器类型 | 解析时间 | 分发类型 |
|--------------------|-----------------|---------------|
| 分发接收器 | 运行时 | 虚分发 (Virtual) |
| 扩展接收器 | 编译时 | static |

参考这个例子，其中 `User` 类是 `open` 的，而 `Admin` 类继承自它。`NotificationSender` 类为 `User` 和 `Admin` 类定义了 `sendNotification()` 扩展函数，而 `SpecialNotificationSender` 类重写了它们：

```kotlin
open class User

class Admin : User()

open class NotificationSender {
    open fun User.sendNotification() {
        println("Sending user notification from normal sender")
    }

    open fun Admin.sendNotification() {
        println("Sending admin notification from normal sender")
    }

    fun notify(user: User) {
        user.sendNotification()
    }
}

class SpecialNotificationSender : NotificationSender() {
    override fun User.sendNotification() {
        println("Sending user notification from special sender")
    }

    override fun Admin.sendNotification() {
        println("Sending admin notification from special sender")
    }
}

fun main() {
    // 分发接收器是 NotificationSender
    // 扩展接收器是 User
    // 解析为 NotificationSender 中的 User.sendNotification()
    NotificationSender().notify(User())
    // Sending user notification from normal sender
    
    // 分发接收器是 SpecialNotificationSender
    // 扩展接收器是 User
    // 解析为 SpecialNotificationSender 中的 User.sendNotification()
    SpecialNotificationSender().notify(User())
    // Sending user notification from special sender 
    
    // 分发接收器是 SpecialNotificationSender
    // 扩展接收器是 User 而非 Admin
    // notify() 函数将 user 声明为 User 类型
    // 静态解析为 SpecialNotificationSender 中的 User.sendNotification()
    SpecialNotificationSender().notify(Admin())
    // Sending user notification from special sender 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-open"}

分发接收器在运行时使用虚分发解析，这使得 `main()` 函数中的行为更容易理解。可能让你感到惊讶的是，当你对一个 `Admin` 实例调用 `notify()` 函数时，编译器会根据声明的类型（`user: User`）选择扩展，因为它对扩展接收器进行静态解析。

## 扩展与可见性修饰符

扩展使用与在相同作用域内声明的常规函数相同的 [可见性修饰符](visibility-modifiers.md)，包括作为其他类成员声明的扩展。

例如，在文件顶层声明的扩展可以访问同一文件中的其他 `private` 顶层声明：

```kotlin
// 文件: StringUtils.kt

private fun removeWhitespace(input: String): String {
    return input.replace("\\s".toRegex(), "")
}

fun String.cleaned(): String {
    return removeWhitespace(this)
}

fun main() {
    val rawEmail = "  user @example. com  "
    val cleaned = rawEmail.cleaned()
    println("Raw:     '$rawEmail'")
    // Raw:     '  user @example. com  '
    println("Cleaned: '$cleaned'")
    // Cleaned: 'user@example.com'
    println("Looks like an email: ${cleaned.contains("@") && cleaned.contains(".")}") 
    // Looks like an email: true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-visibility-top-level"}

如果扩展是在其接收器类型之外声明的，它将无法访问接收器的 `private` 或 `protected` 成员：

```kotlin
class User(private val password: String) {
    fun isLoggedIn(): Boolean = true
    fun passwordLength(): Int = password.length
}

// 在类外部声明的扩展
fun User.isSecure(): Boolean {
    // 无法访问 password，因为它是私有的：
    // return password.length >= 8

    // 相反，我们依赖公共成员：
    return passwordLength() >= 8 && isLoggedIn()
}

fun main() {
    val user = User("supersecret")
    println("Is user secure: ${user.isSecure()}") 
    // Is user secure: true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-visibility-outside-receiver"}

如果一个扩展被标记为 `internal`，则它仅在其 [模块](visibility-modifiers.md#modules) 内可访问：

```kotlin
// Networking 模块
// JsonParser.kt
internal fun String.parseJson(): Map<String, Any> {
    return mapOf("fakeKey" to "fakeValue")
}
```

## 扩展的作用域

在大多数情况下，你会直接在软件包下的顶层定义扩展：

```kotlin
package org.example.declarations

fun List<String>.getLongestString() { /*...*/}
```

要在其声明包之外使用扩展，请在调用处导入它：

```kotlin
package org.example.usage

import org.example.declarations.getLongestString

fun main() {
    val list = listOf("red", "green", "blue")
    list.getLongestString()
}
```

欲了解更多信息，请参阅 [导入](packages.md#imports)。