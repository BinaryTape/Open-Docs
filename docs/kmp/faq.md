[//]: # (title: 常见问题解答)

## Kotlin Multiplatform

### 什么是 Kotlin Multiplatform？

[Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/) (KMP) 是由 JetBrains 开发的一项开源技术，用于灵活的跨平台开发。它允许您为各种平台创建应用程序，并高效地跨平台复用代码，同时保留原生编程的优势。通过 Kotlin Multiplatform，您可以为 Android、iOS、桌面、Web、服务器端等平台开发应用。

### 我可以使用 Kotlin Multiplatform 共享 UI 吗？

是的，您可以使用 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 共享 UI，这是 JetBrains 基于 Kotlin 和 [Jetpack Compose](https://developer.android.com/jetpack/compose) 开发的声明式 UI 框架。该框架允许您为 iOS、Android、桌面和 Web 等平台创建共享的 UI 组件，帮助您在不同设备和平台间保持一致的用户界面。

要了解更多信息，请参阅 [Compose Multiplatform](#compose-multiplatform) 部分。

### Kotlin Multiplatform 支持哪些平台？

Kotlin Multiplatform 支持 Android、iOS、桌面、Web、服务器端等平台。详细了解[支持的平台](supported-platforms.md)。

### 我应该在哪个 IDE 中开发跨平台应用？

我们建议使用 Android Studio IDE 来处理 Kotlin Multiplatform 项目。
在[推荐的 IDE 和代码编辑器](recommended-ides.md)中详细了解可用的替代方案。

### 如何创建一个新的 Kotlin Multiplatform 项目？

[创建 Kotlin Multiplatform 应用](get-started.topic)教程提供了创建 Kotlin Multiplatform 项目的逐步指南。您可以决定共享哪些内容——仅逻辑，或者逻辑和 UI。

### 我有一个现有的 Android 应用程序。如何将其迁移到 Kotlin Multiplatform？

[让您的 Android 应用程序在 iOS 上运行](multiplatform-integrate-in-existing-app.md)逐步教程解释了如何让您的 Android 应用程序通过原生 UI 在 iOS 上运行。
如果您还想通过 Compose Multiplatform 共享 UI，请参阅[相应的回答](#i-have-an-existing-android-application-that-uses-jetpack-compose-what-should-i-do-to-migrate-it-to-other-platforms)。

### 哪里可以获得完整的示例进行尝试？

这里有一个[实际示例列表](multiplatform-samples.md)。

### 哪里可以找到实际的 Kotlin Multiplatform 应用程序列表？哪些公司在生产环境中使用 KMP？

查看我们的[案例研究列表](https://kotlinlang.org/case-studies/?type=multiplatform)，向其他已经在生产环境中采用 Kotlin Multiplatform 的公司学习。

### 哪些操作系统可以进行 Kotlin Multiplatform 开发？

如果您打算处理共享代码或平台特定代码（iOS 除外），您可以在 IDE 支持的任何操作系统上工作。

详细了解[推荐的 IDE](recommended-ides.md)。

如果您想编写 iOS 特定代码并在模拟器或真实设备上运行 iOS 应用程序，请使用装有 macOS 的 Mac。这是因为根据 Apple 的要求，iOS 模拟器只能在 macOS 上运行，而不能在 Microsoft Windows 或 Linux 等其他操作系统上运行。

### 如何在 Kotlin Multiplatform 项目中编写并发代码？

您仍然可以使用协程和 flow 在 Kotlin Multiplatform 项目中编写异步代码。如何调用这些代码取决于您从何处调用。从 Kotlin 代码中调用挂起函数和 flow 已有广泛的文档说明，特别是针对 Android 平台。[从 Swift 代码调用它们](https://kotlinlang.org/docs/native-arc-integration.html#completion-handlers)需要额外的工作，请参阅 [KT-47610](https://youtrack.jetbrains.com/issue/KT-47610) 了解更多细节。

目前从 Swift 调用挂起函数和 flow 的最佳方法是结合 Swift 的 `async`/`await` 使用 [KMP-NativeCoroutines](https://github.com/rickclephas/KMP-NativeCoroutines) 等插件和库，或者使用 Combine 和 RxSwift 等库。

目前，KMP-NativeCoroutines 是更经受过考验的解决方案，它支持 `async`/`await`、Combine 和 RxSwift 的并发处理方法。
SKIE 的设置可能更简单，且代码更简洁。例如，它直接将 Kotlin `Flow` 映射到 Swift `AsyncSequence`。
这两个库都支持协程的正确取消。

要学习如何使用它们，请参阅[在 iOS 和 Android 之间共享更多逻辑](multiplatform-upgrade-app.md)。

### 什么是 Kotlin/Native，它与 Kotlin Multiplatform 有什么关系？

[Kotlin/Native](https://kotlinlang.org/docs/native-overview.html) 是一种将 Kotlin 代码编译为原生二进制文件的技术，可以直接运行而无需虚拟机。它包括一个为 Kotlin 编译器提供的[基于 LLVM](https://llvm.org/) 的后端，以及 Kotlin 标准库的原生实现。

Kotlin/Native 的主要设计目标是允许在不希望或无法使用虚拟机的平台上进行编译，例如嵌入式设备和 iOS。当您需要生成一个不需要额外运行时或虚拟机的独立程序时，它尤其适用。

例如，在移动应用中，编写的共享 Kotlin 代码通过 Kotlin/JVM 编译为适用于 Android 的 JVM 字节码，并通过 Kotlin/Native 编译为适用于 iOS 的原生二进制文件。这使得 Kotlin Multiplatform 在两个平台上的集成都非常无缝。

![Kotlin/Native 和 Kotlin/JVM 二进制文件](kotlin-native-and-jvm-binaries.png){width=350}

### 如何为原生平台（iOS、macOS、Linux）加速 Kotlin Multiplatform 模块的编译？

请参阅这些[提高 Kotlin/Native 编译效率的提示](https://kotlinlang.org/docs/native-improving-compilation-time.html)。

## Compose Multiplatform

### 什么是 Compose Multiplatform？

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 是由 JetBrains 开发的现代化声明式和响应式 UI 框架，它提供了一种通过少量 Kotlin 代码构建用户界面的简便方法。它还允许您只需编写一次 UI，即可在任何受支持的平台（iOS、Android、桌面（Windows、macOS、Linux）和 Web）上运行。

### 它与 Android 上的 Jetpack Compose 有什么关系？

Compose Multiplatform 与 Google 开发的 Android UI 框架 [Jetpack Compose](https://developer.android.com/jetpack/compose) 共享大部分 API。事实上，当您使用 Compose Multiplatform 针对 Android 平台时，您的应用实际上就是在 Jetpack Compose 上运行。
Compose Multiplatform 针对的其他平台在底层实现细节上可能与 Android 上的 Jetpack Compose 有所不同，但它们仍然为您提供相同的 API。

有关详情，请参阅[框架相互关系的概述](compose-multiplatform-and-jetpack-compose.md)。

### 我可以在哪些平台之间共享 UI？

我们希望您能够选择在任何流行的平台组合之间共享 UI——Android、iOS、桌面（Linux、macOS、Windows）和 Web（基于 Wasm）。目前 Compose Multiplatform 仅对 Android、iOS 和桌面处于 Stable 状态。有关更多详情，请参阅[支持的平台](supported-platforms.md)。

### 我可以在生产环境中使用 Compose Multiplatform 吗？

Compose Multiplatform 的 Android、iOS 和桌面目标已达到 Stable 状态。您可以在生产环境中使用它们。

基于 WebAssembly 的 Compose Multiplatform for Web 版本目前处于 Beta 阶段，这意味着它已接近完成。您可以使用它，但仍可能出现迁移问题。它具有与 iOS、Android 和桌面版的 Compose Multiplatform 相同的 UI。

### 如何创建一个新的 Compose Multiplatform 项目？

[创建具有共享逻辑和 UI 的 Compose Multiplatform 应用](compose-multiplatform-create-first-app.md)教程提供了为 Android、iOS 和桌面创建带有 Compose Multiplatform 的 Kotlin Multiplatform 项目的逐步指南。您也可以观看由 Kotlin 技术布道师 Sebastian Aigner 在 YouTube 上创建的[视频教程](https://www.youtube.com/watch?v=5_W5YKPShZ4)。

### 我应该使用什么 IDE 来构建 Compose Multiplatform 应用？

我们建议使用 Android Studio IDE。有关更多详情，请参阅[推荐的 IDE 和代码编辑器](recommended-ides.md)。

### 我可以试用演示应用吗？在哪里可以找到它？

您可以尝试我们的[示例](multiplatform-samples.md)。

### Compose Multiplatform 带有微件吗？

是的，Compose Multiplatform 提供对 [Material 3](https://m3.material.io/) 微件的完整支持。

### 我可以在多大程度上自定义 Material 微件的外观？

您可以使用 Material 的主题功能来自定义颜色、字体和内边距。如果您想创建独特的设计，可以创建自定义微件和布局。

### 我可以在现有的 Kotlin Multiplatform 应用中共享 UI 吗？

如果您的应用程序使用原生 API 处理其 UI（这是最常见的情况），您可以逐渐将某些部分重写为 Compose Multiplatform，因为它为此提供了互操作性。您可以使用包装了公共 Compose UI 的特殊互操作视图来替换原生 UI。

### 我有一个现有的使用 Jetpack Compose 的 Android 应用程序。要将其迁移到其他平台，我应该怎么做？

应用的迁移由两部分组成：迁移 UI 和迁移逻辑。迁移的复杂程度取决于应用的复杂程度以及您使用的 Android 特定库的数量。
您可以直接将大部分屏幕迁移到 Compose Multiplatform，无需修改。所有的 Jetpack Compose 微件都是支持的。然而，某些 API 仅在 Android 目标中工作——它们可能是 Android 特有的，或者尚未移植到其他平台。例如，资源处理是 Android 特有的，因此您需要迁移到 [Compose Multiplatform 资源库](compose-multiplatform-resources.md)或使用社区解决方案。Android [导航库](https://developer.android.com/jetpack/androidx/releases/navigation)也是 Android 特有的，但目前已有[社区替代方案](compose-navigation-routing.md)可用。有关仅适用于 Android 的组件的更多信息，请参阅当前的[仅限 Android 的 API 列表](compose-android-only-components.md)。

您需要[将业务逻辑迁移到 Kotlin Multiplatform](multiplatform-integrate-in-existing-app.md)。当您尝试将代码移动到共享模块时，使用 Android 依赖项的部分将停止编译，您需要重写它们。

* 您可以重写使用仅限 Android 依赖项的代码，改用多平台库。有些库可能已经支持 Kotlin Multiplatform，因此无需更改。您可以查看 [KMP-awesome](https://github.com/terrakok/kmp-awesome) 库列表。
* 或者，您可以将公共代码与平台特定逻辑分离，并[提供公共接口](multiplatform-connect-to-apis.md)，这些接口根据平台的不同有不同的实现。在 Android 上，实现可以使用您现有的功能；在 iOS 等其他平台上，您需要为公共接口提供新的实现。

### 我可以将 Compose 屏幕集成到现有的 iOS 应用中吗？

是的。Compose Multiplatform 支持不同的集成方案。有关与 iOS UI 框架集成的更多信息，请参阅[与 SwiftUI 集成](compose-swiftui-integration.md)和[与 UIKit 集成](compose-uikit-integration.md)。

### 我可以将 UIKit 或 SwiftUI 组件集成到 Compose 屏幕中吗？

是的，可以。请参阅[与 SwiftUI 集成](compose-swiftui-integration.md)和[与 UIKit 集成](compose-uikit-integration.md)。

<!-- Need to revise
### 当我的移动操作系统更新并引入新的平台功能时会发生什么？

一旦 Kotlin 支持这些新功能，您就可以在代码库的平台特定部分中使用它们。我们会尽力在即将发布的 Kotlin 版本中支持它们。所有新的 Android 功能都会提供 Kotlin 或 Java API，而针对 iOS API 的包装器是自动生成的。
-->

### 当我的移动操作系统更新并改变系统组件的视觉样式或行为时会发生什么？

在操作系统更新后，您的 UI 将保持不变，因为所有组件都是在画布上绘制的。如果您在屏幕中嵌入了原生 iOS 组件，更新可能会影响它们的外观。

## 未来计划

### Kotlin Multiplatform 的演进计划是什么？

JetBrains 投入了大量精力来为多平台开发提供最佳体验，并消除多平台用户现有的痛点。我们计划改进 Kotlin Multiplatform 核心技术、与 Apple 生态系统的集成、工具以及我们的 Compose Multiplatform UI 框架。
[查看我们的路线图](https://blog.jetbrains.com/kotlin/2024/10/kotlin-multiplatform-development-roadmap-for-2025/)。

### Compose Multiplatform 何时会达到 Stable 状态？

Compose Multiplatform 的 Android、iOS 和桌面平台已达到 Stable 状态，而 Web 平台支持目前处于 Beta 阶段。我们正在努力推进 Web 平台的 Stable 版本发布，具体日期将另行公布。

有关稳定性状态的更多信息，请参阅[支持的平台](supported-platforms.md)。

### Kotlin 和 Compose Multiplatform 未来对 Web 目标的支持情况如何？

我们目前正将资源集中在 WebAssembly (Wasm) 上，它展现出了巨大的潜力。您可以尝试我们的新 [Kotlin/Wasm 后端](https://kotlinlang.org/docs/wasm-overview.html)和由 Wasm 驱动的 [Compose Multiplatform for Web](https://kotl.in/wasm-compose-example)。

至于 JS 目标，Kotlin/JS 后端已经达到 Stable 状态。在 Compose Multiplatform 中，由于资源限制，我们将重点从 JS Canvas 转向了 Wasm，我们认为 Wasm 更有前景。

我们还提供 Compose HTML（前身为 Compose Multiplatform for web）。这是一个专门用于在 Kotlin/JS 中处理 DOM 的附加库，它不用于跨平台共享 UI。

### 是否有改进多平台开发工具的计划？

是的，我们敏锐地意识到了目前多平台开发工具面临的挑战，并正在积极改进多个领域。

### 你们会提供 Swift 互操作性吗？

是的。我们目前正在研究各种方法来提供与 Swift 的直接互操作性，重点是将 Kotlin 代码导出到 Swift。