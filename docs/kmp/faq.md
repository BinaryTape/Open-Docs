[//]: # (title: 常见问题)

## Kotlin Multiplatform

### 什么是 Kotlin Multiplatform？

[Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/) (KMP) 是 JetBrains 推出的一项开源技术，用于灵活的跨平台开发。它允许你为各种平台创建应用程序，并在这些平台之间高效复用代码，同时保留原生编程的优势。借助 Kotlin Multiplatform，你可以开发适用于 Android、iOS、桌面、Web、服务端以及其他平台的应用。

### 我可以使用 Kotlin Multiplatform 共享 UI 吗？

可以，你可以使用 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)，这是 JetBrains 基于 Kotlin 和 [Jetpack Compose](https://developer.android.com/jetpack/compose) 开发的声明式 UI 框架。此框架允许你为 iOS、Android、桌面和 Web 等平台创建共享 UI 组件，帮助你在不同设备和平台间保持一致的用户界面。

要了解更多信息，请参见 [Compose Multiplatform](#compose-multiplatform) 部分。

### Kotlin Multiplatform 支持哪些平台？

Kotlin Multiplatform 支持 Android、iOS、桌面、Web、服务端以及其他平台。关于 [支持的平台](supported-platforms.md) 的更多信息。

### 我应该在哪个 IDE 中开发我的跨平台应用？

我们建议使用 Android Studio IDE 来处理 Kotlin Multiplatform 项目。关于 [推荐的 IDE 和代码编辑器](recommended-ides.md) 中提供了更多替代方案。

### 如何创建新的 Kotlin Multiplatform 项目？

[创建 Kotlin Multiplatform 应用](get-started.topic) 教程提供了创建 Kotlin Multiplatform 项目的分步说明。你可以决定共享什么——仅共享逻辑，或者逻辑和 UI 都共享。

### 我有一个现有的 Android 应用程序。如何将其迁移到 Kotlin Multiplatform？

[让你的 Android 应用程序在 iOS 上运行](multiplatform-integrate-in-existing-app.md) 分步教程解释了如何让你的 Android 应用程序在 iOS 上使用原生 UI 运行。如果你还想使用 Compose Multiplatform 共享 UI，请参见 [相应的答案](#i-have-an-existing-android-application-that-uses-jetpack-compose-what-should-i-do-to-migrate-it-to-other-platforms)。

### 我在哪里可以找到完整的示例进行尝试？

这里有一个 [真实案例列表](multiplatform-samples.md)。

### 我在哪里可以找到真实 Kotlin Multiplatform 应用程序的列表？有哪些公司在生产环境中使用 KMP？

请查阅我们的 [案例研究列表](https://kotlinlang.org/case-studies/?type=multiplatform)，了解其他已在生产环境采用 Kotlin Multiplatform 的公司的经验。

### 哪些操作系统可以与 Kotlin Multiplatform 配合使用？

如果你要处理共享代码或平台特有代码（iOS 除外），你可以在 IDE 支持的任何操作系统上工作。

了解更多关于 [推荐 IDE](recommended-ides.md) 的信息。

如果你想编写 iOS 特有代码并在模拟器或真实设备上运行 iOS 应用程序，请使用装有 macOS 的 Mac。这是因为根据 Apple 的要求，iOS 模拟器只能在 macOS 上运行，而不能在其他操作系统（例如 Microsoft Windows 或 Linux）上运行。

### 如何在 Kotlin Multiplatform 项目中编写并发代码？

你仍然可以使用协程和流在 Kotlin Multiplatform 项目中编写异步代码。如何调用这些代码取决于你从何处调用它们。从 Kotlin 代码中调用挂起函数和流已被广泛记录，尤其是对于 Android。从 [Swift 代码中调用它们](https://kotlinlang.org/docs/native-arc-integration.html#completion-handlers) 需要更多一些工作，更多详细信息请参见 [KT-47610](https://youtrack.jetbrains.com/issue/KT-47610)。

目前从 Swift 调用挂起函数和流的最佳方法是使用像 [KMP-NativeCoroutines](https://github.com/rickclephas/KMP-NativeCoroutines) 这样的插件和库，结合 Swift 的 `async`/`await` 或像 Combine 和 RxSwift 这样的库。

目前，KMP-NativeCoroutines 是更成熟的解决方案，它支持 `async`/`await`、Combine 和 RxSwift 等并发方法。SKIE 设置起来更简单，也更简洁。例如，它将 Kotlin 的 `Flow` 直接映射到 Swift 的 `AsyncSequence`。这两个库都支持协程的正确取消。

要了解如何使用它们，请参见 [在 iOS 和 Android 之间共享更多逻辑](multiplatform-upgrade-app.md)。

### 什么是 Kotlin/Native，它与 Kotlin Multiplatform 有何关系？

[Kotlin/Native](https://kotlinlang.org/docs/native-overview.html) 是一种将 Kotlin 代码编译为原生二进制文件的技术，这些二进制文件无需虚拟机即可运行。它包括一个基于 [LLVM](https://llvm.org/) 的 Kotlin 编译器后端以及 Kotlin 标准库的原生实现。

Kotlin/Native 主要旨在允许为那些不希望或无法使用虚拟机的平台进行编译，例如嵌入式设备和 iOS。当你需要生成一个不需要额外运行时或虚拟机的自包含程序时，它特别适用。

例如，在移动应用程序中，用 Kotlin 编写的共享代码通过 Kotlin/JVM 编译为 Android 的 JVM 字节码，并通过 Kotlin/Native 编译为 iOS 的原生二进制文件。这使得与 Kotlin Multiplatform 在两个平台上的集成无缝。

![Kotlin/Native and Kotlin/JVM binaries](kotlin-native-and-jvm-binaries.png){width=350}

### 如何加快 Kotlin Multiplatform 模块对原生平台（iOS、macOS、Linux）的编译速度？

请参见这些 [提高 Kotlin/Native 编译时间](https://kotlinlang.org/docs/native-improving-compilation-time.html) 的技巧。

## Compose Multiplatform

### 什么是 Compose Multiplatform？

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 是 JetBrains 开发的一个现代声明式和反应式 UI 框架，它提供了一种用少量 Kotlin 代码构建用户界面的简单方法。它还允许你一次编写 UI，并在任何支持的平台——iOS、Android、桌面（Windows、macOS、Linux）和 Web——上运行它。

### 它与 Jetpack Compose for Android 有何关系？

Compose Multiplatform 大部分 API 与 Google 开发的 Android UI 框架 [Jetpack Compose](https://developer.android.com/jetpack/compose) 共享。事实上，当你使用 Compose Multiplatform 面向 Android 时，你的应用只是在 Jetpack Compose 上运行。Compose Multiplatform 面向的其他平台可能在底层实现细节上与 Android 上的 Jetpack Compose 不同，但它们仍然为你提供相同的 API。

有关详细信息，请参见 [框架互相关系概述](compose-multiplatform-and-jetpack-compose.md)。

### 我可以在哪些平台之间共享我的 UI？

我们希望你能够选择在任何流行的平台组合之间共享 UI——Android、iOS、桌面（Linux、macOS、Windows）和 Web（基于 Wasm）。目前 Compose Multiplatform 仅对 Android、iOS 和桌面稳定。有关更多详细信息，请参见 [支持的平台](supported-platforms.md)。

### 我可以在生产环境中使用 Compose Multiplatform 吗？

Compose Multiplatform 的 Android、iOS 和桌面目标是稳定的。你可以在生产环境中使用它们。

基于 WebAssembly 的 Compose Multiplatform for Web 版本处于 Beta 阶段，这意味着它已接近完成。你可以使用它，但仍可能出现迁移问题。它的 UI 与 Compose Multiplatform for iOS、Android 和桌面相同。

### 如何创建新的 Compose Multiplatform 项目？

[创建包含共享逻辑和 UI 的 Compose Multiplatform 应用](compose-multiplatform-create-first-app.md) 教程提供了为 Android、iOS 和桌面创建包含 Compose Multiplatform 的 Kotlin Multiplatform 项目的分步说明。你还可以观看 Kotlin 开发者布道师 Sebastian Aigner 在 YouTube 上创建的 [视频教程](https://www.youtube.com/watch?v=5_W5YKPShZ4)。

### 我应该使用哪个 IDE 来构建 Compose Multiplatform 应用？

我们建议使用 Android Studio IDE。有关更多详细信息，请参见 [推荐的 IDE 和代码编辑器](recommended-ides.md)。

### 我可以试玩演示应用程序吗？我在哪里可以找到它？

你可以试玩我们的 [示例](multiplatform-samples.md)。

### Compose Multiplatform 是否提供组件？

是的，Compose Multiplatform 完全支持 [Material 3](https://m3.material.io/) 组件。

### 我可以在多大程度上自定义 Material 组件的外观？

你可以使用 Material 的主题功能来自定义颜色、字体和边距。如果你想创建独特设计，可以创建自定义组件和布局。

### 我可以在现有 Kotlin Multiplatform 应用中共享 UI 吗？

如果你的应用程序使用原生 API 作为其 UI（这是最常见的情况），你可以逐步将某些部分重写为 Compose Multiplatform，因为它为此提供了互操作性。你可以使用一个特殊的互操作视图来替换原生 UI，该视图封装了用 Compose 编写的通用 UI。

### 我有一个使用 Jetpack Compose 的现有 Android 应用程序。我应该如何将其迁移到其他平台？

应用的迁移包括两个部分：迁移 UI 和迁移逻辑。迁移的复杂程度取决于你的应用程序的复杂性以及你使用的 Android 特有库的数量。你可以将大部分屏幕迁移到 Compose Multiplatform 而无需更改。所有 Jetpack Compose 组件都受支持。然而，某些 API 仅在 Android 目标中工作——它们可能是 Android 特有的，或者尚未移植到其他平台。例如，资源处理是 Android 特有的，因此你需要迁移到 [Compose Multiplatform 资源库](compose-multiplatform-resources.md) 或使用社区解决方案。Android [导航库](https://developer.android.com/jetpack/androidx/releases/navigation) 也是 Android 特有的，但有可用的 [社区替代方案](compose-navigation-routing.md)。有关仅适用于 Android 的组件的更多信息，请参见当前的 [Android 特有 API 列表](compose-android-only-components.md)。

你需要 [将业务逻辑迁移到 Kotlin Multiplatform](multiplatform-integrate-in-existing-app.md)。当你尝试将代码移动到共享模块时，使用 Android 依赖项的部分将停止编译，你需要重写它们。

*   你可以重写使用 Android 特有依赖项的代码，转而使用多平台库。有些库可能已经支持 Kotlin Multiplatform，因此无需更改。你可以查看 [KMP-awesome](https://github.com/terrakok/kmp-awesome) 库列表。
*   或者，你可以将通用代码与平台特有逻辑分离，并 [提供通用接口](multiplatform-connect-to-apis.md)，这些接口根据平台有不同的实现。在 Android 上，实现可以使用你现有的功能，而在其他平台（如 iOS）上，你需要为通用接口提供新的实现。

### 我可以将 Compose 屏幕集成到现有的 iOS 应用中吗？

可以。Compose Multiplatform 支持不同的集成场景。有关与 iOS UI 框架集成的更多信息，请参见 [与 SwiftUI 集成](compose-swiftui-integration.md) 和 [与 UIKit 集成](compose-uikit-integration.md)。

### 我可以将 UIKit 或 SwiftUI 组件集成到 Compose 屏幕中吗？

可以。请参见 [与 SwiftUI 集成](compose-swiftui-integration.md) 和 [与 UIKit 集成](compose-uikit-integration.md)。

<!-- Need to revise
### What happens when my mobile OS updates and introduces new platform capabilities?

You can use them in platform-specific parts of your codebase once Kotlin supports them. We do our best to support them
in the upcoming Kotlin version. All new Android capabilities provide Kotlin or Java APIs, and wrappers over iOS APIs are
generated automatically.
-->

### 当我的移动操作系统更新并改变系统组件的视觉样式或行为时，会发生什么？

操作系统更新后，你的 UI 将保持不变，因为所有组件都绘制在画布上。如果你在屏幕中嵌入了原生 iOS 组件，更新可能会影响它们的外观。

## 未来计划

### Kotlin Multiplatform 的演进计划是什么？

我们 JetBrains 投入了大量精力，旨在为多平台开发提供最佳体验，并消除多平台用户现有的痛点。我们计划改进核心 Kotlin Multiplatform 技术、与 Apple 生态系统的集成、工具链以及我们的 Compose Multiplatform UI 框架。[查看我们的路线图](https://blog.jetbrains.com/kotlin/2024/10/kotlin-multiplatform-development-roadmap-for-2025/)。

### Compose Multiplatform 何时会稳定？

Compose Multiplatform 对 Android、iOS 和桌面是稳定的，而 Web 平台支持处于 Beta 阶段。我们正在努力实现 Web 平台的稳定版本，具体日期将另行公布。

有关稳定状态的更多信息，请参见 [支持的平台](supported-platforms.md)。

### Kotlin 和 Compose Multiplatform 对 Web 目标的未来支持如何？

我们目前正将资源集中在 WebAssembly (Wasm) 上，它展现出巨大的潜力。你可以尝试我们的新 [Kotlin/Wasm 后端](https://kotlinlang.org/docs/wasm-overview.html) 和由 Wasm 驱动的 [Compose Multiplatform for Web](https://kotl.in/wasm-compose-example)。

至于 JS 目标，Kotlin/JS 后端已达到稳定状态。在 Compose Multiplatform 中，由于资源限制，我们已将重点从 JS Canvas 转移到 Wasm，我们认为 Wasm 更具前景。

我们还提供 Compose HTML，它以前被称为 Compose Multiplatform for web。这是一个用于在 Kotlin/JS 中操作 DOM 的额外库，它不旨在共享跨平台的 UI。

### 有没有改善多平台开发工具链的计划？

有，我们深知目前多平台工具链面临的挑战，并正在积极改进多个领域。

### 你们会提供 Swift 互操作吗？

会。我们目前正在调查各种方法，以提供与 Swift 的直接互操作性，重点是将 Kotlin 代码导出到 Swift。