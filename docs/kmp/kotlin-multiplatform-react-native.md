<topic xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:noNamespaceSchemaLocation="https://resources.jetbrains.com/writerside/1.0/topic.v2.xsd"
       id="kotlin-multiplatform-react-native"
       title="Kotlin Multiplatform 与 React Native：跨平台对比">
    <web-summary>探索 Kotlin Multiplatform 与 Compose Multiplatform 如何在代码共享、生态系统和 UI 渲染方面与 React Native 进行对比，并了解哪种工具栈最适合您的团队。
    </web-summary>
    <tip>
        <p>本文档对比强调，Kotlin Multiplatform 擅长在 Android 和 iOS 上提供真正的原生体验，并能完全访问平台 API。
            KMP 对于注重性能、可维护性以及原生外观和感觉的团队尤其具有吸引力，尤其是在使用 Compose Multiplatform 共享 UI 代码时。
            与此同时，React Native 可能更适合具备 JavaScript 专长的团队，尤其是在快速原型开发方面。</p>
    </tip>
    <p>跨平台开发极大地改变了团队构建应用程序的方式，使他们能够从共享的代码库为多个平台交付应用程序。这种方法简化了开发流程，并有助于确保设备间用户体验的一致性。</p>
    <p>此前，为 Android 和 iOS 构建应用程序意味着要维护两个独立的、通常由不同团队负责的代码库，这导致了重复工作和平台间显著的差异。跨平台解决方案加速了产品上市时间，并提高了整体效率。</p>
    <p>在现有工具中，Kotlin Multiplatform、React Native 和 Flutter 作为最广泛采用的三种方案脱颖而出。本文将详细探讨它们，以帮助您为您的产品和团队选择最合适的方案。</p>
    <chapter title="Kotlin Multiplatform 和 Compose Multiplatform" id="kotlin-multiplatform-and-compose-multiplatform">
        <p><a href="https://www.jetbrains.com/kotlin-multiplatform/">Kotlin Multiplatform (KMP)</a> 是一项由 JetBrains 开发的开源技术，支持在 Android、iOS、桌面 (Windows, macOS, Linux)、Web 和后端之间共享代码。它允许开发者在多个环境中复用 Kotlin 代码，同时保留原生功能和性能。</p>
        <p>采用率稳步上升：在过去两次 <a href="https://www.jetbrains.com/lp/devecosystem-2024/">开发者生态系统调查</a> 的受访者中，Kotlin Multiplatform 的使用率在一年内翻了一倍多——从 2024 年的 7% 增长到 2025 年的 18%——这明确表明了其日益增长的势头。</p>
        <img src="kmp-growth-deveco.svg"
             alt="KMP usage increased from 7% in 2024 to 18% in 2025 among respondents to the last two Developer Ecosystem surveys"
             width="700"/>
        <p><a href="https://www.jetbrains.com/kotlin-multiplatform/"><img src="discover-kmp.svg"
                                                                          alt="Discover Kotlin Multiplatform"
                                                                          style="block"
                                                                          width="500"/></a></p>
        <p>借助 KMP，您可以选择您的共享策略：从共享除应用程序入口点外的所有代码，到共享单个逻辑片段（例如网络或数据库模块），或在保持 UI 原生的同时共享业务逻辑。</p>
        <p>为了在平台间共享 UI 代码，您可以使用 <a
                href="https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/">Compose Multiplatform</a>
            ——JetBrains 基于 Kotlin Multiplatform 和 Google 的 Jetpack Compose 构建的现代声明式框架。它在
            <a href="https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/?_gl=1*dcswc7*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTA2NzU0MzQkbzM2JGcxJHQxNzUwNjc1NjEwJGo2MCRsMCRoMA..">iOS</a>、Android 和桌面端已达到稳定状态，而 Web 支持目前处于 Beta 阶段。</p>
        <p><a href="https://www.jetbrains.com/compose-multiplatform/"><img src="explore-compose.svg"
                                                                           alt="Explore Compose Multiplatform"
                                                                           style="block"
                                                                           width="500"/></a></p>
        <p>Kotlin Multiplatform 最初在 Kotlin 1.2 (2017) 中引入，于 2023 年 11 月达到 <a
                href="https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/">稳定状态</a>。在 Google I/O 2024 大会上，Google 宣布官方支持
            <a
                    href="https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html">在 Android 上使用 Kotlin Multiplatform</a>，以便在 Android 和 iOS 之间共享业务逻辑。
        </p>
    </chapter>
    <chapter title="React Native" id="react-native">
        <p>React Native 是一个开源框架，用于使用 <a
                href="https://reactjs.org/">React</a>（一个用于 Web 和原生用户界面的库）和应用程序平台的原生能力来构建 Android 和 iOS 应用程序。React Native 允许开发者使用 JavaScript 访问其平台的 API，并使用 React 组件（可复用、可嵌套的代码束）来描述 UI 的外观和行为。</p>
        <p>React Native 于 2015 年 1 月在 React.js Conf 上首次宣布。同年晚些时候，Meta 在 F8 2015 上发布了 React Native，并一直维护至今。</p>
        <p>虽然 Meta 负责监督 React Native 产品，但 <a
                href="https://github.com/facebook/react-native/blob/HEAD/ECOSYSTEM.md">React Native 生态系统</a>
            由合作伙伴、核心贡献者和活跃社区组成。如今，该框架得到全球个人和公司的贡献支持。</p>
    </chapter>
    <chapter title="Kotlin Multiplatform 与 React Native：并排对比"
             id="kotlin-multiplatform-vs-react-native-side-by-side-comparison">
        <table style="both">
            <tr>
                <td></td>
                <td><b>Kotlin Multiplatform</b></td>
                <td><b>React Native</b></td>
            </tr>
            <tr>
                <td><b>创建者</b></td>
                <td>JetBrains</td>
                <td>Meta</td>
            </tr>
            <tr>
                <td><b>语言</b></td>
                <td>Kotlin</td>
                <td>JavaScript, TypeScript</td>
            </tr>
            <tr>
                <td><b>灵活性与代码复用</b></td>
                <td>共享代码库的任何部分，包括业务逻辑和/或 UI，从 1% 到 100% 均可。可以增量采用，也可以从头开始构建跨平台的原生体验应用程序。
                </td>
                <td>在平台间复用业务逻辑和 UI 组件，从单个特性到完整应用程序均可。可以将 React Native 添加到现有原生应用程序中，以构建新屏幕或用户流程。
                </td>
            </tr>
            <tr>
                <td><b>包、依赖项与生态系统</b></td>
                <td>包可从 <a href="https://central.sonatype.com/">Maven Central</a> 和其他版本库获取，包括
                    <p><a href="http://klibs.io">klibs.io</a>（Alpha 版本），它旨在简化 KMP 库的搜索。</p>
                    <p>此 <a href="https://github.com/terrakok/kmp-awesome">列表</a> 包含一些最流行的 KMP 库和工具。</p></td>
                <td><a href="https://reactnative.dev/docs/libraries">React Native 库</a> 通常使用 Node.js 包管理器（例如
                    <a href="https://docs.npmjs.com/cli/npm">npm CLI</a> 或 <a href="https://classic.yarnpkg.com/en/">Yarn
                        Classic</a>）从 <a href="https://www.npmjs.com/">npm registry</a> 安装。
                </td>
            </tr>
            <tr>
                <td><b>构建工具</b></td>
                <td>Gradle（面向 Apple 设备的应用程序还需要 Xcode）。</td>
                <td>React Native 命令行工具和 <a href="https://metrobundler.dev/">Metro bundler</a>，它们在底层调用 Android 的 Gradle 和 iOS 的 Xcode 构建系统。
                </td>
            </tr>
            <tr>
                <td><b>目标环境</b></td>
                <td>Android、iOS、Web、桌面和服务器端。</td>
                <td>Android、iOS、Web 和桌面。
                    <p>Web 和桌面支持通过社区和合作伙伴主导的项目提供，例如 <a
                            href="https://github.com/necolas/react-native-web">React Native Web</a>、<a
                            href="https://github.com/microsoft/react-native-windows">React Native Windows</a> 和 <a
                            href="https://github.com/microsoft/react-native-macos">React Native macOS</a>。</p></td>
            </tr>
            <tr>
                <td><b>编译</b></td>
                <td>编译为桌面和 Android 的 JVM 字节码，Web 上的 JavaScript 或 Wasm，以及原生平台的平台特有二进制文件
                </td>
                <td>React Native 使用 Metro 构建 JavaScript 代码和资产。
                    <p>React Native 附带了捆绑版的 <a
                            href="https://reactnative.dev/docs/hermes">Hermes</a>，它在构建期间将 JavaScript 编译为 Hermes 字节码。React Native 还支持使用 JavaScriptCore 作为 <a
                                href="https://reactnative.dev/docs/javascript-environment">JavaScript 引擎</a>。</p>
                    <p>原生代码由 Android 上的 Gradle 和 iOS 上的 Xcode 编译。</p></td>
            </tr>
            <tr>
                <td><b>与原生 API 通信</b></td>
                <td>得益于 Kotlin 与 Swift/Objective-C 和 JavaScript 的互操作性，可以直接从 Kotlin 代码访问原生 API。
                </td>
                <td>React Native 暴露了一组 API，用于将您的原生代码连接到 JavaScript 应用程序代码：Native Modules 和 Native Components。新架构使用 <a
                        href="https://github.com/reactwg/react-native-new-architecture/blob/main/docs/turbo-modules.md">Turbo
                        Native Module</a> 和 <a
                        href="https://github.com/reactwg/react-native-new-architecture/blob/main/docs/fabric-native-components.md">Fabric
                        Native Components</a> 来实现类似的结果。
                </td>
            </tr>
            <tr>
                <td><b>UI 渲染</b></td>
                <td><a href="https://www.jetbrains.com/compose-multiplatform/">Compose Multiplatform</a> 可用于在平台间共享 UI，它基于 Google 的 Jetpack Compose，使用兼容 OpenGL、ANGLE（将 OpenGL ES 2 或 3 调用转换为原生 API）、Vulkan 和 Metal 的 Skia 引擎。
                </td>
                <td>React Native 包含一组核心的平台无关原生组件，例如 <code>View</code>、
                    <code>Text</code> 和 <code>Image</code>，它们直接映射到平台的原生 UI 构建块，例如 iOS 上的 <code>UIView</code> 和 Android 上的 <code>android.view</code>。
                </td>
            </tr>
            <tr>
                <td><b>UI 开发迭代</b></td>
                <td>即使在公共代码中也可以使用 UI 预览。
                    <p>借助 <a href="compose-hot-reload.md">Compose Hot Reload</a>，您可以即时查看 UI 更改，而无需重新启动应用程序或丢失其状态。</p></td>
                <td><a href="https://reactnative.dev/docs/fast-refresh">Fast Refresh</a> 是 React Native 的一个特性，允许您对 React 组件中的更改获得近乎即时的反馈。
                </td>
            </tr>
            <tr>
                <td><b>使用该技术的公司</b></td>
                <td>
                    <a href="https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/">Forbes</a>、
                    <a href="https://www.youtube.com/watch?v=z-o9MqN86eE">Todoist</a>、<a
                        href="https://medium.com/mcdonalds-technical-blog/mobile-multiplatform-development-at-mcdonalds-3b72c8d44ebc">McDonald's</a>、
                    <a href="https://youtu.be/5lkZj4v4-ks?si=DoW00DU7CYkaMmKc">Google Workspace</a>、<a
                        href="https://www.youtube.com/watch?v=hZPL8QqiLi8">Philips</a>、<a
                        href="https://raymondctc.medium.com/adopting-kotlin-multiplatform-mobile-kmm-on-9gag-app-dfe526d9ce04">9gag</a>、
                    <a href="https://kotlinlang.org/lp/multiplatform/case-studies/baidu">Baidu</a>、<a
                        href="https://kotlinlang.org/lp/multiplatform/case-studies/autodesk/">Autodesk</a>、<a
                        href="https://touchlab.co/">TouchLab</a>、<a href="https://www.youtube.com/watch?v=YsQ-2lQYQ8M">Instabee</a>
                    等公司均列在我们的 <a href="case-studies.topic">KMP 案例研究</a>中。</td>
                <td>Facebook、<a href="https://engineering.fb.com/2024/10/02/android/react-at-meta-connect-2024/">Instagram</a>、
                    <a href="https://devblogs.microsoft.com/react-native/">Microsoft Office</a>、<a
                            href="https://devblogs.microsoft.com/react-native/">Microsoft Outlook</a>、Amazon Shopping、
                    <a href="https://medium.com/mercari-engineering/why-we-decided-to-rewrite-our-ios-android-apps-from-scratch-in-react-native-9f1737558299">Mercari</a>、
                    Tableau、<a href="https://github.com/wordpress-mobile/gutenberg-mobile">WordPress</a>、<a
                            href="https://nearform.com/work/puma-scaling-across-the-globe/">Puma</a>、PlayStation 应用等均列在 <a href="https://reactnative.dev/showcase">React Native 展示页面</a>中。
                </td>
            </tr>
        </table>
        <p>您还可以查看 <a href="kotlin-multiplatform-flutter.md">Kotlin Multiplatform 和 Flutter</a> 的对比。</p>
    </chapter>
    <chapter title="为您的项目选择合适的跨平台技术"
             id="choosing-the-right-cross-platform-technology-for-your-project">
        <p>决定跨平台框架并非要寻找一劳永逸的解决方案，而是要根据您的项目目标、技术要求和团队专业知识来选择最合适的。无论您是正在构建具有复杂 UI 的功能丰富的产品，还是旨在利用现有技能快速发布，正确的选择将取决于您的具体优先事项。请考虑您需要对 UI 自定义有多大控制权、长期稳定性有多重要以及您计划支持哪些平台。</p>
        <p>拥有 JavaScript 经验的团队可能会发现 React Native 是一个实用的选择，尤其适用于快速原型开发。另一方面，Kotlin Multiplatform 提供了不同级别的集成：它生成完全原生的 Android 应用程序，并在 iOS 上编译为原生二进制文件，无缝访问原生 API。UI 可以是完全原生的，也可以通过 Compose Multiplatform 共享，后者使用高性能图形引擎进行精美渲染。这使得 KMP 对于那些优先考虑原生外观和感觉、可维护性以及性能，同时仍受益于代码共享的团队来说特别具有吸引力。</p>
        <p>您可以在我们关于如何为您的下一个项目选择合适的 <a
                href="cross-platform-frameworks.md">跨平台开发框架</a> 的详细文章中找到更多指导。</p>
    </chapter>
    <chapter title="常见问题" id="frequently-asked-questions">
        <p>
            <control>问：Kotlin Multiplatform 是否已为生产环境做好准备？</control>
        </p>
        <p>答：Kotlin Multiplatform 是一项 <a
                href="https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/">稳定的技术，已为生产环境做好准备</a>。
            这意味着您可以在生产环境中，甚至在最保守的使用场景中，使用 Kotlin Multiplatform 在 Android、iOS、桌面 (JVM)、服务器端 (JVM) 和 Web 之间共享代码。</p>
        <p>Compose Multiplatform 是一个用于跨平台构建共享 UI 的框架（由 Kotlin Multiplatform
            和 Google 的 Jetpack Compose 提供支持），在 iOS、Android 和桌面端已稳定。Web 支持目前处于
            Beta 阶段。</p>
        <p>如果您想了解更多关于 Kotlin Multiplatform 的总体发展方向，请参阅我们的博客文章《<a href="https://blog.jetbrains.com/kotlin/2025/08/kmp-roadmap-aug-2025/">Kotlin Multiplatform 和 Compose Multiplatform 的未来发展</a>》。</p>
        <p>
            <control>问：Kotlin Multiplatform 比 React Native 更好吗？</control>
        </p>
        <p>答：Kotlin Multiplatform 和 React Native 各有优势，选择哪一个取决于您的项目的具体目标、技术要求和团队专业知识。在上面的对比中，我们概述了代码共享、构建工具、编译和生态系统等方面的关键区别，以帮助您决定哪个选项最适合您的用例。</p>
        <p>
            <control>问：Google 是否支持 Kotlin Multiplatform？</control>
        </p>
        <p>答：在 Google I/O 2024 大会上，Google 宣布 <a
                href="https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html">官方支持在 Android 上使用 Kotlin Multiplatform</a>，以便在 Android 和 iOS 之间共享业务逻辑。</p>
        <p>
            <control>问：学习 Kotlin Multiplatform 值得吗？</control>
        </p>
        <p>答：如果您有兴趣在保留原生性能和灵活性的同时，在 Android、iOS、桌面和 Web 之间共享代码，那么 Kotlin Multiplatform 值得学习。它由 JetBrains 提供支持，并得到 Google 在 Android 上的官方支持，以在 Android 和 iOS 之间共享业务逻辑。更重要的是，结合 Compose Multiplatform 的 KMP 正日益被构建多平台应用程序的公司在生产环境中采用。
        </p>
    </chapter>
</topic>