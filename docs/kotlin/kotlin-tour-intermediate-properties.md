[//]: # (title: 中级：属性)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="第一步" /> <a href="kotlin-tour-intermediate-extension-functions.md">扩展函数</a><br />
        <img src="icon-2-done.svg" width="20" alt="第二步" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函数</a><br />
        <img src="icon-3-done.svg" width="20" alt="第三步" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">带接收者的 Lambda 表达式</a><br />
        <img src="icon-4-done.svg" width="20" alt="第四步" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">类和接口</a><br />
        <img src="icon-5-done.svg" width="20" alt="第五步" /> <a href="kotlin-tour-intermediate-objects.md">对象</a><br />
        <img src="icon-6-done.svg" width="20" alt="第六步" /> <a href="kotlin-tour-intermediate-open-special-classes.md">开放类与特殊类</a><br />
        <img src="icon-7.svg" width="20" alt="第七步" /> <strong>属性</strong><br />
        <img src="icon-8-todo.svg" width="20" alt="第八步" /> <a href="kotlin-tour-intermediate-null-safety.md">空安全</a><br />
        <img src="icon-9-todo.svg" width="20" alt="第九步" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">库与 API</a></p>
</tldr>

在初学者教程中，你学习了如何使用属性来声明类实例的特性以及如何访问它们。本章将深入探讨属性在 Kotlin 中如何工作，并探索在代码中使用它们的其他方式。

## 后备字段

在 Kotlin 中，属性具有默认的 `get()` 和 `set()` 函数，称为属性访问器，它们负责检索和修改属性值。虽然这些默认函数在代码中不明确可见，但编译器会自动生成它们来管理属性访问。这些访问器使用**后备字段**来存储实际的属性值。

满足以下任一条件时，后备字段存在：

*   你为属性使用了默认的 `get()` 或 `set()` 函数。
*   你尝试在代码中使用 `field` 关键字访问属性值。

> `get()` 和 `set()` 函数也称为 getter 和 setter。
>
{style="tip"}

例如，这段代码中的 `category` 属性没有自定义的 `get()` 或 `set()` 函数，因此使用默认实现：

```kotlin
class Contact(val id: Int, var email: String) {
    val category: String = ""
}
```

在底层，这等同于以下伪代码：

```kotlin
class Contact(val id: Int, var email: String) {
    val category: String = ""
        get() = field
        set(value) {
            field = value
        }
}
```
{validate="false"}

在此示例中：

*   `get()` 函数从字段中检索属性值：`""`。
*   `set()` 函数接受 `value` 作为参数，并将其赋值给字段，其中 `value` 是 `""`。

当你希望在 `get()` 或 `set()` 函数中添加额外逻辑而又不想引起无限循环时，访问后备字段会很有用。例如，你有一个 `Person` 类，其中包含一个 `name` 属性：

```kotlin
class Person {
    var name: String = ""
}
```

你希望确保 `name` 属性的首字母大写，因此你创建了一个自定义的 `set()` 函数，它使用了 [`replaceFirstChar()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace-first-char.html) 和 [`uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase-char.html) 扩展函数。然而，如果你在 `set()` 函数中直接引用该属性，你会创建一个无限循环并在运行时看到 `StackOverflowError`：

```kotlin
class Person {
    var name: String = ""
        set(value) {
            // This causes a runtime error
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
{validate ="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-stackoverflow"}

为了解决这个问题，你可以改用 `set()` 函数中的后备字段，通过 `field` 关键字引用它：

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

当你想要添加日志记录、在属性值改变时发送通知，或者使用比较旧值和新值的额外逻辑时，后备字段也很有用。

有关更多信息，请参阅[后备字段](properties.md#backing-fields)。

## 扩展属性

与扩展函数类似，也有扩展属性。扩展属性允许你向现有类添加新属性，而无需修改其源代码。然而，Kotlin 中的扩展属性**不**具有后备字段。这意味着你需要自己编写 `get()` 和 `set()` 函数。此外，缺少后备字段意味着它们无法持有任何状态。

要声明一个扩展属性，请写出你想要扩展的类的名称，后跟一个 `.` 和你的属性名称。就像普通的类属性一样，你需要为你的属性声明一个接收者类型。例如：

```kotlin
val String.lastChar: Char
```
{validate="false"}

当你不使用继承而希望属性包含一个计算值时，扩展属性最有用。你可以将扩展属性视为只有一个参数的函数：接收者对象。

例如，假设你有一个名为 `Person` 的数据类，它有两个属性：`firstName` 和 `lastName`。

```kotlin
data class Person(val firstName: String, val lastName: String)
```

你希望能够在不修改 `Person` 数据类或从其继承的情况下访问该人物的全名。你可以通过创建一个带有自定义 `get()` 函数的扩展属性来实现这一点：

```kotlin
data class Person(val firstName: String, val lastName: String)

// Extension property to get the full name
val Person.fullName: String
    get() = "$firstName $lastName"

fun main() {
    val person = Person(firstName = "John", lastName = "Doe")

    // Use the extension property
    println(person.fullName)
    // John Doe
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-extension"}

> 扩展属性不能覆盖类的现有属性。
> 
{style="note"}

与扩展函数类似，Kotlin 标准库广泛使用扩展属性。例如，请参阅 `CharSequence` 的 [`lastIndex` 属性](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/last-index.html)。

## 委托属性

你已经在[类和接口](kotlin-tour-intermediate-classes-interfaces.md#delegation)章节中学习了委托。你也可以将委托应用于属性，将它们的属性访问器委托给另一个对象。这在你对属性存储有更复杂要求时很有用，例如将值存储在数据库表、浏览器会话或映射中，而简单的后备字段无法处理这些情况。使用委托属性还能减少样板代码，因为获取和设置属性的逻辑仅包含在你委托到的对象中。

语法类似于类的委托，但操作层面不同。声明你的属性，后跟 `by` 关键字和你想要委托到的对象。例如：

```kotlin
val displayName: String by Delegate
```

这里，委托属性 `displayName` 引用 `Delegate` 对象来获取其属性访问器。

你委托到的每个对象**必须**有一个 `getValue()` 运算符函数，Kotlin 使用它来检索委托属性的值。如果属性是可变的，它还必须有一个 `setValue()` 运算符函数，供 Kotlin 设置其值。

默认情况下，`getValue()` 和 `setValue()` 函数具有以下结构：

```kotlin
operator fun getValue(thisRef: Any?, property: KProperty<*>): String {}

operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {}
```
{validate="false"}

在这些函数中：

*   `operator` 关键字将这些函数标记为运算符函数，使它们能够重载 `get()` 和 `set()` 函数。
*   `thisRef` 参数指代**包含**委托属性的对象。默认情况下，其类型设置为 `Any?`，但你可能需要声明一个更具体的类型。
*   `property` 参数指代其值被访问或更改的属性。你可以使用此参数访问属性的名称或类型等信息。默认情况下，其类型设置为 `Any?`。你无需担心在代码中更改此项。

`getValue()` 函数默认返回类型为 `String`，但你可以根据需要进行调整。

`setValue()` 函数有一个额外的参数 `value`，用于保存分配给属性的新值。

那么，这在实践中是如何体现的呢？假设你想要一个计算属性，比如用户的显示名称，该属性只计算一次，因为该操作开销很大，而且你的应用程序对性能敏感。你可以使用委托属性来缓存显示名称，这样它只计算一次，但可以随时访问而不会影响性能。

首先，你需要创建委托到的对象。在本例中，该对象将是 `CachedStringDelegate` 类的一个实例：

```kotlin
class CachedStringDelegate {
    var cachedValue: String? = null
}
```

`cachedValue` 属性包含缓存值。在 `CachedStringDelegate` 类中，将你希望委托属性的 `get()` 函数实现的逻辑添加到 `getValue()` 运算符函数体中：

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

`getValue()` 函数检查 `cachedValue` 属性是否为 `null`。如果是，函数将赋值为 `"Default value"` 并打印一条用于日志记录的字符串。如果 `cachedValue` 属性已经计算过，则该属性不为 `null`。在这种情况下，会打印另一条用于日志记录的字符串。最后，该函数使用 Elvis 运算符返回缓存值，如果值为 `null` 则返回 `"Unknown"`。

现在你可以将要缓存的属性 (`val displayName`) 委托给 `CachedStringDelegate` 类的一个实例：

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

    // First access computes and caches the value
    println(user.displayName)
    // Computed and cached: John Doe
    // John Doe

    // Subsequent accesses retrieve the value from cache
    println(user.displayName)
    // Accessed from cache: John Doe
    // John Doe
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-delegated"}

此示例：

*   创建一个 `User` 类，该类在头部有 `firstName` 和 `lastName` 两个属性，在类体中有一个 `displayName` 属性。
*   将 `displayName` 属性委托给 `CachedStringDelegate` 类的一个实例。
*   创建一个 `User` 类的实例，名为 `user`。
*   打印访问 `user` 实例上 `displayName` 属性的结果。

请注意，在 `getValue()` 函数中，`thisRef` 参数的类型从 `Any?` 类型收窄为对象类型：`User`。这样做是为了编译器能够访问 `User` 类的 `firstName` 和 `lastName` 属性。

### 标准委托

Kotlin 标准库为你提供了一些有用的委托，这样你就不必总是从头开始创建自己的委托。如果你使用这些委托之一，你无需定义 `getValue()` 和 `setValue()` 函数，因为标准库会自动提供它们。

#### 惰性属性

要仅在首次访问时初始化属性，请使用惰性属性。标准库提供了用于委托的 `Lazy` 接口。

要创建 `Lazy` 接口的实例，请使用 `lazy()` 函数，并向其提供一个 lambda 表达式，该表达式在首次调用 `get()` 函数时执行。`get()` 函数的任何后续调用都将返回与首次调用时提供的相同结果。惰性属性使用[尾随 lambda](kotlin-tour-functions.md#trailing-lambdas) 语法来传递 lambda 表达式。

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
    // First time accessing databaseConnection
    fetchData()
    // Connecting to the database...
    // Data: [Data1, Data2, Data3]

    // Subsequent access uses the existing connection
    fetchData()
    // Data: [Data1, Data2, Data3]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-lazy"}

在此示例中：

*   有一个 `Database` 类，包含 `connect()` 和 `query()` 成员函数。
*   `connect()` 函数向控制台打印一个字符串，`query()` 函数接受一个 SQL 查询并返回一个列表。
*   有一个 `databaseConnection` 属性，它是一个惰性属性。
*   提供给 `lazy()` 函数的 lambda 表达式：
    *   创建 `Database` 类的一个实例。
    *   在此实例 (`db`) 上调用 `connect()` 成员函数。
    *   返回该实例。
*   有一个 `fetchData()` 函数，它：
    *   通过在 `databaseConnection` 属性上调用 `query()` 函数来创建一个 SQL 查询。
    *   将 SQL 查询赋值给 `data` 变量。
    *   将 `data` 变量打印到控制台。
*   `main()` 函数调用 `fetchData()` 函数。第一次调用时，惰性属性被初始化。第二次调用时，返回与第一次调用相同的结果。

惰性属性不仅在初始化资源密集型时有用，而且在属性可能未在代码中使用时也很有用。此外，惰性属性默认是线程安全的，这在并发环境中工作时尤其有利。

有关更多信息，请参阅[惰性属性](delegated-properties.md#lazy-properties)。

#### 可观察属性

要监控属性的值是否发生变化，请使用可观察属性。当你希望检测属性值的变化并利用此信息触发反应时，可观察属性会很有用。标准库提供了 `Delegates` 对象用于委托。

要创建可观察属性，你必须首先导入 `kotlin.properties.Delegates.observable`。然后，使用 `observable()` 函数，并向其提供一个 lambda 表达式，该表达式在属性更改时执行。就像惰性属性一样，可观察属性使用[尾随 lambda](kotlin-tour-functions.md#trailing-lambdas) 语法来传递 lambda 表达式。

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
    // Temperature updated: 20.0°C -> 22.5°C

    thermostat.temperature = 27.0
    // Warning: Temperature is too high! (22.5°C -> 27.0°C)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-observable"}

在此示例中：

*   有一个 `Thermostat` 类，其中包含一个可观察属性：`temperature`。
*   `observable()` 函数接受 `20.0` 作为参数，并用它来初始化属性。
*   提供给 `observable()` 函数的 lambda 表达式：
    *   `_`，指代属性本身。
    *   `old`，即属性的旧值。
    *   `new`，即属性的新值。
    *   检查 `new` 参数是否大于 `25`，并根据结果向控制台打印一个字符串。
*   `main()` 函数：
    *   创建一个 `Thermostat` 类的实例，名为 `thermostat`。
    *   将实例的 `temperature` 属性的值更新为 `22.5`，这将触发一个带有温度更新的打印语句。
    *   将实例的 `temperature` 属性的值更新为 `27.0`，这将触发一个带有警告的打印语句。

可观察属性不仅可用于日志记录和调试目的。你还可以将它们用于更新 UI 或执行额外检查（例如验证数据有效性）等用例。

有关更多信息，请参阅[可观察属性](delegated-properties.md#observable-properties)。

## 练习

### 练习 1 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-1"}

你管理着一个书店的库存系统。库存存储在一个列表中，其中每个条目表示特定书籍的数量。例如，`listOf(3, 0, 7, 12)` 表示商店有第一本书 3 本，第二本书 0 本，第三本书 7 本，第四本书 12 本。

编写一个名为 `findOutOfStockBooks()` 的函数，该函数返回所有缺货书籍的索引列表。

<deflist collapsible="true">
    <def title="提示 1">
        使用标准库中的 <a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/indices.html"><code>indices</code></a> 扩展属性。
    </def>
</deflist>

<deflist collapsible="true">
    <def title="提示 2">
        你可以使用 <a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/build-list.html"><code>buildList()</code></a> 函数来创建和管理列表，而不是手动创建和返回一个可变列表。`buildList()` 函数使用带接收者的 lambda，你已在之前的章节中学习过它。
    </def>
</deflist>

|--|--|

```kotlin
fun findOutOfStockBooks(inventory: List<Int>): List<Int> {
    // Write your code here
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

你有一个旅行应用，需要以公里和英里两种单位显示距离。为 `Double` 类型创建一个名为 `asMiles` 的扩展属性，用于将公里距离转换为英里：

> 将公里转换为英里的公式是：`英里 = 公里 * 0.621371`。
>
{style="note"}

<deflist collapsible="true">
    <def title="提示">
        请记住，扩展属性需要一个自定义的 <code>get()</code> 函数。
    </def>
</deflist>

|---|---|

```kotlin
val // Write your code here

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

你有一个系统健康检查器，可以确定云系统的状态。然而，它运行的两个执行健康检查的函数是性能密集型的。使用惰性属性来初始化这些检查，以便只在需要时才运行这些开销大的函数：

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
    // Write your code here

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

### 练习 4 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-4"}

你正在构建一个简单的预算跟踪应用。该应用需要观察用户剩余预算的变化，并在预算低于某个阈值时通知用户。你有一个 `Budget` 类，它通过一个 `totalBudget` 属性初始化，该属性包含初始预算金额。在该类中，创建一个名为 `remainingBudget` 的可观察属性，它会打印：

*   当值低于初始预算的 20% 时发出警告。
*   当预算从先前的值增加时显示一条鼓励信息。

|---|---|

```kotlin
import kotlin.properties.Delegates.observable

class Budget(val totalBudget: Int) {
    var remainingBudget: Int // Write your code here
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

[中级：空安全](kotlin-tour-intermediate-null-safety.md)