[//]: # (title: Ktor 客户端中的测试)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-client-mock"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-testing-mock"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<web-summary>
Ktor 提供了 MockEngine，它可以在不连接到端点的情况下模拟 HTTP 调用。
</web-summary>

<link-summary>
了解如何使用 MockEngine 通过模拟 HTTP 调用来测试您的客户端。
</link-summary>

Ktor 提供了 [MockEngine](https://api.ktor.io/ktor-client/ktor-client-mock/io.ktor.client.engine.mock/-mock-engine/index.html)，它可以在不连接到端点的情况下模拟 HTTP 调用。

## 添加依赖项 {id="add_dependencies"}
在使用 `MockEngine` 之前，您需要在构建脚本中包含 `%artifact_name%` artifact。

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
    

## 用法 {id="usage"}

### 共享客户端配置 {id="share-config"}

让我们看看如何使用 `MockEngine` 来测试客户端。假设客户端具有以下配置：
*   `CIO` 引擎用于发出请求。
*   已安装 `Json` 插件，用于反序列化传入的 JSON 数据。

为了测试此客户端，其配置需要与使用 `MockEngine` 的测试客户端共享。要共享配置，您可以创建一个客户端包装类，该类以引擎作为构造函数形参并包含客户端配置。

[object Promise]

然后，您可以按如下方式使用 `ApiClient` 创建一个带有 `CIO` 引擎的 HTTP 客户端并发出请求。

[object Promise]

### 测试客户端 {id="test-client"}

为了测试客户端，您需要创建一个 `MockEngine` 实例，其中包含一个处理程序，该处理程序可以检测请求形参并响应所需内容（在本例中为 JSON 对象）。

[object Promise]

然后，您可以传递创建的 `MockEngine` 来初始化 `ApiClient` 并进行必要的断言。

[object Promise]

您可以在此处找到完整示例：[client-testing-mock](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-testing-mock)。