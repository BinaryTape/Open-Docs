[//]: # (title: 中級: Null Safety)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="最初のステップ" /> <a href="kotlin-tour-intermediate-extension-functions.md">拡張関数</a><br />
        <img src="icon-2-done.svg" width="20" alt="二番目のステップ" /> <a href="kotlin-tour-intermediate-scope-functions.md">スコープ関数</a><br />
        <img src="icon-3-done.svg" width="20" alt="三番目のステップ" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">レシーバー付きラムダ式</a><br />
        <img src="icon-4-done.svg" width="20" alt="四番目のステップ" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">クラスとインターフェース</a><br />
        <img src="icon-5-done.svg" width="20" alt="五番目のステップ" /> <a href="kotlin-tour-intermediate-objects.md">オブジェクト</a><br />
        <img src="icon-6-done.svg" width="20" alt="六番目のステップ" /> <a href="kotlin-tour-intermediate-open-special-classes.md">オープンクラスと特殊なクラス</a><br />
        <img src="icon-7-done.svg" width="20" alt="七番目のステップ" /> <a href="kotlin-tour-intermediate-properties.md">プロパティ</a><br />
        <img src="icon-8.svg" width="20" alt="八番目のステップ" /> <strong>Null Safety</strong><br />
        <img src="icon-9-todo.svg" width="20" alt="九番目のステップ" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">ライブラリとAPI</a></p>
</tldr>

初心者向けツアーでは、コードで `null` 値を処理する方法を学びました。この章では、Null Safety機能の一般的なユースケースと、それらを最大限に活用する方法について説明します。

## スマートキャストとセーフキャスト

Kotlinは、明示的な宣言なしに型を推論できる場合があります。変数やオブジェクトを特定の型として扱うようKotlinに指示するこのプロセスは、**キャスト**と呼ばれます。型が自動的にキャストされる場合、たとえば推論される場合などは、**スマートキャスト**と呼ばれます。

### is および !is 演算子

キャストがどのように機能するかを掘り下げる前に、オブジェクトが特定の型を持っているかどうかをチェックする方法を見てみましょう。これには、`when` または `if` 条件式で `is` および `!is` 演算子を使用できます。

*   `is` は、オブジェクトがその型を持つかどうかをチェックし、真偽値を返します。
*   `!is` は、オブジェクトがその型を**持たない**かどうかをチェックし、真偽値を返します。

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
  
    // 型は Int
    printObjectType(myInt)
    // 値 42 の Integer です

    // 型は List なので、Double ではありません。
    printObjectType(myList)
    // Double ではありません

    // 型は Double なので、else ブランチがトリガーされます。
    printObjectType(myDouble)
    // 不明な型
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-casts"}

> `when` 条件式を `is` および `!is` 演算子とともに使用する例は、[オープンクラスとその他の特殊なクラス](kotlin-tour-intermediate-open-special-classes.md#sealed-classes)の章ですでに確認しました。
> 
{style="tip"}

### as および as? 演算子

オブジェクトを任意の他の型に明示的に_キャスト_するには、`as` 演算子を使用します。これには、null許容型から非null許容型へのキャストが含まれます。キャストが不可能な場合、プログラムは**実行時**にクラッシュします。これが、この演算子が**安全でない**キャスト演算子と呼ばれる理由です。

```kotlin
fun main() {
//sampleStart
    val a: String? = null
    val b = a as String

    // 実行時にエラーが発生します
    print(b)
//sampleEnd
}
```
{kotlin-runnable="true" validate="false" id="kotlin-tour-null-safety-as-operator"}

オブジェクトを非null許容型に明示的にキャストするが、失敗時にエラーをスローする代わりに `null` を返すには、`as?` 演算子を使用します。`as?` 演算子は失敗時にエラーをトリガーしないため、**安全な**演算子と呼ばれます。

```kotlin
fun main() {
//sampleStart
    val a: String? = null
    val b = a as? String

    // null 値を返します
    print(b)
    // null
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-safe-operator"}

`as?` 演算子をエルビス演算子 `?:` と組み合わせることで、数行のコードを1行に減らすことができます。たとえば、次の `calculateTotalStringLength()` 関数は、混合リストで提供されるすべての文字列の合計長を計算します。

```kotlin
fun calculateTotalStringLength(items: List<Any>): Int {
    var totalLength = 0

    for (item in items) {
        totalLength += if (item is String) {
            item.length
        } else {
            0  // String 以外のアイテムには 0 を加算
        }
    }

    return totalLength
}
```

この例は次のことを行います。

*   `totalLength` 変数をカウンターとして使用します。
*   `for` ループを使用してリスト内の各アイテムをループします。
*   `if` と `is` 演算子を使用して、現在のアイテムが文字列であるかどうかをチェックします。
    *   文字列である場合、文字列の長さがカウンターに追加されます。
    *   文字列でない場合、カウンターはインクリメントされません。
*   `totalLength` 変数の最終的な値を返します。

このコードは、次のように短縮できます。

```kotlin
fun calculateTotalStringLength(items: List<Any>): Int {
    return items.sumOf { (it as? String)?.length ?: 0 }
}
```

この例では、[`sumOf()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/sum-of.html) 拡張関数を使用し、次のラムダ式を提供します。

*   リスト内の各アイテムに対して、`as?` を使用して `String` へのセーフキャストを実行します。
*   呼び出しが `null` 値を返さない場合、セーフコール `?.` を使用して `length` プロパティにアクセスします。
*   セーフコールが `null` 値を返す場合、エルビス演算子 `?:` を使用して `0` を返します。

## Null値とコレクション

Kotlinでは、コレクションを扱う際に `null` 値の処理や不要な要素のフィルタリングが頻繁に発生します。Kotlinには、リスト、セット、マップ、およびその他の種類のコレクションを扱う際に、クリーンで効率的、かつNull安全なコードを書くために使用できる便利な関数が用意されています。

リストから `null` 値をフィルタリングするには、[`filterNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/filter-not-null.html) 関数を使用します。

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

リストを作成する際に `null` 値のフィルタリングを直接実行したい場合は、[`listOfNotNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/list-of-not-null.html) 関数を使用します。

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

これらの両方の例では、すべてのアイテムが `null` 値の場合、空のリストが返されます。

Kotlinには、コレクション内の値を見つけるために使用できる関数も用意されています。値が見つからない場合、エラーをトリガーする代わりに `null` 値を返します。

*   [`maxOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/max-or-null.html) は最大値を見つけます。存在しない場合は `null` 値を返します。
*   [`minOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/min-or-null.html) は最小値を見つけます。存在しない場合は `null` 値を返します。

例:

```kotlin
fun main() {
//sampleStart
    // 1週間に記録された気温
    val temperatures = listOf(15, 18, 21, 21, 19, 17, 16)
  
    // 週の最高気温を見つける
    val maxTemperature = temperatures.maxOrNull()
    println("Highest temperature recorded: ${maxTemperature ?: "No data"}")
    // 記録された最高気温: 21

    // 週の最低気温を見つける
    val minTemperature = temperatures.minOrNull()
    println("Lowest temperature recorded: ${minTemperature ?: "No data"}")
    // 記録された最低気温: 15
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-collections"}

この例では、関数が `null` 値を返す場合に、エルビス演算子 `?:` を使用して出力文を返します。

> `maxOrNull()` および `minOrNull()` 関数は、`null` 値を**含まない**コレクションで使用するように設計されています。そうしないと、関数が目的の値を見つけられなかったのか、それとも `null` 値が見つかったのかを判断できません。
>
{style="note"}

[`singleOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/single-or-null.html) 関数をラムダ式と共に使用して、条件に一致する単一のアイテムを見つけることができます。存在しない場合、または一致するアイテムが複数ある場合、関数は `null` 値を返します。

