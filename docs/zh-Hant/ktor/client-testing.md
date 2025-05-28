[//]: # (title: 在 Ktor Client 中進行測試)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-client-mock"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-testing-mock"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<web-summary>
Ktor 提供了 MockEngine，它能模擬 HTTP 呼叫，而無需連接到實際端點。
</web-summary>

<link-summary>
了解如何使用 MockEngine 透過模擬 HTTP 呼叫來測試您的客戶端。
</link-summary>

Ktor 提供了 [MockEngine](https://api.ktor.io/ktor-client/ktor-client-mock/io.ktor.client.engine.mock/-mock-engine/index.html)，它能模擬 HTTP 呼叫，而無需連接到實際端點。

## 新增依賴項 {id="add_dependencies"}
在使用 `MockEngine` 之前，您需要在建置腳本中包含 `%artifact_name%` artifact。

<include from="lib.topic" element-id="add_ktor_artifact_testing"/>

## 使用方式 {id="usage"}

### 共用客戶端配置 {id="share-config"}

讓我們看看如何使用 `MockEngine` 來測試客戶端。假設客戶端具有以下配置：
* 使用 `CIO` [引擎](client-engines.md) 來發出請求。
* 安裝了 [Json](client-serialization.md) 插件以反序列化傳入的 JSON 資料。

為了測試此客戶端，其配置需要與使用 `MockEngine` 的測試客戶端共用。要共用配置，您可以建立一個客戶端包裝類別，該類別將引擎作為建構函數參數，並包含客戶端配置。

```kotlin
```
{src="snippets/client-testing-mock/src/main/kotlin/com/example/Application.kt" include-lines="13-15,24-32"}

然後，您可以如下使用 `ApiClient` 來建立一個帶有 `CIO` 引擎的 HTTP 客戶端並發出請求。

```kotlin
```
{src="snippets/client-testing-mock/src/main/kotlin/com/example/Application.kt" include-lines="16-22"}

### 測試客戶端 {id="test-client"}

要測試客戶端，您需要建立一個 `MockEngine` 實例，該實例帶有一個處理器，可以檢查請求參數並響應所需的內容（在本例中為 JSON 物件）。

```kotlin
```
{src="snippets/client-testing-mock/src/test/kotlin/ApplicationTest.kt" include-lines="14-20"}

然後，您可以將建立的 `MockEngine` 傳遞給 `ApiClient` 進行初始化，並進行所需的斷言。

```kotlin
```
{src="snippets/client-testing-mock/src/test/kotlin/ApplicationTest.kt" include-lines="10-26"}

您可以在這裡找到完整的範例：[client-testing-mock](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-testing-mock)。