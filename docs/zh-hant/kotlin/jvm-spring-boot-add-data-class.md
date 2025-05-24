---
title: "將資料類別新增到 Spring Boot 專案"
description: "將 Kotlin 資料類別新增到 Spring Boot 專案。"
---
:::info
<p>
   這是 <strong>Spring Boot 與 Kotlin 入門</strong>教學的第二部分。在繼續之前，請確保您已完成之前的步驟：
</p><br/>
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step"/> <a href="jvm-create-project-with-spring-boot">使用 Kotlin 建立 Spring Boot 專案</a><br/><img src="/img/icon-2.svg" width="20" alt="Second step"/> <strong>將資料類別新增至 Spring Boot 專案</strong><br/><img src="/img/icon-3-todo.svg" width="20" alt="Third step"/> 新增 Spring Boot 專案的資料庫支援<br/><img src="/img/icon-4-todo.svg" width="20" alt="Fourth step"/> 使用 Spring Data CrudRepository 進行資料庫存取
</p>

:::

在本教學的這一部分，您將向應用程式新增更多功能，並探索更多 Kotlin 語言特性，例如資料類別 (data classes)。
它需要變更 `MessageController` 類別，以回應包含序列化物件集合的 JSON 文件。

## 更新您的應用程式

1. 在同一個套件 (package) 中，建立一個 `Message.kt` 檔案，其中包含具有兩個屬性的資料類別：`id` 和 `text`：

    ```kotlin
    // Message.kt
    package demo
   
    data class Message(val id: String?, val text: String)
    ```

   `Message` 類別將用於資料傳輸：序列化的 `Message` 物件清單將構成控制器 (controller) 回應瀏覽器請求的 JSON 文件。
<h3>資料類別 – data class Message</h3>
<p>
   Kotlin 中<a href="data-classes">資料類別 (data classes)</a>的主要目的是保存資料。此類類別標記有 `data` 關鍵字，並且某些標準功能和某些公用程式函式通常可以從類別結構中機械地推導出來。
</p>
<p>
   在此範例中，您將 `Message` 宣告為資料類別，因為其主要目的是儲存資料。
</p>
<h3>val 和 var 屬性</h3>
<p>
   Kotlin 類別中的 <a href="properties">屬性 (properties)</a> 可以宣告為：
</p>
<list>
<li><i>可變 (mutable)</i>，使用 `var` 關鍵字</li>
<li><i>唯讀 (read-only)</i>，使用 `val` 關鍵字</li>
</list>
<p>
   `Message` 類別使用 `val` 關鍵字宣告了兩個屬性，`id` 和 `text`。
          編譯器將自動為這兩個屬性產生 getter。
          建立 `Message` 類別的實例後，將無法重新賦值這些屬性的值。
</p>
<h3>可為空類型 – String?</h3>
<p>
   Kotlin 提供了 <a href="null-safety#nullable-types-and-non-nullable-types">對可為空類型 (nullable types) 的內建支援</a>。在 Kotlin 中，類型系統區分可以容納 `null` 的引用（<i>可為空引用 (nullable references)</i>）和不能容納 `null` 的引用（<i>不可為空引用 (non-nullable references)</i>）。<br/>
          例如，類型為 `String` 的常規變數不能容納 `null`。若要允許 null，您可以透過寫入 `String?` 將變數宣告為可為空的字串。
</p>
<p>
   `Message` 類別的 `id` 屬性這次宣告為可為空類型。
          因此，可以透過傳遞 `null` 作為 `id` 的值來建立 `Message` 類別的實例：
</p>
          ```kotlin
Message(null, "Hello!")
```
       
   
2. 在 `MessageController.kt` 檔案中，建立 `listMessages()` 函式，該函式會傳回 `Message` 物件的清單，而不是 `index()` 函式：

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
<h3>集合 – listOf()</h3>
<p>
   Kotlin 標準函式庫提供了基本集合類型 (collection types) 的實作：集合 (sets)、清單 (lists) 和對應 (maps)。<br/>
          一對介面 (interfaces) 代表每種集合類型：
</p>
<list>
<li>一個<i>唯讀 (read-only)</i> 介面，提供用於存取集合元素的運算。</li>
<li>一個<i>可變 (mutable)</i> 介面，透過寫入運算延伸相應的唯讀介面：新增、移除和更新其元素。</li>
</list>
<p>
   Kotlin 標準函式庫也提供了相應的工廠函式 (factory functions) 來建立此類集合的實例。
</p>
<p>
   在本教學中，您可以使用 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/list-of.html">`listOf()`</a> 函式來建立 `Message` 物件的清單。
          這是建立物件<i>唯讀 (read-only)</i> 清單的工廠函式：您無法從清單中新增或移除元素。<br/>
          如果需要在清單上執行寫入運算，請呼叫 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/mutable-list-of.html">`mutableListOf()`</a> 函式以建立可變清單實例。
</p>
<h3>尾隨逗號 (Trailing comma)</h3>
<p>
   <a href="coding-conventions#trailing-commas">尾隨逗號 (trailing comma)</a> 是元素系列中<b>最後一個項目</b>之後的逗號符號：
</p>
            ```kotlin
Message("3", "Privet!"),
```
<p>
   這是 Kotlin 語法的一個方便功能，並且完全是可選的 – 您的程式碼在沒有它們的情況下仍然可以運作。
</p>
<p>
   在上面的範例中，建立 `Message` 物件的清單包括最後一個 `listOf()` 函式引數之後的尾隨逗號。
</p>
       
    

現在，來自 `MessageController` 的回應將是一個 JSON 文件，其中包含 `Message` 物件的集合。

:::note
如果 Jackson 程式庫位於類別路徑 (classpath) 上，則 Spring 應用程式中的任何控制器 (controller) 預設都會呈現 JSON 回應。
由於您[在 `build.gradle.kts` 檔案中指定了 `spring-boot-starter-web` 依賴項](jvm-create-project-with-spring-boot#explore-the-project-gradle-build-file)，因此您已收到 Jackson 作為<i>傳遞性 (transitive)</i> 依賴項。
因此，如果端點 (endpoint) 傳回可以序列化為 JSON 的資料結構，則應用程式會回應 JSON 文件。

:::

以下是 `DemoApplication.kt`、`MessageController.kt` 和 `Message.kt` 檔案的完整程式碼：

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

## 執行應用程式

Spring 應用程式已準備好執行：

1. 再次執行應用程式。

2. 應用程式啟動後，開啟以下 URL：

    ```text
    http://localhost:8080
    ```

    您將看到一個頁面，其中包含 JSON 格式的訊息集合：

    <img src="/img/messages-in-json-format.png" alt="Run the application" width="800" style={{verticalAlign: 'middle'}}/>

## 下一步

在本教學的下一部分中，您將新增資料庫並將其設定到您的專案中，並發出 HTTP 請求。

**[前往下一章](jvm-spring-boot-add-db-support)**