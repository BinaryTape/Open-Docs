[//]: # (title: 物件宣告與運算式)

在 Kotlin 中，物件允許您在一個步驟中定義類別並建立其的一個實例。當您需要可重用的單例實例或一次性物件時，這會很有用。為了處理這些情境，Kotlin 提供了兩種主要方法：用於建立單例的 _物件宣告_ 以及用於建立匿名、一次性物件的 _物件運算式_。

> 單例確保一個類別只有一個實例，並提供一個全域存取點。
>
{style="tip"}

物件宣告和物件運算式最適合以下情境：

*   **為共享資源使用單例：** 您需要確保整個應用程式中只存在一個類別實例。例如，管理資料庫連線池。
*   **建立工廠方法：** 您需要一種方便有效率地建立實例的方法。[伴生物件](#companion-objects) 允許您定義與類別繫結的類別層級函式和屬性，簡化這些實例的建立和管理。
*   **暫時修改現有類別行為：** 您希望修改現有類別的行為，而無需建立新的子類別。例如，為特定操作向物件添加臨時功能。
*   **需要型別安全的設計：** 您需要使用物件運算式來一次性實作介面或[抽象類別](classes.md#abstract-classes)。這對於按鈕點擊處理器等情境很有用。

## 物件宣告
{id="object-declarations-overview"}

您可以使用物件宣告在 Kotlin 中建立物件的單一實例，物件宣告總是在 `object` 關鍵字後跟隨一個名稱。這讓您可以一步定義類別並建立其一個實例，這對於實作單例很有用：

```kotlin
//sampleStart
// 宣告一個單例物件以管理資料提供者
object DataProviderManager {
    private val providers = mutableListOf<DataProvider>()

    // 註冊一個新的資料提供者
    fun registerDataProvider(provider: DataProvider) {
        providers.add(provider)
    }

    // 擷取所有已註冊的資料提供者
    val allDataProviders: Collection<DataProvider> 
        get() = providers
}
//sampleEnd

// 範例資料提供者介面
interface DataProvider {
    fun provideData(): String
}

// 範例資料提供者實作
class ExampleDataProvider : DataProvider {
    override fun provideData(): String {
        return "Example data"
    }
}

fun main() {
    // 建立 ExampleDataProvider 的實例
    val exampleProvider = ExampleDataProvider()

    // 若要引用物件，直接使用其名稱
    DataProviderManager.registerDataProvider(exampleProvider)

    // 擷取並印出所有資料提供者
    println(DataProviderManager.allDataProviders.map { it.provideData() })
    // [Example data]
}
```
{kotlin-runnable="true" id="object-declaration-register-provider"}

> 物件宣告的初始化是執行緒安全的，並在首次存取時完成。
>
{style="tip"}

若要引用 `object`，直接使用其名稱：

```kotlin
DataProviderManager.registerDataProvider(exampleProvider)
```

物件宣告也可以擁有超型別，類似於[匿名物件如何繼承現有類別或實作介面](#inherit-anonymous-objects-from-supertypes)：

```kotlin
object DefaultListener : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { /* ... */ }

    override fun mouseEntered(e: MouseEvent) { /* ... */ }
}
```

與變數宣告一樣，物件宣告不是運算式，因此不能在賦值語句的右側使用：

```kotlin
// 語法錯誤：物件運算式無法繫結名稱。
val myObject = object MySingleton {
    val name = "Singleton"
}
```
物件宣告不能是局部的，這表示它們不能直接巢狀於函式內部。然而，它們可以巢狀於其他物件宣告或非內部類別中。

### 資料物件

在 Kotlin 中印出純物件宣告時，字串表示形式包含其名稱和 `object` 的雜湊碼：

```kotlin
object MyObject

fun main() {
    println(MyObject) 
    // MyObject@hashcode
}
```
{kotlin-runnable="true" id="object-declaration-plain"}

然而，透過使用 `data` 修飾符標記物件宣告，您可以指示編譯器在呼叫 `toString()` 時返回物件的實際名稱，其運作方式與[資料類別](data-classes.md)相同：

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

此外，編譯器會為您的 `data object` 生成多個函式：

*   `toString()` 返回資料物件的名稱
*   `equals()`/`hashCode()` 啟用相等性檢查和基於雜湊的集合

  > 您不能為 `data object` 提供自訂的 `equals` 或 `hashCode` 實作。
  >
  {style="note"}

`data object` 的 `equals()` 函式確保所有具有您的 `data object` 型別的物件都被視為相等。在大多數情況下，由於 `data object` 宣告了一個單例，您在執行時只會有一個 `data object` 實例。然而，在執行時生成相同型別的另一個物件的邊緣情況下（例如，透過使用 `java.lang.reflect` 進行平台反射，或使用此 API 作為底層的 JVM 序列化函式庫），這可確保這些物件被視為相等。

> 確保您只以結構性方式（使用 `==` 運算子）比較 `data object`，而不要以參考（使用 `===` 運算子）方式比較。這有助於您避免在執行時存在多個資料物件實例時的陷阱。
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

    // 即使函式庫強制建立 MySingleton 的第二個實例，
    // 其 equals() 函式也會返回 true：
    println(MySingleton == evilTwin) 
    // true

    // 不要使用 === 比較資料物件
    println(MySingleton === evilTwin) 
    // false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlin 反射不允許實例化資料物件。
    // 這會「強制」（使用 Java 平台反射）建立一個新的 MySingleton 實例
    // 不要自己這樣做！
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

生成的 `hashCode()` 函式行為與 `equals()` 函式保持一致，以便 `data object` 的所有執行時實例都具有相同的雜湊碼。

#### 資料物件與資料類別之間的差異

儘管 `data object` 和 `data class` 宣告經常一起使用並有一些相似之處，但某些函式不會為 `data object` 生成：

*   沒有 `copy()` 函式。由於 `data object` 宣告旨在用作單例，因此不會生成 `copy()` 函式。單例限制了類別的實例化為單一實例，而允許建立實例的副本將違反此限制。
*   沒有 `componentN()` 函式。與 `data class` 不同，`data object` 沒有任何資料屬性。由於嘗試解構一個沒有資料屬性的物件沒有意義，因此不會生成 `componentN()` 函式。

#### 將資料物件與密封層級搭配使用

資料物件宣告對於[密封類別或密封介面](sealed-classes.md)等密封層級特別有用。它們允許您與可能在物件旁定義的任何資料類別保持對稱。

在此範例中，將 `EndOfFile` 宣告為 `data object` 而不是純粹的 `object` 意味著它將獲得 `toString()` 函式，而無需手動覆寫：

```kotlin
sealed interface ReadResult
data class Number(val number: Int) : ReadResult
data class Text(val text: ReadResult)
data object EndOfFile : ReadResult

fun main() {
    println(Number(7)) 
    // Number(number=7)
    println(EndOfFile) 
    // EndOfFile
}
```
{kotlin-runnable="true" id="data-objects-sealed-hierarchies"}

### 伴生物件

_伴生物件_ 允許您定義類別層級函式和屬性。這使得建立工廠方法、保存常數和存取共享工具變得容易。

類別內的物件宣告可以使用 `companion` 關鍵字標記：

```kotlin
class MyClass {
    companion object Factory {
        fun create(): MyClass = MyClass()
    }
}
```

`companion object` 的成員可以簡單地透過使用類別名稱作為限定詞來呼叫：

```kotlin
class User(val name: String) {
    // 定義一個伴生物件，作為建立 User 實例的工廠
    companion object Factory {
        fun create(name: String): User = User(name)
    }
}

fun main(){
    // 使用類別名稱作為限定詞呼叫伴生物件的工廠方法。 
    // 建立一個新的 User 實例
    val userInstance = User.create("John Doe")
    println(userInstance.name)
    // John Doe
}
```
{kotlin-runnable="true" id="object-expression-companion-object"}

`companion object` 的名稱可以省略，在這種情況下將使用名稱 `Companion`：

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

當類別名稱單獨使用時，它會作為類別伴生物件的參考，無論伴生物件是否有命名：

```kotlin
//sampleStart
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
//sampleEnd

fun main() {
    // 從 User1 的伴生物件呼叫 show() 函式
    println(reference1.show()) 
    // User1's Named Companion Object

    // 從 User2 的伴生物件呼叫 show() 函式
    println(reference2.show()) 
    // User2's Companion Object
}
```
{kotlin-runnable="true" id="object-expression-companion-object-names"}

儘管 Kotlin 中伴生物件的成員看起來像其他語言的靜態成員，但它們實際上是伴生物件的實例成員，這意味著它們屬於物件本身。這允許伴生物件實作介面：

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
    // 將伴生物件用作 Factory
    val userFactory: Factory<User> = User
    val newUser = userFactory.create("Example User")
    println(newUser.name)
    // Example User
}
```
{kotlin-runnable="true" id="object-expression-factory"}

然而，在 JVM 上，如果您使用 `@JvmStatic` 註解，伴生物件的成員可以作為真正的靜態方法和欄位生成。有關更多詳細資訊，請參閱[Java 互通性](java-to-kotlin-interop.md#static-fields)部分。

## 物件運算式

物件運算式宣告一個類別並建立該類別的實例，但不會命名其中任何一個。這些類別對於一次性使用很有用。它們可以從頭建立，繼承現有類別，或實作介面。這些類別的實例也稱為 _匿名物件_，因為它們是由運算式而不是名稱定義的。

### 從零開始建立匿名物件

物件運算式以 `object` 關鍵字開頭。

如果物件沒有擴展任何類別或實作任何介面，您可以直接在 `object` 關鍵字後的花括號內定義物件的成員：

```kotlin
fun main() {
//sampleStart
    val helloWorld = object {
        val hello = "Hello"
        val world = "World"
        // 物件運算式擴展 Any 類別，該類別已包含 toString() 函式，
        // 因此必須覆寫
        override fun toString() = "$hello $world"
    }

    print(helloWorld)
    // Hello World
//騷們
}
```
{kotlin-runnable="true" id="object-expression-object"}

### 從超型別繼承匿名物件

若要建立一個繼承自某個型別（或多個型別）的匿名物件，請在 `object` 和冒號 `:` 後指定此型別。然後，實作或覆寫此類別的成員，就像您正在從中[繼承](inheritance.md)一樣：

```kotlin
window.addMouseListener(object : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { /*...*/ }

    override fun mouseEntered(e: MouseEvent) { /*...*/ }
})
```

如果超型別有建構函式，請將適當的建構函式參數傳遞給它。多個超型別可以在冒號後指定，以逗號分隔：

```kotlin
//sampleStart
// 建立一個帶有 balance 屬性的開放類別 BankAccount
open class BankAccount(initialBalance: Int) {
    open val balance: Int = initialBalance
}

// 定義一個帶有 execute() 函式的 Transaction 介面
interface Transaction {
    fun execute()
}

// 一個對 BankAccount 執行特殊交易的函式
fun specialTransaction(account: BankAccount) {
    // 建立一個匿名物件，它繼承自 BankAccount 類別並實作 Transaction 介面
    // 所提供帳戶的 balance 會傳遞給 BankAccount 超類別的建構函式
    val temporaryAccount = object : BankAccount(account.balance), Transaction {

        override val balance = account.balance + 500  // 臨時獎金

        // 實作 Transaction 介面的 execute() 函式
        override fun execute() {
            println("Executing special transaction. New balance is $balance.")
        }
    }
    // 執行交易
    temporaryAccount.execute()
}
//sampleEnd
fun main() {
    // 建立一個初始餘額為 1000 的 BankAccount
    val myAccount = BankAccount(1000)
    // 對建立的帳戶執行特殊交易
    specialTransaction(myAccount)
    // Executing special transaction. New balance is 1500.
}
```
{kotlin-runnable="true" id="object-expression-anonymous-object"}

### 將匿名物件用作回傳型別和值型別

當您從局部或 [`private`](visibility-modifiers.md#packages) 函式或屬性回傳匿名物件時，該匿名物件的所有成員都可以透過該函式或屬性存取：

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

這讓您可以回傳具有特定屬性的匿名物件，提供一種簡單的方法來封裝資料或行為，而無需建立單獨的類別。

如果回傳匿名物件的函式或屬性具有 `public`、`protected` 或 `internal` 可見性，其實際型別為：

*   如果匿名物件沒有宣告的超型別，則為 `Any`。
*   如果恰好只有一個宣告的超型別，則為該匿名物件的宣告超型別。
*   如果有多個宣告的超型別，則為明確宣告的型別。

在所有這些情況下，匿名物件中新增的成員不可存取。如果覆寫的成員在其函式或屬性的實際型別中宣告，則可以存取。例如：

```kotlin
//sampleStart
interface Notification {
    // 在 Notification 介面中宣告 notifyUser()
    fun notifyUser()
}

interface DetailedNotification

class NotificationManager {
    // 回傳型別是 Any。message 屬性不可存取。
    // 當回傳型別是 Any 時，只有 Any 類別的成員可以存取。
    fun getNotification() = object {
        val message: String = "General notification"
    }

    // 回傳型別是 Notification，因為匿名物件只實作了一個介面
    // notifyUser() 函式可存取，因為它是 Notification 介面的一部分
    // message 屬性不可存取，因為它未在 Notification 介面中宣告
    fun getEmailNotification() = object : Notification {
        override fun notifyUser() {
            println("Sending email notification")
        }
        val message: String = "You've got mail!"
    }

    // 回傳型別是 DetailedNotification。notifyUser() 函式和 message 屬性不可存取
    // 只有在 DetailedNotification 介面中宣告的成員可以存取
    fun getDetailedNotification(): DetailedNotification = object : Notification, DetailedNotification {
        override fun notifyUser() {
            println("Sending detailed notification")
        }
        val message: String = "Detailed message content"
    }
}
//sampleEnd
fun main() {
    // 這不會產生任何輸出
    val notificationManager = NotificationManager()

    // 這裡的 message 屬性不可存取，因為回傳型別是 Any
    // 這不會產生任何輸出
    val notification = notificationManager.getNotification()

    // notifyUser() 函式可存取
    // 這裡的 message 屬性不可存取，因為回傳型別是 Notification
    val emailNotification = notificationManager.getEmailNotification()
    emailNotification.notifyUser()
    // Sending email notification

    // 這裡的 notifyUser() 函式和 message 屬性不可存取，因為回傳型別是 DetailedNotification
    // 這不會產生任何輸出
    val detailedNotification = notificationManager.getDetailedNotification()
}
```
{kotlin-runnable="true" id="object-expression-object-override"}

### 從匿名物件存取變數

物件運算式主體內的程式碼可以存取封閉範圍內的變數：

```kotlin
import java.awt.event.MouseAdapter
import java.awt.event.MouseEvent

fun countClicks(window: JComponent) {
    var clickCount = 0
    var enterCount = 0

    // MouseAdapter 為滑鼠事件函式提供預設實作
    // 模擬 MouseAdapter 處理滑鼠事件
    window.addMouseListener(object : MouseAdapter() {
        override fun mouseClicked(e: MouseEvent) {
            clickCount++
        }

        override fun mouseEntered(e: MouseEvent) {
            enterCount++
        }
    })
    // clickCount 和 enterCount 變數在物件運算式內可存取
}
```

## 物件宣告與運算式的行為差異

物件宣告與物件運算式在初始化行為上存在差異：

*   物件運算式在使用時會_立即_執行（並初始化）。
*   物件宣告在首次存取時會_延遲_初始化。
*   伴生物件在載入（解析）對應類別時初始化，這與 Java 靜態初始化器的語義相符。