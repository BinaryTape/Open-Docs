---
title: "Ktor & Koin 隔离上下文"
---
`koin-ktor` 模块专注于为 Ktor 带来依赖注入。

## 隔离的 Koin 上下文插件 (Isolated Koin Context Plugin)

要在 Ktor 中启动隔离的 Koin 容器，只需安装 `KoinIsolated` 插件，如下所示：

```kotlin
fun Application.main() {
    // 安装 Koin 插件 (Install Koin plugin)
    install(KoinIsolated) {
        slf4jLogger()
        modules(helloAppModule)
    }
}
```

:::warning
通过使用隔离的 Koin 上下文，您将无法在 Ktor 服务器实例之外使用 Koin（例如：通过使用 `GlobalContext`）。
:::