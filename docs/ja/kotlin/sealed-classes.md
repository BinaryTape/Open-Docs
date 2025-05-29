[//]: # (title: シールドクラスとインターフェース)

_シールド_クラスとインターフェースは、クラス階層の継承を制御する機能を提供します。シールドクラスのすべての直接のサブクラスはコンパイル時に認識されます。それ以外のサブクラスは、シールドクラスが定義されているモジュールおよびパッケージの外には出現できません。同じ論理がシールドインターフェースとその実装にも適用されます。シールドインターフェースを含むモジュールがコンパイルされると、新しい実装を作成することはできません。

> 直接のサブクラスとは、スーパークラスから直接継承するクラスです。
>
> 間接のサブクラスとは、スーパークラスから複数レベル下位で継承するクラスです。
>
{style="note"}

シールドクラスとインターフェースを `when` 式と組み合わせると、考えられるすべてのサブクラスの振る舞いを網羅し、新しいサブクラスが作成されてコードに悪影響を与えることがないように保証できます。

シールドクラスは、次のシナリオで最もよく使用されます。

*   **クラス継承が限定されていることが望ましい場合:** クラスを拡張する、事前定義された有限のサブクラスのセットがあり、そのすべてがコンパイル時に認識される場合。
*   **型安全な設計が必要な場合:** 安全性とパターンマッチングがプロジェクトで重要となる場合。特に状態管理や複雑な条件ロジックの処理において。例については、[`when` 式でシールドクラスを使用する](#use-sealed-classes-with-when-expression)を参照してください。
*   **閉じたAPIを扱う場合:** ライブラリの堅牢で保守しやすい公開APIが必要で、サードパーティクライアントが意図したとおりにAPIを使用することを保証したい場合。

より詳細な実用的なアプリケーションについては、[ユースケースシナリオ](#use-case-scenarios)を参照してください。

> Java 15では[同様の概念](https://docs.oracle.com/en/java/javase/15/language/sealed-classes-and-interfaces.html#GUID-0C709461-CC33-419A-82BF-61461336E65F)が導入され、シールドクラスは`sealed`キーワードを`permits`句とともに使用して制限された階層を定義します。
>
{style="tip"}

## シールドクラスまたはインターフェースの宣言

シールドクラスまたはインターフェースを宣言するには、`sealed`修飾子を使用します。

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

この例は、ライブラリユーザーがスローされる可能性のあるエラーを処理できるように、エラークラスを含むライブラリのAPIを表すことができます。もしそのようなエラークラスの階層が公開APIで可視のインターフェースや抽象クラスを含む場合、他の開発者がクライアントコードでそれらを実装または拡張することを妨げるものはありません。ライブラリは外部で宣言されたエラーについて知らないため、自身のクラスと一貫してそれらを扱うことができません。しかし、エラークラスの**シールド**階層を使用すると、ライブラリの作者は、すべての可能なエラー型を把握していることを確信でき、他のエラー型が後から出現しないことを保証できます。

この例の階層は次のようになります。

![Hierarchy illustration of sealed classes and interfaces](sealed-classes-interfaces.svg){width=700}

### コンストラクタ

シールドクラスそれ自体は常に[抽象クラス](classes.md#abstract-classes)であり、その結果、直接インスタンス化することはできません。しかし、コンストラクタを含む、または継承することができます。これらのコンストラクタは、シールドクラス自体のインスタンスを作成するためではなく、そのサブクラスのためです。`Error`というシールドクラスと、それをインスタンス化するいくつかのサブクラスを含む次の例を考えてみましょう。

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

シールドクラス内で[`enum`](enum-classes.md)クラスを使用し、列挙定数で状態を表現し、追加の詳細情報を提供できます。各列挙定数は**単一の**インスタンスとしてのみ存在しますが、シールドクラスのサブクラスは**複数の**インスタンスを持つことができます。この例では、`sealed class Error`とそれに続くいくつかのサブクラスが、エラーの深刻度を示すために`enum`を利用しています。各サブクラスのコンストラクタは`severity`を初期化し、その状態を変更できます。

```kotlin
enum class ErrorSeverity { MINOR, MAJOR, CRITICAL }

sealed class Error(val severity: ErrorSeverity) {
    class FileReadError(val file: File): Error(ErrorSeverity.MAJOR)
    class DatabaseError(val source: DataSource): Error(ErrorSeverity.CRITICAL)
    object RuntimeError : Error(ErrorSeverity.CRITICAL)
    // Additional error types can be added here
}
```

シールドクラスのコンストラクタは、2つの[可視性](visibility-modifiers.md)のうちの1つを持つことができます: `protected` (デフォルト) または `private`。

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

## 継承

シールドクラスおよびインターフェースの直接のサブクラスは、同じパッケージ内で宣言する必要があります。それらはトップレベルであるか、任意の数の他の名前付きクラス、名前付きインターフェース、または名前付きオブジェクト内にネストされていても構いません。サブクラスは、Kotlinの通常の継承ルールと互換性がある限り、任意の[可視性](visibility-modifiers.md)を持つことができます。

シールドクラスのサブクラスは、適切に修飾された名前を持つ必要があります。それらはローカルオブジェクトや匿名オブジェクトであってはいけません。

> `enum`クラスはシールドクラス、または他のどのクラスも拡張できません。しかし、シールドインターフェースを実装することはできます。
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

これらの制限は間接的なサブクラスには適用されません。シールドクラスの直接のサブクラスがsealedとしてマークされていない場合、その修飾子が許可するいかなる方法でも拡張できます。

```kotlin
// Sealed interface 'Error' has implementations only in the same package and module
sealed interface Error

// Sealed class 'IOError' extends 'Error' and is extendable only within the same package
sealed class IOError(): Error

// Open class 'CustomError' extends 'Error' and can be extended anywhere it's visible
open class CustomError(): Error
```

### マルチプラットフォームプロジェクトにおける継承

[マルチプラットフォームプロジェクト](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)にはもう1つの継承の制限があります。シールドクラスの直接のサブクラスは同じ[ソースセット](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-discover-project.html#source-sets)内に存在する必要があります。これは、[expectおよびactual修飾子](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)を持たないシールドクラスに適用されます。

シールドクラスが共通ソースセットで`expect`として宣言され、プラットフォームソースセットに`actual`実装がある場合、`expect`と`actual`の両方のバージョンが、それぞれのソースセットにサブクラスを持つことができます。さらに、階層構造を使用している場合、`expect`宣言と`actual`宣言の間の任意のソースセットにサブクラスを作成できます。

[マルチプラットフォームプロジェクトの階層構造について詳しく学ぶ](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-hierarchy.html)。

## `when`式でのシールドクラスの使用

`when`式でシールドクラスを使用するときに、その主な利点が発揮されます。シールドクラスと共に使用される`when`式は、Kotlinコンパイラが考えられるすべてのケースが網羅されているかを網羅的にチェックすることを可能にします。そのような場合、`else`句を追加する必要はありません。

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

`when`式でシールドクラスを使用する場合、ガード条件を追加して、単一のブランチに追加のチェックを含めることもできます。詳細については、[`when`式におけるガード条件](control-flow.md#guard-conditions-in-when-expressions)を参照してください。

> マルチプラットフォームプロジェクトにおいて、共通コードに[期待される宣言](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-expect-actual.html)として`when`式を持つシールドクラスがある場合、それでも`else`ブランチが必要になります。これは、`actual`プラットフォーム実装のサブクラスが、共通コードでは認識されていないシールドクラスを拡張する可能性があるためです。
>
{style="note"}

## ユースケースシナリオ

シールドクラスとインターフェースが特に役立つ実用的なシナリオをいくつか見ていきましょう。

### UIアプリケーションにおける状態管理

アプリケーションにおける異なるUI状態を表現するために、シールドクラスを使用できます。このアプローチにより、UI変更の構造化された安全な処理が可能になります。この例は、さまざまなUI状態を管理する方法を示しています。

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

### 支払い方法の処理

実際のビジネスアプリケーションでは、さまざまな支払い方法を効率的に処理することが一般的な要件です。そのようなビジネスロジックを実装するために、`when`式を持つシールドクラスを使用できます。異なる支払い方法をシールドクラスのサブクラスとして表現することで、トランザクションを処理するための明確で管理しやすい構造を確立します。

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

`Payment`は、eコマースシステムにおける異なる支払い方法、`CreditCard`、`PayPal`、および`Cash`を表すシールドクラスです。各サブクラスは、`CreditCard`の`number`や`expiryDate`、`PayPal`の`email`など、独自のプロパティを持つことができます。

`processPayment()`関数は、異なる支払い方法を処理する方法を示しています。このアプローチにより、考えられるすべての支払いタイプが考慮されることが保証され、将来的に新しい支払い方法が追加されてもシステムが柔軟に対応できるようになります。

### APIリクエストとレスポンスの処理

APIリクエストとレスポンスを処理するユーザー認証システムを実装するために、シールドクラスとシールドインターフェースを使用できます。ユーザー認証システムには、ログインとログアウトの機能があります。`ApiRequest`シールドインターフェースは、ログイン用の`LoginRequest`、ログアウト操作用の`LogoutRequest`といった特定のリクエストタイプを定義します。シールドクラス`ApiResponse`は、ユーザーデータを含む`UserSuccess`、ユーザーがいない場合の`UserNotFound`、およびあらゆる失敗の場合の`Error`という異なるレスポンスシナリオをカプセル化します。`handleRequest`関数は、`when`式を使用してこれらのリクエストを型安全な方法で処理し、`getUserById`はユーザー取得をシミュレートします。

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