# Kotlin Multiplatform 和 Flutter：跨平台开发解决方案

<web-summary>本文探讨了 Kotlin Multiplatform 和 Flutter，旨在帮助您了解它们的能力，并为您的跨平台项目选择最适合的方案。</web-summary> 

在技术飞速发展的世界中，开发者们不断寻求高效的框架和工具，以帮助他们构建高质量的应用程序。然而，在可用的选项中进行选择时，重要的是避免过分强调寻找所谓的“最佳”方案，因为这种方法不一定总能带来最合适的选择。

每个项目都是独一无二的，并有其特定要求。本文旨在帮助您权衡选择，更好地理解哪种技术（例如 Kotlin Multiplatform 或 Flutter）最适合您的项目，从而做出明智的决策。

## 跨平台开发：现代应用程序构建的统一方法

跨平台开发提供了一种使用单一代码库构建可在多个平台运行的应用程序的方式，从而无需为每个系统重复编写相同的功能性。虽然通常与[移动开发](cross-platform-mobile-development.md)相关联——面向 Android 和 iOS——但这种方法远超移动领域，涵盖了 Web、桌面甚至服务器端环境。

其核心思想是最大限度地复用代码，同时确保在必要时仍能实现平台特有的特性，从而简化开发流程并减少维护工作。团队可以加快开发周期、降低成本，并确保跨平台的一致性，使得跨平台开发在当今日益多样化的应用程序生态中成为一个明智的选择。

## Kotlin Multiplatform 和 Flutter：简化跨平台开发

Flutter 和 Kotlin Multiplatform 是两种流行的跨平台技术，它们简化了跨不同平台的应用程序开发。

### Flutter

