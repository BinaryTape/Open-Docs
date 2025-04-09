---
title: 函数
---
<no-index/>

:::info
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world">Hello world</a><br />
        <img src="/img/icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types">Basic types（基本类型）</a><br />
        <img src="/img/icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections">Collections（集合）</a><br />
        <img src="/img/icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow">Control flow（控制流）</a><br />
        <img src="/img/icon-5.svg" width="20" alt="Fifth step" /> <strong>Functions（函数）</strong><br />
        <img src="/img/icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes">Classes（类）</a><br />
        <img src="/img/icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety">Null safety（空安全）</a>
</p>

:::

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

在 Kotlin 中：

* 函数参数写在括号 `()` 内。
* 每个参数必须有一个类型，多个参数之间用逗号 `,` 分隔。
* 返回类型写在函数的括号 `()` 之后，用冒号 `:` 分隔。
* 函数体写在大括号 `{}` 内。
* `return` 关键字用于退出函数或从函数返回某些内容。

:::note
如果函数没有返回任何有用的值，则可以省略返回类型和 `return` 关键字。 在[没有返回值的函数](#functions-without-return)中了解更多信息。

:::

在下面的例子中：

* `x` 和 `y` 是函数参数。
* `x` 和 `y` 的类型是 `Int`。
* 函数的返回类型是 `Int`。
* 该函数在调用时返回 `x` 和 `y` 的和。

```kotlin
fun sum(x: Int, y: Int): Int {
    return x + y
}

fun main() {
    println(sum(1, 2))
    // 3
}
```

:::note
我们建议在我们的[编码规范](coding-conventions#function-names)中，函数命名以小写字母开头，并使用驼峰命名法，不使用下划线。

:::

## 命名参数

为了代码简洁，在调用函数时，不必包含参数名。 但是，包含参数名确实使你的代码更易于阅读。 这称为使用**命名参数**。 如果确实包含参数名，则可以按任何顺序编写参数。

:::note
在以下示例中，[字符串模板](strings#string-templates) (`$`) 用于访问参数值，将其转换为 `String` 类型，然后将它们连接成字符串以进行打印。

```kotlin
fun printMessageWithPrefix(message: String, prefix: String) {
    println("[$prefix] $message")
}

fun main() {
    // 使用带有交换参数顺序的命名参数
    printMessageWithPrefix(prefix = "Log", message = "Hello")
    // [Log] Hello
}
```

## 默认参数值

你可以为函数参数定义默认值。 调用函数时，可以省略任何具有默认值的参数。 要声明默认值，请在类型后使用赋值运算符 `=`：

```kotlin
fun printMessageWithPrefix(message: String, prefix: String = "Info") {
    println("[$prefix] $message")
}

fun main() {
    // 使用两个参数调用函数
    printMessageWithPrefix("Hello", "Log") 
    // [Log] Hello
    
    // 仅使用 message 参数调用函数
    printMessageWithPrefix("Hello")        
    // [Info] Hello
    
    printMessageWithPrefix(prefix = "Log", message = "Hello")
    // [Log] Hello
}
```

你可以跳过具有默认值的特定参数，而不是省略所有参数。 但是，在第一个跳过的参数之后，你必须命名所有后续参数。

:::

## 没有返回值的函数

如果你的函数没有返回有用的值，则其返回类型为 `Unit`。 `Unit` 是一种只有一个值的类型 – `Unit`。 你不必在函数体中显式声明返回 `Unit`。 这意味着你不必使用 `return` 关键字或声明返回类型：

```kotlin
fun printMessage(message: String) {
    println(message)
    // `return Unit` 或 `return` 是可选的
}

fun main() {
    printMessage("Hello")
    // Hello
}
```

## 单表达式函数

为了使你的代码更简洁，你可以使用单表达式函数。 例如，可以缩短 `sum()` 函数：

```kotlin
fun sum(x: Int, y: Int): Int {
    return x + y
}

fun main() {
    println(sum(1, 2))
    // 3
}
```

你可以删除大括号 `{}` 并使用赋值运算符 `=` 声明函数体。 当你使用赋值运算符 `=` 时，Kotlin 使用类型推断，因此你也可以省略返回类型。 然后，`sum()` 函数变为一行：

```kotlin
fun sum(x: Int, y: Int) = x + y

fun main() {
    println(sum(1, 2))
    // 3
}
```

但是，如果你希望其他开发人员能够快速理解你的代码，即使在使用赋值运算符 `=` 时，显式定义返回类型也是一个好主意。

:::note
如果使用 `{}` 大括号声明函数体，则必须声明返回类型，除非它是 `Unit` 类型。

:::

## 函数中的提前返回

要停止函数中的代码被进一步处理超过某个点，请使用 `return` 关键字。 此示例使用 `if` 在条件表达式被发现为真时从函数提前返回：

```kotlin
// 已注册的用户名列表
val registeredUsernames = mutableListOf("john_doe", "jane_smith")

// 已注册的电子邮件列表
val registeredEmails = mutableListOf("john@example.com", "jane@example.com")

fun registerUser(username: String, email: String): String {
    // 如果用户名已被占用，则提前返回
    if (username in registeredUsernames) {
        return "Username already taken. Please choose a different username."
    }

    // 如果电子邮件已注册，则提前返回
    if (email in registeredEmails) {
        return "Email already registered. Please use a different email."
    }

    // 如果用户名和电子邮件未被占用，则继续注册
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

## 函数练习

### 练习 1

编写一个名为 `circleArea` 的函数，该函数以整数格式获取圆的半径作为参数，并输出该圆的面积。

:::note
在本练习中，你导入一个包，以便可以通过 `PI` 访问 pi 的值。 有关导入包的更多信息，请参见 [包和导入](packages)。

:::

|---|---|
```kotlin
import kotlin.math.PI

// 在这里编写你的代码

fun main() {
    println(circleArea(2))
}
```

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

### 练习 2

将上一个练习中的 `circleArea` 函数重写为单表达式函数。

|---|---|
```kotlin
import kotlin.math.PI

// 在这里编写你的代码

fun main() {
    println(circleArea(2))
}
```

|---|---|
```kotlin
import kotlin.math.PI

fun circleArea(radius: Int): Double = PI * radius * radius

fun main() {
    println(circleArea(2)) // 12.566370614359172
}
```

### 练习 3

你有一个函数，可以将以小时、分钟和秒为单位给出的时间间隔转换为秒。 在大多数情况下，你只需要传递一个或两个函数参数，而其余参数等于 0。 通过使用默认参数值和命名参数来改进函数和调用它的代码，以便代码更易于阅读。

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

## Lambda 表达式

Kotlin 允许你使用 Lambda 表达式为函数编写更简洁的代码。

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

也可以写成 Lambda 表达式：

```kotlin
fun main() {
    val upperCaseString = { text: String -
:::note
 text.uppercase() }
    println(upperCaseString("hello"))
    // HELLO
}
```

乍一看，Lambda 表达式可能很难理解，让我们分解一下。 Lambda 表达式写在大括号 `{}` 内。

在 Lambda 表达式中，你编写：

* 参数后跟 `->`。
* `->` 之后的函数体。

在前面的例子中：

* `text` 是一个函数参数。
* `text` 的类型为 `String`。
* 该函数返回对 `text` 调用的 [`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html) 函数的结果。
* 整个 Lambda 表达式使用赋值运算符 `=` 分配给 `upperCaseString` 变量。
* 通过像函数一样使用变量 `upperCaseString` 并使用字符串 `"hello"` 作为参数来调用 Lambda 表达式。
* `println()` 函数打印结果。

如果声明一个没有参数的 Lambda 表达式，则无需使用 `->`。 例如：
```kotlin
{ println("Log message") }
```

:::

Lambda 表达式可以通过多种方式使用。 你可以：

* [将 Lambda 表达式作为参数传递给另一个函数](#pass-to-another-function)
* [从函数返回 Lambda 表达式](#return-from-a-function)
* [单独调用 Lambda 表达式](#invoke-separately)

### 传递给另一个函数

当将 Lambda 表达式传递给函数很有用时，一个很好的例子是在集合上使用 [`.filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 函数：

```kotlin
fun main() {

    val numbers = listOf(1, -2, 3, -4, 5, -6)
    
    
    val positives = numbers.filter ({ x `->` x > 0 })
    
    val isNegative = { x: Int `->` x < 0 }
    val negatives = numbers.filter(isNegative)
    
    println(positives)
    // [1, 3, 5]
    println(negatives)
    // [-2, -4, -6]

}
```

`.filter()` 函数接受 Lambda 表达式作为谓词：

* `{ x `->` x > 0 }` 获取列表的每个元素，并仅返回那些为正数的元素。
* `{ x `->` x < 0 }` 获取列表的每个元素，并仅返回那些为负数的元素。

此示例演示了将 Lambda 表达式传递给函数的两种方式：

* 对于正数，该示例将 Lambda 表达式直接添加到 `.filter()` 函数中。
* 对于负数，该示例将 Lambda 表达式分配给 `isNegative` 变量。 然后，`isNegative` 变量用作 `.filter()` 函数中的函数参数。 在这种情况下，你必须在 Lambda 表达式中指定函数参数 (`x`) 的类型。

:::note
如果 Lambda 表达式是唯一的函数参数，则可以删除函数括号 `()`：

```kotlin
val positives = numbers.filter { x `->` x > 0 }
```

这是一个[尾随 Lambda](#trailing-lambdas)的示例，本章稍后将对此进行更详细的讨论。

:::

另一个好的例子是使用 [`.map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) 函数来转换集合中的项目：

```kotlin
fun main() {

    val numbers = listOf(1, -2, 3, -4, 5, -6)
    val doubled = numbers.map { x `->` x * 2 }
    
    val isTripled = { x: Int `->` x * 3 }
    val tripled = numbers.map(isTripled)
    
    println(doubled)
    // [2, -4, 6, -8, 10, -12]
    println(tripled)
    // [3, -6, 9, -12, 15, -18]

}
```

`.map()` 函数接受 Lambda 表达式作为转换函数：

* `{ x `->` x * 2 }` 获取列表的每个元素，并返回该元素乘以 2。
* `{ x `->` x * 3 }` 获取列表的每个元素，并返回该元素乘以 3。

### 函数类型

在你从函数返回 Lambda 表达式之前，首先需要了解**函数类型**。

你已经了解了基本类型，但函数本身也有类型。 Kotlin 的类型推断可以从参数类型推断函数的类型。 但是，有时你可能需要显式指定函数类型。 编译器需要函数类型，以便它知道该函数允许和不允许什么。

函数类型的语法具有：

* 每个参数的类型都写在括号 `()` 内，并用逗号 `,` 分隔。
* 返回类型写在 `->` 之后。

例如：`(String) `->` String` 或 `(Int, Int) `->` Int`。

如果定义了 `upperCaseString()` 的函数类型，则 Lambda 表达式如下所示：

```kotlin
val upperCaseString: (String) `->` String = { text `->` text.uppercase() }

fun main() {
    println(upperCaseString("hello"))
    // HELLO
}
```

如果你的 Lambda 表达式没有参数，则括号 `()` 留空。 例如：`() `->` Unit`

你必须在 Lambda 表达式中或作为函数类型声明参数和返回类型。 否则，编译器将无法知道你的 Lambda 表达式是什么类型。

例如，以下代码不起作用：

`val upperCaseString = { str `->` str.uppercase() }`

:::

### 从函数返回

可以从函数返回 Lambda 表达式。 为了让编译器理解返回的 Lambda 表达式的类型，你必须声明函数类型。

在以下示例中，`toSeconds()` 函数的函数类型为 `(Int) `->` Int`，因为它始终返回一个 Lambda 表达式，该表达式采用 `Int` 类型的参数并返回一个 `Int` 值。

此示例使用 `when` 表达式来确定在调用 `toSeconds()` 时返回哪个 Lambda 表达式：

```kotlin
fun toSeconds(time: String): (Int) `->` Int = when (time) {
    "hour" `->` { value `->` value * 60 * 60 }
    "minute" `->` { value `->` value * 60 }
    "second" `->` { value `->` value }
    else `->` { value `->` value }
}

fun main() {
    val timesInMinutes = listOf(2, 10, 15, 1)
    val min2sec = toSeconds("minute")
    val totalTimeInSeconds = timesInMinutes.map(min2sec).sum()
    println("Total time is $totalTimeInSeconds secs")
    // Total time is 1680 secs
}
```

### 单独调用

可以通过在花括号 `{}` 后添加括号 `()` 并在括号内包含任何参数来单独调用 Lambda 表达式：

```kotlin
fun main() {

    println({ text: String `->` text.uppercase() }("hello"))
    // HELLO

}
```

### 尾随 Lambda

正如你已经看到的，如果 Lambda 表达式是唯一的函数参数，则可以删除函数括号 `()`。 如果 Lambda 表达式作为函数的最后一个参数传递，则表达式可以写在函数括号 `()` 之外。 在这两种情况下，此语法都称为**尾随 Lambda**。

例如，[`.fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/fold.html) 函数接受一个初始值和一个操作：

```kotlin
fun main() {

    // 初始值为零。
    // 该操作将初始值与列表中每个项目累积求和。
    println(listOf(1, 2, 3).fold(0, { x, item `->` x + item })) // 6

    // 或者，以尾随 Lambda 的形式
    println(listOf(1, 2, 3).fold(0) { x, item `->` x + item })  // 6

}
```

有关 Lambda 表达式的更多信息，请参见 [Lambda 表达式和匿名函数](lambdas#lambda-expressions-and-anonymous-functions)。

我们教程的下一步是学习 Kotlin 中的 [类](kotlin-tour-classes)。

## Lambda 表达式练习

### 练习 1

你有一个 Web 服务支持的操作列表、所有请求的通用前缀和特定资源的 ID。
要请求对 ID 为 5 的资源执行操作 `title`，你需要创建以下 URL：`https://example.com/book-info/5/title`。
使用 Lambda 表达式从操作列表中创建 URL 列表。

|---|---|
```kotlin
fun main() {
    val actions = listOf("title", "year", "author")
    val prefix = "https://example.com/book-info"
    val id = 5
    val urls = // 在这里编写你的代码
    println(urls)
}
```

|---|---|
```kotlin
fun main() {
    val actions = listOf("title", "year", "author")
    val prefix = "https://example.com/book-info"
    val id = 5
    val urls = actions.map { action `->` "$prefix/$id/$action" }
    println(urls)
}
```

### 练习 2

编写一个函数，该函数接受一个 `Int` 值和一个操作（类型为 `() `->` Unit` 的函数），然后将该操作重复给定的次数。 然后使用此函数打印 “Hello” 5 次。

|---|---|
```kotlin
fun repeatN(n: Int, action: () `->` Unit) {
    // 在这里编写你的代码
}

fun main() {
    // 在这里编写你的代码
}
```

|---|---|
```kotlin
fun repeatN(n: Int, action: () `->` Unit) {
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

## 下一步

[类](kotlin-tour-classes)