[//]: # (title: Kotlin/Wasm)

<primary-label ref="beta"/> 

Kotlin/Wasmは、Kotlinコードを[WebAssembly (Wasm)](https://webassembly.org/)形式にコンパイルする機能を備えています。
Kotlin/Wasmを使用することで、WasmをサポートしKotlinの要件を満たす、さまざまな環境やデバイスで動作するアプリケーションを作成できます。

Wasmは、スタックベースの仮想マシン向けのバイナリ命令形式です。この形式は独自の仮想マシン上で動作するため、プラットフォームに依存しません。Wasmは、Kotlinやその他の言語にコンパイルターゲットを提供します。

Kotlin/Wasmは、[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)で構築されたWebアプリケーション開発用のブラウザなど、さまざまなターゲット環境で使用できるほか、ブラウザ外のスタンドアロンなWasm仮想マシンでも使用できます。ブラウザ外の場合、[WebAssembly System Interface (WASI)](https://wasi.dev/)を通じてプラットフォームAPIにアクセスでき、これも利用可能です。

> Kotlin/Wasmで構築されたアプリケーションをブラウザで実行するには、ユーザーがWebAssemblyのガベージコレクション（Garbage Collection）および従来の例外処理（legacy exception handling）プロポーザルをサポートする[ブラウザバージョン](wasm-configuration.md#browser-versions)を使用している必要があります。ブラウザのサポート状況を確認するには、[WebAssembly roadmap](https://webassembly.org/roadmap/)を参照してください。
>
{style="tip"}

## Kotlin/Wasm と Compose Multiplatform

Kotlinを使用すると、Compose MultiplatformとKotlin/Wasmを通じて、モバイルおよびデスクトップのユーザーインターフェース（UI）をWebプロジェクトで再利用し、アプリケーションを構築できます。

[Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/)は、Kotlinと[Jetpack Compose](https://developer.android.com/jetpack/compose)に基づいた宣言型フレームワークであり、一度UIを実装すれば、ターゲットとするすべてのプラットフォームで共有できます。

Webプラットフォーム向けには、Compose MultiplatformはコンパイルターゲットとしてKotlin/Wasmを使用します。Kotlin/WasmとCompose Multiplatformで構築されたアプリケーションは、`wasm-js`ターゲットを使用し、ブラウザで動作します。

[Compose MultiplatformとKotlin/Wasmで構築されたアプリケーションのオンラインデモをご覧ください](https://zal.im/wasm/jetsnack/)

![Kotlin/Wasm demo](wasm-demo.png){width=700}

さらに、主要なKotlinライブラリの多くを、Kotlin/Wasmでそのまま（out of the box）使用できます。他のKotlinおよびマルチプラットフォームプロジェクトと同様に、ビルドスクリプトに依存関係の宣言を含めることができます。詳細については、[マルチプラットフォームライブラリへの依存関係の追加](https://kotlinlang.org/docs/multiplatform/multiplatform-add-dependencies.html)を参照してください。

実際に試してみませんか？

<a href="wasm-get-started.md"><img src="wasm-get-started-button.svg" width="600" alt="Get started with Kotlin/Wasm" style="block"/></a>

## Kotlin/Wasm と WASI

Kotlin/Wasmは、サーバーサイドアプリケーションのために[WebAssembly System Interface (WASI)](https://wasi.dev/)を使用します。
Kotlin/WasmとWASIで構築されたアプリケーションは、Wasm-WASIターゲットを使用します。これにより、WASI APIを呼び出したり、ブラウザ環境以外でアプリケーションを実行したりすることが可能になります。

Kotlin/WasmはWASIを活用してプラットフォーム固有の詳細を抽象化し、同じKotlinコードを多様なプラットフォームで動作させることができます。これにより、ランタイムごとのカスタム処理を必要とせずに、Kotlin/Wasmの適用範囲をWebアプリケーション以外に拡張できます。

WASIは、WebAssemblyにコンパイルされたKotlinアプリケーションをさまざまな環境で実行するための、安全な標準インターフェースを提供します。

> Kotlin/WasmとWASIが実際に動作する様子を確認するには、[Kotlin/WasmとWASIを使い始めるチュートリアル](wasm-wasi.md)をご覧ください。
>
{style="tip"}

## Kotlin/Wasm のパフォーマンス

Kotlin/Wasmはまだベータ版（Beta）ですが、Kotlin/Wasm上で動作するCompose Multiplatformは、すでに有望なパフォーマンス特性を示しています。実行速度がJavaScriptを上回り、JVMの速度に近づいていることがわかります。

![Kotlin/Wasm performance](wasm-performance-compose.png){width=700}

私たちは定期的にKotlin/Wasmのベンチマークを実行しており、これらの結果はGoogle Chromeの最新バージョンでのテストに基づいています。

## ブラウザAPIのサポート

Kotlin/Wasm標準ライブラリは、DOM APIを含むブラウザAPIの宣言を提供しています。
これらの宣言により、Kotlin APIを直接使用して、さまざまなブラウザ機能にアクセスし活用できます。
例えば、Kotlin/Wasmアプリケーションでは、これらの宣言をゼロから定義することなく、DOM要素の操作やFetch APIを使用できます。詳細については、[Kotlin/Wasmブラウザサンプルの例](https://github.com/Kotlin/kotlin-wasm-browser-template)を参照してください。

ブラウザAPIサポートの宣言は、JavaScriptとの[相互運用機能（interoperability capabilities）](wasm-js-interop.md)を使用して定義されています。
同じ機能を使用して、独自の宣言を定義することもできます。さらに、Kotlin/WasmとJavaScriptの相互運用により、JavaScriptからKotlinコードを使用することも可能です。詳細については、[JavaScriptでのKotlinコードの使用](wasm-js-interop.md#use-kotlin-code-in-javascript)を参照してください。

## フィードバックを送る

### Kotlin/Wasm フィードバック

* ![Slack](slack.svg){width=25}{type="joined"} Slack: [Slackの招待](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)を入手し、[#webassembly](https://kotlinlang.slack.com/archives/CDFP59223)チャンネルで開発者に直接フィードバックを送ってください。
* [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492)で問題を報告してください。

### Compose Multiplatform フィードバック

* ![Slack](slack.svg){width=25}{type="joined"} Slack: [#compose-web](https://slack-chats.kotlinlang.org/c/compose-web)公開チャンネルでフィードバックを送ってください。
* [GitHubで問題を報告してください](https://github.com/JetBrains/compose-multiplatform/issues)。

## 詳細情報

* この[YouTubeプレイリスト](https://kotl.in/wasm-pl)でKotlin/Wasmの詳細を確認してください。
* GitHubリポジトリにある[Kotlin/Wasmのサンプル](https://github.com/Kotlin/kotlin-wasm-examples)を探索してください。