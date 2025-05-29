[//]: # (title: 為 Spring Boot 專案新增資料庫支援)
[//]: # (description: 使用 JDBC 範本為以 Kotlin 編寫的 Spring Boot 專案新增資料庫支援。)

<tldr>
    <p>這是**Spring Boot 與 Kotlin 入門指南**教學課程的第三部分。在繼續之前，請確保您已完成先前步驟：</p><br/>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <a href="jvm-create-project-with-spring-boot.md">使用 Kotlin 建立 Spring Boot 專案</a><br/><img src="icon-2-done.svg" width="20" alt="第二步"/> <a href="jvm-spring-boot-add-data-class.md">為 Spring Boot 專案新增資料類別</a><br/><img src="icon-3.svg" width="20" alt="第三步"/> <strong>為 Spring Boot 專案新增資料庫支援</strong><br/><img src="icon-4-todo.svg" width="20" alt="第四步"/> 使用 Spring Data CrudRepository 進行資料庫存取</p>
</tldr>

在本教學課程的此部分中，您將使用 _Java 資料庫連線_ (JDBC) 為專案新增和配置資料庫。
在 JVM 應用程式中，您使用 JDBC 與資料庫互動。
為方便起見，Spring 框架提供了 `JdbcTemplate` 類別，它簡化了 JDBC 的使用並有助於避免常見錯誤。

## 新增資料庫支援

基於 Spring 框架的應用程式的常見做法是在所謂的_服務層級 (service layer)_ 中實作資料庫存取邏輯 – 這是業務邏輯 (business logic) 所在之處。
在 Spring 中，您應該使用 `@Service` 註解標記類別，以表示該類別屬於應用程式的服務層級。
在此應用程式中，您將為此目的建立 `MessageService` 類別。

在相同套件中，建立 `MessageService.kt` 檔案和 `MessageService` 類別，如下所示：

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
   <def title="建構函式引數與依賴注入 (Dependency Injection) – (private val db: JdbcTemplate)">
      <p>Kotlin 中的類別有一個主建構函式。它也可以有一個或多個 <a href="classes.md#secondary-constructors">次級建構函式</a>。
      _主建構函式_是類別標頭的一部分，它位於類別名稱和可選的型別參數之後。在我們的範例中，建構函式是 <code>(val db: JdbcTemplate)</code>。</p>
      <p><code>val db: JdbcTemplate</code> 是建構函式的引數：</p>
      <code-block lang="kotlin">
      @Service
      class MessageService(private val db: JdbcTemplate)
      </code-block>
  </def>
   <def title="後置 Lambda 運算式與 SAM 轉換">
      <p><code>findMessages()</code> 函式呼叫 <code>JdbcTemplate</code> 類別的 <code>query()</code> 函式。<code>query()</code> 函式接受兩個引數：作為 String 實例的 SQL 查詢，以及將每列映射為一個物件的回呼函式：</p>
      <code-block lang="sql">
      db.query("...", RowMapper { ... } )
      </code-block><br/>
      <p><code>RowMapper</code> 介面只宣告一個方法，因此可以透過省略介面名稱，透過 Lambda 運算式實作它。Kotlin 編譯器知道 Lambda 運算式需要轉換為哪個介面，因為您將它用作函式呼叫的參數。這在 <a href="java-interop.md#sam-conversions">Kotlin 中稱為 SAM 轉換</a>：</p>
      <code-block lang="sql">
      db.query("...", { ... } )
      </code-block><br/>
      <p>在 SAM 轉換之後，查詢函式最終有兩個引數：第一個位置是 String，最後一個位置是 Lambda 運算式。根據 Kotlin 慣例，如果函式的最後一個參數是函式，則作為相應引數傳遞的 Lambda 運算式可以放在括號外。這種語法也稱為 <a href="lambdas.md#passing-trailing-lambdas">後置 Lambda 運算式 (trailing lambda)</a>：</p>
      <code-block lang="sql">
      db.query("...") { ... }
      </code-block>
   </def>
   <def title="用於未使用的 Lambda 引數的底線字元">
      <p>對於具有多個參數的 Lambda，您可以使用底線 <code>_</code> 字元來取代您未使用的參數名稱。</p>
      <p>因此，查詢函式呼叫的最終語法如下所示：</p>
      <code-block lang="kotlin">
      db.query("select * from messages") { response, _ ->
          Message(response.getString("id"), response.getString("text"))
      }
      </code-block>
   </def>
</deflist>

## 更新 MessageController 類別

更新 `MessageController.kt` 以使用新的 `MessageService` 類別：

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
   <def title="`@PostMapping` 註解">
      <p>負責處理 HTTP POST 請求的方法需要使用 <code>@PostMapping</code> 註解標記。為了能夠將作為 HTTP 主體內容傳送的 JSON 轉換為物件，您需要為方法引數使用 <code>@RequestBody</code> 註解。由於應用程式類別路徑中包含 Jackson 函式庫，轉換會自動進行。</p>
   </def>
   <def title="ResponseEntity">
      <p><code>ResponseEntity</code> 表示整個 HTTP 回應：狀態碼、標頭和主體。</p>
      <p>使用 <code>created()</code> 方法，您可以設定回應狀態碼 (201) 並設定位置標頭，指示所建立資源的上下文路徑。</p>
   </def>
</deflist>

## 更新 MessageService 類別

`Message` 類別的 `id` 被宣告為可空字串 (nullable String)：

```kotlin
data class Message(val id: String?, val text: String)
```

然而，將 `null` 作為 `id` 值儲存在資料庫中是不正確的：您需要優雅地處理這種情況。

更新您的 `MessageService.kt` 檔案程式碼，以便在將訊息儲存到資料庫時，若 `id` 為 `null` 則產生一個新值：

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
   <def title="Elvis 運算子 – `?:`">
      <p>程式碼 <code>message.id ?: UUID.randomUUID().toString()</code> 使用 <a href="null-safety.md#elvis-operator">Elvis 運算子 (if-not-null-else 簡寫) <code>?:</code></a>。如果 <code>?:</code> 左側的運算式不是 <code>null</code>，Elvis 運算子會回傳它；否則，它會回傳右側的運算式。請注意，右側的運算式僅在左側為 <code>null</code> 時才進行評估。</p>
   </def>
</deflist>

應用程式碼已準備好與資料庫協同工作。現在需要配置資料來源。

## 配置資料庫

在應用程式中配置資料庫：

1. 在 `src/main/resources` 目錄中建立 `schema.sql` 檔案。它將儲存資料庫物件定義：

   ![建立資料庫結構描述](create-database-schema.png){width=400}

2. 使用以下程式碼更新 `src/main/resources/schema.sql` 檔案：

   ```sql
   -- schema.sql
   CREATE TABLE IF NOT EXISTS messages (
   id       VARCHAR(60)  PRIMARY KEY,
   text     VARCHAR      NOT NULL
   );
   ```

   它會建立具有兩個欄位：`id` 和 `text` 的 `messages` 表。該表格結構與 `Message` 類別的結構相符。

3. 開啟位於 `src/main/resources` 資料夾中的 `application.properties` 檔案，並新增以下應用程式屬性：

   ```none
   spring.application.name=demo
   spring.datasource.driver-class-name=org.h2.Driver
   spring.datasource.url=jdbc:h2:file:./data/testdb
   spring.datasource.username=name
   spring.datasource.password=password
   spring.sql.init.schema-locations=classpath:schema.sql
   spring.sql.init.mode=always
   ```

   這些設定會為 Spring Boot 應用程式啟用資料庫。
   請參閱 [Spring 文件](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-application-properties.html)中常見應用程式屬性的完整列表。

## 透過 HTTP 請求將訊息新增至資料庫

您應該使用 HTTP 用戶端與先前建立的端點協同工作。在 IntelliJ IDEA 中，使用內建的 HTTP 用戶端：

1. 執行應用程式。一旦應用程式啟動並運行，您可以執行 POST 請求以將訊息儲存到資料庫中。

2. 在專案根資料夾中建立 `requests.http` 檔案，並新增以下 HTTP 請求：

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

3. 執行所有 POST 請求。使用請求宣告旁裝訂線中的綠色 **Run** 圖示。
   這些請求會將文字訊息寫入資料庫：

   ![執行 POST 請求](execute-post-requests.png)

4. 執行 GET 請求並在 **Run** 工具視窗中查看結果：

   ![執行 GET 請求](execute-get-requests.png)

### 執行請求的替代方法 {initial-collapse-state="collapsed" collapsible="true"}

您也可以使用任何其他 HTTP 用戶端或 cURL 命令列工具。例如，在終端機中執行以下命令以獲得相同的結果：

```bash
curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Hello!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Bonjour!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Privet!\" }"

curl -X GET --location "http://localhost:8080"
```

## 依 ID 擷取訊息

擴展應用程式的功能以依 ID 擷取個別訊息。

1. 在 `MessageService` 類別中，新增函式 `findMessageById(id: String)` 以依 ID 擷取個別訊息：

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
    <def title="參數列表中的可變引數 (vararg) 位置">
        <p><code>query()</code> 函式接受三個引數：</p>
        <list>
            <li>需要參數才能執行的 SQL 查詢字串</li>
            <li>型別為 String 的參數 <code>id</code></li>
            <li>由 Lambda 運算式實作的 <code>RowMapper</code> 實例</li>
        </list>
        <p><code>query()</code> 函式的第二個參數被宣告為可變引數 (<code>vararg</code>)。在 Kotlin 中，可變引數參數的位置不要求必須是參數列表中的最後一個。</p>
    </def>
    <def title="`singleOrNull()` 函式">
       <p><a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/single-or-null.html"><code>singleOrNull()</code></a> 函式回傳單一元素，如果陣列為空或有多個具有相同值的元素，則回傳 <code>null</code>。</p>
    </def>
   </deflist>
    
    > 用於依 ID 擷取訊息的 `.query()` 函式是 Spring 框架提供的 [Kotlin 擴充函式](extensions.md#extension-functions)。
    > 它需要額外的導入 <code>import org.springframework.jdbc.core.query</code>，如上述程式碼所示。
    >
    {style="warning"}

2. 將帶有 `id` 參數的新 `getMessage(...)` 函式新增到 `MessageController` 類別中：

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
    <def title="從上下文路徑中擷取值">
       <p>訊息 <code>id</code> 是由 Spring 框架從上下文路徑中擷取的，因為您使用 <code>@GetMapping(&quot;/{id}&quot;)</code> 註解標記了新函式。透過使用 <code>@PathVariable</code> 註解標記函式引數，您告訴框架將擷取到的值用作函式引數。新函式呼叫 <code>MessageService</code> 以依 ID 擷取個別訊息。</p>
    </def>
    <def title="帶有可空接收器的擴充函式">
         <p>擴充功能可以定義為帶有可空接收器型別。如果接收器為 <code>null</code>，則 <code>this</code> 也為 <code>null</code>。因此，在定義帶有可空接收器型別的擴充功能時，建議在函式主體內執行 <code>this == null</code> 檢查。</p>
         <p>您也可以使用空值安全呼叫運算子 (<code>?.</code>) 來執行空值檢查，如上方的 <code>toResponseEntity()</code> 函式所示：</p>
         <code-block lang="kotlin">
         this?.let { ResponseEntity.ok(it) }
         </code-block>
    </def>
    <def title="ResponseEntity">
        <p><code>ResponseEntity</code> 表示 HTTP 回應，包括狀態碼、標頭和主體。它是一個通用包裝器，允許您以對內容的更多控制，將客製化的 HTTP 回應傳送回用戶端。</p>
    </def>
    </deflist>

以下是應用程式的完整程式碼：

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

## 執行應用程式

Spring 應用程式已準備好運行：

1. 再次執行應用程式。

2. 開啟 `requests.http` 檔案並新增新的 GET 請求：

    ```http request
    ### Get the message by its id
    GET http://localhost:8080/id
    ```

3. 執行 GET 請求以從資料庫中擷取所有訊息。

4. 在 **Run** 工具視窗中複製其中一個 ID，並將其新增到請求中，如下所示：

    ```http request
    ### Get the message by its id
    GET http://localhost:8080/f910aa7e-11ee-4215-93ed-1aeeac822707
    ```
    
    > 請將您的訊息 ID 替換掉上述的範例 ID。
    >
    {style="note"}

5. 執行 GET 請求並在 **Run** 工具視窗中查看結果：

    ![依 ID 擷取訊息](retrieve-message-by-its-id.png){width=706}

## 下一步

最後一步將向您展示如何使用 Spring Data 進行更流行的資料庫連線。

**[繼續到下一章節](jvm-spring-boot-using-crudrepository.md)**