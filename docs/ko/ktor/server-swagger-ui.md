[//]: # (title: Swagger UI)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-swagger"/>
<var name="package_name" value="io.ktor.server.plugins.swagger"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-swagger/io.ktor.server.plugins.swagger/swagger-u-i.html"/>

<tldr>
<p>
<b>필수 종속성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx-openapi"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

<link-summary>
Swagger UI 플러그인을 사용하면 프로젝트에 대한 Swagger UI를 생성할 수 있습니다.
</link-summary>

Ktor를 사용하면 기존 OpenAPI 사양을 기반으로 프로젝트에 대한 Swagger UI를 생성하고 제공할 수 있습니다.
Swagger UI를 통해 API 리소스를 시각화하고 상호 작용할 수 있습니다.

> 다음 도구는 코드에서 OpenAPI 정의를 생성하거나 그 반대로 변환하는 데 사용할 수 있습니다:
> - IntelliJ IDEA용 [Ktor 플러그인](https://www.jetbrains.com/help/idea/ktor.html#openapi)은 서버 측 Ktor 애플리케이션에 대한 OpenAPI 문서를 생성하는 기능을 제공합니다.
> - [OpenAPI 제너레이터](https://github.com/OpenAPITools/openapi-generator)를 사용하면 [kotlin-server](https://github.com/OpenAPITools/openapi-generator/blob/master/docs/generators/kotlin-server.md) 제너레이터를 통해 API 정의로부터 Ktor 프로젝트를 생성할 수 있습니다. 또는 IntelliJ IDEA의 [기능](https://www.jetbrains.com/help/idea/openapi.html#codegen)을 사용할 수도 있습니다.
>
{id="open-api-note"}

## 종속성 추가 {id="add_dependencies"}

Swagger UI를 제공하려면 빌드 스크립트에 `%artifact_name%` 아티팩트를 추가해야 합니다:

<include from="lib.topic" element-id="add_ktor_artifact"/>

## Swagger UI 구성 {id="configure-swagger"}

Swagger UI를 제공하려면 `path`에 Swagger UI와 함께 `GET` 엔드포인트를 생성하고 `swaggerFile`에 있는 OpenAPI 사양에서 렌더링되는 [swaggerUI](%plugin_api_link%) 메서드를 호출해야 합니다:

```kotlin
import io.ktor.server.plugins.swagger.*

// ...
routing {
    swaggerUI(path = "swagger", swaggerFile = "openapi/documentation.yaml")
}
```

이 메서드는 애플리케이션 리소스에서 OpenAPI 사양을 찾으려고 시도합니다.
그렇지 않으면 `java.io.File`을 사용하여 파일 시스템에서 OpenAPI 사양을 읽으려고 시도합니다.

선택적으로 `swaggerUI` 블록 내에서 Swagger UI를 사용자 지정할 수 있습니다.
예를 들어, 다른 Swagger UI 버전을 사용하거나 사용자 지정 스타일을 적용할 수 있습니다.

```kotlin
```
{src="snippets/json-kotlinx-openapi/src/main/kotlin/com/example/Application.kt" include-lines="39,52-54,58"}

이제 애플리케이션을 [실행](server-run.md)하고 `/swagger` 페이지를 열어 사용 가능한 엔드포인트를 확인하고 테스트할 수 있습니다.

## CORS 구성 {id="configure-cors"}

API가 Swagger UI와 잘 작동하도록 하려면 [교차 출처 리소스 공유 (CORS)](server-cors.md)에 대한 정책을 설정해야 합니다.
아래 예시는 다음 CORS 구성을 적용합니다:
- `anyHost`는 모든 호스트의 교차 출처 요청을 허용합니다;
- `allowHeader`는 [콘텐츠 협상](server-serialization.md)에 사용되는 `Content-Type` 클라이언트 헤더를 허용합니다.

```kotlin
```
{src="snippets/json-kotlinx-openapi/src/main/kotlin/com/example/Application.kt" include-lines="35-38"}