[//]: # (title: Ktor Clientでのリクエストのトレース)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<var name="artifact_name" value="ktor-client-call-id"/>
<var name="package_name" value="io.ktor.client.plugins.callid"/>
<var name="plugin_name" value="CallId"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-call-id"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<link-summary>
%plugin_name% クライアントプラグインを使用すると、一意のコールIDを使用してクライアントリクエストをトレースできます。
</link-summary>

%plugin_name% プラグインを使用すると、一意のコールIDを使用してクライアントリクエストをエンドツーエンドでトレースできます。これは、マイクロサービスアーキテクチャにおいて、リクエストがいくつのサービスを経由しても、コールを追跡するのに特に役立ちます。

呼び出し元のスコープには、すでにコルーチンコンテキストにコールIDが含まれている場合があります。デフォルトでは、プラグインは現在のコンテキストを使用してコールIDを取得し、`HttpHeaders.XRequestId` ヘッダーを使用して特定のコールのコンテキストに追加します。

さらに、スコープにコールIDがない場合、プラグインを[設定](#configure)して新しいコールIDを生成および適用できます。

> サーバー側では、Ktorはクライアントリクエストをトレースするための[CallId](server-call-id.md)プラグインを提供します。

## 依存関係の追加 {id="add_dependencies"}

    <p>
        <code>%plugin_name%</code> を使用するには、ビルドスクリプトに <code>%artifact_name%</code> アーティファクトを含める必要があります。
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
    

## %plugin_name% のインストール {id="install_plugin"}

    <p>
        アプリケーションに <code>%plugin_name%</code> プラグインを<a href="#install">インストール</a>するには、指定された <Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>内の <code>install</code> 関数に渡します。
        以下のコードスニペットは、<code>%plugin_name%</code> をインストールする方法を示しています...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code> 関数呼び出し内。
        </li>
        <li>
            ... 明示的に定義された <code>module</code> 内 (これは <code>Application</code> クラスの拡張関数です)。
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
    

## %plugin_name% の設定 {id="configure"}

[CallIdConfig](https://api.ktor.io/ktor-client/ktor-client-plugins/ktor-client-call-id/io.ktor.client.plugins.callid/-call-id-config/index.html) クラスによって提供される %plugin_name% プラグインの設定により、コールIDを生成してコールコンテキストに追加できます。

### コールIDの生成

特定の要求に対してコールIDを生成する方法は次のいずれかです。

*   デフォルトで有効になっている `useCoroutineContext` プロパティは、現在の `CoroutineContext` を使用してコールIDを取得するジェネレーターを追加します。この機能を無効にするには、`useCoroutineContext` を `false` に設定します。

 [object Promise]

> Ktorサーバーでは、[CallIdプラグイン](server-call-id.md)を使用して、`CoroutineContext` にコールIDを追加します。

*   `generate()` 関数は、送信リクエストのコールIDを生成できます。コールIDの生成に失敗した場合は、`null` を返します。

 [object Promise]

複数のメソッドを使用してコールIDを生成できます。この方法では、最初の非null値が適用されます。

### コールIDの追加

コールIDを取得した後、リクエストに追加するための次のオプションが利用可能です。

*   `intercept()` 関数は、`CallIdInterceptor` を使用してリクエストにコールIDを追加できます。

 [object Promise]

*   `addToHeader()` 関数は、指定されたヘッダーにコールIDを追加します。ヘッダーをパラメータとして受け取り、デフォルトは `HttpHeaders.XRequestId` です。

 [object Promise]

## 例

次の例では、Ktorクライアント用の `%plugin_name%` プラグインが、新しいコールIDを生成してヘッダーに追加するように構成されています。

 [object Promise]

プラグインはコルーチンコンテキストを使用してコールIDを取得し、`generate()` 関数を利用して新しいものを生成します。その後、最初の非nullのコールIDは `addToHeader()` 関数を使用してリクエストヘッダーに適用されます。

Ktorサーバーでは、[サーバー用CallIdプラグイン](server-call-id.md)の[retrieve](server-call-id.md#retrieve)関数を使用して、ヘッダーからコールIDを取得できます。

 [object Promise]

このようにして、Ktorサーバーはリクエストの指定されたヘッダーのIDを取得し、それをコールの `callId` プロパティに適用します。

完全な例については、[client-call-id](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-call-id) を参照してください。