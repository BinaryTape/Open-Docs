---
title: "例外 (Exceptions)"
---
異常處理有助於您的程式碼以更可預期的方式執行，即使發生可能中斷程式執行的執行階段錯誤 (runtime errors) 也是如此。
Kotlin 預設將所有異常視為 _未受檢的 (unchecked)_。
未受檢的異常簡化了異常處理的過程：您可以捕獲 (catch) 異常，但您不需要顯式地處理或[宣告 (declare)](java-to-kotlin-interop#checked-exceptions)它們。

:::note
若要深入了解 Kotlin 在與 Java、Swift 和 Objective-C 互動時如何處理異常，請參閱
[與 Java、Swift 和 Objective-C 的異常互通性](#exception-interoperability-with-java-swift-and-objective-c) 章節。

處理異常主要包括兩個動作：

* **拋出異常 (Throwing exceptions)：** 指示何時發生問題。
* **捕獲異常 (Catching exceptions)：** 通過解決問題或通知開發人員或應用程式使用者來手動處理意外異常。

異常由 [`Exception`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/) 類別的子類別表示，`Exception` 類別又是 [`Throwable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) 類別的子類別。有關層級結構的更多資訊，請參閱 [異常層級結構](#exception-hierarchy) 章節。由於 `Exception` 是一個 [`open class`](inheritance)，您可以建立[自訂異常](#create-custom-exceptions)以滿足您應用程式的特定需求。

## 拋出異常

您可以使用 `throw` 關鍵字手動拋出異常。
拋出異常表示程式碼中發生了意外的執行階段錯誤。
異常是 [物件 (objects)](classes#creating-instances-of-classes)，拋出異常會建立一個異常類別的實例 (instance)。

您可以不帶任何參數地拋出異常：

```kotlin
throw IllegalArgumentException()
```

為了更好地理解問題的來源，請包含額外的資訊，例如自訂訊息和原始原因：

```kotlin
val cause = IllegalStateException("Original cause: illegal state")

// 如果 userInput 為負數，則拋出 IllegalArgumentException
// 此外，它還顯示原始原因，由 cause IllegalStateException 表示
if (userInput < 0) {
    throw IllegalArgumentException("Input must be non-negative", cause)
}
```

在這個範例中，當使用者輸入負值時，會拋出 `IllegalArgumentException`。
您可以建立自訂錯誤訊息並保留異常的原始原因 (`cause`)，這將包含在 [堆疊追蹤 (stack trace)](#stack-trace) 中。

### 使用前提條件函式拋出異常

Kotlin 提供了其他使用前提條件函式自動拋出異常的方法。
前提條件函式包括：

| 前提條件函式 (Precondition function)            | 使用案例 (Use case)                                 | 拋出的異常 (Exception thrown)                                                                                                 |
|----------------------------------|------------------------------------------|------------------------------------------------------------------------------------------------------------------|
| [`require()`](#require-function) | 檢查使用者輸入的有效性 (Checks user input validity)               | [`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/)   |
| [`check()`](#check-function)     | 檢查物件或變數狀態的有效性 (Checks object or variable state validity) | [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)         |
| [`error()`](#error-function)     | 指示非法狀態或條件 (Indicates an illegal state or condition)  | [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)         |

在程式流程在未滿足特定條件的情況下無法繼續的情況下，這些函式非常適合。
這簡化了您的程式碼並提高了處理這些檢查的效率。

#### require() 函式

當輸入引數對於函式的運算至關重要，並且如果這些引數無效則函式無法繼續時，請使用 [`require()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/require.html) 函式來驗證輸入引數。

如果 `require()` 中的條件未滿足，它會拋出 [`IllegalArgumentException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-argument-exception/)：

```kotlin
fun getIndices(count: Int): List<Int> {
    require(count >= 0) { "Count must be non-negative. You set count to $count." }
    return List(count) { it + 1 }
}

fun main() {
    // 這會失敗並出現 IllegalArgumentException
    println(getIndices(-1))
    
    // 取消註解以下程式碼行以查看一個可行的範例
    // println(getIndices(3))
    // [1, 2, 3]
}
```

`require()` 函式允許編譯器執行 [智慧轉型 (smart casting)](typecasts#smart-casts)。
在成功檢查後，變數會自動轉型為不可為 null 的類型。
這些函式通常用於可空性檢查 (nullability checks)，以確保變數在繼續之前不是 null。例如：

```kotlin
fun printNonNullString(str: String?) {
    // 可空性檢查
    require(str != null) 
    // 在此成功檢查之後，保證 'str' 不為 null，並自動智慧轉型為不可為 null 的 String
    println(str.length)
}
```

:::

#### check() 函式

使用 [`check()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/check.html) 函式來驗證物件或變數的狀態。
如果檢查失敗，則表示需要解決的邏輯錯誤。

如果 `check()` 函式中指定的條件為 `false`，它會拋出 [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)：

```kotlin
fun main() {
    var someState: String? = null

    fun getStateValue(): String {

        val state = checkNotNull(someState) { "State must be set beforehand!" }
        check(state.isNotEmpty()) { "State must be non-empty!" }
        return state
    }
    // 如果您取消註解以下程式碼行，則程式會失敗並出現 IllegalStateException
    // getStateValue()

    someState = ""

    // 如果您取消註解以下程式碼行，則程式會失敗並出現 IllegalStateException
    // getStateValue() 
    someState = "non-empty-state"

    // 這會印出 "non-empty-state"
    println(getStateValue())
}
```

:::note
`check()` 函式允許編譯器執行 [智慧轉型 (smart casting)](typecasts#smart-casts)。
在成功檢查後，變數會自動轉型為不可為 null 的類型。
這些函式通常用於可空性檢查 (nullability checks)，以確保變數在繼續之前不是 null。例如：

```kotlin
fun printNonNullString(str: String?) {
    // 可空性檢查
    check(str != null) 
    // 在此成功檢查之後，保證 'str' 不為 null，並自動智慧轉型為不可為 null 的 String
    println(str.length)
}
```

:::

#### error() 函式

[`error()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/error.html) 函式用於指示程式碼中的非法狀態或不應在邏輯上發生的條件。
它適用於您想在程式碼中有意拋出異常的情況，例如，當程式碼遇到意外狀態時。
此函式在 `when` 表達式中特別有用，它提供了一種明確的方式來處理邏輯上不應發生的情況。

在以下範例中，`error()` 函式用於處理未定義的使用者角色。
如果該角色不是預定義的角色之一，則會拋出 [`IllegalStateException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-illegal-state-exception/)：

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
    // 這會如預期般運作
    val user1 = User("Alice", "admin")
    processUserRole(user1)
    // Alice is an admin.

    // 這會拋出 IllegalStateException
    val user2 = User("Bob", "guest")
    processUserRole(user2)
}
```

## 使用 try-catch 區塊處理異常

拋出異常時，它會中斷程式的正常執行。
您可以使用 `try` 和 `catch` 關鍵字來優雅地處理異常，以保持程式的穩定性。
`try` 區塊包含可能拋出異常的程式碼，而 `catch` 區塊會捕獲並處理發生的異常。
該異常由與其特定類型或異常的[超類別 (superclass)](inheritance) 相匹配的第一個 `catch` 區塊捕獲。

以下是如何一起使用 `try` 和 `catch` 關鍵字：

```kotlin
try {
    // 可能拋出異常的程式碼
} catch (e: SomeException) {
    // 用於處理異常的程式碼
}
```

將 `try-catch` 用作表達式是一種常見的方法，因此它可以從 `try` 區塊或 `catch` 區塊傳回一個值：

```kotlin
fun main() {
    val num: Int = try {

        // 如果 count() 成功完成，則將其傳回值分配給 num
        count()
        
    } catch (e: ArithmeticException) {
        
        // 如果 count() 拋出異常，則 catch 區塊會傳回 -1，
        // 這會分配給 num
        -1
    }
    println("Result: $num")
}

// 模擬可能拋出 ArithmeticException 的函式
fun count(): Int {
    
    // 變更此值以將不同的值傳回給 num
    val a = 0
    
    return 10 / a
}
```

您可以為同一個 `try` 區塊使用多個 `catch` 處理程式 (handler)。
您可以根據需要添加任意數量的 `catch` 區塊，以不同地處理不同的異常。
當您有多個 `catch` 區塊時，重要的是按照從最特定到最不特定的異常的順序對它們進行排序，並遵循程式碼中的從上到下的順序。
此排序與程式的執行流程一致。

考慮這個帶有[自訂異常](#create-custom-exceptions)的範例：

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

    // 變更此值以測試不同的場景
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

一個通用的 catch 區塊，用於處理 `WithdrawalException`，捕獲其所有類型的異常，包括像 `InsufficientFundsException` 這樣的特定異常，
除非它們之前被更特定的 catch 區塊捕獲。

### finally 區塊

`finally` 區塊包含始終執行的程式碼，無論 `try` 區塊是成功完成還是拋出異常。
使用 `finally` 區塊，您可以在 `try` 和 `catch` 區塊執行後清理程式碼。
這在使用檔案或網路連線等資源時尤其重要，因為 `finally` 可確保它們被正確地關閉或釋放。

以下是您通常如何一起使用 `try-catch-finally` 區塊：

```kotlin
try {
    // 可能拋出異常的程式碼
}
catch (e: YourException) {
    // 異常處理程式
}
finally {
    // 始終執行的程式碼
}
```

`try` 表達式的傳回值由 `try` 或 `catch` 區塊中最後執行的表達式決定。
如果沒有發生異常，則結果來自 `try` 區塊；如果處理了異常，則結果來自 `catch` 區塊。
`finally` 區塊始終執行，但它不會更改 `try-catch` 區塊的結果。

讓我們看一個範例來演示：

```kotlin
fun divideOrNull(a: Int): Int {
    
    // try 區塊始終執行
    // 此處的異常（除以零）會導致立即跳轉到 catch 區塊
    try {
        val b = 44 / a
        println("try block: Executing division: $b")
        return b
    }
    
    // 由於 ArithmeticException（如果 a ==0，則為除以零）而執行 catch 區塊
    catch (e: ArithmeticException) {
        println("catch block: Encountered ArithmeticException $e")
        return -1
    }
    finally {
        println("finally block: The finally block is always executed")
    }
}

fun main() {
    
    // 變更此值以取得不同的結果。ArithmeticException 將傳回：-1
    divideOrNull(0)
}
```

:::note
在 Kotlin 中，管理實現 [`AutoClosable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-auto-closeable/) 介面的資源（例如 `FileInputStream` 或 `FileOutputStream` 等檔案串流）的慣用方法是使用 [`.use()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/use.html) 函式。
無論是否拋出異常，此函式都會在程式碼區塊完成時自動關閉資源，從而消除了對 `finally` 區塊的需求。
因此，Kotlin 不需要像 [Java 的 try-with-resources](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html) 這樣的特殊語法來進行資源管理。

```kotlin
FileWriter("test.txt").use { writer `->`
writer.write("some text") 
// 在此區塊之後，.use 函式會自動呼叫 writer.close()，類似於 finally 區塊
}
```

:::

如果您的程式碼需要資源清理而不處理異常，您也可以將 `try` 與 `finally` 區塊一起使用，而無需 `catch` 區塊：

```kotlin
class MockResource { 
    fun use() { 
        println("Resource being used") 
        // 模擬正在使用的資源
        // 如果發生除以零的情況，這會拋出 ArithmeticException
        val result = 100 / 0
        
        // 如果拋出異常，則不會執行此行
        println("Result: $result") 
    }
    
    fun close() { 
        println("Resource closed") 
    }
}

fun main() { 
    val resource = MockResource()

    try {
        
        // 嘗試使用資源
        resource.use()
        
    } finally {
        
        // 確保始終關閉資源，即使發生異常也是如此
        resource.close()
    }

    // 如果拋出異常，則不會印出此行
    println("End of the program")

}
```

如您所見，`finally` 區塊可確保始終關閉資源，無論是否發生異常。

在 Kotlin 中，您可以靈活地僅使用 `catch` 區塊、僅使用 `finally` 區塊或同時使用兩者，具體取決於您的特定需求，但 `try` 區塊必須始終至少伴隨一個 `catch` 區塊或一個 `finally` 區塊。

## 建立自訂異常

在 Kotlin 中，您可以通過建立擴展內建 `Exception` 類別的類別來定義自訂異常。
這使您可以建立針對您的應用程式需求量身定制的更具體的錯誤類型。

若要建立一個，您可以定義一個擴展 `Exception` 的類別：

```kotlin
class MyException: Exception("My message")
```

在此範例中，有一個預設錯誤訊息「My message」，但如果您願意，可以將其留空。

:::note
Kotlin 中的異常是有狀態的物件，帶有特定於其建立上下文的資訊，稱為 [堆疊追蹤 (stack trace)](#stack-trace)。
避免使用 [物件宣告 (object declarations)](object-declarations#object-declarations-overview) 建立異常。
相反，每次需要時都建立一個新的異常實例。
這樣，您可以確保異常的狀態準確反映特定上下文。

自訂異常也可以是任何現有異常子類別的子類別，例如 `ArithmeticException` 子類別：

```kotlin
class NumberTooLargeException: ArithmeticException("My message")
```

如果要建立自訂異常的子類別，則必須將父類別宣告為 `open`，
因為[預設情況下，類別是 final 的](inheritance)，否則無法將其子類別化。

例如：

```kotlin
// 將自訂異常宣告為 open 類別，使其可子類別化
open class MyCustomException(message: String): Exception(message)

// 建立自訂異常的子類別
class SpecificCustomException: MyCustomException("Specific error message")
```

:::

自訂異常的行為與內建異常完全相同。您可以使用 `throw` 關鍵字拋出它們，並使用 `try-catch-finally` 區塊處理它們。讓我們看一個範例來演示：

```kotlin
class NegativeNumberException: Exception("Parameter is less than zero.")
class NonNegativeNumberException: Exception("Parameter is a non-negative number.")

fun myFunction(number: Int) {
    if (number < 0) throw NegativeNumberException()
    else if (number >= 0) throw NonNegativeNumberException()
}

fun main() {
    
    // 變更此函式中的值以取得不同的異常
    myFunction(1)
}
```

在具有多種錯誤場景的應用程式中，
建立異常層級結構有助於使程式碼更清晰、更具體。
您可以通過使用[抽象類別 (abstract class)](classes#abstract-classes) 或
[密封類別 (sealed class)](sealed-classes#constructors) 作為常見異常功能的基礎，並為詳細的異常類型建立特定的子類別來實現這一點。
此外，具有可選參數的自訂異常提供了靈活性，允許使用不同的訊息進行初始化，
從而實現更精細的錯誤處理。

讓我們看一個使用密封類別 `AccountException` 作為異常層級結構的基礎的範例，
以及類別 `APIKeyExpiredException`，一個子類別，它展示了使用可選參數來改進異常詳細資訊：

```kotlin

// 建立一個抽象類別，作為與帳戶相關的錯誤的異常層級結構的基礎
sealed class AccountException(message: String, cause: Throwable? = null):
Exception(message, cause)

// 建立 AccountException 的子類別
class InvalidAccountCredentialsException : AccountException("Invalid account credentials detected")

// 建立 AccountException 的子類別，它允許添加自訂訊息和原因
class APIKeyExpiredException(message: String = "API key expired", cause: Throwable? = null)	: AccountException(message, cause)

// 變更佔位符函式的值以取得不同的結果
fun areCredentialsValid(): Boolean = true
fun isAPIKeyExpired(): Boolean = true

// 驗證帳戶憑證和 API 金鑰
fun validateAccount() {
    if (!areCredentialsValid()) throw InvalidAccountCredentialsException()
    if (isAPIKeyExpired()) {
        // 拋出帶有特定原因的 APIKeyExpiredException 的範例
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

## Nothing 類型

在 Kotlin 中，每個表達式都有一個類型。
表達式 `throw IllegalArgumentException()` 的類型是 [`Nothing`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html)，這是一個內建類型，
是所有其他類型的子類型，也稱為 [底類型 (bottom type)](https://en.wikipedia.org/wiki/Bottom_type)。
這表示 `Nothing` 可以用作傳回類型或泛型類型，在任何其他類型預期的地方，而不會導致類型錯誤。

`Nothing` 是 Kotlin 中的一種特殊類型，用於表示永遠無法成功完成的函式或表達式，
因為它們總是拋出異常或進入像無限迴圈這樣的無限執行路徑。
您可以使用 `Nothing` 來標記尚未實現或設計為始終拋出異常的函式，
從而清楚地向編譯器和程式碼閱讀者表明您的意圖。
如果編譯器在函式簽章中推斷出 `Nothing` 類型，它會警告您。
顯式地將 `Nothing` 定義為傳回類型可以消除此警告。

此 Kotlin 程式碼演示了 `Nothing` 類型的用法，其中編譯器將函式呼叫之後的程式碼標記為無法訪問：

```kotlin
class Person(val name: String?)

fun fail(message: String): Nothing {
    throw IllegalArgumentException(message)
    // 此函式永遠不會成功傳回。
    // 它總是拋出異常。
}

fun main() {
    // 建立一個 'name' 為 null 的 Person 實例
    val person = Person(name = null)
    
    val s: String = person.name ?: fail("Name required")

    // 保證在此時初始化 's'
    println(s)
}
```

Kotlin 的 [`TODO()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-t-o-d-o.html) 函式也使用 `Nothing` 類型，它充當佔位符，以突出顯示程式碼中需要未來實現的區域：

```kotlin
fun notImplementedFunction(): Int {
    TODO("This function is not yet implemented")
}

fun main() {
    val result = notImplementedFunction()
    // 這會拋出 NotImplementedError
    println(result)
}
```

如您所見，`TODO()` 函式始終拋出 [`NotImplementedError`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-not-implemented-error/) 異常。

## 異常類別

讓我們探索 Kotlin 中一些常見的異常類型，它們都是 [`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/) 類別的子類別：

* [`ArithmeticException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-arithmetic-exception/)：當無法執行算術運算時，會發生此異常，例如除以零。

    ```kotlin
    val example = 2 / 0 // 拋出 ArithmeticException
    ```

* [`IndexOutOfBoundsException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-index-out-of-bounds-exception/)：拋出此異常表示某種索引（例如陣列或字串）超出範圍。

    ```kotlin
    val myList = mutableListOf(1, 2, 3)
    myList.removeAt(3)  // 拋出 IndexOutOfBoundsException
    ```

    > 為避免此異常，請使用更安全的替代方案，例如 [`getOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/get-or-null.html) 函式：
    > 
    > ```kotlin
    > val myList = listOf(1, 2, 3)
    > // 傳回 null，而不是 IndexOutOfBoundsException
    > val element = myList.getOrNull(3)
    > println("Element at index 3: $element")
    > ```
    > 
    

* [`NoSuchElementException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-no-such-element-exception/)：當存取不存在於特定集合中的元素時，會拋出此異常。
當使用期望特定元素的方法（例如 [`first()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first.html) 或 [`last()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/last.html)）時，會發生這種情況。

    ```kotlin
    val emptyList = listOf<Int>()
    val firstElement = emptyList.first()  // 拋出 NoSuchElementException
    ```

    > 為避免此異常，請使用更安全的替代方案，例如 [`firstOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/first-or-null.html) 函式：
    >
    > ```kotlin
    > val emptyList = listOf<Int>()
    > // 傳回 null，而不是 NoSuchElementException
    > val firstElement = emptyList.firstOrNull()
    > println("First element in empty list: $firstElement")
    > ```
    >
    

* [`NumberFormatException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-number-format-exception/)：嘗試將字串轉換為數字類型時，但字串沒有適當的格式時，會發生此異常。

    ```kotlin
    val string = "This is not a number"
    val number = string.toInt() // 拋出 NumberFormatException
    ```
    
    > 為避免此異常，請使用更安全的替代方案，例如 [`toIntOrNull()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/to-int-or-null.html) 函式：
    >
    > ```kotlin
    > val nonNumericString = "not a number"
    > // 傳回 null，而不是 NumberFormatException
    > val number = nonNumericString.toIntOrNull()
    > println("Converted number: $number")
    > ```
    >
    

* [`NullPointerException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/)：當應用程式嘗試使用具有 `null` 值的物件參考時，會拋出此異常。
儘管 Kotlin 的 null 安全功能顯著降低了 NullPointerException 的風險，
但它們仍然可能通過故意使用 `!!` 運算符或與缺少 Kotlin 的 null 安全性的 Java 交互時發生。

    ```kotlin
    val text: String? = null
    println(text!!.length)  // 拋出 NullPointerException
    ```

雖然 Kotlin 中的所有異常都是未受檢的，並且您不必顯式地捕獲它們，但如果您願意，仍然可以靈活地捕獲它們。

### 異常層級結構

Kotlin 異常層級結構的根是 [`Throwable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throwable/) 類別。
它有兩個直接子類別，[`Error`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-error/) 和 [`Exception`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-exception/)：

* `Error` 子類別表示應用程式可能無法自行從中恢復的嚴重基本問題。
這些是您通常不會嘗試處理的問題，例如 [`OutOfMemoryError`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-out-of-memory-error/) 或 `StackOverflowError`。

* `Exception` 子類別用於您可能想要處理的條件。
`Exception` 類型的子類型（例如 [`RuntimeException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-runtime-exception/) 和 `IOException`（輸入/輸出異常））處理應用程式中的異常事件。

<img src="/img/throwable.svg" alt="Exception hierarchy - the Throwable class" width="700" style={{verticalAlign: 'middle'}}/>

`RuntimeException` 通常是由程式碼中的檢查不足引起的，並且可以通過編程方式來防止。
Kotlin 有助於防止常見的 `RuntimeExceptions`（例如 `NullPointerException`），並為潛在的執行階段錯誤（例如除以零）提供編譯時警告。
下圖演示了從 `RuntimeException` 派生的子類型層級結構：

<img src="/img/runtime-exception.svg" alt="Hierarchy of RuntimeExceptions" width="700" style={{verticalAlign: 'middle'}}/>

## 堆疊追蹤

_堆疊追蹤 (stack trace)_ 是由執行階段環境產生的報告，用於偵錯。
它顯示了導致程式中特定點的函式呼叫序列，尤其是在發生錯誤或異常的地方。

讓我們看一個範例，其中由於 JVM 環境中的異常而自動印出堆疊追蹤：

```kotlin
fun main() {

    throw ArithmeticException("This is an arithmetic exception!")

}
```

在 JVM 環境中執行此程式碼會產生以下輸出：

```text
Exception in thread "main" java.lang.ArithmeticException: This is an arithmetic exception!
    at MainKt.main(Main.kt:3)
    at MainKt.main(Main.kt)
```

第一行是異常描述，其中包括：

* 異常類型：`java.lang.ArithmeticException`
* 執行緒：`main` 
* 異常訊息：`"This is an arithmetic exception!"`

異常描述後以 `at` 開頭的每一行都是堆疊追蹤。單行稱為 _堆疊追蹤元素 (stack trace element)_ 或 _堆疊幀 (stack frame)_：

* `at MainKt.main (Main.kt:3)`：這顯示了方法名稱 (`MainKt.main`) 以及呼叫該方法的源檔案和行號 (`Main.kt:3`)。
* `at MainKt.main (Main.kt)`：這表示異常發生在 `Main.kt` 檔案的 `main()` 函式中。

## 與 Java、Swift 和 Objective-C 的異常互通性

由於 Kotlin 將所有異常視為未受檢的，因此當從區分受檢異常和未受檢異常的語言呼叫這些異常時，可能會導致複雜情況。
為了解決 Kotlin 和 Java、Swift 和 Objective-C 等語言之間異常處理的這種差異，您可以使用 [`@Throws`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-throws/) 註解。
此註解會提醒呼叫者注意可能的異常。
有關更多資訊，請參閱 [從 Java 呼叫 Kotlin](java-to-kotlin-interop#checked-exceptions) 和
[與 Swift/Objective-C 的互通性](native-objc-interop#errors-and-exceptions)。