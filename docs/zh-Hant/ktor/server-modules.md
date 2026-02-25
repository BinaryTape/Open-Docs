[//]: # (title: 模組)

<tldr>
<p>
<b>程式碼範例</b>： 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules">embedded-server-modules</a>, 
<a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules">engine-main-modules</a>
</p>
</tldr>

<link-summary>模組可讓您透過對路由進行分組來建構應用程式。</link-summary>
<show-structure for="chapter" depth="2"/>

Ktor 允許您使用模組來建構應用程式，方法是在特定模組內定義一組特定的[路由](server-routing.md)。模組是 `Application` 上的擴充函式，用於設定路由、安裝外掛程式以及配置服務。使用模組有助於：

- 將相關的路由與邏輯歸類在一起。
- 保持特性（Feature）或領域（Domain）的隔離。
- 實現更簡單的測試與模組化部署。

> 若要了解更多關於架構模式與模組組織的資訊，請參閱 [Application structure](server-application-structure.md)

## 定義模組 {id="defining-a-module"}

模組是 [`Application`](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-application/index.html) 類別的 _[擴充函式](https://kotlinlang.org/docs/extensions.html)_。在下方的範例中，`module1` 擴充函式定義了一個模組，用於接收對 `/module1` URL 路徑的 GET 請求。

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

在應用程式中載入模組取決於[建立伺服器](server-create-and-configure.topic)的方式：在程式碼中使用 `embeddedServer` 函式，或使用 `application.conf` 配置檔案。

> 請注意，安裝在指定模組中的[外掛程式](server-plugins.md#install)對其他載入的模組也有效。

## 載入模組 {id="loading-modules"}
### 嵌入式伺服器 {id="embedded-server"}

通常，`embeddedServer` 函式隱式地接受一個模組作為 Lambda 引數。 
您可以在[程式碼中的配置](server-create-and-configure.topic#embedded-server)章節中看到範例。
您也可以將應用程式邏輯提取到獨立的模組中，並將該模組的參照作為 `module` 參數傳遞：

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

您可以在此處找到完整的範例：[embedded-server-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server-modules)。

### 配置檔案 {id="hocon"}

如果您使用 `application.conf` 或 `application.yaml` 檔案來配置伺服器，則需要使用 `ktor.application.modules` 屬性指定要載入的模組。 

假設您在兩個套件中定義了三個模組：`com.example` 套件中有兩個模組，`org.sample` 套件中有一個模組。

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

若要在配置檔案中參照這些模組，您需要提供其完全限定名稱。
完全限定模組名稱包括類別的完全限定名稱與擴充函式名稱。

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

您可以在此處找到完整的範例：[engine-main-modules](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main-modules)。

## 模組相依性

模組通常需要共用服務、存儲庫（Repository）或配置。相較於在模組內部建立相依性，注入相依性可提高可測試性與靈活性。根據專案的複雜程度，Ktor 提供多種方法。

### 透過參數傳遞相依性

傳遞相依性最簡單的方法是將其宣告為模組函式的參數：

```kotlin
fun main() {
    embeddedServer(CIO, port = 8080, host = "0.0.0.0") {
        // 具現化您的相依性
        val myService = MyService(property<MyServiceConfig>())
        // 將其作為參數注入到您的模組中
        routingModule(myService)
        schedulingModule(myService)
    }.start(wait = true)
}
```

這對於小型或中型應用程式效果良好，且能保持相依性清晰。然而，模組在編譯時期會變得緊密耦合，且在執行時期不易替換。

### 使用應用程式屬性

您可以使用 `Application.attributes` —— 這是一個適用於所有模組的型別安全對應（Map）：

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

這透過避免模組間的直接參照來建立鬆散耦合。

### 使用相依注入 {id="dependency_injection"}

Ktor 包含一個 [相依注入 (DI) 外掛程式](server-dependency-injection.md)，允許您使用輕量級容器直接在 Ktor 應用程式中宣告與解決相依性。

## 並行模組 {id="concurrent-modules"}

建立應用程式模組時可以使用可掛起函式。它們允許在啟動應用程式時非同步執行事件。若要執行此操作，請新增 `suspend` 關鍵字：

```kotlin
suspend fun Application.installEvents() {
    val kubernetesConnection = connect(property<KubernetesConfig>("app.events"))
}
```

您也可以獨立啟動所有應用程式模組，因此當其中一個模組被掛起時，其他模組不會被阻塞。這允許非順序載入以進行相依注入，並在某些情況下加速載入。

### 配置選項

以下是可用的配置屬性：

| 屬性                                     | 型別                          | 描述                                     | 預設值          |
|----------------------------------------|-----------------------------|----------------------------------------|--------------|
| `ktor.application.startup`             | `sequential` / `concurrent` | 定義應用程式模組如何載入                          | `sequential` |
| `ktor.application.startupTimeoutMillis` | `Long`                      | 應用程式模組載入的逾時時間（以毫秒為單位）                  | `10000`      |

### 啟用並行模組載入

若要選用並行模組載入，請在您的伺服器配置檔案中新增以下內容：

```yaml
# application.conf

ktor {
    application {
        startup = concurrent
    }
}
```

對於相依注入，您可以按出現順序載入以下模組而不會發生問題：

```kotlin
suspend fun Application.installEvents() {
    // 掛起直到提供為止
    val kubernetesConnection = dependencies.resolve<KubernetesConnection>()
}

suspend fun Application.loadEventsConnection() {
    dependencies.provide<KubernetesConnection> {
        connect(property<KubernetesConfig>("app.events"))
    }
}
```

> 並行模組載入是一個單執行緒過程。它有助於避免應用程式內部共用狀態中不安全集合的執行緒問題。
>
{style="note"}