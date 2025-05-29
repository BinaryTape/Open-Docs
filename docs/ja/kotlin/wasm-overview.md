[//]: # (title: Kotlin/Wasm)

> Kotlin/Wasmは[アルファ版](components-stability.md)です。
> いつでも変更される可能性があります。本番環境への導入前のシナリオで利用できます。皆様からのフィードバックを[YouTrack](https://youtrack.jetbrains.com/issue/KT-56492)でお待ちしております。
>
> [Kotlin/Wasmコミュニティに参加しましょう](https://slack-chats.kotlinlang.org/c/webassembly)。
>
{style="note"}

Kotlin/Wasmには、Kotlinコードを[WebAssembly (Wasm)](https://webassembly.org/)形式にコンパイルする機能があります。
Kotlin/Wasmを使用すると、Wasmをサポートし、Kotlinの要件を満たす様々な環境やデバイスで動作するアプリケーションを作成できます。

Wasmは、スタックベースの仮想マシン用のバイナリ命令形式です。この形式は独自の仮想マシン上で実行されるため、プラットフォームに依存しません。WasmはKotlinやその他の言語にコンパイルターゲットを提供します。

Kotlin/Wasmは、[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)で構築されたウェブアプリケーション開発のためにブラウザなどの様々なターゲット環境で、またはブラウザ外のスタンドアロンWasm仮想マシンで利用できます。ブラウザ外のケースでは、[WebAssembly System Interface (WASI)](https://wasi.dev/)がプラットフォームAPIへのアクセスを提供し、これも利用できます。

## Kotlin/WasmとCompose Multiplatform

Kotlinを使用すると、Compose MultiplatformとKotlin/Wasmを通じて、アプリケーションを構築し、モバイルおよびデスクトップのユーザーインターフェース (UI) をウェブプロジェクトで再利用できます。

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)は、Kotlinと[Jetpack Compose](https://developer.android.com/jetpack/compose)をベースにした宣言型フレームワークで、UIを一度実装するだけで、ターゲットとするすべてのプラットフォームで共有できます。

ウェブプラットフォームの場合、Compose MultiplatformはKotlin/Wasmをコンパイルターゲットとして使用します。Kotlin/WasmとCompose Multiplatformで構築されたアプリケーションは、`wasm-js`ターゲットを使用し、ブラウザで実行されます。

[Compose MultiplatformとKotlin/Wasmで構築されたアプリケーションのオンラインデモを見る](https://zal.im/wasm/jetsnack/)

![Kotlin/Wasmのデモ](wasm-demo.png){width=700}

> Kotlin/Wasmで構築されたアプリケーションをブラウザで実行するには、新しいガベージコレクションとレガシー例外処理のプロポーザルをサポートするブラウザバージョンが必要です。ブラウザのサポート状況を確認するには、[WebAssembly ロードマップ](https://webassembly.org/roadmap/)を参照してください。
>
{style="tip"}

さらに、Kotlin/Wasmでは、最も人気のあるKotlinライブラリをすぐに利用できます。他のKotlinおよびMultiplatformプロジェクトと同様に、ビルドスクリプトに依存関係の宣言を含めることができます。詳細については、[マルチプラットフォームライブラリへの依存関係の追加](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-add-dependencies.html)を参照してください。

ご自身で試してみませんか？

<a href="wasm-get-started.md"><img src="wasm-get-started-button.svg" width="600" alt="Kotlin/Wasmを始めよう" style="block"/></a>

## Kotlin/WasmとWASI

Kotlin/Wasmは、サーバーサイドアプリケーションに[WebAssembly System Interface (WASI)](https://wasi.dev/)を使用します。
Kotlin/WasmとWASIで構築されたアプリケーションはWasm-WASIターゲットを使用し、WASI APIを呼び出してブラウザ環境外でアプリケーションを実行できます。

Kotlin/WasmはWASIを活用してプラットフォーム固有の詳細を抽象化し、同じKotlinコードを様々なプラットフォームで実行できるようにします。これにより、各ランタイムでカスタム処理を必要とせずに、ウェブアプリケーションを超えてKotlin/Wasmの適用範囲を拡大します。

WASIは、WebAssemblyにコンパイルされたKotlinアプリケーションを様々な環境で実行するためのセキュアな標準インターフェースを提供します。

> Kotlin/WasmとWASIの動作を確認するには、[Kotlin/WasmとWASIの利用開始チュートリアル](wasm-wasi.md)を確認してください。
>
{style="tip"}

## Kotlin/Wasmのパフォーマンス

Kotlin/Wasmはまだアルファ版ですが、Kotlin/Wasm上で動作するCompose Multiplatformはすでに有望なパフォーマンス特性を示しています。その実行速度はJavaScriptを上回り、JVMに匹敵する水準に近づいていることがわかります。

![Kotlin/Wasmのパフォーマンス](wasm-performance-compose.png){width=700}

私たちは定期的にKotlin/Wasmのベンチマークを実行しており、これらの結果はGoogle Chromeの最新バージョンでのテストによるものです。

## ブラウザAPIのサポート

Kotlin/Wasmの標準ライブラリは、DOM APIを含むブラウザAPIの宣言を提供します。
これらの宣言を使用すると、Kotlin APIを直接使用して、様々なブラウザ機能にアクセスし、利用できます。
例えば、Kotlin/Wasmアプリケーションでは、DOM要素の操作やFetch APIの使用を、これらの宣言を一から定義することなく実行できます。詳細については、[Kotlin/Wasmブラウザのサンプル](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/browser-example)を参照してください。

ブラウザAPIサポートのための宣言は、JavaScriptの[相互運用機能](wasm-js-interop.md)を使用して定義されています。
同じ機能を使用して独自の宣言を定義できます。さらに、Kotlin/WasmとJavaScriptの相互運用により、JavaScriptからKotlinコードを使用できます。詳細については、[JavaScriptでKotlinコードを使用する](wasm-js-interop.md#use-kotlin-code-in-javascript)を参照してください。

## フィードバックを送る

### Kotlin/Wasmのフィードバック

*   ![Slack](slack.svg){width=25}{type="joined"} Slack: [Slackの招待を入手し](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)、`#webassembly`チャンネルで開発者に直接フィードバックを提供してください。
*   問題は[YouTrack](https://youtrack.jetbrains.com/issue/KT-56492)で報告してください。

### Compose Multiplatformのフィードバック

*   ![Slack](slack.svg){width=25}{type="joined"} Slack: `#compose-web`パブリックチャンネルでフィードバックを提供してください。
*   [問題はGitHubで報告してください](https://github.com/JetBrains/compose-multiplatform/issues)。

## さらに詳しく

*   この[YouTubeプレイリスト](https://kotl.in/wasm-pl)でKotlin/Wasmについてさらに学びましょう。
*   GitHubリポジトリで[Kotlin/Wasmのサンプル](https://github.com/Kotlin/kotlin-wasm-examples)を探索しましょう。