---
title: 測試頁面
description: 此頁面僅供測試使用。
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<no-index/>
:::info
<p>
   這是一個包含圖片的區塊（取自 <strong>Getting started with Compose Multiplatform</strong> 教學）。
</p>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot">使用 Kotlin 建立 Spring Boot 專案</a><br/>
      <img src="/img/icon-2-done.svg" width="20" alt="Second step"/> <a href="jvm-spring-boot-add-data-class">將資料類別新增至 Spring Boot 專案</a><br/>
      <img src="/img/icon-3.svg" width="20" alt="Third step"/> <strong>為 Spring Boot 專案新增資料庫支援</strong><br/>
      <img src="/img/icon-4-todo.svg" width="20" alt="Fourth step"/> 使用 Spring Data CrudRepository 進行資料庫存取><br/>
</p>

:::

## Synchronized tabs (同步標籤頁)

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

## Sections (章節)

### Collapsed section (折疊章節)

Some text here and a codeblock:

```kotlin
plugins {
    kotlin("plugin.noarg") version "1.9.23"
}
```

## Codeblocks (程式碼區塊)

Just a codeblock:

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

### Expandable codeblock (可展開程式碼區塊)

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

### Runnable codeblock (可執行程式碼區塊)

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    val user = User("Alex", 1)

    // Automatically uses toString() function so that output is easy to read
    println(user)            
    // User(name=Alex, id=1)

}
```

## Tables (表格)

### Markdown table

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

### XML table
<table>
<tr>
<td>
<strong>Last modified on (上次修改時間)</strong>
</td>
<td>
<strong>December 2023</strong>
</td>
</tr>
<tr>
<td>
<strong>Next update (下次更新)</strong>
</td>
<td>
<strong>June 2024</strong>
</td>
</tr>
</table>

### XML table with codeblocks inside (包含程式碼區塊的 XML 表格)

Simple table:
<table>
<tr>
<td>
Before
</td>
<td>
Now
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

More complex table:
<table>
<tr>
<td>
</td>
<td>
Before
</td>
<td>
Now
</td>
</tr>
<tr>
<td rowspan="2">
Dependencies of the `jvmMain` compilation
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
Dependencies of the `jvmMain` source set
</td>
<td colspan="2">

```kotlin
jvmMain<Scope>
```
</td>
</tr>
<tr>
<td>
Dependencies of the `jvmTest` compilation
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
Dependencies of the `jvmTest` source set
</td>
<td colspan="2">

```kotlin
jvmTest<Scope>
```
</td>
</tr>
</table>

## Lists (清單)

### Ordered list (有序清單)

1. One
2. Two
3. Three
    1. Three point 1
    2. Three point 2
    3. Three point 3
        1. Three point 1 and 1
4. With a codeblock inside:

   ```kotlin
   jvmTest<Scope>
   ```

### Non-ordered list (無序清單)

* First bullet
* Second bullet
* Third bullet
    * One more
    * Another one
        * Wow, one more
* With a codeblock inside:

   ```kotlin
   jvmTest<Scope>
   ```

### Definition list (定義清單)
<h3>Collapsible item #1</h3>
<p>
   `CrudRepository` 介面中 `findById()` 函式的返回類型是 `Optional` 類別的一個實例。 但是，為了保持一致性，返回一個包含單一訊息的 `List` 會更方便。 為此，如果 `Optional` 值存在，則需要將其解包，然後傳回帶有該值的列表。 這可以實作為 `Optional` 類型的一個 <a href="extensions#extension-functions">擴充函式（extension function）</a>。
</p>
<p>
   在程式碼中，`Optional&lt;out T&gt;.toList()`，`.toList()` 是 `Optional` 的擴充函式。 擴充函式允許您為任何類別編寫額外的函式，這在您想要擴充某些程式庫類別的功能時特別有用。
</p>
<h3>Collapsible item #2</h3>
<p>
   <a href="https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#jdbc.entity-persistence">此函式的工作方式</a> 假設新物件在資料庫中沒有 id。 因此，插入操作的 id <b>應該為 null</b>。
</p>
<p>
   如果 id 不是 <i>null</i>，`CrudRepository` 會假設物件已存在於資料庫中，並且這是一個<i>更新</i>操作，而不是<i>插入</i>操作。 在插入操作之後，`id` 將由資料儲存區產生並分配回 `Message` 實例。 這就是為什麼應該使用 `var` 關鍵字宣告 `id` 屬性的原因。
</p>
<p>
</p>
   

## Text elements (文字元素)

* **Bold text (粗體文字)**
* _italic text (斜體文字)_
* `inline code (行內程式碼)`
* [internal anchor (內部錨點)](#lists)
* [internal link (內部連結)](roadmap)
* [external link (外部連結)](https://jetbrains.com)
* emojis ❌✅🆕

## Variables (變數)
* variable using: latest Kotlin version is 2.1.20

## Embedded elements (嵌入元素)

### Video from YouTube

<video src="https://www.youtube.com/v/Ol_96CHKqg8" title="What's new in Kotlin 1.9.20"/>

### Pictures (圖片)

Regular (Markdown):

<img src="/img/create-test.png" alt="Create a test" width="700" style={{verticalAlign: 'middle'}}/>

Regular (XML):

<img src="/img/multiplatform-web-wizard.png" alt="Multiplatform web wizard" width="400"/>

Inline:

<img src="/img/youtrack-logo.png" alt="YouTrack" width="30" style={{verticalAlign: 'middle'}}/>

Zoomable:

<img src="/img/ksp-class-diagram.svg" alt="class diagram" width="700" style={{verticalAlign: 'middle'}}/>

Button-style:

<a href="https://kmp.jetbrains.com">
   <img src="/img/multiplatform-create-project-button.png" alt="Create a project" />
</a>

## Notes (注意)

Warning:

:::note
Support for K2 in the kapt compiler plugin is [Experimental](components-stability).
Opt-in is required (see details below), and you should use it only for evaluation purposes.

Note:

As for native platform libraries shipped with Kotlin/Native (like Foundation, UIKit, and POSIX),  only some of their
APIs need an opt-in with `@ExperimentalForeignApi`. In such cases, you get a warning with an opt-in requirement.

:::

Tip:

:::tip
As for native platform libraries shipped with Kotlin/Native (like Foundation, UIKit, and POSIX),  only some of their
APIs need an opt-in with `@ExperimentalForeignApi`. In such cases, you get a warning with an opt-in requirement.

:::