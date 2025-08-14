[//]: # (title: DoubleReceive)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="DoubleReceive"/>
<var name="package_name" value="io.ktor.server.plugins.doublereceive"/>
<var name="artifact_name" value="ktor-server-double-receive"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="double-receive"/>

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

`[%plugin_name%]`プラグインは、`RequestAlreadyConsumedException`例外なしに[リクエストボディを複数回受信する](server-requests.md#body_contents)機能を提供します。
これは、[プラグイン](server-plugins.md)が既にリクエストボディを消費してしまい、ルートハンドラー内で受信できない場合に役立つことがあります。
例えば、`%plugin_name%`を使用して[CallLogging](server-call-logging.md)プラグインでリクエストボディをログに記録し、その後に`post` [ルートハンドラー](server-routing.md#define_route)内でもう一度ボディを受信できます。

> `%plugin_name%`プラグインは実験的なAPIを使用しており、今後のアップデートで破壊的変更を伴う進化が予想されます。
>
{type="note"}

## 依存関係の追加 {id="add_dependencies"}

    <p>
        <code>%plugin_name%</code>を使用するには、<code>%artifact_name%</code>アーティファクトをビルドスクリプトに含める必要があります:
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
        <code>%plugin_name%</code>プラグインをアプリケーションに<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>内の<code>install</code>関数に渡します。
        以下のコードスニペットは、<code>%plugin_name%</code>のインストール方法を示しています...
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
    

    <p>
        <code>%plugin_name%</code>プラグインは、<a href="#install-route">特定のルートにもインストール</a>できます。
        これは、異なるアプリケーションリソースに対して異なる<code>%plugin_name%</code>設定が必要な場合に役立つことがあります。
    </p>
    

`%plugin_name%`をインストールした後、[リクエストボディを複数回受信する](server-requests.md#body_contents)ことができ、呼び出すたびに同じインスタンスが返されます。
例えば、[CallLogging](server-call-logging.md)プラグインを使用してリクエストボディのロギングを有効にできます...

[object Promise]

...その後、ルートハンドラー内でもう一度リクエストボディを取得できます。

[object Promise]

完全な例は以下で確認できます: [double-receive](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/double-receive)。

## %plugin_name%の設定 {id="configure"}
デフォルト設定では、`%plugin_name%`は[リクエストボディを](server-requests.md#body_contents)以下の型として受信する機能を提供します:

- `ByteArray` 
- `String`
- `Parameters` 
- `ContentNegotiation`プラグインで使用される[データクラス](server-serialization.md#create_data_class)

デフォルトでは、`%plugin_name%`は以下をサポートしていません:

- 同じリクエストから異なる型を受信すること;
- [ストリームまたはチャネル](server-requests.md#raw)を受信すること。

同じリクエストから異なる型を受信したり、ストリームやチャネルを受信したりする必要がない場合は、`cacheRawRequest`プロパティを`false`に設定します:

```kotlin
install(DoubleReceive) {
    cacheRawRequest = false
}
```