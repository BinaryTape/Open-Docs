[//]: # (title: Kotlin Multiplatformとは)
[//]: # (description: Kotlin Multiplatformは、JetBrainsが提供するオープンソース技術で、Android、iOS、デスクトップ、ウェブ、サーバー間でコードを共有できるようにします。)

Kotlin Multiplatform (KMP) は、JetBrainsが提供するオープンソース技術で、Android、iOS、デスクトップ、
ウェブ、サーバー間でコードを共有しながら、ネイティブ開発の利点を維持することができます。

Compose Multiplatform を使えば、UIコードも複数のプラットフォーム間で共有できるため、コードの再利用を最大限に高めることができます。

## 企業がKMPを選ぶ理由

### コスト効率と迅速なリリース

Kotlin Multiplatformは、技術的および組織的なプロセスの両方を効率化するのに役立ちます。

*   ロジックとUIコードを複数のプラットフォーム間で共有することで、重複とメンテナンスコストを削減できます。
    これにより、複数のプラットフォームで同時に機能をリリースすることも可能になります。
*   共有コード内で統一されたロジックにアクセスできるため、チーム間のコラボレーションが容易になり、
    チームメンバー間の知識伝達が円滑になり、各プラットフォームチーム間の作業の重複を減らすことができます。

市場投入までの時間短縮に加え、**55%**のユーザーがKMP導入後にコラボレーションの改善を報告し、
**65%**のチームがパフォーマンスと品質の向上を報告しています（KMP Survey Q2 2024より）。

KMPは、スタートアップからグローバル企業まで、あらゆる規模の組織で本番環境に採用されています。
Google、Duolingo、Forbes、Philips、McDonald's、Bolt、H&M、Baidu、Kuaishou、Bilibiliなどの企業は、その柔軟性、ネイティブパフォーマンス、ネイティブユーザーエクスペリエンスを提供できる能力、
コスト効率、段階的な導入サポートといった理由からKMPを採用しています。[KMPを採用している企業について詳しくはこちら](https://kotlinlang.org/case-studies/?type=multiplatform)。

### コード共有の柔軟性

コードを自由に共有できます。ネットワーキングやストレージなどの独立したモジュールを共有し、時間をかけて共有コードを段階的に拡張することが可能です。
UIをネイティブのままにしてすべてのビジネスロジックを共有することも、Compose Multiplatform を使用してUIを段階的に移行することもできます。

![KMPの段階的な導入のイラスト：ロジックの一部とUIなしを共有、UIなしで全ロジックを共有、ロジックとUIを共有](kmp-graphic.png){width="700"}

### iOSでのネイティブな操作感

UIはSwiftUIまたはUIKitを使って完全に構築することも、Compose Multiplatform を使ってAndroidとiOSで統一されたエクスペリエンスを作成することも、
必要に応じてネイティブUIコードと共有UIコードを組み合わせることもできます。

どのアプローチを採用しても、各プラットフォームでネイティブに感じるアプリを制作できます。

<video src="https://www.youtube.com/watch?v=LB5a2FRrT94" width="700"/>

### ネイティブパフォーマンス

Kotlin Multiplatformは、[Kotlin/Native](https://kotlinlang.org/docs/native-overview.html)を活用してネイティブバイナリを生成し、
仮想マシンが望ましくない、または不可能な環境（例：iOS）ではプラットフォームAPIに直接アクセスします。

これにより、プラットフォームに依存しないコードを記述しながら、ネイティブに近いパフォーマンスを実現できます。

![Compose MultiplatformとSwiftUIのiOS (iPhone 13およびiPhone 16) における同等のパフォーマンスを示すグラフ](cmp-ios-performance.png){width="700"}

### シームレスなツール

IntelliJ IDEAとAndroid Studioは、[Kotlin Multiplatform IDEプラグイン](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform)によるスマートなKMP IDEサポート、
共通UIプレビュー、[Compose Multiplatformのホットリロード](compose-hot-reload.md)、クロス言語ナビゲーション、リファクタリング、KotlinとSwiftコード間のデバッグを提供します。

<video src="https://youtu.be/ACmerPEQAWA" width="700"/>

### AIを活用した開発

JetBrainsのAIコーディングエージェントである[Junie](https://jetbrains.com/junie)にKMPタスクを任せることで、チームはより迅速に作業を進めることができます。

## Kotlin Multiplatformのユースケースを発見

企業や開発者がすでに共有Kotlinコードの利点をどのように享受しているかをご覧ください。

*   企業がどのようにKMPをコードベースに成功裏に導入したかについて、当社の[ケーススタディページ](https://kotlinlang.org/case-studies/?type=multiplatform)でご覧ください。
*   当社の[厳選されたサンプルリスト](multiplatform-samples.md)とGitHubの[kotlin-multiplatform-sample](https://github.com/topics/kotlin-multiplatform-sample)トピックで、幅広いサンプルアプリをご確認ください。
*   [klibs.io](https://klibs.io/)にすでに存在する何千ものマルチプラットフォームライブラリの中から、特定のライブラリを検索してください。

## 基本を学ぶ

KMPが実際に動作する様子をすばやく確認するには、[クイックスタート](quickstart.md)をお試しください。
環境をセットアップし、異なるプラットフォームでサンプルアプリケーションを実行します。

ユースケースを選択してください
: * UIとビジネスロジックの両方のコードをプラットフォーム間で共有するアプリを作成するには、
    [共有ロジックとUIのチュートリアル](compose-multiplatform-create-first-app.md)に従ってください。
  * Androidアプリをマルチプラットフォームアプリに変換する方法を確認するには、
    当社の[移行チュートリアル](multiplatform-integrate-in-existing-app.md)をご覧ください。
  * UI実装を共有せずにコードの一部を共有する方法を確認するには、
    [共有ロジックのチュートリアル](multiplatform-create-first-app.md)に従ってください。

技術的な詳細を掘り下げる
: * [基本的なプロジェクト構造](multiplatform-discover-project.md)から始めましょう。
  * 利用可能な[コード共有メカニズム](multiplatform-share-on-platforms.md)について学びましょう。
  * KMPプロジェクトで[依存関係がどのように機能するか](multiplatform-add-dependencies.md)を確認しましょう。
  * さまざまな[iOS統合方法](multiplatform-ios-integration-overview.md)を検討しましょう。
  * KMPがさまざまなターゲット向けに[コードをコンパイル](multiplatform-configure-compilations.md)し、[バイナリをビルド](multiplatform-build-native-binaries.md)する方法を学びましょう。
  * [マルチプラットフォームアプリの公開](multiplatform-publish-apps.md)または[マルチプラットフォームライブラリの公開](multiplatform-publish-lib-setup.md)について読みましょう。

## 大規模にKotlin Multiplatformを導入する

チームでクロスプラットフォームフレームワークを導入することは、課題となる場合があります。
利点と潜在的な問題の解決策について学ぶには、クロスプラットフォーム開発の概要をご覧ください。

*   [クロスプラットフォームモバイル開発とは？](cross-platform-mobile-development.md)：クロスプラットフォームアプリケーションのさまざまなアプローチと実装の概要を提供します。
*   [チームにマルチプラットフォームモバイル開発を導入する方法](multiplatform-introduce-your-team.md)：チームにクロスプラットフォーム開発を導入するための戦略を提供します。
*   [Kotlin Multiplatformを採用してプロジェクトを加速させる10の理由](multiplatform-reasons-to-try.md)：クロスプラットフォームソリューションとしてKotlin Multiplatformを採用する理由を列挙します。