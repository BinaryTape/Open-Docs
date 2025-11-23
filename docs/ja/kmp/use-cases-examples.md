[//]: # (title: Kotlin と Compose Multiplatform の実稼働環境での使用事例：実際の利用例)

<web-summary>Kotlin Multiplatform と Compose Multiplatform が実際のプロジェクトでどのように実稼働環境で使用されているかを発見してください。実践的な使用事例を例とともに探ります。</web-summary>

> 世界中の大小さまざまな企業が Kotlin Multiplatform (KMP) と Compose Multiplatform を採用しており、
> このテクノロジーは、最新のクロスプラットフォームアプリケーションを構築・拡張するための信頼できるソリューションとなっています。
> 
{style="note"}

既存のアプリへの統合やアプリロジックの共有から、新しいクロスプラットフォームアプリケーションの構築まで、[Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/) は多くの企業にとって選択されるテクノロジーとなっています。これらのチームは、KMP が提供する利点を活用して、製品をより迅速に展開し、開発コストを削減しています。

Kotlin Multiplatform と Google の Jetpack Compose を搭載した宣言型 UI フレームワークである [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/) を採用する企業も増えています。[iOS 向け安定版リリース](https://blog.jetbrains.com/kotlin/2025/05/compose-multiplatform-1-8-0-released-compose-multiplatform-for-ios-is-stable-and-production-ready/)により、Compose Multiplatform はその全貌を明らかにし、KMP をクロスプラットフォームモバイル開発のための完全なソリューションにしています。

採用が進むにつれて、この記事では Kotlin Multiplatform がさまざまな業界やチーム構造でどのように実稼働環境で使用されているかについて考察します。

## ビジネスやチームのタイプ別 Kotlin Multiplatform の使用事例

ここでは、さまざまなチームが Kotlin Multiplatform を適用して、多様なプロジェクトのニーズを満たしているいくつかの方法を紹介します。

### 新しいグリーンフィールドプロジェクトを開始するスタートアップ

スタートアップは、限られたリソースと厳しい納期で運営されることがよくあります。開発効率と費用対効果を最大化するために、特に市場投入までの時間が重要な初期段階の製品や MVP においては、共有コードベースを使用して複数のプラットフォームをターゲットにすることが有益です。

ロジックと UI の両方を共有したい企業にとって、Kotlin Multiplatform と Compose Multiplatform は理想的なソリューションを提供します。共有 UI から始めて、迅速なプロトタイプ作成を可能にすることができます。ネイティブ UI と共有 UI を混在させることさえ可能です。これにより、KMP と Compose Multiplatform はグリーンフィールドプロジェクトにとって理想的な選択となり、スタートアップが速度、柔軟性、高品質なネイティブ体験のバランスを取るのに役立ちます。

**事例研究:**

*   [Instabee](https://www.youtube.com/watch?v=YsQ-2lQYQ8M) は、Android アプリケーションのロジックと UI を Kotlin Multiplatform と Compose Multiplatform に移行しました。Android のコードベースを効果的に利用することで、同社は短期間で iOS アプリケーションをリリースすることができました。
*   [Respawn Pro](https://youtu.be/LB5a2FRrT94?si=vgcJI-XoCrWree3u) は、習慣追跡および生産性向上アプリを開発しています。その iOS アプリは Compose Multiplatform で構築されており、コードの 96% を Android と共有しています。

> [Kotlin Multiplatform と Flutter](https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-flutter.html) のどちらを選択するか迷っている場合は、
> 両方のテクノロジーの概要をぜひご覧ください。
> 
{style="tip"}

### 中小企業

中小企業は、成熟した機能豊富な製品を維持しながら、コンパクトなチームであることがよくあります。Kotlin Multiplatform を使用すると、コアロジックを共有しながら、ユーザーが期待するネイティブなルックアンドフィールを維持できます。既存のコードベースに依存することで、これらのチームはユーザーエクスペリエンスを損なうことなく開発を加速できます。

KMP はまた、クロスプラットフォーム機能を徐々に導入する柔軟なアプローチをサポートします。これにより、既存のアプリを進化させたり、新しい機能を立ち上げたりするチームにとって特に効果的であり、開発時間を短縮し、オーバーヘッドを削減し、必要に応じてプラットフォーム固有のカスタマイズを維持するのに役立ちます。

**事例研究:**

*   [Down Dog](https://kotlinlang.org/lp/multiplatform/case-studies/down-dog/?_gl=1*xdrptd*_gcl_au*ODIxNDk5NDA4LjE3MjEwNDg0OTY.*_ga*MTY1Nzk3NDc4MC4xNzA1NDc1NDcw*_ga_9J976DJZ68*MTcyNzg1MTIzNS4yMzcuMS4xNzI3ODUxNDM0LjU2LjAuMA..) は、モバイルデバイスでスタジオのようなヨガ体験を提供するアプリケーションに、「Kotlin 最大限共有」戦略を採用しています。同社はクライアントとサーバー間でさまざまなヘルパーを共有し、クライアントコードのほとんどを Kotlin Multiplatform で共有しています。チームはネイティブのみのビューを維持することで、アプリの開発速度を大幅に向上させることができました。
*   [Doist](https://www.youtube.com/watch?v=z-o9MqN86eE) は、受賞歴のあるToDoリストアプリ「Todoist」でKotlin Multiplatformを活用しました。チームは、一貫した動作を確保し、開発を効率化するために、Android と iOS 間で主要なロジックを共有しました。内部ライブラリから始めて、KMP を段階的に導入しました。

### アプリケーションでデバイス間で一貫した動作を必要とする大企業

大規模なアプリケーションは通常、広範なコードベースを持ち、新機能が常に追加され、すべてのプラットフォームで同じように機能する必要がある複雑なビジネスロジックを持っています。Kotlin Multiplatform は段階的な統合を提供し、チームが段階的に導入することを可能にします。また、開発者は既存の Kotlin スキルを再利用できるため、KMP を使用することで新しい技術スタックを導入する必要がありません。

**事例研究:** [Forbes](https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/)、[McDonald’s](https://medium.com/mcdonalds-technical-blog/mobile-multiplatform-development-at-mcdonalds-3b72c8d44ebc)、[Google Docs](https://www.youtube.com/watch?v=5lkZj4v4-ks)、[Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8)、[VMware](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0)、[Cash App](https://kotlinlang.org/lp/multiplatform/case-studies/cash-app?_gl=1*1qc1ixl*_gcl_aw*R0NMLjE3NTEzNTcwMDguRUFJYUlRb2JDaE1JblBLRmc0cWJqZ01WZ0VnZENSM3pYQkVWRUFFWUFTQUFFZ0ltOVBEX0J3RQ..*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTE1MjQ2MDUkbzcxJGcxJHQxNzUxNTI3Njc5JGozJGwwJGgw)、
[Wonder App by Baidu](https://kotlinlang.org/lp/multiplatform/case-studies/baidu)

[![KMP の成功事例から学ぶ](kmp-success-stories.svg){width="700"}{style="block"}](https://kotlinlang.org/case-studies/?type=multiplatform)

### エージェンシー

多様なクライアントと協力するエージェンシーやコンサルタントは、幅広いプラットフォーム要件とビジネス目標に対応する必要があります。Kotlin Multiplatform でコードを再利用できる機能は、限られたエンジニアリングチームで複数のプロジェクトを厳しい納期で管理するチームにとって特に価値があります。KMP を採用することで、エージェンシーは納品を加速し、プラットフォーム間で一貫したアプリ動作を維持できます。

**事例研究:**

*   [IceRock](https://icerockdev.com/) は、クライアント向けにアプリを開発するために Kotlin Multiplatform を使用しているアウトソーシング企業です。そのアプリポートフォリオはさまざまなビジネス要件に対応しており、Kotlin Multiplatform 開発プロセスを強化するオープンソースの Kotlin Multiplatform ライブラリの大規模なコレクションによって補完されています。
*   エンドツーエンドのデジタルプロダクトチームである [Mirego](https://kotlinlang.org/lp/multiplatform/case-studies/mirego/) は、Kotlin Multiplatform を使用して、ウェブ、iOS、tvOS、Android、Amazon Fire TV で同じビジネスロジックを実行しています。KMP により、各プラットフォームを最大限に活用しながら、開発を効率化できます。

### 新規市場への拡大を目指す企業

一部の企業は、これまでターゲットにしていなかったプラットフォームでアプリをローンチすることで、新しい市場に参入したいと考えています。例えば、iOS 専用から Android を含める、またはその逆です。

KMP は、Android でネイティブパフォーマンスと UI の柔軟性を維持しながら、既存の iOS コードと開発プラクティスを活用するのに役立ちます。プラットフォーム固有のユーザーエクスペリエンスを維持し、既存の知識とコードを活用したい場合、KMP は理想的な長期ソリューションとなり得ます。

**事例研究:** [Instabee](https://www.youtube.com/watch?v=YsQ-2lQYQ8M) は、Kotlin Multiplatform と Compose Multiplatform を使用して、Android アプリのロジックと UI を移行しました。これにより、既存の Android コードベースの多くを再利用することで、同社は iOS 市場に迅速に参入することができました。

### ソフトウェア開発キット (SDK) を開発するチーム

共有 Kotlin コードはプラットフォーム固有のバイナリ (Android 用 JVM、iOS 用ネイティブ) にコンパイルされ、任意のプロジェクトにシームレスに統合されます。プラットフォーム固有の API を制限なく使用できる柔軟性を提供するとともに、ネイティブ UI とクロスプラットフォーム UI の選択肢も提供します。これらの機能により、Kotlin Multiplatform はモバイル SDK 開発に優れたオプションとなります。消費者から見ると、Kotlin Multiplatform SDK は通常のプラットフォーム固有の依存関係のように動作しながら、共有コードの利点を提供します。

**事例研究:** [Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8) は、HealthSuite Digital Platform モバイル SDK で Kotlin Multiplatform を使用しており、新機能のより迅速な開発と Android および iOS 開発者間のコラボレーション強化を可能にしています。

## 業界別 Kotlin Multiplatform の使用事例

Kotlin Multiplatform の汎用性は、実稼働環境で使用されている幅広い業界から明らかです。Fintech から教育まで、KMP と Compose Multiplatform は多くの種類のアプリケーションに採用されています。ここでは、業界固有の例をいくつか紹介します。

### 金融テクノロジー

Fintech アプリケーションには、複雑なビジネスロジック、セキュアなワークフロー、厳格なコンプライアンス要件がしばしば伴い、これらはすべてプラットフォーム間で一貫して実装される必要があります。Kotlin Multiplatform は、このコアロジックを単一のコードベースに統合するのに役立ち、プラットフォーム固有の不整合のリスクを低減します。これにより、iOS と Android 間での機能パリティがより迅速に確保され、ウォレットや決済のようなアプリにとって不可欠です。

**事例研究:** [Cash App](https://kotlinlang.org/lp/multiplatform/case-studies/cash-app)、[Bitkey by Block](https://engineering.block.xyz/blog/how-bitkey-uses-cross-platform-development)、[Worldline](https://blog.worldline.tech/2022/01/26/kotlin_multiplatform.html)

### メディアおよび出版

メディアおよびコンテンツ中心のアプリは、迅速な機能展開、一貫したユーザーエクスペリエンス、および各プラットフォーム向けに UI をカスタマイズする柔軟性に依存しています。Kotlin Multiplatform により、チームはコンテンツフィードや発見セクションのコアロジックを共有しつつ、ネイティブ UI を完全に制御できます。これにより、開発が加速され、コストのかかる重複が削減され、プラットフォーム間でのパリティが確保されます。

**事例研究:** [Forbes](https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/)、[9GAG](https://raymondctc.medium.com/adopting-kotlin-multiplatform-mobile-kmm-on-9gag-app-dfe526d9ce04)、[Kuaishou](https://medium.com/@xiang.j9501/case-studies-kuaiying-kotlin-multiplatform-mobile-268e325f8610)

### プロジェクト管理と生産性

共有カレンダーからリアルタイムコラボレーションまで、生産性向上アプリは、すべてのプラットフォームで同じように機能する、機能豊富な機能を要求します。Kotlin Multiplatform は、チームがこの複雑さを単一の共有コードベースに集中させるのに役立ち、すべてのデバイスで一貫した機能と動作を保証します。この柔軟性により、チームはより迅速にアップデートをリリースし、プラットフォーム間で統一されたユーザーエクスペリエンスを維持できます。

**事例研究:** [Wrike](https://www.youtube.com/watch?v=jhBmom8z3Qg)、[VMware](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0)

### 交通およびモビリティ

配車、配達、モビリティプラットフォームは、ドライバー、乗客、および加盟店アプリで共通の機能を共有することにより、Kotlin Multiplatform から恩恵を受けています。リアルタイムトラッキング、経路最適化、アプリ内チャットなどのサービスのコアロジックは、一度記述すれば Android と iOS の両方で使用でき、すべてのユーザーに一貫した動作を保証します。

**事例研究:** [Bolt](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0)、
[Feres](https://kotlinlang.org/case-studies/#case-study-feres)

### 教育テクノロジー

教育アプリは、特に大規模で分散したユーザーをサポートする場合、モバイルとウェブの両方でシームレスで一貫した学習体験を提供する必要があります。学習アルゴリズム、クイズ、およびその他のビジネスロジックを Kotlin Multiplatform で一元化することにより、教育アプリはすべてのデバイスで統一された学習体験を提供します。このコード共有は、パフォーマンスと一貫性を大幅に向上させることができます。例えば、Quizlet は共有コードを JavaScript から Kotlin に移行し、Android と iOS の両方のアプリで顕著な速度向上が見られました。

**事例研究:** [Duolingo](https://youtu.be/RJtiFt5pbfs?si=mFpiN9SNs8m-jpFL)、[Quizlet](https://quizlet.com/blog/shared-code-kotlin-multiplatform)、[Chalk](https://kotlinlang.org/lp/multiplatform/case-studies/chalk/?_gl=1*1wxmdrv*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTEwMjI5ODAkbzYwJGcxJHQxNzUxMDIzMTU2JGo1OCRsMCRoMA..)、[Memrise](https://engineering.memrise.com/kotlin-multiplatform-memrise-3764b5a4a0db)、
[Physics Wallah](https://kotlinlang.org/case-studies/#case-study-physics-wallah)

### Eコマース

クロスプラットフォームのショッピング体験を構築するには、共有ビジネスロジックと、支払い、カメラアクセス、地図などのネイティブ機能とのバランスを取る必要があります。Kotlin Multiplatform と Compose Multiplatform を使用することで、チームはビジネスロジックと UI の両方をプラットフォーム間で共有しながら、必要に応じてプラットフォーム固有のコンポーネントを使用できます。このハイブリッドアプローチは、より迅速な開発、一貫したユーザーエクスペリエンス、そして重要なネイティブ機能を統合する柔軟性を保証します。

**事例研究:** [Balary Market](https://kotlinlang.org/case-studies/#case-study-balary)、[Markaz](https://kotlinlang.org/case-studies/#case-study-markaz)

### ソーシャルネットワーキングとコミュニティ

ソーシャルプラットフォームでは、タイムリーな機能提供と一貫したインタラクションが、コミュニティをデバイス間で活発に維持し、接続し続けるために不可欠です。主要なインタラクションロジックには、メッセージング、通知、スケジューリングなどが含まれる場合があります。例えば、ユーザーが地元のグループ、イベント、アクティビティを見つけることができる Meetup は、KMP のおかげで新機能を同時にリリースできるようになりました。

**事例研究:** [Meetup](https://youtu.be/GtJBS7B3eyM?si=lNX3KMhSTCICFPxv)

### 健康とウェルネス

ヨガのセッションを案内する場合でも、デバイス間でヘルスデータを同期する場合でも、ウェルネスアプリは応答性と信頼性の高いクロスプラットフォーム動作の両方に依存しています。これらのアプリは、ワークアウトロジックやデータ処理などのコア機能を共有しつつ、完全にネイティブな UI と、センサー、通知、ヘルス API などのプラットフォーム固有の統合を維持する必要があることがよくあります。

**事例研究:** [Respawn Pro](https://youtu.be/LB5a2FRrT94?si=vgcJI-XoCrWree3u)、[Fast&amp;Fit](https://kotlinlang.org/case-studies/#case-study-fast-and-fit)、[Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8)、[Down Dog](https://kotlinlang.org/lp/multiplatform/case-studies/down-dog)

### 郵便サービス

一般的な使用事例ではありませんが、Kotlin Multiplatform は 377 年の歴史を持つ国の郵便サービスにも採用されています。ノルウェーの Posten Bring は KMP を使用して、数十のフロントエンドおよびバックエンドシステムにわたる複雑なビジネスロジックを統合し、ワークフローを効率化し、新しいサービスの展開にかかる時間を数か月から数日へと劇的に短縮するのに役立てています。

**事例研究:** [Posten Bring](https://2024.javazone.no/program/a1d9aeac-ffc3-4b1d-ba08-a0568f415a02)

これらの例は、Kotlin Multiplatform が事実上あらゆる業界やアプリの種類で使用できることを示しています。Fintech アプリ、モビリティソリューション、教育プラットフォーム、その他どのようなものを構築する場合でも、Kotlin Multiplatform はネイティブ体験を犠牲にすることなく、プロジェクトにとって意味のある限り多くのコードを共有する柔軟性を提供します。また、このテクノロジーを実稼働環境で使用している他の多くの企業を紹介する、[KMP の豊富な事例集](https://kotlinlang.org/case-studies/?type=multiplatform)も参照できます。