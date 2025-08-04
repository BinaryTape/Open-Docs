[//]: # (title: 中級：開放類別與特殊類別)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">擴展函式</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函式</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">帶接收者的 Lambda 表達式</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">類別與介面</a><br />
        <img src="icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">物件</a><br />
        <img src="icon-6.svg" width="20" alt="Fourth step" /> <strong>開放類別與特殊類別</strong><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">屬性</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">空值安全性</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">函式庫與 API</a></p>
</tldr>

在本章中，您將學習開放類別、它們如何與介面協同運作，以及 Kotlin 中可用的其他特殊類別類型。

## 開放類別

如果您不能使用介面或抽象類別，可以透過將類別宣告為 **open** 來明確使其可繼承。
為此，請在類別宣告前使用 `open` 關鍵字：

```kotlin
open class Vehicle(val make: String, val model: String)
```

若要建立繼承自另一個類別的類別，請在您的類別標頭後加上冒號，然後呼叫您要繼承的父類別的建構函式。在此範例中，`Car` 類別繼承自 `Vehicle` 類別：

```kotlin
open class Vehicle(val make: String, val model: String)

class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model)

fun main() {
    // 建立 Car 類別的實例
    val car = Car("Toyota", "Corolla", 4)

    // 列印汽車的詳細資訊
    println("Car Info: Make - ${car.make}, Model - ${car.model}, Number of doors - ${car.numberOfDoors}")
    // Car Info: Make - Toyota, Model - Corolla, Number of doors - 4
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-open-class"}

就像建立一般類別實例一樣，如果您的類別繼承自父類別，則它必須初始化在父類別標頭中宣告的所有參數。因此在範例中，`Car` 類別的 `car` 實例會初始化父類別參數：`make` 和 `model`。

### 覆寫繼承行為

如果您想繼承一個類別但更改其某些行為，您可以覆寫繼承的行為。

預設情況下，無法覆寫父類別的成員函式或屬性。就像抽象類別一樣，您需要添加特殊的關鍵字。

#### 成員函式

若要允許父類別中的函式被覆寫，請在父類別中該函式的宣告前使用 `open` 關鍵字：

```kotlin
open fun displayInfo() {}
```
{validate="false"}

若要覆寫繼承的成員函式，請在子類別中該函式宣告前使用 `override` 關鍵字：

```kotlin
override fun displayInfo() {}
```
{validate="false"}

例如：

```kotlin
open class Vehicle(val make: String, val model: String) {
    open fun displayInfo() {
        println("Vehicle Info: Make - $make, Model - $model")
    }
}

class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model) {
    override fun displayInfo() {
        println("Car Info: Make - $make, Model - $model, Number of Doors - $numberOfDoors")
    }
}

fun main() {
    val car1 = Car("Toyota", "Corolla", 4)
    val car2 = Car("Honda", "Civic", 2)

    // 使用覆寫的 displayInfo() 函式
    car1.displayInfo()
    // Car Info: Make - Toyota, Model - Corolla, Number of Doors - 4
    car2.displayInfo()
    // Car Info: Make - Honda, Model - Civic, Number of Doors - 2
}
```
{kotlin-runnable="true" id="kotlin-tour-class-override-function"}

此範例：

* 建立 `Car` 類別的兩個實例 `car1` 和 `car2`，它們繼承自 `Vehicle` 類別。
* 覆寫 `Car` 類別中的 `displayInfo()` 函式，使其也列印門的數量。
* 在 `car1` 和 `car2` 實例上呼叫覆寫的 `displayInfo()` 函式。

#### 屬性

在 Kotlin 中，不常使用 `open` 關鍵字使屬性可繼承，並在之後覆寫它。大多數情況下，您會使用抽象類別或介面，其中屬性預設是可繼承的。

開放類別內的屬性可由其子類別存取。通常，最好直接存取它們，而不是用新屬性覆寫它們。

例如，假設您有一個名為 `transmissionType` 的屬性，您希望稍後覆寫它。覆寫屬性的語法與覆寫成員函式的語法完全相同。您可以這樣做：

```kotlin
open class Vehicle(val make: String, val model: String) {
    open val transmissionType: String = "Manual"
}

class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model) {
    override val transmissionType: String = "Automatic"
}
```

然而，這不是一個好的實踐。相反地，您可以將屬性新增到可繼承類別的建構函式中，並在建立 `Car` 子類別時宣告其值：

```kotlin
open class Vehicle(val make: String, val model: String, val transmissionType: String = "Manual")

