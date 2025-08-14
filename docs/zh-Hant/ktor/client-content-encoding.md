[//]: # (title: 內容編碼)

<primary-label ref="client-plugin"/>

<var name="artifact_name" value="ktor-client-encoding"/>

<tldr>
<p>
<b>所需依賴</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-content-encoding"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<link-summary>
ContentEncoding 外掛允許您啟用指定的壓縮演算法（例如 'gzip' 和 'deflate'）並配置其設定。
</link-summary>

Ktor 客戶端提供了 [ContentEncoding](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-encoding/io.ktor.client.plugins.compression/-content-encoding) 外掛，它允許您啟用指定的壓縮演算法（例如 `gzip` 和 `deflate`）並配置其設定。此外掛有三個主要用途：
* 設定 `Accept-Encoding` 標頭並指定品質值。
* 可選擇性地編碼請求主體。
* 解碼[從伺服器接收的內容](client-responses.md#body)以取得原始酬載。

## 新增依賴 {id="add_dependencies"}
若要使用 `ContentEncoding`，您需要將 `%artifact_name%` artifact 包含在建置腳本中：

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
    

    <p>
        您可以從 <Links href="/ktor/client-dependencies" summary="了解如何將客戶端依賴新增至現有專案。">新增客戶端依賴</Links> 中了解更多關於 Ktor 客戶端所需的 artifacts。
    </p>
    

## 安裝 ContentEncoding {id="install_plugin"}
若要安裝 `ContentEncoding`，請在[客戶端配置區塊](client-create-and-configure.md#configure-client)內將其傳遞給 `install` 函式：
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
以下[範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-content-encoding)展示了如何在客戶端上啟用 `deflate` 和 `gzip` 編碼器並指定品質值：

[object Promise]

如果需要，您可以實作 `ContentEncoder` 介面以建立自訂編碼器，並將其傳遞給 `customEncoder` 函式。

## 編碼請求主體 {id="encode_request_body"}
若要編碼請求主體，請在 [HttpRequestBuilder](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html) 區塊內使用 `compress()` 函式。
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
```