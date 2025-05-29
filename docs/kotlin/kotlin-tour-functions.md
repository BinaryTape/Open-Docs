[//]: # (title: 函数)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="第一步" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="第二步" /> <a href="kotlin-tour-basic-types.md">基本类型</a><br />
        <img src="icon-3-done.svg" width="20" alt="第三步" /> <a href="kotlin-tour-collections.md">集合</a><br />
        <img src="icon-4-done.svg" width="20" alt="第四步" /> <a href="kotlin-tour-control-flow.md">控制流</a><br />
        <img src="icon-5.svg" width="20" alt="第五步" /> <strong>函数</strong><br />
        <img src="icon-6-todo.svg" width="20" alt="第六步" /> <a href="kotlin-tour-classes.md">类</a><br />
        <img src="icon-7-todo.svg" width="20" alt="最后一步" /> <a href="kotlin-tour-null-safety.md">空安全</a></p>
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

* 函数参数写在圆括号 `()` 内。
* 每个参数必须有类型，多个参数必须用逗号 `,` 分隔。
* 返回类型写在函数圆括号 `()` 之后，用冒号 `:` 分隔。
* 函数体写在花括号 `{}` 内。
* 使用 `return` 关键字退出函数或从函数返回某个值。

> 如果函数不返回任何有用的值，则可以省略返回类型和 `return` 关键字。有关更多信息，请参阅[不返回值的函数](#functions-without-return)。
>
{style="note"}

在以下示例中：

* `x` 和 `y` 是函数参数。
* `x` 和 `y` 的类型是 `Int`。
* 函数的返回类型是 `Int`。
* 当调用该函数时，它返回 `x` 和 `y` 的和。

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

> 我们在[编码规范](coding-conventions.md#function-names)中建议，函数名应以小写字母开头，并使用驼峰命名法，不带下划线。
>
{style="note"}

## 具名参数

为了代码简洁，调用函数时不必包含参数名。然而，包含参数名确实能使代码更易读。这被称为使用**具名参数**。如果包含参数名，你可以按任何顺序书写参数。

> 在以下示例中，[字符串模板](strings.md#string-templates) (`$`) 用于访问参数值，将其转换为 `String` 类型，然后将它们连接成一个字符串用于打印。
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

## 默认参数值

你可以为函数参数定义默认值。任何带有默认值的参数在调用函数时都可以省略。要声明默认值，请在类型后面使用赋值运算符 `=`：

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

> 你可以跳过带有默认值的特定参数，而不是全部省略它们。但是，在第一个被跳过的参数之后，你必须为所有后续参数指定名称。
>
{style="note"}

## 不返回值的函数

如果函数不返回任何有用的值，那么它的返回类型是 `Unit`。`Unit` 是一种只有一个值——`Unit` 的类型。你无需在函数体中显式声明返回 `Unit`。这意味着你不需要使用 `return` 关键字或声明返回类型：

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

你可以移除花括号 `{}` 并使用赋值运算符 `=` 声明函数体。当你使用赋值运算符 `=` 时，Kotlin 会使用类型推断，所以你也可以省略返回类型。`sum()` 函数因此变为一行：

```kotlin
fun sum(x: Int, y: Int) = x + y

fun main() {
    println(sum(1, 2))
    // 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-simple-function-after"}

然而，如果你希望其他开发者能快速理解你的代码，即使使用赋值运算符 `=`，最好还是显式定义返回类型。

> 如果你使用 `{}` 花括号来声明函数体，则必须声明返回类型，除非它是 `Unit` 类型。
>
{style="note"}

## 函数中的提前返回

要阻止函数中的代码在特定点之后继续处理，请使用 `return` 关键字。此示例使用 `if` 在条件表达式为真时提前从函数返回：

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

## 函数实践

### 练习 1 {initial-collapse-state="collapsed" collapsible="true" id="functions-exercise-1"}

编写一个名为 `circleArea` 的函数，它接受一个整数格式的圆半径作为参数，并输出该圆的面积。

> 在本练习中，你将导入一个包，以便通过 `PI` 访问圆周率的值。有关导入包的更多信息，请参阅[包和导入](packages.md)。
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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解答" id="kotlin-tour-functions-solution-1"}

### 练习 2 {initial-collapse-state="collapsed" collapsible="true" id="functions-exercise-2"}

将上一个练习中的 `circleArea` 函数重写为单表达式函数。

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解答" id="kotlin-tour-functions-solution-2"}

### 练习 3 {initial-collapse-state="collapsed" collapsible="true" id="functions-exercise-3"}

你有一个函数，可以将以小时、分钟和秒给定的时间间隔转换为秒。在大多数情况下，你只需要传递一个或两个函数参数，而其余参数等于 0。通过使用默认参数值和具名参数来改进函数和调用它的代码，使代码更易读。

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解答" id="kotlin-tour-functions-solution-3"}

## Lambda 表达式

Kotlin 允许你通过使用 lambda 表达式编写更简洁的函数代码。

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

Lambda 表达式初看起来可能难以理解，所以让我们来分解一下。Lambda 表达式写在花括号 `{}` 内。

在 lambda 表达式中，你写：

* 参数，后面跟着 `->`。
* `->` 之后的函数体。

在以上示例中：

* `text` 是一个函数参数。
* `text` 的类型是 `String`。
* 该函数返回在 `text` 上调用的 [`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html) 函数的结果。
* 整个 lambda 表达式通过赋值运算符 `=` 赋值给 `upperCaseString` 变量。
* 通过像函数一样使用变量 `upperCaseString` 并以字符串 `"hello"` 作为参数来调用该 lambda 表达式。
* `println()` 函数打印结果。

> 如果你声明的 lambda 没有参数，则无需使用 `->`。例如：
> ```kotlin
> { println("Log message") }
> ```
>
{style="note"}

Lambda 表达式可以通过多种方式使用。你可以：

* [将 lambda 表达式作为参数传递给另一个函数](#pass-to-another-function)
* [从函数返回 lambda 表达式](#return-from-a-function)
* [单独调用 lambda 表达式](#invoke-separately)

### 传递给另一个函数

将 lambda 表达式传递给函数的一个很好的例子是，在集合上使用 [`.filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 函数：

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

`.filter()` 函数接受一个 lambda 表达式作为谓词：

* `{ x -> x > 0 }` 获取列表中的每个元素，只返回那些正数。
* `{ x -> x < 0 }` 获取列表中的每个元素，只返回那些负数。

此示例演示了两种将 lambda 表达式传递给函数的方法：

* 对于正数，示例直接在 `.filter()` 函数中添加了 lambda 表达式。
* 对于负数，示例将 lambda 表达式赋值给 `isNegative` 变量。然后 `isNegative` 变量在 `.filter()` 函数中用作函数参数。在这种情况下，你必须在 lambda 表达式中指定函数参数 (`x`) 的类型。

> 如果 lambda 表达式是唯一的函数参数，你可以省略函数圆括号 `()`：
>
> ```kotlin
> val positives = numbers.filter { x -> x > 0 }
> ```
>
> 这是一个[尾随 lambda](#trailing-lambdas) 的示例，本章末尾将对此进行更详细的讨论。
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

你已经了解了基本类型，但函数本身也有类型。Kotlin 的类型推断可以从参数类型推断出函数的类型。但在某些情况下，你可能需要显式指定函数类型。编译器需要函数类型才能知道该函数允许和不允许做什么。

函数类型的语法包括：

* 每个参数的类型写在圆括号 `()` 内，并用逗号 `,` 分隔。
* `->` 之后写返回类型。

例如：`(String) -> String` 或 `(Int, Int) -> Int`。

如果定义了 `upperCaseString()` 的函数类型，lambda 表达式看起来是这样的：

```kotlin
val upperCaseString: (String) -> String = { text -> text.uppercase() }

fun main() {
    println(upperCaseString("hello"))
    // HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-function-type"}

如果你的 lambda 表达式没有参数，那么圆括号 `()` 留空。例如：`() -> Unit`

> 你必须在 lambda 表达式中或作为函数类型声明参数和返回类型。否则，编译器将无法知道你的 lambda 表达式是什么类型。
>
> 例如，以下代码将不起作用：
>
> `val upperCaseString = { str -> str.uppercase() }`
>
{style="note"}

### 从函数返回

Lambda 表达式可以从函数中返回。为了让编译器理解返回的 lambda 表达式的类型，你必须声明一个函数类型。

在以下示例中，`toSeconds()` 函数的函数类型是 `(Int) -> Int`，因为它总是返回一个接受 `Int` 类型参数并返回 `Int` 值的 lambda 表达式。

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

Lambda 表达式可以通过在花括号 `{}` 后面添加圆括号 `()` 并在圆括号内包含任何参数来单独调用：

```kotlin
fun main() {
    //sampleStart
    println({ text: String -> text.uppercase() }("hello"))
    // HELLO
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-standalone"}

### 尾随 lambda

如你所见，如果 lambda 表达式是唯一的函数参数，你可以省略函数圆括号 `()`。如果 lambda 表达式作为函数的最后一个参数传递，那么该表达式可以写在函数圆括号 `()` 之外。在这两种情况下，这种语法都称为**尾随 lambda**。

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

有关 lambda 表达式的更多信息，请参阅[Lambda 表达式和匿名函数](lambdas.md#lambda-expressions-and-anonymous-functions)。

我们教程的下一步是学习 Kotlin 中的[类](kotlin-tour-classes.md)。

## Lambda 表达式实践

### 练习 1 {initial-collapse-state="collapsed" collapsible="true" id="lambdas-exercise-1"}

你有一个包含 Web 服务支持的操作列表、所有请求的通用前缀以及特定资源的 ID。要请求 ID 为 5 的资源上的 `title` 操作，你需要创建以下 URL：`https://example.com/book-info/5/title`。
使用 lambda 表达式从操作列表中创建 URL 列表。

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解答" id="kotlin-tour-lambdas-solution-1"}

### 练习 2 {initial-collapse-state="collapsed" collapsible="true" id="lambdas-exercise-2"}

编写一个函数，它接受一个 `Int` 值和一个操作（一个类型为 `() -> Unit` 的函数），然后将该操作重复给定次数。然后使用此函数打印“Hello”5 次。

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="示例解答" id="kotlin-tour-lambdas-solution-2"}

## 下一步

[类](kotlin-tour-classes.md)