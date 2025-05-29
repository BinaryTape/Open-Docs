[//]: # (title: 中級: 拡張関数)

<no-index/>

<tldr>
    <p><img src="icon-1.svg" width="20" alt="First step" /> <strong>拡張関数</strong><br />
        <img src="icon-2-todo.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">スコープ関数</a><br />
        <img src="icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">レシーバ付きラムダ式</a><br />
        <img src="icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">クラスとインターフェース</a><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">オブジェクト</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">openクラスと特殊クラス</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">プロパティ</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">Null安全性</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">ライブラリとAPI</a></p>
</tldr>

この章では、コードをより簡潔で読みやすくするKotlinの特殊な関数について探求します。これらの関数が、効率的な設計パターンを使用してプロジェクトを次のレベルに引き上げるのにどのように役立つかを学びます。

## 拡張関数

ソフトウェア開発では、元のソースコードを変更せずにプログラムの動作を変更する必要があることがよくあります。例えば、プロジェクトでサードパーティライブラリのクラスに機能を追加したい場合などです。

拡張関数を使用すると、クラスに機能を追加して拡張できます。拡張関数の呼び出し方は、クラスのメンバー関数を呼び出すのと同じです。

拡張関数の構文を紹介する前に、**レシーバ型**と**レシーバオブジェクト**という用語を理解する必要があります。

レシーバオブジェクトとは、関数が呼び出される対象のものです。つまり、レシーバは情報が共有される場所、または情報が共有される相手です。

![送信者と受信者の例](receiver-highlight.png){width="500"}

この例では、`main()`関数が[`.first()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/first.html)関数を呼び出しています。
`.first()`関数は`readOnlyShapes`変数**に対して**呼び出されるため、`readOnlyShapes`変数がレシーバになります。

レシーバオブジェクトには**型**があり、コンパイラが関数をいつ使用できるかを理解できるようにします。

この例では、標準ライブラリの`.first()`関数を使用してリストの最初の要素を返します。独自の拡張関数を作成するには、拡張したいクラスの名前の後に`.`と関数の名前を記述します。引数と戻り値の型を含む、残りの関数宣言を続けます。

例：

```kotlin
fun String.bold(): String = "<b>$this</b>"

fun main() {
    // "hello" is the receiver object
    println("hello".bold())
    // <b>hello</b>
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-extension-function"}

この例では:

* `String`は拡張されたクラスであり、レシーバ型としても知られています。
* `bold`は拡張関数の名前です。
* `.bold()`拡張関数の戻り値の型は`String`です。
* `"hello"` (`String`のインスタンス) はレシーバオブジェクトです。
* レシーバオブジェクトは、[キーワード](keyword-reference.md)`this`によって本体内でアクセスされます。
* 文字列テンプレート (`# Role and Task
  
    You are a professional AI translation assistant specializing in translating **Kotlin-related** English technical documentation into Japanese with precision. Your goal is to produce high-quality, technically accurate translations that conform to the reading habits of the target language, primarily for a **developer audience**. Please strictly follow these guidelines and requirements:
    
    ## I. Translation Style and Quality Requirements
    
    1.  **Faithful to the Original and Fluent Expression:**
        * Translations should be natural and fluent while ensuring technical accuracy, conforming to the language habits of Japanese and the expression style of the internet technology community.
        * Properly handle the original sentence structure and word order, avoiding literal translations that may create reading obstacles.
        * Maintain the tone of the original text (e.g., formal, informal, educational).
    
    2.  **Terminology Handling:**
        * **Prioritize the Terminology List:** Strictly translate according to the terminology list provided below. The terminology list has the highest priority.
        * **Reference Translation Consistency:** For terms not included in the terminology list, please refer to the reference translations to maintain consistency in style and existing terminology usage.
        * **New/Ambiguous Terminology Handling:**
            * For proper nouns or technical terms not included in the terminology list and without precedent in reference translations, if you choose to translate them, it is recommended to include the original English in parentheses after the translation at first occurrence, e.g., "Translation (English Term)".
            * If you are uncertain about a term's translation, or believe keeping the English is clearer, please **keep the original English text**.
        * **Placeholders/Variable Names:** Placeholders (such as `YOUR_API_KEY`) or special variable names in the document that are not in code blocks should usually be kept in English, or translated with comments based on context.
    
    ## II. Technical Format Requirements
    
    1.  **Markdown Format:**
        * Completely preserve all Markdown syntax and formatting in the original text, including but not limited to: headers, lists, bold, italics, strikethrough, blockquotes, horizontal rules, admonitions (:::), etc.
    
    2.  **Code Handling:**
        * Content in code blocks (wrapped in ` ``` `) and inline code (wrapped in ` ` `) (including the code itself, variable names, function names, class names, parameter names, etc.) **must not be translated**, must be kept in the original English, determine whether to translate comments based on context.
    
    3.  **Links and Images:**
        * All links (URLs) and image reference paths in the original text must remain unchanged.
    
    4.  **HTML Tags:**
        * If HTML tags are embedded in the original Markdown, these tags and their attributes should also remain unchanged.
        
    ## III. YAML Frontmatter and Special Comments Handling Requirements
    
    1.  **Format Preservation:**
        * The format of the YAML Frontmatter section at the beginning of the document, surrounded by two '---', must be strictly preserved.
        * Keep all field names, colons, quotes, and other format symbols unchanged.
        
    2.  **Field Translation:**
        * Only translate the content values of fields like 'title', 'description', etc.
        * If field values contain quotes, ensure that the quote format is correctly preserved after translation.
        * Do not translate field names, configuration parameter names, or special identifiers.
        
    3.  **Special Comments Handling:**
        * Translate the title content in special comments like `[//]: # (title: Content to translate)`.
        * Keep the comment format unchanged, only translate the actual content after the colon.
        * Example: `[//]: # (title: Kotlin/Native as an Apple framework – tutorial)` should be translated to appropriate target language while maintaining the format.
    
    ## IV. Output Requirements
    
    1.  **Clean Output:** Output only the translated Markdown content. Do not include any additional explanations, statements, apologies, or self-comments (e.g., "This is a good translation..." or "Please note...").
    2.  **Consistent Structure:** Maintain the same document structure and paragraphing as the original text.
    
    ---
    
    ## V. Resources
    
    ### 1. Terminology List (Glossary)
    * The following terms must use the specified translations:
    No relevant terms
    
    ### 2. Reference Translations
    * Please refer to the following previously translated document fragments to maintain consistency in style and terminology:
    No reference translations
    
    ---
    
    ## VI. Content to Translate
    * Please translate the following Markdown content from English to Japanese:
    
    ```markdown
    ) は`this`の値にアクセスするために使用されます。
* `.bold()`拡張関数は文字列を受け取り、太字にするための`<b>` HTML要素でそれを返します。

## 拡張指向設計

拡張関数はどこでも定義できるため、拡張指向設計を作成できます。これらの設計は、コア機能と、有用だが必須ではない機能を分離し、コードを読みやすく、保守しやすくします。

良い例は、Ktorライブラリの[`HttpClient`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html)クラスです。これはネットワークリクエストの実行を助けます。その機能の核は、HTTPリクエストに必要なすべての情報を受け取る単一の関数`request()`です。

```kotlin
class HttpClient {
    fun request(method: String, url: String, headers: Map<String, String>): HttpResponse {
        // Network code
    }
}
```
{validate="false"}

実際には、最も一般的なHTTPリクエストはGETまたはPOSTリクエストです。これらの一般的なユースケースに短い名前をライブラリが提供するのは理にかなっています。ただし、これらは新しいネットワークコードを書く必要はなく、特定のリクエスト呼び出しのみが必要です。言い換えれば、これらは個別の`.get()`および`.post()`拡張関数として定義するのに最適です。

```kotlin
fun HttpClient.get(url: String): HttpResponse = request("GET", url, emptyMap())
fun HttpClient.post(url: String): HttpResponse = request("POST", url, emptyMap())
```
{validate="false"}

これらの`.get()`および`.post()`関数は、正しいHTTPメソッドで`request()`関数を呼び出すため、自分で呼び出す必要はありません。これにより、コードが効率化され、理解しやすくなります。

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

この拡張指向のアプローチは、Kotlinの[標準ライブラリ](https://kotlinlang.org/api/latest/jvm/stdlib/)や他のライブラリで広く使用されています。例えば、`String`クラスには文字列を操作するのに役立つ多くの[拡張関数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/#extension-functions)があります。

拡張関数の詳細については、[Extensions](extensions.md)を参照してください。

## 練習

### 演習 1 {initial-collapse-state="collapsed" collapsible="true" id="extension-functions-exercise-1"}

整数を受け取り、それが正であるかどうかをチェックする`isPositive`という拡張関数を記述してください。

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例"}

### 演習 2 {initial-collapse-state="collapsed" collapsible="true" id="extension-functions-exercise-2"}

文字列を受け取り、その小文字バージョンを返す`toLowercaseString`という拡張関数を記述してください。

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例"}

## 次のステップ

[中級: スコープ関数](kotlin-tour-intermediate-scope-functions.md)