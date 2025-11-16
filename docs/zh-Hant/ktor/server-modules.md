[//]: # (title: 模組)

<tldr>
<p>
<b>程式碼範例</b>: 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules">embedded-server-modules</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules">engine-main-modules</a>
</p>
</tldr>

<link-summary>模組允許您透過分組路由來架構您的應用程式。</link-summary>

Ktor 允許您使用模組來[架構](server-application-structure.md)您的應用程式，方法是在特定模組內定義一組特定的[路由](server-routing.md)。模組是 [Application](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application/index.html) 類別的_[擴充函數](https://kotlinlang.org/docs/extensions.html)_。在下面的範例中，`module1` 擴充函數定義了一個模組，用於接受對 `/module1` URL 路徑發出的 GET 請求。

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

在您的應用程式中載入模組取決於[建立伺服器](server-create-and-configure.topic)的方式：透過程式碼使用 `embeddedServer` 函數，或透過 `application.conf` 配置檔。

> 請注意，安裝在指定模組中的[外掛](server-plugins.md#install)對其他已載入的模組也有效。

## embeddedServer {id="embedded-server"}

通常，`embeddedServer` 函數會將模組隱式地作為 lambda 參數接受。您可以在[程式碼中的配置](server-create-and-configure.topic#embedded-server)部分看到範例。您也可以將應用程式邏輯提取到單獨的模組中，並將此模組的參考作為 `module` 參數傳遞：

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

您可以在此處找到完整範例：[embedded-server-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules)。

## 配置檔 {id="hocon"}

如果您使用 `application.conf` 或 `application.yaml` 檔案來配置伺服器，您需要使用 `ktor.application.modules` 屬性指定要載入的模組。

假設您在兩個套件中定義了三個模組：兩個模組在 `com.example` 套件中，一個模組在 `org.sample` 套件中。

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

要在配置檔中引用這些模組，您需要提供它們的完全限定名稱。模組的完全限定名稱包含類別的完全限定名稱和擴充函數名稱。

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

您可以在此處找到完整範例：[engine-main-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules)。

## 並行模組載入

在建立應用程式模組時，您可以使用暫停函數。它們允許事件在啟動應用程式時非同步運行。為此，請添加 `suspend` 關鍵字：

```kotlin
suspend fun Application.installEvents() {
    val kubernetesConnection = connect(property<KubernetesConfig>("app.events"))
}
```

您也可以獨立啟動所有應用程式模組，這樣當一個模組暫停時，其他模組不會被阻塞。這允許進行非依序載入以實現依賴注入，並且在某些情況下可以加快載入速度。

### 配置選項

以下配置屬性可用：

| 屬性                                | 類型                        | 說明                                              | 預設值      |
|-----------------------------------------|-----------------------------|----------------------------------------------------------|--------------|
| `ktor.application.startup`              | `sequential` / `concurrent` | 定義應用程式模組的載入方式               | `sequential` |
| `ktor.application.startupTimeoutMillis` | `Long`                      | 應用程式模組載入逾時（毫秒） | `10000`      |

### 啟用並行模組載入

要選擇啟用並行模組載入，請將以下屬性添加到您的伺服器配置檔中：

```yaml
# application.conf

ktor {
    application {
        startup = concurrent
    }
}
```

對於依賴注入，您可以按照出現順序載入以下模組而不會出現問題：

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

> 並行模組載入是單執行緒處理。它有助於避免應用程式內部共享狀態中不安全集合的執行緒問題。
>
{style="note"}