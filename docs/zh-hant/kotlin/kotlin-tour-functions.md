---
title: "函數 (Functions)"
---
<no-index/>

:::info
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world">Hello world</a><br />
        <img src="/img/icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types">基本型別 (Basic types)</a><br />
        <img src="/img/icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections">集合 (Collections)</a><br />
        <img src="/img/icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow">控制流程 (Control flow)</a><br />
        <img src="/img/icon-5.svg" width="20" alt="Fifth step" /> <strong>函式 (Functions)</strong><br />
        <img src="/img/icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-classes">類別 (Classes)</a><br />
        <img src="/img/icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety">Null 安全 (Null safety)</a>
</p>

:::

您可以使用 `fun` 關鍵字在 Kotlin 中宣告您自己的函式。

```kotlin
fun hello() {
    return println("Hello, world!")
}

fun main() {
    hello()
    // Hello, world!
}
```

在 Kotlin 中：

* 函式參數寫在括號 `()` 內。
* 每個參數都必須有一個型別，多個參數必須以逗號 `,` 分隔。
* 傳回型別寫在函式的括號 `()` 之後，以冒號 `:` 分隔。
* 函式的主體寫在大括號 `{}` 內。
* `return` 關鍵字用於從函式退出或傳回某些內容。

