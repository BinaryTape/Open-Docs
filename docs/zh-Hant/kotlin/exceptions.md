[//]: # (title: 例外)

例外狀況能幫助您的程式碼運行更具可預測性，即使在運行時發生可能中斷程式執行的錯誤。Kotlin 預設將所有例外視為 _unchecked_ (非檢查式)。Unchecked 例外簡化了例外處理的過程：您可以捕獲例外，但不需要明確處理或 [宣告](java-to-kotlin-interop.md#checked-exceptions) 它們。

> 欲了解 Kotlin 如何在與 Java、Swift 和 Objective-C 互動時處理例外，請參閱
> [與 Java、Swift 和 Objective-C 的例外互通性](#exception-interoperability-with-java-swift-and-objective-c) 一節。
>
{style="tip"}

處理例外主要包含兩個動作：

*   **拋出例外 (Throwing exceptions)：** 指示問題發生時。
*   **捕獲例外 (Catching exceptions)：** 透過解決問題或通知開發者或應用程式使用者來手動處理非預期的例外。

例外由 [`Exception`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/) 類別的子類別表示，而 `Exception` 類別又是 [`Throwable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) 類別的子類別。有關其繼承結構的更多資訊，請參閱 [例外繼承結構](#exception-hierarchy) 一節。由於 `Exception` 是一個 [`open class`](inheritance.md) (開放類別)，您可以建立 [自訂例外](#create-custom-exceptions) 來滿足您應用程式的特定需求。

## 拋出例外

您可以使用 `throw` 關鍵字手動拋出例外。拋出例外表示程式碼中發生了非預期的運行時錯誤。例外是 [物件](classes.md#creating-instances-of-classes)，拋出例外會建立例外類別的一個實例。

您可以拋出不帶任何參數的例外：

```kotlin
throw IllegalArgumentException()
```

為了更好地理解問題的來源，請包含額外資訊，例如自訂訊息和原始原因：

```kotlin
val cause = IllegalStateException("Original cause: illegal state")

// 如果 userInput 為負值，則拋出 IllegalArgumentException
// 此外，它顯示原始原因，由 cause IllegalStateException 表示
if (userInput < 0) {
    throw IllegalArgumentException("Input must be non-negative", cause)
}
```

在此範例中，當使用者輸入負值時，會拋出一個 `IllegalArgumentException`。您可以建立自訂錯誤訊息並保留例外的原始原因 (`cause`)，這將會包含在 [堆疊追蹤](#stack-trace) 中。

### 使用前置條件函式拋出例外

Kotlin 提供了其他方式，可以使用前置條件函式自動拋出例外。前置條件函式包括：

| 前置條件函式           | 使用情境                             | 拋出的例外                                                                                                 |
|--------------------------|--------------------------------------|------------------------------------------------------------------------------------------------------------------|
| [`require()`](#require-function) | 檢查使用者輸入的有效性             | [`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/)   |
| [`check()`](#check-function)     | 檢查物件或變數狀態的有效性         | [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)         |
| [`error()`](#error-function)     | 指示不合法的狀態或條件             | [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)         |

這些函式適用於程式流程在特定條件未滿足時無法繼續的情況。這能簡化您的程式碼，並使這些檢查的處理變得高效。

#### require() 函式

當輸入參數對函式的操作至關重要，且函式在這些參數無效時無法繼續執行時，請使用 [`require()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/require.html) 函式來驗證它們。

如果 `require()` 中的條件未滿足，它會拋出一個 [`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/)：

```kotlin
fun getIndices(count: Int): List<Int> {
    require(count >= 0) { "Count must be non-negative. You set count to $count." }
    return List(count) { it + 1 }
}

fun main() {
    // 這會導致 IllegalArgumentException 失敗
    println(getIndices(-1))
    
    // 解除註解下方行以查看工作範例
    // println(getIndices(3))
    // [1, 2, 3]
}
```
{kotlin-runnable="true"}

> `require()` 函式允許編譯器執行 [智慧型轉型 (smart casting)](typecasts.md#smart-casts)。
> 成功檢查後，變數會自動轉型為非空值型別。
> 這些函式常用於空值性檢查，以確保變數在繼續執行前不為空值。例如：
>
> ```kotlin
> fun printNonNullString(str: String?) {
>     // Nullability check
>     require(str != null) 
>     // After this successful check, 'str' is guaranteed to be 
>     // non-null and is automatically smart cast to non-nullable String
>     println(str.length)
> }
> ```
>
{style="note"}

#### check() 函式

使用 [`check()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/check.html) 函式來驗證物件或變數的狀態。如果檢查失敗，則表示需要解決的邏輯錯誤。

如果 `check()` 函式中指定的條件為 `false`，它會拋出一個 [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)：

```kotlin
fun main() {
    var someState: String? = null

    fun getStateValue(): String {

        val state = checkNotNull(someState) { "State must be set beforehand!" }
        check(state.isNotEmpty()) { "State must be non-empty!" }
        return state
    }
    // 如果您解除註解下方行，程式將因 IllegalStateException 而失敗
    // getStateValue()

    someState = ""

    // 如果您解除註解下方行，程式將因 IllegalStateException 而失敗
    // getStateValue() 
    someState = "non-empty-state"

    // 這會列印 "non-empty-state"
    println(getStateValue())
}
```
{kotlin-runnable="true"}

> `check()` 函式允許編譯器執行 [智慧型轉型 (smart casting)](typecasts.md#smart-casts)。
> 成功檢查後，變數會自動轉型為非空值型別。
> 這些函式常用於空值性檢查，以確保變數在繼續執行前不為空值。例如：
>
> ```kotlin
> fun printNonNullString(str: String?) {
>     // Nullability check
>     check(str != null) 
>     // After this successful check, 'str' is guaranteed to be 
>     // non-null and is automatically smart cast to non-nullable String
>     println(str.length)
> }
> ```
>
{style="note"}

#### error() 函式

[`error()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/error.html) 函式用於發出程式碼中不應邏輯性發生的不合法狀態或條件訊號。它適用於您希望在程式碼中有意拋出例外的情況，例如當程式碼遇到非預期狀態時。此函式在 `when` 運算式中特別有用，提供了一種清晰的方式來處理邏輯上不應發生的情況。

在以下範例中，`error()` 函式用於處理未定義的使用者角色。如果角色不是預定義的角色之一，則會拋出一個 [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)：

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
    // 這會按預期工作
    val user1 = User("Alice", "admin")
    processUserRole(user1)
    // Alice is an admin.

    // 這會拋出一個 IllegalStateException
    val user2 = User("Bob", "guest")
    processUserRole(user2)
}
```
{kotlin-runnable="true"}

## 使用 try-catch 區塊處理例外

當例外被拋出時，它會中斷程式的正常執行。您可以使用 `try` 和 `catch` 關鍵字優雅地處理例外，以保持程式穩定。`try` 區塊包含可能拋出例外的程式碼，而 `catch` 區塊則在例外發生時捕獲並處理它。例外會被第一個符合其特定型別或其 [父類別](inheritance.md) 的 `catch` 區塊捕獲。

以下是 `try` 和 `catch` 關鍵字的用法：

```kotlin
try {
    // 可能拋出例外的程式碼
} catch (e: SomeException) {
    // 處理例外的程式碼
}
```

將 `try-catch` 作為運算式使用是一種常見的方法，這樣它就可以從 `try` 區塊或 `catch` 區塊返回一個值：

```kotlin
fun main() {
    val num: Int = try {

        // 如果 count() 成功完成，其返回值將賦予 num
        count()
        
    } catch (e: ArithmeticException) {
        
        // 如果 count() 拋出例外，catch 區塊將返回 -1，
        // 並賦予 num
        -1
    }
    println("Result: $num")
}

// 模擬可能拋出 ArithmeticException 的函式
fun count(): Int {
    
    // 更改此值以返回不同的值給 num
    val a = 0
    
    return 10 / a
}
```
{kotlin-runnable="true"}

您可以為同一個 `try` 區塊使用多個 `catch` 處理器。您可以根據需要添加任意數量的 `catch` 區塊，以區分處理不同的例外。當您有多個 `catch` 區塊時，重要的是依照程式碼中從最具體到最不具體的例外，以由上而下的順序排列它們。這種排序與程式的執行流程一致。

考慮以下使用 [自訂例外](#create-custom-exceptions) 的範例：

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

    // 更改此值以測試不同情境
    val withdrawalAmount = 500.5

    try {
        processWithdrawal(withdrawalAmount.toDouble(), availableFunds)

    // catch 區塊的順序很重要！
    } catch (e: InsufficientFundsException) {
        println("Caught an InsufficientFundsException: ${e.message}")
    } catch (e: WithdrawalException) {
        println("Caught a WithdrawalException: ${e.message}")
    }
}
```
{kotlin-runnable="true"}

處理 `WithdrawalException` 的一般 `catch` 區塊會捕獲其所有類型的例外，包括像 `InsufficientFundsException` 這樣的特定例外，除非它們在更早的 `catch` 區塊中被捕獲。

### finally 區塊

`finally` 區塊包含的程式碼總是會執行，無論 `try` 區塊是成功完成還是拋出例外。使用 `finally` 區塊，您可以在 `try` 和 `catch` 區塊執行後清理程式碼。這在處理檔案或網路連線等資源時尤為重要，因為 `finally` 保證它們會被正確關閉或釋放。

以下是 `try-catch-finally` 區塊的典型用法：

```kotlin
try {
    // 可能拋出例外的程式碼
}
catch (e: YourException) {
    // 例外處理器
}
finally {
    // 總是會執行的程式碼
}
```

`try` 運算式的返回值由 `try` 或 `catch` 區塊中最後執行的運算式決定。如果沒有例外發生，結果來自 `try` 區塊；如果處理了例外，則來自 `catch` 區塊。`finally` 區塊總是會執行，但它不會改變 `try-catch` 區塊的結果。

讓我們看一個範例來演示：

```kotlin
fun divideOrNull(a: Int): Int {
    
    // try 區塊總是會執行
    // 這裡的例外 (除以零) 會導致立即跳轉到 catch 區塊
    try {
        val b = 44 / a
        println("try block: Executing division: $b")
        return b
    }
    
    // 由於 ArithmeticException (如果 a == 0 則除以零)，catch 區塊會執行
    catch (e: ArithmeticException) {
        println("catch block: Encountered ArithmeticException $e")
        return -1
    }
    finally {
        println("finally block: The finally block is always executed")
    }
}

fun main() {
    
    // 更改此值以獲得不同的結果。ArithmeticException 將返回：-1
    divideOrNull(0)
}
```
{kotlin-runnable="true"}

> 在 Kotlin 中，管理實現 [`AutoClosable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-auto-closeable/) 介面的資源（例如 `FileInputStream` 或 `FileOutputStream` 等檔案串流）的慣用語法是使用 [`.use()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/use.html) 函式。
> 此函式會在程式碼區塊完成時自動關閉資源，無論是否拋出例外，從而消除了對 `finally` 區塊的需求。
> 因此，Kotlin 不需要像 [Java 的 try-with-resources](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html) 那樣的特殊語法來管理資源。
>
> ```kotlin
> FileWriter("test.txt").use { writer ->
> writer.write("some text") 
> // After this block, the .use function automatically calls writer.close(), similar to a finally block
> }
> ```
> 
{style="note"}

如果您的程式碼需要資源清理而不處理例外，您也可以單獨使用 `try` 與 `finally` 區塊，而無需 `catch` 區塊：

```kotlin
class MockResource { 
    fun use() { 
        println("Resource being used") 
        // 模擬資源正在使用 
        // 如果發生除以零，這會拋出 ArithmeticException
        val result = 100 / 0
        
        // 如果拋出例外，則此行不執行
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
        
        // 嘗試使用資源 
        resource.use()
        
    } finally {
        
        // 確保資源總是關閉，即使發生例外 
        resource.close()
    }

    // 如果拋出例外，則此行不列印
    println("End of the program")
//sampleEnd
}
```
{kotlin-runnable="true"}

如您所見，`finally` 區塊保證資源會被關閉，無論是否發生例外。

在 Kotlin 中，您可以根據特定需求靈活地僅使用 `catch` 區塊、僅使用 `finally` 區塊，或兩者都使用，但 `try` 區塊必須始終至少伴隨一個 `catch` 區塊或一個 `finally` 區塊。

## 建立自訂例外

在 Kotlin 中，您可以透過建立擴展內建 `Exception` 類別的類別來定義自訂例外。這使您能夠建立更符合應用程式需求的特定錯誤類型。

要建立一個，您可以定義一個擴展 `Exception` 的類別：

```kotlin
class MyException: Exception("My message")
```

在此範例中，有一個預設錯誤訊息「My message」，但您可以根據需要留空。

> Kotlin 中的例外是有狀態的物件，攜帶著與其建立上下文相關的資訊，這些資訊被稱為 [堆疊追蹤](#stack-trace)。
> 避免使用 [物件宣告 (object declarations)](object-declarations.md#object-declarations-overview) 建立例外。
> 相反地，每次您需要例外時，都請建立一個新的例外實例。
> 這樣可以確保例外的狀態準確反映特定上下文。
>
{style="tip"}

自訂例外也可以是任何現有例外子類別的子類別，例如 `ArithmeticException` 子類別：

```kotlin
class NumberTooLargeException: ArithmeticException("My message")
```

> 如果您想建立自訂例外的子類別，則必須將父類別宣告為 `open`，因為 [類別預設為 `final`](inheritance.md)，否則無法建立子類別。
>
> 例如：
>
> ```kotlin
> // Declares a custom exception as an open class, making it subclassable
> open class MyCustomException(message: String): Exception(message)
>
> // Creates a subclass of the custom exception
> class SpecificCustomException: MyCustomException("Specific error message")
> ```
>
{style="note"}

自訂例外的行為與內建例外相同。您可以使用 `throw` 關鍵字拋出它們，並使用 `try-catch-finally` 區塊處理它們。讓我們看一個範例來演示：

```kotlin
class NegativeNumberException: Exception("Parameter is less than zero.")
class NonNegativeNumberException: Exception("Parameter is a non-negative number.")

fun myFunction(number: Int) {
    if (number < 0) throw NegativeNumberException()
    else if (number >= 0) throw NonNegativeNumberException()
}

fun main() {
    
    // 更改此函式中的值以獲得不同的例外
    myFunction(1)
}
```
{kotlin-runnable="true"}

在具有多樣化錯誤情境的應用程式中，建立例外繼承結構有助於使程式碼更清晰和更具體。您可以透過使用 [抽象類別 (abstract class)](classes.md#abstract-classes) 或 [密封類別 (sealed class)](sealed-classes.md#constructors) 作為共同例外功能的基礎，並為詳細例外類型建立特定的子類別來實現此目標。此外，包含帶有預設值的參數的自訂例外提供了靈活性，允許以不同的訊息進行初始化，從而實現更細粒度的錯誤處理。

讓我們看一個範例，使用密封類別 `AccountException` 作為例外繼承結構的基礎，以及作為子類別的 `APIKeyExpiredException` 類別，該類別展示了帶有預設值的參數的使用，以提供更詳細的例外資訊：

```kotlin
//sampleStart
// 建立一個密封類別作為帳戶相關錯誤的例外繼承結構的基礎
sealed class AccountException(message: String, cause: Throwable? = null):
Exception(message, cause)

// 建立 AccountException 的子類別
class InvalidAccountCredentialsException : AccountException("Invalid account credentials detected")

// 建立 AccountException 的子類別，它允許添加自訂訊息和原因
class APIKeyExpiredException(message: String = "API key expired", cause: Throwable? = null)	: AccountException(message, cause)

// 更改佔位符函式的值以獲得不同的結果
fun areCredentialsValid(): Boolean = true
fun isAPIKeyExpired(): Boolean = true
//sampleEnd

// 驗證帳戶憑證和 API 金鑰
fun validateAccount() {
    if (!areCredentialsValid()) throw InvalidAccountCredentialsException()
    if (isAPIKeyExpired()) {
        // 拋出 APIKeyExpiredException 並帶有特定原因的範例
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

## Nothing 型別

在 Kotlin 中，每個運算式都有一個型別。運算式 `throw IllegalArgumentException()` 的型別是 [`Nothing`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)，這是一個內建型別，是所有其他型別的子型別，也稱為 [底部型別 (bottom type)](https://en.wikipedia.org/wiki/Bottom_type)。這表示 `Nothing` 可以用作任何其他型別預期的回傳型別或泛型型別，而不會導致型別錯誤。

`Nothing` 是 Kotlin 中的一種特殊型別，用於表示永不成功完成的函式或運算式，原因可能是它們總是拋出例外，或者進入像無限迴圈一樣的無盡執行路徑。您可以使用 `Nothing` 來標記尚未實作或旨在始終拋出例外的函式，清晰地向編譯器和程式碼讀取者表明您的意圖。如果編譯器在函式簽章中推斷出 `Nothing` 型別，它會警告您。明確地將 `Nothing` 定義為回傳型別可以消除此警告。

此 Kotlin 程式碼示範了 `Nothing` 型別的使用，其中編譯器將函式呼叫後的程式碼標記為不可達：

```kotlin
class Person(val name: String?)

fun fail(message: String): Nothing {
    throw IllegalArgumentException(message)
    // 此函式將永不成功返回。
    // 它將總是拋出例外。
}

fun main() {
    // 建立一個 Person 實例，其中 'name' 為 null
    val person = Person(name = null)
    
    val s: String = person.name ?: fail("Name required")

    // 於此時，'s' 保證已初始化
    println(s)
}
```
{kotlin-runnable="true"}

Kotlin 的 [`TODO()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-t-o-d-o.html) 函式也使用 `Nothing` 型別，它作為一個佔位符，用於標記程式碼中需要未來實作的區域：

```kotlin
fun notImplementedFunction(): Int {
    TODO("This function is not yet implemented")
}

fun main() {
    val result = notImplementedFunction()
    // 這會拋出一個 NotImplementedError
    println(result)
}
```
{kotlin-runnable="true"}

如您所見，`TODO()` 函式總是拋出一個 [`NotImplementedError`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-not-implemented-error/) 例外。

## 例外類別

讓我們探討一些 Kotlin 中常見的例外型別，它們都是 [`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/) 類別的子類別：

*   [`ArithmeticException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-arithmetic-exception/)：此例外發生於算術運算無法執行時，例如除以零。

    ```kotlin
    val example = 2 / 0 // throws ArithmeticException
    ```

*   [`IndexOutOfBoundsException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-index-out-of-bounds-exception/)：拋出此例外表示某種索引（例如陣列或字串的索引）超出範圍。

    ```kotlin
    val myList = mutableListOf(1, 2, 3)
    myList.removeAt(3)  // throws IndexOutOfBoundsException
    ```

    > 為了避免此例外，請使用更安全的替代方案，例如 [`getOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-null.html) 函式：
    > 
    > ```kotlin
    > val myList = listOf(1, 2, 3)
    > // Returns null, instead of IndexOutOfBoundsException
    > val element = myList.getOrNull(3)
    > println("Element at index 3: $element")
    > ```
    > 
{style="note"}

*   [`NoSuchElementException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-no-such-element-exception/)：當存取特定集合中不存在的元素時，會拋出此例外。它在使用預期特定元素的方法（例如 [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 或 [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)）時發生。

    ```kotlin
    val emptyList = listOf<Int>()
    val firstElement = emptyList.first()  // throws NoSuchElementException
    ```

    > 為了避免此例外，請使用更安全的替代方案，例如 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html) 函式：
    >
    > ```kotlin
    > val emptyList = listOf<Int>()
    > // Returns null, instead of NoSuchElementException
    > val firstElement = emptyList.firstOrNull()
    > println("First element in empty list: $firstElement")
    > ```
    >
{style="note"}

*   [`NumberFormatException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-number-format-exception/)：當嘗試將字串轉換為數值型別，但字串格式不正確時，會發生此例外。

    ```kotlin
    val string = "This is not a number"
    val number = string.toInt() // throws NumberFormatException
    ```
    
    > 為了避免此例外，請使用更安全的替代方案，例如 [`toIntOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int-or-null.html) 函式：
    >
    > ```kotlin
    > val nonNumericString = "not a number"
    > // Returns null, instead of NumberFormatException
    > val number = nonNumericString.toIntOrNull()
    > println("Converted number: $number")
    > ```
    >
{style="note"}

*   [`NullPointerException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/)：當應用程式嘗試使用值為 `null` 的物件引用時，會拋出此例外。即使 Kotlin 的空值安全功能顯著降低了 `NullPointerException` 的風險，但它們仍可能透過刻意使用 `!!` 運算符或與缺乏 Kotlin 空值安全的 Java 互動時發生。

    ```kotlin
    val text: String? = null
    println(text!!.length)  // throws a NullPointerException
    ```

儘管 Kotlin 中所有例外都是 unchecked，且您不必明確捕獲它們，但您仍然可以根據需要靈活地捕獲它們。

### 例外繼承結構

Kotlin 例外繼承結構的根是 [`Throwable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) 類別。它有兩個直接子類別：[`Error`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-error/) 和 [`Exception`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/)：

*   `Error` 子類別代表應用程式本身可能無法恢復的嚴重基本問題。這些是您通常不會嘗試處理的問題，例如 [`OutOfMemoryError`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-out-of-memory-error/) 或 `StackOverflowError`。

*   `Exception` 子類別用於您可能希望處理的條件。`Exception` 型別的子型別，例如 [`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/) 和 `IOException` (輸入/輸出例外)，處理應用程式中的例外事件。

![Exception hierarchy - the Throwable class](throwable.svg){width=700}

`RuntimeException` 通常是由程式碼中檢查不足引起的，可以透過程式設計方式預防。Kotlin 有助於預防常見的 `RuntimeException`，例如 `NullPointerException`，並為潛在的運行時錯誤（例如除以零）提供編譯時警告。下圖展示了從 `RuntimeException` 繼承的子型別階層：

![Hierarchy of RuntimeExceptions](runtime-exception.svg){width=700}

## 堆疊追蹤

_堆疊追蹤 (stack trace)_ 是一份由運行時環境生成的報告，用於除錯。它顯示了導致程式中特定點（特別是發生錯誤或例外之處）的函式呼叫序列。

讓我們看一個在 JVM 環境中因例外而自動列印堆疊追蹤的範例：

```kotlin
fun main() {
//sampleStart    
    throw ArithmeticException("This is an arithmetic exception!")
//sampleEnd    
}
```
{kotlin-runnable="true"}

在 JVM 環境中執行此程式碼會產生以下輸出：

```text
Exception in thread "main" java.lang.ArithmeticException: This is an arithmetic exception!
    at MainKt.main(Main.kt:3)
    at MainKt.main(Main.kt)
```

第一行是例外描述，其中包括：

*   例外型別：`java.lang.ArithmeticException`
*   執行緒：`main`
*   例外訊息：`"This is an arithmetic exception!"`

例外描述之後，每行以 `at` 開頭的都是堆疊追蹤。單行稱為 _堆疊追蹤元素_ 或 _堆疊框架_：

*   `at MainKt.main (Main.kt:3)`：這顯示了方法名稱 (`MainKt.main`) 以及呼叫該方法的原始檔案和行號 (`Main.kt:3`)。
*   `at MainKt.main (Main.kt)`：這表示例外發生在 `Main.kt` 檔案的 `main()` 函式中。

## 與 Java、Swift 和 Objective-C 的例外互通性

由於 Kotlin 將所有例外視為 unchecked，當從區分檢查式與非檢查式例外的語言呼叫這些例外時，可能會導致複雜性。為了彌補 Kotlin 與 Java、Swift 和 Objective-C 等語言之間例外處理的差異，您可以使用 [`@Throws`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throws/) 註解。此註解會提醒呼叫者可能的例外。更多資訊請參閱 [從 Java 呼叫 Kotlin](java-to-kotlin-interop.md#checked-exceptions) 和 [與 Swift/Objective-C 的互通性](native-objc-interop.md#errors-and-exceptions)。