[//]: # (title: 如何向团队推介多平台移动开发)

<web-summary>通过这六项有助于平稳高效采用的建议，了解如何向您的团队推介多平台移动应用开发。</web-summary>

在组织中实施新技术和工具总是伴随着挑战。您该如何帮助团队采用[多平台移动应用开发方法](cross-platform-mobile-development.topic)来优化并简化工作流程？以下是一些建议和最佳实践，旨在帮助您有效地向团队推介 [Kotlin Multiplatform (KMP)](https://www.jetbrains.com/kotlin-multiplatform/)。这是一种由 JetBrains 构建的开源技术，允许开发者在跨平台共享代码的同时，保留原生编程的优势。

* [从同理心开始](#start-with-empathy)
* [解释 Kotlin Multiplatform 的工作原理](#explain-how-kotlin-multiplatform-works)
* [使用案例研究展示多平台开发的价值](#use-case-studies-to-demonstrate-the-value-of-multiplatform-development)
* [通过创建示例项目提供证明](#offer-proof-by-creating-a-sample-project)
* [为团队关于多平台开发的问题做好准备](#prepare-for-questions-about-multiplatform-development-from-your-team)
* [在适应期为您的团队提供支持](#support-your-team-during-the-adaptation-period)

## 从同理心开始

软件开发是一项团队运动，每一个关键决策都需要得到所有团队成员的认可。集成任何跨平台技术都会显著影响移动应用程序的开发过程。因此，在开始将 Kotlin Multiplatform 集成到项目中之前，您需要向团队介绍这项技术，并引导他们逐渐意识到其采用价值。

了解参与项目的成员是成功集成的第一步。您的老板负责在尽可能短的时间内交付质量最好的功能。对他们来说，任何新技术都是一种风险。您的同事也有不同的视角。他们拥有使用“原生”技术栈构建应用的经验。他们知道如何编写 UI 和业务逻辑、处理依赖项、在 IDE 中测试和调试代码，并且已经熟悉了相关语言。切换到不同的生态系统总是不便的，因为这通常意味着要离开舒适区。

考虑到这一切，在倡导迁移到 Kotlin Multiplatform 时，请准备好面对许多偏见并回答大量问题。在此过程中，切勿忽视团队的需求。以下一些建议可能有助于您准备推介方案。

## 解释 Kotlin Multiplatform 的工作原理

在此阶段，您需要展示使用 Kotlin Multiplatform 能为项目带来价值，并消除团队可能对跨平台移动应用持有的任何偏见和疑虑。

自 Alpha 版本发布以来，KMP 已在生产环境中得到广泛应用。因此，JetBrains 能够收集广泛的反馈，并在[稳定版](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)中提供更出色的开发体验。

* **能够使用所有 iOS 和 Android 功能** —— 每当任务无法在共享代码中完成，或者您想使用特定的原生功能时，都可以使用 [`expect`/`actual`](multiplatform-expect-actual.md) 模式无缝编写平台特定代码。
* **无缝性能** —— 用 Kotlin 编写的共享代码会被编译成针对不同目标的不同输出格式：针对 Android 的 Java 字节码和针对 iOS 的原生二进制文件。因此，在平台上执行这些代码时不会产生额外的运行时开销，其性能可与[原生应用](native-and-cross-platform.topic)媲美。
* **与旧版代码的兼容性** —— 无论您的项目规模有多大，现有的代码都不会阻碍您集成 Kotlin Multiplatform。您可以随时开始编写跨平台代码并将其作为常规依赖项连接到 iOS 和 Android 应用，或者您也可以使用已经编写的代码并将其修改为与 iOS 兼容。

能够解释技术*如何*工作至关重要，因为没有人喜欢听起来像是在靠“魔法”运作的讨论。如果某些事情不清楚，人们可能会产生最坏的打算，因此请务必注意，不要误以为某些事情显而易见而无需解释。相反，请尝试在进入下一阶段之前解释所有基本概念。这篇关于[多平台编程](get-started.topic)的文档可以帮助您系统化知识，为这次经历做好准备。

## 使用案例研究展示多平台开发的价值

理解多平台技术的工作原理是必要的，但这还不够。您的团队需要看到使用它的收益，并且您展示这些收益的方式应该与您的产品相关。

在此阶段，您需要解释在产品中使用 Kotlin Multiplatform 的主要收益。一种方法是分享其他已经从跨平台移动开发中获益的公司的案例。这些团队的成功经验，尤其是那些具有相似产品目标的团队，可能会成为最终决定的关键因素。

引用已经在生产环境中使用 Kotlin Multiplatform 的不同公司的案例研究，可以显著增强您的说服力：

* **麦当劳 (McDonald's)** —— 通过在全移动应用中利用 Kotlin Multiplatform，麦当劳构建了一个可以跨平台共享的代码库，消除了代码库冗余的需求。
* **Netflix** —— 在 Kotlin Multiplatform 的帮助下，Netflix 优化了产品的可靠性和交付速度，这对于满足客户需求至关重要。
* **福布斯 (Forbes)** —— 通过在 iOS 和 Android 之间共享超过 80% 的逻辑，福布斯现在可以同时在两个平台上推出新功能，同时保留平台特定自定义的灵活性。
* **9GAG** —— 在尝试了 Flutter 和 React Native 之后，9GAG 逐渐采用了 Kotlin Multiplatform，这现在帮助他们更快地交付功能，同时为用户提供一致的体验。

[![从 Kotlin Multiplatform 成功案例中学习](kmp-success-stories.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/case-studies.html)

## 通过创建示例项目提供证明

理论虽好，但付诸实践终究是最重要的。为了让您的案例更具说服力并展示多平台移动应用开发的潜力，您可以投入一些时间使用 Kotlin Multiplatform 创建一些东西，然后将结果带给团队讨论。您的原型可以是一个测试项目，您可以从头开始编写，并演示应用中所需的功能。
[使用 Ktor 和 SQLDelight 创建多平台应用 – 教程](multiplatform-ktor-sqldelight.md)将很好地指导您完成这一过程。

您可以通过在当前项目中进行实验来生成更相关的示例。
您可以将一个现有的用 Kotlin 实现的功能改为跨平台实现，
或者您甚至可以在现有项目中创建一个新的多平台模块 (Multiplatform Module)，
从积压工作 (backlog) 底部选取一个非优先级功能，并在共享模块中实现它。
[使您的 Android 应用程序在 iOS 上运行 – 教程](multiplatform-integrate-in-existing-app.md)提供了一个基于示例项目的分步指南。

## 为团队关于多平台开发的问题做好准备

无论您的推介方案多么详尽，团队都会有很多问题。请仔细倾听并耐心回答。您可以预料到大多数问题将来自 iOS 团队，因为他们是不习惯在日常开发流程中看到 Kotlin 的开发者。以下是一些最常见问题的列表，可能会对您有所帮助：

### 问：我听说基于跨平台技术的应用可能会被 App Store 拒绝。冒这个风险值得吗？

答：Apple Store 对发布应用有严格的指南。其中一项限制是应用不得下载、安装或执行引入或更改应用任何功能或特性的代码（[App Store 审核指南 2.5.2](https://developer.apple.com/app-store/review/guidelines/#software-requirements)）。这与某些跨平台技术有关，但与 Kotlin Multiplatform 无关。共享的 Kotlin 代码通过 Kotlin/Native 编译为原生二进制文件，将常规的 iOS 框架捆绑到您的应用中，并且不提供动态执行代码的能力。

### 问：多平台项目是使用 Gradle 构建的，而 Gradle 的学习曲线极其陡峭。这是否意味着我现在需要花费大量时间尝试配置项目？ {id="gradle-time-spent"}

答：实际上不需要。构建 Kotlin 移动应用的工作流程有多种组织方式。首先，可以只由 Android 开发者负责构建，在这种情况下，iOS 团队只需编写代码，甚至只需使用生成的构件。您也可以在处理需要使用 Gradle 的任务时组织一些工作坊或练习结对编程，这将提高团队的 Gradle 技能。您可以探索组织多平台项目团队协作的不同方式，并选择最适合您团队的一种。

当只有 Android 团队负责共享代码时，iOS 开发者甚至不需要学习 Kotlin。但当您准备好让团队进入下一阶段（即每个人都为共享代码做贡献）时，完成转换不会花费太多时间。Swift 和 Kotlin 在语法和功能上的相似性极大地减少了学习阅读和编写共享 Kotlin 代码所需的工作量。[通过 Kotlin Koans 亲自尝试一下](https://play.kotlinlang.org/koans/overview)，这是一系列旨在熟悉 Kotlin 语法和一些惯用法的小练习。

2023 年底，JetBrains 推出了 [Amper](https://blog.jetbrains.com/blog/2023/11/09/amper-improving-the-build-tooling-user-experience/)，这是一种专注于易用性、入门引导和 IDE 支持的全新实验性项目配置工具。要深入了解 Amper 的功能，请查看其[教程](amper.md)。

### 问：Kotlin Multiplatform 准备好用于生产环境了吗？

答：在 2023 年 11 月，我们宣布 Kotlin Multiplatform 现已进入[稳定状态 (Stable)](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)，这意味着它现在已完全准备好供您在生产环境中使用。

### 问：没有足够的多平台库来实现我应用的业务逻辑，找到原生替代方案要容易得多。为什么要选择 Kotlin Multiplatform？ {id="not-enough-libraries"}

答：Kotlin Multiplatform 生态系统正在蓬勃发展，并受到全球许多 Kotlin 开发者的悉心培育。只需看看多年来 KMP 库的数量增长得有多快。

![多年来 Kotlin Multiplatform 库的数量](kmp-libraries-over-years.png){width=700}

对于 Kotlin Multiplatform 开源社区中的 iOS 开发者来说，现在也是一个绝佳的时机，因为对 iOS 经验的需求很大，并且有很多机会通过针对 iOS 的特定贡献获得认可。

您的团队对多平台移动开发研究得越深，他们的问题就会越有趣且越复杂。如果您没有答案，请不要担心 —— Kotlin Multiplatform 在 Kotlin Slack 中有一个庞大且提供支持的社区，其中设有专门的 [#multiplatform](https://slack-chats.kotlinlang.org/c/multiplatform) 频道，许多已经在使用它的开发者可以为您提供帮助。如果您能[与我们分享](mailto:kotlin.multiplatform.feedback@kotlinlang.org)您团队提出的最热门问题，我们将不胜感激。这些信息将帮助我们了解文档中需要涵盖的主题。

## 在适应期为您的团队提供支持

在您决定使用 Kotlin Multiplatform 之后，当您的团队尝试该技术时，会有一个适应期。您的使命尚未结束！通过为队友提供持续支持，您将缩短团队深入研究该技术并取得初步成果所需的时间。

以下是一些关于如何在此阶段支持团队的建议：

* 将您在上一阶段被问到的问题收集在“Kotlin Multiplatform：常见问题解答”维基页面上，并与您的团队分享。
* 创建一个 *#kotlin-multiplatform-support* Slack 频道，并成为那里最活跃的用户。
* 组织一次带有爆米花和披萨的非正式团队建设活动，一起观看有关 Kotlin Multiplatform 的教育或启发性视频。以下是一些不错的视频选择：
   * [KMP 入门：使用共享逻辑和原生 UI 构建 iOS 和 Android 应用](https://www.youtube.com/live/zE2LIAUisRI?si=V1cn1Pr-0Sjmjzeu) 
   * [使用 Compose Multiplatform 构建 iOS、Android 和桌面应用](https://www.youtube.com/live/IGuVIRZzVTk?si=WFI3GelN7UDjfP97) 
   * [使用 Kotlin Multiplatform 进行 iOS 开发：提示和技巧](https://www.youtube.com/watch?v=eFzy1BRtHps) 
   * [Kevin Galligan 的团队版 Kotlin Multiplatform](https://www.youtube.com/watch?v=-tJvCOfJesk)

现实情况是，您可能无法在一天甚至一周内改变人们的心意。但耐心和对同事需求的关注无疑会带来成果。

JetBrains 团队期待听到[您关于使用 Kotlin Multiplatform 经验的故事](mailto:kotlin.multiplatform.feedback@kotlinlang.org)。

*我们要感谢 [Touchlab 团队](https://touchlab.co)协助创作了这篇文章。*