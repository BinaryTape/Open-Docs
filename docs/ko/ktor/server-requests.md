[//]: # (title: 요청 처리)

<show-structure for="chapter" depth="3"/>

<link-summary>라우트 핸들러 내에서 수신 요청을 처리하는 방법을 알아보세요.</link-summary>

Ktor를 사용하면 라우트 핸들러([route handlers](server-routing.md#define_route)) 내에서 수신 요청을 처리하고 응답([responses](server-responses.md))을 보낼 수 있습니다. 요청을 처리할 때 다양한 작업을 수행할 수 있습니다:
* 헤더, 쿠키 등과 같은 요청 정보([request information](#request_information))를 가져옵니다.
* 경로 파라미터([path parameter](#path_parameters)) 값을 가져옵니다.
* 쿼리 문자열([query string](#query_parameters))의 파라미터를 가져옵니다.
* 본문 내용([body contents](#body_contents)), 예를 들어 데이터 객체, 폼 파라미터, 파일을 수신합니다.

## 일반 요청 정보 {id="request_information"}
라우트 핸들러 내에서 `call.request`([call.request](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call/request.html)) 속성을 사용하여 요청에 접근할 수 있습니다. 이는 `ApplicationRequest`([ApplicationRequest](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/index.html)) 인스턴스를 반환하고 다양한 요청 파라미터에 대한 접근을 제공합니다. 예를 들어, 아래 코드 스니펫은 요청 URI를 얻는 방법을 보여줍니다:
```kotlin
routing {
    get("/") {
        val uri = call.request.uri
        call.respondText("Request uri: $uri")
    }
}
```
> `call.respondText`([call.respondText](server-responses.md#plain-text)) 메서드는 클라이언트로 응답을 보내는 데 사용됩니다.

`ApplicationRequest`([ApplicationRequest](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/index.html)) 객체를 사용하면 다음과 같은 다양한 요청 데이터에 접근할 수 있습니다:
* 헤더
  모든 요청 헤더에 접근하려면 `ApplicationRequest.headers`([ApplicationRequest.headers](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/headers.html)) 속성을 사용합니다. `acceptEncoding`, `contentType`, `cacheControl` 등과 같은 전용 확장 함수를 사용하여 특정 헤더에 접근할 수도 있습니다.
* 쿠키
  `ApplicationRequest.cookies`([ApplicationRequest.cookies](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/cookies.html)) 속성은 요청과 관련된 쿠키에 대한 접근을 제공합니다. 쿠키를 사용하여 세션을 처리하는 방법을 알아보려면 [세션(Sessions)](server-sessions.md) 섹션을 참조하세요.
* 연결 상세 정보
  `ApplicationRequest.local`([ApplicationRequest.local](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/local.html)) 속성을 사용하여 호스트 이름, 포트, 스킴 등과 같은 연결 상세 정보에 접근할 수 있습니다.
* `X-Forwarded-` 헤더
  HTTP 프록시 또는 로드 밸런서를 통해 전달된 요청에 대한 정보를 얻으려면 [](server-forward-headers.md) 플러그인을 설치하고 `ApplicationRequest.origin`([ApplicationRequest.origin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.plugins/origin.html)) 속성을 사용하세요.

## 경로 파라미터 {id="path_parameters"}
요청을 처리할 때 `call.parameters` 속성을 사용하여 경로 파라미터([path parameter](server-routing.md#path_parameter)) 값에 접근할 수 있습니다. 예를 들어, 아래 코드 스니펫에서 `call.parameters["login"]`은 `/user/admin` 경로에 대해 _admin_을 반환합니다:
[object Promise]

## 쿼리 파라미터 {id="query_parameters"}

<emphasis tooltip="query_string">쿼리 문자열</emphasis>의 파라미터에 접근하려면 `ApplicationRequest.queryParameters`([ApplicationRequest.queryParameters](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/query-parameters.html)) 속성을 사용할 수 있습니다. 예를 들어, `/products?price=asc`로 요청이 이루어진 경우, 다음과 같이 `price` 쿼리 파라미터에 접근할 수 있습니다:

[object Promise]

또한 `ApplicationRequest.queryString`([ApplicationRequest.queryString](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/query-string.html)) 함수를 사용하여 전체 쿼리 문자열을 얻을 수 있습니다.

## 본문 내용 {id="body_contents"}
이 섹션에서는 `POST`, `PUT`, `PATCH`와 함께 전송된 본문 내용을 수신하는 방법을 보여줍니다.

### 원시 페이로드 {id="raw"}

원시 본문 페이로드에 접근하고 수동으로 파싱하려면, 수신할 페이로드의 타입을 허용하는 `ApplicationCall.receive`([ApplicationCall.receive](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive.html)) 함수를 사용하세요.
다음 HTTP 요청이 있다고 가정해 봅시다:

[object Promise]

다음 방법 중 하나로 이 요청의 본문을 지정된 타입의 객체로 수신할 수 있습니다:

- **String**

   요청 본문을 String 값으로 수신하려면 `call.receive<String>()`을 사용하세요.
   `receiveText`([receiveText](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-text.html))를 사용하여 동일한 결과를 얻을 수도 있습니다:
   [object Promise]
- **ByteArray**

   요청의 본문을 바이트 배열로 수신하려면 `call.receive<ByteArray>()`을 호출하세요:
   [object Promise]
- **ByteReadChannel**

   `call.receive<ByteReadChannel>()` 또는 `receiveChannel`([receiveChannel](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-channel.html))를 사용하여 바이트 시퀀스의 비동기 읽기를 가능하게 하는 `ByteReadChannel`([ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html))을 수신할 수 있습니다:
   [object Promise]

   아래 샘플은 `ByteReadChannel`을 사용하여 파일을 업로드하는 방법을 보여줍니다:
   [object Promise]

전체 예제는 여기에서 찾을 수 있습니다: [post-raw-data](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-raw-data).

### 객체 {id="objects"}
Ktor는 요청의 미디어 타입을 협상하고 내용을 필요한 타입의 객체로 역직렬화하는 `ContentNegotiation`([ContentNegotiation](server-serialization.md)) 플러그인을 제공합니다. 요청의 내용을 수신하고 변환하려면, 데이터 클래스를 파라미터로 허용하는 `ApplicationCall.receive`([ApplicationCall.receive](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive.html)) 함수를 호출하세요:
[object Promise]

[](server-serialization.md)에서 더 자세히 알아볼 수 있습니다.

### 폼 파라미터 {id="form_parameters"}
Ktor는 `receiveParameters`([receiveParameters](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-parameters.html)) 함수를 사용하여 `x-www-form-urlencoded`와 `multipart/form-data` 타입 모두로 전송된 폼 파라미터를 수신할 수 있도록 허용합니다. 아래 예제는 본문에 폼 파라미터가 전달된 HTTP 클라이언트([HTTP client](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html)) `POST` 요청을 보여줍니다:
[object Promise]

코드에서 파라미터 값을 다음과 같이 얻을 수 있습니다:
[object Promise]

전체 예제는 여기에서 찾을 수 있습니다: [post-form-parameters](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-form-parameters).

### 멀티파트 폼 데이터 {id="form_data"}

멀티파트 요청의 일부로 전송된 파일을 수신하려면,
`.receiveMultipart()`([.receiveMultipart()](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/receive-multipart.html))
함수를 호출한 다음 필요에 따라 각 파트를 반복합니다.

멀티파트 요청 데이터는 순차적으로 처리되므로, 특정 부분에 직접 접근할 수 없습니다. 또한,
이러한 요청은 폼 필드, 파일 또는 이진 데이터와 같은 다양한 타입의 파트를 포함할 수 있으며, 이는
다르게 처리해야 합니다.

아래 예제는 파일을 수신하여 파일 시스템에 저장하는 방법을 보여줍니다:

[object Promise]

#### 기본 파일 크기 제한

기본적으로 수신할 수 있는 이진 및 파일 항목에 허용되는 크기는 50MB로 제한됩니다. 수신된 파일
또는 이진 항목이 50MB 제한을 초과하면 `IOException`이 발생합니다.

기본 폼 필드 제한을 재정의하려면 `.receiveMultipart()`를 호출할 때 `formFieldLimit` 파라미터를 전달하세요:

[object Promise]

이 예제에서는 새 제한이 100MB로 설정되었습니다.

#### 폼 필드

`PartData.FormItem`은 폼 필드를 나타내며, `value` 속성을 통해 해당 값에 접근할 수 있습니다:

[object Promise]

#### 파일 업로드

`PartData.FileItem`은 파일 항목을 나타냅니다. 파일 업로드를 바이트 스트림으로 처리할 수 있습니다:

[object Promise]

`.provider()`([`.provider()`](https://api.ktor.io/ktor-http/io.ktor.http.content/-part-data/-file-item/provider.html))
함수는 `ByteReadChannel`을 반환하며, 이를 통해 데이터를 증분적으로 읽을 수 있습니다.
`.copyAndClose()` 함수를 사용하여, 적절한 리소스 정리를 보장하면서 지정된 대상으로 파일 내용을 작성합니다.

업로드된 파일 크기를 결정하려면, `post` 핸들러 내에서 `Content-Length` 헤더([header value](#request_information)) 값을 얻을 수 있습니다:

```kotlin
post("/upload") {
    val contentLength = call.request.header(HttpHeaders.ContentLength)
    // ...
}
```

#### 리소스 정리

폼 처리가 완료되면, 각 파트는 리소스를 해제하기 위해 `.dispose()` 함수를 사용하여 폐기됩니다.

[object Promise]

이 샘플을 실행하는 방법을 알아보려면
[upload-file](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/upload-file)을 참조하세요.