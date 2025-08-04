[//]: # (title: 中階：空值安全性)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="第一步" /> <a href="kotlin-tour-intermediate-extension-functions.md">擴充函式</a><br />
        <img src="icon-2-done.svg" width="20" alt="第二步" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函式</a><br />
        <img src="icon-3-done.svg" width="20" alt="第三步" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">帶有接收者的 Lambda 表達式</a><br />
        <img src="icon-4-done.svg" width="20" alt="第四步" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">類別與介面</a><br />
        <img src="icon-5-done.svg" width="20" alt="第五步" /> <a href="kotlin-tour-intermediate-objects.md">物件</a><br />
        <img src="icon-6-done.svg" width="20" alt="第六步" /> <a href="kotlin-tour-intermediate-open-special-classes.md">開放類別與特殊類別</a><br />
        <img src="icon-7-done.svg" width="20" alt="第七步" /> <a href="kotlin-tour-intermediate-properties.md">屬性</a><br />
        <img src="icon-8.svg" width="20" alt="第八步" /> <strong>空值安全性</strong><br />
        <img src="icon-9-todo.svg" width="20" alt="第九步" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">函式庫與 API</a></p>
</tldr>

在初學者導覽中，你已學習如何在程式碼中處理 `null` 值。本章節涵蓋空值安全功能的常見使用案例，以及如何充分利用它們。

## 智慧型轉型與安全轉型

Kotlin 有時可以在沒有明確宣告的情況下推斷類型。當你告訴 Kotlin 將變數或物件視為屬於特定類型時，這個過程稱為**轉型**。當類型自動轉型時，例如當它被推斷時，則稱為**智慧型轉型**。

### `is` 與 `!is` 運算子

在我們探索轉型如何運作之前，讓我們先看看如何檢查物件是否具有某種類型。為此，你可以搭配 `when` 或 `if` 條件式表達式使用 `is` 和 `!is` 運算子：

*   `is` 檢查物件是否具有該類型並回傳布林值。
*   `!is` 檢查物件是否**不**具有該類型並回傳布林值。

例如：

```kotlin
fun printObjectType(obj: Any) {
    when (obj) {
        is Int -> println("它是值為 $obj 的整數")
        !is Double -> println("它不是 Double")
        else -> println("未知類型")
    }
}

fun main() {
    val myInt = 42
    val myDouble = 3.14
    val myList = listOf(1, 2, 3)
  
    // 類型為 Int
    printObjectType(myInt)
    // 它是值為 42 的整數

    // 類型為 List，因此它不是 Double。
    printObjectType(myList)
    // 它不是 Double

    // 類型為 Double，因此觸發 else 分支。
    printObjectType(myDouble)
    // 未知類型
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-casts"}

> 你已在 [開放類別與其他特殊類別](kotlin-tour-intermediate-open-special-classes.md#sealed-classes) 章節中，看過如何搭配 `is` 與 `!is` 運算子使用 `when` 條件式表達式的範例。
> 
{style="tip"}

### `as` 與 `as?` 運算子

若要將物件**明確地** _轉型_ 為任何其他類型，請使用 `as` 運算子。這包含將可空類型轉型為其非空對應類型。如果轉型不可行，程式將在**執行時**崩潰。這就是為什麼它被稱為**不安全**的轉型運算子。

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

若要將物件明確轉型為非空類型，但在失敗時回傳 `null` 而非拋出錯誤，請使用 `as?` 運算子。由於 `as?` 運算子在失敗時不會觸發錯誤，因此它被稱為**安全**運算子。

```kotlin
fun main() {
//sampleStart
    val a: String? = null
    val b = a as? String

    // 回傳 null 值
    print(b)
    // null
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-safe-operator"}

你可以將 `as?` 運算子與 Elvis 運算子 `?:` 結合，將多行程式碼縮減為一行。例如，以下 `calculateTotalStringLength()` 函式會計算混合清單中所有字串的總長度：

```kotlin
fun calculateTotalStringLength(items: List<Any>): Int {
    var totalLength = 0

    for (item in items) {
        totalLength += if (item is String) {
            item.length
        } else {
            0  // 對於非 String 項目加入 0
        }
    }

    return totalLength
}
```

範例：

*   使用 `totalLength` 變數作為計數器。
*   使用 `for` 迴圈遍歷清單中的每個項目。
*   使用 `if` 與 `is` 運算子檢查當前項目是否為字串：
    *   如果是，則將字串長度加入計數器。
    *   如果不是，則計數器不會遞增。
*   回傳 `totalLength` 變數的最終值。

這段程式碼可以縮減為：

```kotlin
fun calculateTotalStringLength(items: List<Any>): Int {
    return items.sumOf { (it as? String)?.length ?: 0 }
}
```

此範例使用 [`.sumOf()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/sum-of.html) 擴充函式，並提供一個 lambda 表達式，該表達式：

*   對清單中的每個項目，使用 `as?` 執行安全轉型為 `String`。
*   如果呼叫未回傳 `null` 值，則使用安全呼叫 `?.` 存取 `length` 屬性。
*   如果安全呼叫回傳 `null` 值，則使用 Elvis 運算子 `?:` 回傳 `0`。

## 空值與集合

在 Kotlin 中，處理集合通常涉及處理 `null` 值並篩選掉不必要的元素。Kotlin 擁有一些實用的函式，可用於在處理清單、集合、映射和其他類型的集合時，編寫簡潔、高效且空值安全的程式碼。

若要從清單中篩選 `null` 值，請使用 [`filterNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter-not-null.html) 函式：

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

如果您想在建立清單時直接執行 `null` 值篩選，請使用 [`listOfNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/list-of-not-null.html) 函式：

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

在這兩個範例中，如果所有項目都是 `null` 值，則會回傳一個空清單。

Kotlin 還提供了一些函式，可用於在集合中尋找值。如果找不到值，它們會回傳 `null` 值，而不是觸發錯誤：

*   [`maxOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/max-or-null.html) 尋找最高值。如果不存在，則回傳 `null` 值。
*   [`minOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/min-or-null.html) 尋找最低值。如果不存在，則回傳 `null` 值。

例如：

```kotlin
fun main() {
//sampleStart
    // 一週內記錄的溫度
    val temperatures = listOf(15, 18, 21, 21, 19, 17, 16)
  
    // 尋找本週最高溫度
    val maxTemperature = temperatures.maxOrNull()
    println("記錄到的最高溫度：${maxTemperature ?: "無資料"}")
    // 記錄到的最高溫度：21

    // 尋找本週最低溫度
    val minTemperature = temperatures.minOrNull()
    println("記錄到的最低溫度：${minTemperature ?: "無資料"}")
    // 記錄到的最低溫度：15
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-collections"}

此範例使用 Elvis 運算子 `?:`，如果函式回傳 `null` 值，則回傳一個列印的陳述。

> `maxOrNull()` 和 `minOrNull()` 函式設計用於**不**包含 `null` 值的集合。否則，您將無法判斷函式是未能找到所需值，還是找到了 `null` 值。
>
{style="note"}

您可以使用 [`singleOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/single-or-null.html) 函式搭配 lambda 表達式，來尋找符合條件的單一項目。如果不存在或有多個項目符合，該函式會回傳 `null` 值：

```kotlin
fun main() {
//sampleStart
    // 一週內記錄的溫度
    val temperatures = listOf(15, 18, 21, 21, 19, 17, 16)

    // 檢查是否有且只有一天是 30 度
    val singleHotDay = temperatures.singleOrNull{ it == 30 }
    println("單一天 30 度的高溫日：${singleHotDay ?: "無"}")
    // 單一天 30 度的高溫日：無
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-singleornull"}

> `singleOrNull()` 函式設計用於**不**包含 `null` 值的集合。
>
{style="note"}

有些函式使用 lambda 表達式來轉換集合，如果無法完成其目的，則回傳 `null` 值。

若要使用 lambda 表達式轉換集合並回傳第一個非 `null` 值，請使用 [`firstNotNullOfOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/first-not-null-of-or-null.html) 函式。如果不存在此類值，該函式會回傳 `null` 值：

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

若要使用 lambda 表達式依序處理每個集合項目並建立累加值（或如果集合為空則回傳 `null` 值），請使用 [`reduceOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/reduce-or-null.html) 函式：

```kotlin
fun main() {
//sampleStart
    // 購物車中商品的價格
    val itemPrices = listOf(20, 35, 15, 40, 10)

    // 使用 reduceOrNull() 函式計算總價
    val totalPrice = itemPrices.reduceOrNull { runningTotal, price -> runningTotal + price }
    println("購物車中商品總價：${totalPrice ?: "無商品"}")
    // 購物車中商品總價：120

    val emptyCart = listOf<Int>()
    val emptyTotalPrice = emptyCart.reduceOrNull { runningTotal, price -> runningTotal + price }
    println("空購物車中商品總價：${emptyTotalPrice ?: "無商品"}")
    // 空購物車中商品總價：無商品
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-reduceornull"}

此範例也使用 Elvis 運算子 `?:`，如果函式回傳 `null` 值，則回傳一個列印的陳述。

> `reduceOrNull()` 函式設計用於**不**包含 `null` 值的集合。
>
{style="note"}

探索 Kotlin 的 [標準函式庫](https://kotlinlang.org/api/core/kotlin-stdlib/)，尋找更多可用於讓程式碼更安全的函式。

## 提早回傳與 Elvis 運算子

在初學者導覽中，你已學習如何使用 [提早回傳](kotlin-tour-functions.md#early-returns-in-functions) 來讓函式在特定點之後停止處理。你可以使用 Elvis 運算子 `?:` 搭配提早回傳來檢查函式中的前置條件。這種方法是保持程式碼簡潔的好方法，因為您不需要使用巢狀檢查。程式碼複雜度降低也使其更易於維護。例如：

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

    // 建立使用者映射
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

*   有一個 `User` 資料類別，它具有使用者 `id`、`name` 和朋友清單的屬性。
*   `getNumberOfFriends()` 函式：
    *   接受 `User` 實例的映射和作為整數的使用者 ID。
    *   存取具有提供使用者 ID 的 `User` 實例映射中的值。
    *   如果映射值為 `null` 值，則使用 Elvis 運算子提早回傳函式並回傳 `-1`。
    *   將從映射中找到的值指派給 `user` 變數。
    *   使用 `size` 屬性回傳使用者朋友清單中的朋友數量。
*   `main()` 函式：
    *   建立三個 `User` 實例。
    *   建立這些 `User` 實例的映射並將其指派給 `users` 變數。
    *   以 `1` 和 `2` 的值呼叫 `users` 變數上的 `getNumberOfFriends()` 函式，`"Alice"` 有兩個朋友，`"Bob"` 有一個朋友。
    *   以 `4` 的值呼叫 `users` 變數上的 `getNumberOfFriends()` 函式，這會觸發提早回傳並回傳 `-1`。

您可能會注意到，沒有提早回傳的程式碼可能會更簡潔。然而，這種方法需要多次安全呼叫，因為 `users[userId]` 可能會回傳 `null` 值，這會讓程式碼稍微難以閱讀：

```kotlin
fun getNumberOfFriends(users: Map<Int, User>, userId: Int): Int {
    // 擷取使用者，如果找不到則回傳 -1
    return users[userId]?.friends?.size ?: -1
}
```
{validate="false"}

儘管此範例僅使用 Elvis 運算子檢查一個條件，但您可以加入多個檢查來涵蓋任何關鍵錯誤路徑。使用 Elvis 運算子的提早回傳可防止您的程式執行不必要的工作，並在偵測到 `null` 值或無效情況時立即停止，從而使您的程式碼更安全。

有關如何在程式碼中使用 `return` 的更多資訊，請參閱 [回傳與跳轉](returns.md)。

## 練習

### 練習 1 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-1"}

您正在為一個應用程式開發通知系統，使用者可以在其中啟用或禁用不同類型的通知。
完成 `getNotificationPreferences()` 函式，使其：

1.  `validUser` 變數使用 `as?` 運算子檢查 `user` 是否為 `User` 類別的實例。如果不是，則回傳一個空清單。
2.  `userName` 變數使用 Elvis `?:` 運算子確保如果使用者名稱為 `null`，則預設為 `"Guest"`。
3.  最終回傳陳述使用 `.takeIf()` 函式，僅在啟用時包含電子郵件和簡訊通知偏好設定。
4.  `main()` 函式成功執行並列印預期輸出。

> [`takeIf()` 函式](scope-functions.md#takeif-and-takeunless) 在給定條件為 true 時回傳原始值，否則回傳 `null`。例如：
>
> ```kotlin
> fun main() {
>     // 使用者已登入
>     val userIsLoggedIn = true
>     // 使用者具有活動會話
>     val hasSession = true
> 
>     // 如果使用者已登入
>     // 且具有活動會話，則授予儀表板存取權限
>     val canAccessDashboard = userIsLoggedIn.takeIf { hasSession }
> 
>     println(canAccessDashboard ?: "存取遭拒")
>     // true
> }
> ```
>
{style="tip"}

|--|--|

```kotlin
data class User(val name: String?)

fun getNotificationPreferences(user: Any, emailEnabled: Boolean, smsEnabled: Boolean): List<String> {
    val validUser = // 在此撰寫程式碼
    val userName = // 在此撰寫程式碼

    return listOfNotNull( /* 在此撰寫程式碼 */)
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
        "針對 $userName 啟用電子郵件通知".takeIf { emailEnabled },
        "針對 $userName 啟用簡訊通知".takeIf { smsEnabled }
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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-null-safety-solution-1"}

### 練習 2 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-2"}

您正在開發一個訂閱制的串流服務，使用者可以有多個訂閱，但**一次只能有一個啟用**。完成 `getActiveSubscription()` 函式，使其使用帶有述詞的 `singleOrNull()` 函式，如果有多個啟用中的訂閱，則回傳 `null` 值：

|--|--|

```kotlin
data class Subscription(val name: String, val isActive: Boolean)

fun getActiveSubscription(subscriptions: List<Subscription>): Subscription? // 在此撰寫程式碼

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答 1" id="kotlin-tour-null-safety-solution-2-1"}

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答 2" id="kotlin-tour-null-safety-solution-2-2"}

### 練習 3 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-3"}

您正在開發一個社群媒體平台，其中使用者具有使用者名稱和帳戶狀態。您想查看目前啟用中的使用者名稱清單。完成 `getActiveUsernames()` 函式，使其 [`mapNotNull()` 函式](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/map-not-null.html) 具有一個述詞，如果使用者名稱是啟用中的，則回傳該使用者名稱，否則回傳 `null` 值：

|--|--|

```kotlin
data class User(val username: String, val isActive: Boolean)

fun getActiveUsernames(users: List<User>): List<String> {
    return users.mapNotNull { /* 在此撰寫程式碼 */ }
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

> 就像練習 1 一樣，當您檢查使用者是否啟用時，可以使用 [`takeIf()` 函式](scope-functions.md#takeif-and-takeunless)。
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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答 1" id="kotlin-tour-null-safety-solution-3-1"}

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答 2" id="kotlin-tour-null-safety-solution-3-2"}

### 練習 4 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-4"}

您正在為一個電子商務平台開發一個庫存管理系統。在處理銷售之前，您需要根據可用庫存檢查請求的產品數量是否有效。

完成 `validateStock()` 函式，使其使用提早回傳和 Elvis 運算子（如果適用）來檢查以下情況：

*   `requested` 變數為 `null`。
*   `available` 變數為 `null`。
*   `requested` 變數為負值。
*   `requested` 變數中的數量高於 `available` 變數中的數量。

在上述所有情況下，函式必須提早回傳值 `-1`。

|--|--|

```kotlin
fun validateStock(requested: Int?, available: Int?): Int {
    // 在此撰寫程式碼
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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-null-safety-solution-4"}

## 下一步

[中階：函式庫與 API](kotlin-tour-intermediate-libraries-and-apis.md)