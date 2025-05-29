[//]: # (title: はじめに)

DokkaはKotlin向けのAPIドキュメントエンジンです。

Kotlin自体と同様に、Dokkaは複数の言語が混在するプロジェクトに対応しています。Kotlinの[KDocコメント](https://kotlinlang.org/docs/kotlin-doc.html#kdoc-syntax)とJavaの[Javadocコメント](https://www.oracle.com/technical-resources/articles/java/javadoc-tool.html)を解釈します。

Dokkaは、独自のモダンな[HTML形式](dokka-html.md)、様々な種類の[Markdown](dokka-markdown.md)、そしてJavaの[Javadoc HTML](dokka-javadoc.md)を含む、複数の形式でドキュメントを生成できます。

以下は、DokkaをAPIリファレンスドキュメントに利用しているライブラリの一部です：

* [kotlinx.coroutines](https://kotlinlang.org/api/kotlinx.coroutines/)
* [Bitmovin](https://cdn.bitmovin.com/player/android/3/docs/index.html)
* [Hexagon](https://hexagontk.com/stable/api/)
* [Ktor](https://api.ktor.io/)
* [OkHttp](https://square.github.io/okhttp/5.x/okhttp/okhttp3/)

Dokkaは、[Gradle](dokka-gradle.md)、[Maven](dokka-maven.md)または[コマンドライン](dokka-cli.md)から実行できます。また、[高いプラグイン性](dokka-plugins.md)も備えています。

Dokkaの使用を始めるための最初のステップとして、[Dokkaの利用を始める](dokka-get-started.md)をご覧ください。

## コミュニティ

Dokkaには、[Kotlin Community Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)に専用の`#dokka`チャンネルがあります。ここでは、Dokkaやそのプラグイン、開発方法についてチャットしたり、メンテナーと連絡を取ったりすることができます。