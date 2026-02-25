---
title: Ktor 與 Koin 隔離上下文
---

`koin-ktor` 模組致力於為 Ktor 提供依賴注入。

## 隔離的 Koin 上下文外掛程式

要在 Ktor 中啟動一個隔離的 Koin 容器，只需按照以下方式安裝 `KoinIsolated` 外掛程式：

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
 透過使用隔離的 Koin 上下文，您將無法在 Ktor 伺服器執行個體之外使用 Koin（例如：透過使用 `GlobalContext`）。
:::