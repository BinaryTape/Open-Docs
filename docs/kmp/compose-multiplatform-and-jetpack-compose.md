[//]: # (title: Compose Multiplatform 和 Jetpack Compose)

<web-summary>本文解释了 Compose Multiplatform 和 Jetpack Compose 之间的关系。你将了解到更多关于这两个工具包及其如何保持一致的信息。</web-summary>

![由 JetBrains 创建的 Compose Multiplatform，由 Google 创建的 Jetpack Compose](compose-multiplatform-and-jetpack-compose.png){width=730}

<tldr>
本文解释了 Compose Multiplatform 和 Jetpack Compose 之间的关系。
你将了解这两个工具包如何保持一致、库如何在不同目标平台中处理，
以及如何为多平台项目创建或调整自己的 UI 库。
</tldr>

Compose Multiplatform 是一个由 JetBrains 开发的跨平台 UI 工具包。
它通过支持额外的目标平台来扩展 Google 针对 Android 的 [Jetpack Compose](https://developer.android.com/jetpack/compose) 工具包。

Compose Multiplatform 使 Compose API 可从 [公共 Kotlin 代码](multiplatform-discover-project.md#common-code) 中获取，
让你能够编写可在 Android、iOS、桌面和 Web 上运行的共享 Compose UI 代码。

|                  | **Compose Multiplatform**  | **Jetpack Compose** |
|------------------|----------------------------|---------------------|
| **平台**         | Android, iOS, 桌面, Web    | Android             |
| **支持方**       | JetBrains                  | Google              |

## Jetpack Compose 和 composable 函数

Jetpack Compose 是一个声明式 UI 工具包，用于构建原生 Android 界面。
其基础是使用 `@Composable` 注解标记的 _可组合_ 函数。
这些函数定义了 UI 的各个部分，并在底层数据变化时自动更新。
你可以组合 composable 函数来构建布局、处理用户输入、管理状态和应用动画。
Jetpack Compose 包含 `Text`、`Button`、`Row` 和 `Column` 等常用 UI 组件，你可以使用修饰符对其进行自定义。

Compose Multiplatform 基于相同的原则构建。
它与 Jetpack Compose 共享 Compose 编译器和运行时，并使用相同的 API——`@Composable` 函数、
状态管理工具（如 `remember`）、布局组件、修饰符和动画支持。
这意味着你可以将你的 Jetpack Compose 知识应用于 Compose Multiplatform，以构建适用于 Android、
iOS、桌面和 Web 的跨平台 UI。

## Compose Multiplatform 和 Jetpack Compose 特性

> 你可以从几乎所有 Jetpack Compose 材料中学习这两个 UI 框架的基础知识，
> 包括 [Google 的官方文档](https://developer.android.com/jetpack/compose/documentation)。
> 
{style="tip"}

当然，Compose Multiplatform 具有平台特有的特性和考量：

*   [仅限 Android 的组件](compose-android-only-components.md) 页面列出了与 Android 平台紧密耦合的 API，
    因此无法从公共 Compose Multiplatform 代码中使用。
*   一些平台特有的 API，例如适用于桌面的窗口处理 API 或适用于 iOS 的 UIKit 兼容 API，
    只在其各自的平台上可用。

以下是常用组件和 API 的可用性概览：

|                                                                                                                     | **Compose Multiplatform**                                                                                 | **Jetpack Compose**                                                                                    |
|---------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| [Compose Animation](https://developer.android.com/jetpack/androidx/releases/compose-animation)                      | 是                                                                                                        | 是                                                                                                     |
| [Compose Compiler](https://developer.android.com/jetpack/androidx/releases/compose-compiler)                        | 是                                                                                                        | 是                                                                                                     |
| [Compose Foundation](https://developer.android.com/jetpack/androidx/releases/compose-foundation)                    | 是                                                                                                        | 是                                                                                                     |
| [Compose Material](https://developer.android.com/jetpack/androidx/releases/compose-material)                        | 是                                                                                                        | 是                                                                                                     |
| [Compose Material 3](https://developer.android.com/jetpack/androidx/releases/compose-material30)                    | 是                                                                                                        | 是                                                                                                     |
| [Compose Runtime](https://developer.android.com/jetpack/androidx/releases/compose-runtime)                          | 是，除了 `androidx.compose.runtime.rxjava2` 和 `androidx.compose.runtime.rxjava3`                       | 是                                                                                                     |
| [Compose UI](https://developer.android.com/jetpack/androidx/releases/compose-ui)                                    | 是                                                                                                        | 是                                                                                                     |
| [Jetpack Lifecycle](https://developer.android.com/jetpack/androidx/releases/lifecycle)                              | [是](compose-lifecycle.md)                                                                                | 是                                                                                                     |
| [Jetpack ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel)                           | [是](compose-viewmodel.md)                                                                                | 是                                                                                                     |
| [Jetpack Navigation Compose](https://developer.android.com/jetpack/androidx/releases/navigation)                    | [是](compose-navigation-routing.md)                                                                       | 是                                                                                                     |
| 资源                                                                                                                | [Compose Multiplatform 资源库](compose-multiplatform-resources.md) 使用 `Res` 类                          | [Android 资源系统](https://developer.android.com/jetpack/compose/resources) 使用 `R` 类              |
| [Maps Compose](https://developers.google.com/maps/documentation/android-sdk/maps-compose)                           | 否                                                                                                        | 是                                                                                                     |
| [第三方库](#libraries-for-compose-multiplatform) 用于 UI 组件、导航、架构等                                           | [Compose Multiplatform 库](https://github.com/terrakok/kmp-awesome?tab=readme-ov-file#-compose-ui) | Jetpack Compose 和 Compose Multiplatform 库                                                        |

## 技术细节

Compose Multiplatform 基于 Google 发布的代码和版本构建。
虽然 Google 专注于 Android 平台上的 Jetpack Compose，但 Google 和 JetBrains 之间仍紧密协作，以支持 Compose Multiplatform 的发展。

Jetpack 包含 Foundation 和 Material 等第一方库，这些库由 Google 针对 Android 发布。
为了使 [这些库](https://github.com/JetBrains/compose-multiplatform-core) 提供的 API 可从公共代码中使用，
JetBrains 维护了这些库的多平台版本，并为除 Android 以外的目标平台发布。

> 在 [兼容性和版本](compose-compatibility-and-versioning.md#jetpack-compose-and-compose-multiplatform-release-cycles) 页面了解更多关于发布周期的信息。
> 
{style="tip"}

当你为 Android 构建 Compose Multiplatform 应用程序时，你使用的是 Google 发布的 Jetpack Compose 构件。
例如，如果你将 `compose.material3` 添加到你的依赖项中，你的项目将在 Android 目标中使用 `androidx.compose.material3:material3`，
而在其他目标中使用 `org.jetbrains.compose.material3:material3`。
这是根据多平台构件中的 Gradle 模块元数据自动完成的。

## 适用于 Compose Multiplatform 的库

通过使用 Compose Multiplatform，你可以将使用 Compose API 的库作为 [Kotlin Multiplatform 库](multiplatform-publish-lib-setup.md) 发布。
这使得它们可从公共 Kotlin 代码中使用，面向多个平台。

因此，如果你正在构建一个使用 Compose API 的新库，请考虑利用 Compose Multiplatform 将其构建为多平台库。
如果你已经为 Android 构建了一个 Jetpack Compose 库，请考虑将其转换为多平台库。
生态系统中已有 [许多可用的 Compose Multiplatform 库](https://github.com/terrakok/kmp-awesome#-compose-ui)。

当一个库使用 Compose Multiplatform 发布时，仅使用 Jetpack Compose 的应用仍然能够无缝地使用它；
它们只需使用该库的 Android 构件。

## 后续内容

阅读更多关于以下组件的 Compose Multiplatform 实现内容：
  * [](compose-lifecycle.md)
  * [资源](compose-multiplatform-resources.md)
  * [](compose-viewmodel.md)
  * [](compose-navigation-routing.md)