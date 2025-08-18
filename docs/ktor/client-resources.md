[//]: # (title: 类型安全的请求)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<var name="plugin_name" value="Resources"/>
<var name="artifact_name" value="ktor-client-resources"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-type-safe-requests"/>
<p>
    <b>代码示例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
了解如何使用 Resources 插件进行类型安全的请求。
</link-summary>

Ktor 提供了 `%plugin_name%` 插件，允许您实现类型安全的[请求](client-requests.md)。为此，您需要创建一个类，用于描述服务器上可用资源，然后使用 `@Resource` 关键字标注该类。请注意，`@Resource` 注解具有由 kotlinx.serialization 库提供的 `@Serializable` 行为。

> Ktor 服务器提供了实现[类型安全的路由](server-resources.md)的功能。

## 添加依赖项 {id="add_dependencies"}

### 添加 kotlinx.serialization {id="add_serialization"}

鉴于[资源类](#resource_classes)应具有 `@Serializable` 行为，您需要按照 [Setup](https://github.com/Kotlin/kotlinx.serialization#setup) 部分所述添加 Kotlin 序列化插件。

### 添加 %plugin_name% 依赖项 {id="add_plugin_dependencies"}

<p>
    要使用 <code>%plugin_name%</code>，您需要将 <code>%artifact_name%</code> artifact 包含在构建脚本中：
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
<p>
    您可以从 <Links href="/ktor/client-dependencies" summary="了解如何将客户端依赖项添加到现有项目。">添加客户端依赖项</Links> 了解更多关于 Ktor 客户端所需的 artifacts。
</p>

## 安装 %plugin_name% {id="install_plugin"}

要安装 `%plugin_name%`，请将其传递给 [客户端配置块](client-create-and-configure.md#configure-client) 中的 `install` 函数：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.resources.*
//...
val client = HttpClient(CIO) {
    install(Resources)
}
```

## 创建资源类 {id="resource_classes"}

每个资源类都应带有 `@Resource` 注解。
下面，我们将介绍几个资源类示例——包括如何定义单个路径段、查询参数和路径参数等。

### 资源 URL {id="resource_url"}

以下示例展示了如何定义 `Articles` 类，该类指定了一个响应 `/articles` 路径的资源。

```kotlin
import io.ktor.resources.*

@Resource("/articles")
class Articles()
```

### 带有查询参数的资源 {id="resource_query_param"}

下面的 `Articles` 类包含 `sort` 字符串属性，它作为[查询参数](server-requests.md#query_parameters)允许您定义一个响应以下路径并带有 `sort` 查询参数的资源：`/articles?sort=new`。

```kotlin
@Resource("/articles")
class Articles(val sort: String? = "new")
```

### 带有嵌套类的资源 {id="resource_nested"}

您可以嵌套类以创建包含多个路径段的资源。请注意，在这种情况下，嵌套类应具有一个外部类类型的属性。
以下示例展示了一个响应 `/articles/new` 路径的资源。

```kotlin
@Resource("/articles")
class Articles() {
    @Resource("new")
    class New(val parent: Articles = Articles())
}
```

### 带有路径参数的资源 {id="resource_path_param"}

以下示例演示了如何添加[嵌套的](#resource_nested) `{id}` 整型[路径参数](server-routing.md#path_parameter)，该参数匹配一个路径段并将其捕获为名为 `id` 的参数。

```kotlin
@Resource("/articles")
class Articles() {
    @Resource("{id}")
    class Id(val parent: Articles = Articles(), val id: Long)
}
```

例如，该资源可用于响应 `/articles/12`。

### 示例：用于 CRUD 操作的资源 {id="example_crud"}

让我们总结以上示例并为 CRUD 操作创建 `Articles` 资源。

```kotlin
@Resource("/articles")
class Articles() {
    @Resource("new")
    class New(val parent: Articles = Articles())

    @Resource("{id}")
    class Id(val parent: Articles = Articles(), val id: Long) {
        @Resource("edit")
        class Edit(val parent: Id)
    }
}
```

该资源可用于列出所有文章、发布新文章、编辑文章等。我们将在下一节中了解如何对该资源[进行类型安全的请求](#make_requests)。

> 您可以在此处找到完整示例：[client-type-safe-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-type-safe-requests)。

## 进行类型安全的请求 {id="make_requests"}

要对类型化资源[进行请求](client-requests.md)，您需要将资源类实例传递给请求函数（`request`、`get`、`post`、`put` 等）。例如，以下示例展示了如何向 `/articles` 路径发起请求。

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

以下示例展示了如何向[示例：用于 CRUD 操作的资源](#example_crud)中创建的 `Articles` 资源发起类型化请求。

```kotlin
fun main() {
    defaultServer(Application::module).start()
    runBlocking {
        val client = HttpClient(CIO) {
            install(Resources)
            defaultRequest {
                host = "0.0.0.0"
                port = 8080
                url { protocol = URLProtocol.HTTP }
            }
        }

        val getAllArticles = client.get(Articles())
        val newArticle = client.get(Articles.New())
        val postArticle = client.post(Articles()) { setBody("Article content") }
        val getArticle = client.get(Articles.Id(id = 12))
        val editArticlePage = client.get(Articles.Id.Edit(Articles.Id(id = 12)))
        val putArticle = client.put(Articles.Id(id = 12)) { setBody("New article content") }
        val deleteArticle = client.delete(Articles.Id(id = 12))
}
```

[defaultRequest](client-default-request.md) 函数用于为所有请求指定默认 URL。

> 您可以在此处找到完整示例：[client-type-safe-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-type-safe-requests)。