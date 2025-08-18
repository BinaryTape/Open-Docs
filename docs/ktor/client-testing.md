[//]: # (title: Ktor Client 中的测试)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-client-mock"/>

<tldr>
<p>
<b>所需依赖项</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-testing-mock"/>
<p>
    <b>代码示例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<web-summary>
Ktor 提供了 MockEngine，它模拟 HTTP 调用而无需连接到端点。
</web-summary>

<link-summary>
了解如何使用 MockEngine 通过模拟 HTTP 调用来测试您的客户端。
</link-summary>

Ktor 提供了 [MockEngine](https://api.ktor.io/ktor-client/ktor-client-mock/io.ktor.client.engine.mock/-mock-engine/index.html)，它模拟 HTTP 调用而无需连接到端点。

## 添加依赖项 {id="add_dependencies"}
在使用 `MockEngine` 之前，您需要将 `%artifact_name%` artifact 引入到构建脚本中。

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

### 共享客户端配置 {id="share-config"}

让我们看看如何使用 `MockEngine` 来测试客户端。假设客户端具有以下配置：
*   使用 `CIO` [引擎](client-engines.md) 来发出请求。
*   [Json](client-serialization.md) 插件已安装，用于反序列化传入的 JSON 数据。

要测试此客户端，其配置需要与使用 `MockEngine` 的测试客户端共享。为了共享配置，您可以创建一个客户端包装类，该类以引擎作为构造函数形参并包含客户端配置。

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

然后，您可以如下使用 `ApiClient` 来创建一个使用 `CIO` 引擎的 HTTP 客户端并发出请求。

```kotlin
fun main() {
    runBlocking {
        val client = ApiClient(CIO.create())
        val response = client.getIp()
        println(response.ip)
    }
}
```

### 测试客户端 {id="test-client"}

要测试客户端，您需要创建一个 `MockEngine` 实例，该实例带有一个处理器，可以检测请求形参并响应所需内容（在本例中为 JSON 对象）。

```kotlin
val mockEngine = MockEngine { request ->
    respond(
        content = ByteReadChannel("""{"ip":"127.0.0.1"}"""),
        status = HttpStatusCode.OK,
        headers = headersOf(HttpHeaders.ContentType, "application/json")
    )
}
```

然后，您可以将创建的 `MockEngine` 传递给 `ApiClient` 以初始化它，并进行所需的断言。

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

您可以在此处找到完整示例：[client-testing-mock](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-testing-mock)。