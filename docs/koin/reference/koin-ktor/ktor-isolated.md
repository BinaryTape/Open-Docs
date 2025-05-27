---
title: Ktor 与 Koin 隔离上下文
---

`koin-ktor` 模块专门为 Ktor 提供依赖注入。

## 隔离 Koin 上下文插件

要在 Ktor 中启动一个隔离 Koin 容器，只需按如下方式安装 `KoinIsolated` 插件：

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
通过使用隔离的 Koin 上下文，你将无法在 Ktor 服务器实例外部使用 Koin (例如：通过使用 `GlobalContext`)。
:::