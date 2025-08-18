[//]: # (title: クライアントプラグイン)

<link-summary>
共通機能（ロギング、シリアライゼーション、認証など）を提供するプラグインについて理解を深めます。
</link-summary>

多くのアプリケーションでは、アプリケーションロジックの範囲外となる共通機能が必要です。これには、[ロギング](client-logging.md)や[シリアライゼーション](client-serialization.md)、[認証](client-auth.md)などが挙げられます。これらの機能はすべて、Ktorでは**プラグイン**と呼ばれる仕組みによって提供されます。

## プラグインの依存関係を追加する {id="plugin-dependency"}
プラグインには個別の[依存関係](client-dependencies.md)が必要な場合があります。例えば、[ロギング](client-logging.md)プラグインでは、ビルドスクリプトに`ktor-client-logging`アーティファクトの追加が必要です。

<var name="artifact_name" value="ktor-client-logging"/>
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

必要なプラグインのトピックから、どの依存関係が必要かを確認できます。

## プラグインをインストールする {id="install"}
プラグインをインストールするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)内で`install`関数に渡す必要があります。例えば、`Logging`プラグインをインストールする場合は次のようになります。

```kotlin
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.logging.*

val client = HttpClient(CIO) {
    install(Logging)
}
```

## プラグインを設定する {id="configure_plugin"}
`install`ブロック内でプラグインを設定できます。例えば、[ロギング](client-logging.md)プラグインの場合、ロガー、ロギングレベル、ログメッセージをフィルタリングする条件を指定できます。
```kotlin
runBlocking {
    val client = HttpClient(CIO) {
        install(Logging) {
            logger = Logger.DEFAULT
            level = LogLevel.HEADERS
            filter { request ->
                request.url.host.contains("ktor.io")
            }
            sanitizeHeader { header -> header == HttpHeaders.Authorization }
```

## カスタムプラグインを作成する {id="custom"}
カスタムプラグインの作成方法については、[カスタムクライアントプラグイン](client-custom-plugins.md)を参照してください。