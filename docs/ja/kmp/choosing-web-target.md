# Kotlin Multiplatformプロジェクトにおける適切なウェブターゲットの選択

Kotlin Multiplatform (KMP) は、ウェブ開発向けに2つのアプローチを提供します。

*   JavaScriptベース (Kotlin/JSコンパイラを使用)
*   WebAssemblyベース (Kotlin/Wasmコンパイラを使用)

どちらのオプションも、ウェブアプリケーションで共有コードを使用できます。
ただし、パフォーマンス、相互運用性、アプリケーションサイズ、ターゲットブラウザのサポートなど、重要な点で異なります。
このガイドでは、それぞれのターゲットをいつ使用すべきか、そして適切な選択によって要件を満たす方法を説明します。

### クイックガイド

以下の表は、ユースケースに基づいて推奨されるターゲットをまとめたものです。

| ユースケース                                 | 推奨ターゲット | 理由                                                                                                                                                                                                                     |
| :----------------------------------------- | :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ビジネスロジックは共有し、UIはネイティブ       | JS               | JavaScriptとの直接的な相互運用性を提供し、オーバーヘッドを最小限に抑えます。                                                                                                                                           |
| UIとビジネスロジックの両方を共有             | Wasm             | [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/)によるレンダリングでより良いパフォーマンスを提供します。                                                                                                      |
| 共有しないUI                               | JS               | [Kobweb](https://kobweb.varabyte.com/)、[Kilua](https://kilua.dev/)、[React](https://kotlinlang.org/docs/js-react.html)のようなHTMLベースのフレームワークでUIを構築でき、既存のJSエコシステムとツールを活用します。 |

## Kotlin/JSを選択するケース

Kotlin/JSは、以下の目標を達成する場合に優れたソリューションを提供します。

*   [JavaScript/TypeScriptのコードベースとビジネスロジックを共有する](#share-business-logic-with-a-javascript-typescript-codebase)
*   [Kotlinで共有しないウェブアプリを構築する](#build-web-apps-with-kotlin-without-sharing-the-code)

### JavaScript/TypeScriptのコードベースとビジネスロジックを共有する

ネイティブのJavaScript/TypeScriptベースのアプリケーションと、Kotlinコードの一部（ドメインロジックやデータロジックなど）を共有したい場合、
JSターゲットは以下を提供します。

*   JavaScript/TypeScriptとの直接的な相互運用性。
*   相互運用における最小限のオーバーヘッド（例えば、不要なデータコピーなし）。これにより、コードがJSベースのワークフローにシームレスに統合されます。

### Kotlinで共有しないウェブアプリを構築する

Kotlinを使用してウェブアプリ全体を構築しようとしているチームにとって、
ただし、他のプラットフォーム（iOS、Android、デスクトップ）と共有する意図がない場合、HTMLベースのソリューションがより良い選択肢となる可能性があります。
これはSEOとアクセシビリティを向上させ、デフォルトでシームレスなブラウザ統合（「ページ内検索」機能やページの翻訳など）を提供します。
この場合、Kotlin/JSはいくつかの選択肢を提供します。

*   [Kobweb](https://kobweb.varabyte.com/)や[Kilua](https://kilua.dev/)などのCompose HTMLベースのフレームワークを使用して、使い慣れたCompose MultiplatformアーキテクチャでUIを構築します。
*   Kotlinラッパーを備えたReactベースのソリューションを活用し、[KotlinでReactコンポーネント](https://kotlinlang.org/docs/js-react.html)を構築します。

## Kotlin/Wasmを選択するケース

### Compose Multiplatformでクロスプラットフォームアプリを構築する

ウェブを含む複数のプラットフォームでロジックとUIの両方を共有したい場合、
[Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/)と組み合わせたKotlin/Wasmが最適な方法です。

*   UIエクスペリエンスはプラットフォーム間でより一貫性があります。
*   Wasmを活用して、レンダリングの改善と、スムーズで応答性の高いアニメーションを実現できます。
*   [WasmGC](https://developer.chrome.com/blog/wasmgc)のブラウザサポートは成熟し、Kotlin/Wasmをすべての主要なモダンブラウザでネイティブに近いパフォーマンスで実行できるようになりました。

古いブラウザバージョンのサポート要件があるプロジェクトでは、Compose Multiplatformの互換モードを使用できます。モダンブラウザではWasmでUIを構築し、古いブラウザではJSに適切にフォールバックします。
プロジェクト内でWasmターゲットとJSターゲットの間で共通ロジックを共有することもできます。

> どちらのルートを選択すべきかまだ迷っていますか？ [Slackコミュニティ](https://slack-chats.kotlinlang.org)に参加して、主要な違い、パフォーマンスに関する考慮事項、適切なターゲットを選択するためのベストプラクティスについて質問してください。
>
{style="note"}