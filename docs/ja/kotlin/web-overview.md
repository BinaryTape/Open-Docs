[//]: # (title: 概要)

Kotlinは、Kotlin Multiplatformを通じて、ウェブ開発のための2つのアプローチを提供しています：

* [JavaScriptベース（Kotlin/JSコンパイラを使用）](#kotlin-js)
* [WebAssemblyベース（Kotlin/Wasmコンパイラを使用）](#kotlin-wasm)

どちらのアプローチでもウェブアプリ内でコードを共有できますが、それぞれ異なるユースケースをサポートしています。
また、ターゲットブラウザのサポートなど、技術的な側面でも異なります。

## Kotlin/JS

[Kotlin/JS](js-overview.md)は、コード、標準ライブラリ、およびサポートされているすべての依存関係をJSにトランスパイルすることで、JavaScript（JS）環境でKotlinアプリを実行できるようにします。

Kotlin/JSで開発する場合、ブラウザまたはNode.js環境のいずれかでアプリを実行できます。

> Kotlin/JSターゲットの設定に関する詳細は、[Gradleプロジェクトの構成](gradle-configure-project.md#targeting-javascript)ガイドを参照してください。
>
{style="tip"}

### Kotlin/JSのユースケース

Kotlin/JSは、以下を目的とする場合に適しています：

* [JavaScript/TypeScriptのコードベースとビジネスロジックを共有する](#share-business-logic-with-a-javascript-typescript-codebase)。
* [Kotlinで共有しないウェブアプリを構築する](#build-web-apps-with-kotlin-without-sharing-the-code)。

#### JavaScript/TypeScriptのコードベースとビジネスロジックを共有する

Kotlinコード（ドメインロジックやデータロジックなど）をネイティブのJavaScript/TypeScriptアプリと共有する必要がある場合、Kotlin/JSターゲットは以下を提供します：

* JavaScript/TypeScriptとの直接的な相互運用性。
* 相互運用における最小限のオーバーヘッド（例：不要なデータコピーの回避）。
  これにより、共有コードをJSベースのワークフローにスムーズに統合できます。

#### コードを共有せずにKotlinでウェブアプリを構築する

ウェブアプリが完全にKotlinで実装され、他のプラットフォーム（iOS、Android、またはデスクトップ）と共有しないプロジェクトの場合、HTMLベースのソリューションの方がより優れた制御を提供できます。

HTMLベースのソリューションは、SEOとアクセシビリティを向上させます。
また、ページ内検索やページ翻訳などの機能を含む、より優れたブラウザ統合を提供します。

HTMLベースのソリューションにおいて、Kotlin/JSは複数のアプローチをサポートしています：

* [Kobweb](https://kobweb.varabyte.com/)や[Kilua](https://kilua.dev/)などのCompose HTMLベースのフレームワークを使用して、ComposeスタイルのアーキテクチャでUIを構築する。
* Kotlinラッパーを備えたReactベースのソリューションを使用して、[KotlinでReactコンポーネント](https://kotlinlang.org/docs/js-react.html)を実装する。

## Kotlin/Wasm
<primary-label ref="beta"/> 

[Kotlin/Wasm](wasm-overview.md)は、KotlinコードをWebAssembly (Wasm)にコンパイルし、Kotlinの要件を満たしながら、Wasmをサポートする環境やデバイス間でアプリを実行できるようにします。

ブラウザでは、Kotlin/Wasmを使用して[Compose Multiplatform](https://kotlinlang.org/compose-multiplatform/)でウェブアプリを構築できます。
ブラウザ以外では、スタンドアロンのWasm仮想マシンで実行され、[WebAssembly System Interface (WASI)](https://wasi.dev/)を使用してプラットフォームAPIにアクセスします。

Kotlin/Wasmで開発する場合、以下のターゲットを指定できます：

* **`wasmJs`**: ブラウザまたはNode.jsで実行する場合。
* **`wasmWasi`**: WasmtimeやWasmEdgeなど、WASIをサポートするWasm環境で実行する場合。

> Kotlin/Wasmターゲットの設定に関する詳細は、[Gradleプロジェクトの構成](gradle-configure-project.md#targeting-webassembly)ガイドを参照してください。
>
{style="tip"}

### Kotlin/Wasmのユースケース

ロジックとUIの両方を複数のプラットフォーム間で共有したい場合は、Kotlin/Wasmを使用してください。

#### Compose Multiplatformでクロスプラットフォームアプリを構築する

ウェブを含む複数のプラットフォーム間でロジックとUIの両方を共有したい場合、[Compose Multiplatform](https://kotlinlang.org/compose-multiplatform/)を備えたKotlin/Wasmは共有UIレイヤーを提供します：

* すべてのプラットフォームで一貫したUI実装を保証します。
* レンダリングの向上と、レスポンシブなアニメーションなどのよりスムーズなUI更新のためにWasmを使用します。
* 最新バージョンの[WebAssembly Garbage Collection (WasmGC)](https://developer.chrome.com/blog/wasmgc)プロポーザルをサポートしており、これによりKotlin/Wasmはすべての主要なモダンブラウザで動作します。

## ウェブアプローチの選択

以下の表は、ユースケースに基づいた推奨ターゲットをまとめたものです：

| ユースケース | 推奨ターゲット | 説明 |
|-------------------------------------------------|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ビジネスロジックを共有するが、ウェブネイティブなUIを使用する | Kotlin/JS          | JSとの簡単な相互運用性と最小限のオーバーヘッドを提供します。 |
| UIとビジネスロジックの両方を共有する | Kotlin/Wasm        | [Compose Multiplatform](https://kotlinlang.org/compose-multiplatform/)によるレンダリングで、より高いパフォーマンスを提供します。 |
| 共有しないUI | Kotlin/JS          | 既存のJSエコシステムやツールを活用し、[Kobweb](https://kobweb.varabyte.com/)、[Kilua](https://kilua.dev/)、[React](https://kotlinlang.org/docs/js-react.html)などのHTMLベースのフレームワークでUIを構築できます。 |

> 適切なターゲットの選択に関するガイダンスが必要な場合は、[Slackコミュニティ](https://slack-chats.kotlinlang.org/c/multiplatform)に参加してください。
> プラットフォームの違い、パフォーマンスに関する考慮事項、特定のユースケースにおける推奨プラクティスについて質問できます。
>
{style="note"}

## ウェブターゲットの互換モード

ウェブアプリの互換モードを有効にすると、すべてのブラウザでそのまま動作するようにできます。
このモードでは、モダンブラウザ向けにはWasmでUIを構築し、古いブラウザではJSにフォールバックさせることができます。

互換モードは、`js`と`wasmJs`の両方のターゲットに対するクロスコンパイルを通じて実現されます。
[ウェブの互換モードの詳細と有効化の方法についてはこちらを参照してください](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-create-first-app.html#compatibility-mode-for-web-targets)。