[//]: # (title: 缓存头)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="CachingHeaders"/>
<var name="package_name" value="io.ktor.server.plugins.cachingheaders"/>
<var name="artifact_name" value="ktor-server-caching-headers"/>

<tldr>
<p>
<b>必需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="caching-headers"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，并允许你无需额外运行时或虚拟机即可运行服务器。">原生服务器</Links>支持</b>: ✅
    </p>
    
</tldr>

[CachingHeaders](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-caching-headers/io.ktor.server.plugins.cachingheaders/-caching-headers.html) 插件增加了配置用于 HTTP 缓存的 `Cache-Control` 和 `Expires` 头的功能。你可以通过以下方式[配置缓存](#configure)：
- 为特定的内容类型（例如图片、CSS 和 JavaScript 文件等）配置不同的缓存策略。
- 在不同级别指定缓存选项：全局在应用程序级别、在路由级别，或用于特定调用。

## 添加依赖项 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，你需要在构建脚本中包含 <code>%artifact_name%</code> artifact：
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
    

## 安装 %plugin_name% {id="install_plugin"}

    <p>
        要[安装](#install) <code>%plugin_name%</code> 插件到应用程序，
        将其传递给指定的 <Links href="/ktor/server-modules" summary="模块允许你通过分组路由来组织应用程序。">模块</Links> 中的 <code>install</code> 函数。
        以下代码片段展示了如何安装 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函数调用内部。
        </li>
        <li>
            ... 在显式定义的 <code>module</code> 内部，该 <code>module</code> 是 <code>Application</code> 类的扩展函数。
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
        <code>%plugin_name%</code> 插件也可以[安装到特定路由](#install-route)。
        如果你需要为不同的应用程序资源使用不同的 <code>%plugin_name%</code> 配置，这可能很有用。
    </p>
    

安装 `%plugin_name%` 之后，你可以[配置](#configure)各种内容类型的缓存设置。

## 配置缓存 {id="configure"}
要配置 `%plugin_name%` 插件，你需要定义 [options](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-caching-headers/io.ktor.server.plugins.cachingheaders/-caching-headers-config/options.html) 函数，以为给定的 `ApplicationCall` 和内容类型提供指定的缓存选项。来自 [caching-headers](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/caching-headers) 示例的代码片段展示了如何为纯文本和 HTML 添加带有 `max-age` 选项的 `Cache-Control` 头：

[object Promise]

[CachingOptions](https://api.ktor.io/ktor-http/io.ktor.http.content/-caching-options/index.html) 对象接受 `Cache-Control` 和 `Expires` 头值作为形参：

* `cacheControl` 形参接受一个 [CacheControl](https://api.ktor.io/ktor-http/io.ktor.http/-cache-control/index.html) 值。你可以使用 `CacheControl.MaxAge` 来指定 `max-age` 形参和相关设置，例如可见性、重新验证选项等。你可以使用 `CacheControl.NoCache`/`CacheControl.NoStore` 来禁用缓存。
* `expires` 形参允许你将 `Expires` 头指定为 `GMTDate` 或 `ZonedDateTime` 值。

### 路由级别 {id="configure-route"}

你可以不仅全局安装插件，还可以[安装到特定路由](server-plugins.md#install-route)。例如，下面的示例展示了如何为 `/index` 路由添加指定的缓存头：

[object Promise]

### 调用级别 {id="configure-call"}

如果你需要更细粒度的缓存设置，你可以在调用级别使用 `ApplicationCall.caching` 属性配置缓存选项。下面的示例展示了如何根据用户是否已登录来配置缓存选项：

[object Promise]

> 对于登录用户，你可以使用 [Authentication](server-auth.md) 和 [Sessions](server-sessions.md) 插件。