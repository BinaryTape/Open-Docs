---
title: Koin Embedded
custom_edit_url: null
---

Koin Embedded 是一个新的 Koin 项目，面向 Android/Kotlin SDK 和库开发者。

该项目提供的脚本可帮助以不同的软件包名称重新构建和打包 Koin 项目。其意义在于 SDK 和库的开发，以避免嵌入的 Koin 版本与任何可能使用另一个 Koin 版本并产生冲突的消费应用程序之间发生冲突。

反馈或帮助？请联系 [Koin 团队](mailto:koin@kotzilla.io)。

:::info
该计划目前处于 Beta 阶段，我们正在征集反馈意见
:::

## 嵌入版本 (Beta)

以下是 Koin 嵌入版本的示例：[Kotzilla 仓库](https://repository.kotzilla.io/#browse/browse:Koin-Embedded)
- 可用软件包：`embedded-koin-core`、`embedded-koin-android`
- 重定位从 `org.koin.*` 变更为 `embedded.koin.*`

使用此 Maven 仓库设置您的 Gradle 配置：
```kotlin
maven { 'https://repository.kotzilla.io/repository/kotzilla-platform/' }
```

## 重定位脚本 (Beta)

以下是一些帮助针对给定软件包名称重新构建 Koin 的脚本，有助于将其嵌入并避免与 Koin 框架的常规用法发生冲突。

更多详情请关注 Koin [重定位脚本](https://github.com/InsertKoinIO/koin-embedded?tab=readme-ov-file#koin-relocation-scripts) 项目。