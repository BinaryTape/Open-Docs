[//]: # (title: 內容編碼)

<primary-label ref="client-plugin"/>

<var name="artifact_name" value="ktor-client-encoding"/>

<tldr>
<p>
<b>必要依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-content-encoding"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
ContentEncoding 外掛程式允許您啟用指定的壓縮演算法 (例如 'gzip' 和 'deflate') 並配置其設定。
</link-summary>

Ktor 客戶端提供了 [ContentEncoding](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-encoding/io.ktor.client.plugins.compression/-content-encoding) 
外掛程式，允許您啟用指定的壓縮演算法 (例如 `gzip` 和 `deflate`) 並配置其設定。 此外掛程式主要有三個目的：
* 設定具有指定品質值的 `Accept-Encoding` 標頭。
* 選擇性地編碼請求主體。
* 解碼 [從伺服器接收到的內容](client-responses.md#body) 以取得原始負載。

## 新增依賴項 {id="add_dependencies"}
要使用 `ContentEncoding`，您需要在建構腳本中包含 `%artifact_name%` artifact：

<include from="lib.topic" element-id="add_ktor_artifact"/>
<include from="lib.topic" element-id="add_ktor_client_artifact_tip"/>

## 安裝 ContentEncoding {id="install_plugin"}
要安裝 `ContentEncoding`，請在 [客戶端配置區塊](client-create-and-configure.md#configure-client) 內將其傳遞給 `install` 函數：
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.compression.*
//...
val client = HttpClient(CIO) {
    install(ContentEncoding)
}
```

## 配置 ContentEncoding {id="configure_plugin"}
下面的 [範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-content-encoding) 展示了如何在客戶端上啟用 `deflate` 和 `gzip` 編碼器，並設定指定的品質值：

```kotlin
```
{src="snippets/client-content-encoding/src/main/kotlin/com/example/Application.kt" include-lines="16-21"}

如果需要，您可以實作 `ContentEncoder` 介面以建立自訂編碼器，並將其傳遞給 `customEncoder` 函數。

## 編碼請求主體 {id="encode_request_body"}
要編碼請求主體，請在 [HttpRequestBuilder](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html) 區塊內使用 `compress()` 函數。
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.compression.*
//...
val client = HttpClient(CIO) {
    install(ContentEncoding)
}
client.post("/upload") {
    compress("gzip")
    setBody(someLongBody)
}