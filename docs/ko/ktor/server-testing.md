[//]: # (title: Ktor 서버에서 테스트하기)

<show-structure for="chapter" depth="3"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:ktor-server-test-host</code>, <code>org.jetbrains.kotlin:kotlin-test</code>
</p>
</tldr>

<link-summary>
특별한 테스트 엔진을 사용하여 서버 애플리케이션을 테스트하는 방법을 알아보세요.
</link-summary>

Ktor는 웹 서버를 생성하거나 소켓에 바인딩하거나 실제 HTTP 요청을 보내지 않는 특별한 테스트 엔진을 제공합니다. 대신, 내부 메커니즘에 직접 연결하여 애플리케이션 호출을 직접 처리합니다. 이는 테스트를 위해 완전한 웹 서버를 실행하는 것보다 더 빠른 테스트 실행을 가능하게 합니다. 

## 의존성 추가 {id="add-dependencies"}
Ktor 서버 애플리케이션을 테스트하려면 빌드 스크립트에 다음 아티팩트를 포함해야 합니다.
* `ktor-server-test-host` 의존성 추가:

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

* 테스트에서 어설션(assertion)을 수행하기 위한 유틸리티 함수 세트를 제공하는 `kotlin-test` 의존성 추가:

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

> [네이티브 서버](server-native.md#add-dependencies)를 테스트하려면 `nativeTest` 소스 세트에 테스트 아티팩트를 추가하세요.

  

## 테스트 개요 {id="overview"}

테스트 엔진을 사용하려면 아래 단계를 따르세요:
1. JUnit 테스트 클래스와 테스트 함수를 생성합니다.
2. [testApplication](https://api.ktor.io/ktor-server/ktor-server-test-host/io.ktor.server.testing/test-application.html) 함수를 사용하여 로컬에서 실행되는 구성된 테스트 애플리케이션 인스턴스를 설정합니다.
3. 테스트 애플리케이션 내에서 [Ktor HTTP 클라이언트](client-create-and-configure.md) 인스턴스를 사용하여 서버에 요청을 보내고, 응답을 받고, 어설션(assertion)을 수행합니다.

아래 코드는 `/` 경로로 전송된 GET 요청을 수락하고 일반 텍스트 응답을 반환하는 가장 간단한 Ktor 애플리케이션을 테스트하는 방법을 보여줍니다.

<Tabs>
<TabItem title="테스트">

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

<TabItem title="애플리케이션">

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

실행 가능한 코드 예제는 다음에서 확인할 수 있습니다: [engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/engine-main).

## 애플리케이션 테스트 {id="test-app"}

### 1단계: 테스트 애플리케이션 구성 {id="configure-test-app"}

테스트 애플리케이션 구성에는 다음 단계가 포함될 수 있습니다.
- [애플리케이션 모듈 추가](#add-modules)
- [(선택 사항) 라우트 추가](#add-routing)
- [(선택 사항) 환경 사용자 정의](#environment)
- [(선택 사항) 외부 서비스 모의(Mock)](#external-services)

> 기본적으로 구성된 테스트 애플리케이션은 [첫 번째 클라이언트 호출](#make-request) 시 시작됩니다.
> 선택적으로 `startApplication` 함수를 호출하여 애플리케이션을 수동으로 시작할 수 있습니다.
> 이는 애플리케이션의 [라이프사이클 이벤트](server-events.md#predefined-events)를 테스트해야 할 때 유용할 수 있습니다.

#### 애플리케이션 모듈 추가 {id="add-modules"}

애플리케이션을 테스트하려면 해당 [모듈](server-modules.md)이 `testApplication`에 로드되어야 합니다. 이를 위해 [명시적으로 모듈을 로드](#explicit-module-loading)하거나, 구성 파일에서 로드하도록 [환경을 구성](#configure-env)해야 합니다.

##### 모듈 명시적 로드 {id="explicit-module-loading"}

테스트 애플리케이션에 모듈을 수동으로 추가하려면 `application` 함수를 사용하세요:

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

#### 구성 파일에서 모듈 로드 {id="configure-env"}

구성 파일에서 모듈을 로드하려면 `environment` 함수를 사용하여 테스트를 위한 구성 파일을 지정하세요:

```kotlin
@Test
fun testHello() = testApplication {
    environment {
        config = ApplicationConfig("application-custom.conf")
    }
}
```

이 방법은 테스트 중에 다른 환경을 모방하거나 사용자 정의 구성 설정을 사용해야 할 때 유용합니다.

> `application` 블록 내에서 `Application` 인스턴스에 접근할 수도 있습니다.

#### 라우트 추가 {id="add-routing"}

`routing` 함수를 사용하여 테스트 애플리케이션에 라우트를 추가할 수 있습니다.
이는 다음 사용 사례에서 편리할 수 있습니다.
- 테스트 애플리케이션에 [모듈을 추가](#add-modules)하는 대신, 테스트해야 할 [특정 라우트](server-routing.md#route_extension_function)를 추가할 수 있습니다. 
- 테스트 애플리케이션에서만 필요한 라우트를 추가할 수 있습니다. 아래 예시는 테스트에서 사용자 [세션](server-sessions.md)을 초기화하는 데 사용되는 `/login-test` 엔드포인트를 추가하는 방법을 보여줍니다.
   ```kotlin
   fun testHello() = testApplication {
       routing {
           get("/login-test") {
               call.sessions.set(UserSession("xyzABC123","abc123"))
           }
       }
   }
   ```
   
   전체 예제와 테스트는 다음에서 확인할 수 있습니다: [auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google).

#### 환경 사용자 정의 {id="environment"}

테스트 애플리케이션을 위한 사용자 정의 환경을 구축하려면 `environment` 함수를 사용하세요.
예를 들어, 테스트를 위한 사용자 정의 구성을 사용하려면 `test/resources` 폴더에 구성 파일을 생성하고 `config` 속성을 사용하여 로드할 수 있습니다.

```kotlin
@Test
fun testHello() = testApplication {
    environment {
        config = ApplicationConfig("application-custom.conf")
    }
}
```

구성 속성을 지정하는 또 다른 방법은 [MapApplicationConfig](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.config/-map-application-config/index.html)를 사용하는 것입니다. 이는 애플리케이션이 시작되기 전에 애플리케이션 구성에 접근하려는 경우 유용할 수 있습니다. 아래 예시는 `config` 속성을 사용하여 `MapApplicationConfig`를 `testApplication` 함수에 전달하는 방법을 보여줍니다.

```kotlin
@Test
fun testDevEnvironment() = testApplication {
    environment {
        config = MapApplicationConfig("ktor.environment" to "dev")
    }
}
```

#### 외부 서비스 모의(Mock) {id="external-services"}

Ktor는 `externalServices` 함수를 사용하여 외부 서비스를 모의(Mock)할 수 있도록 합니다.
이 함수 내에서 두 개의 파라미터를 받는 `hosts` 함수를 호출해야 합니다.
- `hosts` 파라미터는 외부 서비스의 URL을 받습니다.
- `block` 파라미터는 외부 서비스의 모의 역할을 하는 `Application`을 구성할 수 있도록 합니다.
   이 `Application`에 대한 라우팅을 구성하고 플러그인을 설치할 수 있습니다.

아래 샘플은 `externalServices`를 사용하여 Google API에서 반환된 JSON 응답을 시뮬레이션하는 방법을 보여줍니다.

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

전체 예제와 테스트는 다음에서 확인할 수 있습니다: [auth-oauth-google](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/auth-oauth-google).

### 2단계: (선택 사항) 클라이언트 구성 {id="configure-client"}

`testApplication`은 `client` 속성을 사용하여 기본 구성이 적용된 HTTP 클라이언트에 대한 접근을 제공합니다. 
클라이언트를 사용자 정의하고 추가 플러그인을 설치해야 하는 경우 `createClient` 함수를 사용할 수 있습니다. 예를 들어, 테스트 POST/PUT 요청에서 [JSON 데이터](#json-data)를 보내려면 [ContentNegotiation](client-serialization.md) 플러그인을 설치할 수 있습니다.
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

### 3단계: 요청하기 {id="make-request"}

애플리케이션을 테스트하려면 [구성된 클라이언트](#configure-client)를 사용하여 [요청](client-requests.md)을 보내고 [응답](client-responses.md)을 받으세요. [아래 예제](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)는 `POST` 요청을 처리하는 `/customer` 엔드포인트를 테스트하는 방법을 보여줍니다.

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

### 4단계: 결과 어설션(Assert) {id="assert"}

[응답](#make-request)을 받은 후, [kotlin.test](https://kotlinlang.org/api/latest/kotlin.test/) 라이브러리에서 제공하는 어설션(assertion)을 사용하여 결과를 확인할 수 있습니다.

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

## POST/PUT 요청 테스트 {id="test-post-put"}

### 폼 데이터 전송 {id="form-data"}

테스트 POST/PUT 요청에서 폼 데이터를 보내려면 `Content-Type` 헤더를 설정하고 요청 본문을 지정해야 합니다. 이를 위해 각각 [header](client-requests.md#headers) 및 [setBody](client-requests.md#body) 함수를 사용할 수 있습니다. 아래 예시는 `x-www-form-urlencoded`와 `multipart/form-data` 타입 모두를 사용하여 폼 데이터를 보내는 방법을 보여줍니다.

#### x-www-form-urlencoded {id="x-www-form-urlencoded"}

[post-form-parameters](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/post-form-parameters) 예제의 아래 테스트는 `x-www-form-urlencoded` 콘텐츠 타입을 사용하여 전송된 폼 파라미터로 테스트 요청을 만드는 방법을 보여줍니다. 키/값 쌍 목록에서 폼 파라미터를 인코딩하는 데 [formUrlEncode](https://api.ktor.io/ktor-http/io.ktor.http/form-url-encode.html) 함수가 사용된다는 점에 유의하세요.

<Tabs>
<TabItem title="테스트">

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

<TabItem title="애플리케이션">

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

아래 코드는 `multipart/form-data`를 구축하고 파일 업로드를 테스트하는 방법을 보여줍니다. 전체 예제는 다음에서 확인할 수 있습니다: [upload-file](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/upload-file).

<Tabs>
<TabItem title="테스트">

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

<TabItem title="애플리케이션">

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

### JSON 데이터 전송 {id="json-data"}

테스트 POST/PUT 요청에서 JSON 데이터를 보내려면, 새로운 클라이언트를 생성하고 특정 형식으로 콘텐츠를 직렬화/역직렬화할 수 있도록 해주는 [ContentNegotiation](client-serialization.md) 플러그인을 설치해야 합니다. 요청 내부에서는 `contentType` 함수를 사용하여 `Content-Type` 헤더를 지정하고, [setBody](client-requests.md#body)를 사용하여 요청 본문을 지정할 수 있습니다. [아래 예제](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx)는 `POST` 요청을 처리하는 `/customer` 엔드포인트를 테스트하는 방법을 보여줍니다.

<Tabs>
<TabItem title="테스트">

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

<TabItem title="애플리케이션">

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

## 테스트 중 쿠키 유지 {id="preserving-cookies"}

테스트 시 요청 간에 쿠키를 유지해야 하는 경우, 새 클라이언트를 생성하고 [HttpCookies](client-cookies.md) 플러그인을 설치해야 합니다. [session-cookie-client](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/session-cookie-client) 예제의 아래 테스트에서는 쿠키가 유지되므로 각 요청 후 재로드 횟수가 증가합니다.

<Tabs>
<TabItem title="테스트">

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

<TabItem title="애플리케이션">

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

## HTTPS 테스트 {id="https"}

[HTTPS 엔드포인트](server-ssl.md)를 테스트해야 하는 경우, [URLBuilder.protocol](client-requests.md#url) 속성을 사용하여 요청을 만드는 데 사용되는 프로토콜을 변경하세요:

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

전체 예제는 다음에서 확인할 수 있습니다: [ssl-engine-main](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/ssl-engine-main).

## WebSocket 테스트 {id="testing-ws"}

클라이언트가 제공하는 [WebSockets](client-websockets.topic) 플러그인을 사용하여 [WebSocket 대화](server-websockets.md)를 테스트할 수 있습니다.

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

## HttpClient를 사용한 엔드 투 엔드 테스트 {id="end-to-end"}
테스트 엔진 외에도 [Ktor HTTP 클라이언트](client-create-and-configure.md)를 사용하여 서버 애플리케이션의 엔드 투 엔드(end-to-end) 테스트를 수행할 수 있습니다.
아래 예제에서 HTTP 클라이언트는 `TestServer`에 테스트 요청을 보냅니다.

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

전체 예제는 다음 샘플을 참조하세요:
- [embedded-server](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/embedded-server): 테스트할 샘플 서버입니다.
- [e2e](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/e2e): 테스트 서버 설정을 위한 헬퍼 클래스 및 함수를 포함합니다.