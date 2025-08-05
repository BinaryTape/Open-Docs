[//]: # (title: 中級：擴展函數)

<no-index/>

<tldr>
    <p><img src="icon-1.svg" width="20" alt="First step" /> <strong>擴展函數</strong><br />
        <img src="icon-2-todo.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函數</a><br />
        <img src="icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">帶有接收者的 Lambda 表達式</a><br />
        <img src="icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">類別與介面</a><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">物件</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">開放類別與特殊類別</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">屬性</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">空值安全</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">函式庫與 API</a></p>
</tldr>

在本章中，您將探索特殊的 Kotlin 函數，它們能讓您的程式碼更簡潔、更易讀。了解它們如何幫助您使用高效的設計模式，將您的專案提升到新的水平。

## 擴展函數

在軟體開發中，您經常需要在不更改原始程式碼的情況下修改程式的行為。例如，在您的專案中，您可能希望為來自第三方函式庫的類別添加額外功能。

擴展函數允許您為類別擴展額外功能。您呼叫擴展函數的方式與呼叫類別的成員函數相同。

在介紹擴展函數的語法之前，您需要了解**接收者類型**和**接收者物件**這些術語。

接收者物件是函數被呼叫的對象。換句話說，接收者是資訊共享的目標。

![An example of sender and receiver](receiver-highlight.png){width="500"}

在此範例中，`main()` 函數呼叫了 [`.first()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/first.html) 函數。
`.first()` 函數是針對 `readOnlyShapes` 變數呼叫的，因此 `readOnlyShapes` 變數是接收者。

接收者物件具有**類型**，以便編譯器了解何時可以使用該函數。

此範例使用標準函式庫中的 `.first()` 函數來回傳列表中的第一個元素。要建立您自己的擴展函數，請撰寫您要擴展的類別名稱，後跟一個 `.` 和您的函數名稱。然後繼續撰寫函數宣告的其餘部分，包括其引數和回傳類型。

例如：

```kotlin
fun String.bold(): String = "<b>$this</b>"

fun main() {
    // "hello" 是接收者物件
    println("hello".bold())
    // <b>hello</b>
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-extension-function"}

在此範例中：

*   `String` 是被擴展的類別，也稱為接收者類型。
*   `bold` 是擴展函數的名稱。
*   `.bold()` 擴展函數的回傳類型是 `String`。
*   `"hello"`，一個 `String` 的實例，是接收者物件。
*   接收者物件在函數體內部透過 [關鍵字](keyword-reference.md)：`this` 來存取。
*   字串模板 (`$this`) 用來存取 `this` 的值。
*   `.bold()` 擴展函數接收一個字串並將其包裝在 `<b>` HTML 元素中，以顯示粗體文字。

## 擴展導向設計

您可以將擴展函數定義在任何位置，這使您能夠建立擴展導向設計。這些設計將核心功能與有用但非必要的功能分開，使您的程式碼更易於閱讀和維護。

一個很好的例子是來自 Ktor 函式庫的 [`HttpClient`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) 類別，它有助於執行網路請求。其核心功能是單一的 `request()` 函數，它接收 HTTP 請求所需的所有資訊：

```kotlin
class HttpClient {
    fun request(method: String, url: String, headers: Map<String, String>): HttpResponse {
        // 網路程式碼
    }
}
```
{validate="false"}

在實踐中，最受歡迎的 HTTP 請求是 GET 或 POST 請求。對於函式庫來說，為這些常見用例提供較短的名稱是合理的。然而，這些不需要撰寫新的網路程式碼，只需要特定的 `request` 呼叫。換句話說，它們是定義為單獨的 `.get()` 和 `.post()` 擴展函數的完美候選者：

```kotlin
fun HttpClient.get(url: String): HttpResponse = request("GET", url, emptyMap())
fun HttpClient.post(url: String): HttpResponse = request("POST", url, emptyMap())
```
{validate="false"}

這些 `.get()` 和 `.post()` 函數會呼叫 `request()` 函數並帶有正確的 HTTP 方法，因此您不必這麼做。它們簡化了您的程式碼並使其更易於理解：

```kotlin
class HttpClient {
    fun request(method: String, url: String, headers: Map<String, String>): HttpResponse {
        println("Requesting $method to $url with headers: $headers")
        return HttpResponse("Response from $url")
    }
}

fun HttpClient.get(url: String): HttpResponse = request("GET", url, emptyMap())

fun main() {
    val client = HttpClient()

    // 直接使用 request() 進行 GET 請求
    val getResponseWithMember = client.request("GET", "https://example.com", emptyMap())

    // 使用 get() 擴展函數進行 GET 請求
    val getResponseWithExtension = client.get("https://example.com")
}
```
{validate="false"}

這種擴展導向的方法在 Kotlin 的 [標準函式庫](https://kotlinlang.org/api/latest/jvm/stdlib/) 和其他函式庫中被廣泛使用。例如，`String` 類別有許多 [擴展函數](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/#extension-functions) 可幫助您處理字串。

有關擴展函數的更多資訊，請參閱 [擴展](extensions.md)。

## 練習

### 練習 1 {initial-collapse-state="collapsed" collapsible="true" id="extension-functions-exercise-1"}

撰寫一個名為 `isPositive` 的擴展函數，它接收一個整數並檢查它是否為正數。

|---|---|
```kotlin
fun Int.// Write your code here

fun main() {
    println(1.isPositive())
    // true
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-extension-functions-exercise-1"}

|---|---|
```kotlin
fun Int.isPositive(): Boolean = this > 0

fun main() {
    println(1.isPositive())
    // true
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-extension-functions-solution-1"}

### 練習 2 {initial-collapse-state="collapsed" collapsible="true" id="extension-functions-exercise-2"}

撰寫一個名為 `toLowercaseString` 的擴展函數，它接收一個字串並回傳其小寫版本。

<deflist collapsible="true">
    <def title="提示">
        使用 `String` 類型的 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html"> <code>.lowercase()</code> </a> 函數。
    </def>
</deflist>

|---|---|
```kotlin
fun // Write your code here

fun main() {
    println("Hello World!".toLowercaseString())
    // hello world!
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-extension-functions-exercise-2"}

|---|---|
```kotlin
fun String.toLowercaseString(): String = this.lowercase()

fun main() {
    println("Hello World!".toLowercaseString())
    // hello world!
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-extension-functions-solution-2"}

## 下一步

[中級：作用域函數](kotlin-tour-intermediate-scope-functions.md)