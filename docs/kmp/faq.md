[//]: # (title: 常见问题)

## Kotlin Multiplatform

### 什么是 Kotlin Multiplatform？

[Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/) (KMP) 是 JetBrains 推出的一项开源技术，用于灵活的跨平台开发。它允许您为各种平台创建应用程序，并在它们之间高效地重用代码，同时保留原生编程的优势。借助 Kotlin Multiplatform，您可以为 Android、iOS、桌面、Web、服务器端及其他平台开发应用。

### 我可以使用 Kotlin Multiplatform 共享 UI 吗？

是的，您可以使用 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 共享 UI，它是 JetBrains 基于 Kotlin 和 [Jetpack Compose](https://developer.android.com/jetpack/compose) 开发的声明式 UI 框架。该框架允许您为 iOS、Android、桌面和 Web 等平台创建共享 UI 组件，帮助您在不同设备和平台之间保持一致的用户界面。

了解更多信息，请参见 [Compose Multiplatform](#compose-multiplatform) 部分。

### Kotlin Multiplatform 支持哪些平台？

Kotlin Multiplatform 支持 Android、iOS、桌面、Web、服务器端及其他平台。了解有关 [支持平台](supported-platforms.md) 的更多信息。

### 我应该在哪个 IDE 中开发我的跨平台应用？

我们推荐使用 Android Studio IDE 处理 Kotlin Multiplatform 项目。关于可用替代方案的更多信息，请参阅 [推荐的 IDE 和代码编辑器](recommended-ides.md)。

### 如何创建新的 Kotlin Multiplatform 项目？

[创建 Kotlin Multiplatform 应用](get-started.topic) 教程提供了创建 Kotlin Multiplatform 项目的分步说明。您可以决定共享什么——仅逻辑或逻辑和 UI 都共享。

### 我有一个现有的 Android 应用程序。如何将其迁移到 Kotlin Multiplatform？

[让您的 Android 应用程序在 iOS 上运行](multiplatform-integrate-in-existing-app.md) 分步教程解释了如何让您的 Android 应用程序在 iOS 上使用原生 UI 运行。如果您还想与 Compose Multiplatform 共享 UI，请参见 [相应的答案](#i-have-an-existing-android-application-that-uses-jetpack-compose-what-should-i-do-to-migrate-it-to-other-platforms)。

### 在哪里可以获得可供试用的完整示例？

这里有 [真实示例列表](multiplatform-samples.md)。

### 在哪里可以找到真实 Kotlin Multiplatform 应用程序的列表？哪些公司在生产环境中使用 KMP？

查阅我们的 [案例研究列表](case-studies.topic)，借鉴其他已在生产环境中采用 Kotlin Multiplatform 的公司。

### 哪些操作系统可以与 Kotlin Multiplatform 配合使用？

如果您要处理共享代码或平台特有的代码（iOS 除外），您可以在您的 IDE 支持的任何操作系统上工作。

了解更多有关 [推荐 IDE](recommended-ides.md) 的信息。

如果您想编写 iOS 特有的代码并在模拟器或真实设备上运行 iOS 应用程序，请使用运行 macOS 的 Mac。这是因为根据 Apple 的要求，iOS 模拟器只能在 macOS 上运行，而不能在 Microsoft Windows 或 Linux 等其他操作系统上运行。

### 如何在 Kotlin Multiplatform 项目中编写并发代码？

您仍然可以在 Kotlin Multiplatform 项目中使用协程和 flow 编写异步代码。如何调用此代码取决于您从何处调用它。从 Kotlin 代码调用挂起函数和 flow 已有广泛文档说明，尤其是在 Android 上。 [从 Swift 代码调用它们](https://kotlinlang.org/docs/native-arc-integration.html#completion-handlers) 需要更多工作，关于更多细节，请参见 [KT-47610](https://youtrack.jetbrains.com/issue/KT-47610)。

<!-- when adding SKIE back to the tutorial, add it here as well
and uncomment the paragraph below --> 

当前从 Swift 调用挂起函数和 flow 的最佳方法是使用 [KMP-NativeCoroutines](https://github.com/rickclephas/KMP-NativeCoroutines) 等插件和库，结合 Swift 的 `async`/`await` 或 Combine 和 RxSwift 等库。

<!-- At the moment, KMP-NativeCoroutines is the more
tried-and-tested solution, and it supports `async`/`await`, Combine, and RxSwift approaches to concurrency. SKIE is easier
to set up and less verbose. For instance, it maps Kotlin `Flow` to Swift `AsyncSequence` directly. Both of these libraries
support the proper cancellation of coroutines. -->

了解如何使用它们，请参见 [](multiplatform-upgrade-app.md)。

### 什么是 Kotlin/Native，它与 Kotlin Multiplatform 有何关系？

[Kotlin/Native](https://kotlinlang.org/docs/native-overview.html) 是一种将 Kotlin 代码编译为原生二进制文件的技术，这些二进制文件无需虚拟机即可运行。它包括一个基于 [LLVM](https://llvm.org/) 的 Kotlin 编译器后端以及 Kotlin 标准库的原生实现。

Kotlin/Native 主要设计用于支持在那些虚拟机不适用或不可能运行的平台（例如嵌入式设备和 iOS）上进行编译。当您需要生成一个无需额外运行时或虚拟机的独立程序时，它尤其适用。

例如，在移动应用程序中，用 Kotlin 编写的共享代码通过 Kotlin/JVM 编译为 Android 的 JVM 字节码，并通过 Kotlin/Native 编译为 iOS 的原生二进制文件。这使其在两个平台上与 Kotlin Multiplatform 的集成无缝衔接。

![Kotlin/Native 和 Kotlin/JVM 二进制文件](kotlin-native-and-jvm-binaries.png){width=350}

### 如何加速 Kotlin Multiplatform 模块针对原生平台（iOS、macOS、Linux）的编译？

关于 [提高 Kotlin/Native 编译时间](https://kotlinlang.org/docs/native-improving-compilation-time.html) 的提示，请参见此处。

## Compose Multiplatform

### 什么是 Compose Multiplatform？

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 是 JetBrains 开发的一款现代声明式和反应式 UI 框架，它提供了一种只需少量 Kotlin 代码即可构建用户界面的简单方式。它还允许您编写一次 UI 即可在任何支持的平台（iOS、Android、桌面（Windows、macOS、Linux）和 Web）上运行。

### 它与用于 Android 的 Jetpack Compose 有何关系？

Compose Multiplatform 与 [Jetpack Compose](https://developer.android.com/jetpack/compose)（Google 开发的 Android UI 框架）共享其大部分 API。实际上，当您使用 Compose Multiplatform 面向 Android 时，您的应用直接在 Jetpack Compose 上运行。Compose Multiplatform 所面向的其他平台可能具有与 Jetpack Compose 在 Android 上的底层实现细节不同，但它们仍为您提供相同的 API。

关于详细信息，请参见 [框架相互关系概述](compose-multiplatform-and-jetpack-compose.md)。

### 我可以在哪些平台之间共享我的 UI？

我们希望您能够选择在任何流行的平台组合（Android、iOS、桌面（Linux、macOS、Windows）和 Web（基于 Wasm））之间共享 UI。Compose Multiplatform 目前仅在 Android、iOS 和桌面平台稳定。关于更多详细信息，请参见 [支持平台](supported-platforms.md)。

### 我可以在生产环境中使用 Compose Multiplatform 吗？

Compose Multiplatform 的 Android、iOS 和桌面目标平台已稳定。您可以在生产环境中使用它们。

基于 WebAssembly 的 Compose Multiplatform for Web 版本处于 Alpha 阶段，这意味着它正在积极开发中。您可以谨慎使用它，并预期可能出现迁移问题。它具有与 Compose Multiplatform for iOS、Android 和桌面平台相同的 UI。

### 如何创建新的 Compose Multiplatform 项目？

[创建带有共享逻辑和 UI 的 Compose Multiplatform 应用](compose-multiplatform-create-first-app.md) 教程提供了创建用于 Android、iOS 和桌面的 Compose Multiplatform 项目的分步说明。您还可以观看由 Kotlin 开发者布道师 Sebastian Aigner 创建的 YouTube [视频教程](https://www.youtube.com/watch?v=5_W5YKPShZ4)。

### 我应该使用哪个 IDE 来构建 Compose Multiplatform 应用？

我们推荐使用 Android Studio IDE。关于更多详细信息，请参见 [推荐的 IDE 和代码编辑器](recommended-ides.md)。

### 我可以试用演示应用程序吗？在哪里可以找到它？

您可以试用我们的 [示例](multiplatform-samples.md)。

### Compose Multiplatform 是否自带组件？

是的，Compose Multiplatform 提供对 [Material 3](https://m3.material.io/) 组件的全面支持。

### 我可以在多大程度上自定义 Material 组件的外观？

您可以使用 Material 的主题功能自定义颜色、字体和内边距。如果您想创建独特设计，可以创建自定义组件和布局。

### 我可以在现有的 Kotlin Multiplatform 应用中共享 UI 吗？

如果您的应用程序使用原生 API 作为其 UI（这是最常见的情况），您可以逐步将部分代码重写为 Compose Multiplatform，因为它为此提供了互操作性。您可以将原生 UI 替换为特殊的互操作视图，该视图封装了用 Compose 编写的公共 UI。

### 我有一个现有的 Android 应用程序，它使用 Jetpack Compose。我应该如何将其迁移到其他平台？

应用的迁移包括两个部分：迁移 UI 和迁移逻辑。迁移的复杂性取决于您的应用程序的复杂性以及所使用的 Android 特有的库的数量。您可以无需更改即可将大部分屏幕迁移到 Compose Multiplatform。所有 Jetpack Compose 组件都受支持。然而，一些 API 仅在 Android 目标平台中工作——它们可能是 Android 特有的，或者尚未移植到其他平台。例如，资源处理是 Android 特有的，因此您需要迁移到 [Compose Multiplatform 资源库](compose-multiplatform-resources.md) 或使用社区解决方案。Android [导航库](https://developer.android.com/jetpack/androidx/releases/navigation) 也是 Android 特有的，但有可用的 [社区替代方案](compose-navigation-routing.md)。关于仅适用于 Android 的组件的更多信息，请参见当前 [Android 专用 API 列表](compose-android-only-components.md)。

您需要将 [业务逻辑迁移到 Kotlin Multiplatform](multiplatform-integrate-in-existing-app.md)。当您尝试将代码移动到共享模块时，使用 Android 依赖项的部分将停止编译，您需要重写它们。

*   您可以重写使用仅限 Android 依赖项的代码，转而使用多平台库。一些库可能已支持 Kotlin Multiplatform，因此无需更改。您可以查阅 [KMP-awesome](https://github.com/terrakok/kmp-awesome) 库列表。
*   或者，您可以将公共代码与平台特有的逻辑分离，并 [提供公共接口](multiplatform-connect-to-apis.md)，这些接口根据平台的不同以不同方式实现。在 Android 上，实现可以使用您现有功能，而在 iOS 等其他平台上，您需要为公共接口提供新的实现。

### 我可以将 Compose 屏幕集成到现有的 iOS 应用中吗？

是的。Compose Multiplatform 支持不同的集成场景。关于与 iOS UI 框架集成 的更多信息，请参见 [与 SwiftUI 集成](compose-swiftui-integration.md) 和 [与 UIKit 集成](compose-uikit-integration.md)。

### 我可以将 UIKit 或 SwiftUI 组件集成到 Compose 屏幕中吗？

是的，您可以。请参见 [与 SwiftUI 集成](compose-swiftui-integration.md) 和 [与 UIKit 集成](compose-uikit-integration.md)。

<!-- Need to revise
### What happens when my mobile OS updates and introduces new platform capabilities?

You can use them in platform-specific parts of your codebase once Kotlin supports them. We do our best to support them
in the upcoming Kotlin version. All new Android capabilities provide Kotlin or Java APIs, and wrappers over iOS APIs are
generated automatically.
-->

### 当我的移动操作系统更新并更改系统组件的视觉样式或其行为时会发生什么？

操作系统更新后，您的 UI 将保持不变，因为所有组件都绘制在画布上。如果您将原生 iOS 组件嵌入到屏幕中，更新可能会影响它们的显示。

## 未来计划

### Kotlin Multiplatform 的演进计划是什么？

JetBrains 正在大力投入，旨在为多平台开发提供最佳体验，并消除多平台用户现有的痛点。我们计划改进核心 Kotlin Multiplatform 技术、与 Apple 生态系统的集成、工具，以及我们的 Compose Multiplatform UI 框架。 [查阅我们的路线图](https://blog.jetbrains.com/kotlin/2024/10/kotlin-multiplatform-development-roadmap-for-2025/)。

### Compose Multiplatform 何时会变得稳定？

Compose Multiplatform 在 Android、iOS 和桌面平台已稳定，而 Web 平台支持处于 Alpha 阶段。我们正在致力于发布 Web 平台的稳定版本，具体日期待公布。

关于稳定性状态的更多信息，请参见 [支持平台](supported-platforms.md)。

### Kotlin 和 Compose Multiplatform 中对 Web 目标平台的未来支持如何？

我们目前正将资源集中在 WebAssembly (Wasm) 上，它显示出巨大潜力。您可以尝试使用我们新的 [Kotlin/Wasm 后端](https://kotlinlang.org/docs/wasm-overview.html) 和由 Wasm 提供支持的 [Compose Multiplatform for Web](https://kotl.in/wasm-compose-example)。

至于 JS 目标平台，Kotlin/JS 后端已达到稳定状态。在 Compose Multiplatform 中，由于资源限制，我们已将重点从 JS Canvas 转移到 Wasm，我们认为后者更有前景。

我们还提供 Compose HTML，以前称为 Compose Multiplatform for web。它是一个附加库，专为在 Kotlin/JS 中操作 DOM 而设计，不用于跨平台共享 UI。

### 有没有计划改进多平台开发的工具？

是的，我们敏锐地意识到多平台工具当前的挑战，并正在积极致力于在几个方面增强功能。

### 你们会提供 Swift 互操作吗？

是的。我们目前正在研究各种方法，以提供与 Swift 的直接互操作性，重点是导出 Kotlin 代码到 Swift。