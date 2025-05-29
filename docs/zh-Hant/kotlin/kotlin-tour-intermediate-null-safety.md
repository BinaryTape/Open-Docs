[//]: # (title: 中級：空值安全)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">擴充功能</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函式</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">帶有接收者的 Lambda 表達式</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">類別與介面</a><br />
        <img src="icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">物件</a><br />
        <img src="icon-6-done.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">開放類別與特殊類別</a><br />
        <img src="icon-7-done.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">屬性</a><br />
        <img src="icon-8.svg" width="20" alt="Eighth step" /> <strong>空值安全</strong><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">函式庫與 API</a></p>
</tldr>

在初學者導覽中，你學習了如何在程式碼中處理 `null` 值。本章涵蓋了空值安全功能的常見用法，以及如何充分利用它們。

## 智慧型轉型與安全轉型

Kotlin 有時可以在沒有明確宣告的情況下推斷類型。當你告訴 Kotlin 將變數或物件視為屬於特定類型時，此過程稱為**轉型 (casting)**。當類型自動轉型時，例如當它被推斷時，則稱為**智慧型轉型 (smart casting)**。

### `is` 與 `!is` 運算子

在我們探索轉型如何運作之前，讓我們先看看如何檢查物件是否具有特定類型。為此，你可以將 `is` 和 `!is` 運算子與 `when` 或 `if` 條件式表達式搭配使用：

* `is` 檢查物件是否具有該類型並回傳布林值。
* `!is` 檢查物件**不**具有該類型並回傳布林值。

例如：

```kotlin
fun printObjectType(obj: Any) {
    when (obj) {
        is Int -> println("It's an Integer with value $obj")
        !is Double -> println("It's NOT a Double")
        else -> println("Unknown type")
    }
}

fun main() {
    val myInt = 42
    val myDouble = 3.14
    val myList = listOf(1, 2, 3)
  
    // 類型是 Int
    printObjectType(myInt)
    // It's an Integer with value 42

    // 類型是 List，所以它不是 Double。
    printObjectType(myList)
    // It's NOT a Double

    // 類型是 Double，因此觸發 else 分支。
    printObjectType(myDouble)
    // Unknown type
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-casts"}

> 你已經在 [開放類別與特殊類別](kotlin-tour-intermediate-open-special-classes.md#sealed-classes) 章節中看到了如何將 `when` 條件式表達式與 `is` 和 `!is` 運算子搭配使用的範例。
> 
{style="tip"}

### `as` 與 `as?` 運算子

若要將物件明確地 _轉型_ 為任何其他類型，請使用 `as` 運算子。這包括將可空類型轉型為其非空對應類型。如果轉型不可能，程式將在**執行時**崩潰。這就是為什麼它被稱為**不安全**的轉型運算子。

```kotlin
fun main() {
//sampleStart
    val a: String? = null
    val b = a as String

    // 在執行時觸發錯誤
    print(b)
//sampleEnd
}
```
{kotlin-runnable="true" validate="false" id="kotlin-tour-null-safety-as-operator"}

若要將物件明確地轉型為非空類型，但在失敗時回傳 `null` 而不是拋出錯誤，請使用 `as?` 運算子。由於 `as?` 運算子在失敗時不會觸發錯誤，因此它被稱為**安全**的運算子。

```kotlin
fun main() {
//sampleStart
    val a: String? = null
    val b = a as? String

    // 回傳空值
    print(b)
    // null
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-safe-operator"}

你可以將 `as?` 運算子與 Elvis 運算子 `?:` 結合，將多行程式碼縮減為一行。例如，以下 `calculateTotalStringLength()` 函式計算混合清單中所有提供字串的總長度：

```kotlin
fun calculateTotalStringLength(items: List<Any>): Int {
    var totalLength = 0

    for (item in items) {
        totalLength += if (item is String) {
            item.length
        } else {
            0  // 對於非字串項目，新增 0
        }
    }

    return totalLength
}
```

這個範例：

* 使用 `totalLength` 變數作為計數器。
* 使用 `for` 迴圈遍歷清單中的每個項目。
* 使用 `if` 和 `is` 運算子檢查當前項目是否為字串：
  * 如果是，則將字串長度加到計數器中。
  * 如果不是，則不遞增計數器。
* 回傳 `totalLength` 變數的最終值。

這段程式碼可以縮減為：

```kotlin
fun calculateTotalStringLength(items: List<Any>): Int {
    return items.sumOf { (it as? String)?.length ?: 0 }
}
```

該範例使用 [`.sumOf()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/sum-of.html) 擴充功能並提供一個 Lambda 表達式，該表達式：

* 對於清單中的每個項目，使用 `as?` 執行對 `String` 的安全轉型。
* 如果呼叫不回傳 `null` 值，則使用安全呼叫 `?.` 存取 `length` 屬性。
* 如果安全呼叫回傳 `null` 值，則使用 Elvis 運算子 `?:` 回傳 `0`。

## 空值與集合

在 Kotlin 中，處理集合通常涉及處理 `null` 值並過濾掉不必要的元素。Kotlin 提供了有用的函式，你可以用它們來編寫簡潔、高效且空值安全的程式碼，以處理清單 (List)、集合 (Set)、映射 (Map) 和其他類型的集合。

若要從清單中過濾 `null` 值，請使用 [`filterNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter-not-null.html) 函式：

```kotlin
fun main() {
//sampleStart
    val emails: List<String?> = listOf("alice@example.com", null, "bob@example.com", null, "carol@example.com")

    val validEmails = emails.filterNotNull()

    println(validEmails)
    // [alice@example.com, bob@example.com, carol@example.com]
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-filternotnull"}

如果你想在建立清單時直接執行空值過濾，請使用 [`listOfNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/list-of-not-null.html) 函式：

```kotlin
fun main() {
//sampleStart
    val serverConfig = mapOf(
        "appConfig.json" to "App Configuration",
        "dbConfig.json" to "Database Configuration"
    )

    val requestedFile = "appConfig.json"
    val configFiles = listOfNotNull(serverConfig[requestedFile])

    println(configFiles)
    // [App Configuration]
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-listofnotnull"}

在這兩個範例中，如果所有項目都是 `null` 值，則回傳空清單。

Kotlin 還提供了可用於在集合中尋找值的函式。如果找不到值，它們會回傳 `null` 值而不是觸發錯誤：

* [`singleOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/single-or-null.html) 按其確切值尋找單一項目。如果不存在或有多個具有相同值的項目，則回傳 `null` 值。
* [`maxOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/max-or-null.html) 尋找最高值。如果不存在，則回傳 `null` 值。
* [`minOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/min-or-null.html) 尋找最低值。如果不存在，則回傳 `null` 值。

