[//]: # (title: Ktor 서버에서 요청 추적하기)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-call-id"/>
<var name="package_name" value="io.ktor.server.plugins.callid"/>
<var name="plugin_name" value="CallId"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="call-id"/>
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
%plugin_name% 서버 플러그인을 사용하면 고유한 호출 ID를 사용하여 클라이언트 요청을 추적할 수 있습니다.
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-call-id/io.ktor.server.plugins.callid/-call-id.html) 플러그인을 사용하면 고유한 요청 ID 또는 호출 ID를 사용하여 클라이언트 요청을 처음부터 끝까지 추적할 수 있습니다. 일반적으로 Ktor에서 호출 ID를 사용하는 방법은 다음과 같습니다:
1.  첫째, 다음 방법 중 하나로 특정 요청에 대한 호출 ID를 얻어야 합니다:
    *   역방향 프록시(예: Nginx) 또는 클라우드 제공업체(예: [Heroku](heroku.md))가 `X-Request-Id`와 같은 특정 헤더에 호출 ID를 추가할 수 있습니다. 이 경우 Ktor는 호출 ID를 [검색](#retrieve)할 수 있도록 합니다.
    *   그렇지 않고 요청에 호출 ID가 포함되어 있지 않으면 Ktor 서버에서 호출 ID를 [생성](#generate)할 수 있습니다.
2.  다음으로, Ktor는 미리 정의된 사전을 사용하여 검색/생성된 호출 ID를 [확인](#verify)합니다. 호출 ID를 확인하기 위해 사용자 지정 조건을 제공할 수도 있습니다.
3.  마지막으로, `X-Request-Id`와 같은 특정 헤더에 호출 ID를 클라이언트에 [전송](#send)할 수 있습니다.

[CallLogging](server-call-logging.md)과 함께 `%plugin_name%`을 사용하면 MDC 컨텍스트에 [호출 ID를 추가하고](#put-call-id-mdc) 각 요청에 대한 호출 ID를 표시하도록 로거를 구성하여 호출 문제를 해결하는 데 도움이 됩니다.

> 클라이언트 측에서 Ktor는 클라이언트 요청 추적을 위해 [CallId](client-call-id.md) 플러그인을 제공합니다.

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

## %plugin_name% 설치 {id="install_plugin"}

<p>
    애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면 지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구성할 수 있습니다.">모듈</Links>의 <code>install</code> 함수에 전달하세요.
    아래 코드 스니펫은 <code>%plugin_name%</code>을(를) 설치하는 방법을 보여줍니다...
</p>
<list>
    <li>
        ... <code>embeddedServer</code> 함수 호출 내.
    </li>
    <li>
        ... 명시적으로 정의된 <code>module</code> 내. <code>module</code>은 <code>Application</code> 클래스의 확장 함수입니다.
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

### 호출 ID 검색 {id="retrieve"}

`%plugin_name%`은(는) 호출 ID를 검색하는 여러 가지 방법을 제공합니다:

*   지정된 헤더에서 호출 ID를 검색하려면 `retrieveFromHeader` 함수를 사용합니다. 예를 들어 다음과 같습니다:
   ```kotlin
   install(CallId) {
       retrieveFromHeader(HttpHeaders.XRequestId)
   }
   ```
   `header` 함수를 사용하여 동일한 헤더에서 호출 ID를 [검색하고 전송](#send)할 수도 있습니다.

*   필요한 경우 `ApplicationCall`에서 호출 ID를 검색할 수 있습니다:
   ```kotlin
   install(CallId) {
       retrieve { call ->
           call.request.header(HttpHeaders.XRequestId)
       }
   }
   ```
참고로 검색된 모든 호출 ID는 기본 사전을 사용하여 [확인](#verify)됩니다.

### 호출 ID 생성 {id="generate"}

수신 요청에 호출 ID가 포함되어 있지 않으면 `generate` 함수를 사용하여 생성할 수 있습니다:
*   아래 예시는 미리 정의된 사전에서 특정 길이의 호출 ID를 생성하는 방법을 보여줍니다:
   ```kotlin
   install(CallId) {
       generate(10, "abcde12345")
   }
   ```
*   아래 예시에서 `generate` 함수는 호출 ID를 생성하기 위한 블록을 받습니다:
   ```kotlin
   install(CallId) {
       val counter = atomic(0)
       generate {
           "generated-call-id-${counter.getAndIncrement()}"
       }
   }
   ```

### 호출 ID 확인 {id="verify"}

모든 [검색](#retrieve)/[생성](#generate)된 호출 ID는 다음과 같은 기본 사전을 사용하여 확인됩니다:

```kotlin
CALL_ID_DEFAULT_DICTIONARY: String = "abcdefghijklmnopqrstuvwxyz0123456789+/=-"
```
이는 대문자를 포함하는 호출 ID는 확인을 통과하지 못함을 의미합니다. 필요한 경우 `verify` 함수를 사용하여 덜 엄격한 규칙을 적용할 수 있습니다:

```kotlin
install(CallId) {
    verify { callId: String ->
        callId.isNotEmpty()
    }
}
```

전체 예시는 여기에서 찾을 수 있습니다: [call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id).

### 호출 ID를 클라이언트에 전송 {id="send"}

호출 ID를 [검색](#retrieve)/[생성](#generate)한 후 클라이언트에 전송할 수 있습니다:

*   `header` 함수를 사용하여 호출 ID를 [검색](#retrieve)하고 동일한 헤더에 전송할 수 있습니다:

   ```kotlin
   install(CallId) {
       header(HttpHeaders.XRequestId)
   }
   ```

  전체 예시는 여기에서 찾을 수 있습니다: [call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id).

*   `replyToHeader` 함수는 지정된 헤더에 호출 ID를 전송합니다:
   ```kotlin
   install(CallId) {
       replyToHeader(HttpHeaders.XRequestId)
   }
   ```

*   필요한 경우 `ApplicationCall`을 사용하여 [응답](server-responses.md)에 호출 ID를 전송할 수 있습니다:
   ```kotlin
   reply { call, callId ->
       call.response.header(HttpHeaders.XRequestId, callId)
   }
   ```

## MDC에 호출 ID 추가 {id="put-call-id-mdc"}

[CallLogging](server-call-logging.md)과 함께 `%plugin_name%`을(를) 사용하면 MDC 컨텍스트에 호출 ID를 추가하고 각 요청에 대한 호출 ID를 표시하도록 로거를 구성하여 호출 문제를 해결하는 데 도움이 됩니다. 이를 위해 `CallLogging` 구성 블록 내에서 `callIdMdc` 함수를 호출하고 MDC 컨텍스트에 추가할 원하는 키를 지정합니다:

```kotlin
install(CallLogging) {
    callIdMdc("call-id")
}
```

이 키는 로그에 호출 ID를 표시하도록 [로거 구성](server-logging.md#configure-logger)에 전달될 수 있습니다. 예를 들어, `logback.xml` 파일은 다음과 같을 수 있습니다:
```
<appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
    <encoder>
        <pattern>%d{YYYY-MM-dd HH:mm:ss.SSS} [%thread] %X{call-id} %-5level %logger{36} - %msg%n</pattern>
    </encoder>
</appender>
```

전체 예시는 여기에서 찾을 수 있습니다: [call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id).