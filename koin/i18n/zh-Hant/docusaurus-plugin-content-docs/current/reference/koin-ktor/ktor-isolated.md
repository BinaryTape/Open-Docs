---
title: "Ktor & Koin 隔離上下文 (Isolated Context)"
---
`koin-ktor` 模組專門為 Ktor 帶來依賴注入功能。

## 隔離的 Koin Context 外掛程式 (Plugin)

要在 Ktor 中啟動一個隔離的 Koin 容器 (Container)，只需安裝 `KoinIsolated` 外掛程式，如下所示：

```kotlin
fun Application.main() {
    // 安裝 Koin 外掛程式
    install(KoinIsolated) {
        slf4jLogger()
        modules(helloAppModule)
    }
}
```

:::warning
透過使用隔離的 Koin context，您將無法在 Ktor 伺服器實例之外使用 Koin (例如：透過使用 `GlobalContext`)
:::