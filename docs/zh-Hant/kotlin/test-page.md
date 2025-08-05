[//]: # (title: 測試頁面)

<web-summary>此頁面僅供測試用途。</web-summary>

<no-index/>

<tldr>
   <p>這是一個包含圖片的區塊（取自<strong>Compose Multiplatform 入門</strong>教學）。</p>
   <p><img src="icon-1-done.svg" width="20" alt="第一步"/> <a href="jvm-create-project-with-spring-boot.md">使用 Kotlin 建立 Spring Boot 專案</a><br/>
      <img src="icon-2-done.svg" width="20" alt="第二步"/> <a href="jvm-spring-boot-add-data-class.md">向 Spring Boot 專案添加資料類別</a><br/>
      <img src="icon-3.svg" width="20" alt="第三步"/> <strong>為 Spring Boot 專案添加資料庫支援</strong><br/>
      <img src="icon-4-todo.svg" width="20" alt="第四步"/> 使用 Spring Data CrudRepository 進行資料庫存取><br/>
    </p>
</tldr>

## 同步分頁

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

## 章節

### 可摺疊章節 {initial-collapse-state="collapsed" collapsible="true"}

這裡有一些文字和一個程式碼區塊：

```kotlin
plugins {
    kotlin("plugin.noarg") version "1.9.23"
}
```

## 程式碼區塊

只是一個程式碼區塊：

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

### 可展開的程式碼區塊

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

### 可執行的程式碼區塊

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    val user = User("Alex", 1)
    
    //sampleStart
    // 自動使用 toString() 函式以便於閱讀輸出
    println(user)            
    // User(name=Alex, id=1)
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 表格

### Markdown 表格

| 原始類型陣列 | Java 中的等效項 |
|--------------------|--------------------|
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
        <td><strong>上次修改時間</strong></td>
        <td><strong>2023 年 12 月</strong></td>
    </tr>
    <tr>
        <td><strong>下次更新</strong></td>
        <td><strong>2024 年 6 月</strong></td>
    </tr>
</table>

### 帶有程式碼區塊的 XML 表格

簡單表格：

<table>
    <tr>
        <td>之前</td>
        <td>現在</td>
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

更複雜的表格：

<table>
    <tr>
        <td></td>
        <td>之前</td>
        <td>現在</td>
    </tr>
    <tr>
        <td rowspan="2"><code>jvmMain</code> 編譯的依賴項</td>
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
        <td><code>jvmMain</code> 原始碼集的依賴項</td>
<td colspan="2">

```kotlin
jvmMain<Scope>
```

</td>
    </tr>
    <tr>
        <td><code>jvmTest</code> 編譯的依賴項</td>
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
        <td><code>jvmTest</code> 原始碼集的依賴項</td>
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
    1. 三點一
    2. 三點二
    3. 三點三
        1. 三點一又一
4. 內部包含程式碼區塊：

   ```kotlin
   jvmTest<Scope>
   ```

### 無序列表

*   第一個項目
*   第二個項目
*   第三個項目
    *   再一個
    *   又一個
        *   哇，再來一個
*   內部包含程式碼區塊：

   ```kotlin
   jvmTest<Scope>
   ```

### 定義列表

<deflist collapsible="true">
   <def title="可摺疊項目 #1">
      <p><code>CrudRepository</code> 介面中 <code>findById()</code> 函式的回傳類型是 <code>Optional</code> 類別的實例。然而，為了保持一致性，回傳包含單一訊息的 <code>List</code> 會更方便。為此，您需要解開 <code>Optional</code> 值（如果存在），並回傳包含該值的列表。這可以作為 <code>Optional</code> 類型的一個<a href="extensions.md#extension-functions">擴充函式</a>來實作。</p>
      <p>在程式碼中，<code>Optional&lt;out T&gt;.toList()</code> 中，<code>.toList()</code> 是 <code>Optional</code> 的擴充函式。擴充函式允許您為任何類別編寫額外的函式，當您想要擴展某些程式庫類別的功能時，這特別有用。</p>
   </def>
   <def title="可摺疊項目 #2">
      <p><a href="https://docs.spring.io/spring-data/jdbc/docs/current/reference/html/#jdbc.entity-persistence">此函式的作用前提是</a>新物件在資料庫中沒有 ID。因此，為了插入，ID <b>應為 null</b>。</p>
      <p> 如果 ID 不為 <i>null</i>，<code>CrudRepository</code> 會假定該物件已存在於資料庫中，並且這是一個<i>更新</i>操作，而不是<i>插入</i>操作。在插入操作之後，<code>id</code> 將由資料儲存產生並重新分配給 <code>Message</code> 實例。這就是為什麼應使用 <code>var</code> 關鍵字宣告 <code>id</code> 屬性。</p>
      <p></p>
   </def>
</deflist>

## 文字元素

* **粗體文字**
* _斜體文字_
* `inline code`
* [內部錨點](#lists)
* [內部連結](roadmap.md)
* [外部連結](https://jetbrains.com)
* 表情符號 ❌✅🆕

## 變數
* 變數使用：最新 Kotlin 版本是 %kotlinVersion%

## 嵌入元素

### 來自 YouTube 的影片

<video src="https://www.youtube.com/v/Ol_96CHKqg8" title="Kotlin 1.9.20 的新功能"/>

### 圖片

常規 (Markdown)：

![建立測試](create-test.png){width="700"}

常規 (XML)：

<img src="multiplatform-web-wizard.png" alt="跨平台網頁精靈" width="400"/>

內聯：

![YouTrack](youtrack-logo.png){width=30}{type="joined"}

可縮放：

![類別圖](ksp-class-diagram.svg){thumbnail="true" width="700" thumbnail-same-file="true"}

按鈕樣式：

<a href="https://kmp.jetbrains.com">
   <img src="multiplatform-create-project-button.png" alt="建立專案" style="block"/>
</a>

## 註釋

警告：

> K2 在 kapt 編譯器外掛程式中的支援是[實驗性](components-stability.md)的。
> 需要選擇加入（詳情見下文），並且您應僅將其用於評估目的。
>
{style="warning"}

註：

> 至於 Kotlin/Native 隨附的原生平台程式庫（例如 Foundation、UIKit 和 POSIX），只有其中一些 API 需要選擇加入 `@ExperimentalForeignApi`。在這種情況下，您會收到帶有選擇加入要求的警告。
>
{style="note"}

提示：

> 至於 Kotlin/Native 隨附的原生平台程式庫（例如 Foundation、UIKit 和 POSIX），只有其中一些 API 需要選擇加入 `@ExperimentalForeignApi`。在這種情況下，您會收到帶有選擇加入要求的警告。
>
{style="tip"}