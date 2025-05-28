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
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

<link-summary>
OpenAPI 外掛 (plugin) 允許您為專案產生 OpenAPI 文件。
</link-summary>

Ktor 允許您基於現有的 OpenAPI 規範，為您的專案產生並提供 OpenAPI 文件服務。

<include from="server-swagger-ui.md" element-id="open-api-note"/>

## 新增依賴項 {id="add_dependencies"}

* 提供 OpenAPI 文件服務需要在建置腳本中新增 `%artifact_name%` 構件 (artifact)：

  <include from="lib.topic" element-id="add_ktor_artifact"/>

* 選擇性地，如果您想自訂一個 [程式碼產生器](https://github.com/swagger-api/swagger-codegen-generators)，請新增 `swagger-codegen-generators` 依賴項：

  <var name="group_id" value="io.swagger.codegen.v3"/>
  <var name="artifact_name" value="swagger-codegen-generators"/>
  <var name="version" value="swagger_codegen_version"/>
  <include from="lib.topic" element-id="add_artifact"/>

  您可以將 `$swagger_codegen_version` 替換為 `swagger-codegen-generators` 構件所需版本，例如 `%swagger_codegen_version%`。

## 配置 OpenAPI {id="configure-swagger"}

為了提供 OpenAPI 文件服務，您需要呼叫 [openAPI](%plugin_api_link%) 方法，該方法會建立一個 `GET` 端點，其文件是從位於 `swaggerFile` 的 OpenAPI 規範渲染並放置於 `path`：

```kotlin
import io.ktor.server.plugins.openapi.*

// ...
routing {
    openAPI(path="openapi", swaggerFile = "openapi/documentation.yaml")
}
```

此方法會嘗試在應用程式資源中查找 OpenAPI 規範。否則，它會嘗試使用 `java.io.File` 從檔案系統讀取 OpenAPI 規範。

預設情況下，文件是使用 `StaticHtml2Codegen` 產生的。您可以在 `openAPI` 區塊內部自訂產生設定：

```kotlin
```
{src="snippets/json-kotlinx-openapi/src/main/kotlin/com/example/Application.kt" include-lines="39,55-58"}

您現在可以 [執行](server-run.md) 應用程式並開啟 `/openapi` 頁面以查看產生的文件。