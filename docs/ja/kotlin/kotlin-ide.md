[//]: # (title: Kotlin 開発用 IDE)

<web-summary>JetBrains は、IntelliJ IDEA と Android Studio に対して公式の Kotlin IDE サポートを提供しています。</web-summary>

JetBrains は、以下の IDE およびコードエディタに対して公式の Kotlin サポートを提供しています：
[IntelliJ IDEA](#intellij-idea) および [Android Studio](#android-studio)。

その他の IDE やコードエディタには、Kotlin コミュニティがサポートするプラグインのみが存在します。

## IntelliJ IDEA

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) は、開発者の生産性を最大化するために設計された、Kotlin や Java などの JVM 言語向けの IDE です。
インテリジェントなコード補完、静的コード解析、およびリファクタリングを提供することで、日常的で反復的なタスクを自動化します。
これにより、ソフトウェア開発の創造的な側面に集中できるようになり、生産性が向上するだけでなく、楽しい開発体験を実現します。

Kotlin プラグインは、IntelliJ IDEA の各リリースに同梱されています。
各 IDEA のリリースでは、IDE での Kotlin 開発者のエクスペリエンスを向上させる新機能やアップグレードが導入されます。
Kotlin に関する最新のアップデートと改善点については、[IntelliJ IDEA の新機能](https://www.jetbrains.com/idea/whatsnew/)を参照してください。

IntelliJ IDEA の詳細については、[公式ドキュメント](https://www.jetbrains.com/help/idea/discover-intellij-idea.html)（英語）をご覧ください。

## Android Studio

[Android Studio](https://developer.android.com/studio) は、[IntelliJ IDEA](https://www.jetbrains.com/idea/) をベースにした Android アプリ開発の公式 IDE です。
IntelliJ の強力なコードエディタと開発ツールに加え、Android Studio は Android アプリを構築する際の生産性を高めるさらなる機能を提供します。

Kotlin プラグインは、Android Studio の各リリースに同梱されています。

Android Studio の詳細については、[公式ドキュメント](https://developer.android.com/studio/intro)をご覧ください。

## Kotlin 言語バージョンとの互換性

IntelliJ IDEA と Android Studio では、Kotlin プラグインが各リリースに同梱されています。
新しい Kotlin バージョンがリリースされると、これらのツールは自動的に Kotlin を最新バージョンに更新することを提案します。
サポートされている最新の言語バージョンについては、[Kotlin リリース](releases.md#ide-support)を確認してください。

## その他の IDE サポート

JetBrains は、他の IDE 向けの Kotlin プラグインを提供していません。
しかし、Visual Studio Code などの一部の IDE やコードエディタには、Kotlin コミュニティによってサポートされている Kotlin プラグインがあります。

任意のテキストエディタを使用して Kotlin コードを記述できますが、コード整形やデバッグツールなどの IDE 関連機能は利用できません。
テキストエディタで Kotlin を使用するには、Kotlin の [GitHub リリース](%kotlinLatestUrl%)から最新の Kotlin コマンドラインコンパイラ (`kotlin-compiler-%kotlinVersion%.zip`) をダウンロードし、[手動でインストール](command-line.md#manual-install)できます。
また、[Homebrew](command-line.md#homebrew)、[SDKMAN!](command-line.md#sdkman)、[Snap パッケージ](command-line.md#snap-package)などのパッケージマネージャーを使用することも可能です。

## 次のステップ

* [IntelliJ IDEA でコンソールアプリケーションを作成する](jvm-get-started.md)
* [Android Studio を使用して初めてのクロスプラットフォームモバイルアプリを作成する](https://kotlinlang.org/docs/multiplatform/multiplatform-create-first-app.html)