[//]: # (title: 什么是 Kotlin Multiplatform)
[//]: # (description: Kotlin Multiplatform 是一项来自 JetBrains 的开源技术，它支持在 Android、iOS、桌面、Web 和服务器平台之间共享代码。)

Kotlin Multiplatform (KMP) 是一项来自 JetBrains 的开源技术，它支持在 Android、iOS、桌面、Web 和服务器平台之间共享代码，同时保留原生开发的优势。

借助 Compose Multiplatform，你还可以在多个平台之间共享 UI 代码，以实现最大化的代码复用。

## 企业选择 KMP 的原因

### 成本效益与更快的交付速度

Kotlin Multiplatform 有助于简化技术和组织流程：

*   你可以通过在不同平台间共享逻辑和 UI 代码来减少重复工作和维护成本。这使得在多个平台上同时发布特性成为可能。
*   团队协作变得更加容易，因为统一的逻辑在共享代码中可用，这使得团队成员之间更容易传递知识，并减少专属平台团队之间的重复工作。

除了更快的上市时间，**55%** 的用户表示在采用 KMP 后协作得到了改善，**65%** 的团队报告性能和质量有所提升（来自 KMP 2024 年第二季度调查）。

KMP 已被各种规模的组织投入生产使用，从初创公司到全球企业。诸如 Google、Duolingo、Forbes、Philips、McDonald's、Bolt、H&M、百度、快手和Bilibili等公司已经采用 KMP，因为它具备灵活性、原生性能、提供原生用户体验的能力、成本效益以及对渐进式采用的支持。[了解更多已采用 KMP 的公司](case-studies.topic)。

### 代码共享的灵活性

你可以按自己的方式共享代码：共享独立的模块，例如网络或存储，并随着时间推移逐步扩展共享代码。你还可以共享所有业务逻辑，同时保持 UI 原生，或使用 Compose Multiplatform 逐步迁移 UI。

![分阶段采用 KMP 的图示：共享部分逻辑和不共享 UI，共享所有逻辑但不共享 UI，共享逻辑和 UI](kmp-graphic.png){width="700"}

### iOS 上的原生体验

你可以完全使用 SwiftUI 或 UIKit 构建 UI，使用 Compose Multiplatform 在 Android 和 iOS 上创建统一的体验，或根据需要混合搭配原生和共享的 UI 代码。

无论采用何种方法，你都可以开发出在每个平台上都具有原生体验的应用程序：

<video src="https://www.youtube.com/watch?v=LB5a2FRrT94" width="700"/>

### 原生性能

Kotlin Multiplatform 利用 [Kotlin/Native](https://kotlinlang.org/docs/native-overview.html) 来生成原生二进制文件，并直接访问平台 API，适用于虚拟机不适用或不可能使用的场景，例如在 iOS 上。

这有助于在编写平台无关代码的同时实现接近原生的性能：

![图表显示 Compose Multiplatform 和 SwiftUI 在 iPhone 13 和 iPhone 16 上于 iOS 平台具有可比的性能](cmp-ios-performance.png){width="700"}

### 无缝工具链

IntelliJ IDEA 和 Android Studio 通过 [Kotlin Multiplatform IDE 插件](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform) 为 KMP 提供智能 IDE 支持，包括共同的 UI 预览、[Compose Multiplatform 的热重载](compose-hot-reload.md)、跨语言导航、重构以及在 Kotlin 和 Swift 代码之间进行调试。

<video src="https://youtu.be/ACmerPEQAWA" width="700"/>

### AI 驱动的开发

让 JetBrains 的 AI 编码代理 [Junie](https://jetbrains.com/junie) 处理 KMP 任务，从而让你的团队更快地推进。

## 探索 Kotlin Multiplatform 的用例

了解公司和开发者如何已经从共享 Kotlin 代码中获益：

*   了解公司如何在他们的代码库中成功采用 KMP，请访问我们的[案例研究页面](case-studies.topic)。
*   查看我们的[精选示例列表](multiplatform-samples.md)中各种示例应用程序，以及 GitHub 的 [kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample) 主题。
*   在 [klibs.io](https://klibs.io/) 上已有的数千个多平台库中搜索特定库。

## 学习基础知识

要快速了解 KMP 的实际运行，请尝试[快速入门](quickstart.md)。你将设置环境并在不同平台上运行一个示例应用程序。

选择一个用例
: *   要创建一个在平台之间共享 UI 和业务逻辑代码的应用程序，请遵循[共享逻辑和 UI 教程](compose-multiplatform-create-first-app.md)。
  *   要了解 Android 应用程序如何转换为多平台应用程序，请查阅我们的[迁移教程](multiplatform-integrate-in-existing-app.md)。
  *   要了解如何在不共享 UI 实现的情况下共享部分代码，请遵循[共享逻辑教程](multiplatform-create-first-app.md)。

深入技术细节
: *   从[基本项目结构](multiplatform-discover-project.md)开始。
  *   了解可用的[代码共享机制](multiplatform-share-on-platforms.md)。
  *   了解 KMP [项目中依赖项的工作方式](multiplatform-add-dependencies.md)。
  *   考虑不同的 [iOS 集成方法](multiplatform-ios-integration-overview.md)。
  *   了解 KMP 如何[编译代码](multiplatform-configure-compilations.md)并为各种[目标平台构建二进制文件](multiplatform-build-native-binaries.md)。
  *   阅读有关[发布多平台应用程序](multiplatform-publish-apps.md)或[多平台库](multiplatform-publish-lib-setup.md)的信息。

## 大规模采用 Kotlin Multiplatform

在团队中采用跨平台框架可能是一个挑战。要了解其优势以及潜在问题的解决方案，请查阅我们关于跨平台开发的高级概述：

*   [什么是跨平台移动开发？](cross-platform-mobile-development.md)：提供了跨平台应用程序的不同方法和实现概述。
*   [如何向团队引入多平台移动开发](multiplatform-introduce-your-team.md)：提供了在团队中引入跨平台开发的策略。
*   [采用 Kotlin Multiplatform 并为项目赋能的十大理由](multiplatform-reasons-to-try.md)：列出了将 Kotlin Multiplatform 作为跨平台解决方案的理由。