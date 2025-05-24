---
title: "使用 Spring Data CrudRepository 进行数据库访问"
description: "在用 Kotlin 编写的 Spring Boot 项目中使用 Spring Data 接口。"
---
:::info
<p>
   这是 <strong>Spring Boot 与 Kotlin 入门</strong>教程的最后一部分。在继续之前，请确保您已完成之前的步骤：
</p><br/>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot">使用 Kotlin 创建一个 Spring Boot 项目</a><br/><img src="/img/icon-2-done.svg" width="20" alt="Second step"/> <a href="jvm-spring-boot-add-data-class">向 Spring Boot 项目添加一个数据类</a><br/><img src="/img/icon-3-done.svg" width="20" alt="Third step"/> <a href="jvm-spring-boot-add-db-support">为 Spring Boot 项目添加数据库支持</a><br/><img src="/img/icon-4.svg" width="20" alt="Fourth step"/> <strong>使用 Spring Data CrudRepository 进行数据库访问</strong>
</p>

:::

在这一部分，您将迁移服务层，使用 [Spring Data](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/CrudRepository.html) 的 `CrudRepository` 替代 `JdbcTemplate` 进行数据库访问。
_CrudRepository_ 是 Spring Data 的一个接口，用于对特定类型的存储库执行通用的 [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) 操作。
它开箱即用地提供了几个与数据库交互的方法。

## 更新您的应用程序

首先，您需要调整 `Message` 类以使用 `CrudRepository` API：

1. 将 `@Table` 注解添加到 `Message` 类以声明到数据库表的映射。
   在 `id` 字段前添加 `@Id` 注解。

    > 这些注解也需要额外的导入。
    >  
    

    ```kotlin
    // Message.kt
    package demo
   
    import org.springframework.data.annotation.Id
    import org.springframework.data.relational.core.mapping.Table
    
    @Table("MESSAGES")
    data class Message(@Id val id: String?, val text: String)
    ```

    此外，为了使 `Message` 类的使用更加符合习惯，
    您可以将 `id` 属性的默认值设置为 null，并翻转数据类属性的顺序：

    ```kotlin
    @Table("MESSAGES")
    data class Message(val text: String, @Id val id: String? = null)
    ```
 
    现在，如果您需要创建一个新的 `Message` 类实例，您可以只指定 `text` 属性作为参数：

    ```kotlin
    val message = Message("Hello") // id is null
    ```

2. 声明一个 `CrudRepository` 的接口，它将与 `Message` 数据类一起使用。创建 `MessageRepository.kt`
   文件，并将以下代码添加到其中：

    ```kotlin
    // MessageRepository.kt
    package demo
   
    import org.springframework.data.repository.CrudRepository
    
    interface MessageRepository : CrudRepository<Message, String>
    ```

3. 更新 `MessageService` 类。它现在将使用 `MessageRepository` 而不是执行 SQL 查询：

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
<h3>扩展函数（Extension functions）</h3>
<p>
   `findByIdOrNull()` 函数是 Spring Data JDBC 中 `CrudRepository` 接口的 <a href="extensions#extension-functions">扩展函数</a>。
</p>
<h3>CrudRepository save() 函数</h3>
<p>
   <a href="https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#jdbc.entity-persistence">此函数的工作方式是</a> 假定新对象在数据库中没有 id。因此，对于插入操作，id <b>应为 null</b>。
</p>
<p>
   如果 id 不是 <i>null</i>，`CrudRepository` 会假定该对象已存在于数据库中，这是一个<i>更新</i>操作，而不是<i>插入</i>操作。在插入操作之后，`id` 将由数据存储生成并分配回 `Message` 实例。这就是为什么应该使用 `var` 关键字声明 `id` 属性的原因。
</p>
<p>
</p>
       
    

4. 更新消息表定义，以便为插入的对象生成 id。由于 `id` 是一个字符串，因此可以使用 `RANDOM_UUID()` 函数默认生成 id 值：

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

这是应用程序的完整代码：

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

## 运行应用程序

应用程序已准备好再次运行。
通过用 `CrudRepository` 替换 `JdbcTemplate`，功能没有改变，因此应用程序应该以与之前相同的方式工作。

## 接下来做什么

获取您的个人语言地图，以帮助您浏览 Kotlin 功能并跟踪您学习该语言的进度：

<a href="https://resources.jetbrains.com/storage/products/kotlin/docs/Kotlin_Language_Features_Map.pdf">
   <img src="/img/get-kotlin-language-map.png" width="700" alt="Get the Kotlin language map" />
</a>

* 了解更多关于 [从 Kotlin 代码调用 Java](java-interop) 和 [从 Java 代码调用 Kotlin](java-to-kotlin-interop) 的信息。
* 了解如何使用 [Java-to-Kotlin 转换器](mixing-java-kotlin-intellij#converting-an-existing-java-file-to-kotlin-with-j2k) 将现有的 Java 代码转换为 Kotlin。
* 查看我们的 Java 到 Kotlin 迁移指南：
  * [Java 和 Kotlin 中的字符串](java-to-kotlin-idioms-strings)。
  * [Java 和 Kotlin 中的集合](java-to-kotlin-collections-guide)。
  * [Java 和 Kotlin 中的可空性](java-to-kotlin-nullability-guide)。

  ```