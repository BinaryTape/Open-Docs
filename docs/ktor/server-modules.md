[//]: # (title: 模块)

<tldr>
<p>
<b>代码示例</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules">embedded-server-modules</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules">engine-main-modules</a>
</p>
</tldr>

<link-summary>模块允许你通过将路由分组来结构化你的应用程序。</link-summary>

Ktor 允许你使用模块通过在特定模块内部定义一组特定的[路由](server-routing.md)来[结构化](server-application-structure.md)你的应用程序。模块是 [Application](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application/index.html) 类的一个 _[扩展函数](https://kotlinlang.org/docs/extensions.html)_。在以下示例中，`module1` 扩展函数定义了一个模块，该模块接受发送到 `/module1` URL 路径的 GET 请求。

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

在你的应用程序中加载模块取决于[创建服务器](server-create-and-configure.topic)的方式：是在代码中使用 `embeddedServer` 函数，还是通过使用 `application.conf` 配置文件。

> 请注意，安装在指定模块中的[插件](server-plugins.md#install)对其他已加载的模块也有效。

## embeddedServer {id="embedded-server"}

通常，`embeddedServer` 函数隐式接受一个模块作为 lambda 实参。你可以在[代码中的配置](server-create-and-configure.topic#embedded-server)章节中看到示例。你还可以将应用程序逻辑提取到一个单独的模块中，并将此模块的引用作为 `module` 形参传递：

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

你可以在这里找到完整示例：[embedded-server-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules)。

## 配置文件 {id="hocon"}

如果你使用 `application.conf` 或 `application.yaml` 文件来配置服务器，你需要使用 `ktor.application.modules` 属性来指定要加载的模块。

假设你有三个模块在两个包中定义：两个模块在 `com.example` 包中，一个在 `org.sample` 包中。

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

要在配置文件中引用这些模块，你需要提供它们的完全限定名称。完全限定模块名称包括类的完全限定名称和一个扩展函数名称。

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

你可以在这里找到完整示例：[engine-main-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules)。

## 并发模块加载

你可以在创建应用程序模块时使用可挂起函数。它们允许事件在应用程序启动时异步运行。为此，请添加 `suspend` 关键字：

```kotlin
suspend fun Application.installEvents() {
    val kubernetesConnection = connect(property<KubernetesConfig>("app.events"))
}
```

你还可以独立启动所有应用程序模块，这样当其中一个挂起时，其他模块不会被阻塞。这允许依赖注入的非顺序加载，并在某些情况下实现更快的加载。

### 配置选项

以下配置属性可用：

| Property                                | Type                        | 描述                                              | 默认值      |
|-----------------------------------------|-----------------------------|---------------------------------------------------|--------------|
| `ktor.application.startup`              | `sequential` / `concurrent` | 定义应用程序模块的加载方式                        | `sequential` |
| `ktor.application.startupTimeoutMillis` | `Long`                      | 应用程序模块加载的超时时间（毫秒）                | `10000`      |

### 启用并发模块加载

要启用并发模块加载，请将以下内容添加到你的服务器配置文件中：

```yaml
# application.conf

ktor {
    application {
        startup = concurrent
    }
}
```

对于依赖注入，你可以按出现顺序加载以下模块而不会出现问题：

```kotlin
suspend fun Application.installEvents() {
    // Suspends until provided
    val kubernetesConnection = dependencies.resolve<KubernetesConnection>()
}

suspend fun Application.loadEventsConnection() {
    dependencies.provide<KubernetesConnection> {
        connect(property<KubernetesConfig>("app.events"))
    }
}
```

> 并发模块加载是单线程进程。它有助于避免应用程序内部共享状态中非安全集合带来的线程问题。
>
{style="note"}