[//]: # (title: OpenAPI)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-openapi"/>
<var name="package_name" value="io.ktor.server.plugins.openapi"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server-openapi/io.ktor.server.plugins.openapi/open-a-p-i.html"/>

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
OpenAPI 플러그인을 사용하면 프로젝트의 OpenAPI 문서를 생성할 수 있습니다.
</link-summary>

Ktor를 사용하면 기존 OpenAPI 명세(specification)를 기반으로 프로젝트의 OpenAPI 문서를 생성하고 제공할 수 있습니다.
기존 YAML 또는 JSON 명세를 제공하거나, Ktor Gradle 플러그인의 [OpenAPI 확장](openapi-spec-generation.md)을 사용하여 생성할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}

* OpenAPI 문서를 제공하려면 빌드 스크립트에 `%artifact_name%` 아티팩트를 추가해야 합니다:

  <Tabs group="languages">
      <TabItem title="Gradle (Kotlin)" group-key="kotlin">
          <code-block lang="Kotlin" code="              implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
      </TabItem>
      <TabItem title="Gradle (Groovy)" group-key="groovy">
          <code-block lang="Groovy" code="              implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
      </TabItem>
      <TabItem title="Maven" group-key="maven">
          <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                  &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
      </TabItem>
  </Tabs>

* 선택적으로, [코드 생성기](https://github.com/swagger-api/swagger-codegen-generators)를 사용자 정의하려면 `swagger-codegen-generators` 의존성을 추가하세요:

  <var name="group_id" value="io.swagger.codegen.v3"/>
  <var name="artifact_name" value="swagger-codegen-generators"/>
  <var name="version" value="swagger_codegen_version"/>
  <Tabs group="languages">
      <TabItem title="Gradle (Kotlin)" group-key="kotlin">
          <code-block lang="Kotlin" code="              implementation(&quot;%group_id%:%artifact_name%:$%version%&quot;)"/>
      </TabItem>
      <TabItem title="Gradle (Groovy)" group-key="groovy">
          <code-block lang="Groovy" code="              implementation &quot;%group_id%:%artifact_name%:$%version%&quot;"/>
      </TabItem>
      <TabItem title="Maven" group-key="maven">
          <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;%group_id%&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%&lt;/artifactId&gt;&#10;                  &lt;version&gt;${%version%}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
      </TabItem>
  </Tabs>

  `$swagger_codegen_version`을 `swagger-codegen-generators` 아티팩트의 필요한 버전(예: `%swagger_codegen_version%`)으로 바꿀 수 있습니다.

## OpenAPI 구성 {id="configure-swagger"}

OpenAPI 문서를 제공하려면, `swaggerFile`에 배치된 OpenAPI 명세에서 렌더링되어 `path`에 문서를 포함하는 `GET` 엔드포인트를 생성하는 [`openAPI`](%plugin_api_link%) 메서드를 호출해야 합니다:

```kotlin
import io.ktor.server.plugins.openapi.*

// ...
routing {
    openAPI(path="openapi", swaggerFile = "openapi/documentation.yaml")
}
```

이 메서드는 애플리케이션 리소스에서 OpenAPI 명세를 찾아봅니다. 그렇지 않으면 `java.io.File`을 사용하여 파일 시스템에서 OpenAPI 명세를 읽으려고 시도합니다.

기본적으로 문서는 `StaticHtml2Codegen`을 사용하여 생성됩니다. `openAPI` 블록 내에서 생성 설정을 사용자 정의할 수 있습니다:

```kotlin
routing {
    openAPI(path="openapi", swaggerFile = "openapi/documentation.yaml") {
        codegen = StaticHtmlCodegen()
    }
}
```

이제 애플리케이션을 [실행](server-run.md)하고 `/openapi` 페이지를 열어 생성된 문서를 볼 수 있습니다.