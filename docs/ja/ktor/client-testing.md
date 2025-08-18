[//]: # (title: Ktor Clientでのテスト)

<show-structure for="chapter" depth="2"/>

<var name="artifact_name" value="ktor-client-mock"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="client-testing-mock"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
</tldr>

<web-summary>
Ktorは、エンドポイントに接続することなくHTTPコールをシミュレートするMockEngineを提供します。
</web-summary>

<link-summary>
HTTPコールをシミュレートしてMockEngineでクライアントをテストする方法を学びます。
</link-summary>

Ktorは、エンドポイントに接続することなくHTTPコールをシミュレートする[MockEngine](https://api.ktor.io/ktor-client/ktor-client-mock/io.ktor.client.engine.mock/-mock-engine/index.html)を提供します。

## 依存関係の追加 {id="add_dependencies"}
`MockEngine`を使用する前に、`%artifact_name%`アーティファクトをビルドスクリプトに含める必要があります。

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

## 使用方法 {id="usage"}

### クライアント設定の共有 {id="share-config"}

`MockEngine`を使用してクライアントをテストする方法を見てみましょう。クライアントが以下の設定を持っているとします。
*   `CIO` [エンジン](client-engines.md)はリクエストを作成するために使用されます。
*   受信JSONデータをデシリアライズするために[Json](client-serialization.md)プラグインがインストールされています。

このクライアントをテストするには、その設定を`MockEngine`を使用するテストクライアントと共有する必要があります。設定を共有するには、コンストラクタパラメータとしてエンジンを受け取り、クライアント設定を含むクライアントラッパークラスを作成できます。

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

次に、次のように`ApiClient`を使用して`CIO`エンジンでHTTPクライアントを作成し、リクエストを作成できます。

```kotlin
fun main() {
    runBlocking {
        val client = ApiClient(CIO.create())
        val response = client.getIp()
        println(response.ip)
    }
}
```

### クライアントのテスト {id="test-client"}

クライアントをテストするには、リクエストパラメータをチェックし、必要なコンテンツ（この場合はJSONオブジェクト）で応答できるハンドラを持つ`MockEngine`インスタンスを作成する必要があります。

```kotlin
val mockEngine = MockEngine { request ->
    respond(
        content = ByteReadChannel("""{"ip":"127.0.0.1"}"""),
        status = HttpStatusCode.OK,
        headers = headersOf(HttpHeaders.ContentType, "application/json")
    )
}
```

次に、作成した`MockEngine`を渡して`ApiClient`を初期化し、必要なアサーションを行うことができます。

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

完全な例はこちらで確認できます: [client-testing-mock](https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/client-testing-mock)。