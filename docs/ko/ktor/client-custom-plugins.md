[//]: # (title: 사용자 지정 클라이언트 플러그인)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="client-custom-plugin"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
자신만의 사용자 지정 클라이언트 플러그인을 생성하는 방법을 알아보세요.
</link-summary>

v2.2.0부터 Ktor는 사용자 지정 클라이언트 [플러그인](client-plugins.md)을 생성하기 위한 새로운 API를 제공합니다. 일반적으로 이 API는 파이프라인, 페이즈 등과 같은 내부 Ktor 개념에 대한 이해를 요구하지 않습니다.
대신, `onRequest`, `onResponse` 등과 같은 핸들러 집합을 사용하여 [요청 및 응답 처리](#call-handling)의 다양한 단계에 접근할 수 있습니다.

## 첫 번째 플러그인 생성 및 설치 {id="first-plugin"}

이 섹션에서는 각 [요청](client-requests.md)에 사용자 지정 헤더를 추가하는 첫 번째 플러그인을 생성하고 설치하는 방법을 시연합니다:

1. 플러그인을 생성하려면 [createClientPlugin](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.api/create-client-plugin.html) 함수를 호출하고 플러그인 이름을 인수로 전달하세요.
   ```kotlin
   package com.example.plugins
   
   import io.ktor.client.plugins.api.*
   
   val CustomHeaderPlugin = createClientPlugin("CustomHeaderPlugin") {
       // Configure the plugin ...
   }
   ```
   
   이 함수는 플러그인을 설치하는 데 사용될 `ClientPlugin` 인스턴스를 반환합니다.

2. 각 요청에 사용자 지정 헤더를 추가하려면 요청 매개변수에 대한 접근을 제공하는 `onRequest` 핸들러를 사용할 수 있습니다.
   ```kotlin
   ```
   {src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeader.kt"}

3. [플러그인을 설치하려면](client-plugins.md#install), 생성된 `ClientPlugin` 인스턴스를 클라이언트의 설정 블록 내 `install` 함수에 전달하세요.
   ```kotlin
   import com.example.plugins.*
   
   val client = HttpClient(CIO) {
       install(CustomHeaderPlugin)
   }
   ```
   
   
전체 예시는 [CustomHeader.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeader.kt)에서 찾을 수 있습니다.
다음 섹션에서는 플러그인 설정을 제공하고 요청 및 응답을 처리하는 방법을 살펴보겠습니다.

## 플러그인 설정 제공 {id="plugin-configuration"}

[이전 섹션](#first-plugin)에서는 각 응답에 미리 정의된 사용자 지정 헤더를 추가하는 플러그인을 생성하는 방법을 시연했습니다. 이 플러그인을 더 유용하게 만들고 모든 사용자 지정 헤더 이름과 값을 전달하기 위한 설정을 제공해 봅시다.

1. 먼저 설정 클래스를 정의해야 합니다.

   ```kotlin
   ```
   {src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderConfigurable.kt" include-lines="14-17"}

2. 플러그인에서 이 설정을 사용하려면 `createApplicationPlugin`에 설정 클래스 참조를 전달하세요.

   ```kotlin
   ```
   {src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderConfigurable.kt" include-lines="3-12"}

   플러그인 설정 필드가 변경 가능하므로 로컬 변수에 저장하는 것이 권장됩니다.

3. 마지막으로, 다음과 같이 플러그인을 설치하고 설정할 수 있습니다.

   ```kotlin
   ```
   {src="snippets/client-custom-plugin/src/main/kotlin/com/example/Application.kt" include-lines="11-15,18"}

> 전체 예시는 [CustomHeaderConfigurable.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderConfigurable.kt)에서 찾을 수 있습니다.

## 요청 및 응답 처리 {id="call-handling"}

사용자 지정 플러그인은 전용 핸들러 집합을 사용하여 요청 및 응답 처리의 다양한 단계에 접근할 수 있습니다. 예를 들면 다음과 같습니다:
- `onRequest`와 `onResponse`는 각각 요청과 응답을 처리할 수 있도록 해줍니다.
- `transformRequestBody`와 `transformResponseBody`는 요청 및 응답 본문에 필요한 변환을 적용하는 데 사용할 수 있습니다.

`on(...)` 핸들러도 있는데, 이는 호출의 다른 단계를 처리하는 데 유용할 수 있는 특정 훅(hook)을 호출할 수 있도록 해줍니다.
아래 표는 실행 순서대로 모든 핸들러를 나열합니다:

<tabs>
<tab title="기본 훅">

<table>
<tr>
<td>
핸들러
</td>
<td>
설명
</td>
</tr>

<include from="client-custom-plugins.md" element-id="onRequest"/>
<include from="client-custom-plugins.md" element-id="transformRequestBody"/>
<include from="client-custom-plugins.md" element-id="onResponse"/>
<include from="client-custom-plugins.md" element-id="transformResponseBody"/>
<include from="client-custom-plugins.md" element-id="onClose"/>

</table>

</tab>
<tab title="모든 훅">

<table>
<tr>
<td>
핸들러
</td>
<td>
설명
</td>
</tr>

<tr>
<td>
<code>on(SetupRequest)</code>
</td>
<td>
<code>SetupRequest</code> 훅은 요청 처리에서 가장 먼저 실행됩니다.
</td>
</tr>

<snippet id="onRequest">
<tr>
<td>
<code>onRequest</code>
</td>
<td>
<p>
이 핸들러는 각 HTTP <a href="client-requests.md">요청</a>에 대해 실행되며 요청을 수정할 수 있도록 해줍니다.
</p>
<p>
<emphasis>
예시: <a anchor="example-custom-header"/>
</emphasis>
</p>
</td>
</tr>
</snippet>

<snippet id="transformRequestBody">
<tr>
<td>
<code>transformRequestBody</code>
</td>
<td>
<p>
<a href="client-requests.md" anchor="body">요청 본문</a>을 변환할 수 있도록 해줍니다.
이 핸들러에서는 본문을
<a href="https://api.ktor.io/ktor-http/io.ktor.http.content/-outgoing-content/index.html">OutgoingContent</a>
(예: <code>TextContent</code>, <code>ByteArrayContent</code>, 또는 <code>FormDataContent</code>)
로 직렬화하거나 변환이 적용되지 않으면 <code>null</code>을 반환해야 합니다.
</p>
<p>
<emphasis>
예시: <a anchor="data-transformation"/>
</emphasis>
</p>
</td>
</tr>
</snippet>

<tr>
<td>
<code>on(Send)</code>
</td>
<td>
<p>
<code>Send</code> 훅은 응답을 검사하고 필요한 경우 추가 요청을 시작할 수 있는 기능을 제공합니다.
이는 리디렉션 처리, 요청 재시도, 인증 등에 유용할 수 있습니다.
</p>
<p>
<emphasis>
예시: <a anchor="authentication"/>
</emphasis>
</p>
</td>
</tr>

<tr>
<td>
<code>on(SendingRequest)</code>
</td>
<td>
<p>
<code>SendingRequest</code> 훅은 사용자가 시작하지 않은 경우에도 모든 요청에 대해 실행됩니다.
예를 들어, 요청이 리디렉션을 유발하는 경우 <code>onRequest</code> 핸들러는 원래 요청에 대해서만 실행되지만, <code>on(SendingRequest)</code>는 원래 요청과 리디렉션된 요청 모두에 대해 실행됩니다.
마찬가지로, <code>on(Send)</code>를 사용하여 추가 요청을 시작한 경우, 핸들러는 다음 순서로 정렬됩니다:
</p>

```Console
--> onRequest
--> on(Send)
--> on(SendingRequest)
<-- onResponse
--> on(SendingRequest)
<-- onResponse
```

<p>
<emphasis>
예시: <a anchor="example-log-headers"/>, <a anchor="example-response-time"/>
</emphasis>
</p>
</td>
</tr>

<snippet id="onResponse">
<tr>
<td>
<code>onResponse</code>
</td>
<td>
<p>
이 핸들러는 들어오는 각 HTTP <a href="client-requests.md">응답</a>에 대해 실행되며 응답을 다양한 방식으로 검사할 수 있도록 해줍니다: 응답 로깅, 쿠키 저장 등.
</p>
<p>
<emphasis>
예시: <a anchor="example-log-headers"/>, <a anchor="example-response-time"/>
</emphasis>
</p>
</td>
</tr>
</snippet>

<snippet id="transformResponseBody">
<tr>
<td>
<code>transformResponseBody</code>
</td>
<td>
<p>
<a href="client-responses.md" anchor="body">응답 본문</a>을 변환할 수 있도록 해줍니다.
이 핸들러는 각 <code>HttpResponse.body</code> 호출에 대해 호출됩니다.
본문을 <code>requestedType</code>의 인스턴스로 역직렬화하거나 변환이 적용되지 않으면 <code>null</code>을 반환해야 합니다.
</p>
<p>
<emphasis>
예시: <a anchor="data-transformation"/>
</emphasis>
</p>
</td>
</tr>
</snippet>

<snippet id="onClose">
<tr>
<td>
<code>onClose</code>
</td>
<td>
이 플러그인에 의해 할당된 리소스를 정리할 수 있도록 해줍니다.
이 핸들러는 클라이언트가 [닫힐](client-create-and-configure.md#close-client) 때 호출됩니다.
</td>
</tr>
</snippet>

</table>

</tab>
</tabs>

### 호출 상태 공유 {id="call-state"}

사용자 지정 플러그인은 호출과 관련된 모든 값을 공유하여, 이 호출을 처리하는 모든 핸들러 내에서 이 값에 접근할 수 있도록 해줍니다. 이 값은 `call.attributes` 컬렉션에 고유 키를 가진 속성으로 저장됩니다. 아래 예시는 요청을 보내고 응답을 받는 시간 간격을 계산하기 위해 속성을 사용하는 방법을 보여줍니다.

```kotlin
```
{src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/ResponseTime.kt" include-lines="3-18"}

전체 예시는 [ResponseTime.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/ResponseTime.kt)에서 찾을 수 있습니다.

## 클라이언트 설정 접근 {id="client-config"}

`HttpClient` 인스턴스를 반환하는 `client` 속성을 사용하여 클라이언트 설정에 접근할 수 있습니다. 아래 예시는 클라이언트가 사용하는 [프록시 주소](client-proxy.md)를 얻는 방법을 보여줍니다.

```kotlin
import io.ktor.client.plugins.api.*

val SimplePlugin = createClientPlugin("SimplePlugin") {
    val proxyAddress = client.engineConfig.proxy?.address()
    println("프록시 주소: $proxyAddress")
}
```

## 예시 {id="examples"}

아래 코드 샘플은 사용자 지정 플러그인의 몇 가지 예시를 보여줍니다. 결과 프로젝트는 [client-custom-plugin](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/)에서 찾을 수 있습니다.

### 사용자 지정 헤더 {id="example-custom-header"}

각 요청에 사용자 지정 헤더를 추가하는 플러그인을 생성하는 방법을 보여줍니다.

```kotlin
```
{src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderConfigurable.kt"}

### 헤더 로깅 {id="example-log-headers"}

요청 및 응답 헤더를 로깅하는 플러그인을 생성하는 방법을 시연합니다.

```kotlin
```
{src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/LoggingHeaders.kt"}

### 응답 시간 {id="example-response-time"}

요청을 보내고 응답을 받는 시간 간격을 측정하는 플러그인을 생성하는 방법을 보여줍니다.

```kotlin
```
{src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/ResponseTime.kt"}

### 데이터 변환 {id="data-transformation"}

`transformRequestBody` 및 `transformResponseBody` 훅을 사용하여 요청 및 응답 본문을 변환하는 방법을 보여줍니다.

<tabs>
<tab title="DataTransformation.kt">

```kotlin
```
{src="snippets/client-custom-plugin-data-transformation/src/main/kotlin/com/example/plugins/DataTransformation.kt"}

</tab>
<tab title="Application.kt">

```kotlin
```
{src="snippets/client-custom-plugin-data-transformation/src/main/kotlin/com/example/Application.kt"}

</tab>
<tab title="User.kt">

```kotlin
```
{src="snippets/client-custom-plugin-data-transformation/src/main/kotlin/com/example/model/User.kt"}

</tab>
</tabs>

전체 예시는 [client-custom-plugin-data-transformation](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-custom-plugin-data-transformation)에서 찾을 수 있습니다.

### 인증 {id="authentication"}

서버로부터 권한 없는 응답을 받은 경우 `on(Send)` 훅을 사용하여 `Authorization` 헤더에 베어러 토큰을 추가하는 방법을 보여주는 샘플 Ktor 프로젝트입니다.

<tabs>
<tab title="Auth.kt">

```kotlin
```
{src="snippets/client-custom-plugin-auth/src/main/kotlin/com/example/plugins/Auth.kt"}

</tab>
<tab title="Application.kt">

```kotlin
```
{src="snippets/client-custom-plugin-auth/src/main/kotlin/com/example/Application.kt"}

</tab>
</tabs>

전체 예시는 [client-custom-plugin-auth](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-custom-plugin-auth)에서 찾을 수 있습니다.