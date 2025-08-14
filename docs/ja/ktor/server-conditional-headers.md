[//]: # (title: 条件付きヘッダー)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-conditional-headers"/>
<var name="package_name" value="io.ktor.server.plugins.conditionalheaders"/>
<var name="plugin_name" value="ConditionalHeaders"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="conditional-headers"/>

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

[ConditionalHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-conditional-headers/io.ktor.server.plugins.conditionalheaders/-conditional-headers.html)プラグインは、前回のリクエストからコンテンツのボディが変更されていない場合、その送信を回避します。これは、以下のヘッダーを使用することで実現されます。
*   `Last-Modified`レスポンスヘッダーには、リソースの最終変更時刻が含まれています。例えば、クライアントのリクエストに`If-Modified-Since`の値が含まれている場合、Ktorは指定された日付以降にリソースが変更されている場合にのみ、完全なレスポンスを送信します。なお、[静的ファイル](server-static-content.md)の場合、Ktorは[`ConditionalHeaders`をインストール](#install_plugin)した後、`Last-Modified`ヘッダーを自動的に追加します。
*   `Etag`レスポンスヘッダーは、特定のリソースバージョンの識別子です。例えば、クライアントのリクエストに`If-None-Match`の値が含まれている場合、Ktorはこの値が`Etag`と一致する場合には完全なレスポンスを送信しません。[`ConditionalHeaders`を設定](#configure)する際に、`Etag`の値を指定できます。

## 依存関係の追加 {id="add_dependencies"}

    <p>
        `%plugin_name%`を使用するには、ビルドスクリプトに`%artifact_name%`アーティファクトを含める必要があります。
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
    

## %plugin_name%のインストール {id="install_plugin"}

    <p>
        `%plugin_name%`プラグインをアプリケーションに<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>内の`install`関数に渡します。以下のコードスニペットは、`%plugin_name%`をインストールする方法を示しています...
    </p>
    <list>
        <li>
            ... `embeddedServer`関数呼び出しの内部。
        </li>
        <li>
            ... 明示的に定義された`module`（`Application`クラスの拡張関数）の内部。
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
    

    <p>
        `%plugin_name%`プラグインは、<a href="#install-route">特定のルートにもインストール</a>できます。これは、アプリケーションの異なるリソースに対して異なる`%plugin_name%`設定が必要な場合に役立つかもしれません。
    </p>
    

## ヘッダーの設定 {id="configure"}

`%plugin_name%`を設定するには、`install`ブロック内で[version](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-conditional-headers/io.ktor.server.plugins.conditionalheaders/-conditional-headers-config/version.html)関数を呼び出す必要があります。この関数は、特定の`ApplicationCall`と`OutgoingContent`に対するリソースバージョンのリストへのアクセスを提供します。必要なバージョンは、[EntityTagVersion](https://api.ktor.io/ktor-http/io.ktor.http.content/-entity-tag-version/index.html)と[LastModifiedVersion](https://api.ktor.io/ktor-http/io.ktor.http.content/-last-modified-version/index.html)クラスオブジェクトを使用して指定できます。

以下のコードスニペットは、CSSに`Etag`と`Last-Modified`ヘッダーを追加する方法を示しています:
[object Promise]

完全な例は[conditional-headers](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/conditional-headers)で確認できます。