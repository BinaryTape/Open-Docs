[//]: # (title: 例外)

例外 (Exceptions) 有助於您的程式碼運行更可預測，即使在可能中斷程式執行的執行時錯誤 (runtime errors) 發生時亦然。Kotlin 預設將所有例外視為 _非檢查型_ (unchecked)。非檢查型例外簡化了例外處理流程：您可以捕捉例外，但無需明確處理或 [宣告](java-to-kotlin-interop.md#checked-exceptions) 它們。

> 欲了解更多關於 Kotlin 在與 Java、Swift 和 Objective-C 互動時如何處理例外，請參閱
> [例外與 Java、Swift 和 Objective-C 的互通性](#exception-interoperability-with-java-swift-and-objective-c) 章節。
>
{style="tip"}

處理例外包含兩個主要動作：

*   **拋出例外 (Throwing exceptions)：** 指示問題何時發生。
*   **捕捉例外 (Catching exceptions)：** 手動處理非預期的例外，方式是解決問題或通知開發者或應用程式使用者。

例外由 [`Exception`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/) 類別的子類別表示，而 `Exception` 類別又是 [`Throwable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) 類別的子類別。有關階層的更多資訊，請參閱 [例外階層](#exception-hierarchy) 章節。由於 `Exception` 是一個 [`open class`](inheritance.md)，您可以建立 [自訂例外](#create-custom-exceptions) 以符合應用程式的特定需求。

## 拋出例外

您可以使用 `throw` 關鍵字手動拋出例外。拋出例外表示程式碼中發生了非預期的執行時錯誤。例外是 [物件](classes.md#creating-instances-of-classes)，拋出例外會建立例外類別的一個實例。

您可以不帶任何參數地拋出例外：

```kotlin
throw IllegalArgumentException()
```

為了更好地理解問題的來源，請包含額外資訊，例如自訂訊息和原始原因：

```kotlin
val cause = IllegalStateException("Original cause: illegal state")

// Throws an IllegalArgumentException if userInput is negative 
// Additionally, it shows the original cause, represented by the cause IllegalStateException
if (userInput < 0) {
    throw IllegalArgumentException("Input must be non-negative", cause)
}
```

在此範例中，當使用者輸入負值時，會拋出 `IllegalArgumentException`。您可以建立自訂錯誤訊息並保留例外的原始原因 (`cause`)，這將包含在 [堆疊追蹤](#stack-trace) 中。

### 使用前置條件函式拋出例外

Kotlin 提供了額外的方法，可以使用前置條件函式 (precondition functions) 自動拋出例外。前置條件函式包括：

| 前置條件函式             | 使用情境                                 | 拋出的例外                                                                                                 |
|--------------------------|------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| [`require()`](#require-function) | 檢查使用者輸入有效性               | [`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/)   |
| [`check()`](#check-function)     | 檢查物件或變數狀態有效性 | [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)         |
| [`error()`](#error-function)     | 指示非法狀態或條件  | [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)         |

這些函式適用於程式流程在特定條件未滿足時無法繼續的情況。這可以簡化您的程式碼，並使這些檢查的處理更有效率。

#### require() 函式

使用 [`require()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/require.html) 函式來驗證輸入參數，當這些參數對於函式的操作至關重要，且如果這些參數無效，函式無法繼續執行時。

如果 `require()` 中的條件未滿足，它會拋出一個 [`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/)：

```kotlin
fun getIndices(count: Int): List<Int> {
    require(count >= 0) { "Count must be non-negative. You set count to $count." }
    return List(count) { it + 1 }
}

fun main() {
    // This fails with an IllegalArgumentException
    println(getIndices(-1))
    
    // Uncomment the line below to see a working example
    // println(getIndices(3))
    // [1, 2, 3]
}
```
{kotlin-runnable="true"}

> `require()` 函式允許編譯器執行 [智慧型轉型](typecasts.md#smart-casts)。
> 成功檢查後，變數會自動轉型為不可空型別 (non-nullable type)。
> 這些函式經常用於空值檢查 (nullability checks)，以確保變數在繼續執行之前不為空。例如：
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
    // If you uncomment the line below then the program fails with IllegalStateException
    // getStateValue()

    someState = ""

    // If you uncomment the line below then the program fails with IllegalStateException
    // getStateValue() 
    someState = "non-empty-state"

    // This prints "non-empty-state"
    println(getStateValue())
}
```
{kotlin-runnable="true"}

> `check()` 函式允許編譯器執行 [智慧型轉型](typecasts.md#smart-casts)。
> 成功檢查後，變數會自動轉型為不可空型別。
> 這些函式經常用於空值檢查，以確保變數在繼續執行之前不為空。例如：
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

[`error()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/error.html) 函式用於發出程式碼中邏輯上不應該發生的非法狀態或條件的訊號。它適用於您想故意在程式碼中拋出例外的場景，例如當程式碼遇到非預期狀態時。此函式在 `when` 表達式中特別有用，提供了一種清晰地處理邏輯上不應該發生的情況的方法。

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
    // This works as expected
    val user1 = User("Alice", "admin")
    processUserRole(user1)
    // Alice is an admin.

    // This throws an IllegalStateException
    val user2 = User("Bob", "guest")
    processUserRole(user2)
}
```
{kotlin-runnable="true"}

## 使用 try-catch 區塊處理例外

當例外被拋出時，它會中斷程式的正常執行。您可以使用 `try` 和 `catch` 關鍵字優雅地處理例外，以保持程式穩定。`try` 區塊包含可能拋出例外程式碼，而 `catch` 區塊則在例外發生時捕捉並處理它。例外會被第一個符合其特定型別或例外 [父類別](inheritance.md) 的 `catch` 區塊捕捉。

以下是如何同時使用 `try` 和 `catch` 關鍵字：

```kotlin
try {
    // Code that may throw an exception
} catch (e: SomeException) {
    // Code for handling the exception
}
```

將 `try-catch` 作為表達式使用是一種常見的方法，因此它可以在 `try` 區塊或 `catch` 區塊中返回值：

```kotlin
fun main() {
    val num: Int = try {

        // If count() completes successfully, its return value is assigned to num
        count()
        
    } catch (e: ArithmeticException) {
        
        // If count() throws an exception, the catch block returns -1, 
        // which is assigned to num
        -1
    }
    println("Result: $num")
}

// Simulates a function that might throw ArithmeticException
fun count(): Int {
    
    // Change this value to return a different value to num
    val a = 0
    
    return 10 / a
}
```
{kotlin-runnable="true"}

您可以為相同的 `try` 區塊使用多個 `catch` 處理器。您可以根據需要添加任意數量的 `catch` 區塊，以獨特地處理不同的例外。當您有多個 `catch` 區塊時，重要的是要按照從最特定到最不特定的例外順序排列它們，在程式碼中遵循由上到下的順序。這種排序與程式的執行流程一致。

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

    // Change this value to test different scenarios
    val withdrawalAmount = 500.5

    try {
        processWithdrawal(withdrawalAmount.toDouble(), availableFunds)

    // The order of catch blocks is important!
    } catch (e: InsufficientFundsException) {
        println("Caught an InsufficientFundsException: ${e.message}")
    } catch (e: WithdrawalException) {
        println("Caught a WithdrawalException: ${e.message}")
    }
}
```
{kotlin-runnable="true"}

處理 `WithdrawalException` 的一般 `catch` 區塊會捕捉其型別的所有例外，包括像 `InsufficientFundsException` 這樣的特定例外，除非它們被更特定的 `catch` 區塊提前捕捉。

### finally 區塊

`finally` 區塊包含總是執行的程式碼，無論 `try` 區塊是成功完成還是拋出例外。透過 `finally` 區塊，您可以在 `try` 和 `catch` 區塊執行後清理程式碼。這在使用檔案或網路連線等資源時尤為重要，因為 `finally` 保證它們會被正確關閉或釋放。

以下是您通常如何同時使用 `try-catch-finally` 區塊：

```kotlin
try {
    // Code that may throw an exception
}
catch (e: YourException) {
    // Exception handler
}
finally {
    // Code that is always executed
}
```

`try` 表達式的返回值由 `try` 或 `catch` 區塊中最後執行的表達式決定。如果沒有例外發生，結果來自 `try` 區塊；如果例外被處理，結果來自 `catch` 區塊。`finally` 區塊總是執行，但它不會改變 `try-catch` 區塊的結果。

讓我們看一個範例來演示：

```kotlin
fun divideOrNull(a: Int): Int {
    
    // The try block is always executed
    // An exception here (division by zero) causes an immediate jump to the catch block
    try {
        val b = 44 / a
        println("try block: Executing division: $b")
        return b
    }
    
    // The catch block is executed due to the ArithmeticException (division by zero if a ==0)
    catch (e: ArithmeticException) {
        println("catch block: Encountered ArithmeticException $e")
        return -1
    }
    finally {
        println("finally block: The finally block is always executed")
    }
}

fun main() {
    
    // Change this value to get a different result. An ArithmeticException will return: -1
    divideOrNull(0)
}
```
{kotlin-runnable="true"}

> 在 Kotlin 中，管理實作 [`AutoClosable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-auto-closeable/) 介面的資源的慣用方法，例如 `FileInputStream` 或 `FileOutputStream` 等檔案串流，是使用 [`.use()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/use.html) 函式。此函式會在程式碼區塊完成時自動關閉資源，無論是否拋出例外，從而消除了對 `finally` 區塊的需求。因此，Kotlin 不需要像 [Java 的 try-with-resources](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html) 這樣的特殊語法來進行資源管理。
>
> ```kotlin
> FileWriter("test.txt").use { writer ->
> writer.write("some text") 
> // After this block, the .use function automatically calls writer.close(), similar to a finally block
> }
> ```
>
{style="note"}

如果您的程式碼需要在不處理例外的情況下清理資源，您也可以僅使用 `try` 搭配 `finally` 區塊，而不使用 `catch` 區塊：

```kotlin
class MockResource { 
    fun use() { 
        println("Resource being used") 
        // Simulate a resource being used 
        // This throws an ArithmeticException if division by zero occurs
        val result = 100 / 0
        
        // This line is not executed if an exception is thrown
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
        
        // Attempts to use the resource 
        resource.use()
        
    } finally {
        
        // Ensures that the resource is always closed, even if an exception occurs 
        resource.close()
    }

    // This line is not printed if an exception is thrown
    println("End of the program")
//sampleEnd
}
```
{kotlin-runnable="true"}

如您所見，`finally` 區塊保證資源會被關閉，無論是否發生例外。

在 Kotlin 中，您可以靈活地僅使用 `catch` 區塊、僅使用 `finally` 區塊或兩者都使用，具體取決於您的特定需求，但 `try` 區塊必須始終至少伴隨一個 `catch` 區塊或一個 `finally` 區塊。

## 建立自訂例外

在 Kotlin 中，您可以透過建立擴展內建 `Exception` 類別的類別來定義自訂例外。這允許您建立更特定、針對應用程式需求量身定制的錯誤型別。

要建立一個，您可以定義一個擴展 `Exception` 的類別：

```kotlin
class MyException: Exception("My message")
```

在此範例中，有一個預設錯誤訊息「My message」，但如果您願意，可以將其留空。

> Kotlin 中的例外是有狀態物件 (stateful objects)，攜帶與其建立上下文相關的資訊，即 [堆疊追蹤](#stack-trace)。
> 避免使用 [物件宣告](object-declarations.md#object-declarations-overview) 建立例外。
> 相反，每次需要時都建立一個新的例外實例。
> 這樣，您可以確保例外的狀態準確反映特定上下文。
>
{style="tip"}

自訂例外也可以是任何預存在例外子類別的子類別，例如 `ArithmeticException` 子類別：

```kotlin
class NumberTooLargeException: ArithmeticException("My message")
```

> 如果您想建立自訂例外的子類別，則必須將父類別宣告為 `open`，
> 因為 [類別預設為 final](inheritance.md)，否則無法被子類別化。
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

自訂例外表現得就像內建例外一樣。您可以使用 `throw` 關鍵字拋出它們，並使用 `try-catch-finally` 區塊處理它們。讓我們看一個範例來演示：

```kotlin
class NegativeNumberException: Exception("Parameter is less than zero.")
class NonNegativeNumberException: Exception("Parameter is a non-negative number.")

fun myFunction(number: Int) {
    if (number < 0) throw NegativeNumberException()
    else if (number >= 0) throw NonNegativeNumberException()
}

fun main() {
    
    // Change the value in this function to a get a different exception
    myFunction(1)
}
```
{kotlin-runnable="true"}

在具有多樣錯誤情境的應用程式中，建立例外階層可以幫助使程式碼更清晰、更具體。您可以透過使用 [抽象類別](classes.md#abstract-classes) 或 [密封類別](sealed-classes.md#constructors) 作為共同例外功能的基礎，並為詳細例外型別建立特定子類別來實現這一點。此外，帶有可選參數的自訂例外提供了靈活性，允許使用不同訊息進行初始化，從而實現更細粒度的錯誤處理。

讓我們看一個使用密封類別 `AccountException` 作為例外階層基礎的範例，以及子類別 `APIKeyExpiredException`，它展示了如何使用可選參數來改進例外細節：

```kotlin
//sampleStart
// Creates a sealed class as the base for an exception hierarchy for account-related errors
sealed class AccountException(message: String, cause: Throwable? = null):
Exception(message, cause)

// Creates a subclass of AccountException
class InvalidAccountCredentialsException : AccountException("Invalid account credentials detected")

// Creates a subclass of AccountException, which allows the addition of custom messages and causes
class APIKeyExpiredException(message: String = "API key expired", cause: Throwable? = null)	: AccountException(message, cause)

// Change values of placeholder functions to get different results
fun areCredentialsValid(): Boolean = true
fun isAPIKeyExpired(): Boolean = true
//sampleEnd

// Validates account credentials and API key
fun validateAccount() {
    if (!areCredentialsValid()) throw InvalidAccountCredentialsException()
    if (isAPIKeyExpired()) {
        // Example of throwing APIKeyExpiredException with a specific cause
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

在 Kotlin 中，每個表達式都有一個型別。表達式 `throw IllegalArgumentException()` 的型別是 [`Nothing`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)，這是一個內建型別，是所有其他型別的子型別，也稱為 [底部型別](https://en.wikipedia.org/wiki/Bottom_type)。這表示 `Nothing` 可以用作返回值型別或泛型型別，在預期任何其他型別的地方使用，而不會導致型別錯誤。

`Nothing` 是 Kotlin 中一種特殊型別，用於表示永不成功完成的函式或表達式，原因可能是它們總是拋出例外或進入無限執行路徑（例如無限迴圈）。您可以使用 `Nothing` 來標記尚未實作或設計為總是拋出例外的函式，清晰地向編譯器和程式碼閱讀者表明您的意圖。如果編譯器在函式簽名中推斷出 `Nothing` 型別，它會警告您。明確將 `Nothing` 定義為返回型別可以消除此警告。

此 Kotlin 程式碼演示了 `Nothing` 型別的使用，其中編譯器將函式呼叫後面的程式碼標記為無法到達：

```kotlin
class Person(val name: String?)

fun fail(message: String): Nothing {
    throw IllegalArgumentException(message)
    // This function will never return successfully.
    // It will always throw an exception.
}

fun main() {
    // Creates an instance of Person with 'name' as null
    val person = Person(name = null)
    
    val s: String = person.name ?: fail("Name required")

    // 's' is guaranteed to be initialized at this point
    println(s)
}
```
{kotlin-runnable="true"}

Kotlin 的 [`TODO()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-t-o-d-o.html) 函式也使用了 `Nothing` 型別，它作為佔位符，用於突出顯示程式碼中需要未來實作的區域：

```kotlin
fun notImplementedFunction(): Int {
    TODO("This function is not yet implemented")
}

fun main() {
    val result = notImplementedFunction()
    // This throws a NotImplementedError
    println(result)
}
```
{kotlin-runnable="true"}

如您所見，`TODO()` 函式總是拋出 [`NotImplementedError`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-not-implemented-error/) 例外。

## 例外類別

讓我們探討一些 Kotlin 中常見的例外型別，它們都是 [`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/) 類別的子類別：

*   [`ArithmeticException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-arithmetic-exception/)：當算術運算無法執行時，例如除以零，會發生此例外。

    ```kotlin
    val example = 2 / 0 // throws ArithmeticException
    ```

*   [`IndexOutOfBoundsException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-index-out-of-bounds-exception/)：此例外在某些類型（例如陣列或字串）的索引超出範圍時拋出。

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

*   [`NoSuchElementException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-no-such-element-exception/)：當存取在特定集合中不存在的元素時，會拋出此例外。當使用期望特定元素的方法時（例如 [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 或 [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)）會發生。

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

*   [`NullPointerException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/)：當應用程式嘗試使用值為 `null` 的物件引用時，會拋出此例外。儘管 Kotlin 的空安全功能顯著降低了 NullPointerException 的風險，但它們仍然可能因故意使用 `!!` 運算符或在與缺乏 Kotlin 空安全的 Java 互動時發生。

    ```kotlin
    val text: String? = null
    println(text!!.length)  // throws a NullPointerException
    ```

儘管 Kotlin 中的所有例外都是非檢查型的，並且您無需明確捕捉它們，但您仍然可以靈活地根據需要捕捉它們。

### 例外階層

Kotlin 例外階層的根是 [`Throwable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) 類別。它有兩個直接子類別，[`Error`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-error/) 和 [`Exception`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/)：

*   `Error` 子類別表示應用程式可能無法自行恢復的嚴重且根本的問題。這些問題通常您不會嘗試處理，例如 [`OutOfMemoryError`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-out-of-memory-error/) 或 `StackOverflowError`。

*   `Exception` 子類別用於您可能希望處理的條件。`Exception` 型別的子型別，例如 [`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/) 和 `IOException` (輸入/輸出例外)，處理應用程式中的例外事件。

![Exception hierarchy - the Throwable class](throwable.svg){width=700}

`RuntimeException` 通常是由程式碼中檢查不足引起的，可以透過程式設計避免。Kotlin 有助於防止常見的 `RuntimeExceptions`，例如 `NullPointerException`，並為潛在的執行時錯誤（例如除以零）提供編譯時警告。下圖展示了 `RuntimeException` 的子型別階層：

![Hierarchy of RuntimeExceptions](runtime-exception.svg){width=700}

## 堆疊追蹤

_堆疊追蹤 (stack trace)_ 是由執行環境生成的報告，用於除錯。它顯示了導致程式中特定點的函式呼叫序列，特別是發生錯誤或例外的地方。

讓我們看一個在 JVM 環境中因例外而自動列印堆疊追蹤的範例：

```kotlin
fun main() {
//sampleStart    
    throw ArithmeticException("This is an arithmetic exception!")
//sampleEnd    
}
```
{kotlin-runnable="true"}

在 JVM 環境中運行此程式碼會產生以下輸出：

```text
Exception in thread "main" java.lang.ArithmeticException: This is an arithmetic exception!
    at MainKt.main(Main.kt:3)
    at MainKt.main(Main.kt)
```

第一行是例外描述，其中包括：

*   例外型別：`java.lang.ArithmeticException`
*   執行緒：`main`
*   例外訊息：`"This is an arithmetic exception!"`

例外描述後每行以 `at` 開頭的行都是堆疊追蹤。單行稱為 _堆疊追蹤元素_ (stack trace element) 或 _堆疊框架_ (stack frame)：

*   `at MainKt.main (Main.kt:3)`：這顯示了方法名稱 (`MainKt.main`) 以及呼叫該方法的原始檔案和行號 (`Main.kt:3`)。
*   `at MainKt.main (Main.kt)`：這表示例外發生在 `Main.kt` 檔案的 `main()` 函式中。

## 例外與 Java、Swift 和 Objective-C 的互通性

由於 Kotlin 將所有例外都視為非檢查型 (unchecked)，當從區分檢查型 (checked) 和非檢查型例外 (unchecked exceptions) 的語言呼叫此類例外時，可能會導致複雜性。為了解決 Kotlin 與 Java、Swift 和 Objective-C 等語言在例外處理上的這種差異，您可以使用 [`@Throws`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throws/) 註解。此註解會提醒呼叫者可能發生的例外。欲了解更多資訊，請參閱 [從 Java 呼叫 Kotlin](java-to-kotlin-interop.md#checked-exceptions) 和 [與 Swift/Objective-C 的互通性](native-objc-interop.md#errors-and-exceptions)。