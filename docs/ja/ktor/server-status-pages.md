[//]: # (title: ステータスページ)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="StatusPages"/>
<var name="package_name" value="io.ktor.server.plugins.statuspages"/>
<var name="artifact_name" value="ktor-server-status-pages"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="status-pages"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor は Kotlin/Native をサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>対応</b>: ✅
    </p>
    
</tldr>

<link-summary>
%plugin_name% を使用すると、Ktorアプリケーションが、スローされた例外やステータスコードに基づいて、あらゆる失敗状態に適切に応答できるようになります。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-status-pages/io.ktor.server.plugins.statuspages/-status-pages.html)プラグインを使用すると、Ktorアプリケーションは、スローされた例外やステータスコードに基づいて、あらゆる失敗状態に適切に[応答](server-responses.md)できます。

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
        <code>%plugin_name%</code>プラグインをアプリケーションに<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>内の<code>install</code>関数に渡します。以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
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
    

## %plugin_name%の設定 {id="configure"}

`%plugin_name%`プラグインによって提供される主な設定オプションは3つあります。

- [例外](#exceptions): マップされた例外クラスに基づいて応答を設定します
- [ステータス](#status): ステータスコード値に応答を設定します
- [ステータスファイル](#status-file): クラスパスからのファイル応答を設定します

### 例外 {id="exceptions"}

`exception`ハンドラを使用すると、`Throwable`例外が発生する呼び出しを処理できます。最も基本的なケースでは、任意の例外に対して`500` HTTPステータスコードを設定できます。

```kotlin
install(StatusPages) {
    exception<Throwable> { call, cause ->
        call.respondText(text = "500: $cause" , status = HttpStatusCode.InternalServerError)
    }
}
```

特定の例外をチェックし、必要なコンテンツで応答することもできます。

[object Promise]

### ステータス {id="status"}

`status`ハンドラは、ステータスコードに基づいて特定のコンテンツで応答する機能を提供します。以下の例は、サーバー上でリソースが見つからない場合（`404`ステータスコード）のリクエストに応答する方法を示しています。

[object Promise]

### ステータスファイル {id="status-file"}

`statusFile`ハンドラを使用すると、ステータスコードに基づいてHTMLページを提供できます。プロジェクトに`resources`フォルダに`error401.html`と`error402.html`のHTMLページが含まれているとします。この場合、`statusFile`を使用して`401`と`402`のステータスコードを次のように処理できます。
[object Promise]

`statusFile`ハンドラは、設定されたステータスリスト内の`#`文字をステータスコードの値に置き換えます。

> 完全な例は[status-pages](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/status-pages)で確認できます。