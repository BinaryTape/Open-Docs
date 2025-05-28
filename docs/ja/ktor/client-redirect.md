[//]: # (title: リダイレクト)

デフォルトでは、Ktorクライアントは`Location`ヘッダーで提供されるURLにリダイレクトします。必要に応じて、リダイレクトを無効にできます。

## 依存関係を追加する {id="add_dependencies"}
`HttpRedirect`は[ktor-client-core](client-dependencies.md)アーティファクトのみを必要とし、特定の依存関係は不要です。

## リダイレクトを無効にする {id="disable"}

リダイレクトを無効にするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)で`followRedirects`プロパティを`false`に設定します。

```kotlin
val client = HttpClient(CIO) {
    followRedirects = false
}