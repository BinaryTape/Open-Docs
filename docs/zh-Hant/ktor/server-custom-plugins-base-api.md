[//]: # (title: 自訂插件 - 基礎 API)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="custom-plugin-base-api"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

> 從 v2.0.0 開始，Ktor 提供一個新的簡化 API，用於[建立自訂插件](server-custom-plugins.md)。
>
{type="note"}

Ktor 提供 API，用於開發自訂[插件](server-plugins.md)，這些插件實作常見的功能並可在多個應用程式中重複使用。此 API 允許您攔截不同的[管線](#pipelines)階段，以新增自訂邏輯到請求/回應處理中。例如，您可以攔截 `Monitoring` 階段來記錄傳入的請求或收集指標。

## 建立插件 {id="create"}
若要建立自訂插件，請依照以下步驟操作：

1. 建立一個插件類別，並[宣告一個伴生物件](#create-companion)，該物件實作以下其中一個介面：
   - [BaseApplicationPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-base-application-plugin/index.html) 如果插件應在應用程式層級運作。
   - [BaseRouteScopedPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-base-route-scoped-plugin/index.html) 如果插件可以[安裝到特定路由](server-plugins.md#install-route)。
2. [實作](#implement)此伴生物件的 `key` 和 `install` 成員。
3. 提供[插件配置](#plugin-configuration)。
4. 透過攔截所需的管線階段來[處理呼叫](#call-handling)。
5. [安裝插件](#install)。

### 建立伴生物件 {id="create-companion"}

自訂插件的類別應該有一個伴生物件，實作 `BaseApplicationPlugin` 或 `BaseRouteScopedPlugin` 介面。
`BaseApplicationPlugin` 介面接受三個型別參數：
- 此插件相容的管線型別。
- 此插件的[配置物件型別](#plugin-configuration)。
- 插件物件的實例型別。

```kotlin
class CustomHeader() {
    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, CustomHeader> {
        // ...
    }
}
```

### 實作 'key' 和 'install' 成員 {id="implement"}

作為 `BaseApplicationPlugin` 介面的後代，伴生物件應實作兩個成員：
- `key` 屬性用於識別插件。Ktor 有一個所有屬性的映射表，每個插件都使用指定的 `key` 將自己新增到此映射表中。
- `install` 函式允許您配置插件的運作方式。在這裡，您需要攔截一個管線並返回一個插件實例。我們將在[下一章](#call-handling)中探討如何攔截管線並處理呼叫。

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

### 處理呼叫 {id="call-handling"}

在您的自訂插件中，您可以透過攔截[現有管線階段](#pipelines)或新定義的階段來處理請求和回應。例如，[Authentication](server-auth.md) 插件將 `Authenticate` 和 `Challenge` 這兩個自訂階段新增到預設管線中。因此，攔截特定管線允許您存取呼叫的不同階段，例如：

- `ApplicationCallPipeline.Monitoring`：攔截此階段可用於請求記錄或收集指標。
- `ApplicationCallPipeline.Plugins`：可用於修改回應參數，例如，附加自訂標頭。
- `ApplicationReceivePipeline.Transform` 和 `ApplicationSendPipeline.Transform`：允許您取得並[轉換](#transform)來自客戶端的資料，並在發送回覆前轉換資料。

以下範例展示了如何攔截 `ApplicationCallPipeline.Plugins` 階段，並為每個回應附加一個自訂標頭：

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

請注意，此插件中的自訂標頭名稱和值是硬編碼的。您可以透過[提供配置](#plugin-configuration)來傳遞所需的自訂標頭名稱/值，從而使此插件更具彈性。

> 自訂插件允許您共享任何與呼叫相關的值，以便您可以在處理此呼叫的任何處理器中存取此值。您可以從 [](server-custom-plugins.md#call-state) 中了解更多資訊。

### 提供插件配置 {id="plugin-configuration"}

[上一章](#call-handling)展示了如何建立一個插件，該插件為每個回應附加一個預定義的自訂標頭。讓我們讓這個插件更有用，並提供一個配置來傳遞所需的自訂標頭名稱/值。首先，您需要在插件的類別中定義一個配置類別：

[object Promise]

鑑於插件配置欄位是可變的，建議將它們儲存到本地變數中：

[object Promise]

最後，在 `install` 函式中，您可以取得此配置並使用其屬性 

[object Promise]

### 安裝插件 {id="install"}

若要[安裝](server-plugins.md#install)自訂插件到您的應用程式中，請呼叫 `install` 函式並傳遞所需的[配置](#plugin-configuration)參數：

[object Promise]

## 範例 {id="examples"}

以下程式碼片段展示了幾個自訂插件的範例。
您可以在這裡找到可執行的專案：[custom-plugin-base-api](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin-base-api)

### 請求記錄 {id="request-logging"}

以下範例展示了如何建立一個自訂插件，用於記錄傳入的請求：

[object Promise]

### 自訂標頭 {id="custom-header"}

此範例展示了如何建立一個插件，該插件為每個回應附加一個自訂標頭：

[object Promise]

### 內容轉換 {id="transform"}

以下範例展示了如何：
- 轉換從客戶端接收到的資料； 
- 轉換要發送給客戶端的資料。

[object Promise]

## 管線 {id="pipelines"}

Ktor 中的[管線](https://api.ktor.io/ktor-utils/io.ktor.util.pipeline/-pipeline/index.html)是一組攔截器，它們被分組在一個或多個有序階段中。每個攔截器都可以在處理請求之前和之後執行自訂邏輯。

[ApplicationCallPipeline](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call-pipeline/index.html) 是用於執行應用程式呼叫的管線。此管線定義了 5 個階段：

- `Setup`：用於準備呼叫及其處理屬性的階段。
- `Monitoring`：用於追蹤呼叫的階段。它可能對於請求記錄、收集指標、錯誤處理等有用。
- `Plugins`：用於[處理呼叫](#call-handling)的階段。大多數插件都在此階段進行攔截。
- `Call`：用於完成呼叫的階段。
- `Fallback`：用於處理未處理呼叫的階段。

## 管線階段與新 API 處理器的對應關係 {id="mapping"}

從 v2.0.0 開始，Ktor 提供一個新的簡化 API，用於[建立自訂插件](server-custom-plugins.md)。
一般而言，此 API 不需要理解 Ktor 的內部概念，例如管線、階段等等。相反地，您可以存取[處理請求和回應](#call-handling)的不同階段，透過各種處理器，例如 `onCall`、`onCallReceive`、`onCallRespond` 等等。
下表顯示了管線階段如何對應到新 API 中的處理器。

| 基礎 API                               | 新 API                                                 |
|----------------------------------------|---------------------------------------------------------|
| before `ApplicationCallPipeline.Setup` | [on(CallFailed)](server-custom-plugins.md#other)               |
| `ApplicationCallPipeline.Setup`        | [on(CallSetup)](server-custom-plugins.md#other)                |
| `ApplicationCallPipeline.Plugins`      | [onCall](server-custom-plugins.md#on-call)                     |
| `ApplicationReceivePipeline.Transform` | [onCallReceive](server-custom-plugins.md#on-call-receive)      |
| `ApplicationSendPipeline.Transform`    | [onCallRespond](server-custom-plugins.md#on-call-respond)      |
| `ApplicationSendPipeline.After`        | [on(ResponseBodyReadyForSend)](server-custom-plugins.md#other) |
| `ApplicationSendPipeline.Engine`       | [on(ResponseSent)](server-custom-plugins.md#other)             |
| after `Authentication.ChallengePhase`  | [on(AuthenticationChecked)](server-custom-plugins.md#other)    |