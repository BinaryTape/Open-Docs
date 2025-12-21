[//]: # (title: 概要)

Kotlinは、Kotlin Multiplatformを介して、Web開発のために2つのアプローチを提供します。

* [JavaScriptベース (Kotlin/JSコンパイラを使用)](#kotlin-js)
* [WebAssemblyベース (Kotlin/Wasmコンパイラを使用)](#kotlin-wasm)

どちらのアプローチもWebアプリでコードを共有できますが、それぞれ異なるユースケースをサポートします。また、ターゲットブラウザのサポートなど、技術的な側面も異なります。

## Kotlin/JS

[Kotlin/JS](js-overview.md)は、コード、標準ライブラリ、およびサポートされているすべての依存関係をJSにトランスパイルすることで、JavaScript (JS) 環境でKotlinアプリを実行できるようにします。

Kotlin/JSで開発する際、アプリはブラウザまたはNode.js環境のいずれかで実行できます。

> Kotlin/JSターゲットの構成については、[Gradleプロジェクトの構成](gradle-configure-project.md#targeting-javascript)ガイドを参照してください。
>
{style="tip"}

### Kotlin/JSのユースケース

Kotlin/JSは、次の目標がある場合に適しています。

* [JavaScript/TypeScriptコードベースとビジネスロジックを共有する](#share-business-logic-with-a-javascript-typescript-codebase)。
* [Kotlinで非共有のWebアプリを構築する](#build-web-apps-with-kotlin-without-sharing-the-code)。

#### JavaScript/TypeScriptコードベースとビジネスロジックを共有する

ネイティブのJavaScript/TypeScriptアプリとKotlinコード (ドメインロジックやデータロジックなど) を共有する必要がある場合、Kotlin/JSターゲットは以下を提供します。

* JavaScript/TypeScriptとの直接的な相互運用性。
* 相互運用性におけるオーバーヘッドの最小化 (例えば、不必要なデータコピーを回避する)。これにより、共有コードはJSベースのワークフローにスムーズに統合されます。

#### コードを共有せずにKotlinでWebアプリを構築する

Webアプリが完全にKotlinで実装されており、他のプラットフォーム (iOS、Android、デスクトップ) と共有しないプロジェクトの場合、HTMLベースのソリューションはより優れた制御を提供します。

HTMLベースのソリューションはSEOとアクセシビリティを向上させます。また、ページ内検索やページ翻訳などの機能を含め、より優れたブラウザ統合を提供します。

HTMLベースのソリューションの場合、Kotlin/JSは複数のアプローチをサポートします。

* [Kobweb](https://kobweb.varabyte.com/)や[Kilua](https://kilua.dev/)のようなCompose HTMLベースのフレームワークを使用して、ComposeスタイルのアーキテクチャでUIを構築する。
* Kotlinラッパーを使用したReactベースのソリューションを使用して、[KotlinでReactコンポーネントを実装する](https://kotlinlang.org/docs/js-react.html)。

## Kotlin/Wasm
<primary-label ref="beta"/>

[](wasm-overview.md)はKotlinコードをWebAssembly (Wasm) にコンパイルし、Kotlinの要件を満たしながら、Wasmをサポートする環境やデバイスでアプリを実行できるようにします。

ブラウザでは、Kotlin/Wasmは[Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/)でWebアプリを構築できます。ブラウザ外では、[WebAssembly System Interface (WASI)](https://wasi.dev/)を使用してプラットフォームAPIにアクセスし、スタンドアロンのWasm仮想マシンで実行されます。

Kotlin/Wasmで開発する際、以下のターゲットを設定できます。

* **`wasmJs`**: ブラウザまたはNode.jsで実行するため。
* **`wasmWasi`**: Wasmtime、WasmEdgeなど、WASIをサポートするWasm環境で実行するため。

> Kotlin/Wasmターゲットの構成については、[Gradleプロジェクトの構成](gradle-configure-project.md#targeting-webassembly)ガイドを参照してください。
>
{style="tip"}

### Kotlin/Wasmのユースケース

複数のプラットフォーム間でロジックとUIの両方を共有したい場合は、Kotlin/Wasmを使用します。

#### Compose Multiplatformでクロスプラットフォームアプリを構築する

Webを含む複数のプラットフォーム間でロジックとUIの両方を共有したい場合、Kotlin/Wasmと[Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/)は、共有UIレイヤーを提供します。

* すべてのプラットフォームで一貫したUI実装を保証します。
* レスポンシブなアニメーションなど、Wasmを使用してレンダリングを改善し、UIの更新をスムーズにします。
* [WebAssembly Garbage Collection (WasmGC)](https://developer.chrome.com/blog/wasmgc)提案の最新バージョンをサポートしており、これにより、Kotlin/Wasmはすべての主要な最新ブラウザで実行できます。

## Webアプローチの選択

下の表は、ユースケースに基づいて推奨されるターゲットを要約しています。

| ユースケース | 推奨ターゲット | 説明 |
|---|---|---|
| ビジネスロジックを共有し、WebネイティブUIを使用する場合 | Kotlin/JS | JSとの直接的な相互運用と最小限のオーバーヘッドを提供します。 |
| UIとビジネスロジックの両方を共有する場合 | Kotlin/Wasm | [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/)によるレンダリングでより優れたパフォーマンスを提供します。 |
| 非共有UI | Kotlin/JS | [Kobweb](https://kobweb.varabyte.com/)、[Kilua](https://kilua.dev/)、または[React](https://kotlinlang.org/docs/js-react.html)のようなHTMLベースのフレームワークを使用してUIを構築でき、既存のJSエコシステムとツールを使用します。 |

> 適切なターゲットを選択する上でガイダンスが必要な場合は、私たちの[Slackコミュニティ](https://slack-chats.kotlinlang.org/c/multiplatform)に参加してください。プラットフォームの違い、パフォーマンスに関する考慮事項、特定のユースケースに対する推奨されるプラクティスについて質問できます。
>
{style="note"}

## Webターゲットの互換モード

Webアプリで互換モードを有効にすることで、すべてのブラウザでそのまま動作することを保証できます。このモードでは、最新のブラウザ向けにWasmでUIを構築し、古いブラウザはJSにフォールバックします。

互換モードは、`js`と`wasmJs`の両方のターゲットに対するクロスコンパイルによって実現されます。[Webの互換モードとその有効化方法に関する詳細情報はこちら](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-create-first-app.html#compatibility-mode-for-web-targets)。