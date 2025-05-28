[//]: # (title: HSTS)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="HSTS"/>
<var name="package_name" value="io.ktor.server.plugins.hsts"/>
<var name="artifact_name" value="ktor-server-hsts"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="ssl-engine-main-hsts"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-hsts/io.ktor.server.plugins.hsts/-h-s-t-s.html) プラグインは、[RFC 6797](https://tools.ietf.org/html/rfc6797) に従って、必要な _HTTP Strict Transport Security_ ヘッダーをリクエストに追加します。ブラウザが HSTS ポリシーヘッダーを受信すると、指定された期間、安全でない接続でサーバーに接続しようとしなくなります。

> なお、HSTS ポリシーヘッダーは安全でない HTTP 接続では無視されます。HSTS を有効にするには、[安全な](server-ssl.md)接続を介して提供される必要があります。

## 依存関係の追加 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name% のインストール {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

## %plugin_name% の設定 {id="configure"}

`%plugin_name%` は、[HSTSConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-hsts/io.ktor.server.plugins.hsts/-h-s-t-s-config/index.html) を介してその設定を公開します。以下の例は、クライアントが既知の HSTS ホストのリストにホストを保持する期間を指定するために `maxAgeInSeconds` プロパティを使用する方法を示しています。

```kotlin
```
{src="snippets/ssl-engine-main-hsts/src/main/kotlin/com/example/Application.kt" include-lines="11-12,17"}

また、`withHost` を使用して異なる HSTS 設定を異なるホストに提供することもできます。

```kotlin
```
{src="snippets/ssl-engine-main-hsts/src/main/kotlin/com/example/Application.kt" include-lines="11-17"}

完全な例はこちらで確認できます: [ssl-engine-main-hsts](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main-hsts)。