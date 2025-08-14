[//]: # (title: 自定义插件 - 基础 API)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="custom-plugin-base-api"/>

    <p>
        <b>代码示例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

> 从 v2.0.0 起，Ktor 提供了一个新的简化 API 用于[创建自定义插件](server-custom-plugins.md)。
>
{type="note"}

Ktor 开放了用于开发自定义[插件](server-plugins.md)的 API，这些插件实现了通用功能，并且可以在多个应用程序中复用。此 API 允许你拦截不同的[管道](#pipelines)阶段，以向请求/响应处理添加自定义逻辑。例如，你可以拦截 `Monitoring` 阶段来记录入站请求或收集指标。

## 创建插件 {id="create"}
要创建自定义插件，请按照以下步骤操作：

1. 创建插件类并[声明一个伴生对象](#create-companion)，该对象实现以下接口之一：
   - [BaseApplicationPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-base-application-plugin/index.html)，如果插件应在应用程序级别工作。
   - [BaseRouteScopedPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-base-route-scoped-plugin/index.html)，如果插件可以[安装到特定路由](server-plugins.md#install-route)。
2. [实现](#implement)此伴生对象的 `key` 和 `install` 成员。
3. 提供[插件配置](#plugin-configuration)。
4. 通过拦截所需的管道阶段来[处理调用](#call-handling)。
5. [安装插件](#install)。

### 创建伴生对象 {id="create-companion"}

自定义插件的类应具有一个实现 `BaseApplicationPlugin` 或 `BaseRouteScopedPlugin` 接口的伴生对象。
`BaseApplicationPlugin` 接口接受三个类型形参：
- 此插件兼容的管道类型。
- 此插件的[配置对象类型](#plugin-configuration)。
- 插件对象的实例类型。

```kotlin
class CustomHeader() {
    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, CustomHeader> {
        // ...
    }
}
```

### 实现 'key' 和 'install' 成员 {id="implement"}

作为 `BaseApplicationPlugin` 接口的子代，伴生对象应实现两个成员：
- `key` 属性用于识别插件。Ktor 有一个所有属性的 `map`，每个插件都使用指定的 `key` 将自身添加到此 `map` 中。
- `install` 函数允许你配置插件的工作方式。在这里，你需要拦截管道并返回插件实例。我们将在[下一章](#call-handling)中介绍如何拦截管道和处理调用。

```kotlin
class CustomHeader() {
    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, CustomHeader> {
        override val key = AttributeKey<CustomHeader>("CustomHeader")
        override fun install(pipeline: ApplicationCallPipeline, configure: Configuration.() -> Unit): CustomHeader {
            val plugin = CustomHeader()
            // Intercept a pipeline ...
            return plugin
        }
    }
}
```

### 处理调用 {id="call-handling"}

在你的自定义插件中，你可以通过拦截[现有管道阶段](#pipelines)或新定义的阶段来处理请求和响应。例如，[Authentication](server-auth.md) 插件向默认管道添加了 `Authenticate` 和 `Challenge` 自定义阶段。因此，拦截特定管道允许你访问调用的不同阶段，例如：

- `ApplicationCallPipeline.Monitoring`：拦截此阶段可用于请求日志记录或收集指标。
- `ApplicationCallPipeline.Plugins`：可用于修改响应形参，例如，追加自定义标头。
- `ApplicationReceivePipeline.Transform` 和 `ApplicationSendPipeline.Transform`：允许你获取并[转换从客户端接收的数据](#transform)，并在将其发送回之前转换数据。

以下示例演示了如何拦截 `ApplicationCallPipeline.Plugins` 阶段并将自定义标头追加到每个响应中：

```kotlin
class CustomHeader() {
    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, CustomHeader> {
        override val key = AttributeKey<CustomHeader>("CustomHeader")
        override fun install(pipeline: ApplicationCallPipeline, configure: Configuration.() -> Unit): CustomHeader {
            val plugin = CustomHeader()
            pipeline.intercept(ApplicationCallPipeline.Plugins) {
                call.response.header("X-Custom-Header", "Hello, world!")
            }
            return plugin
        }
    }
}
```

请注意，此插件中的自定义标头名称和值是硬编码的。你可以通过[提供配置](#plugin-configuration)来传递所需的自定义标头名称/值，从而使此插件更灵活。

> 自定义插件允许你共享与调用相关的任何值，因此你可以在处理此调用的任何处理程序中访问此值。你可以从 [](server-custom-plugins.md#call-state) 了解更多信息。

### 提供插件配置 {id="plugin-configuration"}

[上一章](#call-handling) 展示了如何创建一个插件，该插件会将预定义的自定义标头追加到每个响应中。让我们使此插件更有用，并提供一个配置以传递所需的自定义标头名称/值。首先，你需要在插件类内部定义一个配置类：

[object Promise]

鉴于插件配置字段是可变的，建议将它们保存在局部变量中：

[object Promise]

最后，在 `install` 函数中，你可以获取此配置并使用其属性

[object Promise]

### 安装插件 {id="install"}

要将自定义插件[安装](server-plugins.md#install)到你的应用程序中，请调用 `install` 函数并传递所需的[配置](#plugin-configuration)形参：

[object Promise]

## 示例 {id="examples"}

以下代码片段演示了几个自定义插件的示例。
你可以在这里找到可运行的项目：[custom-plugin-base-api](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin-base-api)

### 请求日志记录 {id="request-logging"}

以下示例展示了如何创建用于记录入站请求的自定义插件：

[object Promise]

### 自定义标头 {id="custom-header"}

此示例演示了如何创建将自定义标头追加到每个响应中的插件：

[object Promise]

### 正文转换 {id="transform"}

以下示例展示了如何：
- 转换从客户端接收的数据；
- 转换要发送到客户端的数据。

[object Promise]

## 管道 {id="pipelines"}

Ktor 中的 [Pipeline](https://api.ktor.io/ktor-utils/io.ktor.util.pipeline/-pipeline/index.html) 是拦截器的集合，它们被分组为一个或多个有序阶段。每个拦截器都可以在处理请求之前和之后执行自定义逻辑。

[ApplicationCallPipeline](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call-pipeline/index.html) 是用于执行应用程序调用的管道。此管道定义了 5 个阶段：

- `Setup`：用于准备调用及其属性以供处理的阶段。
- `Monitoring`：用于跟踪调用的阶段。它可能对请求日志记录、收集指标、错误处理等有用。
- `Plugins`：用于[处理调用](#call-handling)的阶段。大多数插件在此阶段进行拦截。
- `Call`：用于完成调用的阶段。
- `Fallback`：用于处理未处理的调用的阶段。

## 管道阶段到新 API 处理程序的映射 {id="mapping"}

从 v2.0.0 起，Ktor 提供了一个新的简化 API 用于[创建自定义插件](server-custom-plugins.md)。
通常，此 API 不需要理解内部 Ktor 概念，例如管道、阶段等。相反，你可以使用各种处理程序，例如 `onCall`、`onCallReceive`、`onCallRespond` 等，来访问[处理请求和响应](#call-handling)的不同阶段。
下表显示了管道阶段如何映射到新 API 中的处理程序。

| 基础 API                               | 新 API                                                 |
|----------------------------------------|---------------------------------------------------------|
| `ApplicationCallPipeline.Setup` 之前 | [on(CallFailed)](server-custom-plugins.md#other)               |
| `ApplicationCallPipeline.Setup`        | [on(CallSetup)](server-custom-plugins.md#other)                |
| `ApplicationCallPipeline.Plugins`      | [onCall](server-custom-plugins.md#on-call)                     |
| `ApplicationReceivePipeline.Transform` | [onCallReceive](server-custom-plugins.md#on-call-receive)      |
| `ApplicationSendPipeline.Transform`    | [onCallRespond](server-custom-plugins.md#on-call-respond)      |
| `ApplicationSendPipeline.After`        | [on(ResponseBodyReadyForSend)](server-custom-plugins.md#other) |
| `ApplicationSendPipeline.Engine`       | [on(ResponseSent)](server-custom-plugins.md#other)             |
| `Authentication.ChallengePhase` 之后  | [on(AuthenticationChecked)](server-custom-plugins.md#other)    |