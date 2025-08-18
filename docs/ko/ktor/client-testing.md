[//]: # (title: Ktor Client에서 테스트하기)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-client-mock"/>

<tldr>
<p>
<b>필수 의존성</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-testing-mock"/>
<p>
    <b>코드 예시</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<web-summary>
Ktor는 엔드포인트에 연결하지 않고 HTTP 호출을 시뮬레이션하는 MockEngine을 제공합니다.
</web-summary>

<link-summary>
HTTP 호출을 시뮬레이션하여 MockEngine으로 클라이언트를 테스트하는 방법을 알아보세요.
</link-summary>

Ktor는 엔드포인트에 연결하지 않고 HTTP 호출을 시뮬레이션하는 [MockEngine](https://api.ktor.io/ktor-client/ktor-client-mock/io.ktor.client.engine.mock/-mock-engine/index.html)을 제공합니다.

## 의존성 추가 {id="add_dependencies"}
`MockEngine`을 사용하기 전에, `%artifact_name%` 아티팩트를 빌드 스크립트에 포함해야 합니다.

<Tabs group="languages">
    <TabItem title="Gradle (Kotlin)" group-key="kotlin">
        <code-block lang="Kotlin" code="            testImplementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
    </TabItem>
    <TabItem title="Gradle (Groovy)" group-key="groovy">
        <code-block lang="Groovy" code="            testImplementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
    </TabItem>
    <TabItem title="Maven" group-key="maven">
        <code-block lang="XML" code="            &lt;dependency&gt;&#10;                &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;            &lt;/dependency&gt;"/>
    </TabItem>
</Tabs>

## 사용법 {id="usage"}

### 클라이언트 구성 공유 {id="share-config"}

`MockEngine`을 사용하여 클라이언트를 테스트하는 방법을 살펴보겠습니다. 클라이언트가 다음과 같은 구성을 가지고 있다고 가정해 봅시다:
* 요청을 보내기 위해 `CIO` [엔진](client-engines.md)이 사용됩니다.
* 들어오는 JSON 데이터를 역직렬화하기 위해 [Json](client-serialization.md) 플러그인이 설치되어 있습니다.

이 클라이언트를 테스트하려면 해당 구성이 `MockEngine`을 사용하는 테스트 클라이언트와 공유되어야 합니다. 구성을 공유하려면 생성자 매개변수로 엔진을 받아 클라이언트 구성을 포함하는 클라이언트 래퍼 클래스를 만들 수 있습니다.

```kotlin
@Serializable
data class IpResponse(val ip: String)

class ApiClient(engine: HttpClientEngine) {
    private val httpClient = HttpClient(engine) {
        install(ContentNegotiation) {
            json()
        }
    }

    suspend fun getIp(): IpResponse = httpClient.get("https://api.ipify.org/?format=json").body()
}
```

그런 다음, 다음과 같이 `ApiClient`를 사용하여 `CIO` 엔진으로 HTTP 클라이언트를 생성하고 요청을 보낼 수 있습니다.

```kotlin
fun main() {
    runBlocking {
        val client = ApiClient(CIO.create())
        val response = client.getIp()
        println(response.ip)
    }
}
```

### 클라이언트 테스트 {id="test-client"}

클라이언트를 테스트하려면 요청 파라미터를 확인하고 필요한 콘텐츠(이 경우 JSON 객체)로 응답할 수 있는 핸들러를 사용하여 `MockEngine` 인스턴스를 생성해야 합니다.

```kotlin
val mockEngine = MockEngine { request ->
    respond(
        content = ByteReadChannel("""{"ip":"127.0.0.1"}"""),
        status = HttpStatusCode.OK,
        headers = headersOf(HttpHeaders.ContentType, "application/json")
    )
}
```

그런 다음, 생성된 `MockEngine`을 전달하여 `ApiClient`를 초기화하고 필요한 어설션을 수행할 수 있습니다.

```kotlin
class ApiClientTest {
    @Test
    fun sampleClientTest() {
        runBlocking {
            val mockEngine = MockEngine { request ->
                respond(
                    content = ByteReadChannel("""{"ip":"127.0.0.1"}"""),
                    status = HttpStatusCode.OK,
                    headers = headersOf(HttpHeaders.ContentType, "application/json")
                )
            }
            val apiClient = ApiClient(mockEngine)

            Assert.assertEquals("127.0.0.1", apiClient.getIp().ip)
        }
    }
}
```

전체 예시는 다음에서 찾을 수 있습니다: [client-testing-mock](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-testing-mock).