[//]: # (title: Spring Data CrudRepository を使用したデータベースアクセス)
[//]: # (description: Kotlinで書かれたSpring BootプロジェクトでSpring Dataインターフェースを使用する方法。)

<tldr>
    <p>これは、<strong>Spring BootとKotlinの始め方</strong>チュートリアルの最終パートです。先に進む前に、以前のステップを完了していることを確認してください。</p><br/>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot.md">KotlinでSpring Bootプロジェクトを作成する</a><br/><img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="jvm-spring-boot-add-data-class.md">Spring Bootプロジェクトにデータクラスを追加する</a><br/><img src="icon-3-done.svg" width="20" alt="Third step"/> <a href="jvm-spring-boot-add-db-support.md">Spring Bootプロジェクトにデータベースサポートを追加する</a><br/><img src="icon-4.svg" width="20" alt="Fourth step"/> <strong>Spring Data CrudRepository を使用したデータベースアクセス</strong></p>
</tldr>

このパートでは、データベースアクセスのために `JdbcTemplate` の代わりに [Spring Data](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/CrudRepository.html) の `CrudRepository` を使用するようにサービス層を移行します。
_CrudRepository_ は、特定のタイプのリポジトリに対する汎用的な [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) 操作のためのSpring Dataインターフェースです。
データベースとやり取りするためのいくつかのメソッドが標準で提供されています。

## アプリケーションを更新する

まず、`CrudRepository` API で動作するように `Message` クラスを調整する必要があります。

1.  `Message` クラスに `@Table` アノテーションを追加して、データベーステーブルへのマッピングを宣言します。
    `id` フィールドの前に `@Id` アノテーションを追加します。

    > これらのアノテーションには、追加のインポートも必要です。
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

    さらに、`Message` クラスの使用をよりKotlinらしい書き方にするために、
    `id` プロパティのデフォルト値を `null` に設定し、データクラスプロパティの順序を入れ替えることができます。

    ```kotlin
    @Table("MESSAGES")
    data class Message(val text: String, @Id val id: String? = null)
    ```

    これで、`Message` クラスの新しいインスタンスを作成する必要がある場合、`text` プロパティのみをパラメータとして指定できます。

    ```kotlin
    val message = Message("Hello") // id is null
    ```

2.  `Message` データクラスで動作する `CrudRepository` のインターフェースを宣言します。`MessageRepository.kt` ファイルを作成し、以下のコードを追加します。

    ```kotlin
    // MessageRepository.kt
    package com.example.demo
   
    import org.springframework.data.repository.CrudRepository
    
    interface MessageRepository : CrudRepository<Message, String>
    ```

3.  `MessageService` クラスを更新します。このクラスは、SQLクエリを実行する代わりに `MessageRepository` を使用するようになります。

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
          <p><code>findByIdOrNull()</code> 関数は、Spring Data JDBC の <code>CrudRepository</code> インターフェースに対する<a href="extensions.md#extension-functions">拡張関数</a>です。</p>
       </def>
       <def title="CrudRepository の save() 関数">
          <p><a href="https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#jdbc.entity-persistence">この関数は</a>、新しいオブジェクトがデータベースにIDを持たないという前提で動作します。したがって、挿入時にはIDが<b>nullであるべきです</b>。</p>
          <p> IDが<i>null</i>でない場合、<code>CrudRepository</code> はそのオブジェクトがすでにデータベースに存在するとみなし、これは挿入操作とは対照的に<i>更新</i>操作であると判断します。挿入操作後、<code>id</code> はデータストアによって生成され、<code>Message</code> インスタンスに割り当て直されます。このため、<code>id</code> プロパティは <code>var</code> キーワードを使用して宣言されるべきです。</p>
          <p></p>
       </def>
    </deflist>

4.  挿入されたオブジェクトのIDを生成するようにメッセージテーブルの定義を更新します。`id` は文字列なので、`RANDOM_UUID()` 関数を使用してデフォルトでID値を生成できます。

    ```sql
    -- schema.sql 
    CREATE TABLE IF NOT EXISTS messages (
        id      VARCHAR(60)  DEFAULT RANDOM_UUID() PRIMARY KEY,
        text    VARCHAR      NOT NULL
    );
    ```

5.  `src/main/resources` フォルダにある `application.properties` ファイル内のデータベース名を更新します。

   ```none
   spring.application.name=demo
   spring.datasource.driver-class-name=org.h2.Driver
   spring.datasource.url=jdbc:h2:file:./data/testdb2
   spring.datasource.username=name
   spring.datasource.password=password
   spring.sql.init.schema-locations=classpath:schema.sql
   spring.sql.init.mode=always
   ```

アプリケーションの完全なコードは次のとおりです。

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

おめでとうございます！アプリケーションは再び実行準備が整いました。
`JdbcTemplate` を `CrudRepository` に置き換えた後も、機能は同じままであるため、アプリケーションは以前とまったく同じように動作します。

これで、`requests.http` ファイルから [POSTおよびGET HTTPリクエストを実行](jvm-spring-boot-add-db-support.md#add-messages-to-database-via-http-request)して、同じ結果を得ることができます。

## 次のステップ

Kotlinの機能を探求し、学習の進捗を追跡するのに役立つパーソナル言語マップを入手しましょう。

<a href="https://resources.jetbrains.com/storage/products/kotlin/docs/Kotlin_Language_Features_Map.pdf">
   <img src="get-kotlin-language-map.png" width="700" alt="Get the Kotlin language map" style="block"/>
</a>

*   [KotlinコードからJavaを呼び出す](java-interop.md)方法と[JavaコードからKotlinを呼び出す](java-to-kotlin-interop.md)方法について詳しく学ぶ。
*   [Java-to-Kotlinコンバーター](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k)を使用して、既存のJavaコードをKotlinに変換する方法を学ぶ。
*   JavaからKotlinへの移行ガイドを確認する:
    *   [JavaとKotlinの文字列](java-to-kotlin-idioms-strings.md)。
    *   [JavaとKotlinのコレクション](java-to-kotlin-collections-guide.md)。
    *   [JavaとKotlinのNull許容性](java-to-kotlin-nullability-guide.md)。