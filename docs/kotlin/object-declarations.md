[//]: # (title: 对象声明与表达式)

在 Kotlin 中，对象允许你一步到位地定义一个类并创建它的实例。当你需要可重用的单例实例或一次性对象时，这非常有用。为了处理这些场景，Kotlin 提供了两种关键方法：用于创建单例的*对象声明*和用于创建匿名、一次性对象的*对象表达式*。

> 单例模式确保一个类只有一个实例，并提供一个全局访问点。
> 
{style="tip"}

对象声明和对象表达式最适用于以下场景：

*   **对共享资源使用单例：** 你需要确保在整个应用程序中只存在一个类的实例。例如，管理数据库连接池。
*   **创建工厂方法：** 你需要一种便捷高效地创建实例的方式。[伴生对象](#companion-objects)允许你定义与类绑定的类级别函数和属性，从而简化这些实例的创建和管理。
*   **临时修改现有类行为：** 你想修改现有类的行为，而无需创建新的子类。例如，为一个特定操作向对象添加临时功能。
*   **需要类型安全设计：** 你需要使用对象表达式对接口或[抽象类](classes.md#abstract-classes)进行一次性实现。这对于按钮点击处理程序等场景非常有用。

## 对象声明
{id="object-declarations-overview"}

你可以使用对象声明在 Kotlin 中创建对象的单个实例，对象声明始终在 `object` 关键字后跟一个名称。这允许你一步到位地定义一个类并创建它的实例，这对于实现单例非常有用：

```kotlin
//sampleStart
// 声明一个单例对象来管理数据提供者
object DataProviderManager {
    private val providers = mutableListOf<DataProvider>()

    // 注册一个新的数据提供者
    fun registerDataProvider(provider: DataProvider) {
        providers.add(provider)
    }

    // 检索所有已注册的数据提供者
    val allDataProviders: Collection<DataProvider> 
        get() = providers
}
//sampleEnd

// 示例数据提供者接口
interface DataProvider {
    fun provideData(): String
}

// 示例数据提供者实现
class ExampleDataProvider : DataProvider {
    override fun provideData(): String {
        return "Example data"
    }
}

fun main() {
    // 创建 ExampleDataProvider 的实例
    val exampleProvider = ExampleDataProvider()

    // 要引用该对象，请直接使用其名称
    DataProviderManager.registerDataProvider(exampleProvider)

    // 检索并打印所有数据提供者
    println(DataProviderManager.allDataProviders.map { it.provideData() })
    // [Example data]
}
```
{kotlin-runnable="true" id="object-declaration-register-provider"}

> 对象声明的初始化是线程安全的，并在首次访问时进行。
>
{style="tip"}

要引用该 `object`，请直接使用其名称：

```kotlin
DataProviderManager.registerDataProvider(exampleProvider)
```

对象声明也可以具有超类型，类似于[匿名对象如何从现有类继承或实现接口](#inherit-anonymous-objects-from-supertypes)：

```kotlin
object DefaultListener : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
}
```

与变量声明一样，对象声明不是表达式，因此它们不能用作赋值语句的右侧：

```kotlin
// 语法错误：对象表达式无法绑定名称。
val myObject = object MySingleton {
    val name = "Singleton"
}
```
对象声明不能是局部的，这意味着它们不能直接嵌套在函数内部。但是，它们可以嵌套在其他对象声明或非内部类中。

### 数据对象

在 Kotlin 中打印一个普通对象声明时，其字符串表示包含其名称和对象的哈希值：

```kotlin
object MyObject

fun main() {
    println(MyObject) 
    // MyObject@hashcode
}
```
{kotlin-runnable="true" id="object-declaration-plain"}

然而，通过用 `data` 修饰符标记一个对象声明，你可以指示编译器在调用 `toString()` 时返回对象的实际名称，其工作方式与[数据类](data-classes.md)相同：

```kotlin
data object MyDataObject {
    val number: Int = 3
}

fun main() {
    println(MyDataObject) 
    // MyDataObject
}
```
{kotlin-runnable="true" id="object-declaration-dataobject"}

此外，编译器还会为你的 `data object` 生成几个函数：

*   `toString()` 返回数据对象的名称
*   `equals()`/`hashCode()` 启用相等性检测和基于哈希的集合

  > 你不能为 `data object` 提供自定义的 `equals` 或 `hashCode` 实现。
  >
  {style="note"}

`data object` 的 `equals()` 函数确保所有具有你的 `data object` 类型的对象都被视为相等。在大多数情况下，由于 `data object` 声明了一个单例，运行时你只会拥有你的 `data object` 的单个实例。然而，在运行时通过平台反射（例如使用 `java.lang.reflect` 或使用该 API 的 JVM 序列化库在底层）生成相同类型的另一个对象的极端情况下，这可以确保这些对象被视为相等。

> 确保你只对 `data object` 进行结构性比较（使用 `==` 操作符），而不是按引用比较（使用 `===` 操作符）。这有助于你避免当数据对象在运行时存在多个实例时的陷阱。
>
{style="warning"}

```kotlin
import java.lang.reflect.Constructor

data object MySingleton

fun main() {
    val evilTwin = createInstanceViaReflection()

    println(MySingleton) 
    // MySingleton

    println(evilTwin) 
    // MySingleton

    // 即使库强制创建了 MySingleton 的第二个实例，
    // 其 equals() 函数仍然返回 true：
    println(MySingleton == evilTwin) 
    // true

    // 不要使用 === 比较数据对象
    println(MySingleton === evilTwin) 
    // false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlin 反射不允许实例化数据对象。
    // 这会“强制”（使用 Java 平台反射）创建一个新的 MySingleton 实例
    // 不要自己这么做！
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

生成的 `hashCode()` 函数的行为与 `equals()` 函数一致，因此 `data object` 的所有运行时实例都具有相同的哈希码。

#### 数据对象与数据类之间的区别

虽然 `data object` 和 `data class` 声明经常一起使用并且有一些相似之处，但有些函数不会为 `data object` 生成：

*   没有 `copy()` 函数。由于 `data object` 声明旨在用作单例，因此不会生成 `copy()` 函数。单例将类的实例化限制为单个实例，如果允许创建实例的副本，这将违反单例原则。
*   没有 `componentN()` 函数。与 `data class` 不同，`data object` 没有任何数据属性。由于尝试解构这样一个没有数据属性的对象没有意义，因此不会生成 `componentN()` 函数。

#### 在密封层级中使用数据对象

数据对象声明对于[密封类或密封接口](sealed-classes.md)等密封层级特别有用。它们允许你与可能随对象一起定义的任何数据类保持对称性。

在此示例中，将 `EndOfFile` 声明为 `data object` 而不是普通 `object`，意味着它将获得 `toString()` 函数，而无需手动覆盖它：

```kotlin
sealed interface ReadResult
data class Number(val number: Int) : ReadResult
data class Text(val text: String) : ReadResult
data object EndOfFile : ReadResult

fun main() {
    println(Number(7)) 
    // Number(number=7)
    println(EndOfFile) 
    // EndOfFile
}
```
{kotlin-runnable="true" id="data-objects-sealed-hierarchies"}

### 伴生对象

*伴生对象*允许你定义类级别函数和属性。这使得创建工厂方法、保存常量和访问共享工具变得容易。

类中的对象声明可以用 `companion` 关键字标记：

```kotlin
class MyClass {
    companion object Factory {
        fun create(): MyClass = MyClass()
    }
}
```

`companion object` 的成员可以简单地通过使用类名作为限定符来调用：

```kotlin
class User(val name: String) {
    // 定义一个伴生对象，充当创建 User 实例的工厂
    companion object Factory {
        fun create(name: String): User = User(name)
    }
}

fun main(){
    // 使用类名作为限定符调用伴生对象的工厂方法。 
    // 创建一个新的 User 实例
    val userInstance = User.create("John Doe")
    println(userInstance.name)
    // John Doe
}
```
{kotlin-runnable="true" id="object-expression-companion-object"}

`companion object` 的名称可以省略，在这种情况下，使用名称 `Companion`：

```kotlin
class User(val name: String) {
    // 定义一个未命名的伴生对象
    companion object { }
}

// 访问伴生对象
val companionUser = User.Companion
```

类成员可以访问其相应 `companion object` 的 `private` 成员：

```kotlin
class User(val name: String) {
    companion object {
        private val defaultGreeting = "Hello"
    }

    fun sayHi() {
        println(defaultGreeting)
    }
}
User("Nick").sayHi()
// Hello
```

当单独使用类名时，它充当对该类伴生对象的引用，无论伴生对象是否命名：

```kotlin
//sampleStart
class User1 {
    // 定义一个命名伴生对象
    companion object Named {
        fun show(): String = "User1's Named Companion Object"
    }
}

// 使用类名引用 User1 的伴生对象
val reference1 = User1

class User2 {
    // 定义一个未命名伴生对象
    companion object {
        fun show(): String = "User2's Companion Object"
    }
}

// 使用类名引用 User2 的伴生对象
val reference2 = User2
//sampleEnd

fun main() {
    // 调用 User1 伴生对象中的 show() 函数
    println(reference1.show()) 
    // User1's Named Companion Object

    // 调用 User2 伴生对象中的 show() 函数
    println(reference2.show()) 
    // User2's Companion Object
}
```
{kotlin-runnable="true" id="object-expression-companion-object-names"}

尽管 Kotlin 中伴生对象的成员看起来像其他语言中的静态成员，但它们实际上是伴生对象的实例成员，这意味着它们属于对象本身。这允许伴生对象实现接口：

```kotlin
interface Factory<T> {
    fun create(name: String): T
}

class User(val name: String) {
    // 定义一个实现 Factory 接口的伴生对象
    companion object : Factory<User> {
        override fun create(name: String): User = User(name)
    }
}

fun main() {
    // 将伴生对象用作 Factory
    val userFactory: Factory<User> = User
    val newUser = userFactory.create("Example User")
    println(newUser.name)
    // Example User
}
```
{kotlin-runnable="true" id="object-expression-factory"}

然而，在 JVM 上，如果你使用 `@JvmStatic` 注解，伴生对象的成员可以生成为真正的静态方法和字段。有关更多详细信息，请参阅 [Java 互操作性](java-to-kotlin-interop.md#static-fields)部分。

## 对象表达式

对象表达式声明一个类并创建该类的实例，但不命名它们中的任何一个。这些类对于一次性使用很有用。它们可以从头创建，继承现有类，或实现接口。这些类的实例也称为*匿名对象*，因为它们由表达式而非名称定义。

### 从头创建匿名对象

对象表达式以 `object` 关键字开头。

如果对象不扩展任何类或实现任何接口，你可以在 `object` 关键字后的花括号内直接定义对象的成员：

```kotlin
fun main() {
//sampleStart
    val helloWorld = object {
        val hello = "Hello"
        val world = "World"
        // 对象表达式扩展 Any 类，该类已经有一个 toString() 函数，
        // 因此必须覆盖它
        override fun toString() = "$hello $world"
    }

    print(helloWorld)
    // Hello World
//sampleEnd
}
```
{kotlin-runnable="true" id="object-expression-object"}

### 从超类型继承匿名对象

要创建一个从某种类型（或多种类型）继承的匿名对象，请在 `object` 和冒号 `:` 之后指定此类型。然后实现或覆盖此类的成员，就像你正在[继承](inheritance.md)它一样：

```kotlin
window.addMouseListener(object : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { /*...*/ }

    override fun mouseEntered(e: MouseEvent) { /*...*/ }
})
```

如果超类型有构造函数，请将适当的构造函数实参传递给它。可以在冒号后指定多个超类型，用逗号分隔：

```kotlin
//sampleStart
// 创建一个带有 balance 属性的开放类 BankAccount
open class BankAccount(initialBalance: Int) {
    open val balance: Int = initialBalance
}

// 定义一个带有 execute() 函数的接口 Transaction
interface Transaction {
    fun execute()
}

// 一个在 BankAccount 上执行特殊事务的函数
fun specialTransaction(account: BankAccount) {
    // 创建一个匿名对象，它继承 BankAccount 类并实现 Transaction 接口
    // 所提供账户的 balance 被传递给 BankAccount 超类构造函数
    val temporaryAccount = object : BankAccount(account.balance), Transaction {

        override val balance = account.balance + 500  // 临时奖金

        // 实现 Transaction 接口中的 execute() 函数
        override fun execute() {
            println("Executing special transaction. New balance is $balance.")
        }
    }
    // 执行事务
    temporaryAccount.execute()
}
//sampleEnd
fun main() {
    // 创建一个初始 balance 为 1000 的 BankAccount
    val myAccount = BankAccount(1000)
    // 在创建的账户上执行特殊事务
    specialTransaction(myAccount)
    // Executing special transaction. New balance is 1500.
}
```
{kotlin-runnable="true" id="object-expression-anonymous-object"}

### 将匿名对象用作返回类型和值类型

当你从局部或 [`private`](visibility-modifiers.md#packages) 函数或属性返回匿名对象时，该匿名对象的所有成员都可以通过该函数或属性访问：

```kotlin
//sampleStart
class UserPreferences {
    private fun getPreferences() = object {
        val theme: String = "Dark"
        val fontSize: Int = 14
    }

    fun printPreferences() {
        val preferences = getPreferences()
        println("Theme: ${preferences.theme}, Font Size: ${preferences.fontSize}")
    }
}
//sampleEnd

fun main() {
    val userPreferences = UserPreferences()
    userPreferences.printPreferences()
    // Theme: Dark, Font Size: 14
}
```
{kotlin-runnable="true" id="object-expression-object-return"}

这允许你返回一个带有特定属性的匿名对象，提供了一种无需创建单独类即可封装数据或行为的简单方法。

如果返回匿名对象的函数或属性具有 `public`、`protected` 或 `internal` 可见性，则其实际类型为：

*   `Any`，如果匿名对象没有声明的超类型。
*   匿名对象的声明超类型，如果只有一个这样的类型。
*   显式声明的类型，如果声明了多个超类型。

在所有这些情况下，在匿名对象中添加的成员不可访问。如果覆盖的成员是在函数或属性的实际类型中声明的，则它们是可访问的。例如：

```kotlin
//sampleStart
interface Notification {
    // 在 Notification 接口中声明 notifyUser()
    fun notifyUser()
}

interface DetailedNotification

class NotificationManager {
    // 返回类型是 Any。message 属性不可访问。
    // 当返回类型是 Any 时，只有 Any 类的成员可访问。
    fun getNotification() = object {
        val message: String = "General notification"
    }

    // 返回类型是 Notification，因为匿名对象只实现一个接口
    // notifyUser() 函数可访问，因为它属于 Notification 接口
    // message 属性不可访问，因为它未在 Notification 接口中声明
    fun getEmailNotification() = object : Notification {
        override fun notifyUser() {
            println("Sending email notification")
        }
        val message: String = "You've got mail!"
    }

    // 返回类型是 DetailedNotification。notifyUser() 函数和 message 属性不可访问
    // 只有在 DetailedNotification 接口中声明的成员可访问
    fun getDetailedNotification(): DetailedNotification = object : Notification, DetailedNotification {
        override fun notifyUser() {
            println("Sending detailed notification")
        }
        val message: String = "Detailed message content"
    }
}
//sampleEnd
fun main() {
    // 这不会产生输出
    val notificationManager = NotificationManager()

    // message 属性在这里不可访问，因为返回类型是 Any
    // 这不会产生输出
    val notification = notificationManager.getNotification()

    // notifyUser() 函数可访问
    // message 属性在这里不可访问，因为返回类型是 Notification
    val emailNotification = notificationManager.getEmailNotification()
    emailNotification.notifyUser()
    // Sending email notification

    // notifyUser() 函数和 message 属性在这里不可访问，因为返回类型是 DetailedNotification
    // 这不会产生输出
    val detailedNotification = notificationManager.getDetailedNotification()
}
```
{kotlin-runnable="true" id="object-expression-object-override"}

### 从匿名对象访问变量

对象表达式体内的代码可以访问封闭作用域中的变量：

```kotlin
import java.awt.event.MouseAdapter
import java.awt.event.MouseEvent

fun countClicks(window: JComponent) {
    var clickCount = 0
    var enterCount = 0

    // MouseAdapter 为鼠标事件函数提供默认实现
    // 模拟 MouseAdapter 处理鼠标事件
    window.addMouseListener(object : MouseAdapter() {
        override fun mouseClicked(e: MouseEvent) {
            clickCount++
        }

        override fun mouseEntered(e: MouseEvent) {
            enterCount++
        }
    })
    // clickCount 和 enterCount 变量在对象表达式中是可访问的
}
```

## 对象声明与表达式之间的行为差异

对象声明和对象表达式在初始化行为上存在差异：

*   对象表达式在使用时*立即*执行（并初始化）。
*   对象声明在首次访问时*惰性*初始化。
*   伴生对象在加载（解析）相应类时初始化，这与 Java 静态初始化器的语义相符。