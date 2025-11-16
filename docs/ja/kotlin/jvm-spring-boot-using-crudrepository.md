[//]: # (title: データベースアクセスにSpring Data CrudRepositoryを使用する)

<web-summary>Kotlinで書かれたSpring BootプロジェクトでSpring Dataインターフェースを扱います。</web-summary>

<tldr>
    <p>これは、<strong>Spring BootとKotlin入門</strong>チュートリアルの最終パートです。先に進む前に、前のステップが完了していることを確認してください。</p><br/>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot.md">KotlinでSpring Bootプロジェクトを作成する</a><br/><img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="jvm-spring-boot-add-data-class.md">Spring Bootプロジェクトにデータクラスを追加する</a><br/><img src="icon-3-done.svg" width="20" alt="Third step"/> <a href="jvm-spring-boot-add-db-support.md">Spring Bootプロジェクトにデータベースサポートを追加する</a><br/><img src="icon-4.svg" width="20" alt="Fourth step"/> <strong>データベースアクセスにSpring Data CrudRepositoryを使用する</strong></p>
</tldr>

このパートでは、データベースアクセスに`JdbcTemplate`の代わりに[Spring Data](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/CrudRepository.html)の`CrudRepository`を使用するようにサービス層を移行します。
_CrudRepository_は、特定の型のリポジトリに対する汎用的な[CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)操作のためのSpring Dataインターフェースです。
データベースとのやり取りに必要なメソッドがいくつか最初から提供されています。

## アプリケーションを更新する

まず、`CrudRepository` APIを扱うために`Message`クラスを調整する必要があります。

1.  データベーステーブルへのマッピングを宣言するために、`Message`クラスに`@Table`アノテーションを追加します。
    `id`フィールドの前に`@Id`アノテーションを追加します。

    > これらのアノテーションには追加のインポートも必要です。
    >
    {style="note"}

    ```kotlin
    // Message.kt
    package com.example.demo
   
    import org.springframework.data.annotation.Id
    import org.springframework.data.relational.core.mapping.Table
    
    @Table("MESSAGES")
    data class Message(@Id val id: String?, val text: String)
    ```

    さらに、`Message`クラスの使用をよりKotlinらしい書き方にするために、
    `id`プロパティのデフォルト値をnullに設定し、データクラスのプロパティの順序を入れ替えることができます。

    ```kotlin
    @Table("MESSAGES")
    data class Message(val text: String, @Id val id: String? = null)
    ```
 
    これで、`Message`クラスの新しいインスタンスを作成する必要がある場合、`text`プロパティのみをパラメータとして指定できます。

    ```kotlin
    val message = Message("Hello") // id is null
    ```

2.  `Message`データクラスを操作する`CrudRepository`のインターフェースを宣言します。`MessageRepository.kt`ファイルを作成し、以下のコードを追加します。

    ```kotlin
    // MessageRepository.kt
    package com.example.demo
   
    import org.springframework.data.repository.CrudRepository
    
    interface MessageRepository : CrudRepository<Message, String>
    ```

3.  `MessageService`クラスを更新します。これにより、SQLクエリを実行する代わりに`MessageRepository`を使用するようになります。

    ```kotlin
    // MessageService.kt
    package com.example.demo

    import org.springframework.data.repository.findByIdOrNull
    import org.springframework.stereotype.Service
    
    @Service
    class MessageService(private val db: MessageRepository) {
        fun findMessages(): List<Message> = db.findAll().toList()
    
        fun findMessageById(id: String): Message? = db.findByIdOrNull(id)
    
        fun save(message: Message): Message = db.save(message)
    }
    ```

    <deflist collapsible="true">
       <def title="拡張関数">
          <p><code>findByIdOrNull()</code>関数は、Spring Data JDBCにおける<code>CrudRepository</code>インターフェースの<a href="extensions.md#extension-functions">拡張関数</a>です。</p>
       </def>
       <def title="CrudRepository save()関数">
          <p><a href="https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#jdbc.entity-persistence">この関数は</a>、新しいオブジェクトがデータベースにIDを持たないという前提で動作します。したがって、挿入の場合、IDは<b>nullであるべき</b>です。</p>
          <p>IDが<i>null</i>でない場合、<code>CrudRepository</code>はオブジェクトがすでにデータベースに存在し、これは<i>挿入</i>操作ではなく<i>更新</i>操作であると仮定します。挿入操作後、<code>id</code>はデータストアによって生成され、<code>Message</code>インスタンスに割り当てられます。これが、<code>id</code>プロパティが<code>var</code>キーワードを使用して宣言されるべき理由です。</p>
          <p></p>
       </def>
    </deflist>

4.  挿入されたオブジェクトのIDを生成するようにメッセージテーブルの定義を更新します。`id`は文字列であるため、デフォルトでID値を生成するために`RANDOM_UUID()`関数を使用できます。

    ```sql
    -- schema.sql 
    CREATE TABLE IF NOT EXISTS messages (
        id      VARCHAR(60)  DEFAULT RANDOM_UUID() PRIMARY KEY,
        text    VARCHAR      NOT NULL
    );
    ```

5.  `src/main/resources`フォルダにある`application.properties`ファイルのデータベース名を更新します。

   ```none
   spring.application.name=demo
   spring.datasource.driver-class-name=org.h2.Driver
   spring.datasource.url=jdbc:h2:file:./data/testdb2
   spring.datasource.username=name
   spring.datasource.password=password
   spring.sql.init.schema-locations=classpath:schema.sql
   spring.sql.init.mode=always
   ```

以下に、アプリケーションの完全なコードを示します。

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

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table("MESSAGES")
data class Message(val text: String, @Id val id: String? = null)
```
{initial-collapse-state="collapsed" collapsible="true"}

```kotlin
// MessageRepository.kt
package com.example.demo

import org.springframework.data.repository.CrudRepository

interface MessageRepository : CrudRepository<Message, String>
```
{initial-collapse-state="collapsed" collapsible="true"}

```kotlin
// MessageService.kt
package com.example.demo

import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class MessageService(private val db: MessageRepository) {
    fun findMessages(): List<Message> = db.findAll().toList()

    fun findMessageById(id: String): Message? = db.findByIdOrNull(id)

    fun save(message: Message): Message = db.save(message)
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
        // If the message is null (not found), set response code to 404
        this?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()
}
```
{initial-collapse-state="collapsed" collapsible="true"}

## アプリケーションを実行する

おめでとうございます！アプリケーションを再度実行する準備ができました。
`JdbcTemplate`を`CrudRepository`に置き換えても、機能は同じままで、アプリケーションは以前と同じように動作します。

これで、`requests.http`ファイルから[POSTおよびGET HTTPリクエストを実行](jvm-spring-boot-add-db-support.md#add-messages-to-database-via-http-request)して、同じ結果を得ることができます。

## 次のステップ

Kotlinの機能を知り、学習の進捗を追跡するのに役立つパーソナル言語マップを入手しましょう。

<a href="https://resources.jetbrains.com/storage/products/kotlin/docs/Kotlin_Language_Features_Map.pdf">
   <img src="get-kotlin-language-map.png" width="700" alt="Kotlin言語マップを入手" style="block"/>
</a>

*   [Spring Framework](https://docs.spring.io/spring-framework/docs/current/reference/html/languages.html#languages)のドキュメントを確認します。
*   [Spring BootとKotlinでWebアプリケーションを構築する](https://spring.io/guides/tutorials/spring-boot-kotlin)チュートリアルを完了します。
*   [Spring BootとKotlinコルーチンおよびRSocketでチャットアプリケーションを作成する](https://spring.io/guides/tutorials/spring-webflux-kotlin-rsocket/)チュートリアルでチャットアプリケーションを作成します。