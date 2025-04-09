---
title: "向 Spring Boot 项目添加数据类"
description: "向 Spring Boot 项目添加 Kotlin 数据类。"
---
:::info
<p>
   这是 <strong>Spring Boot 和 Kotlin 入门</strong>教程的第二部分。在继续之前，请确保已完成之前的步骤：
</p><br/>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot">使用 Kotlin 创建一个 Spring Boot 项目</a><br/><img src="/img/icon-2.svg" width="20" alt="Second step"/> <strong>向 Spring Boot 项目添加一个数据类（data class）</strong><br/><img src="/img/icon-3-todo.svg" width="20" alt="Third step"/> 为 Spring Boot 项目添加数据库支持<br/><img src="/img/icon-4-todo.svg" width="20" alt="Fourth step"/> 使用 Spring Data CrudRepository 进行数据库访问
</p>

:::

在本教程的这一部分中，你将向应用程序添加更多功能，并探索更多 Kotlin 语言特性，例如数据类（data class）。
这需要更改 `MessageController` 类，使其响应包含序列化对象集合的 JSON 文档。

## 更新你的应用

1. 在同一个包（package）中，创建一个 `Message.kt` 文件，其中包含一个具有两个属性的数据类（data class）：`id` 和 `text`：

    ```kotlin
    // Message.kt
    package demo
   
    data class Message(val id: String?, val text: String)
    ```

   `Message` 类将用于数据传输：序列化的 `Message` 对象列表将构成控制器（controller）将响应浏览器请求的 JSON 文档。
<h3>数据类（Data classes）– data class Message</h3>
<p>
   Kotlin 中<a href="data-classes">数据类（data classes）</a>的主要目的是保存数据。此类用 `data` 关键字标记，并且一些标准功能和一些实用函数通常可以从类结构中机械地导出。
</p>
<p>
   在此示例中，你已将 `Message` 声明为数据类（data class），因为其主要目的是存储数据。
</p>
<h3>val 和 var 属性（properties）</h3>
<p>
   Kotlin 类中的<a href="properties">属性（properties）</a>可以声明为：
</p>
<list>
<li><i>可变的（mutable）</i>，使用 `var` 关键字</li>
<li><i>只读的（read-only）</i>，使用 `val` 关键字</li>
</list>
<p>
   `Message` 类使用 `val` 关键字声明了两个属性（properties），即 `id` 和 `text`。
          编译器将自动为这两个属性（properties）生成 getter。
          创建 `Message` 类的实例后，将无法重新分配这些属性（properties）的值。
</p>
<h3>可空类型（Nullable types）– String?</h3>
<p>
   Kotlin 提供了<a href="null-safety#nullable-types-and-non-nullable-types">对可空类型（nullable types）的内置支持</a>。在 Kotlin 中，类型系统区分可以包含 `null` 的引用（<i>可空引用（nullable references）</i>）和不能包含 `null` 的引用（<i>非空引用（non-nullable references）</i>）。<br/>
          例如，`String` 类型的常规变量不能包含 `null`。要允许空值（nulls），你可以通过编写 `String?` 将变量声明为可空字符串。
</p>
<p>
   `Message` 类的 `id` 属性（property）这次声明为可空类型（nullable type）。
          因此，可以通过传递 `null` 作为 `id` 的值来创建 `Message` 类的实例：
</p>
          ```kotlin
Message(null, "Hello!")
```
       
   
2. 在 `MessageController.kt` 文件中，创建返回 `Message` 对象列表的 `listMessages()` 函数，而不是 `index()` 函数：

    ```kotlin
    // MessageController.kt
    package demo
   
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
<h3>集合（Collections）– listOf()</h3>
<p>
   Kotlin 标准库提供了基本集合类型（collection types）的实现：集（sets）、列表（lists）和映射（maps）。<br/>
          一对接口表示每种集合类型（collection type）：
</p>
<list>
<li>一个<i>只读（read-only）</i>接口，提供用于访问集合元素的操作。</li>
<li>一个<i>可变的（mutable）</i>接口，通过写入操作（添加、删除和更新其元素）扩展了相应的只读（read-only）接口。</li>
</list>
<p>
   Kotlin 标准库还提供了相应的工厂函数（factory functions）来创建此类集合的实例。
</p>
<p>
   在本教程中，你使用<a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html">`listOf()`</a> 函数来创建 `Message` 对象列表。
          这是创建对象<i>只读（read-only）</i>列表的工厂函数（factory function）：你无法从列表中添加或删除元素。<br/>
          如果需要在列表上执行写入操作，请调用<a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html">`mutableListOf()`</a> 函数来创建可变列表实例。
</p>
<h3>尾随逗号（Trailing comma）</h3>
<p>
   <a href="coding-conventions#trailing-commas">尾随逗号（trailing comma）</a>是元素系列中<b>最后一项</b>之后的逗号符号：
</p>
            ```kotlin
Message("3", "Privet!"),
```
<p>
   这是 Kotlin 语法的一个方便特性，并且是完全可选的 - 没有它们你的代码仍然可以工作。
</p>
<p>
   在上面的示例中，创建 `Message` 对象列表包括最后一个 `listOf()` 函数参数之后的尾随逗号（trailing comma）。
</p>
       
    

现在，来自 `MessageController` 的响应将是一个 JSON 文档，其中包含 `Message` 对象的集合。

:::note
如果 Jackson 库位于类路径（classpath）中，则 Spring 应用程序中的任何控制器（controller）默认都会呈现 JSON 响应。
正如你[在 `build.gradle.kts` 文件中指定了 `spring-boot-starter-web` 依赖项](jvm-create-project-with-spring-boot#explore-the-project-gradle-build-file)一样，你收到了 Jackson 作为<i>传递（transitive）</i>依赖项。
因此，如果端点（endpoint）返回可以序列化为 JSON 的数据结构，则应用程序将响应 JSON 文档。

:::

这是 `DemoApplication.kt`、`MessageController.kt` 和 `Message.kt` 文件的完整代码：

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
// MessageController.kt
package demo

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

```kotlin
// Message.kt
package demo

data class Message(val id: String?, val text: String)
```

## 运行应用程序

Spring 应用程序已准备好运行：

1. 再次运行应用程序。

2. 应用程序启动后，打开以下 URL：

    ```text
    http://localhost:8080
    ```

    你将看到一个页面，其中包含 JSON 格式的消息集合：

    <img src="/img/messages-in-json-format.png" alt="Run the application" width="800" style={{verticalAlign: 'middle'}}/>

## 下一步

在本教程的下一部分中，你将向项目添加和配置数据库，并发出 HTTP 请求。

**[继续下一章](jvm-spring-boot-add-db-support)**