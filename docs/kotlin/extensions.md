[//]: # (title: 扩展)

Kotlin 的 _扩展_ 允许你扩展类或接口以增加新功能，而无需使用继承或诸如 _Decorator_ 之类的设计模式。当处理无法直接修改的第三方库时，它们非常有用。一旦创建，你可以像调用原类或接口的成员一样调用这些扩展。

最常见的扩展形式是 [_扩展函数_](#extension-functions) 和 [_扩展属性_](#extension-properties)。

重要的是，扩展实际上并不修改它们所扩展的类或接口。当你定义一个扩展时，你不会添加新成员。你只是让这类类型可以通过相同的语法调用新函数或访问新属性。

## 接收者

扩展总是作用于接收者。接收者必须与被扩展的类或接口具有相同的类型。要使用扩展，请在其前加上接收者，后跟一个 `.` 和函数或属性名称。

例如，标准库中的 [`.appendLine()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/append-line.html) 扩展函数扩展了 `StringBuilder` 类。因此在这种情况下，接收者是 `StringBuilder` 实例，而 _接收者类型_ 是 `StringBuilder`：

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

在创建自己的扩展函数之前，请查看 Kotlin [标准库](https://kotlinlang.org/api/core/kotlin-stdlib/) 中是否已有你想要的功能。标准库提供了许多有用的扩展函数，用于：

*   操作集合: [`.map()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/map.html), [`.filter()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter.html), [`.reduce()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/reduce.html), [`.fold()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/fold.html), [`.groupBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/group-by.html)。
*   转换为字符串: [`.joinToString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/join-to-string.html)。
*   处理 null 值: [`.filterNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter-not-null.html)。

要创建自己的扩展函数，请在其名称前加上接收者类型，后跟一个 `.`。在此示例中，`.truncate()` 函数扩展了 `String` 类，因此接收者类型是 `String`：

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

`.truncate()` 函数会截断任何在其上调用的字符串，截断长度由 `maxLength` 实参指定，并添加一个省略号 `...`。如果字符串短于 `maxLength`，函数将返回原始字符串。

在此示例中，`.displayInfo()` 函数扩展了 `User` 接口：

```kotlin
interface User {
    val name: String
    val email: String
}

fun User.displayInfo(): String = "User(name=$name, email=$email)"

// 继承并实现 User 接口的属性
class RegularUser(override val name: String, override val email: String) : User

fun main() {
    val user = RegularUser("Alice", "alice@example.com")
    println(user.displayInfo())
    // User(name=Alice, email=alice@example.com)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-interface"}

`.displayInfo()` 函数返回一个字符串，其中包含 `RegularUser` 实例的 `name` 和 `email`。像这样在接口上定义扩展非常有用，当你只想为所有实现该接口的类型添加一次功能时。

在此示例中，`.mostVoted()` 函数扩展了 `Map<String, Int>` 类：

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

`.mostVoted()` 函数遍历在其上调用的 Map 的键值对，并使用 [`maxByOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/max-by-or-null.html) 函数返回包含最高值的键。如果 Map 为空，`maxByOrNull()` 函数将返回 `null`。`mostVoted()` 函数使用安全调用 `?.`，仅在 `maxByOrNull()` 函数返回非空值时才访问 `key` 属性。

### 泛型扩展函数

要创建泛型扩展函数，请在函数名称之前声明泛型类型形参，使其在接收者类型表达式中可用。在此示例中，`.endpoints()` 函数扩展了 `List<T>`，其中 `T` 可以是任意类型：

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

`.endpoints()` 函数返回一个 Pair，其中包含在其上调用的 List 的第一个和最后一个元素。在函数体内部，它调用 `first()` 和 `last()` 函数，并使用 `to` 中缀函数将它们返回的值组合成一个 `Pair`。

有关泛型的更多信息，请参见 [泛型函数](generics.md)。

### 可空的接收者

你可以定义可空的接收者类型的扩展函数，这允许你即使在变量值为 null 时也能在其上调用它们。当接收者为 `null` 时，`this` 也将是 `null`。请确保在函数内部正确处理可空性。例如，在函数体内部使用 `this == null` 检测、[安全调用 `?.`](null-safety.md#safe-call-operator) 或 [Elvis 操作符 `?:`](null-safety.md#elvis-operator)。

在此示例中，你可以调用 `.toString()` 函数而无需检测 `null`，因为该检测已在扩展函数内部发生：

```kotlin
fun main() {
    //sampleStart
    // 可空 Any 上的扩展函数
    fun Any?.toString(): String {
        if (this == null) return "null"
        // 在 null 检测后，`this` 会智能转换为非空 Any 类型
        // 因此此调用会解析为常规的 toString() 函数
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

由于扩展函数和成员函数调用具有相同的符号，编译器如何知道使用哪一个？扩展函数是 _静态_ 分派的，这意味着编译器在编译期根据接收者类型决定调用哪个函数。例如：

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

在此示例中，编译器调用 `Shape.getName()` 扩展函数，因为形参 `shape` 被声明为 `Shape` 类型。由于扩展函数是静态解析的，编译器根据声明类型选择函数，而不是实际实例。

因此，即使示例传递了一个 `Rectangle` 实例，`.getName()` 函数也会解析为 `Shape.getName()`，因为变量被声明为 `Shape` 类型。

如果一个类具有成员函数，并且存在一个具有相同接收者类型、相同名称和兼容实参的扩展函数，则成员函数优先。例如：

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

然而，扩展函数可以重载具有相同名称但 _不同_ 签名的成员函数：

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Member function") }
    }

    // 相同名称但不同签名
    fun Example.printFunctionType(index: Int) { println("Extension function #$index") }

    Example().printFunctionType(1)
    // Extension function #1
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-member-function-overload"}

在此示例中，由于向 `.printFunctionType()` 函数传递了一个 `Int`，编译器选择扩展函数，因为它匹配签名。编译器忽略不带实参的成员函数。

### 匿名扩展函数

你可以定义不带名称的扩展函数。当你希望避免使全局命名空间混乱，或者需要将某些扩展行为作为实参传递时，这会很有用。

例如，假设你想要为一个数据类扩展一个一次性函数来计算运费，而不给它命名：

```kotlin
fun main() {
    //sampleStart
    data class Order(val weight: Double)
    val calculateShipping = fun Order.(rate: Double): Double = this.weight * rate

    val order = Order(2.5)
    val cost = order.calculateShipping(3.0)
    println("Shipping cost: $cost")
    // 运费: 7.5
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-anonymous"}

要将扩展行为作为实参传递，请使用带有类型注解的 [lambda 表达式](lambdas.md#lambda-expression-syntax)。例如，假设你想要检测一个数字是否在一个区间内，而无需定义命名函数：

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

在此示例中，`isInRange` 变量持有 `Int.(min: Int, max: Int) -> Boolean` 类型的函数。该类型是 `Int` 类上的一个扩展函数，它接收 `min` 和 `max` 形参并返回一个 `Boolean` 值。

lambda 体 `{ min, max -> this in min..max }` 检测调用该函数的 `Int` 值是否落在 `min` 和 `max` 形参之间的区间内。如果检测成功，lambda 返回 `true`。

有关更多信息，请参见 [Lambda 表达式与匿名函数](lambdas.md)。

## 扩展属性

Kotlin 支持扩展属性，这对于执行数据转换或创建 UI 显示辅助器非常有用，而不会使你正在使用的类变得混乱。

要创建扩展属性，请写入你想要扩展的类的名称，后跟一个 `.` 和你的属性名称。

例如，假设你有一个表示用户（包含名字和姓氏）的数据类，并且你想要创建一个属性，在访问时返回一个电子邮件风格的用户名。你的代码可能如下所示：

```kotlin
data class User(val firstName: String, val lastName: String)

// 用于获取用户名风格电子邮件句柄的扩展属性
val User.emailUsername: String
    get() = "${firstName.lowercase()}.${lastName.lowercase()}"

fun main() {
    val user = User("Mickey", "Mouse")
    // 调用扩展属性
    println("Generated email username: ${user.emailUsername}")
    // 生成的电子邮件用户名: mickey.mouse
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-property"}

由于扩展实际上不会向类中添加成员，因此扩展属性无法高效地拥有 [幕后字段](properties.md#backing-fields)。这就是为什么扩展属性不允许有初始化器。你只能通过显式提供 getter 和 setter 来定义它们的行为。例如：

```kotlin
data class House(val streetName: String)

// 不会编译，因为没有 getter 和 setter
// var House.number = 1
// Error: Initializers are not allowed for extension properties

// 成功编译
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
    // 默认号码: 1 Maple Street

    house.number = 99
    // 正在将 Maple Street 的房屋号码设置为 99

    // 显示更新后的号码
    println("Updated number: ${house.number} ${house.streetName}")
    // 更新后的号码: 99 Maple Street
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-property-error"}

在此示例中，getter 使用 [Elvis 操作符](null-safety.md#elvis-operator) 返回房屋号码（如果它存在于 `houseNumbers` Map 中），否则返回 `1`。要了解更多关于如何编写 getter 和 setter 的信息，请参见 [自定义 getter 和 setter](properties.md#custom-getters-and-setters)。

## 伴生对象扩展

如果一个类定义了 [伴生对象](object-declarations.md#companion-objects)，你也可以为该伴生对象定义扩展函数和属性。就像伴生对象的常规成员一样，你只需使用类名作为限定符即可调用它们。编译器默认将伴生对象命名为 `Companion`：

```kotlin
class Logger {
    companion object { }
}

fun Logger.Companion.logStartupMessage() {
    println("Application started.")
}

fun main() {
    Logger.logStartupMessage()
    // 应用程序已启动。
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-companion-object"}

## 将扩展声明为成员

你可以在一个类内部声明另一个类的扩展。这样的扩展具有多个 _隐式接收者_。隐式接收者是一个对象，其成员无需使用 [`this`](this-expressions.md#qualified-this) 限定即可访问：

*   你声明扩展的类是 _分派接收者_。
*   扩展函数的接收者类型是 _扩展接收者_。

考虑此示例，其中 `Connection` 类包含一个针对 `Host` 类的扩展函数 `printConnectionString()`：

```kotlin
class Host(val hostname: String) {
    fun printHostname() { print(hostname) }
}

class Connection(val host: Host, val port: Int) {
    fun printPort() { print(port) }

    // Host 是扩展接收者
    fun Host.printConnectionString() {
        // 调用 Host.printHostname()
        printHostname()
        print(":")
        // 调用 Connection.printPort()
        // Connection 是分派接收者
        printPort()
    }

    fun connect() {
        /*...*/
        // 调用该扩展函数
        host.printConnectionString()
    }
}

fun main() {
    Connection(Host("kotl.in"), 443).connect()
    // kotl.in:443

    // 触发错误，因为该扩展函数在 Connection 外部不可用
    // Host("kotl.in").printConnectionString()
    // Unresolved reference 'printConnectionString'.
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-members"}

此示例在 `Connection` 类内部声明 `printConnectionString()` 函数，因此 `Connection` 类是分派接收者。扩展函数的接收者类型是 `Host` 类，因此 `Host` 类是扩展接收者。

如果分派接收者和扩展接收者具有同名成员，则扩展接收者的成员优先。要显式访问分派接收者，请使用 [限定的 `this` 语法](this-expressions.md#qualified-this)：

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

### 覆盖成员扩展

你可以将成员扩展声明为 `open` 并在子类中覆盖它们，这在你想为每个子类自定义扩展行为时很有用。编译器对每种接收者类型有不同的处理方式：

| 接收者类型 | 解析时间 | 分派类型 |
|------------|----------|----------|
| 分派接收者 | 运行时   | 虚拟     |
| 扩展接收者 | 编译期   | 静态     |

考虑这个示例，其中 `User` 类是 `open` 的，`Admin` 类继承自它。`NotificationSender` 类为 `User` 和 `Admin` 类都定义了 `sendNotification()` 扩展函数，而 `SpecialNotificationSender` 类覆盖了它们：

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
    // 分派接收者是 NotificationSender
    // 扩展接收者是 User
    // 解析为 NotificationSender 中的 User.sendNotification()
    NotificationSender().notify(User())
    // Sending user notification from normal sender

    // 分派接收者是 SpecialNotificationSender
    // 扩展接收者是 User
    // 解析为 SpecialNotificationSender 中的 User.sendNotification()
    SpecialNotificationSender().notify(User())
    // Sending user notification from special sender

    // 分派接收者是 SpecialNotificationSender
    // 扩展接收者是 User 而非 Admin
    // notify() 函数将 user 声明为 User 类型
    // 静态解析为 SpecialNotificationSender 中的 User.sendNotification()
    SpecialNotificationSender().notify(Admin())
    // Sending user notification from special sender
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-open"}

分派接收者在运行时使用虚拟分派解析，这使得 `main()` 函数中的行为更容易理解。但你可能会感到惊讶的是，当你对 `Admin` 实例调用 `notify()` 函数时，编译器根据声明类型 `user: User` 选择扩展，因为它静态解析扩展接收者。

## 扩展与可见性修饰符

扩展使用与在相同作用域中声明的常规函数相同的 [可见性修饰符](visibility-modifiers.md)，包括作为其他类的成员声明的扩展。

例如，在一个文件的顶层声明的扩展可以访问同一文件中其他 `private` 顶层声明：

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
    // 原始:     '  user @example. com  '
    println("Cleaned: '$cleaned'")
    // 清理后: 'user@example.com'
    println("Looks like an email: ${cleaned.contains("@") && cleaned.contains(".")}")
    // 看起来像一个电子邮件地址: true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-visibility-top-level"}

如果扩展在其接收者类型之外声明，它无法访问接收者的 `private` 或 `protected` 成员：

```kotlin
class User(private val password: String) {
    fun isLoggedIn(): Boolean = true
    fun passwordLength(): Int = password.length
}

// 在类外部声明的扩展
fun User.isSecure(): Boolean {
    // 无法访问 password，因为它是 private 的:
    // return password.length >= 8

    // 相反，我们依赖 public 成员:
    return passwordLength() >= 8 && isLoggedIn()
}

fun main() {
    val user = User("supersecret")
    println("Is user secure: ${user.isSecure()}")
    // 用户是否安全: true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-visibility-outside-receiver"}

如果一个扩展被标记为 `internal`，它只能在其 [模块](visibility-modifiers.md#modules) 内部访问：

```kotlin
// 网络模块
// JsonParser.kt
internal fun String.parseJson(): Map<String, Any> {
    return mapOf("fakeKey" to "fakeValue")
}
```

## 扩展的作用域

在大多数情况下，你会在顶层，即包之下直接定义扩展：

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

有关更多信息，请参见 [导入](packages.md#imports)。