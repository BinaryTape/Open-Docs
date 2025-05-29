[//]: # (title: 例外)

例外は、プログラムの実行を妨げる可能性のある実行時エラーが発生した場合でも、コードをより予測可能に実行するのに役立ちます。
Kotlinは、すべての例外をデフォルトで_非検査例外_として扱います。
非検査例外は、例外処理プロセスを簡素化します。例外を捕捉することはできますが、それらを明示的に処理したり、[宣言](java-to-kotlin-interop.md#checked-exceptions)したりする必要はありません。

> KotlinがJava、Swift、Objective-Cと連携する際の例外の扱いについて詳しくは、
> [Java、Swift、Objective-Cとの例外の相互運用性](#exception-interoperability-with-java-swift-and-objective-c)セクションを参照してください。
>
{style="tip"}

例外を扱うには、主に2つのアクションがあります。

*   **例外をスローする**: 問題が発生したことを示します。
*   **例外を捕捉する**: 問題を解決するか、開発者またはアプリケーションのユーザーに通知することで、予期しない例外を手動で処理します。

例外は、[`Throwable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/)クラスのサブクラスである[`Exception`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/)クラスのサブクラスとして表現されます。
階層の詳細については、[例外階層](#exception-hierarchy)セクションを参照してください。
`Exception`は[`open class`](inheritance.md)であるため、アプリケーションの特定のニーズに合わせて[カスタム例外](#create-custom-exceptions)を作成できます。

## 例外をスローする

`throw`キーワードを使用して手動で例外をスローできます。
例外をスローすると、コード内で予期しない実行時エラーが発生したことを示します。
例外は[オブジェクト](classes.md#creating-instances-of-classes)であり、例外をスローすると例外クラスのインスタンスが作成されます。

パラメータなしで例外をスローできます。

```kotlin
throw IllegalArgumentException()
```

問題の原因をよりよく理解するために、カスタムメッセージや元の原因などの追加情報を含めることができます。

```kotlin
val cause = IllegalStateException("Original cause: illegal state")

// userInputが負の場合、IllegalArgumentExceptionをスローする
// さらに、元の原因であるIllegalStateExceptionも表示される
if (userInput < 0) {
    throw IllegalArgumentException("Input must be non-negative", cause)
}
```

この例では、ユーザーが負の値を入力すると`IllegalArgumentException`がスローされます。
カスタムエラーメッセージを作成し、例外の元の原因（`cause`）を保持することができ、これは[スタックトレース](#stack-trace)に含まれます。

### 事前条件関数で例外をスローする

Kotlinは、事前条件関数を使用して自動的に例外をスローする追加の方法を提供します。
事前条件関数には以下が含まれます。

| 事前条件関数             | ユースケース                                 | スローされる例外                                                                                                 |
|--------------------------|------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| [`require()`](#require-function) | ユーザー入力の有効性をチェックする               | [`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/)   |
| [`check()`](#check-function)     | オブジェクトまたは変数の状態の有効性をチェックする | [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)         |
| [`error()`](#error-function)     | 不正な状態または条件を示す                       | [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)         |

これらの関数は、特定の条件が満たされない場合にプログラムのフローを続行できない状況に適しています。
これにより、コードが簡素化され、これらのチェックを効率的に処理できます。

#### require() 関数

[`require()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/require.html)関数は、入力引数が関数の操作にとって重要であり、引数が無効な場合にその関数が続行できないような場合に、それらの入力引数を検証するために使用します。

`require()`の条件が満たされない場合、[`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/)をスローします。

```kotlin
fun getIndices(count: Int): List<Int> {
    require(count >= 0) { "Count must be non-negative. You set count to $count." }
    return List(count) { it + 1 }
}

fun main() {
    // これはIllegalArgumentExceptionで失敗する
    println(getIndices(-1))
    
    // 動作例を見るには、以下の行をコメント解除してください
    // println(getIndices(3))
    // [1, 2, 3]
}
```
{kotlin-runnable="true"}

> `require()`関数を使用すると、コンパイラは[スマートキャスト](typecasts.md#smart-casts)を実行できます。
> チェックが成功すると、変数は自動的に非Null型にキャストされます。
> これらの関数は、変数がNullではないことを確認するためにNull許容性チェックでよく使用されます。例：
>
> ```kotlin
> fun printNonNullString(str: String?) {
>     // Null許容性チェック
>     require(str != null) 
>     // このチェックが成功した後、'str'は非Nullであることが保証され、
>     // 自動的に非NullのStringにスマートキャストされる
>     println(str.length)
> }
> ```
>
{style="note"}

#### check() 関数

[`check()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/check.html)関数は、オブジェクトまたは変数の状態を検証するために使用します。
チェックが失敗した場合、それは対処する必要がある論理エラーを示します。

`check()`関数で指定された条件が`false`の場合、[`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)をスローします。

```kotlin
fun main() {
    var someState: String? = null

    fun getStateValue(): String {

        val state = checkNotNull(someState) { "State must be set beforehand!" }
        check(state.isNotEmpty()) { "State must be non-empty!" }
        return state
    }
    // 以下の行をコメント解除すると、プログラムはIllegalStateExceptionで失敗する
    // getStateValue()

    someState = ""

    // 以下の行をコメント解除すると、プログラムはIllegalStateExceptionで失敗する
    // getStateValue() 
    someState = "non-empty-state"

    // これは"non-empty-state"と出力される
    println(getStateValue())
}
```
{kotlin-runnable="true"}

> `check()`関数を使用すると、コンパイラは[スマートキャスト](typecasts.md#smart-casts)を実行できます。
> チェックが成功すると、変数は自動的に非Null型にキャストされます。
> これらの関数は、変数がNullではないことを確認するためにNull許容性チェックでよく使用されます。例：
>
> ```kotlin
> fun printNonNullString(str: String?) {
>     // Null許容性チェック
>     check(str != null) 
>     // このチェックが成功した後、'str'は非Nullであることが保証され、
>     // 自動的に非NullのStringにスマートキャストされる
>     println(str.length)
> }
> ```
>
{style="note"}

#### error() 関数

[`error()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/error.html)関数は、論理的には発生しないはずの、コード内の不正な状態または条件を通知するために使用されます。
コードが予期しない状態になった場合など、コード内で意図的に例外をスローしたいシナリオに適しています。
この関数は、`when`式で特に役立ち、論理的に発生しないはずのケースを明確に処理する方法を提供します。

以下の例では、`error()`関数が未定義のユーザーロールを処理するために使用されています。
ロールが事前定義されたもののいずれでもない場合、[`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)がスローされます。

```kotlin
class User(val name: String, val role: String)

fun processUserRole(user: User) {
    when (user.role) {
        "admin" -> println("${user.name} is an admin.")
        "editor" -> println("${user.name} is an editor.")
        "viewer" -> println("${user.name} is a viewer.")
        else -> error("Undefined role: ${user.role}")
    }
}

fun main() {
    // これは期待通りに動作する
    val user1 = User("Alice", "admin")
    processUserRole(user1)
    // Alice is an admin.

    // これはIllegalStateExceptionをスローする
    val user2 = User("Bob", "guest")
    processUserRole(user2)
}
```
{kotlin-runnable="true"}

## try-catch ブロックを使用した例外の処理

例外がスローされると、プログラムの通常の実行が中断されます。
`try`および`catch`キーワードを使用すると、例外を適切に処理してプログラムを安定させることができます。
`try`ブロックには例外をスローする可能性のあるコードが含まれ、`catch`ブロックは例外が発生した場合にそれを捕捉して処理します。
例外は、その特定の型または例外の[スーパークラス](inheritance.md)に一致する最初の`catch`ブロックによって捕捉されます。

`try`と`catch`キーワードを一緒に使用する方法は次のとおりです。

```kotlin
try {
    // 例外をスローする可能性のあるコード
} catch (e: SomeException) {
    // 例外を処理するコード
}
```

`try-catch`を式として使用することは一般的なアプローチであり、`try`ブロックまたは`catch`ブロックのいずれかから値を返すことができます。

```kotlin
fun main() {
    val num: Int = try {

        // count()が正常に完了した場合、その戻り値がnumに代入される
        count()
        
    } catch (e: ArithmeticException) {
        
        // count()が例外をスローした場合、catchブロックは-1を返し、
        // それがnumに代入される
        -1
    }
    println("Result: $num")
}

// ArithmeticExceptionをスローする可能性のある関数をシミュレートする
fun count(): Int {
    
    // この値を変更してnumに異なる値を返す
    val a = 0
    
    return 10 / a
}
```
{kotlin-runnable="true"}

同じ`try`ブロックに対して複数の`catch`ハンドラを使用できます。
さまざまな例外を個別に処理するために、必要なだけ`catch`ブロックを追加できます。
複数の`catch`ブロックがある場合、コード内で上から下の順に、最も具体的な例外から最も具体的でない例外へと順序付けることが重要です。
この順序付けは、プログラムの実行フローと一致します。

[カスタム例外](#create-custom-exceptions)を使用したこの例を考えてみましょう。

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

    // 異なるシナリオをテストするためにこの値を変更してください
    val withdrawalAmount = 500.5

    try {
        processWithdrawal(withdrawalAmount.toDouble(), availableFunds)

    // catchブロックの順序は重要です！
    } catch (e: InsufficientFundsException) {
        println("Caught an InsufficientFundsException: ${e.message}")
    } catch (e: WithdrawalException) {
        println("Caught a WithdrawalException: ${e.message}")
    }
}
```
{kotlin-runnable="true"}

`WithdrawalException`を処理する一般的な`catch`ブロックは、より具体的な`catch`ブロックによって先に捕捉されない限り、`InsufficientFundsException`のような特定の例外を含む、その型のすべての例外を捕捉します。

### finally ブロック

`finally`ブロックには、`try`ブロックが正常に完了したか、例外をスローしたかに関わらず、常に実行されるコードが含まれます。
`finally`ブロックを使用すると、`try`ブロックと`catch`ブロックの実行後にコードをクリーンアップできます。
これは、ファイルやネットワーク接続のようなリソースを扱う場合に特に重要であり、`finally`ブロックはそれらが適切に閉じられるか解放されることを保証します。

`try-catch-finally`ブロックを一緒に使用する典型的な方法は次のとおりです。

```kotlin
try {
    // 例外をスローする可能性のあるコード
}
catch (e: YourException) {
    // 例外ハンドラ
}
finally {
    // 常に実行されるコード
}
```

`try`式の戻り値は、`try`または`catch`ブロックのいずれかで最後に実行された式によって決定されます。
例外が発生しない場合、結果は`try`ブロックから返されます。例外が処理された場合、結果は`catch`ブロックから返されます。
`finally`ブロックは常に実行されますが、`try-catch`ブロックの結果には影響を与えません。

例を見てみましょう。

```kotlin
fun divideOrNull(a: Int): Int {
    
    // tryブロックは常に実行される
    // ここで例外（ゼロによる除算）が発生すると、catchブロックに即座にジャンプする
    try {
        val b = 44 / a
        println("try block: Executing division: $b")
        return b
    }
    
    // ArithmeticException（a == 0の場合、ゼロによる除算）のため、catchブロックが実行される
    catch (e: ArithmeticException) {
        println("catch block: Encountered ArithmeticException $e")
        return -1
    }
    finally {
        println("finally block: The finally block is always executed")
    }
}

fun main() {
    
    // この値を変更して異なる結果を得る。ArithmeticExceptionは-1を返す
    divideOrNull(0)
}
```
{kotlin-runnable="true"}

> Kotlinでは、[`FileInputStream`](https://kotlinlang.org/api/latest/jvm/stdlib/java.io/-file-input-stream/)や[`FileOutputStream`](https://kotlinlang.org/api/latest/jvm/stdlib/java.io/-file-output-stream/)のようなファイルストリームなど、[`AutoClosable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-auto-closeable/)インターフェースを実装するリソースを管理する慣用的な方法は、[`.use()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/use.html)関数を使用することです。
> この関数は、例外がスローされたかどうかにかかわらず、コードブロックが完了したときにリソースを自動的に閉じます。これにより、`finally`ブロックの必要性がなくなります。
> 結果として、Kotlinはリソース管理のために[Javaのtry-with-resources](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html)のような特別な構文を必要としません。
>
> ```kotlin
> FileWriter("test.txt").use { writer ->
> writer.write("some text") 
> // このブロックの後、.use関数はwriter.close()を自動的に呼び出す。これはfinallyブロックと似ている
> }
> ```
>
{style="note"}

コードが例外を処理せずにリソースクリーンアップを必要とする場合、`catch`ブロックなしで`finally`ブロックと`try`を使用することもできます。

```kotlin
class MockResource { 
    fun use() { 
        println("Resource being used") 
        // 使用中のリソースをシミュレートする
        // ゼロ除算が発生した場合、ArithmeticExceptionをスローする
        val result = 100 / 0
        
        // 例外がスローされた場合、この行は実行されない
        println("Result: $result") 
    }
    
    fun close() { 
        println("Resource closed") 
    }
}

fun main() { 
    val resource = MockResource()
//sampleStart 
    try {
        
        // リソースの使用を試みる
        resource.use()
        
    } finally {
        
        // 例外が発生した場合でも、リソースが常に閉じられることを保証する
        resource.close()
    }

    // 例外がスローされた場合、この行は出力されない
    println("End of the program")
//sampleEnd
}
```
{kotlin-runnable="true"}

ご覧のとおり、`finally`ブロックは、例外が発生したかどうかに関わらず、リソースが閉じられることを保証します。

Kotlinでは、特定のニーズに応じて、`catch`ブロックのみ、`finally`ブロックのみ、またはその両方を使用する柔軟性がありますが、`try`ブロックは常に少なくとも1つの`catch`ブロックまたは`finally`ブロックを伴う必要があります。

## カスタム例外を作成する

Kotlinでは、組み込みの`Exception`クラスを継承するクラスを作成することで、カスタム例外を定義できます。
これにより、アプリケーションのニーズに合わせたより具体的なエラー型を作成できます。

カスタム例外を作成するには、`Exception`を継承するクラスを定義します。

```kotlin
class MyException: Exception("My message")
```

この例では、デフォルトのエラーメッセージ「My message」がありますが、必要に応じて空にすることもできます。

> Kotlinの例外はステートフルなオブジェクトであり、作成時のコンテキストに固有の情報（[スタックトレース](#stack-trace)と呼ばれる）を保持します。
> [オブジェクト宣言](object-declarations.md#object-declarations-overview)を使用して例外を作成することは避けてください。
> 代わりに、例外が必要になるたびに新しいインスタンスを作成してください。
> このようにすることで、例外の状態が特定のコンテキストを正確に反映していることを保証できます。
>
{style="tip"}

カスタム例外は、`ArithmeticException`サブクラスなど、既存の例外サブクラスのサブクラスにすることもできます。

```kotlin
class NumberTooLargeException: ArithmeticException("My message")
```

> カスタム例外のサブクラスを作成したい場合は、親クラスを`open`として宣言する必要があります。
> なぜなら、[クラスはデフォルトでfinal](inheritance.md)であり、それ以外の場合はサブクラス化できないためです。
>
> 例：
>
> ```kotlin
> // カスタム例外をopenクラスとして宣言し、サブクラス化可能にする
> open class MyCustomException(message: String): Exception(message)
>
> // カスタム例外のサブクラスを作成する
> class SpecificCustomException: MyCustomException("Specific error message")
> ```
>
{style="note"}

カスタム例外は、組み込み例外とまったく同じように動作します。`throw`キーワードを使用してスローしたり、`try-catch-finally`ブロックで処理したりできます。例を見てみましょう。

```kotlin
class NegativeNumberException: Exception("Parameter is less than zero.")
class NonNegativeNumberException: Exception("Parameter is a non-negative number.")

fun myFunction(number: Int) {
    if (number < 0) throw NegativeNumberException()
    else if (number >= 0) throw NonNegativeNumberException()
}

fun main() {
    
    // 異なる例外を取得するために、この関数の値を変更してください
    myFunction(1)
}
```
{kotlin-runnable="true"}

多様なエラーシナリオを持つアプリケーションでは、例外の階層を作成することで、コードをより明確かつ具体的にすることができます。
これは、共通の例外機能の基盤として[抽象クラス](classes.md#abstract-classes)または[sealedクラス](sealed-classes.md#constructors)を使用し、詳細な例外タイプのために特定のサブクラスを作成することで実現できます。
さらに、オプションのパラメータを持つカスタム例外は柔軟性を提供し、さまざまなメッセージで初期化できるため、よりきめ細かいエラー処理が可能になります。

例外階層の基盤としてsealedクラス`AccountException`を使用し、オプションのパラメータを使用して例外の詳細を向上させるサブクラス`APIKeyExpiredException`を示す例を見てみましょう。

```kotlin
//sampleStart
// アカウント関連エラーの例外階層の基盤としてsealedクラスを作成する
sealed class AccountException(message: String, cause: Throwable? = null):
Exception(message, cause)

// AccountExceptionのサブクラスを作成する
class InvalidAccountCredentialsException : AccountException("Invalid account credentials detected")

// AccountExceptionのサブクラスを作成する。これはカスタムメッセージと原因の追加を許可する
class APIKeyExpiredException(message: String = "API key expired", cause: Throwable? = null)	: AccountException(message, cause)

// 異なる結果を得るためにプレースホルダー関数の値を変更する
fun areCredentialsValid(): Boolean = true
fun isAPIKeyExpired(): Boolean = true
//sampleEnd

// アカウントの資格情報とAPIキーを検証する
fun validateAccount() {
    if (!areCredentialsValid()) throw InvalidAccountCredentialsException()
    if (isAPIKeyExpired()) {
        // 特定の原因を伴うAPIKeyExpiredExceptionをスローする例
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
{kotlin-runnable="true"}

## Nothing 型

Kotlinでは、すべての式には型があります。
式`throw IllegalArgumentException()`の型は[`Nothing`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)です。これは、すべての他の型のサブタイプであり、[ボトム型](https://en.wikipedia.org/wiki/Bottom_type)としても知られています。
これは、`Nothing`が、型エラーを引き起こすことなく、他の任意の型が期待される場所で戻り値の型またはジェネリック型として使用できることを意味します。

`Nothing`はKotlinの特殊な型で、常に例外をスローするか、無限ループのような無限の実行パスに入るかのいずれかにより、決して正常に完了しない関数や式を表すために使用されます。
`Nothing`を使用して、まだ実装されていない関数や常に例外をスローするように設計された関数をマークすることで、コンパイラとコード読者の両方に意図を明確に伝えることができます。
コンパイラが関数シグネチャで`Nothing`型を推論した場合、警告を発します。
`Nothing`を戻り値の型として明示的に定義することで、この警告を解消できます。

このKotlinコードは、`Nothing`型の使用法を示しています。コンパイラは関数呼び出しに続くコードを到達不能としてマークします。

```kotlin
class Person(val name: String?)

fun fail(message: String): Nothing {
    throw IllegalArgumentException(message)
    // この関数は決して正常に値を返さない。
    // 常に例外をスローする。
}

fun main() {
    // 'name'がnullのPersonインスタンスを作成する
    val person = Person(name = null)
    
    val s: String = person.name ?: fail("Name required")

    // この時点で's'は初期化されていることが保証される
    println(s)
}
```
{kotlin-runnable="true"}

Kotlinの[`TODO()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-t-o-d-o.html)関数も`Nothing`型を使用しており、将来の実装が必要なコード領域を強調するためのプレースホルダーとして機能します。

```kotlin
fun notImplementedFunction(): Int {
    TODO("This function is not yet implemented")
}

fun main() {
    val result = notImplementedFunction()
    // これはNotImplementedErrorをスローする
    println(result)
}
```
{kotlin-runnable="true"}

ご覧のとおり、`TODO()`関数は常に[`NotImplementedError`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-not-implemented-error/)例外をスローします。

## 例外クラス

Kotlinで見られる一般的な例外タイプの一部を見てみましょう。これらはすべて[`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/)クラスのサブクラスです。

*   [`ArithmeticException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-arithmetic-exception/): この例外は、ゼロ除算のように算術演算を実行できない場合に発生します。

    ```kotlin
    val example = 2 / 0 // ArithmeticExceptionをスローする
    ```

*   [`IndexOutOfBoundsException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-index-out-of-bounds-exception/): この例外は、配列や文字列などのインデックスが範囲外であることを示すためにスローされます。

    ```kotlin
    val myList = mutableListOf(1, 2, 3)
    myList.removeAt(3)  // IndexOutOfBoundsExceptionをスローする
    ```

    > この例外を避けるには、[`getOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-null.html)関数などのより安全な代替手段を使用してください。
    >
    > ```kotlin
    > val myList = listOf(1, 2, 3)
    > // IndexOutOfBoundsExceptionの代わりにnullを返す
    > val element = myList.getOrNull(3)
    > println("Element at index 3: $element")
    > ```
    >
{style="note"}

*   [`NoSuchElementException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-no-such-element-exception/): この例外は、特定のコレクションに存在しない要素にアクセスされた場合にスローされます。
    [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html)や[`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)など、特定の要素を期待するメソッドを使用した場合に発生します。

    ```kotlin
    val emptyList = listOf<Int>()
    val firstElement = emptyList.first()  // NoSuchElementExceptionをスローする
    ```

    > この例外を避けるには、[`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html)関数などのより安全な代替手段を使用してください。
    >
    > ```kotlin
    > val emptyList = listOf<Int>()
    > // NoSuchElementExceptionの代わりにnullを返す
    > val firstElement = emptyList.firstOrNull()
    > println("First element in empty list: $firstElement")
    > ```
    >
{style="note"}

*   [`NumberFormatException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-number-format-exception/): この例外は、文字列を数値型に変換しようとしたときに、文字列が適切な形式ではない場合に発生します。

    ```kotlin
    val string = "This is not a number"
    val number = string.toInt() // NumberFormatExceptionをスローする
    ```

    > この例外を避けるには、[`toIntOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int-or-null.html)関数などのより安全な代替手段を使用してください。
    >
    > ```kotlin
    > val nonNumericString = "not a number"
    > // NumberFormatExceptionの代わりにnullを返す
    > val number = nonNumericString.toIntOrNull()
    > println("Converted number: $number")
    > ```
    >
{style="note"}

*   [`NullPointerException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/): この例外は、アプリケーションが`null`値を持つオブジェクト参照を使用しようとしたときにスローされます。
    KotlinのNull安全性機能はNullPointerExceptionのリスクを大幅に低減しますが、`!!`演算子の意図的な使用、またはKotlinのNull安全性を欠くJavaとの相互作用によって、依然として発生する可能性があります。

    ```kotlin
    val text: String? = null
    println(text!!.length)  // NullPointerExceptionをスローする
    ```

Kotlinではすべての例外が非検査例外であり、明示的に捕捉する必要はありませんが、必要に応じて捕捉する柔軟性も持ち合わせています。

### 例外階層

Kotlinの例外階層のルートは、[`Throwable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/)クラスです。
これには、[`Error`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-error/)と[`Exception`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/)の2つの直接サブクラスがあります。

*   `Error`サブクラスは、アプリケーション自体では回復できないような深刻な基本的な問題を表します。
    これらは、[`OutOfMemoryError`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-out-of-memory-error/)や`StackOverflowError`など、通常は処理しようとしない問題です。

*   `Exception`サブクラスは、処理したい状況で使用されます。
    [`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/)や`IOException`（入出力例外）などの`Exception`型のサブタイプは、アプリケーションにおける例外的なイベントを扱います。

![例外階層 - Throwableクラス](throwable.svg){width=700}

`RuntimeException`は通常、プログラムコードのチェックが不十分なために発生し、プログラムで防止することができます。
Kotlinは、`NullPointerException`のような一般的な`RuntimeException`の防止に役立ち、ゼロ除算のような潜在的な実行時エラーに対してコンパイル時の警告を提供します。次の図は、`RuntimeException`から派生するサブタイプの階層を示しています。

![RuntimeExceptionの階層](runtime-exception.svg){width=700}

## スタックトレース

_スタックトレース_は、デバッグのために実行時環境によって生成されるレポートです。
これは、プログラム内の特定の位置、特にエラーや例外が発生した位置に至るまでの関数呼び出しのシーケンスを示します。

JVM環境で例外が発生したためにスタックトレースが自動的に出力される例を見てみましょう。

```kotlin
fun main() {
//sampleStart    
    throw ArithmeticException("This is an arithmetic exception!")
//sampleEnd    
}
```
{kotlin-runnable="true"}

このコードをJVM環境で実行すると、次の出力が生成されます。

```text
Exception in thread "main" java.lang.ArithmeticException: This is an arithmetic exception!
    at MainKt.main(Main.kt:3)
    at MainKt.main(Main.kt)
```

最初の行は例外の説明であり、以下が含まれます。

*   例外タイプ: `java.lang.ArithmeticException`
*   スレッド: `main`
*   例外メッセージ: `"This is an arithmetic exception!"`

例外の説明の後に`at`で始まる各行はスタックトレースです。1つの行は_スタックトレース要素_または_スタックフレーム_と呼ばれます。

*   `at MainKt.main (Main.kt:3)`: これはメソッド名（`MainKt.main`）と、メソッドが呼び出されたソースファイルと行番号（`Main.kt:3`）を示しています。
*   `at MainKt.main (Main.kt)`: これは、`Main.kt`ファイルの`main()`関数で例外が発生したことを示しています。

## Java、Swift、Objective-Cとの例外の相互運用性

Kotlinがすべての例外を非検査例外として扱うため、検査例外と非検査例外を区別する言語からそのような例外が呼び出されると、複雑な問題につながる可能性があります。
KotlinとJava、Swift、Objective-Cのような言語との例外処理のこの差異に対処するために、[`@Throws`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throws/)アノテーションを使用できます。
このアノテーションは、呼び出し元に潜在的な例外について警告します。
詳細については、[JavaからKotlinを呼び出す](java-to-kotlin-interop.md#checked-exceptions)および[Swift/Objective-Cとの相互運用性](native-objc-interop.md#errors-and-exceptions)を参照してください。