```kotlin
fun main() {
//sampleStart
    // 1週間に記録された気温
    val temperatures = listOf(15, 18, 21, 21, 19, 17, 16)

    // 30度の日は正確に1日だけだったかを確認
    val singleHotDay = temperatures.singleOrNull{ it == 30 }
    println("Single hot day with 30 degrees: ${singleHotDay ?: "None"}")
    // 30度だった暑い日は1日だけ: None
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-singleornull"}

> `singleOrNull()` 関数は、`null` 値を**含まない**コレクションで使用するように設計されています。
>
{style="note"}

一部の関数は、ラムダ式を使用してコレクションを変換し、目的を達成できない場合に `null` 値を返します。

ラムダ式を使用してコレクションを変換し、`null` でない最初の値を返すには、[`firstNotNullOfOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/first-not-null-of-or-null.html) 関数を使用します。そのような値が存在しない場合、関数は `null` 値を返します。

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

各コレクションアイテムを順番に処理して累積値を作成する（またはコレクションが空の場合に `null` 値を返す）ラムダ式を使用するには、[`reduceOrNull()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/reduce-or-null.html) 関数を使用します。

```kotlin
fun main() {
//sampleStart
    // ショッピングカート内の商品の価格
    val itemPrices = listOf(20, 35, 15, 40, 10)

    // reduceOrNull() 関数を使用して合計価格を計算
    val totalPrice = itemPrices.reduceOrNull { runningTotal, price -> runningTotal + price }
    println("Total price of items in the cart: ${totalPrice ?: "No items"}")
    // カート内の商品の合計価格: 120

    val emptyCart = listOf<Int>()
    val emptyTotalPrice = emptyCart.reduceOrNull { runningTotal, price -> runningTotal + price }
    println("Total price of items in the empty cart: ${emptyTotalPrice ?: "No items"}")
    // 空のカート内の商品の合計価格: No items
//sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-null-safety-reduceornull"}

この例でも、関数が `null` 値を返す場合に、エルビス演算子 `?:` を使用して出力文を返します。

> `reduceOrNull()` 関数は、`null` 値を**含まない**コレクションで使用するように設計されています。
>
{style="note"}

コードをより安全にするために使用できるその他の関数については、Kotlinの[標準ライブラリ](https://kotlinlang.org/api/core/kotlin-stdlib/)を参照してください。

## 早期リターンとエルビス演算子

初心者向けツアーでは、関数が特定のポイントを超えて処理されるのを停止するための[早期リターン](kotlin-tour-functions.md#early-returns-in-functions)の使用方法を学びました。エルビス演算子 `?:` を早期リターンと共に使用して、関数内の事前条件をチェックできます。このアプローチは、ネストされたチェックを使用する必要がないため、コードを簡潔に保つための優れた方法です。コードの複雑さが軽減されるため、保守も容易になります。例:

```kotlin
data class User(
    val id: Int,
    val name: String,
    // 友達のユーザーIDのリスト
    val friends: List<Int>
)

// ユーザーの友達の数を取得する関数
fun getNumberOfFriends(users: Map<Int, User>, userId: Int): Int {
    // ユーザーを取得するか、見つからない場合は -1 を返します
    val user = users[userId] ?: return -1
    // 友達の数を返します
    return user.friends.size
}

fun main() {
    // いくつかのサンプルユーザーを作成
    val user1 = User(1, "Alice", listOf(2, 3))
    val user2 = User(2, "Bob", listOf(1))
    val user3 = User(3, "Charlie", listOf(1))

    // ユーザーのマップを作成
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

この例では、次のことを行います。

*   ユーザーの `id`、`name`、および友達のリストのプロパティを持つ `User` データクラスがあります。
*   `getNumberOfFriends()` 関数:
    *   `User` インスタンスのマップと整数としてのユーザーIDを受け取ります。
    *   提供されたユーザーIDを使用して `User` インスタンスのマップの値にアクセスします。
    *   マップの値が `null` の場合に、関数を早期に `-1` の値で返すためにエルビス演算子を使用します。
    *   マップから見つかった値を `user` 変数に割り当てます。
    *   `size` プロパティを使用して、ユーザーの友達リストの友達数を返します。
*   `main()` 関数:
    *   3つの `User` インスタンスを作成します。
    *   これらの `User` インスタンスのマップを作成し、`users` 変数に割り当てます。
    *   `users` 変数に対して値 `1` と `2` で `getNumberOfFriends()` 関数を呼び出し、"Alice" には2人の友達を、"Bob" には1人の友達を返します。
    *   `users` 変数に対して値 `4` で `getNumberOfFriends()` 関数を呼び出し、値 `-1` で早期リターンをトリガーします。

このコードは、早期リターンなしでより簡潔にできることに気づくかもしれません。しかし、このアプローチでは `users[userId]` が `null` 値を返す可能性があるため、複数のセーフコールが必要となり、コードが少し読みにくくなります。

```kotlin
fun getNumberOfFriends(users: Map<Int, User>, userId: Int): Int {
    // ユーザーを取得するか、見つからない場合は -1 を返します
    return users[userId]?.friends?.size ?: -1
}
```
{validate="false"}

この例ではエルビス演算子で1つの条件のみをチェックしていますが、複数のチェックを追加して、重要なエラーパスをカバーできます。早期リターンとエルビス演算子を使用すると、プログラムが不要な作業を行うのを防ぎ、`null` 値または無効なケースが検出され次第停止することで、コードをより安全にします。

コードで `return` を使用する方法の詳細については、[戻りとジャンプ](returns.md)を参照してください。

## 練習

### 演習 1 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-1"}

ユーザーがさまざまな種類の通知を有効または無効にできるアプリの通知システムを開発しています。`getNotificationPreferences()` 関数を完成させてください。

1.  `validUser` 変数は `as?` 演算子を使用して、`user` が `User` クラスのインスタンスであるかどうかをチェックします。そうでない場合は、空のリストを返します。
2.  `userName` 変数はエルビス `?:` 演算子を使用して、ユーザー名が `null` の場合にデフォルトで `"Guest"` になるようにします。
3.  最後の return 文は `.takeIf()` 関数を使用して、メールとSMSの通知設定が有効になっている場合にのみ含めます。
4.  `main()` 関数が正常に実行され、期待される出力が表示されます。

> [`takeIf()` 関数](scope-functions.md#takeif-and-takeunless)は、指定された条件が true の場合は元の値を返し、そうでない場合は `null` を返します。例:
>
> ```kotlin
> fun main() {
>     // ユーザーがログインしています
>     val userIsLoggedIn = true
>     // ユーザーにはアクティブなセッションがあります
>     val hasSession = true
> 
>     // ユーザーがログインしており
>     // アクティブなセッションを持っている場合にダッシュボードへのアクセスを許可します
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
    val validUser = // ここにコードを記述
    val userName = // ここにコードを記述

    return listOfNotNull( /* ここにコードを記述 */)
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

### 演習 2 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-2"}

ユーザーが複数のサブスクリプションを持つことができるサブスクリプションベースのストリーミングサービスに取り組んでいますが、**一度にアクティブにできるのは1つだけ**です。`getActiveSubscription()` 関数を完成させて、`singleOrNull()` 関数を述語と共に使用し、アクティブなサブスクリプションが複数ある場合に `null` 値を返すようにしてください。

|--|--|

```kotlin
data class Subscription(val name: String, val isActive: Boolean)

fun getActiveSubscription(subscriptions: List<Subscription>): Subscription? // ここにコードを記述

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例 1" id="kotlin-tour-null-safety-solution-2-1"}

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例 2" id="kotlin-tour-null-safety-solution-2-2"}

### 演習 3 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-3"}

ユーザー名とアカウントステータスを持つソーシャルメディアプラットフォームに取り組んでいます。現在アクティブなユーザー名のリストを表示したいと考えています。`getActiveUsernames()` 関数を完成させて、[`mapNotNull()` 関数](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/map-not-null.html)が、ユーザーがアクティブな場合はユーザー名を、そうでない場合は `null` 値を返す述語を持つようにしてください。

|--|--|

```kotlin
data class User(val username: String, val isActive: Boolean)

fun getActiveUsernames(users: List<User>): List<String> {
    return users.mapNotNull { /* ここにコードを記述 */ }
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

> 演習1と同様に、ユーザーがアクティブであるかをチェックする際に [`takeIf()` 関数](scope-functions.md#takeif-and-takeunless)を使用できます。
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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例 1" id="kotlin-tour-null-safety-solution-3-1"}

|--|--|

```kotlin
data class User(val username: String, val isActive: Boolean)

fun getActiveUsernames(users: List<User>): List<String> =
    users.mapNotNull { user -> user.username.takeIf { user.isActive } }

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例 2" id="kotlin-tour-null-safety-solution-3-2"}

### 演習 4 {initial-collapse-state="collapsed" collapsible="true" id="null-safety-exercise-4"}

eコマースプラットフォームの在庫管理システムに取り組んでいます。販売を処理する前に、要求された製品の数量が、利用可能な在庫に基づいて有効であるかをチェックする必要があります。

`validateStock()` 関数を完成させて、早期リターンと（該当する場合は）エルビス演算子を使用して、次のことをチェックするようにしてください。

*   `requested` 変数が `null` である。
*   `available` 変数が `null` である。
*   `requested` 変数が負の値である。
*   `requested` 変数の量が `available` 変数の量よりも大きい。

上記のすべての場合において、関数は値 `-1` で早期リターンする必要があります。

|--|--|

```kotlin
fun validateStock(requested: Int?, available: Int?): Int {
    // ここにコードを記述
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