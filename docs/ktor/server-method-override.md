[//]: # (title: XHttpMethodOverride)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="XHttpMethodOverride"/>
<var name="package_name" value="io.ktor.server.plugins.methodoverride"/>
<var name="artifact_name" value="ktor-server-method-override"/>

<tldr>
<p>
<b>所需依赖</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx-method-override"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
%plugin_name% 提供了在 X-HTTP-Method-Override 头部中隧道化 HTTP 动词的能力。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-method-override/io.ktor.server.plugins.methodoverride/-x-http-method-override.html) 插件提供了在 `X-HTTP-Method-Override` 头部中隧道化 HTTP 动词的能力。
当您的服务器 API 处理多种 HTTP 动词（如 `GET`、`PUT`、`POST`、`DELETE` 等），但客户端由于特定限制只能使用有限的动词集合（例如 `GET` 和 `POST`）时，此功能会很有用。
例如，如果客户端发送的请求将 `X-Http-Method-Override` 头部设置为 `DELETE`，Ktor 将使用 `delete` [路由处理器](server-routing.md#define_route) 来处理此请求。

## 添加依赖项 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 配置 %plugin_name% {id="configure"}

默认情况下，%plugin_name% 会检查 `X-Http-Method-Override` 头部，以确定应该处理该请求的路由。
您可以使用 `headerName` 属性自定义头部名称。

## 示例 {id="example"}

下面的 HTTP 请求使用 `POST` 动词，并将 `X-Http-Method-Override` 头部设置为 `DELETE`：

```http request
```
{src="snippets/json-kotlinx-method-override/post.http"}

要使用 `delete` [路由处理器](server-routing.md#define_route) 处理此类请求，您需要安装 %plugin_name%：

```kotlin
```
{src="snippets/json-kotlinx-method-override/src/main/kotlin/com/example/Application.kt"}

您可以在此处找到完整示例：[json-kotlinx-method-override](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx-method-override)。