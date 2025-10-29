[//]: # (title: Ktorサーバーでのテスト)

<show-structure for="chapter" depth="3"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:ktor-server-test-host</code>, <code>org.jetbrains.kotlin:kotlin-test</code>
</p>
</tldr>

<link-summary>
特別なテストエンジンを使用して、サーバーアプリケーションをテストする方法を学びます。
</link-summary>

Ktorは、Webサーバーを作成せず、ソケットにバインドせず、実際のHTTPリクエストを生成しない特別なテストエンジンを提供します。代わりに、内部メカニズムに直接フックし、アプリケーションコールを直接処理します。これにより、テストのために完全なWebサーバーを実行するよりも、より迅速なテスト実行が可能になります。

## 依存関係の追加 {id="add-dependencies"}
サーバーKtorアプリケーションをテストするには、ビルドスクリプトに以下のアーティファクトを含める必要があります。
* `ktor-server-test-host` 依存関係を追加します。

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

* テストでのアサーション実行のためのユーティリティ関数を提供する `kotlin-test` 依存関係を追加します。

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

> [ネイティブサーバー](server-native.md#add-dependencies)をテストするには、`nativeTest` ソースセットにテストアーティファクトを追加してください。

## テストの概要 {id="overview"}

テストエンジンを使用するには、以下の手順に従います。
1. JUnitテストクラスとテスト関数を作成します。
2. [testApplication](https://api.ktor.io/ktor-server-test-host/io.ktor.server.testing/test-application.html) 関数を使用して、ローカルで実行されるテストアプリケーションの設定済みインスタンスをセットアップします。
3. テストアプリケーション内の[Ktor HTTPクライアント](client-create-and-configure.md)インスタンスを使用して、サーバーにリクエストを作成し、レスポンスを受け取り、アサーションを実行します。

以下のコードは、`/` パスへのGETリクエストを受け入れ、プレーンテキストのレスポンスを返す最もシンプルなKtorアプリケーションをテストする方法を示しています。

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

実行可能なコード例はこちらから入手できます: [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main)。

## アプリケーションのテスト {id="test-app"}

### ステップ1: テストアプリケーションの設定 {id="configure-test-app"}

テストアプリケーションの設定には、以下のステップが含まれる場合があります。
- [アプリケーションモジュールの追加](#add-modules)
- [(オプション) ルートの追加](#add-routing)
- [(オプション) 環境のカスタマイズ](#environment)
- [(オプション) 外部サービスのモック](#external-services)

> デフォルトでは、設定されたテストアプリケーションは[最初のクライアント呼び出し](#make-request)で起動します。
> オプションで、`startApplication` 関数を呼び出してアプリケーションを手動で起動できます。
> これは、アプリケーションの[ライフサイクルイベント](server-events.md#predefined-events)をテストする必要がある場合に役立つかもしれません。

#### アプリケーションモジュールの追加 {id="add-modules"}

アプリケーションをテストするには、その[モジュール](server-modules.md)が`testApplication`にロードされる必要があります。これを行うには、[モジュールを明示的にロードする](#explicit-module-loading)か、[環境を設定して](#configure-env)設定ファイルからロードする必要があります。

##### モジュールの明示的なロード {id="explicit-module-loading"}

テストアプリケーションにモジュールを手動で追加するには、`application` 関数を使用します。

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

#### 設定ファイルからのモジュールロード {id="configure-env"}

設定ファイルからモジュールをロードしたい場合は、`environment` 関数を使用してテスト用の設定ファイルを指定します。

```kotlin
@Test
fun testHello() = testApplication {
    environment {
        config = ApplicationConfig("application-custom.conf")
    }
}
```

この方法は、テスト中に異なる環境を模倣したり、カスタム設定を使用したりする必要がある場合に便利です。

> `application` ブロック内で `Application` インスタンスにアクセスすることもできます。

#### ルートの追加 {id="add-routing"}

`routing` 関数を使用して、テストアプリケーションにルートを追加できます。
これは、以下のようなユースケースで便利かもしれません。
- テストアプリケーションに[モジュールを追加する](#add-modules)代わりに、テストすべき[特定のルート](server-routing.md#route_extension_function)を追加できます。
- テストアプリケーションでのみ必要なルートを追加できます。以下の例は、テストでユーザー[セッション](server-sessions.md)を初期化するために使用される`/login-test`エンドポイントを追加する方法を示しています。
   ```kotlin
   fun testHello() = testApplication {
       routing {
           get("/login-test") {
               call.sessions.set(UserSession("xyzABC123","abc123"))
           }
       }
   }
   ```
   
   テストを含む完全な例はこちらにあります: [auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)。

#### 環境のカスタマイズ {id="environment"}

テストアプリケーションのカスタム環境を構築するには、`environment` 関数を使用します。
たとえば、テストにカスタム設定を使用するには、`test/resources` フォルダーに設定ファイルを作成し、`config` プロパティを使用してロードできます。

```kotlin
@Test
fun testHello() = testApplication {
    environment {
        config = ApplicationConfig("application-custom.conf")
    }
}
```

設定プロパティを指定するもう1つの方法は、[MapApplicationConfig](https://api.ktor.io/ktor-server-core/io.ktor.server.config/-map-application-config/index.html)を使用することです。これは、アプリケーションが起動する前にアプリケーション設定にアクセスしたい場合に役立つかもしれません。以下の例は、`config` プロパティを使用して `MapApplicationConfig` を `testApplication` 関数に渡す方法を示しています。

```kotlin
@Test
fun testDevEnvironment() = testApplication {
    environment {
        config = MapApplicationConfig("ktor.environment" to "dev")
    }
}
```

#### 外部サービスのモック {id="external-services"}

Ktorでは、`externalServices` 関数を使用して外部サービスをモックできます。
この関数内で、2つのパラメーターを受け入れる `hosts` 関数を呼び出す必要があります。
- `hosts` パラメーターは、外部サービスのURLを受け入れます。
- `block` パラメーターは、外部サービスのモックとして機能する `Application` を設定できます。
   この `Application` のルーティングを設定し、プラグインをインストールできます。

以下のサンプルは、`externalServices` を使用してGoogle APIから返されるJSONレスポンスをシミュレートする方法を示しています。

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

テストを含む完全な例はこちらにあります: [auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google)。

### ステップ2: (オプション) クライアントの設定 {id="configure-client"}

`testApplication` は、`client` プロパティを使用してデフォルト設定のHTTPクライアントへのアクセスを提供します。
クライアントをカスタマイズし、追加のプラグインをインストールする必要がある場合は、`createClient` 関数を使用できます。たとえば、テストのPOST/PUTリクエストで[JSONデータを送信](#json-data)するには、[ContentNegotiation](client-serialization.md)プラグインをインストールできます。
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

### ステップ3: リクエストの作成 {id="make-request"}

アプリケーションをテストするには、[設定済みのクライアント](#configure-client)を使用して[リクエスト](client-requests.md)を作成し、[レスポンス](client-responses.md)を受け取ります。[以下の例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)は、`POST` リクエストを処理する`/customer`エンドポイントをテストする方法を示しています。

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

### ステップ4: 結果のアサーション {id="assert"}

[レスポンス](#make-request)を受け取った後、[kotlin.test](https://kotlinlang.org/api/latest/kotlin.test/) ライブラリによって提供されるアサーションを実行することで結果を検証できます。

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

## POST/PUTリクエストのテスト {id="test-post-put"}

### フォームデータの送信 {id="form-data"}

テストのPOST/PUTリクエストでフォームデータを送信するには、`Content-Type` ヘッダーを設定し、リクエストボディを指定する必要があります。これを行うには、それぞれ[header](client-requests.md#headers)関数と[setBody](client-requests.md#body)関数を使用できます。以下の例は、`x-www-form-urlencoded`と`multipart/form-data`の両方のタイプを使用してフォームデータを送信する方法を示しています。

#### x-www-form-urlencoded {id="x-www-form-urlencoded"}

[post-form-parameters](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-form-parameters)の例からの以下のテストは、`x-www-form-urlencoded`コンテンツタイプを使用して送信されたフォームパラメータを含むテストリクエストを作成する方法を示しています。キー/値ペアのリストからフォームパラメータをエンコードするために、[formUrlEncode](https://api.ktor.io/ktor-http/io.ktor.http/form-url-encode.html)関数が使用されていることに注意してください。

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

以下のコードは、`multipart/form-data` を構築し、ファイルアップロードをテストする方法を示しています。完全な例はこちらから入手できます: [upload-file](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/upload-file)。

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

### JSONデータの送信 {id="json-data"}

テストのPOST/PUTリクエストでJSONデータを送信するには、新しいクライアントを作成し、コンテンツを特定の形式でシリアライズ/デシリアライズできる[ContentNegotiation](client-serialization.md)プラグインをインストールする必要があります。リクエスト内で、`contentType` 関数を使用して `Content-Type` ヘッダーを、[setBody](client-requests.md#body) を使用してリクエストボディを指定できます。[以下の例](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)は、`POST` リクエストを処理する`/customer`エンドポイントをテストする方法を示しています。

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

## テスト中にクッキーを保持する {id="preserving-cookies"}

テスト中にリクエスト間でクッキーを保持する必要がある場合は、新しいクライアントを作成し、[HttpCookies](client-cookies.md)プラグインをインストールする必要があります。[session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client)の例の以下のテストでは、クッキーが保持されるため、リクエストごとにリロードカウントが増加します。

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

## HTTPSのテスト {id="https"}

[HTTPSエンドポイント](server-ssl.md)をテストする必要がある場合、[URLBuilder.protocol](client-requests.md#url)プロパティを使用してリクエストを作成するために使用されるプロトコルを変更します。

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

完全な例はこちらから入手できます: [ssl-engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main)。

## WebSocketsのテスト {id="testing-ws"}

クライアントが提供する[WebSockets](client-websockets.topic)プラグインを使用することで、[WebSocketの会話](server-websockets.md)をテストできます。

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

## HttpClientを使用したエンドツーエンドテスト {id="end-to-end"}
テストエンジンとは別に、サーバーアプリケーションのエンドツーエンドテストには、[Ktor HTTPクライアント](client-create-and-configure.md)を使用できます。
以下の例では、HTTPクライアントが`TestServer`にテストリクエストを行います。

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

完全な例については、以下のサンプルを参照してください。
- [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server): テスト対象のサンプルサーバー。
- [e2e](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/e2e): テストサーバーのセットアップのためのヘルパークラスと関数が含まれています。