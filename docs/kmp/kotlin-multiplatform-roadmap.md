---
[//]: # (title: Kotlin Multiplatform 路线图)
---

# Kotlin Multiplatform 路线图

Kotlin Multiplatform 路线图旨在概述 Kotlin Multiplatform 项目的优先级和总体方向。

最新的[路线图博客文章](https://blog.jetbrains.com/kotlin/2024/10/kotlin-multiplatform-development-roadmap-for-2025/)
已于 2024 年 10 月 28 日发布。
以下页面总结了该文章，并在我们达到既定里程碑或需要反映战略变化时进行更新：

*   2025 年 2 月 14 日，路线图已更新，以反映[Kotlin Multiplatform 工具链 – 转变策略](https://blog.jetbrains.com/kotlin/2025/02/kotlin-multiplatform-tooling-shifting-gears/)
    博客文章中描述的变更。

Kotlin Multiplatform 的目标与 [Kotlin 路线图](https://kotlinlang.org/docs/roadmap.html) 紧密结合。
请务必查阅以获取我们当前方向的更多背景信息。

## 关键优先级

*   **iOS 版 Compose Multiplatform 稳定版**：将 iOS 目标平台推向稳定发布版本，这涉及到改进底层框架以及 iOS 特有的集成和基准测试。
*   **更好地支持 IntelliJ-based IDEs 中的多平台开发**：提供针对 Kotlin Multiplatform 和 Compose Multiplatform 优化的环境。
*   **发布 Kotlin-to-Swift 导出的首个公开版本**：通过初始发布，我们的目标是提供与现有 Objective-C 导出相当的体验，并为将来充分利用 Swift 导出铺平道路。
*   **通过提供更好的工具和指南来改善创建多平台库的体验**：我们将改进 klib 格式，使其更灵活、更强大，并为创建多平台库提供更好的模板和说明。
*   **使 Amper 适用于多平台移动开发**：2025 年，Amper 应全面支持 iOS 和 Android 的多平台开发，包括使用 Compose Multiplatform 共享 UI 代码。

你可以在[常见问题解答 (FAQ) 部分](#faq)找到常见问题和答案。

## Compose Multiplatform

Compose Multiplatform 的重点关注领域包括：

*   **Jetpack Compose 特性一致性**：确保所有核心 API 和组件都支持多平台。
*   **iOS 渲染性能**：实施基准测试基础设施，以捕获回归并使框架性能对用户透明。
*   **核心组件的特性完备性**：完成基本特性，包括：
    *   导航
    *   资源管理
    *   可访问性
    *   国际化
*   **框架的整体稳定化**：提高整体稳定性（包括 Compose 与原生视图之间的互操作性），同时通过 Compose Multiplatform 预览版提升用户体验。
*   **文档**：在一个地方向用户提供学习和使用 Compose Multiplatform 所需的所有资源。
*   **Web 版 Compose Multiplatform**：达到与其他受支持平台相同的特性一致性。

### 关于 Compose HTML 有何计划？

在继续通过修复错误来维护 Compose HTML 库的同时，我们也在现有用户中探索其用例，以便我们能够制定其未来的开发计划。

## 工具链

我们的目标是确保 Kotlin Multiplatform 与 KMP 开发中常用 IDE（如 IntelliJ IDEA 和 Android Studio）无缝集成，从而更直接地在项目内部或项目之间共享代码。

我们还在探索新的领域以增强开发体验：

*   研究使用云机器构建 iOS 应用程序，以帮助无法方便访问 Apple 设备的开发者。
*   试验更深层次的 AI 工具集成，不仅协助代码生成，还协助更复杂的开发任务。

## Kotlin-to-Swift 导出

我们 2025 年的目标是发布直接 Kotlin-to-Swift 导出的首个公开版本。
初始发布旨在提供与现有 Objective-C 导出相当的用户体验，同时克服 Objective-C 的限制。

这将实现对 Swift 语言的更广泛支持并促进 API 导出，
为将来充分利用 Swift 导出铺平道路。

## 库生态系统

随着 Kotlin Multiplatform 生态系统的快速扩展，确保库的向后兼容性变得至关重要。
以下是我们的计划：

*   改进 klib 格式，允许库创建者利用他们构建 JVM 库的知识。
*   在 Kotlin Multiplatform 库中实现与 JVM 相同的代码内联行为。
*   提供一个工具，确保你的多平台库公共 API 保持向后兼容。

我们还在寻求改进 Kotlin Multiplatform 库的发布流程。我们希望：

*   为创建和发布 KMP 库提供模板和全面的指南。
*   稳定 klib 在不同平台上的交叉编译。
*   启动一个完全重新设计的 KMP 库发布流程。
*   显著改善库的文档编写流程。

虽然 Kotlin Multiplatform 将获得重大更新，但使用当前格式构建的库仍将与更新的 Kotlin 版本兼容。

### 改进多平台库的搜索

现在有超过 2500 个 Kotlin Multiplatform 库可用。
然而，尽管选择广泛，开发者仍可能难以找到符合其特定需求并支持其所选平台的库。

我们的目标是引入一个解决方案，促进这些库的发现，并允许开发者轻松试用它们。

### Amper

Amper 是 JetBrains 的一个实验性项目配置和构建工具。2025 年，我们将专注于使 Amper 完全
适用于 Android 和 iOS 的多平台移动应用程序开发，并支持共享 Compose Multiplatform UI。

我们旨在支持：

*   在本地、物理设备和 CI 中运行和测试应用程序。
*   签署应用程序并在 Play Store 和 App Store 中发布。
*   IDE 集成，以确保流畅愉快的体验。

### Gradle 和其他构建工具

展望 2025 年，我们关于 Gradle 增强的工作已在 [Kotlin 路线图](https://kotlinlang.org/docs/roadmap.html#tooling)中概述。

以下是我们将在 Kotlin Multiplatform 方面重点关注的关键领域：

*   支持在项目级别声明 Kotlin Multiplatform 依赖项。这将使开发者更容易有效地管理其项目依赖项。
*   改进 Kotlin/Native 工具链与 Gradle 的集成。
*   实现多平台库的下一代分发格式。
    这将简化多平台库的依赖项模型和发布布局，使其更易于与第三方构建工具一起使用，并降低库作者的复杂性。
*   在声明式 Gradle 中提供对 Kotlin Multiplatform 的全面支持。
    我们针对实验性 Kotlin 生态系统插件（支持声明式 Gradle）的工作旨在帮助开发者
    探索其 Gradle 构建的声明式方法。

> *   本路线图并非团队正在进行的所有工作的详尽列表，仅包含最重要的项目。
> *   不承诺在特定版本中交付特定特性或修复。
> *   我们将根据情况调整优先级并相应更新路线图。
>
{style="note"}

## FAQ

### 你能修复 IntelliJ IDEA 中的 KMP 支持吗？

我们认识到在 IntelliJ IDEA 中提供卓越 KMP 体验的重要性。
如[关于 KMP 工具链的博客文章](https://blog.jetbrains.com/kotlin/2025/02/kotlin-multiplatform-tooling-shifting-gears/)所述，
我们将专注于全面增强 IntelliJ Platform 的 KMP 支持。
这将包括提高质量和稳定性，并引入某些特性，以便那些偏好 IntelliJ IDEA 进行多平台开发的开发者可以在他们首选的 IDE 中享受完整的 KMP 支持。

### Android Studio 中的 KMP 支持如何？

我们正在积极与 Google 协作，以改善 Android Studio 中的 KMP 支持。
更详细的计划将在晚些时候提供。
敬请关注！

### 目前推荐使用哪个 IDE 进行 KMP 开发？

如果你的主要用例是移动端，我们推荐使用 Android Studio。
我们也在努力在 IntelliJ IDEA 中提供出色的支持。

### Swift 会在 IntelliJ IDEA 和 Android Studio 中可用吗？

Swift 是某些 KMP 场景的重要组成部分，我们正在努力支持这些用例。

### 你们是否放弃了 Web 端？

不，我们完全没有放弃 Web 端！
我们正在积极开展 Kotlin/Wasm 支持以及 Web 版 Compose Multiplatform 的工作，以实现与其他平台的特性一致性。
我们目前的工作包括实现拖放支持、改进文本输入和渲染，并确保与 HTML 内容的无缝互操作性。
我们很快将分享更多关于 Web 端的详细计划。敬请关注！

### Compose HTML 怎么样？

在继续通过修复错误来维护 Compose HTML 库的同时，我们也在现有用户中探索其用例，以便我们能够制定其未来的开发计划。