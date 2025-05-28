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
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
%plugin_name% 서버 플러그인을 사용하면 고유한 호출 ID를 사용하여 클라이언트 요청을 추적할 수 있습니다.
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-call-id/io.ktor.server.plugins.callid/-call-id.html) 플러그인을 사용하면 고유한 요청 ID 또는 호출 ID를 사용하여 클라이언트 요청을 종단 간 추적할 수 있습니다. 일반적으로 Ktor에서 호출 ID를 사용하는 방법은 다음과 같습니다:
1. 먼저, 다음 방법 중 하나로 특정 요청에 대한 호출 ID를 확보해야 합니다:
   * 리버스 프록시(예: Nginx) 또는 클라우드 공급자(예: [Heroku](heroku.md))가 특정 헤더(예: `X-Request-Id`)에 호출 ID를 추가할 수 있습니다. 이 경우 Ktor는 호출 ID를 [가져올](#retrieve) 수 있도록 합니다.
   * 그렇지 않으면 요청에 호출 ID가 포함되어 있지 않은 경우 Ktor 서버에서 호출 ID를 [생성](#generate)할 수 있습니다.
2. 다음으로 Ktor는 미리 정의된 사전을 사용하여 가져오거나 생성된 호출 ID를 [검증](#verify)합니다. 호출 ID를 검증하기 위해 사용자 고유의 조건을 제공할 수도 있습니다.
3. 마지막으로, 호출 ID를 특정 헤더(예: `X-Request-Id`)에 담아 클라이언트로 [전송](#send)할 수 있습니다.

%plugin_name%을 [CallLogging](server-call-logging.md)과 함께 사용하면 MDC 컨텍스트에 [호출 ID를 추가](#put-call-id-mdc)하고 각 요청에 대한 호출 ID를 표시하도록 로거를 구성하여 호출 문제를 해결하는 데 도움이 됩니다.

> 클라이언트에서는 Ktor가 클라이언트 요청 추적을 위한 [CallId](client-call-id.md) 플러그인을 제공합니다.

## 의존성 추가 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name% 설치 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## %plugin_name% 설정 {id="configure"}

### 호출 ID 가져오기 {id="retrieve"}

%plugin_name%은 호출 ID를 가져오는 여러 가지 방법을 제공합니다:

* 지정된 헤더에서 호출 ID를 가져오려면, `retrieveFromHeader` 함수를 사용합니다. 예시:
   ```kotlin
   install(CallId) {
       retrieveFromHeader(HttpHeaders.XRequestId)
   }
   ```
   `header` 함수를 사용하여 동일한 헤더로 [호출 ID를 가져오고 전송](#send)할 수도 있습니다.

* 필요한 경우, `ApplicationCall`에서 호출 ID를 가져올 수 있습니다:
   ```kotlin
   install(CallId) {
       retrieve { call ->
           call.request.header(HttpHeaders.XRequestId)
       }
   }
   ```
가져온 모든 호출 ID는 기본 사전을 사용하여 [검증](#verify)됩니다.

### 호출 ID 생성 {id="generate"}

수신되는 요청에 호출 ID가 포함되어 있지 않은 경우, `generate` 함수를 사용하여 생성할 수 있습니다:
* 아래 예시는 미리 정의된 사전에서 특정 길이의 호출 ID를 생성하는 방법을 보여줍니다:
   ```kotlin
   install(CallId) {
       generate(10, "abcde12345")
   }
   ```
* 아래 예시에서, `generate` 함수는 호출 ID 생성을 위한 블록을 받습니다:
   ```kotlin
   install(CallId) {
       val counter = atomic(0)
       generate {
           "generated-call-id-${counter.getAndIncrement()}"
       }
   }
   ```

### 호출 ID 검증 {id="verify"}

[가져오거나](#retrieve) [생성된](#generate) 모든 호출 ID는 기본 사전을 사용하여 검증되며, 이 사전은 다음과 같습니다:

```kotlin
CALL_ID_DEFAULT_DICTIONARY: String = "abcdefghijklmnopqrstuvwxyz0123456789+/=-"
```
이는 대문자를 포함하는 호출 ID는 검증을 통과하지 못함을 의미합니다. 필요한 경우, `verify` 함수를 사용하여 덜 엄격한 규칙을 적용할 수 있습니다:

```
```
{src="snippets/call-id/src/main/kotlin/com/example/Application.kt" include-lines="13,15-18"}

전체 예시는 다음에서 찾을 수 있습니다: [call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id).

### 호출 ID를 클라이언트로 전송 {id="send"}

호출 ID를 [가져오거나](#retrieve) [생성한](#generate) 후, 클라이언트로 전송할 수 있습니다:

* `header` 함수는 [호출 ID를 가져오고](#retrieve) 동일한 헤더로 전송하는 데 사용될 수 있습니다:

   ```
   ```
  {src="snippets/call-id/src/main/kotlin/com/example/Application.kt" include-lines="13-14,18"}

  전체 예시는 다음에서 찾을 수 있습니다: [call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id).

* `replyToHeader` 함수는 지정된 헤더에 호출 ID를 전송합니다:
   ```kotlin
   install(CallId) {
       replyToHeader(HttpHeaders.XRequestId)
   }
   ```

* 필요한 경우, `ApplicationCall`을 사용하여 호출 ID를 [응답](server-responses.md)으로 전송할 수 있습니다:
   ```kotlin
   reply { call, callId ->
       call.response.header(HttpHeaders.XRequestId, callId)
   }
   ```

## MDC에 호출 ID 추가 {id="put-call-id-mdc"}

%plugin_name%을 [CallLogging](server-call-logging.md)과 함께 사용하면 MDC 컨텍스트에 호출 ID를 추가하고 각 요청에 대한 호출 ID를 표시하도록 로거를 구성하여 호출 문제를 해결하는 데 도움이 됩니다. 이를 위해 `CallLogging` 설정 블록 내에서 `callIdMdc` 함수를 호출하고 MDC 컨텍스트에 추가할 원하는 키를 지정합니다:

```kotlin
```
{src="snippets/call-id/src/main/kotlin/com/example/Application.kt" include-lines="19-21"}

이 키는 로그에 호출 ID를 표시하도록 [로거 설정](server-logging.md#configure-logger)에 전달될 수 있습니다. 예를 들어, `logback.xml` 파일은 다음과 같을 수 있습니다:
```
```
{style="block" src="snippets/call-id/src/main/resources/logback.xml" include-lines="2-6"}

전체 예시는 다음에서 찾을 수 있습니다: [call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/call-id).