[//]: # (title: Spring Bootプロジェクトにデータベースサポートを追加する)
[//]: # (description: JDBCテンプレートを使用して、Kotlinで書かれたSpring Bootプロジェクトにデータベースサポートを追加します。)

<tldr>
    <p>これは「**Spring BootとKotlin入門**」チュートリアルの第3部です。進む前に、以前のステップを完了していることを確認してください。</p><br/>
    <p><img src="icon-1-done.svg" width="20" alt="最初のステップ"/> <a href="jvm-create-project-with-spring-boot.md">Spring BootプロジェクトをKotlinで作成する</a><br/><img src="icon-2-done.svg" width="20" alt="2番目のステップ"/> <a href="jvm-spring-boot-add-data-class.md">Spring Bootプロジェクトにデータクラスを追加する</a><br/><img src="icon-3.svg" width="20" alt="3番目のステップ"/> <strong>Spring Bootプロジェクトにデータベースサポートを追加する</strong><br/><img src="icon-4-todo.svg" width="20" alt="4番目のステップ"/> Spring Data CrudRepositoryを使用したデータベースアクセス</p>
</tldr>

このチュートリアルのパートでは、_Java Database Connectivity_ (JDBC) を使用して、プロジェクトにデータベースを追加し、構成します。
JVMアプリケーションでは、JDBCを使用してデータベースと対話します。
利便性のため、Spring FrameworkはJDBCの使用を簡素化し、一般的なエラーを回避するのに役立つ`JdbcTemplate`クラスを提供しています。

## データベースサポートの追加

Spring Frameworkベースのアプリケーションにおける一般的なプラクティスは、いわゆる_サービス_層（ビジネスロジックが存在する場所）内にデータベースアクセスロジックを実装することです。
Springでは、クラスがアプリケーションのサービス層に属することを示すために、`@Service`アノテーションでクラスをマークする必要があります。
このアプリケーションでは、この目的のために`MessageService`クラスを作成します。

同じパッケージ内に、`MessageService.kt`ファイルと`MessageService`クラスを次のように作成します。

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
      <p>Kotlinのクラスにはプライマリコンストラクタがあります。また、1つ以上の<a href="classes.md#secondary-constructors">セカンダリコンストラクタ</a>を持つこともできます。
      <i>プライマリコンストラクタ</i>はクラスヘッダの一部であり、クラス名の後とオプションの型パラメータの後に続きます。この場合、コンストラクタは<code>(val db: JdbcTemplate)</code>です。</p>
      <p><code>val db: JdbcTemplate</code>はコンストラクタの引数です。</p>
      <code-block lang="kotlin">
      @Service
      class MessageService(private val db: JdbcTemplate)
      </code-block>
  </def>
   <def title="末尾ラムダとSAM変換">
      <p><code>findMessages()</code>関数は、<code>JdbcTemplate</code>クラスの<code>query()</code>関数を呼び出します。<code>query()</code>関数は2つの引数を取ります。1つはStringインスタンスとしてのSQLクエリ、もう1つは行ごとに1つのオブジェクトをマップするコールバックです。</p>
      <code-block lang="sql">
      db.query("...", RowMapper { ... } )
      </code-block><br/>
      <p><code>RowMapper</code>インターフェースは1つのメソッドしか宣言していないため、インターフェース名を省略してラムダ式で実装することができます。Kotlinコンパイラは、関数呼び出しのパラメータとして使用されているため、ラムダ式をどのインターフェースに変換する必要があるかを知っています。これは<a href="java-interop.md#sam-conversions">KotlinのSAM変換</a>として知られています。</p>
      <code-block lang="sql">
      db.query("...", { ... } )
      </code-block><br/>
      <p>SAM変換後、query関数は、最初の位置にString、最後の位置にラムダ式の2つの引数で終わります。Kotlinの規約に従って、関数の最後のパラメータが関数の場合、対応する引数として渡されるラムダ式は括弧の外に配置できます。このような構文は<a href="lambdas.md#passing-trailing-lambdas">末尾ラムダ</a>としても知られています。</p>
      <code-block lang="sql">
      db.query("...") { ... }
      </code-block>
   </def>
   <def title="未使用のラムダ引数にアンダースコアを使用">
      <p>複数のパラメータを持つラムダの場合、使用しないパラメータの名前をアンダースコア<code>_</code>文字で置き換えることができます。</p>
      <p>したがって、query関数呼び出しの最終的な構文は次のようになります。</p>
      <code-block lang="kotlin">
      db.query("select * from messages") { response, _ ->
          Message(response.getString("id"), response.getString("text"))
      }
      </code-block>
   </def>
</deflist>

## MessageControllerクラスの更新

新しい`MessageService`クラスを使用するように`MessageController.kt`を更新します。

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
      <p>HTTP POSTリクエストを処理するメソッドには、<code>@PostMapping</code>アノテーションを付加する必要があります。HTTPボディの内容として送信されたJSONをオブジェクトに変換できるようにするには、メソッド引数に<code>@RequestBody</code>アノテーションを使用する必要があります。アプリケーションのクラスパスにJacksonライブラリがあるため、変換は自動的に行われます。</p>
   </def>
   <def title="ResponseEntity">
      <p><code>ResponseEntity</code>は、HTTPレスポンス全体（ステータスコード、ヘッダ、ボディ）を表します。</p>
      <p><code>created()</code>メソッドを使用すると、レスポンスステータスコード（201）を設定し、作成されたリソースのコンテキストパスを示すロケーションヘッダを設定できます。</p>
   </def>
</deflist>

## MessageServiceクラスの更新

`Message`クラスの`id`は、null許容のStringとして宣言されていました。

```kotlin
data class Message(val id: String?, val text: String)
```

しかし、`null`をデータベースに`id`値として格納するのは正しくありません。この状況を適切に処理する必要があります。

メッセージをデータベースに格納する際に、`id`が`null`の場合に新しい値を生成するように`MessageService.kt`ファイルのコードを更新します。

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
        val id = message.id ?: UUID.randomUUID().toString() // Generate new id if it is null
        db.update(
            "insert into messages values ( ?, ? )",
            id, message.text
        )
        return message.copy(id = id) // Return a copy of the message with the new id
    }
}
```

<deflist collapsible="true">
   <def title="エルビス演算子 – ?:">
      <p>コード<code>message.id ?: UUID.randomUUID().toString()</code>は<a href="null-safety.md#elvis-operator">エルビス演算子 (if-not-null-else shorthand) <code>?:</code></a>を使用しています。<code>?:</code>の左側の式が<code>null</code>でない場合、エルビス演算子はそれを返し、そうでない場合は右側の式を返します。右側の式は、左側の式が<code>null</code>の場合にのみ評価されることに注意してください。</p>
   </def>
</deflist>

アプリケーションコードはデータベースと連携する準備ができました。次にデータソースを構成する必要があります。

## データベースの構成

アプリケーションでデータベースを構成します。

1. `src/main/resources`ディレクトリに`schema.sql`ファイルを作成します。これはデータベースオブジェクト定義を保存します。

   ![データベーススキーマの作成](create-database-schema.png){width=400}

2. `src/main/resources/schema.sql`ファイルを次のコードで更新します。

   ```sql
   -- schema.sql
   CREATE TABLE IF NOT EXISTS messages (
   id       VARCHAR(60)  PRIMARY KEY,
   text     VARCHAR      NOT NULL
   );
   ```

   これにより、`id`と`text`の2つのカラムを持つ`messages`テーブルが作成されます。テーブル構造は`Message`クラスの構造と一致します。

3. `src/main/resources`フォルダにある`application.properties`ファイルを開き、以下のアプリケーションプロパティを追加します。

   ```none
   spring.application.name=demo
   spring.datasource.driver-class-name=org.h2.Driver
   spring.datasource.url=jdbc:h2:file:./data/testdb
   spring.datasource.username=name
   spring.datasource.password=password
   spring.sql.init.schema-locations=classpath:schema.sql
   spring.sql.init.mode=always
   ```

   これらの設定により、Spring Bootアプリケーションのデータベースが有効になります。
   一般的なアプリケーションプロパティの完全なリストは、[Springドキュメント](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-application-properties.html)を参照してください。

## HTTPリクエストを介してデータベースにメッセージを追加する

以前に作成したエンドポイントを操作するには、HTTPクライアントを使用する必要があります。IntelliJ IDEAでは、組み込みのHTTPクライアントを使用します。

1. アプリケーションを実行します。アプリケーションが起動して実行されると、POSTリクエストを実行してメッセージをデータベースに格納できます。

2. プロジェクトのルートフォルダに`requests.http`ファイルを作成し、以下のHTTPリクエストを追加します。

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

3. すべてのPOSTリクエストを実行します。リクエスト宣言の隣にあるガターの緑色の**Run**アイコンを使用します。
   これらのリクエストは、テキストメッセージをデータベースに書き込みます。

   ![POSTリクエストの実行](execute-post-requests.png)

4. GETリクエストを実行し、**Run**ツールウィンドウで結果を確認します。

   ![GETリクエストの実行](execute-get-requests.png)

### リクエストを実行する別の方法 {initial-collapse-state="collapsed" collapsible="true"}

他のHTTPクライアントやcURLコマンドラインツールを使用することもできます。たとえば、ターミナルで次のコマンドを実行すると、同じ結果が得られます。

```bash
curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Hello!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Bonjour!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Privet!\" }"

