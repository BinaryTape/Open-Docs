[//]: # (title: デフォルトヘッダー)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-default-headers"/>
<var name="package_name" value="io.ktor.server.plugins.defaultheaders"/>
<var name="plugin_name" value="DefaultHeaders"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-default-headers/io.ktor.server.plugins.defaultheaders/-default-headers.html"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">ネイティブサーバー</Links>のサポート</b>: ✅
    </p>

</tldr>

[%plugin_name%](%plugin_api_link%)プラグインは、標準の`Server`および`Date`ヘッダーを各レスポンスに追加します。さらに、追加のデフォルトヘッダーを提供したり、`Server`ヘッダーを上書きしたりすることができます。

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

## %plugin_name%をインストールする {id="install_plugin"}

    <p>
        アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="Modules allow you to structure your application by grouping routes.">モジュール</Links>内で<code>install</code>関数に渡します。
        以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています。
    </p>
    <list>
        <li>
            ... <code>embeddedServer</code>関数呼び出し内で。
        </li>
        <li>
            ... 明示的に定義された<code>module</code>（<code>Application</code>クラスの拡張関数）内で。
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
        <code>%plugin_name%</code>プラグインは、<a href="#install-route">特定のルートにインストール</a>することもできます。
        これは、異なるアプリケーションリソースに対して異なる<code>%plugin_name%</code>構成が必要な場合に役立ちます。
    </p>

## %plugin_name%を設定する {id="configure"}
### 追加のヘッダーを追加する {id="add"}
デフォルトヘッダーのリストをカスタマイズするには、`header(name, value)`関数を使用して、必要なヘッダーを`install`に渡します。`name`パラメーターは`HttpHeaders`値を受け入れます。例：
```kotlin
    install(DefaultHeaders) {
        header(HttpHeaders.ETag, "7c876b7e")
    }
```
カスタムヘッダーを追加するには、その名前を文字列値として渡します。
```kotlin
    install(DefaultHeaders) {
        header("Custom-Header", "Some value")
    }
```

### ヘッダーを上書きする {id="override"}
`Server`ヘッダーを上書きするには、対応する`HttpHeaders`値を使用します。
```kotlin
    install(DefaultHeaders) {
        header(HttpHeaders.Server, "Custom")
    }
```
注意点として、`Date`ヘッダーはパフォーマンス上の理由からキャッシュされており、`%plugin_name%`を使用しても上書きできません。