[//]: # (title: 將數據類新增至 Spring Boot 專案)

<web-summary>將 Kotlin 數據類新增至 Spring Boot 專案。</web-summary>

<tldr>
    <p>這是 **Spring Boot 與 Kotlin 入門** 教學課程的第二部分。在繼續之前，請確保您已完成先前的步驟：</p><br/>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot.md">使用 Kotlin 建立 Spring Boot 專案</a><br/><img src="icon-2.svg" width="20" alt="Second step"/> <strong>將數據類新增至 Spring Boot 專案</strong><br/><img src="icon-3-todo.svg" width="20" alt="Third step"/> 為 Spring Boot 專案新增資料庫支援<br/><img src="icon-4-todo.svg" width="20" alt="Fourth step"/> 使用 Spring Data CrudRepository 進行資料庫存取</p>
</tldr>

在本教學課程的這部分中，您將為應用程式新增更多功能，並探索更多 Kotlin 語言功能，例如數據類。這需要變更 `MessageController` 類別，使其回應包含序列化物件集合的 JSON 文件。

## 更新您的應用程式

1.  在與 `DemoApplication.kt` 檔案相同的套件中，建立一個 `Message.kt` 檔案。
2.  在 `Message.kt` 檔案中，建立一個具有兩個屬性：`id` 和 `text` 的數據類：

    ```kotlin
    // Message.kt
    package com.example.demo
   
    data class Message(val id: String?, val text: String)
    ```

   `Message` 類別將用於資料傳輸：序列化的 `Message` 物件列表將構成控制器回應瀏覽器請求的 JSON 文件。

   <deflist collapsible="true">
       <def title="數據類 – data class Message">
          <p>Kotlin 中 <a href="data-classes.md">數據類</a> 的主要目的是儲存資料。這類別會以 `data` 關鍵字標記，並且一些標準功能和一些公用程式函數通常可以從類別結構中機械地衍生出來。</p>
          <p>在這個範例中，您將 `Message` 宣告為數據類，因為其主要目的是儲存資料。</p>
       </def>
       <def title="val 和 var 屬性">
          <p>Kotlin 類別中的 <a href="properties.md">屬性</a> 可以宣告為：</p>
          <list>
             <li><i>可變的</i>，使用 `var` 關鍵字</li>
             <li><i>唯讀的</i>，使用 `val` 關鍵字</li>
          </list>
          <p>`Message` 類別使用 `val` 關鍵字宣告了兩個屬性：`id` 和 `text`。編譯器將自動為這兩個屬性產生 getter。在建立 `Message` 類別的實例後，將無法重新指派這些屬性的值。</p>
       </def>
       <def title="可空類型 – String?">
          <p>Kotlin 提供 <a href="null-safety.md#nullable-types-and-non-nullable-types">內建的可空類型支援</a>。在 Kotlin 中，型別系統區分可以容納 `null` 的引用（<i>可空引用</i>）和不能容納 `null` 的引用（<i>非空引用</i>）。<br/>
          例如，型別為 `String` 的常規變數不能容納 `null`。為了允許 null，您可以將變數宣告為可空字串，寫作 `String?`。</p>
          <p>`id` 屬性這次被宣告為可空類型。因此，可以透過傳遞 `null` 作為 `id` 的值來建立 `Message` 類別的實例：</p>
          <code-block lang="kotlin">
          Message(null, "Hello!")
          </code-block>
       </def>
   </deflist>
3.  在 `MessageController.kt` 檔案中，建立 `listMessages()` 函數以取代 `index()` 函數，並使其傳回 `Message` 物件的列表：

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
          <p>Kotlin 標準函式庫為基本集合類型（：集、列表和映射）提供實作。<br/>
          每種集合類型都可以是 <i>唯讀</i> 或 <i>可變</i> 的：</p>
          <list>
              <li><i>唯讀</i> 集合提供用於存取集合元素的操作。</li>
              <li><i>可變</i> 集合也提供用於新增、移除和更新其元素的寫入操作。</li>
          </list>
          <p>Kotlin 標準函式庫也提供了對應的工廠函數來建立這類集合的實例。</p>
          <p>在本教學課程中，您使用 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html"><code>listOf()</code></a> 函數來建立 <code>Message</code> 物件的列表。這是建立物件 <i>唯讀</i> 列表的工廠函數：您無法從列表中新增或移除元素。<br/>
          如果需要對列表執行寫入操作，請呼叫 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html"><code>mutableListOf()</code></a> 函數來建立可變列表實例。</p>
       </def>
       <def title="尾隨逗號">
          <p><a href="coding-conventions.md#trailing-commas">尾隨逗號</a> 是位於一系列元素中 **最後一項** 之後的逗號符號：</p>
            <code-block lang="kotlin">
            Message("3", "Privet!"),
            </code-block>
          <p>這是 Kotlin 語法的一個方便功能，完全是可選的 – 即使沒有它們，您的程式碼也能正常運作。</p>
          <p>在上面的範例中，建立 `Message` 物件列表時，在最後一個 `listOf()` 函數參數之後包含了尾隨逗號。</p>
    </deflist>

現在，`MessageController` 的回應將是一個包含 `Message` 物件集合的 JSON 文件。

> 任何 Spring 應用程式中的控制器，如果 Jackson 函式庫位於類別路徑 (classpath) 上，預設會呈現 JSON 回應。由於您 [在 `build.gradle.kts` 檔案中指定了 `spring-boot-starter-web` 依賴](jvm-create-project-with-spring-boot.md#explore-the-project-gradle-build-file)，因此您會收到 Jackson 作為 _傳遞性_ 依賴。因此，如果端點傳回可序列化為 JSON 的資料結構，應用程式將以 JSON 文件回應。
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

1.  再次執行應用程式。

2.  應用程式啟動後，開啟以下 URL：

    ```text
    http://localhost:8080
    ```

    您將看到一個頁面，其中包含 JSON 格式的訊息集合：

    ![Run the application](messages-in-json-format.png){width=800}

## 下一步

在本教學課程的下一部分中，您將為專案新增並設定資料庫，並發出 HTTP 請求。

**[前往下一章](jvm-spring-boot-add-db-support.md)**