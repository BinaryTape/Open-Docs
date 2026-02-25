[//]: # (title: 学習リソース)

<web-summary>KMPの経験レベルに最も適した学習教材を選択してください。</web-summary>

30以上の不可欠なKotlin Multiplatform (KMP) およびCompose Multiplatformの学習教材をまとめました。スキルレベル別に、あなたの経験に合ったチュートリアル、コース、記事を探してみてください。

🌱 **初級者**。JetBrainsやGoogleの公式チュートリアルを通じて、KMPとComposeの基礎を学びます。Room、Ktor、SQLDelightなどのコアライブラリを使用して、シンプルなアプリを構築します。

🌿 **中級者**。共有ViewModel、Koinベースの依存関係注入（DI）、クリーンアーキテクチャを使用して、実践的なアプリを開発します。JetBrainsやコミュニティの教育者によるコースを通じて学びます。

🌳 **上級者**。バックエンドやゲーム開発のための本格的なKMPエンジニアリングへと進みます。大規模なマルチチームプロジェクト向けのアーキテクチャのスケーリングや導入に関するガイダンスが含まれます。

🧩 **ライブラリ作者**。再利用可能なKMPライブラリを作成し、公開します。公式のJetBrainsツールとテンプレートを使用して、API設計、Dokkaドキュメント、Mavenパブリッシングについて学びます。

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

**リソース /**

**種類**

</th>
<th>

**作成者 /**
**プラットフォーム**

</th>

<th>

**学習内容**

</th>
<th>

**価格**

</th>
<th>

**所要時間（目安）**

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
KMPの核心的な価値、実際のユースケース、および適切な学習パスを選択するためのガイダンス。
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

[はじめてのKMPアプリの作成](multiplatform-create-first-app.md)

チュートリアル

</td>
<td>
JetBrains
</td>

<td>
KMPプロジェクトをセットアップし、UIを完全にネイティブに保ちながら、AndroidとiOSの間でシンプルなビジネスロジックを共有する方法。
</td>
<td>
無料
</td>
<td>
1–2時間
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Kotlin Multiplatformを始める (Google Codelab)](https://developer.android.com/codelabs/kmp-get-started)

チュートリアル

</td>
<td>
Google

Android
</td>

<td>
既存のAndroidプロジェクトに共有KMPモジュールを追加し、SKIEプラグインを使用してKotlinコードから慣習的なSwift APIを生成してiOSと統合する方法。
</td>
<td>
無料
</td>
<td>
1–2時間
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[はじめてのCompose Multiplatformアプリの作成](compose-multiplatform-create-first-app.md)

チュートリアル

</td>
<td>
JetBrains
</td>

<td>
シンプルなテンプレートから、Android、iOS、デスクトップ、Webで動作する機能的なタイムゾーンアプリへと進めながら、基本的なUIコンポーネント、状態管理、リソース処理を網羅し、完全なCompose Multiplatformアプリをゼロから構築する方法。
</td>
<td>
無料
</td>
<td>
2–3時間
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[KtorとSQLDelightを使用したマルチプラットフォームアプリの作成](multiplatform-ktor-sqldelight.md)

チュートリアル

</td>
<td>
JetBrains
</td>

<td>
ネットワーク用のKtorとローカルデータベース用のSQLDelightを使用して共有データレイヤーを構築し、それをAndroidのJetpack ComposeとiOSのSwiftUIで構築されたネイティブUIに接続する方法。
</td>
<td>
無料
</td>
<td>
4–6時間
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[期待宣言と実体宣言 (Expected and Actual Declarations)](multiplatform-expect-actual.md)

記事

</td>
<td>
JetBrains
</td>

<td>
共通コードからプラットフォーム固有のAPIにアクセスするための核心的なexpect/actualメカニズム。関数、プロパティ、クラスの使用など、さまざまな戦略をカバーします。
</td>
<td>
無料
</td>
<td>
1–2時間
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[KMPアプリでのプラットフォーム固有APIの使用](https://www.youtube.com/watch?v=bSNumV04y_w)

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

[AndroidデベロッパーのためのKMP](https://nsmirosh.gumroad.com/l/tmmqwa)

ビデオコース

</td>
<td>
Mykola Miroshnychenko

Gumroad
</td>

<td>
expect/actualやソースセットなどのKMPの基礎をマスターし、ネットワーク用のKtorや永続化用のRoomなどの最新ライブラリを使用して完全なアプリスタックを構築することで、既存のAndroid開発スキルをiOSに拡張する方法。
</td>
<td>
約60ドル
</td>
<td>
8–12時間
</td>
</tr>

<tr filter="beginner">
<td>
🌱
</td>
<td>

[Kotlin Multiplatformマスタークラス](https://www.udemy.com/course/kotlin-multiplatform-masterclass/)

ビデオコース

</td>
<td>
Petros Efthymiou

Udemy
</td>

<td>
クリーンアーキテクチャとMVIをゼロから適用して完全なKMPアプリケーションを構築し、Ktor、SQLDelight、Koinといった必須ライブラリのフルスタックをネイティブのJetpack ComposeおよびSwiftUI UIと統合する方法。
</td>
<td>
10–20ユーロ
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

[Compose Multiplatformフルコース 2025 | ゼロからヒーローへ](https://www.youtube.com/watch?v=Z92zJzL-6z0&list=PL0pXjGnY7PORAoIX2q7YG2sotapCp4hyl)

ビデオコース

</td>
<td>
Code with FK

YouTube
</td>

<td>
Compose Multiplatformのみを使用して完全で機能豊富なアプリケーションを構築する方法。基礎から、Firebase Authentication、SQLDelightによるオフラインサポート、リアルタイムアップデートなどの高度な実践的機能まで進みます。
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
Compose MultiplatformとネイティブUIのどちらを選択するかというアーキテクチャ上の決定、Swift相互運用の基礎、およびネットワーキング、永続化、依存関係注入のための主要なKMPエコシステムの包括的な概要。
</td>
<td>
約30–40ドル/月
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
ネイティブUIを、ネットワーキング、シリアライズ、永続化のためのKMP共有モジュールに接続することによるコード共有の基礎。また、保守可能でスケーラブルな実用的アプリを構築するために、依存関係注入、テスト、最新アーキテクチャを適用する方法も学びます。
</td>
<td>
約60ドル
</td>
<td>
40–60時間
</td>
</tr>

<!-- END OF BEGINNER BLOCK -->

<!-- INTERMEDIATE BLOCK -->

<tr filter="intermediate">
<td>
🌿
</td>
<td>

[AndroidアプリケーションをiOSで動作させる](multiplatform-integrate-in-existing-app.md)

チュートリアル

</td>
<td>
JetBrains
</td>

<td>
既存のAndroidアプリのビジネスロジックを、元のAndroidアプリと新しいネイティブiOSプロジェクトの両方で使用できる共有モジュールに抽出することで、既存のアプリをKMPに移行する実践的な手順。
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

[既存のアプリをRoom KMPに移行する (Google Codelab)](https://developer.android.com/codelabs/kmp-migrate-room)

チュートリアル

</td>
<td>
Google

Android
</td>

<td>
既存のAndroid Roomデータベースを共有KMPモジュールに移行し、使い慣れたDAOとエンティティをAndroidとiOSの両方で再利用する方法。
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

[Compose MultiplatformでViewModelを共有する方法（依存関係注入を使用！）](https://www.youtube.com/watch?v=O85qOS7U3XQ)

ビデオチュートリアル

</td>
<td>
Philipp Lackner

YouTube
</td>

<td>
依存関係注入にKoinを使用し、Compose Multiplatformプロジェクトで共有ViewModelを実装する方法。これにより、状態管理ロジックを一度書くだけで済むようになります。
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

[Compose Multiplatform短期集中コース 2025](https://www.youtube.com/watch?v=WT9-4DXUqsM)

ビデオコース

</td>
<td>
Philipp Lackner

YouTube
</td>

<td>
クリーンアーキテクチャを使用して完全で製品レベルの読書アプリをゼロから構築する方法。ネットワーク用のKtor、ローカルデータベース用のRoom、依存関係注入用のKoin、マルチプラットフォームナビゲーションを含む最新のKMPスタックをカバーします。
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

[KMPを使用した業界レベルのマルチプラットフォームアプリの構築](https://pl-coding.com/kmp/)

ビデオコース

</td>
<td>
Philipp Lackner

[pl.coding.com](https://pl-coding.com/)

</td>

<td>
ネイティブUI（Jetpack ComposeとSwiftUI）間でViewModelとビジネスロジックを共有することで、実践的な翻訳アプリを構築する方法。クリーンアーキテクチャから、両プラットフォームのユニットテスト、UIテスト、エンドツーエンドテストまでの開発ライフサイクル全体をカバーします。
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

[業界レベルのCompose Multiplatform Android/iOSアプリの構築](https://pl-coding.com/cmp-mobile)

ビデオコース

</td>
<td>
Philipp Lackner

[pl.coding.com](https://pl-coding.com/)

</td>

<td>
完全なCompose Multiplatformスタックを使用して、大規模なオフラインファーストのチャットアプリケーションをゼロから構築する方法。リアルタイムWebSocket用のKtor、ローカル永続化用のRoom、マルチモジュール依存関係注入用のKoinを含みます。
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

[究極のCompose Multiplatform: Android/iOSとテスト](https://www.udemy.com/course/ultimate-compose-multiplatform-androidios-testing-kotlin/)

ビデオコース

</td>
<td>
Hamidreza Sahraei

Udemy

</td>

<td>
Compose Multiplatformのみを使用して、機能豊富な仮想暗号通貨ウォレットアプリを構築する方法。コアスタック（Ktor、Room、Koin）だけでなく、堅牢なユニット/UIテストや生体認証などの高度なプラットフォーム統合もカバーします。
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
iOSとの相互運用性（Obj-C/Swift）、SKIE、KMP-NativeCoroutines、言語機能のギャップに対するワークアラウンド、Swiftエクスポート、および双方向の相互運用。
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

[AndroidおよびiOS向けマルチモジュールEコマースアプリ (KMP)](https://www.udemy.com/course/multi-modular-ecommerce-app-for-android-ios-kmp/)

ビデオコース

</td>
<td>
Stefan Jovanovic

Udemy
</td>

<td>
FigmaでのEコマースアプリのUI設計から、Compose Multiplatformを使用した共有UIを持つ完全なマルチモジュールアプリケーションとしての構築、さらには認証、データベース、自動化されたクラウド機能のためのFirebaseサービスを使用したフルバックエンドの作成と統合まで、製品ライフサイクル全体を学びます。
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

[KtorとKotlin MultiplatformおよびComposeの探求](https://www.linkedin.com/learning/exploring-ktor-with-kotlin-multiplatform-and-compose)

ビデオコース

</td>
<td>
Troy Miles

LinkedIn Learning
</td>

<td>
まず安全なKtorバックエンドを作成してAWSにデプロイし、次にKotlin Multiplatformを使用してAPIを消費する共有コードを持つネイティブクライアントを構築することで、フルスタックのKotlinアプリケーションを構築する方法。
</td>
<td>
約30–40ドル/月
</td>
<td>
2-3時間
</td>
</tr>

<tr filter="advanced">
<td>
🌳
</td>
<td>

[フルスタックゲーム開発 - KotlinとCompose Multiplatform](https://www.udemy.com/course/full-stack-game-development-kotlin-compose-multiplatform/)

ビデオコース

</td>
<td>
Stefan Jovanovic

Udemy
</td>

<td>
物理演算、衝突判定、スプライトシートアニメーションをカバーするCompose Multiplatformを使用した完全な2Dゲームの構築方法、およびそれをAndroid、iOS、デスクトップ、Web（Kotlin/Wasm経由）にデプロイする方法。
</td>
<td>
約99ユーロ
</td>
<td>
8–10時間
</td>
</tr>

<tr filter="advanced">
<td>
🌳
</td>
<td>

[Philipp Lackner フルスタックバンドル: KMPとSpring Boot](https://pl-coding.com/full-stack-bundle)

ビデオコース

</td>
<td>
Philipp Lackner

[pl.coding.com](https://pl-coding.com/)

</td>

<td>
WebSocketを備えたマルチモジュールのSpring Bootバックエンドから、オフラインファーストのCompose Multiplatformクライアント（Android、iOS、デスクトップ、Web）、および完全なCI/CDパイプラインまで、完全なフルスタックチャットアプリケーションを設計、構築、デプロイする方法。
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

[ネイティブモバイルチームのためのKMP](https://touchlab.co/kmp-teams-intro)

記事シリーズ

</td>
<td>
Touchlab
</td>

<td>
最初の賛同の獲得や技術的なパイロット運用から、持続可能な実践的ワークフローによる共有コードベースのスケーリングまで、確立されたネイティブモバイルチーム内でのKMP導入プロセス全体を進める方法。
</td>
<td>
無料
</td>
<td>
6–8時間
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
コードの再利用を最大化し、幅広いプラットフォーム互換性を確保するための重要なベストプラクティスに従って、マルチプラットフォームライブラリのパブリックAPIを設計する方法。
</td>
<td>
無料
</td>
<td>
1–2時間
</td>
</tr>

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[Kotlin Multiplatformライブラリの作成](create-kotlin-multiplatform-library.md)

チュートリアル

</td>
<td>
JetBrains
</td>

<td>
公式のスターターテンプレートの使用、ローカルMavenパブリッシングのセットアップ、ライブラリの構造化、およびパブリッシングの設定方法。
</td>
<td>
無料
</td>
<td>
2–3時間
</td>
</tr>

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[Dokkaを使用したドキュメント作成](https://kotlinlang.org/docs/dokka-introduction.html)

ドキュメント

</td>
<td>
JetBrains
</td>

<td>
Dokkaを使用して、KMPライブラリのプロフェッショナルなAPIドキュメントを複数の形式で自動生成する方法。Kotlin/Java混合プロジェクトもサポートしています。
</td>
<td>
無料
</td>
<td>
2–3時間
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
ビルドセットアップとパブリッシングのベストプラクティスがあらかじめ設定された公式テンプレートを使用して、新しいKMPライブラリプロジェクトを迅速に立ち上げる方法。
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

[Maven Centralへの公開](multiplatform-publish-libraries.md)

チュートリアル

</td>
<td>
JetBrains
</td>

<td>
資格情報のセットアップ、パブリッシングプラグインの設定、CIによるプロセスの自動化など、KMPライブラリをMaven Centralに公開するための完全なステップバイステップのプロセス。
</td>
<td>
無料
</td>
<td>
3–4時間
</td>
</tr>

<tr filter="lib-authors">
<td>
🧩
</td>
<td>

[Kotlin Multiplatformライブラリ](https://www.linkedin.com/learning/kotlin-multiplatform-libraries)

ビデオコース

</td>
<td>
LinkedIn Learning
</td>

<td>
効果的なAPI設計とコード共有戦略から、最終的な配布とベストプラクティスまで、KMPライブラリ作成の完全なライフサイクル。
</td>
<td>
約30–40ドル/月
</td>
<td>
2-3時間
</td>
</tr>

<!-- END OF LIB-AUTHORS BLOCK -->

</table>
</snippet>

<!-- END OF REVOKED BLOCK -->

</TabItem>

<TabItem id="beginner" title="🌱 初級者">

<include element-id="source" use-filter="empty,beginner" from="kmp-learning-resources.md"/>

</TabItem>

<TabItem id="intermediate" title="🌿 中級者">

<include element-id="source" use-filter="empty,intermediate" from="kmp-learning-resources.md"/>

</TabItem>

<TabItem id="advanced" title="🌳 上級者">

<include element-id="source" use-filter="empty,advanced" from="kmp-learning-resources.md"/>

</TabItem>

<TabItem id="lib-authors" title="🧩 ライブラリ作者">

<include element-id="source" use-filter="empty,lib-authors" from="kmp-learning-resources.md"/>

</TabItem>

</Tabs>