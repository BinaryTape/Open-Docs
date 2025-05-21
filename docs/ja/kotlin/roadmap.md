---
title: Kotlinロードマップ
---
<table>
<tr>
<td>
<strong>Last modified on</strong>
</td>
<td>
<strong>February 2025</strong>
</td>
</tr>
<tr>
<td>
<strong>Next update</strong>
</td>
<td>
<strong>August 2025</strong>
</td>
</tr>
</table>

Kotlinロードマップへようこそ！JetBrainsチームの優先事項をいち早くご紹介します。

## 主要な優先事項

このロードマップの目的は、全体像をお伝えすることです。
ここでは、私たちが重点的に取り組んでいる主要な分野をリストアップします。

* **言語の進化**: より効率的なデータ処理、抽象化の強化、明確なコードによるパフォーマンスの向上。
* **Kotlin Multiplatform**: KotlinからSwiftへの直接エクスポートのリリース、ビルド設定の合理化、マルチプラットフォームライブラリの作成の簡素化。
* **サードパーティのエコシステム作成者の体験**: Kotlinライブラリ、ツール、フレームワークの開発と公開プロセスの簡素化。

## サブシステム別のKotlinロードマップ

<!-- To view the biggest projects we're working on, see the [Roadmap details](#roadmap-details) table. -->

