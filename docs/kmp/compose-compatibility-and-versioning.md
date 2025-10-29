[//]: # (title: 兼容性与版本)

Compose Multiplatform 的发布版本与 Kotlin 和 Jetpack Compose 的发布版本是独立发布的。本页面包含有关 Compose Multiplatform 发布版本、Compose 发布周期以及组件兼容性的信息。

## 支持的平台

Compose Multiplatform %org.jetbrains.compose% 支持以下平台：

| 平台 | 最低版本 |
|----------|--------------------------------------------------------------------------------------------------------|
| Android  | Android 5.0 (API level 21)                                                                             |
| iOS      | iOS 13                                                                                                 |
| macOS    | macOS 12 x64, macOS 13 arm64                                                                           |
| Windows  | Windows 10 (x86-64, arm64)                                                                             |
| Linux    | Ubuntu 20.04 (x86-64, arm64)                                                                           |
| Web      | 支持 [WasmGC 的浏览器](https://kotlinlang.org/docs/wasm-configuration.html#browser-versions) |

[//]: # (https://youtrack.jetbrains.com/issue/CMP-7539)

> 所有 Compose Multiplatform 发布版本仅支持 64 位平台。
>
{style="note"}

## Kotlin 兼容性

最新版本的 Compose Multiplatform 始终与最新版本的 Kotlin 兼容。
无需手动对齐它们的版本。
请记住，使用任何一个产品的抢先体验预览 (EAP) 版本仍然可能不稳定。

Compose Multiplatform 要求应用的 Compose Compiler Gradle 插件与 Kotlin Multiplatform 插件的版本相同。
关于详细信息，请参见 [undefined](compose-compiler.md#migrating-a-compose-multiplatform-project)。

> 从 Compose Multiplatform 1.8.0 开始，该 UI 框架已完全过渡到 K2 编译器。
> 因此，要使用最新的 Compose Multiplatform 发布版本，您应该：
> * 您的项目至少使用 Kotlin 2.1.0；
> * 仅当基于 Compose Multiplatform 的库是针对 Kotlin 2.1.0 或更高版本编译时，才依赖它们。
>
> 作为解决向后兼容性问题的临时解决方案，直到您的所有依赖项都更新，
> 您可以通过在 `gradle.properties` 文件中添加 `kotlin.native.cacheKind=none` 来关闭 Gradle 缓存。
> 这将增加编译时间。
>
{style="warning"}

## Compose Multiplatform 桌面发布版本的限制

由于 [Skia](https://skia.org/) 绑定中使用的内存管理方案，Compose Multiplatform 桌面版仅支持 JDK 11 或更高版本。

此外：
* 由于 [`jpackage`](https://docs.oracle.com/en/java/javase/17/docs/specs/man/jpackage.html) 的限制，仅支持 JDK 17 或更高版本用于打包原生分发版。
* 在 macOS 上切换键盘布局时，OpenJDK 11.0.12 存在一个已知 [问题](https://github.com/JetBrains/compose-multiplatform/issues/940)。
  此问题在 OpenJDK 11.0.15 中无法重现。

## Jetpack Compose 与 Compose Multiplatform 发布周期

Compose Multiplatform 与 Google 开发的 Android 框架 [Jetpack Compose](https://developer.android.com/jetpack/compose) 共享大量代码。我们将 Compose Multiplatform 发布周期与 Jetpack Compose 的发布周期对齐，以确保通用代码得到充分测试和稳定。

当 Jetpack Compose 发布新版本时，我们：

1.  使用该发布版本的 commit 作为下一个 [Compose Multiplatform](https://github.com/JetBrains/androidx) 版本的基础。
2.  添加对新平台特性的支持。
3.  稳定所有平台。
4.  发布新版本的 Compose Multiplatform。

Compose Multiplatform 发布版本与 Jetpack Compose 发布版本之间的间隔通常为 1–3 个月。

### Compose Multiplatform 的开发版本

Compose Multiplatform 编译器插件的开发版本（例如 `1.8.2+dev2544`）的构建没有固定日程，旨在测试正式发布版本之间的更新。

这些构建项在 [Maven Central](https://central.sonatype.com/) 中不可用。
要访问它们，请将此行添加到您的版本库列表：

```kotlin
maven("https://maven.pkg.jetbrains.space/public/p/compose/dev")
```

### 使用的 Jetpack Compose 构件

当您为 Android 构建您的应用程序时，Compose Multiplatform 会使用 Google 发布的构件。
例如，如果您应用 Compose Multiplatform 1.5.0 Gradle 插件并将 `implementation(compose.material3)` 添加到您的 `dependencies` 中，那么您的项目将在 Android 目标平台中使用 `androidx.compose.material3:material3:1.1.1` 构件（但在其他目标平台中使用 `org.jetbrains.compose.material3:material3:1.5.0`）。

下表列出了每个 Compose Multiplatform 版本使用的 Jetpack Compose 构件版本：

| Compose Multiplatform 版本 | Jetpack Compose 版本 | Jetpack Compose Material3 版本 |
|-----------------------------------------------------------------------------------|-------------------------|-----------------------------------|
| [1.9.2](https://github.com/JetBrains/compose-multiplatform/releases/tag/v1.9.2)   | 1.9.4                   | 1.4.0                             |
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