[//]: # (title: 简介)

Dokka 是一个适用于 Kotlin 的 API 文档引擎。

就像 Kotlin 本身一样，Dokka 也支持混合语言项目。它能够理解 Kotlin 的 [KDoc 注释](https://kotlinlang.org/docs/kotlin-doc.html#kdoc-syntax)和 Java 的 [Javadoc 注释](https://www.oracle.com/technical-resources/articles/java/javadoc-tool.html)。

Dokka 可以生成多种格式的文档，包括其现代化的 [HTML 格式](dokka-html.md)、Java 的 [Javadoc HTML](dokka-javadoc.md)，以及 [GFM](https://github.com/Kotlin/dokka/blob/8e5c63d035ef44a269b8c43430f43f5c8eebfb63/dokka-subprojects/plugin-gfm/README.md) 和 [Jekyll](https://github.com/Kotlin/dokka/blob/8e5c63d035ef44a269b8c43430f43f5c8eebfb63/dokka-subprojects/plugin-jekyll/README.md) 风格的 Markdown。

以下是一些使用 Dokka 生成 API 参考文档的库：

* [kotlinx.coroutines](https://kotlinlang.org/api/kotlinx.coroutines/)
* [Bitmovin](https://cdn.bitmovin.com/player/android/3/docs/index.html)
* [Hexagon](https://hexagontk.com/stable/api/)
* [Ktor](https://api.ktor.io/)
* [OkHttp](https://square.github.io/okhttp/5.x/okhttp/okhttp3/)

您可以使用 [Gradle](dokka-gradle.md)、[Maven](dokka-maven.md) 或通过[命令行](dokka-cli.md)运行 Dokka。它还具有[高度可插拔性](dokka-plugins.md)。

请参阅 [Dokka 使用入门](dokka-get-started.md)开始您的 Dokka 之旅。

## 社区

Dokka 在 [Kotlin 社区 Slack](https://kotl.in/slack) 中设有专门的 `#dokka` 频道，您可以在那里讨论 Dokka 及其插件以及如何开发它们，并与维护者取得联系。