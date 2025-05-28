[//]: # (title: OpenAPI)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-openapi"/>
<var name="package_name" value="io.ktor.server.plugins.openapi"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-openapi/io.ktor.server.plugins.openapi/open-a-p-i.html"/>

<tldr>
<p>
<b>所需依赖</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx-openapi"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

<link-summary>
OpenAPI 插件允许你为项目生成 OpenAPI 文档。
</link-summary>

Ktor 允许你根据现有 OpenAPI 规范为项目生成并提供 OpenAPI 文档。

<include from="server-swagger-ui.md" element-id="open-api-note"/>

## 添加依赖 {id="add_dependencies"}

* 提供 OpenAPI 文档需要在构建脚本中添加 `%artifact_name%` artifact：

  <include from="lib.topic" element-id="add_ktor_artifact"/>

* （可选）如果你想自定义一个
   [代码生成器](https://github.com/swagger-api/swagger-codegen-generators)，请添加 `swagger-codegen-generators` 依赖：

  <var name="group_id" value="io.swagger.codegen.v3"/>
  <var name="artifact_name" value="swagger-codegen-generators"/>
  <var name="version" value="swagger_codegen_version"/>
  <include from="lib.topic" element-id="add_artifact"/>

  你可以将 `$swagger_codegen_version` 替换为所需版本的 `swagger-codegen-generators` artifact，例如 `%swagger_codegen_version%`。

## 配置 OpenAPI {id="configure-swagger"}

为了提供 OpenAPI 文档，你需要调用 [openAPI](%plugin_api_link%) 方法。该方法会创建一个 `GET` 端点，其文档路径 `path` 从 `swaggerFile` 中放置的 OpenAPI 规范渲染而来：

```kotlin
import io.ktor.server.plugins.openapi.*

// ...
routing {
    openAPI(path="openapi", swaggerFile = "openapi/documentation.yaml")
}
```

此方法会尝试在应用程序资源中查找 OpenAPI 规范。
否则，它会尝试使用 `java.io.File` 从文件系统读取 OpenAPI 规范。

默认情况下，文档使用 `StaticHtml2Codegen` 生成。
你可以在 `openAPI` 块内自定义生成设置：

```kotlin
```
{src="snippets/json-kotlinx-openapi/src/main/kotlin/com/example/Application.kt" include-lines="39,55-58"}

现在你可以 [运行](server-run.md) 应用程序并打开 `/openapi` 页面以查看生成的文档。