class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model, "Automatic")
```

直接存取屬性，而非覆寫它們，會使程式碼更簡潔易讀。透過在父類別中宣告一次屬性並透過建構函式傳遞其值，您可以消除子類別中不必要的覆寫。

有關類別繼承和覆寫類別行為的更多資訊，請參閱 [繼承](inheritance.md)。

### 開放類別與介面

您可以建立一個繼承類別**並**實作多個介面的類別。在這種情況下，您必須在冒號後首先宣告父類別，然後才列出介面：

```kotlin
// 定義介面
interface EcoFriendly {
    val emissionLevel: String
}

interface ElectricVehicle {
    val batteryCapacity: Double
}

// 父類別
open class Vehicle(val make: String, val model: String)

// 子類別
open class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model)

// 繼承自 Car 並實作兩個介面的新類別
class ElectricCar(
    make: String,
    model: String,
    numberOfDoors: Int,
    val capacity: Double,
    val emission: String
) : Car(make, model, numberOfDoors), EcoFriendly, ElectricVehicle {
    override val batteryCapacity: Double = capacity
    override val emissionLevel: String = emission
}
```

## 特殊類別

除了抽象類別、開放類別和資料類別之外，Kotlin 還具有為各種目的設計的特殊類別類型，例如限制特定行為或減少建立小型物件的效能影響。

### 密封類別

有時您可能希望限制繼承。您可以使用密封類別來實現這一點。密封類別是一種特殊類型的[抽象類別](kotlin-tour-intermediate-classes-interfaces.md#abstract-classes)。一旦您宣告一個類別是密封的，您只能在同一個套件內從它建立子類別。在此範圍之外無法繼承密封類別。

> 套件是相關類別和函式的程式碼集合，通常位於目錄中。要了解更多關於 Kotlin 中的套件，請參閱 [套件與匯入](packages.md)。
> 
{style="tip"}

若要建立密封類別，請使用 `sealed` 關鍵字：

```kotlin
sealed class Mammal
```

密封類別與 `when` 表達式結合使用時特別有用。透過使用 `when` 表達式，您可以定義所有可能的子類別的行為。例如：

```kotlin
sealed class Mammal(val name: String)

class Cat(val catName: String) : Mammal(catName)
class Human(val humanName: String, val job: String) : Mammal(humanName)

fun greetMammal(mammal: Mammal): String {
    when (mammal) {
        is Human -> return "Hello ${mammal.name}; You're working as a ${mammal.job}"
        is Cat -> return "Hello ${mammal.name}"   
    }
}

fun main() {
    println(greetMammal(Cat("Snowy")))
    // Hello Snowy
}
```
{kotlin-runnable="true" id="kotlin-tour-sealed-classes"}

在此範例中：

* 有一個名為 `Mammal` 的密封類別，其建構函式中帶有 `name` 參數。
* `Cat` 類別繼承自 `Mammal` 密封類別，並使用 `Mammal` 類別的 `name` 參數作為其自身建構函式中的 `catName` 參數。
* `Human` 類別繼承自 `Mammal` 密封類別，並使用 `Mammal` 類別的 `name` 參數作為其自身建構函式中的 `humanName` 參數。它在建構函式中也有 `job` 參數。
* `greetMammal()` 函式接受 `Mammal` 類型的引數並回傳一個字串。
* 在 `greetMammal()` 函式主體中，有一個 `when` 表達式，它使用 [`is` 運算子](typecasts.md#is-and-is-operators) 來檢查 `mammal` 的類型並決定要執行的動作。
* `main()` 函式以 `Cat` 類別的實例和名為 `Snowy` 的 `name` 參數呼叫 `greetMammal()` 函式。

> 本導覽在 [空值安全性](kotlin-tour-intermediate-null-safety.md) 章節中更詳細地討論了 `is` 運算子。
> 
{style ="tip"}

有關密封類別及其推薦使用案例的更多資訊，請參閱 [密封類別與介面](sealed-classes.md)。

### 列舉類別

當您想在類別中表示有限的、不同的值集合時，列舉類別非常有用。列舉類別包含列舉常數，這些常數本身就是列舉類別的實例。

若要建立列舉類別，請使用 `enum` 關鍵字：

```kotlin
enum class State
```

假設您想建立一個包含程序不同狀態的列舉類別。每個列舉常數必須用逗號 `,` 分隔：

```kotlin
enum class State {
    IDLE, RUNNING, FINISHED
}
```

`State` 列舉類別有列舉常數：`IDLE`、`RUNNING` 和 `FINISHED`。若要存取列舉常數，請使用類別名稱，後接 `.` 和列舉常數的名稱：

```kotlin
val state = State.RUNNING
```

您可以將此列舉類別與 `when` 表達式一起使用，以根據列舉常數的值定義要執行的動作：

```kotlin
enum class State {
    IDLE, RUNNING, FINISHED
}

