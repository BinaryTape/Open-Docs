[//]: # (title: 什么是跨平台移动开发？)

<web-summary>跨平台移动开发可以帮助您节省大量的时间和精力。了解为什么许多开发者已经转向这种具有成本效益的技术。</web-summary>

如今，许多公司面临着需要为多个平台（特别是 Android 和 iOS）构建移动应用的挑战。这就是为什么跨平台移动开发解决方案已成为最受欢迎的软件开发趋势之一的原因。

根据 Statista 的数据，2022 年第三季度，Google Play 商店有 355 万个移动应用，App Store 有 160 万个应用，Android 和 iOS 共同占据了[全球移动操作系统市场 99% 的份额](https://gs.statcounter.com/os-market-share/mobile/worldwide)。

您如何创建一个能够触达 Android 和 iOS 受众的移动应用？在本文中，您将了解到为什么越来越多的移动工程师选择跨平台（或多平台）移动开发方法。

## 跨平台移动开发：定义与解决方案

多平台移动开发是一种允许您构建可在多个操作系统上顺畅运行的单个移动应用程序的方法。在跨平台应用中，部分甚至全部源代码都可以共享。这意味着开发者可以创建并部署在 Android 和 iOS 上都能运行的移动资产，而无需为每个单独的平台重新编写代码。

### 移动应用开发的不同方法

为 Android 和 iOS 创建应用主要有四种方式。

#### 1. 为每个操作系统开发独立的原生应用

在创建原生应用时，开发者针对特定的操作系统构建应用程序，并依赖专门为一个平台设计的工具和编程语言：Android 使用 Kotlin 或 Java，iOS 使用 Objective-C 或 Swift。

这些工具和语言让您可以访问特定操作系统的功能和能力，并允许您打造具有直观界面的响应式应用。但如果您想触达 Android 和 iOS 受众，则必须创建单独的应用程序，这需要花费大量的时间和精力。

#### 2. 渐进式 Web 应用 (PWA)

渐进式 Web 应用将移动应用的功能与 Web 开发中使用的解决方案相结合。粗略地说，它们提供了网站和移动应用的混合体。开发者使用 JavaScript、HTML、CSS 和 WebAssembly 等 Web 技术构建 PWA。

Web 应用程序不需要单独的打包或分发，可以在线发布。它们可以通过计算机、智能手机和平板电脑上的浏览器访问，不需要通过 Google Play 或 App Store 安装。

这里的缺点是用户在使用应用时无法利用其设备的所有功能（如联系人、日历、电话和其他资产），从而导致用户体验受限。在应用性能方面，原生应用占据领先地位。

#### 3. 跨平台应用

如前所述，多平台应用旨在不同移动平台上的运行效果完全相同。跨平台框架允许您为了开发此类应用而编写可共享和可复用的代码。

这种方法有几个好处，例如在时间和成本方面的高效性。我们将在后面的章节中详细介绍跨平台移动开发的优缺点。

#### 4. 混合应用

在浏览网站和论坛时，您可能会注意到有些人交替使用 *“跨平台移动开发”* 和 *“混合移动开发”* 这两个术语。然而，这样做并不完全准确。

对于跨平台应用，移动工程师可以编写一次代码，然后在不同平台上复用。另一方面，混合应用开发是一种结合了原生和 Web 技术的方法。它要求您将使用 Web 开发语言（如 HTML、CSS 或 JavaScript）编写的代码嵌入到原生应用中。您可以借助 Ionic Capacitor 和 Apache Cordova 等框架，使用额外的插件来访问平台的原生功能。

跨平台和混合开发之间唯一的相似之处是代码的可共享性。在性能方面，混合应用程序无法与原生应用相媲美。因为混合应用部署的是单一代码库，某些功能是针对特定操作系统的，在其他系统上运行效果不佳。

### 原生或跨平台应用开发：旷日持久的争论

[关于原生和跨平台开发的争论](native-and-cross-platform.md)在技术社区中仍未解决。这两项技术都在不断演进，并各有利弊。

一些专家仍然更倾向于原生移动开发而非多平台解决方案，认为原生应用更强大的性能和更好的用户体验是最重要的优势。

然而，许多现代企业需要缩短上市时间并降低每个平台的开发成本，同时仍力求在 Android 和 iOS 上都有所建树。这就是 [Kotlin Multiplatform (KMP)](https://kotlinlang.org/lp/multiplatform/) 等跨平台开发技术可以发挥作用的地方，正如 Netflix 的高级软件工程师 David Henry 和 Mel Yahya [所述](https://netflixtechblog.com/netflix-android-and-ios-studio-apps-kotlin-multiplatform-d6d4d8d25d23)：

> 网络连接不可靠的可能性很高，这促使我们转向移动解决方案，以实现强大的客户端持久化和离线支持。对快速产品交付的需求促使我们尝试多平台架构。现在，我们正通过使用 Kotlin Multiplatform 编写一次平台无关的业务逻辑（使用 Kotlin），并将其编译为 Android 的 Kotlin 库和 iOS 的原生 Universal Framework 来进一步推进这一进程。
>
> {style="tip"}

[![发现 Kotlin Multiplatform](discover-kmp.svg){width="700"}](https://www.jetbrains.com/kotlin-multiplatform/)

## 跨平台移动开发适合您吗？

选择适合您的移动开发方法取决于许多因素，如业务要求、目标和任务。与任何其他解决方案一样，跨平台移动开发也有其优缺点。

### 跨平台开发的好处

企业选择这种方法而非其他选项的原因有很多。

#### 1. 可复用代码

通过跨平台编程，移动工程师无需为每个操作系统编写新代码。使用单一代码库允许开发者减少在重复性任务（如 API 调用、数据存储、数据序列化和分析实现）上花费的时间。

像 Kotlin Multiplatform 这样的技术允许您仅实现一次应用的数据层、业务层和表示层。或者，您可以逐步采用 KMP：选择一段经常变动且通常会发生不同步的逻辑（如数据验证、筛选或排序），将其设为跨平台，然后将其作为微型库连接到您的项目中。

在 JetBrains，我们定期进行 Kotlin Multiplatform 调查，并询问我们的社区成员他们在不同平台之间共享代码的哪些部分。

![Kotlin Multiplatform 用户可以在平台间共享的代码部分](survey-results-q1-q2-22.png){width=700}

#### 2. 节省时间

由于代码的可复用性，跨平台应用程序需要的代码更少，而在编码方面，代码越少越好。节省时间是因为您不必编写那么多代码。此外，代码行数越少，出现 bug 的空间就越小，从而减少了测试和维护代码的时间。

#### 3. 有效的资源管理

构建单独的应用成本很高。拥有单一代码库可帮助您有效地管理资源。您的 Android 和 iOS 开发团队都可以学习如何编写和使用共享代码。

#### 4. 对开发者极具吸引力的机会

许多移动工程师将现代跨平台技术视为产品技术栈中理想的元素。开发者在必须执行重复性和常规任务（如 JSON 解析）时可能会感到工作乏味。然而，新技术和新任务可以带回他们的兴奋感、动力和工作乐趣。通过这种方式，拥有现代技术栈实际上可以使您更容易招募移动开发团队，并使他们更长时间地保持参与感和热情。

#### 5. 触达更广泛受众的机会

您不必在不同平台之间做出选择。由于您的应用与多个操作系统兼容，您可以满足 Android 和 iOS 受众的需求并最大限度地扩大覆盖范围。

#### 6. 更快的上市时间和自定义

由于您不需要为不同平台构建不同的应用，您可以更快地开发并推出产品。更重要的是，如果您的应用程序需要进行自定义或转换，程序员对代码库特定部分进行细微更改会更容易。这也将允许您更迅速地响应用户反馈。

### 跨平台开发方法的挑战

所有解决方案都有其自身的局限性。技术社区中的一些人认为跨平台编程仍然在处理与性能相关的故障。此外，项目负责人可能会担心他们对优化开发过程的关注可能会对应用的用户体验产生负面影响。

然而，随着底层技术的改进，跨平台解决方案正变得越来越[稳定](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)、适应性强且灵活。

以下是每隔 6 个月进行两次关于框架使用的 Kotlin Multiplatform 用户调查结果：

![Kotlin Multiplatform 使用调查结果](kmp-survey-results-2023.png){width=700}

另一个经常被提及的担忧是，多平台开发无法无缝支持平台的原生功能。然而，使用 Kotlin Multiplatform，您可以使用 Kotlin 的[预期声明和实际声明 (expected and actual declarations)](multiplatform-expect-actual.md) 来允许您的多平台应用访问平台特定的 API。预期声明和实际声明允许您在公共代码中定义您“预期”能够在多个平台调用相同的函数，并提供“实际”实现，由于 Kotlin 与 Java 和 Objective-C/Swift 的互操作性，这些实现可以与任何平台特定的库进行交互。

随着现代多平台框架的不断演进，它们越来越多地允许移动工程师打造类原生的体验。如果一个应用程序编写得很好，用户将无法察觉到差异。然而，您的产品质量将很大程度上取决于您选择的跨平台应用开发工具。

## 最受欢迎的跨平台解决方案

[最受欢迎的跨平台框架](cross-platform-frameworks.md)包括 Flutter、React Native 和 Kotlin Multiplatform。这些框架中的每一个都有其自己的能力和优势。根据您使用的工具，您的开发过程和结果可能会有所不同。

### Flutter

Flutter 由 Google 创建，是一个使用 Dart 编程语言的跨平台开发框架。Flutter 支持原生功能，例如位置服务、摄像头功能和硬盘访问。如果您需要创建一个 Flutter 不支持的特定应用功能，您可以使用 [Platform Channel 技术](https://docs.flutter.dev/platform-integration/platform-channels)编写平台特定的代码。

使用 Flutter 构建的应用需要共享其所有的用户体验和 UI 层。该框架最出色的功能之一是其热重载 (Hot Reload) 功能，它允许开发者进行更改并立即查看更改。

在以下情况下，此框架可能是最佳选择：

* 您想在应用之间共享 UI 组件，但您希望您的应用程序看起来接近原生。
* 应用预计会对 CPU/GPU 产生重负载，并且性能可能需要优化。
* 您需要开发一个 MVP（最小可行产品）。

使用 Flutter 构建的最受欢迎的应用包括 Google Ads、阿里巴巴的闲鱼、eBay Motors 和 Hamilton。

详细探索 [Kotlin Multiplatform 和 Flutter](kotlin-multiplatform-flutter.md)，以更好地了解它们的能力并确定适合您跨平台项目的方案。

### React Native

Facebook 在 2015 年推出了 React Native，作为一个开源框架，旨在帮助移动工程师构建混合原生/跨平台应用。它基于 ReactJS——一个用于构建用户界面的 JavaScript 库。换句话说，它使用 JavaScript 为 Android 和 iOS 系统构建移动应用。

React Native 提供了对多个带有即用型组件的第三方 UI 库的访问，帮助移动工程师在开发过程中节省时间。与 Flutter 一样，由于快速刷新 (Fast Refresh) 功能，它允许您立即看到所有的更改。

在以下情况下，您应该考虑在您的应用中使用 React Native：

* 您的应用程序相对简单且预计较为轻量。
* 开发团队精通 JavaScript 或 React。

使用 React Native 构建的应用程序包括 Facebook、Instagram、Skype 和 Uber Eats。

### Kotlin Multiplatform

Kotlin Multiplatform 是由 JetBrains 构建的一项开源技术，允许开发者在保持原生编程优势的同时在平台间共享代码。其主要好处包括：

* 能够在 Android、iOS、Web、桌面端和服务器端复用代码，同时在需要时保留原生代码。
* 与现有项目平滑集成。您可以利用平台特定的 API，同时充分利用原生和跨平台开发。
* 全面的代码共享灵活性，能够共享逻辑和 UI，这要归功于 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)——一个由 JetBrains 构建的现代声明式跨平台 UI 框架。
* 当您已经在 Android 中使用 Kotlin 时，无需在代码库中引入新语言。您可以复用您的 Kotlin 代码和专业知识，这使得迁移到 Kotlin Multiplatform 的风险低于其他技术。

如果您的团队在采用新的多平台技术方面需要帮助，我们建议查阅我们的指南：[_如何向您的团队引入多平台开发_](multiplatform-introduce-your-team.md)。

[![开始使用 Kotlin Multiplatform](get-started-with-kmp.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)

麦当劳、Netflix、9GAG、VMware、Cash App、飞利浦和许多其他公司已经利用了 Kotlin Multiplatform 能够逐步集成以及采用风险低的优势。其中一些公司选择通过共享现有 Kotlin 代码中特定的、关键的部分来增强其应用的稳定性。另一些公司则旨在在不损害应用质量的情况下最大限度地复用代码，并在移动端、桌面端、Web 和电视端共享所有应用逻辑，同时在每个平台上保留原生 UI。这种方法的好处从已经采用它的公司的故事中显而易见。

> 查看所有[来自全球公司和初创公司的 Kotlin Multiplatform 案例研究](https://kotlinlang.org/case-studies/?type=multiplatform)。
>
{style="note"}

## 结论

随着跨平台开发解决方案的不断演进，其局限性与它们提供的好处相比已开始显得微不足道。市场上提供了各种技术，都适用于不同的工作流和要求。本文讨论的每种工具都为考虑尝试跨平台的团队提供了广泛的支持。

最终，仔细考虑您的特定业务需求、目标和任务，并制定您希望通过应用实现的明确目标，将帮助您确定最适合您的解决方案。