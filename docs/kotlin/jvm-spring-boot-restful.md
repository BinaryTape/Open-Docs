---
title: "使用 Spring Boot 创建带有数据库的 RESTful Web 服务 – 教程"
---
本教程将引导你使用 Spring Boot 创建一个简单的应用程序，并添加一个数据库来存储信息。

在本教程中，你将：
* 创建一个具有 HTTP 端点的应用程序
* 学习如何以 JSON 格式返回数据对象列表
* 创建一个用于存储对象的数据库
* 使用端点写入和检索数据库对象

你可以下载并探索[已完成的项目](https://github.com/kotlin-hands-on/spring-time-in-kotlin-episode1)，或者观看本教程的视频：

<video width="560" height="315" href="gf-kjD2ZmZk" title="Spring Time in Kotlin. Getting Started"/>

## 开始之前

下载并安装最新版本的 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html)。

## 引导项目

使用 Spring Initializr 创建一个新项目：

:::note
你也可以使用[带有 Spring Boot 插件的 IntelliJ IDEA](https://www.jetbrains.com/help/idea/spring-boot.html) 创建一个新项目

:::

1. 打开 [Spring Initializr](https://start.spring.io/#!type=gradle-project&language=kotlin&platformVersion=2.7.3&packaging=jar&jvmVersion=11&groupId=com.example&artifactId=demo&name=demo&description=Demo%20project%20for%20Spring%20Boot&packageName=demo&dependencies=web,data-jdbc,h2)。此链接将打开一个页面，其中已填充了本教程的项目设置。
此项目使用 **Gradle**、**Kotlin**、**Spring Web**、**Spring Data JDBC** 和 **H2 Database**：

   <img src="/img/spring-boot-create-project-with-initializr.png" alt="Create a new project with Spring Initializr" width="800" style={{verticalAlign: 'middle'}}/>

2. 点击屏幕底部的 **GENERATE**。Spring Initializr 将使用指定的设置生成项目。下载会自动开始。

3. 解压 **.zip** 文件并在 IntelliJ IDEA 中打开它。

   该项目具有以下结构：
   <img src="/img/spring-boot-project-structure.png" alt="The Spring Boot project structure" width="350" style={{verticalAlign: 'middle'}}/>
 
   在 `main/kotlin` 文件夹下有一些属于应用程序的包和类。 应用程序的入口点是 `DemoApplication.kt` 文件的 `main()` 方法。

## 探索项目构建文件

打开 `build.gradle.kts` 文件。

这是 Gradle Kotlin 构建脚本，其中包含应用程序所需的依赖项列表。

Gradle 文件是 Spring Boot 的标准文件，但它也包含必要的 Kotlin 依赖项，包括 [kotlin-spring](all-open-plugin#spring-support) Gradle 插件。

## 探索 Spring Boot 应用程序

打开 `DemoApplication.kt` 文件：

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

请注意，Kotlin 应用程序文件与 Java 应用程序文件不同：
* 虽然 Spring Boot 查找公共静态 `main()` 方法，但 Kotlin 应用程序使用在 `DemoApplication` 类之外定义的[顶级函数](functions#function-scope)。
* `DemoApplication` 类未声明为 `open`，因为 [kotlin-spring](all-open-plugin#spring-support) 插件会自动执行此操作。

## 创建数据类和控制器

要创建端点，请向你的项目添加一个[数据类](data-classes)和一个控制器：

1. 在 `DemoApplication.kt` 文件中，创建一个具有两个属性 `id` 和 `text` 的 `Message` 数据类：

   ```kotlin
   data class Message(val id: String?, val text: String)
   ```

2. 在同一文件中，创建一个 `MessageResource` 类，该类将处理请求并返回包含 `Message` 对象集合的 JSON 文档：

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

`DemoApplication.kt` 的完整代码：

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

## 运行应用程序

应用程序现在可以运行了：

1. 点击 `main()` 方法旁边的装订线中的绿色 **Run** 图标，或使用 **Alt+Enter** 快捷键来调用 IntelliJ IDEA 中的启动菜单：

   <img src="/img/spring-boot-run-the-application.png" alt="Run the application" width="800" style={{verticalAlign: 'middle'}}/>

   > 你也可以在终端中运行 `./gradlew bootRun` 命令。
   >
   

2. 应用程序启动后，打开以下 URL：[http://localhost:8080](http://localhost:8080)。

   你将看到一个页面，其中包含 JSON 格式的消息集合：

   <img src="/img/spring-boot-output.png" alt="Application output" style={{verticalAlign: 'middle'}}/>

## 添加数据库支持

要在应用程序中使用数据库，首先创建两个端点：一个用于保存消息，另一个用于检索消息：

1. 将 `@Table` 注解添加到 `Message` 类，以声明到数据库表的映射。 在 `id` 字段之前添加 `@Id` 注解。 这些注解还需要额外的导入：

   ```kotlin
   import org.springframework.data.annotation.Id
   import org.springframework.data.relational.core.mapping.Table
  
   @Table("MESSAGES")
   data class Message(@Id val id: String?, val text: String)
   ```

2. 使用 [Spring Data Repository API](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/CrudRepository.html) 访问数据库：

   ```kotlin
   import org.springframework.data.jdbc.repository.query.Query
   import org.springframework.data.repository.CrudRepository
  
   interface MessageRepository : CrudRepository<Message, String>{
  
       @Query("select * from messages")
       fun findMessages(): List<Message>
   }
   ```

   当你在 `MessageRepository` 的实例上调用 `findMessages()` 方法时，它将执行相应的数据库查询：

   ```sql
   select * from messages
   ```

   此查询检索数据库表中所有 `Message` 对象的列表。

3. 创建 `MessageService` 类：

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

   此类包含两个方法：
   * `post()` 用于将新的 `Message` 对象写入数据库
   * `findMessages()` 用于从数据库获取所有消息

4. 更新 `MessageResource` 类：

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

   现在它使用 `MessageService` 来处理数据库。

## 配置数据库

在应用程序中配置数据库：

1. 在 `src/main/resources` 中创建一个名为 `sql` 的新文件夹，并在其中创建一个 `schema.sql` 文件。 它将存储数据库模式：

   <img src="/img/spring-boot-sql-scheme.png" alt="Create a new folder" width="300" style={{verticalAlign: 'middle'}}/>

2. 使用以下代码更新 `src/main/resources/sql/schema.sql` 文件：

   ```sql
   CREATE TABLE IF NOT EXISTS messages (
     id                     VARCHAR(60)  DEFAULT RANDOM_UUID() PRIMARY KEY,
     text                   VARCHAR      NOT NULL
   );
   ```

   它创建具有两个字段 `id` 和 `text` 的 `messages` 表。 表结构与 `Message` 类的结构匹配。

3. 打开位于 `src/main/resources` 文件夹中的 `application.properties` 文件，并添加以下应用程序属性：

   ```none
   spring.datasource.driver-class-name=org.h2.Driver
   spring.datasource.url=jdbc:h2:file:./data/testdb
   spring.datasource.username=sa
   spring.datasource.password=password
   spring.sql.init.schema-locations=classpath:sql/schema.sql
   spring.sql.init.mode=always
   ```

   这些设置启用了 Spring Boot 应用程序的数据库。
   有关常见应用程序属性的完整列表，请参阅 [Spring 文档](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-application-properties.html)。

## 执行 HTTP 请求

你应该使用 HTTP 客户端来处理先前创建的端点。 在 IntelliJ IDEA 中，你可以使用嵌入式 [HTTP 客户端](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html)：

1. 运行应用程序。 应用程序启动并运行后，你可以执行 POST 请求以将消息存储在数据库中。

2. 创建 `requests.http` 文件并添加以下 HTTP 请求：

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

3. 执行所有 POST 请求。 使用请求声明旁边装订线中的绿色 **Run** 图标。
   这些请求将文本消息写入数据库。

   <img src="/img/spring-boot-run-http-request.png" alt="Run HTTP POST requests" style={{verticalAlign: 'middle'}}/>

4. 执行 GET 请求并在 **Run** 工具窗口中查看结果：

   <img src="/img/spring-boot-output-2.png" alt="Run HTTP GET request" style={{verticalAlign: 'middle'}}/>

### 执行请求的替代方法

你也可以使用任何其他 HTTP 客户端或 cURL 命令行工具。 例如，你可以在终端中运行以下命令以获得相同的结果：

```bash
curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Hello!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Bonjour!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Privet!\" }"

curl -X GET --location "http://localhost:8080"
```

## 下一步

获取你的个人语言地图，以帮助你浏览 Kotlin 功能并跟踪你学习该语言的进度。 我们还将向你发送语言技巧和有关将 Kotlin 与 Spring 一起使用的有用资料。

<a href="https://info.jetbrains.com/kotlin-tips.html">
   <img src="/img/get-kotlin-language-map.png" width="700" alt="Get the Kotlin language map"/>
</a>
:::note
你需要在下一页分享你的电子邮件地址才能收到这些材料。

:::

### 参见

有关更多教程，请查看 Spring 网站：

* [使用 Spring Boot 和 Kotlin 构建 Web 应用程序](https://spring.io/guides/tutorials/spring-boot-kotlin/)
* [带有 Kotlin 协程和 RSocket 的 Spring Boot](https://spring.io/guides/tutorials/spring-webflux-kotlin-rsocket/)

  ```