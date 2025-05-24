---
title: "为 Spring Boot 项目添加数据库支持"
description: "使用 JDBC 模板为 Kotlin 编写的 Spring Boot 项目添加数据库支持。"
---
:::info
<p>
   这是 <strong>Spring Boot 和 Kotlin 入门</strong>教程的第三部分。在继续之前，请确保你已完成之前的步骤：
</p><br/>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot">使用 Kotlin 创建一个 Spring Boot 项目</a><br/><img src="/img/icon-2-done.svg" width="20" alt="Second step"/> <a href="jvm-spring-boot-add-data-class">向 Spring Boot 项目添加数据类</a><br/><img src="/img/icon-3.svg" width="20" alt="Third step"/> <strong>为 Spring Boot 项目添加数据库支持</strong><br/><img src="/img/icon-4-todo.svg" width="20" alt="Fourth step"/> 使用 Spring Data CrudRepository 进行数据库访问
</p>

:::

在本教程的这一部分，你将使用 JDBC 向你的项目添加和配置一个数据库。在 JVM 应用程序中，你使用 JDBC 与数据库进行交互。
为了方便起见，Spring Framework 提供了 `JdbcTemplate` 类，该类简化了 JDBC 的使用并有助于避免常见错误。

## 添加数据库支持

在基于 Spring Framework 的应用程序中，常见的做法是在所谓的 _service_ 层中实现数据库访问逻辑——这是业务逻辑所在的地方。
在 Spring 中，你应该使用 `@Service` 注解标记类，以表明该类属于应用程序的 service 层。
在本应用程序中，你将为此目的创建 `MessageService` 类。

在同一个包中，创建 `MessageService.kt` 文件和 `MessageService` 类，如下所示：

```kotlin
// MessageService.kt
package demo

import org.springframework.stereotype.Service
import org.springframework.jdbc.core.JdbcTemplate
import java.util.*

@Service
class MessageService(private val db: JdbcTemplate) {
    fun findMessages(): List<Message> = db.query("select * from messages") { response, _ `->`
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
<h3>构造函数参数和依赖注入 – (private val db: JdbcTemplate)</h3>
<p>
   Kotlin 中的类有一个主构造函数（primary constructor）。它也可以有一个或多个 <a href="classes#secondary-constructors">二级构造函数（secondary constructor）</a>。
      <i>主构造函数</i> 是类头的一部分，它位于类名和可选的类型参数之后。在我们的例子中，构造函数是 `(val db: JdbcTemplate)`。
</p>
<p>
   `val db: JdbcTemplate` 是构造函数的参数：
</p>
      ```kotlin
@Service
      class MessageService(private val db: JdbcTemplate)
```
<h3>尾随 Lambda（Trailing lambda）和 SAM 转换</h3>
<p>
   `findMessages()` 函数调用 `JdbcTemplate` 类的 `query()` 函数。`query()` 函数接受两个参数：一个 SQL 查询字符串实例，以及一个回调，该回调将映射每行一个对象：
</p>
      ```sql
db.query("...", RowMapper { ... } )
```<br/>
<p>
   `RowMapper` 接口只声明了一个方法，因此可以通过 lambda 表达式来实现它，省略接口的名称。Kotlin 编译器知道 lambda 表达式需要转换为哪个接口，因为你将其用作函数调用的参数。这被称为 <a href="java-interop#sam-conversions">Kotlin 中的 SAM 转换</a>：
</p>
      ```sql
db.query("...", { ... } )
```<br/>
<p>
   在 SAM 转换之后，query 函数最终得到两个参数：第一个位置是一个字符串，最后一个位置是一个 lambda 表达式。根据 Kotlin 的约定，如果函数的最后一个参数是一个函数，那么作为相应参数传递的 lambda 表达式可以放在圆括号之外。这种语法也称为<a href="lambdas#passing-trailing-lambdas">尾随 Lambda（trailing lambda）</a>：
</p>
      ```sql
db.query("...") { ... }
```
<h3>未使用 Lambda 参数的下划线</h3>
<p>
   对于具有多个参数的 lambda 表达式，你可以使用下划线 `_` 字符来替换你不使用的参数的名称。
</p>
<p>
   因此，query 函数调用的最终语法如下所示：
</p>
      ```kotlin
db.query("select * from messages") { response, _ `-&gt;`
          Message(response.getString("id"), response.getString("text"))
      }
