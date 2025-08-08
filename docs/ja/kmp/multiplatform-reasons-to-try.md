[//]: # (title: Kotlin Multiplatform を導入してプロジェクトを強化する 10 の理由)

<web-summary>Kotlin Multiplatform をプロジェクトで活用すべき 10 の理由を発見しましょう。企業の実例を見て、マルチプラットフォーム開発でこのテクノロジーを使い始めましょう。</web-summary>

今日の多様な技術環境において、開発者は、開発時間を最適化し、ユーザーの生産性を向上させながら、さまざまなプラットフォームでシームレスに動作するアプリケーションを構築するという課題に直面しています。Kotlin Multiplatform (KMP) は、ネイティブプログラミングの利点を維持しつつ、複数のプラットフォーム向けにアプリを作成し、それらの間でコードの再利用を促進するソリューションを提供します。

この記事では、開発者が既存または新規のプロジェクトで Kotlin Multiplatform の使用を検討すべき 10 の理由と、KMP がなぜ引き続き大きな注目を集めているのかを詳しく見ていきます。

## プロジェクトで Kotlin Multiplatform を試すべき理由

効率性の向上を求める場合でも、新しいテクノロジーの探求に熱心な場合でも、この記事では、Kotlin Multiplatform がもたらす実践的な利点について説明します。開発作業の合理化から、広範なプラットフォームサポート、堅牢なツールエコシステム、そして実際の企業のケーススタディまで、その詳細を解説します。

* [Kotlin Multiplatform によりコードの重複を回避できる](#1-kotlin-multiplatform-allows-you-to-avoid-code-duplication)
* [Kotlin Multiplatform は広範なプラットフォームをサポートする](#2-kotlin-multiplatform-supports-an-extensive-list-of-platforms)
* [Kotlin はシンプルなコード共有メカニズムを提供する](#3-kotlin-provides-simplified-code-sharing-mechanisms)
* [Kotlin Multiplatform は柔軟なマルチプラットフォーム開発を可能にする](#4-kotlin-multiplatform-allows-for-flexible-multiplatform-development)
* [Kotlin Multiplatform ソリューションで UI コードを共有できる](#5-with-the-kotlin-multiplatform-solution-you-can-share-ui-code)
* [Kotlin Multiplatform は既存プロジェクトと新規プロジェクトの両方で使用できる](#6-you-can-use-kotlin-multiplatform-in-existing-and-new-projects)
* [Kotlin Multiplatform を使って段階的にコード共有を開始できる](#7-with-kotlin-multiplatform-you-can-start-sharing-your-code-gradually)
* [Kotlin Multiplatform はすでにグローバル企業で使用されている](#8-kotlin-multiplatform-is-already-used-by-global-companies)
* [Kotlin Multiplatform は強力なツールサポートを提供する](#9-kotlin-multiplatform-provides-powerful-tooling-support)
* [Kotlin Multiplatform は大規模で協力的なコミュニティを誇る](#10-kotlin-multiplatform-boasts-a-large-and-supportive-community)

### 1. Kotlin Multiplatform によりコードの重複を回避できる

中国最大の中国語検索エンジンである Baidu は、若年層をターゲットとしたアプリケーションである _Wonder App_ をリリースしました。従来のアプリ開発で彼らが直面した問題の一部を以下に示します。

* アプリ体験の一貫性の欠如: Android アプリが iOS アプリと異なる動作をしました。
* ビジネスロジック検証の高コスト: 同じビジネスロジックを使用する iOS および Android 開発者の作業を個別にチェックする必要があり、高コストにつながりました。
* 高いアップグレードおよびメンテナンスコスト: ビジネスロジックの重複は複雑で時間のかかる作業であり、アプリのアップグレードおよびメンテナンスコストを増加させました。

Baidu チームは Kotlin Multiplatform の実験を開始し、データモデル、RESTful API リクエスト、JSON データ解析、キャッシュロジックといったデータ層の統一から始めました。

その後、彼らは Model-View-Intent (MVI) ユーザーインターフェースパターンを採用することを決定しました。これにより、Kotlin Multiplatform でインターフェースロジックを統一できます。彼らはまた、低レベルのデータ、処理ロジック、および UI 処理ロジックも共有しました。

この実験は非常に成功し、以下の結果をもたらしました。

* Android および iOS アプリ全体で一貫したエクスペリエンス。
* メンテナンスおよびテストコストの削減。
* チーム内の生産性が大幅に向上。

[![Kotlin Multiplatform の実際のユースケースを探索する](kmp-use-cases-1.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/case-studies.html)

### 2. Kotlin Multiplatform は広範なプラットフォームをサポートする

Kotlin Multiplatform の主要な利点の 1 つは、さまざまなプラットフォームにわたる広範なサポートであり、開発者にとって多用途な選択肢となります。これらのプラットフォームには、Android、iOS、デスクトップ、Web (JavaScript および WebAssembly)、およびサーバー (Java Virtual Machine) が含まれます。

クイズを通じて学習と練習を支援する人気教育プラットフォームである _Quizlet_ も、Kotlin Multiplatform の利点を示すもう一つのケーススタディです。このプラットフォームは月に約 5,000 万人のアクティブユーザーを抱え、そのうち 1,000 万人が Android ユーザーです。このアプリは Apple の App Store の教育カテゴリでトップ 10 にランクインしています。

Quizlet チームは JavaScript、React Native、C++、Rust、Go などのテクノロジーを試しましたが、パフォーマンス、安定性、プラットフォーム間での実装の違いなど、さまざまな課題に直面しました。最終的に、彼らは Android、iOS、Web 向けに Kotlin Multiplatform を選択しました。KMP の使用が Quizlet チームにどのように役立ったかを以下に示します。

* オブジェクトをマーシャリングする際の、より型安全な API。
* iOS での採点アルゴリズムが JavaScript と比較して 25% 高速化。
* Android アプリのサイズが 18 MB から 10 MB に削減。
* 開発者エクスペリエンスの向上。
* Android、iOS、バックエンド、Web 開発者を含むチームメンバーの、共有コード記述への関心の高まり。

> [Kotlin Multiplatform が提供する機能の全範囲を発見する](https://www.jetbrains.com/kotlin-multiplatform/)
> 
{style="tip"}

### 3. Kotlin はシンプルなコード共有メカニズムを提供する

プログラミング言語の世界において、Kotlin はその実用的なアプローチで際立っており、以下の機能を優先しています。

* **簡潔さよりも可読性**。簡潔なコードは魅力的ですが、Kotlin は明瞭さが最も重要であることを理解しています。目標はコードを短縮するだけでなく、不必要なボイラープレートを排除することであり、これにより可読性と保守性が向上します。

* **単なる表現力よりもコードの再利用性**。多くの問題を解決するだけでなく、パターンを特定し、再利用可能なライブラリを作成することです。既存のソリューションを活用し、共通点を抽出することで、Kotlin は開発者がコードの効率を最大化できるようにします。

* **独創性よりも相互運用性**。車輪を再発明するのではなく、Kotlin は Java のような確立された言語との互換性を受け入れています。この相互運用性により、広大な Java エコシステムとのシームレスな統合が可能になるだけでなく、実績のあるプラクティスや過去の経験から得られた教訓の採用も容易になります。

* **健全性よりも安全性とツール**。Kotlin は開発者が早期にエラーを発見できるようにし、プログラムが不正な状態に陥ることを防ぎます。コンパイル時や IDE でコードを記述中に問題を検出することで、Kotlin はソフトウェアの信頼性を高め、ランタイムエラーのリスクを最小限に抑えます。

私たちは毎年 Kotlin アンケートを実施し、ユーザーの言語体験について把握しています。今年、回答者の 92% が肯定的な経験をしたと報告しており、1 年前の 86% から著しく増加しました。

![2023年と2024年のKotlin満足度](kotlin-satisfaction-rate.png){width=700}

重要な点は、Kotlin が可読性、再利用性、相互運用性、および安全性を重視しているため、開発者にとって魅力的な選択肢となり、生産性を向上させることです。

### 4. Kotlin Multiplatform は柔軟なマルチプラットフォーム開発を可能にする

Kotlin Multiplatform を使用すると、開発者はネイティブ開発とクロスプラットフォーム開発のどちらかを選択する必要がなくなります。何を共有し、何をネイティブで記述するかを選択できます。

Kotlin Multiplatform の登場以前は、開発者はすべてをネイティブで記述する必要がありました。

![Kotlin Multiplatform の登場以前: すべてのコードをネイティブで記述](before-kotlin-multiplatform.svg){width="700"}

Kotlin Multiplatform は、[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) のおかげで、ビジネスロジック、プレゼンテーションロジック、あるいは UI ロジックさえも共有することを可能にします。

![Kotlin Multiplatform と Compose Multiplatform の併用: 開発者はビジネスロジック、プレゼンテーションロジック、あるいは UI ロジックさえも共有できる](with-compose-multiplatform.svg){width="700"}

これで、プラットフォーム固有のコードを除いて、ほぼすべてを共有できます。

### 5. Kotlin Multiplatform ソリューションで UI コードを共有できる

JetBrains は、Kotlin および Jetpack Compose に基づく、Android (Jetpack Compose 経由)、iOS、デスクトップ、Web (Alpha) など、複数のプラットフォーム間でユーザーインターフェースを共有するための宣言型フレームワークである [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/) を提供しています。

Eコマースビジネスに特化したラストマイル物流プラットフォームである _Instabee_ は、技術がまだアルファ段階であったにもかかわらず、Compose Multiplatform を Android および iOS アプリケーションで使い始め、UI ロジックを共有しました。

[ImageViewer App](https://github.com/JetBrains/compose-multiplatform/tree/master/examples/imageviewer) という Compose Multiplatform の公式サンプルがあり、これは Android、iOS、デスクトップ、Web で動作し、マップやカメラなどのネイティブコンポーネントと統合されています。また、スマートウォッチ用 OS である Wear OS でも動作するコミュニティサンプルである [New York Times App](https://github.com/xxfast/NYTimes-KMP) のクローンもあります。より多くの例については、[Kotlin Multiplatform および Compose Multiplatform サンプル](multiplatform-samples.md) のリストを確認してください。

[![Compose Multiplatform を探索する](explore-compose.svg){width="700"}](https://www.jetbrains.com/compose-multiplatform/)

### 6. Kotlin Multiplatform は既存プロジェクトと新規プロジェクトの両方で使用できる

以下の 2 つのシナリオを見てみましょう。

* **既存プロジェクトでの KMP の使用**

  再び、Baidu の Wonder App の例があります。チームはすでに Android アプリと iOS アプリを持っており、ロジックを統一しただけでした。彼らは徐々に多くのライブラリとロジックを統一し始め、最終的にプラットフォーム間で共有される統一されたコードベースを達成しました。

* **新規プロジェクトでの KMP の使用**

  オンラインプラットフォームおよびソーシャルメディアウェブサイトである _9GAG_ は、Flutter や React Native などさまざまなテクノロジーを試しましたが、最終的に Kotlin Multiplatform を選択しました。これにより、両プラットフォーム間でアプリの動作を統一することができました。彼らはまず Android アプリの作成から始めました。その後、Kotlin Multiplatform プロジェクトを iOS の依存関係として利用しました。

### 7. Kotlin Multiplatform を使って段階的にコード共有を開始できる

定数のようなシンプルな要素から段階的に開始し、メールの検証などの共通ユーティリティを徐々に移行できます。また、トランザクション処理やユーザー認証などのビジネスロジックを記述または移行することも可能です。

JetBrains では、Kotlin Multiplatform に関するアンケートを頻繁に実施し、異なるプラットフォーム間でどのコード部分を共有しているかについてコミュニティに尋ねています。これらのアンケートにより、データモデル、データシリアライズ、ネットワーキング、アナリティクス、および内部ユーティリティが、このテクノロジーが大きな影響を与える主要な領域であることが明らかになりました。

![Kotlin Multiplatform でユーザーがプラットフォーム間で共有できるコードの部品: アンケート結果](parts-of-code-share.png){width=700}

### 8. Kotlin Multiplatform はすでにグローバル企業で使用されている

KMP は、Forbes、Philips、Cash App、Meetup、Autodesk など、世界中の多くの大企業で既に使用されています。彼らのすべての事例は、[ケーススタディページ](case-studies.topic) で読むことができます。

2023 年 11 月、JetBrains は Kotlin Multiplatform が[安定版](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)になったと発表し、より多くの企業やチームがこのテクノロジーに関心を持つようになりました。

### 9. Kotlin Multiplatform は強力なツールサポートを提供する

Kotlin Multiplatform プロジェクトで作業する際には、強力なツールがすぐに利用できます。

* **Android Studio**。この統合開発環境 (IDE) は IntelliJ Community Edition を基盤として構築されており、Android 開発の業界標準として広く認識されています。Android Studio は、コーディング、デバッグ、パフォーマンス監視のための包括的な機能スイートを提供します。
* **Xcode**。Apple の IDE は、Kotlin Multiplatform アプリの iOS 部分を作成するために使用できます。Xcode は iOS アプリ開発の標準であり、コーディング、デバッグ、構成のための豊富なツールを提供します。ただし、Xcode は Mac 専用です。

### 10. Kotlin Multiplatform は大規模で協力的なコミュニティを誇る

Kotlin と Kotlin Multiplatform には、非常に協力的なコミュニティがあります。ご質問がある場合に回答を見つけられる場所をいくつかご紹介します。

* [Kotlinlang Slack ワークスペース](https://slack-chats.kotlinlang.org/)。このワークスペースには約 60,000 人のメンバーがおり、[#multiplatform](https://slack-chats.kotlinlang.org/c/multiplatform)、[#compose](https://slack-chats.kotlinlang.org/c/compose)、[#compose-ios](https://slack-chats.kotlinlang.org/c/compose-ios) のようなクロスプラットフォーム開発専用の関連チャンネルがいくつかあります。
* [Kotlin X](https://twitter.com/kotlin)。ここでは、素早い専門家の洞察と最新ニュース、そして数多くのマルチプラットフォームに関するヒントを見つけることができます。
* [Kotlin YouTube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)。私たちの YouTube チャンネルでは、実践的なチュートリアル、専門家とのライブストリーム、その他視覚学習者向けの優れた教育コンテンツを提供しています。
* [Kotlin Roundup](https://lp.jetbrains.com/subscribe-to-kotlin-news/)。ダイナミックな Kotlin および Kotlin Multiplatform エコシステム全体の最新情報を常に把握したい場合は、定期的なニュースレターを購読してください！

Kotlin Multiplatform エコシステムは繁栄しています。世界中の数多くの Kotlin 開発者によって熱心に育成されています。

以下は、年間で作成された Kotlin Multiplatform ライブラリの数を示す図です。

![長年にわたる Kotlin Multiplatform ライブラリの数。](kmp-libs-over-years.png){width="700"}

ご覧のとおり、2021 年には明らかに増加し、ライブラリの数はそれ以来増え続けています。

## 他のクロスプラットフォームテクノロジーと比較して Kotlin Multiplatform を選ぶ理由とは？

[異なるクロスプラットフォームソリューション](cross-platform-frameworks.md) を選択する際には、それぞれの利点と欠点の両方を比較検討することが不可欠です。以下に、Kotlin Multiplatform があなたにとって適切な選択肢となる主要な理由を詳しく説明します。

* **優れたツール、使いやすさ**。Kotlin Multiplatform は Kotlin を活用しており、開発者にとって優れたツールと使いやすさを提供します。
* **ネイティブプログラミング**。ネイティブで記述するのは簡単です。[expected および actual 宣言](multiplatform-expect-actual.md) のおかげで、マルチプラットフォームアプリがプラットフォーム固有の API にアクセスできるようにすることができます。
* **優れたクロスプラットフォームパフォーマンス**。Kotlin で記述された共有コードは、異なるターゲット向けに異なる出力形式にコンパイルされます。Android 用の Java バイトコードと iOS 用のネイティブバイナリであり、すべてのプラットフォームで優れたパフォーマンスを保証します。

Kotlin Multiplatform を試すことをすでに決めている場合は、開始に役立つヒントをいくつかご紹介します。

* **小さく始める**。小さな共有コンポーネントや定数から始めて、チームが Kotlin Multiplatform のワークフローと利点に慣れるようにします。
* **計画を作成する**。予想される結果と、実装および分析の方法を仮定した明確な実験計画を策定します。共有コードへの貢献者の役割を定義し、変更を効果的に配布するためのワークフローを確立します。
* **評価し、レトロスペクティブを実行する**。チームとレトロスペクティブ会議を実施し、実験の成功を評価し、課題や改善点を見つけます。もしうまくいったなら、範囲を広げてさらに多くのコードを共有したいと考えるかもしれません。そうでなければ、なぜこの実験がうまくいかなかったのか理由を理解する必要があります。

[![Kotlin Multiplatform の動作を確認！今すぐ始める](kmp-get-started-action.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)

チームが Kotlin Multiplatform を開始するのを支援したい方のために、実践的なヒントを含む[詳細ガイド](multiplatform-introduce-your-team.md) を用意しました。

ご覧のとおり、Kotlin Multiplatform はすでに多くの大規模企業によって、ネイティブのような UI を持つ高性能なクロスプラットフォームアプリケーションを構築するために成功裏に使用されており、ネイティブプログラミングの利点を維持しながら、コードを効果的に再利用しています。