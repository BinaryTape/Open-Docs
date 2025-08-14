[//]: # (title: 在 Ktor Client 中進行測試)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-client-mock"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-testing-mock"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    
</tldr>

<web-summary>
Ktor 提供一個 MockEngine，它能模擬 HTTP 呼叫而無需連接到端點。
</web-summary>

<link-summary>
學習如何使用 MockEngine 透過模擬 HTTP 呼叫來測試你的客戶端。
</link-summary>

Ktor 提供一個 [MockEngine](https://api.ktor.io/ktor-client/ktor-client-mock/io.ktor.client.engine.mock/-mock-engine/index.html)，它能模擬 HTTP 呼叫而無需連接到端點。

## 新增依賴項 {id="add_dependencies"}
在使用 `MockEngine` 之前，你需要將 `%artifact_name%` artifact 包含在建置腳本中。

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

## 用法 {id="usage"}

### 共享客戶端配置 {id="share-config"}

讓我們看看如何使用 `MockEngine` 來測試客戶端。假設客戶端有以下配置：
* 使用 `CIO` [引擎](client-engines.md) 來發出請求。
* 安裝了 [Json](client-serialization.md) 插件以反序列化傳入的 JSON 資料。

為了測試這個客戶端，其配置需要與使用 `MockEngine` 的測試客戶端共享。要共享配置，你可以建立一個客戶端包裝類，它接受一個引擎作為建構函數參數並包含客戶端配置。

[object Promise]

然後，你可以如下使用 `ApiClient` 來建立一個帶有 `CIO` 引擎的 HTTP 客戶端並發出請求。

[object Promise]

### 測試客戶端 {id="test-client"}

要測試客戶端，你需要建立一個 `MockEngine` 實例，該實例帶有一個處理器，可以檢查請求參數並以所需的內容（在我們的例子中是一個 JSON 物件）響應。

[object Promise]

然後，你可以將建立的 `MockEngine` 傳遞給 `ApiClient` 進行初始化，並進行必要的斷言。

[object Promise]

你可以在這裡找到完整範例： [client-testing-mock](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-testing-mock)。