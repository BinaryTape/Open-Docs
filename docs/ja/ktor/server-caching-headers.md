[//]: # (title: キャッシュヘッダー)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="CachingHeaders"/>
<var name="package_name" value="io.ktor.server.plugins.cachingheaders"/>
<var name="artifact_name" value="ktor-server-caching-headers"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="caching-headers"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[CachingHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-caching-headers/io.ktor.server.plugins.cachingheaders/-caching-headers.html) プラグインは、HTTPキャッシングに使用される `Cache-Control` および `Expires` ヘッダーを構成する機能を追加します。[キャッシングを構成](#configure)するには、以下の方法があります:
- 画像、CSS、JavaScriptファイルなど、特定のコンテンツタイプに対して異なるキャッシング戦略を構成します。
- アプリケーションレベルでグローバルに、ルートレベルで、または特定のコールに対して、キャッシングオプションを指定します。

## 依存関係を追加する {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name% をインストールする {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

`%plugin_name%` をインストールした後、さまざまなコンテンツタイプに対して[キャッシング設定を構成](#configure)できます。

## キャッシングを構成する {id="configure"}
`%plugin_name%` プラグインを構成するには、特定の `ApplicationCall` とコンテンツタイプに対して指定されたキャッシングオプションを提供するために、[options](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-caching-headers/io.ktor.server.plugins.cachingheaders/-caching-headers-config/options.html) 関数を定義する必要があります。[caching-headers](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/caching-headers) の例のコードスニペットは、プレーンテキストとHTMLに対して `max-age` オプションを持つ `Cache-Control` ヘッダーを追加する方法を示しています:

```kotlin
```
{src="snippets/caching-headers/src/main/kotlin/cachingheaders/Application.kt" include-lines="14-24,52-53"}

[CachingOptions](https://api.ktor.io/ktor-http/io.ktor.http.content/-caching-options/index.html) オブジェクトは、パラメータとして `Cache-Control` および `Expires` ヘッダー値を受け入れます:

* `cacheControl` パラメータは [CacheControl](https://api.ktor.io/ktor-http/io.ktor.http/-cache-control/index.html) 値を受け入れます。`CacheControl.MaxAge` を使用して、`max-age` パラメータと、可視性、再検証オプションなどの関連設定を指定できます。`CacheControl.NoCache`/`CacheControl.NoStore` を使用してキャッシングを無効にできます。
* `expires` パラメータを使用すると、`Expires` ヘッダーを `GMTDate` または `ZonedDateTime` 値として指定できます。

### ルートレベル {id="configure-route"}

プラグインはグローバルにインストールできるだけでなく、[特定のルート](server-plugins.md#install-route)にもインストールできます。例えば、以下の例は `/index` ルートに指定されたキャッシングヘッダーを追加する方法を示しています:

```kotlin
```
{src="snippets/caching-headers/src/main/kotlin/cachingheaders/Application.kt" include-lines="25-32"}

### コールレベル {id="configure-call"}

よりきめ細やかなキャッシング設定が必要な場合、`ApplicationCall.caching` プロパティを使用してコールレベルでキャッシングオプションを構成できます。以下の例は、ユーザーがログインしているかどうかに応じてキャッシングオプションを構成する方法を示しています:

```kotlin
```
{src="snippets/caching-headers/src/main/kotlin/cachingheaders/Application.kt" include-lines="40-51"}

> ログインしているユーザー向けには、[Authentication](server-auth.md) プラグインと [Sessions](server-sessions.md) プラグインを使用できます。