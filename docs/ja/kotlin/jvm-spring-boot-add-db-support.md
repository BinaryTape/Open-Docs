---
title: "Spring Bootプロジェクトへのデータベースサポートの追加"
description: "JDBCテンプレートを使用してKotlinで記述されたSprint Bootプロジェクトにデータベースサポートを追加します。"
---
:::info
<p>
   これは、<strong>Spring BootとKotlin入門</strong>チュートリアルの第3部です。先に進む前に、以下の前の手順を完了していることを確認してください。
</p><br/>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot">KotlinでSpring Bootプロジェクトを作成する</a><br/><img src="/img/icon-2-done.svg" width="20" alt="Second step"/> <a href="jvm-spring-boot-add-data-class">Spring Bootプロジェクトにデータクラスを追加する</a><br/><img src="/img/icon-3.svg" width="20" alt="Third step"/> <strong>Spring Bootプロジェクトにデータベースサポートを追加する</strong><br/><img src="/img/icon-4-todo.svg" width="20" alt="Fourth step"/> データベースアクセスにSpring Data CrudRepositoryを使用する
</p>

:::

このチュートリアルでは、JDBCを使用してデータベースをプロジェクトに追加し、構成します。JVMアプリケーションでは、JDBCを使用してデータベースとやり取りします。
便宜上、Spring FrameworkはJDBCの使用を簡素化し、一般的なエラーを回避するのに役立つ`JdbcTemplate`クラスを提供します。

## データベースサポートを追加する

Spring Frameworkベースのアプリケーションにおける一般的なプラクティスは、いわゆる _service_ レイヤー内でデータベースアクセスロジックを実装することです。これはビジネスロジックが存在する場所です。
Springでは、クラスがアプリケーションのサービスレイヤーに属することを示すために、`@Service`アノテーションでクラスをマークする必要があります。
このアプリケーションでは、この目的のために`MessageService`クラスを作成します。

同じパッケージ内に、`MessageService.kt`ファイルを作成し、次のように`MessageService`クラスを作成します。

```kotlin
// MessageService.kt
package demo

import org.springframework.stereotype.Service
import org.springframework.jdbc.core.JdbcTemplate
import java.util.*

@Service
class MessageService(private val db: JdbcTemplate) {
    fun findMessages(): List<Message> = db.query("select * from messages") { response, _ `->`
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
<h3>コンストラクタ引数と依存性注入 – (private val db: JdbcTemplate)</h3>
<p>
   Kotlinのクラスには、プライマリコンストラクタがあります。また、1つ以上の<a href="classes#secondary-constructors">セカンダリコンストラクタ</a>を持つこともできます。
      <i>プライマリコンストラクタ</i>はクラスヘッダーの一部であり、クラス名とオプションの型パラメータの後に記述します。この場合、コンストラクタは`(val db: JdbcTemplate)`です。
</p>
<p>
   `val db: JdbcTemplate`はコンストラクタの引数です。
</p>
      ```kotlin
@Service
      class MessageService(private val db: JdbcTemplate)
```
<h3>末尾のラムダとSAM変換</h3>
<p>
   `findMessages()`関数は、`JdbcTemplate`クラスの`query()`関数を呼び出します。`query()`関数は、StringインスタンスとしてのSQLクエリと、行ごとに1つのオブジェクトをマップするコールバックという2つの引数を取ります。
</p>
      ```sql
db.query("...", RowMapper { ... } )
```<br/>
<p>
   `RowMapper`インターフェースは1つのメソッドのみを宣言するため、インターフェース名を省略してラムダ式で実装できます。Kotlinコンパイラは、関数呼び出しのパラメータとして使用するため、ラムダ式が変換される必要のあるインターフェースを認識します。これは<a href="java-interop#sam-conversions">KotlinのSAM変換</a>として知られています。
</p>
      ```sql
db.query("...", { ... } )
```<br/>
<p>
   SAM変換後、query関数は、最初の位置にString、最後の位置にラムダ式という2つの引数で終わります。Kotlinの規則に従い、関数の最後のパラメータが関数の場合、対応する引数として渡されるラムダ式は、括弧の外に配置できます。このような構文は、<a href="lambdas#passing-trailing-lambdas">末尾のラムダ</a>とも呼ばれます。
</p>
      ```sql
db.query("...") { ... }
```
<h3>未使用のラムダ引数に対するアンダースコア</h3>
<p>
   複数のパラメータを持つラムダの場合、アンダースコア`_`文字を使用して、使用しないパラメータの名前を置き換えることができます。
</p>
<p>
   したがって、query関数呼び出しの最終的な構文は次のようになります。
</p>
      ```kotlin
db.query("select * from messages") { response, _ `->`
          Message(response.getString("id"), response.getString("text"))
      }
