[//]: # (title: 测试页面)

<web-summary>此页面仅用于测试。</web-summary>

<no-index/>

<tldr>
   <p>这是一个包含图片的区块（取自**Compose Multiplatform 入门**教程）。</p>
   <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot.md">使用 Kotlin 创建 Spring Boot 项目</a><br/>
      <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="jvm-spring-boot-add-data-class.md">向 Spring Boot 项目添加数据类</a><br/>
      <img src="icon-3.svg" width="20" alt="Third step"/> <strong>为 Spring Boot 项目添加数据库支持</strong><br/>
      <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 使用 Spring Data CrudRepository 进行数据库访问><br/>
    </p>
</tldr>

## 同步标签页

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("kapt") version "1.9.23"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.kapt" version "1.9.23"
}
```

</tab>
</tabs>

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("plugin.noarg") version "1.9.23"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.noarg" version "1.9.23"
}
```

</tab>
</tabs>

## 章节

### 可折叠章节 {initial-collapse-state="collapsed" collapsible="true"}

这里有一些文本和一个代码块：

```kotlin
plugins {
    kotlin("plugin.noarg") version "1.9.23"
}
```

## 代码块

只是一个代码块：

```kotlin
    import java.util.*

@Service
class MessageService(val db: MessageRepository) {
    fun findMessages(): List<Message> = db.findAll().toList()

    fun findMessageById(id: String): List<Message> = db.findById(id).toList()

    fun save(message: Message) {
        db.save(message)
    }

    fun <T : Any> Optional<out T>.toList(): List<T> =
        if (isPresent) listOf(get()) else emptyList()
}
```

### 可展开代码块

```kotlin
package com.example.demo

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@SpringBootApplication
class DemoApplication

fun main(args: Array<String>) {
    runApplication<DemoApplication>(*args)
}

@RestController
class MessageController {
    @GetMapping("/")
    fun index(@RequestParam("name") name: String) = "Hello, $name!"
}
```
{initial-collapse-state="collapsed" collapsible="true"}

### 可运行代码块

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    val user = User("Alex", 1)
    
    //sampleStart
    // 自动使用 toString() 函数，以便输出易于阅读
    println(user)            
    // User(name=Alex, id=1)
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 表格

### Markdown 表格

