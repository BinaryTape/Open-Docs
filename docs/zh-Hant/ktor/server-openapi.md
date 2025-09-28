[//]: # (title: OpenAPI)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-openapi"/>
<var name="package_name" value="io.ktor.server.plugins.openapi"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-openapi/io.ktor.server.plugins.openapi/open-a-p-i.html"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx-openapi"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，並允許您在沒有額外執行時或虛擬機器的情況下執行伺服器。">原生伺服器</Links>支援</b>: ✖️
</p>
</tldr>

<link-summary>
OpenAPI 插件可讓您為專案產生 OpenAPI 文件。
</link-summary>

Ktor 允許您根據現有的 OpenAPI 規範，為您的專案產生並提供 OpenAPI 文件。
您可以提供現有的 YAML 或 JSON 規範，或使用 Ktor Gradle plugin 的 [OpenAPI 擴充功能](openapi-spec-generation.md) 來產生一個。

## 新增依賴項 {id="add_dependencies"}

*   提供 OpenAPI 文件需要在建置腳本中新增 `%artifact_name%` 構件：

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

*   選擇性地，如果您想要客製化一個
   [程式碼產生器](https://github.com/swagger-api/swagger-codegen-generators)，請新增 `swagger-codegen-generators` 依賴項：

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

  您可以將 `$swagger_codegen_version` 替換為 `swagger-codegen-generators` 構件所需的版本，例如 `%swagger_codegen_version%`。

## 配置 OpenAPI {id="configure-swagger"}

要提供 OpenAPI 文件，您需要呼叫 [openAPI](%plugin_api_link%) 方法。此方法會建立一個 `GET` 端點，其文件將從位於 `swaggerFile` 的 OpenAPI 規範渲染並顯示在 `path`：

```kotlin
import io.ktor.server.plugins.openapi.*

// ...
routing {
    openAPI(path="openapi", swaggerFile = "openapi/documentation.yaml")
}
```

此方法會嘗試在應用程式資源中查找 OpenAPI 規範。否則，它會嘗試使用 `java.io.File` 從檔案系統讀取 OpenAPI 規範。

預設情況下，文件是使用 `StaticHtml2Codegen` 產生。您可以在 `openAPI` 區塊內客製化產生設定：

```kotlin
routing {
    openAPI(path="openapi", swaggerFile = "openapi/documentation.yaml") {
        codegen = StaticHtmlCodegen()
    }
}
```

您現在可以 [執行](server-run.md) 應用程式並開啟 `/openapi` 頁面以查看產生文件。