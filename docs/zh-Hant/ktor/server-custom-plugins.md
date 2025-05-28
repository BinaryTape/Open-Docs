[//]: # (title: 自訂伺服器外掛)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="custom-plugin"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
了解如何建立您自己的自訂外掛。
</link-summary>

從 v2.0.0 開始，Ktor 提供了一個新的 API 用於建立自訂[外掛](server-plugins.md)。通常，這個 API 不需要了解內部的 Ktor 概念，例如管線（pipelines）、階段（phases）等。相反地，您可以使用 `onCall`、`onCallReceive` 和 `onCallRespond` 處理器（handlers）來存取[處理請求與響應](#call-handling)的不同階段。

> 本主題中描述的 API 對於 v2.0.0 及更高版本有效。對於舊版本，您可以使用[基本 API](server-custom-plugins-base-api.md)。

## 建立並安裝您的第一個外掛 {id="first-plugin"}

在本節中，我們將示範如何建立並安裝您的第一個外掛。您可以將在 [](server-create-a-new-project.topic) 教學課程中建立的應用程式作為起始專案。

1.  要建立一個外掛，請呼叫
    [createApplicationPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/create-application-plugin.html)
    函式並傳遞外掛名稱：
    ```kotlin
    ```
    {src="snippets/custom-plugin/src/main/kotlin/com/example/plugins/SimplePlugin.kt" include-lines="3-7"}

    此函式返回 `ApplicationPlugin` 實例，該實例將在下一步中用於安裝外掛。
    > 還有
    [createRouteScopedPlugin](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/create-route-scoped-plugin.html)
    函式，允許您建立可以[安裝到特定路由](server-plugins.md#install-route)的外掛。
2.  要[安裝外掛](server-plugins.md#install)，請將建立的 `ApplicationPlugin` 實例傳遞給應用程式初始化程式碼中的 `install` 函式：
    ```kotlin
    ```
    {src="snippets/custom-plugin/src/main/kotlin/com/example/Application.kt" include-lines="11-12,32"}
3.  最後，[執行](server-run.md)您的應用程式，在控制台輸出中看到外掛的問候語：
    ```Bash
    2021-10-14 14:54:08.269 [main] INFO  Application - Autoreload is disabled because the development mode is off.
    SimplePlugin is installed!
    2021-10-14 14:54:08.900 [main] INFO  Application - Responding at http://0.0.0.0:8080
    ```

您可以在這裡找到完整範例：[SimplePlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/SimplePlugin.kt)。
在接下來的章節中，我們將探討如何處理不同階段的呼叫並提供外掛配置。

## 處理呼叫 {id="call-handling"}

在您的自訂外掛中，您可以使用一組處理器來[處理請求](server-requests.md)和[響應](server-responses.md)，這些處理器提供了對呼叫不同階段的存取權限：

*   [onCall](#on-call) 讓您取得請求/響應資訊、修改響應參數（例如，[附加自訂標頭](#custom-header)）等。
*   [onCallReceive](#on-call-receive) 讓您取得並轉換從用戶端接收的資料。
*   [onCallRespond](#on-call-respond) 讓您在將資料傳送到用戶端之前進行轉換。
*   [on(...)](#other) 讓您調用特定的鉤子（hooks），這些鉤子對於處理呼叫的其他階段或呼叫期間發生的異常可能很有用。
*   如果需要，您可以使用 `call.attributes` 在不同處理器之間共享[呼叫狀態](#call-state)。

### onCall {id="on-call"}

`onCall` 處理器接受 `ApplicationCall` 作為一個 lambda 參數。這讓您可以存取請求/響應資訊並修改響應參數（例如，[附加自訂標頭](#custom-header)）。如果您需要轉換請求/響應主體，請使用 [onCallReceive](#on-call-receive)/[onCallRespond](#on-call-respond)。

#### 範例 1：請求日誌記錄 {id="request-logging"}

下面的範例展示了如何使用 `onCall` 建立一個自訂外掛來記錄傳入請求：

```kotlin
```

{src="snippets/custom-plugin/src/main/kotlin/com/example/plugins/RequestLoggingPlugin.kt" include-lines="6-12"}

如果您安裝此外掛，應用程式將在控制台中顯示請求的 URL，例如：

```Bash
Request URL: http://0.0.0.0:8080/
Request URL: http://0.0.0.0:8080/index
```

#### 範例 2：自訂標頭 {id="custom-header"}

此範例示範如何建立一個為每個響應附加自訂標頭的外掛：

```kotlin
val CustomHeaderPlugin = createApplicationPlugin(name = "CustomHeaderPlugin") {
    onCall { call ->
        call.response.headers.append("X-Custom-Header", "Hello, world!")
    }
}
```

結果，所有響應都將新增一個自訂標頭：

```HTTP
HTTP/1.1 200 OK
X-Custom-Header: Hello, world!
```

請注意，此外掛中的自訂標頭名稱和值是硬編碼的。您可以透過提供[配置](#plugin-configuration)來傳遞所需的自訂標頭名稱/值，從而讓此外掛更具彈性。

### onCallReceive {id="on-call-receive"}

`onCallReceive` 處理器提供了 `transformBody` 函式，並允許您轉換從用戶端接收的資料。假設用戶端發出一個範例 `POST` 請求，其主體中包含 `10` 作為 `text/plain`：

```HTTP
```

{src="snippets/custom-plugin/post.http"}

要將[此主體接收](server-requests.md#objects)為整數值，您需要為 `POST` 請求建立一個路由處理器，並呼叫 `call.receive` 並帶有 `Int` 參數：

```kotlin
```

{src="snippets/custom-plugin/src/main/kotlin/com/example/Application.kt" include-lines="27-28,30"}

現在，我們來建立一個外掛，該外掛接收一個整數值的主體並將 `1` 加到其上。為此，我們需要在 `onCallReceive` 內部處理 `transformBody`，如下所示：

```kotlin
```

{src="snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationPlugin.kt" include-lines="6-16,27"}

上面程式碼片段中的 `transformBody` 運作方式如下：

1.  `TransformBodyContext` 是一個 [lambda 接收器](https://kotlinlang.org/docs/scope-functions.html#context-object-this-or-it)，其中包含有關當前請求的類型資訊。在上面的範例中，`TransformBodyContext.requestedType` 屬性用於檢查請求的資料類型。
2.  `data` 是一個 lambda 參數，允許您將請求主體接收為 [ByteReadChannel](https://api.ktor.io/ktor-io/io.ktor.utils.io/-byte-read-channel/index.html) 並將其轉換為所需類型。在上面的範例中，`ByteReadChannel.readUTF8Line` 用於讀取請求主體。
3.  最後，您需要轉換並返回資料。在我們的範例中，將 `1` 加到接收到的整數值上。

您可以在這裡找到完整範例：[DataTransformationPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationPlugin.kt)。

### onCallRespond {id="on-call-respond"}

`onCallRespond` 也提供了 `transformBody` 處理器，並允許您轉換要發送到用戶端的資料。此處理器在路由處理器中呼叫 `call.respond` 函式時執行。讓我們繼續[onCallReceive](#on-call-receive) 的範例，其中在 `POST` 請求處理器中接收到一個整數值：

```kotlin
```

{src="snippets/custom-plugin/src/main/kotlin/com/example/Application.kt" include-lines="27-30"}

呼叫 `call.respond` 會調用 `onCallRespond`，進而允許您轉換要發送到用戶端的資料。例如，下面的程式碼片段展示了如何將 `1` 加到初始值上：

```kotlin
```

{src="snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationPlugin.kt" include-lines="18-26"}

您可以在這裡找到完整範例：[DataTransformationPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationPlugin.kt)。

### 其他有用的處理器 {id="other"}

除了 `onCall`、`onCallReceive` 和 `onCallRespond` 處理器之外，Ktor 還提供了一組特定的鉤子，這些鉤子對於處理呼叫的其他階段可能很有用。您可以使用接受 `Hook` 作為參數的 `on` 處理器來處理這些鉤子。這些鉤子包括：

-   `CallSetup` 在處理呼叫的第一步被調用。
-   `ResponseBodyReadyForSend` 在響應主體經過所有轉換並準備發送時被調用。
-   `ResponseSent` 在響應成功發送給用戶端時被調用。
-   `CallFailed` 在呼叫因異常而失敗時被調用。
-   [AuthenticationChecked](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-auth/io.ktor.server.auth/-authentication-checked/index.html)
    在[驗證](server-auth.md)憑證檢查後執行。以下範例展示了如何使用此鉤子來實作
    授權：[custom-plugin-authorization](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin-authorization)。

下面的範例展示了如何處理 `CallSetup`：

```kotlin
on(CallSetup) { call->
    // ...
}
```

> 還有 `MonitoringEvent` 鉤子，它允許您[處理應用程式事件](#handle-app-events)，例如應用程式啟動或關閉。

### 共享呼叫狀態 {id="call-state"}

自訂外掛允許您共享與呼叫相關的任何值，因此您可以在處理此呼叫的任何處理器內部存取此值。此值作為具有唯一鍵的屬性儲存在 `call.attributes` 集合中。下面的範例示範如何使用屬性來計算從接收請求到讀取主體之間的時間：

```kotlin
```

{src="snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationBenchmarkPlugin.kt"
include-lines="6-18"}

如果您發出 `POST` 請求，該外掛將在控制台中印出延遲時間：

```Bash
Request URL: http://localhost:8080/transform-data
Read body delay (ms): 52
```

您可以在這裡找到完整範例：[DataTransformationBenchmarkPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/DataTransformationBenchmarkPlugin.kt)。

> 您也可以在[路由處理器](server-requests.md#request_information)中存取呼叫屬性。

## 處理應用程式事件 {id="handle-app-events"}

[on](#other) 處理器提供了使用 `MonitoringEvent` 鉤子來處理與應用程式生命週期相關的事件的能力。
例如，您可以將以下[預定義事件](server-events.md#predefined-events)傳遞給 `on` 處理器：

-   `ApplicationStarting`
-   `ApplicationStarted`
-   `ApplicationStopPreparing`
-   `ApplicationStopping`
-   `ApplicationStopped`

下面的程式碼片段展示了如何使用 `ApplicationStopped` 處理應用程式關閉：

```kotlin
```

{src="snippets/events/src/main/kotlin/com/example/plugins/ApplicationMonitoringPlugin.kt" lines="12-13,17"}

這對於釋放應用程式資源可能很有用。

## 提供外掛配置 {id="plugin-configuration"}

[自訂標頭](#custom-header)範例示範了如何建立一個為每個響應附加預定義自訂標頭的外掛。讓我們讓此外掛更有用，並提供一個配置，用於傳遞所需的自訂標頭名稱/值。

1.  首先，您需要定義一個配置類別：

    ```kotlin
    ```
    {src="snippets/custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderPlugin.kt" include-lines="18-21"}

2.  要在外掛中使用此配置，請將配置類別參考傳遞給 `createApplicationPlugin`：

    ```kotlin
    ```
    {src="snippets/custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderPlugin.kt" include-lines="5-16"}

    鑑於外掛配置欄位是可變的，建議將它們儲存到局部變數中。

3.  最後，您可以安裝並配置外掛，如下所示：

    ```kotlin
    ```
    {src="snippets/custom-plugin/src/main/kotlin/com/example/Application.kt" include-lines="15-18"}

> 您可以在這裡找到完整範例：[CustomHeaderPlugin.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderPlugin.kt)。

### 檔案中的配置 {id="configuration-file"}

Ktor 允許您在[配置檔](server-create-and-configure.topic#engine-main)中指定外掛設定。讓我們看看如何為 `CustomHeaderPlugin` 實現這一點：

1.  首先，將一個包含外掛設定的新群組新增到 `application.conf` 或 `application.yaml` 檔案中：

    <tabs group="config">
    <tab title="application.conf" group-key="hocon">

    ```shell
    ```
    {src="snippets/custom-plugin/src/main/resources/application.conf" include-lines="10-15"}

    </tab>
    <tab title="application.yaml" group-key="yaml">

    ```yaml
    ```
    {src="snippets/custom-plugin/src/main/resources/application.yaml" include-lines="8-11"}

    </tab>
    </tabs>

    在我們的範例中，外掛設定儲存在 `http.custom_header` 群組中。

2.  要存取配置檔屬性，請將 `ApplicationConfig` 傳遞給配置類別的建構函式。`tryGetString` 函式返回指定的屬性值：

    ```kotlin
    ```
    {src="snippets/custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderPluginConfigurable.kt"
    include-lines="20-23"}

3.  最後，將 `http.custom_header` 值指定給 `createApplicationPlugin` 函式的 `configurationPath` 參數：

    ```kotlin
    ```
    {src="snippets/custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderPluginConfigurable.kt"
    include-lines="6-18"}

> 您可以在這裡找到完整範例：[CustomHeaderPluginConfigurable.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderPluginConfigurable.kt)。

## 存取應用程式設定 {id="app-settings"}

### 配置 {id="config"}

您可以使用 `applicationConfig` 屬性存取您的伺服器配置，該屬性返回 `ApplicationConfig` 實例。下面的範例展示了如何取得伺服器使用的主機和埠號：

```kotlin
val SimplePlugin = createApplicationPlugin(name = "SimplePlugin") {
   val host = applicationConfig?.host
   val port = applicationConfig?.port
   println("Listening on $host:$port")
}
```

### 環境 {id="environment"}

要存取應用程式的環境，請使用 `environment` 屬性。例如，此屬性允許您判斷[開發模式](server-development-mode.topic)是否啟用：

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

要儲存外掛的狀態，您可以從處理器 lambda 中捕獲任何值。請注意，建議使用並發資料結構和原子資料類型來使所有狀態值執行緒安全：

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

*   我可以使用自訂外掛與可暫停的資料庫一起使用嗎？

    是的。所有處理器都是暫停函式，因此您可以在外掛內部執行任何可暫停的資料庫操作。但不要忘記為特定呼叫釋放資源（例如，透過使用 [on(ResponseSent)](#other)）。

*   如何使用自訂外掛與阻塞式資料庫？

    由於 Ktor 使用協程（coroutines）和暫停函式，向阻塞式資料庫發出請求可能很危險，因為執行阻塞呼叫的協程可能會被阻塞，然後永遠暫停。為防止這種情況，您需要建立一個單獨的 [CoroutineContext](https://kotlinlang.org/docs/coroutine-context-and-dispatchers.html)：
    ```kotlin
    val databaseContext = newSingleThreadContext("DatabaseThread")
    ```
    然後，一旦您的上下文建立，將您資料庫的每個呼叫包裝到 `withContext` 呼叫中：
    ```kotlin
    onCall {
        withContext(databaseContext) {
            database.access(...) // some call to your database
        }
    }
    ```