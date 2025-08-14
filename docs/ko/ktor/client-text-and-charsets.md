[//]: # (title: 텍스트 및 문자 집합)

<tip>
    이 도움말 항목은 개발 중이며 향후 업데이트될 예정입니다.
</tip>

<primary-label ref="client-plugin"/>

이 플러그인을 사용하면 요청 및 응답의 일반 텍스트 콘텐츠를 처리할 수 있습니다. 즉, 등록된 문자 집합으로 `Accept` 헤더를 채우고, `ContentType` 문자 집합에 따라 요청 본문을 인코딩하고 응답 본문을 디코딩합니다.

## 구성

구성 또는 HTTP 호출 속성에 아무런 구성도 지정되지 않은 경우, `Charsets.UTF_8`이 기본적으로 사용됩니다.

```kotlin
val client = HttpClient(HttpClientEngine) {
    Charsets {
        // `UTF_8` 사용을 허용합니다.
        register(Charsets.UTF_8)

        // 품질 0.1로 `ISO_8859_1` 사용을 허용합니다.
        register(Charsets.ISO_8859_1, quality=0.1f)
        
        // 요청을 보낼 문자 집합을 지정합니다(요청 헤더에 문자 집합이 없는 경우).
        sendCharset = ...

        // 응답을 받을 문자 집합을 지정합니다(응답 헤더에 문자 집합이 없는 경우).
        responseCharsetFallback = ...
    }
}
```