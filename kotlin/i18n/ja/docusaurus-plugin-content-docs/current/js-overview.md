---
title: "Kotlin for JavaScript"
---
Kotlin/JS は、Kotlin コード、Kotlin 標準ライブラリ、および互換性のあるすべての依存関係を JavaScript にトランスパイルする機能を提供します。現在の Kotlin/JS の実装は、[ES5](https://www.ecma-international.org/ecma-262/5.1/) をターゲットにしています。

Kotlin/JS を使用する推奨される方法は、`kotlin.multiplatform` Gradle プラグインを使用することです。これにより、JavaScript をターゲットとする Kotlin プロジェクトを 1 か所で簡単にセットアップおよび制御できます。これには、アプリケーションのバンドルを制御したり、npm から JavaScript の依存関係を直接追加したりするなどの重要な機能が含まれます。利用可能なオプションの概要については、[Kotlin/JS プロジェクトのセットアップ](js-project-setup) を確認してください。

## Kotlin/JS IR コンパイラー

[Kotlin/JS IR compiler](js-ir-compiler) には、以前のデフォルトコンパイラーよりも多くの改善が加えられています。たとえば、dead code elimination を使用して生成される実行ファイルのサイズを削減し、JavaScript エコシステムとそのツールとのよりスムーズな相互運用性を提供します。

:::note
古いコンパイラーは Kotlin 1.8.0 リリース以降、非推奨になっています。

:::

IR コンパイラーは、Kotlin コードから TypeScript 宣言ファイル（`d.ts`）を生成することにより、TypeScript と Kotlin コードを混在させた「ハイブリッド」アプリケーションの作成を容易にし、Kotlin Multiplatform を使用したコード共有機能を活用できるようにします。

Kotlin/JS IR コンパイラーで利用可能な機能の詳細、およびプロジェクトで試す方法については、[Kotlin/JS IR compiler documentation page](js-ir-compiler) および [migration guide](js-ir-migration) をご覧ください。

## Kotlin/JS フレームワーク

現代の Web 開発は、Web アプリケーションの構築を簡素化するフレームワークから大きな恩恵を受けています。以下に、さまざまな作成者によって作成された Kotlin/JS 用の一般的な Web フレームワークの例をいくつか示します。

### Kobweb

_Kobweb_ は、Web サイトおよび Web アプリケーションを作成するための、意見の分かれる Kotlin フレームワークです。[Compose HTML](https://github.com/JetBrains/compose-multiplatform?tab=readme-ov-file#compose-html) とライブリロードを活用して、迅速な開発を実現します。[Next.js](https://nextjs.org/) に触発された Kobweb は、ウィジェット、レイアウト、ページを追加するための標準構造を推進します。

Kobweb は、ページルーティング、ライト/ダークモード、CSS スタイル、Markdown サポート、バックエンドAPI、およびその他の機能をすぐに利用できます。また、最新の UI 向けの汎用性の高いウィジェットのセットである Silk という UI ライブラリも含まれています。

Kobweb は、SEO および自動検索インデックス作成のためのページスナップショットを生成する、サイトのエクスポートもサポートしています。さらに、Kobweb を使用すると、状態の変化に応じて効率的に更新される DOM ベースの UI を簡単に作成できます。

ドキュメントと例については、[Kobweb](https://kobweb.varabyte.com/) サイトをご覧ください。

フレームワークに関する最新情報とディスカッションについては、Kotlin Slack の [#kobweb](https://kotlinlang.slack.com/archives/C04RTD72RQ8) および [#compose-web](https://kotlinlang.slack.com/archives/C01F2HV7868) チャネルにご参加ください。

### KVision

_KVision_ は、すぐに使用できるコンポーネントを使用して Kotlin/JS でアプリケーションを作成できるようにするオブジェクト指向の Web フレームワークです。これらのコンポーネントは、アプリケーションのユーザーインターフェイスの構成要素として使用できます。リアクティブプログラミングモデルと命令型プログラミングモデルの両方を使用してフロントエンドを構築したり、Ktor、Spring Boot、およびその他のフレームワーク用のコネクタを使用してサーバーサイドアプリケーションと統合したり、[Kotlin Multiplatform](multiplatform-intro) を使用してコードを共有したりできます。

ドキュメント、チュートリアル、および例については、[KVision site](https://kvision.io) をご覧ください。

フレームワークに関する最新情報とディスカッションについては、[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) の [#kvision](https://kotlinlang.slack.com/messages/kvision) および [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) チャネルにご参加ください。

### fritz2

_fritz2_ は、リアクティブな Web ユーザーインターフェイスを構築するためのスタンドアロンのフレームワークです。HTML 要素を構築およびレンダリングするための独自のタイプセーフDSLを提供し、Kotlin のコルーチンとフローを使用してコンポーネントとそのデータバインディングを表現します。ステート管理、検証、ルーティングなどをすぐに利用でき、Kotlin Multiplatform プロジェクトと統合されます。

ドキュメント、チュートリアル、および例については、[fritz2 site](https://www.fritz2.dev) をご覧ください。

フレームワークに関する最新情報とディスカッションについては、[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) の [#fritz2](https://kotlinlang.slack.com/messages/fritz2) および [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) チャネルにご参加ください。

### Doodle

_Doodle_ は、Kotlin/JS 用のベクターベースの UI フレームワークです。Doodle アプリケーションは、DOM、CSS、または Javascript に依存する代わりに、ブラウザーのグラフィックス機能を使用してユーザーインターフェイスを描画します。このアプローチを使用することにより、Doodle は、任意の UI 要素、ベクターシェイプ、グラデーション、およびカスタム視覚化のレンダリングを正確に制御できます。

ドキュメント、チュートリアル、および例については、[Doodle site](https://nacular.github.io/doodle/) をご覧ください。

フレームワークに関する最新情報とディスカッションについては、[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) の [#doodle](https://kotlinlang.slack.com/messages/doodle) および [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) チャネルにご参加ください。

## Kotlin/JS コミュニティに参加する

公式 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) の [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) チャネルに参加して、コミュニティやチームとチャットできます。