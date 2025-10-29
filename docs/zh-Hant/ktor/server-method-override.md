[//]: # (title: XHttpMethodOverride)

<primary-label ref="server-plugin"/>

<var name="plugin_name" value="XHttpMethodOverride"/>
<var name="package_name" value="io.ktor.server.plugins.methodoverride"/>
<var name="artifact_name" value="ktor-server-method-override"/>

<tldr>
<p>
<b>所需依賴項</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx-method-override"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor 支援 Kotlin/Native 並允許您在不依賴額外運行時或虛擬機器的情況下運行伺服器。">原生伺服器</Links> 支援</b>: ✅
</p>
</tldr>

<link-summary>
%plugin_name% 啟用在 X-HTTP-Method-Override 標頭內部通道 HTTP 動詞的功能。
</link-summary>

[%plugin_name%](https://api.ktor.io/ktor-server-method-override/io.ktor.server.plugins.methodoverride/-x-http-method-override.html) 外掛程式啟用在 `X-HTTP-Method-Override` 標頭內部通道 HTTP 動詞的功能。
如果您的伺服器 API 處理多個 HTTP 動詞（如 `GET`、`PUT`、`POST`、`DELETE` 等），但客戶端由於特定限制只能使用有限的動詞集合（例如 `GET` 和 `POST`），這可能會很有用。
舉例來說，如果客戶端傳送一個請求，其中 `X-Http-Method-Override` 標頭設定為 `DELETE`，Ktor 將使用 `delete` [路由處理器](server-routing.md#define_route) 來處理此請求。

## 新增依賴項 {id="add_dependencies"}

<p>
    要使用 <code>%plugin_name%</code>，您需要在建置腳本中包含 <code>%artifact_name%</code> artifact：
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
    要將 <code>%plugin_name%</code> 外掛程式<a href="#install">安裝</a>到應用程式，
    請將其傳遞給指定<Links href="/ktor/server-modules" summary="模組允許您通過分組路由來組織應用程式。">模組</Links>中的 <code>install</code> 函數。
    下面的程式碼片段顯示了如何安裝 <code>%plugin_name%</code> ...
</p>
<list>
    <li>
        ... 在 <code>embeddedServer</code> 函數呼叫內部。
    </li>
    <li>
        ... 在明確定義的 <code>module</code> 內部，它是一個 <code>Application</code> 類別的擴充函數。
    </li>
</list>
<Tabs>
    <TabItem title="embeddedServer">
        <code-block lang="kotlin" code="            import io.ktor.server.engine.*&#10;            import io.ktor.server.netty.*&#10;            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;&#10;            fun main() {&#10;                embeddedServer(Netty, port = 8080) {&#10;                    install(%plugin_name%)&#10;                    // ...&#10                }.start(wait = true)&#10;            }"/>
    </TabItem>
    <TabItem title="module">
        <code-block lang="kotlin" code="            import io.ktor.server.application.*&#10;            import %package_name%.*&#10;            // ...&#10;            fun Application.module() {&#10;                install(%plugin_name%)&#10;                // ...&#10            }"/>
    </TabItem>
</Tabs>

## 配置 %plugin_name% {id="configure"}

預設情況下，`%plugin_name%` 會檢查 `X-Http-Method-Override` 標頭以確定應處理請求的路由。
您可以使用 `headerName` 屬性來自訂標頭名稱。

## 範例 {id="example"}

下面的 HTTP 請求使用 `POST` 動詞，並將 `X-Http-Method-Override` 標頭設定為 `DELETE`：

```http request
POST http://0.0.0.0:8080/customer/3
X-Http-Method-Override: DELETE

```

要使用 `delete` [路由處理器](server-routing.md#define_route) 處理此類請求，您需要安裝 `%plugin_name%`：

```kotlin
package com.example

import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.server.plugins.methodoverride.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.serialization.*
import kotlinx.serialization.json.*
import io.ktor.server.util.getValue

@Serializable
data class Customer(val id: Int, val firstName: String, val lastName: String)

fun Application.main() {
    val customerStorage = mutableListOf<Customer>()
    customerStorage.addAll(
        arrayOf(
            Customer(1, "Jane", "Smith"),
            Customer(2, "John", "Smith"),
            Customer(3, "Jet", "Brains")
        )
    )

    install(XHttpMethodOverride)
    install(ContentNegotiation) {
        json(Json)
    }
    routing {
        get("/customer/{id}") {
            val id: Int by call.parameters
            val customer: Customer = customerStorage.find { it.id == id }!!
            call.respond(customer)
        }

        delete("/customer/{id}") {
            val id: Int by call.parameters
            customerStorage.removeIf { it.id == id }
            call.respondText("Customer is removed", status = HttpStatusCode.NoContent)
        }
    }
}

```

您可以在此處找到完整範例：[json-kotlinx-method-override](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx-method-override)。