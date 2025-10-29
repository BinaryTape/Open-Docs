[//]: # (title: 속도 제한)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="RateLimit"/>
<var name="package_name" value="io.ktor.server.plugins.ratelimit"/>
<var name="artifact_name" value="ktor-server-rate-limit"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server-rate-limit/io.ktor.server.plugins.ratelimit/-rate-limit.html"/>

<tldr>
<p>
<b>필수 종속성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="rate-limit"/>
<p>
    <b>코드 예제</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구조화할 수 있습니다.">네이티브 서버</Links> 지원</b>: ✅
</p>
</tldr>

<link-summary>
%plugin_name%은(는) 들어오는 요청의 본문을 검증하는 기능을 제공합니다.
</link-summary>

[%plugin_name%](%plugin_api_link%) 플러그인을 사용하면 클라이언트가 특정 시간 내에 수행할 수 있는 [요청](server-requests.md) 수를 제한할 수 있습니다.
Ktor는 속도 제한을 구성하기 위한 다양한 방법을 제공합니다. 예를 들어:
- 전체 애플리케이션에 대해 전역적으로 속도 제한을 활성화하거나, 다른 [리소스](server-routing.md)에 대해 다른 속도 제한을 구성할 수 있습니다.
- IP 주소, API 키 또는 액세스 토큰과 같은 특정 요청 매개변수를 기반으로 속도 제한을 구성할 수 있습니다.

## 종속성 추가 {id="add_dependencies"}

<p>
    <code>%plugin_name%</code>을(를) 사용하려면 빌드 스크립트에 <code>%artifact_name%</code> 아티팩트를 포함해야 합니다:
</p>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## %plugin_name% 설치 {id="install_plugin"}

<p>
    애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면,
    지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 경로를 그룹화하여 애플리케이션을 구조화할 수 있습니다.">모듈</Links>의 <code>install</code> 함수에 플러그인을 전달합니다.
    아래 코드 스니펫은 <code>%plugin_name%</code>을(를) 설치하는 방법을 보여줍니다...
</p>
<list>
    <li>
        ... <code>embeddedServer</code> 함수 호출 내에서.
    </li>
    <li>
        ... <code>Application</code> 클래스의 확장 함수인 명시적으로 정의된 <code>module</code> 내에서.
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10                embeddedServer(Netty, port = 8080) {&#10                    install(%plugin_name%)&#10                    // ...&#10                }.start(wait = true)&#10            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10            fun Application.module() {&#10                install(%plugin_name%)&#10                // ...&#10            }"/>
    </TabItem>
</Tabs>

## %plugin_name% 구성 {id="configure"}

### 개요 {id="overview"}

Ktor는 속도 제한을 위해 _토큰 버킷_ 알고리즘을 사용하며, 이는 다음과 같이 작동합니다:
1. 처음에 우리는 용량(토큰 수)으로 정의된 버킷을 가집니다.
2. 각 들어오는 요청은 버킷에서 하나의 토큰을 소비하려고 시도합니다:
    - 용량이 충분하면, 서버는 요청을 처리하고 다음 헤더와 함께 응답을 보냅니다:
        - `X-RateLimit-Limit`: 지정된 버킷 용량.
        - `X-RateLimit-Remaining`: 버킷에 남아있는 토큰 수.
        - `X-RateLimit-Reset`: 버킷을 다시 채울 시간(초 단위 UTC 타임스탬프)을 지정합니다.
    - 용량이 부족하면 서버는 <code>429 Too Many Requests</code> 응답을 사용하여 요청을 거부하고, 클라이언트가 다음 요청을 보내기 전에 기다려야 하는 시간(초 단위)을 나타내는 <code>Retry-After</code> 헤더를 추가합니다.
3. 지정된 시간이 경과하면 버킷 용량이 다시 채워집니다.

### 속도 제한기 등록 {id="register"}
Ktor를 사용하면 속도 제한을 전체 애플리케이션에 전역적으로 적용하거나 특정 경로에 적용할 수 있습니다:
- 전체 애플리케이션에 속도 제한을 적용하려면, <code>global</code> 메서드를 호출하고 구성된 속도 제한기를 전달합니다.
   ```kotlin
   install(RateLimit) {
       global {
           rateLimiter(limit = 5, refillPeriod = 60.seconds)
       }
   }
   ```

- <code>register</code> 메서드는 특정 경로에 적용할 수 있는 속도 제한기를 등록합니다.
   ```kotlin
   install(RateLimit) {
       register {
           rateLimiter(limit = 5, refillPeriod = 60.seconds)
       }
   }
   ```

위 코드 샘플은 <code>%plugin_name%</code> 플러그인의 최소 구성을 보여주지만, <code>register</code> 메서드를 사용하여 등록된 속도 제한기의 경우 [특정 경로](#rate-limiting-scope)에도 적용해야 합니다.

### 속도 제한 구성 {id="configure-rate-limiting"}

이 섹션에서는 속도 제한을 구성하는 방법을 살펴보겠습니다:

1. (선택 사항) <code>register</code> 메서드를 사용하면 [특정 경로](#rate-limiting-scope)에 속도 제한 규칙을 적용하는 데 사용할 수 있는 속도 제한기 이름을 지정할 수 있습니다:
   ```kotlin
       install(RateLimit) {
           register(RateLimitName("protected")) {
               // ...
           }
       }
   ```

2. <code>rateLimiter</code> 메서드는 두 개의 매개변수로 속도 제한기를 생성합니다: <code>limit</code>는 버킷 용량을 정의하고, <code>refillPeriod</code>는 이 버킷의 재충전 기간을 지정합니다. 아래 예시의 속도 제한기는 분당 30개의 요청을 처리할 수 있습니다:
   ```kotlin
   register(RateLimitName("protected")) {
       rateLimiter(limit = 30, refillPeriod = 60.seconds)
   }
   ```

3. (선택 사항) <code>requestKey</code>를 사용하면 요청에 대한 키를 반환하는 함수를 지정할 수 있습니다. 키가 다른 요청은 독립적인 속도 제한을 가집니다.
   아래 예시에서 <code>login</code> [쿼리 매개변수](server-requests.md#query_parameters)는 다른 사용자를 구분하는 데 사용되는 키입니다:
   ```kotlin
   register(RateLimitName("protected")) {
       requestKey { applicationCall ->
           applicationCall.request.queryParameters["login"]!!
       }
   }
   ```

   > 키는 <code>equals</code> 및 <code>hashCode</code> 구현이 잘 되어 있어야 합니다.

4. (선택 사항) <code>requestWeight</code>는 요청이 소비하는 토큰 수를 반환하는 함수를 설정합니다.
   아래 예시에서 요청 키는 요청 가중치를 구성하는 데 사용됩니다:
   ```kotlin
   register(RateLimitName("protected")) {
       requestKey { applicationCall ->
           applicationCall.request.queryParameters["login"]!!
       }
       requestWeight { applicationCall, key ->
           when(key) {
               "jetbrains" -> 1
               else -> 2
           }
       }
   }
   ```

5. (선택 사항) <code>modifyResponse</code>를 사용하면 각 요청과 함께 전송되는 기본 <code>X-RateLimit-*</code> 헤더를 재정의할 수 있습니다:
   ```kotlin
   register(RateLimitName("protected")) {
       modifyResponse { applicationCall, state ->
           applicationCall.response.header("X-RateLimit-Custom-Header", "Some value")
       }
   }
   ```

### 속도 제한 범위 정의 {id="rate-limiting-scope"}

속도 제한기를 구성한 후, <code>rateLimit</code> 메서드를 사용하여 특정 경로에 해당 규칙을 적용할 수 있습니다:

```kotlin
routing {
    rateLimit {
        get("/") {
            val requestsLeft = call.response.headers["X-RateLimit-Remaining"]
            call.respondText("Welcome to the home page! $requestsLeft requests left.")
        }
    }
}
```

이 메서드는 [속도 제한기 이름](#configure-rate-limiting)도 받을 수 있습니다:

```kotlin
routing {
    rateLimit(RateLimitName("protected")) {
        get("/protected-api") {
            val requestsLeft = call.response.headers["X-RateLimit-Remaining"]
            val login = call.request.queryParameters["login"]
            call.respondText("Welcome to protected API, $login! $requestsLeft requests left.")
        }
    }
}
```

## 예제 {id="example"}

아래 코드 샘플은 <code>RateLimit</code> 플러그인을 사용하여 다양한 리소스에 다른 속도 제한기를 적용하는 방법을 보여줍니다.
<code>429 Too Many Requests</code> 응답이 전송된 거부된 요청을 처리하기 위해 [StatusPages](server-status-pages.md) 플러그인이 사용됩니다.

```kotlin
package com.example

import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.plugins.ratelimit.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlin.time.Duration.Companion.seconds

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    install(RateLimit) {
        register {
            rateLimiter(limit = 5, refillPeriod = 60.seconds)
        }
        register(RateLimitName("public")) {
            rateLimiter(limit = 10, refillPeriod = 60.seconds)
        }
        register(RateLimitName("protected")) {
            rateLimiter(limit = 30, refillPeriod = 60.seconds)
            requestKey { applicationCall ->
                applicationCall.request.queryParameters["login"]!!
            }
            requestWeight { applicationCall, key ->
                when(key) {
                    "jetbrains" -> 1
                    else -> 2
                }
            }
        }
    }
    install(StatusPages) {
        status(HttpStatusCode.TooManyRequests) { call, status ->
            val retryAfter = call.response.headers["Retry-After"]
            call.respondText(text = "429: Too many requests. Wait for $retryAfter seconds.", status = status)
        }
    }
    routing {
        rateLimit {
            get("/") {
                val requestsLeft = call.response.headers["X-RateLimit-Remaining"]
                call.respondText("Welcome to the home page! $requestsLeft requests left.")
            }
        }
        rateLimit(RateLimitName("public")) {
            get("/public-api") {
                val requestsLeft = call.response.headers["X-RateLimit-Remaining"]
                call.respondText("Welcome to public API! $requestsLeft requests left.")
            }
        }
        rateLimit(RateLimitName("protected")) {
            get("/protected-api") {
                val requestsLeft = call.response.headers["X-RateLimit-Remaining"]
                val login = call.request.queryParameters["login"]
                call.respondText("Welcome to protected API, $login! $requestsLeft requests left.")
            }
        }
    }
}
```

전체 예제는 다음에서 찾을 수 있습니다: [rate-limit](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/rate-limit).