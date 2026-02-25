---
title: 物件宣告與運算式
---

[//]: # (title: 物件宣告與運算式)

在 Kotlin 中，物件允許您在單一步驟中定義一個類別並建立其執行個體。
這在您需要可重用的 singleton 執行個體或一次性物件時非常有用。
為了處理這些情境，Kotlin 提供了兩種關鍵方法：用於建立 singleton 的「物件宣告 (object declarations)」以及用於建立匿名、一次性物件的「物件運算式 (object expressions)」。

> singleton 可確保一個類別只有一個執行個體，並提供一個全域存取點。
> 
{style="tip"}

物件宣告與物件運算式最適合用於以下情境：

* **將 singleton 用於共用資源：** 您需要確保整個應用程式中只存在一個類別執行個體。例如，管理資料庫連接池。
* **建立工廠方法：** 您需要一種方便且高效建立執行個體的方式。[伴隨物件 (Companion objects)](#companion-objects) 允許您定義與類別繫結的類別層級函式與屬性，簡化了這些執行個體的建立與管理。
* **暫時修改現有類別行為：** 您想要修改現有類別的行為，而不需要建立新的子類別。例如，為特定操作向物件添加臨時功能。
* **需要型別安全設計：** 您需要使用物件運算式來實作介面或[抽象類別 (abstract classes)](classes.md#abstract-classes) 的一次性實作。這對於按鈕點擊處理常式等情境非常有用。

## 物件宣告
{id="object-declarations-overview"}

您可以使用物件宣告在 Kotlin 中建立物件的單一執行個體，其在 `object` 關鍵字後一律帶有名稱。
這允許您在單一步驟中定義類別並建立其執行個體，這對於實作 singleton 非常有用：

```kotlin
//sampleStart
// 宣告一個 Singleton 物件來管理資料提供者
object DataProviderManager {
    private val providers = mutableListOf<DataProvider>()

    // 註冊新的資料提供者
    fun registerDataProvider(provider: DataProvider) {
        providers.add(provider)
    }

    // 取得所有已註冊的資料提供者
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
    // 建立 ExampleDataProvider 的執行個體
    val exampleProvider = ExampleDataProvider()

    // 若要引用該物件，請直接使用其名稱
    DataProviderManager.registerDataProvider(exampleProvider)

    // 取得並列印所有資料提供者
    println(DataProviderManager.allDataProviders.map { it.provideData() })
    // [Example data]
}
```
{kotlin-runnable="true" id="object-declaration-register-provider"}

> 物件宣告的初始化是執行緒安全的，且在第一次存取時完成。
>
{style="tip"}

若要引用該 `object`，請直接使用其名稱：

```kotlin
DataProviderManager.registerDataProvider(exampleProvider)
```

物件宣告也可以有基底型別，
類似於[匿名物件可以繼承自現有類別或實作介面](#inherit-anonymous-objects-from-supertypes)的方式：

```kotlin
object DefaultListener : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { ... }

    override fun mouseEntered(e: MouseEvent) { ... }
}
```

與變數宣告不同，物件宣告不是運算式，因此不能用於指派陳述式的右側：

```kotlin
// 語法錯誤：物件運算式不能繫結名稱。
val myObject = object MySingleton {
    val name = "Singleton"
}
```
物件宣告不能是區域的 (local)，這意味著它們不能直接巢狀於函式內部。
但是，它們可以巢狀於其他物件宣告或非內部類別中。

### 資料物件 (Data objects)

在 Kotlin 中列印一般的物件宣告時，字串表示形式包含其名稱與該 `object` 的雜湊值：

```kotlin
object MyObject

fun main() {
    println(MyObject) 
    // MyObject@hashcode
}
```
{kotlin-runnable="true" id="object-declaration-plain"}

但是，藉由使用 `data` 修飾詞標記物件宣告，
您可以指示編譯器在呼叫 `toString()` 時傳回物件的實際名稱，其運作方式與 [data class](data-classes.md) 相同：

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

此外，編譯器會為您的 `data object` 產生數個函式：

* `toString()` 傳回資料物件的名稱
* `equals()`/`hashCode()` 啟用相等性檢查與基於雜湊的集合

  > 您無法為 `data object` 提供自訂的 `equals` 或 `hashCode` 實作。
  >
  {style="note"}

`data object` 的 `equals()` 函式可確保所有具有該 `data object` 型別的物件都被視為相等。
在大多數情況下，由於 `data object` 宣告的是 singleton，您在執行時期只會有一個 `data object` 的執行個體。
然而，在執行時期產生另一個同型別物件的邊緣情況下（例如，透過使用 `java.lang.reflect` 的平台反射，或在底層使用此 API 的 JVM 序列化程式庫），這能確保這些物件被視為相等。

> 請確保您僅以結構化方式（使用 `==` 運算子）比較 `data objects`，絕不要透過參照（使用 `===` 運算子）進行比較。
> 這有助於避免在執行時期存在多個資料物件執行個體時出現陷阱。
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

    // 即使程式庫強制建立了 MySingleton 的第二個執行個體，
    // 其 equals() 函式仍會傳回 true：
    println(MySingleton == evilTwin) 
    // true

    // 不要使用 === 比較資料物件
    println(MySingleton === evilTwin) 
    // false
}

fun createInstanceViaReflection(): MySingleton {
    // Kotlin 反射不允許具現化資料物件。
    // 這會「強制」建立一個新的 MySingleton 執行個體（使用 Java 平台反射）
    // 請不要自己這樣做！
    return (MySingleton.javaClass.declaredConstructors[0].apply { isAccessible = true } as Constructor<MySingleton>).newInstance()
}
```

產生的 `hashCode()` 函式的行為與 `equals()` 函式一致，因此 `data object` 的所有執行時期執行個體都具有相同的雜湊碼。

#### 資料物件與 data class 的差異

雖然 `data object` 與 `data class` 宣告經常一起使用且具有一些相似之處，但有些函式不會為 `data object` 產生：

* 沒有 `copy()` 函式。因為 `data object` 宣告旨在用作 singleton，所以不會產生 `copy()` 函式。singleton 將類別的具現化限制為單一執行個體，若允許建立執行個體的副本將違反此原則。
* 沒有 `componentN()` 函式。與 `data class` 不同，`data object` 沒有任何資料屬性。由於嘗試解構這種沒有資料屬性的物件沒有意義，因此不會產生 `componentN()` 函式。

#### 在密封階層中使用資料物件

資料物件宣告對於[密封類別或密封介面 (sealed classes or sealed interfaces)](sealed-classes.md) 等密封階層特別有用。
它們允許您與可能在物件旁定義的任何 data class 保持對稱。

在此範例中，將 `EndOfFile` 宣告為 `data object` 而非一般 `object`，
意味著它將獲得 `toString()` 函式，而無需手動覆寫：

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

「伴隨物件 (Companion objects)」允許您定義類別層級的函式與屬性。
這使得建立工廠方法、保留常數以及存取共用公用程式變得容易。

類別內部的物件宣告可以使用 `companion` 關鍵字標記：

```kotlin
class MyClass {
    companion object Factory {
        fun create(): MyClass = MyClass()
    }
}
```

`companion object` 的成員只需使用類別名稱作為限定詞即可呼叫：

```kotlin
class User(val name: String) {
    // 定義一個伴隨物件，作為建立 User 執行個體的工廠
    companion object Factory {
        fun create(name: String): User = User(name)
    }
}

fun main(){
    // 使用類別名稱作為限定詞呼叫伴隨物件的工廠方法。
    // 建立一個新的 User 執行個體
    val userInstance = User.create("John Doe")
    println(userInstance.name)
    // John Doe
}
```
{kotlin-runnable="true" id="object-expression-companion-object"}

`companion object` 的名稱可以省略，在這種情況下將使用名稱 `Companion`：

```kotlin
class User(val name: String) {
    // 定義一個沒有名稱的伴隨物件
    companion object { }
}

// 存取伴隨物件
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

當單獨使用類別名稱時，它會充當對該類別伴隨物件的參照，
無論該伴隨物件是否命名：

```kotlin
//sampleStart
class User1 {
    // 定義一個具名的伴隨物件
    companion object Named {
        fun show(): String = "User1's Named Companion Object"
    }
}

// 使用類別名稱引用 User1 的伴隨物件
val reference1 = User1

class User2 {
    // 定義一個未命名的伴隨物件
    companion object {
        fun show(): String = "User2's Companion Object"
    }
}

// 使用類別名稱引用 User2 的伴隨物件
val reference2 = User2
//sampleEnd

fun main() {
    // 呼叫 User1 伴隨物件中的 show() 函式
    println(reference1.show()) 
    // User1's Named Companion Object

    // 呼叫 User2 伴隨物件中的 show() 函式
    println(reference2.show()) 
    // User2's Companion Object
}
```
{kotlin-runnable="true" id="object-expression-companion-object-names"}

雖然 Kotlin 中伴隨物件的成員看起來像其他語言中的 static 成員，
但它們實際上是伴隨物件的執行個體成員，這意味著它們屬於物件本身。
這允許伴隨物件實作介面：

```kotlin
interface Factory<T> {
    fun create(name: String): T
}

class User(val name: String) {
    // 定義一個實作 Factory 介面的伴隨物件
    companion object : Factory<User> {
        override fun create(name: String): User = User(name)
    }
}

fun main() {
    // 將伴隨物件當作 Factory 使用
    val userFactory: Factory<User> = User
    val newUser = userFactory.create("Example User")
    println(newUser.name)
    // Example User
}
```
{kotlin-runnable="true" id="object-expression-factory"}

然而，在 JVM 上，如果您使用 `@JvmStatic` 註解，可以將伴隨物件的成員產生為真正的 static 方法和欄位。詳情請參閱 [Java 互通性](java-to-kotlin-interop.md#static-fields)章節。

## 物件運算式

物件運算式宣告一個類別並建立該類別的執行個體，但不為兩者命名。
這些類別對於一次性使用非常有用。它們可以從頭開始建立、繼承自現有類別，
或實作介面。這些類別的執行個體也稱為「匿名物件 (anonymous objects)」，因為它們是由運算式定義的，而不是名稱。

### 從頭開始建立匿名物件

物件運算式以 `object` 關鍵字開始。

如果該物件不擴充任何類別或實作介面，您可以直接在 `object` 關鍵字後的花括號內定義物件的成員：

```kotlin
fun main() {
//sampleStart
    val helloWorld = object {
        val hello = "Hello"
        val world = "World"
        // 物件運算式擴充了 Any 類別，該類別已經有一個 toString() 函式，
        // 所以必須將其覆寫
        override fun toString() = "$hello $world"
    }

    print(helloWorld)
    // Hello World
//sampleEnd
}
```
{kotlin-runnable="true" id="object-expression-object"}

### 繼承自基底型別的匿名物件

要建立繼承自某個型別（或多個型別）的匿名物件，請在 `object` 和冒號 `:` 之後指定該型別。
然後實作或覆寫該類別的成員，就像您正在[繼承](inheritance.md)它一樣：

```kotlin
window.addMouseListener(object : MouseAdapter() {
    override fun mouseClicked(e: MouseEvent) { /*...*/ }

    override fun mouseEntered(e: MouseEvent) { /*...*/ }
})
```

如果基底型別有建構函式，請向其傳遞適當的建構函式參數。
可以在冒號後指定多個基底型別，並以逗號分隔：

```kotlin
//sampleStart
// 建立一個具有 balance 屬性的 open 類別 BankAccount
open class BankAccount(initialBalance: Int) {
    open val balance: Int = initialBalance
}

// 定義一個具有 execute() 函式的 Transaction 介面
interface Transaction {
    fun execute()
}

// 在 BankAccount 上執行特殊交易的函式
fun specialTransaction(account: BankAccount) {
    // 建立一個繼承自 BankAccount 類別並實作 Transaction 介面的匿名物件
    // 所提供的帳戶餘額會傳遞給 BankAccount 超類別建構函式
    val temporaryAccount = object : BankAccount(account.balance), Transaction {

        override val balance = account.balance + 500  // 臨時紅利

        // 實作 Transaction 介面中的 execute() 函式
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
    // 在建立的帳戶上執行特殊交易
    specialTransaction(myAccount)
    // Executing special transaction. New balance is 1500.
}
```
{kotlin-runnable="true" id="object-expression-anonymous-object"}

### 將匿名物件用作回傳與值型別

當您從區域或 [`private`](visibility-modifiers.md#packages) 函式或屬性回傳匿名物件時，
該匿名物件的所有成員都可以透過該函式或屬性存取：

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
提供了一種封裝資料或行為的簡單方法，而無需建立單獨的類別。

如果回傳匿名物件的函式或屬性具有 `public`、`protected` 或 `internal` 可見性，則其實際型別為：

* 如果匿名物件沒有宣告基底型別，則為 `Any`。
* 如果匿名物件恰好有一個宣告的基底型別，則為該宣告的基底型別。
* 如果有多個宣告的基底型別，則為明確宣告的型別。

在所有這些情況下，匿名物件中新增的成員都無法存取。如果覆寫的成員是在函式或屬性的實際型別中宣告的，則可以存取。例如：

```kotlin
//sampleStart
interface Notification {
    // 在 Notification 介面中宣告 notifyUser()
    fun notifyUser()
}

interface DetailedNotification

class NotificationManager {
    // 回傳型別為 Any。message 屬性無法存取。
    // 當回傳型別為 Any 時，僅能存取 Any 類別的成員。
    fun getNotification() = object {
        val message: String = "General notification"
    }

    // 回傳型別為 Notification，因為匿名物件僅實作了一個介面
    // notifyUser() 函式可以存取，因為它是 Notification 介面的一部分
    // message 屬性無法存取，因為它沒有在 Notification 介面中宣告
    fun getEmailNotification() = object : Notification {
        override fun notifyUser() {
            println("Sending email notification")
        }
        val message: String = "You've got mail!"
    }

    // 回傳型別為 DetailedNotification。notifyUser() 函式與 message 屬性均無法存取
    // 僅能存取 DetailedNotification 介面中宣告的成員
    fun getDetailedNotification(): DetailedNotification = object : Notification, DetailedNotification {
        override fun notifyUser() {
            println("Sending detailed notification")
        }
        val message: String = "Detailed message content"
    }
}
//sampleEnd
fun main() {
    // 這不會產生輸出
    val notificationManager = NotificationManager()

    // 這裡無法存取 message 屬性，因為回傳型別為 Any
    // 這不會產生輸出
    val notification = notificationManager.getNotification()

    // notifyUser() 函式可以存取
    // 這裡無法存取 message 屬性，因為回傳型別為 Notification
    val emailNotification = notificationManager.getEmailNotification()
    emailNotification.notifyUser()
    // Sending email notification

    // 這裡無法存取 notifyUser() 函式與 message 屬性，因為回傳型別為 DetailedNotification
    // 這不會產生輸出
    val detailedNotification = notificationManager.getDetailedNotification()
}
```
{kotlin-runnable="true" id="object-expression-object-override"}

### 從匿名物件存取變數

物件運算式主體內的程式碼可以存取來自封閉作用域的變數：

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
    // clickCount 與 enterCount 變數在物件運算式內是可以存取的
}
```

## 物件宣告與運算式之間的行為差異

物件宣告與物件運算式在初始化行為上存在差異：

* 物件運算式在使用的位置會被*立即*執行（並初始化）。
* 物件宣告是在第一次存取時*延遲*初始化。
* 伴隨物件是在對應類別被載入（解析）時初始化的，這與 Java static 初始設定式的語意相符。