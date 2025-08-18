[//]: # (title: 응답 전송)

<show-structure for="chapter" depth="2"/>

<link-summary>다양한 유형의 응답을 전송하는 방법을 알아보세요.</link-summary>

Ktor를 사용하면 수신되는 [요청](server-requests.md)을 처리하고 [경로 핸들러](server-routing.md#define_route) 내에서 응답을 전송할 수 있습니다. 일반 텍스트, HTML 문서 및 템플릿, 직렬화된 데이터 객체 등 다양한 유형의 응답을 전송할 수 있습니다. 각 응답에 대해 콘텐츠 유형, 헤더, 쿠키 등 다양한 [응답 매개변수](#parameters)를 구성할 수도 있습니다.

경로 핸들러 내에서 응답 작업을 위해 다음 API를 사용할 수 있습니다:
* [call.respondText](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-text.html), [call.respondHtml](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html.html) 등과 같이 [특정 콘텐츠 유형 전송](#payload)을 목표로 하는 함수 세트.
* 응답 내부에 [모든 데이터 전송](#payload)을 허용하는 [call.respond](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond.html) 함수. 예를 들어, [ContentNegotiation](server-serialization.md) 플러그인이 활성화된 경우 특정 형식으로 직렬화된 데이터 객체를 전송할 수 있습니다.
* [응답 매개변수](#parameters)에 대한 접근을 제공하고 상태 코드를 설정하고, 헤더를 추가하고, 쿠키를 구성할 수 있는 [ApplicationResponse](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/-application-response/index.html) 객체를 반환하는 [call.response](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.application/-application-call/response.html) 프로퍼티.
* [call.respondRedirect](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-redirect.html)는 리디렉션을 추가하는 기능을 제공합니다.

## 응답 페이로드 설정 {id="payload"}
### 일반 텍스트 {id="plain-text"}
응답에서 일반 텍스트를 전송하려면 [call.respondText](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-text.html) 함수를 사용합니다.
```kotlin
get("/") {
    call.respondText("Hello, world!")
}
```

### HTML {id="html"}
Ktor는 클라이언트에 HTML 응답을 전송하는 두 가지 주요 방법을 제공합니다:
* Kotlin HTML DSL을 사용하여 HTML을 빌드합니다.
* FreeMarker, Velocity 등과 같은 JVM 템플릿 엔진을 사용합니다.

Kotlin DSL을 사용하여 빌드된 HTML을 전송하려면 [call.respondHtml](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-html-builder/io.ktor.server.html/respond-html.html) 함수를 사용합니다:
```kotlin
routing {
    get("/") {
        val name = "Ktor"
        call.respondHtml(HttpStatusCode.OK) {
            head {
                title {
                    +name
                }
            }
            body {
                h1 {
                    +"Hello from $name!"
                }
            }
        }
    }
}
```

응답으로 템플릿을 전송하려면 특정 콘텐츠와 함께 [call.respond](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond.html) 함수를 호출합니다...
```kotlin
get("/index") {
    val sampleUser = User(1, "John")
    call.respond(FreeMarkerContent("index.ftl", mapOf("user" to sampleUser)))
}
```

... 또는 적절한 [call.respondTemplate](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-freemarker/io.ktor.server.freemarker/respond-template.html) 함수를 사용합니다:
```kotlin
get("/index") {
    val sampleUser = User(1, "John")
    call.respondTemplate("index.ftl", mapOf("user" to sampleUser))
}
```
자세한 내용은 [템플릿](server-templating.md) 도움말 섹션에서 확인할 수 있습니다.

### 객체 {id="object"}
Ktor에서 데이터 객체의 직렬화를 활성화하려면 [ContentNegotiation](server-serialization.md) 플러그인을 설치하고 필요한 컨버터(예: JSON)를 등록해야 합니다. 그런 다음 [call.respond](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond.html) 함수를 사용하여 응답으로 데이터 객체를 전달할 수 있습니다:

```kotlin
routing {
    get("/customer/{id}") {
        val id: Int by call.parameters
        val customer: Customer = customerStorage.find { it.id == id }!!
        call.respond(customer)
```

전체 예제는 여기에서 찾을 수 있습니다: [json-kotlinx](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/json-kotlinx).

[//]: # (TODO: Check link for LocalPathFile)

### 파일 {id="file"}

클라이언트에 파일 콘텐츠로 응답하려면 두 가지 옵션이 있습니다:

- `File` 리소스의 경우, [call.respondFile](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-file.html) 함수를 사용합니다.
- `Path` 리소스의 경우, [LocalPathContent](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.http.content/-local-path-content/index.html) 클래스와 함께 `call.respond()` 함수를 사용합니다.

아래 코드 샘플은 응답으로 지정된 파일을 전송하고 `Content-Disposition` [헤더](#headers)를 추가하여 이 파일을 다운로드 가능하도록 만드는 방법을 보여줍니다:

```kotlin
import io.ktor.http.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.plugins.autohead.*
import io.ktor.server.plugins.partialcontent.*
import io.ktor.server.response.*
import io.ktor.server.routing.*
import java.io.File
import java.nio.file.Path

fun Application.main() {
    install(PartialContent)
    install(AutoHeadResponse)
    routing {
        get("/download") {
            val file = File("files/ktor_logo.png")
            call.response.header(
                HttpHeaders.ContentDisposition,
                ContentDisposition.Attachment.withParameter(ContentDisposition.Parameters.FileName, "ktor_logo.png")
                    .toString()
            )
            call.respondFile(file)
        }
        get("/downloadFromPath") {
            val filePath = Path.of("files/file.txt")
            call.response.header(
                HttpHeaders.ContentDisposition,
                ContentDisposition.Attachment.withParameter(ContentDisposition.Parameters.FileName, "file.txt")
                    .toString()
            )
            call.respond(LocalPathContent(filePath))
        }
    }
```

이 샘플에는 두 개의 플러그인이 설치되어 있습니다:
- [PartialContent](server-partial-content.md)는 서버가 `Range` 헤더가 있는 요청에 응답하고 콘텐츠의 일부만 전송할 수 있도록 합니다.
- [AutoHeadResponse](server-autoheadresponse.md)는 `GET`이 정의된 모든 경로에 대해 `HEAD` 요청에 자동으로 응답하는 기능을 제공합니다. 이를 통해 클라이언트 애플리케이션은 `Content-Length` 헤더 값을 읽어 파일 크기를 결정할 수 있습니다.

전체 코드 샘플은 [download-file](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/download-file)을 참조하세요.

### 원시 페이로드 {id="raw"}
원시 본문 페이로드를 전송해야 하는 경우 [call.respondBytes](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-bytes.html) 함수를 사용합니다.

## 응답 매개변수 설정 {id="parameters"}
### 상태 코드 {id="status"}
응답에 대한 상태 코드를 설정하려면 [ApplicationResponse.status](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/-application-response/status.html)를 호출합니다. 미리 정의된 상태 코드 값을 전달하거나...
```kotlin
get("/") {
    call.response.status(HttpStatusCode.OK)
}
```
... 사용자 지정 상태 코드를 지정할 수 있습니다:
```kotlin
get("/") {
    call.response.status(HttpStatusCode(418, "I'm a tea pot"))
}
```

[페이로드](#payload) 전송 함수에는 상태 코드를 지정하기 위한 오버로드가 있습니다.

### 콘텐츠 유형 {id="content-type"}
[ContentNegotiation](server-serialization.md) 플러그인이 설치되어 있으면 Ktor는 [응답](#payload)에 대한 콘텐츠 유형을 자동으로 선택합니다. 필요한 경우 해당 매개변수를 전달하여 콘텐츠 유형을 수동으로 지정할 수 있습니다. 예를 들어, 아래 코드 스니펫의 `call.respondText` 함수는 `ContentType.Text.Plain`을 매개변수로 받습니다:
```kotlin
get("/") {
    call.respondText("Hello, world!", ContentType.Text.Plain, HttpStatusCode.OK)
}
```

### 헤더 {id="headers"}
응답에서 특정 헤더를 전송하는 여러 가지 방법이 있습니다:
* [ApplicationResponse.headers](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/-application-response/headers.html) 컬렉션에 헤더를 추가합니다:
   ```kotlin
   get("/") {
       call.response.headers.append(HttpHeaders.ETag, "7c876b7e")
   }
   ```
  
* [ApplicationResponse.header](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/header.html) 함수를 호출합니다:
   ```kotlin
   get("/") {
       call.response.header(HttpHeaders.ETag, "7c876b7e")
   }
   ```
  
* `ApplicationResponse.etag`, `ApplicationResponse.link` 등과 같이 특정 헤더를 지정하는 데 사용되는 함수를 사용합니다:
   ```kotlin
   get("/") {
       call.response.etag("7c876b7e")
   }
   ```
  
* 사용자 지정 헤더를 추가하려면 위에서 언급한 함수에 문자열 값으로 이름을 전달합니다 (예시):
   ```kotlin
   get("/") {
       call.response.header("Custom-Header", "Some value")
   }
   ```

> 각 응답에 표준 `Server` 및 `Date` 헤더를 추가하려면 [DefaultHeaders](server-default-headers.md) 플러그인을 설치하세요.
>
{type="tip"}

### 쿠키 {id="cookies"}
응답으로 전송되는 쿠키를 구성하려면 [ApplicationResponse.cookies](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/-application-response/cookies.html) 프로퍼티를 사용합니다:
```kotlin
get("/") {
    call.response.cookies.append("yummy_cookie", "choco")
}
```
Ktor는 쿠키를 사용하여 세션을 처리하는 기능도 제공합니다. 자세한 내용은 [세션](server-sessions.md) 섹션에서 확인할 수 있습니다.

## 리디렉션 {id="redirect"}
리디렉션 응답을 생성하려면 [respondRedirect](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.response/respond-redirect.html) 함수를 호출합니다:
```kotlin
get("/") {
    call.respondRedirect("/moved", permanent = true)
}

get("/moved") {
    call.respondText("Moved content")
}