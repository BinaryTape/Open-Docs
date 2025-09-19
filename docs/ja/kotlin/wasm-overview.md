[//]: # (title: Kotlin/Wasm)

<primary-label ref="beta"/> 

Kotlin/Wasmは、Kotlinコードを[WebAssembly (Wasm)](https://webassembly.org/)形式にコンパイルする機能を提供します。
Kotlin/Wasmを使用すると、Wasmをサポートし、Kotlinの要件を満たす様々な環境やデバイスで動作するアプリケーションを作成できます。

Wasmは、スタックベースの仮想マシンのためのバイナリ命令形式です。この形式は、独自の仮想マシン上で動作するため、
プラットフォームに依存しません。Wasmは、Kotlinやその他の言語にコンパイルターゲットを提供します。

Kotlin/Wasmは、ブラウザなどの様々なターゲット環境で利用できます。例えば、[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)で構築された
Webアプリケーションの開発や、ブラウザ外のスタンドアロンWasm仮想マシンで利用可能です。ブラウザ外のケースでは、
[WebAssembly System Interface (WASI)](https://wasi.dev/)がプラットフォームAPIへのアクセスを提供し、これも利用できます。

> Kotlin/Wasmで構築されたアプリケーションをブラウザで実行するには、ユーザーの皆様には、WebAssemblyのガベージコレクションとレガシー例外処理のプロポーザルをサポートする[ブラウザバージョン](wasm-configuration.md#browser-versions)が必要です。ブラウザのサポート状況を確認するには、[WebAssembly
> roadmap](https://webassembly.org/roadmap/)を参照してください。
>
{style="tip"}

## Kotlin/WasmとCompose Multiplatform

Kotlinを使用すると、Compose MultiplatformとKotlin/Wasmを介して、Webプロジェクトでモバイルおよびデスクトップのユーザーインターフェース (UI) を構築し再利用する能力が得られます。

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)は、Kotlinと[Jetpack Compose](https://developer.android.com/jetpack/compose)に基づく宣言型フレームワークであり、UIを一度実装するだけで、ターゲットとするすべてのプラットフォームで共有できます。

Webプラットフォーム向けには、Compose MultiplatformはKotlin/Wasmをコンパイルターゲットとして使用します。Kotlin/WasmとCompose Multiplatformで構築されたアプリケーションは、`wasm-js`ターゲットを使用し、ブラウザで動作します。

[Compose MultiplatformとKotlin/Wasmで構築されたアプリケーションのオンラインデモをご覧ください](https://zal.im/wasm/jetsnack/)

![Kotlin/Wasm demo](wasm-demo.png){width=700}

さらに、最も人気のあるKotlinライブラリをKotlin/Wasmですぐに利用できます。他のKotlinおよびMultiplatformプロジェクトと同様に、ビルドスクリプトに依存関係宣言を含めることができます。詳細については、[マルチプラットフォームライブラリへの依存関係の追加](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-add-dependencies.html)を参照してください。

ご自身で試してみませんか？

<a href="wasm-get-started.md"><img src="wasm-get-started-button.svg" width="600" alt="Get started with Kotlin/Wasm" style="block"/></a>

## Kotlin/WasmとWASI

Kotlin/Wasmは、サーバーサイドアプリケーション向けに[WebAssembly System Interface (WASI)](https://wasi.dev/)を使用します。
Kotlin/WasmとWASIで構築されたアプリケーションは、Wasm-WASIターゲットを使用するため、WASI APIを呼び出し、ブラウザ環境外でアプリケーションを実行できます。

Kotlin/WasmはWASIを活用してプラットフォーム固有の詳細を抽象化し、同じKotlinコードを多様なプラットフォームで実行できるようにします。これにより、各ランタイムでカスタム処理を必要とすることなく、Kotlin/Wasmの適用範囲がWebアプリケーション以外にも拡大します。

WASIは、WebAssemblyにコンパイルされたKotlinアプリケーションを様々な環境で実行するための、安全な標準インターフェースを提供します。

> Kotlin/WasmとWASIの動作を確認するには、[Kotlin/WasmとWASI入門チュートリアル](wasm-wasi.md)をご覧ください。
>
{style="tip"}

## Kotlin/Wasmのパフォーマンス

Kotlin/Wasmはまだアルファ版ですが、Kotlin/Wasm上で動作するCompose Multiplatformは、すでに有望なパフォーマンス特性を示しています。その実行速度はJavaScriptを上回り、JVMのそれに近づいていることがわかります。

![Kotlin/Wasm performance](wasm-performance-compose.png){width=700}

私たちはKotlin/Wasmで定期的にベンチマークを実行しており、これらの結果はGoogle Chromeの最新バージョンでのテストによるものです。

## ブラウザAPIのサポート

Kotlin/Wasm標準ライブラリは、DOM APIを含むブラウザAPIの宣言を提供します。
これらの宣言により、Kotlin APIを直接使用して、様々なブラウザ機能をアクセスおよび利用できます。例えば、Kotlin/Wasmアプリケーションでは、DOM要素の操作やAPIのフェッチを、これらの宣言をゼロから定義することなく利用できます。詳細については、[Kotlin/Wasmブラウザの例](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/browser-example)をご覧ください。

ブラウザAPIサポートのための宣言は、JavaScriptの[相互運用機能](wasm-js-interop.md)を使用して定義されています。
同じ機能を使用して、独自の宣言を定義できます。さらに、Kotlin/WasmとJavaScriptの相互運用性により、JavaScriptからKotlinコードを使用できます。詳細については、[JavaScriptでKotlinコードを使用する](wasm-js-interop.md#use-kotlin-code-in-javascript)を参照してください。

## フィードバック

### Kotlin/Wasmに関するフィードバック

* ![Slack](slack.svg){width=25}{type="joined"} Slack: [Slackへの招待](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)を受け取り、[#webassembly](https://kotlinlang.slack.com/archives/CDFP59223)チャンネルで開発者に直接フィードバックを提供してください。
* [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492)で問題があれば報告してください。

### Compose Multiplatformに関するフィードバック

* ![Slack](slack.svg){width=25}{type="joined"} Slack: [#compose-web](https://slack-chats.kotlinlang.org/c/compose-web)公開チャンネルでフィードバックを提供してください。
* [GitHubで問題があれば報告してください](https://github.com/JetBrains/compose-multiplatform/issues)。

## 詳細情報

* Kotlin/Wasmの詳細については、こちらの[YouTubeプレイリスト](https://kotl.in/wasm-pl)をご覧ください。
* GitHubリポジトリの[Kotlin/Wasmの例](https://github.com/Kotlin/kotlin-wasm-examples)をご覧ください。