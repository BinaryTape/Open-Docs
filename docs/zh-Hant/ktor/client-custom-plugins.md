[//]: # (title: 自訂客戶端外掛程式)

<show-structure for="chapter" depth="2"/>

<tldr>
<var name="example_name" value="client-custom-plugin"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<link-summary>
瞭解如何建立自己的自訂客戶端外掛程式。
</link-summary>

從 v2.2.0 開始，Ktor 提供了一套新的 API 用於建立自訂客戶端[外掛程式](client-plugins.md)。一般而言，此 API 無需理解 Ktor 的內部概念，例如 pipelines、phases 等。相反地，您可以使用一組處理器（例如 `onRequest`、`onResponse` 等）來存取[處理請求和回應](#call-handling)的不同階段。

## 建立並安裝您的第一個外掛程式 {id="first-plugin"}

在本節中，我們將示範如何建立並安裝您的第一個外掛程式，該外掛程式會為每個[請求](client-requests.md)新增一個自訂標頭：

1. 若要建立外掛程式，請呼叫 [createClientPlugin](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client.plugins.api/create-client-plugin.html) 函式並將外掛程式名稱作為引數傳遞：
   ```kotlin
   package com.example.plugins
   
   import io.ktor.client.plugins.api.*
   
   val CustomHeaderPlugin = createClientPlugin("CustomHeaderPlugin") {
       // Configure the plugin ...
   }
   ```
   
   此函式會回傳將用於安裝外掛程式的 `ClientPlugin` 實例。

2. 若要為每個請求附加自訂標頭，您可以使用 `onRequest` 處理器，它提供了對請求參數的存取權：
   [object Promise]

3. 若要[安裝外掛程式](client-plugins.md#install)，請將建立的 `ClientPlugin` 實例傳遞給客戶端設定區塊中的 `install` 函式：
   ```kotlin
   import com.example.plugins.*
   
   val client = HttpClient(CIO) {
       install(CustomHeaderPlugin)
   }
   ```
   
   
您可以在此處找到完整範例：[CustomHeader.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeader.kt)。 在以下章節中，我們將探討如何提供外掛程式設定以及處理請求和回應。

## 提供外掛程式設定 {id="plugin-configuration"}

[上一節](#first-plugin)示範了如何建立一個外掛程式，該外掛程式會為每個回應附加一個預定義的自訂標頭。讓我們讓這個外掛程式更有用，並提供一個設定，用於傳遞任何自訂標頭名稱和值：

1. 首先，您需要定義一個設定類別：

   [object Promise]

2. 若要在外掛程式中使用此設定，請將設定類別引用傳遞給 `createApplicationPlugin`：

   [object Promise]

   由於外掛程式設定欄位是可變的，建議將它們儲存在局部變數中。

3. 最後，您可以按如下方式安裝和設定外掛程式：

   [object Promise]

> 您可以在此處找到完整範例：[CustomHeaderConfigurable.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/CustomHeaderConfigurable.kt)。

## 處理請求和回應 {id="call-handling"}

自訂外掛程式提供對處理請求和回應不同階段的存取權限，使用一組專用處理器，例如：
- `onRequest` 和 `onResponse` 分別允許您處理請求和回應。
- `transformRequestBody` 和 `transformResponseBody` 可用於對請求和回應主體執行必要的轉換。

還有 `on(...)` 處理器，它允許您呼叫特定鉤子，這可能對於處理呼叫的其他階段很有用。
下表列出了所有處理器依其執行順序：

<tabs>
<tab title="基本鉤子">

<table>
<tr>
<td>
處理器
</td>
<td>
描述
</td>
</tr>

<snippet id="onRequest">
<tr>
<td>
<code>onRequest</code>
</td>
<td>
<p>
此處理器會針對每個 HTTP <Links href="/ktor/client-requests" summary="瞭解如何發出請求並指定各種請求參數：請求 URL、HTTP 方法、標頭以及請求主體。">請求</Links>執行，並允許您修改它。
</p>
<p>
<emphasis>
範例：未定義
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
允許您轉換<a href="#body">請求主體</a>。
在此處理器中，您需要將主體序列化為 
<a href="https://api.ktor.io/ktor-http/io.ktor.http.content/-outgoing-content/index.html">OutgoingContent</a> 
（例如，<code>TextContent</code>、<code>ByteArrayContent</code> 或 <code>FormDataContent</code>），
如果您的轉換不適用，則回傳 <code>null</code>。
</p>
<p>
<emphasis>
範例：未定義
</emphasis>
</p>
</td>
</tr>
</snippet>
<snippet id="onResponse">
<tr>
<td>
<code>onResponse</code>
</td>
<td>
<p>
此處理器會針對每個傳入的 HTTP <Links href="/ktor/client-requests" summary="瞭解如何發出請求並指定各種請求參數：請求 URL、HTTP 方法、標頭以及請求主體。">回應</Links>執行，並允許您以各種方式檢查它：記錄回應、儲存 Cookie 等。
</p>
<p>
<emphasis>
範例：未定義、未定義
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
允許您轉換<a href="#body">回應主體</a>。
此處理器會針對每個 <code>HttpResponse.body</code> 呼叫調用。
您需要將主體反序列化為 <code>requestedType</code> 的實例，
如果您的轉換不適用，則回傳 <code>null</code>。
</p>
<p>
<emphasis>
範例：未定義
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
允許您清理此外掛程式分配的資源。
當客戶端[關閉](#close-client)時，會呼叫此處理器。
</td>
</tr>
</snippet>

</table>

</tab>
<tab title="所有鉤子">

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
<code>SetupRequest</code> 鉤子在請求處理中首先執行。
</td>
</tr>

<snippet id="onRequest">
<tr>
<td>
<code>onRequest</code>
</td>
<td>
<p>
此處理器會針對每個 HTTP <Links href="/ktor/client-requests" summary="瞭解如何發出請求並指定各種請求參數：請求 URL、HTTP 方法、標頭以及請求主體。">請求</Links>執行，並允許您修改它。
</p>
<p>
<emphasis>
範例：未定義
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
允許您轉換<a href="#body">請求主體</a>。
在此處理器中，您需要將主體序列化為 
<a href="https://api.ktor.io/ktor-http/io.ktor.http.content/-outgoing-content/index.html">OutgoingContent</a> 
（例如，<code>TextContent</code>、<code>ByteArrayContent</code> 或 <code>FormDataContent</code>），
如果您的轉換不適用，則回傳 <code>null</code>。
</p>
<p>
<emphasis>
範例：未定義
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
<code>Send</code> 鉤子提供了檢查回應並在需要時啟動額外請求的能力。 
這對於處理重定向、重試請求、身份驗證等可能很有用。
</p>
<p>
<emphasis>
範例：未定義
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
<code>SendingRequest</code> 鉤子會為每個請求執行，
即使它不是由使用者啟動的。
例如，如果請求導致重定向，<code>onRequest</code> 處理器只會針對原始請求執行，
而 <code>on(SendingRequest)</code> 會同時針對原始請求和重定向請求執行。
同樣，如果您使用 <code>on(Send)</code> 來啟動額外請求，
處理器將按以下順序排列：
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
範例：未定義、未定義
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
此處理器會針對每個傳入的 HTTP <Links href="/ktor/client-requests" summary="瞭解如何發出請求並指定各種請求參數：請求 URL、HTTP 方法、標頭以及請求主體。">回應</Links>執行，並允許您以各種方式檢查它：記錄回應、儲存 Cookie 等。
</p>
<p>
<emphasis>
範例：未定義、未定義
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
允許您轉換<a href="#body">回應主體</a>。
此處理器會針對每個 <code>HttpResponse.body</code> 呼叫調用。
您需要將主體反序列化為 <code>requestedType</code> 的實例，
如果您的轉換不適用，則回傳 <code>null</code>。
</p>
<p>
<emphasis>
範例：未定義
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
允許您清理此外掛程式分配的資源。
當客戶端[關閉](#close-client)時，會呼叫此處理器。
</td>
</tr>
</snippet>

</table>

</tab>
</tabs>

### 共享呼叫狀態 {id="call-state"}

自訂外掛程式允許您共享任何與呼叫相關的值，以便您可以在處理此呼叫的任何處理器內部存取此值。此值以具有唯一鍵的屬性形式儲存在 `call.attributes` 集合中。下面的範例示範了如何使用屬性來計算發送請求和接收回應之間的時間：

[object Promise]

您可以在此處找到完整範例：[ResponseTime.kt](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/src/main/kotlin/com/example/plugins/ResponseTime.kt)。

## 存取客戶端設定 {id="client-config"}

您可以使用 `client` 屬性存取客戶端設定，該屬性會回傳 [HttpClient](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) 實例。下面的範例展示了如何取得客戶端使用的[代理地址](client-proxy.md)：

```kotlin
import io.ktor.client.plugins.api.*

val SimplePlugin = createClientPlugin("SimplePlugin") {
    val proxyAddress = client.engineConfig.proxy?.address()
    println("Proxy address: $proxyAddress")
}
```

## 範例 {id="examples"}

下面的程式碼範例展示了自訂外掛程式的幾個範例。
您可以在此處找到結果專案：[client-custom-plugin](https://github.com/ktorio/ktor-documentation/blob/%ktor_version%/codeSnippets/snippets/client-custom-plugin/)。

### 自訂標頭 {id="example-custom-header"}

示範如何建立一個外掛程式，該外掛程式會為每個請求新增自訂標頭：

[object Promise]

### 記錄標頭 {id="example-log-headers"}

示範如何建立一個外掛程式，該外掛程式會記錄請求和回應標頭：

[object Promise]

### 回應時間 {id="example-response-time"}

示範如何建立一個外掛程式，該外掛程式會測量發送請求和接收回應之間的時間：

[object Promise]

### 資料轉換 {id="data-transformation"}

示範如何使用 `transformRequestBody` 和 `transformResponseBody` 鉤子來轉換請求和回應主體：

<tabs>
<tab title="DataTransformation.kt">

[object Promise]

</tab>
<tab title="Application.kt">

[object Promise]

</tab>
<tab title="User.kt">

[object Promise]

</tab>
</tabs>

您可以在此處找到完整範例：[client-custom-plugin-data-transformation](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-custom-plugin-data-transformation)。

### 身份驗證 {id="authentication"}

一個 Ktor 範例專案，示範如何使用 `on(Send)` 鉤子在從伺服器收到未經授權回應時，將承載權杖新增到 `Authorization` 標頭中：

<tabs>
<tab title="Auth.kt">

[object Promise]

</tab>
<tab title="Application.kt">

[object Promise]

</tab>
</tabs>

您可以在此處找到完整範例：[client-custom-plugin-auth](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-custom-plugin-auth)。