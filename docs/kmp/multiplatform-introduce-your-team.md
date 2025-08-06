[//]: # (title: 如何向团队引入多平台移动开发)

<web-summary>了解如何通过这六项建议向团队引入多平台移动应用开发，以实现顺畅高效的采纳。</web-summary>

在组织中实施新技术和工具会带来挑战。如何帮助您的团队采纳[多平台移动应用开发方法](cross-platform-mobile-development.md)来优化和简化工作流程？以下是一些建议和最佳实践，可帮助您有效地向团队引入 [Kotlin Multiplatform (KMP)](https://www.jetbrains.com/kotlin-multiplatform/)，这是一项由 JetBrains 构建的开源技术，它允许开发者在不同平台间共享代码，同时保留原生编程的优势。

* [从同理心开始](#start-with-empathy)
* [解释 Kotlin Multiplatform 的工作原理](#explain-how-kotlin-multiplatform-works)
* [使用案例研究来展示多平台开发的价值](#use-case-studies-to-demonstrate-the-value-of-multiplatform-development)
* [通过创建示例项目提供证据](#offer-proof-by-creating-a-sample-project)
* [为团队关于多平台开发的问题做准备](#prepare-for-questions-about-multiplatform-development-from-your-team)
* [在适应期支持团队](#support-your-team-during-the-adaptation-period)

## 从同理心开始

软件开发是团队协作，每个关键决策都需要所有团队成员的认可。集成任何跨平台技术都会显著影响移动应用程序的开发过程。因此，在开始将 Kotlin Multiplatform 集成到您的[项目](#project)之前，您需要向团队介绍这项技术，并温和地引导他们认识到其采纳的价值。

了解参与您[项目](#project)的人员是成功集成的第一步。您的老板负责在最短时间内交付质量最佳的[特性](#feature)。对他们来说，任何新技术都是一种风险。您的同事也有不同的看法。他们有使用“[原生](#native)”技术栈构建应用的经验。他们知道如何在 IDE 中编写 UI 和业务逻辑、处理[依赖项](#dependency)、测试和调试代码，并且已经熟悉这门语言。切换到不同的生态系统总是带来不便，因为它总意味着离开舒适区。

鉴于此，在倡导转向 Kotlin Multiplatform 时，请准备好面对许多偏见并回答大量问题。在此过程中，永远不要忽视您的团队需求。下面的一些建议可能有助于您准备推介。

## 解释 Kotlin Multiplatform 的工作原理

在此阶段，您需要展示使用 Kotlin Multiplatform 能为您的[项目](#project)带来价值，并消除团队可能对跨平台移动应用程序存在的任何偏见和疑虑。

KMP 自 Alpha 版本发布以来已广泛应用于生产环境。因此，JetBrains 得以收集了广泛的反馈，并在 [Stable 版本](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)中提供了更好的开发体验。

* **能够使用所有 iOS 和 Android 特性** – 每当无法在共享代码中完成[任务](#task)，或者您想使用特定的[原生](#native)[特性](#feature)时，您都可以使用 [expect/actual](multiplatform-expect-actual.md) 模式来无缝编写[平台特有的](#platform-specific)代码。
* **无缝性能** – 用 Kotlin 编写的共享代码会为不同的[目标平台](#target)编译成不同的输出格式：Android 的 Java 字节码和 iOS 的[原生](#native)二进制文件。因此，在[运行时](#runtime)在平台上执行此代码时，没有额外的[运行时](#runtime)开销，其性能与[原生应用](native-and-cross-platform.md)相当。
* **与遗留代码的兼容性** – 无论您的[项目](#project)规模多大，您现有的代码都不会妨碍您集成 Kotlin Multiplatform。您可以随时开始编写跨平台代码，并将其作为常规[依赖项](#dependency)连接到您的 iOS 和 Android [应用](#app)，或者您可以使用已编写的代码并对其进行修改以兼容 iOS。

能够解释技术的工作原理至关重要，因为没有人喜欢讨论似乎依赖于魔法。如果_任何东西_不清楚，人们可能会做最坏的打算，因此请注意不要犯“某些东西太明显无需解释”的错误。相反，尝试在进入下一阶段之前解释所有基本概念。这篇关于[多平台编程](get-started.topic)的文档可以帮助您系统化知识，为这次体验做好准备。

## 使用案例研究来展示多平台开发的价值

了解多平台技术如何工作是必要的，但还不够。您的团队需要看到使用它的好处，并且您呈现这些好处的方式应该与您的产品相关。

在此阶段，您需要解释在您的产品中使用 Kotlin Multiplatform 的主要好处。一种方法是分享其他公司已经从跨平台移动开发中获益的案例。这些团队的成功经验，尤其是那些拥有相似产品目标的团队，可能会成为最终决策的关键因素。

引用已在生产环境中使用 Kotlin Multiplatform 的不同公司的案例研究可以显著帮助您提出令人信服的论据：

* **麦当劳** – 通过将 Kotlin Multiplatform 用于全球移动[应用](#app)，麦当劳构建了一个可在不同平台间共享的代码库，消除了代码库冗余的需要。
* **Netflix** – 借助 Kotlin Multiplatform，Netflix 优化了产品可靠性和交付速度，这对于满足客户需求至关重要。
* **福布斯** – 通过在 iOS 和 Android 之间共享超过 80% 的逻辑，福布斯现在可以同时在两个平台上推出新的[特性](#feature)，同时保留[平台特有](#platform-specific)定制的灵活性。
* **9GAG** – 在尝试了 Flutter 和 React Native 之后，9GAG 逐渐采纳了 Kotlin Multiplatform，这现在帮助他们更快地交付[特性](#feature)，同时为用户提供一致的体验。

[![Learn from Kotlin Multiplatform success stories](kmp-success-stories.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/case-studies.html)

## 通过创建示例项目提供证据

理论是好的，但最终重要的是将其付诸实践。作为一种使您的论点更具说服力并展示多平台移动[应用](#app)开发潜力的选择，您可以投入一些时间使用 Kotlin Multiplatform 创建一些东西，然后将结果带给团队讨论。您的原型可以是某种测试[项目](#project)，您将从头开始编写它，并演示您的[应用程序](#application)中所需的[特性](#feature)。
[使用 Ktor 和 SQLDelight 创建多平台应用 – 教程](multiplatform-ktor-sqldelight.md)将很好地指导您完成此过程。

您可以通过试验当前[项目](#project)来产生更多相关的示例。
您可以选取一个用 Kotlin 实现的现有[特性](#feature)并使其跨平台，
或者您甚至可以在现有[项目](#project)中创建一个新的 Multiplatform Module，
从积压的低优先级[特性](#feature)中选取一个，并在共享 Module 中实现它。
[让您的 Android 应用程序在 iOS 上运行 – 教程](multiplatform-integrate-in-existing-app.md)提供了基于示例[项目](#project)的逐步指南。

## 为团队关于多平台开发的问题做准备

无论您的推介多么详细，您的团队都会有很多问题。仔细聆听，并尝试耐心回答所有问题。您可能会预期大部分问题来自 iOS 团队，因为他们是不习惯在日常开发工作中看到 Kotlin 的开发者。以下是一些最常见问题列表，可能对您有所帮助：

### 问：我听说基于跨平台技术的应用程序可能会被 App Store 拒绝。冒这个风险值得吗？

答：Apple Store 对发布[应用程序](#application)有严格的指导原则。其中一个限制是[应用](#app)不得下载、安装或执行引入或更改[应用](#app)任何[特性](#feature)或[功能](#functionality)的代码（[App Store 审阅指南 2.5.2](https://developer.apple.com/app-store/review/guidelines/#software-requirements)）。这适用于某些跨平台技术，但不适用于 Kotlin Multiplatform。共享的 Kotlin 代码通过 [Kotlin/Native](#Kotlin/Native) 编译成[原生](#native)二进制文件，将常规的 iOS [framework](#framework) 打包到您的[应用](#app)中，并且不提供动态代码执行的能力。

### 问：多平台项目是用 Gradle 构建的，而 Gradle 有极其陡峭的学习曲线。这意味着我需要花费大量时间来尝试配置我的项目吗？ {id="gradle-time-spent"}

答：实际上没必要。有多种方法可以组织围绕[构建](#build) Kotlin 移动[应用程序](#application)的工作流程。首先，只有 Android 开发者负责[构建](#build)工作，在这种情况下，iOS 团队将只编写代码，甚至只使用生成的 [artifact](#artifact)。您还可以组织一些研讨会或练习结对编程，以处理需要使用 Gradle 的[任务](#task)，这将提高您团队的 Gradle 技能。您可以探索组织多平台[项目](#project)团队合作的不同方式，并选择最适合您团队的方式。

当团队中只有 Android 部分处理共享代码时，iOS 开发者甚至不需要学习 Kotlin。但是，当您准备好让团队进入下一阶段，即每个人都为共享代码做出贡献时，这种过渡不会花费太多时间。Swift 和 Kotlin 在语法和[功能](#functionality)上的相似性大大减少了学习如何读写共享 Kotlin 代码所需的工作量。[通过 Kotlin 心印 亲自尝试](https://play.kotlinlang.org/koans/overview)，这是一系列练习，可帮助您熟悉 Kotlin 语法和一些习语。

在 2023 年底，JetBrains 推出了 [Amper](https://blog.jetbrains.com/blog/2023/11/09/amper-improving-the-build-tooling-user-experience/)，这是一款专注于可用性、新手引导和 IDE 支持的新[实验性的](#experimental)[项目](#project)配置工具。要深入了解 Amper 的[功能](#functionality)，请参阅其[教程](amper.md)。

### 问：Kotlin Multiplatform 可以用于生产环境了吗？

答：2023 年 11 月，我们宣布 Kotlin Multiplatform 现已 [Stable](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)，这意味着它现在已完全[准备好](#ready)供您在生产环境中使用。

### 问：没有足够的多平台库来实现在我的应用的业务逻辑，而且寻找原生替代方案要容易得多。为什么我应该选择 Kotlin Multiplatform？ {id="not-enough-libraries"}

答：Kotlin Multiplatform 生态系统正在蓬勃发展，并由世界各地的许多 Kotlin 开发者共同培育。只需看看多年来 KMP 库的数量增长速度。

![The number of Kotlin Multiplatform libraries over years](kmp-libraries-over-years.png){width=700}

在 Kotlin Multiplatform 开源社区中，现在也是成为一名 iOS 开发者的大好时机，因为 iOS 经验需求旺盛，并且有很多机会因 iOS [特有的](#XXX-specific)贡献而获得认可。

您的团队对多平台移动开发了解得越多，他们的问题就会越有趣和复杂。如果您没有答案也别担心——Kotlin Multiplatform 在 Kotlin Slack 上拥有一个庞大且支持性的社区，其中有一个专门的 [#multiplatform](https://slack-chats.kotlinlang.org/c/multiplatform) 频道，许多已经使用它的开发者可以帮助您。如果您能[与我们分享](mailto:kotlin.multiplatform.feedback@kotlinlang.org)您的团队提出的最常见问题，我们将不胜感激。这些信息将帮助我们了解文档中需要涵盖哪些主题。

## 在适应期支持团队

在您决定使用 Kotlin Multiplatform 之后，在您的团队试用这项技术的过程中会有一个适应期。您的使命还没有结束！通过为您的队友提供持续支持，您将缩短团队深入研究技术并取得初步成果所需的时间。

以下是在此阶段您可以如何支持团队的一些提示：

* 将您在上一阶段被问到的问题收集到名为“Kotlin Multiplatform：常见问题”的 wiki 页面上，并与您的团队分享。
* 创建一个 _#kotlin-multiplatform-support_ Slack 频道，并成为其中最活跃的用户。
* 组织一个非正式的团队建设活动，带上爆米花和披萨，一起观看关于 Kotlin Multiplatform 的教育或励志视频。以下是一些不错的视频选择：
   * [Getting Started With KMP: Build Apps for iOS and Android With Shared Logic and Native UIs](https://www.youtube.com/live/zE2LIAUisRI?si=V1cn1Pr-0Sjmjzeu)
   * [Build Apps for iOS, Android, and Desktop With Compose Multiplatform](https://www.youtube.com/live/IGuVIRZzVTk?si=WFI3GelN7UDjfP97)
   * [iOS Development With Kotlin Multiplatform: Tips and Tricks](https://www.youtube.com/watch?v=eFzy1BRtHps)
   * [Kotlin Multiplatform for Teams by Kevin Galligan](https://www.youtube.com/watch?v=-tJvCOfJesk)

现实是您可能无法在一天甚至一周内改变人们的心态。但耐心和对同事需求的细心关注无疑会带来成果。

JetBrains 团队期待听到您[关于 Kotlin Multiplatform 使用体验的故事](mailto:kotlin.multiplatform.feedback@kotlinlang.org)。

_我们感谢 [Touchlab 团队](https://touchlab.co) 为本文的创作提供帮助。_