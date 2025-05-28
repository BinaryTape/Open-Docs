[//]: # (title: 内容编码)

<primary-label ref="client-plugin"/>

<var name="artifact_name" value="ktor-client-encoding"/>

<tldr>
<p>
<b>所需依赖</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-content-encoding"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
ContentEncoding 插件允许您启用指定的压缩算法（例如 'gzip' 和 'deflate'）并配置其设置。
</link-summary>

Ktor 客户端提供了 [ContentEncoding](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-encoding/io.ktor.client.plugins.compression/-content-encoding) 插件，该插件允许您启用指定的压缩算法（例如 `gzip` 和 `deflate`）并配置其设置。此插件主要有三个用途：
* 设置 `Accept-Encoding` 头并指定质量值。
* （可选）编码请求体。
* 解码[从服务器接收的内容](client-responses.md#body)以获取原始载荷。

## 添加依赖 {id="add_dependencies"}
要使用 `ContentEncoding`，您需要在构建脚本中包含 `%artifact_name%` 工件：

<include from="lib.topic" element-id="add_ktor_artifact"/>
<include from="lib.topic" element-id="add_ktor_client_artifact_tip"/>

## 安装 ContentEncoding {id="install_plugin"}
要安装 `ContentEncoding`，请在[客户端配置块](client-create-and-configure.md#configure-client)中将其传递给 `install` 函数：
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
下面的[示例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-content-encoding)展示了如何在客户端启用 `deflate` 和 `gzip` 编码器并指定质量值：

```kotlin
```
{src="snippets/client-content-encoding/src/main/kotlin/com/example/Application.kt" include-lines="16-21"}

如果需要，您可以实现 `ContentEncoder` 接口来创建自定义编码器，并将其传递给 `customEncoder` 函数。

## 编码请求体 {id="encode_request_body"}
要编码请求体，请在 [HttpRequestBuilder](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html) 块中使用 `compress()` 函数。
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