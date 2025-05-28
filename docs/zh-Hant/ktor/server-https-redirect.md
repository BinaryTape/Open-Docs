[//]: # (title: HTTPS 重新導向)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="HttpsRedirect"/>
<var name="package_name" value="io.ktor.server.plugins.httpsredirect"/>
<var name="artifact_name" value="ktor-server-http-redirect"/>

<tldr>
<p>
<b>必要依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="ssl-engine-main-redirect"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-http-redirect/io.ktor.server.plugins.httpsredirect/-https-redirect.html) 插件會在處理請求之前，將所有 HTTP 請求重新導向至其 [HTTPS 對應項](server-ssl.md)。預設情況下，資源會回傳 `301 Moved Permanently`，但可以配置為 `302 Found`。

## 新增依賴項 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

上述程式碼以預設配置安裝 `%plugin_name%` 插件。

>當位於反向代理後方時，您需要安裝 `ForwardedHeader` 或 `XForwardedHeader` 插件以正確偵測 HTTPS 請求。如果您在安裝這些插件之一後遇到無限重新導向，請查看 [此常見問題解答](FAQ.topic#infinite-redirect) 以獲取更多詳細資訊。
>
{type="note"}

## 配置 %plugin_name% {id="configure"}

以下程式碼片段顯示如何配置所需的 HTTPS 埠並為請求的資源回傳 `301 Moved Permanently`：

```kotlin
```
{src="snippets/ssl-engine-main-redirect/src/main/kotlin/com/example/Application.kt" include-lines="11-14"}

您可以在此處找到完整範例：[ssl-engine-main-redirect](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main-redirect)。