```
   

## 更新 MessageController 类

更新 `MessageController.kt` 以使用新的 `MessageService` 类：

```kotlin
// MessageController.kt
package demo

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
<h3>@PostMapping 注解</h3>
<p>
   负责处理 HTTP POST 请求的方法需要使用 `@PostMapping` 注解进行注解。为了能够将作为 HTTP Body 内容发送的 JSON 转换为对象，你需要为方法参数使用 `@RequestBody` 注解。由于应用程序的 classpath 中有 Jackson 库，因此转换会自动发生。
</p>
<h3>ResponseEntity</h3>
<p>
   `ResponseEntity` 表示整个 HTTP 响应：状态码、标头和正文。
</p>
<p>
   使用 `created()` 方法，你可以配置响应状态码 (201) 并设置 location 标头，指示已创建资源的上下文路径。
</p>
   

## 更新 MessageService 类

`Message` 类的 `id` 被声明为一个可空的字符串（nullable String）：

```kotlin
data class Message(val id: String?, val text: String)
```

但是，将 `null` 作为 `id` 值存储在数据库中是不正确的：你需要妥善处理这种情况。

更新 `MessageService.kt` 文件的代码，以便在数据库中存储消息时，当 `id` 为 `null` 时生成一个新值：

```kotlin
// MessageService.kt
package demo

import org.springframework.stereotype.Service
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.query
import java.util.UUID

@Service
class MessageService(private val db: JdbcTemplate) {
    fun findMessages(): List<Message> = db.query("select * from messages") { response, _ `->`
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
<h3>Elvis 运算符 – ?:</h3>
<p>
   代码 `message.id ?: UUID.randomUUID().toString()` 使用 <a href="null-safety#elvis-operator">Elvis 运算符（if-not-null-else 简写）`?:`</a>。如果 `?:` 左侧的表达式不是 `null`，则 Elvis 运算符返回它；否则，它返回右侧的表达式。请注意，只有当左侧为 `null` 时，才会计算右侧的表达式。
</p>
   

应用程序代码已准备好与数据库一起使用。现在需要配置数据源。

## 配置数据库

在应用程序中配置数据库：

1. 在 `src/main/resources` 目录中创建 `schema.sql` 文件。它将存储数据库对象定义：

   <img src="/img/create-database-schema.png" alt="Create database schema" width="400" style={{verticalAlign: 'middle'}}/>

2. 使用以下代码更新 `src/main/resources/schema.sql` 文件：

   ```sql
   -- schema.sql
   CREATE TABLE IF NOT EXISTS messages (
   id       VARCHAR(60)  PRIMARY KEY,
   text     VARCHAR      NOT NULL
   );
   ```

   它创建了一个包含两列的 `messages` 表：`id` 和 `text`。表结构与 `Message` 类的结构相匹配。

3. 打开位于 `src/main/resources` 文件夹中的 `application.properties` 文件，并添加以下应用程序属性：

   ```none
   spring.application.name=demo
   spring.datasource.driver-class-name=org.h2.Driver
   spring.datasource.url=jdbc:h2:file:./data/testdb
   spring.datasource.username=name
   spring.datasource.password=password
   spring.sql.init.schema-locations=classpath:schema.sql
   spring.sql.init.mode=always
   ```

   这些设置启用了 Spring Boot 应用程序的数据库。  
   请参阅 [Spring 文档](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-application-properties.html) 中常见应用程序属性的完整列表。

## 通过 HTTP 请求向数据库添加消息

你应该使用 HTTP 客户端来处理先前创建的端点。在 IntelliJ IDEA 中，使用嵌入式 HTTP 客户端：

1. 运行应用程序。一旦应用程序启动并运行，你就可以执行 POST 请求以将消息存储在数据库中。

2. 在项目根文件夹中创建 `requests.http` 文件，并添加以下 HTTP 请求：

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

3. 执行所有 POST 请求。使用请求声明旁边装订线中的绿色 **Run** 图标。
   这些请求将文本消息写入数据库：

   <img src="/img/execute-post-requests.png" alt="Execute POST request" style={{verticalAlign: 'middle'}}/>

4. 执行 GET 请求并在 **Run** 工具窗口中查看结果：

   <img src="/img/execute-get-requests.png" alt="Execute GET requests" style={{verticalAlign: 'middle'}}/>

### 执行请求的替代方法

你也可以使用任何其他 HTTP 客户端或 cURL 命令行工具。例如，在终端中运行以下命令以获得相同的结果：

```bash
curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Hello!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Bonjour!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Privet!\" }"