例如：

```kotlin
fun main() {
//sampleStart
    // 一週內記錄的溫度
    val temperatures = listOf(15, 18, 21, 21, 19, 17, 16)

    // 檢查是否只有一天是 30 度
    val singleHotDay = temperatures.singleOrNull()
    println("Single hot day with 30 degrees: ${singleHotDay ?: "None"}")
    // Single hot day with 30 degrees: None

    // 尋找本週最高溫度
    val maxTemperature = temperatures.maxOrNull()
    println("Highest temperature recorded: ${maxTemperature ?: "No data"}")
    // Highest temperature recorded: 21

    // 尋找本週最低溫度
    val minTemperature = temperatures.minOrNull()
    println("Lowest temperature recorded: ${minTemperature ?: "No data"}")
    // Lowest temperature recorded: 15
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-collections"}

此範例使用 Elvis 運算子 `?:`，如果函式回傳 `null` 值，則回傳列印的語句。

> `singleOrNull()`、`maxOrNull()` 和 `minOrNull()` 函式旨在與**不**包含 `null` 值的集合一起使用。否則，你無法判斷函式是未能找到所需值，還是找到了 `null` 值。
>
{style="note"}

某些函式使用 Lambda 表達式來轉換集合，如果它們無法達到其目的，則會回傳 `null` 值。

例如，若要使用 Lambda 表達式轉換集合並回傳第一個非 `null` 值，請使用 [`firstNotNullOfOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/first-not-null-of-or-null.html) 函式。如果不存在這樣的值，函式會回傳 `null` 值：

```kotlin
fun main() {
//sampleStart
    data class User(val name: String?, val age: Int?)

    val users = listOf(
        User(null, 25),
        User("Alice", null),
        User("Bob", 30)
    )

    val firstNonNullName = users.firstNotNullOfOrNull { it.name }
    println(firstNonNullName)
    // Alice
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-firstnotnullofornull"}

若要使用 Lambda 函式依序處理每個集合項目並建立累積值（或在集合為空時回傳 `null` 值），請使用 [`reduceOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/reduce-or-null.html) 函式：

