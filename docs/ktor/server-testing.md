[//]: # (title: Ktor 服务器中的测试)

<show-structure for="chapter" depth="3"/>

<tldr>
<p>
<b>所需依赖项</b>：`io.ktor:ktor-server-test-host`、`org.jetbrains.kotlin:kotlin-test`
</p>
</tldr>

<link-summary>
了解如何使用专门的测试引擎测试服务器应用程序。
</link-summary>

Ktor 提供了一个专门的测试引擎，它不创建 Web 服务器，不绑定到套接字，也不发出任何真实的 HTTP 请求。相反，它直接介入内部机制并直接处理应用程序调用。与运行完整的 Web 服务器进行测试相比，这会使测试执行更快。

## 添加依赖项 {id="add-dependencies"}
要测试 Ktor 服务器应用程序，你需要在构建脚本中包含以下构件：
* 添加 `ktor-server-test-host` 依赖项：

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

* 添加 `kotlin-test` 依赖项，它提供了一组实用函数，用于在测试中进行断言：

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

> 要测试 [Native 服务器](server-native.md#add-dependencies)，请将测试构件添加到 `nativeTest` 源代码集。

## 测试概述 {id="overview"}

要使用测试引擎，请遵循以下步骤：
1.  创建一个 JUnit 测试类和一个测试函数。
2.  使用 [testApplication](https://api.ktor.io/ktor-server/ktor-server-test-host/io.ktor.server.testing/test-application.html) 函数设置一个在本地运行的已配置测试应用程序实例。
3.  在测试应用程序中，使用 [Ktor HTTP 客户端](client-create-and-configure.md) 实例向服务器发出请求、接收响应并进行断言。

以下代码演示了如何测试最简单的 Ktor 应用程序，该应用程序接受对 `/` 路径的 `GET` 请求并以纯文本响应。

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

可运行的代码示例位于：[engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)。

## 测试应用程序 {id="test-app"}

### 步骤 1：配置测试应用程序 {id="configure-test-app"}

测试应用程序的配置可能包括以下步骤：
- [添加应用程序模块](#add-modules)
- [(可选) 添加路由](#add-routing)
- [(可选) 自定义环境](#environment)
- [(可选) 模拟外部服务](#external-services)

> 默认情况下，已配置的测试应用程序在[首次客户端调用](#make-request)时启动。
> (可选) 你可以调用 `startApplication` 函数手动启动应用程序。
> 如果你需要测试应用程序的[生命周期事件](server-events.md#predefined-events)，这可能会很有用。

#### 添加应用程序模块 {id="add-modules"}

要测试应用程序，其[模块](server-modules.md)应加载到 `testApplication` 中。为此，你必须[显式加载模块](#explicit-module-loading)或[配置环境](#configure-env)以从配置文件加载它们。

##### 显式加载模块 {id="explicit-module-loading"}

要手动向测试应用程序添加模块，请使用 `application` 函数：

```kotlin
package com.example

import io.ktor.client.request.*
import io.ktor.client.statement.*
import io.ktor.http.*
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

#### 从配置文件加载模块 {id="configure-env"}

如果你想从配置文件加载模块，请使用 `environment` 函数为你的测试指定配置文件：

```kotlin
@Test
fun testHello() = testApplication {
    environment {
        config = ApplicationConfig("application-custom.conf")
    }
}
```

当你需要在测试期间模拟不同的环境或使用自定义配置设置时，此方法非常有用。

> 你也可以在 `application` 代码块中访问 `Application` 实例。

#### 添加路由 {id="add-routing"}

你可以使用 `routing` 函数向测试应用程序添加路由。
这对于以下用例可能很方便：
- 无需向测试应用程序[添加模块](#add-modules)，你可以添加应测试的[特定路由](server-routing.md#route_extension_function)。
- 你可以添加仅在测试应用程序中需要的路由。以下示例展示了如何添加 `/login-test` 端点，该端点用于在测试中初始化用户[会话](server-sessions.md)：
   ```kotlin
   fun testHello() = testApplication {
       routing {
           get("/login-test") {
               call.sessions.set(UserSession("xyzABC123","abc123"))
           }
       }
   }
   ```

   你可以在此处找到包含测试的完整示例：[auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)。

#### 自定义环境 {id="environment"}

要为测试应用程序构建自定义环境，请使用 `environment` 函数。
例如，要使用自定义测试配置，你可以在 `test/resources` 文件夹中创建配置文件并使用 `config` 属性加载它：

```kotlin
@Test
fun testHello() = testApplication {
    environment {
        config = ApplicationConfig("application-custom.conf")
    }
}
```

指定配置属性的另一种方法是使用 [MapApplicationConfig](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.config/-map-application-config/index.html)。如果你想在应用程序启动之前访问应用程序配置，这可能会很有用。以下示例展示了如何使用 `config` 属性将 `MapApplicationConfig` 传递给 `testApplication` 函数：

```kotlin
@Test
fun testDevEnvironment() = testApplication {
    environment {
        config = MapApplicationConfig("ktor.environment" to "dev")
    }
}
```

#### 模拟外部服务 {id="external-services"}

Ktor 允许你使用 `externalServices` 函数模拟外部服务。
在此函数内部，你需要调用 `hosts` 函数，该函数接受两个形参：
- `hosts` 形参接受外部服务的 URL。
- `block` 形参允许你配置充当外部服务模拟的 `Application`。
   你可以为这个 `Application` 配置路由并安装插件。

以下示例展示了如何使用 `externalServices` 来模拟 Google API 返回的 JSON 响应：

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

你可以在此处找到包含测试的完整示例：[auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)。

### 步骤 2：(可选) 配置客户端 {id="configure-client"}

`testApplication` 通过 `client` 属性提供对具有默认配置的 HTTP 客户端的访问。
如果你需要自定义客户端并安装额外的插件，可以使用 `createClient` 函数。例如，要在测试 `POST`/`PUT` 请求中[发送 JSON 数据](#json-data)，你可以安装 [ContentNegotiation](client-serialization.md) 插件：
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

### 步骤 3：发出请求 {id="make-request"}

要测试你的应用程序，请使用[已配置的客户端](#configure-client)来发出[请求](client-requests.md)并接收[响应](client-responses.md)。以下[示例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)展示了如何测试处理 `POST` 请求的 `/customer` 端点：

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

### 步骤 4：断言结果 {id="assert"}

接收到[响应](#make-request)后，你可以通过 `kotlin.test` 库提供的断言来验证结果：

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

## 测试 POST/PUT 请求 {id="test-post-put"}

### 发送表单数据 {id="form-data"}

要在测试 `POST`/`PUT` 请求中发送表单数据，你需要设置 `Content-Type` 头并指定请求体。为此，你可以分别使用 `header` 和 `setBody` 函数。以下示例展示了如何使用 `x-www-form-urlencoded` 和 `multipart/form-data` 类型发送表单数据。

#### x-www-form-urlencoded {id="x-www-form-urlencoded"}

以下来自 [post-form-parameters](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-form-parameters) 示例的测试展示了如何使用 `x-www-form-urlencoded` 内容类型发送带表单参数的测试请求。请注意，`formUrlEncode` 函数用于从键值对列表编码表单参数。

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

以下代码演示了如何构建 `multipart/form-data` 并测试文件上传。你可以在此处找到完整示例：[upload-file](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/upload-file)。

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

### 发送 JSON 数据 {id="json-data"}

要在测试 `POST`/`PUT` 请求中发送 JSON 数据，你需要创建一个新客户端并安装 [ContentNegotiation](client-serialization.md) 插件，该插件允许以特定格式序列化/反序列化内容。在请求内部，你可以使用 `contentType` 函数指定 `Content-Type` 头，并使用 `setBody` 函数指定请求体。以下[示例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)展示了如何测试处理 `POST` 请求的 `/customer` 端点。

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

## 测试期间保留 cookie {id="preserving-cookies"}

如果你需要在测试时在请求之间保留 cookie，你需要创建一个新客户端并安装 [HttpCookies](client-cookies.md) 插件。在以下来自 [session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client) 示例的测试中，由于保留了 cookie，每次请求后重新加载计数都会增加。

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

## 测试 HTTPS {id="https"}

如果你需要测试 [HTTPS 端点](server-ssl.md)，请使用 [URLBuilder.protocol](client-requests.md#url) 属性更改用于发出请求的协议：

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

你可以在此处找到完整示例：[ssl-engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main)。

## 测试 WebSocket {id="testing-ws"}

你可以通过使用客户端提供的 [WebSockets](client-websockets.topic) 插件来测试 [WebSocket 会话](server-websockets.md)：

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

## 使用 HttpClient 进行端到端测试 {id="end-to-end"}
除了测试引擎之外，你还可以使用 [Ktor HTTP 客户端](client-create-and-configure.md) 对服务器应用程序进行端到端测试。
在以下示例中，HTTP 客户端向 `TestServer` 发出测试请求：

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

有关完整示例，请参考以下示例：
- [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server)：一个要测试的示例服务器。
- [e2e](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/e2e)：包含用于设置测试服务器的辅助类和函数。