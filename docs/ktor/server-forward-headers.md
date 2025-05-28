[//]: # (title: 转发头)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-forwarded-header"/>
<var name="package_name" value="io.ktor.server.plugins.forwardedheaders"/>

<tldr>
<p>
<b>所需依赖</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="forwarded-header"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

当 Ktor 服务器部署在反向代理之后时，[ForwardedHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-forwarded-header/io.ktor.server.plugins.forwardedheaders/-forwarded-headers.html) 和 [XForwardedHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-forwarded-header/io.ktor.server.plugins.forwardedheaders/-x-forwarded-headers.html) 插件允许您处理反向代理头，以获取有关原始[请求](server-requests.md)的信息。这对于[日志记录](server-logging.md)可能很有用。

* `ForwardedHeaders` 处理 `Forwarded` 头 ([RFC 7239](https://tools.ietf.org/html/rfc7239))
* `XForwardedHeaders` 处理以下 `X-Forwarded-` 头：
   - `X-Forwarded-Host`/`X-Forwarded-Server`
   - `X-Forwarded-For`
   - `X-Forwarded-By`
   - `X-Forwarded-Proto`/`X-Forwarded-Protocol`
   - `X-Forwarded-SSL`/`Front-End-Https`

> 为防止 `Forwarded` 头被篡改，如果您的应用程序只接受反向代理连接，请安装这些插件。
>
{type="note"}

## 添加依赖 {id="add_dependencies"}
要使用 `ForwardedHeaders`/`XForwardedHeaders` 插件，您需要在构建脚本中包含 `%artifact_name%` 工件：

<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装插件 {id="install_plugin"}

<tabs>
<tab title="ForwardedHeader">

<var name="plugin_name" value="ForwardedHeaders"/>
<include from="lib.topic" element-id="install_plugin"/>

</tab>

<tab title="XForwardedHeader">

<var name="plugin_name" value="XForwardedHeaders"/>
<include from="lib.topic" element-id="install_plugin"/>

</tab>
</tabs>

安装 `ForwardedHeaders`/`XForwardedHeaders` 后，您可以使用 [call.request.origin](#request_info) 属性获取有关原始请求的信息。

## 获取请求信息 {id="request_info"}

### 代理请求信息 {id="proxy_request_info"}

要获取有关代理请求的信息，请在[路由处理程序](server-routing.md#define_route)中使用 [call.request.local](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/local.html) 属性。
下面的代码片段展示了如何获取代理地址和请求所指向的主机的信息：

```kotlin
```
{src="snippets/forwarded-header/src/main/kotlin/com/example/Application.kt" include-lines="17-19,25"}

### 原始请求信息 {id="original-request-information"}

要读取有关原始请求的信息，请使用 [call.request.origin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.plugins/origin.html) 属性：

```kotlin
```
{src="snippets/forwarded-header/src/main/kotlin/com/example/Application.kt" include-lines="17,20-21,25"}

下表显示了 `call.request.origin` 暴露的不同属性的值，具体取决于 `ForwardedHeaders`/`XForwardedHeaders` 是否已安装。

![Request diagram](forwarded-headers.png){width="706"}

| 属性                   | 未安装 ForwardedHeaders | 已安装 ForwarderHeaders |
|------------------------|--------------------------|-----------------------|
| `origin.localHost`     | _web-server_             | _web-server_          |
| `origin.localPort`     | _8080_                   | _8080_                |
| `origin.serverHost`    | _web-server_             | _proxy_               |
| `origin.serverPort`    | _8080_                   | _80_                  |
| `origin.remoteHost`    | _proxy_                  | _client_              |
| `origin.remotePort`    | _32864_                  | _32864_               |

> 您可以在此处找到完整的示例：[forwarded-header](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/forwarded-header)。

## 配置 ForwardedHeaders {id="configure"}

如果请求通过多个代理，您可能需要配置 `ForwardedHeaders`/`XForwardedHeaders`。
在这种情况下，`X-Forwarded-For` 包含每个连续代理的所有 IP 地址，例如：

```HTTP
X-Forwarded-For: <client>, <proxy1>, <proxy2>
```

默认情况下，`XForwardedHeader` 将 `X-Forwarded-For` 中的第一个条目分配给 `call.request.origin.remoteHost` 属性。
您还可以提供自定义逻辑来[选择 IP 地址](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For#selecting_an_ip_address)。
[XForwardedHeadersConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-forwarded-header/io.ktor.server.plugins.forwardedheaders/-x-forwarded-headers-config/index.html) 为此提供了以下 API：

- `useFirstProxy` 和 `useLastProxy` 允许您分别从 IP 地址列表中获取第一个或最后一个值。
- `skipLastProxies` 从右侧开始跳过指定数量的条目并获取下一个条目。
   例如，如果 `proxiesCount` 参数等于 `3`，则对于以下头，`origin.remoteHost` 将返回 `10.0.0.123`：
   ```HTTP
   X-Forwarded-For: 10.0.0.123, proxy-1, proxy-2, proxy-3
   ```
- `skipKnownProxies` 从列表中删除指定的条目并获取最后一个条目。
   例如，如果您将 `listOf("proxy-1", "proxy-3")` 传递给此函数，则对于以下头，`origin.remoteHost` 将返回 `proxy-2`：
   ```HTTP
   X-Forwarded-For: 10.0.0.123, proxy-1, proxy-2, proxy-3
   ```
- `extractEdgeProxy` 允许您提供自定义逻辑以从 `X-Forward-*` 头中提取值。