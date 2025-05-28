[//]: # (title: 条件标头)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-conditional-headers"/>
<var name="package_name" value="io.ktor.server.plugins.conditionalheaders"/>
<var name="plugin_name" value="ConditionalHeaders"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="conditional-headers"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[ConditionalHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-conditional-headers/io.ktor.server.plugins.conditionalheaders/-conditional-headers.html) 插件在内容自上次请求以来未更改时，避免发送其正文。这通过使用以下标头实现：
* `Last-Modified` 响应标头包含资源修改时间。例如，如果客户端请求包含 `If-Modified-Since` 值，Ktor 将仅在资源于给定日期后被修改时才发送完整响应。请注意，对于[静态文件](server-static-content.md)，Ktor 会在[安装](#install_plugin) `ConditionalHeaders` 后自动附加 `Last-Modified` 标头。
* `Etag` 响应标头是特定资源版本的标识符。例如，如果客户端请求包含 `If-None-Match` 值，并且此值与 `Etag` 匹配，Ktor 将不会发送完整响应。您可以在[配置](#configure) `ConditionalHeaders` 时指定 `Etag` 值。

## 添加依赖项 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

## 配置标头 {id="configure"}

要配置 `%plugin_name%`，您需要在 `install` 块内调用 [version](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-conditional-headers/io.ktor.server.plugins.conditionalheaders/-conditional-headers-config/version.html) 函数。此函数为给定的 `ApplicationCall` 和 `OutgoingContent` 提供资源版本列表的访问权限。您可以通过使用 [EntityTagVersion](https://api.ktor.io/ktor-http/io.ktor.http.content/-entity-tag-version/index.html) 和 [LastModifiedVersion](https://api.ktor.io/ktor-http/io.ktor.http.content/-last-modified-version/index.html) 类对象来指定所需的版本。

下面的代码片段展示了如何为 CSS 添加 `Etag` 和 `Last-Modified` 标头：
```kotlin
```
{src="snippets/conditional-headers/src/main/kotlin/com/example/Application.kt" include-lines="16-27"}

您可以在此处找到完整示例：[conditional-headers](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/conditional-headers)。