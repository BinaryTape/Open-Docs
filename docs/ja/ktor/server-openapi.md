[//]: # (title: オープンAPI)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-openapi"/>
<var name="package_name" value="io.ktor.server.plugins.openapi"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-openapi/io.ktor.server.plugins.openapi/open-a-p-i.html"/>

<tldr>
<p>
<b>必要な依存関係</b>: <code>io.ktor:%artifact_name%</code>
</p>
<var name="example_name" value="json-kotlinx-openapi"/>
<include from="lib.topic" element-id="download_example"/>
<include from="lib.topic" element-id="native_server_not_supported"/>
</tldr>

<link-summary>
OpenAPIプラグインを使用すると、プロジェクトのOpenAPIドキュメントを生成できます。
</link-summary>

Ktorでは、既存のOpenAPI仕様に基づいて、プロジェクトのOpenAPIドキュメントを生成および提供できます。

<include from="server-swagger-ui.md" element-id="open-api-note"/>

## 依存関係の追加 {id="add_dependencies"}

* OpenAPIドキュメントを提供するには、ビルドスクリプトに`%artifact_name%`アーティファクトを追加する必要があります。

  <include from="lib.topic" element-id="add_ktor_artifact"/>

* オプションとして、[コードジェネレーター](https://github.com/swagger-api/swagger-codegen-generators)をカスタマイズしたい場合は、`swagger-codegen-generators`依存関係を追加します。

  <var name="group_id" value="io.swagger.codegen.v3"/>
  <var name="artifact_name" value="swagger-codegen-generators"/>
  <var name="version" value="swagger_codegen_version"/>
  <include from="lib.topic" element-id="add_artifact"/>

  `$swagger_codegen_version`を、`swagger-codegen-generators`アーティファクトの必要なバージョン（例: `%swagger_codegen_version%`）に置き換えることができます。

## OpenAPIの設定 {id="configure-swagger"}

OpenAPIドキュメントを提供するには、[openAPI](%plugin_api_link%)メソッドを呼び出す必要があります。このメソッドは、`swaggerFile`に配置されたOpenAPI仕様からレンダリングされたドキュメントを、指定された`path`に`GET`エンドポイントとして作成します。

```kotlin
import io.ktor.server.plugins.openapi.*

// ...
routing {
    openAPI(path="openapi", swaggerFile = "openapi/documentation.yaml")
}
```

このメソッドは、アプリケーションリソース内にあるOpenAPI仕様を検索しようとします。
それ以外の場合、`java.io.File`を使用してファイルシステムからOpenAPI仕様を読み取ろうとします。

デフォルトでは、ドキュメントは`StaticHtml2Codegen`を使用して生成されます。
`openAPI`ブロック内で生成設定をカスタマイズできます。

```kotlin
```
{src="snippets/json-kotlinx-openapi/src/main/kotlin/com/example/Application.kt" include-lines="39,55-58"}

これで、アプリケーションを[実行](server-run.md)し、`/openapi`ページを開いて生成されたドキュメントを確認できます。