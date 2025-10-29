[//]: # (title: AutoHeadResponse)

<var name="plugin_name" value="AutoHeadResponse"/>
<var name="artifact_name" value="ktor-server-auto-head-response"/>
<primary-label ref="server-plugin"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="autohead"/>
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있습니다.">네이티브 서버</Links> 지원</b>: ✅
</p>
</tldr>

<link-summary>
%plugin_name%은(는) GET이 정의된 모든 라우트에 대해 HEAD 요청에 자동으로 응답하는 기능을 제공합니다.
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server-auto-head-response/io.ktor.server.plugins.autohead/-auto-head-response.html) 플러그인은 `GET`이 정의된 모든 라우트에 대해 `HEAD` 요청에 자동으로 응답하는 기능을 제공합니다. %plugin_name%을(를) 사용하여 실제 콘텐츠를 가져오기 전에 클라이언트에서 응답을 어떤 식으로든 처리해야 하는 경우 별도의 [head](server-routing.md#define_route) 핸들러를 생성하는 것을 피할 수 있습니다. 예를 들어, [respondFile](server-responses.md#file) 함수를 호출하면 `Content-Length` 및 `Content-Type` 헤더가 응답에 자동으로 추가되며, 파일을 다운로드하기 전에 클라이언트에서 이 정보를 얻을 수 있습니다.

## 종속성 추가 {id="add_dependencies"}

<p>
    <code>%plugin_name%</code>을(를) 사용하려면 빌드 스크립트에 <code>%artifact_name%</code> 아티팩트를 포함해야 합니다:
</p>
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

## 사용법
이 기능을 활용하려면 애플리케이션에 `AutoHeadResponse` 플러그인을 설치해야 합니다.

```kotlin
import io.ktor.server.application.*
import io.ktor.server.plugins.autohead.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.main() {
    install(AutoHeadResponse)
    routing {
        get("/home") {
            call.respondText("This is a response to a GET, but HEAD also works")
        }
    }
}
```

이 경우 `/home` 라우트는 이 동사(verb)에 대한 명시적인 정의가 없어도 `HEAD` 요청에 응답할 것입니다.

이 플러그인을 사용하는 경우, 동일한 `GET` 라우트에 대한 사용자 지정 `HEAD` 정의는 무시된다는 점에 유의하는 것이 중요합니다.

## 옵션
`%plugin_name%`은(는) 추가 구성 옵션을 제공하지 않습니다.