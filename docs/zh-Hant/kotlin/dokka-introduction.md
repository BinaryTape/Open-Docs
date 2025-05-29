[//]: # (title: 介紹)

Dokka 是一個用於 Kotlin 的 API 文件引擎。

就像 Kotlin 本身一樣，Dokka 支援混合語言專案。它理解 Kotlin 的 [KDoc 註解](https://kotlinlang.org/docs/kotlin-doc.html#kdoc-syntax) 和 Java 的 [Javadoc 註解](https://www.oracle.com/technical-resources/articles/java/javadoc-tool.html)。

Dokka 可以產生多種格式的文件，包括其現代 [HTML 格式](dokka-html.md)、多種 [Markdown 形式](dokka-markdown.md)，以及 Java 的 [Javadoc HTML](dokka-javadoc.md)。

以下是一些使用 Dokka 產生其 API 參考文件的函式庫：

* [kotlinx.coroutines](https://kotlinlang.org/api/kotlinx.coroutines/)
* [Bitmovin](https://cdn.bitmovin.com/player/android/3/docs/index.html)
* [Hexagon](https://hexagontk.com/stable/api/)
* [Ktor](https://api.ktor.io/)
* [OkHttp](https://square.github.io/okhttp/5.x/okhttp/okhttp3/)

您可以使用 [Gradle](dokka-gradle.md)、[Maven](dokka-maven.md) 或從[命令列](dokka-cli.md)執行 Dokka。它也[高度可插拔](dokka-plugins.md)。

請參閱 [Dokka 入門](dokka-get-started.md)，以開始使用 Dokka。

## 社群

Dokka 在 [Kotlin 社群 Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 中有一個專屬的 `#dokka` 頻道，您可以在其中討論 Dokka、其外掛以及如何開發它們，並與維護人員取得聯繫。