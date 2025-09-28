[//]: # (title: Swagger UI)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-swagger"/>
<var name="package_name" value="io.ktor.server.plugins.swagger"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-swagger/io.ktor.server.plugins.swagger/swagger-u-i.html"/>

<tldr>
<p>
<b>所需依賴</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx-openapi"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">原生伺服器</Links> 支援</b>: ✖️
</p>
</tldr>

<link-summary>
Swagger UI 外掛程式可讓您為專案產生 Swagger UI。
</link-summary>

Ktor 可讓您基於現有的 OpenAPI 規格，為您的專案產生並提供 Swagger UI。
透過 Swagger UI，您可以視覺化並與 API 資源互動。您可以提供現有的 YAML 或 JSON 規格，或者使用 Ktor Gradle 外掛程式的 [OpenAPI 擴充功能](openapi-spec-generation.md) 產生一個。

## 新增依賴 {id="add_dependencies"}

提供 Swagger UI 服務需要在建置腳本中新增 `%artifact_name%` artifact：

<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## 設定 Swagger UI {id="configure-swagger"}

若要提供 Swagger UI 服務，您需要呼叫 [swaggerUI](%plugin_api_link%) 方法，該方法會建立一個帶有 Swagger UI 的 `GET` 端點，位於從 `swaggerFile` 中的 OpenAPI 規格所呈現的 `path`：

```kotlin
import io.ktor.server.plugins.swagger.*

// ...
routing {
    swaggerUI(path = "swagger", swaggerFile = "openapi/documentation.yaml")
}
```

此方法會嘗試在應用程式資源中尋找 OpenAPI 規格。
否則，它會嘗試使用 `java.io.File` 從檔案系統讀取 OpenAPI 規格。

您可以選擇在 `swaggerUI` 區塊內客製化 Swagger UI。
例如，您可以使用另一個 Swagger UI 版本或套用自訂樣式。

```kotlin
routing {
    swaggerUI(path = "swagger", swaggerFile = "openapi/documentation.yaml") {
        version = "4.15.5"
    }
}
```

您現在可以 [執行](server-run.md) 應用程式並打開 `/swagger` 頁面，以查看可用的端點並進行測試。

## 設定 CORS {id="configure-cors"}

為了確保您的 API 能與 Swagger UI 良好運作，您需要為 [跨來源資源共享 (CORS)](server-cors.md) 設定一個策略。
下方的範例套用了以下 CORS 設定：
- `anyHost` 啟用來自任何主機的跨來源請求；
- `allowHeader` 允許 [內容協商](server-serialization.md) 中使用的 `Content-Type` 用戶端標頭。

```kotlin
install(CORS) {
    anyHost()
    allowHeader(HttpHeaders.ContentType)
}