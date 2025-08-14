[//]: # (title: 타입 안전 요청)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<var name="plugin_name" value="Resources"/>
<var name="artifact_name" value="ktor-client-resources"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
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
Resources 플러그인을 사용하여 타입 안전(type-safe) 요청을 만드는 방법을 알아봅니다.
</link-summary>

Ktor는 타입 안전(type-safe) [요청](client-requests.md)을 구현할 수 있도록 `%plugin_name%` 플러그인을 제공합니다. 이를 위해 서버에서 사용 가능한 리소스(resources)를 설명하는 클래스를 생성한 다음, `@Resource` 키워드를 사용하여 이 클래스에 애너테이션을 달아야 합니다. `@Resource` 애너테이션은 kotlinx.serialization 라이브러리에서 제공하는 `@Serializable` 동작을 가지고 있음에 유의하십시오.

> Ktor 서버는 [타입 안전 라우팅](server-resources.md)을 구현하는 기능을 제공합니다.

## 의존성 추가 {id="add_dependencies"}

### kotlinx.serialization 추가 {id="add_serialization"}

[리소스 클래스](#resource_classes)가 `@Serializable` 동작을 가져야 하므로, [설정](https://github.com/Kotlin/kotlinx.serialization#setup) 섹션에 설명된 대로 Kotlin serialization 플러그인을 추가해야 합니다.

### %plugin_name% 의존성 추가 {id="add_plugin_dependencies"}

    <p>
        <code>%plugin_name%</code>을(를) 사용하려면 빌드 스크립트에 <code>%artifact_name%</code> 아티팩트를 포함해야 합니다:
    </p>
    

    <tabs group="languages">
        <tab title="Gradle (Kotlin)" group-key="kotlin">
            [object Promise]
        </tab>
        <tab title="Gradle (Groovy)" group-key="groovy">
            [object Promise]
        </tab>
        <tab title="Maven" group-key="maven">
            [object Promise]
        </tab>
    </tabs>
    

    <p>
        Ktor 클라이언트에 필요한 아티팩트에 대한 자세한 내용은 <Links href="/ktor/client-dependencies" summary="기존 프로젝트에 클라이언트 의존성을 추가하는 방법을 알아봅니다.">클라이언트 의존성 추가</Links>에서 확인할 수 있습니다.
    </p>
    

## %plugin_name% 설치 {id="install_plugin"}

`%plugin_name%`을(를) 설치하려면 [클라이언트 구성 블록](client-create-and-configure.md#configure-client) 내부의 `install` 함수에 전달하세요:
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

<snippet id="resource_classes_server">

각 리소스 클래스에는 `@Resource` 애너테이션이 있어야 합니다.
아래에서는 단일 경로 세그먼트, 쿼리 및 경로 파라미터 등을 정의하는 여러 리소스 클래스 예시를 살펴보겠습니다.

### 리소스 URL {id="resource_url"}

아래 예시는 `/articles` 경로에 응답하는 리소스(resource)를 지정하는 `Articles` 클래스를 정의하는 방법을 보여줍니다.

```kotlin
import io.ktor.resources.*

@Resource("/articles")
class Articles()
```

### 쿼리 파라미터가 있는 리소스 {id="resource_query_param"}

아래 `Articles` 클래스에는 [쿼리 파라미터](server-requests.md#query_parameters)로 작동하는 `sort` 문자열 프로퍼티가 있으며, 이는 `sort` 쿼리 파라미터와 함께 다음 경로에 응답하는 리소스를 정의할 수 있게 합니다: `/articles?sort=new`.

```kotlin
@Resource("/articles")
class Articles(val sort: String? = "new")
```

### 중첩 클래스가 있는 리소스 {id="resource_nested"}

여러 경로 세그먼트를 포함하는 리소스를 생성하기 위해 클래스를 중첩할 수 있습니다. 이 경우 중첩 클래스는 외부 클래스 타입의 프로퍼티를 가져야 한다는 점에 유의하십시오.
아래 예시는 `/articles/new` 경로에 응답하는 리소스를 보여줍니다.

```kotlin
@Resource("/articles")
class Articles() {
@Resource("new")
class New(val parent: Articles = Articles())
}
```

### 경로 파라미터가 있는 리소스 {id="resource_path_param"}

아래 예시는 경로 세그먼트와 일치하고 이를 `id`라는 이름의 파라미터로 캡처하는 [중첩된](#resource_nested) `{id}` 정수 [경로 파라미터](server-routing.md#path_parameter)를 추가하는 방법을 보여줍니다.

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

위 예시들을 요약하고 CRUD 작업을 위한 `Articles` 리소스를 생성해 봅시다.

[object Promise]

이 리소스는 모든 아티클을 나열하고, 새 아티클을 게시하고, 편집하는 등 다양한 용도로 사용될 수 있습니다. 다음 섹션에서 이 리소스에 [타입 안전(type-safe) 요청](#make_requests)을 하는 방법을 알아보겠습니다.

> 전체 예시는 다음에서 확인할 수 있습니다: [client-type-safe-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-type-safe-requests).

## 타입 안전 요청하기 {id="make_requests"}

타입 지정된 리소스(typed resource)에 [요청](client-requests.md)하려면 리소스 클래스 인스턴스를 요청 함수(`request`, `get`, `post`, `put` 등)에 전달해야 합니다. 예를 들어, 아래 샘플은 `/articles` 경로에 요청을 하는 방법을 보여줍니다.

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

아래 예시는 [](#example_crud)에서 생성된 `Articles` 리소스에 타입 지정된 요청을 하는 방법을 보여줍니다.

[object Promise]

[defaultRequest](client-default-request.md) 함수는 모든 요청에 대한 기본 URL을 지정하는 데 사용됩니다.

> 전체 예시는 다음에서 확인할 수 있습니다: [client-type-safe-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-type-safe-requests).