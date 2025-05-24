---
title: Kotlin/Wasm
---
:::note
Kotlin/Wasmは[Alpha](components-stability)版です。
予告なく変更される場合があります。本番環境以外でのシナリオでお使いいただけます。[YouTrack](https://youtrack.jetbrains.com/issue/KT-56492)でフィードバックをお寄せください。

[Kotlin/Wasmコミュニティに参加する](https://slack-chats.kotlinlang.org/c/webassembly)。

:::

Kotlin/Wasmを使用すると、Kotlinコードを[WebAssembly (Wasm)](https://webassembly.org/)形式にコンパイルできます。
Kotlin/Wasmを使用すると、Wasmをサポートし、Kotlinの要件を満たすさまざまな環境やデバイスで実行できるアプリケーションを作成できます。

Wasmは、スタックベースの仮想マシン用のバイナリ命令形式です。この形式は、独自の仮想マシンで実行されるため、プラットフォームに依存しません。Wasmは、Kotlinやその他の言語にコンパイルターゲットを提供します。

Kotlin/Wasmは、[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)で構築されたWebアプリケーションを開発するためにブラウザなどのさまざまなターゲット環境で使用したり、スタンドアロンのWasm仮想マシンでブラウザの外部で使用したりできます。ブラウザの外部で使用する場合は、[WebAssembly System Interface (WASI)](https://wasi.dev/)がプラットフォームAPIへのアクセスを提供し、これを利用することもできます。

## Kotlin/WasmとCompose Multiplatform

Kotlinを使用すると、Compose MultiplatformとKotlin/Wasmを通じて、モバイルおよびデスクトップのユーザーインターフェース (UI) をWebプロジェクトで構築および再利用できます。

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)は、Kotlinと[Jetpack Compose](https://developer.android.com/jetpack/compose)に基づく宣言型フレームワークであり、UIを一度実装して、ターゲットとするすべてのプラットフォームで共有できます。

Webプラットフォームの場合、Compose MultiplatformはKotlin/Wasmをコンパイルターゲットとして使用します。Kotlin/WasmとCompose Multiplatformで構築されたアプリケーションは、`wasm-js`ターゲットを使用し、ブラウザで実行されます。

[Compose MultiplatformとKotlin/Wasmで構築されたアプリケーションのオンラインデモをご覧ください](https://zal.im/wasm/jetsnack/)

<img src="/img/wasm-demo.png" alt="Kotlin/Wasm demo" width="700" style={{verticalAlign: 'middle'}}/>
:::tip
Kotlin/Wasmで構築されたアプリケーションをブラウザで実行するには、新しいガベージコレクションとレガシー例外処理の提案をサポートするブラウザバージョンが必要です。ブラウザのサポート状況を確認するには、[WebAssembly roadmap](https://webassembly.org/roadmap/)をご覧ください。

:::

さらに、最も一般的なKotlinライブラリをKotlin/Wasmですぐに使用できます。他のKotlinおよびMultiplatformプロジェクトと同様に、ビルドスクリプトに依存関係の宣言を含めることができます。詳細については、[Adding dependencies on multiplatform libraries](multiplatform-add-dependencies)を参照してください。

試してみませんか？

<a href="wasm-get-started"><img src="/img/wasm-get-started-button.svg" width="600" alt="Get started with Kotlin/Wasm" /></a>

## Kotlin/WasmとWASI

Kotlin/Wasmは、サーバー側アプリケーションに[WebAssembly System Interface (WASI)](https://wasi.dev/)を使用します。
Kotlin/WasmとWASIで構築されたアプリケーションは、Wasm-WASIターゲットを使用し、WASI APIを呼び出して、ブラウザ環境の外部でアプリケーションを実行できます。

Kotlin/WasmはWASIを活用してプラットフォーム固有の詳細を抽象化し、同じKotlinコードを多様なプラットフォームで実行できるようにします。これにより、各ランタイムにカスタム処理を必要とせずに、Kotlin/WasmのリーチをWebアプリケーションを超えて拡張します。

WASIは、さまざまな環境でWebAssemblyにコンパイルされたKotlinアプリケーションを実行するための安全な標準インターフェースを提供します。

:::tip
Kotlin/WasmとWASIの動作を確認するには、[Get started with Kotlin/Wasm and WASI tutorial](wasm-wasi)をご覧ください。

:::

## Kotlin/Wasmのパフォーマンス

Kotlin/WasmはまだAlpha版ですが、Kotlin/Wasmで実行されているCompose Multiplatformは、すでに有望なパフォーマンストレイトを示しています。その実行速度はJavaScriptよりも優れており、JVMの実行速度に近づいています。

<img src="/img/wasm-performance-compose.png" alt="Kotlin/Wasm performance" width="700" style={{verticalAlign: 'middle'}}/>

Kotlin/Wasmで定期的にベンチマークを実行しており、これらの結果は、最近のバージョンのGoogle Chromeでのテストから得られたものです。

## ブラウザAPIのサポート

Kotlin/Wasm標準ライブラリは、DOM APIを含むブラウザAPIの宣言を提供します。
これらの宣言を使用すると、Kotlin APIを直接使用して、さまざまなブラウザ機能にアクセスして利用できます。
たとえば、Kotlin/Wasmアプリケーションでは、DOM要素の操作やAPIのフェッチを、最初からこれらの宣言を定義せずに使用できます。詳細については、[Kotlin/Wasm browser example](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/browser-example)をご覧ください。

ブラウザAPIサポートの宣言は、JavaScript [interoperability capabilities](wasm-js-interop)を使用して定義されています。
同じ機能を使用して、独自の宣言を定義できます。さらに、Kotlin/Wasm–JavaScriptの相互運用性により、JavaScriptからKotlinコードを使用できます。詳細については、[Use Kotlin code in JavaScript](wasm-js-interop#use-kotlin-code-in-javascript)を参照してください。

## フィードバックをお寄せください

### Kotlin/Wasmのフィードバック

* <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack: [Slack招待状を入手](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)し、[#webassembly](https://kotlinlang.slack.com/archives/CDFP59223)チャンネルで開発者に直接フィードバックを提供してください。
* [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492)で問題を報告してください。

### Compose Multiplatformのフィードバック

* <img src="/img/slack.svg" alt="Slack" width="25" style={{verticalAlign: 'middle'}}/> Slack: [#compose-web](https://slack-chats.kotlinlang.org/c/compose-web)パブリックチャンネルでフィードバックを提供してください。
* [GitHubで問題を報告する](https://github.com/JetBrains/compose-multiplatform/issues)。

## さらに詳しく

* この[YouTubeプレイリスト](https://kotl.in/wasm-pl)でKotlin/Wasmの詳細をご覧ください。
* GitHubリポジトリで[Kotlin/Wasmの例](https://github.com/Kotlin/kotlin-wasm-examples)をご覧ください。