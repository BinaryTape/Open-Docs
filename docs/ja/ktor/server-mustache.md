[//]: # (title: Mustache)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[mustache_factory]: http://spullara.github.io/mustache/apidocs/com/github/mustachejava/MustacheFactory.html

<var name="plugin_name" value="Mustache"/>
<var name="package_name" value="io.ktor.server.mustache"/>
<var name="artifact_name" value="ktor-server-mustache"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="mustache"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">Native server</Links> のサポート</b>: ✖️
    </p>
    
</tldr>

Ktorでは、[Mustache テンプレート](https://github.com/spullara/mustache.java)をアプリケーション内のビューとして使用するために、[Mustache](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-mustache/io.ktor.server.mustache/-mustache) プラグインをインストールできます。

## 依存関係の追加 {id="add_dependencies"}

    <p>
        <code>%plugin_name%</code> を使用するには、ビルドスクリプトに <code>%artifact_name%</code> アーティファクトを含める必要があります:
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
    

## Mustache のインストール {id="install_plugin"}

    <p>
        アプリケーションに <code>%plugin_name%</code> プラグインを<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>内の <code>install</code> 関数に渡します。以下のコードスニペットは、<code>%plugin_name%</code> をインストールする方法を示しています...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code> 関数呼び出し内で。
        </li>
        <li>
            ... 明示的に定義された <code>module</code> 内で (これは <code>Application</code> クラスの拡張関数です)。
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
    

<code>install</code> ブロック内で、Mustache テンプレートの読み込み用に [MustacheFactory][mustache_factory] を[設定](#template_loading)できます。

## Mustache の設定 {id="configure"}
### テンプレートの読み込みを設定 {id="template_loading"}
テンプレートを読み込むには、[MustacheFactory][mustache_factory] を <code>mustacheFactory</code> プロパティに割り当てる必要があります。例えば、以下のコードスニペットは、現在のクラスパスを基準として <code>templates</code> パッケージ内のテンプレートを Ktor が検索できるようにします:
[object Promise]

### レスポンスでテンプレートを送信 {id="use_template"}
<code>resources/templates</code> に <code>index.hbs</code> テンプレートがあるとします:
[object Promise]

ユーザーのデータモデルは次のようになります:
[object Promise]

指定された[ルート](server-routing.md)にテンプレートを使用するには、<code>call.respond</code> メソッドに <code>MustacheContent</code> を次のように渡します:
[object Promise]