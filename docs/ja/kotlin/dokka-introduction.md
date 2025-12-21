[//]: # (title: はじめに)

DokkaはKotlin向けのAPIドキュメンテーションエンジンです。

Kotlin自体と同様に、Dokkaは複数言語のプロジェクトをサポートしています。DokkaはKotlinの
[KDocコメント](https://kotlinlang.org/docs/kotlin-doc.html#kdoc-syntax)とJavaの
[Javadocコメント](https://www.oracle.com/technical-resources/articles/java/javadoc-tool.html)を理解します。

Dokkaは、独自のモダンな[HTML形式](dokka-html.md)、Javaの[Javadoc HTML](dokka-javadoc.md)に加え、
[GFM](https://github.com/Kotlin/dokka/blob/8e5c63d035ef44a269b8c43430f43f5c8eebfb63/dokka-subprojects/plugin-gfm/README.md)および
[Jekyll](https://github.com/Kotlin/dokka/blob/8e5c63d035ef44a269b8c43430f43f5c8eebfb63/dokka-subprojects/plugin-jekyll/README.md)形式のMarkdownなど、複数の形式でドキュメントを生成できます。

DokkaをAPIリファレンスドキュメンテーションに使用しているライブラリをいくつか紹介します。

*   [kotlinx.coroutines](https://kotlinlang.org/api/kotlinx.coroutines/)
*   [Bitmovin](https://cdn.bitmovin.com/player/android/3/docs/index.html)
*   [Hexagon](https://hexagontk.com/stable/api/)
*   [Ktor](https://api.ktor.io/)
*   [OkHttp](https://square.github.io/okhttp/5.x/okhttp/okhttp3/)

Dokkaは[Gradle](dokka-gradle.md)、[Maven](dokka-maven.md)または[コマンドライン](dokka-cli.md)から実行できます。また、
[高い拡張性](dokka-plugins.md)も備えています。

Dokkaの使用を始めるには、[Dokkaを使ってみる](dokka-get-started.md)を参照してください。

## コミュニティ

Dokkaには、[Kotlin Community Slack](https://kotl.in/slack)内に専用の`#dokka`チャンネルがあり、
Dokka、そのプラグイン、それらの開発方法についてチャットしたり、メンテナーと連絡を取ったりできます。