[//]: # (title: キャッシュヘッダー)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="CachingHeaders"/>
<var name="package_name" value="io.ktor.server.plugins.cachingheaders"/>
<var name="artifact_name" value="ktor-server-caching-headers"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="caching-headers"/>

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

[CachingHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-caching-headers/io.ktor.server.plugins.cachingheaders/-caching-headers.html)プラグインは、HTTPキャッシングに使用される`Cache-Control`および`Expires`ヘッダーを設定する機能を追加します。キャッシングは以下の方法で[設定](#configure)できます。
- 画像、CSS、JavaScriptファイルなど、特定のコンテンツタイプに対して異なるキャッシング戦略を設定する。
- キャッシングオプションを異なるレベルで指定する: アプリケーションレベルでグローバルに、ルーティングレベルで、または特定の呼び出しに対して。

## 依存関係の追加 {id="add_dependencies"}

    <p>
        <code>%plugin_name%</code>を使用するには、ビルドスクリプトに<code>%artifact_name%</code>アーティファクトを含める必要があります。
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
        <code>%plugin_name%</code>プラグインをアプリケーションに<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>の<code>install</code>関数に渡します。
        以下のコードスニペットは、<code>%plugin_name%</code>のインストール方法を示しています。
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code>関数呼び出し内。
        </li>
        <li>
            ... <code>Application</code>クラスの拡張関数である、明示的に定義された<code>module</code>内。
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
        <code>%plugin_name%</code>プラグインは、<a href="#install-route">特定のルートにもインストール</a>できます。
        これは、異なるアプリケーションリソースに対して異なる<code>%plugin_name%</code>設定が必要な場合に役立ちます。
    </p>
    

`%plugin_name%`をインストールした後、さまざまなコンテンツタイプに対してキャッシュ設定を[構成](#configure)できます。

## キャッシングの設定 {id="configure"}
`%plugin_name%`プラグインを設定するには、特定の`ApplicationCall`とコンテンツタイプに対して指定されたキャッシングオプションを提供するために、[options](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-caching-headers/io.ktor.server.plugins.cachingheaders/-caching-headers-config/options.html)関数を定義する必要があります。[caching-headers](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/caching-headers)例のコードスニペットは、プレーンテキストとHTMLに対して`max-age`オプション付きの`Cache-Control`ヘッダーを追加する方法を示しています。

[object Promise]

[CachingOptions](https://api.ktor.io/ktor-http/io.ktor.http.content/-caching-options/index.html)オブジェクトは、`Cache-Control`および`Expires`ヘッダーの値をパラメータとして受け取ります。

*   `cacheControl`パラメータは[CacheControl](https://api.ktor.io/ktor-http/io.ktor.http/-cache-control/index.html)値を受け取ります。`CacheControl.MaxAge`を使用して、`max-age`パラメータおよび可視性、再検証オプションなどの関連設定を指定できます。`CacheControl.NoCache`/`CacheControl.NoStore`を使用してキャッシングを無効にできます。
*   `expires`パラメータを使用すると、`Expires`ヘッダーを`GMTDate`または`ZonedDateTime`値として指定できます。

### ルートレベル {id="configure-route"}

プラグインはグローバルにインストールするだけでなく、[特定のルート](server-plugins.md#install-route)にもインストールできます。例えば、以下の例は、`/index`ルートに指定されたキャッシングヘッダーを追加する方法を示しています。

[object Promise]

### コールレベル {id="configure-call"}

より詳細なキャッシング設定が必要な場合は、`ApplicationCall.caching`プロパティを使用してコールレベルでキャッシングオプションを設定できます。以下の例は、ユーザーがログインしているかどうかに応じてキャッシングオプションを設定する方法を示しています。

[object Promise]

> ユーザーのログインには、[Authentication](server-auth.md)および[Sessions](server-sessions.md)プラグインを使用できます。