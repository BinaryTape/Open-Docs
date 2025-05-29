[//]: # (title: 异常)

异常帮助你的代码运行得更可预测，即使发生可能中断程序执行的运行时错误。
Kotlin 默认将所有异常视为_未检查的_。
未检查的异常简化了异常处理过程：你可以捕获异常，但不需要显式处理或[声明](java-to-kotlin-interop.md#checked-exceptions)它们。

> 了解更多关于 Kotlin 在与 Java、Swift 和 Objective-C 交互时如何处理异常的信息，请参阅
> [与 Java、Swift 和 Objective-C 的异常互操作性](#exception-interoperability-with-java-swift-and-objective-c) 部分。
>
{style="tip"}

使用异常主要包括两个操作：

*   **抛出异常：** 指示发生问题的时间。
*   **捕获异常：** 通过解决问题或通知开发者或应用程序用户来手动处理意外异常。

异常由
[`Exception`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/) 类的子类表示，该类是
[`Throwable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) 类的子类。有关层级结构的更多信息，请参阅 [异常层级结构](#exception-hierarchy) 部分。由于 `Exception` 是一个 [`开放类`](inheritance.md)，你可以创建[自定义异常](#create-custom-exceptions)以满足应用程序的特定需求。

## 抛出异常

你可以使用 `throw` 关键字手动抛出异常。
抛出异常表示代码中发生了意外的运行时错误。
异常是[对象](classes.md#creating-instances-of-classes)，抛出异常会创建异常类的一个实例。

你可以不带任何参数地抛出异常：

```kotlin
throw IllegalArgumentException()
```

为了更好地理解问题的根源，可以包含额外信息，例如自定义消息和原始原因：

```kotlin
val cause = IllegalStateException("Original cause: illegal state")

// Throws an IllegalArgumentException if userInput is negative
// Additionally, it shows the original cause, represented by the cause IllegalStateException
if (userInput < 0) {
    throw IllegalArgumentException("Input must be non-negative", cause)
}
```

在此示例中，当用户输入负值时，会抛出 `IllegalArgumentException`。
你可以创建自定义错误消息并保留异常的原始原因 (`cause`)，
它将包含在[堆栈跟踪](#stack-trace)中。

### 使用前提条件函数抛出异常

Kotlin 提供了使用前提条件函数自动抛出异常的其他方法。
前提条件函数包括：

| 前提条件函数            | 用例                                 | 抛出的异常                                                                                                 |
|----------------------------------|------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| [`require()`](#require-function) | 检查用户输入有效性               | [`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/)   |
| [`check()`](#check-function)     | 检查对象或变量状态有效性 | [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)         |
| [`error()`](#error-function)     | 指示非法状态或条件  | [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)         |

这些函数适用于当特定条件未满足时程序流程无法继续的情况。
这简化了你的代码并使处理这些检查变得高效。

#### require() 函数

当输入参数对函数操作至关重要，且如果这些参数无效则函数无法继续执行时，使用 [`require()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/require.html) 函数来验证输入参数。

如果 `require()` 中的条件未满足，它会抛出 [`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/)：

```kotlin
fun getIndices(count: Int): List<Int> {
    require(count >= 0) { "Count must be non-negative. You set count to $count." }
    return List(count) { it + 1 }
}

fun main() {
    // This fails with an IllegalArgumentException
    println(getIndices(-1))

    // Uncomment the line below to see a working example
    // println(getIndices(3))
    // [1, 2, 3]
}
```
{kotlin-runnable="true"}

> `require()` 函数允许编译器执行[智能转换](typecasts.md#smart-casts)。
> 成功检查后，变量会自动转换为非空类型。
> 这些函数通常用于可空性检查，以确保变量在继续执行前不为 null。例如：
>
> ```kotlin
> fun printNonNullString(str: String?) {
>     // Nullability check
>     require(str != null)
>     // After this successful check, 'str' is guaranteed to be
>     // non-null and is automatically smart cast to non-nullable String
>     println(str.length)
> }
> ```
>
{style="note"}

#### check() 函数

使用 [`check()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/check.html) 函数来验证对象或变量的状态。
如果检查失败，则表示存在需要解决的逻辑错误。

如果 `check()` 函数中指定的条件为 `false`，它会抛出 [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)：

```kotlin
fun main() {
    var someState: String? = null

    fun getStateValue(): String {

        val state = checkNotNull(someState) { "State must be set beforehand!" }
        check(state.isNotEmpty()) { "State must be non-empty!" }
        return state
    }
    // If you uncomment the line below then the program fails with IllegalStateException
    // getStateValue()

    someState = ""

    // If you uncomment the line below then the program fails with IllegalStateException
    // getStateValue()
    someState = "non-empty-state"

    // This prints "non-empty-state"
    println(getStateValue())
}
```
{kotlin-runnable="true"}

> `check()` 函数允许编译器执行[智能转换](typecasts.md#smart-casts)。
> 成功检查后，变量会自动转换为非空类型。
> 这些函数通常用于可空性检查，以确保变量在继续执行前不为 null。例如：
>
> ```kotlin
> fun printNonNullString(str: String?) {
>     // Nullability check
>     check(str != null)
>     // After this successful check, 'str' is guaranteed to be
>     // non-null and is automatically smart cast to non-nullable String
>     println(str.length)
> }
> ```
>
{style="note"}

#### error() 函数

[`error()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/error.html) 函数用于指示代码中逻辑上不应发生的非法状态或条件。
它适用于你希望在代码中故意抛出异常的场景，例如当代码遇到
意外状态时。
此函数在 `when` 表达式中特别有用，提供了一种处理逻辑上不应发生的情况的清晰方法。

在以下示例中，`error()` 函数用于处理未定义的用户角色。
如果角色不是预定义的角色之一，则会抛出 [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)：

```kotlin
class User(val name: String, val role: String)

fun processUserRole(user: User) {
    when (user.role) {
        "admin" -> println("${user.name} is an admin.")
        "editor" -> println("${user.name} is an editor.")
        "viewer" -> println("${user.name} is a viewer.")
        else -> error("Undefined role: ${user.role}")
    }
}

fun main() {
    // This works as expected
    val user1 = User("Alice", "admin")
    processUserRole(user1)
    // Alice is an admin.

    // This throws an IllegalStateException
    val user2 = User("Bob", "guest")
    processUserRole(user2)
}
```
{kotlin-runnable="true"}

## 使用 try-catch 代码块处理异常

当抛出异常时，它会中断程序的正常执行。
你可以使用 `try` 和 `catch` 关键字优雅地处理异常，以保持程序的稳定。
`try` 代码块包含可能抛出异常的代码，而 `catch` 代码块则在异常发生时捕获并处理它。
异常由第一个匹配其特定类型或异常的[超类](inheritance.md)的 `catch` 代码块捕获。

以下是如何一起使用 `try` 和 `catch` 关键字：

```kotlin
try {
    // Code that may throw an exception
} catch (e: SomeException) {
    // Code for handling the exception
}
```

将 `try-catch` 作为表达式使用是一种常见方法，这样它可以从 `try` 代码块或 `catch` 代码块返回一个值：

```kotlin
fun main() {
    val num: Int = try {

        // If count() completes successfully, its return value is assigned to num
        count()

    } catch (e: ArithmeticException) {

        // If count() throws an exception, the catch block returns -1,
        // which is assigned to num
        -1
    }
    println("Result: $num")
}

// Simulates a function that might throw ArithmeticException
fun count(): Int {

    // Change this value to return a different value to num
    val a = 0

    return 10 / a
}
```
{kotlin-runnable="true"}


你可以为同一个 `try` 代码块使用多个 `catch` 处理程序。
你可以根据需要添加任意数量的 `catch` 代码块来分别处理不同的异常。
当你拥有多个 `catch` 代码块时，重要的是按照从最具体到最不具体的异常顺序排列它们，遵循代码中自上而下的顺序。
这种排序与程序的执行流程一致。

考虑这个使用[自定义异常](#create-custom-exceptions)的示例：

```kotlin
open class WithdrawalException(message: String) : Exception(message)
class InsufficientFundsException(message: String) : WithdrawalException(message)

fun processWithdrawal(amount: Double, availableFunds: Double) {
    if (amount > availableFunds) {
        throw InsufficientFundsException("Insufficient funds for the withdrawal.")
    }
    if (amount < 1 || amount % 1 != 0.0) {
        throw WithdrawalException("Invalid withdrawal amount.")
    }
    println("Withdrawal processed")
}

fun main() {
    val availableFunds = 500.0

    // Change this value to test different scenarios
    val withdrawalAmount = 500.5

    try {
        processWithdrawal(withdrawalAmount.toDouble(), availableFunds)

    // The order of catch blocks is important!
    } catch (e: InsufficientFundsException) {
        println("Caught an InsufficientFundsException: ${e.message}")
    } catch (e: WithdrawalException) {
        println("Caught a WithdrawalException: ${e.message}")
    }
}
```
{kotlin-runnable="true"}

一个处理 `WithdrawalException` 的通用 catch 块会捕获其类型的所有异常，包括像 `InsufficientFundsException` 这样的特定异常，除非它们被更具体的 catch 块提前捕获。

### finally 代码块

`finally` 代码块包含始终执行的代码，无论 `try` 代码块是成功完成还是抛出异常。
通过 `finally` 代码块，你可以在 `try` 和 `catch` 代码块执行后清理代码。
这在处理文件或网络连接等资源时尤其重要，因为 `finally` 保证它们被正确关闭或释放。

以下是你通常如何一起使用 `try-catch-finally` 代码块：

```kotlin
try {
    // Code that may throw an exception
}
catch (e: YourException) {
    // Exception handler
}
finally {
    // Code that is always executed
}
```

`try` 表达式的返回值由 `try` 或 `catch` 代码块中最后执行的表达式确定。
如果没有发生异常，结果来自 `try` 代码块；如果处理了异常，则来自 `catch` 代码块。
`finally` 代码块总是执行，但它不会改变 `try-catch` 代码块的结果。

让我们看一个示例来演示：

```kotlin
fun divideOrNull(a: Int): Int {

    // The try block is always executed
    // An exception here (division by zero) causes an immediate jump to the catch block
    try {
        val b = 44 / a
        println("try block: Executing division: $b")
        return b
    }

    // The catch block is executed due to the ArithmeticException (division by zero if a ==0)
    catch (e: ArithmeticException) {
        println("catch block: Encountered ArithmeticException $e")
        return -1
    }
    finally {
        println("finally block: The finally block is always executed")
    }
}

fun main() {

    // Change this value to get a different result. An ArithmeticException will return: -1
    divideOrNull(0)
}
```
{kotlin-runnable="true"}

> 在 Kotlin 中，管理实现 [`AutoClosable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-auto-closeable/) 接口的资源（例如文件流 `FileInputStream` 或 `FileOutputStream`）的惯用方法是使用 [`.use()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/use.html) 函数。
> 此函数在代码块完成时自动关闭资源，无论是否
> 抛出异常，从而无需使用 `finally` 代码块。
> 因此，Kotlin 不需要像 [Java 的 try-with-resources](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html) 那样的特殊语法来进行资源管理。
>
> ```kotlin
> FileWriter("test.txt").use { writer ->
> writer.write("some text")
> // After this block, the .use function automatically calls writer.close(), similar to a finally block
> }
> ```
>
{style="note"}

如果你的代码需要在不处理异常的情况下进行资源清理，你也可以只使用 `try` 和 `finally` 代码块，而不使用 `catch` 代码块：

```kotlin
class MockResource {
    fun use() {
        println("Resource being used")
        // Simulate a resource being used
        // This throws an ArithmeticException if division by zero occurs
        val result = 100 / 0

        // This line is not executed if an exception is thrown
        println("Result: $result")
    }

    fun close() {
        println("Resource closed")
    }
}

fun main() {
    val resource = MockResource()
//sampleStart
    try {

        // Attempts to use the resource
        resource.use()

    } finally {

        // Ensures that the resource is always closed, even if an exception occurs
        resource.close()
    }

    // This line is not printed if an exception is thrown
    println("End of the program")
//sampleEnd
}
```
{kotlin-runnable="true"}

如你所见，`finally` 代码块保证资源被关闭，无论是否发生异常。

在 Kotlin 中，你可以根据具体需求灵活地只使用 `catch` 代码块、只使用 `finally` 代码块，或者两者都用，但 `try` 代码块必须至少伴随一个 `catch` 代码块或一个 `finally` 代码块。

## 创建自定义异常

在 Kotlin 中，你可以通过创建扩展内置 `Exception` 类的类来定义自定义异常。
这允许你创建更具体的错误类型，以适应应用程序的需求。

要创建一个自定义异常，你可以定义一个扩展 `Exception` 的类：

```kotlin
class MyException: Exception("My message")
```

在此示例中，有一个默认错误消息“My message”，但如果你愿意，也可以将其留空。

> Kotlin 中的异常是状态对象 (stateful objects)，携带与其创建上下文相关的特定信息，称为[堆栈跟踪](#stack-trace)。
> 避免使用[对象声明](object-declarations.md#object-declarations-overview)创建异常。
> 相反，每次需要时都创建一个新的异常实例。
> 这样，你可以确保异常的状态准确反映特定上下文。
>
{style="tip"}

自定义异常也可以是任何预先存在的异常子类的子类，例如 `ArithmeticException` 子类：

```kotlin
class NumberTooLargeException: ArithmeticException("My message")
```

> 如果你想创建自定义异常的子类，必须将父类声明为 `open`
> 因为[类默认是 final 的](inheritance.md)，否则无法被子类化。
>
> 例如：
>
> ```kotlin
> // Declares a custom exception as an open class, making it subclassable
> open class MyCustomException(message: String): Exception(message)
>
> // Creates a subclass of the custom exception
> class SpecificCustomException: MyCustomException("Specific error message")
> ```
>
{style="note"}

自定义异常的行为与内置异常完全相同。你可以使用 `throw` 关键字抛出它们，
并使用 `try-catch-finally` 代码块处理它们。让我们看一个示例来演示：

```kotlin
class NegativeNumberException: Exception("Parameter is less than zero.")
class NonNegativeNumberException: Exception("Parameter is a non-negative number.")

fun myFunction(number: Int) {
    if (number < 0) throw NegativeNumberException()
    else if (number >= 0) throw NonNegativeNumberException()
}

fun main() {

    // Change the value in this function to a get a different exception
    myFunction(1)
}
```
{kotlin-runnable="true"}

在具有多种错误场景的应用程序中，
创建异常层级结构有助于使代码更清晰、更具体。
你可以通过使用[抽象类](classes.md#abstract-classes)或
[密封类](sealed-classes.md#constructors)作为通用异常特性的基础，并为详细的异常类型创建特定的
子类来实现这一点。
此外，带有可选参数的自定义异常提供了灵活性，允许使用不同的消息进行初始化，
从而实现更精细的错误处理。

让我们看一个使用密封类 `AccountException` 作为异常层级结构基础的示例，
以及其子类 `APIKeyExpiredException`，它展示了如何使用可选参数来改进异常的详细信息：

```kotlin
//sampleStart
// Creates a sealed class as the base for an exception hierarchy for account-related errors
sealed class AccountException(message: String, cause: Throwable? = null):
Exception(message, cause)

// Creates a subclass of AccountException
class InvalidAccountCredentialsException : AccountException("Invalid account credentials detected")

// Creates a subclass of AccountException, which allows the addition of custom messages and causes
class APIKeyExpiredException(message: String = "API key expired", cause: Throwable? = null)	: AccountException(message, cause)

// Change values of placeholder functions to get different results
fun areCredentialsValid(): Boolean = true
fun isAPIKeyExpired(): Boolean = true
//sampleEnd

// Validates account credentials and API key
fun validateAccount() {
    if (!areCredentialsValid()) throw InvalidAccountCredentialsException()
    if (isAPIKeyExpired()) {
        // Example of throwing APIKeyExpiredException with a specific cause
        val cause = RuntimeException("API key validation failed due to network error")
        throw APIKeyExpiredException(cause = cause)
    }
}

fun main() {
    try {
        validateAccount()
        println("Operation successful: Account credentials and API key are valid.")
    } catch (e: AccountException) {
        println("Error: ${e.message}")
        e.cause?.let { println("Caused by: ${it.message}") }
    }
}
```
{kotlin-runnable="true"}

## Nothing 类型

在 Kotlin 中，每个表达式都有一个类型。
表达式 `throw IllegalArgumentException()` 的类型是 [`Nothing`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)，这是一个内置类型，是所有其他类型的子类型，也称为[底部类型 (bottom type)](https://en.wikipedia.org/wiki/Bottom_type)。
这意味着 `Nothing` 可以在期望任何其他类型的地方用作返回类型或泛型类型，而不会导致类型错误。

`Nothing` 是 Kotlin 中的一个特殊类型，用于表示永远不会成功完成的函数或表达式，
原因要么是它们总是抛出异常，要么是进入无限循环等无休止的执行路径。
你可以使用 `Nothing` 来标记尚未实现或设计为总是抛出异常的函数，
从而向编译器和代码阅读者清楚地表明你的意图。
如果编译器在函数签名中推断出 `Nothing` 类型，它会发出警告。
显式地将 `Nothing` 定义为返回类型可以消除此警告。

此 Kotlin 代码演示了 `Nothing` 类型的使用，其中编译器将函数
调用之后的代码标记为不可达：

```kotlin
class Person(val name: String?)

fun fail(message: String): Nothing {
    throw IllegalArgumentException(message)
    // This function will never return successfully.
    // It will always throw an exception.
}

fun main() {
    // Creates an instance of Person with 'name' as null
    val person = Person(name = null)

    val s: String = person.name ?: fail("Name required")

    // 's' is guaranteed to be initialized at this point
    println(s)
}
```
{kotlin-runnable="true"}

Kotlin 的 [`TODO()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-t-o-d-o.html) 函数也使用 `Nothing` 类型，它充当占位符，以突出显示代码中需要将来实现的部分：

```kotlin
fun notImplementedFunction(): Int {
    TODO("This function is not yet implemented")
}

fun main() {
    val result = notImplementedFunction()
    // This throws a NotImplementedError
    println(result)
}
```
{kotlin-runnable="true"}

如你所见，`TODO()` 函数总是抛出一个 [`NotImplementedError`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-not-implemented-error/) 异常。

## 异常类

让我们探讨一些 Kotlin 中常见的异常类型，它们都是 [`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/) 类的子类：

*   [`ArithmeticException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-arithmetic-exception/)：当算术运算无法执行时（例如除以零），会发生此异常。

    ```kotlin
    val example = 2 / 0 // throws ArithmeticException
    ```

*   [`IndexOutOfBoundsException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-index-out-of-bounds-exception/)：抛出此异常以指示某种索引（例如数组或字符串的索引）超出范围。

    ```kotlin
    val myList = mutableListOf(1, 2, 3)
    myList.removeAt(3)  // throws IndexOutOfBoundsException
    ```

    > 为避免此异常，请使用更安全的替代方法，例如 [`getOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-null.html) 函数：
    >
    > ```kotlin
    > val myList = listOf(1, 2, 3)
    > // Returns null, instead of IndexOutOfBoundsException
    > val element = myList.getOrNull(3)
    > println("Element at index 3: $element")
    > ```
    >
    {style="note"}

*   [`NoSuchElementException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-no-such-element-exception/)：当访问特定集合中不存在的元素时，会抛出此异常。它在使用期望特定元素的方法（例如 [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 或 [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)）时发生。

    ```kotlin
    val emptyList = listOf<Int>()
    val firstElement = emptyList.first()  // throws NoSuchElementException
    ```

    > 为避免此异常，请使用更安全的替代方法，例如 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html) 函数：
    >
    > ```kotlin
    > val emptyList = listOf<Int>()
    > // Returns null, instead of NoSuchElementException
    > val firstElement = emptyList.firstOrNull()
    > println("First element in empty list: $firstElement")
    > ```
    >
    {style="note"}

*   [`NumberFormatException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-number-format-exception/)：当尝试将字符串转换为数字类型，但字符串格式不正确时，会发生此异常。

    ```kotlin
    val string = "This is not a number"
    val number = string.toInt() // throws NumberFormatException
    ```

    > 为避免此异常，请使用更安全的替代方法，例如 [`toIntOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int-or-null.html) 函数：
    >
    > ```kotlin
    > val nonNumericString = "not a number"
    > // Returns null, instead of NumberFormatException
    > val number = nonNumericString.toIntOrNull()
    > println("Converted number: $number")
    > ```
    >
    {style="note"}

*   [`NullPointerException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/)：当应用程序尝试使用值为 `null` 的对象引用时，会抛出此异常。
    尽管 Kotlin 的空安全特性显著降低了 NullPointerException 的风险，
    但它们仍然可能通过故意使用 `!!` 运算符或在与缺少
    Kotlin 空安全性的 Java 交互时发生。

    ```kotlin
    val text: String? = null
    println(text!!.length)  // throws a NullPointerException
    ```

虽然 Kotlin 中的所有异常都是未检查的，你不需要显式捕获它们，但如果需要，你仍然可以灵活地捕获它们。

### 异常层级结构

Kotlin 异常层级结构的根是 [`Throwable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) 类。
它有两个直接子类：[`Error`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-error/) 和 [`Exception`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/)：

*   `Error` 子类表示应用程序可能无法自行恢复的严重基础问题。
    这些是你通常不会尝试处理的问题，例如 [`OutOfMemoryError`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-out-of-memory-error/) 或 `StackOverflowError`。

*   `Exception` 子类用于你可能想要处理的条件。`Exception` 类型的子类型，例如 [`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/) 和 `IOException` (输入/输出异常)，
    处理应用程序中的异常事件。

![异常层级结构 - Throwable 类](throwable.svg){width=700}

`RuntimeException` 通常是由程序代码中检查不足引起的，并且可以通过编程方式预防。
Kotlin 有助于防止常见的 `RuntimeException`（如 `NullPointerException`），并为潜在的运行时错误（如除以零）提供编译时警告。
下图演示了从 `RuntimeException` 派生的子类型的层级结构：

![RuntimeException 的层级结构](runtime-exception.svg){width=700}

## 堆栈跟踪

_堆栈跟踪_是由运行时环境生成的报告，用于调试。
它显示了导致程序中特定点（尤其是发生错误或异常的地方）的函数调用序列。

让我们看一个示例，其中由于 JVM 环境中的异常，堆栈跟踪会自动打印出来：

```kotlin
fun main() {
//sampleStart
    throw ArithmeticException("This is an arithmetic exception!")
//sampleEnd
}
```
{kotlin-runnable="true"}

在 JVM 环境中运行此代码会产生以下输出：

```text
Exception in thread "main" java.lang.ArithmeticException: This is an arithmetic exception!
    at MainKt.main(Main.kt:3)
    at MainKt.main(Main.kt)
```

第一行是异常描述，其中包括：

*   异常类型：`java.lang.ArithmeticException`
*   线程：`main`
*   异常消息：`"This is an arithmetic exception!"`

异常描述之后以 `at` 开头的每一行都是堆栈跟踪。单行称为_堆栈跟踪元素_或_堆栈帧_：

*   `at MainKt.main (Main.kt:3)`：这显示了方法名称 (`MainKt.main`)以及调用该方法的源文件和行号 (`Main.kt:3`)。
*   `at MainKt.main (Main.kt)`：这显示异常发生在 `Main.kt` 文件的 `main()` 函数中。

## 与 Java、Swift 和 Objective-C 的异常互操作性

由于 Kotlin 将所有异常都视为未检查的，当从区分检查型异常和未检查型异常的语言调用此类异常时，可能会导致复杂情况。
为了解决 Kotlin 与 Java、Swift 和 Objective-C 等语言在异常处理方面的这种差异，
你可以使用 [`@Throws`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throws/) 注解。
此注解会向调用者提示可能发生的异常。
更多信息，请参阅[从 Java 调用 Kotlin](java-to-kotlin-interop.md#checked-exceptions) 和
[与 Swift/Objective-C 的互操作性](native-objc-interop.md#errors-and-exceptions)。