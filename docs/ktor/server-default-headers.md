[//]: # (title: 默认头部)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-default-headers"/>
<var name="package_name" value="io.ktor.server.plugins.defaultheaders"/>
<var name="plugin_name" value="DefaultHeaders"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-default-headers/io.ktor.server.plugins.defaultheaders/-default-headers.html"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor 支持 Kotlin/Native，允许您无需额外的运行时或虚拟机即可运行服务器。">原生服务器</Links>支持</b>: ✅
    </p>
    
</tldr>

`%plugin_name%` 插件将标准的 `Server` 和 `Date` 头部添加到每个响应中。此外，您可以提供额外的默认头部并覆盖 `Server` 头部。

## 添加依赖项 {id="add_dependencies"}

    <p>
        要使用 <code>%plugin_name%</code> 插件，您需要在构建脚本中包含 <code>%artifact_name%</code> 构件：
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
        要<a href="#install">安装</a> <code>%plugin_name%</code> 插件到应用程序中，
        请在指定的<Links href="/ktor/server-modules" summary="模块允许您通过分组路由来组织应用程序结构。">模块</Links>中将其传递给 <code>install</code> 函数。
        以下代码片段展示了如何安装 <code>%plugin_name%</code> 插件...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函数调用内部。
        </li>
        <li>
            ... 在显式定义的 <code>module</code> 中，它是 <code>Application</code> 类的一个扩展函数。
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
### 添加额外头部 {id="add"}
要自定义默认头部列表，请通过使用 `header(name, value)` 函数将所需头部传递给 `install`。 `name` 形参接受一个 `HttpHeaders` 值，例如：
```kotlin
    install(DefaultHeaders) {
        header(HttpHeaders.ETag, "7c876b7e")
    }
```
要添加自定义头部，请将其名称作为字符串值传递：
```kotlin
    install(DefaultHeaders) {
        header("Custom-Header", "Some value")
    }
```

### 覆盖头部 {id="override"}
要覆盖 `Server` 头部，请使用相应的 `HttpHeaders` 值：
```kotlin
    install(DefaultHeaders) {
        header(HttpHeaders.Server, "Custom")
    }
```
请注意，`Date` 头部由于性能原因而被缓存，并且不能通过使用 `%plugin_name%` 插件来覆盖。