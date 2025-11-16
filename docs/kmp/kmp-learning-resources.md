[//]: # (title: 学习资源)

<web-summary>选择最符合您 KMP 经验水平的学习资料。</web-summary>

我们收集了超过 30 份重要的 Kotlin Multiplatform (KMP) 和 Compose Multiplatform 学习资料。按技能水平浏览，查找适合您经验的教程、课程和文章：

🌱 **初学者**。通过 JetBrains 和 Google 的官方教程学习 KMP 和 Compose 基础知识。使用 Room、Ktor 和 SQLDelight 等核心库构建简单的应用程序。

🌿 **中级**。使用共享 ViewModel、基于 Koin 的依赖注入和整洁架构开发实际应用。通过 JetBrains 和社区教育者提供的课程进行学习。

🌳 **高级**。深入全规模 KMP 工程，涵盖后端和游戏开发用例，以及大型多团队项目的架构扩展和采纳指南。

🧩 **库作者**。创建并发布可复用的 KMP 库。学习 API 设计、Dokka 文档和使用 JetBrains 官方工具与模板进行 Maven 发布。

<Tabs>
<TabItem id="all-resources" title="全部">

<snippet id="source">
<table>

<!-- BEGINNER BLOCK -->
<thead>

<tr>
<th>

**🎚**

</th>
<th>

**资源/**

**类型**

</th>
<th>

**创建者/**
**平台**

</th>

<th>

**您将学到**

</th>
<th>

**价格**

</th>
<th>

**预估时间**

</th>
</tr>

</thead>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Kotlin Multiplatform 概览](kmp-overview.md)

文章

</td>
<td>
JetBrains
</td>

<td>
KMP 的核心价值，实际用例，并为您的项目找到正确的学习路径。
</td>
<td>
免费
</td>
<td>
30 min
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[创建您的第一个 KMP 应用](multiplatform-create-first-app.md)

教程

</td>
<td>
JetBrains
</td>

<td>
如何设置 KMP 项目并在 Android 和 iOS 之间共享简单的业务逻辑，同时保持 UI 完全原生。
</td>
<td>
免费
</td>
<td>
1–2 h
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[开始使用 Kotlin Multiplatform (Google Codelab)](https://developer.android.com/codelabs/kmp-get-started)

教程

</td>
<td>
Google

Android
</td>

<td>
如何将共享 KMP 模块添加到现有 Android 项目并将其与 iOS 集成，使用 SKIE 插件从您的 Kotlin 代码生成地道的 Swift API。
</td>
<td>
免费
</td>
<td>
1–2 h
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[创建您的第一个 Compose Multiplatform 应用](compose-multiplatform-create-first-app.md)

教程

</td>
<td>
JetBrains
</td>

<td>
如何从头开始构建一个完整的 Compose Multiplatform 应用，涵盖基本的 UI 组件、状态管理和资源处理，从一个简单模板逐步完成一个可在 Android、iOS、桌面和 Web 上运行的功能完善的时区应用。
</td>
<td>
免费
</td>
<td>
2–3 h
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[使用 Ktor 和 SQLDelight 创建多平台应用](multiplatform-ktor-sqldelight.md)

教程

</td>
<td>
JetBrains
</td>

<td>
如何使用 Ktor 进行网络通信和 SQLDelight 进行本地数据库存储来构建共享数据层，并将其连接到用 Jetpack Compose (Android) 和 SwiftUI (iOS) 构建的原生 UI。
</td>
<td>
免费
</td>
<td>
4–6 h
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Expected and Actual 声明](multiplatform-expect-actual.md)

文章

</td>
<td>
JetBrains
</td>

<td>
核心 expect/actual 机制，用于从通用代码访问平台特有 API，涵盖使用函数、属性和类等不同策略。
</td>
<td>
免费
</td>
<td>
1–2 h
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[在 KMP 应用中使用平台特有 API](https://www.youtube.com/watch?v=bSNumV04y_w)

视频教程

</td>
<td>
JetBrains

YouTube
</td>

<td>
在您的 KMP 应用中使用平台特有代码的最佳实践。
</td>
<td>
免费
</td>
<td>
15 min
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[适用于 Android 开发者的 KMP](https://nsmirosh.gumroad.com/l/tmmqwa)

视频课程

</td>
<td>
Mykola Miroshnychenko

Gumroad
</td>

<td>
如何通过掌握 expect/actual 和源代码集等 KMP 基础知识，将您现有的 Android 开发技能扩展到 iOS，然后使用 Ktor (网络通信) 和 Room (持久化) 等现代库构建一个完整的应用栈。
</td>
<td>
~$60
</td>
<td>
8–12 h
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Kotlin Multiplatform 大师班](https://www.udemy.com/course/kotlin-multiplatform-masterclass/)

视频课程

</td>
<td>
Petros Efthymiou

Udemy
</td>

<td>
如何从头开始应用整洁架构和 MVI 来构建一个完整的 KMP 应用程序，集成 Ktor、SQLDelight 和 Koin 等一系列基本库，并结合原生的 Jetpack Compose 和 SwiftUI UI。
</td>
<td>
€10–€20
</td>
<td>
6 h
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Compose Multiplatform 全套课程 2025 - 从零到精通](https://www.youtube.com/watch?v=Z92zJzL-6z0&list=PL0pXjGnY7PORAoIX2q7YG2sotapCp4hyl)

视频课程

</td>
<td>
Code with FK

YouTube
</td>

<td>
如何完全使用 Compose Multiplatform 构建一个完整的功能丰富的应用程序，从基础知识到 Firebase Authentication、使用 SQLDelight 进行离线支持以及实时更新等高级的实际功能。
</td>
<td>
免费
</td>
<td>
20 h
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Kotlin Multiplatform 开发](https://www.linkedin.com/learning/kotlin-multiplatform-development)

视频课程

</td>
<td>
Colin Lee

LinkedIn Learning
</td>

<td>
如何在 Compose Multiplatform 和原生 UI 之间进行架构选择，理解 Swift 互操作的基础知识，并全面概览 KMP 在网络通信、持久化和依赖注入方面的基本生态系统。
</td>
<td>
~$30–$40/month
</td>
<td>
3 h
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Kotlin Multiplatform by Tutorials (第 3 版)](https://www.kodeco.com/books/kotlin-multiplatform-by-tutorials/v3.0)

书籍

</td>
<td>
Kodeco Team (Kevin D. Moore, Carlos Mota, Saeed Taheri)
</td>

<td>
通过将原生 UI 连接到 KMP 共享模块，实现网络通信、序列化和持久化来共享代码的基础知识。您还将了解如何应用依赖注入、测试和现代架构来构建可维护且可伸缩的实际应用。
</td>
<td>
~$60
</td>
<td>
40–60 h
</td>
</tr>

<!-- END OF BEGINNER BLOCK -->

<!-- INTERMEDIATE BLOCK -->

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[让您的 Android 应用程序在 iOS 上运行](multiplatform-integrate-in-existing-app.md)

教程

</td>
<td>
JetBrains
</td>

<td>
将现有 Android 应用迁移到 KMP 的实用步骤：将其业务逻辑提取到一个共享模块中，该模块可由原始 Android 应用和新的原生 iOS 项目使用。
</td>
<td>
免费
</td>
<td>
2 h
</td>
</tr>

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[将现有应用迁移到 Room KMP (Google Codelab)](https://developer.android.com/codelabs/kmp-migrate-room)

教程

</td>
<td>
Google

Android
</td>

<td>
如何将现有 Android Room 数据库迁移到共享 KMP 模块，从而允许您在 Android 和 iOS 上复用熟悉的 DAO 和实体。
</td>
<td>
免费
</td>
<td>
2 h
</td>
</tr>

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[如何在 Compose Multiplatform 中共享 ViewModel (带依赖注入！)](https://www.youtube.com/watch?v=O85qOS7U3XQ)

视频教程

</td>
<td>
Philipp Lackner

YouTube
</td>

<td>
如何在一个 Compose Multiplatform 项目中，使用 Koin 进行依赖注入来实现共享 ViewModel，从而使您只需编写一次状态管理逻辑。
</td>
<td>
免费
</td>
<td>
30 min
</td>
</tr>

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[Compose Multiplatform 速成课程 2025](https://www.youtube.com/watch?v=WT9-4DXUqsM)

视频课程

</td>
<td>
Philipp Lackner

YouTube
</td>

<td>
如何使用整洁架构从头开始构建一个完整的、可用于生产的图书应用，涵盖 Ktor (网络通信)、Room (本地数据库)、Koin (依赖注入) 和多平台导航等现代 KMP 技术栈。
</td>
<td>
免费
</td>
<td>
5 h
</td>
</tr>

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[构建工业级多平台应用](https://pl-coding.com/kmp/)

视频课程

</td>
<td>
Philipp Lackner

[pl.coding.com](https://pl-coding.com/)

</td>

<td>
如何通过在原生 UI (Jetpack Compose & SwiftUI) 之间共享 ViewModel 和业务逻辑来构建一个实际的翻译应用，涵盖从整洁架构到两个平台的单元测试、UI 测试和端到端测试的完整开发生命周期。
</td>
<td>
~€99
</td>
<td>
20 h
</td>
</tr>

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[构建工业级 Compose Multiplatform Android 和 iOS 应用](https://pl-coding.com/cmp-mobile)

视频课程

</td>
<td>
Philipp Lackner

[pl.coding.com](https://pl-coding.com/)

</td>

<td>
如何使用完整的 Compose Multiplatform 技术栈从头开始构建一个大型的、离线优先的聊天应用程序，包括 Ktor (实时 WebSocket)、Room (本地持久化) 和 Koin (多模块依赖注入)。
</td>
<td>
~€199
</td>
<td>
34 h
</td>
</tr>

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[Ultimate Compose Multiplatform: Android/iOS 和测试](https://www.udemy.com/course/ultimate-compose-multiplatform-androidios-testing-kotlin/)

视频课程

</td>
<td>
Hamidreza Sahraei

Udemy

</td>

<td>
如何完全使用 Compose Multiplatform 构建一个功能丰富的虚拟加密钱包应用，不仅涵盖核心技术栈 (Ktor, Room, Koin)，还包括健壮的单元/UI 测试和生物识别认证等高级平台集成。
</td>
<td>
~€20
</td>
<td>
8 h
</td>
</tr>
<!-- END OF INTERMEDIATE BLOCK -->

<!-- ADVANCED BLOCK -->

<tr filter="advanced">
<td>
🌳
</td>
<td>

[Kotlin/Swift 互操作百科](https://github.com/kotlin-hands-on/kotlin-swift-interopedia)

文章

</td>
<td>
JetBrains

GitHub
</td>

<td>
与 iOS (Obj-C/Swift) 的互操作、SKIE、KMP-NativeCoroutines、语言特性差异的解决方案、Swift 导出、双向互操作。
</td>
<td>
免费
</td>
<td>
2 h
</td>
</tr>

<tr filter="advanced">
<td>
🌳
</td>
<td>

[适用于 Android 和 iOS 的多模块电商应用 (KMP)](https://www.udemy.com/course/multi-modular-ecommerce-app-for-android-ios-kmp/)

视频课程

</td>
<td>
Stefan Jovanovic

Udemy
</td>

<td>
完整的产品生命周期，从设计电商应用 Figma UI 到使用 Compose Multiplatform 构建一个完整的、带共享 UI 的多模块应用程序，同时创建并集成一个完整的后端，使用 Firebase 服务实现认证、数据库和自动化 Cloud Functions。
</td>
<td>
~€50
</td>
<td>
30 h
</td>
</tr>

<tr filter="advanced">
<td>
🌳
</td>
<td>

[使用 Kotlin Multiplatform 和 Compose 探索 Ktor](https://www.linkedin.com/learning/exploring-ktor-with-kotlin-multiplatform-and-compose)

视频课程

</td>
<td>
Troy Miles

LinkedIn Learning
</td>

<td>
如何构建一个全栈 Kotlin 应用程序，首先创建并将安全的 Ktor 后端部署到 AWS，然后使用 Kotlin Multiplatform 构建带有共享代码的原生客户端来消费您的 API。
</td>
<td>
~$30–$40/month
</td>
<td>
2-3 h
</td>
</tr>

<tr filter="advanced">
<td>
🌳
</td>
<td>

[全栈游戏开发 - Kotlin 和 Compose Multiplatform](https://www.udemy.com/course/full-stack-game-development-kotlin-compose-multiplatform/)

视频课程

</td>
<td>
Stefan Jovanovic

Udemy
</td>

<td>
如何使用 Compose Multiplatform 构建一个完整的 2D 游戏，涵盖物理、碰撞检测、精灵表动画，并将其部署到 Android、iOS、桌面和 Web (通过 Kotlin/Wasm)。
</td>
<td>
~€99
</td>
<td>
8–10 h
</td>
</tr>

<tr filter="advanced">
<td>
🌳
</td>
<td>

[Philipp Lackner 全栈捆绑包: KMP 和 Spring Boot](https://pl-coding.com/full-stack-bundle)

视频课程

</td>
<td>
Philipp Lackner

[pl.coding.com](https://pl-coding.com/)

</td>

<td>
如何架构、构建和部署一个完整的全栈聊天应用程序，涵盖从带有 WebSocket 的多模块 Spring Boot 后端，到离线优先的 Compose Multiplatform 客户端 (Android、iOS、桌面、Web) 和完整的 CI/CD 流水线。
</td>
<td>
~€429
</td>
<td>
55 h
</td>
</tr>

<tr filter="advanced">
<td>
🌳
</td>
<td>

[适用于原生移动团队的 KMP](https://touchlab.co/kmp-teams-intro)

系列文章

</td>
<td>
Touchlab
</td>

<td>
如何在成熟的原生移动团队中驾驭整个 KMP 采纳过程，从获得初步认同和运行技术试点，到通过可持续的实际工作流扩展共享代码库。
</td>
<td>
免费
</td>
<td>
6–8 h
</td>
</tr>

<!-- END OF ADVANCED BLOCK -->

<!-- LIB-AUTHORS BLOCK -->

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[多平台库构建的 API 指南](https://kotlinlang.org/docs/api-guidelines-build-for-multiplatform.html)

文档

</td>
<td>
JetBrains
</td>

<td>
如何设计您的多平台库的公共 API，遵循最大化代码复用和确保广泛平台兼容性的基本最佳实践。
</td>
<td>
免费
</td>
<td>
1–2 h
</td>
</tr>

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[创建您的 Kotlin Multiplatform 库](create-kotlin-multiplatform-library.md)

教程

</td>
<td>
JetBrains
</td>

<td>
如何使用官方入门模板、设置本地 Maven 发布、组织您的库以及配置发布。
</td>
<td>
免费
</td>
<td>
2–3 h
</td>
</tr>

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[使用 Dokka 进行文档编写](https://kotlinlang.org/docs/dokka-introduction.html)

文档

</td>
<td>
JetBrains
</td>

<td>
如何使用 Dokka 自动为您的 KMP 库生成专业的 API 文档，支持多种格式和混合 Kotlin/Java 项目。
</td>
<td>
免费
</td>
<td>
2–3 h
</td>
</tr>

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[KMP 库模板](https://github.com/Kotlin/multiplatform-library-template)

GitHub 模板

</td>
<td>
JetBrains

GitHub
</td>

<td>
如何使用一个预配置了构建设置和发布最佳实践的官方模板，快速启动一个新的 KMP 库项目。
</td>
<td>
免费
</td>
<td>
1 h
</td>
</tr>

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[发布到 Maven Central](multiplatform-publish-libraries.md)

教程

</td>
<td>
JetBrains
</td>

<td>
将您的 KMP 库发布到 Maven Central 的完整、循序渐进的过程，包括设置凭据、配置发布插件以及使用 CI 自动化此过程。
</td>
<td>
免费
</td>
<td>
3–4 h
</td>
</tr>

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[Kotlin Multiplatform 库](https://www.linkedin.com/learning/kotlin-multiplatform-libraries)

视频课程

</td>
<td>
LinkedIn Learning
</td>

<td>
创建 KMP 库的完整生命周期，从高效的 API 设计和代码共享策略到最终分发和最佳实践。
</td>
<td>
~$30–$40/month
</td>
<td>
2-3 h
</td>
</tr>

<!-- END OF LIB-AUTHORS BLOCK -->

</table>
</snippet>

<!-- END OF REVOKED BLOCK -->

</TabItem>

<TabItem id="beginner" title="🌱 初学者">

<include element-id="source" use-filter="empty,beginner" from="kmp-learning-resources.md"/>

</TabItem>

<TabItem id="intermediate" title="🌿 中级">

<include element-id="source" use-filter="empty,intermediate" from="kmp-learning-resources.md"/>

</TabItem>

<TabItem id="advanced" title="🌳 高级">

<include element-id="source" use-filter="empty,advanced" from="kmp-learning-resources.md"/>

</TabItem>

<TabItem id="lib-authors" title="🧩 库作者">

<include element-id="source" use-filter="empty,lib-authors" from="kmp-learning-resources.md"/>

</TabItem>

</Tabs>