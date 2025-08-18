[//]: # (title: 타입 안전한 요청)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<var name="plugin_name" value="Resources"/>
<var name="artifact_name" value="ktor-client-resources"/>

<tldr>
<p>
<b>필수 종속성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-type-safe-requests"/>
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<link-summary>
Resources 플러그인을 사용하여 타입 안전한 요청을 만드는 방법을 알아보세요.
</link-summary>

Ktor는 타입 안전한 [요청](client-requests.md)을 구현할 수 있는 `%plugin_name%` 플러그인을 제공합니다. 이를 위해 서버에서 사용 가능한 리소스를 설명하는 클래스를 생성한 다음, `@Resource` 키워드를 사용하여 이 클래스에 어노테이션을 지정해야 합니다. `@Resource` 어노테이션은 kotlinx.serialization 라이브러리에서 제공하는 `@Serializable` 동작을 가지고 있다는 점에 유의하세요.

> Ktor 서버는 [타입 안전한 라우팅](server-resources.md)을 구현하는 기능을 제공합니다.

## 종속성 추가 {id="add_dependencies"}

### kotlinx.serialization 추가 {id="add_serialization"}

[리소스 클래스](#resource_classes)는 `@Serializable` 동작을 가져야 하므로, [설정(Setup)](https://github.com/Kotlin/kotlinx.serialization#setup) 섹션에 설명된 대로 Kotlin serialization 플러그인을 추가해야 합니다.

### %plugin_name% 종속성 추가 {id="add_plugin_dependencies"}

<p>
    <code>%plugin_name%</code>을(를) 사용하려면 빌드 스크립트에 <code>%artifact_name%</code> 아티팩트를 포함해야 합니다:
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
<p>
    Ktor 클라이언트에 필요한 아티팩트에 대한 자세한 내용은 <Links href="/ktor/client-dependencies" summary="기존 프로젝트에 클라이언트 종속성을 추가하는 방법을 알아보세요.">클라이언트 종속성 추가</Links>에서 확인할 수 있습니다.
</p>

## %plugin_name% 설치 {id="install_plugin"}

`%plugin_name%`을(를) 설치하려면 [클라이언트 구성 블록](client-create-and-configure.md#configure-client) 내에서 `install` 함수에 전달하세요:
```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.resources.*
//...
val client = HttpClient(CIO) {
    install(Resources)
}
```

## 리소스 클래스 생성 {id="resource_classes"}

각 리소스 클래스에는 `@Resource` 어노테이션이 있어야 합니다. 
아래에서는 단일 경로 세그먼트, 쿼리 및 경로 매개변수 등을 정의하는 몇 가지 리소스 클래스 예시를 살펴보겠습니다.

### 리소스 URL {id="resource_url"}

아래 예시는 `/articles` 경로에 응답하는 리소스를 지정하는 `Articles` 클래스를 정의하는 방법을 보여줍니다. 

```kotlin
import io.ktor.resources.*

@Resource("/articles")
class Articles()
```

### 쿼리 매개변수를 사용하는 리소스 {id="resource_query_param"}

아래 `Articles` 클래스에는 [쿼리 매개변수](server-requests.md#query_parameters) 역할을 하는 `sort` 문자열 속성이 있으며, 이는 `sort` 쿼리 매개변수를 사용하여 다음 경로에 응답하는 리소스를 정의할 수 있게 합니다: `/articles?sort=new`. 

```kotlin
@Resource("/articles")
class Articles(val sort: String? = "new")
```

### 중첩 클래스를 사용하는 리소스 {id="resource_nested"}

여러 경로 세그먼트를 포함하는 리소스를 생성하기 위해 클래스를 중첩할 수 있습니다. 이 경우 중첩 클래스는 외부 클래스 유형의 속성을 가져야 합니다. 
아래 예시는 `/articles/new` 경로에 응답하는 리소스를 보여줍니다.

```kotlin
@Resource("/articles")
class Articles() {
    @Resource("new")
    class New(val parent: Articles = Articles())
}
```

### 경로 매개변수를 사용하는 리소스 {id="resource_path_param"}

아래 예시는 경로 세그먼트와 일치하고 `id`라는 이름의 매개변수로 캡처하는 [중첩된](#resource_nested) `{id}` 정수 [경로 매개변수](server-routing.md#path_parameter)를 추가하는 방법을 보여줍니다.

```kotlin
@Resource("/articles")
class Articles() {
    @Resource("{id}")
    class Id(val parent: Articles = Articles(), val id: Long)
}
```

예를 들어, 이 리소스는 `/articles/12`에 응답하는 데 사용될 수 있습니다.

### 예시: CRUD 작업을 위한 리소스 {id="example_crud"}

위의 예시들을 요약하고 CRUD 작업을 위한 `Articles` 리소스를 생성해 봅시다.

```kotlin
@Resource("/articles")
class Articles() {
    @Resource("new")
    class New(val parent: Articles = Articles())

    @Resource("{id}")
    class Id(val parent: Articles = Articles(), val id: Long) {
        @Resource("edit")
        class Edit(val parent: Id)
    }
}
```

이 리소스는 모든 게시물을 나열하고, 새 게시물을 게시하고, 편집하는 등에 사용될 수 있습니다. 다음 섹션에서 이 리소스에 [타입 안전한 요청](#make_requests)을 만드는 방법을 살펴보겠습니다.

> 전체 예시는 여기에서 찾을 수 있습니다: [client-type-safe-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-type-safe-requests).

## 타입 안전한 요청 만들기 {id="make_requests"}

타입 지정된 리소스에 [요청](client-requests.md)을 만들려면 리소스 클래스 인스턴스를 요청 함수(`request`, `get`, `post`, `put` 등)에 전달해야 합니다. 예를 들어, 아래 샘플은 `/articles` 경로에 요청을 만드는 방법을 보여줍니다.

```kotlin
@Resource("/articles")
class Articles()

fun main() {
    runBlocking {
        val client = HttpClient(CIO) {
            install(Resources)
            // ...
        }
        val getAllArticles = client.get(Articles())
    }
}
```

아래 예시는 [예시: CRUD 작업을 위한 리소스](#example_crud)에서 생성된 `Articles` 리소스에 타입 지정된 요청을 만드는 방법을 보여줍니다. 

```kotlin
fun main() {
    defaultServer(Application::module).start()
    runBlocking {
        val client = HttpClient(CIO) {
            install(Resources)
            defaultRequest {
                host = "0.0.0.0"
                port = 8080
                url { protocol = URLProtocol.HTTP }
            }
        }

        val getAllArticles = client.get(Articles())
        val newArticle = client.get(Articles.New())
        val postArticle = client.post(Articles()) { setBody("Article content") }
        val getArticle = client.get(Articles.Id(id = 12))
        val editArticlePage = client.get(Articles.Id.Edit(Articles.Id(id = 12)))
        val putArticle = client.put(Articles.Id(id = 12)) { setBody("New article content") }
        val deleteArticle = client.delete(Articles.Id(id = 12))
}
```

[defaultRequest](client-default-request.md) 함수는 모든 요청에 대한 기본 URL을 지정하는 데 사용됩니다.

> 전체 예시는 여기에서 찾을 수 있습니다: [client-type-safe-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-type-safe-requests).