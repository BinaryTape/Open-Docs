[//]: # (title: 条件请求头)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-conditional-headers"/>
<var name="package_name" value="io.ktor.server.plugins.conditionalheaders"/>
<var name="plugin_name" value="ConditionalHeaders"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="conditional-headers"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，并允许您在没有额外运行时或虚拟机的情况下运行服务器。">原生服务器</Links>支持</b>: ✅
    </p>
    
</tldr>

[ConditionalHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-conditional-headers/io.ktor.server.plugins.conditionalheaders/-conditional-headers.html) 插件可避免在内容主体自上次请求以来未发生改变时发送其内容。这是通过使用以下请求头实现的：
*   `Last-Modified` 响应请求头包含资源修改时间。例如，如果客户端请求包含 `If-Modified-Since` 值，Ktor 将仅在资源于给定日期之后被修改时发送完整响应。请注意，对于[静态文件](server-static-content.md)，Ktor 在[安装](#install_plugin) `ConditionalHeaders` 后会自动附加 `Last-Modified` 请求头。
*   `Etag` 响应请求头是特定资源版本的标识符。例如，如果客户端请求包含 `If-None-Match` 值，Ktor 将在**此值**与 `Etag` 匹配的情况下不会发送完整响应。您可以在[配置](#configure) `ConditionalHeaders` 时指定 `Etag` 值。

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
        要将 <code>%plugin_name%</code> 插件<a href="#install">安装</a>到应用程序，
        请在指定的<Links href="/ktor/server-modules" summary="模块允许您通过对路由进行分组来组织您的应用程序。">模块</Links>中将其传递给 <code>install</code> 函数。
        下面的代码片段展示了如何安装 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函数调用内部。
        </li>
        <li>
            ... 在显式定义的 <code>module</code> 内部，它是 <code>Application</code> 类的扩展函数。
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
        <code>%plugin_name%</code> 插件也可以<a href="#install-route">安装到特定路由</a>。
        如果您需要针对不同的应用程序资源使用不同的 <code>%plugin_name%</code> 配置，这可能会很有用。
    </p>
    

## 配置请求头 {id="configure"}

要配置 `%plugin_name%`，您需要在 `install` 块内部调用 [version](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-conditional-headers/io.ktor.server.plugins.conditionalheaders/-conditional-headers-config/version.html) 函数。此函数提供对给定 `ApplicationCall` 和 `OutgoingContent` 的资源版本列表的访问。您可以通过使用 [EntityTagVersion](https://api.ktor.io/ktor-http/io.ktor.http.content/-entity-tag-version/index.html) 和 [LastModifiedVersion](https://api.ktor.io/ktor-http/io.ktor.http.content/-last-modified-version/index.html) 类对象来指定所需的版本。

下面的代码片段展示了如何为 CSS 添加 `Etag` 和 `Last-Modified` 请求头：
[object Promise]

您可以在此处找到完整示例：[conditional-headers](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/conditional-headers)。