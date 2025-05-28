[//]: # (title: 類型安全的請求)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<var name="plugin_name" value="Resources"/>
<var name="artifact_name" value="ktor-client-resources"/>

<tldr>
<p>
<b>必備依賴項</b>: <code>io.ktor:ktor-client-resources</code>
</p>
<var name="example_name" value="client-type-safe-requests"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
了解如何使用 Resources 外掛程式來建立類型安全的請求。
</link-summary>

Ktor 提供了 `Resources` 外掛程式，可讓您實作類型安全的 [請求](client-requests.md)。為此，您需要建立一個類別來描述伺服器上可用的資源，然後使用 `@Resource` 關鍵字對此類別進行註解。請注意，`@Resource` 註解具有由 kotlinx.serialization 函式庫提供的 `@Serializable` 行為。

> Ktor 伺服器提供了實作 [類型安全路由](server-resources.md) 的能力。

## 新增依賴項 {id="add_dependencies"}

### 新增 kotlinx.serialization {id="add_serialization"}

由於 [資源類別](#resource_classes) 應具有 `@Serializable` 行為，您需要依照 [設定](https://github.com/Kotlin/kotlinx.serialization#setup) 部分的說明新增 Kotlin 序列化外掛程式。

### 新增 Resources 依賴項 {id="add_plugin_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>
<include from="lib.topic" element-id="add_ktor_client_artifact_tip"/>

## 安裝 Resources {id="install_plugin"}

要安裝 `Resources`，請將其傳遞給 [用戶端配置區塊](client-create-and-configure.md#configure-client) 內的 `install` 函式：
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.resources.*
//...
val client = HttpClient(CIO) {
    install(Resources)
}
```

## 建立資源類別 {id="resource_classes"}

<include from="server-resources.md" element-id="resource_classes_server"/>

### 範例：一個用於 CRUD 操作的資源 {id="example_crud"}

讓我們總結上述範例並為 CRUD 操作建立 `Articles` 資源。

```kotlin
```
{src="snippets/client-type-safe-requests/src/main/kotlin/com/example/Application.kt" include-lines="18-28"}

這個資源可以用於列出所有文章、發佈新文章、編輯文章等等。我們將在下一節中看到如何對此資源進行 [類型安全的請求](#make_requests)。

> 您可以在此處找到完整範例：[client-type-safe-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-type-safe-requests)。

## 建立類型安全的請求 {id="make_requests"}

要對類型化的資源進行 [請求](client-requests.md)，您需要將資源類別實例傳遞給請求函式（例如 `request`、`get`、`post`、`put` 等）。例如，以下範例顯示了如何對 `/articles` 路徑發出請求。

```kotlin
@Resource("/articles")
class Articles()

fun main() {
    runBlocking {
        val client = HttpClient(CIO) {
            install(Resources)
            // ...
        }
        val getAllArticles = client.get(Articles())
    }
}
```

以下範例展示了如何對在 [](#example_crud) 中建立的 `Articles` 資源發出類型化請求。

```kotlin
```
{src="snippets/client-type-safe-requests/src/main/kotlin/com/example/Application.kt" include-lines="30-48,60"}

[defaultRequest](client-default-request.md) 函式用於為所有請求指定預設 URL。

> 您可以在此處找到完整範例：[client-type-safe-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-type-safe-requests)。