[//]: # (title: 生产环境中的 Kotlin 与 Compose Multiplatform：真实世界用例)

<web-summary>了解 Kotlin Multiplatform 与 Compose Multiplatform 是如何在真实项目的生产环境中使用的。探索包含示例的实际用例。</web-summary>

> 随着全球大大小小的公司纷纷采用 Kotlin Multiplatform (KMP) 与 Compose Multiplatform，该技术已成为构建和扩展现代跨平台应用的可信解决方案。
> 
{style="note"}

从集成到现有应用和共享应用逻辑，到构建新的跨平台应用，[Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/) 已成为许多公司的首选技术。这些团队正在利用 KMP 提供的优势来更快地推出产品并降低开发成本。

越来越多的企业也开始采用 [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/)，这是一个由 Kotlin Multiplatform 和 Google 的 Jetpack Compose 提供支持的声明式 UI 框架。随着 [iOS 正式版发布](https://blog.jetbrains.com/kotlin/2025/05/compose-multiplatform-1-8-0-released-compose-multiplatform-for-ios-is-stable-and-production-ready/)，Compose Multiplatform 完善了整个版图，使 KMP 成为跨平台移动开发的完整解决方案。

随着采用率的增长，本文将探讨 Kotlin Multiplatform 是如何在不同行业和团队结构中应用于生产环境的。

## 按业务类型和团队划分的 Kotlin Multiplatform 用例

以下是不同团队应用 Kotlin Multiplatform 以满足各种项目需求的几种方式：

### 启动全新项目（Greenfield Project）的初创公司

初创公司通常在资源有限且截止日期紧迫的情况下运作。为了最大化开发效率和成本效益，他们从使用共享代码库定位多个平台中获益——尤其是在产品早期阶段或 MVP 中，上市时间至关重要。

对于希望同时共享逻辑和 UI 的公司，Kotlin Multiplatform 与 Compose Multiplatform 提供了理想的解决方案。你可以从共享 UI 开始，实现快速原型设计。你甚至可以将原生 UI 与共享 UI 混合搭配。这使得 KMP 与 Compose Multiplatform 成为新项目的理想选择，帮助初创公司在速度、灵活性和高质量原生体验之间取得平衡。

**案例研究：**

* [Instabee](https://www.youtube.com/watch?v=YsQ-2lQYQ8M) 将其 Android 应用逻辑和 UI 迁移到了 Kotlin Multiplatform 与 Compose Multiplatform。通过有效地使用 Android 代码库，该公司能够在短时间内发布其 iOS 应用。
* [Respawn Pro](https://youtu.be/LB5a2FRrT94?si=vgcJI-XoCrWree3u) 开发了一款习惯追踪和生产力应用。其 iOS 应用使用 Compose Multiplatform 构建，与 Android 共享了 96% 的代码。

> 如果你正在 [Kotlin Multiplatform 与 Flutter](https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-flutter.html) 之间进行选择，请不要错过我们对这两种技术的概述。
> 
{style="tip"}

### 中小型企业

中小型企业通常拥有精简的团队，同时维护着成熟且功能丰富的产品。Kotlin Multiplatform 允许他们共享核心逻辑，同时保持用户期望的原生外观。通过依赖现有代码库，这些团队可以在不损害用户体验的情况下加速开发。

KMP 还支持渐进式引入跨平台能力的灵活方法。这使得它对于演进现有应用或发布新功能的团队特别有效，有助于减少开发时间、降低开销，并在需要时维护特定平台的自定义设置。

**案例研究：**

* [Down Dog](https://kotlinlang.org/lp/multiplatform/case-studies/down-dog/?_gl=1*xdrptd*_gcl_au*ODIxNDk5NDA4LjE3MjEwNDg0OTY.*_ga*MTY1Nzk3NDc4MC4xNzA1NDc1NDcw*_ga_9J976DJZ68*MTcyNzg1MTIzNS4yMzcuMS4xNzI3ODUxNDM0LjU2LjAuMA..) 为其应用采用了“最大化共享 Kotlin”策略，为移动设备带来了类似工作室的瑜伽体验。该公司在客户端和服务器之间共享各种帮助程序，并使用 Kotlin Multiplatform 共享了大部分客户端代码。该团队通过保留仅限原生的视图，成功地显著提升了应用的开发速度。
* [Doist](https://www.youtube.com/watch?v=z-o9MqN86eE) 在其屡获殊荣的待办事项列表应用 Todoist 中使用了 Kotlin Multiplatform。该团队在 Android 和 iOS 之间共享了关键逻辑，以确保行为一致并简化开发。它从内部库开始，渐进式地采用了 KMP。

### 需要跨设备应用行为一致的企业

大型应用通常拥有庞大的代码库，不断添加新功能，且复杂的业务逻辑必须在所有平台上以相同方式运行。Kotlin Multiplatform 提供渐进式集成，允许团队分步采用。由于开发者可以重用现有的 Kotlin 技能，使用 KMP 还能让他们免于引入新的技术栈。

**案例研究：** [Forbes](https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/)、[McDonald’s](https://medium.com/mcdonalds-technical-blog/mobile-multiplatform-development-at-mcdonalds-3b72c8d44ebc)、[Google Docs](https://www.youtube.com/watch?v=5lkZj4v4-ks)、[Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8)、[VMware](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0)、[Cash App](https://kotlinlang.org/lp/multiplatform/case-studies/cash-app?_gl=1*1qc1ixl*_gcl_aw*R0NMLjE3NTEzNTcwMDguRUFJYUlRb2JDaE1JblBLRmc0cWJqZ01WZ0VnZENSM3pYQkVWRUFFWUFTQUFFZ0ltOVBEX0J3RQ..*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTE1MjQ2MDUkbzcxJGcxJHQxNzUxNTI3Njc5JGozJGwwJGgw)、[百度的 Wonder App](https://kotlinlang.org/lp/multiplatform/case-studies/baidu)

[![了解 KMP 成功案例](kmp-success-stories.svg){width="700"}{style="block"}](https://kotlinlang.org/case-studies/?type=multiplatform)

### 代理机构

代理机构和咨询公司与各种各样的客户合作，必须适应广泛的平台要求和业务目标。对于在紧迫的期限和有限的工程团队下管理多个项目的团队来说，使用 Kotlin Multiplatform 重用代码的能力尤为宝贵。通过采用 KMP，代理机构可以加速交付并保持跨平台的应用行为一致。

**案例研究：**

* [Touchlab](https://touchlab.co/) 专注于 Kotlin Multiplatform 的跨平台开发和咨询工作。Touchlab 还创建了改进 iOS 开发体验的工具，例如增强从 Kotlin 发布的 Swift API 的 [SKIE](https://github.com/touchlab/SKIE)，以及 [适用于 Xcode 的 Kotlin 插件](https://github.com/touchlab/xcode-kotlin)。
* [IceRock](https://icerockdev.com/) 是一家外包公司，使用 Kotlin Multiplatform 为其客户开发应用。其应用组合涵盖了各种业务需求，并辅以大量开源 Kotlin Multiplatform 库，增强了 Kotlin Multiplatform 的开发过程。
* [Mirego](https://kotlinlang.org/lp/multiplatform/case-studies/mirego/) 是一个端到端数字产品团队，使用 Kotlin Multiplatform 在 Web、iOS、tvOS、Android 和 Amazon Fire TV 上运行相同的业务逻辑。KMP 允许他们在充分利用每个平台优势的同时简化开发。

### 拓展新市场的公司

一些公司希望通过在之前未涉足的平台上发布应用来进入新市场，例如从仅限 iOS 转向包含 Android，反之亦然。

KMP 帮助你在利用现有 iOS 代码和开发实践的同时，在 Android 上保持原生性能和 UI 灵活性。如果你想保持特定平台的用户体验并利用现有知识和代码，KMP 可能是理想的长期解决方案。

**案例研究：** [Instabee](https://www.youtube.com/watch?v=YsQ-2lQYQ8M) 使用 Kotlin Multiplatform 与 Compose Multiplatform 迁移了其 Android 应用逻辑和 UI。通过重用大部分现有的 Android 代码库，这使得该公司能够迅速进入 iOS 市场。

### 开发软件开发工具包 (SDK) 的团队

共享的 Kotlin 代码编译为平台特定的二进制文件（用于 Android 的 JVM，用于 iOS 的原生代码），并无缝集成到任何项目中。它提供了灵活性，你可以无限制地使用平台特定的 API，同时还能让你在原生和跨平台 UI 之间进行选择。这些特性使 Kotlin Multiplatform 成为开发移动 SDK 的绝佳选择。从消费者的角度来看，你的 Kotlin Multiplatform SDK 表现得就像任何普通的平台特定依赖项，同时仍然提供共享代码的好处。

**案例研究：** [Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8) 在其 HealthSuite 数字平台移动 SDK 中使用了 Kotlin Multiplatform，从而能够更快地开发新功能，并加强了 Android 和 iOS 开发者之间的协作。

## 按行业划分的 Kotlin Multiplatform 用例

Kotlin Multiplatform 的通用性从其在广泛行业中的生产应用可见一斑。从金融科技到教育，KMP 与 Compose Multiplatform 已被应用于许多类型的应用中。以下是一些特定行业的示例：

### 金融科技

金融科技应用通常涉及复杂的业务逻辑、安全的工作流程和严格的合规要求，所有这些都必须在各平台间一致地实现。Kotlin Multiplatform 有助于在一个代码库中统一核心逻辑，降低特定平台不一致的风险。它确保了 iOS 和 Android 之间更快的功能对等，这对于钱包和支付等应用至关重要。

**案例研究：** [Cash App](https://kotlinlang.org/lp/multiplatform/case-studies/cash-app)、[Bitkey by Block](https://engineering.block.xyz/blog/how-bitkey-uses-cross-platform-development)、[Worldline](https://blog.worldline.tech/2022/01/26/kotlin_multiplatform.html)

### 媒体与出版

媒体和内容驱动的应用依赖于快速的功能推出、一致的用户体验以及为每个平台自定义 UI 的灵活性。Kotlin Multiplatform 允许团队共享内容动态和探索部分的核心逻辑，同时保持对原生 UI 的完全控制。这加速了开发，减少了昂贵的重复工作，并确保了跨平台的功能对等。

**案例研究：** [Forbes](https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/)、[9GAG](https://raymondctc.medium.com/adopting-kotlin-multiplatform-mobile-kmm-on-9gag-app-dfe526d9ce04)、[快手 (Kuaishou)](https://medium.com/@xiang.j9501/case-studies-kuaiying-kotlin-multiplatform-mobile-268e325f8610)

### 项目管理与生产力

从共享日历到实时协作，生产力应用需要功能丰富的特性，且在所有平台上必须表现一致。Kotlin Multiplatform 帮助团队在一个共享代码库中集中处理这种复杂性，确保在每台设备上都有一致的功能和行为。这种灵活性意味着团队可以更快地发布更新，并保持跨平台统一的用户体验。

**案例研究：** [Wrike](https://www.youtube.com/watch?v=jhBmom8z3Qg)、[VMware](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0)

### 交通与出行

打车、送货和出行平台通过在司机、乘客和商家应用中共享通用功能，从 Kotlin Multiplatform 中获益。实时追踪、路线优化或应用内聊天等服务的核心逻辑可以编写一次并在 Android 和 iOS 上通用，保证所有用户获得一致的行为体验。

**案例研究：** [Bolt](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0)、[Feres](https://kotlinlang.org/case-studies/#case-study-feres)

### 教育科技

教育类应用必须在移动端和 Web 端提供无缝且一致的学习体验，尤其是在支持大规模分布式受众时。通过使用 Kotlin Multiplatform 集中管理学习算法、测验和其他业务逻辑，教育应用可以在每台设备上提供统一的学习体验。这种代码共享可以显著提升性能和一致性——例如，Quizlet 将其共享代码从 JavaScript 迁移到 Kotlin，并在其 Android 和 iOS 应用中都看到了显著的速度提升。

**案例研究：** [Duolingo](https://youtu.be/RJtiFt5pbfs?si=mFpiN9SNs8m-jpFL)、[Quizlet](https://quizlet.com/blog/shared-code-kotlin-multiplatform)、[Chalk](https://kotlinlang.org/lp/multiplatform/case-studies/chalk/?_gl=1*1wxmdrv*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTEwMjI5ODAkbzYwJGcxJHQxNzUxMDIzMTU2JGo1OCRsMCRoMA..)、[Memrise](https://engineering.memrise.com/kotlin-multiplatform-memrise-3764b5a4a0db)、[Physics Wallah](https://kotlinlang.org/case-studies/#case-study-physics-wallah)

### 电子商务

构建跨平台购物体验意味着要在共享业务逻辑与原生功能（如支付、摄像头访问和地图）之间取得平衡。Kotlin Multiplatform 与 Compose Multiplatform 使团队能够跨平台共享业务逻辑和 UI，同时在需要时仍能使用平台特定的组件。这种混合方法确保了更快的开发、一致的用户体验以及集成关键原生功能的灵活性。

**案例研究：** [Balary Market](https://kotlinlang.org/case-studies/#case-study-balary)、[Markaz](https://kotlinlang.org/case-studies/#case-study-markaz)

### 社交网络与社区

在社交平台上，及时的功能交付和一致的交互对于保持社区活跃和跨设备连接至关重要。关键的交互逻辑可能包括消息传递、通知或调度。例如，允许用户查找当地小组、活动和活跃度的 Meetup，由于采用了 KMP，能够同时发布新功能。

**案例研究：** [Meetup](https://youtu.be/GtJBS7B3eyM?si=lNX3KMhSTCICFPxv)

### 健康与健身

无论是指导瑜伽课程还是跨设备同步健康数据，健身应用都依赖于响应速度和可靠的跨平台行为。这些应用通常需要共享核心功能，如锻炼逻辑和数据处理，同时保持完全原生的 UI 和特定平台的集成，如传感器、通知或健康 API。

**案例研究：** [Respawn Pro](https://youtu.be/LB5a2FRrT94?si=vgcJI-XoCrWree3u)、[Fast&amp;Fit](https://kotlinlang.org/case-studies/#case-study-fast-and-fit)、[Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8)、[Down Dog](https://kotlinlang.org/lp/multiplatform/case-studies/down-dog)

### 邮政服务

虽然不是常见的用例，但 Kotlin Multiplatform 甚至被一家拥有 377 年历史的国家邮政服务所采用。挪威的 Posten Bring 使用 KMP 统一了数十个前端和后端系统的复杂业务逻辑，帮助他们简化了工作流程，并将推出新服务所需的时间从几个月大幅缩短到几天。

**案例研究：** [Posten Bring](https://2024.javazone.no/program/a1d9aeac-ffc3-4b1d-ba08-a0568f415a02)

这些示例强调了 Kotlin Multiplatform 几乎可以用于任何行业或应用类型。无论你是在构建金融科技应用、出行解决方案、教育平台还是其他应用，Kotlin Multiplatform 都提供了灵活性，让你能够在不牺牲原生体验的前提下，共享对项目有意义的尽可能多的代码。你还可以查看广泛的 [KMP 案例研究](https://kotlinlang.org/case-studies/?type=multiplatform) 列表，其中展示了许多其他在生产环境中使用该技术的公司。