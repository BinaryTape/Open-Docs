---
title: 常见问题解答
description: "Kotlin 是一种由 JetBrains 开发的简洁的多平台编程语言。"
---
### 什么是 Kotlin？

Kotlin 是一种开源的静态类型编程语言，目标平台包括 JVM、Android、JavaScript、Wasm 和 Native。
它由 [JetBrains](https://www.jetbrains.com) 开发。该项目于 2010 年启动，并很早就开源了。
第一个正式的 1.0 版本于 2016 年 2 月发布。

### Kotlin 的当前版本是什么？

目前发布的版本是 2.1.20，于 2025 年 3 月 20 日发布。
您可以在 [GitHub](https://github.com/jetbrains/kotlin) 上找到更多信息。

### Kotlin 是免费的吗？

是的。Kotlin 是免费的，一直是免费的，并且将保持免费。它是在 Apache 2.0 许可证下开发的，源代码
可在 [GitHub](https://github.com/jetbrains/kotlin) 上找到。

### Kotlin 是一种面向对象的语言还是函数式语言？

Kotlin 既有面向对象的结构，也有函数式的结构。您可以在 OO 和 FP 风格中使用它，或者混合使用这两种风格的元素。
Kotlin 对高阶函数、函数类型和 lambda 等特性提供了一流的支持，如果您正在进行或探索函数式编程，Kotlin 是一个很好的选择。

### 与 Java 编程语言相比，Kotlin 有哪些优势？

Kotlin 更简洁。粗略估计表明，代码行数减少了大约 40%。
它也更类型安全——例如，对非空类型的支持使应用程序更不容易出现 NPE（NullPointerException，空指针异常）。
其他特性包括智能类型转换（smart casting）、高阶函数、扩展函数和带接收者的 lambda，这些特性提供了编写富有表现力的代码的能力，并有助于创建 DSL（Domain Specific Language，领域特定语言）。

### Kotlin 与 Java 编程语言兼容吗？

是的。Kotlin 与 Java 编程语言 100% 互操作，并且非常重视确保您现有的代码库可以与 Kotlin 正确交互。您可以轻松地[从 Java 调用 Kotlin 代码](java-to-kotlin-interop)和[从 Kotlin 调用 Java 代码](java-interop)。这使得采用更容易且风险更低。还有一个自动化的 [Java 到 Kotlin 转换器内置在 IDE 中](mixing-java-kotlin-intellij#converting-an-existing-java-file-to-kotlin-with-j2k)，简化了现有代码的迁移。

### Kotlin 可以用来做什么？

Kotlin 可以用于任何类型的开发，无论是服务器端、客户端 Web、Android 还是多平台库。
随着 Kotlin/Native 目前正在开发中，它将支持其他平台，如嵌入式系统、macOS 和 iOS。
人们正在使用 Kotlin 开发移动和服务器端应用程序、使用 JavaScript 或 JavaFX 的客户端，以及数据科学，
仅举几个可能性。

### 我可以使用 Kotlin 进行 Android 开发吗？

是的。Kotlin 在 Android 上作为一等公民语言受到支持。已经有数百个应用程序在使用 Kotlin
进行 Android 开发，例如 Basecamp、Pinterest 等。有关更多信息，请查看 [Android 开发资源](android-overview)。

### 我可以使用 Kotlin 进行服务器端开发吗？

是的。Kotlin 与 JVM 100% 兼容，因此您可以使用任何现有的框架，如 Spring Boot、
vert.x 或 JSF。此外，还有用 Kotlin 编写的特定框架，例如 [Ktor](https://github.com/kotlin/ktor)。
有关更多信息，请查看 [服务器端开发资源](server-overview)。

### 我可以使用 Kotlin 进行 Web 开发吗？

是的。对于后端 Web 开发，Kotlin 可以很好地与 [Ktor](https://ktor.io/) 和 [Spring](https://spring.io/) 等框架配合使用，使您能够高效地构建
服务器端应用程序。此外，您可以使用 Kotlin/Wasm 进行客户端 Web 开发。
了解如何 [开始使用 Kotlin/Wasm](wasm-get-started)。

### 我可以使用 Kotlin 进行桌面开发吗？

是的。您可以使用任何 Java UI 框架，如 JavaFx、Swing 或其他框架。
此外，还有 Kotlin 特定的框架，例如 [TornadoFX](https://github.com/edvin/tornadofx)。

### 我可以使用 Kotlin 进行原生开发吗？

是的。Kotlin/Native 作为 Kotlin 的一部分提供。它将 Kotlin 编译为可以在没有 VM 的情况下运行的本机代码。
您可以在流行的桌面和移动平台，甚至是一些 IoT 设备上尝试它。
有关更多信息，请查看 [Kotlin/Native 文档](native-overview)。

### 哪些 IDE 支持 Kotlin？

Kotlin 在 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 和
[Android Studio](https://developer.android.com/kotlin/get-started) 中提供完整的开箱即用支持，
并提供由 JetBrains 开发的官方 Kotlin 插件。

其他 IDE 和代码编辑器只有 Kotlin 社区支持的插件。

您还可以尝试 [Kotlin Playground](https://play.kotlinlang.org)，在浏览器中编写、运行和共享
Kotlin 代码。

此外，还提供了一个 [命令行编译器](command-line)，它为编译和运行应用程序提供了简单的支持。

### 哪些构建工具支持 Kotlin？

在 JVM 方面，主要的构建工具包括 [Gradle](gradle)、[Maven](maven)、
[Ant](ant) 和 [Kobalt](https://beust.com/kobalt/home/index.html)。还有一些构建工具可用于
面向客户端 JavaScript。

### Kotlin 编译成什么？

当以 JVM 为目标时，Kotlin 会生成与 Java 兼容的字节码。

当以 JavaScript 为目标时，Kotlin 会转换为 ES5.1 并生成
与包括 AMD 和 CommonJS 在内的模块系统兼容的代码。

当以 native 为目标时，Kotlin 将生成特定于平台的代码（通过 LLVM）。

### Kotlin 针对哪些版本的 JVM？

Kotlin 允许您选择用于执行的 JVM 版本。默认情况下，Kotlin/JVM 编译器生成与 Java 8 兼容的字节码。
如果您想利用 Java 的较新版本中提供的优化，您可以显式指定目标 Java
版本，从 9 到 23。请注意，在这种情况下，生成的字节码可能无法在较低版本上运行。
从 [Kotlin 1.5](whatsnew15#new-default-jvm-target-1-8) 开始，编译器不支持生成与低于 8 的 Java 版本兼容的字节码。

### Kotlin 难学吗？

Kotlin 的灵感来自现有的语言，如 Java、C#、JavaScript、Scala 和 Groovy。我们已尽力确保
Kotlin 易于学习，以便人们可以在几天内轻松上手，阅读和编写 Kotlin 代码。
学习惯用的 Kotlin 并使用其更多高级功能可能需要更长的时间，但总的来说，它不是
一种复杂的语言。
有关更多信息，请查看 [我们的学习资料](learning-materials-overview)。

### 哪些公司在使用 Kotlin？

使用 Kotlin 的公司太多，无法一一列出，但一些更知名的公司已经公开声明使用
Kotlin，无论是通过博客文章、GitHub 存储库还是演讲，包括
[Square](https://medium.com/square-corner-blog/square-open-source-loves-kotlin-c57c21710a17)、[Pinterest](https://www.youtube.com/watch?v=mDpnc45WwlI)、
[Basecamp](https://signalvnoise.com/svn3/using-kotlin-to-make-android-apis-fun-again/) 和 [Corda](https://corda.net/blog/kotlin/)。

### 谁开发 Kotlin？

Kotlin 由 [JetBrains 的一个工程师团队开发（目前团队规模为 100 多人）](https://www.jetbrains.com/)。
首席语言设计师是 Michail Zarečenskij。除了核心团队之外，GitHub 上还有超过 250 名外部贡献者。

### 在哪里可以了解更多关于 Kotlin 的信息？

最好的起点是 [我们的网站](https://kotlinlang.org)。
要开始使用 Kotlin，您可以安装其中一个 [官方 IDE](kotlin-ide) 或 [在线尝试](https://play.kotlinlang.org)。

### 有关于 Kotlin 的书籍吗？

有很多关于 Kotlin 的书籍。其中一些我们已经评论过，可以推荐作为入门读物。它们在
[书籍](books) 页面上列出。有关更多书籍，请参阅社区维护的列表，网址为 [kotlin.link](https://kotlin.link/)。

### 有关于 Kotlin 的在线课程吗？

您可以通过 JetBrains Academy 的 [Kotlin Core 课程](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23) 学习所有 Kotlin 基础知识，同时创建可工作的应用程序。

您可以参加的其他一些课程：
* [Pluralsight 课程：Kotlin 入门](https://www.pluralsight.com/courses/kotlin-getting-started)，作者：Kevin Jones
* [O'Reilly 课程：Kotlin 编程简介](https://www.oreilly.com/library/view/introduction-to-kotlin/9781491964125/)，作者：Hadi Hariri
* [Udemy 课程：10 个面向初学者的 Kotlin 教程](https://petersommerhoff.com/dev/kotlin/kotlin-beginner-tutorial/)，作者：Peter Sommerhoff

您还可以查看我们的 [YouTube 频道](https://www.youtube.com/c/Kotlin) 上的其他教程和内容。

### Kotlin 有社区吗？

是的！Kotlin 拥有一个非常活跃的社区。Kotlin 开发人员经常出没于 [Kotlin 论坛](https://discuss.kotlinlang.org)、
[StackOverflow](https://stackoverflow.com/questions/tagged/kotlin) 并且更活跃于 [Kotlin Slack](https://slack.kotlinlang.org)
（截至 2020 年 4 月，拥有近 30000 名成员）。

### 有 Kotlin 活动吗？

是的！现在有很多用户组和聚会专门围绕 Kotlin 展开。您可以在 [网站上找到列表](https://kotlinlang.org/user-groups/user-group-list.html)。
此外，世界各地还有社区组织的 [Kotlin 之夜](https://kotlinlang.org/community/events.html) 活动。

### 有 Kotlin 会议吗？

是的！[KotlinConf](https://kotlinconf.com/) 是由 JetBrains 主办的年度会议，它汇集了来自世界各地的开发人员、爱好者
和专家，分享他们关于 Kotlin 的知识和经验。

除了技术讲座和研讨会外，KotlinConf 还提供交流机会、社区互动
和社交活动，与会者可以在那里与 Kotlin 同行交流思想。
它是一个促进 Kotlin 生态系统内的协作和社区建设的平台。

Kotlin 也在世界各地的不同会议上被报道。您可以在
[网站上找到即将到来的演讲列表](https://kotlinlang.org/community/talks.html?time=upcoming)。

### Kotlin 在社交媒体上吗？

是的。
订阅 [Kotlin YouTube 频道](https://www.youtube.com/c/Kotlin) 并关注 Kotlin [在 Twitter 上](https://twitter.com/kotlin) 或 [在 Bluesky 上](https://bsky.app/profile/kotlinlang.org)。

### 还有其他在线 Kotlin 资源吗？

该网站有很多 [在线资源](https://kotlinlang.org/community/)，包括社区成员的 [Kotlin 摘要](https://kotlin.link)、
[时事通讯](http://kotlinweekly.net)、[播客](https://talkingkotlin.com) 等。

### 在哪里可以获得高清 Kotlin 标志？

可以在 [此处](https://resources.jetbrains.com/storage/products/kotlin/docs/kotlin_logos.zip) 下载徽标。
使用徽标时，请遵循存档中的 `guidelines.pdf` 和 [Kotlin 品牌使用指南](https://kotlinfoundation.org/guidelines/) 中的简单规则。

有关更多信息，请查看关于 [Kotlin 品牌资产](kotlin-brand-assets) 的页面。