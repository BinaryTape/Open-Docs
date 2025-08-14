[//]: # (title: 라우팅)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<link-summary>
라우팅은 서버 애플리케이션에서 들어오는 요청을 처리하는 핵심 플러그인입니다.
</link-summary>

라우팅은 서버 애플리케이션에서 들어오는 요청을 처리하는 Ktor의 핵심 [플러그인](server-plugins.md)입니다. 클라이언트가 특정 URL(예: `/hello`)로 요청을 보낼 때, 라우팅 메커니즘을 통해 이 요청을 어떻게 처리할지 정의할 수 있습니다.

## 라우팅 설치 {id="install_plugin"}

라우팅 플러그인은 다음과 같이 설치할 수 있습니다:

```Kotlin
import io.ktor.server.routing.*

install(RoutingRoot) {
    // ...
}
```

라우팅 플러그인은 모든 애플리케이션에서 매우 흔하게 사용되므로, 라우팅을 더 간단하게 설치할 수 있는 편리한 `routing` 함수가 있습니다. 아래 코드 스니펫에서 `install(RoutingRoot)`는 `routing` 함수로 대체됩니다:

```kotlin
import io.ktor.server.routing.*

routing {
    // ...
}
```

## 라우트 핸들러 정의 {id="define_route"}

라우팅 플러그인을 [설치](#install_plugin)한 후, `routing` 내에서 [route](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.routing/route.html) 함수를 호출하여 라우트를 정의할 수 있습니다:
```kotlin
import io.ktor.server.routing.*
import io.ktor.http.*
import io.ktor.server.response.*

routing {
    route("/hello", HttpMethod.Get) {
        handle {
            call.respondText("Hello")
        }
    }
}
```

Ktor는 라우트 핸들러를 훨씬 더 쉽고 간결하게 정의할 수 있는 일련의 함수를 제공합니다. 예를 들어, 이전 코드를 URL과 요청 처리 코드만 필요한 [get](https://api.ktor.io/ktor-server/ktor-server-core/io.ktor.server.routing/get.html) 함수로 대체할 수 있습니다:

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get("/hello") {
        call.respondText("Hello")
    }
}
```
마찬가지로 Ktor는 `put`, `post`, `head` 등 다른 모든 HTTP 동사에 대한 함수를 제공합니다.

요약하자면, 라우트를 정의하려면 다음 설정을 지정해야 합니다:

*   **HTTP 동사**

    `GET`, `POST`, `PUT` 등과 같은 HTTP 동사를 선택합니다. 가장 편리한 방법은 `get`, `post`, `put` 등과 같은 전용 동사 함수를 사용하는 것입니다.

*   **경로 패턴**

    `/hello`, `/customer/{id}`와 같이 URL 경로를 [매칭](#match_url)하는 데 사용되는 경로 패턴을 지정합니다. 경로 패턴을 `get`/`post`/등의 함수에 직접 전달하거나, `route` 함수를 사용하여 [라우트 핸들러](#multiple_routes)를 그룹화하고 [중첩된 라우트](#nested_routes)를 정의할 수 있습니다.

*   **핸들러**

    [요청](server-requests.md) 및 [응답](server-responses.md)을 처리하는 방법을 지정합니다. 핸들러 내부에서 `ApplicationCall`에 접근하여 클라이언트 요청을 처리하고 응답을 보낼 수 있습니다.

## 경로 패턴 지정 {id="match_url"}

[routing](#define_route) 함수(`route`, `get`, `post` 등)에 전달되는 경로 패턴은 URL의 _경로_ 구성 요소를 매칭하는 데 사용됩니다. 경로는 슬래시 `/` 문자로 구분된 일련의 경로 세그먼트를 포함할 수 있습니다.

> Ktor는 후행 슬래시(trailing slash)가 있는 경로와 없는 경로를 구분합니다. 이 동작은 `IgnoreTrailingSlash` 플러그인을 [설치](server-plugins.md#install)하여 변경할 수 있습니다.

아래는 몇 가지 경로 예시입니다:
*   `/hello`  
    단일 경로 세그먼트를 포함하는 경로입니다.
*   `/order/shipment`  
    여러 경로 세그먼트를 포함하는 경로입니다. 이러한 경로는 [route/get/등](#define_route) 함수에 그대로 전달하거나, 여러 `route` 함수를 [중첩](#multiple_routes)하여 하위 라우트를 구성할 수 있습니다.
*   `/user/{login}`  
    `login` [경로 파라미터](#path_parameter)를 포함하는 경로로, 해당 값은 라우트 핸들러 내부에서 접근할 수 있습니다.
*   `/user/*`  
    모든 경로 세그먼트를 매칭하는 [와일드카드 문자](#wildcard)가 있는 경로입니다.
*   `/user/{...}`  
    URL 경로의 나머지 전체를 매칭하는 [테일카드](#tailcard)가 있는 경로입니다.
*   `/user/{param...}`  
    [테일카드를 포함한 경로 파라미터](#path_parameter_tailcard)를 포함하는 경로입니다.
*   `Regex("/.+/hello")`  
    `/hello`의 마지막 출현까지의 경로 세그먼트를 매칭하는 [정규 표현식](#regular_expression)을 포함하는 경로입니다.

### 와일드카드 {id="wildcard"}
_와일드카드_ (`*`)는 모든 경로 세그먼트를 매칭하며 생략될 수 없습니다. 예를 들어, `/user/*`는 `/user/john`을 매칭하지만, `/user`는 매칭하지 않습니다.

### 테일카드 {id="tailcard"}
_테일카드_ (`{...}`)는 URL 경로의 나머지 전체를 매칭하며, 여러 경로 세그먼트를 포함할 수 있고, 비어 있을 수도 있습니다. 예를 들어, `/user/{...}`는 `/user/john/settings` 뿐만 아니라 `/user`도 매칭합니다.

### 경로 파라미터 {id="path_parameter"}
_경로 파라미터_ (`{param}`)는 경로 세그먼트를 매칭하고 이를 `param`이라는 이름의 파라미터로 캡처합니다. 이 경로 세그먼트는 필수이지만, 물음표를 추가하여 `{param?}`과 같이 선택적으로 만들 수 있습니다. 예를 들어:
*   `/user/{login}`은 `/user/john`을 매칭하지만, `/user`는 매칭하지 않습니다.
*   `/user/{login?}`은 `/user/john` 뿐만 아니라 `/user`도 매칭합니다.
    > 선택적 경로 파라미터 `{param?}`는 경로의 끝에서만 사용할 수 있습니다.
    >
    {type="note"}

라우트 핸들러 내부에서 파라미터 값에 접근하려면 `call.parameters` 속성을 사용합니다. 예를 들어, 아래 코드 스니펫에서 `/user/admin` 경로에 대해 `call.parameters["login"]`은 _admin_을 반환할 것입니다:

> 요청에 쿼리 문자열이 포함된 경우, `call.parameters`는 해당 쿼리 문자열의 파라미터도 포함합니다. 핸들러 내에서 쿼리 문자열과 그 파라미터에 접근하는 방법은 [](server-requests.md#query_parameters)를 참조하세요.

### 테일카드를 포함한 경로 파라미터 {id="path_parameter_tailcard"}

테일카드를 포함한 경로 파라미터 (`{param...}`)는 URL 경로의 나머지 전체를 매칭하고, 각 경로 세그먼트에 대한 여러 값을 `param`을 키로 사용하여 파라미터에 저장합니다. 예를 들어, `/user/{param...}`은 `/user/john/settings`를 매칭합니다.
라우트 핸들러 내부에서 경로 세그먼트의 값에 접근하려면 `call.parameters.getAll("param")`을 사용합니다. 위 예시의 경우, `getAll` 함수는 _john_과 _settings_ 값을 포함하는 배열을 반환할 것입니다.

### 정규 표현식 {id="regular_expression"}

정규 표현식은 `route`, `get`, `post` 등 모든 라우트 핸들러 정의 함수와 함께 사용할 수 있습니다.

> 정규 표현식에 대해 더 자세히 알아보려면 [Kotlin 문서](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/)를 참조하세요.

`/hello`로 끝나는 모든 경로를 매칭하는 라우트를 작성해 보겠습니다.

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get(Regex(".+/hello")) {
        call.respondText("Hello")
    }
}
```
이 라우트 정의를 사용하면 `/foo/hello`, `/bar/baz/hello` 등과 같이 `/hello`로 끝나는 경로로 들어오는 모든 요청이 매칭됩니다.

#### 핸들러에서 경로 부분 접근

정규 표현식에서 명명된 그룹(named groups)은 패턴과 일치하는 문자열의 특정 부분을 캡처하고 이름을 할당하는 방법입니다. `(?<name>pattern)` 구문은 명명된 그룹을 정의하는 데 사용되며, 여기서 `name`은 그룹의 이름이고 `pattern`은 그룹과 일치하는 정규 표현식 패턴입니다.

라우트 함수에서 명명된 그룹을 정의함으로써 경로의 일부를 캡처할 수 있으며, 핸들러 함수에서는 `call.parameters` 객체를 사용하여 캡처된 파라미터에 접근할 수 있습니다.

예를 들어, 정수 식별자 뒤에 `/hello`가 포함된 경로에 대한 요청을 매칭하는 라우트를 정의할 수 있습니다.

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get(Regex("""(?<id>\d+)/hello""")) {
        val id = call.parameters["id"]!!
        call.respondText(id)
    }
}
```
아래 코드에서 `(?<id>\d+)` 명명된 그룹은 요청된 경로에서 정수 식별자 `id`를 캡처하는 데 사용되며, `call.parameters` 속성은 핸들러 함수에서 캡처된 `id` 파라미터에 접근하는 데 사용됩니다.

익명 그룹(Unnamed groups)은 정규 표현식 라우트 핸들러 내에서 접근할 수 없지만, 경로를 매칭하는 데 사용할 수 있습니다. 예를 들어, `hello/world` 경로는 매칭되지만 `hello/World`는 매칭되지 않습니다:

```kotlin
import io.ktor.server.routing.*
import io.ktor.server.response.*

routing {
    get(Regex("hello/([a-z]+)")) {
        call.respondText("Hello")
    }
}
```
또한 전체 경로 세그먼트는 정규 표현식에 의해 소비되어야 합니다. 예를 들어, 경로 패턴 `get(Regex("[a-z]+"))`는 `"hello1"` 경로를 매칭하지 않지만, `hello/1` 경로의 `hello` 부분을 매칭하고 `/1`을 다음 라우트를 위해 남겨둡니다.

## 여러 라우트 핸들러 정의 {id="multiple_routes"}

### 동사(verb) 함수별로 라우트 그룹화 {id="group_by_verb"}

물론 모든 애플리케이션에서 여러 라우트 핸들러를 정의하려면 `routing` 함수에 추가하기만 하면 됩니다:

```kotlin
routing {
    get("/customer/{id}") {

    }
    post("/customer") {

    }
    get("/order") {

    }
    get("/order/{id}") {
    
    }
}
```

이 경우, 각 라우트는 자체 함수를 가지며 특정 엔드포인트와 HTTP 동사에 응답합니다.

### 경로별로 라우트 그룹화 {id="group_by_path"}

다른 방법으로는 경로별로 그룹화하는 것인데, `route` 함수를 사용하여 경로를 정의한 다음 해당 경로에 대한 동사를 중첩 함수로 배치하는 것입니다:

```kotlin
routing {
    route("/customer") {
        get {

        }
        post {

        }
    }
    route("/order") {
        get {

        }
        get("/{id}") {

        }
    }
}
```

### 중첩 라우트 {id="nested_routes"}

그룹화를 어떻게 하든 관계없이, Ktor는 `route` 함수의 파라미터로 하위 라우트(sub-routes)를 가질 수 있도록 허용합니다. 이는 다른 리소스의 논리적 하위 리소스들을 정의하는 데 유용할 수 있습니다.
다음 예시는 `/order/shipment`에 대한 `GET` 및 `POST` 요청에 응답하는 방법을 보여줍니다:

```kotlin
routing {
    route("/order") {
        route("/shipment") {
            get {
                
            }
            post {
                
            }
        }
    }
}
```

따라서 각 `route` 호출은 별도의 경로 세그먼트를 생성합니다.

## 라우트 확장 함수 {id="route_extension_function"}

일반적인 패턴은 `Route` 타입에 확장 함수를 사용하여 실제 라우트를 정의하는 것입니다. 이를 통해 동사에 쉽게 접근하고 모든 라우트가 단일 라우팅 함수에 있는 혼란을 줄일 수 있습니다. 이 패턴은 라우트를 그룹화하는 방식과 관계없이 적용할 수 있습니다. 따라서 첫 번째 예시는 더 깔끔하게 표현될 수 있습니다:

```kotlin
routing {
    listOrdersRoute()
    getOrderRoute()
    totalizeOrderRoute()
}

fun Route.listOrdersRoute() {
    get("/order") {

    }
}

fun Route.getOrderRoute() {
    get("/order/{id}") {
        
    }
}

fun Route.totalizeOrderRoute() {
    get("/order/{id}/total") {
        
    }
}
```

이 접근 방식을 보여주는 전체 예시는 [legacy-interactive-website](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/legacy-interactive-website)를 참조하세요.

> 애플리케이션의 유지보수성을 고려하여 확장하려면 특정 [구조화 패턴](server-application-structure.md)을 따르는 것이 좋습니다.

## 라우트 트레이스 {id="trace_routes"}

[로깅](server-logging.md)이 구성되면 Ktor는 일부 라우트가 실행되지 않는 이유를 파악하는 데 도움이 되는 라우트 트레이싱을 활성화합니다.
예를 들어, 애플리케이션을 [실행](server-run.md)하고 지정된 엔드포인트로 요청을 보내면 애플리케이션의 출력은 다음과 같을 수 있습니다:

```Console
TRACE Application - Trace for [missing-page]
/, segment:0 -> SUCCESS @ /
  /, segment:0 -> SUCCESS @ /
    /(method:GET), segment:0 -> FAILURE "Not all segments matched" @ /(method:GET)
Matched routes:
  No results
Route resolve result:
  FAILURE "No matched subtrees found" @ /
```

> [네이티브 서버](server-native.md)에서 라우트 트레이싱을 활성화하려면, 애플리케이션 [실행](server-run.md) 시 `KTOR_LOG_LEVEL` 환경 변수에 _TRACE_ 값을 전달하세요.

```
```