[//]: # (title: 응답 받기)

<show-structure for="chapter" depth="2"/>

<link-summary>
응답을 받고, 응답 본문을 얻으며, 응답 파라미터를 획득하는 방법을 학습합니다.
</link-summary>

[HTTP 요청을 수행](client-requests.md)하는 데 사용되는 모든 함수(`request`, `get`, `post` 등)는
[`HttpResponse`](https://api.ktor.io/ktor-client-core/io.ktor.client.statement/-http-response/index.html)
객체로 응답을 받을 수 있도록 합니다.

`HttpResponse`는 [응답 본문](#body)을 다양한 방식(원시 바이트, JSON 객체 등)으로 얻고, 상태 코드, 콘텐츠 타입, 헤더와 같은 [응답 파라미터](#parameters)를 획득하는 데 필요한 API를 노출합니다.
예를 들어, 파라미터 없는 `GET` 요청에 대한 `HttpResponse`는 다음과 같이 받을 수 있습니다:

```kotlin
val response: HttpResponse = client.get("https://ktor.io/docs/welcome.html")
```

## 응답 파라미터 받기 {id="parameters"}

[`HttpResponse`](https://api.ktor.io/ktor-client-core/io.ktor.client.statement/-http-response/index.html)
클래스를 사용하면 상태 코드, 헤더, HTTP 버전 등과 같은 다양한 응답 파라미터를 얻을 수 있습니다.

### 상태 코드 {id="status"}

응답의 상태 코드를 얻으려면
[`HttpResponse.status`](https://api.ktor.io/ktor-client-core/io.ktor.client.statement/-http-response/status.html)
속성을 사용하세요:

```kotlin
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.*

val httpResponse: HttpResponse = client.get("https://ktor.io/")
if (httpResponse.status.value in 200..299) {
    println("성공적인 응답!")
}
```

### 헤더 {id="headers"}

[`HttpResponse.headers`](https://api.ktor.io/ktor-client-core/io.ktor.client.statement/-http-response/index.html)
속성을 사용하면 모든 응답 헤더를 포함하는 [Headers](https://api.ktor.io/ktor-http/io.ktor.http/-headers/index.html) 맵을 얻을 수 있습니다. 또한, `HttpResponse`는 특정 헤더 값을 받기 위한 다음 함수들을 노출합니다:

* `contentType` for the `Content-Type` header value
* `charset` for a `charset` from the `Content-Type` header value.
* `etag` for the `E-Tag` header value.
* `setCookie` for the `Set-Cookie` header value.
  > Ktor는 또한 호출 간에 쿠키를 유지할 수 있는 [HttpCookies](client-cookies.md) 플러그인을 제공합니다.

## 응답 본문 받기 {id="body"}

### 원시 본문 {id="raw"}

응답의 원시 본문을 받으려면 `body` 함수를 호출하고 필요한 타입을 파라미터로 전달하세요. 아래 코드 스니펫은 [`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/)으로 원시 본문을 받는 방법을 보여줍니다:

```kotlin
val httpResponse: HttpResponse = client.get("https://ktor.io/")
val stringBody: String = httpResponse.body()
```

마찬가지로, [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/)로 본문을 얻을 수 있습니다:

```kotlin
val httpResponse: HttpResponse = client.get("https://ktor.io/")
val byteArrayBody: ByteArray = httpResponse.body()
```

아래 [실행 가능한 예제](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-file)는 `ByteArray`로 응답을 받아 파일에 저장하는 방법을 보여줍니다:

```kotlin
    val client = HttpClient()
    val file = File.createTempFile("files", "index")

    runBlocking {
        val httpResponse: HttpResponse = client.get("https://ktor.io/") {
            onDownload { bytesSentTotal, contentLength ->
                println("$contentLength 바이트 중 $bytesSentTotal 바이트 수신")
            }
        }
        val responseBody: ByteArray = httpResponse.body()
        file.writeBytes(responseBody)
        println("파일이 ${file.path}에 저장되었습니다")
    }
```

위 예제의 [`onDownload()`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/on-download.html) 확장 함수는 다운로드 진행 상황을 표시하는 데 사용됩니다.

비 스트리밍 요청의 경우, 응답 본문은 자동으로 메모리에 로드되고 캐시되어 반복적인 접근을 허용합니다. 이는 작은 페이로드에는 효율적이지만, 큰 응답에서는 높은 메모리 사용량을 초래할 수 있습니다.

큰 응답을 효율적으로 처리하려면, 응답을 메모리에 저장하지 않고 증분적으로 처리하는 [스트리밍 방식](#streaming)을 사용하세요.

### JSON 객체 {id="json"}

[ContentNegotiation](client-serialization.md) 플러그인이 설치된 경우, 응답을 받을 때 JSON 데이터를 데이터 클래스로 역직렬화할 수 있습니다:

```kotlin
val customer: Customer = client.get("http://localhost:8080/customer/3").body()
```

더 자세히 알아보려면 [데이터 주고받기](client-serialization.md#receive_send_data)를 참조하세요.

> ContentNegotiation 플러그인은 [클라이언트](client-serialization.md)와 [서버](server-serialization.md) 모두에서 사용할 수 있습니다. 사용 사례에 맞는 것을 사용해야 합니다.

### 멀티파트 폼 데이터 {id="multipart"}

멀티파트 폼 데이터를 포함하는 응답을 받을 때, 해당 본문을
[`MultiPartData`](https://api.ktor.io/ktor-http/io.ktor.http.content/-multi-part-data/index.html) 인스턴스로 읽을 수 있습니다.
이를 통해 응답에 포함된 폼 필드와 파일을 처리할 수 있습니다.

아래 예제는 멀티파트 응답에서 텍스트 폼 필드와 파일 업로드 모두를 처리하는 방법을 보여줍니다:

```kotlin
val response = client.post("https://myserver.com/multipart/receive")

val multipart = response.body<MultiPartData>()

multipart.forEachPart { part ->
    when (part) {
        is PartData.FormItem -> {
            println("폼 항목 키: ${part.name}")
            val value = part.value
            // ...
        }
        is PartData.FileItem -> {
            println("파일: ${part.name}")
            println(part.originalFileName)
            val fileContent: ByteReadChannel = part.provider()
            // ...
        }
    }
    part.dispose()
}
```

#### 폼 필드

`PartData.FormItem`은 폼 필드를 나타내며, 그 값은 `value` 속성을 통해 접근할 수 있습니다:

```kotlin
when (part) {
    is PartData.FormItem -> {
        println("폼 항목 키: ${part.name}")
        val value = part.value
        // ...
    }
}
```

#### 파일 업로드

`PartData.FileItem`은 파일 항목을 나타냅니다. 파일 업로드를 바이트 스트림으로 처리할 수 있습니다:

```kotlin
when (part) {
    is PartData.FileItem -> {
        println("파일: ${part.name}")
        println(part.originalFileName)
        val fileContent: ByteReadChannel = part.provider()
        // ...
    }
}
```

#### 리소스 정리

폼 처리가 완료되면, 각 파트는 `.dispose()` 함수를 사용하여 리소스를 해제합니다.

```kotlin
part.dispose()
```

### 데이터 스트리밍 {id="streaming"}

`HttpResponse.body` 함수를 호출하여 본문을 얻을 때, Ktor는 응답을 메모리에서 처리하고 전체 응답 본문을 반환합니다. 전체 응답을 기다리는 대신 응답의 청크를 순차적으로 받아야 하는 경우, 스코프가 지정된 [execute](https://api.ktor.io/ktor-client-core/io.ktor.client.statement/-http-statement/execute.html) 블록과 함께 `HttpStatement`를 사용하세요.
아래 [실행 가능한 예제](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-streaming)는 응답 콘텐츠를 청크(바이트 패킷) 단위로 받아 파일에 저장하는 방법을 보여줍니다:

```kotlin
    val client = HttpClient(CIO)
    val file = File.createTempFile("files", "index")
    val stream = file.outputStream().asSink()
    val fileSize = 100 * 1024 * 1024
    val bufferSize = 1024 * 1024

    runBlocking {
        client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
            val channel: ByteReadChannel = httpResponse.body()
            var count = 0L
            stream.use {
                while (!channel.exhausted()) {
                    val chunk = channel.readRemaining(bufferSize)
                    count += chunk.remaining

                    chunk.transferTo(stream)
                    println("${httpResponse.contentLength()} 바이트 중 $count 바이트 수신")
                }
            }
        }

        println("파일이 ${file.path}에 저장되었습니다")
    }
```

> Ktor 채널과 `RawSink`, `RawSource`, `OutputStream` 같은 타입 간의 변환에 대해서는 [I/O 상호 운용성](io-interoperability.md)을 참조하세요.
>
{style="tip"}

이 예제에서는 [`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)이 데이터를 비동기적으로 읽는 데 사용됩니다. `ByteReadChannel.readRemaining()`을 사용하면 채널의 모든 사용 가능한 바이트를 가져오고, `Source.transferTo()`는 데이터를 파일에 직접 써서 불필요한 할당을 줄입니다.

추가 처리 없이 응답 본문을 파일에 저장하려면, 대신 [`ByteReadChannel.copyAndClose()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/copy-and-close.html) 함수를 사용할 수 있습니다:

```Kotlin
client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    channel.copyAndClose(file.writeChannel())
    println("파일이 ${file.path}에 저장되었습니다")
}