[//]: # (title: 擴充套件)

Kotlin 的 _擴充套件_ 讓你不需要使用繼承或像 _Decorator_ 之類的設計模式，就能為類別或介面擴充新的功能。當你使用無法直接修改的第三方程式庫時，這項功能非常有用。建立後，你可以像呼叫原始類別或介面的成員一樣呼叫這些擴充套件。

最常見的擴充套件形式是 [擴充函式](#extension-functions) 和 [擴充屬性](#extension-properties)。

重要的是，擴充套件不會修改它們所擴充的類別或介面。當你定義擴充套件時，並不會加入新的成員，而是讓新的函式可被呼叫，或讓新的屬性可使用相同的語法存取。

## 接收者

擴充套件一律在接收者（receiver）上呼叫。接收者必須具有與被擴充的類別或介面相同的型別。要使用擴充套件，請在擴充套件名稱前加上接收者，後跟 `.` 以及函式或屬性名稱。

例如，來自標準程式庫的 [`.appendLine()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.text/append-line.html) 擴充函式擴充了 `StringBuilder` 類別。因此在這種情況下，接收者是一個 `StringBuilder` 執行個體，而 _接收者型別_ 是 `StringBuilder`：

```kotlin
fun main() { 
//sampleStart
    // builder 是 StringBuilder 的一個執行個體
    val builder = StringBuilder()
        // 在 builder 上呼叫 .appendLine() 擴充函式
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

在建立自己的擴充函式之前，請先查看你需要的的功能是否已在 Kotlin [標準程式庫](https://kotlinlang.org/api/core/kotlin-stdlib/) 中提供。標準程式庫為以下用途提供了許多實用的擴充函式：

* 操作集合：[`.map()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/map.html)、[`.filter()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter.html)、[`.reduce()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/reduce.html)、[`.fold()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/fold.html)、[`.groupBy()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/group-by.html)。
* 轉換為字串：[`.joinToString()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/join-to-string.html)。
* 處理 null 值：[`.filterNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter-not-null.html)。

若要建立你自己的擴充函式，請在函式名稱前加上接收者型別，後跟一個 `.`。在此範例中，`.truncate()` 函式擴充了 `String` 類別，因此接收者型別為 `String`：

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

`.truncate()` 函式會根據 `maxLength` 引數中的數值截斷呼叫它的任何字串，並加上省略號 `...`。如果字串短於 `maxLength`，該函式則傳回原始字串。

在此範例中，`.displayInfo()` 函式擴充了 `User` 介面：

```kotlin
interface User {
    val name: String
    val email: String
}

fun User.displayInfo(): String = "User(name=$name, email=$email)"

// 繼承並實作 User 介面的屬性
class RegularUser(override val name: String, override val email: String) : User

fun main() {
    val user = RegularUser("Alice", "alice@example.com")
    println(user.displayInfo()) 
    // User(name=Alice, email=alice@example.com)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-interface"}

`.displayInfo()` 函式傳回包含 `RegularUser` 執行個體的 `name` 與 `email` 的字串。當你想為所有實作某介面的型別僅一次性地加入功能時，像這樣在介面上定義擴充套件非常有用。

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

`.mostVoted()` 函式會遍歷其所呼叫之 Map 的鍵值配對，並使用 [`maxByOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/max-by-or-null.html) 函式來傳回包含最高值的配對之鍵。如果 Map 為空，`maxByOrNull()` 函式會傳回 `null`。`mostVoted()` 函式使用安全呼叫 `?.`，僅在 `maxByOrNull()` 函式傳回非 null 值時才存取 `key` 屬性。

### 泛型擴充函式

若要建立泛型擴充函式，請在函式名稱之前宣告泛型型別參數，使其在接收者型別運算式中可用。在此範例中，`.endpoints()` 函式擴充了 `List<T>`，其中 `T` 可以是任何型別：

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

`.endpoints()` 函式傳回一個包含其呼叫列表之第一個和最後一個元素的配對（Pair）。在函式主體內部，它呼叫 `first()` 和 `last()` 函式，並使用 `to` 中綴函式將它們的傳回值組合成一個 `Pair`。

有關泛型的更多資訊，請參閱 [泛型函式](generics.md)。

### 可 null 接收者

你可以定義具有可 null 接收者型別的擴充函式，這允許你在變數值為 null 的情況下仍能呼叫它們。當接收者為 `null` 時，`this` 也是 `null`。請確保在函式內部正確處理可 null 性。例如，在函式主體內使用 `this == null` 檢查、[安全呼叫 `?.`](null-safety.md#safe-call-operator) 或 [Elvis 運算子 `?:`](null-safety.md#elvis-operator)。

在此範例中，你可以直接呼叫 `.toString()` 函式而無需檢查 `null`，因為檢查已經發生在擴充函式內部：

```kotlin
fun main() {
    //sampleStart
    // 可 null Any 的擴充函式
    fun Any?.toString(): String {
        if (this == null) return "null"
        // 經過 null 檢查後，`this` 會被智慧轉換（smart-cast）為非 null Any
        // 因此此呼叫會解析為一般的 toString() 函式
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

由於擴充函式和成員函式的呼叫表示法相同，編譯器如何知道該使用哪一個？擴充函式是 _靜態地_ 分派的，這意味著編譯器在編譯期間根據接收者型別決定呼叫哪個函式。例如：

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

在此範例中，編譯器呼叫 `Shape.getName()` 擴充函式，因為參數 `shape` 被宣告為 `Shape` 型別。因為擴充函式是靜態解析的，編譯器會根據宣告的型別而非實際執行個體來選擇函式。

因此，即使範例中傳入的是 `Rectangle` 執行個體，由於變數被宣告為 `Shape` 型別，`.getName()` 函式仍會解析為 `Shape.getName()`。

如果一個類別具有成員函式，且存在一個具有相同接收者型別、相同名稱且參數相容的擴充函式，則成員函式優先。例如：

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

然而，擴充函式可以多載具有相同名稱但 _不同_ 簽章的成員函式：

```kotlin
fun main() {
//sampleStart
    class Example {
        fun printFunctionType() { println("Member function") }
    }
    
    // 名稱相同但簽章不同
    fun Example.printFunctionType(index: Int) { println("Extension function #$index") }
    
    Example().printFunctionType(1)
    // Extension function #1
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-member-function-overload"}

在此範例中，由於傳入了一個 `Int` 給 `.printFunctionType()` 函式，編譯器會選擇擴充函式，因為它符合簽章。編譯器會忽略不帶引數的成員函式。

### 匿名擴充函式

你可以定義不具名的擴充函式。這在你不想弄亂全域命名空間，或需要將某些擴充行為作為參數傳遞時非常有用。

例如，假設你想為一個資料類別擴充一個一次性的運算運費函式，但不給它起名字：

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

要將擴充行為作為參數傳遞，請使用帶有型別註解的 [Lambda 運算式](lambdas.md#lambda-expression-syntax)。例如，假設你想在不定義具名函式的情況下檢查一個數字是否在某個範圍內：

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

在此範例中，`isInRange` 變數持有型別為 `Int.(min: Int, max: Int) -> Boolean` 的函式。該型別是 `Int` 類別上的擴充函式，接受 `min` 和 `max` 參數並傳回 `Boolean`。

Lambda 主體 `{ min, max -> this in min..max }` 會檢查呼叫該函式的 `Int` 值是否落在 `min` 和 `max` 參數之間的範圍內。如果檢查成功，Lambda 會傳回 `true`。

欲了解更多資訊，請參閱 [Lambda 運算式與匿名函式](lambdas.md)。

## 擴充屬性

Kotlin 支援擴充屬性，這對於執行資料轉換或建立 UI 顯示輔助工具非常有用，且不會弄亂你正在處理的類別。

要建立擴充屬性，請寫下你想要擴充的類別名稱，後跟一個 `.` 和你的屬性名稱。

例如，假設你有一個代表使用者（包含名字和姓氏）的資料類別，並且你想建立一個在存取時傳回電子郵件樣式使用者名稱的屬性。你的程式碼可能如下所示：

```kotlin
data class User(val firstName: String, val lastName: String)

// 取得使用者名稱樣式電子郵件帳號的擴充屬性
val User.emailUsername: String
    get() = "${firstName.lowercase()}.${lastName.lowercase()}"

fun main() {
    val user = User("Mickey", "Mouse")
    // 呼叫擴充屬性
    println("Generated email username: ${user.emailUsername}")
    // Generated email username: mickey.mouse
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-property"}

由於擴充套件實際上並未向類別加入成員，因此擴充屬性沒有有效的方法來擁有 [支援欄位](properties.md#backing-fields)。這就是為什麼擴充屬性不允許使用初始設定式的原因。你只能透過明確提供 getter 和 setter 來定義它們的行為。例如：

```kotlin
data class House(val streetName: String)

// 無法編譯，因為沒有 getter 和 setter
// var House.number = 1
// Error: Initializers are not allowed for extension properties

// 編譯成功
val houseNumbers = mutableMapOf<House, Int>()
var House.number: Int
    get() = houseNumbers[this] ?: 1
    set(value) {
        println("Setting house number for ${this.streetName} to $value")
        houseNumbers[this] = value
    }

fun main() {
    val house = House("Maple Street")

    // 顯示預設值
    println("Default number: ${house.number} ${house.streetName}") 
    // Default number: 1 Maple Street
    
    house.number = 99
    // Setting house number for Maple Street to 99

    // 顯示更新後的號碼
    println("Updated number: ${house.number} ${house.streetName}") 
    // Updated number: 99 Maple Street
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-property-error"}

在此範例中，getter 使用 [Elvis 運算子](null-safety.md#elvis-operator)，如果 `houseNumbers` 地圖中存在門牌號碼則傳回該號碼，否則傳回 `1`。欲了解更多有關如何編寫 getter 和 setter 的資訊，請參閱 [自訂 getter 與 setter](properties.md#custom-getters-and-setters)。

## 伴隨物件擴充套件

如果類別定義了 [伴隨物件](object-declarations.md#companion-objects)，你也可以為伴隨物件定義擴充函式和屬性。就像伴隨物件的一般成員一樣，你可以僅使用類別名稱作為限定符來呼叫它們。編譯器預設將伴隨物件命名為 `Companion`：

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

## 將擴充套件宣告為成員

你可以在一個類別內部為另一個類別宣告擴充套件。像這樣的擴充套件具有多個 _隱含接收者_。隱含接收者是一個物件，你可以在不使用 [`this`](this-expressions.md#qualified-this) 限定的情況下存取其成員：

* 宣告擴充套件的類別是 _分派接收者（dispatch receiver）_。
* 擴充函式的接收者型別是 _擴充接收者（extension receiver）_。

請考慮以下範例，其中 `Connection` 類別為 `Host` 類別提供了一個名為 `printConnectionString()` 的擴充函式：

```kotlin
class Host(val hostname: String) {
    fun printHostname() { print(hostname) }
}

class Connection(val host: Host, val port: Int) {
    fun printPort() { print(port) }

    // Host 是擴充接收者
    fun Host.printConnectionString() {
        // 呼叫 Host.printHostname()
        printHostname() 
        print(":")
        // 呼叫 Connection.printPort()
        // Connection 是分派接收者
        printPort()
    }

    fun connect() {
        /*...*/
        // 呼叫擴充函式
        host.printConnectionString() 
    }
}

fun main() {
    Connection(Host("kotl.in"), 443).connect()
    // kotl.in:443
    
    // 會觸發錯誤，因為擴充函式在 Connection 外部不可用
    // Host("kotl.in").printConnectionString()
    // Unresolved reference 'printConnectionString'.
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-function-members"}

此範例在 `Connection` 類別內部宣告了 `printConnectionString()` 函式，因此 `Connection` 類別是分派接收者。擴充函式的接收者型別是 `Host` 類別，因此 `Host` 類別是擴充接收者。

如果分派接收者和擴充接收者具有同名的成員，則擴充接收者的成員優先。若要明確存取分派接收者，請使用 [限定的 `this` 語法](this-expressions.md#qualified-this)：

```kotlin
class Connection {
    fun Host.getConnectionString() {
        // 呼叫 Host.toString()
        toString()
        // 呼叫 Connection.toString()
        this@Connection.toString()
    }
}
```

### 覆寫成員擴充套件

你可以將成員擴充套件宣告為 `open`，並在子類別中覆寫它們，這在你想要為每個子類別自訂擴充行為時非常有用。編譯器對每種接收者型別的處理方式不同：

| 接收者型別      | 解析時間 | 分派型別 |
|--------------------|-----------------|---------------|
| 分派接收者  | 執行時         | 虛擬       |
| 擴充接收者 | 編譯時    | 靜態        |

請考慮以下範例，其中 `User` 類別是 `open` 的，而 `Admin` 類別繼承自它。`NotificationSender` 類別為 `User` 和 `Admin` 類別定義了 `sendNotification()` 擴充函式，而 `SpecialNotificationSender` 類別則覆寫了它們：

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
    // 分派接收者是 NotificationSender
    // 擴充接收者是 User
    // 解析為 NotificationSender 中的 User.sendNotification()
    NotificationSender().notify(User())
    // Sending user notification from normal sender
    
    // 分派接收者是 SpecialNotificationSender
    // 擴充接收者是 User
    // 解析為 SpecialNotificationSender 中的 User.sendNotification()
    SpecialNotificationSender().notify(User())
    // Sending user notification from special sender 
    
    // 分派接收者是 SpecialNotificationSender
    // 擴充接收者是 User 而非 Admin
    // notify() 函式將 user 宣告為 User 型別
    // 靜態解析為 SpecialNotificationSender 中的 User.sendNotification()
    SpecialNotificationSender().notify(Admin())
    // Sending user notification from special sender 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-open"}

分派接收者是在執行時使用虛擬分派（virtual dispatch）解析的，這使得 `main()` 函式中的行為更容易理解。可能會讓你感到驚訝的是，當你在 `Admin` 執行個體上呼叫 `notify()` 函式時，編譯器會根據宣告的型別 `user: User` 來選擇擴充套件，因為它會靜態解析擴充接收者。

## 擴充套件與可見性修飾符

擴充套件使用與在相同作用域內宣告的一般函式相同的 [可見性修飾符](visibility-modifiers.md)，這包括宣告為其他類別成員的擴充套件。

例如，在檔案頂層宣告的擴充套件可以存取同一個檔案中的其他 `private` 頂層宣告：

```kotlin
// 檔案：StringUtils.kt

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

而如果擴充套件是在其接收者型別之外宣告的，則無法存取該接收者的 `private` 或 `protected` 成員：

```kotlin
class User(private val password: String) {
    fun isLoggedIn(): Boolean = true
    fun passwordLength(): Int = password.length
}

// 在類別外宣告的擴充套件
fun User.isSecure(): Boolean {
    // 無法存取 password，因為它是 private 的：
    // return password.length >= 8

    // 相反地，我們依賴公開成員：
    return passwordLength() >= 8 && isLoggedIn()
}

fun main() {
    val user = User("supersecret")
    println("Is user secure: ${user.isSecure()}") 
    // Is user secure: true
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-extension-visibility-outside-receiver"}

如果擴充套件被標記為 `internal`，則僅在其 [模組](visibility-modifiers.md#modules) 內可存取：

```kotlin
// Networking 模組
// JsonParser.kt
internal fun String.parseJson(): Map<String, Any> {
    return mapOf("fakeKey" to "fakeValue")
}
```

## 擴充套件的作用域

在大多數情況下，你會在頂層直接於套件下定義擴充套件：

```kotlin
package org.example.declarations

fun List<String>.getLongestString() { /*...*/}
```

要在宣告它的套件之外使用擴充套件，請在呼叫處將其匯入：

```kotlin
package org.example.usage

import org.example.declarations.getLongestString

fun main() {
    val list = listOf("red", "green", "blue")
    list.getLongestString()
}
```

欲了解更多資訊，請參閱 [匯入](packages.md#imports)。