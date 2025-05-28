[//]: # (title: HttpSend를 사용하여 요청 인터셉트)

<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-http-send"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

[HttpSend](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-http-send/index.html) 플러그인을 사용하면 응답에 따라 HTTP 호출을 모니터링하고 재시도할 수 있습니다. 예를 들어, 서버가 오류 응답(4xx 또는 5xx 상태 코드 포함)을 반환하는 경우 호출 로깅을 구현하거나 요청을 재시도할 수 있습니다.

`HttpSend` 플러그인은 설치가 필요하지 않습니다. 사용하려면 `HttpSend`를 `HttpClient.plugin` 함수에 전달하고 `intercept` 메서드를 호출하십시오. 아래 예시는 응답 상태 코드에 따라 요청을 재시도하는 방법을 보여줍니다:

```kotlin
```
{src="snippets/client-http-send/src/main/kotlin/com/example/Application.kt" include-lines="12-20"}

전체 샘플은 다음에서 찾을 수 있습니다: [client-http-send](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-http-send).