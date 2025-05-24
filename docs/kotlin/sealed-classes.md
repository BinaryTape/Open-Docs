---
title: 密封类和密封接口
---
_密封类_和接口提供了对类层级的受控继承。密封类的所有直接子类在编译时都是已知的。在定义密封类的模块和包之外，不会出现其他子类。同样的逻辑适用于密封接口及其实现：一旦具有密封接口的模块被编译，就无法创建新的实现。

:::note
直接子类是指直接从其超类继承的类。

间接子类是指从超类继承超过一级的类。

:::

当您将密封类和接口与 `when` 表达式结合使用时，您可以覆盖所有可能的子类的行为，并确保不会创建新的子类来对您的代码产生不利影响。

密封类最适合用于以下场景：

* **需要有限的类继承：** 您有一组预定义的、有限的子类来扩展一个类，所有这些子类在编译时都是已知的。
* **需要类型安全的设计：** 在您的项目中，安全性和模式匹配至关重要。特别是对于状态管理或处理复杂的条件逻辑。例如，请查看 [将密封类与 when 表达式结合使用](#use-sealed-classes-with-when-expression)。
* **使用封闭的 API：** 您希望为库提供健壮且可维护的公共 API，以确保第三方客户端按预期使用 API。

有关更详细的实际应用，请参阅 [用例场景](#use-case-scenarios)。

:::note
Java 15 引入了 [类似的概念](https://docs.oracle.com/en/java/javase/15/language/sealed-classes-and-interfaces.html#GUID-0C709461-CC33-419A-82BF-61461336E65F)，其中密封类使用 `sealed` 关键字以及 `permits` 子句来定义受限的层级结构。

## 声明密封类或接口

要声明密封类或接口，请使用 `sealed` 修饰符：

```kotlin
// 创建一个密封接口
sealed interface Error

// 创建一个实现密封接口 Error 的密封类
sealed class IOError(): Error

// 定义扩展密封类 'IOError' 的子类
class FileReadError(val file: File): IOError()
class DatabaseError(val source: DataSource): IOError()

// 创建一个实现 'Error' 密封接口的单例对象
object RuntimeError : Error
```

此示例可以表示库的 API，其中包含错误类，以使库用户能够处理可能抛出的错误。如果此类错误类的层级结构包含在公共 API 中可见的接口或抽象类，则没有任何东西可以阻止其他开发人员在客户端代码中实现或扩展它们。由于库不知道在其外部声明的错误，因此它无法以与其自身的类一致的方式处理它们。但是，通过 **密封的** 错误类层级结构，库作者可以确保他们知道所有可能的错误类型，并且以后不会出现其他错误类型。

该示例的层级结构如下所示：

<img src="/img/sealed-classes-interfaces.svg" alt="密封类和接口的层级结构图示" width="700" style={{verticalAlign: 'middle'}}/>

### 构造函数 (Constructor)

密封类本身始终是 [抽象类](classes#abstract-classes)，因此无法直接实例化。但是，它可以包含或继承构造函数 (Constructor)。这些构造函数 (Constructor) 不用于创建密封类本身的实例，而是用于其子类。考虑以下示例，其中包含一个名为 `Error` 的密封类及其几个子类，我们将对其进行实例化：

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

您可以在密封类中使用 [`enum`](enum-classes) 类，以使用枚举常量来表示状态并提供其他详细信息。每个枚举常量仅作为**单个**实例存在，而密封类的子类可能具有**多个**实例。
在该示例中，`sealed class Error` 及其几个子类使用 `enum` 来表示错误严重性。
每个子类构造函数 (Constructor) 都初始化 `severity` 并且可以更改其状态：

```kotlin
enum class ErrorSeverity { MINOR, MAJOR, CRITICAL }

sealed class Error(val severity: ErrorSeverity) {
    class FileReadError(val file: File): Error(ErrorSeverity.MAJOR)
    class DatabaseError(val source: DataSource): Error(ErrorSeverity.CRITICAL)
    object RuntimeError : Error(ErrorSeverity.CRITICAL)
    // 可以在此处添加其他错误类型
}
```

密封类的构造函数 (Constructor) 可以具有以下两种 [可见性](visibility-modifiers) 之一：`protected`（默认）或 `private`：

```kotlin
sealed class IOError {
    // 默认情况下，密封类构造函数具有受保护的可见性。它在此类及其子类中可见
    constructor() { /*...*/ }

    // 私有构造函数，仅在此类中可见。
    // 在密封类中使用私有构造函数可以对实例化进行更严格的控制，从而可以在类中实现特定的初始化过程。
    private constructor(description: String): this() { /*...*/ }

    // 这将引发错误，因为密封类中不允许使用 public 和 internal 构造函数
    // public constructor(code: Int): this() {}
}
```

## 继承

密封类和接口的直接子类必须在同一个包中声明。它们可以是顶层或嵌套在任何数量的其他命名类、命名接口或命名对象中。子类可以具有任何 [可见性](visibility-modifiers)，只要它们与 Kotlin 中的普通继承规则兼容。

密封类的子类必须具有完全限定的名称。它们不能是本地对象或匿名对象。

`enum` 类不能扩展密封类或任何其他类。但是，它们可以实现密封接口：

```kotlin
sealed interface Error

// 扩展密封接口 Error 的 enum 类
enum class ErrorType : Error {
    FILE_ERROR, DATABASE_ERROR
}

```

:::

这些限制不适用于间接子类。如果密封类的直接子类未标记为 sealed，则可以以其修饰符允许的任何方式扩展它：

```kotlin
// 密封接口 'Error' 仅在同一包和模块中具有实现
sealed interface Error

// 密封类 'IOError' 扩展 'Error'，并且只能在同一包中扩展
sealed class IOError(): Error

// 开放类 'CustomError' 扩展 'Error'，并且可以在其可见的任何地方扩展
open class CustomError(): Error
```

### 多平台项目中的继承

在 [多平台项目](multiplatform-intro) 中，还有一项继承限制：密封类的直接子类必须位于同一 [源集](multiplatform-discover-project#source-sets) 中。它适用于没有 [expected 和 actual 修饰符](multiplatform-expect-actual) 的密封类。

如果密封类在公共源集中声明为 `expect`，并且在平台源集中具有 `actual` 实现，则 `expect` 和 `actual` 版本都可以在其源集中具有子类。此外，如果您使用分层结构，则可以在 `expect` 和 `actual` 声明之间的任何源集中创建子类。

[了解有关多平台项目分层结构的更多信息](multiplatform-hierarchy)。

## 将密封类与 when 表达式结合使用

当您在 [`when`](control-flow#when-expressions-and-statements) 表达式中使用密封类时，其主要优势就体现出来了。
与密封类一起使用的 `when` 表达式允许 Kotlin 编译器彻底检查是否涵盖了所有可能的情况。
在这种情况下，您不需要添加 `else` 子句：

```kotlin
// 密封类及其子类
sealed class Error {
    class FileReadError(val file: String): Error()
    class DatabaseError(val source: String): Error()
    object RuntimeError : Error()
}

// 用于记录错误的函数
fun log(e: Error) = when(e) {
    is Error.FileReadError `->` println("Error while reading file ${e.file}")
    is Error.DatabaseError `->` println("Error while reading from database ${e.source}")
    Error.RuntimeError `->` println("Runtime error")
    // 不需要 `else` 子句，因为所有情况都已涵盖
}

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

将密封类与 `when` 表达式一起使用时，您还可以添加守卫条件 (Guard conditions)，以在单个分支中包含其他检查。
有关更多信息，请参阅 [when 表达式中的守卫条件 (Guard conditions)](control-flow#guard-conditions-in-when-expressions)。

:::note
在多平台项目中，如果您的密封类在公共代码中具有作为 [expected 声明](multiplatform-expect-actual) 的 `when` 表达式，则仍然需要 `else` 分支。
这是因为 `actual` 平台实现的子类可能会扩展公共代码中未知的密封类。

:::

## 用例场景

让我们探索一些实际场景，在这些场景中，密封类和接口可能特别有用。

### UI 应用程序中的状态管理

您可以使用密封类来表示应用程序中的不同 UI 状态。
这种方法允许对 UI 更改进行结构化和安全的处理。
此示例演示如何管理各种 UI 状态：

```kotlin
sealed class UIState {
    data object Loading : UIState()
    data class Success(val data: String) : UIState()
    data class Error(val exception: Exception) : UIState()
}

fun updateUI(state: UIState) {
    when (state) {
        is UIState.Loading `->` showLoadingIndicator()
        is UIState.Success `->` showData(state.data)
        is UIState.Error `->` showError(state.exception)
    }
}
```

### 支付方式处理

在实际的商业应用程序中，高效处理各种支付方式是一项常见要求。
您可以将密封类与 `when` 表达式结合使用来实现此类业务逻辑。
通过将不同的支付方式表示为密封类的子类，可以为处理交易建立清晰且易于管理的结构：

```kotlin
sealed class Payment {
    data class CreditCard(val number: String, val expiryDate: String) : Payment()
    data class PayPal(val email: String) : Payment()
    data object Cash : Payment()
}

fun processPayment(payment: Payment) {
    when (payment) {
        is Payment.CreditCard `->` processCreditCardPayment(payment.number, payment.expiryDate)
        is Payment.PayPal `->` processPayPalPayment(payment.email)
        is Payment.Cash `->` processCashPayment()
    }
}
```

`Payment` 是一个密封类，表示电子商务系统中的不同支付方式：`CreditCard`、`PayPal` 和 `Cash`。
每个子类都可以具有其特定的属性，例如 `CreditCard` 的 `number` 和 `expiryDate`，以及 `PayPal` 的 `email`。

`processPayment()` 函数演示了如何处理不同的支付方式。
这种方法确保考虑了所有可能的支付类型，并且该系统在未来添加新的支付方式时仍然具有灵活性。

### API 请求-响应处理

您可以使用密封类和密封接口来实现处理 API 请求和响应的用户身份验证系统。
用户身份验证系统具有登录和注销功能。
`ApiRequest` 密封接口定义了特定的请求类型：用于登录的 `LoginRequest` 和用于注销操作的 `LogoutRequest`。
密封类 `ApiResponse` 封装了不同的响应场景：包含用户数据的 `UserSuccess`，用于表示用户不存在的 `UserNotFound` 以及用于表示任何失败的 `Error`。
`handleRequest` 函数使用 `when` 表达式以类型安全的方式处理这些请求，而 `getUserById` 模拟用户检索：

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

// 定义具有详细响应类型的 ApiResponse 密封类
sealed class ApiResponse {
    data class UserSuccess(val user: UserData) : ApiResponse()
    data object UserNotFound : ApiResponse()
    data class Error(val message: String) : ApiResponse()
}

// 要在成功响应中使用的用户数据类
data class UserData(val userId: String, val name: String, val email: String)

// 用于验证用户凭据的函数（用于演示目的）
fun isValidUser(username: String, password: String): Boolean {
    // 一些验证逻辑（这只是一个占位符）
    return username == "validUser" && password == "validPass"
}

// 用于处理具有详细响应的 API 请求的函数
fun handleRequest(request: ApiRequest): ApiResponse {
    return when (request) {
        is LoginRequest `->` {
            if (isValidUser(request.username, request.password)) {
                ApiResponse.UserSuccess(UserData("userId", "userName", "userEmail"))
            } else {
                ApiResponse.Error("Invalid username or password")
            }
        }
        is LogoutRequest `->` {
            // 假设在此示例中注销操作始终成功
            ApiResponse.UserSuccess(UserData("userId", "userName", "userEmail")) // 用于演示
        }
    }
}

// 用于模拟 getUserById 调用的函数
fun getUserById(userId: String): ApiResponse {
    return if (userId == "validUserId") {
        ApiResponse.UserSuccess(UserData("validUserId", "John Doe", "john@example.com"))
    } else {
        ApiResponse.UserNotFound
    }
    // 错误处理也会导致 Error 响应。
}

// 用于演示用法的主函数
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
```