| 原语类型数组 | Java 中的等效项 |
|--------------------|--------------------|
| [`BooleanArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean-array/) | `boolean[]` |
| [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/) | `byte[]` |
| [`CharArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-char-array/) | `char[]` |
| [`DoubleArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double-array/) | `double[]` |
| [`FloatArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-float-array/) | `float[]` |
| [`IntArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int-array/) | `int[]` |
| [`LongArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long-array/) | `long[]` |
| [`ShortArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-short-array/) | `short[]` |

### XML 表格

<table>
    <tr>
        <td><strong>上次修改于</strong></td>
        <td><strong>2023 年 12 月</strong></td>
    </tr>
    <tr>
        <td><strong>下次更新</strong></td>
        <td><strong>2024 年 6 月</strong></td>
    </tr>
</table>

### 包含代码块的 XML 表格

简单表格：

<table>
    <tr>
        <td>之前</td>
        <td>现在</td>
    </tr>
    <tr>
<td>

```kotlin
kotlin {
    targets {
        configure(['windows',
            'linux']) {
        }
    }
}
```

</td>
<td>

```kotlin
kotlin {
    targets {
        configure([findByName('windows'),
            findByName('linux')]) {
        }
    }
}
```

</td>
    </tr>
</table>

更复杂的表格：

<table>
    <tr>
        <td></td>
        <td>之前</td>
        <td>现在</td>
    </tr>
    <tr>
        <td rowspan="2"><code>jvmMain</code> 编译项的依赖项</td>
<td>

```kotlin
jvm<Scope>
```

</td>
<td>

```kotlin
jvmCompilation<Scope>
```

</td>
    </tr>
    <tr>
<td>

```kotlin
dependencies {
    add("jvmImplementation",
        "foo.bar.baz:1.2.3")
}
```

</td>
<td>

```kotlin
dependencies {
    add("jvmCompilationImplementation",
        "foo.bar.baz:1.2.3")
}
```

</td>
    </tr>
    <tr>
        <td><code>jvmMain</code> 源代码集的依赖项</td>
<td colspan="2">

```kotlin
jvmMain<Scope>
```

</td>
    </tr>
    <tr>
        <td><code>jvmTest</code> 编译项的依赖项</td>
<td>

```kotlin
jvmTest<Scope>
```

</td>
<td>

```kotlin
jvmTestCompilation<Scope>
```

</td>
    </tr>
    <tr>
        <td><code>jvmTest</code> 源代码集的依赖项</td>
<td colspan="2">

```kotlin
jvmTest<Scope>
```

</td>
    </tr>
</table>

## 列表

### 有序列表

1. 一
2. 二
3. 三
    1. 三点一
    2. 三点二
    3. 三点三
        1. 三点一又一点一
4. 内部包含一个代码块：

   ```kotlin
   jvmTest<Scope>
   ```

### 无序列表

* 第一个要点
* 第二个要点
* 第三个要点
    * 再一个
    * 又一个
        * 哇，又一个
* 内部包含一个代码块：

   ```kotlin
   jvmTest<Scope>
   ```

### 定义列表

<deflist collapsible="true">
   <def title="可折叠项 #1">
      <p><code>CrudRepository</code> 接口中 <code>findById()</code> 函数的返回类型是 <code>Optional</code> 类的一个实例。然而，为了保持一致性，返回一个包含单个消息的 <code>List</code> 将会很方便。为此，你需要解包 <code>Optional</code> 值（如果它存在），并返回一个包含该值的列表。这可以作为 <code>Optional</code> 类型的一个<a href="extensions.md#extension-functions">扩展函数</a>来实现。</p>
      <p>在代码中，<code>Optional&lt;out T&gt;.toList()</code> 中的 <code>.toList()</code> 是 <code>Optional</code> 的扩展函数。扩展函数允许你为任何类编写额外的函数，这在你想要扩展某个库类的功能时特别有用。</p>
   </def>
   <def title="可折叠项 #2">
      <p><a href="https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#jdbc.entity-persistence">此函数基于一个假设工作</a>：新对象在数据库中没有 ID。因此，插入时 ID <b>应该为 null</b>。</p>
      <p>如果 ID 不是 <i>null</i>，<code>CrudRepository</code> 假定该对象已存在于数据库中，并且这是一个更新操作，而不是插入操作。在插入操作之后，ID 将由数据存储生成并重新赋值给 <code>Message</code> 实例。这就是为什么 ID 属性应该使用 <code>var</code> 关键字声明的原因。</p>
      <p></p>
   </def>
</deflist>

## 文本元素

* **粗体文本**
* _斜体文本_
* `内联代码`
* [内部锚点](#lists)
* [内部链接](roadmap.md)
* [外部链接](https://jetbrains.com)
* emojis ❌✅🆕

## 变量
* 变量使用：最新 Kotlin 版本是 %kotlinVersion%

## 嵌入元素

### YouTube 视频

<video src="https://www.youtube.com/v/Ol_96CHKqg8" title="Kotlin 1.9.20 的新特性"/>

### 图片

常规 (Markdown)：

![创建测试](create-test.png){width="700"}

常规 (XML)：

<img src="multiplatform-web-wizard.png" alt="多平台 Web 向导" width="400"/>

内联：

![YouTrack](youtrack-logo.png){width=30}{type="joined"}

可缩放：

![类图](ksp-class-diagram.svg){thumbnail="true" width="700" thumbnail-same-file="true"}

按钮样式：

<a href="https://kmp.jetbrains.com">
   <img src="multiplatform-create-project-button.png" alt="创建项目" style="block"/>
</a>

## 注意

警告：

> kapt 编译器插件中对 K2 的支持是[实验性的](components-stability.md)。
> 需要选择启用（详见下文），你应仅将其用于求值目的。
>
{style="warning"}

注意：

> 对于随 Kotlin/Native 附带的原生平台库（例如 Foundation、UIKit 和 POSIX），只有它们的部分 API 需要通过 `@ExperimentalForeignApi` 进行选择启用。在这种情况下，你会收到一个带有选择启用要求的警告。
>
{style="note"}

提示：

> 对于随 Kotlin/Native 附带的原生平台库（例如 Foundation、UIKit 和 POSIX），只有它们的部分 API 需要通过 `@ExperimentalForeignApi` 进行选择启用。在这种情况下，你会收到一个带有选择启用要求的警告。
>
{style="tip"}