curl -X GET --location "http://localhost:8080"
```

## IDでメッセージを取得する

IDで個別のメッセージを取得するために、アプリケーションの機能を拡張します。

1. `MessageService`クラスに、IDで個別のメッセージを取得するための新しい関数`findMessageById(id: String)`を追加します。

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
            val id = message.id ?: UUID.randomUUID().toString() // Generate new id if it is null
            db.update(
                "insert into messages values ( ?, ? )",
                id, message.text
            )
            return message.copy(id = id) // Return a copy of the message with the new id
        }
    }
    ```
    
    <deflist collapsible="true">
    <def title="パラメータリストにおける可変長引数（vararg）の位置">
        <p><code>query()</code>関数は3つの引数を取ります。</p>
        <list>
            <li>パラメータを必要とするSQLクエリ文字列</li>
            <li>String型のパラメータである<code>id</code></li>
            <li>ラムダ式によって実装された<code>RowMapper</code>インスタンス</li>
        </list>
        <p><code>query()</code>関数の2番目のパラメータは、<i>可変長引数</i>（<code>vararg</code>）として宣言されています。Kotlinでは、可変長引数パラメータの位置は、パラメータリストの最後にある必要はありません。</p>
    </def>
    <def title="singleOrNull() 関数">
       <p><a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/single-or-null.html"><code>singleOrNull()</code></a>関数は、単一の要素を返します。配列が空であるか、または同じ値を持つ要素が複数ある場合は<code>null</code>を返します。</p>
    </def>
   </deflist>
    
    > メッセージをIDで取得するために使用される`.query()`関数は、Spring Frameworkによって提供される[Kotlin拡張関数](extensions.md#extension-functions)です。上記のコードで示されているように、追加のインポート`import org.springframework.jdbc.core.query`が必要です。
    >
    {style="warning"}

2. `MessageController`クラスに、`id`パラメータを持つ新しい`index(...)`関数を追加します。

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
            // If the message is null (not found), set response code to 404
            this?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build() 
    }
    ```

    <deflist collapsible="true">
    <def title="コンテキストパスからの値の取得">
       <p>メッセージの<code>id</code>は、新しい関数に<code>@GetMapping(&quot;/{id}&quot;)</code>アノテーションを付加することで、Spring Frameworkによってコンテキストパスから取得されます。関数引数に<code>@PathVariable</code>アノテーションを付加することで、取得した値を関数引数として使用するようにフレームワークに指示します。この新しい関数は、個別のメッセージをIDで取得するために<code>MessageService</code>を呼び出します。</p>
    </def>
    <def title="null許容レシーバーを持つ拡張関数">
         <p>拡張関数は、null許容レシーバー型で定義できます。レシーバーが<code>null</code>の場合、<code>this</code>も<code>null</code>になります。したがって、null許容レシーバー型を持つ拡張関数を定義する際には、関数本体内で<code>this == null</code>チェックを実行することをお勧めします。</p>
         <p>上記の<code>toResponseEntity()</code>関数のように、null安全呼び出し演算子（<code>?.</code>）を使用してnullチェックを実行することもできます。</p>
         <code-block lang="kotlin">
         this?.let { ResponseEntity.ok(it) }
         </code-block>
    </def>
    <def title="ResponseEntity">
        <p><code>ResponseEntity</code>は、ステータスコード、ヘッダ、ボディを含むHTTPレスポンスを表します。これは、より詳細なコンテンツの制御を可能にする汎用ラッパーであり、クライアントにカスタマイズされたHTTPレスポンスを送信できます。</p>
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

## アプリケーションの実行

Springアプリケーションを実行する準備ができました。

1. アプリケーションを再度実行します。

2. `requests.http`ファイルを開き、新しいGETリクエストを追加します。

    ```http request
    ### Get the message by its id
    GET http://localhost:8080/id
    ```

3. GETリクエストを実行して、データベースからすべてのメッセージを取得します。

4. **Run**ツールウィンドウでいずれかのIDをコピーし、次のようにリクエストに追加します。

    ```http request
    ### Get the message by its id
    GET http://localhost:8080/f910aa7e-11ee-4215-93ed-1aeeac822707
    ```
    
    > 上記のメッセージIDの代わりに、ご自身のメッセージIDを入力してください。
    >
    {style="note"}

5. GETリクエストを実行し、**Run**ツールウィンドウで結果を確認します。

    ![IDでメッセージを取得](retrieve-message-by-its-id.png){width=706}

## 次のステップ

最後のステップでは、Spring Dataを使用して、より一般的なデータベース接続方法を紹介します。

**[次の章に進む](jvm-spring-boot-using-crudrepository.md)**