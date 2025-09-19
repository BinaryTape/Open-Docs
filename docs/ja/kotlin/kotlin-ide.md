[//]: # (title: Kotlin開発向けIDE)

<web-summary>JetBrainsは、IntelliJ IDEAとAndroid Studioに対し、公式のKotlin IDEサポートを提供しています。</web-summary>

JetBrainsは、以下のIDEおよびコードエディター向けに公式のKotlinサポートを提供しています：[IntelliJ IDEA](#intellij-idea) と [Android Studio](#android-studio)。

その他のIDEやコードエディターは、Kotlinコミュニティがサポートするプラグインのみを提供しています。

## IntelliJ IDEA

[IntelliJ IDEA](https://www.jetbrains.com/idea/download/) は、KotlinやJavaなどのJVM言語向けに設計されたIDEであり、開発者の生産性を最大限に高めます。
賢いコード補完、静的コード解析、リファクタリング機能を提供することで、ルーチン的で反復的なタスクを自動化します。
これにより、ソフトウェア開発の明るい側面に集中でき、生産的であるだけでなく、楽しい体験にもなります。

Kotlinプラグインは、各IntelliJ IDEAリリースにバンドルされています。
各IDEAリリースでは、新機能やアップグレードが導入され、IDEでのKotlin開発者のエクスペリエンスが向上します。
Kotlinに関する最新の更新と改善については、[What's new in IntelliJ IDEA](https://www.jetbrains.com/idea/whatsnew/) を参照してください。

IntelliJ IDEAの詳細については、[公式ドキュメント](https://www.jetbrains.com/help/idea/discover-intellij-idea.html) を参照してください。

## Android Studio

[Android Studio](https://developer.android.com/studio) は、Androidアプリ開発向けの公式IDEであり、[IntelliJ IDEA](https://www.jetbrains.com/idea/) をベースとしています。
IntelliJの強力なコードエディターと開発ツールに加え、Android Studioはさらに多くの機能を提供し、Androidアプリの構築時の生産性を向上させます。

Kotlinプラグインは、各Android Studioリリースにバンドルされています。

Android Studioの詳細については、[公式ドキュメント](https://developer.android.com/studio/intro) を参照してください。

## Eclipse

[Eclipse](https://eclipseide.org/release/) は、開発者が様々なプログラミング言語でアプリケーションを作成することを可能にし、Kotlinもその中に含まれます。
Kotlinプラグインも利用できます：元々はJetBrainsによって開発されましたが、現在、KotlinプラグインはKotlinコミュニティの貢献者によってサポートされています。

[Marketplace](https://marketplace.eclipse.org/content/kotlin-plugin-eclipse) から手動でKotlinプラグインをインストールできます。

Kotlinチームは、Eclipse向けKotlinプラグインの開発と貢献プロセスを管理しています。
プラグインに貢献したい場合は、その[GitHubリポジトリ](https://github.com/Kotlin/kotlin-eclipse) にプルリクエストを送信してください。

## Kotlin言語バージョンとの互換性

IntelliJ IDEAとAndroid Studioの場合、Kotlinプラグインは各リリースにバンドルされています。
新しいKotlinバージョンがリリースされると、これらのツールは、Kotlinを最新バージョンに自動的に更新することを提案します。
サポートされている最新の言語バージョンについては、[Kotlinリリース](releases.md#ide-support) を参照してください。

## その他のIDEのサポート

JetBrainsは、他のIDE向けのKotlinプラグインを提供していません。
ただし、Eclipse、Visual Studio Code、Atomなどの一部のIDEやソースエディターには、Kotlinコミュニティによってサポートされている独自のKotlinプラグインがあります。

Kotlinコードの記述には任意のテキストエディターを使用できますが、コード整形、デバッグツールなどのIDE関連機能は利用できません。
テキストエディターでKotlinを使用するには、最新のKotlinコマンドラインコンパイラ (`kotlin-compiler-%kotlinVersion%.zip`) をKotlinの[GitHub Releases](%kotlinLatestUrl%) からダウンロードし、[手動でインストール](command-line.md#manual-install) できます。
また、[Homebrew](command-line.md#homebrew)、[SDKMAN!](command-line.md#sdkman)、[Snap package](command-line.md#snap-package) などのパッケージマネージャーを使用することもできます。

## 次へ

*   [IntelliJ IDEA IDEを使用して最初のプロジェクトを開始する](jvm-get-started.md)
*   [Android Studioを使用して最初のクロスプラットフォームモバイルアプリを作成する](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-create-first-app.html)