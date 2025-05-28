[//]: # (title: DoubleReceive)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="DoubleReceive"/>
<var name="package_name" value="io.ktor.server.plugins.doublereceive"/>
<var name="artifact_name" value="ktor-server-double-receive"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="double-receive"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-double-receive/io.ktor.server.plugins.doublereceive/-double-receive.html) 插件提供了多次[接收请求体](server-requests.md#body_contents)的能力，而不会抛出 `RequestAlreadyConsumedException` 异常。
这在[插件](server-plugins.md)已经消费了请求体，导致您无法在路由处理器中再次接收它时可能很有用。
例如，您可以使用 `%plugin_name%` 结合 [CallLogging](server-call-logging.md) 插件记录请求体，然后在 `post` [路由处理器](server-routing.md#define_route)中再次接收请求体。

> `%plugin_name%` 插件使用了实验性 API，预计在即将到来的更新中会发展，并可能带来破坏性变更。
>
{type="note"}

## 添加依赖项 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

安装 `%plugin_name%` 后，您可以多次[接收请求体](server-requests.md#body_contents)，并且每次调用都返回相同的实例。
例如，您可以使用 [CallLogging](server-call-logging.md) 插件启用请求体日志记录...

```kotlin
```
{src="snippets/double-receive/src/main/kotlin/com/example/Application.kt" include-lines="16-23"}

... 然后在路由处理器中再次获取请求体。

```kotlin
```
{src="snippets/double-receive/src/main/kotlin/com/example/Application.kt" include-lines="25-28"}

您可以在此处找到完整示例：[double-receive](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/double-receive)。

## 配置 %plugin_name% {id="configure"}
在默认配置下，`%plugin_name%` 提供了以以下类型[接收请求体](server-requests.md#body_contents)的能力：

- `ByteArray` 
- `String`
- `Parameters` 
- 由 `ContentNegotiation` 插件使用的[数据类](server-serialization.md#create_data_class)

默认情况下，`%plugin_name%` 不支持：

- 从同一个请求中接收不同类型；
- 接收[流或通道](server-requests.md#raw)。

如果您不需要从同一个请求中接收不同类型，或者接收流或通道，请将 `cacheRawRequest` 属性设置为 `false`：

```kotlin
install(DoubleReceive) {
    cacheRawRequest = false
}