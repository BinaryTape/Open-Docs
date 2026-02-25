[//]: # (title: Compose Multiplatform 与 Jetpack Compose 之间的关系)

<web-summary>本文介绍了 Compose Multiplatform 与 Jetpack Compose 之间的关系。您将详细了解这两个工具包以及它们如何保持一致。</web-summary>

![由 JetBrains 创建的 Compose Multiplatform，由 Google 创建的 Jetpack Compose](compose-multiplatform-and-jetpack-compose.png){width=730}

<tldr>
本文介绍了 Compose Multiplatform 与 Jetpack Compose 之间的关系。
您将了解这两个工具包如何保持一致、跨目标的库如何处理，
以及如何为多平台项目创建或调整您自己的 UI 库。
</tldr>

Compose Multiplatform 是由 JetBrains 开发的跨平台 UI 工具包。
它通过支持额外的目标平台，扩展了 Google 针对 Android 的 [Jetpack Compose](https://developer.android.com/jetpack/compose) 工具包。

Compose Multiplatform 使 Compose API 可在 [通用 Kotlin 代码](multiplatform-discover-project.md#common-code) 中使用，
允许您编写可运行在 Android、iOS、桌面端和 Web 端共享的 Compose UI 代码。

|                  | **Compose Multiplatform**  | **Jetpack Compose** |
|------------------|----------------------------|---------------------|
| **平台**    | Android、iOS、桌面端、Web 端 | Android             |
| **支持者** | JetBrains                  | Google              |

## Jetpack Compose 与可组合函数 (Composables)

Jetpack Compose 是一个用于构建原生 Android 界面的声明式 UI 工具包。
它的基础是带有 `@Composable` 注解的 *可组合* 函数。
这些函数定义了 UI 的各个部分，并在底层数据发生变化时自动更新。
您可以结合使用可组合函数来构建布局、处理用户输入、管理状态并应用动画。
Jetpack Compose 包含了常用的 UI 组件，如 `Text`、`Button`、`Row` 和 `Column`，您可以使用修饰符对其进行自定义。

Compose Multiplatform 建立在相同的原则之上。 
它与 Jetpack Compose 共享 Compose 编译器和运行时，并使用相同的 API —— `@Composable` 函数、
诸如 `remember` 之类的状态管理工具、布局组件、修饰符以及动画支持。
这意味着您可以将 Jetpack Compose 的知识复用到 Compose Multiplatform 中，为 Android、iOS、桌面端和 Web 端构建跨平台 UI。

## Compose Multiplatform 与 Jetpack Compose 的功能

> 您可以从几乎任何 Jetpack Compose 资料中学习这两个 UI 框架的基础知识，
> 包括 [Google 的官方文档](https://developer.android.com/jetpack/compose/documentation)。
> 
{style="tip"}

当然，Compose Multiplatform 也有针对特定平台的特性和考量：

* [仅限 Android 的组件](compose-android-only-components.md) 页面列出了与 Android 平台紧密相关的 API，因此无法在通用 Compose Multiplatform 代码中使用。
* 某些平台特定的 API，例如桌面端的窗口处理 API 或 iOS 的 UIKit 互操作 API，仅在各自的平台上可用。

以下是常用组件和 API 可用性的概览：

|                                                                                                                     | **Compose Multiplatform**                                                                                 | **Jetpack Compose**                                                                                    |
|---------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| [Compose Animation](https://developer.android.com/jetpack/androidx/releases/compose-animation)                      | 是                                                                                                       | 是                                                                                                    |
| [Compose Compiler](https://developer.android.com/jetpack/androidx/releases/compose-compiler)                        | 是                                                                                                       | 是                                                                                                    |
| [Compose Foundation](https://developer.android.com/jetpack/androidx/releases/compose-foundation)                    | 是                                                                                                       | 是                                                                                                    |
| [Compose Material](https://developer.android.com/jetpack/androidx/releases/compose-material)                        | 是                                                                                                       | 是                                                                                                    |
| [Compose Material 3](https://developer.android.com/jetpack/androidx/releases/compose-material30)                    | 是                                                                                                       | 是                                                                                                    |
| [Compose Runtime](https://developer.android.com/jetpack/androidx/releases/compose-runtime)                          | 是，`androidx.compose.runtime.rxjava2` 和 `androidx.compose.runtime.rxjava3` 除外                 | 是                                                                                                    |
| [Compose UI](https://developer.android.com/jetpack/androidx/releases/compose-ui)                                    | 是                                                                                                       | 是                                                                                                    |
| [Jetpack Lifecycle](https://developer.android.com/jetpack/androidx/releases/lifecycle)                              | [是](compose-lifecycle.md)                                                                               | 是                                                                                                    |
| [Jetpack ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel)                           | [是](compose-viewmodel.md)                                                                               | 是                                                                                                    |
| [Jetpack Navigation Compose](https://developer.android.com/jetpack/androidx/releases/navigation)                    | [是](compose-navigation-routing.md)                                                                      | 是                                                                                                    |
| 资源                                                                                                           | 使用 `Res` 类的 [Compose Multiplatform 资源库](compose-multiplatform-resources.md)       | 使用 `R` 类的 [Android 资源系统](https://developer.android.com/jetpack/compose/resources) |
| [Maps Compose](https://developers.google.com/maps/documentation/android-sdk/maps-compose)                           | 否                                                                                                        | 是                                                                                                    |
| 用于 UI 组件、导航、架构等的 [第三方库](#libraries-for-compose-multiplatform) | [Compose Multiplatform 库](https://github.com/terrakok/kmp-awesome?tab=readme-ov-file#-compose-ui) | Jetpack Compose 和 Compose Multiplatform 库                                                    |

## 技术细节

Compose Multiplatform 基于 Google 发布的代码和版本构建。
虽然 Google 的重点是针对 Android 的 Jetpack Compose，
但 Google 和 JetBrains 之间保持着密切协作，以支持 Compose Multiplatform。

Jetpack 包含了一些第一方库，如 Foundation 和 Material，这些库由 Google 为 Android 发布。
为了使 [这些库](https://github.com/JetBrains/compose-multiplatform-core) 提供的 API 能在通用代码中使用，
JetBrains 维护了这些库的多平台版本，并为 Android 以外的目标平台发布。

> 在 [兼容性与版本](compose-compatibility-and-versioning.md#jetpack-compose-and-compose-multiplatform-release-cycles) 页面详细了解发布周期。
> 
{style="tip"}

当您为 Android 构建 Compose Multiplatform 应用程序时，您使用的是由 Google 发布的原生 Jetpack Compose 工件。
例如，如果您将 `compose.material3` 添加到依赖项中，您的项目将在 Android 目标中使用 `androidx.compose.material3:material3`，而在其他目标中使用 `org.jetbrains.compose.material3:material3`。这是基于多平台工件中的 Gradle Module Metadata 自动完成的。

## Compose Multiplatform 库

通过使用 Compose Multiplatform，您可以将使用 Compose API 的库作为 [Kotlin Multiplatform 库](multiplatform-publish-lib-setup.md) 发布。
这使得它们可以在通用 Kotlin 代码中使用，并支持多个平台。

因此，如果您正在构建一个带有 Compose API 的新库，请考虑利用这一优势，使用 Compose Multiplatform 将其构建为多平台库。
如果您已经构建了一个针对 Android 的 Jetpack Compose 库，请考虑将该库转换为多平台库。
生态系统中已经有 [许多 Compose Multiplatform 库](https://github.com/terrakok/kmp-awesome#-compose-ui) 可用。

当一个库使用 Compose Multiplatform 发布时，仅使用 Jetpack Compose 的应用仍然可以无缝地使用它；
它们只需直接使用该库的 Android 工件即可。

## 后续步骤

阅读有关以下组件的 Compose Multiplatform 实现的更多信息：
  * [生命周期 (Lifecycle)](compose-lifecycle.md)
  * [资源 (Resources)](compose-multiplatform-resources.md)
  * [通用 ViewModel](compose-viewmodel.md)
  * [导航与路由](compose-navigation-routing.md)