[//]: # (title: 自訂外掛程式 - Base API)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="custom-plugin-base-api"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

> 從 v2.0.0 開始，Ktor 提供了一個新的簡化 API 用於[建立自訂外掛程式](server-custom-plugins.md)。
>
{type="note"}

Ktor 公開了用於開發自訂[外掛程式](server-plugins.md)的 API，這些外掛程式可實作通用功能並可在多個應用程式中重複使用。
此 API 允許您攔截不同的[管線](#pipelines)階段，以便在請求/回應處理中加入自訂邏輯。
例如，您可以攔截 `Monitoring` 階段來記錄傳入的請求或收集指標。

## 建立外掛程式 {id="create"}
要建立自訂外掛程式，請遵循以下步驟：

1. 建立一個外掛程式類別並[宣告一個伴隨物件](#create-companion)，該物件需實作以下介面之一：
   - [BaseApplicationPlugin](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-base-application-plugin/index.html)：如果外掛程式應在應用程式層級運作。
   - [BaseRouteScopedPlugin](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-base-route-scoped-plugin/index.html)：如果外掛程式可以[安裝到特定路由](server-plugins.md#install-route)。
2. [實作](#implement)此伴隨物件的 `key` (金鑰) 和 `install` 成員。
3. 提供[外掛程式配置](#plugin-configuration)。
4. 透過攔截必要的管線階段來[處理呼叫](#call-handling)。
5. [安裝外掛程式](#install)。

### 建立伴隨物件 {id="create-companion"}

自訂外掛程式的類別應該有一個實作 `BaseApplicationPlugin` 或 `BaseRouteScopedPlugin` 介面的伴隨物件。
`BaseApplicationPlugin` 介面接受三個型別參數：
- 此外掛程式相容的管線型別。
- 此外掛程式的[配置物件型別](#plugin-configuration)。
- 外掛程式物件的執行個體型別。

```kotlin
class CustomHeader() {
    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, CustomHeader> {
        // ...
    }
}
```

### 實作 'key' 和 'install' 成員 {id="implement"}

作為 `BaseApplicationPlugin` 介面的衍生，伴隨物件應實作兩個成員：
- `key` 屬性用於識別外掛程式。Ktor 擁有所有屬性的對應表，每個外掛程式都會使用指定的金鑰將自己加入此對應表中。
- `install` 函式允許您配置外掛程式的運作方式。在這裡您需要攔截管線並傳回外掛程式執行個體。我們將在[下一章](#call-handling)中了解如何攔截管線並處理呼叫。

```kotlin
class CustomHeader() {
    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, CustomHeader> {
        override val key = AttributeKey<CustomHeader>("CustomHeader")
        override fun install(pipeline: ApplicationCallPipeline, configure: Configuration.() -> Unit): CustomHeader {
            val plugin = CustomHeader()
            // 攔截管線 ...
            return plugin
        }
    }
}
```

### 處理呼叫 {id="call-handling"}

在您的自訂外掛程式中，您可以透過攔截[現有的管線階段](#pipelines)或新定義的階段來處理請求和回應。例如，[Authentication](server-auth.md) 外掛程式將 `Authenticate` 和 `Challenge` 自訂階段加入到預設管線中。因此，攔截特定的管線允許您存取呼叫的不同階段，例如：

- `ApplicationCallPipeline.Monitoring`：攔截此階段可用於請求記錄或收集指標。
- `ApplicationCallPipeline.Plugins`：可用於修改回應參數，例如附加自訂標頭。
- `ApplicationReceivePipeline.Transform` 和 `ApplicationSendPipeline.Transform`：允許您取得並[轉換](#transform)從用戶端收到的資料，以及在傳回資料前進行轉換。

下面的範例示範如何攔截 `ApplicationCallPipeline.Plugins` 階段並在每個回應中附加一個自訂標頭：

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

請注意，此外掛程式中的自訂標頭名稱和值是寫死的。您可以透過[提供配置](#plugin-configuration)來傳遞所需的自訂標頭名稱/值，使此外掛程式更加靈活。

> 自訂外掛程式允許您共用與呼叫相關的任何值，因此您可以在處理此呼叫的任何處理常式中存取此值。您可以從[共用呼叫狀態](server-custom-plugins.md#call-state)中了解更多資訊。

### 提供外掛程式配置 {id="plugin-configuration"}

[前一章](#call-handling)展示了如何建立一個將預定義自訂標頭附加到每個回應的外掛程式。讓我們讓此外掛程式更有用，並提供一個配置來傳遞所需的自訂標頭名稱/值。首先，您需要在外掛程式類別中定義一個配置類別：

```kotlin
class Configuration {
    var headerName = "Custom-Header-Name"
    var headerValue = "Default value"
}
```

鑑於外掛程式配置欄位是可變的，建議將它們儲存在區域變數中：

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

最後，在 `install` 函式中，您可以取得此配置並使用其屬性：

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

### 安裝外掛程式 {id="install"}

要將自訂外掛程式[安裝](server-plugins.md#install)到您的應用程式，請呼叫 `install` 函式並傳遞所需的[配置](#plugin-configuration)參數：

```kotlin
install(CustomHeader) {
    headerName = "X-Custom-Header"
    headerValue = "Hello, world!"
}
```

## 範例 {id="examples"}

下面的程式碼片段示範了自訂外掛程式的幾個範例。
您可以在此處找到可執行的專案：[custom-plugin-base-api](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin-base-api)

### 請求記錄 {id="request-logging"}

下面的範例顯示如何建立一個用於記錄傳入請求的自訂外掛程式：

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

### 自訂標頭 {id="custom-header"}

此範例示範如何建立一個在每個回應中附加自訂標頭的外掛程式：

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

### 內容轉換 {id="transform"}

下面的範例展示了如何：
- 轉換從用戶端收到的資料；
- 轉換要發送到用戶端的資料。

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

## 管線 {id="pipelines"}

Ktor 中的 [Pipeline](https://api.ktor.io/ktor-utils/io.ktor.util.pipeline/-pipeline/index.html)（管線）是攔截器的集合，分組在一個或多個有序階段中。每個攔截器都可以在處理請求之前和之後執行自訂邏輯。

[ApplicationCallPipeline](https://api.ktor.io/ktor-server-core/io.ktor.server.application/-application-call-pipeline/index.html) 是用於執行應用程式呼叫的管線。此管線定義了 5 個階段：

- `Setup`：用於準備呼叫及其屬性以進行處理的階段。
- `Monitoring`：用於執行緒呼叫的階段。它對於請求記錄、收集指標、錯誤處理等可能很有用。
- `Plugins`：用於[處理呼叫](#call-handling)的階段。大多數外掛程式在此階段進行攔截。
- `Call`：用於完成呼叫的階段。
- `Fallback`：用於處理未處理呼叫的階段。

## 管線階段到新 API 處理常式的對應 {id="mapping"}

從 v2.0.0 開始，Ktor 提供了一個新的簡化 API 用於[建立自訂外掛程式](server-custom-plugins.md)。
一般而言，此 API 不需要了解 Ktor 內部概念，例如管線、階段等。相反地，您可以使用各種處理常式（例如 `onCall`、`onCallReceive`、`onCallRespond` 等）來存取[處理請求和回應](#call-handling)的不同階段。
下表顯示了管線階段如何對應到新 API 中的處理常式。

| Base API                               | New API                                                 |
|----------------------------------------|---------------------------------------------------------|
| 在 `ApplicationCallPipeline.Setup` 之前 | [on(CallFailed)](server-custom-plugins.md#other)               |
| `ApplicationCallPipeline.Setup`        | [on(CallSetup)](server-custom-plugins.md#other)                |
| `ApplicationCallPipeline.Plugins`      | [onCall](server-custom-plugins.md#on-call)                     |
| `ApplicationReceivePipeline.Transform` | [onCallReceive](server-custom-plugins.md#on-call-receive)      |
| `ApplicationSendPipeline.Transform`    | [onCallRespond](server-custom-plugins.md#on-call-respond)      |
| `ApplicationSendPipeline.After`        | [on(ResponseBodyReadyForSend)](server-custom-plugins.md#other) |
| `ApplicationSendPipeline.Engine`       | [on(ResponseSent)](server-custom-plugins.md#other)             |
| 在 `Authentication.ChallengePhase` 之後  | [on(AuthenticationChecked)](server-custom-plugins.md#other)    |