[//]: # (title: 学習リソース)

<web-summary>あなたのKMP経験レベルに最適な学習教材を選択してください。</web-summary>

Kotlin Multiplatform (KMP)とCompose Multiplatformの主要な学習教材を30以上集めました。スキルレベル別にチュートリアル、コース、記事を閲覧し、あなたの経験に合ったものを見つけてください。

🌱 **初心者**. JetBrainsとGoogleの公式チュートリアルを通じてKMPとComposeの基礎を学びましょう。Room、Ktor、SQLDelightなどの主要ライブラリを使用してシンプルなアプリを構築します。

🌿 **中級者**. 共有ViewModel、Koinベースの依存性注入、クリーンアーキテクチャを使用して実用的なアプリを開発します。JetBrainsやコミュニティの教育者によるコースを通じて学びましょう。

🌳 **上級者**. バックエンドおよびゲーム開発のユースケース、大規模な多チームプロジェクトにおけるアーキテクチャのスケーリングと導入に関するガイドを通じて、本格的なKMPエンジニアリングへと進みましょう。

🧩 **ライブラリ作成者**. 再利用可能なKMPライブラリを作成・公開します。公式のJetBrainsツールとテンプレートを使用して、API設計、Dokkaドキュメント、Maven公開について学びます。

<Tabs>
<TabItem id="all-resources" title="すべて">

<snippet id="source">
<table>

<!-- BEGINNER BLOCK -->
<thead>

<tr>
<th>

**🎚**

</th>
<th>

**リソース/**

**タイプ**

</th>
<th>

**作成者/**
**プラットフォーム**

</th>

<th>

**学習内容**

</th>
<th>

**価格**

</th>
<th>

**推定時間**

</th>
</tr>

</thead>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Kotlin Multiplatformの概要](kmp-overview.md)

記事

</td>
<td>
JetBrains
</td>

<td>
KMPの核となる価値、実際のユースケース、適切な学習パスを選択するためのガイダンス。
</td>
<td>
無料
</td>
<td>
30分
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[初めてのKMPアプリを作成する](multiplatform-create-first-app.md)

チュートリアル

</td>
<td>
JetBrains
</td>

<td>
KMPプロジェクトをセットアップし、UIを完全にネイティブに保ちながらAndroidとiOS間でシンプルなビジネスロジックを共有する方法。
</td>
<td>
無料
</td>
<td>
1～2時間
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Kotlin Multiplatformを始める（Google Codelab）](https://developer.android.com/codelabs/kmp-get-started)

チュートリアル

</td>
<td>
Google

Android
</td>

<td>
既存のAndroidプロジェクトに共有KMPモジュールを追加し、SKIEプラグインを使用してKotlinコードからイディオマティックなSwift APIを生成してiOSと統合する方法。
</td>
<td>
無料
</td>
<td>
1～2時間
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[初めてのCompose Multiplatformアプリを作成する](compose-multiplatform-create-first-app.md)

チュートリアル

</td>
<td>
JetBrains
</td>

<td>
シンプルなテンプレートからAndroid、iOS、デスクトップ、ウェブで動作する機能的なタイムゾーンアプリへと進むにつれて、主要なUIコンポーネント、状態管理、リソース処理を網羅し、ゼロから完全なCompose Multiplatformアプリを構築する方法。
</td>
<td>
無料
</td>
<td>
2～3時間
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[KtorとSQLDelightを使ったマルチプラットフォームアプリの作成](multiplatform-ktor-sqldelight.md)

チュートリアル

</td>
<td>
JetBrains
</td>

<td>
Ktorをネットワーキングに、SQLDelightをローカルデータベースに使用して共有データレイヤーを構築し、AndroidのJetpack ComposeとiOSのSwiftUIで構築されたネイティブUIに接続する方法。
</td>
<td>
無料
</td>
<td>
4～6時間
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Expect/Actual宣言](multiplatform-expect-actual.md)

記事

</td>
<td>
JetBrains
</td>

<td>
共通コードからプラットフォーム固有のAPIにアクセスするための核となるexpect/actualメカニズムの使用方法。関数、プロパティ、クラスの使用など、さまざまな戦略を網羅します。
</td>
<td>
無料
</td>
<td>
1～2時間
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[KMPアプリでプラットフォーム固有のAPIを使用する](https://www.youtube.com/watch?v=bSNumV04y_w)

ビデオチュートリアル

</td>
<td>
JetBrains

YouTube
</td>

<td>
KMPアプリでプラットフォーム固有のコードを使用するためのベストプラクティス。
</td>
<td>
無料
</td>
<td>
15分
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Android開発者向けKMP](https://nsmirosh.gumroad.com/l/tmmqwa)

ビデオコース

</td>
<td>
Mykola Miroshnychenko

Gumroad
</td>

<td>
expect/actualやソースセットといったKMPの基礎を習得し、Ktorをネットワーキングに、Roomを永続化に使用するなどの最新ライブラリを用いた完全なアプリスタックを構築することで、既存のAndroid開発スキルをiOSに拡張する方法。
</td>
<td>
約60ドル
</td>
<td>
8～12時間
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Kotlin Multiplatform Masterclass](https://www.udemy.com/course/kotlin-multiplatform-masterclass/)

ビデオコース

</td>
<td>
Petros Efthymiou

Udemy
</td>

<td>
クリーンアーキテクチャとMVIをゼロから適用して完全なKMPアプリケーションを構築し、Ktor、SQLDelight、Koinといった主要ライブラリのフルスタックをネイティブのJetpack ComposeとSwiftUI UIに統合する方法。
</td>
<td>
10～20ユーロ
</td>
<td>
6時間
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Compose Multiplatform完全コース 2025 - ゼロからヒーローへ](https://www.youtube.com/watch?v=Z92zJzL-6z0&list=PL0pXjGnY7PORAoIX2q7YG2sotapCp4hyl)

ビデオコース

</td>
<td>
Code with FK

YouTube
</td>

<td>
Compose Multiplatformのみで完全な機能豊富なアプリケーションを構築する方法。基礎から、Firebase Authentication、SQLDelightによるオフラインサポート、リアルタイム更新などの高度な実用機能へと段階的に学びます。
</td>
<td>
無料
</td>
<td>
20時間
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Kotlin Multiplatform開発](https://www.linkedin.com/learning/kotlin-multiplatform-development)

ビデオコース

</td>
<td>
Colin Lee

LinkedIn Learning
</td>

<td>
Compose MultiplatformとネイティブUI間のアーキテクチャ選択、Swift相互運用の基礎、およびネットワーキング、永続化、依存性注入のためのKMPエコシステムの包括的な概要。
</td>
<td>
約30～40ドル/月
</td>
<td>
3時間
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Kotlin Multiplatform by Tutorials (第3版)](https://www.kodeco.com/books/kotlin-multiplatform-by-tutorials/v3.0)

書籍

</td>
<td>
Kodeco Team (Kevin D. Moore, Carlos Mota, Saeed Taheri)
</td>

<td>
ネットワーキング、シリアル化、永続化のためにネイティブUIをKMP共有モジュールに接続してコードを共有する基礎。依存性注入、テスト、最新のアーキテクチャを適用して、保守可能でスケーラブルな実用的なアプリを構築する方法も学びます。
</td>
<td>
約60ドル
</td>
<td>
40～60時間
</td>
</tr>

<!-- END OF BEGINNER BLOCK -->

<!-- INTERMEDIATE BLOCK -->

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[既存のAndroidアプリケーションをiOSで動作させる](multiplatform-integrate-in-existing-app.md)

チュートリアル

</td>
<td>
JetBrains
</td>

<td>
既存のAndroidアプリのビジネスロジックを共有モジュールとして抽出し、元のAndroidアプリと新しいネイティブiOSプロジェクトの両方で利用できるようにすることで、既存のAndroidアプリをKMPに移行する実践的な手順。
</td>
<td>
無料
</td>
<td>
2時間
</td>
</tr>

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[既存アプリをRoom KMPに移行する（Google Codelab）](https://developer.android.com/codelabs/kmp-migrate-room)

チュートリアル

</td>
<td>
Google

Android
</td>

<td>
既存のAndroid Roomデータベースを共有KMPモジュールに移行し、AndroidとiOSの両方で使い慣れたDAOとエンティティを再利用できるようにする方法。
</td>
<td>
無料
</td>
<td>
2時間
</td>
</tr>

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[Compose MultiplatformでViewModelを共有する方法（依存性注入あり！）](https://www.youtube.com/watch?v=O85qOS7U3XQ)

ビデオチュートリアル

</td>
<td>
Philipp Lackner

YouTube
</td>

<td>
Koinを依存性注入に使用してCompose Multiplatformプロジェクトで共有ViewModelを実装し、状態管理ロジックを一度書くだけで済むようにする方法。
</td>
<td>
無料
</td>
<td>
30分
</td>
</tr>

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[Compose Multiplatformクラッシュコース 2025](https://www.youtube.com/watch?v=WT9-4DXUqsM)

ビデオコース

</td>
<td>
Philipp Lackner

YouTube
</td>

<td>
クリーンアーキテクチャを使用して、Ktorをネットワーキングに、ローカルデータベースにRoom、依存性注入にKoin、そしてマルチプラットフォームナビゲーションを含む最新のKMPスタックを網羅し、ゼロから完全な本番環境対応のブックアプリを構築する方法。
</td>
<td>
無料
</td>
<td>
5時間
</td>
</tr>

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[KMPで業界レベルのマルチプラットフォームアプリを構築する](https://pl-coding.com/kmp/)

ビデオコース

</td>
<td>
Philipp Lackner

[pl.coding.com](https://pl-coding.com/)

</td>

<td>
ネイティブUI（Jetpack ComposeとSwiftUI）間でViewModelとビジネスロジックを共有することで、実用的な翻訳アプリを構築する方法。クリーンアーキテクチャから両プラットフォームの単体テスト、UIテスト、エンドツーエンドテストまでの開発ライフサイクル全体を網羅します。
</td>
<td>
約99ユーロ
</td>
<td>
20時間
</td>
</tr>

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[業界レベルのCompose Multiplatform Android & iOSアプリを構築する](https://pl-coding.com/cmp-mobile)

ビデオコース

</td>
<td>
Philipp Lackner

[pl.coding.com](https://pl-coding.com/)

</td>

<td>
リアルタイムWebSocketのためのKtor、ローカル永続化のためのRoom、マルチモジュール依存性注入のためのKoinを含む完全なCompose Multiplatformスタックを使用して、大規模なオフラインファーストのチャットアプリケーションをゼロから構築する方法。
</td>
<td>
約199ユーロ
</td>
<td>
34時間
</td>
</tr>

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[究極のCompose Multiplatform: Android/iOS + テスト](https://www.udemy.com/course/ultimate-compose-multiplatform-androidios-testing-kotlin/)

ビデオコース

</td>
<td>
Hamidreza Sahraei

Udemy

</td>

<td>
Compose Multiplatformのみで機能豊富な仮想暗号ウォレットアプリを構築する方法。コアスタック（Ktor、Room、Koin）だけでなく、堅牢な単体/UIテスト、生体認証のような高度なプラットフォーム統合も網羅します。
</td>
<td>
約20ユーロ
</td>
<td>
8時間
</td>
</tr>
<!-- END OF INTERMEDIATE BLOCK -->

<!-- ADVANCED BLOCK -->

<tr filter="advanced">
<td>
🌳
</td>
<td>

[Kotlin/Swift Interopedia](https://github.com/kotlin-hands-on/kotlin-swift-interopedia)

記事

</td>
<td>
JetBrains

GitHub
</td>

<td>
iOS (Obj-C/Swift)との相互運用、SKIE、KMP-NativeCoroutines、言語機能のギャップに対する回避策、Swiftエクスポート、双方向相互運用について。
</td>
<td>
無料
</td>
<td>
2時間
</td>
</tr>

<tr filter="advanced">
<td>
🌳
</td>
<td>

[Android & iOS向けマルチモジュラーEコマースアプリ (KMP)](https://www.udemy.com/course/multi-modular-ecommerce-app-for-android-ios-kmp/)

ビデオコース

</td>
<td>
Stefan Jovanovic

Udemy
</td>

<td>
EコマースアプリのFigma UI設計から、Compose Multiplatformを使用した共有UIを持つ完全なマルチモジュラーアプリケーションとしての構築まで、製品のライフサイクル全体を学びます。また、Firebaseサービス（認証、データベース、自動Cloud Functions）で完全なバックエンドを作成・統合する方法も含まれます。
</td>
<td>
約50ユーロ
</td>
<td>
30時間
</td>
</tr>

<tr filter="advanced">
<td>
🌳
</td>
<td>

[Kotlin MultiplatformとComposeでKtorを探求する](https://www.linkedin.com/learning/exploring-ktor-with-kotlin-multiplatform-and-compose)

ビデオコース

</td>
<td>
Troy Miles

LinkedIn Learning
</td>

<td>
まず安全なKtorバックエンドを作成しAWSにデプロイし、次にKotlin Multiplatformを使用してAPIを消費する共有コードを持つネイティブクライアントを構築することで、フルスタックのKotlinアプリケーションを構築する方法。
</td>
<td>
約30～40ドル/月
</td>
<td>
2～3時間
</td>
</tr>

<tr filter="advanced">
<td>
🌳
</td>
<td>

[フルスタックゲーム開発 - Kotlin & Compose Multiplatform](https://www.udemy.com/course/full-stack-game-development-kotlin-compose-multiplatform/)

ビデオコース

</td>
<td>
Stefan Jovanovic

Udemy
</td>

<td>
Compose Multiplatformで完全な2Dゲームを構築する方法。物理演算、衝突検出、スプライトシートアニメーションを網羅し、Android、iOS、デスクトップ、ウェブ（Kotlin/Wasm経由）にデプロイする方法。
</td>
<td>
約99ユーロ
</td>
<td>
8～10時間
</td>
</tr>

<tr filter="advanced">
<td>
🌳
</td>
<td>

[Philipp Lackner フルスタックバンドル: KMP + Spring Boot](https://pl-coding.com/full-stack-bundle)

ビデオコース

</td>
<td>
Philipp Lackner

[pl.coding.com](https://pl-coding.com/)

</td>

<td>
マルチモジュールのWebSockets付きSpring Bootバックエンドから、オフラインファーストのCompose Multiplatformクライアント（Android、iOS、デスクトップ、ウェブ）、そして完全なCI/CDパイプラインまで、すべてを網羅した完全なフルスタックチャットアプリケーションを設計、構築、デプロイする方法。
</td>
<td>
約429ユーロ
</td>
<td>
55時間
</td>
</tr>

<tr filter="advanced">
<td>
🌳
</td>
<td>

[ネイティブモバイルチーム向けKMP](https://touchlab.co/kmp-teams-intro)

記事シリーズ

</td>
<td>
Touchlab
</td>

<td>
既存のネイティブモバイルチーム内でKMPの導入プロセス全体を進める方法。初期の合意形成と技術パイロットの実施から、持続可能で実用的なワークフローで共有コードベースをスケールさせる方法までをカバーします。
</td>
<td>
無料
</td>
<td>
6～8時間
</td>
</tr>

<!-- END OF ADVANCED BLOCK -->

<!-- LIB-AUTHORS BLOCK -->

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[マルチプラットフォームライブラリ構築のためのAPIガイドライン](https://kotlinlang.org/docs/api-guidelines-build-for-multiplatform.html)

ドキュメント

</td>
<td>
JetBrains
</td>

<td>
コードの再利用を最大化し、幅広いプラットフォーム互換性を確保するための重要なベストプラクティスに従って、マルチプラットフォームライブラリの公開APIを設計する方法。
</td>
<td>
無料
</td>
<td>
1～2時間
</td>
</tr>

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[Kotlin Multiplatformライブラリを作成する](create-kotlin-multiplatform-library.md)

チュートリアル

</td>
<td>
JetBrains
</td>

<td>
公式スターターテンプレートの使用方法、ローカルMaven公開のセットアップ方法、ライブラリの構造化方法、公開設定の方法。
</td>
<td>
無料
</td>
<td>
2～3時間
</td>
</tr>

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[Dokkaによるドキュメント作成](https://kotlinlang.org/docs/dokka-introduction.html)

ドキュメント

</td>
<td>
JetBrains
</td>

<td>
Dokkaを使用して、KMPライブラリのプロフェッショナルなAPIドキュメントを複数の形式で自動生成する方法。Kotlin/Java混合プロジェクトもサポートします。
</td>
<td>
無料
</td>
<td>
2～3時間
</td>
</tr>

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[KMPライブラリテンプレート](https://github.com/Kotlin/multiplatform-library-template)

GitHubテンプレート

</td>
<td>
JetBrains

GitHub
</td>

<td>
ビルド設定と公開のためのベストプラクティスが事前に構成された公式テンプレートを使用して、新しいKMPライブラリプロジェクトを迅速にブートストラップする方法。
</td>
<td>
無料
</td>
<td>
1時間
</td>
</tr>

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[Maven Centralに公開する](multiplatform-publish-libraries.md)

チュートリアル

</td>
<td>
JetBrains
</td>

<td>
KMPライブラリをMaven Centralに公開するための完全なステップバイステッププロセス。認証情報のセットアップ、公開プラグインの設定、CIによるプロセス自動化を含みます。
</td>
<td>
無料
</td>
<td>
3～4時間
</td>
</tr>

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[Kotlin Multiplatform Libraries](https://www.linkedin.com/learning/kotlin-multiplatform-libraries)

ビデオコース

</td>
<td>
LinkedIn Learning
</td>

<td>
KMPライブラリ作成の完全なライフサイクル。効果的なAPI設計とコード共有戦略から、最終的な配布とベストプラクティスまでを網羅します。
</td>
<td>
約30～40ドル/月
</td>
<td>
2～3時間
</td>
</tr>

<!-- END OF LIB-AUTHORS BLOCK -->

</table>
</snippet>

<!-- END OF REVOKED BLOCK -->

</TabItem>

<TabItem id="beginner" title="🌱 初心者">

<include element-id="source" use-filter="empty,beginner" from="kmp-learning-resources.md"/>

</TabItem>

<TabItem id="intermediate" title="🌿 中級者">

<include element-id="source" use-filter="empty,intermediate" from="kmp-learning-resources.md"/>

</TabItem>

<TabItem id="advanced" title="🌳 上級者">

<include element-id="source" use-filter="empty,advanced" from="kmp-learning-resources.md"/>

</TabItem>

<TabItem id="lib-authors" title="🧩 ライブラリ作成者">

<include element-id="source" use-filter="empty,lib-authors" from="kmp-learning-resources.md"/>

</TabItem>

</Tabs>