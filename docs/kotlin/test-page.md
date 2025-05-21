---
title: 测试页面
description: 此页面仅用于测试目的。
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<no-index/>
:::info
<p>
   这是一个包含图片的块（取自 <strong>Getting started with Compose Multiplatform</strong> 教程）。
</p>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot">使用 Kotlin 创建一个 Spring Boot 项目</a><br/>
      <img src="/img/icon-2-done.svg" width="20" alt="Second step"/> <a href="jvm-spring-boot-add-data-class">向 Spring Boot 项目添加一个数据类</a><br/>
      <img src="/img/icon-3.svg" width="20" alt="Third step"/> <strong>为 Spring Boot 项目添加数据库支持</strong><br/>
      <img src="/img/icon-4-todo.svg" width="20" alt="Fourth step"/> 使用 Spring Data CrudRepository 进行数据库访问><br/>
</p>

:::

## 同步标签页

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("kapt") version "1.9.23"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id "org.jetbrains.kotlin.kapt" version "1.9.23"
}
```

</TabItem>
</Tabs>

<Tabs groupId="build-script">
<TabItem value="kotlin" label="Kotlin" default>

```kotlin
plugins {
    kotlin("plugin.noarg") version "1.9.23"
}
```

</TabItem>
<TabItem value="groovy" label="Groovy" default>

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.noarg" version "1.9.23"
}
```

</TabItem>
</Tabs>

## 章节

### 折叠章节

这里有一些文字和一个代码块：

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

### 可运行的代码块

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    val user = User("Alex", 1)

    // Automatically uses toString() function so that output is easy to read
    println(user)            
    // User(name=Alex, id=1)

}
```

## 表格

### Markdown 表格

| Primitive-type array                                                                  | Equivalent in Java |
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
<td>
<strong>上次修改于</strong>
</td>
<td>
<strong>2023 年 12 月</strong>
</td>
</tr>
<tr>
<td>
<strong>下次更新</strong>
</td>
<td>
<strong>2024 年 6 月</strong>
</td>
</tr>
</table>

### 带有代码块的 XML 表格

简单表格:
<table>
<tr>
<td>
之前
</td>
<td>
现在
</td>
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

更复杂的表格:
<table>
<tr>
<td>
</td>
<td>
之前
</td>
<td>
现在
</td>
</tr>
<tr>
<td rowspan="2">
`jvmMain` 编译的依赖项
</td>
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
<td>
`jvmMain` 源代码集的依赖项
</td>
<td colspan="2">

```kotlin
jvmMain<Scope>
```
</td>
</tr>
<tr>
<td>
`jvmTest` 编译的依赖项
</td>
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
<td>
`jvmTest` 源代码集的依赖项
</td>
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
        1. 三点一和一
4. 内部包含代码块:

   ```kotlin
   jvmTest<Scope>
   ```

### 无序列表

* 第一个项目
* 第二个项目
* 第三个项目
    * 更多一个
    * 另外一个
        * 哇，再来一个
* 内部包含代码块:

   ```kotlin
   jvmTest<Scope>
   ```

### 定义列表
<h3>可折叠项目 #1</h3>
<p>
   `CrudRepository` 接口中 `findById()` 函数的返回类型是 `Optional` 类的实例。 但是，为了保持一致性，返回包含单个消息的 `List` 会很方便。 因此，如果 `Optional` 值存在，你需要解包该值，并返回包含该值的列表。 这可以实现为 `Optional` 类型的 <a href="extensions#extension-functions">扩展函数 (extension function)</a>。
</p>
<p>
   在代码 `Optional&lt;out T&gt;.toList()` 中，`.toList()` 是 `Optional` 的扩展函数。 扩展函数允许你为任何类编写附加函数，这在你要扩展某些库类的功能时特别有用。
</p>
<h3>可折叠项目 #2</h3>
<p>
   <a href="https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#jdbc.entity-persistence">此函数的工作方式是</a>假设新对象在数据库中没有 id。 因此，插入时 id <b>应为 null</b>。
</p>
<p>
   如果 id 不是 <i>null</i>，则 `CrudRepository` 假定该对象已存在于数据库中，并且这是一个<i>更新</i> 操作，而不是<i>插入</i> 操作。 插入操作后，`id` 将由数据存储生成并分配回 `Message` 实例。 这就是为什么应该使用 `var` 关键字声明 `id` 属性的原因。
</p>
<p>
</p>

## 文本元素

* **粗体文本**
* _斜体文本_
* `行内代码 (inline code)`
* [内部锚点](#lists)
* [内部链接](roadmap)
* [外部链接](https://jetbrains.com)
* 表情符号 ❌✅🆕

## 变量
* 使用变量：最新的 Kotlin 版本是 2.1.20

## 嵌入元素

### YouTube 视频

<video src="https://www.youtube.com/v/Ol_96CHKqg8" title="What's new in Kotlin 1.9.20"/>

### 图片

常规（Markdown）：

<img src="/img/create-test.png" alt="Create a test" width="700" style={{verticalAlign: 'middle'}}/>

常规（XML）：

<img src="/img/multiplatform-web-wizard.png" alt="Multiplatform web wizard" width="400"/>

内联：

<img src="/img/youtrack-logo.png" alt="YouTrack" width="30" style={{verticalAlign: 'middle'}}/>

可缩放：

<img src="/img/ksp-class-diagram.svg" alt="class diagram" width="700" style={{verticalAlign: 'middle'}}/>

按钮样式：

<a href="https://kmp.jetbrains.com">
   <img src="/img/multiplatform-create-project-button.png" alt="Create a project" />
</a>

## 提示

警告：

:::note
kapt 编译器插件中对 K2 的支持是 [Experimental](components-stability)。
需要选择启用（请参阅下面的详细信息），并且您应该仅将其用于评估目的。

注意：

对于 Kotlin/Native 附带的本机平台库（例如 Foundation、UIKit 和 POSIX），只有部分
API 需要使用 `@ExperimentalForeignApi` 选择启用。 在这种情况下，您会收到一条警告，其中包含选择启用要求。

:::

提示：

:::tip
对于 Kotlin/Native 附带的本机平台库（例如 Foundation、UIKit 和 POSIX），只有部分
API 需要使用 `@ExperimentalForeignApi` 选择启用。 在这种情况下，您会收到一条警告，其中包含选择启用要求。

:::