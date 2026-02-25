# 用于开发跨平台应用程序的热门编程语言

<web-summary>探索选择跨平台开发语言时的关键考量因素、热门技术的对比以及实际案例研究。</web-summary>

最近，你可能已经注意到[跨平台开发](cross-platform-mobile-development.md)这个术语出现的频率越来越高。事实上，跨平台编程在软件开发领域正变得日益流行。它在移动应用领域尤为普遍，但其用途绝不局限于此类应用程序。随着企业力求在多个设备和操作系统上触达更广泛的受众，开发者们正转向使用能够消除平台障碍的通用语言和框架。

如果你想知道哪种编程语言最能让你开启跨平台开发之旅，这篇综述文章将为你指明方向，并提供见解和实际用例。

## 了解跨平台开发

跨平台应用程序开发是指一种开发方法，即使用单一代码库创建可在多个平台上运行的软件，例如iOS、Android、Windows、macOS和浏览器等。近年来，这种方法广受欢迎，很大程度上源于对移动应用不断增长的需求。移动工程师可以在iOS和Android之间共享部分或全部源代码，而不是为每个平台开发单独的应用程序。

我们有一份专门的指南，你可以在其中详细了解[原生开发与跨平台开发](native-and-cross-platform.md)各自的优势与局限，以及如何在两者之间做出选择。跨平台开发的主要优势包括：

1. **成本效益。**为每个平台构建单独的应用在时间和资源上都可能非常昂贵。通过跨平台开发，开发者只需编写一次代码即可将其部署到多个平台，从而降低开发成本。

2. **更快的开发速度。**这种方法通过让开发者只需编写和维护单一代码库，有助于加速开发过程。

3. **高效且灵活的代码共享。**现代跨平台技术使开发者能够在多个平台间复用代码，同时保留原生编程的优势。

4. **跨平台一致的用户体验。**跨平台开发可确保关键行为（例如计算或工作流）在需要时在不同平台上提供相同的结果。这有助于保持一致性，无论用户使用的是iOS、Android还是其他设备和操作系统，都能获得相同的体验。

在本文中，我们将讨论一些最热门的跨平台开发编程语言。

## 热门的跨平台编程语言、框架和技术

本文重点介绍适用于跨平台开发的成熟编程语言。虽然有许多为各种目的设计的语言，但本节简要概述了一些最受欢迎的跨平台开发编程语言，以及相关的统计数据和支持它们的框架。

<table style="header-row">
    
<tr>
<td>语言</td>
        <td>首次出现</td>
        <td>最受欢迎的技术 (<a href="https://survey.stackoverflow.co/2024/technology#most-popular-technologies">Stack Overflow, 2024</a>)</td>
        <td>最受欢迎的技术 (<a href="https://www.jetbrains.com/lp/devecosystem-2024/">2024 开发者的生态系统报告</a>)</td>
        <td>生态系统/工具包</td>
        <td>技术/框架</td>
</tr>

    
<tr>
<td>JavaScript</td>
        <td>1995</td>
        <td>#1 (62.3%)</td>
        <td>#1 (61%)</td>
        <td>丰富的生态系统，众多的库，活跃的社区</td>
        <td>React Native, Ionic</td>
</tr>

    
<tr>
<td>Dart</td>
        <td>2011</td>
        <td>#17 (6%)</td>
        <td>#15 (8%)</td>
        <td>不断成长的生态系统，由Google支持</td>
        <td>Flutter</td>
</tr>

    
<tr>
<td>Kotlin</td>
        <td>2011</td>
        <td>#15 (9.04%)</td>
        <td>#13 (14%)</td>
        <td>不断扩张的生态系统，对JetBrains工具的一等支持</td>
        <td>Kotlin Multiplatform</td>
</tr>

    
<tr>
<td>C#</td>
        <td>2000</td>
        <td>#8 (27.1%)</td>
        <td>9 (22%)</td>
        <td>来自Microsoft的强大支持，庞大的生态系统</td>
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

