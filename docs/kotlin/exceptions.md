---
title: 异常
---
异常能够帮助你的代码更可预测地运行，即使在发生可能中断程序执行的运行时错误时也是如此。默认情况下，Kotlin 将所有异常视为_未检查的_（unchecked）。未检查的异常简化了异常处理流程：你可以捕获异常，但不需要显式地处理或[声明](java-to-kotlin-interop#checked-exceptions)它们。

:::note
请在[与 Java、Swift 和 Objective-C 的异常互操作性](#exception-interoperability-with-java-swift-and-objective-c)部分中，了解更多关于 Kotlin 在与 Java、Swift 和 Objective-C 交互时如何处理异常的信息。

使用异常主要包括两个动作：

* **抛出异常（Throwing exceptions）：** 指示何时发生问题。
* **捕获异常（Catching exceptions）：** 通过解决问题或通知开发者或应用程序用户，手动处理意外的异常。

异常由 [`Exception`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/) 类的子类表示，`Exception` 类又是 [`Throwable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) 类的子类。有关层级的更多信息，请参阅 [异常层级结构](#exception-hierarchy) 部分。由于 `Exception` 是一个 [`open class`](inheritance)，你可以创建[自定义异常](#create-custom-exceptions)来满足应用程序的特定需求。

## 抛出异常

你可以使用 `throw` 关键字手动抛出异常。抛出异常表示代码中发生了意外的运行时错误。异常是 [对象](classes#creating-instances-of-classes)，抛出一个异常会创建一个异常类的实例。

你可以不带任何参数地抛出一个异常：

```kotlin
throw IllegalArgumentException()
```

为了更好地理解问题的根源，可以包含额外的信息，例如自定义消息和原始原因：

```kotlin
val cause = IllegalStateException("Original cause: illegal state")

// 如果 userInput 为负数，则抛出一个 IllegalArgumentException
// 此外，它还会显示原始原因，即 cause IllegalStateException
if (userInput < 0) {
    throw IllegalArgumentException("Input must be non-negative", cause)
}
```

在这个例子中，当用户输入一个负值时，会抛出一个 `IllegalArgumentException`。你可以创建自定义的错误消息，并保留异常的原始原因 (`cause`)，这将被包含在 [堆栈跟踪](#stack-trace) 中。

### 使用前置条件函数抛出异常

Kotlin 提供了使用前置条件函数自动抛出异常的额外方式。前置条件函数包括：

| 前置条件函数                 | 使用场景                       | 抛出的异常                                                                                             |
| ---------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------ |
| [`require()`](#require-function) | 检查用户输入的有效性           | [`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/) |
| [`check()`](#check-function)     | 检查对象或变量状态的有效性   | [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)       |
| [`error()`](#error-function)     | 指示非法状态或条件             | [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)       |

这些函数适用于程序流程在未满足特定条件时无法继续的情况。这简化了你的代码，并使处理这些检查变得高效。

#### require() 函数

当输入参数对于函数的操作至关重要，并且如果这些参数无效函数无法继续时，可以使用 [`require()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/require.html) 函数来验证输入参数。

如果 `require()` 中的条件未满足，它会抛出一个 [`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/)：

```kotlin
fun getIndices(count: Int): List<Int> {
    require(count >= 0) { "Count must be non-negative. You set count to $count." }
    return List(count) { it + 1 }
}

fun main() {
    // 这将失败并抛出一个 IllegalArgumentException
    println(getIndices(-1))
    
    // 取消注释下面的行来查看一个可用的例子
    // println(getIndices(3))
    // [1, 2, 3]
}
```

`require()` 函数允许编译器执行[智能类型转换](typecasts#smart-casts)。在成功检查后，变量会自动转换为非空类型。这些函数通常用于可空性检查，以确保变量在继续之前不为空。例如：

```kotlin
fun printNonNullString(str: String?) {
    // 可空性检查
    require(str != null) 
    // 在成功检查后，保证 'str' 是非空的，并自动智能转换为非空 String
    println(str.length)
}
```

:::

#### check() 函数

使用 [`check()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/check.html) 函数来验证对象或变量的状态。如果检查失败，则表示需要解决的逻辑错误。

如果 `check()` 函数中指定的条件为 `false`，它会抛出一个 [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)：

```kotlin
fun main() {
    var someState: String? = null

    fun getStateValue(): String {

        val state = checkNotNull(someState) { "State must be set beforehand!" }
        check(state.isNotEmpty()) { "State must be non-empty!" }
        return state
    }
    // 如果你取消注释下面的行，那么程序将失败并抛出 IllegalStateException
    // getStateValue()

    someState = ""

    // 如果你取消注释下面的行，那么程序将失败并抛出 IllegalStateException
    // getStateValue() 
    someState = "non-empty-state"

    // 这将打印 "non-empty-state"
    println(getStateValue())
}
```

:::note
`check()` 函数允许编译器执行[智能类型转换](typecasts#smart-casts)。在成功检查后，变量会自动转换为非空类型。这些函数通常用于可空性检查，以确保变量在继续之前不为空。例如：

```kotlin
fun printNonNullString(str: String?) {
    // 可空性检查
    check(str != null) 
    // 在成功检查后，保证 'str' 是非空的，并自动智能转换为非空 String
    println(str.length)
}
```

:::

#### error() 函数

[`error()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/error.html) 函数用于指示代码中的非法状态或条件，这些状态或条件在逻辑上不应该发生。它适用于你想在代码中有意抛出异常的场景，例如当代码遇到意外状态时。这个函数在 `when` 表达式中特别有用，它提供了一种清晰的方式来处理逻辑上不应该发生的情况。

在以下示例中，`error()` 函数用于处理未定义的用户角色。如果角色不是预定义的角色之一，则会抛出一个 [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)：

```kotlin
class User(val name: String, val role: String)

fun processUserRole(user: User) {
    when (user.role) {
        "admin" `->` println("${user.name} is an admin.")
        "editor" `->` println("${user.name} is an editor.")
        "viewer" `->` println("${user.name} is a viewer.")
        else `->` error("Undefined role: ${user.role}")
    }
}

fun main() {
    // 这将按预期工作
    val user1 = User("Alice", "admin")
    processUserRole(user1)
    // Alice is an admin.

    // 这将抛出一个 IllegalStateException
    val user2 = User("Bob", "guest")
    processUserRole(user2)
}
```

## 使用 try-catch 块处理异常

当抛出异常时，它会中断程序的正常执行。你可以使用 `try` 和 `catch` 关键字优雅地处理异常，以保持程序的稳定。`try` 块包含可能抛出异常的代码，而 `catch` 块捕获并处理异常（如果发生）。异常由第一个与其特定类型或异常的[超类](inheritance)匹配的 `catch` 块捕获。

以下是如何一起使用 `try` 和 `catch` 关键字：

```kotlin
try {
    // 可能抛出异常的代码
} catch (e: SomeException) {
    // 用于处理异常的代码
}
```

通常的做法是将 `try-catch` 用作表达式，因此它可以从 `try` 块或 `catch` 块返回值：

```kotlin
fun main() {
    val num: Int = try {

        // 如果 count() 成功完成，它的返回值将被赋给 num
        count()
        
    } catch (e: ArithmeticException) {
        
        // 如果 count() 抛出一个异常，catch 块返回 -1，
        // 这将被赋给 num
        -1
    }
    println("Result: $num")
}

// 模拟一个可能抛出 ArithmeticException 的函数
fun count(): Int {
    
    // 更改这个值以返回不同的值给 num
    val a = 0
    
    return 10 / a
}
```

你可以为同一个 `try` 块使用多个 `catch` 处理程序。你可以根据需要添加任意数量的 `catch` 块来区分处理不同的异常。当你有多个 `catch` 块时，重要的是按照从最具体到最不具体的异常对它们进行排序，在代码中遵循从上到下的顺序。这种排序与程序的执行流程一致。

考虑这个使用[自定义异常](#create-custom-exceptions)的例子：

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

    // 更改这个值来测试不同的场景
    val withdrawalAmount = 500.5

    try {
        processWithdrawal(withdrawalAmount.toDouble(), availableFunds)

    // catch 块的顺序很重要！
    } catch (e: InsufficientFundsException) {
        println("Caught an InsufficientFundsException: ${e.message}")
    } catch (e: WithdrawalException) {
        println("Caught a WithdrawalException: ${e.message}")
    }
}
```

一个处理 `WithdrawalException` 的通用 `catch` 块会捕获其类型的所有异常，包括像 `InsufficientFundsException` 这样的特定异常，除非它们之前被更具体的 `catch` 块捕获。

### finally 块

`finally` 块包含始终执行的代码，无论 `try` 块是否成功完成或抛出异常。通过 `finally` 块，你可以在 `try` 和 `catch` 块执行后清理代码。这在使用文件或网络连接等资源时尤其重要，因为 `finally` 保证它们被正确关闭或释放。

以下是如何将 `try-catch-finally` 块一起使用的典型方式：

```kotlin
try {
    // 可能抛出异常的代码
}
catch (e: YourException) {
    // 异常处理程序
}
finally {
    // 始终执行的代码
}
```

`try` 表达式的返回值由 `try` 或 `catch` 块中最后执行的表达式确定。如果没有发生异常，结果来自 `try` 块；如果处理了异常，则来自 `catch` 块。`finally` 块始终执行，但它不会更改 `try-catch` 块的结果。

让我们看一个例子来演示：

```kotlin
fun divideOrNull(a: Int): Int {
    
    // try 块始终执行
    // 这里的异常（除以零）会导致立即跳转到 catch 块
    try {
        val b = 44 / a
        println("try block: Executing division: $b")
        return b
    }
    
    // catch 块由于 ArithmeticException（如果 a == 0 则除以零）而被执行
    catch (e: ArithmeticException) {
        println("catch block: Encountered ArithmeticException $e")
        return -1
    }
    finally {
        println("finally block: The finally block is always executed")
    }
}

fun main() {
    
    // 更改这个值以获得不同的结果。ArithmeticException 将返回：-1
    divideOrNull(0)
}
```

:::note
在 Kotlin 中，管理实现 [`AutoClosable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-auto-closeable/) 接口的资源（例如像 `FileInputStream` 或 `FileOutputStream` 这样的文件流）的惯用方式是使用 [`.use()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/use.html) 函数。此函数会在代码块完成后自动关闭资源，无论是否抛出异常，从而消除了对 `finally` 块的需求。因此，Kotlin 不需要像 [Java 的 try-with-resources](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html) 这样的特殊语法来进行资源管理。

```kotlin
FileWriter("test.txt").use { writer `->`
writer.write("some text") 
// 在此块之后，.use 函数会自动调用 writer.close()，类似于 finally 块
}
```

:::

如果你的代码需要资源清理而不处理异常，你也可以使用带有 `finally` 块的 `try`，而没有 `catch` 块：

```kotlin
class MockResource { 
    fun use() { 
        println("Resource being used") 
        // 模拟资源正在被使用
        // 如果发生除以零的情况，这将抛出一个 ArithmeticException
        val result = 100 / 0
        
        // 如果抛出异常，则不执行此行
        println("Result: $result") 
    }
    
    fun close() { 
        println("Resource closed") 
    }
}

fun main() { 
    val resource = MockResource()

    try {
        
        // 尝试使用资源
        resource.use()
        
    } finally {
        
        // 确保始终关闭资源，即使发生异常
        resource.close()
    }

    // 如果抛出异常，则不打印此行
    println("End of the program")

}
```

正如你所看到的，`finally` 块保证了资源被关闭，无论是否发生异常。

在 Kotlin 中，你可以灵活地仅使用 `catch` 块、仅使用 `finally` 块或两者都使用，具体取决于你的特定需求，但 `try` 块必须始终伴随至少一个 `catch` 块或一个 `finally` 块。

## 创建自定义异常

在 Kotlin 中，你可以通过创建扩展内置 `Exception` 类的类来定义自定义异常。这允许你创建更具体的错误类型，以满足应用程序的需求。

要创建一个自定义异常，你可以定义一个扩展 `Exception` 的类：

```kotlin
class MyException: Exception("My message")
```

在这个例子中，有一个默认的错误消息 "My message"，但如果你愿意，你可以将其留空。

:::note
Kotlin 中的异常是有状态的对象，携带特定于其创建上下文的信息，称为[堆栈跟踪](#stack-trace)。避免使用[对象声明](object-declarations#object-declarations-overview)创建异常。相反，每次需要时都创建一个异常的新实例。这样，你可以确保异常的状态准确地反映了特定的上下文。

自定义异常也可以是任何预先存在的异常子类的子类，例如 `ArithmeticException` 子类：

```kotlin
class NumberTooLargeException: ArithmeticException("My message")
```

如果要创建自定义异常的子类，则必须将父类声明为 `open`，因为[类默认是 final 的](inheritance)，否则不能被继承。

例如：

```kotlin
// 将自定义异常声明为 open 类，使其可被继承
open class MyCustomException(message: String): Exception(message)

// 创建自定义异常的子类
class SpecificCustomException: MyCustomException("Specific error message")
```

:::

自定义异常的行为与内置异常完全相同。你可以使用 `throw` 关键字抛出它们，并使用 `try-catch-finally` 块来处理它们。让我们看一个例子来演示：

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

在具有多样化错误场景的应用程序中，创建异常的层次结构可以帮助使代码更清晰和更具体。你可以通过使用[抽象类](classes#abstract-classes)或[密封类](sealed-classes#constructors)作为公共异常特性的基础，并为详细的异常类型创建特定的子类来实现这一点。此外，带有可选参数的自定义异常提供了灵活性，允许使用不同的消息进行初始化，从而实现更细粒度的错误处理。

让我们看一个使用密封类 `AccountException` 作为异常层次结构的基础的例子，以及类 `APIKeyExpiredException`，一个子类，展示了使用可选参数来改进异常细节的用法：

```kotlin

// 创建一个抽象类，作为帐户相关错误的异常层次结构的基础
sealed class AccountException(message: String, cause: Throwable? = null):
Exception(message, cause)

// 创建 AccountException 的子类
class InvalidAccountCredentialsException : AccountException("Invalid account credentials detected")

// 创建 AccountException 的子类，该子类允许添加自定义消息和原因
class APIKeyExpiredException(message: String = "API key expired", cause: Throwable? = null)	: AccountException(message, cause)

// 更改占位符函数的值以获得不同的结果
fun areCredentialsValid(): Boolean = true
fun isAPIKeyExpired(): Boolean = true

// 验证帐户凭据和 API 密钥
fun validateAccount() {
    if (!areCredentialsValid()) throw InvalidAccountCredentialsException()
    if (isAPIKeyExpired()) {
        // 使用特定原因抛出 APIKeyExpiredException 的示例
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

## Nothing 类型

在 Kotlin 中，每个表达式都有一个类型。表达式 `throw IllegalArgumentException()` 的类型是 [`Nothing`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)，这是一种内置类型，它是所有其他类型的子类型，也称为[底部类型](https://en.wikipedia.org/wiki/Bottom_type)。这意味着 `Nothing` 可以用作返回类型或泛型类型，在需要任何其他类型的地方使用，而不会导致类型错误。

`Nothing` 是 Kotlin 中的一种特殊类型，用于表示永远无法成功完成的函数或表达式，原因要么是它们总是抛出异常，要么是进入像无限循环这样的无限执行路径。你可以使用 `Nothing` 来标记尚未实现或设计为始终抛出异常的函数，从而向编译器和代码阅读者清楚地表明你的意图。如果编译器在函数签名中推断出 `Nothing` 类型，它会警告你。显式地将 `Nothing` 定义为返回类型可以消除此警告。

以下 Kotlin 代码演示了 `Nothing` 类型的用法，其中编译器将函数调用之后的代码标记为不可达：

```kotlin
class Person(val name: String?)

fun fail(message: String): Nothing {
    throw IllegalArgumentException(message)
    // 此函数永远不会成功返回。
    // 它总是会抛出一个异常。
}

fun main() {
    // 创建一个 'name' 为 null 的 Person 实例
    val person = Person(name = null)
    
    val s: String = person.name ?: fail("Name required")

    // 此时保证 's' 已初始化
    println(s)
}
```

Kotlin 的 [`TODO()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-t-o-d-o.html) 函数也使用 `Nothing` 类型，它用作占位符，以突出显示代码中需要未来实现的区域：

```kotlin
fun notImplementedFunction(): Int {
    TODO("This function is not yet implemented")
}

fun main() {
    val result = notImplementedFunction()
    // 这将抛出一个 NotImplementedError
    println(result)
}
```

正如你所看到的，`TODO()` 函数总是抛出一个 [`NotImplementedError`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-not-implemented-error/) 异常。

## 异常类

让我们探讨一下 Kotlin 中一些常见的异常类型，它们都是 [`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/) 类的子类：

* [`ArithmeticException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-arithmetic-exception/): 当算术运算无法执行时，例如除以零，会发生此异常。

    ```kotlin
    val example = 2 / 0 // 抛出 ArithmeticException
    ```

* [`IndexOutOfBoundsException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-index-out-of-bounds-exception/): 抛出此异常是为了指示某种索引（例如数组或字符串的索引）超出范围。

    ```kotlin
    val myList = mutableListOf(1, 2, 3)
    myList.removeAt(3)  // 抛出 IndexOutOfBoundsException
    ```

    > 为了避免此异常，请使用更安全的替代方案，例如 [`getOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-null.html) 函数：
    > 
    > ```kotlin
    > val myList = listOf(1, 2, 3)
    > // 返回 null，而不是 IndexOutOfBoundsException
    > val element = myList.getOrNull(3)
    > println("Element at index 3: $element")
    > ```
    > 
    

* [`NoSuchElementException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-no-such-element-exception/): 当访问特定集合中不存在的元素时，会抛出此异常。当使用期望特定元素的方法（例如 [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 或 [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)）时，会发生此异常。

    ```kotlin
    val emptyList = listOf<Int>()
    val firstElement = emptyList.first()  // 抛出 NoSuchElementException
    ```

    > 为了避免此异常，请使用更安全的替代方案，例如 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html) 函数：
    >
    > ```kotlin
    > val emptyList = listOf<Int>()
    > // 返回 null，而不是 NoSuchElementException
    > val firstElement = emptyList.firstOrNull()
    > println("First element in empty list: $firstElement")
    > ```
    >
    

* [`NumberFormatException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-number-format-exception/): 当尝试将字符串转换为数字类型，但字符串没有适当的格式时，会发生此异常。

    ```kotlin
    val string = "This is not a number"
    val number = string.toInt() // 抛出 NumberFormatException
    ```
    
    > 为了避免此异常，请使用更安全的替代方案，例如 [`toIntOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int-or-null.html) 函数：
    >
    > ```kotlin
    > val nonNumericString = "not a number"
    > // 返回 null，而不是 NumberFormatException
    > val number = nonNumericString.toIntOrNull()
    > println("Converted number: $number")
    > ```
    >
    

* [`NullPointerException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/): 当应用程序尝试使用具有 `null` 值的对象引用时，会抛出此异常。尽管 Kotlin 的 null 安全功能大大降低了 NullPointerException 的风险，但它们仍然可能发生，原因要么是故意使用 `!!` 运算符，要么是与缺乏 Kotlin 的 null 安全性的 Java 进行交互。

    ```kotlin
    val text: String? = null
    println(text!!.length)  // 抛出一个 NullPointerException
    ```

虽然所有异常在 Kotlin 中都是未检查的，并且你不必显式地捕获它们，但你仍然可以灵活地在需要时捕获它们。

### 异常层级结构

Kotlin 异常层级结构的根是 [`Throwable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) 类。它有两个直接子类，[`Error`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-error/) 和 [`Exception`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/)：

* `Error` 子类表示应用程序可能无法自行从中恢复的严重的基本问题。这些问题通常不会尝试处理，例如 [`OutOfMemoryError`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-out-of-memory-error/) 或 `StackOverflowError`。

* `Exception` 子类用于你可能想要处理的条件。`Exception` 类型的子类型，例如 [`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/) 和 `IOException`（输入/输出异常），处理应用程序中的异常事件。

<img src="/img/throwable.svg" alt="Exception hierarchy - the Throwable class" width="700" style={{verticalAlign: 'middle'}}/>

`RuntimeException` 通常是由程序代码中检查不足引起的，可以通过编程方式防止。Kotlin 有助于防止常见的 `RuntimeExceptions`（如 `NullPointerException`），并为潜在的运行时错误（如除以零）提供编译时警告。下图演示了从 `RuntimeException` 派生的子类型层次结构：

<img src="/img/runtime-exception.svg" alt="Hierarchy of RuntimeExceptions" width="700" style={{verticalAlign: 'middle'}}/>

## 堆栈跟踪

_堆栈跟踪（stack trace）_是由运行时环境生成的报告，用于调试。它显示了导致程序中特定点的函数调用序列，尤其是在发生错误或异常的地方。

让我们看一个示例，其中由于 JVM 环境中的异常而自动打印堆栈跟踪：

```kotlin
fun main() {

    throw ArithmeticException("This is an arithmetic exception!")

}
```

在 JVM 环境中运行此代码会产生以下输出：

```text
Exception in thread "main" java.lang.ArithmeticException: This is an arithmetic exception!
    at MainKt.main(Main.kt:3)
    at MainKt.main(Main.kt)
```

第一行是异常描述，其中包括：

* 异常类型：`java.lang.ArithmeticException`
* 线程：`main` 
* 异常消息：`"This is an arithmetic exception!"`

异常描述之后以 `at` 开头的每行都是堆栈跟踪。单行称为_堆栈跟踪元素（stack trace element）_或_堆栈帧（stack frame）_：

* `at MainKt.main (Main.kt:3)`：这显示了方法名称 (`MainKt.main`) 以及调用该方法的源文件和行号 (`Main.kt:3`)。
* `at MainKt.main (Main.kt)`：这表明异常发生在 `Main.kt` 文件的 `main()` 函数中。

## 与 Java、Swift 和 Objective-C 的异常互操作性

由于 Kotlin 将所有异常视为未检查的，因此当从区分已检查和未检查异常的语言调用这些异常时，可能会导致复杂情况。为了解决 Kotlin 和 Java、Swift 和 Objective-C 等语言之间异常处理的差异，你可以使用 [`@Throws`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throws/) 注解。此注解会提醒调用者可能发生的异常。有关更多信息，请参阅 [从 Java 调用 Kotlin](java-to-kotlin-interop#checked-exceptions) 和 [与 Swift/Objective-C 的互操作性](native-objc-interop#errors-and-exceptions)。