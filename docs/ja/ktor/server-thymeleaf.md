[//]: # (title: Thymeleaf)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Thymeleaf"/>
<var name="package_name" value="io.ktor.server.thymeleaf"/>
<var name="artifact_name" value="ktor-server-thymeleaf"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="thymeleaf"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor は Kotlin/Native をサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>のサポート</b>: ✖️
    </p>
    
</tldr>

Ktor では、[Thymeleaf](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-thymeleaf/io.ktor.server.thymeleaf/-thymeleaf) プラグインをインストールすることで、アプリケーション内で[Thymeleaf テンプレート](https://www.thymeleaf.org/)をビューとして使用できます。

## 依存関係の追加 {id="add_dependencies"}

    <p>
        <code>%plugin_name%</code> を使用するには、<code>%artifact_name%</code> アーティファクトをビルドスクリプトに含める必要があります:
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
    

## Thymeleaf のインストール {id="install_plugin"}

    <p>
        <code>%plugin_name%</code> プラグインをアプリケーションに<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>の <code>install</code> 関数に渡します。
        以下のコードスニペットは、<code>%plugin_name%</code> をインストールする方法を示しています...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code> 関数呼び出し内で。
        </li>
        <li>
            ... 明示的に定義された <code>module</code> (これは <code>Application</code> クラスの拡張関数です) 内で。
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
    

## Thymeleaf の設定 {id="configure"}
### テンプレート読み込みの設定 {id="template_loading"}
`install` ブロック内で、`ClassLoaderTemplateResolver` を設定できます。たとえば、以下のコードスニペットは、Ktor が現在のクラスパスを基準として `templates` パッケージ内の `*.html` テンプレートを検索できるようにします。
[object Promise]

### レスポンスでのテンプレート送信 {id="use_template"}
`resources/templates` に `index.html` テンプレートがあるとします。
[object Promise]

ユーザーのデータモデルは次のようになります。
[object Promise]

指定された[ルート](server-routing.md)にテンプレートを使用するには、次のように [ThymeleafContent](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-thymeleaf/io.ktor.server.thymeleaf/-thymeleaf-content/index.html) を `call.respond` メソッドに渡します。
[object Promise]

## 例: Thymeleaf テンプレートの自動リロード {id="auto-reload"}

以下の例は、[開発モード](server-development-mode.topic)が使用されている場合に、Thymeleaf テンプレートを自動的にリロードする方法を示しています。

[object Promise]

完全な例は以下で確認できます: [thymeleaf-auto-reload](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/thymeleaf-auto-reload)。