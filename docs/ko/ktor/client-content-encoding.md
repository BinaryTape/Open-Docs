[//]: # (title: 콘텐츠 인코딩)

<primary-label ref="client-plugin"/>

<var name="artifact_name" value="ktor-client-encoding"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-content-encoding"/>
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
ContentEncoding 플러그인을 사용하면 지정된 압축 알고리즘('gzip', 'deflate' 등)을 활성화하고 해당 설정을 구성할 수 있습니다.
</link-summary>

Ktor 클라이언트는 [ContentEncoding](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-encoding/io.ktor.client.plugins.compression/-content-encoding) 플러그인을 제공하여 지정된 압축 알고리즘(`gzip`, `deflate` 등)을 활성화하고 해당 설정을 구성할 수 있도록 합니다. 이 플러그인의 주요 목적은 다음과 같습니다:
* 지정된 품질 값으로 `Accept-Encoding` 헤더를 설정합니다.
* 선택적으로 요청 본문을 인코딩합니다.
* [서버로부터 수신된 콘텐츠](client-responses.md#body)를 디코딩하여 원본 페이로드를 얻습니다.

## 의존성 추가 {id="add_dependencies"}
`ContentEncoding`을 사용하려면 빌드 스크립트에 `%artifact_name%` 아티팩트를 포함해야 합니다:

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
<p>
    Ktor 클라이언트에 필요한 아티팩트에 대한 자세한 내용은 <Links href="/ktor/client-dependencies" summary="기존 프로젝트에 클라이언트 의존성을 추가하는 방법을 알아보세요.">클라이언트 의존성 추가</Links>에서 확인할 수 있습니다.
</p>

## ContentEncoding 설치 {id="install_plugin"}
`ContentEncoding`을 설치하려면 [클라이언트 설정 블록](client-create-and-configure.md#configure-client) 내부의 `install` 함수에 전달하세요.
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.compression.*
//...
val client = HttpClient(CIO) {
    install(ContentEncoding)
}
```

## ContentEncoding 구성 {id="configure_plugin"}
아래 [예시](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-content-encoding)는 지정된 품질 값으로 클라이언트에서 `deflate` 및 `gzip` 인코더를 활성화하는 방법을 보여줍니다:

```kotlin
val client = HttpClient(CIO) {
    install(ContentEncoding) {
        deflate(1.0F)
        gzip(0.9F)
    }
}
```

필요한 경우 `ContentEncoder` 인터페이스를 구현하여 사용자 지정 인코더를 생성하고 `customEncoder` 함수에 전달할 수 있습니다.

## 요청 본문 인코딩 {id="encode_request_body"}
요청 본문을 인코딩하려면 [HttpRequestBuilder](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html) 블록 내에서 `compress()` 함수를 사용하세요.
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.compression.*
//...
val client = HttpClient(CIO) {
    install(ContentEncoding)
}
client.post("/upload") {
    compress("gzip")
    setBody(someLongBody)
}