[Flutter](https://flutter.dev/) 是一个开源框架，用于从单一代码库构建原生编译的多平台应用程序。它允许您通过一个共享的应用代码库，在 Android、iOS、Web、桌面（Windows、macOS、Linux）和嵌入式系统上创建丰富的应用体验。Flutter 应用使用 Dart 编程语言编写。Flutter 受到 Google 的支持和使用。

Flutter 于 2014 年以 Sky 的名称首次推出，[Flutter 1.0](https://developers.googleblog.com/en/flutter-10-googles-portable-ui-toolkit/) 则在 2018 年 12 月的 Flutter Live 期间正式发布。

Flutter 开发者社区庞大且高度活跃，提供持续的改进和支持。Flutter 允许使用 Flutter 和 Dart 生态系统内开发者贡献的共享软件包。

### Kotlin Multiplatform

[Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/) (KMP) 是由 JetBrains 构建的一项开源技术，它允许开发者为 Android、iOS、Web、桌面（Windows、macOS、Linux）和服务器端创建应用程序，使他们能够高效地在这些平台之间复用 Kotlin 代码，同时保留原生编程的优势。

使用 Kotlin Multiplatform，您有多种选择：您可以共享除应用程序入口点之外的所有代码，共享单一逻辑（例如网络或数据库模块），或者共享业务逻辑同时保持 UI 原生。

![Kotlin Multiplatform 是一种可以复用高达 100% 代码的技术](kmp-logic-and-ui.svg){ width="700" }

Kotlin Multiplatform 于 2017 年作为 Kotlin 1.2 的一部分首次推出。2023 年 11 月，Kotlin Multiplatform 达到稳定版本。在 Google I/O 2024 期间，Google 宣布其[支持 Kotlin Multiplatform](https://android-developers.googleblog.com/2024/05/android-support-for-kotlin-multiplatform-to-share-business-logic-across-mobile-web-server-desktop.html) 在 Android 上共享 Android 和 iOS 之间的业务逻辑。

如果您想了解 Kotlin Multiplatform 的总体发展方向，请查阅我们的博客文章：[Kotlin Multiplatform 和 Compose Multiplatform 的未来展望](https://blog.jetbrains.com/kotlin/2025/08/kmp-roadmap-aug-2025/)。

[![探索 Kotlin Multiplatform](discover-kmp.svg){width="500"}](https://www.jetbrains.com/kotlin-multiplatform/)

#### Compose Multiplatform

您可以使用 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/) 在多个平台之间编写共享 UI 代码，它是 JetBrains 基于 Kotlin Multiplatform 和 Google 的 Jetpack Compose 构建的现代声明式框架。

Compose Multiplatform 目前在 [iOS](https://blog.jetbrains.com/kotlin/2025/05/compose-multiplatform-1-8-0-released-compose-multiplatform-for-ios-is-stable-and-production-ready/)、Android 和桌面端已稳定，在 Web 端处于 Beta 阶段。

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
<td><b>灵活性和代码复用</b></td>
        <td>您可以共享代码库的任何部分，包括业务逻辑和/或 UI，从 1% 到 100%。</td>
        <td>控制应用程序的每个像素，以创建定制和自适应设计，并在所有平台之间实现 100% 的代码共享。</td>
</tr>

    
<tr>
<td><b>软件包、依赖项和生态系统</b></td>
        <td>软件包可从 <a href="https://central.sonatype.com/">Maven Central</a> 和其他版本库获取，包括
            <p><a href="http://klibs.io">klibs.io</a> (Alpha 版本)，它旨在简化 KMP 库的搜索。</p>
            <p>此<a href="https://github.com/terrakok/kmp-awesome">列表</a>包含一些最流行的 KMP 库和工具。</p> </td>
        <td>软件包可从 <a href="https://pub.dev/">Pub.dev。</a></td>
</tr>

    
<tr>
<td><b>构建工具</b></td>
        <td>Gradle（加上 Xcode 用于面向 Apple 设备的应用程序）。</td>
        <td>Flutter 命令行工具（底层使用 Gradle 和 Xcode）。</td>
</tr>

    
<tr>
<td><b>代码共享</b></td>
        <td>Android、iOS、Web、桌面和服务器端。</td>
        <td>Android、iOS、Web、桌面和嵌入式设备。</td>
</tr>

    
<tr>
<td><b>编译</b></td>
        <td>编译为桌面和 Android 的 JVM 字节码，Web 上的 JavaScript 或 Wasm，以及原生平台的平台特有二进制文件。</td>
        <td>调试构建在虚拟机中运行 Dart 代码。
        <p>发布构建输出原生平台的平台特有二进制文件，以及 Web 的 JavaScript/Wasm。</p>
        </td>
</tr>

    
<tr>
<td><b>与原生 API 通信</b></td>
        <td>原生 API 可使用 <Links href="/kmp/multiplatform-expect-actual" summary="undefined">expect/actual 声明</Links> 直接从 Kotlin 代码访问。</td>
        <td>可以使用<a href="https://docs.flutter.dev/platform-integration/platform-channels">平台通道</a>与主机平台进行通信。</td>
</tr>

    
<tr>
<td><b>UI 渲染</b></td>
        <td><a href="https://www.jetbrains.com/compose-multiplatform/">Compose Multiplatform</a> 可用于跨平台共享 UI，它基于 Google 的 Jetpack Compose，使用兼容 OpenGL、ANGLE（将 OpenGL ES 2 或 3 调用转换为原生 API）、Vulkan 和 Metal 的 Skia 引擎。</td>
        <td>Flutter 部件使用自定义的 <a href="https://docs.flutter.dev/perf/impeller">Impeller 引擎</a>在屏幕上渲染，该引擎根据平台和设备，使用 Metal、Vulkan 或 OpenGL 直接与 GPU 通信。</td>
</tr>

    
<tr>
<td><b>UI 开发迭代</b></td>
        <td>UI 预览甚至可从公共代码中获取。
        <p>借助 <Links href="/kmp/compose-hot-reload" summary="undefined">Compose 热重载</Links>，您可以即时查看 UI 更改，而无需重启应用或丢失其状态。</p></td>
        <td>VS Code 和 Android Studio 均提供 IDE 插件。</td>
</tr>

    
<tr>
<td><b>使用该技术的公司</b></td>
        <td><a href="https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/">Forbes</a>、<a href="https://www.youtube.com/watch?v=z-o9MqN86eE">Todoist</a>、<a href="https://medium.com/mcdonalds-technical-blog/mobile-multiplatform-development-at-mcdonalds-3b72c8d44ebc">McDonald’s</a>、<a href="https://www.youtube.com/watch?v=5sOXv-X43vc">Google Workspace</a>、<a href="https://www.youtube.com/watch?v=hZPL8QqiLi8">Philips</a>、<a href="https://raymondctc.medium.com/adopting-kotlin-multiplatform-mobile-kmm-on-9gag-app-dfe526d9ce04">9gag</a>、<a href="https://kotlinlang.org/lp/multiplatform/case-studies/baidu">Baidu</a>、<a href="https://kotlinlang.org/lp/multiplatform/case-studies/autodesk/">Autodesk</a>、<a href="https://touchlab.co/">TouchLab</a>、<a href="https://www.youtube.com/watch?v=YsQ-2lQYQ8M">Instabee</a>，更多内容请参见我们的 <Links href="/kmp/case-studies" summary="undefined">KMP 案例研究</Links>。</td>
        <td><a href="https://flutter.dev/showcase/xiaomi">Xiaomi</a>、<a href="https://flutter.dev/showcase/wolt">Wolt</a>、<a href="https://flutter.dev/showcase/universal-studios">Universal Studios</a>、<a href="https://flutter.dev/showcase/alibaba-group">Alibaba Group</a>、<a href="https://flutter.dev/showcase/bytedance">ByteDance</a>、<a href="https://www.geico.com/techblog/flutter-as-the-multi-channel-ux-framework/">Geico</a>、<a href="https://flutter.dev/showcase/ebay">eBay Motors</a>、<a href="https://flutter.dev/showcase/google-pay">Google Pay</a>、<a href="https://flutter.dev/showcase/so-vegan">So Vegan</a>，更多内容请参见 <a href="https://flutter.dev/showcase">Flutter 展示页面。</a></td>
</tr>

</table>

[![探索全球公司利用 Kotlin Multiplatform 进行跨平台开发的真实用例。](kmp-use-cases-1.svg){width="500"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/case-studies.html)

您还可以查看 Google 的博客文章[《让开发者更轻松地进行跨平台开发》](https://developers.googleblog.com/en/making-development-across-platforms-easier-for-developers/)，其中提供了关于为您的项目选择正确技栈的指导。

如果您正在寻找 Kotlin Multiplatform 和 Flutter 之间的额外比较，您还可以观看 Philipp Lackner 的[《KMP vs. Flutter》视频](https://www.youtube.com/watch?v=dzog64ENKG0)。在该视频中，他就代码共享、UI 渲染、性能以及这两种技术的未来等方面分享了一些有趣的见解。

通过仔细评估您的特定业务需求、目标和任务，您可以确定最符合您要求的跨平台解决方案。