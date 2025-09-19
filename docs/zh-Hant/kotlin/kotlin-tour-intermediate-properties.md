[//]: # (title: 中級：屬性)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="第一步" /> <a href="kotlin-tour-intermediate-extension-functions.md">擴充函式</a><br />
        <img src="icon-2-done.svg" width="20" alt="第二步" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函式</a><br />
        <img src="icon-3-done.svg" width="20" alt="第三步" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">帶接收者的 Lambda 運算式</a><br />
        <img src="icon-4-done.svg" width="20" alt="第四步" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">類別與介面</a><br />
        <img src="icon-5-done.svg" width="20" alt="第五步" /> <a href="kotlin-tour-intermediate-objects.md">物件</a><br />
        <img src="icon-6-done.svg" width="20" alt="第六步" /> <a href="kotlin-tour-intermediate-open-special-classes.md">開放與特殊類別</a><br />
        <img src="icon-7.svg" width="20" alt="第七步" /> <strong>屬性</strong><br />
        <img src="icon-8-todo.svg" width="20" alt="第八步" /> <a href="kotlin-tour-intermediate-null-safety.md">空值安全</a><br />
        <img src="icon-9-todo.svg" width="20" alt="第九步" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">函式庫與 API</a></p>
</tldr>

在初學者之旅中，您學習了如何使用屬性來宣告類別實例的特性以及如何存取它們。本章將深入探討屬性在 Kotlin 中的運作方式，並探索您可以在程式碼中使用它們的其他方法。

## 支持欄位

在 Kotlin 中，屬性具有預設的 `get()` 和 `set()` 函式，稱為屬性存取器 (property accessors)，用於處理其值的檢索和修改。儘管這些預設函式在程式碼中並不明顯，但編譯器會自動生成它們，以便在幕後管理屬性存取。這些存取器使用**支持欄位 (backing field)** 來儲存實際的屬性值。

在以下任一條件成立時，支持欄位 (backing field) 存在：

*   您為屬性使用預設的 `get()` 或 `set()` 函式。
*   您嘗試在程式碼中透過 `field` 關鍵字存取屬性值。

> `get()` 和 `set()` 函式也稱為 getter 和 setter。
>
{style="tip"}

例如，這段程式碼有一個 `category` 屬性，它沒有自訂的 `get()` 或 `set()` 函式，因此使用預設實作：

```kotlin
class Contact(val id: Int, var email: String) {
    var category: String = ""
}
```

在底層，這等同於以下偽程式碼：

```kotlin
class Contact(val id: Int, var email: String) {
    var category: String = ""
        get() = field
        set(value) {
            field = value
        }
}
```
{validate="false"}

在此範例中：

*   `get()` 函式從欄位中檢索屬性值：`""`。
*   `set()` 函式接受 `value` 作為參數並將其賦值給欄位，其中 `value` 是 `""`。

當您想在 `get()` 或 `set()` 函式中添加額外邏輯而不會導致無限迴圈時，存取支持欄位非常有用。例如，您有一個 `Person` 類別，帶有 `name` 屬性：

```kotlin
class Person {
    var name: String = ""
}
```

您想要確保 `name` 屬性的第一個字母大寫，因此您建立一個自訂的 `set()` 函式，使用 [`.replaceFirstChar()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace-first-char.html) 和 [`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase-char.html) 擴充函式。然而，如果您在 `set()` 函式中直接引用屬性，將會創建一個無限迴圈並在執行時看到 `StackOverflowError`：

```kotlin
class Person {
    var name: String = ""
        set(value) {
            // This causes a runtime error
            name = value.replaceFirstChar { firstChar -> firstChar.uppercase() }
        }
}

fun main() {
    val person = Person()
    person.name = "kodee"
    println(person.name)
    // Exception in thread "main" java.lang.StackOverflowError
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-stackoverflow"}

為了修復這個問題，您可以在 `set()` 函式中使用支持欄位，透過 `field` 關鍵字引用它：

```kotlin
class Person {
    var name: String = ""
        set(value) {
            field = value.replaceFirstChar { firstChar -> firstChar.uppercase() }
        }
}

fun main() {
    val person = Person()
    person.name = "kodee"
    println(person.name)
    // Kodee
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-backingfield"}

當您想新增日誌、在屬性值變更時發送通知，或使用比較新舊屬性值的額外邏輯時，支持欄位也很有用。

如需更多資訊，請參閱 [支持欄位](properties.md#backing-fields)。

## 擴充屬性

就像擴充函式一樣，也存在擴充屬性。擴充屬性允許您在不修改現有類別原始碼的情況下，向其添加新屬性。然而，Kotlin 中的擴充屬性**沒有**支持欄位。這表示您需要自行編寫 `get()` 和 `set()` 函式。此外，由於缺乏支持欄位，它們無法持有任何狀態。

要宣告擴充屬性，請寫下您要擴充的類別名稱，後跟一個 `.` 和您的屬性名稱。就像普通的類別屬性一樣，您需要為您的屬性宣告一個類型。例如：

```kotlin
val String.lastChar: Char
```
{validate="false"}

當您希望屬性包含計算值而不使用繼承時，擴充屬性最有用。您可以將擴充屬性視為只有一個參數（接收者物件）的函式。

例如，假設您有一個名為 `Person` 的資料類別，包含兩個屬性：`firstName` 和 `lastName`。

```kotlin
data class Person(val firstName: String, val lastName: String)
```

您希望能夠存取此人的完整姓名，而無需修改 `Person` 資料類別或從中繼承。您可以透過建立一個帶有自訂 `get()` 函式的擴充屬性來做到這一點：

```kotlin
data class Person(val firstName: String, val lastName: String)

// Extension property to get the full name
val Person.fullName: String
    get() = "$firstName $lastName"

fun main() {
    val person = Person(firstName = "John", lastName = "Doe")

    // Use the extension property
    println(person.fullName)
    // John Doe
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-extension"}

> 擴充屬性不能覆寫類別的現有屬性。
>
{style="note"}

就像擴充函式一樣，Kotlin 標準函式庫廣泛使用了擴充屬性。例如，請參閱 `CharSequence` 的 [`lastIndex` 屬性](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/last-index.html)。

## 委託屬性

您已經在 [類別與介面](kotlin-tour-intermediate-classes-interfaces.md#delegation) 章節中學習了委託。您也可以將委託與屬性結合使用，將其屬性存取器委託給另一個物件。當您對儲存屬性有更複雜的需求，而簡單的支持欄位無法處理時，這非常有用，例如將值儲存在資料庫表格、瀏覽器會話或映射中。使用委託屬性還可以減少樣板程式碼，因為獲取和設定屬性的邏輯僅包含在您委託的物件中。

語法與類別的委託類似，但操作層級不同。宣告您的屬性，後跟 `by` 關鍵字以及您想要委託的物件。例如：

```kotlin
val displayName: String by Delegate
```

在這裡，委託屬性 `displayName` 引用 `Delegate` 物件來取得其屬性存取器。

您委託的每個物件**必須**擁有一個 `getValue()` 運算子函式，Kotlin 會使用該函式來檢索委託屬性的值。如果屬性是可變的，它也必須有一個 `setValue()` 運算子函式，供 Kotlin 設定其值。

預設情況下，`getValue()` 和 `setValue()` 函式具有以下結構：

```kotlin
operator fun getValue(thisRef: Any?, property: KProperty<*>): String {}

operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {}
```
{validate="false"}

在這些函式中：

*   `operator` 關鍵字將這些函式標記為運算子函式，使其能夠重載 `get()` 和 `set()` 函式。
*   `thisRef` 參數指向**包含**委託屬性的物件。預設情況下，類型設定為 `Any?`，但您可能需要宣告更具體的類型。
*   `property` 參數指向其值被存取或變更的屬性。您可以使用此參數存取諸如屬性名稱或類型等資訊。預設情況下，類型設定為 `KProperty<*>` 但您也可以使用 `Any?`。您無需擔心在程式碼中更改此項。

`getValue()` 函式預設的傳回類型為 `String`，但您可以根據需要進行調整。

`setValue()` 函式有一個額外的參數 `value`，用於保存賦值給屬性的新值。

那麼，這在實際中看起來如何？假設您想要一個計算屬性，例如使用者的顯示名稱，該屬性只計算一次，因為該操作開銷很大，並且您的應用程式對效能敏感。您可以使用委託屬性來快取顯示名稱，這樣它只計算一次，但可以隨時存取而不會影響效能。

首先，您需要創建要委託的物件。在此情況下，該物件將是 `CachedStringDelegate` 類別的實例：

```kotlin
class CachedStringDelegate {
    var cachedValue: String? = null
}
```

`cachedValue` 屬性包含快取的值。在 `CachedStringDelegate` 類別中，將您希望委託屬性的 `get()` 函式擁有的行為添加到 `getValue()` 運算子函式主體中：

```kotlin
class CachedStringDelegate {
    var cachedValue: String? = null

    operator fun getValue(thisRef: Any?, property: Any?): String {
        if (cachedValue == null) {
            cachedValue = "Default Value"
            println("Computed and cached: $cachedValue")
        } else {
            println("Accessed from cache: $cachedValue")
        }
        return cachedValue ?: "Unknown"
    }
}
```

`getValue()` 函式檢查 `cachedValue` 屬性是否為 `null`。如果是，該函式將賦值 `"Default value"` 並列印字串用於日誌記錄。如果 `cachedValue` 屬性已經計算過，則該屬性不為 `null`。在這種情況下，會列印另一個字串用於日誌記錄。最後，該函式使用 Elvis 運算子返回快取值，如果值為 `null` 則返回 `"Unknown"`。

現在您可以將您想要快取的屬性 (`val displayName`) 委託給 `CachedStringDelegate` 類別的實例：

```kotlin
class CachedStringDelegate {
    var cachedValue: String? = null

    operator fun getValue(thisRef: User, property: Any?): String {
        if (cachedValue == null) {
            cachedValue = "${thisRef.firstName} ${thisRef.lastName}"
            println("Computed and cached: $cachedValue")
        } else {
            println("Accessed from cache: $cachedValue")
        }
        return cachedValue ?: "Unknown"
    }
}

class User(val firstName: String, val lastName: String) {
    val displayName: String by CachedStringDelegate()
}

fun main() {
    val user = User("John", "Doe")

    // First access computes and caches the value
    println(user.displayName)
    // Computed and cached: John Doe
    // John Doe

    // Subsequent accesses retrieve the value from cache
    println(user.displayName)
    // Accessed from cache: John Doe
    // John Doe
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-delegated"}

此範例：

*   建立一個 `User` 類別，該類別在標頭中包含兩個屬性 `firstName` 和 `lastName`，並在類別主體中包含一個屬性 `displayName`。
*   將 `displayName` 屬性委託給 `CachedStringDelegate` 類別的實例。
*   建立一個名為 `user` 的 `User` 類別實例。
*   列印在 `user` 實例上存取 `displayName` 屬性的結果。

請注意，在 `getValue()` 函式中，`thisRef` 參數的類型從 `Any?` 類型縮小到物件類型：`User`。這是為了讓編譯器能夠存取 `User` 類別的 `firstName` 和 `lastName` 屬性。

### 標準委託

Kotlin 標準函式庫為您提供了一些有用的委託，因此您不必總是從頭開始創建自己的委託。如果您使用這些委託之一，則無需定義 `getValue()` 和 `setValue()` 函式，因為標準函式庫會自動提供它們。

#### 延遲屬性

若要僅在首次存取時初始化屬性，請使用延遲屬性 (lazy property)。標準函式庫提供了用於委託的 `Lazy` 介面。

若要建立 `Lazy` 介面的實例，請使用 `lazy()` 函式，並為其提供一個 lambda 運算式，該運算式將在首次呼叫 `get()` 函式時執行。對 `get()` 函式的任何後續呼叫都將返回首次呼叫時提供的相同結果。延遲屬性使用 [尾隨 lambda](kotlin-tour-functions.md#trailing-lambdas) 語法來傳遞 lambda 運算式。

例如：

```kotlin
class Database {
    fun connect() {
        println("Connecting to the database...")
    }

    fun query(sql: String): List<String> {
        return listOf("Data1", "Data2", "Data3")
    }
}

val databaseConnection: Database by lazy {
    val db = Database()
    db.connect()
    db
}

fun fetchData() {
    val data = databaseConnection.query("SELECT * FROM data")
    println("Data: $data")
}

fun main() {
    // First time accessing databaseConnection
    fetchData()
    // Connecting to the database...
    // Data: [Data1, Data2, Data3]

    // Subsequent access uses the existing connection
    fetchData()
    // Data: [Data1, Data2, Data3]
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-lazy"}

在此範例中：

*   有一個 `Database` 類別，包含 `connect()` 和 `query()` 成員函式。
*   `connect()` 函式會將一個字串列印到控制台，而 `query()` 函式接受一個 SQL 查詢並返回一個列表。
*   有一個 `databaseConnection` 屬性，它是一個延遲屬性。
*   提供給 `lazy()` 函式的 lambda 運算式：
    *   建立一個 `Database` 類別的實例。
    *   在此實例 (`db`) 上呼叫 `connect()` 成員函式。
    *   返回該實例。
*   有一個 `fetchData()` 函式：
    *   透過在 `databaseConnection` 屬性上呼叫 `query()` 函式來建立一個 SQL 查詢。
    *   將 SQL 查詢賦值給 `data` 變數。
    *   將 `data` 變數列印到控制台。
*   `main()` 函式呼叫 `fetchData()` 函式。首次呼叫時，延遲屬性會被初始化。第二次呼叫時，會返回與首次呼叫相同的結果。

延遲屬性不僅在初始化需要大量資源時有用，而且在屬性可能不會在您的程式碼中使用時也很有用。此外，延遲屬性預設是執行緒安全的，這在您處理併發環境時特別有利。

如需更多資訊，請參閱 [延遲屬性](delegated-properties.md#lazy-properties)。

#### 可觀察屬性

若要監視屬性值是否變更，請使用可觀察屬性 (observable property)。當您想偵測屬性值變更並利用此資訊觸發反應時，可觀察屬性非常有用。標準函式庫提供了用於委託的 `Delegates` 物件。

若要建立可觀察屬性，您必須先匯入 `kotlin.properties.Delegates.observable`。然後，使用 `observable()` 函式，並為其提供一個 lambda 運算式，以便在屬性變更時執行。就像延遲屬性一樣，可觀察屬性使用 [尾隨 lambda](kotlin-tour-functions.md#trailing-lambdas) 語法來傳遞 lambda 運算式。

例如：

```kotlin
import kotlin.properties.Delegates.observable

class Thermostat {
    var temperature: Double by observable(20.0) { _, old, new ->
        if (new > 25) {
            println("Warning: Temperature is too high! ($old°C -> $new°C)")
        } else {
            println("Temperature updated: $old°C -> $new°C")
        }
    }
}

fun main() {
    val thermostat = Thermostat()
    thermostat.temperature = 22.5
    // Temperature updated: 20.0°C -> 22.5°C

    thermostat.temperature = 27.0
    // Warning: Temperature is too high! (22.5°C -> 27.0°C)
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-observable"}

在此範例中：

*   有一個 `Thermostat` 類別，其中包含一個可觀察屬性：`temperature`。
*   `observable()` 函式接受 `20.0` 作為參數，並用它來初始化屬性。
*   提供給 `observable()` 函式的 lambda 運算式：
    *   具有三個參數：
    *   `_`，它指向屬性本身。
    *   `old`，它是屬性的舊值。
    *   `new`，它是屬性的新值。
    *   檢查 `new` 參數是否大於 `25`，並根據結果將字串列印到控制台。
*   `main()` 函式：
    *   建立一個名為 `thermostat` 的 `Thermostat` 類別實例。
    *   將實例的 `temperature` 屬性值更新為 `22.5`，這會觸發一個帶有溫度更新的列印語句。
    *   將實例的 `temperature` 屬性值更新為 `27.0`，這會觸發一個帶有警告的列印語句。

可觀察屬性不僅對日誌記錄和偵錯很有用。您還可以使用它們來更新 UI 或執行額外檢查，例如驗證資料的有效性。

如需更多資訊，請參閱 [可觀察屬性](delegated-properties.md#observable-properties)。

## 練習

### 練習 1 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-1"}

您管理著一家書店的庫存系統。庫存儲存在一個列表中，每個項目代表特定書籍的數量。例如，`listOf(3, 0, 7, 12)` 表示書店有第一本書的 3 本、第二本書的 0 本、第三本書的 7 本和第四本書的 12 本。

編寫一個名為 `findOutOfStockBooks()` 的函式，該函式返回所有缺貨書籍的索引列表。

<deflist collapsible="true">
    <def title="提示 1">
        使用標準函式庫中的 <a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/indices.html"><code>indices</code></a> 擴充屬性。
    </def>
</deflist>

<deflist collapsible="true">
    <def title="提示 2">
        您可以使用 <a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/build-list.html"><code>buildList()</code></a> 函式來建立和管理列表，而不是手動建立並返回一個可變列表。<code>buildList()</code> 函式使用帶有接收者的 lambda，您已在前面的章節中學過。
    </def>
</deflist>

|--|--|

```kotlin
fun findOutOfStockBooks(inventory: List<Int>): List<Int> {
    // Write your code here
}

fun main() {
    val inventory = listOf(3, 0, 7, 0, 5)
    println(findOutOfStockBooks(inventory))
    // [1, 3]
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-exercise-1"}

|---|---|
```kotlin
fun findOutOfStockBooks(inventory: List<Int>): List<Int> {
    val outOfStockIndices = mutableListOf<Int>()
    for (index in inventory.indices) {
        if (inventory[index] == 0) {
            outOfStockIndices.add(index)
        }
    }
    return outOfStockIndices
}

fun main() {
    val inventory = listOf(3, 0, 7, 0, 5)
    println(findOutOfStockBooks(inventory))
    // [1, 3]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解法 1" id="kotlin-tour-properties-solution-1-1"}

|---|---|
```kotlin
fun findOutOfStockBooks(inventory: List<Int>): List<Int> = buildList {
    for (index in inventory.indices) {
        if (inventory[index] == 0) {
            add(index)
        }
    }
}

fun main() {
    val inventory = listOf(3, 0, 7, 0, 5)
    println(findOutOfStockBooks(inventory))
    // [1, 3]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解法 2" id="kotlin-tour-properties-solution-1-2"}

### 練習 2 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-2"}

您有一個旅行應用程式，需要同時顯示公里和英里兩種距離。為 `Double` 類型建立一個名為 `asMiles` 的擴充屬性，用於將公里距離轉換為英里：

> 將公里轉換為英里的公式是 `miles = kilometers * 0.621371`。
>
{style="note"}

<deflist collapsible="true">
    <def title="提示">
        請記住，擴充屬性需要一個自訂的 <code>get()</code> 函式。
    </def>
</deflist>

|---|---|

```kotlin
val // Write your code here

fun main() {
    val distanceKm = 5.0
    println("$distanceKm km is ${distanceKm.asMiles} miles")
    // 5.0 km is 3.106855 miles

    val marathonDistance = 42.195
    println("$marathonDistance km is ${marathonDistance.asMiles} miles")
    // 42.195 km is 26.218757 miles
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-exercise-2"}

|---|---|
```kotlin
val Double.asMiles: Double
    get() = this * 0.621371

fun main() {
    val distanceKm = 5.0
    println("$distanceKm km is ${distanceKm.asMiles} miles")
    // 5.0 km is 3.106855 miles

    val marathonDistance = 42.195
    println("$marathonDistance km is ${marathonDistance.asMiles} miles")
    // 42.195 km is 26.218757 miles
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解法" id="kotlin-tour-properties-solution-2"}

### 練習 3 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-3"}

您有一個系統健康檢查器，可以確定雲端系統的狀態。然而，它為了執行健康檢查而運行的兩個函式都是效能密集型的。使用延遲屬性來初始化檢查，以便只有在需要時才運行這些開銷大的函式：

|---|---|

```kotlin
fun checkAppServer(): Boolean {
    println("Performing application server health check...")
    return true
}

fun checkDatabase(): Boolean {
    println("Performing database health check...")
    return false
}

fun main() {
    // Write your code here

    when {
        isAppServerHealthy -> println("Application server is online and healthy")
        isDatabaseHealthy -> println("Database is healthy")
        else -> println("System is offline")
    }
    // Performing application server health check...
    // Application server is online and healthy
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-exercise-3"}

|---|---|
```kotlin
fun checkAppServer(): Boolean {
    println("Performing application server health check...")
    return true
}

fun checkDatabase(): Boolean {
    println("Performing database health check...")
    return false
}

fun main() {
    val isAppServerHealthy by lazy { checkAppServer() }
    val isDatabaseHealthy by lazy { checkDatabase() }

    when {
        isAppServerHealthy -> println("Application server is online and healthy")
        isDatabaseHealthy -> println("Database is healthy")
        else -> println("System is offline")
    }
   // Performing application server health check...
   // Application server is online and healthy
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解法" id="kotlin-tour-properties-solution-3"}

### 練習 4 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-4"}

您正在構建一個簡單的預算追蹤應用程式。該應用程式需要觀察使用者剩餘預算的變化，並在預算低於特定閾值時通知他們。您有一個 `Budget` 類別，它透過一個包含初始預算金額的 `totalBudget` 屬性進行初始化。在類別中，建立一個名為 `remainingBudget` 的可觀察屬性，該屬性會列印：

*   當值低於初始預算的 20% 時發出警告。
*   當預算從先前的值增加時發出鼓勵訊息。

|---|---|

```kotlin
import kotlin.properties.Delegates.observable

class Budget(val totalBudget: Int) {
    var remainingBudget: Int // Write your code here
}

fun main() {
    val myBudget = Budget(totalBudget = 1000)
    myBudget.remainingBudget = 800
    myBudget.remainingBudget = 150
    // Warning: Your remaining budget (150) is below 20% of your total budget.
    myBudget.remainingBudget = 50
    // Warning: Your remaining budget (50) is below 20% of your total budget.
    myBudget.remainingBudget = 300
    // Good news: Your remaining budget increased to 300.
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-exercise-4"}

|---|---|
```kotlin
import kotlin.properties.Delegates.observable

class Budget(val totalBudget: Int) {
  var remainingBudget: Int by observable(totalBudget) { _, oldValue, newValue ->
    if (newValue < totalBudget * 0.2) {
      println("Warning: Your remaining budget ($newValue) is below 20% of your total budget.")
    } else if (newValue > oldValue) {
      println("Good news: Your remaining budget increased to $newValue.")
    }
  }
}

fun main() {
  val myBudget = Budget(totalBudget = 1000)
  myBudget.remainingBudget = 800
  myBudget.remainingBudget = 150
  // Warning: Your remaining budget (150) is below 20% of your total budget.
  myBudget.remainingBudget = 50
  // Warning: Your remaining budget (50) is below 20% of your total budget.
  myBudget.remainingBudget = 300
  // Good news: Your remaining budget increased to 300.
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解法" id="kotlin-tour-properties-solution-4"}

## 下一步

[中級：空值安全](kotlin-tour-intermediate-null-safety.md)