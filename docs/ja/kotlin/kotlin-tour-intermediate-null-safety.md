[//]: # (title: 中級: null安全性)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="最初のステップ" /> <a href="kotlin-tour-intermediate-extension-functions.md">拡張関数</a><br />
        <img src="icon-2-done.svg" width="20" alt="2番目のステップ" /> <a href="kotlin-tour-intermediate-scope-functions.md">スコープ関数</a><br />
        <img src="icon-3-done.svg" width="20" alt="3番目のステップ" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">レシーバー付きラムダ式</a><br />
        <img src="icon-4-done.svg" width="20" alt="4番目のステップ" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">クラスとインターフェース</a><br />
        <img src="icon-5-done.svg" width="20" alt="5番目のステップ" /> <a href="kotlin-tour-intermediate-objects.md">オブジェクト</a><br />
        <img src="icon-6-done.svg" width="20" alt="6番目のステップ" /> <a href="kotlin-tour-intermediate-open-special-classes.md">`open`クラスと特殊なクラス</a><br />
        <img src="icon-7-done.svg" width="20" alt="7番目のステップ" /> <a href="kotlin-tour-intermediate-properties.md">プロパティ</a><br />
        <img src="icon-8.svg" width="20" alt="8番目のステップ" /> <strong>null安全性</strong><br />
        <img src="icon-9-todo.svg" width="20" alt="9番目のステップ" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">ライブラリとAPI</a></p>
</tldr>

初級ツアーでは、コード内で`null`値を扱う方法を学びました。この章では、null安全機能の一般的なユースケースと、それらを最大限に活用する方法について説明します。

## スマートキャストと安全なキャスト

Kotlinは、明示的な宣言なしに型を推論できる場合があります。変数やオブジェクトを特定の型に属するものとして扱うようKotlinに指示するこのプロセスは、**キャスト**と呼ばれます。型が推論されるように自動的にキャストされる場合、それは**スマートキャスト**と呼ばれます。

### `is`演算子と`!is`演算子

キャストがどのように機能するかを探る前に、オブジェクトが特定の型を持っているかどうかを確認する方法を見てみましょう。そのためには、`when`または`if`条件式で`is`演算子と`!is`演算子を使用できます。

*   `is`はオブジェクトがその型を持っているかをチェックし、ブール値を返します。
*   `!is`はオブジェクトがその型を**持っていない**かをチェックし、ブール値を返します。

例:

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
  
    // 型はIntです
    printObjectType(myInt)
    // It's an Integer with value 42

    // 型はListなので、Doubleではありません。
    printObjectType(myList)
    // It's NOT a Double

    // 型はDoubleなので、elseブランチがトリガーされます。
    printObjectType(myDouble)
    // Unknown type
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-casts"}

> `when`条件式を`is`演算子と`!is`演算子で使用する方法の例は、[openクラスと特殊なクラス](kotlin-tour-intermediate-open-special-classes.md#sealed-classes)の章で既に確認しました。
> 
{style="tip"}

### `as`演算子と`as?`演算子

オブジェクトを他の型に明示的に_キャスト_するには、`as`演算子を使用します。これには、nullable型から非nullableな対応物へのキャストも含まれます。キャストが不可能な場合、プログラムは**実行時**にクラッシュします。そのため、これは**unsafe**なキャスト演算子と呼ばれます。

```kotlin
fun main() {
//sampleStart
    val a: String? = null
    val b = a as String

    // 実行時にエラーをトリガーします
    print(b)
//sampleEnd
}
```
{kotlin-runnable="true" validate="false" id="kotlin-tour-null-safety-as-operator"}

オブジェクトを非nullable型に明示的にキャストし、失敗時にエラーをスローする代わりに`null`を返すには、`as?`演算子を使用します。`as?`演算子は失敗時にエラーをトリガーしないため、**安全な**演算子と呼ばれます。

```kotlin
fun main() {
//sampleStart
    val a: String? = null
    val b = a as? String

    // null値を返します
    print(b)
    // null
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-safe-operator"}

`as?`演算子をエルビス演算子`?:`と組み合わせて、数行のコードを1行に短縮できます。例えば、次の`calculateTotalStringLength()`関数は、混合リストで提供されるすべての文字列の合計長を計算します。

```kotlin
fun calculateTotalStringLength(items: List<Any>): Int {
    var totalLength = 0

    for (item in items) {
        totalLength += if (item is String) {
            item.length
        } else {
            0  // Add 0 for non-String items
        }
    }

    return totalLength
}
```

この例では、次のように動作します。

*   `totalLength`変数をカウンタとして使用します。
*   `for`ループを使用してリスト内の各項目をループ処理します。
*   `if`と`is`演算子を使用して、現在の項目が文字列であるかをチェックします。
    *   文字列である場合は、その長さがカウンタに追加されます。
    *   そうでない場合は、カウンタはインクリメントされません。
*   `totalLength`変数の最終的な値を返します。

このコードは次のように短縮できます。

```kotlin
fun calculateTotalStringLength(items: List<Any>): Int {
    return items.sumOf { (it as? String)?.length ?: 0 }
}
```

この例では、[`.sumOf()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/sum-of.html)拡張関数を使用し、次のようなラムダ式を提供します。

*   リスト内の各項目に対し、`as?`を使用して`String`への安全なキャストを実行します。
*   呼び出しが`null`値を返さない場合、セーフコール`?.`を使用して`length`プロパティにアクセスします。
*   セーフコールが`null`値を返す場合、エルビス演算子`?:`を使用して`0`を返します。

## null値とコレクション

Kotlinでは、コレクションを扱う際、`null`値の処理や不要な要素のフィルタリングがしばしば伴います。Kotlinには、リスト、セット、マップ、その他の種類のコレクションを扱う際に、クリーンで効率的、かつnull安全なコードを書くのに役立つ関数が用意されています。

リストから`null`値をフィルタリングするには、[`filterNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter-not-null.html)関数を使用します。

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

リスト作成時に`null`値のフィルタリングを直接行いたい場合は、[`listOfNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/list-of-not-null.html)関数を使用します。

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

これら両方の例で、すべての項目が`null`値の場合、空のリストが返されます。

Kotlinには、コレクション内の値を見つけるために使用できる関数も用意されています。値が見つからない場合、エラーをトリガーする代わりに`null`値を返します。

*   [`singleOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/single-or-null.html)は、正確な値を持つ単一の項目を探します。存在しない場合、または同じ値を持つ項目が複数ある場合は、`null`値を返します。
*   [`maxOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/max-or-null.html)は最大値を見つけます。存在しない場合は、`null`値を返します。
*   [`minOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/min-or-null.html)は最小値を見つけます。存在しない場合は、`null`値を返します。

例:

```kotlin
fun main() {
//sampleStart
    // 1週間の記録された気温
    val temperatures = listOf(15, 18, 21, 21, 19, 17, 16)

    // 30度の日はちょうど1日だけだったかチェック
    val singleHotDay = temperatures.singleOrNull()
    println("Single hot day with 30 degrees: ${singleHotDay ?: "None"}")
    // Single hot day with 30 degrees: None

    // 今週の最高気温を見つける
    val maxTemperature = temperatures.maxOrNull()
    println("Highest temperature recorded: ${maxTemperature ?: "No data"}")
    // Highest temperature recorded: 21

    // 今週の最低気温を見つける
    val minTemperature = temperatures.minOrNull()
    println("Lowest temperature recorded: ${minTemperature ?: "No data"}")
    // Lowest temperature recorded: 15
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-collections"}

この例では、関数が`null`値を返す場合に、エルビス演算子`?:`を使用して出力される文を返します。

> `singleOrNull()`、`maxOrNull()`、および`minOrNull()`関数は、`null`値を**含まない**コレクションで使用されるように設計されています。そうでない場合、関数が目的の値を見つけられなかったのか、`null`値を見つけたのかを区別できません。
>
{style="note"}

一部の関数は、ラムダ式を使用してコレクションを変換し、その目的を果たすことができない場合に`null`値を返します。

例えば、ラムダ式でコレクションを変換し、`null`ではない最初の値を返すには、[`firstNotNullOfOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/first-not-null-of-or-null.html)関数を使用します。そのような値が存在しない場合、この関数は`null`値を返します。

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

各コレクション項目をラムダ関数で順次処理し、累積値を作成する（またはコレクションが空の場合に`null`値を返す）には、[`reduceOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/reduce-or-null.html)関数を使用します。

```kotlin
fun main() {
//sampleStart
    // ショッピングカート内の商品の価格
    val itemPrices = listOf(20, 35, 15, 40, 10)

    // reduceOrNull()関数を使用して合計価格を計算
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

この例でも、関数が`null`値を返す場合に、エルビス演算子`?:`を使用して出力される文を返します。

> `reduceOrNull()`関数は、`null`値を**含まない**コレクションで使用されるように設計されています。
>
{style="note"}

Kotlinの[標準ライブラリ](https://kotlinlang.org/api/core/kotlin-stdlib/)を探索して、コードをより安全にするために使用できる他の関数を見つけてください。

## 早期リターンとエルビス演算子

初級ツアーでは、[早期リターン](kotlin-tour-functions.md#early-returns-in-functions)を使用して、関数が特定のポイントより先に処理されるのを停止する方法を学びました。エルビス演算子`?:`を早期リターンと組み合わせて使用することで、関数内の前提条件をチェックできます。このアプローチは、ネストされたチェックを使用する必要がないため、コードを簡潔に保つ優れた方法です。コードの複雑さが軽減されることで、メンテナンスも容易になります。例:

```kotlin
data class User(
    val id: Int,
    val name: String,
    // 友人のユーザーIDのリスト
    val friends: List<Int>
)

// ユーザーの友達の数を取得する関数
fun getNumberOfFriends(users: Map<Int, User>, userId: Int): Int {
    // ユーザーを取得するか、見つからない場合は-1を返します
    val user = users[userId] ?: return -1
    // 友達の数を返します
    return user.friends.size
}

fun main() {
    // いくつかのサンプルユーザーを作成します
    val user1 = User(1, "Alice", listOf(2, 3))
    val user2 = User(2, "Bob", listOf(1))
    val user3 = User(3, "Charlie", listOf(1))

    // ユーザーのマップを作成します
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

この例では、次のように動作します。

*   ユーザーの`id`、`name`、および友人のリストのプロパティを持つ`User`データクラスがあります。
*   `getNumberOfFriends()`関数は:
    *   `User`インスタンスのマップと整数としてのユーザーIDを受け入れます。
    *   提供されたユーザーIDを使用して、`User`インスタンスのマップの値にアクセスします。
    *   マップ値が`null`値である場合、エルビス演算子を使用して関数を値`-1`で早期にリターンします。
    *   マップから見つかった値を`user`変数に割り当てます。
    *   `size`プロパティを使用して、ユーザーの友達リストの友達の数を返します。
*   `main()`関数は:
    *   3つの`User`インスタンスを作成します。
    *   これらの`User`インスタンスのマップを作成し、`users`変数に割り当てます。
    *   `users`変数に対して`getNumberOfFriends()`関数を値`1`と`2`で呼び出し、`"Alice"`には2人、`"Bob"`には1人の友達を返します。
    *   `users`変数に対して`getNumberOfFriends()`関数を値`4`で呼び出し、値`-1`で早期リターンをトリガーします。

早期リターンを使用しない方がコードがより簡潔になることに気づくかもしれません。しかし、このアプローチでは`users[userId]`が`null`値を返す可能性があるため、複数のセーフコールが必要となり、コードが少し読みにくくなります。

```kotlin
fun getNumberOfFriends(users: Map<Int, User>, userId: Int): Int {
    // Retrieve the user or return -1 if not found
    return users[userId]?.friends?.size ?: -1
}
```
{validate="false"}

この例ではエルビス演算子で1つの条件のみをチェックしていますが、複数のチェックを追加して重要なエラーパスをカバーできます。エルビス演算子による早期リターンは、`null`値や無効なケースが検出されるとすぐに停止することで、プログラムが不要な作業を行うのを防ぎ、コードをより安全にします。

コード内で`return`を使用する方法の詳細については、[戻り値とジャンプ](returns.md)を参照してください。

## 練習問題

### 演習1 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-1"}

ユーザーがさまざまな種類の通知を有効または無効にできるアプリの通知システムを開発しています。`getNotificationPreferences()`関数を次のように完成させてください。

1.  `validUser`変数は`as?`演算子を使用して、`user`が`User`クラスのインスタンスであるかを確認します。そうでない場合、空のリストを返します。
2.  `userName`変数はエルビス演算子`?:`を使用して、ユーザー名が`null`の場合に`"Guest"`にデフォルト設定されるようにします。
3.  最後の`return`文は、`.takeIf()`関数を使用して、メールとSMSの通知設定が有効になっている場合にのみ含めます。
4.  `main()`関数が正常に実行され、期待される出力が表示されます。

> [`takeIf()`関数](scope-functions.md#takeif-and-takeunless)は、指定された条件が真の場合に元の値を返し、そうでない場合は`null`を返します。例:
>
> ```kotlin
> fun main() {
>     // ユーザーはログイン済みです
>     val userIsLoggedIn = true
>     // ユーザーはアクティブなセッションを持っています
>     val hasSession = true
> 
>     // ユーザーがログインしており、アクティブなセッションがある場合にダッシュボードへのアクセスを許可します
>     // そしてアクティブなセッションがある場合
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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-null-safety-solution-1"}

### 演習2 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-2"}

ユーザーが複数のサブスクリプションを持つことができるサブスクリプションベースのストリーミングサービスで作業しています。ただし、**一度にアクティブにできるのは1つだけ**です。`getActiveSubscription()`関数を完成させ、アクティブなサブスクリプションが複数ある場合に`singleOrNull()`関数を述語と共に使用して`null`値を返すようにしてください。

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例1" id="kotlin-tour-null-safety-solution-2-1"}

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例2" id="kotlin-tour-null-safety-solution-2-2"}

### 演習3 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-3"}

ユーザーがユーザー名とアカウントステータスを持つソーシャルメディアプラットフォームで作業しています。現在アクティブなユーザー名のリストを確認したいと考えています。[`mapNotNull()`関数](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/map-not-null.html)が、アクティブな場合はユーザー名を返し、そうでない場合は`null`値を返す述語を持つように、`getActiveUsernames()`関数を完成させてください。

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

> 演習1と同様に、ユーザーがアクティブであるかをチェックする際に[`takeIf()`関数](scope-functions.md#takeif-and-takeunless)を使用できます。
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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例1" id="kotlin-tour-null-safety-solution-3-1"}

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例2" id="kotlin-tour-null-safety-solution-3-2"}

### 演習4 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-4"}

eコマースプラットフォームの在庫管理システムで作業しています。販売処理を行う前に、製品の要求された数量が利用可能な在庫に基づいて有効であるかを確認する必要があります。

`validateStock()`関数を完成させ、早期リターンと（該当する場合は）エルビス演算子を使用して、次の条件をチェックするようにしてください。

*   `requested`変数が`null`である。
*   `available`変数が`null`である。
*   `requested`変数が負の値である。
*   `requested`変数の量が`available`変数の量より多い。

上記のすべての場合において、関数は値`-1`で早期リターンする必要があります。

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-null-safety-solution-4"}

## 次のステップ

[中級: ライブラリとAPI](kotlin-tour-intermediate-libraries-and-apis.md)