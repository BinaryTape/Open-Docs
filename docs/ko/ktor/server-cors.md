[//]: # (title: CORS)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-cors"/>
<var name="package_name" value="io.ktor.server.plugins.cors"/>
<var name="plugin_name" value="CORS"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="cors"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

서버가 [교차 출처 요청](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)을 처리하도록 되어 있다면,
[CORS](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors.routing/-c-o-r-s.html)
Ktor 플러그인을 설치하고 구성해야 합니다. 이 플러그인을 사용하면 허용된 호스트, HTTP 메서드, 클라이언트가 설정한 헤더 등을 구성할 수 있습니다.

## 의존성 추가 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name% 설치 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

> 특정 라우트에 `CORS` 플러그인을 설치하는 경우,
해당 라우트에 `options` [핸들러](server-routing.md#define_route)를 추가해야 합니다. 이를 통해 Ktor는 CORS 프리플라이트 요청에 올바르게 응답할 수 있습니다.

## CORS 구성 {id="configure"}

CORS 관련 구성 설정은
[CORSConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/index.html)
클래스에 의해 노출됩니다. 이러한 설정을 구성하는 방법을 알아보겠습니다.

### 개요 {id="overview"}

`8080` 포트에서 수신 대기하는 서버가 있고, `/customer` [라우트](server-routing.md)가 [JSON](server-serialization.md#send_data) 데이터를 응답한다고 가정해 봅시다. 아래 코드 스니펫은 다른 포트에서 작동하는 클라이언트가 Fetch API를 사용하여 이 요청을 교차 출처로 만들기 위한 샘플 요청을 보여줍니다.

```javascript
```

{src="snippets/cors/files/js/script.js" initial-collapse-state="collapsed" collapsed-title="
fetch('http://0.0.0.0:8080/customer')"}

백엔드에서 이러한 요청을 허용하려면 `CORS` 플러그인을 다음과 같이 구성해야 합니다.

```kotlin
```

{src="snippets/cors/src/main/kotlin/com/example/Application.kt" include-lines="47-50"}

전체 예제는 다음에서 찾을 수 있습니다: [cors](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/cors).

### 호스트 {id="hosts"}

교차 출처 요청을 할 수 있는 허용된 호스트를 지정하려면 `allowHost` 함수를 사용합니다. 호스트명 외에도 포트 번호, 서브도메인 목록 또는 지원되는 HTTP 스키마를 지정할 수 있습니다.

```kotlin
install(CORS) {
    allowHost("client-host")
    allowHost("client-host:8081")
    allowHost("client-host", subDomains = listOf("en", "de", "es"))
    allowHost("client-host", schemes = listOf("http", "https"))
}
```

모든 호스트로부터의 교차 출처 요청을 허용하려면 `anyHost` 함수를 사용합니다.

```kotlin
install(CORS) {
    anyHost()
}
```

### HTTP 메서드 {id="methods"}

기본적으로 `%plugin_name%` 플러그인은 `GET`, `POST`, `HEAD` HTTP 메서드를 허용합니다. 추가 메서드를 추가하려면 `allowMethod` 함수를 사용합니다.

```kotlin
install(CORS) {
    allowMethod(HttpMethod.Options)
    allowMethod(HttpMethod.Put)
    allowMethod(HttpMethod.Patch)
    allowMethod(HttpMethod.Delete)
}
```

### 헤더 허용 {id="headers"}

기본적으로 `%plugin_name%` 플러그인은 `Access-Control-Allow-Headers`에 의해 관리되는 다음 클라이언트 헤더를 허용합니다.

* `Accept`
* `Accept-Language`
* `Content-Language`

추가 헤더를 허용하려면 `allowHeader` 함수를 사용합니다.

```kotlin
install(CORS) {
    allowHeader(HttpHeaders.ContentType)
    allowHeader(HttpHeaders.Authorization)
}
```

사용자 정의 헤더를 허용하려면 `allowHeaders` 또는 `allowHeadersPrefixed` 함수를 사용합니다. 예를 들어, 아래 코드 스니펫은 `custom-`으로 시작하는 헤더를 허용하는 방법을 보여줍니다.

```kotlin
install(CORS) {
    allowHeadersPrefixed("custom-")
}
```

> `allowHeaders` 또는 `allowHeadersPrefixed`는 비간단(non-simple) 콘텐츠 타입의 경우 [allowNonSimpleContentTypes](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/allow-non-simple-content-types.html) 속성을 `true`로 설정해야 합니다.

### 헤더 노출 {id="expose-headers"}

`Access-Control-Expose-Headers` 헤더는 브라우저의 JavaScript가 접근할 수 있는 허용 목록에 지정된 헤더를 추가합니다.
이러한 헤더를 구성하려면 `exposeHeader` 함수를 사용합니다.

```kotlin
install(CORS) {
    // ...
    exposeHeader("X-My-Custom-Header")
    exposeHeader("X-Another-Custom-Header")
}
```

### 자격 증명 {id="credentials"}

기본적으로 브라우저는 교차 출처 요청 시 자격 증명 정보(예: 쿠키 또는 인증 정보)를 보내지 않습니다. 이 정보의 전달을 허용하려면 `allowCredentials` 속성을 사용하여 `Access-Control-Allow-Credentials` 응답 헤더를 `true`로 설정해야 합니다.

```kotlin
install(CORS) {
    allowCredentials = true
}
```

### 기타 {id="misc"}

`%plugin_name%` 플러그인은 다른 CORS 관련 설정도 지정할 수 있도록 합니다. 예를 들어, `maxAgeInSeconds`를 사용하여 프리플라이트 요청에 대한 응답이 다른 프리플라이트 요청을 보내지 않고 캐시될 수 있는 기간을 지정할 수 있습니다.

```kotlin
install(CORS) {
    maxAgeInSeconds = 3600
}
```

다른 구성 옵션에 대해서는 [CORSConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-cors/io.ktor.server.plugins.cors/-c-o-r-s-config/index.html)에서 알아볼 수 있습니다.