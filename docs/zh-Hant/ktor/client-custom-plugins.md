[//]: # (title: 自訂用戶端外掛)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="client-custom-plugin"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
了解如何建立您自己的自訂用戶端外掛。
</link-summary>

從 v2.2.0 版本開始，Ktor 提供了一個新的 API，用於建立自訂用戶端 [外掛](client-plugins.md)。一般來說，這個 API 不要求理解 Ktor 的內部概念，例如管線 (pipelines)、階段 (phases) 等。
相反地，您可以使用一組處理器 (handler)，例如 `onRequest`、`onResponse` 等，來存取 [處理請求和回應](#call-handling) 的不同階段。

## 建立並安裝您的第一個外掛 {id="first-plugin"}

在本節中，我們將示範如何建立並安裝您的第一個外掛，該外掛會為每個 [請求](client-requests.md) 新增一個自訂標頭：

1. 若要建立外掛，請呼叫 [createClientPlugin](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.api/create-client-plugin.html) 函式，並傳遞外掛名稱作為引數：
   ```kotlin
   package com.example.plugins
   
   import io.ktor.client.plugins.api.*
   
   val CustomHeaderPlugin = createClientPlugin("CustomHeaderPlugin") {
       // Configure the plugin ...
   }
   ```
   
   此函式會回傳 `ClientPlugin` 實例 (instance)，該實例將用於安裝此外掛。

2. 若要為每個請求附加自訂標頭，您可以使用 `onRequest` 處理器 (handler)，它提供了對請求參數的存取權限：
   ```kotlin
   ```
   {src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeader.kt"}

3. 若要 [安裝此外掛](client-plugins.md#install)，請將建立的 `ClientPlugin` 實例傳遞給用戶端設定區塊內的 `install` 函式：
   ```kotlin
   import com.example.plugins.*
   
   val client = HttpClient(CIO) {
       install(CustomHeaderPlugin)
   }
   ```
   
   
您可以在此找到完整的範例：[CustomHeader.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeader.kt)。
在接下來的章節中，我們將探討如何提供外掛設定以及處理請求和回應。

## 提供外掛設定 {id="plugin-configuration"}

[上一節](#first-plugin) 示範了如何建立一個外掛，該外掛會為每個回應附加一個預定義的自訂標頭。讓我們使此外掛更實用，並提供一個設定，用於傳遞任何自訂標頭名稱和值：

1. 首先，您需要定義一個設定類別：

   ```kotlin
   ```
   {src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderConfigurable.kt" include-lines="14-17"}

2. 若要在外掛中使用此設定，請將設定類別參考傳遞給 `createApplicationPlugin`：

   ```kotlin
   ```
   {src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderConfigurable.kt" include-lines="3-12"}

   由於外掛設定欄位是可變的 (mutable)，建議將它們儲存到區域變數中。

3. 最後，您可以如下安裝並設定此外掛：

   ```kotlin
   ```
   {src="snippets/client-custom-plugin/src/main/kotlin/com/example/Application.kt" include-lines="11-15,18"}

> 您可以在此找到完整的範例：[CustomHeaderConfigurable.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderConfigurable.kt)。

## 處理請求和回應 {id="call-handling"}

自訂外掛提供了一組專用的處理器 (handler)，讓您能夠存取處理請求和回應的不同階段，例如：
- `onRequest` 和 `onResponse` 分別允許您處理請求和回應。
- `transformRequestBody` 和 `transformResponseBody` 可用於對請求和回應主體 (body) 應用必要的轉換。

還有 `on(...)` 處理器 (handler)，它允許您呼叫特定的掛鉤 (hook)，這些掛鉤可能對於處理呼叫 (call) 的其他階段很有用。
下表列出了所有處理器 (handler) 及其執行順序：

<tabs>
<tab title="基本掛鉤">

<table>
<tr>
<td>
處理器
</td>
<td>
描述
</td>
</tr>

<include from="client-custom-plugins.md" element-id="onRequest"/>
<include from="client-custom-plugins.md" element-id="transformRequestBody"/>
<include from="client-custom-plugins.md" element-id="onResponse"/>
<include from="client-custom-plugins.md" element-id="transformResponseBody"/>
<include from="client-custom-plugins.md" element-id="onClose"/>

</table>

</tab>
<tab title="所有掛鉤">

<table>
<tr>
<td>
處理器
</td>
<td>
描述
</td>
</tr>

<tr>
<td>
<code>on(SetupRequest)</code>
</td>
<td>
<code>SetupRequest</code> 掛鉤在請求處理中首先執行。
</td>
</tr>

<snippet id="onRequest">
<tr>
<td>
<code>onRequest</code>
</td>
<td>
<p>
此處理器 (handler) 會針對每個 HTTP <a href="client-requests.md">請求</a> 執行，並允許您修改它。
</p>
<p>
<emphasis>
範例：<a anchor="example-custom-header"/>
</emphasis>
</p>
</td>
</tr>
</snippet>

<snippet id="transformRequestBody">
<tr>
<td>
<code>transformRequestBody</code>
</td>
<td>
<p>
允許您轉換 <a href="client-requests.md" anchor="body">請求主體 (body)</a>。
在此處理器中，您需要將主體序列化為
<a href="https://api.ktor.io/ktor-http/io.ktor.http.content/-outgoing-content/index.html">OutgoingContent</a>
(例如，<code>TextContent</code>、<code>ByteArrayContent</code> 或 <code>FormDataContent</code>)，
如果您的轉換不適用，則回傳 <code>null</code>。
</p>
<p>
<emphasis>
範例：<a anchor="data-transformation"/>
</emphasis>
</p>
</td>
</tr>
</snippet>

<tr>
<td>
<code>on(Send)</code>
</td>
<td>
<p>
<code>Send</code> 掛鉤提供了檢查回應並在需要時啟動額外請求的能力。
這對於處理重新導向 (redirect)、重試請求、身份驗證 (authentication) 等可能很有用。
</p>
<p>
<emphasis>
範例：<a anchor="authentication"/>
</emphasis>
</p>
</td>
</tr>

<tr>
<td>
<code>on(SendingRequest)</code>
</td>
<td>
<p>
<code>SendingRequest</code> 掛鉤會針對每個請求執行，
即使它不是由使用者發起的。
例如，如果一個請求導致重新導向 (redirect)，<code>onRequest</code> 處理器 (handler) 只會針對原始請求執行，
而 <code>on(SendingRequest)</code> 會針對原始和重新導向的請求都執行。
同樣地，如果您使用 <code>on(Send)</code> 來啟動額外請求，
處理器 (handler) 的順序將如下：
</p>

```Console
--> onRequest
--> on(Send)
--> on(SendingRequest)
<-- onResponse
--> on(SendingRequest)
<-- onResponse
```

<p>
<emphasis>
範例：<a anchor="example-log-headers"/>、<a anchor="example-response-time"/>
</emphasis>
</p>
</td>
</tr>

<snippet id="onResponse">
<tr>
<td>
<code>onResponse</code>
</td>
<td>
<p>
此處理器 (handler) 會針對每個傳入的 HTTP <a href="client-requests.md">回應</a> 執行，並允許您
以多種方式檢查它：記錄回應、儲存 Cookie 等。
</p>
<p>
<emphasis>
範例：<a anchor="example-log-headers"/>、<a anchor="example-response-time"/>
</emphasis>
</p>
</td>
</tr>
</snippet>

<snippet id="transformResponseBody">
<tr>
<td>
<code>transformResponseBody</code>
</td>
<td>
<p>
允許您轉換 <a href="client-responses.md" anchor="body">回應主體 (body)</a>。
此處理器 (handler) 會針對每個 <code>HttpResponse.body</code> 呼叫 (call) 執行。
您需要將主體反序列化為 <code>requestedType</code> 的實例 (instance)，
如果您的轉換不適用，則回傳 <code>null</code>。
</p>
<p>
<emphasis>
範例：<a anchor="data-transformation"/>
</emphasis>
</p>
</td>
</tr>
</snippet>

<snippet id="onClose">
<tr>
<td>
<code>onClose</code>
</td>
<td>
允許您清理此外掛所分配的資源。
當用戶端被 <a href="client-create-and-configure.md" anchor="close-client">關閉</a> 時，會呼叫此處理器 (handler)。
</td>
</tr>
</snippet>

</table>

</tab>
</tabs>

### 共用呼叫狀態 {id="call-state"}

自訂外掛允許您共用與呼叫 (call) 相關的任何值，以便您可以在處理此呼叫的任何處理器 (handler) 內部存取此值。
此值以具有唯一鍵的屬性 (attribute) 形式儲存在 `call.attributes` 集合中。
以下範例示範如何使用屬性來計算發送請求和接收回應之間的時間：

```kotlin
```
{src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/ResponseTime.kt" include-lines="3-18"}

您可以在此找到完整的範例：[ResponseTime.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/ResponseTime.kt)。

## 存取用戶端設定 {id="client-config"}

您可以使用 `client` 屬性 (property) 存取您的用戶端設定，該屬性會回傳 [HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) 實例 (instance)。
以下範例示範如何取得用戶端使用的 [代理位址 (proxy address)](client-proxy.md)：

```kotlin
import io.ktor.client.plugins.api.*

val SimplePlugin = createClientPlugin("SimplePlugin") {
    val proxyAddress = client.engineConfig.proxy?.address()
    println("Proxy address: $proxyAddress")
}
```

## 範例 {id="examples"}

以下程式碼範例示範了幾個自訂外掛的範例。
您可以在此找到結果專案：[client-custom-plugin](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/)。

### 自訂標頭 {id="example-custom-header"}

示範如何建立一個外掛，該外掛會為每個請求新增一個自訂標頭：

```kotlin
```
{src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderConfigurable.kt"}

### 記錄標頭 {id="example-log-headers"}

示範如何建立一個外掛，該外掛會記錄請求和回應標頭：

```kotlin
```
{src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/LoggingHeaders.kt"}

### 回應時間 {id="example-response-time"}

示範如何建立一個外掛，該外掛會測量發送請求和接收回應之間的時間：

```kotlin
```
{src="snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/ResponseTime.kt"}

### 資料轉換 {id="data-transformation"}

示範如何使用 `transformRequestBody` 和 `transformResponseBody` 掛鉤 (hook) 轉換請求和回應主體 (body)：

<tabs>
<tab title="DataTransformation.kt">

```kotlin
```
{src="snippets/client-custom-plugin-data-transformation/src/main/kotlin/com/example/plugins/DataTransformation.kt"}

</tab>
<tab title="Application.kt">

```kotlin
```
{src="snippets/client-custom-plugin-data-transformation/src/main/kotlin/com/example/Application.kt"}

</tab>
<tab title="User.kt">

```kotlin
```
{src="snippets/client-custom-plugin-data-transformation/src/main/kotlin/com/example/model/User.kt"}

</tab>
</tabs>

您可以在此找到完整的範例：[client-custom-plugin-data-transformation](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-custom-plugin-data-transformation)。

### 身份驗證 {id="authentication"}

一個 Ktor 範例專案，示範如何使用 `on(Send)` 掛鉤 (hook)，在從伺服器收到未經授權的回應時，將持有者權杖 (bearer token) 新增到 `Authorization` 標頭中：

<tabs>
<tab title="Auth.kt">

```kotlin
```
{src="snippets/client-custom-plugin-auth/src/main/kotlin/com/example/plugins/Auth.kt"}

</tab>
<tab title="Application.kt">

```kotlin
```
{src="snippets/client-custom-plugin-auth/src/main/kotlin/com/example/Application.kt"}

</tab>
</tabs>

您可以在此找到完整的範例：[client-custom-plugin-auth](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-custom-plugin-auth)。