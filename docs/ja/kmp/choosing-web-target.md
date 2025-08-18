# Kotlin Multiplatformプロジェクトに最適なウェブターゲットを選択する

Kotlin Multiplatform (KMP)は、ウェブ開発向けに2つのアプローチを提供します。

*   JavaScriptベース（Kotlin/JSコンパイラを使用）
*   WebAssemblyベース（Kotlin/Wasmコンパイラを使用）

どちらのオプションも、ウェブアプリケーションで共有コードを使用することを可能にします。
しかし、これらはパフォーマンス、相互運用性、アプリケーションサイズ、ターゲットブラウザのサポートなど、重要な点で異なります。
このガイドでは、それぞれのターゲットをいつ使用すべきか、そして適切な選択によって要件を満たす方法を説明します。

### クイックガイド

以下の表は、ユースケースに基づいて推奨されるターゲットをまとめたものです。

| ユースケース                      | 推奨ターゲット | 理由                                                                                                                                                                                                                                                           |
|-----------------------------------|------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ビジネスロジックの共有、ただしネイティブUI | JS                 | JavaScriptとの容易な相互運用性と最小限のオーバーヘッドを提供します。                                                                                                                                                                                               |
| UIとビジネスロジックの両方を共有    | Wasm               | [Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/)を使用したレンダリングで、より優れたパフォーマンスを提供します。                                                                                                                                                                                           |
| 共有できないUI                    | JS                 | [Kobweb](https://kobweb.varabyte.com/)、[Kilua](https://kilua.dev/)、[React](https://kotlinlang.org/docs/js-react.html)のようなHTMLベースのフレームワークを使用してUIを構築でき、既存のJSエコシステムとツールを活用できます。 |

## Kotlin/JSを選択する場合

Kotlin/JSは、以下の目標がある場合に優れたソリューションとなります。

*   [JavaScript/TypeScriptコードベースとビジネスロジックを共有する](#share-business-logic-with-a-javascript-typescript-codebase)
*   [コードを共有せずにKotlinでウェブアプリを構築する](#build-web-apps-with-kotlin-without-sharing-the-code)

### JavaScript/TypeScriptコードベースとビジネスロジックを共有する

Kotlinコードのチャンク（ドメインロジックやデータロジックなど）をネイティブなJavaScript/TypeScriptベースのアプリケーションと共有したい場合、
JSターゲットは以下のものを提供します。

*   JavaScript/TypeScriptとの容易な相互運用性。
*   相互運用性における最小限のオーバーヘッド（例えば、不要なデータコピーがないなど）。これにより、コードがJSベースのワークフローにシームレスに統合されます。

### コードを共有せずにKotlinでウェブアプリを構築する

Kotlinを使用してウェブアプリ全体を構築しようとしているが、
他のプラットフォーム（iOS、Android、またはデスクトップ）とコードを共有する意図がないチームにとって、HTMLベースのソリューションはより良い選択肢となる可能性があります。
これはSEOとアクセシビリティを向上させ、デフォルトでシームレスなブラウザ統合を提供します（例：「ページ内検索」機能やページの翻訳）。
この場合、Kotlin/JSはいくつかのオプションを提供します。以下を行うことができます。

*   [Kobweb](https://kobweb.varabyte.com/)や[Kilua](https://kilua.dev/)のようなCompose HTMLベースのフレームワークを使用して、
    お馴染みのCompose MultiplatformアーキテクチャでUIを構築します。
*   Kotlinラッパーを備えたReactベースのソリューションを活用し、[KotlinでReactコンポーネントを構築します](https://kotlinlang.org/docs/js-react.html)。

## Kotlin/Wasmを選択する場合

### Compose Multiplatformでクロスプラットフォームアプリを構築する

ウェブを含む複数のプラットフォーム間でロジックとUIの両方を共有したい場合、
Kotlin/Wasmと[Compose Multiplatform](https://www.jetbrains.com/compose-multiplatform/)の組み合わせが最適な方法です。

*   UIエクスペリエンスがプラットフォーム間でより一貫します。
*   Wasmを活用して、レンダリングの向上とスムーズで応答性の高いアニメーションを実現できます。
*   [WasmGC](https://developer.chrome.com/blog/wasmgc)のブラウザサポートが成熟し、
    Kotlin/Wasmはすべての主要なモダンブラウザでネイティブに近いパフォーマンスで実行できるようになりました。

古いブラウザバージョンのサポートを要件とするプロジェクトの場合、Compose Multiplatformの互換モードを使用できます。
モダンブラウザ向けにはWasmでUIを構築し、古いブラウザではJSに適切にフォールバックします。
プロジェクト内でWasmターゲットとJSターゲット間で共通ロジックを共有することも可能です。

>   まだどの道を選ぶべきか迷っていますか？ 私たちの[Slackコミュニティ](https://slack-chats.kotlinlang.org)に参加して、
>   適切なターゲットを選択するための主な違い、パフォーマンスに関する考慮事項、ベストプラクティスについて質問してください。
>
{style="note"}