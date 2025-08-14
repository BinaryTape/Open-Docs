[//]: # (title: Forwarded 头)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-forwarded-header"/>
<var name="package_name" value="io.ktor.server.plugins.forwardedheaders"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="forwarded-header"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，并允许您在无需额外运行时或虚拟机的情况下运行服务器。">原生服务器</Links>支持</b>: ✅
    </p>
    
</tldr>

[ForwardedHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-forwarded-header/io.ktor.server.plugins.forwardedheaders/-forwarded-headers.html) 和 [XForwardedHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-forwarded-header/io.ktor.server.plugins.forwardedheaders/-x-forwarded-headers.html) 插件允许您处理反向代理头，以便当 Ktor 服务器位于反向代理之后时，获取有关原始[请求](server-requests.md)的信息。这可能对[日志记录](server-logging.md)很有用。

* `ForwardedHeaders` 处理 `Forwarded` 头 ([RFC 7239](https://tools.ietf.org/html/rfc7239))
* `XForwardedHeaders` 处理以下 `X-Forwarded-` 头：
   - `X-Forwarded-Host`/`X-Forwarded-Server` 
   - `X-Forwarded-For` 
   - `X-Forwarded-By`
   - `X-Forwarded-Proto`/`X-Forwarded-Protocol`
   - `X-Forwarded-SSL`/`Front-End-Https`

> 为了防止篡改 `Forwarded` 头，如果您的应用程序只接受反向代理连接，请安装这些插件。
> 
{type="note"}

## 添加依赖项 {id="add_dependencies"}
要使用 `ForwardedHeaders`/`XForwardedHeaders` 插件，您需要在构建脚本中包含 `%artifact_name%` 构件：

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
    

## 安装插件 {id="install_plugin"}

<tabs>
<tab title="ForwardedHeader">

<var name="plugin_name" value="ForwardedHeaders"/>

    <p>
        要<a href="#install">安装</a> <code>%plugin_name%</code> 插件到应用程序，
        请在指定的<Links href="/ktor/server-modules" summary="模块允许您通过分组路由来组织应用程序。">模块</Links>中将其传递给 <code>install</code> 函数。
        以下代码片段展示了如何安装 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函数调用内部。
        </li>
        <li>
            ... 在显式定义的 <code>module</code> 内部，它是 <code>Application</code> 类的一个扩展函数。
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
    

</tab>

<tab title="XForwardedHeader">

<var name="plugin_name" value="XForwardedHeaders"/>

    <p>
        要<a href="#install">安装</a> <code>%plugin_name%</code> 插件到应用程序，
        请在指定的<Links href="/ktor/server-modules" summary="模块允许您通过分组路由来组织应用程序。">模块</Links>中将其传递给 <code>install</code> 函数。
        以下代码片段展示了如何安装 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函数调用内部。
        </li>
        <li>
            ... 在显式定义的 <code>module</code> 内部，它是 <code>Application</code> 类的一个扩展函数。
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
    

</tab>
</tabs>

安装 `ForwardedHeaders`/`XForwardedHeaders` 后，您可以使用 [call.request.origin](#request_info) 属性获取有关原始请求的信息。

## 获取请求信息 {id="request_info"}

### 代理请求信息 {id="proxy_request_info"}

要获取有关代理请求的信息，请在[路由处理器](server-routing.md#define_route)内部使用 [call.request.local](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/local.html) 属性。以下代码片段展示了如何获取有关代理地址和请求所指向的主机的信息：

[object Promise]

### 原始请求信息 {id="original-request-information"}

要读取有关原始请求的信息，请使用 [call.request.origin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.plugins/origin.html) 属性：

[object Promise]

下表显示了 `call.request.origin` 暴露的不同属性的值，具体取决于是否安装了 `ForwardedHeaders`/`XForwardedHeaders`。

![请求示意图](forwarded-headers.png){width="706"}

| 属性               | 未安装 ForwardedHeaders | 已安装 ForwarderHeaders |
|--------------------|--------------------------|-----------------------|
| `origin.localHost` | _web-server_             | _web-server_          |
| `origin.localPort` | _8080_                   | _8080_                |
| `origin.serverHost`| _web-server_             | _proxy_               |
| `origin.serverPort`| _8080_                   | _80_                  |
| `origin.remoteHost`| _proxy_                  | _client_              |
| `origin.remotePort`| _32864_                  | _32864_               |

> 您可以在此处找到完整示例：[forwarded-header](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/forwarded-header)。

## 配置 ForwardedHeaders {id="configure"}

如果请求通过多个代理，您可能需要配置 `ForwardedHeaders`/`XForwardedHeaders`。
在这种情况下，`X-Forwarded-For` 包含每个连续代理的所有 IP 地址，例如：

```HTTP
X-Forwarded-For: <client>, <proxy1>, <proxy2>
```

默认情况下，`XForwardedHeader` 将 `X-Forwarded-For` 中的第一个条目赋值给 `call.request.origin.remoteHost` 属性。
您还可以提供自定义逻辑来[选择 IP 地址](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For#selecting_an_ip_address)。
[XForwardedHeadersConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-forwarded-header/io.ktor.server.plugins.forwardedheaders/-x-forwarded-headers-config/index.html) 为此提供了以下 API：

- `useFirstProxy` 和 `useLastProxy` 允许您分别从 IP 地址列表中获取第一个或最后一个值。
- `skipLastProxies` 跳过从右侧开始的指定数量的条目，并获取下一个条目。
   例如，如果 `proxiesCount` 形参等于 `3`，对于以下头，`origin.remoteHost` 将返回 `10.0.0.123`：
   ```HTTP
   X-Forwarded-For: 10.0.0.123, proxy-1, proxy-2, proxy-3
   ```
- `skipKnownProxies` 从列表中移除指定的条目，并获取最后一个条目。
   例如，如果您将 `listOf("proxy-1", "proxy-3")` 传递给此函数，对于以下头，`origin.remoteHost` 将返回 `proxy-2`：
   ```HTTP
   X-Forwarded-For: 10.0.0.123, proxy-1, proxy-2, proxy-3
   ```
- `extractEdgeProxy` 允许您提供自定义逻辑，用于从 `X-Forward-*` 头中提取值。