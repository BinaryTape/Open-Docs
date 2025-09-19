[//]: # (title: Intermediate: 拡張関数)

<no-index/>

<tldr>
    <p><img src="icon-1.svg" width="20" alt="First step" /> <strong>拡張関数</strong><br />
        <img src="icon-2-todo.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">スコープ関数</a><br />
        <img src="icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">レシーバー付きラムダ式</a><br />
        <img src="icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">クラスとインターフェース</a><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">オブジェクト</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">openクラスと特殊クラス</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">プロパティ</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">Null安全性</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">ライブラリとAPI</a></p>
</tldr>

この章では、コードをより簡潔で読みやすくするKotlinの特殊な関数について説明します。これらの関数が、効率的な設計パターンを使用してプロジェクトを次のレベルに引き上げるのにどのように役立つかを学びます。

## 拡張関数

ソフトウェア開発では、元のソースコードを変更せずにプログラムの動作を変更する必要があることがよくあります。たとえば、プロジェクトでサードパーティライブラリのクラスに追加の機能を持たせたい場合があります。

**拡張関数**を追加してクラスを拡張することで、これを実現できます。拡張関数は、クラスのメンバー関数を呼び出すのと同じ方法で、ピリオド (`.`) を使用して呼び出します。

拡張関数の完全な構文を導入する前に、**レシーバー**とは何かを理解する必要があります。レシーバーとは、関数が呼び出される対象のことです。言い換えれば、レシーバーは情報が共有される場所、または共有される相手です。

![送信者と受信者の例](receiver-highlight.png){width="500"}

この例では、`main()`関数がリストの最初の要素を返す[`.first()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/first.html)関数を呼び出しています。
`.first()`関数は`readOnlyShapes`変数**に対して**呼び出されるため、`readOnlyShapes`変数がレシーバーです。

拡張関数を作成するには、拡張したいクラス名の後に`.`を記述し、その後に自分の関数名を記述します。その後に、引数や戻り値の型を含む残りの関数宣言を続けます。

例:

```kotlin
fun String.bold(): String = "<b>$this</b>"

fun main() {
    // "hello" is the receiver
    println("hello".bold())
    // <b>hello</b>
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-extension-function"}

この例では:

*   `String`は拡張されたクラスです。
*   `bold`は拡張関数の名前です。
*   `.bold()`拡張関数の戻り値の型は`String`です。
*   `String`のインスタンスである`"hello"`はレシーバーです。
*   レシーバーは、本体内で[キーワード](keyword-reference.md) `this`によってアクセスされます。
*   文字列テンプレート (` ` `) を使用して、`this`の値にアクセスします。
*   `.bold()`拡張関数は、文字列を受け取り、太字テキスト用の`<b>` HTML要素でそれを返します。

## 拡張指向設計

拡張関数はどこでも定義できるため、拡張指向設計を作成できます。これらの設計は、コア機能を有用だが不可欠ではない機能から分離し、コードの読みやすさとメンテナンス性を向上させます。

良い例は、ネットワークリクエストの実行に役立つKtorライブラリの[`HttpClient`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html)クラスです。その機能のコアは、HTTPリクエストに必要なすべての情報を受け取る単一の関数`request()`です。

```kotlin
class HttpClient {
    fun request(method: String, url: String, headers: Map<String, String>): HttpResponse {
        // Network code
    }
}
```
{validate="false"}

実際には、最も一般的なHTTPリクエストはGETまたはPOSTリクエストです。ライブラリがこれらの一般的なユースケースに対して短い名前を提供することは理にかなっています。ただし、これらは新しいネットワークコードを記述する必要はなく、特定の`request`呼び出しのみが必要です。言い換えれば、これらは個別の`.get()`および`.post()`拡張関数として定義するのに最適な候補です。

```kotlin
fun HttpClient.get(url: String): HttpResponse = request("GET", url, emptyMap())
fun HttpClient.post(url: String): HttpResponse = request("POST", url, emptyMap())
```
{validate="false"}

これらの`.get()`および`.post()`関数は、正しいHTTPメソッドで`request()`関数を呼び出すため、自分で呼び出す必要はありません。これらはコードを簡素化し、理解しやすくします。

```kotlin
class HttpClient {
    fun request(method: String, url: String, headers: Map<String, String>): HttpResponse {
        println("Requesting $method to $url with headers: $headers")
        return HttpResponse("Response from $url")
    }
}

fun HttpClient.get(url: String): HttpResponse = request("GET", url, emptyMap())

fun main() {
    val client = HttpClient()

    // Making a GET request using request() directly
    val getResponseWithMember = client.request("GET", "https://example.com", emptyMap())

    // Making a GET request using the get() extension function
    val getResponseWithExtension = client.get("https://example.com")
}
```
{validate="false"}

この拡張指向アプローチは、Kotlinの[標準ライブラリ](https://kotlinlang.org/api/latest/jvm/stdlib/)やその他のライブラリで広く使用されています。たとえば、`String`クラスには、文字列を操作するのに役立つ多くの[拡張関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/#extension-functions)があります。

拡張関数の詳細については、[拡張](extensions.md)を参照してください。

## 練習

### 演習1 {initial-collapse-state="collapsed" collapsible="true" id="extension-functions-exercise-1"}

整数を受け取り、それが正であるかをチェックする`isPositive`という拡張関数を記述してください。

|---|---|
```kotlin
fun Int.// Write your code here

fun main() {
    println(1.isPositive())
    // true
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-extension-functions-exercise-1"}

|---|---|
```kotlin
fun Int.isPositive(): Boolean = this > 0

fun main() {
    println(1.isPositive())
    // true
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-extension-functions-solution-1"}

### 演習2 {initial-collapse-state="collapsed" collapsible="true" id="extension-functions-exercise-2"}

文字列を受け取り、それを小文字バージョンで返す`toLowercaseString`という拡張関数を記述してください。

<deflist collapsible="true">
    <def title="ヒント">
        `String`型の<a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html"> <code>.lowercase()</code>
        </a>関数を使用してください。
    </def>
</deflist>

|---|---|
```kotlin
fun // Write your code here

fun main() {
    println("Hello World!".toLowercaseString())
    // hello world!
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-extension-functions-exercise-2"}

|---|---|
```kotlin
fun String.toLowercaseString(): String = this.lowercase()

fun main() {
    println("Hello World!".toLowercaseString())
    // hello world!
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-extension-functions-solution-2"}

## 次のステップ

[Intermediate: スコープ関数](kotlin-tour-intermediate-scope-functions.md)