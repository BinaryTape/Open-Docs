[//]: # (title: 常见问题)
[//]: # (description: Kotlin 是 JetBrains 开发的一种简洁的多平台编程语言。)

### 什么是 Kotlin？

Kotlin 是一种开源的静态类型编程语言，目标平台包括 JVM、Android、JavaScript、Wasm 和 Native。它由 [JetBrains](https://www.jetbrains.com) 开发。该项目于 2010 年启动，并很早就开源了。第一个官方 1.0 版本于 2016 年 2 月发布。

### Kotlin 的当前版本是什么？

当前发布的版本是 %kotlinVersion%，发布于 %kotlinReleaseDate%。您可以在 [GitHub](https://github.com/jetbrains/kotlin) 上找到更多信息。

### Kotlin 免费吗？

是的。Kotlin 是免费的，过去免费，将来也仍将免费。它在 Apache 2.0 许可证下开发，源代码可在 [GitHub](https://github.com/jetbrains/kotlin) 上获取。

### Kotlin 是一种面向对象语言还是函数式语言？

Kotlin 兼具面向对象和函数式构造。您可以使用 OO 和 FP 两种风格，或将两者的元素混合使用。凭借对高阶函数、函数类型和 lambda 等特性的一流支持，如果您正在进行或探索函数式编程，Kotlin 是一个绝佳的选择。

### Kotlin 相对于 Java 编程语言有什么优势？

Kotlin 更简洁。粗略估计，代码行数大约减少 40%。它也更类型安全——例如，对非空类型的支持使应用程序更不容易出现 NPE。其他特性包括智能类型转换 (smart casting)、高阶函数、扩展函数和带接收者的 lambda，这些都提供了编写富有表现力的代码的能力，并有助于创建 DSL。

### Kotlin 与 Java 编程语言兼容吗？

是的。Kotlin 与 Java 编程语言 100% 互操作，并且重点确保您现有的代码库可以与 Kotlin 正确交互。您可以轻松地从 [Java 调用 Kotlin 代码](java-to-kotlin-interop.md) 和从 [Kotlin 调用 Java 代码](java-interop.md)。这使得采用 Kotlin 变得更容易，风险更低。IDE 中还内置了自动化的 [Java 到 Kotlin 转换器](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k)，简化了现有代码的迁移。

### 我可以用 Kotlin 做什么？

Kotlin 可以用于任何类型的开发，无论是服务器端、客户端 Web、Android 还是多平台库。随着 Kotlin/Native 正在开发中，将支持嵌入式系统、macOS 和 iOS 等其他平台。人们正在使用 Kotlin 进行移动和服务器端应用程序开发，以及使用 JavaScript 或 JavaFX 进行客户端开发，还有数据科学等，这只是其中一些可能性。

### 我可以使用 Kotlin 进行 Android 开发吗？

是的。Kotlin 在 Android 上被作为一流语言支持。已有数百个应用程序在 Android 上使用 Kotlin，例如 Basecamp、Pinterest 等。欲了解更多信息，请查看 [Android 开发资源](android-overview.md)。

### 我可以使用 Kotlin 进行服务器端开发吗？

是的。Kotlin 与 JVM 100% 兼容，因此您可以使用任何现有框架，例如 Spring Boot、vert.x 或 JSF。此外，还有用 Kotlin 编写的特定框架，例如 [Ktor](https://github.com/kotlin/ktor)。欲了解更多信息，请查看 [服务器端开发资源](server-overview.md)。

### 我可以使用 Kotlin 进行 Web 开发吗？

是的。对于后端 Web 开发，Kotlin 与 [Ktor](https://ktor.io/) 和 [Spring](https://spring.io/) 等框架配合良好，使您能够高效地构建服务器端应用程序。此外，您可以使用 Kotlin/Wasm 进行客户端 Web 开发。了解如何[开始使用 Kotlin/Wasm](wasm-get-started.md)。

### 我可以使用 Kotlin 进行桌面开发吗？

是的。您可以使用任何 Java UI 框架，例如 JavaFx、Swing 或其他。此外，还有 Kotlin 特定的框架，例如 [TornadoFX](https://github.com/edvin/tornadofx)。

### 我可以使用 Kotlin 进行原生开发吗？

是的。Kotlin/Native 是 Kotlin 的一部分。它将 Kotlin 编译为无需 VM 即可运行的原生代码。您可以在流行的桌面和移动平台甚至一些 IoT 设备上尝试它。欲了解更多信息，请查看 [Kotlin/Native 文档](native-overview.md)。

### 哪些 IDE 支持 Kotlin？

Kotlin 在 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 和 [Android Studio](https://developer.android.com/kotlin/get-started) 中提供全面的开箱即用支持，并附带 JetBrains 开发的官方 Kotlin 插件。

其他 IDE 和代码编辑器仅有社区支持的 Kotlin 插件。

您还可以尝试 [Kotlin Playground](https://play.kotlinlang.org)，在浏览器中编写、运行和分享 Kotlin 代码。

此外，还提供了[命令行编译器](command-line.md)，它为编译和运行应用程序提供了直接的支持。

### 哪些构建工具支持 Kotlin？

在 JVM 方面，主要的构建工具包括 [Gradle](gradle.md)、[Maven](maven.md)、[Ant](ant.md) 和 [Kobalt](https://beust.com/kobalt/home/index.html)。还有一些针对客户端 JavaScript 的构建工具。

### Kotlin 会编译成什么？

当面向 JVM 时，Kotlin 会生成与 Java 兼容的字节码。

当面向 JavaScript 时，Kotlin 会转译为 ES5.1 并生成与包括 AMD 和 CommonJS 在内的模块系统兼容的代码。

当面向原生平台时，Kotlin 会生成特定于平台的代码（通过 LLVM）。

### Kotlin 面向哪些 JVM 版本？

Kotlin 允许您选择用于执行的 JVM 版本。默认情况下，Kotlin/JVM 编译器会生成与 Java 8 兼容的字节码。如果您想利用更新的 Java 版本中可用的优化，可以明确指定目标 Java 版本从 9 到 23。请注意，在这种情况下，生成的字节码可能无法在较低版本上运行。从 [Kotlin 1.5](whatsnew15.md#new-default-jvm-target-1-8) 开始，编译器不再支持生成与 Java 8 以下版本兼容的字节码。

### Kotlin 难学吗？

Kotlin 的灵感来源于现有语言，例如 Java、C#、JavaScript、Scala 和 Groovy。我们努力确保 Kotlin 易于学习，以便人们可以在几天内轻松上手，阅读和编写 Kotlin 代码。学习地道的 Kotlin 并使用其一些更高级的特性可能需要更长的时间，但总的来说，它不是一门复杂的语言。欲了解更多信息，请查看[我们的学习资料](learning-materials-overview.md)。

### 哪些公司正在使用 Kotlin？

使用 Kotlin 的公司太多，无法一一列举，但一些通过博客文章、GitHub 仓库或演讲公开声明使用 Kotlin 的知名公司包括 [Square](https://medium.com/square-corner-blog/square-open-source-loves-kotlin-c57c21710a17)、[Pinterest](https://www.youtube.com/watch?v=mDpnc45WwlI)、[Basecamp](https://signalvnoise.com/svn3/using-kotlin-to-make-android-apis-fun-again/) 和 [Corda](https://corda.net/blog/kotlin/)。

### 谁开发了 Kotlin？

Kotlin 由 [JetBrains 的工程师团队（当前团队规模超过 100 人）](https://www.jetbrains.com/)开发。首席语言设计师是 Michail Zarečenskij。除了核心团队之外，GitHub 上还有超过 250 名外部贡献者。

### 我可以在哪里了解更多关于 Kotlin 的信息？

最好的起点是[我们的网站](https://kotlinlang.org)。要开始使用 Kotlin，您可以安装一个[官方 IDE](kotlin-ide.md) 或[在线试用](https://play.kotlinlang.org)。

### 有关于 Kotlin 的书籍吗？

有许多关于 Kotlin 的书籍可供选择。其中一些我们已经审查过，并可以推荐作为入门。它们列在[书籍](books.md)页面上。更多书籍请参见 [kotlin.link](https://kotlin.link/) 上的社区维护列表。

### 有没有 Kotlin 的在线课程？

您可以通过 JetBrains Academy 的 [Kotlin 核心学习路径](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23) 学习所有 Kotlin 精要，同时创建可工作的应用程序。

您还可以参加以下其他课程：
* [Pluralsight 课程：Kotlin 入门](https://www.pluralsight.com/courses/kotlin-getting-started)，作者 Kevin Jones
* [O'Reilly 课程：Kotlin 编程入门](https://www.oreilly.com/library/view/introduction-to-kotlin/9781491964125/)，作者 Hadi Hariri
* [Udemy 课程：10 个 Kotlin 新手教程](https://petersommerhoff.com/dev/kotlin/kotlin-beginner-tutorial/)，作者 Peter Sommerhoff

您还可以在我们的 [YouTube 频道](https://www.youtube.com/c/Kotlin) 上查看其他教程和内容。

### Kotlin 有社区吗？

是的！Kotlin 拥有一个非常活跃的社区。Kotlin 开发者活跃于 [Kotlin 论坛](https://discuss.kotlinlang.org)、[StackOverflow](https://stackoverflow.com/questions/tagged/kotlin) 以及更活跃的 [Kotlin Slack](https://slack.kotlinlang.org)（截至 2020 年 4 月，拥有近 30000 名成员）。

### 有 Kotlin 活动吗？

是的！现在有许多用户组和 Meetup 专门围绕 Kotlin 展开。您可以在[网站](https://kotlinlang.org/user-groups/user-group-list.html)上找到列表。此外，全球各地还举办社区组织的 [Kotlin 之夜](https://kotlinlang.org/community/events.html) 活动。

### 有 Kotlin 大会吗？

是的！[KotlinConf](https://kotlinconf.com/) 是由 JetBrains 主办的年度大会，它汇集了来自世界各地的开发者、爱好者和专家，分享他们在 Kotlin 方面的知识和经验。

除了技术演讲和研讨会，KotlinConf 还提供交流机会、社区互动和社交活动，与会者可以在其中与 Kotlin 同好建立联系并交流想法。它作为在 Kotlin 生态系统中促进协作和社区建设的平台。

Kotlin 也在全球各地的不同会议中得到介绍。您可以在[网站](https://kotlinlang.org/community/talks.html?time=upcoming)上找到[即将举行的演讲列表](https://kotlinlang.org/community/talks.html?time=upcoming)。

### Kotlin 在社交媒体上有吗？

是的。
订阅 [Kotlin YouTube 频道](https://www.youtube.com/c/Kotlin) 并在 [Twitter](https://twitter.com/kotlin) 或 [Bluesky](https://bsky.app/profile/kotlinlang.org) 上关注 Kotlin。

### 还有其他在线 Kotlin 资源吗？

网站上有很多[在线资源](https://kotlinlang.org/community/)，包括社区成员的 [Kotlin Digests](https://kotlin.link)、[时事通讯](http://kotlinweekly.net)、[播客](https://talkingkotlin.com) 等。

### 我在哪里可以获得高清 Kotlin Logo？

Logo 可以在[这里](https://resources.jetbrains.com/storage/products/kotlin/docs/kotlin_logos.zip)下载。使用这些 Logo 时，请遵循压缩包内 `guidelines.pdf` 中的简单规则和 [Kotlin 品牌使用指南](https://kotlinfoundation.org/guidelines/)。

欲了解更多信息，请查看关于 [Kotlin 品牌资产](kotlin-brand-assets.md)的页面。