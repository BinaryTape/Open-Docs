[//]: # (title: OpenAPI)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-openapi"/>
<var name="package_name" value="io.ktor.server.plugins.openapi"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-openapi/io.ktor.server.plugins.openapi/open-a-p-i.html"/>

<tldr>
<p>
<b>所需依赖项</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx-openapi"/>

    <p>
        <b>代码示例</b>：
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，并允许你在没有额外运行时或虚拟机的情况下运行服务器。">原生服务器</Links>支持</b>: ✖️
    </p>
    
</tldr>

<link-summary>
OpenAPI 插件允许你为项目生成 OpenAPI 文档。
</link-summary>

Ktor 允许你基于现有的 OpenAPI 规范，为你的项目生成并提供 OpenAPI 文档。

undefined

## 添加依赖项 {id="add_dependencies"}

* 提供 OpenAPI 文档需要在构建脚本中添加 `%artifact_name%` 构件：

  
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
    

* （可选）如果你想自定义一个 
   [代码生成器](https://github.com/swagger-api/swagger-codegen-generators)，可以添加 `swagger-codegen-generators` 依赖项：

  <var name="group_id" value="io.swagger.codegen.v3"/>
  <var name="artifact_name" value="swagger-codegen-generators"/>
  <var name="version" value="swagger_codegen_version"/>
  
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
    

  你可以将 `$swagger_codegen_version` 替换为 `swagger-codegen-generators` 构件所需的版本，例如 `%swagger_codegen_version%`。

## 配置 OpenAPI {id="configure-swagger"}

要提供 OpenAPI 文档，你需要调用 [openAPI](%plugin_api_link%) 方法。该方法会创建一个 `GET` 端点，其文档从 `swaggerFile` 处的 OpenAPI 规范渲染而来，并位于 `path` 路径：

```kotlin
import io.ktor.server.plugins.openapi.*

// ...
routing {
    openAPI(path="openapi", swaggerFile = "openapi/documentation.yaml")
}
```

该方法会尝试在应用程序资源中查找 OpenAPI 规范。
否则，它会尝试使用 `java.io.File` 从文件系统读取 OpenAPI 规范。

默认情况下，文档使用 `StaticHtml2Codegen` 生成。
你可以在 `openAPI` 代码块内自定义生成设置：

[object Promise]

你现在可以[运行](server-run.md)应用程序，并打开 `/openapi` 页面来查看生成的文档。