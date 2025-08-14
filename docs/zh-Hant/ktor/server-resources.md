[//]: # (title: 型別安全路由)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Resources"/>
<var name="package_name" value="io.ktor.server.resources"/>
<var name="artifact_name" value="ktor-server-resources"/>

<tldr>
<p>
<b>必需的依賴</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="resource-routing"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">原生伺服器</Links>支援</b>: ✅
    </p>
    
</tldr>

<link-summary>Resources 插件允許您實現型別安全路由。</link-summary>

Ktor 提供了 [Resources](https://api.ktor.io/ktor-shared/ktor-resources/io.ktor.resources/-resources/index.html) 插件，允許您實現型別安全的 [路由](server-routing.md)。為此，您需要建立一個將作為型別化路由的類別，然後使用 `@Resource` 註解來為此類別加上註解。請注意，`@Resource` 註解具有 kotlinx.serialization 函式庫提供的 `@Serializable` 行為。

> Ktor 客戶端提供了向伺服器發出 [型別化請求](client-resources.md) 的能力。

## 新增依賴項 {id="add_dependencies"}

### 新增 kotlinx.serialization {id="add_serialization"}

鑑於 [資源類別](#resource_classes) 應具備 `@Serializable` 行為，您需要依照 [設定](https://github.com/Kotlin/kotlinx.serialization#setup) 部分的說明新增 Kotlin 序列化插件。

### 新增 %plugin_name% 依賴項 {id="add_plugin_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> 構件：
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
    

## 安裝 %plugin_name% {id="install_plugin"}

    <p>
        要將 <code>%plugin_name%</code> 插件<a href="#install">安裝</a>到應用程式中，
        將其傳遞給指定<Links href="/ktor/server-modules" summary="Modules allow you to structure your application by grouping routes.">模組</Links>中的 <code>install</code> 函式。
        下面的程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函式呼叫內部。
        </li>
        <li>
            ... 在明確定義的 <code>module</code> 內部，它是 <code>Application</code> 類別的擴充函式。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

## 建立資源類別 {id="resource_classes"}

<snippet id="resource_classes_server">

每個資源類別都應該有 `@Resource` 註解。
下面，我們將看一些資源類別的範例——定義單一路徑片段、查詢參數和路徑參數等等。

### 資源 URL {id="resource_url"}

下面的範例展示了如何定義 `Articles` 類別，該類別指定了一個回應 `/articles` 路徑的資源。

```kotlin
import io.ktor.resources.*

@Resource("/articles")
class Articles()
```

### 帶有查詢參數的資源 {id="resource_query_param"}

下面的 `Articles` 類別具有 `sort` 字串屬性，該屬性作為 [查詢參數](server-requests.md#query_parameters)，允許您定義一個回應以下路徑的資源，並帶有 `sort` 查詢參數：`/articles?sort=new`。

```kotlin
@Resource("/articles")
class Articles(val sort: String? = "new")
```

### 帶有巢狀類別的資源 {id="resource_nested"}

您可以巢狀定義類別來建立包含多個路徑片段的資源。請注意，在這種情況下，巢狀類別應具有一個外部類別型別的屬性。
下面的範例展示了一個回應 `/articles/new` 路徑的資源。

```kotlin
@Resource("/articles")
class Articles() {
    @Resource("new")
    class New(val parent: Articles = Articles())
}
```

### 帶有路徑參數的資源 {id="resource_path_param"}

下面的範例展示了如何新增 [巢狀](#resource_nested) `{id}` 整數 [路徑參數](server-routing.md#path_parameter)，該參數匹配一個路徑片段並將其捕獲為名為 `id` 的參數。

```kotlin
@Resource("/articles")
class Articles() {
    @Resource("{id}")
    class Id(val parent: Articles = Articles(), val id: Long)
}
```

例如，此資源可用於回應 `/articles/12`。

</snippet>

### 範例：用於 CRUD 操作的資源 {id="example_crud"}

讓我們總結上述範例，並建立用於 CRUD 操作的 `Articles` 資源。

[object Promise]

此資源可用於列出所有文章、發布新文章、編輯文章等等。我們將在下一章中看到如何為此資源 [定義路由處理器](#define_route)。

> 您可以在這裡找到完整的範例：[resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing)。

## 定義路由處理器 {id="define_route"}

要為型別化資源 [定義路由處理器](server-routing.md#define_route)，您需要將資源類別傳遞給動作函式（`get`、`post`、`put` 等）。
例如，下面的路由處理器回應 `/articles` 路徑。

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

下面的範例展示了如何為在 [](#example_crud) 中建立的 `Articles` 資源定義路由處理器。請注意，在路由處理器內部，您可以將 `Article` 作為參數存取並取得其屬性值。

[object Promise]

以下是一些處理每個端點請求的技巧：

- `get<Articles>`

   此路由處理器應該根據 `sort` 查詢參數返回所有文章。
   例如，這可能是一個 [HTML 頁面](server-responses.md#html) 或一個包含所有文章的 [JSON 物件](server-responses.md#object)。

- `get<Articles.New>`

   此端點回應一個 [網頁表單](server-responses.md#html)，其中包含用於建立新文章的欄位。
- `post<Articles>`

   `post<Articles>` 端點應該接收使用網頁表單傳送的 [參數](server-requests.md#form_parameters)。
   Ktor 還允許您使用 `ContentNegotiation` 插件將 JSON 資料作為 [物件](server-requests.md#objects) 接收。
- `get<Articles.Id>`

   此路由處理器應該返回具有指定識別符的文章。
   這可能是一個顯示文章的 [HTML 頁面](server-responses.md#html) 或一個包含文章資料的 [JSON 物件](server-responses.md#object)。
- `get<Articles.Id.Edit>`

  此端點回應一個 [網頁表單](server-responses.md#html)，其中包含用於編輯現有文章的欄位。
- `put<Articles.Id>`

   類似於 `post<Articles>` 端點，`put` 處理器接收使用網頁表單傳送的 [表單參數](server-requests.md#form_parameters)。
- `delete<Articles.Id>`

   此路由處理器刪除具有指定識別符的文章。

您可以在這裡找到完整的範例：[resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing)。

## 從資源建置連結 {id="resource_links"}

除了將資源定義用於路由之外，它們還可以用於建置連結。
這有時被稱為 _反向路由_。
如果需要將這些連結新增到使用 [HTML DSL](server-html-dsl.md) 建立的 HTML 文件中，或者需要生成 [重導向回應](server-responses.md#redirect)，那麼從資源建置連結可能很有幫助。

`Resources` 插件擴充了 `Application`，加入了多載的 [href](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-resources/io.ktor.server.resources/href.html) 方法，該方法允許您從 `Resource` 生成連結。例如，下面的程式碼片段為 [上面](#example_crud) 定義的 `Edit` 資源建立了一個連結：

[object Promise]

由於祖級 `Articles` 資源定義了預設值為 `new` 的 `sort` 查詢參數，因此 `link` 變數包含：

```
/articles/123/edit?sort=new
```

要生成指定主機和協定的 URL，您可以向 `href` 方法提供 `URLBuilder`。
額外的查詢參數也可以使用 `URLBuilder` 指定，如下面的範例所示：

[object Promise]

`link` 變數隨後包含：

```
https://ktor.io/articles?token=123
```

### 範例 {id="example_build_links"}

下面的範例展示了如何將從資源建置的連結新增到 HTML 回應中：

[object Promise]

您可以在這裡找到完整的範例：[resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing)。