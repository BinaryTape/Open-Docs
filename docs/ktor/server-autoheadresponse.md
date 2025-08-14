[//]: # (title: AutoHeadResponse)

<var name="plugin_name" value="AutoHeadResponse"/>
<var name="artifact_name" value="ktor-server-auto-head-response"/>
<primary-label ref="server-plugin"/>

<tldr>
<p>
<b>必需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="autohead"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native 并允许您在没有额外运行时或虚拟机的情况下运行服务器。">原生服务器</Links>支持</b>: ✅
    </p>
    
</tldr>

<link-summary>
%plugin_name% 提供了自动响应每个定义了 GET 的路由的 HEAD 请求的能力。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auto-head-response/io.ktor.server.plugins.autohead/-auto-head-response.html) 插件提供了自动响应 `HEAD` 请求的能力，对于每个定义了 `GET` 的路由。您可以使用 `%plugin_name%` 来避免创建单独的 [head](server-routing.md#define_route) 处理器，如果您需要在获取实际内容之前，在客户端对响应进行某种处理。例如，调用 [respondFile](server-responses.md#file) 函数会自动将 `Content-Length` 和 `Content-Type` 头添加到响应中，您可以在下载文件之前在客户端获取这些信息。

## 添加依赖项 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，您需要将 <code>%artifact_name%</code> artifact 添加到构建脚本中：
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
    

## 用法
为了利用此功能，我们需要在应用程序中安装 `AutoHeadResponse` 插件。

[object Promise]

在本例中，`/home` 路由现在将响应 `HEAD` 请求，即使没有为该动词进行显式定义。

值得注意的是，如果我们使用此插件，为同一个 `GET` 路由定义的自定义 `HEAD` 将被忽略。

## 选项
%plugin_name% 不提供任何额外的配置选项。