[//]: # (title: 使用 Spring Boot 建立一個包含資料庫的 RESTful 網頁服務 – 教學)

本教學將引導您完成一個使用 Spring Boot 建立簡單應用程式，並新增資料庫以儲存資訊的過程。

在本教學中，您將：
* 建立一個具有 HTTP 端點的應用程式
* 學習如何以 JSON 格式回傳資料物件列表
* 建立一個用於儲存物件的資料庫
* 使用端點寫入和擷取資料庫物件

您可以下載並探索[已完成的專案](https://github.com/kotlin-hands-on/spring-time-in-kotlin-episode1)，或觀看此教學的影片：

<video width="560" height="315" href="gf-kjD2ZmZk" title="Spring Time in Kotlin. Getting Started"/>

## 開始之前

下載並安裝最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。

## 啟動專案

使用 Spring Initializr 建立一個新專案：

> 您也可以使用 [IntelliJ IDEA 搭配 Spring Boot 外掛程式](https://www.jetbrains.com/help/idea/spring-boot.html)建立新專案。
>
{style="note"}

1. 開啟 [Spring Initializr](https://start.spring.io/#!type=gradle-project&language=kotlin&platformVersion=2.7.3&packaging=jar&jvmVersion=11&groupId=com.example&artifactId=demo&name=demo&description=Demo%20project%20for%20Spring%20Boot&packageName=demo&dependencies=web,data-jdbc,h2)。此連結會開啟已填入本教學專案設定的頁面。
本專案使用 **Gradle**、**Kotlin**、**Spring Web**、**Spring Data JDBC** 和 **H2 Database**：

   ![Create a new project with Spring Initializr](spring-boot-create-project-with-initializr.png){width=800}

2. 點擊畫面底部的 **GENERATE**。Spring Initializr 將生成具有指定設定的專案。下載會自動開始。

3. 解壓縮 **.zip** 檔案並在 IntelliJ IDEA 中開啟。

   專案結構如下：
   ![The Spring Boot project structure](spring-boot-project-structure.png){width=350}
 
   在 `main/kotlin` 資料夾下有屬於應用程式的套件和類別。應用程式的進入點是 `DemoApplication.kt` 檔案的 `main()` 方法。

## 探索專案建置檔案

開啟 `build.gradle.kts` 檔案。

這是 Gradle Kotlin 建置腳本，其中包含應用程式所需的依賴項列表。

這個 Gradle 檔案對於 Spring Boot 來說是標準的，但它也包含必要的 Kotlin 依賴項，包括 [kotlin-spring](all-open-plugin.md#spring-support) Gradle 外掛程式。

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
* Spring Boot 會尋找一個公開的靜態 `main()` 方法，而 Kotlin 應用程式則使用定義在 `DemoApplication` 類別之外的[頂層函數](functions.md#function-scope)。
* `DemoApplication` 類別沒有宣告為 `open`，因為 [kotlin-spring](all-open-plugin.md#spring-support) 外掛程式會自動處理。

## 建立資料類別和控制器

要建立一個端點，請為您的專案新增一個[資料類別](data-classes.md)和一個控制器：

1. 在 `DemoApplication.kt` 檔案中，建立一個包含兩個屬性 `id` 和 `text` 的 `Message` 資料類別：

   ```kotlin
   data class Message(val id: String?, val text: String)
   ```

2. 在同一個檔案中，建立一個 `MessageResource` 類別，它將處理請求並回傳一個包含 `Message` 物件集合的 JSON 文件：

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

應用程式現在已準備好執行：

1. 點擊 `main()` 方法旁邊裝訂線中的綠色 **Run** 圖示，或使用 **Alt+Enter** 快捷鍵在 IntelliJ IDEA 中叫出啟動選單：

   ![Run the application](spring-boot-run-the-application.png){width=800}

   > 您也可以在終端機中執行 `./gradlew bootRun` 命令。
   >
   {style="note"}

2. 應用程式啟動後，開啟以下 URL：[http://localhost:8080](http://localhost:8080)。

   您將看到一個以 JSON 格式顯示訊息集合的頁面：

   ![Application output](spring-boot-output.png)

## 新增資料庫支援

要在應用程式中使用資料庫，首先建立兩個端點：一個用於儲存訊息，另一個用於擷取訊息：

1. 為 `Message` 類別新增 `@Table` 註解，以宣告映射到資料庫表。在 `id` 欄位前新增 `@Id` 註解。這些註解還需要額外的引入：

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

   此查詢會從資料庫表中擷取所有 `Message` 物件的列表。

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

   這個類別包含兩個方法：
   * `post()` 用於將新的 `Message` 物件寫入資料庫
   * `findMessages()` 用於從資料庫中獲取所有訊息

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

   現在它使用 `MessageService` 來操作資料庫。

## 設定資料庫

在應用程式中設定資料庫：

1. 在 `src/main/resources` 中建立一個名為 `sql` 的新資料夾，並在其中建立 `schema.sql` 檔案。它將儲存資料庫結構描述：

   ![Create a new folder](spring-boot-sql-scheme.png){width=300}

2. 使用以下程式碼更新 `src/main/resources/sql/schema.sql` 檔案：

   ```sql
   CREATE TABLE IF NOT EXISTS messages (
     id                     VARCHAR(60)  DEFAULT RANDOM_UUID() PRIMARY KEY,
     text                   VARCHAR      NOT NULL
   );
   ```

   它會建立一個名為 `messages` 的表格，包含兩個欄位：`id` 和 `text`。表格結構與 `Message` 類別的結構相符。

3. 開啟位於 `src/main/resources` 資料夾中的 `application.properties` 檔案，並新增以下應用程式屬性：

   ```none
   spring.datasource.driver-class-name=org.h2.Driver
   spring.datasource.url=jdbc:h2:file:./data/testdb
   spring.datasource.username=sa
   spring.datasource.password=password
   spring.sql.init.schema-locations=classpath:sql/schema.sql
   spring.sql.init.mode=always
   ```

   這些設定為 Spring Boot 應用程式啟用了資料庫。
   請參閱 [Spring 文件](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-application-properties.html)中常用應用程式屬性的完整列表。

## 執行 HTTP 請求

您應該使用 HTTP 用戶端來操作先前建立的端點。在 IntelliJ IDEA 中，您可以使用[內嵌的 HTTP 用戶端](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html)：

1. 執行應用程式。一旦應用程式啟動並運行，您就可以執行 POST 請求來將訊息儲存到資料庫中。

2. 建立 `requests.http` 檔案並新增以下 HTTP 請求：

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

3. 執行所有 POST 請求。使用請求宣告旁邊裝訂線中的綠色 **Run** 圖示。
   這些請求會將文字訊息寫入資料庫。

   ![Run HTTP POST requests](spring-boot-run-http-request.png)

4. 執行 GET 請求並在 **Run** 工具視窗中查看結果：

   ![Run HTTP GET request](spring-boot-output-2.png)

### 執行請求的替代方法

您也可以使用任何其他 HTTP 用戶端或 cURL 命令列工具。例如，您可以在終端機中執行以下命令以獲得相同的結果：

```bash
curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Hello!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Bonjour!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Privet!\" }"

curl -X GET --location "http://localhost:8080"
```

## 下一步

獲取您的個人語言地圖，以幫助您導航 Kotlin 功能並追蹤您學習該語言的進度。
我們還將向您發送語言提示和有關將 Kotlin 與 Spring 搭配使用的實用材料。

<a href="https://info.jetbrains.com/kotlin-tips.html">
   <img src="get-kotlin-language-map.png" width="700" alt="Get the Kotlin language map"/>
</a>

> 您需要在下一頁分享您的電子郵件地址才能收到這些材料。
>
{style="note"}

### 參閱

有關更多教學，請查看 Spring 網站：

* [使用 Spring Boot 和 Kotlin 建置網頁應用程式](https://spring.io/guides/tutorials/spring-boot-kotlin/)
* [搭配 Kotlin Coroutines 和 RSocket 的 Spring Boot](https://spring.io/guides/tutorials/spring-webflux-kotlin-rsocket/)