[//]: # (title: 요청 보내기)

<show-structure for="chapter" depth="2"/>

[percent_encoding]: https://en.wikipedia.org/wiki/Percent-encoding

<tldr>
<var name="example_name" value="client-configure-request"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
요청을 보내고 요청 URL, HTTP 메서드, 헤더, 요청 본문 등 다양한 요청 매개변수를 지정하는 방법을 알아봅니다.
</link-summary>

[클라이언트를 설정](client-create-and-configure.md)한 후 HTTP 요청을 보낼 수 있습니다. HTTP 요청을 보내는 주된 방법은 URL을 매개변수로 받을 수 있는 [request](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/request.html) 함수입니다. 이 함수 내부에서 다양한 요청 매개변수를 구성할 수 있습니다:
* `GET`, `POST`, `PUT`, `DELETE`, `HEAD`, `OPTIONS`, `PATCH`와 같은 HTTP 메서드를 지정합니다.
* URL을 문자열로 지정하거나 URL 구성 요소(도메인, 경로, 쿼리 매개변수 등)를 개별적으로 구성합니다.
* 헤더 및 쿠키를 추가합니다.
* 요청의 본문을 설정합니다. 예를 들어, 일반 텍스트, 데이터 객체 또는 폼 매개변수 등이 있습니다.

이러한 매개변수는 [HttpRequestBuilder](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html) 클래스에 의해 노출됩니다.

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*

val response: HttpResponse = client.request("https://ktor.io/") {
  // HttpRequestBuilder가 노출하는 요청 매개변수 구성
}
```
{interpolate-variables="true" disable-links="false"}

이 함수를 사용하면 `HttpResponse` 객체로 응답을 받을 수 있습니다. `HttpResponse`는 응답 본문을 다양한 방식으로(문자열, JSON 객체 등) 가져오고, 상태 코드, 콘텐츠 타입, 헤더 등과 같은 응답 매개변수를 얻는 데 필요한 API를 노출합니다. 더 자세한 내용은 [](client-responses.md) 토픽에서 알아볼 수 있습니다.

> `request`는 suspending 함수이므로 요청은 코루틴 또는 다른 suspend 함수 내에서만 실행되어야 합니다. suspending 함수 호출에 대한 자세한 내용은 [코루틴 기본 사항](https://kotlinlang.org/docs/coroutines-basics.html)에서 확인할 수 있습니다.

### HTTP 메서드 지정 {id="http-method"}

`request` 함수를 호출할 때 `method` 프로퍼티를 사용하여 원하는 HTTP 메서드를 지정할 수 있습니다:

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

val response: HttpResponse = client.request("https://ktor.io/") {
    method = HttpMethod.Get
}
```

`request` 함수 외에도 `HttpClient`는 기본 HTTP 메서드를 위한 특정 함수를 제공합니다: [get](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/get.html), [post](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/post.html), [put](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/put.html) 등. 예를 들어, 위의 요청을 다음 코드로 대체할 수 있습니다:
```kotlin
```
{src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="21"}

두 예제 모두에서 요청 URL은 문자열로 지정됩니다. [HttpRequestBuilder](#url)를 사용하여 URL 구성 요소를 개별적으로 구성할 수도 있습니다.

## 요청 URL 지정 {id="url"}

Ktor 클라이언트는 다음과 같은 방식으로 요청 URL을 구성할 수 있도록 합니다:

- _전체 URL 문자열 전달_
   
   ```kotlin
   ```
   {src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="21"}
   
- _URL 구성 요소 개별적으로 구성_
   
   ```kotlin
   ```
   {src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="22-28"}
   
   이 경우 `HttpRequestBuilder`가 노출하는 `url` 매개변수가 사용됩니다. 이 매개변수는 [URLBuilder](https://api.ktor.io/ktor-http/io.ktor.http/-u-r-l-builder/index.html)를 허용하며 URL을 구성하는 데 더 많은 유연성을 제공합니다.

> 모든 요청에 대한 기본 URL을 구성하려면 [DefaultRequest](client-default-request.md#url) 플러그인을 사용할 수 있습니다.

### 경로 세그먼트 {id="path_segments"}

이전 예제에서는 `URLBuilder.path` 프로퍼티를 사용하여 전체 URL 경로를 지정했습니다.
`appendPathSegments` 함수를 사용하여 개별 경로 세그먼트를 전달할 수도 있습니다.

```kotlin
```
{src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="29-33"}

`appendPathSegments`는 경로 세그먼트를 [인코딩][percent_encoding]합니다.
인코딩을 비활성화하려면 `appendEncodedPathSegments`를 사용합니다.

### 쿼리 매개변수 {id="query_parameters"}
<emphasis tooltip="query_string">쿼리 문자열</emphasis> 매개변수를 추가하려면 `URLBuilder.parameters` 프로퍼티를 사용합니다:

```kotlin
```
{src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="34-38"}

`parameters`는 쿼리 매개변수를 [인코딩][percent_encoding]합니다.
인코딩을 비활성화하려면 `encodedParameters`를 사용합니다.

> 쿼리 매개변수가 없더라도 `?` 문자를 유지하려면 `trailingQuery` 프로퍼티를 사용할 수 있습니다.

### URL 프래그먼트 {id="url-fragment"}

해시 마크 `#`는 URL 끝 부분에 선택적 프래그먼트를 도입합니다.
`fragment` 프로퍼티를 사용하여 URL 프래그먼트를 구성할 수 있습니다.

```kotlin
```
{src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="39-43"}

`fragment`는 URL 프래그먼트를 [인코딩][percent_encoding]합니다.
인코딩을 비활성화하려면 `encodedFragment`를 사용합니다.

## 요청 매개변수 설정 {id="parameters"}
이 섹션에서는 HTTP 메서드, 헤더, 쿠키를 포함한 다양한 요청 매개변수를 지정하는 방법을 살펴봅니다. 특정 클라이언트의 모든 요청에 대한 일부 기본 매개변수를 구성해야 하는 경우 [DefaultRequest](client-default-request.md) 플러그인을 사용합니다.

### 헤더 {id="headers"}

요청에 헤더를 추가하려면 다음 방법을 사용할 수 있습니다:
- [headers](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/headers.html) 함수는 여러 헤더를 한 번에 추가할 수 있도록 합니다:
   ```kotlin
   ```
  {src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="46-52"}
- [header](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/header.html) 함수는 단일 헤더를 추가할 수 있도록 합니다.
- `basicAuth` 및 `bearerAuth` 함수는 해당 HTTP 스키마와 함께 `Authorization` 헤더를 추가합니다.
   > 고급 인증 구성에 대해서는 [](client-auth.md)를 참조하십시오.

### 쿠키 {id="cookies"}
쿠키를 보내려면 [cookie](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/cookie.html) 함수를 사용합니다:

```kotlin
```
{src="snippets/client-configure-request/src/main/kotlin/com/example/Application.kt" include-lines="55-64"}

Ktor는 호출 간에 쿠키를 유지할 수 있도록 하는 [HttpCookies](client-cookies.md) 플러그인도 제공합니다. 이 플러그인이 설치된 경우 `cookie` 함수를 사용하여 추가된 쿠키는 무시됩니다.

## 요청 본문 설정 {id="body"}
요청의 본문을 설정하려면 [HttpRequestBuilder](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html)가 노출하는 `setBody` 함수를 호출해야 합니다. 이 함수는 일반 텍스트, 임의의 클래스 인스턴스, 폼 데이터, 바이트 배열 등 다양한 유형의 페이로드를 허용합니다. 아래에서 몇 가지 예시를 살펴보겠습니다.

### 텍스트 {id="text"}
일반 텍스트를 본문으로 보내는 방법은 다음과 같습니다:

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*

val response: HttpResponse = client.post("http://localhost:8080/post") {
    setBody("Body content")
}
```

### 객체 {id="objects"}
[ContentNegotiation](client-serialization.md) 플러그인이 활성화된 경우 요청 본문에 클래스 인스턴스를 JSON으로 보낼 수 있습니다. 이를 위해 `setBody` 함수에 클래스 인스턴스를 전달하고, [contentType](https://api.ktor.io/ktor-http/io.ktor.http/content-type.html) 함수를 사용하여 콘텐츠 타입을 `application/json`으로 설정합니다:

```kotlin
```
{src="snippets/client-json-kotlinx/src/main/kotlin/com/example/Application.kt" include-lines="33-36"}

더 자세한 내용은 [](client-serialization.md) 도움말 섹션에서 알아볼 수 있습니다.

### 폼 매개변수 {id="form_parameters"}

Ktor 클라이언트는 `application/x-www-form-urlencoded` 타입으로 폼 매개변수를 전송하기 위한 [`submitForm()`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request.forms/submit-form.html) 함수를 제공합니다. 다음 예시는 사용 방법을 보여줍니다:

* `url`은 요청을 보낼 URL을 지정합니다.
* `formParameters`는 `parameters`를 사용하여 빌드된 폼 매개변수 집합입니다.

```kotlin
```
{src="snippets/client-submit-form/src/main/kotlin/com/example/Application.kt" include-lines="16-25"}

전체 예시는 여기에서 찾을 수 있습니다: [client-submit-form](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-submit-form).

> URL로 인코딩된 폼 매개변수를 보내려면 `encodeInQuery`를 `true`로 설정합니다.

### 파일 업로드 {id="upload_file"}

폼과 함께 파일을 보내야 하는 경우 다음 접근 방식을 사용할 수 있습니다:

- [submitFormWithBinaryData](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request.forms/submit-form-with-binary-data.html) 함수를 사용합니다. 이 경우 경계(boundary)가 자동으로 생성됩니다.
- `post` 함수를 호출하고 [MultiPartFormDataContent](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request.forms/-multi-part-form-data-content/index.html) 인스턴스를 `setBody` 함수에 전달합니다. `MultiPartFormDataContent` 생성자도 경계(boundary) 값을 전달할 수 있습니다.

두 접근 방식 모두 [formData](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request.forms/form-data.html) 함수를 사용하여 폼 데이터를 빌드해야 합니다.

<tabs>

<tab title="submitFormWithBinaryData">

```kotlin
```
{src="snippets/client-upload/src/main/kotlin/com/example/Application.kt" include-lines="13-24"}

</tab>

<tab title="MultiPartFormDataContent">

```kotlin
```
{src="snippets/client-upload-progress/src/main/kotlin/com/example/Application.kt" include-lines="16-33"}

</tab>

</tabs>

`MultiPartFormDataContent`는 다음과 같이 경계(boundary)와 콘텐츠 타입을 재정의할 수도 있습니다:

```kotlin
```
{src="snippets/client-upload-progress/src/main/kotlin/com/example/Application.kt" include-lines="39-43"}

전체 예시는 여기에서 찾을 수 있습니다:
- [client-upload](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload)
- [client-upload-progress](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload-progress)

### 이진 데이터 {id="binary"}

`application/octet-stream` 콘텐츠 타입으로 이진 데이터를 보내려면 [ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html) 인스턴스를 `setBody` 함수에 전달합니다.
예를 들어, [File.readChannel](https://api.ktor.io/ktor-utils/io.ktor.util.cio/read-channel.html) 함수를 사용하여 파일의 읽기 채널을 열고 데이터를 채울 수 있습니다:

```kotlin
```
{src="snippets/client-upload-binary-data/src/main/kotlin/com/example/Application.kt" include-lines="14-16"}

전체 예시는 여기에서 찾을 수 있습니다: [client-upload-binary-data](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-upload-binary-data).

## 병렬 요청 {id="parallel_requests"}

두 개의 요청을 동시에 보낼 때, 클라이언트는 첫 번째 요청이 완료될 때까지 두 번째 요청 실행을 일시 중단합니다. 여러 요청을 동시에 수행해야 하는 경우 [launch](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html) 또는 [async](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/async.html) 함수를 사용할 수 있습니다. 아래 코드 스니펫은 두 개의 요청을 비동기적으로 수행하는 방법을 보여줍니다:
```kotlin
```
{src="snippets/client-parallel-requests/src/main/kotlin/com/example/Application.kt" include-lines="12,19-23,28"}

전체 예시를 보려면 [client-parallel-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-parallel-requests)로 이동하십시오.

## 요청 취소 {id="cancel-request"}

요청을 취소해야 하는 경우 해당 요청을 실행하는 코루틴을 취소할 수 있습니다. [launch](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/launch.html) 함수는 실행 중인 코루틴을 취소하는 데 사용할 수 있는 `Job`을 반환합니다:

```kotlin
import kotlinx.coroutines.*

val client = HttpClient(CIO)
val job = launch {
    val requestContent: String = client.get("http://localhost:8080")
}
job.cancel()
```

[취소 및 타임아웃](https://kotlinlang.org/docs/cancellation-and-timeouts.html)에서 더 자세히 알아보세요.