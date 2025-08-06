[//]: # (title: Kotlinロードマップ)

<table>
    <tr>
        <td><strong>最終更新日</strong></td>
        <td><strong>2025年2月</strong></td>
    </tr>
    <tr>
        <td><strong>次回の更新</strong></td>
        <td><strong>2025年8月</strong></td>
    </tr>
</table>

Kotlinロードマップへようこそ！JetBrainsチームの優先事項をいち早くご紹介します。

## 主要な優先事項

このロードマップの目的は、全体像を把握していただくことです。
以下は、私たちが提供に注力している最も重要な方向性である、主要な重点分野のリストです。

*   **言語の進化**: より効率的なデータ処理、抽象化の向上、明確なコードによるパフォーマンス強化。
*   **Kotlin Multiplatform**: KotlinからSwiftへの直接エクスポートのリリース、ビルド設定の合理化、マルチプラットフォームライブラリ作成の簡素化。
*   **サードパーティエコシステムの開発者体験**: Kotlinライブラリ、ツール、フレームワークの開発および公開プロセスの簡素化。

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
            <p><a href="kotlin-language-features-and-proposals.md">Kotlin言語の機能と提案の全リスト</a>を参照するか、<a href="https://youtrack.jetbrains.com/issue/KT-54620">今後の言語機能に関するYouTrackイシュー</a>をフォローしてください。</p>
        </td>
    </tr>
    <tr id="compiler">
        <td><strong>コンパイラ</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75371">JSpecifyサポートの最終化</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75372">K1コンパイラの非推奨化</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75370">Kotlin/Wasm (<code>wasm-js</code>ターゲット) をベータ版に昇格</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64568" target="_blank">Kotlin/Wasm: ライブラリの<code>wasm-wasi</code>ターゲットをWASI Preview 2に切り替え</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64569" target="_blank">Kotlin/Wasm: コンポーネントモデルのサポート</a></li>
            </list>
        </td>
    </tr>
    <tr id="multiplatform">
        <td><strong>マルチプラットフォーム</strong></td>
        <td>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64572">Swift Exportの初回パブリックリリース</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71278">Concurrent Mark and Sweep (CMS) GCをデフォルトで有効化</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71290">異なるプラットフォーム間でのklibクロスコンパイルを安定化</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71281">次世代のマルチプラットフォームライブラリ配布フォーマットを実装</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71289">プロジェクトレベルでのKotlin Multiplatform依存関係の宣言をサポート</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64570" target="_blank">すべてのKotlinターゲット間でインラインセマンティクスを統一</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71279" target="_blank">klibアーティファクトのインクリメンタルコンパイルをデフォルトで有効化</a></li>
            </list>
            <tip><p><a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-roadmap.html" target="_blank">Kotlin Multiplatform開発ロードマップ</a></p></tip>
         </td>
    </tr>
    <tr id="tooling">
        <td><strong>ツール</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75374" target="_blank">IntelliJ IDEAにおけるKotlin/Wasmプロジェクトの開発体験を向上</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75376" target="_blank">インポートのパフォーマンスを向上</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75377" target="_blank">XCFrameworksでのリソースをサポート</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTNB-898" target="_blank">Kotlin Notebook: よりスムーズなアクセスと体験の向上</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-31316" target="_blank">IntelliJ IDEA K2モードの完全リリース</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71286" target="_blank">ビルドツールAPIの設計</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71292" target="_blank">宣言型GradleをサポートするKotlinエコシステムプラグイン</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-54105" target="_blank">Gradleプロジェクト分離をサポート</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64577" target="_blank">Kotlin/NativeツールチェーンのGradleへの統合を改善</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-60279" target="_blank">Kotlinビルドレポートを改善</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-55515" target="_blank">Gradle DSLで安定したコンパイラ引数を公開</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">Kotlinスクリプトと<code>.gradle.kts</code>の使用体験を向上</a></li>
            </list>
         </td>
    </tr>
    <tr id="library-ecosystem">
        <td><strong>ライブラリエコシステム</strong></td>
        <td>
            <p><b>ライブラリエコシステムのロードマップ項目:</b></p>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71295" target="_blank">Dokka HTML出力UIを洗練</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-12719" target="_blank">非ユニット値を返すKotlin関数の未使用に対するデフォルトの警告/エラーを導入</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71298" target="_blank">標準ライブラリ用の新しいマルチプラットフォームAPI: Unicodeとコードポイントのサポート</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71300" target="_blank"><code>kotlinx-io</code>ライブラリを安定化</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71297" target="_blank">Kotlin配布のUXを改善: コードカバレッジとバイナリ互換性検証を追加</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64578" target="_blank"><code>kotlinx-datetime</code>をベータ版に昇格</a></li>
            </list>
            <p><b>Ktor:</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-1501">ジェネレータプラグインとチュートリアルによるKtorへのgRPCサポート追加</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-7158">バックエンドアプリケーションのプロジェクト構造をシンプルに</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-3937">CLIジェネレータをSNAPに公開</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-6026">Kubernetesジェネレータプラグインの作成</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-6621">依存性注入の使用をシンプルに</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-7938">HTTP/3サポート</a></li>
            </list>
            <p><b>Exposed:</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-444">1.0.0のリリース</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-74">R2DBCサポートの追加</a></li>
            </list>
         </td>
    </tr>
</table>

> * このロードマップは、チームが取り組んでいるすべてのことの網羅的なリストではなく、最大のプロジェクトのみを記載しています。
> * 特定のバージョンで特定の機能や修正を提供することを保証するものではありません。
> * 私たちは進捗に応じて優先順位を調整し、約6ヶ月ごとにロードマップを更新します。
> 
{style="note"}

## 2024年9月からの変更点

### 完了した項目

前回のロードマップから以下の項目を**完了**しました。

*   ✅ コンパイラ: [Androidでのインライン関数のデバッグをサポート](https://youtrack.jetbrains.com/issue/KT-60276)
*   ✅ コンパイラ: [コンパイラ診断の品質を改善](https://youtrack.jetbrains.com/issue/KT-71275)
*   ✅ マルチプラットフォーム: [KotlinでXcode 16をサポート](https://youtrack.jetbrains.com/issue/KT-71287)
*   ✅ マルチプラットフォーム: [Kotlin Gradleプラグインの公開APIリファレンスを公開](https://youtrack.jetbrains.com/issue/KT-71288)
*   ✅ ツール: [Kotlin/Wasmターゲット向けに箱から出してすぐに使えるデバッグ体験を提供](https://youtrack.jetbrains.com/issue/KT-71276)
*   ✅ ライブラリエコシステム: [Dokkatooベースの新しいDokka Gradleプラグインを実装](https://youtrack.jetbrains.com/issue/KT-71293)
*   ✅ ライブラリエコシステム: [標準ライブラリ用の新しいマルチプラットフォームAPI: アトミック](https://youtrack.jetbrains.com/issue/KT-62423)
*   ✅ ライブラリエコシステム: [ライブラリ開発者向けガイドラインを拡充](https://youtrack.jetbrains.com/issue/KT-71299)

### 新規項目

ロードマップに以下の項目を**追加**しました。

*   🆕 コンパイラ: [JSpecifyサポートの最終化](https://youtrack.jetbrains.com/issue/KT-75371)
*   🆕 コンパイラ: [K1コンパイラの非推奨化](https://youtrack.jetbrains.com/issue/KT-75372)
*   🆕 コンパイラ: [Kotlin/Wasm (`wasm-js`ターゲット) をベータ版に昇格](https://youtrack.jetbrains.com/issue/KT-75370)
*   🆕 ツール: [IntelliJ IDEAにおけるKotlin/Wasmプロジェクトの開発体験を向上](https://youtrack.jetbrains.com/issue/KT-75374)
*   🆕 ツール: [インポートのパフォーマンスを向上](https://youtrack.jetbrains.com/issue/KT-75376)
*   🆕 ツール: [XCFrameworksでのリソースをサポート](https://youtrack.jetbrains.com/issue/KT-75377)
*   🆕 ツール: [Kotlin Notebookでよりスムーズなアクセスと体験の向上](https://youtrack.jetbrains.com/issue/KTNB-898)
*   🆕 Ktor: [ジェネレータプラグインとチュートリアルによるKtorへのgRPCサポート追加](https://youtrack.jetbrains.com/issue/KTOR-1501)
*   🆕 Ktor: [バックエンドアプリケーションのプロジェクト構造をシンプルに](https://youtrack.jetbrains.com/issue/KTOR-7158)
*   🆕 Ktor: [CLIジェネレータをSNAPに公開](https://youtrack.jetbrains.com/issue/KTOR-3937)
*   🆕 Ktor: [Kubernetesジェネレータプラグインの作成](https://youtrack.jetbrains.com/issue/KTOR-6026)
*   🆕 Ktor: [依存性注入の使用をシンプルに](https://youtrack.jetbrains.com/issue/KTOR-6621)
*   🆕 Ktor: [HTTP/3サポート](https://youtrack.jetbrains.com/issue/KTOR-7938)
*   🆕 Exposed: [1.0.0のリリース](https://youtrack.jetbrains.com/issue/EXPOSED-444)
*   🆕 Exposed: [R2DBCサポートの追加](https://youtrack.jetbrains.com/issue/EXPOSED-74)

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

その他、以前に特定されたすべてのロードマップ項目は進行中です。最新情報については、それらの[YouTrackチケット](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20)をご確認ください。