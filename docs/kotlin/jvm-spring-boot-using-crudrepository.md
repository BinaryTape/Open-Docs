[//]: # (title: 使用 Spring Data CrudRepository 进行数据库访问)

<web-summary>在用 Kotlin 编写的 Spring Boot 项目中使用 Spring Data 接口。</web-summary>

<tldr>
    <p>这是<strong>Spring Boot 和 Kotlin 入门</strong>教程的最后一部分。在继续之前，请确保已完成以下步骤：</p><br/>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <a href="jvm-create-project-with-spring-boot.md">用 Kotlin 创建 Spring Boot 项目</a><br/><img src="icon-2-done.svg" width="20" alt="第二步"/> <a href="jvm-spring-boot-add-data-class.md">向 Spring Boot 项目添加数据类</a><br/><img src="icon-3-done.svg" width="20" alt="第三步"/> <a href="jvm-spring-boot-add-db-support.md">为 Spring Boot 项目添加数据库支持</a><br/><img src="icon-4.svg" width="20" alt="第四步"/> <strong>使用 Spring Data CrudRepository 进行数据库访问</strong></p>
</tldr>

在这部分中，你将迁移服务层以使用 [Spring Data](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/CrudRepository.html) 的 `CrudRepository` 而不是 `JdbcTemplate` 来进行数据库访问。
_CrudRepository_ 是一个 Spring Data 接口，用于对特定类型的仓库执行通用 [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) 操作。
它提供了几个开箱即用的方法，用于与数据库交互。

## 更新你的应用程序

首先，你需要调整 `Message` 类以配合 `CrudRepository` API 工作：

1. 向 `Message` 类添加 `@Table` 注解，以声明映射到数据库表。  
   在 `id` 字段前添加 `@Id` 注解。

    > 这些注解还需要额外的导入。
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

    此外，为了让 `Message` 类的使用更符合习惯，
    你可以将 `id` 属性的默认值设置为 null，并调换数据类属性的顺序： 

    ```kotlin
    @Table("MESSAGES")
    data class Message(val text: String, @Id val id: String? = null)
    ```
 
    现在，如果你需要创建 `Message` 类的一个新实例，你只需将 `text` 属性作为形参指定即可：

    ```kotlin
    val message = Message("Hello") // id is null
    ```

2. 声明一个接口，用于配合 `Message` 数据类使用 `CrudRepository`。创建 `MessageRepository.kt`
   文件并向其中添加以下代码：

    ```kotlin
    // MessageRepository.kt
    package com.example.demo
   
    import org.springframework.data.repository.CrudRepository
    
    interface MessageRepository : CrudRepository<Message, String>
    ```

3. 更新 `MessageService` 类。它现在将使用 `MessageRepository` 而不是执行 SQL 查询：

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
       <def title="扩展函数">
          <p><code>findByIdOrNull()</code> 函数是 Spring Data JDBC 中 <code>CrudRepository</code> 接口的<a href="extensions.md#extension-functions">扩展函数</a>。</p>
       </def>
       <def title="CrudRepository 的 save() 函数">
          <p><a href="https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#jdbc.entity-persistence">此函数基于以下假设工作</a>：新对象在数据库中没有 id。因此，id 在插入时<b>必须为 null</b>。</p>
          <p> 如果 id 不是 <i>null</i>，则 <code>CrudRepository</code> 假定对象已存在于数据库中，这是一项<i>更新</i>操作，而不是<i>插入</i>操作。插入操作后，<code>id</code> 将由数据存储生成并重新赋值给 <code>Message</code> 实例。这就是为什么 <code>id</code> 属性应该使用 <code>var</code> 关键字声明。</p>
          <p></p>
       </def>
    </deflist>

4. 更新 messages 表定义，为插入的对象生成 id。由于 `id` 是字符串，你可以使用 `RANDOM_UUID()` 函数默认生成 id 值：

    ```sql
    -- schema.sql 
    CREATE TABLE IF NOT EXISTS messages (
        id      VARCHAR(60)  DEFAULT RANDOM_UUID() PRIMARY KEY,
        text    VARCHAR      NOT NULL
    );
    ```

5. 更新位于 `src/main/resources` 文件夹中的 `application.properties` 文件中的数据库名称：

   ```none
   spring.application.name=demo
   spring.datasource.driver-class-name=org.h2.Driver
   spring.datasource.url=jdbc:h2:file:./data/testdb2
   spring.datasource.username=name
   spring.datasource.password=password
   spring.sql.init.schema-locations=classpath:schema.sql
   spring.sql.init.mode=always
   ```

以下是完整的应用程序代码：

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

## 运行应用程序

恭喜！应用程序已准备好再次运行。
在用 `JdbcTemplate` 替换 `CrudRepository` 之后，功能保持不变，因此应用程序像以前一样工作。

你现在可以从 `requests.http` 文件中[运行 POST 和 GET HTTP 请求](jvm-spring-boot-add-db-support.md#add-messages-to-database-via-http-request)并获得相同的结果。

## 下一步

获取你的个人语言地图，以帮助你了解 Kotlin 特性并追踪学习该语言的进度：

<a href="https://resources.jetbrains.com/storage/products/kotlin/docs/Kotlin_Language_Features_Map.pdf">
   <img src="get-kotlin-language-map.png" width="700" alt="获取 Kotlin 语言地图" style="block"/>
</a>

* 了解更多关于[从 Kotlin 代码调用 Java](java-interop.md) 和[从 Java 代码调用 Kotlin](java-to-kotlin-interop.md) 的信息。
* 了解如何使用 [Java 到 Kotlin 转换器](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k) 将现有 Java 代码转换为 Kotlin。
* 查看我们的 Java 到 Kotlin 迁移指南： 
  * [Java 和 Kotlin 中的字符串](java-to-kotlin-idioms-strings.md)。
  * [Java 和 Kotlin 中的集合](java-to-kotlin-collections-guide.md)。
  * [Java 和 Kotlin 中的可空性](java-to-kotlin-nullability-guide.md)。