[//]: # (title: 使用 Spring Data CrudRepository 進行資料庫存取)
[//]: # (description: 在以 Kotlin 編寫的 Spring Boot 專案中使用 Spring Data 介面。)

<tldr>
    <p>這是 **Spring Boot 與 Kotlin 入門** 教學的最後一部分。在繼續之前，請確保您已完成以下步驟：</p><br/>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <a href="jvm-create-project-with-spring-boot.md">使用 Kotlin 建立 Spring Boot 專案</a><br/><img src="icon-2-done.svg" width="20" alt="第二步"/> <a href="jvm-spring-boot-add-data-class.md">向 Spring Boot 專案新增資料類別</a><br/><img src="icon-3-done.svg" width="20" alt="第三步"/> <a href="jvm-spring-boot-add-db-support.md">為 Spring Boot 專案新增資料庫支援</a><br/><img src="icon-4.svg" width="20" alt="第四步"/> <strong>使用 Spring Data CrudRepository 進行資料庫存取</strong></p>
</tldr>

在這部分中，您將把服務層 (service layer) 遷移為使用 [Spring Data](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/CrudRepository.html) 的 `CrudRepository` 進行資料庫存取，而不是 `JdbcTemplate`。
_CrudRepository_ 是一個 Spring Data 介面，用於對特定類型的儲存庫執行泛型 [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) (建立、讀取、更新和刪除) 操作。
它提供了多種開箱即用的方法來與資料庫互動。

## 更新您的應用程式

首先，您需要調整 `Message` 類別以使用 `CrudRepository` API：

1.  向 `Message` 類別新增 `@Table` 註解，以宣告其與資料庫表格的映射關係。
    在 `id` 欄位前新增 `@Id` 註解。

    > 這些註解還需要額外的引用 (imports)。
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

    此外，為了讓 `Message` 類別的使用方式更為慣用，
    您可以將 `id` 屬性的預設值設定為 `null`，並調換資料類別屬性的順序：

    ```kotlin
    @Table("MESSAGES")
    data class Message(val text: String, @Id val id: String? = null)
    ```
 
    現在，如果您需要建立 `Message` 類別的新實例，您只需指定 `text` 屬性作為參數：

    ```kotlin
    val message = Message("Hello") // id is null
    ```

2.  宣告一個 `CrudRepository` 介面，它將與 `Message` 資料類別一起使用。建立 `MessageRepository.kt` 檔案並向其中新增以下程式碼：

    ```kotlin
    // MessageRepository.kt
    package com.example.demo
   
    import org.springframework.data.repository.CrudRepository
    
    interface MessageRepository : CrudRepository<Message, String>
    ```

3.  更新 `MessageService` 類別。它現在將使用 `MessageRepository`，而不是執行 SQL 查詢：

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
       <def title="擴充函式 (Extension functions)">
          <p><code>findByIdOrNull()</code> 函式是 Spring Data JDBC 中 <code>CrudRepository</code> 介面的<a href="extensions.md#extension-functions">擴充函式</a>。</p>
       </def>
       <def title="CrudRepository save() 函式">
          <p><a href="https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#jdbc.entity-persistence">此函式的工作原理</a>是基於一個假設：新物件在資料庫中沒有 ID。因此，對於插入操作，ID <b>應該是 null</b>。</p>
          <p> 如果 ID 不是<i>null</i>，<code>CrudRepository</code> 會假定該物件已存在於資料庫中，並且這是一個<i>更新</i>操作，而不是<i>插入</i>操作。在插入操作之後，<code>id</code> 將由資料儲存區 (data store) 產生，並重新指派回 <code>Message</code> 實例。這就是為什麼 <code>id</code> 屬性應使用 <code>var</code> 關鍵字宣告的原因。</p>
          <p></p>
       </def>
    </deflist>

4.  更新 messages 表格定義，為插入的物件產生 ID。由於 `id` 是字串，您可以預設使用 `RANDOM_UUID()` 函式來產生 ID 值：

    ```sql
    -- schema.sql 
    CREATE TABLE IF NOT EXISTS messages (
        id      VARCHAR(60)  DEFAULT RANDOM_UUID() PRIMARY KEY,
        text    VARCHAR      NOT NULL
    );
    ```

5.  更新位於 `src/main/resources` 資料夾中的 `application.properties` 檔案中的資料庫名稱：

   ```none
   spring.application.name=demo
   spring.datasource.driver-class-name=org.h2.Driver
   spring.datasource.url=jdbc:h2:file:./data/testdb2
   spring.datasource.username=name
   spring.datasource.password=password
   spring.sql.init.schema-locations=classpath:schema.sql
   spring.sql.init.mode=always
   ```

這是應用程式的完整程式碼：

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

## 執行應用程式

恭喜！應用程式已準備好再次執行。
在將 `JdbcTemplate` 替換為 `CrudRepository` 後，功能保持不變，因此應用程式的運作一如既往。

您現在可以從 `requests.http` 檔案中[執行 POST 和 GET HTTP 請求](jvm-spring-boot-add-db-support.md#add-messages-to-database-via-http-request)並獲得相同的結果。

## 下一步

取得您的個人語言地圖，以幫助您探索 Kotlin 功能並追蹤您在學習該語言方面的進度：

<a href="https://resources.jetbrains.com/storage/products/kotlin/docs/Kotlin_Language_Features_Map.pdf">
   <img src="get-kotlin-language-map.png" width="700" alt="取得 Kotlin 語言地圖" style="block"/>
</a>

*   了解更多關於[從 Kotlin 程式碼呼叫 Java](java-interop.md) 和[從 Java 程式碼呼叫 Kotlin](java-to-kotlin-interop.md) 的資訊。
*   了解如何使用 [Java 轉 Kotlin 轉換器](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k) 將現有 Java 程式碼轉換為 Kotlin。
*   查閱我們的 Java 轉 Kotlin 遷移指南：
    *   [Java 和 Kotlin 中的字串 (Strings)](java-to-kotlin-idioms-strings.md)。
    *   [Java 和 Kotlin 中的集合 (Collections)](java-to-kotlin-collections-guide.md)。
    *   [Java 和 Kotlin 中的可空性 (Nullability)](java-to-kotlin-nullability-guide.md)。