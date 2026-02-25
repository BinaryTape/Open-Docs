[//]: # (title: 向 Spring Boot 项目添加数据类)

<web-summary>向 Spring Boot 项目添加 Kotlin 数据类。</web-summary>

<tldr>
    <p>这是 <strong>Spring Boot 与 Kotlin 入门</strong>教程的第二部分。在继续之前，请确保您已完成之前的步骤：</p><br/>
    <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <a href="jvm-create-project-with-spring-boot.md">使用 Kotlin 创建 Spring Boot 项目</a><br/><img src="icon-2.svg" width="20" alt="第二步"/> <strong>向 Spring Boot 项目添加数据类</strong><br/><img src="icon-3-todo.svg" width="20" alt="第三步"/> 为 Spring Boot 项目添加数据库支持<br/><img src="icon-4-todo.svg" width="20" alt="第四步"/> 使用 Spring Data CrudRepository 进行数据库访问</p>
</tldr>

在本教程的这一部分中，您将为应用程序添加更多功能，并了解更多 Kotlin 语言特性，例如数据类。
这需要修改 `MessageController` 类，使其返回包含序列化对象集合的 JSON 文档。

## 更新您的应用程序

1. 在同一个包中，在 `DemoApplication.kt` 文件旁边创建一个 `Message.kt` 文件。
2. 在 `Message.kt` 文件中，创建一个包含两个属性（`id` 和 `text`）的数据类：

    ```kotlin
    // Message.kt
    package com.example.demo
   
    data class Message(val id: String?, val text: String)
    ```

   `Message` 类将用于数据传输：序列化的 `Message` 对象列表将构成控制器响应浏览器请求的 JSON 文档。

   <deflist collapsible="true">
       <def title="数据类 – data class Message">
          <p>Kotlin 中<a href="data-classes.md">数据类</a>的主要目的是保存数据。此类标有 <code>data</code> 关键字，某些标准功能和一些实用程序函数通常可以从类结构中机械地推导出来。</p>
          <p>在本例中，您将 <code>Message</code> 声明为数据类，因为其主要目的是存储数据。</p>
       </def>
       <def title="val 和 var 属性">
          <p>Kotlin 类中的<a href="properties.md">属性</a>可以声明为：</p>
          <list>
             <li>使用 <code>var</code> 关键字的<i>可变</i>属性</li>
             <li>使用 <code>val</code> 关键字的<i>只读</i>属性</li>
          </list>
          <p><code>Message</code> 类使用 <code>val</code> 关键字声明了两个属性：<code>id</code> 和 <code>text</code>。
          编译器将自动为这两个属性生成 getter。
          在 <code>Message</code> 类的实例创建后，将无法重新为这些属性赋值。
          </p>
       </def>
       <def title="可为 null 类型 – String?">
          <p>Kotlin 提供了对<a href="null-safety.md#nullable-types-and-non-nullable-types">可为 null 类型的内置支持</a>。在 Kotlin 中，类型系统区分了可以持有 <code>null</code> 的引用（<i>可为 null 引用</i>）和不能持有 <code>null</code> 的引用（<i>非 null 引用</i>）。<br/>
          例如，<code>String</code> 类型的常规变量不能持有 <code>null</code>。要允许为 null，您可以通过编写 <code>String?</code> 将变量声明为可为 null 的字符串。
          </p>
          <p>这次 <code>Message</code> 类的 <code>id</code> 属性被声明为可为 null 类型。
          因此，可以通过为 <code>id</code> 传入 <code>null</code> 值来创建 <code>Message</code> 类的实例：
          </p>
          <code-block lang="kotlin">
          Message(null, "Hello!")
          </code-block>
       </def>
   </deflist>
3. 在 `MessageController.kt` 文件中，创建 `listMessages()` 函数以返回 `Message` 对象列表，而不是原来的 `index()` 函数：

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
          <p>Kotlin 标准库提供了基本集合类型的实现：set、list 和 map。<br/>
          每种集合类型都可以是<i>只读</i>或<i>可变</i>的：</p>
          <list>
              <li>只读集合带有访问集合元素的操作。</li>
              <li>可变集合还带有用于添加、移除和更新其元素的写操作。</li>
          </list>
          <p>Kotlin 标准库也提供了相应的工厂函数来创建此类集合的实例。
          </p>
          <p>在本教程中，您使用 <a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/list-of.html"><code>listOf()</code></a> 函数来创建 <code>Message</code> 对象列表。
          这是创建<i>只读</i>对象列表的工厂函数：您无法从列表中添加或移除元素。<br/>
          如果需要对列表执行写操作，请调用 <a href="https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/mutable-list-of.html"><code>mutableListOf()</code></a> 函数来创建可变列表实例。
          </p>
       </def>
       <def title="尾随逗号">
          <p><a href="coding-conventions.md#trailing-commas">尾随逗号</a>是位于一系列元素中<b>最后一个项</b>之后的逗号符号：</p>
            <code-block lang="kotlin">
            Message("3", "Privet!"),
            </code-block>
          <p>这是 Kotlin 语法中一项方便的特性，完全是可选的——没有它们，您的代码仍然可以运行。
          </p>
          <p>在上面的示例中，创建 <code>Message</code> 对象列表时，在最后一个 <code>listOf()</code> 函数实参后面包含了尾随逗号。</p>
       </def>
    </deflist>

现在，来自 `MessageController` 的响应将是一个包含 `Message` 对象集合的 JSON 文档。

> 如果类路径中存在 Jackson 库，Spring 应用程序中的任何控制器默认都会呈现 JSON 响应。
> 由于您[在 `build.gradle.kts` 文件中指定了 `spring-boot-starter-webmvc` 依赖项](jvm-create-project-with-spring-boot.md#explore-the-project-gradle-build-file)，您将 Jackson 作为“传递”依赖项引入。
> 因此，如果端点返回可以序列化为 JSON 的数据结构，应用程序将以 JSON 文档进行响应。
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

    您将看到一个包含 JSON 格式消息集合的页面：

    ![运行应用程序](messages-in-json-format.png){width=700}

## 下一步

在教程的下一部分中，您将为项目添加并配置数据库，并发送 HTTP 请求。

**[转到下一章](jvm-spring-boot-add-db-support.md)**