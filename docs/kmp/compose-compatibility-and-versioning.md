[//]: # (title: 兼容性与版本)

Compose Multiplatform 发布与 Kotlin 和 Jetpack Compose 发布是独立的。本页包含有关 Compose Multiplatform 发布、Compose 发布周期以及组件兼容性的信息。

## 支持的平台

Compose Multiplatform %org.jetbrains.compose% 支持以下平台：

| 平台    | 最低版本                                                                                         |
|---------|--------------------------------------------------------------------------------------------------|
| Android | Android 5.0 (API level 21)                                                                       |
| iOS     | iOS 13                                                                                           |
| macOS   | macOS 12 x64, macOS 13 arm64                                                                     |
| Windows | Windows 10 (x86-64, arm64)                                                                       |
| Linux   | Ubuntu 20.04 (x86-64, arm64)                                                                     |
| Web     | 支持 [WasmGC] 的浏览器 ([https://kotlinlang.org/docs/wasm-troubleshooting.html#browser-versions](https://kotlinlang.org/docs/wasm-troubleshooting.html#browser-versions)) |

[//]: # (https://youtrack.jetbrains.com/issue/CMP-7539)

> 所有 Compose Multiplatform 发布版仅支持 64 位平台。
>
{style="note"}

## Kotlin 兼容性

最新版 Compose Multiplatform 始终与最新版 Kotlin 兼容。无需手动对齐它们的版本。请记住，使用任何一个产品的抢先体验预览版本都可能不稳定。

Compose Multiplatform 要求应用的 Compose Compiler Gradle plugin 版本与 Kotlin Multiplatform plugin 版本相同。关于详细信息，请参见 [](compose-compiler.md#migrating-a-compose-multiplatform-project)。

> 从 Compose Multiplatform 1.8.0 开始，UI 框架已完全过渡到 K2 compiler。因此，要使用最新版 Compose Multiplatform，你应该：
> * 你的项目应至少使用 Kotlin 2.1.0，
> * 仅当基于 Compose Multiplatform 的库是针对 Kotlin 2.1.0 或更高版本编译时，才可依赖这些库。
>
> 作为解决向后兼容性问题的一种变通方法，直到所有依赖项都更新，你可以通过将 `kotlin.native.cacheKind=none` 添加到你的 `gradle.properties` 文件中来关闭 Gradle 缓存。这会增加编译时间。
>
{style="warning"}

## Compose Multiplatform 桌面版发布的限制

Compose Multiplatform 桌面版有以下限制：

*   由于 [Skia] 绑定中使用的内存管理方案，仅支持 JDK 11 或更高版本。
*   由于 [`jpackage`](https://docs.oracle.com/en/java/javase/17/docs/specs/man/jpackage.html) 的限制，仅支持 JDK 17 或更高版本用于打包原生发行版。
*   在 macOS 上切换键盘布局时，OpenJDK 11.0.12 存在一个已知 [问题](https://github.com/JetBrains/compose-multiplatform/issues/940)。此问题在 OpenJDK 11.0.15 中无法重现。

## Jetpack Compose 与 Compose Multiplatform 发布周期

Compose Multiplatform 与 Google 开发的 Android [Jetpack Compose] 共享大量代码。我们将 Compose Multiplatform 发布周期与 Jetpack Compose 的发布周期对齐，以确保通用代码得到充分测试和稳定。

当 Jetpack Compose 发布新版本时，我们：

*   使用发布 commit 作为下一个 [Compose Multiplatform] 版本的基准。
*   添加对新平台特性的支持。
*   稳定所有平台。
*   发布新版本的 Compose Multiplatform。

Compose Multiplatform 发布与 Jetpack Compose 发布之间的时间间隔通常为 1–3 个月。

### Compose Multiplatform 的开发版本

Compose Multiplatform compiler plugin 的开发版本（例如，`1.8.2+dev2544`）没有固定的构建计划，旨在测试正式发布版之间的更新。

这些构建在 [Maven Central] 中不可用。要访问它们，请将此行添加到你的版本库列表：

```kotlin
maven("https://maven.pkg.jetbrains.space/public/p/compose/dev")
```

### 使用的 Jetpack Compose artifact

当你为 Android 构建应用程序时，Compose Multiplatform 使用 Google 发布的 artifact。例如，如果你应用 Compose Multiplatform 1.5.0 Gradle plugin 并将 `implementation(compose.material3)` 添加到你的 `dependencies` 中，那么你的项目将在 Android target 中使用 `androidx.compose.material3:material3:1.1.1` artifact（但在其他 target 中使用 `org.jetbrains.compose.material3:material3:1.5.0`）。

下表列出了 Compose Multiplatform 各版本使用的 Jetpack Compose artifact 版本：

| Compose Multiplatform version                                                     | Jetpack Compose version | Jetpack Compose Material3 version |
|-----------------------------------------------------------------------------------|-------------------------|-----------------------------------|
| [1.8.2](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.8.2)   | 1.8.2                   | 1.3.2                             |
| [1.7.3](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.7.3)   | 1.7.6                   | 1.3.1                             |
| [1.7.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.7.1)   | 1.7.5                   | 1.3.1                             |
| [1.7.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.7.0)   | 1.7.1                   | 1.3.0                             |
| [1.6.11](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.6.11) | 1.6.7                   | 1.2.1                             |
| [1.6.10](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.6.10) | 1.6.7                   | 1.2.1                             |
| [1.6.2](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.6.2)   | 1.6.4                   | 1.2.1                             |
| [1.6.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.6.1)   | 1.6.3                   | 1.2.1                             |
| [1.6.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.6.0)   | 1.6.1                   | 1.2.0                             |
| [1.5.12](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.5.12) | 1.5.4                   | 1.1.2                             |
| [1.5.11](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.5.11) | 1.5.4                   | 1.1.2                             |
| [1.5.10](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.5.10) | 1.5.4                   | 1.1.2                             |
| [1.5.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.5.1)   | 1.5.0                   | 1.1.1                             |
| [1.5.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.5.0)   | 1.5.0                   | 1.1.1                             |
| [1.4.3](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.4.3)   | 1.4.3                   | 1.0.1                             |
| [1.4.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.4.1)   | 1.4.3                   | 1.0.1                             |
| [1.4.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.4.0)   | 1.4.0                   | 1.0.1                             |
| [1.3.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.3.1)   | 1.3.3                   | 1.0.1                             |
| [1.3.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.3.0)   | 1.3.3                   | 1.0.1                             |
| [1.2.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.2.1)   | 1.2.1                   | 1.0.0-alpha14                     |
| [1.2.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.2.0)   | 1.2.1                   | 1.0.0-alpha14                     |
| [1.1.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.1.1)   | 1.1.0                   | 1.0.0-alpha05                     |
| [1.1.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.1.0)   | 1.1.0                   | 1.0.0-alpha05                     |
| [1.0.1](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.0.1)   | 1.1.0-beta02            | 1.0.0-alpha03                     |
| [1.0.0](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.0.0)   | 1.1.0-beta02            | 1.0.0-alpha03                     |