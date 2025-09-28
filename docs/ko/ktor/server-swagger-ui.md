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
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있게 합니다.">네이티브 서버</Links> 지원</b>: ✖️
</p>
</tldr>

<link-summary>
SwaggerUI 플러그인을 사용하면 프로젝트에 대한 Swagger UI를 생성할 수 있습니다.
</link-summary>

Ktor를 사용하면 기존 OpenAPI 사양을 기반으로 프로젝트에 대한 Swagger UI를 생성하고 제공할 수 있습니다.
Swagger UI를 통해 API 리소스를 시각화하고 상호 작용할 수 있습니다. 기존 YAML 또는 JSON 사양을 제공하거나, Ktor Gradle 플러그인의 [OpenAPI 확장](openapi-spec-generation.md)을 사용하여 생성할 수 있습니다.

## 종속성 추가 {id="add_dependencies"}

Swagger UI를 제공하려면 빌드 스크립트에 `%artifact_name%` 아티팩트를 추가해야 합니다.

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

## Swagger UI 구성 {id="configure-swagger"}

Swagger UI를 제공하려면 `swaggerFile`에 배치된 OpenAPI 사양에서 렌더링된 `path`에 Swagger UI와 함께 `GET` 엔드포인트를 생성하는 [swaggerUI](%plugin_api_link%) 메서드를 호출해야 합니다.

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
routing {
    swaggerUI(path = "swagger", swaggerFile = "openapi/documentation.yaml") {
        version = "4.15.5"
    }
}
```

이제 애플리케이션을 [실행](server-run.md)하고 `/swagger` 페이지를 열어 사용 가능한 엔드포인트를 확인하고 테스트할 수 있습니다.

## CORS 구성 {id="configure-cors"}

API가 Swagger UI와 잘 작동하도록 하려면 [교차 출원 리소스 공유(CORS)](server-cors.md) 정책을 설정해야 합니다.
아래 예시는 다음 CORS 구성을 적용합니다.
- `anyHost`는 모든 호스트의 교차 출원 요청을 활성화합니다.
- `allowHeader`는 [콘텐츠 협상](server-serialization.md)에 사용되는 `Content-Type` 클라이언트 헤더를 허용합니다.

```kotlin
install(CORS) {
    anyHost()
    allowHeader(HttpHeaders.ContentType)
}