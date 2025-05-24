---
title: "使用 Spring Data CrudRepository 進行資料庫存取"
description: "在使用 Kotlin 編寫的 Spring Boot 專案中使用 Spring Data 介面。"
---
:::info
<p>
   這是 <strong>Spring Boot 與 Kotlin 入門</strong>教學的最後一部分。在繼續之前，請確保您已完成之前的步驟：
</p><br/>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot">使用 Kotlin 建立 Spring Boot 專案</a><br/><img src="/img/icon-2-done.svg" width="20" alt="Second step"/> <a href="jvm-spring-boot-add-data-class">將資料類別新增至 Spring Boot 專案</a><br/><img src="/img/icon-3-done.svg" width="20" alt="Third step"/> <a href="jvm-spring-boot-add-db-support">為 Spring Boot 專案新增資料庫支援</a><br/><img src="/img/icon-4.svg" width="20" alt="Fourth step"/> <strong>使用 Spring Data CrudRepository 進行資料庫存取</strong>
</p>

:::

在本部分中，您將遷移服務層以使用 [Spring Data](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/CrudRepository.html) 的 `CrudRepository` (通用資料庫儲存庫) 而不是 `JdbcTemplate` 進行資料庫存取。
`CrudRepository` 是一個 Spring Data 介面，用於對特定類型的儲存庫執行通用 [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) (建立、讀取、更新和刪除) 操作。
它提供了幾個現成的方法來與資料庫互動。

## 更新您的應用程式

首先，您需要調整 `Message` 類別以使用 `CrudRepository` API：

1. 將 `@Table` 註解新增至 `Message` 類別，以宣告對應到資料庫表格。  
   在 `id` 欄位前新增 `@Id` 註解。

    > 這些註解還需要額外的 import 語句。
    >  
    

    ```kotlin
    // Message.kt
    package demo
   
    import org.springframework.data.annotation.Id
    import org.springframework.data.relational.core.mapping.Table
    
    @Table("MESSAGES")
    data class Message(@Id val id: String?, val text: String)
    ```

    此外，為了使 `Message` 類別的使用更加慣用，
    您可以將 `id` 屬性的預設值設定為 null，並反轉資料類別屬性的順序：

    ```kotlin
    @Table("MESSAGES")
    data class Message(val text: String, @Id val id: String? = null)
    ```
 
    現在，如果您需要建立 `Message` 類別的新實例，您只能將 `text` 屬性指定為參數：

    ```kotlin
    val message = Message("Hello") // id is null
    ```

2. 為將與 `Message` 資料類別一起使用的 `CrudRepository` 宣告一個介面。建立 `MessageRepository.kt`
   檔案並將以下程式碼新增至其中：

    ```kotlin
    // MessageRepository.kt
    package demo
   
    import org.springframework.data.repository.CrudRepository
    
    interface MessageRepository : CrudRepository<Message, String>
    ```

3. 更新 `MessageService` 類別。它現在將使用 `MessageRepository` 而不是執行 SQL 查詢：

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
<h3>擴充函式 (Extension functions)</h3>
<p>
   `findByIdOrNull()` 函式是 Spring Data JDBC 中 `CrudRepository` 介面的 <a href="extensions#extension-functions">擴充函式</a>。
</p>
<h3>CrudRepository save() 函式</h3>
<p>
   <a href="https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#jdbc.entity-persistence">此函式運作時</a>假設新物件在資料庫中沒有 id。因此，對於插入操作，id <b>應該為 null</b>。
</p>
<p>
   如果 id 不是<i>null</i>，`CrudRepository` 會假定該物件已存在於資料庫中，並且這是一個<i>更新</i>操作，而不是<i>插入</i>操作。在插入操作之後，`id` 將由資料存放區產生，並分配回 `Message` 實例。這就是為什麼 `id` 屬性應該使用 `var` 關鍵字宣告的原因。
</p>
<p>
</p>
       
    

4. 更新訊息表格定義，以產生插入物件的 id。由於 `id` 是一個字串，因此您可以使用 `RANDOM_UUID()` 函式預設產生 id 值：

    ```sql
    -- schema.sql 
    CREATE TABLE IF NOT EXISTS messages (
        id      VARCHAR(60)  DEFAULT RANDOM_UUID() PRIMARY KEY,
        text    VARCHAR      NOT NULL
    );
    ```

5. 更新位於 `src/main/resources` 資料夾中的 `application.properties` 檔案中的資料庫名稱：

   ```none
   spring.application.name=demo
   spring.datasource.driver-class-name=org.h2.Driver
   spring.datasource.url=jdbc:h2:file:./data/testdb2
   spring.datasource.username=name
   spring.datasource.password=password
   spring.sql.init.schema-locations=classpath:schema.sql
   spring.sql.init.mode=always
   ```

以下是應用程式的完整程式碼：

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

## 執行應用程式

應用程式已準備好再次執行。
透過用 `CrudRepository` 替換 `JdbcTemplate`，功能沒有改變，因此應用程式應該以與先前相同的方式運作。

## 接下來是什麼

取得您的個人語言地圖，以幫助您瀏覽 Kotlin 功能並追蹤您學習該語言的進度：

<a href="https://resources.jetbrains.com/storage/products/kotlin/docs/Kotlin_Language_Features_Map.pdf">
   <img src="/img/get-kotlin-language-map.png" width="700" alt="Get the Kotlin language map" />
</a>

* 了解更多關於 [從 Kotlin 程式碼呼叫 Java](java-interop) 和 [從 Java 程式碼呼叫 Kotlin](java-to-kotlin-interop)。
* 學習如何使用 [Java-to-Kotlin 轉換器](mixing-java-kotlin-intellij#converting-an-existing-java-file-to-kotlin-with-j2k) 將現有的 Java 程式碼轉換為 Kotlin。
* 查看我們的 Java 到 Kotlin 遷移指南：
  * [Java 和 Kotlin 中的字串](java-to-kotlin-idioms-strings)。
  * [Java 和 Kotlin 中的集合](java-to-kotlin-collections-guide)。
  * [Java 和 Kotlin 中的可空性](java-to-kotlin-nullability-guide)。

  ```