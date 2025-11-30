[//]: # (title: Compose Multiplatform 和 Jetpack Compose 之间的关系)

<web-summary>本文解释了 Compose Multiplatform 和 Jetpack Compose 之间的关系。你将了解这两个工具包及其如何协同工作。</web-summary>

![由 JetBrains 创建的 Compose Multiplatform，由 Google 创建的 Jetpack Compose](compose-multiplatform-and-jetpack-compose.png){width=730}

<tldr>
本文解释了 Compose Multiplatform 和 Jetpack Compose 之间的关系。
你将了解这两个工具包如何协同工作、库在不同目标平台上的处理方式，
以及如何为多平台项目创建或改编你自己的 UI 库。
</tldr>

Compose Multiplatform 是一个由 JetBrains 开发的跨平台 UI 工具包。
它通过支持额外的目标平台，扩展了 Google 适用于 Android 的 [Jetpack Compose](https://developer.android.com/jetpack/compose) 工具包。

Compose Multiplatform 使 Compose API 可从[公共 Kotlin 代码](multiplatform-discover-project.md#common-code)中获取，
允许你编写可在 Android、iOS、桌面和 Web 上运行的共享 Compose UI 代码。

|                  | **Compose Multiplatform**  | **Jetpack Compose** |
|------------------|----------------------------|---------------------|
| **平台**         | Android、iOS、桌面、Web    | Android             |
| **支持方**       | JetBrains                  | Google              |

## Jetpack Compose 与可组合项

Jetpack Compose 是一个用于构建原生 Android 界面的声明式 UI 工具包。
其基础是使用 `@Composable` 注解标记的_可组合_函数。
这些函数定义了 UI 的部分，并在底层数据发生变化时自动更新。
你可以组合可组合项来构建布局、处理用户输入、管理状态和应用动画。
Jetpack Compose 包含 `Text`、`Button`、`Row` 和 `Column` 等常用 UI 组件，你可以使用修饰符对其进行自定义。

Compose Multiplatform 建立在相同的原则之上。
它与 Jetpack Compose 共享 Compose 编译器和运行时，并使用相同的 API — `@Composable` 函数、诸如 `remember` 等状态管理工具、布局组件、修饰符和动画支持。
这意味着你可以将 Jetpack Compose 知识与 Compose Multiplatform 结合使用，为 Android、iOS、桌面和 Web 构建跨平台 UI。

## Compose Multiplatform 与 Jetpack Compose 特性

> 你可以从几乎任何 Jetpack Compose 资料中了解这两个 UI 框架的基本原理，包括 [Google 的官方文档](https://developer.android.com/jetpack/compose/documentation)。
> 
{style="tip"}

当然，Compose Multiplatform 具有平台特有的特性和考虑因素：

* [仅限 Android 的组件](compose-android-only-components.md)页面列出了与 Android 平台紧密关联的 API，因此无法从公共 Compose Multiplatform 代码中获取。
* 一些平台特有的 API，例如适用于桌面的窗口处理 API 或适用于 iOS 的 UIKit 兼容性 API，仅在其各自的平台上可用。

以下是常用组件和 API 的可用性概述：

|                                                                                                                     | **Compose Multiplatform**                                                                                 | **Jetpack Compose**                                                                                    |
|---------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------|
| [Compose Animation](https://developer.android.com/jetpack/androidx/releases/compose-animation)                      | Yes                                                                                                       | Yes                                                                                                    |
| [Compose Compiler](https://developer.android.com/jetpack/androidx/releases/compose-compiler)                        | Yes                                                                                                       | Yes                                                                                                    |
| [Compose Foundation](https://developer.android.com/jetpack/androidx/releases/compose-foundation)                    | Yes                                                                                                       | Yes                                                                                                    |
| [Compose Material](https://developer.android.com/jetpack/androidx/releases/compose-material)                        | Yes                                                                                                       | Yes                                                                                                    |
| [Compose Material 3](https://developer.android.com/jetpack/androidx/releases/compose-material30)                    | Yes                                                                                                       | Yes                                                                                                    |
| [Compose Runtime](https://developer.android.com/jetpack/androidx/releases/compose-runtime)                          | Yes，`androidx.compose.runtime.rxjava2` 和 `androidx.compose.runtime.rxjava3` 除外                        | Yes                                                                                                    |
| [Compose UI](https://developer.android.com/jetpack/androidx/releases/compose-ui)                                    | Yes                                                                                                       | Yes                                                                                                    |
| [Jetpack Lifecycle](https://developer.android.com/jetpack/androidx/releases/lifecycle)                              | [Yes](compose-lifecycle.md)                                                                               | Yes                                                                                                    |
| [Jetpack ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel)                           | [Yes](compose-viewmodel.md)                                                                               | Yes                                                                                                    |
| [Jetpack Navigation Compose](https://developer.android.com/jetpack/androidx/releases/navigation)                    | [Yes](compose-navigation-routing.md)                                                                      | Yes                                                                                                    |
| 资源                                                                                                                | [Compose Multiplatform 资源库](compose-multiplatform-resources.md) 使用 `Res` 类                          | [Android 资源系统](https://developer.android.com/jetpack/compose/resources) 使用 `R` 类                |
| [Maps Compose](https://developers.google.com/maps/documentation/android-sdk/maps-compose)                           | No                                                                                                        | Yes                                                                                                    |
| 用于 UI 组件、导航、架构等方面的[第三方库](#libraries-for-compose-multiplatform) | [Compose Multiplatform 库](https://github.com/terrakok/kmp-awesome?tab=readme-ov-file#-compose-ui)         | Jetpack Compose 和 Compose Multiplatform 库                                                            |

## 技术细节

Compose Multiplatform 建立在 Google 发布的代码和版本之上。
尽管 Google 的重点是适用于 Android 的 Jetpack Compose，但 Google 和 JetBrains 之间存在紧密协作，以支持 Compose Multiplatform。

Jetpack 包含 Foundation 和 Material 等第一方库，这些库由 Google 针对 Android 发布。
为了使[这些库](https://github.com/JetBrains/compose-multiplatform-core)提供的 API 可从公共代码中获取，JetBrains 维护了这些库的多平台版本，并将其发布到非 Android 目标平台。

> 关于发布周期，请参见[兼容性与版本](compose-compatibility-and-versioning.md#jetpack-compose-and-compose-multiplatform-release-cycles)页面。
> 
{style="tip"}

当你为 Android 构建 Compose Multiplatform 应用程序时，你将使用 Google 发布的 Jetpack Compose 构件。
例如，如果你将 `compose.material3` 添加到你的依赖项中，你的项目将在 Android 目标平台中使用 `androidx.compose.material3:material3`，而在其他目标平台中使用 `org.jetbrains.compose.material3:material3`。
这是基于多平台构件中的 Gradle 模块元数据自动完成的。

## 适用于 Compose Multiplatform 的库

通过使用 Compose Multiplatform，你可以将使用 Compose API 的库发布为 [Kotlin 多平台库](multiplatform-publish-lib-setup.md)。
这使得它们可从公共 Kotlin 代码中获取使用，面向多个平台。

因此，如果你正在构建一个使用 Compose API 的新库，请考虑利用这一点，并使用 Compose Multiplatform 将其构建为多平台库。
如果你已经为 Android 构建了一个 Jetpack Compose 库，请考虑将该库多平台化。
生态系统中已有[许多 Compose Multiplatform 库](https://github.com/terrakok/kmp-awesome#-compose-ui)可用。

当一个库使用 Compose Multiplatform 发布时，仅使用 Jetpack Compose 的应用仍然能够无缝地使用它；它们只需使用该库的 Android 构件。

## 接下来

关于以下组件的 Compose Multiplatform 实现，请阅读更多内容：
  * [Lifecycle](compose-lifecycle.md)
  * [资源](compose-multiplatform-resources.md)
  * [公共 ViewModel](compose-viewmodel.md)
  * [导航与路由](compose-navigation-routing.md)