[//]: # (title: 在 Ktor Client 中測試)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-client-mock"/>

<tldr>
<p>
<b>所需依賴</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-testing-mock"/>
<p>
    <b>程式碼範例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<web-summary>
Ktor 提供一個 MockEngine，可以模擬 HTTP 呼叫而無需連接到端點。
</web-summary>

<link-summary>
了解如何使用 MockEngine 透過模擬 HTTP 呼叫來測試你的 client。
</link-summary>

Ktor 提供一個 [MockEngine](https://api.ktor.io/ktor-client/ktor-client-mock/io.ktor.client.engine.mock/-mock-engine/index.html)，可以模擬 HTTP 呼叫而無需連接到端點。

## 新增依賴 {id="add_dependencies"}
在使用 `MockEngine` 之前，你需要包含 `%artifact_name%` artifact 在建構腳本中。

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

## 用法 {id="usage"}

### 共用 client 配置 {id="share-config"}

讓我們看看如何使用 `MockEngine` 來測試 client。假設 client 有以下配置：
* `CIO` [引擎](client-engines.md) 用於發出請求。
* 已安裝 [Json](client-serialization.md) 外掛以反序列化傳入的 JSON 資料。

為了測試這個 client，它的配置需要與一個測試 client 共用，該測試 client 使用 `MockEngine`。為了共用配置，你可以建立一個 client 包裝器類別，它接受一個引擎作為建構函數參數並包含 client 配置。

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

然後，你可以使用 `ApiClient` 如下來建立一個 HTTP client，使用 `CIO` 引擎並發出請求。

```kotlin
fun main() {
    runBlocking {
        val client = ApiClient(CIO.create())
        val response = client.getIp()
        println(response.ip)
    }
}
```

### 測試 client {id="test-client"}

為了測試 client，你需要建立一個 `MockEngine` 實例，帶有一個處理器，該處理器可以檢查請求參數並回應所需的內容（在我們的例子中是一個 JSON 物件）。

```kotlin
val mockEngine = MockEngine { request ->
    respond(
        content = ByteReadChannel("""{"ip":"127.0.0.1"}"""),
        status = HttpStatusCode.OK,
        headers = headersOf(HttpHeaders.ContentType, "application/json")
    )
}
```

然後，你可以傳遞建立好的 `MockEngine` 來初始化 `ApiClient` 並進行所需的斷言。

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

你可以在此處找到完整範例：[client-testing-mock](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-testing-mock)。