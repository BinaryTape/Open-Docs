---
title: 例外
---
例外処理は、プログラムの実行を妨げる可能性のあるランタイムエラーが発生した場合でも、コードをより予測どおりに実行するのに役立ちます。
Kotlin では、すべての例外はデフォルトで _unchecked_ として扱われます。
unchecked な例外は、例外処理のプロセスを簡素化します。例外をキャッチできますが、明示的に処理または[宣言](java-to-kotlin-interop#checked-exceptions)する必要はありません。

:::note
Kotlin が Java、Swift、Objective-C とのインタラクション時に例外をどのように処理するかについては、
「[Java、Swift、Objective-C との例外の相互運用性](#exception-interoperability-with-java-swift-and-objective-c)」のセクションを参照してください。

例外の処理は、主に次の 2 つのアクションで構成されます。

* **例外のスロー:** 問題が発生したことを示します。
* **例外のキャッチ:** 問題を解決するか、開発者またはアプリケーションユーザーに通知することにより、予期しない例外を手動で処理します。

例外は、[`Exception`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/) クラスのサブクラスによって表されます。これは、[`Throwable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) クラスのサブクラスです。
階層の詳細については、「[例外階層](#exception-hierarchy)」セクションを参照してください。
`Exception` は [`open class`](inheritance) であるため、アプリケーションの特定のニーズに合わせて[カスタム例外を作成](#create-custom-exceptions)できます。

## 例外のスロー

`throw` キーワードを使用して、手動で例外をスローできます。
例外をスローすると、予期しないランタイムエラーがコードで発生したことが示されます。
例外は[オブジェクト](classes#creating-instances-of-classes)であり、例外をスローすると例外クラスのインスタンスが作成されます。

パラメーターなしで例外をスローできます。

```kotlin
throw IllegalArgumentException()
```

問題の原因をより深く理解するには、カスタムメッセージや元の原因などの追加情報を含めます。

```kotlin
val cause = IllegalStateException("Original cause: illegal state")

// userInput が負の場合、IllegalArgumentException をスローします
// さらに、原因である IllegalStateException を表示します
if (userInput < 0) {
    throw IllegalArgumentException("Input must be non-negative", cause)
}
```

この例では、ユーザーが負の値を入力すると、`IllegalArgumentException` がスローされます。
カスタムエラーメッセージを作成し、例外の元の原因 (`cause`) を保持できます。これは[スタックトレース](#stack-trace)に含まれます。

### 事前条件関数を使用した例外のスロー

Kotlin には、事前条件関数を使用して例外を自動的にスローする追加の方法があります。
事前条件関数には、次のものが含まれます。

| 事前条件関数                           | ユースケース                                   | スローされる例外                                                                                                 |
|----------------------------------|------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| [`require()`](#require-function) | ユーザー入力の有効性のチェック                         | [`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/)   |
| [`check()`](#check-function)     | オブジェクトまたは変数の状態の有効性のチェック                 | [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)         |
| [`error()`](#error-function)     | 違法な状態または条件を示します                       | [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)         |

これらの関数は、特定の条件が満たされない場合にプログラムのフローを続行できない状況に適しています。
これにより、コードが合理化され、これらのチェックを効率的に処理できます。

#### require() 関数

[`require()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/require.html) 関数を使用して、入力引数が関数の操作に不可欠である場合に検証します。
これらの引数が無効な場合、関数は続行できません。

`require()` の条件が満たされない場合、[`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/) がスローされます。

```kotlin
fun getIndices(count: Int): List<Int> {
    require(count >= 0) { "Count must be non-negative. You set count to $count." }
    return List(count) { it + 1 }
}

fun main() {
    // これは IllegalArgumentException で失敗します
    println(getIndices(-1))
    
    // 動作する例を表示するには、下の行のコメントを外してください
    // println(getIndices(3))
    // [1, 2, 3]
}
```

`require()` 関数を使用すると、コンパイラーは[スマートキャスト](typecasts#smart-casts)を実行できます。
チェックが成功すると、変数は自動的に non-nullable 型にキャストされます。
これらの関数は、変数が続行する前に null でないことを確認するために、nullability チェックによく使用されます。次に例を示します。

```kotlin
fun printNonNullString(str: String?) {
    // Nullability チェック
    require(str != null) 
    // このチェックが成功すると、'str' は null でないことが保証され、
    // 自動的に non-nullable String にスマートキャストされます
    println(str.length)
}
```

:::

#### check() 関数

[`check()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/check.html) 関数を使用して、オブジェクトまたは変数の状態を検証します。
チェックに失敗した場合、対処する必要があるロジックエラーを示します。

`check()` 関数で指定された条件が `false` の場合、[`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/) がスローされます。

```kotlin
fun main() {
    var someState: String? = null

    fun getStateValue(): String {

        val state = checkNotNull(someState) { "State must be set beforehand!" }
        check(state.isNotEmpty()) { "State must be non-empty!" }
        return state
    }
    // 下の行のコメントを外すと、プログラムは IllegalStateException で失敗します
    // getStateValue()

    someState = ""

    // 下の行のコメントを外すと、プログラムは IllegalStateException で失敗します
    // getStateValue() 
    someState = "non-empty-state"

    // これは "non-empty-state" を出力します
    println(getStateValue())
}
```

:::note
`check()` 関数を使用すると、コンパイラーは[スマートキャスト](typecasts#smart-casts)を実行できます。
チェックが成功すると、変数は自動的に non-nullable 型にキャストされます。
これらの関数は、変数が続行する前に null でないことを確認するために、nullability チェックによく使用されます。次に例を示します。

```kotlin
fun printNonNullString(str: String?) {
    // Nullability チェック
    check(str != null) 
    // このチェックが成功すると、'str' は null でないことが保証され、
    // 自動的に non-nullable String にスマートキャストされます
    println(str.length)
}
```

:::

#### error() 関数

[`error()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/error.html) 関数は、コード内の違法な状態または条件を通知するために使用されます。これは論理的には発生しないはずです。
コードが予期しない状態に遭遇した場合など、コードで意図的に例外をスローする場合に適しています。
この関数は、論理的に発生しないはずの場合を明確に処理する方法を提供する `when` 式で特に役立ちます。

次の例では、`error()` 関数を使用して、未定義のユーザーロールを処理します。
ロールが事前定義されたロールのいずれでもない場合、[`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/) がスローされます。

```kotlin
class User(val name: String, val role: String)

fun processUserRole(user: User) {
    when (user.role) {
        "admin" `->` println("${user.name} is an admin.")
        "editor" `->` println("${user.name} is an editor.")
        "viewer" `->` println("${user.name} is a viewer.")
        else `->` error("Undefined role: ${user.role}")
    }
}

fun main() {
    // これは期待どおりに動作します
    val user1 = User("Alice", "admin")
    processUserRole(user1)
    // Alice is an admin.

    // これは IllegalStateException をスローします
    val user2 = User("Bob", "guest")
    processUserRole(user2)
}
```

## try-catch ブロックを使用した例外の処理

例外がスローされると、プログラムの通常の実行が中断されます。
`try` および `catch` キーワードを使用して例外を適切に処理し、プログラムを安定させることができます。
`try` ブロックには例外をスローする可能性のあるコードが含まれ、`catch` ブロックは例外が発生した場合に例外をキャッチして処理します。
例外は、その特定の型または例外の[スーパークラス](inheritance)に一致する最初の `catch` ブロックによってキャッチされます。

`try` および `catch` キーワードを一緒に使用する方法を次に示します。

```kotlin
try {
    // 例外をスローする可能性のあるコード
} catch (e: SomeException) {
    // 例外を処理するためのコード
}
```

`try-catch` を式として使用するのが一般的な方法です。これにより、`try` ブロックまたは `catch` ブロックから値を返すことができます。

```kotlin
fun main() {
    val num: Int = try {

        // count() が正常に完了した場合、その戻り値が num に割り当てられます
        count()
        
    } catch (e: ArithmeticException) {
        
        // count() が例外をスローした場合、catch ブロックは -1 を返します。
        // これは num に割り当てられます
        -1
    }
    println("Result: $num")
}

// ArithmeticException をスローする可能性のある関数をシミュレートします
fun count(): Int {
    
    // この値を変更して、num に別の値を返します
    val a = 0
    
    return 10 / a
}
```

同じ `try` ブロックに対して複数の `catch` ハンドラーを使用できます。
必要に応じて、さまざまな例外を個別に処理するために、必要な数の `catch` ブロックを追加できます。
複数の `catch` ブロックがある場合は、コード内で上から下の順に、最も
具体的な例外から最も具体的でない例外に順序付けすることが重要です。
この順序付けは、プログラムの実行フローに沿っています。

[カスタム例外](#create-custom-exceptions)を使用した次の例を考えてみましょう。

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

    // この値を変更して、さまざまなシナリオをテストします
    val withdrawalAmount = 500.5

    try {
        processWithdrawal(withdrawalAmount.toDouble(), availableFunds)

    // catch ブロックの順序は重要です!
    } catch (e: InsufficientFundsException) {
        println("Caught an InsufficientFundsException: ${e.message}")
    } catch (e: WithdrawalException) {
        println("Caught a WithdrawalException: ${e.message}")
    }
}
```

`WithdrawalException` を処理する一般的な catch ブロックは、`InsufficientFundsException` などの特定の例外を含む、その型のすべての例外をキャッチします。
ただし、より具体的な catch ブロックによって以前にキャッチされない限り。

### finally ブロック

`finally` ブロックには、`try` ブロックが正常に完了したか、
例外をスローしたかに関係なく、常に実行されるコードが含まれています。
`finally` ブロックを使用すると、`try` および `catch` ブロックの実行後にコードをクリーンアップできます。
これは、ファイルやネットワーク接続などのリソースを扱う場合に特に重要です。`finally` は、それらが適切に閉じられるか、解放されることを保証するためです。

`try-catch-finally` ブロックを通常一緒に使用する方法を次に示します。

```kotlin
try {
    // 例外をスローする可能性のあるコード
}
catch (e: YourException) {
    // 例外ハンドラー
}
finally {
    // 常に実行されるコード
}
```

`try` 式の戻り値は、`try` ブロックまたは `catch` ブロックのいずれかで最後に実行された式によって決定されます。
例外が発生しない場合、結果は `try` ブロックからのものです。例外が処理される場合、結果は `catch` ブロックからのものです。
`finally` ブロックは常に実行されますが、`try-catch` ブロックの結果は変更されません。

例を見てみましょう。

```kotlin
fun divideOrNull(a: Int): Int {
    
    // try ブロックは常に実行されます
    // ここでの例外 (ゼロによる除算) により、catch ブロックにすぐにジャンプします
    try {
        val b = 44 / a
        println("try block: Executing division: $b")
        return b
    }
    
    // catch ブロックは、ArithmeticException (a == 0 の場合はゼロによる除算) が原因で実行されます
    catch (e: ArithmeticException) {
        println("catch block: Encountered ArithmeticException $e")
        return -1
    }
    finally {
        println("finally block: The finally block is always executed")
    }
}

fun main() {
    
    // この値を変更して、別の結果を取得します。ArithmeticException は -1 を返します
    divideOrNull(0)
}
```

:::note
Kotlin では、[`AutoClosable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-auto-closeable/) インターフェイスを実装するリソースを管理する一般的な方法は、
`FileInputStream` や `FileOutputStream` などのファイルストリームと同様に、[`.use()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/use.html) 関数を使用することです。
この関数は、コードブロックが完了すると、例外がスローされたかどうかに関係なく、リソースを自動的に閉じます。
したがって、`finally` ブロックは必要ありません。
その結果、Kotlin では、リソース管理のために[Java の try-with-resources](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html) のような特別な構文は必要ありません。

```kotlin
FileWriter("test.txt").use { writer `->`
writer.write("some text") 
// このブロックの後、.use 関数は finally ブロックと同様に、自動的に writer.close() を呼び出します
}
```

:::

例外を処理せずにリソースのクリーンアップが必要な場合は、`catch` ブロックなしで `finally` ブロックとともに `try` を使用することもできます。

```kotlin
class MockResource { 
    fun use() { 
        println("Resource being used") 
        // リソースが使用されていることをシミュレートします
        // これにより、ゼロによる除算が発生した場合、ArithmeticException がスローされます
        val result = 100 / 0
        
        // 例外がスローされた場合、この行は実行されません
        println("Result: $result") 
    }
    
    fun close() { 
        println("Resource closed") 
    }
}

fun main() { 
    val resource = MockResource()

    try {
        
        // リソースを使用しようとします
        resource.use()
        
    } finally {
        
        // 例外が発生した場合でも、リソースが常に閉じられるようにします
        resource.close()
    }

    // 例外がスローされた場合、この行は出力されません
    println("End of the program")

}
```

ご覧のとおり、`finally` ブロックは、例外が発生したかどうかに関係なく、リソースが閉じられることを保証します。

Kotlin では、特定のニーズに応じて、`catch` ブロックのみ、`finally` ブロックのみ、またはその両方を柔軟に使用できますが、`try` ブロックには常に少なくとも 1 つの `catch` ブロックまたは `finally` ブロックが伴う必要があります。

## カスタム例外の作成

Kotlin では、組み込みの `Exception` クラスを拡張するクラスを作成することで、カスタム例外を定義できます。
これにより、アプリケーションのニーズに合わせて調整された、より具体的なエラータイプを作成できます。

例外を作成するには、`Exception` を拡張するクラスを定義します。

```kotlin
class MyException: Exception("My message")
```

この例では、デフォルトのエラーメッセージ「My message」がありますが、必要に応じて空白のままにすることができます。

:::note
Kotlin の例外はステートフルオブジェクトであり、[スタックトレース](#stack-trace)と呼ばれる、作成されたコンテキストに固有の情報を保持します。
[オブジェクト宣言](object-declarations#object-declarations-overview)を使用して例外を作成しないでください。
代わりに、例外が必要になるたびに、例外の新しいインスタンスを作成してください。
このようにして、例外の状態が特定のコンテキストを正確に反映するようにすることができます。

カスタム例外は、`ArithmeticException` サブクラスのように、既存の例外サブクラスのサブクラスにもなり得ます。

```kotlin
class NumberTooLargeException: ArithmeticException("My message")
```

カスタム例外のサブクラスを作成する場合は、親クラスを `open` として宣言する必要があります。
これは、[クラスがデフォルトで final である](inheritance)ため、そうでない場合はサブクラス化できません。

次に例を示します。

```kotlin
// カスタム例外を open クラスとして宣言し、サブクラス化可能にします
open class MyCustomException(message: String): Exception(message)

// カスタム例外のサブクラスを作成します
class SpecificCustomException: MyCustomException("Specific error message")
```

:::

カスタム例外は、組み込みの例外とまったく同じように動作します。`throw` キーワードを使用してスローし、
`try-catch-finally` ブロックを使用して処理できます。例を見てみましょう。

```kotlin
class NegativeNumberException: Exception("Parameter is less than zero.")
class NonNegativeNumberException: Exception("Parameter is a non-negative number.")

fun myFunction(number: Int) {
    if (number < 0) throw NegativeNumberException()
    else if (number >= 0) throw NonNegativeNumberException()
}

fun main() {
    
    // この関数の値を変更して、別の例外を取得します
    myFunction(1)
}
```

さまざまなエラーシナリオがあるアプリケーションでは、
例外の階層を作成すると、コードをより明確かつ具体的にするのに役立ちます。
これを行うには、[abstract class](classes#abstract-classes)または
[sealed class](sealed-classes#constructors)を共通の例外機能のベースとして使用し、詳細な例外タイプに対して特定の
サブクラスを作成します。
さらに、オプションのパラメーターを持つカスタム例外は、さまざまなメッセージで初期化できる柔軟性を提供し、
よりきめ細かいエラー処理を可能にします。

シールドされたクラス `AccountException` を例外階層のベースとして使用し、
クラス `APIKeyExpiredException`（サブクラス）を見てみましょう。これは、例外の詳細を改善するためのオプションのパラメーターの使用法を示しています。

```kotlin
// アカウント関連のエラーの例外階層のベースとして抽象クラスを作成します
sealed class AccountException(message: String, cause: Throwable? = null):
Exception(message, cause)

// AccountException のサブクラスを作成します
class InvalidAccountCredentialsException : AccountException("Invalid account credentials detected")

// AccountException のサブクラスを作成します。これにより、カスタムメッセージと原因を追加できます
class APIKeyExpiredException(message: String = "API key expired", cause: Throwable? = null)	: AccountException(message, cause)

// プレースホルダー関数の値を変更して、さまざまな結果を取得します
fun areCredentialsValid(): Boolean = true
fun isAPIKeyExpired(): Boolean = true

// アカウントの資格情報と API キーを検証します
fun validateAccount() {
    if (!areCredentialsValid()) throw InvalidAccountCredentialsException()
    if (isAPIKeyExpired()) {
        // 特定の原因で APIKeyExpiredException をスローする例
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

## Nothing 型

Kotlin では、すべての式に型があります。
式 `throw IllegalArgumentException()` の型は [`Nothing`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html) です。これは、組み込み型であり、
他のすべての型のサブタイプです。これは、[ボトム型](https://en.wikipedia.org/wiki/Bottom_type)とも呼ばれます。
これは、型エラーを引き起こすことなく、他の型が予期される戻り型またはジェネリック型として `Nothing` を使用できることを意味します。

`Nothing` は、常に例外をスローするか、無限ループのような無限の実行パスに入るため、正常に完了しない関数または式を表すために使用される Kotlin の特殊な型です。
`Nothing` を使用して、まだ実装されていない関数、または常に例外をスローするように設計された関数をマークできます。
これにより、コンパイラーとコードリーダーの両方に意図を明確に示すことができます。
コンパイラーが関数シグネチャで `Nothing` 型を推論すると、警告が表示されます。
戻り型として `Nothing` を明示的に定義すると、この警告を解消できます。

次の Kotlin コードは、`Nothing` 型の使用法を示しています。コンパイラーは、関数呼び出しの後のコードを
到達不能としてマークします。

```kotlin
class Person(val name: String?)

fun fail(message: String): Nothing {
    throw IllegalArgumentException(message)
    // この関数は正常に返されることはありません。
    // 常に例外をスローします。
}

fun main() {
    // 'name' が null の Person のインスタンスを作成します
    val person = Person(name = null)
    
    val s: String = person.name ?: fail("Name required")

    // この時点で 's' が初期化されていることが保証されます
    println(s)
}
```

Kotlin の [`TODO()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-t-o-d-o.html) 関数も `Nothing` 型を使用しており、コードの領域を強調表示するためのプレースホルダーとして機能します。
今後の実装が必要です。

```kotlin
fun notImplementedFunction(): Int {
    TODO("This function is not yet implemented")
}

fun main() {
    val result = notImplementedFunction()
    // これにより NotImplementedError がスローされます
    println(result)
}
```

ご覧のとおり、`TODO()` 関数は常に [`NotImplementedError`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-not-implemented-error/) 例外をスローします。

## 例外クラス

Kotlin に存在する一般的な例外型を見てみましょう。これらはすべて [`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/) クラスのサブクラスです。

* [`ArithmeticException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-arithmetic-exception/): この例外は、ゼロによる除算など、算術演算の実行が不可能な場合に発生します。

    ```kotlin
    val example = 2 / 0 // ArithmeticException をスローします
    ```

* [`IndexOutOfBoundsException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-index-out-of-bounds-exception/): この例外は、配列や文字列などの何らかのインデックスが範囲外であることを示すためにスローされます。

    ```kotlin
    val myList = mutableListOf(1, 2, 3)
    myList.removeAt(3)  // IndexOutOfBoundsException をスローします
    ```

    > この例外を回避するには、[`getOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-null.html) 関数などの、より安全な代替手段を使用してください。
    > 
    > ```kotlin
    > val myList = listOf(1, 2, 3)
    > // IndexOutOfBoundsException の代わりに null を返します
    > val element = myList.getOrNull(3)
    > println("Element at index 3: $element")
    > ```
    > 
    

* [`NoSuchElementException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-no-such-element-exception/): この例外は、特定のコレクションに存在しない要素にアクセスされた場合にスローされます。これは、特定の要素を必要とするメソッド（[`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) や [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html) など）を使用する場合に発生します。

    ```kotlin
    val emptyList = listOf<Int>()
    val firstElement = emptyList.first()  // NoSuchElementException をスローします
    ```

    > この例外を回避するには、[`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html) 関数などの、より安全な代替手段を使用してください。
    >
    > ```kotlin
    > val emptyList = listOf<Int>()
    > // NoSuchElementException の代わりに null を返します
    > val firstElement = emptyList.firstOrNull()
    > println("First element in empty list: $firstElement")
    > ```
    >
    

* [`NumberFormatException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-number-format-exception/): この例外は、文字列を数値型に変換しようとしたときに発生しますが、文字列の形式が適切ではありません。

    ```kotlin
    val string = "This is not a number"
    val number = string.toInt() // NumberFormatException をスローします
    ```
    
    > この例外を回避するには、[`toIntOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int-or-null.html) 関数などの、より安全な代替手段を使用してください。
    >
    > ```kotlin
    > val nonNumericString = "not a number"
    > // NumberFormatException の代わりに null を返します
    > val number = nonNumericString.toIntOrNull()
    > println("Converted number: $number")
    > ```
    >
    

* [`NullPointerException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/): この例外は、アプリケーションが `null` 値を持つオブジェクト参照を使用しようとした場合にスローされます。
Kotlin の null セーフティ機能により、NullPointerException のリスクは大幅に軽減されますが、
`!!` 演算子の意図的な使用、または Kotlin の null セーフティを欠く Java とのインタラクションによって発生する可能性があります。

    ```kotlin
    val text: String? = null
    println(text!!.length)  // NullPointerException をスローします
    ```

Kotlin ではすべての例外が unchecked であり、明示的にキャッチする必要はありませんが、必要に応じてキャッチできる柔軟性があります。

### 例外階層

Kotlin 例外階層のルートは、[`Throwable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) クラスです。
これには、[`Error`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-error/) と [`Exception`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/) の 2 つの直接的なサブクラスがあります。

* `Error` サブクラスは、アプリケーションが単独で回復できない可能性のある深刻な根本的な問題を表します。
これらは、一般的に処理しようとしない問題（[`OutOfMemoryError`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-out-of-memory-error/) や `StackOverflowError` など）です。

* `Exception` サブクラスは、処理したい可能性のある条件に使用されます。
`Exception` 型のサブタイプ（[`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/) や `IOException`（入出力例外）など）は、アプリケーションの例外的なイベントを処理します。

<img src="/img/throwable.svg" alt="Exception hierarchy - the Throwable class" width="700" style={{verticalAlign: 'middle'}}/>

`RuntimeException` は通常、プログラムコードの不十分なチェックによって発生し、プログラムで防止できます。
Kotlin は、`NullPointerException` のような一般的な `RuntimeExceptions` を防止するのに役立ち、ゼロによる除算のような潜在的なランタイムエラーについてコンパイル時の警告を提供します。次の図は、`RuntimeException` から派生したサブタイプの階層を示しています。

<img src="/img/runtime-exception.svg" alt="Hierarchy of RuntimeExceptions" width="700" style={{verticalAlign: 'middle'}}/>

## スタックトレース

_スタックトレース_ は、ランタイム環境によって生成されるレポートであり、デバッグに使用されます。
これは、プログラム内の特定の時点、特