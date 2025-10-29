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
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor는 Kotlin/Native를 지원하며 추가 런타임이나 가상 머신 없이 서버를 실행할 수 있습니다.">네이티브 서버</Links> 지원</b>: ✅
</p>
</tldr>

<link-summary>Resources 플러그인을 사용하면 타입 안전 라우팅을 구현할 수 있습니다.</link-summary>

Ktor는 타입 안전 [라우팅](server-routing.md)을 구현할 수 있도록 [Resources](https://api.ktor.io/ktor-resources/io.ktor.resources/-resources/index.html) 플러그인을 제공합니다. 이를 위해 타입이 지정된 라우트 역할을 할 클래스를 생성하고, `@Resource` 키워드를 사용하여 이 클래스에 어노테이션을 달아야 합니다. `@Resource` 어노테이션은 kotlinx.serialization 라이브러리에서 제공하는 `@Serializable` 동작을 포함하고 있습니다.

> Ktor 클라이언트는 서버에 [타입이 지정된 요청](client-resources.md)을 수행하는 기능을 제공합니다.

## 의존성 추가 {id="add_dependencies"}

### kotlinx.serialization 추가 {id="add_serialization"}

[리소스 클래스](#resource_classes)가 `@Serializable` 동작을 가져야 하므로, [설정 (Setup)](https://github.com/Kotlin/kotlinx.serialization#setup) 섹션에 설명된 대로 Kotlin 직렬화 플러그인을 추가해야 합니다.

### %plugin_name% 의존성 추가 {id="add_plugin_dependencies"}

<p>
    <code>%plugin_name%</code>을(를) 사용하려면 빌드 스크립트에 <code>%artifact_name%</code> 아티팩트를 포함해야 합니다.
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

## %plugin_name% 설치 {id="install_plugin"}

<p>
    애플리케이션에 <code>%plugin_name%</code> 플러그인을 <a href="#install">설치</a>하려면,
    지정된 <Links href="/ktor/server-modules" summary="모듈을 사용하면 라우트를 그룹화하여 애플리케이션을 구조화할 수 있습니다.">모듈</Links> 내의 <code>install</code> 함수에 전달하세요.
    다음 코드 스니펫은 <code>%plugin_name%</code>을(를) 설치하는 방법을 보여줍니다...
</p>
<list>
    <li>
        ... <code>embeddedServer</code> 함수 호출 내에서.
    </li>
    <li>
        ... <code>Application</code> 클래스의 확장 함수인 명시적으로 정의된 <code>module</code> 내에서.
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

## 리소스 클래스 생성 {id="resource_classes"}

<snippet id="resource_classes_server">

각 리소스 클래스는 `@Resource` 어노테이션을 가져야 합니다.
아래에서 단일 경로 세그먼트, 쿼리 및 경로 파라미터 등을 정의하는 몇 가지 리소스 클래스 예시를 살펴보겠습니다.

### 리소스 URL {id="resource_url"}

아래 예시는 `/articles` 경로에 응답하는 리소스를 지정하는 `Articles` 클래스를 정의하는 방법을 보여줍니다.

```kotlin
import io.ktor.resources.*

@Resource("/articles")
class Articles()
```

### 쿼리 파라미터가 있는 리소스 {id="resource_query_param"}

아래 `Articles` 클래스에는 [쿼리 파라미터](server-requests.md#query_parameters) 역할을 하는 `sort` 문자열 프로퍼티가 있으며, 이를 통해 `sort` 쿼리 파라미터가 있는 다음 경로(`/articles?sort=new`)에 응답하는 리소스를 정의할 수 있습니다.

```kotlin
@Resource("/articles")
class Articles(val sort: String? = "new")
```

### 중첩 클래스가 있는 리소스 {id="resource_nested"}

여러 경로 세그먼트를 포함하는 리소스를 생성하기 위해 클래스를 중첩할 수 있습니다. 이 경우 중첩 클래스는 외부 클래스 타입을 가진 프로퍼티를 가져야 한다는 점에 유의하세요.
아래 예시는 `/articles/new` 경로에 응답하는 리소스를 보여줍니다.

```kotlin
@Resource("/articles")
class Articles() {
    @Resource("new")
    class New(val parent: Articles = Articles())
}
```

### 경로 파라미터가 있는 리소스 {id="resource_path_param"}

아래 예시는 경로 세그먼트와 일치하며 `id`라는 이름으로 캡처되는 [중첩된](#resource_nested) `{id}` 정수 [경로 파라미터](server-routing.md#path_parameter)를 추가하는 방법을 보여줍니다.

```kotlin
@Resource("/articles")
class Articles() {
    @Resource("{id}")
    class Id(val parent: Articles = Articles(), val id: Long)
}
```

예를 들어, 이 리소스는 `/articles/12`에 응답하는 데 사용될 수 있습니다.

</snippet>

### 예시: CRUD 작업을 위한 리소스 {id="example_crud"}

위 예시들을 종합하여 CRUD 작업을 위한 `Articles` 리소스를 생성해 보겠습니다.

```kotlin
@Resource("/articles")
class Articles(val sort: String? = "new") {
    @Resource("new")
    class New(val parent: Articles = Articles())

    @Resource("{id}")
    class Id(val parent: Articles = Articles(), val id: Long) {
        @Resource("edit")
        class Edit(val parent: Id)
    }
}
```

이 리소스는 모든 아티클을 나열하고, 새 아티클을 게시하고, 편집하는 등에 사용될 수 있습니다. 다음 장에서 이 리소스에 대한 [라우트 핸들러를 정의하는](#define_route) 방법을 살펴보겠습니다.

> 전체 예시는 여기에서 확인할 수 있습니다: [resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing).

## 라우트 핸들러 정의 {id="define_route"}

타입이 지정된 리소스에 대한 [라우트 핸들러](server-routing.md#define_route)를 정의하려면, 리소스 클래스를 동사 함수(`get`, `post`, `put` 등)에 전달해야 합니다.
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

아래 예시는 [예시: CRUD 작업을 위한 리소스](#example_crud)에서 생성된 `Articles` 리소스에 대한 라우트 핸들러를 정의하는 방법을 보여줍니다. 라우트 핸들러 내에서 `Article`을(를) 파라미터로 접근하고 해당 프로퍼티 값을 얻을 수 있다는 점에 유의하세요.

```kotlin
fun Application.module() {
    install(Resources)
    routing {
        get<Articles> { article ->
            // Get all articles ...
            call.respondText("List of articles sorted starting from ${article.sort}")
        }
        get<Articles.New> {
            // Show a page with fields for creating a new article ...
            call.respondText("Create a new article")
        }
        post<Articles> {
            // Save an article ...
            call.respondText("An article is saved", status = HttpStatusCode.Created)
        }
        get<Articles.Id> { article ->
            // Show an article with id ${article.id} ...
            call.respondText("An article with id ${article.id}", status = HttpStatusCode.OK)
        }
        get<Articles.Id.Edit> { article ->
            // Show a page with fields for editing an article ...
            call.respondText("Edit an article with id ${article.parent.id}", status = HttpStatusCode.OK)
        }
        put<Articles.Id> { article ->
            // Update an article ...
            call.respondText("An article with id ${article.id} updated", status = HttpStatusCode.OK)
        }
        delete<Articles.Id> { article ->
            // Delete an article ...
            call.respondText("An article with id ${article.id} deleted", status = HttpStatusCode.OK)
        }
    }
}
```

각 엔드포인트에 대한 요청 처리 팁은 다음과 같습니다:

- `get<Articles>`

   이 라우트 핸들러는 `sort` 쿼리 파라미터에 따라 정렬된 모든 아티클을 반환해야 합니다.
   예를 들어, 이는 모든 아티클이 포함된 [HTML 페이지](server-responses.md#html) 또는 [JSON 객체](server-responses.md#object)일 수 있습니다.

- `get<Articles.New>`

   이 엔드포인트는 새 아티클 생성을 위한 필드가 포함된 [웹 폼](server-responses.md#html)으로 응답합니다.
- `post<Articles>`

   `post<Articles>` 엔드포인트는 웹 폼을 사용하여 전송된 [파라미터](server-requests.md#form_parameters)를 수신하도록 되어 있습니다.
   Ktor는 또한 `ContentNegotiation` 플러그인을 사용하여 JSON 데이터를 [객체](server-requests.md#objects)로 수신할 수 있도록 합니다.
- `get<Articles.Id>`

   이 라우트 핸들러는 지정된 식별자를 가진 아티클을 반환해야 합니다.
   이는 아티클을 보여주는 [HTML 페이지](server-responses.md#html)이거나 아티클 데이터가 포함된 [JSON 객체](server-responses.md#object)일 수 있습니다.
- `get<Articles.Id.Edit>`

  이 엔드포인트는 기존 아티클 편집을 위한 필드가 포함된 [웹 폼](server-responses.md#html)으로 응답합니다.
- `put<Articles.Id>`

   `post<Articles>` 엔드포인트와 유사하게, `put` 핸들러는 웹 폼을 사용하여 전송된 [폼 파라미터](server-requests.md#form_parameters)를 수신합니다.
- `delete<Articles.Id>`

   이 라우트 핸들러는 지정된 식별자를 가진 아티클을 삭제합니다.

전체 예시는 여기에서 확인할 수 있습니다: [resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing).

## 리소스로부터 링크 생성 {id="resource_links"}

리소스 정의를 라우팅에 사용하는 것 외에도, 링크를 생성하는 데에도 사용될 수 있습니다.
이는 때때로 _역방향 라우팅_이라고 불립니다.
리소스로부터 링크를 생성하는 것은 [HTML DSL](server-html-dsl.md)로 생성된 HTML 문서에 이러한 링크를 추가해야 하거나, [리다이렉션 응답](server-responses.md#redirect)을 생성해야 할 때 유용할 수 있습니다.

`Resources` 플러그인은 `Application`에 오버로드된 [href](https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-resources/io.ktor.server.resources/href.html) 메서드를 추가하며, 이를 통해 `Resource`로부터 링크를 생성할 수 있습니다. 예를 들어, 아래 코드 스니펫은 [위에 정의된](#example_crud) `Edit` 리소스에 대한 링크를 생성합니다.

```kotlin
val link: String = href(Articles.Id.Edit(Articles.Id(id = 123)))
```

상위 `Articles` 리소스가 기본값 `new`를 가진 `sort` 쿼리 파라미터를 정의하므로, `link` 변수는 다음을 포함합니다:

```
/articles/123/edit?sort=new
```

호스트와 프로토콜을 지정하는 URL을 생성하려면 `URLBuilder`를 `href` 메서드에 제공할 수 있습니다.
추가 쿼리 파라미터도 `URLBuilder`를 사용하여 지정할 수 있으며, 이 예시에서 보여줍니다:

```kotlin
val urlBuilder = URLBuilder(URLProtocol.HTTPS, "ktor.io", parameters = parametersOf("token", "123"))
href(Articles(sort = null), urlBuilder)
val link: String = urlBuilder.buildString()
```

`link` 변수는 다음을 포함합니다:

```
https://ktor.io/articles?token=123
```

### 예시 {id="example_build_links"}

아래 예시는 리소스로부터 생성된 링크를 HTML 응답에 추가하는 방법을 보여줍니다:

```kotlin
get {
    call.respondHtml {
        body {
            this@module.apply {
                p {
                    val link: String = href(Articles())
                    a(link) { +"Get all articles" }
                }
                p {
                    val link: String = href(Articles.New())
                    a(link) { +"Create a new article" }
                }
                p {
                    val link: String = href(Articles.Id.Edit(Articles.Id(id = 123)))
                    a(link) { +"Edit an exising article" }
                }
                p {
                    val urlBuilder = URLBuilder(URLProtocol.HTTPS, "ktor.io", parameters = parametersOf("token", "123"))
                    href(Articles(sort = null), urlBuilder)
                    val link: String = urlBuilder.buildString()
                    i { a(link) { +link } }
                }
            }
        }
    }
}
```

전체 예시는 여기에서 확인할 수 있습니다: [resource-routing](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/resource-routing).