[//]: # (title: 擴充功能)

Kotlin 的 _擴充功能_ 讓您可以為類別或介面擴充新功能，而無需使用繼承或像 _裝飾器模式 (Decorator)_ 這類的設計模式。當您需要處理無法直接修改的第三方函式庫時，它們會非常有用。一旦建立，您可以像呼叫原始類別或介面的成員一樣來呼叫這些擴充功能。

最常見的擴充功能形式是 [_擴充函式_](#extension-functions) 和 [_擴充屬性_](#extension-properties)。

重要的是，擴充功能並不會修改它們所擴充的類別或介面。當您定義一個擴充功能時，您並非添加新成員。您只是讓新的函式能夠被呼叫或新的屬性能夠被存取，並使用相同的語法。

## 接收者

擴充功能總是作用在一個接收者上。接收者必須與被擴充的類別或介面具有相同的類型。要使用擴充功能，請在接收者之後加上 `.` 和函式或屬性名稱。

例如，標準函式庫中的 [`.appendLine()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/append-line.html) 擴充函式擴充了 `StringBuilder` 類別。因此，在此情況下，接收者是一個 `StringBuilder` 實例，而 _接收者類型_ 是 `StringBuilder`：

```kotlin
fun main() { 
//sampleStart
    // builder is an instance of StringBuilder
    val builder = StringBuilder()
        // Calls .appendLine() extension function on builder
        .appendLine("Hello")
        .appendLine()
        .appendLine("World")
    println(builder.toString())
    // Hello
    //
    // World
}
//sampleEnd
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-stringbuilder"}

## 擴充函式

在建立自己的擴充函式之前，請先檢查 Kotlin [標準函式庫](https://kotlinlang.org/api/core/kotlin-stdlib/) 中是否已有您所需的功能。標準函式庫提供了許多有用的擴充函式，用於：

*   操作集合：[`.map()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/map.html)、[`.filter()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter.html)、[`.reduce()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/reduce.html)、[`.fold()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/fold.html)、[`.groupBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/group-by.html)。
*   轉換為字串：[`.joinToString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/join-to-string.html)。
*   處理空值：[`.filterNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter-not-null.html)。

要建立自己的擴充函式，請在其名稱前加上接收者類型，後面跟著 `.`。在此範例中，`.truncate()` 函式擴充了 `String` 類別，因此接收者類型是 `String`：

```kotlin
fun String.truncate(maxLength: Int): String {
    return if (this.length <= maxLength) this else take(maxLength - 3) + "..."
}

fun main() {
    val shortUsername = "KotlinFan42"
    val longUsername = "JetBrainsLoverForever"

    println("Short username: ${shortUsername.truncate(15)}") 
    // KotlinFan42
    println("Long username:  ${longUsername.truncate(15)}")
    // JetBrainsLov...
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-truncate"}

`.truncate()` 函式會根據 `maxLength` 引數中的數字截斷它所呼叫的任何字串，並添加省略符號 `...`。如果字串長度短於 `maxLength`，則函式會返回原始字串。

在此範例中，`.displayInfo()` 函式擴充了 `User` 介面：

```kotlin
interface User {
    val name: String
    val email: String
}

fun User.displayInfo(): String = "User(name=$name, email=$email)"

// Inherits from and implements the properties of the User interface
class RegularUser(override val name: String, override val email: String) : User

fun main() {
    val user = RegularUser("Alice", "alice@example.com")
    println(user.displayInfo()) 
    // User(name=Alice, email=alice@example.com)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-interface"}

`.displayInfo()` 函式返回一個包含 `RegularUser` 實例的 `name` 和 `email` 的字串。像這樣在介面上定義擴充功能非常有用，當您只想一次性地為所有實作該介面的類型添加功能時。

在此範例中，`.mostVoted()` 函式擴充了 `Map<String, Int>` 類別：

```kotlin
fun Map<String, Int>.mostVoted(): String? {
    return maxByOrNull { (key, value) -> value }?.key
}

fun main() {
    val poll = mapOf(
        "Cats" to 37,
        "Dogs" to 58,
        "Birds" to 22
    )

    println("Top choice: ${poll.mostVoted()}") 
    // Dogs
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-mostvoted"}

`.mostVoted()` 函式會迭代其所呼叫的 map 的鍵值對，並使用 [`maxByOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/max-by-or-null.html) 函式返回包含最高值的對應鍵。如果 map 為空，`maxByOrNull()` 函式會返回 `null`。`mostVoted()` 函式使用安全呼叫 `?.` 僅在 `maxByOrNull()` 函式返回非空值時才存取 `key` 屬性。

### 泛型擴充函式

要建立泛型擴充函式，請在函式名稱之前宣告泛型類型參數，以使其在接收者類型表達式中可用。在此範例中，`.endpoints()` 函式擴充了 `List<T>`，其中 `T` 可以是任何類型：

```kotlin
fun <T> List<T>.endpoints(): Pair<T, T> {
    return first() to last()
}

fun main() {
    val cities = listOf("Paris", "London", "Berlin", "Prague")
    val temperatures = listOf(21.0, 19.5, 22.3)

    val cityEndpoints = cities.endpoints()
    val tempEndpoints = temperatures.endpoints()

    println("First and last cities: $cityEndpoints")
    // (Paris, Prague)
    println("First and last temperatures: $tempEndpoints") 
    // (21.0, 22.3)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-endpoints"}

`.endpoints()` 函式返回一個包含其所呼叫的 list 的第一個和最後一個元素的 `Pair`。在函式主體內部，它呼叫 `first()` 和 `last()` 函式，並使用 `to` 中綴函式將它們的返回值組合到一個 `Pair` 中。

有關泛型的更多資訊，請參閱 [泛型函式 (generic functions)](generics.md)。

### 可空接收者

您可以定義具有可空接收者類型的擴充函式，這允許您即使變數的值為 null 也能呼叫它們。當接收者為 `null` 時，`this` 也為 `null`。請確保在您的函式內部正確處理空值。例如，在函式主體內部使用 `this == null` 檢查、[安全呼叫 `?.`](null-safety.md#safe-call-operator) 或 [Elvis 運算子 `?:`](null-safety.md#elvis-operator)。

在此範例中，您可以直接呼叫 `.toString()` 函式而無需檢查 `null`，因為檢查已在擴充函式內部進行：

```kotlin
fun main() {
    //sampleStart
    // Extension function on nullable Any
    fun Any?.toString(): String {
        if (this == null) return "null"
        // After null check, `this` is smart-cast to non-nullable Any
        // So this call resolves to the regular toString() function
        return toString()
    }
    
    val number: Int? = 42
    val nothing: Any? = null
    
    println(number.toString())
    // 42
    println(nothing.toString()) 
    // null
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-nullable-receiver"}

### 擴充函式還是成員函式？

由於擴充函式和成員函式呼叫具有相同的表示法，編譯器如何知道要使用哪一個？擴充函式是 _靜態分派_ 的，這表示編譯器在編譯時會根據接收者類型來決定要呼叫哪個函式。例如：

```kotlin
fun main() {
//sampleStart
    open class Shape
    class Rectangle: Shape()
    
    fun Shape.getName() = "Shape"
    fun Rectangle.getName() = "Rectangle"
    
    fun printClassName(shape: Shape) {
        println(shape.getName())
    }
    
    printClassName(Rectangle())
    // Shape
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-shape"}

在此範例中，編譯器呼叫 `Shape.getName()` 擴充函式，因為參數 `shape` 被宣告為 `Shape` 類型。由於擴充函式是靜態解析的，編譯器會根據宣告的類型（而非實際的實例）選擇函式。

因此，即使此範例傳遞了一個 `Rectangle` 實例，`.getName()` 函式仍會解析為 `Shape.getName()`，因為該變數被宣告為 `Shape` 類型。

如果一個類別有一個成員函式，並且存在一個具有相同接收者類型、相同名稱和相容引數的擴充函式，則成員函式優先。例如：

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Member function") }
    }
    
    fun Example.printFunctionType() { println("Extension function") }
    
    Example().printFunctionType()
    // Member function
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-member-function"}

然而，擴充函式可以重載與成員函式同名但 _簽名不同_ 的函式：

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Member function") }
    }
    
    // Same name but different signature
    fun Example.printFunctionType(index: Int) { println("Extension function #$index") }
    
    Example().printFunctionType(1)
    // Extension function #1
//end
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-member-function-overload"}

在此範例中，由於一個 `Int` 被傳遞給 `.printFunctionType()` 函式，編譯器選擇了擴充函式，因為它與簽名匹配。編譯器忽略了不帶引數的成員函式。

### 匿名擴充函式

您可以定義不具名稱的擴充函式。當您想要避免污染全域命名空間，或者當您需要將某些擴充行為作為參數傳遞時，這會很有用。

例如，假設您想要為一個資料類別擴充一個一次性函式來計算運費，而無需給它命名：

```kotlin
fun main() {
    //sampleStart
    data class Order(val weight: Double)
    val calculateShipping = fun Order.(rate: Double): Double = this.weight * rate
    
    val order = Order(2.5)
    val cost = order.calculateShipping(3.0)
    println("Shipping cost: $cost") 
    // Shipping cost: 7.5
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-anonymous"}

要將擴充行為作為參數傳遞，請使用帶有類型註解的 [Lambda 運算式 (lambda expression)](lambdas.md#lambda-expression-syntax)。例如，假設您想要檢查一個數字是否在範圍內，而無需定義具名函式：

```kotlin
fun main() {
    val isInRange: Int.(min: Int, max: Int) -> Boolean = { min, max -> this in min..max }

    println(5.isInRange(1, 10))
    // true
    println(20.isInRange(1, 10))
    // false
}
```
 {kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-anonymous-lambda"}

在此範例中，`isInRange` 變數保存了一個類型為 `Int.(min: Int, max: Int) -> Boolean` 的函式。該類型是 `Int` 類別上的一個擴充函式，它接受 `min` 和 `max` 參數並返回一個 `Boolean`。

Lambda 主體 `{ min, max -> this in min..max }` 檢查該函式所作用的 `Int` 值是否落在 `min` 和 `max` 參數之間的範圍內。如果檢查成功，Lambda 返回 `true`。

有關更多資訊，請參閱 [Lambda 運算式與匿名函式 (Lambda expressions and anonymous functions)](lambdas.md)。

## 擴充屬性

Kotlin 支援擴充屬性，它們對於執行資料轉換或建立 UI 顯示輔助工具非常有用，而不會使您正在處理的類別變得雜亂。

要建立擴充屬性，請寫下您要擴充的類別名稱，後面跟著 `.` 和您的屬性名稱。

例如，假設您有一個表示具有名字和姓氏的用戶的資料類別，並且您想要創建一個在存取時返回電子郵件式使用者名稱的屬性。您的程式碼可能看起來像這樣：

```kotlin
data class User(val firstName: String, val lastName: String)

// An extension property to get a username-style email handle
val User.emailUsername: String
    get() = "${firstName.lowercase()}.${lastName.lowercase()}"

fun main() {
    val user = User("Mickey", "Mouse")
    // Calls extension property
    println("Generated email username: ${user.emailUsername}")
    // Generated email username: mickey.mouse
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-property"}

由於擴充功能並未真正為類別添加成員，因此擴充屬性沒有有效的方法來擁有 [支援欄位 (backing field)](properties.md#backing-fields)。這就是為什麼擴充屬性不允許使用初始化器。您只能透過明確提供取得器 (getter) 和設定器 (setter) 來定義它們的行為。例如：

```kotlin
data class House(val streetName: String)

// Doesn't compile because there is no getter and setter
// var House.number = 1
// Error: Initializers are not allowed for extension properties

// Compiles successfully
val houseNumbers = mutableMapOf<House, Int>()
var House.number: Int
    get() = houseNumbers[this] ?: 1
    set(value) {
        println("Setting house number for ${this.streetName} to $value")
        houseNumbers[this] = value
    }

fun main() {
    val house = House("Maple Street")

    // Shows the default
    println("Default number: ${house.number} ${house.streetName}") 
    // Default number: 1 Maple Street
    
    house.number = 99
    // Setting house number for Maple Street to 99

    // Shows the updated number
    println("Updated number: ${house.number} ${house.streetName}") 
    // Updated number: 99 Maple Street
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-property-error"}

在此範例中，取得器 (getter) 使用 [Elvis 運算子](null-safety.md#elvis-operator) 來返回房號（如果它存在於 `houseNumbers` map 中）或 `1`。要了解有關如何編寫取得器和設定器的更多資訊，請參閱 [自訂取得器和設定器 (Custom getters and setters)](properties.md#custom-getters-and-setters)。

## 伴動物件擴充

如果一個類別定義了 [伴動物件 (companion object)](object-declarations.md#companion-objects)，您也可以為該伴動物件定義擴充函式和屬性。就像伴動物件的常規成員一樣，您可以僅使用類別名稱作為限定符來呼叫它們。編譯器預設將伴動物件命名為 `Companion`：

```kotlin
class Logger {
    companion object { }
}

fun Logger.Companion.logStartupMessage() {
    println("Application started.")
}

fun main() {
    Logger.logStartupMessage()
    // Application started.
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-companion-object"}

## 將擴充功能宣告為成員

您可以在一個類別內部宣告另一個類別的擴充功能。這類的擴充功能擁有多個 _隱式接收者_。隱式接收者是一個物件，您可以不使用 [`this`](this-expressions.md#qualified-this) 限定符來存取其成員：

*   您宣告擴充功能的類別是 _分派接收者_。
*   擴充函式的接收者類型是 _擴充接收者_。

考慮這個範例，其中 `Connection` 類別有一個針對 `Host` 類別的擴充函式，稱為 `printConnectionString()`：

```kotlin
class Host(val hostname: String) {
    fun printHostname() { print(hostname) }
}

class Connection(val host: Host, val port: Int) {
    fun printPort() { print(port) }

    // Host is the extension receiver
    fun Host.printConnectionString() {
        // Calls Host.printHostname()
        printHostname() 
        print(":")
        // Calls Connection.printPort()
        // Connection is the dispatch receiver
        printPort()
    }

    fun connect() {
        /*...*/
        // Calls the extension function
        host.printConnectionString() 
    }
}

fun main() {
    Connection(Host("kotl.in"), 443).connect()
    // kotl.in:443
    
    // Triggers an error because the extension function isn't available outside Connection
    // Host("kotl.in").printConnectionString()
    // Unresolved reference 'printConnectionString'.
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-members"}

此範例在 `Connection` 類別內部宣告了 `printConnectionString()` 函式，因此 `Connection` 類別是分派接收者。擴充函式的接收者類型是 `Host` 類別，因此 `Host` 類別是擴充接收者。

如果分派接收者和擴充接收者有同名成員，則擴充接收者的成員優先。要明確存取分派接收者，請使用 [限定的 `this` 語法](this-expressions.md#qualified-this)：

```kotlin
class Connection {
    fun Host.getConnectionString() {
        // Calls Host.toString()
        toString()
        // Calls Connection.toString()
        this@Connection.toString()
    }
}
```

### 覆寫成員擴充功能

您可以將成員擴充功能宣告為 `open` 並在子類別中覆寫它們，這在您想要為每個子類別自訂擴充功能的行為時很有用。編譯器對每個接收者類型有不同的處理方式：

| 接收者類型      | 解析時間 | 分派類型 |
|--------------------|-----------------|---------------|
| 分派接收者  | 執行時         | 虛擬       |
| 擴充接收者 | 編譯時    | 靜態       |

考慮這個範例，其中 `User` 類別是 `open`，而 `Admin` 類別繼承自它。`NotificationSender` 類別為 `User` 和 `Admin` 類別定義了 `sendNotification()` 擴充函式，而 `SpecialNotificationSender` 類別則覆寫了它們：

```kotlin
open class User

class Admin : User()

open class NotificationSender {
    open fun User.sendNotification() {
        println("Sending user notification from normal sender")
    }

    open fun Admin.sendNotification() {
        println("Sending admin notification from normal sender")
    }

    fun notify(user: User) {
        user.sendNotification()
    }
}

class SpecialNotificationSender : NotificationSender() {
    override fun User.sendNotification() {
        println("Sending user notification from special sender")
    }

    override fun Admin.sendNotification() {
        println("Sending admin notification from special sender")
    }
}

fun main() {
    // Dispatch receiver is NotificationSender
    // Extension receiver is User
    // Resolves to User.sendNotification() in NotificationSender
    NotificationSender().notify(User())
    // Sending user notification from normal sender
    
    // Dispatch receiver is SpecialNotificationSender
    // Extension receiver is User
    // Resolves to User.sendNotification() in SpecialNotificationSender
    SpecialNotificationSender().notify(User())
    // Sending user notification from special sender 
    
    // Dispatch receiver is SpecialNotificationSender
    // Extension receiver is User NOT Admin
    // The notify() function declares user as type User
    // Statically resolves to User.sendNotification() in SpecialNotificationSender
    SpecialNotificationSender().notify(Admin())
    // Sending user notification from special sender 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-open"}

分派接收者在執行時使用虛擬分派解析，這使得 `main()` 函式中的行為更容易理解。可能會讓您感到驚訝的是，當您在 `Admin` 實例上呼叫 `notify()` 函式時，編譯器會根據宣告的類型選擇擴充功能：`user: User`，因為它靜態解析擴充接收者。

## 擴充功能與可見性修飾符

擴充功能使用與在相同範圍內宣告的常規函式相同的 [可見性修飾符](visibility-modifiers.md)，包括宣告為其他類別成員的擴充功能。

例如，宣告在檔案頂層的擴充功能可以存取同檔案中的其他 `private` 頂層宣告：

```kotlin
// File: StringUtils.kt

private fun removeWhitespace(input: String): String {
    return input.replace("\\s".toRegex(), "")
}

fun String.cleaned(): String {
    return removeWhitespace(this)
}

fun main() {
    val rawEmail = "  user @example. com  "
    val cleaned = rawEmail.cleaned()
    println("Raw:     '$rawEmail'")
    // Raw:     '  user @example. com  '
    println("Cleaned: '$cleaned'")
    // Cleaned: 'user@example.com'
    println("Looks like an email: ${cleaned.contains("@") && cleaned.contains(".")}") 
    // Looks like an email: true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-visibility-top-level"}

如果擴充功能宣告在其接收者類型之外，則它無法存取接收者的 `private` 或 `protected` 成員：

```kotlin
class User(private val password: String) {
    fun isLoggedIn(): Boolean = true
    fun passwordLength(): Int = password.length
}

// Extension declared outside the class
fun User.isSecure(): Boolean {
    // Can't access password because it's private:
    // return password.length >= 8

    // Instead, we rely on public members:
    return passwordLength() >= 8 && isLoggedIn()
}

fun main() {
    val user = User("supersecret")
    println("Is user secure: ${user.isSecure()}") 
    // Is user secure: true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-visibility-outside-receiver"}

如果擴充功能被標記為 `internal`，則它只能在其 [模組 (module)](visibility-modifiers.md#modules) 內部存取：

```kotlin
// Networking module
// JsonParser.kt
internal fun String.parseJson(): Map<String, Any> {
    return mapOf("fakeKey" to "fakeValue")
}
```

## 擴充功能的範圍

在大多數情況下，您在頂層（直接在套件下）定義擴充功能：

```kotlin
package org.example.declarations

fun List<String>.getLongestString() { /*...*/}
```

要在其宣告套件之外使用擴充功能，請在呼叫點匯入它：

```kotlin
package org.example.usage

import org.example.declarations.getLongestString

fun main() {
    val list = listOf("red", "green", "blue")
    list.getLongestString()
}
```

有關更多資訊，請參閱 [匯入 (Imports)](packages.md#imports)。