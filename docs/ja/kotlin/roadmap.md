[//]: # (title: Kotlin ロードマップ)

<table>
    <tr>
        <td><strong>最終更新日</strong></td>
        <td><strong>2025年8月</strong></td>
    </tr>
    <tr>
        <td><strong>次回の更新</strong></td>
        <td><strong>2026年2月</strong></td>
    </tr>
</table>

Kotlin ロードマップへようこそ！JetBrains チームの優先事項をいち早くご紹介します。

## 主要な優先事項

このロードマップの目的は、全体像を提示することにあります。
以下は、私たちが提供に注力している最も重要な方向性である、主要な重点分野のリストです。

* **言語の進化**: 構文の変更よりもセマンティクス（意味論）を重視した有意義な言語改善により、Kotlin を実用的かつ表現力豊かな言語に保ちます。
* **マルチプラットフォーム**: 強固な iOS サポート、成熟した Web ターゲット、および信頼性の高い IDE ツーリングを備えた、現代的なマルチプラットフォーム・アプリの基盤を構築します。
* **特定のツールに依存しない（Staying agnostic）**: 開発者がどのようなツールやターゲットを使用していても、それをサポートします。
* **エコシステムのサポート**: Kotlin ライブラリ、ツール、フレームワークの開発および公開プロセスを簡素化します。

## サブシステム別の Kotlin ロードマップ

<!-- 私たちが取り組んでいる最大のプロジェクトを確認するには、[ロードマップの詳細](#roadmap-details) 表をご覧ください。 -->

ロードマップやその項目に関する質問やフィードバックがある場合は、[YouTrack チケット](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20) または Kotlin Slack の [#kotlin-roadmap](https://kotlinlang.slack.com/archives/C01AAJSG3V4) チャンネル（[招待をリクエスト](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）に投稿してください。

<!-- ### YouTrack ボード
問題トラッカー YouTrack の [ロードマップボード](https://youtrack.jetbrains.com/agiles/153-1251/current) をご覧ください。 ![YouTrack](youtrack-logo.png){width=30}{type="joined"}
-->

<table>
    <tr>
        <th>サブシステム</th>
        <th>現在の注力事項</th>
    </tr>
    <tr id="language">
        <td><strong>言語</strong></td>
        <td>
            <p><a href="kotlin-language-features-and-proposals.md">Kotlin 言語機能とプロポーザルの全リストを見る</a>。または、<a href="https://youtrack.jetbrains.com/issue/KT-54620">今後の言語機能に関する YouTrack の問題</a>をフォローしてください。</p>
        </td>
    </tr>
    <tr id="compiler">
        <td><strong>コンパイラ</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80304">Kotlin/Wasm: 新しいスレッドプロポーザルを使用したマルチスレッドサポートのプロトタイプ作成</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75371">JSpecify サポートの仕上げ</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75372">K1 コンパイラの非推奨化</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75370">Kotlin/Wasm (<code>wasm-js</code> ターゲット) を Beta に昇格</a></li>
            </list>
        </td>
    </tr>
    <tr id="multiplatform">
        <td><strong>マルチプラットフォーム</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80305">Swift Export でのコルーチンをサポート</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80308">Kotlin/JS: モダンな JavaScript へのコンパイル</a></li> 
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80310">Kotlin/JS: JavaScript への Kotlin 宣言のエクスポートの可能性を拡張</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80307">Kotlin/JS: Kotlin/JS のオンボーディング資料の改善</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71278">Concurrent Mark and Sweep (CMS) GC をデフォルトで有効化</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-68323">マルチプラットフォーム・ライブラリの次世代配布形式を実装</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64570" target="_blank">すべての Kotlin ターゲット間でインライン・セマンティクスを統一</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71279" target="_blank">klib アーティファクトの増分コンパイルをデフォルトで有効化</a></li>
            </list>
            <tip><p><a href="https://jb.gg/kmp-roadmap-2025" target="_blank">Kotlin Multiplatform 開発ロードマップ</a></p></tip>
         </td>
    </tr>
    <tr id="tooling">
        <td><strong>ツール</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80322" target="_blank">Kotlin LSP および VS Code のサポート</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTIJ-35208" target="_blank">Kotlin + JPA のエクスペリエンス向上</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80311" target="_blank">Gradle Project Isolation における Kotlin JS\WASM のサポート</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTNB-1133" target="_blank">Kotlin Notebooks: 新しいユースケースのサポート</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75374" target="_blank">IntelliJ IDEA での Kotlin/Wasm プロジェクトの開発エクスペリエンス向上</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75376" target="_blank">インポートのパフォーマンス向上</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-31316" target="_blank">IntelliJ IDEA K2 モードの完全リリース</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-76255" target="_blank">Build Tools API の設計</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71292" target="_blank">Declarative Gradle をサポートする Kotlin エコシステム・プラグインのリリース</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">Kotlin スクリプティングおよび <code>.gradle.kts</code> のエクスペリエンス向上</a></li>
            </list>
         </td>
    </tr>
    <tr id="ecosystem">
        <td><strong>エコシステム</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80323">KDoc のマシン読み取り可能な表現を実装</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80324">Kotlin Notebooks の安定化</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80327">Kotlin DataFrame 1.0 のリリース</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80328">Kandy 0.9 のリリース</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-12719" target="_blank">Unit 以外の値を返し、それが使用されていない Kotlin 関数に対するデフォルトの警告/エラーの導入</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71298" target="_blank">標準ライブラリ用の新しいマルチプラットフォーム API: Unicode およびコードポイントのサポート</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71300" target="_blank"><code>kotlinx-io</code> ライブラリの安定化</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71297" target="_blank">Kotlin 配布の UX 向上: コードカバレッジとバイナリ互換性の検証を追加</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64578" target="_blank"><code>kotlinx-datetime</code> を Beta に昇格</a></li>
            </list>
            <p><b>Ktor:</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-8316">Ktor Client および Server Application での OpenAPI 仕様のサポート</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-6622">Ktor の管理とオブザーバビリティ（観測可能性）の向上</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-7958">WebRTC クライアント</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-1501">ジェネレータープラグインとチュートリアルによる Ktor への gRPC サポートの追加</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-6026">Kubernetes ジェネレータープラグインの作成</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-6621">依存関係注入（DI）の使用をシンプルにする</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-7938">HTTP/3 サポート</a></li>
            </list>
            <p><b>Exposed:</b></p>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/EXPOSED-444">1.0.0 のリリース</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/EXPOSED-74">R2DBC サポートの追加</a></li>
            </list>
         </td>
    </tr>
</table>

> * このロードマップはチームが取り組んでいるすべての事項を網羅したリストではなく、最大のプロジェクトのみを記載しています。
> * 特定のバージョンで特定の機能や修正を提供することを約束するものではありません。
> * 私たちは進捗に合わせて優先事項を調整し、約 6 か月ごとにロードマップを更新します。
> 
{style="note"}

## 2025年2月以降の変更点

### 完了した項目

以前のロードマップから以下の項目を**完了**しました。

* ✅ マルチプラットフォーム: [Swift Export の最初のパブリックリリース](https://youtrack.jetbrains.com/issue/KT-64572)
* ✅ マルチプラットフォーム: [プロジェクトレベルでの Kotlin Multiplatform 依存関係の宣言をサポート](https://youtrack.jetbrains.com/issue/KT-71289)
* ✅ マルチプラットフォーム: [異なるプラットフォーム間での klib クロスコンパイルを安定化](https://youtrack.jetbrains.com/issue/KT-71290)
* ✅ マルチプラットフォーム: [Kotlin/JS: Compose フォールバックモードのための WasmJS と JS 間の共通ソースをサポート](https://youtrack.jetbrains.com/issue/KT-79394)
* ✅ ツール: [Kotlin ビルドレポートの改善](https://youtrack.jetbrains.com/issue/KT-60279)
* ✅ ツール: [Gradle DSL で安定したコンパイラ引数を公開](https://youtrack.jetbrains.com/issue/KT-55515)
* ✅ ツール: [Gradle Project Isolation をサポート](https://youtrack.jetbrains.com/issue/KT-54105)
* ✅ ツール: [Gradle への Kotlin/Native ツールチェーンの統合を改善](https://youtrack.jetbrains.com/issue/KT-64577)
* ✅ ツール: [Kotlin Notebook: アクセスの円滑化とエクスペリエンスの向上](https://youtrack.jetbrains.com/issue/KTNB-898)
* ✅ ツール: [XCFrameworks でのリソースのサポート](https://youtrack.jetbrains.com/issue/KT-75377)
* ✅ エコシステム: [Dokka HTML 出力の UI を改良](https://youtrack.jetbrains.com/issue/KT-71295)
* ✅ エコシステム: [バックエンドアプリケーションのプロジェクト構造化をシンプルにする](https://youtrack.jetbrains.com/issue/KTOR-7158)
* ✅ エコシステム: [CLI ジェネレーターを SNAP に公開](https://youtrack.jetbrains.com/issue/KTOR-3937)
* ✅ エコシステム: [依存関係注入（DI）の使用をシンプルにする](https://youtrack.jetbrains.com/issue/KTOR-6621)

### 新規項目

ロードマップに以下の項目を**追加**しました。

* 🆕 コンパイラ: [Kotlin/Wasm: 新しいスレッドプロポーザルを使用したマルチスレッドサポートのプロトタイプ作成](https://youtrack.jetbrains.com/issue/KT-80304)
* 🆕 マルチプラットフォーム: [Swift Export でのコルーチンをサポート](https://youtrack.jetbrains.com/issue/KT-80305)
* 🆕 マルチプラットフォーム: [Kotlin/JS: モダンな JavaScript へのコンパイル](https://youtrack.jetbrains.com/issue/KT-80308)
* 🆕 マルチプラットフォーム: [Kotlin/JS: JavaScript への Kotlin 宣言のエクスポートの可能性を拡張](https://youtrack.jetbrains.com/issue/KT-80310)
* 🆕 マルチプラットフォーム: [Kotlin/JS: Kotlin/JS のオンボーディング資料の改善](https://youtrack.jetbrains.com/issue/KT-80307)
* 🆕 ツール: [Kotlin LSP および VS Code のサポート](https://youtrack.jetbrains.com/issue/KT-80322)
* 🆕 ツール: [Kotlin + JPA のエクスペリエンス向上](https://youtrack.jetbrains.com/issue/KTIJ-35208)
* 🆕 ツール: [Gradle Project Isolation における Kotlin JS\WASM のサポート](https://youtrack.jetbrains.com/issue/KT-80311)
* 🆕 ツール: [Kotlin Notebooks: 新しいユースケースのサポート](https://youtrack.jetbrains.com/issue/KTNB-1133)
* 🆕 エコシステム: [KDoc のマシン読み取り可能な表現を実装](https://youtrack.jetbrains.com/issue/KT-80323)
* 🆕 エコシステム: [Kotlin Notebooks の安定化](https://youtrack.jetbrains.com/issue/KT-80324)
* 🆕 エコシステム: [Kotlin DataFrame 1.0 のリリース](https://youtrack.jetbrains.com/issue/KT-80327)
* 🆕 エコシステム: [Kandy 0.9 のリリース](https://youtrack.jetbrains.com/issue/KT-80328)
* 🆕 エコシステム: [Ktor Client および Server Application での OpenAPI 仕様のサポート](https://youtrack.jetbrains.com/issue/KTOR-8316)
* 🆕 エコシステム: [Ktor の管理とオブザーバビリティ（観測可能性）の向上](https://youtrack.jetbrains.com/issue/KTOR-6622)
* 🆕 エコシステム: [WebRTC クライアント](https://youtrack.jetbrains.com/issue/KTOR-7958)

### 削除された項目

ロードマップから以下の項目を**削除**しました。

* ❌ コンパイラ: [Kotlin/Wasm: ライブラリの `wasm-wasi` ターゲットを WASI Preview 2 に切り替え](https://youtrack.jetbrains.com/issue/KT-64568)
* ❌ コンパイラ: [Kotlin/Wasm: コンポーネントモデルのサポート](https://youtrack.jetbrains.com/issue/KT-64569)
* ❌ エコシステム: [Snap への公開](https://youtrack.jetbrains.com/issue/KTOR-3937)

> 一部の項目はロードマップから削除されましたが、完全に中止されたわけではありません。場合によっては、以前のロードマップ項目を現在の項目に統合しました。
>
{style="note"}