[//]: # (title: Swagger UI)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-swagger"/>
<var name="package_name" value="io.ktor.server.plugins.swagger"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-swagger/io.ktor.server.plugins.swagger/swagger-u-i.html"/>

<tldr>
<p>
<b>必須の依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx-openapi"/>

    <p>
        <b>コード例</b>:
        <a href="https://github.com/ktorio/ktor-documentation/tree/%ktor_version%/codeSnippets/snippets/%example_name%">
            %example_name%
        </a>
    </p>
    

    <p>
        <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>のサポート</b>: ✖️
    </p>
    
</tldr>

<link-summary>
Swagger UIプラグインを使用すると、プロジェクト用のSwagger UIを生成できます。
</link-summary>

Ktorは、既存のOpenAPI仕様に基づいて、プロジェクト用のSwagger UIを生成および提供できます。
Swagger UIを使用すると、APIリソースを視覚化し、操作できます。 

> コードからのOpenAPI定義の生成、またはその逆のために、以下のツールが利用可能です。
> - IntelliJ IDEA用の[Ktorプラグイン](https://www.jetbrains.com/help/idea/ktor.html#openapi)は、サーバーサイドKtorアプリケーション用のOpenAPIドキュメントを生成する機能を提供します。
> - [OpenAPIジェネレーター](https://github.com/OpenAPITools/openapi-generator)は、[kotlin-server](https://github.com/OpenAPITools/openapi-generator/blob/master/docs/generators/kotlin-server.md)ジェネレーターを使用して、API定義からKtorプロジェクトを作成できます。あるいは、IntelliJ IDEAの[機能](https://www.jetbrains.com/help/idea/openapi.html#codegen)を使用することもできます。
> 
{id="open-api-note"}

## 依存関係の追加 {id="add_dependencies"}

Swagger UIを提供するには、ビルドスクリプトに<code>%artifact_name%</code>アーティファクトを追加する必要があります。

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
    

## Swagger UIの構成 {id="configure-swagger"}

Swagger UIを提供するには、<code>swaggerFile</code>に配置されたOpenAPI仕様からレンダリングされる、<code>path</code>にSwagger UIを持つ<code>GET</code>エンドポイントを作成する[<code>swaggerUI</code>](%plugin_api_link%)メソッドを呼び出す必要があります。

```kotlin
import io.ktor.server.plugins.swagger.*

// ...
routing {
    swaggerUI(path = "swagger", swaggerFile = "openapi/documentation.yaml")
}
```

このメソッドは、アプリケーションのリソース内からOpenAPI仕様を探そうとします。
それ以外の場合は、<code>java.io.File</code>を使用してファイルシステムからOpenAPI仕様を読み込もうとします。

オプションとして、<code>swaggerUI</code>ブロック内でSwagger UIをカスタマイズできます。
たとえば、別のSwagger UIバージョンを使用したり、カスタムスタイルを適用したりできます。

[object Promise]

これでアプリケーションを[実行](server-run.md)し、<code>/swagger</code>ページを開いて利用可能なエンドポイントを確認し、テストできます。

## CORSの構成 {id="configure-cors"}

APIがSwagger UIで適切に動作するようにするには、[Cross-Origin Resource Sharing (CORS)](server-cors.md)のポリシーを設定する必要があります。
以下の例では、次のCORS構成を適用します。
- <code>anyHost</code>は、任意のホストからのクロスオリジンリクエストを有効にします。
- <code>allowHeader</code>は、[コンテンツネゴシエーション](server-serialization.md)で使用される<code>Content-Type</code>クライアントヘッダーを許可します。

[object Promise]

    ```