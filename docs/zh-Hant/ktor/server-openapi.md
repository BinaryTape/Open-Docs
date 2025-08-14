[//]: # (title: OpenAPI)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-openapi"/>
<var name="package_name" value="io.ktor.server.plugins.openapi"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-openapi/io.ktor.server.plugins.openapi/open-a-p-i.html"/>

<tldr>
<p>
<b>必備依賴</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx-openapi"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，並允許您在沒有額外運行時或虛擬機器的情況下執行伺服器。">原生伺服器</Links>支援</b>: ✖️
    </p>
    
</tldr>

<link-summary>
OpenAPI 外掛程式允許您為您的專案產生 OpenAPI 文件。
</link-summary>

Ktor 允許您根據現有的 OpenAPI 規範，為您的專案產生並提供 OpenAPI 文件。

## 新增依賴 {id="add_dependencies"}

*   提供 OpenAPI 文件需要您在建置腳本中加入 `%artifact_name%` artifact：

  
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
    

*   您可以選擇性地新增 `swagger-codegen-generators` 依賴，如果您想要自訂
    [程式碼產生器](https://github.com/swagger-api/swagger-codegen-generators)：

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
    

  您可以將 `$swagger_codegen_version` 替換為 `swagger-codegen-generators` artifact 所需的版本，例如 `%swagger_codegen_version%`。

## 配置 OpenAPI {id="configure-swagger"}

為了提供 OpenAPI 文件，您需要呼叫 [openAPI](%plugin_api_link%) 方法，此方法會建立一個 `GET` 端點，其文件位於從 `swaggerFile` 中的 OpenAPI 規範所呈現的 `path`：

```kotlin
import io.ktor.server.plugins.openapi.*

// ...
routing {
    openAPI(path="openapi", swaggerFile = "openapi/documentation.yaml")
}
```

此方法會嘗試在應用程式資源中查找 OpenAPI 規範。
否則，它會嘗試使用 `java.io.File` 從檔案系統讀取 OpenAPI 規範。

預設情況下，文件是使用 `StaticHtml2Codegen` 產生的。
您可以在 `openAPI` 區塊內自訂產生設定：

[object Promise]

您現在可以 [執行](server-run.md) 應用程式並開啟 `/openapi` 頁面以查看產生的文件。