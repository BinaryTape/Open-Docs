[//]: # (title: 物件宣告與物件表達式)

在 Kotlin 中，物件讓您能夠在單一步驟中定義類別並建立其實例。
當您需要可重複使用的單例 (singleton) 實例或一次性物件時，這會很有用。
為處理這些情境，Kotlin 提供了兩種關鍵方法：用於建立單例的 _物件宣告 (object declarations)_ 和用於建立匿名、一次性物件的 _物件表達式 (object expressions)_。

> 單例模式 (Singleton) 確保某個類別只有一個實例，並提供一個全域的存取點。
> 
{style="tip"}

物件宣告與物件表達式最適用於以下情境：

*   **使用單例來共享資源：** 您需要確保應用程式中某個類別只有一個實例存在。
    例如，管理資料庫連線池。
*   **建立工廠方法：** 您需要一種便捷有效的方式來建立實例。
    [伴隨物件 (Companion objects)](#companion-objects) 允許您定義與類別相關的類別層級函數和屬性，從而簡化這些實例的建立和管理。
*   **暫時修改現有類別行為：** 您希望修改現有類別的行為，而無需建立新的子類別。
    例如，為特定操作向物件添加臨時功能。
*   **需要型別安全設計：** 您需要使用物件表達式來一次性實作介面 (interfaces) 或 [抽象類別 (abstract classes)](classes.md#abstract-classes)。
    這對於像按鈕點擊處理器 (button click handler) 這樣的情境很有用。

## 物件宣告
{id="object-declarations-overview"}

您可以使用物件宣告在 Kotlin 中建立物件的單一實例，物件宣告在 `object` 關鍵字後總是有一個名稱。
這讓您能夠在單一步驟中定義類別並建立其一個實例，這對於實作單例很有用：

```kotlin
//sampleStart
// Declares a Singleton object to manage data providers
object DataProviderManager {
    private val providers = mutableListOf<DataProvider>()

    // Registers a new data provider
    fun registerDataProvider(provider: DataProvider) {
        providers.add(provider)
    }

    // Retrieves all registered data providers
    val allDataProviders: Collection<DataProvider> 
        get() = providers
}
//sampleEnd

// Example data provider interface
interface DataProvider {
    fun provideData(): String
}

// Example data provider implementation
class ExampleDataProvider : DataProvider {
    override fun provideData(): String {
        return "Example data"
    }
}

fun main() {
    // Creates an instance of ExampleDataProvider
    val exampleProvider = ExampleDataProvider()

    // To refer to the object, use its name directly
    DataProviderManager.registerDataProvider(exampleProvider)

    // Retrieves and prints all data providers
    println(DataProviderManager.allDataProviders.map { it.provideData() })
    // [Example data]
}
```
{kotlin-runnable="true" id="object-declaration-register-provider"}

> 物件宣告的初始化是執行緒安全的 (thread-safe)，並在首次存取時完成。
>
{style="tip"}

若要引用 (refer to) 該 `object`，請直接使用其名稱：

```kotlin
DataProviderManager.registerDataProvider(exampleProvider)
```

物件宣告也可以有超型別 (supertypes)，
類似於 [匿名物件如何從現有類別繼承或實作介面](#inherit-anonymous-objects-from-supertypes)：

```kotlin
object DefaultListener : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
}
```

與變數宣告一樣，物件宣告不是表達式 (expressions)，因此它們不能用於賦值語句的右側：

```kotlin
// Syntax error: An object expression cannot bind a name.
val myObject = object MySingleton {
    val name = "Singleton"
}
```
物件宣告不能是局部的 (local)，這表示它們不能直接嵌套在函數內部。
然而，它們可以嵌套在其他物件宣告或非內部類別中。

### 資料物件 (Data objects)

在 Kotlin 中列印一個普通的物件宣告時，字串表示形式包含其名稱和 `object` 的雜湊值：

```kotlin
object MyObject

fun main() {
    println(MyObject) 
    // MyObject@hashcode
}
```
{kotlin-runnable="true" id="object-declaration-plain"}

然而，透過使用 `data` 修飾符標記物件宣告，
您可以指示編譯器在呼叫 `toString()` 時返回物件的實際名稱，這與 [資料類別 (data classes)](data-classes.md) 的工作方式相同：

```kotlin
data object MyDataObject {
    val number: Int = 3
}

fun main() {
    println(MyDataObject) 
    // MyDataObject
}
```
{kotlin-runnable="true" id="object-declaration-dataobject"}

此外，編譯器會為您的 `data object` 產生多個函數：

*   `toString()` 返回資料物件的名稱
*   `equals()`/`hashCode()` 啟用相等性檢查和基於雜湊的集合

  > 您不能為 `data object` 提供自訂的 `equals` 或 `hashCode` 實作。
  >
  {style="note"}

`data object` 的 `equals()` 函數確保所有具有您的 `data object` 型別的物件都被視為相等。
在大多數情況下，由於 `data object` 宣告了一個單例，因此在執行時您只會有一個 `data object` 的實例。
然而，在執行時產生同類型另一個物件的邊緣情況下（例如，透過使用 `java.lang.reflect` 的平台反射 (platform reflection) 或底層使用此 API 的 JVM 序列化庫），這確保了這些物件被視為相等。

> 確保您只以結構方式（使用 `==` 運算符）比較 `data object`，而不要透過引用（使用 `===` 運算符）進行比較。
> 這有助於避免在執行時存在多個資料物件實例時的陷阱。
>
{style="warning"}

```kotlin
import java.lang.reflect.Constructor

data object MySingleton

fun main() {
    val evilTwin = createInstanceViaReflection()

    println(MySingleton) 
    // MySingleton

    println(evilTwin) 
    // MySingleton

    // Even when a library forcefully creates a second instance of MySingleton, 
    // its equals() function returns true:
    println(MySingleton == evilTwin) 
    // true

    // Don't compare data objects using ===
    println(MySingleton === evilTwin) 
    // false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlin reflection does not permit the instantiation of data objects.
    // This creates a new MySingleton instance "by force" (using Java platform reflection)
    // Don't do this yourself!
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

所產生的 `hashCode()` 函數的行為與 `equals()` 函數一致，因此 `data object` 的所有執行時實例都具有相同的雜湊碼。

#### 資料物件與資料類別之間的差異

雖然 `data object` 和 `data class` 宣告經常用在一起並且有一些相似之處，但對於 `data object` 來說，有一些函數不會被產生：

*   沒有 `copy()` 函數。由於 `data object` 宣告旨在用作單例，因此不會產生 `copy()` 函數。單例限制了類別的實例化為單一實例，而允許建立實例的副本將會違反此限制。
*   沒有 `componentN()` 函數。與 `data class` 不同，`data object` 沒有任何資料屬性。
    由於嘗試解構 (destructure) 此類沒有資料屬性的物件沒有意義，因此不會產生 `componentN()` 函數。

#### 將資料物件與密封層級 (sealed hierarchies) 結合使用

資料物件宣告對於如 [密封類別 (sealed classes) 或密封介面 (sealed interfaces)](sealed-classes.md) 等密封層級特別有用。
它們允許您與可能定義的任何資料類別保持對稱。

在此範例中，將 `EndOfFile` 宣告為 `data object` 而不是普通的 `object`
意味著它將獲得 `toString()` 函數，而無需手動覆寫它：

```kotlin
sealed interface ReadResult
data class Number(val number: Int) : ReadResult
data class Text(val text: String) : ReadResult
data object EndOfFile : ReadResult

fun main() {
    println(Number(7)) 
    // Number(number=7)
    println(EndOfFile) 
    // EndOfFile
}
```
{kotlin-runnable="true" id="data-objects-sealed-hierarchies"}

### 伴隨物件 (Companion objects)

_伴隨物件 (Companion objects)_ 允許您定義類別層級的函數和屬性。
這使得建立工廠方法 (factory methods)、保存常數和存取共用工具變得容易。

類別內的物件宣告可以使用 `companion` 關鍵字標記：

```kotlin
class MyClass {
    companion object Factory {
        fun create(): MyClass = MyClass()
    }
}
```

`companion object` 的成員可以透過簡單地使用類別名稱作為限定符來呼叫：

```kotlin
class User(val name: String) {
    // Defines a companion object that acts as a factory for creating User instances
    companion object Factory {
        fun create(name: String): User = User(name)
    }
}

fun main(){
    // Calls the companion object's factory method using the class name as the qualifier. 
    // Creates a new User instance
    val userInstance = User.create("John Doe")
    println(userInstance.name)
    // John Doe
}
```
{kotlin-runnable="true" id="object-expression-companion-object"}

`companion object` 的名稱可以省略，在這種情況下將使用名稱 `Companion`：

```kotlin
class User(val name: String) {
    // Defines a companion object without a name
    companion object { }
}

// Accesses the companion object
val companionUser = User.Companion
```

類別成員可以存取其對應 `companion object` 的 `private` 成員：

```kotlin
class User(val name: String) {
    companion object {
        private val defaultGreeting = "Hello"
    }

    fun sayHi() {
        println(defaultGreeting)
    }
}
User("Nick").sayHi()
// Hello
```

當單獨使用類別名稱時，它充當對該類別的伴隨物件的引用，
無論該伴隨物件是否被命名：

```kotlin
//sampleStart
class User1 {
    // Defines a named companion object
    companion object Named {
        fun show(): String = "User1's Named Companion Object"
    }
}

// References the companion object of User1 using the class name
val reference1 = User1

class User2 {
    // Defines an unnamed companion object
    companion object {
        fun show(): String = "User2's Companion Object"
    }
}

// References the companion object of User2 using the class name
val reference2 = User2
//sampleEnd

fun main() {
    // Calls the show() function from the companion object of User1
    println(reference1.show()) 
    // User1's Named Companion Object

    // Calls the show() function from the companion object of User2
    println(reference2.show()) 
    // User2's Companion Object
}
```
{kotlin-runnable="true" id="object-expression-companion-object-names"}

儘管 Kotlin 中伴隨物件的成員看起來像是其他語言中的靜態成員，
但它們實際上是伴隨物件的實例成員，這意味著它們屬於物件本身。
這允許伴隨物件實作介面：

```kotlin
interface Factory<T> {
    fun create(name: String): T
}

class User(val name: String) {
    // Defines a companion object that implements the Factory interface
    companion object : Factory<User> {
        override fun create(name: String): User = User(name)
    }
}

fun main() {
    // Uses the companion object as a Factory
    val userFactory: Factory<User> = User
    val newUser = userFactory.create("Example User")
    println(newUser.name)
    // Example User
}
```
{kotlin-runnable="true" id="object-expression-factory"}

然而，在 JVM 上，如果您使用 `@JvmStatic` 註解，伴隨物件的成員可以被生成為真正的靜態方法和欄位。
有關詳細資訊，請參閱 [Java 互操作性 (Java interoperability)](java-to-kotlin-interop.md#static-fields) 部分。

## 物件表達式 (Object expressions)

物件表達式宣告一個類別並建立該類別的一個實例，但沒有命名它們。
這些類別對於一次性使用很有用。它們可以從頭開始建立，繼承現有類別，或實作介面。這些類別的實例也稱為 _匿名物件 (anonymous objects)_，因為它們由表達式定義，而不是名稱。

### 從頭開始建立匿名物件

物件表達式以 `object` 關鍵字開頭。

如果物件沒有擴展任何類別或實作任何介面，您可以在 `object` 關鍵字後面的大括號內直接定義物件的成員：

```kotlin
fun main() {
//sampleStart
    val helloWorld = object {
        val hello = "Hello"
        val world = "World"
        // Object expressions extend the Any class, which already has a toString() function,
        // so it must be overridden
        override fun toString() = "$hello $world"
    }

    print(helloWorld)
    // Hello World
//sampleEnd
}
```
{kotlin-runnable="true" id="object-expression-object"}

### 匿名物件從超型別繼承

若要建立從某些型別繼承的匿名物件（或多個型別），請在 `object` 後面和冒號 `:` 後指定該型別。
然後像您 [繼承](inheritance.md) 它一樣，實作或覆寫該類別的成員：

```kotlin
window.addMouseListener(object : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { /*...*/ }

    override fun mouseEntered(e: MouseEvent) { /*...*/ }
})
```

如果超型別有建構函數，請將適當的建構函數參數傳遞給它。
多個超型別可以透過逗號分隔，在冒號後指定：

```kotlin
//sampleStart
// Creates an open class BankAccount with a balance property
open class BankAccount(initialBalance: Int) {
    open val balance: Int = initialBalance
}

// Defines an interface Transaction with an execute() function
interface Transaction {
    fun execute()
}

// A function to perform a special transaction on a BankAccount
fun specialTransaction(account: BankAccount) {
    // Creates an anonymous object that inherits from the BankAccount class and implements the Transaction interface
    // The balance of the provided account is passed to the BankAccount superclass constructor
    val temporaryAccount = object : BankAccount(account.balance), Transaction {

        override val balance = account.balance + 500  // Temporary bonus

        // Implements the execute() function from the Transaction interface
        override fun execute() {
            println("Executing special transaction. New balance is $balance.")
        }
    }
    // Executes the transaction
    temporaryAccount.execute()
}
//sampleEnd
fun main() {
    // Creates a BankAccount with an initial balance of 1000
    val myAccount = BankAccount(1000)
    // Performs a special transaction on the created account
    specialTransaction(myAccount)
    // Executing special transaction. New balance is 1500.
}
```
{kotlin-runnable="true" id="object-expression-anonymous-object"}

### 使用匿名物件作為回傳和值型別

當您從局部 (local) 或 [`private`](visibility-modifiers.md#packages) 函數或屬性回傳匿名物件時，
該匿名物件的所有成員都可以透過該函數或屬性存取：

```kotlin
//sampleStart
class UserPreferences {
    private fun getPreferences() = object {
        val theme: String = "Dark"
        val fontSize: Int = 14
    }

    fun printPreferences() {
        val preferences = getPreferences()
        println("Theme: ${preferences.theme}, Font Size: ${preferences.fontSize}")
    }
}
//sampleEnd

fun main() {
    val userPreferences = UserPreferences()
    userPreferences.printPreferences()
    // Theme: Dark, Font Size: 14
}
```
{kotlin-runnable="true" id="object-expression-object-return"}

這允許您回傳具有特定屬性的匿名物件，
提供一種簡單的方式來封裝資料或行為，而無需建立單獨的類別。

如果回傳匿名物件的函數或屬性具有 `public`、`protected` 或 `internal` 可見性 (visibility)，其實際型別為：

*   `Any`，如果匿名物件沒有宣告的超型別。
*   匿名物件的宣告超型別，如果只有一個此類別型。
*   如果有多個宣告的超型別，則為明確宣告的型別。

在所有這些情況下，匿名物件中新增的成員都不可存取。如果覆寫的成員在函數或屬性的實際型別中宣告，則它們是可存取的。例如：

```kotlin
//sampleStart
interface Notification {
    // Declares notifyUser() in the Notification interface
    fun notifyUser()
}

interface DetailedNotification

class NotificationManager {
    // The return type is Any. The message property is not accessible.
    // When the return type is Any, only members of the Any class are accessible.
    fun getNotification() = object {
        val message: String = "General notification"
    }

    // The return type is Notification because the anonymous object implements only one interface
    // The notifyUser() function is accessible because it is part of the Notification interface
    // The message property is not accessible because it is not declared in the Notification interface
    fun getEmailNotification() = object : Notification {
        override fun notifyUser() {
            println("Sending email notification")
        }
        val message: String = "You've got mail!"
    }

    // The return type is DetailedNotification. The notifyUser() function and the message property are not accessible
    // Only members declared in the DetailedNotification interface are accessible
    fun getDetailedNotification(): DetailedNotification = object : Notification, DetailedNotification {
        override fun notifyUser() {
            println("Sending detailed notification")
        }
        val message: String = "Detailed message content"
    }
}
//sampleEnd
fun main() {
    // This produces no output
    val notificationManager = NotificationManager()

    // The message property is not accessible here because the return type is Any
    // This produces no output
    val notification = notificationManager.getNotification()

    // The notifyUser() function is accessible
    // The message property is not accessible here because the return type is Notification
    val emailNotification = notificationManager.getEmailNotification()
    emailNotification.notifyUser()
    // Sending email notification

    // The notifyUser() function and message property are not accessible here because the return type is DetailedNotification
    // This produces no output
    val detailedNotification = notificationManager.getDetailedNotification()
}
```
{kotlin-runnable="true" id="object-expression-object-override"}

### 從匿名物件存取變數

物件表達式主體內的程式碼可以存取封閉範圍 (enclosing scope) 中的變數：

```kotlin
import java.awt.event.MouseAdapter
import java.awt.event.MouseEvent

fun countClicks(window: JComponent) {
    var clickCount = 0
    var enterCount = 0

    // MouseAdapter provides default implementations for mouse event functions
    // Simulates MouseAdapter handling mouse events
    window.addMouseListener(object : MouseAdapter() {
        override fun mouseClicked(e: MouseEvent) {
            clickCount++
        }

        override fun mouseEntered(e: MouseEvent) {
            enterCount++
        }
    })
    // The clickCount and enterCount variables are accessible within the object expression
}
```

## 物件宣告與表達式之間的行為差異

物件宣告與物件表達式之間存在初始化行為差異：

*   物件表達式在它們被使用的地方 _立即_ 執行（並初始化）。
*   物件宣告在首次存取時 _延遲_ 初始化。
*   伴隨物件在對應的類別載入（解析）時初始化，這與 Java 靜態初始化器的語義相符。