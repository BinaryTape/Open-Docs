[//]: # (title: Kotlinロードマップ)

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

Kotlinロードマップへようこそ！JetBrainsチームの優先事項をいち早くご紹介します。

## 主要な優先事項

このロードマップの目的は、全体像を把握していただくことです。
以下は、私たちが提供に注力している最も重要な方向性である、主要な重点分野のリストです。

*   **言語の進化**: 構文の変更よりもセマンティクスを重視する、有意義な言語改善によって、Kotlinを実用的かつ表現豊かな状態に保ちます。
*   **マルチプラットフォーム**: 堅固なiOSサポート、成熟したWebターゲット、信頼性の高いIDEツールによって、最新のマルチプラットフォームアプリの基盤を構築します。
*   **依存しないこと**: 開発者がどのようなツールやターゲットを使用していてもサポートします。
*   **エコシステムのサポート**: Kotlinライブラリ、ツール、フレームワークの開発および公開プロセスを簡素化します。

## サブシステム別Kotlinロードマップ

<!-- To view the biggest projects we're working on, see the [Roadmap details](#roadmap-details) table. -->

ロードマップやその項目に関するご質問やフィードバックは、[YouTrackチケット](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20)にご投稿いただくか、Kotlin Slackの[#kotlin-roadmap](https://kotlinlang.slack.com/archives/C01AAJSG3V4)チャンネル（[招待のリクエスト](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)）までお寄せください。

<!-- ### YouTrack board
Visit the [roadmap board in our issue tracker YouTrack](https://youtrack.jetbrains.com/agiles/153-1251/current) ![YouTrack](youtrack-logo.png){width=30}{type="joined"}
-->

<table>
    <tr>
        <th>サブシステム</th>
        <th>現在の注力分野</th>
    </tr>
    <tr id="language">
        <td><strong>言語</strong></td>
        <td>
            <p><a href="kotlin-language-features-and-proposals.md">Kotlin言語の機能と提案の全リスト</a>を参照するか、<a href="https://youtrack.jetbrains.com/issue/KT-54620">今後の言語機能に関するYouTrackイシュー</a>をフォローしてください</p>
        </td>
    </tr>
    <tr id="compiler">
        <td><strong>コンパイラ</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80304">Kotlin/Wasm: 新しいスレッド提案を使用したマルチスレッドサポートのプロトタイプ作成</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75371">JSpecifyサポートの最終化</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75372">K1コンパイラの非推奨化</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75370">Kotlin/Wasm (<code>wasm-js</code>ターゲット) をベータ版に昇格</a></li>
            </list>
        </td>
    </tr>
    <tr id="multiplatform">
        <td><strong>マルチプラットフォーム</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80305">Swift Exportでのコルーチンサポート</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80308">Kotlin/JS: 最新のJavaScriptへのコンパイル</a></li> 
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80310">Kotlin/JS: Kotlin宣言をJavaScriptにエクスポートする可能性を拡張</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80307">Kotlin/JS: Kotlin/JSのオンボーディング資料を改善</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71278">Concurrent Mark and Sweep (CMS) GCをデフォルトで有効化</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-68323">次世代のマルチプラットフォームライブラリ配布フォーマットを実装</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64570" target="_blank">すべてのKotlinターゲット間でインラインセマンティクスを統一</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71279" target="_blank">klibアーティファクトのインクリメンタルコンパイルをデフォルトで有効化</a></li>
            </list>
            <tip><p><a href="https://jb.gg/kmp-roadmap-2025" target="_blank">Kotlin Multiplatform開発ロードマップ</a></p></tip>
         </td>
    </tr>
    <tr id="tooling">
        <td><strong>ツール</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80322" target="_blank">Kotlin LSPとVS Codeのサポート</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTIJ-35208" target="_blank">Kotlin + JPAエクスペリエンスを改善</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80311" target="_blank">Gradleプロジェクト分離でのKotlin JS\WASMのサポート</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTNB-1133" target="_blank">Kotlin Notebooks: 新しいユースケースをサポート</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75374" target="_blank">IntelliJ IDEAにおけるKotlin/Wasmプロジェクトの開発体験を向上</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75376" target="_blank">インポートのパフォーマンスを向上</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-31316" target="_blank">IntelliJ IDEA K2モードの完全リリース</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-76255" target="_blank">ビルドツールAPIの設計</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71292" target="_blank">宣言型GradleをサポートするKotlinエコシステムプラグイン</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">Kotlinスクリプトと<code>.gradle.kts</code>の使用体験を向上</a></li>
            </list>
         </td>
    </tr>
    <tr id="ecosystem">
        <td><strong>エコシステム</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80323">KDocの機械可読表現を実装</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80324">Kotlin Notebooksを安定化</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80327">Kotlin DataFrame 1.0をリリース</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80328">Kandy 0.9をリリース</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-12719" target="_blank">非ユニット値を返すKotlin関数の未使用に対するデフォルトの警告/エラーを導入</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71298" target="_blank">標準ライブラリ用の新しいマルチプラットフォームAPI: Unicodeとコードポイントのサポート</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71300" target="_blank"><code>kotlinx-io</code>ライブラリを安定化</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71297" target="_blank">Kotlin配布のUXを改善: コードカバレッジとバイナリ互換性検証を追加</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64578" target="_blank"><code>kotlinx-datetime</code>をベータ版に昇格</a></li>
            </list>
            <p><b>Ktor:</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-8316">Ktor ClientおよびServerアプリケーション向けのOpenAPI仕様のサポート</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-6622">Ktorの管理と可観測性を改善</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-7958">WebRTCクライアント</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-1501">ジェネレータプラグインとチュートリアルによるKtorへのgRPCサポート追加</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-6026">Kubernetesジェネレータプラグインの作成</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-6621">依存性注入の使用をシンプルに</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-7938">HTTP/3サポート</a></li>
            </list>
            <p><b>Exposed:</b></p>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/EXPOSED-444">1.0.0のリリース</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/EXPOSED-74">R2DBCサポートの追加</a></li>
            </list>
         </td>
    </tr>
</table>

> * このロードマップは、チームが取り組んでいるすべてのことの網羅的なリストではなく、最大のプロジェクトのみを記載しています。
> * 特定のバージョンで特定の機能や修正を提供することを保証するものではありません。
> * 私たちは進捗に応じて優先順位を調整し、約6ヶ月ごとにロードマップを更新します。
> 
{style="note"}

## 2025年2月からの変更点

### 完了した項目

前回のロードマップから以下の項目を**完了**しました。

*   ✅ マルチプラットフォーム: [Swift Exportの初回パブリックリリース](https://youtrack.jetbrains.com/issue/KT-64572)
*   ✅ マルチプラットフォーム: [プロジェクトレベルでのKotlin Multiplatform依存関係の宣言をサポート](https://youtrack.jetbrains.com/issue/KT-71289)
*   ✅ マルチプラットフォーム: [異なるプラットフォーム間でのklibクロスコンパイルを安定化](https://youtrack.jetbrains.com/issue/KT-71290)
*   ✅ マルチプラットフォーム: [Kotlin/JS: Composeフォールバックモード向けのWasmJSとJS間の共通ソースをサポート](https://youtrack.jetbrains.com/issue/KT-79394)
*   ✅ ツール: [Kotlinビルドレポートを改善](https://youtrack.jetbrains.com/issue/KT-60279)
*   ✅ ツール: [Gradle DSLで安定したコンパイラ引数を公開](https://youtrack.jetbrains.com/issue/KT-55515)
*   ✅ ツール: [Gradleプロジェクト分離をサポート](https://youtrack.jetbrains.com/issue/KT-54105)
*   ✅ ツール: [Kotlin/NativeツールチェーンのGradleへの統合を改善](https://youtrack.jetbrains.com/issue/KT-64577)
*   ✅ ツール: [Kotlin Notebook: よりスムーズなアクセスと体験の向上](https://youtrack.jetbrains.com/issue/KTNB-898)
*   ✅ ツール: [XCFrameworksでのリソースをサポート](https://youtrack.jetbrains.com/issue/KT-75377)
*   ✅ エコシステム: [Dokka HTML出力UIを洗練](https://youtrack.jetbrains.com/issue/KT-71295)
*   ✅ エコシステム: [バックエンドアプリケーションのプロジェクト構造をシンプルに](https://youtrack.jetbrains.com/issue/KTOR-7158)
*   ✅ エコシステム: [CLIジェネレータをSNAPに公開](https://youtrack.jetbrains.com/issue/KTOR-3937)
*   ✅ エコシステム: [依存性注入の使用をシンプルに](https://youtrack.jetbrains.com/issue/KTOR-6621)

### 新規項目

ロードマップに以下の項目を**追加**しました。

*   🆕 コンパイラ: [Kotlin/Wasm: 新しいスレッド提案を使用したマルチスレッドサポートのプロトタイプ作成](https://youtrack.jetbrains.com/issue/KT-80304)
*   🆕 マルチプラットフォーム: [Swift Exportでのコルーチンサポート](https://youtrack.jetbrains.com/issue/KT-80305)
*   🆕 マルチプラットフォーム: [Kotlin/JS: 最新のJavaScriptへのコンパイル](https://youtrack.jetbrains.com/issue/KT-80308)
*   🆕 マルチプラットフォーム: [Kotlin/JS: Kotlin宣言をJavaScriptにエクスポートする可能性を拡張](https://youtrack.jetbrains.com/issue/KT-80310)
*   🆕 マルチプラットフォーム: [Kotlin/JS: Kotlin/JSのオンボーディング資料を改善](https://youtrack.jetbrains.com/issue/KT-80307)
*   🆕 ツール: [Kotlin LSPとVS Codeのサポート](https://youtrack.jetbrains.com/issue/KT-80322)
*   🆕 ツール: [Kotlin + JPAエクスペリエンスを改善](https://youtrack.jetbrains.com/issue/KTIJ-35208)
*   🆕 ツール: [Gradleプロジェクト分離でのKotlin JS\WASMのサポート](https://youtrack.jetbrains.com/issue/KT-80311)
*   🆕 ツール: [Kotlin Notebooks: 新しいユースケースをサポート](https://youtrack.jetbrains.com/issue/KTNB-1133)
*   🆕 エコシステム: [KDocの機械可読表現を実装](https://youtrack.jetbrains.com/issue/KT-80323)
*   🆕 エコシステム: [Kotlin Notebooksを安定化](https://youtrack.jetbrains.com/issue/KT-80324)
*   🆕 エコシステム: [Kotlin DataFrame 1.0をリリース](https://youtrack.jetbrains.com/issue/KT-80327)
*   🆕 エコシステム: [Kandy 0.9をリリース](https://youtrack.jetbrains.com/issue/KT-80328)
*   🆕 エコシステム: [Ktor ClientおよびServerアプリケーション向けのOpenAPI仕様のサポート](https://youtrack.jetbrains.com/issue/KTOR-8316)
*   🆕 エコシステム: [Ktorの管理と可観測性を改善](https://youtrack.jetbrains.com/issue/KTOR-6622)
*   🆕 エコシステム: [WebRTCクライアント](https://youtrack.jetbrains.com/issue/KTOR-7958)

### 削除された項目

ロードマップから以下の項目を**削除**しました。

*   ❌ コンパイラ: [`wasm-wasi`ライブラリのターゲットをWASI Preview 2に切り替え](https://youtrack.jetbrains.com/issue/KT-64568)
*   ❌ コンパイラ: [コンポーネントモデルのサポート](https://youtrack.jetbrains.com/issue/KT-64569)
*   ❌ エコシステム: [Snapへの公開](https://youtrack.jetbrains.com/issue/KTOR-3937)

> いくつかの項目はロードマップから削除されましたが、完全に中止されたわけではありません。場合によっては、以前のロードマップ項目が現在の項目と統合されています。
>
{style="note"}