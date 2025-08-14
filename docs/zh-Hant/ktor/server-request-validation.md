[//]: # (title: 請求驗證)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="RequestValidation"/>
<var name="package_name" value="io.ktor.server.plugins.requestvalidation"/>
<var name="artifact_name" value="ktor-server-request-validation"/>

<tldr>
<p>
<b>必需的依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="request-validation"/>

    <p>
        <b>程式碼範例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">原生伺服器</Links>支援</b>: ✅
    </p>
    
</tldr>

<link-summary>
%plugin_name% 提供驗證傳入請求主體的能力。
</link-summary>

「%plugin_name%」外掛程式 (https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-request-validation/io.ktor.server.plugins.requestvalidation/-request-validation.html) 提供驗證傳入請求主體的能力。如果安裝了帶有[序列化器](server-serialization.md#configure_serializer)的 `ContentNegotiation` 外掛程式，您可以驗證原始請求主體或指定的請求物件屬性。如果請求主體驗證失敗，外掛程式會拋出 `RequestValidationException`，可以使用 [StatusPages](server-status-pages.md) 外掛程式進行處理。

## 新增依賴項 {id="add_dependencies"}

    <p>
        若要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> artifact：
    </p>
    

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
    

## 安裝 %plugin_name% {id="install_plugin"}

    <p>
        若要將 <code>%plugin_name%</code> 外掛程式<a href="#install">安裝</a>到應用程式，
        請將其傳遞給指定<Links href="/ktor/server-modules" summary="Modules allow you to structure your application by grouping routes.">模組</Links>中的 <code>install</code> 函數。
        以下程式碼片段展示了如何安裝 <code>%plugin_name%</code> ...
    </p>
    <list>
        <li>
            ... 在 <code>embeddedServer</code> 函數呼叫內部。
        </li>
        <li>
            ... 在明確定義的 <code>module</code> 內部，它是一個 <code>Application</code> 類別的擴展函數。
        </li>
    </list>
    <tabs>
        <tab title="embeddedServer">
            [object Promise]
        </tab>
        <tab title="module">
            [object Promise]
        </tab>
    </tabs>
    

    <p>
        <code>%plugin_name%</code> 外掛程式也可以<a href="#install-route">安裝到特定路由</a>。
        如果您需要針對不同的應用程式資源使用不同的 <code>%plugin_name%</code> 配置，這會很有用。
    </p>
    

## 配置 %plugin_name% {id="configure"}

配置 `%plugin_name%` 涉及三個主要步驟：

1. [接收主體內容](#receive-body)。
2. [配置驗證函數](#validation-function)。
3. [處理驗證異常](#validation-exception)。

### 1. 接收主體 {id="receive-body"}

如果您使用帶有型別參數的 **[receive](server-requests.md#body_contents)** 函數，`%plugin_name%` 外掛程式會驗證請求主體。例如，以下程式碼片段展示了如何將主體作為 `String` 值接收：

[object Promise]

### 2. 配置驗證函數 {id="validation-function"}

若要驗證請求主體，請使用 `validate` 函數。
此函數返回一個 `ValidationResult` 物件，表示成功或不成功的驗證結果。
對於不成功的結果，將拋出 **[RequestValidationException](#validation-exception)**。

`validate` 函數有兩個重載，允許您以兩種方式驗證請求主體：

- 第一個 `validate` 重載允許您以指定型別的物件形式訪問請求主體。
   以下範例展示了如何驗證表示 `String` 值的請求主體：
   [object Promise]

   如果您已安裝配置了特定[序列化器](server-serialization.md#configure_serializer)的 `ContentNegotiation` 外掛程式，您可以驗證物件屬性。從[](#example-object)了解更多。

- 第二個 `validate` 重載接受 `ValidatorBuilder` 並允許您提供自訂驗證規則。
   您可以從[](#example-byte-array)了解更多。

### 3. 處理驗證異常 {id="validation-exception"}

如果請求驗證失敗，`%plugin_name%` 會拋出 `RequestValidationException`。
此異常允許您訪問請求主體並獲取此請求所有驗證失敗的原因。

您可以如下使用 [StatusPages](server-status-pages.md) 外掛程式處理 `RequestValidationException`：

[object Promise]

您可以在此處找到完整範例：[request-validation](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/request-validation)。

## 範例：驗證物件屬性 {id="example-object"}

在此範例中，我們將探討如何使用 `%plugin_name%` 外掛程式驗證物件屬性。
假設伺服器收到一個帶有以下 JSON 資料的 `POST` 請求：

[object Promise]

若要新增 `id` 屬性的驗證，請按照以下步驟操作：

1. 建立描述上述 JSON 物件的 `Customer` 資料類別：
   [object Promise]

2. 安裝帶有 [JSON 序列化器](server-serialization.md#register_json)的 `ContentNegotiation` 外掛程式：
   [object Promise]

3. 在伺服器端接收 `Customer` 物件如下：
   [object Promise]
4. 在 `%plugin_name%` 外掛程式配置中，新增 `id` 屬性的驗證，以確保它落在指定範圍內：
   [object Promise]
   
   在這種情況下，如果 `id` 值小於或等於 `0`，`%plugin_name%` 將拋出 **[RequestValidationException](#validation-exception)**。

## 範例：驗證位元組陣列 {id="example-byte-array"}

在此範例中，我們將探討如何驗證作為位元組陣列接收的請求主體。
假設伺服器收到一個帶有以下文字資料的 `POST` 請求：

[object Promise]

若要將資料作為位元組陣列接收並驗證它，請執行以下步驟：

1. 在伺服器端接收資料如下：
   [object Promise]
2. 若要驗證接收到的資料，我們將使用第二個 `validate` [函數重載](#validation-function)，它接受 `ValidatorBuilder` 並允許您提供自訂驗證規則：
   [object Promise]