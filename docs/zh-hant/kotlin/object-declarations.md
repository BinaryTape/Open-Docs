---
title: 物件宣告與表達式
---
在 Kotlin 中，物件（objects）允許你定義一個類別（class）並在單一步驟中建立它的實例（instance）。
當你需要一個可重複使用的單例（singleton）實例或一次性物件時，這非常有用。
為了處理這些情況，Kotlin 提供了兩種主要方法：用於建立單例的_物件宣告（object declarations）_和用於建立匿名、一次性物件的_物件表達式（object expressions）_。

:::tip
單例確保一個類別只有一個實例，並提供對它的全局存取點。

:::

物件宣告和物件表達式最適合以下情況：

* **使用單例來共享資源：** 你需要確保在整個應用程式中只存在一個類別的實例。
  例如，管理一個資料庫連線池。
* **建立工廠方法：** 你需要一種方便的方式來有效率地建立實例。
  [伴生物件（Companion objects）](#companion-objects)允許你定義與類別相關聯的類別級別（class-level）函數和屬性，從而簡化這些實例的建立和管理。
* **暫時修改現有類別的行為：** 你想要修改現有類別的行為，而無需建立新的子類別。
  例如，為特定操作向物件添加臨時功能。
* **需要類型安全（Type-safe）設計：** 你需要使用物件表達式來實現介面或[抽象類別（abstract classes）](classes#abstract-classes)的一次性實作。
  這對於諸如按鈕點擊處理器之類的情況非常有用。

## 物件宣告

你可以使用物件宣告在 Kotlin 中建立物件的單一實例，物件宣告始終在 `object` 關鍵字後跟一個名稱。
這允許你定義一個類別並在單一步驟中建立它的實例，這對於實作單例非常有用：

```kotlin

// 宣告一個 Singleton 物件來管理數據提供者
object DataProviderManager {
    private val providers = mutableListOf<DataProvider>()

    // 註冊一個新的數據提供者
    fun registerDataProvider(provider: DataProvider) {
        providers.add(provider)
    }

    // 檢索所有已註冊的數據提供者
    val allDataProviders: Collection<DataProvider> 
        get() = providers
}

// 範例數據提供者介面
interface DataProvider {
    fun provideData(): String
}

// 範例數據提供者實作
class ExampleDataProvider : DataProvider {
    override fun provideData(): String {
        return "Example data"
    }
}

fun main() {
    // 建立 ExampleDataProvider 的一個實例
    val exampleProvider = ExampleDataProvider()

    // 若要參照該物件，請直接使用其名稱
    DataProviderManager.registerDataProvider(exampleProvider)

    // 檢索並印出所有數據提供者
    println(DataProviderManager.allDataProviders.map { it.provideData() })
    // [Example data]
}
```

:::tip
物件宣告的初始化是線程安全（thread-safe）的，並且在首次存取時完成。

:::

若要參照 `object`，請直接使用其名稱：

```kotlin
DataProviderManager.registerDataProvider(exampleProvider)
```

物件宣告也可以具有超類型（supertypes），
類似於[匿名物件如何從現有類別繼承或實作介面](#inherit-anonymous-objects-from-supertypes)：

```kotlin
object DefaultListener : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
}
```

與變數宣告類似，物件宣告不是表達式，因此它們不能在賦值語句的右側使用：

```kotlin
// 語法錯誤：物件表達式不能綁定名稱。
val myObject = object MySingleton {
val name = "Singleton"
}
```
物件宣告不能是局部的（local），這意味著它們不能直接嵌套在函數內部。
但是，它們可以嵌套在其他物件宣告或非內部類別（non-inner classes）中。

### 數據物件（Data objects）

在 Kotlin 中印出一個普通物件宣告時，字串表示形式同時包含其名稱和 `object` 的雜湊值（hash）：

```kotlin
object MyObject

fun main() {
    println(MyObject) 
    // MyObject@hashcode
}
```

但是，通過使用 `data` 修飾符標記一個物件宣告，
你可以指示編譯器在調用 `toString()` 時傳回物件的實際名稱，這與[數據類別（data classes）](data-classes)的工作方式相同：

```kotlin
data object MyDataObject {
    val number: Int = 3
}

fun main() {
    println(MyDataObject) 
    // MyDataObject
}
```

此外，編譯器會為你的 `data object` 產生多個函數：

* `toString()` 傳回數據物件的名稱
* `equals()`/`hashCode()` 啟用相等性檢查和基於雜湊的集合

  > 你不能為 `data object` 提供自定義的 `equals` 或 `hashCode` 實作。
  >
  

`data object` 的 `equals()` 函數確保具有 `data object` 類型的所有物件都被視為相等。
在大多數情況下，你將在運行時（runtime）只有一個 `data object` 的實例，因為 `data object` 宣告一個單例。
但是，在運行時產生相同類型（type）的另一個物件的邊緣情況下（例如，通過使用具有 `java.lang.reflect` 的平台反射（platform reflection）或在底層使用此 API 的 JVM 序列化庫（JVM serialization library）），這確保了這些物件被視為相等。

:::caution
確保你僅以結構方式（使用 `==` 運算符）比較 `data objects`，而永遠不要按參照（使用 `===` 運算符）比較。
這有助於你避免在運行時存在多個數據物件實例時出現的陷阱。

:::

```kotlin
import java.lang.reflect.Constructor

data object MySingleton

fun main() {
    val evilTwin = createInstanceViaReflection()

    println(MySingleton) 
    // MySingleton

    println(evilTwin) 
    // MySingleton

    // 即使庫強制創建了 MySingleton 的第二個實例，
    // 其 equals() 函數也會傳回 true：
    println(MySingleton == evilTwin) 
    // true

    // 不要使用 === 比較數據物件
    println(MySingleton === evilTwin) 
    // false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlin 反射不允許實例化數據物件。
    // 這會「強制」創建一個新的 MySingleton 實例（使用 Java 平台反射）
    // 不要自己這樣做！
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

產生的 `hashCode()` 函數具有與 `equals()` 函數一致的行為，因此 `data object` 的所有運行時實例都具有相同的雜湊碼（hash code）。

#### 數據物件和數據類別之間的差異

雖然 `data object` 和 `data class` 宣告經常一起使用並且有一些相似之處，但有些函數不會為 `data object` 產生：

* 沒有 `copy()` 函數。因為 `data object` 宣告旨在用作單例，所以不會產生 `copy()` 函數。單例將類別的實例化限制為單一實例，如果允許創建實例的副本，則會違反此限制。
* 沒有 `componentN()` 函數。與 `data class` 不同，`data object` 沒有任何數據屬性。由於嘗試解構沒有數據屬性的物件是沒有意義的，因此不會產生 `componentN()` 函數。

#### 將數據物件與密封層級結構（sealed hierarchies）一起使用

數據物件宣告對於密封層級結構特別有用，例如
[密封類別或密封介面（sealed interfaces）](sealed-classes)。
它們允許你與可能已定義的任何數據類別保持對稱性。

在此範例中，將 `EndOfFile` 宣告為 `data object` 而不是普通 `object`
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

### 伴生物件

_伴生物件（Companion objects）_允許你定義類別級別的函數和屬性。
這使得建立工廠方法、保存常數和存取共享實用程式變得容易。

類別內部的物件宣告可以使用 `companion` 關鍵字標記：

```kotlin
class MyClass {
    companion object Factory {
        fun create(): MyClass = MyClass()
    }
}
```

可以僅通過使用類別名稱作為限定符（qualifier）來調用 `companion object` 的成員：

```kotlin
class User(val name: String) {
    // 定義一個伴生物件，它充當創建 User 實例的工廠
    companion object Factory {
        fun create(name: String): User = User(name)
    }
}

fun main(){
    // 使用類別名稱作為限定符來調用伴生物件的工廠方法。
    // 創建一個新的 User 實例
    val userInstance = User.create("John Doe")
    println(userInstance.name)
    // John Doe
}
```

可以省略 `companion object` 的名稱，在這種情況下，將使用名稱 `Companion`：

```kotlin
class User(val name: String) {
    // 定義一個沒有名稱的伴生物件
    companion object { }
}

// 存取伴生物件
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

當類別名稱單獨使用時，它會充當對類別的伴生物件的引用，
無論伴生物件是否已命名：

```kotlin

class User1 {
    // 定義一個已命名的伴生物件
    companion object Named {
        fun show(): String = "User1's Named Companion Object"
    }
}

// 使用類別名稱引用 User1 的伴生物件
val reference1 = User1

class User2 {
    // 定義一個未命名的伴生物件
    companion object {
        fun show(): String = "User2's Companion Object"
    }
}

// 使用類別名稱引用 User2 的伴生物件
val reference2 = User2

fun main() {
    // 從 User1 的伴生物件調用 show() 函數
    println(reference1.show()) 
    // User1's Named Companion Object

    // 從 User2 的伴生物件調用 show() 函數
    println(reference2.show()) 
    // User2's Companion Object
}
```

雖然 Kotlin 中伴生物件的成員看起來像其他語言中的靜態（static）成員，
但它們實際上是伴生物件的實例成員，這意味著它們屬於物件本身。
這允許伴生物件實作介面：

```kotlin
interface Factory<T> {
    fun create(name: String): T
}

class User(val name: String) {
    // 定義一個實作 Factory 介面的伴生物件
    companion object : Factory<User> {
        override fun create(name: String): User = User(name)
    }
}

fun main() {
    // 將伴生物件用作工廠
    val userFactory: Factory<User> = User
    val newUser = userFactory.create("Example User")
    println(newUser.name)
    // Example User
}
```

但是，在 JVM 上，如果使用 `@JvmStatic` 注釋，則可以將伴生物件的成員生成為真正的靜態方法和字段。
有關更多詳細資訊，請參閱 [Java 互操作性](java-to-kotlin-interop#static-fields) 部分。

## 物件表達式

物件表達式宣告一個類別並創建該類別的一個實例，但不會命名它們中的任何一個。
這些類別對於一次性使用非常有用。它們可以從頭創建，從現有類別繼承，
或實作介面。這些類別的實例也稱為_匿名物件（anonymous objects）_，因為它們是由表達式定義的，而不是由名稱定義的。

### 從頭創建匿名物件

物件表達式以 `object` 關鍵字開頭。

如果物件沒有擴展任何類別或實作介面，則可以在 `object` 關鍵字後面的大括號內直接定義物件的成員：

```kotlin
fun main() {

    val helloWorld = object {
        val hello = "Hello"
        val world = "World"
        // 物件表達式擴展了 Any 類別，該類別已經有一個 toString() 函數，
        // 因此必須覆寫它
        override fun toString() = "$hello $world"
    }

    print(helloWorld)
    // Hello World

}
```

### 從超類型繼承匿名物件

若要創建從某種類型（或多種類型）繼承的匿名物件，請在 `object` 和
冒號 `:` 後面指定此類型。然後像從它[繼承](inheritance)一樣實作或覆寫此類別的成員：

```kotlin
window.addMouseListener(object : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { /*...*/ }

    override fun mouseEntered(e: MouseEvent) { /*...*/ }
})
```

如果超類型有一個建構函數（constructor），請將適當的建構函數參數傳遞給它。
可以在冒號後指定多個超類型，並用逗號分隔：

```kotlin

// 創建一個具有 balance 屬性的 open 類別 BankAccount
open class BankAccount(initialBalance: Int) {
    open val balance: Int = initialBalance
}

// 定義一個具有 execute() 函數的介面 Transaction
interface Transaction {
    fun execute()
}

// 一個對 BankAccount 執行特殊交易的函數
fun specialTransaction(account: BankAccount) {
    // 創建一個從 BankAccount 類別繼承並實作 Transaction 介面的匿名物件
    // 所提供帳戶的餘額被傳遞給 BankAccount 超類別建構函數
    val temporaryAccount = object : BankAccount(account.balance), Transaction {

        override val balance = account.balance + 500  // 臨時獎金

        // 實作 Transaction 介面的 execute() 函數
        override fun execute() {
            println("Executing special transaction. New balance is $balance.")
        }
    }
    // 執行交易
    temporaryAccount.execute()
}

fun main() {
    // 創建一個初始餘額為 1000 的 BankAccount
    val myAccount = BankAccount(1000)
    // 對創建的帳戶執行特殊交易
    specialTransaction(myAccount)
    // Executing special transaction. New balance is 1500.
}
```

### 將匿名物件用作傳回和值類型

當你從一個局部（local）或 [`private`](visibility-modifiers#packages) 函數或屬性傳回一個匿名物件時，
可以通過該函數或屬性存取該匿名物件的所有成員：

```kotlin

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

fun main() {
    val userPreferences = UserPreferences()
    userPreferences.printPreferences()
    // Theme: Dark, Font Size: 14
}
```

這允許你傳回具有特定屬性的匿名物件，
提供一種簡單的方式來封裝數據或行為，而無需創建單獨的類別。

如果傳回匿名物件的函數或屬性具有 `public`、`protected` 或 `internal` 可見性（visibility），則它的實際類型是：

* `Any`，如果匿名物件沒有宣告的超類型。
* 匿名物件的宣告超類型，如果只有一個這樣的類型。
* 顯式宣告的類型，如果有多個宣告的超類型。

在所有這些情況下，都無法存取在匿名物件中添加的成員。如果覆寫的成員在函數或屬性的實際類型中宣告，則可以存取它們。例如：

```kotlin

interface Notification {
    // 在 Notification 介面中宣告 notifyUser()
    fun notifyUser()
}

interface DetailedNotification

class NotificationManager {
    // 傳回類型是 Any。無法存取 message 屬性。
    // 當傳回類型是 Any 時，只能存取 Any 類別的成員。
    fun getNotification() = object {
        val message: String = "General notification"
    }

    // 傳回類型是 Notification，因為匿名物件只實作一個介面
    // notifyUser() 函數可以存取，因為它是 Notification 介面的一部分
    // 無法存取 message 屬性，因為它未在 Notification 介面中宣告
    fun getEmailNotification() = object : Notification {
        override fun notifyUser() {
            println("Sending email notification")
        }
        val message: String = "You've got mail!"
    }

    // 傳回類型是 DetailedNotification。無法存取 notifyUser() 函數和 message 屬性
    // 只能存取在 DetailedNotification 介面中宣告的成員
    fun getDetailedNotification(): DetailedNotification = object : Notification, DetailedNotification {
        override fun notifyUser() {
            println("Sending detailed notification")
        }
        val message: String = "Detailed message content"
    }
}

fun main() {
    // 這不會產生任何輸出
    val notificationManager = NotificationManager()

    // message 屬性在此處無法存取，因為傳回類型是 Any
    // 這不會產生任何輸出
    val notification = notificationManager.getNotification()

    // 可以存取 notifyUser() 函數
    // message 屬性在此處無法存取，因為傳回類型是 Notification
    val emailNotification = notificationManager.getEmailNotification()
    emailNotification.notifyUser()
    // Sending email notification

    // notifyUser() 函數和 message 屬性在此處無法存取，因為傳回類型是 DetailedNotification
    // 這不會產生任何輸出
    val detailedNotification = notificationManager.getDetailedNotification()
}
```

### 從匿名物件存取變數

物件表達式主體中的程式碼可以存取封閉作用域（enclosing scope）中的變數：

```kotlin
import java.awt.event.MouseAdapter
import java.awt.event.MouseEvent

fun countClicks(window: JComponent) {
    var clickCount = 0
    var enterCount = 0

    // MouseAdapter 為鼠標事件函數提供預設實作
    // 模擬 MouseAdapter 處理鼠標事件
    window.addMouseListener(object : MouseAdapter() {
        override fun mouseClicked(e: MouseEvent) {
            clickCount++
        }

        override fun mouseEntered(e: MouseEvent) {
            enterCount++
        }
    })
    // clickCount 和 enterCount 變數可以在物件表達式中存取
}
```

## 物件宣告和表達式之間的行為差異

物件宣告和物件表達式之間的初始化行為存在差異：

* 物件表達式在它們被使用的位置_立即_執行（並初始化）。
* 物件宣告在首次存取時_延遲_初始化。
* 伴生物件在載入（解析）與 Java 語義匹配的相應類別時初始化
  靜態初始化程式（static initializer）。