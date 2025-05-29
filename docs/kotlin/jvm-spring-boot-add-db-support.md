[//]: # (title: 为 Spring Boot 项目添加数据库支持)
[//]: # (description: 使用 JDBC 模板为 Kotlin 编写的 Spring Boot 项目添加数据库支持。)

<tldr>
    <p>这是 **Spring Boot 和 Kotlin 入门** 教程的第三部分。在继续之前，请确保已完成以下步骤：</p><br/>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <a href="jvm-create-project-with-spring-boot.md">使用 Kotlin 创建 Spring Boot 项目</a><br/><img src="icon-2-done.svg" width="20" alt="第二步"/> <a href="jvm-spring-boot-add-data-class.md">向 Spring Boot 项目添加数据类</a><br/><img src="icon-3.svg" width="20" alt="第三步"/> <strong>为 Spring Boot 项目添加数据库支持</strong><br/><img src="icon-4-todo.svg" width="20" alt="第四步"/> 使用 Spring Data CrudRepository 进行数据库访问</p>
</tldr>

在本教程的这一部分，你将使用 _Java 数据库连接_ (JDBC) 为你的项目添加和配置数据库。
在 JVM 应用程序中，你使用 JDBC 与数据库进行交互。
为方便起见，Spring Framework 提供了 `JdbcTemplate` 类，它简化了 JDBC 的使用并有助于避免常见错误。

## 添加数据库支持

在基于 Spring Framework 的应用程序中，通常的做法是在所谓的 _服务_ 层实现数据库访问逻辑——业务逻辑就驻留在此处。
在 Spring 中，你应该使用 `@Service` 注解来标记类，以表明该类属于应用程序的服务层。
在此应用程序中，你将为此目的创建 `MessageService` 类。

在同一个包中，创建 `MessageService.kt` 文件和 `MessageService` 类，如下所示：

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
   <def title="构造函数参数和依赖注入 – (private val db: JdbcTemplate)">
      <p>Kotlin 中的类有一个主构造函数。它也可以有一个或多个<a href="classes.md#secondary-constructors">次构造函数</a>。
      _主构造函数_ 是类头的一部分，它位于类名和可选类型参数之后。在我们的例子中，构造函数是 <code>(val db: JdbcTemplate)</code>。</p>
      <p><code>val db: JdbcTemplate</code> 是构造函数的参数：</p>
      <code-block lang="kotlin">
      @Service
      class MessageService(private val db: JdbcTemplate)
      </code-block>
  </def>
   <def title="尾随 lambda 表达式和 SAM 转换">
      <p><code>findMessages()</code> 函数调用 <code>JdbcTemplate</code> 类的 <code>query()</code> 函数。<code>query()</code> 函数接受两个参数：一个作为 String 实例的 SQL 查询，以及一个将每行映射为一个对象的回调：</p>
      <code-block lang="sql">
      db.query("...", RowMapper { ... } )
      </code-block><br/>
      <p><code>RowMapper</code> 接口只声明了一个方法，因此可以通过省略接口名称的 lambda 表达式来实现它。Kotlin 编译器知道 lambda 表达式需要转换成的接口，因为你将其用作函数调用的参数。这在 Kotlin 中被称为 <a href="java-interop.md#sam-conversions">SAM 转换</a>：</p>
      <code-block lang="sql">
      db.query("...", { ... } )
      </code-block><br/>
      <p>经过 SAM 转换后，query 函数最终会有两个参数：第一个位置是 String，最后一个位置是 lambda 表达式。根据 Kotlin 约定，如果函数的最后一个参数是函数类型，那么作为相应参数传递的 lambda 表达式可以放在括号外面。这种语法也称为 <a href="lambdas.md#passing-trailing-lambdas">尾随 lambda 表达式</a>：</p>
      <code-block lang="sql">
      db.query("...") { ... }
      </code-block>
   </def>
   <def title="未使用的 lambda 参数的下划线">
      <p>对于具有多个参数的 lambda 表达式，你可以使用下划线 <code>_</code> 字符来替换你未使用的参数的名称。</p>
      <p>因此，查询函数调用的最终语法如下：</p>
      <code-block lang="kotlin">
      db.query("select * from messages") { response, _ ->
          Message(response.getString("id"), response.getString("text"))
      }
      </code-block>
   </def>
</deflist>

## 更新 MessageController 类

更新 `MessageController.kt` 以使用新的 `MessageService` 类：

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
   <def title="@PostMapping 注解">
      <p>负责处理 HTTP POST 请求的方法需要用 <code>@PostMapping</code> 注解进行标注。为了能够将作为 HTTP 请求体内容发送的 JSON 转换为对象，你需要为方法参数使用 <code>@RequestBody</code> 注解。由于应用程序的类路径中包含 Jackson 库，转换会自动发生。</p>
   </def>
   <def title="ResponseEntity">
      <p><code>ResponseEntity</code> 表示整个 HTTP 响应：状态码、头部和响应体。</p>
      <p> 使用 <code>created()</code> 方法可以配置响应状态码 (201) 并设置 Location 头部，指示所创建资源的上下文路径。</p>
   </def>
</deflist>

## 更新 MessageService 类

`Message` 类的 `id` 被声明为一个可空字符串：

```kotlin
data class Message(val id: String?, val text: String)
```

但是，将 `null` 作为 `id` 值存储在数据库中是不正确的：你需要优雅地处理这种情况。

更新 `MessageService.kt` 文件中的代码，以便在将消息存储到数据库时，如果 `id` 为 `null` 则生成一个新值：

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
   <def title="Elvis 运算符 – ?:">
      <p>代码 <code>message.id ?: UUID.randomUUID().toString()</code> 使用了 <a href="null-safety.md#elvis-operator">Elvis 运算符 (if-not-null-else 简写) <code>?:</code></a>。如果 <code>?:</code> 左侧的表达式不是 <code>null</code>，Elvis 运算符会返回它；否则，它会返回右侧的表达式。请注意，右侧的表达式仅在左侧表达式为 <code>null</code> 时才进行求值。</p>
   </def>
</deflist>

应用程序代码已准备好与数据库一起工作。现在需要配置数据源。

## 配置数据库

在应用程序中配置数据库：

1. 在 `src/main/resources` 目录下创建 `schema.sql` 文件。它将存储数据库对象定义：

   ![创建数据库模式](create-database-schema.png){width=400}

2. 使用以下代码更新 `src/main/resources/schema.sql` 文件：

   ```sql
   -- schema.sql
   CREATE TABLE IF NOT EXISTS messages (
   id       VARCHAR(60)  PRIMARY KEY,
   text     VARCHAR      NOT NULL
   );
   ```

   它创建了一个名为 `messages` 的表，包含两列：`id` 和 `text`。表结构与 `Message` 类的结构匹配。

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

   这些设置使 Spring Boot 应用程序能够使用数据库。
   请参阅 [Spring 文档](https://docs.spring.io/spring-boot/docs/current/reference/html/appendix-application-properties.html) 中列出的所有常用应用程序属性。

## 通过 HTTP 请求向数据库添加消息

你应该使用 HTTP 客户端来处理之前创建的端点。在 IntelliJ IDEA 中，使用嵌入式 HTTP 客户端：

1. 运行应用程序。一旦应用程序启动并运行，你就可以执行 POST 请求将消息存储到数据库中。

2. 在项目根文件夹中创建 `requests.http` 文件并添加以下 HTTP 请求：

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

3. 执行所有 POST 请求。使用请求声明旁边的绿色 **运行** 图标。
   这些请求将文本消息写入数据库：

   ![执行 POST 请求](execute-post-requests.png)

4. 执行 GET 请求并在 **运行** 工具窗口中查看结果：

   ![执行 GET 请求](execute-get-requests.png)

### 执行请求的替代方式 {initial-collapse-state="collapsed" collapsible="true"}

你也可以使用任何其他 HTTP 客户端或 cURL 命令行工具。例如，在终端中运行以下命令以获得相同的结果：

```bash
curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Hello!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Bonjour!\" }"

curl -X POST --location "http://localhost:8080" -H "Content-Type: application/json" -d "{ \"text\": \"Privet!\" }"

curl -X GET --location "http://localhost:8080"
```

## 通过 ID 检索消息

扩展应用程序的功能，以便通过 ID 检索单个消息。

1. 在 `MessageService` 类中，添加新函数 `findMessageById(id: String)` 以通过 ID 检索单个消息：

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
    <def title="参数列表中的 vararg 参数位置">
        <p><code>query()</code> 函数接受三个参数：</p>
        <list>
            <li>运行需要参数的 SQL 查询字符串</li>
            <li><code>id</code>，一个 String 类型的参数</li>
            <li>由 lambda 表达式实现的 <code>RowMapper</code> 实例</li>
        </list>
        <p><code>query()</code> 函数的第二个参数被声明为 _可变参数_ (<code>vararg</code>)。在 Kotlin 中，可变参数在参数列表中的位置不要求是最后一个。</p>
    </def>
    <def title="singleOrNull() 函数">
       <p><a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/single-or-null.html"><code>singleOrNull()</code></a> 函数返回一个单个元素，如果数组为空或有多个具有相同值的元素，则返回 <code>null</code>。</p>
    </def>
   </deflist>
    
    > 用于通过 ID 获取消息的 `.query()` 函数是 Spring Framework 提供的 [Kotlin 扩展函数](extensions.md#extension-functions)。它需要额外的导入 `import org.springframework.jdbc.core.query`，如上面的代码所示。
    >
    {style="warning"}

2. 在 `MessageController` 类中添加带有 `id` 参数的新函数 `getMessage(...)`：

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
    <def title="从上下文路径中检索值">
       <p>消息 <code>id</code> 由 Spring Framework 从上下文路径中检索，因为你使用 <code>@GetMapping(&quot;/{id}&quot;)</code> 注解了新函数。通过使用 <code>@PathVariable</code> 注解函数参数，你告诉框架将检索到的值用作函数参数。新函数调用 <code>MessageService</code> 以通过其 ID 检索单个消息。</p>
    </def>
    <def title="带可空接收者的扩展函数">
         <p>扩展可以定义为可空接收者类型。如果接收者为 <code>null</code>，那么 <code>this</code> 也为 <code>null</code>。因此，在定义可空接收者类型的扩展时，建议在函数体内部执行 <code>this == null</code> 检查。</p>
         <p>你也可以使用空安全调用运算符 (<code>?.</code>) 来执行空检查，如上面的 <code>toResponseEntity()</code> 函数所示：</p>
         <code-block lang="kotlin">
         this?.let { ResponseEntity.ok(it) }
         </code-block>
    </def>
    <def title="ResponseEntity">
        <p><code>ResponseEntity</code> 表示 HTTP 响应，包括状态码、头部和响应体。它是一个通用包装器，允许你向客户端发送自定义的 HTTP 响应，并对内容有更多的控制。</p>
    </def>
    </deflist>

以下是应用程序的完整代码：

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

## 运行应用程序

Spring 应用程序已准备好运行：

1. 再次运行应用程序。

2. 打开 `requests.http` 文件并添加新的 GET 请求：

    ```http request
    ### Get the message by its id
    GET http://localhost:8080/id
    ```

3. 执行 GET 请求以从数据库中检索所有消息。

4. 在 **运行** 工具窗口中复制一个 ID，并将其添加到请求中，如下所示：

    ```http request
    ### Get the message by its id
    GET http://localhost:8080/f910aa7e-11ee-4215-93ed-1aeeac822707
    ```
    
    > 请将你的消息 ID 替换为上面提到的 ID。
    >
    {style="note"}

5. 执行 GET 请求并在 **运行** 工具窗口中查看结果：

    ![通过 ID 检索消息](retrieve-message-by-its-id.png){width=706}

## 下一步

最后一步将向你展示如何使用 Spring Data 进行更流行的数据库连接。

**[进入下一章](jvm-spring-boot-using-crudrepository.md)**