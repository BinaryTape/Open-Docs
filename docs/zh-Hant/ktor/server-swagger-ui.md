[//]: # (title: Swagger UI)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-swagger"/>
<var name="package_name" value="io.ktor.server.plugins.swagger"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-swagger/io.ktor.server.plugins.swagger/swagger-u-i.html"/>

<tldr>
<p>
<b>所需依賴</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx-openapi"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，並允許您在沒有額外運行時或虛擬機器的情況下運行伺服器。">原生伺服器</Links> 支援</b>: ✖️
    </p>
    
</tldr>

<link-summary>
SwaggerUI 外掛程式允許您為您的專案產生 Swagger UI。
</link-summary>

Ktor 允許您根據現有的 OpenAPI 規範為您的專案產生並提供 Swagger UI。
透過 Swagger UI，您可以視覺化並與 API 資源互動。 

> 以下工具可用於從程式碼產生 OpenAPI 定義，反之亦然：
> - 適用於 IntelliJ IDEA 的 [Ktor 外掛程式](https://www.jetbrains.com/help/idea/ktor.html#openapi) 提供了為伺服器端 Ktor 應用程式產生 OpenAPI 文件記錄的功能。
> - [OpenAPI generator](https://github.com/OpenAPITools/openapi-generator) 允許您使用 [kotlin-server](https://github.com/OpenAPITools/openapi-generator/blob/master/docs/generators/kotlin-server.md) 產生器從您的 API 定義建立 Ktor 專案。或者，您可以使用 IntelliJ IDEA 的 [功能](https://www.jetbrains.com/help/idea/openapi.html#codegen)。
> 
{id="open-api-note"}

## 新增依賴項 {id="add_dependencies"}

提供 Swagger UI 需要在建置指令碼中新增 `%artifact_name%` 構件：

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
    

## 設定 Swagger UI {id="configure-swagger"}

為了提供 Swagger UI，您需要呼叫 [swaggerUI](%plugin_api_link%) 方法，該方法會在 `path` 處建立一個 `GET` 端點，其 Swagger UI 是從位於 `swaggerFile` 的 OpenAPI 規範渲染而來：

```kotlin
import io.ktor.server.plugins.swagger.*

// ...
routing {
    swaggerUI(path = "swagger", swaggerFile = "openapi/documentation.yaml")
}
```

此方法會嘗試在應用程式資源中尋找 OpenAPI 規範。
否則，它會嘗試使用 `java.io.File` 從檔案系統讀取 OpenAPI 規範。

您可以選擇在 `swaggerUI` 區塊內自訂 Swagger UI。
例如，您可以使用另一個 Swagger UI 版本或應用自訂樣式。

[object Promise]

您現在可以[運行](server-run.md)應用程式並開啟 `/swagger` 頁面以查看可用的端點並進行測試。

## 設定 CORS {id="configure-cors"}

為確保您的 API 與 Swagger UI 良好運作，您需要設定 [跨來源資源共享 (CORS)](server-cors.md) 政策。
以下範例應用了以下 CORS 配置：
- `anyHost` 允許來自任何主機的跨來源請求；
- `allowHeader` 允許 [內容協商](server-serialization.md) 中使用的 `Content-Type` 用戶端標頭。

[object Promise]