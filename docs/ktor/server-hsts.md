[//]: # (title: HSTS)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="HSTS"/>
<var name="package_name" value="io.ktor.server.plugins.hsts"/>
<var name="artifact_name" value="ktor-server-hsts"/>

<tldr>
<p>
<b>所需依赖</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="ssl-engine-main-hsts"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-hsts/io.ktor.server.plugins.hsts/-h-s-t-s.html) 插件根据 [RFC 6797](https://tools.ietf.org/html/rfc6797) 向请求添加所需的 _HTTP 严格传输安全_ 头部。当浏览器接收到 HSTS 策略头部时，它在给定时间内不再尝试使用不安全连接连接到服务器。

> 请注意，HSTS 策略头部在不安全的 HTTP 连接上会被忽略。HSTS 若要生效，它应通过 [安全](server-ssl.md) 连接提供。

## 添加依赖项 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

## 配置 %plugin_name% {id="configure"}

`%plugin_name%` 通过 [HSTSConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-hsts/io.ktor.server.plugins.hsts/-h-s-t-s-config/index.html) 暴露其设置。以下示例展示了如何使用 `maxAgeInSeconds` 属性来指定客户端应将主机保留在已知 HSTS 主机列表中的时长：

```kotlin
```
{src="snippets/ssl-engine-main-hsts/src/main/kotlin/com/example/Application.kt" include-lines="11-12,17"}

您还可以使用 `withHost` 为不同的主机提供不同的 HSTS 配置：

```kotlin
```
{src="snippets/ssl-engine-main-hsts/src/main/kotlin/com/example/Application.kt" include-lines="11-17"}

您可以在此处找到完整示例：[ssl-engine-main-hsts](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main-hsts)。