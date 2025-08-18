[//]: # (title: 速率限制)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="RateLimit"/>
<var name="package_name" value="io.ktor.server.plugins.ratelimit"/>
<var name="artifact_name" value="ktor-server-rate-limit"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-rate-limit/io.ktor.server.plugins.ratelimit/-rate-limit.html"/>

<tldr>
<p>
<b>所需依賴項</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="rate-limit"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">原生伺服器</Links>支援</b>：✅
</p>
</tldr>

<link-summary>
%plugin_name% 提供了驗證傳入請求主體的能力。
</link-summary>

[%plugin_name%](%plugin_api_link%) 外掛程式允許您限制客戶端在特定時間段內可發出的 [請求](server-requests.md) 數量。
Ktor 提供了不同的方式來配置速率限制，例如：
- 您可以為整個應用程式全域啟用速率限制，或為不同的 [資源](server-routing.md) 配置不同的速率限制。
- 您可以基於特定的請求參數配置速率限制：IP 位址、API 密鑰或存取權杖等。

## 新增依賴項 {id="add_dependencies"}

<p>
    若要使用 <code>%plugin_name%</code>，您需要在建構腳本中包含 <code>%artifact_name%</code> 構件：
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

## 安裝 %plugin_name% {id="install_plugin"}

<p>
    若要將 <code>%plugin_name%</code> 外掛程式<a href="#install">安裝</a>到應用程式中，
    請在指定的<Links href="/ktor/server-modules" summary="Modules allow you to structure your application by grouping routes.">模組</Links>中將其傳遞給 <code>install</code> 函數。
    下面的程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函數呼叫內部。
    </li>
    <li>
        ... 在明確定義的 <code>module</code> 內部，此 <code>module</code> 是 <code>Application</code> 類別的擴充函數。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>

## 配置 %plugin_name% {id="configure"}

### 概述 {id="overview"}

Ktor 使用 _令牌桶_ 演算法進行速率限制，其工作方式如下：
1. 首先，我們有一個由其容量（令牌數量）定義的桶。
2. 每個傳入請求嘗試從桶中消耗一個令牌：
    - 如果有足夠容量，伺服器會處理請求並發送包含以下標頭的響應：
        - `X-RateLimit-Limit`：指定的桶容量。
        - `X-RateLimit-Remaining`：桶中剩餘的令牌數量。
        - `X-RateLimit-Reset`：一個 UTC 時間戳 (以秒為單位)，指定重新填充桶的時間。
    - 如果容量不足，伺服器會使用 `429 Too Many Requests` 響應拒絕請求，並添加 `Retry-After` 標頭，指示客戶端應等待多久 (以秒為單位) 然後再發出後續請求。
3. 在指定時間段後，桶容量將被重新填充。

### 註冊速率限制器 {id="register"}
Ktor 允許您將速率限制全域應用於整個應用程式或特定路由：
- 若要將速率限制應用於整個應用程式，請呼叫 `global` 方法並傳遞一個已配置的速率限制器。
   ```kotlin
   install(RateLimit) {
       global {
           rateLimiter(limit = 5, refillPeriod = 60.seconds)
       }
   }
   ```

- `register` 方法註冊一個速率限制器，該限制器可以應用於特定路由。
   ```kotlin
   install(RateLimit) {
       register {
           rateLimiter(limit = 5, refillPeriod = 60.seconds)
       }
   }
   ```

以上程式碼範例展示了 `%plugin_name%` 外掛程式的最小配置，
但對於使用 `register` 方法註冊的速率限制器，您還需要將其應用於 [特定路由](#rate-limiting-scope)。

### 配置速率限制 {id="configure-rate-limiting"}

在本節中，我們將瞭解如何配置速率限制：

1. (可選) `register` 方法允許您指定一個速率限制器名稱，該名稱可用於將速率限制規則應用於 [特定路由](#rate-limiting-scope)：
   ```kotlin
       install(RateLimit) {
           register(RateLimitName("protected")) {
               // ...
           }
       }
   ```

2. `rateLimiter` 方法建立一個帶有兩個參數的速率限制器：
   `limit` 定義桶容量，而 `refillPeriod` 指定此桶的重新填充週期。
   下面的範例中，速率限制器允許每分鐘處理 30 個請求：
   ```kotlin
   register(RateLimitName("protected")) {
       rateLimiter(limit = 30, refillPeriod = 60.seconds)
   }
   ```

3. (可選) `requestKey` 允許您指定一個返回請求鍵的函數。
   具有不同鍵的請求具有獨立的速率限制。
   在下面的範例中，`login` [查詢參數](server-requests.md#query_parameters) 是用於區分不同使用者的鍵：
   ```kotlin
   register(RateLimitName("protected")) {
       requestKey { applicationCall ->
           applicationCall.request.queryParameters["login"]!!
       }
   }
   ```

   > 請注意，鍵應具備良好的 `equals` 和 `hashCode` 實作。

4. (可選) `requestWeight` 設定一個函數，該函數返回請求消耗多少令牌。
   在下面的範例中，請求鍵用於配置請求權重：
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

5. (可選) `modifyResponse` 允許您覆寫隨每個請求發送的預設 `X-RateLimit-*` 標頭：
   ```kotlin
   register(RateLimitName("protected")) {
       modifyResponse { applicationCall, state ->
           applicationCall.response.header("X-RateLimit-Custom-Header", "Some value")
       }
   }
   ```

### 定義速率限制範圍 {id="rate-limiting-scope"}

配置速率限制器後，您可以使用 `rateLimit` 方法將其規則應用於特定路由：

```kotlin
routing {
    rateLimit {
        get("/") {
            val requestsLeft = call.response.headers["X-RateLimit-Remaining"]
            call.respondText("歡迎來到首頁！剩餘 $requestsLeft 個請求。")
        }
    }
}
```

此方法也可以接受一個 [速率限制器名稱](#configure-rate-limiting)：

```kotlin
routing {
    rateLimit(RateLimitName("protected")) {
        get("/protected-api") {
            val requestsLeft = call.response.headers["X-RateLimit-Remaining"]
            val login = call.request.queryParameters["login"]
            call.respondText("歡迎來到受保護的 API，$login！剩餘 $requestsLeft 個請求。")
        }
    }
}
```

## 範例 {id="example"}

下面的程式碼範例演示了如何使用 `RateLimit` 外掛程式將不同的速率限制器應用於不同的資源。
[StatusPages](server-status-pages.md) 外掛程式用於處理被拒絕的請求，這些請求發送了 `429 Too Many Requests` 響應。

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
            call.respondText(text = "429: 請求過多。請等待 $retryAfter 秒。", status = status)
        }
    }
    routing {
        rateLimit {
            get("/") {
                val requestsLeft = call.response.headers["X-RateLimit-Remaining"]
                call.respondText("歡迎來到首頁！剩餘 $requestsLeft 個請求。")
            }
        }
        rateLimit(RateLimitName("public")) {
            get("/public-api") {
                val requestsLeft = call.response.headers["X-RateLimit-Remaining"]
                call.respondText("歡迎來到公開 API！剩餘 $requestsLeft 個請求。")
            }
        }
        rateLimit(RateLimitName("protected")) {
            get("/protected-api") {
                val requestsLeft = call.response.headers["X-RateLimit-Remaining"]
                val login = call.request.queryParameters["login"]
                call.respondText("歡迎來到受保護的 API，$login！剩餘 $requestsLeft 個請求。")
            }
        }
    }
}
```

您可以在此處找到完整的範例：[rate-limit](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/rate-limit)。