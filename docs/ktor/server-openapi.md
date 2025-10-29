[//]: # (title: OpenAPI)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-openapi"/>
<var name="package_name" value="io.ktor.server.plugins.openapi"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server-openapi/io.ktor.server.plugins.openapi/open-a-p-i.html"/>

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
    <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，允许您无需额外的运行时或虚拟机即可运行服务器。">原生服务器</Links>支持</b>: ✖️
</p>
</tldr>

<link-summary>
OpenAPI 插件允许您为项目生成 OpenAPI 文档。
</link-summary>

Ktor 允许您基于现有的 OpenAPI 规范，为您的项目生成并提供 OpenAPI 文档。
您可以提供现有的 YAML 或 JSON 规范，也可以使用 Ktor Gradle 插件的
[OpenAPI 扩展](openapi-spec-generation.md) 生成一个。

## 添加依赖项 {id="add_dependencies"}

* 提供 OpenAPI 文档需要在构建脚本中添加 `%artifact_name%` artifact：

  <Tabs group="languages">
      <TabItem title="Gradle (Kotlin)" group-key="kotlin">
          <code-block lang="Kotlin" code="              implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
      </TabItem>
      <TabItem title="Gradle (Groovy)" group-key="groovy">
          <code-block lang="Groovy" code="              implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
      </TabItem>
      <TabItem title="Maven" group-key="maven">
          <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                  &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
      </TabItem>
  </Tabs>

* 可选地，如果您想自定义一个[代码生成器](https://github.com/swagger-api/swagger-codegen-generators)，请添加 `swagger-codegen-generators` 依赖项：

  <var name="group_id" value="io.swagger.codegen.v3"/>
  <var name="artifact_name" value="swagger-codegen-generators"/>
  <var name="version" value="swagger_codegen_version"/>
  <Tabs group="languages">
      <TabItem title="Gradle (Kotlin)" group-key="kotlin">
          <code-block lang="Kotlin" code="              implementation(&quot;%group_id%:%artifact_name%:$%version%&quot;)"/>
      </TabItem>
      <TabItem title="Gradle (Groovy)" group-key="groovy">
          <code-block lang="Groovy" code="              implementation &quot;%group_id%:%artifact_name%:$%version%&quot;"/>
      </TabItem>
      <TabItem title="Maven" group-key="maven">
          <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;%group_id%&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%&lt;/artifactId&gt;&#10;                  &lt;version&gt;${%version%}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
      </TabItem>
  </Tabs>

  您可以将 `$swagger_codegen_version` 替换为 `swagger-codegen-generators` artifact 所需的版本，例如 `%swagger_codegen_version%`。

## 配置 OpenAPI {id="configure-swagger"}

要提供 OpenAPI 文档，您需要调用 [openAPI](%plugin_api_link%) 方法，该方法会创建一个 `GET` 端点，其文档位于 `path` 处，并从 `swaggerFile` 处放置的 OpenAPI 规范渲染而来：

```kotlin
import io.ktor.server.plugins.openapi.*

// ...
routing {
    openAPI(path="openapi", swaggerFile = "openapi/documentation.yaml")
}
```

此方法会尝试在应用程序资源中查找 OpenAPI 规范。
否则，它会尝试使用 `java.io.File` 从文件系统读取 OpenAPI 规范。

默认情况下，文档是使用 `StaticHtml2Codegen` 生成的。
您可以在 `openAPI` 代码块内自定义生成设置：

```kotlin
routing {
    openAPI(path="openapi", swaggerFile = "openapi/documentation.yaml") {
        codegen = StaticHtmlCodegen()
    }
}
```

您现在可以[运行](server-run.md)应用程序并打开 `/openapi` 页面以查看生成的文档。