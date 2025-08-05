# 开发跨平台应用程序的流行编程语言

<web-summary>探讨选择跨平台开发语言时的关键考量因素，流行技术的比较，以及真实案例研究。</web-summary>

您可能已经注意到，如今“跨平台开发”一词出现的频率越来越高。确实，跨平台编程在软件开发领域正变得日益流行。它在移动应用领域尤其普遍，但其用途绝不限于此类应用程序。随着企业努力触达更广泛的跨多设备和操作系统的受众，开发者正转向多功能语言和框架，以消除平台障碍。

如果您想知道哪种编程语言最能帮助您开始跨平台开发，这篇概述文章将为您指明方向，提供见解和实际用例示例。

## 了解跨平台开发

跨平台应用程序开发是指这样一种开发方法，即可以使用单一代码库来创建可在多个平台（例如 iOS、Android、Windows、macOS 和网页浏览器等）上运行的软件。近年来，由于移动应用需求的不断增长，这种方法变得越来越流行。移动工程师可以在 iOS 和 Android 之间共享部分或全部源代码，而不是为每个平台开发独立的应用程序。

我们有一份专用指南，您可以在其中详细了解[原生开发和跨平台开发](native-and-cross-platform.md)的优势和局限性，以及如何在两者之间做出选择。跨平台开发的一些主要优势包括：

1.  **成本效益。** 为每个平台构建独立的应用程序在时间和资源方面都可能很昂贵。借助跨平台开发，开发者可以编写一次代码并将其部署到多个平台，从而降低开发成本。

2.  **更快的开发速度。** 这种方法通过让开发者只需编写和维护单一代码库来加速开发过程。

3.  **高效灵活的代码共享。** 现代跨平台技术使开发者能够跨多个平台重用代码，同时保持原生编程的优势。

4.  **跨平台一致的用户体验。** 跨平台开发确保了关键行为（例如计算或工作流）在需要时能在不同平台上提供相同的结果。这有助于保持一致性，无论用户使用 iOS、Android 还是其他设备和操作系统，都能获得相同的体验。

在本文中，我们将讨论一些最流行的跨平台开发编程语言。

## 流行的跨平台编程语言、框架和技术

本文重点介绍适合跨平台开发的成熟编程语言。尽管有许多为各种目的设计的语言，本节将简洁概述一些最流行的跨平台开发编程语言，并提供相关统计数据以及支持它们的框架。

<table style="header-row">
    <tr>
        <td>语言</td>
        <td>首次出现</td>
        <td>最流行的技术 (<a href="https://survey.stackoverflow.co/2024/technology#most-popular-technologies">Stack Overflow, 2024</a>)</td>
        <td>最流行的技术 (<a href="https://www.jetbrains.com/lp/devecosystem-2024/">Developer Ecosystem Report 2024</a>)</td>
        <td>生态系统/工具链</td>
        <td>技术/框架</td>
    </tr>
    <tr>
        <td>JavaScript</td>
        <td>1995</td>
        <td>#1 (62.3%)</td>
        <td>#1 (61%)</td>
        <td>丰富的生态系统，众多库，活跃的社区</td>
        <td>React Native, Ionic</td>
    </tr>
    <tr>
        <td>Dart</td>
        <td>2011</td>
        <td>#17 (6%)</td>
        <td>#15 (8%)</td>
        <td>不断增长的生态系统，由 Google 支持</td>
        <td>Flutter</td>
    </tr>
    <tr>
        <td>Kotlin</td>
        <td>2011</td>
        <td>#15 (9.04%)</td>
        <td>#13 (14%)</td>
        <td>不断扩展的生态系统，对 JetBrains 工具提供一流支持</td>
        <td>Kotlin Multiplatform</td>
    </tr>
    <tr>
        <td>C#</td>
        <td>2000</td>
        <td>#8 (27.1%)</td>
        <td>9 (22%)</td>
        <td>微软的强大支持，庞大的生态系统</td>
        <td>.NET MAUI</td>
    </tr>
    <tr>
        <td>C++</td>
        <td>1985</td>
        <td>#9 (23%)</td>
        <td>8 (25%)</td>
        <td>成熟但第三方库比其他语言少</td>
        <td>Qt</td>
    </tr>
</table>

**JavaScript**

