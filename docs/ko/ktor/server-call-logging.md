[//]: # (title: 호출 로깅)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="CallLogging"/>
<var name="package_name" value="io.ktor.server.plugins.calllogging"/>
<var name="artifact_name" value="ktor-server-call-logging"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="logging"/>
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

Ktor는 [SLF4J](http://www.slf4j.org/) 라이브러리를 사용하여 애플리케이션 이벤트를 로깅하는 기능을 제공합니다. 일반적인 로깅 설정에 대한 자세한 내용은 [Ktor 서버의 로깅](server-logging.md) 토픽에서 확인할 수 있습니다.

`%plugin_name%` 플러그인을 사용하면 들어오는 클라이언트 요청을 로깅할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}

<p>
    <code>%plugin_name%</code>을(를) 사용하려면 빌드 스크립트에 <code>%artifact_name%</code> 아티팩트를 포함해야 합니다.
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
    애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면, 지정된 <Links href="/ktor/server-modules" summary="Modules allow you to structure your application by grouping routes.">모듈</Links>의 <code>install</code> 함수에 전달하세요.
    아래 코드 스니펫은 <code>%plugin_name%</code>을(를) 설치하는 방법을 보여줍니다...
</p>
<list>
    <li>
        ... <code>embeddedServer</code> 함수 호출 내에서.
    </li>
    <li>
        ... <code>Application</code> 클래스의 확장 함수인 명시적으로 정의된 <code>module</code> 내에서.
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10            }"/>
    </TabItem>
</Tabs>

## 로깅 설정 구성 {id="configure"}

`%plugin_name%`은(는) 다양한 방법으로 구성할 수 있습니다. 로깅 레벨 지정, 특정 조건에 따른 요청 필터링, 로그 메시지 사용자 지정 등이 가능합니다. 사용 가능한 구성 설정은 [CallLoggingConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-call-logging/io.ktor.server.plugins.calllogging/-call-logging-config/index.html)에서 확인할 수 있습니다.

### 로깅 레벨 설정 {id="logging_level"}

기본적으로 Ktor는 `Level.INFO` 로깅 레벨을 사용합니다. 이를 변경하려면 `level` 속성을 사용하세요.

```kotlin
install(CallLogging) {
    level = Level.INFO
}
```

### 로그 요청 필터링 {id="filter"}

`filter` 속성을 사용하면 요청 필터링을 위한 조건을 추가할 수 있습니다. 아래 예시에서는 `/api/v1`로 전송된 요청만 로그에 기록됩니다.

```kotlin
install(CallLogging) {
    filter { call ->
        call.request.path().startsWith("/api/v1")
    }
}
```

### 로그 메시지 형식 사용자 지정 {id="format"}

`format` 함수를 사용하여 요청/응답과 관련된 모든 데이터를 로그에 기록할 수 있습니다. 아래 예시는 각 요청에 대한 응답 상태, 요청 HTTP 메서드 및 `User-Agent` 헤더 값을 로깅하는 방법을 보여줍니다.

```kotlin
install(CallLogging) {
    format { call ->
        val status = call.response.status()
        val httpMethod = call.request.httpMethod.value
        val userAgent = call.request.headers["User-Agent"]
        "Status: $status, HTTP method: $httpMethod, User agent: $userAgent"
    }
}
```

전체 예시는 다음에서 확인할 수 있습니다: [logging](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/logging).

### 호출 파라미터를 MDC에 추가 {id="mdc"}

`%plugin_name%` 플러그인은 MDC(Mapped Diagnostic Context)를 지원합니다. `mdc` 함수를 사용하여 지정된 이름으로 원하는 컨텍스트 값을 MDC에 추가할 수 있습니다. 예를 들어, 아래 코드 스니펫에서는 `name` 쿼리 파라미터가 MDC에 추가됩니다.

```kotlin
install(CallLogging) {
    mdc("name-parameter") { call ->
        call.request.queryParameters["name"]
    }
}
```

`ApplicationCall` 수명 주기 동안 추가된 값에 접근할 수 있습니다.

```kotlin
import org.slf4j.MDC
// ...
MDC.get("name-parameter")
```