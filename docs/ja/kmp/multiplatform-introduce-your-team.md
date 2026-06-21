[//]: # (title: チームにマルチプラットフォーム・モバイル開発を導入する方法)

<web-summary>チームにマルチプラットフォーム・モバイルアプリ開発を導入するための6つの推奨事項を学び、スムーズで効率的な導入を実現しましょう。</web-summary>

組織に新しい技術やツールを導入することには、常に困難が伴います。ワークフローを最適化し合理化するために、[モバイルアプリ開発へのマルチプラットフォームアプローチ](cross-platform-mobile-development.topic)をチームが採用できるよう、どのようにサポートすればよいでしょうか？ここでは、JetBrainsが開発したオープンソース技術である[Kotlin Multiplatform (KMP)](https://www.jetbrains.com/kotlin-multiplatform/)を効果的にチームへ紹介するための推奨事項とベストプラクティスを紹介します。KMPを使用すると、ネイティブプログラミングの利点を維持しながら、プラットフォーム間でコードを共有できます。

* [共感から始める](#start-with-empathy)
* [Kotlin Multiplatformの仕組みを説明する](#explain-how-kotlin-multiplatform-works)
* [ケーススタディを使用してマルチプラットフォーム開発の価値を示す](#use-case-studies-to-demonstrate-the-value-of-multiplatform-development)
* [サンプルプロジェクトを作成して証明する](#offer-proof-by-creating-a-sample-project)
* [チームからのマルチプラットフォーム開発に関する質問に備える](#prepare-for-questions-about-multiplatform-development-from-your-team)
* [適応期間中のチームをサポートする](#support-your-team-during-the-adaptation-period)

## 共感から始める

ソフトウェア開発はチームプレーであり、重要な決定にはすべてのチームメンバーの承認が必要です。クロスプラットフォーム技術の統合は、モバイルアプリケーションの開発プロセスに大きな影響を与えます。そのため、プロジェクトにKotlin Multiplatformを統合し始める前に、チームにこの技術を紹介し、導入する価値があることを慎重に理解してもらう必要があります。

プロジェクトに携わる人々を理解することが、統合を成功させるための第一歩です。上司は、最高品質の機能を可能な限り短期間で提供する責任を負っています。彼らにとって、新しい技術はリスクとなります。同僚たちもまた、異なる視点を持っています。彼らは「ネイティブ」な技術スタックでアプリを構築してきた経験があります。UIやビジネスロジックの書き方、依存関係の扱い方、IDEでのテストやデバッグ方法を熟知しており、言語にも慣れ親しんでいます。異なるエコシステムへの切り替えは常に不便を伴い、コンフォートゾーン（慣れ親しんだ環境）を離れることを意味します。

これらすべてを踏まえ、Kotlin Multiplatformへの移行を提案する際には、多くの偏見に直面し、多くの質問に答える覚悟をしておいてください。その際、常にチームが必要としているものを見失わないようにしましょう。以下のいくつかのアドバイスは、提案の準備に役立つはずです。

## Kotlin Multiplatformの仕組みを説明する

この段階では、Kotlin Multiplatformを使用することがプロジェクトに価値をもたらす可能性があることを示し、チームが抱いているかもしれないクロスプラットフォーム・モバイルアプリケーションに対する偏見や疑念を払拭する必要があります。

KMPはAlpha版のリリース以来、本番環境で広く使用されてきました。その結果、JetBrainsは膨大なフィードバックを収集し、[Stable（安定版）](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)ではさらに優れた開発体験を提供できるようになりました。

* **すべてのiOSおよびAndroid機能を利用可能** – 共有コードでタスクを達成できない場合や、特定のネイティブ機能を使用したい場合は、いつでも[expect/actual](multiplatform-expect-actual.md)パターンを使用して、プラットフォーム固有のコードをシームレスに記述できます。
* **シームレスなパフォーマンス** – Kotlinで書かれた共有コードは、ターゲットごとに異なる出力形式にコンパイルされます。Android向けにはJavaバイトコード、iOS向けにはネイティブバイナリとなります。したがって、プラットフォーム上でこのコードを実行する際のランタイムオーバーヘッドはなく、パフォーマンスは[ネイティブアプリ](native-and-cross-platform.topic)と同等です。
* **既存コードとの互換性** – プロジェクトの規模に関わらず、既存のコードがKotlin Multiplatformの統合を妨げることはありません。いつでもクロスプラットフォームコードの記述を開始し、通常の依存関係としてiOSおよびAndroidアプリに接続できます。また、すでに記述したコードを使用して、iOSと互換性を持つように修正することも可能です。

技術が「どのように」機能するかを説明できることは非常に重要です。仕組みが「魔法」のように見える議論を好む人はいません。不明な点があると、人々は最悪の事態を想定しがちです。説明するまでもなく明白だと思い込む間違いを犯さないよう注意してください。次の段階に進む前に、すべての基本概念を説明するように努めましょう。[マルチプラットフォームプログラミング](get-started.topic)に関するこのドキュメントは、知識を体系化し準備するのに役立ちます。

## ケーススタディを使用してマルチプラットフォーム開発の価値を示す

マルチプラットフォーム技術の仕組みを理解することは必要ですが、それだけでは不十分です。チームはそれを使用することによるメリットを確認する必要があり、そのメリットの提示方法は自社の製品に関連したものであるべきです。

この段階では、製品でKotlin Multiplatformを使用することの主なメリットを説明する必要があります。一つの方法は、すでにクロスプラットフォーム・モバイル開発の恩恵を受けている他社の事例を共有することです。それらのチーム、特に自社と似た製品目標を持つチームの成功体験は、最終決定を下す際の重要な要素となります。

すでにKotlin Multiplatformを本番環境で使用している企業のケーススタディを引用することは、説得力のある議論を行う上で非常に役立ちます。

* **McDonald's** – グローバルモバイルアプリにKotlin Multiplatformを活用することで、マクドナルドはプラットフォーム間で共有可能なコードベースを構築し、コードの重複を排除しました。
* **Netflix** – Kotlin Multiplatformの助けを借りて、Netflixは製品の信頼性と配信速度を最適化しています。これは顧客のニーズに応えるために極めて重要です。
* **Forbes** – ロジックの80%以上をiOSとAndroidで共有することで、Forbesはプラットフォーム固有のカスタマイズの柔軟性を維持しながら、両プラットフォームで新しい機能を同時にリリースしています。
* **9GAG** – FlutterとReact Nativeの両方を試した後、9GAGは徐々にKotlin Multiplatformを採用しました。現在では、ユーザーに一貫した体験を提供しながら、機能をより迅速にリリースするのに役立っています。

[![Kotlin Multiplatformの成功事例から学ぶ](kmp-success-stories.svg){width="700"}](https://www.jetbrains.com/help/kotlin-multiplatform-dev/case-studies.html)

## サンプルプロジェクトを作成して証明する

理論も重要ですが、最終的には実践が最も重要です。説得力を高め、マルチプラットフォーム・モバイルアプリ開発の可能性を示す一つの選択肢として、Kotlin Multiplatformで何かを作成し、その結果をチームで議論するために持ち寄ることに時間を割くことができます。プロトタイプは、ゼロから作成し、アプリケーションに必要な機能を実証するテストプロジェクトのようなものが良いでしょう。
[KtorとSQLDelightを使用したマルチプラットフォームアプリの作成 – チュートリアル](multiplatform-ktor-sqldelight.md)は、このプロセスの優れたガイドになります。

現在のプロジェクトで実験することで、より関連性の高い例を作成できるかもしれません。
Kotlinで実装された既存の機能を一つ選んでクロスプラットフォーム化したり、既存のプロジェクトに新しいマルチプラットフォームモジュールを作成して、バックログの下の方にある優先度の低い機能を選び、共有モジュールで実装したりすることもできます。
[AndroidアプリケーションをiOSで動作させる – チュートリアル](multiplatform-integrate-in-existing-app.md)では、サンプルプロジェクトに基づいたステップバイステップのガイドを提供しています。

## チームからのマルチプラットフォーム開発に関する質問に備える

提案がいかに詳細であっても、チームからは多くの質問が出るでしょう。注意深く耳を傾け、根気強くすべてに答えるようにしてください。質問の多くは、日常の業務でKotlinを見慣れていないiOSチームから出ることが予想されます。以下のよくある質問リストが役に立つはずです。

### Q: クロスプラットフォーム技術に基づいたアプリケーションはApp Storeで拒否される可能性があると聞きました。このリスクを冒す価値はありますか？

A: Apple Storeにはアプリケーションの公開に関する厳格なガイドラインがあります。制限の一つに、アプリの機能を紹介したり変更したりするコードをダウンロード、インストール、または実行してはならないというものがあります（[App Store Review Guideline 2.5.2](https://developer.apple.com/app-store/review/guidelines/#software-requirements)）。これは一部のクロスプラットフォーム技術には当てはまりますが、Kotlin Multiplatformには当てはまりません。共有されたKotlinコードはKotlin/Nativeによってネイティブバイナリにコンパイルされ、通常のiOSフレームワークとしてアプリに同梱されます。動的なコード実行機能は提供しません。

### Q: マルチプラットフォームプロジェクトはGradleでビルドされますが、Gradleは学習曲線が非常に急峻です。プロジェクトの構成に多くの時間を費やす必要があるということでしょうか？ {id="gradle-time-spent"}

A: 実際にはその必要はありません。Kotlinモバイルアプリケーションのビルドに関するワークプロセスを整理する方法はいくつかあります。まず、Androidエンジニアのみがビルドを担当し、iOSチームはコードを書くだけ、あるいは生成されたアーティファクトを利用するだけにすることもできます。また、Gradleの操作が必要なタスクを扱う際に、ワークショップを企画したりペアプログラミングを実践したりすることで、チームのGradleスキルを向上させることもできます。マルチプラットフォームプロジェクトにおけるチームワークの構成方法をいくつか検討し、チームに最も適したものを選択してください。

Androidチームのみが共有コードを扱う場合、iOSデベロッパーはKotlinを学ぶ必要さえありません。しかし、全員が共有コードに貢献する次の段階に進む準備ができたとき、その移行に多くの時間はかかりません。SwiftとKotlinの構文や機能の類似性により、共有Kotlinコードの読み書きを学ぶのに必要な労力は大幅に軽減されます。[Kotlin Koans](https://play.kotlinlang.org/koans/overview)（Kotlinの構文やイディオムに慣れるための一連の演習）で自分自身で試してみてください。

2023年末、JetBrainsは[Amper](https://blog.jetbrains.com/blog/2023/11/09/amper-improving-the-build-tooling-user-experience/)を発表しました。これは使いやすさ、オンボーディング、IDEサポートに焦点を当てた新しい実験的なプロジェクト構成ツールです。Amperの機能について詳しく知るには、その[チュートリアル](amper.md)をご覧ください。

### Q: Kotlin Multiplatformはプロダクションレディ（本番環境対応）ですか？

A: 2023年11月に、Kotlin Multiplatformが[Stable（安定版）](https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/)になったことを発表しました。つまり、現在は本番環境で完全に使用できる状態です。

### Q: アプリのビジネスロジックを実装するためのマルチプラットフォームライブラリが不足しています。ネイティブの代替案を見つける方がはるかに簡単です。なぜKotlin Multiplatformを選ぶべきなのでしょうか？ {id="not-enough-libraries"}

A: Kotlin Multiplatformのエコシステムは活況を呈しており、世界中の多くのKotlinデベロッパーによって育まれています。KMPライブラリの数が数年でいかに急速に増加しているかを見てみてください。

![長年にわたるKotlin Multiplatformライブラリの数](kmp-libraries-over-years.png){width=700}

また、Kotlin Multiplatformのオープンソースコミュニティにおいて、iOSデベロッパーとして参加するには絶好の機会です。iOSの経験は需要が高く、iOS固有の貢献によって認知を得るチャンスが豊富にあります。

チームがマルチプラットフォーム・モバイル開発を深掘りすればするほど、質問はより興味深く複雑なものになるでしょう。答えがわからなくても心配しないでください。Kotlin Multiplatformには、Kotlin Slackに [#multiplatform](https://slack-chats.kotlinlang.org/c/multiplatform) という専用チャンネルを持つ大規模で協力的なコミュニティがあり、すでに利用している多くの開発者が助けてくれます。また、チームから寄せられた最も一般的な質問を[私たちに共有](mailto:kotlin.multiplatform.feedback@kotlinlang.org)していただければ非常に幸いです。その情報は、ドキュメントでカバーすべきトピックを理解するのに役立ちます。

## 適応期間中のチームをサポートする

Kotlin Multiplatformの使用を決定した後、チームが技術を試行錯誤する適応期間があります。そして、あなたの任務はまだ終わりではありません！チームメイトに継続的なサポートを提供することで、チームが技術に没頭し、最初の成果を上げるまでにかかる時間を短縮できます。

この段階でチームをサポートするためのヒントをいくつか紹介します。

* 前の段階で受けた質問を「Kotlin Multiplatform：よくある質問（FAQ）」Wikiページにまとめ、チームで共有する。
* *#kotlin-multiplatform-support* Slackチャンネルを作成し、そこで最もアクティブなユーザーになる。
* ポップコーンとピザを用意して、Kotlin Multiplatformに関する教育的またはインスピレーションを与える動画を鑑賞するインフォーマルなチームビルディングイベントを開催する。おすすめの動画をいくつか紹介します：
   * [Getting Started With KMP: Build Apps for iOS and Android With Shared Logic and Native UIs](https://www.youtube.com/live/zE2LIAUisRI?si=V1cn1Pr-0Sjmjzeu) 
   * [Build Apps for iOS, Android, and Desktop With Compose Multiplatform](https://www.youtube.com/live/IGuVIRZzVTk?si=WFI3GelN7UDjfP97) 
   * [iOS Development With Kotlin Multiplatform: Tips and Tricks](https://www.youtube.com/watch?v=eFzy1BRtHps) 
   * [Kotlin Multiplatform for Teams by Kevin Galligan](https://www.youtube.com/watch?v=-tJvCOfJesk)

現実には、人々の心や考えを1日や1週間で変えることはおそらく不可能です。しかし、同僚のニーズに対する忍耐強さと注意深さは、間違いなく結果をもたらすでしょう。

JetBrainsチームは、[Kotlin Multiplatformに関する皆さんの体験談](mailto:kotlin.multiplatform.feedback@kotlinlang.org)をお待ちしています。

_この記事の作成にあたり協力してくださった[Touchlabチーム](https://touchlab.co)に感謝いたします。_