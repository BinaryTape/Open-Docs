[//]: # (title: 常见问题解答)

<web-summary>Kotlin 是由 JetBrains 开发的一种简洁的多平台编程语言。</web-summary>

### 什么是 Kotlin？

Kotlin 是一种开源的静态类型编程语言，面向 JVM、Android、JavaScript、Wasm 和 Native。它由 [JetBrains](https://www.jetbrains.com) 开发。该项目于 2010 年启动，并很早就已开源。首个官方 1.0 版本于 2016 年 2 月发布。

### Kotlin 当前的版本是什么？

当前发布的版本是 %kotlinVersion%，于 %kotlinReleaseDate% 发布。你可以在 [GitHub 上](https://github.com/jetbrains/kotlin)找到更多信息。

### Kotlin 是免费的吗？

是的。Kotlin 是免费的，过去是，将来也仍然是免费的。它在 Apache 2.0 许可下开发，源代码[在 GitHub 上](https://github.com/jetbrains/kotlin)可用。

### Kotlin 是一种面向对象语言还是函数式语言？

Kotlin 既有面向对象的构造，也有函数式的构造。你可以同时使用面向对象 (OO) 和函数式编程 (FP) 风格来使用它，也可以混合两者的元素。凭借对高阶函数、函数类型和 lambda 表达式等特性的一流支持，如果你正在进行或探索函数式编程，Kotlin 是一个绝佳的选择。

### Kotlin 相对于 Java 编程语言有哪些优势？

Kotlin 更简洁。粗略估计，代码行数大约减少 40%。它也更类型安全——例如，对非空类型的支持使应用程序更不容易出现 NPE。其他特性，包括智能类型转换、高阶函数、扩展函数和带接收者的 lambda 表达式，提供了编写富有表现力的代码的能力，同时也促进了 DSL 的创建。

### Kotlin 与 Java 编程语言兼容吗？

是的。Kotlin 与 Java 编程语言 100% 互操作，并且重点在于确保你现有的代码库可以与 Kotlin 正常交互。你可以轻松地[从 Java 调用 Kotlin 代码](java-to-kotlin-interop.md)以及[从 Kotlin 调用 Java 代码](java-interop.md)。这使得采用 Kotlin 更加容易，风险更低。IDE 中还内置了一个[自动化 Java 转 Kotlin 转换器](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k)，简化了现有代码的迁移。

### 我可以用 Kotlin 做什么？

Kotlin 可以用于任何类型的开发，无论是服务端、客户端 Web、Android，还是多平台库。随着 Kotlin/Native 目前正在开发中，对嵌入式系统、macOS 和 iOS 等其他平台的支持也正在进行。人们正在将 Kotlin 用于移动和服务端应用程序、结合 JavaScript 或 JavaFX 的客户端开发，以及数据科学，这只是列举了一些可能性。

### 我可以将 Kotlin 用于 Android 开发吗？

是的。Kotlin 在 Android 上作为一流语言得到支持。已经有数百个应用程序将 Kotlin 用于 Android，例如 Basecamp、Pinterest 等。欲了解更多信息，请查阅[关于 Android 开发的资源](android-overview.md)。

### 我可以将 Kotlin 用于服务端开发吗？

是的。Kotlin 与 JVM 100% 兼容，因此你可以使用任何现有框架，例如 Spring Boot、vert.x 或 JSF。此外，还有用 Kotlin 编写的特定框架，例如 [Ktor](https://github.com/kotlin/ktor)。欲了解更多信息，请查阅[关于服务端开发的资源](server-overview.md)。

### 我可以将 Kotlin 用于 Web 开发吗？

是的。对于后端 Web 开发，Kotlin 可以很好地与 [Ktor](https://ktor.io/) 和 [Spring](https://spring.io/) 等框架配合使用，使你能够高效地构建服务端应用程序。此外，你可以使用 Kotlin/Wasm 进行客户端 Web 开发。了解如何[开始使用 Kotlin/Wasm](wasm-get-started.md)。

### 我可以将 Kotlin 用于桌面开发吗？

是的。你可以使用任何 Java UI 框架，例如 JavaFx、Swing 或其他。此外，还有 Kotlin 特有的框架，例如 [TornadoFX](https://github.com/edvin/tornadofx)。

### 我可以将 Kotlin 用于原生开发吗？

是的。Kotlin/Native 作为 Kotlin 的一部分可用。它将 Kotlin 编译为无需 VM 即可运行的原生代码。你可以在流行的桌面和移动平台甚至一些 IoT 设备上尝试它。欲了解更多信息，请查阅 [Kotlin/Native 文档](native-overview.md)。

### 哪些 IDE 支持 Kotlin？

Kotlin 在 [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) 和 [Android Studio](https://developer.android.com/kotlin/get-started) 中具有全面的开箱即用支持，并附带由 JetBrains 开发的官方 Kotlin 插件。

其他 IDE 和代码编辑器仅有社区支持的 Kotlin 插件。

你也可以尝试 [Kotlin Playground](https://play.kotlinlang.org) 在浏览器中编写、运行和分享 Kotlin 代码。

此外，还提供[命令行编译器](command-line.md)，它为编译和运行应用程序提供了直接支持。

### 哪些构建工具支持 Kotlin？

在 JVM 方面，主要的构建工具包括 [Gradle](gradle.md) 和 [Maven](maven.md)。还有一些可用的构建工具，面向客户端 JavaScript。

### Kotlin 会编译成什么？

以 JVM 为目标时，Kotlin 会生成 Java 兼容的字节码。

以 JavaScript 为目标时，Kotlin 会转译为 ES5.1，并生成与包括 AMD 和 CommonJS 在内的模块系统兼容的代码。

以 native 为目标时，Kotlin 将生成平台特有的代码（通过 LLVM）。

### Kotlin 面向哪些 JVM 版本？

Kotlin 允许你选择用于执行的 JVM 版本。默认情况下，Kotlin/JVM 编译器会生成 Java 8 兼容的字节码。如果你想利用更新版本 Java 中可用的优化，你可以显式指定目标 Java 版本为 9 到 24。请注意，在这种情况下，生成的字节码可能无法在较低版本上运行。从 [Kotlin 1.5](whatsnew15.md#new-default-jvm-target-1-8) 开始，编译器不支持生成与 Java 8 以下版本兼容的字节码。

### Kotlin 难学吗？

Kotlin 的灵感来源于 Java、C#、JavaScript、Scala 和 Groovy 等现有语言。我们努力确保 Kotlin 易于学习，以便人们可以在几天内轻松上手，阅读和编写 Kotlin 代码。学习惯用 Kotlin 并使用其一些更高级的特性可能需要更长的时间，但总的来说它不是一种复杂的语言。欲了解更多信息，请查阅[我们的学习材料](learning-materials-overview.md)。

### 哪些公司正在使用 Kotlin？

使用 Kotlin 的公司太多，无法一一列出，但一些更知名且已通过博客文章、GitHub 版本库或演讲公开宣布使用 Kotlin 的公司包括 [Square](https://medium.com/square-corner-blog/square-open-source-loves-kotlin-c57c21710a17)、[Pinterest](https://www.youtube.com/watch?v=mDpnc45WwlI)、[Basecamp](https://signalvnoise.com/svn3/using-kotlin-to-make-android-apis-fun-again/) 和 [Corda](https://corda.net/blog/kotlin/)。

### 谁开发了 Kotlin？

Kotlin 由 [JetBrains 的工程师团队（当前团队规模超过 100 人）](https://www.jetbrains.com/)开发。首席语言设计师是 Michail Zarečenskij。除了核心团队，GitHub 上还有超过 250 名外部贡献者。

### 我可以在哪里了解更多关于 Kotlin 的信息？

最好的起点是[我们的网站](https://kotlinlang.org)。要开始使用 Kotlin，你可以安装其中一个[官方 IDE](kotlin-ide.md) 或[在线尝试](https://play.kotlinlang.org)。

### 有关于 Kotlin 的书籍吗？

有许多关于 Kotlin 的书籍可用。其中一些我们已经审阅过，并推荐作为入门书籍。它们列在[书籍](books.md)页面上。更多书籍，请参见 [kotlin.link](https://kotlin.link/) 上由社区维护的列表。

### 有关于 Kotlin 的在线课程吗？

你可通过 JetBrains Academy 的 [Kotlin Core 学习路径](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23)学习所有 Kotlin 要点，同时创建可运行的应用程序。

你还可以参加其他一些课程：
*   [Pluralsight 课程：Kotlin 入门](https://www.pluralsight.com/courses/kotlin-getting-started)，作者 Kevin Jones
*   [O'Reilly 课程：Kotlin 编程简介](https://www.oreilly.com/library/view/introduction-to-kotlin/9781491964125/)，作者 Hadi Hariri
*   [Udemy 课程：10 个 Kotlin 新手教程](https://petersommerhoff.com/dev/kotlin/kotlin-beginner-tutorial/)，作者 Peter Sommerhoff

你还可以查看[我们 YouTube 频道](https://www.youtube.com/c/Kotlin)上的其他教程和内容。

### Kotlin 有社区吗？

是的！Kotlin 拥有一个非常活跃的社区。Kotlin 开发者活跃在 [Kotlin 论坛](https://discuss.kotlinlang.org)、[StackOverflow](https://stackoverflow.com/questions/tagged/kotlin)，以及更活跃于 [Kotlin Slack](https://slack.kotlinlang.org)（截至 2020 年 4 月，成员接近 30000 名）。

### 有 Kotlin 活动吗？

是的！现在有许多用户组和聚会专门围绕 Kotlin。你可以在[网站上找到列表](https://kotlinlang.org/user-groups/user-group-list.html)。此外，世界各地还有社区组织的 [Kotlin 之夜](https://kotlinlang.org/community/events.html)活动。

### 有 Kotlin 大会吗？

是的！[KotlinConf](https://kotlinconf.com/) 是由 JetBrains 主办的年度大会，汇集了来自世界各地的开发者、爱好者和专家，分享他们关于 Kotlin 的知识和经验。

除了技术讲座和研讨会，KotlinConf 还提供交流机会、社区互动和社交活动，与会者可以与其他 Kotlin 用户建立联系并交流想法。它为在 Kotlin 生态系统中促进协作和社区建设提供了一个平台。

Kotlin 也在世界各地的不同大会上被涵盖。你可以在[网站上找到即将举行的演讲列表](https://kotlinlang.org/community/talks.html?time=upcoming)。

### Kotlin 在社交媒体上吗？

是的。订阅[Kotlin YouTube 频道](https://www.youtube.com/c/Kotlin)并在 [Twitter](https://twitter.com/kotlin) 或 [Bluesky](https://bsky.app/profile/kotlinlang.org) 上关注 Kotlin。

### 还有其他在线 Kotlin 资源吗？

网站上有大量[在线资源](https://kotlinlang.org/community/)，包括由社区成员提供的 [Kotlin Digests](https://kotlin.link)、[新闻通讯](http://kotlinweekly.net)、[播客](https://talkingkotlin.com)等。

### 我在哪里可以获取高清 Kotlin 标志？

标志可以[在此](https://resources.jetbrains.com/storage/products/kotlin/docs/kotlin_logos.zip)下载。使用标志时，请遵循存档内 `guidelines.pdf` 中的简单规则和 [Kotlin 品牌使用指南](https://kotlinfoundation.org/guidelines/)。

欲了解更多信息，请查阅[Kotlin 品牌资产](kotlin-brand-assets.md)页面。