:::note
如果函式沒有傳回任何有用的東西，則可以省略傳回型別和 `return` 關鍵字。 在[沒有傳回值的函式](#functions-without-return)中了解更多相關資訊。

:::

在以下範例中：

* `x` 和 `y` 是函式參數。
* `x` 和 `y` 的型別為 `Int`。
* 函式的傳回型別為 `Int`。
* 該函式在呼叫時傳回 `x` 和 `y` 的總和。

```kotlin
fun sum(x: Int, y: Int): Int {
    return x + y
}

fun main() {
    println(sum(1, 2))
    // 3
}
```

:::note
我們建議在我們的[程式碼慣例 (coding conventions)](coding-conventions#function-names)中，您以小寫字母開頭命名函式，並使用駝峰式大小寫，不帶底線。

:::

## 具名引數 (Named arguments)

為了簡潔的程式碼，在呼叫函式時，您不必包含參數名稱。 但是，包含參數名稱確實使您的程式碼更易於閱讀。 這稱為使用**具名引數 (named arguments)**。 如果您確實包含參數名稱，則可以用任何順序編寫參數。

:::note
在以下範例中，[字串模板 (string templates)](strings#string-templates) 用於存取參數值、將其轉換為 `String` 型別，然後將它們連接成一個字串以進行列印。

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

## 預設參數值 (Default parameter values)

您可以為函式參數定義預設值。 呼叫函式時，可以省略任何具有預設值的參數。 若要宣告預設值，請在型別後使用賦值運算子 `=`：

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

您可以跳過具有預設值的特定參數，而不是全部省略。 但是，在第一個跳過的參數之後，您必須命名所有後續參數。

:::

## 沒有傳回值的函式 (Functions without return)

如果您的函式沒有傳回有用的值，則其傳回型別為 `Unit`。 `Unit` 是一種只有一個值的型別 – `Unit`。 您不必在函式主體中明確宣告傳回 `Unit`。 這表示您不必使用 `return` 關鍵字或宣告傳回型別：

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

## 單一表達式函式 (Single-expression functions)

為了使您的程式碼更簡潔，您可以使用單一表達式函式。 例如，可以縮短 `sum()` 函式：

```kotlin
fun sum(x: Int, y: Int): Int {
    return x + y
}

fun main() {
    println(sum(1, 2))
    // 3
}
```

您可以移除大括號 `{}` 並使用賦值運算子 `=` 宣告函式主體。 當您使用賦值運算子 `=` 時，Kotlin 會使用型別推斷，因此您也可以省略傳回型別。 然後，`sum()` 函式變成一行：

```kotlin
fun sum(x: Int, y: Int) = x + y

fun main() {
    println(sum(1, 2))
    // 3
}
```

但是，如果您希望其他開發人員能夠快速理解您的程式碼，即使在使用賦值運算子 `=` 時，明確定義傳回型別也是一個好主意。

:::note
如果您使用 `{}` 大括號宣告函式主體，則必須宣告傳回型別，除非它是 `Unit` 型別。

:::

## 函式中的提前返回 (Early returns in functions)

若要停止函式中的程式碼在超過某個點後被進一步處理，請使用 `return` 關鍵字。 此範例使用 `if` 在條件表達式被發現為 true 時從函式提前返回：

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

## 函式練習 (Functions practice)

### 練習 1

編寫一個名為 `circleArea` 的函式，該函式以整數格式作為圓的半徑，並輸出該圓的面積。

:::note
在本練習中，您匯入一個套件，以便可以透過 `PI` 存取 pi 的值。 有關匯入套件的更多資訊，請參閱 [套件和匯入 (Packages and imports)](packages)。

:::

|---|---|
```kotlin
import kotlin.math.PI

// Write your code here

fun main() {
    println(circleArea(2))
}
```

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

### 練習 2

將上一個練習中的 `circleArea` 函式重寫為單一表達式函式。

|---|---|
```kotlin
import kotlin.math.PI

// Write your code here

fun main() {
    println(circleArea(2))
}
```

|---|---|
```kotlin
import kotlin.math.PI

fun circleArea(radius: Int): Double = PI * radius * radius

fun main() {
    println(circleArea(2)) // 12.566370614359172
}
```

### 練習 3

您有一個函式，可將以小時、分鐘和秒為單位的時間間隔轉換為秒。 在大多數情況下，您只需要傳遞一或兩個函式參數，而其餘參數等於 0。 透過使用預設參數值和具名引數來改進函式和呼叫它的程式碼，以便程式碼更易於閱讀。

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

## Lambda 表達式 (Lambda expressions)

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

也可以寫成 Lambda 表達式：

```kotlin
fun main() {
    val upperCaseString = { text: String -
:::note
 text.uppercase() }
    println(upperCaseString("hello"))
    // HELLO
}
```

Lambda 表達式乍看之下可能難以理解，所以讓我們分解一下。 Lambda 表達式寫在大括號 `{}` 內。

在 Lambda 表達式中，您編寫：

* 參數，後跟 `->`。
* `->` 之後的函式主體。

在前面的範例中：

* `text` 是一個函式參數。
* `text` 的型別為 `String`。
* 該函式傳回在 `text` 上呼叫的 [`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase.html) 函式的結果。
* 整個 Lambda 表達式透過賦值運算子 `=` 賦值給 `upperCaseString` 變數。
* 透過像函式一樣使用變數 `upperCaseString` 以及字串 `"hello"` 作為參數來呼叫 Lambda 表達式。
* `println()` 函式列印結果。

如果您宣告一個沒有參數的 Lambda 表達式，則不需要使用 `->`。 例如：
```kotlin
{ println("Log message") }
```

:::

Lambda 表達式可以用多種方式使用。 您可以：

* [將 Lambda 表達式作為參數傳遞給另一個函式](#pass-to-another-function)
* [從函式傳回 Lambda 表達式](#return-from-a-function)
* [單獨呼叫 Lambda 表達式](#invoke-separately)

### 傳遞給另一個函式 (Pass to another function)

將 Lambda 表達式傳遞給函式的一個很好的範例是，在集合上使用 [`.filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html) 函式：

```kotlin
fun main() {

    val numbers = listOf(1, -2, 3, -4, 5, -6)
    
    
    val positives = numbers.filter ({ x `->` x > 0 })
    
    val isNegative = { x: Int `->` x < 0 }
    val negatives = numbers.filter(isNegative)
    
    println(positives)
    // [1, 3, 5]
    println(negatives)
    // [-2, -4, -6]

}
```

`.filter()` 函式接受 Lambda 表達式作為謂詞：

* `{ x `->` x > 0 }` 採用列表中的每個元素，並且僅傳回那些為正數的元素。
* `{ x `->` x < 0 }` 採用列表中的每個元素，並且僅傳回那些為負數的元素。

此範例示範了將 Lambda 表達式傳遞給函式的兩種方式：

* 對於正數，該範例直接在 `.filter()` 函式中新增 Lambda 表達式。
* 對於負數，該範例將 Lambda 表達式賦值給 `isNegative` 變數。 然後，`isNegative` 變數用作 `.filter()` 函式中的函式參數。 在這種情況下，您必須在 Lambda 表達式中指定函式參數 (`x`) 的型別。

:::note
如果 Lambda 表達式是唯一的函式參數，您可以刪除函式括號 `()`：

```kotlin
val positives = numbers.filter { x `->` x > 0 }
```

這是一個[尾隨 Lambda (trailing lambda)](#trailing-lambdas)的範例，在本章結尾有更詳細的討論。

:::

另一個好的範例是使用 [`.map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html) 函式來轉換集合中的項目：

```kotlin
fun main() {

    val numbers = listOf(1, -2, 3, -4, 5, -6)
    val doubled = numbers.map { x `->` x * 2 }
    
    val isTripled = { x: Int `->` x * 3 }
    val tripled = numbers.map(isTripled)
    
    println(doubled)
    // [2, -4, 6, -8, 10, -12]
    println(tripled)
    // [3, -6, 9, -12, 15, -18]

}
```

`.map()` 函式接受 Lambda 表達式作為轉換函式：

* `{ x `->` x * 2 }` 採用列表中的每個元素，並且傳回該元素乘以 2。
* `{ x `->` x * 3 }` 採用列表中的每個元素，並且傳回該元素乘以 3。

### 函式型別 (Function types)

在您可以從函式傳回 Lambda 表達式之前，您首先需要了解**函式型別 (function types)**。

您已經了解了基本型別，但函式本身也有一個型別。 Kotlin 的型別推斷可以從參數型別推斷函式的型別。 但是，有時您可能需要明確指定函式型別。 編譯器需要函式型別，以便它知道該函式允許和不允許什麼。

函式型別的語法具有：

* 每個參數的型別寫在括號 `()` 內，並以逗號 `,` 分隔。
* 傳回型別寫在 `->` 之後。

例如：`(String) `->` String` 或 `(Int, Int) `->` Int`。

如果定義了 `upperCaseString()` 的函式型別，則 Lambda 表達式如下所示：

```kotlin
val upperCaseString: (String) `->` String = { text `->` text.uppercase() }

fun main() {
    println(upperCaseString("hello"))
    // HELLO
}
```

如果您的 Lambda 表達式沒有參數，則括號 `()` 會留空。 例如：`() `->` Unit`

您必須在 Lambda 表達式中或作為函式型別宣告參數和傳回型別。 否則，編譯器將無法知道您的 Lambda 表達式是什麼型別。

例如，以下程式碼將無法運作：

`val upperCaseString = { str `->` str.uppercase() }`

:::

### 從函式傳回 (Return from a function)

Lambda 表達式可以從函式傳回。 為了使編譯器理解傳回的 Lambda 表達式是什麼型別，您必須宣告函式型別。

在以下範例中，`toSeconds()` 函式具有函式型別 `(Int) `->` Int`，因為它始終傳回一個 Lambda 表達式，該表達式接受一個 `Int` 型別的參數並傳回一個 `Int` 值。

此範例使用 `when` 表達式來確定在呼叫 `toSeconds()` 時傳回哪個 Lambda 表達式：

```kotlin
fun toSeconds(time: String): (Int) `->` Int = when (time) {
    "hour" `->` { value `->` value * 60 * 60 }
    "minute" `->` { value `->` value * 60 }
    "second" `->` { value `->` value }
    else `->` { value `->` value }
}

fun main() {
    val timesInMinutes = listOf(2, 10, 15, 1)
    val min2sec = toSeconds("minute")
    val totalTimeInSeconds = timesInMinutes.map(min2sec).sum()
    println("Total time is $totalTimeInSeconds secs")
    // Total time is 1680 secs
}
```

### 單獨呼叫 (Invoke separately)

Lambda 表達式可以透過在大括號 `{}` 後面新增括號 `()` 並在括號內包含任何參數來單獨呼叫：

```kotlin
fun main() {

    println({ text: String `->` text.uppercase() }("hello"))
    // HELLO

}
```

### 尾隨 Lambda (Trailing lambdas)

正如您已經看到的，如果 Lambda 表達式是唯一的函式參數，您可以刪除函式括號 `()`。 如果 Lambda 表達式作為函式的最後一個參數傳遞，則該表達式可以寫在函式括號 `()` 之外。 在這兩種情況下，此語法都稱為**尾隨 Lambda (trailing lambda)**。

例如，[`.fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/fold.html) 函式接受一個初始值和一個運算：

```kotlin
fun main() {

    // The initial value is zero. 
    // The operation sums the initial value with every item in the list cumulatively.
    println(listOf(1, 2, 3).fold(0, { x, item `->` x + item })) // 6

    // Alternatively, in the form of a trailing lambda
    println(listOf(1, 2, 3).fold(0) { x, item `->` x + item })  // 6

}
```

有關 Lambda 表達式的更多資訊，請參閱 [Lambda 表達式和匿名函式 (Lambda expressions and anonymous functions)](lambdas#lambda-expressions-and-anonymous-functions)。

我們旅程的下一步是學習 Kotlin 中的[類別 (classes)](kotlin-tour-classes)。

## Lambda 表達式練習 (Lambda expressions practice)

### 練習 1

您有一個 Web 服務支援的動作列表、所有請求的通用前綴以及特定資源的 ID。 若要請求對 ID 為 5 的資源執行動作 `title`，您需要建立以下 URL：`https://example.com/book-info/5/title`。 使用 Lambda 表達式從動作清單建立 URL 清單。

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

|---|---|
```kotlin
fun main() {
    val actions = listOf("title", "year", "author")
    val prefix = "https://example.com/book-info"
    val id = 5
    val urls = actions.map { action `->` "$prefix/$id/$action" }
    println(urls)
}
```

### 練習 2

編寫一個函式，該函式接受一個 `Int` 值和一個動作（型別為 `() `->` Unit` 的函式），然後將該動作重複給定的次數。 然後使用此函式列印 “Hello” 5 次。

|---|---|
```kotlin
fun repeatN(n: Int, action: () `->` Unit) {
    // Write your code here
}

fun main() {
    // Write your code here
}
```

|---|---|
```kotlin
fun repeatN(n: Int, action: () `->` Unit) {
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

## 下一步

[類別 (Classes)](kotlin-tour-classes)