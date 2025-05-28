[//]: # (title: 速率限制)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="RateLimit"/>
<var name="package_name" value="io.ktor.server.plugins.ratelimit"/>
<var name="artifact_name" value="ktor-server-rate-limit"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-rate-limit/io.ktor.server.plugins.ratelimit/-rate-limit.html"/>

<tldr>
<p>
<b>必要依賴</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="rate-limit"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
%plugin_name% 提供驗證傳入請求主體的能力。
</link-summary>

[%plugin_name%](%plugin_api_link%) 外掛程式允許您限制客戶端 (client) 在特定時間段 (time period) 內發出的[請求](server-requests.md)數量。
Ktor 提供不同的方式來配置速率限制 (rate limiting)，例如：
- 您可以為整個應用程式全域 (globally) 啟用速率限制，或者為不同的[資源](server-routing.md)配置不同的速率限制。
- 您可以根據特定的請求參數（例如：IP 位址 (IP address)、API 密鑰 (API key) 或存取權杖 (access token) 等）來配置速率限制。

## 新增依賴 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 配置 %plugin_name% {id="configure"}

### 概述 {id="overview"}

Ktor 使用**令牌桶演算法** (token bucket algorithm) 進行速率限制，其工作原理如下：
1. 最初，我們有一個由其容量 (capacity) 定義的桶，即令牌 (token) 的數量。
2. 每個傳入請求都嘗試從桶中消耗一個令牌：
    - 如果容量足夠，伺服器會處理請求並傳送包含以下標頭 (headers) 的回應：
        - `X-RateLimit-Limit`: 指定的桶容量。
        - `X-RateLimit-Remaining`: 桶中剩餘的令牌數量。
        - `X-RateLimit-Reset`: 指定重新填滿桶的時間的 UTC 時間戳記 (UTC timestamp)（以秒為單位）。
    - 如果容量不足 (insufficient capacity)，伺服器會使用 `429 Too Many Requests` 回應拒絕請求 (rejects a request)，並新增 `Retry-After` 標頭，指示客戶端在發出後續請求之前應等待多長時間（以秒為單位）。
3. 經過指定的時間段後，桶的容量會重新填滿。

### 註冊速率限制器 {id="register"}
Ktor 允許您將速率限制全域應用於整個應用程式或特定路由：
- 要將速率限制應用於整個應用程式，請呼叫 `global` 方法並傳遞已配置的速率限制器。
   ```kotlin
   install(RateLimit) {
       global {
           rateLimiter(limit = 5, refillPeriod = 60.seconds)
       }
   }
   ```

- `register` 方法註冊一個可應用於特定路由的速率限制器。
   ```kotlin
   ```
   {src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt" include-lines="14-17,33"}

上面的程式碼範例展示了 `%plugin_name%` 外掛程式的最小配置，
但是對於使用 `register` 方法註冊的速率限制器，您還需要將其應用於[特定路由](#rate-limiting-scope)。

### 配置速率限制 {id="configure-rate-limiting"}

在本節中，我們將了解如何配置速率限制：

1. (可選) `register` 方法允許您指定一個速率限制器名稱，該名稱可用於將速率限制規則應用於[特定路由](#rate-limiting-scope)：
   ```kotlin
       install(RateLimit) {
           register(RateLimitName("protected")) {
               // ...
           }
       }
   ```

2. `rateLimiter` 方法使用兩個參數創建一個速率限制器：
   `limit` 定義了桶的容量，而 `refillPeriod` 指定了該桶的補充週期。
   以下範例中的速率限制器允許每分鐘處理 30 個請求：
   ```kotlin
   ```
   {src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt" include-lines="21-22,32"}

3. (可選) `requestKey` 允許您指定一個函數，該函數為請求返回一個鍵 (key)。
   具有不同鍵的請求具有獨立的速率限制。
   在以下範例中，`login` [查詢參數](server-requests.md#query_parameters)是用於區分不同使用者的鍵：
   ```kotlin
   ```
   {src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt" include-lines="21,23-25,32"}

   > 請注意，鍵應具有良好的 `equals` 和 `hashCode` 實作 (implementation)。

4. (可選) `requestWeight` 設定一個函數，該函數返回一個請求消耗了多少令牌。
   在以下範例中，請求鍵用於配置請求權重：
   ```kotlin
   ```
   {src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt" include-lines="21,23-32"}

5. (可選) `modifyResponse` 允許您覆寫 (override) 每個請求發送的預設 `X-RateLimit-*` 標頭：
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
```
{src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt" include-lines="40-46,60"}

此方法還可以接受一個[速率限制器名稱](#configure-rate-limiting)：

```kotlin
```
{src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt" include-lines="40,53-60"}

## 範例 {id="example"}

下面的程式碼範例展示了如何使用 `RateLimit` 外掛程式將不同的速率限制器應用於不同的資源。
[StatusPages](server-status-pages.md) 外掛程式用於處理被拒絕的請求，
這些請求會傳送 `429 Too Many Requests` 回應。

```kotlin
```
{src="snippets/rate-limit/src/main/kotlin/com/example/Application.kt"}

您可以在此處找到完整範例：[rate-limit](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/rate-limit)。