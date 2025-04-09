---
title: 密封類別和介面
---
_密封（Sealed）_類別和介面提供了對類別層次結構的受控繼承。
密封類別的所有直接子類別在編譯時都是已知的。在定義密封類別的模組和套件之外，不會出現其他子類別。
相同的邏輯適用於密封介面及其實現：一旦編譯了具有密封介面的模組，就無法建立新的實現。

:::note
直接子類別是指直接從其父類別繼承的類別。

間接子類別是指從其父類別繼承多個層級的類別。

:::

當您將密封類別和介面與 `when` 表達式結合使用時，您可以涵蓋所有可能的子類別的行為，並確保不會建立新的子類別來對您的程式碼產生不利影響。

密封類別最適用於以下情況：

* **需要有限的類別繼承：** 您有一個預定義的、有限的子類別集合，這些子類別擴展了一個類別，並且所有這些子類別在編譯時都是已知的。
* **需要類型安全的設計：** 安全性和模式匹配在您的專案中至關重要。特別是用於狀態管理或處理複雜的條件邏輯。有關範例，請查看[將密封類別與 when 表達式一起使用](#use-sealed-classes-with-when-expression)。
* **使用封閉的 API（Application Programming Interface）：** 您希望為函式庫提供穩健且可維護的公共 API，以確保第三方客戶端按預期使用 API。

有關更詳細的實際應用，請參閱[用例場景](#use-case-scenarios)。

:::note
Java 15 引入了[類似的概念](https://docs.oracle.com/en/java/javase/15/language/sealed-classes-and-interfaces.html#GUID-0C709461-CC33-419A-82BF-61461336E65F)，
其中密封類別使用 `sealed` 關鍵字以及 `permits` 子句來定義受限的層次結構。

## 宣告一個密封類別或介面

若要宣告一個密封類別或介面，請使用 `sealed` 修飾符：

```kotlin
// 建立一個密封介面
sealed interface Error

// 建立一個實現密封介面 Error 的密封類別
sealed class IOError(): Error

// 定義擴展密封類別 'IOError' 的子類別
class FileReadError(val file: File): IOError()
class DatabaseError(val source: DataSource): IOError()

// 建立一個實現 'Error' 密封介面的單例物件
object RuntimeError : Error
```

此範例可以表示一個函式庫的 API，其中包含錯誤類別，以便函式庫使用者處理它可以拋出的錯誤。
如果此類錯誤類別的層次結構包含在公共 API 中可見的介面或抽象類別，那麼沒有任何東西可以阻止其他開發人員在客戶端程式碼中實現或擴展它們。
由於函式庫不知道在它之外宣告的錯誤，因此它無法以與自身類別一致的方式處理它們。
但是，透過 **密封 (sealed)** 的錯誤類別層次結構，函式庫作者可以確保他們知道所有可能的錯誤類型，並且以後不會出現其他錯誤類型。

範例的層次結構如下所示：

<img src="/img/sealed-classes-interfaces.svg" alt="密封類別和介面的層次結構圖示" width="700" style={{verticalAlign: 'middle'}}/>

### 建構子（Constructor）

密封類別本身始終是一個 [抽象類別](classes#abstract-classes)，因此無法直接實例化。
但是，它可以包含或繼承建構子。這些建構子不是用於建立密封類別本身的實例，而是用於其子類別。
考慮以下範例，其中有一個名為 `Error` 的密封類別及其多個子類別，我們將其進行實例化：

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

您可以在密封類別中使用 [`enum`](enum-classes) 類別，以使用枚舉常數來表示狀態並提供其他詳細資訊。
每個枚舉常數僅作為**單個**實例存在，而密封類別的子類別可能具有**多個**實例。
在此範例中，`sealed class Error` 及其多個子類別採用 `enum` 來表示錯誤嚴重性。
每個子類別建構子都會初始化 `severity` 並且可以更改其狀態：

```kotlin
enum class ErrorSeverity { MINOR, MAJOR, CRITICAL }

sealed class Error(val severity: ErrorSeverity) {
    class FileReadError(val file: File): Error(ErrorSeverity.MAJOR)
    class DatabaseError(val source: DataSource): Error(ErrorSeverity.CRITICAL)
    object RuntimeError : Error(ErrorSeverity.CRITICAL)
    // 可以在此處新增其他錯誤類型
}
```

密封類別的建構子可以具有兩種[可見性](visibility-modifiers)之一：`protected`（預設）或 `private`：

```kotlin
sealed class IOError {
    // 密封類別建構子預設具有 protected 可見性。它在此類別及其子類別中可見
    constructor() { /*...*/ }

    // Private 建構子，僅在此類別中可見。
    // 在密封類別中使用 private 建構子可以更嚴格地控制實例化，從而在類別中啟用特定的初始化程序。
    private constructor(description: String): this() { /*...*/ }

    // 這將引發錯誤，因為在密封類別中不允許使用 public 和 internal 建構子
    // public constructor(code: Int): this() {}
}
```

## 繼承（Inheritance）

密封類別和介面的直接子類別必須在同一個套件中宣告。它們可以是頂層或巢狀在任何數量的其他命名類別、命名介面或命名物件中。
子類別可以具有任何 [可見性](visibility-modifiers)，只要它們與 Kotlin 中的普通繼承規則相容即可。

密封類別的子類別必須具有適當的完整名稱。它們不能是區域或匿名物件。

`enum` 類別不能擴展密封類別或任何其他類別。但是，它們可以實現密封介面：

```kotlin
sealed interface Error

// enum class 擴展密封介面 Error
enum class ErrorType : Error {
    FILE_ERROR, DATABASE_ERROR
}

```

:::

這些限制不適用於間接子類別。如果密封類別的直接子類別未標記為密封，則可以以其修飾符允許的任何方式擴展它：

```kotlin
// 密封介面 'Error' 僅在同一個套件和模組中具有實現
sealed interface Error

// 密封類別 'IOError' 擴展 'Error'，並且只能在同一個套件中擴展
sealed class IOError(): Error

// 開放類別 'CustomError' 擴展 'Error'，並且可以在任何可見的地方擴展
open class CustomError(): Error
```

### 多平台專案中的繼承

在[多平台專案](multiplatform-intro)中還有一個繼承限制：密封類別的直接子類別必須駐留在同一個[原始碼集](multiplatform-discover-project#source-sets)中。
它適用於沒有 [expected 和 actual 修飾符](multiplatform-expect-actual)的密封類別。

如果一個密封類別在通用原始碼集中宣告為 `expect`，並且在平台原始碼集中具有 `actual` 實現，則 `expect` 和 `actual` 版本都可以在其原始碼集中具有子類別。
此外，如果您使用分層結構，則可以在 `expect` 和 `actual` 宣告之間的任何原始碼集中建立子類別。

[了解有關多平台專案分層結構的更多資訊](multiplatform-hierarchy)。

## 將密封類別與 when 表達式一起使用

使用密封類別的主要好處是在 [`when`](control-flow#when-expressions-and-statements) 表達式中使用它們時。
與密封類別一起使用的 `when` 表達式允許 Kotlin 編譯器詳盡地檢查是否涵蓋了所有可能的情況。
在這種情況下，您無需新增 `else` 子句：

```kotlin
// 密封類別及其子類別
sealed class Error {
    class FileReadError(val file: String): Error()
    class DatabaseError(val source: String): Error()
    object RuntimeError : Error()
}

// 記錄錯誤的函式
fun log(e: Error) = when(e) {
    is Error.FileReadError `->` println("讀取檔案 ${e.file} 時發生錯誤")
    is Error.DatabaseError `->` println("從資料庫 ${e.source} 讀取時發生錯誤")
    Error.RuntimeError `->` println("執行階段錯誤")
    // 不需要 `else` 子句，因為已涵蓋所有情況
}

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

將密封類別與 `when` 表達式一起使用時，您還可以新增守衛條件以在單個分支中包含其他檢查。
有關更多資訊，請參閱 [when 表達式中的守衛條件](control-flow#guard-conditions-in-when-expressions)。

:::note
在多平台專案中，如果您有一個密封類別，其中 `when` 表達式作為通用程式碼中的 [expected 宣告](multiplatform-expect-actual)，您仍然需要一個 `else` 分支。
這是因為 `actual` 平台實現的子類別可能會擴展通用程式碼中未知的密封類別。

:::

## 用例場景（Use case scenarios）

讓我們探索一些實際場景，其中密封類別和介面特別有用。

### UI 應用程式中的狀態管理

您可以使用密封類別來表示應用程式中的不同 UI 狀態。
此方法允許對 UI 變更進行結構化和安全處理。
此範例示範如何管理各種 UI 狀態：

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

### 付款方式處理

在實際的業務應用程式中，有效處理各種付款方式是一項常見要求。
您可以使用帶有 `when` 表達式的密封類別來實現此類業務邏輯。
透過將不同的付款方式表示為密封類別的子類別，它可以為處理交易建立一個清晰且可管理的結構：

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

`Payment` 是一個密封類別，表示電子商務系統中的不同付款方式：`CreditCard`、`PayPal` 和 `Cash`。
每個子類別都可以具有其特定屬性，例如 `CreditCard` 的 `number` 和 `expiryDate`，以及 `PayPal` 的 `email`。

`processPayment()` 函式示範如何處理不同的付款方式。
此方法確保考慮所有可能的付款類型，並且系統保持靈活性，以便將來新增新的付款方式。

### API 請求-響應處理

您可以使用密封類別和密封介面來實現處理 API 請求和響應的使用者身份驗證系統。
使用者身份驗證系統具有登錄和註銷功能。
`ApiRequest` 密封介面定義了特定的請求類型：用於登錄的 `LoginRequest` 和用於註銷操作的 `LogoutRequest`。
密封類別 `ApiResponse` 封裝了不同的響應場景：包含使用者資料的 `UserSuccess`、用於表示使用者不存在的 `UserNotFound` 和用於表示任何失敗的 `Error`。
`handleRequest` 函式使用 `when` 表達式以類型安全的方式處理這些請求，而 `getUserById` 模擬使用者檢索：

```kotlin
// 導入必要的模組
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

// 使用詳細的響應類型定義 ApiResponse 密封類別
sealed class ApiResponse {
    data class UserSuccess(val user: UserData) : ApiResponse()
    data object UserNotFound : ApiResponse()
    data class Error(val message: String) : ApiResponse()
}

// 用於成功響應的使用者資料類別
data class UserData(val userId: String, val name: String, val email: String)

// 用於驗證使用者憑證的函式（用於示範目的）
fun isValidUser(username: String, password: String): Boolean {
    // 一些驗證邏輯（這只是一個佔位符）
    return username == "validUser" && password == "validPass"
}

// 使用詳細響應處理 API 請求的函式
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
            // 假設在此範例中登出操作始終成功
            ApiResponse.UserSuccess(UserData("userId", "userName", "userEmail")) // 用於示範
        }
    }
}

// 用於模擬 getUserById 呼叫的函式
fun getUserById(userId: String): ApiResponse {
    return if (userId == "validUserId") {
        ApiResponse.UserSuccess(UserData("validUserId", "John Doe", "john@example.com"))
    } else {
        ApiResponse.UserNotFound
    }
    // 錯誤處理也會導致 Error 響應。
}

// 示範用法的主函式
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