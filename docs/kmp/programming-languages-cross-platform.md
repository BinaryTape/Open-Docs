<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       id="programming-languages-cross-platform"
       title="用于开发跨平台应用程序的热门编程语言">
    <title>
        用于开发跨平台应用程序的热门编程语言
    </title>
    <web-summary>探索选择跨平台开发语言时的关键考量因素、热门技术的对比以及实际案例研究。
    </web-summary>
    <p>最近，你可能已经注意到<a href="cross-platform-mobile-development.topic">跨平台开发</a>这个术语出现的频率越来越高。事实上，跨平台编程在软件开发领域正变得日益流行。它在移动应用领域尤为普遍，但其用途绝不局限于此类应用程序。随着企业力求在多个设备和操作系统上触达更广泛的受众，开发者们正转向使用能够消除平台障碍的通用语言和框架。</p>
    <p>如果你想知道哪种编程语言最能让你开启跨平台开发之旅，这篇综述文章将为你指明方向，并提供见解和实际用例。</p>
    <chapter title="了解跨平台开发" id="understanding-cross-platform-development">
        <p>跨平台应用程序开发是指一种开发方法，即使用单一代码库创建可在多个平台上运行的软件，例如 iOS、Android、Windows、macOS 和浏览器等。近年来，这种方法广受欢迎，很大程度上源于对移动应用不断增长的需求。移动工程师可以在 iOS 和 Android 之间共享部分或全部源代码，而不是为每个平台开发单独的应用程序。</p>
        <p>我们有一份专门的指南，你可以在其中详细了解<a href="native-and-cross-platform.topic">原生开发与跨平台开发的优势与局限</a>，以及如何在两者之间做出选择。跨平台开发的主要优势包括：</p>
        <list type="decimal">
            <li>
                <p>
                    <control>成本效益。</control>
                    为每个平台构建单独的应用在时间和资源上都可能非常昂贵。通过跨平台开发，开发者只需编写一次代码即可将其部署到多个平台，从而降低开发成本。
                </p>
            </li>
            <li>
                <p>
                    <control>更快的开发速度。</control>
                    这种方法通过让开发者只需编写和维护单一代码库，有助于加速开发过程。
                </p>
            </li>
            <li>
                <p>
                    <control>高效且灵活的代码共享。</control>
                    现代跨平台技术使开发者能够在多个平台间复用代码，同时保留原生编程的优势。
                </p>
            </li>
            <li>
                <p>
                    <control>跨平台一致的用户体验。</control>
                    跨平台开发可确保关键行为（例如计算或工作流）在需要时在不同平台上提供相同的结果。这有助于保持一致性，无论用户使用的是何种设备或操作系统，都能获得相同的体验。
                </p>
            </li>
        </list>
        <p>在本文中，我们将讨论一些最热门的跨平台开发编程语言。</p>
    </chapter>
    <chapter title="热门跨平台编程语言、框架和技术"
             id="popular-cross-platform-programming-languages-frameworks-and-technologies">
        <p>本文重点介绍适用于跨平台开发的成熟编程语言。虽然有许多为各种目的设计的语言，但本节简要概述了一些最受欢迎的跨平台开发编程语言，以及相关的统计数据和支持它们的框架。</p>
        <p>
            <control>概览与流行度</control>
        </p>
        <table style="header-row">
            <tr>
                <td>语言</td>
                <td>首次出现</td>
                <td>流行度 (<a href="https://survey.stackoverflow.co/2025/technology/">Stack
                    Overflow, 2025</a>)</td>
                <td>流行度 (<a href="https://devecosystem-2025.jetbrains.com/">2025 开发者的生态系统报告</a>)</td>
            </tr>
            <tr>
                <td>JavaScript</td>
                <td>1995</td>
                <td>#1 (66%)</td>
                <td>#1 (61%)</td>
            </tr>
            <tr>
                <td>Dart</td>
                <td>2011</td>
                <td>#19 (5.9%)</td>
                <td>#16 (8%)</td>
            </tr>
            <tr>
                <td>Kotlin</td>
                <td>2011</td>
                <td>#15 (10.08%)</td>
                <td>#12 (18%)</td>
            </tr>
            <tr>
                <td>C#</td>
                <td>2000</td>
                <td>#8 (27.8%)</td>
                <td>#9 (21%)</td>
            </tr>
            <tr>
                <td>C++</td>
                <td>1985</td>
                <td>#9 (23.5%)</td>
                <td>#8 (25%)</td>
            </tr>
        </table>
        <p>
            <control>生态系统与技术</control>
        </p>
        <table style="header-row">
            <tr>
                <td>语言</td>
                <td>生态系统/工具</td>
                <td>技术/框架</td>
            </tr>
            <tr>
                <td>JavaScript</td>
                <td>丰富的生态系统，众多的库，活跃的社区</td>
                <td>React Native, Ionic</td>
            </tr>
            <tr>
                <td>Dart</td>
                <td>不断成长的生态系统，由 Google 支持</td>
                <td>Flutter</td>
            </tr>
            <tr>
                <td>Kotlin</td>
                <td>不断扩张的生态系统，来自 JetBrains 的强大支持</td>
                <td>Kotlin Multiplatform</td>
            </tr>
            <tr>
                <td>C#</td>
                <td>来自 Microsoft 的强大支持，庞大的生态系统</td>
                <td>.NET MAUI</td>
            </tr>
            <tr>
                <td>C++</td>
                <td>成熟的生态系统，第三方库比其他语言少</td>
                <td>Qt</td>
            </tr>
        </table>
        <p>
            <control>JavaScript</control>
        </p>
        <p>JavaScript 是一种广泛使用的编程语言，允许开发者在网页上实现复杂的功能。随着 React Native 和 Ionic 等框架的引入，它已成为跨平台应用开发的热门选择。根据 JetBrains 开展的最新<a href="https://devecosystem-2025.jetbrains.com/">开发者的生态系统调查</a>，61% 的开发者使用 JavaScript，这使其成为最受欢迎的编程语言。</p>
        <p>
            <control>Dart</control>
        </p>
        <p>Dart 是 Google 在 2011 年推出的一种面向对象、基于类的编程语言。Dart 构成了 Flutter 的基础，Flutter 是 Google 创建的开源框架，用于通过单一代码库构建多平台应用程序。Dart 为 Flutter 应用提供语言支持和运行时。</p>
        <p>
            <control>Kotlin</control>
        </p>
        <p>Kotlin 是由 JetBrains 开发的一种现代、成熟的多平台编程语言。根据 <a
                href="https://github.blog/news-insights/octoverse/octoverse-2024/#the-most-popular-programming-languages">Octoverse 报告</a>，它是 2024 年增长第五快的语言。它简洁、安全，能与 Java 和其他语言互操作，并且是 Google 首选的 Android 应用开发语言。</p>
        <p><a href="https://www.jetbrains.com/kotlin-multiplatform/">Kotlin Multiplatform (KMP)</a> 是 JetBrains 推出的一项技术，允许你为各种平台创建应用程序，并在这些平台间复用 Kotlin 代码，同时保留原生编程的优势。此外，JetBrains 还提供了 Compose Multiplatform，这是一个用于跨多个平台共享 UI 的声明式框架，基于 KMP 和 Jetpack Compose。2024 年 5 月，Google 宣布正式<a
                    href="https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html">支持 Kotlin Multiplatform</a>，用于在 Android 和 iOS 之间共享业务逻辑。</p>
        <p><a href="https://www.jetbrains.com/kotlin-multiplatform/"><img src="discover-kmp.svg"
                                                                          alt="探索 Kotlin Multiplatform"
                                                                          width="500" style="block"/></a></p>
        <p>
            <control>C#</control>
        </p>
        <p>C# 是由 Microsoft 开发的跨平台通用编程语言。C# 是 .NET Framework 中最受欢迎的语言。.NET MAUI 是一个用于通过单一 C# 代码库为 Android、iOS、Mac 和 Windows 构建原生、跨平台桌面及移动应用的框架。</p>
        <p>
            <control>C++</control>
        </p>
        <p>C++ 是一种通用编程语言，于 1985 年作为 C 语言的扩展首次发布。Qt 是一个跨平台软件开发框架，包含一套模块化的 C++ 库类，并为应用程序开发提供了一系列 API。</p>
    </chapter>
    <chapter title="选择跨平台编程语言的关键因素"
             id="key-factors-in-selecting-a-cross-platform-programming-language">
        <p>面对当今众多的语言、技术和工具，尝试选择合适的一种可能会让人不知所措，尤其是如果你刚刚步入跨平台开发的世界。各种跨平台技术都有其独特的优劣势，但归根结底，这取决于你想要构建的软件的目标和要求。</p>
        <p>在为项目选择语言或框架时，你应该牢记几个重要因素。这些因素包括应用程序类型、其性能和用户体验 (UX) 要求、相关工具以及下文详细描述的其他各种考量因素。</p>
        <p>
            <control>1. 应用程序类型</control>
        </p>
        <p>不同的编程语言和框架在 Windows、macOS、Linux、iOS、Android 和浏览器等不同平台上的支持程度各异。某些语言天然地更适合特定的平台和项目。</p>
        <p>
            <control>2. 性能和用户体验 (UX) 要求</control>
        </p>
        <p>某些类型的应用程序具有特定的性能和用户体验 (UX) 要求，这些要求可以通过不同的标准来衡量，例如速度、响应能力、内存使用情况，以及它们对 CPU 和 GPU 的消耗。考虑你未来的应用程序需要实现的功能，以及你对上述标准的预期参数。</p>
        <tip>
            <p>例如，图形密集型游戏应用可能会受益于能高效利用 GPU 的语言。与此同时，商务应用可能会优先考虑数据库集成和网络通信的便捷性。</p>
        </tip>
        <p>
            <control>3. 现有技能组与学习曲线</control>
        </p>
        <p>在为下一个项目选择技术时，开发团队应考虑到他们之前的经验。引入一种新语言或工具需要时间进行培训，这有时会延误项目。学习曲线越陡峭，团队变得熟练所需的时间就越长。</p>
        <tip>
            <p>例如，如果你的团队由非常精通 JavaScript 的开发者组成，且你缺乏采用新技术的资源，那么选择使用 JavaScript 的框架（如 React Native）可能会更有利。</p>
        </tip>
        <p>
            <control>4. 现有用例</control>
        </p>
        <p>另一个需要考虑的重要因素是该技术的实际应用。查看成功实施了特定跨平台语言或框架的公司的案例研究，可以深入了解这些技术在生产环境中的表现。这可以帮助你评估特定技术是否适合你的项目目标。探索各公司利用 Kotlin Multiplatform 开发跨平台生产就绪应用的<a
                    href="https://kotlinlang.org/case-studies/?type=multiplatform">案例研究</a>。</p>
        <p>例如，<a href="https://kotlinlang.org/case-studies/#mcdonalds-umain">McDonald’s 应用背后的 Umain 团队</a>已经转向更统一的移动开发方法，在 iOS 和 Android 间使用共享的 Kotlin 代码库。<a
                    href="https://blog.jetbrains.com/kotlin/2021/01/philips-case-study-building-connectivity-platform-with-kotlin-multiplatform/">Philips 使用 KMP</a> 为连接设备提供跨平台 SDK，从而在 Android 和 iOS 上实现一致的功能，而像 <a href="https://kotlinlang.org/case-studies/#9gag">9GAG 这样的媒体平台则使用它在应用间共享核心内容和数据逻辑</a>，确保功能对等并加快迭代速度。</p>
        <p><a href="https://kotlinlang.org/case-studies/?type=multiplatform"><img src="kmp-use-cases-1.svg"
                                                                                  alt="探索 Kotlin Multiplatform 实际用例"
                                                                                  width="500" style="block"/></a></p>
        <p>
            <control>5. 语言生态系统</control>
        </p>
        <p>该语言生态系统的成熟度也起着重要作用。注意支持多平台开发的工具和库的可用性和质量。例如，JavaScript 拥有海量的库，支持前端框架（React、Angular、Vue.js）、后端开发（Express、NestJS）以及广泛的其他功能。</p>
        <p>同样，Flutter 拥有数量庞大且快速增长的库，也被称为软件包或插件。虽然 Kotlin Multiplatform 目前的库较少，但其生态系统正在迅速扩张，且该语言正受到全球许多 Kotlin 开发者的增强支持。你可以在 <a href="https://klibs.io/">klibs.io</a> 上已经提供的数千个库中搜索特定的多平台库。
        </p>
        <p>
            <control>6. 流行度与社区支持</control>
        </p>
        <p>值得仔细观察编程语言及其相关技术的流行度和社区支持。这不仅仅取决于用户和库的数量。还要注意该语言社区（包括其用户和贡献者）的活跃度和支持程度。寻找可用的博客、播客、论坛和其他资源。</p>
        <p>
            <control>7. 许可与厂商生命周期</control>
        </p>
        <p>开发者通常会寻找由大型社区或声誉良好的组织支持的、开源且厂商中立的语言和框架。开源生态系统（如 Kotlin、JavaScript 或 Dart）降低了被锁定在特定供应商的风险，并允许团队根据需要独立维护或增强工具。</p>
        <p>与此同时，厂商的支持仍然很重要——由 Google、JetBrains 或 Meta 支持的框架进展更快，并能收到更频繁的升级。平衡这些方面至关重要。一个强大的项目通常结合了透明的治理、活跃的社区贡献以及维护者的长期承诺，这能向团队保证他们的技术选择在未来多年内都是可行的。</p>
    </chapter>
    <chapter title="跨平台开发的未来" id="the-future-of-cross-platform-development">
        <p>随着跨平台开发的不断进步，几种新兴趋势正在影响其未来，推动其超越基础的代码共享，向更智能、更灵活的解决方案发展。</p>
        <p>
            <control>WebAssembly 与服务器驱动的 UI</control>
        </p>
        <p>一个显著的趋势是 WebAssembly (Wasm) 的兴起，它允许高性能代码（用 Rust 或 C++ 等语言编写）在浏览器中与 JavaScript 并行执行。这实现了真正的可移植应用程序，在不广泛依赖平台特定代码的情况下，提供跨平台的近乎原生性能。与此同时，服务器驱动的 UI 正日益流行，允许开发者从后端定制应用界面，减少了对频繁客户端更新的需求，并增强了跨设备的一致性。</p>
        <p>
            <control>AI 辅助代码生成</control>
        </p>
        <p>另一个重要趋势是 AI 辅助代码生成。大语言模型驱动的工具通过创建模板代码、推荐跨平台抽象，甚至协助语言间的代码转换，来加速开发。这降低了入门门槛并加速了交付，特别是对于跨不同平台工作的团队而言。</p>
        <p>
            <control>Rust 和 Go 在跨平台系统中的兴起</control>
        </p>
        <p>Rust 和 Go 等语言在跨平台后端服务和对性能敏感的组件中变得越来越流行。特别是 Rust，因其内存安全性和 WebAssembly 兼容性而备受赞誉，而 Go 的简洁性和并发模型使其非常适合大型跨平台应用程序。</p>
        <p>
            <control>低代码与无代码的加速发展</control>
        </p>
        <p>许多企业现在正使用低代码和无代码平台，以极少的工程投入快速构建原型甚至交付跨平台应用程序。虽然它们无法在大型程序中替代全规模开发，但它们极大地缩短了简单用例的上市时间。</p>
        <p>总的来说，跨平台开发的未来正在转向高性能、自动化和多功能性的结合。随着这些技术的进步，开发者将能够创造出更丰富、更快速、更一致的跨平台体验——同时只需花费更少的时间来处理平台特定的复杂性。</p>
        <p><a href="https://www.jetbrains.com/kotlin-multiplatform/"><img src="see-kmp-in-action.svg"
                                                                          alt="查看 Kotlin Multiplatform 实战"
                                                                          width="500" style="block"/></a></p>
        </chapter>
        <chapter title="常见问题" id="frequently-asked-questions">
        <p>
            <control>问：最热门的跨平台编程语言有哪些？</control>
        </p>
        <p>答：Kotlin、JavaScript、Python、Java、C#、C++ 和 Dart 都是最热门的跨平台开发语言。它们的吸引力源于强大的生态系统、成熟的工具和广泛的社区支持，使其成为开发 Web、移动和桌面应用的可靠选择。</p>
        <p>
            <control>问：Python 适合跨平台开发吗？</control>
        </p>
        <p>是的，Python 具有多功能性，非常适合跨平台桌面应用程序和脚本编写。Kivy 等框架允许开发者通过单一代码库创建可在多个平台上运行的应用。然而，在原生移动应用开发中，它的使用并不广泛，而 Kotlin、Swift 和 Dart 在该领域更为普遍。</p>
        <p>
            <control>问：如何在 Kotlin、Flutter (Dart) 和 React Native (JavaScript) 之间做出选择？</control>
        </p>
        <p>适合你的选择取决于几个关键因素：</p>
        <list>
            <li><p>团队专长 – 通过利用你的员工已经掌握的技术来缩短上手时间。</p></li>
            <li><p>UI 处理方式 – Flutter 提供高度可定制的 UI，但 React Native 依赖于原生组件。相比之下，Kotlin Multiplatform 提供更高的灵活性。开发者可以选择仅共享业务逻辑，同时保持每个平台的 UI 完全原生，或者使用 Compose Multiplatform 共享逻辑和 UI。</p></li>
            <li><p>性能要求 – Kotlin（用于原生 Android）性能最佳，而 Kotlin Multiplatform 可以在不牺牲性能的前提下实现跨平台开发。Flutter 通过其渲染引擎提供高性能，而 React Native 的性能则可能因桥接和应用复杂度而异。</p></li>
            <li><p>社区与生态系统 – React Native 拥有最大的生态系统，尽管 Kotlin Multiplatform 和 Flutter 正在迅速扩张。</p></li>
            <li><p>长期支持 – JavaScript 拥有最大的生态系统，而 Kotlin Multiplatform 和 Flutter 正在快速演进，并分别得到来自 JetBrains 和 Google 的强大支持。</p></li>
        </list>
        <p>
            <control>问：是否可以使用单一语言在多个平台间复用代码？</control>
        </p>
        <p>答：是的。例如，Kotlin Multiplatform 允许在 Android、iOS、桌面、Web 和服务器间共享代码，同时保留原生开发的优势。通过 Compose Multiplatform，你还可以共享 UI 代码以实现最大程度的代码复用。某些平台相关的特性（如硬件访问、系统 API 或深度操作系统集成）可能仍需要原生实现或自定义的 expect/actual 模块。</p>
        </chapter>
</topic>