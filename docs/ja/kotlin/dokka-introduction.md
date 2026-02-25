[//]: # (title: はじめに)

Dokkaは、Kotlin向けのAPIドキュメントエンジンです。

Kotlin自体と同様に、Dokkaは混合言語プロジェクトをサポートしています。Kotlinの[KDocコメント](https://kotlinlang.org/docs/kotlin-doc.html#kdoc-syntax)とJavaの[Javadocコメント](https://www.oracle.com/technical-resources/articles/java/javadoc-tool.html)を理解します。

Dokkaは、独自のモダンな[HTML形式](dokka-html.md)、Javaの[Javadoc HTML](dokka-javadoc.md)、さらにMarkdownの[GFM](https://github.com/Kotlin/dokka/blob/8e5c63d035ef44a269b8c43430f43f5c8eebfb63/dokka-subprojects/plugin-gfm/README.md)や[Jekyll](https://github.com/Kotlin/dokka/blob/8e5c63d035ef44a269b8c43430f43f5c8eebfb63/dokka-subprojects/plugin-jekyll/README.md)といった、複数の形式でドキュメントを生成できます。

以下は、APIリファレンスドキュメントにDokkaを使用しているライブラリの例です。

* [kotlinx.coroutines](https://kotlinlang.org/api/kotlinx.coroutines/)
* [Bitmovin](https://cdn.bitmovin.com/player/android/3/docs/index.html)
* [Hexagon](https://hexagontk.com/stable/api/)
* [Ktor](https://api.ktor.io/)
* [OkHttp](https://square.github.io/okhttp/5.x/okhttp/okhttp3/)

Dokkaは、[Gradle](dokka-gradle.md)、[Maven](dokka-maven.md)、または[コマンドライン](dokka-cli.md)から実行できます。また、[拡張性が非常に高い](dokka-plugins.md)のも特徴です。

Dokkaを使い始めるための第一歩については、[Dokkaを使ってみる](dokka-get-started.md)を参照してください。

## コミュニティ

[KotlinコミュニティのSlack](https://kotl.in/slack)には専用の`#dokka`チャンネルがあり、Dokkaやそのプラグイン、およびそれらの開発方法についてチャットしたり、メンテナンス担当者と連絡を取ったりすることができます。