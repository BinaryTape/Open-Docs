[//]: # (title: 测试页面)
[//]: # (description: 本页面仅用于测试目的。)

<no-index/>

<tldr>
   <p>这是一个包含图片的区块（摘自《<strong>Compose Multiplatform 入门</strong>》教程）。</p>
   <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <a href="jvm-create-project-with-spring-boot.md">使用 Kotlin 创建 Spring Boot 项目</a><br/>
      <img src="icon-2-done.svg" width="20" alt="第二步"/> <a href="jvm-spring-boot-add-data-class.md">将数据类添加到 Spring Boot 项目</a><br/>
      <img src="icon-3.svg" width="20" alt="第三步"/> <strong>为 Spring Boot 项目添加数据库支持</strong><br/>
      <img src="icon-4-todo.svg" width="20" alt="第四步"/> 使用 Spring Data CrudRepository 进行数据库访问><br/>
    </p>
</tldr>

## 同步选项卡

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

### 折叠章节 {initial-collapse-state="collapsed" collapsible="true"}

这里有一些文本和一个代码块：

```kotlin
plugins {
    kotlin("plugin.noarg") version "1.9.23"
}
```

## 代码块

一个简单的代码块：

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

### 可展开的代码块

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

### 可运行的代码块

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    val user = User("Alex", 1)
    
    //sampleStart
    // Automatically uses toString() function so that output is easy to read
    println(user)            
    // User(name=Alex, id=1)
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 表格

### Markdown 表格

| 原始类型数组                                                                  | 对应 Java 类型 |
|---------------------------------------------------------------------------------------|--------------------|
| [`BooleanArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-boolean-array/) | `boolean[]`        |
| [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/)       | `byte[]`           |
| [`CharArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-char-array/)       | `char[]`           |
| [`DoubleArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-double-array/)   | `double[]`         |
| [`FloatArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-float-array/)     | `float[]`          |
| [`IntArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-int-array/)         | `int[]`            |
| [`LongArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-long-array/)       | `long[]`           |
| [`ShortArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-short-array/)     | `short[]`          |

### XML 表格

<table>
    <tr>
        <td><strong>最后修改于</strong></td>
        <td><strong>December 2023</strong></td>
    </tr>
    <tr>
        <td><strong>下次更新</strong></td>
        <td><strong>June 2024</strong></td>
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
        <td rowspan="2"><code>jvmMain</code> 编译的依赖项</td>
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
        <td><code>jvmMain</code> 源集的依赖项</td>
<td colspan="2">

```kotlin
jvmMain<Scope>
```

</td>
    </tr>
    <tr>
        <td><code>jvmTest</code> 编译的依赖项</td>
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
        <td><code>jvmTest</code> 源集的依赖项</td>
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
        1. 三点一之一
4. 包含代码块：

   ```kotlin
   jvmTest<Scope>
   ```

### 无序列表

* 第一个项目
* 第二个项目
* 第三个项目
    * 再来一个
    * 另一个
        * 哇，再来一个
* 包含代码块：

   ```kotlin
   jvmTest<Scope>
   ```

### 定义列表

<deflist collapsible="true">
   <def title="可折叠项目 #1">
      <p><code>CrudRepository</code> 接口中 <code>findById()</code> 函数的返回类型是 <code>Optional</code> 类的实例。然而，为了保持一致性，方便返回一个包含单个消息的 <code>List</code>。为此，如果 <code>Optional</code> 值存在，您需要将其解包，并返回一个包含该值的列表。这可以作为 <code>Optional</code> 类型的<a href="extensions.md#extension-functions">扩展函数</a>来实现。</p>
      <p>在代码中，<code>Optional&lt;out T&gt;.toList()</code>，<code>.toList()</code> 是 <code>Optional</code> 的扩展函数。扩展函数允许您为任何类编写额外的函数，这在您想要扩展某个库类的功能时尤其有用。</p>
   </def>
   <def title="可折叠项目 #2">
      <p><a href="https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#jdbc.entity-persistence">此函数在假设新对象在数据库中没有 ID 的情况下工作</a>。因此，ID 在插入时**应为 null**。</p>
      <p> 如果 ID 不为 <i>null</i>，<code>CrudRepository</code> 会认为该对象已存在于数据库中，并且这是一个<i>更新</i>操作而非<i>插入</i>操作。插入操作后，ID 将由数据存储生成并重新赋值给 <code>Message</code> 实例。这就是为什么 ID 属性应使用 <code>var</code> 关键字声明的原因。</p>
      <p></p>
   </def>
</deflist>

## 文本元素

* **粗体文本**
* _斜体文本_
* `inline code`
* [内部锚点](#lists)
* [内部链接](roadmap.md)
* [外部链接](https://jetbrains.com)
* 表情符号 ❌✅🆕

## 变量
* 变量使用：最新 Kotlin 版本是 %kotlinVersion%

## 嵌入式元素

### 来自 YouTube 的视频

<video src="https://www.youtube.com/v/Ol_96CHKqg8" title="Kotlin 1.9.20 新特性"/>

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

## 注意事项

警告：

> kapt 编译器插件中对 K2 的支持是[实验性的](components-stability.md)。
> 需要选择启用（详见下文），并且您应仅将其用于评估目的。
>
{style="warning"}

注意：

> 对于 Kotlin/Native 附带的原生平台库（如 Foundation、UIKit 和 POSIX），只有部分 API 需要通过 `@ExperimentalForeignApi` 进行选择启用。在这种情况下，您会收到一个带有选择启用要求的警告。
>
{style="note"}

提示：

> 对于 Kotlin/Native 附带的原生平台库（如 Foundation、UIKit 和 POSIX），只有部分 API 需要通过 `@ExperimentalForeignApi` 进行选择启用。在这种情况下，您会收到一个带有选择启用要求的警告。
>
{style="tip"}