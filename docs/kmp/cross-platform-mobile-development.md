[//]: # (title: 什么是跨平台移动开发？)

<web-summary>跨平台移动开发可以帮助您节省大量时间和精力。了解为什么许多开发者已经转向这项高成本效益的技术。</web-summary>

如今，许多公司面临着为多个平台，特别是 Android 和 iOS，构建移动应用的挑战。这就是为什么跨平台移动开发解决方案已成为最受欢迎的软件开发趋势之一。

根据 Statista 的数据，截至 2022 年第三季度，Google Play Store 上有 355 万款移动应用，App Store 上有 160 万款应用，Android 和 iOS 目前共同占据了[全球移动操作系统市场 99% 的份额](https://gs.statcounter.com/os-market-share/mobile/worldwide)。

如何才能创建一个同时触达 Android 和 iOS 用户的移动应用呢？在本文中，您将了解为什么越来越多的移动工程师选择跨平台或多平台移动开发方法。

## 跨平台移动开发：定义与解决方案

多平台移动开发是一种方法，允许您构建一个能在多个操作系统上流畅运行的单一移动应用程序。在跨平台应用中，部分甚至全部源代码可以共享。这意味着开发者可以创建和部署同时适用于 Android 和 iOS 的移动资源，而无需为每个平台单独重新编写代码。

### 移动应用开发的不同方法

创建同时适用于 Android 和 iOS 的应用程序主要有四种方法。

#### 1. 为每个操作系统单独开发原生应用

在创建原生应用时，开发者会为特定的操作系统构建应用程序，并依赖专门为某个平台设计的工具和编程语言：Android 平台使用 Kotlin 或 Java，iOS 平台使用 Objective-C 或 Swift。

这些工具和语言使您能够访问给定操作系统的特性和能力，并允许您开发具有直观界面的响应式应用。但如果您想同时触达 Android 和 iOS 用户，您将不得不创建单独的应用程序，这需要大量时间和精力。

#### 2. 渐进式 Web 应用 (PWAs)

渐进式 Web 应用结合了移动应用的特性与 Web 开发中使用的解决方案。粗略地说，它们提供了网站和移动应用的混合体验。开发者使用 Web 技术构建 PWA，例如 JavaScript、HTML、CSS 和 WebAssembly。

Web 应用程序无需单独打包或分发，可以在线发布。您可以通过电脑、智能手机和平板电脑上的浏览器访问它们，无需通过 Google Play 或 App Store 进行安装。

这里的缺点是，用户在使用应用时无法利用其设备的所有功能（例如联系人、日历、电话和其他资源），这导致用户体验受限。在应用性能方面，原生应用更具优势。

#### 3. 跨平台应用

如前所述，多平台应用旨在不同移动平台上一致地运行。跨平台框架允许您编写可共享和可重用的代码，以开发此类应用。

这种方法有多种益处，例如时间和成本方面的效率。我们将在稍后的章节中更详细地探讨跨平台移动开发的优缺点。

#### 4. 混合应用

当您浏览网站和论坛时，可能会注意到有些人将“_跨平台移动开发_”和“_混合移动开发_”这两个术语互换使用。然而，这样做并非完全准确。

对于跨平台应用，移动工程师可以编写一次代码，然后在不同平台上重用。而混合应用开发则是一种结合了原生和 Web 技术的方法。它要求您将用 Web 开发语言（如 HTML、CSS 或 JavaScript）编写的代码嵌入到原生应用中。您可以通过框架（例如 Ionic Capacitor 和 Apache Cordova）的帮助实现这一点，利用额外的插件来访问平台的原生功能。

跨平台开发和混合开发之间唯一的相似之处是代码共享性。在性能方面，混合应用与原生应用无法匹敌。由于混合应用部署单一代码库，某些特性是特定于某个操作系统的，在其他操作系统上可能无法良好运行。

### 原生应用开发还是跨平台应用开发：一场旷日持久的争论

[关于原生开发和跨平台开发的争论](native-and-cross-platform.md)在技术社区中仍未解决。这两种技术都在不断发展，各有其优点和局限性。

一些专家仍然偏爱原生移动开发而非多平台解决方案，他们认为原生应用更强的性能和更好的用户体验是最重要的优势之一。

然而，许多现代企业需要在降低上市时间和每平台开发成本的同时，仍然希望在 Android 和 iOS 上都占有一席之地。这时，像 [Kotlin Multiplatform (KMP)](https://kotlinlang.org/lp/multiplatform/) 这样的跨平台开发技术就能发挥作用，正如 Netflix 的高级软件工程师 David Henry 和 Mel Yahya 所[指出](https://netflixtechblog.com/netflix-android-and-ios-studio-apps-kotlin-multiplatform-d6d4d8d25d23)的：

> 不可靠的网络连接高概率出现，这促使我们倾向于使用移动解决方案，以实现强大的客户端持久化和离线支持。对快速产品交付的需求使我们尝试了多平台架构。现在，我们更进一步，利用 Kotlin Multiplatform 在 Kotlin 中一次性编写平台无关的业务逻辑，并将其编译为适用于 Android 的 Kotlin 库和适用于 iOS 的原生 Universal Framework。
>
{style="tip"}

[![发现 Kotlin Multiplatform](discover-kmp.svg){width="700"}](https://www.jetbrains.com/kotlin-multiplatform/)

## 跨平台移动开发适合您吗？

选择适合您的移动开发方法取决于许多因素，例如业务需求、目标和任务。像任何其他解决方案一样，跨平台移动开发也有其优缺点。

### 跨平台开发的益处

企业选择此方法而非其他选项的原因有很多。

#### 1. 可重用代码

通过跨平台编程，移动工程师无需为每个操作系统编写新代码。使用单一代码库可以帮助开发者减少花在重复性任务上的时间，例如 API 调用、数据存储、数据序列化和分析实现。

像 Kotlin Multiplatform 这样的技术允许您只实现一次应用程序的数据层、业务层和表示层。或者，您可以逐步采用 KMP：选择一个经常变化且通常不同步的逻辑片段，例如数据验证、过滤或排序；使其跨平台；然后将其作为微型库连接到您的项目。

在 JetBrains，我们定期进行 Kotlin Multiplatform 调查，并询问社区成员他们在不同平台之间共享哪些代码部分。

![Kotlin Multiplatform 用户可在平台间共享的代码部分](survey-results-q1-q2-22.png){width=700}

#### 2. 节省时间

由于代码可重用性，跨平台应用程序所需的代码量更少，而在编码方面，代码越少越好。您无需编写大量代码，从而节省了时间。此外，代码行数越少，出现 bug 的可能性就越小，从而减少了测试和维护代码的时间。

#### 3. 有效的资源管理

构建单独的应用程序成本高昂。拥有单一代码库有助于您有效地管理资源。您的 Android 和 iOS 开发团队都可以学习如何编写和使用共享代码。

#### 4. 对开发者的吸引力

许多移动工程师认为现代跨平台技术是产品技术栈中理想的元素。开发者在执行重复性、日常任务（例如 JSON 解析）时可能会感到厌烦。然而，新的技术和任务可以重新激发他们的热情、动力和工作乐趣。通过这种方式，拥有现代技术栈实际上可以使您更容易地组建移动开发团队，并长期保持其投入和热情。

#### 5. 触达更广泛受众的机会

您无需在不同平台之间做出选择。由于您的应用兼容多种操作系统，因此可以同时满足 Android 和 iOS 用户的需求，并最大限度地扩大您的影响力。

#### 6. 更快的上市时间与定制化

由于您无需为不同平台构建不同的应用，因此可以更快地开发和发布您的产品。此外，如果您的应用程序需要定制或改造，程序员将更容易对代码库的特定部分进行小幅修改。这也将使您能更及时地响应用户反馈。

### 跨平台开发方法的挑战

所有解决方案都有其局限性。技术社区中的一些人认为，跨平台编程仍然面临与性能相关的故障。此外，项目负责人可能会担心，他们对开发过程优化的关注可能会对应用的用户体验产生负面影响。

然而，随着底层技术的改进，跨平台解决方案正变得越来越[稳定](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)、适应性强且灵活。

以下是两次关于框架使用情况的 Kotlin Multiplatform 用户调查结果，两次调查间隔 6 个月：

![Kotlin Multiplatform 使用情况调查结果](kmp-survey-results-2023.png){width=700}

另一个常见的担忧是，多平台开发使得无缝支持平台的原生特性变得不可能。然而，借助 Kotlin Multiplatform，您可以使用 Kotlin 的[预期与实际声明](multiplatform-expect-actual.md)，使您的多平台应用能够访问平台特有的 API。预期与实际声明允许您在公共代码中定义您“期望”能够在多个平台之间调用相同的函数，并提供“实际”实现，这些实现可以与任何平台特有的库进行交互，这得益于 Kotlin 与 Java 和 Objective-C/Swift 的互操作性。

随着现代多平台框架的不断发展，它们越来越能让移动工程师打造出原生般的体验。如果应用程序编写得当，用户将不会察觉到差异。然而，您产品的质量将严重依赖于您选择的跨平台应用开发工具。

## 最受欢迎的跨平台解决方案

[最受欢迎的跨平台框架](cross-platform-frameworks.md)包括 Flutter、React Native 和 Kotlin Multiplatform。这些框架各有其能力和优势。根据您使用的工具，您的开发过程和结果可能会有所不同。

### Flutter

Flutter 由 Google 创建，是一个使用 Dart 编程语言的跨平台开发框架。Flutter 支持原生特性，例如位置服务、相机功能和硬盘访问。如果您需要创建 Flutter 不支持的特定应用特性，您可以使用 [Platform Channel 技术](https://docs.flutter.dev/platform-integration/platform-channels)编写平台特有的代码。

使用 Flutter 构建的应用需要共享其所有的 UX 和 UI 层。这个框架最好的特性之一是其热重载特性，它允许开发者即时进行更改并查看效果。

在以下情况下，此框架可能是最佳选择：

*   您希望在应用之间共享 UI 组件，但又希望您的应用程序看起来接近原生。
*   应用预计会对 CPU/GPU 造成沉重负载，并且性能可能需要优化。
*   您需要开发一个 MVP（最小可行产品）。

使用 Flutter 构建的最受欢迎的应用包括 Google Ads、阿里巴巴的闲鱼、eBay Motors 和 Hamilton。

详细了解 [Kotlin Multiplatform 和 Flutter](kotlin-multiplatform-flutter.md)，以便更好地理解它们的能力并为您的跨平台项目确定合适的选择。

### React Native

Facebook 于 2015 年推出了 React Native，这是一个开源框架，旨在帮助移动工程师构建混合原生/跨平台应用。它基于 ReactJS——一个用于构建用户界面的 JavaScript 库。换句话说，它使用 JavaScript 来为 Android 和 iOS 系统构建移动应用。

React Native 提供了对多个带有现成组件的第三方 UI 库的访问，帮助移动工程师在开发过程中节省时间。与 Flutter 类似，它允许您立即看到所有更改，这得益于其快速刷新（Fast Refresh）特性。

在以下情况下，您应该考虑为您的应用使用 React Native：

*   您的应用程序相对简单，并且预计会是轻量级的。
*   开发团队精通 JavaScript 或 React。

使用 React Native 构建的应用程序包括 Facebook、Instagram、Skype 和 Uber Eats。

### Kotlin Multiplatform

Kotlin Multiplatform 是 JetBrains 构建的一项开源技术，它允许开发者在不同平台之间共享代码，同时保留原生编程的优势。其主要优势包括：

*   能够在 Android、iOS、Web、桌面和服务器端重用代码，并在需要时保留原生代码。
*   与现有项目的平滑集成。您可以利用平台特有的 API，同时最大限度地发挥原生和跨平台开发的优势。
*   完整的代码共享灵活性，以及同时共享逻辑和 UI 的能力，这得益于 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)，一个由 JetBrains 构建的现代声明式跨平台 UI 框架。
*   当您已经使用 Kotlin 开发 Android 时，无需向您的代码库引入新语言。您可以重用您的 Kotlin 代码和专业知识，这使得迁移到 Kotlin Multiplatform 比其他技术风险更低。

如果您的团队在采用新的多平台技术方面需要帮助，我们建议您查阅我们关于[_如何向您的团队引入多平台开发_](multiplatform-introduce-your-team.md)的指南。

[![Kotlin Multiplatform 入门](get-started-with-kmp.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)

McDonald's、Netflix、9GAG、VMware、Cash App、Philips 以及许多其他公司正在利用 Kotlin Multiplatform 能够逐步集成和低采用风险的优势。其中一些公司选择通过共享现有 Kotlin 代码中特定、关键的部分来增强应用的稳定性。另一些公司则旨在最大限度地重用代码，同时不损害应用质量，并在移动、桌面、Web 和电视平台上共享所有应用程序逻辑，同时保留每个平台的原生 UI。这种方法的益处从已采用该方法的公司的案例中显而易见。

> 查看[来自全球公司和初创企业的 Kotlin Multiplatform 案例研究](case-studies.topic)。
>
{style="note"}

## 结论

随着跨平台开发解决方案的不断演进，它们的局限性与所提供的益处相比已显得微不足道。市场上有多种多样的技术，都适用于不同的工作流程和需求。本文中讨论的每种工具都为考虑尝试跨平台开发的团队提供了广泛支持。

最终，仔细考虑您具体的业务需求、目标和任务，并为您的应用制定清晰的目标，将帮助您找到最适合您的解决方案。