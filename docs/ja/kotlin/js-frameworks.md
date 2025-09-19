[//]: # (title: Kotlin/JSフレームワーク)

ウェブ開発を簡素化する利用可能なKotlin/JavaScriptフレームワークを活用しましょう。これらのフレームワークは、すぐに使えるコンポーネント、ルーティング、状態管理、その他のツールを提供し、最新のウェブアプリケーションを構築するのに役立ちます。

コミュニティで提供されているKotlin/JSウェブフレームワークをいくつか紹介します。

## Kobweb

[Kobweb](https://kobweb.varabyte.com/)は、[Compose HTML](https://github.com/JetBrains/compose-multiplatform?tab=readme-ov-file#compose-html)を使用してウェブサイトやウェブアプリケーションを作成するためのKotlinフレームワークです。高速な開発のためにライブリロードをサポートしています。[Next.js](https://nextjs.org/)にインスパイアされており、ウィジェット、レイアウト、ページを追加するための標準的な構造を促進します。

Kobwebは、標準でページルーティング、ライト/ダークモード、CSSスタイリング、Markdownサポート、バックエンドAPIなどを提供します。また、最新のUI向けに多機能なウィジェットセットを備えたUIライブラリである[Silk](https://silk-ui.netlify.app/)も含まれています。

Kobwebは、SEOと自動検索インデックス作成のためにページスナップショットを生成することで、サイトのエクスポートもサポートしています。さらに、状態の変化に応じて効率的に更新されるDOMベースのUIの作成も可能です。

ドキュメントと例については、[Kobweb docs](https://kobweb.varabyte.com/docs/getting-started/what-is-kobweb)サイトを参照してください。

フレームワークの最新情報や議論については、[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)の[#kobweb](https://kotlinlang.slack.com/archives/C04RTD72RQ8)および[#compose-web](https://kotlinlang.slack.com/archives/C01F2HV7868)チャンネルに参加してください。

## Kilua

[Kilua](https://kilua.dev/)は、[Compose Runtime](https://developer.android.com/jetpack/androidx/releases/compose-runtime)上に構築されたコンポーザブルなウェブフレームワークで、[compose-html](https://github.com/JetBrains/compose-multiplatform#compose-html)ライブラリに似ています。compose-htmlとは異なり、KiluaはKotlin/WasmとKotlin/JSの両方のターゲットをサポートしています。

Kiluaは、宣言型UIコンポーネントを作成し、その状態を管理するためのモジュラーAPIを提供します。また、一般的なウェブアプリケーションのユースケースに対応するすぐに使えるコンポーネントセットも含まれています。

Kiluaは[KVision](https://kvision.io)フレームワークの後継となります。Kiluaは、Composeユーザー（`@Composable`関数、状態管理、コルーチン/フローの統合）とKVisionユーザー（UIコンポーネントとの命令型操作を可能にするコンポーネントベースのAPI）の両方にとって馴染みやすいように設計されています。

ドキュメントと例については、GitHubの[Kiluaリポジトリ](https://github.com/rjaros/kilua?tab=readme-ov-file#building-and-running-the-examples)を参照してください。

フレームワークの最新情報や議論については、[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)の[#kilua](https://kotlinlang.slack.com/archives/C06UAH52PA7)チャンネルに参加してください。

## Kotlin React

[React](https://react.dev/)はコンポーネントベースのライブラリで、ウェブおよびネイティブのユーザーインターフェースで広く使用されています。コンポーネント、学習資料、活発なコミュニティからなる大規模なエコシステムを提供します。

[Kotlin React](https://github.com/JetBrains/kotlin-wrappers/blob/master/docs/guide/react.md)はReact用のKotlinラッパーであり、ReactのエコシステムとKotlinの型安全性、表現力を組み合わせています。

ライブラリの最新情報や議論については、[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)の[#react](https://kotlinlang.slack.com/messages/react)および[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69)チャンネルに参加してください。

## KVision

[KVision](https://kvision.io)は、すぐに使えるUIコンポーネントを使用してKotlin/JSアプリケーションを構築するためのオブジェクト指向ウェブフレームワークです。これらのコンポーネントは、アプリケーションのユーザーインターフェースの構成要素として機能します。

このフレームワークを使用すると、リアクティブなプログラミングモデルと命令型のプログラミングモデルの両方を使用してフロントエンドを構築できます。Ktor、Spring Boot、その他のフレームワーク用のコネクタを使用することで、サーバーサイドアプリケーションと統合することも可能です。さらに、[Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)を使用してコードを共有できます。

ドキュメント、チュートリアル、例については、[KVision docs](https://kvision.io/#docs)サイトを参照してください。

フレームワークの最新情報や議論については、[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)の[#kvision](https://kotlinlang.slack.com/messages/kvision)および[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69)チャンネルに参加してください。

## fritz2

[fritz2](https://www.fritz2.dev)は、リアクティブなウェブユーザーインターフェースを構築するためのスタンドアロンフレームワークです。HTML要素を構築およびレンダリングするための独自の型安全なDSLを提供し、Kotlinのコルーチンとフローを使用してコンポーネントとそのデータバインディングを定義します。

fritz2は、標準で状態管理、バリデーション、ルーティングなどを提供します。また、Kotlin Multiplatformプロジェクトと統合できます。

ドキュメント、チュートリアル、例については、[fritz2 docs](https://www.fritz2.dev/docs/)サイトを参照してください。

フレームワークの最新情報や議論については、[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)の[#fritz2](https://kotlinlang.slack.com/messages/fritz2)および[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69)チャンネルに参加してください。

## Doodle

[Doodle](https://nacular.github.io/doodle/)は、Kotlin/JS用のベクターベースのUIフレームワークです。Doodleアプリケーションは、DOM、CSS、またはJavaScriptに依存するのではなく、ブラウザのグラフィック機能を使用してユーザーインターフェースを描画します。このアプローチにより、任意のUI要素、ベクターシェイプ、グラデーション、カスタムビジュアライゼーションのレンダリングを細かく制御できます。

ドキュメント、チュートリアル、例については、[Doodle docs](https://nacular.github.io/doodle/docs/introduction/)サイトを参照してください。

フレームワークの最新情報や議論については、[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)の[#doodle](https://kotlinlang.slack.com/messages/doodle)および[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69)チャンネルに参加してください。