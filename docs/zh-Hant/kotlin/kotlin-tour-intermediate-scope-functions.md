[//]: # (title: 中階：範疇函式)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">擴充函式</a><br />
        <img src="icon-2.svg" width="20" alt="Second step" /> <strong>範疇函式</strong><br />
        <img src="icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">帶有接收者的 Lambda 表達式</a><br />
        <img src="icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">類別與介面</a><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">物件</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">開放類別與特殊類別</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">屬性</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">空值安全</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">函式庫與 API</a></p>
</tldr>

在本章中，您將在理解擴充函式的基礎上，學習如何使用範疇函式來撰寫更符合慣用語法的程式碼。

## 範疇函式

在程式設計中，範疇是指您的變數或物件可被識別的區域。最常被提及的範疇是全域範疇和區域範疇：

*   **全域範疇** – 程式中任何地方都可存取的變數或物件。
*   **區域範疇** – 僅能在定義它的程式碼區塊或函式內存取的變數或物件。

在 Kotlin 中，也有範疇函式，允許您在物件周圍建立一個臨時範疇並執行一些程式碼。

範疇函式使您的程式碼更簡潔，因為您不必在臨時範疇內引用物件的名稱。根據不同的範疇函式，您可以透過關鍵字 `this` 引用物件，或者透過關鍵字 `it` 將其作為引數使用。

Kotlin 總共有五個範疇函式：`let`、`apply`、`run`、`also` 和 `with`。

每個範疇函式都接受一個 Lambda 表達式，並返回物件或 Lambda 表達式的結果。在本教程中，我們將解釋每個範疇函式及其使用方法。

> 您也可以觀看 Kotlin 開發者倡導者 Sebastian Aigner 關於範疇函式的演講：[Back to the Stdlib: Making the Most of Kotlin's Standard Library](https://youtu.be/DdvgvSHrN9g?feature=shared&t=1511)。
> 
{style="tip"}

### Let

當您想在程式碼中執行空值檢查並隨後對返回的物件執行進一步操作時，請使用 `let` 範疇函式。

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
*   `sendNotification()`，它有一個函式參數 `recipientAddress` 並返回一個字串。
*   `getNextAddress()`，它沒有函式參數並返回一個字串。

範例建立了一個可為空 `String` 型別的變數 `address`。但當您呼叫 `sendNotification()` 函式時，這會成為一個問題，因為此函式不預期 `address` 可能為 `null` 值。結果編譯器會報告錯誤：

```text
Type mismatch: inferred type is String? but String was expected
```

在初階教程中，您已經知道可以使用 if 條件或 [Elvis 運算子 `?:`](kotlin-tour-null-safety.md#use-elvis-operator) 來執行空值檢查。但如果您想在程式碼的後續部分使用返回的物件怎麼辦？您可以使用 if 條件**以及** else 分支來實現：

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

然而，一種更簡潔的方法是使用 `let` 範疇函式：

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
*   建立了一個名為 `confirm` 的變數。
*   對 `address` 變數使用 `let` 範疇函式的安全呼叫。
*   在 `let` 範疇函式內建立一個臨時範疇。
*   將 `sendNotification()` 函式作為 Lambda 表達式傳遞給 `let` 範疇函式。
*   透過 `it` 引用 `address` 變數，使用臨時範疇。
*   將結果賦值給 `confirm` 變數。

透過這種方法，您的程式碼可以處理 `address` 變數可能為 `null` 值的情況，並且您可以在程式碼的後續部分使用 `confirm` 變數。

### Apply

使用 `apply` 範疇函式在建立物件時（例如類別實例）就進行初始化，而不是在程式碼的後續部分。這種方法使您的程式碼更易於閱讀和管理。

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

此範例有一個 `Client` 類別，其中包含一個名為 `token` 的屬性，以及三個成員函式：`connect()`、`authenticate()` 和 `getData()`。

範例在初始化其 `token` 屬性並在 `main()` 函式中呼叫其成員函式之前，建立了一個 `Client` 類別的實例 `client`。

儘管此範例很簡潔，但在實際情況中，在您建立類別實例（及其成員函式）之後，可能需要一段時間才能配置和使用它。然而，如果您使用 `apply` 範疇函式，您可以在程式碼的同一位置建立、配置並使用類別實例上的成員函式：

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

*   建立 `client` 作為 `Client` 類別的實例。
*   在 `client` 實例上使用 `apply` 範疇函式。
*   在 `apply` 範疇函式內建立一個臨時範疇，這樣您在存取 `client` 實例的屬性或函式時就不必明確引用它。
*   將 Lambda 表達式傳遞給 `apply` 範疇函式，該表達式會更新 `token` 屬性並呼叫 `connect()` 和 `authenticate()` 函式。
*   在 `main()` 函式中呼叫 `client` 實例上的 `getData()` 成員函式。

如您所見，當您處理大量程式碼時，這種策略非常方便。

### Run

與 `apply` 類似，您可以使用 `run` 範疇函式來初始化物件，但更建議使用 `run` 在程式碼的特定時刻初始化物件**並**立即計算結果。

讓我們繼續 `apply` 函式的先前範例，但這次，您希望 `connect()` 和 `authenticate()` 函式被分組，以便它們在每個請求時都被呼叫。

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

*   建立 `client` 作為 `Client` 類別的實例。
*   在 `client` 實例上使用 `apply` 範疇函式。
*   在 `apply` 範疇函式內建立一個臨時範疇，這樣您在存取 `client` 實例的屬性或函式時就不必明確引用它。
*   將 Lambda 表達式傳遞給 `apply` 範疇函式，該表達式會更新 `token` 屬性。

`main()` 函式：

*   建立一個型別為 `String` 的 `result` 變數。
*   在 `client` 實例上使用 `run` 範疇函式。
*   在 `run` 範疇函式內建立一個臨時範疇，這樣您在存取 `client` 實例的屬性或函式時就不必明確引用它。
*   將 Lambda 表達式傳遞給 `run` 範疇函式，該表達式會呼叫 `connect()`、`authenticate()` 和 `getData()` 函式。
*   將結果賦值給 `result` 變數。

現在您可以在程式碼的後續部分使用返回的結果。

### Also

使用 `also` 範疇函式來對物件完成額外動作，然後返回該物件以便在程式碼中繼續使用它，例如撰寫日誌。

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
*   建立型別為 `List<String>` 的 `reversedLongUpperCaseMedals` 變數。
*   對 `medals` 變數使用 `.map()` 擴充函式。
*   將 Lambda 表達式傳遞給 `.map()` 函式，該表達式透過 `it` 關鍵字引用 `medals` 並在其上呼叫 `.uppercase()` 擴充函式。
*   對 `medals` 變數使用 `.filter()` 擴充函式。
*   將 Lambda 表達式作為判斷式傳遞給 `.filter()` 函式，該表達式透過 `it` 關鍵字引用 `medals` 並檢查 `medals` 變數中包含的列表長度是否超過 4 個項目。
*   對 `medals` 變數使用 `.reversed()` 擴充函式。
*   將結果賦值給 `reversedLongUpperCaseMedals` 變數。
*   印出 `reversedLongUpperCaseMedals` 變數中包含的列表。

在函式呼叫之間添加一些日誌來查看 `medals` 變數發生了什麼變化會很有用。`also` 函式有助於實現這一點：

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

現在這個範例：

*   對 `medals` 變數使用 `also` 範疇函式。
*   在 `also` 範疇函式內建立一個臨時範疇，這樣您在將 `medals` 變數作為函式參數使用時就不必明確引用它。
*   將 Lambda 表達式傳遞給 `also` 範疇函式，該表達式透過 `it` 關鍵字將 `medals` 變數作為函式參數呼叫 `println()` 函式。

由於 `also` 函式會返回物件，因此它不僅適用於日誌記錄，還適用於除錯、鏈結多個操作以及執行其他不影響程式碼主要流程的副作用操作。

### With

與其他範疇函式不同，`with` 不是擴充函式，因此其語法有所不同。您將接收者物件作為引數傳遞給 `with`。

當您想在一個物件上呼叫多個函式時，請使用 `with` 範疇函式。

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

此範例建立了一個 `Canvas` 類別，它有三個成員函式：`rect()`、`circ()` 和 `text()`。每個成員函式都會列印一個由您提供的函式參數構成的語句。

範例在呼叫該 `Canvas` 類別實例上帶有不同函式參數的一系列成員函式之前，建立了一個 `mainMonitorPrimaryBufferBackedCanvas` 作為 `Canvas` 類別的實例。

您可以看到這段程式碼難以閱讀。如果您使用 `with` 函式，程式碼會變得簡潔：

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
*   使用 `with` 範疇函式，並將 `mainMonitorSecondaryBufferBackedCanvas` 實例作為接收者物件。
*   在 `with` 範疇函式內建立一個臨時範疇，這樣您在呼叫 `mainMonitorSecondaryBufferBackedCanvas` 實例的成員函式時就不必明確引用它。
*   將 Lambda 表達式傳遞給 `with` 範疇函式，該表達式會呼叫一系列帶有不同函式參數的成員函式。

現在這段程式碼更容易閱讀，您犯錯的可能性也降低了。

## 使用情境概覽

本節介紹了 Kotlin 中可用的不同範疇函式及其主要使用情境，以使您的程式碼更符合慣用語法。您可以將此表格作為快速參考。值得注意的是，您無需完全理解這些函式的工作原理即可在程式碼中使用它們。

| 函式   | 透過 `x` 存取 | 返回值       | 使用情境                                                                           |
|--------|---------------|--------------|------------------------------------------------------------------------------------|
| `let`  | `it`          | Lambda 結果  | 執行空值檢查，並隨後對返回的物件執行進一步操作。                                   |
| `apply`| `this`        | `x`          | 在建立時初始化物件。                                                               |
| `run`  | `this`        | Lambda 結果  | 在建立時初始化物件**並**計算結果。                                                 |
| `also` | `it`          | `x`          | 在返回物件之前完成額外動作。                                                       |
| `with` | `this`        | Lambda 結果  | 在物件上呼叫多個函式。                                                             |

有關範疇函式的更多資訊，請參閱 [範疇函式](scope-functions.md)。

## 練習

### 練習 1 {initial-collapse-state="collapsed" collapsible="true" id="scope-functions-exercise-1"}

將 `.getPriceInEuros()` 函式重寫為使用安全呼叫運算子 `?.` 和 `let` 範疇函式的單一表達式函式。

<deflist collapsible="true">
    <def title="提示">
        使用安全呼叫運算子 <code>?.</code> 從 <code>getProductInfo()</code> 函式安全地存取 <code>priceInDollars</code> 屬性。然後，使用 <code>let</code> 範疇函式將 <code>priceInDollars</code> 的值轉換為歐元。
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

您有一個 `updateEmail()` 函式用於更新使用者的電子郵件地址。請使用 `apply` 範疇函式來更新電子郵件地址，然後使用 `also` 範疇函式來列印日誌訊息：`Updating email for user with ID: ${it.id}`。

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

[中階：帶有接收者的 Lambda 表達式](kotlin-tour-intermediate-lambdas-receiver.md)