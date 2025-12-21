[//]: # (title: 簡介)

Dokka 是一個適用於 Kotlin 的 API 文件引擎。

就像 Kotlin 本身一樣，Dokka 支援混合語言專案。它理解 Kotlin 的
[KDoc 註解](https://kotlinlang.org/docs/kotlin-doc.html#kdoc-syntax) 和 Java 的
[Javadoc 註解](https://www.oracle.com/technical-resources/articles/java/javadoc-tool.html)。

Dokka 可以生成多種格式的文件，包括其自身的現代化 [HTML 格式](dokka-html.md)、Java 的 [Javadoc HTML](dokka-javadoc.md)，以及
[GFM](https://github.com/Kotlin/dokka/blob/8e5c63d035ef44a269b8c43430f43f5c8eebfb63/dokka-subprojects/plugin-gfm/README.md) 和
[Jekyll](https://github.com/Kotlin/dokka/blob/8e5c63d035ef44a269b8c43430f43f5c8eebfb63/dokka-subprojects/plugin-jekyll/README.md) 兩種 Markdown 變體。

以下是一些使用 Dokka 作為其 API 參考文件的函式庫：

* [kotlinx.coroutines](https://kotlinlang.org/api/kotlinx.coroutines/)
* [Bitmovin](https://cdn.bitmovin.com/player/android/3/docs/index.html)
* [Hexagon](https://hexagontk.com/stable/api/)
* [Ktor](https://api.ktor.io/)
* [OkHttp](https://square.github.io/okhttp/5.x/okhttp/okhttp3/)

您可以使用 [Gradle](dokka-gradle.md)、[Maven](dokka-maven.md) 或透過 [命令列](dokka-cli.md) 來執行 Dokka。它也
[高度可插拔](dokka-plugins.md)。

請參閱 [Dokka 入門指南](dokka-get-started.md)，以開始使用 Dokka。

## 社群

Dokka 在 [Kotlin 社群 Slack](https://kotl.in/slack) 中有一個專用的 `#dokka` 頻道，
在那裡您可以討論 Dokka、其外掛程式以及如何開發它們，並與維護者聯繫。