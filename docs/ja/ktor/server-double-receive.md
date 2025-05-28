[//]: # (title: DoubleReceive)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="DoubleReceive"/>
<var name="package_name" value="io.ktor.server.plugins.doublereceive"/>
<var name="artifact_name" value="ktor-server-double-receive"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="double-receive"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-double-receive/io.ktor.server.plugins.doublereceive/-double-receive.html) プラグインは、`RequestAlreadyConsumedException` 例外なしで [リクエストボディを複数回受信する](server-requests.md#body_contents)機能を提供します。
これは、[プラグイン](server-plugins.md)がすでにリクエストボディを消費しているために、ルートハンドラー内でリクエストボディを受信できない場合に役立つことがあります。
例えば、[%plugin_name%] を使用して [CallLogging](server-call-logging.md) プラグインでリクエストボディをログに記録し、その後 `post` [ルートハンドラー](server-routing.md#define_route)内でボディをもう一度受信することができます。

> `%plugin_name%` プラグインは、今後のアップデートで互換性のない変更を伴って進化することが予想される実験的なAPIを使用しています。
>
{type="note"}

## 依存関係の追加 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name% のインストール {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

[%plugin_name%] をインストールすると、[リクエストボディを複数回受信する](server-requests.md#body_contents)ことができ、すべての呼び出しで同じインスタンスが返されます。
例えば、[CallLogging](server-call-logging.md) プラグインを使用してリクエストボディのログ記録を有効にできます...

```kotlin
```
{src="snippets/double-receive/src/main/kotlin/com/example/Application.kt" include-lines="16-23"}

...そしてルートハンドラー内でリクエストボディをもう一度取得します。

```kotlin
```
{src="snippets/double-receive/src/main/kotlin/com/example/Application.kt" include-lines="25-28"}

完全な例はこちらで確認できます: [double-receive](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/double-receive)。

## %plugin_name% の設定 {id="configure"}
デフォルト設定では、[%plugin_name%] は以下の型として [リクエストボディを受信する](server-requests.md#body_contents)機能を提供します。

- `ByteArray` 
- `String`
- `Parameters` 
- `ContentNegotiation` プラグインで使用される [データクラス](server-serialization.md#create_data_class)

デフォルトでは、[%plugin_name%] は以下をサポートしていません。

- 同じリクエストから異なる型を受け取ること
- [ストリームまたはチャネル](server-requests.md#raw)を受け取ること

同じリクエストから異なる型を受け取ったり、ストリームやチャネルを受け取ったりする必要がない場合は、`cacheRawRequest` プロパティを `false` に設定してください。

```kotlin
install(DoubleReceive) {
    cacheRawRequest = false
}
```