[//]: # (title: 模块)

<tldr>
<p>
<b>代码示例</b>：
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules">embedded-server-modules</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules">engine-main-modules</a>
</p>
</tldr>

<link-summary>模块允许您通过对路由进行分组来构建应用程序结构。</link-summary>
<show-structure for="chapter" depth="2"/>

Ktor 允许您使用模块，通过在特定模块内定义一组特定的[路由](server-routing.md)来构建应用程序结构。模块是 `Application` 的扩展函数，用于设置路由、安装插件并配置服务。使用模块可以帮助您：

- 将相关的路由和逻辑分组。
- 保持功能或领域隔离。
- 实现更简单的测试和模块化部署。

> 有关架构模式和模块组织的更多信息，请参阅[应用程序结构](server-application-structure.md)

## 定义模块 {id="defining-a-module"}

模块是 [`Application`](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-application/index.html) 类的 _[扩展函数](https://kotlinlang.org/docs/extensions.html)_。在下面的示例中，`module1` 扩展函数定义了一个模块，该模块接受对 `/module1` URL 路径发起的 GET 请求。

```kotlin
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.module1() {
    routing {
        get("/module1") {
            call.respondText("Hello from 'module1'!")
        }
    }
}
```

在应用程序中加载模块取决于[创建服务器](server-create-and-configure.topic)的方式：是在代码中使用 `embeddedServer` 函数，还是使用 `application.conf` 配置文件。

> 请注意，安装在指定模块中的[插件](server-plugins.md#install)对其他已加载的模块也有效。

## 加载模块 {id="loading-modules"}
### 嵌入式服务器 {id="embedded-server"}

通常，`embeddedServer` 函数隐式地接受一个模块作为 lambda 实参。您可以在[代码配置](server-create-and-configure.topic#embedded-server)部分查看示例。您还可以将应用程序逻辑提取到单独的模块中，并将该模块的引用作为 `module` 形参传递：

```kotlin
package com.example

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.engine.*
import io.ktor.server.netty.*

fun main() {
    embeddedServer(Netty, port = 8080, module = Application::module).start(wait = true)
}

fun Application.module() {
    module1()
    module2()
}

fun Application.module1() {
    routing {
        get("/module1") {
            call.respondText("Hello from 'module1'!")
        }
    }
}

fun Application.module2() {
    routing {
        get("/module2") {
            call.respondText("Hello from 'module2'!")
        }
    }
}

```

您可以在此处找到完整示例：[embedded-server-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules)。

### 配置文件 {id="hocon"}

如果您使用 `application.conf` 或 `application.yaml` 文件来配置服务器，则需要使用 `ktor.application.modules` 属性指定要加载的模块。

假设您在两个软件包中定义了三个模块：两个模块在 `com.example` 软件包中，一个在 `org.sample` 软件包中。

<Tabs>
<TabItem title="Application.kt">

```kotlin
package com.example

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module1() {
    routing {
        get("/module1") {
            call.respondText("Hello from 'module1'!")
        }
    }
}

fun Application.module2() {
    routing {
        get("/module2") {
            call.respondText("Hello from 'module2'!")
        }
    }
}

```

</TabItem>
<TabItem title="Sample.kt">

```kotlin
package org.sample

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun Application.module3() {
    routing {
        get("/module3") {
            call.respondText("Hello from 'module3'!")
        }
    }
}

```

</TabItem>
</Tabs>

要在配置文件中引用这些模块，您需要提供它们的完全限定名称。完全限定模块名称包括类的完全限定名称和扩展函数名称。

<Tabs group="config">
<TabItem title="application.conf" group-key="hocon">

```shell
ktor {
    application {
        modules = [ com.example.ApplicationKt.module1,
                    com.example.ApplicationKt.module2,
                    org.sample.SampleKt.module3 ]
    }
}
```

</TabItem>
<TabItem title="application.yaml" group-key="yaml">

```yaml
ktor:
    application:
        modules:
            - com.example.ApplicationKt.module1
            - com.example.ApplicationKt.module2
            - org.sample.SampleKt.module3
```

</TabItem>
</Tabs>

您可以在此处找到完整示例：[engine-main-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules)。

## 模块依赖项

模块通常需要共享公共服务、仓库或配置。注入依赖项而不是在模块内部创建它们，可以提高可测试性和灵活性。根据项目的复杂程度，Ktor 提供了几种方法。

### 通过形参传递依赖项

传递依赖项最简单的方法是将它们声明为模块函数的形参：

```kotlin
fun main() {
    embeddedServer(CIO, port = 8080, host = "0.0.0.0") {
        // 实例化您的依赖项
        val myService = MyService(property<MyServiceConfig>())
        // 将其作为形参注入到您的模块中
        routingModule(myService)
        schedulingModule(myService)
    }.start(wait = true)
}
```

这对于中小型应用程序非常有效，并能保持依赖关系清晰。然而，模块在编译时会变得紧耦合，且无法在运行时轻松更换。

### 使用应用程序特性

您可以使用 `Application.attributes` —— 一个对所有模块都可用的类型安全映射：

```kotlin
val customerServiceKey = AttributeKey<CustomerService>("CustomerService")

fun Application.servicesModule() {
    attributes[customerServiceKey] = CustomerService()
}

fun Application.customerModule() {
    val service = attributes[customerServiceKey]
    routing {
        get("/customers") { call.respond(service.all()) }
    }
}
```

通过避免模块之间的直接引用，这实现了松耦合。

### 使用依赖注入 {id="dependency_injection"}

Ktor 包含一个[依赖注入 (DI) 插件](server-dependency-injection.md)，它允许您使用轻量级容器直接在 Ktor 应用程序内部声明和解析依赖项。

## 并发模块 {id="concurrent-modules"}

在创建应用程序模块时，您可以使用可挂起函数。它们允许在启动应用程序时异步运行事件。为此，请添加 `suspend` 关键字：

```kotlin
suspend fun Application.installEvents() {
    val kubernetesConnection = connect(property<KubernetesConfig>("app.events"))
}
```

您还可以独立启动所有应用程序模块，这样当一个模块挂起时，其他模块不会被阻塞。这允许依赖注入进行非顺序加载，并在某些情况下加快加载速度。

### 配置选项

以下配置属性可用：

| 属性 | 类型 | 描述 | 默认值 |
|-----------------------------------------|-----------------------------|----------------------------------------------------------|--------------|
| `ktor.application.startup`              | `sequential` / `concurrent` | 定义应用程序模块的加载方式 | `sequential` |
| `ktor.application.startupTimeoutMillis` | `Long`                      | 应用程序模块加载的超时时间（以毫秒为单位） | `10000`      |

### 启用并发模块加载

要选择启用并发模块加载，请在服务器配置文件中添加以下内容：

```yaml
# application.conf

ktor {
    application {
        startup = concurrent
    }
}
```

对于依赖注入，您可以按出现顺序加载以下模块而不会出现问题：

```kotlin
suspend fun Application.installEvents() {
    // 挂起直到提供完成
    val kubernetesConnection = dependencies.resolve<KubernetesConnection>()
}

suspend fun Application.loadEventsConnection() {
    dependencies.provide<KubernetesConnection> {
        connect(property<KubernetesConfig>("app.events"))
    }
}
```

> 并发模块加载是一个单线程过程。它有助于避免应用程序内部共享状态中非安全集合的线程问题。
>
{style="note"}