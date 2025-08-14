[//]: # (title: 类型安全的路由)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Resources"/>
<var name="package_name" value="io.ktor.server.resources"/>
<var name="artifact_name" value="ktor-server-resources"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="resource-routing"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，并允许您在没有额外运行时或虚拟机的情况下运行服务器。">原生服务器</Links>支持</b>: ✅
    </p>
    
</tldr>

<link-summary>Resources 插件允许您实现类型安全的路由。</link-summary>

Ktor 提供了 [Resources](https://api.ktor.io/ktor-shared/ktor-resources/io.ktor.resources/-resources/index.html) 插件，允许您实现类型安全的[路由](server-routing.md)。为此，您需要创建一个类作为类型化的路由，然后使用 `@Resource` 关键字注解此 class。请注意，`@Resource` 注解具有 kotlinx.serialization 库提供的 `@Serializable` 行为。

> Ktor 客户端提供了向服务器发出[类型化请求](client-resources.md)的功能。

## 添加依赖项 {id="add_dependencies"}

### 添加 kotlinx.serialization {id="add_serialization"}

鉴于[资源类](#resource_classes)应具有 `@Serializable` 行为，您需要按照 [Setup](https://github.com/Kotlin/kotlinx.serialization#setup) 部分所述添加 Kotlin 序列化插件。

### 添加 %plugin_name% 依赖项 {id="add_plugin_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，您需要在构建脚本中包含 <code>%artifact_name%</code> 构件：
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
    

## 安装 %plugin_name% {id="install_plugin"}

    <p>
        要<a href="#install">安装</a> <code>%plugin_name%</code> 插件到应用程序，
        请将其传递给指定<Links href="/ktor/server-modules" summary="模块允许您通过分组路由来组织应用程序。">模块</Links>中的 <code>install</code> 函数。
        下面的代码片段展示了如何安装 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函数调用中。
        </li>
        <li>
            ... 在显式定义的 <code>module</code> 中，它是 <code>Application</code> 类的扩展函数。
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
    

## 创建资源类 {id="resource_classes"}

<snippet id="resource_classes_server">

每个资源类都应具有 `@Resource` 注解。
下面，我们将介绍几个资源类的示例——定义单个路径段、查询和路径参数等。

### 资源 URL {id="resource_url"}

下面的示例展示了如何定义 `Articles` 类，该类指定了响应 `/articles` 路径的资源。

```kotlin
import io.ktor.resources.*

@Resource("/articles")
class Articles()
```

### 带有查询参数的资源 {id="resource_query_param"}

下面的 `Articles` 类具有 `sort` 字符串属性，该属性作为[查询参数](server-requests.md#query_parameters)，允许您定义一个响应以下路径并带有 `sort` 查询参数的资源：`/articles?sort=new`。

```kotlin
@Resource("/articles")
class Articles(val sort: String? = "new")
```

### 带有嵌套类的资源 {id="resource_nested"}

您可以嵌套类以创建包含多个路径段的资源。请注意，在这种情况下，嵌套类应具有一个外部类类型的属性。
下面的示例展示了一个响应 `/articles/new` 路径的资源。

```kotlin
@Resource("/articles")
class Articles() {
    @Resource("new")
    class New(val parent: Articles = Articles())
}
```

### 带有路径参数的资源 {id="resource_path_param"}

下面的示例演示了如何添加[嵌套的](#resource_nested) `{id}` 整型[路径参数](server-routing.md#path_parameter)，该参数匹配路径段并将其捕获为名为 `id` 的参数。

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

让我们总结一下上面的示例，并为 CRUD 操作创建 `Articles` 资源。

[object Promise]

此资源可用于列出所有文章、发布新文章、编辑文章等。我们将在下一章中看到如何为该资源[定义路由处理器](#define_route)。

> 您可以在此处找到完整示例：[resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing)。

## 定义路由处理器 {id="define_route"}

要为类型化的资源[定义路由处理器](server-routing.md#define_route)，您需要将资源类传递给 HTTP 动词函数（例如 `get`、`post`、`put` 等）。
例如，下面的路由处理器响应 `/articles` 路径。

```kotlin
@Resource("/articles")
class Articles()

fun Application.module() {
    install(Resources)
    routing {
        get<Articles> { articles ->
            // 获取所有文章 ...
            call.respondText("List of articles: $articles")
        }
    }
}
```

下面的示例展示了如何为 [](#example_crud) 中创建的 `Articles` 资源定义路由处理器。请注意，在路由处理器内部，您可以将 `Article` 作为参数访问并获取其属性值。

[object Promise]

以下是处理每个端点的几条提示：

- `get<Articles>`

   此路由处理器应根据 `sort` 查询参数返回所有文章。
   例如，这可能是一个包含所有文章的 [HTML 页面](server-responses.md#html) 或 [JSON 对象](server-responses.md#object)。

- `get<Articles.New>`

   此端点响应一个[网页表单](server-responses.md#html)，其中包含用于创建新文章的字段。
- `post<Articles>`

   `post<Articles>` 端点应接收使用网页表单发送的[参数](server-requests.md#form_parameters)。
   Ktor 还允许您使用 `ContentNegotiation` 插件将 JSON 数据作为[对象](server-requests.md#objects)接收。
- `get<Articles.Id>`

   此路由处理器应返回具有指定标识符的文章。
   这可能是一个显示文章的 [HTML 页面](server-responses.md#html) 或包含文章数据的 [JSON 对象](server-responses.md#object)。
- `get<Articles.Id.Edit>`

  此端点响应一个[网页表单](server-responses.md#html)，其中包含用于编辑现有文章的字段。
- `put<Articles.Id>`

   与 `post<Articles>` 端点类似，`put` 处理器接收使用网页表单发送的[表单参数](server-requests.md#form_parameters)。
- `delete<Articles.Id>`

   此路由处理器删除具有指定标识符的文章。

您可以在此处找到完整示例：[resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing)。

## 从资源构建链接 {id="resource_links"}

除了将资源定义用于路由之外，它们还可以用于构建链接。
这有时被称为_反向路由_。
从资源构建链接在您需要将这些链接添加到使用 [HTML DSL](server-html-dsl.md) 创建的 HTML 文档中，或者需要生成[重定向响应](server-responses.md#redirect)时可能会有所帮助。

`Resources` 插件通过重载的 [href](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-resources/io.ktor.server.resources/href.html) 方法扩展了 `Application`，该方法允许您从 `Resource` 生成链接。例如，下面的代码片段为[上面](#example_crud)定义的 `Edit` 资源创建了一个链接：

[object Promise]

由于祖先 `Articles` 资源定义了默认值为 `new` 的 `sort` 查询参数，因此 `link` 变量包含：

```
/articles/123/edit?sort=new
```

要生成指定主机和协议的 URL，您可以向 `href` 方法提供 `URLBuilder`。
还可以使用 `URLBuilder` 指定额外的查询参数，如本例所示：

[object Promise]

`link` 变量随后包含：

```
https://ktor.io/articles?token=123
```

### 示例 {id="example_build_links"}

下面的示例展示了如何将从资源构建的链接添加到 HTML 响应中：

[object Promise]

您可以在此处找到完整示例：[resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing)。