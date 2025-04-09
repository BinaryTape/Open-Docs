---
title: Sealedクラスとインターフェース
---
_Sealed_ クラスとインターフェースは、クラス階層の制御された継承を提供します。
sealedクラスの直接的なサブクラスはすべて、コンパイル時に認識されます。sealedクラスが定義されているモジュールおよび
パッケージの外部に、他のサブクラスが現れることはありません。sealedインターフェースとその実装にも同じロジックが適用されます。
sealedインターフェースを持つモジュールがコンパイルされると、新しい実装を作成できなくなります。

:::note
直接的なサブクラスとは、スーパークラスから直接継承するクラスのことです。

間接的なサブクラスとは、スーパークラスから複数レベル下を継承するクラスのことです。

:::

sealedクラスとインターフェースを`when`式と組み合わせると、可能なすべての
サブクラスの動作を網羅し、新しいサブクラスが作成されてコードに悪影響を及ぼすことがないようにすることができます。

sealedクラスは、次のようなシナリオで最適に使用されます。

* **限定的なクラス継承が望ましい場合:** クラスを拡張する定義済みの有限なサブクラスのセットがあり、それらはすべてコンパイル時に認識されている。
* **型安全な設計が必要な場合:** 安全性とパターンマッチングがプロジェクトで重要な場合。特に、状態管理や複雑な条件付きロジックの処理に。例については、[when式でsealedクラスを使用する](#use-sealed-classes-with-when-expression)を参照してください。
* **クローズドAPIを操作する場合:** サードパーティのクライアントがAPIを意図したとおりに使用することを保証する、堅牢で保守可能なライブラリのパブリックAPIが必要な場合。

より詳細な実践的なアプリケーションについては、[ユースケースのシナリオ](#use-case-scenarios)を参照してください。

:::note
Java 15では、[同様の概念](https://docs.oracle.com/en/java/javase/15/language/sealed-classes-and-interfaces.html#GUID-0C709461-CC33-419A-82BF-61461336E65F)が導入されました。
sealedクラスは、制限された階層を定義するために`sealed`キーワードと`permits`句を使用します。

## sealedクラスまたはインターフェースを宣言する

sealedクラスまたはインターフェースを宣言するには、`sealed`修飾子を使用します。

```kotlin
// sealedインターフェースを作成する
sealed interface Error

// sealedインターフェースErrorを実装するsealedクラスを作成する
sealed class IOError(): Error

// sealedクラス'IOError'を拡張するサブクラスを定義する
class FileReadError(val file: File): IOError()
class DatabaseError(val source: DataSource): IOError()

// 'Error' sealedインターフェースを実装するシングルトンオブジェクトを作成する
object RuntimeError : Error
```

この例は、ライブラリのAPIを表すことができます。このAPIには、ライブラリユーザーがスローできるエラーを処理するためのエラークラスが含まれています。
このようなエラークラスの階層に、パブリックAPIで表示されるインターフェースまたは抽象クラスが含まれている場合、
他の開発者がクライアントコードでそれらを実装または拡張することを妨げるものは何もありません。
ライブラリは、外部で宣言されたエラーについては認識していないため、独自のエラークラスと一貫して扱うことができません。
ただし、エラークラスの**sealed**階層を使用すると、ライブラリの作成者は、可能なすべてのエラー
タイプを認識しており、他のエラータイプが後で表示されることはないことを確認できます。

この例の階層は次のようになります。

<img src="/img/sealed-classes-interfaces.svg" alt="sealedクラスとインターフェースの階層の図" width="700" style={{verticalAlign: 'middle'}}/>

### コンストラクター

sealedクラス自体は常に[abstract class](classes#abstract-classes)であり、その結果、直接インスタンス化することはできません。
ただし、コンストラクターを含めるか、継承することができます。これらのコンストラクターは、sealedクラス自体のインスタンスを作成するためのものではありません
が、そのサブクラスのためのものです。`Error`というsealedクラスと、インスタンス化するいくつかのサブクラスの例を次に示します。

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

[`enum`](enum-classes)クラスをsealedクラス内で使用して、enum定数を使用して状態を表し、
詳細を追加できます。各enum定数は**単一の**インスタンスとしてのみ存在しますが、sealedクラスのサブクラスは
**複数の**インスタンスを持つ場合があります。
この例では、`sealed class Error`とそのいくつかのサブクラスが、エラーの重大度を示すために`enum`を採用しています。
各サブクラスコンストラクターは`severity`を初期化し、その状態を変更できます。

```kotlin
enum class ErrorSeverity { MINOR, MAJOR, CRITICAL }

sealed class Error(val severity: ErrorSeverity) {
    class FileReadError(val file: File): Error(ErrorSeverity.MAJOR)
    class DatabaseError(val source: DataSource): Error(ErrorSeverity.CRITICAL)
    object RuntimeError : Error(ErrorSeverity.CRITICAL)
    // Additional error types can be added here
}
```

sealedクラスのコンストラクターは、2つの[可視性](visibility-modifiers)のうちの1つを持つことができます。`protected`（デフォルト）または
`private`:

```kotlin
sealed class IOError {
    // sealedクラスコンストラクターは、デフォルトでprotectedの可視性を持っています。このクラスとそのサブクラス内で表示されます
    constructor() { /*...*/ }

    // プライベートコンストラクター。このクラス内でのみ表示されます。
    // sealedクラスでプライベートコンストラクターを使用すると、インスタンス化をより厳密に制御でき、クラス内で特定の初期化手順を実行できます。
    private constructor(description: String): this() { /*...*/ }

    // パブリックコンストラクターとinternalコンストラクターはsealedクラスでは許可されていないため、これはエラーが発生します
    // public constructor(code: Int): this() {}
}
```

## 継承

sealedクラスとインターフェースの直接のサブクラスは、同じパッケージで宣言する必要があります。それらは、トップレベルまたはネストされたものとして
他の名前付きクラス、名前付きインターフェース、または名前付きオブジェクト内にいくつでも存在できます。サブクラスは、Kotlinの通常の継承ルールと互換性がある限り、任意の[可視性](visibility-modifiers)を持つことができます。

sealedクラスのサブクラスは、適切に完全修飾された名前を持つ必要があります。それらは、ローカルまたは匿名オブジェクトにすることはできません。

`enum`クラスは、sealedクラスまたは他のクラスを拡張することはできません。ただし、sealedインターフェースを実装することはできます。

```kotlin
sealed interface Error

// sealedインターフェースErrorを拡張するenumクラス
enum class ErrorType : Error {
    FILE_ERROR, DATABASE_ERROR
}

```

:::

これらの制限は、間接的なサブクラスには適用されません。sealedクラスの直接のサブクラスがsealedとしてマークされていない場合、
その修飾子が許可する範囲で任意の方法で拡張できます。

```kotlin
// Sealedインターフェース'Error'は、同じパッケージおよびモジュール内でのみ実装を持ちます
sealed interface Error

// Sealedクラス'IOError'は'Error'を拡張し、同じパッケージ内でのみ拡張可能です
sealed class IOError(): Error

// Openクラス'CustomError'は'Error'を拡張し、表示される場所ならどこでも拡張できます
open class CustomError(): Error
```

### マルチプラットフォームプロジェクトでの継承

[マルチプラットフォームプロジェクト](multiplatform-intro)では、もう1つ継承の制限があります。sealedクラスの直接のサブクラスは、
同じ[ソースセット](multiplatform-discover-project#source-sets)に存在する必要があります。[expectedおよびactual修飾子](multiplatform-expect-actual)のないsealedクラスに適用されます。

sealedクラスが共通ソースセットで`expect`として宣言され、プラットフォームソースセットに`actual`実装がある場合、
`expect`バージョンと`actual`バージョンの両方が、それらのソースセットにサブクラスを持つことができます。さらに、階層構造を使用する場合、
`expect`宣言と`actual`宣言の間の任意のソースセットにサブクラスを作成できます。

[マルチプラットフォームプロジェクトの階層構造の詳細](multiplatform-hierarchy)をご覧ください。

## when式でsealedクラスを使用する

sealedクラスを使用する主な利点は、[`when`](control-flow#when-expressions-and-statements)で使用する場合に発揮されます。
式です。
`when`式をsealedクラスとともに使用すると、Kotlinコンパイラーは、考えられるすべてのケースが網羅されていることを徹底的に確認できます。
このような場合、`else`句を追加する必要はありません。

```kotlin
// Sealedクラスとそのサブクラス
sealed class Error {
    class FileReadError(val file: String): Error()
    class DatabaseError(val source: String): Error()
    object RuntimeError : Error()
}

// エラーをログに記録する関数
fun log(e: Error) = when(e) {
    is Error.FileReadError `->` println("Error while reading file ${e.file}")
    is Error.DatabaseError `->` println("Error while reading from database ${e.source}")
    Error.RuntimeError `->` println("Runtime error")
    // すべてのケースが網羅されているため、`else`句は必要ありません
}

// すべてのエラーをリストする
fun main() {
    val errors = listOf(
        Error.FileReadError("example.txt"),
        Error.DatabaseError("usersDatabase"),
        Error.RuntimeError
    )

    errors.forEach { log(it) }
}
```

sealedクラスを`when`式とともに使用する場合、ガード条件を追加して、1つのブランチに追加のチェックを含めることもできます。
詳細については、[when式でのガード条件](control-flow#guard-conditions-in-when-expressions)を参照してください。

:::note
マルチプラットフォームプロジェクトでは、`when`式を含むsealedクラスが
共通コードで[expected宣言](multiplatform-expect-actual)として宣言されている場合でも、`else`ブランチが必要です。
これは、`actual`プラットフォーム実装のサブクラスが、共通コードで認識されていないsealedクラスを拡張する可能性があるためです。

:::

## ユースケースのシナリオ

sealedクラスとインターフェースが特に役立つ可能性のある、いくつかの実践的なシナリオを見てみましょう。

### UIアプリケーションでの状態管理

sealedクラスを使用して、アプリケーションでさまざまなUI状態を表すことができます。
このアプローチにより、UIの変更を構造化された安全な方法で処理できます。
この例は、さまざまなUI状態を管理する方法を示しています。

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

### 支払い方法の処理

実際のビジネスアプリケーションでは、さまざまな支払い方法を効率的に処理することが一般的な要件です。
`when`式でsealedクラスを使用して、そのようなビジネスロジックを実装できます。
さまざまな支払い方法をsealedクラスのサブクラスとして表すことにより、トランザクションを処理するための明確で管理しやすい
構造を確立します。

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

`Payment`は、eコマースシステムでさまざまな支払い方法を表すsealedクラスです。
`CreditCard`、`PayPal`、および`Cash`。各サブクラスは、`CreditCard`の`number`や`expiryDate`、
`PayPal`の`email`など、固有のプロパティを持つことができます。

`processPayment()`関数は、さまざまな支払い方法を処理する方法を示しています。
このアプローチにより、可能なすべての支払いタイプが考慮され、システムは新しい支払い方法を将来追加できるように柔軟に対応できます。

### APIリクエスト/レスポンスの処理

sealedクラスとsealedインターフェースを使用して、APIリクエストとレスポンスを処理するユーザー認証システムを実装できます。
ユーザー認証システムには、ログイン機能とログアウト機能があります。
`ApiRequest` sealedインターフェースは、ログイン用の`LoginRequest`とログアウト操作用の`LogoutRequest`という、特定のリクエストタイプを定義します。
sealedクラス`ApiResponse`は、さまざまなレスポンスのシナリオをカプセル化します。ユーザーデータを含む`UserSuccess`、
不在のユーザーに対する`UserNotFound`、およびすべてのエラーに対する`Error`です。`handleRequest`関数は、`when`式を使用して、これらのリクエストを型安全な方法で処理し、
`getUserById`はユーザーの取得をシミュレートします。

```kotlin
// 必要なモジュールをインポートする
import io.ktor.server.application.*
import io.ktor.server.resources.*

import kotlinx.serialization.*

// Ktorリソースを使用してAPIリクエストのsealedインターフェースを定義する
@Resource("api")
sealed interface ApiRequest

@Serializable
@Resource("login")
data class LoginRequest(val username: String, val password: String) : ApiRequest

@Serializable
@Resource("logout")
object LogoutRequest : ApiRequest

// 詳細なレスポンスタイプを持つApiResponse sealedクラスを定義する
sealed class ApiResponse {
    data class UserSuccess(val user: UserData) : ApiResponse()
    data object UserNotFound : ApiResponse()
    data class Error(val message: String) : ApiResponse()
}

// 成功レスポンスで使用するユーザーデータクラス
data class UserData(val userId: String, val name: String, val email: String)

// ユーザーの資格情報を検証する関数（デモンストレーション用）
fun isValidUser(username: String, password: String): Boolean {
    // 何らかの検証ロジック（これはプレースホルダーにすぎません）
    return username == "validUser" && password == "validPass"
}

// 詳細なレスポンスを持つAPIリクエストを処理する関数
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
            // この例では、ログアウト操作は常に成功すると仮定する
            ApiResponse.UserSuccess(UserData("userId", "userName", "userEmail")) // デモンストレーション用
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
    // エラー処理もErrorレスポンスになる可能性があります。
}

// 使用法を示すメイン関数
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