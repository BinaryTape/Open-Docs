[//]: # (title: Kotlin/JS)

Kotlin/JSは、Kotlinコード、Kotlin標準ライブラリ、および互換性のあるすべての依存関係をJavaScriptにトランスパイルする機能を提供します。Kotlin/JSの現在の実装は[ES5](https://www.ecma-international.org/ecma-262/5.1/)をターゲットとしています。

Kotlin/JSを使用する推奨される方法は、`kotlin.multiplatform` Gradleプラグインを介することです。これにより、JavaScriptをターゲットとするKotlinプロジェクトを簡単に一元的にセットアップおよび制御できます。これには、アプリケーションのバンドル制御、npmからのJavaScript依存関係の直接追加などの不可欠な機能が含まれます。利用可能なオプションの概要については、[Kotlin/JSプロジェクトのセットアップ](js-project-setup.md)を参照してください。

## Kotlin/JS IRコンパイラ

[Kotlin/JS IRコンパイラ](js-ir-compiler.md)は、古いデフォルトのコンパイラに比べて多くの改善点があります。例えば、デッドコード排除によって生成される実行可能ファイルのサイズを削減し、JavaScriptエコシステムとそのツールとのよりスムーズな相互運用性を提供します。

> 古いコンパイラはKotlin 1.8.0のリリース以降、非推奨になりました。
> 
{style="note"}

KotlinコードからTypeScript宣言ファイル（`d.ts`）を生成することで、IRコンパイラはTypeScriptとKotlinコードを組み合わせた「ハイブリッド」アプリケーションの作成を容易にし、Kotlin Multiplatformを使用してコード共有機能を活用できるようにします。

Kotlin/JS IRコンパイラの利用可能な機能と、プロジェクトで試す方法の詳細については、[Kotlin/JS IRコンパイラ ドキュメントページ](js-ir-compiler.md)と[マイグレーションガイド](js-ir-migration.md)を参照してください。

## Kotlin/JSフレームワーク

モダンなWeb開発は、Webアプリケーションの構築を簡素化するフレームワークによって大きく恩恵を受けます。以下に、異なる作者によって書かれたKotlin/JS用の人気のあるWebフレームワークの例をいくつか紹介します。

### Kobweb

_Kobweb_ は、WebサイトおよびWebアプリを作成するための特定の思想に基づいたKotlinフレームワークです。[Compose HTML](https://github.com/JetBrains/compose-multiplatform?tab=readme-ov-file#compose-html)とライブリロードを活用して高速な開発を実現します。[Next.js](https://nextjs.org/)に触発され、Kobwebはウィジェット、レイアウト、ページを追加するための標準的な構造を推進しています。

標準で、Kobwebはページルーティング、ライト/ダークモード、CSSスタイリング、Markdownサポート、バックエンドAPI、その他の機能を提供します。また、Silkと呼ばれるUIライブラリも含まれており、モダンなUI向けの多機能なウィジェットセットです。

Kobwebはサイトのエクスポートもサポートしており、SEOと自動検索インデックス作成のためにページのスナップショットを生成します。さらに、Kobwebは状態の変化に応じて効率的に更新されるDOMベースのUIを簡単に作成できます。

ドキュメントと例については、[Kobwebサイト](https://kobweb.varabyte.com/)にアクセスしてください。

フレームワークに関する更新情報や議論については、Kotlin Slackの[#kobweb](https://kotlinlang.slack.com/archives/C04RTD72RQ8)および[#compose-web](https://kotlinlang.slack.com/archives/C01F2HV7868)チャンネルに参加してください。

### KVision

_KVision_ は、オブジェクト指向のWebフレームワークであり、Kotlin/JSでアプリケーションを記述することを可能にします。アプリケーションのユーザーインターフェースの構成要素として使用できる、すぐに使えるコンポーネントが提供されます。フロントエンドを構築するためにリアクティブプログラミングモデルと命令型プログラミングモデルの両方を使用でき、Ktor、Spring Boot、その他のフレームワーク用のコネクタを使用してサーバーサイドアプリケーションと統合し、[Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/get-started.html)を使用してコードを共有できます。

ドキュメント、チュートリアル、例については、[KVisionサイト](https://kvision.io)にアクセスしてください。

フレームワークに関する更新情報や議論については、[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)の[#kvision](https://kotlinlang.slack.com/messages/kvision)および[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69)チャンネルに参加してください。

### fritz2

_fritz2_ は、リアクティブなWebユーザーインターフェースを構築するためのスタンドアロンフレームワークです。HTML要素を構築およびレンダリングするための独自の型安全なDSLを提供し、Kotlinのコルーチンとフローを活用してコンポーネントとそのデータバインディングを表現します。標準で状態管理、バリデーション、ルーティングなどの機能を提供し、Kotlin Multiplatformプロジェクトと統合します。

ドキュメント、チュートリアル、例については、[fritz2サイト](https://www.fritz2.dev)にアクセスしてください。

フレームワークに関する更新情報や議論については、[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)の[#fritz2](https://kotlinlang.slack.com/messages/fritz2)および[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69)チャンネルに参加してください。

### Doodle

_Doodle_ は、Kotlin/JS用のベクターベースのUIフレームワークです。Doodleアプリケーションは、DOM、CSS、またはJavaScriptに依存するのではなく、ブラウザのグラフィック機能を使用してユーザーインターフェースを描画します。このアプローチを使用することで、Doodleは任意のUI要素、ベクターシェイプ、グラデーション、カスタムビジュアライゼーションのレンダリングを細かく制御できます。

ドキュメント、チュートリアル、例については、[Doodleサイト](https://nacular.github.io/doodle/)にアクセスしてください。

フレームワークに関する更新情報や議論については、[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)の[#doodle](https://kotlinlang.slack.com/messages/doodle)および[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69)チャンネルに参加してください。

## Kotlin/JSコミュニティに参加する

公式の[Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)の[#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69)チャンネルに参加して、コミュニティやチームとチャットできます。