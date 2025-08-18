[//]: # (title: 轉送標頭)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-forwarded-header"/>
<var name="package_name" value="io.ktor.server.plugins.forwardedheaders"/>

<tldr>
<p>
<b>所需依賴項</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="forwarded-header"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，並允許您在沒有額外運行時或虛擬機器的情況下運行伺服器。">原生伺服器</Links>支援</b>：✅
</p>
</tldr>

當 Ktor 伺服器部署在反向代理後方時，[ForwardedHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-forwarded-header/io.ktor.server.plugins.forwardedheaders/-forwarded-headers.html) 和 [XForwardedHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-forwarded-header/io.ktor.server.plugins.forwardedheaders/-x-forwarded-headers.html) 外掛允許您處理反向代理標頭，以取得有關原始[請求](server-requests.md)的資訊。這對[日誌記錄](server-logging.md)目的可能很有用。

*   `ForwardedHeaders` 處理 `Forwarded` 標頭 ([RFC 7239](https://tools.ietf.org/html/rfc7239))
*   `XForwardedHeaders` 處理以下 `X-Forwarded-` 標頭：
    *   `X-Forwarded-Host`/`X-Forwarded-Server`
    *   `X-Forwarded-For`
    *   `X-Forwarded-By`
    *   `X-Forwarded-Proto`/`X-Forwarded-Protocol`
    *   `X-Forwarded-SSL`/`Front-End-Https`

> 為了防止篡改 `Forwarded` 標頭，如果您的應用程式只接受反向代理連線，請安裝這些外掛。
> 
{type="note"}

## 新增依賴項 {id="add_dependencies"}
要使用 `ForwardedHeaders`/`XForwardedHeaders` 外掛，您需要在建置腳本中包含 `%artifact_name%` artifact：

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

## 安裝外掛 {id="install_plugin"}

<Tabs>
<TabItem title="ForwardedHeader">

<var name="plugin_name" value="ForwardedHeaders"/>
<p>
    要將 <code>%plugin_name%</code> 外掛<a href="#install">安裝</a>到應用程式，
    請在指定的<Links href="/ktor/server-modules" summary="模組允許您通過分組路由來組織應用程式。">模組</Links>中將其傳遞給 <code>install</code> 函數。
    下面的程式碼片段展示了如何在以下位置安裝 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函數呼叫內部。
    </li>
    <li>
        ... 在明確定義的 <code>module</code> 內部，該模組是 <code>Application</code> 類別的擴展函數。
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

</TabItem>

<TabItem title="XForwardedHeader">

<var name="plugin_name" value="XForwardedHeaders"/>
<p>
    要將 <code>%plugin_name%</code> 外掛<a href="#install">安裝</a>到應用程式，
    請在指定的<Links href="/ktor/server-modules" summary="模組允許您通過分組路由來組織應用程式。">模組</Links>中將其傳遞給 <code>install</code> 函數。
    下面的程式碼片段展示了如何在以下位置安裝 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函數呼叫內部。
    </li>
    <li>
        ... 在明確定義的 <code>module</code> 內部，該模組是 <code>Application</code> 類別的擴展函數。
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

</TabItem>
</Tabs>

安裝 `ForwardedHeaders`/`XForwardedHeaders` 後，您可以使用 [call.request.origin](#request_info) 屬性來取得有關原始請求的資訊。

## 取得請求資訊 {id="request_info"}

### 代理請求資訊 {id="proxy_request_info"}

要取得有關代理請求的資訊，請在[路由處理器](server-routing.md#define_route)內部使用 [call.request.local](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.request/-application-request/local.html) 屬性。
下面的程式碼片段展示了如何取得有關代理位址以及請求所發送到的主機的資訊：

```kotlin
get("/hello") {
    val remoteHost = call.request.local.remoteHost
    val serverHost = call.request.local.serverHost
}
```

### 原始請求資訊 {id="original-request-information"}

要讀取有關原始請求的資訊，請使用 [call.request.origin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.plugins/origin.html) 屬性：

```kotlin
get("/hello") {
    val originRemoteHost = call.request.origin.remoteHost
    val originServerHost = call.request.origin.serverHost
}
```

下表顯示了 `call.request.origin` 所暴露的不同屬性值，具體取決於是否安裝了 `ForwardedHeaders`/`XForwardedHeaders`。

![Request diagram](forwarded-headers.png){width="706"}

| 屬性               | 未安裝 ForwardedHeaders | 已安裝 ForwarderHeaders |
|--------------------|-------------------------|-------------------------|
| `origin.localHost` | _網頁伺服器_            | _網頁伺服器_            |
| `origin.localPort` | _8080_                  | _8080_                  |
| `origin.serverHost`| _網頁伺服器_            | _代理_                  |
| `origin.serverPort`| _8080_                  | _80_                    |
| `origin.remoteHost`| _代理_                  | _客戶端_                |
| `origin.remotePort`| _32864_                 | _32864_                 |

> 您可以在這裡找到完整的範例：[forwarded-header](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/forwarded-header)。

## 配置 ForwardedHeaders {id="configure"}

如果請求經過多個代理，您可能需要配置 `ForwardedHeaders`/`XForwardedHeaders`。
在這種情況下，`X-Forwarded-For` 包含每個連續代理的所有 IP 位址，例如：

```HTTP
X-Forwarded-For: <client>, <proxy1>, <proxy2>
```

預設情況下，`XForwardedHeader` 將 `X-Forwarded-For` 中的第一個條目分配給 `call.request.origin.remoteHost` 屬性。
您還可以為[選擇 IP 位址](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Forwarded-For#selecting_an_ip_address)提供自訂邏輯。
[XForwardedHeadersConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-forwarded-header/io.ktor.server.plugins.forwardedheaders/-x-forwarded-headers-config/index.html) 暴露了以下 API：

*   `useFirstProxy` 和 `useLastProxy` 允許您分別從 IP 位址列表中取得第一個或最後一個值。
*   `skipLastProxies` 會跳過從右側開始的指定數量的條目，並取得下一個條目。
    例如，如果 `proxiesCount` 參數等於 `3`，對於以下標頭，`origin.remoteHost` 將返回 `10.0.0.123`：
    ```HTTP
    X-Forwarded-For: 10.0.0.123, proxy-1, proxy-2, proxy-3
    ```
*   `skipKnownProxies` 會從列表中移除指定的條目並取得最後一個條目。
    例如，如果您將 `listOf("proxy-1", "proxy-3")` 傳遞給此函數，對於以下標頭，`origin.remoteHost` 將返回 `proxy-2`：
    ```HTTP
    X-Forwarded-For: 10.0.0.123, proxy-1, proxy-2, proxy-3
    ```
*   `extractEdgeProxy` 允許您提供自訂邏輯來從 `X-Forward-*` 標頭中提取值。