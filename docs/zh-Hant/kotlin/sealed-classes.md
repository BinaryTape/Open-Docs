[//]: # (title: 密封類別與介面)

_密封 (Sealed)_ 類別和介面提供對類別繼承階層的受控繼承。密封類別的所有直接子類別在編譯時都已知。在定義密封類別的模組和套件之外，不能出現其他子類別。同樣的邏輯也適用於密封介面及其實作：一旦包含密封介面的模組被編譯，就無法建立新的實作。

> 直接子類別是指直接繼承其父類別的類別。
>
> 間接子類別是指從其父類別向下多個層級繼承的類別。
>
{style="note"}

當您將密封類別和介面與 `when` 表達式結合使用時，您可以涵蓋所有可能子類別的行為，並確保不會建立新的子類別來對您的程式碼造成不利影響。

密封類別最適用於以下情況：

*   **需要有限的類別繼承：** 您擁有一個預定義、有限的子類別集合，這些子類別擴展了某個類別，且所有這些子類別在編譯時都已知。
*   **需要型別安全設計：** 安全性和模式匹配在您的專案中至關重要。特別適用於狀態管理或處理複雜的條件邏輯。欲了解範例，請查看 [搭配 `when` 表達式使用密封類別](#use-sealed-classes-with-when-expression)。
*   **與封閉式 API 協同工作：** 您希望為函式庫建立穩健且可維護的公共 API，以確保第三方用戶端按預期使用這些 API。

有關更詳細的實際應用，請參閱 [使用案例情境](#use-case-scenarios)。

> Java 15 引入了 [類似的概念](https://docs.oracle.com/en/java/javase/15/language/sealed-classes-and-interfaces.html#GUID-0C709461-CC33-419A-82BF-61461336E65F)，其中密封類別使用 `sealed` 關鍵字和 `permits` 子句來定義受限的階層。
>
{style="tip"}

## 宣告密封類別或介面

要宣告密封類別或介面，請使用 `sealed` 修飾符：

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

此範例可能代表一個函式庫的 API，其中包含錯誤類別，以便函式庫使用者處理其可能拋出的錯誤。如果此類錯誤類別的階層包含在公共 API 中可見的介面或抽象類別，那麼沒有什麼可以阻止其他開發人員在用戶端程式碼中實作或擴展它們。由於該函式庫不知道在其外部宣告的錯誤，因此它無法與自己的類別保持一致地處理它們。然而，有了**密封**的錯誤類別階層，函式庫作者可以確保他們知道所有可能的錯誤型別，並且其他錯誤型別不會在之後出現。

此範例的階層如下所示：

![密封類別與介面階層圖](sealed-classes-interfaces.svg){width=700}

### 建構子

密封類別本身永遠是 [抽象類別](classes.md#abstract-classes)，因此不能直接實例化。然而，它可能包含或繼承建構子。這些建構子並非用於建立密封類別本身的實例，而是用於其子類別。請考慮以下範例，其中包含一個名為 `Error` 的密封類別及其幾個子類別，我們對其進行實例化：

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

您可以在密封類別中使用 [`enum`](enum-classes.md) 類別，以使用列舉常數來表示狀態並提供額外細節。每個列舉常數僅作為**單一**實例存在，而密封類別的子類別可能有多個實例。在此範例中，`sealed class Error` 及其幾個子類別，採用一個 `enum` 來表示錯誤嚴重性。每個子類別建構子會初始化 `severity` 並可以改變其狀態：

```kotlin
enum class ErrorSeverity { MINOR, MAJOR, CRITICAL }

sealed class Error(val severity: ErrorSeverity) {
    class FileReadError(val file: File): Error(ErrorSeverity.MAJOR)
    class DatabaseError(val source: DataSource): Error(ErrorSeverity.CRITICAL)
    object RuntimeError : Error(ErrorSeverity.CRITICAL)
    // Additional error types can be added here
}
```

密封類別的建構子可以有兩種 [可見性](visibility-modifiers.md)：`protected`（預設）或 `private`：

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

## 繼承

密封類別和介面的直接子類別必須在相同的套件中宣告。它們可以是頂層 (top-level) 或巢狀 (nested) 於任意數量的其他具名類別、具名介面或具名物件內部。子類別可以有任何 [可見性](visibility-modifiers.md)，只要它們與 Kotlin 中正常的繼承規則相容即可。

密封類別的子類別必須具有適當的限定名稱。它們不能是局部物件 (local objects) 或匿名物件 (anonymous objects)。

> `enum` 類別不能擴展密封類別或任何其他類別。但是，它們可以實作密封介面：
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

這些限制不適用於間接子類別。如果密封類別的直接子類別未標記為密封，則可以以其修飾符允許的任何方式進行擴展：

```kotlin
// Sealed interface 'Error' has implementations only in the same package and module
sealed interface Error

// Sealed class 'IOError' extends 'Error' and is extendable only within the same package
sealed class IOError(): Error

// Open class 'CustomError' extends 'Error' and can be extended anywhere it's visible
open class CustomError(): Error
```

### 多平台專案中的繼承

在 [多平台專案](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html) 中還有一個繼承限制：密封類別的直接子類別必須位於相同的 [原始碼集 (source set)](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-discover-project.html#source-sets) 中。這適用於沒有 [expect 與 actual 修飾符](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html) 的密封類別。

如果一個密封類別在通用原始碼集中宣告為 `expect`，並且在平台原始碼集中有 `actual` 實作，則 `expect` 和 `actual` 版本都可以在其原始碼集中擁有子類別。此外，如果您使用階層結構，您可以在 `expect` 和 `actual` 宣告之間的任何原始碼集中建立子類別。

[深入了解多平台專案的階層結構](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html)。

## 搭配 `when` 表達式使用密封類別

使用密封類別的主要好處在於將它們用於 [`when`](control-flow.md#when-expressions-and-statements) 表達式時。搭配密封類別使用的 `when` 表達式，允許 Kotlin 編譯器詳盡檢查所有可能情況是否都已涵蓋。在這種情況下，您不需要添加 `else` 子句：

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

當使用密封類別與 `when` 表達式時，您還可以添加防護條件 (guard conditions) 以在單一分支中包含額外的檢查。更多資訊請參閱 [`when` 表達式中的防護條件](control-flow.md#guard-conditions-in-when-expressions)。

> 在多平台專案中，如果您有一個密封類別，其 `when` 表達式作為通用程式碼中的 [預期宣告](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)，您仍然需要一個 `else` 分支。這是因為 `actual` 平台實作的子類別可能會擴展通用程式碼中未知的密封類別。
>
{style="note"}

## 使用案例情境

讓我們探討一些密封類別和介面特別有用的實際情境。

### UI 應用程式中的狀態管理

您可以使用密封類別來表示應用程式中不同的 UI 狀態。這種方法允許結構化和安全地處理 UI 變更。此範例演示如何管理各種 UI 狀態：

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

### 支付方式處理

在實際業務應用程式中，有效率地處理各種支付方式是常見的需求。您可以使用密封類別和 `when` 表達式來實作此類業務邏輯。透過將不同的支付方式表示為密封類別的子類別，它為處理交易建立了清晰且易於管理的結構：

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

`Payment` 是一個密封類別，代表電子商務系統中不同的支付方式：`CreditCard`、`PayPal` 和 `Cash`。每個子類別都可以有其特定的屬性，例如 `CreditCard` 的 `number` 和 `expiryDate`，以及 `PayPal` 的 `email`。

`processPayment()` 函式演示了如何處理不同的支付方式。這種方法確保考慮了所有可能的支付類型，並且系統對於未來添加新的支付方式保持靈活。

### API 請求-回應處理

您可以使用密封類別和密封介面來實作處理 API 請求和回應的使用者身份驗證系統。該使用者身份驗證系統具有登入和登出功能。`ApiRequest` 密封介面定義了特定的請求類型：`LoginRequest` 用於登入，以及 `LogoutRequest` 用於登出操作。密封類別 `ApiResponse` 封裝了不同的回應情境：`UserSuccess` 包含使用者資料，`UserNotFound` 用於不存在的使用者，以及 `Error` 用於任何失敗。`handleRequest` 函式使用 `when` 表達式以型別安全的方式處理這些請求，而 `getUserById` 則模擬使用者檢索：

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