<web-summary>探索选择跨平台开发语言的关键考量、流行技术的比较以及真实案例研究。</web-summary>

如今，您可能已经开始越来越频繁地注意到 [跨平台开发](cross-platform-mobile-development.md) 这一术语。事实上，在软件开发领域，跨平台编程正变得日益流行。它在移动应用领域尤其盛行，但其用途绝不仅限于这些类型的应用程序。随着企业努力通过多种设备和操作系统触达更广泛的受众，开发者们正转向能够消除平台壁壁垒的多功能语言和框架。

如果您想知道哪种编程语言能最好地帮助您开始跨平台开发，本文概述将为您指明方向，提供见解和真实用例。

## 理解跨平台开发

跨平台应用程序开发指一种开发方法，其中可以使用单个代码库创建可在多个平台（例如 iOS、Android、Windows、macOS 和网页浏览器等）上运行的软件。近年来，这种方法广受欢迎，这在很大程度上归功于移动应用日益增长的需求。移动工程师可以在 iOS 和 Android 之间共享部分或全部源代码，而无需为每个平台开发独立的应用程序。

我们有一份专门指南，您可以在其中了解更多关于 [原生开发和跨平台开发](native-and-cross-platform.md) 的优势和局限性，以及如何在这两种方法之间进行选择。跨平台开发的一些主要优势包括：

1. **成本效益。** 为每个平台构建独立的应用程序在时间和资源方面成本高昂。通过跨平台开发，开发者可以一次编写代码并将其部署到多个平台，从而降低开发成本。

2. **更快的开发速度。** 这种方法通过让开发者只需编写和维护单个代码库来加速开发过程。

3. **高效灵活的代码共享。** 现代跨平台技术使开发者能够在多个平台间重用代码，同时保持原生编程的优势。

4. **跨平台一致的用户体验。** 跨平台开发确保关键行为（例如计算或工作流）在需要时在不同平台上提供相同的结果。这有助于保持一致性，为用户提供在 iOS、Android 或其他设备和操作系统上相同的体验。

在本文中，我们将讨论一些最流行的跨平台开发编程语言。

## 流行跨平台编程语言、框架和技术

本文重点介绍适用于跨平台开发的成熟编程语言。尽管有许多为各种目的设计的语言，但本节将简洁概述一些最流行的跨平台开发编程语言，以及相关统计数据和支持它们的框架。

<table style="header-row">
    
<tr>
<td>语言</td>
        <td>首次亮相</td>
        <td>最受欢迎的技术 (<a href="https://survey.stackoverflow.co/2024/technology#most-popular-technologies">Stack Overflow, 2024</a>)</td>
        <td>最受欢迎的技术 (<a href="https://www.jetbrains.com/lp/devecosystem-2024/">2024 开发者生态系统报告</a>)</td>
        <td>生态系统/工具</td>
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
        <td>不断增长的生态系统，由 Google 提供支持</td>
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
        <td>Microsoft 的强大支持，庞大的生态系统</td>
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

