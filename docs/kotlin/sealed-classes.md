[//]: # (title: 密封类和接口)

_密封_类和接口为你的类层次结构提供受控的继承。密封类的所有直接子类在编译时都是已知的。在定义密封类的模块和包之外，不允许出现其他子类。同样的逻辑也适用于密封接口及其实现：一旦包含密封接口的模块被编译，就无法创建新的实现。

> 直接子类是指直接继承自其超类的类。
>
> 间接子类是指从其超类继承超过一级的类。
>
{style="note"}

当你将密封类和接口与 `when` 表达式结合使用时，你可以覆盖所有可能的子类的行为，并确保不会创建新的子类来对你的代码产生不利影响。

密封类最适合以下场景：

*   **需要受限的类继承：** 你有一个预定义、有限的子类集合，它们扩展一个类，并且所有子类在编译时都是已知的。
*   **需要类型安全设计：** 在你的项目中，安全性和模式匹配至关重要。特别是在状态管理或处理复杂条件逻辑时。例如，请查看[结合 `when` 表达式使用密封类](#use-sealed-classes-with-when-expression)。
*   **处理封闭 API：** 你希望为库提供健壮且可维护的公共 API，以确保第三方客户端按预期使用这些 API。

有关更详细的实际应用，请参阅[用例场景](#use-case-scenarios)。

> Java 15 引入了[一个类似的概念](https://docs.oracle.com/en/java/javase/15/language/sealed-classes-and-interfaces.html#GUID-0C709461-CC33-419A-82BF-61461336E65F)，
> 其中密封类使用 `sealed` 关键字和 `permits` 子句来定义受限的层次结构。
>
{style="tip"}

## 声明密封类或接口

要声明密封类或接口，请使用 `sealed` 修饰符：

```kotlin
// Create a sealed interface
sealed interface Error

// Create a sealed class that implements sealed interface Error
sealed class IOError(): Error

// Define subclasses that extend sealed class 'IOError'
class FileReadError(val file: File): IOError()
class DatabaseError(val source: DataSource): IOError()

// Create a singleton object implementing the 'Error' sealed interface 
object RuntimeError : Error
```

这个例子可以表示一个库的 API，其中包含错误类，允许库用户处理可能抛出的错误。如果此类错误类的层次结构包含在公共 API 中可见的接口或抽象类，那么没有任何东西可以阻止其他开发者在客户端代码中实现或扩展它们。由于库不知道在其外部声明的错误，因此它无法与其自身的类保持一致地处理这些错误。然而，使用**密封的**错误类层次结构，库作者可以确信他们知道所有可能的错误类型，并且其他错误类型不会在以后出现。

示例的层次结构如下所示：

![Hierarchy illustration of sealed classes and interfaces](sealed-classes-interfaces.svg){width=700}

### 构造函数

密封类本身始终是[抽象类](classes.md#abstract-classes)，因此不能直接实例化。但是，它可能包含或继承构造函数。这些构造函数不是用于创建密封类本身的实例，而是用于其子类。考虑以下示例，其中有一个名为 `Error` 的密封类及其几个子类，我们实例化了它们：

```kotlin
sealed class Error(val message: String) {
    class NetworkError : Error("Network failure")
    class DatabaseError : Error("Database cannot be reached")
    class UnknownError : Error("An unknown error has occurred")
}

fun main() {
    val errors = listOf(Error.NetworkError(), Error.DatabaseError(), Error.UnknownError())
    errors.forEach { println(it.message) }
}
// Network failure 
// Database cannot be reached 
// An unknown error has occurred
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

你可以在密封类中使用 [`enum`](enum-classes.md) 类来使用枚举常量表示状态并提供额外细节。每个枚举常量仅作为**单个**实例存在，而密封类的子类可以有**多个**实例。在示例中，`sealed class Error` 及其几个子类使用 `enum` 来表示错误严重性。每个子类构造函数都初始化 `severity` 并可以改变其状态：

```kotlin
enum class ErrorSeverity { MINOR, MAJOR, CRITICAL }

sealed class Error(val severity: ErrorSeverity) {
    class FileReadError(val file: File): Error(ErrorSeverity.MAJOR)
    class DatabaseError(val source: DataSource): Error(ErrorSeverity.CRITICAL)
    object RuntimeError : Error(ErrorSeverity.CRITICAL)
    // Additional error types can be added here
}
```

密封类的构造函数可以有两种[可见性](visibility-modifiers.md)：`protected`（默认）或 `private`：

```kotlin
sealed class IOError {
    // 密封类构造函数默认为 protected 可见性。它在此类及其子类中可见
    constructor() { /*...*/ }

    // 私有构造函数，仅在此类中可见。
    // 在密封类中使用私有构造函数可以更严格地控制实例化，从而在类中启用特定的初始化过程。
    private constructor(description: String): this() { /*...*/ }

    // 这将引发错误，因为密封类中不允许使用 public 和 internal 构造函数
    // public constructor(code: Int): this() {} 
}
```

## 继承

密封类和接口的直接子类必须在同一包中声明。它们可以是顶层类，也可以嵌套在任意数量的其他命名类、命名接口或命名对象中。子类可以有任何[可见性](visibility-modifiers.md)，只要它们与 Kotlin 中的常规继承规则兼容。

密封类的子类必须具有正确的限定名。它们不能是局部对象或匿名对象。

> `enum` 类不能扩展密封类或任何其他类。但是，它们可以实现密封接口：
>
> ```kotlin
> sealed interface Error
> 
> // enum class extending the sealed interface Error
> enum class ErrorType : Error {
>     FILE_ERROR, DATABASE_ERROR
> }
>
> ```
> 
{style="note"}

这些限制不适用于间接子类。如果密封类的直接子类未标记为密封，则可以以其修饰符允许的任何方式进行扩展：

```kotlin
// 密封接口 'Error' 仅在同一包和模块中具有实现
sealed interface Error

// 密封类 'IOError' 扩展 'Error' 并且只能在同一包内扩展
sealed class IOError(): Error

// open 类 'CustomError' 扩展 'Error' 并且可以在任何可见的地方扩展
open class CustomError(): Error
```

### 多平台项目中的继承

在[多平台项目](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)中还有另一个继承限制：密封类的直接子类必须位于同一[源集](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-discover-project.html#source-sets)中。这适用于没有[预期和实际修饰符](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)的密封类。

如果一个密封类在通用源集中被声明为 `expect`，并在平台源集中有 `actual` 实现，那么 `expect` 和 `actual` 版本都可以在各自的源集中拥有子类。此外，如果你使用分层结构，你可以在 `expect` 和 `actual` 声明之间的任何源集中创建子类。

[了解有关多平台项目分层结构的更多信息](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html)。

## 结合 `when` 表达式使用密封类

使用密封类的主要好处在于将它们用在 [`when`](control-flow.md#when-expressions-and-statements) 表达式中。`when` 表达式与密封类一起使用时，允许 Kotlin 编译器穷尽地检查所有可能的案例是否都已覆盖。在这种情况下，你不需要添加 `else` 子句：

```kotlin
// Sealed class and its subclasses
sealed class Error {
    class FileReadError(val file: String): Error()
    class DatabaseError(val source: String): Error()
    object RuntimeError : Error()
}

//sampleStart
// 记录错误的函数
fun log(e: Error) = when(e) {
    is Error.FileReadError -> println("Error while reading file ${e.file}")
    is Error.DatabaseError -> println("Error while reading from database ${e.source}")
    Error.RuntimeError -> println("Runtime error")
    // 不需要 `else` 子句，因为所有情况都已覆盖
}
//sampleEnd

// 列出所有错误
fun main() {
    val errors = listOf(
        Error.FileReadError("example.txt"),
        Error.DatabaseError("usersDatabase"),
        Error.RuntimeError
    )

    errors.forEach { log(it) }
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.5"}

当结合 `when` 表达式使用密封类时，你还可以添加守卫条件 (guard conditions) 在单个分支中包含额外的检查。更多信息，请参阅[`when` 表达式中的守卫条件](control-flow.md#guard-conditions-in-when-expressions)。

> 在多平台项目中，如果你的公共代码中有一个带有 `when` 表达式的密封类作为[预期声明](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)，你仍然需要一个 `else` 分支。这是因为 `actual` 平台实现的子类可能扩展了在公共代码中未知的密封类。
>
{style="note"}

## 用例场景

让我们探讨一些密封类和接口可能特别有用的实际场景。

### UI 应用程序中的状态管理

你可以使用密封类来表示应用程序中的不同 UI 状态。这种方法允许对 UI 更改进行结构化和安全的处理。此示例演示如何管理各种 UI 状态：

```kotlin
sealed class UIState { 
    data object Loading : UIState()
    data class Success(val data: String) : UIState()
    data class Error(val exception: Exception) : UIState()
}

fun updateUI(state: UIState) { 
    when (state) {
        is UIState.Loading -> showLoadingIndicator()
        is UIState.Success -> showData(state.data)
        is UIState.Error -> showError(state.exception) 
    }
}
```

### 支付方式处理

在实际业务应用程序中，高效处理各种支付方式是一个常见需求。你可以使用密封类和 `when` 表达式来实现此类业务逻辑。通过将不同的支付方式表示为密封类的子类，它为处理事务建立了一个清晰且可管理的结构：

```kotlin
sealed class Payment {
    data class CreditCard(val number: String, val expiryDate: String) : Payment()
    data class PayPal(val email: String) : Payment()
    data object Cash : Payment()
}

fun processPayment(payment: Payment) { 
    when (payment) {
        is Payment.CreditCard -> processCreditCardPayment(payment.number, payment.expiryDate)
        is Payment.PayPal -> processPayPalPayment(payment.email)
        is Payment.Cash -> processCashPayment() 
    }
}
```

`Payment` 是一个密封类，代表电子商务系统中的不同支付方式：`CreditCard`、`PayPal` 和 `Cash`。每个子类都可以有其特定的属性，例如 `CreditCard` 的 `number` 和 `expiryDate`，以及 `PayPal` 的 `email`。

`processPayment()` 函数演示了如何处理不同的支付方式。这种方法确保所有可能的支付类型都得到考虑，并且系统在未来添加新的支付方式时保持灵活性。

### API 请求-响应处理

你可以使用密封类和密封接口来实现处理 API 请求和响应的用户认证系统。用户认证系统具有登录和注销功能。`ApiRequest` 密封接口定义了特定的请求类型：用于登录的 `LoginRequest` 和用于注销操作的 `LogoutRequest`。`ApiResponse` 密封类封装了不同的响应场景：包含用户数据的 `UserSuccess`、用于不存在用户的 `UserNotFound` 以及任何失败的 `Error`。`handleRequest` 函数使用 `when` 表达式以类型安全的方式处理这些请求，而 `getUserById` 则模拟用户检索：

```kotlin
// 导入必要的模块
import io.ktor.server.application.*
import io.ktor.server.resources.*

import kotlinx.serialization.*

// 使用 Ktor 资源定义 API 请求的密封接口
@Resource("api")
sealed interface ApiRequest

@Serializable
@Resource("login")
data class LoginRequest(val username: String, val password: String) : ApiRequest

@Serializable
@Resource("logout")
object LogoutRequest : ApiRequest

// 定义带有详细响应类型的 ApiResponse 密封类
sealed class ApiResponse {
    data class UserSuccess(val user: UserData) : ApiResponse()
    data object UserNotFound : ApiResponse()
    data class Error(val message: String) : ApiResponse()
}

// 用于成功响应的用户数据类
data class UserData(val userId: String, val name: String, val email: String)

// 验证用户凭据的函数（仅用于演示）
fun isValidUser(username: String, password: String): Boolean {
    // 一些验证逻辑（这只是一个占位符）
    return username == "validUser" && password == "validPass"
}

// 处理带有详细响应的 API 请求的函数
fun handleRequest(request: ApiRequest): ApiResponse {
    return when (request) {
        is LoginRequest -> {
            if (isValidUser(request.username, request.password)) {
                ApiResponse.UserSuccess(UserData("userId", "userName", "userEmail"))
            } else {
                ApiResponse.Error("Invalid username or password")
            }
        }
        is LogoutRequest -> {
            // 假设在此示例中注销操作总是成功
            ApiResponse.UserSuccess(UserData("userId", "userName", "userEmail")) // 仅用于演示
        }
    }
}

// 模拟 getUserById 调用的函数
fun getUserById(userId: String): ApiResponse {
    return if (userId == "validUserId") {
        ApiResponse.UserSuccess(UserData("validUserId", "John Doe", "john@example.com"))
    } else {
        ApiResponse.UserNotFound
    }
    // 错误处理也会导致 Error 响应。
}

// 演示用法的 main 函数
fun main() {
    val loginResponse = handleRequest(LoginRequest("user", "pass"))
    println(loginResponse)

    val logoutResponse = handleRequest(LogoutRequest)
    println(logoutResponse)

    val userResponse = getUserById("validUserId")
    println(userResponse)

    val userNotFoundResponse = getUserById("invalidId")
    println(userNotFoundResponse)
}