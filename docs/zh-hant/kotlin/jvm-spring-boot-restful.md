---
title: "使用 Spring Boot 建立具有資料庫的 RESTful Web 服務教學"
---
這個教學將引導您使用 Spring Boot 建立一個簡單的應用程式，並新增一個資料庫來儲存資訊。

在本教學中，您將：
* 建立一個具有 HTTP 端點的應用程式
* 學習如何在 JSON 格式中回傳資料物件列表
* 建立一個用於儲存物件的資料庫
* 使用端點來寫入和檢索資料庫物件

您可以下載並探索[已完成的專案](https://github.com/kotlin-hands-on/spring-time-in-kotlin-episode1)
或觀看此教學的影片：

<video width="560" height="315" href="gf-kjD2ZmZk" title="Spring Time in Kotlin. Getting Started"/>

## 開始之前

下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。

## 啟動專案 (Bootstrap the project)

使用 Spring Initializr 建立一個新專案：

:::note
您還可以使用[帶有 Spring Boot 外掛程式的 IntelliJ IDEA](https://www.jetbrains.com/help/idea/spring-boot.html)建立一個新專案

:::

1. 開啟 [Spring Initializr](https://start.spring.io/#!type=gradle-project&language=kotlin&platformVersion=2.7.3&packaging=jar&jvmVersion=11&groupId=com.example&artifactId=demo&name=demo&description=Demo%20project%20for%20Spring%20Boot&packageName=demo&dependencies=web,data-jdbc,h2)。 此連結會開啟頁面，其中已填寫此教學的專案設定。
此專案使用 **Gradle**、**Kotlin**、**Spring Web**、**Spring Data JDBC** 和 **H2 Database**：

   <img src="/img/spring-boot-create-project-with-initializr.png" alt="Create a new project with Spring Initializr" width="800" style={{verticalAlign: 'middle'}}/>

2. 點擊畫面底部的 **GENERATE**。 Spring Initializr 將使用指定的設定產生專案。 下載會自動開始。

3. 解壓縮 **.zip** 檔案並在 IntelliJ IDEA 中開啟它。

   專案具有以下結構：
   <img src="/img/spring-boot-project-structure.png" alt="The Spring Boot project structure" width="350" style={{verticalAlign: 'middle'}}/>
 
   在 `main/kotlin` 資料夾下有屬於應用程式的套件和類別。 應用程式的進入點是 `DemoApplication.kt` 檔案的 `main()` 方法。

## 探索專案建置檔案 (Explore the project build file)

開啟 `build.gradle.kts` 檔案。

這是 Gradle Kotlin 建置腳本，其中包含應用程式所需的相依性清單。

Gradle 檔案對於 Spring Boot 來說是標準的，但它也包含必要的 Kotlin 相依性，包括 [kotlin-spring](all-open-plugin#spring-support) Gradle 外掛程式。

## 探索 Spring Boot 應用程式 (Explore the Spring Boot application)

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
* 雖然 Spring Boot 尋找 public static `main()` 方法，但 Kotlin 應用程式使用在 `DemoApplication` 類別之外定義的[頂層函式](functions#function-scope)。
* `DemoApplication` 類別未宣告為 `open`，因為 [kotlin-spring](all-open-plugin#spring-support) 外掛程式會自動執行此操作。

## 建立資料類別和控制器 (Create a data class and a controller)

若要建立端點 (Endpoint)，請將[資料類別](data-classes)和控制器新增至您的專案：

1. 在 `DemoApplication.kt` 檔案中，建立一個具有兩個屬性的 `Message` 資料類別：`id` 和 `text`：

   ```kotlin
   data class Message(val id: String?, val text: String)
   ```

2. 在同一個檔案中，建立一個 `MessageResource` 類別，它將處理請求並回傳包含 `Message` 物件集合的 JSON 文件：

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

## 執行應用程式 (Run the application)

應用程式現在已準備好執行：

1. 點擊 `main()` 方法旁邊的裝訂邊中的綠色 **Run** 圖示，或使用 **Alt+Enter** 快速鍵來叫用 IntelliJ IDEA 中的啟動選單：

   <img src="/img/spring-boot-run-the-application.png" alt="Run the application" width="800" style={{verticalAlign: 'middle'}}/>

   > 您也可以在終端機中執行 `./gradlew bootRun` 命令。
   >
   

2. 應用程式啟動後，開啟以下 URL：[http://localhost:8080](http://localhost:8080)。

   您將看到一個頁面，其中包含 JSON 格式的訊息集合：

   <img src="/img/spring-boot-output.png" alt="Application output" style={{verticalAlign: 'middle'}}/>

## 新增資料庫支援 (Add database support)

若要在應用程式中使用資料庫，請先建立兩個端點：一個用於儲存訊息，另一個用於檢索訊息：

1. 將 `@Table` 註釋新增至 `Message` 類別，以宣告對資料庫表格的對應。 在 `id` 欄位之前新增 `@Id` 註釋。 這些註釋還需要額外的匯入：

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

   當您在 `MessageRepository` 的實例上呼叫 `findMessages()` 方法時，它將執行相應的資料庫查詢：

   ```sql
   select * from messages
   ```

   此查詢會檢索資料庫表格中所有 `Message` 物件的清單。

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
   * `findMessages()` 用於從資料庫取得所有訊息

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

   現在它使用 `MessageService` 來處理資料庫。

## 設定資料庫 (Configure the database)

在應用程式中設定資料庫：

1. 在 `src/main/resources` 中建立一個名為 `sql` 的新資料夾，並在其中建立 `schema.sql` 檔案。 它將儲存資料庫結構：

   <img src="/img/spring-boot-sql-scheme.png" alt="Create a new folder" width="300" style={{verticalAlign: 'middle'}}/>

2. 使用以下程式碼更新 `src/main/resources/sql/schema.sql` 檔案：

   ```sql
   CREATE TABLE IF NOT EXISTS messages (
     id                     VARCHAR(60)  DEFAULT RANDOM_UUID() PRIMARY KEY,
     text                   VARCHAR      NOT NULL
   );
   ```

   它會建立具有兩個欄位的 `messages` 表格：`id` 和 `text`。 表格結構與 `Message` 類別的結構相符。

3. 開啟位於 `src/main/resources` 資料夾中的 `application.properties` 檔案，並新增下列應用程式屬性：

   ```none
   spring.datasource.driver-class-name=org.h2.Driver
   spring.datasource.url=jdbc:h2:file:./data/testdb
   spring.datasource.username=sa
   spring.datasource.password=password
   spring.sql.init.schema-locations=classpath:sql/schema.sql
   spring.sql.init.mode=always
   ```

   這些設定會為 Spring Boot 應用程式啟用資料庫。
   請參閱 [Spring 文件](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-application-properties.html) 中常見應用程式屬性的完整清單。

## 執行 HTTP 請求 (Execute HTTP requests)

您應該使用 HTTP 用戶端來處理先前建立的端點 (Endpoint)。 在 IntelliJ IDEA 中，您可以使用嵌入式 [HTTP 用戶端](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html)：

1. 執行應用程式。 應用程式啟動並執行後，您可以執行 POST 請求以將訊息儲存在資料庫中。

2. 建立 `requests.http` 檔案並新增下列 HTTP 請求：

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

3. 執行所有 POST 請求。 使用請求宣告旁邊裝訂邊中的綠色 **Run** 圖示。
   這些請求會將文字訊息寫入資料庫。

   <img src="/img/spring-boot-run-http-request.png" alt="Run HTTP POST requests" style={{verticalAlign: 'middle'}}/>

4. 執行 GET 請求，並在 **Run** 工具視窗中查看結果：

   <img src="/img/spring-boot-output-2.png" alt="Run HTTP GET request" style={{verticalAlign: 'middle'}}/>

### 執行請求的替代方法 (Alternative way to execute requests)

您也可以使用任何其他 HTTP 用戶端或 cURL 命令列工具。 例如，您可以在終端機中執行下列命令以取得相同的結果：

```bash
curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Hello!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Bonjour!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Privet!\" }"

curl -X GET --location "http://localhost:8080"
```

## 下一步 (Next step)

取得您的個人語言地圖，以協助您瀏覽 Kotlin 功能並追蹤您學習該語言的進度。
我們還將向您發送有關將 Kotlin 與 Spring 搭配使用的語言提示和有用資料。

<a href="https://info.jetbrains.com/kotlin-tips.html">
   <img src="/img/get-kotlin-language-map.png" width="700" alt="Get the Kotlin language map"/>
</a>
:::note
您需要在下一個頁面上分享您的電子郵件地址才能收到這些資料。

:::

### 另請參閱 (See also)

如需更多教學課程，請查看 Spring 網站：

* [使用 Spring Boot 和 Kotlin 建立 Web 應用程式](https://spring.io/guides/tutorials/spring-boot-kotlin/)
* [Spring Boot with Kotlin Coroutines and RSocket](https://spring.io/guides/tutorials/spring-webflux-kotlin-rsocket/)