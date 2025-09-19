[//]: # (title: 进阶：属性)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">扩展函数</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函数</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">带接收者的 lambda 表达式</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">类与接口</a><br />
        <img src="icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">对象</a><br />
        <img src="icon-6-done.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">开放类与特殊类</a><br />
        <img src="icon-7.svg" width="20" alt="Seventh step" /> <strong>属性</strong><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">空安全</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">库与 API</a></p>
</tldr>

在初级教程中，你学习了属性如何用于声明类实例的特性以及如何访问它们。本章将深入探讨 Kotlin 中属性的工作原理，并探索在代码中使用它们的其他方式。

## 幕后字段

在 Kotlin 中，属性拥有默认的 `get()` 和 `set()` 函数，它们被称为属性访问器，负责检索和修改属性值。尽管这些默认函数在代码中不显式可见，编译器会自动生成它们以在幕后管理属性访问。这些访问器使用**幕后字段**来存储实际的属性值。

在以下任一情况为真时，幕后字段存在：

*   你使用了属性的默认 `get()` 或 `set()` 函数。
*   你尝试通过使用 `field` 关键字在代码中访问属性值。

> `get()` 和 `set()` 函数也称为 getter 和 setter。
>
{style="tip"}

例如，这段代码中的 `category` 属性没有自定义的 `get()` 或 `set()` 函数，因此使用默认实现：

```kotlin
class Contact(val id: Int, var email: String) {
    var category: String = ""
}
```

在底层，这等同于以下伪代码：

```kotlin
class Contact(val id: Int, var email: String) {
    var category: String = ""
        get() = field
        set(value) {
            field = value
        }
}
```
{validate="false"}

在此示例中：

*   `get()` 函数从字段中检索属性值：`""`。
*   `set()` 函数接受 `value` 作为形参并将其赋值给字段，其中 `value` 是 `""`。

当你想在 `get()` 或 `set()` 函数中添加额外逻辑而不引起无限循环时，访问幕后字段很有用。例如，你有一个包含 `name` 属性的 `Person` 类：

```kotlin
class Person {
    var name: String = ""
}
```

你想要确保 `name` 属性的首字母大写，因此你创建了一个自定义的 `set()` 函数，该函数使用了 [`.replaceFirstChar()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace-first-char.html) 和 [`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase-char.html) 扩展函数。然而，如果你在 `set()` 函数中直接引用该属性，你将创建一个无限循环，并在运行时看到 `StackOverflowError`：

```kotlin
class Person {
    var name: String = ""
        set(value) {
            // 这会导致运行时错误
            name = value.replaceFirstChar { firstChar -> firstChar.uppercase() }
        }
}

fun main() {
    val person = Person()
    person.name = "kodee"
    println(person.name)
    // Exception in thread "main" java.lang.StackOverflowError
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-stackoverflow"}

为了解决这个问题，你可以在 `set()` 函数中改用幕后字段，通过 `field` 关键字引用它：

```kotlin
class Person {
    var name: String = ""
        set(value) {
            field = value.replaceFirstChar { firstChar -> firstChar.uppercase() }
        }
}

fun main() {
    val person = Person()
    person.name = "kodee"
    println(person.name)
    // Kodee
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-backingfield"}

幕后字段在以下场景也很有用：添加日志记录、在属性值改变时发送通知，或者使用比较新旧属性值的额外逻辑。

关于幕后字段的更多信息，请参见 [幕后字段](properties.md#backing-fields)。

## 扩展属性

就像扩展函数一样，也有扩展属性。扩展属性允许你在不修改现有类的源代码的情况下，为其添加新的属性。然而，Kotlin 中的扩展属性**不**包含幕后字段。这意味着你需要自己编写 `get()` 和 `set()` 函数。此外，缺乏幕后字段意味着它们不能持有任何状态。

要声明一个扩展属性，请写下你想要扩展的类名，然后是 `.` 和你的属性名。就像普通的类属性一样，你需要为你的属性声明一个接收者类型。例如：

```kotlin
val String.lastChar: Char
```
{validate="false"}

当你希望属性包含一个计算值而无需使用继承时，扩展属性最有用。你可以将扩展属性视为只有一个形参（接收者对象）的函数。

例如，假设你有一个名为 `Person` 的数据类，其中包含两个属性：`firstName` 和 `lastName`。

```kotlin
data class Person(val firstName: String, val lastName: String)
```

你希望能够访问个人的全名，而无需修改 `Person` 数据类或从其继承。你可以通过创建带有自定义 `get()` 函数的扩展属性来实现这一点：

```kotlin
data class Person(val firstName: String, val lastName: String)

// 获取全名的扩展属性
val Person.fullName: String
    get() = "$firstName $lastName"

fun main() {
    val person = Person(firstName = "John", lastName = "Doe")

    // 使用扩展属性
    println(person.fullName)
    // John Doe
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-extension"}

> 扩展属性不能覆盖类中已有的属性。
>
{style="note"}

就像扩展函数一样，Kotlin 标准库广泛使用了扩展属性。例如，请参阅 `CharSequence` 的 [`lastIndex` 属性](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/last-index.html)。

## 委托属性

你已经在[类与接口](kotlin-tour-intermediate-classes-interfaces.md#delegation)章节中学习了委托。你也可以将委托用于属性，将其属性访问器委托给另一个对象。当你对属性存储有更复杂的需求（例如将值存储在数据库表、浏览器会话或 Map 中）而简单幕后字段无法处理时，这很有用。使用委托属性还可以减少样板代码，因为获取和设置属性的逻辑仅包含在你委托的对象中。

语法与类委托相似，但在不同层级上操作。声明你的属性，后跟 `by` 关键字以及你想要委托的对象。例如：

```kotlin
val displayName: String by Delegate
```

在这里，委托属性 `displayName` 的属性访问器引用了 `Delegate` 对象。

你委托的每个对象**必须**有一个 `getValue()` 操作符函数，Kotlin 用它来检索委托属性的值。如果属性是可变的，它还必须有一个 `setValue()` 操作符函数，供 Kotlin 设置其值。

默认情况下，`getValue()` 和 `setValue()` 函数具有以下构造：

```kotlin
operator fun getValue(thisRef: Any?, property: KProperty<*>): String {}

operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {}
```
{validate="false"}

在这些函数中：

*   `operator` 关键字将这些函数标记为操作符函数，使其能够重载 `get()` 和 `set()` 函数。
*   `thisRef` 形参引用了**包含**委托属性的对象。默认情况下，类型设置为 `Any?`，但你可能需要声明一个更具体的类型。
*   `property` 形参引用了其值被访问或更改的属性。你可以使用此形参访问属性的名称或类型等信息。默认情况下，类型设置为 `KProperty<*>`。你无需担心在代码中更改此项。

`getValue()` 函数默认返回类型为 `String`，但你可以根据需要进行调整。

`setValue()` 函数有一个额外的形参 `value`，它用于保存赋值给属性的新值。

那么，这在实践中是怎样的呢？假设你想要一个计算属性，例如用户的显示名称，该属性只计算一次，因为该操作开销大且你的应用程序对性能敏感。你可以使用委托属性来缓存显示名称，这样它只计算一次，但可以随时访问而不会影响性能。

首先，你需要创建要委托的对象。在本例中，该对象将是 `CachedStringDelegate` 类的一个实例：

```kotlin
class CachedStringDelegate {
    var cachedValue: String? = null
}
```

`cachedValue` 属性包含缓存值。在 `CachedStringDelegate` 类中，将你希望委托属性的 `get()` 函数具有的行为添加到 `getValue()` 操作符函数体中：

```kotlin
class CachedStringDelegate {
    var cachedValue: String? = null

    operator fun getValue(thisRef: Any?, property: Any?): String {
        if (cachedValue == null) {
            cachedValue = "Default Value"
            println("Computed and cached: $cachedValue")
        } else {
            println("Accessed from cache: $cachedValue")
        }
        return cachedValue ?: "Unknown"
    }
}
```

`getValue()` 函数检测 `cachedValue` 属性是否为 `null`。如果是，该函数赋值 `"Default value"` 并打印一个字符串用于日志记录。如果 `cachedValue` 属性已经计算过，该属性不为 `null`。在这种情况下，会打印另一个字符串用于日志记录。最后，该函数使用 Elvis 操作符返回缓存值，如果值为 `null` 则返回 `"Unknown"`。

现在，你可以将想要缓存的属性（`val displayName`）委托给 `CachedStringDelegate` 类的一个实例：

```kotlin
class CachedStringDelegate {
    var cachedValue: String? = null

    operator fun getValue(thisRef: User, property: Any?): String {
        if (cachedValue == null) {
            cachedValue = "${thisRef.firstName} ${thisRef.lastName}"
            println("Computed and cached: $cachedValue")
        } else {
            println("Accessed from cache: $cachedValue")
        }
        return cachedValue ?: "Unknown"
    }
}

class User(val firstName: String, val lastName: String) {
    val displayName: String by CachedStringDelegate()
}

fun main() {
    val user = User("John", "Doe")

    // 首次访问计算并缓存值
    println(user.displayName)
    // 已计算并缓存：John Doe
    // John Doe

    // 后续访问从缓存中检索值
    println(user.displayName)
    // 已从缓存访问：John Doe
    // John Doe
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-delegated"}

本示例：

*   创建了一个 `User` 类，该类在头部包含两个属性 `firstName` 和 `lastName`，在类体中包含一个属性 `displayName`。
*   将 `displayName` 属性委托给 `CachedStringDelegate` 类的一个实例。
*   创建了一个名为 `user` 的 `User` 类实例。
*   打印访问 `user` 实例上 `displayName` 属性的结果。

请注意，在 `getValue()` 函数中，`thisRef` 形参的类型从 `Any?` 类型缩小为对象类型：`User`。这样编译器就可以访问 `User` 类的 `firstName` 和 `lastName` 属性。

### 标准委托

Kotlin 标准库为你提供了一些有用的委托，因此你无需总是从头开始创建。如果你使用这些委托中的一个，你无需定义 `getValue()` 和 `setValue()` 函数，因为标准库会自动提供它们。

#### 惰性属性

要仅在首次访问属性时初始化它，请使用惰性属性。标准库提供了用于委托的 `Lazy` 接口。

要创建 `Lazy` 接口的实例，请使用 `lazy()` 函数，并为其提供一个 lambda 表达式，该表达式将在首次调用 `get()` 函数时执行。`get()` 函数的任何后续调用都将返回首次调用时提供相同的结果。惰性属性使用[尾部 lambda](kotlin-tour-functions.md#trailing-lambdas) 语法来传递 lambda 表达式。

例如：

```kotlin
class Database {
    fun connect() {
        println("Connecting to the database...")
    }

    fun query(sql: String): List<String> {
        return listOf("Data1", "Data2", "Data3")
    }
}

val databaseConnection: Database by lazy {
    val db = Database()
    db.connect()
    db
}

fun fetchData() {
    val data = databaseConnection.query("SELECT * FROM data")
    println("Data: $data")
}

fun main() {
    // 首次访问 databaseConnection
    fetchData()
    // 正在连接到数据库...
    // Data: [Data1, Data2, Data3]

    // 后续访问使用现有连接
    fetchData()
    // Data: [Data1, Data2, Data3]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-lazy"}

在此示例中：

*   有一个 `Database` 类，它包含 `connect()` 和 `query()` 成员函数。
*   `connect()` 函数向控制台打印一个字符串，`query()` 函数接受一个 SQL 查询并返回一个 list。
*   有一个 `databaseConnection` 属性，它是一个惰性属性。
*   提供给 `lazy()` 函数的 lambda 表达式：
    *   创建 `Database` 类的一个实例。
    *   调用此实例 (`db`) 上的 `connect()` 成员函数。
    *   返回该实例。
*   有一个 `fetchData()` 函数：
    *   通过调用 `databaseConnection` 属性上的 `query()` 函数来创建 SQL 查询。
    *   将 SQL 查询赋值给 `data` 变量。
    *   将 `data` 变量打印到控制台。
*   `main()` 函数调用 `fetchData()` 函数。首次调用时，惰性属性被初始化。第二次调用时，返回与首次调用相同的结果。

惰性属性不仅在初始化资源密集型时有用，而且当属性可能在你的代码中不被使用时也很有用。此外，惰性属性默认是线程安全的，这在你并发环境中工作时尤其有益。

关于惰性属性的更多信息，请参见 [惰性属性](delegated-properties.md#lazy-properties)。

#### 可观察属性

要监控属性值是否更改，请使用可观察属性。当你想要检测属性值的变化并利用此知识触发反应时，可观察属性很有用。标准库提供了用于委托的 `Delegates` 对象。

要创建可观察属性，你必须首先导入 `kotlin.properties.Delegates.observable`。然后，使用 `observable()` 函数并为其提供一个 lambda 表达式，该表达式将在属性更改时执行。就像惰性属性一样，可观察属性也使用[尾部 lambda](kotlin-tour-functions.md#trailing-lambdas) 语法来传递 lambda 表达式。

例如：

```kotlin
import kotlin.properties.Delegates.observable

class Thermostat {
    var temperature: Double by observable(20.0) { _, old, new ->
        if (new > 25) {
            println("Warning: Temperature is too high! ($old°C -> $new°C)")
        } else {
            println("Temperature updated: $old°C -> $new°C")
        }
    }
}

fun main() {
    val thermostat = Thermostat()
    thermostat.temperature = 22.5
    // 温度已更新：20.0°C -> 22.5°C

    thermostat.temperature = 27.0
    // 警告：温度过高！(22.5°C -> 27.0°C)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-observable"}

在此示例中：

*   有一个 `Thermostat` 类，其中包含一个可观察属性：`temperature`。
*   `observable()` 函数接受 `20.0` 作为形参，并用它来初始化属性。
*   提供给 `observable()` 函数的 lambda 表达式：
    *   包含三个形参：
        *   `_`，它引用属性本身。
        *   `old`，它是属性的旧值。
        *   `new`，它是属性的新值。
    *   检测 `new` 形参是否大于 `25`，并根据结果向控制台打印一个字符串。
*   `main()` 函数：
    *   创建了一个名为 `thermostat` 的 `Thermostat` 类实例。
    *   将实例的 `temperature` 属性值更新为 `22.5`，这会触发一个带有温度更新的打印语句。
    *   将实例的 `temperature` 属性值更新为 `27.0`，这会触发一个带有警告的打印语句。

可观察属性不仅用于日志记录和调试目的。你也可以将它们用于更新 UI 或执行额外检测的用例，例如验证数据的有效性。

关于可观察属性的更多信息，请参见 [可观察属性](delegated-properties.md#observable-properties)。

## 实践

### 练习 1 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-1"}

你管理着一家书店的库存系统。库存存储在一个 list 中，其中每个项代表特定书籍的数量。例如，`listOf(3, 0, 7, 12)` 表示书店有第一本书的 3 本副本，第二本书的 0 本，第三本书的 7 本，第四本书的 12 本。

编写一个名为 `findOutOfStockBooks()` 的函数，该函数返回所有缺货书籍的索引 list。

<deflist collapsible="true">
    <def title="提示 1">
        使用标准库中的 <a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/indices.html"><code>indices</code></a> 扩展属性。
    </def>
</deflist>

<deflist collapsible="true">
    <def title="提示 2">
        你可以使用 <a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/build-list.html"><code>buildList()</code></a> 函数来创建和管理 `list`，而不是手动创建并返回一个可变 `list`。`buildList()` 函数使用带接收者的 lambda 表达式，你已在之前的章节中学习过。
    </def>
</deflist>

|--|--|

```kotlin
fun findOutOfStockBooks(inventory: List<Int>): List<Int> {
    // 在此处编写你的代码
}

fun main() {
    val inventory = listOf(3, 0, 7, 0, 5)
    println(findOutOfStockBooks(inventory))
    // [1, 3]
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-exercise-1"}

|---|---|
```kotlin
fun findOutOfStockBooks(inventory: List<Int>): List<Int> {
    val outOfStockIndices = mutableListOf<Int>()
    for (index in inventory.indices) {
        if (inventory[index] == 0) {
            outOfStockIndices.add(index)
        }
    }
    return outOfStockIndices
}

fun main() {
    val inventory = listOf(3, 0, 7, 0, 5)
    println(findOutOfStockBooks(inventory))
    // [1, 3]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案 1" id="kotlin-tour-properties-solution-1-1"}

|---|---|
```kotlin
fun findOutOfStockBooks(inventory: List<Int>): List<Int> = buildList {
    for (index in inventory.indices) {
        if (inventory[index] == 0) {
            add(index)
        }
    }
}

fun main() {
    val inventory = listOf(3, 0, 7, 0, 5)
    println(findOutOfStockBooks(inventory))
    // [1, 3]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案 2" id="kotlin-tour-properties-solution-1-2"}

### 练习 2 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-2"}

你有一个旅行应用，需要以千米和英里两种单位显示距离。为 `Double` 类型创建一个名为 `asMiles` 的扩展属性，用于将千米距离转换为英里：

> 将千米转换为英里的公式是 `miles = kilometers * 0.621371`。
>
{style="note"}

<deflist collapsible="true">
    <def title="提示">
        请记住，扩展属性需要一个自定义的 <code>get()</code> 函数。
    </def>
</deflist>

|---|---|

```kotlin
val // 在此处编写你的代码

fun main() {
    val distanceKm = 5.0
    println("$distanceKm km is ${distanceKm.asMiles} miles")
    // 5.0 km is 3.106855 miles

    val marathonDistance = 42.195
    println("$marathonDistance km is ${marathonDistance.asMiles} miles")
    // 42.195 km is 26.218757 miles
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-exercise-2"}

|---|---|
```kotlin
val Double.asMiles: Double
    get() = this * 0.621371

fun main() {
    val distanceKm = 5.0
    println("$distanceKm km is ${distanceKm.asMiles} miles")
    // 5.0 km is 3.106855 miles

    val marathonDistance = 42.195
    println("$marathonDistance km is ${marathonDistance.asMiles} miles")
    // 42.195 km is 26.218757 miles
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-properties-solution-2"}

### 练习 3 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-3"}

你有一个系统健康检查器，可以确定云系统的状态。然而，它可以运行的两个执行健康检查的函数是性能密集型的。使用惰性属性来初始化检查，以便昂贵的函数只在需要时运行：

|---|---|

```kotlin
fun checkAppServer(): Boolean {
    println("Performing application server health check...")
    return true
}

fun checkDatabase(): Boolean {
    println("Performing database health check...")
    return false
}

fun main() {
    // 在此处编写你的代码

    when {
        isAppServerHealthy -> println("Application server is online and healthy")
        isDatabaseHealthy -> println("Database is healthy")
        else -> println("System is offline")
    }
    // Performing application server health check...
    // Application server is online and healthy
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-exercise-3"}

|---|---|
```kotlin
fun checkAppServer(): Boolean {
    println("Performing application server health check...")
    return true
}

fun checkDatabase(): Boolean {
    println("Performing database health check...")
    return false
}

fun main() {
    val isAppServerHealthy by lazy { checkAppServer() }
    val isDatabaseHealthy by lazy { checkDatabase() }

    when {
        isAppServerHealthy -> println("Application server is online and healthy")
        isDatabaseHealthy -> println("Database is healthy")
        else -> println("System is offline")
    }
   // Performing application server health check...
   // Application server is online and healthy
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-properties-solution-3"}

### 4 练习 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-4"}

你正在构建一个简单的预算跟踪应用。该应用需要观察用户剩余预算的变化，并在预算低于某个阈值时通知他们。你有一个 `Budget` 类，它使用 `totalBudget` 属性进行初始化，该属性包含初始预算金额。在类中，创建一个名为 `remainingBudget` 的可观察属性，它会打印：

*   当值低于初始预算的 20% 时发出警告。
*   当预算从先前的值增加时发出鼓励信息。

|---|---|

```kotlin
import kotlin.properties.Delegates.observable

class Budget(val totalBudget: Int) {
    var remainingBudget: Int // 在此处编写你的代码
}

fun main() {
    val myBudget = Budget(totalBudget = 1000)
    myBudget.remainingBudget = 800
    myBudget.remainingBudget = 150
    // Warning: Your remaining budget (150) is below 20% of your total budget.
    myBudget.remainingBudget = 50
    // Warning: Your remaining budget (50) is below 20% of your total budget.
    myBudget.remainingBudget = 300
    // Good news: Your remaining budget increased to 300.
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-exercise-4"}

|---|---|
```kotlin
import kotlin.properties.Delegates.observable

class Budget(val totalBudget: Int) {
  var remainingBudget: Int by observable(totalBudget) { _, oldValue, newValue ->
    if (newValue < totalBudget * 0.2) {
      println("Warning: Your remaining budget ($newValue) is below 20% of your total budget.")
    } else if (newValue > oldValue) {
      println("Good news: Your remaining budget increased to $newValue.")
    }
  }
}

fun main() {
  val myBudget = Budget(totalBudget = 1000)
  myBudget.remainingBudget = 800
  myBudget.remainingBudget = 150
  // Warning: Your remaining budget (150) is below 20% of your total budget.
  myBudget.remainingBudget = 50
  // Warning: Your remaining budget (50) is below 20% of your total budget.
  myBudget.remainingBudget = 300
  // Good news: Your remaining budget increased to 300.
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-properties-solution-4"}

## 下一步

[进阶：空安全](kotlin-tour-intermediate-null-safety.md)