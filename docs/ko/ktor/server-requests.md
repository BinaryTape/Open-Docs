[//]: # (title: 요청 처리하기)

<show-structure for="chapter" depth="3"/>

<link-summary>라우트 핸들러 내에서 들어오는 요청을 처리하는 방법을 알아봅니다.</link-summary>

Ktor를 사용하면 [라우트 핸들러](server-routing.md#define_route) 내에서 들어오는 요청을 처리하고 [응답](server-responses.md)을 보낼 수 있습니다. 요청을 처리할 때 다음과 같은 다양한 작업을 수행할 수 있습니다:

* 헤더, 쿠키 등과 같은 [요청 정보](#request_information) 가져오기.
* [경로 파라미터(path parameter)](#path_parameters) 값 가져오기.
* [쿼리 문자열(query string)](#query_parameters)의 파라미터 가져오기.
* 데이터 객체, 폼 파라미터, 파일과 같은 [바디 콘텐츠(body contents)](#body_contents) 수신하기.

## 일반적인 요청 정보 {id="request_information"}
라우트 핸들러 내에서 [`call.request`](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-application-call/request.html) 속성을 사용하여 요청에 접근할 수 있습니다. 이는 [`ApplicationRequest`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/-application-request/index.html) 인스턴스를 반환하며 다양한 요청 파라미터에 대한 접근을 제공합니다. 예를 들어, 아래 코드 스니펫은 요청 URI를 가져오는 방법을 보여줍니다:

```kotlin
routing {
    get("/") {
        val uri = call.request.uri
        call.respondText("Request uri: $uri")
    }
}
```
[`call.respondText()`](server-responses.md#plain-text) 메서드는 클라이언트에 응답을 다시 보내는 데 사용됩니다.

[`ApplicationRequest`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/-application-request/index.html) 객체를 사용하면 다음과 같은 다양한 요청 데이터에 접근할 수 있습니다:

* **헤더(Headers)**

  모든 요청 헤더에 접근하려면 [`ApplicationRequest.headers`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/-application-request/headers.html) 속성을 사용하세요. 또한 `acceptEncoding`, `contentType`, `cacheControl` 등과 같은 전용 확장 함수를 사용하여 특정 헤더에 접근할 수도 있습니다.

* **쿠키(Cookies)**  

  [`ApplicationRequest.cookies`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/-application-request/cookies.html) 속성은 요청과 관련된 쿠키에 대한 접근을 제공합니다. 쿠키를 사용하여 세션을 처리하는 방법을 알아보려면 [Sessions](server-sessions.md) 섹션을 참조하세요.

* **연결 세부 정보(Connection details)**

  호스트 이름, 포트, 스키마 등과 같은 연결 세부 정보에 접근하려면 [`ApplicationRequest.local`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/-application-request/local.html) 속성을 사용하세요.

* **`X-Forwarded-` 헤더**

  HTTP 프록시나 로드 밸런서를 통해 전달된 요청에 대한 정보를 가져오려면, [Forwarded headers](server-forward-headers.md) 플러그인을 설치하고 [`ApplicationRequest.origin`](https://api.ktor.io/ktor-server-core/io.ktor.server.plugins/origin.html) 속성을 사용하세요.

## 경로 파라미터 {id="path_parameters"}
요청을 처리할 때 `call.parameters` 속성을 사용하여 [경로 파라미터](server-routing.md#path_parameter) 값에 접근할 수 있습니다. 예를 들어, 아래 코드 스니펫에서 `call.parameters["login"]`은 `/user/admin` 경로에 대해 _admin_을 반환합니다:

```kotlin
get("/user/{login}") {
    if (call.parameters["login"] == "admin") {
        // ...
    }
}
```

## 쿼리 파라미터 {id="query_parameters"}

<emphasis tooltip="query_string">쿼리 문자열(query string)</emphasis>의 파라미터에 접근하려면 [`ApplicationRequest.queryParameters()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/-application-request/query-parameters.html) 속성을 사용할 수 있습니다. 예를 들어, `/products?price=asc`로 요청이 들어오면 다음과 같은 방식으로 `price` 쿼리 파라미터에 접근할 수 있습니다:

```kotlin
get("/products") {
    if (call.request.queryParameters["price"] == "asc") {
        // 가장 낮은 가격부터 가장 높은 가격 순으로 제품 표시
    }
}
```

[`ApplicationRequest.queryString()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/query-string.html) 함수를 사용하여 전체 쿼리 문자열을 가져올 수도 있습니다.

## 바디 콘텐츠 {id="body_contents"}
이 섹션에서는 `POST`, `PUT` 또는 `PATCH`로 전송된 바디 콘텐츠를 수신하는 방법을 보여줍니다.

### 원시 페이로드 {id="raw"}

원시 바디 페이로드(payload)에 접근하여 수동으로 파싱하려면 수신할 페이로드 타입을 인자로 받는 [`ApplicationCall.receive()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/receive.html) 함수를 사용하세요. 다음과 같은 HTTP 요청이 있다고 가정해 보겠습니다:

```HTTP
POST http://localhost:8080/text
Content-Type: text/plain

Hello, world!
```

다음 중 하나의 방법으로 이 요청의 바디를 지정된 타입의 객체로 수신할 수 있습니다:

- **String**

   요청 바디를 String 값으로 받으려면 `call.receive<String>()`을 사용하세요. 동일한 결과를 얻기 위해 [`.receiveText()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/receive-text.html)를 사용할 수도 있습니다:
   ```kotlin
   post("/text") {
       val text = call.receiveText()
       call.respondText(text)
   }
   ```
- **ByteArray**

   요청 바디를 바이트 배열로 받으려면 `call.receive<ByteArray>()`를 호출하세요:
   ```kotlin
           post("/bytes") {
               val bytes = call.receive<ByteArray>()
               call.respond(String(bytes))
           }
   
   ```
- **ByteReadChannel**

   `call.receive<ByteReadChannel>()` 또는 [`.receiveChannel()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/receive-channel.html)을 사용하여 바이트 시퀀스의 비동기 읽기를 가능하게 하는 [`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)을 수신할 수 있습니다:
   ```kotlin
   post("/channel") {
       val readChannel = call.receiveChannel()
       val text = readChannel.readRemaining().readString()
       call.respondText(text)
   }
   ```

   아래 샘플은 `ByteReadChannel`을 사용하여 파일을 업로드하는 방법을 보여줍니다:
   ```kotlin
   post("/upload") {
       val file = File("uploads/ktor_logo.png")
       call.receiveChannel().copyAndClose(file.writeChannel())
       call.respondText("A file is uploaded")
   }
   ```

> Ktor 채널과 `RawSink`, `RawSource` 또는 `OutputStream`과 같은 타입 간의 변환에 대해서는 [I/O 상호 운용성(I/O interoperability)](io-interoperability.md)을 참조하세요.
>
{style="tip"}

> 전체 예제는 [post-raw-data](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/post-raw-data)를 참조하세요.

### 객체 {id="objects"}

Ktor는 요청의 미디어 타입을 협상하고 콘텐츠를 필요한 타입의 객체로 역직렬화하는 [ContentNegotiation](server-serialization.md) 플러그인을 제공합니다.

요청 콘텐츠를 수신하고 변환하려면 데이터 클래스를 파라미터로 받는 [`ApplicationCall.receive()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/receive.html) 함수를 호출하세요:

```kotlin
post("/customer") {
    val customer = call.receive<Customer>()
    customerStorage.add(customer)
    call.respondText("Customer stored correctly", status = HttpStatusCode.Created)
}
```

> 자세한 내용은 [Ktor 서버의 콘텐츠 협상 및 직렬화](server-serialization.md)를 참조하세요.

### 폼 파라미터 {id="form_parameters"}
Ktor를 사용하면 [receiveParameters](https://api.ktor.io/ktor-server-core/io.ktor.server.request/receive-parameters.html) 함수를 사용하여 `x-www-form-urlencoded` 및 `multipart/form-data` 타입으로 전송된 폼 파라미터를 수신할 수 있습니다. 아래 예제는 바디에 폼 파라미터가 포함된 [HTTP 클라이언트](https://www.jetbrains.com/help/idea/http-client-in-product-code-editor.html) `POST` 요청을 보여줍니다:
```HTTP
POST http://localhost:8080/signup
Content-Type: application/x-www-form-urlencoded

username=JetBrains&email=example@jetbrains.com&password=foobar&confirmation=foobar
```

코드에서 다음과 같이 파라미터 값을 얻을 수 있습니다:
```kotlin
post("/signup") {
    val formParameters = call.receiveParameters()
    val username = formParameters["username"].toString()
    call.respondText("The '$username' account is created")
}
```

> 전체 예제는 [post-form-parameters](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/post-form-parameters)를 참조하세요.

### 멀티파트 폼 데이터 {id="form_data"}

멀티파트(multipart) 요청의 일부로 전송된 파일을 받으려면 [`.receiveMultipart()`](https://api.ktor.io/ktor-server-core/io.ktor.server.request/receive-multipart.html) 함수를 호출한 다음 필요에 따라 각 파트를 순회합니다.

멀티파트 요청 데이터는 순차적으로 처리되므로 특정 파트에 직접 접근할 수 없습니다. 또한 이러한 요청에는 폼 필드, 파일 또는 바이너리 데이터와 같이 서로 다르게 처리해야 하는 다양한 타입의 파트가 포함될 수 있습니다.

이 예제는 파일을 수신하여 파일 시스템에 저장하는 방법을 보여줍니다:

```kotlin
import io.ktor.server.application.*
import io.ktor.http.content.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.util.cio.*
import io.ktor.utils.io.*
import java.io.File

fun Application.main() {
    routing {
        post("/upload") {
            var fileDescription = ""
            var fileName = ""
            val multipartData = call.receiveMultipart(formFieldLimit = 1024 * 1024 * 100)

            multipartData.forEachPart { part ->
                when (part) {
                    is PartData.FormItem -> {
                        fileDescription = part.value
                    }

                    is PartData.FileItem -> {
                        fileName = part.originalFileName as String
                        val file = File("uploads/$fileName")
                        part.provider().copyAndClose(file.writeChannel())
                    }

                    else -> {}
                }
                part.dispose()
            }

            call.respondText("$fileDescription is uploaded to 'uploads/$fileName'")
        }
    }
}
```

#### 기본 파일 크기 제한

기본적으로 수신 가능한 바이너리 및 파일 항목의 허용 크기는 50MiB로 제한됩니다. 수신된 파일 또는 바이너리 항목이 50MiB 제한을 초과하면 `IOException`이 발생합니다.

기본 폼 필드 제한을 재정의하려면 `.receiveMultipart()`를 호출할 때 `formFieldLimit` 파라미터를 전달하세요:

```kotlin
val multipartData = call.receiveMultipart(formFieldLimit = 1024 * 1024 * 100)
```

이 예제에서 새로운 제한은 100MiB로 설정되었습니다.

#### 폼 필드

`PartData.FormItem`은 폼 필드를 나타내며, `value` 속성을 통해 해당 값에 접근할 수 있습니다:

```kotlin
when (part) {
    is PartData.FormItem -> {
        fileDescription = part.value
    }
}
```

#### 파일 업로드

`PartData.FileItem`은 파일 항목을 나타냅니다. 파일 업로드를 바이트 스트림으로 처리할 수 있습니다:

```kotlin
when (part) {
    is PartData.FileItem -> {
        fileName = part.originalFileName as String
        val file = File("uploads/$fileName")
        part.provider().copyAndClose(file.writeChannel())
    }
}
```

[`.provider()`](https://api.ktor.io/ktor-http/io.ktor.http.content/-part-data/-file-item/provider.html) 함수는 데이터를 점진적으로 읽을 수 있는 `ByteReadChannel`을 반환합니다. 그런 다음 `.copyAndClose()` 함수를 사용하여 적절한 리소스 정리를 보장하면서 파일 콘텐츠를 지정된 목적지에 씁니다.

업로드된 파일 크기를 확인하려면 `post` 핸들러 내에서 `Content-Length` [헤더 값](#request_information)을 가져올 수 있습니다:

```kotlin
post("/upload") {
    val contentLength = call.request.header(HttpHeaders.ContentLength)
    // ...
}
```

#### 리소스 정리

폼 처리가 완료되면 리소스를 해제하기 위해 `.dispose()` 함수를 사용하여 각 파트를 폐기(dispose)합니다.

```kotlin
part.dispose()
```

> 이 샘플을 실행하는 방법을 알아보려면 [upload-file](https://github.com/ktorio/ktor-documentation/tree/main/codeSnippets/snippets/upload-file)을 참조하세요.