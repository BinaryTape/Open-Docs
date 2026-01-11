[//]: # (title: 中級: スコープ関数)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="最初のステップ" /> <a href="kotlin-tour-intermediate-extension-functions.md">拡張関数</a><br />
        <img src="icon-2.svg" width="20" alt="2番目のステップ" /> <strong>スコープ関数</strong><br />
        <img src="icon-3-todo.svg" width="20" alt="3番目のステップ" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">レシーバー付きラムダ式</a><br />
        <img src="icon-4-todo.svg" width="20" alt="4番目のステップ" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">クラスとインターフェース</a><br />
        <img src="icon-5-todo.svg" width="20" alt="5番目のステップ" /> <a href="kotlin-tour-intermediate-objects.md">オブジェクト</a><br />
        <img src="icon-6-todo.svg" width="20" alt="6番目のステップ" /> <a href="kotlin-tour-intermediate-open-special-classes.md">open クラスと特殊なクラス</a><br />
        <img src="icon-7-todo.svg" width="20" alt="7番目のステップ" /> <a href="kotlin-tour-intermediate-properties.md">プロパティ</a><br />
        <img src="icon-8-todo.svg" width="20" alt="8番目のステップ" /> <a href="kotlin-tour-intermediate-null-safety.md">Null安全性</a><br />
        <img src="icon-9-todo.svg" width="20" alt="9番目のステップ" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">ライブラリとAPI</a></p>
</tldr>

この章では、拡張関数の理解を深め、スコープ関数を使用してよりイディオマティックなコードを書く方法を学びます。

## スコープ関数

プログラミングにおいて、スコープとは変数またはオブジェクトが認識される範囲を指します。最も一般的に参照されるスコープは、グローバルスコープとローカルスコープです。

*   **グローバルスコープ** – プログラム内のどこからでもアクセス可能な変数またはオブジェクト。
*   **ローカルスコープ** – 定義されているブロックまたは関数内でのみアクセス可能な変数またはオブジェクト。

Kotlinには、オブジェクトの周囲に一時的なスコープを作成し、一部のコードを実行できるスコープ関数もあります。

スコープ関数を使用すると、一時的なスコープ内でオブジェクトの名前を参照する必要がないため、コードをより簡潔にできます。スコープ関数に応じて、`this` キーワードを介してオブジェクトを参照するか、`it` キーワードを介して引数として使用することでオブジェクトにアクセスできます。

Kotlinには、`let`、`apply`、`run`、`also`、`with` の合計5つのスコープ関数があります。

各スコープ関数はラムダ式を受け取り、オブジェクトまたはラムダ式の結果のいずれかを返します。このツアーでは、各スコープ関数と、その使用方法を説明します。

> Sebastian Aigner 氏（Kotlin開発者アドボケイト）によるスコープ関数に関するトーク、[Back to the Stdlib: Making the Most of Kotlin's Standard Library](https://youtu.be/DdvgvSHrN9g?feature=shared&t=1511) もご覧いただけます。
>
{style="tip"}

### Let

`let` スコープ関数は、コードで null チェックを実行し、後で返されたオブジェクトに対してさらにアクションを実行したい場合に使用します。

例を見てみましょう。

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

この例では、nullable な `String` 型の変数 `address` を作成します。しかし、`sendNotification()` 関数を呼び出す際に問題が発生します。この関数は `address` が `null` 値である可能性を想定していないためです。結果として、コンパイラはエラーを報告します。

```text
Argument type mismatch: actual type is 'String?', but 'String' was expected.
```

入門ツアーから、if 条件を使って null チェックを実行したり、[Elvis演算子 `?:`](kotlin-tour-null-safety.md#use-elvis-operator) を使用できることをすでに知っています。しかし、返されたオブジェクトを後でコードで使用したい場合はどうでしょうか？これは、if 条件 **と** else ブランチを使用することで実現できます。

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

この例では、次のことを行っています。
*   `address` と `confirm` という変数を作成します。
*   `address` 変数に対して `let` スコープ関数を安全呼び出しで使用します。
*   `let` スコープ関数内に一時的なスコープを作成します。
*   `sendNotification()` 関数をラムダ式として `let` スコープ関数に渡します。
*   一時的なスコープを使用して、`it` を介して `address` 変数を参照します。
*   結果を `confirm` 変数に代入します。

このアプローチにより、コードは `address` 変数が `null` 値である可能性を処理でき、後でコードで `confirm` 変数を使用できます。

### Apply

`apply` スコープ関数は、クラスインスタンスのようなオブジェクトを、コードの後の方ではなく、作成時に初期化するために使用します。このアプローチにより、コードが読みやすく、管理しやすくなります。

例を見てみましょう。

```kotlin
class Client() {
    var token: String? = null
    fun connect() = println("connected!")
    fun authenticate() = println("authenticated!")
    fun getData() : String {
        println("getting data!")
        return "Mock data"
    }
}

val client = Client()

fun main() {
    client.token = "asdf"
    client.connect()
    // connected!
    client.authenticate()
    // authenticated!
    client.getData()
    // getting data!
}
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-apply-before"}

この例には、`token` という1つのプロパティと、`connect()`、`authenticate()`、`getData()` の3つのメンバー関数を持つ `Client` クラスがあります。

この例では、`client` を `Client` クラスのインスタンスとして作成し、その `token` プロパティを初期化し、`main()` 関数でメンバー関数を呼び出しています。

この例は簡潔ですが、実際には、クラスインスタンスを作成してから設定して使用する（およびそのメンバー関数を呼び出す）までに時間がかかる場合があります。しかし、`apply` スコープ関数を使用すると、クラスインスタンスの作成、設定、およびメンバー関数の使用をすべてコードの同じ場所で行うことができます。

```kotlin
class Client() {
    var token: String? = null
    fun connect() = println("connected!")
    fun authenticate() = println("authenticated!")
    fun getData() : String {
        println("getting data!")
        return "Mock data"
    }
}
//sampleStart
val client = Client().apply {
    token = "asdf"
    connect()
    // connected!
    authenticate()
    // authenticated!
}

fun main() {
    client.getData()
    // getting data!
}
//sampleEnd
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-apply-after"}

この例では、次のことを行っています。

*   `client` を `Client` クラスのインスタンスとして作成します。
*   `client` インスタンスに対して `apply` スコープ関数を使用します。
*   `apply` スコープ関数内に一時的なスコープを作成し、そのプロパティや関数にアクセスする際に `client` インスタンスを明示的に参照する必要がないようにします。
*   `token` プロパティを更新し、`connect()` および `authenticate()` 関数を呼び出すラムダ式を `apply` スコープ関数に渡します。
*   `main()` 関数で `client` インスタンスの `getData()` メンバー関数を呼び出します。

ご覧のとおり、この戦略は大規模なコードを扱う場合に便利です。

### Run

`apply` と同様に、`run` スコープ関数を使用してオブジェクトを初期化できますが、コードの特定の瞬間にオブジェクトを初期化 **し**、すぐに結果を計算したい場合は `run` を使用する方が良いです。

`apply` 関数の前の例を続けますが、今回は `connect()` 関数と `authenticate()` 関数をグループ化し、すべてのリクエストで呼び出されるようにしたいとします。

例:

```kotlin
class Client() {
    var token: String? = null
    fun connect() = println("connected!")
    fun authenticate() = println("authenticated!")
    fun getData() : String {
        println("getting data!")
        return "Mock data"
    }
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
        // getting data!
    }
}
//sampleEnd
```
{kotlin-runnable="true" id="kotlin-tour-scope-function-run"}

この例では、次のことを行っています。

*   `client` を `Client` クラスのインスタンスとして作成します。
*   `client` インスタンスに対して `apply` スコープ関数を使用します。
*   `apply` スコープ関数内に一時的なスコープを作成し、そのプロパティや関数にアクセスする際に `client` インスタンスを明示的に参照する必要がないようにします。
*   `token` プロパティを更新するラムダ式を `apply` スコープ関数に渡します。

`main()` 関数は、次のことを行います。

*   `String` 型の `result` 変数を作成します。
*   `client` インスタンスに対して `run` スコープ関数を使用します。
*   `run` スコープ関数内に一時的なスコープを作成し、そのプロパティや関数にアクセスする際に `client` インスタンスを明示的に参照する必要がないようにします。
*   `connect()`、`authenticate()`、および `getData()` 関数を呼び出すラムダ式を `run` スコープ関数に渡します。
*   結果を `result` 変数に代入します。

これで、返された結果をコード内でさらに使用できます。

### Also

`also` スコープ関数は、オブジェクトに対して追加のアクションを完了し、そのオブジェクトを返してコード内で引き続き使用する（例えばログを書き込むなど）場合に使用します。

例を見てみましょう。

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

この例では、次のことを行っています。

*   文字列のリストを含む `medals` 変数を作成します。
*   `List<String>` 型の `reversedLongUpperCaseMedals` 変数を作成します。
*   `medals` 変数に対して `.map()` 拡張関数を使用します。
*   `it` キーワードを介して `medals` を参照し、その上で `.uppercase()` 拡張関数を呼び出すラムダ式を `.map()` 関数に渡します。
*   `medals` 変数に対して `.filter()` 拡張関数を使用します。
*   `it` キーワードを介して `medals` を参照し、`medals` 変数に含まれるリストの長さが4項目よりも長いかどうかをチェックするラムダ式を述語として `.filter()` 関数に渡します。
*   `medals` 変数に対して `.reversed()` 拡張関数を使用します。
*   結果を `reversedLongUpperCaseMedals` 変数に代入します。
*   `reversedLongUpperCaseMedals` 変数に含まれるリストを出力します。

関数呼び出しの間にログを追加して、`medals` 変数に何が起きているかを確認できると便利です。`also` 関数はこれに役立ちます。

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

この例では、次のことを行っています。

*   `medals` 変数に対して `also` スコープ関数を使用します。
*   `also` スコープ関数内に一時的なスコープを作成し、`medals` 変数を関数パラメータとして使用する際に明示的に参照する必要がないようにします。
*   `it` キーワードを介して `medals` 変数を関数パラメータとして使用して `println()` 関数を呼び出すラムダ式を `also` スコープ関数に渡します。

`also` 関数はオブジェクトを返すため、ログ記録だけでなく、デバッグ、複数の操作のチェイン、およびコードのメインフローに影響を与えないその他の副作用操作の実行にも役立ちます。

### With

他のスコープ関数とは異なり、`with` は拡張関数ではないため、構文が異なります。レシーバーオブジェクトを引数として `with` に渡します。

オブジェクトに対して複数の関数を呼び出したい場合は、`with` スコープ関数を使用します。

この例を見てみましょう。

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

この例では、`mainMonitorPrimaryBufferBackedCanvas` を `Canvas` クラスのインスタンスとして作成し、そのインスタンスで異なる関数パラメータを持つ一連のメンバー関数を呼び出しています。

このコードは読みにくいことがわかります。`with` 関数を使用すると、コードは効率化されます。

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

この例では、次のことを行っています。
*   `mainMonitorSecondaryBufferBackedCanvas` インスタンスをレシーバーとして `with` スコープ関数を使用します。
*   `with` スコープ関数内に一時的なスコープを作成し、そのメンバー関数を呼び出す際に `mainMonitorSecondaryBufferBackedCanvas` インスタンスを明示的に参照する必要がないようにします。
*   異なる関数パラメータを持つ一連のメンバー関数を呼び出すラムダ式を `with` スコープ関数に渡します。

このコードがはるかに読みやすくなったため、間違いを犯す可能性が低くなります。

## ユースケースの概要

このセクションでは、Kotlinで利用できるさまざまなスコープ関数と、コードをよりイディオマティックにするための主要なユースケースについて説明しました。この表をクイックリファレンスとして使用できます。これらの関数がどのように機能するかを完全に理解していなくても、コードで使用できることに注意することが重要です。

| 関数    | `x`へのアクセス方法 | 戻り値        | ユースケース                                                           |
|---------|-------------------|---------------|------------------------------------------------------------------------|
| `let`   | `it`              | ラムダの結果  | コードで null チェックを実行し、後で返されたオブジェクトに対してさらにアクションを実行する。 |
| `apply` | `this`            | `x`           | オブジェクトを作成時に初期化する。                                         |
| `run`   | `this`            | ラムダの結果  | オブジェクトを作成時に初期化 **し**、結果を計算する。                        |
| `also`  | `it`              | `x`           | オブジェクトを返す前に追加のアクションを完了する。                             |
| `with`  | `this`            | ラムダの結果  | オブジェクトに対して複数の関数を呼び出す。                                 |

スコープ関数の詳細については、[スコープ関数](scope-functions.md) を参照してください。

## 練習問題

### 演習 1 {initial-collapse-state="collapsed" collapsible="true" id="scope-functions-exercise-1"}

`.getPriceInEuros()` 関数を、安全呼び出し演算子 `?.` と `let` スコープ関数を使用する単一式関数として書き直してください。

<deflist collapsible="true">
    <def title="ヒント">
        安全呼び出し演算子 <code>?.</code> を使用して、<code>getProductInfo()</code> 関数から <code>priceInDollars</code> プロパティに安全にアクセスします。その後、<code>let</code> スコープ関数を使用して、<code>priceInDollars</code> の値をユーロに変換します。
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

// Rewrite this function
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

fun updateEmail(user: User, newEmail: String): User = // Write your code here

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

[中級: レシーバー付きラムダ式](kotlin-tour-intermediate-lambdas-receiver.md)