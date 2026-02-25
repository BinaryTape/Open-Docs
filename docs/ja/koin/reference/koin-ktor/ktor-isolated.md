---
title: Ktor と Koin の Isolated Context
---

`koin-ktor`モジュールは、Ktorに依存性の注入（Dependency Injection）をもたらすための専用モジュールです。

## Isolated Koin Context プラグイン

KtorでIsolated Koinコンテナを開始するには、次のように`KoinIsolated`プラグインをインストールします。

```kotlin
fun Application.main() {
    // Koinプラグインのインストール
    install(KoinIsolated) {
        slf4jLogger()
        modules(helloAppModule)
    }
}
```

:::warning
 Isolated Koin contextを使用すると、Ktorサーバーインスタンスの外（例：`GlobalContext`の使用など）でKoinを使用することはできなくなります。
:::