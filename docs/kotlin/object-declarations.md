[//]: # (title: 对象声明和表达式)

在 Kotlin 中，对象允许你一步到位地定义一个类并创建其实例。当你需要可复用的单例实例或一次性对象时，这非常有用。为了处理这些场景，Kotlin 提供了两种主要方法：用于创建单例的 _对象声明_ 和用于创建匿名一次性对象的 _对象表达式_。

> 单例确保一个类只有一个实例，并提供对其的全局访问点。
>
{style="tip"}

对象声明和对象表达式最适合以下场景：

*   **将单例用于共享资源：** 你需要确保应用程序中某个类只有一个实例。例如，管理数据库连接池。
*   **创建工厂方法：** 你需要一种方便高效地创建实例的方法。[伴生对象](#companion-objects) 允许你定义与类绑定的类级别函数和属性，简化了这些实例的创建和管理。
*   **临时修改现有类的行为：** 你想修改现有类的行为，而无需创建新的子类。例如，为一个特定操作向对象添加临时功能。
*   **需要类型安全设计：** 你需要使用对象表达式对接口或 [抽象类](classes.md#abstract-classes) 进行一次性实现。这对于按钮点击处理器等场景非常有用。

## 对象声明
{id="object-declarations-overview"}

你可以使用对象声明在 Kotlin 中创建对象的单个实例，对象声明始终在 `object` 关键字后有一个名称。这允许你一步到位地定义类并创建其实例，这对于实现单例很有用：

```kotlin
//sampleStart
// Declares a Singleton object to manage data providers
object DataProviderManager {
    private val providers = mutableListOf<DataProvider>()

    // Registers a new data provider
    fun registerDataProvider(provider: DataProvider) {
        providers.add(provider)
    }

    // Retrieves all registered data providers
    val allDataProviders: Collection<DataProvider> 
        get() = providers
}
//sampleEnd

// Example data provider interface
interface DataProvider {
    fun provideData(): String
}

// Example data provider implementation
class ExampleDataProvider : DataProvider {
    override fun provideData(): String {
        return "Example data"
    }
}

fun main() {
    // Creates an instance of ExampleDataProvider
    val exampleProvider = ExampleDataProvider()

    // To refer to the object, use its name directly
    DataProviderManager.registerDataProvider(exampleProvider)

    // Retrieves and prints all data providers
    println(DataProviderManager.allDataProviders.map { it.provideData() })
    // [Example data]
}
```
{kotlin-runnable="true" id="object-declaration-register-provider"}

> 对象声明的初始化是线程安全的，并在首次访问时完成。
>
{style="tip"}

要引用该 `object`，请直接使用其名称：

```kotlin
DataProviderManager.registerDataProvider(exampleProvider)
```

对象声明也可以有超类型，类似于 [匿名对象可以从现有类继承或实现接口](#inherit-anonymous-objects-from-supertypes) 的方式：

```kotlin
object DefaultListener : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
}
```

类似于变量声明，对象声明不是表达式，因此不能在赋值语句的右侧使用：

```kotlin
// 语法错误：对象表达式不能绑定名称。
val myObject = object MySingleton {
    val name = "Singleton"
}
```
对象声明不能是局部的，这意味着它们不能直接嵌套在函数内部。但是，它们可以嵌套在其他对象声明或非内部类中。

### 数据对象

在 Kotlin 中打印普通对象声明时，其字符串表示形式包含其名称和 `object` 的哈希值：

```kotlin
object MyObject

fun main() {
    println(MyObject) 
    // MyObject@hashcode
}
```
{kotlin-runnable="true" id="object-declaration-plain"}

但是，通过使用 `data` 修饰符标记对象声明，你可以指示编译器在调用 `toString()` 时返回对象的实际名称，就像 [数据类](data-classes.md) 一样：

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

此外，编译器还会为你的 `data object` 生成多个函数：

*   `toString()` 返回数据对象的名称
*   `equals()`/`hashCode()` 启用相等性检查和基于哈希的集合

  > 你无法为 `data object` 提供自定义的 `equals` 或 `hashCode` 实现。
  >
  {style="note"}

`data object` 的 `equals()` 函数确保所有具有 `data object` 类型的对象都被视为相等。在大多数情况下，由于 `data object` 声明了一个单例，因此在运行时你的 `data object` 将只有一个实例。但是，在运行时生成另一个相同类型的对象的边缘情况下（例如，通过使用 `java.lang.reflect` 进行平台反射或底层使用此 API 的 JVM 序列化库），这可以确保这些对象被视为相等。

> 确保只对 `data object` 进行结构性比较（使用 `==` 运算符），而不是按引用比较（使用 `===` 运算符）。这有助于避免在运行时存在多个数据对象实例时出现的陷阱。
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
    // 它的 equals() 函数也会返回 true：
    println(MySingleton == evilTwin) 
    // true

    // 不要使用 === 比较数据对象
    println(MySingleton === evilTwin) 
    // false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlin 反射不允许实例化数据对象。
    // 这“强制”创建了一个新的 MySingleton 实例（使用 Java 平台反射）
    // 不要自己这样做！
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

生成的 `hashCode()` 函数的行为与 `equals()` 函数的行为一致，因此 `data object` 的所有运行时实例都具有相同的哈希码。

#### 数据对象与数据类之间的差异

尽管 `data object` 和 `data class` 声明经常一起使用并有一些相似之处，但 `data object` 不会生成一些函数：

*   没有 `copy()` 函数。因为 `data object` 声明旨在用作单例，所以不会生成 `copy()` 函数。单例将类的实例化限制为单个实例，允许创建实例副本会违反此限制。
*   没有 `componentN()` 函数。与 `data class` 不同，`data object` 没有任何数据属性。由于尝试解构没有数据属性的对象没有意义，因此不会生成 `componentN()` 函数。

#### 将数据对象与密封层次结构结合使用

数据对象声明对于 [密封类或密封接口](sealed-classes.md) 等密封层次结构特别有用。它们让你能够与可能与对象一起定义的任何数据类保持对称性。

在此示例中，将 `EndOfFile` 声明为 `data object` 而不是普通 `object` 意味着它将获得 `toString()` 函数，而无需手动覆盖它：

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

_伴生对象_ 允许你定义类级别的函数和属性。这使得创建工厂方法、持有常量和访问共享工具变得容易。

类中的对象声明可以使用 `companion` 关键字标记：

```kotlin
class MyClass {
    companion object Factory {
        fun create(): MyClass = MyClass()
    }
}
```

伴生对象的成员可以简单地通过使用类名作为限定符来调用：

```kotlin
class User(val name: String) {
    // 定义一个伴生对象，作为创建 User 实例的工厂
    companion object Factory {
        fun create(name: String): User = User(name)
    }
}

fun main(){
    // 使用类名作为限定符，调用伴生对象的工厂方法。 
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
    // 定义一个没有名称的伴生对象
    companion object { }
}

// 访问伴生对象
val companionUser = User.Companion
```

类成员可以访问其相应伴生对象的 `private` 成员：

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

当类名单独使用时，它充当对该类的伴生对象的引用，无论伴生对象是否命名：

```kotlin
//sampleStart
class User1 {
    // 定义一个命名的伴生对象
    companion object Named {
        fun show(): String = "User1's Named Companion Object"
    }
}

// 使用类名引用 User1 的伴生对象
val reference1 = User1

class User2 {
    // 定义一个未命名的伴生对象
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

尽管 Kotlin 中伴生对象的成员看起来像其他语言中的静态成员，但它们实际上是伴生对象的实例成员，意味着它们属于对象本身。这使得伴生对象可以实现接口：

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
    // 将伴生对象用作工厂
    val userFactory: Factory<User> = User
    val newUser = userFactory.create("Example User")
    println(newUser.name)
    // Example User
}
```
{kotlin-runnable="true" id="object-expression-factory"}

然而，在 JVM 上，如果你使用 `@JvmStatic` 注解，伴生对象的成员可以生成为真正的静态方法和字段。有关更多详细信息，请参阅 [Java 互操作性](java-to-kotlin-interop.md#static-fields) 部分。

## 对象表达式

对象表达式声明一个类并创建该类的一个实例，但不对两者进行命名。这些类对于一次性使用很有用。它们可以从头创建，从现有类继承，或实现接口。这些类的实例也称为 _匿名对象_，因为它们是由表达式而不是名称定义的。

### 从头创建匿名对象

对象表达式以 `object` 关键字开头。

如果对象不扩展任何类或实现接口，你可以在 `object` 关键字后的花括号内直接定义对象的成员：

```kotlin
fun main() {
//sampleStart
    val helloWorld = object {
        val hello = "Hello"
        val world = "World"
        // 对象表达式扩展了 Any 类，该类已经有一个 toString() 函数，
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

要创建从某种类型（或多种类型）继承的匿名对象，请在 `object` 关键字和冒号 `:` 之后指定此类型。然后像 [继承](inheritance.md) 该类一样实现或覆盖其成员：

```kotlin
window.addMouseListener(object : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { /*...*/ }

    override fun mouseEntered(e: MouseEvent) { /*...*/ }
})
```

如果超类型有构造函数，请将适当的构造函数参数传递给它。可以在冒号后指定多个超类型，用逗号分隔：

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

// 一个在 BankAccount 上执行特殊交易的函数
fun specialTransaction(account: BankAccount) {
    // 创建一个匿名对象，该对象继承自 BankAccount 类并实现 Transaction 接口
    // 所提供账户的 balance 传递给 BankAccount 超类构造函数
    val temporaryAccount = object : BankAccount(account.balance), Transaction {

        override val balance = account.balance + 500  // 临时奖励

        // 实现 Transaction 接口中的 execute() 函数
        override fun execute() {
            println("Executing special transaction. New balance is $balance.")
        }
    }
    // 执行交易
    temporaryAccount.execute()
}
//sampleEnd
fun main() {
    // 创建一个初始余额为 1000 的 BankAccount
    val myAccount = BankAccount(1000)
    // 对创建的账户执行特殊交易
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

这允许你返回一个具有特定属性的匿名对象，提供了一种简单的方法来封装数据或行为，而无需创建单独的类。

如果返回匿名对象的函数或属性具有 `public`、`protected` 或 `internal` 可见性，它的实际类型是：

*   如果没有声明的超类型，则为 `Any`。
*   如果匿名对象只有一个声明的超类型，则为该超类型。
*   如果有多个声明的超类型，则为显式声明的类型。

在所有这些情况下，匿名对象中添加的成员都不可访问。如果覆盖的成员在函数或属性的实际类型中声明，则可以访问它们。例如：

```kotlin
//sampleStart
interface Notification {
    // 在 Notification 接口中声明 notifyUser()
    fun notifyUser()
}

interface DetailedNotification

class NotificationManager {
    // 返回类型是 Any。message 属性不可访问。
    // 当返回类型是 Any 时，只有 Any 类的成员可以访问。
    fun getNotification() = object {
        val message: String = "General notification"
    }

    // 返回类型是 Notification，因为匿名对象只实现了一个接口
    // notifyUser() 函数可访问，因为它属于 Notification 接口
    // message 属性不可访问，因为它未在 Notification 接口中声明
    fun getEmailNotification() = object : Notification {
        override fun notifyUser() {
            println("Sending email notification")
        }
        val message: String = "You've got mail!"
    }

    // 返回类型是 DetailedNotification。notifyUser() 函数和 message 属性不可访问
    // 只有在 DetailedNotification 接口中声明的成员可以访问
    fun getDetailedNotification(): DetailedNotification = object : Notification, DetailedNotification {
        override fun notifyUser() {
            println("Sending detailed notification")
        }
        val message: String = "Detailed message content"
    }
}
//sampleEnd
fun main() {
    // 这不会产生任何输出
    val notificationManager = NotificationManager()

    // 此处 message 属性不可访问，因为返回类型是 Any
    // 这不会产生任何输出
    val notification = notificationManager.getNotification()

    // notifyUser() 函数可访问
    // 此处 message 属性不可访问，因为返回类型是 Notification
    val emailNotification = notificationManager.getEmailNotification()
    emailNotification.notifyUser()
    // Sending email notification

    // 此处 notifyUser() 函数和 message 属性不可访问，因为返回类型是 DetailedNotification
    // 这不会产生任何输出
    val detailedNotification = notificationManager.getDetailedNotification()
}
```
{kotlin-runnable="true" id="object-expression-object-override"}

### 从匿名对象访问变量

对象表达式主体内的代码可以访问封闭作用域中的变量：

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

*   对象表达式在它们被使用的地方 _立即_ 执行（和初始化）。
*   对象声明是 _延迟_ 初始化的，即在首次访问时进行。
*   伴生对象在相应的类被加载（解析）时初始化，这与 Java 静态初始化器的语义相匹配。