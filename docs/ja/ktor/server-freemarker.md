[//]: # (title: FreeMarker)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[freemarker_template_loading]: https://freemarker.apache.org/docs/pgui_config_templateloading.html

<var name="plugin_name" value="FreeMarker"/>
<var name="package_name" value="io.ktor.server.freemarker"/>
<var name="artifact_name" value="ktor-server-freemarker"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="freemarker"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>のサポート</b>: ✖️
    </p>
    
</tldr>

Ktorでは、[FreeMarkerプラグイン](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-freemarker/io.ktor.server.freemarker/-free-marker)をインストールすることで、[FreeMarkerテンプレート](https://freemarker.apache.org/)をアプリケーション内のビューとして使用できます。

## 依存関係を追加する {id="add_dependencies"}

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
    

## FreeMarkerをインストールする {id="install_plugin"}

    <p>
        アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>内の<code>install</code>関数に渡します。
        以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
    </p>
    <list>
        <li>
            ...<code>embeddedServer</code>関数呼び出し内で。
        </li>
        <li>
            ...<code>Application</code>クラスの拡張関数である、明示的に定義された<code>module</code>内で。
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
    

`install`ブロック内で、FreeMarkerテンプレートをロードするために目的の[TemplateLoader][freemarker_template_loading]を[設定](#configure)できます。

## FreeMarkerを設定する {id="configure"}
### テンプレートのロードを設定する {id="template_loading"}
テンプレートをロードするには、目的の[TemplateLoader][freemarker_template_loading]タイプを`templateLoader`プロパティに割り当てる必要があります。例えば、以下のコードスニペットは、Ktorが現在のクラスパスに対する`templates`パッケージ内のテンプレートを検索できるようにします。
[object Promise]

### レスポンスとしてテンプレートを送信する {id="use_template"}
`resources/templates`に`index.ftl`テンプレートがあると想像してください。
[object Promise]

ユーザーのデータモデルは次のようになります。
[object Promise]

指定された[ルート](server-routing.md)にテンプレートを使用するには、次のように`FreeMarkerContent`を`call.respond`メソッドに渡します。
[object Promise]