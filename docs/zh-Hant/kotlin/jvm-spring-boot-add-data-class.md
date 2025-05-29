[//]: # (title: 將資料類別新增至 Spring Boot 專案)
[//]: # (description: 將 Kotlin 資料類別新增至 Spring Boot 專案。)

<tldr>
    <p>這是 **Spring Boot 與 Kotlin 入門** 教學的第二部分。在繼續之前，請確保您已完成先前的步驟：</p><br/>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot.md">使用 Kotlin 建立 Spring Boot 專案</a><br/><img src="icon-2.svg" width="20" alt="Second step"/> <strong>將資料類別新增至 Spring Boot 專案</strong><br/><img src="icon-3-todo.svg" width="20" alt="Third step"/> 為 Spring Boot 專案新增資料庫支援<br/><img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 使用 Spring Data CrudRepository 進行資料庫存取</p>
</tldr>

在本教學部分中，您將為應用程式新增更多功能，並探索更多 Kotlin 語言特性，例如資料類別。
這需要修改 `MessageController` 類別，使其回傳一個包含序列化物件集合的 JSON 文件。

## 更新您的應用程式

1. 在相同套件中，於 `DemoApplication.kt` 檔案旁，建立一個 `Message.kt` 檔案。
2. 在 `Message.kt` 檔案中，建立一個具有兩個屬性：`id` 和 `text` 的資料類別：

    ```kotlin
    // Message.kt
    package com.example.demo
   
    data class Message(val id: String?, val text: String)
    ```

   `Message` 類別將用於資料傳輸：序列化的 `Message` 物件列表將構成控制器回應瀏覽器請求的 JSON 文件。

   <deflist collapsible="true">
       <def title="資料類別 – data class Message">
          <p>Kotlin 中 <a href="data-classes.md">資料類別</a> 的主要目的是儲存資料。這類類別用 `data` 關鍵字標記，並且一些標準功能和實用函數通常可以從類別結構中機械地推導出來。</p>
          <p>在此範例中，您將 `Message` 宣告為資料類別，因為其主要目的是儲存資料。</p>
       </def>
       <def title="val 和 var 屬性">
          <p>Kotlin 類別中的 <a href="properties.md">屬性</a> 可以宣告為：</p>
          <list>
             <li><i>可變的</i>，使用 `var` 關鍵字</li>
             <li><i>唯讀的</i>，使用 `val` 關鍵字</li>
          </list>
          <p>`Message` 類別使用 `val` 關鍵字宣告了兩個屬性：`id` 和 `text`。
          編譯器將自動為這兩個屬性生成 getter。
          在建立 `Message` 類別的實例後，將無法重新指定這些屬性的值。
          </p>
       </def>
       <def title="可空類型 – String?">
          <p>Kotlin 提供 <a href="null-safety.md#nullable-types-and-non-nullable-types">可空類型</a> 的內建支援。在 Kotlin 中，類型系統區分可以儲存 `null` 的參照（<i>可空參照</i>）和不能儲存 `null` 的參照（<i>非可空參照</i>）。<br/>
          例如，類型為 `String` 的常規變數不能儲存 `null`。若要允許 null 值，您可以將變數宣告為可空字串，寫作 `String?`。
          </p>
          <p>`Message` 類別的 `id` 屬性這次被宣告為可空類型。
          因此，可以透過傳遞 `null` 作為 `id` 的值來建立 `Message` 類別的實例：
          </p>
          <code-block lang="kotlin">
          Message(null, "Hello!")
          </code-block>
       </def>
   </deflist>
3. 在 `MessageController.kt` 檔案中，取代 `index()` 函數，建立一個回傳 `Message` 物件列表的 `listMessages()` 函數：

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
          <p>Kotlin 標準函式庫 (Standard Library) 為基本集合類型提供了實作：集合 (sets)、列表 (lists) 和映射 (maps)。<br/>
          每個集合類型可以是 <i>唯讀</i> 或 <i>可變</i> 的：</p>
          <list>
              <li>一個 <i>唯讀</i> 集合提供用於存取集合元素的操作。</li>
              <li>一個 <i>可變</i> 集合也提供用於新增、移除和更新其元素的寫入操作。</li>
          </list>
          <p>Kotlin 標準函式庫 (Standard Library) 也提供了對應的工廠函數 (factory functions) 來建立此類集合的實例。
          </p>
          <p>在本教學中，您使用 [<code-block lang="text" no-highlight="true">listOf()</code-block>](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html) 函數來建立 `Message` 物件的列表。
          這是建立 <i>唯讀</i> 物件列表的工廠函數：您無法從列表中新增或移除元素。<br/>
          如果需要對列表執行寫入操作，請呼叫 [<code-block lang="text" no-highlight="true">mutableListOf()</code-block>](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html) 函數來建立可變列表實例。
          </p>
       </def>
       <def title="尾隨逗號">
          <p>[尾隨逗號](coding-conventions.md#trailing-commas) 是指一系列元素中 <b>最後一個項目</b> 後的逗號符號：</p>
            <code-block lang="kotlin">
            Message("3", "Privet!"),
            </code-block>
          <p>這是 Kotlin 語法的一個方便特性，並且是完全可選的 – 即使沒有它們，您的程式碼仍然可以運作。
          </p>
          <p>在上面的範例中，建立 `Message` 物件列表時在最後一個 `listOf()` 函數參數後包含了尾隨逗號。</p>
       </def>
    </deflist>

`MessageController` 的回應現在將是一個包含 `Message` 物件集合的 JSON 文件。

> Spring 應用程式中的任何控制器，如果 Jackson 函式庫 (library) 位於類別路徑 (classpath) 上，預設會呈現 JSON 回應。
> 由於您在 [`build.gradle.kts` 檔案中指定了 `spring-boot-starter-web` 依賴](jvm-create-project-with-spring-boot.md#explore-the-project-gradle-build-file)，因此您收到了 Jackson 作為一個 _傳遞性_ 依賴 (transitive dependency)。
> 因此，如果端點回傳一個可以序列化為 JSON 的資料結構，應用程式就會回應一個 JSON 文件。
>
{style="note"}

以下是 `DemoApplication.kt`、`MessageController.kt` 和 `Message.kt` 檔案的完整程式碼：

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

## 執行應用程式

Spring 應用程式已準備好執行：

1. 再次執行應用程式。

2. 一旦應用程式啟動，開啟以下 URL：

    ```text
    http://localhost:8080
    ```

    您將看到一個包含 JSON 格式訊息集合的頁面：

    ![執行應用程式](messages-in-json-format.png){width=800}

## 下一步

在本教學的下一部分，您將為專案新增並設定資料庫，並發出 HTTP 請求。

**[繼續前往下一章](jvm-spring-boot-add-db-support.md)**