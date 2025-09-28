[//]: # (title: Swagger UI)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-swagger"/>
<var name="package_name" value="io.ktor.server.plugins.swagger"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-swagger/io.ktor.server.plugins.swagger/swagger-u-i.html"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx-openapi"/>
<p>
    <b>代码示例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，允许您在没有额外运行时或虚拟机的情况下运行服务器。">原生服务器</Links>支持</b>: ✖️
</p>
</tldr>

<link-summary>
Swagger UI 插件允许您为项目生成 Swagger UI。
</link-summary>

Ktor 允许您基于现有 OpenAPI 规范为项目生成并提供 Swagger UI。借助 Swagger UI，您可以可视化 API 资源并与之交互。您可以提供现有的 YAML 或 JSON 规范，也可以使用 Ktor Gradle 插件的 [OpenAPI 扩展](openapi-spec-generation.md) 生成一个。

## 添加依赖项 {id="add_dependencies"}

提供 Swagger UI 需要在构建脚本中添加 `%artifact_name%` 构件：

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

## 配置 Swagger UI {id="configure-swagger"}

要提供 Swagger UI，您需要调用 [swaggerUI](%plugin_api_link%) 方法，该方法会在 `path` 上创建一个 `GET` 端点，其 Swagger UI 是从位于 `swaggerFile` 的 OpenAPI 规范渲染而来的：

```kotlin
import io.ktor.server.plugins.swagger.*

// ...
routing {
    swaggerUI(path = "swagger", swaggerFile = "openapi/documentation.yaml")
}
```

此方法尝试在应用程序资源中查找 OpenAPI 规范。否则，它会尝试使用 `java.io.File` 从文件系统读取 OpenAPI 规范。

（可选）您可以在 `swaggerUI` 代码块内部定制 Swagger UI。例如，您可以使用另一个 Swagger UI 版本或应用自定义样式。

```kotlin
routing {
    swaggerUI(path = "swagger", swaggerFile = "openapi/documentation.yaml") {
        version = "4.15.5"
    }
}
```

现在，您可以[运行](server-run.md)应用程序并打开 `/swagger` 页面，以查看可用的端点并测试它们。

## 配置 CORS {id="configure-cors"}

为了确保您的 API 与 Swagger UI 良好协作，您需要为[跨域资源共享 (CORS)](server-cors.md) 设置策略。以下示例应用了以下 CORS 配置：
- `anyHost` 启用来自任何主机的跨域请求；
- `allowHeader` 允许在[内容协商](server-serialization.md)中使用的 `Content-Type` 客户端标头。

```kotlin
install(CORS) {
    anyHost()
    allowHeader(HttpHeaders.ContentType)
}
```