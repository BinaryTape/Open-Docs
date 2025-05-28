[//]: # (title: 타입 안전 요청)

<show-structure for="chapter" depth="2"/>
<primary-label ref="client-plugin"/>

<var name="plugin_name" value="Resources"/>
<var name="artifact_name" value="ktor-client-resources"/>

<tldr>
<p>
<b>필요한 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-type-safe-requests"/>
<include from="lib.topic" element-id="download_example"/>
</tldr>

<link-summary>
Resources 플러그인을 사용하여 타입 안전 요청을 만드는 방법을 알아봅니다.
</link-summary>

Ktor는 타입 안전 [요청](client-requests.md)을 구현할 수 있도록 `%plugin_name%` 플러그인을 제공합니다. 이를 위해 서버에서 사용 가능한 리소스를 설명하는 클래스를 생성한 다음, `@Resource` 키워드를 사용하여 이 클래스에 애너테이션을 추가해야 합니다. `@Resource` 애너테이션은 kotlinx.serialization 라이브러리에서 제공하는 `@Serializable` 동작을 가지고 있다는 점에 유의하십시오.

> Ktor 서버는 [타입 안전 라우팅](server-resources.md)을 구현하는 기능을 제공합니다.

## 의존성 추가 {id="add_dependencies"}

### kotlinx.serialization 추가 {id="add_serialization"}

[리소스 클래스](#resource_classes)가 `@Serializable` 동작을 가져야 하므로, [설정(Setup)](https://github.com/Kotlin/kotlinx.serialization#setup) 섹션에 설명된 대로 Kotlin serialization 플러그인을 추가해야 합니다.

### %plugin_name% 의존성 추가 {id="add_plugin_dependencies"}

<include from="lib.topic" element-id="add_ktor_artifact_intro"/>
<include from="lib.topic" element-id="add_ktor_artifact"/>
<include from="lib.topic" element-id="add_ktor_client_artifact_tip"/>

## %plugin_name% 설치 {id="install_plugin"}

`%plugin_name%`을 설치하려면 [클라이언트 구성 블록](client-create-and-configure.md#configure-client) 내부의 `install` 함수에 전달합니다.
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

<include from="server-resources.md" element-id="resource_classes_server"/>

### 예시: CRUD 작업을 위한 리소스 {id="example_crud"}

위 예시들을 요약하여 CRUD 작업을 위한 `Articles` 리소스를 생성해 봅시다.

```kotlin
```
{src="snippets/client-type-safe-requests/src/main/kotlin/com/example/Application.kt" include-lines="18-28"}

이 리소스는 모든 아티클을 나열하고, 새 아티클을 게시하고, 편집하는 등에 사용될 수 있습니다. 다음 섹션에서 이 리소스에 [타입 안전 요청](#make_requests)을 생성하는 방법을 살펴보겠습니다.

> 전체 예시는 다음에서 찾을 수 있습니다: [client-type-safe-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-type-safe-requests).

## 타입 안전 요청 만들기 {id="make_requests"}

타입이 지정된 리소스에 [요청을 생성](client-requests.md)하려면 리소스 클래스 인스턴스를 요청 함수(`request`, `get`, `post`, `put` 등)에 전달해야 합니다. 예를 들어, 아래 샘플은 `/articles` 경로로 요청을 만드는 방법을 보여줍니다.

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

아래 예시는 [](#example_crud)에서 생성된 `Articles` 리소스에 타입이 지정된 요청을 생성하는 방법을 보여줍니다.

```kotlin
```
{src="snippets/client-type-safe-requests/src/main/kotlin/com/example/Application.kt" include-lines="30-48,60"}

[defaultRequest](client-default-request.md) 함수는 모든 요청에 대한 기본 URL을 지정하는 데 사용됩니다.

> 전체 예시는 다음에서 찾을 수 있습니다: [client-type-safe-requests](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-type-safe-requests).