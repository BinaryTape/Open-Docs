[//]: # (title: BOM 移除器)

<var name="artifact_name" value="ktor-client-bom-remover"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-bom-remover"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
BOMRemover 外掛讓您能夠從回應主體中移除位元組順序記號 (BOM)。
</link-summary>

[位元組順序記號 (BOM)](https://en.wikipedia.org/wiki/Byte_order_mark) 是編碼在 Unicode 檔案或串流中的一個字元。BOM 的主要目的是指示文字的串流編碼以及 16 位元和 32 位元編碼的位元組順序。

在某些情況下，有必要從回應主體中移除 BOM。例如，在 UTF-8 編碼中，BOM 的存在是可選的，當無法處理 BOM 的軟體讀取時，它可能會造成問題。

Ktor 用戶端提供了 [BOMRemover](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-bom-remover/io.ktor.client.plugins.bomremover/index.html) 外掛，用於從 UTF-8、UTF-16 (BE)、UTF-16 (LE)、UTF-32 (BE) 和 UTF-32 (LE) 編碼的回應主體中移除 BOM。

> 請注意，當移除 BOM 時，Ktor 不會改變 `Content-Length` 標頭，該標頭保留了原始回應的長度。
>
{style="note"}

## 新增依賴項 {id="add_dependencies"}

若要使用 `BOMRemover`，您需要在建置腳本中包含 `%artifact_name%` artifact：

<include from="lib.topic" element-id="add_ktor_artifact"/>
<include from="lib.topic" element-id="add_ktor_client_artifact_tip"/>

## 安裝 BOMRemover {id="install_plugin"}

若要安裝 `BOMRemover`，請在 [用戶端配置區塊](client-create-and-configure.md#configure-client) 內部將它傳遞給 `install` 函數：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.compression.*
//...
val client = HttpClient(CIO) {
    install(BOMRemover)
}
```