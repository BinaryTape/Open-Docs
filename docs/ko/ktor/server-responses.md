[//]: # (title: 응답 보내기)

<show-structure for="chapter" depth="2"/>

<link-summary>다양한 유형의 응답을 보내는 방법을 알아봅니다.</link-summary>

Ktor를 사용하면 들어오는 [요청](server-requests.md)을 처리하고 [경로 핸들러](server-routing.md#define_route) 내에서 응답을 보낼 수 있습니다. 일반 텍스트, HTML 문서 및 템플릿, 직렬화된 데이터 객체 등 다양한 유형의 응답을 보낼 수 있습니다. 각 응답에 대해 콘텐츠 유형, 헤더, 쿠키 등 다양한 [응답 매개변수](#parameters)를 구성할 수도 있습니다.

경로 핸들러 내에서 응답 작업에 사용할 수 있는 API는 다음과 같습니다.
* [특정 콘텐츠 유형](#payload) 전송을 목표로 하는 함수 세트입니다. 예를 들어, [call.respondText](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-text.html), [call.respondHtml](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html.html) 등이 있습니다.
* 응답 내에서 [모든 데이터](#payload)를 보낼 수 있는 [call.respond](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond.html) 함수입니다. 예를 들어, [ContentNegotiation](server-serialization.md) 플러그인이 활성화된 경우, 특정 형식으로 직렬화된 데이터 객체를 보낼 수 있습니다.
* [ApplicationResponse](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/-application-response/index.html) 객체를 반환하는 [call.response](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call/response.html) 프로퍼티로, [응답 매개변수](#parameters)에 대한 접근을 제공하고 상태 코드 설정, 헤더 추가 및 쿠키 구성이 가능합니다.
* [call.respondRedirect](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-redirect.html)는 리디렉션(redirect)을 추가하는 기능을 제공합니다.

## 응답 페이로드 설정 {id="payload"}
### 일반 텍스트 {id="plain-text"}
응답으로 일반 텍스트를 보내려면 [call.respondText](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-text.html) 함수를 사용하세요:
```kotlin
get("/") {
    call.respondText("Hello, world!")
}
```

### HTML {id="html"}
Ktor는 클라이언트에 HTML 응답을 보내는 두 가지 주요 방법을 제공합니다:
* Kotlin HTML DSL을 사용하여 HTML을 빌드하는 방법.
* FreeMarker, Velocity 등과 같은 JVM 템플릿 엔진을 사용하는 방법.

Kotlin DSL을 사용하여 빌드된 HTML을 보내려면 [call.respondHtml](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html.html) 함수를 사용하세요:
[object Promise]

응답으로 템플릿을 보내려면 특정 콘텐츠와 함께 [call.respond](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond.html) 함수를 호출하세요...
[object Promise]

... 또는 적절한 [call.respondTemplate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-freemarker/io.ktor.server.freemarker/respond-template.html) 함수를 사용하세요:
```kotlin
get("/index") {
    val sampleUser = User(1, "John")
    call.respondTemplate("index.ftl", mapOf("user" to sampleUser))
}
```
자세한 내용은 [](server-templating.md) 도움말 섹션에서 확인할 수 있습니다.

### 객체 {id="object"}
Ktor에서 데이터 객체 직렬화를 활성화하려면, [ContentNegotiation](server-serialization.md) 플러그인을 설치하고 필요한 컨버터(예: JSON)를 등록해야 합니다. 그런 다음 [call.respond](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond.html) 함수를 사용하여 응답으로 데이터 객체를 전달할 수 있습니다:

[object Promise]

전체 예제는 여기에서 찾을 수 있습니다: [json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx).

[//]: # (TODO: Check link for LocalPathFile)

### 파일 {id="file"}

클라이언트에 파일 콘텐츠로 응답하려면 두 가지 옵션이 있습니다:

-   `File` 리소스의 경우,
    [call.respondFile](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-file.html)
    함수를 사용하세요.
-   `Path` 리소스의 경우, [LocalPathContent](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/-local-path-content/index.html)
    클래스와 함께 `call.respond()` 함수를 사용하세요.

아래 코드 샘플은 응답으로 지정된 파일을 보내고 `Content-Disposition` [헤더](#headers)를 추가하여 이 파일을 다운로드 가능하게 만드는 방법을 보여줍니다:

[object Promise]

이 샘플에는 두 가지 플러그인이 설치되어 있습니다:
-   [PartialContent](server-partial-content.md)는 서버가 `Range` 헤더가 포함된 요청에 응답하고 콘텐츠의 일부만 보내도록 합니다.
-   [AutoHeadResponse](server-autoheadresponse.md)는 `GET`이 정의된 모든 경로에 대해 `HEAD` 요청에 자동으로 응답하는 기능을 제공합니다. 이를 통해 클라이언트 애플리케이션은 `Content-Length` 헤더 값을 읽어 파일 크기를 확인할 수 있습니다.

전체 코드 샘플은
[download-file](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/download-file)에서 확인할 수 있습니다.

### 원시 페이로드 {id="raw"}
원시 바디 페이로드(raw body payload)를 보내야 하는 경우, [call.respondBytes](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-bytes.html) 함수를 사용하세요.

## 응답 매개변수 설정 {id="parameters"}
### 상태 코드 {id="status"}
응답에 대한 상태 코드를 설정하려면 [ApplicationResponse.status](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/-application-response/status.html)를 호출하세요. 미리 정의된 상태 코드 값을 전달할 수 있습니다...
```kotlin
get("/") {
    call.response.status(HttpStatusCode.OK)
}
```
... 또는 사용자 지정 상태 코드를 지정할 수 있습니다:
```kotlin
get("/") {
    call.response.status(HttpStatusCode(418, "I'm a tea pot"))
}
```

[페이로드](#payload) 전송을 위한 함수에는 상태 코드를 지정하기 위한 오버로드가 있습니다.

### 콘텐츠 유형 {id="content-type"}
[ContentNegotiation](server-serialization.md) 플러그인이 설치되어 있으면 Ktor는 [응답](#payload)에 대한 콘텐츠 유형을 자동으로 선택합니다. 필요한 경우, 해당 매개변수를 전달하여 콘텐츠 유형을 수동으로 지정할 수 있습니다. 예를 들어, 아래 코드 스니펫의 `call.respondText` 함수는 `ContentType.Text.Plain`을 매개변수로 받습니다:
```kotlin
get("/") {
    call.respondText("Hello, world!", ContentType.Text.Plain, HttpStatusCode.OK)
}
```

### 헤더 {id="headers"}
응답에 특정 헤더를 보내는 몇 가지 방법이 있습니다:
*   [ApplicationResponse.headers](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/-application-response/headers.html) 컬렉션에 헤더를 추가합니다:
    ```kotlin
    get("/") {
        call.response.headers.append(HttpHeaders.ETag, "7c876b7e")
    }
    ```
*   [ApplicationResponse.header](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/header.html) 함수를 호출합니다:
    ```kotlin
    get("/") {
        call.response.header(HttpHeaders.ETag, "7c876b7e")
    }
    ```
*   특정 헤더를 지정하는 전용 함수를 사용합니다. 예를 들어, `ApplicationResponse.etag`, `ApplicationResponse.link` 등이 있습니다.
    ```kotlin
    get("/") {
        call.response.etag("7c876b7e")
    }
    ```
*   사용자 지정 헤더를 추가하려면 위에서 언급된 함수에 문자열 값으로 헤더 이름을 전달합니다. 예를 들어 다음과 같습니다:
    ```kotlin
    get("/") {
        call.response.header("Custom-Header", "Some value")
    }
    ```

> 각 응답에 표준 `Server` 및 `Date` 헤더를 추가하려면 [DefaultHeaders](server-default-headers.md) 플러그인을 설치하세요.
>
{type="tip"}

### 쿠키 {id="cookies"}
응답으로 전송되는 쿠키를 구성하려면 [ApplicationResponse.cookies](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/-application-response/cookies.html) 프로퍼티를 사용하세요:
```kotlin
get("/") {
    call.response.cookies.append("yummy_cookie", "choco")
}
```
Ktor는 또한 쿠키를 사용하여 세션을 처리하는 기능을 제공합니다. 자세한 내용은 [Sessions](server-sessions.md) 섹션에서 확인할 수 있습니다.

## 리디렉션 {id="redirect"}
리디렉션 응답을 생성하려면 [respondRedirect](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-redirect.html) 함수를 호출하세요:
```kotlin
get("/") {
    call.respondRedirect("/moved", permanent = true)
}

get("/moved") {
    call.respondText("Moved content")
}