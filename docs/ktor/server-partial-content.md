[//]: # (title: 部分内容)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-partial-content"/>
<var name="package_name" value="io.ktor.server.plugins.partialcontent"/>
<var name="plugin_name" value="PartialContent"/>

<tldr>
<p>
<b>所需依赖</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p>
<b>服务器示例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/download-file">download-file</a>,
<b>客户端示例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-file-range">client-download-file-range</a>
</p>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-partial-content/io.ktor.server.plugins.partialcontent/-partial-content.html) 插件添加了对处理 [HTTP 范围请求](https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests) 的支持，这些请求用于仅将 HTTP 消息的一部分发送回客户端。此插件对于流式传输内容或恢复部分下载很有用。

`%plugin_name%` 具有以下限制：
- 仅适用于 `HEAD` 和 `GET` 请求，如果客户端尝试将 `Range` 头与其它方法一起使用，则返回 `405 Method Not Allowed`。
- 仅适用于定义了 `Content-Length` 头的响应。
- 在提供范围时禁用 [压缩](server-compression.md)。

## 添加依赖 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

要了解如何使用 `%plugin_name%` 通过 HTTP 范围请求提供文件，请参阅 [](server-responses.md#file) 部分。