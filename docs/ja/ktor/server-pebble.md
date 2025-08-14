[//]: # (title: Pebble)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

[pebble_engine_builder]: https://pebbletemplates.io/com/mitchellbosecke/pebble/PebbleEngine/Builder/

<var name="plugin_name" value="Pebble"/>
<var name="package_name" value="io.ktor.server.pebble"/>
<var name="artifact_name" value="ktor-server-pebble"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="pebble"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>対応</b>: ✖️
    </p>
    
</tldr>

Ktorは、[Pebbleテンプレート](https://pebbletemplates.io/)をアプリケーション内のビューとして使用するために、[Pebble](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-pebble/io.ktor.server.pebble/-pebble)プラグインをインストールできます。

## 依存関係を追加する {id="add_dependencies"}

    <p>
        <code>%plugin_name%</code>を使用するには、ビルドスクリプトに<code>%artifact_name%</code>アーティファクトを含める必要があります:
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
    

## Pebbleをインストールする {id="install_plugin"}

    <p>
        アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、
        指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>の<code>install</code>関数に渡します。
        以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code>関数呼び出し内。
        </li>
        <li>
            ... 明示的に定義された<code>module</code>内。これは<code>Application</code>クラスの拡張関数です。
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
    

<code>install</code>ブロック内で、Pebbleテンプレートをロードするための[PebbleEngine.Builder][pebble_engine_builder]を[構成](#configure)できます。

## Pebbleを設定する {id="configure"}
### テンプレートのロードを設定する {id="template_loading"}
テンプレートをロードするには、[PebbleEngine.Builder][pebble_engine_builder]を使用してテンプレートのロード方法を設定する必要があります。例えば、以下のコードスニペットは、Ktorが現在のクラスパスに対する<code>templates</code>パッケージ内のテンプレートを検索できるようにします:

[object Promise]

### レスポンスでテンプレートを送信する {id="use_template"}
<code>resources/templates</code>に<code>index.html</code>テンプレートがあるとします:

[object Promise]

ユーザーのデータモデルは以下のようになります:

[object Promise]

指定された[ルート](server-routing.md)にテンプレートを使用するには、以下のように<code>PebbleContent</code>を<code>call.respond</code>メソッドに渡します:

[object Promise]