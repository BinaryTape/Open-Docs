[//]: # (title: Spring Bootプロジェクトにデータベースのサポートを追加する)

<web-summary>Kotlinで書かれたSpring Bootプロジェクトに、JDBCテンプレートを使用してデータベースサポートを追加します。</web-summary>

<tldr>
    <p>これは**Spring BootとKotlin入門**チュートリアルの第3部です。進む前に、前の手順を完了していることを確認してください。</p><br/>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot.md">KotlinでSpring Bootプロジェクトを作成する</a><br/><img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="jvm-spring-boot-add-data-class.md">Spring Bootプロジェクトにデータクラスを追加する</a><br/><img src="icon-3.svg" width="20" alt="Third step"/> <strong>Spring Bootプロジェクトにデータベースのサポートを追加する</strong><br/><img src="icon-4-todo.svg" width="20" alt="Fourth step"/> データベースアクセスにSpring Data CrudRepositoryを使用する</p>
</tldr>

このチュートリアルのパートでは、_Java Database Connectivity_ (JDBC) を使用して、データベースをプロジェクトに追加し、設定します。
JVMアプリケーションでは、JDBCを使用してデータベースと対話します。
Spring Frameworkは、利便性のために `JdbcTemplate` クラスを提供しており、JDBCの使用を簡素化し、よくあるエラーを回避するのに役立ちます。

## データベースサポートを追加する

Spring Frameworkベースのアプリケーションでは、データベースアクセスロジックをいわゆる_サービス層_ (service layer) —ビジネスロジックが存在する場所— の中に実装するのが一般的な慣習です。
Springでは、クラスがアプリケーションのサービス層に属することを意味するために、`@Service` アノテーションでクラスをマークする必要があります。
このアプリケーションでは、この目的のために `MessageService` クラスを作成します。

同じパッケージに `MessageService.kt` ファイルと `MessageService` クラスを次のように作成します。

```kotlin
// MessageService.kt
package com.example.demo

import org.springframework.stereotype.Service
import org.springframework.jdbc.core.JdbcTemplate
import java.util.*

@Service
class MessageService(private val db: JdbcTemplate) {
    fun findMessages(): List<Message> = db.query("select * from messages") { response, _ ->
        Message(response.getString("id"), response.getString("text"))
    }

    fun save(message: Message): Message {
        db.update(
            "insert into messages values ( ?, ? )",
            message.id, message.text
        )
        return message
    }
}
```

<deflist collapsible="true">
   <def title="コンストラクタ引数と依存性注入 – (private val db: JdbcTemplate)">
      <p>Kotlinのクラスにはプライマリコンストラクタがあります。また、1つまたは複数の<a href="classes.md#secondary-constructors">セカンダリコンストラクタ</a>を持つこともできます。
      プライマリコンストラクタはクラスヘッダーの一部であり、クラス名とオプションの型パラメータの後に続きます。このケースでは、コンストラクタは <code>(val db: JdbcTemplate)</code> です。</p>
      <p><code>val db: JdbcTemplate</code> はコンストラクタの引数です。</p>
      <code-block lang="kotlin">
      @Service
      class MessageService(private val db: JdbcTemplate)
      </code-block>
  </def>
   <def title="末尾ラムダとSAM変換">
      <p><code>findMessages()</code> 関数は <code>JdbcTemplate</code> クラスの <code>query()</code> 関数を呼び出します。<code>query()</code> 関数は2つの引数を取ります。1つはStringインスタンスとしてのSQLクエリ、もう1つは行ごとに1つのオブジェクトをマッピングするコールバックです。</p>
      <code-block lang="sql">
      db.query("...", RowMapper { ... } )
      </code-block><br/>
      <p><code>RowMapper</code> インターフェースは1つのメソッドのみを宣言しているため、インターフェース名を省略してラムダ式で実装することが可能です。Kotlinコンパイラは、関数呼び出しのパラメータとして使用しているため、ラムダ式が変換されるべきインターフェースを認識しています。これは<a href="java-interop.md#sam-conversions">KotlinにおけるSAM変換</a>として知られています。</p>
      <code-block lang="sql">
      db.query("...", { ... } )
      </code-block><br/>
      <p>SAM変換の後、query関数は2つの引数、すなわち最初の位置にString、最後の位置にラムダ式を持つことになります。Kotlinの規約によれば、関数の最後のパラメータが関数である場合、対応する引数として渡されるラムダ式は括弧の外に配置できます。このような構文は<a href="lambdas.md#passing-trailing-lambdas">末尾ラムダ</a>とも呼ばれます。</p>
      <code-block lang="sql">
      db.query("...") { ... }
      </code-block>
   </def>
   <def title="未使用のラムダ引数に対するアンダースコア">
      <p>複数のパラメータを持つラムダの場合、使用しないパラメータの名前をアンダースコア <code>_</code> 文字に置き換えることができます。</p>
      <p>したがって、query関数の呼び出しの最終的な構文は次のようになります。</p>
      <code-block lang="kotlin">
      db.query("select * from messages") { response, _ ->
          Message(response.getString("id"), response.getString("text"))
      }
      </code-block>
   </def>
</deflist>

## MessageControllerクラスを更新する

`MessageController.kt` を更新して、新しい `MessageService` クラスを使用するようにします。

```kotlin
// MessageController.kt
package com.example.demo

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.net.URI

@RestController
@RequestMapping("/")
class MessageController(private val service: MessageService) {
    @GetMapping
    fun listMessages() = service.findMessages()

    @PostMapping
    fun post(@RequestBody message: Message): ResponseEntity<Message> {
        val savedMessage = service.save(message)
        return ResponseEntity.created(URI("/${savedMessage.id}")).body(savedMessage)
    }
}
```

<deflist collapsible="true">
   <def title="@PostMapping アノテーション">
      <p>HTTP POSTリクエストを処理するメソッドには <code>@PostMapping</code> アノテーションを付与する必要があります。HTTP Bodyコンテンツとして送信されたJSONをオブジェクトに変換できるようにするには、メソッド引数に <code>@RequestBody</code> アノテーションを使用する必要があります。Jacksonライブラリがアプリケーションのクラスパスにあるおかげで、変換は自動的に行われます。</p>
   </def>
   <def title="ResponseEntity">
      <p><code>ResponseEntity</code> は、ステータスコード、ヘッダー、ボディを含むHTTPレスポンス全体を表します。</p>
      <p> <code>created()</code> メソッドを使用すると、レスポンスのステータスコード (201) を設定し、作成されたリソースのコンテキストパスを示すロケーションヘッダーを設定できます。</p>
   </def>
</deflist>

## MessageServiceクラスを更新する

`Message` クラスの `id` はnull許容のStringとして宣言されていました。

```kotlin
data class Message(val id: String?, val text: String)
```

しかし、データベースに `null` を `id` 値として保存するのは正しくありません。この状況を適切に処理する必要があります。

`MessageService.kt` ファイルのコードを更新し、メッセージをデータベースに保存する際に `id` が `null` の場合に新しい値を生成するようにします。

```kotlin
// MessageService.kt
package com.example.demo

import org.springframework.stereotype.Service
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.query
import java.util.UUID

@Service
class MessageService(private val db: JdbcTemplate) {
    fun findMessages(): List<Message> = db.query("select * from messages") { response, _ ->
        Message(response.getString("id"), response.getString("text"))
    }

    fun save(message: Message): Message {
        val id = message.id ?: UUID.randomUUID().toString() // idがnullの場合に新しいidを生成する
        db.update(
            "insert into messages values ( ?, ? )",
            id, message.text
        )
        return message.copy(id = id) // 新しいidを持つメッセージのコピーを返す
    }
}
```

<deflist collapsible="true">
   <def title="エルビス演算子 – ?:">
      <p>コード <code>message.id ?: UUID.randomUUID().toString()</code> は、<a href="null-safety.md#elvis-operator">エルビス演算子 (if-not-null-else shorthand) <code>?:</code></a> を使用しています。<code>?:</code> の左側の式が <code>null</code> でない場合、エルビス演算子はその値を返します。それ以外の場合は、右側の式を返します。右側の式は、左側が <code>null</code> の場合にのみ評価されることに注意してください。</p>
   </def>
</deflist>

アプリケーションコードはデータベースと連携する準備ができています。次に、データソースを設定する必要があります。

## データベースを設定する

アプリケーションのデータベースを設定します。

1.  `src/main/resources` ディレクトリに `schema.sql` ファイルを作成します。このファイルにはデータベースオブジェクトの定義が格納されます。

    ![Create database schema](create-database-schema.png){width=400}

2.  `src/main/resources/schema.sql` ファイルを次のコードで更新します。

    ```sql
    -- schema.sql
    CREATE TABLE IF NOT EXISTS messages (
    id       VARCHAR(60)  PRIMARY KEY,
    text     VARCHAR      NOT NULL
    );
    ```

    これにより、`id` と `text` の2つのカラムを持つ `messages` テーブルが作成されます。このテーブル構造は `Message` クラスの構造と一致します。

3.  `src/main/resources` フォルダーにある `application.properties` ファイルを開き、次のアプリケーションプロパティを追加します。

    ```none
    spring.application.name=demo
    spring.datasource.driver-class-name=org.h2.Driver
    spring.datasource.url=jdbc:h2:file:./data/testdb
    spring.datasource.username=name
    spring.datasource.password=password
    spring.sql.init.schema-locations=classpath:schema.sql
    spring.sql.init.mode=always
    ```

    これらの設定は、Spring Bootアプリケーションのデータベースを有効にします。
    一般的なアプリケーションプロパティの完全なリストは、[Spring ドキュメント](https://docs.spring.io/spring-boot/appendix/application-properties/index.html)を参照してください。

## HTTPリクエストを介してデータベースにメッセージを追加する

以前に作成したエンドポイントを操作するには、HTTPクライアントを使用する必要があります。IntelliJ IDEAでは、組み込みHTTPクライアントを使用します。

1.  アプリケーションを実行します。アプリケーションが起動して実行されたら、POSTリクエストを実行してメッセージをデータベースに保存できます。

2.  プロジェクトのルートフォルダに `requests.http` ファイルを作成し、次のHTTPリクエストを追加します。

    ```http request
    ### Post "Hello!"
    POST http://localhost:8080/
    Content-Type: application/json
    
    {
      "text": "Hello!"
    }
    
    ### Post "Bonjour!"
    
    POST http://localhost:8080/
    Content-Type: application/json
    
    {
      "text": "Bonjour!"
    }
    
    ### Post "Privet!"
    
    POST http://localhost:8080/
    Content-Type: application/json
    
    {
      "text": "Privet!"
    }
    
    ### Get all the messages
    GET http://localhost:8080/
    ```

3.  すべてのPOSTリクエストを実行します。リクエスト宣言の横にあるガターの緑色の**実行**アイコンを使用します。
    これらのリクエストは、テキストメッセージをデータベースに書き込みます。

    ![Execute POST request](execute-post-requests.png)

4.  GETリクエストを実行し、**Run**ツールウィンドウで結果を確認します。

    ![Execute GET requests](execute-get-requests.png)

### リクエストを実行する別の方法 {initial-collapse-state="collapsed" collapsible="true"}

他のHTTPクライアントやcURLコマンドラインツールを使用することもできます。たとえば、同じ結果を得るには、ターミナルで次のコマンドを実行します。

```bash
curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Hello!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Bonjour!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Privet!\" }"

curl -X GET --location "http://localhost:8080"
```

## idでメッセージを取得する

idで個別のメッセージを取得する機能のアプリケーションを拡張します。

1.  `MessageService` クラスに、idで個別のメッセージを取得するための新しい関数 `findMessageById(id: String)` を追加します。

    ```kotlin
    // MessageService.kt
    package com.example.demo

    import org.springframework.stereotype.Service
    import org.springframework.jdbc.core.JdbcTemplate
    import org.springframework.jdbc.core.query
    import java.util.*
    
    @Service
    class MessageService(private val db: JdbcTemplate) {
        fun findMessages(): List<Message> = db.query("select * from messages") { response, _ ->
            Message(response.getString("id"), response.getString("text"))
        }
    
        fun findMessageById(id: String): Message? = db.query("select * from messages where id = ?", id) { response, _ ->
            Message(response.getString("id"), response.getString("text"))
        }.singleOrNull()
    
        fun save(message: Message): Message {
            val id = message.id ?: UUID.randomUUID().toString() // idがnullの場合に新しいidを生成する
            db.update(
                "insert into messages values ( ?, ? )",
                id, message.text
            )
            return message.copy(id = id) // 新しいidを持つメッセージのコピーを返す
        }
    }
    ```
    
    <deflist collapsible="true">
    <def title="パラメータリストにおける可変引数 (vararg) の位置">
        <p><code>query()</code> 関数は3つの引数を取ります。</p>
        <list>
            <li>実行にパラメータを必要とするSQLクエリ文字列</li>
            <li>String型のパラメータである <code>id</code></li>
            <li>ラムダ式で実装される <code>RowMapper</code> インスタンス</li>
        </list>
        <p><code>query()</code> 関数の2番目のパラメータは、可変引数 (<code>vararg</code>) として宣言されています。Kotlinでは、可変引数パラメータの位置はパラメータリストの最後である必要はありません。</p>
    </def>
    <def title="singleOrNull() 関数">
       <p><a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/single-or-null.html"><code>singleOrNull()</code></a> 関数は、配列が空の場合、または同じ値を持つ要素が複数ある場合は <code>null</code> を返し、それ以外の場合は単一の要素を返します。</p>
    </def>
   </deflist>
    
    > `.query()` 関数は、メッセージをIDで取得するために使用され、Spring Frameworkによって提供される[Kotlin拡張関数](extensions.md#extension-functions)です。上記のコードで示されているように、追加のインポート `import org.springframework.jdbc.core.query` が必要です。
    >
    {style="warning"}

2.  `MessageController` クラスに、`id` パラメータを持つ新しい `index(...)` 関数を追加します。

    ```kotlin
    // MessageController.kt
    package com.example.demo

    import org.springframework.http.ResponseEntity
    import org.springframework.web.bind.annotation.GetMapping
    import org.springframework.web.bind.annotation.PathVariable
    import org.springframework.web.bind.annotation.PostMapping
    import org.springframework.web.bind.annotation.RequestBody
    import org.springframework.web.bind.annotation.RequestMapping
    import org.springframework.web.bind.annotation.RestController
    import java.net.URI
    
    @RestController
    @RequestMapping("/")
    class MessageController(private val service: MessageService) {
        @GetMapping
        fun listMessages() = ResponseEntity.ok(service.findMessages())
        
        @PostMapping
        fun post(@RequestBody message: Message): ResponseEntity<Message> {
            val savedMessage = service.save(message)
            return ResponseEntity.created(URI("/${savedMessage.id}")).body(savedMessage)
        }
        
        @GetMapping("/{id}")
        fun getMessage(@PathVariable id: String): ResponseEntity<Message> =
            service.findMessageById(id).toResponseEntity()
        
        private fun Message?.toResponseEntity(): ResponseEntity<Message> =
            // メッセージがnull（見つからない）の場合、レスポンスコードを404に設定する
            this?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build() 
    }
    ```

    <deflist collapsible="true">
    <def title="コンテキストパスからの値の取得">
       <p>メッセージの <code>id</code> は、新しい関数に <code>@GetMapping(&quot;/{id}&quot;)</code> アノテーションを付けることで、Spring Frameworkによってコンテキストパスから取得されます。関数引数に <code>@PathVariable</code> アノテーションを付けることで、取得した値を関数引数として使用するようにフレームワークに指示します。新しい関数は、そのidによって個別のメッセージを取得するために <code>MessageService</code> を呼び出します。</p>
    </def>
    <def title="null許容レシーバーを持つ拡張関数">
         <p>拡張は、null許容レシーバー型で定義できます。レシーバーが <code>null</code> の場合、<code>this</code> も <code>null</code> になります。したがって、null許容レシーバー型で拡張を定義する場合、関数本体内で <code>this == null</code> チェックを実行することをお勧めします。</p>
         <p>また、上記の <code>toResponseEntity()</code> 関数のように、null安全な呼び出し演算子 (<code>?.</code>) を使用してnullチェックを実行することもできます。</p>
         <code-block lang="kotlin">
         this?.let { ResponseEntity.ok(it) }
         </code-block>
    </def>
    <def title="ResponseEntity">
        <p><code>ResponseEntity</code> は、ステータスコード、ヘッダー、ボディを含むHTTPレスポンスを表します。これは、コンテンツをより細かく制御して、カスタマイズされたHTTPレスポンスをクライアントに送信できる汎用ラッパーです。</p>
    </def>
    </deflist>

アプリケーションの完全なコードを以下に示します。

```kotlin
// DemoApplication.kt
package com.example.demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}
```
{initial-collapse-state="collapsed" collapsible="true"}

```kotlin
// Message.kt
package com.example.demo

data class Message(val id: String?, val text: String)
```
{initial-collapse-state="collapsed" collapsible="true"}

```kotlin
// MessageService.kt
package com.example.demo

import org.springframework.stereotype.Service
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.query
import java.util.*

@Service
class MessageService(private val db: JdbcTemplate) {
    fun findMessages(): List<Message> = db.query("select * from messages") { response, _ ->
        Message(response.getString("id"), response.getString("text"))
    }

    fun findMessageById(id: String): Message? = db.query("select * from messages where id = ?", id) { response, _ ->
        Message(response.getString("id"), response.getString("text"))
    }.singleOrNull()

    fun save(message: Message): Message {
        val id = message.id ?: UUID.randomUUID().toString()
        db.update(
            "insert into messages values ( ?, ? )",
            id, message.text
        )
        return message.copy(id = id)
    }
}
```
{initial-collapse-state="collapsed" collapsible="true"}

```kotlin
// MessageController.kt
package com.example.demo

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.net.URI

@RestController
@RequestMapping("/")
class MessageController(private val service: MessageService) {
    @GetMapping
    fun listMessages() = ResponseEntity.ok(service.findMessages())

    @PostMapping
    fun post(@RequestBody message: Message): ResponseEntity<Message> {
        val savedMessage = service.save(message)
        return ResponseEntity.created(URI("/${savedMessage.id}")).body(savedMessage)
    }

    @GetMapping("/{id}")
    fun getMessage(@PathVariable id: String): ResponseEntity<Message> =
        service.findMessageById(id).toResponseEntity()

    private fun Message?.toResponseEntity(): ResponseEntity<Message> =
        this?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()
}
```
{initial-collapse-state="collapsed" collapsible="true"}

## アプリケーションを実行する

Springアプリケーションを実行する準備ができました。

1.  アプリケーションを再度実行します。

2.  `requests.http` ファイルを開き、新しいGETリクエストを追加します。

    ```http request
    ### Get the message by its id
    GET http://localhost:8080/id
    ```

3.  GETリクエストを実行して、データベースからすべてのメッセージを取得します。

4.  **Run**ツールウィンドウでいずれかのIDをコピーし、次のようにリクエストに追加します。

    ```http request
    ### Get the message by its id
    GET http://localhost:8080/f910aa7e-11ee-4215-93ed-1aeeac822707
    ```
    
    > 上記のメッセージIDの代わりに、あなたのメッセージIDを記述してください。
    >
    {style="note"}

5.  GETリクエストを実行し、**Run**ツールウィンドウで結果を確認します。

    ![Retrieve message by its id](retrieve-message-by-its-id.png){width=706}

## 次のステップ

最後のステップでは、Spring Dataを使用してより一般的なデータベース接続を行う方法を示します。

**[次の章に進む](jvm-spring-boot-using-crudrepository.md)**