[//]: # (title: 새로운 메모리 관리자로 마이그레이션)

> Kotlin 1.9.20부터 레거시 메모리 관리자 지원이 완전히 제거되었습니다. Kotlin 1.7.20부터 기본적으로 활성화된 현재 메모리 모델로 프로젝트를 마이그레이션하세요.
>
{style="note"}

이 가이드는 새로운 [Kotlin/Native 메모리 관리자](native-memory-manager.md)를 레거시 관리자와 비교하고 프로젝트 마이그레이션 방법을 설명합니다.

새로운 메모리 관리자에서 가장 눈에 띄는 변경 사항은 객체 공유에 대한 제한이 해제되었다는 것입니다. 객체를 스레드 간에 공유하기 위해 더 이상 고정(freeze)할 필요가 없으며, 구체적으로 다음과 같습니다:

*   최상위 프로퍼티는 `@SharedImmutable`을 사용하지 않고도 어떤 스레드에서든 접근하고 수정할 수 있습니다.
*   인터롭(interop)을 통해 전달되는 객체는 고정하지 않고도 어떤 스레드에서든 접근하고 수정할 수 있습니다.
*   `Worker.executeAfter`는 더 이상 작업이 고정될 것을 요구하지 않습니다.
*   `Worker.execute`는 더 이상 생산자가 격리된 객체 서브그래프를 반환할 것을 요구하지 않습니다.
*   `AtomicReference` 및 `FreezableAtomicReference`를 포함하는 참조 주기는 메모리 누수를 유발하지 않습니다.

손쉬운 객체 공유 외에도 새로운 메모리 관리자는 다른 주요 변경 사항도 제공합니다:

*   전역 프로퍼티는 해당 파일에 처음 접근할 때 지연 초기화됩니다. 이전에는 전역 프로퍼티가 프로그램 시작 시 초기화되었습니다. 이 문제를 해결하기 위해, 프로그램 시작 시 초기화되어야 하는 프로퍼티를 `@EagerInitialization` 애노테이션으로 마크할 수 있습니다. 사용하기 전에 [문서](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-eager-initialization/)를 확인하세요.
*   `by lazy {}` 프로퍼티는 스레드 안전 모드를 지원하며 무한 재귀를 처리하지 않습니다.
*   `Worker.executeAfter`의 `operation`에서 탈출하는 예외는 다른 런타임 부분과 동일하게 처리됩니다. 사용자 정의 처리되지 않은 예외 훅을 실행하려고 시도하거나, 훅을 찾을 수 없거나 훅 자체가 예외를 발생시킨 경우 프로그램을 종료합니다.
*   고정(Freezing)은 더 이상 사용되지 않으며 항상 비활성화됩니다.

레거시 메모리 관리자에서 프로젝트를 마이그레이션하려면 다음 지침을 따르세요:

## Kotlin 업데이트

새로운 Kotlin/Native 메모리 관리자는 Kotlin 1.7.20부터 기본적으로 활성화되었습니다. Kotlin 버전을 확인하고 필요한 경우 [최신 버전으로 업데이트](releases.md#update-to-a-new-kotlin-version)하세요.

## 의존성 업데이트

<deflist style="medium">
    <def title="kotlinx.coroutines">
        <p>버전 1.6.0 이상으로 업데이트하세요. <code>native-mt</code> 접미사가 있는 버전은 사용하지 마세요.</p>
        <p>새로운 메모리 관리자와 관련된 몇 가지 특이 사항도 염두에 두어야 합니다:</p>
        <list>
            <li>고정이 필요하지 않으므로 모든 공통 프리미티브(채널, 플로우, 코루틴)는 Worker 경계를 통해 작동합니다.</li>
            <li><code>Dispatchers.Default</code>는 Linux 및 Windows에서는 Worker 풀로 지원되고 Apple 대상에서는 전역 큐로 지원됩니다.</li>
            <li>Worker로 지원되는 코루틴 디스패처를 생성하려면 <code>newSingleThreadContext</code>를 사용하세요.</li>
            <li><code>N</code>개의 Worker 풀로 지원되는 코루틴 디스패처를 생성하려면 <code>newFixedThreadPoolContext</code>를 사용하세요.</li>
            <li><code>Dispatchers.Main</code>은 Darwin에서는 메인 큐로 지원되고 다른 플랫폼에서는 독립 Worker로 지원됩니다.</li>
        </list>
    </def>
    <def title="Ktor">
        버전 2.0 이상으로 업데이트하세요.
    </def>
    <def title="다른 의존성">
        <p>대부분의 라이브러리는 변경 없이 작동해야 하지만, 예외가 있을 수 있습니다.</p>
        <p>의존성을 최신 버전으로 업데이트하고, 레거시 및 새로운 메모리 관리자를 위한 라이브러리 버전 간에 차이가 없는지 확인하세요.</p>
    </def>
</deflist>

## 코드 업데이트

새로운 메모리 관리자를 지원하려면 영향받는 API 사용을 제거하세요:

| 이전 API                                                                                                                                     | 수행할 작업                                                                                                                                                   |
|--------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [`@SharedImmutable`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-shared-immutable/)                             | 모든 사용을 제거할 수 있지만, 새로운 메모리 관리자에서 이 API를 사용해도 경고는 없습니다.                                                                        |
| [`FreezableAtomicReference` 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezable-atomic-reference/) | 대신 [`AtomicReference`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-atomic-reference/)를 사용하세요.                               |
| [`FreezingException` 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-freezing-exception/)       | 모든 사용을 제거하세요.                                                                                                                                         |
| [`InvalidMutabilityException` 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-invalid-mutability-exception/) | 모든 사용을 제거하세요.                                                                                                                                         |
| [`IncorrectDereferenceException` 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native/-incorrect-dereference-exception/) | 모든 사용을 제거하세요.                                                                                                                                         |
| [`freeze()` 함수](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/freeze.html)                          | 모든 사용을 제거하세요.                                                                                                                                         |
| [`isFrozen` 프로퍼티](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/is-frozen.html)                     | 모든 [//]: # (title: Custom client plugins)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="client-custom-plugin"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
Learn how to create your own custom client plugin.
</link-summary>

Starting with v2.2.0, Ktor provides a new API for creating custom client [plugins](client-plugins.md). In general, this API doesn't require an understanding of internal Ktor concepts, such as pipelines, phases, and so on.
Instead, you have access to different stages of [handling requests and responses](#call-handling) using a set of handlers, such as `onRequest`, `onResponse`, and so on.


## Create and install your first plugin {id="first-plugin"}

In this section, we'll demonstrate how to create and install your first plugin that adds a custom header
to each [request](client-requests.md):

1. To create a plugin, call the [createClientPlugin](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.api/create-client-plugin.html) function and pass a plugin name as an argument:
   ```kotlin
   package com.example.plugins
   
   import io.ktor.client.plugins.api.*
   
   val CustomHeaderPlugin = createClientPlugin("CustomHeaderPlugin") {
       // Configure the plugin ...
   }
   ```

   This function returns the `ClientPlugin` instance that will be used to install the plugin.

2. To append a custom header to each request, you can use the `onRequest` handler,
   which provides access to request parameters:
   ```kotlin
   ```
   {src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeader.kt"}

3. To [install the plugin](client-plugins.md#install), pass the created `ClientPlugin` instance to the `install` function inside the client's configuration block:
   ```kotlin
   import com.example.plugins.*
   
   val client = HttpClient(CIO) {
       install(CustomHeaderPlugin)
   }
   ```


You can find the full example here: [CustomHeader.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeader.kt).
In the following sections, we'll look at how to provide a plugin configuration and handle requests and responses.


## Provide plugin configuration {id="plugin-configuration"}

The [previous section](#first-plugin) demonstrates how to create a plugin that appends a predefined custom header to each response. Let's make this plugin more useful and provide a configuration for passing any custom header name and value:

1. First, you need to define a configuration class:

   ```kotlin
   ```
   {src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderConfigurable.kt" include-lines="14-17"}

2. To use this configuration in a plugin, pass a configuration class reference to `createApplicationPlugin`:

   ```kotlin
   ```
   {src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderConfigurable.kt" include-lines="3-12"}

   Given that plugin configuration fields are mutable, saving them in local variables is recommended.

3. Finally, you can install and configure the plugin as follows:

   ```kotlin
   ```
   {src="snippets/client-custom-plugin/src/main/kotlin/com/example/Application.kt" include-lines="11-15,18"}

> You can find the full example here: [CustomHeaderConfigurable.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderConfigurable.kt).



## Handle requests and responses {id="call-handling"}

Custom plugins provide access to different stages of handling requests and responses
using a set of dedicated handlers, for example:
- `onRequest` and `onResponse` allow you to handle requests and responses, respectively.
- `transformRequestBody` and `transformResponseBody` can be used to apply necessary transformations to
  request and response bodies.

There is also the `on(...)` handler that allows you to invoke specific hooks that might be useful to handle other stages of a call.
The tables below list all handlers in the order they are executed:

<tabs>
<tab title="Basic hooks">

<table>
<tr>
<td>
Handler
</td>
<td>
Description
</td>
</tr>

<include from="client-custom-plugins.md" element-id="onRequest"/>
<include from="client-custom-plugins.md" element-id="transformRequestBody"/>
<include from="client-custom-plugins.md" element-id="onResponse"/>
<include from="client-custom-plugins.md" element-id="transformResponseBody"/>
<include from="client-custom-plugins.md" element-id="onClose"/>

</table>

</tab>
<tab title="All hooks">

<table>
<tr>
<td>
Handler
</td>
<td>
Description
</td>
</tr>

<tr>
<td>
<code>on(SetupRequest)</code>
</td>
<td>
The <code>SetupRequest</code> hook is executed first in request processing.
</td>
</tr>

<snippet id="onRequest">
<tr>
<td>
<code>onRequest</code>
</td>
<td>
<p>
This handler is executed for each HTTP <a href="client-requests.md">request</a> and allows you to modify it.
</p>
<p>
<emphasis>
Example: <a anchor="example-custom-header"/>
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
Allows you to transform a <a href="client-requests.md" anchor="body">request body</a>.
In this handler, you need to serialize the body into 
<a href="https://api.ktor.io/ktor-http/io.ktor.http.content/-outgoing-content/index.html">OutgoingContent</a> 
(for example, <code>TextContent</code>, <code>ByteArrayContent</code>, or <code>FormDataContent</code>)
or return <code>null</code> if your transformation is not applicable.
</p>
<p>
<emphasis>
Example: <a anchor="data-transformation"/>
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
The <code>Send</code> hook provides the ability to inspect a response and initiate additional requests if needed. 
This might be useful for handling redirects, retrying requests, authentication, and so on.
</p>
<p>
<emphasis>
Example: <a anchor="authentication"/>
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
The <code>SendingRequest</code> hook is executed for every request, 
even if it's not initiated by a user.
For example, if a request results in a redirect, the <code>onRequest</code> handler will be executed only 
for the original request, while <code>on(SendingRequest)</code> will be executed for both original and redirected requests.
Similarly, if you used <code>on(Send)</code> to initiate an additional request,
handlers will be ordered as follows:
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
Examples: <a anchor="example-log-headers"/>, <a anchor="example-response-time"/>
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
This handler is executed for each incoming HTTP <a href="client-requests.md">response</a> and allows you to 
inspect it in various ways: log a response, save cookies, and so on.
</p>
<p>
<emphasis>
Examples: <a anchor="example-log-headers"/>, <a anchor="example-response-time"/>
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
Allows you to transform a <a href="client-responses.md" anchor="body">response body</a>.
This handler is invoked for each <code>HttpResponse.body</code> call.
You need to deserialize the body into an instance of <code>requestedType</code> 
or return <code>null</code> if your transformation is not applicable.
</p>
<p>
<emphasis>
Example: <a anchor="data-transformation"/>
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
Allows you to clean resources allocated by this plugin.
This handler is called when the client is <a href="client-create-and-configure.md" anchor="close-client">closed</a>.
</td>
</tr>
</snippet>

</table>

</tab>
</tabs>


### Share call state {id="call-state"}

Custom plugins allow you to share any value related to a call
so that you can access this value inside any handler processing this call.
This value is stored as an attribute with a unique key in the `call.attributes` collection.
The example below demonstrates how to use attributes to calculate the time between sending a request and receiving a response:

```kotlin
```
{src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/ResponseTime.kt" include-lines="3-18"}

You can find the full example here: [ResponseTime.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/ResponseTime.kt).




## Access client configuration {id="client-config"}

You can access your client configuration using the `client` property, which returns the [HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) instance.
The example below shows how to get the [proxy address](client-proxy.md) used by the client:

```kotlin
import io.ktor.client.plugins.api.*

val SimplePlugin = createClientPlugin("SimplePlugin") {
    val proxyAddress = client.engineConfig.proxy?.address()
    println("Proxy address: $proxyAddress")
}
```

## Examples {id="examples"}

The code samples below demonstrate several examples of custom plugins.
You can find the resulting project here: [client-custom-plugin](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/).

### Custom header {id="example-custom-header"}

Shows how to create a plugin that adds a custom header to each request:

```kotlin
```
{src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderConfigurable.kt"}

### Logging headers {id="example-log-headers"}

Demonstrates how to create a plugin that logs request and response headers:

```kotlin
```
{src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/LoggingHeaders.kt"}


### Response time {id="example-response-time"}

Shows how to create a plugin that measures the time between sending a request and receiving a response:

```kotlin
```
{src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/ResponseTime.kt"}


### Data transformation {id="data-transformation"}

Shows how to transform request and response bodies using the `transformRequestBody` and `transformResponseBody` hooks:

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

You can find the full example here: [client-custom-plugin-data-transformation](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-custom-plugin-data-transformation).


### Authentication {id="authentication"}

A sample Ktor project showing how to use the `on(Send)` hook to add a bearer token to the `Authorization` header if an unauthorized response is received from the server:

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

You can find the full example here: [client-custom-plugin-auth](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-custom-plugin-auth).사용을 제거할 수 있습니다. 고정이 사용 중단되었으므로, 이 프로퍼티는 항상 <code>false</code>를 반환합니다.                                                     |
| [`ensureNeverFrozen()` 함수](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/ensure-never-frozen.html) | 모든 사용을 제거하세요.                                                                                                                                         |
| [`atomicLazy()` 함수](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/atomic-lazy.html)                 | 대신 [`lazy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/lazy.html)를 사용하세요.                                                                    |
| [`MutableData` 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-mutable-data/)                     | 대신 일반 컬렉션을 사용하세요.                                                                                                                                  |
| [`WorkerBoundReference<out T : Any>` 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-worker-bound-reference/) | <code>T</code>를 직접 사용하세요.                                                                                                                               |
| [`DetachedObjectGraph<T>` 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.native.concurrent/-detached-object-graph/) | <code>T</code>를 직접 사용하세요. C 인터롭(interop)을 통해 값을 전달하려면 [<code>StableRef</code> 클래스](https://kotlinlang.org/api/latest/jvm/stdlib/kotlinx.cinterop/-stable-ref/)를 사용하세요. |

## 다음 단계

*   [새로운 메모리 관리자에 대해 자세히 알아보기](native-memory-manager.md)
*   [Swift/Objective-C ARC와의 통합 세부 정보 확인](native-arc-integration.md)
*   [다른 코루틴에서 객체를 안전하게 참조하는 방법 알아보기](native-faq.md#how-do-i-reference-objects-safely-from-different-coroutines)