```kotlin
fun main() {
//sampleStart
    // 購物車中的商品價格
    val itemPrices = listOf(20, 35, 15, 40, 10)

    // 使用 reduceOrNull() 函式計算總價
    val totalPrice = itemPrices.reduceOrNull { runningTotal, price -> runningTotal + price }
    println("Total price of items in the cart: ${totalPrice ?: "No items"}")
    // Total price of items in the cart: 120

    val emptyCart = listOf<Int>()
    val emptyTotalPrice = emptyCart.reduceOrNull { runningTotal, price -> runningTotal + price }
    println("Total price of items in the empty cart: ${emptyTotalPrice ?: "No items"}")
    // Total price of items in the empty cart: No items
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-reduceornull"}

此範例也使用 Elvis 運算子 `?:`，如果函式回傳 `null` 值，則回傳列印的語句。

> `reduceOrNull()` 函式旨在與**不**包含 `null` 值的集合一起使用。
>
{style="note"}

探索 Kotlin 的 [標準函式庫](https://kotlinlang.org/api/core/kotlin-stdlib/) 以尋找更多可以讓你的程式碼更安全的函式。

## 提前回傳與 Elvis 運算子

在初學者導覽中，你學習了如何使用[提前回傳](kotlin-tour-functions.md#early-returns-in-functions)來阻止函式在某個點之後繼續處理。你可以將 Elvis 運算子 `?:` 與提前回傳搭配使用，以檢查函式中的前置條件。這種方法是保持程式碼簡潔的好方法，因為你不需要使用巢狀檢查。程式碼複雜性的降低也使其更易於維護。例如：

```kotlin
data class User(
    val id: Int,
    val name: String,
    // 朋友使用者 ID 清單
    val friends: List<Int>
)

// 取得使用者朋友數量的函式
fun getNumberOfFriends(users: Map<Int, User>, userId: Int): Int {
    // 擷取使用者，如果找不到則回傳 -1
    val user = users[userId] ?: return -1
    // 回傳朋友數量
    return user.friends.size
}

