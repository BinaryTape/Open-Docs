[//]: # (title: 轉發標頭)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-forwarded-header"/>
<var name="package_name" value="io.ktor.server.plugins.forwardedheaders"/>

<tldr>
<p>
<b>所需的依賴項</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="forwarded-header"/>

    <p>
        <b>程式碼範例</b>：
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，並允許您在沒有額外運行時或虛擬機器下運行伺服器。">原生伺服器</Links>支援</b>：✅
    </p>
    
</tldr>

[ForwardedHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-forwarded-header/io.ktor.server.plugins.forwardedheaders/-forwarded-headers.html) 和 [XForwardedHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-forwarded-header/io.ktor.server.plugins.forwardedheaders/-x-forwarded-headers.html) 外掛程式允許您處理反向代理標頭，以在 Ktor 伺服器放置於反向代理之後時，獲取有關原始[請求](server-requests.md)的資訊。這對於[日誌記錄](server-logging.md)目的可能很有用。

* `ForwardedHeaders` 處理 `Forwarded` 標頭 ([RFC 7239](https://tools.ietf.org/html/rfc7239))
* `XForwardedHeaders` 處理以下 `X-Forwarded-` 標頭：
   - `X-Forwarded-Host`/`X-Forwarded-Server` 
   - `X-Forwarded-For` 
   - `X-Forwarded-By`
   - `X-Forwarded-Proto`/`X-Forwarded-Protocol`
   - `X-Forwarded-SSL`/`Front-End-Https`

> 為了防止操縱 `Forwarded` 標頭，請僅在您的應用程式只接受反向代理連線時才安裝這些外掛程式。
> 
{type="note"}

## 添加依賴項 {id="add_dependencies"}
若要使用 `ForwardedHeaders`/`XForwardedHeaders` 外掛程式，您需要在構建腳本中包含 `%artifact_name%` 構件：

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
    

## 安裝外掛程式 {id="install_plugin"}

<tabs>
<tab title="ForwardedHeader">

<var name="plugin_name" value="ForwardedHeaders"/>

    <p>
        若要<a href="#install">安裝</a> <code>%plugin_name%</code> 外掛程式到應用程式，
        請在指定的<Links href="/ktor/server-modules" summary="模組允許您通過分組路由來組織應用程式。">模組</Links>中將其傳遞給 <code>install</code> 函數。
        下方的程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函數呼叫內部。
        </li>
        <li>
            ... 在明確定義的 <code>module</code> 內部，該模組是 <code>Application</code> 類別的擴展函數。
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
    

</tab>

<tab title="XForwardedHeader">

<var name="plugin_name" value="XForwardedHeaders"/>

    <p>
        若要<a href="#install">安裝</a> <code>%plugin_name%</code> 外掛程式到應用程式，
        請在指定的<Links href="/ktor/server-modules" summary="模組允許您通過分組路由來組織應用程式。">模組</Links>中將其傳遞給 <code>install</code> 函數。
        下方的程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函數呼叫內部。
        </li>
        <li>
            ... 在明確定義的 <code>module</code> 內部，該模組是 <code>Application</code> 類別的擴展函數。
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
    

</tab>
</tabs>

安裝 `ForwardedHeaders`/`XForwardedHeaders` 後，您可以使用 [call.request.origin](#request_info) 屬性獲取有關原始請求的資訊。

## 獲取請求資訊 {id="request_info"}

### 代理請求資訊 {id="proxy_request_info"}

若要獲取有關代理請求的資訊，請在 [路由處理器](server-routing.md#define_route) 內部使用 [call.request.local](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/local.html) 屬性。下方的程式碼片段展示了如何獲取有關代理位址和請求所指向的主機的資訊：

[object Promise]

### 原始請求資訊 {id="original-request-information"}

若要讀取有關原始請求的資訊，請使用 [call.request.origin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.plugins/origin.html) 屬性：

[object Promise]

下表顯示了 `call.request.origin` 暴露的不同屬性值，取決於 `ForwardedHeaders`/`XForwardedHeaders` 是否已安裝。

![請求圖表](forwarded-headers.png){width="706"}

| 屬性               | 無 ForwardedHeaders | 有 ForwarderHeaders |
|------------------------|--------------------------|-----------------------|
| `origin.localHost`     | _web 伺服器_             | _web 伺服器_          |
| `origin.localPort`     | _8080_                   | _8080_                |
| `origin.serverHost`    | _web 伺服器_             | _代理_               |
| `origin.serverPort`    | _8080_                   | _80_                  |
| `origin.remoteHost`    | _代理_                  | _客戶端_              |
| `origin.remotePort`    | _32864_                  | _32864_               |

> 您可以在此處找到完整範例：[forwarded-header](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/forwarded-header)。

## 配置 ForwardedHeaders {id="configure"}

如果請求通過多個代理，您可能需要配置 `ForwardedHeaders`/`XForwardedHeaders`。
在這種情況下，`X-Forwarded-For` 包含每個連續代理的所有 IP 位址，例如：

```HTTP
X-Forwarded-For: <client>, <proxy1>, <proxy2>
```

預設情況下，`XForwardedHeader` 會將 `X-Forwarded-For` 中的第一個條目分配給 `call.request.origin.remoteHost` 屬性。
您也可以提供自定義邏輯，用於[選擇 IP 位址](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For#selecting_an_ip_address)。 
[XForwardedHeadersConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-forwarded-header/io.ktor.server.plugins.forwardedheaders/-x-forwarded-headers-config/index.html) 為此暴露了以下 API：

- `useFirstProxy` 和 `useLastProxy` 分別允許您獲取 IP 位址列表中的第一個或最後一個值。
- `skipLastProxies` 會從右側開始跳過指定數量的條目並獲取下一個條目。
   例如，如果 `proxiesCount` 參數等於 `3`，`origin.remoteHost` 將對下方的標頭返回 `10.0.0.123`：
   ```HTTP
   X-Forwarded-For: 10.0.0.123, proxy-1, proxy-2, proxy-3
   ```
- `skipKnownProxies` 會從列表中移除指定的條目並獲取最後一個條目。
   例如，如果您將 `listOf("proxy-1", "proxy-3")` 傳遞給此函數，`origin.remoteHost` 將對下方的標頭返回 `proxy-2`：
   ```HTTP
   X-Forwarded-For: 10.0.0.123, proxy-1, proxy-2, proxy-3
   ```
- `extractEdgeProxy` 允許您提供自定義邏輯，用於從 `X-Forward-*` 標頭中提取值。