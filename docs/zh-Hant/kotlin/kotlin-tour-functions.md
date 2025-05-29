[//]: # (title: 函式)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types.md">基本型別</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections.md">集合</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow.md">控制流</a><br />
        <img src="icon-5.svg" width="20" alt="Fifth step" /> <strong>函式</strong><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes.md">類別</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety.md">空安全</a></p>
</tldr>

您可以使用 `fun` 關鍵字在 Kotlin 中宣告自己的函式。

```kotlin
fun hello() {
    return println("Hello, world!")
}

fun main() {
    hello()
    // Hello, world!
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-function-demo"}

在 Kotlin 中：

*   函式參數寫在括號 `()` 內。
*   每個參數必須有一個型別，多個參數必須用逗號 `,` 分隔。
*   回傳型別寫在函式的括號 `()` 後面，用冒號 `:` 分隔。
*   函式主體寫在大括號 `{}` 內。
*   使用 `return` 關鍵字來退出函式或從函式中回傳內容。

> 如果函式沒有回傳任何有用的內容，則可以省略回傳型別和 `return` 關鍵字。在 [不回傳內容的函式](#functions-without-return) 中瞭解更多資訊。
>
{style="note"}

在以下範例中：

*   `x` 和 `y` 是函式參數。
*   `x` 和 `y` 的型別是 `Int`。
*   函式的回傳型別是 `Int`。
*   呼叫時，函式會回傳 `x` 和 `y` 的總和。

```kotlin
fun sum(x: Int, y: Int): Int {
    return x + y
}

fun main() {
    println(sum(1, 2))
    // 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-simple-function"}

> 我們在 [編碼慣例](coding-conventions.md#function-names) 中建議您使用小寫字母開頭命名函式，並使用駝峰式命名法，不帶底線。
>
{style="note"}

## 具名引數

為了使程式碼簡潔，呼叫函式時您不必包含參數名稱。但是，包含參數名稱確實可以讓您的程式碼更容易閱讀。這稱為使用**具名引數 (named arguments)**。如果您包含參數名稱，則可以以任何順序寫入參數。

> 在以下範例中，[字串範本 (string templates)](strings.md#string-templates) 是用來存取參數值、將它們轉換為 `String` 型別，然後將它們串接成字串以供印出。
>
{style="tip"}

```kotlin
fun printMessageWithPrefix(message: String, prefix: String) {
    println("[$prefix] $message")
}

fun main() {
    // Uses named arguments with swapped parameter order
    printMessageWithPrefix(prefix = "Log", message = "Hello")
    // [Log] Hello
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-named-arguments-function"}

## 預設參數值

您可以為函式參數定義預設值。呼叫函式時可以省略任何帶有預設值的參數。要宣告預設值，請在型別後使用賦值運算子 `=`：

```kotlin
fun printMessageWithPrefix(message: String, prefix: String = "Info") {
    println("[$prefix] $message")
}

fun main() {
    // Function called with both parameters
    printMessageWithPrefix("Hello", "Log") 
    // [Log] Hello
    
    // Function called only with message parameter
    printMessageWithPrefix("Hello")        
    // [Info] Hello
    
    printMessageWithPrefix(prefix = "Log", message = "Hello")
    // [Log] Hello
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-default-param-function"}

> 您可以跳過帶有預設值的特定參數，而不是全部省略它們。但是，在第一個跳過的參數之後，您必須指定所有後續參數的名稱。
>
{style="note"}

## 不回傳內容的函式

如果您的函式不回傳有用的值，那麼它的回傳型別就是 `Unit`。`Unit` 是一種只有一個值 — `Unit` 的型別。您不必在函式主體中明確宣告回傳 `Unit`。這意味著您不必使用 `return` 關鍵字或宣告回傳型別：

```kotlin
fun printMessage(message: String) {
    println(message)
    // `return Unit` or `return` is optional
}

fun main() {
    printMessage("Hello")
    // Hello
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-unit-function"}

## 單一表達式函式

為了使您的程式碼更簡潔，您可以使用單一表達式函式。例如，`sum()` 函式可以縮短：

```kotlin
fun sum(x: Int, y: Int): Int {
    return x + y
}

fun main() {
    println(sum(1, 2))
    // 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-simple-function-before"}

您可以移除大括號 `{}` 並使用賦值運算子 `=` 來宣告函式主體。當您使用賦值運算子 `=` 時，Kotlin 會使用型別推斷，因此您也可以省略回傳型別。然後 `sum()` 函式就變成一行：

```kotlin
fun sum(x: Int, y: Int) = x + y

fun main() {
    println(sum(1, 2))
    // 3
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-simple-function-after"}

然而，如果您希望您的程式碼能被其他開發人員快速理解，即使在使用賦值運算子 `=` 時，也最好明確定義回傳型別。

> 如果您使用 `{}` 大括號來宣告函式主體，您必須宣告回傳型別，除非它是 `Unit` 型別。
>
{style="note"}

## 函式中的提早回傳

要停止函式中的程式碼在某個點之後繼續處理，請使用 `return` 關鍵字。此範例使用 `if` 在條件式表達式為真時提早從函式中回傳：

```kotlin
// A list of registered usernames
val registeredUsernames = mutableListOf("john_doe", "jane_smith")

// A list of registered emails
val registeredEmails = mutableListOf("john@example.com", "jane@example.com")

fun registerUser(username: String, email: String): String {
    // Early return if the username is already taken
    if (username in registeredUsernames) {
        return "Username already taken. Please choose a different username."
    }

    // Early return if the email is already registered
    if (email in registeredEmails) {
        return "Email already registered. Please use a different email."
    }

    // Proceed with the registration if the username and email are not taken
    registeredUsernames.add(username)
    registeredEmails.add(email)

    return "User registered successfully: $username"
}

fun main() {
    println(registerUser("john_doe", "newjohn@example.com"))
    // Username already taken. Please choose a different username.
    println(registerUser("new_user", "newuser@example.com"))
    // User registered successfully: new_user
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-function-early-return"}

## 函式練習

### 練習 1 {initial-collapse-state="collapsed" collapsible="true" id="functions-exercise-1"}

編寫一個名為 `circleArea` 的函式，該函式接受一個整數格式的圓的半徑作為參數，並輸出該圓的面積。

> 在本練習中，您匯入了一個套件，以便透過 `PI` 存取圓周率的值。有關匯入套件的更多資訊，請參閱 [套件與匯入](packages.md)。
>
{style="tip"}

|---|---|
```kotlin
import kotlin.math.PI

// Write your code here

fun main() {
    println(circleArea(2))
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-functions-exercise-1"}

|---|---|
```kotlin
import kotlin.math.PI

fun circleArea(radius: Int): Double {
    return PI * radius * radius
}

fun main() {
    println(circleArea(2)) // 12.566370614359172
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-functions-solution-1"}

### 練習 2 {initial-collapse-state="collapsed" collapsible="true" id="functions-exercise-2"}

將上一個練習中的 `circleArea` 函式改寫為單一表達式函式。

|---|---|
```kotlin
import kotlin.math.PI

// Write your code here

fun main() {
    println(circleArea(2))
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-functions-exercise-2"}

|---|---|
```kotlin
import kotlin.math.PI

fun circleArea(radius: Int): Double = PI * radius * radius

fun main() {
    println(circleArea(2)) // 12.566370614359172
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-functions-solution-2"}

### 練習 3 {initial-collapse-state="collapsed" collapsible="true" id="functions-exercise-3"}

您有一個函式，可以將以小時、分鐘和秒為單位給定的時間間隔轉換為秒。在大多數情況下，您只需傳遞一兩個函式參數，其餘的為 0。透過使用預設參數值和具名引數來改進函式及其呼叫程式碼，使其更易於閱讀。

|---|---|
```kotlin
fun intervalInSeconds(hours: Int, minutes: Int, seconds: Int) =
    ((hours * 60) + minutes) * 60 + seconds

fun main() {
    println(intervalInSeconds(1, 20, 15))
    println(intervalInSeconds(0, 1, 25))
    println(intervalInSeconds(2, 0, 0))
    println(intervalInSeconds(0, 10, 0))
    println(intervalInSeconds(1, 0, 1))
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-functions-exercise-3"}

|---|---|
```kotlin
fun intervalInSeconds(hours: Int = 0, minutes: Int = 0, seconds: Int = 0) =
    ((hours * 60) + minutes) * 60 + seconds

fun main() {
    println(intervalInSeconds(1, 20, 15))
    println(intervalInSeconds(minutes = 1, seconds = 25))
    println(intervalInSeconds(hours = 2))
    println(intervalInSeconds(minutes = 10))
    println(intervalInSeconds(hours = 1, seconds = 1))
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-functions-solution-3"}

## Lambda 表達式

Kotlin 允許您透過使用 Lambda 表達式來編寫更簡潔的函式程式碼。

例如，以下 `uppercaseString()` 函式：

```kotlin
fun uppercaseString(text: String): String {
    return text.uppercase()
}
fun main() {
    println(uppercaseString("hello"))
    // HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-function-before"}

也可以寫成 Lambda 表達式：

```kotlin
fun main() {
    val upperCaseString = { text: String -> text.uppercase() }
    println(upperCaseString("hello"))
    // HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-variable"}

Lambda 表達式乍看之下可能難以理解，因此我們來詳細解釋。Lambda 表達式寫在大括號 `{}` 內。

在 Lambda 表達式中，您會寫入：

*   參數，後面跟著 `->`。
*   `->` 後面的函式主體。

在前面的範例中：

*   `text` 是一個函式參數。
*   `text` 的型別是 `String`。
*   函式回傳在 `text` 上呼叫 [`uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html) 函式的結果。
*   整個 Lambda 表達式使用賦值運算子 `=` 指派給 `upperCaseString` 變數。
*   Lambda 表達式透過將 `upperCaseString` 變數像函式一樣使用，並將字串 `"hello"` 作為參數來呼叫。
*   `println()` 函式印出結果。

> 如果您宣告一個沒有參數的 Lambda，則無需使用 `->`。例如：
> ```kotlin
> { println("Log message") }
> ```
>
{style="note"}

Lambda 表達式可以用多種方式使用。您可以：

*   [將 Lambda 表達式作為參數傳遞給另一個函式](#pass-to-another-function)
*   [從函式中回傳 Lambda 表達式](#return-from-a-function)
*   [單獨呼叫 Lambda 表達式](#invoke-separately)

### 傳遞給另一個函式

將 Lambda 表達式傳遞給函式的一個很好的範例，是在集合上使用 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 函式：

```kotlin
fun main() {
    //sampleStart
    val numbers = listOf(1, -2, 3, -4, 5, -6)
    
    val positives = numbers.filter ({ x -> x > 0 })
    
    val isNegative = { x: Int -> x < 0 }
    val negatives = numbers.filter(isNegative)
    
    println(positives)
    // [1, 3, 5]
    println(negatives)
    // [-2, -4, -6]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-filter"}

`.filter()` 函式接受 Lambda 表達式作為判斷式 (predicate)：

*   `{ x -> x > 0 }` 取得清單中的每個元素，並只回傳那些正數。
*   `{ x -> x < 0 }` 取得清單中的每個元素，並只回傳那些負數。

此範例演示了兩種將 Lambda 表達式傳遞給函式的方式：

*   對於正數，範例將 Lambda 表達式直接添加到 `.filter()` 函式中。
*   對於負數，範例將 Lambda 表達式指派給 `isNegative` 變數。然後 `isNegative` 變數作為函式參數用於 `.filter()` 函式中。在這種情況下，您必須在 Lambda 表達式中指定函式參數 (`x`) 的型別。

> 如果 Lambda 表達式是唯一的函式參數，您可以省略函式括號 `()`：
>
> ```kotlin
> val positives = numbers.filter { x -> x > 0 }
> ```
>
> 這是 [尾隨 Lambda](#trailing-lambdas) 的一個範例，本章末尾將詳細討論。
>
{style="note"}

另一個很好的範例是使用 [`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) 函式來轉換集合中的項目：

```kotlin
fun main() {
    //sampleStart
    val numbers = listOf(1, -2, 3, -4, 5, -6)
    val doubled = numbers.map { x -> x * 2 }
    
    val isTripled = { x: Int -> x * 3 }
    val tripled = numbers.map(isTripled)
    
    println(doubled)
    // [2, -4, 6, -8, 10, -12]
    println(tripled)
    // [3, -6, 9, -12, 15, -18]
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-map"}

`.map()` 函式接受 Lambda 表達式作為轉換函式：

*   `{ x -> x * 2 }` 取得清單中的每個元素，並回傳該元素乘以 2 的結果。
*   `{ x -> x * 3 }` 取得清單中的每個元素，並回傳該元素乘以 3 的結果。

### 函式型別

在您可以從函式中回傳 Lambda 表達式之前，您需要先了解**函式型別**。

您已經學過基本型別，但函式本身也有型別。Kotlin 的型別推斷可以從參數型別推斷出函式的型別。但有時您可能需要明確指定函式型別。編譯器需要函式型別才能知道該函式允許什麼和不允許什麼。

函式型別的語法包含：

*   每個參數的型別寫在括號 `()` 內，並用逗號 `,` 分隔。
*   回傳型別寫在 `->` 後面。

例如：`(String) -> String` 或 `(Int, Int) -> Int`。

如果定義了 `upperCaseString()` 的函式型別，Lambda 表達式看起來像這樣：

```kotlin
val upperCaseString: (String) -> String = { text -> text.uppercase() }

fun main() {
    println(upperCaseString("hello"))
    // HELLO
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-function-type"}

如果您的 Lambda 表達式沒有參數，則括號 `()` 留空。例如：`() -> Unit`

> 您必須在 Lambda 表達式中或作為函式型別宣告參數和回傳型別。否則，編譯器將無法知道您的 Lambda 表達式是何種型別。
>
> 例如，以下程式碼將無法運作：
>
> `val upperCaseString = { str -> str.uppercase() }`
>
{style="note"}

### 從函式中回傳

Lambda 表達式可以從函式中回傳。為了讓編譯器理解所回傳的 Lambda 表達式型別，您必須宣告函式型別。

在以下範例中，`toSeconds()` 函式的函式型別為 `(Int) -> Int`，因為它總是回傳一個接受 `Int` 型別參數並回傳 `Int` 值的 Lambda 表達式。

此範例使用 `when` 表達式來判斷呼叫 `toSeconds()` 時回傳哪個 Lambda 表達式：

```kotlin
fun toSeconds(time: String): (Int) -> Int = when (time) {
    "hour" -> { value -> value * 60 * 60 }
    "minute" -> { value -> value * 60 }
    "second" -> { value -> value }
    else -> { value -> value }
}

fun main() {
    val timesInMinutes = listOf(2, 10, 15, 1)
    val min2sec = toSeconds("minute")
    val totalTimeInSeconds = timesInMinutes.map(min2sec).sum()
    println("Total time is $totalTimeInSeconds secs")
    // Total time is 1680 secs
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-return-from-function"}

### 單獨呼叫

Lambda 表達式可以透過在大括號 `{}` 後面加上括號 `()`，並在括號內包含任何參數來單獨呼叫：

```kotlin
fun main() {
    //sampleStart
    println({ text: String -> text.uppercase() }("hello"))
    // HELLO
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambda-standalone"}

### 尾隨 Lambda

如您所見，如果 Lambda 表達式是唯一的函式參數，您可以省略函式括號 `()`。如果 Lambda 表達式作為函式的最後一個參數傳遞，那麼該表達式可以寫在函式括號 `()` 之外。在這兩種情況下，這種語法都稱為**尾隨 Lambda (trailing lambda)**。

例如，[`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/fold.html) 函式接受一個初始值和一個操作：

```kotlin
fun main() {
    //sampleStart
    // The initial value is zero. 
    // The operation sums the initial value with every item in the list cumulatively.
    println(listOf(1, 2, 3).fold(0, { x, item -> x + item })) // 6

    // Alternatively, in the form of a trailing lambda
    println(listOf(1, 2, 3).fold(0) { x, item -> x + item })  // 6
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-trailing-lambda"}

有關 Lambda 表達式的更多資訊，請參閱 [Lambda 表達式與匿名函式](lambdas.md#lambda-expressions-and-anonymous-functions)。

我們旅程的下一步是學習 Kotlin 中的[類別](kotlin-tour-classes.md)。

## Lambda 表達式練習

### 練習 1 {initial-collapse-state="collapsed" collapsible="true" id="lambdas-exercise-1"}

您有一個網頁服務支援的動作列表，所有請求的通用前綴，以及特定資源的 ID。要請求對 ID 為 5 的資源執行動作 `title`，您需要建立以下 URL：`https://example.com/book-info/5/title`。使用 Lambda 表達式從動作列表中建立 URL 列表。

|---|---|
```kotlin
fun main() {
    val actions = listOf("title", "year", "author")
    val prefix = "https://example.com/book-info"
    val id = 5
    val urls = // Write your code here
    println(urls)
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambdas-exercise-1"}

|---|---|
```kotlin
fun main() {
    val actions = listOf("title", "year", "author")
    val prefix = "https://example.com/book-info"
    val id = 5
    val urls = actions.map { action -> "$prefix/$id/$action" }
    println(urls)
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-lambdas-solution-1"}

### 練習 2 {initial-collapse-state="collapsed" collapsible="true" id="lambdas-exercise-2"}

編寫一個函式，該函式接受一個 `Int` 值和一個動作（型別為 `() -> Unit` 的函式），然後重複該動作指定的次數。接著使用此函式印出「Hello」5 次。

|---|---|
```kotlin
fun repeatN(n: Int, action: () -> Unit) {
    // Write your code here
}

fun main() {
    // Write your code here
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-lambdas-exercise-2"}

|---|---|
```kotlin
fun repeatN(n: Int, action: () -> Unit) {
    for (i in 1..n) {
        action()
    }
}

fun main() {
    repeatN(5) {
        println("Hello")
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-lambdas-solution-2"}

## 下一步

[類別](kotlin-tour-classes.md)