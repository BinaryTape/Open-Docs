[//]: # (title: 缓存头)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="CachingHeaders"/>
<var name="package_name" value="io.ktor.server.plugins.cachingheaders"/>
<var name="artifact_name" value="ktor-server-caching-headers"/>

<tldr>
<p>
<b>Required dependencies</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="caching-headers"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[CachingHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-caching-headers/io.ktor.server.plugins.cachingheaders/-caching-headers.html) 插件增加了配置用于 HTTP 缓存的 `Cache-Control` 和 `Expires` 头的能力。你可以通过以下方式[配置缓存](#configure)：
- 为特定的内容类型（如图片、CSS 和 JavaScript 文件等）配置不同的缓存策略。
- 在不同级别指定缓存选项：全局应用级别、路由级别或针对特定调用。

## 添加依赖 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

安装 `%plugin_name%` 后，你可以[配置](#configure)各种内容类型的缓存设置。

## 配置缓存 {id="configure"}
要配置 `%plugin_name%` 插件，你需要定义 `[options](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-caching-headers/io.ktor.server.plugins.cachingheaders/-caching-headers-config/options.html)` 函数，为给定的 `ApplicationCall` 和内容类型提供指定的缓存选项。[caching-headers](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/caching-headers) 示例中的代码片段展示了如何为纯文本和 HTML 添加带有 `max-age` 选项的 `Cache-Control` 头：

```kotlin
```
{src="snippets/caching-headers/src/main/kotlin/cachingheaders/Application.kt" include-lines="14-24,52-53"}

[CachingOptions](https://api.ktor.io/ktor-http/io.ktor.http.content/-caching-options/index.html) 对象接受 `Cache-Control` 和 `Expires` 头的值作为参数：

* `cacheControl` 参数接受 [CacheControl](https://api.ktor.io/ktor-http/io.ktor.http/-cache-control/index.html) 值。你可以使用 `CacheControl.MaxAge` 来指定 `max-age` 参数和相关设置，例如可见性、重新验证选项等。你可以通过使用 `CacheControl.NoCache`/`CacheControl.NoStore` 来禁用缓存。
* `expires` 参数允许你将 `Expires` 头指定为 `GMTDate` 或 `ZonedDateTime` 值。

### 路由级别 {id="configure-route"}

你不仅可以全局安装插件，还可以将其安装到[特定路由](server-plugins.md#install-route)。例如，下面的示例展示了如何为 `/index` 路由添加指定的缓存头：

```kotlin
```
{src="snippets/caching-headers/src/main/kotlin/cachingheaders/Application.kt" include-lines="25-32"}

### 调用级别 {id="configure-call"}

如果你需要更细粒度的缓存设置，可以使用 `ApplicationCall.caching` 属性在调用级别配置缓存选项。下面的示例展示了如何根据用户是否登录来配置缓存选项：

```kotlin
```
{src="snippets/caching-headers/src/main/kotlin/cachingheaders/Application.kt" include-lines="40-51"}

> 对于登录用户，你可以使用 [Authentication](server-auth.md) 和 [Sessions](server-sessions.md) 插件。