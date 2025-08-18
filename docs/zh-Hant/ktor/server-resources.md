[//]: # (title: 型別安全路由)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Resources"/>
<var name="package_name" value="io.ktor.server.resources"/>
<var name="artifact_name" value="ktor-server-resources"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="resource-routing"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，並允許您在沒有額外執行時或虛擬機器的情況下執行伺服器。">原生伺服器</Links>支援</b>: ✅
</p>
</tldr>

<link-summary>Resources 外掛程式允許您實作型別安全的路由。</link-summary>

Ktor 提供了 [Resources](https://api.ktor.io/ktor-shared/ktor-resources/io.ktor.resources/-resources/index.html) 外掛程式，允許您實作型別安全的 [路由](server-routing.md)。為此，您需要建立一個將作為型別化路由的類別，然後使用 `@Resource` 關鍵字註解此類別。請注意，`@Resource` 註解具有由 kotlinx.serialization 函式庫提供的 `@Serializable` 行為。

> Ktor 客戶端提供了向伺服器發送[型別化請求](client-resources.md)的能力。

## 新增依賴項 {id="add_dependencies"}

### 新增 kotlinx.serialization {id="add_serialization"}

鑑於[資源類別](#resource_classes)應具有 `@Serializable` 行為，您需要依照 [設定](https://github.com/Kotlin/kotlinx.serialization#setup) 章節所述新增 Kotlin 序列化外掛程式。

### 新增 %plugin_name% 依賴項 {id="add_plugin_dependencies"}

<p>
    若要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> 構件：
</p>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## 安裝 %plugin_name% {id="install_plugin"}

<p>
    要<a href="#install">安裝</a> <code>%plugin_name%</code> 外掛程式到應用程式，
    請將其傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">模組</Links>中的 <code>install</code> 函式。
    下面的程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函式呼叫內。
    </li>
    <li>
        ... 在明確定義的 <code>module</code> 內，它是 <code>Application</code> 類別的擴充函式。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>

## 建立資源類別 {id="resource_classes"}

<snippet id="resource_classes_server">

每個資源類別都應具有 `@Resource` 註解。
下面，我們將探討幾個資源類別的範例——定義單一路徑區段、查詢參數和路徑參數等等。

### 資源 URL {id="resource_url"}

下面的範例展示了如何定義 `Articles` 類別，該類別指定一個響應 `/articles` 路徑的資源。

```kotlin
import io.ktor.resources.*

@Resource("/articles")
class Articles()
```

### 帶有查詢參數的資源 {id="resource_query_param"}

下面的 `Articles` 類別具有 `sort` 字串屬性，該屬性充當[查詢參數](server-requests.md#query_parameters)，並允許您定義一個響應以下路徑並帶有 `sort` 查詢參數的資源：`/articles?sort=new`。

```kotlin
@Resource("/articles")
class Articles(val sort: String? = "new")
```

### 帶有巢狀類別的資源 {id="resource_nested"}

您可以巢狀類別以建立包含多個路徑區段的資源。請注意，在這種情況下，巢狀類別應具有外部類別型別的屬性。
下面的範例展示了一個響應 `/articles/new` 路徑的資源。

```kotlin
@Resource("/articles")
class Articles() {
    @Resource("new")
    class New(val parent: Articles = Articles())
}
```

### 帶有路徑參數的資源 {id="resource_path_param"}

下面的範例演示了如何新增[巢狀](#resource_nested) `{id}` 整數[路徑參數](server-routing.md#path_parameter)，該參數比對路徑區段並將其擷取為名為 `id` 的參數。

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

讓我們總結一下上述範例，並為 CRUD 操作建立 `Articles` 資源。

```kotlin
@Resource("/articles")
class Articles(val sort: String? = "new") {
    @Resource("new")
    class New(val parent: Articles = Articles())

    @Resource("{id}")
    class Id(val parent: Articles = Articles(), val id: Long) {
        @Resource("edit")
        class Edit(val parent: Id)
    }
}
```

此資源可用於列出所有文章、發布新文章、編輯它等等。我們將在下一章中了解如何為此資源[定義路由處理器](#define_route)。

> 您可以在此處找到完整範例：[resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing)。

## 定義路由處理器 {id="define_route"}

若要為型別化資源[定義路由處理器](server-routing.md#define_route)，您需要將資源類別傳遞給動詞函式 (`get`、`post`、`put` 等)。
例如，下面的路由處理器響應 `/articles` 路徑。

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

下面的範例展示了如何為在[範例：用於 CRUD 操作的資源](#example_crud)中建立的 `Articles` 資源定義路由處理器。請注意，在路由處理器內部，您可以將 `Article` 作為參數存取並獲取其屬性值。

```kotlin
fun Application.module() {
    install(Resources)
    routing {
        get<Articles> { article ->
            // Get all articles ...
            call.respondText("List of articles sorted starting from ${article.sort}")
        }
        get<Articles.New> {
            // Show a page with fields for creating a new article ...
            call.respondText("Create a new article")
        }
        post<Articles> {
            // Save an article ...
            call.respondText("An article is saved", status = HttpStatusCode.Created)
        }
        get<Articles.Id> { article ->
            // Show an article with id ${article.id} ...
            call.respondText("An article with id ${article.id}", status = HttpStatusCode.OK)
        }
        get<Articles.Id.Edit> { article ->
            // Show a page with fields for editing an article ...
            call.respondText("Edit an article with id ${article.parent.id}", status = HttpStatusCode.OK)
        }
        put<Articles.Id> { article ->
            // Update an article ...
            call.respondText("An article with id ${article.id} updated", status = HttpStatusCode.OK)
        }
        delete<Articles.Id> { article ->
            // Delete an article ...
            call.respondText("An article with id ${article.id} deleted", status = HttpStatusCode.OK)
        }
    }
}
```

以下是處理每個端點請求的幾個提示：

- `get<Articles>`

   此路由處理器應根據 `sort` 查詢參數返回所有文章。
   例如，這可能是包含所有文章的 [HTML 頁面](server-responses.md#html) 或 [JSON 物件](server-responses.md#object)。

- `get<Articles.New>`

   此端點響應一個包含用於建立新文章欄位的[網頁表單](server-responses.md#html)。
- `post<Articles>`

   `post<Articles>` 端點應接收使用網頁表單發送的[參數](server-requests.md#form_parameters)。
   Ktor 也允許您使用 `ContentNegotiation` 外掛程式接收作為[物件](server-requests.md#objects)的 JSON 資料。
- `get<Articles.Id>`

   此路由處理器應返回具有指定識別碼的文章。
   這可能是顯示文章的 [HTML 頁面](server-responses.md#html) 或包含文章資料的 [JSON 物件](server-responses.md#object)。
- `get<Articles.Id.Edit>`

  此端點響應一個包含用於編輯現有文章欄位的[網頁表單](server-responses.md#html)。
- `put<Articles.Id>`

   與 `post<Articles>` 端點類似，`put` 處理器接收使用網頁表單發送的[表單參數](server-requests.md#form_parameters)。
- `delete<Articles.Id>`

   此路由處理器刪除具有指定識別碼的文章。

您可以在此處找到完整範例：[resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing)。

## 從資源建構連結 {id="resource_links"}

除了使用資源定義進行路由外，它們還可用於建構連結。
這有時被稱為「反向路由」。
從資源建構連結在您需要將這些連結添加到使用 [HTML DSL](server-html-dsl.md) 建立的 HTML 文件中，或者需要產生[重新導向回應](server-responses.md#redirect)時可能會有所幫助。

`Resources` 外掛程式透過多載的 [href](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-resources/io.ktor.server.resources/href.html) 方法擴展 `Application`，該方法允許您從 `Resource` 產生連結。例如，下面的程式碼片段為[上面定義的](#example_crud) `Edit` 資源建立了一個連結：

```kotlin
val link: String = href(Articles.Id.Edit(Articles.Id(id = 123)))
```

由於祖級 `Articles` 資源定義了帶有預設值 `new` 的 `sort` 查詢參數，因此 `link` 變數包含：

```
/articles/123/edit?sort=new
```

若要產生指定主機和協定的 URL，您可以向 `href` 方法提供 `URLBuilder`。
還可以使用 `URLBuilder` 指定其他查詢參數，如下例所示：

```kotlin
val urlBuilder = URLBuilder(URLProtocol.HTTPS, "ktor.io", parameters = parametersOf("token", "123"))
href(Articles(sort = null), urlBuilder)
val link: String = urlBuilder.buildString()
```

`link` 變數隨後包含：

```
https://ktor.io/articles?token=123
```

### 範例 {id="example_build_links"}

下面的範例展示了如何將從資源建構的連結添加到 HTML 響應中：

```kotlin
get {
    call.respondHtml {
        body {
            this@module.apply {
                p {
                    val link: String = href(Articles())
                    a(link) { +"Get all articles" }
                }
                p {
                    val link: String = href(Articles.New())
                    a(link) { +"Create a new article" }
                }
                p {
                    val link: String = href(Articles.Id.Edit(Articles.Id(id = 123)))
                    a(link) { +"Edit an exising article" }
                }
                p {
                    val urlBuilder = URLBuilder(URLProtocol.HTTPS, "ktor.io", parameters = parametersOf("token", "123"))
                    href(Articles(sort = null), urlBuilder)
                    val link: String = urlBuilder.buildString()
                    i { a(link) { +link } }
                }
            }
        }
    }
}
```

您可以在此處找到完整範例：[resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing)。