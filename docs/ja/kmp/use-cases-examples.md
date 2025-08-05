[//]: # (title: Kotlin と Compose Multiplatform の本番環境での利用：実際のユースケース)

<web-summary>Kotlin Multiplatform と Compose Multiplatform が実際のプロジェクトでどのように本番環境で利用されているかを発見しましょう。実用的なユースケースを例とともに探ります。</web-summary>

> 世界中の大小さまざまな企業が Kotlin Multiplatform (KMP) と Compose Multiplatform を採用しており、この技術は現代のクロスプラットフォームアプリケーションを構築し、スケールするための信頼できるソリューションとなっています。
> 
{style="note"}

既存のアプリへの統合やアプリロジックの共有から、新しいクロスプラットフォームアプリケーションの構築まで、[Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/) は多くの企業にとって選択される技術となっています。これらのチームは、KMP が提供する利点を活用して、製品をより迅速に展開し、開発コストを削減しています。

また、ますます多くの企業が、Kotlin Multiplatform と Google の Jetpack Compose を基盤とする宣言型 UI フレームワークである [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/) を採用しています。[iOS 向けの安定版リリース](https://blog.jetbrains.com/kotlin/2025/05/compose-multiplatform-1-8-0-released-compose-multiplatform-for-ios-is-stable-and-production-ready/) により、Compose Multiplatform は全体像を完成させ、KMP をクロスプラットフォームモバイル開発のための完全なソリューションにしています。

採用が進むにつれて、この記事では Kotlin Multiplatform がさまざまな業界やチーム構造において、本番環境でどのように使用されているかを検証します。

## ビジネスとチームのタイプ別 Kotlin Multiplatform のユースケース

さまざまなチームが、多様なプロジェクトニーズを満たすために Kotlin Multiplatform を適用しているいくつかの方法を以下に示します。

### 新しいグリーンフィールドプロジェクトを開始するスタートアップ

スタートアップは、限られたリソースと厳しい納期で活動することがよくあります。開発効率と費用対効果を最大化するために、特に市場投入までの時間が重要な初期段階の製品や MVP (Minimum Viable Product) において、共有コードベースを使用して複数のプラットフォームをターゲットにすることから恩恵を受けています。

ロジックと UI の両方を共有したい企業にとって、Compose Multiplatform を使用した Kotlin Multiplatform は理想的なソリューションを提供します。共有 UI から始めて、迅速なプロトタイプ作成が可能です。ネイティブ UI と共有 UI を組み合わせることもできます。これにより、Compose Multiplatform を使用した KMP はグリーンフィールドプロジェクトにとって理想的な選択となり、スタートアップがスピード、柔軟性、高品質なネイティブエクスペリエンスのバランスを取るのに役立ちます。

**ケーススタディ:**

*   [Instabee](https://www.youtube.com/watch?v=YsQ-2lQYQ8M) は、Android アプリケーションのロジックと UI を Kotlin Multiplatform と Compose Multiplatform に移行しました。Android のコードベースを効果的に活用することで、同社は短期間で iOS アプリケーションをリリースすることができました。
*   [Respawn Pro](https://youtu.be/LB5a2FRrT94?si=vgcJI-XoCrWree3u) は、習慣トラッキングと生産性向上アプリを開発しています。その iOS アプリは Compose Multiplatform で構築されており、コードの 96% が Android と共有されています。

> [Kotlin Multiplatform と Flutter](https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-flutter.html) のどちらを選ぶか迷っているなら、両方の技術の概要もぜひご覧ください。
> 
{style="tip"}

### 中小企業

中小企業は、成熟した機能豊富な製品を維持しながら、コンパクトなチームで運営していることがよくあります。Kotlin Multiplatform を使用すると、ユーザーが期待するネイティブのルック＆フィールを維持しつつ、コアロジックを共有できます。既存のコードベースに頼ることで、これらのチームはユーザーエクスペリエンスを損なうことなく開発を加速できます。

KMP はまた、クロスプラットフォーム機能を段階的に導入する柔軟なアプローチをサポートしています。これにより、既存のアプリを進化させたり、新機能を立ち上げたりするチームにとって特に効果的であり、開発時間の短縮、オーバーヘッドの削減、必要に応じたプラットフォーム固有のカスタマイズの維持に役立ちます。

**ケーススタディ:**

*   [Down Dog](https://kotlinlang.org/lp/multiplatform/case-studies/down-dog/?_gl=1*xdrptd*_gcl_au*ODIxNDk5NDA4LjE3MjEwNDg0OTY.*_ga*MTY1Nzk3NDc4MC4xNzA1NDc1NDcw*_ga_9J976DJZ68*MTcyNzg1MTIzNS4yMzcuMS4xNzI3ODUxNDM0LjU2LjAuMA..) は、スタジオのようなヨガ体験をモバイルデバイスにもたらすアプリケーションに、「最大限の Kotlin 共有」戦略を採用しています。同社は、クライアントとサーバー間でさまざまなヘルパーを共有し、クライアントコードのほとんどを Kotlin Multiplatform で共有しています。チームは、ネイティブ専用のビューを維持することで、アプリの開発速度を大幅に向上させることができました。
*   [Doist](https://www.youtube.com/watch?v=z-o9MqN86eE) は、受賞歴のある To-Do リストアプリ Todoist で Kotlin Multiplatform を活用しました。チームは、一貫した動作を確保し、開発を効率化するために、Android と iOS 間で主要なロジックを共有しました。KMP は社内ライブラリから段階的に採用されました。

### アプリケーションでデバイス間の一貫した動作を必要とするエンタープライズ

大規模なアプリケーションは通常、広範なコードベースを持ち、新機能が常に追加され、すべてのプラットフォームで同じように動作する必要がある複雑なビジネスロジックを持っています。Kotlin Multiplatform は段階的な統合を提供し、チームが少しずつ採用することを可能にします。また、開発者は既存の Kotlin スキルを再利用できるため、KMP を使用することで新しい技術スタックを導入する必要もなくなります。

**ケーススタディ:** [Forbes](https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/)、[McDonald’s](https://medium.com/mcdonalds-technical-blog/mobile-multiplatform-development-at-mcdonalds-3b72c8d44ebc/)、[Google Docs](https://www.youtube.com/watch?v=5lkZj4v4-ks/)、[Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8/)、[VMware](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0/)、[Cash App](https://kotlinlang.org/lp/multiplatform/case-studies/cash-app?_gl=1*1qc1ixl*_gcl_aw*R0NMLjE3NTEzNTcwMDguRUFJYUlRb2JDaE1JblBLRmc0cWJqZ01WZ0VnZENSM3pYQkVWRUFFWUFTQUFFZ0ltOVBEX0J3RQ..*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTE1MjQ2MDUkbzcxJGcxJHQxNzUxNTI3Njc5JGozJGwwJGgw)、[Wonder App by Baidu](https://kotlinlang.org/lp/multiplatform/case-studies/baidu)

[![KMP 成功事例から学ぶ](kmp-success-stories.svg){width="700"}{style="block"}](case-studies.topic)

### エージェンシー

多様なクライアントと協力するエージェンシーやコンサルティング会社は、幅広いプラットフォーム要件とビジネス目標に対応する必要があります。Kotlin Multiplatform によるコード再利用の能力は、厳しい納期と限られたエンジニアリングチームで複数のプロジェクトを管理するチームにとって特に価値があります。KMP を採用することで、エージェンシーは納品を加速し、プラットフォーム間でのアプリの一貫した動作を維持できます。

**ケーススタディ:**

*   [IceRock](https://icerockdev.com/) は、Kotlin Multiplatform を使用してクライアント向けのアプリを開発しているアウトソーシング企業です。そのアプリポートフォリオは多様なビジネス要件に対応しており、Kotlin Multiplatform 開発プロセスを強化する豊富なオープンソースの Kotlin Multiplatform ライブラリによって補完されています。
*   エンドツーエンドのデジタルプロダクトチームである [Mirego](https://kotlinlang.org/lp/multiplatform/case-studies/mirego/) は、Kotlin Multiplatform を使用して、ウェブ、iOS、tvOS、Android、Amazon Fire TV で同じビジネスロジックを実行しています。KMP により、各プラットフォームを最大限に活用しつつ開発を効率化できます。

### 新しい市場に拡大する企業

一部の企業は、これまでターゲットとしていなかったプラットフォームでアプリをリリースすることで、新しい市場に参入したいと考えています。たとえば、iOS 専用から Android を含むように移行したり、その逆も可能です。

KMP は、既存の iOS コードと開発プラクティスを活用しつつ、Android 上でネイティブパフォーマンスと UI の柔軟性を維持するのに役立ちます。プラットフォーム固有のユーザーエクスペリエンスを維持し、既存の知識とコードを活用したい場合、KMP は理想的な長期ソリューションとなり得ます。

**ケーススタディ:** [Instabee](https://www.youtube.com/watch?v=YsQ-2lQYQ8M) は、Android アプリのロジックと UI を移行するために、Kotlin Multiplatform と Compose Multiplatform を使用しました。これにより、同社は既存の Android コードベースの多くを再利用することで、迅速に iOS 市場に参入することができました。

### ソフトウェア開発キット (SDK) を開発するチーム

共有された Kotlin コードは、プラットフォーム固有のバイナリ（Android の場合は JVM、iOS の場合はネイティブ）にコンパイルされ、どのプロジェクトにもシームレスに統合されます。プラットフォーム固有の API を制限なく使用できる柔軟性を提供し、ネイティブ UI とクロスプラットフォーム UI のいずれかを選択することもできます。これらの機能により、Kotlin Multiplatform はモバイル SDK 開発にとって優れた選択肢となります。消費者の視点から見ると、あなたの Kotlin Multiplatform SDK は通常のプラットフォーム固有の依存関係と同様に動作しつつ、共有コードの利点も提供します。

**ケーススタディ:** [Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8) は、HealthSuite Digital Platform モバイル SDK に Kotlin Multiplatform を使用しており、新機能の開発を加速し、Android と iOS 開発者間のコラボレーションを強化しています。

## 業界別 Kotlin Multiplatform ユースケース

Kotlin Multiplatform の多様性は、本番環境で利用されている幅広い業界から明らかです。フィンテックから教育まで、Compose Multiplatform を使用した KMP は多くの種類のアプリケーションで採用されています。以下に、業界固有のいくつかの例を示します。

### 金融テクノロジー (Fintech)

フィンテックアプリケーションは、複雑なビジネスロジック、セキュアなワークフロー、厳格なコンプライアンス要件を伴うことが多く、これらはすべてプラットフォーム間で一貫して実装される必要があります。Kotlin Multiplatform は、このコアロジックを単一のコードベースに統合し、プラットフォーム固有の不整合のリスクを低減するのに役立ちます。これにより、iOS と Android 間でより迅速な機能パリティが保証され、ウォレットや決済などのアプリにとって非常に重要です。

**ケーススタディ:** [Cash App](https://kotlinlang.org/lp/multiplatform/case-studies/cash-app/)、[Bitkey by Block](https://engineering.block.xyz/blog/how-bitkey-uses-cross-platform-development/)、[Worldline](https://blog.worldline.tech/2022/01/26/kotlin_multiplatform.html)

### メディアと出版

メディアおよびコンテンツ主導型アプリは、迅速な機能展開、一貫したユーザーエクスペリエンス、そして各プラットフォーム向けに UI をカスタマイズする柔軟性に依存しています。Kotlin Multiplatform は、コンテンツフィードや発見セクションのコアロジックをチームが共有しながら、ネイティブ UI を完全に制御できるようにします。これにより、開発が加速され、コストのかかる重複が削減され、プラットフォーム間での同等性が保証されます。

**ケーススタディ:** [Forbes](https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/)、[9GAG](https://raymondctc.medium.com/adopting-kotlin-multiplatform-mobile-kmm-on-9gag-app-dfe526d9ce04)、[Kuaishou](https://medium.com/@xiang.j9501/case-studies-kuaiying-kotlin-multiplatform-mobile-268e325f8610)

### プロジェクト管理と生産性

共有カレンダーからリアルタイムコラボレーションまで、生産性向上アプリはすべてのプラットフォームで同じように動作する、機能豊富な機能を必要とします。Kotlin Multiplatform は、チームがこの複雑さを単一の共有コードベースに集中させるのに役立ち、すべてのデバイスで一貫した機能と動作を保証します。この柔軟性により、チームはより迅速にアップデートをリリースし、プラットフォーム間で統一されたユーザーエクスペリエンスを維持できます。

**ケーススタディ:** [Wrike](https://www.youtube.com/watch?v=jhBmom8z3Qg/)、[VMware](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0/)

### 交通とモビリティ

ライドヘイリング、デリバリー、モビリティプラットフォームは、ドライバー、ライダー、マーチャントアプリ間で共通機能を共有することで、Kotlin Multiplatform の恩恵を受けています。リアルタイム追跡、ルート最適化、アプリ内チャットなどのサービスのコアロジックは、一度書けば Android と iOS の両方で使用でき、すべてのユーザーに一貫した動作を保証します。

**ケーススタディ:** [Bolt](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0/)、[Feres](case-studies.topic#case-study-feres)

### 教育テクノロジー (EdTech)

教育アプリは、特に大規模で分散したユーザーをサポートする場合、モバイルとウェブの両方でシームレスで一貫した学習体験を提供する必要があります。Kotlin Multiplatform で学習アルゴリズム、クイズ、その他のビジネスロジックを集中管理することで、教育アプリはすべてのデバイスで統一された学習体験を提供します。このコード共有は、パフォーマンスと一貫性を大幅に向上させることができます。例えば、Quizlet は共有コードを JavaScript から Kotlin に移行し、Android と iOS の両方のアプリで著しい速度向上を見ました。

**ケーススタディ:** [Duolingo](https://youtu.be/RJtiFt5pbfs?si=mFpiN9SNs8m-jpFL/)、[Quizlet](https://quizlet.com/blog/shared-code-kotlin-multiplatform/)、[Chalk](https://kotlinlang.org/lp/multiplatform/case-studies/chalk/?_gl=1*1wxmdrv*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTEwMjI5ODAkbzYwJGcxJHQxNzUxMDIzMTU2JGo1OCRsMCRoMA..)、[Memrise](https://engineering.memrise.com/kotlin-multiplatform-memrise-3764b5a4a0db/)、[Physics Wallah](case-studies.topic#case-study-physics-wallah)

### Eコマース

クロスプラットフォームのショッピング体験を構築するということは、共有ビジネスロジックと、決済、カメラアクセス、地図などのネイティブ機能をバランスさせることを意味します。Compose Multiplatform を使用した Kotlin Multiplatform は、チームがビジネスロジックと UI の両方をプラットフォーム間で共有できるようにすると同時に、必要に応じてプラットフォーム固有のコンポーネントを使用することも可能にします。このハイブリッドアプローチにより、開発が加速され、一貫したユーザーエクスペリエンスが実現され、重要なネイティブ機能を統合する柔軟性が確保されます。

**ケーススタディ:** [Balary Market](case-studies.topic#case-study-balary)、[Markaz](case-studies.topic#case-study-markaz)

### ソーシャルネットワーキングとコミュニティ

ソーシャルプラットフォームでは、コミュニティをデバイス間で活発に接続し続けるために、タイムリーな機能提供と一貫したインタラクションが不可欠です。主要なインタラクションロジックには、メッセージング、通知、スケジューリングなどが含まれる場合があります。例えば、ユーザーが地域のグループ、イベント、アクティビティを見つけられる Meetup は、KMP のおかげで新機能を同時にリリースできるようになりました。

**ケーススタディ:** [Meetup](https://youtu.be/GtJBS7B3eyM?si=lNX3KMhSTCICFPxv)

### ヘルスケアとウェルネス

ヨガセッションのガイドであろうと、デバイス間の健康データ同期であろうと、ウェルネスアプリは応答性と信頼性の高いクロスプラットフォーム動作の両方に依存します。これらのアプリは、ワークアウトロジックやデータ処理などのコア機能を共有しつつ、完全にネイティブな UI やセンサー、通知、ヘルスケア API などのプラットフォーム固有の統合を維持する必要があることがよくあります。

**ケーススタディ:** [Respawn Pro](https://youtu.be/LB5a2FRrT94?si=vgcJI-XoCrWree3u/)、[Fast&amp;Fit](case-studies.topic#case-study-fast-and-fit)、[Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8/)、[Down Dog](https://kotlinlang.org/lp/multiplatform/case-studies/down-dog/?_gl=1*1ryf8m7*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTEyNzEzNzckbzYyJGcxJHQxNzUxMjcxMzgzJGo1NCRsMCRoMA..)

### 郵便サービス

一般的なユースケースではありませんが、Kotlin Multiplatform は、創業377年の国営郵便サービスにも採用されています。ノルウェーの Posten Bring は KMP を使用して、数十のフロントエンドおよびバックエンドシステムにわたる複雑なビジネスロジックを統合し、ワークフローを効率化し、新しいサービスの展開に必要な時間を数か月から数日に劇的に短縮するのに役立てています。

**ケーススタディ:** [Posten Bring](https://2024.javazone.no/program/a1d9aeac-ffc3-4b1d-ba08-a0568f415a02)

これらの例は、Kotlin Multiplatform が事実上あらゆる業界やアプリタイプでどのように使用できるかを示しています。フィンテックアプリ、モビリティソリューション、教育プラットフォームなど、何であれ、Kotlin Multiplatform はネイティブエクスペリエンスを犠牲にすることなく、プロジェクトにとって意味のあるコードを可能な限り共有できる柔軟性を提供します。また、この技術を本番環境で使用している他の多くの企業を紹介する、[KMP ケーススタディ](case-studies.topic) の広範なリストも確認できます。