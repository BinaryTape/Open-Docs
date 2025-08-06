# Kotlin Multiplatform 和 Flutter：跨平台开发解决方案

<web-summary>本文探讨了 Kotlin Multiplatform 和 Flutter，帮助你了解它们的功能并为你的跨平台项目选择最合适的方案。</web-summary> 

在技术飞速发展的世界中，开发者不断寻求高效的框架和工具来构建高质量的应用程序。然而，在可用的选项中进行选择时，重要的是要避免过分强调寻找所谓的最佳选择，因为这种方法可能不总是能带来最合适的选择。

每个项目都是独一无二的，并有特定的要求。本文旨在帮助你理清思路，更好地理解哪种技术（例如 Kotlin Multiplatform 或 Flutter）最适合你的项目，以便你做出明智的决策。

## 跨平台开发：现代应用程序构建的统一方法

跨平台开发提供了一种方法，可以使用单一代码库构建可在多个平台上运行的应用程序，从而无需为每个系统重写相同的功能。虽然这通常与[移动开发](cross-platform-mobile-development.md)相关联——同时面向 Android 和 iOS——但这种方法远远超出了移动领域，涵盖了 web、桌面甚至服务器端环境。

其核心思想是最大限度地重用代码，同时确保在必要时仍能实现平台特有的特性，从而简化开发流程并减少维护工作。团队可以加快开发周期、降低成本并确保跨平台的一致性，这使得跨平台开发成为当今日益多样化的应用程序格局中的明智选择。

## Kotlin Multiplatform 和 Flutter：简化跨平台开发

Flutter 和 Kotlin Multiplatform 是两种流行的跨平台技术，它们简化了跨不同平台的应用程序开发。

### Flutter

