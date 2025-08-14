[//]: # (title: HSTS)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="HSTS"/>
<var name="package_name" value="io.ktor.server.plugins.hsts"/>
<var name="artifact_name" value="ktor-server-hsts"/>

<tldr>
<p>
<b>必需的依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="ssl-engine-main-hsts"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，允许您在没有额外运行时或虚拟机的情况下运行服务器。">Native server</Links> 支持</b>: ✅
    </p>
    
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-hsts/io.ktor.server.plugins.hsts/-h-s-t-s.html) 插件根据 [RFC 6797](https://tools.ietf.org/html/rfc6797) 向请求添加所需的 *HTTP 严格传输安全* 标头。当浏览器收到 HSTS 策略标头时，在给定周期内，它将不再尝试通过不安全连接连接到服务器。

> 请注意，HSTS 策略标头在不安全的 HTTP 连接上会被忽略。为了使 HSTS 生效，它应通过 [安全](server-ssl.md) 连接提供。

## 添加依赖项 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code>，您需要在构建脚本中包含 <code>%artifact_name%</code> 构件：
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
        要将 <code>%plugin_name%</code> 插件<a href="#install">安装</a>到应用程序，请在指定的 <Links href="/ktor/server-modules" summary="模块允许您通过分组路由来组织应用程序。">模块</Links> 中将其传递给 <code>install</code> 函数。
        下面的代码片段展示了如何安装 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函数调用内部。
        </li>
        <li>
            ... 在显式定义的 <code>module</code> 内部，它是 <code>Application</code> 类的一个扩展函数。
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
        <code>%plugin_name%</code> 插件也可以<a href="#install-route">安装到特定路由</a>。
        如果您需要针对不同的应用程序资源使用不同的 <code>%plugin_name%</code> 配置，这可能会很有用。
    </p>
    

## 配置 %plugin_name% {id="configure"}

`%plugin_name%` 通过 [HSTSConfig](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-hsts/io.ktor.server.plugins.hsts/-h-s-t-s-config/index.html) 暴露其设置。下面的示例展示了如何使用 `maxAgeInSeconds` 属性来指定客户端应将主机保留在已知 HSTS 主机列表中的时长：

[object Promise]

您还可以使用 `withHost` 为不同的主机提供不同的 HSTS 配置：

[object Promise]

完整示例请参见此处：[ssl-engine-main-hsts](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main-hsts)。