JavaScript 是一种广泛使用的编程语言，允许用户在网页上实现复杂功能。随着 React Native 和 Ionic 等框架的引入，它已成为跨平台应用开发的流行选择。根据 JetBrains 发布的最新[开发者生态系统调查](https://www.jetbrains.com/lp/devecosystem-2024/)，61% 的开发者使用 JavaScript，这使其成为最流行的编程语言。

**Dart**

Dart 是一种面向对象的、基于类的编程语言，由 Google 于 2011 年推出。Dart 构成了 Flutter 的基础，Flutter 是 Google 创建的一个开源框架，用于从单一代码库构建多平台应用程序。Dart 提供了驱动 Flutter 应用的语言和运行时。

**Kotlin**

Kotlin 是 JetBrains 开发的一种现代化、成熟的多平台编程语言。根据 [Octoverse 报告](https://github.blog/news-insights/octoverse/octoverse-2024/#the-most-popular-programming-languages)，它是 2024 年增长速度第五快的语言。它简洁、安全、可与 Java 和其他语言互操作，并且是 Google 推荐用于 Android 应用开发的语言。

[Kotlin Multiplatform (KMP)](https://www.jetbrains.com/kotlin-multiplatform/) 是 JetBrains 的一项技术，它允许您为各种平台创建应用程序，并在这些平台之间重用 Kotlin 代码，同时保持原生编程的优势。此外，JetBrains 还提供了 Compose Multiplatform，这是一个基于 KMP 和 Jetpack Compose 的声明式框架，用于跨多个平台共享 UI。2024 年 5 月，Google 宣布官方[支持 Kotlin Multiplatform](https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html)，以在 Android 和 iOS 之间共享业务逻辑。

[![探索 Kotlin Multiplatform](discover-kmp.svg){width="500" style="block"}](https://www.jetbrains.com/kotlin-multiplatform/)

**C#**

C# 是微软开发的一种跨平台通用编程语言。C# 是 .NET Framework 最流行的语言。.NET MAUI 是一个框架，用于通过单一 C# 代码库为 Android、iOS、Mac 和 Windows 构建原生、跨平台的桌面和移动应用程序。

**C++**

C++ 是一种通用编程语言，于 1985 年首次发布，是 C 编程语言的扩展。Qt 是一个跨平台软件开发框架，包含一组模块化的 C++ 库类，并为应用程序开发提供一系列 API。Qt 提供了一个 C++ 类库，其中包含用于 C++ 开发的应用程序构建块。

## 选择跨平台编程语言的关键因素

鉴于当今各种语言、技术和工具，选择合适的语言可能会令人不知所措，特别是如果您刚刚踏入跨平台开发领域。各种跨平台技术都有其独特的优缺点，但归根结底，这都取决于您希望构建的软件的目标和要求。

为您的项目选择语言或框架时，应牢记几个重要因素。这些因素包括应用程序的类型、其性能和用户体验 (UX) 要求、相关工具链以及下文详细描述的其他各种考量。

**1. 应用程序的类型**

不同的编程语言和框架在不同平台（例如 Windows、macOS、Linux、iOS、Android 和网页浏览器）上得到更好的支持。某些语言自然更适合特定平台和项目。

**2. 性能和用户体验 (UX) 要求**

某些类型的应用程序具有特定的性能和用户体验 (UX) 要求，这些要求可以通过不同的标准来衡量，例如速度、响应性、内存使用情况以及它们对中央处理器 (CPU) 和图形处理器 (GPU) 的消耗。考虑您的未来应用程序需要实现的功能以及您对上述标准的期望参数。

> 例如，图形密集型游戏应用可能会受益于能够高效利用 GPU 的语言。同时，商业应用可能会优先考虑数据库集成和网络通信的便捷性。
>
{style="tip"}

**3. 现有技能和学习曲线**

当为下一个项目选择技术时，开发团队应考虑其以往的经验。引入新语言或工具需要培训时间，这有时会延迟项目。学习曲线越陡峭，团队熟练掌握所需的时间就越长。

> 例如，如果您的团队由技艺精湛的 JavaScript 开发者组成，并且缺乏采用新技术的资源，那么选择利用 JavaScript 的框架（例如 React Native）可能会更有益。
>
{style="tip"}

**4. 现有用例**

另一个需要考虑的重要因素是该技术的实际应用。审阅成功实施了特定跨平台语言或框架的公司案例研究，可以为了解这些技术在生产环境中的表现提供有价值的见解。这有助于您评估特定技术是否适合您项目的目标。例如，您可以探索利用 Kotlin Multiplatform 在各种平台开发生产就绪应用程序的公司的案例研究。

![Kotlin Multiplatform 案例研究](kmp-case-studies.png){width="700"}

[![探索真实世界的 Kotlin Multiplatform 用例](kmp-use-cases-1.svg){width="500" style="block"}](case-studies.topic)

**5. 语言生态系统**

另一个重要因素是语言生态系统的成熟度。注意支持多平台开发的工具和库的可用性和质量。例如，JavaScript 拥有大量的库，支持前端框架（React、Angular、Vue.js）、后端开发（Express、NestJS）以及广泛的其他功能。

同样，Flutter 拥有大量且快速增长的库，也称为软件包或插件。尽管 Kotlin Multiplatform 目前的库较少，但其生态系统正在快速增长，并且世界各地的许多 Kotlin 开发者正在增强该语言。下方的图表展示了 Kotlin Multiplatform 库的数量多年来的增长情况。

![多年来 Kotlin Multiplatform 库的数量](kmp-libs-over-years.png){width="700"}

**6. 流行度和社区支持**

值得密切关注编程语言和相关技术的流行度以及社区支持。这不仅仅取决于用户和库的数量。注意该语言社区的活跃度和支持度，包括其用户和贡献者。寻找可用的博客、播客、论坛和其他资源。

## 跨平台开发的未来

随着跨平台开发的不断演进，我们可以期待支持它的工具和语言提供更高的效率、性能和灵活性。随着对跨多个设备无缝用户体验的需求不断增长，更多公司正在投资于允许开发者共享代码而不在原生性能上妥协的框架。跨平台技术的未来前景光明，其进步有望减少局限性，并进一步简化各种应用程序的开发过程。

[![查看 Kotlin Multiplatform 的实际应用](see-kmp-in-action.svg){width="500" style="block"}](https://www.jetbrains.com/kotlin-multiplatform/)