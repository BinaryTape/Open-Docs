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
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
了解如何使用 Resources 插件进行类型安全的请求。
</link-summary>

Ktor 提供了 `%plugin_name%` 插件，允许你实现类型安全的 [请求](client-requests.md)。为此，你需要创建一个描述服务器上可用资源的类，然后使用 `@Resource` 关键字注解该类。请注意，`@Resource` 注解具有 kotlinx.serialization 库提供的 `@Serializable` 行为。

> Ktor 服务器提供了实现 [类型安全路由](server-resources.md) 的能力。

## 添加依赖项 {id="add_dependencies"}

### 添加 kotlinx.serialization {id="add_serialization"}

鉴于 [资源类](#resource_classes) 应该具有 `@Serializable` 行为，你需要按照 [设置](https://github.com/Kotlin/kotlinx.serialization#setup) 部分的说明添加 Kotlin 序列化插件。

### 添加 %plugin_name% 依赖项 {id="add_plugin_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>
<include from="lib.topic" element-id="add_ktor_client_artifact_tip"/>

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

<include from="server-resources.md" element-id="resource_classes_server"/>

### 示例：用于 CRUD 操作的资源 {id="example_crud"}

让我们总结上面的示例，并为 CRUD 操作创建一个 `Articles` 资源。

```kotlin
```
{src="snippets/client-type-safe-requests/src/main/kotlin/com/example/Application.kt" include-lines="18-28"}

此资源可用于列出所有文章、发布新文章、编辑文章等。我们将在下一节中看到如何向此资源 [发起类型安全的请求](#make_requests)。

> 你可以在此处找到完整的示例：[client-type-safe-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-type-safe-requests)。

## 发起类型安全的请求 {id="make_requests"}

要向类型化资源 [发起请求](client-requests.md)，你需要将资源类实例传递给请求函数（`request`、`get`、`post`、`put` 等）。例如，以下示例展示了如何向 `/articles` 路径发起请求。

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

以下示例展示了如何向在 [](#example_crud) 中创建的 `Articles` 资源发起类型化请求。

```kotlin
```
{src="snippets/client-type-safe-requests/src/main/kotlin/com/example/Application.kt" include-lines="30-48,60"}

`defaultRequest` 函数用于为所有请求指定默认 URL。

> 你可以在此处找到完整的示例：[client-type-safe-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-type-safe-requests)。