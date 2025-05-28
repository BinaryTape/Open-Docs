[//]: # (title: HttpsRedirect)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="HttpsRedirect"/>
<var name="package_name" value="io.ktor.server.plugins.httpsredirect"/>
<var name="artifact_name" value="ktor-server-http-redirect"/>

<tldr>
<p>
<b>必需的依赖</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="ssl-engine-main-redirect"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-http-redirect/io.ktor.server.plugins.httpsredirect/-https-redirect.html) 插件在处理请求之前，将所有 HTTP 请求重定向到其 [HTTPS 对应项](server-ssl.md)。默认情况下，资源返回 `301 Moved Permanently`，但可以配置为 `302 Found`。

## 添加依赖 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

上述代码安装了采用默认配置的 `%plugin_name%` 插件。

> 当处于反向代理之后时，你需要安装 `ForwardedHeader` 或 `XForwardedHeader` 插件以正确检测 HTTPS 请求。如果你在安装其中一个插件后遇到无限重定向，请查看[此常见问题解答条目](FAQ.topic#infinite-redirect)了解更多详情。
>
{type="note"}

## 配置 %plugin_name% {id="configure"}

下面的代码片段展示了如何配置所需的 HTTPS 端口，并对于请求的资源返回 `301 Moved Permanently`：

```kotlin
```
{src="snippets/ssl-engine-main-redirect/src/main/kotlin/com/example/Application.kt" include-lines="11-14"}

你可以在这里找到完整示例：[ssl-engine-main-redirect](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main-redirect)。