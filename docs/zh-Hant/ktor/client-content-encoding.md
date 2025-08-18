[//]: # (title: 內容編碼)

<primary-label ref="client-plugin"/>

<var name="artifact_name" value="ktor-client-encoding"/>

<tldr>
<p>
<b>必要依賴</b>: <code>io.ktor:%artifact_name%</code>
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
ContentEncoding 外掛程式允許您啟用指定的壓縮演算法（例如 'gzip' 和 'deflate'）並配置其設定。
</link-summary>

Ktor 客戶端提供了 [ContentEncoding](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-encoding/io.ktor.client.plugins.compression/-content-encoding) 外掛程式，允許您啟用指定的壓縮演算法（例如 `gzip` 和 `deflate`）並配置其設定。此外掛程式具有三個主要目的：
* 設定 `Accept-Encoding` 標頭並指定品質值。
* 選擇性地編碼請求主體。
* 解碼[從伺服器接收的內容](client-responses.md#body)以獲取原始負載。

## 新增依賴項 {id="add_dependencies"}
若要使用 `ContentEncoding`，您需要在建置腳本中包含 `%artifact_name%` 構件：

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
<p>
    您可以從 <Links href="/ktor/client-dependencies" summary="了解如何將客戶端依賴項新增到現有專案。">新增客戶端依賴項</Links> 了解更多 Ktor 客戶端所需的構件。
</p>

## 安裝 ContentEncoding {id="install_plugin"}
若要安裝 `ContentEncoding`，請在[客戶端配置區塊](client-create-and-configure.md#configure-client)中將其傳遞給 `install` 函數：
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
以下[範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-content-encoding)展示了如何在客戶端啟用 `deflate` 和 `gzip` 編碼器並指定品質值：

```kotlin
val client = HttpClient(CIO) {
    install(ContentEncoding) {
        deflate(1.0F)
        gzip(0.9F)
    }
}
```

如果需要，您可以實作 `ContentEncoder` 介面以建立自訂編碼器，並將其傳遞給 `customEncoder` 函數。

## 編碼請求主體 {id="encode_request_body"}
若要編碼請求主體，請在 [HttpRequestBuilder](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html) 區塊中使用 `compress()` 函數。
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