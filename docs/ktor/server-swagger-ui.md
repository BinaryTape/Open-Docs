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
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native 并允许您无需额外的运行时或虚拟机即可运行服务器。">原生服务器</Links> 支持</b>: ✖️
    </p>
    
</tldr>

<link-summary>
SwaggerUI 插件允许您为您的项目生成 Swagger UI。
</link-summary>

Ktor 允许您基于现有的 OpenAPI 规范为您的项目生成并提供 Swagger UI。
使用 Swagger UI，您可以可视化并与 API 资源交互。

> 以下工具可用于从代码生成 OpenAPI 定义，反之亦然：
> - [Ktor 插件](https://www.jetbrains.com/help/idea/ktor.html#openapi) 用于 IntelliJ IDEA，它提供了为服务器端 Ktor 应用程序生成 OpenAPI 文档的能力。
> - [OpenAPI 生成器](https://github.com/OpenAPITools/openapi-generator) 允许您通过使用 [kotlin-server](https://github.com/OpenAPITools/openapi-generator/blob/master/docs/generators/kotlin-server.md) 生成器从您的 API 定义创建 Ktor 项目。或者，您可以使用 IntelliJ IDEA 的 [功能](https://www.jetbrains.com/help/idea/openapi.html#codegen)。
> 
{id="open-api-note"}

## 添加依赖项 {id="add_dependencies"}

提供 Swagger UI 需要在构建脚本中添加 `%artifact_name%` artifact：

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
    

## 配置 Swagger UI {id="configure-swagger"}

为了提供 Swagger UI，您需要调用 [swaggerUI](%plugin_api_link%) 方法，该方法会创建一个带有 Swagger UI 的 `GET` 端点，其 `path` 从位于 `swaggerFile` 的 OpenAPI 规范渲染而来：

```kotlin
import io.ktor.server.plugins.swagger.*

// ...
routing {
    swaggerUI(path = "swagger", swaggerFile = "openapi/documentation.yaml")
}
```

此方法尝试在应用程序资源中查找 OpenAPI 规范。
否则，它会尝试从文件系统使用 `java.io.File` 读取 OpenAPI 规范。

可选地，您可以在 `swaggerUI` 代码块内自定义 Swagger UI。
例如，您可以使用其他 Swagger UI 版本或应用自定义样式。

[object Promise]

您现在可以[运行](server-run.md)应用程序并打开 `/swagger` 页面，查看可用端点并进行测试。

## 配置 CORS {id="configure-cors"}

为了确保您的 API 与 Swagger UI 良好协作，您需要为[跨域资源共享 (CORS)](server-cors.md) 设置策略。
以下示例应用以下 CORS 配置：
- `anyHost` 允许来自任意主机的跨域请求；
- `allowHeader` 允许在[内容协商](server-serialization.md)中使用的 `Content-Type` 客户端标头。

[object Promise]