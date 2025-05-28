[//]: # (title: 타입 안전 라우팅)

<show-structure for="chapter" depth="2"/>
<primary-label ref="server-plugin"/>

<var name="plugin_name" value="Resources"/>
<var name="package_name" value="io.ktor.server.resources"/>
<var name="artifact_name" value="ktor-server-resources"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="resource-routing"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_supported"/>
</tldr>

<link-summary>Resources 플러그인을 사용하면 타입 안전 라우팅을 구현할 수 있습니다.</link-summary>

Ktor는 타입 안전 [라우팅](server-routing.md)을 구현할 수 있는 [Resources](https://api.ktor.io/ktor-shared/ktor-resources/io.ktor.resources/-resources/index.html) 플러그인을 제공합니다. 이를 위해, 타입이 지정된 라우트로 동작할 클래스를 생성하고 `@Resource` 키워드를 사용하여 이 클래스에 어노테이션을 붙여야 합니다. `@Resource` 어노테이션은 kotlinx.serialization 라이브러리에서 제공하는 `@Serializable` 동작을 포함하고 있습니다.

> Ktor 클라이언트는 서버에 [타입이 지정된 요청](client-resources.md)을 수행하는 기능을 제공합니다.

## 의존성 추가 {id="add_dependencies"}

### kotlinx.serialization 추가 {id="add_serialization"}

[리소스 클래스](#resource_classes)가 `@Serializable` 동작을 가져야 하므로, [설정](https://github.com/Kotlin/kotlinx.serialization#setup) 섹션에 설명된 대로 Kotlin serialization 플러그인을 추가해야 합니다.

### %plugin_name% 의존성 추가 {id="add_plugin_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>

## %plugin_name% 설치 {id="install_plugin"}

<include from="lib.topic" element-id="install_plugin"/>

## 리소스 클래스 생성 {id="resource_classes"}

<snippet id="resource_classes_server">

각 리소스 클래스에는 `@Resource` 어노테이션이 있어야 합니다.
아래에서는 단일 경로 세그먼트, 쿼리 및 경로 파라미터 등을 정의하는 여러 리소스 클래스 예제를 살펴보겠습니다.

### 리소스 URL {id="resource_url"}

아래 예제는 `/articles` 경로에 응답하는 리소스를 지정하는 `Articles` 클래스를 정의하는 방법을 보여줍니다.

```kotlin
import io.ktor.resources.*

@Resource("/articles")
class Articles()
```

### 쿼리 파라미터를 포함하는 리소스 {id="resource_query_param"}

아래 `Articles` 클래스는 [쿼리 파라미터](server-requests.md#query_parameters)로 작동하는 `sort` 문자열 프로퍼티를 가지고 있으며, `/articles?sort=new`와 같이 `sort` 쿼리 파라미터를 포함하는 경로에 응답하는 리소스를 정의할 수 있게 합니다.

```kotlin
@Resource("/articles")
class Articles(val sort: String? = "new")
```

### 중첩 클래스를 포함하는 리소스 {id="resource_nested"}

여러 경로 세그먼트를 포함하는 리소스를 생성하기 위해 클래스를 중첩할 수 있습니다. 이 경우 중첩 클래스는 외부 클래스 타입을 가진 프로퍼티를 가져야 합니다.
아래 예제는 `/articles/new` 경로에 응답하는 리소스를 보여줍니다.

```kotlin
@Resource("/articles")
class Articles() {
    @Resource("new")
    class New(val parent: Articles = Articles())
}
```

### 경로 파라미터를 포함하는 리소스 {id="resource_path_param"}

아래 예제는 경로 세그먼트와 일치하며 `id`라는 이름의 파라미터로 캡처하는 [중첩된](#resource_nested) `{id}` 정수 [경로 파라미터](server-routing.md#path_parameter)를 추가하는 방법을 보여줍니다.

```kotlin
@Resource("/articles")
class Articles() {
    @Resource("{id}")
    class Id(val parent: Articles = Articles(), val id: Long)
}
```

예를 들어, 이 리소스는 `/articles/12`에 응답하는 데 사용될 수 있습니다.

</snippet>

### 예제: CRUD 작업을 위한 리소스 {id="example_crud"}

위의 예제들을 요약하고 CRUD 작업을 위한 `Articles` 리소스를 생성해 봅시다.

```kotlin
```
{src="snippets/resource-routing/src/main/kotlin/resourcerouting/Application.kt" include-lines="16-26"}

이 리소스는 모든 아티클을 나열하고, 새 아티클을 게시하며, 편집하는 등 다양한 용도로 사용될 수 있습니다. 다음 장에서 이 리소스에 대한 [라우트 핸들러를 정의하는](#define_route) 방법을 살펴보겠습니다.

> 전체 예제는 다음에서 찾을 수 있습니다: [resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing).

## 라우트 핸들러 정의 {id="define_route"}

타입이 지정된 리소스에 대한 [라우트 핸들러를 정의](server-routing.md#define_route)하려면, 리소스 클래스를 동사 함수(`get`, `post`, `put` 등)에 전달해야 합니다.
예를 들어, 아래 라우트 핸들러는 `/articles` 경로에 응답합니다.

```kotlin
@Resource("/articles")
class Articles()

fun Application.module() {
    install(Resources)
    routing {
        get<Articles> { articles ->
            // Get all articles ...
            call.respondText("List of articles: $articles")
        }
    }
}
```

아래 예제는 [](#example_crud)에서 생성된 `Articles` 리소스에 대한 라우트 핸들러를 정의하는 방법을 보여줍니다. 라우트 핸들러 내에서 `Article`을 파라미터로 접근하여 해당 프로퍼티 값을 얻을 수 있다는 점에 유의하십시오.

```kotlin
```
{src="snippets/resource-routing/src/main/kotlin/resourcerouting/Application.kt" include-lines="30-60,88-89"}

각 엔드포인트에 대한 요청 처리 관련 팁입니다:

- `get<Articles>`

   이 라우트 핸들러는 `sort` 쿼리 파라미터에 따라 정렬된 모든 아티클을 반환하도록 되어 있습니다.
   예를 들어, 이는 모든 아티클을 포함하는 [HTML 페이지](server-responses.md#html) 또는 [JSON 객체](server-responses.md#object)일 수 있습니다.

- `get<Articles.New>`

   이 엔드포인트는 새 아티클을 생성하기 위한 필드를 포함하는 [웹 폼](server-responses.md#html)으로 응답합니다.
- `post<Articles>`

   `post<Articles>` 엔드포인트는 웹 폼을 사용하여 전송된 [파라미터](server-requests.md#form_parameters)를 수신하도록 되어 있습니다.
   Ktor는 또한 `ContentNegotiation` 플러그인을 사용하여 JSON 데이터를 [객체](server-requests.md#objects)로 수신할 수 있도록 합니다.
- `get<Articles.Id>`

   이 라우트 핸들러는 지정된 식별자를 가진 아티클을 반환하도록 되어 있습니다.
   이는 아티클을 보여주는 [HTML 페이지](server-responses.md#html) 또는 아티클 데이터를 포함하는 [JSON 객체](server-responses.md#object)일 수 있습니다.
- `get<Articles.Id.Edit>`

  이 엔드포인트는 기존 아티클을 편집하기 위한 필드를 포함하는 [웹 폼](server-responses.md#html)으로 응답합니다.
- `put<Articles.Id>`

   `post<Articles>` 엔드포인트와 유사하게, `put` 핸들러는 웹 폼을 사용하여 전송된 [폼 파라미터](server-requests.md#form_parameters)를 수신합니다.
- `delete<Articles.Id>`

   이 라우트 핸들러는 지정된 식별자를 가진 아티클을 삭제합니다.

전체 예제는 다음에서 찾을 수 있습니다: [resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing).

## 리소스에서 링크 빌드 {id="resource_links"}

라우팅을 위해 리소스 정의를 사용하는 것 외에도, 링크를 빌드하는 데에도 사용할 수 있습니다.
이는 때때로 _리버스 라우팅_이라고 불립니다.
리소스에서 링크를 빌드하는 것은 이러한 링크를 다음 위치에 추가해야 할 때 유용할 수 있습니다:
[HTML DSL](server-html-dsl.md)로 생성된 HTML 문서 또는 [리다이렉션 응답](server-responses.md#redirect)을 생성해야 할 때.

`Resources` 플러그인은 `Application`을 오버로드된 [href](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-resources/io.ktor.server.resources/href.html) 메서드로 확장하여 `Resource`에서 링크를 생성할 수 있도록 합니다. 예를 들어, 아래 코드 스니펫은 [위에 정의된](#example_crud) `Edit` 리소스에 대한 링크를 생성합니다:

```kotlin
```
{src="snippets/resource-routing/src/main/kotlin/resourcerouting/Application.kt" include-lines="75"}

상위 `Articles` 리소스가 `sort` 쿼리 파라미터를 기본값 `new`로 정의하므로, `link` 변수에는 다음 내용이 포함됩니다:

```
/articles/123/edit?sort=new
```

호스트와 프로토콜을 지정하는 URL을 생성하려면 `URLBuilder`와 함께 `href` 메서드를 제공할 수 있습니다.
이 예제에서 보여주듯이 `URLBuilder`를 사용하여 추가 쿼리 파라미터를 지정할 수도 있습니다:

```kotlin
```
{src="snippets/resource-routing/src/main/kotlin/resourcerouting/Application.kt" include-lines="79-81"}

이어서 `link` 변수에는 다음이 포함됩니다:

```
https://ktor.io/articles?token=123
```

### 예제 {id="example_build_links"}

아래 예제는 리소스에서 빌드된 링크를 HTML 응답에 추가하는 방법을 보여줍니다:

```kotlin
```
{src="snippets/resource-routing/src/main/kotlin/resourcerouting/Application.kt" include-lines="62-87"}

전체 예제는 다음에서 찾을 수 있습니다: [resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing).