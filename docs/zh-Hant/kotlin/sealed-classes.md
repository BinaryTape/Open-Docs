[//]: # (title: 密封類與介面)

_密封_ 類與介面提供對類別階層的受控繼承。密封類的所有直接子類在編譯時期都是已知的。在定義密封類的模組和套件外部，不允許出現其他子類。同樣的邏輯也適用於密封介面及其實作：一旦包含密封介面的模組被編譯，就不能建立新的實作。

> 直接子類是指直接繼承其超類的類別。
> 
> 間接子類是指繼承自其超類多於一層的類別。
>
{style="note"}

當您將密封類與介面結合 `when` 表達式使用時，您可以涵蓋所有可能子類的行為，並確保不會建立新的子類來對您的程式碼產生不利影響。

密封類最適用於以下情境：

*   **期望有限的類別繼承：** 您有一個預定義的、有限的子類集合擴展一個類別，所有這些子類都在編譯時期已知。
*   **需要型別安全的設計：** 安全性與模式匹配在您的專案中至關重要。特別是對於狀態管理或處理複雜的條件邏輯。欲了解範例，請查閱 [將密封類與 when 表達式結合使用](#use-sealed-classes-with-when-expression)。
*   **與封閉式 API 協作：** 您希望為函式庫建立健壯且可維護的公共 API，以確保第三方客戶端按照預期使用這些 API。

欲了解更詳細的實際應用，請參閱 [使用案例場景](#use-case-scenarios)。

> Java 15 引入了 [一個類似的概念](https://docs.oracle.com/en/java/javase/15/language/sealed-classes-and-interfaces.html#GUID-0C709461-CC33-419A-82BF-61461336E65F)，其中密封類使用 `sealed` 關鍵字以及 `permits` 子句來定義受限的階層。
>
{style="tip"}

## 宣告密封類或介面

要宣告密封類或介面，請使用 `sealed` 修飾符：

```kotlin
// 建立一個密封介面
sealed interface Error

// 建立一個實作密封介面 Error 的密封類
sealed class IOError(): Error

// 定義擴展密封類 'IOError' 的子類
class FileReadError(val file: File): IOError()
class DatabaseError(val source: DataSource): IOError()

// 建立一個實作 'Error' 密封介面的單例物件 
object RuntimeError : Error
```

此範例可代表函式庫的 API，其中包含錯誤類別，以便函式庫使用者處理其可能拋出的錯誤。如果此類錯誤類別的階層包含公共 API 中可見的介面或抽象類，則沒有什麼能阻止其他開發人員在客戶端程式碼中實作或擴展它們。由於函式庫不知道其外部宣告的錯誤，因此無法與其自身類別一致地處理這些錯誤。然而，透過錯誤類別的 **密封** 階層，函式庫作者可以確定他們了解所有可能的錯誤型別，並且以後不會出現其他錯誤型別。

該範例的階層結構如下：

![密封類與介面的階層圖解](sealed-classes-interfaces.svg){width=700}

### 建構函式

密封類本身始終是 [抽象類](classes.md#abstract-classes)，因此不能直接實例化。但是，它可以包含或繼承建構函式。這些建構函式不是用於建立密封類本身的實例，而是用於其子類。考慮以下範例，其中有一個名為 `Error` 的密封類及其幾個子類，我們將其實例化：

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

您可以在密封類中包含 [`enum`](enum-classes.md) 類，以使用列舉常數來表示狀態並提供額外細節。每個列舉常數僅作為**單一**實例存在，而密封類的子類可能有多個**實例**。在此範例中，`sealed class Error` 及其幾個子類採用 `enum` 來表示錯誤嚴重性。每個子類建構函式初始化 `severity` 並可以改變其狀態：

```kotlin
enum class ErrorSeverity { MINOR, MAJOR, CRITICAL }

sealed class Error(val severity: ErrorSeverity) {
    class FileReadError(val file: File): Error(ErrorSeverity.MAJOR)
    class DatabaseError(val source: DataSource): Error(ErrorSeverity.CRITICAL)
    object RuntimeError : Error(ErrorSeverity.CRITICAL)
    // 可在此處新增其他錯誤類型
}
```

密封類的建構函式可以具有兩種 [可視性](visibility-modifiers.md) 之一：`protected`（預設）或 `private`：

```kotlin
sealed class IOError {
    // 密封類建構函式預設具有 protected 可視性。它在此類及其子類中可見 
    constructor() { /*...*/ }

    // private 建構函式，僅在此類中可見。
    // 在密封類中使用 private 建構函式可以對實例化進行更嚴格的控制，從而在類中啟用特定的初始化程序。
    private constructor(description: String): this() { /*...*/ }

    // 這將會引發錯誤，因為密封類不允許 public 和 internal 建構函式
    // public constructor(code: Int): this() {} 
}
```

## 繼承

密封類和介面的直接子類必須在相同套件中宣告。它們可以是頂層的，也可以巢狀於任何數量的其他具名類、具名介面或具名物件內部。子類可以具有任何 [可視性](visibility-modifiers.md)，只要它們與 Kotlin 中的一般繼承規則相容即可。

密封類的子類必須具有完整合格的名稱。它們不能是局部或匿名物件。

> `enum` 類別不能繼承密封類或任何其他類別。但是，它們可以實作密封介面：
>
> ```kotlin
> sealed interface Error
> 
> // 擴展密封介面 Error 的 enum 類
> enum class ErrorType : Error {
>     FILE_ERROR, DATABASE_ERROR
> }
>
> ```
> 
{style="note"}

這些限制不適用於間接子類。如果密封類的直接子類未標記為密封，則可以以其修飾符允許的任何方式擴展它：

```kotlin
// 密封介面 'Error' 僅在相同套件和模組中具有實作
sealed interface Error

// 密封類 'IOError' 擴展 'Error' 並且僅在相同套件中可擴展
sealed class IOError(): Error

// 開放類 'CustomError' 擴展 'Error' 並且可在任何可見之處擴展
open class CustomError(): Error
```

### 多平台專案中的繼承

[多平台專案](https://kotlinlang.org/docs/multiplatform/get-started.html) 中還有一個繼承限制：密封類的直接子類必須位於相同的 [來源集](https://kotlinlang.org/docs/multiplatform/multiplatform-discover-project.html#source-sets) 中。它適用於沒有 [expect 和 actual 修飾符](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html) 的密封類。

如果密封類在共同來源集中被宣告為 `expect`，並且在平台來源集中具有 `actual` 實作，則 `expect` 和 `actual` 版本都可以在其來源集中擁有子類。此外，如果您使用階層式結構，您可以在 `expect` 和 `actual` 宣告之間的任何來源集中建立子類。

[了解更多關於多平台專案的階層式結構](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html)。

## 將密封類與 when 表達式結合使用

使用密封類的主要優勢在於將它們用於 [`when`](control-flow.md#when-expressions-and-statements) 表達式時發揮作用。
與密封類一起使用的 `when` 表達式允許 Kotlin 編譯器窮盡地檢查所有可能的情況都已涵蓋。
在這種情況下，您不需要添加 `else` 子句：

```kotlin
// 密封類及其子類
sealed class Error {
    class FileReadError(val file: String): Error()
    class DatabaseError(val source: String): Error()
    object RuntimeError : Error()
}

//sampleStart
// 記錄錯誤的函式
fun log(e: Error) = when(e) {
    is Error.FileReadError -> println("Error while reading file ${e.file}")
    is Error.DatabaseError -> println("Error while reading from database ${e.source}")
    Error.RuntimeError -> println("Runtime error")
    // 不需要 `else` 子句，因為所有情況都已涵蓋
}
//sampleEnd

// 列出所有錯誤
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

> 為了減少 `when` 表達式中的重複，請嘗試上下文相關解析（目前處於預覽階段）。
> 此功能允許您在匹配密封類成員時，如果預期型別已知，則可以省略型別名稱。
>
> 欲了解更多資訊，請參閱 [上下文相關解析的預覽](whatsnew22.md#preview-of-context-sensitive-resolution) 或相關的 [KEEP 提案](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md)。
> 
{style="tip"}

當使用密封類與 `when` 表達式時，您還可以添加守護條件，以在單一分支中包含額外檢查。
欲了解更多資訊，請參閱 [when 表達式中的守護條件](control-flow.md#guard-conditions-in-when-expressions)。

> 在多平台專案中，如果您的共同程式碼中包含一個帶有 `when` 表達式作為 [expect 宣告](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html) 的密封類，您仍然需要一個 `else` 分支。
> 這是因為 `actual` 平台實作的子類可能會擴展在共同程式碼中不為已知的密封類。
>
{style="note"}

## 使用案例場景

讓我們探索一些密封類與介面特別有用的實際情境。

### UI 應用程式中的狀態管理

您可以使用密封類來表示應用程式中不同的 UI 狀態。
這種方法允許對 UI 變更進行結構化且安全的處理。
此範例演示如何管理各種 UI 狀態：

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

在實際的商業應用程式中，高效率地處理各種支付方式是一個常見的要求。
您可以將密封類與 `when` 表達式結合使用來實作此類商業邏輯。
透過將不同的支付方式表示為密封類的子類，它為處理交易建立了清晰且可管理的結構：

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

`Payment` 是一個密封類，它表示電子商務系統中的不同支付方式：`CreditCard`、`PayPal` 和 `Cash`。每個子類可以有其特定屬性，例如 `CreditCard` 的 `number` 和 `expiryDate`，以及 `PayPal` 的 `email`。

`processPayment()` 函式演示如何處理不同的支付方式。
這種方法確保所有可能的支付型別都已考慮，並且系統對於未來新增的支付方式保持彈性。

### API 請求-回應處理

您可以使用密封類和密封介面來實作一個處理 API 請求和回應的使用者驗證系統。
該使用者驗證系統具有登入和登出功能。
`ApiRequest` 密封介面定義了特定的請求型別：`LoginRequest` 用於登入，以及 `LogoutRequest` 用於登出操作。
密封類 `ApiResponse` 封裝了不同的回應情境：包含使用者資料的 `UserSuccess`、用於不存在使用者的 `UserNotFound`，以及用於任何失敗的 `Error`。`handleRequest` 函式使用 `when` 表達式以型別安全的方式處理這些請求，而 `getUserById` 模擬使用者擷取：

```kotlin
// 匯入必要模組
import io.ktor.server.application.*
import io.ktor.server.resources.*

import kotlinx.serialization.*

// 使用 Ktor 資源定義 API 請求的密封介面
@Resource("api")
sealed interface ApiRequest

@Serializable
@Resource("login")
data class LoginRequest(val username: String, val password: String) : ApiRequest

@Serializable
@Resource("logout")
object LogoutRequest : ApiRequest

// 定義具有詳細回應類型的 ApiResponse 密封類
sealed class ApiResponse {
    data class UserSuccess(val user: UserData) : ApiResponse()
    data object UserNotFound : ApiResponse()
    data class Error(val message: String) : ApiResponse()
}

// 用於成功回應的使用者資料類
data class UserData(val userId: String, val name: String, val email: String)

// 驗證使用者憑證的函式（僅用於示範）
fun isValidUser(username: String, password: String): Boolean {
    // 一些驗證邏輯（這只是一個佔位符）
    return username == "validUser" && password == "validPass"
}

// 處理具有詳細回應的 API 請求的函式
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
            // 假設在此範例中登出操作始終成功
            ApiResponse.UserSuccess(UserData("userId", "userName", "userEmail")) // 僅用於示範
        }
    }
}

// 模擬 getUserById 呼叫的函式
fun getUserById(userId: String): ApiResponse {
    return if (userId == "validUserId") {
        ApiResponse.UserSuccess(UserData("validUserId", "John Doe", "john@example.com"))
    } else {
        ApiResponse.UserNotFound
    }
    // 錯誤處理也會產生 Error 回應。
}

// 演示用法的 main 函式
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