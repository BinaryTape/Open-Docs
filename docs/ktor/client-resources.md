[//]: # (title: 类型安全请求)

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
了解如何使用 Resources 插件进行类型安全请求。
</link-summary>

Ktor 提供了 `%plugin_name%` 插件，允许你实现类型安全的[请求](client-requests.md)。为此，你需要创建一个描述服务器上可用资源的类，然后使用 `@Resource` 关键字注解此 class。请注意，`@Resource` 注解具有由 kotlinx.serialization 库提供的 `@Serializable` 行为。

> Ktor 服务器提供了实现[类型安全路由](server-resources.md)的功能。

## 添加依赖项 {id="add_dependencies"}

### 添加 kotlinx.serialization {id="add_serialization"}

鉴于[资源类](#resource_classes)应具有 `@Serializable` 行为，你需要按照 [Setup](https://github.com/Kotlin/kotlinx.serialization#setup) 章节中的描述添加 Kotlin 序列化插件。

### 添加 %plugin_name% 依赖项 {id="add_plugin_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，你需要在构建脚本中包含 <code>%artifact_name%</code> artifact：
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
        你可以从 <Links href="/ktor/client-dependencies" summary="了解如何向现有项目添加客户端依赖项。">添加客户端依赖项</Links>中了解更多关于 Ktor 客户端所需的 artifacts。
    </p>
    

## 安装 %plugin_name% {id="install_plugin"}

要安装 `%plugin_name%`，请将其传递给[客户端配置块](client-create-and-configure.md#configure-client)内的 `install` 函数：
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

<snippet id="resource_classes_server">

每个资源类都应具有 `@Resource` 注解。
下面，我们将查看几个资源类示例——定义单个路径段、查询和路径参数等。

### 资源 URL {id="resource_url"}

以下示例展示了如何定义 `Articles` 类，该类指定了一个响应 `/articles` 路径的资源。

```kotlin
import io.ktor.resources.*

@Resource("/articles")
class Articles()
```

### 带有查询参数的资源 {id="resource_query_param"}

下面的 `Articles` 类有一个 `sort` 字符串属性，它充当[查询参数](server-requests.md#query_parameters)，允许你定义一个在以下路径上响应并带有 `sort` 查询参数的资源：`/articles?sort=new`。

```kotlin
@Resource("/articles")
class Articles(val sort: String? = "new")
```

### 带有嵌套类的资源 {id="resource_nested"}

你可以嵌套类来创建包含多个路径段的资源。请注意，在这种情况下，嵌套类应该有一个带有外部类类型的属性。
以下示例展示了一个响应 `/articles/new` 路径的资源。

```kotlin
@Resource("/articles")
class Articles() {
@Resource("new")
class New(val parent: Articles = Articles())
}
```

### 带有路径参数的资源 {id="resource_path_param"}

以下示例演示了如何添加[嵌套](#resource_nested)的 `{id}` 整型[路径参数](server-routing.md#path_parameter)，该参数匹配一个路径段并将其捕获为名为 `id` 的参数。

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

让我们总结上述示例，并为 CRUD 操作创建 `Articles` 资源。

[object Promise]

此资源可用于列出所有文章、发布新文章、编辑文章等。我们将在下一节中了解如何对该资源[进行类型安全请求](#make_requests)。

> 你可以在此处找到完整示例：[client-type-safe-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-type-safe-requests)。

## 进行类型安全请求 {id="make_requests"}

要向类型化资源[进行请求](client-requests.md)，你需要将资源类实例传递给请求函数（`request`、`get`、`post`、`put` 等）。例如，以下示例展示了如何向 `/articles` 路径进行请求。

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

以下示例展示了如何对 [](#example_crud) 中创建的 `Articles` 资源进行类型化请求。

[object Promise]

`[defaultRequest](client-default-request.md)` 函数用于为所有请求指定一个默认 URL。

> 你可以在此处找到完整示例：[client-type-safe-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-type-safe-requests)。