fun main() {
    val state = State.RUNNING
    val message = when (state) {
        State.IDLE -> "It's idle"
        State.RUNNING -> "It's running"
        State.FINISHED -> "It's finished"
    }
    println(message)
    // It's running
}
```
{kotlin-runnable="true" id="kotlin-tour-enum-classes"}

列舉類別可以像普通類別一樣擁有屬性和成員函式。

例如，假設您正在使用 HTML，並且想要建立一個包含某些顏色的列舉類別。您希望每個顏色都有一個屬性，我們稱之為 `rgb`，它包含它們的 RGB 十六進制值。建立列舉常數時，您必須用此屬性進行初始化：

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF),
    YELLOW(0xFFFF00)
}
```

> Kotlin 將十六進制值儲存為整數，因此 `rgb` 屬性是 `Int` 類型，而不是 `String` 類型。
>
{style="note"}

若要將成員函式新增到此類別，請用分號 `;` 將其與列舉常數分開：

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF),
    YELLOW(0xFFFF00);

    fun containsRed() = (this.rgb and 0xFF0000 != 0)
}

fun main() {
    val red = Color.RED
    
    // 在列舉常數上呼叫 containsRed() 函式
    println(red.containsRed())
    // true

    // 透過類別名稱在列舉常數上呼叫 containsRed() 函式
    println(Color.BLUE.containsRed())
    // false
  
    println(Color.YELLOW.containsRed())
    // true
}
```
{kotlin-runnable="true" id="kotlin-tour-interface-enum-classes-members"}

在此範例中，`containsRed()` 成員函式使用 `this` 關鍵字存取列舉常數的 `rgb` 屬性值，並檢查十六進制值是否包含 `FF` 作為其首位元以回傳布林值。

有關更多資訊，請參閱 [列舉類別](enum-classes.md)。

### 行內值類別

有時在您的程式碼中，您可能希望從類別建立小型物件並僅短暫使用它們。這種方法可能會影響效能。行內值類別是一種特殊類型的類別，可以避免這種效能影響。然而，它們只能包含值。

若要建立行內值類別，請使用 `value` 關鍵字和 `@JvmInline` 註解：

```kotlin
@JvmInline
value class Email
```

> `@JvmInline` 註解指示 Kotlin 在編譯時最佳化程式碼。要了解更多資訊，請參閱 [註解](annotations.md)。
> 
{style="tip"}

行內值類別**必須**在類別標頭中初始化單一屬性。

假設您想建立一個收集電子郵件地址的類別：

```kotlin
// address 屬性在類別標頭中初始化。
@JvmInline
value class Email(val address: String)

fun sendEmail(email: Email) {
    println("Sending email to ${email.address}")
}

fun main() {
    val myEmail = Email("example@example.com")
    sendEmail(myEmail)
    // Sending email to example@example.com
}
```
{kotlin-runnable="true" id="kotlin-tour-inline-value-class"}

在此範例中：

* `Email` 是一個行內值類別，其類別標頭中包含一個屬性：`address`。
* `sendEmail()` 函式接受 `Email` 類型的物件並將字串列印到標準輸出。
* `main()` 函式：
    * 建立一個名為 `myEmail` 的 `Email` 類別實例。
    * 在 `myEmail` 物件上呼叫 `sendEmail()` 函式。

透過使用行內值類別，您可以使類別行內化，並在程式碼中直接使用它而無需建立物件。這可以顯著減少記憶體佔用並提高程式碼的執行時效能。

有關行內值類別的更多資訊，請參閱 [行內值類別](inline-classes.md)。

## 練習

### 練習 1 {initial-collapse-state="collapsed" collapsible="true" id="special-classes-exercise-1"}

您管理一個遞送服務，需要一種方法來追蹤包裹的狀態。建立一個名為 `DeliveryStatus` 的密封類別，其中包含資料類別以表示以下狀態：`Pending`、`InTransit`、`Delivered`、`Canceled`。完成 `DeliveryStatus` 類別的宣告，以便 `main()` 函式中的程式碼能成功執行：

|---|---|

```kotlin
sealed class // 在此編寫您的程式碼

fun printDeliveryStatus(status: DeliveryStatus) {
    when (status) {
        is DeliveryStatus.Pending -> {
            println("The package is pending pickup from ${status.sender}.")
        }
        is DeliveryStatus.InTransit -> {
            println("The package is in transit and expected to arrive by ${status.estimatedDeliveryDate}.")
        }
        is DeliveryStatus.Delivered -> {
            println("The package was delivered to ${status.recipient} on ${status.deliveryDate}.")
        }
        is DeliveryStatus.Canceled -> {
            println("The delivery was canceled due to: ${status.reason}.")
        }
    }
}

