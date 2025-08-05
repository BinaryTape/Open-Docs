[//]: # (title: Kotlin 和 Compose Multiplatform 在生产环境中的应用：真实案例)

<web-summary>探索 Kotlin Multiplatform 和 Compose Multiplatform 如何在真实项目中应用于生产环境。通过示例了解实际用例。</web-summary>

> 随着全球各地的大型和小型公司都在采用 Kotlin Multiplatform（KMP）和 Compose Multiplatform，这项技术已成为构建和扩展现代跨平台应用程序的可靠解决方案。
> 
{style="note"}

从集成到现有应用和共享应用逻辑，到构建全新的跨平台应用程序，[Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/) 已成为许多公司的首选技术。这些团队正利用 KMP 提供的优势，更快地推出产品并降低开发成本。

越来越多的企业也在采用 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/)，这是一个由 Kotlin Multiplatform 和 Google 的 Jetpack Compose 提供支持的声明式 UI 框架。随着 [iOS 稳定版的发布](https://blog.jetbrains.com/kotlin/2025/05/compose-multiplatform-1-8-0-released-compose-multiplatform-for-ios-is-stable-and-production-ready/)，Compose Multiplatform 完善了整个画面，使 KMP 成为跨平台移动开发的完整解决方案。

随着采用率的增长，本文将探讨 Kotlin Multiplatform 如何在不同行业和团队结构中应用于生产环境。

## Kotlin Multiplatform 按业务和团队类型划分的用例

以下是不同团队应用 Kotlin Multiplatform 来满足各种项目需求的几种方式：

### 初创公司启动新绿地项目

初创公司通常在资源有限和时间紧迫的情况下运营。为了最大限度地提高开发效率和成本效益，他们受益于使用共享代码库面向多个平台，尤其是在产品早期阶段或 MVP（最小可行产品）中，此时上市时间至关重要。

对于希望同时共享逻辑和 UI 的公司，Kotlin Multiplatform 和 Compose Multiplatform 提供了理想的解决方案。您可以从共享 UI 开始，实现快速原型开发。您甚至可以将原生 UI 与共享 UI 混合搭配。这使得 KMP 与 Compose Multiplatform 成为绿地项目的理想选择，帮助初创公司平衡速度、灵活性和高质量的原生体验。

**案例研究：**

*   [Instabee](https://www.youtube.com/watch?v=YsQ-2lQYQ8M) 将其 Android 应用程序逻辑和 UI 迁移到 Kotlin Multiplatform 与 Compose Multiplatform。通过有效利用 Android 代码库，该公司能够在短时间内发布其 iOS 应用程序。
*   [Respawn Pro](https://youtu.be/LB5a2FRrT94?si=vgcJI-XoCrWree3u) 开发了一款习惯追踪和生产力应用。其 iOS 应用使用 Compose Multiplatform 构建，与 Android 共享了 96% 的代码。

> 如果您正在 [Kotlin Multiplatform 和 Flutter](https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-flutter.html) 之间做选择，请不要错过我们对这两种技术的概述。
> 
{style="tip"}

### 中小型企业

中小型企业通常拥有精干的团队，同时维护着成熟、功能丰富的产品。Kotlin Multiplatform 使他们能够共享核心逻辑，同时保持用户所期望的原生外观和感觉。通过依赖现有代码库，这些团队可以加速开发，而不会损害用户体验。

KMP 还支持一种灵活的方法来逐步引入跨平台能力。这使得它对于演进现有应用或发布新特性的团队特别有效，有助于减少开发时间、降低开销，并在需要时保持平台特有的自定义。

**案例研究：**

*   [Down Dog](https://kotlinlang.org/lp/multiplatform/case-studies/down-dog/?_gl=1*xdrptd*_gcl_au*ODIxNDk5NDA4LjE3MjEwNDg0OTY.*_ga*MTY1Nzk3NDc4MC4xNzA1NDc1NDcw*_ga_9J976DJZ68*MTcyNzg1MTIzNS4yMzcuMS4xNzI3ODUxNDM0LjU2LjAuMA..) 为其应用程序采用了“最大化共享 Kotlin”策略，将工作室般的瑜伽体验带到移动设备上。该公司通过 Kotlin Multiplatform 在客户端和服务器之间共享了各种辅助工具，以及大部分客户端代码。通过保留仅限原生的视图，该团队成功显著提高了应用程序的开发速度。
*   [Doist](https://www.youtube.com/watch?v=z-o9MqN86eE) 在其屡获殊荣的待办事项列表应用 Todoist 中利用了 Kotlin Multiplatform。该团队在 Android 和 iOS 之间共享了关键逻辑，以确保行为一致性并简化开发。它从内部库开始，逐步采用了 KMP。

### 需要在设备间保持应用行为一致的企业

大型应用程序通常拥有庞大的代码库，不断有新特性添加，并且复杂的业务逻辑必须在所有平台上以相同的方式工作。Kotlin Multiplatform 提供渐进式集成，允许团队逐步采用它。而且由于开发者可以重用他们现有的 Kotlin 技能，使用 KMP 也能避免他们引入新的技术栈。

**案例研究：** [Forbes](https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/)、[McDonald’s](https://medium.com/mcdonalds-technical-blog/mobile-multiplatform-development-at-mcdonalds-3b72c8d44ebc)、[Google Docs](https://www.youtube.com/watch?v=5lkZj4v4-ks)、[Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8)、[VMware](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0)、[Cash App](https://kotlinlang.org/lp/multiplatform/case-studies/cash-app?_gl=1*1qc1ixl*_gcl_aw*R0NMLjE3NTEzNTcwMDguRUFJYUlRb2JDaE1JblBLRmc0cWJqZ01WZ0VnZENSM3pYQkVWRUFFWUFTQUFFZ0ltOVBEX0J3RQ..*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTE1MjQ2MDUkbzcxJGcxJHQxNzUxNTI3Njc5JGozJGwwJGgw)、[百度奇遇](https://kotlinlang.org/lp/multiplatform/case-studies/baidu)

[![学习 KMP 成功案例](kmp-success-stories.svg){width="700"}{style="block"}](case-studies.topic)

### 代理机构

与各种客户合作的代理机构和咨询公司必须适应广泛的平台要求和业务目标。Kotlin Multiplatform 的代码复用能力对于在时间紧迫和工程团队有限的情况下管理多个项目的团队尤其有价值。通过采用 KMP，代理机构可以加速交付并保持跨平台应用行为的一致性。

**案例研究：**

*   [IceRock](https://icerockdev.com/) 是一家外包公司，使用 Kotlin Multiplatform 为其客户开发应用。其应用组合涵盖了各种业务需求，并辅以大量开源的 Kotlin Multiplatform 库，这些库增强了 Kotlin Multiplatform 的开发过程。
*   [Mirego](https://kotlinlang.org/lp/multiplatform/case-studies/mirego/) 是一个端到端数字产品团队，它使用 Kotlin Multiplatform 在 Web、iOS、tvOS、Android 和 Amazon Fire TV 上运行相同的业务逻辑。KMP 使其能够简化开发，同时仍能充分利用每个平台。

### 拓展新市场的公司

有些公司希望通过在之前未曾面向的平台上发布应用来进入新市场，例如，从仅支持 iOS 转向包含 Android，反之亦然。

KMP 帮助您利用现有的 iOS 代码和开发实践，同时在 Android 上保持原生性能和 UI 灵活性。如果您想维护平台特有的用户体验并利用现有知识和代码，KMP 可能是理想的长期解决方案。

**案例研究：** [Instabee](https://www.youtube.com/watch?v=YsQ-2lQYQ8M) 使用 Kotlin Multiplatform 和 Compose Multiplatform 迁移了其 Android 应用逻辑和 UI。这使得该公司能够通过复用其大部分现有 Android 代码库，快速进入 iOS 市场。

### 开发软件开发工具包（SDK）的团队

共享的 Kotlin 代码会编译成平台特有的二进制文件（Android 为 JVM，iOS 为 native），并无缝集成到任何项目中。它提供了灵活性，您可以无限制地使用平台特有的 API，同时还可以在原生和跨平台 UI 之间进行选择。这些特性使 Kotlin Multiplatform 成为开发移动 SDK 的绝佳选择。从消费者的角度来看，您的 Kotlin Multiplatform SDK 将像任何常规的平台特有依赖项一样运行，同时仍能提供共享代码的优势。

**案例研究：** [Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8) 在其 HealthSuite 数字平台移动 SDK 中使用 Kotlin Multiplatform，从而加快新特性的开发，并增强 Android 和 iOS 开发者之间的协作。

## Kotlin Multiplatform 按行业划分的用例

Kotlin Multiplatform 的多功能性在其广泛应用于生产环境的行业中显而易见。从金融科技到教育，KMP 与 Compose Multiplatform 已被多种类型的应用程序所采用。以下是一些行业特有的示例：

### 金融科技

金融科技应用程序通常涉及复杂的业务逻辑、安全的工作流和严格的合规要求，所有这些都必须在跨平台中保持一致的实现。Kotlin Multiplatform 有助于将这些核心逻辑统一到一个代码库中，从而降低平台特有不一致的风险。它确保了 iOS 和 Android 之间更快的特性对等，这对于钱包和支付等应用至关重要。

**案例研究：** [Cash App](https://kotlinlang.org/lp/multiplatform/case-studies/cash-app)、[Bitkey by Block](https://engineering.block.xyz/blog/how-bitkey-uses-cross-platform-development)、[Worldline](https://blog.worldline.tech/2022/01/26/kotlin_multiplatform.html)

### 媒体与出版

媒体和内容驱动型应用依赖于快速的特性发布、一致的用户体验以及为每个平台定制 UI 的灵活性。Kotlin Multiplatform 允许团队共享内容 feed 和发现部分的核心逻辑，同时保持对原生 UI 的完全控制。这加速了开发，减少了代价高昂的重复，并确保了跨平台的一致性。

**案例研究：** [Forbes](https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/)、[9GAG](https://raymondctc.medium.com/adopting-kotlin-multiplatform-mobile-kmm-on-9gag-app-dfe526d9ce04)、[快手](https://medium.com/@xiang.j9501/case-studies-kuaiying-kotlin-multiplatform-mobile-268e325f8610)

### 项目管理与生产力

从共享日历到实时协作，生产力应用需要功能丰富的特性，并且必须在所有平台上保持一致的工作方式。Kotlin Multiplatform 帮助团队将这种复杂性集中到一个共享代码库中，确保在每台设备上功能和行为的一致性。这种灵活性意味着团队可以更快地发布更新，并在跨平台中维护统一的用户体验。

**案例研究：** [Wrike](https://www.youtube.com/watch?v=jhBmom8z3Qg)、[VMware](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0)

### 交通与出行

网约车、配送和出行平台通过在司机、乘客和商家应用中共享通用特性，从而受益于 Kotlin Multiplatform。实时追踪、路线优化或应用内聊天等服务的核心逻辑可以编写一次，并在 Android 和 iOS 上使用，确保所有用户的一致行为。

**案例研究：** [Bolt](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0)、[Feres](case-studies.topic#case-study-feres)

### 教育科技

教育应用必须在移动端和网页端提供无缝且一致的学习体验，尤其是在支持大量分布式用户时。通过使用 Kotlin Multiplatform 集中学习算法、测验和其他业务逻辑，教育应用可以在每台设备上提供统一的学习体验。这种代码共享可以显著提升性能和一致性——例如，Quizlet 将其共享代码从 JavaScript 迁移到 Kotlin，并在其 Android 和 iOS 应用中看到了显著的速度提升。

**案例研究：** [Duolingo](https://youtu.be/RJtiFt5pbfs?si=mFpiN9SNs8m-jpFL)、[Quizlet](https://quizlet.com/blog/shared-code-kotlin-multiplatform)、[Chalk](https://kotlinlang.org/lp/multiplatform/case-studies/chalk/?_gl=1*1wxmdrv*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTEwMjI5ODAkbzYwJGcxJHQxNzUxMDIzMTU2JGo1OCRsMCRoMA..)、[Memrise](https://engineering.memrise.com/kotlin-multiplatform-memrise-3764b5a4a0db)、[Physics Wallah](case-studies.topic#case-study-physics-wallah)

### 电子商务

构建跨平台购物体验意味着要在共享业务逻辑与支付、相机访问和地图等原生特性之间取得平衡。Kotlin Multiplatform 和 Compose Multiplatform 使团队能够在跨平台中共享业务逻辑和 UI，同时仍能在需要时使用平台特有的组件。这种混合方法确保了更快的开发、一致的用户体验以及集成关键原生特性的灵活性。

**案例研究：** [Balary Market](case-studies.topic#case-study-balary)、[Markaz](case-studies.topic#case-study-markaz)

### 社交网络与社区

在社交平台上，及时的特性交付和一致的交互对于保持社区活跃和跨设备连接至关重要。关键的交互逻辑可能包括消息、通知或日程安排。例如，Meetup 允许用户查找本地群组、事件和活动，得益于 KMP，它能够同时发布新特性。

**案例研究：** [Meetup](https://youtu.be/GtJBS7B3eyM?si=lNX3KMhSTCICFPxv)

### 健康与养生

无论是指导瑜伽课程还是跨设备同步健康数据，养生应用都依赖于响应能力和可靠的跨平台行为。这些应用通常需要共享核心功能，例如锻炼逻辑和数据处理，同时保持完全原生的 UI 和平台特有的集成，如传感器、通知或健康 API。

**案例研究：** [Respawn Pro](https://youtu.be/LB5a2FRrT94?si=lNX3KMhSTCICFPxv)、[Fast&amp;Fit](case-studies.topic#case-study-fast-and-fit)、[Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8)、[Down Dog](https://kotlinlang.org/lp/multiplatform/case-studies/down-dog/?_gl=1*1ryf8m7*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTEyNzEzNzckbzYyJGcxJHQxNzUxMjcxMzgzJGo1NCRsMCRoMA..)

### 邮政服务

虽然不是常见的用例，但 Kotlin Multiplatform 甚至被一家拥有 377 年历史的国家邮政服务公司所采用。挪威的 Posten Bring 使用 KMP 统一数十个前端和后端系统中复杂的业务逻辑，帮助他们简化工作流并大幅缩短推出新服务所需的时间——从数月缩短到数天。

**案例研究：** [Posten Bring](https://2024.javazone.no/program/a1d9aeac-ffc3-4b1d-ba08-a0568f415a02)

这些示例突出显示了 Kotlin Multiplatform 如何在几乎任何行业或应用类型中使用。无论您是构建金融科技应用、出行解决方案、教育平台还是其他应用，Kotlin Multiplatform 都提供了灵活性，可以根据您的项目需求尽可能多地共享代码，而无需牺牲原生体验。您还可以查看大量的 [KMP 案例研究](case-studies.topic)列表，其中展示了许多其他在生产环境中使用该技术的公司。