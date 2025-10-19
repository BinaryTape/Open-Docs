[//]: # (title: OpenAPI 規範生成)

<show-structure for="chapter" depth="2"/>
<primary-label ref="experimental"/>
<secondary-label ref="server-feature"/>

<tldr>
<p>
<b>程式碼範例</b>: 
<a href="https://github.com/ktorio/ktor-samples/tree/main/openapi">openapi</a>
</p>
</tldr>

Ktor 提供了實驗性支援，可以直接從您的 Kotlin 程式碼生成 OpenAPI 規範。此功能透過 Ktor Gradle 外掛程式提供，並且可以與 [OpenAPI](server-openapi.md) 和 [SwaggerUI](server-swagger-ui.md) 外掛程式結合使用，以提供互動式 API 文件。

> OpenAPI Gradle 擴充功能需要 Kotlin 2.2.20。使用其他版本可能會導致編譯錯誤。
>
{style="note"}

## 新增 Gradle 外掛程式

若要啟用規範生成，請將 Ktor Gradle 外掛程式應用於您的專案：

```kotlin
plugins {
    id("io.ktor.plugin") version "%ktor_version%"
}
```

## 配置擴充功能

若要配置此擴充功能，請在您的 <Path>build.gradle.kts</Path> 檔案中，於 `ktor` 擴充功能內部使用 `openApi` 區塊。您可以提供中繼資料，例如標題、描述、授權條款和聯絡資訊：

```kotlin
ktor {
    @OptIn(OpenApiPreview::class)
    openApi {
        title = "OpenAPI example"
        version = "2.1"
        summary = "This is a sample API"
        description = "This is a longer description"
        termsOfService = "https://example.com/terms/"
        contact = "contact@example.com"
        license = "Apache/1.0"

        // 生成規範的位置（預設為 openapi/generated.json）
        target = project.layout.buildDirectory.file("open-api.json")
    }
}
```

## 路由 API 內省

此外掛程式可以分析您的伺服器路由 DSL，以推斷基本的路徑資訊，例如：

- 合併的路徑 (`/api/v1/users/{id}`)。
- 路徑參數。
- HTTP 方法（例如 `GET` 和 `POST`）。

```kotlin
routing {
    route("/api/v1") {
        get("/users") { }
        get("/users/{id}") { }
        post("/users") { }
    }
}
```

由於請求參數和回應在路由 lambda 中處理，因此此外掛程式無法自動推斷詳細的請求/回應模式。若要生成完整且實用的規範，您可以使用註解。

## 註解路由

為了豐富規範，Ktor 使用類似 KDoc 的註解 API。註解提供無法從程式碼推斷的中繼資料，並與現有路由無縫整合。

```kotlin
/**
 * 取得單一使用者。
 *
 * @path id 使用者的 ID
 * @response 404 未找到使用者
 * @response 200 [User] 使用者。
 */
get("/api/users/{id}") {
    val user = repository.get(call.parameters["id"]!!)
        ?: return@get call.respond(HttpStatusCode.NotFound)
    call.respond(user)
}

```

### 支援的 KDoc 欄位

| Tag             | Format                                          | Description                                     |
|-----------------|-------------------------------------------------|-------------------------------------------------|
| `@tag`          | `@tag *name`                                    | 將端點與標籤關聯以進行分組                      |
| `@path`         | `@path [Type] name description`                 | 描述路徑參數                                    |
| `@query`        | `@query [Type] name description`                | 查詢參數                                        |
| `@header`       | `@header [Type] name description`               | 標頭參數                                        |
| `@cookie`       | `@cookie [Type] name description`               | Cookie 參數                                     |
| `@body`         | `@body contentType [Type] description`          | 請求主體                                        |
| `@response`     | `@response code contentType [Type] description` | 帶有可選類型的回應                              |
| `@deprecated`   | `@deprecated reason`                            | 將端點標記為已棄用                              |
| `@description`  | `@description text`                             | 擴展描述                                        |
| `@security`     | `@security scheme`                              | 安全性要求                                      |
| `@externalDocs` | `@external href`                                | 外部文件連結                                    |

## 生成規範

若要生成 OpenAPI 規範，請執行以下 Gradle 任務：

```shell
./gradlew buildOpenApi
```

此任務會執行 Kotlin 編譯器，帶有一個自訂外掛程式，該外掛程式會分析您的路由程式碼並產生 JSON 規範。

> 某些建構無法在編譯時評估。生成的規範可能不完整。Ktor 未來的版本計劃進行改進。
>
{style="note"}

## 提供規範

若要在執行時使生成的規範可用，您可以使用 [OpenAPI](server-openapi.md) 或 [SwaggerUI](server-swagger-ui.md) 外掛程式。

以下範例在 OpenAPI 端點提供生成的規範檔案：

```kotlin
routing {
    openAPI("/docs", swaggerFile = "openapi/generated.json")
}
```