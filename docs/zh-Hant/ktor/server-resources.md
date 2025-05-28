[//]: # (title: 型別安全路由)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Resources"/>
<var name="package_name" value="io.ktor.server.resources"/>
<var name="artifact_name" value="ktor-server-resources"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:ktor-server-resources</code>
</p>
<var name="example_name" value="resource-routing"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>Resources 外掛程式允許您實作型別安全路由。</link-summary>

Ktor 提供 [Resources](https://api.ktor.io/ktor-shared/ktor-resources/io.ktor.resources/-resources/index.html) 外掛程式，讓您能夠實作型別安全的[路由](server-routing.md)。為此，您需要建立一個將作為型別化路由的類別，然後使用 `@Resource` 關鍵字註解此類別。請注意，`@Resource` 註解具有由 kotlinx.serialization 函式庫提供的 `@Serializable` 行為。

> Ktor 客戶端提供了向伺服器發送[型別化請求](client-resources.md)的能力。

## 新增依賴項 {id="add_dependencies"}

### 新增 kotlinx.serialization {id="add_serialization"}

鑑於[資源類別](#resource_classes)應具有 `@Serializable` 行為，您需要依照 [設定](https://github.com/Kotlin/kotlinx.serialization#setup) 部分的說明，新增 Kotlin 序列化外掛程式。

### 新增 Resources 依賴項 {id="add_plugin_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝 Resources {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 建立資源類別 {id="resource_classes"}

<snippet id="resource_classes_server">

每個資源類別都應具有 `@Resource` 註解。
下方我們將探討幾個資源類別的範例——定義單一路徑區段、查詢和路徑參數等等。

### 資源 URL {id="resource_url"}

以下範例展示了如何定義 `Articles` 類別，該類別指定了一個在 `/articles` 路徑上響應的資源。

```kotlin
import io.ktor.resources.*

@Resource("/articles")
class Articles()
```

### 帶有查詢參數的資源 {id="resource_query_param"}

下方 `Articles` 類別具有 `sort` 字串屬性，其作用為[查詢參數](server-requests.md#query_parameters)，並允許您定義一個在以下路徑上帶有 `sort` 查詢參數的資源：`/articles?sort=new`。

```kotlin
@Resource("/articles")
class Articles(val sort: String? = "new")
```

### 帶有巢狀類別的資源 {id="resource_nested"}

您可以巢狀類別以建立包含多個路徑區段的資源。請注意，在此情況下，巢狀類別應具有一個外部類別型別的屬性。
以下範例顯示了一個在 `/articles/new` 路徑上響應的資源。

```kotlin
@Resource("/articles")
class Articles() {
    @Resource("new")
    class New(val parent: Articles = Articles())
}
```

### 帶有路徑參數的資源 {id="resource_path_param"}

以下範例展示了如何新增[巢狀](#resource_nested)的整數 `{id}` [路徑參數](server-routing.md#path_parameter)，該參數匹配一個路徑區段並將其作為名為 `id` 的參數捕獲。

```kotlin
@Resource("/articles")
class Articles() {
    @Resource("{id}")
    class Id(val parent: Articles = Articles(), val id: Long)
}
```

例如，此資源可用於響應 `/articles/12`。

</snippet>

### 範例：用於 CRUD 操作的資源 {id="example_crud"}

讓我們總結上述範例，並建立用於 CRUD 操作的 `Articles` 資源。

```kotlin
```
{src="snippets/resource-routing/src/main/kotlin/resourcerouting/Application.kt" include-lines="16-26"}

此資源可用於列出所有文章、發布新文章、編輯文章等等。我們將在下一章中看到如何為此資源[定義路由處理器](#define_route)。

> 您可以在此處找到完整範例：[resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing)。

## 定義路由處理器 {id="define_route"}

若要為型別化資源[定義路由處理器](server-routing.md#define_route)，您需要將資源類別傳遞給動詞函式（`get`、`post`、`put` 等）。
例如，下方路由處理器響應 `/articles` 路徑。

```kotlin
@Resource("/articles")
class Articles()

fun Application.module() {
    install(Resources)
    routing {
        get<Articles> { articles ->
            // Get all articles ...
            call.respondText("List of articles: $articles")
        }
    }
}
```

以下範例展示了如何為在 [](#example_crud) 中建立的 `Articles` 資源定義路由處理器。請注意，在路由處理器內部，您可以將 `Article` 作為參數存取並獲取其屬性值。

```kotlin
```
{src="snippets/resource-routing/src/main/kotlin/resourcerouting/Application.kt" include-lines="30-60,88-89"}

以下是處理每個端點請求的幾點提示：

- `get<Articles>`

   此路由處理器應根據 `sort` 查詢參數返回所有文章。
   例如，這可能是一個帶有所有文章的 [HTML 頁面](server-responses.md#html) 或 [JSON 物件](server-responses.md#object)。

- `get<Articles.New>`

   此端點響應一個包含用於建立新文章欄位的[網頁表單](server-responses.md#html)。
- `post<Articles>`

   `post<Articles>` 端點應接收使用網頁表單發送的[參數](server-requests.md#form_parameters)。
   Ktor 也允許您使用 `ContentNegotiation` 外掛程式將 JSON 資料作為[物件](server-requests.md#objects)接收。
- `get<Articles.Id>`

   此路由處理器應返回具有指定識別碼的文章。
   這可能是一個顯示文章的 [HTML 頁面](server-responses.md#html) 或一個帶有文章資料的 [JSON 物件](server-responses.md#object)。
- `get<Articles.Id.Edit>`

  此端點響應一個包含用於編輯現有文章欄位的[網頁表單](server-responses.md#html)。
- `put<Articles.Id>`

   類似於 `post<Articles>` 端點，`put` 處理器接收使用網頁表單發送的[表單參數](server-requests.md#form_parameters)。
- `delete<Articles.Id>`

   此路由處理器刪除具有指定識別碼的文章。

您可以在此處找到完整範例：[resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing)。

## 從資源建構連結 {id="resource_links"}

除了將資源定義用於路由之外，它們還可以用於建構連結。
這有時被稱為 _反向路由_。
從資源建構連結在您需要將這些連結新增到使用 [HTML DSL](server-html-dsl.md) 建立的 HTML 文件中，或者需要產生[重新導向回應](server-responses.md#redirect)時可能會有所幫助。

`Resources` 外掛程式透過多載的 [href](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-resources/io.ktor.server.resources/href.html) 方法擴展了 `Application`，該方法允許您從 `Resource` 產生連結。例如，以下程式碼片段為[上方定義的](#example_crud) `Edit` 資源建立一個連結：

```kotlin
```
{src="snippets/resource-routing/src/main/kotlin/resourcerouting/Application.kt" include-lines="75"}

由於祖父級 `Articles` 資源定義了預設值為 `new` 的 `sort` 查詢參數，因此 `link` 變數包含：

```
/articles/123/edit?sort=new
```

為了產生指定主機和協定的 URL，您可以向 `href` 方法提供 `URLBuilder`。
額外的查詢參數也可以使用 `URLBuilder` 指定，如下方範例所示：

```kotlin
```
{src="snippets/resource-routing/src/main/kotlin/resourcerouting/Application.kt" include-lines="79-81"}

隨後，`link` 變數包含：

```
https://ktor.io/articles?token=123
```

### 範例 {id="example_build_links"}

以下範例展示了如何將從資源建構的連結新增到 HTML 響應中：

```kotlin
```
{src="snippets/resource-routing/src/main/kotlin/resourcerouting/Application.kt" include-lines="62-87"}

您可以在此處找到完整範例：[resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing)。