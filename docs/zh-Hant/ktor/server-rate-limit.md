[//]: # (title: 速率限制)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="RateLimit"/>
<var name="package_name" value="io.ktor.server.plugins.ratelimit"/>
<var name="artifact_name" value="ktor-server-rate-limit"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-rate-limit/io.ktor.server.plugins.ratelimit/-rate-limit.html"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="rate-limit"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，讓您無需額外的執行時間或虛擬機器即可執行伺服器。">原生伺服器</Links> 支援</b>: ✅
    </p>
    
</tldr>

<link-summary>
%plugin_name% 提供驗證傳入請求主體的功能。
</link-summary>

[%plugin_name%](%plugin_api_link%) 插件允許您限制用戶端在特定時間段內可以發出的 [請求](server-requests.md) 數量。
Ktor 提供了不同的方式來配置速率限制，例如：
- 您可以為整個應用程式全域啟用速率限制，或為不同的 [資源](server-routing.md) 配置不同的速率限制。
- 您可以基於特定的請求參數配置速率限制：IP 位址、API 金鑰或存取權杖等等。

## 新增依賴項 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> 構件：
    </p>
    

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

## 安裝 %plugin_name% {id="install_plugin"}

    <p>
        要將 <code>%plugin_name%</code> 插件 <a href="#install">安裝</a> 到應用程式中，
        請將其傳遞給指定 <Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">模組</Links> 中的 <code>install</code> 函數。
        下方的程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函數呼叫內部。
        </li>
        <li>
            ... 在明確定義的 <code>module</code> 內部，它是 <code>Application</code> 類別的擴充函數。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

## 配置 %plugin_name% {id="configure"}

### 概述 {id="overview"}

Ktor 使用 _令牌桶_ 演算法進行速率限制，其運作方式如下：
1. 一開始，我們有一個由其容量（令牌數量）定義的桶。
2. 每個傳入的請求都會嘗試從桶中消耗一個令牌：
    - 如果容量足夠，伺服器會處理請求並發送包含以下標頭的回應：
        - `X-RateLimit-Limit`：指定的桶容量。
        - `X-RateLimit-Remaining`：桶中剩餘的令牌數量。
        - `X-RateLimit-Reset`：一個 UTC 時間戳 (以秒為單位)，指定了重新填充桶的時間。
    - 如果容量不足，伺服器會使用 `429 Too Many Requests` 回應拒絕請求，並新增 `Retry-After` 標頭，指示用戶端應等待多久（以秒為單位）才能發出後續請求。
3. 在指定時間段後，桶容量會被重新填充。

### 註冊速率限制器 {id="register"}
Ktor 允許您將速率限制全域應用於整個應用程式或特定路由：
- 要將速率限制應用於整個應用程式，請呼叫 `global` 方法並傳遞一個已配置的速率限制器。
   ```kotlin
   install(RateLimit) {
       global {
           rateLimiter(limit = 5, refillPeriod = 60.seconds)
       }
   }
   ```

- <code>register</code> 方法註冊一個可以應用於特定路由的速率限制器。
   [object Promise]

上述程式碼範例展示了 <code>%plugin_name%</code> 插件的最小配置，但對於使用 <code>register</code> 方法註冊的速率限制器，您還需要將其應用到 [特定路由](#rate-limiting-scope)。

### 配置速率限制 {id="configure-rate-limiting"}

在本節中，我們將探討如何配置速率限制：

1. (選用) <code>register</code> 方法允許您指定一個速率限制器名稱，該名稱可用於將速率限制規則應用於 [特定路由](#rate-limiting-scope)：
   ```kotlin
       install(RateLimit) {
           register(RateLimitName("protected")) {
               // ...
           }
       }
   ```

2. <code>rateLimiter</code> 方法建立一個包含兩個參數的速率限制器：<code>limit</code> 定義了桶容量，而 <code>refillPeriod</code> 指定了該桶的重新填充週期。下方範例中的速率限制器允許每分鐘處理 30 個請求：
   [object Promise]

3. (選用) <code>requestKey</code> 允許您指定一個函數，該函數為請求返回一個鍵。具有不同鍵的請求擁有獨立的速率限制。下方範例中，<code>login</code> [查詢參數](server-requests.md#query_parameters) 是用於區分不同用戶的鍵：
   [object Promise]

   > 請注意，鍵應具有良好的 `equals` 和 `hashCode` 實作。

4. (選用) <code>requestWeight</code> 設定一個函數，該函數返回一個請求消耗多少令牌。下方範例中，請求鍵用於配置請求權重：
   [object Promise]

5. (選用) <code>modifyResponse</code> 允許您覆寫每個請求發送的預設 `X-RateLimit-*` 標頭：
   ```kotlin
   register(RateLimitName("protected")) {
       modifyResponse { applicationCall, state ->
           applicationCall.response.header("X-RateLimit-Custom-Header", "Some value")
       }
   }
   ```

### 定義速率限制範圍 {id="rate-limiting-scope"}

配置速率限制器後，您可以使用 <code>rateLimit</code> 方法將其規則應用於特定路由：

[object Promise]

此方法也可以接受 [速率限制器名稱](#configure-rate-limiting)：

[object Promise]

## 範例 {id="example"}

下方的程式碼範例展示了如何使用 <code>RateLimit</code> 插件將不同的速率限制器應用於不同的資源。[StatusPages](server-status-pages.md) 插件用於處理被拒絕的請求，對於這些請求，已發送 `429 Too Many Requests` 回應。

[object Promise]

您可以在這裡找到完整的範例：[rate-limit](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/rate-limit)。