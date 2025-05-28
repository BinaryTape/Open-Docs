[//]: # (title: DoubleReceive)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="DoubleReceive"/>
<var name="package_name" value="io.ktor.server.plugins.doublereceive"/>
<var name="artifact_name" value="ktor-server-double-receive"/>

<tldr>
<p>
<b>所需相依性</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="double-receive"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-double-receive/io.ktor.server.plugins.doublereceive/-double-receive.html) 外掛 (plugin) 提供了多次[接收請求主體 (request body)](server-requests.md#body_contents) 的能力，而不會拋出 `RequestAlreadyConsumedException` 例外。
當一個[外掛 (plugin)](server-plugins.md) 已經消耗了請求主體，導致你無法在路由處理器 (route handler) 中接收它時，這可能會很有用。
例如，你可以使用 `%plugin_name%` 透過 [CallLogging](server-call-logging.md) 外掛來記錄請求主體，然後在 `post` [路由處理器 (route handler)](server-routing.md#define_route) 中再次接收主體。

> `%plugin_name%` 外掛使用了實驗性 API，該 API 預計將在未來的更新中演進，並可能包含破壞性變更 (breaking changes)。
>
{type="note"}

## 新增相依性 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

安裝 `%plugin_name%` 後，你可以多次[接收請求主體](server-requests.md#body_contents)，並且每次呼叫 (invocation) 都會返回相同的實例。
例如，你可以使用 [CallLogging](server-call-logging.md) 外掛啟用請求主體的記錄功能...

```kotlin
```
{src="snippets/double-receive/src/main/kotlin/com/example/Application.kt" include-lines="16-23"}

...然後在路由處理器中再次獲取請求主體。

```kotlin
```
{src="snippets/double-receive/src/main/kotlin/com/example/Application.kt" include-lines="25-28"}

你可以在這裡找到完整範例：[double-receive](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/double-receive)。

## 配置 %plugin_name% {id="configure"}
在預設配置下，`%plugin_name%` 提供了將[請求主體](server-requests.md#body_contents)接收為以下類型物件的能力：

- `ByteArray`
- `String`
- `Parameters`
- 透過 `ContentNegotiation` 外掛使用的[資料類別 (data classes)](server-serialization.md#create_data_class)

預設情況下，`%plugin_name%` 不支援：

- 從同一請求中接收不同類型；
- 接收[串流 (stream) 或通道 (channel)](server-requests.md#raw)。

如果你不需要從同一請求中接收不同類型或接收串流或通道，請將 `cacheRawRequest` 屬性設定為 `false`：

```kotlin
install(DoubleReceive) {
    cacheRawRequest = false
}
```