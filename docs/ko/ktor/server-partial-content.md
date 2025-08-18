[//]: # (title: 부분 콘텐츠)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-partial-content"/>
<var name="package_name" value="io.ktor.server.plugins.partialcontent"/>
<var name="plugin_name" value="PartialContent"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p>
<b>서버 예제</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/download-file">download-file</a>,
<b>클라이언트 예제</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-file-range">client-download-file-range</a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구조화할 수 있습니다.">Native 서버</Links> 지원</b>: ✅
</p>
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-partial-content/io.ktor.server.plugins.partialcontent/-partial-content.html) 플러그인은 클라이언트에 HTTP 메시지의 일부만 다시 보내는 데 사용되는 [HTTP 범위 요청](https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests) 처리를 지원합니다. 이 플러그인은 콘텐츠 스트리밍 또는 부분 다운로드 재개에 유용합니다.

`%plugin_name%`에는 다음과 같은 제한 사항이 있습니다:
- `HEAD` 및 `GET` 요청에서만 작동하며, 클라이언트가 다른 메서드와 함께 `Range` 헤더를 사용하려고 하면 `405 Method Not Allowed`를 반환합니다.
- `Content-Length` 헤더가 정의된 응답에서만 작동합니다.
- 범위를 서비스할 때 [Compression](server-compression.md)을 비활성화합니다.

## 의존성 추가 {id="add_dependencies"}

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

## %plugin_name% 설치 {id="install_plugin"}

<p>
    애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면, 지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구조화할 수 있습니다.">모듈</Links>의 <code>install</code> 함수에 전달하면 됩니다. 아래 코드 스니펫은 <code>%plugin_name%</code>을(를) 설치하는 방법을 보여줍니다...
</p>
<list>
    <li>
        ... <code>embeddedServer</code> 함수 호출 내에서.
    </li>
    <li>
        ... 명시적으로 정의된 <code>module</code> 내에서 (이는 <code>Application</code> 클래스의 확장 함수입니다).
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>
<p>
    <code>%plugin_name%</code> 플러그인은 <a href="#install-route">특정 경로에</a> 설치할 수도 있습니다. 이는 다른 애플리케이션 리소스에 대해 다른 <code>%plugin_name%</code> 구성이 필요한 경우 유용할 수 있습니다.
</p>

`%plugin_name%`을(를) 사용하여 HTTP 범위 요청으로 파일을 서비스하는 방법을 알아보려면 [File](server-responses.md#file) 섹션을 참조하십시오.