[//]: # (title: 采用 Kotlin Multiplatform 的十大理由，助力你的项目腾飞)

<web-summary>了解为何你应当在项目中采用 Kotlin Multiplatform 的十大理由。查看来自各公司的真实案例，并开始在你的多平台开发中运用这项技术。</web-summary>

在当今多元化的技术生态中，开发者面临着构建能够跨不同平台无缝运行的应用程序的挑战，同时需要优化开发时间并提升用户生产力。Kotlin Multiplatform (KMP) 提供了一个解决方案，允许你为多个平台创建应用，促进代码在它们之间复用，同时保持原生编程的优势。

在本文中，我们将探讨开发者应考虑在现有或新项目中采用 Kotlin Multiplatform 的十大理由，以及 KMP 为何持续获得大量关注。

## 为何你应在项目中尝试 Kotlin Multiplatform

无论你是寻求效率提升，还是渴望探索新技术，本文将阐述 Kotlin Multiplatform 带来的一些实际好处，从其简化开发工作的能力，到其广泛的平台支持和强大的工具生态系统，并附有真实公司的案例研究。

* [Kotlin Multiplatform 允许你避免代码重复](#1-kotlin-multiplatform-allows-you-to-avoid-code-duplication)
* [Kotlin Multiplatform 支持广泛的平台列表](#2-kotlin-multiplatform-supports-an-extensive-list-of-platforms)
* [Kotlin 提供了简化的代码共享机制](#3-kotlin-provides-simplified-code-sharing-mechanisms)
* [Kotlin Multiplatform 允许灵活的多平台开发](#4-kotlin-multiplatform-allows-for-flexible-multiplatform-development)
* [借助 Kotlin Multiplatform 解决方案，你可以共享 UI 代码](#5-with-the-kotlin-multiplatform-solution-you-can-share-ui-code)
* [你可以在现有和新项目中使用 Kotlin Multiplatform](#6-you-can-use-kotlin-multiplatform-in-existing-and-new-projects)
* [借助 Kotlin Multiplatform，你可以逐步共享代码](#7-with-kotlin-multiplatform-you-can-start-sharing-your-code-gradually)
* [Kotlin Multiplatform 已被全球公司采用](#8-kotlin-multiplatform-is-already-used-by-global-companies)
* [Kotlin Multiplatform 提供强大的工具支持](#9-kotlin-multiplatform-provides-powerful-tooling-support)
* [Kotlin Multiplatform 拥有庞大且乐于助人的社区](#10-kotlin-multiplatform-boasts-a-large-and-supportive-community)

### 1. Kotlin Multiplatform 允许你避免代码重复

百度，全球最大的中文搜索引擎，推出了面向年轻受众的应用程序 _Wonder App_。以下是他们在传统应用开发中面临的一些问题：

* 应用体验不一致：Android 应用与 iOS 应用的工作方式不同。
* 业务逻辑验证成本高昂：使用相同业务逻辑的 iOS 和 Android 开发者需要独立检查工作，这导致了高成本。
* 高昂的升级和维护成本：重复业务逻辑复杂且耗时，这增加了应用的升级和维护成本。

百度团队决定尝试使用 Kotlin Multiplatform，首先统一数据层：数据模型、RESTful API 请求、JSON 数据解析和缓存逻辑。

随后，他们决定采用 Model-View-Intent (MVI) 用户界面模式，该模式允许你使用 Kotlin Multiplatform 统一界面逻辑。他们还共享了底层数据、处理逻辑和 UI 处理逻辑。

这项尝试非常成功，带来了以下成果：

* 其 Android 和 iOS 应用的体验保持一致。
* 降低了维护和测试成本。
* 团队内部生产力显著提升。

[![探索真实的 Kotlin Multiplatform 用例](kmp-use-cases-1.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/case-studies.html)

### 2. Kotlin Multiplatform 支持广泛的平台列表

Kotlin Multiplatform 的主要优势之一是其对各种平台的广泛支持，使其成为开发者多功能的选择。这些平台包括 Android、iOS、桌面、Web（JavaScript 和 WebAssembly）和服务器（Java 虚拟机）。

_Quizlet_，一个通过测验辅助学习和练习的流行教育平台，是另一个突出 Kotlin Multiplatform 优势的案例研究。该平台每月约有 5000 万活跃用户，其中 1000 万用户在 Android 上。该应用在 Apple App Store 教育类别中排名前十。

Quizlet 团队尝试了 JavaScript、React Native、C++、Rust 和 Go 等技术，但面临各种挑战，包括性能、稳定性以及跨平台实现的不同。最终，他们选择了适用于 Android、iOS 和 Web 的 Kotlin Multiplatform。以下是使用 KMP 给 Quizlet 团队带来的益处：

* 在封送对象时，API 更具类型安全性。
* iOS 上的评分算法比 JavaScript 快 25%。
* Android 应用大小从 18 MB 减少到 10 MB。
* 增强了开发者体验。
* 团队成员（包括 Android、iOS、后端和 Web 开发者）对编写共享代码的兴趣增加。

> [探索 Kotlin Multiplatform 提供的全部功能](https://www.jetbrains.com/kotlin-multiplatform/)
> 
{style="tip"}

### 3. Kotlin 提供了简化的代码共享机制

在编程语言领域，Kotlin 以其实用主义方法脱颖而出，这意味着它优先考虑以下特性：

* **可读性优于简洁性**。虽然简洁的代码很吸引人，但 Kotlin 明白清晰度至关重要。目标不仅仅是缩短代码，更是消除不必要的样板代码，从而提高可读性和可维护性。

* **代码复用优于纯粹的表达性**。这不仅仅是解决许多问题——更是关于识别模式和创建可复用库。通过利用现有解决方案并提取共同点，Kotlin 使开发者能够最大限度地提高代码效率。

* **互操作性优于原创性**。Kotlin 没有重复造轮子，而是拥抱与 Java 等成熟语言的兼容性。这种互操作性不仅允许与庞大的 Java 生态系统无缝集成，还促进了对经验证的实践和从以往经验中吸取教训的采纳。

* **安全性和工具优于健全性**。Kotlin 使开发者能够尽早捕获错误，确保你的程序不会陷入无效状态。通过在编译期或在 IDE 中编写代码时检测问题，Kotlin 提高了软件可靠性，最大限度地降低了运行时错误的风险。

我们每年都会进行 Kotlin 调查，以帮助我们了解用户对该语言的体验。今年，92% 的受访者表示拥有积极的体验，比一年前的 86% 显著增加。

![2023 年和 2024 年的 Kotlin 满意度](kotlin-satisfaction-rate.png){width=700}

关键在于，Kotlin 对可读性、复用性、互操作性和安全性的强调，使其成为开发者一个引人注目的选择，并提升了他们的生产力。

### 4. Kotlin Multiplatform 允许灵活的多平台开发

有了 Kotlin Multiplatform，开发者不再需要在原生开发和跨平台开发之间做选择。他们可以自由选择要共享什么以及要原生编写什么。

在 Kotlin Multiplatform 出现之前，开发者必须原生编写所有代码。

![在 Kotlin Multiplatform 出现之前：所有代码都原生编写](before-kotlin-multiplatform.svg){width="700"}

得益于 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)，Kotlin Multiplatform 允许开发者共享业务逻辑、演示逻辑，甚至 UI 逻辑。

![使用 Kotlin Multiplatform 和 Compose Multiplatform：开发者可以共享业务逻辑、演示逻辑，甚至 UI 逻辑](with-compose-multiplatform.svg){width="700"}

现在，除了平台特有的代码之外，你几乎可以共享任何内容。

### 5. 借助 Kotlin Multiplatform 解决方案，你可以共享 UI 代码

JetBrains 提供了 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)，这是一个基于 Kotlin 和 Jetpack Compose 的声明式框架，用于在多个平台（包括 Android (通过 Jetpack Compose)、iOS、桌面和 Web (Alpha)）上共享用户界面。

_Instabee_，一个专门为电子商务企业提供最后一公里物流服务的平台，在技术仍处于 Alpha 阶段时，便开始在其 Android 和 iOS 应用程序中使用 Compose Multiplatform，共享 UI 逻辑。

有一个官方的 Compose Multiplatform 示例，名为 [ImageViewer App](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)，它可以在 Android、iOS、桌面和 Web 上运行，并集成了地图和相机等原生组件。还有一个社区示例，[纽约时报应用](https://github.com/xxfast/NYTimes-KMP) 克隆版，它甚至可以在用于手表的 Wear OS（智能手表操作系统）上运行。查看 [Kotlin Multiplatform 和 Compose Multiplatform 示例](multiplatform-samples.md) 列表，了解更多示例。

[![探索 Compose Multiplatform](explore-compose.svg){width="700"}](https://www.jetbrains.com/compose-multiplatform/)

### 6. 你可以在现有和新项目中使用 Kotlin Multiplatform

我们来看以下两种场景：

* **在现有项目中采用 KMP**

  再次以百度 Wonder App 为例。该团队已经拥有 Android 和 iOS 应用，他们只是统一了逻辑。他们开始逐步统一更多的库和逻辑，随后实现了跨平台共享的统一代码库。

* **在新项目中采用 KMP**

  _9GAG_，一个在线平台和社交媒体网站，尝试了 Flutter 和 React Native 等不同技术，但最终选择了 Kotlin Multiplatform，这使得他们能够统一其应用在两个平台上的行为。他们首先创建了一个 Android 应用。然后，他们将 Kotlin Multiplatform 项目作为 iOS 上的一个依赖项使用。

### 7. 借助 Kotlin Multiplatform，你可以逐步共享代码

你可以从小处着手，从常量等简单元素开始，逐步迁移电子邮件验证等常用工具。你还可以编写或迁移业务逻辑，例如事务处理或用户身份验证。

在 JetBrains，我们经常进行 Kotlin Multiplatform 调查，并询问社区他们在不同平台之间共享了哪些代码部分。这些调查显示，数据模型、数据序列化、网络、分析和内部工具是这项技术产生重大影响的关键领域。

![用户通过 Kotlin Multiplatform 能够在平台间共享的代码部分：调查结果](parts-of-code-share.png){width="700"}

### 8. Kotlin Multiplatform 已被全球公司采用

KMP 已被全球许多大型公司使用，包括福布斯、飞利浦、Cash App、Meetup、Autodesk 等等。你可以在[案例研究页面](case-studies.topic)阅读他们的所有故事。

2023 年 11 月，JetBrains 宣布 Kotlin Multiplatform 现已 [稳定](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)，吸引了更多公司和团队对该技术的兴趣。

### 9. Kotlin Multiplatform 提供强大的工具支持

在使用 Kotlin Multiplatform 项目时，你拥有触手可及的强大工具支持。

* **Android Studio**。这个集成开发环境 (IDE) 基于 IntelliJ Community Edition 构建，被广泛认为是 Android 开发的行业标准。Android Studio 提供了一套全面的特性，用于编码、调试和性能监控。
* **Xcode**。Apple 的 IDE 可用于创建 Kotlin Multiplatform 应用的 iOS 部分。Xcode 是 iOS 应用开发的标准，提供了大量的工具用于编码、调试和配置。然而，Xcode 仅支持 Mac。

### 10. Kotlin Multiplatform 拥有庞大且乐于助人的社区

Kotlin 和 Kotlin Multiplatform 拥有一个非常乐于助人的社区。以下是一些你可以找到任何问题答案的地方。

* [Kotlinlang Slack 工作区](https://slack-chats.kotlinlang.org/)。该工作区拥有约 60,000 名成员，并有几个与跨平台开发相关的频道，例如 [#multiplatform](https://slack-chats.kotlinlang.org/c/multiplatform)、[#compose](https://slack-chats.kotlinlang.org/c/compose) 和 [#compose-ios](https://slack-chats.kotlinlang.org/c/compose-ios)。
* [Kotlin X](https://twitter.com/kotlin)。在这里，你将找到快速的专家见解和最新新闻，包括无数多平台技巧。
* [Kotlin YouTube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)。我们的 YouTube 频道提供实用教程、与专家的直播，以及其他优秀的教育内容，适合视觉学习者。
* [Kotlin Roundup](https://lp.jetbrains.com/subscribe-to-kotlin-news/)。如果你想随时了解动态的 Kotlin 和 Kotlin Multiplatform 生态系统中的最新更新，请订阅我们的定期新闻稿！

Kotlin Multiplatform 生态系统正在蓬勃发展。它受到全球众多 Kotlin 开发者热情的培育。以下是显示每年创建的 Kotlin Multiplatform 库数量的图表：

![多年来 Kotlin Multiplatform 库的数量。](kmp-libs-over-years.png){width="700"}

如你所见，2021 年出现了明显的增长，此后库的数量一直没有停止增长。

## 为何选择 Kotlin Multiplatform 而非其他跨平台技术？

在选择[不同跨平台解决方案](cross-platform-frameworks.md)时，权衡其优缺点至关重要。以下是 Kotlin Multiplatform 可能成为你的正确选择的关键原因细分：

* **出色的工具支持，易于使用**。Kotlin Multiplatform 利用 Kotlin，为开发者提供了出色的工具支持和易用性。
* **原生编程**。原生编写代码很简单。得益于[预期声明和实际声明](multiplatform-expect-actual.md)，你可以使你的多平台应用访问平台特有的 API。
* **卓越的跨平台性能**。用 Kotlin 编写的共享代码会为不同的目标平台编译成不同的输出格式：Android 为 Java 字节码，iOS 为原生二进制文件，确保在所有平台上都有良好的性能。

如果你已经决定尝试 Kotlin Multiplatform，这里有一些帮助你入门的技巧：

* **从小处着手**。从小的共享组件或常量开始，让团队熟悉 Kotlin Multiplatform 的工作流程和优势。
* **制定计划**。制定清晰的实验计划，假设预期结果以及实施和分析的方法。定义共享代码贡献的角色，并建立有效分发更改的工作流程。
* **评估并进行回顾**。与你的团队进行回顾会议，评估实验的成功与否，并找出任何挑战或需要改进的领域。如果它对你有效，你可能想扩大范围并共享更多代码。如果无效，你需要了解本次实验未成功的原因。

[![亲身体验 Kotlin Multiplatform！立即开始](kmp-get-started-action.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)

对于那些希望帮助团队开始使用 Kotlin Multiplatform 的人，我们准备了包含实用技巧的[详细指南](multiplatform-introduce-your-team.md)。

如你所见，Kotlin Multiplatform 已被许多大型公司成功用于构建高性能的跨平台应用程序，这些应用具有原生外观的 UI，能够有效地复用代码，同时保持原生编程的优势。