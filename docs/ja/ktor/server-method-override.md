[//]: # (title: XHttpMethodOverride)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="XHttpMethodOverride"/>
<var name="package_name" value="io.ktor.server.plugins.methodoverride"/>
<var name="artifact_name" value="ktor-server-method-override"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx-method-override"/>

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
%plugin_name% は、X-HTTP-Method-Override ヘッダー内に HTTP 動詞をトンネリングする機能を提供します。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-method-override/io.ktor.server.plugins.methodoverride/-x-http-method-override.html)プラグインは、`X-HTTP-Method-Override` ヘッダー内にHTTP動詞をトンネリングする機能を提供します。
これは、サーバーAPIが複数のHTTP動詞（`GET`、`PUT`、`POST`、`DELETE`など）を処理するが、クライアントが特定の制限により限られた動詞セット（例えば、`GET`や`POST`）しか使用できない場合に役立つことがあります。
例えば、クライアントが`X-Http-Method-Override`ヘッダーを`DELETE`に設定したリクエストを送信した場合、Ktorは`delete` [ルートハンドラー](server-routing.md#define_route)を使用してこのリクエストを処理します。

## 依存関係を追加する {id="add_dependencies"}

    <p>
        <code>%plugin_name%</code>を使用するには、<code>%artifact_name%</code>アーティファクトをビルドスクリプトに含める必要があります。
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
    

## %plugin_name%をインストールする {id="install_plugin"}

    <p>
        アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルーティングをグループ化してアプリケーションを構造化できます。">モジュール</Links>の<code>install</code>関数に渡します。
        以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code>関数呼び出し内で。
        </li>
        <li>
            ... <code>Application</code>クラスの拡張関数である、明示的に定義された<code>module</code>内で。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

## %plugin_name%を設定する {id="configure"}

デフォルトでは、`%plugin_name%`は、リクエストを処理すべきルートを決定するために`X-Http-Method-Override`ヘッダーをチェックします。
<code>headerName</code>プロパティを使用してヘッダー名をカスタマイズできます。

## 例 {id="example"}

以下のHTTPリクエストは、`X-Http-Method-Override`ヘッダーが`DELETE`に設定された`POST`動詞を使用しています:

[object Promise]

`delete` [ルートハンドラー](server-routing.md#define_route)を使用してこのようなリクエストを処理するには、`%plugin_name%`をインストールする必要があります:

[object Promise]

完全な例は以下で確認できます: [json-kotlinx-method-override](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx-method-override)。