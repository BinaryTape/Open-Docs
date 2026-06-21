<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       id="cross-platform-frameworks" title="七款最受欢迎的跨平台应用开发框架">
    <p>多年来，跨平台应用开发已成为构建移动应用程序最流行的方式之一。
        跨平台（或多平台）方案允许开发者创建在不同移动平台上运行效果相似的应用。</p>
    <p>自 2010 年至今，开发者对这一领域的兴趣稳步增长，如下面的 Google Trends 图表所示：</p>
    <img src="google-trends-cross-platform-new.png"
         alt="展示跨平台应用开发关注度的 Google Trends 图表" width="700"/>
    <p>随着快速发展的<a href="cross-platform-mobile-development.topic">跨平台移动开发</a>技术日益普及，市场上出现了许多新工具。
        面对众多的选项，挑选出最适合您需求的工具可能具有挑战性。
        为了帮助您找到合适的工具，我们整理了一份包含最佳跨平台应用开发框架及其出色特性的列表。
        在本文末尾，您还将了解到为业务选择多平台开发框架时需要注意的几个关键点。</p>
    <chapter title="什么是跨平台应用开发框架？"
             id="what-is-a-cross-platform-app-development-framework">
        <p>移动工程师使用跨平台移动开发框架，通过单一代码库为 Android 和 iOS 等多个平台构建具有原生外观的应用程序。可共享的代码是该方案相较于原生应用开发的核心优势之一。
            拥有单一代码库意味着移动工程师可以省去为每个操作系统编写代码的麻烦，从而节省时间并加速开发进程。</p>
    </chapter>
    <chapter title="流行的跨平台应用开发框架"
             id="popular-cross-platform-app-development-frameworks">
        <p>此列表并未涵盖所有工具；目前市场上还有许多其他选择。重要的是要意识到，
            没有一种“万能”工具适合所有人。
            框架的选择在很大程度上取决于您的特定项目、目标以及我们将在本文末尾介绍的其他细节。</p>
        <p>尽管如此，我们还是挑选了一些最出色的跨平台移动开发框架，为您做出决策提供参考。</p>
        <chapter title="Kotlin Multiplatform" id="kotlin-multiplatform">
            <p><a href="https://kotlinlang.org/multiplatform/">Kotlin Multiplatform (KMP)</a> 是由 JetBrains 开发的一项开源技术，它允许在跨平台共享代码的同时保留原生编程的优势。它使开发者能够根据需要重用尽可能多的代码，在必要时编写原生代码，并将共享的 Kotlin 代码无缝集成到任何项目中。您可以将 Kotlin 与 <a
                        href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a> 配合使用，后者是一个现代的声明式跨平台 UI 框架，可以共享高达 100% 的应用代码（包括 UI）。</p>
            <p>
                <control>编程语言：</control>
                Kotlin。
            </p>
            <p>
                <control>移动应用示例：</control>
                Duolingo、McDonald's、Netflix、Forbes、9GAG、Cash App、Philips。<a
                    href="https://kotlinlang.org/case-studies/?type=multiplatform">阅读更多关于 Kotlin Multiplatform 的案例研究</a>。
            </p>
            <p>
                <control>关键特性：</control>
            </p>
            <list>
                <li><p>开发者可以在 Android、iOS、Web、桌面和服务器端重用代码，同时在需要时保留原生代码。</p></li>
                <li><p>Kotlin Multiplatform 可以无缝集成到任何项目中。开发者可以利用特定于平台的 API，同时充分利用原生和跨平台开发的优势。</p></li>
                <li><p>得益于 <a href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a>，开发者拥有完全的代码共享灵活性，能够共享逻辑和 UI。
                </p></li>
                <li><p>如果您已经在 Android 开发中使用 Kotlin，则无需在代码库中引入新语言。您可以复用 Kotlin 代码和专业知识，这使得迁移到 Kotlin Multiplatform 的风险比其他技术更低。</p></li>
            </list>
            <p>尽管这款跨平台移动开发框架是我们名单中最年轻的成员之一，但它已拥有成熟的社区。2023 年 11 月，JetBrains 将其提升至稳定版 (Stable)。在 Google I/O 2024 上，Google 宣布<a
                        href="https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html">正式支持使用 Kotlin Multiplatform 在 Android 和 iOS 之间共享业务逻辑</a>。得益于定期更新的<a href="get-started.topic">文档</a>和社区支持，您总能找到问题的答案。此外，许多<a
                        href="https://kotlinlang.org/case-studies/?type=multiplatform">跨国公司和初创公司已经在使用 Kotlin Multiplatform</a> 来开发具有类原生用户体验的多平台应用。</p>
            <p><a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html"><img
                    src="kmp-journey-start.svg" alt="开启您的 Kotlin Multiplatform 之旅" width="700"/></a></p>
        </chapter>
        <chapter title="Flutter" id="flutter">
            <p>Flutter 由 Google 于 2017 年发布，是一款流行的框架，用于通过单一代码库构建移动、Web 和桌面应用。
                要使用 Flutter 构建应用程序，您需要使用 Google 开发的名为 Dart 的编程语言。</p>
            <p>
                <control>编程语言：</control>
                Dart。
            </p>
            <p>
                <control>移动应用示例：</control>
                eBay Motors、Alibaba、Google Pay、字节跳动旗下的应用。
            </p>
            <p>
                <control>关键特性：</control>
            </p>
            <list>
                <li><p>Flutter 的热重载 (hot reload) 功能允许您在修改代码后立即看到应用程序的变化，而无需重新编译。</p></li>
                <li><p>Flutter 支持 Google 的 Material Design，这是一个帮助开发者构建数字化体验的设计系统。
                    在构建应用时，您可以使用多种视觉和行为微件 (widget)。</p></li>
                <li><p>Flutter 不依赖 Web 浏览器技术。相反，它拥有自己的渲染引擎来绘制微件。</p></li>
            </list>
            <p>Flutter 在全球范围内拥有相对活跃的用户社区，并被广大开发者广泛使用。
                根据 <a href="https://insights.stackoverflow.com/trends?tags=flutter%2Creact-native">Stack Overflow Trends</a> 的数据，基于相应标签使用量的增加，Flutter 的使用率随时间推移呈上升趋势。</p>
            <note>
                <p>深入了解 <a href="kotlin-multiplatform-flutter.md">Kotlin Multiplatform 与 Flutter</a> 的差异，以理解它们的优势并为您的跨平台开发选择最合适的工具。</p>
            </note>
        </chapter>
        <chapter title="React Native" id="react-native">
            <p>React Native 是一款开源 UI 软件框架，由 Meta Platforms（前 Facebook）于 2015 年开发。它基于 Facebook 的 JavaScript 库 React，允许开发者构建原生渲染的跨平台移动应用。</p>
            <p>
                <control>编程语言：</control>
                JavaScript。
            </p>
            <p>
                <control>移动应用示例：</control>
                React Native 被应用于 Microsoft 的 Office、Skype 和 Xbox Game Pass；Meta 的 Facebook、桌面版 Messenger 和 Oculus。在 <a href="https://reactnative.dev/showcase">React Native 展示区</a>查看更多示例。
            </p>
            <p>
                <control>关键特性：</control>
            </p>
            <list>
                <li><p>得益于快速刷新 (Fast Refresh) 功能，开发者可以立即看到 React 组件的更改。</p></li>
                <li><p>React Native 的优势之一是专注于 UI。React 原语会渲染为原生平台 UI 组件，允许您构建自定义且响应迅速的用户界面。</p></li>
                <li><p>在 0.62 及更高版本中，React Native 与移动应用调试器 Flipper 之间的集成默认启用。Flipper 用于调试 Android、iOS 和 React Native 应用，并提供日志查看器、交互式布局检查器和网络检查器等工具。</p></li>
            </list>
            <p>作为最受欢迎的跨平台应用开发框架之一，React Native 拥有庞大且强大的开发者社区，他们乐于分享技术知识。得益于此社区，您在构建移动应用时可以获得所需的支持。</p>
        </chapter>
        <chapter title="Ionic" id="ionic">
            <p>Ionic 是一款开源移动 UI 工具包，发布于 2013 年。它帮助开发者使用 HTML、CSS 和 JavaScript 等 Web 技术，并通过集成 Angular、React 和 Vue 框架，从单一代码库构建跨平台移动应用程序。</p>
            <p>
                <control>编程语言：</control>
                JavaScript。
            </p>
            <p>
                <control>移动应用示例：</control>
                T-Mobile、BBC（儿童与教育类应用）、EA Games。
            </p>
            <p>
                <control>关键特性：</control>
            </p>
            <list>
                <li><p>Ionic 基于专门为移动操作系统设计的 SaaS UI 框架，并提供多个用于构建应用的 UI 组件。</p></li>
                <li><p>Ionic 框架使用 Cordova 和 Capacitor 插件来访问设备的内置功能，例如摄像头、手电筒、GPS 和录音机。</p></li>
                <li><p>Ionic 拥有自己的命令行界面 Ionic CLI，它是构建 Ionic 应用程序的首选工具。</p></li>
            </list>
            <p>Ionic 框架论坛上一直非常活跃，社区成员在这里交流知识，并互相帮助解决开发中的挑战。</p>
        </chapter>
        <chapter title=".NET MAUI" id="net-maui">
            <p>.NET 多平台应用 UI (.NET MAUI) 是一款跨平台框架，于 2022 年 5 月发布并由 Microsoft 所有。它允许开发者使用 C# 和 XAML 创建原生移动和桌面应用。.NET MAUI 是 Xamarin.Forms 的进化版本，后者是 Xamarin 的功能之一，为 Xamarin 支持的平台提供原生控件。</p>
            <p>
                <control>编程语言：</control>
                C#、XAML。
            </p>
            <p>
                <control>移动应用示例：</control>
                NBC Sports Next、Escola Agil、Irth Solutions。
            </p>
            <p>
                <control>关键特性：</control>
            </p>
            <list>
                <li><p>.NET MAUI 提供跨平台 API，用于访问原生设备功能，如 GPS、加速度计、电池和网络状态。</p></li>
                <li><p>拥有单一项目系统，通过多目标定向 (multi-targeting) 技术来针对 Android、iOS、macOS 和 Windows 进行开发。</p></li>
                <li><p>借助对 .NET 热重载的支持，开发者可以在应用运行时修改托管源代码。</p></li>
            </list>
            <p>尽管 .NET MAUI 仍然是一个相对较新的框架，但它已经获得了开发者的关注，并在 Stack Overflow 和 Microsoft Q&amp;A 上拥有活跃的社区。</p>
        </chapter>
        <chapter title="Uno Platform" id="uno-platform">
            <p>Uno Platform 是一款灵活的开源技术栈，用于通过单一共享代码库构建现代跨平台 .NET 应用。凭借企业级设计和上下文相关的 AI 工具，Uno Platform 使开发者能够利用 C#/XAML 高效构建原生移动、桌面、嵌入式和 WebAssembly 应用程序。Uno Platform 以将 WinUI/UWP 编程模型引入 Windows 以外的多个平台而闻名，允许 .NET 开发者在广泛的目标平台上复用技能和代码。</p>
            <p>
                <control>编程语言：</control>
                C#、XAML。
            </p>
            <p>
                <control>应用示例：</control>
                来自 Toyota &amp; Kahua 的迁移应用、TradeZero、基于 SkiaSharp 的企业级应用程序。
            </p>
            <p>
                <control>关键特性：</control>
            </p>
            <list>
                <li><p>Uno Platform 允许开发者在跨平台（包括 Android、iOS、WebAssembly (WASM)、macOS、Linux 和 Windows）共享单一 UI 和业务逻辑层时，访问原生平台功能。它支持单一代码库和项目结构，通过多目标定向技术，使用与 WinUI 兼容的 API 在多个平台上运行相同的应用程序。</p></li>
                <li><p>配合 Uno Platform Studio，.NET 开发者可以利用 Hot Design 可视化设计器获得巨大的生产力提升，结合热重载实现最快的 C#/XAML 开发循环，以及可靠的 AI 代理 / MCP 工具来实现上下文相关的 AI 智能和技术栈的灵活性——所有这些都旨在从任何操作系统 / IDE / AI 代理构建跨平台应用。</p></li>
            </list>
            <p>Uno Platform 拥有强大的开源社区，并被广泛应用于企业级和业务线 (line-of-business) 应用程序，尤其是那些已经投入 .NET 生态系统的团队。</p>
        </chapter>
        <chapter title="NativeScript" id="nativescript">
            <p>这款开源移动应用程序开发框架最初发布于 2014 年。NativeScript 允许您使用 JavaScript 或可转译为 JavaScript 的语言（如 TypeScript），以及 Angular 和 Vue.js 等框架来构建 Android 和 iOS 移动应用。</p>
            <p>
                <control>编程语言：</control>
                JavaScript、TypeScript。
            </p>
            <p>
                <control>移动应用示例：</control>
                Daily Nanny、Strudel、Breethe。
            </p>
            <p>
                <control>关键特性：</control>
            </p>
            <list>
                <li><p>NativeScript 允许开发者轻松访问原生的 Android 和 iOS API。</p></li>
                <li><p>该框架渲染平台原生 UI。使用 NativeScript 构建的应用直接在原生设备上运行，而不依赖于 WebView（Android 操作系统的一种系统组件，允许 Android 应用在应用内部显示来自 Web 的内容）。</p></li>
                <li><p>NativeScript 提供各种插件和预构建的应用模板，消除了对第三方解决方案的需求。</p></li>
            </list>
            <p>NativeScript 基于 JavaScript 和 Angular 等广为人知的 Web 技术，这也是许多开发者选择该框架的原因。尽管如此，它通常被小型公司和初创公司使用。</p>
        </chapter>
    </chapter>
    <chapter title="如何为您的项目选择合适的跨平台应用开发框架？"
             id="how-do-you-choose-the-right-cross-platform-app-development-framework-for-your-project">
        <p>除了上述提到的框架外，还有其他跨平台框架，且市场上将不断出现新工具。面对琳琅满目的选择，您如何为下一个项目找到合适的工具？第一步是了解项目的需求和目标，并明确未来应用的样貌。接下来，您需要考虑以下重要因素，以便决定最适合您业务的选择。</p>
        <chapter title="1. 团队的专业知识" id="1-the-expertise-of-your-team">
            <p>不同的跨平台移动开发框架基于不同的编程语言。在采用某个框架之前，请检查它所需的技能，并确保您的团队具有足够的知识和经验来使用它。</p>
            <p>例如，如果您的团队拥有高技能的 JavaScript 开发者，且您没有足够的资源来引入新技术，那么选择使用该语言的框架（如 React Native）可能是值得的。</p>
        </chapter>
        <chapter title="2. 供应商可靠性与支持" id="2-vendor-reliability-and-support">
            <p>确保框架的维护者能够长期提供支持至关重要。了解开发和支持您正在考虑的框架的公司，并查看使用这些框架构建的移动应用。</p>
        </chapter>
        <chapter title="3. UI 自定义" id="3-ui-customization">
            <p>根据用户界面对您未来应用的重要性，您可能需要了解使用特定框架自定义 UI 的难易程度。例如，Kotlin Multiplatform 通过 <a href="https://www.jetbrains.com/lp/compose-multiplatform/">Compose Multiplatform</a>（由 JetBrains 开发的现代声明式跨平台 UI 框架）提供完全的代码共享灵活性。它使开发者能够在 Android、iOS、Web 和桌面（通过 JVM）之间共享 UI，并基于 Kotlin 和 Jetpack Compose。</p>
            <p><a href="https://www.jetbrains.com/compose-multiplatform/"><img src="explore-compose.svg"
                                                                               alt="探索 Compose Multiplatform"
                                                                               width="700"/></a></p>
        </chapter>
        <chapter title="4. 框架成熟度" id="4-framework-maturity">
            <p>了解拟采用框架的公共 API 和工具链的变更频率。例如，原生操作系统组件的某些更改可能会破坏内部跨平台行为。最好了解在使用该移动应用开发框架时可能面临的潜在挑战。您还可以浏览 GitHub，检查该框架有多少错误 (bug) 以及这些错误的处理情况。</p>
        </chapter>
        <chapter title="5. 框架功能" id="5-framework-capabilities">
            <p>每个框架都有其自身的功能和局限性。了解框架提供的特性和工具对于确定最佳解决方案至关重要。它是否拥有代码分析器和单元测试框架？您构建、调试和测试应用的效率如何？</p>
        </chapter>
        <chapter title="6. 安全性" id="6-security">
            <p>在构建银行和电子商务等包含支付系统的关键业务移动应用时，安全性和隐私尤为重要。根据 <a
                        href="https://owasp.org/www-project-mobile-top-10/">OWASP Mobile Top 10</a>，移动应用程序最关键的安全风险包括不安全的数据存储和身份验证/授权。</p>
            <p>您需要确保所选的多平台移动开发框架能提供所需的安全性水平。一种方法是浏览框架的问题跟踪器（如果公开可用）上的安全工单。</p>
        </chapter>
        <chapter title="7. 教育材料" id="7-educational-materials">
            <p>关于某个框架的可获取学习资源的数量和质量，也能反映出您在使用该框架时的体验是否顺畅。详尽的官方<a href="get-started.topic">文档</a>、线上和线下会议以及教育课程都是一个好迹象，表明您在需要时能够找到关于该产品的充足核心信息。</p>
            <p>例如，我们整理了一份 <a href="kmp-learning-resources.md">Kotlin Multiplatform 学习材料的详尽列表</a>。</p>
        </chapter>
    </chapter>
    <chapter title="关键要点" id="key-takeaways">
        <p>如果不考虑这些因素，很难选出最能满足您特定需求的跨平台移动开发框架。请仔细审视您未来的应用需求，并将其与各框架的功能进行权衡。这样做将有助于您找到合适的跨平台解决方案，从而交付高质量的应用。</p>
    </chapter>
    <chapter title="常见问题解答" id="frequently-asked-questions">
        <p>
            <control>问：什么是跨平台应用开发框架？</control>
        </p>
        <p>答：跨平台应用开发框架是一组用于通过共享代码为多个平台构建应用的工具和库。它支持 Android、iOS、桌面和 Web 等平台，同时仍允许在需要时编写特定于平台的代码。</p>
        <p>
            <control>问：为什么会有多种跨平台应用开发框架？</control>
        </p>
        <p>答：之所以存在多种跨平台应用开发框架，是因为不同的项目有不同的需求。这些框架在工具链、支持的平台和生态系统成熟度等方面各不相同。</p>
        <p>
            <control>问：是什么让跨平台应用开发框架变得流行？</control>
        </p>
        <p>答：当一个跨平台应用开发框架提供强大的工具链、清晰的文档、可靠的平台支持和活跃的社区时，它就会变得流行。如果被广泛使用并得到定期维护，它也更有可能保持流行地位。</p>
        <p>
            <control>问：跨平台应用开发框架仅用于移动应用吗？</control>
        </p>
        <p>答：不是。虽然许多跨平台应用开发框架主要用于移动应用，但根据其架构和支持的目标平台，有些框架还可以支持 Web 或桌面等其他平台。</p>
        <p>
            <control>问：跨平台应用开发框架支持原生平台功能吗？</control>
        </p>
        <p>答：是的。大多数跨平台应用开发框架通过平台 API、插件或桥接机制提供对原生平台功能的访问。这允许应用程序框架在共享通用代码的同时，支持特定于平台的功能。</p>
        <p>
            <control>问：开发者应该如何评估不同的跨平台应用开发框架？</control>
        </p>
        <p>答：开发者应根据平台支持、工具质量、生态系统成熟度、性能需求和长期可维护性来评估跨平台应用开发框架。同时，考虑每个应用程序框架与原生 API 的集成程度，以及它是否符合团队的技能和工作流程也很有用。</p>
    </chapter>
</topic>