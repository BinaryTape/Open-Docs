[//]: # (title: BOMリムーバー)

<var name="artifact_name" value="ktor-client-bom-remover"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
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
BOMRemoverプラグインを使用すると、レスポンスボディからバイトオーダーマーク (BOM) を削除できます。
</link-summary>

[バイトオーダーマーク (BOM)](https://en.wikipedia.org/wiki/Byte_order_mark) は、Unicodeファイルまたはストリームにエンコードされた文字です。BOMの主な目的は、テキストのストリームエンコーディングと、16ビットおよび32ビットエンコーディングのバイトオーダーを通知することです。

場合によっては、レスポンスボディからBOMを削除する必要があります。例えば、UTF-8エンコーディングではBOMの存在はオプションであり、BOMの扱い方を知らないソフトウェアによって読み取られると、問題を引き起こす可能性があります。

Ktorクライアントは、UTF-8、UTF-16 (BE)、UTF-16 (LE)、UTF-32 (BE) および UTF-32 (LE) エンコーディングにおいて、レスポンスボディからBOMを削除する[BOMRemover](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-bom-remover/io.ktor.client.plugins.bomremover/index.html)プラグインを提供します。

> BOMを削除する際、Ktorは`Content-Length`ヘッダーを変更せず、初期レスポンスの長さを保持することに注意してください。
>
{style="note"}

## 依存関係の追加 {id="add_dependencies"}

`BOMRemover`を使用するには、ビルドスクリプトに`%artifact_name%`アーティファクトを含める必要があります。

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
        Ktorクライアントが必要とするアーティファクトについては、<Links href="/ktor/client-dependencies" summary="既存のプロジェクトにクライアントの依存関係を追加する方法を学びます。">クライアントの依存関係の追加</Links>で詳しく知ることができます。
    </p>

## BOMRemoverをインストールする {id="install_plugin"}

`BOMRemover`をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で`install`関数に渡します。

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.compression.*
//...
val client = HttpClient(CIO) {
    install(BOMRemover)
}