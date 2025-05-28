[//]: # (title: 状态页)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="StatusPages"/>
<var name="package_name" value="io.ktor.server.plugins.statuspages"/>
<var name="artifact_name" value="ktor-server-status-pages"/>

<tldr>
<p>
<b>所需依赖项</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="status-pages"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
StatusPages 允许 Ktor 应用程序根据抛出的异常或状态码，对任何失败状态做出适当响应。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-status-pages/io.ktor.server.plugins.statuspages/-status-pages.html) 插件允许 Ktor 应用程序根据抛出的异常或状态码，对任何失败状态[做出适当响应](server-responses.md)。

## 添加依赖 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装 StatusPages {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 配置 StatusPages {id="configure"}

StatusPages 插件提供了三个主要的配置选项：

- [异常处理](#exceptions)：根据映射的异常类配置响应
- [状态码处理](#status)：配置对状态码值的响应
- [状态文件](#status-file)：配置从类路径响应文件

### 异常处理 {id="exceptions"}

`exception` 处理程序允许你处理导致 `Throwable` 异常的调用。在最基本的情况下，可以为任何异常配置 `500` HTTP 状态码：

```kotlin
install(StatusPages) {
    exception<Throwable> { call, cause ->
        call.respondText(text = "500: $cause" , status = HttpStatusCode.InternalServerError)
    }
}
```

你也可以检查特定的异常并用所需内容进行响应：

```kotlin
```
{src="snippets/status-pages/src/main/kotlin/com/example/Application.kt" include-lines="12-19,24"}

### 状态码处理 {id="status"}

`status` 处理程序提供了根据状态码响应特定内容的能力。以下示例展示了如果服务器上缺少资源（`404` 状态码）时如何响应请求：

```kotlin
```
{src="snippets/status-pages/src/main/kotlin/com/example/Application.kt" include-lines="12,20-22,24"}

### 状态文件 {id="status-file"}

`statusFile` 处理程序允许你根据状态码提供 HTML 页面。假设你的项目在 `resources` 文件夹中包含 `error401.html` 和 `error402.html` HTML 页面。在这种情况下，你可以使用 `statusFile` 如下处理 `401` 和 `402` 状态码：
```kotlin
```
{src="snippets/status-pages/src/main/kotlin/com/example/Application.kt" include-lines="12,23-24"}

`statusFile` 处理程序将配置状态列表中的任何 `#` 字符替换为状态码的值。

> 你可以在这里找到完整示例：[status-pages](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/status-pages)。