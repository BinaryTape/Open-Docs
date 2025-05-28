[//]: # (title: 请求验证)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="RequestValidation"/>
<var name="package_name" value="io.ktor.server.plugins.requestvalidation"/>
<var name="artifact_name" value="ktor-server-request-validation"/>

<tldr>
<p>
<b>所需依赖</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="request-validation"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
%plugin_name% 提供了验证传入请求体内容的能力。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-request-validation/io.ktor.server.plugins.requestvalidation/-request-validation.html) 插件提供了验证传入请求体内容的能力。如果安装了带有[序列化器](server-serialization.md#configure_serializer)的 `ContentNegotiation` 插件，你可以验证原始请求体或指定的请求对象属性。如果请求体验证失败，该插件会抛出 `RequestValidationException` 异常，该异常可以使用 [StatusPages](server-status-pages.md) 插件进行处理。

## 添加依赖 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安装 %plugin_name% {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

## 配置 %plugin_name% {id="configure"}

配置 `%plugin_name%` 涉及三个主要步骤：

1. [接收请求体内容](#receive-body)。
2. [配置验证函数](#validation-function)。
3. [处理验证异常](#validation-exception)。

### 1. 接收请求体 {id="receive-body"}

%plugin_name% 插件会在你调用带类型参数的 **[receive](server-requests.md#body_contents)** 函数时验证请求体。例如，下面的代码片段展示了如何将请求体作为 `String` 值接收：

```kotlin
```
{src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="52-56,65"}

### 2. 配置验证函数 {id="validation-function"}

要验证请求体，请使用 `validate` 函数。
此函数返回一个 `ValidationResult` 对象，表示成功或不成功的验证结果。
对于不成功的结果，会抛出 **[RequestValidationException](#validation-exception)** 异常。

`validate` 函数有两个重载，允许你通过两种方式验证请求体：

- 第一个 `validate` 重载允许你以指定类型的对象形式访问请求体。
   以下示例展示了如何验证表示 `String` 值的请求体：
   ```kotlin
   ```
   {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="20-25,43"}

   如果已安装 `ContentNegotiation` 插件并配置了特定的[序列化器](server-serialization.md#configure_serializer)，则可以验证对象属性。从 [](#example-object) 了解更多。

- 第二个 `validate` 重载接受 `ValidatorBuilder`，并允许你提供自定义验证规则。
   你可以从 [](#example-byte-array) 了解更多。

### 3. 处理验证异常 {id="validation-exception"}

如果请求验证失败，`%plugin_name%` 会抛出 `RequestValidationException` 异常。
此异常允许你访问请求体并获取此请求所有验证失败的原因。

你可以使用 [StatusPages](server-status-pages.md) 插件处理 `RequestValidationException`，如下所示：

```kotlin
```
{src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="44-48"}

你可以在这里找到完整示例：[request-validation](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/request-validation)。

## 示例：验证对象属性 {id="example-object"}

在此示例中，我们将探讨如何使用 `%plugin_name%` 插件验证对象属性。
假设服务器收到一个 `POST` 请求，其中包含以下 JSON 数据：

```HTTP
```
{src="snippets/request-validation/post.http" include-lines="7-14"}

要添加 `id` 属性的验证，请按照以下步骤操作：

1. 创建描述上述 JSON 对象的 `Customer` 数据类：
   ```kotlin
   ```
   {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="14-15"}

2. 安装带有 [JSON 序列化器](server-serialization.md#register_json) 的 `ContentNegotiation` 插件：
   ```kotlin
   ```
   {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="49-51"}

3. 在服务器端接收 `Customer` 对象，如下所示：
   ```kotlin
   ```
   {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="57-60"}
4. 在 `%plugin_name%` 插件配置中，添加 `id` 属性的验证，以确保它落在指定范围内：
   ```kotlin
   ```
   {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="20,26-30,43"}
   
   在这种情况下，如果 `id` 值小于或等于 `0`，`%plugin_name%` 将抛出 **[RequestValidationException](#validation-exception)** 异常。

## 示例：验证字节数组 {id="example-byte-array"}

在此示例中，我们将探讨如何验证作为字节数组接收的请求体。
假设服务器收到一个 `POST` 请求，其中包含以下文本数据：

```HTTP
```
{src="snippets/request-validation/post.http" include-lines="17-20"}

要将数据作为字节数组接收并进行验证，请执行以下步骤：

1. 在服务器端接收数据，如下所示：
   ```kotlin
   ```
   {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="61-64"}
2. 要验证接收到的数据，我们将使用接受 `ValidatorBuilder` 并允许你提供自定义验证规则的第二个 `validate` [函数重载](#validation-function)：
   ```kotlin
   ```
   {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="20,31-43"}