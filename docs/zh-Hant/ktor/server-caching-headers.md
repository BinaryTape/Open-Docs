[//]: # (title: 快取標頭)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="CachingHeaders"/>
<var name="package_name" value="io.ktor.server.plugins.cachingheaders"/>
<var name="artifact_name" value="ktor-server-caching-headers"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="caching-headers"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[CachingHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-caching-headers/io.ktor.server.plugins.cachingheaders/-caching-headers.html) 外掛程式增加了配置用於 HTTP 快取的 `Cache-Control` 和 `Expires` 標頭的功能。您可以透過以下方式[配置快取](#configure)：
- 為特定的內容類型（例如圖片、CSS 和 JavaScript 檔案等）配置不同的快取策略。
- 在不同層級指定快取選項：在應用程式層級全局配置、在路由層級配置或針對特定的呼叫配置。

## 新增依賴項 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

安裝 `%plugin_name%` 後，您可以為各種內容類型[配置](#configure)快取設定。

## 配置快取 {id="configure"}
要配置 `%plugin_name%` 外掛程式，您需要定義 [options](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-caching-headers/io.ktor.server.plugins.cachingheaders/-caching-headers-config/options.html) 函數，以便為給定的 `ApplicationCall` 和內容類型提供指定的快取選項。來自 [caching-headers](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/caching-headers) 範例的程式碼片段示範了如何為純文字和 HTML 新增帶有 `max-age` 選項的 `Cache-Control` 標頭：

```kotlin
```
{src="snippets/caching-headers/src/main/kotlin/cachingheaders/Application.kt" include-lines="14-24,52-53"}

[CachingOptions](https://api.ktor.io/ktor-http/io.ktor.http.content/-caching-options/index.html) 物件接受 `Cache-Control` 和 `Expires` 標頭值作為參數：

*   `cacheControl` 參數接受 [CacheControl](https://api.ktor.io/ktor-http/io.ktor.http/-cache-control/index.html) 值。您可以使用 `CacheControl.MaxAge` 來指定 `max-age` 參數和相關設定，例如可見性、重新驗證選項等等。您可以使用 `CacheControl.NoCache`/`CacheControl.NoStore` 停用快取。
*   `expires` 參數允許您將 `Expires` 標頭指定為 `GMTDate` 或 `ZonedDateTime` 值。

### 路由層級 {id="configure-route"}

您不僅可以全局安裝外掛程式，也可以安裝到[特定路由](server-plugins.md#install-route)上。例如，以下範例示範如何為 `/index` 路由新增指定的快取標頭：

```kotlin
```
{src="snippets/caching-headers/src/main/kotlin/cachingheaders/Application.kt" include-lines="25-32"}

### 呼叫層級 {id="configure-call"}

如果您需要更精細的快取設定，可以使用 `ApplicationCall.caching` 屬性在呼叫層級配置快取選項。以下範例示範如何根據使用者是否登入來配置快取選項：

```kotlin
```
{src="snippets/caching-headers/src/main/kotlin/cachingheaders/Application.kt" include-lines="40-51"}

> 針對登入使用者，您可以使用 [Authentication](server-auth.md) 和 [Sessions](server-sessions.md) 外掛程式。