[Flutter](https://flutter.dev/) 是一个开源框架，用于从单一代码库构建原生编译的多平台应用程序。它允许你通过一个共享的应用程序代码库，在 Android、iOS、web、桌面（Windows、macOS、Linux）和嵌入式系统上创建丰富的应用体验。Flutter 应用使用 Dart 编程语言编写。Flutter 由 Google 提供支持和使用。

Flutter 于 2014 年首次推出，当时名为 Sky，[Flutter 1.0](https://developers.googleblog.com/en/flutter-10-googles-portable-ui-toolkit/) 于 2018 年 12 月在 Flutter Live 期间正式发布。

Flutter 开发者社区庞大且高度活跃，提供持续的改进和支持。Flutter 允许使用 Flutter 和 Dart 生态系统内开发者贡献的共享包。

### Kotlin Multiplatform

[Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/) (KMP) 是由 JetBrains 构建的开源技术，它允许开发者为 Android、iOS、web、桌面（Windows、macOS、Linux）和服务器端创建应用程序，使他们能够有效地在这些平台间重用 Kotlin 代码，同时保留原生编程的优势。

使用 Kotlin Multiplatform，你有多种选择：你可以共享除应用入口点之外的所有代码，共享一个独立的逻辑单元（如网络或数据库模块），或者共享业务逻辑同时保持 UI 原生。

![Kotlin Multiplatform 是一种可重用多达 100% 代码的技术](kmp-logic-and-ui.svg){ width="700" }

Kotlin Multiplatform 于 2017 年作为 Kotlin 1.2 的一部分首次推出。2023 年 11 月，Kotlin Multiplatform 成为[稳定版](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)。在 Google I/O 2024 期间，Google 宣布其[支持 Kotlin Multiplatform](https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html) 在 Android 上共享 Android 和 iOS 之间的业务逻辑。

[![探索 Kotlin Multiplatform](discover-kmp.svg){width="500"}](https://www.jetbrains.com/kotlin-multiplatform/)

#### Compose Multiplatform

你可以使用 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/) 编写跨多个平台的共享 UI 代码，这是一个由 JetBrains 开发的现代声明式框架，它基于 Kotlin Multiplatform 和 Google 的 Jetpack Compose 构建。

Compose Multiplatform 目前在 [iOS 上已稳定](https://blog.jetbrains.com/kotlin/2025/05/compose-multiplatform-1-8-0-released-compose-multiplatform-for-ios-is-stable-and-production-ready/)，Android 和桌面也已稳定，并在 web 上处于 Alpha 阶段。

[![探索 Compose Multiplatform](explore-compose.svg){width="500"}](https://www.jetbrains.com/compose-multiplatform/)

我们的专门文章概述了 [Compose Multiplatform 和 Jetpack Compose](compose-multiplatform-and-jetpack-compose.md) 之间的关系，强调了主要区别。

### Kotlin Multiplatform 和 Flutter：概述

<table style="both">
    <tr>
        <td></td>
        <td><b>Kotlin Multiplatform</b></td>
        <td><b>Flutter</b></td>
    </tr>
    <tr>
        <td><b>创建者</b></td>
        <td>JetBrains</td>
        <td>Google</td>
    </tr>
    <tr>
        <td><b>语言</b></td>
        <td>Kotlin</td>
        <td>Dart</td>
    </tr>
    <tr>
        <td><b>灵活性与代码重用</b></td>
        <td>按需共享代码库的任何部分，包括业务逻辑和/或 UI，从 1% 到 100% 不等。</td>
        <td>控制应用程序的每个像素，创建定制化和自适应的设计，在所有平台间实现 100% 的代码共享。</td>
    </tr>
    <tr>
        <td><b>包、依赖项与生态系统</b></td>
        <td>包可从 <a href="https://central.sonatype.com/">Maven Central</a> 和其他版本库获取，包括
            <p><a href="http://klibs.io">klibs.io</a>（Alpha 版），旨在简化 KMP 库的搜索。</p>
            <p><a href="https://github.com/terrakok/kmp-awesome">此列表</a>包含一些最流行的 KMP 库和工具。</p> </td>
        <td>包可从 <a href="https://pub.dev/">Pub.dev</a> 获取。</td>
    </tr>
    <tr>
        <td><b>构建工具</b></td>
        <td>Gradle（针对 Apple 设备的应用还需 Xcode）。</td>
        <td>Flutter 命令行工具（底层使用 Gradle 和 Xcode）。</td>
    </tr>
    <tr>
        <td><b>代码共享</b></td>
        <td>Android、iOS、web、桌面和服务器端。</td>
        <td>Android、iOS、web、桌面和嵌入式设备。</td>
    </tr>
    <tr>
        <td><b>编译</b></td>
        <td>针对桌面和 Android 编译为 JVM 字节码，针对 web 编译为 JavaScript 或 Wasm，针对原生平台编译为平台特有的二进制文件。</td>
        <td>调试构建在虚拟机中运行 Dart 代码。
        <p>发布构建为原生平台输出平台特有的二进制文件，为 web 输出 JavaScript/Wasm。</p>
        </td>
    </tr>
    <tr>
        <td><b>与原生 API 的通信</b></td>
        <td>原生 API 可通过 Kotlin 代码使用 <a href="multiplatform-expect-actual.md">expect/actual 声明</a>直接访问。</td>
        <td>可使用 <a href="https://docs.flutter.dev/platform-integration/platform-channels">平台通道</a>与宿主平台进行通信。</td>
    </tr>
    <tr>
        <td><b>UI 渲染</b></td>
        <td><a href="https://www.jetbrains.com/compose-multiplatform/">Compose Multiplatform</a> 可用于跨平台共享 UI，它基于 Google 的 Jetpack Compose 构建，使用兼容 OpenGL、ANGLE（将 OpenGL ES 2 或 3 调用转换为原生 API）、Vulkan 和 Metal 的 Skia 引擎。</td>
        <td>Flutter 部件使用自定义的 <a href="https://docs.flutter.dev/perf/impeller">Impeller 引擎</a>在屏幕上渲染，该引擎根据平台和设备，直接使用 Metal、Vulkan 或 OpenGL 与 GPU 通信。</td>
    </tr>
    <tr>
        <td><b>UI 开发迭代</b></td>
        <td>UI 预览甚至可从公共代码中获得。
        <p>借助 <a href="compose-hot-reload.md">Compose 热重载</a>，你可以即时查看 UI 更改，而无需重启应用或丢失其状态。</p></td>
        <td>VS Code 和 Android Studio 提供了 IDE 插件。</td>
    </tr>
    <tr>
        <td><b>使用该技术的公司</b></td>
        <td><a href="https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/">Forbes</a>、<a href="https://www.youtube.com/watch?v=z-o9MqN86eE">Todoist</a>、<a href="https://medium.com/mcdonalds-technical-blog/mobile-multiplatform-development-at-mcdonalds-3b72c8d44ebc">McDonald’s</a>、<a href="https://www.youtube.com/watch?v=5sOXv-X43vc">Google Workspace</a>、<a href="https://www.youtube.com/watch?v=hZPL8QqiLi8">Philips</a>、<a href="https://raymondctc.medium.com/adopting-kotlin-multiplatform-mobile-kmm-on-9gag-app-dfe526d9ce04">9gag</a>、<a href="https://kotlinlang.org/lp/multiplatform/case-studies/baidu">Baidu</a>、<a href="https://kotlinlang.org/lp/multiplatform/case-studies/autodesk/">Autodesk</a>、<a href="https://touchlab.co/">TouchLab</a>、<a href="https://www.youtube.com/watch?v=YsQ-2lQYQ8M">Instabee</a> 等更多内容列在我们的 <a href="case-studies.topic">KMP 案例研究</a>中。</td>
        <td><a href="https://flutter.dev/showcase/xiaomi">Xiaomi</a>、<a href="https://flutter.dev/showcase/wolt">Wolt</a>、<a href="https://flutter.dev/showcase/universal-studios">Universal Studios</a>、<a href="https://flutter.dev/showcase/alibaba-group">Alibaba Group</a>、<a href="https://flutter.dev/showcase/bytedance">ByteDance</a>、<a href="https://www.geico.com/techblog/flutter-as-the-multi-channel-ux-framework/">Geico</a>、<a href="https://flutter.dev/showcase/ebay">eBay Motors</a>、<a href="https://flutter.dev/showcase/google-pay">Google Pay</a>、<a href="https://flutter.dev/showcase/so-vegan">So Vegan</a> 等更多内容列在 <a href="https://flutter.dev/showcase">Flutter 案例展示</a>中。</td>
    </tr>
</table>

[![探索全球公司利用 Kotlin Multiplatform 进行跨平台开发的真实用例。](kmp-use-cases-1.svg){width="500"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/case-studies.html)

你还可以查阅 Google 的博客文章《[让开发者更容易进行跨平台开发](https://developers.googleblog.com/en/making-development-across-platforms-easier-for-developers/)》，其中提供了关于为项目选择合适技术栈的指导。

如果你正在寻找 Kotlin Multiplatform 和 Flutter 之间的更多比较，你也可以观看 Philipp Lackner 的[KMP 与 Flutter 视频](https://www.youtube.com/watch?v=dzog64ENKG0)。在该视频中，他分享了关于这些技术在代码共享、UI 渲染、性能以及两种技术未来方面的一些有趣观察。

通过仔细评估你的特定业务需求、目标和任务，你可以确定最能满足你要求的跨平台解决方案。