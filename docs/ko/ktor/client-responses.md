[//]: # (title: 응답 받기)

<show-structure for="chapter" depth="3"/>

<link-summary>
응답을 받는 방법, 응답 본문을 가져오는 방법 및 응답 매개변수를 얻는 방법에 대해 알아봅니다.
</link-summary>

[HTTP 요청을 만드는 데](client-requests.md) 사용되는 모든 함수(`request`, `get`, `post` 등)를 통해 응답을 [`HttpResponse`](https://api.ktor.io/ktor-client-core/io.ktor.client.statement/-http-response/index.html) 객체로 받을 수 있습니다.

`HttpResponse`는 다양한 방식(원시 바이트, JSON 객체 등)으로 [응답 본문](#body)을 가져오고, 상태 코드, 콘텐츠 유형, 헤더와 같은 [응답 매개변수](#parameters)를 얻는 데 필요한 API를 제공합니다.
예를 들어, 다음과 같은 방식으로 매개변수 없이 `GET` 요청에 대한 `HttpResponse`를 받을 수 있습니다:

```kotlin
val response: HttpResponse = client.get("https://ktor.io/docs/welcome.html")
```

## 응답 매개변수 받기 {id="parameters"}

[`HttpResponse`](https://api.ktor.io/ktor-client-core/io.ktor.client.statement/-http-response/index.html) 클래스를 사용하면 상태 코드, 헤더, HTTP 버전 등과 같은 다양한 응답 매개변수를 가져올 수 있습니다.

### 상태 코드 {id="status"}

응답의 상태 코드를 가져오려면 [`HttpResponse.status`](https://api.ktor.io/ktor-client-core/io.ktor.client.statement/-http-response/status.html) 속성을 사용하십시오:

```kotlin
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.*

val httpResponse: HttpResponse = client.get("https://ktor.io/")
if (httpResponse.status.value in 200..299) {
    println("Successful response!")
}
```

### 헤더 {id="headers"}

[`HttpResponse.headers`](https://api.ktor.io/ktor-client-core/io.ktor.client.statement/-http-response/index.html) 속성을 사용하면 모든 응답 헤더가 포함된 [`Headers`](https://api.ktor.io/ktor-http/io.ktor.http/-headers/index.html) 맵을 가져올 수 있습니다.

또한, `HttpResponse` 클래스는 특정 헤더 값을 받기 위해 다음과 같은 함수를 제공합니다:

* `contentType()`: `Content-Type` 헤더 값.
* `charset()`: `Content-Type` 헤더 값의 캐릭터셋(charset).
* `etag()`: `E-Tag` 헤더 값.
* `setCookie()`: `Set-Cookie` 헤더 값.
  > Ktor는 호출 간에 쿠키를 유지할 수 있는 [`HttpCookies`](client-cookies.md) 플러그인도 제공합니다.

#### 헤더 값 분리하기

헤더에 쉼표(,) 또는 세미콜론(;)으로 구분된 여러 값이 포함될 수 있는 경우, `.getSplitValues()` 함수를 사용하여 헤더에서 분리된 모든 값을 가져올 수 있습니다:

```kotlin
val httpResponse: HttpResponse = client.get("https://ktor.io/")
val headers: Headers = httpResponse.headers

val splitValues = headers.getSplitValues("X-Multi-Header")!!
// ["1", "2", "3"]
```

일반적인 `get` 연산자를 사용하면 값을 분리하지 않고 반환합니다:

```kotlin
val values = headers["X-Multi-Header"]!!
// ["1, 2", "3"]
```

## 응답 본문 받기 {id="body"}

### 원시 본문 {id="raw"}

응답의 원시 본문을 받으려면 `body` 함수를 호출하고 필요한 타입을 매개변수로 전달하십시오. 아래 코드 스니펫은 원시 본문을 [`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/)으로 받는 방법을 보여줍니다:

```kotlin
val httpResponse: HttpResponse = client.get("https://ktor.io/")
val stringBody: String = httpResponse.body()
```

마찬가지로, 본문을 [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/)로 가져올 수 있습니다:

```kotlin
val httpResponse: HttpResponse = client.get("https://ktor.io/")
val byteArrayBody: ByteArray = httpResponse.body()
```

아래의 [실행 가능한 예제](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-file)는 응답을 `ByteArray`로 가져와 파일로 저장하는 방법을 보여줍니다:

```kotlin
    val client = HttpClient()
    val file = File.createTempFile("files", "index")

    runBlocking {
        val httpResponse: HttpResponse = client.get("https://ktor.io/") {
            onDownload { bytesSentTotal, contentLength ->
                println("Received $bytesSentTotal bytes from $contentLength")
            }
        }
        val responseBody: ByteArray = httpResponse.body()
        file.writeBytes(responseBody)
        println("A file saved to ${file.path}")
    }
```

위 예제의 [`onDownload()`](https://api.ktor.io/ktor-client-core/io.ktor.client.plugins/on-download.html) 확장 함수는 다운로드 진행률을 표시하는 데 사용됩니다.

스트리밍이 아닌 요청의 경우, 응답 본문은 자동으로 로드되어 메모리에 캐시되므로 반복해서 액세스할 수 있습니다. 이는 작은 페이로드에는 효율적이지만, 큰 응답의 경우 높은 메모리 사용량을 초래할 수 있습니다.

큰 응답을 효율적으로 처리하려면 응답을 메모리에 저장하지 않고 점진적으로 처리하는 [스트리밍 방식](#streaming)을 사용하십시오.

### JSON 객체 {id="json"}

[ContentNegotiation](client-serialization.md) 플러그인이 설치되어 있으면 응답을 받을 때 JSON 데이터를 데이터 클래스로 역직렬화할 수 있습니다:

```kotlin
val customer: Customer = client.get("http://localhost:8080/customer/3").body()
```

자세한 내용은 [데이터 주고받기](client-serialization.md#receive_send_data)를 참조하십시오.

> ContentNegotiation 플러그인은 [클라이언트](client-serialization.md)와 [서버](server-serialization.md) 모두에서 사용할 수 있습니다. 상황에 맞는 적절한 플러그인을 사용해야 합니다.

### 멀티파트 폼 데이터 {id="multipart"}

멀티파트 폼 데이터가 포함된 응답을 받을 때, 본문을 [`MultiPartData`](https://api.ktor.io/ktor-http/io.ktor.http.content/-multi-part-data/index.html) 인스턴스로 읽을 수 있습니다. 이를 통해 응답에 포함된 폼 필드와 파일을 처리할 수 있습니다.

아래 예제는 멀티파트 응답에서 텍스트 폼 필드와 파일 업로드를 모두 처리하는 방법을 보여줍니다:

```kotlin
val response = client.post("https://myserver.com/multipart/receive")

val multipart = response.body<MultiPartData>()

multipart.forEachPart { part ->
    when (part) {
        is PartData.FormItem -> {
            println("Form item key: ${part.name}")
            val value = part.value
            // ...
        }
        is PartData.FileItem -> {
            println("file: ${part.name}")
            println(part.originalFileName)
            val fileContent: ByteReadChannel = part.provider()
            // ...
        }
    }
    part.dispose()
}
```

#### 폼 필드

`PartData.FormItem`은 폼 필드를 나타내며, `value` 속성을 통해 값에 액세스할 수 있습니다:

```kotlin
when (part) {
    is PartData.FormItem -> {
        println("Form item key: ${part.name}")
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
        println("file: ${part.name}")
        println(part.originalFileName)
        val fileContent: ByteReadChannel = part.provider()
        // ...
    }
}
```

#### 리소스 정리

폼 처리가 완료되면 자원을 해제하기 위해 `.dispose()` 함수를 사용하여 각 파트를 폐기합니다.

```kotlin
part.dispose()
```

### 스트리밍 데이터 {id="streaming"}

기본적으로 `HttpResponse.body()`를 호출하면 전체 응답이 메모리에 로드됩니다. 큰 응답이나 파일 다운로드의 경우, 전체 본문을 기다리지 않고 데이터를 청크 단위로 처리하는 것이 더 좋은 경우가 많습니다.

Ktor는 [`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html) 및 I/O 유틸리티를 사용하여 이를 수행하는 몇 가지 방법을 제공합니다.

#### 순차적 청크 처리

응답을 순차적으로 청크 단위로 처리하려면 스코프가 지정된 [`execute`](https://api.ktor.io/ktor-client-core/io.ktor.client.statement/-http-statement/execute.html) 블록과 함께 `HttpStatement`를 사용하십시오.

다음 예제는 응답을 청크 단위로 읽어 파일로 저장하는 방법을 보여줍니다:

```kotlin
    val client = HttpClient(CIO)
    val file = File.createTempFile("files", "index")
    val stream = file.outputStream().asSink()
    val fileSize = 100 * 1024 * 1024
    val bufferSize: Long = 1024 * 1024

    runBlocking {
        client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
            val channel: ByteReadChannel = httpResponse.body()
            var count = 0L
            stream.use {
                while (!channel.exhausted()) {
                    val chunk = channel.readRemaining(bufferSize)
                    count += chunk.remaining

                    chunk.transferTo(stream)
                    println("Received $count bytes from ${httpResponse.contentLength()}")
                }
            }
        }

        println("A file saved to ${file.path}")
    }
```

`ByteReadChannel.readRemaining()`을 사용하면 채널에서 사용 가능한 모든 바이트를 가져오며, `Source.transferTo()`는 데이터를 파일에 직접 써서 불필요한 할당을 줄입니다.

> 전체 스트리밍 예제는 [client-download-streaming](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-streaming)을 참조하십시오.

#### 응답을 파일에 직접 쓰기

청크 단위 처리가 필요하지 않은 단순 다운로드의 경우 다음 접근 방식 중 하나를 선택할 수 있습니다:

- [모든 바이트를 `ByteWriteChannel`로 복사하고 닫기](#copyAndClose).
- [`RawSink`로 복사하기](#readTo).

##### 모든 바이트를 `ByteWriteChannel`로 복사하고 닫기 {id="copyAndClose"}

[`ByteReadChannel.copyAndClose()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/copy-and-close.html) 함수는 `ByteReadChannel`의 남은 모든 바이트를 `ByteWriteChannel`로 복사한 다음 두 채널을 모두 자동으로 닫습니다:

```Kotlin
client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    channel.copyAndClose(file.writeChannel())
    println("A file saved to ${file.path}")
}
```

이는 채널을 수동으로 관리할 필요가 없는 전체 파일 다운로드에 편리합니다.

##### RawSink로 복사하기 {id="readTo"}

[`ByteReadChannel.readTo()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/read-to.html) 함수는 중간 버퍼 없이 바이트를 `RawSink`에 직접 씁니다:

```kotlin
val file = File.createTempFile("files", "index")
val stream = file.outputStream().asSink()

client.prepareGet(url).execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    channel.readTo(stream)
}
println("A file saved to ${file.path}")

```

`.copyAndClose()`와 달리 싱크는 쓰기 후에 열린 상태로 유지되며, 전송 중에 오류가 발생한 경우에만 자동으로 닫힙니다.

> Ktor 채널과 `RawSink`, `RawSource` 또는 `OutputStream`과 같은 타입 간의 변환에 대해서는 [I/O 상호 운용성](io-interoperability.md)을 참조하십시오.
>
{style="tip"}