JavaScript 是一种广泛使用的编程语言，它允许用户在网页上实现复杂的功能。随着 React Native 和 Ionic 等框架的引入，它已成为跨平台应用开发的流行选择。根据 JetBrains 最新发布的 [开发者生态系统调查报告](https://www.jetbrains.com/lp/devecosystem-2024/)，61% 的开发者使用 JavaScript，使其成为最流行的编程语言。

**Dart**

Dart 是由 Google 于 2011 年推出的一种面向对象、基于类的编程语言。Dart 构成了 Flutter 的基础，Flutter 是 Google 创建的一个开源框架，用于从单个代码库构建多平台应用程序。Dart 为 Flutter 应用提供语言和运行时支持。

**Kotlin**

Kotlin 是由 JetBrains 开发的一种现代、成熟的多平台编程语言。根据 [Octoverse 报告](https://github.blog/news-insights/octoverse/octoverse-2024/#the-most-popular-programming-languages)，它是 2024 年增长速度第五快的语言。它简洁、安全，可与 Java 及其他语言互操作，并且是 Google 推荐的 Android 应用开发语言。

[Kotlin Multiplatform (KMP)](https://www.jetbrains.com/kotlin-multiplatform/) 是 JetBrains 的一项技术，它允许您为各种平台创建应用程序，并在这些平台间重用 Kotlin 代码，同时保持原生编程的优势。此外，JetBrains 提供了 Compose Multiplatform，一个基于 KMP 和 Jetpack Compose 的声明式框架，用于在多个平台间共享 UI。2024 年 5 月，Google 宣布官方 [支持 Kotlin Multiplatform](https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html) 以便在 Android 和 iOS 之间共享业务逻辑。

[![Discover Kotlin Multiplatform](discover-kmp.svg){width="500" style="block"}](https://www.jetbrains.com/kotlin-multiplatform/)

**C#**

C# 是 Microsoft 开发的一种跨平台通用编程语言。C# 是 .NET Framework 最流行的语言。.NET MAUI 是一个用于从单个 C# 代码库为 Android、iOS、Mac 和 Windows 构建原生跨平台桌面和移动应用的框架。

**C++**

C++ 是一种通用编程语言，于 1985 年首次发布，是 C 编程语言的扩展。Qt 是一个跨平台软件开发框架，它包含一套模块化的 C++ 库类，并提供一系列用于应用程序开发的 API。Qt 为 C++ 开发提供了带有应用程序构建块的 C++ 类库。

## 选择跨平台编程语言的关键因素

在当今所有可用的语言、技术和工具中，选择合适的语言可能会感到不知所措，特别是如果您刚踏入跨平台开发领域。各种跨平台技术都有其独特的优点和缺点，但最终，一切都取决于您想要构建的软件的目标和要求。

在为您的项目选择语言或框架时，您需要牢记几个重要因素。这些包括应用程序的类型、其性能和用户体验 (UX) 要求、相关工具以及下文详细描述的各种其他考量。

**1. 应用程序的类型**

不同的编程语言和框架在不同的平台（如 Windows、macOS、Linux、iOS、Android 和网页浏览器）上得到更好的支持。某些语言自然更适合特定的平台和项目。

**2. 性能和 UX 要求**

某些类型的应用程序具有特定的性能和用户体验 (UX) 要求，可以通过不同标准衡量，例如速度、响应能力、内存使用以及中央处理器 (CPU) 和图形处理器 (GPU) 的消耗。请考虑您未来应用程序需要实现的功能以及对上述标准的期望参数。

> 例如，一个图形密集型的游戏应用可能会受益于能够高效利用 GPU 的语言。而一个业务应用可能更优先考虑数据库集成和网络通信的便捷性。
>
{style="tip"}

**3. 现有技能集和学习曲线**

在为下一个项目选择技术时，开发团队应考虑他们先前的经验。引入一种新的语言或工具需要时间进行培训，这有时可能会延迟项目。学习曲线越陡峭，团队掌握所需的时间就越长。

> 例如，如果您的团队由精通 JavaScript 的开发者组成，并且您缺乏采用新技术的资源，那么选择利用 JavaScript 的框架（如 React Native）可能会有所裨益。
>
{style="tip"}

**4. 现有用例**

另一个重要的考量因素是该技术的实际应用。审阅成功实施特定跨平台语言或框架的公司的案例研究，可以提供关于这些技术在生产环境中表现的宝贵见解。这可以帮助您评估某项特定技术是否适合您的项目目标。例如，您可以探索利用 Kotlin Multiplatform 在各种平台开发生产就绪型应用程序的公司的案例研究。

![Kotlin Multiplatform Case Studies](kmp-case-studies.png){width="700"}

[![Explore Real-World Kotlin Multiplatform Use Cases](kmp-use-cases-1.svg){width="500" style="block"}](case-studies.topic)

**5. 语言生态系统**

另一个重要因素是语言生态系统的成熟度。请关注支持多平台开发的工具和库的可用性和质量。例如，JavaScript 拥有大量的库，支持前端框架（React、Angular、Vue.js）、后端开发（Express、NestJS）以及广泛的其他功能。

同样，Flutter 拥有大量且快速增长的库，也称为包或插件。尽管 Kotlin Multiplatform 目前库的数量较少，但其生态系统正在迅速发展，并且全球的许多 Kotlin 开发者正在不断增强该语言。下图信息图表显示了 Kotlin Multiplatform 库的数量多年来的增长情况。

![Kotlin Multiplatform Libraries Over Years](kmp-libs-over-years.png){width="700"}

**6. 流行度和社区支持**

值得仔细研究编程语言及相关技术的流行度和社区支持情况。这不仅仅取决于用户和库的数量。请关注该语言社区的活跃程度和支持力度，包括其用户和贡献者。寻找可用的博客、播客、论坛和其他资源。

## 跨平台开发的未来

随着跨平台开发持续发展，我们可以期待支持它的工具和语言带来更高的效率、性能和灵活性。随着对跨多种设备的无缝用户体验日益增长的需求，更多公司正在投资于允许开发者共享代码而不影响原生性能的框架。跨平台技术的未来充满希望，随着进步，有望减少限制并进一步简化各种应用程序的开发流程。

[![See Kotlin Multiplatform in Action](see-kmp-in-action.svg){width="500" style="block"}](https://www.jetbrains.com/kotlin-multiplatform/)