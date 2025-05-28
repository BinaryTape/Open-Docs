[//]: # (title: 응답 수신하기)

<show-structure for="chapter" depth="2"/>

<link-summary>
응답을 수신하고, 응답 본문을 가져오며, 응답 파라미터를 얻는 방법을 알아보세요.
</link-summary>

[HTTP 요청을 보내는](client-requests.md) 데 사용되는 모든 함수(`request`, `get`, `post` 등)는
[`HttpResponse`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html) 객체로
응답을 수신할 수 있도록 합니다.

`HttpResponse`는 다양한 방법(원시 바이트(raw bytes), JSON 객체 등)으로 [응답 본문](#body)을 가져오고, 상태 코드(status code),
콘텐츠 타입(content type), 헤더(headers)와 같은 [응답 파라미터](#parameters)를 얻는 데 필요한 API를 노출합니다.
예를 들어, 파라미터 없는 `GET` 요청에 대한 `HttpResponse`를 다음과 같이 수신할 수 있습니다:

```kotlin
```
{src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="21"}

## 응답 파라미터 수신하기 {id="parameters"}

[`HttpResponse`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html) 클래스를 사용하면
상태 코드, 헤더, HTTP 버전 등 다양한 응답 파라미터를 얻을 수 있습니다.

### 상태 코드 {id="status"}

응답의 상태 코드를 얻으려면
[`HttpResponse.status`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/status.html) 프로퍼티를 사용하세요:

```kotlin
```

{src="snippets/_misc_client/ResponseTypes.kt" include-lines="1-4,9,11,15-17"}

### 헤더 {id="headers"}

[`HttpResponse.headers`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-response/index.html) 프로퍼티를 사용하면
모든 응답 헤더를 포함하는 [Headers](https://api.ktor.io/ktor-http/io.ktor.http/-headers/index.html) 맵을 얻을 수 있습니다.
또한 `HttpResponse`는 특정 헤더 값을 수신하기 위한 다음 함수들을 노출합니다:

*   `contentType`: `Content-Type` 헤더 값
*   `charset`: `Content-Type` 헤더 값의 문자 집합
*   `etag`: `E-Tag` 헤더 값
*   `setCookie`: `Set-Cookie` 헤더 값
  > Ktor는 호출 간에 쿠키를 유지할 수 있는 [HttpCookies](client-cookies.md) 플러그인도 제공합니다.

## 응답 본문 수신하기 {id="body"}

### 원시 본문 {id="raw"}

응답의 원시(raw) 본문을 수신하려면 `body` 함수를 호출하고 필요한 타입을 파라미터로 전달하세요.
아래 코드 스니펫은 [`String`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/)으로 원시 본문을 수신하는 방법을 보여줍니다:

```kotlin
```
{src="snippets/_misc_client/ResponseTypes.kt" include-lines="11,12"}

마찬가지로, [`ByteArray`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-byte-array/)로 본문을 얻을 수 있습니다:

```kotlin
```
{src="snippets/_misc_client/ResponseTypes.kt" include-lines="11,13"}

아래 [실행 가능한 예시](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-file)는
`ByteArray`로 응답을 얻고 파일에 저장하는 방법을 보여줍니다:

```kotlin
```
{src="snippets/client-download-file/src/main/kotlin/com/example/Downloader.kt" include-lines="12-24"}

위 예시의 [`onDownload()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/on-download.html) 확장 함수는
다운로드 진행률을 표시하는 데 사용됩니다.

이 접근 방식은 전체 응답을 한 번에 메모리로 로드하므로, 대용량 파일의 경우 문제가 될 수 있습니다.
메모리 사용량을 줄이려면 [데이터를 청크(chunk)로 스트리밍](#streaming)하는 것을 고려하세요.

### JSON 객체 {id="json"}

[ContentNegotiation](client-serialization.md) 플러그인이 설치된 경우, 응답을 수신할 때 JSON 데이터를 데이터 클래스로 역직렬화(deserialize)할 수 있습니다:

```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="39"}

더 자세한 내용은 [](client-serialization.md#receive_send_data)를 참조하세요.

> ContentNegotiation 플러그인은 [클라이언트(client)](client-serialization.md)와 [서버(server)](server-serialization.md) 모두에서 사용할 수 있습니다.
> 귀하의 사용 사례에 적절한 플러그인을 사용하세요.

### 데이터 스트리밍 {id="streaming"}

`HttpResponse.body` 함수를 호출하여 본문을 얻을 때, Ktor는 응답을 메모리에서 처리하고 전체 응답 본문을 반환합니다.
전체 응답을 기다리지 않고 응답의 청크를 순차적으로 얻어야 하는 경우,
스코프가 지정된 [`execute`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.statement/-http-statement/execute.html) 블록과 함께 `HttpStatement`를 사용하세요.
아래 [실행 가능한 예시](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-streaming)는
응답 콘텐츠를 청크(바이트 패킷)로 수신하고 파일에 저장하는 방법을 보여줍니다:

```kotlin
```
{src="snippets/client-download-streaming/src/main/kotlin/com/example/Application.kt" include-lines="15-36"}

이 예시에서는 [`ByteReadChannel`](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html)이 데이터를 비동기적으로 읽는 데 사용됩니다.
`ByteReadChannel.readRemaining()`을 사용하면 채널의 모든 가용 바이트를 검색하는 반면,
`Source.transferTo()`는 데이터를 파일에 직접 작성하여 불필요한 할당을 줄입니다.

추가 처리 없이 응답 본문을 파일에 저장하려면 대신
[`ByteReadChannel.copyAndClose()`](https://api.ktor.io/ktor-io/io.ktor.utils.io/copy-and-close.html) 함수를 사용할 수 있습니다:

```Kotlin
client.prepareGet("https://httpbin.org/bytes/$fileSize").execute { httpResponse ->
    val channel: ByteReadChannel = httpResponse.body()
    channel.copyAndClose(file.writeChannel())
    println("A file saved to ${file.path}")
}