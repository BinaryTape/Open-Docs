[//]: # (title: 中階：類別與介面)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="第一步" /> <a href="kotlin-tour-intermediate-extension-functions.md">擴充函式</a><br />
        <img src="icon-2-done.svg" width="20" alt="第二步" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函式</a><br />
        <img src="icon-3-done.svg" width="20" alt="第三步" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">帶接收者的 Lambda 表達式</a><br /> 
        <img src="icon-4.svg" width="20" alt="第四步" /> <strong>類別與介面</strong><br />
        <img src="icon-5-todo.svg" width="20" alt="第五步" /> <a href="kotlin-tour-intermediate-objects.md">物件</a><br />
        <img src="icon-6-todo.svg" width="20" alt="第六步" /> <a href="kotlin-tour-intermediate-open-special-classes.md">開放與特殊類別</a><br />
        <img src="icon-7-todo.svg" width="20" alt="第七步" /> <a href="kotlin-tour-intermediate-properties.md">屬性</a><br />
        <img src="icon-8-todo.svg" width="20" alt="第八步" /> <a href="kotlin-tour-intermediate-null-safety.md">空值安全</a><br />
        <img src="icon-9-todo.svg" width="20" alt="第九步" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">函式庫與 API</a></p>
</tldr>

在初階教學中，您學習了如何使用類別 (classes) 和資料類別 (data classes) 來儲存資料並維護一組可以在程式碼中共享的特性。最終，您會希望建立一個階層 (hierarchy) 來有效地在專案中共享程式碼。本章將解釋 Kotlin 提供的程式碼共享選項，以及它們如何使您的程式碼更安全、更易於維護。

## 類別繼承

在上一章中，我們介紹了如何使用擴充函式 (extension functions) 來擴充類別而無需修改原始碼。但是，如果您正在處理一個複雜的專案，其中在類別**之間**共享程式碼會很有用，該怎麼辦？在這種情況下，您可以使用類別繼承 (class inheritance)。

依預設，Kotlin 中的類別無法被繼承。Kotlin 的設計目的在於防止意外繼承，並使您的類別更易於維護。

Kotlin 類別僅支援**單一繼承** (single inheritance)，這表示一次只能從**一個類別**繼承。這個類別被稱為**父類別** (parent)。

類別的父類別繼承自另一個類別（祖父類別），從而形成一個階層。在 Kotlin 類別階層的頂端是共同的父類別：`Any`。所有類別最終都繼承自 `Any` 類別：

![一個帶有 Any 類型的類別階層範例](any-type-class.png){width="200"}

`Any` 類別會自動提供 `toString()` 函式作為成員函式 (member function)。因此，您可以在任何類別中使用這個繼承的函式。例如：

```kotlin
class Car(val make: String, val model: String, val numberOfDoors: Int)

fun main() {
    //sampleStart
    val car1 = Car("Toyota", "Corolla", 4)

    // 使用 .toString() 函式透過字串範本 (string templates) 列印類別屬性
    println("Car1: make=${car1.make}, model=${car1.model}, numberOfDoors=${car1.numberOfDoors}")
    // Car1: make=Toyota, model=Corolla, numberOfDoors=4
    //sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-any-class"}

如果您想使用繼承來在類別之間共享程式碼，請首先考慮使用抽象類別 (abstract classes)。

### 抽象類別

抽象類別預設可以被繼承。抽象類別的目的是提供其他類別繼承或實作 (implement) 的成員。因此，它們有建構式 (constructor)，但您無法從中建立實例 (instances)。在子類別中，您可以使用 `override` 關鍵字來定義父類別屬性和函式的行為。這樣一來，可以說子類別「覆寫」了父類別的成員。

> 當您定義繼承函式或屬性的行為時，我們稱之為**實作**。
> 
{style="tip"}

抽象類別可以包含**帶有**實作的函式和屬性，也可以包含**沒有**實作的函式和屬性，這些沒有實作的函式和屬性稱為抽象函式和屬性。

要建立抽象類別，請使用 `abstract` 關鍵字：

```kotlin
abstract class Animal
```

要宣告**沒有**實作的函式或屬性，您也使用 `abstract` 關鍵字：

```kotlin
abstract fun makeSound()
abstract val sound: String
```

例如，假設您想建立一個名為 `Product` 的抽象類別，您可以從中建立子類別來定義不同的產品類別：

```kotlin
abstract class Product(val name: String, var price: Double) {
    // 用於產品類別的抽象屬性
    abstract val category: String

    // 可供所有產品共享的函式
    fun productInfo(): String {
        return "Product: $name, Category: $category, Price: $price"
    }
}
```

在這個抽象類別中：

*   建構式有兩個參數，分別用於產品的 `name` 和 `price`。
*   有一個抽象屬性，其中包含產品類別的字串。
*   有一個函式可以列印產品的資訊。

現在，我們來為電子產品建立一個子類別。在子類別中定義 `category` 屬性的實作之前，您必須使用 `override` 關鍵字：

```kotlin
class Electronic(name: String, price: Double, val warranty: Int) : Product(name, price) {
    override val category = "Electronic"
}
```

`Electronic` 類別：

*   繼承自 `Product` 抽象類別。
*   建構式中有一個額外的參數：`warranty`，它專屬於電子產品。
*   覆寫了 `category` 屬性，使其包含字串 `"Electronic"`。

現在，您可以這樣使用這些類別：

```kotlin
abstract class Product(val name: String, var price: Double) {
    // 用於產品類別的抽象屬性
    abstract val category: String

    // 可供所有產品共享的函式
    fun productInfo(): String {
        return "Product: $name, Category: $category, Price: $price"
    }
}

class Electronic(name: String, price: Double, val warranty: Int) : Product(name, price) {
    override val category = "Electronic"
}

//sampleStart
fun main() {
    // 建立 Electronic 類別的實例
    val laptop = Electronic(name = "Laptop", price = 1000.0, warranty = 2)

    println(laptop.productInfo())
    // Product: Laptop, Category: Electronic, Price: 1000.0
}
//sampleEnd
```
{kotlin-runnable="true" id="kotlin-tour-abstract-class"}

雖然抽象類別以這種方式共享程式碼非常有用，但它們受到限制，因為 Kotlin 中的類別只支援單一繼承。如果您需要從多個來源繼承，請考慮使用介面 (interfaces)。

## 介面

介面與類別相似，但它們有一些差異：

*   您無法建立介面的實例。它們沒有建構式或標頭。
*   它們的函式和屬性預設是隱含地可繼承的。在 Kotlin 中，我們說它們是「開放的」。
*   如果函式沒有實作，您無需將其標記為 `abstract`。

與抽象類別類似，您使用介面來定義一組函式和屬性，供類別稍後繼承和實作。這種方法有助於您專注於介面所描述的抽象化，而不是具體的實作細節。使用介面使您的程式碼：

*   更模組化，因為它隔離了不同的部分，允許它們獨立演進。
*   更容易理解，透過將相關函式分組為一個內聚的集合。
*   更容易測試，因為您可以快速將實作替換為模擬物件 (mock) 進行測試。

要宣告介面，請使用 `interface` 關鍵字：

```kotlin
interface PaymentMethod
```

### 介面實作

介面支援多重繼承 (multiple inheritance)，因此一個類別可以同時實作多個介面。首先，我們考慮類別實作**一個**介面的情境。

要建立實作介面的類別，請在類別標頭後加上冒號，然後加上您要實作的介面名稱。您無需在介面名稱後使用圓括號 `()`，因為介面沒有建構式：

```kotlin
class CreditCardPayment : PaymentMethod
```

例如：

```kotlin
interface PaymentMethod {
    // 函式預設是可繼承的
    fun initiatePayment(amount: Double): String
}

class CreditCardPayment(val cardNumber: String, val cardHolderName: String, val expiryDate: String) : PaymentMethod {
    override fun initiatePayment(amount: Double): String {
        // 模擬使用信用卡處理付款
        return "Payment of $amount initiated using Credit Card ending in ${cardNumber.takeLast(4)}."
    }
}

fun main() {
    val paymentMethod = CreditCardPayment("1234 5678 9012 3456", "John Doe", "12/25")
    println(paymentMethod.initiatePayment(100.0))
    // Payment of $100.0 initiated using Credit Card ending in 3456.
}
```
{kotlin-runnable="true" id="kotlin-tour-interface-inheritance"}

在這個範例中：

*   `PaymentMethod` 是一個介面，它有一個沒有實作的 `initiatePayment()` 函式。
*   `CreditCardPayment` 是一個實作 `PaymentMethod` 介面的類別。
*   `CreditCardPayment` 類別覆寫了繼承的 `initiatePayment()` 函式。
*   `paymentMethod` 是 `CreditCardPayment` 類別的實例。
*   在 `paymentMethod` 實例上呼叫了帶有 `100.0` 參數的覆寫 `initiatePayment()` 函式。

要建立實作**多個**介面的類別，請在類別標頭後加上冒號，然後加上您要實作的介面名稱，並用逗號分隔：

```kotlin
class CreditCardPayment : PaymentMethod, PaymentType
```

例如：

```kotlin
interface PaymentMethod {
    fun initiatePayment(amount: Double): String
}

interface PaymentType {
    val paymentType: String
}

class CreditCardPayment(val cardNumber: String, val cardHolderName: String, val expiryDate: String) : PaymentMethod,
    PaymentType {
    override fun initiatePayment(amount: Double): String {
        // 模擬使用信用卡處理付款
        return "Payment of $amount initiated using Credit Card ending in ${cardNumber.takeLast(4)}."
    }

    override val paymentType: String = "Credit Card"
}

fun main() {
    val paymentMethod = CreditCardPayment("1234 5678 9012 3456", "John Doe", "12/25")
    println(paymentMethod.initiatePayment(100.0))
    // Payment of $100.0 initiated using Credit Card ending in 3456.

    println("Payment is by ${paymentMethod.paymentType}")
    // Payment is by Credit Card
}
```
{kotlin-runnable="true" id="kotlin-tour-interface-multiple-inheritance"}

在這個範例中：

*   `PaymentMethod` 是一個介面，它有一個沒有實作的 `initiatePayment()` 函式。
*   `PaymentType` 是一個介面，它有一個未初始化的 `paymentType` 屬性。
*   `CreditCardPayment` 是一個實作 `PaymentMethod` 和 `PaymentType` 介面的類別。
*   `CreditCardPayment` 類別覆寫了繼承的 `initiatePayment()` 函式和 `paymentType` 屬性。
*   `paymentMethod` 是 `CreditCardPayment` 類別的實例。
*   在 `paymentMethod` 實例上呼叫了帶有 `100.0` 參數的覆寫 `initiatePayment()` 函式。
*   在 `paymentMethod` 實例上存取了覆寫的 `paymentType` 屬性。

有關介面和介面繼承的更多資訊，請參閱 [介面](interfaces.md)。

## 委託

介面很有用，但如果您的介面包含許多函式，子類別最終可能會產生大量樣板程式碼 (boilerplate code)。當您只想覆寫父類別行為的一小部分時，您需要重複寫很多內容。

> 樣板程式碼 (boilerplate code) 是指在軟體專案的多個部分中重複使用且幾乎沒有變動的程式碼片段。
> 
{style="tip"}

例如，假設您有一個名為 `Drawable` 的介面，它包含許多函式和一個名為 `color` 的屬性：

```kotlin
interface Drawable {
    fun draw()
    fun resize()
    val color: String?
}
```

您建立了一個名為 `Circle` 的類別，它實作了 `Drawable` 介面並為其所有成員提供了實作：

```kotlin
class Circle : Drawable {
    override fun draw() {
        TODO("An example implementation")
    }
    
    override fun resize() {
        TODO("An example implementation")
    }
   override val color = null
}
```

如果您想建立一個 `Circle` 類別的子類別，其行為除了 `color` 屬性的值外都相同，您仍然需要為 `Circle` 類別的每個成員函式新增實作：

```kotlin
class RedCircle(val circle: Circle) : Circle {

    // 樣板程式碼的開始
    override fun draw() {
        circle.draw()
    }

    override fun resize() {
        circle.resize()
    }

    // 樣板程式碼的結束
    override val color = "red"
}
```

您可以看到，如果 `Drawable` 介面中有大量成員函式，`RedCircle` 類別中的樣板程式碼量可能會非常大。然而，還有另一種選擇。

在 Kotlin 中，您可以使用委託 (delegation) 將介面實作委託給類別的實例。例如，您可以建立 `Circle` 類別的實例，並將 `Circle` 類別成員函式的實作委託給這個實例。為此，請使用 `by` 關鍵字。例如：

```kotlin
class RedCircle(param: Circle) : Drawable by param
```

這裡，`param` 是 `Circle` 類別實例的名稱，成員函式的實作被委託給它。

現在您無需在 `RedCircle` 類別中為成員函式新增實作。編譯器會自動為您從 `Circle` 類別執行此操作。這可以讓您省去編寫大量樣板程式碼。相反，您只需新增程式碼來變更子類別所需的行為。

例如，如果您想變更 `color` 屬性的值：

```kotlin
class RedCircle(param : Circle) : Drawable by param {
    // 沒有樣板程式碼！
    override val color = "red"
}
```

如果您願意，您也可以在 `RedCircle` 類別中覆寫繼承成員函式的行為，但現在您無需為每個繼承的成員函式新增新的程式碼行。

更多資訊請參閱 [委託](delegation.md)。

## 練習

### 練習 1 {initial-collapse-state="collapsed" collapsible="true" id="classes-interfaces-exercise-1"}

想像一下您正在開發一個智慧家庭系統。智慧家庭通常有不同類型的裝置，它們都具有一些基本功能，但也擁有獨特的行為。在下面的程式碼範例中，完成名為 `SmartDevice` 的 `abstract` 類別，以便子類別 `SmartLight` 可以成功編譯。

然後，建立另一個名為 `SmartThermostat` 的子類別，它繼承自 `SmartDevice` 類別並實作 `turnOn()` 和 `turnOff()` 函式，這些函式返回描述哪個恆溫器正在加熱或已關閉的列印語句。最後，新增另一個名為 `adjustTemperature()` 的函式，它接受一個溫度測量作為輸入並列印：`$name thermostat set to $temperature°C.`

<deflist collapsible="true">
    <def title="提示">
        在 <code>SmartDevice</code> 類別中，新增 <code>turnOn()</code> 和 <code>turnOff()</code> 函式，以便您稍後可以在 <code>SmartThermostat</code> 類別中覆寫它們的行為。
    </def>
</deflist>

|--|--|

```kotlin
abstract class // Write your code here

class SmartLight(name: String) : SmartDevice(name) {
    override fun turnOn() {
        println("$name is now ON.")
    }

    override fun turnOff() {
        println("$name is now OFF.")
    }

   fun adjustBrightness(level: Int) {
        println("Adjusting $name brightness to $level%.")
    }
}

class SmartThermostat // Write your code here

fun main() {
    val livingRoomLight = SmartLight("Living Room Light")
    val bedroomThermostat = SmartThermostat("Bedroom Thermostat")
    
    livingRoomLight.turnOn()
    // Living Room Light is now ON.
    livingRoomLight.adjustBrightness(10)
    // Adjusting Living Room Light brightness to 10%.
    livingRoomLight.turnOff()
    // Living Room Light is now OFF.

    bedroomThermostat.turnOn()
    // Bedroom Thermostat thermostat is now heating.
    bedroomThermostat.adjustTemperature(5)
    // Bedroom Thermostat thermostat set to 5°C.
    bedroomThermostat.turnOff()
    // Bedroom Thermostat thermostat is now off.
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-interfaces-exercise-1"}

|---|---|
```kotlin
abstract class SmartDevice(val name: String) {
    abstract fun turnOn()
    abstract fun turnOff()
}

class SmartLight(name: String) : SmartDevice(name) {
    override fun turnOn() {
        println("$name is now ON.")
    }

    override fun turnOff() {
        println("$name is now OFF.")
    }

   fun adjustBrightness(level: Int) {
        println("Adjusting $name brightness to $level%.")
    }
}

class SmartThermostat(name: String) : SmartDevice(name) {
    override fun turnOn() {
        println("$name thermostat is now heating.")
    }

    override fun turnOff() {
        println("$name thermostat is now off.")
    }

   fun adjustTemperature(temperature: Int) {
        println("$name thermostat set to $temperature°C.")
    }
}

fun main() {
    val livingRoomLight = SmartLight("Living Room Light")
    val bedroomThermostat = SmartThermostat("Bedroom Thermostat")
    
    livingRoomLight.turnOn()
    // Living Room Light is now ON.
    livingRoomLight.adjustBrightness(10)
    // Adjusting Living Room Light brightness to 10%.
    livingRoomLight.turnOff()
    // Living Room Light is now OFF.

    bedroomThermostat.turnOn()
    // Bedroom Thermostat thermostat is now heating.
    bedroomThermostat.adjustTemperature(5)
    // Bedroom Thermostat thermostat set to 5°C.
    bedroomThermostat.turnOff()
    // Bedroom Thermostat thermostat is now off.
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-classes-interfaces-solution-1"}

### 練習 2 {initial-collapse-state="collapsed" collapsible="true" id="classes-interfaces-exercise-2"}

建立一個名為 `Media` 的介面，您可以使用它來實作特定的媒體類別，如 `Audio`、`Video` 或 `Podcast`。您的介面必須包含：

*   一個名為 `title` 的屬性，用於表示媒體的標題。
*   一個名為 `play()` 的函式，用於播放媒體。

然後，建立一個名為 `Audio` 的類別，它實作 `Media` 介面。`Audio` 類別必須在其建構式中使用 `title` 屬性，並且還有一個額外的 `composer` 屬性，類型為 `String`。在類別中，實作 `play()` 函式以列印以下內容：`"Playing audio: $title, composed by $composer"`。

<deflist collapsible="true">
    <def title="提示">
        您可以在類別標頭中使用 <code>override</code> 關鍵字在建構式中實作介面中的屬性。
    </def>
</deflist>

|---|---|
```kotlin
interface // Write your code here

class // Write your code here

fun main() {
    val audio = Audio("Symphony No. 5", "Beethoven")
    audio.play()
   // Playing audio: Symphony No. 5, composed by Beethoven
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-interfaces-exercise-2"}

|---|---|
```kotlin
interface Media {
    val title: String
    fun play()
}

class Audio(override val title: String, val composer: String) : Media {
    override fun play() {
        println("Playing audio: $title, composed by $composer")
    }
}

fun main() {
    val audio = Audio("Symphony No. 5", "Beethoven")
    audio.play()
   // Playing audio: Symphony No. 5, composed by Beethoven
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-classes-interfaces-solution-2"}

### 練習 3 {initial-collapse-state="collapsed" collapsible="true" id="classes-interfaces-exercise-3"}

您正在為電子商務應用程式建構一個支付處理系統。每個支付方法都需要能夠授權付款並處理交易。有些付款還需要能夠處理退款。

1.  在 `Refundable` 介面中，新增一個名為 `refund()` 的函式來處理退款。

2.  在 `PaymentMethod` 抽象類別中：
    *   新增一個名為 `authorize()` 的函式，它接受一個金額並列印包含該金額的訊息。
    *   新增一個名為 `processPayment()` 的抽象函式，它也接受一個金額。

3.  建立一個名為 `CreditCard` 的類別，它實作 `Refundable` 介面和 `PaymentMethod` 抽象類別。在此類別中，為 `refund()` 和 `processPayment()` 函式新增實作，使其列印以下語句：
    *   `"Refunding $amount to the credit card."`
    *   `"Processing credit card payment of $amount."`

|---|---|
```kotlin
interface Refundable {
    // Write your code here
}

abstract class PaymentMethod(val name: String) {
    // Write your code here
}

class CreditCard // Write your code here

fun main() {
    val visa = CreditCard("Visa")
    
    visa.authorize(100.0)
    // Authorizing payment of $100.0.
    visa.processPayment(100.0)
    // Processing credit card payment of $100.0.
    visa.refund(50.0)
    // Refunding $50.0 to the credit card.
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-interfaces-exercise-3"}

|---|---|
```kotlin
interface Refundable {
    fun refund(amount: Double)
}

abstract class PaymentMethod(val name: String) {
    fun authorize(amount: Double) {
        println("Authorizing payment of $amount.")
    }

    abstract fun processPayment(amount: Double)
}

class CreditCard(name: String) : PaymentMethod(name), Refundable {
    override fun processPayment(amount: Double) {
        println("Processing credit card payment of $amount.")
    }

    override fun refund(amount: Double) {
        println("Refunding $amount to the credit card.")
    }
}

fun main() {
    val visa = CreditCard("Visa")
    
    visa.authorize(100.0)
    // Authorizing payment of $100.0.
    visa.processPayment(100.0)
    // Processing credit card payment of $100.0.
    visa.refund(50.0)
    // Refunding $50.0 to the credit card.
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-classes-interfaces-solution-3"}

### 練習 4 {initial-collapse-state="collapsed" collapsible="true" id="classes-interfaces-exercise-4"}

您有一個簡單的訊息應用程式，它有一些基本功能，但您希望在不大量重複程式碼的情況下增加一些智慧訊息的功能。

在下面的程式碼中，定義一個名為 `SmartMessenger` 的類別，它繼承自 `Messenger` 介面，但將實作委託給 `BasicMessenger` 類別的實例。

在 `SmartMessenger` 類別中，覆寫 `sendMessage()` 函式以傳送智慧訊息。該函式必須接受一個 `message` 作為輸入並返回一個列印語句：`"Sending a smart message: $message"`。此外，呼叫 `BasicMessenger` 類別的 `sendMessage()` 函式並在訊息前加上 `[smart]` 字首。

> 您無需在 `SmartMessenger` 類別中重新編寫 `receiveMessage()` 函式。
> 
{style="note"}

|--|--|

```kotlin
interface Messenger {
    fun sendMessage(message: String)
    fun receiveMessage(): String
}

class BasicMessenger : Messenger {
    override fun sendMessage(message: String) {
        println("Sending message: $message")
    }

    override fun receiveMessage(): String {
        return "You've got a new message!"
    }
}

class SmartMessenger // Write your code here

fun main() {
    val basicMessenger = BasicMessenger()
    val smartMessenger = SmartMessenger(basicMessenger)
    
    basicMessenger.sendMessage("Hello!")
    // Sending message: Hello!
    println(smartMessenger.receiveMessage())
    // You've got a new message!
    smartMessenger.sendMessage("Hello from SmartMessenger!")
    // Sending a smart message: Hello from SmartMessenger!
    // Sending message: [smart] Hello from SmartMessenger!
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-interfaces-exercise-4"}

|---|---|
```kotlin
interface Messenger {
    fun sendMessage(message: String)
    fun receiveMessage(): String
}

class BasicMessenger : Messenger {
    override fun sendMessage(message: String) {
        println("Sending message: $message")
    }

    override fun receiveMessage(): String {
        return "You've got a new message!"
    }
}

class SmartMessenger(val basicMessenger: BasicMessenger) : Messenger by basicMessenger {
    override fun sendMessage(message: String) {
        println("Sending a smart message: $message")
        basicMessenger.sendMessage("[smart] $message")
    }
}

fun main() {
    val basicMessenger = BasicMessenger()
    val smartMessenger = SmartMessenger(basicMessenger)
    
    basicMessenger.sendMessage("Hello!")
    // Sending message: Hello!
    println(smartMessenger.receiveMessage())
    // You've got a new message!
    smartMessenger.sendMessage("Hello from SmartMessenger!")
    // Sending a smart message: Hello from SmartMessenger!
    // Sending message: [smart] Hello from SmartMessenger!
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-classes-interfaces-solution-4"}

## 下一步

[中階：物件](kotlin-tour-intermediate-objects.md)