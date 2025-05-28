[//]: # (title: 請求驗證)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="RequestValidation"/>
<var name="package_name" value="io.ktor.server.plugins.requestvalidation"/>
<var name="artifact_name" value="ktor-server-request-validation"/>

<tldr>
<p>
<b>所需依賴項</b>：<code>io.ktor:ktor-server-request-validation</code>
</p>
<var name="example_name" value="request-validation"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>
RequestValidation 提供驗證傳入請求主體的能力。
</link-summary>

[RequestValidation](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-request-validation/io.ktor.server.plugins.requestvalidation/-request-validation.html) 插件提供驗證傳入請求主體的能力。如果安裝了帶有[序列化器](server-serialization.md#configure_serializer)的 `ContentNegotiation` 插件，您可以驗證原始請求主體或指定的請求物件屬性。如果請求主體驗證失敗，該插件會拋出 `RequestValidationException`，可以使用 [StatusPages](server-status-pages.md) 插件進行處理。

## 添加依賴項 {id="add_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## 安裝 RequestValidation {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>
<include from="lib.topic" element-id="install_plugin_route"/>

## 配置 RequestValidation {id="configure"}

配置 `RequestValidation` 包含三個主要步驟：

1. [接收主體內容](#receive-body)。
2. [配置驗證函數](#validation-function)。
3. [處理驗證例外](#validation-exception)。

### 1. 接收主體 {id="receive-body"}

如果您使用類型參數呼叫 **[receive](server-requests.md#body_contents)** 函數，`RequestValidation` 插件會驗證請求主體。例如，下面的程式碼片段展示了如何將主體接收為 `String` 值：

```kotlin
```
{src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="52-56,65"}

### 2. 配置驗證函數 {id="validation-function"}

要驗證請求主體，請使用 `validate` 函數。
此函數會返回一個 `ValidationResult` 物件，代表成功或不成功的驗證結果。
如果結果不成功，將會拋出 **[RequestValidationException](#validation-exception)**。

`validate` 函數有兩個重載，允許您以兩種方式驗證請求主體：

- 第一個 `validate` 重載允許您將請求主體作為指定類型的物件進行存取。
   以下範例展示了如何驗證代表 `String` 值的請求主體：
   ```kotlin
   ```
   {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="20-25,43"}

   如果您已安裝並配置了帶有特定[序列化器](server-serialization.md#configure_serializer)的 `ContentNegotiation` 插件，則可以驗證物件屬性。請從 [](#example-object) 了解更多資訊。

- 第二個 `validate` 重載接受 `ValidatorBuilder`，允許您提供自訂驗證規則。
   您可以從 [](#example-byte-array) 了解更多資訊。

### 3. 處理驗證例外 {id="validation-exception"}

如果請求驗證失敗，`RequestValidation` 會拋出 `RequestValidationException`。
此例外允許您存取請求主體，並獲取此請求所有驗證失敗的原因。

您可以使用 [StatusPages](server-status-pages.md) 插件處理 `RequestValidationException`，如下所示：

```kotlin
```
{src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="44-48"}

您可以在這裡找到完整範例：[request-validation](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/request-validation)。

## 範例：驗證物件屬性 {id="example-object"}

在此範例中，我們將探討如何使用 `RequestValidation` 插件驗證物件屬性。
假設伺服器收到一個帶有以下 JSON 資料的 `POST` 請求：

```HTTP
```
{src="snippets/request-validation/post.http" include-lines="7-14"}

要添加 `id` 屬性的驗證，請按照以下步驟操作：

1. 創建描述上述 JSON 物件的 `Customer` 資料類別：
   ```kotlin
   ```
   {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="14-15"}

2. 安裝帶有 [JSON 序列化器](server-serialization.md#register_json) 的 `ContentNegotiation` 插件：
   ```kotlin
   ```
   {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="49-51"}

3. 在伺服器端接收 `Customer` 物件，如下所示：
   ```kotlin
   ```
   {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="57-60"}
4. 在 `RequestValidation` 插件配置中，添加 `id` 屬性的驗證，以確保其落在指定範圍內：
   ```kotlin
   ```
   {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="20,26-30,43"}
   
   在此情況下，如果 `id` 值小於或等於 `0`，`RequestValidation` 將會拋出 **[RequestValidationException](#validation-exception)**。

## 範例：驗證位元組陣列 {id="example-byte-array"}

在此範例中，我們將探討如何驗證作為位元組陣列接收的請求主體。
假設伺服器收到一個帶有以下文字資料的 `POST` 請求：

```HTTP
```
{src="snippets/request-validation/post.http" include-lines="17-20"}

要將資料接收為位元組陣列並驗證它，請執行以下步驟：

1. 在伺服器端接收資料，如下所示：
   ```kotlin
   ```
   {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="61-64"}
2. 為了驗證接收到的資料，我們將使用第二個 `validate` [函數重載](#validation-function)，它接受 `ValidatorBuilder` 並允許您提供自訂驗證規則：
   ```kotlin
   ```
   {src="snippets/request-validation/src/main/kotlin/com/example/Application.kt" include-lines="20,31-43"}