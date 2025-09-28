[//]: # (title: OpenAPI 规范生成)

<show-structure for="chapter" depth="2"/>
<primary-label ref="experimental"/>
<secondary-label ref="server-feature"/>

<tldr>
<p>
<b>代码示例</b>:
<a href="https://github.com/ktorio/ktor-samples/tree/main/openapi">openapi</a>
</p>
</tldr>

Ktor 提供实验性的支持，可以直接从你的 Kotlin 代码生成 OpenAPI 规范。此功能通过 Ktor Gradle 插件提供，并且可以与 [OpenAPI](server-openapi.md) 和 [SwaggerUI](server-swagger-ui.md) 插件结合使用，以提供交互式 API 文档。

> OpenAPI Gradle 扩展需要 Kotlin 2.2.20。使用其他版本可能会导致编译错误。
> {style="note"}

## 添加 Gradle 插件

要启用规范生成，请将 Ktor Gradle 插件应用到你的项目：

```kotlin
plugins {
    id("io.ktor.plugin") version "%ktor_version%"
}
```

## 配置扩展

要配置此扩展，请在你的 <Path>build.gradle.kts</Path> 文件中的 `ktor` 扩展里使用 `openApi` 代码块。你可以提供元数据，例如标题、描述、许可证和联系信息：

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

        // Location of the generated specification (defaults to openapi/generated.json)
        target = project.layout.buildDirectory.file("open-api.json")
    }
}
```

## 路由 API 内省

该插件可以分析你的服务器路由 DSL，以推断基本的路径信息，例如：

- 合并后的路径 (`/api/v1/users/{id}`)。
- 路径参数。
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

因为请求参数和响应是在路由 lambda 表达式内部处理的，所以该插件无法自动推断详细的请求/响应 schema。为了生成完整且有用的规范，你可以使用注解。

## 标注路由

为了丰富规范，Ktor 使用类似 KDoc 的注解 API。注解提供了无法从代码中推断的元数据，并与现有路由无缝集成。

```kotlin
/**
 * Get a single user.
 *
 * @path id The ID of the user
 * @response 404 The user was not found
 * @response 200 [User] The user.
 */
get("/api/users/{id}") {
    val user = repository.get(call.parameters["id"]!!)
        ?: return@get call.respond(HttpStatusCode.NotFound)
    call.respond(user)
}

```

### 支持的 KDoc 字段

| 标签 | 格式 | 描述 |
|---|---|---|
| `@tags` | `@tags *name` | 将端点与标签关联以进行分组 |
| `@path` | `@path [Type] name description` | 描述路径参数 |
| `@query` | `@query [Type] name description` | 查询参数 |
| `@header` | `@header [Type] name description` | 请求头参数 |
| `@cookie` | `@cookie [Type] name description` | Cookie 参数 |
| `@body` | `@body contentType [Type] description` | 请求体 |
| `@response` | `@response code contentType [Type] description` | 带有可选类型的响应 |
| `@deprecated` | `@deprecated reason` | 将端点标记为已废弃 |
| `@description` | `@description text` | 扩展描述 |
| `@security` | `@security scheme` | 安全要求 |
| `@externalDocs` | `@external href` | 外部文档链接 |

## 生成规范

要生成 OpenAPI 规范，请运行以下 Gradle 任务：

```shell
./gradlew buildOpenApi
```

此任务运行 Kotlin 编译器，并带有一个自定义插件，该插件会分析你的路由代码并生成一个 JSON 规范。

> 一些构造无法在编译期求值。生成的规范可能不完整。改进计划在未来的 Ktor 版本中实施。
> {style="note"}

## 提供规范

为了让生成的规范在运行时可用，你可以使用 [OpenAPI](server-openapi.md) 或 [SwaggerUI](server-swagger-ui.md) 插件。

以下示例在一个 OpenAPI 端点提供生成的规范文件：

```kotlin
routing {
    openAPI("/docs", swaggerFile = "openapi/generated.json")
}