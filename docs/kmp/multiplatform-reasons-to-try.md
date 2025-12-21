[//]: # (title: 采用 Kotlin Multiplatform 的十大理由，助力项目提速)

<web-summary>了解为何应在项目中采用 Kotlin Multiplatform 的十大理由。本文将展示来自真实公司的案例，助您在多平台开发中开始使用这项技术。</web-summary>

在当今多元化的技术领域，
开发者面临着构建能够在各种平台上无缝运行的应用程序的挑战，
同时需要优化开发时间并提高用户生产力。
Kotlin Multiplatform (KMP) 提供了一种解决方案，使您能够为多个平台创建应用，
在不同平台间促进代码复用，同时保持原生编程的优势。

在本文中，我们将探讨开发者应在现有或新项目中使用
Kotlin Multiplatform 的十大理由，以及 KMP 为何持续获得大量关注。

**采用率稳步上升：** 根据最近两次 [开发者生态系统调查](https://devecosystem-2025.jetbrains.com/)，Kotlin Multiplatform 的使用量在短短一年内翻了一番多，从 2024 年的 7% 增长到 2025 年的 18%。这种快速增长凸显了该技术日益强劲的势头以及开发者对其寄予的信心。

![KMP usage increased from 7% in 2024 to 18% in 2025 among respondents to the last two Developer Ecosystem surveys](kmp-growth-deveco.svg){width=700}

## 为何应在项目中使用 Kotlin Multiplatform

无论您是追求效率提升，还是渴望探索新技术，
本文都将阐释 Kotlin Multiplatform 带来的诸多实际益处，
包括其简化开发工作、广泛的平台支持和强大的工具生态系统等能力。
您还将找到来自真实公司的案例研究。

1. [Kotlin Multiplatform 助您避免代码重复](#1-kotlin-multiplatform-helps-you-avoid-code-duplication)
2. [Kotlin Multiplatform 支持广泛的平台列表](#2-kotlin-multiplatform-supports-an-extensive-list-of-platforms)
3. [Kotlin 提供简化的代码共享机制](#3-kotlin-provides-simplified-code-sharing-mechanisms)
4. [Kotlin Multiplatform 实现灵活的多平台开发](#4-kotlin-multiplatform-allows-for-flexible-multiplatform-development)
5. [借助 Kotlin Multiplatform 解决方案，您可以共享 UI 代码](#5-with-the-kotlin-multiplatform-solution-you-can-share-ui-code)
6. [您可在现有和新项目中使用 Kotlin Multiplatform](#6-you-can-use-kotlin-multiplatform-in-existing-and-new-projects)
7. [借助 Kotlin Multiplatform，您可以逐步共享代码](#7-with-kotlin-multiplatform-you-can-start-sharing-your-code-gradually)
8. [Kotlin Multiplatform 已被全球公司采用](#8-kotlin-multiplatform-is-already-used-by-global-companies)
9. [Kotlin Multiplatform 提供强大的工具支持](#9-kotlin-multiplatform-provides-powerful-tooling-support)
10. [Kotlin Multiplatform 拥有庞大且支持性的社区](#10-kotlin-multiplatform-boasts-a-large-and-supportive-community)

### 1. Kotlin Multiplatform 助您避免代码重复

百度，全球最大的中文搜索引擎，推出了面向年轻受众的应用程序 _Wonder App_。他们在传统应用程序开发中面临以下问题：

* 应用程序体验不一致：Android 应用程序与 iOS 应用程序的工作方式不同。
* 业务逻辑验证成本高昂：iOS 和 Android 开发者使用相同业务逻辑的工作需要独立检测，这导致了高昂的成本。
* 升级和维护成本高昂：业务逻辑的重复繁琐耗时，这增加了应用程序的升级和维护成本。

百度团队决定尝试使用 Kotlin Multiplatform，首先统一了数据层：数据模型、RESTful API 请求、JSON 数据解析和缓存逻辑。

随后他们决定采用 Model-View-Intent (MVI) 用户界面模式，该模式允许您使用 Kotlin Multiplatform 统一界面逻辑。他们还共享了底层数据、处理逻辑和 UI 处理逻辑。

该尝试结果非常成功，带来了以下收益：

* Android 和 iOS 应用程序提供了一致的体验。
* 降低了维护和测试成本。
* 显著提高了团队内部的生产力。

[![Explore real-world Kotlin Multiplatform use cases](kmp-use-cases-1.svg){width="500"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/case-studies.html)

### 2. Kotlin Multiplatform 支持广泛的平台列表

Kotlin Multiplatform 的主要优势之一是其对各种平台的广泛支持，使其成为开发者多功能的选择。
这些平台包括 Android、iOS、桌面、Web（JavaScript 和 WebAssembly）以及服务器（Java Virtual Machine）。

_Quizlet_ 是一个通过测验辅助学习和练习的流行教育平台，它为 Kotlin Multiplatform 的优势提供了另一个案例研究。
该平台每月约有 5000 万活跃用户，其中 1000 万来自 Android。
该应用程序在 Apple App Store 的教育类别中排名前 10 位。

Quizlet 团队尝试了 JavaScript、React Native、C++、Rust 和 Go 等技术，但面临各种挑战，包括性能、稳定性以及跨平台实现差异。
最终，他们选择了 Kotlin Multiplatform 用于 Android、iOS 和 Web。
以下是使用 KMP 给 Quizlet 团队带来的益处：

* 编组对象时获得更类型安全的 API。
* iOS 上的评分算法比 JavaScript 快 25%。
* Android 应用程序大小从 18 MB 减少到 10 MB。
* 增强了开发者体验。
* 团队成员（包括 Android、iOS、后端和 Web 开发者）对编写共享代码的兴趣增加。

![Get started with Kotlin Multiplatform](get-started-with-kmp.svg){width="500"}

### 3. Kotlin 提供简化的代码共享机制

在编程语言领域，Kotlin 以其实用主义方法脱颖而出，这意味着它优先考虑以下特性：

* **可读性优于简洁性**。虽然简洁的代码很有吸引力，但 Kotlin 明白清晰度至关重要。目标不仅仅是缩短代码，更是消除不必要的样板代码，从而提高可读性和可维护性。

* **代码复用优于纯粹的表达性**。它不仅仅是解决许多问题，更是关于识别模式和创建可复用的库。通过利用现有解决方案并提取共同点，Kotlin 使开发者能够最大限度地提高代码效率。

* **互操作性优于独创性**。Kotlin 没有另起炉灶，而是拥抱与 Java 等成熟语言的兼容性。这种互操作性不仅允许与庞大的 Java 生态系统无缝集成，还有助于采用经过验证的实践和从过往经验中汲取的经验教训。

* **安全性与工具优于健全性**。Kotlin 使开发者能够及早捕获错误，确保您的程序不会进入无效状态。通过在编译期或在 IDE 中编写代码时检测问题，Kotlin 提高了软件可靠性，最大限度地降低了运行时错误的风险。

关键在于 Kotlin 对可读性、复用性、互操作性和安全性的重视，使其成为开发者一个引人注目的选择，并提高了他们的生产力。

### 4. Kotlin Multiplatform 实现灵活的多平台开发

借助 Kotlin Multiplatform，开发者不再需要在原生开发和跨平台开发之间做出二选一的决定。他们可以选择共享什么，以及原生编写什么。

在 Kotlin Multiplatform 出现之前，开发者必须原生编写所有内容。

![Before Kotlin Multiplatform: writing all code natively](before-kotlin-multiplatform.svg){width="700"}

Kotlin Multiplatform 允许您选择适合您项目的代码共享级别。

1) [共享逻辑和 UI](compose-multiplatform-create-first-app.md)：为了最大程度的代码复用和更快的交付，您不仅可以共享业务和表示逻辑，还可以通过将 Kotlin Multiplatform 与 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/) 结合使用来共享用户界面代码。这使得在 Android、iOS、桌面和 Web 上维护统一的代码库成为可能，同时仍可在需要时集成特定于平台的 API。这种方法有助于简化开发并确保跨平台的一致行为。

2) [共享逻辑同时保持原生 UI](multiplatform-create-first-app.md)：如果平台特有的视觉行为或用户体验保真度是优先考虑项，您可以选择仅共享数据和业务逻辑。在这种结构下，每个平台都保留其原生 UI 层，同时受益于通用且一致的逻辑实现。这种方法非常适合希望在不改变现有 UI 工作流程的情况下减少重复的团队。

3) [共享少量逻辑](multiplatform-ktor-sqldelight.md)：Kotlin Multiplatform 也可以通过共享一小部分核心逻辑（例如验证、领域计算或认证流程）来逐步引入。当您希望在不进行大规模架构更改的情况下提高跨平台的一致性和稳定性时，此选项非常适用。

![With Kotlin Multiplatform and Compose Multiplatform: developers can share business logic, presentation logic, or even UI logic](with-compose-multiplatform.svg){width="700"}

现在，除了平台特有的代码外，您可以共享几乎所有内容。

### 5. 借助 Kotlin Multiplatform 解决方案，您可以共享 UI 代码

JetBrains 提供了 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)，这是一个基于 Kotlin 和 Jetpack Compose 的声明式框架，用于在多个平台（包括 Android（通过 Jetpack Compose）、iOS、桌面和 Web（Beta 版））上共享用户界面。

_Instabee_，一个专门为电子商务企业提供最后一公里物流服务的平台，在其 Android 和 iOS 应用程序中开始使用 Compose Multiplatform 共享 UI 逻辑，当时该技术仍处于 Alpha 阶段。

Compose Multiplatform 有一个官方示例，名为 [ImageViewer App](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)，它在 Android、iOS、桌面和 Web 上运行，并集成了地图和相机等原生组件。还有一个社区示例，[New York Times App](https://github.com/xxfast/NYTimes-KMP) 克隆，它甚至可以在手表上的 Wear OS（智能手表操作系统）上运行。查看此 [Kotlin Multiplatform 和 Compose Multiplatform 示例列表](multiplatform-samples.md)以查看更多示例。

[![Explore Compose Multiplatform](explore-compose.svg){width="500"}](https://www.jetbrains.com/compose-multiplatform/)

### 6. 您可在现有和新项目中使用 Kotlin Multiplatform

我们来看以下两种场景：

*   **在现有项目中利用 KMP**

    再次以百度的 Wonder App 为例。团队已经拥有 Android 和 iOS 应用程序，他们只是统一了逻辑。他们开始逐步统一更多库和更多逻辑，然后实现了跨平台共享的统一代码库。

*   **在新项目中利用 KMP**

    _9GAG_，一个在线平台和社交媒体网站，尝试了 Flutter 和 React Native 等不同技术，但最终选择了 Kotlin Multiplatform，这使他们能够统一应用程序在两个平台上的行为。他们首先创建了一个 Android 应用程序。然后，他们将 Kotlin Multiplatform 项目作为 iOS 上的依赖项来使用。

### 7. 借助 Kotlin Multiplatform，您可以逐步共享代码

您可以循序渐进地开始，从常量等简单元素入手，然后逐步迁移电子邮件验证等通用工具。您还可以编写或迁移您的业务逻辑，例如事务处理或用户认证，等等。

> 我们与 Google 团队合作，并以 Jetcaster 为例，创建了一个实用的迁移指南，其中包含一个版本库，每次提交都代表一个工作状态。
> [了解如何从 Android 逐步迁移到 Kotlin Multiplatform](migrate-from-android.md)。
{style="note"}

### 8. Kotlin Multiplatform 已被全球公司采用

KMP 已被全球许多大型公司使用，包括 Forbes、Philips、Cash App、Meetup、Autodesk 等等。您可以在[案例研究页面](https://kotlinlang.org/case-studies/?type=multiplatform)阅读他们的所有故事。

2023 年 11 月，JetBrains 宣布 Kotlin Multiplatform 现已 [稳定 (Stable)](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)，吸引了更多公司和团队对这项技术的兴趣。在 Google I/O 2024 大会上，Google 宣布[官方支持使用 Kotlin Multiplatform](https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html) 来在移动、Web、服务器和桌面平台之间共享业务逻辑。

### 9. Kotlin Multiplatform 提供强大的工具支持

当使用 Kotlin Multiplatform 项目时，您拥有强大的工具支持。

*   **IntelliJ IDEA**。使用 IntelliJ IDEA 2025.2.2，您可以安装 [Kotlin Multiplatform IDE 插件](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform?_gl=1*1bztzm5*_gcl_au*MTcxNzEyMzc1MS4xNzU5OTM3NDgz*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NjU4MDcyMzckbzkxJGcxJHQxNzY1ODA3MjM4JGo1OSRsMCRoMA..)，它为 iOS 应用提供基本启动和调试功能、预检环境检测以及其他有用的 KMP 功能。
*   **Android Studio**。Android Studio 是 Kotlin Multiplatform 开发的另一个稳定解决方案。使用 Android Studio Otter 2025.2.1，您可以安装相同的 Kotlin Multiplatform IDE 插件，以获得基本的 iOS 启动和调试支持、预检环境检测以及额外的多平台工具。
*   **Compose Hot Reload**：[Compose Hot Reload](compose-hot-reload.md) 允许您在处理 Compose Multiplatform 项目时快速迭代和试验 UI 变更。它目前适用于包含桌面目标且兼容 Java 21 或更早版本的项目。

![Compose Hot Reload](compose-hot-reload.gif){width=350}

*   **Xcode**。Apple 的 IDE 可用于创建 Kotlin Multiplatform 应用的 iOS 部分。
    Xcode 是 iOS 应用开发的标准，提供丰富的工具用于编码、调试和配置。
    然而，Xcode 仅限 Mac 使用。

### 10. Kotlin Multiplatform 拥有庞大且支持性的社区

Kotlin 和 Kotlin Multiplatform 拥有一个非常支持性的社区。以下是您可以找到任何疑问答案的几个地方。

*   [Kotlinlang Slack 工作区](https://slack-chats.kotlinlang.org/)。
    该工作区约有 60,000 名成员，并有几个与跨平台开发相关的频道，
    例如 [#multiplatform](https://slack-chats.kotlinlang.org/c/multiplatform)、
    [#compose](https://slack-chats.kotlinlang.org/c/compose) 和 [#compose-ios](https://slack-chats.kotlinlang.org/c/compose-ios)。
*   [Kotlin X](https://twitter.com/kotlin)。在这里，您将找到快速的专家见解和最新新闻，包括大量多平台技巧。
*   [Kotlin YouTube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)。
    我们的 YouTube 频道提供实用教程、专家直播和其他出色的教育内容，适用于视觉学习者。
*   [Kodee's Kotlin Roundup](https://lp.jetbrains.com/subscribe-to-kotlin-news/)。
    如果您想及时了解动态的 Kotlin 和 Kotlin Multiplatform 生态系统的最新更新，
    请订阅我们的定期新闻稿！

Kotlin Multiplatform 生态系统正在蓬勃发展。它由全球众多 Kotlin 开发者热情培育。
为了帮助社区驾驭这个不断扩展的领域，[klibs.io](http://klibs.io) 提供了一个精选的 Kotlin Multiplatform 库目录，从而更容易发现常见用例的可靠解决方案。

以下是每年创建的 Kotlin Multiplatform 库数量图表：

![Kotlin Multiplatform libraries created per year](kmp-libs-over-years.png){width=700}

如您所见，2021 年出现了明显的增长，此后库的数量持续增加。

## 为何选择 Kotlin Multiplatform 而非其他跨平台技术？

在选择[不同的跨平台解决方案](cross-platform-frameworks.md)时，
权衡它们的优缺点至关重要。您还可以探索 Kotlin Multiplatform 与其他技术（包括 [React Native](kotlin-multiplatform-react-native.topic) 和 [Flutter](kotlin-multiplatform-flutter.md)）的并排比较。

以下是 Kotlin Multiplatform 可能适合您的主要原因分析：

*   **出色的工具，易于使用**。Kotlin Multiplatform 利用 Kotlin，为开发者提供了出色的工具和易用性。
*   **原生编程**。原生编写内容非常简单。
    得益于[预期与实际声明](multiplatform-expect-actual.md)，
    您可以让您的多平台应用访问平台特有的 API。
*   **卓越的跨平台性能**。用 Kotlin 编写的共享代码会编译成针对不同目标平台的多种输出格式：
    Android 的 Java 字节码和 iOS 的原生二进制文件，确保在所有平台上都具有良好的性能。
*   **AI 驱动的代码生成**。您可以使用 [Junie](https://www.jetbrains.com/junie/)（JetBrains 编码代理，支持在共享代码和平台特有代码中实现更高效的工作流程）驱动的代码生成来加速多平台开发。

如果您已决定尝试 Kotlin Multiplatform，以下是一些帮助您入门的提示：

*   **从小处着手**。从小型共享组件或常量开始，让团队熟悉 Kotlin Multiplatform 的工作流程和优势。
*   **制定计划**。制定清晰的实验计划，假设预期结果以及实现和分析的方法。
    明确共享代码的贡献角色，并建立有效分发更改的工作流程。
*   **评估并进行复盘**。与您的团队进行一次复盘会议，评估实验的成功与否，
    并找出任何挑战或需要改进的领域。
    如果它奏效了，您可能希望扩大范围，共享更多代码。
    如果未能成功，您需要了解此次实验未成功的原因。

[![See Kotlin Multiplatform in action! Get Started now](see-kmp-in-action.svg){width="500"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)

对于那些希望帮助团队开始使用 Kotlin Multiplatform 的人，我们准备了一份包含实用技巧的[详细指南](multiplatform-introduce-your-team.md)。

如您所见，许多大型公司已成功使用 Kotlin Multiplatform 来构建
具有原生外观 UI 的高性能跨平台应用程序，有效复用代码，
同时保持原生编程的优势。