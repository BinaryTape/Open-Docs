[//]: # (title: Ktor Client에서 요청 추적하기)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<var name="artifact_name" value="ktor-client-call-id"/>
<var name="package_name" value="io.ktor.client.plugins.callid"/>
<var name="plugin_name" value="CallId"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-call-id"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
%plugin_name% 클라이언트 플러그인을 사용하면 고유한 호출 ID를 통해 클라이언트 요청을 추적할 수 있습니다.
</link-summary>

%plugin_name% 플러그인을 사용하면 고유한 호출 ID를 통해 클라이언트 요청을 종단 간(end-to-end)으로 추적할 수 있습니다. 이는 요청이 거치는 서비스 수에 관계없이 호출을 추적해야 하는 마이크로서비스 아키텍처에서 특히 유용합니다.

호출 스코프는 이미 코루틴 컨텍스트에 호출 ID를 가지고 있을 수 있습니다. 기본적으로 플러그인은 현재 컨텍스트를 사용하여 호출 ID를 검색하고, `HttpHeaders.XRequestId` 헤더를 통해 특정 호출의 컨텍스트에 추가합니다.

또한, 스코프에 호출 ID가 없는 경우, [플러그인을 구성](#configure)하여 새로운 호출 ID를 생성하고 적용할 수 있습니다.

> 서버에서 Ktor는 클라이언트 요청 추적을 위해 [CallId](server-call-id.md) 플러그인을 제공합니다.

## 의존성 추가 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name% 설치 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## %plugin_name% 구성 {id="configure"}

%plugin_name% 플러그인 구성은 [CallIdConfig](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-call-id/io.ktor.client.plugins.callid/-call-id-config/index.html) 클래스에 의해 제공되며, 호출 ID를 생성하고 이를 호출 컨텍스트에 추가할 수 있도록 합니다.

### 호출 ID 생성

특정 요청에 대한 호출 ID는 다음 방법 중 하나로 생성할 수 있습니다:

*   기본적으로 활성화된 `useCoroutineContext` 속성은 현재 `CoroutineContext`를 사용하여 호출 ID를 검색하는 생성기를 추가합니다. 이 기능을 비활성화하려면 `useCoroutineContext`를 `false`로 설정하십시오:

 ```kotlin
 ```

{src="snippets/client-call-id/src/main/kotlin/com/example/Application.kt" include-lines="34-35,37"}

> Ktor 서버에서 [CallId 플러그인](server-call-id.md)을 사용하여 코루틴 컨텍스트에 호출 ID를 추가하세요.

*   `generate()` 함수는 나가는 요청에 대한 호출 ID를 생성할 수 있도록 합니다. 호출 ID 생성에 실패하면 `null`을 반환합니다.

 ```kotlin
 ```

{src="snippets/client-call-id/src/main/kotlin/com/example/Application.kt" include-lines="34,36-37"}

호출 ID를 생성하는 데 여러 메서드를 사용할 수 있습니다. 이 경우, 첫 번째 null이 아닌 값이 적용됩니다.

### 호출 ID 추가

호출 ID를 가져온 후, 요청에 추가할 수 있는 다음과 같은 옵션들이 있습니다:

*   `intercept()` 함수를 사용하면 `CallIdInterceptor`를 통해 요청에 호출 ID를 추가할 수 있습니다.

 ```kotlin
 ```

{src="snippets/client-call-id/src/main/kotlin/com/example/CallIdService.kt" include-lines="23-27"}

*   `addToHeader()` 함수는 지정된 헤더에 호출 ID를 추가합니다. 이 함수는 파라미터로 헤더를 받으며, 기본값은 `HttpHeaders.XRequestId`입니다.

 ```kotlin
 ```

{src="snippets/client-call-id/src/main/kotlin/com/example/Application.kt" include-lines="18,20-21"}

## 예시

다음 예시에서 Ktor 클라이언트의 `%plugin_name%` 플러그인은 새로운 호출 ID를 생성하고 이를 헤더에 추가하도록 구성되어 있습니다:

 ```kotlin
 ```

{src="snippets/client-call-id/src/main/kotlin/com/example/Application.kt" include-lines="17-22"}

플러그인은 코루틴 컨텍스트를 사용하여 호출 ID를 가져오고, `generate()` 함수를 활용하여 새로운 ID를 생성합니다. 그런 다음 첫 번째 null이 아닌 호출 ID가 `addToHeader()` 함수를 사용하여 요청 헤더에 적용됩니다.

Ktor 서버에서는 [서버용 CallId 플러그인](server-call-id.md)의 [retrieve](server-call-id.md#retrieve) 함수를 사용하여 헤더에서 호출 ID를 검색할 수 있습니다.

 ```kotlin
 ```

{src="snippets/client-call-id/src/main/kotlin/com/example/CallIdService.kt" include-lines="29-30,33"}

이런 방식으로 Ktor 서버는 요청의 지정된 헤더에서 ID를 검색하여 호출의 `callId` 속성에 적용합니다.

전체 예시는 다음을 참조하십시오: [client-call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-call-id)