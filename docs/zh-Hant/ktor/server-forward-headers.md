[//]: # (title: 轉發標頭)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-forwarded-header"/>
<var name="package_name" value="io.ktor.server.plugins.forwardedheaders"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="forwarded-header"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

當 Ktor 伺服器位於反向代理後方時，[ForwardedHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-forwarded-header/io.ktor.server.plugins.forwardedheaders/-forwarded-headers.html) 和 [XForwardedHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-forwarded-header/io.ktor.server.plugins.forwardedheaders/-x-forwarded-headers.html) 插件允許您處理反向代理標頭，以獲取原始 [請求](server-requests.md) 的資訊。這對於 [日誌記錄](server-logging.md) 目的可能很有用。

*   `ForwardedHeaders` 處理 `Forwarded` 標頭 ([RFC 7239](https://tools.ietf.org/html/rfc7239))
*   `XForwardedHeaders` 處理以下 `X-Forwarded-` 標頭：
    *   `X-Forwarded-Host`/`X-Forwarded-Server`
    *   `X-Forwarded-For`
    *   `X-Forwarded-By`
    *   `X-Forwarded-Proto`/`X-Forwarded-Protocol`
    *   `X-Forwarded-SSL`/`Front-End-Https`

> 為了防止篡改 `Forwarded` 標頭，如果您的應用程式只接受反向代理連線，請安裝這些插件。
> 
{type="note"}

## 新增依賴項 {id="add_dependencies"}
要使用 `ForwardedHeaders`/`XForwardedHeaders` 插件，您需要將 `%artifact_name%` 構件包含在建置腳本中：

<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝插件 {id="install_plugin"}

<tabs>
<tab title="ForwardedHeader">

<var name="plugin_name" value="ForwardedHeaders"/>
<include from="lib.topic" element-id="install_plugin"/>

</tab>

<tab title="XForwardedHeader">

<var name="plugin_name" value="XForwardedHeaders"/>
<include from="lib.topic" element-id="install_plugin"/>

</tab>
</tabs>

安裝 `ForwardedHeaders`/`XForwardedHeaders` 後，您可以使用 [call.request.origin](#request_info) 屬性獲取原始請求的資訊。

## 獲取請求資訊 {id="request_info"}

### 代理請求資訊 {id="proxy_request_info"}

要獲取代理請求的資訊，請在 [路由處理器](server-routing.md#define_route) 內部使用 [call.request.local](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/local.html) 屬性。
以下程式碼片段展示了如何獲取代理位址和請求的目標主機的資訊：

```kotlin
```
{src="snippets/forwarded-header/src/main/kotlin/com/example/Application.kt" include-lines="17-19,25"}

### 原始請求資訊 {id="original-request-information"}

要讀取原始請求的資訊，請使用 [call.request.origin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.plugins/origin.html) 屬性：

```kotlin
```
{src="snippets/forwarded-header/src/main/kotlin/com/example/Application.kt" include-lines="17,20-21,25"}

下表顯示了 `call.request.origin` 暴露的不同屬性值，取決於是否安裝了 `ForwardedHeaders`/`XForwardedHeaders`。

![請求圖表](forwarded-headers.png){width="706"}

| 屬性                   | 未安裝 ForwardedHeaders | 已安裝 ForwarderHeaders |
|------------------------|--------------------------|-----------------------|
| `origin.localHost`     | _web-server_             | _web-server_          |
| `origin.localPort`     | _8080_                   | _8080_                |
| `origin.serverHost`    | _web-server_             | _proxy_               |
| `origin.serverPort`    | _8080_                   | _80_                  |
| `origin.remoteHost`    | _proxy_                  | _client_              |
| `origin.remotePort`    | _32864_                  | _32864_               |

> 您可以在此處找到完整範例：[forwarded-header](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/forwarded-header)。

## 設定 ForwardedHeaders {id="configure"}

如果請求通過多個代理，您可能需要設定 `ForwardedHeaders`/`XForwardedHeaders`。
在此情況下，`X-Forwarded-For` 包含每個後續代理的所有 IP 位址，例如：

```HTTP
X-Forwarded-For: <client>, <proxy1>, <proxy2>
```

預設情況下，`XForwardedHeader` 將 `X-Forwarded-For` 中的第一個條目分配給 `call.request.origin.remoteHost` 屬性。
您還可以提供自訂邏輯用於 [選擇 IP 位址](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For#selecting_an_ip_address)。
[XForwardedHeadersConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-forwarded-header/io.ktor.server.plugins.forwardedheaders/-x-forwarded-headers-config/index.html) 暴露了以下 API 用於此目的：

*   `useFirstProxy` 和 `useLastProxy` 允許您分別從 IP 位址列表中獲取第一個或最後一個值。
*   `skipLastProxies` 從右側開始跳過指定數量的條目，然後獲取下一個條目。
    例如，如果 `proxiesCount` 參數等於 `3`，`origin.remoteHost` 將對以下標頭返回 `10.0.0.123`：
    ```HTTP
    X-Forwarded-For: 10.0.0.123, proxy-1, proxy-2, proxy-3
    ```
*   `skipKnownProxies` 從列表中刪除指定的條目並獲取最後一個條目。
    例如，如果您將 `listOf("proxy-1", "proxy-3")` 傳遞給此函數，`origin.remoteHost` 將對以下標頭返回 `proxy-2`：
    ```HTTP
    X-Forwarded-For: 10.0.0.123, proxy-1, proxy-2, proxy-3
    ```
*   `extractEdgeProxy` 允許您提供自訂邏輯以從 `X-Forward-*` 標頭中提取值。