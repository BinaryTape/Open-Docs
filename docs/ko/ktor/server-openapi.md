[//]: # (title: OpenAPI)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-openapi"/>
<var name="package_name" value="io.ktor.server.plugins.openapi"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-openapi/io.ktor.server.plugins.openapi/open-a-p-i.html"/>

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
        <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있게 합니다.">네이티브 서버</Links> 지원</b>: ✖️
    </p>
    
</tldr>

<link-summary>
OpenAPI 플러그인을 사용하면 프로젝트의 OpenAPI 문서를 생성할 수 있습니다.
</link-summary>

Ktor를 사용하면 기존 OpenAPI 사양을 기반으로 프로젝트의 OpenAPI 문서를 생성하고 제공할 수 있습니다.

undefined

## 의존성 추가 {id="add_dependencies"}

*   OpenAPI 문서를 제공하려면 빌드 스크립트에 `%artifact_name%` 아티팩트를 추가해야 합니다:

  
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
    

*   선택적으로, [코드 생성기](https://github.com/swagger-api/swagger-codegen-generators)를 사용자 지정하려면 `swagger-codegen-generators` 의존성을 추가하세요:

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
    

  `$swagger_codegen_version`를 `swagger-codegen-generators` 아티팩트의 필수 버전으로 대체할 수 있습니다. 예를 들어, `%swagger_codegen_version%`입니다.

## OpenAPI 구성 {id="configure-swagger"}

OpenAPI 문서를 제공하려면 `swaggerFile`에 있는 OpenAPI 사양에서 렌더링된 문서와 함께 `path`에 `GET` 엔드포인트를 생성하는 [openAPI](%plugin_api_link%) 메서드를 호출해야 합니다:

```kotlin
import io.ktor.server.plugins.openapi.*

// ...
routing {
    openAPI(path="openapi", swaggerFile = "openapi/documentation.yaml")
}
```

이 메서드는 애플리케이션 리소스에서 OpenAPI 사양을 찾으려고 시도합니다.
그렇지 않으면 `java.io.File`을 사용하여 파일 시스템에서 OpenAPI 사양을 읽으려고 시도합니다.

기본적으로 문서는 `StaticHtml2Codegen`을 사용하여 생성됩니다.
`openAPI` 블록 내에서 생성 설정을 사용자 지정할 수 있습니다:

[object Promise]

이제 애플리케이션을 [실행](server-run.md)하고 `/openapi` 페이지를 열어 생성된 문서를 확인할 수 있습니다.