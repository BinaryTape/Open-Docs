[//]: # (title: 内容编码)

<primary-label ref="client-plugin"/>

<var name="artifact_name" value="ktor-client-encoding"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-content-encoding"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<link-summary>
ContentEncoding 插件允许您启用指定的压缩算法（例如 `gzip` 和 `deflate`）并配置其设置。
</link-summary>

Ktor 客户端提供了 [ContentEncoding](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-encoding/io.ktor.client.plugins.compression/-content-encoding) 插件，允许您启用指定的压缩算法（例如 `gzip` 和 `deflate`）并配置其设置。此插件有三个主要用途：
* 设置 `Accept-Encoding` 头并指定其质量值。
* 可选地对请求体进行编码。
* 解码[从服务器接收到的内容](client-responses.md#body)以获取原始有效负载。

## 添加依赖项 {id="add_dependencies"}
要使用 `ContentEncoding`，您需要在构建脚本中包含 `%artifact_name%` 构件：

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
        您可以从 <Links href="/ktor/client-dependencies" summary="了解如何将客户端依赖项添加到现有项目中。">添加客户端依赖项</Links> 中了解更多关于 Ktor 客户端所需的构件。
    </p>
    

## 安装 ContentEncoding {id="install_plugin"}
要安装 `ContentEncoding`，请将其传递给[客户端配置代码块](client-create-and-configure.md#configure-client)中的 `install` 函数：
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

[object Promise]

如果需要，您可以实现 `ContentEncoder` 接口来创建自定义编码器，并将其传递给 `customEncoder` 函数。

## 编码请求体 {id="encode_request_body"}
要编码请求体，请在 [HttpRequestBuilder](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.request/-http-request-builder/index.html) 代码块中使用 `compress()` 函数。
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