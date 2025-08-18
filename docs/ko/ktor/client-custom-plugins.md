[//]: # (title: 사용자 지정 클라이언트 플러그인)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="client-custom-plugin"/>
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
사용자 지정 클라이언트 플러그인을 만드는 방법을 알아보세요.
</link-summary>

v2.2.0부터 Ktor는 사용자 지정 클라이언트 [플러그인](client-plugins.md)을 생성하기 위한 새로운 API를 제공합니다. 일반적으로 이 API는 파이프라인, 페이즈 등 내부 Ktor 개념에 대한 이해를 요구하지 않습니다. 대신 `onRequest`, `onResponse` 등과 같은 핸들러 세트를 사용하여 [요청 및 응답 처리](#call-handling)의 다양한 단계에 접근할 수 있습니다.

## 첫 번째 플러그인 생성 및 설치 {id="first-plugin"}

이 섹션에서는 각 [요청](client-requests.md)에 사용자 지정 헤더를 추가하는 첫 번째 플러그인을 생성하고 설치하는 방법을 보여줍니다.

1.  플러그인을 생성하려면 [createClientPlugin](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.api/create-client-plugin.html) 함수를 호출하고 플러그인 이름을 인수로 전달합니다.
    ```kotlin
    package com.example.plugins
    
    import io.ktor.client.plugins.api.*
    
    val CustomHeaderPlugin = createClientPlugin("CustomHeaderPlugin") {
        // Configure the plugin ...
    }
    ```
    이 함수는 플러그인 설치에 사용될 `ClientPlugin` 인스턴스를 반환합니다.

2.  각 요청에 사용자 지정 헤더를 추가하려면 요청 파라미터에 접근할 수 있는 `onRequest` 핸들러를 사용할 수 있습니다.
    ```kotlin
    package com.example.plugins
    
    import io.ktor.client.plugins.api.*
    
    val CustomHeaderPlugin = createClientPlugin("CustomHeaderPlugin") {
        onRequest { request, _ ->
            request.headers.append("X-Custom-Header", "Default value")
        }
    }
    
    ```

3.  [플러그인](client-plugins.md#install)을 설치하려면 생성된 `ClientPlugin` 인스턴스를 클라이언트의 구성 블록 내 `install` 함수에 전달합니다.
    ```kotlin
    import com.example.plugins.*
    
    val client = HttpClient(CIO) {
        install(CustomHeaderPlugin)
    }
    ```
    
    
전체 예시는 다음에서 찾을 수 있습니다: [CustomHeader.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeader.kt). 다음 섹션에서는 플러그인 구성을 제공하고 요청 및 응답을 처리하는 방법을 살펴보겠습니다.

## 플러그인 구성 제공 {id="plugin-configuration"}

[이전 섹션](#first-plugin)에서는 미리 정의된 사용자 지정 헤더를 각 응답에 추가하는 플러그인을 생성하는 방법을 보여주었습니다. 이 플러그인을 더 유용하게 만들고 어떤 사용자 지정 헤더 이름과 값이라도 전달할 수 있는 구성을 제공해 보겠습니다.

1.  먼저 구성 클래스를 정의해야 합니다.

    ```kotlin
    class CustomHeaderPluginConfig {
        var headerName: String = "X-Custom-Header"
        var headerValue: String = "Default value"
    }
    ```

2.  플러그인에서 이 구성을 사용하려면 구성 클래스 참조를 `createApplicationPlugin`에 전달합니다.

    ```kotlin
    import io.ktor.client.plugins.api.*
    
    val CustomHeaderConfigurablePlugin = createClientPlugin("CustomHeaderConfigurablePlugin", ::CustomHeaderPluginConfig) {
        val headerName = pluginConfig.headerName
        val headerValue = pluginConfig.headerValue
    
        onRequest { request, _ ->
            request.headers.append(headerName, headerValue)
        }
    }
    ```

    플러그인 구성 필드는 변경 가능하므로, 이를 로컬 변수에 저장하는 것이 좋습니다.

3.  마지막으로 다음과 같이 플러그인을 설치하고 구성할 수 있습니다.

    ```kotlin
    val client = HttpClient(CIO) {
        install(CustomHeaderConfigurablePlugin) {
            headerName = "X-Custom-Header"
            headerValue = "Hello, world!"
        }
    }
    ```

> 전체 예시는 다음에서 찾을 수 있습니다: [CustomHeaderConfigurable.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderConfigurable.kt).

## 요청 및 응답 처리 {id="call-handling"}

사용자 지정 플러그인은 전용 핸들러 세트를 사용하여 요청 및 응답 처리의 다양한 단계에 접근할 수 있도록 합니다. 예를 들면 다음과 같습니다.
- `onRequest` 및 `onResponse`는 각각 요청과 응답을 처리할 수 있도록 합니다.
- `transformRequestBody` 및 `transformResponseBody`는 요청 및 응답 본문에 필요한 변환을 적용하는 데 사용될 수 있습니다.

또한 호출의 다른 단계를 처리하는 데 유용할 수 있는 특정 훅(hook)을 호출할 수 있도록 하는 `on(...)` 핸들러도 있습니다.
아래 표는 모든 핸들러가 실행되는 순서대로 나열합니다.

<Tabs>
<TabItem title="기본 훅">

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
<code>onRequest</code>
</td>
<td>
<p>
이 핸들러는 각 HTTP <Links href="/ktor/client-requests" summary="요청을 보내고 요청 URL, HTTP 메서드, 헤더, 요청 본문과 같은 다양한 요청 매개변수를 지정하는 방법을 알아보세요.">요청</Links>에 대해 실행되며 요청을 수정할 수 있도록 합니다.
</p>
<p>
<emphasis>
예시: <a href="#example-custom-header">사용자 지정 헤더</a>
</emphasis>
</p>
</td>
</tr>

<tr>
<td>
<code>transformRequestBody</code>
</td>
<td>
<p>
<a href="#body">요청 본문</a>을 변환할 수 있도록 합니다.
이 핸들러에서는 본문을 
<a href="https://api.ktor.io/ktor-http/io.ktor.http.content/-outgoing-content/index.html">OutgoingContent</a> 
(예: <code>TextContent</code>, <code>ByteArrayContent</code>, 또는 <code>FormDataContent</code>)로 직렬화하거나, 변환이 적용되지 않는 경우 <code>null</code>을 반환해야 합니다.
</p>
<p>
<emphasis>
예시: <a href="#data-transformation">데이터 변환</a>
</emphasis>
</p>
</td>
</tr>

<tr>
<td>
<code>onResponse</code>
</td>
<td>
<p>
이 핸들러는 수신되는 각 HTTP <Links href="/ktor/client-requests" summary="요청을 보내고 요청 URL, HTTP 메서드, 헤더, 요청 본문과 같은 다양한 요청 매개변수를 지정하는 방법을 알아보세요.">응답</Links>에 대해 실행되며, 응답을 다양한 방식으로 검사할 수 있도록 합니다: 응답 로깅, 쿠키 저장 등.
</p>
<p>
<emphasis>
예시: <a href="#example-log-headers">헤더 로깅</a>, <a href="#example-response-time">응답 시간</a>
</emphasis>
</p>
</td>
</tr>

<tr>
<td>
<code>transformResponseBody</code>
</td>
<td>
<p>
<a href="#body">응답 본문</a>을 변환할 수 있도록 합니다.
이 핸들러는 각 <code>HttpResponse.body</code> 호출에 대해 호출됩니다.
본문을 <code>requestedType</code> 인스턴스로 역직렬화하거나, 변환이 적용되지 않는 경우 <code>null</code>을 반환해야 합니다.
</p>
<p>
<emphasis>
예시: <a href="#data-transformation">데이터 변환</a>
</emphasis>
</p>
</td>
</tr>

<tr>
<td>
<code>onClose</code>
</td>
<td>
이 플러그인에 의해 할당된 리소스를 정리할 수 있도록 합니다.
이 핸들러는 클라이언트가 <a href="#close-client">닫힐</a> 때 호출됩니다.
</td>
</tr>

</table>

</TabItem>
<TabItem title="모든 훅">

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
이 핸들러는 각 HTTP <Links href="/ktor/client-requests" summary="요청을 보내고 요청 URL, HTTP 메서드, 헤더, 요청 본문과 같은 다양한 요청 매개변수를 지정하는 방법을 알아보세요.">요청</Links>에 대해 실행되며 요청을 수정할 수 있도록 합니다.
</p>
<p>
<emphasis>
예시: <a href="#example-custom-header">사용자 지정 헤더</a>
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
<a href="#body">요청 본문</a>을 변환할 수 있도록 합니다.
이 핸들러에서는 본문을 
<a href="https://api.ktor.io/ktor-http/io.ktor.http.content/-outgoing-content/index.html">OutgoingContent</a> 
(예: <code>TextContent</code>, <code>ByteArrayContent</code>, 또는 <code>FormDataContent</code>)로 직렬화하거나, 변환이 적용되지 않는 경우 <code>null</code>을 반환해야 합니다.
</p>
<p>
<emphasis>
예시: <a href="#data-transformation">데이터 변환</a>
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
<code>Send</code> 훅은 응답을 검사하고 필요한 경우 추가 요청을 시작할 수 있는 기능을 제공합니다. 이는 리다이렉트 처리, 요청 재시도, 인증 등에 유용할 수 있습니다.
</p>
<p>
<emphasis>
예시: <a href="#authentication">인증</a>
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
<code>SendingRequest</code> 훅은 사용자에 의해 시작되지 않은 경우에도 모든 요청에 대해 실행됩니다.
예를 들어, 요청이 리다이렉트를 발생시키는 경우 `onRequest` 핸들러는 원본 요청에 대해서만 실행되지만, `on(SendingRequest)`는 원본 및 리다이렉트된 요청 모두에 대해 실행됩니다.
마찬가지로 `on(Send)`를 사용하여 추가 요청을 시작한 경우, 핸들러는 다음과 같이 정렬됩니다.
</p>
<code-block lang="Console" code="--&gt; onRequest&#10;--&gt; on(Send)&#10;--&gt; on(SendingRequest)&#10;&lt;-- onResponse&#10;--&gt; on(SendingRequest)&#10;&lt;-- onResponse"/>
<p>
<emphasis>
예시: <a href="#example-log-headers">헤더 로깅</a>, <a href="#example-response-time">응답 시간</a>
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
이 핸들러는 수신되는 각 HTTP <Links href="/ktor/client-requests" summary="요청을 보내고 요청 URL, HTTP 메서드, 헤더, 요청 본문과 같은 다양한 요청 매개변수를 지정하는 방법을 알아보세요.">응답</Links>에 대해 실행되며, 응답을 다양한 방식으로 검사할 수 있도록 합니다: 응답 로깅, 쿠키 저장 등.
</p>
<p>
<emphasis>
예시: <a href="#example-log-headers">헤더 로깅</a>, <a href="#example-response-time">응답 시간</a>
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
<a href="#body">응답 본문</a>을 변환할 수 있도록 합니다.
이 핸들러는 각 <code>HttpResponse.body</code> 호출에 대해 호출됩니다.
본문을 <code>requestedType</code> 인스턴스로 역직렬화하거나, 변환이 적용되지 않는 경우 <code>null</code>을 반환해야 합니다.
</p>
<p>
<emphasis>
예시: <a href="#data-transformation">데이터 변환</a>
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
이 플러그인에 의해 할당된 리소스를 정리할 수 있도록 합니다.
이 핸들러는 클라이언트가 <a href="#close-client">닫힐</a> 때 호출됩니다.
</td>
</tr>

</snippet>

</table>

</TabItem>
</Tabs>

### 호출 상태 공유 {id="call-state"}

사용자 지정 플러그인을 사용하면 호출과 관련된 모든 값을 공유하여 이 호출을 처리하는 모든 핸들러 내에서 해당 값에 접근할 수 있습니다. 이 값은 `call.attributes` 컬렉션에 고유 키를 가진 속성으로 저장됩니다. 다음 예시는 속성을 사용하여 요청을 보내는 시점과 응답을 받는 시점 사이의 시간을 계산하는 방법을 보여줍니다.

```kotlin
import io.ktor.client.plugins.api.*
import io.ktor.util.*

val ResponseTimePlugin = createClientPlugin("ResponseTimePlugin") {
    val onCallTimeKey = AttributeKey<Long>("onCallTimeKey")
    on(SendingRequest) { request, content ->
        val onCallTime = System.currentTimeMillis()
        request.attributes.put(onCallTimeKey, onCallTime)
    }

    onResponse { response ->
        val onCallTime = response.call.attributes[onCallTimeKey]
        val onCallReceiveTime = System.currentTimeMillis()
        println("Read response delay (ms): ${onCallReceiveTime - onCallTime}")
    }
}
```

전체 예시는 다음에서 찾을 수 있습니다: [ResponseTime.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/ResponseTime.kt).

## 클라이언트 구성 접근 {id="client-config"}

`HttpClient` 인스턴스를 반환하는 `client` 속성을 사용하여 클라이언트 구성에 접근할 수 있습니다. 다음 예시는 클라이언트가 사용하는 [프록시 주소](client-proxy.md)를 얻는 방법을 보여줍니다.

```kotlin
import io.ktor.client.plugins.api.*

val SimplePlugin = createClientPlugin("SimplePlugin") {
    val proxyAddress = client.engineConfig.proxy?.address()
    println("Proxy address: $proxyAddress")
}
```

## 예시 {id="examples"}

아래 코드 샘플은 사용자 지정 플러그인의 몇 가지 예시를 보여줍니다.
결과 프로젝트는 다음에서 찾을 수 있습니다: [client-custom-plugin](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/).

### 사용자 지정 헤더 {id="example-custom-header"}

각 요청에 사용자 지정 헤더를 추가하는 플러그인을 생성하는 방법을 보여줍니다.

```kotlin
package com.example.plugins

import io.ktor.client.plugins.api.*

val CustomHeaderConfigurablePlugin = createClientPlugin("CustomHeaderConfigurablePlugin", ::CustomHeaderPluginConfig) {
    val headerName = pluginConfig.headerName
    val headerValue = pluginConfig.headerValue

    onRequest { request, _ ->
        request.headers.append(headerName, headerValue)
    }
}

class CustomHeaderPluginConfig {
    var headerName: String = "X-Custom-Header"
    var headerValue: String = "Default value"
}
```

### 헤더 로깅 {id="example-log-headers"}

요청 및 응답 헤더를 로깅하는 플러그인을 생성하는 방법을 보여줍니다.

```kotlin
package com.example.plugins

import io.ktor.client.plugins.api.*

val LoggingHeadersPlugin = createClientPlugin("LoggingHeadersPlugin") {
    on(SendingRequest) { request, content ->
        println("Request headers:")
        request.headers.entries().forEach { entry ->
            printHeader(entry)
        }
    }

    onResponse { response ->
        println("Response headers:")
        response.headers.entries().forEach { entry ->
            printHeader(entry)
        }
    }
}

private fun printHeader(entry: Map.Entry<String, List<String>>) {
    var headerString = entry.key + ": "
    entry.value.forEach { headerValue ->
        headerString += "${headerValue};"
    }
    println("-> $headerString")
}

```

### 응답 시간 {id="example-response-time"}

요청을 보내는 시점과 응답을 받는 시점 사이의 시간을 측정하는 플러그인을 생성하는 방법을 보여줍니다.

```kotlin
package com.example.plugins

import io.ktor.client.plugins.api.*
import io.ktor.util.*

val ResponseTimePlugin = createClientPlugin("ResponseTimePlugin") {
    val onCallTimeKey = AttributeKey<Long>("onCallTimeKey")
    on(SendingRequest) { request, content ->
        val onCallTime = System.currentTimeMillis()
        request.attributes.put(onCallTimeKey, onCallTime)
    }

    onResponse { response ->
        val onCallTime = response.call.attributes[onCallTimeKey]
        val onCallReceiveTime = System.currentTimeMillis()
        println("Read response delay (ms): ${onCallReceiveTime - onCallTime}")
    }
}

```

### 데이터 변환 {id="data-transformation"}

`transformRequestBody` 및 `transformResponseBody` 훅을 사용하여 요청 및 응답 본문을 변환하는 방법을 보여줍니다.

<Tabs>
<TabItem title="DataTransformation.kt">

```kotlin
package com.example.plugins

import com.example.model.*
import io.ktor.client.plugins.api.*
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.utils.io.*

val DataTransformationPlugin = createClientPlugin("DataTransformationPlugin") {
    transformRequestBody { request, content, bodyType ->
        if (bodyType?.type == User::class) {
            val user = content as User
            TextContent(text="${user.name};${user.age}", contentType = ContentType.Text.Plain)
        } else {
            null
        }
    }
    transformResponseBody { response, content, requestedType ->
        if (requestedType.type == User::class) {
            val receivedContent = content.readUTF8Line()!!.split(";")
            User(receivedContent[0], receivedContent[1].toInt())
        } else {
            content
        }
    }
}

```

</TabItem>
<TabItem title="Application.kt">

```kotlin
package com.example

import com.example.model.*
import com.example.plugins.*
import com.example.server.*
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.engine.cio.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import kotlinx.coroutines.*

fun main() {
    startServer()
    runBlocking {
        val client = HttpClient(CIO) {
            install(DataTransformationPlugin)
        }
        val bodyAsText = client.post("http://0.0.0.0:8080/post-data") {
            setBody(User("John", 42))
        }.bodyAsText()
        val user = client.get("http://0.0.0.0:8080/get-data").body<User>()
        println("Userinfo: $bodyAsText")
        println("Username: ${user.name}, age: ${user.age}")
    }
}

```

</TabItem>
<TabItem title="User.kt">

```kotlin
package com.example.model

data class User(val name: String, val age: Int)

```

</TabItem>
</Tabs>

전체 예시는 다음에서 찾을 수 있습니다: [client-custom-plugin-data-transformation](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-custom-plugin-data-transformation).

### 인증 {id="authentication"}

서버로부터 무단 응답이 수신된 경우 `on(Send)` 훅을 사용하여 `Authorization` 헤더에 베어러 토큰을 추가하는 방법을 보여주는 샘플 Ktor 프로젝트입니다.

<Tabs>
<TabItem title="Auth.kt">

```kotlin
package com.example.plugins

import io.ktor.client.plugins.api.*
import io.ktor.http.*

val AuthPlugin = createClientPlugin("AuthPlugin", ::AuthPluginConfig) {
    val token = pluginConfig.token

    on(Send) { request ->
        val originalCall = proceed(request)
        originalCall.response.run { // this: HttpResponse
            if(status == HttpStatusCode.Unauthorized && headers["WWW-Authenticate"]!!.contains("Bearer")) {
                request.headers.append("Authorization", "Bearer $token")
                proceed(request)
            } else {
                originalCall
            }
        }
    }
}

class AuthPluginConfig {
    var token: String = ""
}

```

</TabItem>
<TabItem title="Application.kt">

```kotlin
package com.example

import com.example.plugins.*
import com.example.server.*
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import kotlinx.coroutines.*

fun main() {
    startServer()
    runBlocking {
        val client = HttpClient(CIO) {
            install(AuthPlugin) {
                token = "abc123"
            }
        }
        val response = client.get("http://0.0.0.0:8080/")
        println(response.bodyAsText())
    }
}

```

</TabItem>
</Tabs>

전체 예시는 다음에서 찾을 수 있습니다: [client-custom-plugin-auth](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-custom-plugin-auth).