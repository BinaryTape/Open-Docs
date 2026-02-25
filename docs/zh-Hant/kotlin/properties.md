[//]: # (title: 屬性)

在 Kotlin 中，屬性（property）讓您無需編寫函式即可儲存和管理資料。
您可以在 [類別](classes.md)、[介面](interfaces.md)、[物件](object-declarations.md)、[伴生物件](object-declarations.md#companion-objects) 中使用屬性，甚至可以在這些結構之外作為頂層屬性使用。

每個屬性都有一個名稱、一個型別，以及一個自動產生的 `get()` 函式，稱為 getter。您可以使用 getter 來讀取屬性的值。如果屬性是可變的，它還會有一個 `set()` 函式，稱為 setter，這讓您可以變更屬性的值。

> Getter 和 setter 被稱為 _存取子_。
> 
{style="tip"}

## 宣告屬性

屬性可以是可變的 (`var`) 或唯讀的 (`val`)。
您可以將它們宣告為 `.kt` 檔案中的頂層屬性。可以將頂層屬性想像成屬於某個 **軟件包** 的全域變數：

```kotlin
// 檔案：Constants.kt
package my.app

val pi = 3.14159
var counter = 0
```

您也可以在類別、介面或物件內部宣告屬性：

```kotlin
// 具有屬性的類別
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
}

// 具有屬性的介面
interface ContactInfo {
    val email: String
}

// 具有屬性的物件
object Company {
    var name: String = "Detective Inc."
    val country: String = "UK"
}

// 實作介面的類別
class PersonContact : ContactInfo {
    override val email: String = "sherlock@example.com"
}
```

要使用屬性，請透過其名稱來引用：

```kotlin
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
}

interface ContactInfo {
    val email: String
}

object Company {
    var name: String = "Detective Inc."
    val country: String = "UK"
}

class PersonContact : ContactInfo {
    override val email: String = "sherlock@example.com"
}

//sampleStart
fun copyAddress(address: Address): Address {
    val result = Address()
    // 存取 result 執行個體中的屬性
    result.name = address.name
    result.street = address.street
    result.city = address.city
    return result
}

fun main() {
    val sherlockAddress = Address()
    val copy = copyAddress(sherlockAddress)
    // 存取 copy 執行個體中的屬性
    println("Copied address: ${copy.name}, ${copy.street}, ${copy.city}")
    // Copied address: Holmes, Sherlock, Baker, London

    // 存取 Company 物件中的屬性
    println("Company: ${Company.name} in ${Company.country}")
    // Company: Detective Inc. in UK
    
    val contact = PersonContact()
    // 存取 contact 執行個體中的屬性
    println("Email: ${contact.email}")
    // Email: sherlock@email.com
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-access-properties"}

在 Kotlin 中，我們建議在宣告屬性時進行初始化，以確保程式碼安全且易於閱讀。但在特殊情況下，您可以[稍後再進行初始化](#late-initialized-properties-and-variables)。

如果編譯器可以從初始設定式或 getter 的傳回型別中推斷出屬性型別，則可以省略型別宣告：

```kotlin
var initialized = 1 // 推論型別為 Int
var allByDefault    // 錯誤：屬性必須初始化。
```
{validate="false"}

## 自訂 getter 與 setter

根據預設，Kotlin 會自動產生 getter 和 setter。當您需要額外邏輯（例如驗證、格式化或基於其他屬性的計算）時，可以定義自己的自訂存取子。

每次存取屬性時，都會執行自訂 getter：

```kotlin
//sampleStart
class Rectangle(val width: Int, val height: Int) {
    val area: Int
        get() = this.width * this.height
}
//sampleEnd
fun main() {
    val rectangle = Rectangle(3, 4)
    println("Width=${rectangle.width}, height=${rectangle.height}, area=${rectangle.area}")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-custom-getter"}

如果編譯器可以從 getter 中推論出型別，則可以省略型別：

```kotlin
val area get() = this.width * this.height
```

除了初始化期間外，每次為屬性指派值時，都會執行自訂 setter。
按照慣例，setter 參數的名稱為 `value`，但您也可以選擇其他名稱：

```kotlin
class Point(var x: Int, var y: Int) {
    var coordinates: String
        get() = "$x,$y"
        set(value) {
            val parts = value.split(",")
            x = parts[0].toInt()
            y = parts[1].toInt()
        }
}

fun main() {
    val location = Point(1, 2)
    println(location.coordinates) 
    // 1,2

    location.coordinates = "10,20"
    println("${location.x}, ${location.y}") 
    // 10, 20
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-custom-setter"}

### 變更可見性或加入註解

在 Kotlin 中，您可以變更存取子的可見性或加入 [註解](annotations.md)，而無需替換預設實作。您不需要在花括號 `{}` 主體內進行這些變更。

要變更存取子的可見性，請在 `get` 或 `set` 關鍵字之前使用修飾符：

```kotlin
class BankAccount(initialBalance: Int) {
    var balance: Int = initialBalance
        // 只有類別內部可以修改餘額
        private set 

    fun deposit(amount: Int) {
        if (amount > 0) balance += amount
    }

    fun withdraw(amount: Int) {
        if (amount > 0 && amount <= balance) balance -= amount
    }
}

fun main() {
    val account = BankAccount(100)
    println("Initial balance: ${account.balance}") 
    // 100

    account.deposit(50)
    println("After deposit: ${account.balance}") 
    // 150

    account.withdraw(70)
    println("After withdrawal: ${account.balance}") 
    // 80

    // account.balance = 1000  
    // 錯誤：無法指派值，因為 setter 是私有的
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-private-setter"}

要為存取子加上註解，請在 `get` 或 `set` 關鍵字之前使用註解：

```kotlin
// 定義一個可用於 getter 的註解
@Target(AnnotationTarget.PROPERTY_GETTER)
annotation class Inject

class Service {
    var dependency: String = "Default Service"
        // 為 getter 加上註解
        @Inject get 
}

fun main() {
    val service = Service()
    println(service.dependency)
    // Default service
    println(service::dependency.getter.annotations)
    // [@Inject()]
    println(service::dependency.setter.annotations)
    // []
}
```
{validate="false"}

此範例使用 [反射](reflection.md) 來顯示 getter 和 setter 上存在哪些註解。

### 支援欄位

在 Kotlin 中，存取子使用支援欄位（backing field）將屬性的值儲存在記憶體中。當您想在 getter 或 setter 中加入額外邏輯，或者想在屬性變更時觸發額外動作時，支援欄位非常有用。

您無法直接宣告支援欄位。Kotlin 僅在必要時產生它們。您可以在存取子中使用 `field` 關鍵字來參照支援欄位。

Kotlin 僅在您使用預設 getter 或 setter，或者您在至少一個自訂存取子中使用 `field` 時，才會產生支援欄位。

例如，`isEmpty` 屬性沒有支援欄位，因為它使用的自訂 getter 中沒有 `field` 關鍵字：

```kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

在以下範例中，`score` 屬性具有支援欄位，因為其 setter 使用了 `field` 關鍵字：

```kotlin
class Scoreboard {
    var score: Int = 0
        set(value) {
            field = value
            // 在更新值時加入日誌記錄
            println("Score updated to $field")
        }
}

fun main() {
    val board = Scoreboard()
    board.score = 10  
    // Score updated to 10
    board.score = 20  
    // Score updated to 20
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-backing-field"}

### 支援屬性

有時您可能需要比 [支援欄位](#backing-fields) 提供的更靈活的功能。例如，如果您有一個 API，希望在內部能夠修改屬性，但在外部則不能。在這種情況下，您可以使用一種稱為 _支援屬性_（backing property）的編碼模式。

在以下範例中，`ShoppingCart` 類別具有一個 `items` 屬性，代表購物車中的所有內容。您希望 `items` 屬性在類別外部是唯讀的，但仍允許一種「經核准」的方式讓使用者直接修改 `items` 屬性。為了實現這一點，您可以定義一個名為 `_items` 的私有支援屬性，以及一個名為 `items` 的公共屬性，該公共屬性將委託給支援屬性的值。

```kotlin
class ShoppingCart {
    // 支援屬性
    private val _items = mutableListOf<String>()

    // 公共唯讀視圖
    val items: List<String>
        get() = _items

    fun addItem(item: String) {
        _items.add(item)
    }

    fun removeItem(item: String) {
        _items.remove(item)
    }
}

fun main() {
    val cart = ShoppingCart()
    cart.addItem("Apple")
    cart.addItem("Banana")

    println(cart.items) 
    // [Apple, Banana]
    
    cart.removeItem("Apple")
    println(cart.items) 
    // [Banana]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-backing-property"}

在此範例中，使用者只能透過 `addItem()` 函式將項目加入購物車，但仍可存取 `items` 屬性來查看內容。

> 命名支援屬性時，請使用前導底線，以遵循 Kotlin 的 [編碼慣例](coding-conventions.md#names-for-backing-properties)。
>
{style="tip"}

在 JVM 上，編譯器會優化對具有預設存取子的私有屬性的存取，以避免函式呼叫的開銷。

當您希望多個公共屬性共享同一個狀態時，支援屬性也很有用。例如：

```kotlin
class Temperature {
    // 儲存攝氏溫度的支援屬性
    private var _celsius: Double = 0.0

    var celsius: Double
        get() = _celsius
        set(value) { _celsius = value }

    var fahrenheit: Double
        get() = _celsius * 9 / 5 + 32
        set(value) { _celsius = (value - 32) * 5 / 9 }
}

fun main() {
    val temp = Temperature()
    temp.celsius = 25.0
    println("${temp.celsius}°C = ${temp.fahrenheit}°F") 
    // 25.0°C = 77.0°F

    temp.fahrenheit = 212.0
    println("${temp.celsius}°C = ${temp.fahrenheit}°F") 
    // 100.0°C = 212.0°F
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-backing-property-multiple-properties"}

在此範例中，`celsius` 和 `fahrenheit` 屬性都會存取 `_celsius` 支援屬性。這種設置提供了一個單一的資料來源（Single Source of Truth），並具有兩個公共視圖。

## 編譯期常數

如果唯讀屬性的值在編譯時期就已知，請使用 `const` 修飾符將其標記為 _編譯期常數_。編譯期常數會在編譯時進行內嵌（inline），因此每個參照都會被替換為其實際值。由於不需要呼叫 getter，因此存取效率更高：

```kotlin
// 檔案：AppConfig.kt
package com.example

// 編譯期常數
const val MAX_LOGIN_ATTEMPTS = 3
```

編譯期常數必須符合以下要求：

* 它們必須是頂層屬性，或者是 [`object` 宣告](object-declarations.md#object-declarations-overview) 或 [伴生物件](object-declarations.md#companion-objects) 的成員。
* 它們必須以 `String` 型別或 [原始型別](types-overview.md) 的值進行初始化。
* 它們不能有自訂 getter。

編譯期常數仍具有支援欄位，因此您可以使用 [反射](reflection.md) 與它們互動。

您也可以在註解中使用這些屬性：

```kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTEM_DEPRECATED) fun processLegacyOrders() { ... }
```

## 延遲初始化屬性與變數

通常，您必須在建構函式中初始化屬性。然而，這並不總是方便。例如，您可能透過相依注入或在單元測試的 setup 方法中初始化屬性。

要處理這些情況，請使用 `lateinit` 修飾符標記屬性：

```kotlin
public class OrderServiceTest {
    lateinit var orderService: OrderService

    @SetUp fun setup() {
        orderService = OrderService()
    }

    @Test fun processesOrderSuccessfully() {
        // 直接呼叫 orderService，無需檢查 null
        // 或初始化狀態
        orderService.processOrder()  
    }
}
```

您可以對宣告為以下形式的 `var` 屬性使用 `lateinit` 修飾符：

* 頂層屬性。
* 區域變數。
* 類別主體內的屬性。

對於類別屬性：

* 不能在主建構函式中宣告它們。
* 它們不能有自訂 getter 或 setter。

在所有情況下，屬性或變數都必須是不可為 null 的，且不能是 [原始型別](types-overview.md)。

如果您在初始化之前存取 `lateinit` 屬性，Kotlin 會拋出一個特定的例外，標識正在存取的未初始化屬性：

```kotlin
class ReportGenerator {
    lateinit var report: String

    fun printReport() {
        // 由於在初始化前存取，將會拋出例外
        println(report)
    }
}

fun main() {
    val generator = ReportGenerator()
    generator.printReport()
    // 執行緒 "main" 中的例外 kotlin.UninitializedPropertyAccessException: lateinit property report has not been initialized
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-lateinit-property" validate="false"}

要檢查 `lateinit var` 是否已經初始化，請在該[屬性的參照](reflection.md#property-references)上使用 [`isInitialized`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/is-initialized.html) 屬性：

```kotlin
class WeatherStation {
    lateinit var latestReading: String

    fun printReading() {
        // 檢查屬性是否已初始化
        if (this::latestReading.isInitialized) {
            println("Latest reading: $latestReading")
        } else {
            println("No reading available")
        }
    }
}

fun main() {
    val station = WeatherStation()

    station.printReading()
    // No reading available
    station.latestReading = "22°C, sunny"
    station.printReading()
    // Latest reading: 22°C, sunny
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-lateinit-property-check-initialization"}

只有在您的程式碼中已經可以存取該屬性時，才能對其使用 `isInitialized`。該屬性必須宣告在同一個類別、外層類別中，或者是同一個檔案中的頂層屬性。

## 覆寫屬性

請參閱 [覆寫屬性](inheritance.md#overriding-properties)。

## 委託屬性

為了重複使用邏輯並減少程式碼重複，您可以將取得和設定屬性的職責委託給另一個物件。

委託存取子行為可以使屬性的存取子邏輯保持集中，從而更容易重複使用。這種方法在實作以下行為時非常有用：

* 延遲載入計算值。
* 透過給定的鍵從 map 中讀取。
* 存取資料庫。
* 在存取屬性時通知監聽器。

您可以自己在程式庫中實作這些常見行為，也可以使用外部程式庫提供的現有委託。欲了解更多資訊，請參閱 [委託屬性](delegated-properties.md)。