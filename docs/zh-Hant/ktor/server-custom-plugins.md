[//]: # (title: 自訂伺服器外掛)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="custom-plugin"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<link-summary>
了解如何建立您自己的自訂外掛。
</link-summary>

從 v2.0.0 開始，Ktor 提供了一個新的 API，用於建立自訂[外掛](server-plugins.md)。一般來說，這個 API 不要求了解 Ktor 的內部概念，例如管線（pipelines）、階段（phases）等。相反地，您可以使用 `onCall`、`onCallReceive` 和 `onCallRespond` 處理器，來存取[處理請求和回應](#call-handling)的不同階段。

> 本主題中描述的 API 對於 v2.0.0 及更高版本有效。對於舊版本，您可以使用[基本 API](server-custom-plugins-base-api.md)。

## 建立並安裝您的第一個外掛 {id="first-plugin"}

在本節中，我們將示範如何建立並安裝您的第一個外掛。您可以使用在 [](server-create-a-new-project.topic) 教學中建立的應用程式作為起始專案。

1. 若要建立外掛，請呼叫 [createApplicationPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/create-application-plugin.html) 函式並傳遞外掛名稱：
   [object Promise]

   此函式會傳回 `ApplicationPlugin` 實例，該實例將在下一步用於安裝外掛。
   > 還有 [createRouteScopedPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/create-route-scoped-plugin.html) 函式，可讓您建立可[安裝到特定路由](server-plugins.md#install-route)的外掛。
2. 若要[安裝外掛](server-plugins.md#install)，請將建立的 `ApplicationPlugin` 實例傳遞給應用程式初始化程式碼中的 `install` 函式：
   [object Promise]
3. 最後，[執行](server-run.md)您的應用程式，以在主控台輸出中看到外掛的問候語：
   ```Bash
   2021-10-14 14:54:08.269 [main] INFO  Application - Autoreload is disabled because the development mode is off.
   SimplePlugin is installed!
   2021-10-14 14:54:08.900 [main] INFO  Application - Responding at http://0.0.0.0:8080
   ```

您可以在此處找到完整範例：[SimplePlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/SimplePlugin.kt)。在以下各節中，我們將探討如何在不同階段處理呼叫並提供外掛組態。

## 處理呼叫 {id="call-handling"}

在您的自訂外掛中，您可以使用一組處理器來[處理請求](server-requests.md)和[回應](server-responses.md)，這些處理器提供了存取呼叫不同階段的功能：

* [onCall](#on-call) 允許您取得請求/回應資訊、修改回應參數（例如，附加自訂標頭）等等。
* [onCallReceive](#on-call-receive) 允許您取得和轉換從用戶端接收的資料。
* [onCallRespond](#on-call-respond) 允許您在將資料傳送給用戶端之前進行轉換。
* [on(...)](#other) 允許您叫用特定的勾點，這對於處理呼叫的其他階段或呼叫期間發生的例外可能很有用。
* 如果需要，您可以使用 `call.attributes` 在不同處理器之間共用[呼叫狀態](#call-state)。

### onCall {id="on-call"}

`onCall` 處理器接受 `ApplicationCall` 作為 lambda 引數。這允許您存取請求/回應資訊並修改回應參數（例如，[附加自訂標頭](#custom-header)）。如果您需要轉換請求/回應主體，請使用 [onCallReceive](#on-call-receive)/[onCallRespond](#on-call-respond)。

#### 範例 1：請求日誌記錄 {id="request-logging"}

以下範例展示了如何使用 `onCall` 來建立一個自訂外掛，用於記錄傳入的請求：

[object Promise]

如果您安裝此外掛，應用程式將在主控台中顯示請求的 URL，例如：

```Bash
Request URL: http://0.0.0.0:8080/
Request URL: http://0.0.0.0:8080/index
```

#### 範例 2：自訂標頭 {id="custom-header"}

此範例示範如何建立一個外掛，將自訂標頭附加到每個回應：

```kotlin
val CustomHeaderPlugin = createApplicationPlugin(name = "CustomHeaderPlugin") {
    onCall { call ->
        call.response.headers.append("X-Custom-Header", "Hello, world!")
    }
}
```

結果，自訂標頭將被新增到所有回應中：

```HTTP
HTTP/1.1 200 OK
X-Custom-Header: Hello, world!
```

請注意，此外掛中的自訂標頭名稱和值是硬編碼的。您可以透過提供[組態](#plugin-configuration)來傳遞所需的自訂標頭名稱/值，從而使此外掛更加靈活。

### onCallReceive {id="on-call-receive"}

`onCallReceive` 處理器提供了 `transformBody` 函式，允許您轉換從用戶端接收的資料。假設用戶端發出一個範例 `POST` 請求，其主體中包含 `10` 作為 `text/plain`：

[object Promise]

若要將此[主體](server-requests.md#objects)作為整數值接收，您需要為 `POST` 請求建立一個路由處理器，並使用 `Int` 參數呼叫 `call.receive`：

[object Promise]

現在讓我們建立一個外掛，該外掛接收一個整數值作為主體並向其添加 `1`。為此，我們需要像這樣在 `onCallReceive` 內部處理 `transformBody`：

[object Promise]

上面程式碼片段中的 `transformBody` 運作方式如下：

1. `TransformBodyContext` 是一個 [lambda 接收者](https://kotlinlang.org/docs/scope-functions.html#context-object-this-or-it)，其中包含有關當前請求的型別資訊。在上面的範例中，`TransformBodyContext.requestedType` 屬性用於檢查請求的資料型別。
2. `data` 是一個 lambda 引數，允許您將請求主體作為 [ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html) 接收並將其轉換為所需型別。在上面的範例中，`ByteReadChannel.readUTF8Line` 用於讀取請求主體。
3. 最後，您需要轉換並傳回資料。在我們的範例中，`1` 被新增到接收到的整數值。

您可以在此處找到完整範例：[DataTransformationPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationPlugin.kt)。

### onCallRespond {id="on-call-respond"}

`onCallRespond` 也提供了 `transformBody` 處理器，允許您轉換要傳送給用戶端的資料。當路由處理器中呼叫 `call.respond` 函式時，此處理器會執行。讓我們繼續[onCallReceive](#on-call-receive) 中的範例，其中在 `POST` 請求處理器中接收到一個整數值：

[object Promise]

呼叫 `call.respond` 會叫用 `onCallRespond`，進而允許您轉換要傳送給用戶端的資料。例如，以下程式碼片段顯示如何將 `1` 添加到初始值：

[object Promise]

您可以在此處找到完整範例：[DataTransformationPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationPlugin.kt)。

### 其他有用的處理器 {id="other"}

除了 `onCall`、`onCallReceive` 和 `onCallRespond` 處理器之外，Ktor 還提供了一組特定的勾點，這對於處理呼叫的其他階段可能很有用。您可以使用接受 `Hook` 作為參數的 `on` 處理器來處理這些勾點。這些勾點包括：

- `CallSetup` 在處理呼叫時作為第一步被叫用。
- `ResponseBodyReadyForSend` 在回應主體經過所有轉換並準備好傳送時被叫用。
- `ResponseSent` 在回應成功傳送給用戶端時被叫用。
- `CallFailed` 在呼叫因例外而失敗時被叫用。
- [AuthenticationChecked](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication-checked/index.html) 在[驗證](server-auth.md)憑證被檢查後執行。以下範例展示了如何使用此勾點來實作授權：[custom-plugin-authorization](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin-authorization)。

以下範例展示了如何處理 `CallSetup`：

```kotlin
on(CallSetup) { call->
    // ...
}
```

> 還有 `MonitoringEvent` 勾點，它允許您[處理應用程式事件](#handle-app-events)，例如應用程式啟動或關閉。

### 共用呼叫狀態 {id="call-state"}

自訂外掛允許您共用與呼叫相關的任何值，因此您可以在處理此呼叫的任何處理器內部存取此值。此值作為具有唯一鍵的屬性儲存在 `call.attributes` 集合中。以下範例示範如何使用屬性來計算接收請求和讀取主體之間的時間：

[object Promise]

如果您發出 `POST` 請求，外掛會在主控台中列印延遲：

```Bash
Request URL: http://localhost:8080/transform-data
Read body delay (ms): 52
```

您可以在此處找到完整範例：[DataTransformationBenchmarkPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationBenchmarkPlugin.kt)。

> 您也可以在[路由處理器](server-requests.md#request_information)中存取呼叫屬性。

## 處理應用程式事件 {id="handle-app-events"}

[on](#other) 處理器提供了使用 `MonitoringEvent` 勾點來處理與應用程式生命週期相關的事件的能力。例如，您可以將以下[預定義事件](server-events.md#predefined-events)傳遞給 `on` 處理器：

- `ApplicationStarting`
- `ApplicationStarted`
- `ApplicationStopPreparing`
- `ApplicationStopping`
- `ApplicationStopped`

以下程式碼片段展示了如何使用 `ApplicationStopped` 處理應用程式關閉：

[object Promise]

這對於釋放應用程式資源可能很有用。

## 提供外掛組態 {id="plugin-configuration"}

[自訂標頭](#custom-header) 範例示範了如何建立一個外掛，將預定義的自訂標頭附加到每個回應。讓我們使此外掛更有用，並提供一個組態，用於傳遞所需的自訂標頭名稱/值。

1. 首先，您需要定義一個組態類別：

   [object Promise]

2. 若要在外掛中使用此組態，請將組態類別參考傳遞給 `createApplicationPlugin`：

   [object Promise]

   鑑於外掛組態欄位是可變的，建議將它們儲存為局部變數。

3. 最後，您可以按以下方式安裝和組態外掛：

   [object Promise]

> 您可以在此處找到完整範例：[CustomHeaderPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderPlugin.kt)。

### 檔案中的組態 {id="configuration-file"}

Ktor 允許您在[組態檔案](server-create-and-configure.topic#engine-main)中指定外掛設定。讓我們看看如何為 `CustomHeaderPlugin` 實現這一點：

1. 首先，將帶有外掛設定的新群組新增到 `application.conf` 或 `application.yaml` 檔案中：

   <tabs group="config">
   <tab title="application.conf" group-key="hocon">

   [object Promise]

   </tab>
   <tab title="application.yaml" group-key="yaml">

   [object Promise]

   </tab>
   </tabs>

   在我們的範例中，外掛設定儲存在 `http.custom_header` 群組中。

2. 若要存取組態檔案屬性，請將 `ApplicationConfig` 傳遞給組態類別建構函式。`tryGetString` 函式傳回指定的屬性值：

   [object Promise]

3. 最後，將 `http.custom_header` 值指派給 `createApplicationPlugin` 函式的 `configurationPath` 參數：

   [object Promise]

> 您可以在此處找到完整範例：[CustomHeaderPluginConfigurable.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderPluginConfigurable.kt)。

## 存取應用程式設定 {id="app-settings"}

### 組態 {id="config"}

您可以使用 `applicationConfig` 屬性存取您的伺服器組態，該屬性會傳回 [ApplicationConfig](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.config/-application-config/index.html) 實例。以下範例展示了如何取得伺服器使用的主機和埠：

```kotlin
val SimplePlugin = createApplicationPlugin(name = "SimplePlugin") {
   val host = applicationConfig?.host
   val port = applicationConfig?.port
   println("Listening on $host:$port")
}
```

### 環境 {id="environment"}

若要存取應用程式的環境，請使用 `environment` 屬性。例如，此屬性允許您判斷是否啟用了[開發模式](server-development-mode.topic)：

```kotlin
val SimplePlugin = createApplicationPlugin(name = "SimplePlugin") {
   val isDevMode = environment?.developmentMode
   onCall { call ->
      if (isDevMode == true) {
         println("handling request ${call.request.uri}")
      }
   }
}
```

## 其他 {id="misc"}

### 儲存外掛狀態 {id="plugin-state"}

若要儲存外掛的狀態，您可以從處理器 lambda 中捕獲任何值。請注意，建議使用並行資料結構和原子資料型別來確保所有狀態值都是執行緒安全的：

```kotlin
val SimplePlugin = createApplicationPlugin(name = "SimplePlugin") {
   val activeRequests = AtomicInteger(0)
   onCall {
      activeRequests.incrementAndGet()
   }
   onCallRespond {
      activeRequests.decrementAndGet()
   }
}
```

### 資料庫 {id="databases"}

* 我可以使用自訂外掛與可暫停資料庫一起使用嗎？

  是的。所有處理器都是暫停函式，因此您可以在外掛內部執行任何可暫停的資料庫操作。但不要忘記為特定呼叫釋放資源（例如，透過使用 [on(ResponseSent)](#other)）。

* 如何使用自訂外掛與阻塞資料庫一起使用？

  由於 Ktor 使用協程和暫停函式，向阻塞資料庫發出請求可能很危險，因為執行阻塞呼叫的協程可能會被阻塞，然後永遠暫停。為防止這種情況，您需要建立一個單獨的[協程上下文](https://kotlinlang.org/docs/coroutine-context-and-dispatchers.html)：
   ```kotlin
   val databaseContext = newSingleThreadContext("DatabaseThread")
   ```
  然後，一旦您的上下文建立，將您對資料庫的每個呼叫包裝到 `withContext` 呼叫中：
   ```kotlin
   onCall {
       withContext(databaseContext) {
           database.access(...) // some call to your database
       }
   }
   ```