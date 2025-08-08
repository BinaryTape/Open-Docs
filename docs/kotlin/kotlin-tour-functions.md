[//]: # (title: 函数)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types.md">基本类型</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections.md">集合</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow.md">控制流</a><br />
        <img src="icon-5.svg" width="20" alt="Fifth step" /> <strong>函数</strong><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes.md">类</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety.md">空安全</a></p>
</tldr>

你可以使用 `fun` 关键字在 Kotlin 中声明自己的函数。

```kotlin
fun hello() {
    return println("Hello, world!")
}

fun main() {
    hello()
    // Hello, world!
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-function-demo"}

在 Kotlin 中：

* 函数形参写在圆括号 `()` 内。
* 每个形参都必须有类型，多个形参之间必须用逗号 `,` 分隔。
* 返回类型写在函数圆括号 `()` 之后，并用冒号 `:` 分隔。
* 函数体写在花括号 `{}` 内。
* `return` 关键字用于退出函数或从函数中返回内容。

> 如果函数不返回任何有用的内容，可以省略返回类型和 `return` 关键字。有关更多信息，请参阅[不返回内容的函数](#functions-without-return)。
>
{style="note"}

在以下示例中：

* `x` 和 `y` 是函数形参。
* `x` 和 `y` 的类型是 `Int`。
* 函数的返回类型是 `Int`。
* 调用该函数时，它会返回 `x` 和 `y` 的和。

```kotlin
fun sum(x: Int, y: Int): Int {
    return x + y
}

fun main() {
    println(sum(1, 2))
    // 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-simple-function"}

> 我们在[编码约定](coding-conventions.md#function-names)中建议，函数名称以小写字母开头，并使用驼峰式命名法，不带下划线。
>
{style="note"}

## 具名实参

为了简洁的代码，调用函数时不必包含形参名称。但是，包含形参名称确实可以使代码更易读。这称为使用**具名实参**。如果包含形参名称，则可以按任意顺序书写形参。

> ) 用于访问形参值，将其转换为 `String` 类型，然后将它们连接成一个字符串以供打印。
>
{style="tip"}

```kotlin
fun printMessageWithPrefix(message: String, prefix: String) {
    println("[$prefix] $message")
}

fun main() {
    // Uses named arguments with swapped parameter order
    printMessageWithPrefix(prefix = "Log", message = "Hello")
    // [Log] Hello
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-named-arguments-function"}

## 默认形参值

你可以为函数形参定义默认值。任何具有默认值的形参在调用函数时都可以省略。要声明默认值，请在类型后使用赋值操作符 `=`：

```kotlin
fun printMessageWithPrefix(message: String, prefix: String = "Info") {
    println("[$prefix] $message")
}

fun main() {
    // Function called with both parameters
    printMessageWithPrefix("Hello", "Log") 
    // [Log] Hello
    
    // Function called only with message parameter
    printMessageWithPrefix("Hello")        
    // [Info] Hello
    
    printMessageWithPrefix(prefix = "Log", message = "Hello")
    // [Log] Hello
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-default-param-function"}

> 你可以跳过带有默认值的特定形参，而不是省略所有形参。但是，在第一个被跳过的形参之后，你必须为所有后续形参命名。
>
{style="note"}

## 不返回内容的函数

如果你的函数不返回有用的值，那么它的返回类型是 `Unit`。`Unit` 是一个只包含一个值（即 `Unit`）的类型。你无需在函数体中显式声明 `Unit` 返回。这意味着你无需使用 `return` 关键字或声明返回类型：

```kotlin
fun printMessage(message: String) {
    println(message)
    // `return Unit` or `return` is optional
}

fun main() {
    printMessage("Hello")
    // Hello
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-unit-function"}

## 单表达式函数

为了使代码更简洁，你可以使用单表达式函数。例如，`sum()` 函数可以缩短为：

```kotlin
fun sum(x: Int, y: Int): Int {
    return x + y
}

fun main() {
    println(sum(1, 2))
    // 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-simple-function-before"}

你可以移除花括号 `{}`，并使用赋值操作符 `=` 声明函数体。当你使用赋值操作符 `=` 时，Kotlin 会使用类型推断，因此你也可以省略返回类型。这样，`sum()` 函数就变成了一行：

```kotlin
fun sum(x: Int, y: Int) = x + y

fun main() {
    println(sum(1, 2))
    // 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-simple-function-after"}

然而，如果你希望其他开发者能快速理解你的代码，即使使用赋值操作符 `=`，也最好显式定义返回类型。

> 如果你使用花括号 `{}` 声明函数体，则必须声明返回类型，除非它是 `Unit` 类型。
>
{style="note"}

## 函数中的提前返回

要阻止函数中的代码在某一点之后继续处理，请使用 `return` 关键字。此示例使用 `if` 在条件表达式为 `true` 时提前从函数返回：

```kotlin
// A list of registered usernames
val registeredUsernames = mutableListOf("john_doe", "jane_smith")

// A list of registered emails
val registeredEmails = mutableListOf("john@example.com", "jane@example.com")

fun registerUser(username: String, email: String): String {
    // Early return if the username is already taken
    if (username in registeredUsernames) {
        return "Username already taken. Please choose a different username."
    }

    // Early return if the email is already registered
    if (email in registeredEmails) {
        return "Email already registered. Please use a different email."
    }

    // Proceed with the registration if the username and email are not taken
    registeredUsernames.add(username)
    registeredEmails.add(email)

    return "User registered successfully: $username"
}

fun main() {
    println(registerUser("john_doe", "newjohn@example.com"))
    // Username already taken. Please choose a different username.
    println(registerUser("new_user", "newuser@example.com"))
    // User registered successfully: new_user
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-function-early-return"}

## 函数练习

### 练习 1 {initial-collapse-state="collapsed" collapsible="true" id="functions-exercise-1"}

编写一个名为 `circleArea` 的函数，该函数接收以整数格式表示的圆半径作为形参，并输出该圆的面积。

> 在此练习中，你导入了一个包，以便可以通过 `PI` 访问 pi 的值。有关导入包的更多信息，请参阅[包和导入](packages.md)。
>
{style="tip"}

|---|---|
```kotlin
import kotlin.math.PI

// Write your code here

fun main() {
    println(circleArea(2))
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-functions-exercise-1"}

|---|---|
```kotlin
import kotlin.math.PI

fun circleArea(radius: Int): Double {
    return PI * radius * radius
}

fun main() {
    println(circleArea(2)) // 12.566370614359172
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-functions-solution-1"}

### 练习 2 {initial-collapse-state="collapsed" collapsible="true" id="functions-exercise-2"}

将上一个练习中的 `circleArea` 函数改写为单表达式函数。

|---|---|
```kotlin
import kotlin.math.PI

// Write your code here

fun main() {
    println(circleArea(2))
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-functions-exercise-2"}

|---|---|
```kotlin
import kotlin.math.PI

fun circleArea(radius: Int): Double = PI * radius * radius

fun main() {
    println(circleArea(2)) // 12.566370614359172
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-functions-solution-2"}

### 练习 3 {initial-collapse-state="collapsed" collapsible="true" id="functions-exercise-3"}

你有一个函数，可以将以小时、分钟和秒给定的时间间隔转换为秒。在大多数情况下，你只需传递一到两个函数形参，而其余形参则等于 0。通过使用默认形参值和具名实参来改进该函数及其调用代码，以便代码更易读。

|---|---|
```kotlin
fun intervalInSeconds(hours: Int, minutes: Int, seconds: Int) =
    ((hours * 60) + minutes) * 60 + seconds

fun main() {
    println(intervalInSeconds(1, 20, 15))
    println(intervalInSeconds(0, 1, 25))
    println(intervalInSeconds(2, 0, 0))
    println(intervalInSeconds(0, 10, 0))
    println(intervalInSeconds(1, 0, 1))
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-functions-exercise-3"}

|---|---|
```kotlin
fun intervalInSeconds(hours: Int = 0, minutes: Int = 0, seconds: Int = 0) =
    ((hours * 60) + minutes) * 60 + seconds

fun main() {
    println(intervalInSeconds(1, 20, 15))
    println(intervalInSeconds(minutes = 1, seconds = 25))
    println(intervalInSeconds(hours = 2))
    println(intervalInSeconds(minutes = 10))
    println(intervalInSeconds(hours = 1, seconds = 1))
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-functions-solution-3"}

## lambda 表达式

Kotlin 允许你通过使用 lambda 表达式来编写更简洁的函数代码。

例如，以下 `uppercaseString()` 函数：

```kotlin
fun uppercaseString(text: String): String {
    return text.uppercase()
}
fun main() {
    println(uppercaseString("hello"))
    // HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-function-before"}

也可以写成 lambda 表达式：

```kotlin
fun main() {
    val upperCaseString = { text: String -> text.uppercase() }
    println(upperCaseString("hello"))
    // HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-variable"}

lambda 表达式初看可能难以理解，让我们来分解一下。lambda 表达式写在花括号 `{}` 内。

在 lambda 表达式中，你写道：

* 形参后跟 `->`。
* `->` 后的函数体。

在前面的示例中：

* `text` 是一个函数形参。
* `text` 的类型是 `String`。
* 该函数返回在 `text` 上调用 [`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html) 函数的结果。
* 整个 lambda 表达式通过赋值操作符 `=` 赋值给 `upperCaseString` 变量。
* 该 lambda 表达式通过将变量 `upperCaseString` 像函数一样使用，并以字符串 `"hello"` 作为形参来调用。
* `println()` 函数打印结果。

> 如果你声明一个没有形参的 lambda 表达式，则无需使用 `->`。例如：
> ```kotlin
> { println("Log message") }
> ```
>
{style="note"}

lambda 表达式可以以多种方式使用。你可以：

* [将 lambda 表达式作为形参传递给另一个函数](#pass-to-another-function)
* [从函数返回 lambda 表达式](#return-from-a-function)
* [单独调用 lambda 表达式](#invoke-separately)

### 传递给另一个函数

一个将 lambda 表达式传递给函数的好例子是，在集合上使用 [`.filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 函数：

```kotlin
fun main() {
    //sampleStart
    val numbers = listOf(1, -2, 3, -4, 5, -6)
    
    val positives = numbers.filter ({ x -> x > 0 })
    
    val isNegative = { x: Int -> x < 0 }
    val negatives = numbers.filter(isNegative)
    
    println(positives)
    // [1, 3, 5]
    println(negatives)
    // [-2, -4, -6]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-filter"}

`.filter()` 函数接受一个 lambda 表达式作为谓词并将其应用于列表中的每个元素。只有当谓词返回 `true` 时，函数才会保留该元素：

* `{ x -> x > 0 }` 返回 `true` 如果元素为正。
* `{ x -> x < 0 }` 返回 `true` 如果元素为负。

此示例演示了将 lambda 表达式传递给函数的两种方式：

* 对于正数，示例直接在 `.filter()` 函数中添加 lambda 表达式。
* 对于负数，示例将 lambda 表达式赋值给 `isNegative` 变量。然后，`isNegative` 变量作为函数形参在 `.filter()` 函数中使用。在这种情况下，你必须在 lambda 表达式中指定函数形参 (`x`) 的类型。

> 如果 lambda 表达式是唯一的函数形参，你可以省略函数圆括号 `()`：
>
> ```kotlin
> val positives = numbers.filter { x -> x > 0 }
> ```
>
> 这是[尾随 lambda 表达式](#trailing-lambdas)的一个示例，本章末尾将更详细地讨论它。
>
{style="note"}

另一个好例子是使用 [`.map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) 函数来转换集合中的项：

```kotlin
fun main() {
    //sampleStart
    val numbers = listOf(1, -2, 3, -4, 5, -6)
    val doubled = numbers.map { x -> x * 2 }
    
    val isTripled = { x: Int -> x * 3 }
    val tripled = numbers.map(isTripled)
    
    println(doubled)
    // [2, -4, 6, -8, 10, -12]
    println(tripled)
    // [3, -6, 9, -12, 15, -18]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-map"}

`.map()` 函数接受一个 lambda 表达式作为转换函数：

* `{ x -> x * 2 }` 获取列表中的每个元素，并返回该元素乘以 2 的结果。
* `{ x -> x * 3 }` 获取列表中的每个元素，并返回该元素乘以 3 的结果。

### 函数类型

在从函数返回 lambda 表达式之前，你首先需要了解**函数类型**。

你已经了解了基本类型，但函数本身也有类型。Kotlin 的类型推断可以从形参类型推断函数的类型。但有时你可能需要显式指定函数类型。编译器需要函数类型才能知道该函数允许和不允许什么。

函数类型的语法包含：

* 每个形参的类型写在圆括号 `()` 内，并用逗号 `,` 分隔。
* 返回类型写在 `->` 之后。

例如：`(String) -> String` 或 `(Int, Int) -> Int`。

如果为 `upperCaseString()` 定义了函数类型，则 lambda 表达式看起来像这样：

```kotlin
val upperCaseString: (String) -> String = { text -> text.uppercase() }

fun main() {
    println(upperCaseString("hello"))
    // HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-function-type"}

如果你的 lambda 表达式没有形参，则圆括号 `()` 留空。例如：`() -> Unit`

> 你必须在 lambda 表达式中或作为函数类型声明形参和返回类型。否则，编译器将无法知道你的 lambda 表达式是什么类型。
>
> 例如，以下代码将无法工作：
>
> `val upperCaseString = { str -> str.uppercase() }`
>
{style="note"}

### 从函数返回

lambda 表达式可以从函数返回。为了让编译器理解返回的 lambda 表达式是什么类型，你必须声明一个函数类型。

在以下示例中，`toSeconds()` 函数的函数类型为 `(Int) -> Int`，因为它总是返回一个 lambda 表达式，该表达式接受 `Int` 类型的形参并返回一个 `Int` 值。

此示例使用 `when` 表达式来确定调用 `toSeconds()` 时返回哪个 lambda 表达式：

```kotlin
fun toSeconds(time: String): (Int) -> Int = when (time) {
    "hour" -> { value -> value * 60 * 60 }
    "minute" -> { value -> value * 60 }
    "second" -> { value -> value }
    else -> { value -> value }
}

fun main() {
    val timesInMinutes = listOf(2, 10, 15, 1)
    val min2sec = toSeconds("minute")
    val totalTimeInSeconds = timesInMinutes.map(min2sec).sum()
    println("Total time is $totalTimeInSeconds secs")
    // Total time is 1680 secs
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-return-from-function"}

### 单独调用

lambda 表达式可以通过在花括号 `{}` 后添加圆括号 `()` 并在圆括号内包含任何形参来单独调用：

```kotlin
fun main() {
    //sampleStart
    println({ text: String -> text.uppercase() }("hello"))
    // HELLO
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-standalone"}

### 尾随 lambda 表达式

如你所见，如果 lambda 表达式是唯一的函数形参，你可以省略函数圆括号 `()`。如果 lambda 表达式作为函数的最后一个形参传递，则该表达式可以写在函数圆括号 `()` 之外。在这两种情况下，此语法都称为**尾随 lambda 表达式**。

例如，[`.fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/fold.html) 函数接受一个初始值和一个操作：

```kotlin
fun main() {
    //sampleStart
    // The initial value is zero. 
    // The operation sums the initial value with every item in the list cumulatively.
    println(listOf(1, 2, 3).fold(0, { x, item -> x + item })) // 6

    // Alternatively, in the form of a trailing lambda
    println(listOf(1, 2, 3).fold(0) { x, item -> x + item })  // 6
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-trailing-lambda"}

有关 lambda 表达式的更多信息，请参阅[lambda 表达式与匿名函数](lambdas.md#lambda-expressions-and-anonymous-functions)。

我们旅程的下一步是学习 Kotlin 中的[类](kotlin-tour-classes.md)。

## lambda 表达式练习

### 练习 1 {initial-collapse-state="collapsed" collapsible="true" id="lambdas-exercise-1"}

你有一个由 Web 服务支持的动作列表、所有请求的通用前缀以及特定资源的 ID。要通过 ID 为 5 的资源请求动作 `title`，你需要创建以下 URL：`https://example.com/book-info/5/title`。使用 lambda 表达式从动作列表中创建 URL 列表。

|---|---|
```kotlin
fun main() {
    val actions = listOf("title", "year", "author")
    val prefix = "https://example.com/book-info"
    val id = 5
    val urls = // Write your code here
    println(urls)
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambdas-exercise-1"}

|---|---|
```kotlin
fun main() {
    val actions = listOf("title", "year", "author")
    val prefix = "https://example.com/book-info"
    val id = 5
    val urls = actions.map { action -> "$prefix/$id/$action" }
    println(urls)
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-lambdas-solution-1"}

### 练习 2 {initial-collapse-state="collapsed" collapsible="true" id="lambdas-exercise-2"}

编写一个函数，它接受一个 `Int` 值和一个动作（类型为 `() -> Unit` 的函数），然后将该动作重复给定的次数。然后使用此函数打印 5 次“Hello”。

|---|---|
```kotlin
fun repeatN(n: Int, action: () -> Unit) {
    // Write your code here
}

fun main() {
    // Write your code here
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambdas-exercise-2"}

|---|---|
```kotlin
fun repeatN(n: Int, action: () -> Unit) {
    for (i in 1..n) {
        action()
    }
}

fun main() {
    repeatN(5) {
        println("Hello")
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-lambdas-solution-2"}

## 下一步

[类](kotlin-tour-classes.md)