[//]: # (title: Kotlin/JS フレームワーク)

Web開発を簡素化する、利用可能なKotlin/JavaScriptフレームワークを活用しましょう。
これらのフレームワークは、モダンなWebアプリケーションを構築するための、すぐに使えるコンポーネント、ルーティング、状態管理、その他のツールを提供します。

以下は、コミュニティによるいくつかのKotlin/JS Webフレームワークです。

## Kobweb

[Kobweb](https://kobweb.varabyte.com/)は、[Compose HTML](https://github.com/JetBrains/compose-multiplatform?tab=readme-ov-file#compose-html)を使用してウェブサイトやWebアプリケーションを作成するためのKotlinフレームワークです。高速な開発のためのライブリロード（live-reloading）をサポートしています。[Next.js](https://nextjs.org/)にインスパイアされたKobwebは、ウィジェット、レイアウト、ページの追加に関する標準的な構造を推進しています。

標準機能として、Kobwebはページルーティング、ライト/ダークモード、CSSスタイリング、Markdownサポート、バックエンドAPIなどを提供します。また、モダンなUIのための多機能なウィジェットセットを備えたUIライブラリである[Silk](https://silk-ui.netlify.app/)も含まれています。

Kobwebは、SEOや自動検索インデックス作成のためにページのスナップショットを生成するサイトエクスポートもサポートしています。さらに、状態の変化に応じて効率的に更新されるDOMベースのUIの作成を可能にします。

ドキュメントと例については、[Kobweb의 ドキュメント](https://kobweb.varabyte.com/docs/getting-started/what-is-kobweb)サイトを参照してください。

フレームワークに関する更新や議論については、[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)の [#kobweb](https://kotlinlang.slack.com/archives/C04RTD72RQ8) および [#compose-web](https://kotlinlang.slack.com/archives/C01F2HV7868) チャンネルに参加してください。

## Kilua

[Kilua](https://kilua.dev/)は、[Compose Runtime](https://developer.android.com/jetpack/androidx/releases/compose-runtime)上に構築されたコンポーザブルなWebフレームワークであり、[compose-html](https://github.com/JetBrains/compose-multiplatform#compose-html)ライブラリに似ています。compose-htmlとは異なり、KiluaはKotlin/WasmとKotlin/JSの両方のターゲットをサポートしています。

Kiluaは、宣言的なUIコンポーネントを作成し、その状態を管理するためのモジュール式APIを提供します。また、一般的なWebアプリケーションのユースケース向けの、すぐに使えるコンポーネントセットも含まれています。

Kiluaは[KVision](https://kvision.io)フレームワークの後継です。Kiluaは、Composeユーザー（`@Composable`関数、状態管理、コルーチン/flowの統合）と、KVisionユーザー（UIコンポーネントとの命令的な相互作用を可能にするコンポーネントベースのAPI）の両方にとって親しみやすいように設計されています。

ドキュメントと例については、GitHubの [Kiluaリポジトリ](https://github.com/rjaros/kilua?tab=readme-ov-file#building-and-running-the-examples)を参照してください。

フレームワークに関する更新や議論については、[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)の [#kilua](https://kotlinlang.slack.com/archives/C06UAH52PA7) チャンネルに参加してください。

## Kotlin React

[React](https://react.dev/)は、Webやネイティブのユーザーインターフェースで広く使用されているコンポーネントベースのライブラリです。豊富なコンポーネントのエコシステム、学習資料、そして活発なコミュニティを提供しています。

[Kotlin React](https://github.com/JetBrains/kotlin-wrappers/blob/master/docs/guide/react.md)は、ReactのエコシステムとKotlin의 型安全性および表現力を組み合わせた、React用のKotlinラッパーです。

ライブラリに関する更新や議論については、[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)の [#react](https://kotlinlang.slack.com/messages/react) および [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) チャンネルに参加してください。

## KVision

[KVision](https://kvision.io)は、すぐに使えるUIコンポーネントを使用してKotlin/JSアプリケーションを構築するための、オブジェクト指向のWebフレームワークです。これらのコンポーネントは、アプリケーションのユーザーインターフェースの構成要素（ビルディングブロック）となります。

このフレームワークを使用すると、リアクティブ（reactive）と命令的（imperative）の両方のプログラミングモデルを使用してフロントエンドを構築できます。また、KtorやSpring Boot、その他のフレームワーク用のコネクタを使用して、サーバーサイドアプリケーションと統合することもできます。さらに、[Kotlin Multiplatform](https://kotlinlang.org/docs/multiplatform/get-started.html)を使用してコードを共有することも可能です。

ドキュメント、チュートリアル、例については、[KVisionのドキュメント](https://kvision.io/#docs)サイトを参照してください。

フレームワークに関する更新や議論については、[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)の [#kvision](https://kotlinlang.slack.com/messages/kvision) および [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) チャンネルに参加してください。

## fritz2

[fritz2](https://www.fritz2.dev)は、リアクティブなWebユーザーインターフェースを構築するためのスタンドアロンフレームワークです。HTML要素を構築・レンダリングするための独自の型安全なDSLを提供し、コンポーネントとそのデータバインディングを定義するためにKotlinのコルーチン（coroutines）とFlow（flows）を使用します。

標準機能として、fritz2は状態管理、バリデーション、ルーティングなどを提供します。また、Kotlin Multiplatformプロジェクトとも統合できます。

ドキュメント、チュートリアル、例については、[fritz2のドキュメント](https://www.fritz2.dev/docs/)サイトを参照してください。

フレームワークに関する更新や議論については、[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)の [#fritz2](https://kotlinlang.slack.com/messages/fritz2) および [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) チャンネルに参加してください。

## Doodle

[Doodle](https://nacular.github.io/doodle/)は、Kotlin/JS用のベクトルベースのUIフレームワークです。Doodleアプリケーションは、DOM、CSS、またはJavaScriptに依存するのではなく、ブラウザのグラフィック機能を使用してユーザーインターフェースを描画します。このアプローチにより、任意のUI要素、ベクターシェイプ、グラデーション、カスタムビジュアライゼーションのレンダリングを制御できるようになります。

ドキュメント、チュートリアル、例については、[Doodleのドキュメント](https://nacular.github.io/doodle/docs/introduction/)サイトを参照してください。

フレームワークに関する更新や議論については、[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)の [#doodle](https://kotlinlang.slack.com/messages/doodle) および [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) チャンネルに参加してください。