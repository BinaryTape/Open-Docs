[//]: # (title: 如何向团队引入多平台移动开发)

<web-summary>学习如何通过这六项建议，向您的团队引入多平台移动应用开发，以实现平稳高效的采用。</web-summary>

在组织中实施新科技和工具会带来挑战。您如何帮助团队采用[多平台移动应用开发方法](cross-platform-mobile-development.md)来优化和简化工作流程？以下是一些建议和最佳实践，可帮助您有效地向团队介绍 [Kotlin Multiplatform (KMP)](https://www.jetbrains.com/kotlin-multiplatform/)——这项由 JetBrains 构建的开源技术，它允许开发者在跨平台共享代码的同时，保留原生编程的优势。

*   [从同理心开始](#start-with-empathy)
*   [解释 Kotlin Multiplatform 的工作原理](#explain-how-kotlin-multiplatform-works)
*   [使用案例研究证明多平台开发的价值](#use-case-studies-to-demonstrate-the-value-of-multiplatform-development)
*   [通过创建示例项目提供证明](#offer-proof-by-creating-a-sample-project)
*   [准备好回答团队关于多平台开发的问题](#prepare-for-questions-about-multiplatform-development-from-your-team)
*   [在适应期内支持您的团队](#support-your-team-during-the-adaptation-period)

## 从同理心开始

软件开发是一项团队协作，每个关键决策都需要所有团队成员的认可。集成任何跨平台技术都将显著影响您的移动应用程序的开发过程。因此，在将 Kotlin Multiplatform 集成到您的项目之前，您需要向团队介绍这项技术，并温和地引导他们认识到其采用的价值。

了解参与项目的成员是成功集成的第一步。您的老板负责以最短的时间交付高质量的特性。对他们而言，任何新技术都意味着风险。您的同事也有不同的看法。他们有使用“原生”技术栈构建应用的经验。他们知道如何在 IDE 中编写 UI 和业务逻辑、处理依赖项、测试和调试代码，并且已经熟悉相关语言。转向不同的生态系统总是不方便的，因为它总是意味着离开您的舒适区。

鉴于以上所有情况，在倡导转向 Kotlin Multiplatform 时，请准备好面对大量的偏见并回答许多问题。在此过程中，永远不要忘记您的团队需求。以下的一些建议可能有助于您准备演示。

## 解释 Kotlin Multiplatform 的工作原理

在此阶段，您需要证明使用 Kotlin Multiplatform 可以为您的项目带来价值，并消除团队中可能存在的任何关于跨平台移动应用程序的偏见和疑虑。

KMP 自 Alpha 版本发布以来已被广泛用于生产环境。因此，JetBrains 能够收集到大量反馈，并在[稳定版本](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)中提供更好的开发体验。

*   **能够使用所有 iOS 和 Android 特性** – 每当共享代码无法完成任务，或您想使用特定原生特性时，您可以使用 [expect/actual](multiplatform-expect-actual.md) 模式来无缝编写平台特有的代码。
*   **无缝性能** – 用 Kotlin 编写的共享代码会针对不同的目标平台编译成不同的输出格式：Android 的 Java 字节码和 iOS 的原生二进制文件。因此，在这些平台上执行代码时没有额外的运行时开销，性能可与[原生应用](native-and-cross-platform.md)媲美。
*   **与遗留代码的兼容性** – 无论您的项目有多大，您现有的代码都不会妨碍您集成 Kotlin Multiplatform。您可以随时开始编写跨平台代码，并将其作为常规依赖项连接到您的 iOS 和 Android 应用，或者您可以使用已有的代码并对其进行修改以兼容 iOS。

能够解释一项技术“如何”工作至关重要，因为没有人喜欢讨论似乎依赖于“魔法”。如果任何事情对他们来说不清楚，人们可能会往最坏的方面想，因此请注意不要犯“认为某些事情太明显而无需解释”的错误。相反，尝试在进入下一阶段之前解释所有基本概念。这份关于[多平台编程](get-started.topic)的文档可以帮助您系统化知识，为这种体验做好准备。

## 使用案例研究证明多平台开发的价值

了解多平台技术的工作原理是必要的，但还不够。您的团队需要看到使用它的好处，并且您呈现这些好处的方式应与您的产品相关。

在此阶段，您需要解释在您的产品中使用 Kotlin Multiplatform 的主要好处。一种方法是分享其他公司已经受益于跨平台移动开发的故事。这些团队的成功经验，尤其是那些具有相似产品目标的团队，可能会成为最终决策的关键因素。

引用不同公司已经将 Kotlin Multiplatform 用于生产环境的案例研究，可以极大地帮助您提出有说服力的论点：

*   **McDonald's** – 通过将 Kotlin Multiplatform 用于其全球移动应用，McDonald's 构建了一个可以在不同平台共享的代码库，从而消除了对代码库冗余的需求。
*   **Netflix** – 借助 Kotlin Multiplatform，Netflix 优化了产品可靠性和交付速度，这对其满足客户需求至关重要。
*   **Forbes** – 通过在 iOS 和 Android 之间共享超过 80% 的逻辑，Forbes 现在可以在两个平台上同时推出新特性，同时保留平台特有的定制灵活性。
*   **9GAG** – 在尝试了 Flutter 和 React Native 之后，9GAG 逐渐采用了 Kotlin Multiplatform，这现在帮助他们更快地发布特性，同时为用户提供一致的体验。

[![了解 Kotlin Multiplatform 的成功案例](kmp-success-stories.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/case-studies.html)

## 通过创建示例项目提供证明

理论虽好，但付诸实践终究是最重要的。作为一种使您的论点更具说服力并展示多平台移动应用开发潜力的选择，您可以投入一些时间使用 Kotlin Multiplatform 创建一些东西，然后将成果带给您的团队讨论。您的原型可以是一种测试项目，您将从头开始编写它，并演示您的应用程序所需的特性。
[使用 Ktor 和 SQLDelight 创建多平台应用——教程](multiplatform-ktor-sqldelight.md)很好地指导了这一过程。

您可以通过试验当前项目来生成更多相关示例。
您可以将一个用 Kotlin 实现的现有特性变为跨平台的，
或者您甚至可以在现有项目中创建一个新的 Multiplatform Module，
从待办事项列表底部选择一个非优先级特性，并在共享模块中实现它。
[让您的 Android 应用程序在 iOS 上运行——教程](multiplatform-integrate-in-existing-app.md)提供了一个基于示例项目的分步指南。

## 准备好回答团队关于多平台开发的问题

无论您的推介多么详细，您的团队都会有很多问题。请仔细倾听并耐心尝试回答所有问题。您可能会预期大部分问题来自 iOS 团队成员，因为他们是不习惯在日常开发工作中看到 Kotlin 的开发者。以下一些最常见问题列表可能会对您有所帮助：

### 问：我听说基于跨平台技术的应用程序可能会被 App Store 拒绝。承担这个风险值得吗？

答：Apple Store 对发布应用程序有严格的指南。其中一个限制是，应用程序不得下载、安装或执行引入或更改应用程序任何特性或功能的代码（[App Store 审阅指南 2.5.2](https://developer.apple.com/app-store/review/guidelines/#software-requirements)）。这与某些跨平台技术有关，但与 Kotlin Multiplatform 无关。共享的 Kotlin 代码通过 Kotlin/Native 编译成原生二进制文件，将一个常规 iOS 框架捆绑到您的应用程序中，并且不提供动态代码执行的能力。

### 问：多平台项目是用 Gradle 构建的，而 Gradle 的学习曲线极其陡峭。这是否意味着我需要花费大量时间来配置我的项目？ {id="gradle-time-spent"}

答：实际上没有必要。围绕 Kotlin 移动应用程序的构建过程有多种组织方式。首先，只有 Android 开发者可以负责构建，在这种情况下，iOS 团队只需编写代码甚至只使用生成的构件。您还可以组织一些研讨会或在处理需要使用 Gradle 的任务时进行结对编程，这将提升团队的 Gradle 技能。您可以探索不同的多平台项目团队协作组织方式，并选择最适合您团队的方式。

当只有 Android 团队成员处理共享代码时，iOS 开发者甚至不需要学习 Kotlin。但当您准备好让团队进入下一个阶段，即每个人都为共享代码贡献时，这个过渡并不会花费太多时间。Swift 和 Kotlin 在语法和功能上的相似性大大减少了学习如何阅读和编写共享 Kotlin 代码所需的工作量。[通过 Kotlin 心印亲自尝试](https://play.kotlinlang.org/koans/overview)，这是一系列旨在让您熟悉 Kotlin 语法和一些习语的练习。

2023 年底，JetBrains 推出了 [Amper](https://blog.jetbrains.com/blog/2023/11/09/amper-improving-the-build-tooling-user-experience/)，一个专注于可用性、上手体验和 IDE 支持的新实验性项目配置工具。要了解 Amper 功能的更多信息，请查看其[教程](amper.md)。

### 问：Kotlin Multiplatform 生产就绪了吗？

答：2023 年 11 月，我们宣布 Kotlin Multiplatform 现已[稳定](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)，这意味着它现在已完全准备好供您在生产环境中使用。

### 问：没有足够多的多平台库来实现我应用的业务逻辑，而且找到原生替代方案要容易得多。我为什么要选择 Kotlin Multiplatform？ {id="not-enough-libraries"}

答：Kotlin Multiplatform 生态系统正在蓬勃发展，并由世界各地的许多 Kotlin 开发者共同培养。看看多年来 KMP 库的数量增长有多快就知道了。

![多年来 Kotlin Multiplatform 库的数量](kmp-libraries-over-years.png){width=700}

成为 Kotlin Multiplatform 开源社区中的 iOS 开发者也是一个很好的时机，因为 iOS 经验需求量大，并且有很多机会因 iOS 特有的贡献而获得认可。

您的团队对多平台移动开发挖得越深，他们的问题就会越有趣和复杂。如果您没有答案也别担心——Kotlin Multiplatform 在 Kotlin Slack 上拥有一个庞大且支持性强的社区，其中有一个专门的 [#multiplatform](https://slack-chats.kotlinlang.org/c/multiplatform) 频道，许多已经使用它的开发者可以帮助您。如果您能[与我们分享](mailto:kotlin.multiplatform.feedback@kotlinlang.org)您的团队提出的最常见问题，我们将不胜感激。这些信息将帮助我们了解哪些主题需要在文档中进行涵盖。

## 在适应期内支持您的团队

在您决定使用 Kotlin Multiplatform 之后，会有一个团队试验这项技术的适应期。而您的使命还没有结束！通过为您的队友提供持续支持，您将缩短团队深入了解这项技术并取得初步成果所需的时间。

以下是一些关于如何在此阶段支持您的团队的建议：

*   将您在上一阶段被问到的问题收集到一个“Kotlin Multiplatform：常见问题” `wiki` 页面上，并与您的团队共享。
*   创建一个 `_#kotlin-multiplatform-support_` Slack 频道，并成为其中最活跃的用户。
*   组织一次非正式的团建活动，备好爆米花和披萨，一起观看有关 Kotlin Multiplatform 的教育性或启发性视频。以下是一些不错的视频选择：
    *   [Kotlin Multiplatform 入门：用共享逻辑和原生 UI 构建 iOS 和 Android 应用](https://www.youtube.com/live/zE2LIAUisRI?si=V1cn1Pr-0Sjmjzeu)
    *   [用 Compose Multiplatform 构建 iOS、Android 和桌面应用](https://www.youtube.com/live/IGuVIRZzVTk?si=WFI3GelN7UDjfP97)
    *   [使用 Kotlin Multiplatform 进行 iOS 开发：技巧与窍门](https://www.youtube.com/watch?v=eFzy1BRtHps)
    *   [Kevin Galligan 讲解的团队 Kotlin Multiplatform](https://www.youtube.com/watch?v=-tJvCOfJesk)

现实是，您可能无法在一天甚至一周内改变人们的心意。但耐心和对同事需求的细心关注无疑会带来成果。

JetBrains 团队期待听到您[关于 Kotlin Multiplatform 体验的故事](mailto:kotlin.multiplatform.feedback@kotlinlang.org)。

_感谢 [Touchlab 团队](https://touchlab.co)协助撰写本文。_