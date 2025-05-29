[//]: # (title: 中級：物件)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="第一步" /> <a href="kotlin-tour-intermediate-extension-functions.md">擴充函式</a><br />
        <img src="icon-2-done.svg" width="20" alt="第二步" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函式</a><br />
        <img src="icon-3-done.svg" width="20" alt="第三步" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">帶接收者的 Lambda 運算式</a><br /> 
        <img src="icon-4-done.svg" width="20" alt="第四步" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">類別與介面</a><br /> 
        <img src="icon-5.svg" width="20" alt="第四步" /> <strong>物件</strong><br />
        <img src="icon-6-todo.svg" width="20" alt="第六步" /> <a href="kotlin-tour-intermediate-open-special-classes.md">開放類別與特殊類別</a><br />
        <img src="icon-7-todo.svg" width="20" alt="第七步" /> <a href="kotlin-tour-intermediate-properties.md">屬性</a><br />
        <img src="icon-8-todo.svg" width="20" alt="第八步" /> <a href="kotlin-tour-intermediate-null-safety.md">空值安全</a><br />
        <img src="icon-9-todo.svg" width="20" alt="第九步" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">函式庫與 API</a></p>
</tldr>

在本章中，您將透過探索物件宣告來擴展對類別的理解。這些知識將幫助您有效地管理專案中的行為。

## 物件宣告

在 Kotlin 中，您可以使用 **物件宣告 (object declarations)** 來宣告一個具有單一實例的類別。從某種意義上說，您是同時宣告類別並建立該單一實例。當您想建立一個類別作為程式的單一參考點或協調系統中的行為時，物件宣告非常有用。

> 一個只有一個實例且易於存取的類別稱為 **單例 (singleton)**。
>
{style="tip"}

Kotlin 中的物件是**惰性 (lazy)** 的，這表示它們僅在被存取時才建立。Kotlin 還確保所有物件都以執行緒安全的方式建立，因此您無需手動檢查。

要建立物件宣告，請使用 `object` 關鍵字：

```kotlin
object DoAuth {}
```

在您的 `object` 名稱之後，在大括號 `{}` 定義的物件主體中新增任何屬性或成員函式。

> 物件不能有建構函式，所以它們不像類別那樣有標頭。
>
{style="note"}

例如，假設您想建立一個名為 `DoAuth` 的物件，負責身份驗證：

```kotlin
object DoAuth {
    fun takeParams(username: String, password: String) {
        println("input Auth parameters = $username:$password")
    }
}

fun main(){
    // The object is created when the takeParams() function is called
    DoAuth.takeParams("coding_ninja", "N1njaC0ding!")
    // input Auth parameters = coding_ninja:N1njaC0ding!
}
```
{kotlin-runnable="true" id="kotlin-tour-object-declarations"}

該物件有一個名為 `takeParams` 的成員函式，它接受 `username` 和 `password` 變數作為參數，並將一個字串輸出到控制台。`DoAuth` 物件只在函式首次被呼叫時建立。

> 物件可以繼承類別和介面。例如：
> 
> ```kotlin
> interface Auth {
>     fun takeParams(username: String, password: String)
> }
>
> object DoAuth : Auth {
>     override fun takeParams(username: String, password: String) {
>         println("input Auth parameters = $username:$password")
>     }
> }
> ```
>
{style="note"}

#### 資料物件

為了更容易印出物件宣告的內容，Kotlin 提供了**資料物件 (data objects)**。與您在初學者指南中學到的資料類別類似，資料物件會自動附帶額外的成員函式：`toString()` 和 `equals()`。

> 與資料類別不同，資料物件不會自動附帶 `copy()` 成員函式，因為它們只有一個單一實例，無法被複製。
>
{type ="note"}

要建立資料物件，請使用與物件宣告相同的語法，但前面加上 `data` 關鍵字：

```kotlin
data object AppConfig {}
```

例如：

```kotlin
data object AppConfig {
    var appName: String = "My Application"
    var version: String = "1.0.0"
}

fun main() {
    println(AppConfig)
    // AppConfig
    
    println(AppConfig.appName)
    // My Application
}
```
{kotlin-runnable="true" id="kotlin-tour-data-objects"}

有關資料物件的更多資訊，請參閱 [](object-declarations.md#data-objects)。

#### 伴生物件

在 Kotlin 中，一個類別可以擁有一個物件：一個**伴生物件 (companion object)**。每個類別只能有一個伴生物件。伴生物件僅在其類別首次被參考時建立。

伴生物件內部宣告的任何屬性或函式都會在所有類別實例之間共享。

要在類別中建立伴生物件，請使用與物件宣告相同的語法，但前面加上 `companion` 關鍵字：

```kotlin
companion object Bonger {}
```

> 伴生物件不一定要有名稱。如果您沒有定義名稱，預設為 `Companion`。
> 
{style="note"}

要存取伴生物件的任何屬性或函式，請參考類別名稱。例如：

```kotlin
class BigBen {
    companion object Bonger {
        fun getBongs(nTimes: Int) {
            repeat(nTimes) { print("BONG ") }
            }
        }
    }

fun main() {
    // Companion object is created when the class is referenced for the
    // first time.
    BigBen.getBongs(12)
    // BONG BONG BONG BONG BONG BONG BONG BONG BONG BONG BONG BONG 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-companion-object"}

此範例建立了一個名為 `BigBen` 的類別，其中包含一個名為 `Bonger` 的伴生物件。該伴生物件有一個名為 `getBongs()` 的成員函式，它接受一個整數，並將 `"BONG"` 印到控制台與該整數相同次數。

在 `main()` 函式中，`getBongs()` 函式透過參考類別名稱被呼叫。伴生物件在此時建立。`getBongs()` 函式以參數 `12` 呼叫。

有關更多資訊，請參閱 [](object-declarations.md#companion-objects)。

## 練習

### 練習 1 {initial-collapse-state="collapsed" collapsible="true" id="objects-exercise-1"}

您經營一家咖啡店，並有一個追蹤顧客訂單的系統。參考以下程式碼，完成第二個資料物件的宣告，以便 `main()` 函式中的以下程式碼能成功執行：

|---|---|

```kotlin
interface Order {
    val orderId: String
    val customerName: String
    val orderTotal: Double
}

data object OrderOne: Order {
    override val orderId = "001"
    override val customerName = "Alice"
    override val orderTotal = 15.50
}

data object // Write your code here

fun main() {
    // Print the name of each data object
    println("Order name: $OrderOne")
    // Order name: OrderOne
    println("Order name: $OrderTwo")
    // Order name: OrderTwo

    // Check if the orders are identical
    println("Are the two orders identical? ${OrderOne == OrderTwo}")
    // Are the two orders identical? false

    if (OrderOne == OrderTwo) {
        println("The orders are identical.")
    } else {
        println("The orders are unique.")
        // The orders are unique.
    }

    println("Do the orders have the same customer name? ${OrderOne.customerName == OrderTwo.customerName}")
    // Do the orders have the same customer name? false
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-objects-exercise-1"}

|---|---|
```kotlin
interface Order {
    val orderId: String
    val customerName: String
    val orderTotal: Double
}

data object OrderOne: Order {
    override val orderId = "001"
    override val customerName = "Alice"
    override val orderTotal = 15.50
}

data object OrderTwo: Order {
    override val orderId = "002"
    override val customerName = "Bob"
    override val orderTotal = 12.75
}

fun main() {
    // Print the name of each data object
    println("Order name: $OrderOne")
    // Order name: OrderOne
    println("Order name: $OrderTwo")
    // Order name: OrderTwo

    // Check if the orders are identical
    println("Are the two orders identical? ${OrderOne == OrderTwo}")
    // Are the two orders identical? false

    if (OrderOne == OrderTwo) {
        println("The orders are identical.")
    } else {
        println("The orders are unique.")
        // The orders are unique.
    }

    println("Do the orders have the same customer name? ${OrderOne.customerName == OrderTwo.customerName}")
    // Do the orders have the same customer name? false
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-objects-solution-1"}

### 練習 2 {initial-collapse-state="collapsed" collapsible="true" id="objects-exercise-2"}

建立一個繼承自 `Vehicle` 介面的物件宣告，以建立獨特的車輛類型：`FlyingSkateboard`。在您的物件中實作 `name` 屬性與 `move()` 函式，以便 `main()` 函式中的以下程式碼能成功執行：

|---|---|

```kotlin
interface Vehicle {
    val name: String
    fun move(): String
}

object // Write your code here

fun main() {
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.move()}")
    // Flying Skateboard: Glides through the air with a hover engine
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.fly()}")
    // Flying Skateboard: Woooooooo
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-objects-exercise-2"}

|---|---|
```kotlin
interface Vehicle {
    val name: String
    fun move(): String
}

object FlyingSkateboard : Vehicle {
    override val name = "Flying Skateboard"
    override fun move() = "Glides through the air with a hover engine"

   fun fly(): String = "Woooooooo"
}

fun main() {
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.move()}")
    // Flying Skateboard: Glides through the air with a hover engine
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.fly()}")
    // Flying Skateboard: Woooooooo
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-objects-solution-2"}

### 練習 3 {initial-collapse-state="collapsed" collapsible="true" id="objects-exercise-3"}

您有一個應用程式，想要記錄溫度。類別本身以攝氏度儲存資訊，但您也想提供一種輕鬆建立華氏實例的方法。完成資料類別，以便 `main()` 函式中的以下程式碼能成功執行：

<deflist collapsible="true">
    <def title="提示">
        使用伴生物件。
    </def>
</deflist>

|---|---|
```kotlin
data class Temperature(val celsius: Double) {
    val fahrenheit: Double = celsius * 9 / 5 + 32

    // Write your code here
}

fun main() {
    val fahrenheit = 90.0
    val temp = Temperature.fromFahrenheit(fahrenheit)
    println("${temp.celsius}°C is $fahrenheit °F")
    // 32.22222222222222°C is 90.0 °F
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-objects-exercise-3"}

|---|---|
```kotlin
data class Temperature(val celsius: Double) {
    val fahrenheit: Double = celsius * 9 / 5 + 32

    companion object {
        fun fromFahrenheit(fahrenheit: Double): Temperature = Temperature((fahrenheit - 32) * 5 / 9)
    }
}

fun main() {
    val fahrenheit = 90.0
    val temp = Temperature.fromFahrenheit(fahrenheit)
    println("${temp.celsius}°C is $fahrenheit °F")
    // 32.22222222222222°C is 90.0 °F
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-objects-solution-3"}

## 下一步

[中級：開放類別與特殊類別](kotlin-tour-intermediate-open-special-classes.md)