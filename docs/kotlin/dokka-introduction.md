[//]: # (title: 简介)

Dokka 是一个用于 Kotlin 的 API 文档引擎。

如同 Kotlin 本身一样，Dokka 支持混合语言项目。它能理解 Kotlin 的
[KDoc 注释](https://kotlinlang.org/docs/kotlin-doc.html#kdoc-syntax)和 Java 的
[Javadoc 注释](https://www.oracle.com/technical-resources/articles/java/javadoc-tool.html)。

Dokka 可以生成多种格式的文档，包括其现代 [HTML 格式](dokka-html.md)、Java 的 [Javadoc HTML](dokka-javadoc.md)，以及
[GFM](https://github.com/Kotlin/dokka/blob/8e5c63d035ef44a269b8c43430f43f5c8eebfb63/dokka-subprojects/plugin-gfm/README.md) 和
[Jekyll](https://github.com/Kotlin/dokka/blob/8e5c63d035ef44a269b8c43430f43f5c8eebfb63/dokka-subprojects/plugin-jekyll/README.md) 风格的 Markdown。

以下是一些使用 Dokka 生成其 API 参考文档的库：

* [kotlinx.coroutines](https://kotlinlang.org/api/kotlinx.coroutines/)
* [Bitmovin](https://cdn.bitmovin.com/player/android/3/docs/index.html)
* [Hexagon](https://hexagontk.com/stable/api/)
* [Ktor](https://api.ktor.io/)
* [OkHttp](https://square.github.io/okhttp/5.x/okhttp/okhttp3/)

你可以使用 [Gradle](dokka-gradle.md)、[Maven](dokka-maven.md) 或从[命令行](dokka-cli.md)运行 Dokka。它也
[高度可插拔](dokka-plugins.md)。

关于使用 Dokka 的第一步，请参见 [Dokka 入门指南](dokka-get-started.md)。

## 社区

Dokka 在 [Kotlin 社区 Slack](https://kotl.in/slack) 中有一个专门的 `#dokka` 频道，你可以在其中讨论 Dokka、其插件以及如何开发它们，并与维护者取得联系。