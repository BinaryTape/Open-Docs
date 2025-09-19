[//]: # (title: Kotlin Multiplatform を採用してプロジェクトを強化する10の理由)

<web-summary>Kotlin Multiplatformをプロジェクトで利用すべき10の理由を探ります。企業の実例から学び、この技術をマルチプラットフォーム開発に活用し始めましょう。</web-summary>

今日の多様なテクノロジーランドスケープにおいて、
開発者は、様々なプラットフォーム間でシームレスに動作するアプリケーションを構築し、
開発時間を最適化し、ユーザーの生産性を向上させるという課題に直面しています。
Kotlin Multiplatform (KMP) は、複数のプラットフォーム向けにアプリを作成し、
プラットフォーム間でコードの再利用を促進しつつ、ネイティブプログラミングの利点を維持できるソリューションを提供します。

本記事では、開発者が既存または新規プロジェクトでKotlin Multiplatformの使用を検討すべき10の理由と、KMPがなぜ引き続き大きな注目を集めているのかを探ります。

## プロジェクトでKotlin Multiplatformを試すべき理由

効率性の向上を求める場合でも、新しいテクノロジーを試してみたい場合でも、
本記事ではKotlin Multiplatformがもたらす実践的な利点について説明します。
開発作業の合理化から広範なプラットフォームサポート、そして堅牢なツールエコシステムに至るまで、実際の企業による事例研究とともに紹介します。

* [Kotlin Multiplatformによりコードの重複を回避できる](#1-kotlin-multiplatform-allows-you-to-avoid-code-duplication)
* [Kotlin Multiplatformは広範なプラットフォームをサポートしている](#2-kotlin-multiplatform-supports-an-extensive-list-of-platforms)
* [Kotlinは簡素化されたコード共有メカニズムを提供している](#3-kotlin-provides-simplified-code-sharing-mechanisms)
* [Kotlin Multiplatformは柔軟なマルチプラットフォーム開発を可能にする](#4-kotlin-multiplatform-allows-for-flexible-multiplatform-development)
* [Kotlin MultiplatformソリューションでUIコードを共有できる](#5-with-the-kotlin-multiplatform-solution-you-can-share-ui-code)
* [Kotlin Multiplatformは既存および新規プロジェクトで使用できる](#6-you-can-use-kotlin-multiplatform-in-existing-and-new-projects)
* [Kotlin Multiplatformを使えば、コードの共有を段階的に開始できる](#7-with-kotlin-multiplatform-you-can-start-sharing-your-code-gradually)
* [Kotlin Multiplatformはすでに世界中の企業で採用されている](#8-kotlin-multiplatform-is-already-used-by-global-companies)
* [Kotlin Multiplatformは強力なツールサポートを提供している](#9-kotlin-multiplatform-provides-powerful-tooling-support)
* [Kotlin Multiplatformは大規模で協力的なコミュニティを誇っている](#10-kotlin-multiplatform-boasts-a-large-and-supportive-community)

### 1. Kotlin Multiplatformによりコードの重複を回避できる

中国最大の中国語検索エンジンであるBaiduは、若年層をターゲットにしたアプリケーションである _Wonder App_ をリリースしました。従来のアプリ開発で彼らが直面した問題の一部を以下に示します。

*   アプリ体験の一貫性の欠如: AndroidアプリとiOSアプリで動作が異なっていました。
*   ビジネスロジック検証の高コスト: 同じビジネスロジックを使用しているiOS開発者とAndroid開発者の作業は個別に確認する必要があり、高コストにつながっていました。
*   アップグレードとメンテナンスの高コスト: ビジネスロジックの重複は複雑で時間もかかり、アプリのアップグレードとメンテナンスコストを増加させていました。

Baiduチームは、データ層（データモデル、RESTful APIリクエスト、JSONデータ解析、キャッシュロジック）の統一から始めて、Kotlin Multiplatformの実験を行うことを決定しました。

次に彼らは、Kotlin Multiplatformでインターフェースロジックを統一できるModel-View-Intent (MVI) ユーザーインターフェースパターンを採用することを決定しました。彼らはまた、低レベルのデータ、処理ロジック、およびUI処理ロジックも共有しました。

この実験は非常に成功し、以下の結果をもたらしました。

*   AndroidおよびiOSアプリ全体での一貫した体験。
*   メンテナンスおよびテストコストの削減。
*   チーム内の生産性の著しい向上。

[![実際のKotlin Multiplatformユースケースを探る](kmp-use-cases-1.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/case-studies.html)

### 2. Kotlin Multiplatformは広範なプラットフォームをサポートしている

Kotlin Multiplatformの主要な利点の1つは、様々なプラットフォームを広範囲にサポートしていることであり、開発者にとって多用途な選択肢となっています。
これらのプラットフォームには、Android、iOS、デスクトップ、Web（JavaScriptとWebAssembly）、およびサーバー（Java Virtual Machine）が含まれます。

クイズを通じて学習と練習を支援する人気の教育プラットフォームである _Quizlet_ は、Kotlin Multiplatformの利点を強調するもう1つの事例です。
このプラットフォームには月間約5,000万人のアクティブユーザーがおり、そのうち1,000万人はAndroidユーザーです。このアプリはAppleのApp Storeの教育カテゴリでトップ10に入っています。

QuizletチームはJavaScript、React Native、C++、Rust、Goなどのテクノロジーを試しましたが、パフォーマンス、安定性、プラットフォーム間の実装の違いなど、様々な課題に直面しました。
最終的に、彼らはAndroid、iOS、Web向けにKotlin Multiplatformを選択しました。KMPの使用がQuizletチームにどのように役立ったかを以下に示します。

*   オブジェクトをマーシャリングする際の型安全なAPIが増加しました。
*   iOSでの採点アルゴリズムがJavaScriptと比較して25%高速化しました。
*   Androidアプリのサイズが18 MBから10 MBに削減されました。
*   開発者エクスペリエンスが向上しました。
*   Android、iOS、バックエンド、Web開発者を含むチームメンバーの間で、共有コードの記述への関心が高まりました。

> [Kotlin Multiplatformが提供する機能の全範囲を発見する](https://www.jetbrains.com/kotlin-multiplatform/)
> 
{style="tip"}

### 3. Kotlinは簡素化されたコード共有メカニズムを提供している

プログラミング言語の世界において、Kotlinはその実用的なアプローチで際立っており、以下の機能を優先しています。

*   **簡潔さよりも可読性**。簡潔なコードは魅力的ですが、Kotlinは明確さが最も重要であると理解しています。目標はコードを短縮するだけでなく、不要なボイラープレートを排除することであり、これにより可読性と保守性が向上します。

*   **表現力よりもコードの再利用性**。多くの問題を解決するだけでなく、パターンを特定し、再利用可能なライブラリを作成することに重点を置いています。既存のソリューションを活用し、共通点を抽出することで、Kotlinは開発者がコードの効率を最大化できるようにします。

*   **独自性よりも相互運用性**。車輪の再発明をするのではなく、KotlinはJavaのような確立された言語との互換性を重視しています。この相互運用性により、広大なJavaエコシステムとのシームレスな統合が可能になるだけでなく、実績のあるプラクティスや過去の経験から得られた教訓の採用も容易になります。

*   **堅牢性よりも安全性とツール**。Kotlinは開発者が早期にエラーをキャッチできるようにし、プログラムが無効な状態に陥らないようにします。コンパイル時やIDEでコードを記述中に問題を検出することで、Kotlinはソフトウェアの信頼性を高め、ランタイムエラーのリスクを最小限に抑えます。

私たちは毎年Kotlinに関する調査を実施し、ユーザーの言語体験について把握しています。今年は回答者の92%が肯定的な経験をしたと報告しており、1年前の86%から著しく増加しました。

![2023年と2024年のKotlin満足度](kotlin-satisfaction-rate.png){width=700}

重要な点は、Kotlinが可読性、再利用性、相互運用性、そして安全性を重視しているため、開発者にとって魅力的な選択肢となり、生産性を向上させるということです。

### 4. Kotlin Multiplatformは柔軟なマルチプラットフォーム開発を可能にする

Kotlin Multiplatformを使えば、開発者はネイティブ開発とクロスプラットフォーム開発のどちらを選ぶかについて決断する必要がなくなります。何を共有し、何をネイティブで書くかを選択できます。

Kotlin Multiplatform以前は、開発者はすべてをネイティブで記述する必要がありました。

![Kotlin Multiplatform以前: すべてのコードをネイティブで記述](before-kotlin-multiplatform.svg){width="700"}

Kotlin Multiplatformは、[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) のおかげで、ビジネスロジック、プレゼンテーションロジック、あるいはUIロジックまで共有することを可能にします。

![Kotlin MultiplatformとCompose Multiplatformを使用: 開発者はビジネスロジック、プレゼンテーションロジック、あるいはUIロジックまで共有できる](with-compose-multiplatform.svg){width="700"}

これで、プラットフォーム固有のコードを除いて、ほぼすべてを共有できます。

### 5. Kotlin MultiplatformソリューションでUIコードを共有できる

JetBrainsは、KotlinとJetpack Composeをベースにした、Android（Jetpack Compose経由）、iOS、デスクトップ、Web（ベータ版）を含む複数のプラットフォーム間でユーザーインターフェースを共有するための宣言型フレームワークである[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)を提供しています。

Eコマースビジネスに特化したラストマイルロジスティクスプラットフォームである _Instabee_ は、このテクノロジーがまだアルファ版の段階であったにもかかわらず、AndroidおよびiOSアプリケーションでCompose Multiplatformを使用し始め、UIロジックを共有しました。

Compose Multiplatformの公式サンプルには、Android、iOS、デスクトップ、Webで動作し、マップやカメラなどのネイティブコンポーネントと統合されている[ImageViewer App](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer)があります。また、スマートウォッチ用オペレーティングシステムであるWear OSでも動作するコミュニティサンプル、[New York Times App](https://github.com/xxfast/NYTimes-KMP)のクローンもあります。より多くの例を見るには、この[Kotlin MultiplatformおよびCompose Multiplatformサンプル](multiplatform-samples.md)のリストを確認してください。

[![Compose Multiplatformを探る](explore-compose.svg){width="700"}](https://www.jetbrains.com/compose-multiplatform/)

### 6. Kotlin Multiplatformは既存および新規プロジェクトで使用できる

以下の2つのシナリオを見てみましょう。

*   **既存プロジェクトでのKMPの使用**

    再度、BaiduのWonder Appの例があります。チームはすでにAndroidアプリとiOSアプリを持っており、ロジックを統合しただけでした。彼らは徐々により多くのライブラリとロジックを統合し始め、最終的にプラットフォーム間で共有される統一されたコードベースを達成しました。

*   **新規プロジェクトでのKMPの使用**

    オンラインプラットフォームおよびソーシャルメディアウェブサイトである _9GAG_ は、FlutterやReact Nativeなど様々なテクノロジーを試しましたが、最終的にKotlin Multiplatformを選択しました。これにより、両プラットフォーム間でアプリの動作を一致させることができました。彼らはまずAndroidアプリを作成することから始め、その後、Kotlin MultiplatformプロジェクトをiOSでの依存関係として使用しました。

### 7. Kotlin Multiplatformを使えば、コードの共有を段階的に開始できる

定数のような単純な要素から段階的に開始し、メールアドレスの検証のような一般的なユーティリティに徐々に移行することができます。また、例えばトランザクション処理やユーザー認証のようなビジネスロジックを記述または移行することも可能です。

JetBrainsでは、Kotlin Multiplatformに関する調査を頻繁に実施し、コミュニティに異なるプラットフォーム間でどのコードを共有しているかを尋ねています。これらの調査により、データモデル、データシリアライズ、ネットワーキング、アナリティクス、そして内部ユーティリティが、このテクノロジーが大きな影響を与える主要な領域であることが明らかになりました。

![Kotlin Multiplatformでユーザーがプラットフォーム間で共有できるコード部分: 調査結果](parts-of-code-share.png){width="700"}

### 8. Kotlin Multiplatformはすでに世界中の企業で採用されている

KMPは、Forbes、Philips、Cash App、Meetup、Autodeskなど、世界中の多くの大企業ですでに使用されています。彼らのすべての事例は、[事例紹介ページ](case-studies.topic)で読むことができます。

2023年11月、JetBrainsはKotlin Multiplatformが[Stable](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)になったことを発表し、より多くの企業やチームがこのテクノロジーに関心を持つようになりました。

### 9. Kotlin Multiplatformは強力なツールサポートを提供している

Kotlin Multiplatformプロジェクトで作業する際、手元には強力なツールがあります。

*   **Android Studio**。この統合開発環境（IDE）はIntelliJ Community Editionをベースに構築されており、Android開発の業界標準として広く認知されています。Android Studioは、コーディング、デバッグ、パフォーマンス監視のための包括的な機能スイートを提供します。
*   **Xcode**。AppleのIDEは、Kotlin MultiplatformアプリのiOS部分を作成するために使用できます。XcodeはiOSアプリ開発の標準であり、コーディング、デバッグ、構成のための豊富なツールを提供します。ただし、XcodeはMac専用です。

### 10. Kotlin Multiplatformは大規模で協力的なコミュニティを誇っている

KotlinおよびKotlin Multiplatformには、非常に協力的なコミュニティがあります。何か質問がある場合に答えを見つけられる場所をいくつか紹介します。

*   [Kotlinlang Slackワークスペース](https://slack-chats.kotlinlang.org/)。このワークスペースには約60,000人のメンバーがおり、クロスプラットフォーム開発専用の関連チャンネルがいくつかあります。たとえば、[#multiplatform](https://slack-chats.kotlinlang.org/c/multiplatform)、[#compose](https://slack-chats.kotlinlang.org/c/compose)、[#compose-ios](https://slack-chats.kotlinlang.org/c/compose-ios)などです。
*   [Kotlin X](https://twitter.com/kotlin)。ここでは、素早い専門家の知見や最新ニュース、そして数え切れないほどのマルチプラットフォームのヒントが見つかります。
*   [Kotlin YouTube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)。私たちのYouTubeチャンネルでは、実践的なチュートリアル、専門家とのライブストリーム、そして視覚的な学習者向けの他の優れた教育コンテンツを提供しています。
*   [Kotlin Roundup](https://lp.jetbrains.com/subscribe-to-kotlin-news/)。ダイナミックなKotlinおよびKotlin Multiplatformエコシステム全体での最新情報を見逃したくない場合は、定期ニュースレターを購読してください！

Kotlin Multiplatformエコシステムは発展し続けています。世界中の数多くのKotlin開発者によって熱心に育てられています。
年間作成されたKotlin Multiplatformライブラリの数を示す図を以下に示します。

![長年にわたるKotlin Multiplatformライブラリの数。](kmp-libs-over-years.png){width="700"}

ご覧の通り、2021年には明確な増加が見られ、それ以来ライブラリの数は増え続けています。

## 他のクロスプラットフォーム技術と比較してKotlin Multiplatformを選ぶ理由

[異なるクロスプラットフォームソリューション](cross-platform-frameworks.md)の中から選択する際には、それらの長所と短所の両方を比較検討することが重要です。Kotlin Multiplatformがあなたにとって最適な選択肢である主要な理由を以下に示します。

*   **優れたツール、使いやすさ**。Kotlin MultiplatformはKotlinを活用しており、開発者にとって優れたツールと使いやすさを提供します。
*   **ネイティブプログラミング**。ネイティブで記述するのは簡単です。[expectedおよびactual宣言](multiplatform-expect-actual.md)のおかげで、マルチプラットフォームアプリがプラットフォーム固有のAPIにアクセスできるようにすることができます。
*   **優れたクロスプラットフォームパフォーマンス**。Kotlinで記述された共有コードは、異なるターゲット向けに異なる出力形式にコンパイルされます。Android向けにはJavaバイトコード、iOS向けにはネイティブバイナリとなり、すべてのプラットフォームで優れたパフォーマンスを保証します。

すでにKotlin Multiplatformを試すことを決めている場合は、始めるのに役立ついくつかのヒントを以下に示します。

*   **小さく始める**。小さな共有コンポーネントや定数から始め、チームにKotlin Multiplatformのワークフローと利点に慣れさせます。
*   **計画を立てる**。期待される成果と実装および分析の方法を仮説として立て、明確な実験計画を策定します。共有コードへの貢献の役割を定義し、変更を効果的に配布するためのワークフローを確立します。
*   **評価し、振り返りを実施する**。チームと振り返り会議を実施し、実験の成功を評価し、課題や改善すべき点を特定します。もしうまくいったなら、範囲を広げてさらに多くのコードを共有することを検討してもよいでしょう。もしそうでないなら、この実験がうまくいかなかった理由を理解する必要があります。

[![Kotlin Multiplatformの動作を見る！今すぐ始めよう](kmp-get-started-action.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)

チームがKotlin Multiplatformを始めるのを支援したい方のために、実践的なヒントを盛り込んだ[詳細なガイド](multiplatform-introduce-your-team.md)を用意しました。

ご覧の通り、Kotlin Multiplatformはすでに多くの巨大企業によって、ネイティブのようなUIを持つ高性能なクロスプラットフォームアプリケーションを構築するために成功裏に使用されており、ネイティブプログラミングの利点を維持しながら、コードを効果的に再利用しています。