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
    <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>サポート</b>: ✅
</p>
</tldr>

`%plugin_name%`プラグインは、`RequestAlreadyConsumedException`例外なしに[リクエストボディを複数回受け取る](server-requests.md#body_contents)機能を提供します。
これは、[プラグイン](server-plugins.md)がすでにリクエストボディを消費してしまい、ルートハンドラー内でそれを受け取ることができない場合に役立ちます。
例えば、`%plugin_name%`を使用して、[CallLogging](server-call-logging.md)プラグインでリクエストボディをログに記録し、その後`post` [ルートハンドラー](server-routing.md#define_route)内で再度ボディを受け取ることができます。

> `%plugin_name%`プラグインは実験的なAPIを使用しており、今後のアップデートで進化し、破壊的な変更が発生する可能性があります。
>
{type="note"}

## 依存関係を追加する {id="add_dependencies"}

<p>
    <code>%plugin_name%</code>を使用するには、<code>%artifact_name%</code>アーティファクトをビルドスクリプトに含める必要があります。
</p>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## %plugin_name%をインストールする {id="install_plugin"}

<p>
    アプリケーションに<code>%plugin_name%</code>プラグインを<a href="#install">インストール</a>するには、指定された<Links href="/ktor/server-modules" summary="モジュールを使用すると、ルートをグループ化してアプリケーションを構造化できます。">モジュール</Links>内の<code>install</code>関数に渡します。
    以下のコードスニペットは、<code>%plugin_name%</code>をインストールする方法を示しています...
</p>
<list>
    <li>
        ... <code>embeddedServer</code>関数呼び出し内で。
    </li>
    <li>
        ... <code>Application</code>クラスの拡張関数である明示的に定義された<code>module</code>内で。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10                embeddedServer(Netty, port = 8080) {&#10                    install(%plugin_name%)&#10                    // ...&#10                }.start(wait = true)&#10            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10                install(%plugin_name%)&#10                // ...&#10            }"/>
    </TabItem>
</Tabs>
<p>
    <code>%plugin_name%</code>プラグインは、<a href="#install-route">特定のルートにもインストール</a>できます。
    これは、異なるアプリケーションリソースに対して異なる<code>%plugin_name%</code>設定が必要な場合に役立ちます。
</p>

`%plugin_name%`をインストールすると、[リクエストボディを複数回受け取る](server-requests.md#body_contents)ことができ、呼び出しごとに同じインスタンスが返されます。
例えば、[CallLogging](server-call-logging.md)プラグインを使用してリクエストボディのログを有効にすることができます...

```kotlin
install(CallLogging) {
    level = Level.TRACE
    format { call ->
        runBlocking {
            "Body: ${call.receiveText()}"
        }
    }
}
```

...そして、ルートハンドラー内でリクエストボディをもう一度取得します。

```kotlin
post("/") {
    val receivedText = call.receiveText()
    call.respondText("Text '$receivedText' is received")
}
```

完全な例はこちらで見つけることができます: [double-receive](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/double-receive)。

## %plugin_name%を設定する {id="configure"}
デフォルト設定では、`%plugin_name%`は[リクエストボディを](server-requests.md#body_contents)以下の型として受け取る機能を提供します。

- `ByteArray`
- `String`
- `Parameters`
- `ContentNegotiation`プラグインで使用される[データクラス](server-serialization.md#create_data_class)

デフォルトでは、`%plugin_name%`は以下をサポートしていません。

- 同じリクエストから異なる型を受け取ること;
- [ストリームまたはチャネル](server-requests.md#raw)を受け取ること。

同じリクエストから異なる型を受け取ったり、ストリームまたはチャネルを受け取ったりする必要がない場合は、`cacheRawRequest`プロパティを`false`に設定します。

```kotlin
install(DoubleReceive) {
    cacheRawRequest = false
}