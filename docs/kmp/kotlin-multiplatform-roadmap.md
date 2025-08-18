# Kotlin Multiplatform 路线图

Kotlin Multiplatform 路线图旨在概述 Kotlin Multiplatform 项目的优先级和总体方向。

最新的 [路线图博文](https://blog.jetbrains.com/kotlin/2024/10/kotlin-multiplatform-development-roadmap-for-2025/) 于 2024 年 10 月 28 日发布。
以下页面总结了该博文内容，并会在我们达到既定里程碑或需要反映战略变化时进行更新：

* 2025 年 2 月 14 日，路线图已更新，以反映 [Kotlin Multiplatform 工具 – 策略调整](https://blog.jetbrains.com/kotlin/2025/02/kotlin-multiplatform-tooling-shifting-gears/) 博文中所述的更改。

Kotlin Multiplatform 的目标与 [Kotlin 路线图](https://kotlinlang.org/docs/roadmap.html) 紧密对齐。
请务必查阅该路线图，以获取我们前进方向的更多背景信息。

## 关键优先级

* 适用于 iOS 的稳定版 Compose Multiplatform：推动 iOS 目标平台实现稳定发布，这包括改进底层框架以及 iOS 特有的集成和基准测试。
* 更好地支持 IntelliJ-based IDE 中的多平台开发，为 Kotlin Multiplatform 和 Compose Multiplatform 提供优化的环境。
* 发布 Kotlin 到 Swift 导出的首个公共版本。在初始版本中，我们旨在提供与现有 Objective-C 导出相当的体验，并为将来充分利用 Swift 导出铺平道路。
* 通过提供更好的工具和指导，改善创建多平台库的体验。我们将改进 klib 格式，使其更灵活和强大，并为创建多平台库提供更好的模板和说明。
* 使 Amper 适用于多平台移动开发。2025 年，Amper 应全面支持 iOS 和 Android 的多平台开发，包括使用 Compose Multiplatform 共享 UI 代码。

您可以在 [FAQ 部分](#faq) 找到常见问题和答案。

## Compose Multiplatform

Compose Multiplatform 的重点领域包括：

* **Jetpack Compose 特性对等**。确保所有核心 API 和组件都是多平台的。
* **iOS 渲染性能**。实现基准测试基础设施，以捕获性能回退，并使框架的性能对用户透明。
* **核心组件的特性完整性**。完成基本特性，包括：
    * 导航，
    * 资源管理，
    * 可访问性，
    * 国际化。
* **框架的通用稳定性**。提高整体稳定性（包括 Compose 和原生视图之间的互操作性），同时通过 Compose Multiplatform 预览版增强用户体验。
* **文档**。向用户提供在一个地方学习和使用 Compose Multiplatform 所需的所有资源。
* **适用于 web 的 Compose Multiplatform**。实现与其他支持平台之间的特性对等。

### 关于 Compose HTML 有何计划？

在继续通过修复 bug 来维护 Compose HTML 库的同时，我们也在现有用户中探索其用例，以便制定其未来的开发计划。

## 工具

我们旨在确保 Kotlin Multiplatform 与已普遍用于 KMP 开发的 IDE（例如 IntelliJ IDEA 和 Android Studio）无缝集成，从而更直接地在项目内部或项目之间共享代码。

我们还在探索新领域以增强开发体验：

* 调查使用云机器构建 iOS 应用程序，以帮助无法方便访问 Apple 设备的开发者。
* 实验更深度的 AI 工具集成，不仅协助代码生成，还在更复杂的开发任务中提供帮助。

## Kotlin 到 Swift 导出

我们 2025 年的目标是发布直接的 Kotlin 到 Swift 导出的首个公共版本。
初始版本旨在提供与现有 Objective-C 导出相当的用户体验，同时克服 Objective-C 的限制。

这将支持更广泛的 Swift 语言，并促进 API 导出，为未来充分利用 Swift 导出铺平道路。

## 库生态系统

随着 Kotlin Multiplatform 生态系统的快速扩展，确保库的向后兼容性变得至关重要。
以下是我们的计划：

* 改进 klib 格式，以便库创建者可以利用他们构建 JVM 库的知识。
* 在 Kotlin Multiplatform 库中实现与 JVM 相同的代码内联行为。
* 提供一个工具，确保您的多平台库公共 API 保持向后兼容。

我们还在寻求改进 Kotlin Multiplatform 库的发布流程。我们希望：

* 提供创建和发布 KMP 库的模板和全面指南。
* 稳定 klib 在不同平台上的交叉编译。
* 启动一个完全重新设计的 KMP 库发布流程。
* 大幅改进库的文档流程。

虽然 Kotlin Multiplatform 将获得重大更新，但使用当前格式构建的库仍将与较新的 Kotlin 版本兼容。

### 改进多平台库的搜索

目前有超过 2500 个 Kotlin Multiplatform 库可用。
然而，尽管选择广泛，开发者要找到符合其特定需求并支持其所选平台的库可能仍具挑战。

我们的目标是引入一个解决方案，以促进这些库的发现，并让开发者能够轻松试用它们。

### Amper

Amper 是 JetBrains 的一个实验性项目配置和构建工具。2025 年，我们将专注于使 Amper 完全适用于 Android 和 iOS 的多平台移动应用开发，并支持共享 Compose Multiplatform UI。

我们旨在支持：

* 在本地、物理设备和 CI 中运行和测试应用程序。
* 对应用程序进行签名，并在 Play Store 和 App Store 中发布。
* IDE 集成，以确保流畅愉快的体验。

### Gradle 及其他构建工具

展望 2025 年，我们在 Gradle 增强方面的工作已在 [Kotlin 路线图](https://kotlinlang.org/docs/roadmap.html#tooling) 中概述。

以下是我们将特别关注的 Kotlin Multiplatform 方面的关键领域：

* 支持在项目级别声明 Kotlin Multiplatform 依赖项。这将使开发者更容易有效地管理其项目依赖项。
* 改进 Kotlin/Native 工具链与 Gradle 的集成。
* 实现多平台库的下一代分发格式。
    这将简化多平台库的依赖项模型和发布布局，使其更易于与第三方构建工具一起使用，并降低库作者的复杂性。
* 在声明式 Gradle 中提供对 Kotlin Multiplatform 的全面支持。
    我们在支持声明式 Gradle 的实验性 Kotlin Ecosystem 插件方面的工作，旨在帮助开发者探索其 Gradle 构建的声明式方法。

> * 本路线图并非团队所有工作内容的详尽列表，仅包含最重要的项目。
> * 我们不承诺在特定版本中交付特定特性或修复。
> * 我们将根据进展调整优先级并相应更新路线图。
>
{style="note"}

## FAQ

### 你们能修复 IntelliJ IDEA 中的 KMP 支持吗？

我们认识到在 IntelliJ IDEA 中提供卓越 KMP 体验的重要性。
正如 [关于 KMP 工具的博文](https://blog.jetbrains.com/kotlin/2025/02/kotlin-multiplatform-tooling-shifting-gears/) 所述，
我们将专注于整体增强 IntelliJ Platform 对 KMP 的支持。
这将包括提高质量和稳定性，并引入某些特性，以便那些偏爱 IntelliJ IDEA 进行多平台开发的开发者，能在他们首选的 IDE 中享受全面的 KMP 支持。

### Android Studio 中的 KMP 支持情况如何？

我们正在积极与 Google 合作，以改进 Android Studio 中的 KMP 支持。
更详细的计划将在稍后公布。
敬请关注！

### 目前推荐用于 KMP 开发的 IDE 是什么？

如果您的主要用例是移动开发，我们推荐使用 Android Studio。
我们也在努力在 IntelliJ IDEA 中提供强大的支持。

### Swift 会在 IntelliJ IDEA 和 Android Studio 中可用吗？

Swift 是某些 KMP 场景的重要组成部分，我们正在努力支持这些用例。

### 你们放弃 Web 平台了吗？

不，我们完全没有放弃 Web 平台！
我们正在积极开发 Kotlin/Wasm 支持以及适用于 web 的 Compose Multiplatform，以实现与其他平台之间的特性对等。
我们目前的工作包括实现拖放支持、改进文本输入和渲染，并确保与 HTML 内容的无缝互操作性。
我们将很快分享更详细的 Web 平台计划。敬请关注！

### Compose HTML 情况如何？

在继续通过修复 bug 来维护 Compose HTML 库的同时，我们也在现有用户中探索其用例，以便制定其未来的开发计划。