[//]: # (title: 什么是跨平台移动开发？)

<web-summary>跨平台移动开发可帮助你节省大量时间和精力。了解为什么许多开发者已经转向这项高成本效益的技术。</web-summary>

如今，许多公司正面临为多个平台（特别是 Android 和 iOS）构建移动应用的挑战。这就是为什么跨平台移动开发解决方案已成为最受欢迎的软件开发趋势之一。

根据 Statista 的数据，截至 2022 年第三季度，Google Play Store 上有 355 万个移动应用，App Store 上有 160 万个应用。Android 和 iOS 目前合计占据了 [全球移动操作系统市场份额的 99%](https://gs.statcounter.com/os-market-share/mobile/worldwide)。

你如何创建一款能够覆盖 Android 和 iOS 用户的移动应用呢？在本文中，你将了解到为什么越来越多的移动工程师选择跨平台或多平台移动开发方法。

## 跨平台移动开发：定义与解决方案

多平台移动开发是一种方法，它允许你构建一个能在多个操作系统上流畅运行的单一移动应用程序。在跨平台应用中，部分甚至全部源代码都可以共享。这意味着开发者可以创建和部署可在 Android 和 iOS 上运行的移动 asset，而无需为每个独立平台重新编码。

### 移动应用开发的不同方法

为 Android 和 iOS 创建应用主要有四种方法。

#### 1. 为每个操作系统开发单独的原生应用

在创建原生应用时，开发者会为特定的操作系统构建应用程序，并依赖专为某一平台设计的工具和编程语言：Android 使用 Kotlin 或 Java，iOS 使用 Objective-C 或 Swift。

这些工具和语言使你能够访问给定操作系统的特性和能力，并允许你构建具有直观界面的响应迅速的应用。但是，如果你想覆盖 Android 和 iOS 用户，你将不得不创建单独的应用程序，这需要花费大量时间和精力。

#### 2. 渐进式 Web 应用 (PWA)

渐进式 Web 应用结合了移动应用的特性与 Web 开发中使用的解决方案。粗略地说，它们提供了网站和移动应用程序的结合。开发者使用 Web 技术（例如 JavaScript、HTML、CSS 和 WebAssembly）来构建 PWA。

Web 应用程序不需要单独打包或分发，并且可以在线发布。它们可以通过你电脑、智能手机和平板电脑上的浏览器访问，无需通过 Google Play 或 App Store 安装。

这里的缺点是，用户在使用应用时无法利用其设备的所有功能性，例如联系人、日历、电话和其他 asset，这导致用户体验受限。在应用性能方面，原生应用占据优势。

#### 3. 跨平台应用

如前所述，多平台应用旨在不同移动平台上以相同方式运行。跨平台框架允许你编写可共享和可复用的代码，以开发此类应用。

这种方法有若干优势，例如时间和成本方面的效率。我们将在后续章节中更详细地探讨跨平台移动开发的优缺点。

#### 4. 混合应用

在浏览网站和论坛时，你可能会注意到有些人互换使用“跨平台移动开发”和“混合移动开发”这两个术语。然而，这样做并非完全准确。

对于跨平台应用而言，移动工程师可以编写一次代码，然后在不同平台上复用。另一方面，混合应用开发是一种结合了原生和 Web 技术的方法。它要求你将使用 HTML、CSS 或 JavaScript 等 Web 开发语言编写的代码嵌入到原生应用中。你可以借助 Ionic Capacitor 和 Apache Cordova 等框架，使用额外的插件来访问平台的原生功能性。

跨平台开发和混合开发之间唯一的相似之处是代码共享性。在性能方面，混合应用程序与原生应用不相上下。由于混合应用部署单一代码库，有些特性是特定于某个操作系统的，在其他操作系统上表现不佳。

### 原生应用开发与跨平台应用开发：一场长期的争论

[关于原生和跨平台开发的争论](native-and-cross-platform.md) 在技术社区中仍未解决。这两种技术都在不断演进，并各有其优势和局限性。

一些专家仍然偏爱原生移动开发而非多平台解决方案，他们认为原生应用更强的性能和更好的用户体验是最重要的优势之一。

然而，许多现代企业需要缩短上市时间和降低每个平台开发的成本，同时仍致力于在 Android 和 iOS 上都占有一席之地。正如 Netflix 的高级软件工程师 David Henry 和 Mel Yahya 所[指](https://netflixtechblog.com/netflix-android-and-ios-studio-apps-kotlin-multiplatform-d6d4d8d25d23)出的那样，[Kotlin Multiplatform (KMP)](https://kotlinlang.org/lp/multiplatform/) 等跨平台开发技术可以在这方面提供帮助：

> 不可靠的网络连接可能性很高，这促使我们倾向于使用移动解决方案，
> 以实现强大的客户端持久性和离线支持。对快速产品交付的需求
> 使我们尝试了多平台架构。现在，我们通过使用 Kotlin Multiplatform 将
> 平台无关的业务逻辑用 Kotlin 编写一次，然后编译成适用于 Android 的 Kotlin 库和适用于 iOS 的原生 Universal Framework，从而更进一步。
>
> {style="tip"}

[![Discover Kotlin Multiplatform](discover-kmp.svg){width="700"}](https://www.jetbrains.com/kotlin-multiplatform/)

## 跨平台移动开发适合你吗？

选择适合你的移动开发方法取决于许多因素，例如业务需求、目标和任务。与任何其他解决方案一样，跨平台移动开发也有其优缺点。

### 跨平台开发的优势

企业选择这种方法而非其他选项有众多原因。

#### 1. 可复用代码

通过跨平台编程，移动工程师无需为每个操作系统编写新代码。使用单一代码库允许开发者减少花在重复性任务上的时间，例如 API 调用、数据存储、数据序列化和分析实现。

Kotlin Multiplatform 等技术允许你只实现一次应用的[数据层、业务层和展示层](https://kotlinlang.org/docs/multiplatform-mobile-architecture.html)。或者，你可以逐步采用 KMP：选择一个经常变化且通常不同步的逻辑片段，例如数据验证、过滤或排序；使其跨平台；然后将其作为微型库连接到你的项目。

在 JetBrains，我们定期进行 Kotlin Multiplatform 调查，并询问我们的社区成员他们在不同平台之间共享哪些代码部分。

![Kotlin Multiplatform 用户可在平台之间共享的代码部分](survey-results-q1-q2-22.png){width=700}

#### 2. 节省时间

由于代码可复用性，跨平台应用需要更少的代码，而在编码方面，代码越少越好。由于你无需编写那么多代码，因此节省了时间。此外，代码行数越少，出现 bug 的空间就越小，从而减少了测试和维护代码的时间。

#### 3. 有效的资源管理

构建单独的应用成本高昂。拥有单一代码库有助于你有效管理你的资源。你的 Android 和 iOS 开发团队都可以学习如何编写和使用共享代码。

#### 4. 对开发者的吸引力

许多移动工程师将现代跨平台技术视为产品技术栈中理想的元素。开发者在执行重复和例行的任务（例如 JSON 解析）时可能会在工作中感到无聊。然而，新的技术和任务可以重新激发他们的兴奋、动力和工作乐趣。通过这种方式，拥有现代技术栈实际上可以使你更容易地为移动开发团队配备人员，并使其保持投入和热情更长时间。

#### 5. 覆盖更广泛受众的机会

你无需在不同平台之间做出选择。由于你的应用与多个操作系统兼容，因此你可以满足 Android 和 iOS 用户的需求，并最大化你的覆盖范围。

#### 6. 更快的上市时间和定制化

由于你无需为不同平台构建不同的应用，因此可以更快地开发和发布你的产品。更重要的是，如果你的应用程序需要定制或改造，程序员将更容易对代码库的特定部分进行小幅更改。这也将使你能够对用户反馈更具响应性。

### 跨平台开发方法的挑战

所有解决方案都有其局限性。技术社区中的一些人认为，跨平台编程在性能相关的故障方面仍然存在问题。此外，项目负责人可能担心他们对优化开发过程的关注可能会对应用的用户体验产生负面影响。

然而，随着底层技术的改进，跨平台解决方案正变得越来越[稳定](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)、适应性强且灵活。

以下是两项关于框架使用的 Kotlin Multiplatform 用户调查结果，它们相隔 6 个月进行：

![Kotlin Multiplatform 使用情况调查结果](kmp-survey-results-2023.png){width=700}

另一个普遍存在的担忧是，多平台开发使得无缝支持平台的原生特性变得不可能。然而，借助 Kotlin Multiplatform，你可以使用 Kotlin 的 [expect/actual 声明](multiplatform-expect-actual.md) 来使你的多平台应用能够访问平台特有的 API。expect/actual 声明允许你在公共代码中定义你“预期”能够在多个平台间调用相同函数，并提供“实际”实现，这些实现可以借助 Kotlin 与 Java 和 Objective-C/Swift 的互操作性与任何平台特有的库交互。

随着现代多平台框架的持续发展，它们越来越多地允许移动工程师打造类似原生的体验。如果一个应用程序编写得好，用户将无法察觉差异。然而，产品质量将很大程度上取决于你选择的跨平台应用开发工具。

## 最流行的跨平台解决方案

[最流行的跨平台框架](cross-platform-frameworks.md) 包括 Flutter、React Native 和 Kotlin Multiplatform。这些框架各有其能力和优势。根据你使用的工具，你的开发过程和结果可能会有所不同。

### Flutter

Flutter 是由 Google 创建的跨平台开发框架，它使用 Dart 编程语言。Flutter 支持原生特性，例如定位服务、相机功能性 (functionality) 和硬盘访问。如果你需要创建 Flutter 不支持的特定应用特性，你可以使用 [Platform Channel 技术](https://docs.flutter.dev/platform-integration/platform-channels) 编写平台特有的代码。

使用 Flutter 构建的应用需要共享其所有 UX 和 UI 层。这个框架最好的特性之一是它的热重载 (Hot Reload) 特性，它允许开发者立即进行更改并查看。

在以下情况中，这个框架可能是最佳选择：

*   你希望在应用之间共享 UI 组件，但希望你的应用程序看起来接近原生。
*   应用预计会对 CPU/GPU 造成沉重负载，并且性能可能需要优化。
*   你需要开发 MVP (最小可行产品)。

使用 Flutter 构建的最受欢迎的应用包括 Google Ads、阿里巴巴闲鱼、eBay Motors 和 Hamilton。

深入探索 [Kotlin Multiplatform 和 Flutter](kotlin-multiplatform-flutter.md)，以便更好地了解它们的能力并为你的跨平台项目确定合适的选择。

### React Native

Facebook 于 2015 年推出了 React Native，这是一个开源框架，旨在帮助移动工程师构建混合的原生/跨平台应用。它基于 ReactJS – 一个用于构建用户界面的 JavaScript 库。换句话说，它使用 JavaScript 为 Android 和 iOS 系统构建移动应用。

React Native 提供了对多个带有即用型组件的第三方 UI 库的访问，帮助移动工程师在开发过程中节省时间。与 Flutter 一样，由于其快速刷新 (Fast Refresh) 特性，它允许你立即查看所有更改。

在以下情况中，你应考虑为你的应用使用 React Native：

*   你的应用程序相对简单且预计是轻量级的。
*   开发团队精通 JavaScript 或 React。

使用 React Native 构建的应用包括 Facebook、Instagram、Skype 和 Uber Eats。

### Kotlin Multiplatform

Kotlin Multiplatform 是由 JetBrains 构建的开源技术，它允许开发者跨平台共享代码，同时保留原生编程的优势。其主要优势包括：

*   能够在 Android、iOS、Web、桌面和服务器端之间复用代码，同时在需要时保留原生代码。
*   与现有项目的无缝集成。你可以利用平台特有的 API，同时充分利用原生和跨平台开发的优势。
*   完全的代码共享灵活性，以及共享逻辑和 UI 的能力，这得益于 [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)，一个由 JetBrains 构建的现代声明式跨平台 UI 框架。
*   如果你已经使用 Kotlin 进行 Android 开发，则无需向代码库引入新语言。你可以复用你的 Kotlin 代码和专业知识，这使得与通过其他技术相比，迁移到 Kotlin Multiplatform 的风险更低。

如果你的团队在采用新的多平台技术方面需要帮助，我们建议你查阅我们的指南：[_如何向你的团队引入多平台开发_](multiplatform-introduce-your-team.md)。

[![Get Started with Kotlin Multiplatform](get-started-with-kmp.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)

麦当劳、Netflix、9GAG、VMware、Cash App、飞利浦以及许多其他公司已经开始利用 Kotlin Multiplatform 的渐进式集成能力及其低采用风险。其中一些公司选择通过共享其现有 Kotlin 代码的特定关键部分来增强应用稳定性。其他公司旨在在不影响应用质量的情况下最大化代码复用，并在移动、桌面、Web 和电视平台之间共享所有应用逻辑，同时在每个平台保留原生 UI。这种方法的优势从已采用它的公司的案例中显而易见。

> 查看所有 [全球公司和初创公司的 Kotlin Multiplatform 案例研究](case-studies.topic)。
>
{style="note"}

## 结论

随着跨平台开发解决方案的不断发展，它们的局限性与所提供的优势相比已显得微不足道。市场上提供了各种技术，它们都适合不同的工作流程和要求。本文讨论的每一种工具都为考虑尝试跨平台的团队提供了广泛的支持。

最终，仔细考虑你的具体业务需求、目标和任务，并制定你希望通过应用实现清晰目标，将有助于你确定最佳解决方案。