curl -X GET --location "http://localhost:8080"
```

## 按 ID 检索消息

扩展应用程序的功能以按 ID 检索单个消息。

1. 在 `MessageService` 类中，添加新的函数 `findMessageById(id: String)` 以按 ID 检索单个消息：

    ```kotlin
    // MessageService.kt
    package demo

    import org.springframework.stereotype.Service
    import org.springframework.jdbc.core.JdbcTemplate
    import org.springframework.jdbc.core.query
    import java.util.*
    
    @Service
    class MessageService(private val db: JdbcTemplate) {
    
        fun findMessages(): List<Message> = db.query("select * from messages") { response, _ `->`
            Message(response.getString("id"), response.getString("text"))
        }
    
        fun findMessageById(id: String): Message? = db.query("select * from messages where id = ?", id) { response, _ `->`
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
   
    > 用于通过其 ID 获取消息的 `.query()` 函数是由 Spring Framework 提供的 [Kotlin 扩展函数](extensions#extension-functions)。
    > 它需要额外的导入 `import org.springframework.jdbc.core.query`，如上面的代码所示。
    >
    

2. 将带有 `id` 参数的新 `index(...)` 函数添加到 `MessageController` 类：

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
<h3>从上下文路径检索值</h3>
<p>
   当你使用 `@GetMapping("/{id}")` 注解新函数时，Spring Framework 会从上下文路径检索消息 `id`。通过使用 `@PathVariable` 注解函数参数，你告诉框架使用检索到的值作为函数参数。新函数调用 `MessageService` 以按其 ID 检索单个消息。
</p>
<h3>参数列表中的 vararg 参数位置</h3>
<p>
   `query()` 函数接受三个参数：
</p>
<list>
<li>需要参数才能运行的 SQL 查询字符串</li>
<li>`id`，它是 String 类型的参数</li>
<li>`RowMapper` 实例由 lambda 表达式实现</li>
</list>
<p>
   `query()` 函数的第二个参数被声明为<i>可变参数</i> (`vararg`)。在 Kotlin 中，可变参数的位置不需要是参数列表中的最后一个。
</p>
<h3>带有可空接收器的扩展函数</h3>
<p>
   可以使用可空接收器类型定义扩展。如果接收器为 `null`，则 `this` 也为 `null`。因此，在定义带有可空接收器类型的扩展时，建议在函数体中执行 `this == null` 检查。
</p>
<p>
   你还可以使用空安全调用运算符 (`?.`) 来执行空检查，如上面的 `toResponseBody` 函数中所示：
</p>
         ```kotlin
this?.let { ResponseEntity.ok(it) }
```
<h3>ResponseEntity</h3>
<p>
   `ResponseEntity` 表示 HTTP 响应，包括状态码、标头和正文。它是一个通用包装器，允许你将自定义的 HTTP 响应发送回客户端，并对内容进行更多控制。
</p>
    
    

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

data class Message(val id: String?, val text: String)
```

```kotlin
// MessageService.kt
package demo

import org.springframework.stereotype.Service
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.query
import java.util.*

@Service
class MessageService(private val db: JdbcTemplate) {
    fun findMessages(): List<Message> = db.query("select * from messages") { response, _ `->`
        Message(response.getString("id"), response.getString("text"))
    }

    fun findMessageById(id: String): Message? = db.query("select * from messages where id = ?", id) { response, _ `->`
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
        this?.let { ResponseEntity.ok(it) } ?: ResponseEntity.notFound().build()
}
```

## 运行应用程序

Spring 应用程序已准备好运行：

1. 再次运行应用程序。

2. 打开 `requests.http` 文件并添加新的 GET 请求：

    ```http request
    ### Get the message by its id
    GET http://localhost:8080/id
    ```

3. 执行 GET 请求以从数据库检索所有消息。

4. 在 **Run** 工具窗口中，复制其中一个 ID 并将其添加到请求中，如下所示：

    ```http request
    ### Get the message by its id
    GET http://localhost:8080/f16c1d2e-08dc-455c-abfe-68440229b84f
    ```
    
    > 请用你的消息 ID 替换上面提到的 ID。
    >
    

5. 执行 GET 请求并在 **Run** 工具窗口中查看结果：

    <img src="/img/retrieve-message-by-its-id.png" alt="Retrieve message by its id" width="706" style={{verticalAlign: 'middle'}}/>

## 下一步

最后一步向你展示了如何使用 Spring Data 连接到更流行的数据库。

**[前往下一章](jvm-spring-boot-using-crudrepository)**