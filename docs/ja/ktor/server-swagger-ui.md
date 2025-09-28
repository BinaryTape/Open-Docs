[//]: # (title: Swagger UI)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-swagger"/>
<var name="package_name" value="io.ktor.server.plugins.swagger"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-swagger/io.ktor.server.plugins.swagger/swagger-u-i.html"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx-openapi"/>
<p>
    <b>コード例</b>:
    <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
        %example_name%
    </a>
</p>
<p>
    <b><Links href="/ktor/server-native" summary="Ktor は Kotlin/Native をサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">Native サーバー</Links> のサポート</b>: ✖️
</p>
</tldr>

<link-summary>
SwaggerUI プラグインを使用すると、プロジェクト用の Swagger UI を生成できます。
</link-summary>

Ktor は、既存の OpenAPI 仕様に基づいて、プロジェクト用の Swagger UI を生成して提供できます。Swagger UI を使用すると、API リソースを視覚化し、操作できます。既存の YAML または JSON 仕様を提供したり、Ktor Gradle プラグインの [OpenAPI 拡張機能](openapi-spec-generation.md)を使用して生成したりできます。

## 依存関係を追加する {id="add_dependencies"}

Swagger UI を提供するには、ビルドスクリプトに `%artifact_name%` アーティファクトを追加する必要があります。

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

## Swagger UI を設定する {id="configure-swagger"}

Swagger UI を提供するには、`swaggerFile` に配置された OpenAPI 仕様からレンダリングされる、`path` に Swagger UI を含む `GET` エンドポイントを作成する [swaggerUI](%plugin_api_link%) メソッドを呼び出す必要があります。

```kotlin
import io.ktor.server.plugins.swagger.*

// ...
routing {
    swaggerUI(path = "swagger", swaggerFile = "openapi/documentation.yaml")
}
```

このメソッドは、アプリケーションリソース内で OpenAPI 仕様を検索しようとします。それ以外の場合は、`java.io.File` を使用してファイルシステムから OpenAPI 仕様を読み込もうとします。

オプションで、`swaggerUI` ブロック内で Swagger UI をカスタマイズできます。たとえば、別の Swagger UI バージョンを使用したり、カスタムスタイルを適用したりできます。

```kotlin
routing {
    swaggerUI(path = "swagger", swaggerFile = "openapi/documentation.yaml") {
        version = "4.15.5"
    }
}
```

これでアプリケーションを[実行](server-run.md)し、`/swagger` ページを開いて利用可能なエンドポイントを確認し、テストできます。

## CORS を設定する {id="configure-cors"}

API が Swagger UI とうまく連携するようにするには、[Cross-Origin Resource Sharing (CORS)](server-cors.md) のポリシーを設定する必要があります。
以下の例は、次の CORS 設定を適用します。
- `anyHost` は、任意のホストからのクロスオリジンリクエストを有効にします。
- `allowHeader` は、[コンテンツネゴシエーション](server-serialization.md)で使用される `Content-Type` クライアントヘッダーを許可します。

```kotlin
install(CORS) {
    anyHost()
    allowHeader(HttpHeaders.ContentType)
}