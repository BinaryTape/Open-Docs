[//]: # (title: 部分內容)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-partial-content"/>
<var name="package_name" value="io.ktor.server.plugins.partialcontent"/>
<var name="plugin_name" value="PartialContent"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<p>
<b>伺服器範例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/download-file">download-file</a>,
<b>客戶端範例</b>:
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-download-file-range">client-download-file-range</a>
</p>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-partial-content/io.ktor.server.plugins.partialcontent/-partial-content.html) 外掛程式 (plugin) 支援處理 [HTTP 範圍請求 (HTTP range requests)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Range_requests)，用於僅將 HTTP 訊息的一部分傳送回用戶端。此外掛程式對於串流內容或恢復部分下載非常有用。

`%plugin_name%` 具有以下限制：
- 僅適用於 `HEAD` 和 `GET` 請求，如果用戶端嘗試將 `Range` 標頭與其他方法一起使用，則會傳回 `405 Method Not Allowed`。
- 僅適用於已定義 `Content-Length` 標頭的回應。
- 在提供範圍時停用 [壓縮 (Compression)](server-compression.md)。

## 新增依賴項 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

若要了解如何使用 `%plugin_name%` 來使用 HTTP 範圍請求提供檔案，請參閱 [](server-responses.md#file) 章節。