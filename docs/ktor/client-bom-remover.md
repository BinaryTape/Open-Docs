[//]: # (title: BOM 移除器)

<var name="artifact_name" value="ktor-client-bom-remover"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-bom-remover"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
BOMRemover 插件允许你从响应体中移除字节顺序标记 (BOM)。
</link-summary>

[字节顺序标记 (BOM)](https://en.wikipedia.org/wiki/Byte_order_mark) 是 Unicode 文件或流中编码的一个字符。BOM 的主要目的是标识文本的流编码以及 16 位和 32 位编码的字节顺序。

在某些情况下，有必要从响应体中移除 BOM。例如，在 UTF-8 编码中，BOM 的存在是可选的，并且当不了解如何处理 BOM 的软件读取时，它可能会导致问题。

Ktor 客户端提供了 [BOMRemover](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-bom-remover/io.ktor.client.plugins.bomremover/index.html) 插件，该插件可从 UTF-8、UTF-16 (BE)、UTF-16 (LE)、UTF-32 (BE) 和 UTF-32 (LE) 编码的响应体中移除 BOM。

> 请注意，在移除 BOM 时，Ktor 不会改变 `Content-Length` 标头，它保留了初始响应的长度。
>
{style="note"}

## 添加依赖项 {id="add_dependencies"}

要使用 `BOMRemover`，你需要在构建脚本中包含 `%artifact_name%` 工件：

<include from="lib.topic" element-id="add_ktor_artifact"/>
<include from="lib.topic" element-id="add_ktor_client_artifact_tip"/>

## 安装 BOMRemover {id="install_plugin"}

要安装 `BOMRemover`，请将其传递给 [客户端配置块](client-create-and-configure.md#configure-client) 中的 `install` 函数：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.compression.*
//...
val client = HttpClient(CIO) {
    install(BOMRemover)
}
```