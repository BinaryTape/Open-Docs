[//]: # (title: 텍스트 및 문자 세트)

<tip>
    이 도움말 항목은 개발 중이며 향후 업데이트될 예정입니다.
</tip>
<primary-label ref="client-plugin"/>

이 플러그인은 요청 및 응답의 일반 텍스트 콘텐츠를 처리할 수 있도록 해줍니다. 즉, 등록된 문자 세트로 `Accept` 헤더를 채우고, `ContentType` 문자 세트에 따라 요청 본문을 인코딩하고 응답 본문을 디코딩합니다.

## 구성

구성 또는 HTTP 호출 속성에서 구성이 지정되지 않은 경우, `Charsets.UTF_8`이 기본적으로 사용됩니다.

```kotlin
val client = HttpClient(HttpClientEngine) {
    Charsets {
        // Allow using `UTF_8`.
        register(Charsets.UTF_8)

        // Allow using `ISO_8859_1` with quality 0.1.
        register(Charsets.ISO_8859_1, quality=0.1f)
        
        // Specify Charset to send request(if no charset in request headers).
        sendCharset = ...

        // Specify Charset to receive response(if no charset in response headers).
        responseCharsetFallback = ...
    }
}
```