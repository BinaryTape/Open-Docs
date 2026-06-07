[//]: # (title: 屬性)

在 Kotlin 中，屬性（property）讓您無需編寫函式即可儲存和管理資料。
您可以在 [類別](classes.md)、[介面](interfaces.md)、[物件](object-declarations.md)、[伴生物件](object-declarations.md#companion-objects) 中使用屬性，甚至可以在這些結構之外作為頂層屬性使用。

每個屬性都有一個名稱、一個型別，以及一個自動產生的 `get()` 函式，稱為 getter。您可以使用 getter 來讀取屬性的值。如果屬性是可變的，它還會有一個 `set()` 函式，稱為 setter，這讓您可以變更屬性的值。

> Getter 和 setter 被稱為 _存取子_。
> 
{style="tip"}

## 宣告屬性

屬性可以是可變的 (`var`) 或唯讀的 (`val`)。
您可以將它們宣告為 `.kt` 檔案中的頂層屬性。可以將頂層屬性想像成屬於某個 **套件** 的全域變數：

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

## 支援欄位

當需要將值儲存在記憶體中時，編譯器會自動為屬性產生支援欄位（backing field）。

例如，當您使用預設的 `get()` 和 `set()` 函式時，編譯器會建立支援欄位，因為它們會讀取和寫入儲存的值：

```kotlin
var count = 0
```

您可以在 [自訂 `get()` 或 `set()` 函式](#custom-getters-and-setters) 中使用 `field` 關鍵字來存取支援欄位。例如，您可以在 getter 或 setter 中加入額外邏輯，或者在屬性變更時觸發額外動作。

在此範例中，`score` 屬性在 `set()` 函式內部使用支援欄位，以便在更新值時同時觸發日誌事件：

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

並非所有屬性都會預設建立支援欄位，因為有些屬性可能不需要。例如，`isEmpty` 屬性沒有支援欄位，因為每次存取它時，值都是從 `size` 屬性計算出來的：

```kotlin
val isEmpty: Boolean
    get() = this.size == 0
```

### 明確支援欄位

有時您可能需要更靈活的功能。例如，如果您有一個 API，希望在內部能夠修改屬性，但在外部則不能。在這種情況下，您可以使用 **明確支援欄位**（explicit backing field）。

在以下範例中，`ShoppingCart` 類別具有一個 `items` 屬性，代表購物車中的所有內容。該類別將 `items` 屬性公開為唯讀的字串清單，但在內部則透過明確支援欄位將資料儲存在可變清單中：

```kotlin
class ShoppingCart {
    // 具有明確支援欄位的公共唯讀視圖
    val items: List<String>
        field = mutableListOf()
    
    fun addItem(item: String) {
        items.add(item)
    }

    fun removeItem(item: String) {
        items.remove(item)
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
{kotlin-runnable="true" kotlin-min-compiler-version="2.4" id="kotlin-explicit-backing-field"}

在此範例中，編譯器從 `mutableListOf()` 呼叫中推論出支援欄位的型別：`MutableList<String>`。您也可以明確宣告支援欄位的型別：

```kotlin
val items: List<String>
    // 具有明確型別的明確支援欄位
    field: MutableList<String> = mutableListOf()
```
{validate="false"}

在 `ShoppingCart` 類別的範例中，編譯器將 `items` 屬性智慧轉換為 `MutableList<String>` 型別，因此類別可以透過 `add()` 和 `remove()` 函式向購物車加入或移除項目。在類別外部，編譯器使用公共屬性型別 `List<String>`，因此 API 使用者只能讀取 `items` 清單中的內容。

#### 限制

要使用明確支援欄位，屬性及其支援欄位本身必須遵循特定規則。屬性僅在滿足以下條件時才能擁有明確支援欄位：

* 沒有自訂 getter。
* 為唯讀 (`val`)。
* 不是 `open`。
* 不是 [委託屬性](delegated-properties.md)。
* 不是 [編譯期常數](#compile-time-constants)。

此外，支援欄位的型別必須是屬性型別的子型別，且具有 [`private` 可見性](visibility-modifiers.md)。

您可以透過改用支援屬性來規避這些限制。

### 支援屬性

如果明確支援欄位不符合您的使用案例，您可以嘗試使用一種稱為 **支援屬性**（backing property）的編碼模式。

例如，如果您的屬性需要自訂 getter：

```kotlin
class UserDirectory {
    private val _users = mutableListOf(
        "sarah",
        "mike",
        "emma"
    )

    val users: List<String>
        get() = _users.sorted()

    fun addUser(username: String) {
        _users.add(username)
    }
}

fun main() {
    val directory = UserDirectory()

    directory.addUser("alex")
    println(directory.users)
    // [alex, emma, mike, sarah]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-backing-property-custom-getter"}

> 命名支援屬性時，請使用前導底線，以遵循 Kotlin 的 [編碼慣例](coding-conventions.md#names-for-backing-properties)。
>
{style="tip"}

在此範例中，`UserDirectory` 類別具有一個唯讀的 `users` 屬性，用於列出目錄中的每個使用者。`_users` 變數是包含實際清單的私有支援屬性。公共 `users` 屬性的 getter 在傳回項目之前會對其進行排序。

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
        // 直接呼叫 orderService，無需檢查 null 或初始化狀態
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

為了重複使用邏輯並減少程式碼重複，您可以將取得和設定屬性的職責委託給另一個獨立物件。

委託存取子行為可以使屬性的存取子邏輯保持集中，從而更容易重複使用。這種方法在實作以下行為時非常有用：

* 延遲載入計算值。
* 透過給定的鍵從 map 中讀取。
* 存取資料庫。
* 在存取屬性時通知監聽器。

您可以自己在程式庫中實作這些常見行為，也可以使用外部程式庫提供的現有委託。欲了解更多資訊，請參閱 [委託屬性](delegated-properties.md)。