[//]: # (title: Swagger UI)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-swagger"/>
<var name="package_name" value="io.ktor.server.plugins.swagger"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-swagger/io.ktor.server.plugins.swagger/swagger-u-i.html"/>

<tldr>
<p>
<b>所需依賴項</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx-openapi"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

<link-summary>
Swagger UI 插件允許您為專案生成 Swagger UI。
</link-summary>

Ktor 允許您根據現有的 OpenAPI 規範，為專案生成並提供 Swagger UI。使用 Swagger UI，您可以視覺化並與 API 資源互動。

> 以下工具可用於從程式碼生成 OpenAPI 定義，反之亦然：
> - 適用於 IntelliJ IDEA 的 [Ktor 插件](https://www.jetbrains.com/help/idea/ktor.html#openapi) 提供了為伺服器端 Ktor 應用程式生成 OpenAPI 文件 的能力。
> - [OpenAPI 生成器](https://github.com/OpenAPITools/openapi-generator) 允許您使用 [kotlin-server](https://github.com/OpenAPITools/openapi-generator/blob/master/docs/generators/kotlin-server.md) 生成器，從您的 API 定義中建立 Ktor 專案。或者，您也可以使用 IntelliJ IDEA 的 [功能](https://www.jetbrains.com/help/idea/openapi.html#codegen)。
> 
{id="open-api-note"}

## 新增依賴項 {id="add_dependencies"}

要提供 Swagger UI，需要在建構腳本中新增 `%artifact_name%` artifact：

<include from="lib.topic" element-id="add_ktor_artifact"/>

## 設定 Swagger UI {id="configure-swagger"}

要提供 Swagger UI，您需要呼叫 [swaggerUI](%plugin_api_link%) 方法，該方法會建立一個 `GET` 端點，並在其中包含 Swagger UI 路徑位於 `path`，其內容從 `swaggerFile` 處的 OpenAPI 規範渲染而來：

```kotlin
import io.ktor.server.plugins.swagger.*

// ...
routing {
    swaggerUI(path = "swagger", swaggerFile = "openapi/documentation.yaml")
}
```

此方法會嘗試在應用程式資源中查找 OpenAPI 規範。否則，它會嘗試使用 `java.io.File` 從檔案系統讀取 OpenAPI 規範。

您可以選擇性地在 `swaggerUI` 區塊內自訂 Swagger UI。例如，您可以使用其他 Swagger UI 版本或應用自訂樣式。

```kotlin
```
{src="snippets/json-kotlinx-openapi/src/main/kotlin/com/example/Application.kt" include-lines="39,52-54,58"}

您現在可以 [執行](server-run.md) 應用程式並開啟 `/swagger` 頁面，以查看可用端點並進行測試。

## 設定 CORS {id="configure-cors"}

為確保您的 API 能與 Swagger UI 良好配合，您需要為 [跨來源資源共享 (CORS)](server-cors.md) 設定策略。以下範例應用了以下 CORS 設定：
- `anyHost` 啟用來自任何主機的跨來源請求；
- `allowHeader` 允許 [內容協商](server-serialization.md) 中使用的 `Content-Type` 用戶端標頭。

```kotlin
```
{src="snippets/json-kotlinx-openapi/src/main/kotlin/com/example/Application.kt" include-lines="35-38"}