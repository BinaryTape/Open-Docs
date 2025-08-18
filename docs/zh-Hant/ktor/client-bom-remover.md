[//]: # (title: BOM 移除器)

<var name="artifact_name" value="ktor-client-bom-remover"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>所需相依性</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-bom-remover"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
BOMRemover 外掛程式可讓您從回應本文中移除位元組順序標記 (BOM)。
</link-summary>

[位元組順序標記 (BOM)](https://en.wikipedia.org/wiki/Byte_order_mark) 是一種在 Unicode 檔案或資料流中編碼的字元。BOM 的主要目的是標示文字資料流的編碼以及 16 位元和 32 位元編碼的位元組順序。

在某些情況下，需要從回應本文中移除 BOM。例如，在 UTF-8 編碼中，BOM 的存在是可選的，當由不清楚如何處理 BOM 的軟體讀取時，它可能會造成問題。

Ktor 用戶端提供了 [BOMRemover](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-bom-remover/io.ktor.client.plugins.bomremover/index.html) 外掛程式，該外掛程式可從 UTF-8、UTF-16 (BE)、UTF-16 (LE)、UTF-32 (BE) 和 UTF-32 (LE) 編碼的回應本文中移除 BOM。

> 請注意，當移除 BOM 時，Ktor 不會更改 `Content-Length` 標頭，該標頭會保留初始回應的長度。
>
{style="note"}

## 新增相依性 {id="add_dependencies"}

若要使用 `BOMRemover`，您需要將 `%artifact_name%` artifact 納入建置腳本中：

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
    您可以從 <Links href="/ktor/client-dependencies" summary="瞭解如何將用戶端相依性新增到現有專案。">新增用戶端相依性</Links> 中瞭解更多關於 Ktor 用戶端所需的 artifact 資訊。
</p>

## 安裝 BOMRemover {id="install_plugin"}

若要安裝 `BOMRemover`，請在 [用戶端設定區塊](client-create-and-configure.md#configure-client) 內將其傳遞給 `install` 函式：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.compression.*
//...
val client = HttpClient(CIO) {
    install(BOMRemover)
}
```