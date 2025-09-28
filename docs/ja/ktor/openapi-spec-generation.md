[//]: # (title: OpenAPI仕様の生成)

<show-structure for="chapter" depth="2"/>
<primary-label ref="experimental"/>
<secondary-label ref="server-feature"/>

<tldr>
<p>
<b>コード例</b>:
<a href="https://github.com/ktorio/ktor-samples/tree/main/openapi">openapi</a>
</p>
</tldr>

Ktorは、Kotlinコードから直接OpenAPI仕様を生成するための実験的なサポートを提供しています。この機能はKtor Gradleプラグインを介して利用でき、[OpenAPI](server-openapi.md)プラグインおよび[SwaggerUI](server-swagger-ui.md)プラグインと組み合わせて、インタラクティブなAPIドキュメントを提供できます。

> OpenAPI Gradle拡張機能にはKotlin 2.2.20が必要です。他のバージョンを使用すると、コンパイルエラーが発生する可能性があります。
>
{style="note"}

## Gradleプラグインの追加

仕様生成を有効にするには、Ktor Gradleプラグインをプロジェクトに適用します。

```kotlin
plugins {
    id("io.ktor.plugin") version "%ktor_version%"
}
```

## 拡張機能の設定

拡張機能を設定するには、<Path>build.gradle.kts</Path>ファイル内の`ktor`拡張機能内で`openApi`ブロックを使用します。タイトル、説明、ライセンス、連絡先情報などのメタデータを提供できます。

```kotlin
ktor {
    @OptIn(OpenApiPreview::class)
    openApi {
        title = "OpenAPI example"
        version = "2.1"
        summary = "This is a sample API"
        description = "This is a longer description"
        termsOfService = "https://example.com/terms/"
        contact = "contact@example.com"
        license = "Apache/1.0"

        // Location of the generated specification (defaults to openapi/generated.json)
        target = project.layout.buildDirectory.file("open-api.json")
    }
}
```

## ルーティングAPIのイントロスペクション

このプラグインは、サーバーのルーティングDSLを解析して、次のような基本的なパス情報を推測できます。

- マージされたパス（`/api/v1/users/{id}`）。
- パスパラメータ。
- HTTPメソッド（`GET`や`POST`など）。

```kotlin
routing {
    route("/api/v1") {
        get("/users") { }
        get("/users/{id}") { }
        post("/users") { }
    }
}
```

リクエストパラメータとレスポンスはルートラムダ内で処理されるため、プラグインは詳細なリクエスト/レスポンススキーマを自動的に推測できません。完全で役立つ仕様を生成するには、アノテーションを使用できます。

## ルートへのアノテーション

仕様を充実させるために、KtorはKDocのようなアノテーションAPIを使用します。アノテーションは、コードから推測できないメタデータを提供し、既存のルートとシームレスに統合されます。

```kotlin
/**
 * Get a single user.
 *
 * @path id The ID of the user
 * @response 404 The user was not found
 * @response 200 [User] The user.
 */
get("/api/users/{id}") {
    val user = repository.get(call.parameters["id"]!!)
        ?: return@get call.respond(HttpStatusCode.NotFound)
    call.respond(user)
}

```

### サポートされているKDocフィールド

| タグ            | 形式                                          | 説明                                     |
|---------------|-----------------------------------------------|------------------------------------------|
| `@tags`       | `@tags *name`                                 | エンドポイントをグループ化するためのタグと関連付けます |
| `@path`       | `@path [Type] name description`               | パスパラメータを記述します                    |
| `@query`      | `@query [Type] name description`              | クエリパラメータ                            |
| `@header`     | `@header [Type] name description`             | ヘッダーパラメータ                          |
| `@cookie`     | `@cookie [Type] name description`             | Cookieパラメータ                         |
| `@body`       | `@body contentType [Type] description`        | リクエストボディ                            |
| `@response`   | `@response code contentType [Type] description` | オプションの型を持つレスポンス                |
| `@deprecated` | `@deprecated reason`                          | エンドポイントを非推奨としてマークします       |
| `@description`| `@description text`                           | 拡張説明                                  |
| `@security`   | `@security scheme`                            | セキュリティ要件                           |
| `@externalDocs`| `@external href`                             | 外部ドキュメントリンク                     |

## 仕様の生成

OpenAPI仕様を生成するには、次のGradleタスクを実行します。

```shell
./gradlew buildOpenApi
```

このタスクは、ルーティングコードを解析し、JSON仕様を生成するカスタムプラグインを使用してKotlinコンパイラを実行します。

> 一部のコンストラクトはコンパイル時に評価できません。生成される仕様は不完全な場合があります。今後のKtorリリースで改善が計画されています。
>
{style="note"}

## 仕様の提供

生成された仕様を実行時に利用可能にするには、[OpenAPI](server-openapi.md)または[SwaggerUI](server-swagger-ui.md)プラグインを使用できます。

次の例は、生成された仕様ファイルをOpenAPIエンドポイントで提供します。

```kotlin
routing {
    openAPI("/docs", swaggerFile = "openapi/generated.json")
}