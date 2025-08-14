[//]: # (title: Webjars)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Webjars"/>
<var name="package_name" value="io.ktor.server.webjars"/>
<var name="artifact_name" value="ktor-server-webjars"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="webjars"/>

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

<link-summary>
%plugin_name%プラグインは、WebJarsによって提供されるクライアントサイドライブラリの提供を可能にします。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-webjars/io.ktor.server.webjars/-webjars.html)プラグインは、[WebJars](https://www.webjars.org/)によって提供されるクライアントサイドライブラリの提供を可能にします。これにより、JavaScriptやCSSライブラリなどのアセットを[fat JAR](server-fatjar.md)の一部としてパッケージ化できます。

## 依存関係を追加する {id="add_dependencies"}
%plugin_name%を有効にするには、ビルドスクリプトに以下のアーティファクトを含める必要があります。
* `%artifact_name%`の依存関係を追加します。

  
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
    

* 必要なクライアントサイドライブラリの依存関係を追加します。以下の例は、Bootstrapアーティファクトを追加する方法を示しています。

  <var name="group_id" value="org.webjars"/>
  <var name="artifact_name" value="bootstrap"/>
  <var name="version" value="bootstrap_version"/>
  
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
    
  
  `$bootstrap_version`を`bootstrap`アーティファクトの必要なバージョン（例: `%bootstrap_version%`）に置き換えることができます。

## %plugin_name%をインストールする {id="install_plugin"}

    <p>
        アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>の<code>install</code>関数に渡します。
        以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
    </p>
    <list>
        <li>
            ...<code>embeddedServer</code>関数呼び出し内で。
        </li>
        <li>
            ...<code>Application</code>クラスの拡張関数である明示的に定義された<code>module</code>内で。
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
    

## %plugin_name%を構成する {id="configure"}

デフォルトでは、%plugin_name%はWebJarsのアセットを`/webjars`パスで提供します。以下の例は、これを変更し、すべてのWebJarsアセットを`/assets`パスで提供する方法を示しています。

[object Promise]

例えば、`org.webjars:bootstrap`依存関係をインストールした場合、<code>bootstrap.css</code>を以下のように追加できます。

[object Promise]

%plugin_name%を使用すると、依存関係のバージョンを変更しても、それらをロードするために使用するパスを変更する必要がないことに注意してください。

> 完全な例は、こちらで確認できます: [webjars](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/webjars)。