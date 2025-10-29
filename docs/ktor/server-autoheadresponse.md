[//]: # (title: AutoHeadResponse)

<var name="plugin_name" value="AutoHeadResponse"/>
<var name="artifact_name" value="ktor-server-auto-head-response"/>
<primary-label ref="server-plugin"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="autohead"/>
<p>
    <b>代码示例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，允许你在没有额外运行时或虚拟机的情况下运行服务器。">原生服务器</Links>支持</b>: ✅
</p>
</tldr>

<link-summary>
%plugin_name% 提供了针对每个定义了 GET 的路由自动响应 HEAD 请求的能力。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auto-head-response/io.ktor.server.plugins.autohead/-auto-head-response.html) 插件提供了针对每个定义了 `GET` 的路由自动响应 `HEAD` 请求的能力。如果你需要在客户端获取实际内容之前对响应进行某些处理，可以使用 %plugin_name% 来避免创建单独的 [head](server-routing.md#define_route) 处理程序。例如，调用 [respondFile](server-responses.md#file) 函数会自动向响应添加 `Content-Length` 和 `Content-Type` 标头，你可以在下载文件之前在客户端获取此信息。

## 添加依赖项 {id="add_dependencies"}

<p>
    要使用 <code>%plugin_name%</code>，你需要将 <code>%artifact_name%</code> 构件添加到构建脚本中：
</p>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## 用法
为了利用此功能，我们需要在应用程序中安装 `AutoHeadResponse` 插件。

```kotlin
import io.ktor.server.application.*
import io.ktor.server.plugins.autohead.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.main() {
    install(AutoHeadResponse)
    routing {
        get("/home") {
            call.respondText("This is a response to a GET, but HEAD also works")
        }
    }
}
```

在我们的示例中，`/home` 路由现在将响应 `HEAD` 请求，即使没有为此动词显式定义。

需要注意的是，如果我们使用此插件，对于相同的 `GET` 路由，自定义的 `HEAD` 定义将被忽略。

## 选项
`%plugin_name%` 不提供任何额外的配置选项。