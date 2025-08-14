[//]: # (title: 型別安全請求)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<var name="plugin_name" value="Resources"/>
<var name="artifact_name" value="ktor-client-resources"/>

<tldr>
<p>
<b>所需相依性</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-type-safe-requests"/>

    <p>
        <b>程式碼範例</b>：
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<link-summary>
了解如何使用 Resources 外掛程式建立型別安全請求。
</link-summary>

Ktor 提供了 `%plugin_name%` 外掛程式，讓您可以實作型別安全的 [請求](client-requests.md)。為此，您需要建立一個描述伺服器上可用資源的類別，然後使用 `@Resource` 關鍵字註解此類別。請注意，`@Resource` 註解具有由 kotlinx.serialization 函式庫提供的 `@Serializable` 行為。

> Ktor 伺服器提供了實作 [型別安全路由](server-resources.md) 的能力。

## 新增相依性 {id="add_dependencies"}

### 新增 kotlinx.serialization {id="add_serialization"}

由於 [資源類別](#resource_classes) 應具備 `@Serializable` 行為，您需要依照 [設定](https://github.com/Kotlin/kotlinx.serialization#setup) 部分所述新增 Kotlin 序列化外掛程式。

### 新增 %plugin_name% 相依性 {id="add_plugin_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> artifact：
    </p>
    

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

    <p>
        您可以從 <Links href="/ktor/client-dependencies" summary="了解如何將客戶端相依性新增至現有專案。">新增客戶端相依性</Links> 了解更多關於 Ktor 客戶端所需的 artifact。
    </p>
    

## 安裝 %plugin_name% {id="install_plugin"}

要安裝 `%plugin_name%`，請在 [客戶端設定區塊](client-create-and-configure.md#configure-client) 內部將其傳遞給 `install` 函數：
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

<snippet id="resource_classes_server">

每個資源類別都應具有 `@Resource` 註解。
下方，我們將查看幾個資源類別的範例 — 定義單一路徑區段、查詢與路徑參數等等。

### 資源 URL {id="resource_url"}

以下範例展示如何定義 `Articles` 類別，該類別指定一個回應 `/articles` 路徑的資源。

```kotlin
import io.ktor.resources.*

@Resource("/articles")
class Articles()
```

### 帶有查詢參數的資源 {id="resource_query_param"}

以下 `Articles` 類別具有 `sort` 字串屬性，該屬性充當一個 [查詢參數](server-requests.md#query_parameters)，讓您可以定義一個帶有 `sort` 查詢參數，並回應以下路徑的資源：`/articles?sort=new`。

```kotlin
@Resource("/articles")
class Articles(val sort: String? = "new")
```

### 帶有巢狀類別的資源 {id="resource_nested"}

您可以巢狀化類別以建立包含多個路徑區段的資源。請注意，在此情況下，巢狀類別應具有一個外部類別型別的屬性。
以下範例展示一個回應 `/articles/new` 路徑的資源。

```kotlin
@Resource("/articles")
class Articles() {
@Resource("new")
class New(val parent: Articles = Articles())
}
```

### 帶有路徑參數的資源 {id="resource_path_param"}

以下範例示範如何新增 [巢狀的](#resource_nested) `{id}` 整數 [路徑參數](server-routing.md#path_parameter)，該參數匹配一個路徑區段並將其擷取為名為 `id` 的參數。

```kotlin
@Resource("/articles")
class Articles() {
@Resource("{id}")
class Id(val parent: Articles = Articles(), val id: Long)
}
```

舉例來說，此資源可用於回應 `/articles/12`。

</snippet>

### 範例：用於 CRUD 操作的資源 {id="example_crud"}

讓我們總結以上範例，並建立用於 CRUD 操作的 `Articles` 資源。

[object Promise]

此資源可用於列出所有文章、發布新文章、編輯它等等。我們將在下一節中看到如何向此資源 [發出型別安全請求](#make_requests)。

> 您可以在此處找到完整範例：[client-type-safe-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-type-safe-requests)。

## 發出型別安全請求 {id="make_requests"}

要向型別化資源 [發出請求](client-requests.md)，您需要將資源類別實例傳遞給請求函數（`request`、`get`、`post`、`put` 等等）。例如，以下範例展示如何向 `/articles` 路徑發出請求。

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

以下範例展示如何向在 [](#example_crud) 中建立的 `Articles` 資源發出型別化請求。

[object Promise]

`defaultRequest` 函數用於指定所有請求的預設 URL。

> 您可以在此處找到完整範例：[client-type-safe-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-type-safe-requests)。