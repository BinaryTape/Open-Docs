---
title: "Spring Data CrudRepository を使用したデータベースアクセス"
description: "Kotlin で記述された Spring Boot プロジェクトで Spring Data インターフェースを操作します。"
---
:::info
<p>
   これは、<strong>Spring BootとKotlinを始める</strong>チュートリアルの最終パートです。先に進む前に、以下の手順を完了していることを確認してください。
</p><br/>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot">KotlinでSpring Bootプロジェクトを作成する</a><br/><img src="/img/icon-2-done.svg" width="20" alt="Second step"/> <a href="jvm-spring-boot-add-data-class">Spring Bootプロジェクトにデータクラスを追加する</a><br/><img src="/img/icon-3-done.svg" width="20" alt="Third step"/> <a href="jvm-spring-boot-add-db-support">Spring Bootプロジェクトにデータベースサポートを追加する</a><br/><img src="/img/icon-4.svg" width="20" alt="Fourth step"/> <strong>データベースアクセスにSpring Data `CrudRepository`を使用する</strong>
</p>

:::

このパートでは、サービス層を移行して、データベースアクセスに`JdbcTemplate`の代わりに[Spring Data](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/CrudRepository.html)の`CrudRepository`を使用します。
`CrudRepository`は、特定の型のrepositoryに対する汎用的な[CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete)操作のためのSpring Dataインターフェースです。
これは、データベースとやり取りするためのいくつかのメソッドをすぐに利用できます。

## アプリケーションを更新する

まず、`CrudRepository` APIで動作するように`Message`クラスを調整する必要があります。

1. `@Table`アノテーションを`Message`クラスに追加して、データベーステーブルへのマッピングを宣言します。
   `id`フィールドの前に`@Id`アノテーションを追加します。

    > これらのアノテーションには、追加のimportも必要です。
    >  
    

    ```kotlin
    // Message.kt
    package demo
   
    import org.springframework.data.annotation.Id
    import org.springframework.data.relational.core.mapping.Table
    
    @Table("MESSAGES")
    data class Message(@Id val id: String?, val text: String)
    ```

    さらに、`Message`クラスの使用をより慣用的にするために、
    `id`プロパティのデフォルト値をnullに設定し、データクラスのプロパティの順序を逆にすることができます。

    ```kotlin
    @Table("MESSAGES")
    data class Message(val text: String, @Id val id: String? = null)
    ```
 
    これで、`Message`クラスの新しいインスタンスを作成する必要がある場合、`text`プロパティのみをパラメータとして指定できます。

    ```kotlin
    val message = Message("Hello") // id is null
    ```

2. `Message`データクラスで動作する`CrudRepository`のインターフェースを宣言します。`MessageRepository.kt`
   ファイルを作成し、次のコードを追加します。

    ```kotlin
    // MessageRepository.kt
    package demo
   
    import org.springframework.data.repository.CrudRepository
    
    interface MessageRepository : CrudRepository<Message, String>
    ```

3. `MessageService`クラスを更新します。SQLクエリの実行の代わりに、`MessageRepository`を使用するようになります。

    ```kotlin
    // MessageService.kt
    package demo

    import org.springframework.data.repository.findByIdOrNull
    import org.springframework.stereotype.Service
    
    @Service
    class MessageService(private val db: MessageRepository) {
        fun findMessages(): List<Message> = db.findAll().toList()
    
        fun findMessageById(id: String): Message? = db.findByIdOrNull(id)
    
        fun save(message: Message): Message = db.save(message)
    }
    ```
<h3>拡張関数(Extension functions)</h3>
<p>
   `findByIdOrNull()`関数は、Spring Data JDBCの`CrudRepository`インターフェースの<a href="extensions#extension-functions">拡張関数(extension function)</a>です。
</p>
<h3>CrudRepository save() 関数</h3>
<p>
   <a href="https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#jdbc.entity-persistence">この関数は、</a>新しいオブジェクトがデータベースにidを持っていないという前提で動作します。したがって、挿入の場合、idは<b>nullである必要があります</b>。
</p>
<p>
   idが<i>null</i>でない場合、`CrudRepository`は、オブジェクトがすでにデータベースに存在し、これは<i>挿入(insert)</i>操作ではなく<i>更新(update)</i>操作であると想定します。挿入操作後、`id`はデータストアによって生成され、`Message`インスタンスに割り当てられます。これが、`id`プロパティを`var`キーワードを使用して宣言する必要がある理由です。
</p>
<p>
</p>
       
    

4. 挿入されたオブジェクトのidを生成するようにメッセージテーブルの定義を更新します。`id`は文字列なので、`RANDOM_UUID()`関数を使用して、デフォルトでid値を生成できます。

    ```sql
    -- schema.sql 
    CREATE TABLE IF NOT EXISTS messages (
        id      VARCHAR(60)  DEFAULT RANDOM_UUID() PRIMARY KEY,
        text    VARCHAR      NOT NULL
    );
    ```

5. `src/main/resources`フォルダにある`application.properties`ファイルのデータベースの名前を更新します。

   ```none
   spring.application.name=demo
   spring.datasource.driver-class-name=org.h2.Driver
   spring.datasource.url=jdbc:h2:file:./data/testdb2
   spring.datasource.username=name
   spring.datasource.password=password
   spring.sql.init.schema-locations=classpath:schema.sql
   spring.sql.init.mode=always
   ```

アプリケーションの完全なコードを以下に示します。

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

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table("MESSAGES")
data class Message(val text: String, @Id val id: String? = null)
```

```kotlin
// MessageRepository.kt
package demo

import org.springframework.data.repository.CrudRepository

interface MessageRepository : CrudRepository<Message, String>
```

```kotlin
// MessageService.kt
package demo

import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class MessageService(private val db: MessageRepository) {
    fun findMessages(): List<Message> = db.findAll().toList()

    fun findMessageById(id: String): Message? = db.findByIdOrNull(id)

    fun save(message: Message): Message = db.save(message)
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
        // If the message is null (not found), set response code to 404
        this?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()
}
```

## アプリケーションを実行する

アプリケーションを再度実行する準備ができました。
`JdbcTemplate`を`CrudRepository`に置き換えても機能は変わらないため、アプリケーションは以前と同じように動作するはずです。

## 次のステップ

Kotlinの機能をナビゲートし、言語の学習の進捗状況を追跡するのに役立つ、パーソナル言語マップを入手してください。

<a href="https://resources.jetbrains.com/storage/products/kotlin/docs/Kotlin_Language_Features_Map.pdf">
   <img src="/img/get-kotlin-language-map.png" width="700" alt="Get the Kotlin language map" />
</a>

* [KotlinコードからJavaを呼び出す](java-interop)方法、および[JavaコードからKotlinを呼び出す](java-to-kotlin-interop)方法について学びます。
* [Java-to-Kotlin converter](mixing-java-kotlin-intellij#converting-an-existing-java-file-to-kotlin-with-j2k)を使用して、既存のJavaコードをKotlinに変換する方法を学びます。
* JavaからKotlinへの移行ガイドを確認してください。
  * [JavaとKotlinの文字列](java-to-kotlin-idioms-strings)。
  * [JavaとKotlinのコレクション](java-to-kotlin-collections-guide)。
  * [JavaとKotlinのNull許容性](java-to-kotlin-nullability-guide)。

  ```