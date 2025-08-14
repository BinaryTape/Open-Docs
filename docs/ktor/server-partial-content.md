[//]: # (title: 部分内容)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-partial-content"/>
<var name="package_name" value="io.ktor.server.plugins.partialcontent"/>
<var name="plugin_name" value="PartialContent"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p>
<b>服务器示例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/download-file">download-file</a>,
<b>客户端示例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-file-range">client-download-file-range</a>
</p>

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，允许您在没有额外运行时或虚拟机的情况下运行服务器。">原生服务器</Links>支持</b>: ✅
    </p>
    
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-partial-content/io.ktor.server.plugins.partialcontent/-partial-content.html) 插件增加了对处理 [HTTP 区间请求](https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests) 的支持，这些请求用于仅将 HTTP 消息的一部分发送回客户端。此插件适用于流式传输内容或恢复部分下载。

`%plugin_name%` 具有以下限制：
- 仅适用于 `HEAD` 和 `GET` 请求，如果客户端尝试将 `Range` 请求头与其它方法一起使用，则返回 `405 Method Not Allowed`。
- 仅适用于定义了 `Content-Length` 响应头的响应。
- 在提供区间内容时禁用 [压缩](server-compression.md)。

## 添加依赖项 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，您需要在构建脚本中包含 <code>%artifact_name%</code> artifact：
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
    

## 安装 %plugin_name% {id="install_plugin"}

    <p>
        要 <a href="#install">安装</a> <code>%plugin_name%</code> 插件到应用程序，
        请在指定的 <Links href="/ktor/server-modules" summary="模块允许您通过分组路由来组织应用程序。">模块</Links> 中将其传递给 <code>install</code> 函数。
        以下代码片段展示了如何安装 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ...在 <code>embeddedServer</code> 函数调用内部。
        </li>
        <li>
            ...在显式定义的 <code>module</code> 内部，该模块是 <code>Application</code> 类的扩展函数。
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
    

    <p>
        <code>%plugin_name%</code> 插件也可以 <a href="#install-route">安装到特定的路由</a>。
        如果您需要针对不同的应用程序资源使用不同的 <code>%plugin_name%</code> 配置，这可能会很有用。
    </p>
    

要了解如何使用 `%%plugin_name%` 通过 HTTP 区间请求提供文件，请参见 [](server-responses.md#file) 部分。