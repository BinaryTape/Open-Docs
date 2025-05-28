[//]: # (title: 默认请求)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<tldr>
<var name="example_name" value="client-default-request"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
DefaultRequest 插件允许您为所有请求配置默认参数。
</link-summary>

[DefaultRequest](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-default-request/index.html) 插件允许您为所有[请求](client-requests.md)配置默认参数：指定一个基础 URL、添加请求头、配置查询参数等。

## 添加依赖项 {id="add_dependencies"}

`DefaultRequest` 仅需要 [ktor-client-core](client-dependencies.md) artifact，不需要任何特定依赖项。

## 安装 DefaultRequest {id="install_plugin"}

要安装 `DefaultRequest`，将其传递给 `install` 函数，在[客户端配置块](client-create-and-configure.md#configure-client)中...
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    install(DefaultRequest)
}
```

... 或者调用 `defaultRequest` 函数并[配置](#configure)所需的请求参数：

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
//...
val client = HttpClient(CIO) {
    defaultRequest {
        // this: DefaultRequestBuilder
    }
}
```

## 配置 DefaultRequest {id="configure"}

### 基础 URL {id="url"}

`DefaultRequest` 允许您配置 URL 的基础部分，该部分将与[请求 URL](client-requests.md#url)合并。例如，下面的 `url` 函数为所有请求指定一个基础 URL：

```kotlin
defaultRequest {
    url("https://ktor.io/docs/")
}
```

如果您使用上述配置的客户端发出以下请求，...

```kotlin
```
{src="snippets/client-default-request/src/main/kotlin/com/example/Application.kt" include-lines="25"}

... 生成的 URL 将是：`https://ktor.io/docs/welcome.html`。
要了解基础 URL 和请求 URL 如何合并，请参阅 [DefaultRequest](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins/-default-request/index.html)。

### URL 参数 {id="url-params"}

`url` 函数还允许您单独指定 URL 组件，例如：
- HTTP 方案；
- 主机名；
- 基础 URL 路径；
- 查询参数。

```kotlin
```
{src="snippets/client-default-request/src/main/kotlin/com/example/Application.kt" include-lines="15-20"}

### 请求头 {id="headers"}

要为每个请求添加特定请求头，请使用 `header` 函数：

```kotlin
```
{src="snippets/client-default-request/src/main/kotlin/com/example/Application.kt" include-lines="14,21-22"}

为避免重复请求头，您可以使用 `appendIfNameAbsent`、`appendIfNameAndValueAbsent` 和 `contains` 函数：

```kotlin
defaultRequest {
    headers.appendIfNameAbsent("X-Custom-Header", "Hello")
}
```

## 示例 {id="example"}

以下示例使用以下 `DefaultRequest` 配置：
* `url` 函数定义了 HTTP 方案、主机、基础 URL 路径和查询参数。
* `header` 函数为所有请求添加了一个自定义请求头。

```kotlin
```
{src="snippets/client-default-request/src/main/kotlin/com/example/Application.kt" include-lines="13-23"}

该客户端发出的以下请求仅指定了后者路径段，并自动应用了为 `DefaultRequest` 配置的参数：

```kotlin
```
{src="snippets/client-default-request/src/main/kotlin/com/example/Application.kt" include-lines="25-26"}

您可以在此处找到完整的示例：[client-default-request](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-default-request)。