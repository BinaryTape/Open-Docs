[//]: # (title: 中級: スコープ関数)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="最初のステップ" /> <a href="kotlin-tour-intermediate-extension-functions.md">拡張関数</a><br />
        <img src="icon-2.svg" width="20" alt="2番目のステップ" /> <strong>スコープ関数</strong><br />
        <img src="icon-3-todo.svg" width="20" alt="3番目のステップ" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">レシーバ付きラムダ式</a><br />
        <img src="icon-4-todo.svg" width="20" alt="4番目のステップ" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">クラスとインターフェース</a><br />
        <img src="icon-5-todo.svg" width="20" alt="5番目のステップ" /> <a href="kotlin-tour-intermediate-objects.md">オブジェクト</a><br />
        <img src="icon-6-todo.svg" width="20" alt="6番目のステップ" /> <a href="kotlin-tour-intermediate-open-special-classes.md">オープンクラスと特殊クラス</a><br />
        <img src="icon-7-todo.svg" width="20" alt="7番目のステップ" /> <a href="kotlin-tour-intermediate-properties.md">プロパティ</a><br />
        <img src="icon-8-todo.svg" width="20" alt="8番目のステップ" /> <a href="kotlin-tour-intermediate-null-safety.md">null安全性</a><br />
        <img src="icon-9-todo.svg" width="20" alt="9番目のステップ" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">ライブラリとAPI</a></p>
</tldr>

この章では、拡張関数の理解を深め、スコープ関数を使用してよりイディオマティックなコードを書く方法を学びます。

## スコープ関数

プログラミングにおいて、スコープとは、変数やオブジェクトが認識される領域のことです。最も一般的に参照されるスコープは、グローバルスコープとローカルスコープです。

*   **グローバルスコープ** – プログラムのどこからでもアクセスできる変数またはオブジェクト。
*   **ローカルスコープ** – 定義されたブロックまたは関数内でのみアクセスできる変数またはオブジェクト。

Kotlinには、オブジェクトの周りに一時的なスコープを作成し、コードを実行できるスコープ関数も存在します。

スコープ関数を使用すると、一時的なスコープ内でオブジェクトの名前を参照する必要がないため、コードをより簡潔にすることができます。スコープ関数によっては、`this` キーワードで参照するか、`it` キーワードで引数として使用することで、オブジェクトにアクセスできます。

Kotlinには、`let`、`apply`、`run`、`also`、`with` の合計5つのスコープ関数があります。

各スコープ関数はラムダ式を受け取り、オブジェクトまたはラムダ式の結果を返します。このツアーでは、各スコープ関数とその使用方法を説明します。

> また、KotlinデベロッパーアドボケートであるSebastian Aignerによるスコープ関数に関する[Back to the Stdlib: Making the Most of Kotlin's Standard Library](https://youtu.be/DdvgvSHrN9g?feature=shared&t=1511)のトークも視聴できます。
> 
{style="tip"}

### let

`let` スコープ関数は、コードでnullチェックを実行し、後で返されたオブジェクトに対してさらなるアクションを実行したい場合に使用します。

例を考えてみましょう。

```kotlin
fun sendNotification(recipientAddress: String): String {
    println("Yo $recipientAddress!")
    return "Notification sent!"
}

fun getNextAddress(): String {
    return "sebastian@jetbrains.com"
}

fun main() {
    val address: String? = getNextAddress()
    sendNotification(address)
}
```
{validate = "false"}

この例には2つの関数があります。
*   `sendNotification()`: 関数パラメータ `recipientAddress` を持ち、文字列を返します。
*   `getNextAddress()`: 関数パラメータを持たず、文字列を返します。

この例では、null許容な `String` 型を持つ変数 `address` を作成します。しかし、`sendNotification()` 関数を呼び出す際に問題が発生します。この関数は、`address` が `null` 値である可能性を想定していないためです。その結果、コンパイラはエラーを報告します。

```text
Type mismatch: inferred type is String? but String was expected
```

初心者ツアーから、if条件でnullチェックを実行できること、または[Elvis演算子 `?:`](kotlin-tour-null-safety.md#use-elvis-operator)を使用できることをすでに知っています。しかし、返されたオブジェクトを後でコードで使用したい場合はどうでしょうか？これは、if条件とelseブランチを**両方**使用することで実現できます。

```kotlin
fun sendNotification(recipientAddress: String): String {
    println("Yo $recipientAddress!")
    return "Notification sent!"
}

fun getNextAddress(): String {
    return "sebastian@jetbrains.com"
}

fun main() { 
    //sampleStart
    val address: String? = getNextAddress()
    val confirm = if(address != null) {
        sendNotification(address)
    } else { null }
    //sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-let-non-null-if"}

しかし、より簡潔なアプローチは、`let` スコープ関数を使用することです。

```kotlin
fun sendNotification(recipientAddress: String): String {
    println("Yo $recipientAddress!")
    return "Notification sent!"
}

fun getNextAddress(): String {
    return "sebastian@jetbrains.com"
}

fun main() {
    //sampleStart
    val address: String? = getNextAddress()
    val confirm = address?.let {
        sendNotification(it)
    }
    //sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-let-non-null"}

この例では次のことを行います。
*   `confirm` という名前の変数を作成します。
*   `address` 変数に対して `let` スコープ関数のセーフコールを使用します。
*   `let` スコープ関数内に一時的なスコープを作成します。
*   `sendNotification()` 関数をラムダ式として `let` スコープ関数に渡します。
*   一時的なスコープを使用して、`it` 経由で `address` 変数を参照します。
*   結果を `confirm` 変数に代入します。

このアプローチにより、`address` 変数が `null` 値である可能性をコードで処理でき、後で `confirm` 変数をコードで使用できます。

### apply

`apply` スコープ関数は、クラスインスタンスのようなオブジェクトを、コードの後の方ではなく、作成時に初期化するために使用します。このアプローチにより、コードの読みやすさと管理が容易になります。

例を考えてみましょう。

```kotlin
class Client() {
    var token: String? = null
    fun connect() = println("connected!")
    fun authenticate() = println("authenticated!")
    fun getData(): String = "Mock data"
}

val client = Client()

fun main() {
    client.token = "asdf"
    client.connect()
    // connected!
    client.authenticate()
    // authenticated!
    client.getData()
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-apply-before"}

この例には、`token` というプロパティと、`connect()`、`authenticate()`、`getData()` の3つのメンバー関数を含む `Client` クラスがあります。

この例では、`Client` クラスのインスタンスとして `client` を作成し、その `token` プロパティを初期化し、`main()` 関数でそのメンバー関数を呼び出しています。

この例はコンパクトですが、実際のところ、クラスインスタンス（およびそのメンバー関数）を作成してから設定して使用できるようになるまでには時間がかかることがあります。しかし、`apply` スコープ関数を使用すると、クラスインスタンスの作成、設定、およびメンバー関数の使用を、コードの同じ場所で行うことができます。

```kotlin
class Client() {
  var token: String? = null
  fun connect() = println("connected!")
  fun authenticate() = println("authenticated!")
  fun getData(): String = "Mock data"
}
//sampleStart
val client = Client().apply {
  token = "asdf"
  connect()
  authenticate()
}

fun main() {
  client.getData()
  // connected!
  // authenticated!
}
//sampleEnd
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-apply-after"}

この例では次のことを行います。

*   `Client` クラスのインスタンスとして `client` を作成します。
*   `client` インスタンスに対して `apply` スコープ関数を使用します。
*   `apply` スコープ関数内に一時的なスコープを作成し、プロパティや関数にアクセスする際に `client` インスタンスを明示的に参照する必要がないようにします。
*   `apply` スコープ関数にラムダ式を渡し、`token` プロパティを更新し、`connect()` および `authenticate()` 関数を呼び出します。
*   `main()` 関数で `client` インスタンスの `getData()` メンバー関数を呼び出します。

ご覧のように、この戦略は大規模なコードを扱う場合に便利です。

### run

`apply` と同様に、`run` スコープ関数を使用してオブジェクトを初期化できますが、コードの特定の時点でオブジェクトを初期化し、**かつ**すぐに結果を計算したい場合は、`run` を使用する方が適しています。

`apply` 関数の前の例を続けますが、今回は `connect()` と `authenticate()` 関数をグループ化して、すべてのリクエストで呼び出されるようにします。

例:

```kotlin
class Client() {
    var token: String? = null
    fun connect() = println("connected!")
    fun authenticate() = println("authenticated!")
    fun getData(): String = "Mock data"
}

//sampleStart
val client: Client = Client().apply {
    token = "asdf"
}

fun main() {
    val result: String = client.run {
        connect()
        // connected!
        authenticate()
        // authenticated!
        getData()
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-run"}

この例では次のことを行います。

*   `Client` クラスのインスタンスとして `client` を作成します。
*   `client` インスタンスに対して `apply` スコープ関数を使用します。
*   `apply` スコープ関数内に一時的なスコープを作成し、プロパティや関数にアクセスする際に `client` インスタンスを明示的に参照する必要がないようにします。
*   `apply` スコープ関数にラムダ式を渡し、`token` プロパティを更新します。

`main()` 関数では次のことを行います。

*   `String` 型の `result` 変数を作成します。
*   `client` インスタンスに対して `run` スコープ関数を使用します。
*   `run` スコープ関数内に一時的なスコープを作成し、プロパティや関数にアクセスする際に `client` インスタンスを明示的に参照する必要がないようにします。
*   `run` スコープ関数にラムダ式を渡し、`connect()`、`authenticate()`、`getData()` 関数を呼び出します。
*   結果を `result` 変数に代入します。

これで、返された結果をコードでさらに使用できます。

### also

ログの書き込みのように、オブジェクトで追加のアクションを完了し、そのオブジェクトを返してコードで引き続き使用したい場合は、`also` スコープ関数を使用します。

例を考えてみましょう。

```kotlin
fun main() {
    val medals: List<String> = listOf("Gold", "Silver", "Bronze")
    val reversedLongUppercaseMedals: List<String> =
        medals
            .map { it.uppercase() }
            .filter { it.length > 4 }
            .reversed()
    println(reversedLongUppercaseMedals)
    // [BRONZE, SILVER]
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-also-before"}

この例では次のことを行います。

*   文字列のリストを含む `medals` 変数を作成します。
*   `List<String>` 型の `reversedLongUpperCaseMedals` 変数を作成します。
*   `medals` 変数に対して `.map()` 拡張関数を使用します。
*   `.map()` 関数にラムダ式を渡し、`it` キーワードを介して `medals` を参照し、それに対して `.uppercase()` 拡張関数を呼び出します。
*   `medals` 変数に対して `.filter()` 拡張関数を使用します。
*   `.filter()` 関数に述語としてラムダ式を渡し、`it` キーワードを介して `medals` を参照し、`medals` 変数に含まれるリストの長さが4項目より長いかどうかをチェックします。
*   `medals` 変数に対して `.reversed()` 拡張関数を使用します。
*   結果を `reversedLongUpperCaseMedals` 変数に代入します。
*   `reversedLongUpperCaseMedals` 変数に含まれるリストを出力します。

関数呼び出しの間にログを追加して、`medals` 変数に何が起きているかを確認すると便利です。`also` 関数がこれに役立ちます。

```kotlin
fun main() {
    val medals: List<String> = listOf("Gold", "Silver", "Bronze")
    val reversedLongUppercaseMedals: List<String> =
        medals
            .map { it.uppercase() }
            .also { println(it) }
            // [GOLD, SILVER, BRONZE]
            .filter { it.length > 4 }
            .also { println(it) }
            // [SILVER, BRONZE]
            .reversed()
    println(reversedLongUppercaseMedals)
    // [BRONZE, SILVER]
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-also-after"}

この例では次のことを行います。

*   `medals` 変数に対して `also` スコープ関数を使用します。
*   `also` スコープ関数内に一時的なスコープを作成し、関数パラメータとして使用する際に `medals` 変数を明示的に参照する必要がないようにします。
*   `also` スコープ関数にラムダ式を渡し、`it` キーワードを介して `medals` 変数を関数パラメータとして使用して `println()` 関数を呼び出します。

`also` 関数はオブジェクトを返すため、ログ記録だけでなく、デバッグ、複数の操作の連鎖、およびコードの主要な流れに影響を与えないその他の副作用操作の実行に役立ちます。

### with

他のスコープ関数とは異なり、`with` は拡張関数ではないため、構文が異なります。`with` にレシーバオブジェクトを引数として渡します。

オブジェクトに対して複数の関数を呼び出したい場合は、`with` スコープ関数を使用します。

この例を考えてみましょう。

```kotlin
class Canvas {
    fun rect(x: Int, y: Int, w: Int, h: Int): Unit = println("$x, $y, $w, $h")
    fun circ(x: Int, y: Int, rad: Int): Unit = println("$x, $y, $rad")
    fun text(x: Int, y: Int, str: String): Unit = println("$x, $y, $str")
}

fun main() {
    val mainMonitorPrimaryBufferBackedCanvas = Canvas()

    mainMonitorPrimaryBufferBackedCanvas.text(10, 10, "Foo")
    mainMonitorPrimaryBufferBackedCanvas.rect(20, 30, 100, 50)
    mainMonitorPrimaryBufferBackedCanvas.circ(40, 60, 25)
    mainMonitorPrimaryBufferBackedCanvas.text(15, 45, "Hello")
    mainMonitorPrimaryBufferBackedCanvas.rect(70, 80, 150, 100)
    mainMonitorPrimaryBufferBackedCanvas.circ(90, 110, 40)
    mainMonitorPrimaryBufferBackedCanvas.text(35, 55, "World")
    mainMonitorPrimaryBufferBackedCanvas.rect(120, 140, 200, 75)
    mainMonitorPrimaryBufferBackedCanvas.circ(160, 180, 55)
    mainMonitorPrimaryBufferBackedCanvas.text(50, 70, "Kotlin")
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-with-before"}

この例では、`rect()`、`circ()`、`text()` の3つのメンバー関数を持つ `Canvas` クラスを作成します。これらの各メンバー関数は、提供された関数パラメータから構築されたステートメントを出力します。

この例では、`mainMonitorPrimaryBufferBackedCanvas` を `Canvas` クラスのインスタンスとして作成し、異なる関数パラメータを持つ一連のメンバー関数をそのインスタンスで呼び出す前に使用します。

このコードは読みにくいことがわかります。`with` 関数を使用すると、コードが効率化されます。

```kotlin
class Canvas {
    fun rect(x: Int, y: Int, w: Int, h: Int): Unit = println("$x, $y, $w, $h")
    fun circ(x: Int, y: Int, rad: Int): Unit = println("$x, $y, $rad")
    fun text(x: Int, y: Int, str: String): Unit = println("$x, $y, $str")
}

fun main() {
    //sampleStart
    val mainMonitorSecondaryBufferBackedCanvas = Canvas()
    with(mainMonitorSecondaryBufferBackedCanvas) {
        text(10, 10, "Foo")
        rect(20, 30, 100, 50)
        circ(40, 60, 25)
        text(15, 45, "Hello")
        rect(70, 80, 150, 100)
        circ(90, 110, 40)
        text(35, 55, "World")
        rect(120, 140, 200, 75)
        circ(160, 180, 55)
        text(50, 70, "Kotlin")
    }
    //sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-with-after"}

この例では次のことを行います。
*   `mainMonitorSecondaryBufferBackedCanvas` インスタンスをレシーバオブジェクトとして、`with` スコープ関数を使用します。
*   `with` スコープ関数内に一時的なスコープを作成し、メンバー関数を呼び出す際に `mainMonitorSecondaryBufferBackedCanvas` インスタンスを明示的に参照する必要がないようにします。
*   `with` スコープ関数にラムダ式を渡し、異なる関数パラメータを持つ一連のメンバー関数を呼び出します。

このコードははるかに読みやすくなったため、間違いを犯す可能性が低くなります。

## ユースケースの概要

このセクションでは、Kotlinで利用できるさまざまなスコープ関数と、コードをよりイディオマティックにするための主なユースケースについて説明しました。この表をクイックリファレンスとして使用できます。これらの関数の動作を完全に理解していなくても、コードでそれらを使用できることに注意することが重要です。

| 関数   | `x` へのアクセス方法 | 戻り値     | ユースケース                                                                         |
|--------|----------------------|------------|--------------------------------------------------------------------------------------|
| `let`  | `it`                 | ラムダの結果 | コードでnullチェックを実行し、後で返されたオブジェクトに対してさらなるアクションを実行します。 |
| `apply`| `this`               | `x`        | 作成時にオブジェクトを初期化します。                                                  |
| `run`  | `this`               | ラムダの結果 | 作成時にオブジェクトを初期化し、**かつ**結果を計算します。                             |
| `also` | `it`                 | `x`        | オブジェクトを返す前に追加のアクションを完了します。                                   |
| `with` | `this`               | ラムダの結果 | オブジェクトに対して複数の関数を呼び出します。                                        |

スコープ関数の詳細については、[スコープ関数](scope-functions.md)を参照してください。

## 練習

### 演習 1 {initial-collapse-state="collapsed" collapsible="true" id="scope-functions-exercise-1"}

`.getPriceInEuros()` 関数を、セーフコール演算子 `?.` と `let` スコープ関数を使用する単一式関数として書き換えてください。

<deflist collapsible="true">
    <def title="ヒント">
        セーフコール演算子 <code>?.</code> を使用して、<code>getProductInfo()</code> 関数から <code>priceInDollars</code> プロパティに安全にアクセスします。
        次に、<code>let</code> スコープ関数を使用して、<code>priceInDollars</code> の値をユーロに変換します。
    </def>
</deflist>

|---|---|
```kotlin
data class ProductInfo(val priceInDollars: Double?)

class Product {
    fun getProductInfo(): ProductInfo? {
        return ProductInfo(100.0)
    }
}

// この関数を書き換えてください
fun Product.getPriceInEuros(): Double? {
    val info = getProductInfo()
    if (info == null) return null
    val price = info.priceInDollars
    if (price == null) return null
    return convertToEuros(price)
}

fun convertToEuros(dollars: Double): Double {
    return dollars * 0.85
}

fun main() {
    val product = Product()
    val priceInEuros = product.getPriceInEuros()

    if (priceInEuros != null) {
        println("Price in Euros: €$priceInEuros")
        // Price in Euros: €85.0
    } else {
        println("Price information is not available.")
    }
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-scope-functions-exercise-1"}

|---|---|
```kotlin
data class ProductInfo(val priceInDollars: Double?)

class Product {
    fun getProductInfo(): ProductInfo? {
        return ProductInfo(100.0)
    }
}

fun Product.getPriceInEuros() = getProductInfo()?.priceInDollars?.let { convertToEuros(it) }

fun convertToEuros(dollars: Double): Double {
    return dollars * 0.85
}

fun main() {
    val product = Product()
    val priceInEuros = product.getPriceInEuros()

    if (priceInEuros != null) {
        println("Price in Euros: €$priceInEuros")
        // Price in Euros: €85.0
    } else {
        println("Price information is not available.")
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-scope-functions-solution-1"}

### 演習 2 {initial-collapse-state="collapsed" collapsible="true" id="scope-functions-exercise-2"}

ユーザーのメールアドレスを更新する `updateEmail()` 関数があります。`apply` スコープ関数を使用してメールアドレスを更新し、次に `also` スコープ関数を使用してログメッセージ `Updating email for user with ID: ${it.id}` を出力してください。

|---|---|
```kotlin
data class User(val id: Int, var email: String)

fun updateEmail(user: User, newEmail: String): User = // ここにコードを記述してください

fun main() {
    val user = User(1, "old_email@example.com")
    val updatedUser = updateEmail(user, "new_email@example.com")
    // Updating email for user with ID: 1

    println("Updated User: $updatedUser")
    // Updated User: User(id=1, email=new_email@example.com)
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-scope-functions-exercise-2"}

|---|---|
```kotlin
data class User(val id: Int, var email: String)

fun updateEmail(user: User, newEmail: String): User = user.apply {
    this.email = newEmail
}.also { println("Updating email for user with ID: ${it.id}") }

fun main() {
    val user = User(1, "old_email@example.com")
    val updatedUser = updateEmail(user, "new_email@example.com")
    // Updating email for user with ID: 1

    println("Updated User: $updatedUser")
    // Updated User: User(id=1, email=new_email@example.com)
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-scope-functions-solution-2"}

## 次のステップ

[中級: レシーバ付きラムダ式](kotlin-tour-intermediate-lambdas-receiver.md)