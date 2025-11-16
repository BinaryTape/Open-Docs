[//]: # (title: シールドクラスとインターフェース)

_シールド_クラスとインターフェースは、クラス階層の継承を制御します。シールドクラスの直接のサブクラスはすべてコンパイル時に既知となります。シールドクラスが定義されているモジュールおよびパッケージの外では、他のサブクラスを宣言することはできません。シールドインターフェースとその実装にも同じ論理が適用されます。シールドインターフェースを含むモジュールがコンパイルされると、新しい実装を作成することはできません。

> 直接のサブクラスとは、スーパークラスから直接継承するクラスです。
>
> 間接的なサブクラスとは、スーパークラスから複数レベル下位で継承するクラスです。
>
{style="note"}

シールドクラスとインターフェースを`when`式と組み合わせると、可能なすべてのサブクラスの振る舞いを網羅し、新しいサブクラスが作成されてコードに悪影響を与えることがないようにすることができます。

シールドクラスは次のようなシナリオで最もよく使用されます。

*   **クラス継承を制限したい場合:** クラスを拡張する、事前に定義された有限のサブクラスセットがあり、そのすべてがコンパイル時に既知である。
*   **型安全な設計が必要な場合:** プロジェクトにおいて安全性とパターンマッチングが重要である。特に状態管理や複雑な条件ロジックの処理において。例については、「[when式でのシールドクラスの使用](#use-sealed-classes-with-when-expression)」を参照してください。
*   **クローズドなAPIを扱う場合:** サードパーティのクライアントがAPIを意図したとおりに使用することを保証する、堅牢で保守しやすい公開APIをライブラリで提供したい。

より詳細な実用例については、「[ユースケースのシナリオ](#use-case-scenarios)」を参照してください。

> Java 15では、[同様の概念](https://docs.oracle.com/en/java/javase/15/language/sealed-classes-and-interfaces.html#GUID-0C709461-CC33-419A-82BF-61461336E65F)が導入されました。そこでは、シールドクラスは`sealed`キーワードと`permits`句を使用して、制限された階層を定義します。
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

この例は、ライブラリがスローするエラーをライブラリユーザーが処理できるように、エラークラスを含むライブラリのAPIを表すことができます。このようなエラークラスの階層が公開APIで可視なインターフェースや抽象クラスを含む場合、他の開発者がクライアントコードでそれらを実装または拡張することを妨げるものはありません。ライブラリは外部で宣言されたエラーを知らないため、それらを自身のクラスと一貫して扱うことはできません。しかし、**シールド**されたエラークラスの階層を使用すると、ライブラリの作成者は、すべての可能なエラータイプを知っており、他のエラータイプが後から現れることがないことを確信できます。

この例の階層は次のようになります。

![Hierarchy illustration of sealed classes and interfaces](sealed-classes-interfaces.svg){width=700}

### コンストラクタ

シールドクラス自体は常に[抽象クラス](classes.md#abstract-classes)であり、結果として直接インスタンス化することはできません。ただし、コンストラクタを含むか、継承することができます。これらのコンストラクタは、シールドクラス自体のインスタンスを作成するためではなく、そのサブクラスのために使用されます。`Error`というシールドクラスと、それをインスタンス化するいくつかのサブクラスの次の例を考えてみましょう。

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

シールドクラス内で[`enum`クラス](enum-classes.md)を使用して、enum定数で状態を表し、追加の詳細を提供できます。各enum定数は**単一**のインスタンスとしてのみ存在しますが、シールドクラスのサブクラスは**複数**のインスタンスを持つことができます。この例では、`sealed class Error`とそのいくつかのサブクラスは、`enum`を使用してエラーの深刻度を示します。各サブクラスのコンストラクタは`severity`を初期化し、その状態を変更できます。

```kotlin
enum class ErrorSeverity { MINOR, MAJOR, CRITICAL }

sealed class Error(val severity: ErrorSeverity) {
    class FileReadError(val file: File): Error(ErrorSeverity.MAJOR)
    class DatabaseError(val source: DataSource): Error(ErrorSeverity.CRITICAL)
    object RuntimeError : Error(ErrorSeverity.CRITICAL)
    // Additional error types can be added here
}
```

シールドクラスのコンストラクタは、2つの[可視性](visibility-modifiers.md)のいずれかを持つことができます。`protected` (デフォルト) または`private`です。

```kotlin
sealed class IOError {
    // シールドクラスのコンストラクタはデフォルトでprotected可視性を持ちます。このクラスとそのサブクラス内で可視です。
    constructor() { /*...*/ }

    // privateコンストラクタ。このクラス内でのみ可視です。
    // シールドクラスでprivateコンストラクタを使用すると、インスタンス化をさらに厳密に制御でき、クラス内で特定の初期化プロシージャを有効にできます。
    private constructor(description: String): this() { /*...*/ }

    // publicおよびinternalコンストラクタはシールドクラスで許可されていないため、エラーが発生します。
    // public constructor(code: Int): this() {} 
}
```

## 継承

シールドクラスおよびインターフェースの直接のサブクラスは、同じパッケージ内で宣言する必要があります。これらはトップレベルでも、任意の数の他の名前付きクラス、名前付きインターフェース、または名前付きオブジェクト内にネストされていても構いません。サブクラスは、Kotlinの通常の継承ルールと互換性がある限り、任意の[可視性](visibility-modifiers.md)を持つことができます。

シールドクラスのサブクラスは、適切な完全修飾名を持つ必要があります。これらはローカルオブジェクトまたは匿名オブジェクトにすることはできません。

> `enum`クラスはシールドクラスやその他のクラスを拡張できません。ただし、シールドインターフェースを実装することはできます。
>
> ```kotlin
> sealed interface Error
> 
> // シールドインターフェースErrorを拡張するenumクラス
> enum class ErrorType : Error {
>     FILE_ERROR, DATABASE_ERROR
> }
>
> ```
> 
{style="note"}

これらの制限は、間接的なサブクラスには適用されません。シールドクラスの直接のサブクラスがsealedとしてマークされていない場合、その修飾子が許可するあらゆる方法で拡張できます。

```kotlin
// シールドインターフェース'Error'は同じパッケージとモジュール内でのみ実装を持ちます
sealed interface Error

// シールドクラス'IOError'は'Error'を拡張し、同じパッケージ内でのみ拡張可能です
sealed class IOError(): Error

// オープンクラス'CustomError'は'Error'を拡張し、可視な場所であればどこでも拡張可能です
open class CustomError(): Error
```

### マルチプラットフォームプロジェクトにおける継承

[マルチプラットフォームプロジェクト](https://kotlinlang.org/docs/multiplatform/get-started.html)にはもう1つの継承制限があります。シールドクラスの直接のサブクラスは、同じ[ソースセット](https://kotlinlang.org/docs/multiplatform/multiplatform-discover-project.html#source-sets)に存在する必要があります。これは、[expectedおよびactual修飾子](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)を持たないシールドクラスに適用されます。

シールドクラスが共通ソースセットで`expect`として宣言され、プラットフォームソースセットで`actual`実装を持つ場合、`expect`と`actual`の両方のバージョンがそれぞれのソースセットにサブクラスを持つことができます。さらに、階層構造を使用する場合、`expect`と`actual`の宣言間の任意のソースセットにサブクラスを作成できます。

[マルチプラットフォームプロジェクトの階層構造について詳しく学ぶ](https://kotlinlang.org/docs/multiplatform/multiplatform-hierarchy.html)。

## `when`式でのシールドクラスの使用

シールドクラスを使用する主要な利点は、[`when`式](control-flow.md#when-expressions-and-statements)で使用する際に発揮されます。シールドクラスとともに使用される`when`式は、Kotlinコンパイラがすべての可能なケースが網羅されていることを徹底的にチェックすることを可能にします。そのような場合、`else`句を追加する必要はありません。

```kotlin
// シールドクラスとそのサブクラス
sealed class Error {
    class FileReadError(val file: String): Error()
    class DatabaseError(val source: String): Error()
    object RuntimeError : Error()
}

//sampleStart
// エラーをログに記録する関数
fun log(e: Error) = when(e) {
    is Error.FileReadError -> println("Error while reading file ${e.file}")
    is Error.DatabaseError -> println("Error while reading from database ${e.source}")
    Error.RuntimeError -> println("Runtime error")
    // すべてのケースが網羅されているため、`else`句は不要です
}
//sampleEnd

// すべてのエラーをリスト表示
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

> `when`式の繰り返しを減らすには、コンテキスト依存の解決（現在プレビュー中）を試してください。この機能により、期待される型が既知の場合、シールドクラスのメンバーをマッチングする際に型名を省略できます。
>
> 詳細については、「[コンテキスト依存の解決のプレビュー](whatsnew22.md#preview-of-context-sensitive-resolution)」または関連する「[KEEP提案](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/context-sensitive-resolution.md)」を参照してください。
> 
{style="tip"}

`when`式でシールドクラスを使用する場合、単一のブランチに追加のチェックを含めるためのガード条件を追加することもできます。詳細については、「[`when`式のガード条件](control-flow.md#guard-conditions-in-when-expressions)」を参照してください。

> マルチプラットフォームプロジェクトでは、共通コードに[`expected宣言`](https://kotlinlang.org/docs/multiplatform/multiplatform-expect-actual.html)として`when`式を持つシールドクラスがある場合でも、`else`ブランチが必要です。これは、`actual`プラットフォーム実装のサブクラスが、共通コードで既知ではないシールドクラスを拡張する可能性があるためです。
>
{style="note"}

## ユースケースのシナリオ

シールドクラスとインターフェースが特に役立つ、いくつかの実用的なシナリオを探ってみましょう。

### UIアプリケーションにおける状態管理

シールドクラスを使用して、アプリケーション内のさまざまなUI状態を表すことができます。このアプローチにより、UI変更の構造化された安全な処理が可能になります。この例は、さまざまなUI状態を管理する方法を示します。

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

実用的なビジネスアプリケーションでは、さまざまな支払い方法を効率的に処理することが一般的な要件です。シールドクラスと`when`式を使用して、そのようなビジネスロジックを実装できます。異なる支払い方法をシールドクラスのサブクラスとして表すことにより、トランザクションを処理するための明確で管理しやすい構造を確立します。

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

`Payment`は、Eコマースシステムにおけるさまざまな支払い方法（`CreditCard`、`PayPal`、`Cash`）を表すシールドクラスです。各サブクラスは独自の特定のプロパティを持つことができます。たとえば、`CreditCard`には`number`と`expiryDate`、`PayPal`には`email`などです。

`processPayment()`関数は、さまざまな支払い方法を処理する方法を示しています。このアプローチにより、可能なすべての支払いタイプが考慮され、将来新しい支払い方法が追加されてもシステムは柔軟に対応できます。

### APIリクエスト・レスポンスの処理

シールドクラスとシールドインターフェースを使用して、APIリクエストとレスポンスを処理するユーザー認証システムを実装できます。ユーザー認証システムにはログインとログアウトの機能があります。`ApiRequest`シールドインターフェースは、ログイン用の`LoginRequest`とログアウト操作用の`LogoutRequest`という特定の要求タイプを定義します。シールドクラス`ApiResponse`は、ユーザーデータを含む`UserSuccess`、ユーザーが存在しない場合の`UserNotFound`、およびあらゆる失敗の場合の`Error`など、異なる応答シナリオをカプセル化します。`handleRequest`関数は`when`式を使用してこれらのリクエストを型安全な方法で処理し、`getUserById`はユーザー検索をシミュレートします。

```kotlin
// 必要なモジュールをインポート
import io.ktor.server.application.*
import io.ktor.server.resources.*

import kotlinx.serialization.*

// Ktorリソースを使用してAPIリクエストのシールドインターフェースを定義
@Resource("api")
sealed interface ApiRequest

@Serializable
@Resource("login")
data class LoginRequest(val username: String, val password: String) : ApiRequest

@Serializable
@Resource("logout")
object LogoutRequest : ApiRequest

// 詳細な応答タイプを持つApiResponseシールドクラスを定義
sealed class ApiResponse {
    data class UserSuccess(val user: UserData) : ApiResponse()
    data object UserNotFound : ApiResponse()
    data class Error(val message: String) : ApiResponse()
}

// 成功応答で使用されるユーザーデータクラス
data class UserData(val userId: String, val name: String, val email: String)

// ユーザー認証情報を検証する関数（デモンストレーション目的）
fun isValidUser(username: String, password: String): Boolean {
    // いくつかの検証ロジック（これはプレースホルダーです）
    return username == "validUser" && password == "validPass"
}

// 詳細な応答を伴うAPIリクエストを処理する関数
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
            // この例ではログアウト操作は常に成功すると仮定
            ApiResponse.UserSuccess(UserData("userId", "userName", "userEmail")) // デモンストレーションのため
        }
    }
}

// getUserById呼び出しをシミュレートする関数
fun getUserById(userId: String): ApiResponse {
    return if (userId == "validUserId") {
        ApiResponse.UserSuccess(UserData("validUserId", "John Doe", "john@example.com"))
    } else {
        ApiResponse.UserNotFound
    }
    // エラー処理もError応答になります。
}

// 使用法をデモンストレーションするメイン関数
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