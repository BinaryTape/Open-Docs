---
title: Ktor & Koin 独立コンテキスト
---

`koin-ktor`モジュールは、Ktorに依存性注入機能をもたらすことに特化しています。

## 独立したKoinコンテキストプラグイン

Ktorで独立したKoinコンテナを開始するには、以下のように`KoinIsolated`プラグインをインストールするだけです。

```kotlin
fun Application.main() {
    // Install Koin plugin
    install(KoinIsolated) {
        slf4jLogger()
        modules(helloAppModule)
    }
}
```

:::warning
独立したKoinコンテキストを使用すると、Ktorサーバーインスタンスの外部（例: `GlobalContext`を使用するなど）ではKoinを使用できなくなります。
:::