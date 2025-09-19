[//]: # (title: 中级: 空安全)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">扩展函数</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函数</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">带接收者的 lambda 表达式</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">类和接口</a><br />
        <img src="icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">对象</a><br />
        <img src="icon-6-done.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">开放类和特殊类</a><br />
        <img src="icon-7-done.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">属性</a><br />
        <img src="icon-8.svg" width="20" alt="Eighth step" /> <strong>空安全</strong><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">库和 API</a></p>
</tldr>

在入门教程中，你学习了如何在代码中处理 `null` 值。本章涵盖了空安全特性的常见用例，以及如何充分利用它们。

## 智能类型转换和安全类型转换

Kotlin 有时无需显式声明即可推断类型。当你告诉 Kotlin 将某个变量或对象视为属于特定类型时，这个过程称为**类型转换**。当类型自动转换时，例如在推断时，这称为**智能类型转换**。

### `is` 和 `!is` 操作符

在探索类型转换如何工作之前，让我们看看如何检测对象是否具有某种类型。为此，你可以将 `is` 和 `!is` 操作符与 `when` 或 `if` 条件表达式一起使用：

*   `is` 检测对象是否具有该类型并返回布尔值。
*   `!is` 检测对象**是否不具有**该类型并返回布尔值。

例如：

```kotlin
fun printObjectType(obj: Any) {
    when (obj) {
        is Int -> println("It's an Integer with value $obj")
        !is Double -> println("It's NOT a Double")
        else -> println("Unknown type")
    }
}

fun main() {
    val myInt = 42
    val myDouble = 3.14
    val myList = listOf(1, 2, 3)
  
    // The type is Int
    printObjectType(myInt)
    // It's an Integer with value 42

    // The type is List, so it's NOT a Double.
    printObjectType(myList)
    // It's NOT a Double

    // The type is Double, so the else branch is triggered.
    printObjectType(myDouble)
    // Unknown type
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-casts"}

> 你已经在[开放类和特殊类](kotlin-tour-intermediate-open-special-classes.md#sealed-classes)章节中看到了如何将 `when` 条件表达式与 `is` 和 `!is` 操作符一起使用的示例。
> 
{style="tip"}

### `as` 和 `as?` 操作符

要将对象显式地_类型转换_为任何其他类型，请使用 `as` 操作符。这包括从可空类型转换为其非空对应类型。如果无法进行类型转换，程序将在**运行时**崩溃。这就是为什么它被称为**不安全**类型转换操作符。

```kotlin
fun main() {
//sampleStart
    val a: String? = null
    val b = a as String

    // Triggers an error at runtime
    print(b)
//sampleEnd
}
```
{kotlin-runnable="true" validate="false" id="kotlin-tour-null-safety-as-operator"}

要将对象显式地类型转换为非空类型，但在失败时返回 `null` 而不是抛出错误，请使用 `as?` 操作符。由于 `as?` 操作符在失败时不会触发错误，因此它被称为**安全**操作符。

```kotlin
fun main() {
//sampleStart
    val a: String? = null
    val b = a as? String

    // Returns null value
    print(b)
    // null
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-safe-operator"}

你可以将 `as?` 操作符与 Elvis 操作符 `?:` 结合使用，将多行代码精简为一行。例如，以下 `calculateTotalStringLength()` 函数计算混合 `list` 中提供的所有 `String` 的总长度：

```kotlin
fun calculateTotalStringLength(items: List<Any>): Int {
    var totalLength = 0

    for (item in items) {
        totalLength += if (item is String) {
            item.length
        } else {
            0  // Add 0 for non-String items
        }
    }

    return totalLength
}
```

该示例：

*   使用 `totalLength` 变量作为计数器。
*   使用 `for` 循环遍历 `list` 中的每个项。
*   使用 `if` 和 `is` 操作符检测当前项是否为 `String`：
    *   如果是，则将 `String` 的长度添加到计数器中。
    *   如果不是，则计数器不递增。
*   返回 `totalLength` 变量的最终值。

此代码可以精简为：

```kotlin
fun calculateTotalStringLength(items: List<Any>): Int {
    return items.sumOf { (it as? String)?.length ?: 0 }
}
```

该示例使用 [`sumOf()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/sum-of.html) 扩展函数并提供了一个 lambda 表达式，该表达式：

*   对于 `list` 中的每个项，使用 `as?` 执行安全类型转换以转换为 `String`。
*   如果调用不返回 `null` 值，则使用安全调用 `?.` 访问 `length` 属性。
*   如果安全调用返回 `null` 值，则使用 Elvis 操作符 `?:` 返回 `0`。

## `null` 值和集合

在 Kotlin 中，使用集合通常涉及处理 `null` 值和过滤掉不必要的元素。Kotlin 提供了有用的函数，你可以使用它们在处理 `list`、`set`、`map` 和其他类型的集合时编写整洁、高效且空安全的代码。

要从 `list` 中过滤 `null` 值，请使用 [`filterNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter-not-null.html) 函数：

```kotlin
fun main() {
//sampleStart
    val emails: List<String?> = listOf("alice@example.com", null, "bob@example.com", null, "carol@example.com")

    val validEmails = emails.filterNotNull()

    println(validEmails)
    // [alice@example.com, bob@example.com, carol@example.com]
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-filternotnull"}

如果你想在创建 `list` 时直接过滤 `null` 值，请使用 [`listOfNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/list-of-not-null.html) 函数：

```kotlin
fun main() {
//sampleStart
    val serverConfig = mapOf(
        "appConfig.json" to "App Configuration",
        "dbConfig.json" to "Database Configuration"
    )

    val requestedFile = "appConfig.json"
    val configFiles = listOfNotNull(serverConfig[requestedFile])

    println(configFiles)
    // [App Configuration]
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-listofnotnull"}

在这两个示例中，如果所有项都是 `null` 值，则返回一个空 `list`。

Kotlin 还提供了可用于在集合中查找值的函数。如果未找到值，它们会返回 `null` 值而不是触发错误：

*   [`maxOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/max-or-null.html) 查找最高值。如果不存在，则返回 `null` 值。
*   [`minOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/min-or-null.html) 查找最低值。如果不存在，则返回 `null` 值。

例如：

```kotlin
fun main() {
//sampleStart
    // Temperatures recorded over a week
    val temperatures = listOf(15, 18, 21, 21, 19, 17, 16)
  
    // Find the highest temperature of the week
    val maxTemperature = temperatures.maxOrNull()
    println("Highest temperature recorded: ${maxTemperature ?: "No data"}")
    // Highest temperature recorded: 21

    // Find the lowest temperature of the week
    val minTemperature = temperatures.minOrNull()
    println("Lowest temperature recorded: ${minTemperature ?: "No data"}")
    // Lowest temperature recorded: 15
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-collections"}

此示例使用 Elvis 操作符 `?:`，如果函数返回 `null` 值，则返回打印的语句。

> `maxOrNull()` 和 `minOrNull()` 函数设计用于**不**包含 `null` 值的集合。否则，你无法判断函数是未找到所需值还是找到了 `null` 值。
>
{style="note"}

你可以将 [`singleOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/single-or-null.html) 函数与 lambda 表达式一起使用，以查找符合条件的单个项。如果不存在此类项或存在多个匹配项，则该函数返回 `null` 值：

```kotlin
fun main() {
//sampleStart
    // Temperatures recorded over a week
    val temperatures = listOf(15, 18, 21, 21, 19, 17, 16)

    // Check if there was exactly one day with 30 degrees
    val singleHotDay = temperatures.singleOrNull{ it == 30 }
    println("Single hot day with 30 degrees: ${singleHotDay ?: "None"}")
    // Single hot day with 30 degrees: None
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-singleornull"}

> `singleOrNull()` 函数设计用于**不**包含 `null` 值的集合。
>
{style="note"}

有些函数使用 lambda 表达式来转换集合，如果它们无法实现其目的，则返回 `null` 值。

要使用 lambda 表达式转换集合并返回第一个非 `null` 值，请使用 [`firstNotNullOfOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/first-not-null-of-or-null.html) 函数。如果不存在此类值，则该函数返回 `null` 值：

```kotlin
fun main() {
//sampleStart
    data class User(val name: String?, val age: Int?)

    val users = listOf(
        User(null, 25),
        User("Alice", null),
        User("Bob", 30)
    )

    val firstNonNullName = users.firstNotNullOfOrNull { it.name }
    println(firstNonNullName)
    // Alice
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-firstnotnullofornull"}

要使用 lambda 表达式按顺序处理每个集合项并创建累加值（如果集合为空，则返回 `null` 值），请使用 [`reduceOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/reduce-or-null.html) 函数：

```kotlin
fun main() {
//sampleStart
    // Prices of items in a shopping cart
    val itemPrices = listOf(20, 35, 15, 40, 10)

    // Calculate the total price using the reduceOrNull() function
    val totalPrice = itemPrices.reduceOrNull { runningTotal, price -> runningTotal + price }
    println("Total price of items in the cart: ${totalPrice ?: "No items"}")
    // Total price of items in the cart: 120

    val emptyCart = listOf<Int>()
    val emptyTotalPrice = emptyCart.reduceOrNull { runningTotal, price -> runningTotal + price }
    println("Total price of items in the empty cart: ${emptyTotalPrice ?: "No items"}")
    // Total price of items in the empty cart: No items
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-reduceornull"}

此示例也使用 Elvis 操作符 `?:`，如果函数返回 `null` 值，则返回打印的语句。

> `reduceOrNull()` 函数设计用于**不**包含 `null` 值的集合。
>
{style="note"}

探索 Kotlin 的[标准库](https://kotlinlang.org/api/core/kotlin-stdlib/)以查找更多可以使你的代码更安全的函数。

## 提前返回和 Elvis 操作符

在入门教程中，你学习了如何使用[提前返回](kotlin-tour-functions.md#early-returns-in-functions)来阻止函数在某个点之后继续处理。你可以将 Elvis 操作符 `?:` 与提前返回一起使用，以检测函数中的前置条件。这种方法是保持代码简洁的好方法，因为你不需要使用嵌套检测。代码复杂性的降低也使其更易于维护。例如：

```kotlin
data class User(
    val id: Int,
    val name: String,
    // List of friend user IDs
    val friends: List<Int>
)

// Function to get the number of friends for a user
fun getNumberOfFriends(users: Map<Int, User>, userId: Int): Int {
    // Retrieves the user or return -1 if not found
    val user = users[userId] ?: return -1
    // Returns the number of friends
    return user.friends.size
}

fun main() {
    // Creates some sample users
    val user1 = User(1, "Alice", listOf(2, 3))
    val user2 = User(2, "Bob", listOf(1))
    val user3 = User(3, "Charlie", listOf(1))

    // Creates a map of users
    val users = mapOf(1 to user1, 2 to user2, 3 to user3)

    println(getNumberOfFriends(users, 1))
    // 2
    println(getNumberOfFriends(users, 2))
    // 1
    println(getNumberOfFriends(users, 4))
    // -1
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-early-return"}

在此示例中：

*   有一个 `User` 数据类，它具有用户的 `id`、`name` 和朋友 `list` 的属性。
*   `getNumberOfFriends()` 函数：
    *   接受 `User` 实例的 `map` 和整数类型的用户 ID。
    *   使用提供的用户 ID 访问 `User` 实例的 `map` 的值。
    *   如果 `map` 值为 `null` 值，则使用 Elvis 操作符提前返回函数，并返回 `-1`。
    *   将从 `map` 中找到的值赋值给 `user` 变量。
    *   通过使用 `size` 属性返回用户朋友 `list` 中的朋友数量。
*   `main()` 函数：
    *   创建三个 `User` 实例。
    *   创建这些 `User` 实例的 `map` 并将其赋值给 `users` 变量。
    *   使用值 `1` 和 `2` 在 `users` 变量上调用 `getNumberOfFriends()` 函数，该函数为 "Alice" 返回两个朋友，为 "Bob" 返回一个朋友。
    *   使用值 `4` 在 `users` 变量上调用 `getNumberOfFriends()` 函数，这会触发提前返回并返回 `-1`。

你可能会注意到，如果没有提前返回，代码可以更简洁。然而，这种方法需要多次安全调用，因为 `users[userId]` 可能会返回 `null` 值，这使得代码略微难以阅读：

```kotlin
fun getNumberOfFriends(users: Map<Int, User>, userId: Int): Int {
    // Retrieve the user or return -1 if not found
    return users[userId]?.friends?.size ?: -1
}
```
{validate="false"}

尽管此示例仅使用 Elvis 操作符检测一个条件，但你可以添加多个检测来覆盖任何关键错误路径。使用 Elvis 操作符的提前返回可防止程序执行不必要的工作，并在检测到 `null` 值或无效情况时立即停止，从而使代码更安全。

有关如何在代码中使用 `return` 的更多信息，参见[返回与跳转](returns.md)。

## 练习

### 练习 1 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-1"}

你正在开发一个应用程序的通知系统，用户可以在其中启用或禁用不同类型的通知。请完成 `getNotificationPreferences()` 函数，使其：

1.  `validUser` 变量使用 `as?` 操作符检测 `user` 是否为 `User` 类的实例。如果不是，则返回一个空 `list`。
2.  `userName` 变量使用 Elvis `?:` 操作符，确保如果用户名为 `null`，则默认为 `"Guest"`。
3.  最终的 return 语句使用 `.takeIf()` 函数，仅在启用电子邮件和短信通知偏好时才包含它们。
4.  `main()` 函数成功运行并打印预期输出。

> [`takeIf()` 函数](scope-functions.md#takeif-and-takeunless)在给定条件为 `true` 时返回原始值，否则返回 `null`。例如：
>
> ```kotlin
> fun main() {
>     // The user is logged in
>     val userIsLoggedIn = true
>     // The user has an active session
>     val hasSession = true
> 
>     // Gives access to the dashboard if the user is logged in
>     // and has an active session
>     val canAccessDashboard = userIsLoggedIn.takeIf { hasSession }
> 
>     println(canAccessDashboard ?: "Access denied")
>     // true
> }
> ```
>
{style = "tip"}

|--|--|

```kotlin
data class User(val name: String?)

fun getNotificationPreferences(user: Any, emailEnabled: Boolean, smsEnabled: Boolean): List<String> {
    val validUser = // Write your code here
    val userName = // Write your code here

    return listOfNotNull( /* Write your code here */)
}

fun main() {
    val user1 = User("Alice")
    val user2 = User(null)
    val invalidUser = "NotAUser"

    println(getNotificationPreferences(user1, emailEnabled = true, smsEnabled = false))
    // [Email Notifications enabled for Alice]
    println(getNotificationPreferences(user2, emailEnabled = false, smsEnabled = true))
    // [SMS Notifications enabled for Guest]
    println(getNotificationPreferences(invalidUser, emailEnabled = true, smsEnabled = true))
    // []
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-null-safety-exercise-1"}

|--|--|

```kotlin
data class User(val name: String?)

fun getNotificationPreferences(user: Any, emailEnabled: Boolean, smsEnabled: Boolean): List<String> {
    val validUser = user as? User ?: return emptyList()
    val userName = validUser.name ?: "Guest"

    return listOfNotNull(
        "Email Notifications enabled for $userName".takeIf { emailEnabled },
        "SMS Notifications enabled for $userName".takeIf { smsEnabled }
    )
}

fun main() {
    val user1 = User("Alice")
    val user2 = User(null)
    val invalidUser = "NotAUser"

    println(getNotificationPreferences(user1, emailEnabled = true, smsEnabled = false))
    // [Email Notifications enabled for Alice]
    println(getNotificationPreferences(user2, emailEnabled = false, smsEnabled = true))
    // [SMS Notifications enabled for Guest]
    println(getNotificationPreferences(invalidUser, emailEnabled = true, smsEnabled = true))
    // []
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-null-safety-solution-1"}

### 练习 2 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-2"}

你正在开发一个基于订阅的流媒体服务，用户可以拥有多个订阅，但**一次只能有一个活跃订阅**。请完成 `getActiveSubscription()` 函数，使其使用带有谓词的 `singleOrNull()` 函数，如果存在多个活跃订阅，则返回 `null` 值：

|--|--|

```kotlin
data class Subscription(val name: String, val isActive: Boolean)

fun getActiveSubscription(subscriptions: List<Subscription>): Subscription? // Write your code here

fun main() {
    val userWithPremiumPlan = listOf(
        Subscription("Basic Plan", false),
        Subscription("Premium Plan", true)
    )

    val userWithConflictingPlans = listOf(
        Subscription("Basic Plan", true),
        Subscription("Premium Plan", true)
    )

    println(getActiveSubscription(userWithPremiumPlan))
    // Subscription(name=Premium Plan, isActive=true)

    println(getActiveSubscription(userWithConflictingPlans))
    // null
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-null-safety-exercise-2"}

|--|--|

```kotlin
data class Subscription(val name: String, val isActive: Boolean)

fun getActiveSubscription(subscriptions: List<Subscription>): Subscription? {
    return subscriptions.singleOrNull { subscription -> subscription.isActive }
}

fun main() {
    val userWithPremiumPlan = listOf(
        Subscription("Basic Plan", false),
        Subscription("Premium Plan", true)
    )

    val userWithConflictingPlans = listOf(
        Subscription("Basic Plan", true),
        Subscription("Premium Plan", true)
    )

    println(getActiveSubscription(userWithPremiumPlan))
    // Subscription(name=Premium Plan, isActive=true)

    println(getActiveSubscription(userWithConflictingPlans))
    // null
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案 1" id="kotlin-tour-null-safety-solution-2-1"}

|--|--|

```kotlin
data class Subscription(val name: String, val isActive: Boolean)

fun getActiveSubscription(subscriptions: List<Subscription>): Subscription? =
    subscriptions.singleOrNull { it.isActive }

fun main() {
    val userWithPremiumPlan = listOf(
        Subscription("Basic Plan", false),
        Subscription("Premium Plan", true)
    )

    val userWithConflictingPlans = listOf(
        Subscription("Basic Plan", true),
        Subscription("Premium Plan", true)
    )

    println(getActiveSubscription(userWithPremiumPlan))
    // Subscription(name=Premium Plan, isActive=true)

    println(getActiveSubscription(userWithConflictingPlans))
    // null
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案 2" id="kotlin-tour-null-safety-solution-2-2"}

### 练习 3 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-3"}

你正在开发一个社交媒体平台，其中用户具有用户名和账户状态。你希望查看当前活跃用户名的 `list`。请完成 `getActiveUsernames()` 函数，使其 `mapNotNull()` 函数具有一个谓词，如果用户活跃则返回用户名，否则返回 `null` 值：

|--|--|

```kotlin
data class User(val username: String, val isActive: Boolean)

fun getActiveUsernames(users: List<User>): List<String> {
    return users.mapNotNull { /* Write your code here */ }
}

fun main() {
    val allUsers = listOf(
        User("alice123", true),
        User("bob_the_builder", false),
        User("charlie99", true)
    )

    println(getActiveUsernames(allUsers))
    // [alice123, charlie99]
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-null-safety-exercise-3"}

|--|--|

> 就像在练习 1 中一样，你可以在检测用户是否活跃时使用 [`takeIf()` 函数](scope-functions.md#takeif-and-takeunless)。
>
{ style = "tip" }

|--|--|

```kotlin
data class User(val username: String, val isActive: Boolean)

fun getActiveUsernames(users: List<User>): List<String> {
    return users.mapNotNull { user ->
        if (user.isActive) user.username else null
    }
}

fun main() {
    val allUsers = listOf(
        User("alice123", true),
        User("bob_the_builder", false),
        User("charlie99", true)
    )

    println(getActiveUsernames(allUsers))
    // [alice123, charlie99]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案 1" id="kotlin-tour-null-safety-solution-3-1"}

|--|--|

```kotlin
data class User(val username: String, val isActive: Boolean)

fun getActiveUsernames(users: List<User>): List<String> = users.mapNotNull { user -> user.username.takeIf { user.isActive } }

fun main() {
    val allUsers = listOf(
        User("alice123", true),
        User("bob_the_builder", false),
        User("charlie99", true)
    )

    println(getActiveUsernames(allUsers))
    // [alice123, charlie99]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案 2" id="kotlin-tour-null-safety-solution-3-2"}

### 练习 4 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-4"}

你正在开发一个电子商务平台的库存管理系统。在处理销售之前，你需要根据可用库存检测请求的产品数量是否有效。

请完成 `validateStock()` 函数，使其使用提前返回和 Elvis 操作符（在适用情况下）检测以下情况：

*   `requested` 变量为 `null`。
*   `available` 变量为 `null`。
*   `requested` 变量为负值。
*   `requested` 变量中的数量高于 `available` 变量中的数量。

在上述所有情况下，函数必须提前返回 `-1`。

|--|--|

```kotlin
fun validateStock(requested: Int?, available: Int?): Int {
    // Write your code here
}

fun main() {
    println(validateStock(5,10))
    // 5
    println(validateStock(null,10))
    // -1
    println(validateStock(-2,10))
    // -1
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-null-safety-exercise-4"}

|--|--|

```kotlin
fun validateStock(requested: Int?, available: Int?): Int {
    val validRequested = requested ?: return -1
    val validAvailable = available ?: return -1

    if (validRequested < 0) return -1
    if (validRequested > validAvailable) return -1

    return validRequested
}

fun main() {
    println(validateStock(5,10))
    // 5
    println(validateStock(null,10))
    // -1
    println(validateStock(-2,10))
    // -1
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-null-safety-solution-4"}

## 下一步

[中级: 库和 API](kotlin-tour-intermediate-libraries-and-apis.md)