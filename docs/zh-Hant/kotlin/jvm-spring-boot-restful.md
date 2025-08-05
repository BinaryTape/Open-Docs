[//]: # (title: 使用 Spring Boot 建立具備資料庫的 RESTful Web 服務 – 教學)

本教學將引導您完成使用 Spring Boot 建立一個簡單應用程式，並新增資料庫來儲存資訊的過程。

在本教學中，您將會：
* 建立具備 HTTP 端點的應用程式
* 學習如何以 JSON 格式回傳資料物件列表
* 建立用於儲存物件的資料庫
* 使用端點寫入和擷取資料庫物件

您可以下載並探索[已完成的專案](https://github.com/kotlin-hands-on/spring-time-in-kotlin-episode1)，或觀看本教學的影片：

<video width="560" height="315" href="gf-kjD2ZmZk" title="Kotlin 中的 Spring Time。開始使用"/>

## 開始之前

下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。

## 初始化專案

使用 Spring Initializr 建立新專案：

> 您也可以使用[整合 Spring Boot 外掛程式的 IntelliJ IDEA](https://www.jetbrains.com/help/idea/spring-boot.html) 建立新專案。
>
{style="note"}

1. 開啟 [Spring Initializr](https://start.spring.io/#!type=gradle-project&language=kotlin&platformVersion=2.7.3&packaging=jar&jvmVersion=11&groupId=com.example&artifactId=demo&name=demo&description=Demo%20project%20for%20Spring%20Boot&packageName=demo&dependencies=web,data-jdbc,h2)。此連結將開啟本教學預先填寫好專案設定的頁面。此專案使用 **Gradle**、**Kotlin**、**Spring Web**、**Spring Data JDBC** 和 **H2 資料庫**：

   ![使用 Spring Initializr 建立新專案](spring-boot-create-project-with-initializr.png){width=800}

2. 點擊畫面底部的 **GENERATE**。Spring Initializr 將會依據指定的設定產生專案。下載將自動開始。

3. 解壓縮 **.zip** 檔案，並在 IntelliJ IDEA 中開啟。

   專案結構如下：
   ![Spring Boot 專案結構](spring-boot-project-structure.png){width=350}
 
   在 `main/kotlin` 資料夾下有屬於應用程式的套件和類別。應用程式的進入點是 `DemoApplication.kt` 檔案中的 `main()` 方法。

## 探索專案建置檔

開啟 `build.gradle.kts` 檔案。

這是 Gradle Kotlin 建置腳本，其中包含應用程式所需的相依性列表。

此 Gradle 檔案為 Spring Boot 的標準檔案，但也包含必要的 Kotlin 相依性，包括 [kotlin-spring](all-open-plugin.md#spring-support) Gradle 外掛程式。

## 探索 Spring Boot 應用程式

開啟 `DemoApplication.kt` 檔案：

```kotlin
package demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}
```

請注意，Kotlin 應用程式檔案與 Java 應用程式檔案不同：
* 雖然 Spring Boot 會尋找 public static `main()` 方法，但 Kotlin 應用程式使用了在 `DemoApplication` 類別之外定義的[頂層函數](functions.md#function-scope)。
* `DemoApplication` 類別沒有宣告為 `open`，因為 [kotlin-spring](all-open-plugin.md#spring-support) 外掛程式會自動完成此操作。

## 建立資料類別和控制器

若要建立端點，請將[資料類別](data-classes.md)和控制器新增至您的專案：

1. 在 `DemoApplication.kt` 檔案中，建立一個具有兩個屬性 (`id` 和 `text`) 的 `Message` 資料類別：

   ```kotlin
   data class Message(val id: String?, val text: String)
   ```

2. 在同一個檔案中，建立一個 `MessageResource` 類別，它將用於處理請求並回傳一個包含 `Message` 物件集合的 JSON 文件：

   ```kotlin
   @RestController
   class MessageResource {
       @GetMapping("/")
       fun index(): List<Message> = listOf(
           Message("1", "Hello!"),
           Message("2", "Bonjour!"),
           Message("3", "Privet!"),
       )
   }
   ```

`DemoApplication.kt` 的完整程式碼：

```kotlin
package demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.annotation.Id
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}

@RestController
class MessageResource {
    @GetMapping("/")
    fun index(): List<Message> = listOf(
        Message("1", "Hello!"),
        Message("2", "Bonjour!"),
        Message("3", "Privet!"),
    )
}

data class Message(val id: String?, val text: String)
```

## 執行應用程式

應用程式現已準備好執行：

1. 點擊 `main()` 方法旁裝訂線中的綠色 **執行** 圖示，或使用 **Alt+Enter** 快速鍵在 IntelliJ IDEA 中叫出啟動選單：

   ![執行應用程式](spring-boot-run-the-application.png){width=800}

   > 您也可以在終端機中執行 `./gradlew bootRun` 命令。
   >
   {style="note"}

2. 應用程式啟動後，開啟以下 URL：[http://localhost:8080](http://localhost:8080)。

   您將會看到一個頁面，其中包含以 JSON 格式顯示的訊息集合：

   ![應用程式輸出](spring-boot-output.png)

## 新增資料庫支援

若要在您的應用程式中使用資料庫，首先建立兩個端點：一個用於儲存訊息，另一個用於擷取訊息：

1. 將 `@Table` 註解新增至 `Message` 類別，以宣告對應至資料庫表格。在 `id` 欄位之前新增 `@Id` 註解。這些註解也需要額外的匯入：

   ```kotlin
   import org.springframework.data.annotation.Id
   import org.springframework.data.relational.core.mapping.Table
  
   @Table("MESSAGES")
   data class Message(@Id val id: String?, val text: String)
   ```

2. 使用 [Spring Data Repository API](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/CrudRepository.html) 存取資料庫：

   ```kotlin
   import org.springframework.data.jdbc.repository.query.Query
   import org.springframework.data.repository.CrudRepository
  
   interface MessageRepository : CrudRepository<Message, String>{
  
       @Query("select * from messages")
       fun findMessages(): List<Message>
   }
   ```

   當您在 `MessageRepository` 的實例上呼叫 `findMessages()` 方法時，它將執行對應的資料庫查詢：

   ```sql
   select * from messages
   ```

   此查詢會擷取資料庫表格中所有 `Message` 物件的列表。

3. 建立 `MessageService` 類別：

   ```kotlin
   import org.springframework.stereotype.Service
  
   @Service
   class MessageService(val db: MessageRepository) {

       fun findMessages(): List<Message> = db.findMessages()

       fun post(message: Message){
           db.save(message)
       }
   }
   ```

   此類別包含兩個方法：
   * `post()` 用於將新的 `Message` 物件寫入資料庫
   * `findMessages()` 用於從資料庫中取得所有訊息

4. 更新 `MessageResource` 類別：

   ```kotlin
   import org.springframework.web.bind.annotation.RequestBody
   import org.springframework.web.bind.annotation.PostMapping
  
  
   @RestController
   class MessageResource(val service: MessageService) {
       @GetMapping("/")
       fun index(): List<Message> = service.findMessages()
  
       @PostMapping("/")
       fun post(@RequestBody message: Message) {
           service.post(message)
       }
   }
   ```

   現在它使用 `MessageService` 來與資料庫互動。

## 配置資料庫

在應用程式中配置資料庫：

1. 在 `src/main/resources` 中建立一個名為 `sql` 的新資料夾，其中包含 `schema.sql` 檔案。它將儲存資料庫架構：

   ![建立新資料夾](spring-boot-sql-scheme.png){width=300}

2. 使用以下程式碼更新 `src/main/resources/sql/schema.sql` 檔案：

   ```sql
   CREATE TABLE IF NOT EXISTS messages (
     id                     VARCHAR(60)  DEFAULT RANDOM_UUID() PRIMARY KEY,
     text                   VARCHAR      NOT NULL
   );
   ```

   它會建立 `messages` 表格，包含 `id` 和 `text` 兩個欄位。表格結構符合 `Message` 類別的結構。

3. 開啟位於 `src/main/resources` 資料夾中的 `application.properties` 檔案，並新增以下應用程式屬性：

   ```none
   spring.datasource.driver-class-name=org.h2.Driver
   spring.datasource.url=jdbc:h2:file:./data/testdb
   spring.datasource.username=sa
   spring.datasource.password=password
   spring.sql.init.schema-locations=classpath:sql/schema.sql
   spring.sql.init.mode=always
   ```

   這些設定會啟用 Spring Boot 應用程式的資料庫。
   請參閱 [Spring 文件](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-application-properties.html)中常用應用程式屬性的完整列表。

## 執行 HTTP 請求

您應該使用 HTTP 用戶端與之前建立的端點互動。在 IntelliJ IDEA 中，您可以使用[內嵌 HTTP 用戶端](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html)：

1. 執行應用程式。應用程式啟動並執行後，您可以執行 POST 請求將訊息儲存到資料庫中。

2. 建立 `requests.http` 檔案，並新增以下 HTTP 請求：

   ```http request
   ### Post 'Hello!"
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

3. 執行所有 POST 請求。使用請求宣告旁裝訂線中的綠色 **執行** 圖示。這些請求會將文字訊息寫入資料庫。

   ![執行 HTTP POST 請求](spring-boot-run-http-request.png)

4. 執行 GET 請求，並在 **執行** 工具視窗中查看結果：

   ![執行 HTTP GET 請求](spring-boot-output-2.png)

### 執行請求的替代方式

您也可以使用任何其他 HTTP 用戶端或 cURL 命令列工具。例如，您可以在終端機中執行以下命令來取得相同的結果：

```bash
curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Hello!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Bonjour!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Privet!\" }"

curl -X GET --location "http://localhost:8080"
```

## 下一步

取得您的個人化語言地圖，以協助您探索 Kotlin 功能並追蹤您學習該語言的進度。我們還將傳送給您關於將 Kotlin 與 Spring 搭配使用的語言提示和有用材料。

<a href="https://info.jetbrains.com/kotlin-tips.html">
   <img src="get-kotlin-language-map.png" width="700" alt="取得 Kotlin 語言地圖"/>
</a>

> 您需要在下一頁分享您的電子郵件地址才能收到這些材料。
>
{style="note"}

### 另請參閱

如需更多教學，請查看 Spring 網站：

* [使用 Spring Boot 和 Kotlin 建置網路應用程式](https://spring.io/guides/tutorials/spring-boot-kotlin/)
* [Spring Boot 整合 Kotlin Coroutines 和 RSocket](https://spring.io/guides/tutorials/spring-webflux-kotlin-rsocket/)