fun main() {
    val status1: DeliveryStatus = DeliveryStatus.Pending("Alice")
    val status2: DeliveryStatus = DeliveryStatus.InTransit("2024-11-20")
    val status3: DeliveryStatus = DeliveryStatus.Delivered("2024-11-18", "Bob")
    val status4: DeliveryStatus = DeliveryStatus.Canceled("Address not found")

    printDeliveryStatus(status1)
    // The package is pending pickup from Alice.
    printDeliveryStatus(status2)
    // The package is in transit and expected to arrive by 2024-11-20.
    printDeliveryStatus(status3)
    // The package was delivered to Bob on 2024-11-18.
    printDeliveryStatus(status4)
    // The delivery was canceled due to: Address not found.
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-special-classes-exercise-1"}

|---|---|
```kotlin
sealed class DeliveryStatus {
    data class Pending(val sender: String) : DeliveryStatus()
    data class InTransit(val estimatedDeliveryDate: String) : DeliveryStatus()
    data class Delivered(val deliveryDate: String, val recipient: String) : DeliveryStatus()
    data class Canceled(val reason: String) : DeliveryStatus()
}

fun printDeliveryStatus(status: DeliveryStatus) {
    when (status) {
        is DeliveryStatus.Pending -> {
            println("The package is pending pickup from ${status.sender}.")
        }
        is DeliveryStatus.InTransit -> {
            println("The package is in transit and expected to arrive by ${status.estimatedDeliveryDate}.")
        }
        is DeliveryStatus.Delivered -> {
            println("The package was delivered to ${status.recipient} on ${status.deliveryDate}.")
        }
        is DeliveryStatus.Canceled -> {
            println("The delivery was canceled due to: ${status.reason}.")
        }
    }
}

fun main() {
    val status1: DeliveryStatus = DeliveryStatus.Pending("Alice")
    val status2: DeliveryStatus = DeliveryStatus.InTransit("2024-11-20")
    val status3: DeliveryStatus = DeliveryStatus.Delivered("2024-11-18", "Bob")
    val status4: DeliveryStatus = DeliveryStatus.Canceled("Address not found")

    printDeliveryStatus(status1)
    // The package is pending pickup from Alice.
    printDeliveryStatus(status2)
    // The package is in transit and expected to arrive by 2024-11-20.
    printDeliveryStatus(status3)
    // The package was delivered to Bob on 2024-11-18.
    printDeliveryStatus(status4)
    // The delivery was canceled due to: Address not found.
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-special-classes-solution-1"}

### 練習 2 {initial-collapse-state="collapsed" collapsible="true" id="special-classes-exercise-2"}

在您的程式中，您希望能夠處理不同的狀態和錯誤類型。您有一個密封類別來捕獲在資料類別或物件中宣告的不同狀態。透過建立一個名為 `Problem` 的列舉類別來完成以下程式碼，該類別代表不同的問題類型：`NETWORK`、`TIMEOUT` 和 `UNKNOWN`。

|---|---|

```kotlin
sealed class Status {
    data object Loading : Status()
    data class Error(val problem: Problem) : Status() {
        // 在此編寫您的程式碼
    }

    data class OK(val data: List<String>) : Status()
}

fun handleStatus(status: Status) {
    when (status) {
        is Status.Loading -> println("Loading...")
        is Status.OK -> println("Data received: ${status.data}")
        is Status.Error -> when (status.problem) {
            Status.Error.Problem.NETWORK -> println("Network issue")
            Status.Error.Problem.TIMEOUT -> println("Request timed out")
            Status.Error.Problem.UNKNOWN -> println("Unknown error occurred")
        }
    }
}

fun main() {
    val status1: Status = Status.Error(Status.Error.Problem.NETWORK)
    val status2: Status = Status.OK(listOf("Data1", "Data2"))

    handleStatus(status1)
    // Network issue
    handleStatus(status2)
    // Data received: [Data1, Data2]
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-special-classes-exercise-2"}

|---|---|
```kotlin
sealed class Status {
    data object Loading : Status()
    data class Error(val problem: Problem) : Status() {
        enum class Problem {
            NETWORK,
            TIMEOUT,
            UNKNOWN
        }
    }

    data class OK(val data: List<String>) : Status()
}

fun handleStatus(status: Status) {
    when (status) {
        is Status.Loading -> println("Loading...")
        is Status.OK -> println("Data received: ${status.data}")
        is Status.Error -> when (status.problem) {
            Status.Error.Problem.NETWORK -> println("Network issue")
            Status.Error.Problem.TIMEOUT -> println("Request timed out")
            Status.Error.Problem.UNKNOWN -> println("Unknown error occurred")
        }
    }
}

fun main() {
    val status1: Status = Status.Error(Status.Error.Problem.NETWORK)
    val status2: Status = Status.OK(listOf("Data1", "Data2"))

    handleStatus(status1)
    // Network issue
    handleStatus(status2)
    // Data received: [Data1, Data2]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="Example solution" id="kotlin-tour-special-classes-solution-2"}

## 下一步

[中級：屬性](kotlin-tour-intermediate-properties.md)