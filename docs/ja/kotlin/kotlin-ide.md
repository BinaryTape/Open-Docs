---
title: Kotlin開発用IDE
description: "JetBrainsは、IntelliJ IDEAとAndroid Studioに対し、Kotlinの公式IDEサポートを提供しています。"
---
JetBrains は、以下の IDE (Integrated Development Environment) およびコードエディターに対する公式の Kotlin サポートを提供しています。
[IntelliJ IDEA](#intellij-idea) と [Android Studio](#android-studio) です。

その他の IDE およびコードエディターについては、Kotlin コミュニティがサポートするプラグインのみが存在します。

## IntelliJ IDEA

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) は、Kotlin や Java などの JVM 言語向けに設計された IDE で、開発者の生産性を最大限に高めます。
高度なコード補完、静的コード解析、リファクタリングを提供することで、ルーチンで反復的なタスクを自動化します。
ソフトウェア開発の明るい面に集中でき、生産性が向上するだけでなく、楽しい経験にもなります。

Kotlin プラグインは、各 IntelliJ IDEA リリースにバンドルされています。
各 IDEA リリースでは、IDE における Kotlin 開発者のエクスペリエンスを向上させる新機能やアップグレードが導入されています。
最新のアップデートと Kotlin の改善点については、[IntelliJ IDEA の新機能](https://www.jetbrains.com/idea/whatsnew/) を参照してください。

IntelliJ IDEA の詳細については、[公式ドキュメント](https://www.jetbrains.com/help/idea/discover-intellij-idea.html)を参照してください。

## Android Studio

[Android Studio](https://developer.android.com/studio) は、Android アプリ開発用の公式 IDE であり、[IntelliJ IDEA](https://www.jetbrains.com/idea/) をベースにしています。
IntelliJ の強力なコードエディターと開発ツールに加えて、Android Studio は Android アプリの構築時に生産性をさらに向上させる機能を提供します。

Kotlin プラグインは、各 Android Studio リリースにバンドルされています。

Android Studio の詳細については、[公式ドキュメント](https://developer.android.com/studio/intro)を参照してください。

## Eclipse

[Eclipse](https://eclipseide.org/release/) を使用すると、開発者は Kotlin を含むさまざまなプログラミング言語でアプリケーションを作成できます。また、Kotlin プラグインも備えています。元々は JetBrains によって開発されましたが、現在では Kotlin コミュニティの貢献者によってサポートされています。

[Marketplace から Kotlin プラグインを手動でインストールできます](https://marketplace.eclipse.org/content/kotlin-plugin-eclipse)。

Kotlin チームは、Eclipse 用の Kotlin プラグインの開発と貢献プロセスを管理しています。
プラグインに貢献したい場合は、[GitHub のリポジトリ](https://github.com/Kotlin/kotlin-eclipse)にプルリクエストを送信してください。

## Kotlin 言語バージョンとの互換性

IntelliJ IDEA および Android Studio の場合、Kotlin プラグインは各リリースにバンドルされています。
新しい Kotlin バージョンがリリースされると、これらのツールは Kotlin を最新バージョンに自動的に更新することを提案します。
最新のサポート対象言語バージョンについては、[Kotlin リリース](releases#ide-support)を参照してください。

## その他の IDE のサポート

JetBrains は、他の IDE 用の Kotlin プラグインを提供していません。
ただし、Eclipse、Visual Studio Code、Atom など、他の IDE やソースエディターの中には、Kotlin コミュニティがサポートする独自の Kotlin プラグインを備えているものもあります。

テキストエディターを使用して Kotlin コードを記述できますが、コードのフォーマット、デバッグツールなどの IDE 関連機能はありません。
テキストエディターで Kotlin を使用するには、Kotlin [GitHub Releases](https://github.com/JetBrains/kotlin/releases/tag/v2.1.20) から最新の Kotlin コマンドラインコンパイラー (`kotlin-compiler-2.1.20.zip`) をダウンロードし、[手動でインストール](command-line#manual-install)します。
また、[Homebrew](command-line#homebrew)、[SDKMAN!](command-line#sdkman)、[Snap package](command-line#snap-package) などのパッケージマネージャーを使用することもできます。

## 次のステップ

* [IntelliJ IDEA IDE を使用して最初のプロジェクトを開始する](jvm-get-started)
* [Android Studio を使用して最初のクロスプラットフォームモバイルアプリを作成する](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)