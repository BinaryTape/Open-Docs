[//]: # (title: 自动 HEAD 响应)

<var name="plugin_name" value="AutoHeadResponse"/>
<var name="artifact_name" value="ktor-server-auto-head-response"/>
<primary-label ref="server-plugin"/>

<tldr>
<p>
<b>所需依赖</b>: <code>io.ktor:ktor-server-auto-head-response</code>
</p>
<var name="example_name" value="autohead"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
AutoHeadResponse 提供了自动响应定义了 GET 的每个路由的 HEAD 请求的能力。
</link-summary>

[AutoHeadResponse](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auto-head-response/io.ktor.server.plugins.autohead/-auto-head-response.html) 插件提供了自动响应定义了 `GET` 的每个路由的 `HEAD` 请求的能力。您可以使用 `AutoHeadResponse`，避免在客户端获取实际内容之前需要某种方式处理响应时，创建单独的 [head](server-routing.md#define_route) 处理程序。例如，调用 [respondFile](server-responses.md#file) 函数会自动将 `Content-Length` 和 `Content-Type` 头添加到响应中，您可以在下载文件之前在客户端获取此信息。

## 添加依赖 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 用法
为了利用此功能，我们需要在应用程序中安装 `AutoHeadResponse` 插件。

```kotlin
```
{src="snippets/autohead/src/main/kotlin/com/example/Application.kt" include-lines="3-15"}

在我们的例子中，`/home` 路由现在将响应 `HEAD` 请求，即使没有为此动词显式定义。

重要的是要注意，如果使用此插件，针对相同 `GET` 路由的自定义 `HEAD` 定义将被忽略。

## 选项
`AutoHeadResponse` 不提供任何额外的配置选项。