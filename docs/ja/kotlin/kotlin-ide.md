[//]: # (title: Kotlin開発向けIDE)
[//]: # (description: JetBrainsは、IntelliJ IDEAとAndroid Studioに対し、公式のKotlin IDEサポートを提供しています。)

JetBrainsは、以下のIDEとコードエディターに対して公式のKotlinサポートを提供しています。
[IntelliJ IDEA](#intellij-idea) と [Android Studio](#android-studio)。

他のIDEやコードエディターには、Kotlinコミュニティがサポートするプラグインのみが存在します。

## IntelliJ IDEA

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) は、KotlinやJavaなどのJVM言語向けに設計されたIDEであり、開発者の生産性を最大限に高めます。
賢いコード補完、静的コード解析、リファクタリングを提供することで、日常的で反復的なタスクを代行してくれます。これにより、ソフトウェア開発の明るい側面に集中でき、生産的であるだけでなく、楽しい体験にもなります。

Kotlinプラグインは、IntelliJ IDEAの各リリースにバンドルされています。
各IDEAリリースでは、IDEでのKotlin開発者エクスペリエンスを向上させる新機能やアップグレードが導入されます。
Kotlinに関する最新の更新と改善については、[IntelliJ IDEAの新機能](https://www.jetbrains.com/idea/whatsnew/)を参照してください。

IntelliJ IDEAの詳細については、[公式ドキュメント](https://www.jetbrains.com/help/idea/discover-intellij-idea.html)を参照してください。

## Android Studio

[Android Studio](https://developer.android.com/studio) は、Androidアプリ開発のための公式IDEであり、[IntelliJ IDEA](https://www.jetbrains.com/idea/)をベースとしています。
IntelliJの強力なコードエディターと開発ツールに加えて、Android StudioはAndroidアプリを構築する際の生産性をさらに向上させる機能を提供します。

Kotlinプラグインは、Android Studioの各リリースにバンドルされています。

Android Studioの詳細については、[公式ドキュメント](https://developer.android.com/studio/intro)を参照してください。

## Eclipse

[Eclipse](https://eclipseide.org/release/) を使用すると、開発者は様々なプログラミング言語でアプリケーションを作成でき、Kotlinもその一つです。Kotlinプラグインも利用可能です。これは元々JetBrainsによって開発されましたが、現在ではKotlinコミュニティの貢献者によってサポートされています。

[MarketplaceからKotlinプラグインを手動でインストール](https://marketplace.eclipse.org/content/kotlin-plugin-eclipse)できます。

Kotlinチームは、Eclipse用Kotlinプラグインの開発と貢献プロセスを管理しています。
プラグインに貢献したい場合は、[GitHubのリポジトリ](https://github.com/Kotlin/kotlin-eclipse)にプルリクエストを送信してください。

## Kotlin言語バージョンとの互換性

IntelliJ IDEAとAndroid Studioでは、Kotlinプラグインは各リリースにバンドルされています。
新しいKotlinバージョンがリリースされると、これらのツールはKotlinを最新バージョンに自動的に更新するよう提案します。
サポートされている最新の言語バージョンは、[Kotlinリリース](releases.md#ide-support)で確認してください。

## 他のIDEのサポート

JetBrainsは、他のIDE用のKotlinプラグインは提供していません。
ただし、Eclipse、Visual Studio Code、Atomなど、他のいくつかのIDEやソースエディターには、Kotlinコミュニティによってサポートされている独自のKotlinプラグインがあります。

任意のテキストエディターを使用してKotlinコードを作成できますが、コードフォーマット、デバッグツールなどのIDE関連機能は利用できません。
テキストエディターでKotlinを使用するには、Kotlinの[GitHubリリース](%kotlinLatestUrl%)から最新のKotlinコマンドラインコンパイラ（`kotlin-compiler-%kotlinVersion%.zip`）をダウンロードし、[手動でインストール](command-line.md#manual-install)できます。
また、[Homebrew](command-line.md#homebrew)、[SDKMAN!](command-line.md#sdkman)、[Snap package](command-line.md#snap-package)などのパッケージマネージャーを使用することもできます。

## 次のステップ

*   [IntelliJ IDEA IDEを使用して最初のプロジェクトを開始する](jvm-get-started.md)
*   [Android Studioを使用して最初のクロスプラットフォームモバイルアプリを作成する](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)