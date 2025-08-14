[//]: # (title: Ktor Clientでのテスト)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-client-mock"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-testing-mock"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<web-summary>
Ktorは、エンドポイントに接続せずにHTTP呼び出しをシミュレートするMockEngineを提供します。
</web-summary>

<link-summary>
HTTP呼び出しをシミュレートするMockEngineを使用してクライアントをテストする方法を学びます。
</link-summary>

Ktorは、エンドポイントに接続せずにHTTP呼び出しをシミュレートする[MockEngine](https://api.ktor.io/ktor-client/ktor-client-mock/io.ktor.client.engine.mock/-mock-engine/index.html)を提供します。

## 依存関係を追加する {id="add_dependencies"}
`MockEngine`を使用する前に、ビルドスクリプトに`%artifact_name%`アーティファクトを含める必要があります。

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
    

## 使用方法 {id="usage"}

### クライアント設定を共有する {id="share-config"}

`MockEngine`を使用してクライアントをテストする方法を見てみましょう。クライアントが以下の設定を持つとします。
* リクエストには`CIO` [エンジン](client-engines.md)が使用されます。
* 受信したJSONデータをデシリアライズするために[Json](client-serialization.md)プラグインがインストールされています。

このクライアントをテストするには、その設定を`MockEngine`を使用するテストクライアントと共有する必要があります。設定を共有するには、コンストラクターパラメーターとしてエンジンを受け取り、クライアント設定を含むクライアントラッパークラスを作成できます。

[object Promise]

その後、`ApiClient`を以下のように使用して、`CIO`エンジンでHTTPクライアントを作成し、リクエストを行うことができます。

[object Promise]

### クライアントをテストする {id="test-client"}

クライアントをテストするには、リクエストパラメーターをチェックし、必要なコンテンツ（今回の場合はJSONオブジェクト）で応答できるハンドラーを持つ`MockEngine`インスタンスを作成する必要があります。

[object Promise]

その後、作成した`MockEngine`を渡して`ApiClient`を初期化し、必要なアサーションを行うことができます。

[object Promise]

完全な例はこちらで見つけることができます: [client-testing-mock](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-testing-mock)。