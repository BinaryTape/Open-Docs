[//]: # (title: 簡介)

Dokka 是 Kotlin 的 API 文件引擎。

就像 Kotlin 本身一樣，Dokka 支援混合語言專案。它能理解 Kotlin 的 [KDoc 註解](https://kotlinlang.org/docs/kotlin-doc.html#kdoc-syntax) 與 Java 的 [Javadoc 註解](https://www.oracle.com/technical-resources/articles/java/javadoc-tool.html)。

Dokka 可以產生多種格式的文件，包括其專有的現代 [HTML 格式](dokka-html.md)、Java 的 [Javadoc HTML](dokka-javadoc.md)，以及 [GFM](https://github.com/Kotlin/dokka/blob/8e5c63d035ef44a269b8c43430f43f5c8eebfb63/dokka-subprojects/plugin-gfm/README.md) 與 [Jekyll](https://github.com/Kotlin/dokka/blob/8e5c63d035ef44a269b8c43430f43f5c8eebfb63/dokka-subprojects/plugin-jekyll/README.md) 變體的 Markdown。

以下是一些使用 Dokka 產生其 API 參考文件的程式庫：

* [kotlinx.coroutines](https://kotlinlang.org/api/kotlinx.coroutines/)
* [Bitmovin](https://cdn.bitmovin.com/player/android/3/docs/index.html)
* [Hexagon](https://hexagontk.com/stable/api/)
* [Ktor](https://api.ktor.io/)
* [OkHttp](https://square.github.io/okhttp/5.x/okhttp/okhttp3/)

您可以使用 [Gradle](dokka-gradle.md)、[Maven](dokka-maven.md) 或透過 [命令列](dokka-cli.md) 執行 Dokka。它也具有 [高度的可擴充性](dokka-plugins.md)。

請參閱 [開始使用 Dokka](dokka-get-started.md) 以邁出使用 Dokka 的第一步。

## 社群

Dokka 在 [Kotlin Community Slack](https://kotl.in/slack) 中有一個專屬的 `#dokka` 頻道，您可以在那裡討論 Dokka、其外掛程式以及如何開發這些外掛程式，並與維護者聯繫。