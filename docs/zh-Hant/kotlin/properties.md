[//]: # (title: 屬性)

在 Kotlin 中，屬性允許您儲存和管理資料，而無需編寫函式來存取或更改這些資料。您可以在 [類別](classes.md)、[介面](interfaces.md)、[物件](object-declarations.md)、[伴生物件](object-declarations.md#companion-objects) 中使用屬性，甚至在這些結構之外作為頂層屬性。

每個屬性都有一個名稱、一個型別，以及一個自動生成的 `get()` 函式，稱為取得器。您可以使用取得器來讀取屬性的值。如果該屬性是可變的，它也會有一個 `set()` 函式，稱為設定器，允許您更改屬性的值。

> 取得器和設定器統稱為 _存取器_。
> 
{style="tip"}

## 宣告屬性

屬性可以是可變的 (`var`) 或唯讀的 (`val`)。
您可以在 `.kt` 檔案中將它們宣告為頂層屬性。可以將頂層屬性視為屬於某個套件的全域變數：

```kotlin
// File: Constants.kt
package my.app

val pi = 3.14159
var counter = 0
```

您也可以在類別、介面或物件內部宣告屬性：

```kotlin
// Class with properties
class Address {
    var name: String = "Holmes, Sherlock"
    var street: String = "Baker"
    var city: String = "London"
}

// Interface with a property
interface ContactInfo {
    val email: String
}

// Object with properties
object Company {
    var name: String = "Detective Inc."
    val country: String = "UK"
}

// Class implementing the interface
class PersonContact : ContactInfo {
    override val email: String = "sherlock@example.com"
}
```

要使用屬性，請透過其名稱引用：

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
    // 存取 result 實例中的屬性
    result.name = address.name
    result.street = address.street
    result.city = address.city
    return result
}

fun main() {
    val sherlockAddress = Address()
    val copy = copyAddress(sherlockAddress)
    // 存取 copy 實例中的屬性
    println("Copied address: ${copy.name}, ${copy.street}, ${copy.city}")
    // 複製的地址：Holmes, Sherlock, Baker, London

    // 存取 Company 物件中的屬性
    println("Company: ${Company.name} in ${Company.country}")
    // 公司：Detective Inc. 在 UK
    
    val contact = PersonContact()
    // 存取 contact 實例中的屬性
    println("Email: ${contact.email}")
    // 電子郵件：sherlock@example.com
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-access-properties"}

在 Kotlin 中，我們建議您在宣告屬性時就將其初始化，以確保程式碼安全且易於閱讀。然而，在特殊情況下，您可以[稍後初始化它們](#late-initialized-properties-and-variables)。

如果編譯器可以從初始化器或取得器的回傳型別推斷出屬性型別，則宣告屬性型別是可選的：

```kotlin
var initialized = 1 // 推斷的型別是 Int
var allByDefault    // 錯誤：屬性必須初始化。
```
{validate="false"}

## 自訂取得器與設定器

預設情況下，Kotlin 會自動生成取得器和設定器。當您需要額外邏輯時，例如驗證、格式化或基於其他屬性的計算，您可以定義自己的自訂存取器。

自訂取得器會在每次存取屬性時執行：

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

如果編譯器可以從取得器推斷型別，您可以省略它：

```kotlin
val area get() = this.width * this.height
```

自訂設定器會在每次您為屬性賦值時執行，除了其初始化之外。依慣例，設定器參數的名稱是 `value`，但您可以選擇不同的名稱：

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

### 更改可見性或新增註解

在 Kotlin 中，您可以更改存取器可見性或新增[註解](annotations.md)，而無需替換預設實作。您不需要在 `{}` 主體內進行這些更改。

要更改存取器的可見性，請在 `get` 或 `set` 關鍵字之前使用修飾符：

```kotlin
class BankAccount(initialBalance: Int) {
    var balance: Int = initialBalance
        // 只有類別可以修改餘額
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
    // 初始餘額：100

    account.deposit(50)
    println("After deposit: ${account.balance}") 
    // 存款後：150

    account.withdraw(70)
    println("After withdrawal: ${account.balance}") 
    // 提款後：80

    // account.balance = 1000  
    // 錯誤：無法賦值，因為設定器是私有的
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-private-setter"}

要註解存取器，請在 `get` 或 `set` 關鍵字之前使用註解：

```kotlin
// 定義一個可套用於取得器的註解
@Target(AnnotationTarget.PROPERTY_GETTER)
annotation class Inject

class Service {
    var dependency: String = "Default Service"
        // 註解取得器
        @Inject get 
}

fun main() {
    val service = Service()
    println(service.dependency)
    // 預設服務
    println(service::dependency.getter.annotations)
    // [@Inject()]
    println(service::dependency.setter.annotations)
    // []
}
```
{validate="false"}

此範例使用[反射](reflection.md)來顯示取得器和設定器上存在哪些註解。

### 幕後欄位

在 Kotlin 中，存取器使用幕後欄位在記憶體中儲存屬性的值。當您想為取得器或設定器新增額外邏輯，或者想在屬性更改時觸發額外動作時，幕後欄位會很有用。

您無法直接宣告幕後欄位。Kotlin 僅在必要時生成它們。您可以在存取器中使用 `field` 關鍵字引用幕後欄位。

Kotlin 僅在您使用預設取得器或設定器，或者在至少一個自訂存取器中使用 `field` 時才會生成幕後欄位。

例如，`isEmpty` 屬性沒有幕後欄位，因為它使用一個沒有 `field` 關鍵字的自訂取得器：

```kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

在此範例中，`score` 屬性有一個幕後欄位，因為設定器使用了 `field` 關鍵字：

```kotlin
class Scoreboard {
    var score: Int = 0
        set(value) {
            field = value
            // 更新值時新增日誌
            println("Score updated to $field")
        }
}

fun main() {
    val board = Scoreboard()
    board.score = 10  
    // 分數更新為 10
    board.score = 20  
    // 分數更新為 20
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-backing-field"}

### 幕後屬性

有時，您可能需要比使用[幕後欄位](#backing-fields)所能提供的更具彈性。例如，如果您有一個 API，希望能夠在內部修改屬性，但不在外部修改。在這種情況下，您可以使用一種稱為 _幕後屬性_ 的編碼模式。

在以下範例中，`ShoppingCart` 類別有一個 `items` 屬性，代表購物車中的所有物品。您希望 `items` 屬性在類別外部是唯讀的，但仍允許使用者以一種「核准」的方式直接修改 `items` 屬性。為了實現這一點，您可以定義一個名為 `_items` 的私有幕後屬性，以及一個名為 `items` 的公共屬性，該屬性委託給幕後屬性的值。

```kotlin
class ShoppingCart {
    // 幕後屬性
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

在此範例中，使用者只能透過 `addItem()` 函式將物品新增到購物車中，但仍可以存取 `items` 屬性來查看其中包含的物品。

> 在命名幕後屬性時使用開頭的底線，以遵循 Kotlin [編碼慣例](coding-conventions.md#names-for-backing-properties)。
>
{style="tip"}

在 JVM 上，編譯器會優化對具有預設存取器的私有屬性的存取，以避免函式呼叫的開銷。

當您希望多個公共屬性共享一個狀態時，幕後屬性也很有用。例如：

```kotlin
class Temperature {
    // 儲存攝氏溫度的幕後屬性
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

在此範例中，`_celsius` 幕後屬性被 `celsius` 和 `fahrenheit` 這兩個屬性存取。這種設置提供了一個單一的事實來源，並具有兩個公共視圖。

## 編譯期常數

如果唯讀屬性的值在編譯時已知，請使用 `const` 修飾符將其標記為 _編譯期常數_。編譯期常數在編譯時會被內聯，因此每個引用都會被替換為其實際值。它們被更有效地存取，因為沒有呼叫取得器：

```kotlin
// File: AppConfig.kt
package com.example

// 編譯期常數
const val MAX_LOGIN_ATTEMPTS = 3
```

編譯期常數必須滿足以下要求：

*   它必須是頂層屬性，或者是 [`object` 宣告](object-declarations.md#object-declarations-overview) 或 [伴生物件](object-declarations.md#companion-objects) 的成員。
*   它必須以 `String` 型別或[基本型別](basic-types.md)的值來初始化。
*   它不能是自訂取得器。

編譯期常數仍然有一個幕後欄位，因此您可以使用[反射](reflection.md)與其互動。

您也可以在註解中使用這些屬性：

```kotlin
const val SUBSYSTEM_DEPRECATED: String = "This subsystem is deprecated"

@Deprecated(SUBSYSTEM_DEPRECATED) fun processLegacyOrders() { ... }
```

## 延遲初始化屬性與變數

通常，您必須在建構函式中初始化屬性。然而，這樣做並不總是方便。例如，您可能透過依賴注入或在單元測試的設定方法中初始化屬性。

為了處理這些情況，請使用 `lateinit` 修飾符標記屬性：

```kotlin
public class OrderServiceTest {
    lateinit var orderService: OrderService

    @SetUp fun setup() {
        orderService = OrderService()
    }

    @Test fun processesOrderSuccessfully() {
        // 直接呼叫 orderService，無需檢查 null 或初始化
        orderService.processOrder()  
    }
}
```

您可以在宣告為以下情況的 `var` 屬性上使用 `lateinit` 修飾符：

*   頂層屬性。
*   區域變數。
*   類別主體內的屬性。

對於類別屬性：

*   您不能在主要建構函式中宣告它們。
*   它們不能有自訂取得器或設定器。

在所有情況下，屬性或變數必須是非可空的，並且不能是[基本型別](basic-types.md)。

如果您在初始化 `lateinit` 屬性之前存取它，Kotlin 會拋出一個特定例外，該例外會清楚地識別被存取的未初始化屬性：

```kotlin
class ReportGenerator {
    lateinit var report: String

    fun printReport() {
        // 因為在初始化之前存取，所以會拋出例外
        println(report)
    }
}

fun main() {
    val generator = ReportGenerator()
    generator.printReport()
    // 執行緒 "main" 中的例外 kotlin.UninitializedPropertyAccessException: lateinit 屬性 report 尚未初始化
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-lateinit-property" validate="false"}

要檢查 `lateinit var` 是否已初始化，請在[該屬性的引用](reflection.md#property-references)上使用 [`isInitialized`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/is-initialized.html) 屬性：

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
    // 無可用讀數
    station.latestReading = "22°C, sunny"
    station.printReading()
    // 最新讀數：22°C，晴朗
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-lateinit-property-check-initialization"}

您只能在您已能在程式碼中存取的屬性上使用 `isInitialized`。該屬性必須在同一類別、外部類別或作為同一檔案中的頂層屬性宣告。

## 覆寫屬性

請參閱[覆寫屬性](inheritance.md#overriding-properties)。

## 委託屬性

為了重複使用邏輯並減少程式碼重複，您可以將屬性的取得和設定職責委託給一個單獨的物件。

委託存取器行為可使屬性的存取器邏輯集中化，使其更容易重複使用。這種方法在實作以下行為時很有用，例如：

*   延遲計算值。
*   透過給定鍵從映射中讀取。
*   存取資料庫。
*   在存取屬性時通知監聽器。

您可以自行在函式庫中實作這些常見行為，或使用外部函式庫提供的現有委託。如需更多資訊，請參閱[委託屬性](delegated-properties.md)。