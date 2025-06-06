[//]: # (title: 中级：作用域函数)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">扩展函数</a><br />
        <img src="icon-2.svg" width="20" alt="Second step" /> <strong>作用域函数</strong><br />
        <img src="icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">带接收者的 Lambda 表达式</a><br />
        <img src="icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">类和接口</a><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">对象</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">`open` 类和特殊类</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">属性</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">空安全</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">库和 API</a></p>
</tldr>

在本章中，你将在对扩展函数理解的基础上，学习如何使用作用域函数来编写更惯用的代码。

## 作用域函数

在编程中，作用域 (scope) 是指你的变量或对象可被识别的区域。最常提及的作用域是全局作用域和局部作用域：

*   **全局作用域** – 程序中任何地方都可以访问的变量或对象。
*   **局部作用域** – 只能在其定义所在的块或函数内访问的变量或对象。

在 Kotlin 中，还有作用域函数 (scope functions)，它们允许你围绕一个对象创建临时作用域并执行一些代码。

作用域函数让你的代码更简洁，因为在临时作用域内你无需引用对象的名称。根据作用域函数的不同，你可以通过关键字 `this` 引用对象，或通过关键字 `it` 将其作为参数使用。

Kotlin 总共有五个作用域函数：`let`、`apply`、`run`、`also` 和 `with`。

每个作用域函数都接受一个 lambda 表达式，并返回对象或 lambda 表达式的结果。在本教程中，我们将解释每个作用域函数及其用法。

> 你还可以观看 Kotlin 开发者布道师 Sebastian Aigner 关于作用域函数的讲座：[回到 Stdlib：充分利用 Kotlin 标准库](https://youtu.be/DdvgvSHrN9g?feature=shared&t=1511)。
> 
{style="tip"}

### Let

当你希望在代码中执行空检查，并随后对返回的对象执行进一步操作时，请使用 `let` 作用域函数。

考虑以下示例：

```kotlin
fun sendNotification(recipientAddress: String): String {
    println("Yo $recipientAddress!")
    return "Notification sent!"
}

fun getNextAddress(): String {
    return "sebastian@jetbrains.com"
}

fun main() {
    val address: String? = getNextAddress()
    sendNotification(address)
}
```
{validate = "false"}

该示例包含两个函数：
*   `sendNotification()`，它有一个函数参数 `recipientAddress` 并返回一个字符串。
*   `getNextAddress()`，它没有函数参数并返回一个字符串。

该示例创建了一个可空 `String` 类型的变量 `address`。但是，当你调用 `sendNotification()` 函数时，这会成为一个问题，因为该函数不期望 `address` 为 `null` 值。编译器因此报告一个错误：

```text
Type mismatch: inferred type is String? but String was expected
```

在初学者教程中，你已经知道可以通过 `if` 条件或 [Elvis 运算符 `?:`](kotlin-tour-null-safety.md#use-elvis-operator) 执行空检查。但是，如果你想在代码后面使用返回的对象怎么办？你可以通过一个 `if` 条件**和**一个 `else` 分支来实现这一点：

```kotlin
fun sendNotification(recipientAddress: String): String {
    println("Yo $recipientAddress!")
    return "Notification sent!"
}

fun getNextAddress(): String {
    return "sebastian@jetbrains.com"
}

fun main() { 
    //sampleStart
    val address: String? = getNextAddress()
    val confirm = if(address != null) {
        sendNotification(address)
    } else { null }
    //sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-let-non-null-if"}

然而，更简洁的方法是使用 `let` 作用域函数：

```kotlin
fun sendNotification(recipientAddress: String): String {
    println("Yo $recipientAddress!")
    return "Notification sent!"
}

fun getNextAddress(): String {
    return "sebastian@jetbrains.com"
}

fun main() {
    //sampleStart
    val address: String? = getNextAddress()
    val confirm = address?.let {
        sendNotification(it)
    }
    //sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-let-non-null"}

该示例：
*   创建了一个名为 `confirm` 的变量。
*   对 `address` 变量使用了 `let` 作用域函数的安全调用。
*   在 `let` 作用域函数内创建了一个临时作用域。
*   将 `sendNotification()` 函数作为 lambda 表达式传递给 `let` 作用域函数。
*   通过 `it` 引用 `address` 变量，使用临时作用域。
*   将结果赋值给 `confirm` 变量。

通过这种方法，你的代码可以处理 `address` 变量可能为 `null` 值的情况，并且你可以在代码后面使用 `confirm` 变量。

### Apply

使用 `apply` 作用域函数在创建时而非后续代码中初始化对象，例如类实例。这种方法使你的代码更易于阅读和管理。

考虑以下示例：

```kotlin
class Client() {
    var token: String? = null
    fun connect() = println("connected!")
    fun authenticate() = println("authenticated!")
    fun getData(): String = "Mock data"
}

val client = Client()

fun main() {
    client.token = "asdf"
    client.connect()
    // connected!
    client.authenticate()
    // authenticated!
    client.getData()
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-apply-before"}

该示例有一个 `Client` 类，它包含一个名为 `token` 的属性和三个成员函数：`connect()`、`authenticate()` 和 `getData()`。

该示例在 `main()` 函数中创建了 `Client` 类的实例 `client`，然后初始化其 `token` 属性并调用其成员函数。

尽管这个示例很简洁，但在实际开发中，你可能需要等待一段时间才能在创建类实例（及其成员函数）之后对其进行配置和使用。然而，如果你使用 `apply` 作用域函数，你可以在代码中的同一位置创建、配置和使用类实例上的成员函数：

```kotlin
class Client() {
  var token: String? = null
  fun connect() = println("connected!")
  fun authenticate() = println("authenticated!")
  fun getData(): String = "Mock data"
}
//sampleStart
val client = Client().apply {
  token = "asdf"
  connect()
  authenticate()
}

fun main() {
  client.getData()
  // connected!
  // authenticated!
}
//sampleEnd
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-apply-after"}

该示例：

*   创建了 `Client` 类的实例 `client`。
*   对 `client` 实例使用了 `apply` 作用域函数。
*   在 `apply` 作用域函数内创建了一个临时作用域，这样在访问 `client` 实例的属性或函数时，你无需显式引用它。
*   将一个 lambda 表达式传递给 `apply` 作用域函数，该表达式更新 `token` 属性并调用 `connect()` 和 `authenticate()` 函数。
*   在 `main()` 函数中对 `client` 实例调用了 `getData()` 成员函数。

如你所见，当你处理大量代码时，这种策略非常方便。

### Run

与 `apply` 类似，你可以使用 `run` 作用域函数来初始化一个对象，但更好的是，`run` 适用于在代码中的特定时刻初始化对象**并**立即计算结果。

让我们继续 `apply` 函数的先前示例，但这次，你希望 `connect()` 和 `authenticate()` 函数被分组，以便在每次请求时都调用它们。

例如：

```kotlin
class Client() {
    var token: String? = null
    fun connect() = println("connected!")
    fun authenticate() = println("authenticated!")
    fun getData(): String = "Mock data"
}

//sampleStart
val client: Client = Client().apply {
    token = "asdf"
}

fun main() {
    val result: String = client.run {
        connect()
        // connected!
        authenticate()
        // authenticated!
        getData()
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-run"}

该示例：

*   创建了 `Client` 类的实例 `client`。
*   对 `client` 实例使用了 `apply` 作用域函数。
*   在 `apply` 作用域函数内创建了一个临时作用域，这样在访问 `client` 实例的属性或函数时，你无需显式引用它。
*   将一个 lambda 表达式传递给 `apply` 作用域函数，该表达式更新 `token` 属性。

`main()` 函数：

*   创建了一个类型为 `String` 的 `result` 变量。
*   对 `client` 实例使用了 `run` 作用域函数。
*   在 `run` 作用域函数内创建了一个临时作用域，这样在访问 `client` 实例的属性或函数时，你无需显式引用它。
*   将一个 lambda 表达式传递给 `run` 作用域函数，该表达式调用 `connect()`、`authenticate()` 和 `getData()` 函数。
*   将结果赋值给 `result` 变量。

现在你可以在代码中进一步使用返回的结果。

### Also

使用 `also` 作用域函数对一个对象完成额外的操作，然后返回该对象以便在你的代码中继续使用它，例如写入日志。

考虑以下示例：

```kotlin
fun main() {
    val medals: List<String> = listOf("Gold", "Silver", "Bronze")
    val reversedLongUppercaseMedals: List<String> =
        medals
            .map { it.uppercase() }
            .filter { it.length > 4 }
            .reversed()
    println(reversedLongUppercaseMedals)
    // [BRONZE, SILVER]
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-also-before"}

该示例：

*   创建了包含字符串列表的 `medals` 变量。
*   创建了类型为 `List<String>` 的 `reversedLongUpperCaseMedals` 变量。
*   对 `medals` 变量使用了 `.map()` 扩展函数。
*   将一个 lambda 表达式传递给 `.map()` 函数，该表达式通过 `it` 关键字引用 `medals` 并对其调用 `.uppercase()` 扩展函数。
*   对 `medals` 变量使用了 `.filter()` 扩展函数。
*   将一个 lambda 表达式作为谓词传递给 `.filter()` 函数，该表达式通过 `it` 关键字引用 `medals` 并检查 `medals` 变量中包含的列表长度是否大于 4 项。
*   对 `medals` 变量使用了 `.reversed()` 扩展函数。
*   将结果赋值给 `reversedLongUpperCaseMedals` 变量。
*   打印 `reversedLongUpperCaseMedals` 变量中包含的列表。

在函数调用之间添加一些日志来查看 `medals` 变量发生了什么会很有用。`also` 函数对此有所帮助：

```kotlin
fun main() {
    val medals: List<String> = listOf("Gold", "Silver", "Bronze")
    val reversedLongUppercaseMedals: List<String> =
        medals
            .map { it.uppercase() }
            .also { println(it) }
            // [GOLD, SILVER, BRONZE]
            .filter { it.length > 4 }
            .also { println(it) }
            // [SILVER, BRONZE]
            .reversed()
    println(reversedLongUppercaseMedals)
    // [BRONZE, SILVER]
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-also-after"}

现在，该示例：

*   对 `medals` 变量使用了 `also` 作用域函数。
*   在 `also` 作用域函数内创建了一个临时作用域，这样在将其作为函数参数使用时，你无需显式引用 `medals` 变量。
*   将一个 lambda 表达式传递给 `also` 作用域函数，该表达式通过 `it` 关键字使用 `medals` 变量作为函数参数来调用 `println()` 函数。

由于 `also` 函数返回对象本身，它不仅对于日志记录有用，还适用于调试、链式调用多个操作，以及执行不影响代码主流程的其他副作用操作。

### With

与其他作用域函数不同，`with` 不是扩展函数，因此语法有所不同。你将接收者对象作为参数传递给 `with`。

当你希望在一个对象上调用多个函数时，请使用 `with` 作用域函数。

考虑这个示例：

```kotlin
class Canvas {
    fun rect(x: Int, y: Int, w: Int, h: Int): Unit = println("$x, $y, $w, $h")
    fun circ(x: Int, y: Int, rad: Int): Unit = println("$x, $y, $rad")
    fun text(x: Int, y: Int, str: String): Unit = println("$x, $y, $str")
}

fun main() {
    val mainMonitorPrimaryBufferBackedCanvas = Canvas()

    mainMonitorPrimaryBufferBackedCanvas.text(10, 10, "Foo")
    mainMonitorPrimaryBufferBackedCanvas.rect(20, 30, 100, 50)
    mainMonitorPrimaryBufferBackedCanvas.circ(40, 60, 25)
    mainMonitorPrimaryBufferBackedCanvas.text(15, 45, "Hello")
    mainMonitorPrimaryBufferBackedCanvas.rect(70, 80, 150, 100)
    mainMonitorPrimaryBufferBackedCanvas.circ(90, 110, 40)
    mainMonitorPrimaryBufferBackedCanvas.text(35, 55, "World")
    mainMonitorPrimaryBufferBackedCanvas.rect(120, 140, 200, 75)
    mainMonitorPrimaryBufferBackedCanvas.circ(160, 180, 55)
    mainMonitorPrimaryBufferBackedCanvas.text(50, 70, "Kotlin")
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-with-before"}

该示例创建了一个 `Canvas` 类，它有三个成员函数：`rect()`、`circ()` 和 `text()`。每个成员函数都会根据你提供的函数参数打印一个语句。

该示例创建了 `Canvas` 类的实例 `mainMonitorPrimaryBufferBackedCanvas`，然后在此实例上调用了一系列带有不同函数参数的成员函数。

你会发现这段代码难以阅读。如果你使用 `with` 函数，代码会变得更简洁：

```kotlin
class Canvas {
    fun rect(x: Int, y: Int, w: Int, h: Int): Unit = println("$x, $y, $w, $h")
    fun circ(x: Int, y: Int, rad: Int): Unit = println("$x, $y, $rad")
    fun text(x: Int, y: Int, str: String): Unit = println("$x, $y, $str")
}

fun main() {
    //sampleStart
    val mainMonitorSecondaryBufferBackedCanvas = Canvas()
    with(mainMonitorSecondaryBufferBackedCanvas) {
        text(10, 10, "Foo")
        rect(20, 30, 100, 50)
        circ(40, 60, 25)
        text(15, 45, "Hello")
        rect(70, 80, 150, 100)
        circ(90, 110, 40)
        text(35, 55, "World")
        rect(120, 140, 200, 75)
        circ(160, 180, 55)
        text(50, 70, "Kotlin")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-with-after"}

该示例：
*   使用了 `with` 作用域函数，并将 `mainMonitorSecondaryBufferBackedCanvas` 实例作为接收者对象。
*   在 `with` 作用域函数内创建了一个临时作用域，这样在调用 `mainMonitorSecondaryBufferBackedCanvas` 实例的成员函数时，你无需显式引用它。
*   将一个 lambda 表达式传递给 `with` 作用域函数，该表达式调用一系列带有不同函数参数的成员函数。

现在这段代码更易于阅读，你犯错的可能性也更小了。

## 用例概述

本节介绍了 Kotlin 中可用的各种作用域函数及其主要用例，以帮助你编写更惯用的代码。你可以将此表作为快速参考。重要的是要注意，你无需完全理解这些函数的工作原理即可在代码中使用它们。

| 函数   | 访问 `x` 的方式 | 返回值      | 用例                                                           |
|------|------------|-----------|----------------------------------------------------------------|
| `let`  | `it`       | Lambda 结果 | 在代码中执行空检查，并随后对返回的对象执行进一步操作。                       |
| `apply`| `this`     | `x`       | 在创建时初始化对象。                                                 |
| `run`  | `this`     | Lambda 结果 | 在创建时初始化对象**并**计算结果。                                       |
| `also` | `it`       | `x`       | 在返回对象之前完成额外操作。                                             |
| `with` | `this`     | Lambda 结果 | 在一个对象上调用多个函数。                                             |

有关作用域函数的更多信息，请参阅[作用域函数](scope-functions.md)。

## 练习

### 练习 1 {initial-collapse-state="collapsed" collapsible="true" id="scope-functions-exercise-1"}

将 `.getPriceInEuros()` 函数重写为使用安全调用运算符 `?.` 和 `let` 作用域函数的单表达式函数。

<deflist collapsible="true">
    <def title="提示">
        使用安全调用运算符 <code>?.</code> 从 <code>getProductInfo()</code>
        函数安全地访问 <code>priceInDollars</code> 属性。然后，使用 <code>let</code> 作用域函数将 <code>priceInDollars</code> 的值转换为欧元。
    </def>
</deflist>

|---|---|
```kotlin
data class ProductInfo(val priceInDollars: Double?)

class Product {
    fun getProductInfo(): ProductInfo? {
        return ProductInfo(100.0)
    }
}

// Rewrite this function
fun Product.getPriceInEuros(): Double? {
    val info = getProductInfo()
    if (info == null) return null
    val price = info.priceInDollars
    if (price == null) return null
    return convertToEuros(price)
}

fun convertToEuros(dollars: Double): Double {
    return dollars * 0.85
}

fun main() {
    val product = Product()
    val priceInEuros = product.getPriceInEuros()

    if (priceInEuros != null) {
        println("Price in Euros: €$priceInEuros")
        // Price in Euros: €85.0
    } else {
        println("Price information is not available.")
    }
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-scope-functions-exercise-1"}

|---|---|
```kotlin
data class ProductInfo(val priceInDollars: Double?)

class Product {
    fun getProductInfo(): ProductInfo? {
        return ProductInfo(100.0)
    }
}

fun Product.getPriceInEuros() = getProductInfo()?.priceInDollars?.let { convertToEuros(it) }

fun convertToEuros(dollars: Double): Double {
    return dollars * 0.85
}

fun main() {
    val product = Product()
    val priceInEuros = product.getPriceInEuros()

    if (priceInEuros != null) {
        println("Price in Euros: €$priceInEuros")
        // Price in Euros: €85.0
    } else {
        println("Price information is not available.")
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-scope-functions-solution-1"}

### 练习 2 {initial-collapse-state="collapsed" collapsible="true" id="scope-functions-exercise-2"}

你有一个 `updateEmail()` 函数，它用于更新用户的电子邮件地址。使用 `apply` 作用域函数来更新电子邮件地址，然后使用 `also` 作用域函数打印日志消息：`Updating email for user with ID: ${it.id}`。

|---|---|
```kotlin
data class User(val id: Int, var email: String)

fun updateEmail(user: User, newEmail: String): User = // Write your code here

fun main() {
    val user = User(1, "old_email@example.com")
    val updatedUser = updateEmail(user, "new_email@example.com")
    // Updating email for user with ID: 1

    println("Updated User: $updatedUser")
    // Updated User: User(id=1, email=new_email@example.com)
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-scope-functions-exercise-2"}

|---|---|
```kotlin
data class User(val id: Int, var email: String)

fun updateEmail(user: User, newEmail: String): User = user.apply {
    this.email = newEmail
}.also { println("Updating email for user with ID: ${it.id}") }

fun main() {
    val user = User(1, "old_email@example.com")
    val updatedUser = updateEmail(user, "new_email@example.com")
    // Updating email for user with ID: 1

    println("Updated User: $updatedUser")
    // Updated User: User(id=1, email=new_email@example.com)
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解决方案" id="kotlin-tour-scope-functions-solution-2"}

## 下一步

[中级：带接收者的 Lambda 表达式](kotlin-tour-intermediate-lambdas-receiver.md)