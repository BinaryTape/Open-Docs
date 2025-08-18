[//]: # (title: 進階：作用域函式)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">擴充函式</a><br />
        <img src="icon-2.svg" width="20" alt="Second step" /> <strong>作用域函式</strong><br />
        <img src="icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">帶接收者的 Lambda 表達式</a><br />
        <img src="icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">類別與介面</a><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">物件</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">開放類別與特殊類別</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">屬性</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">空值安全性</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">函式庫與 API</a></p>
</tldr>

在本章節中，您將基於您對擴充函式的理解，學習如何使用作用域函式來撰寫更具慣用語法的程式碼。

## 作用域函式

在程式設計中，作用域是您的變數或物件被識別的區域。最常被提及的作用域是全域作用域和局部作用域：

*   **全域作用域** – 變數或物件可在程式中任何地方存取。
*   **局部作用域** – 變數或物件僅在其定義的區塊或函式內可存取。

在 Kotlin 中，也有作用域函式允許您圍繞著一個物件建立一個臨時作用域並執行一些程式碼。

作用域函式使您的程式碼更簡潔，因為您無需在臨時作用域內引用您的物件名稱。根據不同的作用域函式，您可以透過關鍵字 `this` 引用物件，或者透過關鍵字 `it` 將其作為引數使用。

Kotlin 總共有五個作用域函式：`let`、`apply`、`run`、`also` 和 `with`。

每個作用域函式都接受一個 Lambda 表達式，並返回物件本身或 Lambda 表達式的結果。在此教學中，我們將解釋每個作用域函式及其使用方法。

> 您也可以觀看 Kotlin 開發者倡導者 Sebastian Aigner 關於作用域函式的演講：[回歸標準函式庫：充分利用 Kotlin 標準函式庫](https://youtu.be/DdvgvSHrN9g?feature=shared&t=1511)。
> 
{style="tip"}

### let

當您想在程式碼中執行空值檢查，並隨後對返回的物件執行進一步操作時，請使用 `let` 作用域函式。

請看以下範例：

```kotlin
fun sendNotification(recipientAddress: String): String {
    println("Yo $recipientAddress!")
    return "Notification sent!"
}

fun getNextAddress(): String {
    return "sebastian@jetbrains.com"
}

fun main() {
    val address: String? = getNextAddress()
    sendNotification(address)
}
```
{validate = "false"}

此範例有兩個函式：
*   `sendNotification()`，它有一個函式引數 `recipientAddress` 並返回一個字串。
*   `getNextAddress()`，它沒有函式引數並返回一個字串。

此範例建立了一個變數 `address`，其類型是可空值的 `String`。但當您呼叫 `sendNotification()` 函式時，這會成為一個問題，因為此函式不預期 `address` 可能是一個 `null` 值。結果編譯器會報告錯誤：

```text
Argument type mismatch: actual type is 'String?', but 'String' was expected.
```

從初學者教學中，您已經知道可以使用 if 條件式執行空值檢查，或使用 [Elvis 運算子 `?:`](kotlin-tour-null-safety.md#use-elvis-operator)。但是，如果您想稍後在程式碼中使用返回的物件該怎麼辦？您可以透過 if 條件式**以及**一個 else 分支來實現：

```kotlin
fun sendNotification(recipientAddress: String): String {
    println("Yo $recipientAddress!")
    return "Notification sent!"
}

fun getNextAddress(): String {
    return "sebastian@jetbrains.com"
}

fun main() { 
    //sampleStart
    val address: String? = getNextAddress()
    val confirm = if(address != null) {
        sendNotification(address)
    } else { null }
    //sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-let-non-null-if"}

然而，一個更簡潔的方法是使用 `let` 作用域函式：

```kotlin
fun sendNotification(recipientAddress: String): String {
    println("Yo $recipientAddress!")
    return "Notification sent!"
}

fun getNextAddress(): String {
    return "sebastian@jetbrains.com"
}

fun main() {
    //sampleStart
    val address: String? = getNextAddress()
    val confirm = address?.let {
        sendNotification(it)
    }
    //sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-let-non-null"}

此範例：
*   建立一個名為 `confirm` 的變數。
*   在 `address` 變數上使用 `let` 作用域函式的安全呼叫。
*   在 `let` 作用域函式內建立一個臨時作用域。
*   將 `sendNotification()` 函式作為 Lambda 表達式傳遞給 `let` 作用域函式。
*   透過 `it` 引用 `address` 變數，利用臨時作用域。
*   將結果指派給 `confirm` 變數。

透過這種方法，您的程式碼可以處理 `address` 變數可能為 `null` 值的情況，並且您可以在程式碼的後續部分使用 `confirm` 變數。

### apply

當您想在建立物件（例如類別實例）時就初始化它，而不是稍後才在程式碼中進行時，請使用 `apply` 作用域函式。這種方法使您的程式碼更容易閱讀和管理。

請看以下範例：

```kotlin
class Client() {
    var token: String? = null
    fun connect() = println("connected!")
    fun authenticate() = println("authenticated!")
    fun getData(): String = "Mock data"
}

val client = Client()

fun main() {
    client.token = "asdf"
    client.connect()
    // connected!
    client.authenticate()
    // authenticated!
    client.getData()
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-apply-before"}

此範例有一個 `Client` 類別，其中包含一個名為 `token` 的屬性以及三個成員函式：`connect()`、`authenticate()` 和 `getData()`。

此範例在 `main()` 函式中初始化 `token` 屬性並呼叫其成員函式之前，將 `client` 建立為 `Client` 類別的一個實例。

儘管此範例很簡潔，但在實際應用中，在您建立類別實例之後，可能需要一段時間才能設定和使用它（及其成員函式）。然而，如果您使用 `apply` 作用域函式，您可以在程式碼中的同一個地方建立、設定並使用您的類別實例上的成員函式：

```kotlin
class Client() {
  var token: String? = null
  fun connect() = println("connected!")
  fun authenticate() = println("authenticated!")
  fun getData(): String = "Mock data"
}
//sampleStart
val client = Client().apply {
  token = "asdf"
  connect()
  authenticate()
}

fun main() {
  client.getData()
  // connected!
  // authenticated!
}
//sampleEnd
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-apply-after"}

此範例：

*   將 `client` 建立為 `Client` 類別的一個實例。
*   在 `client` 實例上使用 `apply` 作用域函式。
*   在 `apply` 作用域函式內建立一個臨時作用域，這樣您在存取其屬性或函式時，就不必明確引用 `client` 實例。
*   將一個 Lambda 表達式傳遞給 `apply` 作用域函式，該表達式更新 `token` 屬性並呼叫 `connect()` 和 `authenticate()` 函式。
*   在 `main()` 函式中，在 `client` 實例上呼叫 `getData()` 成員函式。

如您所見，當您處理大量程式碼時，這種策略非常方便。

### run

與 `apply` 類似，您可以使用 `run` 作用域函式來初始化物件，但最好是在程式碼中的特定時刻初始化物件**並**立即計算結果時使用 `run`。

讓我們繼續 `apply` 函式的上一個範例，但這次，您希望 `connect()` 和 `authenticate()` 函式被分組，以便在每個請求上被呼叫。

例如：

```kotlin
class Client() {
    var token: String? = null
    fun connect() = println("connected!")
    fun authenticate() = println("authenticated!")
    fun getData(): String = "Mock data"
}

//sampleStart
val client: Client = Client().apply {
    token = "asdf"
}

fun main() {
    val result: String = client.run {
        connect()
        // connected!
        authenticate()
        // authenticated!
        getData()
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-run"}

此範例：

*   將 `client` 建立為 `Client` 類別的一個實例。
*   在 `client` 實例上使用 `apply` 作用域函式。
*   在 `apply` 作用域函式內建立一個臨時作用域，這樣您在存取其屬性或函式時，就不必明確引用 `client` 實例。
*   將一個 Lambda 表達式傳遞給 `apply` 作用域函式，該表達式更新 `token` 屬性。

在 `main()` 函式中：

*   建立一個類型為 `String` 的 `result` 變數。
*   在 `client` 實例上使用 `run` 作用域函式。
*   在 `run` 作用域函式內建立一個臨時作用域，這樣您在存取其屬性或函式時，就不必明確引用 `client` 實例。
*   將一個 Lambda 表達式傳遞給 `run` 作用域函式，該表達式呼叫 `connect()`、`authenticate()` 和 `getData()` 函式。
*   將結果指派給 `result` 變數。

現在您可以在程式碼中進一步使用返回的結果。

### also

使用 `also` 作用域函式來對物件完成一個額外動作，然後返回該物件以便在程式碼中繼續使用，例如撰寫日誌。

請看以下範例：

```kotlin
fun main() {
    val medals: List<String> = listOf("Gold", "Silver", "Bronze")
    val reversedLongUppercaseMedals: List<String> =
        medals
            .map { it.uppercase() }
            .filter { it.length > 4 }
            .reversed()
    println(reversedLongUppercaseMedals)
    // [BRONZE, SILVER]
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-also-before"}

此範例：

*   建立包含字串列表的 `medals` 變數。
*   建立類型為 `List<String>` 的 `reversedLongUpperCaseMedals` 變數。
*   在 `medals` 變數上使用 `.map()` 擴充函式。
*   將一個 Lambda 表達式傳遞給 `.map()` 函式，該表達式透過 `it` 關鍵字引用 `medals` 並在其上呼叫 `.uppercase()` 擴充函式。
*   在 `medals` 變數上使用 `.filter()` 擴充函式。
*   將一個 Lambda 表達式作為判斷式傳遞給 `.filter()` 函式，該表達式透過 `it` 關鍵字引用 `medals` 並檢查 `medals` 變數中包含的列表長度是否超過 4 個項目。
*   在 `medals` 變數上使用 `.reversed()` 擴充函式。
*   將結果指派給 `reversedLongUpperCaseMedals` 變數。
*   列印 `reversedLongUpperCaseMedals` 變數中包含的列表。

在函式呼叫之間添加一些日誌來查看 `medals` 變數發生了什麼會很有用。`also` 函式有助於此：

```kotlin
fun main() {
    val medals: List<String> = listOf("Gold", "Silver", "Bronze")
    val reversedLongUppercaseMedals: List<String> =
        medals
            .map { it.uppercase() }
            .also { println(it) }
            // [GOLD, SILVER, BRONZE]
            .filter { it.length > 4 }
            .also { println(it) }
            // [SILVER, BRONZE]
            .reversed()
    println(reversedLongUppercaseMedals)
    // [BRONZE, SILVER]
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-also-after"}

現在此範例：

*   在 `medals` 變數上使用 `also` 作用域函式。
*   在 `also` 作用域函式內建立一個臨時作用域，這樣當您將 `medals` 變數作為函式引數使用時，就不必明確引用它。
*   將一個 Lambda 表達式傳遞給 `also` 作用域函式，該表達式呼叫 `println()` 函式，並透過 `it` 關鍵字將 `medals` 變數作為函式引數。

由於 `also` 函式返回物件本身，因此它不僅用於日誌記錄，也可用於除錯、鏈式呼叫多個操作，以及執行其他不影響程式碼主流程的副作用操作。

### with

與其他作用域函式不同，`with` 不是一個擴充函式，因此語法不同。您需要將接收者物件作為引數傳遞給 `with`。

當您想在一個物件上呼叫多個函式時，請使用 `with` 作用域函式。

請看此範例：

```kotlin
class Canvas {
    fun rect(x: Int, y: Int, w: Int, h: Int): Unit = println("$x, $y, $w, $h")
    fun circ(x: Int, y: Int, rad: Int): Unit = println("$x, $y, $rad")
    fun text(x: Int, y: Int, str: String): Unit = println("$x, $y, $str")
}

fun main() {
    val mainMonitorPrimaryBufferBackedCanvas = Canvas()

    mainMonitorPrimaryBufferBackedCanvas.text(10, 10, "Foo")
    mainMonitorPrimaryBufferBackedCanvas.rect(20, 30, 100, 50)
    mainMonitorPrimaryBufferBackedCanvas.circ(40, 60, 25)
    mainMonitorPrimaryBufferBackedCanvas.text(15, 45, "Hello")
    mainMonitorPrimaryBufferBackedCanvas.rect(70, 80, 150, 100)
    mainMonitorPrimaryBufferBackedCanvas.circ(90, 110, 40)
    mainMonitorPrimaryBufferBackedCanvas.text(35, 55, "World")
    mainMonitorPrimaryBufferBackedCanvas.rect(120, 140, 200, 75)
    mainMonitorPrimaryBufferBackedCanvas.circ(160, 180, 55)
    mainMonitorPrimaryBufferBackedCanvas.text(50, 70, "Kotlin")
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-with-before"}

此範例建立了一個 `Canvas` 類別，該類別有三個成員函式：`rect()`、`circ()` 和 `text()`。每個成員函式都會列印一個由您提供的函式引數構成的陳述。

此範例將 `mainMonitorPrimaryBufferBackedCanvas` 建立為 `Canvas` 類別的一個實例，然後在該實例上呼叫一系列帶有不同函式引數的成員函式。

您可以看到這段程式碼很難閱讀。如果您使用 `with` 函式，程式碼將會精簡：

```kotlin
class Canvas {
    fun rect(x: Int, y: Int, w: Int, h: Int): Unit = println("$x, $y, $w, $h")
    fun circ(x: Int, y: Int, rad: Int): Unit = println("$x, $y, $rad")
    fun text(x: Int, y: Int, str: String): Unit = println("$x, $y, $str")
}

fun main() {
    //sampleStart
    val mainMonitorSecondaryBufferBackedCanvas = Canvas()
    with(mainMonitorSecondaryBufferBackedCanvas) {
        text(10, 10, "Foo")
        rect(20, 30, 100, 50)
        circ(40, 60, 25)
        text(15, 45, "Hello")
        rect(70, 80, 150, 100)
        circ(90, 110, 40)
        text(35, 55, "World")
        rect(120, 140, 200, 75)
        circ(160, 180, 55)
        text(50, 70, "Kotlin")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-with-after"}

此範例：
*   使用 `with` 作用域函式，並將 `mainMonitorSecondaryBufferBackedCanvas` 實例作為接收者物件。
*   在 `with` 作用域函式內建立一個臨時作用域，這樣您在呼叫其成員函式時，就不必明確引用 `mainMonitorSecondaryBufferBackedCanvas` 實例。
*   將一個 Lambda 表達式傳遞給 `with` 作用域函式，該表達式呼叫一系列帶有不同函式引數的成員函式。

現在這段程式碼更容易閱讀了，您犯錯的可能性也會降低。

## 使用案例概覽

本節介紹了 Kotlin 中可用的不同作用域函式及其主要使用案例，以使您的程式碼更具慣用語法。您可以使用此表格作為快速參考。值得注意的是，您無需完全理解這些函式的工作原理即可在程式碼中使用它們。

| 函式 | 透過 `x` 存取 | 回傳值 | 使用案例 |
|----------|-------------------|---------------|----------------------------------------------------------------------------------------------|
| `let`    | `it`              | Lambda 結果 | 在程式碼中執行空值檢查，並隨後對返回的物件執行進一步操作。 |
| `apply`  | `this`            | `x`           | 在建立時初始化物件。 |
| `run`    | `this`            | Lambda 結果 | 在建立時初始化物件**並**計算結果。 |
| `also`   | `it`              | `x`           | 在返回物件之前完成額外動作。 |
| `with`   | `this`            | Lambda 結果 | 在一個物件上呼叫多個函式。 |

有關作用域函式的更多資訊，請參閱[作用域函式](scope-functions.md)。

## 練習

### 練習 1 {initial-collapse-state="collapsed" collapsible="true" id="scope-functions-exercise-1"}

將 `.getPriceInEuros()` 函式重寫為使用安全呼叫運算子 `?.` 和 `let` 作用域函式的單表達式函式。

<deflist collapsible="true">
    <def title="提示">
        使用安全呼叫運算子 <code>?.</code> 安全地從 <code>getProductInfo()</code> 函式存取 <code>priceInDollars</code> 屬性。然後，使用 <code>let</code> 作用域函式將 <code>priceInDollars</code> 的值轉換為歐元。
    </def>
</deflist>

|---|---|
```kotlin
data class ProductInfo(val priceInDollars: Double?)

class Product {
    fun getProductInfo(): ProductInfo? {
        return ProductInfo(100.0)
    }
}

// Rewrite this function
fun Product.getPriceInEuros(): Double? {
    val info = getProductInfo()
    if (info == null) return null
    val price = info.priceInDollars
    if (price == null) return null
    return convertToEuros(price)
}

fun convertToEuros(dollars: Double): Double {
    return dollars * 0.85
}

fun main() {
    val product = Product()
    val priceInEuros = product.getPriceInEuros()

    if (priceInEuros != null) {
        println("Price in Euros: €$priceInEuros")
        // Price in Euros: €85.0
    } else {
        println("Price information is not available.")
    }
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-scope-functions-exercise-1"}

|---|---|
```kotlin
data class ProductInfo(val priceInDollars: Double?)

class Product {
    fun getProductInfo(): ProductInfo? {
        return ProductInfo(100.0)
    }
}

fun Product.getPriceInEuros() = getProductInfo()?.priceInDollars?.let { convertToEuros(it) }

fun convertToEuros(dollars: Double): Double {
    return dollars * 0.85
}

fun main() {
    val product = Product()
    val priceInEuros = product.getPriceInEuros()

    if (priceInEuros != null) {
        println("Price in Euros: €$priceInEuros")
        // Price in Euros: €85.0
    } else {
        println("Price information is not available.")
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-scope-functions-solution-1"}

### 練習 2 {initial-collapse-state="collapsed" collapsible="true" id="scope-functions-exercise-2"}

您有一個 `updateEmail()` 函式，用於更新使用者的電子郵件地址。使用 `apply` 作用域函式來更新電子郵件地址，然後使用 `also` 作用域函式來列印日誌訊息：`Updating email for user with ID: ${it.id}`。

|---|---|
```kotlin
data class User(val id: Int, var email: String)

fun updateEmail(user: User, newEmail: String): User = // Write your code here

fun main() {
    val user = User(1, "old_email@example.com")
    val updatedUser = updateEmail(user, "new_email@example.com")
    // Updating email for user with ID: 1

    println("Updated User: $updatedUser")
    // Updated User: User(id=1, email=new_email@example.com)
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-scope-functions-exercise-2"}

|---|---|
```kotlin
data class User(val id: Int, var email: String)

fun updateEmail(user: User, newEmail: String): User = user.apply {
    this.email = newEmail
}.also { println("Updating email for user with ID: ${it.id}") }

fun main() {
    val user = User(1, "old_email@example.com")
    val updatedUser = updateEmail(user, "new_email@example.com")
    // Updating email for user with ID: 1

    println("Updated User: $updatedUser")
    // Updated User: User(id=1, email=new_email@example.com)
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-scope-functions-solution-2"}

## 下一步

[進階：帶接收者的 Lambda 表達式](kotlin-tour-intermediate-lambdas-receiver.md)