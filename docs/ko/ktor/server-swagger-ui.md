[//]: # (title: 스웨거 UI)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-swagger"/>
<var name="package_name" value="io.ktor.server.plugins.swagger"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-swagger/io.ktor.server.plugins.swagger/swagger-u-i.html"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx-openapi"/>

    <p>
        <b>코드 예시</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">네이티브 서버</Links> 지원</b>: ✖️
    </p>
    
</tldr>

<link-summary>
SwaggerUI 플러그인을 통해 프로젝트에 대한 스웨거 UI를 생성할 수 있습니다.
</link-summary>

Ktor를 사용하면 기존 OpenAPI 명세를 기반으로 프로젝트용 스웨거 UI를 생성하고 제공할 수 있습니다. 스웨거 UI를 통해 API 리소스를 시각화하고 상호 작용할 수 있습니다.

> 코드로부터 OpenAPI 정의를 생성하거나 그 반대로도 가능한 다음 도구들을 사용할 수 있습니다:
> - IntelliJ IDEA용 [Ktor 플러그인](https://www.jetbrains.com/help/idea/ktor.html#openapi)은 서버 측 Ktor 애플리케이션을 위한 OpenAPI 문서를 생성하는 기능을 제공합니다.
> - [OpenAPI 생성기](https://github.com/OpenAPITools/openapi-generator)를 사용하면 [kotlin-server](https://github.com/OpenAPITools/openapi-generator/blob/master/docs/generators/kotlin-server.md) 생성기를 이용하여 API 정의로부터 Ktor 프로젝트를 생성할 수 있습니다. 그 외에도 IntelliJ IDEA의 [기능](https://www.jetbrains.com/help/idea/openapi.html#codegen)을 사용할 수 있습니다.
> 
{id="open-api-note"}

## 의존성 추가 {id="add_dependencies"}

스웨거 UI를 제공하려면 빌드 스크립트에 `%artifact_name%` 아티팩트를 추가해야 합니다:

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
    

## 스웨거 UI 구성 {id="configure-swagger"}

스웨거 UI를 제공하려면, `swaggerFile`에 위치한 OpenAPI 명세로부터 렌더링된 `path` 경로에 스웨거 UI를 포함하는 `GET` 엔드포인트를 생성하는 [swaggerUI](%plugin_api_link%) 메서드를 호출해야 합니다:

```kotlin
import io.ktor.server.plugins.swagger.*

// ...
routing {
    swaggerUI(path = "swagger", swaggerFile = "openapi/documentation.yaml")
}
```

이 메서드는 애플리케이션 리소스에서 OpenAPI 명세를 찾으려 시도합니다. 그렇지 않으면 `java.io.File`을 사용하여 파일 시스템에서 OpenAPI 명세를 읽으려 시도합니다.

선택적으로 `swaggerUI` 블록 내에서 스웨거 UI를 사용자 정의할 수 있습니다. 예를 들어, 다른 스웨거 UI 버전을 사용하거나 사용자 지정 스타일을 적용할 수 있습니다.

[object Promise]

이제 애플리케이션을 [실행](server-run.md)하고 `/swagger` 페이지를 열어 사용 가능한 엔드포인트를 확인하고 테스트할 수 있습니다.

## CORS 구성 {id="configure-cors"}

API가 스웨거 UI와 잘 작동하도록 하려면 [교차 출원 리소스 공유 (CORS)](server-cors.md)에 대한 정책을 설정해야 합니다. 아래 예시는 다음 CORS 구성을 적용합니다:
- `anyHost`는 모든 호스트로부터의 교차 출원 요청을 활성화합니다.
- `allowHeader`는 [콘텐츠 협상](server-serialization.md)에 사용되는 `Content-Type` 클라이언트 헤더를 허용합니다.

[object Promise]