ロードマップまたはその項目についてご質問やフィードバックがある場合は、[YouTrack tickets](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20)またはKotlin Slackの[#kotlin-roadmap](https://kotlinlang.slack.com/archives/C01AAJSG3V4)チャンネル ([招待をリクエスト](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)) にご自由に投稿してください。

<!-- ### YouTrack board
Visit the [roadmap board in our issue tracker YouTrack](https://youtrack.jetbrains.com/agiles/153-1251/current) ![YouTrack](youtrack-logo.png){width=30}{type="joined"}
-->
<table>
<tr>
        <th>Subsystem</th>
        <th>In focus now</th>
</tr>
<tr id="language">
<td>
<strong>Language</strong>
</td>
<td>

<p>
   Kotlinの言語機能と提案の<a href="kotlin-language-features-and-proposals">完全なリストを見る</a>か、今後の言語機能に関する<a href="https://youtrack.jetbrains.com/issue/KT-54620">YouTrack issue</a>をフォローしてください。
</p>
</td>
</tr>
<tr id="compiler">
<td>
<strong>Compiler</strong>
</td>
<td>
<list>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75371">JSpecifyサポートの最終決定</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75372">K1コンパイラの非推奨化</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75370">Kotlin/Wasm (`wasm-js` target) をベータ版に昇格</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-64568" target="_blank">Kotlin/Wasm: ライブラリの `wasm-wasi` target を WASI Preview 2 に切り替える</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-64569" target="_blank">Kotlin/Wasm: Component Modelのサポート</a></li>
</list>
</td>
</tr>
<tr id="multiplatform">
<td>
<strong>Multiplatform</strong>
</td>
<td>
<list>
<li><a href="https://youtrack.jetbrains.com/issue/KT-64572">Swift Exportの最初のパブリックリリース</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71278">Concurrent Mark and Sweep (CMS) GCをデフォルトで有効にする</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71290">異なるプラットフォームでのklibクロスコンパイルを安定化させる</a></li> 
<li><a href="https://youtrack.jetbrains.com/issue/KT-71281">マルチプラットフォームライブラリの次世代配信フォーマットを実装する</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71289">プロジェクトレベルでKotlin Multiplatformの依存関係を宣言するサポート</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-64570" target="_blank">すべてのKotlin target間でインラインのセマンティクスを統一する</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71279" target="_blank">klibアーティファクトのインクリメンタルコンパイルをデフォルトで有効にする</a></li>
</list>
            <tip><p>
   <a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-roadmap.html" target="_blank">Kotlin Multiplatform development roadmap</a>
</p></tip>
</td>
</tr>
<tr id="tooling">
<td>
<strong>Tooling</strong>
</td>
<td>
<list>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75374" target="_blank">IntelliJ IDEAでのKotlin/Wasmプロジェクトの開発体験を向上させる</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75376" target="_blank">インポートのパフォーマンスを向上させる</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75377" target="_blank">XCFrameworksでのリソースをサポートする</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTNB-898" target="_blank">Kotlin Notebook: よりスムーズなアクセスと改善された体験</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KTIJ-31316" target="_blank">IntelliJ IDEA K2 modeの完全リリース</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71286" target="_blank">Build Tools APIの設計</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71292" target="_blank">Declarative GradleをサポートするKotlin Ecosystem Plugin</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-54105" target="_blank">Gradleプロジェクトの分離をサポート</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-64577" target="_blank">Kotlin/NativeツールチェーンのGradleへの統合を改善する</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-60279" target="_blank">Kotlinビルドレポートを改善する</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-55515" target="_blank">Gradle DSLで安定したコンパイラ引数を公開する</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">Kotlinスクリプトと`.gradle.kts`での体験を改善する</a></li>
</list>
</td>
</tr>
<tr id="library-ecosystem">
<td>
<strong>Library ecosystem</strong>
</td>
<td>

<p>
   <b>Library ecosystem ロードマップの項目:</b>
</p>
<list>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71295" target="_blank">Dokka HTML出力UIの改良</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-12719" target="_blank">未使用の非ユニット値を返すKotlin関数のデフォルトの警告/エラーを導入</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71298" target="_blank">標準ライブラリの新しいマルチプラットフォームAPI: Unicodeとコードポイントのサポート</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71300" target="_blank">`kotlinx-io`ライブラリを安定化させる</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-71297" target="_blank">KotlinディストリビューションUXの改善: コードカバレッジとバイナリ互換性の検証を追加</a></li>
<li><a href="https://youtrack.jetbrains.com/issue/KT-64578" target="_blank">`kotlinx-datetime`をベータ版に昇格させる</a></li>
</list>
<p>
   <b>Ktor:</b>
</p>
<list>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-1501">ジェネレータープラグインとチュートリアルを使用して、gRPCサポートをKtorに追加する</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-7158">バックエンドアプリケーションのプロジェクト構成をシンプルにする</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-3937">CLIジェネレーターをSNAPに公開する</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-6026">Kubernetes Generator Pluginを作成する</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-6621">Dependency Injectionの使用をシンプルにする</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-7938">HTTP/3のサポート</a></li>
</list>
<p>
   <b>Exposed:</b>
</p>
<list>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-444">1.0.0をリリースする</a></li>
<li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-74">R2DBCのサポートを追加する</a></li>
</list>
</td>
</tr>
</table>
:::note
* このロードマップは、チームが取り組んでいるすべてのことの網羅的なリストではなく、最大のプロジェクトのみです。
* 特定のバージョンで特定の機能や修正を提供することを保証するものではありません。
* 今後の状況に合わせて優先順位を調整し、ロードマップを約6か月ごとに更新します。

:::

## 2024年9月からの変更点

### 完了した項目

以前のロードマップから、以下の項目を**完了**しました。

* ✅ Compiler: [Androidでのインライン関数のデバッグのサポート](https://youtrack.jetbrains.com/issue/KT-60276)
* ✅ Compiler: [コンパイラ診断の品質を向上させる](https://youtrack.jetbrains.com/issue/KT-71275)
* ✅ Multiplatform: [KotlinでのXcode 16のサポート](https://youtrack.jetbrains.com/issue/KT-71287)
* ✅ Multiplatform: [Kotlin Gradle Pluginの公開されているAPIリファレンスを公開する](https://youtrack.jetbrains.com/issue/KT-71288)
* ✅ Tooling: [Kotlin/Wasm targetのすぐに使えるデバッグ体験を提供する](https://youtrack.jetbrains.com/issue/KT-71276)
* ✅ Library ecosystem: [Dokkatooに基づく新しいDokka Gradle pluginを実装する](https://youtrack.jetbrains.com/issue/KT-71293)
* ✅ Library ecosystem: [標準ライブラリの新しいマルチプラットフォームAPI: Atomics](https://youtrack.jetbrains.com/issue/KT-62423)
* ✅ Library ecosystem: [Library authors’ guidelinesを拡張する](https://youtrack.jetbrains.com/issue/KT-71299)

### 新しい項目

ロードマップに以下の項目を**追加**しました。

* 🆕 Compiler: [JSpecifyサポートの最終決定](https://youtrack.jetbrains.com/issue/KT-75371)
* 🆕 Compiler: [K1コンパイラの非推奨化](https://youtrack.jetbrains.com/issue/KT-75372)
* 🆕 Compiler: [Kotlin/Wasm (`wasm-js` target) をベータ版に昇格](https://youtrack.jetbrains.com/issue/KT-75370)
* 🆕 Tooling: [IntelliJ IDEAでのKotlin/Wasmプロジェクトの開発体験を向上させる](https://youtrack.jetbrains.com/issue/KT-75374)
* 🆕 Tooling: [インポートのパフォーマンスを向上させる](https://youtrack.jetbrains.com/issue/KT-75376)
* 🆕 Tooling: [XCFrameworksでのリソースをサポートする](https://youtrack.jetbrains.com/issue/KT-75377)
* 🆕 Tooling: [Kotlin Notebookでのよりスムーズなアクセスと改善された体験](https://youtrack.jetbrains.com/issue/KTNB-898)
* 🆕 Ktor: [ジェネレータープラグインとチュートリアルを使用して、gRPCサポートをKtorに追加する](https://youtrack.jetbrains.com/issue/KTOR-1501)
* 🆕 Ktor: [バックエンドアプリケーションのプロジェクト構成をシンプルにする](https://youtrack.jetbrains.com/issue/KTOR-7158)
* 🆕 Ktor: [CLIジェネレーターをSNAPに公開する](https://youtrack.jetbrains.com/issue/KTOR-3937)
* 🆕 Ktor: [Kubernetes Generator Pluginを作成する](https://youtrack.jetbrains.com/issue/KTOR-6026)
* 🆕 Ktor: [Dependency Injectionの使用をシンプルにする](https://youtrack.jetbrains.com/issue/KTOR-6621)
* 🆕 Ktor: [HTTP/3のサポート](https://youtrack.jetbrains.com/issue/KTOR-7938)
* 🆕 Exposed: [1.0.0をリリースする](https://youtrack.jetbrains.com/issue/EXPOSED-444)
* 🆕 Exposed: [R2DBCのサポートを追加する](https://youtrack.jetbrains.com/issue/EXPOSED-74)

<!--
### Removed items

We've **removed** the following items from the roadmap:

* ❌ Compiler: [Improve the quality of compiler diagnostics](https://youtrack.jetbrains.com/issue/KT-71275)

> Some items were removed from the roadmap but not dropped completely. In some cases, we've merged previous roadmap items
> with the current ones.
>
{style="note"}
-->

### 進行中の項目

以前に特定された他のすべてのロードマップ項目は進行中です。アップデートについては、[YouTrack tickets](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20)を確認してください。