[//]: # (title: AutoHeadResponseプラグイン)

<var name="plugin_name" value="AutoHeadResponse"/>
<var name="artifact_name" value="ktor-server-auto-head-response"/>
<primary-label ref="server-plugin"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="autohead"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>のサポート</b>: ✅
    </p>
    
</tldr>

<link-summary>
%plugin_name%は、GETが定義されているすべてのルートに対してHEADリクエストに自動的に応答する機能を提供します。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auto-head-response/io.ktor.server.plugins.autohead/-auto-head-response.html)プラグインは、`GET`が定義されているすべてのルートに対して`HEAD`リクエストに自動的に応答する機能を提供します。クライアントで実際のコンテンツを取得する前に、何らかの方法で応答を処理する必要がある場合、個別の[head](server-routing.md#define_route)ハンドラーを作成するのを避けるために`%plugin_name%`を使用できます。たとえば、[respondFile](server-responses.md#file)関数を呼び出すと、`Content-Length`ヘッダーと`Content-Type`ヘッダーが応答に自動的に追加され、ファイルをダウンロードする前にクライアントでこの情報を取得できます。

## 依存関係を追加する {id="add_dependencies"}

    <p>
        <code>%plugin_name%</code>を使用するには、ビルドスクリプトに`%artifact_name%`アーティファクトを含める必要があります:
    </p>
    

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
    

## 使用方法
この機能を利用するには、アプリケーションに`AutoHeadResponse`プラグインをインストールする必要があります。

[object Promise]

今回の場合、`/home`ルートは、この動詞に対する明示的な定義がなくても、`HEAD`リクエストに応答するようになります。

このプラグインを使用している場合、同じ`GET`ルートに対するカスタム`HEAD`定義は無視されることに注意してください。

## オプション
`%plugin_name%`は、追加の構成オプションを提供しません。