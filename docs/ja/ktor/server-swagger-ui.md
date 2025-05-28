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
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

<link-summary>
Swagger UIプラグインを使用すると、プロジェクト用のSwagger UIを生成できます。
</link-summary>

Ktorを使用すると、既存のOpenAPI仕様に基づいて、プロジェクト用のSwagger UIを生成して提供できます。Swagger UIを使用すると、APIリソースを視覚化し、操作できます。

> コードからOpenAPI定義を生成したり、その逆を行ったりするために、以下のツールが利用可能です。
> - IntelliJ IDEA用の[Ktorプラグイン](https://www.jetbrains.com/help/idea/ktor.html#openapi)は、サーバーサイドKtorアプリケーションのOpenAPIドキュメントを生成する機能を提供します。
> - [OpenAPIジェネレーター](https://github.com/OpenAPITools/openapi-generator)を使用すると、[kotlin-server](https://github.com/OpenAPITools/openapi-generator/blob/master/docs/generators/kotlin-server.md)ジェネレーターを使ってAPI定義からKtorプロジェクトを作成できます。あるいは、IntelliJ IDEAの[機能](https://www.jetbrains.com/help/idea/openapi.html#codegen)を使用することもできます。
> 
{id="open-api-note"}

## 依存関係を追加する {id="add_dependencies"}

Swagger UIを提供するには、ビルドスクリプトに`%artifact_name%`アーティファクトを追加する必要があります。

<include from="lib.topic" element-id="add_ktor_artifact"/>

## Swagger UIを設定する {id="configure-swagger"}

Swagger UIを提供するには、`swaggerFile`に配置されたOpenAPI仕様からレンダリングされる`path`でSwagger UIを持つ`GET`エンドポイントを作成する[swaggerUI](%plugin_api_link%)メソッドを呼び出す必要があります。

```kotlin
import io.ktor.server.plugins.swagger.*

// ...
routing {
    swaggerUI(path = "swagger", swaggerFile = "openapi/documentation.yaml")
}
```

このメソッドは、アプリケーションリソース内でOpenAPI仕様を検索しようとします。それ以外の場合は、`java.io.File`を使用してファイルシステムからOpenAPI仕様を読み取ろうとします。

オプションで、`swaggerUI`ブロック内でSwagger UIをカスタマイズできます。例えば、別のSwagger UIバージョンを使用したり、カスタムスタイルを適用したりできます。

```kotlin
```
{src="snippets/json-kotlinx-openapi/src/main/kotlin/com/example/Application.kt" include-lines="39,52-54,58"}

これでアプリケーションを[実行](server-run.md)し、`/swagger`ページを開いて利用可能なエンドポイントを確認し、テストできます。

## CORSを設定する {id="configure-cors"}

APIがSwagger UIとうまく連携するようにするには、[Cross-Origin Resource Sharing (CORS)](server-cors.md)のポリシーを設定する必要があります。以下の例では、次のCORS設定を適用します。
- `anyHost`は、任意のホストからのクロスオリジンリクエストを有効にします。
- `allowHeader`は、[コンテンツネゴシエーション](server-serialization.md)で使用される`Content-Type`クライアントヘッダーを許可します。

```kotlin
```
{src="snippets/json-kotlinx-openapi/src/main/kotlin/com/example/Application.kt" include-lines="35-38"}