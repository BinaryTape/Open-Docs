[//]: # (title: 在 Ktor 客户端中进行测试)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-client-mock"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-testing-mock"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<web-summary>
Ktor 提供了一个 MockEngine，用于模拟 HTTP 调用而无需连接到实际端点。
</web-summary>

<link-summary>
了解如何使用 MockEngine 通过模拟 HTTP 调用来测试您的客户端。
</link-summary>

Ktor 提供了一个 [MockEngine](https://api.ktor.io/ktor-client/ktor-client-mock/io.ktor.client.engine.mock/-mock-engine/index.html)，用于模拟 HTTP 调用而无需连接到实际端点。

## 添加依赖项 {id="add_dependencies"}
在使用 `MockEngine` 之前，您需要在构建脚本中包含 `%artifact_name%` 工件。

<include from="lib.topic" element-id="add_ktor_artifact_testing"/>

## 用法 {id="usage"}

### 共享客户端配置 {id="share-config"}

让我们看看如何使用 `MockEngine` 来测试客户端。假设客户端具有以下配置：
*   使用 `CIO` [引擎](client-engines.md)来发出请求。
*   安装了 [Json](client-serialization.md) 插件来反序列化传入的 JSON 数据。

为了测试此客户端，其配置需要与使用 `MockEngine` 的测试客户端共享。要共享配置，您可以创建一个客户端包装器类，该类将引擎作为构造函数参数，并包含客户端配置。

```kotlin
```
{src="snippets/client-testing-mock/src/main/kotlin/com/example/Application.kt" include-lines="13-15,24-32"}

然后，您可以如下使用 `ApiClient` 来创建一个带有 `CIO` 引擎的 HTTP 客户端并发出请求。

```kotlin
```
{src="snippets/client-testing-mock/src/main/kotlin/com/example/Application.kt" include-lines="16-22"}

### 测试客户端 {id="test-client"}

要测试客户端，您需要创建一个 `MockEngine` 实例，并带有一个可以检查请求参数并响应所需内容（在本例中为 JSON 对象）的处理程序。

```kotlin
```
{src="snippets/client-testing-mock/src/test/kotlin/ApplicationTest.kt" include-lines="14-20"}

然后，您可以将创建的 `MockEngine` 传递给 `ApiClient` 进行初始化，并执行所需的断言。

```kotlin
```
{src="snippets/client-testing-mock/src/test/kotlin/ApplicationTest.kt" include-lines="10-26"}

您可以在此处找到完整示例：[client-testing-mock](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-testing-mock)。