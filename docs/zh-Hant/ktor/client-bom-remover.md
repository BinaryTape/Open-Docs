[//]: # (title: BOM 移除器)

<var name="artifact_name" value="ktor-client-bom-remover"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>所需依賴項</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-bom-remover"/>

    <p>
        <b>程式碼範例</b>：
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<link-summary>
BOMRemover 外掛程式允許您從回應主體中移除位元組順序標記（BOM）。
</link-summary>

[位元組順序標記（BOM）](https://en.wikipedia.org/wiki/Byte_order_mark) 是一種在 Unicode 檔案或串流中編碼的字元。BOM 的主要目的是指示文字串流的編碼以及 16 位元和 32 位元編碼的位元組順序。

在某些情況下，需要從回應主體中移除 BOM。例如，在 UTF-8 編碼中，BOM 的存在是可選的，當軟體不知道如何處理 BOM 時，它可能會導致問題。

Ktor 客戶端提供了 [BOMRemover](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-bom-remover/io.ktor.client.plugins.bomremover/index.html) 外掛程式，該外掛程式可從 UTF-8、UTF-16 (BE)、UTF-16 (LE)、UTF-32 (BE) 和 UTF-32 (LE) 編碼的回應主體中移除 BOM。

> 請注意，在移除 BOM 時，Ktor 不會更改 `Content-Length` 標頭，該標頭保留了初始回應的長度。
>
{style="note"}

## 新增依賴項 {id="add_dependencies"}

要使用 `BOMRemover`，您需要在建置腳本中包含 `%artifact_name%` artifact：

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
        您可以從 <Links href="/ktor/client-dependencies" summary="了解如何將客戶端依賴項新增至現有專案。">新增客戶端依賴項</Links> 了解更多關於 Ktor 客戶端所需 artifact 的資訊。
    </p>
    

## 安裝 BOMRemover {id="install_plugin"}

要安裝 `BOMRemover`，請將其傳遞給 [客戶端組態區塊](client-create-and-configure.md#configure-client) 內的 `install` 函數：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.compression.*
//...
val client = HttpClient(CIO) {
    install(BOMRemover)
}
```