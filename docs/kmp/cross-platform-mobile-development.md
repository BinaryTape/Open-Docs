<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       id="cross-platform-mobile-development"
       title="什么是跨平台移动开发？"
       help-id="cross-platform-mobile-development">
    <web-summary>了解跨平台移动开发，包括其定义、框架对比（Kotlin Multiplatform、Flutter、React Native）以及案例研究。</web-summary>
    <p>如今，许多公司正面临为多个平台（特别是 Android 和 iOS）构建移动应用的挑战。这就是为什么跨平台移动开发解决方案已成为最受欢迎的软件开发趋势之一的原因。</p>
    <p>根据最近的<a href="https://42matters.com/stats">应用市场数据</a>，Google Play 商店拥有超过 230 万个应用，Apple App Store 提供约 220 万个应用，Android 和 iOS 继续占据<a href="https://gs.statcounter.com/os-market-share/mobile/worldwide">全球移动应用分发和使用</a>的主导地位。</p>
    <p>如何创建一个能够触达 Android 和 iOS 受众的移动应用？在本文中，您将了解到为什么越来越多的移动工程师选择跨平台（或多平台）移动开发方法。</p>
    <chapter title="跨平台移动开发：定义与解决方案" id="cross-platform-mobile-development-definition-and-solutions">
        <p>跨平台移动开发（也称为多平台移动开发）是一种允许团队使用单一共享代码库构建适用于多个平台的应用程序的方法。工程师无需开发和维护两个完全独立的原生应用，而是编写可以在平台间复用的公共代码。</p>
        <p>现代<a href="cross-platform-frameworks.topic">跨平台框架</a>允许开发者编写一次大部分应用逻辑，并在 Android 和 iOS 之间共享，从而显著减少重复工作并加速交付。例如，<a href="kmp-overview.md">Kotlin Multiplatform</a> 让工程师能够复用其所有的业务逻辑，通过 Compose Multiplatform，甚至可以在平台间复用 UI 代码。</p>
        <p><a href="https://kotlinlang.org/multiplatform/"><img src="discover-kmp.svg" alt="发现 Kotlin Multiplatform" width="600"/></a></p>
        <p>这种高水平的代码共享有助于确保跨平台的一致用户体验，减少重复的开发工作，并降低长期维护成本。同时，现代框架允许开发者在需要时保留对原生 API 和平台特定功能的访问。</p>
        <p>通过将代码复用与原生集成相结合，跨平台开发为旨在高效触达 Android 和 iOS 用户的公司提供了一个平衡的解决方案。</p>
        <chapter title="移动应用开发的不同方法" id="different-approaches-to-mobile-app-development">
            <p>在过去的十年中，跨平台解决方案已经发生了显著演变。早期的混合工具（如 Apache Cordova 和 Ionic）实现了基于 Web 的代码在平台间共享，但通常性能有限且用户体验较差。像 Kotlin Multiplatform 和 Flutter 这样现代的编译型框架在提供广泛代码复用的同时，提供了近乎原生的性能，并能更深层次地访问原生平台功能。</p>
            <p>为 Android 和 iOS 创建应用主要有以下几种方式：</p>
              <list type="none">
                  <li><a href="#1-separate-native-apps-for-each-operating-system">独立的原生应用</a></li>
                  <li><a href="#2-progressive-web-apps-pwas">渐进式 Web 应用 (PWA)</a></li>
                  <li><a href="#3-cross-platform-apps">跨平台应用</a></li>
                  <li><a href="#4-hybrid-apps">混合应用</a></li>
              </list>
            <chapter title="1. 为每个操作系统开发独立的原生应用" id="1-separate-native-apps-for-each-operating-system">
                <p>在创建原生应用时，开发者针对特定的操作系统构建应用程序，并依赖专门为一个平台设计的工具和编程语言：Android 使用 Kotlin 或 Java，iOS 使用 Swift 或 Objective-C。</p>
                <p>这些工具和语言让您可以访问特定操作系统的功能和能力，并允许您打造具有直观界面的响应式应用。但如果您想触达 Android 和 iOS 受众，则必须创建单独的应用程序，这需要花费大量的时间和精力。</p>
            </chapter>
            <chapter title="2. 渐进式 Web 应用 (PWA)" id="2-progressive-web-apps-pwas">
                <p>渐进式 Web 应用将移动应用的功能与 Web 开发中使用的解决方案相结合。粗略地说，它们提供了网站和移动应用的混合体。开发者使用 JavaScript、HTML、CSS 和 WebAssembly 等 Web 技术构建 PWA。</p>
                <p>Web 应用程序不需要单独的打包或分发，可以在线发布。它们可以通过计算机、智能手机和平板电脑上的浏览器访问，不需要通过 Google Play 或 App Store 安装。</p>
                <p>这里的缺点是用户在利用应用时无法使用其设备的所有功能（如联系人、日历、电话和其他资产），从而导致用户体验受限。在应用性能方面，原生应用占据领先地位。</p>
            </chapter>
            <chapter title="3. 跨平台应用" id="3-cross-platform-apps">
                <p>如前所述，多平台应用旨在不同移动平台上的运行效果完全相同。跨平台框架允许您为了开发此类应用而编写可共享和可复用的代码。</p>
                <p>这种方法有几个好处，例如在时间和成本方面的高效性。我们将在后面的章节中详细介绍跨平台移动开发的优缺点。</p>
            </chapter>
            <chapter title="4. 混合应用" id="4-hybrid-apps">
                <p>在浏览网站和论坛时，您可能会注意到有些人交替使用“<emphasis>跨平台移动开发</emphasis>”和“<emphasis>混合移动开发</emphasis>”这两个术语。然而，这样做并不完全准确。</p>
                <p>对于跨平台应用，移动工程师可以编写一次代码，然后在不同平台上复用。另一方面，混合应用开发是一种结合了原生和 Web 技术的方法。它要求您将使用 Web 开发语言（如 HTML、CSS 或 JavaScript）编写的代码嵌入到原生应用中。您可以借助 Ionic Capacitor 和 Apache Cordova 等框架，使用额外的插件来访问平台的原生功能。</p>
                <p>跨平台和混合开发之间唯一的相似之处是代码的可共享性。在性能方面，混合应用程序无法与原生应用媲美。因为混合应用部署的是单一代码库，某些功能是针对特定操作系统的，在其他系统上运行效果不佳。</p>
            </chapter>
        </chapter>
        <chapter title="原生或跨平台应用开发：旷日持久的争论" id="native-or-cross-platform-app-development-a-longstanding-debate">
            <p><a href="native-and-cross-platform.topic">关于原生和跨平台开发的争论</a>在技术社区中仍未解决。这两项技术都在不断演进，并各有利弊。</p>
            <p>一些专家仍然更倾向于原生移动开发而非多平台解决方案，认为原生应用更强大的性能和更好的用户体验是最重要的优势。</p>
            <p>然而，许多现代企业需要更快速地在 Android 和 iOS 上发布功能。这就是 Kotlin Multiplatform 等跨平台开发技术可以发挥作用的地方。Duolingo 等公司已经<a href="https://youtu.be/RJtiFt5pbfs?si=jNBydHcHPw-IIEVZ">见证了其影响力</a>。正如其客户端平台团队的 John Rodriguez 所述：</p>
            <note>
                <p>对于 Duolingo 来说，一个令人兴奋的趋势是，我们在内部使用 Kotlin Multiplatform 越多，我们就发现自己在交付速度方面变得越快。事实证明，当你学习了一些东西之后，你就会变得非常擅长它。[…] 现在我们有了更多的信心，并且正在积累这些知识。</p>
            </note>
            <p><a href="https://kotlinlang.org/case-studies/?type=multiplatform"><img src="kmp-use-cases-1.svg" alt="探索 Kotlin Multiplatform 案例研究" width="600"/></a></p>
        </chapter>
    </chapter>
    <chapter title="跨平台移动开发适合您吗？" id="is-cross-platform-mobile-development-right-for-you">
        <p>选择跨平台开发通常不仅是出于技术原因，也是因为其商业优势。通过在平台间共享代码，团队可以减少重复的开发工作，加速功能交付，并简化长期维护。</p>
        <chapter title="跨平台移动开发的好处" id="benefits-of-cross-platform-mobile-development">
            <p>企业选择这种方法而非其他选项的原因有很多：</p>
              <list type="none">
                  <li><a href="#1-reusable-code">可复用代码</a></li>
                  <li><a href="#2-time-savings">节省时间</a></li>
                  <li><a href="#3-effective-resource-management">有效的资源管理</a></li>
                  <li><a href="#4-attractive-opportunities-for-developers">对开发者极具吸引力的机会</a></li>
                  <li><a href="#5-opportunity-to-reach-wider-audiences">触达更广泛受众的机会</a></li>
                  <li><a href="#6-quicker-time-to-market-and-customization">更快的上市时间和自定义</a></li>
              </list>
            <chapter title="1. 可复用代码" id="1-reusable-code">
                <p>通过跨平台编程，移动工程师无需为每个操作系统编写新代码。使用单一代码库允许开发者减少在重复性任务（如 API 调用、数据存储、数据序列化和分析实现）上花费的时间。</p>
                <p>像 Kotlin Multiplatform 这样的技术允许您仅实现一次应用的数据层、业务层和表示层。或者，您可以逐步采用 KMP：选择一段经常变动且通常会发生不同步的逻辑（如筛选或排序），将其设为跨平台，然后将其作为共享模块连接到您的项目中。</p>
                <p>在 JetBrains，我们定期进行 Kotlin Multiplatform 调查，并询问我们的社区成员他们在不同平台之间共享代码的哪些部分。</p>
                <img src="survey-results-q1-q2-22.png" alt="Kotlin Multiplatform 用户可以在平台间共享的代码部分" width="700"/>
            </chapter>
            <chapter title="2. 节省时间" id="2-time-savings">
                <p>由于大部分应用程序逻辑可以在平台间共享，开发者可以减少重复功能。这降低了开发工作量，并允许团队更快地向两个平台交付新功能。</p>
            </chapter>
            <chapter title="3. 有效的资源管理" id="3-effective-resource-management">
                <p>拥有单一代码库可帮助团队更有效地管理其资源。团队无需为 Android 和 iOS 维护单独的代码库和开发工作流，而是可以在共享组件上进行协作，专注于构建产品功能，而不是重复工作。</p>
            </chapter>
            <chapter title="4. 对开发者极具吸引力的机会" id="4-attractive-opportunities-for-developers">
                <p>许多移动工程师将现代跨平台技术视为产品技术栈中理想的元素。开发者在必须执行重复性和常规任务（如 JSON 解析）时可能会感到工作乏味。然而，新技术和新任务可以带回他们的兴奋感、动力和工作乐趣。通过这种方式，拥有现代技术栈实际上可以使您更容易招募移动开发团队，并使他们更长时间地保持参与感和热情。</p>
            </chapter>
            <chapter title="5. 触达更广泛受众的机会" id="5-opportunity-to-reach-wider-audiences">
                <p>您不必在不同平台之间做出选择。由于您的应用与多个操作系统兼容，您可以满足 Android 和 iOS 受众的需求并最大限度地扩大覆盖范围。</p>
            </chapter>
            <chapter title="6. 更快的上市时间和自定义" id="6-quicker-time-to-market-and-customization">
                <p>由于您不需要为不同平台构建不同的应用，您可以更快地开发并推出产品。更重要的是，如果您的应用程序需要进行自定义或转换，程序员对代码库特定部分进行细微更改会更容易。这也将允许您更迅速地响应用户反馈。</p>
            </chapter>
        </chapter>
        <chapter title="跨平台开发方法的挑战" id="challenges-of-a-cross-platform-development-approach">
            <p>所有解决方案都有其自身的局限性。技术社区中的一些人认为跨平台编程仍然在处理性能问题。此外，项目负责人可能会担心他们对优化开发过程的关注可能会对应用的用户体验产生负面影响。</p>
            <p>然而，随着底层技术的改进，跨平台解决方案正变得越来越稳定、适应性强且灵活。</p>
            <p>另一个经常被提及的担忧是，多平台开发无法无缝支持平台的原生功能。然而，使用 Kotlin Multiplatform，您可以使用 Kotlin 的<a href="multiplatform-expect-actual.md">预期声明和实际声明</a>来允许您的多平台应用访问平台特定的 API。预期声明和实际声明允许您在公共代码中定义您“预期”能够在多个平台调用相同的函数，并提供“实际”实现，由于 Kotlin 与 Java 和 Objective-C/Swift 的互操作性，这些实现可以与任何平台特定的库进行交互。</p>
            <p>随着现代多平台框架的不断演进，它们越来越多地允许移动工程师打造类原生的体验。如果一个应用程序编写得很好，用户将无法察觉到差异。然而，您的产品质量将很大程度上取决于您选择的跨平台应用开发工具。</p>
        </chapter>
    </chapter>
    <chapter title="跨平台框架对比" id="cross-platform-framework-comparison">
        <p>有几种框架允许开发者使用共享代码库构建跨平台移动应用程序。虽然它们的目标都是减少 Android 和 iOS 开发之间的重复工作，但它们在编程语言、渲染方法、性能特性和生态系统成熟度方面有所不同。</p>
        <p>以下概述对比了目前一些使用最广泛的跨平台框架。</p>
        <table style="both">
            <tr>
                <td width="160"></td>
                <td width="50"><b>语言</b></td>
                <td width="230"><b>跨平台代码共享</b></td>
                <td width="140"><b>社区成熟度</b></td>
                <td width="130"><b>应用示例</b></td>
            </tr>
            <tr>
                <td><b>Kotlin Multiplatform</b></td>
                <td>Kotlin</td>
                <td>
                    灵活共享业务逻辑和跨平台 UI，
                    同时在需要时保留原生平台代码。
                </td>
                <td>快速增长</td>
                <td>
                    Duolingo, McDonald's,
                    Forbes, Philips,
                    H&amp;M, Bolt
                </td>
            </tr>
            <tr>
                <td><b>Flutter</b></td>
                <td>Dart</td>
                <td>
                    大多数应用逻辑和 UI 
                    在单一的 Dart 代码库中共享。
                </td>
                <td>规模庞大且成熟</td>
                <td>
                    eBay Motors, Alibaba,
                    Google Pay,
                    字节跳动应用
                </td>
            </tr>
            <tr>
                <td><b>React Native</b></td>
                <td>
                    JavaScript,
                    TypeScript
                </td>
                <td>
                    业务逻辑和 UI 组件在平台间共享，
                    涵盖从单个功能到完整应用。
                </td>
                <td>规模庞大且成熟</td>
                <td>
                    Microsoft Office, Teams,
                    Xbox Game Pass;
                    Facebook, Instagram
                </td>
            </tr>
            <tr>
                <td><b>.NET MAUI</b></td>
                <td>C#, XAML</td>
                <td>
                    业务逻辑和 UI 在单一的 
                    C# 代码库中跨平台共享。
                </td>
                <td>已建立</td>
                <td>
                    NBC Sports Next,
                    Escola Agil,
                    Azure App
                </td>
            </tr>
            <tr>
                <td><b>Ionic</b></td>
                <td>JavaScript</td>
                <td>
                    大多数应用逻辑和 UI 通过单一的 
                    基于 Web 的代码库共享，通过插件访问原生功能。
                </td>
                <td>成熟</td>
                <td>
                    T-Mobile,
                    BBC (儿童应用),
                    EA Games
                </td>
            </tr>
            <tr>
                <td><b>NativeScript</b></td>
                <td>
                    JavaScript,
                    TypeScript
                </td>
                <td>
                    大多数应用逻辑和 UI 在单一的 
                    JavaScript 或 TypeScript 代码库中跨平台共享。
                </td>
                <td>已建立</td>
                <td>
                    Daily Nanny,
                    Groov, Breethe
                </td>
            </tr>
        </table>
        <p>您还可以查看关于<a href="cross-platform-frameworks.topic">最受欢迎的跨平台技术</a>的更详细概述。</p>
        <p><b>Kotlin Multiplatform</b></p>
        <p>Kotlin Multiplatform 使团队能够使用 Kotlin 在平台间共享应用程序逻辑。借助 Compose Multiplatform，开发者可以共享多达 100% 的应用程序代码（包括 UI），同时在需要时仍能与原生 API 集成。这种方法允许团队从单一代码库构建适用于 Android、iOS、桌面端和 Web 的应用程序，同时保持原生能力。</p>
        <p><a href="get-started.topic"><img src="get-started-with-kmp.svg" alt="开始使用 Kotlin Multiplatform" width="600"/></a></p>
        <p><b>Flutter</b></p>
        <p>Flutter 是由 Google 创建的跨平台框架，使用 Dart 编程语言和自己的渲染引擎。由于它控制 UI 渲染层，Flutter 可以在不同平台上提供一致的视觉效果和强大的性能。详细探索 <a href="kotlin-multiplatform-flutter.md">Kotlin Multiplatform 和 Flutter</a>，以更好地了解它们的能力并确定适合您跨平台项目的方案。</p>
        <p><b>React Native</b></p>
        <p>React Native 使开发者能够使用 JavaScript 和 React 库构建移动应用。它在通过 JavaScript 运行时执行逻辑的同时渲染原生 UI 组件，这使其在具有 Web 开发经验的团队中很受欢迎。查看 <a href="kotlin-multiplatform-react-native.topic">Kotlin Multiplatform 和 React Native</a> 概述，这可能会帮助您为产品和团队选择合适的方案。</p>
        <p><b>.NET MAUI</b></p>
        <p>.NET MAUI 是 Microsoft 的跨平台框架，用于使用 C# 和 .NET 生态系统构建原生移动和桌面应用程序。它允许开发者从单一代码库定位 Android、iOS、macOS 和 Windows，并与 Visual Studio 等工具紧密集成。</p>
        <p><b>Ionic</b></p>
        <p>Ionic 是一个使用 HTML、CSS 和 JavaScript 等 Web 技术的混合移动框架。应用程序在 WebView 中运行，并通过插件或原生桥接访问设备功能，对于具有深厚 Web 开发背景的团队来说，Ionic 是一个不错的选择。</p>
        <p><b>NativeScript</b></p>
        <p>NativeScript 是一个开源框架，用于使用 JavaScript 或 TypeScript 构建原生移动应用。它渲染真实的原生 UI 组件并提供对平台 API 的直接访问，允许开发者创建具有原生性能和用户体验的跨平台应用。</p>
    </chapter>
    <chapter title="Kotlin Multiplatform 真实案例" id="real-world-kotlin-multiplatform-examples">
        <p>Duolingo、McDonald's、Netflix、9GAG、VMware、Cash App、飞利浦以及许多其他大公司正<a href="use-cases-examples.md">越来越多地采用 Kotlin Multiplatform</a>，以便在保持原生性能和平台特定用户体验的同时从这些效率中受益。其中一些公司选择通过共享其现有 Kotlin 代码中特定的、关键的部分来增强其应用的稳定性。另一些公司则旨在在不损害应用质量的情况下最大限度地复用代码，并在移动端、桌面端、Web 和电视端共享所有应用逻辑，同时在每个平台上保留原生 UI。这种方法的好处从已经采用它的公司的故事中显而易见。</p>
        <p><b>Duolingo</b></p>
        <p>Duolingo 使用 Kotlin Multiplatform 来帮助加速其移动平台的开发。该公司每周向 176 个国家超过 4000 万日活跃用户发布 Android 和 iOS 更新，团队报告称，Kotlin Multiplatform 正越来越多地帮助他们跨平台更快地交付功能。<a href="https://youtu.be/RJtiFt5pbfs?si=b8mndETdH-tplZQA">观看完整视频</a>。</p>
        <p><b>McDonald’s</b></p>
        <p>McDonald’s 应用背后的 Umain 团队最初在其支付功能中采用了 Kotlin Multiplatform，随后将其扩展到整个移动应用程序。在引入共享 Kotlin 代码后，团队报告称崩溃减少且各平台性能有所提高。这一转型还帮助团队从独立的 Android 和 iOS 团队转向了更统一的移动开发团队。<a href="https://youtu.be/uCkYZ-PvCmw?si=eLG2rmq5Hw3yvt0i">观看完整视频</a>。</p>
        <p><b>Forbes</b></p>
        <p>通过在 iOS 和 Android 之间共享超过 80% 的逻辑，Forbes 现在可以在两个平台上同时推出新功能，同时还保留了根据特定平台自定义功能的灵活性。这使得团队能够更快地创新并响应市场需求。<a href="https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/">阅读完整故事</a>。</p>
        <p><a href="https://kotlinlang.org/case-studies/?type=multiplatform"><img src="kmp-use-cases-1.svg" alt="探索 Kotlin Multiplatform 案例研究" width="600"/></a></p>
        <p>您还可以探索<a href="multiplatform-reasons-to-try.md">开发者应考虑在其现有或新项目中使用 Kotlin Multiplatform 的原因</a>以及它为何继续受到关注。</p>
    </chapter>
    <chapter title="常见问题解答" id="frequently-asked-questions">
        <p><b>问：什么是跨平台移动开发？</b></p>
        <p>答：跨平台移动开发（也称为跨平台应用开发）是一种允许您使用一个代码库构建可在多个操作系统（如 iOS 和 Android）上运行的应用程序的方法。通过跨平台共享代码，开发者可以降低成本并更快上市。</p>
        <p><b>问：我该如何选择跨平台框架？</b></p>
        <p>答：根据团队的技能、项目要求和长期产品目标选择跨平台框架。例如，对于注重性能、可维护性和原生外观的团队来说，Kotlin Multiplatform 特别有吸引力，尤其是在使用 Compose Multiplatform 共享 UI 代码时。React Native 通常受到具有 JavaScript 和 React 经验的团队的青睐，特别适用于快速原型设计。.NET MAUI 是在 .NET 生态系统中工作的开发者的强大选择。</p>
        <p><b>问：Kotlin Multiplatform 和 Compose Multiplatform 有什么区别？</b></p>
        <p>答：<a href="https://kotlinlang.org/multiplatform/">Kotlin Multiplatform</a> 是核心技术，允许您在包括 Android、iOS、桌面端、Web 和服务器端在内的多个平台间共享代码。它专注于代码复用，除非您愿意，否则不会替换原生 UI。<a href="https://kotlinlang.org/compose-multiplatform/">Compose Multiplatform</a> 是构建在 Kotlin Multiplatform 之上的可选 UI 框架。它允许您使用类似于 Android 上的 Jetpack Compose 的现代声明式方法跨平台共享用户界面。您可以使用它从单一代码库为 Android、iOS、桌面端和 Web 构建具有视觉吸引力、响应式的 UI。</p>
        <p><b>问：最受欢迎的移动开发框架是什么？</b></p>
        <p>答：受欢迎的跨平台移动应用开发框架包括 Kotlin Multiplatform、Flutter、React Native、.NET MAUI 等。您可以查看<a href="cross-platform-frameworks.topic">最受欢迎的跨平台技术概述</a>，找到最适合您需求的技术。</p>
        <p>如果您的团队在采用新的多平台技术方面需要帮助，我们建议查阅我们的指南：<a href="multiplatform-introduce-your-team.md">《如何向您的团队引入多平台开发》</a>。</p>
        <p><a href="get-started.topic"><img src="get-started-with-kmp.svg" alt="开始使用 Kotlin Multiplatform" width="600"/></a></p>
    </chapter>
    <chapter title="结论" id="conclusion">
        <p>随着跨平台开发解决方案的不断演进，其局限性与它们提供的好处相比已开始显得微不足道。市场上提供了各种技术，都适用于不同的工作流和要求。本文讨论的每种工具都为考虑尝试跨平台的团队提供了广泛的支持。</p>
        <p>最终，仔细考虑您的特定业务需求、目标和任务，并制定您希望通过应用实现的明确目标，将帮助您确定最适合您的解决方案。</p>
    </chapter>
</topic>