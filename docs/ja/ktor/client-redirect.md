[//]: # (title: リダイレクト)

デフォルトでは、Ktorクライアントは`Location`ヘッダーで提供されるURLにリダイレクトします。必要に応じて、リダイレクトを無効にできます。

## 依存関係の追加 {id="add_dependencies"}
`HttpRedirect`は[ktor-client-core](client-dependencies.md)アーティファクトのみが必要であり、特定の依存関係は必要ありません。

## リダイレクトの無効化 {id="disable"}

リダイレクトを無効にするには、[クライアント設定ブロック](client-create-and-configure.md#configure-client)で`followRedirects`プロパティを`false`に設定します:

```kotlin
val client = HttpClient(CIO) {
    followRedirects = false
}
```