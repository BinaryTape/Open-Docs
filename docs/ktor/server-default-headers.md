[//]: # (title: 默认请求头)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-default-headers"/>
<var name="package_name" value="io.ktor.server.plugins.defaultheaders"/>
<var name="plugin_name" value="DefaultHeaders"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-default-headers/io.ktor.server.plugins.defaultheaders/-default-headers.html"/>

<tldr>
<p>
<b>所需依赖</b>: <code>io.ktor:%artifact_name%</code>
</p>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[%plugin_name%](%plugin_api_link%) 插件会向每个响应中添加标准的 `Server` 和 `Date` 请求头。此外，你还可以提供额外的默认请求头并覆盖 `Server` 请求头。

## 添加依赖 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

## 配置 %plugin_name% {id="configure"}
### 添加额外请求头 {id="add"}
要自定义默认请求头列表，请通过使用 `header(name, value)` 函数将所需的请求头传递给 `install`。 `name` 参数接受 `HttpHeaders` 值，例如：
```kotlin
    install(DefaultHeaders) {
        header(HttpHeaders.ETag, "7c876b7e")
    }
```
要添加自定义请求头，请将其名称作为字符串值传递：
```kotlin
    install(DefaultHeaders) {
        header("Custom-Header", "Some value")
    }
```

### 覆盖请求头 {id="override"}
要覆盖 `Server` 请求头，请使用对应的 `HttpHeaders` 值：
```kotlin
    install(DefaultHeaders) {
        header(HttpHeaders.Server, "Custom")
    }
```
请注意，出于性能原因，`Date` 请求头会被缓存，因此无法使用 `%plugin_name%` 进行覆盖。