JavaScript是一种广泛使用的编程语言，允许用户在网页上实现复杂的功能。随着React Native和Ionic等框架的引入，它已成为跨平台应用开发的热门选择。根据JetBrains开展的最新[开发者的生态系统调查](https://www.jetbrains.com/lp/devecosystem-2024/)，61%的开发者使用JavaScript，这使其成为最受欢迎的编程语言。

**Dart**

Dart是Google在2011年推出的一种面向对象、基于类的编程语言。Dart构成了Flutter的基础，Flutter是Google创建的开源框架，用于通过单一代码库构建多平台应用程序。Dart为Flutter应用提供语言支持和运行时。

**Kotlin**

Kotlin是由JetBrains开发的一种现代、成熟的多平台编程语言。根据[Octoverse报告](https://github.blog/news-insights/octoverse/octoverse-2024/#the-most-popular-programming-languages)，它是2024年增长第五快的语言。它简洁、安全，能与Java和其他语言互操作，并且是Google首选的Android应用开发语言。

[Kotlin Multiplatform (KMP)](https://www.jetbrains.com/kotlin-multiplatform/)是JetBrains推出的一项技术，允许你为各种平台创建应用程序，并在这些平台间复用Kotlin代码，同时保留原生编程的优势。此外，JetBrains还提供了Compose Multiplatform，这是一个用于跨多个平台共享UI的声明式框架，基于KMP和Jetpack Compose。2024年5月，Google宣布正式[支持 Kotlin Multiplatform](https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html)，用于在Android、iOS、Web、桌面和服务器间共享业务逻辑。

[![探索 Kotlin Multiplatform](discover-kmp.svg){width="500" style="block"}](https://www.jetbrains.com/kotlin-multiplatform/)

**C#**

C#是由Microsoft开发的跨平台通用编程语言。C#是.NET Framework中最受欢迎的语言。.NET MAUI是一个用于通过单一C#代码库为Android、iOS、Mac和Windows构建原生、跨平台桌面及移动应用的框架。

**C++**

C++是一种通用编程语言，于1985年作为C语言的扩展首次发布。Qt是一个跨平台软件开发框架，包含一套模块化的C++库类，并为应用程序开发提供了一系列API。Qt为C++开发提供了一个带有应用程序构建模块的C++类库。

## 选择跨平台编程语言的关键因素

面对当今众多的语言、技术和工具，尝试选择合适的一种可能会让人不知所措，尤其是如果你刚刚步入跨平台开发的世界。各种跨平台技术都有其独特的优缺点，但归根结底，这取决于你想要构建的软件的目标和要求。

在为项目选择语言或框架时，你应该牢记几个重要因素。这些因素包括应用程序类型、其性能和用户体验 (UX) 要求、相关工具包以及下文详细描述的其他各种考虑因素。

**1. 应用程序类型**

不同的编程语言和框架在Windows、macOS、Linux、iOS、Android和浏览器等不同平台上的支持程度各异。某些语言天然地更适合特定的平台和项目。

**2. 性能和用户体验 (UX) 要求**

某些类型的应用程序具有特定的性能和用户体验 (UX) 要求，这些要求可以通过不同的标准来衡量，例如速度、响应能力、内存使用情况，以及它们对中央处理器 (CPU) 和图形处理器 (GPU) 的消耗。考虑你未来的应用程序需要实现的功能，以及你对上述标准的预期参数。

> 例如，图形密集型游戏应用可能会受益于能高效利用GPU的语言。与此同时，商务应用可能会优先考虑数据库集成和网络通信的便捷性。
>
{style="tip"}

**3. 现有技能组与学习曲线**

在为下一个项目选择技术时，开发团队应考虑到他们之前的经验。引入一种新语言或工具需要时间进行培训，这有时会延误项目。学习曲线越陡峭，团队变得熟练所需的时间就越长。

> 例如，如果你的团队由非常精通JavaScript的开发者组成，且你缺乏采用新技术的资源，那么选择React Native等使用JavaScript的框架可能会更有利。
>
{style="tip"}

**4. 现有用例**

另一个需要考虑的重要因素是该技术的实际应用。查看成功实施了特定跨平台语言或框架的公司的案例研究，可以深入了解这些技术在生产环境中的表现。这可以帮助你评估特定技术是否适合你的项目目标。例如，你可以探索各公司利用Kotlin Multiplatform开发跨平台生产就绪应用的案例研究。

![Kotlin Multiplatform 案例研究](kmp-case-studies.png){width="700"}

[![探索 Kotlin Multiplatform 实际用例](kmp-use-cases-1.svg){width="500" style="block"}](https://kotlinlang.org/case-studies/?type=multiplatform)

**5. 语言生态系统**

另一个重要因素是该语言生态系统的成熟度。注意支持多平台开发的工具和库的可用性和质量。例如，JavaScript拥有海量的库，支持前端框架（React、Angular、Vue.js）、后端开发（Express、NestJS）以及广泛的其他功能。

同样，Flutter拥有数量庞大且快速增长的库，也被称为软件包或插件。虽然Kotlin Multiplatform目前的库较少，但其生态系统正在迅速扩张，且该语言正受到全球许多Kotlin开发者的增强支持。下面的信息图显示了Kotlin Multiplatform库的数量多年来的增长情况。

![Kotlin Multiplatform 库历年增长](kmp-libs-over-years.png){width="700"}

**6. 流行度与社区支持**

值得仔细观察编程语言及相关技术的流行度和社区支持。这不仅仅取决于用户和库的数量。还要注意该语言社区（包括其用户和贡献者）的活跃度和支持程度。寻找可用的博客、播客、论坛和其他资源。

## 跨平台开发的未来

随着跨平台开发的不断演进，我们可以期待支持它的工具和语言提供更高的效率、性能和灵活性。随着对跨多个设备无缝用户体验的需求日益增长，越来越多的公司正在投资那些允许开发者在不牺牲原生性能的前提下共享代码的框架。跨平台技术的未来看起来充满希望，各项进步可能会减少局限性，并进一步简化各种应用程序的开发过程。

[![查看 Kotlin Multiplatform 实战](see-kmp-in-action.svg){width="500" style="block"}](https://www.jetbrains.com/kotlin-multiplatform/)