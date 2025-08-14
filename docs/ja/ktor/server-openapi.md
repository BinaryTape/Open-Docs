[//]: # (title: OpenAPI)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-openapi"/>
<var name="package_name" value="io.ktor.server.plugins.openapi"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-openapi/io.ktor.server.plugins.openapi/open-a-p-i.html"/>

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
        <b><Links href="/ktor/server-native" summary="Ktor supports Kotlin/Native and allows you to run a server without an additional runtime or virtual machine.">ネイティブサーバー</Links>のサポート</b>: ✖️
    </p>
    
</tldr>

<link-summary>
OpenAPIプラグインを使用すると、プロジェクト向けのOpenAPIドキュメントを生成できます。
</link-summary>

Ktorでは、既存のOpenAPI仕様に基づいて、プロジェクト向けのOpenAPIドキュメントを生成し、提供できます。

undefined

## 依存関係の追加 {id="add_dependencies"}

*   OpenAPIドキュメントを提供するには、ビルドスクリプトで `%artifact_name%` アーティファクトを追加する必要があります。

  
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
    

*   オプションで、コードジェネレーターをカスタマイズしたい場合は、`swagger-codegen-generators` 依存関係を追加します。

  <var name="group_id" value="io.swagger.codegen.v3"/>
  <var name="artifact_name" value="swagger-codegen-generators"/>
  <var name="version" value="swagger_codegen_version"/>
  
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
    

  `$swagger_codegen_version` を、`swagger-codegen-generators` アーティファクトの必要なバージョン (例えば `%swagger_codegen_version%`) に置き換えることができます。

## OpenAPIの設定 {id="configure-swagger"}

OpenAPIドキュメントを提供するには、`swaggerFile`に配置されたOpenAPI仕様からレンダリングされたドキュメントを`path`に持つ`GET`エンドポイントを作成する[openAPI](%plugin_api_link%)メソッドを呼び出す必要があります。

```kotlin
import io.ktor.server.plugins.openapi.*

// ...
routing {
    openAPI(path="openapi", swaggerFile = "openapi/documentation.yaml")
}
```

このメソッドは、アプリケーションリソース内でOpenAPI仕様を検索しようとします。
そうでない場合は、`java.io.File`を使用してファイルシステムからOpenAPI仕様を読み取ろうとします。

デフォルトでは、ドキュメントは`StaticHtml2Codegen`を使用して生成されます。
`openAPI`ブロック内で生成設定をカスタマイズできます。

[object Promise]

これで、アプリケーションを[実行](server-run.md)し、`/openapi`ページを開いて生成されたドキュメントを確認できます。