```
   

## MessageControllerクラスを更新する

新しい`MessageService`クラスを使用するように`MessageController.kt`を更新します。

```kotlin
// MessageController.kt
package demo

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
<h3>@PostMappingアノテーション</h3>
<p>
   HTTP POSTリクエストの処理を担当するメソッドには、`@PostMapping`アノテーションを付ける必要があります。HTTP Bodyコンテンツとして送信されたJSONをオブジェクトに変換できるようにするには、メソッド引数に`@RequestBody`アノテーションを使用する必要があります。アプリケーションのクラスパスにJacksonライブラリがあるため、変換は自動的に行われます。
</p>
<h3>ResponseEntity</h3>
<p>
   `ResponseEntity`は、ステータスコード、ヘッダー、およびボディを含むHTTPレスポンス全体を表します。
</p>
<p>
   `created()`メソッドを使用すると、レスポンスステータスコード（201）を設定し、作成されたリソースのコンテキストパスを示すlocationヘッダーを設定できます。
</p>
   

## MessageServiceクラスを更新する

`Message`クラスの`id`は、nullable Stringとして宣言されました。

```kotlin
data class Message(val id: String?, val text: String)
```

ただし、`null`を`id`値としてデータベースに格納するのは正しくありません。この状況を適切に処理する必要があります。

データベースにメッセージを格納する際に、`id`が`null`の場合に新しい値を生成するように、`MessageService.kt`ファイルのコードを更新します。

```kotlin
// MessageService.kt
package demo

import org.springframework.stereotype.Service
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.query
import java.util.UUID

@Service
class MessageService(private val db: JdbcTemplate) {
    fun findMessages(): List<Message> = db.query("select * from messages") { response, _ `->`
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
<h3>Elvis演算子 – ?:</h3>
<p>
   コード`message.id ?: UUID.randomUUID().toString()`は、<a href="null-safety#elvis-operator">Elvis演算子（if-not-null-elseの省略形）`?:`</a>を使用しています。`?:`の左側の式が`null`でない場合、Elvis演算子はそれを返します。それ以外の場合は、右側の式を返します。右側の式は、左側が`null`の場合にのみ評価されることに注意してください。
</p>
   

アプリケーションコードは、データベースを操作する準備ができました。次に、データソースを構成する必要があります。

## データベースを構成する

アプリケーションでデータベースを構成します。

1. `src/main/resources`ディレクトリに`schema.sql`ファイルを作成します。これにより、データベースオブジェクトの定義が格納されます。

   <img src="/img/create-database-schema.png" alt="Create database schema" width="400" style={{verticalAlign: 'middle'}}/>

2. 次のコードを使用して`src/main/resources/schema.sql`ファイルを更新します。

   ```sql
   -- schema.sql
   CREATE TABLE IF NOT EXISTS messages (
   id       VARCHAR(60)  PRIMARY KEY,
   text     VARCHAR      NOT NULL
   );
   ```

   これにより、`id`と`text`の2つの列を持つ`messages`テーブルが作成されます。テーブル構造は`Message`クラスの構造と一致します。

3. `src/main/resources`フォルダーにある`application.properties`ファイルを開き、次のアプリケーションプロパティを追加します。

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

## HTTPリクエストを介してメッセージをデータベースに追加する

以前に作成したエンドポイントを操作するには、HTTPクライアントを使用する必要があります。IntelliJ IDEAでは、埋め込みHTTPクライアントを使用します。

1. アプリケーションを実行します。アプリケーションが起動して実行されたら、POSTリクエストを実行してデータベースにメッセージを格納できます。

2. プロジェクトのルートフォルダーに`requests.http`ファイルを作成し、次のHTTPリクエストを追加します。

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

3. すべてのPOSTリクエストを実行します。リクエスト宣言の横にあるガターの緑色の**Run**アイコンを使用します。
   これらのリクエストは、テキストメッセージをデータベースに書き込みます。

   <img src="/img/execute-post-requests.png" alt="Execute POST request" style={{verticalAlign: 'middle'}}/>

4. GETリクエストを実行し、**Run**ツールウィンドウで結果を確認します。

   <img src="/img/execute-get-requests.png" alt="Execute GET requests" style={{verticalAlign: 'middle'}}/>

### リクエストを実行する別の方法

他のHTTPクライアントまたはcURLコマンドラインツールを使用することもできます。たとえば、ターミナルで次のコマンドを実行して、同じ結果を得ることができます。

```bash
curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Hello!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Bonjour!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Privet!\" }"

