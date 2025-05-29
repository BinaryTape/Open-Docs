[//]: # (title: 中級：屬性)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="第一步" /> <a href="kotlin-tour-intermediate-extension-functions.md">擴充函數</a><br />
        <img src="icon-2-done.svg" width="20" alt="第二步" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函數</a><br />
        <img src="icon-3-done.svg" width="20" alt="第三步" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">帶有接收者的 Lambda 表達式</a><br />
        <img src="icon-4-done.svg" width="20" alt="第四步" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">類別與介面</a><br />
        <img src="icon-5-done.svg" width="20" alt="第五步" /> <a href="kotlin-tour-intermediate-objects.md">物件</a><br />
        <img src="icon-6-done.svg" width="20" alt="第六步" /> <a href="kotlin-tour-intermediate-open-special-classes.md">開放與特殊類別</a><br />
        <img src="icon-7.svg" width="20" alt="第七步" /> <strong>屬性</strong><br />
        <img src="icon-8-todo.svg" width="20" alt="第八步" /> <a href="kotlin-tour-intermediate-null-safety.md">空值安全</a><br />
        <img src="icon-9-todo.svg" width="20" alt="第九步" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">函式庫與 API</a></p>
</tldr>

在初學者指南中，您學會了如何使用屬性來宣告類別實例的特徵以及如何存取它們。本章將深入探討 Kotlin 中屬性的運作方式，並探索您在程式碼中可以使用它們的其他方法。

## 後備欄位

在 Kotlin 中，屬性具有預設的 `get()` 和 `set()` 函數，稱為屬性存取器，它們負責擷取和修改屬性值。雖然這些預設函數在程式碼中不明顯可見，但編譯器會自動生成它們以在幕後管理屬性存取。這些存取器使用一個**後備欄位 (backing field)** 來儲存實際的屬性值。

後備欄位存在於以下任一情況：

*   您使用屬性的預設 `get()` 或 `set()` 函數。
*   您嘗試透過使用 `field` 關鍵字在程式碼中存取屬性值。

> `get()` 和 `set()` 函數也稱為 getter 和 setter。
>
{style="tip"}

例如，此程式碼中的 `category` 屬性沒有自訂的 `get()` 或 `set()` 函數，因此使用預設實作：

```kotlin
class Contact(val id: Int, var email: String) {
    val category: String = ""
}
```

在底層，這等同於以下偽程式碼：

```kotlin
class Contact(val id: Int, var email: String) {
    val category: String = ""
        get() = field
        set(value) {
            field = value
        }
}
```
{validate="false"}

在此範例中：

*   `get()` 函數從欄位 (`""`) 擷取屬性值。
*   `set()` 函數接受 `value` 作為參數並將其賦值給欄位，其中 `value` 是 `""`。

當您想要在 `get()` 或 `set()` 函數中新增額外邏輯而不會導致無限迴圈時，存取後備欄位會很有用。例如，您有一個 `Person` 類別，其中包含一個 `name` 屬性：

```kotlin
class Person {
    var name: String = ""
}
```

您想要確保 `name` 屬性的第一個字母大寫，因此您建立了一個自訂的 `set()` 函數，該函數使用 [`.replaceFirstChar()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/replace-first-char.html) 和 [`.uppercase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/uppercase-char.html) 擴充函數。然而，如果您在 `set()` 函數中直接引用屬性，則會建立無限迴圈並在執行期看到 `StackOverflowError`：

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
{validate ="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-properties-stackoverflow"}

若要解決此問題，您可以在 `set()` 函數中使用後備欄位，方法是使用 `field` 關鍵字來引用它：

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

當您想要新增日誌記錄、在屬性值改變時傳送通知，或使用比較舊值和新值的額外邏輯時，後備欄位也會很有用。

如需更多資訊，請參閱 [後備欄位](properties.md#backing-fields)。

## 擴充屬性

就像擴充函數一樣，也有擴充屬性。擴充屬性允許您為現有類別新增屬性，而無需修改其原始碼。然而，Kotlin 中的擴充屬性**沒有**後備欄位。這表示您需要自己編寫 `get()` 和 `set()` 函數。此外，缺乏後備欄位意味著它們無法持有任何狀態。

若要宣告擴充屬性，請寫下您要擴充的類別名稱，然後是 `.` 和您的屬性名稱。就像普通的類別屬性一樣，您需要為您的屬性宣告一個接收者類型。例如：

```kotlin
val String.lastChar: Char
```
{validate="false"}

當您希望屬性包含計算值而無需使用繼承時，擴充屬性最為有用。您可以將擴充屬性視為只有一個參數（接收者物件）的函數。

例如，假設您有一個名為 `Person` 的資料類別，其中包含兩個屬性：`firstName` 和 `lastName`。

```kotlin
data class Person(val firstName: String, val lastName: String)
```

您希望能夠存取人員的完整姓名，而無需修改 `Person` 資料類別或從中繼承。您可以透過建立一個帶有自訂 `get()` 函數的擴充屬性來實現此目的：

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

就像擴充函數一樣，Kotlin 標準函式庫廣泛使用擴充屬性。例如，請參閱 `CharSequence` 的 [`lastIndex` 屬性](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/last-index.html)。

## 委託屬性

您已經在 [類別與介面](kotlin-tour-intermediate-classes-interfaces.md#delegation) 章節中學到了委託。您也可以將委託與屬性一起使用，以將其屬性存取器委託給另一個物件。當您對儲存屬性有更複雜的要求，而簡單的後備欄位無法處理時（例如將值儲存在資料庫表格、瀏覽器會話或 Map 中），這會很有用。使用委託屬性還可以減少樣板程式碼，因為獲取和設定屬性的邏輯只包含在您委託的物件中。

語法類似於與類別一起使用委託，但在不同的層級上運作。宣告您的屬性，然後是 `by` 關鍵字以及您要委託的物件。例如：

```kotlin
val displayName: String by Delegate
```

在這裡，委託屬性 `displayName` 參考 `Delegate` 物件以取得其屬性存取器。

您委託的每個物件**都必須**具有 `getValue()` 運算子函數，Kotlin 用它來擷取委託屬性的值。如果屬性是可變的，則它也必須具有 `setValue()` 運算子函數，供 Kotlin 設定其值。

預設情況下，`getValue()` 和 `setValue()` 函數具有以下結構：

```kotlin
operator fun getValue(thisRef: Any?, property: KProperty<*>): String {}

operator fun setValue(thisRef: Any?, property: KProperty<*>, value: String) {}
```
{validate="false"}

在這些函數中：

*   `operator` 關鍵字將這些函數標記為運算子函數，使其能夠多載 `get()` 和 `set()` 函數。
*   `thisRef` 參數參考**包含**委託屬性的物件。預設情況下，類型設定為 `Any?`，但您可能需要宣告更具體的類型。
*   `property` 參數參考其值被存取或更改的屬性。您可以使用此參數來存取諸如屬性名稱或類型等資訊。預設情況下，類型設定為 `Any?`。您無需擔心在程式碼中更改此項。

`getValue()` 函數的預設回傳類型為 `String`，但您可以根據需要進行調整。

`setValue()` 函數有一個額外的參數 `value`，用於保存賦予屬性的新值。

那麼，這在實踐中看起來如何呢？假設您想要一個計算屬性，例如使用者的顯示名稱，由於操作成本高昂且您的應用程式對效能敏感，因此該屬性只計算一次。您可以使用委託屬性來快取顯示名稱，以便它只計算一次，但可以隨時存取而不會影響效能。

首先，您需要建立要委託的物件。在此情況下，該物件將是 `CachedStringDelegate` 類別的實例：

```kotlin
class CachedStringDelegate {
    var cachedValue: String? = null
}
```

`cachedValue` 屬性包含快取值。在 `CachedStringDelegate` 類別中，將您想要的委託屬性的 `get()` 函數行為新增到 `getValue()` 運算子函數主體中：

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

`getValue()` 函數檢查 `cachedValue` 屬性是否為 `null`。如果是，函數會賦予 `"Default value"` 並列印用於日誌記錄目的的字串。如果 `cachedValue` 屬性已經計算過，則該屬性不是 `null`。在此情況下，會列印另一個用於日誌記錄目的的字串。最後，函數使用 Elvis 運算子回傳快取值，如果該值為 `null`，則回傳 `"Unknown"`。

現在您可以將要快取的屬性 (`val displayName`) 委託給 `CachedStringDelegate` 類別的實例：

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

*   建立一個 `User` 類別，該類別在標頭中有兩個屬性 `firstName` 和 `lastName`，在類別主體中有一個屬性 `displayName`。
*   將 `displayName` 屬性委託給 `CachedStringDelegate` 類別的實例。
*   建立一個名為 `user` 的 `User` 類別實例。
*   列印存取 `user` 實例上 `displayName` 屬性的結果。

請注意，在 `getValue()` 函數中，`thisRef` 參數的類型從 `Any?` 類型縮小到物件類型：`User`。這是為了讓編譯器可以存取 `User` 類別的 `firstName` 和 `lastName` 屬性。

### 標準委託

Kotlin 標準函式庫為您提供了一些有用的委託，因此您不必總是從頭開始建立自己的委託。如果您使用其中一個委託，則無需定義 `getValue()` 和 `setValue()` 函數，因為標準函式庫會自動提供它們。

#### 惰性屬性

若要僅在首次存取屬性時才初始化它，請使用惰性屬性。標準函式庫提供了用於委託的 `Lazy` 介面。

若要建立 `Lazy` 介面的實例，請使用 `lazy()` 函數，並向其提供一個 Lambda 表達式，以便在首次呼叫 `get()` 函數時執行。隨後對 `get()` 函數的任何呼叫都將回傳首次呼叫時提供的相同結果。惰性屬性使用 [尾隨 Lambda](kotlin-tour-functions.md#trailing-lambdas) 語法來傳遞 Lambda 表達式。

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

*   有一個 `Database` 類別，其中包含 `connect()` 和 `query()` 成員函數。
*   `connect()` 函數會將字串列印到控制台，`query()` 函數會接受 SQL 查詢並回傳一個列表。
*   有一個 `databaseConnection` 屬性，它是一個惰性屬性。
*   提供給 `lazy()` 函數的 Lambda 表達式：
    *   建立 `Database` 類別的實例。
    *   在此實例 (`db`) 上呼叫 `connect()` 成員函數。
    *   回傳該實例。
*   有一個 `fetchData()` 函數，它：
    *   透過在 `databaseConnection` 屬性上呼叫 `query()` 函數來建立 SQL 查詢。
    *   將 SQL 查詢賦予 `data` 變數。
    *   將 `data` 變數列印到控制台。
*   `main()` 函數呼叫 `fetchData()` 函數。首次呼叫時，惰性屬性會被初始化。第二次呼叫時，會回傳與首次呼叫相同的結果。

惰性屬性不僅在初始化資源密集型時很有用，而且在您的程式碼中可能不使用屬性時也很有用。此外，惰性屬性預設是執行緒安全的，這在您處理並行環境時尤其有利。

如需更多資訊，請參閱 [惰性屬性](delegated-properties.md#lazy-properties)。

#### 可觀察屬性

若要監控屬性值是否改變，請使用可觀察屬性。當您想要偵測屬性值的變化並利用此知識觸發反應時，可觀察屬性會很有用。標準函式庫提供了用於委託的 `Delegates` 物件。

若要建立可觀察屬性，您必須先匯入 `kotlin.properties.Delegates.observable`。然後，使用 `observable()` 函數並向其提供一個 Lambda 表達式，以便在屬性改變時執行。就像惰性屬性一樣，可觀察屬性使用 [尾隨 Lambda](kotlin-tour-functions.md#trailing-lambdas) 語法來傳遞 Lambda 表達式。

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
*   `observable()` 函數接受 `20.0` 作為參數，並用它來初始化屬性。
*   提供給 `observable()` 函數的 Lambda 表達式：
    *   有三個參數：
        *   `_`，參考屬性本身。
        *   `old`，是屬性的舊值。
        *   `new`，是屬性的新值。
    *   檢查 `new` 參數是否大於 `25`，並根據結果將字串列印到控制台。
*   `main()` 函數：
    *   建立一個名為 `thermostat` 的 `Thermostat` 類別實例。
    *   將實例的 `temperature` 屬性值更新為 `22.5`，這會觸發帶有溫度更新的列印語句。
    *   將實例的 `temperature` 屬性值更新為 `27.0`，這會觸發帶有警告的列印語句。

可觀察屬性不僅對日誌記錄和偵錯目的很有用。您也可以將它們用於更新 UI 或執行額外檢查（例如驗證資料的有效性）等用例。

如需更多資訊，請參閱 [可觀察屬性](delegated-properties.md#observable-properties)。

## 練習

### 練習 1 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-1"}

您管理書店的庫存系統。庫存儲存在列表中，其中每個項目代表特定書籍的數量。例如，`listOf(3, 0, 7, 12)` 表示書店有 3 本第一本書、0 本第二本書、7 本第三本書和 12 本第四本書。

編寫一個名為 `findOutOfStockBooks()` 的函數，該函數回傳所有缺貨書籍的索引列表。

<deflist collapsible="true">
    <def title="提示 1">
        使用標準函式庫中的 <a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/indices.html"><code>indices</code></a> 擴充屬性。
    </def>
</deflist>

<deflist collapsible="true">
    <def title="提示 2">
        您可以使用 <a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/build-list.html"><code>buildList()</code></a> 函數來建立和管理列表，而不是手動建立和回傳可變列表。<code>buildList()</code> 函數使用帶有接收者的 Lambda，您在之前的章節中學過。
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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解決方案 1" id="kotlin-tour-properties-solution-1-1"}

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解決方案 2" id="kotlin-tour-properties-solution-1-2"}

### 練習 2 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-2"}

您有一個旅遊應用程式，需要同時顯示公里和英里兩種距離。為 `Double` 類型建立一個名為 `asMiles` 的擴充屬性，用於將公里距離轉換為英里：

> 將公里轉換為英里的公式為：`英里 = 公里 * 0.621371`。
>
{style="note"}

<deflist collapsible="true">
    <def title="提示">
        請記住，擴充屬性需要自訂的 <code>get()</code> 函數。
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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解決方案" id="kotlin-tour-properties-solution-2"}

### 練習 3 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-3"}

您有一個系統健康檢查器，可以確定雲端系統的狀態。但是，它可以執行的兩個健康檢查函數的效能密集。使用惰性屬性來初始化檢查，以便只有在需要時才執行這些耗費資源的函數：

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解決方案" id="kotlin-tour-properties-solution-3"}

### 練習 4 {initial-collapse-state="collapsed" collapsible="true" id="properties-exercise-4"}

您正在建立一個簡單的預算追蹤應用程式。該應用程式需要觀察使用者剩餘預算的變化，並在預算低於特定閾值時通知他們。您有一個 `Budget` 類別，它透過 `totalBudget` 屬性初始化，該屬性包含初始預算金額。在類別中，建立一個名為 `remainingBudget` 的可觀察屬性，該屬性會列印：

*   當值低於初始預算的 20% 時的警告。
*   當預算從先前值增加時的鼓勵訊息。

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解決方案" id="kotlin-tour-properties-solution-4"}

## 下一步

[中級：空值安全](kotlin-tour-intermediate-null-safety.md)