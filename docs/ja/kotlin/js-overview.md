[//]: # (title: JavaScript向けKotlin)

Kotlin/JSは、Kotlinコード、Kotlin標準ライブラリ、および互換性のある依存関係をJavaScriptにトランスパイルする機能を提供します。Kotlin/JSの現在の実装は、[ES5](https://www.ecma-international.org/ecma-262/5.1/)をターゲットとしています。

Kotlin/JSの推奨される使用方法は、`kotlin.multiplatform` Gradleプラグインを介することです。これにより、JavaScriptをターゲットとするKotlinプロジェクトのセットアップと制御を1箇所で簡単に行うことができます。これには、アプリケーションのバンドルの制御、npmからのJavaScript依存関係の直接追加などの重要な機能が含まれます。利用可能なオプションの概要については、[Kotlin/JSプロジェクトのセットアップ](js-project-setup.md)を参照してください。

## Kotlin/JS IRコンパイラ

[Kotlin/JS IRコンパイラ](js-ir-compiler.md)は、従来のデフォルトコンパイラに比べて多くの改善が施されています。例えば、デッドコード除去によって生成される実行可能ファイルのサイズを削減し、JavaScriptエコシステムとそのツールとのよりスムーズな相互運用性を提供します。

> 従来のコンパイラはKotlin 1.8.0リリース以降、非推奨になっています。
> 
{style="note"}

KotlinコードからTypeScript宣言ファイル（`d.ts`）を生成することで、IRコンパイラはTypeScriptとKotlinのコードを混在させた「ハイブリッド」アプリケーションをより簡単に作成し、Kotlin Multiplatformを使用したコード共有機能を活用できるようにします。

Kotlin/JS IRコンパイラの利用可能な機能と、プロジェクトで試す方法の詳細については、[Kotlin/JS IRコンパイラのドキュメントページ](js-ir-compiler.md)と[マイグレーションガイド](js-ir-migration.md)を参照してください。

## Kotlin/JSフレームワーク

現代のウェブ開発は、ウェブアプリケーションの構築を簡素化するフレームワークから大きな恩恵を受けています。以下に、異なる作者によって書かれたKotlin/JS向けの一般的なウェブフレームワークの例をいくつか示します。

### Kobweb

_Kobweb_は、ウェブサイトやウェブアプリを作成するための、独自の設計思想を持つKotlinフレームワークです。これは、[Compose HTML](https://github.com/JetBrains/compose-multiplatform?tab=readme-ov-file#compose-html)とライブリロードを活用して高速な開発を実現します。[Next.js](https://nextjs.org/)に触発され、Kobwebはウィジェット、レイアウト、ページを追加するための標準的な構造を推奨しています。

Kobwebは、すぐに利用できる状態で、ページルーティング、ライト/ダークモード、CSSスタイリング、Markdownサポート、バックエンドAPIなどの機能を提供します。また、Silkと呼ばれるUIライブラリも含まれており、最新のUI向けの多彩なウィジェットのセットです。

Kobwebはまた、サイトのエクスポートもサポートしており、SEOと自動検索インデックス作成のためにページのスナップショットを生成します。さらに、Kobwebを使用すると、状態の変化に効率的に応答して更新されるDOMベースのUIを簡単に作成できます。

ドキュメントと例については、[Kobweb](https://kobweb.varabyte.com/)サイトをご覧ください。

フレームワークに関する更新や議論については、Kotlin Slackの[#kobweb](https://kotlinlang.slack.com/archives/C04RTD72RQ8)および[#compose-web](https://kotlinlang.slack.com/archives/C01F2HV7868)チャンネルに参加してください。

### KVision

_KVision_は、オブジェクト指向のウェブフレームワークであり、すぐに使えるコンポーネントをアプリケーションのユーザーインターフェースの構成要素として使用して、Kotlin/JSでアプリケーションを記述することを可能にします。フロントエンドの構築にはリアクティブプログラミングモデルと命令型プログラミングモデルの両方を使用でき、Ktor、Spring Boot、その他のフレームワーク用のコネクタを使用してサーバーサイドアプリケーションと統合したり、[Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)を使用してコードを共有したりできます。

ドキュメント、チュートリアル、例については、[KVisionサイト](https://kvision.io)をご覧ください。

フレームワークに関する更新や議論については、[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)の[#kvision](https://kotlinlang.slack.com/messages/kvision)および[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69)チャンネルに参加してください。

### fritz2

_fritz2_は、リアクティブなウェブユーザーインターフェースを構築するためのスタンドアロンフレームワークです。HTML要素の構築とレンダリングのための独自の型安全なDSLを提供し、Kotlinのコルーチンとフローを活用してコンポーネントとそのデータバインディングを表現します。状態管理、バリデーション、ルーティングなどをすぐに利用できる形で提供し、Kotlin Multiplatformプロジェクトと統合します。

ドキュメント、チュートリアル、例については、[fritz2サイト](https://www.fritz2.dev)をご覧ください。

フレームワークに関する更新や議論については、[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)の[#fritz2](https://kotlinlang.slack.com/messages/fritz2)および[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69)チャンネルに参加してください。

### Doodle

_Doodle_は、Kotlin/JS向けのベクターベースのUIフレームワークです。Doodleアプリケーションは、DOM、CSS、またはJavaScriptに依存する代わりに、ブラウザのグラフィック機能を使用してユーザーインターフェースを描画します。このアプローチを使用することで、Doodleは任意のUI要素、ベクターシェイプ、グラデーション、カスタムビジュアライゼーションのレンダリングを正確に制御できます。

ドキュメント、チュートリアル、例については、[Doodleサイト](https://nacular.github.io/doodle/)をご覧ください。

フレームワークに関する更新や議論については、[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)の[#doodle](https://kotlinlang.slack.com/messages/doodle)および[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69)チャンネルに参加してください。

## Kotlin/JSコミュニティに参加する

公式の[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)にある[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69)チャンネルに参加して、コミュニティやチームとチャットできます。