[//]: # (title: 类型安全的路由)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Resources"/>
<var name="package_name" value="io.ktor.server.resources"/>
<var name="artifact_name" value="ktor-server-resources"/>

<tldr>
<p>
<b>所需依赖</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="resource-routing"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>Resources 插件允许您实现类型安全的路由。</link-summary>

Ktor 提供了 [Resources](https://api.ktor.io/ktor-shared/ktor-resources/io.ktor.resources/-resources/index.html) 插件，允许您实现类型安全 (type-safe) 的 [路由](server-routing.md)。为此，您需要创建一个类作为类型化的路由 (typed route)，然后使用 `@Resource` 关键字注解此 (annotate) 类。请注意，`@Resource` 注解 (annotation) 具有 `@Serializable` 行为，由 kotlinx.serialization 库提供。

> Ktor 客户端提供了向服务器发出[类型化请求](client-resources.md)的能力。

## 添加依赖 {id="add_dependencies"}

### 添加 kotlinx.serialization {id="add_serialization"}

鉴于[资源类](#resource_classes)应该具有 `@Serializable` 行为，您需要按照 [Setup](https://github.com/Kotlin/kotlinx.serialization#setup) 部分的描述添加 Kotlin 序列化插件。

### 添加 %plugin_name% 依赖 {id="add_plugin_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 创建资源类 {id="resource_classes"}

<snippet id="resource_classes_server">

每个资源类都应该具有 `@Resource` 注解。下面，我们将看几个资源类的示例——定义单个路径段、查询参数和路径参数等。

### 资源 URL {id="resource_url"}

下面的示例展示了如何定义 `Articles` 类，该类指定了一个响应 `/articles` 路径的资源。

```kotlin
import io.ktor.resources.*

@Resource("/articles")
class Articles()
```

### 带查询参数的资源 {id="resource_query_param"}

下面的 `Articles` 类具有 `sort` 字符串属性，它充当一个 [查询参数](server-requests.md#query_parameters)，并允许您定义一个响应以下带有 `sort` 查询参数的路径的资源：`/articles?sort=new`。

```kotlin
@Resource("/articles")
class Articles(val sort: String? = "new")
```

### 带嵌套类的资源 {id="resource_nested"}

您可以嵌套类以创建包含多个路径段的资源。请注意，在这种情况下，嵌套类应具有一个外部类类型的属性。下面的示例展示了一个响应 `/articles/new` 路径的资源。

```kotlin
@Resource("/articles")
class Articles() {
    @Resource("new")
    class New(val parent: Articles = Articles())
}
```

### 带路径参数的资源 {id="resource_path_param"}

下面的示例演示了如何添加[嵌套的](#resource_nested) `{id}` 整型 [路径参数](server-routing.md#path_parameter)，它匹配一个路径段并将其捕获为名为 `id` 的参数。

```kotlin
@Resource("/articles")
class Articles() {
    @Resource("{id}")
    class Id(val parent: Articles = Articles(), val id: Long)
}
```

例如，此资源可用于响应 `/articles/12`。

</snippet>

### 示例：用于 CRUD 操作的资源 {id="example_crud"}

让我们总结上面的示例并创建用于 CRUD 操作的 `Articles` 资源。

```kotlin
```
{src="snippets/resource-routing/src/main/kotlin/resourcerouting/Application.kt" include-lines="16-26"}

此资源可用于列出所有文章、发布新文章、编辑文章等。我们将在下一章中看到如何为该资源[定义路由处理程序](#define_route)。

> 您可以在此处找到完整示例：[resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing)。

## 定义路由处理程序 {id="define_route"}

要为类型化资源[定义路由处理程序](server-routing.md#define_route)，您需要将资源类传递给动词函数（`get`、`post`、`put` 等）。例如，下面的路由处理程序响应 `/articles` 路径。

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

下面的示例展示了如何定义用于在 [](#example_crud) 中创建的 `Articles` 资源的路由处理程序。请注意，在路由处理程序内部，您可以将 `Article` 作为参数访问并获取其属性值。

```kotlin
```
{src="snippets/resource-routing/src/main/kotlin/resourcerouting/Application.kt" include-lines="30-60,88-89"}

以下是处理每个端点请求的几点提示：

- `get<Articles>`

   此路由处理程序旨在返回所有根据 `sort` 查询参数排序的文章。例如，这可能是一个[HTML 页面](server-responses.md#html)或一个包含所有文章的 [JSON 对象](server-responses.md#object)。

- `get<Articles.New>`

   此端点响应一个[网页表单](server-responses.md#html)，其中包含用于创建新文章的字段。
- `post<Articles>`

   `post<Articles>` 端点旨在接收通过网页表单发送的[参数](server-requests.md#form_parameters)。Ktor 还允许您使用 `ContentNegotiation` 插件将 JSON 数据作为[对象](server-requests.md#objects)接收。
- `get<Articles.Id>`

   此路由处理程序旨在返回具有指定标识符的文章。这可能是一个显示文章的[HTML 页面](server-responses.md#html)或一个包含文章数据的 [JSON 对象](server-responses.md#object)。
- `get<Articles.Id.Edit>`

  此端点响应一个[网页表单](server-responses.md#html)，其中包含用于编辑现有文章的字段。
- `put<Articles.Id>`

   与 `post<Articles>` 端点类似，`put` 处理程序接收通过网页表单发送的[表单参数](server-requests.md#form_parameters)。
- `delete<Articles.Id>`

   此路由处理程序删除具有指定标识符的文章。

您可以在此处找到完整示例：[resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing)。

## 从资源构建链接 {id="resource_links"}

除了使用资源定义进行路由之外，它们还可以用于构建链接。这有时被称为 _反向路由 (reverse routing)_。如果需要将这些链接添加到使用 [HTML DSL](server-html-dsl.md) 创建的 HTML 文档中，或者需要生成一个[重定向响应](server-responses.md#redirect)，那么从资源构建链接可能会很有帮助。

`Resources` 插件使用重载的 [href](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-resources/io.ktor.server.resources/href.html) 方法扩展了 `Application`，该方法允许您从 `Resource` 生成链接。例如，下面的代码片段为[上面](#example_crud)定义的 `Edit` 资源创建了一个链接：

```kotlin
```
{src="snippets/resource-routing/src/main/kotlin/resourcerouting/Application.kt" include-lines="75"}

由于祖父级 `Articles` 资源定义了默认值为 `new` 的 `sort` 查询参数，因此 `link` 变量包含：

```
/articles/123/edit?sort=new
```

要生成指定主机和协议的 URL，您可以向 `href` 方法提供 `URLBuilder`。还可以使用 `URLBuilder` 指定额外的查询参数，如此示例所示：

```kotlin
```
{src="snippets/resource-routing/src/main/kotlin/resourcerouting/Application.kt" include-lines="79-81"}

`link` 变量随后包含：

```
https://ktor.io/articles?token=123
```

### 示例 {id="example_build_links"}

下面的示例展示了如何将从资源构建的链接添加到 HTML 响应中：

```kotlin
```
{src="snippets/resource-routing/src/main/kotlin/resourcerouting/Application.kt" include-lines="62-87"}

您可以在此处找到完整示例：[resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing)。