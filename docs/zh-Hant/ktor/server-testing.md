[//]: # (title: 在 Ktor 伺服器中進行測試)

<show-structure for="chapter" depth="3"/>

<tldr>
<p>
<b>所需依賴</b>: <code>io.ktor:ktor-server-test-host</code>, <code>org.jetbrains.kotlin:kotlin-test</code>
</p>
</tldr>

<link-summary>
瞭解如何使用特殊的測試引擎來測試您的伺服器應用程式。
</link-summary>

Ktor 提供了一個特殊的測試引擎，它不會建立網頁伺服器，不會繫結至通訊端，也不會發出任何實際的 HTTP 請求。相反地，它直接掛鉤到內部機制並直接處理應用程式呼叫。相較於執行完整的網頁伺服器進行測試，這可以實現更快的測試執行。

## 新增依賴 {id="add-dependencies"}
若要測試伺服器 Ktor 應用程式，您需要將以下構件包含在建置指令碼中：
* 新增 `ktor-server-test-host` 依賴：

   <var name="artifact_name" value="ktor-server-test-host"/>
   <Tabs group="languages">
       <TabItem title="Gradle (Kotlin)" group-key="kotlin">
           <code-block lang="Kotlin" code="               testImplementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
       </TabItem>
       <TabItem title="Gradle (Groovy)" group-key="groovy">
           <code-block lang="Groovy" code="               testImplementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
       </TabItem>
       <TabItem title="Maven" group-key="maven">
           <code-block lang="XML" code="               &lt;dependency&gt;&#10;                   &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                   &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                   &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;               &lt;/dependency&gt;"/>
       </TabItem>
   </Tabs>

* 新增 `kotlin-test` 依賴，它提供了一組用於在測試中執行斷言的公用函式：

  <var name="group_id" value="org.jetbrains.kotlin"/>
  <var name="artifact_name" value="kotlin-test"/>
  <var name="version" value="kotlin_version"/>
  <Tabs group="languages">
      <TabItem title="Gradle (Kotlin)" group-key="kotlin">
          <code-block lang="Kotlin" code="              testImplementation(&quot;%group_id%:%artifact_name%:$%version%&quot;)"/>
      </TabItem>
      <TabItem title="Gradle (Groovy)" group-key="groovy">
          <code-block lang="Groovy" code="              testImplementation &quot;%group_id%:%artifact_name%:$%version%&quot;"/>
      </TabItem>
      <TabItem title="Maven" group-key="maven">
          <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;%group_id%&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%&lt;/artifactId&gt;&#10;                  &lt;version&gt;${%version%}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
      </TabItem>
  </Tabs>

> 若要測試 [原生伺服器](server-native.md#add-dependencies)，請將測試構件新增至 `nativeTest` 原始碼集。

## 測試概述 {id="overview"}

若要使用測試引擎，請按照以下步驟操作：
1. 建立一個 JUnit 測試類別和一個測試函式。
2. 使用 [testApplication](https://api.ktor.io/ktor-server/ktor-server-test-host/io.ktor.server.testing/test-application.html) 函式來設定在本機執行的已配置測試應用程式實例。
3. 在測試應用程式內部使用 [Ktor HTTP 用戶端](client-create-and-configure.md) 實例來向您的伺服器發出請求，接收回應並進行斷言。

以下程式碼展示了如何測試最簡單的 Ktor 應用程式，該應用程式接受對 `/` 路徑發出的 GET 請求並回應純文字。

<Tabs>
<TabItem title="Test">

```kotlin
package com.example

import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.testing.*
import kotlin.test.*

class ApplicationTest {
    @Test
    fun testRoot() = testApplication {
        application {
            module()
        }
        val response = client.get("/")
        assertEquals(HttpStatusCode.OK, response.status)
        assertEquals("Hello, world!", response.bodyAsText())
    }
}

```

</TabItem>

<TabItem title="Application">

```kotlin
package com.example

import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

fun Application.module() {
    routing {
        get("/") {
            call.respondText("Hello, world!")
        }
    }
}

```

</TabItem>
</Tabs>

可執行程式碼範例在此處提供：[engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)。

## 測試應用程式 {id="test-app"}

### 步驟 1：配置測試應用程式 {id="configure-test-app"}

測試應用程式的配置可能包括以下步驟：
- [新增應用程式模組](#add-modules)
- [(選用) 新增路由](#add-routing)
- [(選用) 自訂環境](#environment)
- [(選用) 模擬外部服務](#external-services)

> 預設情況下，已配置的測試應用程式會在 [首次用戶端呼叫](#make-request) 時啟動。
> 選用地，您可以呼叫 `startApplication` 函式來手動啟動應用程式。
> 如果您需要測試應用程式的 [生命週期事件](server-events.md#predefined-events)，這可能會有用。

#### 新增應用程式模組 {id="add-modules"}

若要測試應用程式，其 [模組](server-modules.md) 應載入到 `testApplication`。為此，您必須 [明確載入您的模組](#explicit-module-loading) 或 [配置環境](#configure-env) 以從配置檔案中載入它們。

##### 明確載入模組 {id="explicit-module-loading"}

若要手動將模組新增至測試應用程式，請使用 `application` 函式：

```kotlin
package com.example

import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.testing.*
import kotlin.test.*

class ApplicationTest {
    @Test
    fun testModule1() = testApplication {
        application {
            module1()
            module2()
        }
        val response = client.get("/module1")
        assertEquals(HttpStatusCode.OK, response.status)
        assertEquals("Hello from 'module1'!", response.bodyAsText())
    }
}
```

#### 從配置檔案載入模組 {id="configure-env"}

如果您想從配置檔案載入模組，請使用 `environment` 函式為您的測試指定配置檔案：

```kotlin
@Test
fun testHello() = testApplication {
    environment {
        config = ApplicationConfig("application-custom.conf")
    }
}
```

當您需要在測試期間模擬不同環境或使用自訂配置設定時，此方法非常有用。

> 您也可以在 `application` 區塊內部存取 `Application` 實例。

#### 新增路由 {id="add-routing"}

您可以使用 `routing` 函式向您的測試應用程式新增路由。
這對於以下使用案例可能很方便：
- 您可以新增應測試的 [特定路由](server-routing.md#route_extension_function)，而不是將 [模組新增](#add-modules) 至測試應用程式。
- 您可以新增僅在測試應用程式中所需的路由。以下範例顯示了如何新增 `/login-test` 端點，該端點用於在測試中初始化使用者 [會話](server-sessions.md)：
   ```kotlin
   fun testHello() = testApplication {
       routing {
           get("/login-test") {
               call.sessions.set(UserSession("xyzABC123","abc123"))
           }
       }
   }
   ```
   
   您可以在此處找到包含測試的完整範例：[auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)。

#### 自訂環境 {id="environment"}

若要為測試應用程式建置自訂環境，請使用 `environment` 函式。
例如，若要為測試使用自訂配置，您可以在 `test/resources` 資料夾中建立一個配置檔案，並使用 `config` 屬性載入它：

```kotlin
@Test
fun testHello() = testApplication {
    environment {
        config = ApplicationConfig("application-custom.conf")
    }
}
```

另一種指定配置屬性的方法是使用 [MapApplicationConfig](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.config/-map-application-config/index.html)。如果您想在應用程式啟動之前存取應用程式配置，這可能會有用。以下範例顯示了如何使用 `config` 屬性將 `MapApplicationConfig` 傳遞給 `testApplication` 函式：

```kotlin
@Test
fun testDevEnvironment() = testApplication {
    environment {
        config = MapApplicationConfig("ktor.environment" to "dev")
    }
}
```

#### 模擬外部服務 {id="external-services"}

Ktor 允許您使用 `externalServices` 函式模擬外部服務。
在此函式內部，您需要呼叫 `hosts` 函式，該函式接受兩個參數：
- `hosts` 參數接受外部服務的 URL。
- `block` 參數允許您配置作為外部服務模擬的 `Application`。
   您可以為此 `Application` 配置路由並安裝外掛程式。

以下範例展示了如何使用 `externalServices` 模擬 Google API 返回的 JSON 回應：

```kotlin
fun testHello() = testApplication {
    externalServices {
        hosts("https://www.googleapis.com") {
            install(io.ktor.server.plugins.contentnegotiation.ContentNegotiation) {
                json()
            }
            routing {
                get("oauth2/v2/userinfo") {
                    call.respond(UserInfo("1", "JetBrains", "", ""))
                }
            }
        }
    }
}
```

您可以在此處找到包含測試的完整範例：[auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)。

### 步驟 2：(選用) 配置用戶端 {id="configure-client"}

`testApplication` 透過 `client` 屬性提供對具有預設配置的 HTTP 用戶端的存取。
如果您需要自訂用戶端並安裝額外的外掛程式，您可以使用 `createClient` 函式。例如，若要在測試 POST/PUT 請求中 [傳送 JSON 資料](#json-data)，您可以安裝 [ContentNegotiation](client-serialization.md) 外掛程式：
```kotlin
    @Test
    fun testPostCustomer() = testApplication {
        application {
            main()
        }
        client = createClient {
            install(ContentNegotiation) {
                json()
            }
        }
}
```

### 步驟 3：發出請求 {id="make-request"}

若要測試您的應用程式，請使用 [已配置的用戶端](#configure-client) 發出 [請求](client-requests.md) 並接收 [回應](client-responses.md)。[以下範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx) 展示了如何測試處理 `POST` 請求的 `/customer` 端點：

```kotlin
    @Test
    fun testPostCustomer() = testApplication {
        application {
            main()
        }
        client = createClient {
            install(ContentNegotiation) {
                json()
            }
        }
        val response = client.post("/customer") {
            contentType(ContentType.Application.Json)
            setBody(Customer(3, "Jet", "Brains"))
        }
}
```

### 步驟 4：斷言結果 {id="assert"}

接收到 [回應](#make-request) 後，您可以透過 `kotlin.test` 函式庫提供的 [斷言](https://kotlinlang.org/api/latest/kotlin.test/) 來驗證結果：

```kotlin
    @Test
    fun testPostCustomer() = testApplication {
        application {
            main()
        }
        client = createClient {
            install(ContentNegotiation) {
                json()
            }
        }
        val response = client.post("/customer") {
            contentType(ContentType.Application.Json)
            setBody(Customer(3, "Jet", "Brains"))
        }
        assertEquals("Customer stored correctly", response.bodyAsText())
        assertEquals(HttpStatusCode.Created, response.status)
    }
}
```

## 測試 POST/PUT 請求 {id="test-post-put"}

### 傳送表單資料 {id="form-data"}

若要在測試 POST/PUT 請求中傳送表單資料，您需要設定 `Content-Type` 標頭並指定請求主體。為此，您可以分別使用 [header](client-requests.md#headers) 和 [setBody](client-requests.md#body) 函式。以下範例展示了如何使用 `x-www-form-urlencoded` 和 `multipart/form-data` 類型傳送表單資料。

#### x-www-form-urlencoded {id="x-www-form-urlencoded"}

以下來自 [post-form-parameters](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-form-parameters) 範例的測試展示了如何發出使用 `x-www-form-urlencoded` 內容類型傳送表單參數的測試請求。請注意，[formUrlEncode](https://api.ktor.io/ktor-http/io.ktor.http/form-url-encode.html) 函式用於從鍵/值對清單中編碼表單參數。

<Tabs>
<TabItem title="Test">

```kotlin
package formparameters

import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlin.test.*

class ApplicationTest {
    @Test
    fun testPost() = testApplication {
        application {
            main()
        }
        val response = client.post("/signup") {
            header(HttpHeaders.ContentType, ContentType.Application.FormUrlEncoded.toString())
            setBody(listOf("username" to "JetBrains", "email" to "example@jetbrains.com", "password" to "foobar", "confirmation" to "foobar").formUrlEncode())
        }
        assertEquals("The 'JetBrains' account is created", response.bodyAsText())
    }
}

```

</TabItem>

<TabItem title="Application">

```kotlin
import io.ktor.server.application.*
import io.ktor.server.html.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import kotlinx.html.*

fun Application.main() {
    routing {
        post("/signup") {
            val formParameters = call.receiveParameters()
            val username = formParameters["username"].toString()
            call.respondText("The '$username' account is created")
        }
    }
}
```

</TabItem>
</Tabs>

#### multipart/form-data {id="multipart-form-data"}

以下程式碼展示了如何建置 `multipart/form-data` 並測試檔案上傳。您可以在此處找到完整範例：[upload-file](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/upload-file)。

<Tabs>
<TabItem title="Test">

```kotlin
package uploadfile

import io.ktor.client.request.*
import io.ktor.client.request.forms.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.testing.*
import org.junit.*
import java.io.*
import kotlin.test.*
import kotlin.test.Test

class ApplicationTest {
    @Test
    fun testUpload() = testApplication {
        application {
            main()
        }
        val boundary = "WebAppBoundary"
        val response = client.post("/upload") {
            setBody(
                MultiPartFormDataContent(
                    formData {
                        append("description", "Ktor logo")
                        append("image", File("ktor_logo.png").readBytes().toString(), Headers.build {
                            append(HttpHeaders.ContentType, "image/png")
                            append(HttpHeaders.ContentDisposition, "filename=\"ktor_logo.png\"")
                        })
                    },
                    boundary,
                    ContentType.MultiPart.FormData.withParameter("boundary", boundary)
                )
            )
        }
        assertEquals("Ktor logo is uploaded to 'uploads/ktor_logo.png'", response.bodyAsText(Charsets.UTF_8))
    }

    @After
    fun deleteUploadedFile() {
        File("uploads/ktor_logo.png").delete()
    }
}

```

</TabItem>

<TabItem title="Application">

```kotlin
package uploadfile

import io.ktor.server.application.*
import io.ktor.http.content.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.util.cio.*
import io.ktor.utils.io.*
import java.io.File

fun Application.main() {
    routing {
        post("/upload") {
            var fileDescription = ""
            var fileName = ""
            val multipartData = call.receiveMultipart(formFieldLimit = 1024 * 1024 * 100)

            multipartData.forEachPart { part ->
                when (part) {
                    is PartData.FormItem -> {
                        fileDescription = part.value
                    }

                    is PartData.FileItem -> {
                        fileName = part.originalFileName as String
                        val file = File("uploads/$fileName")
                        part.provider().copyAndClose(file.writeChannel())
                    }

                    else -> {}
                }
                part.dispose()
            }

            call.respondText("$fileDescription is uploaded to 'uploads/$fileName'")
        }
    }
}

```

</TabItem>
</Tabs>

### 傳送 JSON 資料 {id="json-data"}

若要在測試 POST/PUT 請求中傳送 JSON 資料，您需要建立一個新的用戶端並安裝 [ContentNegotiation](client-serialization.md) 外掛程式，該外掛程式允許以特定格式序列化/反序列化內容。在請求內部，您可以使用 `contentType` 函式指定 `Content-Type` 標頭，並使用 [setBody](client-requests.md#body) 函式指定請求主體。[以下範例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx) 展示了如何測試處理 `POST` 請求的 `/customer` 端點。

<Tabs>
<TabItem title="Test">

```kotlin
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.serialization.kotlinx.json.*
import io.ktor.server.testing.*
import kotlin.test.*

class CustomerTests {
    @Test
    fun testPostCustomer() = testApplication {
        application {
            main()
        }
        client = createClient {
            install(ContentNegotiation) {
                json()
            }
        }
        val response = client.post("/customer") {
            contentType(ContentType.Application.Json)
            setBody(Customer(3, "Jet", "Brains"))
        }
        assertEquals("Customer stored correctly", response.bodyAsText())
        assertEquals(HttpStatusCode.Created, response.status)
    }
}
```

</TabItem>

<TabItem title="Application">

```kotlin
import io.ktor.server.application.*
import io.ktor.server.plugins.contentnegotiation.*
import io.ktor.http.*
import io.ktor.server.request.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.serialization.kotlinx.json.*
import kotlinx.serialization.*
import kotlinx.serialization.json.*
import io.ktor.server.util.getValue

@Serializable
data class Customer(val id: Int, val firstName: String, val lastName: String)

    install(ContentNegotiation) {
        json(Json {
            prettyPrint = true
            isLenient = true
        })
    }

        post("/customer") {
            val customer = call.receive<Customer>()
            customerStorage.add(customer)
            call.respondText("Customer stored correctly", status = HttpStatusCode.Created)
        }
    }
```

</TabItem>
</Tabs>

## 在測試期間保留 Cookie {id="preserving-cookies"}

如果您需要在測試時在請求之間保留 Cookie，您需要建立一個新的用戶端並安裝 [HttpCookies](client-cookies.md) 外掛程式。在以下來自 [session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client) 範例的測試中，由於 Cookie 被保留，重新載入計數在每個請求後都會增加。

<Tabs>
<TabItem title="Test">

```kotlin
package cookieclient

import io.ktor.client.plugins.cookies.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.server.testing.*
import kotlin.test.*

class ApplicationTest {
    @Test
    fun testRequests() = testApplication {
        application {
            main()
        }
        val client = createClient {
            install(HttpCookies)
        }

        val loginResponse = client.get("/login")
        val response1 = client.get("/user")
        assertEquals("Session ID is 123abc. Reload count is 1.", response1.bodyAsText())
        val response2 = client.get("/user")
        assertEquals("Session ID is 123abc. Reload count is 2.", response2.bodyAsText())
        val response3 = client.get("/user")
        assertEquals("Session ID is 123abc. Reload count is 3.", response3.bodyAsText())
        val logoutResponse = client.get("/logout")
        assertEquals("Session doesn't exist or is expired.", logoutResponse.bodyAsText())
    }
}

```

</TabItem>

<TabItem title="Application">

```kotlin
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import io.ktor.server.sessions.*
import io.ktor.util.*
import kotlinx.serialization.Serializable

@Serializable
data class UserSession(val id: String, val count: Int)

fun Application.main() {
    install(Sessions) {
        val secretEncryptKey = hex("00112233445566778899aabbccddeeff")
        val secretSignKey = hex("6819b57a326945c1968f45236589")
        cookie<UserSession>("user_session") {
            cookie.path = "/"
            cookie.maxAgeInSeconds = 10
            transform(SessionTransportTransformerEncrypt(secretEncryptKey, secretSignKey))
        }
    }
    routing {
        get("/login") {
            call.sessions.set(UserSession(id = "123abc", count = 0))
            call.respondRedirect("/user")
        }

        get("/user") {
            val userSession = call.sessions.get<UserSession>()
            if (userSession != null) {
                call.sessions.set(userSession.copy(count = userSession.count + 1))
                call.respondText("Session ID is ${userSession.id}. Reload count is ${userSession.count}.")
            } else {
                call.respondText("Session doesn't exist or is expired.")
            }
        }

```

</TabItem>
</Tabs>

## 測試 HTTPS {id="https"}

如果您需要測試 [HTTPS 端點](server-ssl.md)，請使用 [URLBuilder.protocol](client-requests.md#url) 屬性變更用於發出請求的協定：

```kotlin
import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.server.testing.*
import kotlin.test.*

class ApplicationTest {
    @Test
    fun testRoot() = testApplication {
        application {
            module()
        }
        val response = client.get("/") {
            url {
                protocol = URLProtocol.HTTPS
            }
        }
        assertEquals("Hello, world!", response.bodyAsText())
    }
}
```

您可以在此處找到完整範例：[ssl-engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main)。

## 測試 WebSockets {id="testing-ws"}

您可以使用用戶端提供的 [WebSockets](client-websockets.topic) 外掛程式測試 [WebSocket 對話](server-websockets.md)：

```kotlin
package com.example

import io.ktor.client.plugins.websocket.*
import io.ktor.websocket.*
import io.ktor.server.testing.*
import kotlin.test.*

class ModuleTest {
    @Test
    fun testConversation() {
        testApplication {
            application {
                module()
            }
            val client = createClient {
                install(WebSockets)
            }

            client.webSocket("/echo") {
                val greetingText = (incoming.receive() as? Frame.Text)?.readText() ?: ""
                assertEquals("Please enter your name", greetingText)

                send(Frame.Text("JetBrains"))
                val responseText = (incoming.receive() as Frame.Text).readText()
                assertEquals("Hi, JetBrains!", responseText)
            }
        }
    }
}
```

## 使用 HttpClient 進行端對端測試 {id="end-to-end"}
除了測試引擎之外，您還可以將 [Ktor HTTP 用戶端](client-create-and-configure.md) 用於伺服器應用程式的端對端測試。
在以下範例中，HTTP 用戶端向 `TestServer` 發出測試請求：

```kotlin
import e2e.TestServer
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.client.statement.*
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Test

class EmbeddedServerTest: TestServer() {
    @Test
    fun rootRouteRespondsWithHelloWorldString(): Unit = runBlocking {
        val response: String = HttpClient().get("http://localhost:8080/").body()
        assertEquals("Hello, world!", response)
    }
}
```

如需完整範例，請參閱這些範例：
- [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server)：一個待測試的範例伺服器。
- [e2e](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/e2e)：包含用於設定測試伺服器的輔助類別和函式。