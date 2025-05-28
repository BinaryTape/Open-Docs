[//]: # (title: 自訂外掛 – 基本 API)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="custom-plugin-base-api"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

> 從 v2.0.0 開始，Ktor 提供了一個新的簡化 API 用於[建立自訂外掛](server-custom-plugins.md)。
>
{type="note"}

Ktor 提供 API 以開發自訂[外掛](server-plugins.md)，這些外掛實作常見功能並可在多個應用程式中重複使用。此 API 允許您攔截不同的[管線 (pipeline)](#pipelines) 階段，以將自訂邏輯新增到請求/回應處理中。例如，您可以攔截 `Monitoring` 階段來記錄傳入請求或收集指標。

## 建立外掛 {id="create"}
要建立自訂外掛，請依照以下步驟操作：

1. 建立外掛類別並[宣告伴生物件 (companion object)](#create-companion)，該伴生物件實作下列其中一個介面：
   - [BaseApplicationPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-base-application-plugin/index.html) 如果外掛應在應用程式層級運作。
   - [BaseRouteScopedPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-base-route-scoped-plugin/index.html) 如果外掛可以[安裝到特定路由 (route)](server-plugins.md#install-route)。
2. [實作](#implement)此伴生物件的 `key` 和 `install` 成員。
3. 提供[外掛組態 (configuration)](#plugin-configuration)。
4. 透過攔截所需的管線階段來[處理呼叫](#call-handling)。
5. [安裝外掛](#install)。

### 建立伴生物件 {id="create-companion"}

自訂外掛的類別應包含一個伴生物件，該伴生物件實作 `BaseApplicationPlugin` 或 `BaseRouteScopedPlugin` 介面。
`BaseApplicationPlugin` 介面接受三個型別參數：
- 此外掛相容的管線型別。
- 此外掛的[組態物件型別](#plugin-configuration)。
- 外掛物件的實例型別。

```kotlin
class CustomHeader() {
    companion object Plugin : BaseApplicationPlugin<ApplicationCallPipeline, Configuration, CustomHeader> {
        // ...
    }
}
```

### 實作 'key' 和 'install' 成員 {id="implement"}

作為 `BaseApplicationPlugin` 介面的子代 (descendant)，伴生物件應實作兩個成員：
- `key` 屬性用於識別外掛。Ktor 具有所有屬性的映射 (map)，每個外掛都使用指定的 key 將自身新增到此映射中。
- `install` 函式允許您組態外掛的運作方式。在這裡，您需要攔截一個管線並回傳一個外掛實例 (instance)。我們將在[下一章](#call-handling)探討如何攔截管線並處理呼叫。

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

在您的自訂外掛中，您可以透過攔截[現有管線階段](#pipelines)或新定義的階段來處理請求和回應。例如，[Authentication](server-auth.md) 外掛將 `Authenticate` 和 `Challenge` 自訂階段新增到預設管線。因此，攔截特定管線讓您可以存取呼叫的不同階段，例如：

- `ApplicationCallPipeline.Monitoring`：攔截此階段可用於請求記錄或收集指標。
- `ApplicationCallPipeline.Plugins`：可用於修改回應參數，例如，附加自訂標頭 (header)。
- `ApplicationReceivePipeline.Transform` 和 `ApplicationSendPipeline.Transform`：允許您取得並[轉換 (transform) 資料](#transform)從用戶端接收的資料，並在將資料傳回之前進行轉換。

以下範例展示了如何攔截 `ApplicationCallPipeline.Plugins` 階段並將自訂標頭附加到每個回應：

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

請注意，此外掛中的自訂標頭名稱和值是硬編碼 (hardcoded) 的。您可以透過[提供組態](#plugin-configuration)來傳遞所需的自訂標頭名稱/值，以讓此外掛更具彈性。

> 自訂外掛允許您共享與呼叫相關的任何值，因此您可以在任何處理此呼叫的處理器 (handler) 中存取此值。您可以從[](server-custom-plugins.md#call-state)中了解更多。

### 提供外掛組態 {id="plugin-configuration"}

[上一章](#call-handling)展示了如何建立一個將預定義自訂標頭附加到每個回應的外掛。讓我們讓此外掛更有用，並提供組態用於傳遞所需的自訂標頭名稱/值。首先，您需要在外掛類別內部定義一個組態類別：

```kotlin
```
{src="snippets/custom-plugin-base-api/src/main/kotlin/com/example/plugins/CustomHeader.kt" include-lines="11-14"}

由於外掛組態欄位是可變的 (mutable)，建議將其儲存在局部變數中：

```kotlin
```
{src="snippets/custom-plugin-base-api/src/main/kotlin/com/example/plugins/CustomHeader.kt" include-lines="7-14,27"}

最後，在 `install` 函式中，您可以取得此組態並使用其屬性

```kotlin
```
{src="snippets/custom-plugin-base-api/src/main/kotlin/com/example/plugins/CustomHeader.kt" include-lines="7-27"}

### 安裝外掛 {id="install"}

要將自訂外掛[安裝](server-plugins.md#install)到您的應用程式，請呼叫 `install` 函式並傳遞所需的[組態](#plugin-configuration)參數：

```kotlin
```
{src="snippets/custom-plugin-base-api/src/main/kotlin/com/example/Application.kt" include-lines="12-15"}

## 範例 {id="examples"}

以下程式碼片段展示了幾個自訂外掛的範例。
您可以在此處找到可執行專案：[custom-plugin-base-api](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin-base-api)

### 請求記錄 {id="request-logging"}

以下範例展示了如何建立一個用於記錄傳入請求的自訂外掛：

```kotlin
```
{src="snippets/custom-plugin-base-api/src/main/kotlin/com/example/plugins/RequestLogging.kt"}

### 自訂標頭 {id="custom-header"}

此範例展示了如何建立一個將自訂標頭附加到每個回應的外掛：

```kotlin
```
{src="snippets/custom-plugin-base-api/src/main/kotlin/com/example/plugins/CustomHeader.kt"}

### 主體轉換 {id="transform"}

以下範例展示了如何：
- 轉換從用戶端接收的資料；
- 轉換要傳送給用戶端的資料。

```kotlin
```
{src="snippets/custom-plugin-base-api/src/main/kotlin/com/example/plugins/DataTransformation.kt"}

## 管線 {id="pipelines"}

Ktor 中的[管線 (Pipeline)](https://api.ktor.io/ktor-utils/io.ktor.util.pipeline/-pipeline/index.html) 是一組攔截器 (interceptor) 的集合，這些攔截器被分組在一個或多個有序階段中。每個攔截器都可以在處理請求之前和之後執行自訂邏輯。

[ApplicationCallPipeline](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call-pipeline/index.html) 是用於執行應用程式呼叫的管線。此管線定義了 5 個階段：

- `Setup`：用於準備呼叫及其屬性以進行處理的階段。
- `Monitoring`：用於追蹤呼叫的階段。這對於請求記錄、收集指標、錯誤處理等可能很有用。
- `Plugins`：用於[處理呼叫](#call-handling)的階段。大多數外掛都在此階段進行攔截。
- `Call`：用於完成呼叫的階段。
- `Fallback`：用於處理未處理呼叫的階段。

## 管線階段與新 API 處理器的映射 {id="mapping"}

從 v2.0.0 開始，Ktor 提供了一個新的簡化 API 用於[建立自訂外掛](server-custom-plugins.md)。
一般而言，此 API 不需要理解 Ktor 內部概念，例如管線、階段等。相反地，您可以使用各種處理器 (handler) 來存取[處理請求和回應](#call-handling)的不同階段，例如 `onCall`、`onCallReceive`、`onCallRespond` 等。
下表顯示了管線階段如何映射到新 API 中的處理器。

| 基本 API                               | 新 API                                                 |
|----------------------------------------|---------------------------------------------------------|
| before `ApplicationCallPipeline.Setup` | [on(CallFailed)](server-custom-plugins.md#other)               |
| `ApplicationCallPipeline.Setup`        | [on(CallSetup)](server-custom-plugins.md#other)                |
| `ApplicationCallPipeline.Plugins`      | [onCall](server-custom-plugins.md#on-call)                     |
| `ApplicationReceivePipeline.Transform` | [onCallReceive](server-custom-plugins.md#on-call-receive)      |
| `ApplicationSendPipeline.Transform`    | [onCallRespond](server-custom-plugins.md#on-call-respond)      |
| `ApplicationSendPipeline.After`        | [on(ResponseBodyReadyForSend)](server-custom-plugins.md#other) |
| `ApplicationSendPipeline.Engine`       | [on(ResponseSent)](server-custom-plugins.md#other)             |
| after `Authentication.ChallengePhase`  | [on(AuthenticationChecked)](server-custom-plugins.md#other)    |