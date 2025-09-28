[//]: # (title: OpenAPI 사양 생성)

<show-structure for="chapter" depth="2"/>
<primary-label ref="experimental"/>
<secondary-label ref="server-feature"/>

<tldr>
<p>
<b>코드 예시</b>: 
<a href="https://github.com/ktorio/ktor-samples/tree/main/openapi">openapi</a>
</p>
</tldr>

Ktor는 Kotlin 코드에서 직접 OpenAPI 사양을 생성하는 실험적 지원을 제공합니다. 이 기능은 Ktor Gradle 플러그인을 통해 사용할 수 있으며, [OpenAPI](server-openapi.md) 및 [SwaggerUI](server-swagger-ui.md) 플러그인과 결합하여 대화형 API 문서를 제공할 수 있습니다.

> OpenAPI Gradle 확장 기능은 Kotlin 2.2.20을 필요로 합니다. 다른 버전을 사용하면 컴파일 오류가 발생할 수 있습니다.
>
{style="note"}

## Gradle 플러그인 추가

사양 생성을 활성화하려면 Ktor Gradle 플러그인을 프로젝트에 적용하세요:

```kotlin
plugins {
    id("io.ktor.plugin") version "%ktor_version%"
}
```

## 확장 기능 구성

확장 기능을 구성하려면 `<Path>build.gradle.kts</Path>` 파일의 `ktor` 확장 기능 내에 있는 `openApi` 블록을 사용하세요. 제목, 설명, 라이선스, 연락처 정보와 같은 메타데이터를 제공할 수 있습니다:

```kotlin
ktor {
    @OptIn(OpenApiPreview::class)
    openApi {
        title = "OpenAPI 예시"
        version = "2.1"
        summary = "이것은 샘플 API입니다"
        description = "이것은 더 긴 설명입니다"
        termsOfService = "https://example.com/terms/"
        contact = "contact@example.com"
        license = "Apache/1.0"

        // Location of the generated specification (defaults to openapi/generated.json)
        target = project.layout.buildDirectory.file("open-api.json")
    }
}
```

## 라우팅 API 인트로스펙션

플러그인은 서버 라우팅 DSL을 분석하여 다음과 같은 기본적인 경로 정보를 추론할 수 있습니다:

- 병합된 경로 (`/api/v1/users/{id}`).
- 경로 파라미터.
- HTTP 메서드 (예: `GET` 및 `POST`).

```kotlin
routing {
    route("/api/v1") {
        get("/users") { }
        get("/users/{id}") { }
        post("/users") { }
    }
}
```

요청 파라미터와 응답이 라우트 람다 내부에서 처리되기 때문에, 플러그인은 상세한 요청/응답 스키마를 자동으로 추론할 수 없습니다. 완전하고 유용한 사양을 생성하려면 애너테이션을 사용할 수 있습니다.

## 라우트에 애너테이션 추가

사양을 풍부하게 하려면 Ktor는 KDoc과 유사한 애너테이션 API를 사용합니다. 애너테이션은 코드에서 추론할 수 없는 메타데이터를 제공하며, 기존 라우트와 매끄럽게 통합됩니다.

```kotlin
/**
 * 단일 사용자 가져오기.
 *
 * @path id 사용자 ID
 * @response 404 사용자를 찾을 수 없음
 * @response 200 [User] 사용자.
 */
get("/api/users/{id}") {
    val user = repository.get(call.parameters["id"]!!)
        ?: return@get call.respond(HttpStatusCode.NotFound)
    call.respond(user)
}

```

### 지원되는 KDoc 필드

| 태그             | 형식                                            | 설명                                     |
|-----------------|-------------------------------------------------|-------------------------------------------------|
| `@tags`         | `@tags *name`                                   | 엔드포인트를 그룹화를 위한 태그와 연결합니다    |
| `@path`         | `@path [Type] name description`                 | 경로 파라미터를 설명합니다                      |
| `@query`        | `@query [Type] name description`                | 쿼리 파라미터                                   |
| `@header`       | `@header [Type] name description`               | 헤더 파라미터                                   |
| `@cookie`       | `@cookie [Type] name description`               | 쿠키 파라미터                                   |
| `@body`         | `@body contentType [Type] description`          | 요청 본문                                       |
| `@response`     | `@response code contentType [Type] description` | 선택적 타입이 있는 응답                         |
| `@deprecated`   | `@deprecated reason`                            | 엔드포인트가 사용 중단되었음을 표시합니다     |
| `@description`  | `@description text`                             | 확장된 설명                                     |
| `@security`     | `@security scheme`                              | 보안 요구 사항                                  |
| `@externalDocs` | `@external href`                                | 외부 문서 링크                                  |

## 사양 생성

OpenAPI 사양을 생성하려면 다음 Gradle 태스크를 실행하세요:

```shell
./gradlew buildOpenApi
```

이 태스크는 라우팅 코드를 분석하고 JSON 사양을 생성하는 사용자 지정 플러그인과 함께 Kotlin 컴파일러를 실행합니다.

> 일부 구문은 컴파일 시점에 평가될 수 없습니다. 생성된 사양이 불완전할 수 있습니다. 향후 Ktor 릴리스에서 개선될 예정입니다.
>
{style="note"}

## 사양 제공

생성된 사양을 런타임에 사용할 수 있도록 하려면 [OpenAPI](server-openapi.md) 또는 [SwaggerUI](server-swagger-ui.md) 플러그인을 사용할 수 있습니다.

다음 예시는 OpenAPI 엔드포인트에서 생성된 사양 파일을 제공합니다:

```kotlin
routing {
    openAPI("/docs", swaggerFile = "openapi/generated.json")
}