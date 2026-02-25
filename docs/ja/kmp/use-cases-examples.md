[//]: # (title: 本番環境における Kotlin と Compose Multiplatform：実世界での活用事例)

<web-summary>Compose Multiplatform を備えた Kotlin Multiplatform が、実世界のプロジェクトの本番環境でどのように活用されているかをご紹介します。実用的なユースケースと具体例を探索しましょう。</web-summary>

> 世界中の大小さまざまな企業が Compose Multiplatform を備えた Kotlin Multiplatform (KMP) を採用しており、このテクノロジーはモダンなクロスプラットフォームアプリケーションを構築・拡張するための信頼できるソリューションとなっています。
> 
{style="note"}

既存アプリへの統合やロジックの共有から、新しいクロスプラットフォームアプリケーションの構築まで、[Kotlin Multiplatform](https://www.jetbrains.com/kotlin-multiplatform/) は多くの企業にとって最適な選択肢となっています。これらのチームは、KMP が提供する利点を活かして、製品のリリースを迅速化し、開発コストを削減しています。

また、Kotlin Multiplatform と Google の Jetpack Compose をベースとした宣言型 UI フレームワークである [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/) を採用する企業も増えています。[iOS 向けの安定版リリース](https://blog.jetbrains.com/kotlin/2025/05/compose-multiplatform-1-8-0-released-compose-multiplatform-for-ios-is-stable-and-production-ready/)により、Compose Multiplatform はパズルを完成させ、KMP をクロスプラットフォーム・モバイル開発の完全なソリューションへと進化させました。

採用が広がる中、この記事では、さまざまな業界やチーム体制において Kotlin Multiplatform が本番環境でどのように使用されているかを詳しく見ていきます。

## ビジネスタイプとチーム別の Kotlin Multiplatform ユースケース

以下に、さまざまなチームがプロジェクトのニーズを満たすために Kotlin Multiplatform を適用しているいくつかの方法を紹介します。

### 新規（グリーンフィールド）プロジェクトを開始するスタートアップ

スタートアップは、限られたリソースと厳しい納期の中で運営されることがよくあります。開発効率とコスト効率を最大化するために、共有コードベースを使用して複数のプラットフォームをターゲットにすること、特にタイム・トゥ・マーケット (Time-to-market) が重要な初期段階の製品や MVP において、大きなメリットを享受できます。

ロジックと UI の両方を共有したい企業にとって、Compose Multiplatform を備えた Kotlin Multiplatform は理想的なソリューションです。共有 UI から始めることで、迅速なプロトタイピングが可能になります。また、ネイティブ UI と共有 UI を組み合わせることもできます。これにより、KMP と Compose Multiplatform の組み合わせはグリーンフィールド（新規開発）プロジェクトにとって理想的な選択肢となり、スタートアップがスピード、柔軟性、そして高品質なネイティブ体験のバランスを取るのに役立ちます。

**活用事例:**

* [Instabee](https://www.youtube.com/watch?v=YsQ-2lQYQ8M) は、Android アプリケーションのロジックと UI を Compose Multiplatform を備えた Kotlin Multiplatform に移行しました。Android のコードベースを効果的に活用することで、同社は短期間で iOS アプリケーションをリリースすることができました。
* [Respawn Pro](https://youtu.be/LB5a2FRrT94?si=vgcJI-XoCrWree3u) は、習慣追跡・生産性アプリを開発しています。同社の iOS アプリは Compose Multiplatform で構築されており、コードの 96% を Android と共有しています。

> [Kotlin Multiplatform と Flutter](https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-flutter.html) のどちらを選ぶか迷っている場合は、両方のテクノロジーの概要をまとめたこちらの記事もぜひご覧ください。
> 
{style="tip"}

### 中小企業

中小企業は、成熟した機能豊富な製品を維持しながら、コンパクトなチームで運営されていることがよくあります。Kotlin Multiplatform を使用すると、ユーザーが期待するネイティブなルック＆フィールを維持しながら、コアロジックを共有できます。既存のコードベースを活用することで、これらのチームはユーザー体験を損なうことなく開発を加速できます。

KMP は、クロスプラットフォーム機能を段階的に導入する柔軟なアプローチもサポートしています。これにより、既存アプリの進化や新機能の立ち上げを行うチームにとって特に効果的であり、開発時間の短縮、オーバーヘッドの削減、必要に応じたプラットフォーム固有のカスタマイズの維持に役立ちます。

**活用事例:**

* [Down Dog](https://kotlinlang.org/lp/multiplatform/case-studies/down-dog/?_gl=1*xdrptd*_gcl_au*ODIxNDk5NDA4LjE3MjEwNDg0OTY.*_ga*MTY1Nzk3NDc4MC4xNzA1NDc1NDcw*_ga_9J976DJZ68*MTcyNzg1MTIzNS4yMzcuMS4xNzI3ODUxNDM0LjU2LjAuMA..) は、スタジオのようなヨガ体験をモバイルデバイスに提供するアプリケーションに「最大限の Kotlin 共有」戦略を採用しています。同社は Kotlin Multiplatform を使用して、クライアントとサーバー間、およびクライアントコードの大部分でさまざまなヘルパーを共有しています。チームはネイティブ専用のビューを維持することで、アプリの開発スピードを大幅に向上させることができました。
* [Doist](https://www.youtube.com/watch?v=z-o9MqN86eE) は、受賞歴のある To-Do リストアプリ「Todoist」で Kotlin Multiplatform を活用しました。チームは Android と iOS 間で主要なロジックを共有し、一貫した動作を確保して開発を効率化しました。同社はまず内部ライブラリから始めて、段階的に KMP を導入しました。

### アプリケーションにデバイス間の一貫した動作を必要とする大企業

大規模なアプリケーションは通常、膨大なコードベースを持ち、常に新機能が追加され、すべてのプラットフォームで同じように動作しなければならない複雑なビジネスロジックを含んでいます。Kotlin Multiplatform は段階的な統合を提供し、チームが少しずつ採用することを可能にします。また、開発者は既存の Kotlin スキルを再利用できるため、KMP を使用することで新しい技術スタックを導入する手間も省けます。

**活用事例:** [Forbes](https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/)、[McDonald’s](https://medium.com/mcdonalds-technical-blog/mobile-multiplatform-development-at-mcdonalds-3b72c8d44ebc)、[Google Docs](https://www.youtube.com/watch?v=5lkZj4v4-ks)、[Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8)、[VMware](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0)、[Cash App](https://kotlinlang.org/lp/multiplatform/case-studies/cash-app?_gl=1*1qc1ixl*_gcl_aw*R0NMLjE3NTEzNTcwMDguRUFJYUlRb2JDaE1JblBLRmc0cWJqZ01WZ0VnZENSM3pYQkVWRUFFWUFTQUFFZ0ltOVBEX0J3RQ..*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTE1MjQ2MDUkbzcxJGcxJHQxNzUxNTI3Njc5JGozJGwwJGgw)、[Wonder App by Baidu](https://kotlinlang.org/lp/multiplatform/case-studies/baidu)

[![KMP の成功事例から学ぶ](kmp-success-stories.svg){width="700"}{style="block"}](https://kotlinlang.org/case-studies/?type=multiplatform)

### エージェンシー（受託開発会社）

多様なクライアントと仕事をするエージェンシーやコンサルティング会社は、幅広いプラットフォーム要件やビジネス目標に対応する必要があります。Kotlin Multiplatform でコードを再利用できる能力は、厳しい納期と限られたエンジニアリングチームで複数のプロジェクトを管理するチームにとって特に価値があります。KMP を採用することで、エージェンシーはデリバリーを加速し、プラットフォーム間で一貫したアプリの動作を維持できます。

**活用事例:**

* [Touchlab](https://touchlab.co/) は、Kotlin Multiplatform を使用したクロスプラットフォーム開発とアドバイザリー業務を専門としています。Touchlab は、Kotlin から公開された Swift API を強化する [SKIE](https://github.com/touchlab/SKIE) や、[Xcode 用 Kotlin プラグイン](https://github.com/touchlab/xcode-kotlin)など、iOS 開発体験を向上させるツールも作成しています。
* [IceRock](https://icerockdev.com/) は、クライアント向けのアプリアプリケーションを開発するために Kotlin Multiplatform を使用しているアウトソーシング企業です。同社のアプリアプリケーションポートフォリオはさまざまなビジネス要件を網羅しており、Kotlin Multiplatform の開発プロセスを強化する膨大なオープンソースの Kotlin Multiplatform ライブラリコレクションによって補完されています。
* [Mirego](https://kotlinlang.org/lp/multiplatform/case-studies/mirego/)（エンドツーエンドのデジタル製品チーム）は、Kotlin Multiplatform を使用して、Web、iOS、tvOS、Android、Amazon Fire TV で同じビジネスロジックを実行しています。KMP により、各プラットフォームの利点を最大限に引き出しながら、開発を効率化できています。

### 新市場へ進出する企業

iOS 専用から Android を含めるように、あるいはその逆のように、これまでターゲットにしていなかったプラットフォームでアプリをリリースすることで、新しい市場に参入したい企業もあります。

KMP は、既存の iOS コードや開発手法を活用しながら、Android 上でネイティブのパフォーマンスと UI の柔軟性を維持するのに役立ちます。プラットフォーム固有のユーザー体験を維持しつつ、既存の知識とコードを活用したい場合、KMP は理想的な長期的ソリューションとなり得ます。

**活用事例:** [Instabee](https://www.youtube.com/watch?v=YsQ-2lQYQ8M) は、Compose Multiplatform を備えた Kotlin Multiplatform を使用して、Android アプリのロジックと UI を移行しました。これにより、既存の Android コードベースの多くを再利用することで、iOS 市場に迅速に参入することができました。

### ソフトウェア開発キット (SDK) を開発するチーム

共有された Kotlin コードは、プラットフォーム固有のバイナリ（Android 用の JVM、iOS 用の Native）にコンパイルされ、あらゆるプロジェクトにシームレスに統合されます。制限なくプラットフォーム固有の API を使用できる柔軟性を提供すると同時に、ネイティブ UI かクロスプラットフォーム UI かを選択する余地も与えてくれます。これらの機能により、Kotlin Multiplatform はモバイル SDK の開発において優れた選択肢となります。利用者の視点からは、Kotlin Multiplatform 製の SDK は通常のプラットフォーム固有の依存関係と同じように動作しながら、共有コードの利点を提供します。

**活用事例:** [Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8) は、HealthSuite Digital Platform モバイル SDK で Kotlin Multiplatform を使用しており、新機能のより迅速な開発を可能にし、Android と iOS 開発者間のコラボレーションを強化しています。

## 業界別の Kotlin Multiplatform ユースケース

Kotlin Multiplatform の汎用性は、それが本番環境で使用されている幅広い業界から明らかです。フィンテックから教育まで、Compose Multiplatform を備えた KMP は多くの種類のアプリケーションに採用されています。以下に、業界固有の例をいくつか挙げます。

### 金融テクノロジー（フィンテック）

フィンテックアプリケーションは多くの場合、複雑なビジネスロジック、安全なワークフロー、厳格なコンプライアンス要件を伴い、それらすべてをプラットフォーム間で一貫して実装する必要があります。Kotlin Multiplatform は、このコアロジックを 1 つのコードベースに統合し、プラットフォーム固有の不整合のリスクを軽減するのに役立ちます。ウォレットや決済のようなアプリにとって極めて重要な、iOS と Android 間の迅速な機能の同等性（フィーチャーパリティ）を保証します。

**活用事例:** [Cash App](https://kotlinlang.org/lp/multiplatform/case-studies/cash-app)、[Bitkey by Block](https://engineering.block.xyz/blog/how-bitkey-uses-cross-platform-development)、[Worldline](https://blog.worldline.tech/2022/01/26/kotlin_multiplatform.html)

### メディア・出版

メディアやコンテンツ主導のアプリは、迅速な機能展開、一貫したユーザー体験、および各プラットフォームに合わせて UI をカスタマイズできる柔軟性に依存しています。Kotlin Multiplatform を使用すると、チームはコンテンツフィードや検索セクションのコアロジックを共有しながら、ネイティブ UI を完全に制御できます。これにより、開発が加速され、コストのかかる重複作業が削減され、プラットフォーム間のパリティが確保されます。

**活用事例:** [Forbes](https://www.forbes.com/sites/forbes-engineering/2023/11/13/forbes-mobile-app-shifts-to-kotlin-multiplatform/)、[9GAG](https://raymondctc.medium.com/adopting-kotlin-multiplatform-mobile-kmm-on-9gag-app-dfe526d9ce04)、[Kuaishou](https://medium.com/@xiang.j9501/case-studies-kuaiying-kotlin-multiplatform-mobile-268e325f8610)

### プロジェクト管理・生産性

共有カレンダーからリアルタイムのコラボレーションまで、生産性アプリはすべてのプラットフォームで同一に動作する必要がある機能豊富な機能を要求します。Kotlin Multiplatform は、チームがこの複雑さを 1 つの共有コードベースに集中させるのに役立ち、あらゆるデバイスで一貫した機能と動作を保証します。この柔軟性により、チームはアップデートをより速くリリースし、プラットフォーム間で統一されたユーザー体験を維持できます。

**活用事例:** [Wrike](https://www.youtube.com/watch?v=jhBmom8z3Qg)、[VMware](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0)

### 交通・モビリティ

配車、デリバリー、モビリティプラットフォームは、ドライバー用、乗客用、加盟店用アプリで共通の機能を共有することで、Kotlin Multiplatform の恩恵を受けています。リアルタイム追跡、ルート最適化、アプリ内チャットなどのサービスのコアロジックを一度記述すれば Android と iOS の両方で使用でき、すべてのユーザーに一貫した動作を保証します。

**活用事例:** [Bolt](https://medium.com/vmware-end-user-computing/adopting-a-cross-platform-strategy-for-mobile-apps-59495ffa23b0)、[Feres](https://kotlinlang.org/case-studies/#case-study-feres)

### 教育テクノロジー（エドテック）

教育アプリは、特に大規模で分散したオーディエンスをサポートする場合、モバイルと Web の両方でシームレスで一貫した学習体験を提供する必要があります。学習アルゴリズム、クイズ、その他のビジネスロジックを Kotlin Multiplatform で一元化することで、教育アプリはあらゆるデバイスで均一な学習体験を提供します。このコード共有は、パフォーマンスと一貫性を大幅に向上させることができます。たとえば、Quizlet は共有コードを JavaScript から Kotlin に移行し、Android と iOS の両方のアプリで顕著なスピード向上を実現しました。

**活用事例:** [Duolingo](https://youtu.be/RJtiFt5pbfs?si=mFpiN9SNs8m-jpFL)、[Quizlet](https://quizlet.com/blog/shared-code-kotlin-multiplatform)、[Chalk](https://kotlinlang.org/lp/multiplatform/case-studies/chalk/?_gl=1*1wxmdrv*_gcl_au*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*FPAU*MTE5NzY3MzgyLjE3NDk3MDk0NjI.*_ga*MTM4NjAyOTM0NS4xNzM2ODUwMzA5*_ga_9J976DJZ68*czE3NTEwMjI5ODAkbzYwJGcxJHQxNzUxMDIzMTU2JGo1OCRsMCRoMA..)、[Memrise](https://engineering.memrise.com/kotlin-multiplatform-memrise-3764b5a4a0db)、[Physics Wallah](https://kotlinlang.org/case-studies/#case-study-physics-wallah)

### Eコマース

クロスプラットフォームのショッピング体験を構築するということは、共有されたビジネスロジックと、決済、カメラアクセス、マップなどのネイティブ機能のバランスを取ることを意味します。Compose Multiplatform を備えた Kotlin Multiplatform を使用すると、チームはプラットフォーム間でビジネスロジックと UI の両方を共有しながら、必要に応じてプラットフォーム固有のコンポーネントを引き続き使用できます。このハイブリッドアプローチにより、開発の迅速化、一貫したユーザー体験、および重要なネイティブ機能を統合する柔軟性が確保されます。

**活用事例:** [Balary Market](https://kotlinlang.org/case-studies/#case-study-balary)、[Markaz](https://kotlinlang.org/case-studies/#case-study-markaz)

### ソーシャルネットワーク・コミュニティ

ソーシャルプラットフォームでは、コミュニティを活発に保ち、デバイスを越えてつながりを維持するために、タイムリーな機能提供と一貫したインタラクションが不可欠です。主要なインタラクションロジックには、メッセージング、通知、スケジューリングなどが含まれます。たとえば、ユーザーが地元のグループ、イベント、アクティビティを見つけることができる Meetup は、KMP のおかげで新しい機能を同時にリリースすることができました。

**活用事例:** [Meetup](https://youtu.be/GtJBS7B3eyM?si=lNX3KMhSTCICFPxv)

### ヘルス・ウェルネス

ヨガセッションのガイダンスであれ、デバイス間でのヘルスデータの同期であれ、ウェルネスアプリはレスポンスの良さと信頼性の高いクロスプラットフォーム動作の両方に依存しています。これらのアプリは、ワークアウトのロジックやデータ処理などのコア機能を共有しつつ、完全にネイティブな UI や、センサー、通知、ヘルス API などのプラットフォーム固有の統合を維持する必要があります。

**活用事例:** [Respawn Pro](https://youtu.be/LB5a2FRrT94?si=vgcJI-XoCrWree3u)、[Fast&amp;Fit](https://kotlinlang.org/case-studies/#case-study-fast-and-fit)、[Philips](https://www.youtube.com/watch?v=hZPL8QqiLi8)、[Down Dog](https://kotlinlang.org/lp/multiplatform/case-studies/down-dog)

### 郵便サービス

一般的なユースケースではありませんが、Kotlin Multiplatform は 377 年の歴史を持つ国の郵便サービスにも採用されています。ノルウェーの Posten Bring は、数十のフロントエンドおよびバックエンドシステムにわたって複雑なビジネスロジックを統合するために KMP を使用しており、ワークフローを合理化し、新しいサービスの展開に必要な時間を数ヶ月から数日に劇的に短縮するのに役立っています。

**活用事例:** [Posten Bring](https://2024.javazone.no/program/a1d9aeac-ffc3-4b1d-ba08-a0568f415a02)

これらの例は、Kotlin Multiplatform が事実上あらゆる業界やタイプのアプリで使用できることを浮き彫りにしています。フィンテックアプリ、モビリティソリューション、教育プラットフォーム、あるいはその他の何かを構築している場合でも、Kotlin Multiplatform は、ネイティブな体験を犠牲にすることなく、プロジェクトにとって意味のある範囲でコードを共有できる柔軟性を提供します。また、このテクノロジーを本番環境で使用している他の多くの企業を紹介する、[KMP 活用事例](https://kotlinlang.org/case-studies/?type=multiplatform)の広範なリストもチェックできます。