curl -X GET --location "http://localhost:8080"
```

## IDでメッセージを取得する

IDで個々のメッセージを取得するために、アプリケーションの機能を拡張します。

1. `MessageService`クラスで、IDで個々のメッセージを取得するための新しい関数`findMessageById(id: String)`を追加します。

    ```kotlin
    // MessageService.kt
    package demo

    import org.springframework.stereotype.Service
    import org.springframework.jdbc.core.JdbcTemplate
    import org.springframework.jdbc.core.query
    import java.util.*
    
    @Service
    class MessageService(private val db: JdbcTemplate) {
    
        fun findMessages(): List<Message> = db.query("select * from messages") { response, _ `->`
            Message(response.getString("id"), response.getString("text"))
        }
    
        fun findMessageById(id: String): Message? = db.query("select * from messages where id = ?", id) { response, _ `->`
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
   
    > IDでメッセージをフェッチするために使用される`.query()`関数は、Spring Frameworkによって提供される[Kotlin拡張関数](extensions#extension-functions)です。
    > 上記のコードで示されているように、追加のインポート`import org.springframework.jdbc.core.query`が必要です。
    >
    

2. `MessageController`クラスに、`id`パラメータを持つ新しい`index(...)`関数を追加します。

    ```kotlin
    // MessageController.kt
    package demo

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
<h3>コンテキストパスからの値の取得</h3>
<p>
   新しい関数を`@GetMapping(&quot;/{id}&quot;)`でアノテーションを付けたため、メッセージ`id`はSpring Frameworkによってコンテキストパスから取得されます。関数引数に`@PathVariable`でアノテーションを付けることにより、取得した値を関数引数として使用するようにフレームワークに指示します。新しい関数は`MessageService`を呼び出して、IDで個々のメッセージを取得します。
</p>
<h3>パラメータリスト内のvararg引数の位置</h3>
<p>
   `query()`関数は、次の3つの引数を受け取ります。
</p>
<list>
<li>実行するためにパラメータが必要なSQLクエリ文字列</li>
<li>String型のパラメータである`id`</li>
<li>ラムダ式によって実装される`RowMapper`インスタンス</li>
</list>
<p>
   `query()`関数の2番目のパラメータは、<i>可変引数</i>（`vararg`）として宣言されています。Kotlinでは、可変引数パラメータの位置は、パラメータリストの最後である必要はありません。
</p>
<h3>nullableレシーバーを持つ拡張関数</h3>
<p>
   拡張機能は、nullableレシーバー型で定義できます。レシーバーが`null`の場合、`this`も`null`です。したがって、nullableレシーバー型で拡張機能を定義する場合は、関数本体内で`this == null`チェックを実行することをお勧めします。
</p>
<p>
   上記の`toResponseBody`関数のように、nullセーフ呼び出し演算子（`?.`）を使用してnullチェックを実行することもできます。
</p>
         ```kotlin
this?.let { ResponseEntity.ok(it) }
```
<h3>ResponseEntity</h3>
<p>
   `ResponseEntity`は、ステータスコード、ヘッダー、および本文を含むHTTPレスポンスを表します。これは、コンテンツをより細かく制御して、カスタマイズされたHTTPレスポンスをクライアントに送信できるようにする汎用ラッパーです。
</p>
    
    

アプリケーションの完全なコードを次に示します。

```kotlin
// DemoApplication.kt
package demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
   runApplication<DemoApplication>(*args)
}
```

```kotlin
// Message.kt
package demo

data class Message(val id: String?, val text: String)
```

```kotlin
// MessageService.kt
package demo

import org.springframework.stereotype.Service
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.query
import java.util.*

@Service
class MessageService(private val db: JdbcTemplate) {
    fun findMessages(): List<Message> = db.query("select * from messages") { response, _ `->`
        Message(response.getString("id"), response.getString("text"))
    }

    fun findMessageById(id: String): Message? = db.query("select * from messages where id = ?", id) { response, _ `->`
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

```kotlin
// MessageController.kt
package demo

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

## アプリケーションを実行する

Springアプリケーションを実行する準備ができました。

1. アプリケーションを再度実行します。

2. `requests.http`ファイルを開き、新しいGETリクエストを追加します。

    ```http request
    ### Get the message by its id
    GET http://localhost:8080/id
    ```

3. GETリクエストを実行して、データベースからすべてのメッセージを取得します。

4. **Run**ツールウィンドウで、IDの1つをコピーして、次のようにリクエストに追加します。

    ```http request
    ### Get the message by its id
    GET http://localhost:8080/f16c1d2e-08dc-455c-abfe-68440229b84f
    ```
    
    > 上記のIDの代わりに、メッセージIDを入力してください。
    >
    

5. GETリクエストを実行し、**Run**ツールウィンドウで結果を確認します。

    <img src="/img/retrieve-message-by-its-id.png" alt="Retrieve message by its id" width="706" style={{verticalAlign: 'middle'}}/>

## 次のステップ

最後のステップでは、Spring Dataを使用して、より一般的なデータベースへの接続を使用する方法を示します。

**[次の章に進む](jvm-spring-boot-using-crudrepository)**