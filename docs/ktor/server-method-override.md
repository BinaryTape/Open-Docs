[//]: # (title: XHttpMethodOverride)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="XHttpMethodOverride"/>
<var name="package_name" value="io.ktor.server.plugins.methodoverride"/>
<var name="artifact_name" value="ktor-server-method-override"/>

<tldr>
<p>
<b>必需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx-method-override"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，并允许您在没有额外运行时或虚拟机的情况下运行服务器。">原生服务器</Links> 支持</b>: ✅
    </p>
    
</tldr>

<link-summary>
%plugin_name% 提供了在 X-HTTP-Method-Override 头中隧道化 HTTP 动词的能力。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-method-override/io.ktor.server.plugins.methodoverride/-x-http-method-override.html) 插件提供了在 `X-HTTP-Method-Override` 头中隧道化 HTTP 动词的能力。
如果您的服务器 API 处理多种 HTTP 动词（`GET`、`PUT`、`POST`、`DELETE` 等），但由于特定的限制，客户端只能使用有限的动词集（例如，`GET` 和 `POST`），这可能很有用。
例如，如果客户端发送一个将 `X-Http-Method-Override` 头设置为 `DELETE` 的请求，Ktor 将使用 `delete` [路由处理器](server-routing.md#define_route) 来处理此请求。

## 添加依赖项 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，您需要将 <code>%artifact_name%</code> 构件包含在构建脚本中：
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
        要<a href="#install">安装</a> <code>%plugin_name%</code> 插件到应用程序中，
        请在指定的<Links href="/ktor/server-modules" summary="模块允许您通过对路由进行分组来构建应用程序结构。">模块</Links>中将其传递给 <code>install</code> 函数。
        以下代码片段展示了如何安装 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函数调用内部。
        </li>
        <li>
            ... 在显式定义的 <code>module</code> 内部，该 <code>module</code> 是 <code>Application</code> 类的扩展函数。
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

默认情况下，`%plugin_name%` 检测 `X-Http-Method-Override` 头来确定应该处理该请求的路由。
您可以使用 `headerName` 属性自定义头名称。

## 示例 {id="example"}

以下 HTTP 请求使用 `POST` 动词，并将 `X-Http-Method-Override` 头设置为 `DELETE`：

[object Promise]

为了处理此类请求，使用 `delete` [路由处理器](server-routing.md#define_route)，您需要安装 `%plugin_name%`：

[object Promise]

您可以在此处找到完整示例：[json-kotlinx-method-override](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx-method-override)。