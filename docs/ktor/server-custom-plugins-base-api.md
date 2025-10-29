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

> 从 v2.0.0 开始，Ktor 提供了一种用于[创建自定义插件](server-custom-plugins.md)的新简化 API。
>
{type="note"}

Ktor 提供了用于开发自定义[插件](server-plugins.md)的 API，这些插件可实现常见功能并可在多个应用程序中复用。
此 API 允许您拦截不同的[流水线](#pipelines)阶段，从而为请求/响应处理添加自定义逻辑。
例如，您可以拦截 `Monitoring` 阶段来记录传入请求或收集指标。

## 创建插件 {id="create"}
要创建自定义插件，请按照以下步骤操作：

1. 创建插件类并[声明一个伴生对象](#create-companion)，该对象实现以下接口之一：
   - [BaseApplicationPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-base-application-plugin/index.html)（如果插件应在应用程序级别运行）。
   - [BaseRouteScopedPlugin](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-base-route-scoped-plugin/index.html)（如果插件可以[安装到特定路由](server-plugins.md#install-route)）。
2. [实现](#implement)此伴生对象的 `key` 和 `install` 成员。
3. 提供[插件配置](#plugin-configuration)。
4. 通过拦截所需的流水线阶段来[处理调用](#call-handling)。
5. [安装插件](#install)。

### 创建伴生对象 {id="create-companion"}

自定义插件的类应具有一个实现 `BaseApplicationPlugin` 或 `BaseRouteScopedPlugin` 接口的伴生对象。
`BaseApplicationPlugin` 接口接受三个类型参数：
- 此插件兼容的流水线类型。
- 此插件的[配置对象类型](#plugin-configuration)。
- 插件对象的实例类型。

```kotlin
class CustomHeader() {
    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, CustomHeader> {
        // ...
    }
}
```

### 实现 `key` 和 `install` 成员 {id="implement"}

作为 `BaseApplicationPlugin` 接口的子代，伴生对象应实现两个成员：
- `key` 属性用于标识插件。Ktor 拥有所有属性的 Map，每个插件都使用指定的 `key` 将自身添加到此 Map 中。
- `install` 函数允许您配置插件的工作方式。在此处您需要拦截流水线并返回一个插件实例。我们将在[下一章](#call-handling)中了解如何拦截流水线和处理调用。

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

在自定义插件中，您可以通过拦截[现有流水线阶段](#pipelines)或新定义的阶段来处理请求和响应。例如，[Authentication](server-auth.md) 插件会向默认流水线添加 `Authenticate` 和 `Challenge` 自定义阶段。因此，拦截特定流水线可让您访问调用的不同阶段，例如：

- `ApplicationCallPipeline.Monitoring`：拦截此阶段可用于请求日志记录或收集指标。
- `ApplicationCallPipeline.Plugins`：可用于修改响应参数，例如追加自定义头。
- `ApplicationReceivePipeline.Transform` 和 `ApplicationSendPipeline.Transform`：允许您获取并[转换](#transform)从客户端接收的数据，并在将其发送回客户端之前转换数据。

以下示例演示了如何拦截 `ApplicationCallPipeline.Plugins` 阶段并为每个响应追加自定义头：

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

请注意，此插件中的自定义头名称和值是硬编码的。您可以通过[提供配置](#plugin-configuration)来传递所需的自定义头名称/值，从而使此插件更灵活。

> 自定义插件允许您共享与调用相关的任何值，因此您可以在处理此调用的任何处理器中访问此值。关于[共享调用状态](server-custom-plugins.md#call-state)，您可以了解更多信息。

### 提供插件配置 {id="plugin-configuration"}

[上一章](#call-handling)展示了如何创建一个插件，该插件为每个响应追加预定义的自定义头。让我们使此插件更有用，并提供一个配置来传递所需的自定义头名称/值。首先，您需要在插件类内部定义一个配置类：

```kotlin
class Configuration {
    var headerName = "Custom-Header-Name"
    var headerValue = "Default value"
}
```

鉴于插件配置字段是可变的，建议将其保存到局部变量中：

```kotlin
class CustomHeader(configuration: Configuration) {
    private val name = configuration.headerName
    private val value = configuration.headerValue

    class Configuration {
        var headerName = "Custom-Header-Name"
        var headerValue = "Default value"
    }
}
```

最后，在 `install` 函数中，您可以获取此配置并使用其属性

```kotlin
class CustomHeader(configuration: Configuration) {
    private val name = configuration.headerName
    private val value = configuration.headerValue

    class Configuration {
        var headerName = "Custom-Header-Name"
        var headerValue = "Default value"
    }

    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, CustomHeader> {
        override val key = AttributeKey<CustomHeader>("CustomHeader")
        override fun install(pipeline: ApplicationCallPipeline, configure: Configuration.() -> Unit): CustomHeader {
            val configuration = Configuration().apply(configure)
            val plugin = CustomHeader(configuration)
            pipeline.intercept(ApplicationCallPipeline.Plugins) {
                call.response.header(plugin.name, plugin.value)
            }
            return plugin
        }
    }
}
```

### 安装插件 {id="install"}

要将自定义插件[安装](server-plugins.md#install)到您的应用程序，请调用 `install` 函数并传入所需的[配置](#plugin-configuration)参数：

```kotlin
install(CustomHeader) {
    headerName = "X-Custom-Header"
    headerValue = "Hello, world!"
}
```

## 示例 {id="examples"}

以下代码片段演示了几个自定义插件的示例。
您可以在此处找到可运行的项目：[custom-plugin-base-api](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin-base-api)

### 请求日志记录 {id="request-logging"}

以下示例展示了如何创建一个用于记录传入请求的自定义插件：

```kotlin
package com.example.plugins

import io.ktor.serialization.*
import io.ktor.server.application.*
import io.ktor.server.plugins.*
import io.ktor.util.*

class RequestLogging {
    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, RequestLogging> {
        override val key = AttributeKey<RequestLogging>("RequestLogging")
        override fun install(pipeline: ApplicationCallPipeline, configure: Configuration.() -> Unit): RequestLogging {
            val plugin = RequestLogging()
            pipeline.intercept(ApplicationCallPipeline.Monitoring) {
                call.request.origin.apply {
                    println("Request URL: $scheme://$localHost:$localPort$uri")
                }
            }
            return plugin
        }
    }
}

```

### 自定义头 {id="custom-header"}

此示例演示了如何创建一个插件，该插件为每个响应追加自定义头：

```kotlin
package com.example.plugins

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.util.*

class CustomHeader(configuration: Configuration) {
    private val name = configuration.headerName
    private val value = configuration.headerValue

    class Configuration {
        var headerName = "Custom-Header-Name"
        var headerValue = "Default value"
    }

    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, CustomHeader> {
        override val key = AttributeKey<CustomHeader>("CustomHeader")
        override fun install(pipeline: ApplicationCallPipeline, configure: Configuration.() -> Unit): CustomHeader {
            val configuration = Configuration().apply(configure)
            val plugin = CustomHeader(configuration)
            pipeline.intercept(ApplicationCallPipeline.Plugins) {
                call.response.header(plugin.name, plugin.value)
            }
            return plugin
        }
    }
}

```

### 正文转换 {id="transform"}

以下示例展示了如何：
- 转换从客户端接收的数据；
- 转换要发送到客户端的数据。

```kotlin
package com.example.plugins

import io.ktor.serialization.*
import io.ktor.server.application.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.util.*
import io.ktor.utils.io.*

class DataTransformation {
    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, DataTransformation> {
        override val key = AttributeKey<DataTransformation>("DataTransformation")
        override fun install(pipeline: ApplicationCallPipeline, configure: Configuration.() -> Unit): DataTransformation {
            val plugin = DataTransformation()
            pipeline.receivePipeline.intercept(ApplicationReceivePipeline.Transform) { data ->
                val newValue = (data as ByteReadChannel).readUTF8Line()?.toInt()?.plus(1)
                if (newValue != null) {
                    proceedWith(newValue)
                }
            }
            pipeline.sendPipeline.intercept(ApplicationSendPipeline.Transform) { data ->
                if (subject is Int) {
                    val newValue = data.toString().toInt() + 1
                    proceedWith(newValue.toString())
                }
            }
            return plugin
        }
    }
}

```

## 流水线 {id="pipelines"}

Ktor 中的 [Pipeline](https://api.ktor.io/ktor-utils/io.ktor.util.pipeline/-pipeline/index.html) 是拦截器的集合，它们分组为一个或多个有序的阶段。每个拦截器都可以在处理请求之前和之后执行自定义逻辑。

[ApplicationCallPipeline](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call-pipeline/index.html) 是用于执行应用程序调用的流水线。此流水线定义了 5 个阶段：

- `Setup`：用于准备调用及其属性以供处理的阶段。
- `Monitoring`：用于跟踪调用的阶段。它可能对请求日志记录、收集指标、错误处理等很有用。
- `Plugins`：用于[处理调用](#call-handling)的阶段。大多数插件都在此阶段进行拦截。
- `Call`：用于完成调用的阶段。
- `Fallback`：用于处理未处理调用的阶段。

## 流水线阶段到新 API 处理器映射 {id="mapping"}

从 v2.0.0 开始，Ktor 提供了一种用于[创建自定义插件](server-custom-plugins.md)的新简化 API。
通常，此 API 不需要理解 Ktor 内部概念，例如流水线、阶段等。相反，您可以通过使用各种处理器（例如 `onCall`、`onCallReceive`、`onCallRespond` 等）来访问[处理请求和响应](#call-handling)的不同阶段。
下表显示了流水线阶段如何映射到新 API 中的处理器。

| Base API                               | New API                                                 |
|----------------------------------------|---------------------------------------------------------|
| before `ApplicationCallPipeline.Setup` | [on(CallFailed)](server-custom-plugins.md#other)               |
| `ApplicationCallPipeline.Setup`        | [on(CallSetup)](server-custom-plugins.md#other)                |
| `ApplicationCallPipeline.Plugins`      | [onCall](server-custom-plugins.md#on-call)                     |
| `ApplicationReceivePipeline.Transform` | [onCallReceive](server-custom-plugins.md#on-call-receive)      |
| `ApplicationSendPipeline.Transform`    | [onCallRespond](server-custom-plugins.md#on-call-respond)      |
| `ApplicationSendPipeline.After`        | [on(ResponseBodyReadyForSend)](server-custom-plugins.md#other) |
| `ApplicationSendPipeline.Engine`       | [on(ResponseSent)](server-custom-plugins.md#other)             |
| after `Authentication.ChallengePhase`  | [on(AuthenticationChecked)](server-custom-plugins.md#other)    |