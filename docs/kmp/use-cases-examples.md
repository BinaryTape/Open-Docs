[//]: # (title: Kotlin 与 Compose Multiplatform 在生产环境中的应用：实际用例)

<web-summary>了解 Kotlin Multiplatform 与 Compose Multiplatform 如何在实际项目中应用于生产环境。探索实际用例及示例。</web-summary>

> 随着全球各地大大小小的公司采用 Kotlin Multiplatform (KMP) 和 Compose Multiplatform，
> 这项技术已成为构建和扩展现代跨平台应用程序的值得信赖的解决方案。
> 
{style="note"}

从集成到现有应用程序、共享应用程序逻辑到构建新的跨平台应用程序，[Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/) 已成为许多公司的首选技术。这些团队正在充分利用 KMP 带来的优势，以更快地推出产品并降低开发成本。

越来越多的企业也正在采用 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/)，这是一个由 Kotlin Multiplatform 和 Google 的 Jetpack Compose 驱动的声明式 UI 框架。随着 [iOS 稳定版](https://blog.jetbrains.com/kotlin/2025/05/compose-multiplatform-1-8-0-released-compose-multiplatform-for-ios-is-stable-and-production-ready/)的发布，Compose Multiplatform 使整个方案趋于完善，使 KMP 成为跨平台移动开发的完整解决方案。

随着采用率的增长，本文将探讨 Kotlin Multiplatform 如何在不同行业和团队结构中应用于生产环境。

## 按业务和团队类型划分的 Kotlin Multiplatform 用例

以下是不同团队应用 Kotlin Multiplatform 来满足各种项目需求的几种方式：

### 初创公司启动全新项目

初创公司通常在资源有限和工期紧迫的环境下运作。为了最大限度地提高开发效率和成本效益，他们受益于使用共享代码库面向多个平台，尤其是在产品早期阶段或 MVP 中，此时产品上市时间至关重要。

对于希望共享逻辑和 UI 的公司，Kotlin Multiplatform 与 Compose Multiplatform 提供了理想的解决方案。你可以从共享 UI 开始，实现快速原型开发。你甚至可以将原生 UI 与共享 UI 混合搭配。这使得 KMP 和 Compose Multiplatform 成为全新项目的理想选择，帮助初创公司在速度、灵活性和高质量的原生体验之间取得平衡。

**案例研究：**

* [Instabee](https://www.youtube.com/watch?v=YsQ-2lQYQ8M) 将其 Android 应用程序逻辑和 UI 迁移到 Kotlin Multiplatform 和 Compose Multiplatform。通过有效利用其 Android 代码库，该公司得以在短时间内发布其 iOS 应用程序。
* [Respawn Pro](https://youtu.be/LB5a2FRrT94?si=vgcJI-XoCrWree3u) 开发了一款习惯追踪和效率应用。其 iOS 应用采用 Compose Multiplatform 构建，与 Android 共享 96% 的代码。

> 如果你正在[Kotlin Multiplatform 和 Flutter](https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-flutter.html) 之间进行选择，
> 请不要错过我们对这两种技术的概述。
> 
{style="tip"}

### 中小型企业

中小型企业通常拥有精简的团队，同时维护着成熟、特性丰富的产品。Kotlin Multiplatform 使他们能够共享核心逻辑，同时保持用户所期望的原生外观和体验。通过依赖现有代码库，这些团队可以在不损害用户体验的情况下加速开发。

KMP 还支持灵活地逐步引入跨平台能力。这使得它对于演进现有应用程序或发布新特性的团队尤其有效，有助于减少开发时间、降低开销，并在需要时维护平台特有的定制。

**案例研究：**

* [Down Dog](https://kotlinlang.org/lp/multiplatform/case-studies/down-dog/?_gl=1*xdrptd*_gcl_au*ODIxNDk5NDA4LjE3MjEwNDg0OTY.*_ga*MTY1Nzk3NDc4MC4xNzA1NDc1NDcw*_ga_9J976DJZ68*MTcyNzg1MTIzNS4yMzcuMS4xNzI3ODUxNDM0LjU2LjAuMA..) 为其应用程序采用了“最大化共享 Kotlin”策略，该应用程序为移动设备带来了工作室般的瑜伽体验。该公司通过 Kotlin Multiplatform 在客户端和服务器之间共享各种助手，以及大部分客户端代码。该团队通过保留仅限原生的视图，显著提高了应用程序的开发速度。
* [Doist](https://www.youtube.com/watch?v=z-o9MqN86eE) 在其屡获殊荣的待办事项列表应用 Todoist 中利用了 Kotlin Multiplatform。该团队在 Android 和 iOS 之间共享关键逻辑，以确保一致的行为并简化开发。它从内部库开始，逐步采用 KMP。

### 应用程序需要设备间一致行为的企业

大型应用程序通常拥有庞大的代码库，新特性不断增加，且复杂的业务逻辑必须在所有平台上以相同方式运行。Kotlin Multiplatform 提供渐进式集成，允许团队逐步采用。由于开发人员可以重用其现有的 Kotlin 技能，使用 KMP 还能避免引入新的技术栈。

**案例研究：****：** [Forbes](https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/)、[McDonald’s](https://medium.com/mcdonalds-technical-blog/mobile-multiplatform-development-at-mcdonalds-3b72c8d44ebc)、[Google Docs](https://www.youtube.com/watch?v=5lkZj4v4-ks)、[Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8)、[VMware](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0)、[Cash App](https://kotlinlang.org/lp/multiplatform/case-studies/cash-app?_gl=1*1qc1ixl*_gcl_aw*R0NMLjE3NTEzNTcwMDguRUFJYUlRb2JDaE1JblBLRmc0cWJqZ01WZ0VnZENSM3pYQkVWRUFFWUFTQUFFZ0ltOVBEX0J3RQ..*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTE1MjQ2MDUkbzcxJGcxJHQxNzUxNTI3Njc5JGozJGwwJGgw)、[百度“神奇”应用](https://kotlinlang.org/lp/multiplatform/case-studies/baidu)

[![从 KMP 成功案例中学习](kmp-success-stories.svg){width="700"}{style="block"}](case-studies.topic)

### 代理公司

与多样化的客户合作，代理公司和咨询机构必须适应广泛的平台要求和业务目标。Kotlin Multiplatform 的代码复用能力对于在紧迫的工期和有限的工程团队下管理多个项目的团队来说尤其有价值。通过采用 KMP，代理公司可以加速交付并在不同平台间保持应用程序行为的一致性。

**案例研究：**

* [IceRock](https://icerockdev.com/) 是一家外包公司，使用 Kotlin Multiplatform 为其客户开发应用程序。其应用程序组合涵盖各种业务需求，并辅以大量开源 Kotlin Multiplatform 库，这些库增强了 Kotlin Multiplatform 的开发流程。
* [Mirego](https://kotlinlang.org/lp/multiplatform/case-studies/mirego/)，一个端到端数字产品团队，使用 Kotlin Multiplatform 在 web、iOS、tvOS、Android 和 Amazon Fire TV 上运行相同的业务逻辑。KMP 使其能够简化开发，同时仍能充分利用每个平台。

### 拓展新市场的公司

一些公司希望通过在以前未曾面向的平台上发布其应用程序来进入新市场，例如，从仅支持 iOS 扩展到包含 Android，反之亦然。

KMP 帮助你利用现有 iOS 代码和开发实践，同时在 Android 上保持原生性能和 UI 灵活性。如果你想维护平台特有的用户体验并利用现有知识和代码，KMP 可能是理想的长期解决方案。

**案例研究：** [Instabee](https://www.youtube.com/watch?v=YsQ-2lQYQ8M) 使用 Kotlin Multiplatform 和 Compose Multiplatform 迁移其 Android 应用逻辑和 UI。这使得该公司能够通过重用其大部分现有 Android 代码库，快速进入 iOS 市场。

### 开发软件开发工具包 (SDK) 的团队

共享的 Kotlin 代码会编译为平台特有的二进制文件（Android 为 JVM，iOS 为原生），并无缝集成到任何项目中。它提供了灵活性，你可以不受限制地使用平台特有 API，同时还可以在原生和跨平台 UI 之间进行选择。这些特性使 Kotlin Multiplatform 成为开发移动 SDK 的绝佳选择。从消费者的角度来看，你的 Kotlin Multiplatform SDK 将表现得像任何常规的平台特有依赖项一样，同时仍能提供共享代码的优势。

**案例研究：** [Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8) 在其 HealthSuite 数字平台移动 SDK 中使用 Kotlin Multiplatform，从而加快了新特性的开发，并增强了 Android 和 iOS 开发人员之间的协作。

## 按行业划分的 Kotlin Multiplatform 用例

Kotlin Multiplatform 的多功能性在其应用于生产的广泛行业中显而易见。从金融科技到教育，KMP 和 Compose Multiplatform 已被多种类型的应用程序所采用。以下是一些特定行业的示例：

### 金融科技

金融科技应用程序通常涉及复杂的业务逻辑、安全工作流和严格的合规要求，所有这些都必须在不同平台间一致地实现。Kotlin Multiplatform 有助于在一个代码库中统一这些核心逻辑，从而降低平台特有不一致的风险。它确保了 iOS 和 Android 之间更快的特性一致性，这对于钱包和支付等应用程序至关重要。

**案例研究：** [Cash App](https://kotlinlang.org/lp/multiplatform/case-studies/cash-app)、[Block 的 Bitkey](https://engineering.block.xyz/blog/how-bitkey-uses-cross-platform-development)、[Worldline](https://blog.worldline.tech/2022/01/26/kotlin_multiplatform.html)

### 媒体与出版

媒体和内容驱动型应用程序依赖于快速的特性发布、一致的用户体验以及为每个平台定制 UI 的灵活性。Kotlin Multiplatform 允许团队共享内容源和发现部分的核心逻辑，同时保持对原生 UI 的完全控制。这加速了开发，减少了昂贵的重复工作，并确保了跨平台的一致性。

**案例研究：** [Forbes](https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/)、[9GAG](https://raymondctc.medium.com/adopting-kotlin-multiplatform-mobile-kmm-on-9gag-app-dfe526d9ce04)、[快手](https://medium.com/@xiang.j9501/case-studies-kuaiying-kotlin-multiplatform-mobile-268e325f8610)

### 项目管理与效率

从共享日历到实时协作，效率应用程序要求功能丰富的特性必须在所有平台上一致地工作。Kotlin Multiplatform 帮助团队在一个共享代码库中集中处理这种复杂性，确保在每个设备上实现一致的功能和行为。这种灵活性意味着团队可以更快地发布更新，并在跨平台保持统一的用户体验。

**案例研究：** [Wrike](https://www.youtube.com/watch?v=jhBmom8z3Qg)、[VMware](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0)

### 交通与出行

网约车、配送和出行平台受益于 Kotlin Multiplatform，它们可以在司机、乘客和商家应用程序中共享共同特性。实时追踪、路线优化或应用内聊天等服务的核心逻辑可以编写一次，并在 Android 和 iOS 上使用，从而保证所有用户的一致行为。

**案例研究：** [Bolt](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0)、
[Feres](case-studies.topic#case-study-feres)

### 教育科技

教育应用程序必须在移动和 Web 端提供无缝且一致的学习体验，尤其是在支持大型分布式受众时。通过使用 Kotlin Multiplatform 集中化学习算法、测验和其他业务逻辑，教育应用程序可以在每个设备上提供统一的学习体验。这种代码共享可以显著提升性能和一致性——例如，Quizlet 将其共享代码从 JavaScript 迁移到 Kotlin 后，其 Android 和 iOS 应用程序都看到了显著的速度提升。

**案例研究：** [Duolingo](https://youtu.be/RJtiFt5pbfs?si=mFpiN9SNs8m-jpFL)、[Quizlet](https://quizlet.com/blog/shared-code-kotlin-multiplatform)、[Chalk](https://kotlinlang.org/lp/multiplatform/case-studies/chalk/?_gl=1*1wxmdrv*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTEwMjI5ODAkbzYwJGcxJHQxNzUxMDIzMTU2JGo1OCRsMCRoMA..)、[Memrise](https://engineering.memrise.com/kotlin-multiplatform-memrise-3764b5a4a0db)、
[Physics Wallah](case-studies.topic#case-study-physics-wallah)

### 电子商务

构建跨平台购物体验意味着要在共享业务逻辑与支付、相机访问和地图等原生特性之间取得平衡。Kotlin Multiplatform 与 Compose Multiplatform 使团队能够在不同平台间共享业务逻辑和 UI，同时在需要时仍可使用平台特有组件。这种混合方法确保了更快的开发速度、一致的用户体验以及集成关键原生特性的灵活性。

**案例研究：** [Balary Market](case-studies.topic#case-study-balary)、[Markaz](case-studies.topic#case-study-markaz)

### 社交网络与社区

在社交平台上，及时的特性交付和一致的交互对于保持社区在不同设备上的活跃和连接至关重要。关键的交互逻辑可能包括消息、通知或日程安排。例如，Meetup 允许用户查找本地群组、活动和事项，借助 KMP 得以同时发布新特性。

**案例研究：** [Meetup](https://youtu.be/GtJBS7B3eyM?si=lNX3KMhSTCICFPxv)

### 健康与保健

无论是指导瑜伽课程还是跨设备同步健康数据，健康应用程序都依赖于响应能力和可靠的跨平台行为。这些应用程序通常需要共享核心功能，例如锻炼逻辑和数据处理，同时保持完全原生的 UI 和平台特有的集成，如传感器、通知或健康 API。

**案例研究：** [Respawn Pro](https://youtu.be/LB5a2FRrT94?si=vgcJI-XoCrWree3u)、[Fast&amp;Fit](case-studies.topic#case-study-fast-and-fit)、[Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8)、[Down Dog](https://kotlinlang.org/lp/multiplatform/case-studies/down-dog/?_gl=1*1ryf8m7*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTEyNzEzNzckbzYyJGcxJHQxNzUxMjcxMzgzJGo1NCRsMCRoMA..)

### 邮政服务

虽然不是一个常见的用例，但 Kotlin Multiplatform 甚至已被一家拥有 377 年历史的国家邮政服务公司采用。挪威的 Posten Bring 使用 KMP 统一其数十个前端和后端系统中复杂的业务逻辑，帮助他们简化工作流，并将推出新服务所需的时间从数月大幅缩短到数天。

**案例研究：** [Posten Bring](https://2024.javazone.no/program/a1d9aeac-ffc3-4b1d-ba08-a0568f415a02)

这些示例突显了 Kotlin Multiplatform 几乎可以在任何行业或任何类型的应用程序中使用。无论你是构建金融科技应用程序、出行解决方案、教育平台还是其他应用，Kotlin Multiplatform 都提供了灵活地共享尽可能多的代码的能力，而不会牺牲原生体验。你还可以查阅一份[详尽的 KMP 案例研究列表](case-studies.topic)，其中展示了许多其他在生产环境中使用该技术的公司。