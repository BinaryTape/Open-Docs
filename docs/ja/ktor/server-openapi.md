[//]: # (title: OpenAPI)

<primary-label ref="server-plugin"/>

<var name="artifact_name" value="ktor-server-openapi"/>
<var name="package_name" value="io.ktor.server.plugins.openapi"/>
<var name="plugin_api_link" value="https://api.ktor.io/ktor-server/ktor-server-plugins/ktor-server-openapi/io.ktor.server.plugins.openapi/open-a-p-i.html"/>

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
    <b><Links href="/ktor/server-native" summary="KtorはKotlin/Nativeをサポートしており、追加のランタイムや仮想マシンなしでサーバーを実行できます。">ネイティブサーバー</Links>のサポート</b>: ✖️
</p>
</tldr>

<link-summary>
OpenAPIプラグインを使用すると、プロジェクトのOpenAPIドキュメントを生成できます。
</link-summary>

Ktorでは、既存のOpenAPI仕様に基づいて、プロジェクトのOpenAPIドキュメントを生成し提供できます。既存のYAMLまたはJSON仕様を提供することも、Ktor Gradleプラグインの[OpenAPI拡張機能](openapi-spec-generation.md)を使用して生成することもできます。

## 依存関係の追加 {id="add_dependencies"}

* OpenAPIドキュメントを提供するには、ビルドスクリプトに`%artifact_name%`アーティファクトを追加する必要があります:

  <Tabs group="languages">
      <TabItem title="Gradle (Kotlin)" group-key="kotlin">
          <code-block lang="Kotlin" code="              implementation(&quot;io.ktor:%artifact_name%:$ktor_version&quot;)"/>
      </TabItem>
      <TabItem title="Gradle (Groovy)" group-key="groovy">
          <code-block lang="Groovy" code="              implementation &quot;io.ktor:%artifact_name%:$ktor_version&quot;"/>
      </TabItem>
      <TabItem title="Maven" group-key="maven">
          <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;io.ktor&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%-jvm&lt;/artifactId&gt;&#10;                  &lt;version&gt;${ktor_version}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
      </TabItem>
  </Tabs>

* オプションで、[コードジェネレーター](https://github.com/swagger-api/swagger-codegen-generators)をカスタマイズしたい場合は、`swagger-codegen-generators`依存関係を追加します:

  <var name="group_id" value="io.swagger.codegen.v3"/>
  <var name="artifact_name" value="swagger-codegen-generators"/>
  <var name="version" value="swagger_codegen_version"/>
  <Tabs group="languages">
      <TabItem title="Gradle (Kotlin)" group-key="kotlin">
          <code-block lang="Kotlin" code="              implementation(&quot;%group_id%:%artifact_name%:$%version%&quot;)"/>
      </TabItem>
      <TabItem title="Gradle (Groovy)" group-key="groovy">
          <code-block lang="Groovy" code="              implementation &quot;%group_id%:%artifact_name%:$%version%&quot;"/>
      </TabItem>
      <TabItem title="Maven" group-key="maven">
          <code-block lang="XML" code="              &lt;dependency&gt;&#10;                  &lt;groupId&gt;%group_id%&lt;/groupId&gt;&#10;                  &lt;artifactId&gt;%artifact_name%&lt;/artifactId&gt;&#10;                  &lt;version&gt;${%version%}&lt;/version&gt;&#10;              &lt;/dependency&gt;"/>
      </TabItem>
  </Tabs>

  `$swagger_codegen_version`は、必要な`swagger-codegen-generators`アーティファクトのバージョンに置き換えることができます。例: `%swagger_codegen_version%`。

## OpenAPIの設定 {id="configure-swagger"}

OpenAPIドキュメントを提供するには、`swaggerFile`に配置されたOpenAPI仕様からレンダリングされたドキュメントを含む`GET`エンドポイントを`path`に作成する[openAPI](%plugin_api_link%)メソッドを呼び出す必要があります:

```kotlin
import io.ktor.server.plugins.openapi.*

// ...
routing {
    openAPI(path="openapi", swaggerFile = "openapi/documentation.yaml")
}
```

このメソッドは、アプリケーションリソース内でOpenAPI仕様を検索しようとします。それ以外の場合は、`java.io.File`を使用してファイルシステムからOpenAPI仕様を読み取ろうとします。

デフォルトでは、ドキュメントは`StaticHtml2Codegen`を使用して生成されます。`openAPI`ブロック内で生成設定をカスタマイズできます:

```kotlin
routing {
    openAPI(path="openapi", swaggerFile = "openapi/documentation.yaml") {
        codegen = StaticHtmlCodegen()
    }
}
```

これでアプリケーションを[実行](server-run.md)し、`/openapi`ページを開いて生成されたドキュメントを確認できます。