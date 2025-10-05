[//]: # (title: BOMリムーバー)

<var name="artifact_name" value="ktor-client-bom-remover"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-bom-remover"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
BOMRemover プラグインを使用すると、レスポンスボディからバイトオーダーマーク (BOM) を削除できます。
</link-summary>

[バイトオーダーマーク (BOM)](https://en.wikipedia.org/wiki/Byte_order_mark) は、Unicode ファイルまたはストリームでエンコードされた文字です。BOM の主な目的は、テキストのストリームエンコーディングと、16ビットおよび32ビットエンコーディングのバイトオーダーを示すことです。

場合によっては、レスポンスボディから BOM を削除する必要があります。たとえば、UTF-8 エンコーディングでは、BOM の存在は任意であり、BOM の処理方法を知らないソフトウェアで読み取られると問題を引き起こす可能性があります。

Ktor クライアントは、UTF-8、UTF-16 (BE)、UTF-16 (LE)、UTF-32 (BE)、および UTF-32 (LE) エンコーディングのレスポンスボディから BOM を削除する [BOMRemover](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-bom-remover/io.ktor.client.plugins.bomremover/index.html) プラグインを提供します。

> BOMを削除しても、Ktorは`Content-Length`ヘッダーを変更せず、初期レスポンスの長さを保持することに注意してください。
>
{style="note"}

## 依存関係を追加する {id="add_dependencies"}

`BOMRemover` を使用するには、ビルドスクリプトに `%artifact_name%` アーティファクトを含める必要があります。

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
    Ktor クライアントに必要なアーティファクトについては、<Links href="/ktor/client-dependencies" summary="既存のプロジェクトにクライアントの依存関係を追加する方法を学ぶ。">クライアントの依存関係の追加</Links> で詳しく学ぶことができます。
</p>

## BOMRemover をインストールする {id="install_plugin"}

`BOMRemover` をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client) 内の `install` 関数に渡します。

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.bomremover.*
//...
val client = HttpClient(CIO) {
    install(BOMRemover)
}