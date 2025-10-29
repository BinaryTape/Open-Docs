[//]: # (title: 상태 페이지)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="StatusPages"/>
<var name="package_name" value="io.ktor.server.plugins.statuspages"/>
<var name="artifact_name" value="ktor-server-status-pages"/>

<tldr>
<p>
<b>필수 종속성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="status-pages"/>
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있게 합니다.">네이티브 서버</Links> 지원</b>: ✅
</p>
</tldr>

<link-summary>
%plugin_name%는 Ktor 애플리케이션이 발생한 예외 또는 상태 코드에 따라 모든 실패 상태에 적절하게 응답하도록 허용합니다.
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-status-pages/io.ktor.server.plugins.statuspages/-status-pages.html) 플러그인은 Ktor 애플리케이션이 발생한 예외 또는 상태 코드에 따라 모든 실패 상태에 적절하게 [응답](server-responses.md)하도록 허용합니다.

## 종속성 추가 {id="add_dependencies"}

<p>
    <code>%plugin_name%</code>를 사용하려면 <code>%artifact_name%</code> 아티팩트를 빌드 스크립트에 포함해야 합니다:
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
    <code>%plugin_name%</code> 플러그인을 애플리케이션에 <a href="#install">설치</a>하려면,
    지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 라우트를 그룹화하여 애플리케이션을 구조화할 수 있습니다.">모듈</Links>의 <code>install</code> 함수에 전달하세요.
    아래 코드 스니펫은 <code>%plugin_name%</code>을 설치하는 방법을 보여줍니다...
</p>
<list>
    <li>
        ... <code>embeddedServer</code> 함수 호출 내부.
    </li>
    <li>
        ... <code>Application</code> 클래스의 확장 함수인 명시적으로 정의된 <code>module</code> 내부.
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

## %plugin_name% 구성 {id="configure"}

<code>%plugin_name%</code> 플러그인에서 제공하는 세 가지 주요 구성 옵션이 있습니다:

- [예외](#exceptions): 매핑된 예외 클래스를 기반으로 응답을 구성합니다.
- [상태](#status): 상태 코드 값에 대한 응답을 구성합니다.
- [상태 파일](#status-file): 클래스패스에서 파일 응답을 구성합니다.

### 예외 {id="exceptions"}

`exception` 핸들러는 `Throwable` 예외가 발생하는 호출을 처리할 수 있도록 합니다. 가장 기본적인 경우, 어떤 예외에 대해서도 `500` HTTP 상태 코드를 구성할 수 있습니다:

```kotlin
install(StatusPages) {
    exception<Throwable> { call, cause ->
        call.respondText(text = "500: $cause" , status = HttpStatusCode.InternalServerError)
    }
}
```

특정 예외를 확인하고 필요한 내용으로 응답할 수도 있습니다:

```kotlin
install(StatusPages) {
    exception<Throwable> { call, cause ->
        if(cause is AuthorizationException) {
            call.respondText(text = "403: $cause" , status = HttpStatusCode.Forbidden)
        } else {
            call.respondText(text = "500: $cause" , status = HttpStatusCode.InternalServerError)
        }
    }
}
```

### 상태 {id="status"}

`status` 핸들러는 상태 코드를 기반으로 특정 내용으로 응답하는 기능을 제공합니다. 아래 예시는 서버에 리소스가 없는 경우(즉, `404` 상태 코드) 요청에 응답하는 방법을 보여줍니다:

```kotlin
install(StatusPages) {
    status(HttpStatusCode.NotFound) { call, status ->
        call.respondText(text = "404: Page Not Found", status = status)
    }
}
```

### 상태 파일 {id="status-file"}

`statusFile` 핸들러는 상태 코드를 기반으로 HTML 페이지를 제공할 수 있도록 합니다. 프로젝트에 `resources` 폴더에 `error401.html` 및 `error402.html` HTML 페이지가 있다고 가정해 봅시다. 이 경우 `statusFile`을 사용하여 `401` 및 `402` 상태 코드를 다음과 같이 처리할 수 있습니다:
```kotlin
install(StatusPages) {
    statusFile(HttpStatusCode.Unauthorized, HttpStatusCode.PaymentRequired, filePattern = "error#.html")
}
```

`statusFile` 핸들러는 구성된 상태 목록 내에서 `#` 문자를 상태 코드 값으로 대체합니다.

> 전체 예시는 여기에서 찾을 수 있습니다: [status-pages](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/status-pages).