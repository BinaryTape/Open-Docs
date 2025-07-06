---
title: Koin Embedded
custom_edit_url: null
---

Koin Embedded 是一个面向 Android/Kotlin SDK 和库开发者的新 Koin 项目。

该项目提供了脚本，帮助使用不同的包名重建和打包 Koin 项目。其目的是为了 SDK 和库开发，以避免嵌入式 Koin 版本与任何使用不同 Koin 版本的消费应用之间可能发生的冲突。

意见反馈或帮助？请联系 [Koin 团队](mailto:koin@kotzilla.io)。

:::info
此举措目前处于 Beta 阶段，我们正在征集反馈。
:::

## 嵌入式版本 (Beta)

以下是 Koin 嵌入式版本的一个示例：[Kotzilla 仓库](https://repository.kotzilla.io/#browse/browse:Koin-Embedded)
- 可用包：`embedded-koin-core`、`embedded-koin-android`
- 重定位规则：从 `org.koin.*` 到 `embedded.koin.*`

使用此 Maven 仓库配置您的 Gradle：
```kotlin
maven { 'https://repository.kotzilla.io/repository/kotzilla-platform/' }
```

## 重定位脚本 (Beta)

这里有一些脚本，可以帮助为给定包名重建 Koin，从而帮助将其嵌入并避免与 Koin 框架的常规用法发生冲突。

了解更多详情，请查阅 Koin [重定位脚本](https://github.com/InsertKoinIO/koin-embedded?tab=readme-ov-file#koin-relocation-scripts)项目。