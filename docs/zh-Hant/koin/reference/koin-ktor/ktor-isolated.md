---
title: Ktor & Koin 獨立的上下文
---

`koin-ktor` 模組專用於為 Ktor 提供依賴注入功能。

## Koin 獨立上下文外掛程式

要在 Ktor 中啟動一個獨立的 Koin 容器，只需按如下方式安裝 `KoinIsolated` 外掛程式：

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
 透過使用獨立的 Koin 上下文，您將無法在 Ktor 伺服器實例外部使用 Koin (例如：透過使用 `GlobalContext`)。
:::