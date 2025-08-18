[//]: # (title: 密封类和接口)

_密封（Sealed）_ 类和接口提供对类层次结构的受控继承。密封类的所有直接子类在编译期是已知的。在密封类定义所在的模块和包之外，不能出现其他子类。同样的逻辑也适用于密封接口及其实现：一旦包含密封接口的模块被编译，就不能创建新的实现。

> 直接子类是直接从其超类继承的类。
>
> 间接子类是从其超类下多于一层的类继承的类。
>
{style="note"}

当你将密封类和接口与 `when` 表达式结合使用时，可以覆盖所有可能的子类的行为，并确保不会创建新的子类来对你的代码产生不利影响。

密封类最适用于以下场景：

*   **期望限制类继承：** 你有一个预定义、有限的子类集合，它们扩展自某个类，并且所有这些子类都在编译期已知。
*   **需要类型安全设计：** 在你的项目中，安全性和模式匹配至关重要。特别是对于状态管理或处理复杂条件逻辑。例如，请查看[将密封类与 when 表达式结合使用](#use-sealed-classes-with-when-expression)。
*   **处理封闭 API：** 你希望为库提供健壮且可维护的公共 API，以确保第三方客户端按预期使用这些 API。

有关更详细的实际应用，请参见[用例场景](#use-case-scenarios)。

> Java 15 引入了[一个类似的概念](https://docs.oracle.com/en/java/javase/15/language/sealed-classes-and-interfaces.html#GUID-0C709461-CC33-419A-82BF-61461336E65F)，其中密封类使用 `sealed` 关键字和 `permits` 子句来定义受限的层次结构。
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

这个例子可以表示一个库的 API，其中包含错误类，允许库用户处理库可能抛出的错误。如果此类错误类的层次结构包含在公共 API 中可见的接口或抽象类，那么没有任何东西能阻止其他开发者在客户端代码中实现或扩展它们。由于库不知道外部声明的错误，它无法与自己的类保持一致地处理它们。然而，通过**密封**的错误类层次结构，库作者可以确信他们了解所有可能的错误类型，并且以后不会出现其他错误类型。

该示例的层次结构如下所示：

![密封类和接口的层次结构图示](sealed-classes-interfaces.svg){width=700}

### 构造函数

密封类本身始终是[抽象类](classes.md#abstract-classes)，因此不能直接实例化。但是，它可能包含或继承构造函数。这些构造函数并非用于创建密封类本身的实例，而是用于其子类。请看以下示例，其中有一个名为 `Error` 的密封类及其几个子类，我们对其进行实例化：

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

你可以在密封类中使用 [`enum`](enum-classes.md) 类，以使用枚举常量来表示状态并提供额外细节。每个枚举常量只存在一个**单个**实例，而密封类的子类可以有**多个**实例。
在此示例中，`sealed class Error` 及其几个子类，采用 `enum` 来表示错误严重性。
每个子类构造函数都初始化 `severity` 并可以改变其状态：

```kotlin
enum class ErrorSeverity { MINOR, MAJOR, CRITICAL }

sealed class Error(val severity: ErrorSeverity) {
    class FileReadError(val file: File): Error(ErrorSeverity.MAJOR)
    class DatabaseError(val source: DataSource): Error(ErrorSeverity.CRITICAL)
    object RuntimeError : Error(ErrorSeverity.CRITICAL)
    // Additional error types can be added here
}
```

密封类的构造函数可以有以下两种[可见性](visibility-modifiers.md)之一：`protected`（默认）或 `private`：

```kotlin
sealed class IOError {
    // A sealed class constructor has protected visibility by default. It's visible inside this class and its subclasses 
    constructor() { /*...*/ }

    // Private constructor, visible inside this class only. 
    // Using a private constructor in a sealed class allows for even stricter control over instantiation, enabling specific initialization procedures within the class.
    private constructor(description: String): this() { /*...*/ }

    // This will raise an error because public and internal constructors are not allowed in sealed classes
    // public constructor(code: Int): this() {} 
}
```

## 继承

密封类和接口的直接子类必须在同一个包中声明。它们可以是顶层类，也可以嵌套在任何数量的其他具名类、具名接口或具名对象中。子类可以拥有任何[可见性](visibility-modifiers.md)，只要它们与 Kotlin 中的常规继承规则兼容。

密封类的子类必须具有合格名称。它们不能是局部或匿名对象。

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

这些限制不适用于间接子类。如果密封类的直接子类未标记为密封，则可以按照其修饰符允许的任何方式进行扩展：

```kotlin
// Sealed interface 'Error' has implementations only in the same package and module
sealed interface Error

// Sealed class 'IOError' extends 'Error' and is extendable only within the same package
sealed class IOError(): Error

// Open class 'CustomError' extends 'Error' and can be extended anywhere it's visible
open class CustomError(): Error
```

### 多平台项目中的继承

在[多平台项目](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)中还有一项继承限制：密封类的直接子类必须驻留在同一个[源代码集](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-discover-project.html#source-sets)中。这适用于没有 [expect 与 actual 修饰符](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)的密封类。

如果一个密封类在公共源代码集中声明为 `expect`，并在平台源代码集中具有 `actual` 实现，那么 `expect` 和 `actual` 版本都可以在其源代码集中拥有子类。此外，如果你使用层次结构，则可以在 `expect` 和 `actual` 声明之间的任何源代码集中创建子类。

[了解更多关于多平台项目层次结构的信息](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html)。

## 将密封类与 when 表达式结合使用

使用密封类的主要好处在于将其用于 [`when`](control-flow.md#when-expressions-and-statements) 表达式时。
`when` 表达式与密封类结合使用时，允许 Kotlin 编译器穷尽地检测是否覆盖了所有可能的情况。在这种情况下，你无需添加 `else` 子句：

```kotlin
// Sealed class and its subclasses
sealed class Error {
    class FileReadError(val file: String): Error()
    class DatabaseError(val source: String): Error()
    object RuntimeError : Error()
}

//sampleStart
// Function to log errors
fun log(e: Error) = when(e) {
    is Error.FileReadError -> println("Error while reading file ${e.file}")
    is Error.DatabaseError -> println("Error while reading from database ${e.source}")
    Error.RuntimeError -> println("Runtime error")
    // No `else` clause is required because all the cases are covered
}
//sampleEnd

// List all errors
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

> 为了减少 `when` 表达式中的重复，可以尝试上下文敏感解析（目前处于预览状态）。
> 此特性允许你在匹配密封类成员时省略类型名称，如果预期类型已知的话。
>
> 欲了解更多信息，请参见[上下文敏感解析预览](whatsnew22.md#preview-of-context-sensitive-resolution)或相关的 [KEEP 提案](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md)。
>
{style="tip"}

将密封类与 `when` 表达式结合使用时，你还可以添加守卫条件以在单个分支中包含额外的检测。
有关更多信息，请参阅[`when` 表达式中的守卫条件](control-flow.md#guard-conditions-in-when-expressions)。

> 在多平台项目中，如果你有一个密封类并在公共代码中将其 `when` 表达式作为[预期声明](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)，你仍然需要一个 `else` 分支。
> 这是因为 `actual` 平台实现的子类可能会扩展在公共代码中未知的密封类。
>
{style="note"}

## 用例场景

让我们探讨一些密封类和接口特别有用的实际场景。

### UI 应用程序中的状态管理

你可以使用密封类来表示应用程序中不同的 UI 状态。这种方法可以结构化且安全地处理 UI 更改。此示例演示了如何管理各种 UI 状态：

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

### 支付方法处理

在实际业务应用程序中，高效处理各种支付方法是常见需求。
你可以使用密封类和 `when` 表达式来实现此类业务逻辑。
通过将不同的支付方法表示为密封类的子类，它为处理事务建立了一个清晰且易于管理的结构：

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

`Payment` 是一个密封类，表示电子商务系统中的不同支付方法：`CreditCard`、`PayPal` 和 `Cash`。每个子类可以有其特定的属性，例如 `CreditCard` 的 `number` 和 `expiryDate`，以及 `PayPal` 的 `email`。

`processPayment()` 函数演示了如何处理不同的支付方法。这种方法确保所有可能的支付类型都得到考虑，并且系统对于将来添加新的支付方法保持灵活性。

### API 请求-响应处理

你可以使用密封类和密封接口来实现一个用户身份验证系统，该系统处理 API 请求和响应。
用户身份验证系统具有登录和登出功能。
`ApiRequest` 密封接口定义了特定的请求类型：用于登录的 `LoginRequest` 和用于登出操作的 `LogoutRequest`。
密封类 `ApiResponse` 封装了不同的响应场景：包含用户数据的 `UserSuccess`，表示用户不存在的 `UserNotFound`，以及表示任何失败的 `Error`。`handleRequest` 函数使用 `when` 表达式以类型安全的方式处理这些请求，而 `getUserById` 则模拟用户检索：

```kotlin
// Import necessary modules
import io.ktor.server.application.*
import io.ktor.server.resources.*

import kotlinx.serialization.*

// Define the sealed interface for API requests using Ktor resources
@Resource("api")
sealed interface ApiRequest

@Serializable
@Resource("login")
data class LoginRequest(val username: String, val password: String) : ApiRequest

@Serializable
@Resource("logout")
object LogoutRequest : ApiRequest

// Define the ApiResponse sealed class with detailed response types
sealed class ApiResponse {
    data class UserSuccess(val user: UserData) : ApiResponse()
    data object UserNotFound : ApiResponse()
    data class Error(val message: String) : ApiResponse()
}

// User data class to be used in the success response
data class UserData(val userId: String, val name: String, val email: String)

// Function to validate user credentials (for demonstration purposes)
fun isValidUser(username: String, password: String): Boolean {
    // Some validation logic (this is just a placeholder)
    return username == "validUser" && password == "validPass"
}

// Function to handle API requests with detailed responses
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
            // Assuming logout operation always succeeds for this example
            ApiResponse.UserSuccess(UserData("userId", "userName", "userEmail")) // For demonstration
        }
    }
}

// Function to simulate a getUserById call
fun getUserById(userId: String): ApiResponse {
    return if (userId == "validUserId") {
        ApiResponse.UserSuccess(UserData("validUserId", "John Doe", "john@example.com"))
    } else {
        ApiResponse.UserNotFound
    }
    // Error handling would also result in an Error response.
}

// Main function to demonstrate the usage
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