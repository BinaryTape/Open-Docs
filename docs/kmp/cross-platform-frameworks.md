[//]: # (title: 六款最受欢迎的跨平台应用开发框架)

[//]: # (description:本文介绍了六款最受欢迎的跨平台应用开发框架，并解释了为项目选择跨平台工具时需要考虑的关键因素。)

多年来，跨平台应用开发已成为构建移动应用程序最流行的方式之一。
跨平台（或多平台）方法允许开发者创建能在不同移动平台上类似运行的应用。

从 2010 年至今，这种兴趣稳步增长，如这张 Google Trends 图表所示：

![Google Trends 图表，展示了人们对跨平台应用开发的兴趣](google-trends-cross-platform.png){width=700}

快速发展的[跨平台移动开发](cross-platform-mobile-development.md#kotlin-multiplatform)技术日益普及，这导致市场上出现了许多新工具。
面对众多可用选项，选择最适合您需求的工具可能具有挑战性。
为了帮助您找到合适的工具，我们整理了一份包含六款最佳跨平台应用开发框架及其卓越特性的列表。
在本文末尾，您还将找到一些在为您的业务选择多平台开发框架时需要注意的关键事项。

## 什么是跨平台应用开发框架？

移动工程师使用跨平台移动开发框架，通过单一代码库为多个平台（例如 Android 和 iOS）构建具有原生外观的应用程序。
可共享代码是这种方法相对于原生应用开发的关键优势之一。
拥有一个单一的代码库意味着移动工程师可以节省时间，因为他们无需为每个操作系统编写代码，从而加速了开发过程。

## 流行的跨平台应用开发框架

此列表并非详尽无遗；目前市场上还有许多其他选项。重要的是要认识到，
没有一刀切的工具能完美适用于所有人。
框架的选择在很大程度上取决于您的特定项目和目标，以及我们将在文章末尾介绍的其他具体因素。

尽管如此，我们还是尝试挑选出一些最佳的跨平台移动开发框架，以便为您提供决策的起点。

### Flutter

Flutter 由 Google 于 2017 年发布，是一个流行的框架，用于从单一代码库构建移动、Web 和桌面应用。
要使用 Flutter 构建应用程序，您需要使用 Google 的编程语言 Dart。

**编程语言：** Dart。

**移动应用示例：** eBay Motors、阿里巴巴、Google Pay、字节跳动应用。

**主要特性：**

*   Flutter 的 hot reload 特性允许您在修改代码后立即看到应用程序的变化，
    而无需重新编译。
*   Flutter 支持 Google 的 Material Design，这是一个设计系统，可帮助开发者构建数字体验。
    在构建应用时，您可以使用多种视觉和行为 widget。
*   Flutter 不依赖于 Web 浏览器技术。相反，它拥有自己的渲染引擎来绘制 widget。

Flutter 在全球拥有相对活跃的用户社区，并被许多开发者广泛使用。
根据 [Stack Overflow Trends](https://insights.stackoverflow.com/trends?tags=flutter%2Creact-native) 的数据，Flutter 的使用量随着对应标签使用量的增加而呈上升趋势。

> 深入了解 [Kotlin Multiplatform 和 Flutter](kotlin-multiplatform-flutter.md)，以理解它们的优势，并为您的跨平台开发选择最合适的。
>
{style="note"}

### React Native

React Native 是一个开源 UI 软件框架，由 Meta Platforms（前身为 Facebook）于 2015 年开发（比 Flutter 稍早）。它基于 Facebook 的 JavaScript 库 React，允许开发者构建原生渲染的跨平台移动应用。

**编程语言：** JavaScript。

**移动应用示例：** React Native 用于 Microsoft 的 Office、Skype 和 Xbox Game Pass；Meta 的 Facebook、桌面 Messenger 和 Oculus。更多信息请查看 [React Native 展示页](https://reactnative.dev/showcase)。

**主要特性：**

*   得益于 Fast Refresh 特性，开发者可以立即看到其 React 组件中的变化。
*   React Native 的优势之一是专注于 UI。React 基元渲染到原生平台 UI 组件，使您能够构建自定义且响应迅速的用户界面。
*   在 0.62 及更高版本中，React Native 与移动应用调试器 Flipper 之间的集成默认启用。Flipper 用于调试 Android、iOS 和 React Native 应用，它提供了日志查看器、交互式布局探查器和网络探查器等工具。

作为最受欢迎的跨平台应用开发框架之一，React Native 拥有一个庞大而强大的开发者社区，他们分享技术知识。得益于这个社区，您在用该框架构建移动应用时可以获得所需的支持。

### Kotlin Multiplatform

Kotlin Multiplatform (KMP) 是由 JetBrains 构建的一项开源技术，它允许跨平台共享代码，同时保留原生编程的优势。它使开发者能够根据需要尽可能多地重用代码，并在需要时编写原生代码，将共享的 Kotlin 代码无缝集成到任何项目中。

**编程语言：** Kotlin。

**移动应用示例：** McDonald's、Netflix、Forbes、9GAG、Cash App、Philips。[阅读更多关于 Kotlin Multiplatform 案例研究](case-studies.topic)。

**主要特性：**

*   开发者可以在 Android、iOS、Web、桌面和服务器端重用代码，并在需要时保留原生代码。
*   Kotlin Multiplatform 可以无缝集成到任何项目中。开发者可以利用平台特有的 API，同时最大限度地利用原生和跨平台开发。
*   得益于 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)（JetBrains 现代声明式跨平台 UI 框架），开发者拥有完全的代码共享灵活性，并能够共享逻辑和 UI。
*   当您已经在 Android 上使用 Kotlin 时，无需在代码库中引入新语言。您可以重用您的 Kotlin 代码和专业知识，这使得迁移到 Kotlin Multiplatform 的风险比其他技术低。

尽管这款跨平台移动开发框架是我们列表中最年轻的框架之一，但它拥有一个成熟的社区。2023 年 11 月，JetBrains 将其推广为[稳定版](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)。它正在快速发展，并已在当今市场留下独特的印象。得益于其定期更新的[文档](get-started.topic)和社区支持，您总能找到问题的答案。更重要的是，许多[全球公司和初创企业已经使用 Kotlin Multiplatform](case-studies.topic) 来开发具有原生用户体验的多平台应用。

[![开始您的 Kotlin Multiplatform 之旅](kmp-journey-start.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)

### Ionic

Ionic 是一个开源移动 UI 工具包，于 2013 年发布。它帮助开发者使用 HTML、CSS 和 JavaScript 等 Web 技术，并集成 Angular、React 和 Vue 框架，从单一代码库构建跨平台移动应用程序。

**编程语言：** JavaScript。

**移动应用示例：** T-Mobile、BBC (儿童和教育应用)、EA Games。

**主要特性：**

*   Ionic 基于专为移动操作系统设计的 SaaS UI 框架，并为构建应用程序提供了多个 UI 组件。
*   Ionic 框架使用 Cordova 和 Capacitor 插件来提供对设备内置特性（如相机、手电筒、GPS 和录音机）的访问。
*   Ionic 拥有自己的命令行界面 Ionic CLI，它是构建 Ionic 应用程序的首选工具。

Ionic 框架论坛上活动持续不断，社区成员在此交流知识并互相帮助克服开发挑战。

### .NET MAUI

.NET Multi-platform App UI (.NET MAUI) 是一个跨平台框架，于 2022 年 5 月发布，由 Microsoft 所有。它允许开发者使用 C# 和 XAML 创建原生移动和桌面应用。.NET MAUI 是 Xamarin.Forms 的演进版本，Xamarin.Forms 是 Xamarin 的功能之一，为 Xamarin 支持的平台提供了原生控件。

**编程语言：** C#、XAML。

**移动应用示例：** NBC Sports Next、Escola Agil、Irth Solutions。

**主要特性：**

*   .NET MAUI 提供了用于访问原生设备特性（如 GPS、加速度计以及电池和网络状态）的跨平台 API。
*   存在一个单一的项目系统，通过多目标定位 (multi-targeting) 来实现对 Android、iOS、macOS 和 Windows 的支持。
*   借助 .NET hot reload 的支持，开发者可以在应用运行时修改其托管源代码。

尽管 .NET MAUI 仍然是一个相对较新的框架，但它已在开发者中获得吸引力，并在 Stack Overflow 和 Microsoft Q&A 上拥有活跃社区。

### NativeScript

这个开源移动应用程序开发框架最初于 2014 年发布。NativeScript 允许您使用 JavaScript 或可转译为 JavaScript 的语言（如 TypeScript），以及 Angular 和 Vue.js 等框架，来构建 Android 和 iOS 移动应用。

**编程语言：** JavaScript、TypeScript。

**移动应用示例：** Daily Nanny、Strudel、Breethe。

**主要特性：**

*   NativeScript 允许开发者轻松访问原生 Android 和 iOS API。
*   该框架渲染平台原生 UI。使用 NativeScript 构建的应用直接在原生设备上运行，而不依赖于 WebViews（Android 操作系统的系统组件，允许 Android 应用程序在应用内显示 Web 内容）。
*   NativeScript 提供了各种插件和预构建应用模板，无需第三方解决方案。

NativeScript 基于 JavaScript 和 Angular 等知名 Web 技术，这也是许多开发者选择此框架的原因。然而，它通常被小型公司和初创企业使用。

## 如何为您的项目选择合适的跨平台应用开发框架？

除了上面提到的框架之外，还有其他跨平台框架，并且新工具将继续出现在市场上。面对如此多的选择，您如何为下一个项目找到合适的工具？第一步是了解您项目的需求和目标，并清楚地了解您未来的应用应该是什么样子。接下来，您需要考虑以下重要因素，以便为您的业务选择最合适的方案。

#### 1. 团队的专业知识

不同的跨平台移动开发框架基于不同的编程语言。在采用框架之前，请检查它所需的技能，并确保您的移动工程师团队拥有足够的知识和经验来使用它。

例如，如果您的团队拥有技术精湛的 JavaScript 开发者，并且您没有足够的资源来引入新技术，那么选择使用 JavaScript 语言的框架（如 React Native）可能更值得。

#### 2. 供应商可靠性和支持

确保框架的维护者会长期支持它非常重要。了解更多开发和支持您正在考虑的框架的公司，并查看使用它们构建的移动应用。

#### 3. UI 定制

根据用户界面对您未来应用的重要性，您可能需要了解使用特定框架定制 UI 的便捷程度。例如，Kotlin Multiplatform 提供了完全的代码共享灵活性，其 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) 是 JetBrains 推出的一款现代声明式跨平台 UI 框架。它使开发者能够在 Android、iOS、Web 和桌面（通过 JVM）之间共享 UI，并且基于 Kotlin 和 Jetpack Compose。

[![探索 Compose Multiplatform](explore-compose.svg){width="700"}](https://www.jetbrains.com/compose-multiplatform/)

#### 4. 框架成熟度

了解潜在框架的公共 API 和工具链的更改频率。例如，对原生操作系统组件的一些更改会破坏内部跨平台行为。最好了解在使用移动应用开发框架时可能面临的挑战。您还可以浏览 GitHub，检查框架有多少 Bug 以及这些 Bug 如何处理。

#### 5. 框架能力

每个框架都有其自身的能力和局限性。了解框架提供的特性和工具对于为您识别最佳解决方案至关重要。它是否具有代码分析器和单元测试框架？您构建、调试和测试应用的速度和便捷程度如何？

#### 6. 安全性

当为业务构建关键移动应用程序时，例如包含支付系统的银行和电子商务应用，安全性与隐私尤其重要。根据 [OWASP Mobile Top 10](https://owasp.org/www-project-mobile-top-10/)，移动应用程序最关键的安全风险包括不安全数据存储和认证/授权。

您需要确保所选择的多平台移动开发框架提供了所需的安全级别。一种方法是浏览框架问题跟踪器（如果它公开可用）上的安全票据。

#### 7. 教育材料

关于框架的可用学习资源的数量和质量也可以帮助您了解使用它时的体验将有多顺畅。全面的官方[文档](get-started.topic)、线上和线下会议以及教育课程都是很好的迹象，表明您在需要时能够找到足够多的关于产品的重要信息。

## 核心要点

不考虑这些因素，很难选择最能满足您特定需求的跨平台移动开发框架。仔细研究您未来的应用程序需求，并根据各种框架的能力进行权衡。这样做将使您能够找到合适的跨平台解决方案，帮助您交付高质量的应用。