[//]: # (title: BOMリムーバー)

<var name="artifact_name" value="ktor-client-bom-remover"/>
<primary-label ref="client-plugin"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-bom-remover"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
BOMRemoverプラグインを使用すると、レスポンスボディからバイトオーダーマーク (BOM) を除去できます。
</link-summary>

[バイトオーダーマーク (BOM)](https://en.wikipedia.org/wiki/Byte_order_mark) は、Unicodeファイルまたはストリームでエンコードされた文字です。BOMの主な目的は、テキストのストリームエンコーディングと、16ビットおよび32ビットエンコーディングのバイトオーダーを通知することです。

場合によっては、レスポンスボディからBOMを除去する必要があります。たとえば、UTF-8エンコーディングでは、BOMの存在はオプションであり、BOMの処理方法を知らないソフトウェアで読み取られると問題を引き起こす可能性があります。

Ktorクライアントは、UTF-8、UTF-16 (BE)、UTF-16 (LE)、UTF-32 (BE)、およびUTF-32 (LE) エンコーディングでレスポンスボディからBOMを除去する[BOMRemover](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-bom-remover/io.ktor.client.plugins.bomremover/index.html)プラグインを提供します。

> BOMを除去する際、Ktorは`Content-Length`ヘッダーを変更せず、初期レスポンスの長さを保持することに注意してください。
>
{style="note"}

## 依存関係の追加 {id="add_dependencies"}

`BOMRemover`を使用するには、ビルドスクリプトに`%artifact_name%`アーティファクトを含める必要があります。

<include from="lib.topic" element-id="add_ktor_artifact"/>
<include from="lib.topic" element-id="add_ktor_client_artifact_tip"/>

## BOMRemoverのインストール {id="install_plugin"}

`BOMRemover`をインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で`install`関数に渡します。

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.compression.*
//...
val client = HttpClient(CIO) {
    install(BOMRemover)
}