[//]: # (title: 요청하기)

<show-structure for="chapter" depth="2"/>

[percent_encoding]: https://en.wikipedia.org/wiki/Percent-encoding

<tldr>
<var name="example_name" value="client-configure-request"/>
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
요청 URL, HTTP 메서드, 헤더, 요청 본문 등 다양한 요청 파라미터를 지정하여 요청을 만드는 방법을 알아보세요.
</link-summary>

[클라이언트를 구성](client-create-and-configure.md)한 후 HTTP 요청을 시작할 수 있습니다. 이를 위한 주요 방법은 URL을 파라미터로 받는
[`.request()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/request.html)
함수를 사용하는 것입니다. 이 함수 내에서 다양한 요청 파라미터를 구성할 수 있습니다:

*   `GET`, `POST`, `PUT`, `DELETE`, `HEAD`, `OPTIONS`, `PATCH`와 같은 HTTP 메서드를 지정합니다.
*   URL을 문자열로 구성하거나, 도메인, 경로, 쿼리 파라미터와 같은 구성 요소를 개별적으로 구성합니다.
*   Unix 도메인 소켓을 사용합니다.
*   헤더와 쿠키를 추가합니다.
*   요청 본문을 포함합니다 – 예를 들어, 일반 텍스트, 데이터 객체 또는 폼 파라미터가 있습니다.

이러한 파라미터는
[`HttpRequestBuilder`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html)
클래스에 의해 노출됩니다.

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*

val response: HttpResponse = client.request("https://ktor.io/") {
  // Configure request parameters exposed by HttpRequestBuilder
}
```

{interpolate-variables="true" disable-links="false"}

`.request()` 함수는 `HttpResponse` 객체로 응답을 반환합니다. `HttpResponse`는 문자열, JSON 객체 등 다양한 형식으로 응답 본문을 가져오는 데 필요한 API와 상태 코드, 콘텐츠 타입, 헤더와 같은 응답 파라미터를 검색하는 API를 노출합니다. 자세한 내용은 [응답 수신](client-responses.md)을 참조하세요.

> `.request()`는 정지 함수(suspending function)입니다. 즉, 코루틴(coroutine) 또는 다른 정지 함수 내에서 호출되어야 합니다. 정지 함수에 대해 자세히 알아보려면 [코루틴 기본](https://kotlinlang.org/docs/coroutines-basics.html)을 참조하세요.

### HTTP 메서드 지정 {id="http-method"}

`.request()` 함수를 호출할 때 `method` 속성을 사용하여 원하는 HTTP 메서드를 지정할 수 있습니다:

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

val response: HttpResponse = client.request("https://ktor.io/") {
    method = HttpMethod.Get
}
```

`.request()` 외에도 `HttpClient`는
[`.get()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/get.html),
[`.post()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/post.html),
[`.put()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/put.html)과
같은 기본 HTTP 메서드를 위한 특정 함수를 제공합니다. 위 예시는 `.get()` 함수를 사용하여 다음과 같이 간소화할 수 있습니다:

```kotlin
val response: HttpResponse = client.get("https://ktor.io/docs/welcome.html")
```

두 예시 모두에서 요청 URL은 문자열로 지정됩니다. 또한
[`HttpRequestBuilder`](#url)를 사용하여 URL 구성 요소를 개별적으로 구성할 수 있습니다.

## 요청 URL 지정 {id="url"}

Ktor 클라이언트는 여러 가지 방법으로 요청 URL을 구성할 수 있도록 합니다:

### 전체 URL 문자열 전달

```kotlin
val response: HttpResponse = client.get("https://ktor.io/docs/welcome.html")
```

### URL 구성 요소 개별적으로 구성

```kotlin
client.get {
    url {
        protocol = URLProtocol.HTTPS
        host = "ktor.io"
        path("docs/welcome.html")
    }
}
```

이 경우 `HttpRequestBuilder`가 제공하는 `url` 파라미터가 사용됩니다. 이는
[`URLBuilder`](https://api.ktor.io/ktor-http/io.ktor.http/-u-r-l-builder/index.html) 인스턴스를 받아 복잡한 URL을 구성하는 데 더 많은 유연성을 제공합니다.

> 모든 요청에 대한 기본 URL을 구성하려면 [`DefaultRequest`](client-default-request.md#url) 플러그인을 사용하세요.

### 경로 세그먼트 {id="path_segments"}

이전 예시에서는 `URLBuilder.path` 속성을 사용하여 전체 URL 경로를 지정했습니다.
대신 `appendPathSegments()` 함수를 사용하여 개별 경로 세그먼트를 전달할 수 있습니다.

```kotlin
client.get("https://ktor.io") {
    url {
        appendPathSegments("docs", "welcome.html")
    }
}
```

기본적으로 `appendPathSegments`는 경로 세그먼트를 [인코딩][percent_encoding]합니다.
인코딩을 비활성화하려면 대신 `appendEncodedPathSegments()`를 사용하세요.

### 쿼리 파라미터 {id="query_parameters"}

<emphasis tooltip="query_string">쿼리 문자열</emphasis> 파라미터를 추가하려면 `URLBuilder.parameters` 속성을 사용하세요:

```kotlin
client.get("https://ktor.io") {
    url {
        parameters.append("token", "abc123")
    }
}
```

기본적으로 `parameters`는 쿼리 파라미터를 [인코딩][percent_encoding]합니다.
인코딩을 비활성화하려면 대신 `encodedParameters()`를 사용하세요.

> `trailingQuery` 속성은 쿼리 파라미터가 없더라도 `?` 문자를 유지하는 데 사용할 수 있습니다.

### URL 프래그먼트 {id="url-fragment"}

해시 마크 `#`는 URL 끝 근처에 선택적 프래그먼트(fragment)를 도입합니다.
`fragment` 속성을 사용하여 URL 프래그먼트를 구성할 수 있습니다.

```kotlin
client.get("https://ktor.io") {
    url {
        fragment = "some_anchor"
    }
}
```

기본적으로 `fragment`는 URL 프래그먼트를 [인코딩][percent_encoding]합니다.
인코딩을 비활성화하려면 대신 `encodedFragment()`를 사용하세요.

## Unix 도메인 소켓 지정

> Unix 도메인 소켓은 CIO 엔진에서만 지원됩니다.
> Ktor 서버와 함께 Unix 소켓을 사용하려면 [서버를 그에 따라 구성](server-configuration-code.topic#cio-code)하세요.
>
{style="note"}

Unix 도메인 소켓을 수신 대기하는 서버에 요청을 보내려면, CIO 클라이언트를 사용할 때 `unixSocket()` 함수를 호출하세요:

```kotlin
val client = HttpClient(CIO)

val response: HttpResponse = client.get("/") {
    unixSocket("/tmp/test-unix-socket-ktor.sock")
}
```

[기본 요청](client-default-request.md#unix-domain-sockets)의 일부로 Unix 도메인 소켓을 구성할 수도 있습니다.

## 요청 파라미터 설정 {id="parameters"}

HTTP 메서드, 헤더, 쿠키를 포함한 다양한 요청 파라미터를 지정할 수 있습니다. 특정 클라이언트의 모든 요청에 대한 기본 파라미터를 구성해야 하는 경우, [`DefaultRequest`](client-default-request.md) 플러그인을 사용하세요.

### 헤더 {id="headers"}

여러 가지 방법으로 요청에 헤더를 추가할 수 있습니다:

#### 여러 헤더 추가

[`headers`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/headers.html) 함수를 사용하면 여러 헤더를 한 번에 추가할 수 있습니다:

```kotlin
client.get("https://ktor.io") {
    headers {
        append(HttpHeaders.Accept, "text/html")
        append(HttpHeaders.Authorization, "abc123")
        append(HttpHeaders.UserAgent, "ktor client")
    }
}
```

#### 단일 헤더 추가

[`header`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/header.html) 함수를 사용하면 단일 헤더를 추가할 수 있습니다.

#### 인증에 `basicAuth` 또는 `bearerAuth` 사용

`basicAuth` 및 `bearerAuth` 함수는 해당 HTTP 스키마와 함께 `Authorization` 헤더를 추가합니다.

> 고급 인증 구성에 대해서는 [Ktor 클라이언트의 인증 및 권한 부여](client-auth.md)를 참조하세요.

### 쿠키 {id="cookies"}

쿠키를 보내려면
[`cookie()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/cookie.html) 함수를 사용하세요:

```kotlin
client.get("https://ktor.io") {
    cookie(name = "user_name", value = "jetbrains", expires = GMTDate(
        seconds = 0,
        minutes = 0,
        hours = 10,
        dayOfMonth = 1,
        month = Month.APRIL,
        year = 2023
    ))
}
```

Ktor는 또한 호출 간에 쿠키를 유지할 수 있는 [`HttpCookies`](client-cookies.md) 플러그인을 제공합니다. 이 플러그인이 설치된 경우, `cookie()` 함수를 사용하여 추가된 쿠키는 무시됩니다.

## 요청 본문 설정 {id="body"}

요청 본문을 설정하려면
[`HttpRequestBuilder`](https://api.ktor.io/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html)가 제공하는 `setBody()` 함수를 호출하세요.
이 함수는 일반 텍스트, 임의 클래스 인스턴스, 폼 데이터, 바이트 배열을 포함한 다양한 유형의 페이로드를 허용합니다.

### 텍스트 {id="text"}

본문으로 일반 텍스트를 보내는 것은 다음과 같이 구현할 수 있습니다:

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

val response: HttpResponse = client.post("http://localhost:8080/post") {
    setBody("Body content")
}
```

### 객체 {id="objects"}

[`ContentNegotiation`](client-serialization.md) 플러그인을 활성화하면 요청 본문 내에서 클래스 인스턴스를 JSON으로 보낼 수 있습니다. 이를 위해 `setBody()` 함수에 클래스 인스턴스를 전달하고
[`contentType()`](https://api.ktor.io/ktor-http/io.ktor.http/content-type.html) 함수를 사용하여 콘텐츠 타입을 `application/json`으로 설정합니다:

```kotlin
val response: HttpResponse = client.post("http://localhost:8080/customer") {
    contentType(ContentType.Application.Json)
    setBody(Customer(3, "Jet", "Brains"))
}
```

자세한 내용은 [Ktor 클라이언트의 콘텐츠 협상 및 직렬화](client-serialization.md)를 참조하세요.

### 폼 파라미터 {id="form_parameters"}

Ktor 클라이언트는 `application/x-www-form-urlencoded` 타입으로 폼 파라미터를 보내기 위한
[`submitForm()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request.forms/submit-form.html)
함수를 제공합니다. 다음 예시는 그 사용법을 보여줍니다:

```kotlin
val client = HttpClient(CIO)
val response: HttpResponse = client.submitForm(
    url = "http://localhost:8080/signup",
    formParameters = parameters {
        append("username", "JetBrains")
        append("email", "example@jetbrains.com")
        append("password", "foobar")
        append("confirmation", "foobar")
    }
)
```

*   `url`은 요청을 만드는 URL을 지정합니다.
*   `formParameters`는 `parameters`를 사용하여 구성된 폼 파라미터 집합입니다.

전체 예시는 [client-submit-form](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-submit-form)을 참조하세요.

> URL에 인코딩된 폼 파라미터를 보내려면 `encodeInQuery`를 `true`로 설정하세요.

### 파일 업로드 {id="upload_file"}

폼과 함께 파일을 보내야 하는 경우 다음 방법을 사용할 수 있습니다:

*   [`.submitFormWithBinaryData()`](https://api.ktor.io/ktor-client-core/io.ktor.client.request.forms/submit-form-with-binary-data.html) 함수를 사용합니다. 이 경우 경계(boundary)가 자동으로 생성됩니다.
*   `post` 함수를 호출하고
    [`MultiPartFormDataContent`](https://api.ktor.io/ktor-client-core/io.ktor.client.request.forms/-multi-part-form-data-content/index.html)
    인스턴스를 `setBody` 함수에 전달합니다. `MultiPartFormDataContent` 생성자는 경계 값을 전달할 수도 있습니다.

두 가지 접근 방식 모두
[`formData {}`](https://api.ktor.io/ktor-client-core/io.ktor.client.request.forms/form-data.html) 함수를 사용하여 폼 데이터를 구성해야 합니다.

#### `.submitFormWithBinaryData()` 사용

`.submitFormWithBinaryData()` 함수는 자동으로 경계를 생성하며, `.readBytes()`를 사용하여 파일 콘텐츠가 메모리로 안전하게 읽어올 수 있을 만큼 작은 간단한 사용 사례에 적합합니다.

```kotlin
        val client = HttpClient(CIO)

        val response: HttpResponse = client.submitFormWithBinaryData(
            url = "http://localhost:8080/upload",
            formData = formData {
                append("description", "Ktor logo")
                append("image", File("ktor_logo.png").readBytes(), Headers.build {
                    append(HttpHeaders.ContentType, "image/png")
                    append(HttpHeaders.ContentDisposition, "filename=\"ktor_logo.png\"")
                })
            }
        )
```

전체 예시는
[client-upload](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload)를 참조하세요.

#### `MultiPartFormDataContent` 사용

크거나 동적인 콘텐츠를 효율적으로 스트리밍하려면 `InputProvider`와 함께 `MultiPartFormDataContent`를 사용할 수 있습니다.
`InputProvider`를 사용하면 파일 데이터를 전체를 메모리로 로드하는 대신 버퍼링된 스트림으로 공급할 수 있으므로 대용량 파일에 적합합니다. `MultiPartFormDataContent`를 사용하면 `onUpload` 콜백을 사용하여 업로드 진행 상황을 모니터링할 수도 있습니다.

```kotlin
        val client = HttpClient(CIO)

        val file = File("ktor_logo.png")

        val response: HttpResponse = client.post("http://localhost:8080/upload") {
            setBody(
                MultiPartFormDataContent(
                    formData {
                        append("description", "Ktor logo")
                        append(
                            "image",
                            InputProvider { file.inputStream().asInput().buffered() },
                            Headers.build {
                                append(HttpHeaders.ContentType, "image/png")
                                append(HttpHeaders.ContentDisposition, "filename=\"ktor_logo.png\"")
                            }
                        )
                    },
                    boundary = "WebAppBoundary"
                )
            )
            onUpload { bytesSentTotal, contentLength ->
                println("Sent $bytesSentTotal bytes from $contentLength")
            }
        }
```

멀티플랫폼 프로젝트에서는 `InputProvider`와 함께 `SystemFileSystem.source()`를 사용할 수 있습니다:

```kotlin
InputProvider { SystemFileSystem.source(Path("ktor_logo.png")).buffered() }
```

또한 사용자 지정 경계 및 콘텐츠 타입으로 `MultiPartFormDataContent`를 수동으로 구성할 수도 있습니다:

```kotlin
fun customMultiPartMixedDataContent(parts: List<PartData>): MultiPartFormDataContent {
    val boundary = "WebAppBoundary"
    val contentType = ContentType.MultiPart.Mixed.withParameter("boundary", boundary)
    return MultiPartFormDataContent(parts, boundary, contentType)
}
```

전체 예시는
[client-upload-progress](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload-progress)를 참조하세요.

### 바이너리 데이터 {id="binary"}

`application/octet-stream` 콘텐츠 타입으로 바이너리 데이터를 보내려면
[`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html) 인스턴스를 `setBody()` 함수에 전달합니다.
예를 들어, [`File.readChannel()`](https://api.ktor.io/ktor-utils/io.ktor.util.cio/read-channel.html) 함수를 사용하여 파일에 대한 읽기 채널을 열 수 있습니다:

```kotlin
val response = client.post("http://0.0.0.0:8080/upload") {
    setBody(File("ktor_logo.png").readChannel())
}
```

전체 예시는
[client-upload-binary-data](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload-binary-data)를 참조하세요.

## 병렬 요청 {id="parallel_requests"}

기본적으로 여러 요청을 순차적으로 보내면 클라이언트는 이전 요청이 완료될 때까지 각 호출을 정지합니다. 여러 요청을 동시에 수행하려면
[`launch()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html)
또는 [`async()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html)
함수를 사용하세요. 다음 예시는 `async()`를 사용하여 두 개의 요청을 병렬로 실행하는 방법을 보여줍니다:

```kotlin
coroutineScope {
    // Parallel requests
    val firstRequest: Deferred<String> = async { client.get("http://localhost:8080/path1").bodyAsText() }
    val secondRequest: Deferred<String> = async { client.get("http://localhost:8080/path2").bodyAsText() }
    val firstRequestContent = firstRequest.await()
    val secondRequestContent = secondRequest.await()
}
```

전체 예시는
[client-parallel-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-parallel-requests)를 참조하세요.

## 요청 취소 {id="cancel-request"}

요청을 취소하려면 해당 요청을 실행하는 코루틴을 취소합니다.
[`launch()`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html)
함수는 실행 중인 코루틴을 취소하는 데 사용할 수 있는 `Job`을 반환합니다:

```kotlin
import kotlinx.coroutines.*

val client = HttpClient(CIO)
val job = launch {
    val requestContent: String = client.get("http://localhost:8080")
}
job.cancel()
```

자세한 내용은 [취소 및 타임아웃](https://kotlinlang.org/docs/cancellation-and-timeouts.html)을 참조하세요.