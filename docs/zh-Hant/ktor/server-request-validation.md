[//]: # (title: 請求驗證)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="RequestValidation"/>
<var name="package_name" value="io.ktor.server.plugins.requestvalidation"/>
<var name="artifact_name" value="ktor-server-request-validation"/>

<tldr>
<p>
<b>所需依賴項</b>：<code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="request-validation"/>
<p>
    <b>程式碼範例</b>：
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native，讓您無需額外的執行時或虛擬機器即可運行伺服器。">原生伺服器</Links>支援</b>：✅
</p>
</tldr>

<link-summary>
%plugin_name% 提供了驗證傳入請求主體的能力。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server-request-validation/io.ktor.server.plugins.requestvalidation/-request-validation.html) 外掛程式提供了驗證傳入請求主體的能力。如果安裝了包含[序列化器](server-serialization.md#configure_serializer)的 `ContentNegotiation` 外掛程式，您可以驗證原始請求主體或指定的請求物件屬性。如果請求主體驗證失敗，此外掛程式將引發 `RequestValidationException` 請求驗證例外，該例外可使用 [StatusPages](server-status-pages.md) 狀態頁面外掛程式處理。

## 新增依賴項 {id="add_dependencies"}

<p>
    若要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> 構件：
</p>
<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## 安裝 %plugin_name% {id="install_plugin"}

<p>
    若要將 <code>%plugin_name%</code> 外掛程式<a href="#install">安裝</a>至應用程式，
    請將其傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您透過分組路由來組織應用程式。">模組</Links>中的 <code>install</code> 函數。
    以下程式碼片段顯示如何安裝 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函數呼叫內部。
    </li>
    <li>
        ... 在明確定義的 <code>module</code> 內部，它是 <code>Application</code> 類別的擴充函數。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10;                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10;            }"/>
    </TabItem>
</Tabs>
<p>
    <code>%plugin_name%</code> 外掛程式也可以<a href="#install-route">安裝到特定的路由</a>。
    如果您需要針對不同的應用程式資源使用不同的 <code>%plugin_name%</code> 配置，這將會很有用。
</p>

## 配置 %plugin_name% {id="configure"}

配置 `%plugin_name%` 涉及三個主要步驟：

1. [接收主體內容](#receive-body)。
2. [配置驗證函數](#validation-function)。
3. [處理驗證例外](#validation-exception)。

### 1. 接收主體 {id="receive-body"}

如果您呼叫帶有型別參數的 **[receive](server-requests.md#body_contents)** 函數，`%plugin_name%` 外掛程式將驗證請求的主體。例如，下面的程式碼片段顯示如何將主體接收為 `String` 值：

```kotlin
routing {
    post("/text") {
        val body = call.receive<String>()
        call.respond(body)
    }
}
```

### 2. 配置驗證函數 {id="validation-function"}

若要驗證請求主體，請使用 `validate` 函數。
此函數回傳一個 `ValidationResult` 物件，代表成功或不成功的驗證結果。
對於不成功的結果，將引發 **[RequestValidationException](#validation-exception)** 請求驗證例外。

`validate` 函數有兩個重載，允許您透過兩種方式驗證請求主體：

- 第一個 `validate` 重載允許您將請求主體作為指定型別的物件來存取。
   下面的範例展示了如何驗證代表 `String` 值的請求主體：
   ```kotlin
   install(RequestValidation) {
       validate<String> { bodyText ->
           if (!bodyText.startsWith("Hello"))
               ValidationResult.Invalid("Body text should start with 'Hello'")
           else ValidationResult.Valid
       }
   }
   ```

   如果您的 `ContentNegotiation` 外掛程式已安裝並配置了特定的[序列化器](server-serialization.md#configure_serializer)，您可以驗證物件屬性。從[範例：驗證物件屬性](#example-object)中了解更多資訊。

- 第二個 `validate` 重載接受 `ValidatorBuilder` 驗證器建構器並允許您提供自訂驗證規則。
   您可以從[範例：驗證位元組陣列](#example-byte-array)中了解更多資訊。

### 3. 處理驗證例外 {id="validation-exception"}

如果請求驗證失敗，`%plugin_name%` 將引發 `RequestValidationException` 請求驗證例外。
此例外允許您存取請求主體並獲取此請求所有驗證失敗的原因。

您可以按如下方式使用 [StatusPages](server-status-pages.md) 狀態頁面外掛程式處理 `RequestValidationException`：

```kotlin
install(StatusPages) {
    exception<RequestValidationException> { call, cause ->
        call.respond(HttpStatusCode.BadRequest, cause.reasons.joinToString())
    }
}
```

您可以在此處找到完整的範例：[request-validation](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/request-validation)。

## 範例：驗證物件屬性 {id="example-object"}

在此範例中，我們將探討如何使用 `%plugin_name%` 外掛程式驗證物件屬性。
假設伺服器收到一個包含以下 JSON 資料的 `POST` 請求：

```HTTP
POST http://0.0.0.0:8080/json
Content-Type: application/json

{
  "id": -1,
  "firstName": "Jet",
  "lastName": "Brains"
}
```

若要新增 `id` 屬性的驗證，請按照以下步驟操作：

1. 建立描述上述 JSON 物件的 `Customer` 資料類別：
   ```kotlin
   @Serializable
   data class Customer(val id: Int, val firstName: String, val lastName: String)
   ```

2. 安裝包含 [JSON 序列化器](server-serialization.md#register_json)的 `ContentNegotiation` 內容協商外掛程式：
   ```kotlin
   install(ContentNegotiation) {
       json()
   }
   ```

3. 按如下方式在伺服器端接收 `Customer` 物件：
   ```kotlin
   post("/json") {
       val customer = call.receive<Customer>()
       call.respond(customer)
   }
   ```
4. 在 `%plugin_name%` 外掛程式配置中，新增 `id` 屬性的驗證，以確保其落在指定範圍內：
   ```kotlin
   install(RequestValidation) {
       validate<Customer> { customer ->
           if (customer.id <= 0)
               ValidationResult.Invalid("A customer ID should be greater than 0")
           else ValidationResult.Valid
       }
   }
   ```
   
   在此情況下，如果 `id` 值小於或等於 `0`，`%plugin_name%` 將引發 **[RequestValidationException](#validation-exception)** 請求驗證例外。

## 範例：驗證位元組陣列 {id="example-byte-array"}

在此範例中，我們將探討如何驗證作為位元組陣列接收到的請求主體。
假設伺服器收到一個包含以下文字資料的 `POST` 請求：

```HTTP
POST http://localhost:8080/array
Content-Type: text/plain

-1
```

若要將資料接收為位元組陣列並驗證它，請執行以下步驟：

1. 按如下方式在伺服器端接收資料：
   ```kotlin
   post("/array") {
       val body = call.receive<ByteArray>()
       call.respond(String(body))
   }
   ```
2. 若要驗證接收到的資料，我們將使用接受 `ValidatorBuilder` 驗證器建構器並允許您提供自訂驗證規則的第二個 `validate` [函數重載](#validation-function)：
   ```kotlin
   install(RequestValidation) {
       validate {
           filter { body ->
               body is ByteArray
           }
           validation { body ->
               check(body is ByteArray)
               val intValue = String(body).toInt()
               if (intValue <= 0)
                   ValidationResult.Invalid("A value should be greater than 0")
               else ValidationResult.Valid
           }
       }
   }