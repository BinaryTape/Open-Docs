[//]: # (title: Swagger UI)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-swagger"/>
<var name="package_name" value="io.ktor.server.plugins.swagger"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-swagger/io.ktor.server.plugins.swagger/swagger-u-i.html"/>

<tldr>
<p>
<b>所需依赖</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx-openapi"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

<link-summary>
SwaggerUI 插件允许您为项目生成 Swagger UI。
</link-summary>

Ktor 允许您基于现有的 OpenAPI 规范，为您的项目生成并提供 Swagger UI。借助 Swagger UI，您可以可视化并与 API 资源进行交互。

> 以下工具可用于从代码生成 OpenAPI 定义，反之亦然：
> - 适用于 IntelliJ IDEA 的 [Ktor 插件](https://www.jetbrains.com/help/idea/ktor.html#openapi) 提供了为服务器端 Ktor 应用程序生成 OpenAPI 文档的功能。
> - [OpenAPI 生成器](https://github.com/OpenAPITools/openapi-generator) 允许您使用 [kotlin-server](https://github.com/OpenAPITools/openapi-generator/blob/master/docs/generators/kotlin-server.md) 生成器，从您的 API 定义创建 Ktor 项目。此外，您还可以使用 IntelliJ IDEA 的 [功能](https://www.jetbrains.com/help/idea/openapi.html#codegen)。
> 
{id="open-api-note"}

## 添加依赖项 {id="add_dependencies"}

要提供 Swagger UI，需要在构建脚本中添加 `%artifact_name%` artifact：

<include from="lib.topic" element-id="add_ktor_artifact"/>

## 配置 Swagger UI {id="configure-swagger"}

要提供 Swagger UI，您需要调用 [swaggerUI](%plugin_api_link%) 方法，该方法会创建一个 `GET` 端点，其中 `path` 处的 Swagger UI 将从 `swaggerFile` 处的 OpenAPI 规范渲染而来：

```kotlin
import io.ktor.server.plugins.swagger.*

// ...
routing {
    swaggerUI(path = "swagger", swaggerFile = "openapi/documentation.yaml")
}
```

此方法会尝试在应用程序资源中查找 OpenAPI 规范。否则，它会尝试使用 `java.io.File` 从文件系统读取 OpenAPI 规范。

您可以选择在 `swaggerUI` 代码块内部自定义 Swagger UI。例如，您可以使用其他 Swagger UI 版本或应用自定义样式。

```kotlin
```
{src="snippets/json-kotlinx-openapi/src/main/kotlin/com/example/Application.kt" include-lines="39,52-54,58"}

您现在可以 [运行](server-run.md) 应用程序并打开 `/swagger` 页面，查看并测试可用端点。

## 配置 CORS {id="configure-cors"}

为确保您的 API 能与 Swagger UI 良好协作，您需要为 [跨域资源共享 (CORS)](server-cors.md) 设置策略。以下示例应用了以下 CORS 配置：
- `anyHost` 允许来自任何主机的跨域请求；
- `allowHeader` 允许在 [内容协商](server-serialization.md) 中使用的 `Content-Type` 客户端头。

```kotlin
```
{src="snippets/json-kotlinx-openapi/src/main/kotlin/com/example/Application.kt" include-lines="35-38"}