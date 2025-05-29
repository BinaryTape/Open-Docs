[//]: # (title: 向 Spring Boot 项目添加数据类)
[//]: # (description: 向 Spring Boot 项目添加 Kotlin 数据类。)

<tldr>
    <p>这是 **Spring Boot 和 Kotlin 入门** 教程的第二部分。在继续之前，请确保你已完成以下步骤：</p><br/>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot.md">使用 Kotlin 创建 Spring Boot 项目</a><br/><img src="icon-2.svg" width="20" alt="Second step"/> <strong>向 Spring Boot 项目添加数据类</strong><br/><img src="icon-3-todo.svg" width="20" alt="Third step"/> 为 Spring Boot 项目添加数据库支持<br/><img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 使用 Spring Data CrudRepository 进行数据库访问</p>
</tldr>

在本教程的这一部分，你将为应用程序添加更多功能，并了解更多 Kotlin 语言特性，例如数据类。
这需要更改 `MessageController` 类，使其能够响应包含序列化对象集合的 JSON 文档。

## 更新你的应用程序

1. 在同一包中，紧邻 `DemoApplication.kt` 文件，创建一个 `Message.kt` 文件。
2. 在 `Message.kt` 文件中，创建一个具有两个属性：`id` 和 `text` 的数据类：

    ```kotlin
    // Message.kt
    package com.example.demo
   
    data class Message(val id: String?, val text: String)
    ```

   `Message` 类将用于数据传输：一个序列化的 `Message` 对象列表将构成控制器响应浏览器请求的 JSON 文档。

   <deflist collapsible="true">
       <def title="数据类 – data class Message">
          <p>Kotlin 中 <a href="data-classes.md">数据类</a> 的主要目的是持有数据。此类用 `data` 关键字标记，并且一些标准功能和实用函数通常可以从类结构中机械地派生出来。</p>
          <p>在此示例中，你将 `Message` 声明为一个数据类，因为其主要目的是存储数据。</p>
       </def>
       <def title="val 和 var 属性">
          <p><a href="properties.md">Kotlin 中的属性</a> 可以声明为以下两种之一：</p>
          <list>
             <li><i>可变</i>，使用 `var` 关键字</li>
             <li><i>只读</i>，使用 `val` 关键字</li>
          </list>
          <p>`Message` 类使用 `val` 关键字声明了两个属性：`id` 和 `text`。编译器将自动为这两个属性生成 getter。在创建 `Message` 类的实例后，将无法重新赋值这些属性。</p>
       </def>
       <def title="可空类型 – String?">
          <p>Kotlin 提供 <a href="null-safety.md#nullable-types-and-non-nullable-types">对可空类型的内置支持</a>。在 Kotlin 中，类型系统区分可以持有 `null` 的引用（<i>可空引用</i>）和不能持有 `null` 的引用（<i>非可空引用</i>）。<br/>例如，`String` 类型的常规变量不能持有 `null`。要允许空值，你可以通过编写 `String?` 将变量声明为可空字符串。</p>
          <p>`id` 属性的 `Message` 类这次被声明为可空类型。因此，可以通过将 `null` 作为 `id` 的值来创建 `Message` 类的实例：</p>
          <code-block lang="kotlin">
          Message(null, "Hello!")
          </code-block>
       </def>
   </deflist>
3. 在 `MessageController.kt` 文件中，用 `listMessages()` 函数替换 `index()` 函数，该函数返回一个 `Message` 对象列表：

    ```kotlin
    // MessageController.kt
    package com.example.demo
   
    import org.springframework.web.bind.annotation.GetMapping
    import org.springframework.web.bind.annotation.RequestMapping
    import org.springframework.web.bind.annotation.RestController

    @RestController
    @RequestMapping("/")
    class MessageController {
        @GetMapping
        fun listMessages() = listOf(
            Message("1", "Hello!"),
            Message("2", "Bonjour!"),
            Message("3", "Privet!"),
        )
    }
    ```

    <deflist collapsible="true">
       <def title="集合 – listOf()">
          <p>Kotlin 标准库为基本集合类型（集、列表和映射）提供实现。<br/>每种集合类型都可以是<i>只读</i>或<i>可变</i>的：</p>
          <list>
              <li><i>只读</i>集合提供用于访问集合元素的操作。</li>
              <li><i>可变</i>集合还提供用于添加、移除和更新其元素的写入操作。</li>
          </list>
          <p>Kotlin 标准库也提供了相应的工厂函数来创建此类集合的实例。</p>
          <p>在本教程中，你使用 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html"><code>listOf()</code></a> 函数来创建一个 `Message` 对象列表。这是创建<i>只读</i>对象列表的工厂函数：你不能从列表中添加或删除元素。<br/>如果需要对列表执行写入操作，请调用 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html"><code>mutableListOf()</code></a> 函数来创建可变列表实例。</p>
       </def>
       <def title="尾随逗号">
          <p><a href="coding-conventions.md#trailing-commas">尾随逗号</a> 是在一系列元素的**最后一个项目**之后的逗号符号：</p>
            <code-block lang="kotlin">
            Message("3", "Privet!"),
            </code-block>
          <p>这是 Kotlin 语法的一个方便特性，并且是完全可选的——你的代码即使没有它们也能正常工作。</p>
          <p>在上面的示例中，创建 `Message` 对象列表时在最后一个 `listOf()` 函数参数后包含尾随逗号。</p>
    </deflist>

`MessageController` 的响应现在将是一个包含 `Message` 对象集合的 JSON 文档。

> 如果 Jackson 库在 classpath 中，Spring 应用程序中的任何控制器默认都会渲染 JSON 响应。正如你 [在 `build.gradle.kts` 文件中指定了 `spring-boot-starter-web` 依赖](jvm-create-project-with-spring-boot.md#explore-the-project-gradle-build-file)，你获得了 Jackson 作为_传递_依赖。因此，如果端点返回一个可以序列化为 JSON 的数据结构，应用程序将以 JSON 文档响应。
>
{style="note"}

以下是 `DemoApplication.kt`、`MessageController.kt` 和 `Message.kt` 文件的完整代码：

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
// MessageController.kt
package com.example.demo

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/")
class MessageController {
    @GetMapping
    fun listMessages() = listOf(
        Message("1", "Hello!"),
        Message("2", "Bonjour!"),
        Message("3", "Privet!"),
    )
}
```
{initial-collapse-state="collapsed" collapsible="true"}

```kotlin
// Message.kt
package com.example.demo

data class Message(val id: String?, val text: String)
```
{initial-collapse-state="collapsed" collapsible="true"}

## 运行应用程序

Spring 应用程序已准备好运行：

1. 再次运行应用程序。

2. 应用程序启动后，打开以下 URL：

    ```text
    http://localhost:8080
    ```

    你将看到一个包含 JSON 格式消息集合的页面：

    ![Run the application](messages-in-json-format.png){width=800}

## 下一步

在本教程的下一部分中，你将为项目添加和配置数据库，并发出 HTTP 请求。

**[继续下一章](jvm-spring-boot-add-db-support.md)**