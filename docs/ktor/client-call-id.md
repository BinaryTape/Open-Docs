[//]: # (title: 在 Ktor 客户端中追踪请求)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<var name="artifact_name" value="ktor-client-call-id"/>
<var name="package_name" value="io.ktor.client.plugins.callid"/>
<var name="plugin_name" value="CallId"/>

<tldr>
<p>
<b>所需依赖项</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-call-id"/>

    <p>
        <b>代码示例</b>：
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<link-summary>
%plugin_name% 客户端插件允许你通过唯一的调用 ID 来追踪客户端请求。
</link-summary>

%plugin_name% 插件允许你通过唯一的调用 ID 端到端地追踪客户端请求。它在微服务架构中尤其有用，可以跟踪调用，无论请求经过多少服务。

调用作用域的协程上下文中可能已经存在调用 ID。默认情况下，该插件使用当前上下文检索调用 ID，并使用 `HttpHeaders.XRequestId` 请求头将其添加到特定调用的上下文中。

此外，如果作用域没有调用 ID，你可以[配置插件](#configure)以生成并应用新的调用 ID。

> 在服务器端，Ktor 提供了 [CallId](server-call-id.md) 插件用于追踪客户端请求。

## 添加依赖项 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，你需要将 <code>%artifact_name%</code> artifact 添加到构建脚本中：
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
        要将 <code>%plugin_name%</code> 插件<a href="#install">安装</a>到应用程序，请将其传递给指定<Links href="/ktor/server-modules" summary="模块允许你通过对路由进行分组来组织应用程序。">模块</Links>中的 <code>install</code> 函数。
        下面的代码片段展示了如何安装 <code>%plugin_name%</code> ……
    </p>
    <list>
        <li>
            ……在 <code>embeddedServer</code> 函数调用内部。
        </li>
        <li>
            ……在显式定义的 <code>module</code> 内部，这是一个 <code>Application</code> 类的扩展函数。
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
    

## 配置 %plugin_name% {id="configure"}

%plugin_name% 插件配置由
[CallIdConfig](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-call-id/io.ktor.client.plugins.callid/-call-id-config/index.html)
类提供，允许你生成调用 ID 并将其添加到调用上下文。

### 生成调用 ID

通过以下方法之一为特定请求生成调用 ID：

*   `useCoroutineContext` 属性（默认启用）添加一个生成器，该生成器使用当前的 `CoroutineContext` 来检索调用 ID。要禁用此功能，请将 `useCoroutineContext` 设置为 `false`：

 [object Promise]

> 在 Ktor 服务器中，使用 [CallId 插件](server-call-id.md)将调用 ID 添加到 `CoroutineContext`。

*   `generate()` 函数允许你为传出请求生成调用 ID。如果生成调用 ID 失败，它将返回 `null`。

 [object Promise]

你可以使用多种方法生成调用 ID。这样，第一个非 null 值将被应用。

### 添加调用 ID

检索到调用 ID 后，你可以选择以下选项将其添加到请求中：

*   `intercept()` 函数允许你通过使用 `CallIdInterceptor` 将调用 ID 添加到请求中。

 [object Promise]

*   `addToHeader()` 函数将调用 ID 添加到指定的请求头。它将请求头作为参数，默认为 `HttpHeaders.XRequestId`。

 [object Promise]

## 示例

在以下示例中，Ktor 客户端的 `%plugin_name%` 插件被配置为生成新的调用 ID 并将其添加到请求头中：

 [object Promise]

该插件使用协程上下文获取调用 ID，并利用 `generate()` 函数生成新的调用 ID。然后，第一个非 null 的调用 ID 通过 `addToHeader()` 函数应用到请求头中。

在 Ktor 服务器中，可以使用 [CallId 插件](server-call-id.md)中的 [retrieve](server-call-id.md#retrieve) 函数从请求头中检索调用 ID。

 [object Promise]

这样，Ktor 服务器检索指定请求头的 ID，并将其应用到调用的 `callId` 属性。

有关完整示例，请参见 [client-call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-call-id)