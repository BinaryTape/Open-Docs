[//]: # (title: 异常)

异常有助于您的代码更可预测地运行，即使在可能中断程序执行的运行时错误发生时。
Kotlin 默认将所有异常视为_非受检异常_。
非受检异常简化了异常处理过程：您可以捕获异常，但无需显式处理或[声明](java-to-kotlin-interop.md#checked-exceptions)它们。

> 关于 Kotlin 如何在与 Java、Swift 和 Objective-C 交互时处理异常的更多信息，请参见
> [与 Java、Swift 和 Objective-C 的异常互操作性](#exception-interoperability-with-java-swift-and-objective-c)部分。
>
{style="tip"}

处理异常主要包含两个操作：

*   **抛出异常：** 指示何时发生问题。
*   **捕获异常：** 通过解决问题或通知开发者或应用程序用户，手动处理意外异常。

异常由 [`Exception`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/) 类的子类表示，而 [`Exception`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/) 类又是 [`Throwable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) 类的子类。关于该层次结构的更多信息，请参见[异常层次结构](#exception-hierarchy)部分。由于 `Exception` 是一个[`开放类`](inheritance.md)，您可以创建[自定义异常](#create-custom-exceptions)以适应您应用程序的特定需求。

## 抛出异常

您可以使用 `throw` 关键字手动抛出异常。
抛出异常表示代码中发生了意外的运行时错误。
异常是[对象](classes.md#creating-instances-of-classes)，抛出异常会创建异常类的一个实例。

您可以在不带任何形参的情况下抛出异常：

```kotlin
throw IllegalArgumentException()
```

为了更好地理解问题的根源，请包含额外信息，例如自定义消息和原始原因：

```kotlin
val cause = IllegalStateException("Original cause: illegal state")

// 如果 userInput 为负数，则抛出 IllegalArgumentException
// 此外，它会显示原始原因，由 cause IllegalStateException 表示
if (userInput < 0) {
    throw IllegalArgumentException("Input must be non-negative", cause)
}
```

在此示例中，当用户输入负值时，会抛出 `IllegalArgumentException`。
您可以创建自定义错误消息并保留异常的原始原因 (`cause`)，该原因将包含在[堆栈跟踪](#stack-trace)中。

### 使用前置条件函数抛出异常

Kotlin 提供了使用前置条件函数自动抛出异常的额外方式。
前置条件函数包括：

| 前置条件函数             | 用例                   | 抛出的异常                                                                                                 |
|--------------------------|------------------------|------------------------------------------------------------------------------------------------------------|
| [`require()`](#require-function) | 检测用户输入有效性     | [`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/)   |
| [`check()`](#check-function)     | 检测对象或变量状态有效性 | [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)         |
| [`error()`](#error-function)     | 指示非法状态或条件       | [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)         |

这些函数适用于程序流在不满足特定条件时无法继续的情况。
这能精简您的代码并使这些检测的处理变得高效。

#### require() 函数

使用 [`require()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/require.html) 函数来验证输入实参，当这些实参对函数的运算至关重要，且函数在实参无效时无法继续时。

如果 `require()` 中的条件不满足，它将抛出 [`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/)：

```kotlin
fun getIndices(count: Int): List<Int> {
    require(count >= 0) { "Count must be non-negative. You set count to $count." }
    return List(count) { it + 1 }
}

fun main() {
    // 这将因 IllegalArgumentException 而失败
    println(getIndices(-1))
    
    // 取消注释下面这行以查看工作示例
    // println(getIndices(3))
    // [1, 2, 3]
}
```
{kotlin-runnable="true"}

> `require()` 函数允许编译器执行[智能类型转换](typecasts.md#smart-casts)。
> 成功检测后，变量会自动转换为非空类型。
> 这些函数常用于空值检测，以确保变量在继续之前不为空。例如：
>
> ```kotlin
> fun printNonNullString(str: String?) {
>     // 空值检测
>     require(str != null) 
>     // 成功检测后，'str' 保证为
>     // 非空的，并自动智能类型转换为非空 String
>     println(str.length)
> }
> ```
>
{style="note"}

#### check() 函数

使用 [`check()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/check.html) 函数来检测对象或变量的状态有效性。
如果检测失败，则表示需要解决的逻辑错误。

如果 `check()` 函数中指定的条件为 `false`，它将抛出 [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)：

```kotlin
fun main() {
    var someState: String? = null

    fun getStateValue(): String {

        val state = checkNotNull(someState) { "State must be set beforehand!" }
        check(state.isNotEmpty()) { "State must be non-empty!" }
        return state
    }
    // 如果取消注释下面这行，程序将因 IllegalStateException 而失败
    // getStateValue()

    someState = ""

    // 如果取消注释下面这行，程序将因 IllegalStateException 而失败
    // getStateValue() 
    someState = "non-empty-state"

    // 这将打印 "non-empty-state"
    println(getStateValue())
}
```
{kotlin-runnable="true"}

> `check()` 函数允许编译器执行[智能类型转换](typecasts.md#smart-casts)。
> 成功检测后，变量会自动转换为非空类型。
> 这些函数常用于空值检测，以确保变量在继续之前不为空。例如：
>
> ```kotlin
> fun printNonNullString(str: String?) {
>     // 空值检测
>     check(str != null) 
>     // 成功检测后，'str' 保证为
>     // 非空的，并自动智能类型转换为非空 String
>     println(str.length)
> }
> ```
>
{style="note"}

#### error() 函数

[`error()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/error.html) 函数用于指示代码中逻辑上不应发生的非法状态或条件。
它适用于您想在代码中有意抛出异常的场景，例如当代码遇到意外状态时。
此函数在 `when` 表达式中特别有用，提供了一种清晰的方式来处理逻辑上不应发生的情况。

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
    // 这按预期工作
    val user1 = User("Alice", "admin")
    processUserRole(user1)
    // Alice is an admin.

    // 这将抛出 IllegalStateException
    val user2 = User("Bob", "guest")
    processUserRole(user2)
}
```
{kotlin-runnable="true"}

## 使用 try-catch 代码块处理异常

当抛出异常时，它会中断程序的正常执行。
您可以使用 `try` 和 `catch` 关键字优雅地处理异常，以保持程序稳定。
`try` 代码块包含可能抛出异常的代码，而 `catch` 代码块则在异常发生时捕获并处理该异常。
异常由第一个与其特定类型或异常的[超类](inheritance.md)匹配的 `catch` 代码块捕获。

以下是您可以如何一起使用 `try` 和 `catch` 关键字：

```kotlin
try {
    // 可能抛出异常的代码
} catch (e: SomeException) {
    // 处理异常的代码
}
```

将 `try-catch` 用作表达式是一种常见方法，这样它可以从 `try` 代码块或 `catch` 代码块返回一个值：

```kotlin
fun main() {
    val num: Int = try {

        // 如果 count() 成功完成，其返回值将被赋值给 num
        count()
        
    } catch (e: ArithmeticException) {
        
        // 如果 count() 抛出异常，catch 代码块将返回 -1，
        // 该值被赋值给 num
        -1
    }
    println("Result: $num")
}

// 模拟一个可能抛出 ArithmeticException 的函数
fun count(): Int {
    
    // 更改此值以向 num 返回不同的值
    val a = 0
    
    return 10 / a
}
```
{kotlin-runnable="true"}

您可以为同一个 `try` 代码块使用多个 `catch` 处理器。
您可以根据需要添加任意数量的 `catch` 代码块，以区分地处理不同的异常。
当您有多个 `catch` 代码块时，重要的是按照从最具体到最不具体的异常的顺序排列它们，遵循代码中从上到下的顺序。
此顺序与程序的执行流一致。

请考虑使用[自定义异常](#create-custom-exceptions)的这个示例：

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

    // 更改此值以测试不同的场景
    val withdrawalAmount = 500.5

    try {
        processWithdrawal(withdrawalAmount.toDouble(), availableFunds)

    // catch 代码块的顺序很重要！
    } catch (e: InsufficientFundsException) {
        println("Caught an InsufficientFundsException: ${e.message}")
    } catch (e: WithdrawalException) {
        println("Caught a WithdrawalException: ${e.message}")
    }
}
```
{kotlin-runnable="true"}

处理 `WithdrawalException` 的通用 `catch` 代码块会捕获其类型的所有异常，包括像 `InsufficientFundsException` 这样的特定异常，除非它们被更具体的 `catch` 代码块提前捕获。

### finally 代码块

`finally` 代码块包含始终执行的代码，无论 `try` 代码块是成功完成还是抛出异常。
通过 `finally` 代码块，您可以在 `try` 和 `catch` 代码块执行后清理代码。
这在处理文件或网络连接等资源时尤为重要，因为 `finally` 保证它们被正确关闭或释放。

以下是您通常如何一起使用 `try-catch-finally` 代码块：

```kotlin
try {
    // 可能抛出异常的代码
}
catch (e: YourException) {
    // 异常处理器
}
finally {
    // 始终执行的代码
}
```

`try` 表达式的返回值由 `try` 或 `catch` 代码块中最后执行的表达式确定。
如果没有异常发生，结果来自 `try` 代码块；如果异常被处理，则结果来自 `catch` 代码块。
`finally` 代码块始终执行，但它不改变 `try-catch` 代码块的结果。

我们来看一个示例来演示这一点：

```kotlin
fun divideOrNull(a: Int): Int {
    
    // The try block is always executed
    // 此处的异常（除以零）会导致立即跳转到 catch 代码块
    try {
        val b = 44 / a
        println("try block: Executing division: $b")
        return b
    }
    
    // catch 代码块由于 ArithmeticException（如果 a == 0 则为除以零）而执行
    catch (e: ArithmeticException) {
        println("catch block: Encountered ArithmeticException $e")
        return -1
    }
    finally {
        println("finally block: The finally block is always executed")
    }
}

fun main() {
    
    // 更改此值以获得不同的结果。ArithmeticException 将返回：-1
    divideOrNull(0)
}
```
{kotlin-runnable="true"}

> 在 Kotlin 中，管理实现 [`AutoClosable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-auto-closeable/) 接口的资源（例如 `FileInputStream` 或 `FileOutputStream` 等文件流）的惯用方式是使用 [`.use()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/use.html) 函数。
> 此函数在代码块完成时自动关闭资源，无论是否抛出异常，从而消除了 `finally` 代码块的需要。
> 因此，Kotlin 不需要像 [Java 的 try-with-resources](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html) 那样的特殊语法来管理资源。
>
> ```kotlin
> FileWriter("test.txt").use { writer ->
> writer.write("some text") 
> // 在此代码块之后，.use 函数会自动调用 writer.close()，类似于 finally 代码块
> }
> ```
>
{style="note"}

如果您的代码需要资源清理而不处理异常，您还可以将 `try` 与 `finally` 代码块一起使用，而无需 `catch` 代码块：

```kotlin
class MockResource { 
    fun use() { 
        println("Resource being used") 
        // 模拟资源正在被使用 
        // 如果发生除以零，这将抛出 ArithmeticException
        val result = 100 / 0
        
        // 如果抛出异常，此行将不执行
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
        
        // 尝试使用资源 
        resource.use()
        
    } finally {
        
        // 确保资源始终关闭，即使发生异常 
        resource.close()
    }

    // 如果抛出异常，此行将不打印
    println("End of the program")
//sampleEnd
}
```
{kotlin-runnable="true"}

如您所见，`finally` 代码块保证资源被关闭，无论是否发生异常。

在 Kotlin 中，您可以灵活地只使用 `catch` 代码块、只使用 `finally` 代码块或两者都使用，具体取决于您的特定需求，但 `try` 代码块必须始终伴随至少一个 `catch` 代码块或一个 `finally` 代码块。

## 创建自定义异常

在 Kotlin 中，您可以通过创建扩展内置 `Exception` 类的类来定义自定义异常。
这允许您创建更具体的、根据您的应用程序需求定制的错误类型。

要创建一个自定义异常，您可以定义一个扩展 `Exception` 的类：

```kotlin
class MyException: Exception("My message")
```

在此示例中，有一个默认错误消息“My message”，但如果您愿意，可以留空。

> Kotlin 中的异常是有状态对象，携带着与其创建上下文相关的特定信息，这些信息被称为[堆栈跟踪](#stack-trace)。
> 避免使用[对象声明](object-declarations.md#object-declarations-overview)创建异常。
> 相反，每次需要异常时都创建一个新的异常实例。
> 这样，您可以确保异常的状态准确反映特定上下文。
>
{style="tip"}

自定义异常也可以是任何预先存在的异常子类（例如 `ArithmeticException` 子类）的子类：

```kotlin
class NumberTooLargeException: ArithmeticException("My message")
```

> 如果您想创建自定义异常的子类，则必须将父类声明为 `open`，因为[类默认是 `final`](inheritance.md)，否则无法进行子类化。
>
> 例如：
>
> ```kotlin
> // 将自定义异常声明为一个开放类，使其可被子类化
> open class MyCustomException(message: String): Exception(message)
>
> // 创建自定义异常的子类
> class SpecificCustomException: MyCustomException("Specific error message")
> ```
>
{style="note"}

自定义异常的行为与内置异常一样。您可以使用 `throw` 关键字抛出它们，并使用 `try-catch-finally` 代码块处理它们。我们来看一个示例来演示这一点：

```kotlin
class NegativeNumberException: Exception("Parameter is less than zero.")
class NonNegativeNumberException: Exception("Parameter is a non-negative number.")

fun myFunction(number: Int) {
    if (number < 0) throw NegativeNumberException()
    else if (number >= 0) throw NonNegativeNumberException()
}

fun main() {
    
    // 更改此函数中的值以获取不同的异常
    myFunction(1)
}
```
{kotlin-runnable="true"}

在具有不同错误场景的应用程序中，创建异常层次结构有助于使代码更清晰、更具体。
您可以通过使用[抽象类](classes.md#abstract-classes)或[密封类](sealed-classes.md#constructors)作为公共异常特性的基类，并为详细的异常类型创建特定的子类来实现这一点。
此外，包含带默认值形参的自定义异常提供了灵活性，允许使用不同的消息进行初始化，从而实现更精细的错误处理。

我们来看一个示例，使用密封类 `AccountException` 作为异常层次结构的基类，以及子类 `APIKeyExpiredException`，它展示了如何使用带默认值的形参来改进异常详细信息：

```kotlin
//sampleStart
// 创建一个密封类作为账户相关错误的异常层次结构基类
sealed class AccountException(message: String, cause: Throwable? = null):
Exception(message, cause)

// 创建 AccountException 的子类
class InvalidAccountCredentialsException : AccountException("Invalid account credentials detected")

// 创建 AccountException 的子类，它允许添加自定义消息和原因
class APIKeyExpiredException(message: String = "API key expired", cause: Throwable? = null)	: AccountException(message, cause)

// 更改占位符函数的值以获得不同的结果
fun areCredentialsValid(): Boolean = true
fun isAPIKeyExpired(): Boolean = true
//sampleEnd

// 验证账户凭据和 API 密钥
fun validateAccount() {
    if (!areCredentialsValid()) throw InvalidAccountCredentialsException()
    if (isAPIKeyExpired()) {
        // 抛出带有特定原因的 APIKeyExpiredException 示例
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
表达式 `throw IllegalArgumentException()` 的类型是 [`Nothing`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)，这是一个内置类型，是所有其他类型的子类型，也称为[底部类型](https://en.wikipedia.org/wiki/Bottom_type)。
这意味着 `Nothing` 可以用作返回类型或泛型类型，在预期任何其他类型的地方使用而不会导致类型错误。

`Nothing` 是 Kotlin 中的一种特殊类型，用于表示永远不会成功完成的函数或表达式，原因可能是它们总是抛出异常或进入无限执行路径（例如无限循环）。
您可以使用 `Nothing` 来标记函数，这些函数尚未实现或设计为始终抛出异常，从而清晰地向编译器和代码读者表明您的意图。
如果编译器在函数签名中推断出 `Nothing` 类型，它将警告您。
显式将 `Nothing` 定义为返回类型可以消除此警告。

此 Kotlin 代码演示了 `Nothing` 类型的使用，其中编译器将函数调用后的代码标记为不可达：

```kotlin
class Person(val name: String?)

fun fail(message: String): Nothing {
    throw IllegalArgumentException(message)
    // 此函数将永远不会成功返回。
    // 它将始终抛出异常。
}

fun main() {
    // 创建一个 name 为 null 的 Person 实例
    val person = Person(name = null)
    
    val s: String = person.name ?: fail("Name required")

    // 此时 's' 保证已初始化
    println(s)
}
```
{kotlin-runnable="true"}

Kotlin 的 [`TODO()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-t-o-d-o.html) 函数也使用 `Nothing` 类型，它作为占位符，用于突出显示代码中需要未来实现的部分：

```kotlin
fun notImplementedFunction(): Int {
    TODO("This function is not yet implemented")
}

fun main() {
    val result = notImplementedFunction()
    // 这将抛出 NotImplementedError
    println(result)
}
```
{kotlin-runnable="true"}

如您所见，`TODO()` 函数总是抛出 [`NotImplementedError`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-not-implemented-error/) 异常。

## 异常类

让我们探讨 Kotlin 中一些常见的异常类型，它们都是 [`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/) 类的子类：

*   [`ArithmeticException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-arithmetic-exception/)：当算术操作无法执行时（例如除以零），会发生此异常。

    ```kotlin
    val example = 2 / 0 // 抛出 ArithmeticException
    ```

*   [`IndexOutOfBoundsException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-index-out-of-bounds-exception/)：当某种索引（例如数组或字符串的索引）超出区间时，会抛出此异常。

    ```kotlin
    val myList = mutableListOf(1, 2, 3)
    myList.removeAt(3)  // 抛出 IndexOutOfBoundsException
    ```

    > 为避免此异常，请使用更安全的替代方案，例如 [`getOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-null.html) 函数：
    >
    > ```kotlin
    > val myList = listOf(1, 2, 3)
    > // 返回 null，而不是 IndexOutOfBoundsException
    > val element = myList.getOrNull(3)
    > println("Element at index 3: $element")
    > ```
    >
    {style="note"}

*   [`NoSuchElementException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-no-such-element-exception/)：当访问特定集合中不存在的元素时，会抛出此异常。在使用期望特定元素的方法（例如 [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 或 [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)）时会发生此异常。

    ```kotlin
    val emptyList = listOf<Int>()
    val firstElement = emptyList.first()  // 抛出 NoSuchElementException
    ```

    > 为避免此异常，请使用更安全的替代方案，例如 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html) 函数：
    >
    > ```kotlin
    > val emptyList = listOf<Int>()
    > // 返回 null，而不是 NoSuchElementException
    > val firstElement = emptyList.firstOrNull()
    > println("First element in empty list: $firstElement")
    > ```
    >
    {style="note"}

*   [`NumberFormatException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-number-format-exception/)：当尝试将字符串转换为数值类型但字符串格式不正确时，会发生此异常。

    ```kotlin
    val string = "This is not a number"
    val number = string.toInt() // 抛出 NumberFormatException
    ```

    > 为避免此异常，请使用更安全的替代方案，例如 [`toIntOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int-or-null.html) 函数：
    >
    > ```kotlin
    > val nonNumericString = "not a number"
    > // 返回 null，而不是 NumberFormatException
    > val number = nonNumericString.toIntOrNull()
    > println("Converted number: $number")
    > ```
    >
    {style="note"}

*   [`NullPointerException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/)：当应用程序尝试使用值为 `null` 的对象引用时，会抛出此异常。
    尽管 Kotlin 的空安全特性显著降低了 NullPointerException 的风险，但它们仍然可能通过有意使用 `!!` 操作符，或在与缺乏 Kotlin 空安全的 Java 交互时发生。

    ```kotlin
    val text: String? = null
    println(text!!.length)  // 抛出 NullPointerException
    ```

虽然 Kotlin 中所有异常都是非受检的，并且您不必显式捕获它们，但如果需要，您仍然可以灵活地捕获它们。

### 异常层次结构

Kotlin 异常层次结构的根是 [`Throwable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) 类。
它有两个直接子类：[`Error`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-error/) 和 [`Exception`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/)：

*   `Error` 子类表示应用程序自身可能无法恢复的严重基本问题。这些问题通常您不会尝试处理，例如 [`OutOfMemoryError`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-out-of-memory-error/) 或 `StackOverflowError`。

*   `Exception` 子类用于您可能希望处理的条件。`Exception` 类型的子类型，例如 [`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/) 和 `IOException`（输入/输出异常），处理应用程序中的异常事件。

![Exception hierarchy - the Throwable class](throwable.svg){width=700}

`RuntimeException` 通常由程序代码中不充分的检测引起，可以通过编程方式预防。
Kotlin 有助于预防常见的 `RuntimeException`，例如 `NullPointerException`，并为潜在的运行时错误（例如除以零）提供编译期警告。
下图展示了从 `RuntimeException` 派生的子类型层次结构：

![Hierarchy of RuntimeExceptions](runtime-exception.svg){width=700}

## 堆栈跟踪

_堆栈跟踪_是由运行时环境生成的报告，用于调试。
它显示了导致程序中特定点（尤其是发生错误或异常的地方）的函数调用序列。

我们来看一个示例，其中由于 JVM 环境中的异常，堆栈跟踪会自动打印：

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

异常描述之后，每行以 `at` 开头的都是堆栈跟踪。单行被称为_堆栈跟踪元素_或_堆栈帧_：

*   `at MainKt.main (Main.kt:3)`：这显示了方法名称 (`MainKt.main`) 以及调用该方法的源文件和行号 (`Main.kt:3`)。
*   `at MainKt.main (Main.kt)`：这表示异常发生在 `Main.kt` 文件的 `main()` 函数中。

## 与 Java、Swift 和 Objective-C 的异常互操作性

由于 Kotlin 默认将所有异常视为非受检异常，当从区分受检异常和非受检异常的语言调用此类异常时，可能会导致复杂情况。
为了解决 Kotlin 与 Java、Swift 和 Objective-C 等语言之间异常处理的这种差异，您可以使用 [`@Throws`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throws/) 注解。
此注解会向调用者发出有关可能异常的警报。
关于更多信息，请参见[从 Java 调用 Kotlin](java-to-kotlin-interop.md#checked-exceptions) 和[与 Swift/Objective-C 的互操作性](native-objc-interop.md#errors-and-exceptions)。