fun main() {
    // 建立一些範例使用者
    val user1 = User(1, "Alice", listOf(2, 3))
    val user2 = User(2, "Bob", listOf(1))
    val user3 = User(3, "Charlie", listOf(1))

    // 建立使用者映射 (Map)
    val users = mapOf(1 to user1, 2 to user2, 3 to user3)

    println(getNumberOfFriends(users, 1))
    // 2
    println(getNumberOfFriends(users, 2))
    // 1
    println(getNumberOfFriends(users, 4))
    // -1
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-early-return"}

在此範例中：

* 有一個 `User` 資料類別，它具有使用者 `id`、`name` 和朋友清單的屬性。
* `getNumberOfFriends()` 函式：
  * 接受 `User` 實例的映射和一個整數形式的使用者 ID。
  * 使用提供的使用者 ID 存取 `User` 實例映射的值。
  * 使用 Elvis 運算子，如果映射值為空值，則提前回傳函式並帶有 `-1` 的值。
  * 將從映射中找到的值賦予 `user` 變數。
  * 透過使用 `size` 屬性回傳使用者朋友清單中的朋友數量。
* `main()` 函式：
  * 建立三個 `User` 實例。
  * 建立這些 `User` 實例的映射並將其賦予 `users` 變數。
  * 使用值 `1` 和 `2` 呼叫 `users` 變數上的 `getNumberOfFriends()` 函式，這會為「Alice」回傳兩位朋友，為「Bob」回傳一位朋友。
  * 使用值 `4` 呼叫 `users` 變數上的 `getNumberOfFriends()` 函式，這會觸發提前回傳並帶有 `-1` 的值。

你可能會注意到，如果沒有提前回傳，程式碼可以更簡潔。然而，這種方法需要多個安全呼叫，因為 `users[userId]` 可能會回傳 `null` 值，這會使程式碼稍微難以閱讀：

```kotlin
fun getNumberOfFriends(users: Map<Int, User>, userId: Int): Int {
    // Retrieve the user or return -1 if not found
    return users[userId]?.friends?.size ?: -1
}
```
{validate="false"}

儘管此範例只用 Elvis 運算子檢查一個條件，但你可以新增多個檢查來涵蓋任何關鍵錯誤路徑。使用 Elvis 運算子進行提前回傳可防止你的程式執行不必要的工作，並在偵測到 `null` 值或無效情況時立即停止，從而使程式碼更安全。

有關如何在程式碼中使用 `return` 的更多資訊，請參閱 [回傳與跳轉](returns.md)。

## 練習

### 練習 1 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-1"}

你正在為一個應用程式開發通知系統，使用者可以在其中啟用或停用不同類型的通知。完成 `getNotificationPreferences()` 函式，使其：

1. `validUser` 變數使用 `as?` 運算子檢查 `user` 是否為 `User` 類別的實例。如果不是，則回傳空清單。
2. `userName` 變數使用 Elvis `?:` 運算子確保，如果使用者名稱為 `null`，則預設為「Guest」。
3. 最終回傳語句使用 `.takeIf()` 函式，僅在啟用電子郵件和簡訊通知偏好設定時才包含它們。
4. `main()` 函式成功執行並列印預期輸出。

> [`takeIf()` 函式](scope-functions.md#takeif-and-takeunless) 如果給定條件為真，則回傳原始值，否則回傳 `null`。例如：
>
> ```kotlin
> fun main() {
>     // 使用者已登入
>     val userIsLoggedIn = true
>     // 使用者有活動會話
>     val hasSession = true
> 
>     // 如果使用者已登入且有活動會話，則授予儀表板存取權
>     val canAccessDashboard = userIsLoggedIn.takeIf { hasSession }
> 
>     println(canAccessDashboard ?: "Access denied")
>     // true
> }
> ```
>
{style="tip"}

|--|--|

```kotlin
data class User(val name: String?)

fun getNotificationPreferences(user: Any, emailEnabled: Boolean, smsEnabled: Boolean): List<String> {
    val validUser = // Write your code here
    val userName = // Write your code here

    return listOfNotNull( /* Write your code here */)
}

fun main() {
    val user1 = User("Alice")
    val user2 = User(null)
    val invalidUser = "NotAUser"

    println(getNotificationPreferences(user1, emailEnabled = true, smsEnabled = false))
    // [Email Notifications enabled for Alice]
    println(getNotificationPreferences(user2, emailEnabled = false, smsEnabled = true))
    // [SMS Notifications enabled for Guest]
    println(getNotificationPreferences(invalidUser, emailEnabled = true, smsEnabled = true))
    // []
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-null-safety-exercise-1"}

|--|--|

```kotlin
data class User(val name: String?)

fun getNotificationPreferences(user: Any, emailEnabled: Boolean, smsEnabled: Boolean): List<String> {
    val validUser = user as? User ?: return emptyList()
    val userName = validUser.name ?: "Guest"

    return listOfNotNull(
        "Email Notifications enabled for $userName".takeIf { emailEnabled },
        "SMS Notifications enabled for $userName".takeIf { smsEnabled }
    )
}

fun main() {
    val user1 = User("Alice")
    val user2 = User(null)
    val invalidUser = "NotAUser"

    println(getNotificationPreferences(user1, emailEnabled = true, smsEnabled = false))
    // [Email Notifications enabled for Alice]
    println(getNotificationPreferences(user2, emailEnabled = false, smsEnabled = true))
    // [SMS Notifications enabled for Guest]
    println(getNotificationPreferences(invalidUser, emailEnabled = true, smsEnabled = true))
    // []
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解決方案" id="kotlin-tour-null-safety-solution-1"}

### 練習 2 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-2"}

你正在開發一個訂閱制串流服務，使用者可以有多個訂閱，但**一次只能有一個處於活動狀態**。完成 `getActiveSubscription()` 函式，使其使用帶有判斷式的 `singleOrNull()` 函式，以便在有多於一個的活動訂閱時回傳 `null` 值：

|--|--|

```kotlin
data class Subscription(val name: String, val isActive: Boolean)

fun getActiveSubscription(subscriptions: List<Subscription>): Subscription? // Write your code here

fun main() {
    val userWithPremiumPlan = listOf(
        Subscription("Basic Plan", false),
        Subscription("Premium Plan", true)
    )

    val userWithConflictingPlans = listOf(
        Subscription("Basic Plan", true),
        Subscription("Premium Plan", true)
    )

    println(getActiveSubscription(userWithPremiumPlan))
    // Subscription(name=Premium Plan, isActive=true)

    println(getActiveSubscription(userWithConflictingPlans))
    // null
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-null-safety-exercise-2"}

|--|--|

```kotlin
data class Subscription(val name: String, val isActive: Boolean)

fun getActiveSubscription(subscriptions: List<Subscription>): Subscription? {
    return subscriptions.singleOrNull { subscription -> subscription.isActive }
}

fun main() {
    val userWithPremiumPlan = listOf(
        Subscription("Basic Plan", false),
        Subscription("Premium Plan", true)
    )

    val userWithConflictingPlans = listOf(
        Subscription("Basic Plan", true),
        Subscription("Premium Plan", true)
    )

    println(getActiveSubscription(userWithPremiumPlan))
    // Subscription(name=Premium Plan, isActive=true)

    println(getActiveSubscription(userWithConflictingPlans))
    // null
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解決方案 1" id="kotlin-tour-null-safety-solution-2-1"}

|--|--|

```kotlin
data class Subscription(val name: String, val isActive: Boolean)

fun getActiveSubscription(subscriptions: List<Subscription>): Subscription? =
    subscriptions.singleOrNull { it.isActive }

fun main() {
    val userWithPremiumPlan = listOf(
        Subscription("Basic Plan", false),
        Subscription("Premium Plan", true)
    )

    val userWithConflictingPlans = listOf(
        Subscription("Basic Plan", true),
        Subscription("Premium Plan", true)
    )

    println(getActiveSubscription(userWithPremiumPlan))
    // Subscription(name=Premium Plan, isActive=true)

    println(getActiveSubscription(userWithConflictingPlans))
    // null
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解決方案 2" id="kotlin-tour-null-safety-solution-2-2"}

### 練習 3 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-3"}

你正在開發一個社群媒體平台，使用者有使用者名稱和帳戶狀態。你希望看到當前活動使用者名稱的清單。完成 `getActiveUsernames()` 函式，使其 [`mapNotNull()` 函式](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/map-not-null.html) 具有一個判斷式，如果使用者名稱為活動狀態則回傳使用者名稱，否則回傳 `null` 值：

|--|--|

```kotlin
data class User(val username: String, val isActive: Boolean)

fun getActiveUsernames(users: List<User>): List<String> {
    return users.mapNotNull { /* Write your code here */ }
}

fun main() {
    val allUsers = listOf(
        User("alice123", true),
        User("bob_the_builder", false),
        User("charlie99", true)
    )

    println(getActiveUsernames(allUsers))
    // [alice123, charlie99]
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-null-safety-exercise-3"}

|--|--|

> 就像練習 1 中一樣，當你檢查使用者是否活動時，可以使用 [`takeIf()` 函式](scope-functions.md#takeif-and-takeunless)。
>
{ style = "tip" }

|--|--|

```kotlin
data class User(val username: String, val isActive: Boolean)

fun getActiveUsernames(users: List<User>): List<String> {
    return users.mapNotNull { user ->
        if (user.isActive) user.username else null
    }
}

fun main() {
    val allUsers = listOf(
        User("alice123", true),
        User("bob_the_builder", false),
        User("charlie99", true)
    )

    println(getActiveUsernames(allUsers))
    // [alice123, charlie99]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解決方案 1" id="kotlin-tour-null-safety-solution-3-1"}

|--|--|

```kotlin
data class User(val username: String, val isActive: Boolean)

fun getActiveUsernames(users: List<User>): List<String> = users.mapNotNull { user -> user.username.takeIf { user.isActive } }

fun main() {
    val allUsers = listOf(
        User("alice123", true),
        User("bob_the_builder", false),
        User("charlie99", true)
    )

    println(getActiveUsernames(allUsers))
    // [alice123, charlie99]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解決方案 2" id="kotlin-tour-null-safety-solution-3-2"}

### 練習 4 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-4"}

你正在為電子商務平台開發庫存管理系統。在處理銷售之前，你需要根據可用庫存檢查請求的產品數量是否有效。

完成 `validateStock()` 函式，使其使用提前回傳和 Elvis 運算子（如果適用）來檢查是否：

* `requested` 變數為 `null`。
* `available` 變數為 `null`。
* `requested` 變數為負值。
* `requested` 變數中的數量高於 `available` 變數中的數量。

在所有上述情況下，函式必須提前回傳 `-1` 值。

|--|--|

```kotlin
fun validateStock(requested: Int?, available: Int?): Int {
    // Write your code here
}

fun main() {
    println(validateStock(5,10))
    // 5
    println(validateStock(null,10))
    // -1
    println(validateStock(-2,10))
    // -1
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-null-safety-exercise-4"}

|--|--|

```kotlin
fun validateStock(requested: Int?, available: Int?): Int {
    val validRequested = requested ?: return -1
    val validAvailable = available ?: return -1

    if (validRequested < 0) return -1
    if (validRequested > validAvailable) return -1

    return validRequested
}

fun main() {
    println(validateStock(5,10))
    // 5
    println(validateStock(null,10))
    // -1
    println(validateStock(-2,10))
    // -1
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解決方案" id="kotlin-tour-null-safety-solution-4"}

## 下一步

[中級：函式庫與 API](kotlin-tour-intermediate-libraries-and-apis.md)